import React, { createContext, useEffect, useReducer } from 'react';
import axios from 'axios';
import Reducer from './Reducer';
import { SERVER_URL } from '../EditableStuff/Config';

const INIT_STATE = {
    user: null
}

export const Context = createContext(INIT_STATE);

const ContextProvider = ({ children }) => {
    let [state, dispatch] = useReducer(Reducer, INIT_STATE);
    const newState = async () => {
        try{
            const res = await axios.get(`${SERVER_URL}/getUserData`,
            {withCredentials: true});
            // console.log('usercontext',res);
            dispatch({
                type: "LOGGED_IN",
                payload: {
                    user: res.data
                }
            });
        }catch(err){
            dispatch({
                type: "LOGOUT"
            });
        }
    };
    useEffect(() => {
        newState();
    },[]);

    return(
        <Context.Provider value={{...state, dispatch}}>
            {children}
        </Context.Provider>
    )
}

export default ContextProvider;