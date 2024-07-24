import './editUser.css';

import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import {
  useUpdateUserMutation,
  useUpdateUserProfileMutation,
} from '../redux/userApiSlice';

import Loader from '../../../components/loader/Loader';

const EditUser = () => {
  const [state, setState] = useState({
    phone: '',
    oldPassword: '',
    newPassword: '',
  });

  const [file, setFile] = useState(null);

  const navigate = useNavigate();

  const location = useLocation();

  const previousPath = location.state && location.state.from.pathname;

  const handleChangeFile = (e) => {
    setFile(e.target.files[0]);
  };

  const handleChange = (e) => {
    const target = e.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    setState((prev) => ({ ...prev, [name]: value }));
  };

  const [updateUserProfile, { isLoading: iLUUP }] =
    useUpdateUserProfileMutation();

  const [updateUser, { isLoading, isError, error }] = useUpdateUserMutation();

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append('file', file);
    try {
      const res = await updateUserProfile(formData).unwrap();
      alert(res.message);
    } catch (err) {
      alert(err.data.message);
      console.log(err);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateUser({
        phone: state.phone,
        oldPassword: state.oldPassword,
        newPassword: state.newPassword,
      }).unwrap();
      alert('Profile updated successfully');
      navigate(previousPath);
    } catch (err) {
      console.log(err?.data?.message || err.error);
    }
  };

  return (
    <div className="container-user-edit">
      <div>
        <h2 className="title">Update Profile</h2>
        <p
          style={{
            opacity: isError ? 1 : 0,
            color: 'red',
            textAlign: 'center',
            fontSize: '.8rem',
            height: '15px',
          }}
        >
          {error?.data?.message || ''}
        </p>
      </div>

      <form className="form-profile-photo" onSubmit={handleUpdateProfile}>
        <div>
          <label>Profile Photo</label>
          <input
            className="input"
            name="file"
            type="file"
            accept="image/*"
            onChange={handleChangeFile}
          />
        </div>
        <button>update</button>
      </form>

      <form className="wrapper" autoComplete="off" onSubmit={handleUpdate}>
        <label>
          <input
            className="input"
            name="phone"
            type="number"
            value={state.phone}
            onChange={handleChange}
          />
          <span>Phone</span>
        </label>

        <label>
          <input
            className="input"
            name="oldPassword"
            type="text"
            value={state.oldPassword}
            onChange={handleChange}
          />
          <span>Old Password</span>
        </label>

        <label>
          <input
            className="input"
            name="newPassword"
            type="text"
            value={state.newPassword}
            onChange={handleChange}
          />
          <span>New Password</span>
        </label>

        <button className="update">Update</button>
        {(isLoading || iLUUP) && <Loader />}
      </form>
    </div>
  );
};

export default EditUser;
