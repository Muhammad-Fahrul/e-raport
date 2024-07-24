import './back.css';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const Back = ({ previousPath }) => {
  const navigate = useNavigate();
  return (
    <button
      className="back"
      onClick={() => navigate(previousPath, { replace: true })}
    >
      <i className="fa-solid fa-arrow-left"></i>
    </button>
  );
};

Back.propTypes = {
  previousPath: PropTypes.string.isRequired,
};

export default Back;
