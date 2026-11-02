/**
 * ProceduralMathAdvanced - Authentic SSC CGL Tier-2, TCS, Kiran Chapterwise Advanced Question Generator
 * Generates 100% natural, multi-step, mathematically accurate, bilingual (English + Hindi) questions
 * for Ultra Hard, Very Hard, and Hard difficulty levels.
 * ZERO robotic prefixes, 4 distinct options, full detailed step-by-step bilingual explanations.
 */

export class ProceduralMathAdvanced {
  // === ANTI-REPETITION MULTI-SEED HASH FUNCTIONS ===
  static h(v, i) {
    let x = Math.abs(((v | 0) * 1664525 + (i | 0) * 1013904223 + 1013904223) | 0);
    x = Math.imul(x ^ (x >>> 16), 0x45d9f3b) >>> 0;
    x = Math.imul(x ^ (x >>> 16), 0x45d9f3b) >>> 0;
    x = (x ^ (x >>> 16)) >>> 0;
    return x;
  }
  static hpick(v, i, arr) { return arr[this.h(v, i) % arr.length]; }
  static hnum(v, i, min, max) { return min + (this.h(v, i) % (max - min + 1)); }

  // Helper to ensure 4 distinct options and correct mapping
  static makeQuestion({ exam = 'General Practice / All Exams', subject = 'Simple Arithmetic / Mathematics', topic, subtopic = 'standard', difficulty, question, correctAnswerText, wrongAnswers, explanation }) {
    const correctStr = String(correctAnswerText).trim();
    const uniqueWrongs = [];
    const seen = new Set([correctStr]);

    for (const w of wrongAnswers) {
      const wStr = String(w).trim();
      if (!seen.has(wStr) && wStr !== '') {
        seen.add(wStr);
        uniqueWrongs.push(wStr);
      }
    }

    let fallbackOffset = 1;
    while (uniqueWrongs.length < 3) {
      let candidate;
      const numMatch = correctStr.match(/-?\d+(?:\.\d+)?/);
      if (numMatch) {
        const num = parseFloat(numMatch[0]);
        const newNum = Math.round((num + fallbackOffset * 3) * 10) / 10;
        candidate = correctStr.replace(numMatch[0], String(newNum));
      } else {
        candidate = `${correctStr} (Option ${fallbackOffset})`;
      }
      if (!seen.has(candidate)) {
        seen.add(candidate);
        uniqueWrongs.push(candidate);
      }
      fallbackOffset++;
    }

    const rawOptions = [
      { text: correctStr, isCorrect: true },
      ...uniqueWrongs.slice(0, 3).map(w => ({ text: w, isCorrect: false }))
    ];

    const sorted = rawOptions.sort(() => Math.random() - 0.5);
    const letters = ['A', 'B', 'C', 'D'];
    const options = sorted.map((opt, idx) => ({
      id: letters[idx],
      text: opt.text
    }));

    const correctOpt = options.find((_, idx) => sorted[idx].isCorrect) || options[0];

    return {
      exam,
      subject,
      topic,
      subtopic,
      difficulty: difficulty || 'Medium',
      question,
      options,
      correctAnswer: correctOpt.id,
      explanation
    };
  }

  static supports(topicId) {
    const supported = [
      'math_number_system',
      'math_lcm_hcf',
      'math_simplification',
      'math_surds_indices',
      'math_average',
      'math_ratio_proportion',
      'math_mixture',
      'math_mixture_alligation',
      'math_percentage',
      'math_percent_profit',
      'math_profit_loss',
      'math_discount',
      'math_simple_interest',
      'math_si_ci',
      'math_compound_interest',
      'math_time_work',
      'math_ratio_work',
      'math_pipe_cistern',
      'math_time_distance',
      'math_speed_time_distance',
      'math_trains',
      'math_boat_stream',
      'math_boats_streams',
      'math_sequence_series',
      'math_algebra',
      'math_trigonometry',
      'math_height_distance',
      'math_geometry',
      'math_coordinate_geometry',
      'math_mensuration',
      'math_mensuration_2d',
      'math_mensuration_3d',
      'math_geometry_mensuration',
      'math_statistics_di',
      'math_statistics',
      'math_data_interpretation',
      'math_probability',
      'math_ages'
    ];
    return supported.includes(topicId);
  }

  static generate(topicId, variantIndex = 1, difficulty = 'Ultra Hard') {
    switch (topicId) {
      case 'math_simplification':
        return this.generateSimplification(variantIndex, difficulty);
      case 'math_surds_indices':
        return this.generateSurdsIndices(variantIndex, difficulty);
      case 'math_average':
        return this.generateAverage(variantIndex, difficulty);
      case 'math_ratio_proportion':
        return this.generateRatioProportion(variantIndex, difficulty);
      case 'math_mixture':
      case 'math_mixture_alligation':
        return this.generateMixture(variantIndex, difficulty);
      case 'math_percentage':
      case 'math_percent_profit':
        return this.generatePercentage(variantIndex, difficulty);
      case 'math_profit_loss':
        return this.generateProfitLoss(variantIndex, difficulty);
      case 'math_discount':
        return this.generateDiscount(variantIndex, difficulty);
      case 'math_simple_interest':
      case 'math_si_ci':
        return this.generateSimpleInterest(variantIndex, difficulty);
      case 'math_compound_interest':
        return this.generateCompoundInterest(variantIndex, difficulty);
      case 'math_time_work':
      case 'math_ratio_work':
        return this.generateTimeWork(variantIndex, difficulty);
      case 'math_pipe_cistern':
        return this.generatePipeCistern(variantIndex, difficulty);
      case 'math_time_distance':
      case 'math_speed_time_distance':
      case 'math_trains':
        return this.generateTimeDistance(variantIndex, difficulty);
      case 'math_boat_stream':
      case 'math_boats_streams':
        return this.generateBoatStream(variantIndex, difficulty);
      case 'math_sequence_series':
        return this.generateSequenceSeries(variantIndex, difficulty);
      case 'math_algebra':
        return this.generateAlgebra(variantIndex, difficulty);
      case 'math_trigonometry':
      case 'math_height_distance':
        return this.generateTrigonometry(variantIndex, difficulty);
      case 'math_geometry':
      case 'math_coordinate_geometry':
        return this.generateGeometry(variantIndex, difficulty);
      case 'math_mensuration':
      case 'math_mensuration_2d':
      case 'math_mensuration_3d':
      case 'math_geometry_mensuration':
        return this.generateMensuration(variantIndex, difficulty);
      case 'math_statistics_di':
      case 'math_statistics':
      case 'math_data_interpretation':
        return this.generateStatisticsDi(variantIndex, difficulty);
      case 'math_probability':
        return this.generateProbability(variantIndex, difficulty);
      case 'math_ages':
        return this.generateAges(variantIndex, difficulty);
      default:
        return null;
    }
  }

  // === 1. SIMPLIFICATION (KIRAN SSC ADVANCED) ===
  static generateSimplification(variantIndex, difficulty) {
    const p = this.h(variantIndex, 2300) % 5;
    if (p === 0) {
      // Continued fraction (लंगड़ी भिन्न)
      const cases = [
        { bottom: 2, xVal: '8/5', expr: '5x - 3', ans: 5, step: '1 + 1/(1 + 1/(1 + 1/2)) = 8/5' },
        { bottom: 3, xVal: '11/7', expr: '7x - 4', ans: 7, step: '1 + 1/(1 + 1/(1 + 1/3)) = 11/7' },
        { bottom: 4, xVal: '14/9', expr: '9x + 2', ans: 16, step: '1 + 1/(1 + 1/(1 + 1/4)) = 14/9' },
        { bottom: 5, xVal: '17/11', expr: '11x - 6', ans: 11, step: '1 + 1/(1 + 1/(1 + 1/5)) = 17/11' }
      ];
      const c = this.hpick(variantIndex, 2301, cases);
      return this.makeQuestion({
        topic: 'Simplification',
        difficulty,
        question: `If x = 1 + 1 / (1 + 1 / (1 + 1 / ${c.bottom})), then find the value of ${c.expr}.\nयदि x = 1 + 1 / (1 + 1 / (1 + 1 / ${c.bottom})) हो, तो ${c.expr} का मान ज्ञात कीजिए।`,
        correctAnswerText: String(c.ans),
        wrongAnswers: [String(c.ans - 2), String(c.ans + 3), String(c.ans + 5)],
        explanation: `Solving continued fraction from bottom to top: ${c.step}. Substituting x = ${c.xVal} into ${c.expr} gives ${c.ans}.\nनीचे से ऊपर सरल करने पर: ${c.step}। मान रखने पर: ${c.expr} = ${c.ans}।`
      });
    } else if (p === 1) {
      // Algebraic identity a^3 + b^3 + c^3 - 3abc with large numbers
      const base = this.hnum(variantIndex, 2302, 991, 997);
      const a = base, b = base + 1, c = base + 2;
      const sum = a + b + c;
      const ans = sum * 3;
      return this.makeQuestion({
        topic: 'Simplification',
        difficulty,
        question: `If a = ${a}, b = ${b}, and c = ${c}, find the value of (a³ + b³ + c³ - 3abc).\nयदि a = ${a}, b = ${b} तथा c = ${c} हो, तो (a³ + b³ + c³ - 3abc) का मान ज्ञात कीजिए।`,
        correctAnswerText: String(ans),
        wrongAnswers: [String(ans - sum), String(ans + sum), String(ans - 6)],
        explanation: `Using identity a³ + b³ + c³ - 3abc = 1/2 × (a + b + c) × [(a - b)² + (b - c)² + (c - a)²] = 1/2 × (${sum}) × [1 + 1 + 4] = ${sum} × 3 = ${ans}.\nसर्वसमिका सूत्र: 1/2 × (${sum}) × 6 = ${ans}।`
      });
    } else if (p === 2) {
      // Telescopic series: 1/(1*2) + 1/(2*3) + ... + 1/(n*(n+1))
      const n = this.hpick(variantIndex, 2303, [9, 19, 29, 99]);
      const num = n;
      const den = n + 1;
      return this.makeQuestion({
        topic: 'Simplification',
        difficulty,
        question: `Find the sum of the series: 1/(1×2) + 1/(2×3) + 1/(3×4) + ... + 1/(${n}×${den}).\nश्रेणी 1/(1×2) + 1/(2×3) + 1/(3×4) + ... + 1/(${n}×${den}) का योगफल ज्ञात कीजिए।`,
        correctAnswerText: `${num}/${den}`,
        wrongAnswers: [`${num - 1}/${den}`, `${num}/${den + 1}`, `${num + 1}/${den}`],
        explanation: `Each term 1/[k(k+1)] = 1/k - 1/(k+1). Summation = 1 - 1/${den} = ${num}/${den}.\nप्रत्येक पद को (1/k - 1/(k+1)) के रूप में लिखने पर: 1 - 1/${den} = ${num}/${den}।`
      });
    } else if (p === 3) {
      // Nested radical conjugate sum
      const cases = [
        { a: 7, b: 4, root: 3, dec: '2 + √3 and 2 - √3', ans: 4 },
        { a: 14, b: 6, root: 5, dec: '3 + √5 and 3 - √5', ans: 6 },
        { a: 11, b: 4, root: 7, dec: '2 + √7 and 2 - √7', ans: 4 },
        { a: 18, b: 8, root: 2, dec: '4 + √2 and 4 - √2', ans: 8 }
      ];
      const c = this.hpick(variantIndex, 2304, cases);
      return this.makeQuestion({
        topic: 'Simplification',
        difficulty,
        question: `Find the value of √( ${c.a} + ${c.b}√${c.root} ) + √( ${c.a} - ${c.b}√${c.root} ).\n√( ${c.a} + ${c.b}√${c.root} ) + √( ${c.a} - ${c.b}√${c.root} ) का मान क्या होगा?`,
        correctAnswerText: String(c.ans),
        wrongAnswers: [String(c.ans - 2), String(c.ans + 2), String(2 * c.root)],
        explanation: `The square roots simplify to conjugate forms (${c.dec}). Their sum is ${c.ans}.\nकरणी को पूर्ण वर्ग में बदलने पर: (${c.dec})। योगफल = ${c.ans}।`
      });
    } else {
      // Complex bracketed expression with vinculum
      const cases = [
        { expr: '25 - [40 ÷ {8 - (6 - (4 - 2))}]', ans: 15, step: '4-2=2, 6-2=4, 8-4=4, 40÷4=10, 25-10=15' },
        { expr: '18 - [5 - {6 + 2 × (7 - (8 - 5))}]', ans: 27, step: '8-5=3, 7-3=4, 2×4=8, 6+8=14, 5-14=-9, 18-(-9)=27' },
        { expr: '50 - [20 + {30 - (15 - (8 - 3))}]', ans: 10, step: '8-3=5, 15-5=10, 30-10=20, 20+20=40, 50-40=10' }
      ];
      const c = this.hpick(variantIndex, 2305, cases);
      return this.makeQuestion({
        topic: 'Simplification',
        difficulty,
        question: `Simplify the expression: ${c.expr}.\nव्यंजक ${c.expr} को सरल कीजिए।`,
        correctAnswerText: String(c.ans),
        wrongAnswers: [String(c.ans - 4), String(c.ans + 5), String(c.ans + 12)],
        explanation: `Following VBODMAS rules from innermost brackets: ${c.step}.\nVBODMAS के नियमानुसार: ${c.step}।`
      });
    }
  }

