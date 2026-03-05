// Default content templates for UC eScholarship reports
// Content extracted from the original UCR report for accurate, consistent reports across all campuses

// Campus-specific attribution defaults
const campusAttributions = {
  ucb: { creditName: 'UC Berkeley Library', creatorName: '', creatorTitle: '' },
  ucla: { creditName: 'UCLA Library', creatorName: '', creatorTitle: '' },
  ucsd: { creditName: 'UC San Diego Library', creatorName: '', creatorTitle: '' },
  ucd: { creditName: 'UC Davis Library', creatorName: '', creatorTitle: '' },
  uci: { creditName: 'UC Irvine Libraries', creatorName: '', creatorTitle: '' },
  ucsb: { creditName: 'UC Santa Barbara Library', creatorName: '', creatorTitle: '' },
  ucsc: { creditName: 'UC Santa Cruz Library', creatorName: '', creatorTitle: '' },
  ucr: { creditName: 'UC Riverside Library', creatorName: '', creatorTitle: '' },
  ucm: { creditName: 'UC Merced Library', creatorName: '', creatorTitle: '' },
  ucsf: { creditName: 'UCSF Library', creatorName: '', creatorTitle: '' }
};

// Tableau dashboard campus names (must match exactly what Tableau expects)
const tableauCampusNames = {
  ucb: 'UC Berkeley',
  ucla: 'UCLA',
  ucsd: 'UC San Diego',
  ucd: 'UC Davis',
  uci: 'UC Irvine',
  ucsb: 'UC Santa Barbara',
  ucsc: 'UC Santa Cruz',
  ucr: 'UC Riverside',
  ucm: 'UC Merced',
  ucsf: 'UCSF'
};

// Estimated journal counts per campus (users can update manually)
// Check actual counts at: https://escholarship.org/{campusCode}/journals
const estimatedJournalCounts = {
  ucb: 15,
  ucla: 20,
  ucsd: 8,
  ucd: 10,
  uci: 12,
  ucsb: 6,
  ucsc: 5,
  ucr: 4,
  ucm: 2,
  ucsf: 8
};

