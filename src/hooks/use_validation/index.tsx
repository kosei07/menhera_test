import { useState, useEffect } from 'react';

const getEmailErrorMessage = (name: string, value: string): string => {
  if (!value) {
    return `${name}を入力してください`;
  } else if (!value.match(/@.+\..+$/)) {
    return `${name}の形式が正しくありません`;
  } else if (
    value.match(/(script>)|(SELECT )|(INSERT )|(UPDATE )|(DELETE )|(LIKE )/g)
  ) {
    return `${name}の形式が正しくありません`;
  }
  return '';
};

const getPasswordErrorMessage = (name: string, value: string): string => {
  if (!value) {
    return `${name}を入力してください`;
  } else if (
    value.length < 6 ||
    !value.match(/[0-9]+/g) ||
    !value.match(/[a-zA-Z]+/g)
  ) {
    return `英数字を含む6文字以上の${name}を入力してください`;
  }
  return '';
};

const getNameErrorMessage = (name: string, value: string): string => {
  if (!value) {
    return `${name}を入力してください`;
  } else if (!value.match(/^[a-zA-Z ]*$/)) {
    return `${name}は半角英字で入力してください`;
  }
  return '';
};

export function useValidation(
  value: string,
  name: string,
  type: 'password' | 'email' | 'name'
): [error: string, changeHandler: (inputValue: string) => void] {
  const [error, setErrorMessage] = useState<string>('');

  const changeHandler = (inputValue: string): void => {
    let validationResult: string;
    switch (type) {
      case 'email':
        validationResult = getEmailErrorMessage(name, inputValue);
        break;
      case 'password':
        validationResult = getPasswordErrorMessage(name, inputValue);
        break;
      case 'name':
        validationResult = getNameErrorMessage(name, inputValue);
        break;
    }
    setErrorMessage(validationResult);
  };

  useEffect(() => {
    changeHandler(value);
  }, []);

  return [error, changeHandler];
}
