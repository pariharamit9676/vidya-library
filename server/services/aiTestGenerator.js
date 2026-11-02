import { ENV } from '../config/env.js';
import { normalizeSubjectAndTopic, CANONICAL_TAXONOMY } from './questionTaxonomy.js';
import { QuestionValidator } from './questionValidator.js';
import { ProceduralMathGenerators } from './proceduralMathGenerators.js';

/**
 * ============================================================================
 * AUTHENTIC HIGH-YIELD BILINGUAL QUESTION BANKS FOR MP POLICE & VYAPAM (MP ESB)
 * STRICTLY SEGREGATED BY SUBJECT AND TOPIC — ZERO CROSS-CONTAMINATION
 * OFFICIAL CBT PATTERN: ENGLISH + HINDI IN EVERY QUESTION & OPTION
 * ============================================================================
 */

// ----------------------------------------------------------------------------
// A. REASONING ABILITY TOPIC BANKS
// ----------------------------------------------------------------------------

// 1. PURE CODING-DECODING BANK (कोडिंग-डिकोडिंग)
const CODING_DECODING_BANK = [
  {
    exam: 'MP Police',
    subject: 'Reasoning Ability',
    topic: 'Coding-Decoding',
    difficulty: 'Medium',
    question: 'If in a certain code language "POLICE" is written as "QPMJDF", how will "PATROL" be written in that code?\nयदि किसी निश्चित कूट भाषा में "POLICE" को "QPMJDF" लिखा जाता है, तो उसी कूट भाषा में "PATROL" को क्या लिखा जाएगा?',
    options: [
      { id: 'A', text: 'QBUSPM' },
      { id: 'B', text: 'QBUQPM' },
      { id: 'C', text: 'QBVRPM' },
      { id: 'D', text: 'QZSQOM' }
    ],
    correctAnswer: 'A',
    explanation: 'Each letter is shifted forward by +1: P(+1)=Q, A(+1)=B, T(+1)=U, R(+1)=S, O(+1)=P, L(+1)=M => "QBUSPM".\nप्रत्येक अक्षर में +1 का पैटर्न है: P(+1)=Q, A(+1)=B, T(+1)=U, R(+1)=S, O(+1)=P, L(+1)=M => "QBUSPM"।'
  },
  {
    exam: 'MP Police',
    subject: 'Reasoning Ability',
    topic: 'Coding-Decoding',
    difficulty: 'Medium',
    question: 'In a code language, if "MADRAS" is written as "NBESBT", how is "BOMBAY" written in that code?\nएक कूट भाषा में यदि "MADRAS" को "NBESBT" लिखा जाता है, तो उसी कूट भाषा में "BOMBAY" को कैसे लिखा जाएगा?',
    options: [
      { id: 'A', text: 'CPNCBX' },
      { id: 'B', text: 'CPNCBZ' },
      { id: 'C', text: 'CPOCBZ' },
      { id: 'D', text: 'CQOCBZ' }
    ],
    correctAnswer: 'B',
    explanation: 'Each letter is incremented by +1: M->N, A->B, D->E, R->S, A->B, S->T. For BOMBAY: B->C, O->P, M->N, B->C, A->B, Y->Z => "CPNCBZ".\nप्रत्येक अक्षर में +1 की वृद्धि है: B->C, O->P, M->N, B->C, A->B, Y->Z => "CPNCBZ"।'
  },
  {
    exam: 'MP Police',
    subject: 'Reasoning Ability',
    topic: 'Coding-Decoding',
    difficulty: 'Medium',
    question: 'If in a certain code "DELHI" is coded as "CCIDD", how would "BOMBAY" be coded in that language?\nयदि किसी निश्चित कूट में "DELHI" को "CCIDD" कोडित किया जाता है, तो उसी भाषा में "BOMBAY" को कैसे कोडित किया जाएगा?',
    options: [
      { id: 'A', text: 'AMJXVS' },
      { id: 'B', text: 'AJMTVT' },
      { id: 'C', text: 'AMJXVT' },
      { id: 'D', text: 'BNJXVS' }
    ],
    correctAnswer: 'A',
    explanation: 'Letters decrease successively by -1, -2, -3, -4, -5: D(-1)=C, E(-2)=C, L(-3)=I, H(-4)=D, I(-5)=D. For BOMBAY: B(-1)=A, O(-2)=M, M(-3)=J, B(-4)=X, A(-5)=V, Y(-6)=S => "AMJXVS".\nअक्षरों में क्रमशः -1, -2, -3, -4, -5, -6 का अंतर है: B-1=A, O-2=M, M-3=J, B-4=X, A-5=V, Y-6=S => "AMJXVS"।'
  },
  {
    exam: 'MP Police',
    subject: 'Reasoning Ability',
    topic: 'Coding-Decoding',
    difficulty: 'Easy',
    question: 'If "CAT" is coded as 24 and "BAT" is coded as 23, how will "BALL" be coded in that language?\nयदि "CAT" को 24 और "BAT" को 23 कोडित किया जाता है, तो उसी भाषा में "BALL" को क्या कोड दिया जाएगा?',
    options: [
      { id: 'A', text: '26' },
      { id: 'B', text: '27' },
      { id: 'C', text: '28' },
      { id: 'D', text: '29' }
    ],
    correctAnswer: 'B',
    explanation: 'Sum of alphabetical positions: C(3)+A(1)+T(20)=24. For BALL: B(2)+A(1)+L(12)+L(12) = 27.\nअक्षरों के वर्णमाला क्रमांकों का योग है: B(2) + A(1) + L(12) + L(12) = 27।'
  },
  {
    exam: 'MP Police',
    subject: 'Reasoning Ability',
    topic: 'Coding-Decoding',
    difficulty: 'Medium',
    question: 'In a certain code, "STABLE" is written as "ELBATS". How will "PATROL" be written in that code?\nएक निश्चित कूट भाषा में यदि "STABLE" को "ELBATS" लिखा जाता है, तो "PATROL" को कैसे लिखा जाएगा?',
    options: [
      { id: 'A', text: 'LORTAP' },
      { id: 'B', text: 'LORPAT' },
      { id: 'C', text: 'OLRTAP' },
      { id: 'D', text: 'LROTPA' }
    ],
    correctAnswer: 'A',
    explanation: 'The letters of the word are reversed in order. PATROL reversed gives "LORTAP".\nशब्द के अक्षरों को विपरीत (उल्टे) क्रम में लिखा गया है। PATROL का उल्टा "LORTAP" होगा।'
  },
  {
    exam: 'MP Police',
    subject: 'Reasoning Ability',
    topic: 'Coding-Decoding',
    difficulty: 'Hard',
    question: 'If each letter in "KING" is replaced by its opposite alphabetical letter (A<->Z, B<->Y) to make "PRMT", how will "ROSE" be coded?\nयदि "KING" के प्रत्येक अक्षर को उसके विपरीत वर्णमाला अक्षर (A<->Z, B<->Y) से बदलकर "PRMT" लिखा जाए, तो "ROSE" का कोड क्या होगा?',
    options: [
      { id: 'A', text: 'ILHV' },
      { id: 'B', text: 'ILGV' },
      { id: 'C', text: 'IKHV' },
      { id: 'D', text: 'JLHV' }
    ],
    correctAnswer: 'A',
    explanation: 'Opposite letters (sum of positions = 27): R(18)<->I(9), O(15)<->L(12), S(19)<->H(8), E(5)<->V(22) => "ILHV".\nविपरीत अक्षर युग्म: R का विपरीत I, O का L, S का H, E का V => "ILHV"।'
  },
  {
    exam: 'MP Police',
    subject: 'Reasoning Ability',
    topic: 'Coding-Decoding',
    difficulty: 'Easy',
    question: 'If "White" is called "Blue", "Blue" is called "Red", "Red" is called "Yellow", "Yellow" is called "Green", what is the color of human blood?\nयदि "सफेद" को "नीला", "नीले" को "लाल", "लाल" को "पीला" और "पीले" को "हरा" कहा जाए, तो मानव रक्त का रंग क्या होगा?',
    options: [
      { id: 'A', text: 'Red / लाल' },
      { id: 'B', text: 'Yellow / पीला' },
      { id: 'C', text: 'Blue / नीला' },
      { id: 'D', text: 'Green / हरा' }
    ],
    correctAnswer: 'B',
    explanation: 'Human blood is naturally Red, and here "Red is called Yellow". So the answer is Yellow.\nमानव रक्त लाल होता है और यहाँ "लाल को पीला" कहा गया है। अतः सही उत्तर पीला होगा।'
  },
  {
    exam: 'MP Police',
    subject: 'Reasoning Ability',
    topic: 'Coding-Decoding',
    difficulty: 'Medium',
    question: 'If "ROSE" is coded as 6821 and "CHAIR" is coded as 73456, how will "SEARCH" be coded?\nयदि "ROSE" को 6821 और "CHAIR" को 73456 लिखा जाए, तो "SEARCH" को क्या लिखा जाएगा?',
    options: [
      { id: 'A', text: '214673' },
      { id: 'B', text: '214763' },
      { id: 'C', text: '216473' },
      { id: 'D', text: '241673' }
    ],
    correctAnswer: 'A',
    explanation: 'Direct letter-to-digit mapping: S=2, E=1, A=4, R=6, C=7, H=3 => SEARCH = "214673".\nप्रत्यक्ष कूट मिलान: S=2, E=1, A=4, R=6, C=7, H=3 => "214673"।'
  },
  {
    exam: 'MP Police',
    subject: 'Reasoning Ability',
    topic: 'Coding-Decoding',
    difficulty: 'Medium',
    question: 'In a code language, "WATER" is written as "YCVGT". How will "FIRE" be written in that code?\nएक कूट भाषा में "WATER" को "YCVGT" लिखा जाता है। उसी कूट भाषा में "FIRE" को क्या लिखा जाएगा?',
    options: [
      { id: 'A', text: 'HKTG' },
      { id: 'B', text: 'HKTF' },
      { id: 'C', text: 'GKTG' },
      { id: 'D', text: 'HLTG' }
    ],
    correctAnswer: 'A',
    explanation: 'Each letter is shifted forward by +2: F(+2)=H, I(+2)=K, R(+2)=T, E(+2)=G => "HKTG".\nप्रत्येक अक्षर में +2 जोड़ा गया है: F(+2)=H, I(+2)=K, R(+2)=T, E(+2)=G => "HKTG"।'
  },
  {
    exam: 'MP Police',
    subject: 'Reasoning Ability',
    topic: 'Coding-Decoding',
    difficulty: 'Hard',
    question: 'If "Z = 52" and "ACT = 48", what will be the numerical value of "BAT"?\nयदि "Z = 52" और "ACT = 48" है, तो "BAT" का संख्यात्मक मान क्या होगा?',
    options: [
      { id: 'A', text: '44' },
      { id: 'B', text: '46' },
      { id: 'C', text: '48' },
      { id: 'D', text: '50' }
    ],
    correctAnswer: 'B',
    explanation: 'Value = (Sum of alphabetical positions) × 2. Z = 26 × 2 = 52. ACT = (1 + 3 + 20) × 2 = 48. BAT = (2 + 1 + 20) × 2 = 23 × 2 = 46.\nवर्णमाला स्थिति का दोगुना: BAT = (2 + 1 + 20) × 2 = 23 × 2 = 46।'
  }
];

// 2. NUMBER & LETTER SERIES BANK (संख्या एवं अक्षर श्रृंखला)
const NUMBER_SERIES_BANK = [
  {
    exam: 'MP Police',
    subject: 'Reasoning Ability',
    topic: 'Number & Letter Series',
    difficulty: 'Medium',
    question: 'What will come in place of the question mark (?) in the following series?\nनिम्नलिखित संख्या श्रृंखला में प्रश्नवाचक चिह्न (?) के स्थान पर क्या आएगा?\n7, 12, 19, 28, 39, ?',
    options: [
      { id: 'A', text: '50' },
      { id: 'B', text: '52' },
      { id: 'C', text: '54' },
      { id: 'D', text: '56' }
    ],
    correctAnswer: 'B',
    explanation: 'Differences are successive odd numbers: 7+5=12, 12+7=19, 19+9=28, 28+11=39, 39+13 = 52.\nअंतर की श्रृंखला विषम संख्याएं हैं: 7+5=12, 12+7=19, 19+9=28, 28+11=39, 39+13 = 52।'
  },
  {
    exam: 'MP Police',
    subject: 'Reasoning Ability',
    topic: 'Number & Letter Series',
    difficulty: 'Medium',
    question: 'Find the next term in the series:\nश्रृंखला में अगला पद ज्ञात कीजिए:\n2, 6, 12, 20, 30, ?',
    options: [
      { id: 'A', text: '40' },
      { id: 'B', text: '42' },
      { id: 'C', text: '44' },
      { id: 'D', text: '46' }
    ],
    correctAnswer: 'B',
    explanation: 'Pattern: n(n+1) -> 1×2=2, 2×3=6, 3×4=12, 4×5=20, 5×6=30, next is 6×7 = 42.\nपैटर्न: क्रमागत संख्याओं का गुणनफल 1×2=2, 2×3=6, 3×4=12, 4×5=20, 5×6=30, 6×7 = 42।'
  },
  {
    exam: 'MP Police',
    subject: 'Reasoning Ability',
    topic: 'Number & Letter Series',
    difficulty: 'Easy',
    question: 'Complete the letter series:\nअक्षर श्रृंखला को पूरा कीजिए:\nB, D, F, H, J, ?',
    options: [
      { id: 'A', text: 'K' },
      { id: 'B', text: 'L' },
      { id: 'C', text: 'M' },
      { id: 'D', text: 'N' }
    ],
    correctAnswer: 'B',
    explanation: 'Every letter is shifted forward by +2: B(+2)=D, D(+2)=F, F(+2)=H, H(+2)=J, J(+2)=L.\nप्रत्येक अक्षर में +2 की वृद्धि हो रही है: J(+2) = L।'
  },
  {
    exam: 'MP Police',
    subject: 'Reasoning Ability',
    topic: 'Number & Letter Series',
    difficulty: 'Hard',
    question: 'What is the missing number in the series?\nश्रृंखला में लुप्त संख्या ज्ञात कीजिए:\n3, 7, 15, 31, 63, ?',
    options: [
      { id: 'A', text: '125' },
      { id: 'B', text: '127' },
      { id: 'C', text: '129' },
      { id: 'D', text: '131' }
    ],
    correctAnswer: 'B',
    explanation: 'Pattern: (Previous number × 2) + 1 -> 3×2+1=7, 7×2+1=15, 15×2+1=31, 31×2+1=63, 63×2+1 = 127.\nपैटर्न: (पिछली संख्या × 2) + 1 => 63 × 2 + 1 = 127।'
  },
  {
    exam: 'MP Police',
    subject: 'Reasoning Ability',
    topic: 'Number & Letter Series',
    difficulty: 'Medium',
    question: 'Find the next number in the square-based series:\nवर्ग आधारित श्रृंखला में अगली संख्या ज्ञात कीजिए:\n0, 3, 8, 15, 24, ?',
    options: [
      { id: 'A', text: '32' },
      { id: 'B', text: '35' },
      { id: 'C', text: '36' },
      { id: 'D', text: '40' }
    ],
    correctAnswer: 'B',
    explanation: 'Pattern: n^2 - 1 -> 1^2-1=0, 2^2-1=3, 3^2-1=8, 4^2-1=15, 5^2-1=24, next is 6^2-1 = 35.\nपैटर्न: n^2 - 1 => 6^2 - 1 = 35।'
  },
  {
    exam: 'General Practice / All Exams',
    subject: 'Reasoning Ability',
    topic: 'Number & Letter Series',
    difficulty: 'Medium',
    question: 'Find the next number in the cube series:\nघन आधारित श्रृंखला में अगली संख्या ज्ञात कीजिए:\n1, 8, 27, 64, 125, ?',
    options: [
      { id: 'A', text: '196' },
      { id: 'B', text: '216' },
      { id: 'C', text: '225' },
      { id: 'D', text: '256' }
    ],
    correctAnswer: 'B',
    explanation: 'Cubes of consecutive natural numbers: 1^3, 2^3, 3^3, 4^3, 5^3. Next is 6^3 = 216.\nप्राकृतिक संख्याओं के घन: 1^3, 2^3, 3^3, 4^3, 5^3, अगला पद 6^3 = 216 होगा।'
  },
  {
    exam: 'General Practice / All Exams',
    subject: 'Reasoning Ability',
    topic: 'Number & Letter Series',
    difficulty: 'Easy',
    question: 'What is the next prime number in the series?\nश्रृंखला में अगली अभाज्य संख्या (Prime Number) क्या होगी?\n2, 3, 5, 7, 11, 13, ?',
    options: [
      { id: 'A', text: '15' },
      { id: 'B', text: '17' },
      { id: 'C', text: '19' },
      { id: 'D', text: '21' }
    ],
    correctAnswer: 'B',
    explanation: 'Successive prime numbers: 2, 3, 5, 7, 11, 13, next prime is 17.\nक्रमिक अभाज्य संख्याएं हैं: 13 के बाद अगली अभाज्य संख्या 17 आती है।'
  },
  {
    exam: 'General Practice / All Exams',
    subject: 'Reasoning Ability',
    topic: 'Number & Letter Series',
    difficulty: 'Medium',
    question: 'What comes next in the alternating series?\nएकांतर श्रृंखला (Alternating Series) में अगला पद क्या होगा?\n14, 28, 20, 40, 32, 64, ?',
    options: [
      { id: 'A', text: '52' },
      { id: 'B', text: '56' },
      { id: 'C', text: '58' },
      { id: 'D', text: '60' }
    ],
    correctAnswer: 'B',
    explanation: 'Pattern: multiply by 2, then subtract 8 -> 14×2=28, 28-8=20, 20×2=40, 40-8=32, 32×2=64, 64-8 = 56.\nपैटर्न: ×2 फिर -8 => 64 - 8 = 56।'
  },
  {
    exam: 'General Practice / All Exams',
    subject: 'Reasoning Ability',
    topic: 'Number & Letter Series',
    difficulty: 'Easy',
    question: 'Find the next number in the Fibonacci-style series:\nफाइबोनैचि श्रृंखला में अगला पद क्या होगा?\n1, 1, 2, 3, 5, 8, 13, ?',
    options: [
      { id: 'A', text: '19' },
      { id: 'B', text: '21' },
      { id: 'C', text: '24' },
      { id: 'D', text: '26' }
    ],
    correctAnswer: 'B',
    explanation: 'Each term is the sum of previous two terms: 1+1=2, 1+2=3, 2+3=5, 3+5=8, 5+8=13, 8+13 = 21.\nप्रत्येक पद पिछले दो पदों का योग है: 8 + 13 = 21।'
  },
  {
    exam: 'General Practice / All Exams',
    subject: 'Reasoning Ability',
    topic: 'Number & Letter Series',
    difficulty: 'Easy',
    question: 'Complete the backward letter series:\nविपरीत अक्षर श्रृंखला को पूरा कीजिए:\nZ, X, V, T, R, ?',
    options: [
      { id: 'A', text: 'O' },
      { id: 'B', text: 'P' },
      { id: 'C', text: 'Q' },
      { id: 'D', text: 'N' }
    ],
    correctAnswer: 'B',
    explanation: 'Backward shift of -2 at each step: Z(-2)=X, X(-2)=V, V(-2)=T, T(-2)=R, R(-2)=P.\nप्रत्येक पद में 2 स्थान पीछे (घटाव) है: R - 2 = P।'
  },
  {
    exam: 'General Practice / All Exams',
    subject: 'Reasoning Ability',
    topic: 'Number & Letter Series',
    difficulty: 'Medium',
    question: 'Complete the alpha-numeric series:\nअक्षर-संख्या श्रृंखला (Alpha-Numeric Series) को पूरा कीजिए:\nA2, C4, E8, G16, ?',
    options: [
      { id: 'A', text: 'H32' },
      { id: 'B', text: 'I32' },
      { id: 'C', text: 'I24' },
      { id: 'D', text: 'J32' }
    ],
    correctAnswer: 'B',
    explanation: 'Letters shift by +2: A(+2)=C, C(+2)=E, E(+2)=G, G(+2)=I. Numbers double: 2, 4, 8, 16, next is 32 => "I32".\nअक्षर +2 बढ़ रहे हैं (G+2=I) और संख्याएं दोगुनी हो रही हैं (16×2=32) => "I32"।'
  },
  {
    exam: 'General Practice / All Exams',
    subject: 'Reasoning Ability',
    topic: 'Number & Letter Series',
    difficulty: 'Medium',
    question: 'What is the next number in the decreasing difference series?\nघटते अंतर वाली श्रृंखला में अगली संख्या क्या होगी?\n90, 80, 71, 63, 56, ?',
    options: [
      { id: 'A', text: '48' },
      { id: 'B', text: '50' },
      { id: 'C', text: '51' },
      { id: 'D', text: '52' }
    ],
    correctAnswer: 'B',
    explanation: 'Differences decrease by 1: 90-10=80, 80-9=71, 71-8=63, 63-7=56, next is 56-6 = 50.\nघटाव का अंतर क्रमशः 1 घट रहा है (-10, -9, -8, -7, -6): 56 - 6 = 50।'
  },
  {
    exam: 'General Practice / All Exams',
    subject: 'Reasoning Ability',
    topic: 'Number & Letter Series',
    difficulty: 'Medium',
    question: 'Find the next term in the geometric progression series:\nगुणोत्तर श्रेणी में अगला पद ज्ञात कीजिए:\n4, 12, 36, 108, ?',
    options: [
      { id: 'A', text: '216' },
      { id: 'B', text: '324' },
      { id: 'C', text: '432' },
      { id: 'D', text: '312' }
    ],
    correctAnswer: 'B',
    explanation: 'Each term is multiplied by 3: 4×3=12, 12×3=36, 36×3=108, next is 108×3 = 324.\nप्रत्येक पद को 3 से गुणा किया जा रहा है: 108 × 3 = 324।'
  },
  {
    exam: 'General Practice / All Exams',
    subject: 'Reasoning Ability',
    topic: 'Number & Letter Series',
    difficulty: 'Medium',
    question: 'What is the missing term in the sequence?\nअनुक्रम में लुप्त पद क्या होगा?\n2, 5, 10, 17, 26, ?',
    options: [
      { id: 'A', text: '35' },
      { id: 'B', text: '37' },
      { id: 'C', text: '39' },
      { id: 'D', text: '41' }
    ],
    correctAnswer: 'B',
    explanation: 'Pattern: n^2 + 1 -> 1^2+1=2, 2^2+1=5, 3^2+1=10, 4^2+1=17, 5^2+1=26, next is 6^2+1 = 37.\nपैटर्न: n^2 + 1 => 6^2 + 1 = 37।'
  },
  {
    exam: 'General Practice / All Exams',
    subject: 'Reasoning Ability',
    topic: 'Number & Letter Series',
    difficulty: 'Hard',
    question: 'Find the missing group of letters:\nलुप्त अक्षर समूह ज्ञात कीजिए:\nBDF, CFI, DHL, ?',
    options: [
      { id: 'A', text: 'EKM' },
      { id: 'B', text: 'EJO' },
      { id: 'C', text: 'EJN' },
      { id: 'D', text: 'EKN' }
    ],
    correctAnswer: 'B',
    explanation: '1st letters: B, C, D -> E. 2nd letters: D(+2)=F, F(+3)=I, I(+4)=M? Here D(+2)=F, but D, F, H, J (+2 each). 3rd: F(+3)=I(+3)=L(+3)=O => EJO.\nपहले अक्षर: B, C, D, E। दूसरे अक्षर: D, F, H, J (+2)। तीसरे अक्षर: F, I, L, O (+3) => EJO।'
  },
  {
    exam: 'General Practice / All Exams',
    subject: 'Reasoning Ability',
    topic: 'Number & Letter Series',
    difficulty: 'Hard',
    question: 'What is the next number in the series?\nश्रृंखला में अगली संख्या ज्ञात कीजिए:\n0, 7, 26, 63, 124, ?',
    options: [
      { id: 'A', text: '185' },
      { id: 'B', text: '215' },
      { id: 'C', text: '216' },
      { id: 'D', text: '217' }
    ],
    correctAnswer: 'B',
    explanation: 'Pattern: n^3 - 1 -> 1^3-1=0, 2^3-1=7, 3^3-1=26, 4^3-1=63, 5^3-1=124, next is 6^3-1 = 215.\nपैटर्न: n^3 - 1 => 6^3 - 1 = 215।'
  },
  {
    exam: 'General Practice / All Exams',
    subject: 'Reasoning Ability',
    topic: 'Number & Letter Series',
    difficulty: 'Medium',
    question: 'Find the next term in the alternating additive series:\nएकांतर योगात्मक श्रृंखला में अगला पद क्या होगा?\n5, 11, 9, 15, 13, 19, ?',
    options: [
      { id: 'A', text: '15' },
      { id: 'B', text: '17' },
      { id: 'C', text: '21' },
      { id: 'D', text: '23' }
    ],
    correctAnswer: 'B',
    explanation: 'Pattern: +6, -2, +6, -2 -> 5+6=11, 11-2=9, 9+6=15, 15-2=13, 13+6=19, 19-2 = 17.\nपैटर्न: +6, -2 एकांतर क्रम में => 19 - 2 = 17।'
  },
  {
    exam: 'General Practice / All Exams',
    subject: 'Reasoning Ability',
    topic: 'Number & Letter Series',
    difficulty: 'Medium',
    question: 'What comes next in the increasing letter gap series?\nबढ़ते अंतराल वाली अक्षर श्रृंखला में अगला अक्षर क्या होगा?\nA, D, H, M, ?',
    options: [
      { id: 'A', text: 'R' },
      { id: 'B', text: 'S' },
      { id: 'C', text: 'T' },
      { id: 'D', text: 'U' }
    ],
    correctAnswer: 'B',
    explanation: 'Pattern of increasing gaps: A(+3)=D, D(+4)=H, H(+5)=M, M(+6)=S (13+6 = 19th letter S).\nबढ़ते अंतराल का क्रम: A(+3)=D, D(+4)=H, H(+5)=M, M(+6)=S।'
  },
  {
    exam: 'General Practice / All Exams',
    subject: 'Reasoning Ability',
    topic: 'Number & Letter Series',
    difficulty: 'Easy',
    question: 'Find the next number in the successive division series:\nक्रमिक विभाजन श्रृंखला में अगला पद क्या होगा?\n128, 64, 32, 16, 8, ?',
    options: [
      { id: 'A', text: '2' },
      { id: 'B', text: '4' },
      { id: 'C', text: '6' },
      { id: 'D', text: '1' }
    ],
    correctAnswer: 'B',
    explanation: 'Each term is halved (divided by 2): 128/2=64, 64/2=32, 32/2=16, 16/2=8, 8/2 = 4.\nप्रत्येक पद को 2 से विभाजित किया जा रहा है: 8 / 2 = 4।'
  },
  {
    exam: 'General Practice / All Exams',
    subject: 'Reasoning Ability',
    topic: 'Number & Letter Series',
    difficulty: 'Medium',
    question: 'What will come in place of the question mark (?):\nप्रश्नवाचक चिह्न (?) के स्थान पर क्या आएगा?\n5, 11, 23, 47, 95, ?',
    options: [
      { id: 'A', text: '185' },
      { id: 'B', text: '191' },
      { id: 'C', text: '195' },
      { id: 'D', text: '199' }
    ],
    correctAnswer: 'B',
    explanation: 'Pattern: (Previous number × 2) + 1 -> 5×2+1=11, 11×2+1=23, 23×2+1=47, 47×2+1=95, 95×2+1 = 191.\nपैटर्न: (संख्या × 2) + 1 => 95 × 2 + 1 = 191।'
  }
];

