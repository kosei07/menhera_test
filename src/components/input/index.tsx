import { type FC } from 'react';

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
    <div className='input_wrapper'>
      <label className='form__label' htmlFor='email'>
        {props.label}
      </label>
      <input
        type={props.type}
        className='input'
        placeholder={props.placeholder}
        value={props.value}
        onChange={props.onChangeHandler}
      />
      <p> {props.valueError}</p>
    </div>
  );
};

export default index;
