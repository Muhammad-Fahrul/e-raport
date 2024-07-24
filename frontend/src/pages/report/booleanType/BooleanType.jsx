import './booleanType.css';
import { useGetReportsQuery } from '../redux/reportApiSlice';
import RaportGroup from './components/raportGroup/RaportGroup';

const BooleanType = () => {
  const { data, error, isLoading } = useGetReportsQuery();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.data.message}</div>;

  const groupedByRaport = data.data.reduce((acc, item) => {
    const key = `${item.raportId}-${item.columnName}`;
    if (!acc[key]) {
      acc[key] = {
        raportId: item.raportId,
        raportName: item.raportName,
        columnName: item.columnName,
        columnAnalytics: [],
      };
    }
    acc[key].columnAnalytics.push(...item.columnAnalytics);
    return acc;
  }, {});

  return Object.entries(groupedByRaport).length ? (
    <div className="student-reports">
      {Object.entries(groupedByRaport).map(([key, raportData]) => (
        <RaportGroup key={key} raportData={raportData} />
      ))}
    </div>
  ) : (
    <h3> tidak ada data analisis</h3>
  );
};

export default BooleanType;
