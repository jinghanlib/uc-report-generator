// UC Campus Color Schemes
export const campusColors = {
  berkeley: {
    name: "UC Berkeley",
    code: "ucb",
    primary: "#003262",
    secondary: "#FDB515",
    cssVars: {
      "--campus-blue": "#003262",
      "--campus-gold": "#FDB515",
      "--campus-navy": "#003262"
    }
  },
  ucla: {
    name: "UCLA",
    code: "ucla",
    primary: "#2774AE",
    secondary: "#FFD100",
    cssVars: {
      "--campus-blue": "#2774AE",
      "--campus-gold": "#FFD100",
      "--campus-navy": "#2774AE"
    }
  },
  ucsd: {
    name: "UC San Diego",
    code: "ucsd",
    primary: "#182B49",
    secondary: "#FFCD00",
    cssVars: {
      "--campus-blue": "#182B49",
      "--campus-gold": "#FFCD00",
      "--campus-navy": "#182B49"
    }
  },
  ucdavis: {
    name: "UC Davis",
    code: "ucd",
    primary: "#002855",
    secondary: "#B3A369",
    cssVars: {
      "--campus-blue": "#002855",
      "--campus-gold": "#B3A369",
      "--campus-navy": "#002855"
    }
  },
  ucirvine: {
    name: "UC Irvine",
    code: "uci",
    primary: "#0064A4",
    secondary: "#FFD200",
    cssVars: {
      "--campus-blue": "#0064A4",
      "--campus-gold": "#FFD200",
      "--campus-navy": "#0064A4"
    }
  },
  ucsb: {
    name: "UC Santa Barbara",
    code: "ucsb",
    primary: "#003660",
    secondary: "#FEBC11",
    cssVars: {
      "--campus-blue": "#003660",
      "--campus-gold": "#FEBC11",
      "--campus-navy": "#003660"
    }
  },
  ucsc: {
    name: "UC Santa Cruz",
    code: "ucsc",
    primary: "#003C6C",
    secondary: "#FDC700",
    cssVars: {
      "--campus-blue": "#003C6C",
      "--campus-gold": "#FDC700",
      "--campus-navy": "#003C6C"
    }
  },
  ucr: {
    name: "UC Riverside",
    code: "ucr",
    primary: "#003066",
    secondary: "#F1AB00",
    cssVars: {
      "--campus-blue": "#2D6CC0",
      "--campus-gold": "#F1AB00",
      "--campus-navy": "#003066"
    }
  },
  ucmerced: {
    name: "UC Merced",
    code: "ucm",
    primary: "#002856",
    secondary: "#DAA900",
    cssVars: {
      "--campus-blue": "#002856",
      "--campus-gold": "#DAA900",
      "--campus-navy": "#002856"
    }
  },
  ucsf: {
    name: "UCSF",
    code: "ucsf",
    primary: "#052049",
    secondary: "#18A3AC",
    cssVars: {
      "--campus-blue": "#052049",
      "--campus-teal": "#18A3AC",
      "--campus-navy": "#052049",
      "--campus-gold": "#18A3AC"
    }
  }
};

// Get list of campuses for dropdown
export const campusList = Object.entries(campusColors).map(([key, value]) => ({
  id: key,
  name: value.name,
  code: value.code
}));

// Get default campus
export const defaultCampus = "ucr";
