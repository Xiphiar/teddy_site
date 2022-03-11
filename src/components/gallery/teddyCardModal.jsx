import React from 'react';
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { getPermit, permitName, allowedTokens, permissions } from "../../utils/keplrHelper";
import './teddyCard.css';
//import styles from './dark.min.module.css';

//modal
class TeddyCard extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        show: this.props.show || false
      };
    }

    componentDidMount = () => {
        //check for owned prop and query priv data
        //otherwise show provided public data

    }

    async componentDidUpdate(prevProps){
        if (this.props !== prevProps) {
            this.setState({
                show: this.props.show || false,
                id: this.props.id || null,
                queryPermit: this.props.permit || {}
            })
        }
    }

    handleClose = () => {
      this.setState({show: false})
    }

    handleShow = () => {
        this.setState({show: true})
    }

    setUriHash = () => {
        //to do copy link
    }

    render(){
        console.log("DATAA", this.props.data)
        let totalAnonsCount = 3333;
        let anon = {
            id: "1",
            rank: "123",
            backgrounds: "bgs",
            basePerson: "bp",
            head: "hd",
            eyes: "ey",
            clothes: "clo",
            ears: "ear",
            mouth: "mou",
        }
        let rarityAnon = {
            rank: 420,
            score: 12,
        }
        let rarityData = {
            backgrounds: {
                count: 69,
                totalPercent: 12,
                score: 31
            },
            basePerson: {
                count: 69,
                totalPercent: 12,
                score: 31
            },
            head: {
                count: 69,
                totalPercent: 12,
                score: 31
            },
            eyes: {
                count: 69,
                totalPercent: 12,
                score: 31
            },
            clothes: {
                count: 69,
                totalPercent: 12,
                score: 31
            },
            ears: {
                count: 69,
                totalPercent: 12,
                score: 31
            },
            mouth: {
                count: 69,
                totalPercent: 12,
                score: 31
            },
        }
        console.log(rarityData);
        return(
            <div>
            <div className="anon-card">
            <div className="anon-img-container">
              <img src="`/anons-images/anon-${anon.id}.webp`" alt="`anon ${anon.id}`" key="anon.id" />
            </div>
            <div className="anon-stats">
              <h2>
                Anon #{ anon.id } (Rank { rarityAnon.rank } / { totalAnonsCount })
                <span onClick={this.setUriHash(anon.id)} className="pointer">🔗</span>
              </h2>
              <h4>Traits</h4>
              <table>
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Trait</th>
                    <th className="text-right">Trait Count</th>
                    <th className="text-right">Trait %</th>
                    <th className="text-right">Score</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="anon.backgrounds">
                    <td>backgrounds</td>
                    <td>{ anon.backgrounds }</td>
                    <td className="text-right">{ rarityData.backgrounds.count } / { totalAnonsCount }</td>
                    <td className="text-right">{ rarityData.backgrounds.totalPercent.toFixed(3) } %</td>
                    <td className="text-right">{ rarityData.backgrounds.score.toFixed(3) }</td>
                  </tr>
                  <tr v-if="anon.basePerson">
                    <td>basePerson</td>
                    <td>{ anon.basePerson }</td>
                    <td className="text-right">{ rarityData.basePerson.count } / { totalAnonsCount }</td>
                    <td className="text-right">{ rarityData.basePerson.totalPercent.toFixed(3) } %</td>
                    <td className="text-right">{ rarityData.basePerson.score.toFixed(3) }</td>
                  </tr>
                  <tr v-if="anon.head">
                    <td>head</td>
                    <td>{ anon.head }</td>
                    <td className="text-right">{ rarityData.head.count } / { totalAnonsCount }</td>
                    <td className="text-right">{ rarityData.head.totalPercent.toFixed(3) } %</td>
                    <td className="text-right">{ rarityData.head.score.toFixed(3) }</td>
                  </tr>
                  <tr v-if="anon.eyes">
                    <td>eyes</td>
                    <td>{ anon.eyes }</td>
                    <td className="text-right">{ rarityData.eyes.count } / { totalAnonsCount }</td>
                    <td className="text-right">{ rarityData.eyes.totalPercent.toFixed(3) } %</td>
                    <td className="text-right">{ rarityData.eyes.score.toFixed(3) }</td>
                  </tr>
                  <tr v-if="anon.clothes">
                    <td>clothes</td>
                    <td>{ anon.clothes }</td>
                    <td className="text-right">{ rarityData.clothes.count } / { totalAnonsCount }</td>
                    <td className="text-right">{ rarityData.clothes.totalPercent.toFixed(3) } %</td>
                    <td className="text-right">{ rarityData.clothes.score.toFixed(3) }</td>
                  </tr>
                  <tr v-if="anon.ears">
                    <td>ears</td>
                    <td>{ anon.ears }</td>
                    <td className="text-right">{ rarityData.ears.count } / { totalAnonsCount }</td>
                    <td className="text-right">{ rarityData.ears.totalPercent.toFixed(3) } %</td>
                    <td className="text-right">{ rarityData.ears.score.toFixed(3) }</td>
                  </tr>
                  <tr v-if="anon.mouth">
                    <td>mouth</td>
                    <td>{ anon.mouth }</td>
                    <td className="text-right">{ rarityData.mouth.count } / { totalAnonsCount }</td>
                    <td className="text-right">{ rarityData.mouth.totalPercent.toFixed(3) } %</td>
                    <td className="text-right">{ rarityData.mouth.score.toFixed(3) }</td>
                  </tr>
                </tbody>
              </table>
              <h3>
                Total Rarity Score: { rarityAnon.score.toFixed(3) } -
                <a href="`https://www.anons.army/anon/${anon.id}`" target="_blank" rel="noopener">See on anons.army</a>
              </h3>
            </div>
          </div>
          </div>
        )
    }


}

export default TeddyCard;