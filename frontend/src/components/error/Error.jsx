import PropTypes from 'prop-types';

const Error = ({ message }) => {
  return (
    <h4 style={{ padding: '1em' }}>{message || 'something went wrong'}</h4>
  );
};

Error.propTypes = {
  message: PropTypes.string,
};

export default Error;
