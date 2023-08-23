import { keccak256, pack } from "@ethersproject/solidity";
import { ChainId } from "../../chain";
import { getReservesAbi } from "../../abi";
import { Token } from "../../currency";
// import { PrismaClient } from "@prisma/client";
import { BASES_TO_CHECK_TRADES_AGAINST } from "../config/bases-to-check-trades-against";
import { ConstantProductRPool, RToken } from "../../tines";
import { add, getUnixTime } from "date-fns";
import { BigNumber } from "ethers";
import { getCreate2Address } from "ethers/lib/utils";
import { Address, PublicClient } from "viem";

import { getCurrencyCombinations } from "../getCurrencyCombinations";
import {
  filterOnDemandPools,
  filterTopPools,
  mapToken,
  PoolResponse2,
} from "../lib/api";
import { ConstantProductPoolCode } from "../pools/ConstantProductPool";
import type { PoolCode } from "../pools/PoolCode";
import { LiquidityProvider, LiquidityProviders } from "./LiquidityProvider";
interface PoolInfo {
  poolCode: PoolCode;
  validUntilTimestamp: number;
}

interface StaticPool {
  address: string;
  token0: Token;
  token1: Token;
  fee: number;
}

export abstract class UniswapV2BaseProvider extends LiquidityProvider {
  readonly TOP_POOL_SIZE = 155;
  readonly TOP_POOL_LIQUIDITY_THRESHOLD = 5000;
  readonly ON_DEMAND_POOL_SIZE = 20;
  readonly REFRESH_INITIAL_POOLS_INTERVAL = 60; // SECONDS

  topPools: Map<string, PoolCode> = new Map();
  poolsByTrade: Map<string, string[]> = new Map();
  onDemandPools: Map<string, PoolInfo> = new Map();
  availablePools: Map<string, PoolResponse2> = new Map();
  staticPools: Map<string, PoolResponse2> = new Map();

  blockListener?: () => void;
  unwatchBlockNumber?: () => void;

  fee = 0.003;
  isInitialized = false;
  factory: { [chainId: number]: Address } = {};
  initCodeHash: { [chainId: number]: string } = {};
  latestPoolCreatedAtTimestamp = new Date();
  discoverNewPoolsTimestamp = getUnixTime(
    add(Date.now(), { seconds: this.REFRESH_INITIAL_POOLS_INTERVAL })
  );
  refreshAvailablePoolsTimestamp = getUnixTime(
    add(Date.now(), { seconds: this.FETCH_AVAILABLE_POOLS_AFTER_SECONDS })
  );
  // databaseClient: PrismaClient | undefined;

  constructor(
    chainId: ChainId,
    web3Client: PublicClient,
    factory: { [chainId: number]: Address },
    initCodeHash: { [chainId: number]: string }
    // databaseClient?: PrismaClient
  ) {
    super(chainId, web3Client);
    this.factory = factory;
    this.initCodeHash = initCodeHash;
    if (!(chainId in this.factory) || !(chainId in this.initCodeHash)) {
      throw new Error(
        `${this.getType()} cannot be instantiated for chainid ${chainId}, no factory or initCodeHash`
      );
    }
    // this.databaseClient = databaseClient;
  }

