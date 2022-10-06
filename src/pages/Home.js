import Header from '../components/Header'
import React from 'react';
import Meta from '../components/Meta'
import Image from 'react-bootstrap/Image'
import { Nav, Container, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Element, scroller } from 'react-scroll'
import Welcome from "../components/home/Welcome"
import MintRow from "../components/home/Mint"
import Specs from "../components/home/Specs"
import Roadmap from "../components/home/Roadmap"
import Factory from "../components/home/Factory"
import Tools from "../components/home/Tools"
import Team from "../components/home/Team"
import clubBanner from '../assets/club_banner.jpg'

// Layout
import Layout from "../layout/Layout";

class Padding extends React.Component {
  constructor(props) {
    super(props);
  }

  render(){
    return (
      <div style={{height:`${this.props.size}px`}} />
    )
  }
}

//const Home = () => {
class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      jumpto: this.props.jumpto || null
    };
  }

  componentDidMount = () => {
    if (this.props.jumpto) {
      scroller.scrollTo(this.props.jumpto, {
        smooth: "easeInOutQuart",
        duration: 500,
        delay: 1000,
      });
    }
  }


  render() {
    const pageTitle = 'Midnight Teddy Club'

    return (
      <Layout home={true}>
      <div style={{width: "100%"}}>
        
        <Meta title={pageTitle}/>
        <Container>
          <Row>
            <Col xs={12}>
            <Image src={clubBanner} fluid/>

            </Col>
          </Row>
        </Container>
        <Padding size={30}/>
        <Welcome />
        <Padding size={75}/>
        <MintRow />
        <Padding size={75}/>
        <Specs />
        <Padding size={75}/>
        <Container>
          <Row>
            <Image src="banner.png" fluid/>
          </Row>
        </Container>
        
        <Element name="roadmapElement" id="roadmapElement" className="element" >
          <Padding size={75}/>
          <Roadmap />
        </Element>
        <Padding size={75}/>
        <Factory />
        <Padding size={75}/>
        <Tools />
        <Element name="teamElement" id="teamElement" className="element" >
          <Padding size={75}/>
          <Team />
        </Element>
      </div>
      </Layout>
    )
  }
}

export default Home