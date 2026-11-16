/* Study Companion: all dates, plans and syllabus content live here.
   To update the site, edit this file and push. Dates are YYYY-MM-DD, or YYYY-MM when only the month is known.
   st: "confirmed" = published by the exam board / organiser; "expected" = usual pattern or a school's calendar. */
window.STUDY = {
  updated: "2026-11-16",

  students: {
    a: { label: "MK", yr: "Year 12", school: "Arcadia British School", track: "Edexcel International A Level · Maths, Physics, Chemistry", goal: "Astrophysics at Princeton or Rutgers–New Brunswick, entry fall 2028" },
    b: { label: "ZK", yr: "Year 7", school: "Sunmarke School", track: "Key Stage 3 · strong in Maths", goal: "Excel in maths now; US university entry fall 2033" }
  },

  cats: { school: "School", exam: "Exams", sat: "SAT / PSAT", apply: "Applications", comp: "Competitions", mile: "Milestone" },

  sources: {
    pearson:   { name: "Pearson Edexcel: International A Level January 2027 and May/June 2027 final timetables", url: "https://qualifications.pearson.com/en/support/support-topics/exams/exam-timetables.html" },
    pearsonkd: { name: "IAL entry deadlines and results days (Pearson key dates, as summarised by AfterKelas)", url: "https://www.afterkelas.com/blog/edexcel-ial-timetable" },
    cb:        { name: "College Board: SAT dates and deadlines, 2026–27 and anticipated 2027–28", url: "https://satsuite.collegeboard.org/sat/dates-deadlines" },
    cbschool:  { name: "College Board: in-school testing windows (PSAT/NMSQT, PSAT 8/9, PSAT 10)", url: "https://satsuite.collegeboard.org/digital/digital-testing/dates-deadlines" },
    princeton: { name: "Princeton: standardized testing policy (testing required from the 2027–28 cycle)", url: "https://admission.princeton.edu/apply/standardized-testing" },
    princetonD:{ name: "Princeton: application deadlines (single-choice early action 1 Nov, regular 1 Jan, current cycle)", url: "https://admission.princeton.edu" },
    rutgers:   { name: "Rutgers–New Brunswick: application dates and deadlines", url: "https://admissions.rutgers.edu/apply/dates-deadlines/new-brunswick" },
    rutgersA:  { name: "Rutgers Department of Physics and Astronomy: astrophysics major", url: "https://physics.rutgers.edu/academics/undergraduate-program/majors/major-in-astrophysics" },
    khda:      { name: "KHDA: academic calendar for Dubai private schools 2026–27", url: "https://web.khda.gov.ae/en/Resources/academic-calendar-dubai-private-schools" },
    maa:       { name: "MAA American Mathematics Competitions (AMC 8: 21–27 Jan 2027)", url: "https://www.maa.org/AMC" },
    ukmt:      { name: "UKMT: Junior and Intermediate Mathematical Challenges (2027 dates from UK school calendars)", url: "https://ukmt.org.uk" },
    commonapp: { name: "Common App", url: "https://www.commonapp.org" }
  },

  events: [
    // School calendar (both)
    { id: "term1end", d: "2026-12-11", who: ["a","b"], cat: "school", t: "Last day of term 1", st: "expected", src: "khda", note: "KHDA framework date; each school confirms its own." },
    { id: "winter", d: "2026-12-14", end: "2027-01-03", who: ["a","b"], cat: "school", t: "Winter break", st: "confirmed", src: "khda" },
    { d: "2027-01-04", who: ["a","b"], cat: "school", t: "Term 2 begins", st: "confirmed", src: "khda" },
    { d: "2027-04-05", end: "2027-04-11", who: ["a","b"], cat: "school", t: "Spring break", st: "confirmed", src: "khda" },
    { d: "2027-07-02", who: ["a","b"], cat: "school", t: "Last day of the school year", st: "confirmed", src: "khda" },

    // Year 12: school and exams
    { d: "2026-12", who: ["a"], cat: "mile", t: "School Physics review", st: "expected", src: null, note: "Bring marked Physics practice to show steady improvement before this point." },
    { d: "2027-01-08", end: "2027-01-25", who: ["a"], cat: "exam", opt: true, t: "Edexcel IAL January series", st: "confirmed", src: "pearson", note: "Only if the school entered units for January (entries closed 16 Oct 2026)." },
    { d: "2027-03-04", who: ["a"], cat: "exam", opt: true, t: "January series results", st: "confirmed", src: "pearsonkd", note: "Only relevant if January units were sat." },
    { d: "2027-03-21", who: ["a"], cat: "exam", t: "Pearson entry deadline for May/June 2027", st: "confirmed", src: "pearsonkd", note: "The school's own deadline is earlier: confirm every AS unit is entered." },
    { d: "2027-05-04", end: "2027-06-10", who: ["a"], cat: "exam", t: "Edexcel IAL May/June series", st: "confirmed", src: "pearson" },
    { id: "asresults", d: "2027-08-12", who: ["a"], cat: "exam", t: "AS results day", st: "confirmed", src: "pearsonkd" },
    { d: "2027-10", who: ["a"], cat: "exam", t: "October 2027 series (optional resits)", st: "expected", src: "pearson", note: "Pearson publishes these dates later." },
    { d: "2028-01", who: ["a"], cat: "exam", t: "January 2028 series: A2 units or resits", st: "expected", src: "pearson" },
    { id: "a2", d: "2028-05", who: ["a"], cat: "exam", t: "May/June 2028: final A Level (A2) exams", st: "expected", src: "pearson" },
    { d: "2028-08", who: ["a"], cat: "exam", t: "A Level results", st: "expected", src: "pearson" },

    // Year 12: SAT
    { d: "2027-02-19", who: ["a"], cat: "sat", t: "SAT registration deadline for 6 March", st: "confirmed", src: "cb", note: "Late registration until 23 Feb. Dubai seats go early: register in January." },
    { id: "sat1", d: "2027-03-06", who: ["a"], cat: "sat", t: "SAT: first sitting", st: "confirmed", src: "cb" },
    { d: "2027-05-21", who: ["a"], cat: "sat", t: "SAT registration deadline for 5 June", st: "confirmed", src: "cb", note: "Late registration until 25 May." },
    { id: "sat2", d: "2027-06-05", who: ["a"], cat: "sat", t: "SAT: second sitting", st: "confirmed", src: "cb" },
    { d: "2027-08-28", who: ["a"], cat: "sat", t: "SAT: optional third sitting", st: "expected", src: "cb", note: "College Board's anticipated date." },
    { d: "2027-10-02", who: ["a"], cat: "sat", t: "SAT: last sitting before 1 November deadlines", st: "expected", src: "cb", note: "College Board's anticipated date. Only if a higher score is still needed." },

    // Year 12: applications
    { d: "2027-02", who: ["a"], cat: "apply", t: "Summer Science Program (astrophysics) applications usually close", st: "expected", src: null, note: "Check summerscience.org for this year's deadline and eligibility." },
    { d: "2027-06", who: ["a"], cat: "apply", t: "Ask Maths and Physics teachers for US recommendation letters", st: "expected", src: null, note: "Before the summer holiday, so letters are ready for September." },
    { d: "2027-08-01", who: ["a"], cat: "apply", t: "Common App opens for fall 2028 entry", st: "expected", src: "commonapp" },
    { d: "2027-10-01", who: ["a"], cat: "apply", t: "Financial aid forms open (CSS Profile, FAFSA)", st: "expected", src: null },
    { id: "ea", d: "2027-11-01", who: ["a"], cat: "apply", t: "Princeton single-choice early action and Rutgers early action deadline", st: "expected", src: "princetonD", note: "Same date as this cycle. Princeton's early plan still allows early applications to public universities such as Rutgers." },
    { d: "2027-12-01", who: ["a"], cat: "apply", t: "Rutgers regular decision deadline", st: "expected", src: "rutgers" },
    { d: "2027-12", who: ["a"], cat: "apply", t: "Princeton early action decisions (mid-December)", st: "expected", src: "princetonD" },
    { d: "2028-01-01", who: ["a"], cat: "apply", t: "Princeton regular decision deadline", st: "expected", src: "princetonD" },
    { d: "2028-01-31", who: ["a"], cat: "apply", t: "Rutgers early action decisions", st: "expected", src: "rutgers" },
    { d: "2028-05-01", who: ["a"], cat: "apply", t: "Reply deadline: choose a university", st: "expected", src: null },

    // Year 7: competitions and long-term milestones
    { id: "amcreg", d: "2027-01-05", who: ["b"], cat: "comp", t: "AMC 8: centre registration deadline", st: "confirmed", src: "maa", note: "Families enter through an approved AMC centre (a school or test centre in Dubai). Ask well before this date." },
    { id: "amc8", d: "2027-01-21", end: "2027-01-27", who: ["b"], cat: "comp", t: "AMC 8 competition window", st: "confirmed", src: "maa", note: "Each centre picks its day inside the window." },
    { id: "imc", d: "2027-01-27", who: ["b"], cat: "comp", t: "UKMT Intermediate Mathematical Challenge (stretch)", st: "expected", src: "ukmt", note: "Optional for a strong Year 7. Ask whether Sunmarke enters UKMT challenges." },
    { id: "jmc", d: "2027-04-27", who: ["b"], cat: "comp", t: "UKMT Junior Mathematical Challenge", st: "expected", src: "ukmt", note: "Main competition for Year 7. Entered through the school." },
    { d: "2027-06", who: ["b"], cat: "comp", t: "Junior Kangaroo / Junior Mathematical Olympiad (by invitation)", st: "expected", src: "ukmt", note: "Invitations go to top JMC scorers." },
    { id: "amc8y8", d: "2028-01", who: ["b"], cat: "comp", t: "AMC 8 (Year 8)", st: "expected", src: "maa" },
    { d: "2028-10", who: ["b"], cat: "sat", t: "PSAT 8/9 (Year 9)", st: "expected", src: "cbschool", note: "Ask the school or a Dubai test centre." },
    { d: "2029-01", who: ["b"], cat: "comp", t: "AMC 8: last eligible year (Year 9)", st: "expected", src: "maa" },
    { d: "2029-11", who: ["b"], cat: "comp", t: "AMC 10 (Year 10)", st: "expected", src: "maa" },
    { d: "2031-05", who: ["b"], cat: "exam", t: "IGCSE exams (Year 11)", st: "expected", src: null },
    { d: "2031-10", who: ["b"], cat: "sat", t: "PSAT/NMSQT: the National Merit year (Year 12)", st: "expected", src: "cbschool", note: "Check eligibility rules for students studying abroad." },
    { d: "2032-03", who: ["b"], cat: "sat", t: "First SAT sitting (Year 12)", st: "expected", src: "cb" },
    { d: "2032-11", who: ["b"], cat: "apply", t: "US early application deadlines (Year 13)", st: "expected", src: null },
    { d: "2033-08", who: ["b"], cat: "mile", t: "University starts", st: "expected", src: null }
  ],

  // Overview countdown: the first four that have not finished are shown. "asfirst" is the first AS paper.
  countdown: [
    { id: "asfirst", l: "AS exams begin", s: "MK" },
    { id: "sat1", l: "First SAT", s: "register by 19 Feb" },
    { id: "amc8", l: "AMC 8 window", s: "ZK" },
    { id: "jmc", l: "UKMT Junior Challenge", s: "expected · ZK" },
    { id: "sat2", l: "Second SAT", s: "register by 21 May" },
    { id: "asresults", l: "AS results", s: "MK" },
    { id: "ea", l: "Early applications due", s: "Princeton and Rutgers · expected" },
    { id: "amc8y8", l: "AMC 8 (Year 8)", s: "expected · ZK" },
    { id: "a2", l: "A2 exams", s: "expected · MK" }
  ],

  // Marked past papers, November 2026. Grades for single papers are judged against Pearson's raw boundaries.
  assessment: {
    asOf: "2026-11-16",
    chemPapers: [
      { paper: "Initial assessment paper", pct: "55–60%", own: "B (tutor's estimate)" },
      { paper: "Paper P71886A", pct: "55–60%", own: "B (tutor's estimate)" },
      { paper: "January 2024 (P73455A)", score: 47, max: 80, own: "Check Jan 2024 boundaries" },
      { paper: "January 2025 (P78455A)", score: 47, max: 80, own: "B (B 45, A 52 that series)" }
    ],
    juneBounds: [ { s: "June 2023", a: 58, b: 51, c: 44 }, { s: "June 2024", a: 57, b: 51, c: 45 }, { s: "June 2025", a: 64, b: 56, c: 48 }, { s: "June 2026", a: 59, b: 52, c: 45 } ],
    chemCats: [
      { cat: "Quantitative chemistry and formulae", items: [ [ "Jan 2024 Q20 · Moles, titration and bonding", 20, 22 ], [ "Jan 2024 Q21 · Empirical and molecular formula", 9, 9 ], [ "Jan 2025 Q23 · Isotopes and atomic structure", 7, 8 ], [ "Jan 2025 Q24 · Ideal gas equation and alkene formulae", 9, 11 ] ] },
      { cat: "Structure, bonding and shapes", items: [ [ "Jan 2025 Q26 · Dot-and-cross and VSEPR shapes", 9, 15 ], [ "Jan 2025 Q22 · Atomic orbitals and energy levels", 1, 4 ] ] },
      { cat: "Organic chemistry", items: [ [ "Jan 2024 Q18 · Alkenes and isomerism", 2, 10 ], [ "Jan 2024 Q19 · Halogenoalkanes and mechanisms", 6, 13 ], [ "Jan 2025 Q21 · Chloroalkenes and polymers", 6, 11 ], [ "Jan 2025 Q25 · Free-radical substitution and electrophilic addition", 8, 11 ] ] },
      { cat: "Section A multiple choice", items: [ [ "Jan 2024 Q1–20", 10, 20 ], [ "Jan 2025 Q1–20", 7, 20 ] ] },
      { cat: "Left blank", items: [ [ "Jan 2024 Q22 · Ideal gas calculation", 0, 6 ] ] }
    ],
    priorities: [
      { sev: "high", t: "Section A multiple choice", d: "10/20 in Jan 2024, then 7/20 in Jan 2025: a quarter of the paper.", r: "15 timed questions a day. Moving from 7 to 15 is worth 8 marks, about 10% of the paper." },
      { sev: "high", t: "Organic chemistry: isomerism and mechanisms", d: "22/45 across four questions (49%), with isomerism weakest at 2/10. The latest question, 8/11, shows it is improving.", r: "Curly-arrow mechanisms from memory daily; structural and E/Z isomer drills. Reaching 75% here adds about 6 marks a paper." },
      { sev: "med", t: "Shapes and atomic orbitals", d: "VSEPR shapes 9/15; orbitals and energy levels 1/4.", r: "Learn the shape, angle and lone-pair table; s, p and d sub-shell filling and its link to ionisation energy." },
      { sev: "med", t: "Leaving questions blank", d: "Jan 2024 Q22 (6 marks) was left blank, yet the same skill scored well a year later.", r: "Always write the equation and the first step: method marks are given without the final answer." },
      { sev: "low", t: "Physics: moments and projectiles", d: "Grade A overall on the Unit 1 paper.", r: "Take moments about one chosen pivot; resolve v cos θ and v sin θ into separate columns before any equation." }
    ],
    physics: { level: "A", note: "One full Unit 1 paper (WPH11), tutor's grade",
      strengths: [ "Kinematics: suvat and motion graphs", "Momentum and impulse", "Materials: Young modulus, stress and strain" ],
      fixes: [ "Moments and static equilibrium: one pivot, clockwise = anticlockwise", "Projectiles: horizontal and vertical components kept separate" ] },
    maths: { level: "A", note: "Statistics S1 (WST01), tutor's grade",
      strengths: [ "Probability and discrete distributions", "Normal distribution and standardising", "Correlation and regression", "Representing data" ],
      fixes: [ "P1 and P2 not yet assessed: get a P1 paper marked next" ] },
    zk: {
      paper: "zk1",
      asOf: "2026-11-16",
      sections: { A: "Decimals, rounding and estimation", B: "Order of operations and negatives", C: "Factors, primes, HCF and LCM", D: "Algebra: expanding and solving", E: "Fractions", F: "Percentages and multipliers", Exam: "Exam challenge (IGCSE)" },
      strengths: [ "Decimals and place value: all of Q1–3 correct", "Negatives and substitution: 7 and 32 in Q7", "Forming and solving equations: Q9, Q20, Q21", "Expanding brackets with negative signs: Q19(a)", "A clever percentage method: 17.5% = 20% − 2.5%" ],
      priorities: [
        { sev: "high", t: "Percentage changes one after another", d: "Q33 and Q35 both took the second percentage from the original price instead of the new one.", r: "Use multipliers: 640 × 1.25 × 1.05 = 840. The overall change is the product (× 1.3125 = +31.25%), not 25% + 5%." },
        { sev: "high", t: "Finish every part", d: "Stopped before the final answer in Q6, Q14, Q19(b), Q23, Q25, Q27, Q32 and Q34.", r: "Underline what is asked, box each final answer, and tick each part off before moving on." },
        { sev: "med", t: "Factors, HCF and LCM", d: "Section C was mostly not tried; Q14 used lists of multiples, which is too slow for big numbers.", r: "Factor trees and index form: HCF takes the lower power of each shared prime, LCM the higher power of every prime." },
        { sev: "med", t: "Fractions: multiplying and 'of'", d: "Q25 changed everything to 24ths before multiplying.", r: "To multiply: improper fractions, cancel, multiply. Common denominators are only for adding and subtracting." },
        { sev: "low", t: "Checking arithmetic and copying", d: "630 − 72.5 written as 558.5, 45 − 13.5 as 32.5, and 2688 copied as 2668.", r: "Check every subtraction by adding back, and copy the final number from the working letter by letter." },
        { sev: "low", t: "Finish the sheet", d: "15 questions are not tried yet, including the 11-mark exam challenge.", r: "Do Q36 and the rest of sections C and E first, then the exam challenge last: timed, then marked with the mark scheme." }
      ]
    },
    baseline: {
      "WCH11:0": 2, "WCH11:1": 1, "WCH11:2": 2, "WCH11:3": 0, "WCH11:5": 1, "WCH11:6": 1, "WCH11:7": 0, "WCH11:8": 1, "WCH11:9": 1,
      "WPH11:0": 2, "WPH11:1": 1, "WPH11:3": 1, "WPH11:4": 2, "WPH11:7": 2,
      "WST01:0": 2, "WST01:1": 2, "WST01:2": 2, "WST01:3": 2, "WST01:4": 2, "WST01:5": 2, "WST01:6": 2
    }
  },

  alevel: {
    defaultRoute: "S1",
    note: "Sessions are as listed in Pearson's final timetable. The school confirms local start times in Dubai.",
    papers: [
      { d: "2027-05-05", s: "PM", subj: "Chemistry",   unit: "Unit 1", code: "WCH11", title: "Structure, Bonding and Introduction to Organic Chemistry", dur: "1h 30m" },
      { d: "2027-05-06", s: "PM", subj: "Mathematics", unit: "P1",     code: "WMA11", title: "Pure Mathematics 1", dur: "1h 30m" },
      { d: "2027-05-07", s: "AM", subj: "Physics",     unit: "Unit 1", code: "WPH11", title: "Mechanics and Materials", dur: "1h 30m" },
      { d: "2027-05-07", s: "PM", subj: "Mathematics", unit: "S1",     code: "WST01", title: "Statistics 1", dur: "1h 30m", opt: "S1" },
      { d: "2027-05-10", s: "PM", subj: "Chemistry",   unit: "Unit 2", code: "WCH12", title: "Energetics, Group Chemistry, Halogenoalkanes and Alcohols", dur: "1h 30m" },
      { d: "2027-05-11", s: "PM", subj: "Mathematics", unit: "P2",     code: "WMA12", title: "Pure Mathematics 2", dur: "1h 30m" },
      { d: "2027-05-12", s: "PM", subj: "Physics",     unit: "Unit 2", code: "WPH12", title: "Waves and Electricity", dur: "1h 30m" },
      { d: "2027-05-13", s: "PM", subj: "Mathematics", unit: "M1",     code: "WME01", title: "Mechanics 1", dur: "1h 30m", opt: "M1" },
      { d: "2027-05-19", s: "PM", subj: "Physics",     unit: "Unit 3", code: "WPH13", title: "Practical Skills in Physics I", dur: "1h 20m" },
      { d: "2027-05-21", s: "PM", subj: "Chemistry",   unit: "Unit 3", code: "WCH13", title: "Practical Skills in Chemistry I", dur: "1h 20m" }
    ],
    as: [
      { code: "WPH11", subj: "Physics", unit: "Unit 1", title: "Mechanics and Materials", topics: [
        "Motion: suvat, displacement–time and velocity–time graphs", "Projectiles", "Forces, free-body diagrams and Newton's laws",
        "Moments and centre of gravity", "Momentum and its conservation (one dimension)", "Work, energy, power and efficiency",
        "Fluids: density, upthrust, viscosity, Stokes' law, terminal velocity", "Materials: Hooke's law, stress, strain, Young modulus" ] },
      { code: "WPH12", subj: "Physics", unit: "Unit 2", title: "Waves and Electricity", topics: [
        "Progressive waves: speed, frequency, phase, path difference", "Superposition and standing waves", "Refraction and total internal reflection",
        "Diffraction, interference and diffraction gratings", "Polarisation", "Photoelectric effect and the photon model",
        "Energy levels, line spectra and electron diffraction", "Current, charge and drift velocity", "Resistance, resistivity and I–V graphs",
        "Series and parallel circuits; potential dividers", "EMF and internal resistance" ] },
      { code: "WPH13", subj: "Physics", unit: "Unit 3", title: "Practical Skills in Physics I", topics: [
        "Planning an experiment and controlling variables", "Choosing instruments and measuring well", "Uncertainties and percentage uncertainty",
        "Graphs: plotting, gradients, linearising equations", "Core practicals from Units 1 and 2" ] },
      { code: "WMA11", subj: "Mathematics", unit: "P1", title: "Pure Mathematics 1", topics: [
        "Indices and surds", "Quadratic functions and the discriminant", "Equations and inequalities", "Sketching curves",
        "Transformations of graphs", "Straight-line graphs", "Trigonometry: sine rule, cosine rule, area", "Radian measure: arcs and sectors",
        "Differentiation", "Integration" ] },
      { code: "WMA12", subj: "Mathematics", unit: "P2", title: "Pure Mathematics 2", topics: [
        "Algebraic division, factor theorem and proof", "Coordinate geometry of circles", "Exponentials and logarithms", "Binomial expansion",
        "Sequences and series (arithmetic and geometric)", "Trigonometric identities and equations", "Differentiation: stationary points",
        "Integration: definite integrals, areas, trapezium rule" ] },
      { code: "WME01", subj: "Mathematics", unit: "M1", title: "Mechanics 1", opt: "M1", topics: [
        "Modelling assumptions", "Vectors in mechanics", "Constant acceleration and travel graphs", "Vertical motion under gravity",
        "Newton's laws, connected particles and pulleys", "Friction", "Momentum and impulse", "Statics of a particle", "Moments" ] },
      { code: "WST01", subj: "Mathematics", unit: "S1", title: "Statistics 1", opt: "S1", topics: [
        "Modelling with statistics", "Measures of location and spread", "Box plots, histograms and outliers", "Probability",
        "Correlation and regression", "Discrete random variables", "The normal distribution" ] },
      { code: "WCH11", subj: "Chemistry", unit: "Unit 1", title: "Structure, Bonding and Introduction to Organic Chemistry", topics: [
        "Moles, concentration, yield and atom economy", "Ideal gas equation (pV = nRT) and unit conversions", "Atomic structure, isotopes and mass spectra", "Electronic configuration and ionisation energies",
        "Periodicity", "Ionic bonding", "Covalent and metallic bonding; shapes of molecules", "Organic naming and isomerism",
        "Alkanes and fuels", "Alkenes and addition polymers" ] },
      { code: "WCH12", subj: "Chemistry", unit: "Unit 2", title: "Energetics, Group Chemistry, Halogenoalkanes and Alcohols", topics: [
        "Enthalpy changes, Hess's law and bond enthalpies", "Intermolecular forces", "Redox and oxidation numbers", "Group 2 chemistry",
        "Group 7 (halogen) chemistry", "Kinetics: collision theory and Maxwell–Boltzmann", "Equilibrium and Le Chatelier", "Halogenoalkanes",
        "Alcohols", "Mass spectrometry and infrared spectroscopy" ] },
      { code: "WCH13", subj: "Chemistry", unit: "Unit 3", title: "Practical Skills in Chemistry I", topics: [
        "Practical techniques and safety", "Titrations and their calculations", "Tests for ions and functional groups",
        "Uncertainties and evaluating a method", "Core practicals from Units 1 and 2" ] }
    ],
    a2: [
      { code: "WPH15", subj: "Physics", unit: "Unit 5", title: "Thermodynamics, Radiation, Oscillations and Cosmology", star: "Astrophysics and cosmology", topics: [
        "Specific heat capacity and latent heat", "Ideal gases and kinetic theory", "Radioactive decay and half-life", "Simple harmonic motion and resonance",
        "Gravitational fields and orbits", "Stars: luminosity, Hertzsprung–Russell diagram, distances", "Redshift, Hubble's law and the expanding universe" ] },
      { code: "WPH14", subj: "Physics", unit: "Unit 4", title: "Further Mechanics, Fields and Particles", topics: [
        "Momentum in two dimensions and collisions", "Circular motion", "Electric fields", "Capacitors", "Magnetic fields and electromagnetic induction",
        "Particle physics: accelerators, detectors, the standard model" ] },
      { code: "WMA13", subj: "Mathematics", unit: "P3", title: "Pure Mathematics 3", topics: [
        "Functions: composite, inverse, modulus", "Trigonometry: sec, cosec, cot; compound angles; R cos(x ± α)", "Exponentials and natural logarithms",
        "Chain, product and quotient rules", "Integration of standard functions", "Numerical methods: iteration and Newton–Raphson" ] },
      { code: "WMA14", subj: "Mathematics", unit: "P4", title: "Pure Mathematics 4", topics: [
        "Proof by contradiction", "Partial fractions", "Binomial expansion for any rational n", "Parametric equations",
        "Implicit differentiation", "Integration by substitution and by parts", "Differential equations", "Vectors: lines in three dimensions" ] },
      { code: "WCH14", subj: "Chemistry", unit: "Unit 4", title: "Rates, Equilibria and Further Organic Chemistry", topics: [
        "Rate equations, orders and mechanisms", "Lattice energy, Born–Haber cycles and entropy", "Equilibrium constants Kc and Kp",
        "Acids, bases, pH and buffers", "Carbonyls, carboxylic acids and their derivatives" ] },
      { code: "WCH15", subj: "Chemistry", unit: "Unit 5", title: "Transition Metals and Organic Nitrogen Chemistry", topics: [
        "Electrode potentials and redox", "Transition metals and complex ions", "Arenes and benzene", "Amines, amides and amino acids",
        "Organic synthesis and analysis" ] }
    ]
  },

  sat: {
    sittings: [
      { d: "2026-12-05", reg: "2026-11-20", late: "2026-11-24", plan: "Skip", why: "Too soon to prepare. Use a free practice test as a baseline instead." },
      { d: "2027-03-06", reg: "2027-02-19", late: "2027-02-23", plan: "Recommended", why: "First sitting, about eight weeks before AS exams." },
      { d: "2027-05-01", reg: "2027-04-16", late: "2027-04-20", plan: "Skip", why: "Three days before AS exams begin." },
      { d: "2027-06-05", reg: "2027-05-21", late: "2027-05-25", plan: "Recommended", why: "Second sitting, two weeks after the last AS paper." },
      { d: "2027-08-28", plan: "Optional", why: "Anticipated date. Deadlines are published later." },
      { d: "2027-10-02", plan: "Optional", why: "Anticipated. Last sitting before 1 November early deadlines." }
    ],
    targets: [
      { y: 1530, label: "Princeton median 1530" },
      { y: 1410, label: "Rutgers–NB ≈1410" }
    ]
  },

  plans: {
    a: [
      { from: "2026-11-16", to: "2026-12-11", title: "Chemistry push, Physics polish",
        hours: { Chemistry: 4.5, Physics: 3, Maths: 2.5, SAT: 0.5 },
        focus: [ "Chemistry Section A: 15 timed multiple-choice questions a day from past papers, one minute each; write one line on why each wrong answer was wrong.",
                 "Organic chemistry: draw one mechanism from memory each day (free-radical substitution, electrophilic addition) and practise structural and E/Z isomers.",
                 "Shapes and orbitals: learn the VSEPR table with lone pairs and bond angles, and s/p/d orbital filling.",
                 "Never leave a question blank: write the formula and the first step; method marks add up.",
                 "Physics: one Unit 1 question set a week on moments and projectiles; bring marked work to the December review.",
                 "Maths: S1 is exam-ready, so keep it warm with one paper a fortnight and get a P1 paper marked next.",
                 "Take one free Bluebook SAT practice test to set a baseline." ] },
      { from: "2026-12-14", to: "2027-01-03", title: "Winter break: consolidate",
        hours: { Physics: 5, Maths: 4, Chemistry: 4, SAT: 2 },
        focus: [ "Two timed Chemistry Unit 1 papers (June series, the harder boundaries) and one Physics Unit 1 paper; P1 practice.",
                 "Start an error log: every lost mark, why it was lost, and the fix.",
                 "A second Bluebook test; confirm the SAT plan (6 March and 5 June).",
                 "Keep at least four full days off." ] },
      { from: "2027-01-04", to: "2027-03-06", title: "Term 2 build and first SAT",
        hours: { Physics: 4, Maths: 3, Chemistry: 3, SAT: 3.5 },
        focus: [ "Finish AS content as it is taught; a short topic test each week.",
                 "SAT: one Reading and Writing set a day and a full Bluebook test every two weeks.",
                 "Register for the 6 March SAT in January (deadline 19 February).",
                 "Check with the exams office that every AS unit is entered (Pearson deadline 21 March)." ] },
      { from: "2027-03-07", to: "2027-04-11", title: "Past-paper season",
        hours: { Physics: 4, Maths: 3.5, Chemistry: 3.5, SAT: 1 },
        focus: [ "Two timed past papers a week, rotating subjects; mark them with the mark scheme and read the examiner's report.",
                 "Register for the 5 June SAT (deadline 21 May).",
                 "Spring break (5–11 April): a mock week, every AS paper under exam conditions." ] },
      { from: "2027-04-12", to: "2027-05-04", title: "Exam run-in",
        hours: { Physics: 5, Maths: 4.5, Chemistry: 4.5, SAT: 0 },
        focus: [ "Go back over every 'Shaky' topic and redo the questions in the error log.",
                 "Short daily recall sessions rather than long re-reading.",
                 "Protect sleep and exercise." ] },
      { from: "2027-05-05", to: "2027-05-21", title: "AS exams",
        hours: { Physics: 4, Maths: 4, Chemistry: 4, SAT: 0 },
        focus: [ "The night before a paper: formulae, definitions and the error log only.",
                 "After each paper, move on to the next one." ] },
      { from: "2027-05-22", to: "2027-06-05", title: "SAT sprint",
        hours: { SAT: 10 },
        focus: [ "A full practice test every three or four days, then review every miss.",
                 "Math: use the built-in Desmos calculator fluently. Reading and Writing: grammar rules and timing." ] },
      { from: "2027-06-06", to: "2027-08-31", title: "Summer: profile and applications",
        hours: { Physics: 1, Maths: 1, SAT: 2, Applications: 4 },
        focus: [ "Ask the Maths and Physics teachers for US recommendation letters before 2 July.",
                 "An astrophysics project, for example analysing TESS light curves in Python, written up.",
                 "Draft the Common App personal essay (650 words).",
                 "Decide on a third SAT (28 August or 2 October) once the June score is in.",
                 "AS results on 12 August: plan Year 13 and any resits." ] },
      { from: "2027-09-01", to: "2027-11-01", title: "Year 13: applications",
        hours: { Physics: 4, Maths: 3, Chemistry: 3, SAT: 1, Applications: 3 },
        focus: [ "Final SAT on 2 October only if it is still needed.",
                 "Princeton single-choice early action and Rutgers early action by 1 November.",
                 "Physics Unit 5 covers stars and cosmology: link it to the application." ] }
    ],
    b: [
      { from: "2026-11-16", to: "2026-12-11", title: "Find the level",
        hours: { Problems: 1, Course: 1, Papers: 1 },
        focus: [ "Do one past Junior Mathematical Challenge paper without a time limit, then mark it together.",
                 "Ask the maths teacher about extension work, and whether Sunmarke enters UKMT challenges and the AMC 8.",
                 "NRICH problems twice a week.",
                 "Find an AMC 8 centre in Dubai: centre registration closes 5 January." ] },
      { from: "2026-12-14", to: "2027-01-27", title: "AMC 8 preparation",
        hours: { Problems: 1, Course: 1, Papers: 2 },
        focus: [ "Past AMC 8 papers (free on the AoPS wiki): 25 questions in 40 minutes.",
                 "Keep a 'tricks' notebook: every new idea from a solution goes in.",
                 "The AMC 8 is sat on one day between 21 and 27 January." ] },
      { from: "2027-01-28", to: "2027-04-27", title: "UKMT Junior Challenge",
        hours: { Problems: 1, Course: 1.5, Papers: 1 },
        focus: [ "One Junior Challenge past paper every two weeks (60 minutes, 25 questions), reviewed with the official solutions.",
                 "Start AoPS Introduction to Algebra (or Prealgebra if gaps show).",
                 "Alcumus for 15–20 minutes on most days." ] },
      { from: "2027-04-28", to: "2027-07-02", title: "Writing full solutions",
        hours: { Problems: 1, Course: 1, Papers: 0.5, Coding: 0.5 },
        focus: [ "If invited to the Junior Kangaroo or Olympiad, practise writing complete solutions.",
                 "Start Python: 30 minutes a week, from turtle graphics to small maths programs." ] },
      { from: "2027-07-03", to: "2027-08-30", title: "Summer",
        hours: { Problems: 1, Course: 1, Coding: 0.5 },
        focus: [ "A light routine: three short sessions a week.",
                 "One maths book read for fun.",
                 "Look at summer maths programmes for next year (MathPath is for ages 11–14; check current rules)." ] }
    ]
  },

  subjects: {
    a: [ { k: "Physics", c: "#d4ab55" }, { k: "Maths", c: "#5f95e0" }, { k: "Chemistry", c: "#3db3a2" }, { k: "SAT", c: "#9b8fe0" }, { k: "Applications", c: "#d0804f", n: "Applications & projects" } ],
    b: [ { k: "Problems", c: "#d4ab55", n: "Problem solving" }, { k: "Course", c: "#5f95e0", n: "AoPS course / Alcumus" }, { k: "Papers", c: "#3db3a2", n: "Competition papers" }, { k: "Coding", c: "#9b8fe0" } ]
  },

  routineA: [
    [ "Mon–Thu", "Two 45-minute blocks each evening, rotating subjects; Physics gets two blocks in every five" ],
    [ "Friday", "45 minutes of SAT practice (one Reading and Writing set, one Math set)" ],
    [ "Saturday", "One timed past paper (or SAT test) and marking: about two hours" ],
    [ "Sunday", "One hour: error log review and plan the week" ]
  ],
  routineB: [
    [ "Monday", "30 min · NRICH problem or puzzle" ],
    [ "Tuesday", "30 min · AoPS book section" ],
    [ "Wednesday", "20 min · Alcumus" ],
    [ "Thursday", "30 min · Python (from April)" ],
    [ "Saturday", "60 min · competition paper, then go through every miss" ],
    [ "Sunday", "Off, or maths reading for fun" ]
  ],

  competitions: [
    [ "AMC 8", "25 questions · 40 minutes · grade 8 and below (Year 9 and below)", "21–27 Jan 2027", "Through an approved AMC centre; centre registration closes 5 Jan 2027" ],
    [ "UKMT Junior Mathematical Challenge", "25 questions · 60 minutes · Year 8 and below", "Expected 27 Apr 2027", "Through the school" ],
    [ "UKMT Intermediate Mathematical Challenge", "25 questions · 60 minutes · Year 11 and below (a stretch in Year 7)", "Expected 27 Jan 2027", "Through the school" ],
    [ "Junior Kangaroo / Junior Mathematical Olympiad", "Follow-on rounds for top Junior Challenge scorers", "Expected June 2027", "By invitation" ]
  ],

  roadmapB: [
    { yr: "Year 7 · 2026–27", items: [ "Sit the AMC 8 (January) and UKMT Junior Challenge (April)", "Work through AoPS Prealgebra or Introduction to Algebra", "A weekly routine of 3–4 hours of maths beyond school", "Start Python" ] },
    { yr: "Year 8 · 2027–28", items: [ "AMC 8 again: aim for the top 5% (Honor Roll)", "AoPS Introduction to Counting & Probability and Number Theory", "UKMT Junior Challenge: aim for an Olympiad invitation", "A summer maths programme (e.g. MathPath, ages 11–14)" ] },
    { yr: "Year 9 · 2028–29", items: [ "Last AMC 8; first AMC 10 attempt is possible", "PSAT 8/9 in October", "AoPS Introduction to Geometry", "Choose IGCSE options: Maths plus Additional/Further Maths if offered, sciences, Computer Science" ] },
    { yr: "Years 10–11 · 2029–31", items: [ "Top IGCSE grades, especially Maths", "AMC 10 each November", "A sustained project in maths or coding", "Selective summer programmes (e.g. Mathcamp, PROMYS; check age rules)" ] },
    { yr: "Years 12–13 · 2031–33", items: [ "IB Maths: Analysis and Approaches HL (or A Level Maths and Further Maths)", "PSAT/NMSQT in October 2031", "SAT in spring 2032", "US applications in autumn 2032 for fall 2033" ] }
  ],

  profileA: [
    [ "Citizen science", "Classify galaxies or find planets on Zooniverse (Galaxy Zoo, Planet Hunters TESS); keep a log of contributions.", "https://www.zooniverse.org" ],
    [ "A research-style project", "Learn Python, then use the Lightkurve package on public TESS data to find a transit; write a two-page report.", null ],
    [ "Summer Science Program", "A residential astrophysics research programme for rising seniors; applications usually close in February.", "https://summerscience.org" ],
    [ "Olympiads", "Ask whether Arcadia enters the British Physics Olympiad or astronomy rounds.", null ],
    [ "Local astronomy", "Stargazing events and talks with the Dubai Astronomy Group.", null ],
    [ "Reading", "One popular-science astrophysics book a term, with notes to use in essays and interviews.", null ]
  ],

  resourcesA: [
    [ "Pearson qualifications site", "Specifications, past papers, mark schemes and examiner reports", "https://qualifications.pearson.com" ],
    [ "Physics & Maths Tutor", "IAL past papers and questions sorted by topic", "https://www.physicsandmathstutor.com" ],
    [ "Bluebook (College Board)", "Official full-length digital SAT practice tests", "https://bluebook.collegeboard.org" ],
    [ "Khan Academy", "Free official SAT practice and A Level maths revision", "https://www.khanacademy.org" ],
    [ "Princeton: Astrophysical Sciences", "The department behind Princeton's astrophysics concentration", "https://web.astro.princeton.edu" ],
    [ "Rutgers: astrophysics major", "Course requirements, year by year", "https://physics.rutgers.edu/academics/undergraduate-program/majors/major-in-astrophysics" ]
  ],
  resourcesB: [
    [ "NRICH", "Rich problems from the University of Cambridge, free", "https://nrich.maths.org" ],
    [ "UKMT past papers", "Junior and Intermediate Challenge papers with solutions", "https://ukmt.org.uk" ],
    [ "Art of Problem Solving", "Books (Prealgebra, Introduction to Algebra…) and the AMC 8 problem archive on the AoPS wiki", "https://artofproblemsolving.com" ],
    [ "Alcumus", "Free adaptive problem practice from AoPS", "https://artofproblemsolving.com/alcumus" ],
    [ "Khan Academy", "Fill gaps and work ahead through the school syllabus", "https://www.khanacademy.org" ],
    [ "MAA AMC", "Official AMC 8 information", "https://www.maa.org/AMC" ]
  ]
};