  async initialize() {
    // TODO: retry logic, every X seconds? dont flag as true until the end of the function ideally. add isInitalizing? to avoid it being called twice before completed.
    this.isInitialized = true;
    const availablePools = await this.getInitialPools();
    //console.debug(`${this.getLogPrefix()} - TOTAL POOLS: ${availablePools.size}`)

    this.availablePools = availablePools;

    const topPools = filterTopPools(
      Array.from(availablePools.values()),
      this.TOP_POOL_SIZE
    );

    if (topPools.length > 0) {
      //console.debug(`${this.getLogPrefix()} - INIT: top pools found: ${topPools.length}`)
    } else {
      //console.debug(`${this.getLogPrefix()} - INIT: NO pools found.`)
      return [];
    }

    const results: any = await this.client
      .multicall({
        multicallAddress: this.client.chain?.contracts?.multicall3
          ?.address as Address,
        allowFailure: true,
        contracts: topPools.map(
          (pool: any) =>
            ({
              address: pool.address as Address,
              chainId: this.chainId,
              abi: getReservesAbi,
              functionName: "getReserves",
            } as const)
        ),
      })
      .catch((e) => {
        console.warn(
          `${this.getLogPrefix()} - INIT: multicall failed, message: ${
            e.message
          }`
        );
        return undefined;
      });

    topPools.forEach((pool: any, i: number) => {
      const res0 = results?.[i]?.result?.[0];
      const res1 = results?.[i]?.result?.[1];

      if (res0 && res1) {
        const token0 = mapToken(this.chainId, pool.token0) as RToken;
        const token1 = mapToken(this.chainId, pool.token1) as RToken;
        const rPool = new ConstantProductRPool(
          pool.address,
          token0,
          token1,
          this.fee,
          BigNumber.from(res0),
          BigNumber.from(res1)
        );
        const pc = new ConstantProductPoolCode(
          rPool,
          this.getType(),
          this.getPoolProviderName()
        );
        this.topPools.set(pool.address, pc);
      } else {
        console.error(
          `${this.getLogPrefix()} - ERROR INIT SYNC, Failed to fetch reserves for pool: ${
            pool.address
          }`
        );
      }
    });

    //console.debug(`${this.getLogPrefix()} - INIT, WATCHING ${this.topPools.size} POOLS`)
  }

  private async getInitialPools(): Promise<Map<string, PoolResponse2>> {
    // if (this.databaseClient) {
    //   const pools = await getAllPools(
    //     this.databaseClient,
    //     this.chainId,
    //     this.getType(),
    //     this.getType() === LiquidityProviders.SushiSwapV2 ? "LEGACY" : "V2",
    //     ["CONSTANT_PRODUCT_POOL"]
    //   );
    //   return pools;
    // }
    return new Map();
  }

  async getOnDemandPools(
    t0: Token,
    t1: Token,
    excludePools?: Set<string>
  ): Promise<void> {
    const topPoolAddresses = Array.from(this.topPools.keys());
    let pools =
      topPoolAddresses.length > 0
        ? filterOnDemandPools(
            Array.from(this.availablePools.values()),
            t0.address,
            t1.address,
            topPoolAddresses,
            this.ON_DEMAND_POOL_SIZE
          )
        : this.getStaticPools(t0, t1);
    if (excludePools)
      pools = (pools as StaticPool[]).filter(
        (p) => !excludePools.has(p.address)
      );
    if (pools.length === 0) {
      //console.info(`${this.getLogPrefix()} - No on demand pools found for ${t0.symbol}/${t1.symbol}`)
      return;
    }

    this.poolsByTrade.set(
      this.getTradeId(t0, t1),
      pools.map((pool: any) => pool.address)
    );
    const validUntilTimestamp = getUnixTime(
      add(Date.now(), { seconds: this.ON_DEMAND_POOLS_LIFETIME_IN_SECONDS })
    );

    let created = 0;
    let updated = 0;
    const poolCodesToCreate: PoolCode[] = [];
    pools.forEach((pool: any) => {
      const existingPool = this.onDemandPools.get(pool.address);
      if (existingPool === undefined) {
        const token0 = pool.token0 as RToken;
        const token1 = pool.token1 as RToken;

        const rPool = new ConstantProductRPool(
          pool.address,
          token0,
          token1,
          this.fee,
          BigNumber.from(0),
          BigNumber.from(0)
        );
        const pc = new ConstantProductPoolCode(
          rPool,
          this.getType(),
          this.getPoolProviderName()
        );
        poolCodesToCreate.push(pc);
      } else {
        existingPool.validUntilTimestamp = validUntilTimestamp;
        ++updated;
      }
    });

    const reserves = await this.client
      .multicall({
        multicallAddress: this.client.chain?.contracts?.multicall3
          ?.address as Address,
        allowFailure: true,
        contracts: poolCodesToCreate.map(
          (poolCode) =>
            ({
              address: poolCode.pool.address as Address,
              chainId: this.chainId,
              abi: getReservesAbi,
              functionName: "getReserves",
            } as const)
        ),
      })
      .catch((e) => {
        console.warn(
          `${this.getLogPrefix()} - UPDATE: on-demand pools multicall failed, message: ${
            e.message
          }`
        );
        return undefined;
      });

    poolCodesToCreate.forEach((poolCode, i) => {
      const pool = poolCode.pool;
      const res0 = reserves?.[i]?.result?.[0];
      const res1 = reserves?.[i]?.result?.[1];

      if (res0 !== undefined && res1 !== undefined) {
        pool.updateReserves(BigNumber.from(res0), BigNumber.from(res1));
        this.onDemandPools.set(pool.address, { poolCode, validUntilTimestamp });
        // console.debug(
        //   `${this.getLogPrefix()} - ON DEMAND CREATION: ${pool.address} (${pool.token0.symbol}/${pool.token1.symbol})`
        // )
        ++created;
      } else {
        // Pool doesn't exist?
        // console.error(`${this.getLogPrefix()} - ERROR FETCHING RESERVES, initialize on demand pool: ${pool.address}`)
      }
    });

    // console.debug(
    //   `${this.getLogPrefix()} - ON DEMAND: Created and fetched reserves for ${created} pools, extended 'lifetime' for ${updated} pools`
    // )
  }

