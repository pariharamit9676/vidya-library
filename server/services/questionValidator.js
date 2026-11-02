/**
 * Strict Question Validator & Mathematical Independent Verification Engine
 * Validates schema, boundary keywords, mathematical consistency, options uniqueness, and anti-duplication.
 */

export class QuestionValidator {
  /**
   * Normalizes text for comparison (lowercased, punctuation removed, excess whitespace collapsed)
   */
  static normalizeText(text) {
    if (!text || typeof text !== 'string') return '';
    return text
      .toLowerCase()
      .replace(/[₹$,?!\n\r\t]/g, ' ')
      .replace(/[^\w\s\u0900-\u097F\-√∛/+^]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Extract numbers from string (commas removed first)
   */
  static extractNumbers(text) {
    if (!text || typeof text !== 'string') return [];
    const cleaned = text.replace(/,/g, '');
    const matches = cleaned.match(/\b\d+(?:\.\d+)?\b/g);
    return matches ? matches.map(Number) : [];
  }

  /**
   * Extract template structural fingerprint (replaces all numbers with <NUM>)
   */
  static getTemplateFingerprint(text) {
    if (!text || typeof text !== 'string') return '';
    return this.normalizeText(text).replace(/\b\d+(?:\.\d+)?\b/g, '<NUM>');
  }

  /**
   * Validates a single question against schema, boundary rules, and mathematical correctness
   */
  static validateQuestion(question, taxonomyContext = null) {
    if (!question || typeof question !== 'object') {
      return { valid: false, reason: 'Question is not a valid object' };
    }

    // 1. Text & Bilingual presence
    const qText = String(question.question || '').trim();
    if (qText.length < 15) {
      return { valid: false, reason: 'Question text too short or empty' };
    }

    const hasEnglish = /[a-zA-Z]{2,}/.test(qText);
    const hasHindi = /[\u0900-\u097F]{2,}/.test(qText);
    if (!hasEnglish || !hasHindi) {
      return {
        valid: false,
        reason: `Bilingual consistency failed: Question must contain both English and Hindi text. (English: ${hasEnglish}, Hindi: ${hasHindi})`
      };
    }

    // 2. Options validation
    const options = question.options;
    if (!Array.isArray(options) || options.length !== 4) {
      return { valid: false, reason: `Must have exactly 4 options, found ${Array.isArray(options) ? options.length : 0}` };
    }

    const validIds = ['A', 'B', 'C', 'D'];
    const seenIds = new Set();
    const seenTexts = new Set();

    for (const opt of options) {
      if (!opt || typeof opt !== 'object') {
        return { valid: false, reason: 'Malformed option object' };
      }
      if (!validIds.includes(opt.id)) {
        return { valid: false, reason: `Invalid option id: "${opt.id}"` };
      }
      if (seenIds.has(opt.id)) {
        return { valid: false, reason: `Duplicate option id: "${opt.id}"` };
      }
      seenIds.add(opt.id);

      const optText = String(opt.text || '').trim();
      if (!optText) {
        return { valid: false, reason: `Empty text for option "${opt.id}"` };
      }

      // Check duplicate option text
      const normOptText = this.normalizeText(optText);
      if (seenTexts.has(normOptText)) {
        return { valid: false, reason: `Duplicate option text found: "${optText}"` };
      }
      seenTexts.add(normOptText);
    }

    // 3. Correct answer validation
    const correctAns = question.correctAnswer;
    if (!correctAns || !validIds.includes(correctAns)) {
      return { valid: false, reason: `Invalid or missing correctAnswer: "${correctAns}"` };
    }

    const correctOption = options.find(o => o.id === correctAns);
    if (!correctOption) {
      return { valid: false, reason: `Option corresponding to correctAnswer "${correctAns}" not found` };
    }

    // 4. Explanation presence and bilingual consistency
    const explanation = String(question.explanation || '').trim();
    if (explanation.length < 8) {
      return { valid: false, reason: 'Explanation too short or missing' };
    }
    const expHasEnglish = /[a-zA-Z]{2,}/.test(explanation);
    const expHasHindi = /[\u0900-\u097F]{2,}/.test(explanation);
    if (!expHasEnglish || !expHasHindi) {
      return {
        valid: false,
        reason: `Bilingual explanation failed: Explanation must contain both English and Hindi. (English: ${expHasEnglish}, Hindi: ${expHasHindi})`
      };
    }

    // 5. Strict Topic Boundary Checking
    if (taxonomyContext) {
      const fullText = (qText + ' ' + explanation).toLowerCase();

      // Check disallowed keywords (e.g. Simple interest in Percentage/Profit-Loss)
      if (Array.isArray(taxonomyContext.disallowedKeywords)) {
        for (const badKeyword of taxonomyContext.disallowedKeywords) {
          if (fullText.includes(badKeyword.toLowerCase())) {
            return {
              valid: false,
              reason: `Topic boundary violation: Found disallowed term "${badKeyword}" for topic "${taxonomyContext.canonicalTopic}"`
            };
          }
        }
      }

      // Check positive allowed keywords
      if (Array.isArray(taxonomyContext.allowedKeywords) && taxonomyContext.allowedKeywords.length > 0) {
        const hasTopicKeyword = taxonomyContext.allowedKeywords.some(kw => fullText.includes(kw.toLowerCase()));
        if (!hasTopicKeyword) {
          return {
            valid: false,
            reason: `Topic mismatch: Question does not match core domain for topic "${taxonomyContext.canonicalTopic}"`
          };
        }
      }
    }

    // 6. Independent Mathematical Verification
    const mathCheck = this.verifyMathematicalCorrectness(question);
    if (!mathCheck.valid) {
      return mathCheck;
    }

    return { valid: true };
  }

  /**
   * Deterministic mathematical verification for supported formula question types
   */
  static verifyMathematicalCorrectness(question) {
    const qText = question.question || '';
    const correctOpt = question.options.find(o => o.id === question.correctAnswer);
    const correctVal = correctOpt ? correctOpt.text : '';

    // A. Discount on Marked Price: "marked price of an? article is ₹(M) ... discount of (D)% ... final price"
    const mpMatch = qText.match(/(?:marked price of (?:an )?article is|marked price is)[^₹\d]*₹?([\d,]+)[^%]*discount of (\d+)%/i) ||
                    qText.match(/अंकित मूल्य[^₹\d]*₹?([\d,]+)[^%]*(\d+)%\s*(?:की)?\s*छूट/);
    if (mpMatch && (qText.includes('final price') || qText.includes('selling price') || qText.includes('अंतिम राशि') || qText.includes('विक्रय मूल्य'))) {
      const M = Number(mpMatch[1].replace(/,/g, ''));
      const D = Number(mpMatch[2]);
      const expectedSP = Math.round(M * (1 - D / 100));
      const numbersInAns = this.extractNumbers(correctVal);
      if (numbersInAns.length > 0 && !numbersInAns.includes(expectedSP)) {
        return {
          valid: false,
          reason: `Math verification failed: MP=${M}, Discount=${D}%. Expected ₹${expectedSP}, but correct option is "${correctVal}"`
        };
      }
    }

    // B. Profit on Cost Price: "purchases ... ₹(C) ... profit of (P)% ... selling price"
    const cpProfitMatch = qText.match(/purchases goods for ₹?([\d,]+)[^%]*profit of (\d+)%/i) ||
                          qText.match(/खरीदता है[^%]*(\d+)%[^₹\d]*लाभ/i);
    if (cpProfitMatch && cpProfitMatch[1]) {
      const C = Number(cpProfitMatch[1].replace(/,/g, ''));
      const P = Number(cpProfitMatch[2]);
      const expectedSP = Math.round(C * (1 + P / 100));
      const numbersInAns = this.extractNumbers(correctVal);
      if (numbersInAns.length > 0 && !numbersInAns.includes(expectedSP)) {
        return {
          valid: false,
          reason: `Math verification failed: CP=${C}, Profit=${P}%. Expected ₹${expectedSP}, but correct option is "${correctVal}"`
        };
      }
    }

    // C. Loss on Cost Price: "bought for ₹(C) ... loss of (L)% ... selling price"
    const cpLossMatch = qText.match(/bought for ₹?([\d,]+)[^%]*loss of (\d+)%/i) ||
                        qText.match(/वस्तु ₹?([\d,]+) में खरीदी[^%]*(\d+)%\s*की हानि/);
    if (cpLossMatch && cpLossMatch[1]) {
      const C = Number(cpLossMatch[1].replace(/,/g, ''));
      const L = Number(cpLossMatch[2]);
      const expectedSP = Math.round(C * (1 - L / 100));
      const numbersInAns = this.extractNumbers(correctVal);
      if (numbersInAns.length > 0 && !numbersInAns.includes(expectedSP)) {
        return {
          valid: false,
          reason: `Math verification failed: CP=${C}, Loss=${L}%. Expected ₹${expectedSP}, but correct option is "${correctVal}"`
        };
      }
    }

    // D. Percentage of a number: "What is (P)% of ₹?(X)?" or "(X) का (P)% कितना होगा"
    const pctNumMatch = qText.match(/what is (\d+)%\s+of\s+₹?([\d,]+)/i) ||
                        qText.match(/₹?([\d,]+)\s+का\s+(\d+)%\s+कितना/);
    if (pctNumMatch) {
      const P = Number(pctNumMatch[1] && pctNumMatch[2] && pctNumMatch[1].length <= 3 ? pctNumMatch[1] : pctNumMatch[2]);
      const X = Number((pctNumMatch[1] && pctNumMatch[2] && pctNumMatch[1].length <= 3 ? pctNumMatch[2] : pctNumMatch[1]).replace(/,/g, ''));
      const expectedVal = Math.round((P * X) / 100);
      const numbersInAns = this.extractNumbers(correctVal);
      if (numbersInAns.length > 0 && !numbersInAns.includes(expectedVal)) {
        return {
          valid: false,
          reason: `Math verification failed: ${P}% of ${X}. Expected ${expectedVal}, but correct option is "${correctVal}"`
        };
      }
    }

    // E. Successive discounts single equivalent discount
    const succEqMatch = qText.match(/single discount is equivalent to two successive discounts of (\d+)%\s+and\s+(\d+)%/i) ||
                        (qText.includes('समतुल्य एकल छूट') && qText.match(/(\d+)%\s+और\s+(\d+)%/));
    if (succEqMatch) {
      const D1 = Number(succEqMatch[1]);
      const D2 = Number(succEqMatch[2]);
      const expectedDeq = Math.round((D1 + D2 - (D1 * D2) / 100) * 10) / 10;
      const numbersInAns = this.extractNumbers(correctVal);
      if (numbersInAns.length > 0 && !numbersInAns.some(n => Math.abs(n - expectedDeq) < 0.2)) {
        return {
          valid: false,
          reason: `Math verification failed: Successive discounts of ${D1}% and ${D2}%. Expected single discount of ${expectedDeq}%, but correct option is "${correctVal}"`
        };
      }
    }

    // F. Simple Interest: "principal sum of ₹(P) ... rate of (R)% for (T) years ... simple interest"
    const siMatch = qText.match(/principal sum of ₹?([\d,]+)[^%]*rate of (\d+)% for (\d+) years/i);
    if (siMatch) {
      const P = Number(siMatch[1].replace(/,/g, ''));
      const R = Number(siMatch[2]);
      const T = Number(siMatch[3]);
      const expectedSI = Math.round((P * R * T) / 100);
      const numbersInAns = this.extractNumbers(correctVal);
      if (numbersInAns.length > 0 && !numbersInAns.includes(expectedSI)) {
        return {
          valid: false,
          reason: `Math verification failed: P=${P}, R=${R}%, T=${T}y. Expected ₹${expectedSI}, but correct option is "${correctVal}"`
        };
      }
    }

    // G. Two articles sold at same SP with equal gain and loss of x%: Net Loss = (x^2 / 100)%
    const sameSpMatch = qText.match(/sold two articles for [^%]*gain(?:ed)? (\d+)%[^%]*lost (\d+)%/i) ||
                        qText.match(/दो वस्तुओं[^%]*(\d+)%[^%]*लाभ[^%]*(\d+)%[^%]*हानि/);
    if (sameSpMatch && sameSpMatch[1] === sameSpMatch[2]) {
      const X = Number(sameSpMatch[1]);
      const expectedLossPct = Math.round(((X * X) / 100) * 10) / 10;
      const numbersInAns = this.extractNumbers(correctVal);
      if (numbersInAns.length > 0 && !numbersInAns.some(n => Math.abs(n - expectedLossPct) < 0.2)) {
        return {
          valid: false,
          reason: `Math verification failed: Same SP with ${X}% gain and ${X}% loss. Expected ${expectedLossPct}% Loss, but correct option is "${correctVal}"`
        };
      }
    }

    // H. False weight / dishonest trader: Profit % = ((1000 - W) / W) * 100
    const falseWeightMatch = qText.match(/false weight of (\d+) grams for (?:1 kg|a kilogram|1000 grams)/i) ||
                             qText.match(/1 किग्रा के स्थान पर (\d+) ग्राम के/);
    if (falseWeightMatch) {
      const W = Number(falseWeightMatch[1]);
      const expectedProfitPct = Math.round(((1000 - W) / W) * 100 * 10) / 10;
      const numbersInAns = this.extractNumbers(correctVal);
      if (numbersInAns.length > 0 && !numbersInAns.some(n => Math.abs(n - expectedProfitPct) < 0.2)) {
        return {
          valid: false,
          reason: `Math verification failed: False weight of ${W}g for 1000g. Expected ${expectedProfitPct}%, but correct option is "${correctVal}"`
        };
      }
    }

    // I. Consumption reduction when price increases: Reduction % = (P / (100 + P)) * 100
    const priceHikeMatch = qText.match(/price of [a-z]+ increases by (\d+)%[^%]*reduce (?:his|her|consumption)/i) ||
                           qText.match(/मूल्य में (\d+)% की वृद्धि[^%]*खपत में कितने प्रतिशत की कमी/);
    if (priceHikeMatch) {
      const P = Number(priceHikeMatch[1]);
      const expectedRedPct = Math.round((P / (100 + P)) * 100 * 10) / 10;
      const numbersInAns = this.extractNumbers(correctVal);
      if (numbersInAns.length > 0 && !numbersInAns.some(n => Math.abs(n - expectedRedPct) < 0.3)) {
        return {
          valid: false,
          reason: `Math verification failed: Price hike of ${P}%. Expected consumption reduction of ${expectedRedPct}%, but correct option is "${correctVal}"`
        };
      }
    }

    // J. Shift from loss to gain by selling for ₹D more: CP = (D / (L + G)) * 100
    const shiftMatch = qText.match(/sold at a loss of (\d+)%[^₹\d]*₹?([\d,]+)\s+more[^%]*gain of (\d+)%/i) ||
                       qText.match(/(\d+)%\s*की हानि[^₹\d]*₹?([\d,]+)\s*अधिक[^%]*(\d+)%\s*का लाभ/);
    if (shiftMatch) {
      const L = Number(shiftMatch[1]);
      const D = Number(shiftMatch[2].replace(/,/g, ''));
      const G = Number(shiftMatch[3]);
      const expectedCP = Math.round((D / (L + G)) * 100);
      const numbersInAns = this.extractNumbers(correctVal);
      if (numbersInAns.length > 0 && !numbersInAns.includes(expectedCP)) {
        return {
          valid: false,
          reason: `Math verification failed: Shift from ${L}% loss to ${G}% gain with ₹${D} more. Expected CP=₹${expectedCP}, but correct option is "${correctVal}"`
        };
      }
    }

    // K. Revenue change from price hike and sales drop: Net Change % = ((1 + P/100)*(1 - Q/100) - 1) * 100
    const revMatch = qText.match(/increased by (\d+)%[^%]*(\d+)%\s*drop in (?:total )?[a-z\s]*sales/i) ||
                     qText.match(/(\d+)%\s*की वृद्धि[^%]*बिक्री में (\d+)%\s*की कमी/);
    if (revMatch) {
      const P = Number(revMatch[1]);
      const Q = Number(revMatch[2]);
      const expectedNet = Math.round((((1 + P / 100) * (1 - Q / 100) - 1) * 100) * 10) / 10;
      const numbersInAns = this.extractNumbers(correctVal);
      if (numbersInAns.length > 0 && !numbersInAns.some(n => Math.abs(n - Math.abs(expectedNet)) < 0.2)) {
        return {
          valid: false,
          reason: `Math verification failed: Price +${P}%, Sales -${Q}%. Expected net change of ${expectedNet}%, but correct option is "${correctVal}"`
        };
      }
    }

    return { valid: true };
  }

  /**
   * Jaccard word similarity between two texts (ignores numbers)
   */
  static getWordJaccardSimilarity(textA, textB) {
    const getWords = (t) => new Set(this.normalizeText(t).replace(/\b\d+\b/g, '').split(/\s+/).filter(w => w.length > 2));
    const setA = getWords(textA);
    const setB = getWords(textB);
    if (setA.size === 0 || setB.size === 0) return 0;
    let intersection = 0;
    for (const w of setA) {
      if (setB.has(w)) intersection++;
    }
    const union = setA.size + setB.size - intersection;
    return union === 0 ? 0 : intersection / union;
  }

  /**
   * Detects if a question is an exact or near duplicate (template collision or text collision)
   */
  static isDuplicateOrNearDuplicate(newQuestion, existingQuestionsPool, maxTemplateOccurrences = 2, strictExactOnly = false) {
    if (!Array.isArray(existingQuestionsPool) || existingQuestionsPool.length === 0) {
      return { isDuplicate: false };
    }

    const newText = String(newQuestion?.question || '').trim();
    const newNorm = this.normalizeText(newText);
    const newFingerprint = this.getTemplateFingerprint(newText);
    const newNums = this.extractNumbers(newText).join(',');

    let templateMatches = 0;

    for (const old of existingQuestionsPool) {
      const oldText = typeof old === 'string' ? old : old?.question || '';
      const oldNorm = this.normalizeText(oldText);
      const oldNums = this.extractNumbers(oldText).join(',');

      // 1. Exact or near-exact match
      if (newNorm === oldNorm) {
        return { isDuplicate: true, reason: 'Exact text duplicate' };
      }

      // 2. High text overlap with EXACT SAME NUMBERS
      if (newNums && oldNums && newNums === oldNums) {
        if (newNorm.length > 25 && oldNorm.length > 25) {
          if (newNorm.includes(oldNorm) || oldNorm.includes(newNorm)) {
            return { isDuplicate: true, reason: 'Identical problem with identical numerical values' };
          }
        }
        const jaccard = this.getWordJaccardSimilarity(newText, oldText);
        if (jaccard > 0.80) {
          return { isDuplicate: true, reason: `Identical problem structure with identical numbers (${(jaccard * 100).toFixed(1)}% match)` };
        }
      }

      // 3. Template fingerprint collision
      const oldFingerprint = this.getTemplateFingerprint(oldText);
      if (newFingerprint && oldFingerprint && newFingerprint === oldFingerprint) {
        // If numbers are also identical, it's an immediate duplicate
        if (newNums && oldNums && newNums === oldNums) {
          return { isDuplicate: true, reason: 'Duplicate template with identical numerical parameters' };
        }

        // If numbers are different, count against template limit (within the same test)
        if (!strictExactOnly) {
          templateMatches++;
          if (templateMatches >= maxTemplateOccurrences) {
            return {
              isDuplicate: true,
              reason: `Template repetition limit (${maxTemplateOccurrences}) reached for structural template: "${newFingerprint.slice(0, 45)}..."`
            };
          }
        }
      }
    }

    return { isDuplicate: false };
  }
}
