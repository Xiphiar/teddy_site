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
        <span className="purpleText">{this.props.name}</span><br className="d-xxl-none"/>
        <span className="memberTitle">&nbsp;&nbsp;&nbsp;{this.props.title}</span>
      </div>
    )
  }
}

const Team = () => {
  return (
    <Container>
      <Row className="align-items-end">
        <Col lg={{ span: 4}} xs={12}>
          <h1 style={{"paddingBottom":"16px"}}>The Team</h1>
          <Member name="Freeman Bear / Mr Freeman" title="Co-Founder"/>
          <Member name="Chewie Bear / Papa Bear" title="Co-Founder"/>
          <Member name="Trivium Bear" title="Development Team"/>
          <Member name="Teddy Knight / Slygood" title="Artist"/>
        </Col>
        <Col lg={{ span: 2, offset: 0}} xs={{ span: 4, offset: 2}} className="align-items-end" style={{padding: "0px"}}>
            <a href="https://altermail.live"><Image src="alter.png" style={{padding:"0"}} fluid={true}/></a>
        </Col>
        <Col lg={{span:2}} xs={{ span: 4}} className="align-items-end" style={{padding: "0px"}}>
            <Image src="papabear.png" style={{padding:"0"}} fluid={true}/>
        </Col>
        <Col lg={{span:2, offset:0}} xs={{ span: 4, offset: 2}} className="align-items-end" style={{padding: "0px"}}>
            <a href="https://trivium.network"><Image src="trivium.jpg" style={{padding:"0"}} fluid={true} title="Trivium Node"/></a>
        </Col>
        <Col lg={{span:2}} xs={{ span: 4}} className="align-items-end" style={{padding: "0px"}}>
            <a href="https://www.artstation.com/ashcrow001"><Image src="designer.png" style={{padding:"0"}} fluid={true}/></a>
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
