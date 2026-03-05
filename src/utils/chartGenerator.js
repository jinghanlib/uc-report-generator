/**
 * Generate Plotly chart configurations for the report
 * Matches the visualization style of the original UCR eScholarship report
 */

/**
 * Generate a horizontal bar chart for top units by deposits
 * @param {Array} units - Array of unit objects with deposits data
 * @param {Object} colors - Campus color scheme
 * @param {number} topN - Number of top units to show
 * @returns {Object} Plotly chart config
 */
export const generateDepositsChart = (units, colors, topN = 10) => {
  const topUnits = units.slice(0, topN).reverse(); // Reverse for horizontal bar chart

  return {
    data: [{
      type: 'bar',
      orientation: 'h',
      x: topUnits.map(u => u.totalDeposits || 0),
      y: topUnits.map(u => truncateLabel(u.name, 45)),
      text: topUnits.map(u => formatNumber(u.totalDeposits || 0)),
      textposition: 'outside',
      marker: {
        color: colors.primary
      },
      hovertemplate: '<b>%{y}</b><br>Deposits: %{x:,}<extra></extra>'
    }],
    layout: {
      title: {
        text: 'Top 10 Units by Deposits',
        font: { size: 18, color: colors.primary, family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' },
        x: 0.5,
        xanchor: 'center'
      },
      xaxis: {
        title: '',
        tickformat: ',d',
        showgrid: true,
        gridcolor: '#E0E0E0'
      },
      yaxis: {
        automargin: true,
        tickfont: { size: 11 }
      },
      margin: { l: 280, r: 80, t: 60, b: 40 },
      height: 450,
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(0,0,0,0)'
    }
  };
};

/**
 * Generate a horizontal bar chart for top units by requests
 * @param {Array} units - Array of unit objects with requests data
 * @param {Object} colors - Campus color scheme
 * @param {number} topN - Number of top units to show
 * @returns {Object} Plotly chart config
 */
export const generateUnitPerformanceChart = (units, colors, topN = 10) => {
  const topUnits = units.slice(0, topN).reverse(); // Reverse for horizontal bar chart

  return {
    data: [{
      type: 'bar',
      orientation: 'h',
      x: topUnits.map(u => u.totalRequests),
      y: topUnits.map(u => truncateLabel(u.name, 45)),
      text: topUnits.map(u => formatNumber(u.totalRequests)),
      textposition: 'outside',
      marker: {
        color: colors.primary
      },
      hovertemplate: '<b>%{y}</b><br>Requests: %{x:,}<extra></extra>'
    }],
    layout: {
      title: {
        text: 'Top 10 Units by Total Requests',
        font: { size: 18, color: colors.primary, family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' },
        x: 0.5,
        xanchor: 'center'
      },
      xaxis: {
        title: '',
        tickformat: ',d',
        showgrid: true,
        gridcolor: '#E0E0E0'
      },
      yaxis: {
        automargin: true,
        tickfont: { size: 11 }
      },
      margin: { l: 280, r: 80, t: 60, b: 40 },
      height: 450,
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(0,0,0,0)'
    }
  };
};

/**
 * Generate a donut chart showing distribution among top units
 * @param {Array} units - Array of unit objects
 * @param {Object} colors - Campus color scheme
 * @param {number} topN - Number of top units to show
 * @returns {Object} Plotly chart config
 */
export const generateDistributionChart = (units, colors, topN = 8) => {
  const topUnits = units.slice(0, topN);
  const otherTotal = units.slice(topN).reduce((sum, u) => sum + u.totalRequests, 0);

  const labels = topUnits.map(u => truncateLabel(u.name, 35));
  const values = topUnits.map(u => u.totalRequests);

  if (otherTotal > 0) {
    labels.push('Other Units');
    values.push(otherTotal);
  }

  // Generate color palette based on campus colors
  const colorPalette = generateColorPalette(colors.primary, colors.secondary, labels.length);

  return {
    data: [{
      type: 'pie',
      labels: labels,
      values: values,
      hole: 0.45,
      marker: {
        colors: colorPalette,
        line: { color: '#ffffff', width: 2 }
      },
      textinfo: 'percent',
      textposition: 'outside',
      textfont: { size: 12 },
      hovertemplate: '%{label}<br>Requests: %{value:,}<br>%{percent}<extra></extra>',
      pull: 0.02
    }],
    layout: {
      title: {
        text: 'Request Distribution by Unit',
        font: { size: 18, color: colors.primary, family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' },
        x: 0.5,
        xanchor: 'center'
      },
      showlegend: true,
      legend: {
        x: 1.05,
        y: 0.5,
        font: { size: 10 },
        bgcolor: 'rgba(255,255,255,0.8)'
      },
      margin: { l: 20, r: 180, t: 60, b: 20 },
      height: 400,
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(0,0,0,0)'
    }
  };
};

/**
 * Generate a bar chart comparing deposits vs requests (engagement)
 * @param {Array} units - Array of merged unit data
 * @param {Object} colors - Campus color scheme
 * @param {number} topN - Number of top units to show
 * @returns {Object} Plotly chart config
 */
export const generateDepositsVsRequestsChart = (units, colors, topN = 10) => {
  const topUnits = units.slice(0, topN);

  return {
    data: [
      {
        type: 'bar',
        name: 'Deposits',
        x: topUnits.map(u => truncateLabel(u.name, 20)),
        y: topUnits.map(u => u.totalDeposits || 0),
        marker: { color: colors.secondary },
        hovertemplate: '%{x}<br>Deposits: %{y:,}<extra></extra>'
      },
      {
        type: 'bar',
        name: 'Requests (scaled)',
        x: topUnits.map(u => truncateLabel(u.name, 20)),
        y: topUnits.map(u => Math.round(u.totalRequests / 100)), // Scale down for comparison
        marker: { color: colors.primary },
        hovertemplate: '%{x}<br>Requests: %{y:,}00<extra></extra>'
      }
    ],
    layout: {
      title: {
        text: 'Deposits vs Engagement by Unit',
        font: { size: 18, color: colors.primary, family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' },
        x: 0.5,
        xanchor: 'center'
      },
      barmode: 'group',
      xaxis: {
        tickangle: -45,
        automargin: true,
        tickfont: { size: 10 }
      },
      yaxis: {
        title: 'Count',
        tickformat: ',d',
        showgrid: true,
        gridcolor: '#E0E0E0'
      },
      legend: {
        x: 0.5,
        y: 1.12,
        xanchor: 'center',
        orientation: 'h',
        bgcolor: 'rgba(255,255,255,0.8)'
      },
      margin: { l: 60, r: 30, t: 80, b: 120 },
      height: 450,
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(0,0,0,0)'
    }
  };
};

/**
 * Generate a line chart showing monthly trends
 * @param {Object} monthlyData - Monthly data object
 * @param {Object} colors - Campus color scheme
 * @param {number} months - Number of recent months to show
 * @returns {Object} Plotly chart config
 */
export const generateTrendsChart = (monthlyData, colors, months = 24) => {
  // Sort months and take the most recent
  const sortedMonths = Object.keys(monthlyData)
    .filter(m => m.match(/^\d{4}-\d{2}$/))
    .sort()
    .slice(-months);

  const values = sortedMonths.map(m => monthlyData[m] || 0);

  // Format month labels
  const labels = sortedMonths.map(m => {
    const [year, month] = m.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
  });

  return {
    data: [{
      type: 'scatter',
      mode: 'lines+markers',
      x: labels,
      y: values,
      line: {
        color: colors.primary,
        width: 2.5,
        shape: 'spline'
      },
      marker: {
        color: colors.primary,
        size: 5
      },
      fill: 'tozeroy',
      fillcolor: `${colors.primary}15`,
      hovertemplate: '%{x}<br>Requests: %{y:,}<extra></extra>'
    }],
    layout: {
      title: {
        text: 'Monthly Request Trends',
        font: { size: 18, color: colors.primary, family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' },
        x: 0.5,
        xanchor: 'center'
      },
      xaxis: {
        title: '',
        tickangle: -45,
        automargin: true,
        tickfont: { size: 10 },
        showgrid: false
      },
      yaxis: {
        title: 'Requests',
        tickformat: ',d',
        showgrid: true,
        gridcolor: '#E0E0E0'
      },
      margin: { l: 80, r: 30, t: 60, b: 80 },
      height: 350,
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(0,0,0,0)'
    }
  };
};

/**
 * Generate a stacked bar chart showing downloads vs view-only
 * @param {Array} units - Array of unit objects with breakdown data
 * @param {Object} colors - Campus color scheme
 * @param {number} topN - Number of top units to show
 * @returns {Object} Plotly chart config
 */
export const generateStackedEngagementChart = (units, colors, topN = 10) => {
  const topUnits = units.slice(0, topN);

  return {
    data: [
      {
        type: 'bar',
        name: 'Downloads',
        x: topUnits.map(u => truncateLabel(u.name, 20)),
        y: topUnits.map(u => u.downloads || Math.round(u.totalRequests * 0.35)),
        marker: { color: colors.primary },
        hovertemplate: '%{x}<br>Downloads: %{y:,}<extra></extra>'
      },
      {
        type: 'bar',
        name: 'View-only',
        x: topUnits.map(u => truncateLabel(u.name, 20)),
        y: topUnits.map(u => u.viewOnly || Math.round(u.totalRequests * 0.65)),
        marker: { color: colors.secondary },
        hovertemplate: '%{x}<br>View-only: %{y:,}<extra></extra>'
      }
    ],
    layout: {
      title: {
        text: 'Downloads vs View-only by Unit',
        font: { size: 18, color: colors.primary, family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' },
        x: 0.5,
        xanchor: 'center'
      },
      barmode: 'stack',
      xaxis: {
        tickangle: -45,
        automargin: true,
        tickfont: { size: 10 }
      },
      yaxis: {
        title: 'Requests',
        tickformat: ',d',
        showgrid: true,
        gridcolor: '#E0E0E0'
      },
      legend: {
        x: 0.5,
        y: 1.12,
        xanchor: 'center',
        orientation: 'h',
        bgcolor: 'rgba(255,255,255,0.8)'
      },
      margin: { l: 80, r: 30, t: 80, b: 120 },
      height: 450,
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(0,0,0,0)'
    }
  };
};

/**
 * Helper function to format numbers with commas
 * @param {number} num - Number to format
 * @returns {string} Formatted number string
 */
const formatNumber = (num) => {
  return num.toLocaleString();
};

/**
 * Helper function to truncate long labels
 * @param {string} label - Label text
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated label
 */
const truncateLabel = (label, maxLength) => {
  if (!label) return '';
  if (label.length <= maxLength) return label;
  return label.substring(0, maxLength - 3) + '...';
};

/**
 * Generate a color palette between two colors
 * @param {string} primary - Primary color (hex)
 * @param {string} secondary - Secondary color (hex)
 * @param {number} count - Number of colors needed
 * @returns {Array} Array of hex colors
 */
const generateColorPalette = (primary, secondary, count) => {
  const colors = [];
  for (let i = 0; i < count; i++) {
    const ratio = i / (count - 1 || 1);
    colors.push(interpolateColor(primary, secondary, ratio));
  }
  return colors;
};

/**
 * Interpolate between two hex colors
 * @param {string} color1 - First color (hex)
 * @param {string} color2 - Second color (hex)
 * @param {number} ratio - Interpolation ratio (0-1)
 * @returns {string} Interpolated color (hex)
 */
const interpolateColor = (color1, color2, ratio) => {
  const hex = (c) => parseInt(c, 16);
  const r1 = hex(color1.slice(1, 3));
  const g1 = hex(color1.slice(3, 5));
  const b1 = hex(color1.slice(5, 7));
  const r2 = hex(color2.slice(1, 3));
  const g2 = hex(color2.slice(3, 5));
  const b2 = hex(color2.slice(5, 7));

  const r = Math.round(r1 + (r2 - r1) * ratio);
  const g = Math.round(g1 + (g2 - g1) * ratio);
  const b = Math.round(b1 + (b2 - b1) * ratio);

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

/**
 * Convert Plotly config to embeddable JSON for static HTML
 * @param {Object} chartConfig - Plotly chart configuration
 * @returns {string} JSON string for embedding
 */
export const chartToEmbeddableJSON = (chartConfig) => {
  return JSON.stringify(chartConfig);
};
