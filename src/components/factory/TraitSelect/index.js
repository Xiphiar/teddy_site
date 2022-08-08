import { useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import { useState} from 'react';

export default function TraitSelect({traitsIn = [], set, selectedIn, requiredIn=false, enabledIn=true}){
    const [traits, setTraits] = useState(traitsIn);
    const [selected, setSelected] = useState(selectedIn);
    const [enabled, setEnabled] = useState(enabledIn);
    const [required, setRequired] = useState(requiredIn);
    useEffect(() => {
        setTraits(traitsIn);
    },[traitsIn])

    useEffect(()=>{
        setEnabled(enabledIn);
        setRequired(requiredIn);
        if (!enabledIn) changeSelection('')
        else if (selected === '') changeSelection('choose')
    },[enabledIn, requiredIn])

    const changeSelection = (selected) =>{
        setSelected(selected);
        set(selected);
    }
    
    if (required) {
        return(
            <Form.Control
                required
                as="select"
                value={selected}
                onChange={e => {
                    console.log(e.target.value)
                    changeSelection(e.target.value);
                }}
                disabled={!enabled}
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
                changeSelection(e.target.value);
            }}
            disabled={!enabled}
        >
            <option key='none' value={''}>None</option>
            { enabled ?
                <>
                    {traits.map( (x) => {
                        return (<option key={x.trait+x.id}>{x.trait}</option>)
                    })}
                    <option key='other' value={'other'}>Unlisted Trait* (specify in comments)</option>
                </>
            : null }

        </Form.Control>
    );

}