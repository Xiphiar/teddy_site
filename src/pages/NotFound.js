import { Link } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import Meta from '../components/Meta'
import Image from 'react-bootstrap/Image'
import Layout from "../layout/Layout";

const Padding = (size) => {
  console.log("SIZE",size)
    return (
      <div style={{paddingTop:`${size}px`}} />
    )
}

const NotFound = () => {
  const pageTitle = '404 Midnight Teddy Club'
  return (
    <Layout>
      <Meta title={pageTitle}/>
      <Container>
          <Row>
            <Image src="club_banner.jpg" id='my-img2' fluid={true}/>
          </Row>
          <Padding size={30}/>

          <Row className="text-center" style={{paddingTop:`30px`}}>
            <h1 class="homeTitle">Page Not Found</h1>
          </Row>
        
          <Row className="justify-content-center">
            <Col xs={"auto"} className="text-center">
              <div style={{paddingBottom: "20px"}}><h2>We couldnt find that page.</h2></div>
              <Link to="/home"><button className="mintButton teddyButton">Home</button></Link>
            </Col>
          </Row>
      </Container>
    </Layout>
  );
};

export default NotFound;
