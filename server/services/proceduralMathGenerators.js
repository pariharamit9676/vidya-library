/**
 * Authentic Procedural Question Generator for All 24 Kiran/SSC/MP Police Mathematics Chapters
 * Generates 100% natural, mathematically accurate, bilingual (English + Hindi), official exam-style MCQs.
 * ZERO ARTIFICIAL PREFIXES (No robotic "In clock miscellaneous problems...", "In number system..." tags).
 * Deep anti-repetition engine: 4-6 distinct patterns per chapter, non-repeating dynamic parameters.
 */

import { ProceduralMathAdvanced } from './proceduralMathAdvanced.js';

export class ProceduralMathGenerators {
  // === ANTI-REPETITION MULTI-SEED HASH FUNCTIONS ===
  // Independent hash based on parameter index i and seed v
  static h(v, i) {
    let x = Math.abs(((v | 0) * 1664525 + (i | 0) * 1013904223 + 1013904223) | 0);
    x = Math.imul(x ^ (x >>> 16), 0x45d9f3b) >>> 0;
    x = Math.imul(x ^ (x >>> 16), 0x45d9f3b) >>> 0;
    x = (x ^ (x >>> 16)) >>> 0;
    return x;
  }
  static hpick(v, i, arr) { return arr[this.h(v, i) % arr.length]; }
  static hnum(v, i, min, max) { return min + (this.h(v, i) % (max - min + 1)); }

  /**
   * Main router for generating procedural questions across all chapters
   */
  static generate(topicId, variantIndex = 1, difficulty = 'Medium') {
    const isAdvanced = difficulty === 'Ultra Hard' || difficulty === 'Very Hard' || difficulty === 'Hard';
    if (isAdvanced && ProceduralMathAdvanced.supports(topicId)) {
      const advQ = ProceduralMathAdvanced.generate(topicId, variantIndex, difficulty);
      if (advQ) return advQ;
    }

    switch (topicId) {
      case 'math_number_system':
        return this.generateNumberSystem(variantIndex, difficulty);
      case 'math_lcm_hcf':
        return this.generateLcmHcf(variantIndex, difficulty);
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
      case 'math_miscellaneous':
      default:
        return this.generateMiscellaneous(variantIndex, difficulty);
    }
  }

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

  // 1. Number System
  static generateNumberSystem(variantIndex, difficulty) {
    const isAdvanced = difficulty === 'Ultra Hard' || difficulty === 'Very Hard' || difficulty === 'Hard';

    if (isAdvanced) {
      const p = this.h(variantIndex, 100) % 5;
      if (p === 0) {
        // Kiran Type-V: 88 Divisibility with x and y
        const cases = [
          { numStr: '7x5964y', div: 88, y: 8, x: 4, expr: '3x + 2y', exprHi: '3x + 2y', ans: 28, last3: '648' },
          { numStr: '4x5638y', div: 88, y: 4, x: 8, expr: '2x + 3y', exprHi: '2x + 3y', ans: 28, last3: '384' },
          { numStr: '3x4852y', div: 88, y: 0, x: 2, expr: '4x + 5y', exprHi: '4x + 5y', ans: 8, last3: '520' }
        ];
        const c = this.hpick(variantIndex, 1201, cases);
        return this.makeQuestion({
          topic: 'Number System',
          difficulty,
          question: `If the 7-digit number ${c.numStr} is divisible by ${c.div}, find the value of (${c.expr}) for the largest possible value of y.\nयदि 7-अंकों की संख्या ${c.numStr} पूर्णतः ${c.div} से विभाज्य है, तो y के अधिकतम मान के लिए (${c.exprHi}) का मान क्या होगा?`,
          correctAnswerText: String(c.ans),
          wrongAnswers: [String(c.ans - 4), String(c.ans + 4), String(c.ans + 6)],
          explanation: `Divisibility by 88: divisible by 8 and 11. For divisibility by 8, last 3 digits must be divisible by 8 => y = ${c.y}. For divisibility by 11: difference of odd and even placed digits gives x = ${c.x}. Hence ${c.expr} = ${c.ans}.\n88 से विभाज्यता के लिए संख्या 8 और 11 दोनों से विभाज्य होनी चाहिए। y = ${c.y}, x = ${c.x}। मान = ${c.ans}।`
        });
      } else if (p === 1) {
        // Kiran Type-IV: Remainder theorem with high power
        const remCases = [
          { base: 2, exp: 31, divisor: 5, ans: 3, expEn: '(2⁴)⁷ × 2³ = 16⁷ × 8 ≡ (1)⁷ × 3 ≡ 3 (mod 5)' },
          { base: 9, exp: 19, add: 6, divisor: 8, ans: 7, expEn: '(9¹⁹ + 6) ≡ (1¹⁹ + 6) ≡ 7 (mod 8)' },
          { base: 7, exp: 19, add: 2, divisor: 6, ans: 3, expEn: '(7¹⁹ + 2) ≡ (1¹⁹ + 2) ≡ 3 (mod 6)' },
          { base: 2, exp: 33, divisor: 9, ans: 8, expEn: '(2³)¹¹ = 8¹¹ ≡ (-1)¹¹ ≡ -1 ≡ 8 (mod 9)' }
        ];
        const rc = this.hpick(variantIndex, 1202, remCases);
        const qEn = rc.add ? `Find the remainder when (${rc.base}^${rc.exp} + ${rc.add}) is divided by ${rc.divisor}.` : `Find the remainder when ${rc.base}^${rc.exp} is divided by ${rc.divisor}.`;
        const qHi = rc.add ? `(${rc.base}^${rc.exp} + ${rc.add}) को ${rc.divisor} से भाग देने पर शेषफल क्या प्राप्त होगा?` : `${rc.base}^${rc.exp} को ${rc.divisor} से भाग देने पर शेषफल क्या प्राप्त होगा?`;
        return this.makeQuestion({
          topic: 'Number System',
          difficulty,
          question: `${qEn}\n${qHi}`,
          correctAnswerText: String(rc.ans),
          wrongAnswers: [String((rc.ans + 1) % rc.divisor), String((rc.ans + 2) % rc.divisor), String((rc.ans + 4) % rc.divisor)],
          explanation: `Using binomial remainder theorem: ${rc.expEn}.\nद्विपद शेषफल प्रमेय से: अभीष्ट शेषफल = ${rc.ans}।`
        });
      } else if (p === 2) {
        // Kiran Type-II: Number of trailing zeroes in n!
        const factCases = [
          { n: 100, ans: 24, expCalc: '[100/5] + [100/25] = 20 + 4 = 24' },
          { n: 125, ans: 31, expCalc: '[125/5] + [125/25] + [125/125] = 25 + 5 + 1 = 31' },
          { n: 200, ans: 49, expCalc: '[200/5] + [200/25] + [200/125] = 40 + 8 + 1 = 49' },
          { n: 50, ans: 12, expCalc: '[50/5] + [50/25] = 10 + 2 = 12' }
        ];
        const fc = this.hpick(variantIndex, 1203, factCases);
        return this.makeQuestion({
          topic: 'Number System',
          difficulty,
          question: `Find the total number of trailing zeroes at the end of ${fc.n}! (factorial of ${fc.n}).\n${fc.n}! (क्रमगुणित) के अंत में आने वाले शून्य की कुल संख्या कितनी होगी?`,
          correctAnswerText: String(fc.ans),
          wrongAnswers: [String(fc.ans - 2), String(fc.ans + 2), String(fc.ans + 5)],
          explanation: `Number of trailing zeroes = Sum of [n/5^k]: ${fc.expCalc} zeroes.\nशून्य की संख्या = 5 की कुल घातों की संख्या = ${fc.expCalc} = ${fc.ans}।`
        });
      } else if (p === 3) {
        // Kiran Type-I: Total number of factors of a composite number
        const factorCases = [
          { num: 720, pf: '2⁴ × 3² × 5¹', ans: 30, calc: '(4+1)(2+1)(1+1) = 5 × 3 × 2 = 30' },
          { num: 360, pf: '2³ × 3² × 5¹', ans: 24, calc: '(3+1)(2+1)(1+1) = 4 × 3 × 2 = 24' },
          { num: 540, pf: '2² × 3³ × 5¹', ans: 24, calc: '(2+1)(3+1)(1+1) = 3 × 4 × 2 = 24' },
          { num: 1200, pf: '2⁴ × 3¹ × 5²', ans: 30, calc: '(4+1)(1+1)(2+1) = 5 × 2 × 3 = 30' }
        ];
        const tc = this.hpick(variantIndex, 1204, factorCases);
        return this.makeQuestion({
          topic: 'Number System',
          difficulty,
          question: `Find the total number of factors (divisors) of ${tc.num}.\nसंख्या ${tc.num} के कुल गुणनखंडों (भाजकों) की संख्या ज्ञात कीजिए।`,
          correctAnswerText: String(tc.ans),
          wrongAnswers: [String(tc.ans - 4), String(tc.ans + 4), String(tc.ans + 6)],
          explanation: `Prime factorization: ${tc.num} = ${tc.pf}. Total factors = ${tc.calc}.\nअभाज्य गुणनखंड: ${tc.num} = ${tc.pf}। कुल गुणनखंड = ${tc.calc}।`
        });
      } else {
        // Kiran Type-III: Unit digit in difference of high powers
        return this.makeQuestion({
          topic: 'Number System',
          difficulty,
          question: `Find the unit digit in the expression (7^95 - 3^58).\nव्यंजक (7^95 - 3^58) में इकाई का अंक क्या होगा?`,
          correctAnswerText: '4',
          wrongAnswers: ['6', '7', '0'],
          explanation: `Cyclicity of 7 is 4: 95 % 4 = 3 => 7³ = 343 (unit digit 3). Cyclicity of 3 is 4: 58 % 4 = 2 => 3² = 9 (unit digit 9). Unit digit = 13 - 9 = 4.\n7^95 का इकाई अंक = 3, 3^58 का इकाई अंक = 9। इकाई अंक = 13 - 9 = 4।`
        });
      }
    }

    // Foundational (Medium / Easy) Mode
    const p = this.h(variantIndex, 100) % 5;
    if (p === 0) {
      const d1 = this.hnum(variantIndex, 101, 2, 7);
      const d2 = this.hnum(variantIndex, 102, 1, 8);
      const d3 = this.hnum(variantIndex, 103, 1, 6);
      const sum = d1 + d2 + d3;
      const missing = (9 - (sum % 9)) % 9;
      return this.makeQuestion({
        topic: 'Number System',
        difficulty,
        question: `If the 4-digit number ${d1}${d2}*${d3} is completely divisible by 9, what is the smallest single digit in place of *?\nयदि 4-अंकों की संख्या ${d1}${d2}*${d3} पूर्णतः 9 से विभाज्य है, तो * के स्थान पर सबसे छोटा अंक क्या होगा?`,
        correctAnswerText: String(missing),
        wrongAnswers: [String((missing + 2) % 10), String((missing + 4) % 10), String((missing + 6) % 10)],
        explanation: `Divisibility rule of 9: Sum of digits must be divisible by 9. Sum = ${d1} + ${d2} + * + ${d3} = ${sum} + *. Therefore, * = ${missing}.\n9 से विभाज्यता का नियम: अंकों का योग 9 से विभाज्य होना चाहिए। अंकों का योग = ${sum} + *, अतः * = ${missing}।`
      });
    } else if (p === 1) {
      const d1 = 48 + this.hnum(variantIndex, 104, 1, 6) * 8;
      const d2 = 8;
      const r1 = 19 + this.hnum(variantIndex, 105, 1, 8);
      const ans = r1 % d2;
      return this.makeQuestion({
        topic: 'Number System',
        difficulty,
        question: `When a number is divided by ${d1}, it leaves a remainder of ${r1}. If the same number is divided by ${d2}, what will be the remainder?\nजब किसी संख्या को ${d1} से भाग दिया जाता है, तो शेषफल ${r1} प्राप्त होता है। यदि उसी संख्या को ${d2} से भाग दिया जाए, तो शेषफल क्या होगा?`,
        correctAnswerText: String(ans),
        wrongAnswers: [String((ans + 1) % d2), String((ans + 3) % d2), String((ans + 5) % d2)],
        explanation: `Since ${d1} is a multiple of ${d2}, the remainder when divided by ${d2} is ${r1} % ${d2} = ${ans}.\nचूंकि ${d1}, ${d2} का गुणज है, अतः अभीष्ट शेषफल = ${r1} % ${d2} = ${ans}।`
      });
    } else if (p === 2) {
      const base = this.hpick(variantIndex, 106, [3, 7, 8]);
      const exp = 40 + this.hnum(variantIndex, 107, 1, 9);
      const rem = exp % 4 === 0 ? 4 : exp % 4;
      const ans = Math.pow(base, rem) % 10;
      return this.makeQuestion({
        topic: 'Number System',
        difficulty,
        question: `Find the unit digit in the expression (${base})^${exp}.\nव्यंजक (${base})^${exp} में इकाई का अंक ज्ञात कीजिए।`,
        correctAnswerText: String(ans),
        wrongAnswers: [String((ans + 2) % 10), String((ans + 4) % 10), String((ans + 6) % 10)],
        explanation: `The cyclicity of unit digits for ${base} is 4. ${exp} % 4 = ${exp % 4}. Hence unit digit is ${base}^${rem} % 10 = ${ans}.\n${base} के इकाई अंक की चक्रीयता 4 होती है। अतः इकाई अंक = ${ans}।`
      });
    } else if (p === 3) {
      const n = this.hnum(variantIndex, 108, 15, 40);
      const sum = (n * (n + 1)) / 2;
      return this.makeQuestion({
        topic: 'Number System',
        difficulty,
        question: `What is the sum of the first ${n} natural numbers?\nप्रथम ${n} प्राकृतिक संख्याओं का योग क्या होगा?`,
        correctAnswerText: String(sum),
        wrongAnswers: [String(sum - n), String(sum + n), String(sum + 10)],
        explanation: `Sum of first n natural numbers = [n(n + 1)] / 2 = [${n} × ${n + 1}] / 2 = ${sum}.\nप्रथम n प्राकृतिक संख्याओं का योग = [n(n + 1)] / 2 = ${sum}।`
      });
    } else {
      const a = this.hnum(variantIndex, 109, 2, 7);
      const b = this.hnum(variantIndex, 110, 1, 8);
      const c = this.hnum(variantIndex, 111, 2, 6);
      const evenSum = b + a;
      let star = (evenSum - c) % 11;
      if (star < 0) star += 11;
      return this.makeQuestion({
        topic: 'Number System',
        difficulty,
        question: `If the 4-digit number ${a}*${b}${c} is divisible by 11, what is the single-digit value of *?\nयदि 4-अंकों की संख्या ${a}*${b}${c} पूर्णतः 11 से विभाज्य है, तो * का मान क्या होगा?`,
        correctAnswerText: String(star),
        wrongAnswers: [String((star + 2) % 10), String((star + 5) % 10), String((star + 7) % 10)],
        explanation: `Divisibility rule of 11: Difference between sum of odd placed digits and even placed digits must be 0 or multiple of 11. Hence * = ${star}.\n11 से विभाज्यता का नियम: विषम एवं सम स्थानों के अंकों के योग का अंतर 0 या 11 का गुणज होना चाहिए। अतः * = ${star}।`
      });
    }
  }

