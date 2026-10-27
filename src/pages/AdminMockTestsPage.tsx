import React, { useState, useEffect } from 'react';
import { mockTestService } from '../services/api';
import { useLibrary } from '../context/LibraryContext';
import { formatDisplayDate } from '../utils/dateFormatter';
import {
  BookOpen,
  Sparkles,
  Trash2,
  Play,
  Search,
  Filter,
  Users,
  Award,
  Clock,
  Plus,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AdminMockTestsPage: React.FC = () => {
  const { showToast, showConfirm } = useLibrary();
  const navigate = useNavigate();

  const [tests, setTests] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedExam, setSelectedExam] = useState<string>('All');

  // Generator Modal
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [generating, setGenerating] = useState<boolean>(false);
  const [formExam, setFormExam] = useState<string>('SSC');
  const [formSubject, setFormSubject] = useState<string>('Indian Polity');
  const [formTopic, setFormTopic] = useState<string>('Fundamental Rights & Articles');
  const [formDifficulty, setFormDifficulty] = useState<string>('Medium');
  const [formCount, setFormCount] = useState<number>(10);
  const [formLanguage, setFormLanguage] = useState<string>('Hindi');

  const fetchTests = async () => {
    try {
      setLoading(true);
      const res = await mockTestService.getAll({ exam: selectedExam });
      if (res.success && Array.isArray(res.data)) {
        setTests(res.data);
      }
    } catch (err: any) {
      showToast('Error loading mock tests', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTests();
  }, [selectedExam]);

  // Handle Delete Test
  const handleDeleteTest = async (testId: string, title: string) => {
    const confirmed = window.confirm(`Are you sure you want to delete test "${title}"?`);
    if (!confirmed) return;

    try {
      const res = await mockTestService.deleteTest(testId);
      if (res.success) {
        showToast('Test deleted successfully', 'success');
        setTests((prev) => prev.filter((t) => (t.id || t._id) !== testId));
      } else {
        showToast(res.message || 'Failed to delete test', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Error deleting test', 'error');
    }
  };

  // Handle Generate Test by Admin
  const handleAdminGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTopic.trim()) {
      showToast('Topic is required', 'warning');
      return;
    }

    try {
      setGenerating(true);
      const res = await mockTestService.generateTest({
        exam: formExam,
        subject: formSubject,
        topic: formTopic.trim(),
        difficulty: formDifficulty,
        count: formCount,
        language: formLanguage,
        studentName: 'Admin',
        studentId: 'ADMIN'
      });

      if (res.success) {
        showToast('New test generated & published successfully!', 'success');
        setIsModalOpen(false);
        fetchTests();
      } else {
        showToast(res.message || 'Failed to generate test', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to generate test', 'error');
    } finally {
      setGenerating(false);
    }
  };

  const filteredTests = tests.filter((t: any) => {
    if (selectedExam !== 'All' && t.exam !== selectedExam) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        t.title?.toLowerCase().includes(q) ||
        t.subject?.toLowerCase().includes(q) ||
        t.topic?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl border border-[#EDF1F7] p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#EEF0FD] text-[#544bec] flex items-center justify-center">
              <BookOpen size={20} />
            </div>
            <div>
              <h1 className="text-xl font-black text-[#192038] tracking-tight m-0">
                Mock Tests & Examination Hub
              </h1>
              <p className="text-xs text-[#8F9BB3] m-0">
                Manage competitive exam mock test papers, question banks, and AI tests
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-[#544bec] hover:bg-[#4338ca] text-white text-xs font-black shadow-md shadow-[#544bec]/20 transition-all cursor-pointer active:scale-95"
        >
          <Sparkles size={15} />
          <span>Generate New Test with AI</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 scrollbar-none">
          {['All', 'SSC', 'MP Police', 'Railways', 'Banking'].map((exam) => (
            <button
              key={exam}
              onClick={() => setSelectedExam(exam)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedExam === exam
                  ? 'bg-[#192038] text-white shadow-xs'
                  : 'bg-white border border-[#EDF1F7] text-[#6B778C] hover:bg-slate-50'
              }`}
            >
              {exam}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8F9BB3]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search test by name or topic..."
            className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-white border border-[#EDF1F7] text-xs font-medium text-[#192038] placeholder:text-[#8F9BB3] focus:outline-none focus:border-[#544bec]"
          />
        </div>
      </div>

      {/* Tests Table */}
      <div className="bg-white rounded-3xl border border-[#EDF1F7] shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs font-bold text-slate-400">Loading tests...</div>
        ) : filteredTests.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#EDF1F7] text-[#8F9BB3] bg-[#F8FAFD]">
                  <th className="py-3.5 px-4 font-bold">Exam & Title</th>
                  <th className="py-3.5 px-4 font-bold">Subject / Topic</th>
                  <th className="py-3.5 px-4 font-bold">Questions</th>
                  <th className="py-3.5 px-4 font-bold">Duration</th>
                  <th className="py-3.5 px-4 font-bold">Total Marks</th>
                  <th className="py-3.5 px-4 font-bold">Attempts</th>
                  <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EDF1F7]">
                {filteredTests.map((test: any) => {
                  const testId = test.id || test._id;
                  return (
                    <tr key={testId} className="hover:bg-[#F8FAFD] transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-[#EEF0FD] text-[#544bec] inline-block mb-1">
                            {test.exam}
                          </span>
                          <strong className="text-xs font-black text-[#192038] block line-clamp-1">
                            {test.title}
                          </strong>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-[#6B778C]">
                        <span>{test.subject || 'General'}</span>
                        {test.topic && <span className="block text-[11px] text-[#8F9BB3]">{test.topic}</span>}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-[#192038]">
                        {test.questionsCount || 0}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-medium text-[#6B778C]">
                        {test.durationMinutes} mins
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-[#544bec]">
                        {test.totalMarks}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-emerald-700">
                        {test.attemptsCount || 0} students
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleDeleteTest(testId, test.title)}
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition-colors cursor-pointer"
                            title="Delete Test"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center space-y-2">
            <p className="text-sm font-bold text-[#192038] m-0">No mock tests found.</p>
            <p className="text-xs text-[#8F9BB3] m-0">Click above to generate your first test with AI!</p>
          </div>
        )}
      </div>

      {/* Admin Test Generator Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#EDF1F7] shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-gradient-to-r from-[#192038] to-[#253256] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Sparkles size={18} className="text-amber-300" />
                <h3 className="text-sm font-black m-0">Generate Practice Test with AI</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAdminGenerate} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#192038] mb-1">Target Exam</label>
                <select
                  value={formExam}
                  onChange={(e) => setFormExam(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#EDF1F7] text-xs font-bold text-[#192038]"
                >
                  <option value="SSC">SSC (CGL, CHSL, GD)</option>
                  <option value="MP Police">MP Police Constable & SI</option>
                  <option value="Railways">Railways (RRB NTPC, Group D)</option>
                  <option value="Banking">Banking (IBPS, SBI)</option>
                  <option value="General Studies">General Knowledge Quiz</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#192038] mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={formSubject}
                  onChange={(e) => setFormSubject(e.target.value)}
                  placeholder="e.g. Indian Polity, History, Reasoning"
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#EDF1F7] text-xs font-medium text-[#192038]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#192038] mb-1">Topic</label>
                <input
                  type="text"
                  required
                  value={formTopic}
                  onChange={(e) => setFormTopic(e.target.value)}
                  placeholder="e.g. Fundamental Rights, Mughal Era, Coding-Decoding"
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#EDF1F7] text-xs font-medium text-[#192038]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#192038] mb-1">Questions</label>
                  <select
                    value={formCount}
                    onChange={(e) => setFormCount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#EDF1F7] text-xs font-bold"
                  >
                    <option value={10}>10 Questions</option>
                    <option value={25}>25 Questions (Section)</option>
                    <option value={50}>50 Questions (Half Mock)</option>
                    <option value={100}>🔥 100 Questions (Full Mock)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#192038] mb-1">Difficulty</label>
                  <select
                    value={formDifficulty}
                    onChange={(e) => setFormDifficulty(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#EDF1F7] text-xs font-bold"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard (TCS Level)</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-[#EDF1F7] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-50 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={generating}
                  className="px-5 py-2 bg-[#544bec] hover:bg-[#4338ca] text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  {generating ? 'Generating...' : 'Generate Test'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