  async updatePools() {
    if (this.isInitialized) {
      this.removeStalePools();
      // The two calls below are Async functions, but we do not want them to block. If they find any pools they will be updated next interval
      this.discoverNewPools();
      this.updateAvailablePools();

      const initialPools = Array.from(this.topPools.values());
      const onDemandPools = Array.from(this.onDemandPools.values()).map(
        (pi) => pi.poolCode
      );

      if (initialPools.length === 0 && onDemandPools.length === 0) {
        return;
      }

      const [initialPoolsReserves, onDemandPoolsReserves] = await Promise.all([
        this.client
          .multicall({
            multicallAddress: this.client.chain?.contracts?.multicall3
              ?.address as Address,
            allowFailure: true,
            contracts: initialPools.map(
              (poolCode) =>
                ({
                  address: poolCode.pool.address as Address,
                  chainId: this.chainId,
                  abi: getReservesAbi,
                  functionName: "getReserves",
                } as const)
            ),
          })
          .catch((e) => {
            console.warn(
              `${this.getLogPrefix()} - UPDATE: initPools multicall failed, message: ${
                e.message
              }`
            );
            return undefined;
          }),
        this.client
          .multicall({
            multicallAddress: this.client.chain?.contracts?.multicall3
              ?.address as Address,
            allowFailure: true,
            contracts: onDemandPools.map(
              (poolCode) =>
                ({
                  address: poolCode.pool.address as Address,
                  chainId: this.chainId,
                  abi: getReservesAbi,
                  functionName: "getReserves",
                } as const)
            ),
          })
          .catch((e) => {
            console.warn(
              `${this.getLogPrefix()} - UPDATE: on-demand pools multicall failed, message: ${
                e.message
              }`
            );
            return undefined;
          }),
      ]);

      this.updatePoolWithReserves(
        initialPools,
        initialPoolsReserves,
        "INITIAL"
      );
      this.updatePoolWithReserves(
        onDemandPools,
        onDemandPoolsReserves,
        "ON_DEMAND"
      );
    }
  }

