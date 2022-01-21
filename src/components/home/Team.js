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
            <Image src="team1.png" style={{width:"200px", padding:"0"}} fluid={true}/>
        </Col>
        <Col md={{span:"auto"}} xs={{ span: 4}} className="align-items-end" style={{padding: "0px"}}>
            <Image src="team1.png" style={{width:"200px", padding:"0"}} fluid={true}/>
        </Col>
        <Col md={{span:"auto", offset:0}} xs={{ span: 4, offset: 2}} className="align-items-end" style={{padding: "0px"}}>
            <Image src="team1.png" style={{width:"200px", padding:"0"}} fluid={true}/>
        </Col>
        <Col md={{span:"auto"}} xs={{ span: 4}} className="align-items-end" style={{padding: "0px"}}>
            <Image src="team1.png" style={{width:"200px", padding:"0"}} fluid={true}/>
        </Col>
      </Row>
    </Container>
  )
}

export default Team
