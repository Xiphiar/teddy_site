import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'
import Select from 'react-select';
import Meta from '../components/Meta'
import Image from 'react-bootstrap/Image'
import { Nav, Container, Col, Row, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import TeddyInfo from '../components/gallery/teddyCardModal'
import { getSigningClient, getPermit, permitName, allowedTokens, permissions } from "../utils/keplrHelper";
import { queryOwnedTokens } from "../utils/dataHelper";
import TeddyCard from '../components/gallery/teddyCard';
import { getPublicTeddyData, truncate } from '../utils/dataHelper'
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from "axios";
import clubBanner from '../assets/club_banner.jpg'
import { TicketCounter } from '../components/gallery/TicketCounter';
import FactorySelector from '../components/factory/FactorySelector';


// Layout
import Layout from "../layout/Layout";
import { TeddyTile } from '../components/gallery/teddyTile';
import FactoryInfo from '../components/factory/FactoryInfo';

class Padding extends React.Component {
  render(){
    return (
      <div style={{height:`${this.props.size}px`}} />
    )
  }
}

//class Factory extends React.Component {
function Factory(props){
  const [showFactory, setShowFactory] = useState(false);
  const [loadingOwned, setLoadingOwned] = useState(false);
  const [selectedTeddies, setSelectedTeddies] = useState([]);
  const location = useLocation()
  const passedTeddies = location.state?.selectedTeddies || []
  console.log("passed State", passedTeddies)

  const pageTitle = 'Midnight Teddy Club'

  useEffect(() => {
    if (passedTeddies.length){
      setShowFactory(true);
      setSelectedTeddies(passedTeddies);
    }
  },[passedTeddies])


    // SHOW FACTORY SCREEN
    if (showFactory){
      return (
        <Layout>
          <Meta title={pageTitle}/>
          <Container>
            <Row>
              <h1 className="homeTitle">Midnight Teddy Factory</h1>
            </Row>
            <Padding size={30}/>
            { process.env.REACT_APP_FACTORY_ENABLED === "true" ? 
            <FactorySelector selectedTeddies={selectedTeddies} />
            
            :
              <Row><h2>Factory Maintenance</h2><h5>The factory is currently disabled for maintenance, please try again later.</h5></Row>
            }

          </Container>
        </Layout>
        )
    }else {
    // SHOW FACTORY INFO
    return (
      <Layout>
        <Meta title={pageTitle}/>
        <Container>
        <Row>
          <Image src={clubBanner} id='my-img2' fluid/>
        </Row>
        <Padding size={30}/>
        

        <Padding size={30}/>
          <FactoryInfo />
            <Row>
              <Col md="6">
                <h2>View Your Teddies</h2>
                <p>Click the button below to visit the gallery to select teddies to send to the factory.</p>

              </Col>
            </Row>
            <Row>
              <Col md="6">
              <div className="text-center">
                  { loadingOwned ?
                    <Button className="keplrButton" disabled={true}  style={{width:"190px", height:"55px"}}><i className="c-inline-spinner c-inline-spinner-white" /></Button>
                  :
                    <Button className="keplrButton" onClick={() => this.queryOwned()} style={{width:"190px", height:"55px"}}>Connect Keplr</Button>
                  }
                </div>
              </Col>
            </Row>
      </Container>
      </Layout>
    )
  }
}

function WrappedFactory() {
  const params = useParams();
    return (
    <Factory
      lookupTeddy={true}
      lookupID={params.lookupID}
      // etc...
    />
  );
}

export { Factory, WrappedFactory };