  // === 2. SURDS AND INDICES (KIRAN SSC ADVANCED) ===
  static generateSurdsIndices(variantIndex, difficulty) {
    const p = this.h(variantIndex, 2400) % 5;
    if (p === 0) {
      // Rationalization chain
      return this.makeQuestion({
        topic: 'Power, Indices and Surds',
        difficulty,
        question: `Find the value of: 1/(√9 - √8) - 1/(√8 - √7) + 1/(√7 - √6) - 1/(√6 - √5) + 1/(√5 - √4).\n1/(√9 - √8) - 1/(√8 - √7) + 1/(√7 - √6) - 1/(√6 - √5) + 1/(√5 - √4) का मान क्या होगा?`,
        correctAnswerText: '5',
        wrongAnswers: ['1', '0', '7'],
        explanation: `Rationalizing each denominator: (√9 + √8) - (√8 + √7) + (√7 + √6) - (√6 + √5) + (√5 + √4) = √9 + √4 = 3 + 2 = 5.\nप्रत्येक पद का परिमेयकरण करने पर: √9 + √4 = 3 + 2 = 5।`
      });
    } else if (p === 1) {
      // x = 3 + 2√2, find x^3 + 1/x^3
      const cases = [
        { x: '3 + 2√2', sum: 6, cubeSum: 198, step: 'x + 1/x = 6 => x³ + 1/x³ = 6³ - 3(6) = 198' },
        { x: '2 + √3', sum: 4, cubeSum: 52, step: 'x + 1/x = 4 => x³ + 1/x³ = 4³ - 3(4) = 52' },
        { x: '7 + 4√3', sum: 14, cubeSum: 2702, step: 'x + 1/x = 14 => x³ + 1/x³ = 14³ - 3(14) = 2702' }
      ];
      const c = this.hpick(variantIndex, 2401, cases);
      return this.makeQuestion({
        topic: 'Power, Indices and Surds',
        difficulty,
        question: `If x = ${c.x}, find the value of (x³ + 1/x³).\nयदि x = ${c.x} हो, तो (x³ + 1/x³) का मान ज्ञात कीजिए।`,
        correctAnswerText: String(c.cubeSum),
        wrongAnswers: [String(c.cubeSum - 18), String(c.cubeSum + 18), String(c.cubeSum - 36)],
        explanation: `Since 1/x is the conjugate, ${c.step}.\nसंयुग्मी 1/x से: ${c.step}।`
      });
    } else if (p === 2) {
      // 2^x = 3^y = 6^-z => 1/x + 1/y + 1/z = 0
      return this.makeQuestion({
        topic: 'Power, Indices and Surds',
        difficulty,
        question: `If 2^x = 3^y = 6^(-z), what is the value of (1/x + 1/y + 1/z)?\nयदि 2^x = 3^y = 6^(-z) हो, तो (1/x + 1/y + 1/z) का मान क्या होगा?`,
        correctAnswerText: '0',
        wrongAnswers: ['1', '6', '-1'],
        explanation: `Let 2^x = 3^y = 6^-z = k. Then 2 = k^(1/x), 3 = k^(1/y), 6 = k^(-1/z). Since 2 × 3 = 6 => k^(1/x + 1/y) = k^(-1/z) => 1/x + 1/y + 1/z = 0.\nमान रखने पर k^(1/x + 1/y + 1/z) = 1 => 1/x + 1/y + 1/z = 0।`
      });
    } else if (p === 3) {
      // Finite nested radical: √(a√(a√(a√a)))
      const base = this.hpick(variantIndex, 2402, [2, 3, 5, 7]);
      return this.makeQuestion({
        topic: 'Power, Indices and Surds',
        difficulty,
        question: `Find the simplified value of: √( ${base} × √( ${base} × √( ${base} × √${base} ) ) ).\n√( ${base} × √( ${base} × √( ${base} × √${base} ) ) ) का सरलीकृत मान ज्ञात कीजिए।`,
        correctAnswerText: `${base}^(15/16)`,
        wrongAnswers: [`${base}^(7/8)`, `${base}^(31/32)`, `${base}`],
        explanation: `For n nested square roots, the formula is a^((2^n - 1) / 2^n). Here n = 4, so exponent = (16 - 1)/16 = 15/16 => ${base}^(15/16).\n4 बार वर्गमूल के लिए घातांक सूत्र = (2⁴ - 1)/2⁴ = 15/16 => ${base}^(15/16) होगा।`
      });
    } else {
      // Comparing surds using LCM of orders
      return this.makeQuestion({
        topic: 'Power, Indices and Surds',
        difficulty,
        question: `Which is the greatest among: ∛4, ∜6, ⁶√15, and ¹²√245?\n∛4, ∜6, ⁶√15 और ¹²√245 में से सबसे बड़ी संख्या कौन सी है?`,
        correctAnswerText: '∛4',
        wrongAnswers: ['∜6', '⁶√15', '¹²√245'],
        explanation: `LCM of root orders (3, 4, 6, 12) is 12. Raising each to 12th power: (∛4)¹² = 4⁴ = 256; (∜6)¹² = 6³ = 216; (⁶√15)¹² = 15² = 225; (¹²√245)¹² = 245. Since 256 is greatest, ∛4 is the largest.\nघात 12 करने पर: 256, 216, 225, 245। सबसे बड़ा 256 है, अतः ∛4 सबसे बड़ा है।`
      });
    }
  }

  // === 3. AVERAGE (KIRAN SSC ADVANCED) ===
  static generateAverage(variantIndex, difficulty) {
    const p = this.h(variantIndex, 2500) % 5;
    if (p === 0) {
      // 11 observations: middle number
      const A = this.hnum(variantIndex, 2501, 45, 65);
      const A1 = A + this.hnum(variantIndex, 2502, 2, 5);
      const A2 = A - this.hnum(variantIndex, 2503, 1, 4);
      const sixth = 6 * A1 + 6 * A2 - 11 * A;
      return this.makeQuestion({
        topic: 'Average',
        difficulty,
        question: `The average of 11 numbers is ${A}. If the average of the first 6 numbers is ${A1} and that of the last 6 numbers is ${A2}, find the 6th number.\n11 संख्याओं का औसत ${A} है। यदि प्रथम 6 संख्याओं का औसत ${A1} तथा अंतिम 6 संख्याओं का औसत ${A2} हो, तो छठी संख्या ज्ञात कीजिए।`,
        correctAnswerText: String(sixth),
        wrongAnswers: [String(sixth - 6), String(sixth + 6), String(sixth + 12)],
        explanation: `6th number = (Sum of first 6 + Sum of last 6) - Total Sum of 11 = 6(${A1}) + 6(${A2}) - 11(${A}) = ${6 * A1 + 6 * A2} - ${11 * A} = ${sixth}.\nछठी संख्या = 6(${A1}) + 6(${A2}) - 11(${A}) = ${sixth}।`
      });
    } else if (p === 1) {
      // Bowler average improvement
      const oldAvg = 12.4;
      const wickets = 5;
      const runs = 26;
      const imp = 0.4;
      const prevWickets = 85;
      return this.makeQuestion({
        topic: 'Average',
        difficulty,
        question: `A cricket bowler has a bowling average of 12.4 runs per wicket. In his next match, he takes 5 wickets for 26 runs, thereby decreasing his average by 0.4 runs. What was the total number of wickets taken by him before this match?\nएक गेंदबाज का गेंदबाजी औसत 12.4 रन प्रति विकेट है। अगले मैच में वह 26 रन देकर 5 विकेट लेता है, जिससे उसका औसत 0.4 रन कम हो जाता है। इस मैच से पहले उसके द्वारा लिए गए कुल विकेटों की संख्या क्या थी?`,
        correctAnswerText: String(prevWickets),
        wrongAnswers: ['80', '90', '75'],
        explanation: `Let previous wickets be w. (12.4w + 26) / (w + 5) = 12.0 => 12.4w + 26 = 12w + 60 => 0.4w = 34 => w = 85 wickets.\nसमीकरण से: 12.4w + 26 = 12(w + 5) => 0.4w = 34 => w = 85 विकेट।`
      });
    } else if (p === 2) {
      // Two misread observations
      const totalStudents = 50;
      const reportedAvg = 64;
      const wrong1 = 38, wrong2 = 42;
      const correct1 = 83, correct2 = 72;
      const netDiff = (correct1 + correct2) - (wrong1 + wrong2); // +75
      const correctAvg = reportedAvg + netDiff / totalStudents; // 64 + 1.5 = 65.5
      return this.makeQuestion({
        topic: 'Average',
        difficulty,
        question: `The average marks of 50 students were calculated as 64. Later, it was discovered that marks of two students were wrongly recorded as 38 and 42 instead of 83 and 72 respectively. Find the correct average marks.\n50 विद्यार्थियों के औसत अंक 64 परिकलित किए गए। बाद में पता चला कि दो विद्यार्थियों के अंक 83 और 72 के स्थान पर गलती से 38 और 42 दर्ज हो गए थे। सही औसत अंक ज्ञात कीजिए।`,
        correctAnswerText: String(correctAvg),
        wrongAnswers: [String(reportedAvg - 1.5), '66.0', '65.0'],
        explanation: `Net difference in total marks = (83 + 72) - (38 + 42) = 155 - 80 = +75. Correction per student = 75 / 50 = +1.5. Correct average = 64 + 1.5 = 65.5.\nकुल अंकों में अंतर = 155 - 80 = +75। प्रति विद्यार्थी सुधार = +1.5। सही औसत = 65.5।`
      });
    } else if (p === 3) {
      // Batsman innings excluding highest and lowest
      const inn = 40;
      const overallAvg = 50;
      const diff = 172;
      const remInn = 38;
      const remAvg = 48;
      // High + Low = 40*50 - 38*48 = 2000 - 1824 = 176
      // High - Low = 172 => 2*High = 348 => High = 174
      const high = 174;
      return this.makeQuestion({
        topic: 'Average',
        difficulty,
        question: `The batting average of a batsman for 40 innings is 50 runs. His highest score exceeds his lowest score by 172 runs. If these two innings are excluded, the average of the remaining 38 innings becomes 48 runs. Find his highest score.\nएक बल्लेबाज का 40 पारियों का बल्लेबाजी औसत 50 रन है। उसका उच्चतम स्कोर उसके न्यूनतम स्कोर से 172 रन अधिक है। यदि इन दोनों पारियों को निकाल दिया जाए, तो शेष 38 पारियों का औसत 48 रन हो जाता है। उसका उच्चतम स्कोर ज्ञात कीजिए।`,
        correctAnswerText: String(high),
        wrongAnswers: ['170', '172', '176'],
        explanation: `Sum of highest and lowest = (40 × 50) - (38 × 48) = 2000 - 1824 = 176. Given: H - L = 172. Adding both equations: 2H = 348 => H = 174 runs.\nउच्चतम + न्यूनतम = 2000 - 1824 = 176। H - L = 172 जोड़ने पर: 2H = 348 => H = 174।`
      });
    } else {
      // Weighted average of 3 sections
      const n1 = 30, n2 = 40, n3 = 50;
      const a1 = 70, a2 = 75, a3 = 80;
      const totalMarks = n1 * a1 + n2 * a2 + n3 * a3;
      const totalStudents = n1 + n2 + n3;
      const combined = Math.round((totalMarks / totalStudents) * 10) / 10;
      return this.makeQuestion({
        topic: 'Average',
        difficulty,
        question: `Three classes of 30, 40, and 50 students scored average marks of 70, 75, and 80 respectively in a test. What is the combined average marks of all students?\n30, 40 और 50 विद्यार्थियों की तीन कक्षाओं ने एक परीक्षा में क्रमशः 70, 75 और 80 औसत अंक प्राप्त किए। सभी विद्यार्थियों का संयुक्त औसत अंक क्या होगा?`,
        correctAnswerText: String(combined),
        wrongAnswers: [String(combined - 2.5), String(combined + 2.5), '75.0'],
        explanation: `Combined Average = (30×70 + 40×75 + 50×80) / (30 + 40 + 50) = (2100 + 3000 + 4000) / 120 = 9100 / 120 = 75.8.\nसंयुक्त औसत = 9100 / 120 = 75.8 अंक।`
      });
    }
  }

