import React from 'react';
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Image from 'react-bootstrap/Image'
import { ThemeConsumer } from 'react-bootstrap/esm/ThemeProvider';

const ErrorBody = ({ rawLog }) => {
    return (
        <Container>
          <div className=''>
            <h1>Error Processing Transaction</h1>
            <h3 className=''>{rawLog}</h3>
          </div>
        </Container>
      )
}

const ProcessingBody = ({ txId }) => {
    return (
        <Container>
          <div className=''>
            <h2>Your transaction is processing. Please wait.</h2>
            <h5 className=''>Your transaction ID is <a href={`https://secretnodes.com/something/${txId}`}>{txId}</a></h5>
          </div>
        </Container>
      )
}

const MintedBody = ({ kvLogs }) => {
    console.log(kvLogs)
    return (
        <Container>
          <div className=''>
            <h1>Success!</h1>
            <h2>You minted Midnight Teddy #{kvLogs[0].minted}</h2>
            <Image src={kvLogs.priv_url} />
          </div>
        </Container>
      )
}

const MultiMinted = ({ kvLogs }) => {
  console.log(kvLogs, kvLogs.length)

  if (kvLogs.length > 1){
      let minted = []
      for (let i = 0; i < kvLogs.length; i++) {
        minted.push(kvLogs[i].minted)
      }
      return (
        <Container>
          <div className=''>
            <h1>Success!</h1>
            <div className="d-flex ">
            {kvLogs.map((single) => {
              console.log(single)
                return (
                  <div style={{width: "30%"}}>
                    <h6>{single.minted}</h6>
                    <Image src="specsteddy.png" fluid={true}/>
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
            <h1>Success!</h1>
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
           console.log(this.props.tx)
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

    render(){
        return(
        <Modal
            show={this.props.show}
            onHide={this.props.hide}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Body style={{color: "black"}}>
                { this.state.complete ?
                    <MultiMinted kvLogs={this.state.tx.kv_logs} />
                :
                    this.state.error ?
                        <ErrorBody rawLog={this.state.tx.raw_log || this.state.errorText}/>

                    :
                        <ProcessingBody txId={this.state.txId}/>
                }
            </Modal.Body>
            { this.state.complete ?
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.props.hide}>
                    View In Gallery
                    </Button>
                    <Button variant="secondary" onClick={this.props.hide}>
                    Mint More
                    </Button>
                </Modal.Footer>
            :
                this.props.error ?
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.props.hide}>
                        Back
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