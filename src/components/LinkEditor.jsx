import React from 'react';

const LinkEditor = ({ content, onContentChange }) => {
  const handleChange = (field, value) => {
    onContentChange(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="card">
      <h3 className="section-title">4. Campus Links</h3>
      <div className="space-y-3">
        <div>
          <label htmlFor="campusEscholarshipUrl" className="form-label">
            Main eScholarship URL
          </label>
          <input
            type="url"
            id="campusEscholarshipUrl"
            value={content.campusEscholarshipUrl || ''}
            onChange={(e) => handleChange('campusEscholarshipUrl', e.target.value)}
            placeholder="https://escholarship.org/uc/..."
            className="form-input"
          />
        </div>

        <div>
          <label htmlFor="campusPostprintsUrl" className="form-label">
            Previously Published Works URL
          </label>
          <input
            type="url"
            id="campusPostprintsUrl"
            value={content.campusPostprintsUrl || ''}
            onChange={(e) => handleChange('campusPostprintsUrl', e.target.value)}
            placeholder="https://escholarship.org/uc/..._postprints"
            className="form-input"
          />
        </div>

        <div>
          <label htmlFor="campusJournalsUrl" className="form-label">
            Journals URL
          </label>
          <input
            type="url"
            id="campusJournalsUrl"
            value={content.campusJournalsUrl || ''}
            onChange={(e) => handleChange('campusJournalsUrl', e.target.value)}
            placeholder="https://escholarship.org/uc/.../journals"
            className="form-input"
          />
        </div>

        <div>
          <label htmlFor="campusEtdUrl" className="form-label">
            ETD (Theses & Dissertations) URL
          </label>
          <input
            type="url"
            id="campusEtdUrl"
            value={content.campusEtdUrl || ''}
            onChange={(e) => handleChange('campusEtdUrl', e.target.value)}
            placeholder="https://escholarship.org/uc/..._etd"
            className="form-input"
          />
        </div>
      </div>
    </div>
  );
};

export default LinkEditor;
