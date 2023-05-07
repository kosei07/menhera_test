import { type FC } from 'react';

interface Radio {
  label: string;
  value: string;
}

interface Props {
  gender: string,
  setGender:React.Dispatch<React.SetStateAction<string>>;
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
    <div className='container form-check'>
      <div className='row'>
        {radioButtons.map((radio) => {
          return (
            <div className='col-4' key={radio.value}>
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
