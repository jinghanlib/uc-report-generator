import React from 'react';

const FooterEditor = ({ content, onContentChange }) => {
  const handleChange = (field, value) => {
    onContentChange(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="card">
      <h3 className="section-title">5. Footer & Attribution</h3>

      {/* Live Data Links */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Live Data Links</h4>
        <div className="space-y-3">
          <div>
            <label htmlFor="breakdownByUnitUrl" className="form-label text-xs">
              Breakdown by Unit URL
            </label>
            <input
              type="url"
              id="breakdownByUnitUrl"
              value={content.breakdownByUnitUrl || ''}
              onChange={(e) => handleChange('breakdownByUnitUrl', e.target.value)}
              className="form-input text-sm"
            />
          </div>

          <div>
            <label htmlFor="historyByUnitUrl" className="form-label text-xs">
              History by Unit URL
            </label>
            <input
              type="url"
              id="historyByUnitUrl"
              value={content.historyByUnitUrl || ''}
              onChange={(e) => handleChange('historyByUnitUrl', e.target.value)}
              className="form-input text-sm"
            />
          </div>

          <div>
            <label htmlFor="depositsByUnitUrl" className="form-label text-xs">
              Deposits by Unit URL
            </label>
            <input
              type="url"
              id="depositsByUnitUrl"
              value={content.depositsByUnitUrl || ''}
              onChange={(e) => handleChange('depositsByUnitUrl', e.target.value)}
              className="form-input text-sm"
            />
          </div>
        </div>
      </div>

      {/* Attribution */}
      <div className="border-t pt-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Attribution</h4>

        <div className="mb-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={content.showCredits || false}
              onChange={(e) => handleChange('showCredits', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Show credits in footer</span>
          </label>
        </div>

        {content.showCredits && (
          <div className="space-y-3 pl-6">
            <div>
              <label htmlFor="creditName" className="form-label text-xs">
                Organization/Library Name
              </label>
              <input
                type="text"
                id="creditName"
                value={content.creditName || ''}
                onChange={(e) => handleChange('creditName', e.target.value)}
                placeholder="e.g., UC Riverside Library"
                className="form-input text-sm"
              />
            </div>

            <div>
              <label htmlFor="creatorName" className="form-label text-xs">
                Creator Name (optional)
              </label>
              <input
                type="text"
                id="creatorName"
                value={content.creatorName || ''}
                onChange={(e) => handleChange('creatorName', e.target.value)}
                placeholder="e.g., Jane Doe, Digital Scholarship Librarian"
                className="form-input text-sm"
              />
            </div>

            <div>
              <label htmlFor="creditLink" className="form-label text-xs">
                Credit Link (optional)
              </label>
              <input
                type="url"
                id="creditLink"
                value={content.creditLink || ''}
                onChange={(e) => handleChange('creditLink', e.target.value)}
                placeholder="https://library.example.edu"
                className="form-input text-sm"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FooterEditor;
