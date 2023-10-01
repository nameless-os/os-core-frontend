// Libraries
import { createSlice } from '@reduxjs/toolkit';

// Logic
import { getCalcResult } from '@Calculator/logic/getCalculatorResult';

interface InitialState {
  inputValue: string;
  lastOperations: [string, string, string];
}

const initialState: InitialState = {
  inputValue: '',
  lastOperations: ['', '', ''],
};

const calculatorSlice = createSlice({
  name: 'calculator',
  initialState,
  reducers: {
    getCalculatorResultAndUpdateLastOperations(state) {
      const result = getCalcResult(state.inputValue);
      state.lastOperations = [`${state.inputValue.replace(/\s+/g, '')} = ${result}`, state.lastOperations[0], state.lastOperations[1]];
      state.inputValue = result;
    },
    addToCalculatorInput(state, { payload }: { payload: string }) {
      state.inputValue += payload;
    },
    deleteLastCalculatorInputCharacter(state) {
      if (state.inputValue === 'Error' || state.inputValue === 'Infinity') return;
      state.inputValue = state.inputValue.slice(0, state.inputValue.length - 1);
    },
    setCalculatorInput(state, { payload }: { payload: string }) {
      state.inputValue = payload;
    },
    clearCalculatorInput(state) {
      state.inputValue = '';
    },
  },
});

export default calculatorSlice.reducer;
export const {
  getCalculatorResultAndUpdateLastOperations,
  addToCalculatorInput,
  deleteLastCalculatorInputCharacter,
  setCalculatorInput,
  clearCalculatorInput,
} = calculatorSlice.actions;
