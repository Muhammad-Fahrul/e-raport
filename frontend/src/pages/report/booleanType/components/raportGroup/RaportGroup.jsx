import PropTypes from 'prop-types';
import { useState } from 'react';

const RaportGroup = ({ raportData }) => {
  const [selectedValue, setSelectedValue] = useState(
    raportData.columnAnalytics[0].columnValue
  );

  const handleValueChange = (e) => {
    setSelectedValue(Number(e.target.value));
  };

  const selectedAnalytics = raportData.columnAnalytics.find(
    (analytics) => analytics.columnValue === selectedValue
  );

  return (
    <div className="report-group">
      <h3>
        {raportData.raportName} - {raportData.columnName}
      </h3>
      <select onChange={handleValueChange} value={selectedValue}>
        {raportData.columnAnalytics.map((analytics) => (
          <option key={analytics.columnValue} value={analytics.columnValue}>
            {analytics.columnValue}
          </option>
        ))}
      </select>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            {Object.keys(selectedAnalytics.students[0].columnStatic).map(
              (key) => (
                <th key={key}>{key}</th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {selectedAnalytics.students.map((student) => (
            <tr key={student.studentId}>
              <td>{student.studentName}</td>
              {Object.values(student.columnStatic).map((value, index) => (
                <td key={index}>{value}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

RaportGroup.propTypes = {
  raportData: PropTypes.object.isRequired,
};

export default RaportGroup;
