import React ,{createContext, useReducer } from 'react'
import {reducer, initialState} from './Reducer'
import { blockReducer, blockInitialState } from './BlockReducer';

const AppContext = createContext();

const AppProvider = ({children}) => {
    const [state,dispatch] = useReducer(reducer,initialState);
    const [blockState, blockDispatch] = useReducer(blockReducer, blockInitialState);
  return (
    <AppContext.Provider value={{ state, dispatch, blockState, blockDispatch }}>
      {children}
    </AppContext.Provider>
  )
}

export { AppContext, AppProvider }