import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import './Comex.css';
import { fetchImportData, fetchExportData } from '../../../../../api/fetchApi';
import { clearIndexedDB } from '../../../../../api/clearIndexedDB';
import { getRawItem, setRawItem } from '../../../../../api/indexedDBRaw';

function Comex() {
  const [importData, setImportData] = useState(null);
  const [exportData, setExportData] = useState(null);
  const [referenceMonth, setReferenceMonth] = useState(null);
  const [referenceYear, setReferenceYear] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        let cachedImportData = await getRawItem('import_data');
        let cachedExportData = await getRawItem('export_data');

        if (!cachedImportData) {
          const fetchedImportData = await fetchImportData();
          cachedImportData = fetchedImportData;
          await setRawItem('import_data', cachedImportData);
        }

        if (!cachedExportData) {
          const fetchedExportData = await fetchExportData();
          cachedExportData = fetchedExportData;
          await setRawItem('export_data', cachedExportData);
        }

        setImportData(cachedImportData);
        setExportData(cachedExportData);

        const getLastValidMonthYear = (data) => {
          if (!data) return { year: 0, month: 0 };

          return Object.values(data)
            .flat()
            .filter(item => item.total_kg && item.total_usd)
            .map(item => ({
              year: parseInt(item.ano),
              month: parseInt(item.mes)
            }))
            .reduce((max, current) => current.year > max.year || (current.year === max.year && current.month > max.month) ? current : max, { year: 0, month: 0 });
        };

        const lastImportMonthYear = getLastValidMonthYear(cachedImportData);
        const lastExportMonthYear = getLastValidMonthYear(cachedExportData);

        const lastYearAvailable = Math.max(lastImportMonthYear.year, lastExportMonthYear.year);
        const lastMonthAvailable = Math.max(
          lastImportMonthYear.year === lastYearAvailable ? lastImportMonthYear.month : 0,
          lastExportMonthYear.year === lastYearAvailable ? lastExportMonthYear.month : 0
        );

        setReferenceMonth(lastMonthAvailable);
        setReferenceYear(lastYearAvailable);


      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const clearCache = async () => {
    try {
      await clearIndexedDB();
      setImportData(null);
      setExportData(null);
      setReferenceMonth(null);
      setReferenceYear(null);
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading data: {error.message}</div>;

  return (
    <div className="comex-container">
      <div className="painel-secundario comex-painel">
        <button onClick={clearCache}>Limpar Cache</button>
        <Outlet context={{ importData, exportData, referenceMonth, referenceYear }} />
      </div>
    </div>
  );
}

export default Comex;
