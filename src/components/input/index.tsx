import { type FC } from 'react';
import classes from './index.module.css';
import { useWindowSize } from '../../hooks/use_window_size';
interface Props {
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChangeHandler: (e: React.ChangeEvent<HTMLInputElement>) => void;
  valueError: string;
}

const index: FC<Props> = (props) => {
  const { width } = useWindowSize();

  return (
    <div className={classes.input_wrapper}>
      <div className={classes.text_wrapper}>
        {width > 599 ? (
          <label className={classes.label}>
            {props.label}
            <span className={classes.error_message}> {props.valueError}</span>
          </label>
        ) : (
          <>
            <label className={classes.label}>{props.label}</label>
            <p className={classes.error_message}> {props.valueError}</p>
          </>
        )}
      </div>
      <input
        type={props.type}
        className={classes.input}
        placeholder={props.placeholder}
        value={props.value}
        onChange={props.onChangeHandler}
      />
    </div>
  );
};

export default index;
