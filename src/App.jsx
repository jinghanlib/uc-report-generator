import React, { useState, useEffect, useMemo } from 'react';
import { campusColors, defaultCampus } from './data/campusColors';
import { getDefaultContent } from './data/defaultContent';
import CampusSelector from './components/CampusSelector';
import DataUploader from './components/DataUploader';
import TextEditor from './components/TextEditor';
import LinkEditor from './components/LinkEditor';
import FooterEditor from './components/FooterEditor';
import ReportPreview from './components/ReportPreview';
import ExportButton from './components/ExportButton';

function App() {
  // State
  const [selectedCampus, setSelectedCampus] = useState(defaultCampus);
  const [content, setContent] = useState(() => getDefaultContent(campusColors[defaultCampus]));
  const [chartData, setChartData] = useState({
    historyData: null,
    depositsData: null
  });
  const [manualStats, setManualStats] = useState({
    totalDeposits: 0,
    totalRequests: 0,
    unitCount: 0
  });

  // Get current campus colors
  const currentCampusColors = useMemo(() => {
    return campusColors[selectedCampus] || campusColors[defaultCampus];
  }, [selectedCampus]);

  // Update content when campus changes - reset to new campus defaults
  useEffect(() => {
    const campus = campusColors[selectedCampus];
    if (campus) {
      // Get fresh default content for the new campus
      const newDefaults = getDefaultContent(campus);

      setContent(prev => ({
        // Start with new campus defaults (includes correct URLs, attribution, etc.)
        ...newDefaults,
        // Preserve user-edited content that should carry over
        reportSubtitle: prev.reportSubtitle || newDefaults.reportSubtitle,
        generatedDate: prev.generatedDate || newDefaults.generatedDate,
        showCredits: prev.showCredits !== undefined ? prev.showCredits : newDefaults.showCredits,
        // Keep journal count if user entered it, otherwise use new default
        journalCount: prev.journalCount || newDefaults.journalCount,
        // Keep creator info if user entered it
        creatorName: prev.creatorName || newDefaults.creatorName,
        creatorTitle: prev.creatorTitle || newDefaults.creatorTitle
      }));
    }
  }, [selectedCampus]);

  // Handle campus change
  const handleCampusChange = (campusId) => {
    setSelectedCampus(campusId);
    // Clear chart data when campus changes since it's campus-specific
    setChartData({ historyData: null, depositsData: null });
    setManualStats({ totalDeposits: 0, totalRequests: 0, unitCount: 0 });
  };

  // Combined chart data
  const combinedChartData = useMemo(() => ({
    ...chartData,
    manualStats
  }), [chartData, manualStats]);

  // Reset all content to defaults
  const handleReset = () => {
    const campus = campusColors[selectedCampus];
    setContent(getDefaultContent(campus));
    setChartData({ historyData: null, depositsData: null });
    setManualStats({ totalDeposits: 0, totalRequests: 0, unitCount: 0 });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header
        className="text-white py-4 px-6 shadow-lg"
        style={{ backgroundColor: currentCampusColors.primary }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">UC eScholarship Report Generator</h1>
            <p className="text-sm opacity-90">Create customized reports for your campus</p>
          </div>
          <div
            className="h-8 w-8 rounded"
            style={{ backgroundColor: currentCampusColors.secondary }}
          />
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left column - Form */}
          <div className="space-y-4">
            <CampusSelector
              selectedCampus={selectedCampus}
              onCampusChange={handleCampusChange}
              campusColors={currentCampusColors}
            />

            <DataUploader
              campusCode={currentCampusColors.code}
              onDataLoaded={setChartData}
              manualStats={manualStats}
              onManualStatsChange={setManualStats}
            />

            <TextEditor
              content={content}
              onContentChange={setContent}
              campusCode={currentCampusColors.code}
            />

            <LinkEditor
              content={content}
              onContentChange={setContent}
            />

            <FooterEditor
              content={content}
              onContentChange={setContent}
            />

            <ExportButton
              content={content}
              campusColors={currentCampusColors}
              chartData={combinedChartData}
            />

            {/* Reset button */}
            <div className="card">
              <button
                onClick={handleReset}
                className="btn-secondary w-full"
              >
                Reset to Defaults
              </button>
            </div>
          </div>

          {/* Right column - Preview */}
          <div className="lg:sticky lg:top-4 lg:h-[calc(100vh-8rem)]">
            <ReportPreview
              content={content}
              campusColors={currentCampusColors}
              chartData={combinedChartData}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 px-6 mt-8">
        <div className="max-w-7xl mx-auto text-center text-sm">
          <p>UC eScholarship Report Generator</p>
          <p className="text-gray-400 mt-1">
            Creates standalone HTML reports for any UC campus
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
