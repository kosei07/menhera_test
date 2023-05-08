import { type FC } from 'react';
import classes from './index.module.css';

interface Props {
  label: string;
  disabled?: boolean;
}

const index: FC<Props> = (props) => {
  return (
    <button type='submit' className={classes.btn} disabled={props.disabled}>
      {props.label}
    </button>
  );
};

export default index;
