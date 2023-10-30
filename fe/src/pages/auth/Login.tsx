import Form from '@components/atoms/form';
import TextInput from '@components/atoms/form/Input';
import { joiResolver } from '@hookform/resolvers/joi';
import { api } from '@services/index';
import Joi from 'joi';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

const schema = Joi.object({
  email: Joi.string()
    .pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
    .required(),
  password: Joi.string().min(6).required(),
});

const Login = () => {
  const formHooks = useForm({ resolver: joiResolver(schema), mode: 'onSubmit' });
  const navigate = useNavigate();

  const [respMsg, setRespMsg] = React.useState('');

  const {
    formState: { errors },
  } = formHooks;

  const onSubmit = async (sForm) => {
    try {
      const res = await api.post('api_v1/auth/login', { ...sForm }, false);
      if (res.status !== 'OK') {
        setRespMsg(res.message);
      } else {
        setRespMsg('');
        navigate('/home');
        localStorage.setItem('__SNID__', JSON.stringify(res.data));
      }
    } catch (error) {
      console.log(error, 'err');
    }
    return;
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen w-full">
      <img src="/star-icon.png" width="150" height="150" alt="gambar bintang" />
      <h1 className="mt-1 text-3xl font-extrabold text-gray-700 tracking-wider">AWARD</h1>
      <p className="mt-4 text-gray-700 font-normal leading-tight">Enter your email address</p>
      <p className="mb-4 text-gray-700 font-normal leading-tight">to sign in and continue</p>
      <Form className="flex flex-col" formHooks={formHooks} onSubmit={onSubmit}>
        <div className="w-72">
          <TextInput
            type="text"
            name="email"
            format="input"
            label="Email Address"
            className="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
          />
          {errors && errors?.email && <p className="text-red-600 mt-1">Please check your email!</p>}
        </div>
        <div className="w-72">
          <TextInput
            type="password"
            name="password"
            format="input"
            label="Password"
            className="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
          />
          {errors && errors?.password && (
            <p className="text-red-600 mt-1">Please check your password!</p>
          )}
        </div>
        {respMsg && <p className="text-red-600 mt-1">{respMsg}</p>}
        <button
          type="submit"
          className="mt-6 py-2 px-12 rounded self-center bg-gray-600 text-gray-100 hover:bg-gray-700 active:bg-gray-800 focus:outline-none focus:ring focus:ring-gray-300"
        >
          Sign In
        </button>
      </Form>
    </div>
  );
};

export default Login;
