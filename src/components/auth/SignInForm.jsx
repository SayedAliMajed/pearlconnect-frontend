// src/components/auth/SignInForm.jsx

import { useState, useContext } from 'react';
import { useNavigate } from 'react-router';

import { signIn } from '../../services/auth';

import { AuthContext } from '../../contexts/AuthContext';

const SignInForm = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const { username, email, password } = formData;

  const handleChange = (evt) => {
    setMessage('');
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    try {
      // Allow login with either username or email
      const loginData = email ? { email, password } : { username, password };
      const signedInUser = await signIn(loginData);

      setUser(signedInUser);
      navigate('/');
    } catch (err) {
      setMessage(err.message);
    }
  };

  const isFormValid = () => {
    return (username || email) && password;
  };

  return (
    <main>
      <h1>Sign In</h1>
      <p>{message}</p>
      <form autoComplete='off' onSubmit={handleSubmit}>
        <div>
          <label htmlFor='username'>Username:</label>
          <input
            type='text'
            autoComplete='off'
            id='username'
            value={username}
            name='username'
            onChange={handleChange}
            placeholder='Enter your username'
          />
        </div>
        <div>
          <label htmlFor='email'>Email:</label>
          <input
            type='email'
            autoComplete='off'
            id='email'
            value={email}
            name='email'
            onChange={handleChange}
            placeholder='Enter your email'
          />
        </div>
        <div>
          <small>You can sign in with either username or email</small>
        </div>
        <div>
          <label htmlFor='password'>Password:</label>
          <input
            type='password'
            autoComplete='off'
            id='password'
            value={password}
            name='password'
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <button disabled={!isFormValid()}>Sign In</button>
          <button onClick={() => navigate('/')}>Cancel</button>
        </div>
      </form>
    </main>
  );
};

export default SignInForm;
