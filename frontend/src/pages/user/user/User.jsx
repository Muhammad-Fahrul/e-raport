import { useParams } from 'react-router-dom';
import { useGetUsersQuery } from '../redux/userApiSlice';
import Loader from '../../../components/loader/Loader';
import Profile from './profile/Profile';

const User = () => {
  const { username } = useParams();

  const { users } = useGetUsersQuery('userList', {
    selectFromResult: ({ data }) => ({
      users: data?.entities,
    }),
  });

  if (!users) return <Loader />;

  const user = Object.values(users).filter((u) => u.username === username)[0];

  const content = <Profile user={user} />;

  return content;
};

export default User;
