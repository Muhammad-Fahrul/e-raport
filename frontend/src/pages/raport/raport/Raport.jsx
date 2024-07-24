import './raport.css';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  useDeleteRaportByIdMutation,
  useGetRaportByIdQuery,
  useUpdateRaportByIdMutation,
} from '../redux/raportApiSlice.js';
import Loader from '../../../components/loader/Loader.jsx';
import ColumnSchema from './components/columnSchema/ColumnSchema.jsx';
import TablePreview from './components/tablePreview/TablePreview.jsx';
import Modal from './components/modal/Modal.jsx';
import { RecordDetail } from '../../../components/recordTable/recordDetail/RecordDetail.jsx';

const Raport = () => {
  const [screen, setScreen] = useState(false);
  const [detailRecord, setDetailRecord] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  const navigate = useNavigate();

  const { raportId } = useParams();

  const { data, isLoading, isSuccess, isError, error } =
    useGetRaportByIdQuery(raportId);

  const [
    updateRaportForm,
    { isLoading: iLUpdate, isError: iEUpdate, error: eUpdate },
  ] = useUpdateRaportByIdMutation();

  const [deleteRaport, { isLoading: iLDR, isSuccess: iSDR }] =
    useDeleteRaportByIdMutation();

  const showModal = useCallback((message, type) => {
    setModalContent({ message, type });
    setIsModalVisible(true);
    setTimeout(() => {
      setIsModalVisible(false);
      setModalContent(null);
    }, 2000);
  }, []);

  useEffect(() => {
    if (iSDR) {
      navigate('/');
    }
  }, [navigate, iSDR]);

  useEffect(() => {
    if (iEUpdate) {
      const errorMessage = iEUpdate;
      showModal(errorMessage || 'An error occurred!', 'error');
    }
  }, [iEUpdate, showModal, eUpdate]);

  const handleDetail = (columns) => {
    const raport = columns.reduce((acc, c) => {
      switch (c.columnType) {
        case 'number':
          acc[c.columnName] = 1;
          break;
        case 'string':
          acc[c.columnName] = 'text';
          break;
        case 'boolean':
          acc[c.columnName] = c.trueValue;
          break;
        case 'array':
          acc[c.columnName] = c.arrayValues;
          break;
        default:
          break;
      }
      return acc;
    }, {});
    setDetailRecord(raport);
    setScreen(true);
  };

  const onUpdateRaportForm = async (e) => {
    e.preventDefault();
    const result = await updateRaportForm(raportId);
    if (result.data) {
      showModal(result.data.message, 'success');
    }
  };

  const onDeleteRaport = async (e) => {
    e.preventDefault();
    if (confirm('Apakah Anda yakin ingin menghapus buku ini?')) {
      await deleteRaport(raportId);
    }
  };

  let content;

  let loadingElement;

  if (iLUpdate || iLDR) {
    loadingElement = <Loader />;
  }

  if (isLoading) {
    return <Loader />;
  } else if (isSuccess) {
    const { columns, valid } = data;

    const buttonValidate = (
      <button
        disabled={valid}
        className="validate-btn"
        onClick={onUpdateRaportForm}
      >
        {valid ? 'Validated' : 'Validate Raport'}
      </button>
    );

    const buttonDelete = (
      <button className="delete-btn" onClick={onDeleteRaport}>
        Delete Raport
      </button>
    );

    const detailModal = screen && (
      <RecordDetail record={detailRecord} setScreen={setScreen} isDemo={true} />
    );

    const errorElement = isModalVisible && (
      <Modal type={modalContent?.type} message={modalContent?.message} />
    );

    content = (
      <div className="container-raport">
        {detailModal}
        {loadingElement}
        {errorElement}
        <ColumnSchema
          columns={columns}
          valid={valid}
          showModal={showModal}
          raportId={raportId}
        />
        <div className="raport-btns">
          {buttonValidate}
          {buttonDelete}
        </div>
        <TablePreview columns={columns} handleDetail={handleDetail} />
      </div>
    );
  } else if (isError) {
    return <p>{error?.data?.message}</p>;
  }

  return content;
};

export default Raport;
