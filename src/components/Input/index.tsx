import {
  useEffect,
  useRef,
  useState,
  useCallback,
  InputHTMLAttributes,      
} from 'react';
import { IconType } from 'react-icons'

import { useField } from '@unform/core';

import { Container } from './styles';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  icon?: IconType;
}

export const Input: React.FC<InputProps> = ({ name, icon: Icon, ...rest }) => {
  const inputRef = useRef(null);

  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);

  const { fieldName, defaultValue, registerField } = useField(name);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: 'value',
    });
  }, [fieldName, registerField]);

  const handleInputFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleInputBlur = useCallback(() => {
    setIsFocused(false);

    setIsFilled(!!inputRef.current?.value);
  }, []);

  console.log(inputRef.current)

  return (
    <Container isFilled={isFilled} isFocused={isFocused}>
      {Icon && <Icon size={20} />}

      <input
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        defaultValue={defaultValue}
        ref={inputRef}
        {...rest}
      />
    </Container>
  );
};