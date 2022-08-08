import React from 'react';
import { getApiURL, queryJs } from "../../utils/keplrHelper";
import { CosmWasmClient } from 'secretjs';
import { queryOwnedTickets } from "../../utils/dataHelper";
import { useEffect } from 'react';
import { useState } from 'react';
import { useGoldTokens } from '../../contexts/GoldTokenContext';

export default function TicketCounter({permit, address}){
// export class TicketCounter extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       queryJS: new CosmWasmClient(getApiURL()),
//       loading: true,
//       count: 0,
//       permit: this.props.permit,
//       address: this.props.address
//     };
//   }
  const {tokens, loading, refreshTokens} = useGoldTokens();

  // const getTicketCount = async () => {
  //   setLoading(true);

  //   const data = await queryOwnedTickets(this.state.queryJS, this.state.address, this.state.permit)

  //   console.log(data);
  //   this.setState({ count: parseInt(data.length), loading: false });
  // };

  useEffect(()=>{
    if (!tokens.length){
      refreshTokens(address, permit);
    }
  },[address, permit])

  // componentDidMount = () => {
  //   this.getTicketCount();
  // };

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
