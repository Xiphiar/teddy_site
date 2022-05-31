import React, {useState,useEffect,useRef} from 'react';
import Image from 'react-bootstrap/Image';
import { getKnownImage } from '../../../utils/dataHelper';
import Overlay from 'react-bootstrap/Overlay'
import Tooltip from 'react-bootstrap/Tooltip'

import styles from './styles.module.css';
import './tooltip.css';

export default function TeddyTile({id, index, showCheckBox=false, totalChecked, checkHandler, clickHandler}){
// export class TeddyTile extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             loading: true,
//             imageSrc: null,
//             showCheckBox: this.props.showCheckBox || false
//         };
//     }
    const [loading, setLoading] = useState(true);
    const [imageSrc, setImageSrc] = useState(null);
    const [showCheck, setShowCheck] = useState(showCheckBox);
    const [showTooltip, setShowTooltip] = useState(false);
    const [numChecked, setNumChecked] = useState(totalChecked);
    const [checked, setChecked] = useState(false);
    const target = useRef(null);

    const getData = async () => {
        const image = await getKnownImage(id, true);
        //const data = await getPublicTeddyData(this.props.id);
        // this.setState({
        //     imageSrc: image,
        //     loading: false
        // });
        setImageSrc(image);
        setLoading(false);
    };

    // run on mount
    useEffect(()=>{
        getData();
    },[id])

    useEffect(()=>{
        console.log("change total", id, showTooltip, totalChecked)
        setNumChecked(totalChecked)
        if (totalChecked){
            console.log(id, 'disabled tooltip')
            setShowTooltip(false);
        }
    },[totalChecked])

    useEffect(()=>{
        console.log("show checkbox", id, showTooltip, totalChecked)
        setShowCheck(showCheckBox);
        if (!index){
            setShowTooltip(true);
        }
    },[showCheckBox])

    const handleCheckChange = (event) => {
        checkHandler(id, event.target.checked)
        setChecked(event.target.checked)
    }
    return (
        <div className={styles.tileContainer}>
            <div style={{ paddingBottom: "15px", width: '285px' }}>
                <div className='d-flex justify-content-center'>
                {loading ?
                    <i className="c-inline-spinner c-inline-spinner-white" />
                    :
                    <Image src={imageSrc} rounded style={{ width: "237px", minHeight: "228px", marginBottom: showCheck ? '10px' : '5px' }} className="pointer" onClick={() => clickHandler(id)} />}
                </div>
                <div>
                <div style={{height: '30px', width: '30px', float: 'left'}} ref={target}>
                    { showCheck ?
                        <>
                            <input
                                
                                type="checkbox"
                                disabled={numChecked > 2 && !checked ? true : false}
                                className={styles.checkmark} id={`teddy-check-${id}`}
                                value=""
                                //style={{margin: '10px'}}
                                onChange={handleCheckChange}
                            />
                            {/*this is fucked but i dont care at least it fucking works */
                            showTooltip ?
                                <Overlay
                                    target={target.current}
                                    show={true}
                                    placement={'left'}
                                >
                                    {(props) => (
                                        <Tooltip id="tooltip-this-shit-sucks"  {...props}>
                                            Check the boxes to select your teddies!
                                        </Tooltip>
                                    )}
                                </Overlay>
                            : null
                            }


                        </>

                    : null }
                </div>
                <div style={{marginLeft: showCheck ? '40px' : '0px'}}>
                    <span 
                        className="backLink pointer"
                        onClick={() => clickHandler(id)}
                    >
                        <h5>&nbsp;Midnight Teddy #{id}</h5>
                    </span>
                </div>
                </div>
            </div>
        </div>

    );
}
