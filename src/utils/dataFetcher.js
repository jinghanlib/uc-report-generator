/**
 * Data Fetcher Utility
 *
 * Provides URLs and instructions for downloading eScholarship stats data.
 *
 * URL Pattern (same for all UC campuses):
 * - History by Unit:   https://escholarship.org/uc/{campusCode}/stats/history_by_unit?range=all
 * - Deposits by Unit:  https://escholarship.org/uc/{campusCode}/stats/deposits_by_unit?range=all
 * - Breakdown by Unit: https://escholarship.org/uc/{campusCode}/stats/breakdown_by_unit?range=all
 */

/**
 * Get the stats URLs for a campus
 * @param {string} campusCode - Campus code (e.g., 'ucr', 'ucla')
 * @returns {Object} URLs for different stats endpoints
 */
export const getStatsUrls = (campusCode) => ({
  // Stats page URLs (for viewing and downloading)
  historyByUnit: `https://escholarship.org/uc/${campusCode}/stats/history_by_unit?range=all`,
  depositsByUnit: `https://escholarship.org/uc/${campusCode}/stats/deposits_by_unit?range=all`,
  breakdownByUnit: `https://escholarship.org/uc/${campusCode}/stats/breakdown_by_unit?range=all`,
  // Campus main page
  campusMain: `https://escholarship.org/uc/${campusCode}`,
  // Journals page (note: no /uc/ prefix)
  journals: `https://escholarship.org/${campusCode}/journals`
});

/**
 * Get human-readable data source descriptions for charts
 * @returns {Object} Descriptions of what each data source provides
 */
export const getDataSourceDescriptions = () => ({
  historyByUnit: {
    name: 'History by Unit CSV',
    description: 'Contains views and downloads data over time for each research unit.',
    chartsGenerated: [
      'Top 10 Units by Total Requests (horizontal bar chart)',
      'Request Distribution by Unit (donut chart)',
      'Total Requests count in snapshot'
    ]
  },
  depositsByUnit: {
    name: 'Deposits by Unit CSV',
    description: 'Contains deposit counts over time for each research unit.',
    chartsGenerated: [
      'Top 10 Units by Deposits (horizontal bar chart)',
      'Deposits vs Engagement by Unit (grouped bar chart)',
      'Total Deposits count in snapshot'
    ]
  },
  breakdownByUnit: {
    name: 'Breakdown by Unit CSV',
    description: 'Contains detailed breakdown of downloads vs view-only requests.',
    chartsGenerated: [
      'Downloads vs View-only by Unit (stacked bar chart)',
      'Download percentage in data table'
    ]
  }
});

/**
 * Get instructions for downloading CSV files
 * @param {string} campusCode - Campus code
 * @returns {Object} Instructions and URLs
 */
export const getManualDownloadInstructions = (campusCode) => {
  const urls = getStatsUrls(campusCode);

  return {
    title: 'Download CSV Data',
    description: 'Download the CSV files from eScholarship:',
    steps: [
      'Click the link to open the stats page',
      'Wait for the page to load completely',
      'Click the "Export" or "Download CSV" button on the page',
      'Save the CSV file to your computer',
      'Upload the file using the upload area'
    ],
    files: [
      {
        name: 'History by Unit',
        description: 'For views, downloads, and trends data',
        url: urls.historyByUnit
      },
      {
        name: 'Deposits by Unit',
        description: 'For deposit counts and comparison charts',
        url: urls.depositsByUnit
      },
      {
        name: 'Breakdown by Unit',
        description: 'For download/view-only percentages (optional)',
        url: urls.breakdownByUnit
      }
    ]
  };
};

export default {
  getStatsUrls,
  getDataSourceDescriptions,
  getManualDownloadInstructions
};
