import React from 'react';
import Image from 'react-bootstrap/Image';
import { getKnownImage } from '../../../utils/dataHelper';

import styles from './styles.module.css';

export class TeddyTile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            imageSrc: null
        };
    }

    componentDidMount = () => {
        this.getData();
    };

    componentDidUpdate(prevProps){
        if (this.props !== prevProps) {
            this.setState({
                numChecked: this.props.numChecked
            })
        }
    }

    getData = async () => {
        const image = await getKnownImage(this.props.id, true);
        //const data = await getPublicTeddyData(this.props.id);
        this.setState({
            imageSrc: image,
            loading: false
        });
    };

    handleCheckChange = (event) => {
        console.log(event.target.checked)
        this.props.checkHandler(this.props.id, event.target.checked)
        this.setState({
            checked: event.target.checked
        })
    }

    render() {
        return (
            <div className={styles.tileContainer}>
                <div style={{ paddingBottom: "15px", width: '260px' }}>
                    {this.state.loading ?
                        <i className="c-inline-spinner c-inline-spinner-white" />
                        :
                        <Image src={this.state.imageSrc} rounded style={{ width: "237px", minHeight: "228px" }} className="pointer" onClick={() => this.props.clickHandler(this.props.id)} />}
                    <div>
                        <input
                          type="checkbox"
                          disabled={this.state.numChecked > 2 && !this.state.checked ? true : false}
                          className={styles.checkmark} id={`teddy-check-${this.props.id}`}
                          value="" style={{float: 'left'}}
                          onChange={this.handleCheckChange}
                        />
                        <span 
                          className="backLink pointer"
                          onClick={() => this.props.clickHandler(this.props.id)}
                        >
                            <h5>&nbsp;Midnight Teddy #{this.props.id}</h5>
                        </span>
                    </div>
                </div>
            </div>

        );
    }
}