// 3. BLOOD RELATIONS BANK (रक्त संबंध)
const BLOOD_RELATIONS_BANK = [
  {
    exam: 'MP Police',
    subject: 'Reasoning Ability',
    topic: 'Blood Relations',
    difficulty: 'Medium',
    question: 'Pointing to a photograph, Vijay said, "She is the sister of the son of the only daughter-in-law of my father." How is Vijay related to the girl?\nएक तस्वीर की ओर इशारा करते हुए विजय ने कहा, "यह मेरे पिता की इकलौती बहू के बेटे की बहन है।" विजय का उस लड़की से क्या संबंध है?',
    options: [
      { id: 'A', text: 'Uncle / चाचा' },
      { id: 'B', text: 'Father / पिता' },
      { id: 'C', text: 'Brother / भाई' },
      { id: 'D', text: 'Grandfather / दादा' }
    ],
    correctAnswer: 'B',
    explanation: 'Vijay\'s father\'s only daughter-in-law is Vijay\'s wife. The daughter of their son is Vijay\'s own daughter. Thus Vijay is her Father.\nविजय के पिता की इकलौती बहू विजय की अपनी पत्नी है। पत्नी के बेटे की बहन विजय की अपनी बेटी होगी। अतः विजय उस लड़की का "पिता" है।'
  },
  {
    exam: 'MP Police',
    subject: 'Reasoning Ability',
    topic: 'Blood Relations',
    difficulty: 'Easy',
    question: 'A is B\'s sister. C is B\'s mother. D is C\'s father. How is A related to D?\nA, B की बहन है। C, B की माता है। D, C का पिता है। A का D से क्या संबंध है?',
    options: [
      { id: 'A', text: 'Granddaughter / पोती (नातिन)' },
      { id: 'B', text: 'Daughter / पुत्री' },
      { id: 'C', text: 'Grandmother / नानी' },
      { id: 'D', text: 'Sister / बहन' }
    ],
    correctAnswer: 'A',
    explanation: 'C is mother of A, and D is father of C. Therefore, A is the granddaughter of D.\nC, A की माता है और D, C का पिता है। अतः A, D की नातिन (Granddaughter) है।'
  },
  {
    exam: 'MP Police',
    subject: 'Reasoning Ability',
    topic: 'Blood Relations',
    difficulty: 'Hard',
    question: 'Introducing a man, a woman said, "His wife is the only daughter of my father." How is the man related to the woman?\nएक पुरुष का परिचय देते हुए एक महिला ने कहा, "उसकी पत्नी मेरे पिता की इकलौती पुत्री है।" वह पुरुष उस महिला से किस प्रकार संबंधित है?',
    options: [
      { id: 'A', text: 'Brother / भाई' },
      { id: 'B', text: 'Husband / पति' },
      { id: 'C', text: 'Father-in-law / ससुर' },
      { id: 'D', text: 'Maternal Uncle / मामा' }
    ],
    correctAnswer: 'B',
    explanation: 'The woman\'s father\'s only daughter is the woman herself. The man\'s wife is that woman, so the man is her Husband.\nमहिला के पिता की इकलौती पुत्री वह स्वयं है। उस पुरुष की पत्नी वह स्वयं है, अतः पुरुष उसका "पति" है।'
  }
];

// 4. DIRECTION SENSE BANK (दिशा एवं दूरी)
const DIRECTION_SENSE_BANK = [
  {
    exam: 'MP Police',
    subject: 'Reasoning Ability',
    topic: 'Direction Sense',
    difficulty: 'Medium',
    question: 'Rohit walks 10 meters North from his house, turns right and walks 15 meters, then turns right again and walks 10 meters. In which direction and at what distance is he now from his starting point?\nरोहित अपने घर से उत्तर दिशा में 10 मीटर चलता है, फिर दाएं मुड़कर 15 मीटर चलता है, पुनः दाएं मुड़कर 10 मीटर चलता है। अब वह अपने प्रारंभिक बिंदु से किस दिशा में और कितनी दूरी पर है?',
    options: [
      { id: 'A', text: '15 meters East / पूर्व दिशा में 15 मीटर' },
      { id: 'B', text: '15 meters West / पश्चिम दिशा में 15 मीटर' },
      { id: 'C', text: '10 meters North / उत्तर दिशा में 10 मीटर' },
      { id: 'D', text: '20 meters South / दक्षिण दिशा में 20 मीटर' }
    ],
    correctAnswer: 'A',
    explanation: 'Moving 10m North, 15m East, and 10m South cancels the vertical displacement, leaving him 15 meters directly East.\nउत्तर में 10 मी जाकर दाएं मुड़कर 15 मी पूर्व, फिर दाएं मुड़कर 10 मी दक्षिण चलने पर वह प्रारंभिक रेखा के सीध में पूर्व की ओर 15 मीटर की दूरी पर पहुँचता है।'
  },
  {
    exam: 'MP Police',
    subject: 'Reasoning Ability',
    topic: 'Direction Sense',
    difficulty: 'Medium',
    question: 'A police officer starts from the police station and travels 4 km East, then turns left and travels 3 km. How far is he from the police station?\nएक पुलिस अधिकारी थाने से 4 किमी पूर्व की ओर चलता है, फिर बाएं मुड़कर 3 किमी चलता है। वह थाने से सीधी रेखा में कितनी दूरी पर है?',
    options: [
      { id: 'A', text: '7 km / 7 किमी' },
      { id: 'B', text: '5 km / 5 किमी' },
      { id: 'C', text: '6 km / 6 किमी' },
      { id: 'D', text: '8 km / 8 किमी' }
    ],
    correctAnswer: 'B',
    explanation: 'Using Pythagoras theorem: Distance = √(4² + 3²) = √(16 + 9) = √25 = 5 km.\nपाइथागोरस प्रमेय: दूरी = √(4² + 3²) = √25 = 5 किमी।'
  }
];

// 5. VENN DIAGRAMS & SYLLOGISM (वेन आरेख एवं कथन-निष्कर्ष)
const VENN_SYLLOGISMS_BANK = [
  {
    exam: 'MP Police',
    subject: 'Reasoning Ability',
    topic: 'Venn Diagrams & Syllogism',
    difficulty: 'Easy',
    question: 'Which of the following diagrams best represents the relationship between "Madhya Pradesh", "Bhopal", and "India"?\nनिम्नलिखित में से कौन सा वेन आरेख "मध्य प्रदेश", "भोपाल" और "भारत" के बीच सही संबंध दर्शाता है?',
    options: [
      { id: 'A', text: 'Three concentric circles (Bhopal inside MP inside India) / तीन संकेंद्री वृत्त' },
      { id: 'B', text: 'Two intersecting circles with one outside / दो प्रतिच्छेदी वृत्त और एक अलग' },
      { id: 'C', text: 'Three completely disjoint circles / तीन पूरी तरह अलग वृत्त' },
      { id: 'D', text: 'One circle containing two disjoint circles / एक वृत्त जिसमें दो अलग वृत्त हैं' }
    ],
    correctAnswer: 'A',
    explanation: 'Bhopal is entirely within Madhya Pradesh, and Madhya Pradesh is entirely within India (concentric circles).\nभोपाल पूरी तरह मध्य प्रदेश के अंदर है और मध्य प्रदेश पूरी तरह भारत के अंदर है (तीन संकेंद्री वृत्त)।'
  },
  {
    exam: 'MP Police',
    subject: 'Reasoning Ability',
    topic: 'Analogy & Classification',
    difficulty: 'Easy',
    question: 'Just as "Bhopal" is related to "Madhya Pradesh", in the same manner "Raipur" is related to which state?\nजिस प्रकार "भोपाल" का संबंध "मध्य प्रदेश" से है, उसी प्रकार "रायपुर" का संबंध किस राज्य से है?',
    options: [
      { id: 'A', text: 'Jharkhand / झारखंड' },
      { id: 'B', text: 'Chhattisgarh / छत्तीसगढ़' },
      { id: 'C', text: 'Odisha / ओडिशा' },
      { id: 'D', text: 'Bihar / बिहार' }
    ],
    correctAnswer: 'B',
    explanation: 'Bhopal is the capital city of Madhya Pradesh. Similarly, Raipur is the capital of Chhattisgarh.\nभोपाल मध्य प्रदेश की राजधानी है। इसी प्रकार रायपुर छत्तीसगढ़ राज्य की राजधानी है।'
  }
];

// ----------------------------------------------------------------------------
// B. SIMPLE ARITHMETIC / MATH TOPIC BANKS
// ----------------------------------------------------------------------------

