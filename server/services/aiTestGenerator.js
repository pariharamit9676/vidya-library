import { ENV } from '../config/env.js';

// High-Yield Authentic Exam Questions Bank (TCS / NTA / Vyapam Pattern)
const CURATED_EXAM_QUESTIONS = [
  // --- POLITY & CONSTITUTION ---
  {
    exam: 'SSC',
    subject: 'Indian Polity',
    topic: 'Fundamental Rights & Articles',
    difficulty: 'Medium',
    question: 'भारतीय संविधान के किस अनुच्छेद के तहत "समानता का अधिकार" (Right to Equality) का प्रावधान है?',
    options: [
      { id: 'A', text: 'अनुच्छेद 14 से 18' },
      { id: 'B', text: 'अनुच्छेद 19 से 22' },
      { id: 'C', text: 'अनुच्छेद 23 से 24' },
      { id: 'D', text: 'अनुच्छेद 25 से 28' }
    ],
    correctAnswer: 'A',
    explanation: 'भारतीय संविधान के भाग III में अनुच्छेद 14 से 18 तक विधि के समक्ष समानता और अवसरों की समानता का अधिकार दिया गया है।'
  },
  {
    exam: 'SSC',
    subject: 'Indian Polity',
    topic: 'Fundamental Rights & Articles',
    difficulty: 'Hard',
    question: 'डॉ. बी.आर. अम्बेडकर ने किस अनुच्छेद को "संविधान का हृदय और आत्मा" (Heart and Soul of the Constitution) कहा था?',
    options: [
      { id: 'A', text: 'अनुच्छेद 14' },
      { id: 'B', text: 'अनुच्छेद 19' },
      { id: 'C', text: 'अनुच्छेद 21' },
      { id: 'D', text: 'अनुच्छेद 32' }
    ],
    correctAnswer: 'D',
    explanation: 'अनुच्छेद 32 (संवैधानिक उपचारों का अधिकार) नागरिकों को मौलिक अधिकारों के उल्लंघन पर सीधे सुप्रीम कोर्ट जाने की शक्ति देता है।'
  },
  {
    exam: 'SSC',
    subject: 'Indian Polity',
    topic: 'Preamble & Amendments',
    difficulty: 'Medium',
    question: '42वें संविधान संशोधन अधिनियम (1976) द्वारा प्रस्तावना में कौन से तीन शब्द जोड़े गए थे?',
    options: [
      { id: 'A', text: 'समाजवादी, धर्मनिरपेक्ष और अखंडता' },
      { id: 'B', text: 'संप्रभु, लोकतांत्रिक और गणराज्य' },
      { id: 'C', text: 'स्वतंत्रता, समानता और बंधुत्व' },
      { id: 'D', text: 'न्याय, विचार और अभिव्यक्ति' }
    ],
    correctAnswer: 'A',
    explanation: '42वें संशोधन (1976) द्वारा संविधान की प्रस्तावना में "समाजवादी", "पंथनिरपेक्ष" (धर्मनिरपेक्ष), और "अखंडता" शब्द जोड़े गए।'
  },

  // --- MP SPECIAL GK (MP POLICE / VYAPAM / MPPSC) ---
  {
    exam: 'MP Police',
    subject: 'MP General Knowledge',
    topic: 'MP Geography & National Parks',
    difficulty: 'Medium',
    question: 'मध्य प्रदेश का सबसे बड़ा राष्ट्रीय उद्यान कौन सा है, जिसमें "टाइगर प्रोजेक्ट" सबसे पहले लागू हुआ था?',
    options: [
      { id: 'A', text: 'बांधवगढ़ राष्ट्रीय उद्यान' },
      { id: 'B', text: 'कान्हा किसली राष्ट्रीय उद्यान' },
      { id: 'C', text: 'पेंच राष्ट्रीय उद्यान' },
      { id: 'D', text: 'सतपुड़ा राष्ट्रीय उद्यान' }
    ],
    correctAnswer: 'B',
    explanation: 'कान्हा किसली राष्ट्रीय उद्यान (मंडला/बालाघाट) 940 वर्ग किमी क्षेत्र में फैला मध्य प्रदेश का सबसे बड़ा नेशनल पार्क है, जहां 1974 में प्रोजेक्ट टाइगर शुरू हुआ था।'
  },
  {
    exam: 'MP Police',
    subject: 'MP General Knowledge',
    topic: 'MP History & Culture',
    difficulty: 'Medium',
    question: 'ग्वालियर के किले का निर्माण 8वीं शताब्दी में किस तोमर/पाल शासक द्वारा करवाया गया था, जिसे "जिब्राल्टर ऑफ इंडिया" कहा जाता है?',
    options: [
      { id: 'A', text: 'राजा मानसिंह तोमर' },
      { id: 'B', text: 'राजा सूरज सेन' },
      { id: 'C', text: 'महादजी सिंधिया' },
      { id: 'D', text: 'राजा भोज' }
    ],
    correctAnswer: 'B',
    explanation: 'ग्वालियर किले की नींव राजा सूरज सेन ने ऋषि गालव के सम्मान में रखी थी। बाद में मानसिंह तोमर ने मान मंदिर महल बनवाया।'
  },
  {
    exam: 'MP Police',
    subject: 'MP General Knowledge',
    topic: 'MP Rivers & Geography',
    difficulty: 'Medium',
    question: 'मध्य प्रदेश की जीवन रेखा कही जाने वाली "नर्मदा नदी" का उद्गम स्थल कहाँ से है?',
    options: [
      { id: 'A', text: 'जानापाव पहाड़ी (इंदौर)' },
      { id: 'B', text: 'अमरकंटक (अनूपपुर)' },
      { id: 'C', text: 'मुलताई (बैतूल)' },
      { id: 'D', text: 'कुम्बरा गांव (रायसेन)' }
    ],
    correctAnswer: 'B',
    explanation: 'नर्मदा नदी अनूपपुर जिले के अमरकंटक के मैकल पर्वत श्रृंखला से निकलती है और खंभात की खाड़ी (अरब सागर) में गिरती है।'
  },

  // --- REASONING (TCS SPEED TEST) ---
  {
    exam: 'Railways',
    subject: 'Reasoning Ability',
    topic: 'Number Series & Analogy',
    difficulty: 'Medium',
    question: 'निम्नलिखित श्रृंखला में अगला पद क्या होगा? 4, 9, 25, 49, 121, ?',
    options: [
      { id: 'A', text: '144' },
      { id: 'B', text: '169' },
      { id: 'C', text: '196' },
      { id: 'D', text: '225' }
    ],
    correctAnswer: 'B',
    explanation: 'यह अभाज्य संख्याओं (Prime Numbers) के वर्ग की श्रृंखला है: 2²=4, 3²=9, 5²=25, 7²=49, 11²=121, और अगली अभाज्य संख्या 13 है, 13² = 169।'
  },
  {
    exam: 'SSC',
    subject: 'Reasoning Ability',
    topic: 'Coding-Decoding',
    difficulty: 'Medium',
    question: 'यदि किसी निश्चित कूट भाषा में "BRAIN" को "CSBJO" लिखा जाता है, तो "MAKER" को उसी कूट भाषा में क्या लिखा जाएगा?',
    options: [
      { id: 'A', text: 'NBLFS' },
      { id: 'B', text: 'NBKFS' },
      { id: 'C', text: 'NCLES' },
      { id: 'D', text: 'MBLFS' }
    ],
    correctAnswer: 'A',
    explanation: 'पैटर्न है प्रत्येक अक्षर में +1: M(+1)=N, A(+1)=B, K(+1)=L, E(+1)=F, R(+1)=S -> "NBLFS"।'
  },
  {
    exam: 'SSC',
    subject: 'Reasoning Ability',
    topic: 'Blood Relations',
    difficulty: 'Hard',
    question: 'एक महिला की ओर इशारा करते हुए अमित ने कहा, "वह मेरी माँ के एकमात्र पुत्र की पत्नी की पुत्री है।" अमित का उस महिला से क्या संबंध है?',
    options: [
      { id: 'A', text: 'चाचा' },
      { id: 'B', text: 'भाई' },
      { id: 'C', text: 'पिता' },
      { id: 'D', text: 'दादा' }
    ],
    correctAnswer: 'C',
    explanation: 'अमित की माँ का एकमात्र पुत्र स्वयं अमित है। उसकी पत्नी की पुत्री अमित की अपनी पुत्री होगी। अतः अमित उस महिला का पिता है।'
  },

  // --- GENERAL SCIENCE ---
  {
    exam: 'Railways',
    subject: 'General Science',
    topic: 'Physics & Motion',
    difficulty: 'Easy',
    question: 'कार्य (Work) और ऊर्जा (Energy) का SI मात्रक क्या होता है?',
    options: [
      { id: 'A', text: 'न्यूटन (Newton)' },
      { id: 'B', text: 'जूल (Joule)' },
      { id: 'C', text: 'वाट (Watt)' },
      { id: 'D', text: 'पास्कल (Pascal)' }
    ],
    correctAnswer: 'B',
    explanation: 'कार्य और ऊर्जा का SI मात्रक "जूल" (Joule) होता है, जबकि शक्ति (Power) का वाट और बल का न्यूटन होता है।'
  },
  {
    exam: 'SSC',
    subject: 'General Science',
    topic: 'Biology & Human Body',
    difficulty: 'Medium',
    question: 'मानव शरीर में रक्त का शुद्धिकरण (Filtration of Blood) किस अंग द्वारा होता है?',
    options: [
      { id: 'A', text: 'हृदय (Heart)' },
      { id: 'B', text: 'यकृत (Liver)' },
      { id: 'C', text: 'वृक्क / गुर्दा (Kidney)' },
      { id: 'D', text: 'फेफड़े (Lungs)' }
    ],
    correctAnswer: 'C',
    explanation: 'वृक्क (Kidney) में स्थित नेफ्रॉन (Nephron) रक्त से अपशिष्ट पदार्थों और यूरिया को छानकर मूत्र के रूप में बाहर निकालते हैं।'
  },

  // --- MODERN HISTORY ---
  {
    exam: 'SSC',
    subject: 'Indian History',
    topic: 'Modern History & National Movement',
    difficulty: 'Medium',
    question: 'वर्ष 1919 में जलियांवाला बाग हत्याकांड के विरोध में किसने अपनी "नाइटहुड" (Knighthood) की उपाधि ब्रिटिश सरकार को लौटा दी थी?',
    options: [
      { id: 'A', text: 'महात्मा गांधी' },
      { id: 'B', text: 'रवींद्रनाथ टैगोर' },
      { id: 'C', text: 'सुभाष चंद्र बोस' },
      { id: 'D', text: 'बाल गंगाधर तिलक' }
    ],
    correctAnswer: 'B',
    explanation: '13 अप्रैल 1919 के जलियांवाला बाग नरसंहार से व्यथित होकर रवींद्रनाथ टैगोर ने ब्रिटिश उपाधि "नाइटहुड" वापस कर दी थी।'
  },
  {
    exam: 'SSC',
    subject: 'Indian History',
    topic: 'Ancient India',
    difficulty: 'Hard',
    question: 'मौर्य साम्राज्य में "अर्थशास्त्र" के रचयिता चाणक्य को अन्य किस नाम से भी जाना जाता है?',
    options: [
      { id: 'A', text: 'विष्णुगुप्त' },
      { id: 'B', text: 'समुद्रगुप्त' },
      { id: 'C', text: 'बाणभट्ट' },
      { id: 'D', text: 'हरिषेण' }
    ],
    correctAnswer: 'A',
    explanation: 'चाणक्य को कौटिल्य और विष्णुगुप्त दोनों नामों से जाना जाता है। वे चंद्रगुप्त मौर्य के प्रधानमंत्री और गुरु थे।'
  },

  // --- GEOGRAPHY ---
  {
    exam: 'SSC',
    subject: 'Geography',
    topic: 'Indian Geography',
    difficulty: 'Medium',
    question: 'भारत का सबसे ऊंचा जलप्रपात "कुंचिकल फॉल्स" किस राज्य में स्थित है?',
    options: [
      { id: 'A', text: 'कर्नाटक' },
      { id: 'B', text: 'मध्य प्रदेश' },
      { id: 'C', text: 'केरल' },
      { id: 'D', text: 'उत्तराखंड' }
    ],
    correctAnswer: 'A',
    explanation: 'कुंचिकल जलप्रपात कर्नाटक के शिमोगा जिले में वाराही नदी पर स्थित है, जिसकी कुल ऊंचाई लगभग 455 मीटर है।'
  },
  {
    exam: 'Banking',
    subject: 'Economy & Banking',
    topic: 'Monetary Policy & RBI',
    difficulty: 'Medium',
    question: 'वह ब्याज दर जिस पर भारतीय रिजर्व बैंक (RBI) वाणिज्यिक बैंकों को अल्पकालिक ऋण देता है, क्या कहलाती है?',
    options: [
      { id: 'A', text: 'रिवर्स रेपो रेट' },
      { id: 'B', text: 'रेपो रेट (Repo Rate)' },
      { id: 'C', text: 'बैंक दर (Bank Rate)' },
      { id: 'D', text: 'नकद आरक्षित अनुपात (CRR)' }
    ],
    correctAnswer: 'B',
    explanation: 'रेपो रेट वह दर है जिस पर कमर्शियल बैंक अपनी तरलता की कमी को पूरा करने के लिए RBI से लोन लेते हैं।'
  },

  // --- QUANTITATIVE APTITUDE (MATHS) ---
  {
    exam: 'SSC',
    subject: 'Quantitative Aptitude',
    topic: 'Percentage & Profit/Loss',
    difficulty: 'Medium',
    question: 'एक दुकानदार किसी वस्तु के क्रय मूल्य पर 20% का लाभ कमाता है। यदि वह वस्तु का विक्रय मूल्य ₹720 रखता है, तो वस्तु का क्रय मूल्य (Cost Price) क्या होगा?',
    options: [
      { id: 'A', text: '₹580' },
      { id: 'B', text: '₹600' },
      { id: 'C', text: '₹620' },
      { id: 'D', text: '₹640' }
    ],
    correctAnswer: 'B',
    explanation: 'CP = SP / (1 + Profit%) = 720 / 1.20 = ₹600।'
  },
  {
    exam: 'SSC',
    subject: 'Quantitative Aptitude',
    topic: 'Ratio & Proportion',
    difficulty: 'Medium',
    question: 'दो संख्याओं का अनुपात 3 : 5 है और उनका योग 240 है। दोनों संख्याओं में से बड़ी संख्या क्या होगी?',
    options: [
      { id: 'A', text: '90' },
      { id: 'B', text: '120' },
      { id: 'C', text: '150' },
      { id: 'D', text: '180' }
    ],
    correctAnswer: 'C',
    explanation: 'अनुपाती योग = 3 + 5 = 8 इकाई = 240, अतः 1 इकाई = 30। बड़ी संख्या = 5 × 30 = 150।'
  },
  {
    exam: 'Railways',
    subject: 'Quantitative Aptitude',
    topic: 'Simple Interest',
    difficulty: 'Easy',
    question: '₹5,000 की राशि पर 10% वार्षिक साधारण ब्याज की दर से 3 वर्ष का साधारण ब्याज कितना होगा?',
    options: [
      { id: 'A', text: '₹1,000' },
      { id: 'B', text: '₹1,200' },
      { id: 'C', text: '₹1,500' },
      { id: 'D', text: '₹1,800' }
    ],
    correctAnswer: 'C',
    explanation: 'SI = (P × R × T) / 100 = (5000 × 10 × 3) / 100 = ₹1,500।'
  },
  {
    exam: 'MP Police',
    subject: 'Quantitative Aptitude',
    topic: 'Time and Work',
    difficulty: 'Medium',
    question: 'A किसी कार्य को 12 दिनों में और B उसी कार्य को 24 दिनों में पूरा कर सकता है। दोनों मिलकर उस कार्य को कितने दिनों में समाप्त करेंगे?',
    options: [
      { id: 'A', text: '6 दिन' },
      { id: 'B', text: '8 दिन' },
      { id: 'C', text: '10 दिन' },
      { id: 'D', text: '16 दिन' }
    ],
    correctAnswer: 'B',
    explanation: 'कुल कार्य (LCM of 12, 24) = 24 इकाई। A की कार्यक्षमता = 2 इकाई/दिन, B की = 1 इकाई/दिन। दोनों का संयुक्त समय = 24 / (2 + 1) = 8 दिन।'
  }
];