  // === 4. RATIO AND PROPORTION (KIRAN SSC ADVANCED) ===
  static generateRatioProportion(variantIndex, difficulty) {
    const p = this.h(variantIndex, 2600) % 5;
    if (p === 0) {
      // Number to subtract x, then mean proportional
      // Numbers: 21, 38, 55, 106 => (21-x)(106-x) = (38-x)(55-x) => x = 4
      // Mean proportional of (x + 5) and (x + 12) => sqrt(9 * 16) = 12
      return this.makeQuestion({
        topic: 'Ratio and Proportion',
        difficulty,
        question: `What number x must be subtracted from each of 21, 38, 55, and 106 so that the remainders are in proportion? Also find the mean proportional between (x + 5) and (x + 12).\n21, 38, 55 और 106 प्रत्येक में से कौन सी संख्या x घटाई जाए ताकि प्राप्त शेषफल समानुपाती हों? साथ ही (x + 5) और (x + 12) का मध्यानुपाती भी ज्ञात कीजिए।`,
        correctAnswerText: '12',
        wrongAnswers: ['10', '14', '16'],
        explanation: `(21 - x)/(38 - x) = (55 - x)/(106 - x) gives x = 4. Mean proportional = √[(4 + 5) × (4 + 12)] = √(9 × 16) = 12.\nx = 4 प्राप्त होता है। मध्यानुपाती = √(9 × 16) = 12।`
      });
    } else if (p === 1) {
      // Income and Expenditure with unequal savings (Cross multiplication)
      // Income ratio: 5:3, Expenditure ratio: 9:5, Savings: 2600 and 1800
      // 5x - 2600 = 9y, 3x - 1800 = 5y => 25x - 13000 = 27x - 16200 => 2x = 3200 => x = 1600. Income A = 5*1600 = 8000
      return this.makeQuestion({
        topic: 'Ratio and Proportion',
        difficulty,
        question: `The ratio of incomes of A and B is 5 : 3 and the ratio of their expenditures is 9 : 5. If A saves ₹2600 and B saves ₹1800, find the income of A.\nA और B की आय का अनुपात 5 : 3 है तथा उनके व्यय का अनुपात 9 : 5 है। यदि A ₹2600 तथा B ₹1800 की बचत करता है, तो A की आय ज्ञात कीजिए।`,
        correctAnswerText: '₹8000',
        wrongAnswers: ['₹6000', '₹9000', '₹7500'],
        explanation: `By cross-multiplication: (5x × 5 - 3x × 9) = (2600 × 5 - 1800 × 9) => |25x - 27x| = |13000 - 16200| => 2x = 3200 => x = 1600. A's income = 5 × 1600 = ₹8000.\n2x = 3200 => x = 1600। A की आय = 5 × 1600 = ₹8000।`
      });
    } else if (p === 2) {
      // Sum divided with (A+B):C and (B+C):A
      const total = 1050;
      // (A+B):C = 11:4 => C gets 4/15 of total = 280
      // (B+C):A = 7:3 => A gets 3/10 of total = 315
      // B gets 1050 - (280 + 315) = 455
      return this.makeQuestion({
        topic: 'Ratio and Proportion',
        difficulty,
        question: `A sum of ₹${total} is divided among A, B, and C such that the ratio of (A + B)'s share to C's share is 11 : 4 and the ratio of (B + C)'s share to A's share is 7 : 3. What is the share of B?\n₹${total} की राशि को A, B और C के बीच इस प्रकार विभाजित किया जाता है कि (A + B) के हिस्से का C के हिस्से से अनुपात 11 : 4 है तथा (B + C) के हिस्से का A के हिस्से से अनुपात 7 : 3 है। B का हिस्सा कितना होगा?`,
        correctAnswerText: '₹455',
        wrongAnswers: ['₹315', '₹280', '₹420'],
        explanation: `C's share = (4 / 15) × 1050 = ₹280. A's share = (3 / 10) × 1050 = ₹315. Therefore B's share = 1050 - (280 + 315) = ₹455.\nC का हिस्सा = ₹280, A का हिस्सा = ₹315। B का हिस्सा = 1050 - 595 = ₹455।`
      });
    } else if (p === 3) {
      // Coin bag with 3 denominations
      const mult = this.hnum(variantIndex, 2601, 20, 50);
      const coins50p = 3 * mult;
      const totalVal = (1 * 2 + 0.5 * 3 + 0.25 * 4) * mult; // (2 + 1.5 + 1) * mult = 4.5 * mult
      return this.makeQuestion({
        topic: 'Ratio and Proportion',
        difficulty,
        question: `A bag contains ₹1, 50 paise, and 25 paise coins in the ratio 2 : 3 : 4. If the total value of all coins is ₹${totalVal}, find the number of 50 paise coins.\nएक थैले में ₹1, 50 पैसे और 25 पैसे के सिक्के 2 : 3 : 4 के अनुपात में हैं। यदि सिक्कों का कुल मूल्य ₹${totalVal} है, तो 50 पैसे के सिक्कों की संख्या ज्ञात कीजिए।`,
        correctAnswerText: String(coins50p),
        wrongAnswers: [String(coins50p - mult), String(coins50p + mult), String(2 * mult)],
        explanation: `Value per ratio unit = 2(1) + 3(0.50) + 4(0.25) = ₹4.50. Units = ${totalVal} / 4.5 = ${mult}. 50 paise coins = 3 × ${mult} = ${coins50p}.\nप्रति अनुपात मूल्य = ₹4.50। 50 पैसे के सिक्के = 3 × ${mult} = ${coins50p}।`
      });
    } else {
      // Sub-duplicate and duplicate ratio
      return this.makeQuestion({
        topic: 'Ratio and Proportion',
        difficulty,
        question: `If (3x + 1) : (5x + 3) is the triplicate ratio of 3 : 4, what is the value of x?\nयदि (3x + 1) : (5x + 3), 3 : 4 का घनानुपात (triplicate ratio) हो, तो x का मान क्या होगा?`,
        correctAnswerText: '3',
        wrongAnswers: ['2', '4', '5'],
        explanation: `Triplicate ratio of 3 : 4 is 3³ : 4³ = 27 : 64. (3x + 1)/(5x + 3) = 27/64 => 64(3x + 1) = 27(5x + 3) => 192x + 64 = 135x + 81 => 57x = 171 => x = 3.\n64(3x + 1) = 27(5x + 3) => 57x = 171 => x = 3।`
      });
    }
  }

  // === 5. PERCENTAGE (KIRAN SSC ADVANCED) ===
  static generatePercentage(variantIndex, difficulty) {
    const p = this.h(variantIndex, 2700) % 5;
    if (p === 0) {
      // Election with invalid votes and non-voters
      // 10% non voters, 10% invalid of cast, winner 54% of valid, wins by 1620
      // valid = 81% of total. Winner - Loser = 54% - 46% = 8% of valid. 0.08 * 0.81 * Total = 1620 => 0.0648 * Total = 1620 => Total = 25000
      return this.makeQuestion({
        topic: 'Percentage',
        difficulty,
        question: `In an election between two candidates, 10% of voters did not cast their vote and 10% of the votes polled were found invalid. The winning candidate got 54% of the valid votes and won by a margin of 1620 votes. Find the total number of enrolled voters.\nएक चुनाव में दो उम्मीदवारों के बीच, 10% मतदाताओं ने अपना मत नहीं डाला और डाले गए मतों का 10% अवैध पाया गया। जीतने वाले उम्मीदवार को वैध मतों का 54% मत प्राप्त हुआ और वह 1620 मतों से विजयी हुआ। नामांकित मतदाताओं की कुल संख्या ज्ञात कीजिए।`,
        correctAnswerText: '25000',
        wrongAnswers: ['20000', '30000', '22500'],
        explanation: `Let total voters = 100x. Votes polled = 90x. Valid votes = 90% of 90x = 81x. Majority = (54% - 46%) of 81x = 8% of 81x = 6.48x. 6.48x = 1620 => x = 250 => Total voters = 100 × 250 = 25000.\nवैध मत = 81x। अंतर = 6.48x = 1620 => कुल मतदाता = 25000।`
      });
    } else if (p === 1) {
      // Price reduction allows buying k kg more for ₹P
      const r = 20; // 20% reduction
      const extraKg = 5;
      const budget = 600;
      const reducedPrice = (budget * (r / 100)) / extraKg; // 120 / 5 = 24
      const originalPrice = reducedPrice / (1 - r / 100); // 24 / 0.8 = 30
      return this.makeQuestion({
        topic: 'Percentage',
        difficulty,
        question: `Due to a 20% reduction in the price of sugar, a consumer can purchase 5 kg more sugar for ₹600. What was the original price per kg of sugar?\nचीनी के मूल्य में 20% की कमी होने के कारण एक उपभोक्ता ₹600 में 5 किग्रा अधिक चीनी खरीद सकता है। चीनी का प्रारंभिक (मूल) मूल्य प्रति किग्रा क्या था?`,
        correctAnswerText: `₹${originalPrice} / kg`,
        wrongAnswers: [`₹${reducedPrice} / kg`, `₹${originalPrice + 6} / kg`, `₹${originalPrice - 4} / kg`],
        explanation: `Money saved = 20% of ₹600 = ₹120 for 5 kg => Reduced price = 120 / 5 = ₹24/kg. Original price = 24 / 0.80 = ₹30/kg.\nघटा हुआ मूल्य = 120 / 5 = ₹24 प्रति किग्रा। प्रारंभिक मूल्य = 24 / 0.80 = ₹30 प्रति किग्रा।`
      });
    } else if (p === 2) {
      // Venn diagram two subjects passing
      // English failed 35%, Math failed 40%, both 20%. Both passed = 450
      return this.makeQuestion({
        topic: 'Percentage',
        difficulty,
        question: `In an examination, 35% of candidates failed in English, 40% failed in Mathematics, and 20% failed in both subjects. If 450 candidates passed in both subjects, find the total number of candidates who appeared in the examination.\nएक परीक्षा में, 35% अभ्यर्थी अंग्रेजी में, 40% गणित में और 20% दोनों विषयों में अनुत्तीर्ण हुए। यदि 450 अभ्यर्थी दोनों विषयों में उत्तीर्ण हुए, तो परीक्षा में बैठने वाले कुल अभ्यर्थियों की संख्या ज्ञात कीजिए।`,
        correctAnswerText: '1000',
        wrongAnswers: ['900', '1200', '850'],
        explanation: `Percentage failed in at least one subject = 35% + 40% - 20% = 55%. Percentage passed in both = 100% - 55% = 45%. 45% of Total = 450 => Total = 1000 candidates.\nकम से कम एक में अनुत्तीर्ण = 55%। दोनों में उत्तीर्ण = 45% = 450 => कुल अभ्यर्थी = 1000।`
      });
    } else if (p === 3) {
      // Income tax increase and net income decrease
      return this.makeQuestion({
        topic: 'Percentage',
        difficulty,
        question: `If the rate of income tax is increased by 19%, the net income is reduced by 1%. What is the rate of income tax?\nयदि आयकर की दर में 19% की वृद्धि हो जाती है, तो शुद्ध आय 1% कम हो जाती है। आयकर की प्रारंभिक दर क्या है?`,
        correctAnswerText: '5%',
        wrongAnswers: ['4%', '6%', '7.5%'],
        explanation: `Tax × 19% = Net Income × 1% => Tax / Net Income = 1 / 19. Total Income = Tax + Net Income = 1 + 19 = 20. Tax rate = (1 / 20) × 100 = 5%.\nकर / शुद्ध आय = 1 / 19 => कुल आय = 20। कर की दर = (1 / 20) × 100 = 5%।`
      });
    } else {
      // 3D dimension percentage change on cylinder
      return this.makeQuestion({
        topic: 'Percentage',
        difficulty,
        question: `If the radius of a cylinder is increased by 20% and its height is decreased by 25%, what is the percentage change in its volume?\nयदि एक बेलन की त्रिज्या में 20% की वृद्धि तथा उसकी ऊंचाई में 25% की कमी की जाए, तो उसके आयतन में कितने प्रतिशत का परिवर्तन होगा?`,
        correctAnswerText: '8% Increase / वृद्धि',
        wrongAnswers: ['5% Decrease / कमी', '10% Increase / वृद्धि', 'No change / कोई परिवर्तन नहीं'],
        explanation: `Volume V = π r² h. Multiplier = (1.20)² × (0.75) = 1.44 × 0.75 = 1.08. This corresponds to an 8% increase.\nआयतन गुणक = (1.2)² × 0.75 = 1.08 => 8% की वृद्धि।`
      });
    }
  }

  // === 6. PROFIT AND LOSS & DISCOUNT (KIRAN SSC ADVANCED) ===
  static generateProfitLoss(variantIndex, difficulty) {
    const p = this.h(variantIndex, 2800) % 5;
    if (p === 0) {
      // Dishonest dealer markup + false weight
      return this.makeQuestion({
        topic: 'Profit and Loss',
        difficulty,
        question: `A dishonest shopkeeper marks his goods 20% above the cost price and uses a false weight of 800 grams instead of 1 kg. What is his overall profit percentage?\nएक बेईमान दुकानदार अपनी वस्तुओं पर क्रय मूल्य से 20% अधिक अंकित करता है और 1 किग्रा के स्थान पर 800 ग्राम के गलत बाट का उपयोग करता है। उसका कुल लाभ प्रतिशत क्या है?`,
        correctAnswerText: '50%',
        wrongAnswers: ['40%', '45%', '55%'],
        explanation: `Profit factor = (120 / 100) × (1000 / 800) = 1.2 × 1.25 = 1.50 => 50% profit.\nलाभ गुणक = (1.2) × (1000/800) = 1.50 => 50% कुल लाभ।`
      });
    } else if (p === 1) {
      // Two articles sold at same SP: one profit, one loss
      const sp = 1920;
      const pct = 20;
      // CP1 = 1920 / 1.2 = 1600. CP2 = 1920 / 0.8 = 2400. Total CP = 4000. Total SP = 3840. Loss = 160
      return this.makeQuestion({
        topic: 'Profit and Loss',
        difficulty,
        question: `A person sold two articles for ₹${sp} each. On one he gained 20% and on the other he lost 20%. What was his overall loss or gain in rupees?\nएक व्यक्ति ने दो वस्तुएं प्रत्येक ₹${sp} में बेचीं। एक पर उसे 20% का लाभ हुआ तथा दूसरी पर 20% की हानि हुई। रुपयों में उसका कुल लाभ या हानि ज्ञात कीजिए।`,
        correctAnswerText: 'Loss of ₹160 / ₹160 की हानि',
        wrongAnswers: ['Gain of ₹160 / ₹160 का लाभ', 'Loss of ₹120 / ₹120 की हानि', 'No loss no gain / न लाभ न हानि'],
        explanation: `Overall loss % = (20² / 100)% = 4%. Total SP = 2 × 1920 = ₹3840. Total CP = 3840 / 0.96 = ₹4000. Loss = 4000 - 3840 = ₹160.\nकुल हानि = (20²/100)% = 4%। कुल क्रय मूल्य = ₹4000। हानि = ₹160।`
      });
    } else if (p === 2) {
      // Relation between MP, discount and profit
      return this.makeQuestion({
        topic: 'Profit and Loss',
        difficulty,
        question: `After allowing a discount of 10% on the marked price of an article, a merchant still makes a profit of 20%. By what percentage is the marked price higher than the cost price?\nएक वस्तु के अंकित मूल्य पर 10% की छूट देने के बाद भी एक व्यापारी को 20% का लाभ होता है। अंकित मूल्य, क्रय मूल्य से कितने प्रतिशत अधिक है?`,
        correctAnswerText: '33.33%',
        wrongAnswers: ['30%', '25%', '35%'],
        explanation: `Formula: MP / CP = (100 + Profit%) / (100 - Discount%) = (100 + 20) / (100 - 10) = 120 / 90 = 4 / 3. Markup % = [(4 - 3) / 3] × 100 = 33.33%.\nअंकित मूल्य / क्रय मूल्य = 120 / 90 = 4/3 => वृद्धि = (1/3) × 100 = 33.33%।`
      });
    } else if (p === 3) {
      // Selling at fraction of MP gives loss
      return this.makeQuestion({
        topic: 'Profit and Loss',
        difficulty,
        question: `By selling an article at 2/3 of its marked price, there is a loss of 10%. What will be the profit percentage if it is sold at the marked price?\nकिसी वस्तु को उसके अंकित मूल्य के 2/3 पर बेचने पर 10% की हानि होती है। यदि उसे अंकित मूल्य पर ही बेचा जाए, तो लाभ प्रतिशत क्या होगा?`,
        correctAnswerText: '35%',
        wrongAnswers: ['30%', '40%', '25%'],
        explanation: `Let MP = 100. SP = 200/3. Since there is a 10% loss: CP = (200/3) / 0.9 = 2000 / 27. Profit at MP = 100 - (2000/27) = 700/27. Profit % = [(700/27) / (2000/27)] × 100 = 35%.\nक्रय मूल्य = 2000/27। अंकित मूल्य 100 पर बेचने पर लाभ = 35%।`
      });
    } else {
      // Buy 3 Get 1 Free + 20% discount
      return this.makeQuestion({
        topic: 'Discount',
        difficulty,
        question: `A shopkeeper offers 'Buy 3 Get 1 Free' and gives an additional discount of 20% to customers. What is the effective total discount percentage offered?\nएक दुकानदार '3 खरीदने पर 1 मुफ्त' की योजना देता है और ग्राहकों को 20% की अतिरिक्त छूट भी देता है। दी जाने वाली प्रभावी कुल छूट का प्रतिशत क्या है?`,
        correctAnswerText: '40%',
        wrongAnswers: ['45%', '35%', '50%'],
        explanation: `First discount from free article = 1 / 4 = 25%. Additional discount = 20%. Equivalent discount = 25 + 20 - (25 × 20)/100 = 45 - 5 = 40%.\nप्रथमतः छूट = 25%। अतिरिक्त = 20%। समतुल्य एकल छूट = 25 + 20 - 5 = 40%।`
      });
    }
  }

