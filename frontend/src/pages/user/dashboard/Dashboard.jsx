import './dashboard.css';
import { useGetRaportsByMentorIdQuery } from '../../raport/redux/raportApiSlice.js';

import { Link } from 'react-router-dom';
import NewRaport from './components/Raport/newRaport/NewRaport.jsx';
import NewCollaborator from './components/newCollaborator/NewCollaborator.jsx';
import { useGetCollabsByMentorQuery } from '../redux/collaboratorApiSlice.js';

const Dashboard = () => {
  const { data, isSuccess, isLoading, isError, error } =
    useGetRaportsByMentorIdQuery();

  const {
    data: collabs,
    isSuccess: iSCollabs,
    isLoading: iLCollabs,
  } = useGetCollabsByMentorQuery();

  let raportsEl;

  let collabsEl;

  if (isLoading || iLCollabs) {
    raportsEl = <p>Loading...</p>;
    collabsEl = <p>Loading...</p>;
  } else if (isSuccess || iSCollabs) {
    const { raports } = data;
    const { collaborators } = collabs;
    raportsEl = raports.length ? (
      raports.map((raport) => {
        return (
          <li key={raport._id}>
            <Link to={`/mentor/raports/${raport._id}`}>
              <div className={raport.valid ? 'valid' : 'invalid'}>
                <h4>{raport.name}</h4>
                <span>{raport.valid ? 'valid' : 'invalid'}</span>
              </div>
            </Link>
          </li>
        );
      })
    ) : (
      <h4>Tidak ada raport</h4>
    );

    collabsEl = collaborators.length ? (
      collaborators.map((collab) => {
        return (
          <li key={collab._id}>
            <div className="valid">
              <h4>{collab.username}</h4>
            </div>
          </li>
        );
      })
    ) : (
      <h4>Tidak ada collaborator</h4>
    );
  } else if (isError) {
    raportsEl = <p>{error.data.message}</p>;
  }

  let content = (
    <div className="wrapper">
      <div>
        <h3>Santri</h3>
        <Link to="/mentor/students">
          <h5>
            Santri <i className="fa-solid fa-angles-right"></i>
          </h5>
        </Link>
      </div>
      <div>
        <NewRaport />
        <div className="books">
          <h3>Raports</h3>
          <ul>{raportsEl}</ul>
        </div>
      </div>
      <div>
        <NewCollaborator />
        <div className="collabs">
          <h3>Collaborators</h3>
          <ul>{collabsEl}</ul>
        </div>
      </div>
      <div>
        <h3>Analytics</h3>
        <Link to="/mentor/reports">
          <h5>
            Reports <i className="fa-solid fa-angles-right"></i>
          </h5>
        </Link>
        <Link to="/mentor/reports/array">
          <h5>
            Reports By Array <i className="fa-solid fa-angles-right"></i>
          </h5>
        </Link>
      </div>
    </div>
  );
  return <div className="container-dashboard">{content}</div>;
};

export default Dashboard;
