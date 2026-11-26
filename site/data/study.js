/* Study Companion: exam dates, term plans and syllabus content live here. Application dates and the
   year-by-year roadmap come from each child's profile and data/pathways.js.
   To update the site, edit this file and push. Dates are YYYY-MM-DD, or YYYY-MM when only the month is known.
   st: "confirmed" = published by the exam board / organiser; "expected" = usual pattern or a school's calendar. */
window.STUDY = {
  updated: "2026-11-19",

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
    commonapp: { name: "Common App", url: "https://www.commonapp.org" },
    physms:    { name: "Pearson: WPH11 Unit 1 June 2021 mark scheme (P66393A), used to re-mark MK's Physics paper", url: "https://qualifications.pearson.com/content/dam/pdf/International%20Advanced%20Level/Physics/2018/Exam-materials/WPH11_01_msc_20210517.pdf" },
    physgb:    { name: "Pearson: IAL grade boundaries (WPH11 June 2022, Oct 2023, Oct 2025)", url: "https://qualifications.pearson.com/content/dam/pdf/Support/Grade-boundaries/International-A-level/2510-ial-subject-grade-boundaries.pdf" }
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
    { d: "2027-05-04", end: "2027-06-10", key: "as-exams", who: ["a"], cat: "exam", t: "Edexcel IAL May/June series", st: "confirmed", src: "pearson" },
    { id: "asresults", key: "as-results", d: "2027-08-12", who: ["a"], cat: "exam", t: "AS results day", st: "confirmed", src: "pearsonkd" },
    { d: "2027-10", who: ["a"], cat: "exam", t: "October 2027 series (optional resits)", st: "expected", src: "pearson", note: "Pearson publishes these dates later." },
    { d: "2028-01", who: ["a"], cat: "exam", t: "January 2028 series: A2 units or resits", st: "expected", src: "pearson" },
    { id: "a2", key: "a2-exams", d: "2028-05", who: ["a"], cat: "exam", t: "May/June 2028: final A Level (A2) exams", st: "expected", src: "pearson" },
    { d: "2028-08", key: "al-results", who: ["a"], cat: "exam", t: "A Level results", st: "expected", src: "pearson" },

    // Year 12: SAT
    { d: "2027-02-19", who: ["a"], cat: "sat", t: "SAT registration deadline for 6 March", st: "confirmed", src: "cb", note: "Late registration until 23 Feb. Dubai seats go early: register in January." },
    { id: "sat1", key: "sat1", d: "2027-03-06", who: ["a"], cat: "sat", t: "SAT: first sitting", st: "confirmed", src: "cb" },
    { d: "2027-05-21", who: ["a"], cat: "sat", t: "SAT registration deadline for 5 June", st: "confirmed", src: "cb", note: "Late registration until 25 May." },
    { id: "sat2", key: "sat2", d: "2027-06-05", who: ["a"], cat: "sat", t: "SAT: second sitting", st: "confirmed", src: "cb" },
    { d: "2027-08-28", who: ["a"], cat: "sat", t: "SAT: optional third sitting", st: "expected", src: "cb", note: "College Board's anticipated date." },
    { d: "2027-10-02", key: "satlast", who: ["a"], cat: "sat", t: "SAT: last sitting before 1 November deadlines", st: "expected", src: "cb", note: "College Board's anticipated date. Only if a higher score is still needed." },

    // Year 7: competitions and long-term milestones
    { id: "amcreg", d: "2027-01-05", who: ["b"], cat: "comp", t: "AMC 8: centre registration deadline", st: "confirmed", src: "maa", note: "Families enter through an approved AMC centre (a school or test centre in Dubai). Ask well before this date." },
    { id: "amc8", key: "amc8", d: "2027-01-21", end: "2027-01-27", who: ["b"], cat: "comp", t: "AMC 8 competition window", st: "confirmed", src: "maa", note: "Each centre picks its day inside the window." },
    { id: "imc", key: "imc", d: "2027-01-27", who: ["b"], cat: "comp", t: "UKMT Intermediate Mathematical Challenge (stretch)", st: "expected", src: "ukmt", note: "Optional for a strong Year 7. Ask whether Sunmarke enters UKMT challenges." },
    { id: "jmc", key: "jmc", d: "2027-04-27", who: ["b"], cat: "comp", t: "UKMT Junior Mathematical Challenge", st: "expected", src: "ukmt", note: "Main competition for Year 7. Entered through the school." },
    { d: "2027-06", who: ["b"], cat: "comp", t: "Junior Kangaroo / Junior Mathematical Olympiad (by invitation)", st: "expected", src: "ukmt", note: "Invitations go to top JMC scorers." }
  ],

  // Overview countdown: the first four that have not finished are shown. "asfirst" is the first AS paper;
  // a "key" picks the next date with that key, including dates the roadmap adds from each child's profile.
  countdown: [
    { id: "asfirst", l: "AS exams begin", s: "MK" },
    { id: "sat1", l: "First SAT", s: "register by 19 Feb" },
    { key: "amc8", l: "AMC 8 window", s: "ZK" },
    { key: "jmc", l: "UKMT Junior Challenge", s: "ZK" },
    { id: "sat2", l: "Second SAT", s: "register by 21 May" },
    { id: "asresults", l: "AS results", s: "MK" },
    { key: "deadline", l: "Next application deadline" },
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
      { sev: "med", t: "Physics: see the Physics card", d: "The June 2021 Physics paper re-marks to 40/80, so Physics needs as much time as Chemistry before the December review.", r: "Work through the Physics priorities alongside these." }
    ],
    physics: {
      paper: "ph21", latest: "ph24", asOf: "2026-11-18", label: "June 2021 paper (P66393A)",
      // Every marked Physics Unit 1 paper, newest first. 'own' = that series' Pearson raw boundaries, when known.
      papers: [
        { id: "ph24", s: "Oct 2024", label: "October 2024 paper (P78391RA)", own: { a: 61, b: 54, c: 47, d: 40, e: 34 }, note: "Q15(b)(ii) and Q19(b)(i) blank; multiple choice 5/10" },
        { id: "ph22", s: "June 2022", label: "June 2022 paper (P70968A)", own: { a: 43, b: 38, c: 33, d: 28, e: 23 }, note: "multiple choice 6/10 (from 2/10); Q16(a) left blank" },
        { id: "ph21", s: "June 2021", label: "June 2021 paper (P66393A)", own: null, note: "tutor's review said 53/80; checked 40/80" }
      ],
      // Tutor's marks (from the review's final summary) next to the marks checked against Pearson's mark scheme.
      rows: [
        { q: "Section A (Q1–10)", topic: "Multiple choice", tutor: 4, max: 10, why: "Q3 and Q9: the review's answer key was wrong; Pearson's answers are C and D" },
        { q: "Q11", topic: "Momentum and collisions", tutor: 6, max: 6, why: "(c) her answer 2.16 × 10⁶ J; correct 6.5 × 10⁴ J. Part (c) is worth 2, not the 6 listed" },
        { q: "Q12", topic: "Trolley on a ramp", tutor: 3, max: 7, why: "(b) using a = 9.81 m s⁻² on a slope meets no marking point" },
        { q: "Q13", topic: "Submarine buoyancy", tutor: 9, max: 9, why: "(b)(ii) 88 800 kg; correct 1.17 × 10⁵ kg pumped out" },
        { q: "Q14", topic: "Ski jump projectile, braking", tutor: 8, max: 8, why: "(a) her distance 31.9 m; correct 32.7 m" },
        { q: "Q15", topic: "Rocket launch (6-marker)", tutor: 2, max: 6, why: "Energy changes and gravity are not on Pearson's list of points" },
        { q: "Q16", topic: "Dragster moments, force", tutor: 5, max: 7, why: "(b) used the weight in N as the mass; correct 6.77 × 10⁴ N" },
        { q: "Q17", topic: "Rope stiffness, pulley", tutor: 10, max: 12, why: "(b)(ii) missed the two rope sections: 1.85 × 10⁻² m" },
        { q: "Q18", topic: "Terminal velocity, Stokes' law", tutor: 6, max: 15, why: "(b) converting to the radius alone scores nothing on Pearson's scheme" }
      ],
      // Raw boundaries for WPH11 (out of 80). The June 2021 boundaries were not found.
      bounds: [ { s: "June 2022", a: 43, b: 38, c: 33, d: 28, e: 23, src: "Pearson" }, { s: "Oct 2023", a: 53, b: 47, c: 42, d: 37, src: "Pearson" }, { s: "Oct 2024", a: 61, b: 54, c: 47, d: 40, e: 34, src: "Pearson" }, { s: "Oct 2025", a: 59, b: 52, c: 46, d: 40, src: "Pearson" }, { s: "June 2026", a: 60, b: 53, c: 46, d: 39, src: "as reported" } ],
      strengths: [ "Single-formula calculations: stress, strain, moments, momentum, F = ma (October 2024: Q12, Q13(a), Q18(a) all full marks)", "Multiple choice up from 2/10 to 5–6/10", "Stokes' law conditions and drag 6πηrv (full marks on all three papers)", "Stress–strain graphs and Young modulus (October 2024 Q18(c)(i))", "Buoyancy and upthrust calculations (June 2021 Q13: 8/9)" ],
      priorities: [
        { sev: "high", t: "Finish every part: about 14 marks a paper", d: "October 2024: Q15(b)(ii) (5) and Q19(b)(i) (2) blank; Q16(b)(ii) stopped two lines from the answer; Q18(b) gave the extension, not the length asked for. June 2022: Q16(a) blank. June 2021: 12 marks blank or stopped early.", r: "Write the next line of every part, and check the final answer is what the question asked for. End every 'deduce' with the comparison and yes or no." },
        { sev: "high", t: "Forces and Newton's laws in explanations", d: "October 2024: added opposite forces (Q15(a)), a resultant force on a floating object (Q16(b)(i)), drag on a stationary object (Q16(a)), and third-law pairs (Q4). 6-markers: 0/6, 0/6, 2/6.", r: "Opposite forces subtract; floating means balanced; a third-law pair is the same type of force on the other object. 6-markers: forces, which is bigger, resultant, acceleration, what changes." },
        { sev: "high", t: "Projectiles and motion graphs", d: "October 2024: Q15(b)(ii) blank, Q19(b) area and gradient of a v–t graph. June 2022: u = 0 for vertical motion. June 2021: g on a slope.", r: "Vertical and horizontal separately. v–t graph: area = displacement, gradient = acceleration (Δv/Δt). s–t² graph: gradient = ½g." },
        { sev: "med", t: "Sanity-check every answer", d: "October 2024: g = 1.0 m s⁻² (0.06 read as 0.6), a 35 cm radius for a 45 cm³ sphere. June 2022: 1.36 N against a stated 4.8 × 10⁻³ N.", r: "One second per answer: is the size sensible? If a 'show that' doesn't match, find the slip." },
        { sev: "med", t: "Moments: each force with its own distance", d: "October 2024 Q10 and Q13(b); June 2022 Q13(b).", r: "Moment = force × its own perpendicular distance to the pivot; then clockwise = anticlockwise." },
        { sev: "low", t: "Energy questions: compare energies, not forces", d: "October 2024 Q17(b) compared forces and used 35 m instead of the 18 m extension; Q6 multiplied by efficiency instead of dividing.", r: "How far does it go? Compare energies. Input power = useful power ÷ efficiency." }
      ]
    },
    maths: { level: "A", paper: "st22", note: "June 2022 S1 paper, checked to Pearson's mark scheme",
      // WST01 raw boundaries out of 75 (Pearson). June 2022 was graded generously; October 2024 is a recent standard.
      bounds: [ { s: "June 2022", a: 48, b: 39, c: 31, d: 23, e: 15 }, { s: "Oct 2024", a: 60, b: 51, c: 43, d: 35, e: 27 } ],
      strengths: [ "Correlation and regression: 12/14 (r, regression line, interpretation, reliability)", "Discrete random variables: E(R²), standard deviation and solving for unknowns, 9/9", "Stem-and-leaf quartiles, outliers, box plot and skewness: 10/11", "Independence and conditional probability: 6/6" ],
      fixes: [ "Conditional normal probability: P(v < V < 104.9) ÷ P(V < 104.9) = 0.2801, then standardise (Q6(c), 6 marks)", "Coding: Var(w) = Var(y) ÷ 0.5², the scale factor is squared (Q3(e)(ii))", "Venn diagrams: subtract overlaps, include the outside region and box; all regions add to 1 (Q4(c))", "Histograms: bar width is proportional to class width (Q3(a))", "Finish the paper: Q3(c)–(d) and Q5(e)–(f) left blank (8 marks)", "P1 and P2 not yet assessed: get a P1 paper marked next" ] },
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
      "WPH11:0": 1, "WPH11:1": 2, "WPH11:2": 0, "WPH11:3": 1, "WPH11:4": 2, "WPH11:5": 1, "WPH11:6": 1, "WPH11:7": 1,
      "WST01:0": 2, "WST01:1": 1, "WST01:2": 1, "WST01:3": 1, "WST01:4": 2, "WST01:5": 2, "WST01:6": 1
    }
  },

  // Key focus areas at the top of the Overview. Each area's score, marks lost and "fixed" count are worked out
  // live from the question log with the filter f (subj, paper, sec, topics, why); a question counts if it matches.
  // "soon" items finish themselves when their questions are all fixed (f) or a score is logged (auto); others are ticked.
  focus: {
    asOf: "2026-11-18",
    by: "2026-12-11",
    a: {
      note: "From her six marked papers: Chemistry January 2024 and January 2025, Physics June 2021, June 2022 and October 2024, Maths S1 June 2022. In order of marks lost; a question can count in more than one area.",
      items: [
        { t: "Finish every question", f: { why: ["blank", "incomplete"] },
          d: "Parts left blank or stopped after a line or two, on every marked paper. This is the biggest single source of lost marks.",
          r: "Write the equation and the first step for every part, even when stuck: method marks do not need the final answer. In a timed paper, mark the question and come back to it before the end." },
        { t: "Multiple choice in both sciences", f: { sec: "A" },
          d: "Chemistry 10/20, then 7/20; Physics 2/10, 6/10, then 5/10. Most misses are concept slips; seven are counting or multiplier slips.",
          r: "Every day: 15 Chemistry and 10 Physics multiple-choice questions, about a minute each, with one line on why each wrong option is wrong. Redo every miss a week later." },
        { t: "Organic chemistry: isomers, alkenes and mechanisms", f: { topics: ["iso", "add", "fuel", "poly"] },
          d: "Structural and E/Z isomers, electrophilic addition, addition polymers, and alkanes and cracking.",
          r: "One mechanism from memory every day with curly arrows (free-radical substitution, electrophilic addition), and five isomer questions a week." },
        { t: "Physics forces and motion", f: { topics: ["force", "kin", "vec", "mo"] },
          d: "Newton's laws, third-law pairs, weight and mass, slopes, moments and motion graphs. The 6-mark explanations scored 0, 0 and 2 out of 6.",
          r: "Draw a free-body diagram before every mechanics question. Newtons ÷ g = kilograms; use g sin θ on a slope. In 6-mark answers, name each force and the Newton's law that applies, in time order." },
        { t: "Mark-scheme wording", f: { why: ["wording"] },
          d: "Right idea, wrong words: σ and π overlap, the two E/Z conditions, free radicals, and what counts as an observation.",
          r: "After every marked paper, copy the mark-scheme phrase for each lost mark into a phrases list, and learn the list word for word." }
      ],
      soon: [
        { id: "ph21", t: "Redo every lost question from the three Physics papers", why: "June 2021, June 2022 and October 2024, before the school's December Physics review", f: { subj: "Physics" } },
        { id: "p1", t: "Sit a Maths P1 paper and get it marked", why: "P1 and P2 have not been assessed yet; S1 is already at grade A" },
        { id: "sat", t: "Take a free Bluebook SAT practice test", why: "Sets her baseline for the 6 March SAT; log the score on the SAT tab", auto: "sat" }
      ]
    },
    b: {
      note: "From his challenge worksheet: 39 questions, marked 16 November 2026. In order of priority.",
      items: [
        { t: "Percentages one after another", f: { topics: ["pct"] },
          d: "Q33 and Q35 took the second percentage from the original price instead of the new one. Q36 and Q39 are not tried yet.",
          r: "Use multipliers: 640 × 1.25 × 1.05 = 840. The overall change is the product (× 1.3125, so +31.25%), not 25% + 5%." },
        { t: "Finish what he starts", f: { why: ["incomplete"] },
          d: "Right method, but stopped before the final answer.",
          r: "Underline what is asked, box each final answer, and tick each part off before moving on." },
        { t: "Fractions: multiplying and 'of'", f: { topics: ["frac"] },
          d: "Q25 changed everything to 24ths before multiplying. Five of the seven fraction questions are not tried yet.",
          r: "To multiply: make improper fractions, cancel, then multiply. Common denominators are only for adding and subtracting." },
        { t: "Factors, primes, HCF and LCM", f: { topics: ["fac"] },
          d: "Six of the seven are not tried yet; Q14 listed multiples, which is too slow for big numbers.",
          r: "Factor trees and index form: HCF takes the lower power of each shared prime, LCM the higher power of every prime." }
      ],
      soon: [
        { id: "zk1", t: "Finish the questions not tried yet", why: "Sections C and E first, then the exam challenge last, timed", f: { why: ["notyet"] } },
        { id: "amc", t: "Find an AMC 8 centre in Dubai", why: "Centre registration closes 5 January; the AMC 8 is sat between 21 and 27 January" },
        { id: "jmc", t: "One past UKMT Junior Mathematical Challenge paper", why: "Untimed, then marked together; log it on the ZK maths tab", auto: "bprac" }
      ]
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
      { from: "2026-11-16", to: "2026-12-11", title: "Chemistry and Physics push",
        hours: { Chemistry: 4, Physics: 4, Maths: 2, SAT: 0.5 },
        focus: [ "Chemistry Section A: 15 timed multiple-choice questions a day from past papers, one minute each; write one line on why each wrong answer was wrong.",
                 "Organic chemistry: draw one mechanism from memory each day (free-radical substitution, electrophilic addition) and practise structural and E/Z isomers.",
                 "Shapes and orbitals: learn the VSEPR table with lone pairs and bond angles, and s/p/d orbital filling.",
                 "Never leave a question blank: write the formula and the first step; method marks add up.",
                 "Physics: 10 Unit 1 multiple-choice questions a day with a reason for each option, and redo every lost question from the June 2021 paper (Question log) before the December review.",
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