  // 2. LCM and HCF
  static generateLcmHcf(variantIndex, difficulty) {
    const isAdvanced = difficulty === 'Ultra Hard' || difficulty === 'Very Hard' || difficulty === 'Hard';

    if (isAdvanced) {
      const p = this.h(variantIndex, 200) % 6;
      if (p === 0) {
        // Kiran Type-V: Smallest 4-digit number leaving variable remainder (constant difference)
        const baseLcm = 60; // LCM of 12, 15, 20
        const remDiff = 4; // 12-8 = 15-11 = 20-16 = 4
        const mult = this.hnum(variantIndex, 2201, 17, 30);
        const num = baseLcm * mult - remDiff; // 4-digit number (e.g. 1016, 1076, 1136...)
        const sumDigits = String(num).split('').map(Number).reduce((acc, d) => acc + d, 0);
        return this.makeQuestion({
          topic: 'LCM and HCF',
          difficulty,
          question: `Let x be the least 4-digit number which when divided by 12, 15, and 20 leaves remainders 8, 11, and 16 respectively. What is the sum of the digits of x?\nमाना x 4-अंकों की वह छोटी से छोटी संख्या है जिसे 12, 15 और 20 से विभाजित करने पर क्रमशः 8, 11 और 16 शेषफल बचता है। x के अंकों का योगफल क्या होगा?`,
          correctAnswerText: String(sumDigits),
          wrongAnswers: [String(sumDigits - 2), String(sumDigits + 3), String(sumDigits + 5)],
          explanation: `Divisors minus remainders: 12 - 8 = 15 - 11 = 20 - 16 = 4. Number form: LCM(12, 15, 20)k - 4 = 60k - 4. Least 4-digit number is for k = ${mult}: 60(${mult}) - 4 = ${num}. Sum of digits = ${sumDigits}.\nसमान अंतर = 4। अभीष्ट संख्या = 60k - 4। k=${mult} पर 4-अंकीय संख्या = ${num}। अंकों का योग = ${sumDigits}।`
        });
      } else if (p === 1) {
        // Kiran Type-III/VI: Number of coprime pairs of numbers given sum & HCF
        const cases = [
          { sum: 384, hcf: 48, reducedSum: 8, pairs: 2, pairText: '(1, 7), (3, 5)' },
          { sum: 1056, hcf: 66, reducedSum: 16, pairs: 4, pairText: '(1, 15), (3, 13), (5, 11), (7, 9)' },
          { sum: 528, hcf: 33, reducedSum: 16, pairs: 4, pairText: '(1, 15), (3, 13), (5, 11), (7, 9)' },
          { sum: 216, hcf: 27, reducedSum: 8, pairs: 2, pairText: '(1, 7), (3, 5)' },
          { sum: 640, hcf: 64, reducedSum: 10, pairs: 2, pairText: '(1, 9), (3, 7)' }
        ];
        const c = this.hpick(variantIndex, 2202, cases);
        return this.makeQuestion({
          topic: 'LCM and HCF',
          difficulty,
          question: `The sum of two numbers is ${c.sum} and their HCF is ${c.hcf}. How many pairs of such numbers are possible?\nदो संख्याओं का योगफल ${c.sum} है तथा उनका महत्तम समापवर्तक (HCF) ${c.hcf} है। ऐसी संख्याओं के कितने युग्म (जोड़े) संभव हैं?`,
          correctAnswerText: String(c.pairs),
          wrongAnswers: [String(c.pairs + 1), String(c.pairs - 1), String(c.pairs + 2)],
          explanation: `Let numbers be ${c.hcf}a and ${c.hcf}b where a, b are coprime. ${c.hcf}(a + b) = ${c.sum} => a + b = ${c.reducedSum}. Valid coprime pairs: ${c.pairText}. Total pairs = ${c.pairs}.\nसह-अभाज्य युग्म: ${c.pairText}। कुल युग्मों की संख्या = ${c.pairs}।`
        });
      } else if (p === 2) {
        // Kiran Type-VI: HCF of power expressions (a^m - 1) and (a^n - 1)
        const powerCases = [
          { base: 3, m: 45, n: 35, gcdVal: 5, ans: 242 },
          { base: 2, m: 35, n: 91, gcdVal: 7, ans: 127 },
          { base: 2, m: 15, n: 25, gcdVal: 5, ans: 31 },
          { base: 3, m: 18, n: 24, gcdVal: 6, ans: 728 },
          { base: 2, m: 20, n: 30, gcdVal: 10, ans: 1023 }
        ];
        const pc = this.hpick(variantIndex, 2203, powerCases);
        return this.makeQuestion({
          topic: 'LCM and HCF',
          difficulty,
          question: `Find the Highest Common Factor (HCF) of (${pc.base}^${pc.m} - 1) and (${pc.base}^${pc.n} - 1).\n(${pc.base}^${pc.m} - 1) तथा (${pc.base}^${pc.n} - 1) का महत्तम समापवर्तक (HCF) क्या होगा?`,
          correctAnswerText: String(pc.ans),
          wrongAnswers: [String(pc.ans - 2), String(pc.ans + 4), String(pc.base)],
          explanation: `Standard algebraic identity: HCF of (a^m - 1) and (a^n - 1) is a^GCD(m, n) - 1 = ${pc.base}^${pc.gcdVal} - 1 = ${pc.ans}.\nसर्वसमिका सूत्र: HCF = a^HCF(m, n) - 1 = ${pc.base}^${pc.gcdVal} - 1 = ${pc.ans}।`
        });
      } else if (p === 3) {
        // Kiran Type-VI: Divided by greatest number x leaving same remainder, sum of digits of x
        const cases = [
          { n1: 43, n2: 91, n3: 183, hcf: 4, sumDigits: 4, d1: 48, d2: 92 },
          { n1: 1356, n2: 1868, n3: 2764, hcf: 64, sumDigits: 10, d1: 512, d2: 896 },
          { n1: 64, n2: 130, n3: 196, hcf: 66, sumDigits: 12, d1: 66, d2: 66 },
          { n1: 2270, n2: 3739, n3: 6677, hcf: 1469, sumDigits: 20, d1: 1469, d2: 2938 }
        ];
        const sc = this.hpick(variantIndex, 2204, cases);
        return this.makeQuestion({
          topic: 'LCM and HCF',
          difficulty,
          question: `When ${sc.n1}, ${sc.n2}, and ${sc.n3} are divided by the greatest number x, the remainder in each case is the same. What is the sum of the digits of x?\nजब ${sc.n1}, ${sc.n2} और ${sc.n3} को सबसे बड़ी संख्या x से विभाजित किया जाता है, तो प्रत्येक स्थिति में समान शेषफल बचता है। x के अंकों का योग क्या है?`,
          correctAnswerText: String(sc.sumDigits),
          wrongAnswers: [String(sc.sumDigits - 2), String(sc.sumDigits + 3), String(sc.sumDigits + 1)],
          explanation: `x is the HCF of the differences: HCF(${sc.d1}, ${sc.d2}) = ${sc.hcf}. Sum of digits = ${sc.sumDigits}.\nसंख्याओं के अंतरों का महत्तम समापवर्तक x = ${sc.hcf}। अंकों का योग = ${sc.sumDigits}।`
        });
      } else if (p === 4) {
        // Kiran Type-IV: Circular track with multiple runners with fractional lap times
        const trackCases = [
          { dist: 12, s1: 3, s2: 7, s3: 13, ans: 12 },
          { dist: 18, s1: 6, s2: 9, s3: 15, ans: 6 },
          { dist: 10, s1: 2, s2: 4, s3: 6, ans: 5 }
        ];
        const tc = this.hpick(variantIndex, 2205, trackCases);
        return this.makeQuestion({
          topic: 'LCM and HCF',
          difficulty,
          question: `Three runners start simultaneously from the same point on a circular track of ${tc.dist} km in the same direction with speeds of ${tc.s1} km/h, ${tc.s2} km/h, and ${tc.s3} km/h respectively. After how many hours will they all meet for the first time at the starting point?\nतीन धावक एक वृत्ताकार पथ जिसकी लंबाई ${tc.dist} किमी है, पर एक ही बिंदु से क्रमशः ${tc.s1} किमी/घंटा, ${tc.s2} किमी/घंटा और ${tc.s3} किमी/घंटा की चाल से एक ही दिशा में दौड़ना शुरू करते हैं। वे कितने घंटे बाद पहली बार प्रारंभिक बिंदु पर मिलेंगे?`,
          correctAnswerText: `${tc.ans} Hours / घंटे`,
          wrongAnswers: [`${tc.ans * 2} Hours / घंटे`, `${tc.ans + 3} Hours / घंटे`, `${Math.max(2, tc.ans - 2)} Hours / घंटे`],
          explanation: `Time for 1 lap: ${tc.dist}/${tc.s1}, ${tc.dist}/${tc.s2}, ${tc.dist}/${tc.s3}. Meeting time = LCM of times = LCM(numerators)/HCF(denominators) = ${tc.ans} hours.\nप्रारंभिक बिंदु पर मिलने का समय = समयों का LCM = ${tc.ans} घंटे।`
        });
      } else {
        // Kiran Type-V: Greatest 4-digit number divisible by LCM
        const divCases = [
          { divs: '15, 24, and 36', divHi: '15, 24 और 36', lcm: 360, maxNum: 9720, sumDigits: 18 },
          { divs: '12, 16, and 24', divHi: '12, 16 और 24', lcm: 48, maxNum: 9984, sumDigits: 30 },
          { divs: '18, 21, and 28', divHi: '18, 21 और 28', lcm: 252, maxNum: 9828, sumDigits: 27 }
        ];
        const dc = this.hpick(variantIndex, 2206, divCases);
        return this.makeQuestion({
          topic: 'LCM and HCF',
          difficulty,
          question: `Find the sum of digits of the greatest 4-digit number which is exactly divisible by ${dc.divs}.\n4-अंकों की वह सबसे बड़ी संख्या जो ${dc.divHi} से पूर्णतः विभाज्य है, के अंकों का योगफल क्या होगा?`,
          correctAnswerText: String(dc.sumDigits),
          wrongAnswers: [String(dc.sumDigits - 3), String(dc.sumDigits + 2), String(dc.sumDigits + 4)],
          explanation: `LCM(${dc.divs}) = ${dc.lcm}. Largest 4-digit number 9999 divided by ${dc.lcm} leaves remainder ${9999 % dc.lcm}. Number = 9999 - ${9999 % dc.lcm} = ${dc.maxNum}. Sum of digits = ${dc.sumDigits}.\nLCM = ${dc.lcm}। 4-अंकीय सबसे बड़ी संख्या = ${dc.maxNum}। अंकों का योग = ${dc.sumDigits}।`
        });
      }
    }

    // Foundational (Medium / Easy) Mode
    const p = this.h(variantIndex, 200) % 5;
    if (p === 0) {
      const hcf = this.hnum(variantIndex, 201, 6, 18);
      const m1 = this.hnum(variantIndex, 202, 2, 5);
      const m2 = m1 + this.hnum(variantIndex, 203, 1, 3);
      const a = hcf * m1;
      const b = hcf * m2;
      const lcm = hcf * m1 * m2;
      return this.makeQuestion({
        topic: 'LCM and HCF',
        difficulty,
        question: `The HCF of two numbers is ${hcf} and their LCM is ${lcm}. If one of the numbers is ${a}, find the other number.\nदो संख्याओं का महत्तम समापवर्तक (HCF) ${hcf} तथा लघुत्तम समापवर्त्य (LCM) ${lcm} है। यदि इनमें से एक संख्या ${a} है, तो दूसरी संख्या ज्ञात कीजिए।`,
        correctAnswerText: String(b),
        wrongAnswers: [String(b - hcf), String(b + hcf), String(b + 2 * hcf)],
        explanation: `Product of two numbers = HCF × LCM => ${a} × B = ${hcf} × ${lcm} => B = ${b}.\nदो संख्याओं का गुणनफल = HCF × LCM => दूसरी संख्या = ${b}।`
      });
    } else if (p === 1) {
      const r1 = this.hnum(variantIndex, 204, 3, 5);
      const r2 = r1 + this.hnum(variantIndex, 205, 1, 2);
      const hcf = this.hnum(variantIndex, 206, 8, 20);
      const lcm = r1 * r2 * hcf;
      return this.makeQuestion({
        topic: 'LCM and HCF',
        difficulty,
        question: `Two numbers are in the ratio ${r1} : ${r2}. If their HCF is ${hcf}, find their LCM.\nदो संख्याएं ${r1} : ${r2} के अनुपात में हैं। यदि उनका महत्तम समापवर्तक ${hcf} है, तो उनका लघुत्तम समापवर्त्य (LCM) ज्ञात कीजिए।`,
        correctAnswerText: String(lcm),
        wrongAnswers: [String(lcm - hcf * 2), String(lcm + hcf * 2), String(lcm + hcf * 4)],
        explanation: `Numbers are (${r1} × ${hcf}) and (${r2} × ${hcf}). LCM = ${r1} × ${r2} × ${hcf} = ${lcm}.\nसंख्याएं ${r1 * hcf} और ${r2 * hcf} हैं। LCM = ${r1} × ${r2} × HCF = ${lcm}।`
      });
    } else if (p === 2) {
      const t1 = this.hpick(variantIndex, 207, [6, 8, 10]);
      const t2 = 12;
      const t3 = 15;
      const gcd = (x, y) => (!y ? x : gcd(y, x % y));
      const getLcm = (x, y) => (x * y) / gcd(x, y);
      const totalLcm = getLcm(t1, getLcm(t2, t3));
      const mins = totalLcm / 60;
      return this.makeQuestion({
        topic: 'LCM and HCF',
        difficulty,
        question: `Three bells toll at intervals of ${t1}, ${t2}, and ${t3} seconds respectively. If they toll together now, after how many seconds will they toll together next?\nतीन घंटियां क्रमशः ${t1}, ${t2} और ${t3} सेकंड के अंतराल पर बजती हैं। यदि वे अभी एक साथ बजती हैं, तो अगली बार वे कितने सेकंड बाद एक साथ बजेंगी?`,
        correctAnswerText: `${totalLcm} Seconds / सेकंड`,
        wrongAnswers: [`${totalLcm - 30} Seconds / सेकंड`, `${totalLcm + 30} Seconds / सेकंड`, `${totalLcm + 60} Seconds / सेकंड`],
        explanation: `Required time is LCM(${t1}, ${t2}, ${t3}) = ${totalLcm} seconds (${mins} minutes).\nअभीष्ट समय = ${t1}, ${t2}, ${t3} का LCM = ${totalLcm} सेकंड।`
      });
    } else if (p === 3) {
      const hcf = this.hnum(variantIndex, 208, 12, 24);
      const r = this.hnum(variantIndex, 209, 3, 7);
      const n1 = hcf * 3 + r;
      const n2 = hcf * 5 + r;
      return this.makeQuestion({
        topic: 'LCM and HCF',
        difficulty,
        question: `Find the greatest number which divides ${n1} and ${n2} leaving a remainder of ${r} in each case.\nवह बड़ी से बड़ी संख्या ज्ञात कीजिए जिससे ${n1} और ${n2} को भाग देने पर प्रत्येक दशा में ${r} शेष बचे।`,
        correctAnswerText: String(hcf),
        wrongAnswers: [String(hcf - 2), String(hcf + 4), String(hcf + 6)],
        explanation: `Required number = HCF(${n1} - ${r}, ${n2} - ${r}) = HCF(${n1 - r}, ${n2 - r}) = ${hcf}.\nअभीष्ट संख्या = HCF(${n1 - r}, ${n2 - r}) = ${hcf}।`
      });
    } else {
      const l1 = 6;
      const l2 = 8;
      const l3 = 12;
      const r = this.hnum(variantIndex, 210, 2, 5);
      const ans = 24 + r;
      return this.makeQuestion({
        topic: 'LCM and HCF',
        difficulty,
        question: `Find the least number which when divided by ${l1}, ${l2}, and ${l3} leaves a remainder of ${r} in each case.\nवह छोटी से छोटी संख्या ज्ञात कीजिए जिसे ${l1}, ${l2} और ${l3} से भाग देने पर प्रत्येक दशा में ${r} शेषफल प्राप्त हो।`,
        correctAnswerText: String(ans),
        wrongAnswers: [String(ans - 4), String(ans + 6), String(ans + 12)],
        explanation: `Least number = LCM(${l1}, ${l2}, ${l3}) + ${r} = 24 + ${r} = ${ans}.\nछोटी से छोटी संख्या = LCM(6, 8, 12) + ${r} = 24 + ${r} = ${ans}।`
      });
    }
  }

  // 3. Simplification
  static generateSimplification(variantIndex, difficulty) {
    const p = this.h(variantIndex, 300) % 5;
    if (p === 0) {
      const a = this.hnum(variantIndex, 301, 12, 30);
      const b = this.hnum(variantIndex, 302, 2, 6);
      const c = this.hnum(variantIndex, 303, 3, 8);
      const d = this.hnum(variantIndex, 304, 2, 5);
      const ans = Math.round((a / b) * c + d);
      return this.makeQuestion({
        topic: 'Simplification',
        difficulty,
        question: `Simplify the expression: (${a} ÷ ${b}) × ${c} + ${d}.\nव्यंजक (${a} ÷ ${b}) × ${c} + ${d} को सरल कीजिए।`,
        correctAnswerText: String(ans),
        wrongAnswers: [String(ans - 3), String(ans + 4), String(ans + 7)],
        explanation: `According to BODMAS: First divide (${a} ÷ ${b} = ${(a / b).toFixed(1)}), then multiply by ${c}, then add ${d} = ${ans}.\nBODMAS के नियमानुसार: पहले भाग, फिर गुणा, फिर जोड़ = ${ans}।`
      });
    } else if (p === 1) {
      const k = this.hnum(variantIndex, 305, 4, 9);
      const num = k * (k + 1);
      const ans = k + 1;
      return this.makeQuestion({
        topic: 'Simplification',
        difficulty,
        question: `Find the value of √( ${num} + √( ${num} + √( ${num} + ... ∞ ) ) ).\n√( ${num} + √( ${num} + √( ${num} + ... ∞ ) ) ) का मान ज्ञात कीजिए।`,
        correctAnswerText: String(ans),
        wrongAnswers: [String(k), String(ans + 1), String(ans + 2)],
        explanation: `For an expression of type √(n + √(n + ...)), factorize n = k(k + 1). The answer for positive series is the larger factor (k + 1) = ${ans}.\n${num} के क्रमागत गुणनखंड ${k} × ${k + 1} हैं। धनात्मक श्रेणी के लिए उत्तर बड़ा गुणनखंड = ${ans} होगा।`
      });
    } else if (p === 2) {
      const ab = this.hnum(variantIndex, 306, 15, 65);
      return this.makeQuestion({
        topic: 'Simplification',
        difficulty,
        question: `Convert the recurring decimal 0.${ab}${ab}${ab}... (0.${ab}̅) into a simple fraction.\nआवर्त दशमलव 0.${ab}${ab}... (0.${ab}̅) को साधारण भिन्न में बदलिए।`,
        correctAnswerText: `${ab}/99`,
        wrongAnswers: [`${ab}/100`, `${ab}/90`, `${ab + 1}/99`],
        explanation: `A recurring decimal with 2 repeating digits 0.ab̅ = ab / 99. Therefore 0.${ab}̅ = ${ab}/99.\n2 अंकों की पुनरावृत्ति वाले दशमलव को भिन्न में बदलने पर: 0.${ab}̅ = ${ab}/99।`
      });
    } else if (p === 3) {
      const a = this.hnum(variantIndex, 307, 12, 35);
      const b = this.hnum(variantIndex, 308, 5, 20);
      const ans = a + b;
      return this.makeQuestion({
        topic: 'Simplification',
        difficulty,
        question: `Find the value of (${a}³ + ${b}³) / (${a}² - ${a}×${b} + ${b}²).\n(${a}³ + ${b}³) / (${a}² - ${a}×${b} + ${b}²) का मान ज्ञात कीजिए।`,
        correctAnswerText: String(ans),
        wrongAnswers: [String(a - b), String(ans + 10), String(ans - 5)],
        explanation: `Using algebraic identity a³ + b³ = (a + b)(a² - ab + b²). The expression reduces to a + b = ${a} + ${b} = ${ans}.\nबीजगणितीय सर्वसमिका से: (a³ + b³) / (a² - ab + b²) = a + b = ${a} + ${b} = ${ans}।`
      });
    } else {
      const a = this.hnum(variantIndex, 309, 5, 12);
      const b = 5;
      const num = a * a * b;
      return this.makeQuestion({
        topic: 'Simplification',
        difficulty,
        question: `Simplify: √${num}.\n√${num} का सरलीकृत मान क्या होगा?`,
        correctAnswerText: `${a}√${b}`,
        wrongAnswers: [`${a - 1}√${b}`, `${a + 1}√${b}`, `${b}√${a}`],
        explanation: `Simplifying prime factors: √${num} = √(${a}² × ${b}) = ${a}√${b}.\nअभाज्य गुणनखंडों को सरल करने पर: √${num} = ${a}√${b}।`
      });
    }
  }

