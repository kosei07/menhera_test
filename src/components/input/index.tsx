import { type FC } from 'react';
import classes from './index.module.css';

interface Props {
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChangeHandler: (e: React.ChangeEvent<HTMLInputElement>) => void;
  valueError: string;
}

const index: FC<Props> = (props) => {
  return (
    <div className={classes.input_wrapper}>
      <label className={classes.label}>{props.label}</label>
      <input
        type={props.type}
        className={classes.input}
        placeholder={props.placeholder}
        value={props.value}
        onChange={props.onChangeHandler}
      />
      <p className={classes.error_message}> {props.valueError}</p>
    </div>
  );
};

export default index;
