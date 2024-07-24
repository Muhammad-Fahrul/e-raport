import PropTypes from 'prop-types';

const TableComponent = ({ students }) => {
  return (
    <div className="container">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>{student.name}</td>
              <td>{student.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

TableComponent.propTypes = {
  students: PropTypes.array.isRequired,
};

export default TableComponent;
