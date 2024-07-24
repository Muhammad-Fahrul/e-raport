import './profile.css';
import profile from '../../../assets/icons/user.svg';

import { useLocation, useNavigate } from 'react-router-dom';

import Loader from '../../../components/loader/Loader';

import { useGetUserByUsernameQuery } from '../redux/userApiSlice';
import useAuth from '../../../hooks/useAuth';
const Profile = () => {
  const navigate = useNavigate();
  const { username } = useAuth();

  const location = useLocation();

  const {
    data: userDisplayed,
    isSuccess,
    isLoading,
    isError,
    error,
  } = useGetUserByUsernameQuery(username);

  const toRecords = (raportId) => {
    navigate(`/users/${userDisplayed.username}/records/${raportId}`, {
      state: { from: location },
    });
  };

  let content;

  if (isLoading) {
    return <Loader />;
  } else if (isSuccess) {
    content = (
      <div className="description">
        <div className="top">
          <h1>Profile</h1>
          <button
            onClick={() => navigate(`edit`, { state: { from: location } })}
          >
            <i className="fa-solid fa-pen-to-square"></i>
          </button>
        </div>
        <div className="bottom">
          <table>
            <tbody>
              <tr>
                <th>
                  <i className="fa-solid fa-user-tie"></i>
                </th>
                <td>{userDisplayed.role}</td>
              </tr>
              <tr>
                <th>
                  <i className="fa-solid fa-id-badge"></i>
                </th>
                <td>{userDisplayed.username}</td>
              </tr>
              <tr>
                <th>
                  <i className="fa-solid fa-phone"></i>
                </th>
                <td>{userDisplayed.phone}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  } else if (isError) {
    return <h1>{error.data.message}</h1>;
  }

  return (
    <div className="container-user-profile">
      <div className="wrapper">
        <div className="profile">
          <img
            className="img-profile"
            src={userDisplayed.urlImgProfile || profile}
          />
        </div>
        {content}
      </div>
      {userDisplayed.role === 'student' &&
        userDisplayed.raportIdsStudent.length && (
          <div className="books">
            <h3>Raports</h3>
            <ul>
              {userDisplayed.raportIdsStudent.map((raport) => {
                return (
                  <li
                    key={raport._id}
                    onClick={() => toRecords(raport.raportId)}
                  >
                    <h4>{raport.raportName}</h4>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
    </div>
  );
};

export default Profile;