export class AiTestGeneratorService {
  /**
   * Main method to generate exam questions using Gemini API or Fallback Bank
   */
  static async generateQuestions({
    exam = 'SSC',
    subject = 'General Studies',
    topic = 'General',
    difficulty = 'Medium',
    count = 10,
    language = 'Hindi',
    excludeQuestions = []
  }) {
    const targetCount = Math.min(Math.max(Number(count) || 10, 5), 100);
    const geminiKey = process.env.GEMINI_API_KEY || '';

    // If large paper requested (e.g. 50 or 100 questions), generate in parallel batches!
    if (targetCount > 25) {
      return this.generateLargePaperBatches({
        geminiKey,
        exam,
        subject,
        topic,
        difficulty,
        totalCount: targetCount,
        language,
        excludeQuestions
      });
    }

    // Standard <= 25 questions single-batch generation
    if (geminiKey) {
      try {
        console.log(`🤖 [AI Generator] Calling Gemini API for ${exam} - ${subject} (${topic}) with anti-repetition filter (${excludeQuestions.length} excluded)...`);
        const aiQuestions = await this.callGeminiApi({
          apiKey: geminiKey,
          exam,
          subject,
          topic,
          difficulty,
          count: targetCount,
          language,
          excludeQuestions
        });

        if (Array.isArray(aiQuestions) && aiQuestions.length >= 5) {
          console.log(`✅ [AI Generator] Successfully generated ${aiQuestions.length} unique questions from Gemini API.`);
          return aiQuestions;
        }
      } catch (geminiError) {
        console.warn(`⚠️ [AI Generator] Gemini API call failed (${geminiError.message}), falling back to intelligent bank.`);
      }
    }

    // Fallback: Intelligent Pattern-Matched Generation from Curated Question Bank with procedural dynamic variants
    return this.generateFromCuratedBank({
      exam,
      subject,
      topic,
      difficulty,
      count: targetCount,
      language,
      excludeQuestions
    });
  }

