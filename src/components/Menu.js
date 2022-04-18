import { Link } from "react-router-dom";
import { Nav, Container, Row, Col } from "react-bootstrap";
import Image from 'react-bootstrap/Image'
import SocialLogos from './SocialLogos.js'
import Countdown from 'react-countdown';

import { Link as ScrollLink, DirectLink, Element, Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll'

// Renderer callback with condition
const renderer = ({ days, hours, minutes, seconds, completed }) => {
  if (completed) {
    // Render a completed state
    return (
      <Link to="/mint" className="nav-link px-2 link-secondary">
        <button type="button" className="btn btn-outline-primary me-2 navMintButton teddyButton">
          MINT A TEDDY
        </button>
    </Link>
    );
  } else {
    // Render nothing
    return(
      <div style={{width:"200px"}}/>
    );
  }
};

// Renderer callback with condition
const renderer2 = ({ days, hours, minutes, seconds, completed }) => {
  if (completed) {
    // Render a completed state
    return (
      <Col className="text-center" sm="auto" style={{paddingRight: "30px"}}>
        <Link to="/gallery" className="nav-link px-2 teddyNavLink">
          SHOWCASE
        </Link>
      </Col>
    );
  } else {
    // Render nothing
    return(
      null
    );
  }
};

const date = new Date(Date.UTC(2022, 1, 26, 14))

const Menu = (home) => {
  return (
    <Container style={{paddingTop: "30px", paddingBottom: "10px"}}>
      <Row>

        <Col className="text-center" md={{span:2, offset:0}} sm={{span:12}} style={{paddingBottom: "20px"}}>
          <Link to="/home">
            <Image src="logo.png"/>
          </Link>
        </Col>

        <Col md={{span: "6"}} xs={{span:12, offset:0}}  style={{paddingBottom: "20px", marginLeft: "auto"}}>
            <Row className="align-items-center justify-content-end" style={{height: "100%"}}>
                <Col className="text-center d-none d-md-block" sm="auto"  style={{paddingRight: "30px"}}>
                  <Countdown date={date } renderer={renderer} />
                </Col>

                <Col className="text-center" sm="auto"  style={{paddingRight: "30px"}}>
                  {home.home ?
                    <ScrollLink to="roadmapElement" activeClass="active" className="nav-link px-2 teddyNavLink" spy={true} smooth={true} duration={500} >
                      OUR PLAN
                    </ScrollLink>
                  :
                    <Link to="/roadmap" className="nav-link px-2 teddyNavLink">
                      OUR PLAN
                    </Link>
                  }

                </Col>

                <Col className="text-center" sm="auto" style={{paddingRight: "30px"}}>
                {home.home ?
                    <ScrollLink activeClass="active" className="nav-link px-2 teddyNavLink" to="teamElement" spy={true} smooth={true} duration={500} >
                      TEAM
                    </ScrollLink>
                  :
                    <Link to="/team" className="nav-link px-2 teddyNavLink">TEAM</Link>
                  }
                </Col>

                <Countdown date={date } renderer={renderer2} />

                {/*
                <Col className="text-center" sm="auto" style={{paddingRight: "30px"}}>
                  <Link to="/gallery" className="nav-link px-2 teddyNavLink">
                    SHOWCASE
                  </Link>
                </Col>
                */}
            </Row>
        </Col>
        
        <Col md="auto" xs={12}   style={{paddingBottom: "20px"}}>
            <div style={{height: "100%", display: "flex"}} className="align-items-center justify-content-center">
              <SocialLogos white={true} style={{"paddingLeft":"20px"}}/>
            </div>
        </Col>
      </Row>    
      { process.env.REACT_APP_USE_TESTNET === 'true' ?
      <>
        <span>Testnet Mode!</span>
        <span style={{fontSize: '12px'}}>
          <b>&emsp;Chain ID: </b>{process.env.REACT_APP_TESTNET_CHAIN_ID}&emsp;<b>REST: </b>{process.env.REACT_APP_TESTNET_REST}<br />
          <b>Token: </b>{process.env.REACT_APP_TOKEN_ADDRESS}&emsp;<b>NFT: </b>{process.env.REACT_APP_CONTRACT_ADDRESS}&emsp;
          <b>Ticket: </b>{process.env.REACT_APP_TICKET_ADDRESS}</span>
          </>
      :
        null
      }
    </Container>
  );
};

export default Menu;
