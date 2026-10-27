import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLibrary } from '../context/LibraryContext';
import { mockTestService } from '../services/api';
import { formatDisplayDate } from '../utils/dateFormatter';
import {
  BookOpen,
  Sparkles,
  ArrowLeft,
  Clock,
  Award,
  CheckCircle2,
  AlertCircle,
  Play,
  RotateCcw,
  BarChart2,
  Search,
  Filter,
  Brain,
  Zap,
  HelpCircle,
  FileText,
  ChevronRight,
  TrendingUp,
  X,
  Plus
} from 'lucide-react';

const EXAM_PRESETS = [
  'All',
  'SSC',
  'MP Police',
  'Railways',
  'Banking',
  'General Studies'
];

const SUBJECT_OPTIONS = [
  'Full Syllabus Mock (All 4 Sections)',
  'Quantitative Aptitude',
  'Reasoning Ability',
  'Indian Polity',
  'MP General Knowledge',
  'General Science',
  'Indian History',
  'Geography',
  'Current Affairs',
  'General Studies'
];

const SUBJECT_TOPIC_PRESETS: Record<string, { defaultTopic: string; suggestions: string[] }> = {
  'Full Syllabus Mock (All 4 Sections)': {
    defaultTopic: 'Full Mock Paper: Math + Reasoning + Science + GK',
    suggestions: ['Complete 100 Qs Exam Paper', 'TCS Speed Test Pattern', 'Previous Year Paper Mix', 'Official Syllabus Breakdown']
  },
  'Quantitative Aptitude': {
    defaultTopic: 'Percentage, Profit & Loss and Ratio',
    suggestions: ['Percentage & Profit/Loss', 'Ratio & Proportion', 'Time, Speed & Distance', 'Simple & Compound Interest', 'Number System', 'Averages & Age']
  },
  'Reasoning Ability': {
    defaultTopic: 'Coding-Decoding, Series & Analogy',
    suggestions: ['Coding-Decoding', 'Number Series', 'Blood Relations', 'Syllogism', 'Direction Sense', 'Seating Arrangement']
  },
  'Indian Polity': {
    defaultTopic: 'Constitution, Articles & Fundamental Rights',
    suggestions: ['Fundamental Rights & Articles', 'Preamble & Amendments', 'Parliament & President', 'Supreme Court & Judiciary', 'Panchayati Raj']
  },
  'General Science': {
    defaultTopic: 'Physics, Chemistry & Biology Basics',
    suggestions: ['Human Body & Diseases', 'Physics Laws & SI Units', 'Chemical Compounds & Acids', 'Electricity & Optics', 'Cell Biology']
  },
  'MP General Knowledge': {
    defaultTopic: 'MP Geography, Rivers & National Parks',
    suggestions: ['Rivers & Dams of MP', 'National Parks & Wildlife', 'MP History & Forts', 'Folk Dance & Festivals', 'MP Districts & Census']
  },
  'Indian History': {
    defaultTopic: 'Modern History & 1857 Revolt',
    suggestions: ['1857 Revolt & Freedom Struggle', 'Mughal Empire', 'Indus Valley & Vedic Period', 'Maurya & Gupta Dynasty', 'Gandhi Era & Movements']
  },
  'Geography': {
    defaultTopic: 'Indian Geography, Mountains & Rivers',
    suggestions: ['Rivers & Waterfalls of India', 'Himalayas & Physical Features', 'Climate & Monsoon', 'Soil & Crops', 'Minerals & Industries']
  },
  'Current Affairs': {
    defaultTopic: 'Recent National & International Events',
    suggestions: ['Sports & Awards', 'Government Schemes', 'Appointments & Summits', 'Defense & Exercises', 'Economy & Budget']
  },
  'General Studies': {
    defaultTopic: 'Mixed GK, Polity, History & Science',
    suggestions: ['Static GK & Headquarters', 'Indian Constitution', 'Famous Battles & History', 'Science in Everyday Life']
  }
};

const DIFFICULTY_OPTIONS = [
  { id: 'Easy', label: 'Easy (Basic Practice)' },
  { id: 'Medium', label: 'Medium (Standard Exam Level)' },
  { id: 'Hard', label: 'Hard (TCS/NTA Tough Shifts)' }
];

