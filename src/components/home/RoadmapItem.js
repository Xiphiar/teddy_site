import ellipse from '../../assets/ellipse.png'
import React from 'react';

class Number extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const id = `roadmap-num-${this.props.number}`
    return (
      <div className="roadmapEllipse" id={id} key={id} >
        <img src={ellipse} style={{width:"100px"}}/>
        <div className="roadmapNumber poppins">{this.props.number}.</div>
      </div>
    )
  }
}

class Item extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const id = `roadmap-item-${this.props.number}`
    return (
      <div className="roadmapItem" id={id}>
      <Number number={this.props.number}/>
      <div key={id}>
        <span>
          {this.props.text}
        </span>
      </div>
    </div>
    )
  }
}

export default Item
