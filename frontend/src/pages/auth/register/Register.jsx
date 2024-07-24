import './register.css';

import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import Loader from '../../../components/loader/Loader';

import { useRegisterMutation } from '../../user/redux/userApiSlice';
import { setCredentials } from '../redux/authSlice';

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const usernameRef = useRef();
  const errRef = useRef();

  const [username, setUsername] = useState('');
  const [validUsername, setValidUsername] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  const [password, setPassword] = useState('');
  const [validPassword, setValidPassword] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);

  const [matchPassword, setMatchPassword] = useState('');
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [errMsg, setErrMsg] = useState('');

  const [register, { isSuccess, isLoading, isError, error }] =
    useRegisterMutation();

  useEffect(() => {
    usernameRef.current.focus();
  }, []);

  useEffect(() => {
    setValidUsername(USER_REGEX.test(username));
  }, [username]);

  useEffect(() => {
    setValidPassword(PWD_REGEX.test(password));
    setValidMatch(password === matchPassword);
  }, [password, matchPassword]);

  useEffect(() => {
    if (isSuccess) {
      navigate('/login');
    }
  }, [isSuccess, navigate]);

  useEffect(() => {
    setErrMsg('');
  }, [username, password, matchPassword]);

  const handleRegister = async (e) => {
    e.preventDefault();
    const v1 = USER_REGEX.test(username);
    const v2 = PWD_REGEX.test(password);
    if (!v1 || !v2) {
      setErrMsg('Invalid Entry');
      return;
    }
    try {
      const res = await register({
        username,
        password,
      }).unwrap();
      dispatch(setCredentials({ ...res }));
    } catch (err) {
      console.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="container-register">
      {isLoading && <Loader />}
      <form className="wrapper" onSubmit={handleRegister}>
        <div className="title" style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '1em' }}>Sign Up</h1>
          <p
            ref={errRef}
            className={errMsg ? 'errmsg' : 'offscreen'}
            aria-live="assertive"
          >
            {errMsg}
          </p>
          <p className={!isError ? 'offscreen' : ''}>{error?.data?.message}</p>
        </div>

        <div className="inputBox">
          <input
            autoComplete="off"
            className="__input"
            name="username"
            placeholder="Username"
            type="text"
            ref={usernameRef}
            value={username}
            aria-invalid={validUsername ? 'false' : 'true'}
            aria-describedby="uidnote"
            onFocus={() => setUserFocus(true)}
            onBlur={() => setUserFocus(false)}
            onChange={(e) => setUsername(e.target.value)}
          />
          <span>Username</span>
          <p
            id="uidnote"
            className={
              userFocus && username && !validUsername
                ? 'instructions'
                : 'offscreen'
            }
          >
            4 to 24 characters.
            <br />
            Must begin with a letter.
            <br />
            Letters, numbers, underscores, hyphens allowed.
          </p>
        </div>

        <div className="inputBox">
          <input
            autoComplete="off"
            name="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
            aria-invalid={validPassword ? 'false' : 'true'}
            aria-describedby="confirmnote"
            onFocus={() => setPasswordFocus(true)}
            onBlur={() => setPasswordFocus(false)}
          />
          <span>Password</span>
          <p
            id="pwdnote"
            className={
              passwordFocus && !validPassword ? 'instructions' : 'offscreen'
            }
          >
            8 to 24 characters.
            <br />
            Must include uppercase and lowercase letters, a number and a special
            character.
            <br />
            Allowed special characters:{' '}
            <span aria-label="exclamation mark">!</span>{' '}
            <span aria-label="at symbol">@</span>{' '}
            <span aria-label="hashtag">#</span>{' '}
            <span aria-label="dollar sign">$</span>{' '}
            <span aria-label="percent">%</span>
          </p>
        </div>

        <div className="inputBox">
          <input
            className="__input"
            autoComplete="off"
            name="password"
            onChange={(e) => setMatchPassword(e.target.value)}
            value={matchPassword}
            required
            aria-invalid={validMatch ? 'false' : 'true'}
            aria-describedby="confirmnote"
            onFocus={() => setMatchFocus(true)}
            onBlur={() => setMatchFocus(false)}
          />
          <span>Confirm</span>
          <p
            id="confirmnote"
            className={matchFocus && !validMatch ? 'instructions' : 'offscreen'}
          >
            Must match the first password input field.
          </p>
        </div>

        <button className="enter">Register</button>
      </form>
      <p>
        Already registered?
        <span className="line">
          <Link to="/login">Login</Link>
        </span>
      </p>
    </div>
  );
};

export default Register;
