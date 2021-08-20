export interface UXstate {
  historyPage: number;
}

export const uxReducer = (state: UXstate, action: any) => {
  switch (action.type) {
    case 'HISTPAGE':
      return {
        ...state,
        historyPage: action.payload,
      };
    default:
      return state;
  }
};

export const uxInitialState = {
  historyPage: 0,
};
