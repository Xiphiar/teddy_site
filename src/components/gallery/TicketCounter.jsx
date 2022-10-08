import React from 'react';
import { useEffect } from 'react';
import { useGoldTokens } from '../../contexts/GoldTokenContext';

export default function TicketCounter({permit, address}){
  const {tokens, loading, refreshTokens} = useGoldTokens();

  useEffect(()=>{
    if (!tokens.length){
      refreshTokens(address, permit);
    }
  },[address, permit])

  return (
    loading ?
      <div><span>You have <i className="c-inline-spinner c-inline-spinner-white" /> Golden Tokens</span>&nbsp;&nbsp;<i className="fa fa-refresh fa-spin" style={{ fontSize: "24px" }}></i></div>
      :
      tokens.length === 1 ?
        <div><span>You have {tokens.length} Golden Token</span>&nbsp;&nbsp;<i style={{ fontSize: "24px" }} className="fa pointer" onClick={() => refreshTokens(address, permit)}>&#xf021;</i></div>
      :
        <div><span>You have {tokens.length} Golden Tokens</span>&nbsp;&nbsp;<i style={{ fontSize: "24px" }} className="fa pointer" onClick={() => refreshTokens(address, permit)}>&#xf021;</i></div>
  );
}