  private async discoverNewPools() {
    return;
    // if (!this.databaseClient) return;
    // if (this.discoverNewPoolsTimestamp > getUnixTime(Date.now())) {
    //   return;
    // }

    // this.discoverNewPoolsTimestamp = getUnixTime(
    //   add(Date.now(), { seconds: this.REFRESH_INITIAL_POOLS_INTERVAL })
    // );

    // const newDate = new Date();
    // const discoveredPools = await discoverNewPools(
    //   this.databaseClient,
    //   this.chainId,
    //   this.getType(),
    //   this.getType() === LiquidityProviders.SushiSwapV2 ? "LEGACY" : "V2",
    //   ["CONSTANT_PRODUCT_POOL"],
    //   this.latestPoolCreatedAtTimestamp
    // );

    // if (discoveredPools.size > 0) {
    //   let addedPools = 0;
    //   this.latestPoolCreatedAtTimestamp = newDate;
    //   discoveredPools.forEach((pool: any) => {
    //     if (!this.availablePools.has(pool.address)) {
    //       this.availablePools.set(pool.address, pool);
    //       addedPools++;
    //     }
    //   });
    //   if (addedPools > 0) {
    //     this.prioritizeTopPools();
    //   }
    // }

    // console.debug(
    //   `* MEM ${this.getLogPrefix()} INIT COUNT: ${this.topPools.size} ON DEMAND COUNT: ${this.onDemandPools.size}`
    // )
  }

  private async updateAvailablePools() {
    if (this.refreshAvailablePoolsTimestamp > getUnixTime(Date.now())) {
      return;
    }

    this.refreshAvailablePoolsTimestamp = getUnixTime(
      add(Date.now(), { seconds: this.FETCH_AVAILABLE_POOLS_AFTER_SECONDS })
    );

    const freshInitPools = await this.getInitialPools();

    freshInitPools.forEach((updatedPool) => {
      // Don't do `this.availablePools = freshInitPools`, in case the db requests for any reason fail, it shouldn't be completely overwritten.
      this.availablePools.set(updatedPool.address, updatedPool);
    });
    this.prioritizeTopPools();
  }

  private prioritizeTopPools() {
    const newTopPools = filterTopPools(
      Array.from(this.availablePools.values()),
      this.TOP_POOL_SIZE
    );

    const currentTopPoolAddresses = Array.from(this.topPools.keys());
    const newTopPoolAddresses = Array.from(
      newTopPools.map((pool: any) => pool.address)
    );
    const poolsToRemove = currentTopPoolAddresses.filter(
      (x) => !newTopPoolAddresses.includes(x)
    );
    const poolsToAdd = newTopPoolAddresses.filter(
      (x: any) => !currentTopPoolAddresses.includes(x)
    );

    poolsToRemove.forEach((address) => {
      this.topPools.delete(address);
      //console.log(`${this.getLogPrefix()} - PRIORITIZE POOLS: Removed ${address} from top pools`)
    });

    poolsToAdd.forEach((address: any) => {
      const poolsToCreate = this.availablePools.get(address);
      if (poolsToCreate) {
        const token0 = mapToken(this.chainId, poolsToCreate.token0) as RToken;
        const token1 = mapToken(this.chainId, poolsToCreate.token1) as RToken;
        const rPool = new ConstantProductRPool(
          poolsToCreate.address,
          token0,
          token1,
          this.fee,
          BigNumber.from(0),
          BigNumber.from(0)
        );
        const pc = new ConstantProductPoolCode(
          rPool,
          this.getType(),
          this.getPoolProviderName()
        );
        this.topPools.set(poolsToCreate.address, pc);

        //console.log(`${this.getLogPrefix()} - PRIORITIZE POOLS: Added ${address} to top pools`)
      } else {
        console.warn(
          `${this.getLogPrefix()} - PRIORITIZE POOLS: Could not find pool, unexpected state.`
        );
      }
    });
  }

