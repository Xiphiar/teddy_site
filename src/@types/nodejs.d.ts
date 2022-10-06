declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    REACT_APP_CHAIN_ID: string;
    REACT_APP_GRPC_URL: string;
    REACT_APP_RPC_URL: string;
    REACT_APP_LCD_URL: string;
    REACT_APP_BACKEND_URL: string;

    REACT_APP_FACTORY_ENABLED: string;
    REACT_APP_IPFS_MIRROR: string;

    REACT_APP_MINT_PRICE: string;
    REACT_APP_FACTORY_PRICE: string;
    REACT_APP_ALLOW_MINT_WITHOUT_QUERY: string;
    REACT_APP_SOLD_OUT: string;
    REACT_APP_TOKEN_ADDRESS: string;
    REACT_APP_TOKEN_CODE_HASH: string;
    REACT_APP_CONTRACT_ADDRESS: string;
    REACT_APP_CONTRACT_CODE_HASH: string;
    REACT_APP_TICKET_ADDRESS: string;
    REACT_APP_TICKET_HASH: string;
  }
}
