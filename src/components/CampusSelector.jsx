import React from 'react';
import { campusList } from '../data/campusColors';

const CampusSelector = ({ selectedCampus, onCampusChange, campusColors }) => {
  return (
    <div className="card">
      <h3 className="section-title">1. Select Campus</h3>
      <div className="space-y-3">
        <div>
          <label htmlFor="campus" className="form-label">
            UC Campus
          </label>
          <select
            id="campus"
            value={selectedCampus}
            onChange={(e) => onCampusChange(e.target.value)}
            className="form-input"
          >
            {campusList.map((campus) => (
              <option key={campus.id} value={campus.id}>
                {campus.name}
              </option>
            ))}
          </select>
        </div>

        {campusColors && (
          <div className="mt-3">
            <p className="text-sm text-gray-600 mb-2">Campus Colors:</p>
            <div className="flex gap-3">
              <div className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded border border-gray-300"
                  style={{ backgroundColor: campusColors.primary }}
                />
                <span className="text-sm text-gray-600">Primary</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded border border-gray-300"
                  style={{ backgroundColor: campusColors.secondary }}
                />
                <span className="text-sm text-gray-600">Secondary</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CampusSelector;