  private updatePoolWithReserves(
    pools: PoolCode[],
    reserves:
      | (
          | {
              error: Error;
              result?: undefined;
              status: "failure";
            }
          | {
              error?: undefined;
              result: readonly [bigint, bigint, number];
              status: "success";
            }
        )[]
      | undefined,
    type: "INITIAL" | "ON_DEMAND"
  ) {
    if (!reserves) return;
    pools.forEach((poolCode, i) => {
      const pool = poolCode.pool;
      const res0 = reserves?.[i]?.result?.[0];
      const res1 = reserves?.[i]?.result?.[1];

      if (res0 && res1) {
        const res0BN = BigNumber.from(res0);
        const res1BN = BigNumber.from(res1);
        if (!pool.reserve0.eq(res0BN) || !pool.reserve1.eq(res1BN)) {
          pool.updateReserves(res0BN, res1BN);
          // console.info(
          //   `${this.getLogPrefix()} - SYNC, ${type}: ${pool.address} ${pool.token0.symbol}/${
          //     pool.token1.symbol
          //   } ${res0BN.toString()} ${res1BN.toString()}`
          // )
        }
      } else {
        // console.error(
        //   `${this.getLogPrefix()} - ERROR UPDATING RESERVES for a ${type} pool, Failed to fetch reserves for pool: ${
        //     pool.address
        //   }`
        // );
      }
    });
  }

  _getPoolAddress(t1: Token, t2: Token): string {
    return getCreate2Address(
      this.factory[this.chainId as keyof typeof this.factory],
      keccak256(
        ["bytes"],
        [pack(["address", "address"], [t1.address, t2.address])]
      ),
      this.initCodeHash[this.chainId as keyof typeof this.initCodeHash]
    );
  }

  // TODO: Decide if this is worth keeping as fallback in case fetching top pools fails? only used on initial load.
  _getProspectiveTokens(t0: Token, t1: Token) {
    const set = new Set<Token>([
      t0,
      t1,
      ...BASES_TO_CHECK_TRADES_AGAINST[this.chainId],
    ]);
    return Array.from(set);
  }

  getStaticPools(t1: Token, t2: Token): StaticPool[] {
    const currencyCombination = getCurrencyCombinations(
      this.chainId,
      t1,
      t2
    ).map(([c0, c1]) => (c0.sortsBefore(c1) ? [c0, c1] : [c1, c0]));
    return currencyCombination.map((combination) => ({
      address: this._getPoolAddress(combination[0], combination[1]),
      token0: combination[0],
      token1: combination[1],
      fee: this.fee,
    }));
    // return pools
  }

  startFetchPoolsData() {
    this.stopFetchPoolsData();
    this.topPools = new Map();
    this.unwatchBlockNumber = this.client.watchBlockNumber({
      onBlockNumber: (blockNumber) => {
        this.lastUpdateBlock = Number(blockNumber);
        if (!this.isInitialized) {
          this.initialize();
        } else {
          this.updatePools();
        }
      },
      onError: (error) => {
        console.error(
          `${this.getLogPrefix()} - Error watching block number: ${
            error.message
          }`
        );
      },
    });
  }

  private removeStalePools() {
    let removed = 0;
    const now = getUnixTime(Date.now());
    for (const poolInfo of this.onDemandPools.values()) {
      if (poolInfo.validUntilTimestamp < now) {
        this.onDemandPools.delete(poolInfo.poolCode.pool.address);
        removed++;
      }
    }
    if (removed > 0) {
      //console.log(`${this.getLogPrefix()} STALE: Removed ${removed} stale pools`)
    }
  }

  async fetchPoolsForToken(
    t0: Token,
    t1: Token,
    excludePools?: Set<string>
  ): Promise<void> {
    await this.getOnDemandPools(t0, t1, excludePools);
  }

  /**
   * The pools returned are the initial pools, plus any on demand pools that have been fetched for the two tokens.
   * @param t0
   * @param t1
   * @returns
   */
  getCurrentPoolList(t0: Token, t1: Token): PoolCode[] {
    const tradeId = this.getTradeId(t0, t1);
    const poolsByTrade = this.poolsByTrade.get(tradeId) ?? [];
    const onDemandPoolCodes = poolsByTrade
      ? Array.from(this.onDemandPools)
          .filter(([poolAddress]) => poolsByTrade.includes(poolAddress))
          .map(([, p]) => p.poolCode)
      : [];

    return [...this.topPools.values(), onDemandPoolCodes].flat();
  }

  stopFetchPoolsData() {
    if (this.unwatchBlockNumber) this.unwatchBlockNumber();
    this.blockListener = undefined;
  }
}
