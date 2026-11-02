/**
 * Canonical Question Taxonomy & Subject/Topic Mapping
 * Ensures 100% strict topic boundaries with zero cross-contamination.
 */

export const CANONICAL_TAXONOMY = {
  // 1. SIMPLE ARITHMETIC / MATHEMATICS
  MATH: {
    id: 'math',
    title: 'Simple Arithmetic / Mathematics',
    titleHi: 'सरल अंकगणित / गणित',
    aliases: ['simple arithmetic', 'mathematics', 'math', 'maths', 'अंकगणित', 'गणित'],
    topics: {
      PERCENT_PROFIT_LOSS: {
        id: 'math_percent_profit',
        title: 'Percentage & Profit/Loss',
        titleHi: 'प्रतिशत एवं लाभ-हानि',
        aliases: ['percentage & profit/loss', 'percentage', 'profit and loss', 'profit & loss', 'profit/loss', 'discount', 'प्रतिशत', 'लाभ-हानि', 'लाभ और हानि', 'छूट'],
        subtopics: [
          'basic_percentage',
          'profit_loss_calc',
          'cp_sp_finding',
          'marked_price_discount',
          'successive_discount_mixed'
        ],
        allowedKeywords: [
          '%', 'percent', 'percentage', 'profit', 'loss', 'cost price', 'selling price', 'marked price', 'discount',
          'successive discount', 'gain', 'cp', 'sp', 'mp',
          'प्रतिशत', 'लाभ', 'हानि', 'क्रय मूल्य', 'विक्रय मूल्य', 'अंकित मूल्य', 'छूट', 'बट्टा'
        ],
        disallowedKeywords: [
          'simple interest', 'compound interest', 'principal sum', 'rate of interest', 'per annum', 'si =', 'ci =',
          'annual rate', 'sum of money', 'interest on', 'invested at',
          'साधारण ब्याज', 'चक्रवृद्धि ब्याज', 'मूलधन', 'वार्षिक दर', 'ब्याज दर',
          'ratio and proportion', 'ratio of', 'time and work', 'pipes and cistern', 'speed and distance',
          'train', 'km/h', 'अनुपात', 'समानुपात', 'कार्य और समय', 'पाइप', 'टंकी', 'चाल', 'दूरी'
        ]
      },
      // 1. Number System
      NUMBER_SYSTEM: {
        id: 'math_number_system',
        title: 'Number System',
        titleHi: 'संख्या पद्धति',
        aliases: ['number system', 'संख्या पद्धति'],
        allowedKeywords: ['number system', 'divisibility', 'divisible', 'remainder', 'unit digit', 'divisor', 'quotient', 'prime', 'natural numbers', 'natural number', 'संख्या पद्धति', 'विभाज्यता', 'विभाज्य', 'शेषफल', 'इकाई अंक', 'भाजक', 'भागफल', 'अभाज्य', 'प्राकृतिक संख्याएं', 'प्राकृतिक संख्या'],
        disallowedKeywords: ['simple interest', 'compound interest', 'coding', 'blood relation']
      },
      // 2. LCM and HCF
      LCM_HCF: {
        id: 'math_lcm_hcf',
        title: 'LCM and HCF',
        titleHi: 'लघुत्तम समापवर्त्य एवं महत्तम समापवर्तक',
        aliases: ['lcm and hcf', 'hcf and lcm', 'lcm', 'hcf', 'लघुत्तम समापवर्त्य', 'महत्तम समापवर्तक', 'ल.स.', 'म.स.'],
        allowedKeywords: ['lcm', 'hcf', 'lowest common multiple', 'highest common factor', 'product of two numbers', 'least number', 'greatest number', 'divided by', 'divisible', 'remainder', 'bells', 'toll', 'interval', 'coprime', 'co-prime', 'pairs', 'circular track', 'sum of digits', 'लघुत्तम समापवर्त्य', 'महत्तम समापवर्तक', 'ल.स.', 'म.स.', 'लघुत्तम', 'महत्तम', 'छोटी से छोटी', 'बड़ी से बड़ी', 'शेषफल', 'शेष', 'घंटियां', 'अंतराल', 'सह-अभाज्य', 'विभाज्य'],
        disallowedKeywords: ['simple interest', 'compound interest']
      },
      // 3. Simplification
      SIMPLIFICATION: {
        id: 'math_simplification',
        title: 'Simplification',
        titleHi: 'सरलीकरण',
        aliases: ['simplification', 'bodmas', 'सरलीकरण'],
        subtopics: ['bodmas_rule', 'square_cube_roots', 'fractions_simplification'],
        allowedKeywords: ['simplification', 'simplify', 'bodmas', 'bracket', 'square root', 'cube root', 'fraction', 'decimal', 'recurring', 'value', 'सरलीकरण', 'सरल', 'वर्गमूल', 'घनमूल', 'भिन्न', 'दशमलव', 'मान'],
        disallowedKeywords: ['simple interest', 'compound interest']
      },
      // 4. Power, Indices and Surds
      POWER_INDICES_SURDS: {
        id: 'math_surds_indices',
        title: 'Power, Indices and Surds',
        titleHi: 'घात, घातांक एवं करणी',
        aliases: ['power, indices and surds', 'indices and surds', 'surds', 'indices', 'घातांक एवं करणी', 'करणी'],
        subtopics: ['indices_laws', 'surds_rationalization', 'comparing_surds'],
        allowedKeywords: ['power', 'indices', 'surds', 'rationalization', 'square root', 'cube root', '^', '√', '∛', 'exponent', 'fractional exponent', 'value', 'greater', 'smaller', 'घात', 'घातांक', 'करणी', 'परिमेयकरण', 'वर्गमूल', 'घनमूल', 'मान', 'बड़ा', 'बड़ी'],
        disallowedKeywords: ['simple interest', 'compound interest']
      },
      // 5. Average
      AVERAGE: {
        id: 'math_average',
        title: 'Average',
        titleHi: 'औसत',
        aliases: ['average', 'averages', 'औसत'],
        subtopics: ['basic_average', 'consecutive_average', 'error_correction', 'cricket_average', 'age_average'],
        allowedKeywords: ['average', 'mean', 'consecutive numbers', 'batting average', 'bowling average', 'cricket', 'runs', 'replacement', 'error correction', 'औसत', 'माध्य', 'क्रमागत संख्याएं', 'पारी', 'रन', 'औसत आयु'],
        disallowedKeywords: ['simple interest', 'compound interest']
      },
      // 6. Ratio and Proportion
      RATIO_PROPORTION: {
        id: 'math_ratio_proportion',
        title: 'Ratio and Proportion',
        titleHi: 'अनुपात एवं समानुपात',
        aliases: ['ratio and proportion', 'ratio & proportion', 'ratio', 'proportion', 'अनुपात', 'समानुपात'],
        subtopics: ['ratio_operations', 'coins_denominations', 'partnership', 'income_expenditure_ratio'],
        allowedKeywords: ['ratio', 'proportion', 'fourth proportional', 'mean proportional', 'partnership', 'coins', 'denominations', 'income and expenditure', 'अनुपात', 'समानुपात', 'चतुर्थानुपाती', 'मध्यानुपाती', 'साझेदारी', 'सिक्के', 'आय और व्यय'],
        disallowedKeywords: ['simple interest', 'compound interest']
      },
      // 7. Alligation or Mixture
      ALLIGATION_MIXTURE: {
        id: 'math_mixture',
        title: 'Alligation or Mixture',
        titleHi: 'मिश्रण',
        aliases: ['alligation or mixture', 'alligation', 'mixture', 'alligation & mixture', 'मिश्रण'],
        subtopics: ['mixture_ratio', 'alligation_rule', 'replacement_mixture'],
        allowedKeywords: ['mixture', 'alligation', 'milk and water', 'ratio of mixture', 'vessel', 'replaced with', 'alloy', 'alloys', 'zinc', 'copper', 'melted', 'liquid', 'मिश्रण', 'दूध और पानी', 'बर्तन', 'प्रतिस्थापन', 'मिश्रधातु', 'पिघलाकर', 'तांबा', 'जस्ता'],
        disallowedKeywords: ['simple interest', 'compound interest']
      },
      // 8. Percentage
      PERCENTAGE: {
        id: 'math_percentage',
        title: 'Percentage',
        titleHi: 'प्रतिशतता',
        aliases: ['percentage', 'प्रतिशत', 'प्रतिशतता'],
        subtopics: ['basic_percentage', 'price_consumption', 'exam_pass_fail', 'population_depreciation', 'election_votes', 'income_expenditure_savings'],
        allowedKeywords: ['percent', 'percentage', '%', 'increase', 'decrease', 'population', 'election', 'votes', 'marks', 'passing marks', 'consumption', 'expenditure', 'income', 'savings', 'प्रतिशत', 'प्रतिशतता', 'वृद्धि', 'कमी', 'खपत', 'आय', 'व्यय', 'बचत', 'चुनाव', 'मत', 'जनसंख्या', 'उत्तीर्ण', 'अंक'],
        disallowedKeywords: ['simple interest', 'compound interest', 'principal sum', 'rate of interest']
      },
      // 9. Profit and Loss
      PROFIT_LOSS: {
        id: 'math_profit_loss',
        title: 'Profit and Loss',
        titleHi: 'लाभ और हानि',
        aliases: ['profit and loss', 'profit & loss', 'profit/loss', 'लाभ और हानि', 'लाभ-हानि'],
        subtopics: ['basic_cp_sp', 'dishonest_dealer', 'cp_x_equals_sp_y', 'double_condition_shift', 'two_items_same_sp', 'price_quantity_variation'],
        allowedKeywords: ['cost price', 'selling price', 'profit', 'loss', 'gain', 'cp', 'sp', 'dishonest dealer', 'false weight', 'cross multiplication rate', 'double condition', 'same sp', 'two articles', 'क्रय मूल्य', 'विक्रय मूल्य', 'लाभ', 'हानि', 'बेईमान व्यापारी', 'गलत बाट', 'समान विक्रय मूल्य', 'दो वस्तुएं'],
        disallowedKeywords: ['simple interest', 'compound interest', 'principal sum', 'rate of interest']
      },
      // 10. Discount
      DISCOUNT: {
        id: 'math_discount',
        title: 'Discount',
        titleHi: 'बट्टा',
        aliases: ['discount', 'discounts', 'marked price', 'बट्टा', 'छूट', 'अंकित मूल्य'],
        subtopics: ['successive_discount', 'markup_with_discount', 'mp_cp_profit_formula', 'buy_x_get_y_free'],
        allowedKeywords: ['discount', 'successive discount', 'marked price', 'list price', 'markup', 'single equivalent discount', 'buy 3 get 1 free', 'बट्टा', 'छूट', 'क्रमिक बट्टा', 'अंकित मूल्य', 'सूची मूल्य'],
        disallowedKeywords: ['simple interest', 'compound interest', 'principal sum']
      },
      // 11. Simple Interest
      SIMPLE_INTEREST: {
        id: 'math_simple_interest',
        title: 'Simple Interest',
        titleHi: 'साधारण ब्याज',
        aliases: ['simple interest', 'si', 'साधारण ब्याज'],
        subtopics: ['si_prt_formula', 'sum_becomes_n_times', 'different_times_amounts'],
        allowedKeywords: ['simple interest', 'principal', 'rate of interest', 'annual rate', 'per annum', 'sum of money', 'amount', 'साधारण ब्याज', 'मूलधन', 'वार्षिक दर', 'ब्याज', 'मिश्रधन'],
        disallowedKeywords: ['compound interest', 'compounded', 'marked price', 'discount']
      },
      // 12. Compound Interest
      COMPOUND_INTEREST: {
        id: 'math_compound_interest',
        title: 'Compound Interest',
        titleHi: 'चक्रवृद्धि ब्याज',
        aliases: ['compound interest', 'ci', 'चक्रवृद्धि ब्याज'],
        subtopics: ['ci_formula', 'ci_si_difference', 'semi_annually_quarterly', 'installments'],
        allowedKeywords: ['compound interest', 'compounded', 'annually', 'half-yearly', 'semi-annually', 'ci - si', 'difference between ci and si', 'चक्रवृद्धि ब्याज', 'वार्षिक संयोजित', 'अर्धवार्षिक', 'चक्रवृद्धि और साधारण ब्याज का अंतर'],
        disallowedKeywords: ['marked price', 'discount', 'dishonest dealer']
      },
      // 13. Time and Work
      TIME_WORK: {
        id: 'math_time_work',
        title: 'Time and Work',
        titleHi: 'समय और कार्य',
        aliases: ['time and work', 'time & work', 'कार्य और समय', 'समय और कार्य'],
        subtopics: ['work_days', 'leaving_joining', 'efficiency_ratio', 'mdh_formula'],
        allowedKeywords: ['time and work', 'days to complete', 'together can finish', 'leaves work', 'efficiency', 'men women boys', 'कार्य', 'समय', 'दिन', 'मिलकर कार्य', 'कार्य छोड़ दिया', 'कार्यकुशलता'],
        disallowedKeywords: ['simple interest', 'compound interest', 'speed', 'km/h']
      },
      // 14. Pipe and Cistern
      PIPE_CISTERN: {
        id: 'math_pipe_cistern',
        title: 'Pipe and Cistern',
        titleHi: 'नल और हौज',
        aliases: ['pipe and cistern', 'pipes and cistern', 'pipe & cistern', 'pipes & cistern', 'नल और टंकी', 'नल और हौज', 'पाइप और टंकी'],
        subtopics: ['inlet_outlet_pipes', 'cistern_leak', 'alternating_pipes'],
        allowedKeywords: ['pipe', 'cistern', 'tank', 'leak', 'fill the tank', 'empty the tank', 'नल', 'टंकी', 'हौज', 'रिसाव', 'भरता है', 'खाली करता है'],
        disallowedKeywords: ['simple interest', 'compound interest']
      },
      // 15. Time and Distance
      TIME_DISTANCE: {
        id: 'math_time_distance',
        title: 'Time and Distance',
        titleHi: 'समय और दूरी',
        aliases: ['time and distance', 'time, speed and distance', 'speed and distance', 'चाल और दूरी', 'समय और दूरी'],
        subtopics: ['average_speed', 'early_late_arrival', 'train_crossing_objects', 'relative_speed'],
        allowedKeywords: ['speed', 'distance', 'time', 'km/h', 'm/s', 'train', 'platform', 'crossing', 'relative speed', 'opposite direction', 'same direction', 'चाल', 'दूरी', 'समय', 'किमी/घंटा', 'मीटर/सेकंड', 'रेलगाड़ी', 'प्लेटफॉर्म', 'विपरीत दिशा'],
        disallowedKeywords: ['simple interest', 'compound interest']
      },
      // 16. Boat and Stream
      BOAT_STREAM: {
        id: 'math_boat_stream',
        title: 'Boat and Stream',
        titleHi: 'नाव एवं धारा',
        aliases: ['boat and stream', 'boats and streams', 'boat & stream', 'नाव और धारा', 'नाव एवं धारा'],
        allowedKeywords: ['boat', 'stream', 'current', 'still water', 'upstream', 'downstream', 'नाव की', 'नाव एवं', 'शांत जल', 'धारा के', 'उर्ध्वप्रवाह', 'अनुप्रवाह'],
        disallowedKeywords: ['simple interest', 'compound interest', 'election', 'votes', 'चुनाव', 'मतदाता']
      },
      // 17. Sequence and Series
      SEQUENCE_SERIES: {
        id: 'math_sequence_series',
        title: 'Sequence and Series',
        titleHi: 'अनुक्रम एवं श्रेणी',
        aliases: ['sequence and series', 'ap and gp', 'progression', 'अनुक्रम एवं श्रेणी', 'समानांतर श्रेणी'],
        subtopics: ['arithmetic_progression', 'geometric_progression', 'series_sum'],
        allowedKeywords: ['sequence', 'series', 'ap', 'gp', 'arithmetic progression', 'geometric progression', 'common difference', 'sum of n terms', 'sum', 'odd numbers', 'even numbers', 'term', 'अनुक्रम', 'श्रेणी', 'समांतर श्रेणी', 'गुणोत्तर श्रेणी', 'सार्व अंतर', 'पद', 'योग'],
        disallowedKeywords: ['simple interest', 'compound interest']
      },
      // 18. Algebra
      ALGEBRA: {
        id: 'math_algebra',
        title: 'Algebra',
        titleHi: 'बीजगणित',
        aliases: ['algebra', 'coordinate geometry', 'बीजगणित'],
        subtopics: ['quadratic_equations', 'algebraic_identities', 'x_plus_1_by_x', 'coordinate_geometry'],
        allowedKeywords: ['algebra', 'quadratic equation', 'equation', 'identity', 'x + 1/x', 'x - 1/x', 'x²', 'x³', 'a³ + b³', 'roots', 'roots of equation', 'polynomial', 'value of x', 'value', 'coordinate geometry', 'slope', 'distance between points', 'बीजगणित', 'द्विघात समीकरण', 'समीकरण', 'सर्वसमिका', 'मूल', 'निर्देशांक ज्यामिति', 'ढाल', 'मान'],
        disallowedKeywords: ['blood relation', 'direction sense']
      },
      // 19. Trigonometry
      TRIGONOMETRY: {
        id: 'math_trigonometry',
        title: 'Trigonometry',
        titleHi: 'त्रिकोणमिति',
        aliases: ['trigonometry', 'height and distance', 'heights and distances', 'त्रिकोणमिति'],
        subtopics: ['radian_degree', 'trig_identities', 'height_distance_elevation', 'height_distance_depression'],
        allowedKeywords: ['sin', 'cos', 'tan', 'cot', 'sec', 'cosec', 'angle of elevation', 'angle of depression', 'tower', 'shadow', 'radian', 'degree', 'त्रिकोणमिति', 'उन्नयन कोण', 'अवनमन कोण', 'मीनार', 'छाया'],
        disallowedKeywords: ['blood relation', 'simple interest']
      },
      // 20. Geometry
      GEOMETRY: {
        id: 'math_geometry',
        title: 'Geometry',
        titleHi: 'ज्यामिति',
        aliases: ['geometry', 'ज्यामिति'],
        subtopics: ['lines_angles', 'triangle_theorems', 'polygons', 'quadrilaterals', 'circles_tangents'],
        allowedKeywords: ['triangle', 'circle', 'tangent', 'chord', 'incenter', 'circumcenter', 'quadrilateral', 'rhombus', 'trapezium', 'polygon', 'angles', 'parallel lines', 'त्रिभुज', 'वृत्त', 'जीवा', 'स्पर्श रेखा', 'चतुर्भुज', 'समचतुर्भुज', 'समलंब', 'बहुभुज', 'कोण'],
        disallowedKeywords: ['blood relation', 'simple interest']
      },
      // 21. Mensuration
      MENSURATION: {
        id: 'math_mensuration',
        title: 'Mensuration',
        titleHi: 'क्षेत्रमिति',
        aliases: ['mensuration', 'क्षेत्रमिति'],
        allowedKeywords: ['area', 'perimeter', 'volume', 'surface area', 'curved surface area', 'total surface area', 'rectangle', 'square', 'cube', 'cuboid', 'cylinder', 'cone', 'sphere', 'hemisphere', 'melting', 'recasting', 'क्षेत्रफल', 'परिमाप', 'आयतन', 'आयत', 'वर्ग', 'पृष्ठीय क्षेत्रफल', 'घन', 'घनाभ', 'बेलन', 'शंकु', 'गोला', 'अर्धगोला'],
        disallowedKeywords: ['blood relation', 'simple interest']
      },
      // 22. Statistics & Data Interpretation
      STATISTICS_DI: {
        id: 'math_statistics_di',
        title: 'Statistics & Data Interpretation',
        titleHi: 'सांख्यिकी तथा समंकों की व्याख्या',
        aliases: ['statistics & data interpretation', 'data interpretation', 'di', 'समंकों की व्याख्या', 'पाई चार्ट'],
        subtopics: ['di_tables', 'di_bar_charts', 'di_pie_charts', 'di_line_graphs'],
        allowedKeywords: ['pie chart', 'bar chart', 'table', 'line graph', 'histogram', 'interpretation', 'percentage of production', 'mean', 'median', 'mode', 'range', 'central angle', 'expenditure', 'समंकों की व्याख्या', 'पाई चार्ट', 'सारणी', 'दंड आरेख', 'आलेख', 'माध्य', 'माध्यिका', 'बहुलक', 'परिसर', 'केंद्रीय कोण'],
        disallowedKeywords: ['coding decoding', 'blood relation']
      },
      // 23. Statistics & Probability
      STATISTICS_PROBABILITY: {
        id: 'math_probability',
        title: 'Statistics & Probability',
        titleHi: 'सांख्यिकी तथा प्रायिकता',
        aliases: ['statistics & probability', 'probability', 'statistics and probability', 'सांख्यिकी तथा प्रायिकता', 'प्रायिकता'],
        subtopics: ['mean_median_mode', 'standard_deviation_variance', 'probability_events'],
        allowedKeywords: ['mean', 'median', 'mode', 'standard deviation', 'variance', 'probability', 'dice', 'cards', 'coins', 'माध्य', 'माध्यिका', 'बहुलक', 'मानक विचलन', 'प्रसरण', 'प्रायिकता', 'पासा', 'सिक्का'],
        disallowedKeywords: ['coding decoding', 'blood relation']
      },
      // 24. Miscellaneous
      MISCELLANEOUS: {
        id: 'math_miscellaneous',
        title: 'Miscellaneous',
        titleHi: 'विविध',
        aliases: ['miscellaneous', 'विविध'],
        allowedKeywords: ['logarithm', 'log', 'set theory', 'race', 'runner', 'track', 'clock', 'hour', 'minute', 'angle', 'hands of', 'coincide', 'calendar', 'leap year', 'odd days', 'year', 'day', 'students', 'cricket', 'football', 'neither', 'both', 'hens', 'cows', 'legs', 'heads', 'handshakes', 'shake hands', 'monkey', 'pole', 'climb', 'विविध', 'लघुगणक', 'समुच्चय', 'दौड़', 'धावक', 'घड़ी', 'सुई', 'कोण', 'कैलेंडर', 'वर्ष', 'लीप वर्ष', 'विषम दिन', 'छात्र', 'खेल', 'मुर्गी', 'गाय', 'पैर', 'सिर', 'हाथ', 'बंदर', 'खंभा'],
        disallowedKeywords: ['blood relation']
      },
      // Problem on Ages
      AGES: {
        id: 'math_ages',
        title: 'Problem on Ages',
        titleHi: 'आयु संबंधी प्रश्न',
        aliases: ['problem on ages', 'ages', 'age', 'problems on ages', 'आयु संबंधी प्रश्न', 'आयु'],
        subtopics: ['ratio_ages', 'father_son_age', 'past_future_age'],
        allowedKeywords: ['age', 'years old', 'father', 'son', 'mother', 'daughter', 'ratio of ages', 'present age', 'आयु', 'वर्ष', 'पिता', 'पुत्र', 'माता', 'पुत्री', 'वर्तमान आयु'],
        disallowedKeywords: ['simple interest', 'compound interest', 'selling price', 'marked price']
      },
      // Composite/Legacy Mappings for Backwards Compatibility
      PERCENT_PROFIT_LOSS: {
        id: 'math_percent_profit',
        title: 'Percentage & Profit/Loss',
        titleHi: 'प्रतिशत एवं लाभ-हानि',
        aliases: ['percentage & profit/loss', 'percentage and profit/loss'],
        subtopics: ['basic_percentage', 'profit_loss_calc', 'marked_price_discount'],
        allowedKeywords: ['%', 'percent', 'profit', 'loss', 'discount', 'cost price', 'selling price', 'marked price'],
        disallowedKeywords: ['simple interest', 'compound interest']
      },
      SI_CI: {
        id: 'math_si_ci',
        title: 'Simple & Compound Interest',
        titleHi: 'साधारण एवं चक्रवृद्धि ब्याज',
        aliases: ['simple & compound interest', 'si & ci'],
        subtopics: ['simple_interest_calc', 'compound_interest_calc', 'si_ci_difference'],
        allowedKeywords: ['simple interest', 'compound interest', 'principal', 'rate of interest'],
        disallowedKeywords: ['marked price', 'discount', 'selling price']
      },
      RATIO_TIME_WORK: {
        id: 'math_ratio_work',
        title: 'Ratio, Proportion & Time-Work',
        titleHi: 'अनुपात, समानुपात एवं कार्य-समय',
        aliases: ['ratio, proportion & time-work'],
        subtopics: ['ratio_division', 'time_and_work_days'],
        allowedKeywords: ['ratio', 'proportion', 'time and work', 'days to complete'],
        disallowedKeywords: ['simple interest', 'compound interest']
      },
      GEOMETRY_MENSURATION: {
        id: 'math_geometry_mensuration',
        title: 'Geometry & Mensuration',
        titleHi: 'ज्यामिति एवं क्षेत्रमिति',
        aliases: ['geometry & mensuration'],
        subtopics: ['triangle_theorems', 'circle_tangents', 'volume_3d_solids'],
        allowedKeywords: ['triangle', 'circle', 'area', 'volume', 'perimeter'],
        disallowedKeywords: ['simple interest', 'compound interest']
      },
      RATIO_TIME_WORK: {
        id: 'math_ratio_work',
        title: 'Ratio, Proportion & Time-Work',
        titleHi: 'अनुपात, समानुपात एवं कार्य-समय',
        aliases: ['ratio, proportion & time-work', 'ratio', 'proportion', 'time and work', 'time & work', 'pipes', 'अनुपात', 'कार्य और समय', 'समय और कार्य'],
        subtopics: [
          'ratio_division',
          'time_and_work_days',
          'pipes_cistern',
          'speed_time_distance'
        ],
        allowedKeywords: [
          'ratio', 'proportion', 'divide in ratio', 'together can complete', 'work in days', 'pipes', 'cistern', 'speed', 'distance', 'train',
          'अनुपात', 'समानुपात', 'कार्य', 'समय', 'दिन', 'पाइप', 'टंकी', 'चाल', 'दूरी', 'ट्रेन'
        ],
        disallowedKeywords: [
          'simple interest', 'compound interest', 'marked price', 'discount',
          'साधारण ब्याज', 'चक्रवृद्धि ब्याज', 'अंकित मूल्य', 'छूट'
        ]
      }
    }
  },

  // 2. REASONING ABILITY
  REASONING: {
    id: 'reasoning',
    title: 'Reasoning Ability',
    titleHi: 'तार्किक एवं मानसिक अभिरुचि',
    aliases: ['reasoning ability', 'reasoning', 'general intelligence', 'तार्किक क्षमता', 'तार्किक योग्यता', 'रीजनिंग'],
    topics: {
      CODING_DECODING: {
        id: 'reasoning_coding_decoding',
        title: 'Coding-Decoding',
        titleHi: 'कोडिंग-डिकोडिंग (कूट भाषा)',
        aliases: ['coding-decoding', 'coding decoding', 'coding', 'decoding', 'कोडिंग-डिकोडिंग', 'कूट भाषा', 'सांकेतिक भाषा'],
        subtopics: [
          'forward_shift',
          'backward_shift',
          'word_reversal',
          'direct_letter_digit',
          'letter_position_sum',
          'opposite_letters'
        ],
        allowedKeywords: [
          'code', 'coded as', 'written as', 'code language', 'in that code', 'decipher',
          'कूट', 'कूट भाषा', 'लिखा जाता है', 'कोडित', 'सांकेतिक भाषा'
        ],
        disallowedKeywords: [
          'direction', 'walks', 'facing north', 'facing south', 'facing east', 'facing west', 'turn left', 'turn right',
          'blood relation', 'mother', 'father', 'sister', 'brother', 'maternal', 'paternal', 'uncle', 'aunt', 'son', 'daughter',
          'number series', 'find the next number', 'what will come in place of the question mark',
          'syllogism', 'all cats are', 'some dogs are', 'venn diagram',
          'उत्तर दिशा', 'दक्षिण दिशा', 'पूर्व', 'पश्चिम', 'बाएं मुड़ता', 'दाएं मुड़ता', 'दूरी',
          'रक्त संबंध', 'माता', 'पिता', 'भाई', 'बहन', 'चाचा', 'मामा', 'बेटा', 'पुत्री',
          'संख्या श्रृंखला', 'अगली संख्या', 'कथन और निष्कर्ष', 'वेन आरेख'
        ]
      },
      NUMBER_LETTER_SERIES: {
        id: 'reasoning_series',
        title: 'Number & Letter Series',
        titleHi: 'संख्या एवं अक्षर श्रृंखला',
        aliases: ['number & letter series', 'number series', 'letter series', 'series', 'श्रृंखला', 'श्रेणी', 'संख्या श्रृंखला', 'अक्षर श्रृंखला'],
        subtopics: [
          'odd_even_diff_series',
          'multiplicative_series',
          'square_cube_series',
          'alternating_series',
          'letter_skip_series',
          'geometric_series'
        ],
        allowedKeywords: [
          'series', 'sequence', 'next number', 'next term', 'missing number', 'missing term', 'letter series',
          'श्रृंखला', 'श्रेणी', 'अगली संख्या', 'अगला पद', 'लुप्त संख्या', 'लुप्त पद', 'अक्षर श्रृंखला'
        ],
        disallowedKeywords: [
          'in a certain code language', 'coded as', 'written as',
          'walks 10m', 'facing north', 'blood relation', 'mother of', 'father of',
          'कूट भाषा में', 'कोडित किया जाता है', 'उत्तर दिशा', 'रक्त संबंध'
        ]
      },
      BLOOD_RELATIONS: {
        id: 'reasoning_blood_relations',
        title: 'Blood Relations',
        titleHi: 'रक्त संबंध',
        aliases: ['blood relations', 'blood relation', 'रक्त संबंध', 'पारिवारिक संबंध'],
        subtopics: ['pointing_to_photo', 'coded_relations', 'family_tree'],
        allowedKeywords: ['pointing', 'photograph', 'mother', 'father', 'brother', 'sister', 'uncle', 'aunt', 'daughter', 'son', 'grandmother', 'grandfather', 'रक्त संबंध', 'माता', 'पिता', 'भाई', 'बहन', 'पुत्र', 'पुत्री', 'चाचा', 'मामा'],
        disallowedKeywords: ['series', 'coding', 'direction', 'interest', 'percent']
      },
      DIRECTION_SENSE: {
        id: 'reasoning_direction_sense',
        title: 'Direction & Distance Sense',
        titleHi: 'दिशा एवं दूरी ज्ञान परीक्षण',
        aliases: ['direction & distance sense', 'direction sense', 'direction', 'distance', 'दिशा परीक्षण', 'दिशा और दूरी'],
        subtopics: ['cardinal_directions', 'distance_pythagoras', 'shadow_sun'],
        allowedKeywords: ['north', 'south', 'east', 'west', 'walks', 'turns left', 'turns right', 'starting point', 'उत्तर', 'दक्षिण', 'पूर्व', 'पश्चिम', 'बाएं', 'दाएं', 'आरंभिक बिंदु', 'दूरी'],
        disallowedKeywords: ['coding', 'series', 'blood relation', 'interest']
      },
      VENN_SYLLOGISM: {
        id: 'reasoning_venn_syllogism',
        title: 'Venn Diagrams & Syllogism',
        titleHi: 'वेन आरेख एवं न्याय निगमन',
        aliases: ['venn diagrams & syllogism', 'venn diagrams', 'syllogism', 'वेन आरेख', 'न्याय निगमन', 'कथन एवं निष्कर्ष'],
        subtopics: ['two_statement_syllogism', 'three_group_venn'],
        allowedKeywords: ['statements', 'conclusions', 'venn diagram', 'some', 'all', 'no', 'कथन', 'निष्कर्ष', 'वेन आरेख'],
        disallowedKeywords: ['coding', 'series', 'interest', 'direction']
      }
    }
  },

  // 3. GENERAL SCIENCE
  SCIENCE: {
    id: 'science',
    title: 'General Science (Physics, Chemistry, Biology)',
    titleHi: 'सामान्य विज्ञान (भौतिकी, रसायन, जीव विज्ञान)',
    aliases: ['general science', 'science', 'physics', 'chemistry', 'biology', 'विज्ञान', 'सामान्य विज्ञान', 'भौतिकी', 'रसायन'],
    topics: {
      GENERAL_SCIENCE: {
        id: 'science_all',
        title: 'General Science Core',
        titleHi: 'सामान्य विज्ञान (मूलभूत सिद्धांत)',
        aliases: ['general science', 'physics & si units', 'chemistry & biology', 'science'],
        subtopics: ['si_units', 'laws_of_motion', 'acids_bases', 'human_biology_vitamins', 'cell_biology'],
        allowedKeywords: ['unit', 'si unit', 'motion', 'force', 'acid', 'base', 'vitamin', 'cell', 'hormone', 'blood', 'मात्रक', 'विटामिन', 'कोशिका', 'बल', 'अम्ल', 'क्षार'],
        disallowedKeywords: ['coding', 'series', 'interest', 'discount', 'mp police special']
      }
    }
  },

  // 4. GENERAL KNOWLEDGE & POLITY
  GK_POLITY: {
    id: 'gk_polity',
    title: 'General Knowledge & Indian Polity',
    titleHi: 'सामान्य ज्ञान एवं भारतीय संविधान',
    aliases: ['general knowledge', 'indian polity', 'constitution', 'polity', 'gk', 'संविधान', 'सामान्य ज्ञान'],
    topics: {
      POLITY: {
        id: 'polity_constitution',
        title: 'Indian Constitution & Fundamental Rights',
        titleHi: 'भारतीय संविधान एवं मौलिक अधिकार',
        aliases: ['indian constitution & fundamental rights', 'constitution', 'indian polity', 'fundamental rights', 'articles', 'संविधान', 'मौलिक अधिकार', 'अनुच्छेद'],
        subtopics: ['fundamental_rights', 'amendments_articles', 'constitutional_bodies', 'preamble'],
        allowedKeywords: ['constitution', 'article', 'amendment', 'fundamental rights', 'president', 'supreme court', 'election commission', 'संविधान', 'अनुच्छेद', 'संशोधन', 'मौलिक अधिकार', 'राष्ट्रपति', 'सर्वोच्च न्यायालय'],
        disallowedKeywords: ['coding', 'series', 'simple interest', 'discount']
      }
    }
  },

  // 5. MP SPECIAL GENERAL KNOWLEDGE
  MP_GK: {
    id: 'mp_gk',
    title: 'MP General Knowledge (Special)',
    titleHi: 'मध्य प्रदेश सामान्य ज्ञान (विशेष)',
    aliases: ['mp general knowledge', 'mp gk', 'madhya pradesh gk', 'mp gk special', 'मध्य प्रदेश सामान्य ज्ञान', 'एमपी जीके'],
    topics: {
      MP_GEOGRAPHY: {
        id: 'mp_geography',
        title: 'MP Geography, Rivers & National Parks',
        titleHi: 'मध्य प्रदेश भूगोल, नदियां एवं राष्ट्रीय उद्यान',
        aliases: ['mp geography, rivers & national parks', 'mp geography', 'mp rivers', 'mp national parks', 'म.प्र. भूगोल', 'नदियां एवं राष्ट्रीय उद्यान'],
        subtopics: ['national_parks', 'rivers_origin', 'dams_waterfalls', 'plateaus_climate'],
        allowedKeywords: ['madhya pradesh', 'narmada', 'chambal', 'kanha', 'bandhavgarh', 'national park', 'river', 'dam', 'waterfall', 'मध्य प्रदेश', 'नर्मदा', 'कान्हा', 'राष्ट्रीय उद्यान', 'नदी', 'बांध'],
        disallowedKeywords: ['coding', 'series', 'interest', 'discount']
      },
      MP_HISTORY: {
        id: 'mp_history',
        title: 'MP History, Forts & Dynasties',
        titleHi: 'मध्य प्रदेश का इतिहास, किले एवं राजवंश',
        aliases: ['mp history, forts & dynasties', 'mp history', 'forts', 'tribes', 'म.प्र. इतिहास', 'किले एवं राजवंश'],
        subtopics: ['parmar_dynasty', 'chandela_bhimbetka', 'freedom_fighters_tantya', 'tribes_bhil_gond'],
        allowedKeywords: ['bhoj', 'bhimbetka', 'khajuraho', 'tantya bhil', 'gond', 'bhil', 'rani durgavati', 'भोजशाला', 'भीमबेटका', 'खजुराहो', 'टंट्या भील', 'गोंड', 'भील', 'रानी दुर्गावती'],
        disallowedKeywords: ['coding', 'series', 'interest', 'discount']
      }
    }
  }
};

