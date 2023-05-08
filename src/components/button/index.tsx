import { type FC } from 'react';

interface Props {
  label: string;
  disabled?: boolean;
}

const index: FC<Props> = (props) => {
  return (
    <button type='submit' className='btn' disabled={props.disabled}>
      {props.label}
    </button>
  );
};

export default index;
