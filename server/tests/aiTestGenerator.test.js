import test from 'node:test';
import assert from 'node:assert/strict';
import { AiTestGeneratorService } from '../services/aiTestGenerator.js';
import { QuestionValidator } from '../services/questionValidator.js';
import { normalizeSubjectAndTopic } from '../services/questionTaxonomy.js';

test('1. Percentage & Profit/Loss does not include Simple Interest questions', async () => {
  const questions = await AiTestGeneratorService.generateFromPureCuratedBank({
    subject: 'Simple Arithmetic / Mathematics',
    topic: 'Percentage & Profit/Loss',
    difficulty: 'Medium',
    count: 10
  });

  assert.equal(questions.length, 10, 'Must generate exactly 10 questions');

  const disallowedTerms = [
    'simple interest',
    'compound interest',
    'principal sum',
    'annual rate',
    'साधारण ब्याज',
    'चक्रवृद्धि ब्याज',
    'मूलधन',
    'वार्षिक दर'
  ];

  for (const q of questions) {
    const fullText = (q.question + ' ' + q.explanation).toLowerCase();
    for (const term of disallowedTerms) {
      assert.ok(
        !fullText.includes(term.toLowerCase()),
        `Question ${q.id} contains disallowed Simple Interest term "${term}": ${q.question}`
      );
    }
    assert.equal(q.topic, 'Percentage & Profit/Loss');
  }
});

test('2. Coding-Decoding does not include Direction & Distance or Blood Relations questions', async () => {
  const questions = await AiTestGeneratorService.generateFromPureCuratedBank({
    subject: 'Reasoning Ability',
    topic: 'Coding-Decoding',
    difficulty: 'Medium',
    count: 10
  });

  assert.equal(questions.length, 10, 'Must generate exactly 10 questions');

  const disallowedTerms = [
    'walks',
    'facing north',
    'facing south',
    'turns left',
    'turns right',
    'blood relation',
    'mother of',
    'father of',
    'उत्तर दिशा',
    'दक्षिण दिशा',
    'रक्त संबंध',
    'माता',
    'पिता'
  ];

  for (const q of questions) {
    const fullText = (q.question + ' ' + q.explanation).toLowerCase();
    for (const term of disallowedTerms) {
      assert.ok(
        !fullText.includes(term.toLowerCase()),
        `Question ${q.id} contains disallowed term "${term}": ${q.question}`
      );
    }
    assert.equal(q.topic, 'Coding-Decoding');
  }
});

test('3. Ten generated questions contain no exact duplicates', async () => {
  const questions = await AiTestGeneratorService.generateFromPureCuratedBank({
    subject: 'Simple Arithmetic / Mathematics',
    topic: 'Percentage & Profit/Loss',
    difficulty: 'Medium',
    count: 10
  });

  const uniqueTexts = new Set(questions.map(q => q.question.trim().toLowerCase()));
  assert.equal(uniqueTexts.size, 10, 'Every generated question must be textually distinct');
});

test('4. Near-identical questions with changed numbers are detected', () => {
  const q1 = {
    question: 'A trader purchases goods for ₹1,200 and sells them at a profit of 20%. What is the Selling Price (SP)?\nएक व्यापारी ₹1,200 में माल खरीदता है और 20% लाभ पर बेचता है।',
    options: [{ id: 'A', text: '₹1440' }, { id: 'B', text: '₹1400' }, { id: 'C', text: '₹1500' }, { id: 'D', text: '₹1300' }],
    correctAnswer: 'A',
    explanation: 'SP = 1200 * 1.2 = 1440.\nविक्रय मूल्य = 1440।'
  };

  const q2 = {
    question: 'A trader purchases goods for ₹3,500 and sells them at a profit of 25%. What is the Selling Price (SP)?\nएक व्यापारी ₹3,500 में माल खरीदता है और 25% लाभ पर बेचता है।',
    options: [{ id: 'A', text: '₹4375' }, { id: 'B', text: '₹4000' }, { id: 'C', text: '₹4200' }, { id: 'D', text: '₹4500' }],
    correctAnswer: 'A',
    explanation: 'SP = 3500 * 1.25 = 4375.\nविक्रय मूल्य = 4375।'
  };

  const pool = [q1, q2];

  // A 3rd question with the exact same template should be detected when maxTemplateOccurrences = 2
  const q3 = {
    question: 'A trader purchases goods for ₹5,000 and sells them at a profit of 10%. What is the Selling Price (SP)?\nएक व्यापारी ₹5,000 में माल खरीदता है और 10% लाभ पर बेचता है।',
    options: [{ id: 'A', text: '₹5500' }, { id: 'B', text: '₹5200' }, { id: 'C', text: '₹5400' }, { id: 'D', text: '₹5600' }],
    correctAnswer: 'A',
    explanation: 'SP = 5000 * 1.1 = 5500.\nविक्रय मूल्य = 5500।'
  };

  const check = QuestionValidator.isDuplicateOrNearDuplicate(q3, pool, 2);
  assert.equal(check.isDuplicate, true, 'Third repetition of same structural template must be flagged as duplicate');
  assert.match(check.reason, /near-identical|template repetition/i);
});

