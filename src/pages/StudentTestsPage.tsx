import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLibrary } from '../context/LibraryContext';
import { mockTestService } from '../services/api';
import { formatDisplayDate } from '../utils/dateFormatter';
import {
  Sparkles,
  ArrowLeft,
  Award,
  Play,
  RotateCcw,
  Search,
  Brain,
  FileText,
  ChevronRight,
  TrendingUp,
  X,
  Shield,
  Clock
} from 'lucide-react';

const EXAM_OPTIONS = [
  'General Practice / All Exams',
  'MP Police (Constable / SI)',
  'SSC (CGL, CHSL, GD, MTS)',
  'Railway (RRB NTPC, Group D)',
  'State Exams / Other'
];

const SUBJECT_OPTIONS = [
  'Reasoning Ability',
  'Simple Arithmetic / Mathematics',
  'General Knowledge & Current Affairs',
  'General Science (Physics, Chemistry, Biology)',
  'Indian Polity & Constitution',
  'MP General Knowledge (Special)',
  'Full Syllabus Mock Paper (100 Questions)'
];

const SUBJECT_TOPIC_PRESETS: Record<string, { defaultTopic: string; suggestions: string[] }> = {
  'Reasoning Ability': {
    defaultTopic: 'Coding-Decoding',
    suggestions: [
      'Coding-Decoding',
      'Number & Letter Series',
      'Blood Relations',
      'Direction & Distance Sense',
      'Venn Diagrams & Syllogism',
      'Analogy & Classification'
    ]
  },
  'Simple Arithmetic / Mathematics': {
    defaultTopic: 'Number System',
    suggestions: [
      'Number System',
      'LCM and HCF',
      'Simplification',
      'Power, Indices and Surds',
      'Average',
      'Ratio and Proportion',
      'Alligation or Mixture',
      'Percentage',
      'Profit and Loss',
      'Discount',
      'Simple Interest',
      'Compound Interest',
      'Time and Work',
      'Pipe and Cistern',
      'Time and Distance',
      'Boat and Stream',
      'Sequence and Series',
      'Algebra',
      'Trigonometry',
      'Geometry',
      'Mensuration',
      'Statistics & Data Interpretation',
      'Statistics & Probability',
      'Miscellaneous'
    ]
  },
  'General Knowledge & Current Affairs': {
    defaultTopic: 'Indian Constitution, Articles & Rights',
    suggestions: [
      'Indian Constitution, Articles & Rights',
      'Modern Indian History & 1857 Revolt',
      'Indian Geography & River Systems',
      'National & International Current Affairs',
      'Static GK & Awards'
    ]
  },
  'General Science (Physics, Chemistry, Biology)': {
    defaultTopic: 'Physics: SI Units, Motion & Optics',
    suggestions: [
      'Physics: SI Units, Motion & Optics',
      'Chemistry: Acids, Bases, Salts & Formulas',
      'Biology: Human Body, Blood Groups & Nutrition',
      'Diseases, Vitamins & Human Physiology'
    ]
  },
  'Indian Polity & Constitution': {
    defaultTopic: 'Fundamental Rights & Constitutional Articles',
    suggestions: [
      'Fundamental Rights & Constitutional Articles',
      'Parliament, President & Prime Minister',
      'Supreme Court & High Courts',
      'Election Commission & Amendments'
    ]
  },
  'MP General Knowledge (Special)': {
    defaultTopic: 'MP Geography, Rivers & National Parks',
    suggestions: [
      'MP Geography, Rivers & Waterfalls',
      'MP National Parks & Wildlife (Kuno Cheetahs)',
      'MP History, Forts & Freedom Fighters (Tantya Bhil)',
      'MP Tribes, Culture & Festivals (Bhagoria Haat)',
      'MP Minerals, Energy Capital (Singrauli) & Admin'
    ]
  },
  'Full Syllabus Mock Paper (100 Questions)': {
    defaultTopic: 'Full 100 Questions Mock Paper (GK + Reasoning + Science + Math)',
    suggestions: [
      'Full 100 Qs Mock Paper (Mixed Syllabus)',
      'MP Police 100 Qs Pattern',
      'SSC GD / Railway 100 Qs Pattern',
      'Comprehensive Speed Test'
    ]
  }
};

