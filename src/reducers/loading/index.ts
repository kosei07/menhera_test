export interface State {
  isLoading: boolean;
  message: string;
}

export const initialState = {
  isLoading: false,
  message: '',
};

export type Action =
  | { type: 'SHOW_LOADING'; payload: { message: string } }
  | { type: 'HIDE_LOADING' };

export const loadingReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SHOW_LOADING':
      return {
        isLoading: true,
        message: action.payload.message,
      };
    case 'HIDE_LOADING':
      return {
        isLoading: false,
        message: '',
      };
    default:
      return state;
  }
};
