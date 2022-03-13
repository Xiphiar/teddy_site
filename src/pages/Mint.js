import Header from '../components/Header'
import React from 'react';
import Select from 'react-select';
import Meta from '../components/Meta'
import Image from 'react-bootstrap/Image'
import { Nav, Container, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import TeddyInfo from '../components/gallery/teddyInfo'
import InputSpinner from 'react-bootstrap-input-spinner'  
import ProcessingModal from '../components/mint/ProcessingModal'
// Layout
import Layout from "../layout/Layout";

import { getSigningClient } from "../utils/keplrHelper";
import Feedback from 'react-bootstrap/esm/Feedback';

import { toast } from 'react-toastify';
import clubBanner from '../assets/club_banner.jpg'
import { MintStatus } from './MintStatus';


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

class MintPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      loading: false,
      number: 1,
      secretJs: null,
      txId: null,
      tx: {},
      error: false,
      errorText: "",
      complete: false,
      numMinted: null
    };
  }

  updateAvailable = (amount) => {
    //this.setState({numMinted: amount})
  }

  handleMint = async() => {
    //disable Mint button and show spinner
    this.setState({
      loading: true
    })

    if (!window.keplr){
      toast.error("Please install Keplr Wallet extension.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      this.setState({
        loading: false
      })
      return;
    }

    //get SigningCosmWasmClient and store in state
    let {client, address} = await getSigningClient();
    this.setState({
      secretJs: client,
      address: address
    })

    //message for the NFT contract
    const mintMsg = {
      receive_mint: {}
    };    

    //message to send the SNIP20 token to the NFT contract
    const sendMsg = {
      send: {
        amount: process.env.REACT_APP_MINT_PRICE,
        recipient: process.env.REACT_APP_CONTRACT_ADDRESS,
        msg: Buffer.from(JSON.stringify(mintMsg)).toString('base64')
      }
    }

    let asyncResponse;
    try{

      //mint multiple with multiExecute
      if (this.state.number > 1){
        const fee = {
          gas: parseInt(process.env.REACT_APP_MINT_GAS) * parseInt(this.state.number),
        }
        let multiObj = {
          contractAddress: process.env.REACT_APP_TOKEN_ADDRESS,
          contractCodeHash: process.env.REACT_APP_TOKEN_CODE_HASH,
          handleMsg: sendMsg
        }
        let messages = []
        for (var i = 0; i < this.state.number; i++) messages.push(multiObj);
        asyncResponse = await this.state.secretJs.multiExecute(
          messages,
          "",
          fee
        )

      //mint single with regular execute
      } else {
        const fee = {
          gas: process.env.REACT_APP_MINT_GAS,
        };

        //returns tx hash only
        asyncResponse = await this.state.secretJs.execute(
          process.env.REACT_APP_TOKEN_ADDRESS,
          sendMsg,
          null,
          [],
          fee,
          process.env.REACT_APP_TOKEN_CODE_HASH
        );
        console.log(asyncResponse)
      }
    
    


      //catch and show error while posting TX
    } catch(error){
      console.error(error);
      toast.error(error.toString(), {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      this.setState({
        loading: false,
      })
      return;
    }

    //show error if async execute returned an error code (rare)
    if (asyncResponse.code){
      this.setState({
        show: true,
        error: true,
        tx: asyncResponse
      })
      return;
    }

    //show loading modal
    this.setState({
      show: true,
      txId: asyncResponse.transactionHash
    })
    
    try {
      //poll endpoint for TX to know when it processes 10 times 1000ms delay 
      const fullResponse = await this.state.secretJs.checkTx(asyncResponse.transactionHash, 10000, 400);
      console.log("*TX*", fullResponse)
      //if tx failed show error in modal
      if (fullResponse.code){
        this.setState({
          error: true,
          tx: fullResponse
        })
        return;
      }

      //show complete screen in modal.
      this.setState({
        complete: true,
        tx: fullResponse
      })

    } catch(e){
      this.setState({
        show: true,
        error: true,
        tx: {raw_log: e}
      })
    }



  }

  handleHide = () => {
    this.setState({
      show: false,
      loading: false,
      error: false,
      complete: false,
      txId: null,
      tx: {}
    })
  }

  changeNumber = (num) => {
    this.setState({number: num})
  }



  componentDidMount = async() => {
    //console.log("did Mount")
  }

  render () {
    // page content
    const pageTitle = 'Midnight Teddy Club Mint'
    return (
      <Layout>
      <div>
        <Meta title={pageTitle}/>
        <ProcessingModal
          show={this.state.show}
          hide={this.handleHide}
          txId={this.state.txId}
          tx={this.state.tx}
          error={this.state.error}
          errorText={this.state.errorText}
          complete={this.state.complete}
        />
        <Container>
          <Row>
            <Image src={clubBanner} id='my-img2' fluid/>
          </Row>
          {/*<Row>
            <img src={`data:image/png;base64,${this.state.testdata}`}/>
          </Row>*/}
        </Container>
        <Padding size={30}/>
        <Container>
        <Row className="justify-content-center">
          <Col md={5} className="text-center">
          <h1>Mint a Teddy</h1>
          </Col>
        </Row>
        <Row className="text-center">
          <MintStatus updater={this.updateAvailable}/>
        </Row>
        <Row className="justify-content-center" style={{paddingTop: "30px"}}>
          <Col md={"auto"}>
            <div className="d-flex">
              <div style={{width: "200px"}}>
                <h6>Number to mint</h6>
                <div style={{width: "105px"}}>
                  <InputSpinner
                    type={'real'}
                    precision={2}
                    max={0}
                    min={0}
                    step={1}
                    value={0}
                    onChange={num=>this.changeNumber(num)}
                    variant={'dark'}
                    size="sm"
                  />
              </div>
            </div>
            { this.state.loading ?
              <button type="button" onClick={this.handleMint} disabled={true} className="btn btn-primary me-2 mintButton teddyButton">
                <i className="c-inline-spinner c-inline-spinner-white c-inline-spinner-lg " />
              </button>

            :
              <button type="button" disabled={true} className="btn btn-primary me-2 mintButton teddyButton">
                SOLD OUT
              </button>
            }

            </div>
          </Col>
        </Row>
      </Container>
      </div>
      </Layout>
    )
  }
}

export default MintPage