  // 4. Power, Indices and Surds
  static generateSurdsIndices(variantIndex, difficulty) {
    const p = this.h(variantIndex, 400) % 5;
    if (p === 0) {
      const a = this.hnum(variantIndex, 401, 3, 9);
      const b = a - 1;
      return this.makeQuestion({
        topic: 'Power, Indices and Surds',
        difficulty,
        question: `Rationalize the denominator of: 1 / (√${a} + √${b}).\n1 / (√${a} + √${b}) के हर का परिमेयकरण करने पर क्या मान प्राप्त होगा?`,
        correctAnswerText: `√${a} - √${b}`,
        wrongAnswers: [`√${a} + √${b}`, `${a + b}`, `1 / (√${a} - √${b})`],
        explanation: `Multiply numerator and denominator by conjugate (√${a} - √${b}): [√${a} - √${b}] / (${a} - ${b}) = √${a} - √${b}.\nसंयुग्मी से गुणा करने पर: √${a} - √${b} प्राप्त होता है।`
      });
    } else if (p === 1) {
      const x = this.hnum(variantIndex, 402, 3, 6);
      const val = Math.pow(2, x - 1) + Math.pow(2, x + 1);
      return this.makeQuestion({
        topic: 'Power, Indices and Surds',
        difficulty,
        question: `If 2^(x - 1) + 2^(x + 1) = ${val}, find the value of x.\nयदि 2^(x - 1) + 2^(x + 1) = ${val} है, तो x का मान ज्ञात कीजिए।`,
        correctAnswerText: String(x),
        wrongAnswers: [String(x - 1), String(x + 1), String(x + 2)],
        explanation: `Factoring common base: 2^(x - 1)[1 + 2²] = ${val} => 2^(x - 1) × 5 = ${val} => 2^(x - 1) = ${val / 5} = 2^${x - 1} => x = ${x}.\nउभयनिष्ठ पद बाहर लेने पर: 2^(x - 1)[1 + 4] = ${val} => 2^(x - 1) = ${val / 5} => x = ${x}।`
      });
    } else if (p === 2) {
      const base = this.hpick(variantIndex, 403, [4, 9, 16, 25, 36]);
      const root = Math.sqrt(base);
      const ans = Math.pow(root, 3);
      return this.makeQuestion({
        topic: 'Power, Indices and Surds',
        difficulty,
        question: `Find the numerical value of (${base})^(3/2).\n(${base})^(3/2) का संख्यात्मक मान क्या होगा?`,
        correctAnswerText: String(ans),
        wrongAnswers: [String(ans - root), String(ans + root), String(ans + 12)],
        explanation: `Calculating fractional exponent: (${base})^(3/2) = (√${base})³ = (${root})³ = ${ans}.\nघातांक के नियमानुसार: (${base})^(3/2) = (${root})³ = ${ans}।`
      });
    } else if (p === 3) {
      return this.makeQuestion({
        topic: 'Power, Indices and Surds',
        difficulty,
        question: `Which is greater: √2 or ∛3?\n√2 और ∛3 में से कौन सी संख्या बड़ी है?`,
        correctAnswerText: '∛3',
        wrongAnswers: ['√2', 'Both are equal / दोनों बराबर हैं', 'Cannot be determined / निर्धारित नहीं किया जा सकता'],
        explanation: `Raise both to 6th power: (√2)⁶ = 2³ = 8, while (∛3)⁶ = 3² = 9. Since 9 > 8, ∛3 is greater.\nदोनों की 6 घात करने पर: (√2)⁶ = 8 तथा (∛3)⁶ = 9। चूंकि 9 > 8, अतः ∛3 बड़ा है।`
      });
    } else {
      const a = this.hnum(variantIndex, 404, 3, 7);
      const b = 2;
      const sum = a + b;
      const prod = a * b;
      return this.makeQuestion({
        topic: 'Power, Indices and Surds',
        difficulty,
        question: `Find the square of (√${a} + √${b}).\n(√${a} + √${b}) का वर्ग ज्ञात कीजिए।`,
        correctAnswerText: `${sum} + 2√${prod}`,
        wrongAnswers: [`${sum} + √${prod}`, `${sum} - 2√${prod}`, `${sum + 2} + 2√${prod}`],
        explanation: `Using the algebraic identity: (√a + √b)² = a + b + 2√(ab) = ${sum} + 2√${prod}.\nसर्वसमिका के प्रयोग से: (√a + √b)² = a + b + 2√(ab) = ${sum} + 2√${prod}।`
      });
    }
  }

  // 5. Average
  static generateAverage(variantIndex, difficulty) {
    const p = this.h(variantIndex, 500) % 5;
    if (p === 0) {
      const n = this.hnum(variantIndex, 501, 20, 35);
      const oldAvg = this.hnum(variantIndex, 502, 12, 16);
      const inc = 1;
      const teacherAge = oldAvg + (n + 1) * inc;
      return this.makeQuestion({
        topic: 'Average',
        difficulty,
        question: `The average age of ${n} students in a class is ${oldAvg} years. When the teacher's age is included, the average increases by ${inc} year. What is the teacher's age?\nएक कक्षा के ${n} छात्रों की औसत आयु ${oldAvg} वर्ष है। यदि शिक्षक की आयु को भी शामिल कर लिया जाए, तो औसत ${inc} वर्ष बढ़ जाता है। शिक्षक की आयु क्या है?`,
        correctAnswerText: `${teacherAge} Years / वर्ष`,
        wrongAnswers: [`${teacherAge - 2} Years / वर्ष`, `${teacherAge + 3} Years / वर्ष`, `${teacherAge + 5} Years / वर्ष`],
        explanation: `Teacher's Age = New Average + Total Old Count × Increase = (${oldAvg + inc}) + ${n} × ${inc} = ${teacherAge} years.\nशिक्षक की आयु = नया औसत + पुराने छात्रों की संख्या × वृद्धि = ${teacherAge} वर्ष।`
      });
    } else if (p === 1) {
      const inn = this.hnum(variantIndex, 503, 10, 20);
      const inc = this.hnum(variantIndex, 504, 2, 4);
      const newScore = this.hnum(variantIndex, 505, 75, 110);
      const newAvg = newScore - inn * inc;
      return this.makeQuestion({
        topic: 'Average',
        difficulty,
        question: `A batsman makes a score of ${newScore} runs in his ${inn + 1}th inning and thus increases his average by ${inc} runs. Find his new average.\nएक बल्लेबाज अपनी ${inn + 1}वीं पारी में ${newScore} रन बनाता है और इस प्रकार उसका औसत ${inc} रन बढ़ जाता है। उसका नया औसत ज्ञात कीजिए।`,
        correctAnswerText: String(newAvg),
        wrongAnswers: [String(newAvg - inc), String(newAvg + inc), String(newAvg + 5)],
        explanation: `Total increase in runs = ${inn} × ${inc} = ${inn * inc}. New average = ${newScore} - ${inn * inc} = ${newAvg}.\nरन वृद्धि = ${inn * inc}। नया औसत = ${newScore} - ${inn * inc} = ${newAvg}।`
      });
    } else if (p === 2) {
      const k = this.hnum(variantIndex, 506, 3, 9);
      const n = this.hnum(variantIndex, 507, 5, 11);
      const avg = (k * (n + 1)) / 2;
      return this.makeQuestion({
        topic: 'Average',
        difficulty,
        question: `Find the average of the first ${n} multiples of ${k}.\n${k} के प्रथम ${n} गुणजों का औसत ज्ञात कीजिए।`,
        correctAnswerText: String(avg),
        wrongAnswers: [String(avg - k), String(avg + k), String(avg + 2)],
        explanation: `Average of first n multiples of k = [k(n + 1)] / 2 = [${k} × ${n + 1}] / 2 = ${avg}.\n${k} के प्रथम ${n} गुणजों का औसत = [${k} × (${n} + 1)] / 2 = ${avg}।`
      });
    } else if (p === 3) {
      const n = this.hnum(variantIndex, 508, 6, 12);
      const incKg = 2;
      const oldW = this.hnum(variantIndex, 509, 50, 75);
      const newW = oldW + n * incKg;
      return this.makeQuestion({
        topic: 'Average',
        difficulty,
        question: `The average weight of ${n} persons increases by ${incKg} kg when a person weighing ${oldW} kg is replaced by a new person. What is the weight of the new person?\n${n} व्यक्तियों के औसत वजन में ${incKg} किग्रा की वृद्धि हो जाती है जब ${oldW} किग्रा वजन वाले एक व्यक्ति के स्थान पर एक नया व्यक्ति आ जाता है। नए व्यक्ति का वजन कितना है?`,
        correctAnswerText: `${newW} kg / किग्रा`,
        wrongAnswers: [`${newW - 4} kg / किग्रा`, `${newW + 4} kg / किग्रा`, `${newW + 8} kg / किग्रा`],
        explanation: `Weight of new person = Weight of replaced person + Total increase = ${oldW} + (${n} × ${incKg}) = ${newW} kg.\nनए व्यक्ति का वजन = ${oldW} + (${n} × ${incKg}) = ${newW} किग्रा।`
      });
    } else {
      const start = this.hnum(variantIndex, 510, 11, 45);
      const avg = start + 2;
      return this.makeQuestion({
        topic: 'Average',
        difficulty,
        question: `What is the average of 5 consecutive numbers starting from ${start}?\n${start} से शुरू होने वाली 5 क्रमागत संख्याओं का औसत क्या होगा?`,
        correctAnswerText: String(avg),
        wrongAnswers: [String(avg - 1), String(avg + 1), String(avg + 2)],
        explanation: `For an odd count of consecutive numbers, the average is the middle term: ${start} + 2 = ${avg}.\nविषम क्रमागत संख्याओं का औसत मध्य पद होता है: ${start} + 2 = ${avg}।`
      });
    }
  }

  // 6. Ratio and Proportion
  static generateRatioProportion(variantIndex, difficulty) {
    const p = this.h(variantIndex, 600) % 5;
    if (p === 0) {
      const a = this.hnum(variantIndex, 601, 4, 12);
      const b = this.hnum(variantIndex, 602, 6, 18);
      const c = a * this.hnum(variantIndex, 603, 2, 4);
      const ans = (b * c) / a;
      return this.makeQuestion({
        topic: 'Ratio and Proportion',
        difficulty,
        question: `Find the fourth proportional to ${a}, ${b}, and ${c}.\n${a}, ${b} और ${c} का चतुर्थानुपाती ज्ञात कीजिए।`,
        correctAnswerText: String(ans),
        wrongAnswers: [String(ans - 2), String(ans + 3), String(ans + 6)],
        explanation: `Fourth proportional x = (b × c) / a = (${b} × ${c}) / ${a} = ${ans}.\nचतुर्थानुपाती x = (b × c) / a = ${ans}।`
      });
    } else if (p === 1) {
      const r1 = this.hnum(variantIndex, 604, 3, 8);
      const a = r1 * 2;
      const b = r1 * 8;
      const mean = Math.sqrt(a * b);
      return this.makeQuestion({
        topic: 'Ratio and Proportion',
        difficulty,
        question: `Find the mean proportional between ${a} and ${b}.\n${a} और ${b} का मध्यानुपाती ज्ञात कीजिए।`,
        correctAnswerText: String(mean),
        wrongAnswers: [String(mean - 2), String(mean + 2), String(mean + 4)],
        explanation: `Mean proportional = √(a × b) = √(${a} × ${b}) = √${a * b} = ${mean}.\nमध्यानुपाती = √(a × b) = ${mean}।`
      });
    } else if (p === 2) {
      const rA = this.hnum(variantIndex, 605, 2, 5);
      const rB = this.hnum(variantIndex, 606, 3, 7);
      const unit = this.hnum(variantIndex, 607, 100, 400);
      const total = (rA + rB) * unit;
      const shareA = rA * unit;
      return this.makeQuestion({
        topic: 'Ratio and Proportion',
        difficulty,
        question: `A sum of ₹${total} is divided between A and B in the ratio ${rA} : ${rB}. What is A's share?\n₹${total} की राशि को A और B के बीच ${rA} : ${rB} के अनुपात में बांटा जाता है। A का हिस्सा कितना होगा?`,
        correctAnswerText: `₹${shareA}`,
        wrongAnswers: [`₹${shareA - unit}`, `₹${shareA + unit}`, `₹${rB * unit}`],
        explanation: `A's share = [${rA} / (${rA} + ${rB})] × ${total} = ${rA} × ${unit} = ₹${shareA}.\nA का हिस्सा = [${rA} / ${rA + rB}] × ${total} = ₹${shareA}।`
      });
    } else if (p === 3) {
      const c1 = 1;
      const c50 = 0.5;
      const c25 = 0.25;
      const r1 = 2;
      const r2 = 3;
      const r3 = 4;
      const valPerSet = r1 * c1 + r2 * c50 + r3 * c25;
      const mult = this.hnum(variantIndex, 608, 20, 60);
      const totalVal = valPerSet * mult;
      const num50p = r2 * mult;
      return this.makeQuestion({
        topic: 'Ratio and Proportion',
        difficulty,
        question: `A bag contains ₹1, 50 paise, and 25 paise coins in the ratio ${r1} : ${r2} : ${r3}. If the total value of all coins is ₹${totalVal}, find the number of 50 paise coins.\nएक थैले में ₹1, 50 पैसे और 25 पैसे के सिक्के ${r1} : ${r2} : ${r3} के अनुपात में हैं। यदि सिक्कों का कुल मूल्य ₹${totalVal} है, तो 50 पैसे के सिक्कों की संख्या ज्ञात कीजिए।`,
        correctAnswerText: String(num50p),
        wrongAnswers: [String(num50p - 20), String(num50p + 20), String(num50p + 40)],
        explanation: `Value per ratio set = ${r1}×₹1 + ${r2}×₹0.50 + ${r3}×₹0.25 = ₹${valPerSet}. Sets = ${totalVal} / ${valPerSet} = ${mult}. Number of 50p coins = ${r2} × ${mult} = ${num50p}.\n50 पैसे के सिक्कों की संख्या = ${num50p}।`
      });
    } else {
      const a = this.hnum(variantIndex, 609, 4, 12);
      const b = a * 2;
      const third = (b * b) / a;
      return this.makeQuestion({
        topic: 'Ratio and Proportion',
        difficulty,
        question: `Find the third proportional to ${a} and ${b}.\n${a} और ${b} का तृतीयानुपाती ज्ञात कीजिए।`,
        correctAnswerText: String(third),
        wrongAnswers: [String(third - a), String(third + a), String(third + 2 * a)],
        explanation: `Third proportional x = b² / a = ${b}² / ${a} = ${third}.\nतृतीयानुपाती = b² / a = ${third}।`
      });
    }
  }

  // 7. Alligation or Mixture
  static generateMixture(variantIndex, difficulty) {
    const p = this.h(variantIndex, 700) % 4;
    if (p === 0) {
      const p1 = this.hnum(variantIndex, 701, 20, 40);
      const p2 = p1 + this.hnum(variantIndex, 702, 10, 25);
      const r1 = 2;
      const r2 = 3;
      const mean = (p1 * r1 + p2 * r2) / (r1 + r2);
      return this.makeQuestion({
        topic: 'Alligation or Mixture',
        difficulty,
        question: `In what ratio must rice at ₹${p1} per kg be mixed with rice at ₹${p2} per kg so that the mixture is worth ₹${mean} per kg?\n₹${p1} प्रति किग्रा वाले चावल को ₹${p2} प्रति किग्रा वाले चावल के साथ किस अनुपात में मिलाया जाए ताकि मिश्रण का मूल्य ₹${mean} प्रति किग्रा हो जाए?`,
        correctAnswerText: `${r1} : ${r2}`,
        wrongAnswers: [`${r2} : ${r1}`, '1 : 2', '3 : 4'],
        explanation: `By Rule of Alligation: (${p2} - ${mean}) : (${mean} - ${p1}) = ${p2 - mean} : ${mean - p1} = ${r1} : ${r2}.\nमिश्रण के नियमानुसार अनुपात = ${r1} : ${r2} होगा।`
      });
    } else if (p === 1) {
      const total = this.hnum(variantIndex, 703, 30, 60);
      const milkRatio = 4;
      const waterRatio = 1;
      const milk = (total * milkRatio) / (milkRatio + waterRatio);
      const water = (total * waterRatio) / (milkRatio + waterRatio);
      const waterToAdd = (milk / 2) - water;
      return this.makeQuestion({
        topic: 'Alligation or Mixture',
        difficulty,
        question: `A mixture of ${total} liters contains milk and water in the ratio ${milkRatio} : ${waterRatio}. How many liters of water must be added to make the ratio 2 : 1?\n${total} लीटर के एक मिश्रण में दूध और पानी का अनुपात ${milkRatio} : ${waterRatio} है। इसमें कितना लीटर पानी और मिलाया जाए ताकि नया अनुपात 2 : 1 हो जाए?`,
        correctAnswerText: `${waterToAdd} Liters / लीटर`,
        wrongAnswers: [`${waterToAdd + 2} Liters / लीटर`, `${waterToAdd - 2} Liters / लीटर`, `${waterToAdd + 5} Liters / लीटर`],
        explanation: `Current Milk = ${milk} L, Water = ${water} L. For 2:1, Water required = ${milk} / 2 = ${milk / 2} L. Added water = ${milk / 2} - ${water} = ${waterToAdd} liters.\nमिलाया गया पानी = ${waterToAdd} लीटर।`
      });
    } else if (p === 2) {
      const C = 40;
      const x = 4;
      const rem = Math.round(C * Math.pow(1 - x / C, 2) * 10) / 10;
      return this.makeQuestion({
        topic: 'Alligation or Mixture',
        difficulty,
        question: `A container contains ${C} liters of pure milk. From this container, ${x} liters of milk is taken out and replaced by water. This process is repeated one more time. How much pure milk is left in the container?\nएक बर्तन में ${C} लीटर शुद्ध दूध है। इसमें से ${x} लीटर दूध निकालकर उतना ही पानी भर दिया जाता है। यह प्रक्रिया एक बार और दोहराई जाती है। बर्तन में कितना शुद्ध दूध शेष बचेगा?`,
        correctAnswerText: `${rem} Liters / लीटर`,
        wrongAnswers: [`${rem - 2.4} Liters / लीटर`, `${rem + 2.4} Liters / लीटर`, `${C - 2 * x} Liters / लीटर`],
        explanation: `Remaining liquid = Initial × (1 - x/C)^n = ${C} × (1 - ${x}/${C})² = ${rem} liters.\nशेष दूध = ${C} × (1 - ${x}/${C})² = ${rem} लीटर।`
      });
    } else {
      return this.makeQuestion({
        topic: 'Alligation or Mixture',
        difficulty,
        question: `Two alloys A and B contain zinc and copper in the ratio 3 : 2 and 4 : 1 respectively. If equal quantities of both alloys are melted together, what will be the ratio of zinc and copper in the new alloy?\nदो मिश्र धातुओं A और B में जस्ता और तांबा क्रमशः 3 : 2 और 4 : 1 के अनुपात में है। यदि दोनों मिश्र धातुओं की समान मात्रा को एक साथ पिघलाया जाए, तो नई मिश्र धातु में जस्ता और तांबे का अनुपात क्या होगा?`,
        correctAnswerText: '7 : 3',
        wrongAnswers: ['3 : 1', '5 : 2', '2 : 1'],
        explanation: `Zinc in 1st = 3/5, 2nd = 4/5 => Total zinc = 7/5. Copper in 1st = 2/5, 2nd = 1/5 => Total copper = 3/5. Ratio = 7 : 3.\nकुल जस्ता = 7/5, कुल तांबा = 3/5, अतः अनुपात = 7 : 3।`
      });
    }
  }

