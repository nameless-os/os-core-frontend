import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { getCalcResult } from '@Calculator/logic/getCalculatorResult';
import { AddToCalculatorInput, CalculatorStore, SetCalculatorInputProps } from '@Calculator/types/calculatorStore.type';
import { App, AppId } from '@webos-project/common';
import { closeApp, openApp } from '../../../../redux/slices/appsSlice/apps.slice';

const calculatorInitialStore: CalculatorStore = {
  calculatorsData: {},
};

const calculatorSlice = createSlice({
  name: 'calculator',
  initialState: calculatorInitialStore,
  reducers: {
    getCalculatorResultAndUpdateLastOperations(state, { payload: appId }: PayloadAction<AppId>) {
      const result = getCalcResult(state.calculatorsData[appId].inputValue);
      if (result === 'OpErr') {
        return;
      }
      state.calculatorsData[appId].lastOperations = [
        `${state.calculatorsData[appId].inputValue.replace(/\s+/g, '')} = ${result}`,
        state.calculatorsData[appId].lastOperations[0],
        state.calculatorsData[appId].lastOperations[1],
      ];
      state.calculatorsData[appId].inputValue = result;
    },
    addToCalculatorInput(state, { payload }: PayloadAction<AddToCalculatorInput>) {
      state.calculatorsData[payload.appId].inputValue += payload.inputValue;
    },
    deleteLastCalculatorInputCharacter(state, { payload: appId }: PayloadAction<AppId>) {
      if (state.calculatorsData[appId].inputValue === 'Error' || state.calculatorsData[appId].inputValue === 'Infinity') return;
      state.calculatorsData[appId].inputValue = state.calculatorsData[appId].inputValue.slice(0, state.calculatorsData[appId].inputValue.length - 1);
    },
    setCalculatorInput(state, { payload }: PayloadAction<SetCalculatorInputProps>) {
      state.calculatorsData[payload.appId].inputValue = payload.inputValue;
    },
    clearCalculatorInput(state, { payload: appId }: PayloadAction<AppId>) {
      state.calculatorsData[appId].inputValue = '';
    },
  },
  extraReducers: (builder) => {
    builder.addCase(openApp, (state, action) => {
      if (action.payload.type !== App.Calculator) {
        return;
      }
      state.calculatorsData[action.payload.appId] = {
        inputValue: '',
        lastOperations: ['', '', ''],
      };
    });
    builder.addCase(closeApp, (state, action) => {
      delete state.calculatorsData[action.payload];
    });
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
