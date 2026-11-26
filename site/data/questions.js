/* Question log reference data: topics and mistake types used to group marked questions.
   The marked papers and questions themselves now live in each family's database and arrive from /api/data;
   the site fills QLOG.papers and QLOG.q at sign-in. */
window.QLOG = {
  updated: "2026-11-19",

  papers: {},


  topics: {
    moles: { n: "Moles and calculations", who: "a", subj: "Chemistry", chk: "WCH11:0" },
    gas:   { n: "Ideal gas equation", who: "a", subj: "Chemistry", chk: "WCH11:1" },
    atom:  { n: "Atomic structure and mass spectra", who: "a", subj: "Chemistry", chk: "WCH11:2" },
    orb:   { n: "Orbitals and ionisation energies", who: "a", subj: "Chemistry", chk: "WCH11:3" },
    trend: { n: "Periodic trends and radii", who: "a", subj: "Chemistry", chk: "WCH11:4" },
    ionic: { n: "Ionic bonding and polarisation", who: "a", subj: "Chemistry", chk: "WCH11:5" },
    bond:  { n: "Covalent and metallic bonding", who: "a", subj: "Chemistry", chk: "WCH11:6" },
    shape: { n: "Shapes and polarity (VSEPR)", who: "a", subj: "Chemistry", chk: "WCH11:6" },
    imf:   { n: "Intermolecular forces", who: "a", subj: "Chemistry", chk: "WCH11:6" },
    iso:   { n: "Naming, formulae and isomerism", who: "a", subj: "Chemistry", chk: "WCH11:7" },
    fuel:  { n: "Alkanes, fuels and cracking", who: "a", subj: "Chemistry", chk: "WCH11:8" },
    frs:   { n: "Free-radical substitution", who: "a", subj: "Chemistry", chk: "WCH11:8" },
    add:   { n: "Alkenes and electrophilic addition", who: "a", subj: "Chemistry", chk: "WCH11:9" },
    poly:  { n: "Addition polymers", who: "a", subj: "Chemistry", chk: "WCH11:9" },
    prac:  { n: "Practical and applied chemistry", who: "a", subj: "Chemistry", chk: null },
    kin:   { n: "Kinematics (suvat and graphs)", who: "a", subj: "Physics", chk: "WPH11:0" },
    vec:   { n: "Scalars, vectors and forces", who: "a", subj: "Physics", chk: "WPH11:2" },
    force: { n: "Newton's laws and forces", who: "a", subj: "Physics", chk: "WPH11:2" },
    energy:{ n: "Work, energy and power", who: "a", subj: "Physics", chk: "WPH11:5" },
    fluid: { n: "Fluids: upthrust, drag, viscosity", who: "a", subj: "Physics", chk: "WPH11:6" },
    mom:   { n: "Momentum and impulse", who: "a", subj: "Physics", chk: "WPH11:4" },
    mat:   { n: "Materials", who: "a", subj: "Physics", chk: "WPH11:7" },
    mo:    { n: "Moments and equilibrium", who: "a", subj: "Physics", chk: "WPH11:3" },
    proj:  { n: "Projectiles", who: "a", subj: "Physics", chk: "WPH11:1" },
    stats: { n: "Statistics S1", who: "a", subj: "Maths", chk: null },
    s1spread: { n: "S1: location, spread and coding", who: "a", subj: "Maths", chk: "WST01:1" },
    s1plots:  { n: "S1: box plots, histograms and outliers", who: "a", subj: "Maths", chk: "WST01:2" },
    s1prob:   { n: "S1: probability and Venn diagrams", who: "a", subj: "Maths", chk: "WST01:3" },
    s1corr:   { n: "S1: correlation and regression", who: "a", subj: "Maths", chk: "WST01:4" },
    s1drv:    { n: "S1: discrete random variables", who: "a", subj: "Maths", chk: "WST01:5" },
    s1norm:   { n: "S1: the normal distribution", who: "a", subj: "Maths", chk: "WST01:6" },
    dec:   { n: "Decimals and estimation", who: "b", subj: "Maths", chk: null },
    neg:   { n: "Order of operations and negatives", who: "b", subj: "Maths", chk: null },
    fac:   { n: "Factors, primes, HCF and LCM", who: "b", subj: "Maths", chk: null },
    alg:   { n: "Algebra: expanding and solving", who: "b", subj: "Maths", chk: null },
    frac:  { n: "Fractions", who: "b", subj: "Maths", chk: null },
    pct:   { n: "Percentages and multipliers", who: "b", subj: "Maths", chk: null },
    exam:  { n: "Exam challenge (IGCSE questions)", who: "b", subj: "Maths", chk: null }
  },

  why: {
    concept: "Concept gap",
    wording: "Mark-scheme wording",
    count: "Multipliers and counting",
    arith: "Arithmetic slip",
    units: "Units and orders of magnitude",
    read: "Misread the question",
    incomplete: "Incomplete answer",
    blank: "Left blank",
    notyet: "Not tried yet"
  },

  q: []
};
