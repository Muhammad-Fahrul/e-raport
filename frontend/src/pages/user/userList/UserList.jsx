import './userList.css';

import { useState } from 'react';

import { User } from './components/user/User.jsx';

import Loader from '../../../components/loader/Loader.jsx';
import Error from '../../../components/error/Error.jsx';

import { useGetUsersQuery } from '../redux/userApiSlice.js';

const UserList = () => {
  const [searchName, setSearchName] = useState('');

  const { data, isSuccess, isLoading, isError, error } = useGetUsersQuery(
    'userList',
    {
      pollingInterval: 5000,
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );

  let content;

  if (isLoading) {
    return <Loader />;
  } else if (isSuccess) {
    const { ids, entities } = data;

    let filteredIds = ids;

    let filteredEntities = entities;

    let keysSearch = Object.values(filteredEntities).map((user) => {
      if (!searchName.length) {
        return user.id;
      } else if (
        user.username
          .toLocaleLowerCase()
          .includes(searchName.toLocaleLowerCase())
      ) {
        return user.id;
      }
    });

    let searchedIds = keysSearch
      .filter((item) => item !== undefined)
      .map((keyId) => {
        return filteredIds.filter((id) => id === keyId)[0];
      });

    content = searchedIds.length ? (
      searchedIds.map((userId) => <User key={userId} userId={userId} />)
    ) : (
      <h4>No User</h4>
    );
  } else if (isError) {
    return <Error message={error.data?.message} />;
  }

  return (
    <div className="container-users">
      <form className="form-search">
        <span className="search-icon-container">
          <i className="fa-solid fa-magnifying-glass"></i>
        </span>
        <input
          type="search"
          placeholder="Search by Name"
          onChange={(e) => setSearchName(e.target.value)}
          value={searchName}
        />
      </form>
      <ul className="users">{content}</ul>
    </div>
  );
};

export default UserList;
