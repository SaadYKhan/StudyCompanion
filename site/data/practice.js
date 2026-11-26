/* Study Companion: practice material. Nothing here is about one child; progress against it is saved
   in each child's account. Never renumber an id: progress is saved against it.

   problems   original practice problems (written for this site, answers checked by script), used for
              ZK's daily problem and his quick sets: t topic, q question, o five options, a index of the
              right option, h three hints, s worked solution.
   ks3        Key Stage 3 maths topics, roughly in the order British schools teach them (y = usual year).
   formulas   AS formulas by unit. given: true = mostly on the exam's formula sheet (Physics), null = some are in
              the formula booklet (Maths), false = learn them (Chemistry papers give only a periodic table).
   practicals Pearson's IAS core practicals (Physics CP1–8, Chemistry CP1–8) and the unit that tests them.
   satDomains the eight SAT content areas College Board reports scores by.
   mocks      timed papers a child can sit on the Mock exams page (minutes, total marks). */
window.PRACTICE = {
  updated: "2026-11-26",
  problems: [
    {"t": "Number", "q": "What is 1 + 2 + 3 + … + 20?", "o": ["190", "200", "210", "220", "400"], "a": 2, "h": ["Pair the numbers from the two ends: 1 with 20, 2 with 19, and so on.", "Each pair adds to 21.", "There are 10 pairs."], "s": "10 pairs of 21 make 210.", "id": "z01"},
    {"t": "Fractions", "q": "What is ¾ of ⅔ of 120?", "o": ["40", "50", "60", "72", "80"], "a": 2, "h": ["\"Of\" means multiply.", "¾ × ⅔ simplifies before you multiply by 120.", "¾ × ⅔ = ½."], "s": "¾ × ⅔ = 6/12 = ½, and ½ of 120 is 60.", "id": "z02"},
    {"t": "Percentages", "q": "A jacket costs 80 dirhams. Its price goes up by 25%, then the new price goes down by 20%. What is the final price?", "o": ["76", "78", "80", "84", "85"], "a": 2, "h": ["Use multipliers: up 25% means × 1.25.", "Down 20% means × 0.8, applied to the NEW price.", "80 × 1.25 × 0.8 = ?"], "s": "80 × 1.25 = 100, then 100 × 0.8 = 80. The two changes cancel out exactly.", "id": "z03"},
    {"t": "Number", "q": "How many whole numbers from 1 to 100 are divisible by 3 or by 5 (or both)?", "o": ["43", "45", "47", "50", "53"], "a": 2, "h": ["Count multiples of 3, then multiples of 5.", "Some numbers are counted twice: which ones?", "Multiples of 15 are in both lists, so take them away once."], "s": "33 multiples of 3 + 20 multiples of 5 − 6 multiples of 15 = 47.", "id": "z04"},
    {"t": "Number", "q": "What is the remainder when 2¹⁰ is divided by 7?", "o": ["1", "2", "3", "4", "5"], "a": 1, "h": ["Work out 2¹⁰ first, or look for a pattern in the remainders of 2, 4, 8, 16, …", "The remainders of powers of 2 when divided by 7 go 2, 4, 1, 2, 4, 1, …", "10 = 3 × 3 + 1."], "s": "2¹⁰ = 1024 = 7 × 146 + 2, so the remainder is 2. (The remainders repeat 2, 4, 1 every three powers.)", "id": "z05"},
    {"t": "Angles", "q": "In a triangle, one angle is twice another, and the third angle is 60°. What is the largest angle?", "o": ["60°", "70°", "80°", "90°", "100°"], "a": 2, "h": ["The angles in a triangle add up to 180°.", "Call the smaller angle x. The other is 2x.", "x + 2x = 120."], "s": "x + 2x = 120 gives x = 40, so the angles are 40°, 80° and 60°. The largest is 80°.", "id": "z06"},
    {"t": "Area", "q": "A rectangle has a perimeter of 36 cm, and its length is twice its width. What is its area?", "o": ["54 cm²", "64 cm²", "72 cm²", "80 cm²", "81 cm²"], "a": 2, "h": ["Length + width is half the perimeter.", "If the width is w, the length is 2w.", "w + 2w = 18."], "s": "w + 2w = 18 gives w = 6 and length 12, so the area is 6 × 12 = 72 cm².", "id": "z07"},
    {"t": "Ratio", "q": "A bag has red and blue marbles in the ratio 3 : 5. There are 40 marbles. How many more blue marbles are there than red?", "o": ["5", "8", "10", "12", "15"], "a": 2, "h": ["3 + 5 = 8 parts altogether.", "One part is 40 ÷ 8.", "Blue has 2 more parts than red."], "s": "One part is 5 marbles: 15 red and 25 blue, so 10 more blue.", "id": "z08"},
    {"t": "Averages", "q": "The mean of five numbers is 12. Four of them are 10, 11, 13 and 15. What is the fifth?", "o": ["9", "10", "11", "12", "13"], "a": 2, "h": ["Mean × how many = total.", "The five numbers add up to 60.", "Take away the four you know."], "s": "5 × 12 = 60, and 60 − (10 + 11 + 13 + 15) = 60 − 49 = 11.", "id": "z09"},
    {"t": "Primes", "q": "What is the sum of the prime numbers between 20 and 40?", "o": ["110", "113", "120", "127", "143"], "a": 2, "h": ["List the numbers from 21 to 39 that have exactly two factors.", "Even numbers and multiples of 3 or 5 are out.", "There are four of them."], "s": "23 + 29 + 31 + 37 = 120.", "id": "z10"},
    {"t": "Sequences", "q": "The sequence 2, 5, 8, 11, … goes up by 3 each time. What is the 50th term?", "o": ["147", "149", "150", "152", "153"], "a": 1, "h": ["How many jumps of 3 are there from the 1st term to the 50th?", "49 jumps.", "Start at 2 and add 49 × 3."], "s": "The nth term is 3n − 1, so the 50th is 150 − 1 = 149.", "id": "z11"},
    {"t": "Counting", "q": "How many two-digit numbers have digits that add up to 9?", "o": ["7", "8", "9", "10", "11"], "a": 2, "h": ["Start listing: 18, 27, …", "Do not forget 90.", "The tens digit can be 1 to 9."], "s": "18, 27, 36, 45, 54, 63, 72, 81 and 90: nine numbers.", "id": "z12"},
    {"t": "Algebra", "q": "If 3x − 7 = 2x + 5, what is x?", "o": ["-2", "2", "7", "12", "17"], "a": 3, "h": ["Get the x terms on one side.", "Take 2x from both sides.", "x − 7 = 5."], "s": "Taking 2x from both sides gives x − 7 = 5, so x = 12. Check: 36 − 7 = 29 and 24 + 5 = 29.", "id": "z13"},
    {"t": "Speed", "q": "A cyclist rides 30 km in 1 hour 15 minutes. What is her average speed?", "o": ["20 km/h", "22 km/h", "24 km/h", "25 km/h", "26 km/h"], "a": 2, "h": ["Speed = distance ÷ time.", "Write the time in hours: 15 minutes is a quarter of an hour.", "30 ÷ 1.25."], "s": "30 ÷ 1.25 = 24 km/h.", "id": "z14"},
    {"t": "Factors", "q": "How many factors does 36 have?", "o": ["6", "7", "8", "9", "10"], "a": 3, "h": ["List factor pairs: 1 × 36, 2 × 18, …", "Keep going until the pairs meet.", "6 × 6 gives only one new factor."], "s": "1, 2, 3, 4, 6, 9, 12, 18, 36: nine factors. (Square numbers have an odd number of factors.)", "id": "z15"},
    {"t": "HCF and LCM", "q": "Two lights flash together. One flashes every 12 seconds and the other every 18 seconds. After how many seconds do they next flash together?", "o": ["6", "24", "30", "36", "216"], "a": 3, "h": ["You need a number in both lists: 12, 24, 36, … and 18, 36, …", "That is the lowest common multiple.", "Use prime factors: 12 = 2² × 3 and 18 = 2 × 3²."], "s": "LCM = 2² × 3² = 36 seconds.", "id": "z16"},
    {"t": "Powers", "q": "What is the units digit of 7²⁰²⁶?", "o": ["1", "3", "5", "7", "9"], "a": 4, "h": ["Look at the units digits of 7, 7², 7³, 7⁴, …", "They go 7, 9, 3, 1 and then repeat.", "Divide 2026 by 4 and look at the remainder."], "s": "The pattern 7, 9, 3, 1 repeats every 4. 2026 = 4 × 506 + 2, so the units digit is the 2nd in the pattern: 9.", "id": "z17"},
    {"t": "Probability", "q": "A bag has 3 red, 4 green and 5 blue balls. One is taken at random. What is the probability it is NOT green?", "o": ["1/3", "5/12", "1/2", "7/12", "2/3"], "a": 4, "h": ["How many balls are there altogether?", "How many are not green?", "8 out of 12, then simplify."], "s": "8 of the 12 balls are not green: 8/12 = 2/3.", "id": "z18"},
    {"t": "Angles", "q": "Each interior angle of a regular polygon is 140°. How many sides does it have?", "o": ["7", "8", "9", "10", "12"], "a": 2, "h": ["Interior and exterior angles add up to 180°.", "So each exterior angle is 40°.", "Exterior angles of any polygon add up to 360°."], "s": "Exterior angle = 40°, and 360 ÷ 40 = 9 sides.", "id": "z19"},
    {"t": "Algebra", "q": "Sam is 3 times as old as his sister. In 6 years he will be twice as old as her. How old is Sam now?", "o": ["12", "15", "18", "21", "24"], "a": 2, "h": ["Let his sister be s years old now, so Sam is 3s.", "In 6 years: Sam is 3s + 6 and his sister is s + 6.", "3s + 6 = 2(s + 6)."], "s": "3s + 6 = 2s + 12 gives s = 6, so Sam is 18. In 6 years: 24 and 12.", "id": "z20"},
    {"t": "Percentages", "q": "40% of a number is 18. What is 70% of the same number?", "o": ["27", "30", "31.5", "32", "36"], "a": 2, "h": ["Find 10% first.", "10% is 18 ÷ 4.", "70% is 7 lots of 10%."], "s": "10% = 4.5, so 70% = 31.5. (The number is 45.)", "id": "z21"},
    {"t": "Fractions", "q": "Which fraction is the largest?", "o": ["5/8", "3/5", "7/11", "2/3", "9/14"], "a": 3, "h": ["Change each to a decimal, or compare how far each is from 1.", "5/8 = 0.625 and 3/5 = 0.6.", "2/3 = 0.666…"], "s": "As decimals: 0.625, 0.6, 0.636…, 0.667… and 0.643…, so 2/3 is the largest.", "id": "z22"},
    {"t": "Area", "q": "A square has an area of 49 cm². A second square has sides 3 cm longer. How much bigger is its area?", "o": ["9 cm²", "21 cm²", "42 cm²", "51 cm²", "58 cm²"], "a": 3, "h": ["The first square has sides of 7 cm.", "The second square has sides of 10 cm.", "Subtract the areas."], "s": "10² − 7² = 100 − 49 = 51 cm².", "id": "z23"},
    {"t": "Counting", "q": "In how many different orders can 4 friends stand in a line?", "o": ["4", "12", "16", "24", "256"], "a": 3, "h": ["How many choices for the first place?", "Then 3 choices for the second, and so on.", "4 × 3 × 2 × 1."], "s": "4 × 3 × 2 × 1 = 24.", "id": "z24"},
    {"t": "Number", "q": "What is the smallest whole number bigger than 1 that leaves a remainder of 1 when divided by 2, 3, 4 and 5?", "o": ["21", "31", "41", "61", "121"], "a": 3, "h": ["One less than the number divides exactly by 2, 3, 4 and 5.", "That is a common multiple of 2, 3, 4 and 5.", "The lowest common multiple is 60."], "s": "LCM(2, 3, 4, 5) = 60, so the number is 61.", "id": "z25"},
    {"t": "Algebra", "q": "Three consecutive whole numbers add up to 78. What is the largest?", "o": ["25", "26", "27", "28", "29"], "a": 2, "h": ["The middle number is the mean.", "78 ÷ 3.", "The largest is one more than the middle."], "s": "The middle number is 78 ÷ 3 = 26, so the numbers are 25, 26, 27.", "id": "z26"},
    {"t": "Ratio", "q": "A recipe uses 250 g of flour for 10 biscuits. How much flour is needed for 24 biscuits?", "o": ["500 g", "550 g", "600 g", "625 g", "650 g"], "a": 2, "h": ["Find the flour for 1 biscuit, or for 2.", "25 g for each biscuit.", "24 × 25."], "s": "250 ÷ 10 = 25 g a biscuit, and 24 × 25 = 600 g.", "id": "z27"},
    {"t": "Powers", "q": "How many square numbers are there between 50 and 500?", "o": ["13", "14", "15", "16", "17"], "a": 2, "h": ["The first square above 50 is 8² = 64.", "The last square below 500 is 22² = 484.", "Count from 8 to 22."], "s": "8², 9², …, 22²: that is 22 − 8 + 1 = 15 squares.", "id": "z28"},
    {"t": "Area", "q": "A triangle has a base of 10 cm and an area of 35 cm². What is its height?", "o": ["3.5 cm", "5 cm", "7 cm", "14 cm", "25 cm"], "a": 2, "h": ["Area of a triangle = ½ × base × height.", "35 = ½ × 10 × h.", "35 = 5h."], "s": "35 = 5 × h, so h = 7 cm.", "id": "z29"},
    {"t": "Time", "q": "It is 10:45. What time will it be 200 minutes later?", "o": ["13:25", "13:45", "14:05", "14:25", "14:45"], "a": 2, "h": ["Change 200 minutes into hours and minutes.", "200 minutes = 3 hours 20 minutes.", "10:45 + 3 hours = 13:45."], "s": "10:45 + 3 h 20 min = 14:05.", "id": "z30"},
    {"t": "Percentages", "q": "A number is increased by 10%, and then the result is increased by 10% again. What is the overall percentage increase?", "o": ["20%", "20.5%", "21%", "22%", "25%"], "a": 2, "h": ["Use multipliers: × 1.1 and then × 1.1 again.", "1.1 × 1.1 = 1.21.", "A multiplier of 1.21 means an increase of …"], "s": "1.1 × 1.1 = 1.21, an increase of 21%, not 20%: the second 10% is taken from a bigger number.", "id": "z31"},
    {"t": "Number", "q": "How many whole numbers from 1 to 50 are multiples of 4 but NOT multiples of 6?", "o": ["6", "8", "9", "10", "12"], "a": 1, "h": ["List the multiples of 4 up to 50.", "Cross out those that are also multiples of 6: they are multiples of 12.", "12 multiples of 4, and 4 multiples of 12."], "s": "There are 12 multiples of 4 and 4 of them (12, 24, 36, 48) are multiples of 6, leaving 8.", "id": "z32"},
    {"t": "Algebra", "q": "Pens cost 3 dirhams and notebooks cost 5 dirhams. Zara buys 7 items and spends exactly 31 dirhams. How many notebooks does she buy?", "o": ["2", "3", "4", "5", "6"], "a": 3, "h": ["If all 7 were pens, she would spend 21 dirhams.", "Swapping a pen for a notebook adds 2 dirhams.", "She needs 10 dirhams more than 21."], "s": "31 − 21 = 10 extra, and each notebook adds 2, so 5 notebooks (and 2 pens: 25 + 6 = 31).", "id": "z33"},
    {"t": "Angles", "q": "The angles of a quadrilateral are x, 2x, 3x and 4x. What is the largest angle?", "o": ["120°", "135°", "144°", "150°", "160°"], "a": 2, "h": ["The angles of a quadrilateral add up to 360°.", "x + 2x + 3x + 4x = 10x.", "So x = 36°."], "s": "10x = 360 gives x = 36, so the largest is 4 × 36 = 144°.", "id": "z34"},
    {"t": "Number", "q": "How many times is the digit 7 written when you write all the numbers from 1 to 100?", "o": ["10", "11", "19", "20", "21"], "a": 3, "h": ["Count the 7s in the units place: 7, 17, 27, …", "Then count the 7s in the tens place: 70 to 79.", "77 has two 7s, so count it twice."], "s": "10 in the units place and 10 in the tens place: 20.", "id": "z35"},
    {"t": "Fractions", "q": "What is (½ + ⅓) ÷ (½ − ⅓)?", "o": ["1/5", "1", "5/6", "5", "6"], "a": 3, "h": ["Work out each bracket with a common denominator of 6.", "½ + ⅓ = 5/6 and ½ − ⅓ = 1/6.", "How many sixths are in five sixths?"], "s": "(5/6) ÷ (1/6) = 5.", "id": "z36"},
    {"t": "Averages", "q": "A class of 20 students has a mean test mark of 65. A new student joins and scores 86. What is the new mean?", "o": ["65.5", "66", "66.5", "67", "75.5"], "a": 1, "h": ["Find the total of the 20 marks.", "20 × 65 = 1300.", "Add 86 and divide by 21."], "s": "(1300 + 86) ÷ 21 = 1386 ÷ 21 = 66.", "id": "z37"},
    {"t": "Counting", "q": "Eight people each shake hands once with every other person. How many handshakes are there?", "o": ["16", "28", "32", "56", "64"], "a": 1, "h": ["Each person shakes 7 hands.", "8 × 7 counts every handshake twice.", "Halve it."], "s": "8 × 7 ÷ 2 = 28.", "id": "z38"},
    {"t": "Sequences", "q": "Pattern 1 has 1 dot, pattern 2 has 1 + 2 dots, pattern 3 has 1 + 2 + 3 dots, and so on. How many dots are in pattern 12?", "o": ["66", "72", "78", "84", "91"], "a": 2, "h": ["You need 1 + 2 + … + 12.", "Pair the ends: 1 + 12, 2 + 11, …", "Six pairs of 13."], "s": "6 × 13 = 78 (the 12th triangular number).", "id": "z39"},
    {"t": "Primes", "q": "What is the largest prime factor of 2024?", "o": ["11", "13", "19", "23", "253"], "a": 3, "h": ["Divide by 2 as many times as you can.", "2024 = 8 × 253.", "Is 253 prime? Try 11."], "s": "2024 = 2³ × 11 × 23, so the largest prime factor is 23. (253 = 11 × 23 is not prime.)", "id": "z40"},
    {"t": "Percentages", "q": "In a sale, a price is cut by 30% to 56 dirhams. What was the original price?", "o": ["72.80", "75", "78", "80", "86"], "a": 3, "h": ["After a 30% cut, 70% of the price is left.", "70% of the original is 56.", "56 ÷ 0.7."], "s": "56 ÷ 0.7 = 80 dirhams. (Adding 30% of 56 gives 72.80, which is a common mistake.)", "id": "z41"},
    {"t": "Angles", "q": "Three angles around a point are in the ratio 2 : 3 : 7. What is the largest angle?", "o": ["150°", "180°", "196°", "210°", "240°"], "a": 3, "h": ["Angles around a point add up to 360°.", "2 + 3 + 7 = 12 parts.", "One part is 30°."], "s": "One part is 360 ÷ 12 = 30°, so the largest is 7 × 30 = 210°.", "id": "z42"},
    {"t": "Angles", "q": "At 3:00 the hands of a clock make an angle of 90°. What is the angle between the hands at 3:30?", "o": ["60°", "75°", "80°", "90°", "105°"], "a": 1, "h": ["The minute hand points at 6, which is 180° from 12.", "The hour hand moves 30° every hour, so it is halfway between 3 and 4.", "The hour hand is at 105°."], "s": "Minute hand 180°, hour hand 3.5 × 30 = 105°, so the angle is 75°.", "id": "z43"},
    {"t": "Number", "q": "What is 999 × 12?", "o": ["11888", "11988", "11998", "12088", "11788"], "a": 1, "h": ["999 is 1000 − 1.", "1000 × 12 − 1 × 12.", "12000 − 12."], "s": "999 × 12 = 12000 − 12 = 11988.", "id": "z44"},
    {"t": "Perimeter", "q": "A 3 cm × 4 cm rectangle is cut from one corner of a 10 cm × 8 cm rectangle, leaving an L-shape. What is the perimeter of the L-shape?", "o": ["30 cm", "32 cm", "36 cm", "40 cm", "42 cm"], "a": 2, "h": ["Sketch it and label every side.", "Push the two cut edges outwards: what shape do you get?", "The perimeter is the same as the original rectangle."], "s": "The two inner edges (3 cm and 4 cm) replace the 3 cm and 4 cm that were removed, so the perimeter stays 2 × (10 + 8) = 36 cm.", "id": "z45"},
    {"t": "Number", "q": "The four-digit number 3a52 is divisible by 9. What digit is a?", "o": ["1", "4", "6", "8", "9"], "a": 3, "h": ["A number divides by 9 when its digits add up to a multiple of 9.", "3 + a + 5 + 2 = 10 + a.", "The next multiple of 9 after 10 is 18."], "s": "10 + a = 18, so a = 8: 3852 = 9 × 428.", "id": "z46"},
    {"t": "Probability", "q": "Two fair dice are rolled. What is the probability that the total is 7?", "o": ["1/12", "1/9", "1/6", "7/36", "1/3"], "a": 2, "h": ["There are 6 × 6 = 36 equally likely outcomes.", "List the pairs that make 7: (1, 6), (2, 5), …", "There are 6 of them."], "s": "6 out of 36 = 1/6.", "id": "z47"},
    {"t": "Negative numbers", "q": "At 6 am the temperature is −7 °C. It rises by 3 °C every hour. At what time is it first above 10 °C?", "o": ["10 am", "11 am", "12 noon", "1 pm", "2 pm"], "a": 2, "h": ["From −7 to 10 is a rise of 17 °C.", "After 5 hours it has risen 15 °C: 8 °C.", "After 6 hours?"], "s": "After 6 hours it is −7 + 18 = 11 °C, at 12 noon. (At 11 am it is only 8 °C.)", "id": "z48"},
    {"t": "Algebra", "q": "If a = 3 and b = −2, what is a² − 2ab + b²?", "o": ["-1", "1", "13", "21", "25"], "a": 4, "h": ["Substitute carefully: −2ab = −2 × 3 × (−2).", "Two negatives multiply to a positive.", "9 + 12 + 4."], "s": "9 − 2 × 3 × (−2) + 4 = 9 + 12 + 4 = 25. (It is (a − b)² = 5².)", "id": "z49"},
    {"t": "Estimation", "q": "Which is closest to 4.98 × 20.1 ÷ 0.501?", "o": ["2", "20", "50", "200", "2000"], "a": 3, "h": ["Round each number: 5 × 20 ÷ 0.5.", "Dividing by 0.5 is the same as multiplying by 2.", "100 × 2."], "s": "5 × 20 ÷ 0.5 = 100 × 2 = 200. (The exact value is about 199.8.)", "id": "z50"}
  ],

  ks3: [
    { s: "Number", items: [
      ["n1", "Place value, ordering and negative numbers", 7], ["n2", "Written methods with whole numbers and decimals", 7],
      ["n3", "Order of operations (BIDMAS)", 7], ["n4", "Factors, multiples and primes", 7],
      ["n5", "Prime factors, HCF and LCM", 7], ["n6", "Powers, roots and index notation", 8],
      ["n7", "Fractions: add, subtract, multiply, divide", 7], ["n8", "Fractions, decimals and percentages", 7],
      ["n9", "Percentage change with multipliers", 8], ["n10", "Rounding, significant figures and estimating", 8],
      ["n11", "Standard form", 9] ] },
    { s: "Algebra", items: [
      ["a1", "Using letters: simplifying and collecting like terms", 7], ["a2", "Substituting into expressions and formulae", 7],
      ["a3", "Expanding brackets and factorising", 8], ["a4", "Solving linear equations", 7],
      ["a5", "Forming equations from words", 8], ["a6", "Sequences and the nth term", 8],
      ["a7", "Coordinates and straight-line graphs (y = mx + c)", 8], ["a8", "Inequalities", 9],
      ["a9", "Simultaneous equations", 9], ["a10", "Expanding and factorising quadratics", 9] ] },
    { s: "Ratio and proportion", items: [
      ["r1", "Ratio notation and sharing in a ratio", 7], ["r2", "Direct and inverse proportion", 8],
      ["r3", "Speed, distance and time", 8], ["r4", "Converting units; density", 9], ["r5", "Scale drawings and maps", 8] ] },
    { s: "Geometry and measures", items: [
      ["g1", "Angle facts: lines, points, triangles", 7], ["g2", "Angles with parallel lines", 8],
      ["g3", "Angles in polygons", 8], ["g4", "Properties of 2D shapes", 7],
      ["g5", "Perimeter and area: triangles, parallelograms, trapezia", 7], ["g6", "Circles: circumference and area", 8],
      ["g7", "Volume and surface area of prisms", 8], ["g8", "Transformations: reflect, rotate, translate, enlarge", 8],
      ["g9", "Constructions and loci", 9], ["g10", "Pythagoras' theorem", 9], ["g11", "Similar shapes; first trigonometry", 9] ] },
    { s: "Probability", items: [
      ["p1", "Probability scale and single events", 7], ["p2", "Listing outcomes and sample spaces", 8],
      ["p3", "Venn diagrams and two-way tables", 8], ["p4", "Relative frequency and expected results", 9] ] },
    { s: "Statistics", items: [
      ["s1", "Mean, median, mode and range", 7], ["s2", "Bar charts, pie charts and line graphs", 7],
      ["s3", "Grouped data and frequency tables", 8], ["s4", "Scatter graphs and correlation", 9] ] }
  ],

  formulas: [
    { u: "WPH11", n: "Physics Unit 1: Mechanics and Materials", given: true, note: "Most of these are on the exam's formula sheet. Know what each letter means, its unit, and when the formula applies.", items: [
      ["Constant acceleration", "v = u + at · s = ut + ½at² · v² = u² + 2as · s = ½(u + v)t", "Only when acceleration is constant. Up is positive, so g = −9.81 m s⁻² going up."],
      ["Force and momentum", "ΣF = ma · p = mv · ΣF = Δp/Δt", "Resultant force. W = mg for weight (g = 9.81 N kg⁻¹)."],
      ["Moments", "moment = Fx", "x is the perpendicular distance from the pivot to the line of the force."],
      ["Work, energy, power", "ΔW = FΔs · ΔEₖ = ½mv² · ΔEgrav = mgΔh · P = E/t = W/t", "Work done uses the distance moved in the direction of the force."],
      ["Efficiency", "efficiency = useful energy output ÷ total energy input (or useful power ÷ total power)", "Input power = useful power ÷ efficiency."],
      ["Fluids", "ρ = m/V · upthrust = weight of fluid displaced · F = 6πηrv (Stokes' law)", "Stokes' law: small sphere, low speed, laminar flow."],
      ["Materials", "ΔF = kΔx · ΔEel = ½FΔx · σ = F/A · ε = Δx/x · E = σ/ε", "Young modulus only in the region where Hooke's law holds."]
    ] },
    { u: "WPH12", n: "Physics Unit 2: Waves and Electricity", given: true, note: "Most are on the formula sheet too. The marks are for choosing the right one and the units.", items: [
      ["Waves", "v = fλ · intensity I = P/A", "f in Hz, λ in m."],
      ["Refraction", "n₁ sin θ₁ = n₂ sin θ₂ · n = c/v · sin C = 1/n", "Critical angle only going from the denser medium."],
      ["Diffraction grating", "nλ = d sin θ", "d = 1 ÷ lines per metre."],
      ["Photons", "E = hf · hf = φ + ½mv²max · λ = h/p", "eV to J: × 1.6 × 10⁻¹⁹."],
      ["Current and charge", "ΔQ = IΔt · I = nqvA · V = W/Q", ""],
      ["Resistance and power", "R = V/I · P = VI = I²R = V²/R · W = VIt · R = ρl/A", "Area A = πd²/4 for a wire of diameter d."],
      ["Circuits", "Series: R = R₁ + R₂ · Parallel: 1/R = 1/R₁ + 1/R₂ · ε = I(R + r) · V_out = V_in × R₂/(R₁ + R₂)", "Terminal p.d. V = ε − Ir."]
    ] },
    { u: "WCH11", n: "Chemistry Unit 1", given: false, note: "Chemistry papers give only a periodic table: learn these by heart.", items: [
      ["Moles", "n = m/M · n = c × V (V in dm³) · number of particles = n × 6.02 × 10²³", "cm³ to dm³: ÷ 1000."],
      ["Gases", "pV = nRT (p in Pa, V in m³, T in K, R = 8.31) · molar volume 24 dm³ mol⁻¹ at room temperature and pressure", "1 dm³ = 10⁻³ m³; °C + 273 = K."],
      ["Yield and atom economy", "% yield = actual ÷ theoretical × 100 · atom economy = Mr of wanted product ÷ total Mr of products × 100", ""],
      ["Formulae", "Empirical formula: divide mass (or %) by Ar, then by the smallest · molecular formula = n × empirical", ""],
      ["Relative atomic mass", "Ar = Σ(isotope mass × abundance) ÷ total abundance", "From a mass spectrum."]
    ] },
    { u: "WCH12", n: "Chemistry Unit 2", given: false, note: "Also learnt, not given.", items: [
      ["Enthalpy from experiment", "Q = mcΔT · ΔH = −Q ÷ n (kJ mol⁻¹)", "m is the mass of the solution (1 cm³ ≈ 1 g); c = 4.18 J g⁻¹ K⁻¹; J to kJ: ÷ 1000."],
      ["Hess's law and bond enthalpies", "ΔH = Σ bonds broken − Σ bonds made", "Mean bond enthalpies give approximate values."],
      ["Oxidation numbers", "Elements 0 · O usually −2 · H usually +1 · sum = charge on the species", ""]
    ] },
    { u: "WMA11", n: "Maths P1", given: null, note: "Most of these are not in the formula booklet, so learn them; check the booklet for the few that are.", items: [
      ["Quadratics", "x = (−b ± √(b² − 4ac)) ÷ 2a · discriminant b² − 4ac", "> 0 two roots, = 0 one, < 0 none."],
      ["Straight lines", "y − y₁ = m(x − x₁) · m = (y₂ − y₁)/(x₂ − x₁) · perpendicular: m₁m₂ = −1", ""],
      ["Triangles", "a/sin A = b/sin B · a² = b² + c² − 2bc cos A · area = ½ab sin C", ""],
      ["Radians", "arc length s = rθ · sector area A = ½r²θ", "θ in radians."],
      ["Calculus", "d/dx(xⁿ) = nxⁿ⁻¹ · ∫xⁿ dx = xⁿ⁺¹/(n + 1) + c (n ≠ −1)", ""]
    ] },
    { u: "WMA12", n: "Maths P2", given: null, note: "Some of these are in the formula booklet; know which, and how to use them.", items: [
      ["Circles", "(x − a)² + (y − b)² = r²", "Centre (a, b), radius r."],
      ["Logarithms", "log(ab) = log a + log b · log(a/b) = log a − log b · log aⁿ = n log a", ""],
      ["Series", "Arithmetic: uₙ = a + (n − 1)d, Sₙ = n/2 (2a + (n − 1)d) · Geometric: uₙ = arⁿ⁻¹, Sₙ = a(1 − rⁿ)/(1 − r), S∞ = a/(1 − r) for |r| < 1", ""],
      ["Binomial", "(a + b)ⁿ = aⁿ + ⁿC₁aⁿ⁻¹b + ⁿC₂aⁿ⁻²b² + …", ""],
      ["Trigonometry", "sin²θ + cos²θ = 1 · tan θ = sin θ / cos θ", ""],
      ["Trapezium rule", "∫ y dx ≈ ½h(y₀ + 2(y₁ + … + yₙ₋₁) + yₙ)", ""]
    ] },
    { u: "WST01", n: "Maths S1", given: null, note: "Many are in the formula booklet; the marks are for using them correctly.", items: [
      ["Summary statistics", "x̄ = Σx/n · σ² = Σx²/n − x̄²", ""],
      ["Coding", "If y = (x − a)/b: ȳ = (x̄ − a)/b and σy = σx/b", "Variance is divided by b²."],
      ["Correlation and regression", "Sxx = Σx² − (Σx)²/n · Sxy = Σxy − ΣxΣy/n · r = Sxy/√(SxxSyy) · b = Sxy/Sxx, a = ȳ − bx̄", ""],
      ["Probability", "P(A ∪ B) = P(A) + P(B) − P(A ∩ B) · P(A | B) = P(A ∩ B)/P(B)", "Independent: P(A ∩ B) = P(A)P(B)."],
      ["Random variables", "E(X) = Σxp · Var(X) = E(X²) − (E(X))² · E(aX + b) = aE(X) + b · Var(aX + b) = a²Var(X)", ""],
      ["Normal distribution", "Z = (X − μ)/σ", ""]
    ] }
  ],

  practicals: [
    { u: "WPH11", n: "Physics Unit 1", items: [
      ["CP1", "Determine the acceleration of a freely-falling object"],
      ["CP2", "Use a falling-ball method to determine the viscosity of a liquid"],
      ["CP3", "Determine the Young modulus of a material"] ] },
    { u: "WPH12", n: "Physics Unit 2", items: [
      ["CP4", "Determine the speed of sound in air using a 2-beam oscilloscope, signal generator, speaker and microphone"],
      ["CP5", "Investigate the effects of length, tension and mass per unit length on the frequency of a vibrating string or wire"],
      ["CP6", "Determine the wavelength of light from a laser or other light source using a diffraction grating"],
      ["CP7", "Determine the electrical resistivity of a material"],
      ["CP8", "Determine the e.m.f. and internal resistance of an electrical cell"] ] },
    { u: "WCH11", n: "Chemistry Unit 1", items: [
      ["CP1", "Measuring the molar volume of a gas"] ] },
    { u: "WCH12", n: "Chemistry Unit 2", items: [
      ["CP2", "Determine the enthalpy change of a reaction using Hess's law"],
      ["CP3", "Finding the concentration of a solution of hydrochloric acid"],
      ["CP4", "Prepare a standard solution from a solid acid and use it to find the concentration of a solution of sodium hydroxide"],
      ["CP5", "Investigate the rates of hydrolysis of halogenoalkanes"],
      ["CP6", "Chlorination of 2-methylpropan-2-ol with concentrated hydrochloric acid"],
      ["CP7", "Oxidation of propan-1-ol to produce propanal and propanoic acid"],
      ["CP8", "Analysis of some inorganic and organic unknowns"] ] }
  ],
  practicalSkills: ["Plan: name the independent, dependent and control variables", "Choose instruments and say why (resolution)", "Uncertainty: half the resolution, or half the range of repeats",
    "Percentage uncertainty, and combining them", "Plot a graph: scales, best-fit line, gradient from a large triangle", "Linearise an equation to get a straight line (y = mx + c)",
    "Evaluate: systematic vs random errors, and one specific improvement"],
  practicalSrc: "https://qualifications.pearson.com/en/qualifications/edexcel-international-advanced-levels.html",

  satDomains: [
    { k: "ii", sec: "rw", n: "Information and Ideas" }, { k: "cs", sec: "rw", n: "Craft and Structure" },
    { k: "ei", sec: "rw", n: "Expression of Ideas" }, { k: "sec", sec: "rw", n: "Standard English Conventions" },
    { k: "alg", sec: "m", n: "Algebra" }, { k: "adv", sec: "m", n: "Advanced Math" },
    { k: "psda", sec: "m", n: "Problem-Solving and Data Analysis" }, { k: "geo", sec: "m", n: "Geometry and Trigonometry" }
  ],

  mocks: {
    a: [
      { k: "WPH11", n: "Physics Unit 1", min: 90, max: 80 }, { k: "WPH12", n: "Physics Unit 2", min: 90, max: 80 }, { k: "WPH13", n: "Physics Unit 3 (practical skills)", min: 80, max: 50 },
      { k: "WCH11", n: "Chemistry Unit 1", min: 90, max: 80 }, { k: "WCH12", n: "Chemistry Unit 2", min: 90, max: 80 }, { k: "WCH13", n: "Chemistry Unit 3 (practical skills)", min: 80, max: 50 },
      { k: "WMA11", n: "Maths P1", min: 90, max: 75 }, { k: "WMA12", n: "Maths P2", min: 90, max: 75 }, { k: "WST01", n: "Maths S1", min: 90, max: 75 }, { k: "WME01", n: "Maths M1", min: 90, max: 75 }
    ],
    b: [
      { k: "set", n: "Quick set: 10 questions on screen, marked straight away", min: 20, max: 10, onscreen: true },
      { k: "amc8", n: "AMC 8 past paper", min: 40, max: 25, url: "https://www.maa.org/AMC" },
      { k: "jmc", n: "UKMT Junior Mathematical Challenge past paper", min: 60, max: 135, url: "https://ukmt.org.uk" }
    ]
  }
};
