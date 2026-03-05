import {
  generateUnitPerformanceChart,
  generateDepositsChart,
  generateDepositsVsRequestsChart,
  generateTrendsChart,
  generateDistributionChart,
  generateStackedEngagementChart
} from '../utils/chartGenerator';

/**
 * Generate the complete HTML report
 * Matches the exact structure and content of the UCR eScholarship report
 *
 * @param {Object} content - Report content and settings
 * @param {Object} campusColors - Campus color scheme
 * @param {Object} chartData - Parsed chart data (historyData, depositsData)
 * @returns {string} Complete HTML document
 */
export const generateReportHTML = (content, campusColors, chartData) => {
  const { historyData, depositsData, breakdownData, manualStats } = chartData || {};

  // Calculate stats
  const stats = {
    totalRequests: historyData?.totalRequests || manualStats?.totalRequests || 0,
    totalDeposits: depositsData?.totalDeposits || manualStats?.totalDeposits || 0,
    unitCount: historyData?.units?.length || manualStats?.unitCount || 0,
    journalCount: content.journalCount || content.campusJournals?.length || 0
  };

  // Merge unit data if both datasets available
  const units = historyData?.units || [];
  const depositsMap = {};
  if (depositsData?.units) {
    depositsData.units.forEach(u => {
      depositsMap[u.name] = u.totalDeposits;
    });
  }

  // Create breakdown lookup for downloads/views
  const breakdownMap = {};
  if (breakdownData?.units) {
    breakdownData.units.forEach(u => {
      breakdownMap[u.name] = {
        downloads: u.downloads || 0,
        viewOnly: u.viewOnly || 0,
        downloadPercent: u.downloadPercent || 0
      };
    });
  }

  const mergedUnits = units.map(u => ({
    ...u,
    totalDeposits: depositsMap[u.name] || 0,
    downloads: breakdownMap[u.name]?.downloads || Math.round(u.totalRequests * 0.35),
    viewOnly: breakdownMap[u.name]?.viewOnly || Math.round(u.totalRequests * 0.65),
    downloadPercent: breakdownMap[u.name]?.downloadPercent ||
      (u.totalRequests > 0 ? ((Math.round(u.totalRequests * 0.35) / u.totalRequests) * 100).toFixed(1) : 0)
  }));

  // Generate chart configurations (matching original UCR report structure)
  const charts = {
    // Unit Performance section: deposits and requests bar charts
    deposits: mergedUnits.length > 0
      ? generateDepositsChart(mergedUnits, campusColors, 10)
      : null,
    requests: units.length > 0
      ? generateUnitPerformanceChart(units, campusColors, 10)
      : null,
    // Engagement section: donut, engagement comparison, stacked
    distribution: units.length > 0
      ? generateDistributionChart(units, campusColors, 8)
      : null,
    depositsVsRequests: mergedUnits.length > 0 && depositsData
      ? generateDepositsVsRequestsChart(mergedUnits, campusColors, 10)
      : null,
    stacked: mergedUnits.length > 0
      ? generateStackedEngagementChart(mergedUnits, campusColors, 10)
      : null,
    // Keep these for backwards compatibility
    unitPerformance: units.length > 0
      ? generateUnitPerformanceChart(units, campusColors, 10)
      : null,
    trends: historyData?.monthlyData
      ? generateTrendsChart(historyData.monthlyData, campusColors, 24)
      : null,
    distribution: units.length > 0
      ? generateDistributionChart(units, campusColors, 8)
      : null
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(content.reportTitle || 'UC eScholarship Report')}</title>
    <script src="https://cdn.plot.ly/plotly-2.27.0.min.js"></script>
    <style>
        :root {
            --campus-blue: ${campusColors.cssVars?.['--campus-blue'] || campusColors.primary};
            --campus-navy: ${campusColors.cssVars?.['--campus-navy'] || campusColors.primary};
            --campus-gold: ${campusColors.cssVars?.['--campus-gold'] || campusColors.secondary};
            --campus-gray: #7A6E67;
            --light-gray: #F5F5F5;
            --border-gray: #E0E0E0;
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
            line-height: 1.6;
            color: #333;
            background: var(--light-gray);
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }

        header {
            background: var(--campus-navy);
            color: white;
            padding: 30px 0;
            margin-bottom: 30px;
            border-bottom: 4px solid var(--campus-gold);
        }

        header h1 {
            font-size: 2.2rem;
            font-weight: 600;
        }

        header .subtitle {
            font-size: 1rem;
            opacity: 0.9;
            margin-top: 5px;
        }

        .nav {
            background: white;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 30px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            position: sticky;
            top: 0;
            z-index: 100;
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
        }

        .nav a {
            color: var(--campus-blue);
            text-decoration: none;
            margin-right: 15px;
            font-weight: 500;
            font-size: 0.9rem;
        }

        .nav a:hover {
            text-decoration: underline;
            color: var(--campus-navy);
        }

        .section {
            background: white;
            border-radius: 8px;
            padding: 30px;
            margin-bottom: 30px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .section h2 {
            color: var(--campus-navy);
            font-size: 1.5rem;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid var(--campus-gold);
        }

        .section h3 {
            color: var(--campus-navy);
            font-size: 1.1rem;
            margin: 20px 0 10px 0;
        }

        .section p {
            margin-bottom: 15px;
        }

        .section ul {
            margin-left: 20px;
            margin-bottom: 15px;
        }

        .section li {
            margin-bottom: 8px;
        }

        .section a {
            color: var(--campus-blue);
            text-decoration: none;
        }

        .section a:hover {
            text-decoration: underline;
        }

        .highlight-box {
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            border-left: 4px solid var(--campus-gold);
            padding: 20px;
            margin: 20px 0;
            border-radius: 0 8px 8px 0;
        }

        .highlight-box h4 {
            color: var(--campus-navy);
            margin-bottom: 10px;
        }

        .dashboard-link {
            display: inline-block;
            background: var(--campus-blue);
            color: white !important;
            padding: 12px 24px;
            border-radius: 6px;
            text-decoration: none !important;
            font-weight: 500;
            margin: 10px 0;
            transition: background 0.2s;
        }

        .dashboard-link:hover {
            background: var(--campus-navy);
        }

        .summary-cards {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 20px;
        }

        .card {
            background: var(--light-gray);
            padding: 25px;
            border-radius: 8px;
            text-align: center;
            border-top: 3px solid var(--campus-blue);
        }

        .card .label {
            font-size: 0.9rem;
            color: var(--campus-gray);
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .card .value {
            font-size: 2rem;
            font-weight: 700;
            color: var(--campus-navy);
            margin: 10px 0;
        }

        .card .sub {
            font-size: 0.85rem;
            color: var(--campus-gray);
        }

        .chart-container {
            margin: 20px 0;
        }

        .chart-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
        }

        @media (max-width: 900px) {
            .chart-row {
                grid-template-columns: 1fr;
            }
            .nav {
                justify-content: center;
            }
        }

        .info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 20px;
            margin: 20px 0;
        }

        .info-card {
            background: var(--light-gray);
            padding: 20px;
            border-radius: 8px;
        }

        .info-card h4 {
            color: var(--campus-navy);
            margin-bottom: 10px;
            font-size: 1rem;
        }

        .info-card ul {
            margin-left: 15px;
            font-size: 0.9rem;
        }

        .info-card.highlight {
            border-left: 4px solid var(--campus-gold);
        }

        table {
            width: 100%;
            border-collapse: collapse;
            font-size: 0.9rem;
        }

        th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid var(--border-gray);
        }

        th {
            background: var(--light-gray);
            font-weight: 600;
            color: var(--campus-navy);
            position: sticky;
            top: 60px;
        }

        tr:hover {
            background: #FAFAFA;
        }

        .num {
            text-align: right;
            font-family: 'SF Mono', Monaco, monospace;
        }

        .table-container {
            max-height: 500px;
            overflow-y: auto;
        }

        .tableau-container {
            margin: 20px 0;
        }

        .tableau-container iframe {
            border: 1px solid var(--border-gray);
            border-radius: 8px;
        }

        footer {
            background: var(--campus-navy);
            color: white;
            padding: 30px;
            margin-top: 30px;
        }

        footer .container {
            text-align: center;
        }

        footer a {
            color: var(--campus-gold);
        }

        footer p {
            margin: 10px 0;
            font-size: 0.9rem;
        }

        .footer-links {
            display: flex;
            justify-content: center;
            gap: 30px;
            flex-wrap: wrap;
            margin-bottom: 20px;
        }

        code {
            background: rgba(0,0,0,0.05);
            padding: 2px 6px;
            border-radius: 4px;
            font-family: 'SF Mono', Monaco, monospace;
            font-size: 0.9em;
        }

        @media print {
            .nav {
                display: none;
            }
            .section {
                break-inside: avoid;
                box-shadow: none;
                border: 1px solid var(--border-gray);
            }
            .chart-row {
                grid-template-columns: 1fr;
            }
            footer {
                background: white;
                color: var(--campus-navy);
                border-top: 2px solid var(--campus-navy);
            }
            .tableau-container {
                display: none;
            }
        }
    </style>
