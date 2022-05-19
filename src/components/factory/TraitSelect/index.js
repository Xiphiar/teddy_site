import { useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import { useState} from 'react';

export default function TraitSelect({traitsIn = [], set, selectedIn, required=false}){
    const [traits, setTraits] = useState(traitsIn);
    const [selected, setSelected] = useState(selectedIn);
    useEffect(() => {
        setTraits(traitsIn);
    },[traitsIn])
    
    if (required) {
        return(
            <Form.Control
                required
                as="select"
                value={selected}
                onChange={e => {
                    console.log(e.target.value)
                    set(e.target.value);
                }}
            >
                <option key='choose' value={''}>Choose...</option>
                {traits.map( (x) => {
                    return (<option key={x.trait+x.id}>{x.trait}</option>)
                })}
                <option key='other' value={'other'}>Unlisted Trait* (specify in comments)</option>
            </Form.Control>
        );
    } else
    return(
        <Form.Control
            as="select"
            value={selected}
            onChange={e => {
                set(e.target.value);
            }}
        >
            <option key='none' value={''}>None</option>
            {traits.map( (x) => {
                return (<option key={x.trait+x.id}>{x.trait}</option>)
            })}
            <option key='other' value={'other'}>Unlisted Trait* (specify in comments)</option>
        </Form.Control>
    );

}