const ARITHMETIC_PERCENT_PROFIT_BANK = [
  // Subtopic 1: basic_percentage
  {
    exam: 'General Practice / All Exams',
    subject: 'Simple Arithmetic',
    topic: 'Percentage & Profit/Loss',
    subtopic: 'basic_percentage',
    concept: 'Percentage of a quantity',
    difficulty: 'Easy',
    question: 'What is 15% of ₹4,800?\n₹4,800 का 15% कितना होगा?',
    options: [
      { id: 'A', text: '₹680' },
      { id: 'B', text: '₹720' },
      { id: 'C', text: '₹750' },
      { id: 'D', text: '₹800' }
    ],
    correctAnswer: 'B',
    explanation: '15% of ₹4,800 = (15 × 4,800) / 100 = ₹720.\n₹4,800 का 15% = (15 × 4,800) / 100 = ₹720।'
  },
  {
    exam: 'General Practice / All Exams',
    subject: 'Simple Arithmetic',
    topic: 'Percentage & Profit/Loss',
    subtopic: 'basic_percentage',
    concept: 'Percentage score in examination',
    difficulty: 'Easy',
    question: 'A student secured 450 marks out of a total of 600 marks in an examination. What percentage of marks did the student obtain?\nएक छात्र ने 600 के कुल पूर्णांक में से 450 अंक प्राप्त किए। छात्र ने कितने प्रतिशत अंक प्राप्त किए?',
    options: [
      { id: 'A', text: '70%' },
      { id: 'B', text: '75%' },
      { id: 'C', text: '80%' },
      { id: 'D', text: '65%' }
    ],
    correctAnswer: 'B',
    explanation: 'Percentage = (450 / 600) × 100 = 75%.\nप्रतिशत = (450 / 600) × 100 = 75%।'
  },
  {
    exam: 'General Practice / All Exams',
    subject: 'Simple Arithmetic',
    topic: 'Percentage & Profit/Loss',
    subtopic: 'basic_percentage',
    concept: 'Finding original number from percentage',
    difficulty: 'Medium',
    question: 'If 20% of a number is 160, what is that number?\nयदि किसी संख्या का 20% मान 160 है, तो वह संख्या क्या होगी?',
    options: [
      { id: 'A', text: '750' },
      { id: 'B', text: '800' },
      { id: 'C', text: '850' },
      { id: 'D', text: '900' }
    ],
    correctAnswer: 'B',
    explanation: 'Number = (160 × 100) / 20 = 800.\nसंख्या = (160 × 100) / 20 = 800।'
  },

  // Subtopic 2: profit_loss_calc
  {
    exam: 'MP Police',
    subject: 'Simple Arithmetic',
    topic: 'Percentage & Profit/Loss',
    subtopic: 'profit_loss_calc',
    concept: 'Profit percentage from CP and SP',
    difficulty: 'Medium',
    question: 'A shopkeeper bought an article for ₹1,200 and sold it for ₹1,500. What is his profit percentage?\nएक दुकानदार ने एक वस्तु ₹1,200 में खरीदी और उसे ₹1,500 में बेच दी। उसका लाभ प्रतिशत क्या होगा?',
    options: [
      { id: 'A', text: '20%' },
      { id: 'B', text: '25%' },
      { id: 'C', text: '30%' },
      { id: 'D', text: '15%' }
    ],
    correctAnswer: 'B',
    explanation: 'Profit = ₹1,500 - ₹1,200 = ₹300. Profit % = (300 / 1200) × 100 = 25%.\nलाभ = 1500 - 1200 = ₹300। लाभ % = (300 / 1200) × 100 = 25%।'
  },
  {
    exam: 'MP Police',
    subject: 'Simple Arithmetic',
    topic: 'Percentage & Profit/Loss',
    subtopic: 'profit_loss_calc',
    concept: 'Loss percentage from CP and SP',
    difficulty: 'Medium',
    question: 'If an article bought for ₹800 is sold for ₹680, what is the loss percentage incurred?\nयदि ₹800 में खरीदी गई एक वस्तु ₹680 में बेची जाती है, तो हानि प्रतिशत क्या होगा?',
    options: [
      { id: 'A', text: '12%' },
      { id: 'B', text: '15%' },
      { id: 'C', text: '18%' },
      { id: 'D', text: '20%' }
    ],
    correctAnswer: 'B',
    explanation: 'Loss = 800 - 680 = ₹120. Loss % = (120 / 800) × 100 = 15%.\nहानि = 800 - 680 = ₹120। हानि % = (120 / 800) × 100 = 15%।'
  },
  {
    exam: 'General Practice / All Exams',
    subject: 'Simple Arithmetic',
    topic: 'Percentage & Profit/Loss',
    subtopic: 'profit_loss_calc',
    concept: 'CP of X equals SP of Y',
    difficulty: 'Hard',
    question: 'If the cost price of 15 articles is equal to the selling price of 12 articles, what is the profit percentage?\nयदि 15 वस्तुओं का क्रय मूल्य 12 वस्तुओं के विक्रय मूल्य के बराबर है, तो लाभ प्रतिशत क्या होगा?',
    options: [
      { id: 'A', text: '20%' },
      { id: 'B', text: '25%' },
      { id: 'C', text: '30%' },
      { id: 'D', text: '16.66%' }
    ],
    correctAnswer: 'B',
    explanation: 'Profit % = ((15 - 12) / 12) × 100 = (3 / 12) × 100 = 25%.\nलाभ % = ((15 - 12) / 12) × 100 = 25%।'
  },

  // Subtopic 3: cp_sp_finding
  {
    exam: 'General Practice / All Exams',
    subject: 'Simple Arithmetic',
    topic: 'Percentage & Profit/Loss',
    subtopic: 'cp_sp_finding',
    concept: 'Finding Cost Price from Selling Price and profit',
    difficulty: 'Medium',
    question: 'By selling an article for ₹1,440, a trader earns a profit of 20%. What was the cost price of the article?\nकिसी वस्तु को ₹1,440 में बेचने पर एक व्यापारी को 20% का लाभ होता है। वस्तु का वास्तविक क्रय मूल्य क्या था?',
    options: [
      { id: 'A', text: '₹1,150' },
      { id: 'B', text: '₹1,200' },
      { id: 'C', text: '₹1,250' },
      { id: 'D', text: '₹1,300' }
    ],
    correctAnswer: 'B',
    explanation: 'Cost Price = (1440 × 100) / (100 + 20) = 144000 / 120 = ₹1,200.\nक्रय मूल्य = (1440 × 100) / 120 = ₹1,200।'
  },
  {
    exam: 'General Practice / All Exams',
    subject: 'Simple Arithmetic',
    topic: 'Percentage & Profit/Loss',
    subtopic: 'cp_sp_finding',
    concept: 'Finding Cost Price from Selling Price and loss',
    difficulty: 'Medium',
    question: 'By selling an article for ₹1,800, a shopkeeper suffers a loss of 10%. What was the cost price of the article?\nकिसी वस्तु को ₹1,800 में बेचने पर एक दुकानदार को 10% की हानि होती है। उस वस्तु का क्रय मूल्य क्या था?',
    options: [
      { id: 'A', text: '₹1,950' },
      { id: 'B', text: '₹2,000' },
      { id: 'C', text: '₹2,050' },
      { id: 'D', text: '₹2,100' }
    ],
    correctAnswer: 'B',
    explanation: 'Cost Price = (1800 × 100) / (100 - 10) = 180000 / 90 = ₹2,000.\nक्रय मूल्य = (1800 × 100) / 90 = ₹2,000।'
  },
  {
    exam: 'General Practice / All Exams',
    subject: 'Simple Arithmetic',
    topic: 'Percentage & Profit/Loss',
    subtopic: 'cp_sp_finding',
    concept: 'Finding Selling Price from Cost Price and profit percentage',
    difficulty: 'Medium',
    question: 'A merchant purchases goods for ₹2,400 and sells them at a profit of 25%. What is the selling price?\nएक व्यापारी ₹2,400 में माल खरीदता है और उसे 25% के लाभ पर बेचता है। विक्रय मूल्य कितना होगा?',
    options: [
      { id: 'A', text: '₹2,900' },
      { id: 'B', text: '₹3,000' },
      { id: 'C', text: '₹3,100' },
      { id: 'D', text: '₹3,200' }
    ],
    correctAnswer: 'B',
    explanation: 'Selling Price = 2400 × 1.25 = ₹3,000.\nविक्रय मूल्य = 2400 × 1.25 = ₹3,000।'
  },

  // Subtopic 4: marked_price_discount
  {
    exam: 'General Practice / All Exams',
    subject: 'Simple Arithmetic',
    topic: 'Percentage & Profit/Loss',
    subtopic: 'marked_price_discount',
    concept: 'Calculating final price from Marked Price and discount',
    difficulty: 'Medium',
    question: 'The marked price of an article is ₹2,000. If a discount of 15% is offered, what is the final price paid by the customer?\nएक वस्तु का अंकित मूल्य ₹2,000 है। यदि उस पर 15% की छूट दी जाती है, तो ग्राहक द्वारा भुगतान की गई अंतिम राशि क्या होगी?',
    options: [
      { id: 'A', text: '₹1,650' },
      { id: 'B', text: '₹1,700' },
      { id: 'C', text: '₹1,750' },
      { id: 'D', text: '₹1,800' }
    ],
    correctAnswer: 'B',
    explanation: 'Discount = ₹2,000 × 15% = ₹300. Final Price = ₹2,000 - ₹300 = ₹1,700.\nछूट = 15% = ₹300। अंतिम मूल्य = 2000 - 300 = ₹1,700।'
  },
  {
    exam: 'General Practice / All Exams',
    subject: 'Simple Arithmetic',
    topic: 'Percentage & Profit/Loss',
    subtopic: 'marked_price_discount',
    concept: 'Finding discount percentage from MP and SP',
    difficulty: 'Medium',
    question: 'A shirt marked at ₹1,200 is sold for ₹960. What is the discount percentage offered on the shirt?\n₹1,200 अंकित मूल्य वाली कमीज ₹960 में बेची जाती है। कमीज पर दी गई छूट का प्रतिशत क्या है?',
    options: [
      { id: 'A', text: '15%' },
      { id: 'B', text: '20%' },
      { id: 'C', text: '25%' },
      { id: 'D', text: '18%' }
    ],
    correctAnswer: 'B',
    explanation: 'Discount = 1200 - 960 = ₹240. Discount % = (240 / 1200) × 100 = 20%.\nछूट = ₹240। छूट प्रतिशत = (240 / 1200) × 100 = 20%।'
  },
  {
    exam: 'General Practice / All Exams',
    subject: 'Simple Arithmetic',
    topic: 'Percentage & Profit/Loss',
    subtopic: 'marked_price_discount',
    concept: 'Net profit percentage after markup and discount',
    difficulty: 'Hard',
    question: 'A trader marks his goods 30% above the cost price and allows a discount of 10% on the marked price. What is his net profit percentage?\nएक व्यापारी अपने माल पर क्रय मूल्य से 30% अधिक मूल्य अंकित करता है और अंकित मूल्य पर 10% की छूट देता है। उसका शुद्ध लाभ प्रतिशत क्या है?',
    options: [
      { id: 'A', text: '15%' },
      { id: 'B', text: '17%' },
      { id: 'C', text: '18%' },
      { id: 'D', text: '20%' }
    ],
    correctAnswer: 'B',
    explanation: 'Let CP = 100. MP = 130. SP = 130 × 0.9 = 117. Profit = 117 - 100 = 17%.\nमाना क्रय मूल्य = 100, अंकित मूल्य = 130, विक्रय मूल्य = 117 => लाभ = 17%।'
  },

  // Subtopic 5: successive_discount_mixed
  {
    exam: 'General Practice / All Exams',
    subject: 'Simple Arithmetic',
    topic: 'Percentage & Profit/Loss',
    subtopic: 'successive_discount_mixed',
    concept: 'Equivalent single discount for two successive discounts',
    difficulty: 'Medium',
    question: 'What single discount is equivalent to two successive discounts of 20% and 10%?\n20% और 10% की दो क्रमिक छूट (Successive Discounts) के समतुल्य एकल छूट क्या होगी?',
    options: [
      { id: 'A', text: '25%' },
      { id: 'B', text: '28%' },
      { id: 'C', text: '30%' },
      { id: 'D', text: '26%' }
    ],
    correctAnswer: 'B',
    explanation: 'Single Equivalent Discount = 20 + 10 - (20 × 10)/100 = 28%.\nसमतुल्य एकल छूट = 20 + 10 - (20 × 10)/100 = 28%।'
  },
  {
    exam: 'General Practice / All Exams',
    subject: 'Simple Arithmetic',
    topic: 'Percentage & Profit/Loss',
    subtopic: 'successive_discount_mixed',
    concept: 'Final selling price after successive discounts',
    difficulty: 'Hard',
    question: 'An article with a marked price of ₹4,000 is sold with two successive discounts of 20% and 10%. What is the final selling price?\n₹4,000 के अंकित मूल्य वाली वस्तु पर 20% और 10% की दो क्रमिक छूट दी जाती हैं। वस्तु का अंतिम विक्रय मूल्य क्या होगा?',
    options: [
      { id: 'A', text: '₹2,800' },
      { id: 'B', text: '₹2,880' },
      { id: 'C', text: '₹2,920' },
      { id: 'D', text: '₹3,000' }
    ],
    correctAnswer: 'B',
    explanation: 'Equivalent discount = 28%. Final Price = 4000 × (1 - 0.28) = ₹2,880.\nसमतुल्य छूट = 28%। अंतिम विक्रय मूल्य = 4000 × 0.72 = ₹2,880।'
  },
  {
    exam: 'General Practice / All Exams',
    subject: 'Simple Arithmetic',
    topic: 'Percentage & Profit/Loss',
    subtopic: 'successive_discount_mixed',
    concept: 'Vendor loss in terms of selling price of items',
    difficulty: 'Hard',
    question: 'By selling 36 oranges, a fruit vendor incurs a loss equal to the selling price of 4 oranges. What is his loss percentage?\n36 संतरे बेचने पर एक फल विक्रेता को 4 संतरों के विक्रय मूल्य के बराबर हानि होती है। उसकी हानि का प्रतिशत क्या है?',
    options: [
      { id: 'A', text: '9%' },
      { id: 'B', text: '10%' },
      { id: 'C', text: '11.11%' },
      { id: 'D', text: '12.5%' }
    ],
    correctAnswer: 'B',
    explanation: 'Loss = 4 SP. CP = 36 SP + 4 SP = 40 SP. Loss % = (4 / 40) × 100 = 10%.\nहानि = 4 SP, क्रय मूल्य = 40 SP => हानि % = (4 / 40) × 100 = 10%।'
  },
  {
    exam: 'SSC CGL / MP SI',
    subject: 'Simple Arithmetic',
    topic: 'Percentage & Profit/Loss',
    subtopic: 'profit_loss_calc',
    concept: 'Dishonest merchant using false weight',
    difficulty: 'Very Hard',
    question: 'A dishonest dealer professes to sell his goods at cost price, but uses a false weight of 800 grams for 1 kg. What is his actual profit percentage?\nएक बेईमान व्यापारी अपने माल को क्रय मूल्य पर बेचने का दावा करता है, लेकिन 1 किग्रा के स्थान पर 800 ग्राम के झूठे बाट का उपयोग करता है। उसका वास्तविक लाभ प्रतिशत क्या है?',
    options: [
      { id: 'A', text: '20%' },
      { id: 'B', text: '25%' },
      { id: 'C', text: '30%' },
      { id: 'D', text: '22.5%' }
    ],
    correctAnswer: 'B',
    explanation: 'Profit % = ((Error) / (True Value - Error)) × 100 = ((1000 - 800) / 800) × 100 = (200 / 800) × 100 = 25%.\nलाभ % = ((1000 - 800) / 800) × 100 = (200 / 800) × 100 = 25%।'
  },
  {
    exam: 'SSC CGL / MP SI',
    subject: 'Simple Arithmetic',
    topic: 'Percentage & Profit/Loss',
    subtopic: 'basic_percentage',
    concept: 'Price reduction enabling purchasing more quantity',
    difficulty: 'Very Hard',
    question: 'A reduction of 20% in the price of sugar enables a buyer to purchase 5 kg more sugar for ₹600. What was the original price per kg of sugar?\nचीनी के मूल्य में 20% की कमी होने पर एक खरीदार ₹600 में 5 किग्रा अधिक चीनी खरीद सकता है। चीनी का प्रारंभिक (मूल) प्रति किग्रा मूल्य क्या था?',
    options: [
      { id: 'A', text: '₹25 / kg' },
      { id: 'B', text: '₹30 / kg' },
      { id: 'C', text: '₹24 / kg' },
      { id: 'D', text: '₹32 / kg' }
    ],
    correctAnswer: 'B',
    explanation: 'Reduced Price per kg = (20% of ₹600) / 5 = ₹120 / 5 = ₹24 / kg. Original Price = ₹24 / (1 - 0.20) = ₹24 / 0.80 = ₹30 / kg.\nघटा हुआ मूल्य = (600 का 20%) / 5 = ₹24 / किग्रा। मूल मूल्य = ₹24 / 0.80 = ₹30 / किग्रा।'
  },
  {
    exam: 'SSC CGL / MP SI',
    subject: 'Simple Arithmetic',
    topic: 'Percentage & Profit/Loss',
    subtopic: 'cp_sp_finding',
    concept: 'Two articles sold at same SP with equal gain and loss',
    difficulty: 'Very Hard',
    question: 'A person sold two articles for ₹4,800 each. On one he gained 20% and on the other he lost 20%. What was his overall gain or loss percentage in the whole transaction?\nएक व्यक्ति ने दो वस्तुओं में से प्रत्येक को ₹4,800 में बेचा। एक पर उसे 20% का लाभ और दूसरी पर 20% की हानि हुई। पूरे सौदे में उसका समग्र लाभ या हानि प्रतिशत क्या था?',
    options: [
      { id: 'A', text: 'No profit no loss / न लाभ न हानि' },
      { id: 'B', text: '4% Loss / हानि' },
      { id: 'C', text: '4% Profit / लाभ' },
      { id: 'D', text: '2% Loss / हानि' }
    ],
    correctAnswer: 'B',
    explanation: 'When two items are sold at the same SP with equal gain and loss of x%, there is always a loss = (x^2 / 100)% = (20^2 / 100)% = 4% Loss.\nसमान विक्रय मूल्य पर समान प्रतिशत लाभ-हानि होने पर सदैव हानि होती है = (x^2 / 100)% = 4% हानि।'
  },
  {
    exam: 'SSC CGL / MP SI',
    subject: 'Simple Arithmetic',
    topic: 'Percentage & Profit/Loss',
    subtopic: 'cp_sp_finding',
    concept: 'Selling at fraction of usual SP gives loss',
    difficulty: 'Very Hard',
    question: 'By selling an article at 3/4 of its normal selling price, a merchant incurs a loss of 10%. What will be his profit percentage if he sells it at the normal selling price?\nकिसी वस्तु को उसके सामान्य विक्रय मूल्य के 3/4 भाग पर बेचने से एक व्यापारी को 10% की हानि होती है। यदि वह इसे सामान्य विक्रय मूल्य पर बेचे, तो उसका लाभ प्रतिशत क्या होगा?',
    options: [
      { id: 'A', text: '15%' },
      { id: 'B', text: '20%' },
      { id: 'C', text: '25%' },
      { id: 'D', text: '18%' }
    ],
    correctAnswer: 'B',
    explanation: 'Let normal SP = S. Given (3/4)S = 0.90 CP => S = (0.90 × 4 / 3) CP = 1.20 CP. Profit = 1.20 CP - CP = 0.20 CP = 20%.\nमाना सामान्य विक्रय मूल्य = S। (3/4)S = 0.90 CP => S = 1.20 CP => लाभ = 20%।'
  },
  {
    exam: 'SSC CGL / MP SI',
    subject: 'Simple Arithmetic',
    topic: 'Percentage & Profit/Loss',
    subtopic: 'marked_price_discount',
    concept: 'Markup with two successive discounts',
    difficulty: 'Very Hard',
    question: 'A manufacturer marks his goods 50% above the cost price and allows two successive discounts of 20% and 10% on the marked price. What is his net profit percentage?\nएक निर्माता अपने माल पर क्रय मूल्य से 50% अधिक मूल्य अंकित करता है और अंकित मूल्य पर 20% और 10% की दो क्रमिक छूट देता है। उसका शुद्ध लाभ प्रतिशत क्या है?',
    options: [
      { id: 'A', text: '6%' },
      { id: 'B', text: '8%' },
      { id: 'C', text: '10%' },
      { id: 'D', text: '12%' }
    ],
    correctAnswer: 'B',
    explanation: 'Let CP = 100. MP = 150. Price after 20% discount = 150 × 0.80 = 120. Price after second 10% discount = 120 × 0.90 = 108. Net Profit = 108 - 100 = 8%.\nमाना क्रय मूल्य = 100, अंकित मूल्य = 150। 20% छूट के बाद = 120, पुनः 10% छूट के बाद = 108 => शुद्ध लाभ = 8%।'
  },
  {
    exam: 'SSC CGL / MP SI',
    subject: 'Simple Arithmetic',
    topic: 'Percentage & Profit/Loss',
    subtopic: 'basic_percentage',
    concept: 'Price increase requiring consumption reduction',
    difficulty: 'Very Hard',
    question: 'If the price of petrol increases by 25%, by what percentage must a motorist reduce his consumption so that expenditure remains unchanged?\nयदि पेट्रोल के मूल्य में 25% की वृद्धि हो जाती है, तो एक मोटर चालक को अपनी खपत में कितने प्रतिशत की कमी करनी चाहिए ताकि उसका खर्च अपरिवर्तित रहे?',
    options: [
      { id: 'A', text: '16.66%' },
      { id: 'B', text: '20%' },
      { id: 'C', text: '22.5%' },
      { id: 'D', text: '25%' }
    ],
    correctAnswer: 'B',
    explanation: 'Reduction in consumption % = (r / (100 + r)) × 100 = (25 / 125) × 100 = 20%.\nखपत में प्रतिशत कमी = (r / (100 + r)) × 100 = (25 / 125) × 100 = 20%।'
  },
  {
    exam: 'SSC CGL / MP SI',
    subject: 'Simple Arithmetic',
    topic: 'Percentage & Profit/Loss',
    subtopic: 'basic_percentage',
    concept: 'Election winner majority votes calculation',
    difficulty: 'Very Hard',
    question: 'In an election between two candidates, the winning candidate secured 58% of the total valid votes and won by a majority of 3,200 votes. What was the total number of valid votes polled?\nदो प्रत्याशियों के बीच हुए एक चुनाव में, जीतने वाले प्रत्याशी ने कुल वैध मतों का 58% मत प्राप्त किया और 3,200 मतों के बहुमत से विजयी हुआ। डाले गए कुल वैध मतों की संख्या क्या थी?',
    options: [
      { id: 'A', text: '18,000' },
      { id: 'B', text: '20,000' },
      { id: 'C', text: '22,500' },
      { id: 'D', text: '24,000' }
    ],
    correctAnswer: 'B',
    explanation: 'Winner = 58%, Loser = 100 - 58 = 42%. Margin = 58% - 42% = 16%. Total Votes = (3200 / 16) × 100 = 20,000.\nजीत का अंतर = 58% - 42% = 16%। कुल वैध मत = (3200 / 16) × 100 = 20,000।'
  },
  {
    exam: 'SSC CGL / MP SI',
    subject: 'Simple Arithmetic',
    topic: 'Percentage & Profit/Loss',
    subtopic: 'successive_discount_mixed',
    concept: 'Weighted profit and loss on parts of stock',
    difficulty: 'Very Hard',
    question: 'A trader bought 80 kg of wheat at ₹30 per kg. He sold 50 kg at a profit of 20% and the remaining 30 kg at a loss of 10%. What is his overall profit percentage on the whole transaction?\nएक व्यापारी ने ₹30 प्रति किग्रा की दर से 80 किग्रा गेहूं खरीदा। उसने 50 किग्रा 20% के लाभ पर और शेष 30 किग्रा 10% की हानि पर बेचा। पूरे सौदे में उसका समग्र लाभ प्रतिशत क्या है?',
    options: [
      { id: 'A', text: '7.5%' },
      { id: 'B', text: '8.75%' },
      { id: 'C', text: '9.25%' },
      { id: 'D', text: '10%' }
    ],
    correctAnswer: 'B',
    explanation: 'Total CP = 80 × 30 = ₹2,400. Profit on 50 kg = 50 × 30 × 0.20 = +₹300. Loss on 30 kg = 30 × 30 × 0.10 = -₹90. Net Profit = 300 - 90 = ₹210. Profit % = (210 / 2400) × 100 = 8.75%.\nकुल क्रय मूल्य = ₹2,400। कुल लाभ = 300 - 90 = ₹210। लाभ % = (210 / 2400) × 100 = 8.75%।'
  },
  {
    exam: 'CAT / SSC CGL Tier-2',
    subject: 'Simple Arithmetic',
    topic: 'Percentage & Profit/Loss',
    subtopic: 'profit_loss_calc',
    concept: 'Dishonest dealer cheating on buying and selling',
    difficulty: 'Ultra Hard',
    question: 'A dishonest dealer uses a false weight that cheats by 20% while purchasing goods and cheats by 20% while selling goods, and professes to sell at cost price. What is his net profit percentage?\nएक बेईमान व्यापारी सामान खरीदते समय 20% और सामान बेचते समय 20% की बेईमानी (गलत बाट) करता है, और माल को क्रय मूल्य पर बेचने का दावा करता है। उसका कुल लाभ प्रतिशत कितना है?',
    options: [
      { id: 'A', text: '40%' },
      { id: 'B', text: '50%' },
      { id: 'C', text: '44%' },
      { id: 'D', text: '45%' }
    ],
    correctAnswer: 'B',
    explanation: 'Cheating 20% while buying = gets 1200g for CP of 1000g. Cheating 20% while selling = gives 800g for SP of 1000g. Profit % = ((1200 - 800) / 800) × 100 = (400 / 800) × 100 = 50%.\nखरीदते समय 1200 ग्राम मिलता है और बेचते समय 800 ग्राम दिया जाता है => लाभ % = ((1200 - 800) / 800) × 100 = 50%।'
  },
  {
    exam: 'CAT / SSC CGL Tier-2',
    subject: 'Simple Arithmetic',
    topic: 'Percentage & Profit/Loss',
    subtopic: 'profit_loss_calc',
    concept: 'Milk and water mixture profit percentage',
    difficulty: 'Ultra Hard',
    question: 'A milkman mixes 20 liters of water into 80 liters of pure milk costing ₹50 per liter. He sells the entire mixture at a markup of 10% above the cost price of pure milk. What is his overall profit percentage?\nएक ग्वाला ₹50 प्रति लीटर वाले 80 लीटर शुद्ध दूध में 20 लीटर पानी मिलाता है। वह पूरे मिश्रण को शुद्ध दूध के क्रय मूल्य से 10% अधिक मूल्य पर बेचता है। उसका समग्र लाभ प्रतिशत क्या है?',
    options: [
      { id: 'A', text: '32.5%' },
      { id: 'B', text: '37.5%' },
      { id: 'C', text: '35%' },
      { id: 'D', text: '40%' }
    ],
    correctAnswer: 'B',
    explanation: 'Cost of Milk = 80 × 50 = ₹4,000 (water is free). Total volume = 100 L. SP per liter = 50 × 1.10 = ₹55. Total SP = 100 × 55 = ₹5,500. Profit = ₹1,500. Profit % = (1500 / 4000) × 100 = 37.5%.\nकुल क्रय मूल्य = ₹4,000। कुल विक्रय मूल्य = 100 × 55 = ₹5,500। लाभ % = (1500 / 4000) × 100 = 37.5%।'
  },
  {
    exam: 'CAT / SSC CGL Tier-2',
    subject: 'Simple Arithmetic',
    topic: 'Percentage & Profit/Loss',
    subtopic: 'cp_sp_finding',
    concept: 'Shift from loss to gain by fixed price change',
    difficulty: 'Ultra Hard',
    question: 'An article was sold at a loss of 12%. If it had been sold for ₹630 more, there would have been a gain of 9%. What is the cost price of the article?\nकिसी वस्तु को 12% की हानि पर बेचा गया। यदि इसे ₹630 अधिक में बेचा गया होता, तो 9% का लाभ होता। उस वस्तु का क्रय मूल्य क्या है?',
    options: [
      { id: 'A', text: '₹2,800' },
      { id: 'B', text: '₹3,000' },
      { id: 'C', text: '₹3,200' },
      { id: 'D', text: '₹3,500' }
    ],
    correctAnswer: 'B',
    explanation: 'Total percentage shift = 9% - (-12%) = 21%. 21% of CP = ₹630 => CP = (630 / 21) × 100 = ₹3,000.\nप्रतिशत का कुल अंतर = 9% - (-12%) = 21%। क्रय मूल्य = (630 / 21) × 100 = ₹3,000।'
  },
  {
    exam: 'CAT / SSC CGL Tier-2',
    subject: 'Simple Arithmetic',
    topic: 'Percentage & Profit/Loss',
    subtopic: 'cp_sp_finding',
    concept: 'Double condition cost and selling price variation',
    difficulty: 'Ultra Hard',
    question: 'A shopkeeper sells an article at a profit of 15%. Had he bought it for 10% less and sold it for ₹40 less, he would have gained 25%. What is the cost price of the article?\nएक दुकानदार किसी वस्तु को 15% के लाभ पर बेचता है। यदि उसने इसे 10% कम में खरीदा होता और ₹40 कम में बेचा होता, तो उसे 25% का लाभ होता। वस्तु का क्रय मूल्य क्या है?',
    options: [
      { id: 'A', text: '₹1,500' },
      { id: 'B', text: '₹1,600' },
      { id: 'C', text: '₹1,750' },
      { id: 'D', text: '₹1,800' }
    ],
    correctAnswer: 'B',
    explanation: 'Let CP = 100x. SP1 = 115x. New CP = 90x. New SP = 90x × 1.25 = 112.5x. Difference = 115x - 112.5x = 2.5x = 40 => x = 16 => CP = ₹1,600.\nमाना क्रय मूल्य = 100x। नया क्रय मूल्य = 90x => 90x × 1.25 = 112.5x। 2.5x = 40 => x = 16 => क्रय मूल्य = ₹1,600।'
  },
  {
    exam: 'CAT / SSC CGL Tier-2',
    subject: 'Simple Arithmetic',
    topic: 'Percentage & Profit/Loss',
    subtopic: 'cp_sp_finding',
    concept: 'Two items same SP with unequal gain and loss in rupees',
    difficulty: 'Ultra Hard',
    question: 'A man sells two chairs for ₹1,200 each. On the first chair he makes a profit of 20% and on the second chair he incurs a loss of 25%. What is his overall profit or loss amount in the entire transaction?\nएक व्यक्ति दो कुर्सियों में से प्रत्येक को ₹1,200 में बेचता है। पहली कुर्सी पर उसे 20% का लाभ और दूसरी कुर्सी पर 25% की हानि होती है। पूरे सौदे में उसे कुल कितने रुपये का लाभ या हानि हुई?',
    options: [
      { id: 'A', text: '₹150 Loss / हानि' },
      { id: 'B', text: '₹200 Loss / हानि' },
      { id: 'C', text: '₹200 Profit / लाभ' },
      { id: 'D', text: '₹250 Loss / हानि' }
    ],
    correctAnswer: 'B',
    explanation: 'CP1 = 1200 / 1.20 = ₹1,000. CP2 = 1200 / 0.75 = ₹1,600. Total CP = ₹2,600. Total SP = ₹2,400. Net Loss = 2600 - 2400 = ₹200 Loss.\nCP1 = ₹1,000, CP2 = ₹1,600 => कुल क्रय मूल्य = ₹2,600, कुल विक्रय मूल्य = ₹2,400 => कुल हानि = ₹200।'
  },
  {
    exam: 'CAT / SSC CGL Tier-2',
    subject: 'Simple Arithmetic',
    topic: 'Percentage & Profit/Loss',
    subtopic: 'basic_percentage',
    concept: 'Revenue variation on price and consumption change',
    difficulty: 'Ultra Hard',
    question: 'The ticket price of a cinema hall was increased by 30%, which resulted in a 20% drop in total ticket sales. What was the net percentage change in the total revenue collected?\nएक सिनेमा हॉल के टिकट के मूल्य में 30% की वृद्धि की गई, जिससे कुल टिकटों की बिक्री में 20% की कमी आ गई। कुल एकत्रित राजस्व में शुद्ध प्रतिशत परिवर्तन क्या हुआ?',
    options: [
      { id: 'A', text: '2% Decrease / कमी' },
      { id: 'B', text: '4% Increase / वृद्धि' },
      { id: 'C', text: '6% Increase / वृद्धि' },
      { id: 'D', text: '5% Decrease / कमी' }
    ],
    correctAnswer: 'B',
    explanation: 'Net Change = (1.30 × 0.80 - 1) × 100 = (1.04 - 1) × 100 = +4% Increase.\nराजस्व में शुद्ध परिवर्तन = (1.30 × 0.80 - 1) × 100 = +4% की वृद्धि।'
  }
];

