import { Link } from "react-router-dom";
import { Nav, Container, Col } from "react-bootstrap";
import Image from 'react-bootstrap/Image'

import SocialLogos from './SocialLogos.js'

const Menu = () => {
  return (
    <Container>

      <header className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4">
        <Col>
        </Col>
        <Col md="auto">
          <Image src="logo.png" />
        </Col>
        <Col>
        
        <SocialLogos />
        </Col>
      </header>
    </Container>
  );
};

export default Menu;
