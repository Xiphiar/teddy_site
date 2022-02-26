import React from 'react';
import Select from 'react-select';
import Meta from '../components/Meta'
import Image from 'react-bootstrap/Image'
import { Nav, Container, Col, Row, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import TeddyInfo from '../components/gallery/teddyCardModal'
import { getSigningClient, getPermit, permitName, allowedTokens, permissions } from "../utils/keplrHelper";
import { queryOwnedTokens } from "../utils/dataHelper";
import TeddyCard from '../components/gallery/teddyCard';
import { getPublicTeddyData, truncate } from '../utils/dataHelper'
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from "axios";

// Layout
import Layout from "../layout/Layout";


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
    this.state = {
      loading: true,
      imageUrl: null
    };
  }

  componentDidMount = () => {
    this.getData();
  }

  getData = async() => {
    const data = await getPublicTeddyData(this.props.id);
    this.setState({
      imageUrl: data.pub_url,
      loading: false
    })
  }

  render(){
    return (
      <a onClick={() => this.props.clickHandler(this.props.id, this.state.imageUrl)}>
      <div className="backLink pointer" style={{paddingBottom: "15px"}} >
        {this.state.loading ?
          <i className="c-inline-spinner c-inline-spinner-white" />
        :
          <Image src={this.state.imageUrl} rounded  style={{width: "237px", minHeight: "228px"}}/>
        }
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
      //sort: {value: 'numberasc', label: 'Number (Asc)'},
      //base: [],
      //burnt: false,
      //sortPlaceholder: "Number (Asc)",
      loadingOwned: false,
      showTeddy: this.props.showTeddy || false,
      lookupID: this.props.lookupID || "",
      clickedID: null,
      //items: [],
      page: 1,
      queryPermit: {},
      tokenList: [],
      tokensLoaded: false,
      owned: false,
    };
  }

  componentDidMount = async() => {
    /*let data = await this.queryBackendAll(1);
    this.setState({items: data, page: 1})
*/
    /*
    let test = await axios.post(`https://stashh.io/decrypt`, { url, key }).catch((err) => {
      console.log(err)
    });
    console.log(test)
    this.setState({testdata: test})
    */
    console.log(this.props)
    
    if (this.props.lookupTeddy){
      this.setState({lookupID: this.props.lookupID});
      this.handleLookup();
    }
    
  }

  async componentDidUpdate(prevProps){
    if (this.props !== prevProps) {
        /*
        this.setState({
            showTeddy: this.props.showTeddy || false,
            lookupID: this.props.lookupID || null,
        })
        
        if (this.props.lookupID){
          this.handleLookup();
        }
        */
    }
}

  handleClickTile = (data, publicUrl) => {
    this.setState({
      showTeddy: true,
      clickedID: data,
      owned: true
    })
  }

  showGallery = () => {
    this.setState({
      showTeddy: false,
      lookupID: "",
      clickedID: null
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

  queryOwned = async() => {
    //disable Mint button and show spinner
    this.setState({
      loadingOwned: true
    })

    let returned = {client: null, address: null}
    if (!this.state.secretJs || !this.state.address) {
      console.log("getting stuff")
      //get SigningCosmWasmClient and store in state
      returned = await getSigningClient();
      this.setState({
        secretJs: returned.client,
        address: returned.address
      })
    }

    try {
      await this.getPermit();
    } catch(e) {
      console.error(e)
      this.setState({
        loadingOwned: false
      })
      return;
    }

    const data = await queryOwnedTokens(this.state.secretJs, this.state.address, this.state.queryPermit)
    if (data.length){
      this.setState({
        loadingOwned: false,
        tokensLoaded: true,
        tokenList: data,
        owned: true
      });
    } else {
      const truncatedAddress = truncate(this.state.address, 27, "...")
      toast.error(`No teddies found for address ${truncatedAddress}`,{
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        
      });
      this.setState({
        loadingOwned: false,
      });
    } 
  }

  handleLookupIDChange = (event) => {
    this.setState({lookupID: event.target.value});
  }

  handleLookup = () => {
    this.setState({
      clickedID: this.state.lookupID.trim(),
      showTeddy: true,
      owned: false
    })
  }

  render () {
    // page content
    const pageTitle = 'Midnight Teddy Club'
    if (this.state.showTeddy){
      return (
        <Layout>
          <Meta title={pageTitle}/>
          <Container>
            <Row>
              <h1 class="homeTitle">Midnight Teddy Clubhouse</h1>
            </Row>
            <Padding size={30}/>
            <TeddyCard owned={this.state.owned} handleBack={this.showGallery} id={this.state.clickedID} queryPermit={this.state.queryPermit} secretJs={this.state.secretJs}/>
          </Container>
        </Layout>
        )
    }
    if (this.state.tokensLoaded){
      return (
        <Layout>
          <Meta title={pageTitle}/>
          <Container>
          <Row>
            <Image src="club_banner.jpg" id='my-img2' fluid={true}/>
          </Row>
          <Padding size={30}/>
            <Row>
              <Col>
                <h1 class="homeTitle">Midnight Teddy Clubhouse</h1>
              </Col>
              <Col xs={"auto"} className="text-center">
                <h4>Lookup any Teddy</h4>
                <div className="d-flex justify-content-center" style={{margin:"auto"}}>
                  <label>
                    ID:&nbsp;
                    <input className="lookupBox text-center" type="text" value={this.state.lookupID} name="lookupbox" onChange={this.handleLookupIDChange}/>
                  </label>
                  <button className="lookupBtn" onClick={() => this.handleLookup()}>Go</button>
                  </div>
              </Col>
            </Row>

            <Padding size={30}/>

            <Row className="justify-content-center" style={{paddingBottom: "20px"}}>

            </Row>
  
            <Row className="justify-content-center">
              { this.state.tokenList.length ? 
                <div className="d-flex" style={{flexWrap: "wrap", justifyContent: 'space-evenly'}}>
                  {this.state.tokenList.map(item => {
                      return (<TeddyTile id={item}  clickHandler={this.handleClickTile}/>)
                  })}
                </div>
              :
                <div className="d-flex" style={{flexWrap: "wrap", justifyContent: 'space-evenly'}}>
                  <h3>No Teddies Found 😔</h3>
                </div>
              }

            </Row>

          </Container>
        </Layout>
        )
    } else {
    return (
      <Layout>
        <Meta title={pageTitle}/>
        <Container>
        <Row>
          <Image src="club_banner.jpg" id='my-img2' fluid={true}/>
        </Row>
        <Padding size={30}/>
        
        <Row>
          <h1 class="homeTitle">Midnight Teddy Clubhouse</h1>
        </Row>
        <Padding size={30}/>
          
            <Row>
              <Col>
                <h2>View Your Teddies</h2>
                <p>View your owned teddies with Keplr Wallet. Click the button below to create a free viewing permit and view your teddies' private images and traits.</p>

              </Col>

              <Col>
                <h2>Lookup any Teddy</h2>
                <p>Enter a Teddy ID to view it's public traits.</p>

              </Col>
            </Row>
            <Row>
              <Col>
              <div className="text-center">
                  { this.state.loadingOwned ?
                    <Button className="keplrButton" disabled={true}  style={{width:"190px", height:"55px"}}><i className="c-inline-spinner c-inline-spinner-white" /></Button>
                  :
                    <Button className="keplrButton" onClick={() => this.queryOwned()} style={{width:"190px", height:"55px"}}>Connect Keplr</Button>
                  }
                </div>
              </Col>
              <Col>
              <div className="d-flex justify-content-center" style={{margin:"auto"}}>
                  <label>
                    ID:&nbsp;
                    <input className="lookupBox text-center" type="text" value={this.state.lookupID} name="lookupbox" onChange={this.handleLookupIDChange}/>
                  </label>
                  <button className="lookupBtn" onClick={() => this.handleLookup()}>Go</button>
                </div>
              </Col>
            </Row>
      </Container>
      </Layout>
    )
      }
  }
}

function WrappedGallery() {
  const params = useParams();
  console.log("paramsss", params);

    return (
    <Gallery
      lookupTeddy={true}
      lookupID={params.lookupID}
      // etc...
    />
  );
}

export { Gallery, WrappedGallery };