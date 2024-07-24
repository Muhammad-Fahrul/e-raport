import './recordTable.css';

import { memo, useCallback, useState } from 'react';

import { Record } from './record/Record';
import { RecordDetail } from './recordDetail/RecordDetail';

import PropTypes from 'prop-types';

const RecordTable = ({ raportStatus, records }) => {
  const [detailRecord, setDetailRecord] = useState({});
  const [screen, setScreen] = useState(false);

  const studentId = records[0].studentId;
  const raportId = records[0].raportId;

  const handleDetail = useCallback(
    (id) => {
      const detailRecord = records.find((record) => record._id === id);

      setDetailRecord(detailRecord);
      setScreen(true);
    },
    [records]
  );

  const generateThead = (raports) => {
    return Object.entries(raports[0])
      .map(([keyword]) => {
        if (
          keyword !== '_id' &&
          keyword !== 'studentId' &&
          keyword !== 'raportId' &&
          keyword !== 'updatedAt' &&
          keyword !== '__v'
        ) {
          if (keyword === 'createdAt') {
            return 'Tanggal';
          }
          return keyword;
        }
      })
      .filter((key) => key !== undefined);
  };

  let initialElemen;

  let raportThead = (
    <>
      <th>info</th>
      {generateThead(records).map((item) => {
        if (item.length > 5) {
          return <th key={item}>{`${item.slice(0, 5)}...`}</th>;
        }
        return <th key={item}>{item}</th>;
      })}
    </>
  );

  let raportsBody = records.map((record) => (
    <tr key={record._id}>
      <Record record={record} handleDetail={handleDetail} />
    </tr>
  ));

  return (
    <div>
      <div className="container-table-raport">
        <table className="table-raport">
          <thead>
            <tr>{raportThead}</tr>
          </thead>
          <tbody>{raportsBody}</tbody>
        </table>
      </div>
      {initialElemen}

      {screen && (
        <RecordDetail
          studentId={studentId}
          raportId={raportId}
          raportStatus={raportStatus}
          record={detailRecord}
          setScreen={setScreen}
        />
      )}
    </div>
  );
};

RecordTable.propTypes = {
  raportStatus: PropTypes.bool.isRequired,
  records: PropTypes.array.isRequired,
};

const areEqual = (prevProp, nextProp) => {
  return (
    prevProp.raportStatus === nextProp.raportStatus &&
    prevProp.records.length === nextProp.records.length
  );
};

const memoizedRecordTable = memo(RecordTable, areEqual);

export { memoizedRecordTable as RecordTable };
