import './home.css';

import greeting from '../../../utils/greeting.js';
import useAuth from '../../../hooks/useAuth.js';
import { Link } from 'react-router-dom';

const Home = () => {
  const user = useAuth();

  return (
    <div className="container-home">
      <h2>Hi, Selamat {`${greeting()} ${user.username.split(' ')[0]}`}</h2>
      <div className="wrapper">
        <div>
          <h3>Users</h3>
          <Link to="/users">
            <h5>
              Semua pengguna <i className="fa-solid fa-angles-right"></i>
            </h5>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
