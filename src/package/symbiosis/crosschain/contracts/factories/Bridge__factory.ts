/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { Bridge, BridgeInterface } from "../Bridge";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "oldMPC",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newMPC",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "effectiveTime",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "chainId",
        type: "uint256",
      },
    ],
    name: "LogChangeMPC",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "bridge",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "callData",
        type: "bytes",
      },
      {
        indexed: false,
        internalType: "address",
        name: "receiveSide",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "oppositeBridge",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "chainId",
        type: "uint256",
      },
    ],
    name: "OracleRequest",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "admin",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "permission",
        type: "bool",
      },
    ],
    name: "SetAdminPermission",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "transmitter",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "status",
        type: "bool",
      },
    ],
    name: "SetTransmitterStatus",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_newMPC",
        type: "address",
      },
    ],
    name: "changeMPC",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_newMPC",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "signature",
        type: "bytes",
      },
    ],
    name: "changeMPCSigned",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "currentChainId",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_mpc",
        type: "address",
      },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "isAdmin",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "isTransmitter",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "mpc",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "newMPC",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "newMPCEffectiveTime",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "oldMPC",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "_callData",
        type: "bytes",
      },
      {
        internalType: "address",
        name: "_receiveSide",
        type: "address",
      },
    ],
    name: "receiveRequestV2",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "_callData",
        type: "bytes",
      },
      {
        internalType: "address",
        name: "_receiveSide",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "signature",
        type: "bytes",
      },
    ],
    name: "receiveRequestV2Signed",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_user",
        type: "address",
      },
      {
        internalType: "bool",
        name: "_permission",
        type: "bool",
      },
    ],
    name: "setAdminPermission",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_transmitter",
        type: "address",
      },
      {
        internalType: "bool",
        name: "_status",
        type: "bool",
      },
    ],
    name: "setTransmitterStatus",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "_callData",
        type: "bytes",
      },
      {
        internalType: "address",
        name: "_receiveSide",
        type: "address",
      },
      {
        internalType: "address",
        name: "_oppositeBridge",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_chainId",
        type: "uint256",
      },
    ],
    name: "transmitRequestV2",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "withdrawFee",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b50611946806100206000396000f3fe608060405234801561001057600080fd5b50600436106101515760003560e01c80636fac3007116100cd578063c00f8a3d11610081578063f2fde38b11610066578063f2fde38b146102bf578063f75c2664146102d2578063f7f1baf0146102da57600080fd5b8063c00f8a3d14610299578063c4d66de8146102ac57600080fd5b806375f3974b116100b257806375f3974b1461026257806384d61c97146102755780638da5cb5b1461028857600080fd5b80636fac300714610237578063715018a61461025a57600080fd5b8063405fb4f7116101245780635b7b018c116101095780635b7b018c1461020b5780636cbadbfa1461021e5780636cebc9c21461022457600080fd5b8063405fb4f7146101c9578063474a245a146101e057600080fd5b80631095b6d71461015657806319117d931461017e57806324d7806c1461019357806338899935146101b6575b600080fd5b61016961016436600461144e565b6102ed565b60405190151581526020015b60405180910390f35b61019161018c36600461148a565b61038d565b005b6101696101a1366004611433565b60656020526000908152604090205460ff1681565b6101696101c43660046114c1565b610447565b6101d260685481565b604051908152602001610175565b6066546101f3906001600160a01b031681565b6040516001600160a01b039091168152602001610175565b610169610219366004611433565b610516565b466101d2565b6101916102323660046115bc565b6105d1565b610169610245366004611433565b60696020526000908152604090205460ff1681565b610191610675565b61019161027036600461148a565b6106db565b610191610283366004611622565b61078d565b6033546001600160a01b03166101f3565b6067546101f3906001600160a01b031681565b6101916102ba366004611433565b610822565b6101916102cd366004611433565b610959565b6101f3610a3b565b6101916102e836600461156e565b610a66565b6000336103026033546001600160a01b031690565b6001600160a01b0316148061032657503360009081526065602052604090205460ff165b6103775760405162461bcd60e51b815260206004820152601c60248201527f4f6e6c79206f776e6572206f722061646d696e2063616e2063616c6c0000000060448201526064015b60405180910390fd5b610382848484610ad8565b5060015b9392505050565b6033546001600160a01b031633146103e75760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604482015260640161036e565b6001600160a01b038216600081815260696020908152604091829020805460ff191685151590811790915591519182527feeec8b4e2d317fc608f301f859237a6081b9813f150a3fcfb02fd54276c8be4091015b60405180910390a25050565b6040517f6368616e67654d5043000000000000000000000000000000000000000000000060208201526bffffffffffffffffffffffff19606084901b166029820152600090603d0160405160208183030381529060405280519060200120826104b86104b1610a3b565b8383610c40565b6105045760405162461bcd60e51b815260206004820152601b60248201527f42726964676556323a20696e76616c6964207369676e61747572650000000000604482015260640161036e565b61050d85610dea565b95945050505050565b600033610521610a3b565b6001600160a01b0316148061054f5750336105446033546001600160a01b031690565b6001600160a01b0316145b6105c05760405162461bcd60e51b8152602060048201526024808201527f42726964676556323a206f6e6c79206f776e6572206f72204d50432063616e2060448201527f63616c6c00000000000000000000000000000000000000000000000000000000606482015260840161036e565b6105c982610dea565b90505b919050565b3360009081526069602052604090205460ff166106305760405162461bcd60e51b815260206004820152601b60248201527f42726964676556323a206e6f742061207472616e736d69747465720000000000604482015260640161036e565b7f532dbb6d061eee97ab4370060f60ede10b3dc361cc1214c07ae5e34dd86e6aaf30858585856040516106679594939291906117ac565b60405180910390a150505050565b6033546001600160a01b031633146106cf5760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604482015260640161036e565b6106d96000610ecf565b565b6033546001600160a01b031633146107355760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604482015260640161036e565b6001600160a01b038216600081815260656020908152604091829020805460ff191685151590811790915591519182527f0e7bea53cb2b3130dd1aac8d56b61cc8da7ebab0432e2d1622513523d848f2e7910161043b565b828260601b6040516020016107a392919061174c565b60405160208183030381529060405280519060200120816107c56104b1610a3b565b6108115760405162461bcd60e51b815260206004820152601b60248201527f42726964676556323a20696e76616c6964207369676e61747572650000000000604482015260640161036e565b61081b8585610f2e565b5050505050565b600054610100900460ff1661083d5760005460ff1615610841565b303b155b6108b35760405162461bcd60e51b815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201527f647920696e697469616c697a6564000000000000000000000000000000000000606482015260840161036e565b600054610100900460ff161580156108f257600080547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0000166101011790555b6108fa61105b565b6066805473ffffffffffffffffffffffffffffffffffffffff19166001600160a01b03841617905542606855801561095557600080547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00ff1690555b5050565b6033546001600160a01b031633146109b35760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604482015260640161036e565b6001600160a01b038116610a2f5760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201527f6464726573730000000000000000000000000000000000000000000000000000606482015260840161036e565b610a3881610ecf565b50565b60006068544210610a5657506066546001600160a01b031690565b506067546001600160a01b031690565b610a6e610a3b565b6001600160a01b0316336001600160a01b031614610ace5760405162461bcd60e51b815260206004820152601360248201527f42726964676556323a20666f7262696464656e00000000000000000000000000604482015260640161036e565b6109558282610f2e565b604080516001600160a01b038481166024830152604480830185905283518084039091018152606490920183526020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff167fa9059cbb000000000000000000000000000000000000000000000000000000001790529151600092839290871691610b629190611730565b6000604051808303816000865af19150503d8060008114610b9f576040519150601f19603f3d011682016040523d82523d6000602084013e610ba4565b606091505b5091509150818015610bce575080511580610bce575080806020019051810190610bce919061150f565b61081b5760405162461bcd60e51b815260206004820152602d60248201527f5472616e7366657248656c7065723a3a736166655472616e736665723a20747260448201527f616e73666572206661696c656400000000000000000000000000000000000000606482015260840161036e565b6000806000610c4f85856110e8565b90925090506000816004811115610c6857610c686118a4565b148015610c865750856001600160a01b0316826001600160a01b0316145b15610c9657600192505050610386565b600080876001600160a01b0316631626ba7e60e01b8888604051602401610cbe9291906117eb565b60408051601f198184030181529181526020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff167fffffffff00000000000000000000000000000000000000000000000000000000909416939093179092529051610d299190611730565b600060405180830381855afa9150503d8060008114610d64576040519150601f19603f3d011682016040523d82523d6000602084013e610d69565b606091505b5091509150818015610d7c575080516020145b8015610dde575080517f1626ba7e0000000000000000000000000000000000000000000000000000000090610dba908301602090810190840161152c565b7fffffffff0000000000000000000000000000000000000000000000000000000016145b98975050505050505050565b60006001600160a01b038216610e425760405162461bcd60e51b815260206004820152601660248201527f42726964676556323a2061646472657373283078302900000000000000000000604482015260640161036e565b610e4a610a3b565b606780546001600160a01b0392831673ffffffffffffffffffffffffffffffffffffffff19918216811790925560668054938616939091168317905542606881905591907fcda32bc39904597666dfa9f9c845714756e1ffffad55b52e0d344673a2198121610eb64690565b60405190815260200160405180910390a4506001919050565b603380546001600160a01b0383811673ffffffffffffffffffffffffffffffffffffffff19831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b6001600160a01b03811660009081526069602052604090205460ff16610f965760405162461bcd60e51b815260206004820152601f60248201527f42726964676556323a20756e74727573746564207472616e736d697474657200604482015260640161036e565b600080826001600160a01b031684604051610fb19190611730565b6000604051808303816000865af19150503d8060008114610fee576040519150601f19603f3d011682016040523d82523d6000602084013e610ff3565b606091505b5091509150816110555761103c816040518060400160405280601581526020017f42726964676556323a2063616c6c206661696c65640000000000000000000000815250611158565b60405162461bcd60e51b815260040161036e919061180c565b50505050565b600054610100900460ff166110d85760405162461bcd60e51b815260206004820152602b60248201527f496e697469616c697a61626c653a20636f6e7472616374206973206e6f74206960448201527f6e697469616c697a696e67000000000000000000000000000000000000000000606482015260840161036e565b6110e061118e565b6106d961120b565b60008082516041141561111f5760208301516040840151606085015160001a61111387828585611291565b94509450505050611151565b825160401415611149576020830151604084015161113e86838361137e565b935093505050611151565b506000905060025b9250929050565b606060448351101561116b575080611188565b600483019250828060200190518101906111859190611696565b90505b92915050565b600054610100900460ff166106d95760405162461bcd60e51b815260206004820152602b60248201527f496e697469616c697a61626c653a20636f6e7472616374206973206e6f74206960448201527f6e697469616c697a696e67000000000000000000000000000000000000000000606482015260840161036e565b600054610100900460ff166112885760405162461bcd60e51b815260206004820152602b60248201527f496e697469616c697a61626c653a20636f6e7472616374206973206e6f74206960448201527f6e697469616c697a696e67000000000000000000000000000000000000000000606482015260840161036e565b6106d933610ecf565b6000807f7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a08311156112c85750600090506003611375565b8460ff16601b141580156112e057508460ff16601c14155b156112f15750600090506004611375565b6040805160008082526020820180845289905260ff881692820192909252606081018690526080810185905260019060a0016020604051602081039080840390855afa158015611345573d6000803e3d6000fd5b5050604051601f1901519150506001600160a01b03811661136e57600060019250925050611375565b9150600090505b94509492505050565b6000807f7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff831660ff84901c601b016113b887828885611291565b935093505050935093915050565b80356001600160a01b03811681146105cc57600080fd5b600082601f8301126113ee57600080fd5b81356114016113fc82611850565b61181f565b81815284602083860101111561141657600080fd5b816020850160208301376000918101602001919091529392505050565b60006020828403121561144557600080fd5b611185826113c6565b60008060006060848603121561146357600080fd5b61146c846113c6565b925061147a602085016113c6565b9150604084013590509250925092565b6000806040838503121561149d57600080fd5b6114a6836113c6565b915060208301356114b681611902565b809150509250929050565b600080604083850312156114d457600080fd5b6114dd836113c6565b9150602083013567ffffffffffffffff8111156114f957600080fd5b611505858286016113dd565b9150509250929050565b60006020828403121561152157600080fd5b815161038681611902565b60006020828403121561153e57600080fd5b81517fffffffff000000000000000000000000000000000000000000000000000000008116811461038657600080fd5b6000806040838503121561158157600080fd5b823567ffffffffffffffff81111561159857600080fd5b6115a4858286016113dd565b9250506115b3602084016113c6565b90509250929050565b600080600080608085870312156115d257600080fd5b843567ffffffffffffffff8111156115e957600080fd5b6115f5878288016113dd565b945050611604602086016113c6565b9250611612604086016113c6565b9396929550929360600135925050565b60008060006060848603121561163757600080fd5b833567ffffffffffffffff8082111561164f57600080fd5b61165b878388016113dd565b9450611669602087016113c6565b9350604086013591508082111561167f57600080fd5b5061168c868287016113dd565b9150509250925092565b6000602082840312156116a857600080fd5b815167ffffffffffffffff8111156116bf57600080fd5b8201601f810184136116d057600080fd5b80516116de6113fc82611850565b8181528560208385010111156116f357600080fd5b61050d826020830160208601611878565b6000815180845261171c816020860160208601611878565b601f01601f19169290920160200192915050565b60008251611742818460208701611878565b9190910192915050565b7f7265636569766552657175657374563200000000000000000000000000000000815260008351611784816010850160208801611878565b80830190506bffffffffffffffffffffffff1984166010820152602481019150509392505050565b60006001600160a01b03808816835260a060208401526117cf60a0840188611704565b9581166040840152939093166060820152608001525092915050565b8281526040602082015260006118046040830184611704565b949350505050565b6020815260006111856020830184611704565b604051601f8201601f1916810167ffffffffffffffff81118282101715611848576118486118d3565b604052919050565b600067ffffffffffffffff82111561186a5761186a6118d3565b50601f01601f191660200190565b60005b8381101561189357818101518382015260200161187b565b838111156110555750506000910152565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b8015158114610a3857600080fdfea2646970667358221220dbd6b181d0bd39bfc41cfefeef8d6b7abcf65e1e275f744004f4654746c4620f64736f6c63430008070033";

type BridgeConstructorParams = any

const isSuperArgs = (
  xs: BridgeConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class Bridge__factory extends ContractFactory {
  constructor(...args: BridgeConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
    this.contractName = "Bridge";
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<Bridge> {
    return super.deploy(overrides || {}) as Promise<Bridge>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): Bridge {
    return super.attach(address) as Bridge;
  }
  connect(signer: Signer): Bridge__factory {
    return super.connect(signer) as Bridge__factory;
  }
  static readonly contractName: "Bridge";
  public readonly contractName: "Bridge";
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): BridgeInterface {
    return new utils.Interface(_abi) as BridgeInterface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): Bridge {
    return new Contract(address, _abi, signerOrProvider) as Bridge;
  }
}
