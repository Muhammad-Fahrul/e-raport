import './button.css';
import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

const Button = ({ url, text }) => {
  const location = useLocation();

  return (
    <div className="container-main-btn">
      <Link to={url} state={{ from: location }}>
        <button className="main-btn">
          {text}
          <div className="arrow">
            <div className="__arrow"></div>
          </div>
        </button>
      </Link>
    </div>
  );
};

Button.propTypes = {
  url: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};

export default Button;
