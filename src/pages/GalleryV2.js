import React, { useState, useEffect } from 'react';
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
import clubBanner from '../assets/club_banner.jpg'
import { TicketCounter } from '../components/gallery/TicketCounter';


// Layout
import Layout from "../layout/Layout";
import { TeddyTile } from '../components/gallery/teddyTile';


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

function FactoryToast({selected}){
    const toastId = React.useRef(null);

    useEffect(() => {
        console.log("effect running",selected)
        if (selected) {
            toastId.current = toast(`${selected} ${selected === 1 ? "Teddy" : "Teddies"} Selected`, {
                position: "bottom-center",
                draggable: true,
                autoClose: false,
                closeOnClick: false
            })
        }
        else {
            toast.dismiss(toastId.current)
        }
        console.log(toastId)
    }, [selected])
  
  
    return (
      <>
      null
      </>
    );
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
      factoryTeddies: [],
      factoryToast: null,
    };
  }

  componentDidMount = async() => {  
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

    updateFactoryToast = () => {
        const selected = this.state.factoryTeddies.length;

        let render = (<div style={{textAlign: "center"}}>{`${selected} ${selected === 1 ? "Teddy" : "Teddies"} Selected`}</div>)
        if (selected === 3) {
            render = (<div style={{textAlign: "center"}}>
              <Link onClick={() => toast.dismiss(this.state.factoryToast)} to="/factory" state={{ selectedTeddies: this.state.factoryTeddies }}
              style={{
                color: "#fff",
                textDecoration: "none"
              }}>
                Send to Factory 🌋  ➡
              </Link>
            </div>)
            toast.update(this.state.factoryToast, {
                render: render,
                type: toast.TYPE.SUCCESS,
                icon: false,
                closeButton: false,
                style: {cursor: 'pointer'}
            });
        }
        else if (selected) {
            toast.update(this.state.factoryToast, {
                render: render,
                type: toast.TYPE.DEFAULT,
                style: {cursor: 'default'}
            });
        } else {
            toast.dismiss(this.state.factoryToast)
        }
    }

    changeFactoryList = (id, checkStatus) => {
        const currentLength = this.state.factoryTeddies.length;
        
        // if checking a box
        if (checkStatus) {
            const newLength = currentLength + 1;
            console.log(`Checked. Old Length:`,currentLength,`New Length`,newLength)


            //if there is already one checked (toast should be created), add to list and update toast
            if (currentLength) {
                this.setState(
                    { factoryTeddies: [...this.state.factoryTeddies, id]},
                    () => {
                        console.log('Length after change:', this.state.factoryTeddies.length, this.state.factoryTeddies);
                        this.updateFactoryToast(newLength);
                }) 
            }

            //else create new toast
            else {
                this.setState({
                    factoryTeddies: [...this.state.factoryTeddies, id],
                    factoryToast: toast((<div style={{textAlign: "center"}}>{`${newLength} ${newLength === 1 ? "Teddy" : "Teddies"} Selected`}</div>), {
                        position: "bottom-center",
                        draggable: false,
                        autoClose: false,
                        closeOnClick: false
                    })
                },
                () => {
                    console.log('Length after change:', this.state.factoryTeddies.length, this.state.factoryTeddies)
                })
            }
        } 

        // if UNchecking a box
        else {
            const newLength = currentLength - 1;
            console.log(`UNChecked. Old Length:`,currentLength,`New Length`,newLength)

            // remove from list
            const index = this.state.factoryTeddies.indexOf(id);
            const newAry = this.state.factoryTeddies.filter(element => element !== id);
            console.log("index", index, newAry)

            this.setState(
                { factoryTeddies: newAry },
                () => {
                    console.log('Length after change:', this.state.factoryTeddies.length, this.state.factoryTeddies)

                    // if now empty, dismiss toast
                    if (!newLength) toast.dismiss(this.state.factoryToast)
                    else this.updateFactoryToast(newLength);
            });


            
        }
    }

  handleClickTile = (data) => {
    this.setState({
      showTeddy: true,
      clickedID: data,
      owned: true,
      factoryTeddies: []
    })
    toast.dismiss(this.state.factoryToast)
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
              <h1 className="homeTitle">Midnight Teddy Clubhouse</h1>
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
          {/*<FactoryToast selected={this.state.factoryTeddies.length} />*/}
          <Container>
          <Row>
            <Image src={clubBanner} id='my-img2' fluid/>
          </Row>
          <Padding size={30}/>
            <Row className="justify-content-between">
              <Col md={'auto'}>
                <h1 className="homeTitle">Midnight Teddy Clubhouse</h1>
              </Col>
              <Col xs={"auto"} className="d-flex align-items-center">
                <TicketCounter permit={this.state.queryPermit} address={this.state.address} />

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
                      return (<TeddyTile id={item}  clickHandler={this.handleClickTile} checkHandler={this.changeFactoryList} numChecked={this.state.factoryTeddies.length} key={`teddy-tile-${item}`} />)
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
          <Image src={clubBanner} id='my-img2' fluid/>
        </Row>
        <Padding size={30}/>
        
        <Row>
          <h1 className="homeTitle">Midnight Teddy Clubhouse</h1>
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
    return (
    <Gallery
      lookupTeddy={true}
      lookupID={params.lookupID}
      // etc...
    />
  );
}

export { Gallery, WrappedGallery };