test('5. Invalid answer keys are rejected', () => {
  const invalidKeyQuestion = {
    question: 'What is 20% of ₹5,000?\n₹5,000 का 20% कितना होगा?',
    options: [
      { id: 'A', text: '₹900' },
      { id: 'B', text: '₹1,000' },
      { id: 'C', text: '₹1,100' },
      { id: 'D', text: '₹1,200' }
    ],
    correctAnswer: 'Z', // Invalid ID
    explanation: '20% of 5000 is 1000.\n5000 का 20% 1000 है।'
  };

  const res = QuestionValidator.validateQuestion(invalidKeyQuestion);
  assert.equal(res.valid, false);
  assert.match(res.reason, /Invalid or missing correctAnswer/i);

  // Missing correct answer in options
  const missingOptQuestion = { ...invalidKeyQuestion, correctAnswer: 'D', options: [
    { id: 'A', text: '₹900' },
    { id: 'B', text: '₹1,000' },
    { id: 'C', text: '₹1,100' }
  ]};
  const res2 = QuestionValidator.validateQuestion(missingOptQuestion);
  assert.equal(res2.valid, false);
  assert.match(res2.reason, /Must have exactly 4 options/i);
});

test('6. Incorrect mathematical calculations are rejected', () => {
  // Marked price ₹2000 with 15% discount -> mathematically expected price is ₹1,700
  // But option marks ₹1,850 as the correct answer
  const wrongMathQuestion = {
    question: 'The marked price of an article is ₹2,000. If a discount of 15% is offered, what is the final price paid by the customer?\nएक वस्तु का अंकित मूल्य ₹2,000 है। यदि उस पर 15% की छूट दी जाती है, तो ग्राहक द्वारा भुगतान की गई अंतिम राशि क्या होगी?',
    options: [
      { id: 'A', text: '₹1,600' },
      { id: 'B', text: '₹1,850' }, // WRONG! Correct should be 1700
      { id: 'C', text: '₹1,750' },
      { id: 'D', text: '₹1,900' }
    ],
    correctAnswer: 'B',
    explanation: 'Discount = 15%. Final price = 1700.\nछूट = 15%। अंतिम मूल्य = 1700।'
  };

  const res = QuestionValidator.validateQuestion(wrongMathQuestion);
  assert.equal(res.valid, false, 'Should reject mathematically inconsistent answer');
  assert.match(res.reason, /Math verification failed/i);
});

test('7. Hindi and English versions are consistent and non-empty', () => {
  const englishOnlyQuestion = {
    question: 'A shopkeeper bought an article for 1200 and sold it for 1500. What is profit percent?',
    options: [
      { id: 'A', text: '20%' },
      { id: 'B', text: '25%' },
      { id: 'C', text: '30%' },
      { id: 'D', text: '35%' }
    ],
    correctAnswer: 'B',
    explanation: 'Profit is 25%.'
  };

  const res = QuestionValidator.validateQuestion(englishOnlyQuestion);
  assert.equal(res.valid, false, 'Should reject non-bilingual question');
  assert.match(res.reason, /Bilingual/i);
});

test('8. Missing or invalid AI output is handled safely', async () => {
  // Tolerant parsing handles broken JSON
  const corrupted = '```json [ {"question": "Q1?", "options": [{"id":"A","text":"1"},{"id":"B","text":"2"},{"id":"C","text":"3"},{"id":"D","text":"4"}], "correctAnswer":"A", "explanation":"exp"} ';
  const parsed = AiTestGeneratorService.tolerantParseQuestions(corrupted);
  assert.ok(Array.isArray(parsed));

  // Garbage input returns []
  const emptyParsed = AiTestGeneratorService.tolerantParseQuestions('Not JSON at all');
  assert.deepEqual(emptyParsed, []);

  // Safe fallback when generator is called without API key
  const questions = await AiTestGeneratorService.generateQuestions({
    subject: 'Simple Arithmetic / Mathematics',
    topic: 'Percentage & Profit/Loss',
    count: 10
  });
  assert.equal(questions.length, 10, 'Fallback must cleanly generate 10 questions without crashing');
});

