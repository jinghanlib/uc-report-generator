import React, { useState, useRef, useEffect } from 'react';
import { parseAndDetectCSV } from '../utils/csvParser';
import { getStatsUrls, getDataSourceDescriptions } from '../utils/dataFetcher';

const DataUploader = ({ campusCode, onDataLoaded, manualStats, onManualStatsChange }) => {
  const [historyFile, setHistoryFile] = useState(null);
  const [depositsFile, setDepositsFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dataMode, setDataMode] = useState('download'); // 'download', 'csv', 'manual'
  const [dragActive, setDragActive] = useState({ history: false, deposits: false });
  const [showDataSources, setShowDataSources] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [downloadStep, setDownloadStep] = useState(0);
  const [detectionMessage, setDetectionMessage] = useState(null);

  const historyInputRef = useRef(null);
  const depositsInputRef = useRef(null);

  const urls = getStatsUrls(campusCode);
  const dataSources = getDataSourceDescriptions();

  // Clear uploaded files when campus changes
  useEffect(() => {
    setHistoryFile(null);
    setDepositsFile(null);
    setError(null);
    setDetectionMessage(null);
    setDownloadStep(0);
  }, [campusCode]);

  // Open download modal
  const handleStartDownload = () => {
    setShowDownloadModal(true);
    setDownloadStep(0);
  };

  // Open history CSV in new window
  const openHistoryDownload = () => {
    window.open(urls.historyByUnit, '_blank');
    setDownloadStep(1);
  };

  // Open deposits CSV in new window
  const openDepositsDownload = () => {
    window.open(urls.depositsByUnit, '_blank');
    setDownloadStep(2);
  };

  // User confirms downloads are complete
  const confirmDownloadsComplete = () => {
    setDownloadStep(3);
    setShowDownloadModal(false);
    setDataMode('csv');
  };

  const handleDrag = (e, field, active) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(prev => ({ ...prev, [field]: active }));
  };

  const handleDrop = async (e, field) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(prev => ({ ...prev, [field]: false }));

    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith('.csv')) {
      await processFileWithDetection(file, field);
    } else {
      setError('Please upload a CSV file');
    }
  };

  const handleFileSelect = async (e, field) => {
    const file = e.target.files[0];
    if (file) {
      await processFileWithDetection(file, field);
    }
  };

  // Campus name mapping for validation messages
  const campusNames = {
    ucb: 'UC Berkeley',
    ucla: 'UCLA',
    ucsd: 'UC San Diego',
    ucd: 'UC Davis',
    uci: 'UC Irvine',
    ucsb: 'UC Santa Barbara',
    ucsc: 'UC Santa Cruz',
    ucr: 'UC Riverside',
    ucm: 'UC Merced',
    ucsf: 'UCSF'
  };

  // Process file with auto-detection
  const processFileWithDetection = async (file, expectedField) => {
    setLoading(true);
    setError(null);
    setDetectionMessage(null);

    try {
      const { detectedType, detectedCampus, parsedData } = await parseAndDetectCSV(file);

      // Check if the detected type matches expected
      if (detectedType === 'unknown') {
        setError(`Could not recognize CSV format. Make sure you're uploading a file from eScholarship stats.`);
        setLoading(false);
        return;
      }

      // Check if the detected campus matches the selected campus
      if (detectedCampus && detectedCampus !== campusCode) {
        setError(`Campus mismatch: This CSV appears to contain data for ${campusNames[detectedCampus] || detectedCampus}, but you have ${campusNames[campusCode] || campusCode} selected. Please select the correct campus or upload the correct CSV file.`);
        setLoading(false);
        return;
      }

      // Auto-detect and route to correct slot
      if (detectedType === 'history') {
        setHistoryFile(file.name);
        onDataLoaded(prev => ({ ...prev, historyData: parsedData }));
        if (expectedField !== 'history') {
          setDetectionMessage(`Detected as History data (views/downloads) - loaded correctly!`);
        }
      } else if (detectedType === 'deposits') {
        setDepositsFile(file.name);
        onDataLoaded(prev => ({ ...prev, depositsData: parsedData }));
        if (expectedField !== 'deposits') {
          setDetectionMessage(`Detected as Deposits data - loaded correctly!`);
        }
      } else if (detectedType === 'breakdown') {
        // Store breakdown data for table display
        onDataLoaded(prev => ({ ...prev, breakdownData: parsedData }));
        setDetectionMessage(`Detected as Breakdown data (downloads/view-only) - loaded for table display!`);
      }
    } catch (err) {
      setError(`Error parsing file: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleManualChange = (field, value) => {
    const numValue = parseInt(value.replace(/,/g, ''), 10) || 0;
    onManualStatsChange(prev => ({ ...prev, [field]: numValue }));
  };

  const formatNumber = (num) => {
    return num ? num.toLocaleString() : '';
  };

  return (
    <div className="card">
      <h3 className="section-title">2. Upload Data</h3>

      {/* Data source info display */}
      <div className="bg-gray-100 border border-gray-300 rounded p-3 mb-4 text-sm">
        <p className="font-medium text-gray-700 mb-1">Data source:</p>
        <code className="text-xs text-blue-700 break-all">
          escholarship.org/uc/{campusCode}/stats/...
        </code>
        <button
          onClick={() => setShowDataSources(!showDataSources)}
          className="text-blue-600 hover:underline text-xs ml-2"
        >
          {showDataSources ? 'Hide details' : 'Show chart data sources'}
        </button>

        {showDataSources && (
          <div className="mt-3 pt-3 border-t border-gray-300">
            <p className="font-medium text-gray-700 mb-2">Chart Data Sources:</p>
            <ul className="text-xs text-gray-600 space-y-2">
              {Object.entries(dataSources).map(([key, source]) => (
                <li key={key}>
                  <span className="font-medium">{source.name}</span>
                  <ul className="ml-4 mt-1 list-disc">
                    {source.chartsGenerated.map((chart, i) => (
                      <li key={i}>{chart}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Mode toggle */}
      <div className="mb-4">
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setDataMode('download')}
            className={`px-3 py-1 rounded text-sm ${dataMode === 'download' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Download Data
          </button>
          <button
            onClick={() => setDataMode('csv')}
            className={`px-3 py-1 rounded text-sm ${dataMode === 'csv' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            CSV Upload
          </button>
          <button
            onClick={() => setDataMode('manual')}
            className={`px-3 py-1 rounded text-sm ${dataMode === 'manual' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Manual Entry
          </button>
        </div>
      </div>

      {/* Download Data Mode */}
      {dataMode === 'download' && (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded p-4">
            <p className="text-blue-800 text-sm mb-3">
              Click the button below to download the latest data from eScholarship.
              This will open the stats pages where you can export CSV files.
            </p>

            <button
              onClick={handleStartDownload}
              className="w-full py-3 px-4 rounded font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors"
            >
              Download Data from eScholarship
            </button>

            {/* Status indicator */}
            {(historyFile || depositsFile) && (
              <div className="mt-3 p-3 bg-green-100 border border-green-300 rounded text-green-800 text-sm">
                <p className="font-medium mb-1">Files loaded:</p>
                {historyFile && <p>History: {historyFile}</p>}
                {depositsFile && <p>Deposits: {depositsFile}</p>}
              </div>
            )}
          </div>

          {/* Direct links */}
          <div className="text-sm text-gray-600">
            <p className="mb-2">Or open stats pages directly:</p>
            <div className="space-y-1">
              <a
                href={urls.historyByUnit}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline block text-xs"
              >
                History by Unit (views/downloads)
              </a>
              <a
                href={urls.depositsByUnit}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline block text-xs"
              >
                Deposits by Unit
              </a>
              <a
                href={urls.breakdownByUnit}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline block text-xs"
              >
                Breakdown by Unit (downloads/view-only)
              </a>
            </div>
          </div>
        </div>
      )}

      {/* CSV Upload Mode */}
      {dataMode === 'csv' && (
        <div className="space-y-4">
          {/* Auto-detection notice */}
          <div className="bg-green-50 border border-green-200 rounded p-3 text-sm">
            <p className="text-green-800">
              <strong>Auto-detection enabled:</strong> Drop any eScholarship CSV file and it will be automatically recognized and loaded into the correct slot.
            </p>
          </div>

          {/* Detection message */}
          {detectionMessage && (
            <div className="bg-blue-50 border border-blue-200 rounded p-3 text-sm text-blue-800">
              {detectionMessage}
            </div>
          )}

          {/* History file upload */}
          <div>
            <label className="form-label">
              History by Unit CSV (views/downloads)
              <span className="text-xs text-gray-500 ml-2">(Required for charts)</span>
            </label>
            <div
              className={`drop-zone ${dragActive.history ? 'active' : ''}`}
              onDragEnter={(e) => handleDrag(e, 'history', true)}
              onDragLeave={(e) => handleDrag(e, 'history', false)}
              onDragOver={(e) => handleDrag(e, 'history', true)}
              onDrop={(e) => handleDrop(e, 'history')}
              onClick={() => historyInputRef.current?.click()}
            >
              <input
                ref={historyInputRef}
                type="file"
                accept=".csv"
                onChange={(e) => handleFileSelect(e, 'history')}
                className="hidden"
              />
              {historyFile ? (
                <div className="text-green-600">
                  <span className="text-xl">&#10003;</span> {historyFile}
                </div>
              ) : (
                <div className="text-gray-500">
                  <p className="text-2xl mb-1">&#128196;</p>
                  <p>Drop any CSV here - auto-detected</p>
                </div>
              )}
            </div>
          </div>

          {/* Deposits file upload */}
          <div>
            <label className="form-label">
              Deposits by Unit CSV
              <span className="text-xs text-gray-500 ml-2">(Optional, for deposit stats)</span>
            </label>
            <div
              className={`drop-zone ${dragActive.deposits ? 'active' : ''}`}
              onDragEnter={(e) => handleDrag(e, 'deposits', true)}
              onDragLeave={(e) => handleDrag(e, 'deposits', false)}
              onDragOver={(e) => handleDrag(e, 'deposits', true)}
              onDrop={(e) => handleDrop(e, 'deposits')}
              onClick={() => depositsInputRef.current?.click()}
            >
              <input
                ref={depositsInputRef}
                type="file"
                accept=".csv"
                onChange={(e) => handleFileSelect(e, 'deposits')}
                className="hidden"
              />
              {depositsFile ? (
                <div className="text-green-600">
                  <span className="text-xl">&#10003;</span> {depositsFile}
                </div>
              ) : (
                <div className="text-gray-500">
                  <p className="text-2xl mb-1">&#128196;</p>
                  <p>Drop any CSV here - auto-detected</p>
                </div>
              )}
            </div>
          </div>

          {loading && (
            <p className="text-blue-600 text-sm">Processing file...</p>
          )}

          {error && (
            <p className="text-red-600 text-sm">{error}</p>
          )}
        </div>
      )}

      {/* Manual Entry Mode */}
      {dataMode === 'manual' && (
        <div className="space-y-3">
          <p className="text-sm text-gray-600 mb-3">
            Enter summary statistics manually if you don't have CSV files.
            Note: Charts won't be generated without CSV data.
          </p>

          <div>
            <label htmlFor="totalDeposits" className="form-label">Total Deposits</label>
            <input
              type="text"
              id="totalDeposits"
              value={formatNumber(manualStats.totalDeposits)}
              onChange={(e) => handleManualChange('totalDeposits', e.target.value)}
              placeholder="e.g., 23,394"
              className="form-input"
            />
          </div>

          <div>
            <label htmlFor="totalRequests" className="form-label">Total Requests (Views + Downloads)</label>
            <input
              type="text"
              id="totalRequests"
              value={formatNumber(manualStats.totalRequests)}
              onChange={(e) => handleManualChange('totalRequests', e.target.value)}
              placeholder="e.g., 14,705,487"
              className="form-input"
            />
          </div>

          <div>
            <label htmlFor="unitCount" className="form-label">Number of Units</label>
            <input
              type="text"
              id="unitCount"
              value={formatNumber(manualStats.unitCount)}
              onChange={(e) => handleManualChange('unitCount', e.target.value)}
              placeholder="e.g., 35"
              className="form-input"
            />
          </div>
        </div>
      )}

      {/* Chart generation info */}
      <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded text-xs text-gray-600">
        <p className="font-medium mb-1">Charts generated from your data:</p>
        <ul className="list-disc list-inside space-y-0.5">
          <li><strong>Top 10 Units by Deposits</strong> - Horizontal bar chart from deposits_by_unit.csv</li>
          <li><strong>Top 10 Units by Total Requests</strong> - Horizontal bar chart from history_by_unit.csv</li>
          <li><strong>Request Distribution by Unit</strong> - Donut chart showing percentage breakdown</li>
          <li><strong>Monthly Request Trends</strong> - Line chart over the past 24 months</li>
          <li><strong>Deposits vs Engagement by Unit</strong> - Grouped bar chart comparison</li>
          <li><strong>Downloads vs View-only by Unit</strong> - Stacked bar chart from breakdown_by_unit.csv</li>
        </ul>
      </div>

      {/* Tableau preview warning */}
      <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
        <p><strong>Note:</strong> The Tableau dashboard embed will not display in the preview, but it will work correctly when you export and download the HTML file.</p>
      </div>

      {/* Download Modal */}
      {showDownloadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Download eScholarship Data</h3>

            <p className="text-sm text-gray-600 mb-4">
              Follow these steps to download the CSV data files:
            </p>

            <div className="space-y-4">
              {/* Step 1: History */}
              <div className={`p-3 rounded border ${downloadStep >= 1 ? 'bg-green-50 border-green-300' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-800">Step 1: History by Unit</p>
                    <p className="text-xs text-gray-600">Views and downloads data</p>
                  </div>
                  <button
                    onClick={openHistoryDownload}
                    className={`px-3 py-1 rounded text-sm ${downloadStep >= 1 ? 'bg-green-600 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                  >
                    {downloadStep >= 1 ? 'Opened' : 'Open Page'}
                  </button>
                </div>
                {downloadStep >= 1 && (
                  <p className="text-xs text-green-700 mt-2">
                    Click "Export" button on the page, then save the CSV file.
                  </p>
                )}
              </div>

              {/* Step 2: Deposits */}
              <div className={`p-3 rounded border ${downloadStep >= 2 ? 'bg-green-50 border-green-300' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-800">Step 2: Deposits by Unit</p>
                    <p className="text-xs text-gray-600">Deposit counts data</p>
                  </div>
                  <button
                    onClick={openDepositsDownload}
                    disabled={downloadStep < 1}
                    className={`px-3 py-1 rounded text-sm ${
                      downloadStep >= 2
                        ? 'bg-green-600 text-white'
                        : downloadStep >= 1
                          ? 'bg-blue-600 hover:bg-blue-700 text-white'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {downloadStep >= 2 ? 'Opened' : 'Open Page'}
                  </button>
                </div>
                {downloadStep >= 2 && (
                  <p className="text-xs text-green-700 mt-2">
                    Click "Export" button on the page, then save the CSV file.
                  </p>
                )}
              </div>

              {/* Step 3: Confirm */}
              <div className={`p-3 rounded border ${downloadStep >= 2 ? 'bg-blue-50 border-blue-300' : 'bg-gray-50 border-gray-200'}`}>
                <p className="font-medium text-gray-800 mb-2">Step 3: Upload Files</p>
                <p className="text-xs text-gray-600 mb-3">
                  After downloading both CSV files, click the button below to upload them.
                </p>
                <button
                  onClick={confirmDownloadsComplete}
                  disabled={downloadStep < 2}
                  className={`w-full py-2 rounded text-sm font-medium ${
                    downloadStep >= 2
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  I've Downloaded the Files - Upload Now
                </button>
              </div>
            </div>

            {/* Close button */}
            <button
              onClick={() => setShowDownloadModal(false)}
              className="mt-4 w-full py-2 border border-gray-300 rounded text-gray-600 hover:bg-gray-50 text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataUploader;
