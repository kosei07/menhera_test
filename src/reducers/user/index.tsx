import { type PROFILE_TYPE, type USER_TYPE } from '../../type';

export const initialState = {
  id: '',
  name: '',
  icon: '',
  birthOfDate: 'string',
  gender: 'string',
};

export type Action =
  | { type: 'SET_USER_ID'; payload: { id: string } }
  | { type: 'SET_PROFILE'; payload: PROFILE_TYPE }
  | { type: 'RESET' };

export const userReducer = (state: USER_TYPE, action: Action): USER_TYPE => {
  switch (action.type) {
    case 'SET_USER_ID':
      return { ...state, id: action.payload.id };
    case 'SET_PROFILE':
      return { ...action.payload, id: state.id };
    case 'RESET':
      return {
        id: '',
        name: '',
        icon: '',
        birthOfDate: '',
        gender: '',
      };
    default:
      return state;
  }
};