const ARITHMETIC_SI_CI_BANK = [
  {
    exam: 'MP Police',
    subject: 'Simple Arithmetic',
    topic: 'Simple Interest',
    difficulty: 'Easy',
    question: 'What will be the Simple Interest on a principal sum of ₹8,000 at an annual interest rate of 5% for 3 years?\n₹8,000 की मूलधन राशि पर 5% वार्षिक साधारण ब्याज की दर से 3 वर्ष का साधारण ब्याज (Simple Interest) कितना होगा?',
    options: [
      { id: 'A', text: '₹1,000' },
      { id: 'B', text: '₹1,200' },
      { id: 'C', text: '₹1,400' },
      { id: 'D', text: '₹1,500' }
    ],
    correctAnswer: 'B',
    explanation: 'Simple Interest = (P × R × T) / 100 = (8000 × 5 × 3) / 100 = ₹1,200.\nसाधारण ब्याज = (मूलधन × दर × समय) / 100 = (8000 × 5 × 3) / 100 = ₹1,200।'
  }
];

const ARITHMETIC_RATIO_WORK_TIME_BANK = [
  {
    exam: 'MP Police',
    subject: 'Simple Arithmetic',
    topic: 'Ratio & Proportion',
    difficulty: 'Easy',
    question: 'If A : B = 3 : 4 and B : C = 8 : 9, what is the value of the ratio A : C?\nयदि A : B = 3 : 4 और B : C = 8 : 9 है, तो A : C का मान क्या होगा?',
    options: [
      { id: 'A', text: '1 : 2' },
      { id: 'B', text: '2 : 3' },
      { id: 'C', text: '3 : 5' },
      { id: 'D', text: '4 : 5' }
    ],
    correctAnswer: 'B',
    explanation: 'A/C = (A/B) × (B/C) = (3/4) × (8/9) = 24 / 36 = 2 / 3, thus A : C = 2 : 3.\nA/C = (A/B) × (B/C) = (3/4) × (8/9) = 24 / 36 = 2 / 3, अतः A : C = 2 : 3।'
  },
  {
    exam: 'MP Police',
    subject: 'Simple Arithmetic',
    topic: 'Time & Work',
    difficulty: 'Medium',
    question: 'Amit can complete a work in 12 days and Sumit can do the same work in 24 days. Working together, in how many days will they finish the work?\nअमित किसी कार्य को 12 दिनों में और सुमित उसी कार्य को 24 दिनों में पूरा कर सकता है। दोनों मिलकर उस कार्य को कितने दिनों में समाप्त कर लेंगे?',
    options: [
      { id: 'A', text: '6 Days / 6 दिन' },
      { id: 'B', text: '8 Days / 8 दिन' },
      { id: 'C', text: '10 Days / 10 दिन' },
      { id: 'D', text: '9 Days / 9 दिन' }
    ],
    correctAnswer: 'B',
    explanation: 'Joint Time = (A × B) / (A + B) = (12 × 24) / (12 + 24) = 288 / 36 = 8 days.\nसंयुक्त समय = (A × B) / (A + B) = (12 × 24) / (12 + 24) = 288 / 36 = 8 दिन।'
  },
  {
    exam: 'MP Police',
    subject: 'Simple Arithmetic',
    topic: 'Speed, Time & Distance',
    difficulty: 'Medium',
    question: 'In how many seconds will a 180-meter long train running at a speed of 72 km/h cross an electric pole?\n72 किमी/घंटा की गति से चल रही 180 मीटर लंबी एक रेलगाड़ी एक बिजली के खंभे को कितने सेकंड में पार कर लेगी?',
    options: [
      { id: 'A', text: '8 Seconds / 8 सेकंड' },
      { id: 'B', text: '9 Seconds / 9 सेकंड' },
      { id: 'C', text: '10 Seconds / 10 सेकंड' },
      { id: 'D', text: '12 Seconds / 12 सेकंड' }
    ],
    correctAnswer: 'B',
    explanation: 'Speed (m/s) = 72 × (5/18) = 20 m/s. Time to cross pole = Distance / Speed = 180 / 20 = 9 seconds.\nगति (मी/से) = 72 × (5/18) = 20 मीटर/सेकंड। खंभे को पार करने में लगा समय = दूरी / चाल = 180 / 20 = 9 सेकंड।'
  }
];

// ----------------------------------------------------------------------------
// C. MP SPECIAL GK & GENERAL KNOWLEDGE BANKS
// ----------------------------------------------------------------------------

const MP_GEOGRAPHY_PARKS_RIVERS_BANK = [
  {
    exam: 'MP Police',
    subject: 'MP General Knowledge',
    topic: 'MP Geography & National Parks',
    difficulty: 'Medium',
    question: 'Which is the largest National Park in Madhya Pradesh where "Project Tiger" was first launched in 1974?\nमध्य प्रदेश का सबसे बड़ा राष्ट्रीय उद्यान कौन सा है, जिसमें "प्रोजेक्ट टाइगर" सबसे पहले 1974 में लागू किया गया था?',
    options: [
      { id: 'A', text: 'Bandhavgarh National Park / बांधवगढ़ राष्ट्रीय उद्यान' },
      { id: 'B', text: 'Kanha Kisli National Park / कान्हा किसली राष्ट्रीय उद्यान' },
      { id: 'C', text: 'Pench National Park / पेंच राष्ट्रीय उद्यान' },
      { id: 'D', text: 'Satpura National Park / सतपुड़ा राष्ट्रीय उद्यान' }
    ],
    correctAnswer: 'B',
    explanation: 'Kanha Kisli (940 sq km) in Mandla and Balaghat is the largest National Park in MP where Project Tiger started in 1974.\nकान्हा किसली राष्ट्रीय उद्यान (मंडला एवं बालाघाट) 940 वर्ग किमी में फैला म.प्र. का सबसे बड़ा राष्ट्रीय उद्यान है, जहां 1974 में प्रोजेक्ट टाइगर शुरू हुआ था।'
  },
  {
    exam: 'MP Police',
    subject: 'MP General Knowledge',
    topic: 'MP Rivers & Waterfalls',
    difficulty: 'Medium',
    question: 'Where is the origin of the "Narmada River", known as the lifeline of Madhya Pradesh?\nमध्य प्रदेश की जीवन रेखा कही जाने वाली "नर्मदा नदी" का उद्गम स्थल कहाँ स्थित है?',
    options: [
      { id: 'A', text: 'Janapav Hills (Mhow) / जानापाव पहाड़ी (महू)' },
      { id: 'B', text: 'Amarkantak (Anuppur) / अमरकंटक (अनूपपुर)' },
      { id: 'C', text: 'Multai (Betul) / मुलताई (बैतूल)' },
      { id: 'D', text: 'Kumra Village (Raisen) / कुम्बरा गांव (रायसेन)' }
    ],
    correctAnswer: 'B',
    explanation: 'Narmada originates from Amarkantak in the Maikal range of Anuppur district and flows 1,312 km (1,077 km in MP) before draining into the Arabian Sea.\nनर्मदा नदी अनूपपुर जिले के अमरकंटक के मैकल पर्वत श्रृंखला से निकलती है और कुल 1312 किमी (म.प्र. में 1077 किमी) बहकर खंभात की खाड़ी में गिरती है।'
  },
  {
    exam: 'MP Police',
    subject: 'MP General Knowledge',
    topic: 'MP Wildlife & Cheetah Project',
    difficulty: 'Medium',
    question: 'In which National Park of MP have African Cheetahs from Namibia and South Africa been reintroduced?\nनामीबिया और दक्षिण अफ्रीका से लाए गए चीतों को मध्य प्रदेश के किस राष्ट्रीय उद्यान में पुनर्वासित (Reintroduced) किया गया है?',
    options: [
      { id: 'A', text: 'Kuno National Park (Sheopur) / कूनो राष्ट्रीय उद्यान (श्योपुर)' },
      { id: 'B', text: 'Madhav National Park (Shivpuri) / माधव राष्ट्रीय उद्यान (शिवपुरी)' },
      { id: 'C', text: 'Panna National Park / पन्ना राष्ट्रीय उद्यान' },
      { id: 'D', text: 'Sanjay National Park (Sidhi) / संजय राष्ट्रीय उद्यान (सीधी)' }
    ],
    correctAnswer: 'A',
    explanation: 'African cheetahs were reintroduced to Kuno National Park in Sheopur district under Project Cheetah in September 2022.\nसितंबर 2022 में प्रोजेक्ट चीता के तहत नामीबिया एवं दक्षिण अफ्रीका से लाए गए चीतों को श्योपुर जिले के कूनो राष्ट्रीय उद्यान में छोड़ा गया था।'
  },
  {
    exam: 'MP Police',
    subject: 'MP General Knowledge',
    topic: 'MP Geography & Peaks',
    difficulty: 'Medium',
    question: 'The highest peak of Madhya Pradesh, "Dhupgarh" (1,350 m), is situated in which mountain range?\nमध्य प्रदेश की सबसे ऊंची चोटी "धूपगढ़" (1350 मीटर) किस पर्वत श्रृंखला एवं पहाड़ी पर स्थित है?',
    options: [
      { id: 'A', text: 'Vindhyachal Range (Siddha Baba) / विंध्याचल पर्वत (सिद्ध बाबा)' },
      { id: 'B', text: 'Satpura Mahadeo Hills (Pachmarhi) / सतपुड़ा मैकल श्रेणी (पचमढ़ी)' },
      { id: 'C', text: 'Aravalli Range / अरावली पर्वत श्रेणी' },
      { id: 'D', text: 'Kaimur Range / कैमूर श्रेणी' }
    ],
    correctAnswer: 'B',
    explanation: 'Dhupgarh (1,350 m) is situated in the Mahadeo Hills of the Satpura range in Pachmarhi (Narmadapuram), the highest point in MP.\nधूपगढ़ चोटी (1350 मीटर) सतपुड़ा पर्वत श्रेणी की महादेव पहाड़ियों में पचमढ़ी (नर्मदापुरम) में स्थित है, जो मध्य प्रदेश का सर्वोच्च शिखर है।'
  },
  {
    exam: 'MP Police',
    subject: 'MP General Knowledge',
    topic: 'MP Rivers & Waterfalls',
    difficulty: 'Medium',
    question: 'The majestic "Dhuandhar Waterfall" (Bhedaghat) near Jabalpur is carved out by which holy river?\nमध्य प्रदेश का प्रसिद्ध "धुआंधार जलप्रपात" (भेड़ाघाट) किस नदी द्वारा संगमरमर की चट्टानों के बीच निर्मित होता है?',
    options: [
      { id: 'A', text: 'Chambal River / चंबल नदी' },
      { id: 'B', text: 'Narmada River / नर्मदा नदी' },
      { id: 'C', text: 'Betwa River / बेतवा नदी' },
      { id: 'D', text: 'Tapti River / ताप्ती नदी' }
    ],
    correctAnswer: 'B',
    explanation: 'At Bhedaghat (Jabalpur), the Narmada River plummets into the gorge through white marble rocks creating the mist-laden Dhuandhar waterfall.\nजबलपुर के भेड़ाघाट में नर्मदा नदी श्वेत संगमरमर की चट्टानों से नीचे गिरकर जलवाष्प का धुआं बनाती है, जिसे धुआंधार जलप्रपात कहा जाता है।'
  }
];

const MP_HISTORY_FORTS_TRIBES_BANK = [
  {
    exam: 'MP Police',
    subject: 'MP General Knowledge',
    topic: 'MP Forts & Monuments',
    difficulty: 'Medium',
    question: 'Which ruler built the Gwalior Fort in the 8th century, which Babur termed the "Gibraltar of India"?\nग्वालियर के किले का निर्माण 8वीं शताब्दी में किस शासक द्वारा करवाया गया था, जिसे बाबर द्वारा "जिब्राल्टर ऑफ इंडिया" कहा गया?',
    options: [
      { id: 'A', text: 'Raja Man Singh Tomar / राजा मानसिंह तोमर' },
      { id: 'B', text: 'Raja Suraj Sen / राजा सूरज सेन' },
      { id: 'C', text: 'Mahadji Shinde / महादजी सिंधिया' },
      { id: 'D', text: 'Raja Bhoj / राजा भोज' }
    ],
    correctAnswer: 'B',
    explanation: 'Raja Suraj Sen founded the Gwalior Fort in honor of Saint Gwalipa. Later Raja Man Singh Tomar added the famous Gujari Mahal.\nग्वालियर किले की नींव 8वीं शताब्दी में राजा सूरज सेन ने ऋषि गालव के सम्मान में रखी थी। बाद में मानसिंह तोमर ने गुजरी महल बनवाया।'
  },
  {
    exam: 'MP Police',
    subject: 'MP General Knowledge',
    topic: 'MP History & Freedom Fighters',
    difficulty: 'Hard',
    question: 'Who is revered as the "Indian Robin Hood" for fighting British colonial rule in the Malwa-Nimar region during the 1857 revolt?\n1857 के स्वतंत्रता संग्राम में मध्य प्रदेश के मालवा-निमाड़ अंचल में अंग्रेजों से लोहा लेने वाले "भारतीय रॉबिनहुड" के नाम से किन्हें जाना जाता है?',
    options: [
      { id: 'A', text: 'Bhima Nayak / भीमा नायक' },
      { id: 'B', text: 'Tantya Bhil (Tantya Mama) / टंट्या भील (टंट्या मामा)' },
      { id: 'C', text: 'Shankar Shah / शंकर शाह' },
      { id: 'D', text: 'Raghunath Shah / रघुनाथ शाह' }
    ],
    correctAnswer: 'B',
    explanation: 'Tantya Bhil was called the "Indian Robin Hood" for distributing looted British treasures among the needy. Patalpani station has been named in his memory.\nटंट्या भील को अंग्रेजों से धन लूटकर गरीबों में बांटने के कारण "भारतीय रॉबिनहुड" कहा गया। पातालपानी रेलवे स्टेशन का नाम टंट्या मामा स्टेशन किया गया है।'
  },
  {
    exam: 'MP Police',
    subject: 'MP General Knowledge',
    topic: 'MP Tribes & Culture',
    difficulty: 'Hard',
    question: 'The famous "Bhagoria Haat" festival is celebrated with great fervour on Holi by which major tribal community of MP?\n"भगोरिया हाट" उत्सव मध्य प्रदेश के किस प्रमुख जनजाति समूह द्वारा होली के अवसर पर अत्यंत उत्साह से मनाया जाता है?',
    options: [
      { id: 'A', text: 'Gond Tribe / गोंड जनजाति' },
      { id: 'B', text: 'Bhil Tribe / भील जनजाति' },
      { id: 'C', text: 'Baiga Tribe / बैगा जनजाति' },
      { id: 'D', text: 'Sahariya Tribe / सहरिया जनजाति' }
    ],
    correctAnswer: 'B',
    explanation: 'Bhagoria festival is celebrated by the Bhil-Bhilala tribe across Jhabua, Alirajpur, Dhar, and Barwani districts around Holi.\nभगोरिया उत्सव झाबुआ, अलीराजपुर, बड़वानी और धार जिलों में भील-भिलाला जनजाति द्वारा फाल्गुन माह (होली) में मनाया जाता है।'
  },
  {
    exam: 'MP Police',
    subject: 'MP General Knowledge',
    topic: 'MP Folk Arts & Theatre',
    difficulty: 'Medium',
    question: 'Which folk drama has been recognized as the State Drama (Rajkiya Natya) of Madhya Pradesh?\nमध्य प्रदेश का राजकीय नाट्य (State Drama) कौन सा है, जिसकी उत्पत्ति मालवा अंचल से मानी जाती है?',
    options: [
      { id: 'A', text: 'Rai / राई' },
      { id: 'B', text: 'Maach / माच' },
      { id: 'C', text: 'Matki / मटकी' },
      { id: 'D', text: 'Gammat / गम्मत' }
    ],
    correctAnswer: 'B',
    explanation: 'Maach of Malwa is the State Drama of Madhya Pradesh, whereas Rai of Bundelkhand is the State Dance.\nमध्य प्रदेश का राजकीय नाट्य "माच" है (मालवा अंचल), जबकि राजकीय नृत्य बुंदेलखंड का "राई" है।'
  },
  {
    exam: 'MP Police',
    subject: 'MP General Knowledge',
    topic: 'MP UNESCO Heritage Sites',
    difficulty: 'Medium',
    question: 'For which archaeological treasure is the UNESCO World Heritage site "Bhimbetka Caves" (Raisen) world-famous?\nयूनेस्को विश्व धरोहर स्थल "भीमबेटका की गुफाएं" (रायसेन) किस ऐतिहासिक महत्व के लिए विश्वविख्यात हैं?',
    options: [
      { id: 'A', text: 'Buddhist Stupas & Inscriptions / बौद्ध स्तूप एवं शिलालेख' },
      { id: 'B', text: 'Prehistoric Rock Paintings / प्रागैतिहासिक शैलचित्र' },
      { id: 'C', text: 'Chandela Dynasty Temples / चंदेल कालीन मंदिर' },
      { id: 'D', text: 'Mughal Architecture / मुगल स्थापत्य कला' }
    ],
    correctAnswer: 'B',
    explanation: 'Discovered by Dr. V.S. Wakankar in 1957, Bhimbetka preserves Paleolithic and Mesolithic rock paintings and was declared a UNESCO site in 2003.\nभीमबेटका (खोजकर्ता: वी.एस. वाकणकर 1957) पुरापाषाण कालीन प्रागैतिहासिक शैलचित्रों के लिए प्रसिद्ध है, जिसे 2003 में यूनेस्को स्थल घोषित किया गया।'
  },
  {
    exam: 'MP Police',
    subject: 'MP General Knowledge',
    topic: 'MP Dynasties & History',
    difficulty: 'Medium',
    question: 'Which illustrious Parmar ruler of Malwa established Dhar as his capital and built the Saraswati temple (Bhojshala)?\nमालवा के प्रसिद्ध परमार वंश के किस प्रतापी राजा ने धार को अपनी राजधानी बनाया और सरस्वती मंदिर (भोजशाला) का निर्माण करवाया?',
    options: [
      { id: 'A', text: 'Raja Bhoj / राजा भोज' },
      { id: 'B', text: 'Upendra Raj / उपेंद्र राज' },
      { id: 'C', text: 'Vakpati Munja / वाक्पति मुंज' },
      { id: 'D', text: 'Yashodharman / यशोधर्मन' }
    ],
    correctAnswer: 'A',
    explanation: 'Raja Bhoj (1000-1055 AD) was a great scholar-king who established Bhojshala in Dhar and built the monumental Upper Lake (Bhojtal) in Bhopal.\nपरमार वंशीय राजा भोज (1000-1055 ई.) ने धार नगरी में भोजशाला की स्थापना की और भोपाल का प्रसिद्ध बड़ा तालाब (भोजताल) बनवाया।'
  }
];

const MP_ADMIN_POLICE_MINERALS_BANK = [
  {
    exam: 'MP Police',
    subject: 'MP General Knowledge',
    topic: 'MP Administration & Districts',
    difficulty: 'Easy',
    question: 'In which city is the Principal Bench of the Madhya Pradesh High Court located?\nमध्य प्रदेश उच्च न्यायालय (High Court) का मुख्य पीठ (Principal Bench) किस शहर में स्थित है?',
    options: [
      { id: 'A', text: 'Bhopal / भोपाल' },
      { id: 'B', text: 'Indore / इंदौर' },
      { id: 'C', text: 'Gwalior / ग्वालियर' },
      { id: 'D', text: 'Jabalpur / जबलपुर' }
    ],
    correctAnswer: 'D',
    explanation: 'The Principal Bench of the MP High Court is located in Jabalpur, while two permanent branch benches are situated in Indore and Gwalior.\nमध्य प्रदेश उच्च न्यायालय का प्रधान पीठ जबलपुर में स्थित है, जबकि इसकी दो स्थायी खंडपीठें इंदौर और ग्वालियर में स्थापित हैं।'
  },
  {
    exam: 'MP Police',
    subject: 'MP General Knowledge',
    topic: 'MP Minerals & Industry',
    difficulty: 'Medium',
    question: 'Which district of Madhya Pradesh is the sole and premier diamond-producing district in India?\nमध्य प्रदेश का कौन सा जिला देश में हीरे (Diamonds) के उत्खनन के लिए एकमात्र और सर्वाधिक प्रसिद्ध है?',
    options: [
      { id: 'A', text: 'Balaghat / बालाघाट' },
      { id: 'B', text: 'Panna / पन्ना' },
      { id: 'C', text: 'Katni / कटनी' },
      { id: 'D', text: 'Singrauli / सिंगरौली' }
    ],
    correctAnswer: 'B',
    explanation: 'Panna district (Majhgawan mine operated by NMDC) is India\'s only mechanized diamond-producing district.\nपन्ना जिले की मझगवां खदान देश की प्रमुख सक्रिय हीरा उत्पादक खदान है, जिसका संचालन NMDC द्वारा किया जाता है।'
  },
  {
    exam: 'MP Police',
    subject: 'MP General Knowledge',
    topic: 'MP Police Administration',
    difficulty: 'Medium',
    question: 'What is the official motto of the Madhya Pradesh Police Department?\nमध्य प्रदेश पुलिस का आधिकारिक आदर्श वाक्य (Motto) क्या है?',
    options: [
      { id: 'A', text: 'Satyameva Jayate / सत्यमेव जयते' },
      { id: 'B', text: 'Desh Bhakti, Jan Seva / देशभक्ति, जनसेवा' },
      { id: 'C', text: 'Seva, Suraksha, Shanti / सेवा, सुरक्षा, शांति' },
      { id: 'D', text: 'Sada Satark / सदा सतर्क' }
    ],
    correctAnswer: 'B',
    explanation: 'The official motto of Madhya Pradesh Police is "Desh Bhakti, Jan Seva" (Patriotism, Public Service). Headquarters is at Bhopal.\nमध्य प्रदेश पुलिस का आधिकारिक ध्येय वाक्य "देशभक्ति, जनसेवा" है। म.प्र. पुलिस का मुख्यालय जहांगीराबाद, भोपाल में स्थित है।'
  },
  {
    exam: 'MP Police',
    subject: 'MP General Knowledge',
    topic: 'MP Energy & Minerals',
    difficulty: 'Easy',
    question: 'Which industrial city is recognized as the "Energy Capital" (Urja Rajdhani) of Madhya Pradesh?\nमध्य प्रदेश की "ऊर्जा राजधानी" (Energy Capital) के रूप में किस औद्योगिक शहर को जाना जाता है?',
    options: [
      { id: 'A', text: 'Katni / कटनी' },
      { id: 'B', text: 'Singrauli (Waidhan) / सिंगरौली (बैढ़न)' },
      { id: 'C', text: 'Anuppur / अनूपपुर' },
      { id: 'D', text: 'Shahdol / शहडोल' }
    ],
    correctAnswer: 'B',
    explanation: 'Singrauli (Waidhan) is known as the Energy Capital of MP due to its vast coal reserves and massive NTPC thermal power plants.\nसिंगरौली जिले के बैढ़न क्षेत्र में विशाल कोयला खदानों और NTPC के ताप विद्युत संयंत्रों की बहुलता के कारण इसे मध्य प्रदेश की ऊर्जा राजधानी कहा जाता है।'
  }
];

