import './recordList.css';

import { useParams, useLocation } from 'react-router-dom';

import { useState } from 'react';
import useAuth from '../../../hooks/useAuth.js';
import ButtonIcon from '../../../components/button/ButtonIcon.jsx';

import { RecordTable } from '../../../components/recordTable/RecordTable.jsx';
import { NewRecord } from './components/newRecord/NewRecord.jsx';
import Back from '../../../components/button/back/Back.jsx';
import { useGetRecordQuery } from '../redux/recordApiSlice.js';

const RecordList = () => {
  const location = useLocation();
  const currentUser = useAuth();
  const [screenNR, setScreenNR] = useState(false);
  const { username, raportId } = useParams();

  const { data, isSuccess, isLoading, isError, error } = useGetRecordQuery({
    username,
    raportId,
  });

  const previousPath = location.state?.from.pathname || '/';

  let recordNameEl;

  let recordsEl;

  let newRecordEl;

  let addNewRecordEl;

  if (isLoading) {
    recordsEl = <p>loading...</p>;
  } else if (isSuccess) {
    const { student,raport, records } = data;
    recordNameEl = <span>{raport.name}</span>;

    recordsEl = records.length ? (
      <RecordTable raportStatus={raport.status} records={records} />
    ) : (
      <p>Kosong</p>
    );

    newRecordEl = screenNR && raport.status && (
      <NewRecord
        studentId={student._id}
        raportId={raport._id}
        columns={raport.columns}
        setScreenNR={setScreenNR}
      />
    );

    addNewRecordEl = currentUser?.isMentor && raport.status && (
      <div onClick={() => setScreenNR(true)}>
        <ButtonIcon text="NEW">
          <i className="fa-solid fa-plus"></i>
        </ButtonIcon>
      </div>
    );
  } else if (isError) {
    return <p>{error?.data?.message}</p>;
  }

  return (
    <div className="container-raport">
      <div className="top">
        <div>
          <h1 className="username">
            <span>{username}</span>
          </h1>
          {recordNameEl}
        </div>
        <Back previousPath={previousPath} />
      </div>

      {recordsEl}
      {newRecordEl}
      {addNewRecordEl}
    </div>
  );
};

export default RecordList;
