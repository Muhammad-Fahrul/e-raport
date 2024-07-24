import store from '../app/store';
import { userApiSlice } from '../pages/user/redux/userApiSlice';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

const Prefetch = () => {
  useEffect(() => {
    store.dispatch(
      userApiSlice.util.prefetch('getUsers', 'userList', {
        force: true,
      })
    );
  }, []);

  return <Outlet />;
};
export default Prefetch;