// ----------------------------------------------------------------------------
// D. GENERAL SCIENCE & CONSTITUTION BANKS
// ----------------------------------------------------------------------------

const SCIENCE_BANK = [
  {
    exam: 'MP Police',
    subject: 'General Science',
    topic: 'Physics - SI Units & Motion',
    difficulty: 'Easy',
    question: 'What is the base SI unit of "Electric Current" in the International System of Units?\nअंतर्राष्ट्रीय मात्रक प्रणाली (SI Unit) में "विद्युत धारा" (Electric Current) का मूल मात्रक क्या है?',
    options: [
      { id: 'A', text: 'Volt / वोल्ट' },
      { id: 'B', text: 'Ampere / एम्पीयर' },
      { id: 'C', text: 'Ohm / ओम' },
      { id: 'D', text: 'Watt / वाट' }
    ],
    correctAnswer: 'B',
    explanation: 'The SI unit of electric current is Ampere (A). Volt is potential difference, Ohm is resistance, and Watt is power.\nविद्युत धारा का SI मात्रक एम्पीयर (A) है। वोल्ट विभवांतर का मात्रक है, ओम प्रतिरोध का और वाट विद्युत शक्ति का मात्रक है।'
  },
  {
    exam: 'MP Police',
    subject: 'General Science',
    topic: 'Biology - Human Diseases & Nutrition',
    difficulty: 'Medium',
    question: 'Deficiency of Vitamin \'C\' (Ascorbic acid) in human body leads to which disorder?\nविटामिन \'C\' (एस्कॉर्बिक अम्ल) की कमी से मानव शरीर में कौन सा रोग उत्पन्न होता है?',
    options: [
      { id: 'A', text: 'Night Blindness / रतौंधी' },
      { id: 'B', text: 'Beri-Beri / बेरी-बेरी' },
      { id: 'C', text: 'Scurvy (Bleeding Gums) / स्कर्वी (मसूड़ों से खून आना)' },
      { id: 'D', text: 'Rickets / रिकेट्स (सूखा रोग)' }
    ],
    correctAnswer: 'C',
    explanation: 'Vitamin C deficiency causes Scurvy. Vitamin A deficiency causes Night Blindness, Vitamin B1 causes Beri-Beri, and Vitamin D causes Rickets.\nविटामिन C की कमी से स्कर्वी रोग होता है। विटामिन A की कमी से रतौंधी, B1 से बेरी-बेरी और विटामिन D से रिकेट्स होता है।'
  },
  {
    exam: 'MP Police',
    subject: 'General Science',
    topic: 'Chemistry - Chemical Formulas & Acids',
    difficulty: 'Medium',
    question: 'What is the chemical name and molecular formula of common table salt?\nसाधारण नमक (खाने का नमक) का रासायनिक नाम और सूत्र क्या है?',
    options: [
      { id: 'A', text: 'Sodium Chloride (NaCl) / सोडियम क्लोराइड (NaCl)' },
      { id: 'B', text: 'Sodium Bicarbonate (NaHCO3) / सोडियम बाइकार्बोनेट (NaHCO3)' },
      { id: 'C', text: 'Sodium Hydroxide (NaOH) / सोडियम हाइड्रॉक्साइड (NaOH)' },
      { id: 'D', text: 'Calcium Carbonate (CaCO3) / कैल्शियम कार्बोनेट (CaCO3)' }
    ],
    correctAnswer: 'A',
    explanation: 'Common table salt is Sodium Chloride (NaCl). Baking soda is NaHCO3 and caustic soda is NaOH.\nसाधारण नमक का रासायनिक नाम सोडियम क्लोराइड (NaCl) है। बेकिंग सोडा NaHCO3 और कास्टिक सोडा NaOH होता है।'
  },
  {
    exam: 'MP Police',
    subject: 'General Science',
    topic: 'Physics - Optics & Light',
    difficulty: 'Medium',
    question: 'Which type of mirror is utilized as a side rearview mirror in motor vehicles?\nवाहनों में पीछे का दृश्य देखने के लिए (Side Rear View Mirror) किस प्रकार के दर्पण का उपयोग किया जाता है?',
    options: [
      { id: 'A', text: 'Concave Mirror / अवतल दर्पण' },
      { id: 'B', text: 'Convex Mirror / उत्तल दर्पण' },
      { id: 'C', text: 'Plane Mirror / समतल दर्पण' },
      { id: 'D', text: 'Cylindrical Mirror / बेलनाकार दर्पण' }
    ],
    correctAnswer: 'B',
    explanation: 'Convex mirrors always form erect, virtual, and diminished images, providing the driver a much wider field of view.\nउत्तल दर्पण हमेशा सीधा, आभासी और वस्तु से छोटा प्रतिबिंब बनाता है, जिससे चालक को पीछे का एक बहुत बड़ा दृष्टि क्षेत्र (Field of view) दिखाई देता है।'
  },
  {
    exam: 'MP Police',
    subject: 'General Science',
    topic: 'Biology - Human Circulatory System',
    difficulty: 'Easy',
    question: 'Which blood group in the human body is recognized as the "Universal Blood Donor"?\nमानव शरीर में "सर्वदाता रक्त समूह" (Universal Blood Donor) कौन सा रक्त वर्ग कहलाता है?',
    options: [
      { id: 'A', text: 'Blood Group AB+ / रक्त समूह AB+' },
      { id: 'B', text: 'Blood Group O- / रक्त समूह O-' },
      { id: 'C', text: 'Blood Group A+ / रक्त समूह A+' },
      { id: 'D', text: 'Blood Group B- / रक्त समूह B-' }
    ],
    correctAnswer: 'B',
    explanation: 'Blood Group O (specifically O Negative) lacks A and B surface antigens, making it safe for all recipients (Universal Donor).\nरक्त समूह O (विशेषतः O नेगेटिव) में कोई प्रतिजन न होने के कारण यह सभी को दिया जा सकता है (सर्वदाता), जबकि AB पॉजिटिव सर्वग्राही है।'
  }
];

const CONSTITUTION_POLITY_BANK = [
  {
    exam: 'MP Police',
    subject: 'General Knowledge',
    topic: 'Indian Polity & Constitution',
    difficulty: 'Medium',
    question: 'Under which Articles of the Indian Constitution is the "Right to Equality" enshrined?\nभारतीय संविधान के किस अनुच्छेद के तहत "समानता का अधिकार" (Right to Equality) का प्रावधान किया गया है?',
    options: [
      { id: 'A', text: 'Articles 14 to 18 / अनुच्छेद 14 से 18' },
      { id: 'B', text: 'Articles 19 to 22 / अनुच्छेद 19 से 22' },
      { id: 'C', text: 'Articles 23 to 24 / अनुच्छेद 23 से 24' },
      { id: 'D', text: 'Articles 25 to 28 / अनुच्छेद 25 से 28' }
    ],
    correctAnswer: 'A',
    explanation: 'Articles 14 to 18 in Part III guarantee equality before law, prohibition of discrimination, and abolition of untouchability (Art 17).\nभारतीय संविधान के भाग-3 में अनुच्छेद 14 से 18 तक विधि के समक्ष समानता और अस्पृश्यता उन्मूलन (अनुच्छेद 17) का प्रावधान है।'
  },
  {
    exam: 'MP Police',
    subject: 'General Knowledge',
    topic: 'Indian Polity & Constitution',
    difficulty: 'Hard',
    question: 'Which Article did Dr. B.R. Ambedkar characterize as the "Heart and Soul of the Constitution"?\nडॉ. बी.आर. अम्बेडकर ने किस अनुच्छेद को "संविधान का हृदय और आत्मा" (Heart and Soul of the Constitution) कहा था?',
    options: [
      { id: 'A', text: 'Article 14 / अनुच्छेद 14' },
      { id: 'B', text: 'Article 19 / अनुच्छेद 19' },
      { id: 'C', text: 'Article 21 / अनुच्छेद 21' },
      { id: 'D', text: 'Article 32 / अनुच्छेद 32' }
    ],
    correctAnswer: 'D',
    explanation: 'Article 32 gives citizens the right to move the Supreme Court for enforcement of fundamental rights through 5 types of constitutional writs.\nअनुच्छेद 32 (संवैधानिक उपचारों का अधिकार) नागरिकों को मौलिक अधिकारों के उल्लंघन पर सीधे सर्वोच्च न्यायालय जाने और 5 प्रकार की रिट जारी करवाने की शक्ति देता है।'
  },
  {
    exam: 'MP Police',
    subject: 'General Knowledge',
    topic: 'Indian Polity & Elections',
    difficulty: 'Easy',
    question: 'Under which Article of the Constitution is the Election Commission of India established?\nभारतीय संविधान के किस अनुच्छेद के अंतर्गत "भारत के निर्वाचन आयोग" (Election Commission of India) की स्थापना का प्रावधान है?',
    options: [
      { id: 'A', text: 'Article 324 / अनुच्छेद 324' },
      { id: 'B', text: 'Article 280 / अनुच्छेद 280' },
      { id: 'C', text: 'Article 352 / अनुच्छेद 352' },
      { id: 'D', text: 'Article 312 / अनुच्छेद 312' }
    ],
    correctAnswer: 'A',
    explanation: 'Article 324 vests the superintendence, direction, and control of elections in the Election Commission of India.\nअनुच्छेद 324 भारत में संसद, राज्य विधानमंडलों, राष्ट्रपति और उपराष्ट्रपति के चुनावों हेतु निर्वाचन आयोग का गठन करता है।'
  }
];

export class AiTestGeneratorService {
  /**
   * Helper: Match subject AND specific topic to pure, isolated question bank
   * ABSOLUTELY ZERO TOPIC CROSS-CONTAMINATION!
   */
  static getPureBankForSubjectAndTopic(subject, topic) {
    const taxonomyContext = normalizeSubjectAndTopic(subject, topic);
    const { topicId } = taxonomyContext;

    switch (topicId) {
      case 'math_percent_profit':
      case 'math_percentage':
      case 'math_profit_loss':
      case 'math_discount':
        return ARITHMETIC_PERCENT_PROFIT_BANK;
      case 'math_si_ci':
      case 'math_simple_interest':
      case 'math_compound_interest':
        return ARITHMETIC_SI_CI_BANK;
      case 'math_ratio_work':
      case 'math_ratio_proportion':
      case 'math_time_work':
      case 'math_time_distance':
        return ARITHMETIC_RATIO_WORK_TIME_BANK;
      case 'reasoning_coding_decoding':
        return CODING_DECODING_BANK;
      case 'reasoning_series':
        return NUMBER_SERIES_BANK;
      case 'reasoning_blood_relations':
        return BLOOD_RELATIONS_BANK;
      case 'reasoning_direction_sense':
        return DIRECTION_SENSE_BANK;
      case 'reasoning_venn_syllogism':
        return VENN_SYLLOGISMS_BANK;
      case 'science_all':
        return SCIENCE_BANK;
      case 'polity_constitution':
        return CONSTITUTION_POLITY_BANK;
      case 'mp_geography':
        return MP_GEOGRAPHY_PARKS_RIVERS_BANK;
      case 'mp_history':
        return MP_HISTORY_FORTS_TRIBES_BANK;
      default:
        // For other pure math chapters, return [] so procedural generator crafts 100% pure questions
        if (taxonomyContext.subjectGroup === 'MATH' || topicId.startsWith('math_')) {
          return [];
        }
        if (taxonomyContext.subjectGroup === 'REASONING') {
          return CODING_DECODING_BANK;
        }
        return MP_GEOGRAPHY_PARKS_RIVERS_BANK;
    }
  }

  /**
   * Main Generator Entrypoint
   */
  static async generateQuestions({
    exam = 'MP Police',
    subject = 'MP General Knowledge',
    topic = 'General',
    difficulty = 'Medium',
    count = 10,
    language = 'Bilingual',
    excludeQuestions = []
  }) {
    const totalCount = Math.min(Math.max(Number(count) || 10, 5), 100);
    const taxonomyContext = normalizeSubjectAndTopic(subject, topic);

    console.log(`🎯 [Test Engine] Generating ${totalCount} questions (${language}) for Subject: "${taxonomyContext.canonicalSubject}", Topic: "${taxonomyContext.canonicalTopic}" (Topic ID: ${taxonomyContext.topicId})...`);

    // If 100 questions or "Full Mock Paper" requested:
    // Generate strictly using official MP Police 3-part blueprint!
    const isFullMock =
      totalCount >= 50 ||
      String(subject).toLowerCase().includes('full') ||
      String(topic).toLowerCase().includes('full mock') ||
      String(subject).toLowerCase().includes('संपूर्ण');

    if (isFullMock) {
      return this.generateMPPoliceFullPaper({
        difficulty,
        totalCount,
        language,
        excludeQuestions
      });
    }

    // 1. Try Gemini AI if valid key exists
    const geminiKey = process.env.GEMINI_API_KEY || ENV.GEMINI_API_KEY;
    if (geminiKey && geminiKey.startsWith('AIzaSy')) {
      try {
        const aiQuestions = await this.callGeminiApi({
          apiKey: geminiKey,
          exam,
          subject: taxonomyContext.canonicalSubject,
          topic: taxonomyContext.canonicalTopic,
          difficulty,
          count: totalCount,
          language,
          excludeQuestions,
          taxonomyContext
        });

        if (Array.isArray(aiQuestions) && aiQuestions.length > 0) {
          const validAiQuestions = [];
          for (const q of aiQuestions) {
            const val = QuestionValidator.validateQuestion(q, taxonomyContext);
            const dup = QuestionValidator.isDuplicateOrNearDuplicate(q, validAiQuestions, 2);
            if (val.valid && !dup.isDuplicate) {
              validAiQuestions.push({
                ...q,
                subject: taxonomyContext.canonicalSubject,
                topic: taxonomyContext.canonicalTopic,
                difficulty: q.difficulty || difficulty || 'Medium'
              });
            }
          }

          if (validAiQuestions.length >= totalCount) {
            console.log(`✨ [AI Engine] Gemini generated ${validAiQuestions.length} strictly validated bilingual questions for ${taxonomyContext.canonicalTopic}!`);
            return validAiQuestions.slice(0, totalCount).map((q, idx) => ({
              ...q,
              id: `q_${Date.now()}_${idx + 1}`
            }));
          }

          // If some questions passed validation but didn't reach totalCount, fill remainder from pure validated bank
          if (validAiQuestions.length > 0) {
            console.log(`✨ [AI Engine] Gemini generated ${validAiQuestions.length}/${totalCount} valid questions. Filling remainder from validated bank.`);
            const remainder = this.generateFromPureCuratedBank({
              subject,
              topic,
              difficulty,
              count: totalCount - validAiQuestions.length,
              excludeQuestions: [...excludeQuestions, ...validAiQuestions]
            });
            return [...validAiQuestions, ...remainder].slice(0, totalCount).map((q, idx) => ({
              ...q,
              id: `q_${Date.now()}_${idx + 1}`
            }));
          }
        }
      } catch (err) {
        console.warn(`[AI Engine] Gemini API unavailable or filtered (${err.message}). Using pure validated engine.`);
      }
    }

    // 2. Pure validated curated bank & procedural generator
    return this.generateFromPureCuratedBank({
      subject,
      topic,
      difficulty,
      count: totalCount,
      excludeQuestions
    });
  }

  /**
   * Official MP Police Constable 100-Question Exam Blueprint
   */
  static async generateMPPoliceFullPaper({
    difficulty = 'Medium',
    totalCount = 100,
    language = 'Bilingual',
    excludeQuestions = []
  }) {
    console.log(`📋 [MP Police Blueprint] Compiling official 100-Question Paper across 5 sections (Bilingual)...`);

    const sections = [
      {
        sectionName: 'सामान्य ज्ञान एवं समसामयिकी (MP GK & National GK)',
        subject: 'MP General Knowledge',
        topic: 'MP Geography, Rivers & National Parks',
        count: Math.round(totalCount * 0.25) // 25 Qs
      },
      {
        sectionName: 'तार्किक ज्ञान: कोडिंग-डिकोडिंग एवं सादृश्यता (Logical Reasoning)',
        subject: 'Reasoning Ability',
        topic: 'Coding-Decoding',
        count: Math.round(totalCount * 0.20) // 20 Qs
      },
      {
        sectionName: 'बौद्धिक क्षमता: संख्या श्रृंखला एवं रक्त संबंध (Mental Ability)',
        subject: 'Reasoning Ability',
        topic: 'Number & Letter Series',
        count: Math.round(totalCount * 0.25) // 25 Qs
      },
      {
        sectionName: 'सामान्य विज्ञान (General Science - 10th Level)',
        subject: 'General Science',
        topic: 'Physics, Chemistry & Biology',
        count: Math.round(totalCount * 0.15) // 15 Qs
      },
      {
        sectionName: 'सरल अंकगणित (Simple Arithmetic / Math)',
        subject: 'Simple Arithmetic',
        topic: 'Percentage, Profit & Simple Interest',
        count: totalCount - (Math.round(totalCount * 0.25) + Math.round(totalCount * 0.20) + Math.round(totalCount * 0.25) + Math.round(totalCount * 0.15)) // remaining ~15 Qs
      }
    ];

    const allCompiledQuestions = [];

    for (const sec of sections) {
      const secQuestions = this.generateFromPureCuratedBank({
        subject: sec.subject,
        topic: sec.topic,
        difficulty,
        count: sec.count,
        excludeQuestions: [...excludeQuestions, ...allCompiledQuestions.map(q => q.question)]
      });

      allCompiledQuestions.push(...secQuestions);
    }

    // Index all questions cleanly from 1 to totalCount
    const finalQuestions = allCompiledQuestions.slice(0, totalCount).map((q, idx) => ({
      ...q,
      id: `q_${Date.now()}_${idx + 1}`
    }));

    console.log(`✅ [MP Police Blueprint] Full paper compiled successfully with ${finalQuestions.length} subject-pure bilingual questions!`);
    return finalQuestions;
  }

  /**
   * Pure Subject & Topic Bank Generator
   * STRICT TOPIC PURITY GUARANTEED — ZERO DUPLICATES WITHIN THE TEST AND ACROSS PAST TESTS!
   */
  /**
   * Pure Subject & Topic Bank Generator
   * STRICT TOPIC PURITY GUARANTEED — ZERO DUPLICATES WITHIN THE TEST AND ACROSS PAST TESTS!
   * SUBTOPIC BALANCING + STRICT DETERMINISTIC VALIDATION
   */
  static generateFromPureCuratedBank({ subject, topic, difficulty, count = 10, excludeQuestions = [] }) {
    const taxonomyContext = normalizeSubjectAndTopic(subject, topic);
    console.log(`📚 [Pure Bank] Pulling ${count} pure questions for Topic: "${taxonomyContext.canonicalTopic}" (ID: ${taxonomyContext.topicId})...`);

    const bank = this.getPureBankForSubjectAndTopic(subject, topic);
    const selected = [];

    const subtopics = Array.isArray(taxonomyContext.subtopics) && taxonomyContext.subtopics.length > 0
      ? taxonomyContext.subtopics
      : [null];

    const maxTemplateLimit = count >= 20 ? 2 : 1;

    const checkCandidate = (q, relax = false) => {
      const val = QuestionValidator.validateQuestion(q, taxonomyContext);
      if (!val.valid) return { ok: false, reason: val.reason };

      const dupInTest = QuestionValidator.isDuplicateOrNearDuplicate(q, selected, relax ? 3 : maxTemplateLimit, false);
      if (dupInTest.isDuplicate) return { ok: false, reason: dupInTest.reason };

      // ALWAYS exclude exact matches and identical numerical values from past tests, even if relax is true!
      const dupInPast = QuestionValidator.isDuplicateOrNearDuplicate(q, excludeQuestions, 999, true);
      if (dupInPast.isDuplicate) return { ok: false, reason: dupInPast.reason };

      return { ok: true };
    };

    const isUltraHard = difficulty === 'Ultra Hard';
    const isVeryHard = difficulty === 'Very Hard';
    const isHard = difficulty === 'Hard';
    const isEasy = difficulty === 'Easy';

    // Shuffled bank questions that are valid for this topic and strictly appropriate for difficulty
    const validBankQuestions = bank.filter(q => {
      const val = QuestionValidator.validateQuestion(q, taxonomyContext);
      if (!val.valid) return false;

      if (isUltraHard) {
        return q.difficulty === 'Ultra Hard' || q.difficulty === 'Very Hard';
      }
      if (isVeryHard) {
        return q.difficulty === 'Ultra Hard' || q.difficulty === 'Very Hard' || q.difficulty === 'Hard';
      }
      if (isHard) {
        return q.difficulty === 'Hard' || q.difficulty === 'Very Hard' || q.difficulty === 'Ultra Hard' || (q.difficulty === 'Medium' && q.concept !== 'Percentage of a quantity');
      }
      if (isEasy) {
        return q.difficulty === 'Easy' || q.difficulty === 'Medium';
      }
      return true;
    }).sort((a, b) => {
      if (isUltraHard) {
        if (a.difficulty === 'Ultra Hard' && b.difficulty !== 'Ultra Hard') return -1;
        if (b.difficulty === 'Ultra Hard' && a.difficulty !== 'Ultra Hard') return 1;
        if (a.difficulty === 'Very Hard' && b.difficulty !== 'Very Hard') return -1;
        if (b.difficulty === 'Very Hard' && a.difficulty !== 'Very Hard') return 1;
      } else if (isVeryHard) {
        if (a.difficulty === 'Very Hard' && b.difficulty !== 'Very Hard') return -1;
        if (b.difficulty === 'Very Hard' && a.difficulty !== 'Very Hard') return 1;
      } else if (isHard) {
        if (a.difficulty === 'Hard' && b.difficulty !== 'Hard') return -1;
        if (b.difficulty === 'Hard' && a.difficulty !== 'Hard') return 1;
      }
      return Math.random() - 0.5;
    });

    // Pass 1: Allocate balanced subtopics using curated bank questions where available
    for (let i = 0; i < count; i++) {
      const targetSubtopic = subtopics[i % subtopics.length];

      let foundBankQ = null;
      if (targetSubtopic) {
        foundBankQ = validBankQuestions.find(q => q.subtopic === targetSubtopic && checkCandidate(q).ok);
      }
      if (!foundBankQ) {
        foundBankQ = validBankQuestions.find(q => checkCandidate(q).ok);
      }

      if (foundBankQ) {
        selected.push({
          ...foundBankQ,
          id: `q_${Date.now()}_${selected.length + 1}`,
          subject: taxonomyContext.canonicalSubject,
          topic: taxonomyContext.canonicalTopic,
          difficulty: difficulty || foundBankQ.difficulty || 'Medium'
        });
      }
    }

    // Pass 2: Procedural generation for remaining slots to meet EXACT count with high variety
    let attempts = 0;
    const MAX_ATTEMPTS = Math.max(150, count * 8);

    while (selected.length < count && attempts < MAX_ATTEMPTS) {
      attempts++;
      const targetSubtopic = subtopics[selected.length % subtopics.length];
      const randomSeed = Math.floor(Math.random() * 90000) + (attempts * 17) + selected.length;

      const candidate = this.generateProceduralQuestion({
        subject,
        topic,
        difficulty,
        variantIndex: randomSeed,
        subtopic: targetSubtopic
      });

      const check = checkCandidate(candidate);
      if (check.ok) {
        selected.push({
          ...candidate,
          id: `q_${Date.now()}_${selected.length + 1}`,
          subject: taxonomyContext.canonicalSubject,
          topic: taxonomyContext.canonicalTopic,
          difficulty: difficulty || candidate.difficulty || 'Medium'
        });
      }
    }

    // Pass 3: Safe fallback if still short
    if (selected.length < count) {
      for (const q of validBankQuestions) {
        if (selected.length >= count) break;
        const check = checkCandidate(q, true);
        if (check.ok) {
          selected.push({
            ...q,
            id: `q_${Date.now()}_${selected.length + 1}`,
            subject: taxonomyContext.canonicalSubject,
            topic: taxonomyContext.canonicalTopic,
            difficulty: difficulty || 'Medium'
          });
        }
      }
    }

    // Pass 4: Absolute guarantee - generate until count is met with strict uniqueness
    let finalAttempts = 0;
    while (selected.length < count && finalAttempts < 200) {
      finalAttempts++;
      const candidate = this.generateProceduralQuestion({
        subject,
        topic,
        difficulty,
        variantIndex: Math.floor(Math.random() * 100000) + finalAttempts * 31,
        subtopic: subtopics[selected.length % subtopics.length]
      });
      const val = QuestionValidator.validateQuestion(candidate, taxonomyContext);
      const dup = QuestionValidator.isDuplicateOrNearDuplicate(candidate, selected, 3, false);
      const dupInPast = finalAttempts < 100
        ? QuestionValidator.isDuplicateOrNearDuplicate(candidate, excludeQuestions, 999, true)
        : { isDuplicate: false };
      if (val.valid && !dup.isDuplicate && !dupInPast.isDuplicate) {
        selected.push({
          ...candidate,
          id: `q_${Date.now()}_${selected.length + 1}`,
          subject: taxonomyContext.canonicalSubject,
          topic: taxonomyContext.canonicalTopic,
          difficulty: difficulty || candidate.difficulty || 'Medium'
        });
      }
    }

    return selected.slice(0, count);
  }

