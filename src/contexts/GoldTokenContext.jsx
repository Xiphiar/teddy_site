import { createContext, useState, useContext, ReactElement, ReactNode } from 'react';
import { CosmWasmClient } from 'secretjs';
import { getApiURL } from '../utils/keplrHelper';
import { queryOwnedTickets } from '../utils/dataHelper';

const queryJs = new CosmWasmClient(getApiURL())

// set default values for initializing
const contextDefaultValues = {
  tokens: [],
  loading: true,
  refreshTokens: async function () {
    throw new Error('Function not implemented.');
  },
};

// created context with default values
const GoldTokenContext = createContext(contextDefaultValues);

export const GoldTokenProvider = ({ children }) => {
  // set default values
  const [tokens, setTokens] = useState(contextDefaultValues.tokens);
  const [loading, setLoading] = useState(contextDefaultValues.loading);

  const refreshTokens = async(
    address, permit
  ) => {
    setLoading(true);
    console.log(1)
    const data = await queryOwnedTickets(queryJs, address, permit);
    console.log(2)
    setTokens(data);
    setLoading(false);
  };

  const values = {
    tokens,
    loading,
    refreshTokens
  };

  // add values to provider to reach them out from another component
  return <GoldTokenContext.Provider value={values}>{children}</GoldTokenContext.Provider>;
};

// created custom hook
export const useGoldTokens = () => useContext(GoldTokenContext);
