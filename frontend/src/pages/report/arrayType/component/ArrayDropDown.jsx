import PropTypes from 'prop-types';

const ArrayDropdown = ({ values, selectedValue, onSelect }) => {
  return (
    <div className="dropdown-container" style={{ marginBottom: '.4em' }}>
      <select value={selectedValue} onChange={(e) => onSelect(e.target.value)}>
        {values.map((value) => (
          <option key={value.value} value={value.value}>
            {value.value}
          </option>
        ))}
      </select>
    </div>
  );
};

ArrayDropdown.propTypes = {
  values: PropTypes.array.isRequired,
  selectedValue: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default ArrayDropdown;
