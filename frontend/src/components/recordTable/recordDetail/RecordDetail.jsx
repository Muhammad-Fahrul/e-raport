import './recordDetail.css';

import { useEffect } from 'react';

import useAuth from '../../../hooks/useAuth';
import { useDeleteRecordMutation } from '../../../pages/record/redux/recordApiSlice';

import PropTypes from 'prop-types';

import Loader from '../../loader/Loader';

const RecordDetail = ({
  studentId,
  raportId,
  raportStatus,
  record,
  setScreen,
  isDemo = false,
}) => {
  const user = useAuth();

  const [deleteRecord, { isLaoding, isSuccess, isError, error }] =
    useDeleteRecordMutation();

  const handleClick = (e) => {
    if (e.target.className === 'container-raport-detail') {
      setScreen(false);
    }
  };

  const handleDelete = async (recordId) => {
    if (!isDemo) {
      if (confirm('anda yakin ingin menghapus record ini?')) {
        await deleteRecord({ studentId, recordId, raportId });
      }
      return;
    }

    alert('fungsi ini hanya demo');
  };

  useEffect(() => {
    if (isSuccess) {
      setScreen(false);
    }
  }, [isSuccess, isError, setScreen]);

  if (isLaoding) {
    return <Loader />;
  }

  return (
    <div className="container-raport-detail" onClick={handleClick}>
      <div className="wrapper-raport-detail">
        {isError && <p>{error?.data?.message}</p>}
        <div>
          <h3>Detail</h3>
          {user.isMentor && raportStatus && (
            <button className="delete" onClick={() => handleDelete(record._id)}>
              <i className="fa-solid fa-trash-can"></i>
            </button>
          )}
        </div>
        <table>
          <tbody>
            {Object.entries(record).map(([keyword, value]) => {
              if (
                keyword === '_id' ||
                keyword === 'studentId' ||
                keyword === 'raportId' ||
                keyword === 'updatedAt' ||
                keyword === '__v'
              ) {
                return;
              }

              if (keyword === 'createdAt') {
                const waktu = new Date(value.split('T'));
                return (
                  <tr key={keyword}>
                    <th>Tanggal</th>
                    <td>: </td>
                    <td>
                      {new Intl.DateTimeFormat('id-ID', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                      }).format(waktu)}
                    </td>
                  </tr>
                );
              }

              if (Array.isArray(value)) {
                return (
                  <tr className="arrayItem" key={keyword + value[0]}>
                    <th>{keyword}</th>
                    <td>:</td>
                    <td>
                      {value.map((t) => (
                        <li key={t}>{t}</li>
                      ))}
                    </td>
                  </tr>
                );
              }

              return (
                <tr key={keyword + value}>
                  <th>{keyword}</th>
                  <td>: </td>
                  <td>{value}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {isLaoding && <Loader />}
    </div>
  );
};

RecordDetail.propTypes = {
  studentId: PropTypes.string,
  raportId: PropTypes.string,
  raportStatus: PropTypes.bool,
  record: PropTypes.object.isRequired,
  setScreen: PropTypes.func.isRequired,
  isDemo: PropTypes.bool,
};

export { RecordDetail };