  // 8. Percentage
  static generatePercentage(variantIndex, difficulty) {
    const p = this.h(variantIndex, 800) % 6;
    if (p === 0) {
      const r = this.hpick(variantIndex, 801, [20, 25, 50]);
      const ans = r === 25 ? 20 : r === 20 ? 16.66 : 33.33;
      return this.makeQuestion({
        topic: 'Percentage',
        difficulty,
        question: `If the price of sugar increases by ${r}%, by what percentage must a family reduce its consumption so that expenditure remains unchanged?\nयदि चीनी के मूल्य में ${r}% की वृद्धि हो जाती है, तो एक परिवार को अपनी खपत में कितने प्रतिशत की कमी करनी चाहिए ताकि उसका खर्च न बढ़े?`,
        correctAnswerText: `${ans}%`,
        wrongAnswers: [`${r}%`, `${Math.round(ans - 4)}%`, `${Math.round(ans + 5)}%`],
        explanation: `Reduction % = [r / (100 + r)] × 100 = [${r} / ${100 + r}] × 100 = ${ans}%.\nखपत में कमी % = [${r} / ${100 + r}] × 100 = ${ans}%।`
      });
    } else if (p === 1) {
      const winPct = this.hpick(variantIndex, 802, [56, 58, 60, 62]);
      const diffPct = winPct - (100 - winPct);
      const total = this.hnum(variantIndex, 803, 10, 30) * 1000;
      const margin = (total * diffPct) / 100;
      return this.makeQuestion({
        topic: 'Percentage',
        difficulty,
        question: `In an election between two candidates, the winning candidate secured ${winPct}% of valid votes and won by a margin of ${margin} votes. What was the total number of votes polled?\nएक चुनाव में दो उम्मीदवारों में से जीतने वाले उम्मीदवार ने वैध मतों का ${winPct}% मत प्राप्त किया और ${margin} मतों से विजयी हुआ। कुल कितने मत डाले गए?`,
        correctAnswerText: String(total),
        wrongAnswers: [String(total - 4000), String(total + 4000), String(total + 8000)],
        explanation: `Margin % = ${winPct}% - ${100 - winPct}% = ${diffPct}%. Total votes = (${margin} / ${diffPct}) × 100 = ${total}.\nजीत का अंतर % = ${diffPct}%। कुल मत = ${total}।`
      });
    } else if (p === 2) {
      const pct = this.hnum(variantIndex, 804, 15, 45);
      const num = this.hnum(variantIndex, 805, 4, 16) * 100;
      const ans = (pct * num) / 100;
      return this.makeQuestion({
        topic: 'Percentage',
        difficulty,
        question: `What is ${pct}% of ₹${num}?\n₹${num} का ${pct}% कितना होगा?`,
        correctAnswerText: `₹${ans}`,
        wrongAnswers: [`₹${ans - 15}`, `₹${ans + 20}`, `₹${ans + 35}`],
        explanation: `${pct}% of ₹${num} = (${pct} × ${num}) / 100 = ₹${ans}.\n₹${num} का ${pct}% = ₹${ans}।`
      });
    } else if (p === 3) {
      const p1 = 30;
      const fail = this.hnum(variantIndex, 806, 10, 25);
      const p2 = 40;
      const extra = this.hnum(variantIndex, 807, 15, 30);
      const totalMarks = ((fail + extra) / (p2 - p1)) * 100;
      return this.makeQuestion({
        topic: 'Percentage',
        difficulty,
        question: `A student secured ${p1}% marks and failed by ${fail} marks, while another student secured ${p2}% marks and scored ${extra} marks more than the minimum passing marks. Find the maximum marks of the examination.\nएक छात्र ने ${p1}% अंक प्राप्त किए और वह ${fail} अंकों से अनुत्तीर्ण हो गया, जबकि दूसरे छात्र ने ${p2}% अंक प्राप्त किए जो उत्तीर्ण होने के न्यूनतम अंकों से ${extra} अधिक थे। परीक्षा के अधिकतम अंक ज्ञात कीजिए।`,
        correctAnswerText: String(totalMarks),
        wrongAnswers: [String(totalMarks - 50), String(totalMarks + 50), String(totalMarks + 100)],
        explanation: `Difference in % = ${p2}% - ${p1}% = ${p2 - p1}%. Marks gap = ${fail} + ${extra} = ${fail + extra}. Maximum marks = [(${fail + extra}) / ${p2 - p1}] × 100 = ${totalMarks}.\nअधिकतम अंक = ${totalMarks}।`
      });
    } else if (p === 4) {
      const P = this.hnum(variantIndex, 808, 10, 25) * 1000;
      const r = 10;
      const after2 = Math.round(P * Math.pow(1 + r / 100, 2));
      return this.makeQuestion({
        topic: 'Percentage',
        difficulty,
        question: `The population of a town is ${P}. If it increases at the rate of ${r}% per annum, what will be its population after 2 years?\nएक शहर की जनसंख्या ${P} है। यदि इसमें प्रतिवर्ष ${r}% की दर से वृद्धि होती है, तो 2 वर्ष बाद इसकी जनसंख्या कितनी होगी?`,
        correctAnswerText: String(after2),
        wrongAnswers: [String(after2 - 1000), String(after2 + 1000), String(P + 2 * (P * r) / 100)],
        explanation: `Population after 2 years = P × (1 + r/100)² = ${P} × 1.21 = ${after2}.\n2 वर्ष बाद जनसंख्या = ${after2} होगी।`
      });
    } else {
      const inc = 20;
      const dec = 10;
      const net = inc - dec - (inc * dec) / 100;
      return this.makeQuestion({
        topic: 'Percentage',
        difficulty,
        question: `The length of a rectangle is increased by ${inc}% and its breadth is decreased by ${dec}%. What is the net percentage change in its area?\nएक आयत की लंबाई में ${inc}% की वृद्धि की जाती है तथा चौड़ाई में ${dec}% की कमी की जाती है। इसके क्षेत्रफल में कुल कितने प्रतिशत का परिवर्तन होगा?`,
        correctAnswerText: `${net}% Increase / वृद्धि`,
        wrongAnswers: [`${net}% Decrease / कमी`, '10% Increase / वृद्धि', '5% Increase / वृद्धि'],
        explanation: `Net change % = ${inc} - ${dec} - (${inc} × ${dec}) / 100 = ${net}% Increase.\nकुल परिवर्तन = ${net}% वृद्धि।`
      });
    }
  }

  // 9. Profit and Loss
  static generateProfitLoss(variantIndex, difficulty) {
    const p = this.h(variantIndex, 900) % 5;
    if (p === 0) {
      const X = this.hpick(variantIndex, 901, [15, 20, 25]);
      const Y = X - (X === 15 ? 3 : X === 20 ? 4 : 5);
      const profitPct = Math.round(((X - Y) / Y) * 100);
      return this.makeQuestion({
        topic: 'Profit and Loss',
        difficulty,
        question: `If the cost price of ${X} articles is equal to the selling price of ${Y} articles, what is the profit percentage earned?\nयदि ${X} वस्तुओं का क्रय मूल्य ${Y} वस्तुओं के विक्रय मूल्य के बराबर है, तो अर्जित लाभ प्रतिशत क्या होगा?`,
        correctAnswerText: `${profitPct}%`,
        wrongAnswers: [`${profitPct - 5}%`, `${profitPct + 5}%`, `${profitPct + 10}%`],
        explanation: `Profit % = [(X - Y) / Y] × 100 = [(${X} - ${Y}) / ${Y}] × 100 = ${profitPct}%.\nलाभ % = [(${X} - ${Y}) / ${Y}] × 100 = ${profitPct}%।`
      });
    } else if (p === 1) {
      const w = this.hpick(variantIndex, 902, [800, 900, 950]);
      const gainPct = Math.round(((1000 - w) / w) * 100 * 10) / 10;
      return this.makeQuestion({
        topic: 'Profit and Loss',
        difficulty,
        question: `A dishonest dealer professes to sell his goods at cost price, but uses a false weight of ${w} grams for a kilogram. Find his gain percentage.\nएक बेईमान व्यापारी अपनी वस्तुओं को क्रय मूल्य पर बेचने का दावा करता है, परंतु वह 1 किग्रा के स्थान पर ${w} ग्राम के झूठे बांट का उपयोग करता है। उसका लाभ प्रतिशत ज्ञात कीजिए।`,
        correctAnswerText: `${gainPct}%`,
        wrongAnswers: [`${Math.round(gainPct - 3)}%`, `${Math.round(gainPct + 3)}%`, '10%'],
        explanation: `Gain % = [Error / (True value - Error)] × 100 = [${1000 - w} / ${w}] × 100 = ${gainPct}%.\nलाभ % = [${1000 - w} / ${w}] × 100 = ${gainPct}%।`
      });
    } else if (p === 2) {
      const pct = this.hpick(variantIndex, 903, [10, 20]);
      const lossPct = (pct * pct) / 100;
      return this.makeQuestion({
        topic: 'Profit and Loss',
        difficulty,
        question: `A person sells two articles at the same selling price of ₹990 each. On one he gains ${pct}% and on the other he loses ${pct}%. What is his overall gain or loss percentage?\nएक व्यक्ति दो वस्तुएं प्रत्येक को ₹990 के समान विक्रय मूल्य पर बेचता है। एक पर उसे ${pct}% का लाभ होता है तथा दूसरी पर ${pct}% की हानि होती है। पूरे सौदे में उसका कुल लाभ या हानि प्रतिशत क्या होगा?`,
        correctAnswerText: `${lossPct}% Loss / हानि`,
        wrongAnswers: [`${lossPct}% Gain / लाभ`, 'No Profit No Loss / न लाभ न हानि', '2% Loss / हानि'],
        explanation: `When two items are sold at same SP with equal gain and loss %, there is always an overall loss of (P / 10)² % = (${pct} / 10)² % = ${lossPct}% Loss.\nसमान विक्रय मूल्य और समान लाभ-हानि % होने पर सदैव हानि होती है = (${pct}/10)² = ${lossPct}% हानि।`
      });
    } else if (p === 3) {
      const L = 10;
      const G = 10;
      const D = this.hnum(variantIndex, 904, 3, 8) * 20;
      const CP = (D / (L + G)) * 100;
      return this.makeQuestion({
        topic: 'Profit and Loss',
        difficulty,
        question: `An article was sold at a loss of ${L}%. If it had been sold for ₹${D} more, there would have been a gain of ${G}%. What was the cost price of the article?\nएक वस्तु को ${L}% की हानि पर बेचा गया। यदि उसे ₹${D} अधिक में बेचा जाता, तो ${G}% का लाभ होता। वस्तु का क्रय मूल्य क्या था?`,
        correctAnswerText: `₹${CP}`,
        wrongAnswers: [`₹${CP - 50}`, `₹${CP + 50}`, `₹${CP + 100}`],
        explanation: `Difference in percentage = ${L}% + ${G}% = ${L + G}%. Cost Price = [₹${D} / ${L + G}] × 100 = ₹${CP}.\nक्रय मूल्य = [₹${D} / (${L} + ${G})] × 100 = ₹${CP}।`
      });
    } else {
      const cp = this.hnum(variantIndex, 905, 4, 15) * 100;
      const gainPct = 20;
      const sp = cp * 1.2;
      return this.makeQuestion({
        topic: 'Profit and Loss',
        difficulty,
        question: `A shopkeeper buys an article for ₹${cp} and sells it at a gain of ${gainPct}%. Find the selling price of the article.\nएक दुकानदार किसी वस्तु को ₹${cp} में खरीदकर उसे ${gainPct}% के लाभ पर बेचता है। वस्तु का विक्रय मूल्य ज्ञात कीजिए।`,
        correctAnswerText: `₹${sp}`,
        wrongAnswers: [`₹${sp - 40}`, `₹${sp + 40}`, `₹${sp + 80}`],
        explanation: `Selling Price = CP × (1 + Gain%/100) = ₹${cp} × 1.20 = ₹${sp}.\nविक्रय मूल्य = ₹${cp} × 1.20 = ₹${sp}।`
      });
    }
  }

  // 10. Discount
  static generateDiscount(variantIndex, difficulty) {
    const p = this.h(variantIndex, 1000) % 5;
    if (p === 0) {
      const d1 = this.hpick(variantIndex, 1001, [10, 20]);
      const d2 = this.hpick(variantIndex, 1002, [10, 20, 30]);
      const ans = d1 + d2 - (d1 * d2) / 100;
      return this.makeQuestion({
        topic: 'Discount',
        difficulty,
        question: `What single discount is equivalent to two successive discounts of ${d1}% and ${d2}%?\n${d1}% और ${d2}% की दो क्रमिक छूटों के समतुल्य एकल छूट क्या होगी?`,
        correctAnswerText: `${ans}%`,
        wrongAnswers: [`${d1 + d2}%`, `${ans - 2}%`, `${ans + 3}%`],
        explanation: `Equivalent discount = D1 + D2 - (D1 × D2) / 100 = ${d1} + ${d2} - ${(d1 * d2) / 100} = ${ans}%.\nसमतुल्य छूट = ${d1} + ${d2} - (${d1} × ${d2})/100 = ${ans}%।`
      });
    } else if (p === 1) {
      const x = 3;
      const y = 1;
      const disc = Math.round((y / (x + y)) * 100);
      return this.makeQuestion({
        topic: 'Discount',
        difficulty,
        question: `A shop offers a scheme 'Buy 3 Get 1 Free'. What is the effective discount percentage offered?\nएक दुकान '3 खरीदने पर 1 मुफ्त' की योजना प्रस्तुत करती है। दी जाने वाली प्रभावी छूट का प्रतिशत क्या है?`,
        correctAnswerText: `${disc}%`,
        wrongAnswers: ['33.33%', '20%', '30%'],
        explanation: `Effective Discount % = [Free Articles / Total Articles] × 100 = [1 / (3 + 1)] × 100 = 25%.\nप्रभावी छूट % = [मुफ्त वस्तुएं / कुल वस्तुएं] × 100 = (1 / 4) × 100 = 25%।`
      });
    } else if (p === 2) {
      const cp = 500;
      const markup = 30;
      const disc = 10;
      const mp = cp * (1 + markup / 100);
      const sp = mp * (1 - disc / 100);
      const profit = sp - cp;
      return this.makeQuestion({
        topic: 'Discount',
        difficulty,
        question: `A merchant marks an article ${markup}% above its cost price of ₹${cp} and allows a discount of ${disc}% on the marked price. Find his net profit.\nएक व्यापारी ₹${cp} क्रय मूल्य वाली वस्तु पर क्रय मूल्य से ${markup}% अधिक अंकित करता है और अंकित मूल्य पर ${disc}% की छूट देता है। उसका शुद्ध लाभ ज्ञात कीजिए।`,
        correctAnswerText: `₹${profit}`,
        wrongAnswers: [`₹${profit - 15}`, `₹${profit + 15}`, `₹${profit + 30}`],
        explanation: `Marked Price = ₹500 × 1.30 = ₹650. Selling Price = ₹650 × 0.90 = ₹585. Profit = ₹585 - ₹500 = ₹${profit}.\nअंकित मूल्य = ₹650, विक्रय मूल्य = ₹585, लाभ = ₹${profit}।`
      });
    } else if (p === 3) {
      const mp = this.hnum(variantIndex, 1003, 8, 20) * 100;
      const disc = 15;
      const sp = (mp * (100 - disc)) / 100;
      return this.makeQuestion({
        topic: 'Discount',
        difficulty,
        question: `The marked price of an article is ₹${mp}. If a festival discount of ${disc}% is given, what will be the selling price?\nएक वस्तु का अंकित मूल्य ₹${mp} है। यदि इस पर ${disc}% की त्यौहारी छूट दी जाती है, तो इसका विक्रय मूल्य क्या होगा?`,
        correctAnswerText: `₹${sp}`,
        wrongAnswers: [`₹${sp - 50}`, `₹${sp + 50}`, `₹${sp + 100}`],
        explanation: `SP = MP × (1 - Discount/100) = ₹${mp} × 0.85 = ₹${sp}.\nविक्रय मूल्य = ₹${mp} × 0.85 = ₹${sp}।`
      });
    } else {
      const d1 = this.hpick(variantIndex, 1004, [20, 25]);
      const d2 = this.hpick(variantIndex, 1005, [30, 40]);
      const ans = d1 + d2 - (d1 * d2) / 100;
      return this.makeQuestion({
        topic: 'Discount',
        difficulty,
        question: `Find the single equivalent discount for two successive discounts of ${d1}% and ${d2}%.\n${d1}% और ${d2}% की दो क्रमिक छूटों के समतुल्य एकल छूट क्या होगी?`,
        correctAnswerText: `${ans}%`,
        wrongAnswers: [`${d1 + d2}%`, `${ans - 4}%`, `${ans + 4}%`],
        explanation: `Successive discount formula: Equivalent discount = D1 + D2 - (D1 × D2) / 100 = ${d1} + ${d2} - ${(d1 * d2) / 100} = ${ans}%.\nक्रमिक छूट सूत्र से: समतुल्य छूट = ${ans}%।`
      });
    }
  }

