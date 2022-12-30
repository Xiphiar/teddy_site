import React from 'react';
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import './teddyCard.css';
import { toast } from 'react-toastify';
import { addViewer, swapMetadata, transferNft } from '../../utils/txHelper';

import { getSigningClient } from '../../utils/txHelper';
import { NftDossier } from '../../utils/queryHelper';
//import styles from './dark.min.module.css';

interface SwapProps {
    address?: string;
    show?: boolean;
    teddyId: string;
    hide: () => void;
}

interface SwapState {
    show: boolean;
    address?: string;
    loading: boolean;
}

export class SwapModal extends React.Component<SwapProps, SwapState> {
    constructor(props: SwapProps) {
      super(props);
      this.state = {
        show: this.props.show || false,
        address: this.props.address,
        loading: false
      };
    }

    componentDidUpdate(prevProps: SwapProps){
        if (this.props !== prevProps) {
            this.setState({
                show: this.props.show || false
            })
        }
    }

    handleSwap = async() => {
        //show spinner and disable button
        this.setState({ loading: true });
    
        //show processing toast
        await toast.promise(
            swapMetadata(this.props.teddyId),
            {
              pending: {
                render(){
                    return "Transaction Processing"
                },
                icon: true,
              },
              success: {
                render({ data }){
                    return `Metadata Swapped`
                },
                // other options
                //icon: "🟢",
              },
              error: {
                render({ data }){
                    console.error(data);
                    // When the promise reject, data will contains the error
                    return data?.toString();
                }
              }
            }
        )
        this.setState({loading: false})
    }

    render = () => {
        return (
            <Modal
                show={this.state.show}
                onHide={this.props.hide}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                contentClassName="mintModal"
                centered
            >
            <Modal.Header>
                <div style={{width: "100%"}} className="text-center"><h3>Swap Metadata</h3></div>
            </Modal.Header>
            <Modal.Body>
                <Container>
                    <Row>
                        <p>Reveal the private image and traits of your teddy to the public by swapping the metadata. The private traits will become the public traits.</p>
                        
                    </Row>
                    <Row className="justify-content-center">
                        <Col xs={"auto"}>
                            { this.state.loading ?
                                <button className="modalButton" disabled={true}><i className="c-inline-spinner c-inline-spinner-white" /></button>
                            
                            :
                                <button className="modalButton" onClick={() => this.handleSwap()}>Swap</button>
                            }
                        </Col>
                    </Row>
                </Container>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={this.props.hide}>
                Close
                </Button>
            </Modal.Footer>
        </Modal>
        )
    }
}

interface AlterProps {
    address?: string;
    show?: boolean;
    nft: NftDossier;
    hide: () => void;
}

interface AlterState {
    show: boolean;
    address?: string;
    loading: boolean;
}

export class AlterModal extends React.Component<AlterProps, AlterState> {
    constructor(props: AlterProps) {
      super(props);
      this.state = {
        show: this.props.show || false,
        address: this.props.address,
        loading: false
      };
    }

    componentDidUpdate(prevProps: AlterProps){
        if (this.props !== prevProps) {
            this.setState({
                show: this.props.show || false
            })
        }
    }

    copyText(input: string, type: string){

        const el = document.createElement('textarea');
        el.value = input;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        toast.success(`Copied ${type} to clipboard.`, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
        });
    }

    render = () => {
        return (
            <Modal
                show={this.state.show}
                onHide={this.props.hide}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                contentClassName="mintModal"
                centered
            >
            <Modal.Header>
                <div style={{width: "100%"}} className="text-center"><h3>ALTER Subscription</h3></div>
            </Modal.Header>
            <Modal.Body>
                <Container>
                    <Row>
                        <p>Each Teddy mint includes a 1-year ALTER subscription redeemable at <a href="https://altermail.live">altermail.live</a><br/>
                        The login for your ALTER account is below. This may only be claimed once. If it has been claimed you will not be able to login.</p>

                        <div>
                            <h4>Username:&nbsp;</h4>
                            <span
                                className="pointer"
                                onClick={() => {
                                    //@ts-ignore
                                    this.copyText(this.props.nft?.private_metadata?.extension?.alter_username, "username")
                                }
                            }>
                                {
                                    //@ts-ignore
                                    this.props.nft?.private_metadata?.extension?.alter_username
                                }
                            </span>
                        </div>
                        <div style={{paddingTop: "20px"}}>
                            <h4>Password:&nbsp;</h4>
                            <span
                                className="pointer"
                                onClick={() => {
                                    //@ts-ignore
                                    this.copyText(this.props.nft?.private_metadata?.extension?.alter_password, "password")
                                }}
                            >
                                {
                                    //@ts-ignore
                                    this.props.nft?.private_metadata?.extension?.alter_password
                                }
                            </span>
                        </div>
                    </Row>
                </Container>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={this.props.hide}>
                Close
                </Button>
            </Modal.Footer>
        </Modal>
        )
    }
}