  static generateDiscount(variantIndex, difficulty) {
    return this.generateProfitLoss(variantIndex, difficulty);
  }

  // === 7. SIMPLE AND COMPOUND INTEREST (KIRAN SSC ADVANCED) ===
  static generateSimpleInterest(variantIndex, difficulty) {
    const p = this.h(variantIndex, 2900) % 4;
    if (p === 0) {
      // Difference between CI and SI for 3 years
      const P = 10000;
      const R = 10;
      // D = P(R/100)^2 (3 + R/100) = 10000 * 0.01 * 3.1 = 310
      return this.makeQuestion({
        topic: 'Compound Interest',
        difficulty,
        question: `If the difference between the compound interest and simple interest on a certain sum of money for 3 years at 10% per annum is ₹310, find the principal sum.\nयदि किसी धनराशि पर 10% वार्षिक दर से 3 वर्षों के चक्रवृद्धि ब्याज और साधारण ब्याज का अंतर ₹310 है, तो वह धनराशि ज्ञात कीजिए।`,
        correctAnswerText: '₹10000',
        wrongAnswers: ['₹8000', '₹12000', '₹15000'],
        explanation: `Difference for 3 years: D = P(R/100)² × (3 + R/100) => 310 = P(0.01) × (3.1) => 310 = 0.031 P => P = ₹10000.\n3 वर्ष के अंतर का सूत्र: D = P(R/100)² × (3 + R/100) => P = ₹10000।`
      });
    } else if (p === 1) {
      // Sum doubles in T years at SI, become n times
      return this.makeQuestion({
        topic: 'Simple Interest',
        difficulty,
        question: `A sum of money doubles itself in 7 years at simple interest. In how many years will it become 5 times of itself at the same rate?\nकोई धनराशि साधारण ब्याज की दर से 7 वर्षों में दोगुनी हो जाती है। वही धनराशि उसी दर से कितने वर्षों में 5 गुनी हो जाएगी?`,
        correctAnswerText: '28 Years / वर्ष',
        wrongAnswers: ['35 Years / वर्ष', '21 Years / वर्ष', '24 Years / वर्ष'],
        explanation: `Formula: (n1 - 1) / T1 = (n2 - 1) / T2 => (2 - 1) / 7 = (5 - 1) / T2 => 1/7 = 4 / T2 => T2 = 28 years.\nसाधारण ब्याज के नियम से: 1/7 = 4/T2 => T2 = 28 वर्ष।`
      });
    } else if (p === 2) {
      // CI amount in 2 years and 3 years
      const A2 = 2420;
      const A3 = 2662;
      // R = (2662 - 2420) / 2420 * 100 = 242 / 2420 * 100 = 10%
      // P = 2420 / (1.1)^2 = 2000
      return this.makeQuestion({
        topic: 'Compound Interest',
        difficulty,
        question: `A sum of money amounts to ₹2420 in 2 years and to ₹2662 in 3 years at compound interest compounded annually. Find the rate of interest and the principal.\nकोई धनराशि चक्रवृद्धि ब्याज पर 2 वर्षों में ₹2420 तथा 3 वर्षों में ₹2662 हो जाती है। ब्याज की वार्षिक दर और मूलधन ज्ञात कीजिए।`,
        correctAnswerText: '10% and ₹2000 / 10% तथा ₹2000',
        wrongAnswers: ['12% and ₹2000', '10% and ₹2200', '8% and ₹2000'],
        explanation: `1 year interest on ₹2420 = 2662 - 2420 = ₹242. Rate R = (242 / 2420) × 100 = 10%. Principal P = 2420 / (1.1)² = ₹2000.\n1 वर्ष का ब्याज = ₹242 => दर = 10%। मूलधन = 2420 / 1.21 = ₹2000।`
      });
    } else {
      // Equal annual installments at CI
      return this.makeQuestion({
        topic: 'Compound Interest',
        difficulty,
        question: `A loan of ₹2100 is repaid in two equal annual installments at 10% per annum compound interest. What is the value of each installment?\n₹2100 का ऋण 10% वार्षिक चक्रवृद्धि ब्याज की दर से दो समान वार्षिक किश्तों में चुकाया जाता है। प्रत्येक किश्त की राशि क्या होगी?`,
        correctAnswerText: '₹1210',
        wrongAnswers: ['₹1150', '₹1200', '₹1250'],
        explanation: `P = x / (1 + R/100) + x / (1 + R/100)² => 2100 = x/(1.1) + x/(1.21) = (1.1x + x)/1.21 = 2.1x / 1.21 => x = (2100 × 1.21) / 2.1 = ₹1210.\nकिश्त समीकरण से: 2.1x / 1.21 = 2100 => x = ₹1210।`
      });
    }
  }

  static generateCompoundInterest(variantIndex, difficulty) {
    return this.generateSimpleInterest(variantIndex, difficulty);
  }