  // 11. Simple Interest
  static generateSimpleInterest(variantIndex, difficulty) {
    const p = this.h(variantIndex, 1100) % 5;
    if (p === 0) {
      const P = this.hnum(variantIndex, 1101, 4, 15) * 1000;
      const R = this.hpick(variantIndex, 1102, [5, 6, 8, 10]);
      const T = this.hnum(variantIndex, 1103, 2, 5);
      const si = (P * R * T) / 100;
      return this.makeQuestion({
        topic: 'Simple Interest',
        difficulty,
        question: `Find the simple interest on a principal sum of ₹${P} at a rate of ${R}% per annum for ${T} years.\n₹${P} के मूलधन पर ${R}% वार्षिक दर से ${T} वर्ष का साधारण ब्याज ज्ञात कीजिए।`,
        correctAnswerText: `₹${si}`,
        wrongAnswers: [`₹${si - 200}`, `₹${si + 200}`, `₹${si + 400}`],
        explanation: `SI = (P × R × T) / 100 = (${P} × ${R} × ${T}) / 100 = ₹${si}.\nसाधारण ब्याज = (P × R × T) / 100 = ₹${si}।`
      });
    } else if (p === 1) {
      const T = this.hpick(variantIndex, 1104, [5, 8, 10, 12]);
      const rate = Math.round((100 / T) * 10) / 10;
      return this.makeQuestion({
        topic: 'Simple Interest',
        difficulty,
        question: `At what rate percent per annum simple interest will a sum of money double itself in ${T} years?\nसाधारण ब्याज की किस वार्षिक दर से कोई धनराशि ${T} वर्षों में स्वयं की दोगुनी हो जाएगी?`,
        correctAnswerText: `${rate}%`,
        wrongAnswers: [`${Math.round(rate - 2)}%`, `${Math.round(rate + 2)}%`, '15%'],
        explanation: `Rate = [(N - 1) × 100] / T = [(2 - 1) × 100] / ${T} = ${rate}%.\nदर = 100 / ${T} = ${rate}%।`
      });
    } else if (p === 2) {
      const T = this.hpick(variantIndex, 1105, [4, 5, 6]);
      const ansT = T * (4 - 1);
      return this.makeQuestion({
        topic: 'Simple Interest',
        difficulty,
        question: `A sum of money doubles itself in ${T} years at simple interest. In how many years will it become 4 times itself at the same rate?\nकोई धनराशि साधारण ब्याज पर ${T} वर्षों में दोगुनी हो जाती है। समान दर पर वह कितने वर्षों में स्वयं की 4 गुनी हो जाएगी?`,
        correctAnswerText: `${ansT} Years / वर्ष`,
        wrongAnswers: [`${ansT - 2} Years / वर्ष`, `${ansT + 3} Years / वर्ष`, `${T * 4} Years / वर्ष`],
        explanation: `Time required = T × (M - 1) / (N - 1) = ${T} × (4 - 1) / (2 - 1) = ${ansT} years.\nअभीष्ट समय = ${ansT} वर्ष।`
      });
    } else if (p === 3) {
      const P = this.hnum(variantIndex, 1106, 5, 20) * 1000;
      const rateDiff = 2;
      const time = 3;
      const diffAmt = (P * rateDiff * time) / 100;
      return this.makeQuestion({
        topic: 'Simple Interest',
        difficulty,
        question: `If the annual simple interest rate on a sum of ₹${P} is increased by ${rateDiff}% for ${time} years, by how much will the interest amount increase?\nयदि ₹${P} की राशि पर साधारण ब्याज की वार्षिक दर ${time} वर्ष के लिए ${rateDiff}% बढ़ा दी जाए, तो ब्याज की राशि में कितनी वृद्धि होगी?`,
        correctAnswerText: `₹${diffAmt}`,
        wrongAnswers: [`₹${diffAmt - 50}`, `₹${diffAmt + 50}`, `₹${diffAmt + 100}`],
        explanation: `Increase in Interest = (P × ΔR × T) / 100 = (${P} × ${rateDiff} × ${time}) / 100 = ₹${diffAmt}.\nब्याज में वृद्धि = ₹${diffAmt}।`
      });
    } else {
      const P = 4000;
      const annualInt = 400;
      const a2 = P + 2 * annualInt;
      const a3 = P + 3 * annualInt;
      return this.makeQuestion({
        topic: 'Simple Interest',
        difficulty,
        question: `A sum of money invested at simple interest amounts to ₹${a2} in 2 years and to ₹${a3} in 3 years. Find the principal sum.\nकोई धनराशि साधारण ब्याज पर 2 वर्ष में ₹${a2} तथा 3 वर्ष में ₹${a3} हो जाती है। मूलधन ज्ञात कीजिए।`,
        correctAnswerText: `₹${P}`,
        wrongAnswers: [`₹${P - 500}`, `₹${P + 500}`, `₹${P + 800}`],
        explanation: `1 year Interest = ₹${a3} - ₹${a2} = ₹${annualInt}. Principal = Amount in 2 years - 2 × Interest = ₹${a2} - ₹${2 * annualInt} = ₹${P}.\nमूलधन = ₹${a2} - 2 × ₹${annualInt} = ₹${P}।`
      });
    }
  }

  // 12. Compound Interest
  static generateCompoundInterest(variantIndex, difficulty) {
    const p = this.h(variantIndex, 1200) % 5;
    if (p === 0) {
      const P = this.hnum(variantIndex, 1201, 4, 15) * 1000;
      const R = this.hpick(variantIndex, 1202, [5, 10]);
      const diff = Math.round(P * Math.pow(R / 100, 2));
      return this.makeQuestion({
        topic: 'Compound Interest',
        difficulty,
        question: `Find the difference between the compound interest and simple interest on ₹${P} for 2 years at ${R}% per annum.\n₹${P} की धनराशि पर 2 वर्ष के लिए ${R}% वार्षिक दर से चक्रवृद्धि ब्याज और साधारण ब्याज का अंतर ज्ञात कीजिए।`,
        correctAnswerText: `₹${diff}`,
        wrongAnswers: [`₹${diff + 15}`, `₹${diff - 10}`, `₹${diff + 25}`],
        explanation: `Difference for 2 years = P × (R / 100)² = ${P} × (${R} / 100)² = ₹${diff}.\n2 वर्ष के CI और SI का अंतर = P(R/100)² = ₹${diff}।`
      });
    } else if (p === 1) {
      const T = this.hpick(variantIndex, 1203, [3, 4, 5]);
      const ansT = T * 3;
      return this.makeQuestion({
        topic: 'Compound Interest',
        difficulty,
        question: `A sum of money placed at compound interest doubles itself in ${T} years. In how many years will it amount to 8 times itself?\nचक्रवृद्धि ब्याज पर रखी गई कोई धनराशि ${T} वर्षों में दोगुनी हो जाती है। यह कितने वर्षों में 8 गुनी हो जाएगी?`,
        correctAnswerText: `${ansT} Years / वर्ष`,
        wrongAnswers: [`${ansT - 2} Years / वर्ष`, `${ansT + 4} Years / वर्ष`, `${T * 8} Years / वर्ष`],
        explanation: `8 = 2³. In compound interest, if it becomes 2 times in ${T} years, it becomes 2³ times in 3 × ${T} = ${ansT} years.\nचक्रवृद्धि ब्याज में: समय = 3 × ${T} = ${ansT} वर्ष।`
      });
    } else if (p === 2) {
      const P = this.hnum(variantIndex, 1204, 5, 12) * 1000;
      const R = 10;
      const ci = Math.round(P * (Math.pow(1.10, 2) - 1));
      return this.makeQuestion({
        topic: 'Compound Interest',
        difficulty,
        question: `What is the compound interest on ₹${P} for 2 years at ${R}% per annum compounded annually?\n₹${P} पर ${R}% वार्षिक दर से 2 वर्ष का वार्षिक संयोजित चक्रवृद्धि ब्याज क्या होगा?`,
        correctAnswerText: `₹${ci}`,
        wrongAnswers: [`₹${ci - 100}`, `₹${ci + 100}`, `₹${(P * R * 2) / 100}`],
        explanation: `CI = P × [(1 + R/100)² - 1] = ${P} × 0.21 = ₹${ci}.\nचक्रवृद्धि ब्याज = ${P} × 0.21 = ₹${ci}।`
      });
    } else if (p === 3) {
      const a1 = 5000;
      const a2 = 5500;
      const rate = Math.round(((a2 - a1) / a1) * 100);
      return this.makeQuestion({
        topic: 'Compound Interest',
        difficulty,
        question: `A sum of money amounts to ₹${a1} in 2 years and to ₹${a2} in 3 years at compound interest. What is the rate of interest per annum?\nचक्रवृद्धि ब्याज पर कोई धनराशि 2 वर्ष में ₹${a1} और 3 वर्ष में ₹${a2} हो जाती है। ब्याज की वार्षिक दर क्या है?`,
        correctAnswerText: `${rate}%`,
        wrongAnswers: [`${rate - 2}%`, `${rate + 3}%`, '12%'],
        explanation: `Interest in 3rd year = ₹${a2} - ₹${a1} = ₹${a2 - a1}. Rate = [(${a2 - a1}) / ${a1}] × 100 = ${rate}%.\nब्याज दर = [(${a2} - ${a1}) / ${a1}] × 100 = ${rate}%।`
      });
    } else {
      const P = 8000;
      const R = 10;
      const ci = Math.round(P * (Math.pow(1.05, 2) - 1));
      return this.makeQuestion({
        topic: 'Compound Interest',
        difficulty,
        question: `Find the compound interest on ₹${P} at ${R}% per annum for 1 year compounded half-yearly.\n₹${P} पर ${R}% वार्षिक दर से 1 वर्ष का अर्धवार्षिक रूप से संयोजित चक्रवृद्धि ब्याज ज्ञात कीजिए।`,
        correctAnswerText: `₹${ci}`,
        wrongAnswers: [`₹${ci - 40}`, `₹${ci + 40}`, `₹${(P * R) / 100}`],
        explanation: `For half-yearly, R = 10/2 = 5%, n = 2 periods. CI = ₹8000 × (1.05² - 1) = ₹8000 × 0.1025 = ₹${ci}.\nअर्धवार्षिक दर = 5%, अवधि = 2। CI = ₹${ci}।`
      });
    }
  }

  // 13. Time and Work
  static generateTimeWork(variantIndex, difficulty) {
    const p = this.h(variantIndex, 1300) % 5;
    if (p === 0) {
      const a = this.hpick(variantIndex, 1301, [10, 12, 15, 20]);
      const b = a === 10 ? 15 : a === 12 ? 24 : a === 15 ? 30 : 30;
      const together = (a * b) / (a + b);
      return this.makeQuestion({
        topic: 'Time and Work',
        difficulty,
        question: `A can complete a piece of work in ${a} days and B can complete the same work in ${b} days. In how many days can both complete the work working together?\nA किसी कार्य को ${a} दिनों में तथा B उसी कार्य को ${b} दिनों में पूरा कर सकता है। दोनों मिलकर उस कार्य को कितने दिनों में पूरा करेंगे?`,
        correctAnswerText: `${together} Days / दिन`,
        wrongAnswers: [`${together + 2} Days / दिन`, `${together - 1} Days / दिन`, `${together + 4} Days / दिन`],
        explanation: `Combined work rate = (1/${a}) + (1/${b}) = 1/${together}. Days = (a × b) / (a + b) = ${together} days.\nदोनों मिलकर = (a × b) / (a + b) = ${together} दिन।`
      });
    } else if (p === 1) {
      const daysTogether = this.hpick(variantIndex, 1302, [12, 14, 16]);
      const aDays = (3 * daysTogether) / 2;
      return this.makeQuestion({
        topic: 'Time and Work',
        difficulty,
        question: `A is twice as efficient as B. If together they finish a piece of work in ${daysTogether} days, in how many days can A alone finish the work?\nA की कार्यक्षमता B से दोगुनी है। यदि दोनों मिलकर किसी कार्य को ${daysTogether} दिनों में समाप्त करते हैं, तो A अकेला उस कार्य को कितने दिनों में समाप्त करेगा?`,
        correctAnswerText: `${aDays} Days / दिन`,
        wrongAnswers: [`${aDays * 2} Days / दिन`, `${aDays - 3} Days / दिन`, `${aDays + 4} Days / दिन`],
        explanation: `Ratio of efficiency A : B = 2 : 1. Combined efficiency = 3 units/day. Total work = 3 × ${daysTogether}. Time taken by A = (3 × ${daysTogether}) / 2 = ${aDays} days.\nA द्वारा लिया गया समय = ${aDays} दिन।`
      });
    } else if (p === 2) {
      const m1 = this.hnum(variantIndex, 1303, 12, 24);
      const d1 = this.hnum(variantIndex, 1304, 10, 20);
      const m2 = this.hnum(variantIndex, 1305, 15, 30);
      const d2 = Math.round((m1 * d1) / m2);
      return this.makeQuestion({
        topic: 'Time and Work',
        difficulty,
        question: `If ${m1} men can complete a work in ${d1} days, how many days will ${m2} men take to complete the same work?\nयदि ${m1} पुरुष किसी कार्य को ${d1} दिनों में पूरा कर सकते हैं, तो ${m2} पुरुष उसी कार्य को कितने दिनों में पूरा करेंगे?`,
        correctAnswerText: `${d2} Days / दिन`,
        wrongAnswers: [`${d2 - 2} Days / दिन`, `${d2 + 3} Days / दिन`, `${d2 + 5} Days / दिन`],
        explanation: `M1 × D1 = M2 × D2 => ${m1} × ${d1} = ${m2} × D2 => D2 = ${d2} days.\nM1 × D1 = M2 × D2 से: अभीष्ट दिन = ${d2}।`
      });
    } else if (p === 3) {
      const mult = this.hnum(variantIndex, 1306, 1, 8);
      const together = 6 * mult;
      const b = 10 * mult;
      const a = 15 * mult;
      return this.makeQuestion({
        topic: 'Time and Work',
        difficulty,
        question: `A and B together can do a piece of work in ${together} days. If B alone can do it in ${b} days, in how many days can A alone do the work?\nA और B मिलकर एक कार्य को ${together} दिनों में कर सकते हैं। यदि B अकेला इसे ${b} दिनों में कर सकता है, तो A अकेला इसे कितने दिनों में करेगा?`,
        correctAnswerText: `${a} Days / दिन`,
        wrongAnswers: [`${a - 3} Days / दिन`, `${a + 3} Days / दिन`, `${a + 5} Days / दिन`],
        explanation: `A's 1 day work = 1/${together} - 1/${b} = 1/${a}. A alone takes ${a} days.\nA अकेला = ${a} दिन लेगा।`
      });
    } else {
      const triples = [
        { d1: 10, d2: 12, d3: 15, ans: 4 },
        { d1: 12, d2: 15, d3: 20, ans: 5 },
        { d1: 15, d2: 20, d3: 30, ans: 6 },
        { d1: 12, d2: 20, d3: 30, ans: 6 },
        { d1: 20, d2: 24, d3: 30, ans: 8 },
        { d1: 24, d2: 30, d3: 40, ans: 10 },
        { d1: 15, d2: 24, d3: 40, ans: 8 },
        { d1: 18, d2: 20, d3: 45, ans: 9 }
      ];
      const tr = this.hpick(variantIndex, 1307, triples);
      return this.makeQuestion({
        topic: 'Time and Work',
        difficulty,
        question: `A, B, and C can complete a job in ${tr.d1}, ${tr.d2}, and ${tr.d3} days respectively. How many days will they take to complete the job working together?\nA, B और C एक कार्य को क्रमशः ${tr.d1}, ${tr.d2} और ${tr.d3} दिनों में पूरा कर सकते हैं। तीनों मिलकर उस कार्य को कितने दिनों में पूरा करेंगे?`,
        correctAnswerText: `${tr.ans} Days / दिन`,
        wrongAnswers: [`${tr.ans + 1} Days / दिन`, `${tr.ans - 1} Days / दिन`, `${tr.ans + 2} Days / दिन`],
        explanation: `Combined rate = 1/${tr.d1} + 1/${tr.d2} + 1/${tr.d3} = 1/${tr.ans}. They take ${tr.ans} days.\nतीनों मिलकर = ${tr.ans} दिन लेंगे।`
      });
    }
  }

  // 14. Pipe and Cistern
  static generatePipeCistern(variantIndex, difficulty) {
    const p = this.h(variantIndex, 1400) % 4;
    if (p === 0) {
      const a = this.hpick(variantIndex, 1401, [10, 12, 15]);
      const b = a === 10 ? 15 : a === 12 ? 24 : 30;
      const together = (a * b) / (a + b);
      return this.makeQuestion({
        topic: 'Pipe and Cistern',
        difficulty,
        question: `Two pipes A and B can fill a cistern in ${a} hours and ${b} hours respectively. If both pipes are opened together, in how many hours will the cistern be full?\nदो पाइप A और B एक टंकी को क्रमशः ${a} घंटे और ${b} घंटे में भर सकते हैं। यदि दोनों पाइप एक साथ खोल दिए जाएं, तो टंकी कितने घंटे में भर जाएगी?`,
        correctAnswerText: `${together} Hours / घंटे`,
        wrongAnswers: [`${together - 1} Hours / घंटे`, `${together + 2} Hours / घंटे`, `${together + 4} Hours / घंटे`],
        explanation: `Combined filling rate = 1/${a} + 1/${b} = 1/${together}. Time = ${together} hours.\nदोनों मिलकर = ${together} घंटे में भरेंगे।`
      });
    } else if (p === 1) {
      const mult = this.hnum(variantIndex, 1402, 1, 2);
      const fill = 6 * mult;
      const leak = 8 * mult;
      const net = (fill * leak) / (leak - fill); // 24 * mult
      return this.makeQuestion({
        topic: 'Pipe and Cistern',
        difficulty,
        question: `A tap can fill an empty tank in ${fill} hours, but due to a leak at the bottom, it takes ${leak} hours to fill the tank. In how many hours can the leak alone empty the full tank?\nएक नल एक खाली टंकी को ${fill} घंटे में भर सकता है, परंतु तली में रिसाव के कारण इसे भरने में ${leak} घंटे लगते हैं। अकेला रिसाव भरी हुई टंकी को कितने घंटे में खाली कर देगा?`,
        correctAnswerText: `${net} Hours / घंटे`,
        wrongAnswers: [`${net - 4} Hours / घंटे`, `${net + 4} Hours / घंटे`, `${net + 8} Hours / घंटे`],
        explanation: `Leak emptying rate = 1/${fill} - 1/${leak} = 1/${net}. Time = ${net} hours.\nरिसाव द्वारा खाली करने का समय = ${net} घंटे।`
      });
    } else if (p === 2) {
      const mult = this.hnum(variantIndex, 1403, 1, 2);
      const pA = 12 * mult;
      const pB = 15 * mult;
      const pC = 20 * mult;
      const net = 10 * mult;
      return this.makeQuestion({
        topic: 'Pipe and Cistern',
        difficulty,
        question: `Pipe A can fill a tank in ${pA} hours, pipe B in ${pB} hours, and pipe C can empty the full tank in ${pC} hours. If all three are opened simultaneously, in how many hours will the tank be full?\nपाइप A एक टंकी को ${pA} घंटे में, पाइप B ${pB} घंटे में भर सकता है तथा पाइप C भरी टंकी को ${pC} घंटे में खाली कर सकता है। यदि तीनों को एक साथ खोल दिया जाए, तो टंकी कितने घंटे में भरेगी?`,
        correctAnswerText: `${net} Hours / घंटे`,
        wrongAnswers: [`${net - 2} Hours / घंटे`, `${net + 2} Hours / घंटे`, `${net + 4} Hours / घंटे`],
        explanation: `Net filling rate = 1/${pA} + 1/${pB} - 1/${pC} = 1/${net}. Time = ${net} hours.\nकुल भरने की दर से: टंकी ${net} घंटे में भरेगी।`
      });
    } else {
      const mult = this.hnum(variantIndex, 1404, 1, 2);
      const diffMin = 32 * mult;
      const ansMin = 12 * mult;
      return this.makeQuestion({
        topic: 'Pipe and Cistern',
        difficulty,
        question: `Pipe A is 3 times faster than Pipe B and therefore takes ${diffMin} minutes less than Pipe B to fill a reservoir. Find the time taken to fill the reservoir if both pipes are opened together.\nपाइप A, पाइप B से 3 गुना तेज है और इसलिए एक जलाशय को भरने में B से ${diffMin} मिनट कम समय लेता है। यदि दोनों पाइप एक साथ खोल दिए जाएं, तो जलाशय भरने में कितना समय लगेगा?`,
        correctAnswerText: `${ansMin} Minutes / मिनट`,
        wrongAnswers: [`${ansMin + 3} Minutes / मिनट`, `${ansMin - 2} Minutes / मिनट`, `${ansMin + 6} Minutes / मिनट`],
        explanation: `Time ratio A : B = 1 : 3. Difference = 2 units = ${diffMin} mins => 1 unit = ${diffMin / 2} mins. Together = ${ansMin} minutes.\nदोनों मिलकर = ${ansMin} मिनट लेंगे।`
      });
    }
  }

