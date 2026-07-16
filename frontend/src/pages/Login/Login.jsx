import React, { useState } from 'react';
import background_banner from '../../assets/background_banner.jpg';
import netflix_spinner from '../../assets/netflix_spinner.gif';
import './Login.css';
import { login, signup } from '../../firebase';

const Login = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const userAuth = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (isLogin) {
      await login(formData.email, formData.password);
    } else {
      await signup(formData.name, formData.email, formData.password);
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="loading_spinner">
        <img src={netflix_spinner} alt="" />
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="bg-image">
        <img src={background_banner} alt="background" className="background" />
      </div>

      <div className="login-form">
        <h1>{isLogin ? 'Sign In' : 'Sign Up'}</h1>

        <form onSubmit={userAuth}>
          {!isLogin && (
            <input
              type="text"
              placeholder="Full Name"
              required
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            />
          )}

          <input
            type="email"
            placeholder="Email or phone number"
            required
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          />

          <input
            type="password"
            placeholder="Password"
            required
            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
          />

          <button type="submit">{isLogin ? 'Sign In' : 'Sign Up'}</button>

          <div className="form-options">
            {isLogin ? (
              <>
                <label>
                  <input type="checkbox" /> Remember me
                </label>
                <p>Need help?</p>
              </>
            ) : (
              <label>
                <input type="checkbox" required /> I agree to the Terms of Use
              </label>
            )}
          </div>
        </form>

        {isLogin ? (
          <p className="signup-text">
            New to Metflix?{' '}
            <span onClick={() => setIsLogin(false)}>Sign up now</span>
          </p>
        ) : (
          <p className="signup-text">
            Already have an account?{' '}
            <span onClick={() => setIsLogin(true)}>Sign in</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