  // === 8. TIME AND WORK & PIPES (KIRAN SSC ADVANCED) ===
  static generateTimeWork(variantIndex, difficulty) {
    const p = this.h(variantIndex, 3000) % 12;
    if (p === 0) {
      // 3 Workers with Leaving at Different Times (Kiran Type-II/III Tier-2)
      return this.makeQuestion({
        topic: 'Time and Work',
        difficulty,
        question: `A, B, and C can complete a work in 24, 36, and 48 days respectively. They started the work together, but C left after 4 days from the start, and A left 3 days before the completion of the work. In how many days was the entire work completed?\nA, B और C किसी कार्य को क्रमशः 24, 36 और 48 दिनों में पूरा कर सकते हैं। उन्होंने एक साथ कार्य शुरू किया, लेकिन C ने कार्य शुरू होने के 4 दिन बाद काम छोड़ दिया तथा A ने कार्य समाप्त होने से 3 दिन पहले काम छोड़ दिया। पूरा कार्य कितने दिनों में समाप्त हुआ?`,
        correctAnswerText: '15 Days / दिन',
        wrongAnswers: ['18 Days / दिन', '12 Days / दिन', '16 Days / दिन'],
        explanation: `Total Work = LCM(24, 36, 48) = 144 units. Daily rates: A = 6, B = 4, C = 3. C's 4 days work = 4 × 3 = 12 units. Remaining work = 144 - 12 = 132 units. Adding A's 3 days work: 132 + (3 × 6) = 150 units. Work done by A and B together = 150 / (6 + 4) = 15 days.\nकुल कार्य = 144 इकाई। A=6, B=4, C=3। C का 4 दिन का काम = 12 इकाई। शेष = 132 इकाई। A के 3 दिन का कार्य जोड़ने पर = 150 इकाई। कुल समय = 150 / 10 = 15 दिन।`
      });
    } else if (p === 1) {
      // 3 Workers Alternate Days with Assistance (Kiran Type-IV Tier-2)
      return this.makeQuestion({
        topic: 'Time and Work',
        difficulty,
        question: `A, B, and C can complete a piece of work in 20, 30, and 60 days respectively. In how many days can A complete the work if he is assisted by B and C on every third day?\nA, B और C किसी कार्य को क्रमशः 20, 30 और 60 दिनों में पूरा कर सकते हैं। A उस कार्य को कितने दिनों में पूरा कर सकता है यदि प्रत्येक तीसरे दिन B और C उसकी सहायता करते हैं?`,
        correctAnswerText: '15 Days / दिन',
        wrongAnswers: ['12 Days / दिन', '16 Days / दिन', '18 Days / दिन'],
        explanation: `Total Work = LCM(20, 30, 60) = 60 units. Efficiency: A = 3, B = 2, C = 1. Day 1: A does 3. Day 2: A does 3. Day 3: A+B+C do 6. Work done in 3 days = 3 + 3 + 6 = 12 units. Total cycles = 60 / 12 = 5 cycles. Total days = 5 × 3 = 15 days.\n3 दिनों के एक चक्र में कार्य = 3 + 3 + 6 = 12 इकाई। कुल चक्र = 60 / 12 = 5 चक्र। कुल समय = 5 × 3 = 15 दिन।`
      });
    } else if (p === 2) {
      // Wages Distribution by Work Done (Kiran Type-V Tier-2)
      return this.makeQuestion({
        topic: 'Time and Work',
        difficulty,
        question: `A, B, and C contract a piece of work for ₹5,750. A and B together do 19/23 of the total work, while B and C together do 8/23 of the work. What is the individual wage of B in rupees?\nA, B और C ₹5,750 में एक कार्य करने का ठेका लेते हैं। A और B मिलकर कुल कार्य का 19/23 भाग करते हैं, जबकि B और C मिलकर कार्य का 8/23 भाग करते हैं। रुपयों में B की व्यक्तिगत मजदूरी क्या होगी?`,
        correctAnswerText: '₹1000',
        wrongAnswers: ['₹1250', '₹750', '₹1500'],
        explanation: `Work done by C = 1 - 19/23 = 4/23. Since B and C together do 8/23, work done by B = 8/23 - 4/23 = 4/23. Share of B = (4 / 23) × ₹5750 = 4 × 250 = ₹1,000.\nC का कार्य = 1 - 19/23 = 4/23। B का कार्य = 8/23 - 4/23 = 4/23। B का हिस्सा = (4/23) × 5750 = ₹1,000।`
      });
    } else if (p === 3) {
      // Real Tier-2 Pipe Cistern with Leak & Inflow Rate (Kiran Type-IV Pipes)
      return this.makeQuestion({
        topic: 'Pipes and Cistern',
        difficulty,
        question: `A leak in the bottom of a water tank can empty the entire tank in 8 hours. An inlet tap admits water into the tank at the rate of 6 liters per minute. When the tank is full, the tap is opened and due to the leak, the tank is emptied in 12 hours. What is the capacity of the tank in liters?\nएक पानी की टंकी की तली में एक छेद (रिसाव) पूरी टंकी को 8 घंटे में खाली कर सकता है। एक प्रवेश नल टंकी में 6 लीटर प्रति मिनट की दर से पानी भरता है। टंकी पूरी भरी होने पर नल खोल दिया जाता है और छेद के कारण टंकी 12 घंटे में खाली हो जाती है। टंकी की धारिता (लीटर में) क्या है?`,
        correctAnswerText: '8640 Liters / लीटर',
        wrongAnswers: ['7200 Liters / लीटर', '9600 Liters / लीटर', '8000 Liters / लीटर'],
        explanation: `Inflow rate of tap = 1/8 - 1/12 = (3 - 2)/24 = 1/24 tank per hour. Time for tap alone to fill tank = 24 hours. Rate = 6 L/min = 360 L/hr. Capacity = 24 × 360 = 8,640 liters.\nनल की भरने की दर = 1/8 - 1/12 = 1/24 प्रति घंटा। भरने का समय = 24 घंटे। क्षमता = 24 × 360 = 8,640 लीटर।`
      });
    } else if (p === 4) {
      // Half Tank Filled, Then Identical Taps Opened (Kiran Type-IV/V Pipes)
      return this.makeQuestion({
        topic: 'Pipes and Cistern',
        difficulty,
        question: `A tap can fill an overhead tank in 6 hours. After half the tank is filled, three more similar taps are opened. What is the total time taken to fill the tank completely?\nएक नल किसी टंकी को 6 घंटे में भर सकता है। आधी टंकी भरने के बाद, ऐसे ही तीन और नल खोल दिए जाते हैं। टंकी को पूरा भरने में कुल कितना समय लगेगा?`,
        correctAnswerText: '3 Hours 45 Minutes / 3 घंटे 45 मिनट',
        wrongAnswers: ['4 Hours / 4 घंटे', '3 Hours 30 Minutes / 3 घंटे 30 मिनट', '4 Hours 15 Minutes / 4 घंटे 15 मिनट'],
        explanation: `Time to fill first half = 6 / 2 = 3 hours. Remaining half: 4 identical taps work together. Time for remaining half = 3 hours / 4 = 45 minutes. Total time = 3 hours + 45 minutes = 3 hours 45 minutes.\nआधी टंकी भरने में = 3 घंटे। शेष आधी टंकी के लिए 4 नल = 3/4 घंटा = 45 मिनट। कुल समय = 3 घंटे 45 मिनट।`
      });
    } else if (p === 5) {
      // Quadratic Time Relation T = sqrt(a * b) (Kiran Type-VI Tier-2)
      return this.makeQuestion({
        topic: 'Time and Work',
        difficulty,
        question: `A alone takes 18 days more to complete a work than A and B together, while B alone takes 8 days more to complete it than A and B together. In how many days can A and B working together finish the entire work?\nA को किसी कार्य को अकेले पूरा करने में A और B द्वारा मिलकर किए गए समय से 18 दिन अधिक लगते हैं, जबकि B को अकेले कार्य पूरा करने में A और B द्वारा मिलकर किए गए समय से 8 दिन अधिक लगते हैं। A और B मिलकर उस कार्य को कितने दिनों में समाप्त कर लेंगे?`,
        correctAnswerText: '12 Days / दिन',
        wrongAnswers: ['9 Days / दिन', '15 Days / दिन', '16 Days / दिन'],
        explanation: `Formula: Time taken by (A + B) together = √(Extra days of A × Extra days of B) = √(18 × 8) = √144 = 12 days.\nसूत्र: (A + B) का समय = √(a × b) = √(18 × 8) = 12 दिन।`
      });
    } else if (p === 6) {
      // Multi-category Workers (Men, Women, Boys Equivalence - Kiran Type-VII)
      return this.makeQuestion({
        topic: 'Time and Work',
        difficulty,
        question: `3 men, 4 women, and 6 children can complete a work in 7 days. A woman does double the work a man does, and a child does half the work a man does. How many women alone can complete the same work in 7 days?\n3 पुरुष, 4 महिलाएं और 6 बच्चे एक कार्य को 7 दिनों में पूरा कर सकते हैं। एक महिला एक पुरुष से दोगुना कार्य करती है और एक बच्चा एक पुरुष से आधा कार्य करता है। कितनी महिलाएं अकेली उसी कार्य को 7 दिनों में पूरा कर सकती हैं?`,
        correctAnswerText: '7 Women / महिलाएं',
        wrongAnswers: ['6 Women / महिलाएं', '8 Women / महिलाएं', '9 Women / महिलाएं'],
        explanation: `Let efficiency of Child = 1 unit, Man = 2 units, Woman = 4 units. Daily work = 3(2) + 4(4) + 6(1) = 6 + 16 + 6 = 28 units. Total work = 28 × 7 units. Work done by 1 woman in 7 days = 4 × 7 = 28 units. Number of women required = (28 × 7) / 28 = 7 women.\nबच्चा=1, पुरुष=2, महिला=4 इकाई। 1 दिन का कार्य = 28 इकाई। 1 महिला 7 दिन में 28 इकाई करेगी। आवश्यक महिलाएं = 7।`
      });
    } else if (p === 7) {
      // Staggered Opening of 3 Pipes (Kiran Type-IV Pipes)
      return this.makeQuestion({
        topic: 'Pipes and Cistern',
        difficulty,
        question: `Two pipes A and B can fill a cistern in 15 hours and 20 hours respectively, while a third pipe C can empty it in 25 hours. All three pipes are opened at the same time. After 10 hours, pipe C is closed. In how many total hours will the cistern be completely filled?\nदो नल A और B किसी टंकी को क्रमशः 15 घंटे और 20 घंटे में भर सकते हैं, जबकि एक तीसरा नल C इसे 25 घंटे में खाली कर सकता है। तीनों नलों को एक साथ खोल दिया जाता है। 10 घंटे बाद नल C को बंद कर दिया जाता है। टंकी को पूरा भरने में कुल कितने घंटे लगेंगे?`,
        correctAnswerText: '12 Hours / घंटे',
        wrongAnswers: ['14 Hours / घंटे', '11 Hours / घंटे', '13.5 Hours / घंटे'],
        explanation: `Total capacity = LCM(15, 20, 25) = 300 units. Efficiency: A = +20, B = +15, C = -12. Combined efficiency = 20 + 15 - 12 = 23 units/hr. In 10 hours, filled = 23 × 10 = 230 units. Remaining = 300 - 230 = 70 units. With C closed, rate of (A + B) = 35 units/hr. Additional time = 70 / 35 = 2 hours. Total time = 10 + 2 = 12 hours.\nकुल क्षमता = 300 इकाई। 10 घंटे में भरा = 230 इकाई। शेष 70 इकाई A+B द्वारा 2 घंटे में भरी जाएगी। कुल समय = 10 + 2 = 12 घंटे।`
      });
    } else if (p === 8) {
      // Work Equivalence: 6 men & 8 boys in 10 days vs 26 men & 48 boys in 2 days
      return this.makeQuestion({
        topic: 'Time and Work',
        difficulty,
        question: `If 6 men and 8 boys can complete a work in 10 days, while 26 men and 48 boys can complete it in 2 days, how many days will 15 men and 20 boys take to complete the same work?\nयदि 6 पुरुष और 8 लड़के किसी कार्य को 10 दिनों में पूरा कर सकते हैं, जबकि 26 पुरुष और 48 लड़के इसे 2 दिनों में पूरा कर सकते हैं, तो 15 पुरुष और 20 लड़के उसी कार्य को कितने दिनों में पूरा करेंगे?`,
        correctAnswerText: '4 Days / दिन',
        wrongAnswers: ['5 Days / दिन', '6 Days / दिन', '3 Days / दिन'],
        explanation: `Equating work: (6M + 8B) × 10 = (26M + 48B) × 2 => 60M + 80B = 52M + 96B => 8M = 16B => 1 Man = 2 Boys. Total work = (6×2 + 8) × 10 = 200 Boy-days. 15 Men + 20 Boys = 15(2) + 20 = 50 Boys. Time = 200 / 50 = 4 days.\nकार्य समीकरण से: 1 पुरुष = 2 लड़के। कुल कार्य = 200 लड़का-दिन। 15 पुरुष + 20 लड़के = 50 लड़के। समय = 200 / 50 = 4 दिन।`
      });
    } else if (p === 9) {
      // Pipe flow proportional to square of diameter (Classic SSC CGL Tier-2)
      return this.makeQuestion({
        topic: 'Pipes and Cistern',
        difficulty,
        question: `Three pipes of diameters 1 cm, 4/3 cm, and 2 cm are connected to a water reservoir. The rate of water flow through each pipe is proportional to the square of its diameter. The largest pipe alone can fill the reservoir in 61 minutes. How much time will all three pipes together take to fill the empty reservoir?\nएक जलाशय से 1 सेमी, 4/3 सेमी और 2 सेमी व्यास वाले तीन पाइप जुड़े हैं। प्रत्येक पाइप से पानी के प्रवाह की दर उसके व्यास के वर्ग के समानुपाती है। सबसे बड़ा पाइप अकेले जलाशय को 61 मिनट में भर सकता है। तीनों पाइप एक साथ मिलकर खाली जलाशय को कितने समय में भर देंगे?`,
        correctAnswerText: '36 Minutes / मिनट',
        wrongAnswers: ['42 Minutes / मिनट', '30 Minutes / मिनट', '45 Minutes / मिनट'],
        explanation: `Ratio of diameters squared: 1² : (4/3)² : 2² = 1 : 16/9 : 4 = 9 : 16 : 36. Capacity of reservoir = 36 × 61 units. Total rate of all three pipes = 9 + 16 + 36 = 61 units/min. Time taken together = (36 × 61) / 61 = 36 minutes.\nप्रवाह दर अनुपात = 9 : 16 : 36। कुल क्षमता = 36 × 61 इकाई। तीनों का प्रवाह = 61 इकाई/मिनट। कुल समय = 36 मिनट।`
      });
    } else if (p === 10) {
      // Builder and Destroyer on alternate days
      return this.makeQuestion({
        topic: 'Time and Work',
        difficulty,
        question: `A can build a wall in 20 days, while B can demolish it completely in 30 days. Both work on alternate days starting with A on the first day. In how many days will the wall be completely built for the first time?\nA किसी दीवार को 20 दिनों में बना सकता है, जबकि B इसे 30 दिनों में पूरी तरह गिरा (ध्वस्त कर) सकता है। दोनों A से शुरू करके एकान्तर दिनों में कार्य करते हैं। पहली बार दीवार पूरी तरह कितने दिनों में बनकर तैयार हो जाएगी?`,
        correctAnswerText: '115 Days / दिन',
        wrongAnswers: ['120 Days / दिन', '118 Days / दिन', '110 Days / दिन'],
        explanation: `Total work = LCM(20, 30) = 60 units. Efficiency: A = +3, B = -2. In a 2-day cycle, net work = +1 unit. To avoid overshoot on A's final turn, target 60 - 3 = 57 units. Time for 57 units = 57 × 2 = 114 days. On the 115th day, A builds the remaining 3 units: 57 + 3 = 60 units. Total time = 115 days.\n2 दिन में 1 इकाई। 57 इकाई = 114 दिन। 115वें दिन A 3 इकाई बनाकर दीवार पूरी कर देगा। अतः कुल समय = 115 दिन।`
      });
    } else {
      // Garrison Food Provision with Soldiers Leaving
      return this.makeQuestion({
        topic: 'Time and Work',
        difficulty,
        question: `In a fort, there was sufficient food for 200 soldiers for 31 days. After 27 days, 120 soldiers left the fort. For how many extra days will the remaining food last for the remaining soldiers beyond the original 31 days?\nएक किले में 200 सैनिकों के लिए 31 दिनों के लिए पर्याप्त भोजन था। 27 दिनों के बाद, 120 सैनिक किला छोड़कर चले गए। शेष भोजन शेष सैनिकों के लिए मूल 31 दिनों से कितने अतिरिक्त दिन चलेगा?`,
        correctAnswerText: '6 Extra Days / 6 अतिरिक्त दिन',
        wrongAnswers: ['8 Extra Days / अतिरिक्त दिन', '5 Extra Days / अतिरिक्त दिन', '10 Extra Days / अतिरिक्त दिन'],
        explanation: `Food remaining after 27 days = 200 soldiers × 4 days = 800 soldier-days. Remaining soldiers = 200 - 120 = 80 soldiers. Food will last for = 800 / 80 = 10 days. Originally scheduled remaining days = 4 days. Extra days = 10 - 4 = 6 days.\n27 दिन बाद शेष भोजन = 200 × 4 = 800 सैनिक-दिन। शेष 80 सैनिकों के लिए = 10 दिन चलेगा। अतिरिक्त दिन = 10 - 4 = 6 दिन।`
      });
    }
  }

  static generatePipeCistern(variantIndex, difficulty) {
    return this.generateTimeWork(variantIndex, difficulty);
  }

