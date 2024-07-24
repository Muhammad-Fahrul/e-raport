import './newStudent.css';

import { useState } from 'react';
import PropTypes from 'prop-types';
import { useAddStudentMutation } from '../../../redux/studentApiSlice';
import Loader from '../../../../../components/loader/Loader';

const NewStudent = ({ setScreen }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [addStudent, { isLoading, isError, error }] = useAddStudentMutation();

  const handleAdd = (e) => {
    e.preventDefault();
    const add = async () => {
      try {
        const res = await addStudent({
          username,
          password,
        }).unwrap();
        setScreen(false);
        alert(`${res.message}`);
        setUsername('');
        setPassword('');
      } catch (err) {
        alert(`${username} gagal ditambahkan`);
      }
    };
    add();
  };

  return (
    <>
      {Loader && isLoading}
      <form onSubmit={(e) => handleAdd(e)} className="wrapper">
        <div className="title" style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '1em' }}>New Student</h1>
          <p
            style={{
              opacity: isError ? 1 : 0,
              color: 'red',
              fontSize: '0.6rem',
              width: '200px',
            }}
          >
            {error?.data?.message}
          </p>
        </div>

        <div className="inputBox">
          <input
            name="username"
            type="text"
            required="required"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <span>Username</span>
        </div>

        <div className="inputBox">
          <input
            name="password"
            type="text"
            required="required"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span>Password</span>
        </div>

        <button className="enter">Add</button>
      </form>
    </>
  );
};

NewStudent.propTypes = {
  setScreen: PropTypes.func.isRequired,
};

export { NewStudent };
