import React, { createContext, useContext, useReducer } from 'react';
import { InitialStateType } from './mainReducer';
import { Ergebnis } from './reduceers/ergebnisReducer';

interface State {
  reducer: (
    { ergebnisState }: InitialStateType,
    action: any
  ) => { ergebnisState: { ergebnis: Ergebnis } };
  initialState: InitialStateType;
  children: any;
}

export const StateContext = createContext<
  [InitialStateType, React.Dispatch<any>]
>({} as any);

export const StateProvider = ({ reducer, initialState, children }: State) => {
  return (
    <StateContext.Provider value={useReducer(reducer, initialState)}>
      {children}
    </StateContext.Provider>
  );
};
export const useStateGlobal = () => useContext(StateContext);
