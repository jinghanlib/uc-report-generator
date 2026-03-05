# UC eScholarship Report Generator

A web-based tool for generating customized eScholarship reports for any UC campus. Create beautiful, data-driven HTML reports with interactive charts and campus-specific branding.

## Features

- **Multi-Campus Support**: Generate reports for any UC campus (Berkeley, UCLA, UCSD, Davis, Irvine, Santa Barbara, Santa Cruz, Riverside, Merced, UCSF)
- **Automatic Data Detection**: Upload CSV files from eScholarship stats pages - the tool automatically detects the file type
- **Interactive Charts**: Plotly.js-powered visualizations including bar charts, donut charts, and stacked charts
- **Tableau Dashboard Integration**: Embedded UC OA Policy Implementation Dashboard
- **Standalone HTML Export**: Export complete reports as single HTML files that work offline
- **Campus Branding**: Automatic color schemes and branding for each UC campus

## Quick Start

### Option 1: Use the Hosted Version

Visit the live app and start generating reports immediately - no installation required!

### Option 2: Run Locally

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/uc-report-generator.git
cd uc-report-generator

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## How to Use

1. **Select Your Campus**: Choose your UC campus from the dropdown
2. **Download Data**: Click "Download Data from eScholarship" to get CSV files from the stats pages
3. **Upload CSV Files**: Drag and drop the downloaded CSV files (auto-detected)
4. **Customize Content**: Edit report title, subtitle, journal count, and attribution
5. **Export**: Click "Export HTML" to download your complete report

## Data Sources

The tool uses CSV data from eScholarship stats pages:

| Data Type | URL Pattern | Charts Generated |
|-----------|-------------|------------------|
| History by Unit | `escholarship.org/uc/{campus}/stats/history_by_unit?range=all` | Requests chart, Distribution, Trends |
| Deposits by Unit | `escholarship.org/uc/{campus}/stats/deposits_by_unit?range=all` | Deposits chart, Comparison charts |
| Breakdown by Unit | `escholarship.org/uc/{campus}/stats/breakdown_by_unit?range=all` | Downloads vs View-only breakdown |

### Campus Codes

| Campus | Code |
|--------|------|
| UC Berkeley | ucb |
| UCLA | ucla |
| UC San Diego | ucsd |
| UC Davis | ucd |
| UC Irvine | uci |
| UC Santa Barbara | ucsb |
| UC Santa Cruz | ucsc |
| UC Riverside | ucr |
| UC Merced | ucm |
| UCSF | ucsf |

---

## Hosting Your Generated Reports

### Option 1: Netlify Drop (Easiest - No Account Required)

The simplest way to host your exported report:

1. **Export your report** by clicking "Export HTML" in the app
2. Go to **[Netlify Drop](https://app.netlify.com/drop)**
3. **Drag and drop** your HTML file onto the page
4. **Done!** Your report is live with a free Netlify URL (e.g., `random-name-123.netlify.app`)

> **Tip**: Create a free Netlify account to claim your site and get a custom subdomain!

### Option 2: GitHub Pages (Free)

1. Create a new GitHub repository
2. Upload your exported HTML file and rename it to `index.html`
3. Go to **Settings > Pages**
4. Select **Deploy from a branch** > **main** > **/ (root)**
5. Click **Save**
6. Your report will be live at `https://username.github.io/repo-name`

### Option 3: Any Web Server

The exported HTML file is completely standalone - just upload it to any web server:
- Your university web server
- Amazon S3
- Google Cloud Storage
- Any file hosting service

---

## Hosting the Full Report Generator App

Want to host the complete app (not just a single report)? Here's how:

### Deploy to Netlify (Recommended)

#### Method A: Connect GitHub (Automatic Deploys)

1. Push this repository to your GitHub account
2. Go to [Netlify](https://app.netlify.com)
3. Click **"Add new site"** > **"Import an existing project"**
4. Connect your GitHub account and select this repository
5. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
6. Click **"Deploy site"**

Every time you push to GitHub, Netlify will automatically rebuild and deploy!

#### Method B: Netlify CLI (Manual Deploy)

```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Build the project
npm run build

# Deploy to Netlify (first time - creates new site)
netlify deploy --prod --dir=dist

# Or login first for more options
netlify login
netlify init
netlify deploy --prod
```

#### Method C: Drag and Drop the Built Folder

1. Run `npm run build` locally
2. Go to [Netlify Drop](https://app.netlify.com/drop)
3. Drag and drop the entire `dist` folder
4. Your app is live!

### Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

### Deploy to GitHub Pages

```bash
# Install gh-pages
npm install -D gh-pages

# Add to package.json scripts:
# "deploy": "npm run build && gh-pages -d dist"

# Deploy
npm run deploy
```

---

## Project Structure

```
uc-report-generator/
├── src/
│   ├── components/       # React components
│   │   ├── CampusSelector.jsx
│   │   ├── DataUploader.jsx
│   │   ├── TextEditor.jsx
│   │   ├── LinkEditor.jsx
│   │   ├── FooterEditor.jsx
│   │   ├── ReportPreview.jsx
│   │   └── ExportButton.jsx
│   ├── data/
│   │   ├── campusColors.js      # UC campus color schemes
│   │   └── defaultContent.js    # Default template content
│   ├── templates/
│   │   └── reportTemplate.js    # HTML report template
│   ├── utils/
│   │   ├── csvParser.js         # CSV parsing & auto-detection
│   │   ├── chartGenerator.js    # Plotly chart configurations
│   │   └── dataFetcher.js       # Data source URLs
│   ├── styles/
│   │   └── index.css            # Tailwind CSS + custom styles
│   ├── App.jsx                  # Main application
│   └── index.jsx                # Entry point
├── dist/                        # Built files (after npm run build)
├── index.html                   # Vite entry point
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## Technologies

- **React 18** - UI framework
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Utility-first styling
- **Plotly.js** - Interactive charts
- **PapaParse** - CSV parsing
- **Tableau Public API** - Dashboard embedding

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this for your own UC campus reports.

## Credits

Developed for UC Libraries to streamline eScholarship reporting.