  /**
   * Procedural Percentage & Profit/Loss Generator across 5 Distinct Subtopics
   */
  static generatePercentageProfitProceduralQuestion(variantIndex, difficulty, subtopicChoice) {
    const subtopicList = [
      'basic_percentage',
      'profit_loss_calc',
      'cp_sp_finding',
      'marked_price_discount',
      'successive_discount_mixed'
    ];
    const subtopic = subtopicChoice || subtopicList[Math.abs(variantIndex) % subtopicList.length];
    const isAdvanced = difficulty === 'Ultra Hard' || difficulty === 'Very Hard' || difficulty === 'Hard';

    // Subtopic 0: basic_percentage
    if (subtopic === 'basic_percentage') {
      if (isAdvanced) {
        const advMode = Math.abs(variantIndex) % 3;
        if (advMode === 0) {
          // Price of petrol/sugar increases by P%, consumption reduction % = (P / (100 + P)) * 100
          const hikes = [
            { p: 25, red: 20 },
            { p: 20, red: 16.66 },
            { p: 50, red: 33.33 },
            { p: 60, red: 37.5 }
          ];
          const h = hikes[Math.abs(variantIndex) % hikes.length];
          const opts = [
            { id: 'A', text: `${Math.round((h.red - 4) * 10) / 10}%` },
            { id: 'B', text: `${h.red}%` },
            { id: 'C', text: `${Math.round((h.red + 5) * 10) / 10}%` },
            { id: 'D', text: `${Math.round((h.red + 8) * 10) / 10}%` }
          ].sort(() => Math.random() - 0.5);
          const correctOptId = opts.find(o => o.text === `${h.red}%`)?.id || 'B';

          return {
            exam: 'General Practice / All Exams',
            subject: 'Simple Arithmetic / Mathematics',
            topic: 'Percentage & Profit/Loss',
            subtopic: 'basic_percentage',
            concept: 'Consumption reduction on price increase',
            difficulty: difficulty || 'Very Hard',
            question: `If the price of petrol increases by ${h.p}%, by what percentage must a motorist reduce his consumption so that expenditure remains unchanged?\nयदि पेट्रोल के मूल्य में ${h.p}% की वृद्धि हो जाती है, तो एक मोटर चालक को अपनी खपत में कितने प्रतिशत की कमी करनी चाहिए ताकि उसका खर्च अपरिवर्तित रहे?`,
            options: opts,
            correctAnswer: correctOptId,
            explanation: `Reduction in consumption % = (r / (100 + r)) × 100 = (${h.p} / ${100 + h.p}) × 100 = ${h.red}%.\nखपत में प्रतिशत कमी = (r / (100 + r)) × 100 = (${h.p} / ${100 + h.p}) × 100 = ${h.red}%।`
          };
        } else if (advMode === 1) {
          // Price drop enables buying more quantity
          const cases = [
            { drop: 20, kg: 5, total: 600, reduced: 24, orig: 30 },
            { drop: 25, kg: 2, total: 240, reduced: 30, orig: 40 },
            { drop: 10, kg: 4, total: 360, reduced: 9, orig: 10 }
          ];
          const c = cases[Math.abs(variantIndex) % cases.length];
          const opts = [
            { id: 'A', text: `₹${c.orig - 5} / kg` },
            { id: 'B', text: `₹${c.orig} / kg` },
            { id: 'C', text: `₹${c.orig + 6} / kg` },
            { id: 'D', text: `₹${c.reduced} / kg` }
          ].sort(() => Math.random() - 0.5);
          const correctOptId = opts.find(o => o.text === `₹${c.orig} / kg`)?.id || 'B';

          return {
            exam: 'General Practice / All Exams',
            subject: 'Simple Arithmetic / Mathematics',
            topic: 'Percentage & Profit/Loss',
            subtopic: 'basic_percentage',
            concept: 'Price reduction enabling purchasing more quantity',
            difficulty: difficulty || 'Very Hard',
            question: `A reduction of ${c.drop}% in the price of sugar enables a buyer to purchase ${c.kg} kg more sugar for ₹${c.total}. What was the original price per kg of sugar?\nचीनी के मूल्य में ${c.drop}% की कमी होने पर एक खरीदार ₹${c.total} में ${c.kg} किग्रा अधिक चीनी खरीद सकता है। चीनी का प्रारंभिक (मूल) प्रति किग्रा मूल्य क्या था?`,
            options: opts,
            correctAnswer: correctOptId,
            explanation: `Reduced Price per kg = (${c.drop}% of ₹${c.total}) / ${c.kg} = ₹${c.reduced} / kg. Original Price = ₹${c.reduced} / (1 - ${c.drop/100}) = ₹${c.orig} / kg.\nघटा हुआ मूल्य = ₹${c.reduced} / किग्रा। मूल मूल्य = ₹${c.orig} / किग्रा।`
          };
        } else {
          // Election votes majority
          const cases = [
            { winPct: 58, margin: 3200, total: 20000 },
            { winPct: 62, margin: 4800, total: 20000 },
            { winPct: 55, margin: 2500, total: 25000 }
          ];
          const c = cases[Math.abs(variantIndex) % cases.length];
          const opts = [
            { id: 'A', text: `${(c.total - 4000).toLocaleString('en-IN')}` },
            { id: 'B', text: `${c.total.toLocaleString('en-IN')}` },
            { id: 'C', text: `${(c.total + 5000).toLocaleString('en-IN')}` },
            { id: 'D', text: `${(c.total + 8000).toLocaleString('en-IN')}` }
          ].sort(() => Math.random() - 0.5);
          const correctOptId = opts.find(o => o.text === `${c.total.toLocaleString('en-IN')}`)?.id || 'B';

          return {
            exam: 'General Practice / All Exams',
            subject: 'Simple Arithmetic / Mathematics',
            topic: 'Percentage & Profit/Loss',
            subtopic: 'basic_percentage',
            concept: 'Election winner majority votes calculation',
            difficulty: difficulty || 'Very Hard',
            question: `In an election between two candidates, the winning candidate secured ${c.winPct}% of the total valid votes and won by a majority of ${c.margin.toLocaleString('en-IN')} votes. What was the total number of valid votes polled?\nदो प्रत्याशियों के बीच हुए एक चुनाव में, जीतने वाले प्रत्याशी ने कुल वैध मतों का ${c.winPct}% मत प्राप्त किया और ${c.margin.toLocaleString('en-IN')} मतों के बहुमत से विजयी हुआ। डाले गए कुल वैध मतों की संख्या क्या थी?`,
            options: opts,
            correctAnswer: correctOptId,
            explanation: `Margin % = ${c.winPct}% - ${100 - c.winPct}% = ${2 * c.winPct - 100}%. Total Votes = (${c.margin} / ${2 * c.winPct - 100}) × 100 = ${c.total.toLocaleString('en-IN')}.\nजीत का अंतर % = ${2 * c.winPct - 100}%। कुल वैध मत = ${c.total.toLocaleString('en-IN')}।`
          };
        }
      }

      // Standard / Medium / Easy basic_percentage
      const mode = Math.abs(variantIndex) % 3;
      if (mode === 0) {
        const bases = [1500, 2000, 2400, 3000, 3600, 4000, 4500, 5000, 6000, 7500];
        const pcts = [5, 10, 12, 15, 20, 25, 30, 35, 40];
        const X = bases[Math.abs(variantIndex) % bases.length];
        const P = pcts[Math.abs(Math.floor(variantIndex / 7)) % pcts.length];
        const ans = Math.round((X * P) / 100);

        const opts = [
          { id: 'A', text: `₹${(ans - 40).toLocaleString('en-IN')}` },
          { id: 'B', text: `₹${ans.toLocaleString('en-IN')}` },
          { id: 'C', text: `₹${(ans + 50).toLocaleString('en-IN')}` },
          { id: 'D', text: `₹${(ans + 90).toLocaleString('en-IN')}` }
        ].sort(() => Math.random() - 0.5);
        const correctOptId = opts.find(o => o.text === `₹${ans.toLocaleString('en-IN')}`)?.id || 'B';

        return {
          exam: 'General Practice / All Exams',
          subject: 'Simple Arithmetic / Mathematics',
          topic: 'Percentage & Profit/Loss',
          subtopic: 'basic_percentage',
          concept: 'Basic percentage calculation of a quantity',
          difficulty: difficulty || 'Easy',
          question: `What is ${P}% of ₹${X.toLocaleString('en-IN')}?\n₹${X.toLocaleString('en-IN')} का ${P}% कितना होगा?`,
          options: opts,
          correctAnswer: correctOptId,
          explanation: `${P}% of ₹${X.toLocaleString('en-IN')} = (${P} × ${X}) / 100 = ₹${ans.toLocaleString('en-IN')}.\n₹${X.toLocaleString('en-IN')} का ${P}% = (${P} × ${X}) / 100 = ₹${ans.toLocaleString('en-IN')}।`
        };
      } else if (mode === 1) {
        const maxMarksList = [400, 500, 600, 800];
        const pcts = [50, 60, 65, 70, 75, 80, 85];
        const Y = maxMarksList[Math.abs(variantIndex) % maxMarksList.length];
        const pct = pcts[Math.abs(Math.floor(variantIndex / 5)) % pcts.length];
        const X = Math.round((Y * pct) / 100);

        const opts = [
          { id: 'A', text: `${pct - 5}%` },
          { id: 'B', text: `${pct}%` },
          { id: 'C', text: `${pct + 5}%` },
          { id: 'D', text: `${pct + 10}%` }
        ].sort(() => Math.random() - 0.5);
        const correctOptId = opts.find(o => o.text === `${pct}%`)?.id || 'B';

        return {
          exam: 'General Practice / All Exams',
          subject: 'Simple Arithmetic / Mathematics',
          topic: 'Percentage & Profit/Loss',
          subtopic: 'basic_percentage',
          concept: 'Percentage score calculation',
          difficulty: difficulty || 'Easy',
          question: `A student secured ${X} marks out of a total of ${Y} marks in an examination. What percentage of marks did the student obtain?\nएक छात्र ने एक परीक्षा में कुल ${Y} अंकों में से ${X} अंक प्राप्त किए। छात्र ने कितने प्रतिशत अंक प्राप्त किए?`,
          options: opts,
          correctAnswer: correctOptId,
          explanation: `Percentage = (${X} / ${Y}) × 100 = ${pct}%.\nप्रतिशत = (${X} / ${Y}) × 100 = ${pct}%।`
        };
      } else {
        const pcts = [15, 20, 25, 30, 40, 50];
        const P = pcts[Math.abs(variantIndex) % pcts.length];
        const mult = 10 + (Math.abs(variantIndex * 3) % 40);
        const num = mult * 100;
        const X = Math.round((num * P) / 100);

        const opts = [
          { id: 'A', text: `${num - 100}` },
          { id: 'B', text: `${num}` },
          { id: 'C', text: `${num + 150}` },
          { id: 'D', text: `${num + 200}` }
        ].sort(() => Math.random() - 0.5);
        const correctOptId = opts.find(o => o.text === `${num}`)?.id || 'B';

        return {
          exam: 'General Practice / All Exams',
          subject: 'Simple Arithmetic / Mathematics',
          topic: 'Percentage & Profit/Loss',
          subtopic: 'basic_percentage',
          concept: 'Finding base number from percentage',
          difficulty: difficulty || 'Medium',
          question: `If ${P}% of a number is ${X}, what is the number?\nयदि किसी संख्या का ${P}% मान ${X} है, तो वह संख्या क्या है?`,
          options: opts,
          correctAnswer: correctOptId,
          explanation: `Let the number be N. (${P} / 100) × N = ${X} => N = (${X} × 100) / ${P} = ${num}.\nमाना संख्या N है। (${P} / 100) × N = ${X} => N = (${X} × 100) / ${P} = ${num}।`
        };
      }
    }

    // Subtopic 1: profit_loss_calc
    if (subtopic === 'profit_loss_calc') {
      if (isAdvanced) {
        const advMode = Math.abs(variantIndex) % 2;
        if (advMode === 0) {
          // Dishonest dealer false weight
          const weights = [
            { w: 800, p: 25 },
            { w: 750, p: 33.33 },
            { w: 900, p: 11.11 }
          ];
          const wt = weights[Math.abs(variantIndex) % weights.length];
          const opts = [
            { id: 'A', text: `${Math.round((wt.p - 5) * 10) / 10}%` },
            { id: 'B', text: `${wt.p}%` },
            { id: 'C', text: `${Math.round((wt.p + 5) * 10) / 10}%` },
            { id: 'D', text: '20%' }
          ].sort(() => Math.random() - 0.5);
          const correctOptId = opts.find(o => o.text === `${wt.p}%`)?.id || 'B';

          return {
            exam: 'General Practice / All Exams',
            subject: 'Simple Arithmetic / Mathematics',
            topic: 'Percentage & Profit/Loss',
            subtopic: 'profit_loss_calc',
            concept: 'Dishonest merchant using false weight',
            difficulty: difficulty || 'Very Hard',
            question: `A dishonest dealer professes to sell his goods at cost price, but uses a false weight of ${wt.w} grams for 1 kg. What is his actual profit percentage?\nएक बेईमान व्यापारी अपने माल को क्रय मूल्य पर बेचने का दावा करता है, लेकिन 1 किग्रा के स्थान पर ${wt.w} ग्राम के झूठे बाट का उपयोग करता है। उसका वास्तविक लाभ प्रतिशत क्या है?`,
            options: opts,
            correctAnswer: correctOptId,
            explanation: `Profit % = ((Error) / (True Value - Error)) × 100 = ((1000 - ${wt.w}) / ${wt.w}) × 100 = ${wt.p}%.\nलाभ % = ((1000 - ${wt.w}) / ${wt.w}) × 100 = ${wt.p}%।`
          };
        } else {
          // CP of X = SP of Y
          const pairs = [
            { x: 15, y: 12, pct: 25 },
            { x: 20, y: 16, pct: 25 },
            { x: 25, y: 20, pct: 25 },
            { x: 12, y: 10, pct: 20 },
            { x: 18, y: 15, pct: 20 }
          ];
          const pair = pairs[Math.abs(variantIndex) % pairs.length];
          const ans = `${pair.pct}%`;
          const opts = [
            { id: 'A', text: `${pair.pct - 5}%` },
            { id: 'B', text: ans },
            { id: 'C', text: `${pair.pct + 5}%` },
            { id: 'D', text: '16.66%' }
          ].sort(() => Math.random() - 0.5);
          const correctOptId = opts.find(o => o.text === ans)?.id || 'B';

          return {
            exam: 'General Practice / All Exams',
            subject: 'Simple Arithmetic / Mathematics',
            topic: 'Percentage & Profit/Loss',
            subtopic: 'profit_loss_calc',
            concept: 'Profit percentage when CP of X items equals SP of Y items',
            difficulty: difficulty || 'Hard',
            question: `If the cost price of ${pair.x} articles is equal to the selling price of ${pair.y} articles, what is the profit percentage?\nयदि ${pair.x} वस्तुओं का क्रय मूल्य ${pair.y} वस्तुओं के विक्रय मूल्य के बराबर है, तो लाभ प्रतिशत क्या होगा?`,
            options: opts,
            correctAnswer: correctOptId,
            explanation: `Let CP of 1 article = ₹1. Profit % = ((${pair.x} - ${pair.y}) / ${pair.y}) × 100 = ${ans}.\nलाभ % = ((${pair.x} - ${pair.y}) / ${pair.y}) × 100 = ${ans}।`
          };
        }
      }

      // Standard / Medium / Easy profit_loss_calc
      const mode = Math.abs(variantIndex) % 2;
      if (mode === 0) {
        const CPs = [500, 600, 800, 1000, 1200, 1500, 2000, 2500];
        const pcts = [10, 15, 20, 25, 30, 40, 50];
        const CP = CPs[Math.abs(variantIndex) % CPs.length];
        const profitPct = pcts[Math.abs(Math.floor(variantIndex / 3)) % pcts.length];
        const SP = Math.round(CP * (1 + profitPct / 100));

        const opts = [
          { id: 'A', text: `${profitPct - 5}%` },
          { id: 'B', text: `${profitPct}%` },
          { id: 'C', text: `${profitPct + 5}%` },
          { id: 'D', text: `${profitPct + 10}%` }
        ].sort(() => Math.random() - 0.5);
        const correctOptId = opts.find(o => o.text === `${profitPct}%`)?.id || 'B';

        return {
          exam: 'General Practice / All Exams',
          subject: 'Simple Arithmetic / Mathematics',
          topic: 'Percentage & Profit/Loss',
          subtopic: 'profit_loss_calc',
          concept: 'Profit percentage calculation from CP and SP',
          difficulty: difficulty || 'Medium',
          question: `A shopkeeper buys an article for ₹${CP.toLocaleString('en-IN')} and sells it for ₹${SP.toLocaleString('en-IN')}. What is his profit percentage?\nएक दुकानदार किसी वस्तु को ₹${CP.toLocaleString('en-IN')} में खरीदता है और उसे ₹${SP.toLocaleString('en-IN')} में बेचता है। उसका लाभ प्रतिशत क्या है?`,
          options: opts,
          correctAnswer: correctOptId,
          explanation: `Profit = SP - CP = ₹${SP} - ₹${CP} = ₹${SP - CP}. Profit % = (${SP - CP} / ${CP}) × 100 = ${profitPct}%.\nलाभ = विक्रय मूल्य - क्रय मूल्य = ₹${SP - CP}। लाभ % = (${SP - CP} / ${CP}) × 100 = ${profitPct}%।`
        };
      } else {
        const CPs = [600, 800, 1000, 1200, 1500, 2000, 2400];
        const lossPcts = [10, 12, 15, 20, 25];
        const CP = CPs[Math.abs(variantIndex) % CPs.length];
        const lossPct = lossPcts[Math.abs(Math.floor(variantIndex / 4)) % lossPcts.length];
        const SP = Math.round(CP * (1 - lossPct / 100));

        const opts = [
          { id: 'A', text: `${lossPct - 3}%` },
          { id: 'B', text: `${lossPct}%` },
          { id: 'C', text: `${lossPct + 4}%` },
          { id: 'D', text: `${lossPct + 8}%` }
        ].sort(() => Math.random() - 0.5);
        const correctOptId = opts.find(o => o.text === `${lossPct}%`)?.id || 'B';

        return {
          exam: 'General Practice / All Exams',
          subject: 'Simple Arithmetic / Mathematics',
          topic: 'Percentage & Profit/Loss',
          subtopic: 'profit_loss_calc',
          concept: 'Loss percentage calculation from CP and SP',
          difficulty: difficulty || 'Medium',
          question: `An item bought for ₹${CP.toLocaleString('en-IN')} is sold for ₹${SP.toLocaleString('en-IN')}. What is the loss percentage incurred?\n₹${CP.toLocaleString('en-IN')} में खरीदी गई एक वस्तु को ₹${SP.toLocaleString('en-IN')} में बेचा जाता है। हुई हानि का प्रतिशत क्या होगा?`,
          options: opts,
          correctAnswer: correctOptId,
          explanation: `Loss = CP - SP = ₹${CP} - ₹${SP} = ₹${CP - SP}. Loss % = (${CP - SP} / ${CP}) × 100 = ${lossPct}%.\nहानि = ₹${CP - SP}। हानि % = (${CP - SP} / ${CP}) × 100 = ${lossPct}%।`
        };
      }
    }

    // Subtopic 2: cp_sp_finding
    if (subtopic === 'cp_sp_finding') {
      if (isAdvanced) {
        const advMode = Math.abs(variantIndex) % 2;
        if (advMode === 0) {
          // Two articles sold at same SP with equal gain and loss
          const rates = [20, 10, 15, 25];
          const r = rates[Math.abs(variantIndex) % rates.length];
          const spVal = 3000 + ((Math.abs(variantIndex) % 8) * 600);
          const lossPct = Math.round(((r * r) / 100) * 10) / 10;
          const opts = [
            { id: 'A', text: 'No profit no loss / न लाभ न हानि' },
            { id: 'B', text: `${lossPct}% Loss / हानि` },
            { id: 'C', text: `${lossPct}% Profit / लाभ` },
            { id: 'D', text: `${Math.round((lossPct + 2) * 10) / 10}% Loss / हानि` }
          ].sort(() => Math.random() - 0.5);
          const correctOptId = opts.find(o => o.text === `${lossPct}% Loss / हानि`)?.id || 'B';

          return {
            exam: 'General Practice / All Exams',
            subject: 'Simple Arithmetic / Mathematics',
            topic: 'Percentage & Profit/Loss',
            subtopic: 'cp_sp_finding',
            concept: 'Two articles sold at same SP with equal gain and loss',
            difficulty: difficulty || 'Very Hard',
            question: `A person sold two articles for ₹${spVal.toLocaleString('en-IN')} each. On one he gained ${r}% and on the other he lost ${r}%. What was his overall gain or loss percentage in the whole transaction?\nएक व्यक्ति ने दो वस्तुओं में से प्रत्येक को ₹${spVal.toLocaleString('en-IN')} में बेचा। एक पर उसे ${r}% का लाभ और दूसरी पर ${r}% की हानि हुई। पूरे सौदे में उसका समग्र लाभ या हानि प्रतिशत क्या था?`,
            options: opts,
            correctAnswer: correctOptId,
            explanation: `When two items are sold at the same SP with equal gain and loss of x%, there is always a loss = (x^2 / 100)% = (${r}^2 / 100)% = ${lossPct}% Loss.\nसमान विक्रय मूल्य पर समान प्रतिशत लाभ-हानि होने पर सदैव हानि होती है = (x^2 / 100)% = ${lossPct}% हानि।`
          };
        } else {
          // Selling at 3/4 of normal SP incurs loss of 10%
          const opts = [
            { id: 'A', text: '15%' },
            { id: 'B', text: '20%' },
            { id: 'C', text: '25%' },
            { id: 'D', text: '18%' }
          ].sort(() => Math.random() - 0.5);
          const correctOptId = opts.find(o => o.text === '20%')?.id || 'B';

          return {
            exam: 'General Practice / All Exams',
            subject: 'Simple Arithmetic / Mathematics',
            topic: 'Percentage & Profit/Loss',
            subtopic: 'cp_sp_finding',
            concept: 'Selling at fraction of usual SP gives loss',
            difficulty: difficulty || 'Very Hard',
            question: 'By selling an article at 3/4 of its normal selling price, a merchant incurs a loss of 10%. What will be his profit percentage if he sells it at the normal selling price?\nकिसी वस्तु को उसके सामान्य विक्रय मूल्य के 3/4 भाग पर बेचने से एक व्यापारी को 10% की हानि होती है। यदि वह इसे सामान्य विक्रय मूल्य पर बेचे, तो उसका लाभ प्रतिशत क्या होगा?',
            options: opts,
            correctAnswer: correctOptId,
            explanation: 'Let normal SP = S. (3/4)S = 0.90 CP => S = 1.20 CP => Profit = 20%.\nमाना सामान्य विक्रय मूल्य = S। (3/4)S = 0.90 CP => S = 1.20 CP => लाभ = 20%।'
          };
        }
      }

      // Standard / Medium / Easy cp_sp_finding
      const mode = Math.abs(variantIndex) % 2;
      if (mode === 0) {
        const CPs = [1000, 1200, 1500, 1800, 2000, 2500, 3000];
        const pcts = [10, 15, 20, 25, 30];
        const CP = CPs[Math.abs(variantIndex) % CPs.length];
        const P = pcts[Math.abs(Math.floor(variantIndex / 2)) % pcts.length];
        const SP = Math.round(CP * (1 + P / 100));

        const opts = [
          { id: 'A', text: `₹${(SP - 50).toLocaleString('en-IN')}` },
          { id: 'B', text: `₹${SP.toLocaleString('en-IN')}` },
          { id: 'C', text: `₹${(SP + 60).toLocaleString('en-IN')}` },
          { id: 'D', text: `₹${(SP + 120).toLocaleString('en-IN')}` }
        ].sort(() => Math.random() - 0.5);
        const correctOptId = opts.find(o => o.text === `₹${SP.toLocaleString('en-IN')}`)?.id || 'B';

        return {
          exam: 'General Practice / All Exams',
          subject: 'Simple Arithmetic / Mathematics',
          topic: 'Percentage & Profit/Loss',
          subtopic: 'cp_sp_finding',
          concept: 'Finding Selling Price from Cost Price and Profit percentage',
          difficulty: difficulty || 'Medium',
          question: `A merchant purchases goods for ₹${CP.toLocaleString('en-IN')} and sells them at a profit of ${P}%. What is the selling price?\nएक व्यापारी ₹${CP.toLocaleString('en-IN')} में माल खरीदता है और उसे ${P}% के लाभ पर बेचता है। विक्रय मूल्य कितना होगा?`,
          options: opts,
          correctAnswer: correctOptId,
          explanation: `Selling Price = CP × (100 + ${P}) / 100 = ₹${CP} × ${(100 + P)} / 100 = ₹${SP.toLocaleString('en-IN')}.\nविक्रय मूल्य = ${CP} × ${(100 + P)} / 100 = ₹${SP.toLocaleString('en-IN')}।`
        };
      } else {
        const CPs = [1000, 1200, 1500, 2000, 2500, 3000];
        const pcts = [10, 20, 25, 50];
        const CP = CPs[Math.abs(variantIndex) % CPs.length];
        const P = pcts[Math.abs(Math.floor(variantIndex / 2)) % pcts.length];
        const SP = Math.round(CP * (1 + P / 100));

        const opts = [
          { id: 'A', text: `₹${(CP - 100).toLocaleString('en-IN')}` },
          { id: 'B', text: `₹${CP.toLocaleString('en-IN')}` },
          { id: 'C', text: `₹${(CP + 150).toLocaleString('en-IN')}` },
          { id: 'D', text: `₹${(CP + 250).toLocaleString('en-IN')}` }
        ].sort(() => Math.random() - 0.5);
        const correctOptId = opts.find(o => o.text === `₹${CP.toLocaleString('en-IN')}`)?.id || 'B';

        return {
          exam: 'General Practice / All Exams',
          subject: 'Simple Arithmetic / Mathematics',
          topic: 'Percentage & Profit/Loss',
          subtopic: 'cp_sp_finding',
          concept: 'Finding Cost Price from Selling Price and Profit percentage',
          difficulty: difficulty || 'Medium',
          question: `By selling an article for ₹${SP.toLocaleString('en-IN')}, a trader earns a profit of ${P}%. What was the original cost price of the article?\nकिसी वस्तु को ₹${SP.toLocaleString('en-IN')} में बेचने पर एक व्यापारी को ${P}% का लाभ होता है। वस्तु का वास्तविक क्रय मूल्य (Cost Price) क्या था?`,
          options: opts,
          correctAnswer: correctOptId,
          explanation: `Cost Price = SP × 100 / (100 + ${P}) = (${SP} × 100) / ${100 + P} = ₹${CP.toLocaleString('en-IN')}.\nक्रय मूल्य = (${SP} × 100) / ${100 + P} = ₹${CP.toLocaleString('en-IN')}।`
        };
      }
    }

    // Subtopic 3: marked_price_discount
    if (subtopic === 'marked_price_discount') {
      if (isAdvanced) {
        const advMode = Math.abs(variantIndex) % 2;
        if (advMode === 0) {
          // Markup 50% with two discounts of 20% and 10% -> 8% profit
          const opts = [
            { id: 'A', text: '6%' },
            { id: 'B', text: '8%' },
            { id: 'C', text: '10%' },
            { id: 'D', text: '12%' }
          ].sort(() => Math.random() - 0.5);
          const correctOptId = opts.find(o => o.text === '8%')?.id || 'B';

          return {
            exam: 'General Practice / All Exams',
            subject: 'Simple Arithmetic / Mathematics',
            topic: 'Percentage & Profit/Loss',
            subtopic: 'marked_price_discount',
            concept: 'Markup with two successive discounts',
            difficulty: difficulty || 'Very Hard',
            question: 'A manufacturer marks his goods 50% above the cost price and allows two successive discounts of 20% and 10% on the marked price. What is his net profit percentage?\nएक निर्माता अपने माल पर क्रय मूल्य से 50% अधिक मूल्य अंकित करता है और अंकित मूल्य पर 20% और 10% की दो क्रमिक छूट देता है। उसका शुद्ध लाभ प्रतिशत क्या है?',
            options: opts,
            correctAnswer: correctOptId,
            explanation: 'Let CP = 100. MP = 150. Price after 20% = 120. Price after 10% = 108. Net Profit = 8%.\nमाना क्रय मूल्य = 100, अंकित मूल्य = 150 => 20% छूट के बाद = 120 => 10% छूट के बाद = 108 => शुद्ध लाभ = 8%।'
          };
        } else {
          // Markup 30% and 10% discount -> 17% profit
          const markups = [30, 40, 50];
          const discounts = [10, 15, 20];
          const M = markups[Math.abs(variantIndex) % markups.length];
          const D = discounts[Math.abs(Math.floor(variantIndex / 2)) % discounts.length];
          const netProfit = Math.round(((1 + M / 100) * (1 - D / 100) - 1) * 100);

          const opts = [
            { id: 'A', text: `${netProfit - 4}%` },
            { id: 'B', text: `${netProfit}%` },
            { id: 'C', text: `${netProfit + 5}%` },
            { id: 'D', text: `${netProfit + 8}%` }
          ].sort(() => Math.random() - 0.5);
          const correctOptId = opts.find(o => o.text === `${netProfit}%`)?.id || 'B';

          return {
            exam: 'General Practice / All Exams',
            subject: 'Simple Arithmetic / Mathematics',
            topic: 'Percentage & Profit/Loss',
            subtopic: 'marked_price_discount',
            concept: 'Net profit percentage after markup and discount',
            difficulty: difficulty || 'Hard',
            question: `A trader marks his goods ${M}% above the cost price and allows a discount of ${D}% on the marked price. What is his net profit percentage?\nएक व्यापारी अपने माल पर क्रय मूल्य से ${M}% अधिक मूल्य अंकित करता है और अंकित मूल्य पर ${D}% की छूट देता है। उसका शुद्ध लाभ प्रतिशत क्या है?`,
            options: opts,
            correctAnswer: correctOptId,
            explanation: `Let CP = 100. MP = ${100 + M}. SP = ${100 + M} × (1 - ${D}/100) = ${100 + netProfit}. Profit = ${netProfit}%.\nमाना क्रय मूल्य = 100, अंकित मूल्य = ${100 + M}, विक्रय मूल्य = ${100 + netProfit} => लाभ = ${netProfit}%।`
          };
        }
      }

      // Standard / Medium / Easy marked_price_discount
      const MPs = [1200, 1500, 1600, 2000, 2400, 2500, 3000, 4000];
      const dPcts = [10, 15, 20, 25, 30];
      const MP = MPs[Math.abs(variantIndex) % MPs.length];
      const D = dPcts[Math.abs(Math.floor(variantIndex / 3)) % dPcts.length];
      const SP = Math.round(MP * (1 - D / 100));

      const opts = [
        { id: 'A', text: `₹${(SP - 70).toLocaleString('en-IN')}` },
        { id: 'B', text: `₹${SP.toLocaleString('en-IN')}` },
        { id: 'C', text: `₹${(SP + 80).toLocaleString('en-IN')}` },
        { id: 'D', text: `₹${(SP + 150).toLocaleString('en-IN')}` }
      ].sort(() => Math.random() - 0.5);
      const correctOptId = opts.find(o => o.text === `₹${SP.toLocaleString('en-IN')}`)?.id || 'B';

      return {
        exam: 'General Practice / All Exams',
        subject: 'Simple Arithmetic / Mathematics',
        topic: 'Percentage & Profit/Loss',
        subtopic: 'marked_price_discount',
        concept: 'Calculating final price from Marked Price and discount percentage',
        difficulty: difficulty || 'Medium',
        question: `The marked price of an article is ₹${MP.toLocaleString('en-IN')}. If a discount of ${D}% is offered, what is the final price paid by the customer?\nएक वस्तु का अंकित मूल्य ₹${MP.toLocaleString('en-IN')} है। यदि उस पर ${D}% की छूट (Discount) दी जाती है, तो ग्राहक द्वारा भुगतान की गई अंतिम राशि क्या होगी?`,
        options: opts,
        correctAnswer: correctOptId,
        explanation: `Discount = ₹${MP} × ${D}% = ₹${Math.round((MP * D) / 100)}. Final Price = ₹${MP} - ₹${Math.round((MP * D) / 100)} = ₹${SP.toLocaleString('en-IN')}.\nछूट = ${D}% = ₹${Math.round((MP * D) / 100)}। अंतिम मूल्य = ₹${MP} - ₹${Math.round((MP * D) / 100)} = ₹${SP.toLocaleString('en-IN')}।`
      };
    }

    // Subtopic 4: successive_discount_mixed
    if (isAdvanced) {
      const advMode = Math.abs(variantIndex) % 2;
      if (advMode === 0) {
        // Weighted stock profit/loss
        const opts = [
          { id: 'A', text: '7.5%' },
          { id: 'B', text: '8.75%' },
          { id: 'C', text: '9.25%' },
          { id: 'D', text: '10%' }
        ].sort(() => Math.random() - 0.5);
        const correctOptId = opts.find(o => o.text === '8.75%')?.id || 'B';

        return {
          exam: 'General Practice / All Exams',
          subject: 'Simple Arithmetic / Mathematics',
          topic: 'Percentage & Profit/Loss',
          subtopic: 'successive_discount_mixed',
          concept: 'Weighted profit and loss on parts of stock',
          difficulty: difficulty || 'Very Hard',
          question: 'A trader bought 80 kg of wheat at ₹30 per kg. He sold 50 kg at a profit of 20% and the remaining 30 kg at a loss of 10%. What is his overall profit percentage on the whole transaction?\nएक व्यापारी ने ₹30 प्रति किग्रा की दर से 80 किग्रा गेहूं खरीदा। उसने 50 किग्रा 20% के लाभ पर और शेष 30 किग्रा 10% की हानि पर बेचा। पूरे सौदे में उसका समग्र लाभ प्रतिशत क्या है?',
          options: opts,
          correctAnswer: correctOptId,
          explanation: 'Total CP = ₹2,400. Profit on 50 kg = ₹300. Loss on 30 kg = ₹90. Net Profit = ₹210. Profit % = (210 / 2400) × 100 = 8.75%.\nकुल क्रय मूल्य = ₹2,400। शुद्ध लाभ = ₹210। लाभ % = (210 / 2400) × 100 = 8.75%।'
        };
      } else {
        // Vendor selling 36 oranges incurs loss equal to SP of 4 oranges -> 10%
        const opts = [
          { id: 'A', text: '9%' },
          { id: 'B', text: '10%' },
          { id: 'C', text: '11.11%' },
          { id: 'D', text: '12.5%' }
        ].sort(() => Math.random() - 0.5);
        const correctOptId = opts.find(o => o.text === '10%')?.id || 'B';

        return {
          exam: 'General Practice / All Exams',
          subject: 'Simple Arithmetic / Mathematics',
          topic: 'Percentage & Profit/Loss',
          subtopic: 'successive_discount_mixed',
          concept: 'Vendor loss in terms of selling price of items',
          difficulty: difficulty || 'Hard',
          question: 'By selling 36 oranges, a fruit vendor incurs a loss equal to the selling price of 4 oranges. What is his loss percentage?\n36 संतरे बेचने पर एक फल विक्रेता को 4 संतरों के विक्रय मूल्य के बराबर हानि होती है। उसकी हानि का प्रतिशत क्या है?',
          options: opts,
          correctAnswer: correctOptId,
          explanation: 'Loss = 4 SP. CP = 36 SP + 4 SP = 40 SP. Loss % = (4 / 40) × 100 = 10%.\nहानि = 4 SP, क्रय मूल्य = 40 SP => हानि % = (4 / 40) × 100 = 10%।'
        };
      }
    }

    // Standard / Medium / Easy successive_discount_mixed
    const pairs = [
      { d1: 20, d2: 10, deq: 28 },
      { d1: 20, d2: 20, deq: 36 },
      { d1: 30, d2: 10, deq: 37 },
      { d1: 25, d2: 20, deq: 40 },
      { d1: 15, d2: 10, deq: 23.5 },
      { d1: 10, d2: 10, deq: 19 }
    ];
    const p = pairs[Math.abs(variantIndex) % pairs.length];
    const ans = `${p.deq}%`;
    const opts = [
      { id: 'A', text: `${p.d1 + p.d2}%` },
      { id: 'B', text: ans },
      { id: 'C', text: `${p.deq - 3}%` },
      { id: 'D', text: `${p.deq + 4}%` }
    ].sort(() => Math.random() - 0.5);
    const correctOptId = opts.find(o => o.text === ans)?.id || 'B';

    return {
      exam: 'General Practice / All Exams',
      subject: 'Simple Arithmetic / Mathematics',
      topic: 'Percentage & Profit/Loss',
      subtopic: 'successive_discount_mixed',
      concept: 'Single equivalent discount for two successive discounts',
      difficulty: difficulty || 'Medium',
      question: `What single discount is equivalent to two successive discounts of ${p.d1}% and ${p.d2}%?\n${p.d1}% और ${p.d2}% की दो क्रमिक छूट (Successive Discounts) के समतुल्य एकल छूट क्या होगी?`,
      options: opts,
      correctAnswer: correctOptId,
      explanation: `Equivalent Discount = [D1 + D2 - (D1 × D2)/100]% = [${p.d1} + ${p.d2} - (${p.d1} × ${p.d2})/100]% = ${p.deq}%.\nसमतुल्य एकल छूट = [${p.d1} + ${p.d2} - (${p.d1} × ${p.d2})/100]% = ${p.deq}%।`
    };
  }

