import React from 'react';
import { getApiURL } from "../../utils/keplrHelper";
import { CosmWasmClient } from 'secretjs';
import { queryOwnedTickets } from "../../utils/dataHelper";

export class TicketCounter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      queryJS: new CosmWasmClient(getApiURL()),
      loading: true,
      count: 0,
      permit: this.props.permit,
      address: this.props.address
    };
  }

  componentDidMount = () => {
    this.getTicketCount();
  };

  getTicketCount = async () => {
    this.setState({ loading: true });

    const data = await queryOwnedTickets(this.state.queryJS, this.state.address, this.state.permit)

    console.log(data);
    this.setState({ count: parseInt(data.length), loading: false });
  };

  render() {
    return (
      this.state.loading ?
        <div><span>You have <i className="c-inline-spinner c-inline-spinner-white" /> Golden Tokens</span>&nbsp;&nbsp;<i className="fa fa-refresh fa-spin" style={{ fontSize: "24px" }}></i></div>
        :
        this.state.count === 1 ?
          <div><span>You have {this.state.count} Golden Token</span>&nbsp;&nbsp;<i style={{ fontSize: "24px" }} className="fa pointer" onClick={() => this.getTicketCount()}>&#xf021;</i></div>
        :
          <div><span>You have {this.state.count} Golden Tokens</span>&nbsp;&nbsp;<i style={{ fontSize: "24px" }} className="fa pointer" onClick={() => this.getTicketCount()}>&#xf021;</i></div>
        
    );
  }
}
