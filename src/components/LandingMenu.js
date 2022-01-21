import { Link } from "react-router-dom";
import { Nav, Container, Col, Row } from "react-bootstrap";
import Image from 'react-bootstrap/Image'

import SocialLogos from './SocialLogos.js'

const Menu = () => {
  return (
    <Container style={{paddingTop: "10px", paddingBottom: "20px"}}>
      <Row className="justify-content-end">


        <Col className="text-center" md={{span:4, offset:0}} sm={{span:6}}>
          <Image src="logo.png"/>
        </Col>
        
        <Col md={4} xs={6}>
          <div style={{height: "100%", display: "flex"}} className="align-items-center justify-content-end">
          <SocialLogos style={{"paddingLeft":"20px"}}/>

          </div>
        </Col>
        </Row>    

    </Container>
  );
};

export default Menu;
