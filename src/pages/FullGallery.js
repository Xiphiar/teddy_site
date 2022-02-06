import Header from '../components/Header'
import React from 'react';
import Select from 'react-select';
import Meta from '../components/Meta'
import Image from 'react-bootstrap/Image'
import { Nav, Container, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import TeddyInfo from '../components/gallery/teddyInfo'

import InfiniteScroll from 'react-infinite-scroll-component';

import axios from "axios";

// Layout
import Layout from "../layout/Layout";

const backendUrl = "http://localhost:9176"

const hash = 'QmQut4RpE5tYE7WD3yc17okr1TC8HDg3xPk3BPcog6XfFs'
const url="https://ipfs.io/ipfs/QmQut4RpE5tYE7WD3yc17okr1TC8HDg3xPk3BPcog6XfFs"
const key = "c9afac7fbed9cc01f66237d3e108bdc9aa"





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

const ownedOptions = [
  { value: true, label: 'Only Owned' }
];

const sortOptions = [
  { value: 'numberasc', label: 'Number (Asc)' },
  { value: 'numberdesc', label: 'Number (Desc)' },
  { value: 'rarityasc', label: 'Rarity (Asc)' },
  { value: 'raritydesc', label: 'Rarity (Desc)' },
];

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

class TeddyTile extends React.Component {
  constructor(props) {
    super(props);
  }

  render(){
    return (
      <a onClick={this.props.clickHandler}>
      <div style={{paddingBottom: "15px"}} >
        <Image src="team1.png" rounded />
        <h5>Midnight Teddy #{this.props.id}</h5>
      </div>
      </a>
    )
  }
}

class Gallery extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sort: {value: 'numberasc', label: 'Number (Asc)'},
      base: [],
      burnt: false,
      owned: false,
      sortPlaceholder: "Number (Asc)",
      items: [],
      page: 1,
      show: false
    };
  }

  queryBackendAll = async(page=1, sort=this.state.sort, base=this.state.base) => {
    let baseOpt = ""
    if (base.length){
      const values = base.map(function (item) {
        return item.value;
      });
      baseOpt = `&base=${values.join(',')}`
      console.log(baseOpt);
    }
    console.log(`${process.env.REACT_APP_BACKEND_URL}/teddy?page=${page}&sort=${sort.value}${baseOpt}`)
    const backendRes = await fetch(`${process.env.REACT_APP_BACKEND_URL}/teddy?page=${page}&sort=${sort.value}${baseOpt}`);
    let backendData = await backendRes.json(); //extract JSON from the http response
    //backendData.data[0].attributes = JSON.parse(backendData.data[0].attributes);
    //console.log(backendData.data);
    return backendData.data;
  }

  componentDidMount = async() => {
    console.log("did Mount")
    let data = await this.queryBackendAll(1);
    this.setState({items: data, page: 1})

    /*
    let test = await axios.post(`https://stashhapp-public-testnet.azurewebsites.net/decrypt`, { url, key }).catch((err) => {
      console.log(err)
    });
    console.log(test)
    this.setState({testdata: test})
    */
  }

  handleClick = (data) => {
    console.log(data)
    this.setState({
      show: true,
      clicked: data
    })
    console.log(this.state)
  }

  handleHide = () => {
    this.setState({
      show: false
    })
  }

  refreshData = async() => {
    let data = await this.queryBackendAll(1);
    this.setState({
      items: data,
      page: 1
    });
    console.log(this.state);
  }

  fetchMoreData = async() => {
    let newPage = this.state.page + 1;
    let data = await this.queryBackendAll(newPage);
    this.setState({
      items: this.state.items.concat(data),
      page: newPage
    });
    /*
    // a fake async api call like which sends
    // 20 more records in 1.5 secs
    setTimeout(() => {
      this.setState({
        items: this.state.items.concat(Array.from({ length: 20 }))
      });
    }, 1500);
    */
  };

  handleSort = async(sort) => {
    let data = await this.queryBackendAll(1, sort);

    this.setState({
      sort, 
      items: data,
      page: 1
    })
    //await this.refreshData();
  };

  handleBurnt = (burnt) => {
    this.setState({ burnt }, () =>
      console.log(`Option selected:`, this.state.burnt)
    );
  };

  handleOwned = (owned) => {
    this.setState({ owned }, () =>
      console.log(`Option selected:`, this.state.owned)
    );
  };

  handleBase = async(base) => {
    let data = await this.queryBackendAll(1, this.state.sort, base);

    this.setState({
      base, 
      items: data,
      page: 1
    })
  };

  render () {
    // page content
    const pageTitle = 'Home'
    const { base, burnt, owned, sort } = this.state;
    const customStyles = {
      option: (provided, state) => ({
        ...provided,
        borderBottom: '1px solid #C152F5',
        color: "#FFF",
        "background-color": "black"
      }),
      container: (base, state) => ({
        ...base,
        "padding-bottom": "20px",
      }),
      control: (base, state) => ({
        ...base,
        background: "black",
        // Overwrittes the different states of border
        borderColor: "white",
        // Removes weird border around container
        boxShadow: state.isFocused ? null : null,
        "&:hover": {
          // Overwrittes the different states of border
          borderColor: "#C152F5"
        }
      }),
      singleValue: (provided, state) => {
        const opacity = state.isDisabled ? 0.5 : 1;
        const transition = 'opacity 300ms';
        return { ...provided, opacity, transition };
      },
      menu: (base, state) => ({
        ...base,
        "background-color": "black",
        // Overwrittes the different states of border
        //borderColor: "white",
        // Removes weird border around container
        //boxShadow: state.isFocused ? null : null,
        //"&:hover": {
          // Overwrittes the different states of border
        //  borderColor: "#C152F5"
        //}
      }),
    }
    return (
      <Layout>
      <TeddyInfo show={this.state.show} hide={() => this.handleHide()} data={this.state.clicked}/>
      <div>
        <Meta title={pageTitle}/>
        <Container>
          <Row>
            <Image src="homeBanner.png" id='my-img' fluid={true}/>
          </Row>
          {/*<Row>
            <img src={`data:image/png;base64,${this.state.testdata}`}/>
          </Row>*/}
        </Container>
        <Padding size={30}/>
        <Container>
        <Row>
          <Col md={3}>
              <h6>Base Design</h6>
              <Select
                value={base}
                onChange={this.handleBase}
                options={baseOptions}
                isMulti={true}
                styles={customStyles}
              />
              <h6>Burnt</h6>
              <Select
                value={burnt}
                onChange={this.handleBurnt}
                options={burntOptions}
                styles={customStyles}
                isClearable={true}
              />
              <h6>Owned</h6>
              <Select
                value={owned}
                onChange={this.handleOwned}
                options={ownedOptions}
                isMulti={false}
                isClearable={true}
                styles={customStyles}
              />
              <h6>Sort</h6>
              <Select
                value={sort}
                //defaultValue={sort}
                onChange={this.handleSort}
                options={sortOptions}
                styles={customStyles}
                hideSelectedOptions={true}
              />
          </Col>
          <Col md={9}>
          <InfiniteScroll
            dataLength={this.state.items.length} //This is important field to render the next data
            next={this.fetchMoreData}
            hasMore={true}
            style={{display: 'flex', flexWrap: "wrap", justifyContent: "space-evenly"}}
            loader={<h4>Loading...</h4>}
            endMessage={
              <p style={{ textAlign: 'center' }}>
                <b>Yay! You have seen it all</b>
              </p>
            }
          >
          {this.state.items.map((i, index) => (
            <TeddyTile id={i.id} clickHandler={() => this.handleClick(i)}/>
          ))}
          </InfiniteScroll>
          </Col>
        </Row>
      </Container>
      </div>
      </Layout>
    )
  }
}

export default Gallery