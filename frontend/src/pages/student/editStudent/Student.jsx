import { useGetStudentsByMentorIdQuery } from '../redux/studentApiSlice';

import Loader from '../../../components/loader/Loader';
import EditStudentForm from './components/editStudentFomr/EditStudentForm';
import { useParams } from 'react-router-dom';

const Student = () => {
  const { username } = useParams();

  const { students } = useGetStudentsByMentorIdQuery('studentList', {
    selectFromResult: ({ data }) => ({
      students: data?.entities,
    }),
  });

  if (!students) return <Loader />;

  const student = Object.values(students).filter(
    (s) => s.username === username
  )[0];

  if (!student) {
    return <h3>Student Not found</h3>;
  }

  const content = <EditStudentForm student={student} />;

  return <>{content}</>;
};

export default Student;