/**
 * Normalizes input Subject & Topic into canonical identifiers and boundary filters
 */
export function normalizeSubjectAndTopic(rawSubject, rawTopic) {
  const sStr = String(rawSubject || '').toLowerCase().trim();
  const tStr = String(rawTopic || '').toLowerCase().trim();

  // 1. Math normalization
  if (sStr.includes('arithmetic') || sStr.includes('math') || sStr.includes('गणित') || sStr.includes('अंकगणित')) {
    // Direct ID or canonical alias match
    for (const key of Object.keys(CANONICAL_TAXONOMY.MATH.topics)) {
      const top = CANONICAL_TAXONOMY.MATH.topics[key];
      if (top.id === tStr || top.id === tStr.replace(/\s+/g, '_') || tStr === top.title.toLowerCase()) {
        return { subjectGroup: 'MATH', subjectId: 'math', topicId: top.id, canonicalSubject: CANONICAL_TAXONOMY.MATH.title, canonicalTopic: top.title, allowedKeywords: top.allowedKeywords, disallowedKeywords: top.disallowedKeywords, subtopics: top.subtopics };
      }
    }
    // 1. Number System
    if (tStr.includes('number system') || tStr.includes('number_system') || tStr.includes('संख्या पद्धति')) {
      const top = CANONICAL_TAXONOMY.MATH.topics.NUMBER_SYSTEM;
      return { subjectGroup: 'MATH', subjectId: 'math', topicId: top.id, canonicalSubject: CANONICAL_TAXONOMY.MATH.title, canonicalTopic: top.title, allowedKeywords: top.allowedKeywords, disallowedKeywords: top.disallowedKeywords, subtopics: top.subtopics };
    }
    // 2. LCM and HCF
    if (tStr.includes('lcm') || tStr.includes('hcf') || tStr.includes('लघुत्तम') || tStr.includes('महत्तम') || tStr.includes('ल.स.') || tStr.includes('म.स.')) {
      const top = CANONICAL_TAXONOMY.MATH.topics.LCM_HCF;
      return { subjectGroup: 'MATH', subjectId: 'math', topicId: top.id, canonicalSubject: CANONICAL_TAXONOMY.MATH.title, canonicalTopic: top.title, allowedKeywords: top.allowedKeywords, disallowedKeywords: top.disallowedKeywords, subtopics: top.subtopics };
    }
    // 3. Simplification
    if (tStr.includes('simplification') || tStr.includes('सरलीकरण') || tStr.includes('bodmas')) {
      const top = CANONICAL_TAXONOMY.MATH.topics.SIMPLIFICATION;
      return { subjectGroup: 'MATH', subjectId: 'math', topicId: top.id, canonicalSubject: CANONICAL_TAXONOMY.MATH.title, canonicalTopic: top.title, allowedKeywords: top.allowedKeywords, disallowedKeywords: top.disallowedKeywords, subtopics: top.subtopics };
    }
    // 4. Power, Indices and Surds
    if (tStr.includes('indices') || tStr.includes('surds') || tStr.includes('घातांक') || tStr.includes('करणी')) {
      const top = CANONICAL_TAXONOMY.MATH.topics.POWER_INDICES_SURDS;
      return { subjectGroup: 'MATH', subjectId: 'math', topicId: top.id, canonicalSubject: CANONICAL_TAXONOMY.MATH.title, canonicalTopic: top.title, allowedKeywords: top.allowedKeywords, disallowedKeywords: top.disallowedKeywords, subtopics: top.subtopics };
    }
    // 5. Average
    if (tStr.includes('average') || tStr.includes('औसत')) {
      const top = CANONICAL_TAXONOMY.MATH.topics.AVERAGE;
      return { subjectGroup: 'MATH', subjectId: 'math', topicId: top.id, canonicalSubject: CANONICAL_TAXONOMY.MATH.title, canonicalTopic: top.title, allowedKeywords: top.allowedKeywords, disallowedKeywords: top.disallowedKeywords, subtopics: top.subtopics };
    }
    // 7. Alligation or Mixture
    if (tStr.includes('alligation') || tStr.includes('mixture') || tStr.includes('मिश्रण')) {
      const top = CANONICAL_TAXONOMY.MATH.topics.ALLIGATION_MIXTURE;
      return { subjectGroup: 'MATH', subjectId: 'math', topicId: top.id, canonicalSubject: CANONICAL_TAXONOMY.MATH.title, canonicalTopic: top.title, allowedKeywords: top.allowedKeywords, disallowedKeywords: top.disallowedKeywords, subtopics: top.subtopics };
    }
    // 6. Ratio and Proportion
    if (/\bratio\b/i.test(tStr) || /\bproportion\b/i.test(tStr) || tStr.includes('अनुपात') || tStr.includes('समानुपात')) {
      const top = CANONICAL_TAXONOMY.MATH.topics.RATIO_PROPORTION;
      return { subjectGroup: 'MATH', subjectId: 'math', topicId: top.id, canonicalSubject: CANONICAL_TAXONOMY.MATH.title, canonicalTopic: top.title, allowedKeywords: top.allowedKeywords, disallowedKeywords: top.disallowedKeywords, subtopics: top.subtopics };
    }
    // Composite: Percentage & Profit/Loss
    if ((tStr.includes('percentage') || tStr.includes('percent') || tStr.includes('प्रतिशत')) && (tStr.includes('profit') || tStr.includes('loss') || tStr.includes('लाभ') || tStr.includes('हानि'))) {
      const top = CANONICAL_TAXONOMY.MATH.topics.PERCENT_PROFIT_LOSS;
      return { subjectGroup: 'MATH', subjectId: 'math', topicId: top.id, canonicalSubject: CANONICAL_TAXONOMY.MATH.title, canonicalTopic: top.title, allowedKeywords: top.allowedKeywords, disallowedKeywords: top.disallowedKeywords, subtopics: top.subtopics };
    }
    // 8. Percentage (specifically percentage only)
    if (tStr.includes('percentage') || tStr.includes('प्रतिशत')) {
      const top = CANONICAL_TAXONOMY.MATH.topics.PERCENTAGE;
      return { subjectGroup: 'MATH', subjectId: 'math', topicId: top.id, canonicalSubject: CANONICAL_TAXONOMY.MATH.title, canonicalTopic: top.title, allowedKeywords: top.allowedKeywords, disallowedKeywords: top.disallowedKeywords, subtopics: top.subtopics };
    }
    // 10. Discount
    if (tStr.includes('discount') || tStr.includes('बट्टा') || tStr.includes('छूट')) {
      const top = CANONICAL_TAXONOMY.MATH.topics.DISCOUNT;
      return { subjectGroup: 'MATH', subjectId: 'math', topicId: top.id, canonicalSubject: CANONICAL_TAXONOMY.MATH.title, canonicalTopic: top.title, allowedKeywords: top.allowedKeywords, disallowedKeywords: top.disallowedKeywords, subtopics: top.subtopics };
    }
    // 9. Profit and Loss (specifically profit/loss only)
    if (tStr.includes('profit') || tStr.includes('loss') || tStr.includes('लाभ') || tStr.includes('हानि')) {
      const top = CANONICAL_TAXONOMY.MATH.topics.PROFIT_LOSS;
      return { subjectGroup: 'MATH', subjectId: 'math', topicId: top.id, canonicalSubject: CANONICAL_TAXONOMY.MATH.title, canonicalTopic: top.title, allowedKeywords: top.allowedKeywords, disallowedKeywords: top.disallowedKeywords, subtopics: top.subtopics };
    }
    // 11. Simple Interest
    if (tStr.includes('simple interest') || tStr.includes('साधारण ब्याज')) {
      const top = CANONICAL_TAXONOMY.MATH.topics.SIMPLE_INTEREST;
      return { subjectGroup: 'MATH', subjectId: 'math', topicId: top.id, canonicalSubject: CANONICAL_TAXONOMY.MATH.title, canonicalTopic: top.title, allowedKeywords: top.allowedKeywords, disallowedKeywords: top.disallowedKeywords, subtopics: top.subtopics };
    }
    // 12. Compound Interest
    if (tStr.includes('compound interest') || tStr.includes('चक्रवृद्धि ब्याज')) {
      const top = CANONICAL_TAXONOMY.MATH.topics.COMPOUND_INTEREST;
      return { subjectGroup: 'MATH', subjectId: 'math', topicId: top.id, canonicalSubject: CANONICAL_TAXONOMY.MATH.title, canonicalTopic: top.title, allowedKeywords: top.allowedKeywords, disallowedKeywords: top.disallowedKeywords, subtopics: top.subtopics };
    }
    // Combined SI/CI
    if (tStr.includes('interest') || tStr.includes('ब्याज') || /\b(si|ci)\b/i.test(tStr)) {
      const top = CANONICAL_TAXONOMY.MATH.topics.SI_CI;
      return { subjectGroup: 'MATH', subjectId: 'math', topicId: top.id, canonicalSubject: CANONICAL_TAXONOMY.MATH.title, canonicalTopic: top.title, allowedKeywords: top.allowedKeywords, disallowedKeywords: top.disallowedKeywords, subtopics: top.subtopics };
    }
    // 14. Pipe and Cistern
    if (tStr.includes('pipe') || tStr.includes('cistern') || tStr.includes('नल') || tStr.includes('हौज') || tStr.includes('टंकी')) {
      const top = CANONICAL_TAXONOMY.MATH.topics.PIPE_CISTERN;
      return { subjectGroup: 'MATH', subjectId: 'math', topicId: top.id, canonicalSubject: CANONICAL_TAXONOMY.MATH.title, canonicalTopic: top.title, allowedKeywords: top.allowedKeywords, disallowedKeywords: top.disallowedKeywords, subtopics: top.subtopics };
    }
    // 13. Time and Work
    if (tStr.includes('work') || tStr.includes('कार्य')) {
      const top = CANONICAL_TAXONOMY.MATH.topics.TIME_WORK;
      return { subjectGroup: 'MATH', subjectId: 'math', topicId: top.id, canonicalSubject: CANONICAL_TAXONOMY.MATH.title, canonicalTopic: top.title, allowedKeywords: top.allowedKeywords, disallowedKeywords: top.disallowedKeywords, subtopics: top.subtopics };
    }
    // 16. Boat and Stream
    if (tStr.includes('boat') || tStr.includes('stream') || tStr.includes('नाव') || tStr.includes('धारा')) {
      const top = CANONICAL_TAXONOMY.MATH.topics.BOAT_STREAM;
      return { subjectGroup: 'MATH', subjectId: 'math', topicId: top.id, canonicalSubject: CANONICAL_TAXONOMY.MATH.title, canonicalTopic: top.title, allowedKeywords: top.allowedKeywords, disallowedKeywords: top.disallowedKeywords, subtopics: top.subtopics };
    }
    // 15. Time and Distance
    if (tStr.includes('distance') || tStr.includes('speed') || tStr.includes('train') || tStr.includes('चाल') || tStr.includes('दूरी') || tStr.includes('रेलगाड़ी')) {
      const top = CANONICAL_TAXONOMY.MATH.topics.TIME_DISTANCE;
      return { subjectGroup: 'MATH', subjectId: 'math', topicId: top.id, canonicalSubject: CANONICAL_TAXONOMY.MATH.title, canonicalTopic: top.title, allowedKeywords: top.allowedKeywords, disallowedKeywords: top.disallowedKeywords, subtopics: top.subtopics };
    }
    // 17. Sequence and Series
    if (tStr.includes('sequence') || tStr.includes('series') || tStr.includes('ap') || tStr.includes('gp') || tStr.includes('अनुक्रम') || tStr.includes('श्रेणी')) {
      const top = CANONICAL_TAXONOMY.MATH.topics.SEQUENCE_SERIES;
      return { subjectGroup: 'MATH', subjectId: 'math', topicId: top.id, canonicalSubject: CANONICAL_TAXONOMY.MATH.title, canonicalTopic: top.title, allowedKeywords: top.allowedKeywords, disallowedKeywords: top.disallowedKeywords, subtopics: top.subtopics };
    }
    // 18. Algebra
    if (tStr.includes('algebra') || tStr.includes('बीजगणित')) {
      const top = CANONICAL_TAXONOMY.MATH.topics.ALGEBRA;
      return { subjectGroup: 'MATH', subjectId: 'math', topicId: top.id, canonicalSubject: CANONICAL_TAXONOMY.MATH.title, canonicalTopic: top.title, allowedKeywords: top.allowedKeywords, disallowedKeywords: top.disallowedKeywords, subtopics: top.subtopics };
    }
    // 19. Trigonometry
    if (tStr.includes('trigonometry') || tStr.includes('त्रिकोणमिति')) {
      const top = CANONICAL_TAXONOMY.MATH.topics.TRIGONOMETRY;
      return { subjectGroup: 'MATH', subjectId: 'math', topicId: top.id, canonicalSubject: CANONICAL_TAXONOMY.MATH.title, canonicalTopic: top.title, allowedKeywords: top.allowedKeywords, disallowedKeywords: top.disallowedKeywords, subtopics: top.subtopics };
    }
    // 21. Mensuration
    if (tStr.includes('mensuration') || tStr.includes('क्षेत्रमिति')) {
      const top = CANONICAL_TAXONOMY.MATH.topics.MENSURATION;
      return { subjectGroup: 'MATH', subjectId: 'math', topicId: top.id, canonicalSubject: CANONICAL_TAXONOMY.MATH.title, canonicalTopic: top.title, allowedKeywords: top.allowedKeywords, disallowedKeywords: top.disallowedKeywords, subtopics: top.subtopics };
    }
    // 20. Geometry
    if (tStr.includes('geometry') || tStr.includes('ज्यामिति')) {
      const top = CANONICAL_TAXONOMY.MATH.topics.GEOMETRY;
      return { subjectGroup: 'MATH', subjectId: 'math', topicId: top.id, canonicalSubject: CANONICAL_TAXONOMY.MATH.title, canonicalTopic: top.title, allowedKeywords: top.allowedKeywords, disallowedKeywords: top.disallowedKeywords, subtopics: top.subtopics };
    }
    // 23. Statistics & Probability
    if (tStr.includes('probability') || tStr.includes('प्रायिकता')) {
      const top = CANONICAL_TAXONOMY.MATH.topics.STATISTICS_PROBABILITY;
      return { subjectGroup: 'MATH', subjectId: 'math', topicId: top.id, canonicalSubject: CANONICAL_TAXONOMY.MATH.title, canonicalTopic: top.title, allowedKeywords: top.allowedKeywords, disallowedKeywords: top.disallowedKeywords, subtopics: top.subtopics };
    }
    // 22. Statistics & Data Interpretation
    if (tStr.includes('di') || tStr.includes('interpretation') || tStr.includes('statistics') || tStr.includes('समंकों') || tStr.includes('सांख्यिकी')) {
      const top = CANONICAL_TAXONOMY.MATH.topics.STATISTICS_DI;
      return { subjectGroup: 'MATH', subjectId: 'math', topicId: top.id, canonicalSubject: CANONICAL_TAXONOMY.MATH.title, canonicalTopic: top.title, allowedKeywords: top.allowedKeywords, disallowedKeywords: top.disallowedKeywords, subtopics: top.subtopics };
    }
    // 24. Miscellaneous
    if (tStr.includes('miscellaneous') || tStr.includes('विविध')) {
      const top = CANONICAL_TAXONOMY.MATH.topics.MISCELLANEOUS;
      return { subjectGroup: 'MATH', subjectId: 'math', topicId: top.id, canonicalSubject: CANONICAL_TAXONOMY.MATH.title, canonicalTopic: top.title, allowedKeywords: top.allowedKeywords, disallowedKeywords: top.disallowedKeywords, subtopics: top.subtopics };
    }
    // 25. Problem on Ages
    if (tStr.includes('age') || tStr.includes('आयु')) {
      const top = CANONICAL_TAXONOMY.MATH.topics.AGES;
      return { subjectGroup: 'MATH', subjectId: 'math', topicId: top.id, canonicalSubject: CANONICAL_TAXONOMY.MATH.title, canonicalTopic: top.title, allowedKeywords: top.allowedKeywords, disallowedKeywords: top.disallowedKeywords, subtopics: top.subtopics };
    }
    // Default Math topic: Percentage & Profit/Loss
    return {
      subjectGroup: 'MATH',
      subjectId: 'math',
      topicId: 'math_percent_profit',
      canonicalSubject: CANONICAL_TAXONOMY.MATH.title,
      canonicalTopic: CANONICAL_TAXONOMY.MATH.topics.PERCENT_PROFIT_LOSS.title,
      allowedKeywords: CANONICAL_TAXONOMY.MATH.topics.PERCENT_PROFIT_LOSS.allowedKeywords,
      disallowedKeywords: CANONICAL_TAXONOMY.MATH.topics.PERCENT_PROFIT_LOSS.disallowedKeywords,
      subtopics: CANONICAL_TAXONOMY.MATH.topics.PERCENT_PROFIT_LOSS.subtopics
    };
  }

  // 2. Reasoning normalization
  if (sStr.includes('reasoning') || sStr.includes('तार्किक') || sStr.includes('मानसिक') || tStr.includes('coding') || tStr.includes('series')) {
    if (tStr.includes('coding') || tStr.includes('code') || tStr.includes('कूट') || tStr.includes('कोडिंग')) {
      return {
        subjectGroup: 'REASONING',
        subjectId: 'reasoning',
        topicId: 'reasoning_coding_decoding',
        canonicalSubject: CANONICAL_TAXONOMY.REASONING.title,
        canonicalTopic: CANONICAL_TAXONOMY.REASONING.topics.CODING_DECODING.title,
        allowedKeywords: CANONICAL_TAXONOMY.REASONING.topics.CODING_DECODING.allowedKeywords,
        disallowedKeywords: CANONICAL_TAXONOMY.REASONING.topics.CODING_DECODING.disallowedKeywords,
        subtopics: CANONICAL_TAXONOMY.REASONING.topics.CODING_DECODING.subtopics
      };
    }
    if (tStr.includes('series') || tStr.includes('श्रृंखला') || tStr.includes('श्रेणी')) {
      return {
        subjectGroup: 'REASONING',
        subjectId: 'reasoning',
        topicId: 'reasoning_series',
        canonicalSubject: CANONICAL_TAXONOMY.REASONING.title,
        canonicalTopic: CANONICAL_TAXONOMY.REASONING.topics.NUMBER_LETTER_SERIES.title,
        allowedKeywords: CANONICAL_TAXONOMY.REASONING.topics.NUMBER_LETTER_SERIES.allowedKeywords,
        disallowedKeywords: CANONICAL_TAXONOMY.REASONING.topics.NUMBER_LETTER_SERIES.disallowedKeywords,
        subtopics: CANONICAL_TAXONOMY.REASONING.topics.NUMBER_LETTER_SERIES.subtopics
      };
    }
    if (tStr.includes('blood') || tStr.includes('रक्त')) {
      return {
        subjectGroup: 'REASONING',
        subjectId: 'reasoning',
        topicId: 'reasoning_blood_relations',
        canonicalSubject: CANONICAL_TAXONOMY.REASONING.title,
        canonicalTopic: CANONICAL_TAXONOMY.REASONING.topics.BLOOD_RELATIONS.title,
        allowedKeywords: CANONICAL_TAXONOMY.REASONING.topics.BLOOD_RELATIONS.allowedKeywords,
        disallowedKeywords: CANONICAL_TAXONOMY.REASONING.topics.BLOOD_RELATIONS.disallowedKeywords,
        subtopics: CANONICAL_TAXONOMY.REASONING.topics.BLOOD_RELATIONS.subtopics
      };
    }
    if (tStr.includes('direction') || tStr.includes('दिशा')) {
      return {
        subjectGroup: 'REASONING',
        subjectId: 'reasoning',
        topicId: 'reasoning_direction_sense',
        canonicalSubject: CANONICAL_TAXONOMY.REASONING.title,
        canonicalTopic: CANONICAL_TAXONOMY.REASONING.topics.DIRECTION_SENSE.title,
        allowedKeywords: CANONICAL_TAXONOMY.REASONING.topics.DIRECTION_SENSE.allowedKeywords,
        disallowedKeywords: CANONICAL_TAXONOMY.REASONING.topics.DIRECTION_SENSE.disallowedKeywords,
        subtopics: CANONICAL_TAXONOMY.REASONING.topics.DIRECTION_SENSE.subtopics
      };
    }
    // Default Reasoning topic
    return {
      subjectGroup: 'REASONING',
      subjectId: 'reasoning',
      topicId: 'reasoning_coding_decoding',
      canonicalSubject: CANONICAL_TAXONOMY.REASONING.title,
      canonicalTopic: CANONICAL_TAXONOMY.REASONING.topics.CODING_DECODING.title,
      allowedKeywords: CANONICAL_TAXONOMY.REASONING.topics.CODING_DECODING.allowedKeywords,
      disallowedKeywords: CANONICAL_TAXONOMY.REASONING.topics.CODING_DECODING.disallowedKeywords,
      subtopics: CANONICAL_TAXONOMY.REASONING.topics.CODING_DECODING.subtopics
    };
  }

  // 3. Science
  if (sStr.includes('science') || sStr.includes('विज्ञान')) {
    return {
      subjectGroup: 'SCIENCE',
      subjectId: 'science',
      topicId: 'science_all',
      canonicalSubject: CANONICAL_TAXONOMY.SCIENCE.title,
      canonicalTopic: 'General Science Core',
      allowedKeywords: CANONICAL_TAXONOMY.SCIENCE.topics.GENERAL_SCIENCE.allowedKeywords,
      disallowedKeywords: CANONICAL_TAXONOMY.SCIENCE.topics.GENERAL_SCIENCE.disallowedKeywords,
      subtopics: CANONICAL_TAXONOMY.SCIENCE.topics.GENERAL_SCIENCE.subtopics
    };
  }

  // 4. Polity / GK
  if (sStr.includes('polity') || sStr.includes('constitution') || tStr.includes('संविधान') || tStr.includes('polity')) {
    return {
      subjectGroup: 'GK_POLITY',
      subjectId: 'gk_polity',
      topicId: 'polity_constitution',
      canonicalSubject: CANONICAL_TAXONOMY.GK_POLITY.title,
      canonicalTopic: CANONICAL_TAXONOMY.GK_POLITY.topics.POLITY.title,
      allowedKeywords: CANONICAL_TAXONOMY.GK_POLITY.topics.POLITY.allowedKeywords,
      disallowedKeywords: CANONICAL_TAXONOMY.GK_POLITY.topics.POLITY.disallowedKeywords,
      subtopics: CANONICAL_TAXONOMY.GK_POLITY.topics.POLITY.subtopics
    };
  }

  // 5. MP GK
  if (sStr.includes('mp') || sStr.includes('madhya pradesh') || sStr.includes('मध्य प्रदेश')) {
    if (tStr.includes('history') || tStr.includes('fort') || tStr.includes('tribe') || tStr.includes('इतिहास')) {
      return {
        subjectGroup: 'MP_GK',
        subjectId: 'mp_gk',
        topicId: 'mp_history',
        canonicalSubject: CANONICAL_TAXONOMY.MP_GK.title,
        canonicalTopic: CANONICAL_TAXONOMY.MP_GK.topics.MP_HISTORY.title,
        allowedKeywords: CANONICAL_TAXONOMY.MP_GK.topics.MP_HISTORY.allowedKeywords,
        disallowedKeywords: CANONICAL_TAXONOMY.MP_GK.topics.MP_HISTORY.disallowedKeywords,
        subtopics: CANONICAL_TAXONOMY.MP_GK.topics.MP_HISTORY.subtopics
      };
    }
    return {
      subjectGroup: 'MP_GK',
      subjectId: 'mp_gk',
      topicId: 'mp_geography',
      canonicalSubject: CANONICAL_TAXONOMY.MP_GK.title,
      canonicalTopic: CANONICAL_TAXONOMY.MP_GK.topics.MP_GEOGRAPHY.title,
      allowedKeywords: CANONICAL_TAXONOMY.MP_GK.topics.MP_GEOGRAPHY.allowedKeywords,
      disallowedKeywords: CANONICAL_TAXONOMY.MP_GK.topics.MP_GEOGRAPHY.disallowedKeywords,
      subtopics: CANONICAL_TAXONOMY.MP_GK.topics.MP_GEOGRAPHY.subtopics
    };
  }

  // Default fallback
  return {
    subjectGroup: 'REASONING',
    subjectId: 'reasoning',
    topicId: 'reasoning_coding_decoding',
    canonicalSubject: 'General Practice / All Exams',
    canonicalTopic: rawTopic || 'General Practice',
    allowedKeywords: [],
    disallowedKeywords: [],
    subtopics: []
  };
}
