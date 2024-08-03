import './buttonIcon.css';
import PropTypes from 'prop-types';

const ButtonIcon = ({ children, text, style }) => {
  return (
    <button className="button-icon-position-fixed" style={style}>
      <div className="icon">{children}</div>
      <div className="text">{text}</div>
    </button>
  );
};

ButtonIcon.propTypes = {
  children: PropTypes.element.isRequired,
  text: PropTypes.string.isRequired,
  style: PropTypes.object,
};

export default ButtonIcon;
