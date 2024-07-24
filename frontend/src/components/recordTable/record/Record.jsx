import { memo } from 'react';

import PropTypes from 'prop-types';

const Record = ({ record, handleDetail }) => {
  const generateTbody = () => {
    return Object.entries(record)
      .map(([keyword, value]) => {
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
          return {
            value: new Intl.DateTimeFormat('id-ID', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
            }).format(waktu),
            keyword,
          };
        }

        return { value, keyword };
      })
      .filter((key) => key !== undefined);
  };

  return (
    <>
      <td>
        <button
          className="detail-raport-preview-btn"
          onClick={(e) => {
            e.preventDefault;
            handleDetail(record._id);
          }}
        >
          <i className="fa-solid fa-circle-info"></i>
        </button>
      </td>
      {generateTbody().map((item, i) => {
        const { keyword, value } = item;
        return (
          <td key={keyword + value + i}>
            {Array.isArray(value) ? (
              <select disabled>
                <option value={value[0]}>{value[0]}</option>
              </select>
            ) : (
              value
            )}
          </td>
        );
      })}
    </>
  );
};

Record.propTypes = {
  record: PropTypes.object.isRequired,
  handleDetail: PropTypes.func.isRequired,
};

const areEqual = (prevProp, nextProp) => {
  return prevProp.record._id === nextProp.record._id;
};

const memoizedRaport = memo(Record, areEqual);

export { memoizedRaport as Record };
