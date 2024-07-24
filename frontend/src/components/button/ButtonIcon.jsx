import './buttonIcon.css';
import PropTypes from 'prop-types';

const ButtonIcon = ({ children, text }) => {
  return (
    <button className="button-icon-position-fixed">
      <div className="icon">{children}</div>
      <div className="text">{text}</div>
    </button>
  );
};

ButtonIcon.propTypes = {
  children: PropTypes.element.isRequired,
  text: PropTypes.string.isRequired,
};

export default ButtonIcon;