  // === 9. TIME, SPEED AND DISTANCE & BOATS (KIRAN SSC ADVANCED) ===
  static generateTimeDistance(variantIndex, difficulty) {
    const p = this.h(variantIndex, 3100) % 5;
    if (p === 0) {
      // Early and late arrival
      // S1 = 4 km/h late 5 min, S2 = 5 km/h early 10 min. Delta T = 15 min = 1/4 hr
      // D = (4 * 5) / (5 - 4) * (15/60) = 20 * 1/4 = 5 km
      return this.makeQuestion({
        topic: 'Speed, Time and Distance',
        difficulty,
        question: `If a student walks at 4 km/h, he reaches school 5 minutes late. If he increases his speed to 5 km/h, he reaches 10 minutes early. What is the distance between his home and the school?\nयदि कोई छात्र 4 किमी/घंटा की गति से चलता है, तो वह विद्यालय 5 मिनट देरी से पहुंचता है। यदि वह अपनी गति बढ़ाकर 5 किमी/घंटा कर देता है, तो वह 10 मिनट पहले पहुंच जाता है। उसके घर और विद्यालय के बीच की दूरी क्या है?`,
        correctAnswerText: '5 km / किमी',
        wrongAnswers: ['4 km / किमी', '6 km / किमी', '4.5 km / किमी'],
        explanation: `Distance formula: D = [S1 × S2 / (S2 - S1)] × (Difference in time) = (4 × 5 / 1) × (15 / 60) = 20 × 0.25 = 5 km.\nदूरी सूत्र: D = (4 × 5 / 1) × (15/60) = 5 किमी।`
      });
    } else if (p === 1) {
      // Stoppage time per hour
      // S1 = 54, S2 = 45 => Stoppage = (54 - 45)/54 * 60 = 9/54 * 60 = 10 min
      return this.makeQuestion({
        topic: 'Speed, Time and Distance',
        difficulty,
        question: `Excluding stoppages, the speed of a bus is 54 km/h, and including stoppages, it is 45 km/h. For how many minutes does the bus stop per hour?\nठहरावों को छोड़कर एक बस की गति 54 किमी/घंटा है तथा ठहरावों सहित 45 किमी/घंटा है। बस प्रति घंटा कितने मिनट रुकती है?`,
        correctAnswerText: '10 Minutes / मिनट',
        wrongAnswers: ['9 Minutes / मिनट', '12 Minutes / मिनट', '8 Minutes / मिनट'],
        explanation: `Stoppage time per hour = [(Speed without stoppage - Speed with stoppage) / Speed without stoppage] × 60 = [(54 - 45) / 54] × 60 = (9/54) × 60 = 10 minutes.\nप्रति घंटा ठहराव = (9/54) × 60 = 10 मिनट।`
      });
    } else if (p === 2) {
      // Meeting and reaching destinations: S1/S2 = sqrt(T2/T1)
      // T1 = 4 hrs, T2 = 9 hrs, S1 = 45 km/h => S1/S2 = sqrt(9/4) = 3/2 => S2 = 45 * 2/3 = 30 km/h
      return this.makeQuestion({
        topic: 'Speed, Time and Distance',
        difficulty,
        question: `Two trains start at the same time from stations A and B towards each other. After crossing each other, they take 4 hours and 9 hours respectively to reach their destinations. If the speed of the first train is 45 km/h, what is the speed of the second train?\nदो ट्रेनें एक ही समय पर स्टेशनों A और B से एक दूसरे की ओर चलना शुरू करती हैं। एक-दूसरे को पार करने के बाद, वे अपने गंतव्य तक पहुंचने में क्रमशः 4 घंटे और 9 घंटे का समय लेती हैं। यदि पहली ट्रेन की गति 45 किमी/घंटा है, तो दूसरी ट्रेन की गति क्या होगी?`,
        correctAnswerText: '30 km/h / किमी/घंटा',
        wrongAnswers: ['36 km/h / किमी/घंटा', '28 km/h / किमी/घंटा', '32 km/h / किमी/घंटा'],
        explanation: `Formula: S1 / S2 = √(T2 / T1) => 45 / S2 = √(9 / 4) = 3 / 2 => S2 = (45 × 2) / 3 = 30 km/h.\nसूत्र से: 45 / S2 = √(9/4) = 3/2 => S2 = 30 किमी/घंटा।`
      });
    } else if (p === 3) {
      // Boat and stream system of equations
      // 24 km upstream and 36 km downstream in 6 hours; 36 upstream and 24 downstream in 6.5 hours
      // Let u = 1/downstream, v = 1/upstream. 36u + 24v = 6, 24u + 36v = 6.5
      // Downstream speed = 12 km/h, Upstream speed = 8 km/h
      // Still water speed = (12 + 8)/2 = 10 km/h, Stream = 2 km/h
      return this.makeQuestion({
        topic: 'Boats and Streams',
        difficulty,
        question: `A boat covers 24 km upstream and 36 km downstream in 6 hours. It also covers 36 km upstream and 24 km downstream in 6.5 hours. What is the speed of the boat in still water?\nएक नाव 6 घंटे में 24 किमी धारा के प्रतिकूल (upstream) तथा 36 किमी धारा के अनुकूल (downstream) दूरी तय करती है। यह 6.5 घंटे में 36 किमी प्रतिकूल तथा 24 किमी अनुकूल दूरी तय करती है। शांत जल में नाव की गति क्या है?`,
        correctAnswerText: '10 km/h / किमी/घंटा',
        wrongAnswers: ['8 km/h / किमी/घंटा', '12 km/h / किमी/घंटा', '9 km/h / किमी/घंटा'],
        explanation: `Solving simultaneous equations gives Downstream speed = 12 km/h and Upstream speed = 8 km/h. Speed of boat in still water = (12 + 8) / 2 = 10 km/h.\nधारा के अनुकूल = 12 किमी/घंटा, प्रतिकूल = 8 किमी/घंटा। शांत जल में नाव की गति = (12 + 8)/2 = 10 किमी/घंटा।`
      });
    } else {
      // Relative speed trains crossing
      return this.makeQuestion({
        topic: 'Speed, Time and Distance',
        difficulty,
        question: `Two trains 140 m and 160 m long are running at 60 km/h and 40 km/h respectively in opposite directions on parallel tracks. How much time will they take to cross each other?\n140 मीटर और 160 मीटर लंबी दो ट्रेनें समानांतर पटरियों पर विपरीत दिशाओं में क्रमशः 60 किमी/घंटा और 40 किमी/घंटा की गति से चल रही हैं। वे एक दूसरे को पार करने में कितना समय लेंगी?`,
        correctAnswerText: '10.8 Seconds / सेकंड',
        wrongAnswers: ['12 Seconds / सेकंड', '9.6 Seconds / सेकंड', '15 Seconds / सेकंड'],
        explanation: `Total distance = 140 + 160 = 300 m. Relative speed in opposite direction = 60 + 40 = 100 km/h = 100 × (5/18) = 250/9 m/s. Time = 300 / (250/9) = (300 × 9)/250 = 10.8 seconds.\nसापेक्ष चाल = 100 × (5/18) = 250/9 मी/से। समय = 300 / (250/9) = 10.8 सेकंड।`
      });
    }
  }

  static generateBoatStream(variantIndex, difficulty) {
    return this.generateTimeDistance(variantIndex, difficulty);
  }

  // === 10. ALGEBRA (KIRAN SSC ADVANCED) ===
  static generateAlgebra(variantIndex, difficulty) {
    const p = this.h(variantIndex, 3200) % 5;
    if (p === 0) {
      // x + 1/x = 3 => x^5 + 1/x^5
      // x^2 + 1/x^2 = 7, x^3 + 1/x^3 = 18. x^5 + 1/x^5 = 7*18 - 3 = 123
      return this.makeQuestion({
        topic: 'Algebra',
        difficulty,
        question: `If x + 1/x = 3, what is the value of (x⁵ + 1/x⁵)?\nयदि x + 1/x = 3 हो, तो (x⁵ + 1/x⁵) का मान क्या होगा?`,
        correctAnswerText: '123',
        wrongAnswers: ['126', '120', '118'],
        explanation: `By algebraic identities: x² + 1/x² = 3² - 2 = 7 and x³ + 1/x³ = 3³ - 3(3) = 18. Multiplying both gives (x⁵ + 1/x⁵) = (x² + 1/x²)(x³ + 1/x³) - (x + 1/x) = (7 × 18) - 3 = 123.\nबीजगणितीय सर्वसमिका के प्रयोग से: x² + 1/x² = 7 तथा x³ + 1/x³ = 18। अतः (x⁵ + 1/x⁵) = (7 × 18) - 3 = 123।`
      });
    } else if (p === 1) {
      // x = 2 + √3 => x^4 + 1/x^4
      // x + 1/x = 4 => x^2 + 1/x^2 = 14 => x^4 + 1/x^4 = 14^2 - 2 = 194
      return this.makeQuestion({
        topic: 'Algebra',
        difficulty,
        question: `If x = 2 + √3, find the value of (x⁴ + 1/x⁴).\nयदि x = 2 + √3 हो, तो (x⁴ + 1/x⁴) का मान ज्ञात कीजिए।`,
        correctAnswerText: '194',
        wrongAnswers: ['196', '192', '144'],
        explanation: `Since 1/x = 2 - √3, we get x + 1/x = 4. Squaring successively: x² + 1/x² = 4² - 2 = 14, and x⁴ + 1/x⁴ = 14² - 2 = 196 - 2 = 194.\nसंयुग्मी 1/x = 2 - √3 से x + 1/x = 4 प्राप्त होता है। क्रमशः वर्ग करने पर: x² + 1/x² = 14 तथा x⁴ + 1/x⁴ = 194।`
      });
    } else if (p === 2) {
      // a + b + c = 0 => a^2/bc + b^2/ca + c^2/ab
      return this.makeQuestion({
        topic: 'Algebra',
        difficulty,
        question: `If a + b + c = 0, what is the value of (a²/bc + b²/ca + c²/ab)?\nयदि a + b + c = 0 हो, तो (a²/bc + b²/ca + c²/ab) का मान क्या होगा?`,
        correctAnswerText: '3',
        wrongAnswers: ['0', '1', '-3'],
        explanation: `Taking common denominator gives (a³ + b³ + c³) / abc. When a + b + c = 0, the standard identity states a³ + b³ + c³ = 3abc. Hence the value is 3abc / abc = 3.\nउभयनिष्ठ हर लेने पर व्यंजक (a³ + b³ + c³) / abc बनता है। जब a+b+c=0 हो, तो सर्वसमिका से a³+b³+c³ = 3abc होता है। अतः मान = 3।`
      });
    } else if (p === 3) {
      // a^4 + 1/a^4 = 119 => a^3 - 1/a^3
      // a^2 + 1/a^2 = sqrt(121) = 11 => (a - 1/a)^2 = 11 - 2 = 9 => a - 1/a = 3
      // a^3 - 1/a^3 = 3^3 + 3(3) = 36
      return this.makeQuestion({
        topic: 'Algebra',
        difficulty,
        question: `If a⁴ + 1/a⁴ = 119, what is the value of (a³ - 1/a³)?\nयदि a⁴ + 1/a⁴ = 119 हो, तो (a³ - 1/a³) का मान क्या होगा?`,
        correctAnswerText: '36',
        wrongAnswers: ['32', '38', '27'],
        explanation: `Using completing the square: a² + 1/a² = √(119 + 2) = 11. Then (a - 1/a)² = 11 - 2 = 9 => a - 1/a = 3. Therefore a³ - 1/a³ = 3³ + 3(3) = 27 + 9 = 36.\nपूर्ण वर्ग बनाने पर: a² + 1/a² = 11, फिर a - 1/a = 3 प्राप्त होता है। घन करने पर: a³ - 1/a³ = 27 + 9 = 36।`
      });
    } else {
      // x^2 - 5x + 1 = 0 => x^3 + 1/x^3
      // x + 1/x = 5 => x^3 + 1/x^3 = 5^3 - 3(5) = 110
      return this.makeQuestion({
        topic: 'Algebra',
        difficulty,
        question: `If x² - 5x + 1 = 0, find the value of (x³ + 1/x³).\nयदि x² - 5x + 1 = 0 हो, तो (x³ + 1/x³) का मान ज्ञात कीजिए।`,
        correctAnswerText: '110',
        wrongAnswers: ['125', '115', '100'],
        explanation: `Dividing the equation by x gives x + 1/x = 5. Cubing both sides: x³ + 1/x³ = 5³ - 3(5) = 125 - 15 = 110.\nसमीकरण को x से विभाजित करने पर x + 1/x = 5 प्राप्त होता है। दोनों पक्षों का घन करने पर: x³ + 1/x³ = 125 - 15 = 110।`
      });
    }
  }

  // === 11. TRIGONOMETRY (KIRAN SSC ADVANCED) ===
  static generateTrigonometry(variantIndex, difficulty) {
    const p = this.h(variantIndex, 3300) % 5;
    if (p === 0) {
      // secθ + tanθ = 3 => sinθ = (3^2 - 1)/(3^2 + 1) = 8/10 = 4/5
      return this.makeQuestion({
        topic: 'Trigonometry',
        difficulty,
        question: `If sec θ + tan θ = 3, what is the value of sin θ?\nयदि sec θ + tan θ = 3 हो, तो sin θ का मान क्या होगा?`,
        correctAnswerText: '4/5',
        wrongAnswers: ['3/5', '1/3', '5/4'],
        explanation: `If sec θ + tan θ = p, then sin θ = (p² - 1) / (p² + 1). Here p = 3 => sin θ = (9 - 1) / (9 + 1) = 8 / 10 = 4/5.\nसूत्र: sin θ = (p² - 1)/(p² + 1) = (9 - 1)/(9 + 1) = 4/5।`
      });
    } else if (p === 1) {
      // Height and distance: complementary angles h = sqrt(a * b)
      return this.makeQuestion({
        topic: 'Height and Distance',
        difficulty,
        question: `The angles of elevation of the top of a tower from two points on the ground at distances of 4 meters and 9 meters from the base of the tower in the same straight line are complementary. What is the height of the tower?\nमीनार के आधार से एक ही सीधी रेखा में 4 मीटर और 9 मीटर की दूरी पर स्थित दो बिंदुओं से मीनार के शीर्ष के उन्नयन कोण परस्पर पूरक (complementary) हैं। मीनार की ऊंचाई क्या है?`,
        correctAnswerText: '6 Meters / मीटर',
        wrongAnswers: ['5 Meters / मीटर', '6.5 Meters / मीटर', '7.2 Meters / मीटर'],
        explanation: `For complementary angles of elevation at distances a and b: Height h = √(a × b) = √(4 × 9) = √36 = 6 meters.\nपूरक कोणों के लिए ऊंचाई h = √(a × b) = √(4 × 9) = 6 मीटर।`
      });
    } else if (p === 2) {
      // Maximum value of a sinθ + b cosθ
      return this.makeQuestion({
        topic: 'Trigonometry',
        difficulty,
        question: `What is the maximum value of the expression (3 sin θ + 4 cos θ)?\nव्यंजक (3 sin θ + 4 cos θ) का अधिकतम मान क्या होगा?`,
        correctAnswerText: '5',
        wrongAnswers: ['7', '4', '25'],
        explanation: `Maximum value of a sin θ + b cos θ is √(a² + b²) = √(3² + 4²) = √25 = 5.\nअधिकतम मान = √(3² + 4²) = 5।`
      });
    } else if (p === 3) {
      // sinθ + cosθ = √2 cosθ => cosθ - sinθ = √2 sinθ
      return this.makeQuestion({
        topic: 'Trigonometry',
        difficulty,
        question: `If sin θ + cos θ = √2 cos θ, what is the value of (cos θ - sin θ)?\nयदि sin θ + cos θ = √2 cos θ हो, तो (cos θ - sin θ) का मान क्या होगा?`,
        correctAnswerText: '√2 sin θ',
        wrongAnswers: ['√2 cos θ', 'sin θ', 'cos θ'],
        explanation: `Using the identity (cos θ - sin θ)² + (sin θ + cos θ)² = 2. (cos θ - sin θ)² + 2 cos²θ = 2 => (cos θ - sin θ)² = 2(1 - cos²θ) = 2 sin²θ => cos θ - sin θ = √2 sin θ.\nसर्वसमिका से: (cos θ - sin θ) = √2 sin θ।`
      });
    } else {
      // Continuous product tan 1 * tan 2 * ... * tan 89
      return this.makeQuestion({
        topic: 'Trigonometry',
        difficulty,
        question: `Find the value of: tan 1° × tan 2° × tan 3° × ... × tan 89°.\ntan 1° × tan 2° × tan 3° × ... × tan 89° का मान क्या होगा?`,
        correctAnswerText: '1',
        wrongAnswers: ['0', '√3', 'Undefined / अपरिभाषित'],
        explanation: `Pairs tan θ × tan(90° - θ) = tan θ × cot θ = 1. Since tan 45° = 1 and all 44 pairs equal 1, the whole product is 1.\nपूरक कोण युग्मों से: tan θ × cot θ = 1। अतः संपूर्ण गुणनफल = 1 होगा।`
      });
    }
  }

