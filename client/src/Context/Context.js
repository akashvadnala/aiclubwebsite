import React, { createContext, useEffect, useReducer } from 'react';
import axios from 'axios';
import Reducer from './Reducer';
import { SERVER_URL } from '../EditableStuff/Config';

const INIT_STATE = {
    user: null,
    logged_in: 0,
}

export const Context = createContext(INIT_STATE);

const ContextProvider = ({ children }) => {
    let [state, dispatch] = useReducer(Reducer, INIT_STATE);
    const newState = async () => {
        try{
            await axios.get(`${SERVER_URL}/getUserData`,
            {withCredentials: true})
            .then(res=>{
                if(res.status===200){
                    dispatch({
                        type: "LOGGED_IN",
                        payload: {
                            user: res.data,
                            logged_in: 1
                        }
                    });
                }
                else{
                    dispatch({
                        type: "LOGGED_IN",
                        payload: {
                            user: null,
                            logged_in: -1,
                        }
                    });
                }
            })
            
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