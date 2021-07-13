import {
  ergebnisReducer,
  ergebnisInitialState,
  Ergebnis,
} from './reduceers/ergebnisReducer';

export interface InitialStateType {
  ergebnisState: {
    ergebnis: Ergebnis;
  };
}

export const mainReducer = (
  { ergebnisState }: InitialStateType,
  action: any
) => {
  return {
    ergebnisState: ergebnisReducer(ergebnisState, action),
  };
};

export const mainInitialState = () => {
  return {
    ergebnisState: ergebnisInitialState,
  };
};
