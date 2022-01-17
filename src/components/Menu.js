import { Link } from "react-router-dom";
import { Nav, Container } from "react-bootstrap";
import Image from 'react-bootstrap/Image'
import SocialLogos from './SocialLogos.js'

import { Link as ScrollLink, DirectLink, Element, Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll'

const Menu = () => {
  return (
    <Container>
      <header className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-5">
        <Image src="logo.png" />
        <Nav>
          <ul className="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0 teddyNavBar" style={{"paddingRight":"20px"}}>
            <li style={{"paddingTop":"3px", "paddingRight":"40px"}}>
              <Link to="/mint" className="nav-link px-2 link-secondary">
              <button type="button" className="btn btn-outline-primary me-2 navMintButton teddyButton">
                MINT A TEDDY
              </button>
              </Link>
            </li>
            <li style={{"paddingTop":"5px", "paddingRight":"40px"}}>
              <ScrollLink activeClass="active" className="nav-link px-2 teddyNavLink" to="roadmapElement" spy={true} smooth={true} duration={500} >
                OUR PLAN
              </ScrollLink>
            </li>
            <li style={{"paddingTop":"5px", "paddingRight":"40px"}}>
              <ScrollLink activeClass="active" className="nav-link px-2 teddyNavLink" to="teamElement" spy={true} smooth={true} duration={500} >
                TEAM
              </ScrollLink>
            </li>
            <li style={{"paddingTop":"5px", "paddingRight":"40px"}}>
              <Link to="/gallery" className="nav-link px-2 teddyNavLink">
                SHOWCASE
              </Link>
            </li>
          </ul>
          <SocialLogos style={{"paddingLeft":"20px"}}/>
        </Nav>
        
      </header>
    </Container>
  );
};

export default Menu;