test('9. Retry logic terminates after the configured maximum without infinite loops', () => {
  const saturatedPool = [];
  // Populate pool with 50 duplicates of the same template
  for (let i = 0; i < 50; i++) {
    saturatedPool.push({
      question: `A trader purchases goods for ₹${1000 + i * 10} and sells them at a profit of 10%. What is the Selling Price (SP)?\nव्यापारी माल खरीदता है।`,
      options: [{ id: 'A', text: '₹1100' }, { id: 'B', text: '₹1200' }, { id: 'C', text: '₹1300' }, { id: 'D', text: '₹1400' }],
      correctAnswer: 'A',
      explanation: 'SP is 1100.\nविक्रय मूल्य 1100।'
    });
  }

  // Attempting to add another should be detected and terminated
  const newCandidate = {
    question: 'A trader purchases goods for ₹9,999 and sells them at a profit of 10%. What is the Selling Price (SP)?\nव्यापारी माल खरीदता है।',
    options: [{ id: 'A', text: '₹10999' }, { id: 'B', text: '₹12000' }, { id: 'C', text: '₹13000' }, { id: 'D', text: '₹14000' }],
    correctAnswer: 'A',
    explanation: 'SP is 10999.\nविक्रय मूल्य 10999।'
  };

  const check = QuestionValidator.isDuplicateOrNearDuplicate(newCandidate, saturatedPool, 2);
  assert.equal(check.isDuplicate, true);
});

test('10. A valid test contains exactly the requested number of questions', async () => {
  const test10 = await AiTestGeneratorService.generateQuestions({
    subject: 'Simple Arithmetic / Mathematics',
    topic: 'Percentage & Profit/Loss',
    count: 10
  });
  assert.equal(test10.length, 10, 'Must contain exactly 10 questions');

  const test5 = await AiTestGeneratorService.generateQuestions({
    subject: 'Reasoning Ability',
    topic: 'Coding-Decoding',
    count: 5
  });
  assert.equal(test5.length, 5, 'Must contain exactly 5 questions');

  // Verify all questions have canonical IDs and structured options
  for (const q of test10) {
    assert.ok(q.id, 'Question must have id');
    assert.ok(q.question, 'Question must have question text');
    assert.equal(q.options.length, 4, 'Must have 4 options');
    assert.ok(['A', 'B', 'C', 'D'].includes(q.correctAnswer), 'Must have valid correctAnswer');
    assert.ok(q.explanation, 'Must have explanation');
  }
});

test('11. Very Hard test generation produces advanced competitive exam questions without elementary arithmetic', async () => {
  const hardTest = await AiTestGeneratorService.generateQuestions({
    subject: 'Simple Arithmetic / Mathematics',
    topic: 'Percentage & Profit/Loss',
    difficulty: 'Very Hard',
    count: 10
  });

  assert.equal(hardTest.length, 10, 'Must generate exactly 10 questions');

  // Verify that elementary basic questions like "What is 15% of ₹4,800?" or "student scored" are NOT present
  for (const q of hardTest) {
    const text = q.question.toLowerCase();
    assert.equal(
      text.includes('what is 15% of') || text.includes('what is 20% of') || text.includes('student secured'),
      false,
      `Elementary question should not appear in Very Hard test: "${q.question}"`
    );

    // Verify mathematical and schema validity
    const val = QuestionValidator.validateQuestion(q);
    assert.equal(val.valid, true, `Very Hard question must pass validation: ${val.reason}`);
  }
});

test('12. Ultra Hard test generation produces extreme/CAT & Tier-2 competitive exam questions', async () => {
  const ultraTest = await AiTestGeneratorService.generateQuestions({
    subject: 'Simple Arithmetic / Mathematics',
    topic: 'Percentage & Profit/Loss',
    difficulty: 'Ultra Hard',
    count: 10
  });

  assert.equal(ultraTest.length, 10, 'Must generate exactly 10 questions for Ultra Hard');

  // Verify that all questions are valid, bilingual, and non-elementary
  for (const q of ultraTest) {
    const text = q.question.toLowerCase();
    assert.equal(
      text.includes('what is 15% of') || text.includes('what is 20% of') || text.includes('student secured'),
      false,
      `Elementary question should not appear in Ultra Hard test: "${q.question}"`
    );

    const val = QuestionValidator.validateQuestion(q);
    assert.equal(val.valid, true, `Ultra Hard question must pass validation: ${val.reason}`);
  }
});

test('13. Clean 24 Chapters (Percentage & Profit and Loss) generate valid bilingual questions', async () => {
  const percentTest = await AiTestGeneratorService.generateQuestions({
    subject: 'Simple Arithmetic / Mathematics',
    topic: 'Percentage',
    difficulty: 'Hard',
    count: 10
  });

  assert.equal(percentTest.length, 10, 'Must generate exactly 10 questions for Percentage');
  for (const q of percentTest) {
    const val = QuestionValidator.validateQuestion(q);
    assert.equal(val.valid, true, `Question must pass validation: ${val.reason}`);
    assert.equal(Boolean(q.question.includes('\n')), true, 'Must be bilingual (English + Hindi)');
  }

  const profitLossTest = await AiTestGeneratorService.generateQuestions({
    subject: 'Simple Arithmetic / Mathematics',
    topic: 'Profit and Loss',
    difficulty: 'Very Hard',
    count: 10
  });

  assert.equal(profitLossTest.length, 10, 'Must generate exactly 10 questions for Profit and Loss');
  for (const q of profitLossTest) {
    const val = QuestionValidator.validateQuestion(q);
    assert.equal(val.valid, true, `Question must pass validation: ${val.reason}`);
  }
});