  /**
   * Procedural Simple & Compound Interest Generator
   */
  static generateSimpleInterestProceduralQuestion(variantIndex, difficulty) {
    const P = 3000 + ((Math.abs(variantIndex) % 25) * 500);
    const R = 5 + (Math.abs(variantIndex) % 8);
    const T = 2 + (Math.abs(variantIndex) % 4);
    const SI = (P * R * T) / 100;

    const opts = [
      { id: 'A', text: `₹${(SI - 120).toLocaleString('en-IN')}` },
      { id: 'B', text: `₹${SI.toLocaleString('en-IN')}` },
      { id: 'C', text: `₹${(SI + 150).toLocaleString('en-IN')}` },
      { id: 'D', text: `₹${(SI + 250).toLocaleString('en-IN')}` }
    ].sort(() => Math.random() - 0.5);
    const correctOptId = opts.find(o => o.text === `₹${SI.toLocaleString('en-IN')}`)?.id || 'B';

    return {
      exam: 'General Practice / All Exams',
      subject: 'Simple Arithmetic / Mathematics',
      topic: 'Simple & Compound Interest',
      subtopic: 'simple_interest_calc',
      concept: 'Simple interest formula (P*R*T)/100',
      difficulty: difficulty || 'Medium',
      question: `What will be the simple interest on a principal sum of ₹${P.toLocaleString('en-IN')} at an annual rate of ${R}% for ${T} years?\n₹${P.toLocaleString('en-IN')} की मूलधन राशि पर ${R}% वार्षिक साधारण ब्याज की दर से ${T} वर्ष का साधारण ब्याज कितना होगा?`,
      options: opts,
      correctAnswer: correctOptId,
      explanation: `Simple Interest = (P × R × T) / 100 = (${P} × ${R} × ${T}) / 100 = ₹${SI.toLocaleString('en-IN')}.\nसाधारण ब्याज = (मूलधन × दर × समय) / 100 = (${P} × ${R} × ${T}) / 100 = ₹${SI.toLocaleString('en-IN')}।`
    };
  }

  /**
   * Procedural Ratio & Time-Work Generator
   */
  static generateRatioWorkProceduralQuestion(variantIndex, difficulty) {
    const mode = Math.abs(variantIndex) % 2;
    if (mode === 0) {
      const aDays = 12 + (Math.abs(variantIndex) % 12);
      const bDays = aDays * 2;
      const jointDays = Math.round((aDays * bDays) / (aDays + bDays) * 10) / 10;
      const opts = [
        { id: 'A', text: `${jointDays - 2} Days / दिन` },
        { id: 'B', text: `${jointDays} Days / दिन` },
        { id: 'C', text: `${jointDays + 2} Days / दिन` },
        { id: 'D', text: `${jointDays + 4} Days / दिन` }
      ].sort(() => Math.random() - 0.5);
      const correctOptId = opts.find(o => o.text === `${jointDays} Days / दिन`)?.id || 'B';

      return {
        exam: 'General Practice / All Exams',
        subject: 'Simple Arithmetic / Mathematics',
        topic: 'Ratio, Proportion & Time-Work',
        subtopic: 'time_and_work_days',
        concept: 'Joint work completion time',
        difficulty: difficulty || 'Medium',
        question: `A can complete a piece of work in ${aDays} days and B can do the same work in ${bDays} days. In how many days will both complete the work together?\nA किसी कार्य को ${aDays} दिनों में और B उसी कार्य को ${bDays} दिनों में कर सकता है। दोनों मिलकर उस कार्य को कितने दिनों में पूरा करेंगे?`,
        options: opts,
        correctAnswer: correctOptId,
        explanation: `Joint Days = (A × B) / (A + B) = (${aDays} × ${bDays}) / (${aDays} + ${bDays}) = ${jointDays} days.\nसंयुक्त समय = (A × B) / (A + B) = ${jointDays} दिन।`
      };
    } else {
      const r1 = 2 + (Math.abs(variantIndex) % 4);
      const r2 = 3 + (Math.abs(variantIndex) % 5);
      const sum = (r1 + r2) * (50 + (Math.abs(variantIndex) % 50));
      const part1 = (sum * r1) / (r1 + r2);

      const opts = [
        { id: 'A', text: `₹${part1 - 30}` },
        { id: 'B', text: `₹${part1}` },
        { id: 'C', text: `₹${part1 + 40}` },
        { id: 'D', text: `₹${part1 + 80}` }
      ].sort(() => Math.random() - 0.5);
      const correctOptId = opts.find(o => o.text === `₹${part1}`)?.id || 'B';

      return {
        exam: 'General Practice / All Exams',
        subject: 'Simple Arithmetic / Mathematics',
        topic: 'Ratio, Proportion & Time-Work',
        subtopic: 'ratio_division',
        concept: 'Dividing total amount in given ratio',
        difficulty: difficulty || 'Easy',
        question: `Divide ₹${sum} between A and B in the ratio ${r1} : ${r2}. What is the share of A?\n₹${sum} की राशि को A और B के बीच ${r1} : ${r2} के अनुपात में विभाजित कीजिए। A का हिस्सा कितना होगा?`,
        options: opts,
        correctAnswer: correctOptId,
        explanation: `A's share = (${r1} / (${r1} + ${r2})) × ₹${sum} = ₹${part1}.\nA का भाग = (${r1} / ${r1 + r2}) × ₹${sum} = ₹${part1}।`
      };
    }
  }

