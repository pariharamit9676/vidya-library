import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLibrary } from '../context/LibraryContext';
import { mockTestService } from '../services/api';
import {
  Clock,
  AlertTriangle,
  CheckCircle2,
  Bookmark,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  Send,
  HelpCircle,
  ShieldAlert,
  X,
  Menu,
  Info,
  LayoutGrid,
  UserCheck
} from 'lucide-react';

export const StudentLiveTestPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useLibrary();

  const studentId = user?.studentId || (user as any)?._id || user?.id || 'STU';
  const studentName = user?.name || 'Student';
  const studentRollNo = user?.studentId || '-';

  // State
  const [test, setTest] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Student Answers: { [questionId]: 'A' | 'B' | 'C' | 'D' }
  const [answers, setAnswers] = useState<Record<string, string>>({});

  // Marked for review set: Set<questionId>
  const [markedForReview, setMarkedForReview] = useState<Set<string>>(new Set());

  // Visited questions set
  const [visited, setVisited] = useState<Set<string>>(new Set());

  // Timer: remaining seconds
  const [remainingSeconds, setRemainingSeconds] = useState<number>(0);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState<boolean>(false);
  const [isPaletteOpenMobile, setIsPaletteOpenMobile] = useState<boolean>(false);

  const initialDurationRef = useRef<number>(0);

  // Load Test Data
  useEffect(() => {
    if (!id) return;

    const fetchTest = async () => {
      try {
        setLoading(true);
        // Request in 'test' mode to hide solutions during exam
        const res = await mockTestService.getById(id, 'test');
        if (res.success && res.data) {
          const testData = res.data;
          setTest(testData);

          const totalSeconds = (testData.durationMinutes || 15) * 60;
          setRemainingSeconds(totalSeconds);
          initialDurationRef.current = totalSeconds;

          // Mark first question as visited
          if (testData.questions && testData.questions.length > 0) {
            setVisited(new Set([testData.questions[0].id]));
          }
        } else {
          showToast('Failed to load test details', 'error');
          navigate('/student/tests');
        }
      } catch (err: any) {
        showToast(err.message || 'Error loading test', 'error');
        navigate('/student/tests');
      } finally {
        setLoading(false);
      }
    };

    fetchTest();
  }, [id]);

  // Countdown Timer
  useEffect(() => {
    if (loading || !test || remainingSeconds <= 0) return;

    const timer = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Auto submit when time runs out
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, test, remainingSeconds]);

  // Format Timer HH:MM:SS
  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Questions array
  const questions = test?.questions || [];
  const currentQ = questions[currentIndex] || null;

  // Handle select option
  const handleSelectOption = (optionId: string) => {
    if (!currentQ) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optionId
    }));
  };

  // Clear response for current question
  const handleClearResponse = () => {
    if (!currentQ) return;
    setAnswers((prev) => {
      const copy = { ...prev };
      delete copy[currentQ.id];
      return copy;
    });
  };

  // Toggle mark for review
  const handleToggleReview = () => {
    if (!currentQ) return;
    setMarkedForReview((prev) => {
      const copy = new Set(prev);
      if (copy.has(currentQ.id)) {
        copy.delete(currentQ.id);
      } else {
        copy.add(currentQ.id);
      }
      return copy;
    });
  };

  // Move to question index
  const goToQuestion = (idx: number) => {
    if (idx < 0 || idx >= questions.length) return;
    setCurrentIndex(idx);
    const nextQ = questions[idx];
    if (nextQ) {
      setVisited((prev) => new Set(prev).add(nextQ.id));
    }
    setIsPaletteOpenMobile(false);
  };

  // Save & Next
  const handleSaveAndNext = () => {
    if (currentIndex < questions.length - 1) {
      goToQuestion(currentIndex + 1);
    } else {
      // Last question - open submit modal
      setIsSubmitModalOpen(true);
    }
  };

  // Mark for Review & Next
  const handleReviewAndNext = () => {
    handleToggleReview();
    if (currentIndex < questions.length - 1) {
      goToQuestion(currentIndex + 1);
    }
  };

  // Calculate status counts
  const answeredCount = Object.keys(answers).length;
  const reviewCount = markedForReview.size;
  const unattemptedCount = Math.max(0, questions.length - answeredCount);
  const visitedCount = visited.size;
  const skippedCount = questions.filter((q: any) => visited.has(q.id) && !answers[q.id]).length;
  const notVisitedCount = Math.max(0, questions.length - visitedCount);

  // Auto Submit on Time Expiry
  const handleAutoSubmit = async () => {
    showToast('Time has expired! Submitting your test automatically...', 'warning');
    await submitTestAnswers();
  };

  // Final Submit Handler
  const submitTestAnswers = async () => {
    if (!id || submitting) return;

    try {
      setSubmitting(true);
      const timeSpentSeconds = Math.max(1, initialDurationRef.current - remainingSeconds);

      const res = await mockTestService.submitAttempt(id, {
        studentId,
        studentName,
        studentRollNo,
        answers,
        timeSpentSeconds
      });

      if (res.success && res.data) {
        showToast('Test completed successfully!', 'success');
        const attemptId = res.data.attempt?.id || res.data.attempt?._id;
        navigate(`/student/test-result/${attemptId}`, { replace: true });
      } else {
        showToast(res.message || 'Submission failed. Please try again.', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to submit test', 'error');
    } finally {
      setSubmitting(false);
      setIsSubmitModalOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFD] flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-3 border-[#544bec]/20 border-t-[#544bec] rounded-full animate-spin" />
        <span className="text-xs font-bold text-slate-500">Entering Examination Hall...</span>
      </div>
    );
  }

  if (!test || questions.length === 0) {
    return (
      <div className="min-h-screen bg-[#F8FAFD] flex flex-col items-center justify-center p-4">
        <div className="bg-white p-6 rounded-2xl border text-center space-y-3">
          <p className="text-sm font-bold text-slate-700">No questions found in this test.</p>
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

  const isLowTime = remainingSeconds <= 120; // less than 2 mins

  return (
    <div className="min-h-screen bg-[#F1F4F9] flex flex-col select-none">
      {/* ======================================================== */}
      {/* CBT EXAM TOP BAR                                         */}
      {/* ======================================================== */}
      <header className="bg-white border-b border-[#EDF1F7] px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3 shadow-xs sticky top-0 z-40">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-[#544bec] text-white flex items-center justify-center font-black text-xs shrink-0">
            CBT
          </div>
          <div className="min-w-0">
            <h1 className="text-xs sm:text-sm font-black text-[#192038] truncate m-0">
              {test.title}
            </h1>
            <div className="flex items-center gap-2 text-[10px] text-[#8F9BB3] font-medium">
              <span>{test.exam}</span>
              <span>•</span>
              <span>Marks: +{test.marksPerQuestion || 2}, -{test.negativeMarks || 0.5}</span>
            </div>
          </div>
        </div>

        {/* Right side: Timer & Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Live Timer Clock */}
          <div
            className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 transition-colors ${
              isLowTime
                ? 'bg-rose-50 border-rose-300 text-rose-600 animate-pulse'
                : 'bg-[#F8FAFD] border-[#EDF1F7] text-[#192038]'
            }`}
          >
            <Clock size={15} className={isLowTime ? 'text-rose-600 animate-spin' : 'text-[#544bec]'} />
            <span className="font-mono text-xs sm:text-sm font-black tracking-wider">
              {formatTimer(remainingSeconds)}
            </span>
          </div>

          {/* Palette Toggle on Mobile */}
          <button
            onClick={() => setIsPaletteOpenMobile(!isPaletteOpenMobile)}
            className="md:hidden w-8 h-8 rounded-lg border border-[#EDF1F7] flex items-center justify-center text-[#192038] cursor-pointer"
          >
            <Menu size={16} />
          </button>

          {/* Submit Test Button */}
          <button
            onClick={() => setIsSubmitModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-xs transition-all cursor-pointer active:scale-95 flex items-center gap-1.5"
          >
            <CheckCircle2 size={14} />
            <span className="hidden sm:inline">Submit Test</span>
          </button>
        </div>
      </header>

      {/* ======================================================== */}
      {/* MAIN EXAM BODY (Split: Question Area + Question Palette)  */}
      {/* ======================================================== */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 flex flex-col md:flex-row items-start gap-4">
        {/* LEFT / CENTER: QUESTION PAPER INTERFACE */}
        <div className="flex-1 w-full bg-white rounded-2xl sm:rounded-3xl border border-[#EDF1F7] shadow-xs flex flex-col justify-between overflow-hidden min-h-[520px]">
          {/* Question Header Bar */}
          <div className="px-5 py-3.5 border-b border-[#EDF1F7] bg-[#F8FAFD] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-[#544bec] text-white text-xs font-black">
                Q {currentIndex + 1}
              </span>
              <span className="text-xs font-bold text-[#8F9BB3]">
                of {questions.length} Questions
              </span>
            </div>

            <div className="flex items-center gap-2 text-[11px] font-bold">
              <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                +{test.marksPerQuestion || 2} Marks
              </span>
              <span className="text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                -{test.negativeMarks || 0.5} Negative
              </span>
            </div>
          </div>

          {/* Question Text & Options */}
          <div className="p-5 sm:p-7 flex-1 overflow-y-auto space-y-6">
            {/* Question Text */}
            <div className="text-sm sm:text-base font-bold text-[#192038] leading-relaxed">
              {currentQ?.question}
            </div>

            {/* Options List */}
            <div className="space-y-3 pt-2">
              {currentQ?.options?.map((opt: any) => {
                const isSelected = answers[currentQ.id] === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => handleSelectOption(opt.id)}
                    className={`p-3.5 sm:p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-3.5 ${
                      isSelected
                        ? 'border-[#544bec] bg-[#EEF0FD]/60 shadow-xs'
                        : 'border-[#EDF1F7] hover:border-slate-300 hover:bg-[#F8FAFD]'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-[#544bec] text-white'
                          : 'bg-[#EDF1F7] text-[#6B778C]'
                      }`}
                    >
                      {opt.id}
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-[#192038] leading-snug">
                      {opt.text}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Action Buttons (TCS iON Style) */}
          <div className="p-4 border-t border-[#EDF1F7] bg-[#F8FAFD] flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleReviewAndNext}
                className="px-3.5 py-2 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Bookmark size={13} fill={markedForReview.has(currentQ?.id) ? 'currentColor' : 'none'} />
                <span>Mark for Review</span>
              </button>

              <button
                type="button"
                onClick={handleClearResponse}
                disabled={!answers[currentQ?.id]}
                className="px-3 py-2 rounded-xl text-xs font-bold text-[#6B778C] hover:text-rose-600 hover:bg-rose-50 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer transition-colors"
              >
                Clear Response
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => goToQuestion(currentIndex - 1)}
                disabled={currentIndex === 0}
                className="px-3 py-2 rounded-xl border border-[#EDF1F7] bg-white text-xs font-bold text-[#192038] hover:bg-slate-50 disabled:opacity-30 cursor-pointer flex items-center gap-1"
              >
                <ChevronLeft size={14} />
                <span>Previous</span>
              </button>

              <button
                type="button"
                onClick={handleSaveAndNext}
                className="px-5 py-2 rounded-xl bg-[#544bec] hover:bg-[#4338ca] text-white text-xs font-black shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>{currentIndex === questions.length - 1 ? 'Save & Finish' : 'Save & Next'}</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT: QUESTION PALETTE SIDEBAR */}
        <aside
          className={`w-full md:w-80 bg-white rounded-2xl sm:rounded-3xl border border-[#EDF1F7] shadow-xs p-4 sm:p-5 flex flex-col gap-4 shrink-0 md:sticky md:top-16 ${
            isPaletteOpenMobile ? 'block' : 'hidden md:flex'
          }`}
        >
          {/* Candidate Profile (TCS iON Exam Style) */}
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#F8FAFD] border border-[#EDF1F7]">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#544bec] to-[#7970ff] text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs uppercase">
              {studentName ? studentName.slice(0, 2) : 'ST'}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-black text-[#192038] truncate">{studentName || 'Student'}</div>
              <div className="text-[10px] text-[#8F9BB3] font-semibold truncate">
                Roll No: {studentRollNo || 'CBT-01'} • {test.exam}
              </div>
            </div>
          </div>

          {/* Palette Header */}
          <div className="flex items-center justify-between border-b border-[#EDF1F7] pb-2.5">
            <div className="flex items-center gap-1.5">
              <LayoutGrid size={14} className="text-[#544bec]" />
              <h3 className="text-xs font-black uppercase tracking-wider text-[#192038] m-0">
                Question Palette
              </h3>
            </div>
            <span className="text-[11px] font-black text-[#544bec] bg-[#EEF0FD] px-2 py-0.5 rounded-md">
              {answeredCount}/{questions.length} Attempted
            </span>
          </div>

          {/* Real-time Status Badges */}
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="flex items-center gap-2 p-2 rounded-xl bg-emerald-50 border border-emerald-100">
              <span className="w-5 h-5 rounded-md bg-emerald-600 text-white flex items-center justify-center text-[10px] font-black">
                {answeredCount}
              </span>
              <span className="text-emerald-900 font-bold text-[10.5px]">Answered</span>
            </div>

            <div className="flex items-center gap-2 p-2 rounded-xl bg-amber-50 border border-amber-100">
              <span className="w-5 h-5 rounded-md bg-amber-500 text-white flex items-center justify-center text-[10px] font-black">
                {reviewCount}
              </span>
              <span className="text-amber-900 font-bold text-[10.5px]">Review</span>
            </div>

            <div className="flex items-center gap-2 p-2 rounded-xl bg-rose-50 border border-rose-100">
              <span className="w-5 h-5 rounded-md bg-rose-500 text-white flex items-center justify-center text-[10px] font-black">
                {skippedCount}
              </span>
              <span className="text-rose-900 font-bold text-[10.5px]">Skipped</span>
            </div>

            <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200">
              <span className="w-5 h-5 rounded-md bg-slate-300 text-slate-700 flex items-center justify-center text-[10px] font-black">
                {notVisitedCount}
              </span>
              <span className="text-slate-700 font-bold text-[10.5px]">Not Visited</span>
            </div>
          </div>

          {/* Question Number Grid */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[10px] font-bold text-[#8F9BB3] uppercase tracking-wider px-0.5">
              <span>Choose Question:</span>
              <span className="text-[#544bec]">{currentIndex + 1} of {questions.length}</span>
            </div>

            {/* Quick Range / Section Jump for Large 100-Question Papers */}
            {questions.length >= 30 && (
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[10px]">
                {Array.from({ length: Math.ceil(questions.length / 25) }, (_, rIdx) => {
                  const start = rIdx * 25;
                  const end = Math.min((rIdx + 1) * 25, questions.length);
                  const isCurrentRange = currentIndex >= start && currentIndex < end;
                  return (
                    <button
                      key={rIdx}
                      type="button"
                      onClick={() => goToQuestion(start)}
                      className={`px-2 py-0.5 rounded-lg font-black border transition-all cursor-pointer whitespace-nowrap ${
                        isCurrentRange
                          ? 'bg-[#544bec] text-white border-[#544bec] shadow-xs'
                          : 'bg-[#F8FAFD] text-[#6B778C] border-[#EDF1F7] hover:bg-slate-100'
                      }`}
                    >
                      Q {start + 1}-{end}
                    </button>
                  );
                })}
              </div>
            )}

            <div className="grid grid-cols-5 gap-2 max-h-60 sm:max-h-68 overflow-y-auto p-1.5 pr-2 rounded-xl bg-[#F8FAFD]/60 border border-[#EDF1F7]/80">
              {questions.map((q: any, idx: number) => {
                const isCurrent = idx === currentIndex;
                const isAnswered = Boolean(answers[q.id]);
                const isReview = markedForReview.has(q.id);
                const isSeen = visited.has(q.id);

                let bgClass = 'bg-white text-[#6B778C] border-[#EDF1F7] hover:border-slate-300 hover:bg-slate-50';
                if (isAnswered && isReview) {
                  bgClass = 'bg-purple-600 text-white border-purple-600 shadow-xs';
                } else if (isAnswered) {
                  bgClass = 'bg-emerald-600 text-white border-emerald-600 shadow-xs';
                } else if (isReview) {
                  bgClass = 'bg-amber-500 text-white border-amber-500 shadow-xs';
                } else if (isSeen) {
                  bgClass = 'bg-rose-50 text-rose-600 border-rose-200';
                }

                return (
                  <button
                    key={q.id || idx}
                    type="button"
                    onClick={() => goToQuestion(idx)}
                    className={`h-9 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center ${bgClass} ${
                      isCurrent
                        ? 'border-2 border-[#544bec] ring-2 ring-[#544bec]/30 font-black shadow-xs z-10'
                        : 'border'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Submit Block */}
          <div className="pt-3 border-t border-[#EDF1F7] space-y-2">
            <button
              type="button"
              onClick={() => setIsSubmitModalOpen(true)}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white text-xs font-black shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Send size={13} />
              <span>Finish & Submit Test</span>
            </button>
            <p className="text-[10px] text-center text-[#8F9BB3] m-0">
              Exam will automatically submit when timer ends.
            </p>
          </div>
        </aside>
      </div>

      {/* ======================================================== */}
      {/* CONFIRMATION SUBMIT MODAL                                */}
      {/* ======================================================== */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#EDF1F7] shadow-2xl max-w-md w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="text-center space-y-1.5">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 size={26} />
              </div>
              <h3 className="text-base font-black text-[#192038] m-0">
                Submit Your Examination?
              </h3>
              <p className="text-xs text-[#8F9BB3] m-0">
                Are you sure you want to finish? Here is your quick exam summary:
              </p>
            </div>

            {/* Quick Status Box */}
            <div className="grid grid-cols-3 gap-2.5 p-3.5 rounded-2xl bg-[#F8FAFD] border border-[#EDF1F7] text-center">
              <div>
                <span className="text-[10px] text-[#8F9BB3] block font-bold">Answered</span>
                <strong className="text-sm font-black text-emerald-600">{answeredCount}</strong>
              </div>
              <div>
                <span className="text-[10px] text-[#8F9BB3] block font-bold">In Review</span>
                <strong className="text-sm font-black text-amber-600">{reviewCount}</strong>
              </div>
              <div>
                <span className="text-[10px] text-[#8F9BB3] block font-bold">Skipped</span>
                <strong className="text-sm font-black text-rose-500">{unattemptedCount}</strong>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsSubmitModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-[#EDF1F7] text-xs font-bold text-[#6B778C] hover:bg-slate-50 cursor-pointer"
              >
                Resume Test
              </button>

              <button
                type="button"
                onClick={submitTestAnswers}
                disabled={submitting}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-md shadow-emerald-600/20 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                {submitting ? 'Submitting...' : 'Yes, Submit Test'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
