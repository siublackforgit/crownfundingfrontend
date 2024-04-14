import React ,{createContext, useReducer } from 'react'
import {reducer, initialState} from './Reducer'

const AppContext = createContext();

const AppProvider = ({children}) => {
    const [state,dispatch] = useReducer(reducer,initialState);
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

export { AppContext, AppProvider }