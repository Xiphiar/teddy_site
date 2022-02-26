import React from 'react';
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Image from 'react-bootstrap/Image'
import { ThemeConsumer } from 'react-bootstrap/esm/ThemeProvider';
import { Link } from "react-router-dom";

import './modal.css'

const ErrorBody = ({ rawLog }) => {
    return (
        <Container>
          <div className=''>
            <span><h5 className=''>{rawLog}</h5></span>
          </div>
        </Container>
      )
}

const ProcessingBody = ({ txId }) => {
    return (
        <Container>
          <div className=''>
            <h3>Please wait for your transaction to process.</h3>
            <h5>This may take several minutes during high network load.</h5>
            <br/>
            <h6 className='' style={{marginBottom:"0px"}}>Your transaction ID is </h6><a style={{fontSize:".9rem"}} target="_blank" rel="nofollow noopener noreferrer" className="prupleLink" href={`https://secretnodes.com/secret/chains/secret-4/transactions/${txId}`}>{txId}</a>
          </div>
        </Container>
      )
}

const MintedBody = ({ kvLogs }) => {
    return (
        <Container>
          <div className=''>
            <h3>You minted Midnight Teddy #{kvLogs[0].minted}</h3>
            <Image src={kvLogs.priv_url} />
          </div>
        </Container>
      )
}

const MultiMinted = ({ kvLogs }) => {
  if (kvLogs.length > 10){
    let minted = []
    for (let i = 0; i < kvLogs.length; i++) {
      minted.push(kvLogs[i].minted)
    }
    return (
      <Container>
        <div className=''>
          <h3>You minted {kvLogs.length} Teddies!</h3>
          <p>
            Thats a lot of Teddies!
          </p>
          
        </div>
      </Container>
    )
  } else if (kvLogs.length > 1){
    let minted = []
    for (let i = 0; i < kvLogs.length; i++) {
      minted.push(kvLogs[i].minted)
    }
    return (
      <Container>
        <div className=''>
          <div className="d-flex ">
          {kvLogs.map((single) => {
              return (
                <div style={{width: "30%"}}>
                  <h6>{single.minted}</h6>
                </div>
              )
          })}</div>
          
        </div>
      </Container>
    )
  } else {
      return (
        <Container>
          <div className=''>
            <h2>You minted Midnight Teddy #{kvLogs[0].minted}</h2>
            <Image src={kvLogs.priv_url} fluid={true}/>
          </div>
        </Container>
      )
  }
}

//modal
class ProcessingModal extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        show: this.props.show || false,
        processing: this.props.processing || false,
        error: this.props.error || false,
        txId: null,
        tx: null,
        error: false,
        errorText: "",
        complete: false
      };
    }

    componentDidMount = () => {
        //check for owned prop and query priv data
        //otherwise show provided public data
    }

    componentDidUpdate(prevProps){
        if (this.props !== prevProps) {
           this.setState({
             txId: this.props.txId,
             tx: this.props.tx,
             error: this.props.error,
             errorText: this.props.errorText,
             complete: this.props.complete
           })
        }
    }

    checkTransaction = async() => {

    }


    handleClose = () => {
        this.setState({show: false})
    }

    handleShow = () => {
        this.setState({show: true})
    }

    errorText = (raw_text) =>{
      if (raw_text.includes("All tokens have been minted")){
        if (this.state.tx.tx.value.msg.length > 1) {
          return (<span>All Teddies have been minted, <b>OR</b> your desired quantity exceeds the number of remaining Teddies. </span>);
        } else {
          return "All Teddies have been minted. 😔"
        }
      } else if (raw_text.includes("insufficient funds")) {
        return (<span>Insufficent Funds. 21 sSCRT is required to mint. <br/> Convert SCRT to sSCRT <a href="https://wallet.keplr.app/#/secret/secret-secret">here</a>.</span>);
      } else if (raw_text.includes("Remaining tokens are reserved")) {
        return (<span>Remaining Teddies are reserved for whitelisted addresses. <br/> Follow us on <a href="https://twitter.com/MidnightTedClub">twitter</a> for updates.</span>);
      } else {
        return raw_text;
      }
    }

    render(){
        return(
        <Modal
            show={this.props.show}
            onHide={this.props.hide}
            contentClassName="mintModal"
            //dialogClassName='modal-90w'
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header>
              { this.state.complete ?
                      <div style={{width: "100%"}} className="text-center"><h1 style={{marginBottom:"0px"}}>Success</h1></div>
                  :
                      this.state.error ?
                        <div style={{width: "100%"}} className="text-center"><h1 style={{marginBottom:"0px"}}>Error Processing Transaction</h1></div>
                      :
                        <div style={{width: "100%"}} className="text-center"><h1 style={{marginBottom:"0px"}}>Transaction Processing</h1></div>
                        
                  }
                
            </Modal.Header>
            <Modal.Body style={{color: "black"}} className="poppins whiteFont">
                { this.state.complete ?
                    <MultiMinted kvLogs={this.state.tx.kv_logs} />
                :
                    this.state.error ?
                        <ErrorBody rawLog={this.errorText(this.state.tx.raw_log) || this.state.errorText}/>

                    :
                        <ProcessingBody txId={this.state.txId}/>
                }
            </Modal.Body>
            { this.state.complete ?
                <Modal.Footer>
                    <Link to="/gallery" className="nav-link px-2 teddyNavLink">
                      <Button variant="secondary">
                       View In Gallery
                      </Button>
                    </Link>
                    <Button variant="secondary" onClick={this.props.hide}>
                    Mint More
                    </Button>
                </Modal.Footer>
            :
                this.props.error ?
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.props.hide}>
                        Close
                        </Button>
                    </Modal.Footer>
                :
                    null
            }
        </Modal>
        )
    }


}

export default ProcessingModal;