import React from 'react';
import { Container, Row, Col } from 'react-bootstrap'
import Image from 'react-bootstrap/Image'

class Member extends React.Component {
  constructor(props) {
    super(props);
  }
  render(){
    return (
      <div style={{"paddingBottom":"10px"}}>
        <span className="purpleText">{this.props.name}</span>
        <span className="memberTitle">&nbsp;&nbsp;&nbsp;{this.props.title}</span>
      </div>
    )
  }
}

const Team = () => {
  return (
    <Container>
      <Row className="align-items-end">
        <Col md={{ span: 3}} xs={12}>
          <h1 style={{"paddingBottom":"16px"}}>The Team</h1>
          <Member name="Teddy Bear" title="CEO of ALTER"/>
          <Member name="Ice Bear" title="CTO"/>
          <Member name="Griezly" title="Developer"/>
          <Member name="Europe Forest Bear" title="Designer"/>
        </Col>
        <Col md={{ span: "auto", offset: 1}} xs={{ span: 4, offset: 2}} className="align-items-end" style={{padding: "0px"}}>
            <a href="https://altermail.live"><Image src="alter.png" style={{width:"200px", padding:"0"}} fluid={true}/></a>
        </Col>
        <Col md={{span:"auto"}} xs={{ span: 4}} className="align-items-end" style={{padding: "0px"}}>
            <Image src="papabear.png" style={{width:"200px", padding:"0"}} fluid={true}/>
        </Col>
        <Col md={{span:"auto", offset:0}} xs={{ span: 4, offset: 2}} className="align-items-end" style={{padding: "0px"}}>
            <a href="https://trivium.network"><Image src="trivium.jpg" style={{width:"200px", padding:"0"}} fluid={true} title="Trivium Node"/></a>
        </Col>
        <Col md={{span:"auto"}} xs={{ span: 4}} className="align-items-end" style={{padding: "0px"}}>
            <Image src="designer.png" style={{width:"200px", padding:"0"}} fluid={true}/>
        </Col>
      </Row>
      <Row style={{paddingTop:"40px", paddingBottom:"40px", fontSize: "16px"}}>
        <span>
          We’ve been working hard over the course of the last 6 months bringing this project to life, we hope that you all love it as much as we do!
        </span>
      </Row>
    </Container>
  )
}

export default Team