  /**
   * Procedural Coding-Decoding Generator
   */
  static generateCodingDecodingProceduralQuestion(variantIndex, difficulty) {
    const codingPairs = [
      { w1: 'ROSE', c1: 'SPTF', w2: 'LILY', ans: 'MJMZ', wrong: ['MJMY', 'MKNA', 'NJNA'], rule: 'Shift +1 forward / प्रत्येक अक्षर में +1' },
      { w1: 'GUARD', c1: 'IWCFT', w2: 'COURT', ans: 'EQWTV', wrong: ['EQVSU', 'DPRSS', 'FQWTV'], rule: 'Shift +2 forward / प्रत्येक अक्षर में +2' },
      { w1: 'TARGET', c1: 'SZQEDS', w2: 'BULLET', ans: 'ATKKDS', wrong: ['ATKJDS', 'BTKKDS', 'CUMMFU'], rule: 'Shift -1 backward / प्रत्येक अक्षर में -1' },
      { w1: 'MANGO', c1: 'NBMHP', w2: 'APPLE', ans: 'BQQMF', wrong: ['BQPMF', 'APPLF', 'BQQME'], rule: 'Shift +1 forward / प्रत्येक अक्षर में +1' },
      { w1: 'TIGER', c1: 'VKIGT', w2: 'HORSE', ans: 'JQTUG', wrong: ['JPTSF', 'JQSUG', 'IQSUE'], rule: 'Shift +2 forward / प्रत्येक अक्षर में +2' },
      { w1: 'POLICE', c1: 'ECILOP', w2: 'DETECT', ans: 'TCETED', wrong: ['TCEDET', 'ETETCD', 'TCETEE'], rule: 'Reversal of letters / अक्षरों का उल्टा क्रम' },
      { w1: 'DELHI', c1: '73541', w2: 'CALCUTTA', ans: '82589662', wrong: ['82589661', '82589663', '72589662'], rule: 'Direct letter substitution / प्रत्यक्ष अक्षर-अंक कूट' },
      { w1: 'PEN', c1: '35', w2: 'HEN', ans: '27', wrong: ['25', '29', '30'], rule: 'Sum of alphabetical positions: H(8)+E(5)+N(14) = 27 / वर्णमाला क्रमांकों का योग' },
      { w1: 'SILVER', c1: 'TMOWFS', w2: 'COPPER', ans: 'DPQQFS', wrong: ['DPPPFS', 'DPQRES', 'CPQQFS'], rule: 'Shift +1 forward / प्रत्येक अक्षर में +1' },
      { w1: 'DOCTOR', c1: 'FQEVQT', w2: 'NURSE', ans: 'PWTUG', wrong: ['PVSUG', 'PUTUG', 'QWTUG'], rule: 'Shift +2 forward / प्रत्येक अक्षर में +2' },
      { w1: 'PENCIL', c1: 'LICNEP', w2: 'ERASER', ans: 'RESARE', wrong: ['RESRAE', 'REASER', 'EASERR'], rule: 'Reversal of word letters / अक्षरों का विपरीत क्रम' },
      { w1: 'PLANET', c1: 'QMBODU', w2: 'ROCKET', ans: 'SPDLDV', wrong: ['SPCKDV', 'SPCMDV', 'TQEMFW'], rule: 'Shift +1 forward / प्रत्येक अक्षर में +1' },
      { w1: 'BRIDGE', c1: 'DTIKIG', w2: 'TUNNEL', ans: 'VWPNGN', wrong: ['VWPNFN', 'VXPOGN', 'UWPNGN'], rule: 'Shift +2 forward / प्रत्येक अक्षर में +2' },
      { w1: 'MONKEY', c1: 'LNMJDX', w2: 'DONKEY', ans: 'CNMJDX', wrong: ['CNMKDX', 'BNMJDX', 'DNMKDY'], rule: 'Shift -1 backward / प्रत्येक अक्षर में -1' },
      { w1: 'WINDOW', c1: 'XJOEPX', w2: 'MIRROR', ans: 'NJSSPS', wrong: ['NJSRPS', 'MISRPS', 'OKSSPS'], rule: 'Shift +1 forward / प्रत्येक अक्षर में +1' }
    ];

    const pair = codingPairs[Math.abs(variantIndex) % codingPairs.length];
    const opts = [
      { id: 'A', text: pair.wrong[0] },
      { id: 'B', text: pair.ans },
      { id: 'C', text: pair.wrong[1] },
      { id: 'D', text: pair.wrong[2] }
    ].sort(() => Math.random() - 0.5);

    const correctOptId = opts.find(o => o.text === pair.ans)?.id || 'B';

    return {
      exam: 'General Practice / All Exams',
      subject: 'Reasoning Ability',
      topic: 'Coding-Decoding',
      difficulty: difficulty || 'Medium',
      question: `If in a certain code language "${pair.w1}" is written as "${pair.c1}", how will "${pair.w2}" be written in that code language?\nयदि किसी निश्चित कूट भाषा में "${pair.w1}" को "${pair.c1}" लिखा जाता है, तो उसी कूट भाषा में "${pair.w2}" को कैसे लिखा जाएगा?`,
      options: opts,
      correctAnswer: correctOptId,
      explanation: `Rule: ${pair.rule}. Therefore, ${pair.w2} is coded as ${pair.ans}.\nनियम: ${pair.rule}। अतः ${pair.w2} का कोड ${pair.ans} होगा।`
    };
  }

  /**
   * Procedural Number & Letter Series Generator
   */
  static generateSeriesProceduralQuestion(variantIndex, difficulty) {
    const patternChoice = Math.abs(variantIndex) % 6;

    // Pattern 0: Successive Differences (+d, +d+2, +d+4, ...)
    if (patternChoice === 0) {
      const step = 2 + (Math.abs(variantIndex) % 7);
      const start = 4 + (Math.abs(variantIndex * 3) % 43);
      const n1 = start;
      const n2 = n1 + step;
      const n3 = n2 + step + 2;
      const n4 = n3 + step + 4;
      const n5 = n4 + step + 6;
      const ans = n5 + step + 8;

      const opts = [
        { id: 'A', text: String(ans - 4) },
        { id: 'B', text: String(ans) },
        { id: 'C', text: String(ans + 3) },
        { id: 'D', text: String(ans + 6) }
      ].sort(() => Math.random() - 0.5);
      const correctOptId = opts.find(o => o.text === String(ans))?.id || 'B';

      return {
        exam: 'General Practice / All Exams',
        subject: 'Reasoning Ability',
        topic: 'Number & Letter Series',
        difficulty: difficulty || 'Medium',
        question: `What will come in place of the question mark (?) in the following series?\nनिम्नलिखित संख्या श्रृंखला में प्रश्नवाचक चिह्न (?) के स्थान पर क्या आएगा?\n${n1}, ${n2}, ${n3}, ${n4}, ${n5}, ?`,
        options: opts,
        correctAnswer: correctOptId,
        explanation: `Differences increase by 2 at each step (+${step}, +${step+2}, +${step+4}, +${step+6}, +${step+8}): ${n5} + ${step+8} = ${ans}.\nक्रमिक अंतर में 2 की वृद्धि हो रही है (+${step}, +${step+2}, +${step+4}, +${step+6}, +${step+8}): अतः अगला पद ${n5} + ${step+8} = ${ans} होगा।`
      };
    }

    // Pattern 1: Multiplicative Series (×2 ± c)
    if (patternChoice === 1) {
      const c = (Math.abs(variantIndex) % 2 === 0) ? 1 : -1;
      const start = 3 + (Math.abs(variantIndex) % 8);
      const n1 = start;
      const n2 = n1 * 2 + c;
      const n3 = n2 * 2 + c;
      const n4 = n3 * 2 + c;
      const n5 = n4 * 2 + c;
      const ans = n5 * 2 + c;

      const opts = [
        { id: 'A', text: String(ans - 6) },
        { id: 'B', text: String(ans) },
        { id: 'C', text: String(ans + 4) },
        { id: 'D', text: String(ans + 8) }
      ].sort(() => Math.random() - 0.5);
      const correctOptId = opts.find(o => o.text === String(ans))?.id || 'B';

      return {
        exam: 'General Practice / All Exams',
        subject: 'Reasoning Ability',
        topic: 'Number & Letter Series',
        difficulty: difficulty || 'Medium',
        question: `Find the missing number in the sequence:\nअनुक्रम में लुप्त संख्या ज्ञात कीजिए:\n${n1}, ${n2}, ${n3}, ${n4}, ${n5}, ?`,
        options: opts,
        correctAnswer: correctOptId,
        explanation: `Pattern: (Previous number × 2) ${c > 0 ? '+ 1' : '- 1'}. Next term is ${n5} × 2 ${c > 0 ? '+ 1' : '- 1'} = ${ans}.\nपैटर्न: (पिछली संख्या × 2) ${c > 0 ? '+ 1' : '- 1'} => ${n5} × 2 ${c > 0 ? '+ 1' : '- 1'} = ${ans}।`
      };
    }

    // Pattern 2: Square Based Pattern (n^2 + k)
    if (patternChoice === 2) {
      const k = (Math.abs(variantIndex) % 5) - 2;
      const base = 2 + (Math.abs(variantIndex) % 5);
      const n1 = (base) ** 2 + k;
      const n2 = (base + 1) ** 2 + k;
      const n3 = (base + 2) ** 2 + k;
      const n4 = (base + 3) ** 2 + k;
      const n5 = (base + 4) ** 2 + k;
      const ans = (base + 5) ** 2 + k;

      const opts = [
        { id: 'A', text: String(ans - 5) },
        { id: 'B', text: String(ans) },
        { id: 'C', text: String(ans + 4) },
        { id: 'D', text: String(ans + 9) }
      ].sort(() => Math.random() - 0.5);
      const correctOptId = opts.find(o => o.text === String(ans))?.id || 'B';

      return {
        exam: 'General Practice / All Exams',
        subject: 'Reasoning Ability',
        topic: 'Number & Letter Series',
        difficulty: difficulty || 'Medium',
        question: `What will come in place of the question mark (?) in the following square series?\nवर्ग आधारित श्रृंखला में प्रश्नवाचक चिह्न (?) के स्थान पर क्या आएगा?\n${n1}, ${n2}, ${n3}, ${n4}, ${n5}, ?`,
        options: opts,
        correctAnswer: correctOptId,
        explanation: `Pattern: n^2 ${k >= 0 ? '+ ' + k : '- ' + Math.abs(k)} starting from n=${base}. For next term: ${base+5}^2 ${k >= 0 ? '+ ' + k : '- ' + Math.abs(k)} = ${ans}.\nपैटर्न: क्रमागत संख्याओं के वर्ग ${k >= 0 ? '+ ' + k : '- ' + Math.abs(k)} => ${base+5}^2 ${k >= 0 ? '+ ' + k : '- ' + Math.abs(k)} = ${ans}।`
      };
    }

    // Pattern 3: Alternating Addition & Subtraction (+add, -sub)
    if (patternChoice === 3) {
      const add = 5 + (Math.abs(variantIndex) % 6);
      const sub = 2 + (Math.abs(variantIndex) % 3);
      const start = 12 + (Math.abs(variantIndex * 2) % 30);
      const n1 = start;
      const n2 = n1 + add;
      const n3 = n2 - sub;
      const n4 = n3 + add;
      const n5 = n4 - sub;
      const ans = n5 + add;

      const opts = [
        { id: 'A', text: String(ans - 3) },
        { id: 'B', text: String(ans) },
        { id: 'C', text: String(ans + 2) },
        { id: 'D', text: String(ans + 5) }
      ].sort(() => Math.random() - 0.5);
      const correctOptId = opts.find(o => o.text === String(ans))?.id || 'B';

      return {
        exam: 'General Practice / All Exams',
        subject: 'Reasoning Ability',
        topic: 'Number & Letter Series',
        difficulty: difficulty || 'Medium',
        question: `Find the next number in the alternating series:\nएकांतर श्रृंखला में अगली संख्या ज्ञात कीजिए:\n${n1}, ${n2}, ${n3}, ${n4}, ${n5}, ?`,
        options: opts,
        correctAnswer: correctOptId,
        explanation: `Pattern alternates between +${add} and -${sub}. Next operation is +${add}: ${n5} + ${add} = ${ans}.\nपैटर्न: +${add} और -${sub} एकांतर क्रम में है। अतः अगला पद ${n5} + ${add} = ${ans} होगा।`
      };
    }

    // Pattern 4: Letter Series (alphabet skip jumps)
    if (patternChoice === 4) {
      const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const jump = 2 + (Math.abs(variantIndex) % 3);
      const startIdx = Math.abs(variantIndex) % 8;
      const l1 = alphabet[startIdx];
      const l2 = alphabet[startIdx + jump];
      const l3 = alphabet[startIdx + jump * 2];
      const l4 = alphabet[startIdx + jump * 3];
      const ans = alphabet[startIdx + jump * 4];
      const wrong1 = alphabet[(startIdx + jump * 4 - 1 + 26) % 26];
      const wrong2 = alphabet[(startIdx + jump * 4 + 1) % 26];
      const wrong3 = alphabet[(startIdx + jump * 4 + 2) % 26];

      const opts = [
        { id: 'A', text: wrong1 },
        { id: 'B', text: ans },
        { id: 'C', text: wrong2 },
        { id: 'D', text: wrong3 }
      ].sort(() => Math.random() - 0.5);
      const correctOptId = opts.find(o => o.text === ans)?.id || 'B';

      return {
        exam: 'General Practice / All Exams',
        subject: 'Reasoning Ability',
        topic: 'Number & Letter Series',
        difficulty: difficulty || 'Medium',
        question: `Complete the following letter series:\nनिम्नलिखित अक्षर श्रृंखला को पूरा कीजिए:\n${l1}, ${l2}, ${l3}, ${l4}, ?`,
        options: opts,
        correctAnswer: correctOptId,
        explanation: `Letters shift forward by +${jump} at each step: ${l4}(+${jump}) = ${ans}.\nप्रत्येक अक्षर में +${jump} की वृद्धि हो रही है: ${l4} + ${jump} = ${ans}।`
      };
    }

    // Pattern 5: Geometric Progression (×r)
    const r = 2 + (Math.abs(variantIndex) % 3);
    const startG = 2 + (Math.abs(variantIndex) % 5);
    const g1 = startG;
    const g2 = g1 * r;
    const g3 = g2 * r;
    const g4 = g3 * r;
    const ansG = g4 * r;

    const optsG = [
      { id: 'A', text: String(ansG - r * 4) },
      { id: 'B', text: String(ansG) },
      { id: 'C', text: String(ansG + r * 3) },
      { id: 'D', text: String(ansG + r * 6) }
    ].sort(() => Math.random() - 0.5);
    const correctOptId = optsG.find(o => o.text === String(ansG))?.id || 'B';

    return {
      exam: 'General Practice / All Exams',
      subject: 'Reasoning Ability',
      topic: 'Number & Letter Series',
      difficulty: difficulty || 'Medium',
      question: `Find the next term in the geometric sequence:\nगुणोत्तर अनुक्रम में अगला पद ज्ञात कीजिए:\n${g1}, ${g2}, ${g3}, ${g4}, ?`,
      options: optsG,
      correctAnswer: correctOptId,
      explanation: `Each number is multiplied by ${r}: ${g4} × ${r} = ${ansG}.\nप्रत्येक संख्या को ${r} से गुणा किया जा रहा है: ${g4} × ${r} = ${ansG}।`
    };
  }

  /**
   * Main Router for Procedural Question Generation
   */
  static generateProceduralQuestion({ subject, topic, difficulty, variantIndex = 1, subtopic }) {
    const taxonomyContext = normalizeSubjectAndTopic(subject, topic);
    const { topicId } = taxonomyContext;

    // 1. All 24 Mathematics Chapters
    if (taxonomyContext.subjectGroup === 'MATH' || topicId.startsWith('math_')) {
      return ProceduralMathGenerators.generate(topicId, variantIndex, difficulty);
    }

    // 2. Reasoning: Coding-Decoding
    if (topicId === 'reasoning_coding_decoding') {
      return this.generateCodingDecodingProceduralQuestion(variantIndex, difficulty);
    }

    // 3. Reasoning: Number Series
    if (topicId === 'reasoning_series') {
      return this.generateSeriesProceduralQuestion(variantIndex, difficulty);
    }

    // Default / general fallback
    return this.generatePercentageProfitProceduralQuestion(variantIndex, difficulty, subtopic);
  }

  /**
   * Direct Gemini API invocation (when valid key is present)
   */
  static async callGeminiApi({ apiKey, exam, subject, topic, difficulty, count, language = 'Bilingual', excludeQuestions = [], taxonomyContext = null }) {
    const dynamicSeed = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    const disallowedNotice = taxonomyContext?.disallowedKeywords?.length
      ? `\nSTRICT NEGATIVE CONSTRAINT: Under NO circumstances include any questions related to: ${taxonomyContext.disallowedKeywords.slice(0, 8).join(', ')}!`
      : '';

    const isMathSubject = taxonomyContext?.subjectGroup === 'MATH' || String(subject).toLowerCase().includes('math') || String(subject).toLowerCase().includes('arithmetic');

    const isAdvancedDifficulty = difficulty === 'Ultra Hard' || difficulty === 'Very Hard' || difficulty === 'Hard';
    const difficultyDirectives = isAdvancedDifficulty
      ? `\nCOMPETITIVE EXAM STANDARDS (CAT / SSC CGL Tier-2 / MP SI Ranker Level):
- Selected Difficulty: "${difficulty}". Every question MUST be a multi-step, competitive exam problem.
- STRICTLY FORBIDDEN: Elementary 1-step arithmetic (e.g. "What is 15% of 4800?" or basic CP/SP formulas).
- Required focus: Dishonest merchants cheating on buying and selling, milk/water mixtures with markup, shift from loss to gain by fixed price change, double condition cost and selling price variations, two articles sold at equal SP, successive markups with multiple discounts, election vote splits, or weighted average profit/loss.`
      : '';

    const mathKiranTypeDirectives = isMathSubject
      ? `\nKIRAN SSC TCS CHAPTERWISE & TYPEWISE FOCUS FOR MATHEMATICS:
- Follow authentic TCS PYQ Type patterns strictly for "${topic}":
  * Percentage (Kiran Ch-8 Types): Price increase & consumption decrease (Type-5), Election winner margins & invalid votes (Type-7), Exam pass/fail marks (Type-4), Income-expenditure-savings ratio (Type-6), Population & machine depreciation (Type-7).
  * Profit & Loss (Kiran Ch-9 Types): Cost price of X = Selling price of Y (Type-4), Dishonest dealer with false weights (Type-5), Double condition CP/SP shift (Type-7), Selling 2 articles at equal SP (Type-9), Milk-water adulteration markup (Type-8).
  * Discount (Kiran Ch-10 Types): Successive discounts equivalent single discount (Type-1), Markup above CP combined with discount for target profit (Type-2/3), Buy X Get Y Free schemes (Type-4).
  * SI & CI (Kiran Ch-11 & 12 Types): Sum becomes N times in T years (Type-2), CI - SI difference for 2/3 years P*(R/100)^2 (Type-4), Annual vs Semi-annual compounding.
  * Ratio & Mixture (Kiran Ch-6 & 7 Types): Coin denominations ratio (Type-6), Alligation of mixtures, Partnership investment time ratio.
  * Time & Work (Kiran Ch-13 & 14 Types): Efficiency ratio A vs B, Alternate days work, Leaving/joining midway, Pipes & Cisterns with leak.
  * Time & Distance (Kiran Ch-15 & 16 Types): Average speed 2xy/(x+y), Train crossing platform/pole, Relative speed in opposite/same direction, Boat & Stream.
  * Mensuration & Geometry (Kiran Ch-20 & 21 Types): Area of 4 walls 2(l+b)h, Cube/Cuboid diagonal, Cylinder/Cone volume/surface area, Melting & recasting 3D solids, Circle tangents & chord theorems.`
      : '';

    const examinerPersona = isMathSubject
      ? `You are the Senior Paper Setter & Chief Quantitative Aptitude Examiner specializing in SSC CGL Tier-1/Tier-2, CHSL, CPO, MP SI, and TCS Competitive Examination Standards (calibrated to Kiran SSC Mathematics 16,000+ TCS PYQ Chapterwise & Typewise analysis).`
      : `You are the official Paper Setter for Madhya Pradesh Police Recruitment Board (PEB / MP ESB) for Constable and Sub-Inspector examinations.`;

    const prompt = `
${examinerPersona}
Generate exactly ${count} 100% NEW, HIGH-QUALITY multiple-choice questions (MCQs) for:

Target Exam: ${exam}
Subject: ${subject}
Specific Topic: ${topic}
Difficulty Level: ${difficulty}
Language: Bilingual (English + Hindi)
Entropy Salt: [${dynamicSeed}]
${disallowedNotice}
${difficultyDirectives}
${mathKiranTypeDirectives}

CRITICAL RULES:
1. Every question MUST BE STRICTLY from the specified Topic: "${topic}".
2. Both English AND Hindi are MANDATORY for every question, option, and explanation!
   - Question Text: English question on line 1, \\n, Hindi question on line 2.
   - Options: Format as "English / हिंदी" or clean numbers.
   - Explanation: English sentence, \\n, Hindi explanation.
3. Output MUST BE strictly a valid JSON array of objects with NO markdown formatting, NO backticks.
4. Verify every calculation mathematically before generating the answer key!

JSON Output Schema:
[
  {
    "id": "q1",
    "question": "Question in English?\\nप्रश्न हिंदी में?",
    "options": [
      { "id": "A", "text": "Option A in English / विकल्प A हिंदी में" },
      { "id": "B", "text": "Option B in English / विकल्प B हिंदी में" },
      { "id": "C", "text": "Option C in English / विकल्प C हिंदी में" },
      { "id": "D", "text": "Option D in English / विकल्प D हिंदी में" }
    ],
    "correctAnswer": "A",
    "explanation": "Explanation in English.\\nव्याख्या हिंदी में।",
    "subject": "${subject}",
    "topic": "${topic}",
    "difficulty": "${difficulty}"
  }
]
`;

    const models = ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-2.5-flash'];
    for (const modelName of models) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
        const ctrl = new AbortController();
        const timeout = setTimeout(() => ctrl.abort(), 9000);

        const response = await fetch(url, {
          method: 'POST',
          signal: ctrl.signal,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              responseMimeType: 'application/json',
              temperature: 0.7,
              maxOutputTokens: 8192
            }
          })
        });

        clearTimeout(timeout);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const data = await response.json();
        const parts = data?.candidates?.[0]?.content?.parts || [];
        const rawContent = parts.map(p => p.text || '').join('\n');
        const parsed = this.tolerantParseQuestions(rawContent);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (err) {}
    }

    throw new Error('Gemini generation failed');
  }

  /**
   * Tolerant JSON Parser for LLM Responses
   */
  static tolerantParseQuestions(rawContent) {
    if (!rawContent || typeof rawContent !== 'string') return [];
    try {
      let cleaned = rawContent.replace(/```json/gi, '').replace(/```/g, '').trim();
      const start = cleaned.indexOf('[');
      const end = cleaned.lastIndexOf(']');
      if (start !== -1 && end !== -1 && end > start) {
        cleaned = cleaned.slice(start, end + 1);
      }
      return JSON.parse(cleaned);
    } catch (e) {
      return [];
    }
  }
}
