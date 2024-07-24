import './profile.css';
import profile from '../../../../assets/icons/user.svg';

import PropTypes from 'prop-types';
import Back from '../../../../components/button/back/Back';

const Profile = ({ user }) => {
  const content = (
    <div className="container-user-profile">
      <div className="container-back">
        <span className="dotted-line" />
        <Back previousPath={'/users'} />
      </div>
      <div className="wrapper">
        <div className="profile">
          <img className="img-profile" src={user.urlImgProfile || profile} />
        </div>
        <div className="description">
          <div className="top">
            <h1>Profile</h1>
          </div>
          <div className="bottom">
            <table>
              <tbody>
                <tr>
                  <th>
                    <i className="fa-solid fa-user-tie"></i>
                  </th>
                  <td>{user.role}</td>
                </tr>
                <tr>
                  <th>
                    <i className="fa-solid fa-id-badge"></i>
                  </th>
                  <td>{user.username}</td>
                </tr>
                <tr>
                  <th>
                    <i className="fa-solid fa-phone"></i>
                  </th>
                  <td>{user.phone}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
  return content;
};

Profile.propTypes = {
  user: PropTypes.object.isRequired,
};
export default Profile;
