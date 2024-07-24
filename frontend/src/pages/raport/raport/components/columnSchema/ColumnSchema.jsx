import './columnSchema.css';
import { useEffect } from 'react';
import { useDeleteColumnMutation } from '../../../redux/columnApiSlice';
import NewColumn from '../newColumn/NewColumn';
import PropTypes from 'prop-types';
import Loader from '../../../../../components/loader/Loader';

const ColumnSchema = ({ columns, valid, showModal, raportId }) => {
  const generateSelectOpt = (type) => {
    const inputTypes = [
      { type: 'string', text: 'Text' },
      { type: 'number', text: 'Number' },
      { type: 'boolean', text: 'CheckBox' },
      { type: 'array', text: 'Tags' },
    ];

    return inputTypes.find((typeData) => typeData.type === type)?.text;
  };

  const generateArrOpt = (arr) =>
    arr.map((item) => <option key={item}>{item}</option>);

  const [deleteColumn, { isLoading, isError, error }] =
    useDeleteColumnMutation();

  const onDeleteInput = async (columnId) => {
    const result = await deleteColumn({ raportId, columnId });
    if (result.data) {
      showModal(result.data.message, 'success');
    }
  };

  useEffect(() => {
    if (isError) {
      showModal(error.data.message);
    }
  }, [isError, showModal, error?.data?.message]);

  const columnRaport = columns.map((inputData) => {
    const boolOrArr =
      inputData.columnType === 'boolean' ? (
        <div className="boxArr">
          <select>
            <option>{inputData.trueValue}</option>
            <option>{inputData.falseValue}</option>
          </select>
        </div>
      ) : inputData.columnType === 'array' ? (
        <div className="boxArr">
          <select
            defaultValue={inputData.columnType}
            name="columnType"
            required
          >
            {generateArrOpt(inputData.arrayValues)}
          </select>
        </div>
      ) : null;

    return (
      <div className="column-input" key={inputData._id}>
        <div>
          <input
            disabled
            name="columnName"
            type="text"
            defaultValue={inputData.columnName}
            required
          />
          <select
            disabled
            defaultValue={inputData.columnType}
            name="columnType"
            required
          >
            <option value={inputData.columnType}>
              {generateSelectOpt(inputData.columnType)}
            </option>
          </select>
          <button
            onClick={(e) => {
              e.preventDefault();
              onDeleteInput(inputData._id);
            }}
          >
            <i className="fa-solid fa-trash-can"></i>
          </button>
        </div>
        {boolOrArr}
      </div>
    );
  });

  const formAddInput = !valid && (
    <NewColumn raportId={raportId} showModal={showModal} />
  );

  let loader;

  if (isLoading) {
    loader = <Loader />;
  }

  return (
    <form className="schema-content">
      <h2>Schema</h2>
      {loader}
      {columnRaport}
      {formAddInput}
    </form>
  );
};

ColumnSchema.propTypes = {
  columns: PropTypes.array.isRequired,
  valid: PropTypes.bool.isRequired,
  showModal: PropTypes.func.isRequired,
  raportId: PropTypes.string.isRequired,
};

export default ColumnSchema;
