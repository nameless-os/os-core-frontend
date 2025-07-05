import { TypedUseSelectorHook, useSelector } from 'react-redux';
import { RootState } from '@Types/rootState.type';

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
