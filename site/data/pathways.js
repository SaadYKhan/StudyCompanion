/* Study Companion: the rules that turn a child's profile into a year-by-year roadmap.
   Nothing here is about one child: each child's profile (school, year, subjects, interests,
   universities) is saved in their own account. Edit this file and push to change the rules.

   An item can have:
     at    years before the final school year it belongs to (0 = final year). A number or [min, max].
     yr    British year numbers [min, max] instead (Year 7 = US grade 6). usg: US grades [min, max].
     once  1 = only in the first matching year on the roadmap.
     g     group: school | tests | apply | grow
     k     key; a date in study.js with the same key and child, in the same school year, is used instead.
     t, n  title and note. n can be { british, ib, american } or { us, intl } (applying as).
     m, d  month and day of the usual date (Aug–Dec fall in the school year's first calendar year;
           after: 1 puts an August date in the summer after the school year, as for results).
     end   { m, d } for a window.  dates: { "<school-year start>": "YYYY-MM-DD" or [start, end] } once published.
     cat   Key dates category.  src: a key in sources.  if: { track, sys, citizen, dest }. */
window.PATHWAYS = {
  checked: "2026-11-26",
  reviewDays: 180,

  sources: {
    commonapp: { name: "Common App: the 2026–27 application opened on 1 August 2026 (it opens on 1 August each year)", url: "https://www.commonapp.org/blog/common-app-opens-application-launch-2026-27-season" },
    fafsa:     { name: "NASFAA: the 2027–28 FAFSA launched on 23 September 2026, ahead of the 1 October requirement", url: "https://www.nasfaa.org/news-item/39879/FSA_Officially_Launches_2027-28_FAFSA" },
    css:       { name: "College Board: CSS Profile opens on 1 October each year", url: "https://cssprofile.collegeboard.org/about" },
    nmsc:      { name: "College Board: taking the PSAT/NMSQT at a school outside the US (contact a local school at least 6 weeks ahead)", url: "https://satsuite.collegeboard.org/psat-nmsqt/taking-the-test/international-registrations" },
    cb:        { name: "College Board: SAT dates and deadlines", url: "https://satsuite.collegeboard.org/sat/dates-deadlines" },
    cbschool:  { name: "College Board: in-school testing windows (PSAT 8/9, PSAT 10, PSAT/NMSQT)", url: "https://satsuite.collegeboard.org/digital/digital-testing/dates-deadlines" },
    ap:        { name: "College Board: 2027 AP exams, 3–7 and 10–14 May", url: "https://apstudents.collegeboard.org/exam-dates" },
    ucas:      { name: "UCAS: 2027 entry dates (15 October 2026; equal consideration 13 January 2027)", url: "https://www.ucas.com/undergraduate/applying-university/ucas-undergraduate-when-apply" },
    ib:        { name: "IB: May 2026 Diploma results released on 6 July 2026", url: "https://ibo.org/news/news-about-the-ib/the-ib-prepares-to-release-diploma-programme-dp-and-career-related-programme-cp-student-examination-results/" },
    pearson:   { name: "Pearson Edexcel: exam timetables", url: "https://qualifications.pearson.com/en/support/support-topics/exams/exam-timetables.html" },
    princeton: { name: "Princeton: standardized testing (SAT or ACT required from the 2027–28 cycle)", url: "https://admission.princeton.edu/apply/standardized-testing" },
    princetonD:{ name: "Princeton: application deadlines (single-choice early action 1 November, regular 1 January)", url: "https://admission.princeton.edu" },
    rutgers:   { name: "Rutgers–New Brunswick: dates and deadlines", url: "https://admissions.rutgers.edu/apply/dates-deadlines/new-brunswick" },
    rutgersRes:{ name: "Rutgers: New Jersey tuition eligibility (domicile for a year before enrolling; dependants follow their parents)", url: "https://admissions.rutgers.edu/paying-for-college/nj-tuition-eligibility" },
    maa:       { name: "MAA American Mathematics Competitions (AMC 8, 10, 12)", url: "https://www.maa.org/AMC" },
    ukmt:      { name: "UKMT: Junior, Intermediate and Senior Mathematical Challenges", url: "https://ukmt.org.uk" },
    ssp:       { name: "Summer Science Program", url: "https://summerscience.org" },
    zooniverse:{ name: "Zooniverse citizen science", url: "https://www.zooniverse.org" },
    aops:      { name: "Art of Problem Solving", url: "https://artofproblemsolving.com" },
    usaco:     { name: "USA Computing Olympiad (online, open internationally)", url: "https://usaco.org" }
  },

  // The school systems a profile can pick. sys decides which school rules apply.
  tracks: [
    { k: "brit", sys: "british", n: "British · IGCSE, then A Level (exam board not chosen yet)", short: "British curriculum" },
    { k: "ial", sys: "british", n: "British · Pearson Edexcel International (IGCSE, International A Level)", short: "Pearson Edexcel International A Level" },
    { k: "cie", sys: "british", n: "British · Cambridge International (IGCSE, A Level)", short: "Cambridge International A Level" },
    { k: "uk",  sys: "british", n: "British · UK boards (GCSE, A Level)", short: "A Level" },
    { k: "ib",  sys: "ib",      n: "International Baccalaureate (MYP, Diploma)", short: "IB Diploma" },
    { k: "us",  sys: "american", n: "American curriculum (high school diploma, AP)", short: "American high school" }
  ],
  // Where each British year sits in the other systems (Year 7 = MYP 1 = Grade 6).
  stageName: {
    british: { 7: "Key Stage 3", 8: "Key Stage 3", 9: "Key Stage 3", 10: "IGCSE year 1", 11: "IGCSE year 2", 12: "Sixth form: first year", 13: "Sixth form: final year" },
    ib: { 7: "MYP 1", 8: "MYP 2", 9: "MYP 3", 10: "MYP 4", 11: "MYP 5", 12: "Diploma year 1", 13: "Diploma year 2" },
    american: { 7: "Middle school", 8: "Middle school", 9: "Middle school", 10: "High school: freshman", 11: "High school: sophomore", 12: "High school: junior", 13: "High school: senior" }
  },

  school: [
    { sys: "british", yr: [7, 8], once: 1, g: "school", t: "Strong foundations in Maths, English and the sciences", n: "Everything later builds on these. Ask for extension work in the strongest subject." },
    { sys: "british", yr: [9, 9], g: "school", k: "options", m: 2, cat: "mile", t: "Choose IGCSE options", n: "Usually in the spring term. The subject check on this page lists what the interests need." },
    { sys: "british", yr: [11, 11], g: "school", k: "sixth", m: 2, cat: "mile", t: "Choose A Level (or IB) subjects", n: "Check university entry requirements before choosing; the subject check lists what the interests need." },
    { sys: "british", yr: [11, 11], g: "school", k: "igcse", m: 5, end: { m: 6, d: 15 }, cat: "exam", t: "IGCSE exams", n: "May to June; the school confirms the timetable." },
    { sys: "british", yr: [11, 11], g: "school", k: "igcse-results", m: 8, after: 1, cat: "exam", t: "IGCSE results" },
    { sys: "british", yr: [12, 12], if: { track: ["ial"] }, g: "school", k: "as-exams", m: 5, end: { m: 6, d: 10 }, cat: "exam", t: "AS units in the May/June series", n: "Pearson also runs January and October series for resits.", src: "pearson" },
    { sys: "british", yr: [12, 12], if: { track: ["ial"] }, g: "school", k: "as-results", m: 8, after: 1, cat: "exam", t: "AS results" },
    { sys: "british", yr: [12, 12], if: { track: ["brit", "cie", "uk"] }, g: "school", k: "y12-exams", m: 6, cat: "exam", t: "End-of-year school exams", n: "Predicted grades are set from these." },
    { sys: "british", yr: [12, 12], g: "school", t: "Predicted grades are set this year", n: "Teachers base them on Year 12 work and exams. UCAS and US applications both use them." },
    { sys: "british", yr: [13, 13], g: "school", k: "a2-exams", m: 5, end: { m: 6, d: 15 }, cat: "exam", t: "Final A Level exams", n: "May to June." },
    { sys: "british", yr: [13, 13], g: "school", k: "al-results", m: 8, after: 1, cat: "exam", t: "A Level results" },

    { sys: "ib", yr: [7, 10], once: 1, g: "school", t: "MYP: build strong habits in every subject group", n: "Keep Maths at the extended level if the school offers it." },
    { sys: "ib", yr: [11, 11], g: "school", t: "MYP Personal Project" },
    { sys: "ib", yr: [11, 11], g: "school", k: "dp-choice", m: 2, cat: "mile", t: "Choose Diploma subjects: three at Higher Level, three at Standard Level", n: "The subject check on this page lists what the interests need." },
    { sys: "ib", yr: [12, 12], g: "school", t: "Diploma year 1: start CAS, plan internal assessments and choose an Extended Essay topic" },
    { sys: "ib", yr: [12, 12], g: "school", t: "Predicted grades are set from Diploma year 1", n: "UCAS and US applications both use them." },
    { sys: "ib", yr: [13, 13], g: "school", t: "Extended Essay, Theory of Knowledge and internal assessments are due", n: "The school sets the deadlines, mostly before the spring." },
    { sys: "ib", yr: [13, 13], g: "school", k: "ib-exams", m: 5, cat: "exam", t: "IB Diploma exams (May session)" },
    { sys: "ib", yr: [13, 13], g: "school", k: "ib-results", m: 7, cat: "exam", t: "IB results", n: "Released on 6 July in 2026; the date is similar each year.", src: "ib" },

    { sys: "american", yr: [8, 9], once: 1, g: "school", t: "Get on a maths track that reaches calculus by Grade 12", n: "Usually Algebra 1 by Grade 8." },
    { sys: "american", yr: [10, 10], g: "school", t: "The GPA starts now: Grade 9 grades are on the transcript" },
    { sys: "american", yr: [11, 13], g: "school", k: "ap", m: 5, end: { m: 5, d: 14 }, dates: { "2026": ["2027-05-03", "2027-05-14"] }, cat: "exam", t: "AP exams", n: "The first two full weeks of May.", src: "ap" },
    { sys: "american", yr: [13, 13], g: "school", t: "Keep grades up: the final transcript goes to the university you choose" }
  ],

  // What each destination asks for, counted back from the final school year.
  dest: {
    us: [
      { at: [5, 9], once: 1, g: "apply", t: "Keep a simple record of activities, awards, books and projects", n: "It becomes the activities list in the application. Five minutes at the end of each term." },
      { at: [4, 9], once: 1, g: "grow", t: "Choose one or two interests to go deep in", n: "US universities look for commitment kept up over several years rather than a long list." },
      { at: 4, g: "tests", k: "psat89", m: 10, cat: "sat", t: "PSAT 8/9 (optional practice)", n: "Ask the school or a test centre.", src: "cbschool" },
      { at: 3, g: "school", t: "Grades from here on are read by US universities", n: { british: "Year 10–11 grades and IGCSE results go on the US application.", ib: "MYP 4–5 and Diploma grades go on the US application.", american: "Grade 9 onwards is on the transcript and in the GPA." } },
      { at: [1, 3], g: "grow", t: "Summer: a programme, project, job or volunteering", n: "Something that builds on the main interest." },
      { at: 2, g: "tests", k: "psat10", m: 10, cat: "sat", t: "PSAT 10 or the October PSAT/NMSQT, as practice (optional)", src: "cbschool" },
      { at: 2, g: "apply", t: "Start a university list and note what each asks for", n: "Courses, testing policy, deadlines and cost. Visit campuses on holidays if possible." },
      { at: 2, g: "grow", t: "Take on responsibility in the activities: lead, organise or teach" },
      { at: 1, g: "tests", k: "psat", m: 10, cat: "sat", t: "PSAT/NMSQT: the National Merit year", src: "nmsc",
        n: { us: "US citizens at schools abroad can enter National Merit. Register through a local school at least six weeks before the October window.", intl: "Practice only: National Merit is for US citizens and permanent residents." } },
      { at: 1, g: "tests", k: "sat1", m: 3, cat: "sat", t: "First SAT (or ACT) sitting", n: "Spring, well before the summer exams.", src: "cb" },
      { at: 1, g: "tests", k: "sat2", m: 6, cat: "sat", t: "Second SAT sitting", n: "Early June leaves the autumn free for applications.", src: "cb" },
      { at: 1, g: "apply", t: "Build a balanced list: reach, target and likely universities", n: "Check each one's testing policy, deadlines and financial aid." },
      { at: 1, g: "apply", k: "recs", m: 6, cat: "apply", t: "Ask two teachers for recommendation letters", n: "Teachers of core subjects who taught this year. Ask before the summer holiday." },
      { at: 1, g: "apply", t: "Summer: draft the Common App essay (650 words) and the activities list" },
      { at: 0, g: "apply", k: "commonapp", m: 8, d: 1, cat: "apply", t: "Common App opens", n: "Drafts made before then carry over.", src: "commonapp" },
      { at: 0, g: "tests", k: "satlast", m: 10, cat: "sat", t: "Last SAT sitting before 1 November deadlines", n: "Only if a higher score is still needed.", src: "cb" },
      { at: 0, g: "apply", k: "aid", m: 10, d: 1, cat: "apply", src: "css",
        t: "Financial aid forms open: FAFSA and CSS Profile", n: { us: "Each university sets its own aid deadlines, often close to the application deadline.", intl: "International students usually file the CSS Profile; the FAFSA is for US citizens and eligible non-citizens." } },
      { at: 0, g: "apply", t: "Send official test scores; ask the school for the transcript, predicted grades and counsellor letter" },
      { at: 0, g: "school", t: "Keep grades up: universities see the mid-year report and final results" },
      { at: 0, g: "apply", k: "may1", m: 5, d: 1, cat: "apply", t: "Reply deadline: choose a university", n: "1 May is the usual US reply date." }
    ],
    uk: [
      { at: [3, 9], once: 1, g: "school", t: "IGCSE and GCSE grades matter to UK universities", n: "Competitive courses look closely at them." },
      { at: 2, g: "school", t: "Choose sixth-form subjects that fit the courses", n: "Check entry requirements on the course pages before choosing." },
      { at: 1, g: "apply", t: "Research courses and entry requirements on UCAS", src: "ucas" },
      { at: 1, g: "grow", t: "Reading beyond the syllabus, and a summer school or project in the subject" },
      { at: 1, g: "apply", k: "ucas-open", m: 5, dates: { "2025": "2026-05-12" }, cat: "apply", t: "UCAS applications open", n: "Registration opens in May; finished applications can be sent from early September.", src: "ucas" },
      { at: 1, g: "tests", t: "Check whether the courses need an admissions test", n: "For example ESAT, TMUA, the Oxford tests or UCAT. Registration is usually in the summer; most are sat in the autumn." },
      { at: 1, g: "apply", t: "Summer: draft the UCAS personal statement", n: "It now answers three set questions." },
      { at: 0, g: "apply", t: "Interviews for some courses, November to January" },
      { at: 0, g: "apply", k: "ucas-reply", m: 5, cat: "apply", t: "Reply to UCAS offers", n: "The exact reply date depends on when the last decision arrives." }
    ]
  },

  // Applying-to rounds a profile can pick for a university not in the list below.
  rounds: [
    { k: "ed", n: "Early decision (binding)", c: "us", m: 11, d: 1, note: "Binding: if admitted, you must attend and withdraw other applications. Only one early decision application is allowed." },
    { k: "ea", n: "Early action", c: "us", m: 11, d: 1, note: "Non-binding." },
    { k: "rd", n: "Regular decision", c: "us", m: 1, d: 1 },
    { k: "uk-oct", n: "UCAS October deadline (Oxford, Cambridge, medicine, dentistry, veterinary)", c: "uk", m: 10, d: 15, dates: { "2026": "2026-10-15" }, src: "ucas" },
    { k: "uk-jan", n: "UCAS January deadline (most courses)", c: "uk", m: 1, dates: { "2026": "2027-01-13" }, src: "ucas" },
    { k: "other", n: "Its own deadline", c: "other" }
  ],

  // Universities with their rules checked. Any other university can be added in the profile.
  unis: {
    princeton: {
      n: "Princeton University", short: "Princeton", c: "us", checked: "2026-11-19", src: "princetonD",
      rounds: {
        early: { n: "Single-choice early action", m: 11, d: 1, dec: "Early action decisions (mid-December)", decM: 12, note: "Non-binding. No early applications to other private universities; early applications to public universities such as Rutgers are allowed." },
        rd: { n: "Regular decision", m: 1, d: 1, dec: "Regular decisions (late March)", decM: 3 }
      },
      testing: "SAT or ACT required from the 2027–28 cycle (fall 2028 entry), with no minimum score", testSrc: "princeton",
      rows: [["Testing deadline", "October SAT for early action; December for regular decision"]],
      scores: "Middle 50% of enrolled students who sent scores: 1490–1560, median 1530 (fall 2025)",
      prog: { astro: ["Department of Astrophysical Sciences", "https://web.astro.princeton.edu"] }
    },
    rutgers: {
      n: "Rutgers University–New Brunswick", short: "Rutgers–NB", c: "us", checked: "2026-11-26", src: "rutgers",
      rounds: {
        early: { n: "Early action", m: 11, d: 1, dec: "Early action decisions (by 31 January)", decM: 1, decD: 31, note: "Non-binding." },
        rd: { n: "Regular decision", m: 12, d: 1, note: "One of the earliest regular deadlines." }
      },
      testing: "Test-optional for fall 2027 entry; the policy for later years is not yet announced", testSrc: "rutgers",
      rows: [["Application", "Common App or the Rutgers application"]],
      scores: "Section medians of students who sent scores: about 690 Reading and Writing, 720 Math",
      prog: { astro: ["Astrophysics major, Department of Physics and Astronomy", "https://physics.rutgers.edu/academics/undergraduate-program/majors/major-in-astrophysics"] },
      extra: [ { at: 1, if: { citizen: "us" }, g: "apply", t: "Check New Jersey in-state tuition eligibility for Rutgers", src: "rutgersRes",
        n: "In-state tuition needs New Jersey domicile for at least a year before enrolling; dependent students are presumed to share their parents' domicile. Confirm with Rutgers well before applying." } ]
    }
  },

  // Interests: the subjects they need, and what to do along the way.
  interests: [
    { k: "astro", n: "Astrophysics and space",
      needs: { british: [["math", "Mathematics"], ["phys", "Physics"]], ib: [["math", "Mathematics: Analysis and Approaches HL"], ["phys", "Physics HL"]], american: [["calc", "Calculus"], ["phys", "Physics"]] },
      rec: { british: "Further Mathematics too, if the school offers it", ib: "Both at Higher Level", american: "AP Calculus BC and AP Physics C" },
      gap: "Astrophysics courses expect it. Talk to the school, or show it another way: AP Physics 1 or AP Physics C exams at an AP test centre in May, plus a physics project.",
      items: [
        { at: [4, 9], once: 1, g: "grow", t: "Learn the night sky and follow a space mission; one popular-science book a term" },
        { at: [2, 5], once: 1, g: "grow", t: "Start Python: it is the everyday tool of astronomers" },
        { at: [1, 3], once: 1, g: "grow", t: "Citizen science on Zooniverse (Galaxy Zoo, Planet Hunters TESS), with a log of contributions", src: "zooniverse" },
        { at: 1, g: "grow", t: "A research-style project: find a planet transit in public TESS data with Python (Lightkurve) and write it up" },
        { at: 1, g: "apply", k: "ssp", m: 2, cat: "apply", t: "Summer Science Program (astrophysics) applications usually close", n: "A residential research programme for rising seniors; check this year's deadline and eligibility.", src: "ssp" },
        { at: [0, 1], once: 1, g: "grow", t: "Ask whether the school enters physics olympiad rounds (for example the British Physics Olympiad)" },
        { at: 0, g: "apply", t: "Let the application show the astrophysics thread: projects, reading and programmes" }
      ],
      ideas: [
        ["Citizen science", "Classify galaxies or find planets on Zooniverse; keep a log of contributions.", "https://www.zooniverse.org"],
        ["A research-style project", "Use the Lightkurve package on public TESS data to find a transit; write a two-page report.", null],
        ["Summer Science Program", "A residential astrophysics research programme for rising seniors; applications usually close in February.", "https://summerscience.org"],
        ["Olympiads", "Ask whether the school enters the British Physics Olympiad or astronomy rounds.", null],
        ["Local astronomy", "Stargazing events and talks with a local astronomy group.", null],
        ["Reading", "One popular-science astrophysics book a term, with notes to use in essays and interviews.", null]
      ] },
    { k: "physics", n: "Physics",
      needs: { british: [["math", "Mathematics"], ["phys", "Physics"]], ib: [["math", "Mathematics: Analysis and Approaches HL"], ["phys", "Physics HL"]], american: [["calc", "Calculus"], ["phys", "Physics"]] },
      rec: { british: "Further Mathematics too, if the school offers it", ib: "Both at Higher Level", american: "AP Calculus BC and AP Physics C" },
      gap: "Physics courses expect it. Talk to the school, or show it another way: AP Physics exams at an AP test centre in May.",
      items: [
        { at: [2, 9], once: 1, g: "grow", t: "Build things and measure them: simple experiments, kits, coding a simulation" },
        { at: [0, 1], once: 1, g: "grow", t: "Physics olympiad rounds through the school (for example the British Physics Olympiad)" },
        { at: 1, g: "grow", t: "A summer research programme or a written-up project" }
      ] },
    { k: "maths", n: "Mathematics",
      needs: { british: [["math", "Mathematics"]], ib: [["math", "Mathematics: Analysis and Approaches HL"]], american: [["calc", "Calculus"]] },
      rec: { british: "Further Mathematics too, if the school offers it", ib: "At Higher Level", american: "AP Calculus BC, and Statistics if there is room" },
      gap: "Maths courses expect it at the highest level the school offers.",
      items: [
        { at: [3, 9], once: 1, g: "grow", t: "Problem solving beyond school: Art of Problem Solving books or courses, Alcumus and NRICH", src: "aops" },
        { usg: [6, 8], g: "grow", k: "amc8", m: 1, dates: { "2026": ["2027-01-21", "2027-01-27"] }, cat: "comp", t: "AMC 8", n: "Grade 8 (Year 9) and below; entered through an approved centre.", src: "maa" },
        { usg: [9, 10], g: "grow", k: "amc10", m: 11, cat: "comp", t: "AMC 10", n: "November, through an approved centre.", src: "maa" },
        { usg: [11, 12], g: "grow", k: "amc12", m: 11, cat: "comp", t: "AMC 12", n: "November; high scores qualify for the AIME.", src: "maa" },
        { yr: [7, 8], if: { sys: ["british"] }, g: "grow", k: "jmc", m: 4, cat: "comp", t: "UKMT Junior Mathematical Challenge", n: "Year 8 and below, through the school.", src: "ukmt" },
        { yr: [9, 11], if: { sys: ["british"] }, g: "grow", k: "imc", m: 2, cat: "comp", t: "UKMT Intermediate Mathematical Challenge", n: "Late January or early February, through the school.", src: "ukmt" },
        { yr: [12, 13], if: { sys: ["british"] }, g: "grow", k: "smc", m: 10, cat: "comp", t: "UKMT Senior Mathematical Challenge", n: "Early October, through the school.", src: "ukmt" },
        { at: [2, 5], once: 1, g: "grow", t: "A selective summer maths programme", n: "For example MathPath (ages 11–14), Canada/USA Mathcamp, PROMYS or Ross. Check age rules; applications close early in the year." },
        { at: [0, 2], once: 1, g: "grow", t: "Write full solutions: olympiad rounds by invitation, or a maths project" }
      ] },
    { k: "cs", n: "Computer science",
      needs: { british: [["math", "Mathematics"]], ib: [["math", "Mathematics: Analysis and Approaches HL"]], american: [["calc", "Calculus"]] },
      rec: { british: "Computer Science and Further Mathematics are useful but not usually required", ib: "Computer Science is useful but not usually required", american: "AP Computer Science A" },
      gap: "Computer science courses expect strong maths.",
      items: [
        { at: [3, 9], once: 1, g: "grow", t: "Learn Python: small programs and games, then a project of your own" },
        { at: [1, 3], once: 1, g: "grow", k: "usaco", t: "USACO online contests, from Bronze upwards", n: "Open to students anywhere; contests run in the winter.", src: "usaco" },
        { at: [0, 2], once: 1, g: "grow", t: "Something real that people use: an app, a tool or open-source contributions" }
      ] },
    { k: "eng", n: "Engineering",
      needs: { british: [["math", "Mathematics"], ["phys", "Physics"]], ib: [["math", "Mathematics: Analysis and Approaches HL"], ["phys", "Physics HL"]], american: [["calc", "Calculus"], ["phys", "Physics"]] },
      rec: { british: "Further Mathematics too, if the school offers it", ib: "Both at Higher Level", american: "AP Calculus BC and AP Physics C" },
      gap: "Engineering courses expect it.",
      items: [
        { at: [2, 9], once: 1, g: "grow", t: "Design and build: robotics, electronics kits or CAD" },
        { at: [0, 2], once: 1, g: "grow", t: "A team competition or a project with a real problem to solve" }
      ] },
    { k: "med", n: "Medicine and health",
      needs: { british: [["chem", "Chemistry"], ["bio", "Biology"]], ib: [["chem", "Chemistry HL"], ["bio", "Biology"]], american: [["chem", "Chemistry"], ["bio", "Biology"]] },
      rec: { british: "Most UK medical schools ask for Chemistry, usually with Biology", ib: "Most UK medical schools ask for Chemistry, usually with Biology", american: "In the US, medicine starts after a first degree; any major works with the pre-med courses" },
      gap: "Medical courses expect it.",
      items: [
        { at: [1, 3], once: 1, g: "grow", t: "Volunteering in a care setting, kept up over time" },
        { at: 1, if: { dest: "uk" }, g: "tests", t: "UCAT for UK medicine", n: "Sat in the summer before the final year." },
        { at: [0, 1], once: 1, g: "grow", t: "Work experience or shadowing, and reflection on what it taught you" }
      ] },
    { k: "bio", n: "Biology and life sciences",
      needs: { british: [["chem", "Chemistry"], ["bio", "Biology"]], ib: [["chem", "Chemistry"], ["bio", "Biology HL"]], american: [["chem", "Chemistry"], ["bio", "Biology"]] },
      rec: { british: "Maths helps for quantitative biology", ib: "Maths helps for quantitative biology", american: "AP Biology and AP Chemistry" },
      gap: "Life-science courses expect it.",
      items: [
        { at: [1, 4], once: 1, g: "grow", t: "A lab or field project, and the Biology Olympiad if the school enters it" }
      ] },
    { k: "econ", n: "Economics and business",
      needs: { british: [["math", "Mathematics"]], ib: [["math", "Mathematics"]], american: [["calc", "Calculus"]] },
      rec: { british: "Top economics courses ask for A Level Maths", ib: "Top economics courses prefer Maths at Higher Level", american: "AP Calculus and AP Microeconomics" },
      gap: "Most economics courses expect maths.",
      items: [
        { at: [1, 4], once: 1, g: "grow", t: "Read the news through an economics lens; enter an essay competition" },
        { at: [0, 2], once: 1, g: "grow", t: "Start something: a small business, a society or an investment club" }
      ] },
    { k: "hum", n: "Humanities, law and languages",
      needs: { british: [], ib: [], american: [] },
      rec: { british: "Essay subjects such as English, History or a language", ib: "Essay subjects such as English, History or a language", american: "AP English and History" },
      items: [
        { at: [1, 4], once: 1, g: "grow", t: "Debating, Model UN or an essay competition" },
        { at: [0, 2], once: 1, g: "grow", t: "Wide reading, with notes to use in essays and interviews" }
      ] }
  ]
};
