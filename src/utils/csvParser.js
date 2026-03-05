import Papa from 'papaparse';

// Campus name patterns for detection
const campusPatterns = {
  ucb: ['UC Berkeley', 'Berkeley'],
  ucla: ['UCLA'],
  ucsd: ['UC San Diego', 'UCSD'],
  ucd: ['UC Davis', 'Davis'],
  uci: ['UC Irvine', 'Irvine'],
  ucsb: ['UC Santa Barbara', 'Santa Barbara', 'UCSB'],
  ucsc: ['UC Santa Cruz', 'Santa Cruz', 'UCSC'],
  ucr: ['UC Riverside', 'Riverside', 'UCR'],
  ucm: ['UC Merced', 'Merced'],
  ucsf: ['UCSF', 'San Francisco']
};

/**
 * Detect campus code from unit names in the data
 * @param {Array} data - Parsed CSV data
 * @returns {string|null} Detected campus code or null
 */
export const detectCampusFromData = (data) => {
  if (!data || data.length === 0) return null;

  // Look through unit names for campus indicators
  for (const row of data) {
    const unitName = row['Unit'] || row['unit'] || '';

    for (const [code, patterns] of Object.entries(campusPatterns)) {
      for (const pattern of patterns) {
        if (unitName.includes(pattern)) {
          return code;
        }
      }
    }
  }

  return null;
};

/**
 * Detect the type of CSV file based on headers
 * @param {Array} data - Parsed CSV data
 * @returns {string} File type: 'history', 'deposits', 'breakdown', or 'unknown'
 */
export const detectCsvType = (data) => {
  if (!data || data.length === 0) return 'unknown';

  const headers = Object.keys(data[0]);
  const headersLower = headers.map(h => h.toLowerCase());

  // Check for specific column names
  if (headersLower.includes('total requests') || headers.includes('Total requests')) {
    return 'history';
  }
  if (headersLower.includes('total deposits') || headers.includes('Total deposits')) {
    return 'deposits';
  }
  if (headersLower.includes('downloads') && headersLower.includes('view-only')) {
    return 'breakdown';
  }

  return 'unknown';
};

/**
 * Parse a CSV file and return structured data with type detection
 * @param {File} file - The CSV file to parse
 * @returns {Promise<Object>} Parsed data with detected type
 */
export const parseCSV = (file) => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        resolve(results.data);
      },
      error: (error) => {
        reject(error);
      }
    });
  });
};

/**
 * Parse CSV and auto-detect type and campus
 * @param {File} file - The CSV file to parse
 * @returns {Promise<Object>} Object with data, detectedType, detectedCampus, and parsed result
 */
export const parseAndDetectCSV = async (file) => {
  const rawData = await parseCSV(file);
  const detectedType = detectCsvType(rawData);
  const detectedCampus = detectCampusFromData(rawData);

  let parsedData = null;
  if (detectedType === 'history') {
    parsedData = parseHistoryData(rawData);
  } else if (detectedType === 'deposits') {
    parsedData = parseDepositsData(rawData);
  } else if (detectedType === 'breakdown') {
    parsedData = parseBreakdownData(rawData);
  }

  return {
    rawData,
    detectedType,
    detectedCampus,
    parsedData
  };
};

/**
 * Parse history_by_unit CSV data (views/downloads)
 * @param {Array} data - Parsed CSV data
 * @returns {Object} Structured history data
 */
export const parseHistoryData = (data) => {
  const units = [];
  let totalRequests = 0;
  const monthlyData = {};

  // Get column headers (months)
  const months = [];

  data.forEach((row, index) => {
    const unit = row['Unit'] || row['unit'];
    const drillDown = row['Drill down'] || row['drill_down'] || '';
    const total = parseInt((row['Total requests'] || row['total_requests'] || '0').replace(/,/g, ''), 10) || 0;

    // Skip the "Overall" row for unit list but use it for total
    if (unit === 'Overall' || unit === 'overall') {
      totalRequests = total;

      // Extract monthly data from the Overall row
      Object.keys(row).forEach(key => {
        if (key.match(/^\d{4}-\d{2}$/)) {
          const value = parseInt((row[key] || '0').replace(/,/g, ''), 10) || 0;
          monthlyData[key] = value;
          months.push(key);
        }
      });
      return;
    }

    // Skip empty units or those with no data
    if (!unit || total === 0) return;

    // Parse monthly data for this unit
    const unitMonthlyData = {};
    Object.keys(row).forEach(key => {
      if (key.match(/^\d{4}-\d{2}$/)) {
        const value = parseInt((row[key] || '0').replace(/,/g, ''), 10) || 0;
        unitMonthlyData[key] = value;
      }
    });

    units.push({
      name: unit,
      drillDown: drillDown,
      totalRequests: total,
      monthlyData: unitMonthlyData
    });
  });

  // Sort units by total requests (descending)
  units.sort((a, b) => b.totalRequests - a.totalRequests);

  return {
    totalRequests,
    units,
    monthlyData,
    months: months.sort().reverse() // Most recent first
  };
};

