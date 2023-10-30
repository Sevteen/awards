import styled from 'styled-components';
import successIcon from '@assets/icon-svg/check.svg';
import errorIcon from '@assets/icon-svg/clear.svg';
import {
  FC,
  InputHTMLAttributes,
  LabelHTMLAttributes,
  HTMLAttributes,
  TextareaHTMLAttributes,
} from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { omit } from 'lodash';
import { Tooltip } from '@mui/material';

const Group = styled.div`
  position: relative;
`;

const Input = styled.input`
  font-size: 16px;
  padding: 20px 10px 10px 10px;
  display: block;
  width: 100%;
  height: 50px;
  /* border: ${(props) =>
    props.className?.includes('success')
      ? '1px solid #1BD97B'
      : props.className?.includes('error')
      ? '1px solid #FF8A00'
      : '1px solid #cccccc'}; */
  background: transparent;
  outline: none;

  &:focus ~ label,
  &:not(:placeholder-shown) ~ label {
    bottom: -15px;
    font-size: 12px;
    color: #999;
  }
`;

const TextArea = styled.textarea`
  font-size: 16px;
  padding: 20px 10px 10px 10px;
  display: block;
  width: 100%;
  /* border: ${(props) =>
    props.className?.includes('success')
      ? '1px solid #1BD97B'
      : props.className?.includes('error')
      ? '1px solid #FF8A00'
      : '1px solid #cccccc'}; */
  background: transparent;
  outline: none;
  resize: none;

  &:not(:placeholder-shown),
  &:focus {
    padding: 25px 10px 10px 10px;
  }

  &:focus ~ label,
  &:not(:placeholder-shown) ~ label {
    top: 10px;
    font-size: 12px;
    color: #999;
    background-color: white;
    padding-top: 10px;
    margin-top: 5px;
  }
`;

const Label = styled.label`
  color: #999;
  font-size: 16px;
  font-weight: normal;
  position: absolute;
  pointer-events: none;
  left: 10px;
  top: 50%;
  width: 100%;
  max-width: calc(100% - 20px);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transform: translateY(-50%);
  transition: 0.2s ease all;
  -moz-transition: 0.2s ease all;
  -webkit-transition: 0.2s ease all;
`;

const EndIcon = styled.span`
  position: absolute;
  top: 50%;
  right: 0px;
  margin-right: 10px;
  transform: translateY(-50%);
  background-size: contain;
  background-repeat: no-repeat;
  width: 14px;
  height: 14px;
  background-image: ${(props) =>
    props.className?.includes('success') ? `url(${successIcon})` : `url(${errorIcon})`};
  display: ${(props) => (props.className?.includes('showIcon') ? 'block' : 'none')};
`;

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  format: 'input';
  label: string;
  labelProps?: LabelHTMLAttributes<HTMLLabelElement>;
  iconProps?: HTMLAttributes<HTMLSpanElement>;
  name: string;
  touched?: boolean;
  errMsg?: string;
  groupClassName?: string;
}

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  format: 'textarea';
  label: string;
  labelProps?: LabelHTMLAttributes<HTMLLabelElement>;
  iconProps?: HTMLAttributes<HTMLSpanElement>;
  id?: string;
  name: string;
  touched?: boolean;
  errMsg?: string;
  groupClassName?: string;
}

type TextInputProps = TextAreaProps | InputProps;

const TextInput: FC<TextInputProps> = (props) => {
  const { label, labelProps, iconProps, format, name, touched, id, errMsg, ...args } = props;

  const {
    control,
    formState: { errors, touchedFields },
    getFieldState,
  } = useFormContext();

  const isTouched = touchedFields[name] || touched;
  const errorMessage = errors[name]?.message || errMsg;
  const isError = Boolean(errorMessage);

  const classNameInput = `${props?.className ?? ''} ${
    // isTouched ? (isError ? 'error' : 'success') :
    ''
  }`;

  const inputProps = omit(props, ['groupClassName', 'touched', 'error', 'labelProps', 'iconProps']);

  return (
    <Group className={args.groupClassName}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          return format === 'textarea' ? (
            <TextArea
              id={id}
              {...(inputProps as TextAreaProps)}
              {...field}
              className={classNameInput}
              placeholder=""
            />
          ) : (
            <Input
              id={id}
              {...(inputProps as InputProps)}
              {...field}
              className={classNameInput}
              placeholder=""
            />
          );
        }}
      ></Controller>

      <Label htmlFor={id} {...labelProps}>
        {label}
      </Label>
      {/* <Tooltip title={errorMessage as string}>
        <EndIcon
          {...iconProps}
          className={`${iconProps?.className ?? ''} ${isTouched ? 'showIcon' : ''} ${
            isError ? 'error' : 'success'
          }`}
        />
      </Tooltip> */}
    </Group>
  );
};

export default TextInput;