  /**
   * Multi-batch parallel generator for 50 to 100 question full-length mock papers
   */
  /**
   * Multi-batch parallel generator for 50 to 100 question full-length mock papers
   */
  static async generateLargePaperBatches({
    geminiKey,
    exam,
    subject,
    topic,
    difficulty,
    totalCount = 100,
    language = 'Hindi',
    excludeQuestions = []
  }) {
    console.log(`🚀 [AI Generator] Starting Full-Length Paper Generator (${totalCount} Questions) for ${exam} - ${subject}...`);

    // Using 10 questions per batch guarantees clean JSON, fast execution, and zero output token truncation!
    const batchSize = 10;
    const numBatches = Math.ceil(totalCount / batchSize); // e.g. 100 / 10 = 10 batches
    const batchSpecs = [];
    const isFullExam =
      subject.toLowerCase().includes('full') ||
      subject.toLowerCase().includes('all') ||
      topic.toLowerCase().includes('full mock');

    // 10 Section topics for 100-Question Comprehensive Paper
    const fullExamTopics = [
      { sub: 'Quantitative Aptitude', top: 'Arithmetic: Percentage, Profit-Loss, Discount & Ratio' },
      { sub: 'Quantitative Aptitude', top: 'Arithmetic: Time & Work, Pipes, Speed, Time & Distance' },
      { sub: 'Quantitative Aptitude', top: 'Commercial Math: Simple & Compound Interest, Averages & Partnership' },
      { sub: 'Reasoning Ability', top: 'Coding-Decoding, Letter & Number Series, Alphabetical Tests' },
      { sub: 'Reasoning Ability', top: 'Blood Relations, Direction Sense, Order & Ranking' },
      { sub: 'Reasoning Ability', top: 'Syllogism, Venn Diagrams, Statement & Logical Deductions' },
      { sub: 'General Science', top: 'Physics: Motion, SI Units, Optics, Electricity & Energy Laws' },
      { sub: 'General Science', top: 'Chemistry & Biology: Human Body, Diseases, Periodic Elements & Acids' },
      {
        sub: exam.includes('MP') ? 'MP General Knowledge' : 'Indian Polity',
        top: exam.includes('MP') ? 'MP Geography, Rivers, Dams, National Parks & Districts' : 'Indian Constitution, Articles, Amendments, Parliament & President'
      },
      {
        sub: exam.includes('MP') ? 'MP General Knowledge' : 'Indian History',
        top: exam.includes('MP') ? 'MP History, Forts, 1857 Revolt in MP & Tribal Freedom Fighters' : 'Modern Indian History: 1857 Revolt, Freedom Struggle & National Movements'
      }
    ];

    const quantModules = [
      'Percentage, Profit & Loss and Successive Discounts',
      'Ratio, Proportion, Mixtures and Allegations',
      'Time & Work, Pipes, Cisterns and Efficiency',
      'Speed, Distance, Time, Trains and Boat/Streams',
      'Simple Interest and Compound Interest with yearly/half-yearly rates',
      'Averages, Age Problems and Weighted Means',
      'Number System, Prime Factors, Divisibility Rules and Unit Digits',
      'LCM, HCF and Remainder Theorem',
      'Mensuration: 2D Area, Perimeter of Circles, Triangles, Quadrilaterals',
      'Mensuration: 3D Surface Area, Volume of Cylinders, Cones, Spheres & DI'
    ];

    const reasoningModules = [
      'Coding-Decoding (Direct, Reverse and Mathematical shifts)',
      'Letter Series, Number Series and Missing Term in Matrix',
      'Blood Relations (Direct, Coded and Pointing-type)',
      'Direction Sense Test (Angle turns, Shadows and Multi-point paths)',
      'Syllogism (All, Some, No, Possibility cases)',
      'Venn Diagrams and Logical Class Intersections',
      'Order and Ranking (Row arrangements and Position shifts)',
      'Seating Arrangement (Linear and Circular with facing)',
      'Analogy and Word/Number Odd One Out',
      'Non-Verbal Pattern Completion, Paper Folding and Water/Mirror Images'
    ];

    for (let b = 0; b < numBatches; b++) {
      let batchSubject = subject;
      let batchTopic = topic;

      if (isFullExam) {
        const item = fullExamTopics[b % fullExamTopics.length];
        batchSubject = item.sub;
        batchTopic = `${item.top} [Exam: ${exam}]`;
      } else if (subject === 'Quantitative Aptitude') {
        batchTopic = `${topic} • Part ${b + 1}: ${quantModules[b % quantModules.length]}`;
      } else if (subject === 'Reasoning Ability') {
        batchTopic = `${topic} • Part ${b + 1}: ${reasoningModules[b % reasoningModules.length]}`;
      } else {
        batchTopic = `${topic} • Sub-Topic Module ${b + 1} (Comprehensive Coverage)`;
      }

      batchSpecs.push({
        batchIndex: b,
        subject: batchSubject,
        topic: batchTopic,
        count: Math.min(batchSize, totalCount - b * batchSize)
      });
    }

    // Run all micro-batches concurrently via Promise.allSettled
    const batchPromises = batchSpecs.map(async (spec) => {
      try {
        if (geminiKey) {
          const res = await this.callGeminiApi({
            apiKey: geminiKey,
            exam,
            subject: spec.subject,
            topic: spec.topic,
            difficulty,
            count: spec.count,
            language,
            excludeQuestions
          });
          if (Array.isArray(res) && res.length >= 3) {
            return res;
          }
        }
      } catch (err) {
        console.warn(`[AI Generator] Batch ${spec.batchIndex + 1} (${spec.subject}) error: ${err.message}`);
      }

      // Procedural fallback for this batch
      return this.generateFromCuratedBank({
        exam,
        subject: spec.subject,
        topic: spec.topic,
        difficulty,
        count: spec.count,
        language,
        excludeQuestions
      });
    });

    const results = await Promise.allSettled(batchPromises);
    const allQuestions = [];

    for (let i = 0; i < results.length; i++) {
      const res = results[i];
      if (res.status === 'fulfilled' && Array.isArray(res.value)) {
        allQuestions.push(...res.value);
      } else {
        const fill = this.generateFromCuratedBank({
          exam,
          subject: batchSpecs[i].subject,
          topic: batchSpecs[i].topic,
          difficulty,
          count: batchSpecs[i].count,
          language
        });
        allQuestions.push(...fill);
      }
    }

    // Deduplicate any accidental overlapping texts
    const uniqueMap = new Map();
    for (const q of allQuestions) {
      if (q && q.question) {
        const key = q.question.trim().slice(0, 40).toLowerCase();
        if (!uniqueMap.has(key)) {
          uniqueMap.set(key, q);
        }
      }
    }

    const uniqueList = Array.from(uniqueMap.values());

    // If slightly less than totalCount, top up with procedurally generated unique questions
    while (uniqueList.length < totalCount) {
      const idx = uniqueList.length;
      uniqueList.push(
        this.applyProceduralVariation(
          CURATED_EXAM_QUESTIONS[idx % CURATED_EXAM_QUESTIONS.length],
          idx + 10
        )
      );
    }

    // Re-index all questions cleanly from 1 to totalCount
    const finalQuestions = uniqueList.slice(0, totalCount).map((q, idx) => ({
      ...q,
      id: `q_${Date.now()}_${idx + 1}`
    }));

    console.log(`✅ [AI Generator] Successfully compiled full-length paper of ${finalQuestions.length} questions!`);
    return finalQuestions;
  }