export const getDefaultContent = (campus) => {
  const today = new Date();
  const currentMonth = today.toLocaleDateString('en-US', { month: 'long' });
  const currentYear = today.getFullYear();
  const formattedDate = today.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: '2-digit'
  });

  // Get campus-specific attribution
  const attribution = campusAttributions[campus.code] || {
    creditName: `${campus.name} Library`,
    creatorName: '',
    creatorTitle: ''
  };

  return {
    // Basic Info
    campusName: campus.name,
    campusCode: campus.code,
    reportTitle: `${campus.name} eScholarship Report`,
    reportSubtitle: `Repository Analytics | Data: January 2002 – ${currentMonth} ${currentYear}`,
    generatedDate: formattedDate,

    // Campus-specific URLs (corrected patterns)
    campusEscholarshipUrl: `https://escholarship.org/uc/${campus.code}`,
    campusPostprintsUrl: `https://escholarship.org/uc/${campus.code}_postprints`,
    // Journals URL follows pattern: https://escholarship.org/{campusCode}/journals (no /uc/)
    campusJournalsUrl: `https://escholarship.org/${campus.code}/journals`,
    campusEtdUrl: `https://escholarship.org/uc/${campus.code}_etd`,
    campusStatsUrl: `https://escholarship.org/uc/${campus.code}/stats`,

    // Footer Links (Live data)
    breakdownByUnitUrl: `https://escholarship.org/uc/${campus.code}/stats/breakdown_by_unit?range=all`,
    historyByUnitUrl: `https://escholarship.org/uc/${campus.code}/stats/history_by_unit?range=all`,
    depositsByUnitUrl: `https://escholarship.org/uc/${campus.code}/stats/deposits_by_unit?range=all`,

    // Attribution (changes per campus)
    showCredits: true,
    creditName: attribution.creditName,
    creditLink: "",
    creatorName: attribution.creatorName,
    creatorTitle: attribution.creatorTitle,

    // Statistics (will be populated from CSV or manual entry)
    totalDeposits: 0,
    totalDownloads: 0,
    totalViews: 0,
    // Journal count - uses estimated default, user can update manually
    journalCount: estimatedJournalCounts[campus.code] || 0,

    // ==========================================
    // SECTION 1: ABOUT ESCHOLARSHIP
    // ==========================================
    aboutContent: `<strong><a href="https://escholarship.org/" target="_blank">eScholarship</a></strong> is UC's institutional repository and Open Access publishing platform.`,

    aboutPublishing: `<strong><a href="https://escholarship.org/publishing" target="_blank">eScholarship Publishing</a></strong> provides comprehensive publication services for UC-affiliated departments, research units, publishing programs, and individual scholars who seek to publish original, open access journals, books, conference proceedings, and other scholarship. The eScholarship Publishing program also supports two preprint servers, <a href="https://eartharxiv.org/" target="_blank">EarthArXiv</a> and <a href="https://ecoevorxiv.org/" target="_blank">EcoEvoRxiv</a>.`,

    aboutRepository: `<strong><a href="https://escholarship.org/repository" target="_blank">eScholarship Repository</a></strong> offers preservation and dissemination services for a wide range of scholarship including working papers, electronic theses and dissertations (ETDs), student capstone projects, and paper/seminar series.`,

    aboutCdl: `eScholarship is managed by the <strong><a href="https://cdlib.org/" target="_blank">California Digital Library (CDL)</a></strong> and is available without fees to UC-affiliated departments, research units, publishing programs, and scholars.`,

    // ==========================================
    // SECTION 2: SNAPSHOT
    // ==========================================
    snapshotCards: [
      { label: 'Total Deposits', valueKey: 'totalDeposits', sub: 'All-time submissions' },
      { label: 'Total Requests', valueKey: 'totalRequests', sub: 'Downloads + Views' },
      { label: 'Research Units', valueKey: 'unitCount', sub: 'Active units' },
      { label: 'Journals', valueKey: 'journalCount', sub: 'Published on eScholarship' }
    ],

    snapshotHighlight: {
      title: 'Viewing Live Statistics',
      content: `Live data links are available in the footer. <strong>Tip:</strong> You can view live statistics for any eScholarship unit by adding <code>/stats</code> after the unit URL (e.g., <code>escholarship.org/uc/${campus.code}/stats</code>).`,
      learnMoreUrl: 'https://help.escholarship.org/support/solutions/articles/9000131087-understanding-escholarship-usage-statistics',
      learnMoreText: 'Learn more about understanding eScholarship usage statistics'
    },

    // ==========================================
    // SECTION 3: UC OPEN ACCESS POLICIES
    // ==========================================
    oaPolicyContent: `UC Open Access Policies cover <strong>scholarly articles</strong> and allow UC employees to retain rights in their work by granting the University a non-exclusive license to exercise rights under copyright, including distribution and display.`,

    oaPolicyTypes: `<strong>Publication Types Covered:</strong> The default covered types include journal articles, book chapters, and conference papers. Authors may deposit other materials they consider scholarly articles in their discipline.`,

    oaPolicyUrl: 'https://osc.universityofcalifornia.edu/for-authors/open-access-policy/',
    oaPolicyLinkText: 'Learn more about UC Open Access Policies',

    ucpmsHighlight: {
      title: 'UC Publication Management System (UCPMS)',
      content: `The UCPMS is used by UC authors systemwide to make it easier to identify open access policy articles and deposit them to eScholarship. The system emails authors and the delegated helpers biweekly if it has found new publications to claim and deposit to their department Open Access Policy Deposits series and ${campus.name} Previously Published Works. CDL have worked with ${campus.name} to ensure that the faculty and researchers who are likely to be publishing are receiving notifications.`,
      loginUrl: 'https://oapolicy.universityofcalifornia.edu/',
      loginText: 'Log in to UCPMS'
    },

    // ==========================================
    // SECTION 4: PUBLISHING SERVICES
    // ==========================================
    publishingContent: `eScholarship offers publishing and production tools as well as professional support and consulting services for journals, preprints, monographs, conference proceedings, and other UC-affiliated original scholarship. eScholarship's Diamond Open Access publishing program includes 90+ UC affiliated academic journals.`,

    // Campus-specific journals (can be customized per campus)
    campusJournals: [],

    // ==========================================
    // SECTION 5: CONTENT SOURCES
    // ==========================================
    contentSourcesIntro: `Content enters eScholarship through multiple pathways. <a href="https://help.escholarship.org/support/solutions/articles/9000126535-how-content-gets-into-escholarship" target="_blank">Learn more</a>`,

    contentSources: [
      {
        title: 'Publishing Systems',
        items: ['eScholarship Journal Publishing System (Janeway)']
      },
      {
        title: 'Repository Content',
        items: [
          `<a href="https://oapolicy.universityofcalifornia.edu/" target="_blank">UC Publication Management System (UCPMS)</a>`,
          `<a href="https://submit.escholarship.org/subi/login" target="_blank">eScholarship submission system</a>`,
          `<a href="https://help.oapolicy.universityofcalifornia.edu/support/solutions/articles/9000211060-pubmed-central-users-your-publications-may-be-auto-deposited-to-escholarship-" target="_blank">Autodeposit (Europe PubMed Central)</a>`
        ]
      },
      {
        title: 'Electronic Theses and Dissertations (ETDs)',
        items: [
          'All UC campuses deposit ETDs in eScholarship',
          'Workflow: ProQuest &rarr; CDL &rarr; Cataloging &rarr; eScholarship &rarr; Merritt preservation',
          `<a href="https://help.escholarship.org/support/solutions/articles/9000272087-cdl-s-theses-and-dissertation-service" target="_blank">Learn more about the ETD service</a>`
        ]
      }
    ],

    // ==========================================
    // SECTION 6: DISCOVERY AND VISIBILITY
    // ==========================================
    discoveryIntro: `eScholarship content is indexed by major search engines, academic databases, and library systems for maximum discoverability. <a href="https://help.escholarship.org/support/solutions/articles/9000133469-how-users-find-escholarship-content" target="_blank">Learn more</a>`,

    discoveryChannels: [
      {
        title: 'Search Engines',
        items: ['Google / Google Scholar', 'Baidu', 'Bing / Yahoo', 'Internet Archive', 'Wikipedia']
      },
      {
        title: 'Library Systems',
        items: ['Melvyl / OCLC WorldCat', 'UC Library Search', 'Primo Central Discovery Index (CDI)']
      },
      {
        title: 'Specialized Indexes (A-E)',
        items: ['Clarivate', 'CNKI', 'CORE', 'DOAJ', 'EBSCO', 'EBSCO CINAHL', 'Electronic Journals Library (EZB)', 'Elsevier Ovid Emcare', 'Europe PubMed Central']
      },
      {
        title: 'Specialized Indexes (F-O)',
        items: ['Free Journal Network', 'JSTOR', 'MathSciNet', 'National Digital Library of India', 'OASPA', 'OpenAlex', 'OSTI (Department of Energy)']
      },
      {
        title: 'Specialized Indexes (P-Z)',
        items: ['ProQuest Central', 'PubMed', 'PubMed Central', 'RePEc (economics)', 'ROAD', 'Scopus', 'SUDOC (FR)', 'Zeitschriften Datenbank (ZDB)', 'Zentralblatt für Mathematik']
      }
    ],

    articleMetricsHighlight: {
      title: 'Article-Level Metrics',
      content: [
        'eScholarship integrates with <strong>Altmetrics</strong> to show article-level engagement data including social media mentions, news coverage, and more.',
        '<strong>ORCID iDs</strong> are displayed on individual article pages when available, helping connect works to author profiles.',
        'eScholarship provides <strong>article views and downloads</strong> in its Metrics tab on each article page.',
        'Authors receive <strong>quarterly statistics notifications</strong> for deposited publications, keeping them informed of their work\'s impact.'
      ],
      exampleUrl: 'https://escholarship.org/uc/item/0pm919sz#metrics',
      exampleText: 'See an example of article metrics',
      learnMoreUrl: 'https://help.escholarship.org/support/solutions/articles/9000068068-usage-statistics-for-escholarship-content',
      learnMoreText: 'Learn more about usage statistics for eScholarship content authors'
    },

    // ==========================================
    // SECTION 7: UNIT PERFORMANCE
    // ==========================================
    unitPerformanceHighlight: {
      title: 'About Research Units',
      content: [
        'Departments and research units can establish dedicated spaces in eScholarship to showcase their affiliated work. Submitted content is approved by designated local administrators.',
        `Works from the Publication Management System appear in the campus-wide "<a href="https://escholarship.org/uc/${campus.code}_postprints" target="_blank">${campus.name} Previously Published Works</a>" series and department "Open Access Policy Deposits" series.`
      ],
      learnMoreUrl: 'https://help.escholarship.org/support/solutions/articles/9000131086-request-a-new-unit',
      learnMoreText: 'Learn more about requesting a new research unit'
    },

    // ==========================================
    // SECTION 8: DATA TABLES
    // ==========================================
    dataTableColumns: ['Unit', 'Deposits', 'Total Requests', 'Downloads', 'View-only', 'Download %'],

    tableauDashboard: {
      intro: 'View systemwide OA policy compliance and implementation statistics. <strong>Tip:</strong> Use the campus selector in the top-right corner to compare statistics across different UC campuses.',
      // Use the exact campus name that Tableau expects for filtering
      tableauCampusName: tableauCampusNames[campus.code] || campus.name,
      // Use Tableau Public JavaScript API for proper embedding
      vizName: 'UCCampusOAPolicyImplementationDashboard/CampGraphic',
      staticImage: 'https://public.tableau.com/static/images/UC/UCCampusOAPolicyImplementationDashboard/CampGraphic/1.png',
      fullUrl: 'https://public.tableau.com/app/profile/uc.open.access.policies/viz/UCCampusOAPolicyImplementationDashboard/CampGraphic',
      fullUrlText: 'Open full dashboard in new tab'
    },

    // ==========================================
    // FOOTER
    // ==========================================
    footerNote: 'Note: Data may include some inactive research units.',

    // Optional: Custom highlights (array of objects for campus-specific content)
    customHighlights: []
  };
};