  // === 12. GEOMETRY (KIRAN SSC ADVANCED) ===
  static generateGeometry(variantIndex, difficulty) {
    const p = this.h(variantIndex, 3400) % 5;
    if (p === 0) {
      // Incenter angle: 90 + A/2
      const angA = this.hpick(variantIndex, 3401, [60, 70, 80]);
      const bic = 90 + angA / 2;
      return this.makeQuestion({
        topic: 'Geometry',
        difficulty,
        question: `In triangle ABC, the internal bisectors of angle B and angle C meet at point I (the incentre). If angle BAC = ${angA}°, what is the measure of angle BIC?\nत्रिभुज ABC में, कोण B और कोण C के आंतरिक समद्विभाजक बिंदु I (अंतःकेंद्र) पर मिलते हैं। यदि कोण BAC = ${angA}° हो, तो कोण BIC का मान क्या होगा?`,
        correctAnswerText: `${bic}°`,
        wrongAnswers: [`${bic - 10}°`, `${bic + 10}°`, `${180 - angA}°`],
        explanation: `Incentre angle formula: ∠BIC = 90° + ∠A / 2 = 90° + ${angA / 2}° = ${bic}°.\nअंतःकेंद्र कोण सूत्र: ∠BIC = 90° + ∠A / 2 = ${bic}°।`
      });
    } else if (p === 1) {
      // Length of direct common tangent
      const r1 = 8, r2 = 3, d = 13;
      // L = sqrt(d^2 - (r1 - r2)^2) = sqrt(169 - 25) = sqrt(144) = 12
      return this.makeQuestion({
        topic: 'Geometry',
        difficulty,
        question: `Two circles of radii 8 cm and 3 cm have their centres 13 cm apart. What is the length of the direct common tangent between the two circles?\n8 सेमी और 3 सेमी त्रिज्या वाले दो वृत्तों के केंद्रों के बीच की दूरी 13 सेमी है। दोनों वृत्तों की उभयनिष्ठ अनुस्पर्श रेखा (direct common tangent) की लंबाई क्या होगी?`,
        correctAnswerText: '12 cm / सेमी',
        wrongAnswers: ['10 cm / सेमी', '11 cm / सेमी', '12.5 cm / सेमी'],
        explanation: `Length of direct common tangent = √[d² - (r1 - r2)²] = √[13² - (8 - 3)²] = √(169 - 25) = √144 = 12 cm.\nउभयनिष्ठ अनुस्पर्श रेखा की लंबाई = √[13² - 5²] = 12 सेमी।`
      });
    } else if (p === 2) {
      // Right triangle inradius: r = (a + b - c)/2
      return this.makeQuestion({
        topic: 'Geometry',
        difficulty,
        question: `The sides of a right-angled triangle are 15 cm, 20 cm, and 25 cm. What is the radius of its inscribed circle (inradius)?\nएक समकोण त्रिभुज की भुजाएं 15 सेमी, 20 सेमी और 25 सेमी हैं। इसके अंतःवृत्त की त्रिज्या (inradius) क्या होगी?`,
        correctAnswerText: '5 cm / सेमी',
        wrongAnswers: ['4 cm / सेमी', '6 cm / सेमी', '7.5 cm / सेमी'],
        explanation: `Inradius of a right triangle = (Perpendicular + Base - Hypotenuse) / 2 = (15 + 20 - 25) / 2 = 10 / 2 = 5 cm.\nसमकोण त्रिभुज की अंतःत्रिज्या = (लंब + आधार - कर्ण) / 2 = (15 + 20 - 25)/2 = 5 सेमी।`
      });
    } else if (p === 3) {
      // Intersecting chords inside circle: PA * PB = PC * PD
      // PA = 4, PB = 6, PC = 3 => PD = 24 / 3 = 8
      return this.makeQuestion({
        topic: 'Geometry',
        difficulty,
        question: `Two chords AB and CD of a circle intersect at an internal point P. If PA = 4 cm, PB = 6 cm, and PC = 3 cm, what is the length of PD?\nएक वृत्त की दो जीवाएं AB और CD एक आंतरिक बिंदु P पर प्रतिच्छेद करती हैं। यदि PA = 4 सेमी, PB = 6 सेमी और PC = 3 सेमी हो, तो PD की लंबाई क्या होगी?`,
        correctAnswerText: '8 cm / सेमी',
        wrongAnswers: ['6 cm / सेमी', '7 cm / सेमी', '9 cm / सेमी'],
        explanation: `By intersecting chords theorem: PA × PB = PC × PD => 4 × 6 = 3 × PD => 24 = 3 × PD => PD = 8 cm.\nजीवा प्रतिच्छेद प्रमेय से: PA × PB = PC × PD => 24 = 3 × PD => PD = 8 सेमी।`
      });
    } else {
      // Centroid median property
      return this.makeQuestion({
        topic: 'Geometry',
        difficulty,
        question: `G is the centroid of triangle ABC. If the length of median AD is 18 cm, what is the length of segment AG?\nत्रिभुज ABC का केंद्रक G है। यदि माध्यिका AD की लंबाई 18 सेमी हो, तो रेखाखंड AG की लंबाई क्या होगी?`,
        correctAnswerText: '12 cm / सेमी',
        wrongAnswers: ['6 cm / सेमी', '9 cm / सेमी', '10 cm / सेमी'],
        explanation: `The centroid divides each median in the ratio 2 : 1 from the vertex. Therefore AG = (2 / 3) × AD = (2 / 3) × 18 = 12 cm.\nकेंद्रक माध्यिका को 2 : 1 के अनुपात में विभाजित करता है। AG = (2/3) × 18 = 12 सेमी।`
      });
    }
  }

  // === 13. MENSURATION (KIRAN SSC ADVANCED) ===
  static generateMensuration(variantIndex, difficulty) {
    const p = this.h(variantIndex, 3500) % 5;
    if (p === 0) {
      // Melting cuboid into spheres
      // Cuboid: 22 x 12 x 7.5 = 1980 cm^3. Sphere: r = 1.5 cm => V = 4/3 * 22/7 * (1.5)^3 = 14.137 => N = 140
      return this.makeQuestion({
        topic: 'Mensuration',
        difficulty,
        question: `A solid metallic block of dimensions 22 cm × 12 cm × 7.5 cm is melted and recast into small spherical balls of diameter 3 cm (radius 1.5 cm). How many such balls can be made?\n22 सेमी × 12 सेमी × 7.5 सेमी विमाओं वाले एक ठोस धातु के गुटके को पिघलाकर 3 सेमी व्यास (1.5 सेमी त्रिज्या) की छोटी गोलाकार गोलियां बनाई जाती हैं। ऐसी कितनी गोलियां बनाई जा सकती हैं?`,
        correctAnswerText: '140',
        wrongAnswers: ['120', '150', '135'],
        explanation: `Volume of cuboid = 22 × 12 × 7.5 = 1980 cm³. Volume of one sphere = (4/3) × (22/7) × (1.5)³ = (4/3) × (22/7) × 3.375 = 14.14 cm³. Number of balls = 1980 / 14.14 = 140.\nगुटके का आयतन / एक गोली का आयतन = 1980 / (99/7) = 140 गोलियां।`
      });
    } else if (p === 1) {
      // Running track inside rectangular park
      const L = 60, B = 40, w = 2.5;
      // Area = L*B - (L - 2w)(B - 2w) = 2400 - (55)(35) = 2400 - 1925 = 475 m^2
      return this.makeQuestion({
        topic: 'Mensuration',
        difficulty,
        question: `A running path of uniform width 2.5 meters is constructed along the inside perimeter of a rectangular park of length 60 meters and breadth 40 meters. Find the area of the path.\n60 मीटर लंबाई और 40 मीटर चौड़ाई वाले एक आयताकार पार्क के अंदर चारों ओर 2.5 मीटर चौड़ा एक दौड़ने का मार्ग बनाया गया है। मार्ग का क्षेत्रफल ज्ञात कीजिए।`,
        correctAnswerText: '475 m² / वर्ग मीटर',
        wrongAnswers: ['500 m² / वर्ग मीटर', '450 m² / वर्ग मीटर', '425 m² / वर्ग मीटर'],
        explanation: `Area of outer park = 60 × 40 = 2400 m². Inner length = 60 - 5 = 55 m, inner breadth = 40 - 5 = 35 m. Inner area = 55 × 35 = 1925 m². Area of path = 2400 - 1925 = 475 m².\nरास्ते का क्षेत्रफल = कुल क्षेत्रफल - भीतरी क्षेत्रफल = 2400 - 1925 = 475 वर्ग मीटर।`
      });
    } else if (p === 2) {
      // Sphere recast into thin cylindrical wire
      // Sphere R = 6 cm. Wire diameter = 0.4 cm => r = 0.2 cm. Length L?
      // 4/3 * pi * 6^3 = pi * (0.2)^2 * L => 4/3 * 216 = 0.04 * L => 288 = 0.04 * L => L = 7200 cm = 72 m
      return this.makeQuestion({
        topic: 'Mensuration',
        difficulty,
        question: `A solid copper sphere of radius 6 cm is melted and drawn into a wire of uniform circular cross-section with diameter 0.4 cm. What is the length of the wire in meters?\n6 सेमी त्रिज्या वाले तांबे के एक ठोस गोले को पिघलाकर 0.4 सेमी व्यास के एक समान वृत्ताकार अनुप्रस्थ काट वाले तार में बदला जाता है। तार की लंबाई (मीटर में) क्या होगी?`,
        correctAnswerText: '72 Meters / मीटर',
        wrongAnswers: ['64 Meters / मीटर', '80 Meters / मीटर', '75 Meters / मीटर'],
        explanation: `Volume of sphere = Volume of cylinder wire: (4/3) π R³ = π r² L => (4/3) × 216 = (0.2)² × L => 288 = 0.04 L => L = 7200 cm = 72 meters.\nगोले का आयतन = तार का आयतन => 288 = 0.04 L => L = 7200 सेमी = 72 मीटर।`
      });
    } else if (p === 3) {
      // Cone cut into two parts by plane parallel to base
      return this.makeQuestion({
        topic: 'Mensuration',
        difficulty,
        question: `A right circular cone of height 30 cm is cut into two parts by a plane parallel to its base at a distance of 10 cm from the vertex. What is the ratio of the volume of the smaller cone to the volume of the original cone?\n30 सेमी ऊंचाई वाले एक लंब वृत्तीय शंकु को उसके शीर्ष से 10 सेमी की दूरी पर आधार के समानांतर एक तल द्वारा दो भागों में काटा जाता है। छोटे शंकु के आयतन का मूल शंकु के आयतन से क्या अनुपात होगा?`,
        correctAnswerText: '1 : 27',
        wrongAnswers: ['1 : 9', '1 : 8', '1 : 3'],
        explanation: `Ratio of heights h1 : h2 = 10 : 30 = 1 : 3. Ratio of volumes = (h1 / h2)³ = (1 / 3)³ = 1 : 27.\nऊंचाइयों का अनुपात = 1 : 3। आयतनों का अनुपात = (1/3)³ = 1 : 27।`
      });
    } else {
      // Frustum of cone volume
      return this.makeQuestion({
        topic: 'Mensuration',
        difficulty,
        question: `The radii of the circular ends of a frustum of a cone of height 6 cm are 14 cm and 7 cm. Find its volume (using π = 22/7).\n6 सेमी ऊंचाई वाले एक शंकु के छिन्नक (frustum) के वृत्ताकार सिरों की त्रिज्याएं 14 सेमी और 7 सेमी हैं। इसका आयतन ज्ञात कीजिए (π = 22/7 मानकर)।`,
        correctAnswerText: '2156 cm³ / सेमी³',
        wrongAnswers: ['2048 cm³ / सेमी³', '2240 cm³ / सेमी³', '1960 cm³ / सेमी³'],
        explanation: `Volume of frustum = (1/3) π h (R² + r² + Rr) = (1/3) × (22/7) × 6 × (14² + 7² + 14×7) = 2 × (22/7) × (196 + 49 + 98) = 2 × (22/7) × 343 = 2 × 22 × 49 = 2156 cm³.\nछिन्नक का आयतन सूत्र: (1/3) π h (R² + r² + Rr) = 2156 सेमी³।`
      });
    }
  }