/**
 * Parse deposits_by_unit CSV data
 * @param {Array} data - Parsed CSV data
 * @returns {Object} Structured deposits data
 */
export const parseDepositsData = (data) => {
  const units = [];
  let totalDeposits = 0;
  const monthlyData = {};

  data.forEach((row) => {
    const unit = row['Unit'] || row['unit'];
    const drillDown = row['Drill down'] || row['drill_down'] || '';
    const total = parseInt((row['Total deposits'] || row['total_deposits'] || '0').replace(/,/g, ''), 10) || 0;

    // Skip the "Overall" row for unit list but use it for total
    if (unit === 'Overall' || unit === 'overall') {
      totalDeposits = total;

      // Extract monthly data
      Object.keys(row).forEach(key => {
        if (key.match(/^\d{4}-\d{2}$/)) {
          const value = parseInt((row[key] || '0').replace(/,/g, ''), 10) || 0;
          monthlyData[key] = value;
        }
      });
      return;
    }

    // Skip empty units
    if (!unit || total === 0) return;

    // Parse monthly data for this unit
    const unitMonthlyData = {};
    Object.keys(row).forEach(key => {
      if (key.match(/^\d{4}-\d{2}$/)) {
        const value = parseInt((row[key] || '0').replace(/,/g, ''), 10) || 0;
        unitMonthlyData[key] = value;
      }
    });

    units.push({
      name: unit,
      drillDown: drillDown,
      totalDeposits: total,
      monthlyData: unitMonthlyData
    });
  });

  // Sort units by total deposits (descending)
  units.sort((a, b) => b.totalDeposits - a.totalDeposits);

  return {
    totalDeposits,
    units,
    monthlyData
  };
};

/**
 * Parse breakdown_by_unit CSV data (downloads vs view-only)
 * @param {Array} data - Parsed CSV data
 * @returns {Object} Structured breakdown data
 */
export const parseBreakdownData = (data) => {
  const units = [];

  data.forEach((row) => {
    const unit = row['Unit'] || row['unit'];
    if (!unit || unit === 'Overall' || unit === 'overall') return;

    const downloads = parseInt((row['Downloads'] || row['downloads'] || '0').replace(/,/g, ''), 10) || 0;
    const viewOnly = parseInt((row['View-only'] || row['view-only'] || '0').replace(/,/g, ''), 10) || 0;
    const total = downloads + viewOnly;

    units.push({
      name: unit,
      downloads,
      viewOnly,
      totalRequests: total,
      downloadPercent: total > 0 ? ((downloads / total) * 100).toFixed(1) : '0.0'
    });
  });

  return { units };
};

/**
 * Merge history and deposits data by unit
 * @param {Object} historyData - Parsed history data
 * @param {Object} depositsData - Parsed deposits data
 * @returns {Array} Merged unit data
 */
export const mergeUnitData = (historyData, depositsData) => {
  const depositsByUnit = {};

  // Create lookup for deposits
  depositsData.units.forEach(unit => {
    depositsByUnit[unit.name] = unit.totalDeposits;
  });

  // Merge with history data
  return historyData.units.map(unit => ({
    name: unit.name,
    drillDown: unit.drillDown,
    totalRequests: unit.totalRequests,
    totalDeposits: depositsByUnit[unit.name] || 0,
    monthlyRequests: unit.monthlyData
  }));
};

/**
 * Get top N units by requests
 * @param {Array} units - Array of unit objects
 * @param {number} n - Number of top units to return
 * @returns {Array} Top N units
 */
export const getTopUnits = (units, n = 10) => {
  return units.slice(0, n);
};

/**
 * Calculate aggregate statistics
 * @param {Object} historyData - Parsed history data
 * @param {Object} depositsData - Parsed deposits data
 * @returns {Object} Aggregate statistics
 */
export const calculateStats = (historyData, depositsData) => {
  return {
    totalRequests: historyData?.totalRequests || 0,
    totalDeposits: depositsData?.totalDeposits || 0,
    unitCount: historyData?.units?.length || 0,
    topUnit: historyData?.units?.[0]?.name || 'N/A'
  };
};
