import React from 'react';
import LoginForm from '../components/auth-components/LoginForm';
import { Container } from '@mui/material';


const Login = () => {
  const onSubmit = (data) => {
    console.log("submit", data);
  }
  return (
    <Container maxWidth="sm">
      <h2>Login Page</h2>
      <LoginForm onSubmit={onSubmit} />
    </Container>
  );
}

export default Login;
