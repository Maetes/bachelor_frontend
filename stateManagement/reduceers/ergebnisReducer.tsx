export interface Ergebnis {
  start: {
    association: {
      cpu: number[];
      memory: number[];
    };
    freqItems: {
      cpu: number[];
      memory: number[];
    };
  };
  end: {
    association: {
      asso: string;
      cpu: number[];
      memory: number[];
      time: number;
    };
    freqItems: {
      freq: string;
      cpu: number[];
      memory: number[];
      time: number;
    };
  };
}

export interface stateType {
  ergebnis: Ergebnis;
}

export const ergebnisReducer = (state: stateType, action: any) => {
  const { type, payload } = action;
  switch (type) {
    case 'CREATE':
      return {
        ergebnis: payload,
      };
    case 'DELETE':
      return {
        ...state,
        ...ergebnisInitialState,
      };
    default:
      return state;
  }
};

export const ergebnisInitialState: { ergebnis: Ergebnis } = {
  ergebnis: {
    start: {
      association: {
        cpu: [0],
        memory: [0],
      },
      freqItems: {
        cpu: [0],
        memory: [0],
      },
    },
    end: {
      association: {
        asso: '',
        cpu: [0],
        memory: [0],
        time: 0,
      },
      freqItems: {
        freq: '',
        cpu: [0],
        memory: [0],
        time: 0,
      },
    },
  },
};