// Get data download instructions
export const getDataInstructions = (campusCode) => ({
  historyUrl: `https://escholarship.org/uc/${campusCode}/stats/history_by_unit?range=all`,
  depositsUrl: `https://escholarship.org/uc/${campusCode}/stats/deposits_by_unit?range=all`,
  breakdownUrl: `https://escholarship.org/uc/${campusCode}/stats/breakdown_by_unit?range=all`,
  instructions: [
    "Navigate to the stats page linked above",
    "Click the 'Export' or 'Download CSV' button",
    "Save the CSV file to your computer",
    "Upload the file using the form below"
  ]
});

// Chart data source documentation
export const getChartDataSources = () => ({
  unitPerformance: {
    chart: 'Top Units by Total Requests',
    source: 'history_by_unit.csv',
    description: 'Horizontal bar chart showing top 10 units ranked by total requests (views + downloads)'
  },
  distribution: {
    chart: 'Request Distribution by Unit',
    source: 'history_by_unit.csv',
    description: 'Pie/donut chart showing percentage breakdown of requests across units'
  },
  trends: {
    chart: 'Monthly Request Trends',
    source: 'history_by_unit.csv',
    description: 'Line chart showing request counts over the past 24 months'
  },
  depositsVsRequests: {
    chart: 'Deposits vs Requests Comparison',
    source: 'history_by_unit.csv + deposits_by_unit.csv',
    description: 'Grouped bar chart comparing deposits to engagement per unit'
  },
  dataTable: {
    chart: 'Complete Data by Unit',
    source: 'history_by_unit.csv + deposits_by_unit.csv + breakdown_by_unit.csv',
    description: 'Full data table with deposits, requests, downloads, view-only, and download percentage'
  }
});
