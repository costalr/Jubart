import React, { useState, useEffect } from 'react';
import DashGeral from './dashboard_geral/DashGeral';
import DashImp from './dashboard_imp/DashImp';
import DashExp from './dashboard_exp/DashExp';
import './Comex.css';
import { fetchImportData, fetchExportData } from '../../../../../api/fetchApi';
import { clearIndexedDB } from '../../../../../api/clearIndexedDB';
import { setupWebSocket } from '../../../../../api/fetchApi';
import { getItem, setItem } from '../../../../../api/indexedDB';

function Comex({ selectedSection }) {
  const [importData, setImportData] = useState([]);
  const [exportData, setExportData] = useState([]);
  const [referenceMonth, setReferenceMonth] = useState(null);
  const [referenceYear, setReferenceYear] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        let cachedImportData = await getItem('import_data');
        let cachedExportData = await getItem('export_data');

        if (!Array.isArray(cachedImportData)) {
          cachedImportData = await fetchImportData();
          await setItem('import_data', cachedImportData);
        }
        if (!Array.isArray(cachedExportData)) {
          cachedExportData = await fetchExportData();
          await setItem('export_data', cachedExportData);
        }

        setImportData(cachedImportData || []);
        setExportData(cachedExportData || []);

        const getLastValidMonthYear = (data) => {
          return data
            .filter(item => item.metricKG && item.metricFOB)
            .map(item => ({
              year: parseInt(item.year),
              month: parseInt(item.monthNumber)
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
        console.error('Error loading data:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
    const ws = setupWebSocket(({ importData, exportData }) => {
      setImportData(importData);
      setExportData(exportData);
    });

    return () => ws.close();
  }, []);

  const clearCache = async () => {
    try {
      await clearIndexedDB();
      setImportData([]);
      setExportData([]);
      setReferenceMonth(null);
      setReferenceYear(null);
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  };

  const renderSection = () => {
    switch (selectedSection) {
      case 'geral':
        return <DashGeral importData={importData} exportData={exportData} error={error} referenceMonth={referenceMonth} referenceYear={referenceYear} />;
      case 'import':
        if (referenceYear && referenceMonth) {
          return <DashImp importData={importData} referenceMonth={referenceMonth} referenceYear={referenceYear} />;
        } else {
          return <div>Loading or insufficient data...</div>;
        }
      case 'export':
        if (referenceYear && referenceMonth) {
          return <DashExp exportData={exportData} referenceMonth={referenceMonth} referenceYear={referenceYear} />;
        } else {
          return <div>Loading or insufficient data...</div>;
        }
      default:
        return <div>No section selected</div>;
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading data: {error.message}</div>;

  return (
    <div className="comex-container">
      <div className="painel-secundario comex-painel">
        <button onClick={clearCache}>Limpar Cache</button>
        {renderSection()}
      </div>
    </div>
  );
}

export default Comex;