  /**
   * Tolerant JSON parser to rescue questions from truncated or escaped LLM strings
   */
  static tolerantParseQuestions(rawContent) {
    if (!rawContent || typeof rawContent !== 'string') return [];

    // 1. Try standard JSON.parse on array match
    try {
      const jsonMatch = rawContent.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const sanitized = jsonMatch[0].replace(/,\s*([\]}])/g, '$1');
        const parsed = JSON.parse(sanitized);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}

    // 2. Try cleanup of common markdown fences and control chars
    try {
      let cleaned = rawContent
        .replace(/```json/gi, '')
        .replace(/```/g, '')
        .trim();
      const start = cleaned.indexOf('[');
      const end = cleaned.lastIndexOf(']');
      if (start !== -1 && end !== -1 && end > start) {
        cleaned = cleaned.slice(start, end + 1);
      }
      cleaned = cleaned.replace(/,\s*([\]}])/g, '$1');
      const parsed = JSON.parse(cleaned);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch (e) {}

    // 3. Fallback: Parse individual question objects one by one
    const questions = [];
    const objectRegex = /\{\s*"id"\s*:[\s\S]*?"difficulty"\s*:\s*"[^"]+"\s*\}/g;
    let match;
    while ((match = objectRegex.exec(rawContent)) !== null) {
      try {
        const q = JSON.parse(match[0]);
        if (q && q.question && Array.isArray(q.options)) {
          questions.push(q);
        }
      } catch (err) {
        try {
          const repaired = match[0].replace(
            /"(question|explanation)"\s*:\s*"([\s\S]*?)"\s*,\s*"(options|subject)"/g,
            (m, key, val, nextKey) => {
              const escapedVal = val.replace(/(?<!\\)"/g, '\\"');
              return `"${key}": "${escapedVal}", "${nextKey}"`;
            }
          );
          const q = JSON.parse(repaired);
          if (q && q.question) questions.push(q);
        } catch (err2) {}
      }
    }

    return questions;
  }

  /**
   * Direct Gemini API invocation with strict zero-repetition and high-entropy parameters
   */
  static async callGeminiApi({ apiKey, exam, subject, topic, difficulty, count, language, excludeQuestions = [] }) {
    // Generate a unique entropy salt to ensure distinct sampling paths
    const dynamicSeed = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    // Build exclusion clause if previous questions are provided
    let exclusionClause = '';
    if (Array.isArray(excludeQuestions) && excludeQuestions.length > 0) {
      const sampleExcluded = excludeQuestions
        .filter(q => typeof q === 'string' && q.trim().length > 10)
        .slice(0, 30)
        .map((q, idx) => `${idx + 1}. "${q.replace(/\s+/g, ' ').trim()}"`)
        .join('\n');

      if (sampleExcluded) {
        exclusionClause = `
CRITICAL ZERO-REPETITION MANDATE (ABSOLUTE REQUIREMENT):
The following questions have ALREADY been asked in previous tests for this student. You MUST NOT repeat any of them, nor should you generate minor number clones of them:
--- PREVIOUSLY ASKED QUESTIONS (STRICTLY FORBIDDEN TO REPEAT) ---
${sampleExcluded}
--- END FORBIDDEN LIST ---
Generate completely NOVEL, UNSEEN, and UNIQUE questions with fresh scenarios, different numerical values, diverse names, and different question structures!
`;
      }
    }

    const prompt = `
You are a senior paper setter for Indian competitive exams (TCS, NTA, SSC, Railway RRB, MP Vyapam/Police, IBPS).
Generate exactly ${count} 100% NEW, NEVER-BEFORE-SEEN multiple-choice questions (MCQs) for the following requirement:

- Target Exam: ${exam}
- Subject: ${subject}
- Specific Topic: ${topic}
- Difficulty Level: ${difficulty} (strictly match official exam pattern, avoid childish questions)
- Language: ${language} (Write question, options, and explanation in clean ${language})
- Session Entropy Seed: [Nonce: ${dynamicSeed}]

${exclusionClause}

CRITICAL RULES & DIVERSITY MANDATE:
1. STRICT SUBJECT & TOPIC ACCURACY:
   - If Subject is "Quantitative Aptitude" or "Mathematics", questions MUST BE purely numerical math/arithmetic problems (e.g., Percentage, Profit and Loss, Ratio and Proportion, Time and Work, Simple & Compound Interest, Averages, Speed-Time-Distance) with numerical calculations and step-by-step mathematical working in the explanation. DO NOT generate GK/Polity questions when Quantitative Aptitude is requested!
   - If Subject is "Reasoning Ability", questions MUST BE logical/analytical reasoning (e.g., Coding-Decoding, Number/Letter Series, Blood Relations, Syllogism, Direction Sense, Analogy).
   - If Subject is "General Science", questions MUST BE Physics, Chemistry, or Biology.
   - If Subject is "Indian Polity", questions MUST BE Constitution, Articles, Amendments, Parliament, Judiciary.
2. NO CLICHÉ OR REPETITIVE QUESTIONS:
   - For Mathematics: DO NOT use cliché textbook questions (NEVER use "sugar price increases by 20%", NEVER use "15 CP = 12 SP", NEVER use standard "A in 10 days, B in 15 days").
   - Instead, use diverse real-world settings: smartphone trade-in discounts, electric scooter battery range & mileage, solar panel power output, metro train passenger count between Indian cities, sports tournament run rates, wholesale grain trade, banking EMI and fixed deposit interest, modern retail offers.
   - Use diverse names (Rohan, Priya, Kavita, Vikram, Farhan, Ananya, Harpreet, Deepak) and diverse realistic numbers.
3. Every question must have exactly 4 plausible options labeled A, B, C, D.
4. Only one option must be unambiguously correct.
5. Include a comprehensive 1-2 sentence solution explaining why that option is correct.
6. Output MUST BE strictly valid JSON array of objects with NO markdown formatting, NO backticks, NO extra text.

JSON Format:
[
  {
    "id": "q1",
    "question": "Question text in ${language}?",
    "options": [
      { "id": "A", "text": "Option A" },
      { "id": "B", "text": "Option B" },
      { "id": "C", "text": "Option C" },
      { "id": "D", "text": "Option D" }
    ],
    "correctAnswer": "A",
    "explanation": "Detailed solution explanation in ${language}.",
    "subject": "${subject}",
    "difficulty": "${difficulty}"
  }
]
`;

    // Try available Gemini models in order of quota and availability (avoiding depleted models)
    const models = ['gemini-3.5-flash', 'gemini-3.5-flash-lite', 'gemini-flash-lite-latest', 'gemini-3-flash-preview', 'gemini-3.1-flash-lite'];
    let lastError = null;

    for (const modelName of models) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              responseMimeType: 'application/json',
              temperature: 0.85, // Higher temperature for novelty, creativity and zero repeats
              topP: 0.95,
              maxOutputTokens: 8192
            }
          })
        });

        if (!response.ok) {
          const errText = await response.text();
          throw new Error(`Model ${modelName} returned status ${response.status}: ${errText}`);
        }

        const data = await response.json();
        const parts = data?.candidates?.[0]?.content?.parts || [];
        const nonThoughtPart = parts.find(p => p.text && !p.thoughtSignature);
        const rawContent = nonThoughtPart?.text || parts.map(p => p.text || '').join('\n');
        
        // Tolerant JSON extraction that handles unescaped quotes, trailing commas, and partial responses
        const parsed = this.tolerantParseQuestions(rawContent);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Post-generation deduplication against both internal batch and previously excluded questions
          const seenNormalized = new Set();
          const cleanQuestions = [];

          for (const q of parsed) {
            if (!q || !q.question || typeof q.question !== 'string') continue;
            const normText = q.question.trim().toLowerCase().replace(/[^\w\s\u0900-\u097F]/g, '');
            
            // Check within batch duplicates
            if (seenNormalized.has(normText)) continue;

            // Check against excluded past questions
            const isDuplicate = excludeQuestions.some(oldQ => {
              if (typeof oldQ !== 'string') return false;
              const oldNorm = oldQ.trim().toLowerCase().replace(/[^\w\s\u0900-\u097F]/g, '');
              if (oldNorm === normText) return true;
              if (normText.length > 25 && oldNorm.length > 25) {
                if (normText.includes(oldNorm.slice(0, 35)) || oldNorm.includes(normText.slice(0, 35))) {
                  return true;
                }
              }
              return false;
            });

            if (isDuplicate) {
              console.log(`[AI Generator] Filtered duplicate question: "${q.question.slice(0, 45)}..."`);
              continue;
            }

            seenNormalized.add(normText);
            cleanQuestions.push(q);
          }

          if (cleanQuestions.length >= 5) {
            return cleanQuestions.map((q, idx) => ({
              id: `q_${Date.now()}_${idx + 1}`,
              question: q.question,
              options: q.options,
              correctAnswer: q.correctAnswer || 'A',
              explanation: q.explanation || 'No explanation provided.',
              subject: q.subject || subject,
              difficulty: q.difficulty || difficulty
            }));
          }
        }
      } catch (err) {
        lastError = err;
        console.warn(`[AI Generator] Failed with ${modelName}:`, err.message);
      }
    }

    throw lastError || new Error('All Gemini models failed');
  }

  /**
   * Fallback: High-yield pattern matched generation with dynamic procedural variations
   */
  static generateFromCuratedBank({ exam, subject, topic, difficulty, count, excludeQuestions = [] }) {
    console.log(`📚 [Pattern Bank] Generating ${count} non-repeating questions for ${exam} - ${subject}...`);
    
    // 1. Try to find matched questions
    let matches = CURATED_EXAM_QUESTIONS.filter(q => {
      const examMatch = q.exam.toLowerCase().includes(exam.toLowerCase()) || exam.toLowerCase().includes(q.exam.toLowerCase());
      const subMatch = q.subject.toLowerCase().includes(subject.toLowerCase()) || subject.toLowerCase().includes(q.subject.toLowerCase());
      return examMatch || subMatch;
    });

    // If not enough matches, add more from curated list
    if (matches.length < count) {
      const remaining = CURATED_EXAM_QUESTIONS.filter(q => !matches.includes(q));
      matches = [...matches, ...remaining];
    }

    // Filter out any matches that were in excluded list
    const unaskedMatches = matches.filter(q => {
      return !excludeQuestions.some(oldQ => {
        if (typeof oldQ !== 'string') return false;
        return oldQ.trim().toLowerCase().includes(q.question.slice(0, 25).trim().toLowerCase());
      });
    });

    // Use unasked matches if available, else use matches with procedural variations
    const pool = unaskedMatches.length >= 3 ? unaskedMatches : matches;
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    const selected = [];

    for (let i = 0; i < count; i++) {
      const template = shuffled[i % shuffled.length];
      // Procedurally vary mathematical questions so numbers and answers are distinct
      const variedQuestion = this.applyProceduralVariation(template, i + 1);
      selected.push(variedQuestion);
    }

    return selected.map((q, idx) => ({
      id: `q_${Date.now()}_${idx + 1}`,
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      subject: q.subject || subject,
      difficulty: q.difficulty || difficulty
    }));
  }

  /**
   * Procedural variation generator to ensure math/numerical questions never repeat values
   */
  static applyProceduralVariation(template, variantIndex) {
    if (template.subject === 'Quantitative Aptitude') {
      // Dynamic Simple Interest variant
      if (template.topic === 'Simple Interest') {
        const P = 4000 + (variantIndex * 1500);
        const R = 8 + (variantIndex % 5);
        const T = 2 + (variantIndex % 3);
        const SI = (P * R * T) / 100;
        return {
          ...template,
          question: `₹${P.toLocaleString('en-IN')} की राशि पर ${R}% वार्षिक साधारण ब्याज की दर से ${T} वर्ष का साधारण ब्याज कितना होगा?`,
          options: [
            { id: 'A', text: `₹${(SI - 200).toLocaleString('en-IN')}` },
            { id: 'B', text: `₹${SI.toLocaleString('en-IN')}` },
            { id: 'C', text: `₹${(SI + 300).toLocaleString('en-IN')}` },
            { id: 'D', text: `₹${(SI + 500).toLocaleString('en-IN')}` }
          ],
          correctAnswer: 'B',
          explanation: `SI = (P × R × T) / 100 = (${P} × ${R} × ${T}) / 100 = ₹${SI.toLocaleString('en-IN')}।`
        };
      }

      // Dynamic Profit and Loss variant
      if (template.topic === 'Percentage & Profit/Loss') {
        const CP = 500 + (variantIndex * 100);
        const profitPercent = 10 + ((variantIndex * 5) % 30);
        const SP = Math.round(CP * (1 + profitPercent / 100));
        return {
          ...template,
          question: `एक व्यापारी एक उपकरण ₹${CP.toLocaleString('en-IN')} में खरीदता है और ${profitPercent}% लाभ पर बेचता है। उपकरण का विक्रय मूल्य (Selling Price) क्या होगा?`,
          options: [
            { id: 'A', text: `₹${(SP - 50).toLocaleString('en-IN')}` },
            { id: 'B', text: `₹${SP.toLocaleString('en-IN')}` },
            { id: 'C', text: `₹${(SP + 60).toLocaleString('en-IN')}` },
            { id: 'D', text: `₹${(SP + 100).toLocaleString('en-IN')}` }
          ],
          correctAnswer: 'B',
          explanation: `SP = CP × (1 + Profit%) = ${CP} × ${(1 + profitPercent / 100).toFixed(2)} = ₹${SP.toLocaleString('en-IN')}।`
        };
      }
    }

    // Default template with variant indicator
    return template;
  }
}