interface AuthProps {
    address?: string;
    show?: boolean;
    teddyId: string;
    hide: () => void;
}

interface AuthState {
    show: boolean;
    address?: string;
    loading: boolean;
    input: string;
    input2: string;
}

export class AuthModal extends React.Component<AuthProps, AuthState> {
    constructor(props: AuthProps) {
      super(props);
      this.state = {
        show: this.props.show || false,
        address: this.props.address,
        loading: false,
        input: "",
        input2: ""
      };
    }

    componentDidUpdate(prevProps: AuthProps){
        if (this.props !== prevProps) {
            this.setState({
                show: this.props.show || false
            })
        }
    }

    handleAuthorize = async() => {
        try {
            //show spinner and disable button
            this.setState({ loading: true });
    
            //show processing toast
            await toast.promise(
                addViewer(this.props.teddyId, this.state.input),
                {
                pending: {
                    render(){
                        return "Transaction Processing"
                    },
                    icon: true,
                },
                success: {
                    render({ data }){
                        return `Address Authorized`
                    },
                    // other options
                    //icon: "🟢",
                },
                error: {
                    render({ data }){
                        console.error(data);
                        // When the promise reject, data will contains the error
                        return data?.toString();
                    }
                }
                }
            )
        } catch(error: any){
            console.error(error);
            toast.error(error.toString());
        }
        this.setState({loading: false})
    }

    handleTransfer = async() => {
        try {
            //show spinner and disable button
            this.setState({ loading: true });
    
            //show processing toast
            await toast.promise(
                transferNft(this.props.teddyId, this.state.input2),
                {
                pending: {
                    render(){
                        return "Transaction Processing"
                    },
                    icon: true,
                },
                success: {
                    render({ data }){
                        return `Teddy transferred.`
                    },
                    // other options
                    //icon: "🟢",
                },
                error: {
                    render({ data }){
                        console.error(data);
                        // When the promise reject, data will contains the error
                        return data?.toString();
                    }
                }
                }
            )
        } catch(error: any){
            console.error(error);
            toast.error(error.toString());
        }
        this.setState({loading: false})
    }

    render = () => {
        return (
            <Modal
                show={this.state.show}
                onHide={this.props.hide}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                contentClassName="mintModal"
                centered
            >
            <Modal.Header>
                <div style={{width: "100%"}} className="text-center"><h3>Authorize and Transfer</h3></div>
            </Modal.Header>
            <Modal.Body>
                <Container>
                    <Row>
                        <p>Authorize an address to view your teddy's private metadata.<br/>
                        The viewer can lookup the ID and click the key to unlock the private data.</p>
                        
                    </Row>
                    <Row className="justify-content-center">
                        <Col xs={"auto"}>
                            Address
                        <input className="addressBox" value={this.state.input} style={{marginLeft:"10px"}} onChange={(event) => this.setState({input: event.target.value})} />
                        <button className="modalButton"  style={{marginLeft:"20px"}} onClick={() => this.handleAuthorize()} disabled={this.state.loading}> Authorize </button>
                        </Col>
                    </Row>
                    <Row style={{paddingTop:"50px"}}>
                        <p>Transfer your teddy to another Secret Network address.</p>
                    </Row>
                    <Row className="justify-content-center">
                        <Col xs={"auto"}>
                            Recipient
                        <input className="addressBox" value={this.state.input2} style={{marginLeft:"10px"}} onChange={(event) => this.setState({input2: event.target.value})} />
                        <button className="modalButton"  style={{marginLeft:"20px"}} onClick={() => this.handleTransfer()} disabled={this.state.loading}> Transfer </button>
                        </Col>
                    </Row>
                </Container>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={this.props.hide}>
                Close
                </Button>
            </Modal.Footer>
        </Modal>
        )
    }
}

export default { SwapModal, AuthModal };