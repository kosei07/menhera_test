import { type FC, useContext } from 'react';
import { LoadingContext } from '../../contexts/loading/index';
import classes from './index.module.css';

const index: FC = () => {
  const { state } = useContext(LoadingContext);

  return (
    <>
      {state.isLoading && (
        <div className={classes.loading_wrapper}>
          <div className={classes.loading}>
            <p className={classes.loading_message}>{state.message}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default index;
