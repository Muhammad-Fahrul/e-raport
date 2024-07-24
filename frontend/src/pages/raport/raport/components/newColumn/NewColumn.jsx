import './newColumn.css';
import { useEffect, useState } from 'react';
import { useAddColumnMutation } from '../../../redux/columnApiSlice';
import PropTypes from 'prop-types';
import Loader from '../../../../../components/loader/Loader';

const NewColumn = ({ raportId, showModal }) => {
  const [inputName, setInputName] = useState('');
  const [inputType, setInputType] = useState('string');
  const [trueValue, setTrueValue] = useState('');
  const [falseValue, setFalseValue] = useState('');
  const [arrayValues, setArrayValues] = useState([]);

  const [addColumn, { isLoading, isError, error }] = useAddColumnMutation();

  const onAddToInputBody = async () => {
    try {
      let newInput = { columnName: inputName, columnType: inputType };

      if (inputType === 'boolean') {
        newInput.trueValue = trueValue;
        newInput.falseValue = falseValue;
      } else if (inputType === 'array') {
        newInput.arrayValues = arrayValues;
      }
      const result = await addColumn({
        raportId,
        ...newInput,
      });
      setInputName('');
      setInputType('string');
      setTrueValue('');
      setFalseValue('');
      setArrayValues([]);

      showModal(result?.data?.message, 'success');
    } catch (error) {
      console.log(error?.data?.message);
    }
  };

  useEffect(() => {
    if (isError) {
      showModal(error.data.message || 'An error occurred!', 'error');
    }
  }, [isError, showModal, error]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="column-input">
      <div>
        <input
          type="text"
          name="inputName"
          id="inputName"
          value={inputName}
          onChange={(e) => setInputName(e.target.value)}
          placeholder="name"
          required
        />
        <select
          value={inputType}
          name="inputType"
          id="inputType"
          onChange={(e) => setInputType(e.target.value)}
          required
        >
          <option value="string">Text</option>
          <option value="number">Number</option>
          <option value="boolean">CheckBox</option>
          <option value="array">Tags</option>
        </select>
        <button
          className="add-new-input"
          onClick={(e) => {
            e.preventDefault();
            if (inputName) {
              const newInput = { inputName, inputType };
              if (inputType === 'boolean') {
                newInput.trueValue = trueValue;
                newInput.falseValue = falseValue;
              }
              onAddToInputBody(newInput);
            }
          }}
        >
          <i className="fa-solid fa-plus"></i>
        </button>
      </div>
      {inputType === 'boolean' && (
        <div className="boxArr">
          <input
            type="text"
            name="trueValue"
            id="trueValue"
            value={trueValue}
            onChange={(e) => setTrueValue(e.target.value)}
            placeholder="True Value"
            required
          />
          <input
            type="text"
            name="falseValue"
            id="falseValue"
            value={falseValue}
            onChange={(e) => setFalseValue(e.target.value)}
            placeholder="False Value"
            required
          />
        </div>
      )}
      {inputType === 'array' && (
        <div className="boxArr">
          {arrayValues.map((v, i) => (
            <input disabled key={v + i} value={v} />
          ))}
          <input
            type="text"
            name="arrayValues"
            id="arrayValues"
            value={arrayValues}
            onChange={(e) => setArrayValues(e.target.value.split(','))}
            placeholder="Array Values (comma separated)"
            required
          />
        </div>
      )}
    </div>
  );
};

NewColumn.propTypes = {
  raportId: PropTypes.string.isRequired,
  showModal: PropTypes.func.isRequired,
};

export default NewColumn;
