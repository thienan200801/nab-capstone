import React, { useContext } from "react";
import { useState, useEffect, useRef } from "react";
import './inputCustomerID.css'

//Need to import global state to set customerID
import { setGlobalState } from '../customerIdState/customerIdState.jsx'

export const InputCustomerID = (props) => {
    const [isShow, setIsShow] = useState(props.isShow);
    const [tempID, setTempID] = useState('');
    const id = useRef('')

    const submitID = () => { 
        setGlobalState("customerID", tempID);
        //After use setGlobalState, the new value of customerID is passed into customerID. If other components want to use the customerID values --> just import useGlobalState from file customerIdState.jsx. Example: const [customerId, setCustomerId] = useGlobalState('customerID')
        setIsShow(false);
    }
    return isShow && <div className="container" id="inputCustomerID">
        <div className="main">
            <h3>Enter customer ID</h3>
            <input ref={id} type="text" placeholder="Customer ID" id="customerID" onChange={() => setTempID(id.current.value)} />
            <button className="btn" disabled={tempID.trim() === ''} onClick={() => submitID()}>Continue</button>
        </div>
    </div>
}