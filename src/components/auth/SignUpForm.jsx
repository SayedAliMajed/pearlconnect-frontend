// src/components/auth/SignUpForm.jsx

import { useState, useContext } from 'react';
import { useNavigate } from 'react-router';

import { signUp } from '../../services/auth';

import { AuthContext } from '../../contexts/AuthContext';

const SignUpForm = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    passwordConf: '',
    role: 'customer',
    fullName: '',
    phone: '',
    address: '',
  });

  const {
    username,
    email,
    password,
    passwordConf,
    role,
    fullName,
    phone,
    address,
  } = formData;

  const handleChange = (evt) => {
    setMessage('');
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    try {
      // Validate password confirmation
      if (password !== passwordConf) {
        setMessage('Passwords do not match');
        return;
      }

      // Structure data according to userSchema
      const signUpData = {
        username,
        email,
        password, // Backend will hash this as hashedPassword
        role,
        profile: {
          fullName: fullName || undefined,
          phone: phone || undefined,
          address: address || undefined,
        },
      };

      // Remove undefined profile fields
      if (!signUpData.profile.fullName) delete signUpData.profile.fullName;
      if (!signUpData.profile.phone) delete signUpData.profile.phone;
      if (!signUpData.profile.address) delete signUpData.profile.address;

      const newUser = await signUp(signUpData);
      setUser(newUser);
      navigate('/');
    } catch (err) {
      setMessage(err.message);
    }
  };

  const isFormValid = () => {
    return username && email && password && password === passwordConf && role;
  };

  return (
    <main>
      <h1>Sign Up</h1>
      <p>{message}</p>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor='username'>Username:</label>
          <input
            type='text'
            id='username'
            value={username}
            name='username'
            onChange={handleChange}
            required
            placeholder='Choose a unique username'
          />
        </div>
        <div>
          <label htmlFor='email'>Email:</label>
          <input
            type='email'
            id='email'
            value={email}
            name='email'
            onChange={handleChange}
            required
            placeholder='Enter your email address'
          />
        </div>
        <div>
          <label htmlFor='role'>Role:</label>
          <select
            id='role'
            name='role'
            value={role}
            onChange={handleChange}
            required
          >
            <option value='customer'>Customer</option>
            <option value='provider'>Service Provider</option>
            <option value='admin'>Admin</option>
          </select>
        </div>
        <div>
          <label htmlFor='password'>Password:</label>
          <input
            type='password'
            id='password'
            value={password}
            name='password'
            onChange={handleChange}
            required
            placeholder='Enter a strong password'
          />
        </div>
        <div>
          <label htmlFor='passwordConf'>Confirm Password:</label>
          <input
            type='password'
            id='passwordConf'
            value={passwordConf}
            name='passwordConf'
            onChange={handleChange}
            required
            placeholder='Confirm your password'
          />
        </div>
        
        <h3>Profile Information (Optional)</h3>
        <div>
          <label htmlFor='fullName'>Full Name:</label>
          <input
            type='text'
            id='fullName'
            value={fullName}
            name='fullName'
            onChange={handleChange}
            placeholder='Enter your full name'
          />
        </div>
        <div>
          <label htmlFor='phone'>Phone:</label>
          <input
            type='tel'
            id='phone'
            value={phone}
            name='phone'
            onChange={handleChange}
            placeholder='Enter your phone number'
          />
        </div>
        <div>
          <label htmlFor='address'>Address:</label>
          <textarea
            id='address'
            value={address}
            name='address'
            onChange={handleChange}
            placeholder='Enter your address'
            rows='3'
          />
        </div>
        
        <div>
          <button disabled={!isFormValid()}>Sign Up</button>
          <button type='button' onClick={() => navigate('/')}>Cancel</button>
        </div>
      </form>
    </main>
  );
};

export default SignUpForm;
