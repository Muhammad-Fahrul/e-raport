import './newRaportRelation.css';

import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Loader from '../../../../../components/loader/Loader';
import {
  useAddRaportRelationMutation,
  useGetRaportsByMentorIdQuery,
} from '../../../../raport/redux/raportApiSlice';

const NewRaportRelation = ({ userDisplayed, setScreen }) => {
  const [raportId, setRaporId] = useState('');

  const { data, isSuccess: iSRF } = useGetRaportsByMentorIdQuery();

  const [addRelation, { isSuccess, isLoading, isError, error }] =
    useAddRaportRelationMutation();

  const handleAddRaportRelation = async (e) => {
    e.preventDefault();
    try {
      const res = await addRelation({
        username: userDisplayed.username,
        raportId,
      }).unwrap();
      setScreen(false);
      alert(`${res.message}`);
    } catch (err) {
      alert(`${raportId} gagal ditambahkan`);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      setScreen(false);
    }
  }, [isSuccess, setScreen]);

  let selectOpt;
  if (iSRF) {
    const { raports } = data;

    const idsInA = new Set(
      userDisplayed.raportIdsStudent.map((r) => r.raportId)
    );

    const newListRaport = raports.filter((r) => !idsInA.has(r._id) && r.valid);

    selectOpt = newListRaport.length ? (
      <select
        name="inputType"
        required
        onChange={(e) => {
          e.preventDefault();
          setRaporId(e.target.value);
        }}
      >
        <option value="">--Pilih buku raport--</option>
        {newListRaport.map((raport) => (
          <option key={raport._id} value={raport._id}>
            {raport.name}
          </option>
        ))}
      </select>
    ) : (
      <select disabled>
        <option>Buku belum divalidasi</option>
      </select>
    );
  }

  return (
    <>
      {Loader && isLoading}
      <form onSubmit={(e) => handleAddRaportRelation(e)} className="wrapper">
        <div className="title" style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '1em' }}>new raport</h1>
          <p
            style={{
              opacity: isError ? 1 : 0,
              color: 'red',
              fontSize: '0.6rem',
              width: '200px',
            }}
          >
            {error?.data?.message}
          </p>
        </div>

        <div className="inputBox">{selectOpt}</div>

        <button className="enter">Add</button>
      </form>
    </>
  );
};

NewRaportRelation.propTypes = {
  userDisplayed: PropTypes.object.isRequired,
  setScreen: PropTypes.func.isRequired,
};

export { NewRaportRelation };
