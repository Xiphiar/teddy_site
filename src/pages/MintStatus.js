import React from 'react';
import { queryWrapper } from '../utils/queryHelper';

export class MintStatus extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true
    };
  }

  componentDidMount = () => {
    this.getMintCount();
  };

  getMintCount = async () => {
    this.setState({ loading: true });

    const minted_query = {
      num_tokens: {}
    };

    //const data = await this.state.queryJS.queryContractSmart(process.env.REACT_APP_CONTRACT_ADDRESS, minted_query, {}, process.env.REACT_APP_CONTRACT_CODE_HASH);
    const data = await queryWrapper(minted_query, process.env.REACT_APP_CONTRACT_ADDRESS, process.env.REACT_APP_CONTRACT_CODE_HASH)
    console.log(data);
    this.setState({ minted: parseInt(data.num_tokens.count), loading: false });
    this.props.updater(parseInt(data.num_tokens.count));
  };

  render() {
    return (
          <div><span>0 Teddies are available.</span></div>
      );
      /*
    return (
      this.state.loading ?
        <div><span><i className="c-inline-spinner c-inline-spinner-white" /> Teddies are available.</span>&nbsp;&nbsp;<i className="fa fa-refresh fa-spin" style={{ fontSize: "24px" }}></i></div>
        :
        <div><span>{3030 - this.state.minted} Teddies are available.</span>&nbsp;&nbsp;<i style={{ fontSize: "24px" }} className="fa pointer" onClick={() => this.getMintCount()}>&#xf021;</i></div>
    );
    */
  }
}