  // 15. Time and Distance
  static generateTimeDistance(variantIndex, difficulty) {
    const p = this.h(variantIndex, 1500) % 5;
    if (p === 0) {
      const x = this.hpick(variantIndex, 1501, [30, 40, 60]);
      const y = x === 30 ? 60 : x === 40 ? 60 : 40;
      const avg = (2 * x * y) / (x + y);
      return this.makeQuestion({
        topic: 'Time and Distance',
        difficulty,
        question: `A person travels from town A to town B at a speed of ${x} km/h and returns at a speed of ${y} km/h. What is his average speed for the whole journey?\nएक व्यक्ति नगर A से नगर B तक ${x} किमी/घंटा की गति से जाता है और ${y} किमी/घंटा की गति से वापस लौटता है। पूरी यात्रा के लिए उसकी औसत गति क्या होगी?`,
        correctAnswerText: `${avg} km/h`,
        wrongAnswers: [`${(x + y) / 2} km/h`, `${avg - 4} km/h`, `${avg + 6} km/h`],
        explanation: `Average Speed = (2 × x × y) / (x + y) = (2 × ${x} × ${y}) / (${x + y}) = ${avg} km/h.\nऔसत चाल = 2xy / (x + y) = ${avg} किमी/घंटा।`
      });
    } else if (p === 1) {
      const speedKmh = this.hpick(variantIndex, 1502, [54, 72, 90]);
      const speedMs = (speedKmh * 5) / 18;
      const len = speedMs * this.hnum(variantIndex, 1503, 8, 15);
      const time = len / speedMs;
      return this.makeQuestion({
        topic: 'Time and Distance',
        difficulty,
        question: `A train ${len} meters long is running at a speed of ${speedKmh} km/h. How many seconds will it take to cross a standing telegraph pole?\n${speedKmh} किमी/घंटा की चाल से चल रही ${len} मीटर लंबी एक रेलगाड़ी एक खड़े टेलीग्राफ खंभे को पार करने में कितने सेकंड का समय लेगी?`,
        correctAnswerText: `${time} Seconds / सेकंड`,
        wrongAnswers: [`${time - 2} Seconds / सेकंड`, `${time + 2} Seconds / सेकंड`, `${time + 4} Seconds / सेकंड`],
        explanation: `Speed in m/s = ${speedKmh} × (5/18) = ${speedMs} m/s. Time = Distance / Speed = ${len} / ${speedMs} = ${time} seconds.\nचाल = ${speedMs} मी/से। समय = ${len} / ${speedMs} = ${time} सेकंड।`
      });
    } else if (p === 2) {
      return this.makeQuestion({
        topic: 'Time and Distance',
        difficulty,
        question: `A train 200 meters long running at 72 km/h crosses a railway platform 300 meters long. Find the time taken to cross the platform.\n72 किमी/घंटा की गति से चल रही 200 मीटर लंबी एक रेलगाड़ी 300 मीटर लंबे रेलवे प्लेटफॉर्म को कितने समय में पार करेगी?`,
        correctAnswerText: '25 Seconds / सेकंड',
        wrongAnswers: ['20 Seconds / सेकंड', '30 Seconds / सेकंड', '15 Seconds / सेकंड'],
        explanation: `Total distance = 200 + 300 = 500 m. Speed = 72 × (5/18) = 20 m/s. Time = 500 / 20 = 25 seconds.\nकुल दूरी = 500 मी, समय = 500 / 20 = 25 सेकंड।`
      });
    } else if (p === 3) {
      return this.makeQuestion({
        topic: 'Time and Distance',
        difficulty,
        question: `Two trains 140 m and 160 m long are running in opposite directions on parallel tracks at speeds of 60 km/h and 48 km/h respectively. In how many seconds will they cross each other?\n140 मीटर और 160 मीटर लंबी दो रेलगाड़ियां समानांतर पटरियों पर विपरीत दिशाओं में क्रमशः 60 किमी/घंटा और 48 किमी/घंटा की चाल से चल रही हैं। वे एक दूसरे को कितने सेकंड में पार करेंगी?`,
        correctAnswerText: '10 Seconds / सेकंड',
        wrongAnswers: ['12 Seconds / सेकंड', '8 Seconds / सेकंड', '15 Seconds / सेकंड'],
        explanation: `Relative speed = 60 + 48 = 108 km/h = 108 × (5/18) = 30 m/s. Total distance = 140 + 160 = 300 m. Time = 300 / 30 = 10 seconds.\nसापेक्ष चाल = 30 मी/से। समय = 300 / 30 = 10 सेकंड।`
      });
    } else {
      return this.makeQuestion({
        topic: 'Time and Distance',
        difficulty,
        question: `Walking at 3/4 of his usual speed, a person is 20 minutes late to his office. What is his usual time to reach the office?\nअपनी सामान्य गति की 3/4 गति से चलने पर एक व्यक्ति अपने कार्यालय 20 मिनट देरी से पहुंचता है। कार्यालय पहुंचने का उसका सामान्य समय क्या है?`,
        correctAnswerText: '60 Minutes / मिनट',
        wrongAnswers: ['45 Minutes / मिनट', '80 Minutes / मिनट', '50 Minutes / मिनट'],
        explanation: `Usual time = Late time × [Numerator / (Denominator - Numerator)] = 20 × (3 / 1) = 60 minutes.\nसामान्य समय = 20 × (3 / 1) = 60 मिनट।`
      });
    }
  }

  // 16. Boat and Stream
  static generateBoatStream(variantIndex, difficulty) {
    const p = this.h(variantIndex, 1600) % 4;
    if (p === 0) {
      const still = this.hnum(variantIndex, 1601, 10, 18);
      const stream = this.hnum(variantIndex, 1602, 2, 5);
      const down = still + stream;
      const up = still - stream;
      return this.makeQuestion({
        topic: 'Boat and Stream',
        difficulty,
        question: `A boat has a speed of ${still} km/h in still water and the speed of the stream is ${stream} km/h. What is the downstream speed of the boat?\nशांत जल में एक नाव की चाल ${still} किमी/घंटा है और धारा की चाल ${stream} किमी/घंटा है। नाव की धारा के अनुकूल (downstream) चाल क्या होगी?`,
        correctAnswerText: `${down} km/h`,
        wrongAnswers: [`${up} km/h`, `${down + 2} km/h`, `${down - 3} km/h`],
        explanation: `Downstream Speed = Speed in still water + Stream speed = ${still} + ${stream} = ${down} km/h.\nधारा के अनुकूल चाल = ${still} + ${stream} = ${down} किमी/घंटा।`
      });
    } else if (p === 1) {
      const down = this.hpick(variantIndex, 1603, [14, 16, 18]);
      const up = down - this.hpick(variantIndex, 1604, [4, 6, 8]);
      const still = (down + up) / 2;
      return this.makeQuestion({
        topic: 'Boat and Stream',
        difficulty,
        question: `A man rows downstream at ${down} km/h and upstream at ${up} km/h. Find his speed in still water.\nएक व्यक्ति धारा के अनुकूल ${down} किमी/घंटा और धारा के प्रतिकूल ${up} किमी/घंटा की चाल से तैर सकता है। शांत जल में उसकी चाल ज्ञात कीजिए।`,
        correctAnswerText: `${still} km/h`,
        wrongAnswers: [`${still - 2} km/h`, `${still + 2} km/h`, `${(down - up) / 2} km/h`],
        explanation: `Speed in still water = (Downstream + Upstream) / 2 = (${down} + ${up}) / 2 = ${still} km/h.\nशांत जल में चाल = (${down} + ${up}) / 2 = ${still} किमी/घंटा।`
      });
    } else if (p === 2) {
      return this.makeQuestion({
        topic: 'Boat and Stream',
        difficulty,
        question: `A swimmer's speed downstream is 15 km/h and upstream is 9 km/h. What is the speed of the water current?\nएक तैराक की धारा के अनुकूल चाल 15 किमी/घंटा तथा धारा के प्रतिकूल चाल 9 किमी/घंटा है। जलधारा की चाल क्या होगी?`,
        correctAnswerText: '3 km/h',
        wrongAnswers: ['4 km/h', '2 km/h', '5 km/h'],
        explanation: `Stream Speed = (Downstream - Upstream) / 2 = (15 - 9) / 2 = 3 km/h.\nधारा की चाल = (15 - 9) / 2 = 3 किमी/घंटा।`
      });
    } else {
      return this.makeQuestion({
        topic: 'Boat and Stream',
        difficulty,
        question: `A boat takes twice as long to row a distance upstream as to row the same distance downstream. If the speed of the stream is 3 km/h, find the speed of the boat in still water.\nएक नाव को किसी दूरी को धारा के प्रतिकूल तय करने में धारा के अनुकूल तय करने की तुलना में दोगुना समय लगता है। यदि धारा की चाल 3 किमी/घंटा है, तो शांत जल में नाव की चाल ज्ञात कीजिए।`,
        correctAnswerText: '9 km/h',
        wrongAnswers: ['6 km/h', '12 km/h', '8 km/h'],
        explanation: `Let boat speed = u. (u - 3) × 2 = (u + 3) × 1 => 2u - 6 = u + 3 => u = 9 km/h.\nशांत जल में नाव की चाल = 9 किमी/घंटा।`
      });
    }
  }

  // 17. Sequence and Series
  static generateSequenceSeries(variantIndex, difficulty) {
    const p = this.h(variantIndex, 1700) % 4;
    if (p === 0) {
      const a = this.hnum(variantIndex, 1701, 3, 9);
      const d = this.hnum(variantIndex, 1702, 3, 6);
      const n = this.hnum(variantIndex, 1703, 10, 20);
      const nth = a + (n - 1) * d;
      return this.makeQuestion({
        topic: 'Sequence and Series',
        difficulty,
        question: `In an Arithmetic Progression (AP) with first term a = ${a} and common difference d = ${d}, find the ${n}th term.\nएक समांतर श्रेणी (AP) में जिसका प्रथम पद a = ${a} और सार्व अंतर d = ${d} है, ${n}वां पद ज्ञात कीजिए।`,
        correctAnswerText: String(nth),
        wrongAnswers: [String(nth - d), String(nth + d), String(nth + 2 * d)],
        explanation: `Formula for nth term = a + (n - 1)d = ${a} + (${n - 1}) × ${d} = ${nth}.\nसमांतर श्रेणी का nवां पद = a + (n - 1)d = ${nth}।`
      });
    } else if (p === 1) {
      return this.makeQuestion({
        topic: 'Sequence and Series',
        difficulty,
        question: `Find the sum of the first 10 terms of the AP: 2, 5, 8, 11, ...\nसमांतर श्रेणी 2, 5, 8, 11, ... के प्रथम 10 पदों का योग ज्ञात कीजिए।`,
        correctAnswerText: '155',
        wrongAnswers: ['150', '160', '145'],
        explanation: `Sn = (n/2)[2a + (n - 1)d] = (10/2)[2(2) + 9(3)] = 5 × 31 = 155.\nयोग Sn = 5 × 31 = 155।`
      });
    } else if (p === 2) {
      const a = this.hnum(variantIndex, 1704, 2, 8);
      const sum = a / 0.5;
      return this.makeQuestion({
        topic: 'Sequence and Series',
        difficulty,
        question: `Find the sum of the infinite Geometric Progression: ${a}, ${a / 2}, ${a / 4}, ...\nअनंत गुणोत्तर श्रेणी ${a}, ${a / 2}, ${a / 4}, ... का योग ज्ञात कीजिए।`,
        correctAnswerText: String(sum),
        wrongAnswers: [String(sum - 1), String(sum + 2), String(sum * 2)],
        explanation: `Sum of infinite GP = a / (1 - r) = ${a} / (1 - 0.5) = ${a} / 0.5 = ${sum}.\nअनंत GP का योग = a / (1 - r) = ${sum}।`
      });
    } else {
      const n = this.hnum(variantIndex, 1705, 12, 25);
      const ans = n * n;
      return this.makeQuestion({
        topic: 'Sequence and Series',
        difficulty,
        question: `What is the sum of the first ${n} odd natural numbers?\nप्रथम ${n} विषम प्राकृतिक संख्याओं का योग क्या होगा?`,
        correctAnswerText: String(ans),
        wrongAnswers: [String(ans - n), String(ans + n), String(n * (n + 1))],
        explanation: `The sum of the first n odd numbers is always n² = ${n}² = ${ans}.\nप्रथम n विषम संख्याओं का योग n² होता है = ${ans}।`
      });
    }
  }

  // 18. Algebra
  static generateAlgebra(variantIndex, difficulty) {
    const p = this.h(variantIndex, 1800) % 5;
    if (p === 0) {
      const k = this.hnum(variantIndex, 1801, 3, 7);
      const ans = k * k - 2;
      return this.makeQuestion({
        topic: 'Algebra',
        difficulty,
        question: `If x + 1/x = ${k}, what is the value of x² + 1/x²?\nयदि x + 1/x = ${k} है, तो x² + 1/x² का मान क्या होगा?`,
        correctAnswerText: String(ans),
        wrongAnswers: [String(k * k), String(ans - 2), String(ans + 4)],
        explanation: `Squaring both sides: (x + 1/x)² = x² + 1/x² + 2 = ${k * k} => x² + 1/x² = ${k * k} - 2 = ${ans}.\nदोनों पक्षों का वर्ग करने पर: x² + 1/x² = ${k}² - 2 = ${ans}।`
      });
    } else if (p === 1) {
      const k = this.hpick(variantIndex, 1802, [3, 4, 5]);
      const ans = Math.pow(k, 3) - 3 * k;
      return this.makeQuestion({
        topic: 'Algebra',
        difficulty,
        question: `If x + 1/x = ${k}, find the value of x³ + 1/x³.\nयदि x + 1/x = ${k} है, तो x³ + 1/x³ का मान ज्ञात कीजिए।`,
        correctAnswerText: String(ans),
        wrongAnswers: [String(Math.pow(k, 3)), String(ans - 4), String(ans + 6)],
        explanation: `Using the algebraic expansion formula: x³ + 1/x³ = (x + 1/x)³ - 3(x + 1/x) = ${k}³ - 3(${k}) = ${ans}.\nबीजगणितीय सर्वसमिका से: x³ + 1/x³ = ${k}³ - 3(${k}) = ${ans}।`
      });
    } else if (p === 2) {
      return this.makeQuestion({
        topic: 'Algebra',
        difficulty,
        question: `If a + b + c = 0, find the value of (a³ + b³ + c³) / (3abc).\nयदि a + b + c = 0 है, तो (a³ + b³ + c³) / (3abc) का मान क्या होगा?`,
        correctAnswerText: '1',
        wrongAnswers: ['3', '0', '2'],
        explanation: `When a + b + c = 0, then a³ + b³ + c³ = 3abc. Therefore (a³ + b³ + c³) / (3abc) = 1.\nयदि a + b + c = 0 हो, तो a³ + b³ + c³ = 3abc होता है। अतः मान = 1।`
      });
    } else if (p === 3) {
      const k = this.hnum(variantIndex, 1803, 3, 6);
      const ans = k * k + 2;
      return this.makeQuestion({
        topic: 'Algebra',
        difficulty,
        question: `If x - 1/x = ${k}, find the value of x² + 1/x².\nयदि x - 1/x = ${k} है, तो x² + 1/x² का मान ज्ञात कीजिए।`,
        correctAnswerText: String(ans),
        wrongAnswers: [String(k * k - 2), String(k * k), String(ans + 2)],
        explanation: `Squaring both sides: (x - 1/x)² = x² + 1/x² - 2 => x² + 1/x² = ${k}² + 2 = ${ans}.\nदोनों पक्षों का वर्ग करने पर: x² + 1/x² = ${ans}।`
      });
    } else {
      const b = this.hnum(variantIndex, 1804, 4, 12);
      const c = this.hnum(variantIndex, 1805, 3, 9);
      return this.makeQuestion({
        topic: 'Algebra',
        difficulty,
        question: `Find the sum of the roots of the quadratic equation x² - ${b}x + ${c} = 0.\nद्विघात समीकरण x² - ${b}x + ${c} = 0 के मूलों का योगफल ज्ञात कीजिए।`,
        correctAnswerText: String(b),
        wrongAnswers: [String(-b), String(c), String(-c)],
        explanation: `Sum of roots of ax² + bx + c = 0 is -B/A = -(-${b})/1 = ${b}.\nमूलों का योग = -(-b)/a = ${b}।`
      });
    }
  }

