import './arrayType.css';
import { useGetReportsArrayTypeQuery } from '../redux/reportApiSlice';
import TableComponent from './component/ArrayTable';
import ArrayDropdown from './component/ArrayDropDown';
import { useEffect, useState } from 'react';

const ArrayType = () => {
  const { data, error, isLoading } = useGetReportsArrayTypeQuery();
  const [selectedValue, setSelectedValue] = useState('');

  useEffect(() => {
    if (data && data.data && data.data.length > 0) {
      const columnData = data.data[0];
      if (columnData.values && columnData.values.length > 0) {
        setSelectedValue(columnData.values[0].value);
      }
    }
  }, [data]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!data || !data.data || data.data.length === 0) {
    return <div>No data available</div>;
  }

  const columnData = data.data[0]; // Asumsikan hanya satu set data kolom yang diterima
  const selectedStudents =
    columnData.values.find((valueData) => valueData.value === selectedValue)
      ?.students || [];

  return (
    <div className="array-table">
      <h3>{columnData.raport.name}</h3>
      <ArrayDropdown
        values={columnData.values}
        selectedValue={selectedValue}
        onSelect={setSelectedValue}
      />
      {selectedValue && (
        <TableComponent
          students={selectedStudents.map((student) => ({
            ...student,
          }))}
        />
      )}
    </div>
  );
};

export default ArrayType;
