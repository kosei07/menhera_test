import { type FC, useEffect, useContext } from 'react';
import { ToastContext } from '../../contexts/toast/index';
import classes from './index.module.css';

const MessageToast: FC = () => {
  const { state, dispatch } = useContext(ToastContext);

  useEffect(() => {
    if (state.visible) {
      setTimeout(() => {
        dispatch({
          type: 'RESET',
        });
      }, 3000);
    }
  }, [state]);

  return (
    <>
      {state.visible && (
        <div className={classes.toast_wrapper}>
          <div
            className={
              state.error ? classes.failed_toast : classes.success_toast
            }
          >
            <span>{state.message}</span>
          </div>
        </div>
      )}
    </>
  );
};

export default MessageToast;
