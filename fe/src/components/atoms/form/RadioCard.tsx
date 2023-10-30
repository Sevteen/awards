/* eslint-disable @typescript-eslint/no-empty-interface */
import { ReactComponent as CheckSvg } from '@assets/icon-svg/check.svg';
import { omit } from 'lodash';
import { FC, InputHTMLAttributes } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { styled } from 'styled-components';

const Card = styled.div`
  position: relative;
  width: 200px;
  height: 60px;
  background: #fff;
  border-radius: 10px;
  transition: all 0.3s;

  @media (max-width: 768px) {
    width: 100%;
  }

  &:hover {
    cursor: pointer;
  }
`;

const Radio = styled.input.attrs({ type: 'radio' })`
  position: relative;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  cursor: pointer;
  appearance: none;
  border: 1px solid #cccccc;
  z-index: 10;

  &:checked {
    border: 2px solid #1bd97b;
    background-color: #1bd97b1a;
  }
`;

const Label = styled.label`
  position: absolute;
  top: 50%;
  left: 10px;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding-right: 20px;
  z-index: 1;

  svg {
    display: none;
  }

  ${Radio}:checked + & svg {
    display: block;
  }
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  opacity: 0.6;

  ${Radio}:checked + ${Label} & {
    opacity: 1;
  }
`;

const PrimaryText = styled.div`
  font-weight: 500;
  font-size: 14px;
  margin-right: 5px;
`;

const SecondaryText = styled.div`
  font-size: 16px;
  color: #2d2a40;
  font-weight: 700;
`;

interface RadioCardProps extends InputHTMLAttributes<HTMLInputElement> {
  id?: string;
  name: string;
  primaryText: string;
  secondaryText?: string;
}

const RadioCardInput: FC<RadioCardProps> = (props) => {
  const { control } = useFormContext();
  const radioProps = omit(props, ['primaryText', 'secondaryText']);
  return (
    <Card>
      <Controller
        name={props.name}
        control={control}
        render={(field) => (
          <Radio
            {...radioProps}
            {...field.field}
            checked={field.field.value === props.value}
            value={props.value}
          />
        )}
      ></Controller>
      <Label htmlFor={props.id}>
        <TextContainer>
          <PrimaryText>{props.primaryText}</PrimaryText>
          {props.secondaryText && <SecondaryText>{props?.secondaryText}</SecondaryText>}
        </TextContainer>
        <CheckSvg />
      </Label>
    </Card>
  );
};

export default RadioCardInput;