  // 19. Trigonometry
  static generateTrigonometry(variantIndex, difficulty) {
    const p = this.h(variantIndex, 1900) % 5;
    if (p === 0) {
      const is60 = this.h(variantIndex, 1901) % 2 === 0;
      const h = this.hnum(variantIndex, 1902, 12, 48);
      if (is60) {
        return this.makeQuestion({
          topic: 'Trigonometry',
          difficulty,
          question: `A vertical pole of height ${h}√3 meters casts a shadow of length ${h} meters on the ground. Find the angle of elevation of the sun.\n${h}√3 मीटर ऊंचे एक खंभे की जमीन पर छाया की लंबाई ${h} मीटर है। सूर्य का उन्नयन कोण क्या होगा?`,
          correctAnswerText: '60°',
          wrongAnswers: ['30°', '45°', '90°'],
          explanation: `tan(θ) = Height / Shadow = (${h}√3) / ${h} = √3 => θ = 60°.\ntan(θ) = लंब / आधार = √3 => θ = 60°।`
        });
      } else {
        return this.makeQuestion({
          topic: 'Trigonometry',
          difficulty,
          question: `A vertical pole of height ${h} meters casts a shadow of length ${h}√3 meters on the ground. Find the angle of elevation of the sun.\n${h} मीटर ऊंचे एक खंभे की जमीन पर छाया की लंबाई ${h}√3 मीटर है। सूर्य का उन्नयन कोण क्या होगा?`,
          correctAnswerText: '30°',
          wrongAnswers: ['60°', '45°', '90°'],
          explanation: `tan(θ) = Height / Shadow = ${h} / (${h}√3) = 1/√3 => θ = 30°.\ntan(θ) = लंब / आधार = 1/√3 => θ = 30°।`
        });
      }
    } else if (p === 1) {
      const pwr = this.hpick(variantIndex, 1903, [3, 5, 7, 9, 11, 13]);
      return this.makeQuestion({
        topic: 'Trigonometry',
        difficulty,
        question: `If tan(θ) + cot(θ) = 2, find the value of tan^${pwr}(θ) + cot^${pwr}(θ).\nयदि tan(θ) + cot(θ) = 2 है, तो tan^${pwr}(θ) + cot^${pwr}(θ) का मान क्या होगा?`,
        correctAnswerText: '2',
        wrongAnswers: ['1', String(pwr), '4'],
        explanation: `tan(θ) + 1/tan(θ) = 2 => tan(θ) = 1 (θ = 45°). Therefore 1^${pwr} + 1^${pwr} = 2.\nहल करने पर tan(θ) = 1 प्राप्त होता है, अतः 1 + 1 = 2।`
      });
    } else if (p === 2) {
      const cases = [
        { qEn: 'sin(30°)·cos(60°) + cos(30°)·sin(60°)', qHi: 'sin(30°)·cos(60°) + cos(30°)·sin(60°)', ans: '1', wrongs: ['1/2', '√3/2', '0'], expEn: 'sin(30° + 60°) = sin(90°) = 1.', expHi: 'sin(30° + 60°) = sin(90°) = 1।' },
        { qEn: 'cos(60°)·cos(30°) - sin(60°)·sin(30°)', qHi: 'cos(60°)·cos(30°) - sin(60°)·sin(30°)', ans: '0', wrongs: ['1', '1/2', '√3/2'], expEn: 'cos(60° + 30°) = cos(90°) = 0.', expHi: 'cos(60° + 30°) = cos(90°) = 0।' },
        { qEn: 'sin(45°)·cos(45°) + cos(45°)·sin(45°)', qHi: 'sin(45°)·cos(45°) + cos(45°)·sin(45°)', ans: '1', wrongs: ['1/2', '1/√2', '0'], expEn: 'sin(45° + 45°) = sin(90°) = 1.', expHi: 'sin(45° + 45°) = sin(90°) = 1।' },
        { qEn: 'cos²(30°) - sin²(30°)', qHi: 'cos²(30°) - sin²(30°)', ans: '1/2', wrongs: ['1', '√3/2', '0'], expEn: 'cos(2 × 30°) = cos(60°) = 1/2.', expHi: 'cos(60°) = 1/2।' }
      ];
      const c = this.hpick(variantIndex, 1904, cases);
      return this.makeQuestion({
        topic: 'Trigonometry',
        difficulty,
        question: `Evaluate: ${c.qEn}.\n${c.qHi} का मान क्या होगा?`,
        correctAnswerText: c.ans,
        wrongAnswers: c.wrongs,
        explanation: `Using compound angle formula: ${c.expEn}\nत्रिकोणमितीय सूत्र से: ${c.expHi}`
      });
    } else if (p === 3) {
      const c1 = this.hnum(variantIndex, 1905, 2, 8);
      const c2 = this.hnum(variantIndex, 1906, 1, 5);
      const ans = c1 + c2;
      return this.makeQuestion({
        topic: 'Trigonometry',
        difficulty,
        question: `What is the value of ${c1}(sec²θ - tan²θ) + ${c2}(cosec²θ - cot²θ)?\n${c1}(sec²θ - tan²θ) + ${c2}(cosec²θ - cot²θ) का मान क्या होगा?`,
        correctAnswerText: String(ans),
        wrongAnswers: [String(ans - 1), String(ans + 2), String(c1)],
        explanation: `By fundamental identities: sec²θ - tan²θ = 1 and cosec²θ - cot²θ = 1. Sum = ${c1}(1) + ${c2}(1) = ${ans}.\nमूलभूत सर्वसमिकाओं से: ${c1}(1) + ${c2}(1) = ${ans}।`
      });
    } else {
      const triples = [
        { p: 3, b: 4, h: 5 },
        { p: 5, b: 12, h: 13 },
        { p: 8, b: 15, h: 17 },
        { p: 7, b: 24, h: 25 },
        { p: 9, b: 40, h: 41 }
      ];
      const tr = this.hpick(variantIndex, 1907, triples);
      return this.makeQuestion({
        topic: 'Trigonometry',
        difficulty,
        question: `If sin(θ) = ${tr.p}/${tr.h} where θ is an acute angle, find the value of cos(θ).\nयदि sin(θ) = ${tr.p}/${tr.h} है जहां θ एक न्यूनकोण है, तो cos(θ) का मान ज्ञात कीजिए।`,
        correctAnswerText: `${tr.b}/${tr.h}`,
        wrongAnswers: [`${tr.p}/${tr.b}`, `${tr.h}/${tr.b}`, `${tr.b - 1}/${tr.h}`],
        explanation: `Using fundamental identity: cos(θ) = √(1 - sin²θ) = √(1 - (${tr.p}/${tr.h})²) = ${tr.b}/${tr.h}.\nत्रिकोणमितीय सर्वसमिका से: cos(θ) = ${tr.b}/${tr.h}।`
      });
    }
  }

  // 20. Geometry
  static generateGeometry(variantIndex, difficulty) {
    const p = this.h(variantIndex, 2000) % 5;
    if (p === 0) {
      const a1 = this.hnum(variantIndex, 2001, 40, 75);
      const a2 = this.hnum(variantIndex, 2002, 40, 65);
      const a3 = 180 - (a1 + a2);
      return this.makeQuestion({
        topic: 'Geometry',
        difficulty,
        question: `In a triangle ABC, if ∠A = ${a1}° and ∠B = ${a2}°, find the measure of ∠C.\nएक त्रिभुज ABC में, यदि ∠A = ${a1}° और ∠B = ${a2}° है, तो ∠C का मान क्या होगा?`,
        correctAnswerText: `${a3}°`,
        wrongAnswers: [`${a3 - 10}°`, `${a3 + 10}°`, `${a3 + 15}°`],
        explanation: `Sum of three angles of a triangle is 180°. ∠C = 180° - (${a1}° + ${a2}°) = ${a3}°.\nत्रिभुज के तीनों कोणों का योग 180° होता है: ∠C = 180° - (${a1} + ${a2}) = ${a3}°।`
      });
    } else if (p === 1) {
      const angleCirc = this.hnum(variantIndex, 2003, 30, 60);
      const angleCenter = angleCirc * 2;
      return this.makeQuestion({
        topic: 'Geometry',
        difficulty,
        question: `The angle subtended by an arc of a circle at the circumference is ${angleCirc}°. Find the angle subtended by the same arc at the center of the circle.\nवृत्त के किसी चाप द्वारा परिधि पर अंतरित कोण ${angleCirc}° है। उसी चाप द्वारा वृत्त के केंद्र पर अंतरित कोण क्या होगा?`,
        correctAnswerText: `${angleCenter}°`,
        wrongAnswers: [`${angleCirc}°`, `${angleCenter + 15}°`, `${angleCenter - 20}°`],
        explanation: `Angle at center is twice the angle subtended at circumference: 2 × ${angleCirc}° = ${angleCenter}°.\\nकेंद्र पर अंतरित कोण परिधि के कोण का दोगुना होता है: 2 × ${angleCirc}° = ${angleCenter}°।`
      });
    } else if (p === 2) {
      const a = this.hnum(variantIndex, 2004, 65, 115);
      const c = 180 - a;
      return this.makeQuestion({
        topic: 'Geometry',
        difficulty,
        question: `In a cyclic quadrilateral ABCD, if ∠A = ${a}°, find the opposite angle ∠C.\nएक चक्रीय चतुर्भुज ABCD में, यदि ∠A = ${a}° है, तो विपरीत कोण ∠C का मान क्या होगा?`,
        correctAnswerText: `${c}°`,
        wrongAnswers: [`${c - 10}°`, `${c + 15}°`, `${a}°`],
        explanation: `Opposite angles of a cyclic quadrilateral are supplementary (sum = 180°). ∠C = 180° - ${a}° = ${c}°.\\nचक्रीय चतुर्भुज के सम्मुख कोणों का योग 180° होता है। अतः ∠C = ${c}°।`
      });
    } else if (p === 3) {
      return this.makeQuestion({
        topic: 'Geometry',
        difficulty,
        question: `A tangent is drawn to a circle of radius 5 cm from a point 13 cm away from the center. Find the length of the tangent.\n5 सेमी त्रिज्या वाले एक वृत्त पर केंद्र से 13 सेमी दूरी पर स्थित बिंदु से स्पर्श रेखा खींची जाती है। स्पर्श रेखा की लंबाई ज्ञात कीजिए।`,
        correctAnswerText: '12 cm / सेमी',
        wrongAnswers: ['10 cm / सेमी', '14 cm / सेमी', '11 cm / सेमी'],
        explanation: `By Pythagoras theorem: Tangent = √(d² - r²) = √(13² - 5²) = √(169 - 25) = √144 = 12 cm.\nपाइथागोरस प्रमेय से: स्पर्श रेखा = √(169 - 25) = 12 सेमी।`
      });
    } else {
      const vertex = this.hnum(variantIndex, 2005, 40, 80);
      const base = (180 - vertex) / 2;
      return this.makeQuestion({
        topic: 'Geometry',
        difficulty,
        question: `In an isosceles triangle ABC with AB = AC, the vertex angle ∠A is ${vertex}°. Find the measure of base angle ∠B.\nएक समद्विबाहु त्रिभुज ABC में जहां AB = AC है, शीर्ष कोण ∠A = ${vertex}° है। आधार कोण ∠B का मान क्या होगा?`,
        correctAnswerText: `${base}°`,
        wrongAnswers: [`${base - 5}°`, `${base + 10}°`, `${vertex}°`],
        explanation: `In an isosceles triangle, base angles are equal. ∠B = (180° - ${vertex}°) / 2 = ${base}°.\\nसमद्विबाहु त्रिभुज में आधार कोण बराबर होते हैं: (180° - ${vertex}°) / 2 = ${base}°।`
      });
    }
  }

  // 21. Mensuration
  static generateMensuration(variantIndex, difficulty) {
    const p = this.h(variantIndex, 2100) % 5;
    if (p === 0) {
      const l = this.hnum(variantIndex, 2101, 12, 25);
      const b = this.hnum(variantIndex, 2102, 6, 14);
      const area = l * b;
      return this.makeQuestion({
        topic: 'Mensuration',
        difficulty,
        question: `Find the area of a rectangle whose length is ${l} cm and breadth is ${b} cm.\nएक आयत का क्षेत्रफल ज्ञात कीजिए जिसकी लंबाई ${l} सेमी और चौड़ाई ${b} सेमी है।`,
        correctAnswerText: `${area} cm²`,
        wrongAnswers: [`${area - 15} cm²`, `${area + 15} cm²`, `${2 * (l + b)} cm²`],
        explanation: `Area = Length × Breadth = ${l} × ${b} = ${area} cm².\nआयत का क्षेत्रफल = लंबाई × चौड़ाई = ${area} वर्ग सेमी।`
      });
    } else if (p === 1) {
      const r = this.hpick(variantIndex, 2103, [7, 14, 21]);
      const area = Math.round((22 / 7) * r * r);
      return this.makeQuestion({
        topic: 'Mensuration',
        difficulty,
        question: `Find the area of a circle of radius ${r} cm (use π = 22/7).\n${r} सेमी त्रिज्या वाले एक वृत्त का क्षेत्रफल ज्ञात कीजिए (π = 22/7 लें)।`,
        correctAnswerText: `${area} cm²`,
        wrongAnswers: [`${area - 30} cm²`, `${area + 30} cm²`, `${2 * (22 / 7) * r} cm²`],
        explanation: `Area = π × r² = (22/7) × ${r}² = ${area} cm².\nवृत्त का क्षेत्रफल = πr² = ${area} वर्ग सेमी।`
      });
    } else if (p === 2) {
      const r = 7;
      const h = this.hnum(variantIndex, 2104, 5, 15);
      const vol = (22 / 7) * r * r * h;
      return this.makeQuestion({
        topic: 'Mensuration',
        difficulty,
        question: `Find the volume of a right circular cylinder having a base radius of 7 cm and a height of ${h} cm (use π = 22/7).\n7 सेमी आधार त्रिज्या और ${h} सेमी ऊंचाई वाले एक लंब वृत्तीय बेलन का आयतन ज्ञात कीजिए (π = 22/7 लें)।`,
        correctAnswerText: `${vol} cm³`,
        wrongAnswers: [`${vol - 100} cm³`, `${vol + 150} cm³`, `${vol + 300} cm³`],
        explanation: `Volume = π × r² × h = (22/7) × 49 × ${h} = 154 × ${h} = ${vol} cm³.\nबेलन का आयतन = πr²h = ${vol} घन सेमी।`
      });
    } else if (p === 3) {
      return this.makeQuestion({
        topic: 'Mensuration',
        difficulty,
        question: `Find the length of the longest pole that can be placed in a room of dimensions 12 m × 9 m × 8 m.\n12 मी × 9 मी × 8 मी विमाओं वाले कमरे में रखे जा सकने वाले सबसे लंबे खंभे की लंबाई ज्ञात कीजिए।`,
        correctAnswerText: '17 m / मीटर',
        wrongAnswers: ['15 m / मीटर', '19 m / मीटर', '21 m / मीटर'],
        explanation: `Diagonal of cuboid = √(l² + b² + h²) = √(12² + 9² + 8²) = √(144 + 81 + 64) = √289 = 17 m.\nघनाभ का विकर्ण = √(144 + 81 + 64) = √289 = 17 मीटर।`
      });
    } else {
      return this.makeQuestion({
        topic: 'Mensuration',
        difficulty,
        question: `A wire bent into the form of a circle of radius 28 cm is reshaped into a square. What is the length of the side of the square? (π = 22/7)\n28 सेमी त्रिज्या वाले वृत्त के रूप में मुड़े हुए एक तार को एक वर्ग के रूप में पुनः मोड़ा जाता है। वर्ग की भुजा की लंबाई क्या होगी? (π = 22/7)`,
        correctAnswerText: '44 cm / सेमी',
        wrongAnswers: ['40 cm / सेमी', '48 cm / सेमी', '52 cm / सेमी'],
        explanation: `Perimeter of circle = 2 × (22/7) × 28 = 176 cm. Side of square = 176 / 4 = 44 cm.\nवृत्त की परिधि = 176 सेमी। वर्ग की भुजा = 176 / 4 = 44 सेमी।`
      });
    }
  }

