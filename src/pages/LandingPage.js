import { Container, Row, Col, Button } from 'react-bootstrap'
import Header from '../components/Header'
import Meta from '../components/Meta'
import { Link } from "react-router-dom";
import LandingLayout from '../layout/LandingLayout'
import Jumbotron from 'react-bootstrap/Jumbotron';
import bgimage from '../assets/mtc_animated_compressed.GIF'
import React from 'react';

const descText1 = `


Until one day something changed..
`

const descText2 = `

`
class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expand: false
    };
  }

//const Home = () => {
  // page content

  expand = () => {
    this.setState({expand: true})
  }

  render () {
    const pageTitle = 'Midnight Teddy Club'
    const pageDescription = 'Enter the exclusive secret NFT collectuion by taking a membership role into our club with exclusive features down the roadmap.'
    return (
      <LandingLayout>
          <Meta title={pageTitle}/>
          <Container style={{ backgroundImage: `url(${bgimage})`, backgroundSize: 'cover'}} fluid>
            <Row style={{height: "300px"}}></Row>
            <Row style={{"paddingBottom": "20px"}}>
              <Col md={{ span: 5, offset: 1 }}>
                <div className='starter-template mt-5'>
                  <h1 className="welcomeText" >Welcome to the<br/>Midnight Teddy Club</h1>
                </div>
              </Col>
            </Row>
            <Row style={{"paddingBottom": "40px"}}>
              <Col md={{ span: 5, offset: 1 }}>
                <div className=''>
                  <Link to="/home">
                    <button type="button" className="btn btn-primary me-2 enterButton teddyButton">
                      ENTER
                    </button>
                  </Link>
                </div>
              </Col>
            </Row>
            <Row>
              <Col md={{ span: 10, offset: 1 }}>
              <p className="storyText">A Long time ago in the depths of Metaverse, Midnight Teddy’s, Rabbits , Punks, Apes and many others lived amongst one another in harmony.
  <br/>All of their traits, attributes and differences were accepted and loved by one another and on show for everyone to see.
  <br /><br/>
  Until one day something changed..&nbsp;&nbsp;&nbsp;
  {!this.state.expand ? <a onClick={this.expand} className='clickHereText'>CLICK HERE TO CONTINUE TO READ</a>
  :
  <>
  <br /><br/>
  A new Virus had arisen. They called it “RSV (right click save)”. This evil virus would allow duplicates to appear without permission.
  <br /><br/>
  News quickly spread.<br />
  It was discovered that the NGMI clans designed and distributed the virus spreading duplicates to new worlds claiming them their own.
  <br /><br/>
  The Midnight Teddy's & a handful of others quickly hid in the depths of a Secret Network where they knew they were safe.<br />
  Those that stayed on the old Networks were not so fortunate, they fell victim to the “Right click save Virus” 
  <br /><br/>
  Forced to hide their true identities to the public in fear of falling victim, the teddy’s formed a Secret Society where they could be themselves once more. 
  <br /><br/>
  The “Midnight Teddy Club” was born. 
  </>
  }
  </p>
            </Col>
            </Row>
          </Container>
          {/*
          <Container>
          <Jumbotron style={{ backgroundImage: `url(${bgimage})`, backgroundSize: 'cover' }}>
              <Row>
                <Col md={{ span: 10, offset: 1 }}>
                  <Image src="entry2.jpg" fluid/>
                </Col>
              </Row>
              <div className='starter-template text-center mt-5'>
                <h1>Welcome to the Midnight Teddy Club</h1>
                <p>{pageDescription}</p>
                <Link to="/home">
                  <button type="button" className="btn btn-outline-primary me-2 enterButton">
                    Enter
                  </button>
                </Link>
              </div>
            <h1>Regular, Jumbotron!</h1>
            <p>
              This is a simple Jumbotron example.
            </p>
        
            <p>
              <Button variant="primary">
                Primary Button
              </Button>
            </p>
          </Jumbotron>
          </Container>

          <Container style={{ backgroundImage: `url(${bgimage})`, backgroundSize: 'cover' }}>
            <Row>
              <Col md={{ span: 10, offset: 1 }}>
                <Image src="entry2.jpg" fluid/>
              </Col>
            </Row>
            <div className='starter-template text-center mt-5'>
              <h1>Welcome to the Midnight Teddy Club</h1>
              <p>{pageDescription}</p>
              <Link to="/home">
                <button type="button" className="btn btn-outline-primary me-2 enterButton">
                  Enter
                </button>
              </Link>
            </div>
          </Container>
          */}
      </LandingLayout>
    )
  }
}

export default Home