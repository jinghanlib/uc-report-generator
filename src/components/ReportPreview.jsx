import React, { useMemo } from 'react';
import { generateReportHTML } from '../templates/reportTemplate';

const ReportPreview = ({ content, campusColors, chartData }) => {
  const previewHtml = useMemo(() => {
    return generateReportHTML(content, campusColors, chartData);
  }, [content, campusColors, chartData]);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-gray-800">Live Preview</h3>
        <span className="text-xs text-gray-500">Updates automatically</span>
      </div>
      <div className="flex-1 border border-gray-300 rounded-lg overflow-hidden bg-white">
        <iframe
          srcDoc={previewHtml}
          title="Report Preview"
          className="w-full h-full min-h-[600px]"
          sandbox="allow-scripts"
        />
      </div>
    </div>
  );
};

export default ReportPreview;
