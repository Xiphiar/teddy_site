import ellipse from '../../assets/ellipse.png'
import React from 'react';


function Number({number}) {
  const id = `roadmap-num-${number}`
  return (
    <div className="roadmapEllipse" key={id} >
      <img src={ellipse} style={{width:"100px"}} alt={`Roadmap Item ${number}`}/>
      <div className="roadmapNumber poppins">{number}.</div>
    </div>
  )
}

function Item({number, text}){
  const id = `roadmap-item-${number}`
  return (
    <div className="roadmapItem" key={id}>
      <Number number={number}/>
      <div>
        {text}
      </div>
    </div>
  )
}

export default Item
