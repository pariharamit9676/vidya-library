import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockTestService } from '../services/api';
import { useLibrary } from '../context/LibraryContext';
import {
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  TrendingUp,
  HelpCircle,
  Lightbulb,
  Check,
  X,
  ChevronDown,
  Filter
} from 'lucide-react';

export const StudentTestResultPage: React.FC = () => {
  const { attemptId } = useParams<{ attemptId: string }>();
  const navigate = useNavigate();
  const { showToast } = useLibrary();

  const [attempt, setAttempt] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterMode, setFilterMode] = useState<'all' | 'wrong' | 'correct' | 'skipped'>('all');

  useEffect(() => {
    if (!attemptId) return;

    const fetchResult = async () => {
      try {
        setLoading(true);
        const res = await mockTestService.getAttemptDetails(attemptId);
        if (res.success && res.data) {
          setAttempt(res.data);
        } else {
          showToast('Unable to load test result', 'error');
          navigate('/student/tests');
        }
      } catch (err: any) {
        showToast(err.message || 'Error loading test result', 'error');
        navigate('/student/tests');
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [attemptId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFD] flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-3 border-[#544bec]/20 border-t-[#544bec] rounded-full animate-spin" />
        <span className="text-xs font-bold text-slate-500">Calculating your test scorecard & rank...</span>
      </div>
    );
  }

  if (!attempt) {
    return (
      <div className="min-h-screen bg-[#F8FAFD] flex flex-col items-center justify-center p-4">
        <div className="bg-white p-6 rounded-2xl border text-center space-y-3">
          <p className="text-sm font-bold text-slate-700">Test result not found.</p>
          <button
            onClick={() => navigate('/student/tests')}
            className="px-4 py-2 bg-[#544bec] text-white text-xs font-bold rounded-xl"
          >
            Back to Tests
          </button>
        </div>
      </div>
    );
  }

  const scorePct = attempt.percentage || 0;
  const breakdown = attempt.breakdown || [];

  // Filter questions for review
  const filteredQuestions = breakdown.filter((item: any) => {
    if (filterMode === 'wrong') return item.isAttempted && !item.isCorrect;
    if (filterMode === 'correct') return item.isCorrect;
    if (filterMode === 'skipped') return !item.isAttempted;
    return true;
  });

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}m ${s}s`;
  };

  // Performance title & badge
  let verdict = {
    title: 'Outstanding Performance! 🏆',
    sub: 'Aapki exam readiness bohot strong hai. Aise hi consistency maintain rakhein.',
    badge: 'Exam Ready'
  };
  if (scorePct < 40) {
    verdict = {
      title: 'Practice Needed 📚',
      sub: 'Neeche diye gaye galat answers aur unke explanations ko dhyan se padhein.',
      badge: 'Focus on Basics'
    };
  } else if (scorePct < 70) {
    verdict = {
      title: 'Good Effort! 👍',
      sub: 'Acha prayas! Weak areas me thoda aur revision karke re-attempt karein.',
      badge: 'Getting There'
    };
  }

  return (
    <div className="min-h-screen bg-[#F8FAFD] pb-16">
      {/* Top Header */}
      <header className="bg-white border-b border-[#EDF1F7] sticky top-0 z-30 shadow-xs">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
          <button
            onClick={() => navigate('/student/tests')}
            className="flex items-center gap-2 text-xs font-bold text-[#192038] hover:text-[#544bec] transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Back to All Tests</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(`/student/test/${attempt.testId}`)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-[#EDF1F7] bg-white hover:bg-slate-50 text-xs font-bold text-[#192038] transition-colors cursor-pointer"
            >
              <RotateCcw size={13} />
              <span>Re-attempt Test</span>
            </button>

            <button
              onClick={() => navigate('/student/tests')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#544bec] hover:bg-[#4338ca] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <Sparkles size={13} />
              <span>New AI Test</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-8 pt-6 space-y-6">
        {/* ======================================================== */}
        {/* HERO SCORECARD                                           */}
        {/* ======================================================== */}
        <div className="bg-white rounded-3xl border border-[#EDF1F7] p-6 sm:p-8 shadow-xs relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EEF0FD] text-[#544bec] text-[11px] font-black">
                <span>{attempt.exam || 'Test'}</span>
                <span>•</span>
                <span>{verdict.badge}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-[#192038] m-0">
                {attempt.testTitle}
              </h1>
              <p className="text-xs sm:text-sm text-[#8F9BB3] m-0 max-w-xl">
                {verdict.sub}
              </p>
            </div>

            {/* Big Score Display */}
            <div className="flex items-center gap-4 bg-[#F8FAFD] p-4 sm:p-5 rounded-2xl border border-[#EDF1F7] shrink-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-[#544bec] to-[#6d64f7] text-white flex flex-col items-center justify-center shadow-lg shadow-[#544bec]/20 shrink-0">
                <span className="text-2xl sm:text-3xl font-black leading-none">
                  {attempt.score}
                </span>
                <span className="text-[10px] font-bold text-white/80 mt-0.5">
                  / {attempt.totalMarks}
                </span>
              </div>
              <div>
                <span className="text-xs font-black text-[#192038] block">
                  {scorePct}% Score
                </span>
                <span className="text-[11px] font-bold text-emerald-600 block mt-0.5">
                  {attempt.accuracy}% Accuracy
                </span>
                <span className="text-[10px] text-[#8F9BB3] font-medium block mt-1">
                  Time: {formatSeconds(attempt.timeSpentSeconds || 0)}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-[#EDF1F7]">
            <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <Check size={18} />
              </div>
              <div>
                <span className="text-[10px] font-bold text-emerald-800 block">Correct</span>
                <strong className="text-sm font-black text-emerald-900">{attempt.correctCount}</strong>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0">
                <X size={18} />
              </div>
              <div>
                <span className="text-[10px] font-bold text-rose-800 block">Incorrect</span>
                <strong className="text-sm font-black text-rose-900">{attempt.wrongCount}</strong>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-400 text-white flex items-center justify-center shrink-0">
                <Clock size={18} />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-600 block">Skipped</span>
                <strong className="text-sm font-black text-slate-800">{attempt.unattemptedCount}</strong>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#EEF0FD]/70 border border-[#544bec]/20 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#544bec] text-white flex items-center justify-center shrink-0">
                <TrendingUp size={18} />
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#544bec] block">Accuracy</span>
                <strong className="text-sm font-black text-[#192038]">{attempt.accuracy}%</strong>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* DETAILED QUESTION-BY-QUESTION SOLUTIONS                   */}
        {/* ======================================================== */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base sm:text-lg font-black text-[#192038] m-0">
                Question & Solution Analysis
              </h2>
              <p className="text-xs text-[#8F9BB3] m-0">
                Detailed step-by-step explanations for each question
              </p>
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <button
                onClick={() => setFilterMode('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  filterMode === 'all'
                    ? 'bg-[#192038] text-white'
                    : 'bg-white border border-[#EDF1F7] text-[#6B778C] hover:bg-slate-50'
                }`}
              >
                All ({breakdown.length})
              </button>

              <button
                onClick={() => setFilterMode('wrong')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  filterMode === 'wrong'
                    ? 'bg-rose-600 text-white'
                    : 'bg-white border border-[#EDF1F7] text-rose-600 hover:bg-rose-50'
                }`}
              >
                Mistakes ({attempt.wrongCount})
              </button>

              <button
                onClick={() => setFilterMode('correct')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  filterMode === 'correct'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white border border-[#EDF1F7] text-emerald-700 hover:bg-emerald-50'
                }`}
              >
                Correct ({attempt.correctCount})
              </button>

              <button
                onClick={() => setFilterMode('skipped')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  filterMode === 'skipped'
                    ? 'bg-slate-600 text-white'
                    : 'bg-white border border-[#EDF1F7] text-slate-600 hover:bg-slate-50'
                }`}
              >
                Skipped ({attempt.unattemptedCount})
              </button>
            </div>
          </div>

          {/* Solutions List */}
          <div className="space-y-4">
            {filteredQuestions.map((q: any, idx: number) => {
              const isCorrect = q.isCorrect;
              const isWrong = q.isAttempted && !isCorrect;
              const isSkipped = !q.isAttempted;

              return (
                <div
                  key={q.questionId || idx}
                  className={`bg-white rounded-2xl sm:rounded-3xl border p-5 sm:p-6 space-y-4 shadow-xs transition-all ${
                    isCorrect
                      ? 'border-emerald-200'
                      : isWrong
                      ? 'border-rose-200'
                      : 'border-[#EDF1F7]'
                  }`}
                >
                  {/* Question Status Badge */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-black text-[#8F9BB3]">
                      Question #{idx + 1}
                    </span>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                        isCorrect
                          ? 'bg-emerald-100 text-emerald-800'
                          : isWrong
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {isCorrect ? '✓ Correct Answer' : isWrong ? '✕ Wrong Answer' : '• Skipped'}
                    </span>
                  </div>

                  {/* Question Text */}
                  <h3 className="text-sm sm:text-base font-bold text-[#192038] leading-relaxed m-0">
                    {q.questionText}
                  </h3>

                  {/* Options with Comparison */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {q.options?.map((opt: any) => {
                      const isCorrectAnswer = opt.id === q.correctAnswer;
                      const isStudentSelected = opt.id === q.studentAnswer;

                      let optClass = 'bg-[#F8FAFD] border-[#EDF1F7] text-[#6B778C]';
                      if (isCorrectAnswer) {
                        optClass = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold';
                      } else if (isStudentSelected && !isCorrect) {
                        optClass = 'bg-rose-50 border-rose-400 text-rose-900 font-medium';
                      }

                      return (
                        <div
                          key={opt.id}
                          className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-xs ${optClass}`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span
                              className={`w-6 h-6 rounded-lg flex items-center justify-center font-black text-[11px] shrink-0 ${
                                isCorrectAnswer
                                  ? 'bg-emerald-600 text-white'
                                  : isStudentSelected
                                  ? 'bg-rose-600 text-white'
                                  : 'bg-slate-200 text-slate-700'
                              }`}
                            >
                              {opt.id}
                            </span>
                            <span className="truncate">{opt.text}</span>
                          </div>

                          {/* Status Tags */}
                          {isCorrectAnswer && (
                            <span className="text-[10px] font-black text-emerald-700 shrink-0">
                              Correct Key
                            </span>
                          )}
                          {isStudentSelected && !isCorrect && (
                            <span className="text-[10px] font-black text-rose-600 shrink-0">
                              Your Answer
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation Box */}
                  <div className="p-3.5 sm:p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-[#544bec] text-white flex items-center justify-center shrink-0 mt-0.5">
                      <Lightbulb size={15} />
                    </div>
                    <div className="space-y-1 min-w-0">
                      <span className="text-xs font-black text-[#544bec] block">
                        Detailed Solution Explanation:
                      </span>
                      <p className="text-xs text-slate-700 leading-relaxed m-0">
                        {q.explanation || 'No detailed explanation provided for this question.'}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};
