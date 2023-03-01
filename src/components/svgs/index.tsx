import React from 'react'

export const ExchangeSVG = () => (
  <svg width="16px" height="16px" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg" fill="#000000">
    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
    <g id="SVGRepo_iconCarrier">
      <g
        fill="none"
        fillRule="evenodd"
        strokeLinecap="round"
        strokeLinejoin="round"
        transform="matrix(0 1 -1 0 18.5 2.5)"
      >
        <g transform="matrix(0 -1 1 0 .5 16.5)">
          <path d="m16 0v5h-5" transform="matrix(0 1 1 0 11 -11)"></path>
          <path d="m16 5c-2.8366699-3.33333333-5.6700033-5-8.5-5-2.82999674 0-5.32999674 1-7.5 3"></path>
        </g>
        <g transform="matrix(0 1 -1 0 14 1)">
          <path d="m16 0v5h-5" transform="matrix(0 1 1 0 11 -11)"></path>
          <path d="m16 5c-2.8366699-3.33333333-5.6700033-5-8.5-5-2.82999674 0-5.32999674 1-7.5 3"></path>
        </g>
      </g>
    </g>
  </svg>
)

export const CoinSVG = ({ color }: { color: string }) => (
  <svg width="16" height="16" fill="#7578b5" xmlns="http://www.w3.org/2000/svg">
    <path
      fill={color}
      d="M6 4.063c-3 0-6 .906-6 2.718v6.5C0 15.062 3 16 6 16c2.969 0 6-.938 6-2.75v-6.5c0-1.781-3-2.688-6-2.688zm4.5 9.187c0 .344-1.563 1.25-4.5 1.25-2.969 0-4.5-.906-4.5-1.25v-1.344c1.125.563 2.813.844 4.5.844 1.656 0 3.344-.281 4.5-.844v1.344zm0-3.25c0 .344-1.563 1.25-4.5 1.25-2.969 0-4.5-.906-4.5-1.25V8.656C2.625 9.22 4.313 9.5 6 9.5c1.656 0 3.344-.281 4.5-.844V10zM6 8c-2.969 0-4.5-.906-4.5-1.25C1.5 6.437 3.031 5.5 6 5.5c2.938 0 4.5.938 4.5 1.25C10.5 7.094 8.937 8 6 8zm4-8C6.406 0 4.219 1.25 4.219 2.156c0 .313.25.75.75.75.718 0 .937-1.406 5.031-1.406 2.938 0 4.5.938 4.5 1.25 0 .063-.219.438-1.25.781-.313.125-.531.406-.531.719 0 .406.344.75.781.75.25 0 .844-.281 1-.344V6c0 .063-.25.469-1.281.813-.313.093-.5.375-.5.718 0 .407.312.75.75.75.281 0 .906-.344 1.031-.375V9.25c0 .063-.219.438-1.25.781a.77.77 0 0 0-.5.719c0 .406.313.75.75.75.188 0 2.5-.656 2.5-2.25v-6.5C16 .969 12.969 0 10 0z"
    ></path>
  </svg>
)
