import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'
import Select from 'react-select';
import Meta from '../components/Meta'
import Image from 'react-bootstrap/Image'
import { Nav, Container, Col, Row, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import TeddyInfo from '../components/gallery/teddyCardModal'
import TeddyCard from '../components/gallery/teddyCard';
import { getPublicTeddyData, truncate } from '../utils/dataHelper'
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from "axios";
import clubBanner from '../assets/club_banner.jpg'
import FactorySelector from '../components/factory/FactorySelector';


// Layout
import Layout from "../layout/Layout";
import FactoryInfo from '../components/factory/FactoryInfo';
import TraitFactorySelector from '../components/factory/TraitFactorySelector';

function Padding({size}: {size: string | number}){
  return (
    <div style={{height:`${size}px`}} />
  )
}

//class Factory extends React.Component {
export default function TraitFactory(){
  const [showFactory, setShowFactory] = useState(false);
  const [selectedTeddies, setSelectedTeddies] = useState<string[]>([]);
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
            <TraitFactorySelector selectedTeddies={selectedTeddies as [string, string]} />
            
            :
              <Row><h2>Factory Maintenance</h2><h5>The factory is currently disabled for maintenance, please try again later.</h5></Row>
            }

          </Container>
        </Layout>
        )
    } else {
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
                  <Link to="/gallery">
                    <Button className="keplrButton" type="button" style={{width:"190px", height:"55px"}}>Gallery</Button>
                  </Link>
                </div>
              </Col>
            </Row>
      </Container>
      </Layout>
    )
  }
}