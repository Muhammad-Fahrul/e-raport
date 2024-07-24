import './login.css';

import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import Loader from '../../../components/loader/Loader.jsx';

import { useLoginMutation } from '../redux/authApiSlice.js';
import { setCredentials } from '../redux/authSlice.js';

const Login = () => {
  const userRef = useRef();
  const errRef = useRef();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errMsg, setErrMsg] = useState('');

  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const from = location.state?.from?.pathname || '/';

  const [login, { isLoading }] = useLoginMutation();

  useEffect(() => {
    setErrMsg('');
  }, [username, password]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await login({
        username,
        password,
      }).unwrap();
      dispatch(setCredentials(data));
      navigate(from, { replace: true });
    } catch (err) {
      console.log(err);
      if (!err.status) {
        setErrMsg('No Server Response');
      } else if (err.status === 400) {
        setErrMsg(err.data.message);
      } else if (err.status === 401) {
        setErrMsg('Unauthorized');
      } else {
        setErrMsg(err.data?.message);
      }
      errRef.current.focus();
    }
  };

  const errClass = errMsg ? 'errmsg' : 'offscreen';

  let content;

  if (isLoading) content = <Loader />;

  content = (
    <div className="container-login">
      <form onSubmit={handleLogin} className="wrapper">
        <div className="title">
          <h2>Login</h2>
          <p ref={errRef} className={errClass} aria-live="assertive">
            {errMsg}
          </p>
        </div>

        <div className="inputBox">
          <input
            name="username"
            type="text"
            required="required"
            ref={userRef}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="usernname"
          />
          <span>Username</span>
        </div>

        <div className="inputBox">
          <input
            name="password"
            type="password"
            required="required"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          <span>Password</span>
        </div>

        <button className="enter">Login</button>
      </form>
    </div>
  );

  return content;
};

export default Login;
