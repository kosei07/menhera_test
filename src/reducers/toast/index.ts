export interface State {
  visible: boolean
  message: string
  error: boolean
}

export const initialState = {
  visible: false,
  message: '',
  error: false,
}

export type Action =
  | { type: 'SHOW_SUCCEEDED_TOAST'; payload: { message: string } }
  | { type: 'SHOW_FAILED_TOAST'; payload: { message: string } }
  | { type: 'RESET' }

export const toastReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SHOW_SUCCEEDED_TOAST':
      return {
        visible: true,
        message: action.payload.message,
        error: false,
      }
    case 'SHOW_FAILED_TOAST':
      return {
        visible: true,
        message: action.payload.message,
        error: true,
      }
    case 'RESET':
      return {
        visible: false,
        message: '',
        error: false,
      }
    default:
      return state
  }
}
