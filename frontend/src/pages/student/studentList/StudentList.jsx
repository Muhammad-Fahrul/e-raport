import './studentList.css';

import { useState } from 'react';

import ButtonIcon from '../../../components/button/ButtonIcon.jsx';
import { Student } from './components/student/Student.jsx';
import { NewStudent } from './components/newStudent/NewStudent.jsx';

import Loader from '../../../components/loader/Loader.jsx';
import Error from '../../../components/error/Error.jsx';

import { useGetStudentsByMentorIdQuery } from '../redux/studentApiSlice.js';
import useAuth from '../../../hooks/useAuth.js';

const StudentList = () => {
  const [screen, setScreen] = useState(false);
  const [searchName, setSearchName] = useState('');

  const authUser = useAuth();

  const { data, isSuccess, isLoading, isError, error } =
    useGetStudentsByMentorIdQuery('studentList', {
      pollingInterval: 60000,
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    });

  const handleClose = (e) => {
    if (e.target.className === 'container-student-new') {
      setScreen(false);
    }
  };

  let content;

  if (isLoading) {
    return <Loader />;
  } else if (isSuccess) {
    const { ids, entities } = data;

    let filteredIds;

    let filteredEntities;

    if (authUser.isStudent) {
      const authUserId = Object.values(entities).find(
        (e) =>
          e.username.toLocaleLowerCase() ===
          authUser.username.toLocaleLowerCase()
      )?.id;

      filteredEntities = Object.values(entities).filter(
        (e) =>
          e.username.toLocaleLowerCase() !==
          authUser.username.toLocaleLowerCase()
      );

      filteredIds = ids.filter((studentId) => studentId !== authUserId);
    } else {
      filteredEntities = entities;

      filteredIds = ids;
    }

    let keysSearch = Object.values(filteredEntities).map((student) => {
      if (!searchName.length) {
        return student.id;
      } else if (
        student.username
          .toLocaleLowerCase()
          .includes(searchName.toLocaleLowerCase())
      ) {
        return student.id;
      }
    });

    let searchedIds = keysSearch
      .filter((item) => item !== undefined)
      .map((keyId) => {
        return filteredIds.filter((id) => id === keyId)[0];
      });

    content = searchedIds.length ? (
      searchedIds.map((studentId) => (
        <Student key={studentId} studentId={studentId} />
      ))
    ) : (
      <h4>No Student</h4>
    );
  } else if (isError) {
    return <Error message={error.data?.message} />;
  }

  return (
    <div className="container-students">
      <h3>STUDENTS</h3>
      <form className="form-search">
        <span className="search-icon-container">
          <i className="fa-solid fa-magnifying-glass"></i>
        </span>
        <input
          type="search"
          placeholder="Search by Name"
          onChange={(e) => setSearchName(e.target.value)}
          value={searchName}
        />
      </form>
      <ul className="students">{content}</ul>

      {screen && (
        <div className="container-student-new" onClick={handleClose}>
          <NewStudent setScreen={setScreen} />
        </div>
      )}

      {authUser.isMentor && (
        <div onClick={() => setScreen(true)}>
          <ButtonIcon text="NEW">
            <i className="fa-solid fa-plus"></i>
          </ButtonIcon>
        </div>
      )}
    </div>
  );
};

export default StudentList;
