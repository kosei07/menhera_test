import { type FC } from 'react';
import classes from './index.module.css';

interface Radio {
  label: string;
  value: string;
}

interface Props {
  gender: string;
  setGender: React.Dispatch<React.SetStateAction<string>>;
}

const index: FC<Props> = (props) => {
  const changeValue = (event: React.ChangeEvent<HTMLInputElement>): void => {
    props.setGender(event.target.value);
  };

  const radioButtons: Radio[] = [
    {
      label: '男性',
      value: 'men',
    },
    {
      label: '女性',
      value: 'women',
    },
  ];

  return (
    <div className={classes.wrapper}>
      <div className={classes.text_wrapper}>
        <label className={classes.label}>
          性別
          <span className={classes.error_message}>
            {!props.gender && '性別を選択して下さい'}
          </span>
        </label>
      </div>
      <div className={classes.inputs_wrapper}>
        {radioButtons.map((radio) => {
          return (
            <div className={classes.input_wrapper} key={radio.value}>
              <input
                className='form-check-input'
                type='radio'
                name='sweets'
                value={radio.value}
                checked={radio.value === props.gender}
                onChange={changeValue}
              />
              <label className='form-check-label'>
                <span className='fs-6'>{radio.label}</span>
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default index;
