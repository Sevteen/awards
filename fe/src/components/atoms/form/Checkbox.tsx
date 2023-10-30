import { ReactComponent as CheckSvg } from '@assets/icon-svg/check.svg';
import { FC, InputHTMLAttributes } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import styled from 'styled-components';

const Group = styled.div.attrs({ className: 'checkboxContainer' })`
  position: relative;
  gap: 5px;
  display: flex;

  input + label {
    display: flex;
    align-items: center;
    border: 2px solid #2d2a40;
    width: var(--size);
    height: var(--size);
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  input + label:active {
    transform: scale(1.05);
  }

  input:checked + label {
    border-color: #1bd97b;
    display: flex;
  }

  input:checked + label svg path {
    display: block;
    stroke-dashoffset: 0;
  }

  input + label svg path {
    pointer-events: none;
    display: none;
    stroke-dasharray: 1000;
    stroke-dashoffset: 101;
    transition: all 250ms cubic-bezier(1, 0, 0.37, 0.91);
  }
`;

const Label = styled.label`
  color: #2d2a40;
  font-size: 14px;
  font-weight: normal;
  pointer-events: none;
  opacity: 0.8;
`;

const CheckLabel = styled.label`
  --size: 20px;
`;

const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  opacity: 0;
  position: absolute;
  width: 20px;
  height: 20px;
`;

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  id?: string;
  name: string;
  label: string;
}

const CheckboxInput: FC<CheckboxProps> = (props) => {
  const { control } = useFormContext();
  return (
    <Group>
      <Controller
        name={props.name}
        control={control}
        render={({ field }) => (
          <Checkbox id={props.id} {...props} {...field} checked={field.value} />
        )}
      ></Controller>

      <CheckLabel htmlFor={props.id}>
        <CheckSvg />
      </CheckLabel>
      <Label>{props.label}</Label>
    </Group>
  );
};

export default CheckboxInput;
