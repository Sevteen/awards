import _ from 'lodash';
import { ReactNode, useEffect, useRef, useState } from 'react';
import {
  Control,
  FieldValues,
  FormProvider,
  Path,
  SubmitErrorHandler,
  SubmitHandler,
  UseFormReturn,
  useWatch,
} from 'react-hook-form';

interface FormProps<T extends FieldValues> {
  onSubmit: SubmitHandler<T>;
  onError?: SubmitErrorHandler<T>;
  formHooks: UseFormReturn<T>;
  children: ReactNode;
  className?: string;
}

interface OptionsObserve {
  onMountOnly?: boolean;
}

interface UseObserveFormInput<T extends FieldValues, U> {
  name: string;
  control: Control<T>;
  onChange?: (currentValue: U | undefined, oldVal: U | undefined) => void;
  options?: OptionsObserve;
}

export function useObserveFormInput<T extends FieldValues, U>(props: UseObserveFormInput<T, U>) {
  const { control, name, options, onChange } = props;
  const watch = useWatch<T>({ control, name: name as Path<T> });
  const [inputValue, setInputValue] = useState<U | undefined>();
  const [prevValue, setPrevValue] = useState<U | undefined>();
  const successMount = useRef<boolean>(false);

  useEffect(() => {
    if (options && options.onMountOnly && !successMount.current) {
      successMount.current = true;
      return;
    }

    const currentValue = watch;

    if (!_.isEqual(currentValue, inputValue)) {
      setPrevValue(inputValue);
      setInputValue(currentValue);
      if (onChange) {
        onChange(currentValue, inputValue);
      }
    }
  }, [name, inputValue, watch]);

  return [inputValue, prevValue];
}

export default function Form<T extends FieldValues>(props: FormProps<T>) {
  const { onSubmit, children, onError, formHooks, ...args } = props;
  const { handleSubmit } = formHooks;

  const onInvalid: SubmitErrorHandler<T> = (errors) => {
    if (onError) {
      onError(errors);
    }
    console.warn(errors);
  };

  return (
    <FormProvider {...formHooks}>
      <form role="form" {...args} onSubmit={handleSubmit(onSubmit, onInvalid)}>
        {children}
      </form>
    </FormProvider>
  );
}
