import './modal.css';
import PropTypes from 'prop-types';

const Modal = ({ type, message }) => (
  <div
    className={`modal ${type === 'success' ? 'show success' : 'show error'}`}
  >
    <p>{message}</p>
  </div>
);

Modal.propTypes = {
  type: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
};
export default Modal;
