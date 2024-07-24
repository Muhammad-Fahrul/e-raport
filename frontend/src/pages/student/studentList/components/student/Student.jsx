import './student.css';

import { memo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

import { useGetStudentsByMentorIdQuery } from '../../../redux/studentApiSlice';

const Student = ({ studentId }) => {
  const navigate = useNavigate();

  const { student } = useGetStudentsByMentorIdQuery('studentList', {
    selectFromResult: ({ data }) => ({
      student: data?.entities[studentId],
    }),
  });

  const location = useLocation();

  const handleToDetail = () => {
    navigate(`${student.username}`, {
      state: { from: location },
    });
  };

  let content = (
    <li className="container-student">
      <div className="top">
        <p className="description" onClick={handleToDetail}>
          {student.username}
        </p>
      </div>
    </li>
  );

  return <>{content}</>;
};

Student.propTypes = {
  studentId: PropTypes.string.isRequired,
};

const memoizedStudent = memo(Student);

export { memoizedStudent as Student };
