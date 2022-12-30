import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import Meta from '../components/Meta'
import Image from 'react-bootstrap/Image'
import { Nav, Container, Col, Row, Button, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import TeddyInfo from '../components/gallery/teddyCardModal'
import { queryBurntTokens, queryOwnedTokens } from "../utils/queryHelper";
import TeddyCard from '../components/gallery/teddyCard';
import { getPublicTeddyData, truncate } from '../utils/dataHelper'
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from "axios";
import clubBanner from '../assets/club_banner.jpg'
import TicketCounter from '../components/gallery/TicketCounter';

import { getSigningClient } from '../utils/txHelper';


// Layout
import Layout from "../layout/Layout";
import TeddyTile from '../components/gallery/teddyTile';
import { SecretNetworkClient } from 'secretjs';

const factoryAdmin = process.env.REACT_APP_FACTORY_ADMIN || 'secret1s7hqr22y5unhsc9r4ddnj049ltn9sa9pt55nzz';




const style = {
  height: 50,
  border: "1px solid green",
  margin: 6,
  padding: 8
};

const baseOptions = [
  { value: 'standard', label: 'Standard' },
  { value: 'headless', label: 'Headless' },
  { value: 'alien', label: 'Alien' },
  { value: 'zombie', label: 'Zombie' },
  { value: 'robot', label: 'Robot' },
];

const burntOptions = [
  { value: true, label: 'Only Burnt' },
  { value: false, label: 'Only Unburnt' }
];

const sortOptions = [
  { value: 'numberasc', label: 'Number (Asc)' },
  { value: 'numberdesc', label: 'Number (Desc)' },
  { value: 'rarityasc', label: 'Rarity (Asc)' },
  { value: 'raritydesc', label: 'Rarity (Desc)' },
];

// class Padding extends React.Component {
//   constructor(props: {s}) {
//     super(props);
//   }

//   render(){
//     return (
//       <div style={{height:`${this.props.size}px`}} />
//     )
//   }
// }

function Padding({ size }: { size: string | number; }) {
  return (
    <div style={{height:`${size}px`}} />
  )
}

// class Gallery extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       //sort: {value: 'numberasc', label: 'Number (Asc)'},
//       //base: [],
//       //burnt: false,
//       //sortPlaceholder: "Number (Asc)",
//       loadingOwned: false,
//       showTeddy: this._showTeddy || false,
//       lookupID: this._lookupID || "",
//       clickedID: null,
//       //items: [],
//       page: 1,
//       queryPermit: {},
//       tokenList: [],
//       tokensLoaded: false,
//       owned: false,
//       factoryTeddies: [],
//       factoryToast: null,
//       showCheckBoxes: false
//     };
//   }

interface Props {
  _lookupID?: string;
}
function BurnGallery({ _lookupID }: Props) {
  const [loadingBurnt, setLoadingBurnt] = useState(false);
  const [showTeddy, setShowTeddy] = useState(false);
  
  const [lookupID, setLookupID] = useState(_lookupID || "");
  const [clickedID, setClickedID] = useState('');
  // const [page, setPage] = useState(1);
  const [tokenList, setTokenList] = useState<string[]>([]);
  const [tokensLoaded, setTokensLoaded] = useState(false);

  useEffect(()=>{
    if (_lookupID){
      setLookupID(_lookupID)
      handleLookup();
    } else {
      QueryBurnt();
    }
  },[])

  const handleClickTile = (data: string) => {
    setShowTeddy(true);
    setClickedID(data);
  }

  const showGallery = () => {
    setShowTeddy(false);
    setLookupID('');
    setClickedID('');
  }

  const QueryBurnt = async() => {
    //disable Mint button and show spinner
    setLoadingBurnt(true);

    const data = await queryBurntTokens();
    if (data.length){
      setLoadingBurnt(false);
      setTokensLoaded(true);
      setTokenList(data);
    } else {
      toast.error(`No teddies found in Mount Doom. Something is probably wrong with the nodes 🙄`,{
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        
      });
      setLoadingBurnt(false)
    } 
  }

  const handleLookupIDChange = (event: any) => {
    setLookupID(event.target.value)
  }

  const handleLookup = () => {
    setClickedID(lookupID.trim())
    setShowTeddy(true);
  }
  const pageTitle = 'Midnight Teddy Club'
  if (showTeddy){
    return (
      <Layout>
        <Meta title={pageTitle}/>
        <Container>
          <Row>
            <h1 className="homeTitle">Burn Gallery</h1>
          </Row>
          <Padding size={30}/>
          <TeddyCard mt_doom={true} owned={false} handleBack={showGallery} id={clickedID}/>
        </Container>
      </Layout>
      )
  }
  if (tokensLoaded){
    return (
      <Layout>
        <Meta title={pageTitle}/>
        {/*<FactoryToast selected={this.state.factoryTeddies.length} />*/}
        <Container>
        <Row>
          <Image src={clubBanner} id='my-img2' fluid/>
        </Row>
        <Padding size={30}/>
          <Row className="justify-content-between">
            <Col md={'auto'}>
              <h1 className="homeTitle">Burn Gallery</h1>
            </Col>
          </Row>

          <Padding size={50}/>

          <Row className="justify-content-center">
            { tokenList.length ? 
              <div className="d-flex" style={{flexWrap: "wrap", justifyContent: 'space-evenly'}}>
                {tokenList.map((item, index) => {
                    return (<TeddyTile id={item} index={index} showCheckBox={false} totalChecked={0} clickHandler={handleClickTile} checkHandler={() => undefined} key={`teddy-tile-${item}`} />)
                })}
              </div>
            :
              <div className="d-flex" style={{flexWrap: "wrap", justifyContent: 'space-evenly'}}>
                <h3>No Teddies Found 😔</h3>
              </div>
            }

          </Row>

        </Container>
      </Layout>
      )
  } else {
  return (
    <Layout>
      <Meta title={pageTitle}/>
      <Container>
      <Row>
        <Image src={clubBanner} id='my-img2' fluid/>
      </Row>
      <Padding size={30}/>
      
      <Row>
        <h1 className="homeTitle">Burn Gallery</h1>
      </Row>
      <Padding size={30}/>
        
          <Row>
            <Col>
              <h2>Loading...</h2>

            </Col>
          </Row>
    </Container>
    </Layout>
  )
  }
}

function WrappedBurnGallery() {
  const params = useParams();
    return (
    <BurnGallery
      _lookupID={params.lookupID}
      // etc...
    />
  );
}

export { BurnGallery, WrappedBurnGallery };