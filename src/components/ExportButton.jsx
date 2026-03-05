import React from 'react';
import { generateReportHTML } from '../templates/reportTemplate';

const ExportButton = ({ content, campusColors, chartData }) => {
  const handleExport = () => {
    const html = generateReportHTML(content, campusColors, chartData);

    // Create blob and download
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `${content.campusCode || 'uc'}_escholarship_report.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="card">
      <h3 className="section-title">6. Export Report</h3>
      <p className="text-sm text-gray-600 mb-4">
        Download a standalone HTML file that can be hosted on any web server, GitHub Pages, or Netlify.
      </p>
      <button
        onClick={handleExport}
        className="btn-primary w-full flex items-center justify-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Download Report HTML
      </button>
    </div>
  );
};

export default ExportButton;