  // === 14. SEQUENCE AND SERIES (KIRAN SSC ADVANCED) ===
  static generateSequenceSeries(variantIndex, difficulty) {
    const p = this.h(variantIndex, 3600) % 4;
    if (p === 0) {
      // Sum Sn = 3n^2 + 5n => Tk
      const k = this.hnum(variantIndex, 3601, 10, 20);
      const tk = 6 * k + 2;
      return this.makeQuestion({
        topic: 'Sequence and Series',
        difficulty,
        question: `If the sum of n terms of an arithmetic progression is given by Sn = 3n² + 5n, what is its ${k}th term?\nयदि किसी समांतर श्रेणी के n पदों का योगफल Sn = 3n² + 5n द्वारा दिया गया है, तो इसका ${k}वां पद क्या होगा?`,
        correctAnswerText: String(tk),
        wrongAnswers: [String(tk - 6), String(tk + 6), String(tk + 12)],
        explanation: `k-th term Tn = Sn - S(n-1) = (3n² + 5n) - [3(n-1)² + 5(n-1)] = 6n + 2. For n = ${k}, T${k} = 6(${k}) + 2 = ${tk}.\nn-वां पद = 6n + 2। n = ${k} पर: T${k} = 6(${k}) + 2 = ${tk}।`
      });
    } else if (p === 1) {
      // Infinite GP
      const a = 12;
      const r = '1/3';
      const sum = 18;
      return this.makeQuestion({
        topic: 'Sequence and Series',
        difficulty,
        question: `Find the sum of the infinite geometric series: 12 + 4 + 4/3 + 4/9 + ... ∞.\nअनंत गुणोत्तर श्रेणी 12 + 4 + 4/3 + 4/9 + ... ∞ का योगफल ज्ञात कीजिए।`,
        correctAnswerText: String(sum),
        wrongAnswers: ['16', '20', '24'],
        explanation: `Sum of infinite GP: S∞ = a / (1 - r) = 12 / (1 - 1/3) = 12 / (2/3) = (12 × 3) / 2 = 18.\nअनंत गुणोत्तर श्रेणी का योग = a / (1 - r) = 12 / (2/3) = 18।`
      });
    } else if (p === 2) {
      // AM and GM
      return this.makeQuestion({
        topic: 'Sequence and Series',
        difficulty,
        question: `The arithmetic mean (AM) of two positive numbers is 10 and their geometric mean (GM) is 8. What are the two numbers?\nदो धनात्मक संख्याओं का समांतर माध्य (AM) 10 और गुणोत्तर माध्य (GM) 8 है। वे दोनों संख्याएं क्या हैं?`,
        correctAnswerText: '16 and 4 / 16 और 4',
        wrongAnswers: ['18 and 2 / 18 और 2', '12 and 8 / 12 और 8', '14 and 6 / 14 और 6'],
        explanation: `Let numbers be a and b. (a + b)/2 = 10 => a + b = 20. √(ab) = 8 => ab = 64. Quadratic equation x² - 20x + 64 = 0 gives roots 16 and 4.\na + b = 20 तथा ab = 64 को हल करने पर संख्याएं 16 और 4 प्राप्त होती हैं।`
      });
    } else {
      // Sum of cubes of first 10 natural numbers
      return this.makeQuestion({
        topic: 'Sequence and Series',
        difficulty,
        question: `What is the sum of the cubes of the first 10 natural numbers (1³ + 2³ + 3³ + ... + 10³)?\nप्रथम 10 प्राकृतिक संख्याओं के घनों का योग (1³ + 2³ + 3³ + ... + 10³) क्या होगा?`,
        correctAnswerText: '3025',
        wrongAnswers: ['2500', '3250', '2850'],
        explanation: `Formula for sum of cubes = [n(n + 1) / 2]² = [10 × 11 / 2]² = (55)² = 3025.\nघनों के योग का सूत्र = [n(n+1)/2]² = (55)² = 3025।`
      });
    }
  }

  // === 15. STATISTICS AND PROBABILITY (KIRAN SSC ADVANCED) ===
  static generateStatisticsDi(variantIndex, difficulty) {
    const p = this.h(variantIndex, 3700) % 3;
    if (p === 0) {
      // Mode = 3 Median - 2 Mean
      const median = this.hnum(variantIndex, 3701, 25, 45);
      const mean = median + this.hnum(variantIndex, 3702, 1, 4);
      const mode = 3 * median - 2 * mean;
      return this.makeQuestion({
        topic: 'Statistics',
        difficulty,
        question: `In a moderately skewed distribution, the value of the mean is ${mean} and the median is ${median}. What is the empirical value of the mode?\nएक असममित आवृत्ति वितरण में, माध्य का मान ${mean} तथा माध्यिका का मान ${median} है। बहुलक का आनुभविक मान क्या होगा?`,
        correctAnswerText: String(mode),
        wrongAnswers: [String(mode - 3), String(mode + 3), String(mode + 6)],
        explanation: `Empirical formula: Mode = 3 × Median - 2 × Mean = 3(${median}) - 2(${mean}) = ${3 * median} - ${2 * mean} = ${mode}.\nआनुभविक सूत्र: बहुलक = 3(माध्यिका) - 2(माध्य) = ${mode}।`
      });
    } else if (p === 1) {
      // Variance and standard deviation scaling
      return this.makeQuestion({
        topic: 'Statistics',
        difficulty,
        question: `The standard deviation of a dataset of 20 observations is 4.5. If each observation in the dataset is multiplied by 3, what will be the new standard deviation?\n20 प्रेक्षणों वाले एक डेटासेट का मानक विचलन (standard deviation) 4.5 है। यदि प्रत्येक प्रेक्षण को 3 से गुणा कर दिया जाए, तो नया मानक विचलन क्या होगा?`,
        correctAnswerText: '13.5',
        wrongAnswers: ['4.5', '40.5', '12.0'],
        explanation: `If every observation in a dataset is multiplied by a constant k, the standard deviation is also multiplied by |k|: 4.5 × 3 = 13.5.\nमानक विचलन भी उसी नियतांक k से गुणित हो जाता है: 4.5 × 3 = 13.5।`
      });
    } else {
      // Coefficient of variation
      return this.makeQuestion({
        topic: 'Statistics',
        difficulty,
        question: `If the mean of a data distribution is 25 and its variance is 16, what is its coefficient of variation (CV)?\nयदि किसी आवृत्ति वितरण का माध्य 25 और प्रसरण (variance) 16 है, तो इसका विचरण गुणांक (CV) क्या होगा?`,
        correctAnswerText: '16%',
        wrongAnswers: ['20%', '12%', '25%'],
        explanation: `Standard deviation σ = √Variance = √16 = 4. Coefficient of Variation (CV) = (σ / Mean) × 100 = (4 / 25) × 100 = 16%.\nमानक विचलन = √16 = 4। विचरण गुणांक (CV) = (4 / 25) × 100 = 16%।`
      });
    }
  }

  static generateProbability(variantIndex, difficulty) {
    const p = this.h(variantIndex, 3800) % 3;
    if (p === 0) {
      // At least one head in tossing 4 coins
      return this.makeQuestion({
        topic: 'Probability',
        difficulty,
        question: `Four unbiased coins are tossed simultaneously. What is the probability of getting at least one head?\nचार निष्पक्ष सिक्के एक साथ उछाले जाते हैं। कम से कम एक चित (head) आने की प्रायिकता क्या है?`,
        correctAnswerText: '15/16',
        wrongAnswers: ['1/16', '7/8', '3/4'],
        explanation: `Total outcomes = 2⁴ = 16. Event of getting no heads (all tails) = 1 outcome. Probability of at least one head = 1 - 1/16 = 15/16.\nकुल परिणाम = 16। कोई चित न आने की प्रायिकता = 1/16। कम से कम एक चित = 1 - 1/16 = 15/16।`
      });
    } else if (p === 1) {
      // Two dice sum of 8 or 9
      // Sum 8: (2,6), (3,5), (4,4), (5,3), (6,2) = 5
      // Sum 9: (3,6), (4,5), (5,4), (6,3) = 4
      // Total = 9 / 36 = 1/4
      return this.makeQuestion({
        topic: 'Probability',
        difficulty,
        question: `Two unbiased dice are rolled simultaneously. What is the probability of obtaining a total sum of 8 or 9?\nदो निष्पक्ष पासे एक साथ फेंके जाते हैं। कुल योगफल 8 या 9 आने की प्रायिकता क्या है?`,
        correctAnswerText: '1/4',
        wrongAnswers: ['5/36', '7/36', '1/3'],
        explanation: `Total outcomes = 36. Favorable outcomes for sum 8: 5 ways; for sum 9: 4 ways. Total favorable = 5 + 4 = 9. Probability = 9 / 36 = 1/4.\nयोग 8 के 5 परिणाम और योग 9 के 4 परिणाम। कुल अनुकूल = 9। प्रायिकता = 9 / 36 = 1/4।`
      });
    } else {
      // Drawing balls without replacement
      return this.makeQuestion({
        topic: 'Probability',
        difficulty,
        question: `A bag contains 5 red balls and 4 green balls. Two balls are drawn one after another without replacement. What is the probability that both balls drawn are green?\nएक थैले में 5 लाल गेंदें और 4 हरी गेंदें हैं। बिना प्रतिस्थापन के एक के बाद एक दो गेंदें निकाली जाती हैं। दोनों गेंदों के हरे होने की प्रायिकता क्या है?`,
        correctAnswerText: '1/6',
        wrongAnswers: ['2/9', '4/9', '5/18'],
        explanation: `P(first green) = 4 / 9. P(second green) = 3 / 8. Combined probability = (4 / 9) × (3 / 8) = 12 / 72 = 1/6.\nदोनों हरी होने की प्रायिकता = (4 / 9) × (3 / 8) = 1/6।`
      });
    }
  }

  // === 16. PROBLEM ON AGES (KIRAN SSC ADVANCED) ===
  static generateAges(variantIndex, difficulty) {
    const p = this.h(variantIndex, 3900) % 3;
    if (p === 0) {
      // Father and son age 10 years ago and 10 years hence
      // 10 years ago: 7:2. 10 years hence: 9:4.
      // Difference in units: 9 - 7 = 2, 4 - 2 = 2. 2 units = 20 years => 1 unit = 10 years.
      // 10 yrs ago father was 70 => present age = 80
      return this.makeQuestion({
        topic: 'Problem on Ages',
        difficulty,
        question: `10 years ago, the ratio of the ages of a father and his son was 7 : 2. 10 years hence, the ratio of their ages will be 9 : 4. What is the present age of the father?\n10 वर्ष पूर्व, एक पिता और उसके पुत्र की आयु का अनुपात 7 : 2 था। अब से 10 वर्ष बाद, उनकी आयु का अनुपात 9 : 4 होगा। पिता की वर्तमान आयु क्या है?`,
        correctAnswerText: '80 Years / वर्ष',
        wrongAnswers: ['70 Years / वर्ष', '75 Years / वर्ष', '85 Years / वर्ष'],
        explanation: `Ratio shift: (9 - 7) = (4 - 2) = 2 units for 20 years => 1 unit = 10 years. Father's age 10 years ago = 7 × 10 = 70 years. Present age = 70 + 10 = 80 years.\n2 अनुपात = 20 वर्ष => 1 अनुपात = 10 वर्ष। पिता की वर्तमान आयु = 70 + 10 = 80 वर्ष।`
      });
    } else if (p === 1) {
      // Present age father is 3 times son, 5 years ago 4 times
      // F = 3S. (3S - 5) = 4(S - 5) => 3S - 5 = 4S - 20 => S = 15, F = 45. Difference = 30
      return this.makeQuestion({
        topic: 'Problem on Ages',
        difficulty,
        question: `At present, a father is 3 times as old as his son. 5 years ago, he was 4 times as old as his son was then. What is the difference between their present ages?\nवर्तमान में, एक पिता की आयु उसके पुत्र की आयु की 3 गुनी है। 5 वर्ष पूर्व, उसकी आयु उसके पुत्र की आयु की 4 गुनी थी। उनकी वर्तमान आयु का अंतर क्या है?`,
        correctAnswerText: '30 Years / वर्ष',
        wrongAnswers: ['25 Years / वर्ष', '35 Years / वर्ष', '28 Years / वर्ष'],
        explanation: `Let son's age = s, father's age = 3s. Equation: 3s - 5 = 4(s - 5) => 3s - 5 = 4s - 20 => s = 15 years, Father = 45 years. Difference = 45 - 15 = 30 years.\nसमीकरण से पुत्र = 15 वर्ष, पिता = 45 वर्ष। आयु का अंतर = 45 - 15 = 30 वर्ष।`
      });
    } else {
      // 5 children born at interval of 3 years
      // x + (x+3) + (x+6) + (x+9) + (x+12) = 50 => 5x + 30 = 50 => 5x = 20 => x = 4
      return this.makeQuestion({
        topic: 'Problem on Ages',
        difficulty,
        question: `The sum of the ages of 5 children born at intervals of 3 years each is 50 years. What is the age of the youngest child?\nप्रत्येक 3 वर्ष के अंतराल पर पैदा हुए 5 बच्चों की आयु का योग 50 वर्ष है। सबसे छोटे बच्चे की आयु क्या है?`,
        correctAnswerText: '4 Years / वर्ष',
        wrongAnswers: ['2 Years / वर्ष', '5 Years / वर्ष', '6 Years / वर्ष'],
        explanation: `Let ages be x, x+3, x+6, x+9, x+12. Sum: 5x + 30 = 50 => 5x = 20 => x = 4 years.\nसमीकरण: 5x + 30 = 50 => 5x = 20 => सबसे छोटे बच्चे की आयु x = 4 वर्ष।`
      });
    }
  }
}
