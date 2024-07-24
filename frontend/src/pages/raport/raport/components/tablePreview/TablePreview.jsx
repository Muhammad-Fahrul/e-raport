import './tablePreview.css';
import PropTypes from 'prop-types';

const TablePreview = ({ columns, handleDetail }) => {
  const generateTableContent = (columns) => {
    const theadColumn = columns
      .slice(0, 3)
      .map((inputData, i) => (
        <th key={inputData + i}>{inputData.columnName}</th>
      ));

    const theadDetailColumn = columns.length ? <th>Info</th> : null;

    const tbodyDummy = columns.slice(0, 3).map((item, i) => {
      if (item.columnType === 'number') {
        return <td key={item.columnName}>{i}</td>;
      } else if (item.columnType === 'string') {
        return <td key={item.columnName}>{item.columnName}</td>;
      } else if (item.columnType === 'boolean') {
        return <td key={item.columnName}>true</td>;
      }
    });

    const buttonDetail = columns.length ? (
      <td>
        <button
          className="detail-raport-preview-btn"
          onClick={() => handleDetail(columns)}
        >
          <i className="fa-solid fa-circle-info"></i>
        </button>
      </td>
    ) : null;

    return (
      <table className="table-raport">
        <thead>
          <tr>
            {theadDetailColumn}
            {theadColumn}
          </tr>
        </thead>
        <tbody>
          <tr>
            {buttonDetail}
            {tbodyDummy}
          </tr>
        </tbody>
      </table>
    );
  };

  return (
    <div className="container-table-raport">
      <h2>Preview</h2>
      {generateTableContent(columns)}
    </div>
  );
};

TablePreview.propTypes = {
  columns: PropTypes.array.isRequired,
  handleDetail: PropTypes.func.isRequired,
};

export default TablePreview;
