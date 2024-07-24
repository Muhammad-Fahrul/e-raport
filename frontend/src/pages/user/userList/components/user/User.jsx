import './user.css';

import { memo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

import { useGetUsersQuery } from '../../../redux/userApiSlice';

const User = ({ userId }) => {
  const navigate = useNavigate();

  const { user } = useGetUsersQuery('userList', {
    selectFromResult: ({ data }) => ({
      user: data?.entities[userId],
    }),
  });

  const location = useLocation();

  const handleToDetail = () => {
    navigate(`/users/${user.username}`, {
      state: { from: location },
    });
  };

  let content = (
    <li className="container-user">
      <div className="top">
        <p className="description" onClick={handleToDetail}>
          {user.username}
        </p>
      </div>
    </li>
  );

  return <>{content}</>;
};

User.propTypes = {
  userId: PropTypes.string.isRequired,
};

const memoizedUser = memo(User);

export { memoizedUser as User };