  // 22. Statistics & Data Interpretation
  static generateStatisticsDi(variantIndex, difficulty) {
    const p = this.h(variantIndex, 2200) % 5;
    if (p === 0) {
      const deg = this.hpick(variantIndex, 2201, [36, 54, 72, 90, 108]);
      const pct = (deg / 360) * 100;
      return this.makeQuestion({
        topic: 'Statistics & Data Interpretation',
        difficulty,
        question: `In a pie chart representing monthly family expenses, the central angle for food is ${deg}°. What percentage of total expenditure is spent on food?\nपारिवारिक मासिक व्यय को दर्शाने वाले एक पाई चार्ट में भोजन का केंद्रीय कोण ${deg}° है। कुल व्यय का कितना प्रतिशत भोजन पर खर्च होता है?`,
        correctAnswerText: `${pct}%`,
        wrongAnswers: [`${pct - 5}%`, `${pct + 5}%`, `${deg / 2}%`],
        explanation: `Percentage = (Central Angle / 360°) × 100 = (${deg} / 360) × 100 = ${pct}%.\nप्रतिशत = (${deg} / 360) × 100 = ${pct}%।`
      });
    } else if (p === 1) {
      const mean = this.hnum(variantIndex, 2202, 18, 30);
      const median = mean + 2;
      const mode = 3 * median - 2 * mean;
      return this.makeQuestion({
        topic: 'Statistics & Data Interpretation',
        difficulty,
        question: `In a moderately skewed distribution, if the mean is ${mean} and the median is ${median}, find the mode.\nएक मध्यम विषम बंटन में, यदि माध्य ${mean} तथा माध्यिका ${median} है, तो बहुलक (Mode) ज्ञात कीजिए।`,
        correctAnswerText: String(mode),
        wrongAnswers: [String(mode - 2), String(mode + 3), String(mean + median)],
        explanation: `By empirical relation: Mode = 3 × Median - 2 × Mean = 3(${median}) - 2(${mean}) = ${mode}.\nबहुलक = 3 × माध्यिका - 2 × माध्य = ${mode}।`
      });
    } else if (p === 2) {
      const min = this.hnum(variantIndex, 2203, 12, 25);
      const max = min + this.hnum(variantIndex, 2204, 30, 60);
      const range = max - min;
      return this.makeQuestion({
        topic: 'Statistics & Data Interpretation',
        difficulty,
        question: `Find the range of the following data values: ${min}, ${min + 5}, ${min + 12}, ${min + 20}, ${max}.\nदिए गए आंकड़ों का परिसर (Range) ज्ञात कीजिए: ${min}, ${min + 5}, ${min + 12}, ${min + 20}, ${max}।`,
        correctAnswerText: String(range),
        wrongAnswers: [String(range - 5), String(range + 5), String(max)],
        explanation: `Range = Maximum value - Minimum value = ${max} - ${min} = ${range}.\nपरिसर = अधिकतम मान - न्यूनतम मान = ${max} - ${min} = ${range}।`
      });
    } else if (p === 3) {
      const base = this.hnum(variantIndex, 2205, 10, 25);
      const v1 = base;
      const v2 = base + 5;
      const v3 = base + 10;
      const v4 = base + 15;
      const v5 = base + 20;
      const mean = (v1 + v2 + v3 + v4 + v5) / 5;
      return this.makeQuestion({
        topic: 'Statistics & Data Interpretation',
        difficulty,
        question: `Find the arithmetic mean of ${v1}, ${v2}, ${v3}, ${v4}, and ${v5}.\n${v1}, ${v2}, ${v3}, ${v4} और ${v5} का समांतर माध्य क्या होगा?`,
        correctAnswerText: String(mean),
        wrongAnswers: [String(mean - 2), String(mean + 2), String(mean + 5)],
        explanation: `Mean = Sum of observations / Count = (${v1} + ${v2} + ${v3} + ${v4} + ${v5}) / 5 = ${mean}.\nमाध्य = पदों का योग / संख्या = ${mean}।`
      });
    } else {
      const shift = this.hnum(variantIndex, 2206, 1, 10);
      const median = 10 + shift;
      const arr = [5 + shift, 7 + shift, 8 + shift, 10 + shift, 12 + shift, 14 + shift, 19 + shift];
      return this.makeQuestion({
        topic: 'Statistics & Data Interpretation',
        difficulty,
        question: `Find the median of the following dataset: ${arr.join(', ')}.\nदिए गए आंकड़ों की माध्यिका (Median) ज्ञात कीजिए: ${arr.join(', ')}।`,
        correctAnswerText: String(median),
        wrongAnswers: [String(median - 2), String(median + 2), String(median + 4)],
        explanation: `Arranging in ascending order: ${arr.join(', ')}. The middle (4th) term is ${median}.\nआरोही क्रम में मध्य पद = ${median}।`
      });
    }
  }

  // 23. Statistics & Probability
  static generateProbability(variantIndex, difficulty) {
    const p = this.h(variantIndex, 2300) % 5;
    if (p === 0) {
      return this.makeQuestion({
        topic: 'Statistics & Probability',
        difficulty,
        question: `What is the probability of getting an even prime number when rolling an unbiased standard 6-faced die?\nएक मानक 6 फलक वाले पासे को फेंकने पर एक सम अभाज्य संख्या आने की प्रायिकता क्या होगी?`,
        correctAnswerText: '1/6',
        wrongAnswers: ['1/2', '1/3', '2/3'],
        explanation: `The only even prime number is 2 (1 outcome). Total outcomes = 6. Probability = 1/6.\nसम अभाज्य संख्या केवल 2 है। प्रायिकता = 1/6।`
      });
    } else if (p === 1) {
      return this.makeQuestion({
        topic: 'Statistics & Probability',
        difficulty,
        question: `A card is drawn at random from a standard pack of 52 playing cards. What is the probability that the card drawn is a face card (Jack, Queen, or King)?\n52 ताश के पत्तों की गड्डी में से यादृच्छिक रूप से एक पत्ता निकाला जाता है। क्या प्रायिकता है कि निकाला गया पत्ता एक तस्वीर वाला पत्ता (Face card) हो?`,
        correctAnswerText: '3/13',
        wrongAnswers: ['4/13', '1/13', '1/4'],
        explanation: `Total face cards = 4 Jacks + 4 Queens + 4 Kings = 12 cards. Probability = 12/52 = 3/13.\nतस्वीर वाले पत्ते = 12। प्रायिकता = 12/52 = 3/13।`
      });
    } else if (p === 2) {
      return this.makeQuestion({
        topic: 'Statistics & Probability',
        difficulty,
        question: `Two unbiased coins are tossed simultaneously. What is the probability of getting at least one head?\nदो निष्पक्ष सिक्कों को एक साथ उछाला जाता है। कम से कम एक चित (Head) आने की प्रायिकता क्या होगी?`,
        correctAnswerText: '3/4',
        wrongAnswers: ['1/2', '1/4', '1'],
        explanation: `Sample space = {HH, HT, TH, TT} = 4. Outcomes with at least one head = {HH, HT, TH} = 3. Probability = 3/4.\nअनुकूल परिणाम = 3, कुल परिणाम = 4। प्रायिकता = 3/4।`
      });
    } else if (p === 3) {
      const r = this.hnum(variantIndex, 2301, 3, 6);
      const b = this.hnum(variantIndex, 2302, 4, 7);
      const total = r + b;
      return this.makeQuestion({
        topic: 'Statistics & Probability',
        difficulty,
        question: `A bag contains ${r} red balls and ${b} black balls. If one ball is drawn at random, what is the probability that it is red?\nएक थैले में ${r} लाल गेंदें और ${b} काली गेंदें हैं। यदि एक गेंद यादृच्छिक रूप से निकाली जाए, तो इसके लाल होने की प्रायिकता क्या होगी?`,
        correctAnswerText: `${r}/${total}`,
        wrongAnswers: [`${b}/${total}`, `1/${total}`, '1/2'],
        explanation: `Total balls = ${r} + ${b} = ${total}. Favorable outcomes for red = ${r}. Probability = ${r}/${total}.\nप्रायिकता = ${r}/${total}।`
      });
    } else {
      return this.makeQuestion({
        topic: 'Statistics & Probability',
        difficulty,
        question: `Two standard 6-faced dice are rolled together. What is the probability of getting a sum of 7?\nदो पासों को एक साथ फेंका जाता है। दोनों पासों पर आने वाले अंकों का योग 7 होने की प्रायिकता क्या होगी?`,
        correctAnswerText: '1/6',
        wrongAnswers: ['1/12', '5/36', '7/36'],
        explanation: `Outcomes giving sum 7: (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) = 6 pairs. Total outcomes = 36. Probability = 6/36 = 1/6.\nयोग 7 के कुल 6 जोड़े बनते हैं। कुल परिणाम = 36। प्रायिकता = 6/36 = 1/6।`
      });
    }
  }

  // 24. Problem on Ages
  static generateAges(variantIndex, difficulty) {
    const p = this.h(variantIndex, 2400) % 4;
    if (p === 0) {
      const fRatio = this.hpick(variantIndex, 2401, [5, 6, 7, 8, 9]);
      const sRatio = this.hpick(variantIndex, 2402, [1, 2, 3]);
      const years = this.hpick(variantIndex, 2403, [5, 8, 10, 12]);
      const mult = this.hnum(variantIndex, 2404, 3, 8);
      const fAge = fRatio * mult;
      const sAge = sRatio * mult;
      const totalFuture = fAge + sAge + 2 * years;
      return this.makeQuestion({
        topic: 'Problem on Ages',
        difficulty,
        question: `The ratio of the present ages of a father and his son is ${fRatio} : ${sRatio}. After ${years} years, the sum of their ages will be ${totalFuture} years. What is the present age of the father?\nएक पिता और उसके पुत्र की वर्तमान आयु का अनुपात ${fRatio} : ${sRatio} है। ${years} वर्ष बाद उनकी आयु का योग ${totalFuture} वर्ष होगा। पिता की वर्तमान आयु क्या है?`,
        correctAnswerText: `${fAge} Years / वर्ष`,
        wrongAnswers: [`${fAge - fRatio} Years / वर्ष`, `${fAge + fRatio} Years / वर्ष`, `${sAge} Years / वर्ष`],
        explanation: `Let ages be ${fRatio}x and ${sRatio}x. After ${years} yrs: (${fRatio}x + ${years}) + (${sRatio}x + ${years}) = ${totalFuture} => (${fRatio + sRatio})x = ${fAge + sAge} => x = ${mult}. Father's age = ${fAge} years.\nपिता की वर्तमान आयु = ${fAge} वर्ष।`
      });
    } else if (p === 1) {
      const dAge = this.hnum(variantIndex, 2405, 8, 22);
      const multM = this.hpick(variantIndex, 2406, [2, 3, 4]);
      const mAge = dAge * multM;
      const diff = mAge - dAge;
      return this.makeQuestion({
        topic: 'Problem on Ages',
        difficulty,
        question: `A mother is ${multM} times as old as her daughter. If the difference between their ages is ${diff} years, what is the age of the daughter?\nएक मां की आयु अपनी पुत्री की आयु की ${multM} गुनी है। यदि उनकी आयु का अंतर ${diff} वर्ष है, तो पुत्री की आयु क्या होगी?`,
        correctAnswerText: `${dAge} Years / वर्ष`,
        wrongAnswers: [`${dAge - 2} Years / वर्ष`, `${dAge + 3} Years / वर्ष`, `${mAge} Years / वर्ष`],
        explanation: `Let daughter's age = x. Mother's age = ${multM}x. Difference = ${multM - 1}x = ${diff} => x = ${dAge} years.\nपुत्री की आयु = ${dAge} वर्ष।`
      });
    } else if (p === 2) {
      const pastY = this.hnum(variantIndex, 2407, 3, 8);
      const pastAvg = this.hnum(variantIndex, 2408, 20, 32);
      const futureY = this.hnum(variantIndex, 2409, 3, 8);
      const ans = pastAvg + pastY + futureY;
      return this.makeQuestion({
        topic: 'Problem on Ages',
        difficulty,
        question: `${pastY} years ago, the average age of A, B, and C was ${pastAvg} years. ${futureY} years later, what will be the average age of A, B, and C?\n${pastY} वर्ष पूर्व A, B और C की औसत आयु ${pastAvg} वर्ष थी। ${futureY} वर्ष बाद A, B और C की औसत आयु क्या होगी?`,
        correctAnswerText: `${ans} Years / वर्ष`,
        wrongAnswers: [`${ans - 4} Years / वर्ष`, `${ans + 4} Years / वर्ष`, `${ans - 2} Years / वर्ष`],
        explanation: `Present average = ${pastAvg} + ${pastY} = ${pastAvg + pastY} years. ${futureY} years later, average will be ${pastAvg + pastY} + ${futureY} = ${ans} years.\nवर्तमान औसत = ${pastAvg + pastY} वर्ष। ${futureY} वर्ष बाद औसत = ${ans} वर्ष।`
      });
    } else {
      const r1 = this.hnum(variantIndex, 2410, 3, 7);
      const r2 = r1 + this.hnum(variantIndex, 2411, 1, 3);
      const multB = this.hnum(variantIndex, 2412, 4, 9);
      const sum = (r1 + r2) * multB;
      const bAge = r2 * multB;
      return this.makeQuestion({
        topic: 'Problem on Ages',
        difficulty,
        question: `The present ages of A and B are in the ratio ${r1} : ${r2}. If the sum of their present ages is ${sum} years, what is B's present age?\nA और B की वर्तमान आयु का अनुपात ${r1} : ${r2} है। यदि उनकी वर्तमान आयु का योग ${sum} वर्ष है, तो B की वर्तमान आयु क्या है?`,
        correctAnswerText: `${bAge} Years / वर्ष`,
        wrongAnswers: [`${bAge - r2} Years / वर्ष`, `${bAge + r2} Years / वर्ष`, `${r1 * multB} Years / वर्ष`],
        explanation: `B's age = [${r2} / (${r1} + ${r2})] × ${sum} = ${r2} × ${multB} = ${bAge} years.\nB की आयु = ${bAge} वर्ष।`
      });
    }
  }

  // 25. Miscellaneous
  static generateMiscellaneous(variantIndex, difficulty) {
    const p = this.h(variantIndex, 2500) % 5;
    if (p === 0) {
      const clockCases = [
        { h: 3, m: 30, ans: 75, timeStr: '3:30' },
        { h: 4, m: 20, ans: 10, timeStr: '4:20' },
        { h: 7, m: 20, ans: 100, timeStr: '7:20' },
        { h: 8, m: 20, ans: 130, timeStr: '8:20' },
        { h: 2, m: 15, ans: 22.5, timeStr: '2:15' },
        { h: 5, m: 40, ans: 70, timeStr: '5:40' },
        { h: 6, m: 30, ans: 15, timeStr: '6:30' },
        { h: 9, m: 30, ans: 105, timeStr: '9:30' }
      ];
      const c = this.hpick(variantIndex, 2501, clockCases);
      return this.makeQuestion({
        topic: 'Miscellaneous',
        difficulty,
        question: `What is the angle between the hour hand and the minute hand of a clock at ${c.timeStr}?\nकिसी घड़ी में ${c.timeStr} बजे घंटे और मिनट की सुइयों के बीच कितने अंश का कोण बनेगा?`,
        correctAnswerText: `${c.ans}°`,
        wrongAnswers: [`${c.ans + 15}°`, `${Math.max(10, c.ans - 15)}°`, `${c.ans + 30}°`],
        explanation: `Formula: Angle = |(11/2)M - 30H| = |(11/2)(${c.m}) - 30(${c.h})| = ${c.ans}°.\nसूत्र: कोण = |(11/2)M - 30H| = ${c.ans}°।`
      });
    } else if (p === 1) {
      const days = [
        { en: 'Monday', hi: 'सोमवार' },
        { en: 'Tuesday', hi: 'मंगलवार' },
        { en: 'Wednesday', hi: 'बुधवार' },
        { en: 'Thursday', hi: 'गुरुवार' },
        { en: 'Friday', hi: 'शुक्रवार' },
        { en: 'Saturday', hi: 'शनिवार' },
        { en: 'Sunday', hi: 'रविवार' }
      ];
      const d = this.hpick(variantIndex, 2505, days);
      return this.makeQuestion({
        topic: 'Miscellaneous',
        difficulty,
        question: `If the 1st day of a non-leap year is ${d.en}, what day of the week will be the last day (31st December) of that year?\nयदि किसी साधारण वर्ष का पहला दिन ${d.hi} है, तो उस वर्ष का अंतिम दिन (31 दिसंबर) सप्ताह का कौन सा दिन होगा?`,
        correctAnswerText: `${d.en} / ${d.hi}`,
        wrongAnswers: ['Saturday / शनिवार', 'Sunday / रविवार', 'Thursday / गुरुवार'].filter(w => !w.startsWith(d.en)),
        explanation: `An ordinary non-leap year has 365 days (52 weeks + 1 odd day), so the first and last days of an ordinary year are always the same (${d.en}).\nसाधारण वर्ष में प्रथम और अंतिम दिन हमेशा समान होते हैं (${d.hi})।`
      });
    } else if (p === 2) {
      const cows = this.hnum(variantIndex, 2502, 10, 35);
      const hens = this.hnum(variantIndex, 2503, 15, 45);
      const heads = cows + hens;
      const legs = cows * 4 + hens * 2;
      return this.makeQuestion({
        topic: 'Miscellaneous',
        difficulty,
        question: `A shepherd has some hens and some cows. If total heads count to ${heads} and total legs count to ${legs}, find the number of cows.\nएक चरवाहे के पास कुछ मुर्गियां और कुछ गायें हैं। यदि कुल सिरों की संख्या ${heads} तथा पैरों की संख्या ${legs} है, तो गायों की संख्या ज्ञात कीजिए।`,
        correctAnswerText: String(cows),
        wrongAnswers: [String(cows - 4), String(cows + 4), String(hens)],
        explanation: `Number of cows (4-legged) = (Total Legs / 2) - Total Heads = (${legs} / 2) - ${heads} = ${legs / 2} - ${heads} = ${cows}.\nगायों की संख्या = (पैर / 2) - सिर = ${cows}।`
      });
    } else if (p === 3) {
      const n = this.hnum(variantIndex, 2504, 10, 30);
      const handshakes = (n * (n - 1)) / 2;
      return this.makeQuestion({
        topic: 'Miscellaneous',
        difficulty,
        question: `In a meeting, ${n} people shake hands with each other exactly once. Find the total number of handshakes that took place.\nएक बैठक में ${n} लोग उपस्थित हैं और प्रत्येक व्यक्ति एक-दूसरे से केवल एक बार हाथ मिलाता है। कुल कितने हाथ मिलाए गए?`,
        correctAnswerText: String(handshakes),
        wrongAnswers: [String(handshakes - n), String(handshakes + n), String(n * n)],
        explanation: `Total handshakes = [n(n - 1)] / 2 = [${n} × ${n - 1}] / 2 = ${handshakes}.\nकुल हाथ मिलाए गए = [n(n - 1)] / 2 = ${handshakes}।`
      });
    } else {
      const climb = this.hpick(variantIndex, 2506, [3, 4, 5]);
      const slip = 1;
      const rounds = this.hnum(variantIndex, 2507, 6, 14);
      const pole = rounds * (climb - slip) + climb;
      const totalMin = rounds * 2 + 1;
      return this.makeQuestion({
        topic: 'Miscellaneous',
        difficulty,
        question: `A monkey climbs ${climb} meters up a greased pole in the first minute and slips down ${slip} meter in the second minute. If the pole is ${pole} meters high, in how many minutes will the monkey reach the top?\nएक बंदर एक चिकने खंभे पर पहले मिनट में ${climb} मीटर चढ़ता है तथा दूसरे मिनट में ${slip} मीटर नीचे फिसल जाता है। यदि खंभा ${pole} मीटर ऊंचा है, तो बंदर कितने मिनट में शीर्ष पर पहुंच जाएगा?`,
        correctAnswerText: `${totalMin} Minutes / मिनट`,
        wrongAnswers: [`${totalMin + 1} Minutes / मिनट`, `${totalMin + 2} Minutes / मिनट`, `${totalMin - 1} Minutes / मिनट`],
        explanation: `In 2 minutes, net climb = ${climb - slip} meters. In ${rounds * 2} minutes, climbs ${rounds * (climb - slip)} meters. In the next minute, climbs ${climb} meters and reaches top (${pole} m) without slipping. Total time = ${totalMin} minutes.\n${totalMin}वें मिनट में वह शीर्ष पर पहुंच जाएगा। कुल समय = ${totalMin} मिनट।`
      });
    }
  }
}
