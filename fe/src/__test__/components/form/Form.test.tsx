import Form, { useObserveFormInput } from '@components/atoms/form';
import { joiResolver } from '@hookform/resolvers/joi';
import { act, fireEvent, render, waitFor } from '@testing-library/react';
import Joi from 'joi';
import { useForm } from 'react-hook-form';

describe('Form Component', () => {
  let mockOnSubmit;
  let mockOnInvalid;
  let mockOnChangeInput;

  beforeEach(() => {
    mockOnSubmit = jest.fn();
    mockOnInvalid = jest.fn();
    mockOnChangeInput = jest.fn();
  });

  const FormComponent = ({ onMountOnly = false }) => {
    const formHooks = useForm({
      defaultValues: { testField: 'Initial Value' },
      resolver: joiResolver(Joi.object({ testField: Joi.string().required() })),
    });

    useObserveFormInput({
      name: 'testField',
      control: formHooks.control,
      onChange: mockOnChangeInput,
      options: { onMountOnly },
    });

    return (
      <Form onSubmit={mockOnSubmit} onError={mockOnInvalid} formHooks={formHooks}>
        <input {...formHooks.register('testField')} name="testField" />
        <button type="submit" data-testid="button" id="button-test">
          Submit
        </button>
      </Form>
    );
  };

  it('should render form and handle submission without error validation', async () => {
    const formComponentMock = render(<FormComponent />);

    const input = formComponentMock.getByRole('textbox');
    const submitButton = formComponentMock.getByTestId('button');

    expect(input).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();

    fireEvent.change(input, { target: { value: 'New Value' } });
    expect(input).toHaveValue('New Value');

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
      expect(mockOnSubmit).toHaveBeenCalledWith({ testField: 'New Value' }, expect.anything());

      expect(mockOnInvalid).not.toHaveBeenCalled();
    });
  });

  it('should render form and handle submission with an error', async () => {
    const formComponentMock = render(<FormComponent />);

    const input = formComponentMock.getByRole('textbox');
    const submitButton = formComponentMock.getByTestId('button');

    expect(input).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();

    fireEvent.change(input, { target: { value: null } });

    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(mockOnInvalid).toHaveBeenCalled();
    });
  });

  it('should observe form input changes', async () => {
    const formComponentMock = render(<FormComponent />);
    const input = formComponentMock.getByRole('textbox');

    expect(input).toBeInTheDocument();
    act(() => {
      fireEvent.change(input, { target: { value: 'A Value to Observe' } });
    });

    await waitFor(() => {
      expect(mockOnChangeInput).toHaveBeenCalled();
      expect(mockOnChangeInput).toHaveBeenCalledWith('A Value to Observe', 'Initial Value');
    }, {});
  });

  it('should observe form input changes with onMountOnly', async () => {
    const formComponentMock = render(<FormComponent onMountOnly={true} />);
    const input = formComponentMock.getByRole('textbox');

    expect(input).toBeInTheDocument();

    await act(async () => {
      fireEvent.change(input, { target: { value: 'A Value to Observe' } });

      // Wait for any asynchronous updates to complete
      await waitFor(() => {
        expect(mockOnChangeInput).toHaveBeenCalled();
        expect(mockOnChangeInput).toHaveBeenCalledWith('A Value to Observe', null);
      });
    });
  });
});
