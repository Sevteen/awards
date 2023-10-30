/* eslint-disable @typescript-eslint/no-empty-interface */
import React, { ButtonHTMLAttributes, FC, ReactNode } from 'react';
import styled from 'styled-components';

const StyledButton = styled.button`
  background-color: #ff8a00;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  &:disabled {
    opacity: 0.5;
  }
`;

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

const Button: FC<ButtonProps> = (props) => {
  return <StyledButton {...props} />;
};

export default Button;