</head>
<body>
    <header>
        <div class="container">
            <h1>${escapeHtml(content.reportTitle || content.campusName + ' eScholarship Report')}</h1>
            <div class="subtitle">${escapeHtml(content.reportSubtitle || 'Repository Analytics')}</div>
        </div>
    </header>

    <div class="container">
        <nav class="nav">
            <a href="#about">About eScholarship</a>
            <a href="#summary">Snapshot</a>
            <a href="#oa-policy">UC OA Policy</a>
            <a href="#publishing">Publishing</a>
            <a href="#sources">Content Sources</a>
            <a href="#discovery">Discovery</a>
            ${(charts.deposits || charts.requests) ? '<a href="#units">Unit Performance</a>' : ''}
            ${(charts.distribution || charts.stacked) ? '<a href="#engagement">Engagement</a>' : ''}
            ${mergedUnits.length > 0 ? '<a href="#data">Data Tables</a>' : ''}
        </nav>

        <!-- About eScholarship Section -->
        <section class="section" id="about">
            <h2>About eScholarship</h2>
            <p>${content.aboutContent || '<strong><a href="https://escholarship.org/" target="_blank">eScholarship</a></strong> is UC\'s institutional repository and Open Access publishing platform.'}</p>
            ${content.aboutPublishing ? `<p>${content.aboutPublishing}</p>` : ''}
            ${content.aboutRepository ? `<p>${content.aboutRepository}</p>` : ''}
            ${content.aboutCdl ? `<p>${content.aboutCdl}</p>` : ''}
            <p>
                <a href="${escapeHtml(content.campusEscholarshipUrl || '#')}" class="dashboard-link" target="_blank">
                    Visit ${escapeHtml(content.campusName || 'Campus')} on eScholarship
                </a>
            </p>
        </section>

        <!-- Snapshot Section -->
        <section class="section" id="summary">
            <h2>Snapshot of ${escapeHtml(content.campusName)} on eScholarship</h2>
            <div class="summary-cards">
                <div class="card">
                    <div class="label">Total Deposits</div>
                    <div class="value">${formatNumber(stats.totalDeposits)}</div>
                    <div class="sub">All-time submissions</div>
                </div>
                <div class="card">
                    <div class="label">Total Requests</div>
                    <div class="value">${formatLargeNumber(stats.totalRequests)}</div>
                    <div class="sub">Downloads + Views</div>
                </div>
                <div class="card">
                    <div class="label">Research Units</div>
                    <div class="value">${formatNumber(stats.unitCount)}</div>
                    <div class="sub">Active units</div>
                </div>
                <div class="card">
                    <div class="label">Journals</div>
                    <div class="value">${formatNumber(stats.journalCount)}</div>
                    <div class="sub">Published on eScholarship</div>
                </div>
            </div>
            <div class="highlight-box">
                <h4>${content.snapshotHighlight?.title || 'Viewing Live Statistics'}</h4>
                <p>${content.snapshotHighlight?.content || `Live data links are available in the footer. <strong>Tip:</strong> You can view live statistics for any eScholarship unit by adding <code>/stats</code> after the unit URL (e.g., <code>escholarship.org/uc/${content.campusCode}/stats</code>).`}</p>
                ${content.snapshotHighlight?.learnMoreUrl ? `<p><a href="${escapeHtml(content.snapshotHighlight.learnMoreUrl)}" target="_blank">${escapeHtml(content.snapshotHighlight.learnMoreText || 'Learn more')}</a></p>` : ''}
            </div>
        </section>

        <!-- UC OA Policy Section -->
        <section class="section" id="oa-policy">
            <h2>UC Open Access Policies</h2>
            <p>${content.oaPolicyContent || 'UC Open Access Policies cover <strong>scholarly articles</strong> and allow UC employees to retain rights in their work by granting the University a non-exclusive license to exercise rights under copyright, including distribution and display.'}</p>
            <p>${content.oaPolicyTypes || '<strong>Publication Types Covered:</strong> The default covered types include journal articles, book chapters, and conference papers. Authors may deposit other materials they consider scholarly articles in their discipline.'}</p>
            ${content.oaPolicyUrl ? `<p><a href="${escapeHtml(content.oaPolicyUrl)}" target="_blank">${escapeHtml(content.oaPolicyLinkText || 'Learn more about UC Open Access Policies')}</a></p>` : ''}

            ${content.ucpmsHighlight ? `
            <div class="highlight-box">
                <h4>${escapeHtml(content.ucpmsHighlight.title)}</h4>
                <p>${content.ucpmsHighlight.content}</p>
                ${content.ucpmsHighlight.loginUrl ? `<p><a href="${escapeHtml(content.ucpmsHighlight.loginUrl)}" class="dashboard-link" target="_blank">${escapeHtml(content.ucpmsHighlight.loginText || 'Log in to UCPMS')}</a></p>` : ''}
            </div>
            ` : ''}
        </section>

        <!-- Publishing Services Section -->
        <section class="section" id="publishing">
            <h2>eScholarship Publishing Services</h2>
            <p>${content.publishingContent || 'eScholarship offers publishing and production tools as well as professional support and consulting services for journals, preprints, monographs, conference proceedings, and other UC-affiliated original scholarship. eScholarship\'s Diamond Open Access publishing program includes 90+ UC affiliated academic journals.'}</p>

            ${content.campusJournals && content.campusJournals.length > 0 ? `
            <h3>${escapeHtml(content.campusName)} Journals on eScholarship</h3>
            <div class="info-grid">
                ${content.campusJournals.map(journal => `
                <div class="info-card highlight">
                    <h4>${escapeHtml(journal.category || 'Journal')}</h4>
                    <ul>
                        ${journal.items ? journal.items.map(item => `<li>${item}</li>`).join('') : `<li><a href="${escapeHtml(journal.url || '#')}" target="_blank"><strong>${escapeHtml(journal.name)}</strong></a></li>`}
                    </ul>
                </div>
                `).join('')}
            </div>
            ` : ''}

            <p>
                <a href="${escapeHtml(content.campusJournalsUrl || '#')}" class="dashboard-link" target="_blank">
                    Browse All ${escapeHtml(content.campusName)} Journals on eScholarship
                </a>
            </p>
        </section>

        <!-- Content Sources Section -->
        <section class="section" id="sources">
            <h2>Content Sources</h2>
            <p>${content.contentSourcesIntro || 'Content enters eScholarship through multiple pathways. <a href="https://help.escholarship.org/support/solutions/articles/9000131194-how-content-enters-escholarship" target="_blank">Learn more</a>'}</p>

            <div class="info-grid">
                ${(content.contentSources || []).map(source => `
                <div class="info-card">
                    <h4>${escapeHtml(source.title)}</h4>
                    <ul>
                        ${source.items.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>
                `).join('')}
            </div>
        </section>

        <!-- Discovery and Visibility Section -->
        <section class="section" id="discovery">
            <h2>Discovery and Visibility</h2>
            <p>${content.discoveryIntro || 'eScholarship content is indexed by major search engines, academic databases, and library systems for maximum discoverability. <a href="https://help.escholarship.org/support/solutions/articles/9000198952-understanding-usage-statistics" target="_blank">Learn more</a>'}</p>

            <div class="info-grid">
                ${(content.discoveryChannels || []).map(channel => `
                <div class="info-card">
                    <h4>${escapeHtml(channel.title)}</h4>
                    <ul>
                        ${channel.items.map(item => `<li>${escapeHtml(item)}</li>`).join('')}
                    </ul>
                </div>
                `).join('')}
            </div>

            ${content.articleMetricsHighlight ? `
            <div class="highlight-box">
                <h4>${escapeHtml(content.articleMetricsHighlight.title)}</h4>
                ${content.articleMetricsHighlight.content.map(p => `<p>${p}</p>`).join('')}
                <p>
                    ${content.articleMetricsHighlight.exampleUrl ? `<a href="${escapeHtml(content.articleMetricsHighlight.exampleUrl)}" target="_blank">${escapeHtml(content.articleMetricsHighlight.exampleText)}</a>` : ''}
                    ${content.articleMetricsHighlight.exampleUrl && content.articleMetricsHighlight.learnMoreUrl ? ' | ' : ''}
                    ${content.articleMetricsHighlight.learnMoreUrl ? `<a href="${escapeHtml(content.articleMetricsHighlight.learnMoreUrl)}" target="_blank">${escapeHtml(content.articleMetricsHighlight.learnMoreText)}</a>` : ''}
                </p>
            </div>
            ` : ''}
        </section>

        ${(charts.deposits || charts.requests) ? `
        <!-- Unit Performance Section -->
        <section class="section" id="units">
            <h2>Unit Performance</h2>
            ${content.unitPerformanceHighlight ? `
            <div class="highlight-box">
                <h4>${escapeHtml(content.unitPerformanceHighlight.title)}</h4>
                ${content.unitPerformanceHighlight.content.map(p => `<p>${p}</p>`).join('')}
                ${content.unitPerformanceHighlight.learnMoreUrl ? `<p><a href="${escapeHtml(content.unitPerformanceHighlight.learnMoreUrl)}" target="_blank">${escapeHtml(content.unitPerformanceHighlight.learnMoreText)}</a></p>` : ''}
            </div>
            ` : ''}
            ${charts.deposits ? '<div class="chart-container" id="chart-deposits"></div>' : ''}
            ${charts.requests ? '<div class="chart-container" id="chart-requests"></div>' : ''}
        </section>
        ` : ''}

        ${(charts.distribution || charts.stacked) ? `
        <!-- Engagement Section -->
        <section class="section" id="engagement">
            <h2>Engagement Analysis</h2>
            ${charts.distribution ? '<div class="chart-container" id="chart-donut"></div>' : ''}
            ${charts.depositsVsRequests ? '<div class="chart-container" id="chart-engagement"></div>' : ''}
            ${charts.stacked ? '<div class="chart-container" id="chart-stacked"></div>' : ''}
        </section>
        ` : ''}

        ${mergedUnits.length > 0 ? `
        <!-- Data Tables Section -->
        <section class="section" id="data">
            <h2>Complete Data by Unit</h2>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Unit</th>
                            <th class="num">Deposits</th>
                            <th class="num">Total Requests</th>
                            <th class="num">Downloads</th>
                            <th class="num">View-only</th>
                            <th class="num">Download %</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${mergedUnits.map(u => `
                        <tr>
                            <td>${escapeHtml(u.name)}</td>
                            <td class="num">${formatNumber(u.totalDeposits)}</td>
                            <td class="num">${formatNumber(u.totalRequests)}</td>
                            <td class="num">${formatNumber(u.downloads)}</td>
                            <td class="num">${formatNumber(u.viewOnly)}</td>
                            <td class="num">${u.downloadPercent}%</td>
                        </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>

            ${content.tableauDashboard ? `
            <h3>UC Campus OA Policy Implementation Dashboard</h3>
            <p>${content.tableauDashboard.intro}</p>
            <div class='tableauPlaceholder' id='viz-tableau' style='position: relative; margin: 20px 0;'>
                <noscript>
                    <a href='${content.tableauDashboard.fullUrl}'>
                        <img alt='UC Campus OA Policy Dashboard' src='${content.tableauDashboard.staticImage}' style='border: none; width: 100%;' />
                    </a>
                </noscript>
                <object class='tableauViz' style='display:none;'>
                    <param name='host_url' value='https%3A%2F%2Fpublic.tableau.com%2F' />
                    <param name='embed_code_version' value='3' />
                    <param name='site_root' value='' />
                    <param name='name' value='${content.tableauDashboard.vizName}' />
                    <param name='tabs' value='no' />
                    <param name='toolbar' value='yes' />
                    <param name='static_image' value='${content.tableauDashboard.staticImage}' />
                    <param name='animate_transition' value='yes' />
                    <param name='display_static_image' value='yes' />
                    <param name='display_spinner' value='yes' />
                    <param name='display_overlay' value='yes' />
                    <param name='display_count' value='yes' />
                    <param name='language' value='en-US' />
                </object>
            </div>
            <p style="text-align: center; font-size: 0.9rem;">
                <a href="${content.tableauDashboard.fullUrl}" target="_blank">
                    ${escapeHtml(content.tableauDashboard.fullUrlText || 'Open full dashboard in new tab')}
                </a>
            </p>
            ` : ''}
        </section>
        ` : ''}
    </div>

    <footer>
        <div class="container">
            <div class="footer-links">
                ${content.breakdownByUnitUrl ? `<a href="${escapeHtml(content.breakdownByUnitUrl)}" target="_blank">Breakdown by Unit (Live)</a>` : ''}
                ${content.historyByUnitUrl ? `<a href="${escapeHtml(content.historyByUnitUrl)}" target="_blank">History by Unit (Live)</a>` : ''}
                ${content.depositsByUnitUrl ? `<a href="${escapeHtml(content.depositsByUnitUrl)}" target="_blank">Deposits by Unit (Live)</a>` : ''}
            </div>
            ${content.footerNote ? `<p style="font-size: 0.8rem; opacity: 0.8;">${escapeHtml(content.footerNote)}</p>` : ''}
            <p>Generated on ${escapeHtml(content.generatedDate || new Date().toLocaleDateString())}${content.creditName ? ' | ' + escapeHtml(content.creditName) : ''}</p>
            ${content.creatorName ? `<p>Created by ${escapeHtml(content.creatorName)}${content.creatorTitle ? ', ' + escapeHtml(content.creatorTitle) : ''}</p>` : ''}
            <p><a href="${escapeHtml(content.campusEscholarshipUrl || '#')}" target="_blank">escholarship.org/uc/${escapeHtml(content.campusCode)}</a></p>
        </div>
    </footer>

    <script>
        // Chart configurations
        const chartConfig = {
            responsive: true,
            displayModeBar: true,
            modeBarButtonsToRemove: ['lasso2d', 'select2d'],
            displaylogo: false,
            toImageButtonOptions: {
                format: 'png',
                filename: '${content.campusCode || 'uc'}_chart',
                height: 600,
                width: 1000,
                scale: 2
            }
        };

        // Render charts (matching original UCR report structure)
        // Unit Performance section
        ${charts.deposits ? `
        Plotly.newPlot('chart-deposits', ${JSON.stringify(charts.deposits.data)}, ${JSON.stringify(charts.deposits.layout)}, chartConfig);
        ` : ''}

        ${charts.requests ? `
        Plotly.newPlot('chart-requests', ${JSON.stringify(charts.requests.data)}, ${JSON.stringify(charts.requests.layout)}, chartConfig);
        ` : ''}

        // Engagement section
        ${charts.distribution ? `
        Plotly.newPlot('chart-donut', ${JSON.stringify(charts.distribution.data)}, ${JSON.stringify(charts.distribution.layout)}, chartConfig);
        ` : ''}

        ${charts.depositsVsRequests ? `
        Plotly.newPlot('chart-engagement', ${JSON.stringify(charts.depositsVsRequests.data)}, ${JSON.stringify(charts.depositsVsRequests.layout)}, chartConfig);
        ` : ''}

        ${charts.stacked ? `
        Plotly.newPlot('chart-stacked', ${JSON.stringify(charts.stacked.data)}, ${JSON.stringify(charts.stacked.layout)}, chartConfig);
        ` : ''}

        // Initialize Tableau visualization
        ${content.tableauDashboard ? `
        (function() {
            var divElement = document.getElementById('viz-tableau');
            if (divElement) {
                var vizElement = divElement.getElementsByTagName('object')[0];
                if (vizElement) {
                    if (divElement.offsetWidth > 800) {
                        vizElement.style.width = '100%';
                        vizElement.style.height = (divElement.offsetWidth * 0.75) + 'px';
                    } else if (divElement.offsetWidth > 500) {
                        vizElement.style.width = '100%';
                        vizElement.style.height = (divElement.offsetWidth * 0.75) + 'px';
                    } else {
                        vizElement.style.width = '100%';
                        vizElement.style.height = '727px';
                    }
                    var scriptElement = document.createElement('script');
                    scriptElement.src = 'https://public.tableau.com/javascripts/api/viz_v1.js';
                    vizElement.parentNode.insertBefore(scriptElement, vizElement);
                }
            }
        })();
        ` : ''}
    </script>
</body>
</html>`;
};

/**
 * Escape HTML special characters
 * @param {string} str - String to escape
 * @returns {string} Escaped string
 */
const escapeHtml = (str) => {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

/**
 * Format a number with commas
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
const formatNumber = (num) => {
  if (!num && num !== 0) return '0';
  return num.toLocaleString();
};

/**
 * Format large numbers with abbreviations (e.g., 14.7M)
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
const formatLargeNumber = (num) => {
  if (!num && num !== 0) return '0';
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toLocaleString();
};
