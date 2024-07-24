import './editStudentForm.css';
import profile from '../../../../../assets/icons/user.svg';

import { useLocation, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useDeleteStudentMutation } from '../../../redux/studentApiSlice';
import { useEffect, useState } from 'react';
import { NewRaportRelation } from '../newRaportRelation/NewRaportRelation';
import useAuth from '../../../../../hooks/useAuth';
import ButtonIcon from '../../../../../components/button/ButtonIcon';
import Back from '../../../../../components/button/back/Back';
import Loader from '../../../../../components/loader/Loader';

const EditStudentForm = ({ student }) => {
  const authUser = useAuth();
  const [screen, setScreen] = useState(false);

  const navigate = useNavigate();

  const location = useLocation();

  const [deleteStudent, { isSuccess, isLoading }] = useDeleteStudentMutation();

  const handleClose = (e) => {
    if (e.target.className === 'container-student-new') {
      setScreen(false);
    }
  };

  const toRecords = (raportId) => {
    navigate(`/students/${student.username}/records/${raportId}`, {
      state: { from: location },
    });
  };

  const handleDeleteStudent = async (e) => {
    e.preventDefault();
    if (confirm(`anda yakin ingin menghapus ${student.username}?`)) {
      await deleteStudent({ username: student.username });
    }
  };

  useEffect(() => {
    if (isSuccess) {
      navigate('/mentor/students');
    }
  }, [isSuccess, navigate]);

  const content = (
    <div className="container-student-profile">
      {isLoading && <Loader />}

      <div className="container-back">
        <span className="dotted-line" />
        <Back previousPath={'/mentor/students'} />
      </div>
      <div className="wrapper">
        <div className="profile">
          <img className="img-profile" src={student.urlImgProfile || profile} />
        </div>
        <div className="description">
          <div className="top">
            <h1>Profile</h1>
          </div>
          <div className="bottom">
            <table>
              <tbody>
                <tr>
                  <th>
                    <i className="fa-solid fa-user-tie"></i>
                  </th>
                  <td>{student.role}</td>
                </tr>
                <tr>
                  <th>
                    <i className="fa-solid fa-id-badge"></i>
                  </th>
                  <td>{student.username}</td>
                </tr>
                <tr>
                  <th>
                    <i className="fa-solid fa-phone"></i>
                  </th>
                  <td>{student.phone}</td>
                </tr>
              </tbody>
            </table>
            {authUser.id === student.mentorId && (
              <div className="button-profile">
                <button
                  className="button-delete-student"
                  onClick={handleDeleteStudent}
                >
                  delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {screen && (
        <div className="container-student-new" onClick={handleClose}>
          <NewRaportRelation userDisplayed={student} setScreen={setScreen} />
        </div>
      )}
      {((student.role === 'student' &&
        authUser.username === student.username) ||
        (authUser.isMentor && student.username !== authUser.username)) && (
        <div className="books">
          <h3>Raports</h3>
          <ul>
            {student.raportIdsStudent.map((raport) => {
              return (
                <li key={raport._id} onClick={() => toRecords(raport.raportId)}>
                  <h4>{raport.raportName}</h4>
                </li>
              );
            })}
          </ul>
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
  return content;
};

EditStudentForm.propTypes = {
  student: PropTypes.object.isRequired,
};

export default EditStudentForm;
