import Header from '../components/Header'
import React from 'react';
import Select from 'react-select';
import Meta from '../components/Meta'
import Image from 'react-bootstrap/Image'
import { Nav, Container, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import TeddyInfo from '../components/gallery/teddyInfo'
import { getSigningClient, getPermit, permitName, allowedTokens, permissions } from "../utils/keplrHelper";

import axios from "axios";

// Layout
import Layout from "../layout/Layout";

const backendUrl = "http://localhost:9176"

const hash = 'QmQut4RpE5tYE7WD3yc17okr1TC8HDg3xPk3BPcog6XfFs'
const url="https://ipfs.io/ipfs/QmQut4RpE5tYE7WD3yc17okr1TC8HDg3xPk3BPcog6XfFs"
const key = "c9afac7fbed9cc01f66237d3e108bdc9aa"





const style = {
  height: 50,
  border: "1px solid green",
  margin: 6,
  padding: 8
};

const baseOptions = [
  { value: 'standard', label: 'Standard' },
  { value: 'headless', label: 'Headless' },
  { value: 'alien', label: 'Alien' },
  { value: 'zombie', label: 'Zombie' },
  { value: 'robot', label: 'Robot' },
];

const burntOptions = [
  { value: true, label: 'Only Burnt' },
  { value: false, label: 'Only Unburnt' }
];

const ownedOptions = [
  { value: true, label: 'Only Owned' }
];

const sortOptions = [
  { value: 'numberasc', label: 'Number (Asc)' },
  { value: 'numberdesc', label: 'Number (Desc)' },
  { value: 'rarityasc', label: 'Rarity (Asc)' },
  { value: 'raritydesc', label: 'Rarity (Desc)' },
];

class Padding extends React.Component {
  constructor(props) {
    super(props);
  }

  render(){
    return (
      <div style={{height:`${this.props.size}px`}} />
    )
  }
}

class TeddyTile extends React.Component {
  constructor(props) {
    super(props);
  }

  render(){
    return (
      <a onClick={this.props.clickHandler}>
      <div style={{paddingBottom: "15px"}} >
        <Image src="team1.png" rounded />
        <h5>Midnight Teddy #{this.props.id}</h5>
      </div>
      </a>
    )
  }
}

class Gallery extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sort: {value: 'numberasc', label: 'Number (Asc)'},
      base: [],
      burnt: false,
      owned: false,
      sortPlaceholder: "Number (Asc)",
      items: [],
      page: 1,
      show: false,
      queryPermit: {},
      tokenList: []
    };
  }

  queryBackendAll = async(page=1, sort=this.state.sort, base=this.state.base) => {
    let baseOpt = ""
    if (base.length){
      const values = base.map(function (item) {
        return item.value;
      });
      baseOpt = `&base=${values.join(',')}`
      console.log(baseOpt);
    }
    console.log(`${process.env.REACT_APP_BACKEND_URL}/teddy?page=${page}&sort=${sort.value}${baseOpt}`)
    const backendRes = await fetch(`${process.env.REACT_APP_BACKEND_URL}/teddy?page=${page}&sort=${sort.value}${baseOpt}`);
    let backendData = await backendRes.json(); //extract JSON from the http response
    //backendData.data[0].attributes = JSON.parse(backendData.data[0].attributes);
    //console.log(backendData.data);
    return backendData.data;
  }

  componentDidMount = async() => {
    console.log("did Mount")
    let data = await this.queryBackendAll(1);
    this.setState({items: data, page: 1})

    /*
    let test = await axios.post(`https://stashhapp-public-testnet.azurewebsites.net/decrypt`, { url, key }).catch((err) => {
      console.log(err)
    });
    console.log(test)
    this.setState({testdata: test})
    */
  }

  handleClick = (data) => {
    console.log(data)
    this.setState({
      show: true,
      clicked: data
    })
    console.log(this.state)
  }

  handleHide = () => {
    this.setState({
      show: false
    })
  }

  getPermit = async() => {
    if (this.state.queryPermit.signature) {
      return;
    }

    const signature = await getPermit(this.state.address);
    this.setState({
      queryPermit: signature
    });

    return;
  }

  handleQuery = async() => {
    //disable Mint button and show spinner
    this.setState({
      loading: true
    })
    let returned = {client: null, address: null}
    if (!this.state.secretJs || this.state.address) {
      //get SigningCosmWasmClient and store in state
      returned = await getSigningClient();
      this.setState({
        secretJs: returned.client,
        address: returned.address
      })
    }

    await this.getPermit();

    let chainId = process.env.REACT_APP_MAINNET_CHAIN_ID;
    if (Boolean(process.env.REACT_APP_USE_TESTNET)){
        chainId = process.env.REACT_APP_TESTNET_CHAIN_ID
    }

    let query = {
      tokens: {
        owner: this.state.address,
        limit: 200
      }
    }
    
    const permitQuery = {
      with_permit: {
        query: query,
        permit: {
          params: {
            permit_name: permitName,
            allowed_tokens: allowedTokens,
            chain_id: chainId,
            permissions: permissions,
          },
          signature: this.state.queryPermit,
        },
      },
    };
    console.log(permitQuery)
    let data = await this.state.secretJs.queryContractSmart(process.env.REACT_APP_CONTRACT_ADDRESS, permitQuery, {}, process.env.REACT_APP_CONTRACT_CODE_HASH);
    console.log(data);
    this.setState({tokenList: data.token_list.tokens});

  }

  render () {
    // page content
    const pageTitle = 'Midnight Teddy Club'
    const { base, burnt, owned, sort } = this.state;
    const customStyles = {
      option: (provided, state) => ({
        ...provided,
        borderBottom: '1px solid #C152F5',
        color: "#FFF",
        "background-color": "black"
      }),
      container: (base, state) => ({
        ...base,
        "padding-bottom": "20px",
      }),
      control: (base, state) => ({
        ...base,
        background: "black",
        // Overwrittes the different states of border
        borderColor: "white",
        // Removes weird border around container
        boxShadow: state.isFocused ? null : null,
        "&:hover": {
          // Overwrittes the different states of border
          borderColor: "#C152F5"
        }
      }),
      singleValue: (provided, state) => {
        const opacity = state.isDisabled ? 0.5 : 1;
        const transition = 'opacity 300ms';
        return { ...provided, opacity, transition };
      },
      menu: (base, state) => ({
        ...base,
        "background-color": "black",
        // Overwrittes the different states of border
        //borderColor: "white",
        // Removes weird border around container
        //boxShadow: state.isFocused ? null : null,
        //"&:hover": {
          // Overwrittes the different states of border
        //  borderColor: "#C152F5"
        //}
      }),
    }
    return (
      <Layout>
      <TeddyInfo show={this.state.show} hide={() => this.handleHide()} data={this.state.clicked}/>
      <div>
        <Meta title={pageTitle}/>
        <Container>
          <Row>
            <button onClick={() => this.handleQuery()}>Connect Keplr</button>
            <div className="d-flex" style={{flexWrap: "wrap", justifyContent: 'space-evenly'}}>

            
            {this.state.tokenList.map(item => {
              return (<TeddyTile id={item}  clickHandler={() => this.handleClick(item)}/>)
            }
            )}
            </div>
          </Row>
        </Container>
      </div>
      </Layout>
    )
  }
}

export default Gallery