export const StudentTestsPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useLibrary();
  const navigate = useNavigate();

  const studentId = user?.studentId || (user as any)?._id || user?.id || 'STU';
  const studentName = user?.name || 'Student';
  const studentRollNo = user?.studentId || '-';

  // Tabs: 'catalog' | 'history'
  const [activeTab, setActiveTab] = useState<'catalog' | 'history'>('catalog');
  const [selectedExam, setSelectedExam] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Tests & Attempts data
  const [tests, setTests] = useState<any[]>([]);
  const [myAttempts, setMyAttempts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Generator Modal State
  const [isGeneratorOpen, setIsGeneratorOpen] = useState<boolean>(false);
  const [generating, setGenerating] = useState<boolean>(false);
  const [genStep, setGenStep] = useState<string>('');

  // Form Fields
  const [formExam, setFormExam] = useState<string>('SSC');
  const [formSubject, setFormSubject] = useState<string>('Indian Polity');
  const [formTopic, setFormTopic] = useState<string>('Fundamental Rights & Articles');
  const [formDifficulty, setFormDifficulty] = useState<string>('Medium');
  const [formCount, setFormCount] = useState<number>(10);
  const [formLanguage, setFormLanguage] = useState<string>('Hindi');

  // Load Data
  const loadData = async () => {
    try {
      setLoading(true);
      const [testsRes, attemptsRes] = await Promise.all([
        mockTestService.getAll({ exam: selectedExam }),
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
  }, [selectedExam]);

  // Handle AI Custom Test Generation
  const handleGenerateCustomTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTopic.trim()) {
      showToast('Please specify a topic for the test', 'warning');
      return;
    }

    try {
      setGenerating(true);
      setGenStep('1. Analyzing syllabus & latest TCS exam pattern...');

      const stepTimer1 = setTimeout(() => {
        setGenStep('2. Formulating questions & confusing MCQ options...');
      }, 1500);

      const stepTimer2 = setTimeout(() => {
        setGenStep('3. Adding step-by-step Hindi/English explanations...');
      }, 3000);

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
        showToast('Your custom practice test is ready!', 'success');
        setIsGeneratorOpen(false);
        // Refresh list
        loadData();
        // Automatically start the test
        const newTestId = res.data.id || res.data._id;
        navigate(`/student/test/${newTestId}`);
      } else {
        showToast(res.message || 'Failed to generate custom test', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to generate test. Please try again.', 'error');
    } finally {
      setGenerating(false);
      setGenStep('');
    }
  };

  // Filtered Tests
  const filteredTests = tests.filter((t: any) => {
    if (selectedExam !== 'All' && t.exam !== selectedExam) return false;
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
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black text-[#192038] tracking-tight m-0">
                  Mock Test & CBT Exam Hub
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#544bec]/10 text-[#544bec]">
                  Self-Practice
                </span>
              </div>
              <p className="text-[11px] text-[#8F9BB3] m-0">
                AI Custom Exam Generator • Real TCS/NTA Pattern • Detailed Solutions
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsGeneratorOpen(true)}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#544bec] to-[#6d64f7] hover:from-[#4338ca] hover:to-[#544bec] text-white text-xs font-black shadow-md shadow-[#544bec]/25 transition-all cursor-pointer active:scale-95"
          >
            <Sparkles size={14} className="animate-pulse" />
            <span>Create Custom Test</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-8 pt-5 space-y-5">
        {/* ======================================================== */}
        {/* HERO BANNER: AI ON-DEMAND TEST GENERATOR                 */}
        {/* ======================================================== */}
        <div className="bg-gradient-to-br from-[#1E1B4B] via-[#312E81] to-[#4338CA] rounded-3xl p-5 sm:p-7 text-white shadow-xl shadow-indigo-950/15 relative overflow-hidden">
          {/* Ambient shapes */}
          <div className="absolute -right-12 -top-12 w-64 h-64 bg-[#544bec]/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute left-1/3 -bottom-10 w-48 h-48 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-xl space-y-2.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[11px] font-bold text-amber-300">
                <Brain size={14} />
                <span>Personalized AI Exam Engine</span>
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight leading-tight m-0">
                Choose Your Exam & Topic.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-emerald-200 to-indigo-200">
                  Generate Your Own Mock Test in 5s.
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-indigo-100/80 m-0 leading-relaxed">
                Ab kisi coaching ya fixed test ka wait mat karo. Jo topic kamzor lage (jaise Polity Articles, Blood Relations, MP GK), uska instant test banao aur live exam hall ki tarah solve karo!
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <button
                onClick={() => setIsGeneratorOpen(true)}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-[#1E1B4B] text-xs font-black shadow-lg shadow-black/20 hover:shadow-xl transition-all cursor-pointer active:scale-95 group"
              >
                <Sparkles size={16} className="text-[#544bec] group-hover:rotate-12 transition-transform" />
                <span>Create Test with AI</span>
              </button>
            </div>
          </div>

          {/* Quick Exam Pills inside Hero */}
          <div className="mt-6 pt-5 border-t border-white/10 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-[11px] font-semibold text-white/90">
            <span className="text-white/60 shrink-0 font-medium">Popular Exams:</span>
            {['SSC CGL / GD', 'MP Police Constable', 'Railway NTPC', 'Banking PO', 'Indian Polity (PYQ)'].map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  setFormTopic(tag);
                  setIsGeneratorOpen(true);
                }}
                className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 shrink-0 transition-colors cursor-pointer"
              >
                + {tag}
              </button>
            ))}
          </div>
        </div>

        {/* ======================================================== */}
        {/* TABS & SEARCH CONTROLS                                   */}
        {/* ======================================================== */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          {/* Main Tab Toggle */}
          <div className="bg-white p-1 rounded-2xl border border-[#EDF1F7] shadow-2xs flex items-center gap-1 w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('catalog')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'catalog'
                  ? 'bg-[#544bec] text-white shadow-xs'
                  : 'text-[#6B778C] hover:text-[#192038] hover:bg-[#F8FAFD]'
              }`}
            >
              <BookOpen size={14} />
              <span>Library Tests ({tests.length})</span>
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
              <span>My Test Attempts ({myAttempts.length})</span>
            </button>
          </div>

          {/* Search Box */}
          {activeTab === 'catalog' && (
            <div className="relative w-full sm:w-64">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8F9BB3]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search test by topic or exam..."
                className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-white border border-[#EDF1F7] text-xs font-medium text-[#192038] placeholder:text-[#8F9BB3] focus:outline-none focus:border-[#544bec] transition-all shadow-2xs"
              />
            </div>
          )}
        </div>

        {/* Exam Filter Chips (Only for Catalog Tab) */}
        {activeTab === 'catalog' && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {EXAM_PRESETS.map((exam) => (
              <button
                key={exam}
                onClick={() => setSelectedExam(exam)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  selectedExam === exam
                    ? 'bg-[#192038] text-white shadow-xs'
                    : 'bg-white border border-[#EDF1F7] text-[#6B778C] hover:text-[#192038] hover:bg-slate-50'
                }`}
              >
                {exam}
              </button>
            ))}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 1: LIBRARY TEST BANK                                 */}
        {/* ======================================================== */}
        {activeTab === 'catalog' && (
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
                            {test.exam || 'General'}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400">
                            {test.difficulty || 'Medium'}
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
                          {test.isAiGenerated ? '✨ AI Generated' : '🏛️ Library Seed'}
                        </span>

                        <button
                          onClick={() => navigate(`/student/test/${testId}`)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#544bec] hover:bg-[#4338ca] text-white text-xs font-black shadow-xs transition-all cursor-pointer active:scale-95 shrink-0"
                        >
                          <Play size={12} fill="currentColor" />
                          <span>Start Test</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-[#EDF1F7] p-8 text-center space-y-4 max-w-md mx-auto shadow-xs">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-[#EEF0FD] text-[#544bec] flex items-center justify-center">
                  <Brain size={28} />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#192038] m-0">No tests found in this category</h3>
                  <p className="text-xs text-[#8F9BB3] mt-1 m-0">
                    Aap apna manchaha test AI se abhi 5 second me generate kar sakte hain!
                  </p>
                </div>
                <button
                  onClick={() => setIsGeneratorOpen(true)}
                  className="px-5 py-2.5 rounded-xl bg-[#544bec] hover:bg-[#4338ca] text-white text-xs font-black shadow-md shadow-[#544bec]/20 cursor-pointer"
                >
                  Create Custom Test Now
                </button>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: MY TEST ATTEMPTS & SCORES                         */}
        {/* ======================================================== */}
        {activeTab === 'history' && (
          <div>
            {myAttempts.length > 0 ? (
              <div className="bg-white rounded-3xl border border-[#EDF1F7] shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-[#EDF1F7] text-[#8F9BB3] bg-[#F8FAFD]">
                        <th className="py-3.5 px-4 font-bold">Exam / Test Title</th>
                        <th className="py-3.5 px-4 font-bold">Date</th>
                        <th className="py-3.5 px-4 font-bold">Score</th>
                        <th className="py-3.5 px-4 font-bold">Accuracy</th>
                        <th className="py-3.5 px-4 font-bold">Correct / Wrong</th>
                        <th className="py-3.5 px-4 font-bold text-right">Actions</th>
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
                                  {att.exam || 'Test'}
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
                                <span>Solutions</span>
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
                  <h3 className="text-base font-black text-[#192038] m-0">No test attempts yet!</h3>
                  <p className="text-xs text-[#8F9BB3] mt-1 m-0">
                    Aapne abhi tak koi test nahi diya hai. Library test bank me se koi bhi test select karke shuru karein.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('catalog')}
                  className="px-5 py-2.5 rounded-xl bg-[#544bec] text-white text-xs font-black shadow-md shadow-[#544bec]/20 cursor-pointer"
                >
                  Browse Practice Tests
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ======================================================== */}
      {/* MODAL: AI CUSTOM TEST GENERATOR DIALOG                    */}
      {/* ======================================================== */}
      {isGeneratorOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#EDF1F7] shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#1E1B4B] to-[#312E81] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <Sparkles size={20} className="text-amber-300 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black tracking-tight m-0">
                    Create Custom Exam with AI
                  </h3>
                  <p className="text-[11px] text-white/70 m-0">
                    Generate questions tailored specifically to your weak areas
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
                    AI Examiner is Crafting Your Test...
                  </h4>
                  <p className="text-xs font-semibold text-[#544bec] animate-pulse m-0">
                    {genStep || 'Generating authentic TCS-pattern questions...'}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-[#F8FAFD] border border-[#EDF1F7] text-[11px] text-[#8F9BB3]">
                  💡 Har question ke saath detail solution aur exam reference save ho raha hai.
                </div>
              </div>
            ) : (
              <form onSubmit={handleGenerateCustomTest} className="p-5 sm:p-6 space-y-4">
                {/* 1. Exam Target */}
                <div>
                  <label className="block text-xs font-bold text-[#192038] mb-1.5">
                    Target Competitive Exam
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['SSC', 'MP Police', 'Railways', 'Banking', 'UPSC / State', 'Vyapam'].map((ex) => (
                      <button
                        type="button"
                        key={ex}
                        onClick={() => setFormExam(ex)}
                        className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center truncate ${
                          formExam === ex
                            ? 'bg-[#EEF0FD] border-[#544bec] text-[#544bec] shadow-xs'
                            : 'bg-white border-[#EDF1F7] text-[#6B778C] hover:bg-[#F8FAFD]'
                        }`}
                      >
                        {ex}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Subject */}
                <div>
                  <label className="block text-xs font-bold text-[#192038] mb-1.5">
                    Subject / Area
                  </label>
                  <select
                    value={formSubject}
                    onChange={(e) => {
                      const newSub = e.target.value;
                      setFormSubject(newSub);
                      if (SUBJECT_TOPIC_PRESETS[newSub]) {
                        setFormTopic(SUBJECT_TOPIC_PRESETS[newSub].defaultTopic);
                      }
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#EDF1F7] text-xs font-bold text-[#192038] focus:outline-none focus:border-[#544bec]"
                  >
                    {SUBJECT_OPTIONS.map((sub) => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>

                {/* 3. Specific Topic Input & Quick Chips */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-[#192038]">
                      Specific Topic or Chapter
                    </label>
                    <span className="text-[10px] text-[#8F9BB3]">Click suggestion below or type custom</span>
                  </div>
                  <input
                    type="text"
                    required
                    value={formTopic}
                    onChange={(e) => setFormTopic(e.target.value)}
                    placeholder="Enter chapter name or topic to practice..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#EDF1F7] text-xs font-medium text-[#192038] focus:outline-none focus:border-[#544bec]"
                  />

                  {/* Suggestion Chips */}
                  {SUBJECT_TOPIC_PRESETS[formSubject]?.suggestions && (
                    <div className="flex items-center gap-1.5 flex-wrap pt-2">
                      <span className="text-[10px] text-[#8F9BB3] font-medium">Quick Topics:</span>
                      {SUBJECT_TOPIC_PRESETS[formSubject].suggestions.map((sug) => (
                        <button
                          type="button"
                          key={sug}
                          onClick={() => setFormTopic(sug)}
                          className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${
                            formTopic === sug
                              ? 'bg-[#EEF0FD] text-[#544bec] border-[#544bec]'
                              : 'bg-[#F8FAFD] text-[#6B778C] border-[#EDF1F7] hover:bg-slate-100 hover:text-[#192038]'
                          }`}
                        >
                          + {sug}
                        </button>
                      ))}
                    </div>
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
                      <option value={25}>25 Questions (Section Test • 30 Mins)</option>
                      <option value={50}>50 Questions (Half Mock • 60 Mins)</option>
                      <option value={100}>🔥 100 Questions (Full Mock Paper • 90 Mins)</option>
                    </select>
                    {formCount === 100 && (
                      <span className="block mt-1 text-[10px] font-bold text-[#544bec]">
                        ⚡ Official 100 Qs Paper: 90 Mins • 200 Marks
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

                {/* 5. Language */}
                <div>
                  <label className="block text-xs font-bold text-[#192038] mb-1.5">
                    Question Language
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Hindi', 'English'].map((lang) => (
                      <button
                        type="button"
                        key={lang}
                        onClick={() => setFormLanguage(lang)}
                        className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                          formLanguage === lang
                            ? 'bg-[#EEF0FD] border-[#544bec] text-[#544bec]'
                            : 'bg-white border-[#EDF1F7] text-[#6B778C]'
                        }`}
                      >
                        {lang}
                      </button>
                    ))}
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
