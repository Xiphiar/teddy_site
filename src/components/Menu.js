import { Link } from "react-router-dom";
import { Nav, Container, Row, Col } from "react-bootstrap";
import Image from 'react-bootstrap/Image'
import SocialLogos from './SocialLogos.js'

import { Link as ScrollLink, DirectLink, Element, Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll'

const Menu = () => {
  return (
    <Container style={{paddingTop: "30px", paddingBottom: "10px"}}>
      <Row>


        <Col className="text-center" md={{span:2, offset:0}} sm={{span:12}} style={{paddingBottom: "20px"}}>
          <Image src="logo.png"/>
        </Col>
        <Col md={{span: "6", offset: 2}} xs={{span:12, offset:0}}  style={{paddingBottom: "20px"}}>
          <Row className="align-items-center justify-content-end" style={{height: "100%"}}>
          <Col className="text-center d-none d-md-block">
            <Link to="/mint" className="nav-link px-2 link-secondary">
              <button type="button" className="btn btn-outline-primary me-2 navMintButton teddyButton">
                MINT A TEDDY
              </button>
            </Link>
          </Col>
          <Col className="text-center">
            <ScrollLink activeClass="active" className="nav-link px-2 teddyNavLink" to="roadmapElement" spy={true} smooth={true} duration={500} >
              OUR PLAN
            </ScrollLink>
          </Col>
          <Col className="text-center">
            <ScrollLink activeClass="active" className="nav-link px-2 teddyNavLink" to="teamElement" spy={true} smooth={true} duration={500} >
              TEAM
            </ScrollLink>
          </Col>
          <Col className="text-center">
            <Link to="/gallery" className="nav-link px-2 teddyNavLink">
              SHOWCASE
            </Link>
          </Col>
          </Row>
        </Col>
        
        <Col md={2} xs={12}   style={{paddingBottom: "20px"}}>
          <div style={{height: "100%", display: "flex"}} className="align-items-center justify-content-center">
          <SocialLogos white={true} style={{"paddingLeft":"20px"}}/>

          </div>
        </Col>
        </Row>    

    </Container>
  );
};

export default Menu;
