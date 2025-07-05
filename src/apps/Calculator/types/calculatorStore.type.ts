import { AppId } from '@webos-project/common';

interface CalculatorState {
  inputValue: string;
  lastOperations: [string, string, string];
}

interface CalculatorStore {
  calculatorsData: { [key: AppId]: CalculatorState };
}

interface SetCalculatorInputProps {
  inputValue: string;
  appId: AppId;
}

interface AddToCalculatorInput {
  inputValue: string;
  appId: AppId;
}

export type { CalculatorStore, CalculatorState, SetCalculatorInputProps, AddToCalculatorInput };
