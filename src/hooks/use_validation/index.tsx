import { useState, useEffect } from 'react';

const getEmailErrorMessage = (name: string, value: string): string => {
  if (!value) {
    return `${name}を入力してください`;
  } else if (!value.match(/@.+\..+$/)) {
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
  }
  return '';
};

const getTextErrorMessage = (name: string, value: string): string => {
  if (!value) {
    return `${name}を入力してください`;
  }
  return '';
};

export function useValidation(
  value: string,
  name: string,
  type: 'password' | 'email' | 'name' | 'text',
  length?: {
    max: number;
    min: number;
  }
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
      case 'text':
        validationResult = getTextErrorMessage(name, inputValue);
        break;
    }
    if (length) {
      if (inputValue.length < length.min) {
        validationResult = `${name}は${String(
          length.min
        )}文字以上で入力してください`;
      } else if (inputValue.length > length.max) {
        validationResult = `${name}は${String(
          length.max
        )}文字以下で入力してください`;
      }
    }
    setErrorMessage(validationResult);
  };

  useEffect(() => {
    changeHandler(value);
  }, []);

  return [error, changeHandler];
}
