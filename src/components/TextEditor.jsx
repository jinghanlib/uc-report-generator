import React from 'react';

const TextEditor = ({ content, onContentChange, campusCode }) => {
  const handleChange = (field, value) => {
    onContentChange(prev => ({ ...prev, [field]: value }));
  };

  const handleNumberChange = (field, value) => {
    const numValue = parseInt(value.replace(/,/g, ''), 10) || 0;
    onContentChange(prev => ({ ...prev, [field]: numValue }));
  };

  const formatNumber = (num) => {
    return num ? num.toLocaleString() : '';
  };

  return (
    <div className="card">
      <h3 className="section-title">3. Report Content</h3>
      <div className="space-y-3">
        <div>
          <label htmlFor="reportTitle" className="form-label">Report Title</label>
          <input
            type="text"
            id="reportTitle"
            value={content.reportTitle || ''}
            onChange={(e) => handleChange('reportTitle', e.target.value)}
            className="form-input"
          />
        </div>

        <div>
          <label htmlFor="reportSubtitle" className="form-label">Report Subtitle</label>
          <input
            type="text"
            id="reportSubtitle"
            value={content.reportSubtitle || ''}
            onChange={(e) => handleChange('reportSubtitle', e.target.value)}
            placeholder="e.g., Repository Analytics | Data: January 2002 – February 2026"
            className="form-input"
          />
        </div>

        <div>
          <label htmlFor="generatedDate" className="form-label">Report Date</label>
          <input
            type="text"
            id="generatedDate"
            value={content.generatedDate || ''}
            onChange={(e) => handleChange('generatedDate', e.target.value)}
            className="form-input"
          />
        </div>

        <div className="border-t pt-3 mt-3">
          <label htmlFor="journalCount" className="form-label">
            Number of Journals
            <span className="text-xs text-gray-500 ml-2">(Published on eScholarship)</span>
          </label>
          <input
            type="text"
            id="journalCount"
            value={formatNumber(content.journalCount)}
            onChange={(e) => handleNumberChange('journalCount', e.target.value)}
            placeholder="e.g., 4"
            className="form-input"
          />
          <p className="text-xs text-gray-500 mt-1">
            This appears in the Snapshot section.{' '}
            {campusCode && (
              <a
                href={`https://escholarship.org/${campusCode}/journals`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Check your campus journals page to verify the count
              </a>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TextEditor;