const DIFFICULTY_OPTIONS = [
  { id: 'Easy', label: 'Easy (Basic Practice)' },
  { id: 'Medium', label: 'Medium (Standard Competitive Level)' },
  { id: 'Hard', label: 'Hard (Challenging Shift Level)' },
  { id: 'Very Hard', label: '🔥 Very Hard (Advanced / CGL Mains / SI Ranker Level)' },
  { id: 'Ultra Hard', label: '⚡ Ultra Hard (Extreme / CAT & SSC CGL Tier-2 Hard Level)' }
];

export const StudentTestsPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useLibrary();
  const navigate = useNavigate();

  const studentId = user?.studentId || (user as any)?._id || user?.id || 'STU';
  const studentName = user?.name || 'Student';

  // Tabs: 'my-tests' | 'history' (Only student's tests, no global library test bank)
  const [activeTab, setActiveTab] = useState<'my-tests' | 'history'>('my-tests');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Tests & Attempts data
  const [tests, setTests] = useState<any[]>([]);
  const [myAttempts, setMyAttempts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Generator Modal State
  const [isGeneratorOpen, setIsGeneratorOpen] = useState<boolean>(false);
  const [generating, setGenerating] = useState<boolean>(false);
  const [genStep, setGenStep] = useState<string>('');

  // Form Fields (Dynamic: user selects subject and topic, bilingual by default)
  const [formExam, setFormExam] = useState<string>('General Practice / All Exams');
  const [formSubject, setFormSubject] = useState<string>('Reasoning Ability');
  const [formTopic, setFormTopic] = useState<string>('Coding-Decoding');
  const [formDifficulty, setFormDifficulty] = useState<string>('Medium');
  const [formCount, setFormCount] = useState<number>(10);
  const formLanguage = 'Bilingual';

  // Load Data for logged-in student ONLY (Show ALL tests created by student)
  const loadData = async () => {
    try {
      setLoading(true);
      const [testsRes, attemptsRes] = await Promise.all([
        mockTestService.getAll({ studentId }),
        mockTestService.getMyAttempts(studentId)
      ]);

      if (testsRes.success && Array.isArray(testsRes.data)) {
        setTests(testsRes.data);
      }
      if (attemptsRes.success && Array.isArray(attemptsRes.data)) {
        setMyAttempts(attemptsRes.data);
      }
    } catch (err: any) {
      console.error('Error loading mock tests data:', err);
      showToast('Unable to load mock tests right now.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [studentId]);

  // Handle MP Police Test Generation
  const handleGenerateCustomTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTopic.trim()) {
      showToast('Please specify a topic or chapter', 'warning');
      return;
    }

    try {
      setGenerating(true);
      setGenStep('1. Analyzing selected subject & topic syllabus...');

      const stepTimer1 = setTimeout(() => {
        setGenStep('2. Compiling subject-accurate MCQs & plausible options...');
      }, 1200);

      const stepTimer2 = setTimeout(() => {
        setGenStep('3. Adding step-by-step detailed explanations...');
      }, 2500);

      const res = await mockTestService.generateTest({
        exam: formExam,
        subject: formSubject,
        topic: formTopic.trim(),
        difficulty: formDifficulty,
        count: formCount,
        language: formLanguage,
        studentName,
        studentId
      });

      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);

      if (res.success && res.data) {
        showToast('Your practice test is ready!', 'success');
        setIsGeneratorOpen(false);
        loadData();
        const newTestId = res.data.id || res.data._id;
        navigate(`/student/test/${newTestId}`);
      } else {
        showToast(res.message || 'Unable to generate test. Please try again.', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to generate test.', 'error');
    } finally {
      setGenerating(false);
      setGenStep('');
    }
  };

  // Filtered Tests for search
  const filteredTests = tests.filter((t: any) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = t.title?.toLowerCase().includes(q);
      const matchSubject = t.subject?.toLowerCase().includes(q);
      const matchTopic = t.topic?.toLowerCase().includes(q);
      return matchTitle || matchSubject || matchTopic;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFD] pb-16">
      {/* Top Header */}
      <header className="bg-white border-b border-[#EDF1F7] sticky top-0 z-30 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/student/dashboard')}
              className="w-9 h-9 rounded-xl border border-[#EDF1F7] hover:bg-[#F8FAFD] flex items-center justify-center text-[#192038] transition-colors cursor-pointer"
              title="Back to Dashboard"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-base sm:text-lg font-black text-[#192038] tracking-tight m-0 flex items-center gap-2">
                  <Brain size={18} className="text-[#544bec]" />
                  Online CBT Mock Test & Practice Hub
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#EEF0FD] text-[#544bec] border border-[#544bec]/20">
                  Bilingual CBT
                </span>
              </div>
              <p className="text-[11px] text-[#8F9BB3] m-0">
                Practice topic-wise tests and full-length papers with instant bilingual solutions
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsGeneratorOpen(true)}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#544bec] to-[#6d64f7] hover:from-[#4338ca] hover:to-[#544bec] text-white text-xs font-black shadow-md shadow-[#544bec]/25 transition-all cursor-pointer active:scale-95"
          >
            <Sparkles size={14} className="animate-pulse" />
            <span>Create Practice Test</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-8 pt-5 space-y-5">
        {/* ======================================================== */}
        {/* HERO BANNER: GENERAL CBT PRACTICE HUB                    */}
        {/* ======================================================== */}
        <div className="bg-gradient-to-br from-[#1E1B4B] via-[#312E81] to-[#4338CA] rounded-3xl p-5 sm:p-7 text-white shadow-xl shadow-indigo-950/15 relative overflow-hidden">
          <div className="absolute -right-12 -top-12 w-64 h-64 bg-[#544bec]/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute left-1/3 -bottom-10 w-48 h-48 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-xl space-y-2.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[11px] font-bold text-amber-300">
                <Brain size={14} />
                <span>Interactive CBT Practice Hub</span>
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight leading-tight m-0">
                Master Any Subject with Targeted Practice.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-emerald-200 to-indigo-200">
                  Select Your Subject & Topic to Start Practicing.
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-indigo-100/80 m-0 leading-relaxed">
                Choose any subject and chapter to generate high-yield, topic-pure practice tests with detailed bilingual explanations and authentic CBT exam timing!
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <button
                onClick={() => setIsGeneratorOpen(true)}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-[#1E1B4B] text-xs font-black shadow-lg shadow-black/20 hover:shadow-xl transition-all cursor-pointer active:scale-95 group"
              >
                <Sparkles size={16} className="text-[#544bec] group-hover:rotate-12 transition-transform" />
                <span>Create Practice Test</span>
              </button>
            </div>
          </div>

          {/* Quick Topic Pills inside Hero */}
          <div className="mt-6 pt-5 border-t border-white/10 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-[11px] font-semibold text-white/90">
            <span className="text-white/60 shrink-0 font-medium">Quick Topics:</span>
            {[
              { label: 'Coding-Decoding', sub: 'Reasoning Ability', count: 10 },
              { label: 'Percentage & Profit/Loss', sub: 'Simple Arithmetic / Mathematics', count: 10 },
              { label: 'Number & Letter Series', sub: 'Reasoning Ability', count: 10 },
              { label: 'Simple & Compound Interest', sub: 'Simple Arithmetic / Mathematics', count: 10 },
              { label: 'Blood Relations', sub: 'Reasoning Ability', count: 10 },
              { label: 'Direction & Distance Sense', sub: 'Reasoning Ability', count: 10 },
              { label: 'Indian Constitution & Rights', sub: 'General Knowledge & Current Affairs', count: 10 },
              { label: 'Physics: SI Units & Motion', sub: 'General Science (Physics, Chemistry, Biology)', count: 10 },
              { label: 'Full 100 Qs Mock Paper', sub: 'Full Syllabus Mock Paper (100 Questions)', count: 100 }
            ].map((pill) => (
              <button
                key={pill.label}
                onClick={() => {
                  setFormSubject(pill.sub);
                  setFormTopic(pill.label);
                  setFormCount(pill.count);
                  setIsGeneratorOpen(true);
                }}
                className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 shrink-0 transition-colors cursor-pointer"
              >
                + {pill.label}
              </button>
            ))}
          </div>
        </div>

        {/* ======================================================== */}
        {/* TABS & SEARCH CONTROLS (ONLY STUDENT'S OWN TESTS)        */}
        {/* ======================================================== */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          {/* Main Tab Toggle */}
          <div className="bg-white p-1 rounded-2xl border border-[#EDF1F7] shadow-2xs flex items-center gap-1 w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('my-tests')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'my-tests'
                  ? 'bg-[#544bec] text-white shadow-xs'
                  : 'text-[#6B778C] hover:text-[#192038] hover:bg-[#F8FAFD]'
              }`}
            >
              <FileText size={14} />
              <span>My Tests ({tests.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'history'
                  ? 'bg-[#544bec] text-white shadow-xs'
                  : 'text-[#6B778C] hover:text-[#192038] hover:bg-[#F8FAFD]'
              }`}
            >
              <TrendingUp size={14} />
              <span>My Attempts & Results ({myAttempts.length})</span>
            </button>
          </div>

          {/* Search Box */}
          {activeTab === 'my-tests' && tests.length > 0 && (
            <div className="relative w-full sm:w-64">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8F9BB3]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by topic or subject..."
                className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-white border border-[#EDF1F7] text-xs font-medium text-[#192038] placeholder:text-[#8F9BB3] focus:outline-none focus:border-[#544bec] transition-all shadow-2xs"
              />
            </div>
          )}
        </div>

        {/* ======================================================== */}
        {/* TAB 1: MY TESTS (ONLY STUDENT'S OWN TESTS)               */}
        {/* ======================================================== */}
        {activeTab === 'my-tests' && (
          <div>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="bg-white rounded-2xl border border-[#EDF1F7] p-5 space-y-3 animate-pulse">
                    <div className="h-4 bg-slate-200 rounded w-1/3" />
                    <div className="h-6 bg-slate-200 rounded w-3/4" />
                    <div className="h-10 bg-slate-100 rounded" />
                  </div>
                ))}
              </div>
            ) : filteredTests.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTests.map((test: any) => {
                  const testId = test.id || test._id;
                  return (
                    <div
                      key={testId}
                      className="bg-white rounded-2xl border border-[#EDF1F7] p-5 hover:border-[#544bec]/40 hover:shadow-lg hover:shadow-[#544bec]/5 transition-all flex flex-col justify-between group"
                    >
                      <div className="space-y-3">
                        {/* Header Badges */}
                        <div className="flex items-center justify-between gap-2">
                          <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black tracking-wide uppercase bg-[#EEF0FD] text-[#544bec] border border-[#544bec]/20">
                            {test.subject || test.exam || 'Practice Test'}
                          </span>
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                            test.difficulty === 'Ultra Hard'
                              ? 'bg-red-50 text-red-700 border-red-300 shadow-sm'
                              : test.difficulty === 'Very Hard'
                              ? 'bg-purple-50 text-purple-700 border-purple-200'
                              : test.difficulty === 'Hard'
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : test.difficulty === 'Easy'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}>
                            {test.difficulty === 'Ultra Hard' ? '⚡ Ultra Hard' : test.difficulty === 'Very Hard' ? '🔥 Very Hard' : (test.difficulty || 'Medium')}
                          </span>
                        </div>

                        {/* Title & Desc */}
                        <div>
                          <h3 className="text-sm font-black text-[#192038] group-hover:text-[#544bec] transition-colors line-clamp-2 leading-snug m-0">
                            {test.title}
                          </h3>
                          <p className="text-[11px] text-[#8F9BB3] mt-1 line-clamp-2 m-0">
                            {test.description || `Subject: ${test.subject} • Topic: ${test.topic}`}
                          </p>
                        </div>

                        {/* Stats Row */}
                        <div className="grid grid-cols-3 gap-2 py-2.5 px-3 rounded-xl bg-[#F8FAFD] border border-[#EDF1F7] text-center">
                          <div>
                            <span className="text-[10px] text-[#8F9BB3] block font-medium">Questions</span>
                            <strong className="text-xs font-black text-[#192038]">
                              {test.questionsCount || 0}
                            </strong>
                          </div>
                          <div>
                            <span className="text-[10px] text-[#8F9BB3] block font-medium">Duration</span>
                            <strong className="text-xs font-black text-[#192038]">
                              {test.durationMinutes}m
                            </strong>
                          </div>
                          <div>
                            <span className="text-[10px] text-[#8F9BB3] block font-medium">Marks</span>
                            <strong className="text-xs font-black text-[#544bec]">
                              {test.totalMarks}
                            </strong>
                          </div>
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="pt-4 mt-2 border-t border-[#EDF1F7] flex items-center justify-between gap-3">
                        <span className="text-[10px] text-[#8F9BB3] truncate">
                          {formatDisplayDate(test.createdAt)}
                        </span>

                        <button
                          onClick={() => navigate(`/student/test/${testId}`)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#544bec] hover:bg-[#4338ca] text-white text-xs font-black shadow-sm shadow-[#544bec]/20 transition-all cursor-pointer active:scale-95 shrink-0"
                        >
                          <Play size={13} fill="currentColor" />
                          <span>Start Test</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-[#EDF1F7] p-8 sm:p-12 text-center space-y-4 max-w-lg mx-auto shadow-xs">
                <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-[#544bec] flex items-center justify-center mx-auto">
                  <Brain size={32} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base sm:text-lg font-black text-[#192038] m-0">
                    You haven't created any practice tests yet
                  </h3>
                  <p className="text-xs text-[#8F9BB3] m-0 max-w-sm mx-auto">
                    Prepare by selecting any subject and chapter to generate a customized practice test or full mock paper.
                  </p>
                </div>
                <button
                  onClick={() => setIsGeneratorOpen(true)}
                  className="px-6 py-3 rounded-2xl bg-[#544bec] hover:bg-[#4338ca] text-white text-xs font-black shadow-md shadow-[#544bec]/25 transition-all inline-flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <Sparkles size={16} />
                  <span>Create Practice Test</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: MY ATTEMPTS & TEST HISTORY                        */}
        {/* ======================================================== */}
        {activeTab === 'history' && (
          <div>
            {myAttempts.length > 0 ? (
              <div className="bg-white rounded-2xl border border-[#EDF1F7] shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-[#EDF1F7] text-[#8F9BB3] bg-[#F8FAFD]">
                        <th className="py-3.5 px-4 font-bold">Test Title</th>
                        <th className="py-3.5 px-4 font-bold">Date</th>
                        <th className="py-3.5 px-4 font-bold">Score</th>
                        <th className="py-3.5 px-4 font-bold">Accuracy</th>
                        <th className="py-3.5 px-4 font-bold">Correct / Wrong</th>
                        <th className="py-3.5 px-4 font-bold text-right">Solutions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EDF1F7]">
                      {myAttempts.map((att: any) => {
                        const attId = att.id || att._id;
                        const scorePct = att.percentage || 0;
                        return (
                          <tr key={attId} className="hover:bg-[#F8FAFD] transition-colors">
                            <td className="py-3.5 px-4 font-black text-[#192038]">
                              <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#EEF0FD] text-[#544bec]">
                                  {att.exam || 'MP Police'}
                                </span>
                                <span className="line-clamp-1">{att.testTitle}</span>
                              </div>
                            </td>
                            <td className="py-3.5 px-4 text-[#8F9BB3] font-medium font-mono">
                              {formatDisplayDate(att.submittedAt || att.createdAt)}
                            </td>
                            <td className="py-3.5 px-4 font-black text-[#192038]">
                              <span className="text-[#544bec]">{att.score}</span> / {att.totalMarks}
                            </td>
                            <td className="py-3.5 px-4">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                                  scorePct >= 70
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : scorePct >= 40
                                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                                }`}
                              >
                                {att.accuracy || scorePct}%
                              </span>
                            </td>
                            <td className="py-3.5 px-4 font-bold">
                              <span className="text-emerald-600">✓ {att.correctCount}</span>
                              <span className="text-[#8F9BB3] mx-1.5">•</span>
                              <span className="text-rose-500">✕ {att.wrongCount}</span>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <button
                                onClick={() => navigate(`/student/test-result/${attId}`)}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#EEF0FD] hover:bg-[#544bec] text-[#544bec] hover:text-white text-[11px] font-black transition-colors cursor-pointer"
                              >
                                <span>View Solutions</span>
                                <ChevronRight size={12} />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-[#EDF1F7] p-8 text-center space-y-3 max-w-md mx-auto shadow-xs">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Award size={28} />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#192038] m-0">No test attempts yet</h3>
                  <p className="text-xs text-[#8F9BB3] mt-1 m-0">
                    Create a test to start practicing. Your scores, accuracy, and detailed solutions will appear here.
                  </p>
                </div>
                <button
                  onClick={() => setIsGeneratorOpen(true)}
                  className="px-5 py-2.5 rounded-xl bg-[#544bec] text-white text-xs font-black shadow-md shadow-[#544bec]/20 cursor-pointer"
                >
                  Create Practice Test
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ======================================================== */}
      {/* MODAL: MP POLICE TEST GENERATOR DIALOG                    */}
      {/* ======================================================== */}
      {isGeneratorOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#EDF1F7] shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#1E1B4B] to-[#312E81] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <Brain size={20} className="text-amber-300" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black tracking-tight m-0">
                    Create Practice Test
                  </h3>
                  <p className="text-[11px] text-white/70 m-0">
                    Select any subject and topic for high-yield bilingual practice
                  </p>
                </div>
              </div>

              {!generating && (
                <button
                  onClick={() => setIsGeneratorOpen(false)}
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Modal Body / Loading State */}
            {generating ? (
              <div className="p-8 text-center space-y-4">
                <div className="relative w-16 h-16 mx-auto">
                  <div className="w-16 h-16 rounded-full border-4 border-[#544bec]/20 border-t-[#544bec] animate-spin" />
                  <Sparkles size={20} className="absolute inset-0 m-auto text-[#544bec]" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-base font-black text-[#192038] m-0">
                    Generating Practice Test...
                  </h4>
                  <p className="text-xs font-semibold text-[#544bec] animate-pulse m-0">
                    {genStep || `Compiling questions for ${formSubject} (${formTopic})...`}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-[#F8FAFD] border border-[#EDF1F7] text-[11px] text-[#8F9BB3]">
                  💡 Each question includes detailed explanations in both English and Hindi.
                </div>
              </div>
            ) : (
              <form onSubmit={handleGenerateCustomTest} className="p-5 sm:p-6 space-y-4">
                {/* 1. Subject Selection */}
                <div>
                  <label className="block text-xs font-bold text-[#192038] mb-1.5">
                    Select Subject
                  </label>
                  <select
                    value={formSubject}
                    onChange={(e) => {
                      const newSub = e.target.value;
                      setFormSubject(newSub);
                      if (SUBJECT_TOPIC_PRESETS[newSub]) {
                        setFormTopic(SUBJECT_TOPIC_PRESETS[newSub].defaultTopic);
                      }
                      if (newSub.includes('100') || newSub.includes('Full Mock')) {
                        setFormCount(100);
                      }
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#EDF1F7] text-xs font-bold text-[#192038] focus:outline-none focus:border-[#544bec]"
                  >
                    {SUBJECT_OPTIONS.map((sub) => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>

                {/* 2. Target Exam (Optional) */}
                <div>
                  <label className="block text-xs font-bold text-[#192038] mb-1.5">
                    Target Exam (Optional)
                  </label>
                  <select
                    value={formExam}
                    onChange={(e) => setFormExam(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#EDF1F7] text-xs font-medium text-[#192038] focus:outline-none focus:border-[#544bec]"
                  >
                    {EXAM_OPTIONS.map((ex) => (
                      <option key={ex} value={ex}>{ex}</option>
                    ))}
                  </select>
                </div>

                {/* 3. Specific Topic or Chapter Dropdown */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-[#192038]">
                      Specific Topic or Chapter
                    </label>
                    <span className="text-[10px] text-[#8F9BB3]">
                      {SUBJECT_TOPIC_PRESETS[formSubject]?.suggestions
                        ? `${SUBJECT_TOPIC_PRESETS[formSubject].suggestions.length} Chapters Available`
                        : 'Select Chapter'}
                    </span>
                  </div>

                  {SUBJECT_TOPIC_PRESETS[formSubject]?.suggestions ? (
                    <select
                      value={formTopic}
                      onChange={(e) => setFormTopic(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#EDF1F7] text-xs font-bold text-[#192038] focus:outline-none focus:border-[#544bec] cursor-pointer shadow-sm"
                    >
                      {SUBJECT_TOPIC_PRESETS[formSubject].suggestions.map((topicName, idx) => (
                        <option key={topicName} value={topicName}>
                          {formSubject.includes('Arithmetic') || formSubject.includes('Mathematics')
                            ? `${idx + 1}. ${topicName}`
                            : topicName}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      required
                      value={formTopic}
                      onChange={(e) => setFormTopic(e.target.value)}
                      placeholder="Enter chapter or topic name..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#EDF1F7] text-xs font-medium text-[#192038] focus:outline-none focus:border-[#544bec]"
                    />
                  )}
                </div>

                {/* 4. Number of Questions & Difficulty */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#192038] mb-1.5">
                      No. of Questions
                    </label>
                    <select
                      value={formCount}
                      onChange={(e) => setFormCount(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#EDF1F7] text-xs font-bold text-[#192038] focus:outline-none focus:border-[#544bec]"
                    >
                      <option value={10}>10 Questions (Quick Practice • 12 Mins)</option>
                      <option value={20}>20 Questions (Topic Test • 25 Mins)</option>
                      <option value={50}>50 Questions (Half Mock • 60 Mins)</option>
                      <option value={100}>🔥 100 Questions (Full Mock Paper • 90 Mins)</option>
                    </select>
                    {formCount === 100 && (
                      <span className="block mt-1 text-[10px] font-bold text-[#544bec]">
                        ⚡ Full Mock Paper: 100 Questions • 90 Mins
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#192038] mb-1.5">
                      Difficulty Level
                    </label>
                    <select
                      value={formDifficulty}
                      onChange={(e) => setFormDifficulty(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#EDF1F7] text-xs font-bold text-[#192038] focus:outline-none focus:border-[#544bec]"
                    >
                      {DIFFICULTY_OPTIONS.map((d) => (
                        <option key={d.id} value={d.id}>{d.label}</option>
                      ))}
                    </select>
                  </div>
                </div>


                {/* Actions */}
                <div className="pt-3 border-t border-[#EDF1F7] flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsGeneratorOpen(false)}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#6B778C] hover:bg-[#F8FAFD] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#544bec] to-[#6d64f7] hover:from-[#4338ca] hover:to-[#544bec] text-white text-xs font-black shadow-md shadow-[#544bec]/20 transition-all cursor-pointer active:scale-95"
                  >
                    <Sparkles size={14} />
                    <span>Generate & Start Test</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
