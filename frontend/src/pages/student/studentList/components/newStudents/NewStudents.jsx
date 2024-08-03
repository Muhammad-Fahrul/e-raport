import { useState } from 'react';
import { useAddStudentsMutation } from '../../../redux/studentApiSlice';

function NewStudents() {
  const [file, setFile] = useState(null);
  const [addStudents, { isLoading, isSuccess, isError, error }] =
    useAddStudentsMutation();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      return alert('Please upload a file');
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      await addStudents(formData).unwrap();
      setFile(null);
    } catch (err) {
      console.error('Failed to upload file: ', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="wrapper">
      <div>
        <label htmlFor="file">Upload CSV file:</label>
        <input
          type="file"
          id="file"
          accept=".csv"
          onChange={handleFileChange}
        />
      </div>
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Uploading...' : 'Upload'}
      </button>
      {isSuccess && <p>Users added successfully!</p>}
      {isError && (
        <p>Error: {error?.data?.message || 'Failed to upload file'}</p>
      )}
    </form>
  );
}

export default NewStudents;
