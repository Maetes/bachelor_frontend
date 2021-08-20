import {
  ergebnisReducer,
  ergebnisInitialState,
  Ergebnis,
} from './reduceers/ergebnisReducer';

import { uxInitialState, uxReducer, UXstate } from './reduceers/uxReducer';

export interface InitialStateType {
  ergebnisState: {
    ergebnis: Ergebnis;
  };
  ux: UXstate;
}

export const mainReducer = (
  { ergebnisState, ux }: InitialStateType,
  action: any
) => {
  return {
    ergebnisState: ergebnisReducer(ergebnisState, action),
    ux: uxReducer(ux, action),
  };
};

export const mainInitialState = () => {
  return {
    ergebnisState: ergebnisInitialState,
    ux: uxInitialState,
  };
};
