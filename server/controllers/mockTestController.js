import { MockTestModel } from '../models/MockTest.js';
import { AiTestGeneratorService } from '../services/aiTestGenerator.js';

export const mockTestController = {
  /**
   * GET /api/mock-tests - List all available tests
   */
  async getAllTests(req, res) {
    try {
      const { exam, subject, studentId } = req.query;
      const tests = await MockTestModel.getAll({ exam, subject, studentId });
      
      // Return summaries (strip questions to keep payload small)
      const summaries = tests.map(t => ({
        id: t.id,
        _id: t.id,
        title: t.title,
        description: t.description,
        exam: t.exam,
        subject: t.subject,
        topic: t.topic,
        difficulty: t.difficulty,
        language: t.language,
        durationMinutes: t.durationMinutes,
        totalMarks: t.totalMarks,
        marksPerQuestion: t.marksPerQuestion,
        negativeMarks: t.negativeMarks,
        questionsCount: t.questionsCount || (t.questions ? t.questions.length : 0),
        createdBy: t.createdBy,
        createdById: t.createdById,
        isAiGenerated: t.isAiGenerated,
        attemptsCount: t.attemptsCount || 0,
        createdAt: t.createdAt
      }));

      return res.status(200).json({
        success: true,
        count: summaries.length,
        data: summaries
      });
    } catch (err) {
      console.error('Error fetching mock tests:', err);
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  /**
   * GET /api/mock-tests/:id - Get single test details
   */
  async getTestById(req, res) {
    try {
      const { id } = req.params;
      const { mode } = req.query; // 'test' (during exam) vs 'review'
      const test = await MockTestModel.getById(id);

      if (!test) {
        return res.status(404).json({ success: false, message: 'Mock test not found' });
      }

      // If student is actively taking the test, hide correct answers to prevent devtools cheating!
      if (mode === 'test') {
        const sanitizedQuestions = (test.questions || []).map(q => ({
          id: q.id,
          question: q.question,
          options: q.options,
          subject: q.subject,
          difficulty: q.difficulty
        }));

        return res.status(200).json({
          success: true,
          data: {
            ...test,
            questions: sanitizedQuestions
          }
        });
      }

      return res.status(200).json({
        success: true,
        data: test
      });
    } catch (err) {
      console.error('Error fetching test by id:', err);
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  /**
   * POST /api/mock-tests/generate - On-demand AI Test Generation
   */
  async generateTest(req, res) {
    try {
      const {
        exam = 'SSC',
        subject = 'General Studies',
        topic = 'General',
        difficulty = 'Medium',
        count = 10,
        language = 'Bilingual',
        studentName = 'Student',
        studentId = null
      } = req.body;

      const questionCount = Math.min(Math.max(Number(count) || 10, 5), 100);
      const hasSpecificExam = exam && !exam.includes('General') && !exam.includes('All Exams') && exam !== 'Other';
      const examPrefix = hasSpecificExam ? `[${exam}] ` : '';
      const testTitle = questionCount >= 100
        ? `${examPrefix}Full Mock Paper: 100 Questions (${topic || subject})`
        : questionCount >= 50
        ? `${examPrefix}Practice Test: ${questionCount} Questions (${topic || subject})`
        : `${topic || subject} Practice Test (${subject})`;

      // 1. Fetch recent questions from DB to ensure brand-new, never-repeated questions
      const recentQuestions = await MockTestModel.getRecentQuestions({
        exam,
        subject,
        topic,
        limit: Math.min(questionCount * 2, 25)
      });

      // 2. Generate brand-new, unique questions via AI with anti-repetition filter
      const questions = await AiTestGeneratorService.generateQuestions({
        exam,
        subject,
        topic,
        difficulty,
        count: questionCount,
        language,
        excludeQuestions: recentQuestions
      });

      if (!questions || questions.length === 0) {
        return res.status(500).json({
          success: false,
          message: `Unable to compile practice questions for "${topic || subject}". Please try again.`
        });
      }

      const marksPerQuestion = 2;
      const negativeMarks = 0.5;
      const totalMarks = questions.length * marksPerQuestion;
      // Standard competitive exam timings: 100 Qs = 90 mins (or 120), 50 Qs = 45-60 mins
      const durationMinutes = questionCount >= 100
        ? 90
        : questionCount >= 50
        ? 60
        : Math.max(10, Math.ceil(questions.length * 1.2));

      // 2. Save test into Database
      const newTest = await MockTestModel.create({
        title: testTitle,
        description: `Custom ${difficulty}-level ${questionCount >= 100 ? 'Full-Length' : ''} practice test generated for ${exam} (${subject}). Focus: ${topic}.`,
        exam,
        subject,
        topic,
        difficulty,
        language,
        durationMinutes,
        totalMarks,
        marksPerQuestion,
        negativeMarks,
        questionsCount: questions.length,
        questions,
        createdBy: studentName ? `${studentName} (AI Generated)` : 'Student AI',
        createdById: studentId,
        isAiGenerated: true,
        isPublished: true
      });

      return res.status(201).json({
        success: true,
        message: 'Your custom test has been successfully generated & saved to library!',
        data: newTest
      });
    } catch (err) {
      console.error('Error generating AI test:', err);
      return res.status(500).json({ success: false, message: err.message || 'Failed to generate test' });
    }
  },

  /**
   * POST /api/mock-tests/:id/submit - Submit test attempt & grade answers
   */
  async submitAttempt(req, res) {
    try {
      const { id } = req.params;
      const {
        studentId,
        studentName,
        studentRollNo,
        answers = {}, // { "q1": "A", "q2": "C" }
        timeSpentSeconds = 0
      } = req.body;

      if (!studentId) {
        return res.status(400).json({ success: false, message: 'Student ID is required' });
      }

      const test = await MockTestModel.getById(id);
      if (!test) {
        return res.status(404).json({ success: false, message: 'Test not found' });
      }

      const questions = test.questions || [];
      const marksPerQ = Number(test.marksPerQuestion) || 2;
      const negativePerQ = Number(test.negativeMarks) || 0.5;

      let correctCount = 0;
      let wrongCount = 0;
      let unattemptedCount = 0;

      const detailedBreakdown = questions.map(q => {
        const studentSelected = answers[q.id] || null;
        const isAttempted = Boolean(studentSelected);
        const isCorrect = isAttempted && studentSelected === q.correctAnswer;
        const isWrong = isAttempted && !isCorrect;

        if (isCorrect) correctCount++;
        else if (isWrong) wrongCount++;
        else unattemptedCount++;

        return {
          questionId: q.id,
          questionText: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer,
          studentAnswer: studentSelected,
          isCorrect,
          isAttempted,
          explanation: q.explanation,
          marksAwarded: isCorrect ? marksPerQ : (isWrong ? -negativePerQ : 0)
        };
      });

      const rawScore = (correctCount * marksPerQ) - (wrongCount * negativePerQ);
      const finalScore = Math.max(0, Math.round(rawScore * 100) / 100);
      const totalMarks = test.totalMarks || (questions.length * marksPerQ);
      const percentage = totalMarks > 0 ? Math.round((finalScore / totalMarks) * 100) : 0;
      const attemptedCount = correctCount + wrongCount;
      const accuracy = attemptedCount > 0 ? Math.round((correctCount / attemptedCount) * 100) : 0;

      const attemptRecord = {
        testId: String(test.id || test._id),
        testTitle: test.title,
        exam: test.exam || 'General',
        studentId: String(studentId),
        studentName: studentName || 'Student',
        studentRollNo: studentRollNo || '-',
        score: finalScore,
        totalMarks,
        percentage,
        totalQuestions: questions.length,
        correctCount,
        wrongCount,
        unattemptedCount,
        accuracy,
        timeSpentSeconds: Number(timeSpentSeconds) || 0,
        answers,
        submittedAt: new Date()
      };

      const savedAttempt = await MockTestModel.saveAttempt(attemptRecord);

      return res.status(200).json({
        success: true,
        message: 'Test submitted and graded successfully!',
        data: {
          attempt: savedAttempt,
          testTitle: test.title,
          exam: test.exam,
          subject: test.subject,
          score: finalScore,
          totalMarks,
          percentage,
          accuracy,
          correctCount,
          wrongCount,
          unattemptedCount,
          timeSpentSeconds,
          breakdown: detailedBreakdown
        }
      });
    } catch (err) {
      console.error('Error submitting test attempt:', err);
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  /**
   * GET /api/mock-tests/attempts/my - Get student's past attempts
   */
  async getMyAttempts(req, res) {
    try {
      const { studentId } = req.query;
      if (!studentId) {
        return res.status(400).json({ success: false, message: 'Student ID query parameter required' });
      }

      const attempts = await MockTestModel.getStudentAttempts(studentId);
      return res.status(200).json({
        success: true,
        count: attempts.length,
        data: attempts
      });
    } catch (err) {
      console.error('Error fetching student attempts:', err);
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  /**
   * GET /api/mock-tests/attempts/:attemptId - Get single attempt scorecard & review
   */
  async getAttemptDetails(req, res) {
    try {
      const { attemptId } = req.params;
      const attempt = await MockTestModel.getAttemptById(attemptId);

      if (!attempt) {
        return res.status(404).json({ success: false, message: 'Attempt not found' });
      }

      const test = await MockTestModel.getById(attempt.testId);
      const questions = test?.questions || [];

      // Combine attempt answers with original test questions & explanations
      const breakdown = questions.map(q => {
        const studentSelected = attempt.answers?.[q.id] || null;
        const isAttempted = Boolean(studentSelected);
        const isCorrect = isAttempted && studentSelected === q.correctAnswer;

        return {
          questionId: q.id,
          questionText: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer,
          studentAnswer: studentSelected,
          isCorrect,
          isAttempted,
          explanation: q.explanation
        };
      });

      return res.status(200).json({
        success: true,
        data: {
          ...attempt,
          breakdown,
          testDetails: test ? {
            title: test.title,
            exam: test.exam,
            subject: test.subject,
            topic: test.topic,
            difficulty: test.difficulty
          } : null
        }
      });
    } catch (err) {
      console.error('Error fetching attempt details:', err);
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  /**
   * DELETE /api/mock-tests/:id - Admin delete a test
   */
  async deleteTest(req, res) {
    try {
      const { id } = req.params;
      await MockTestModel.delete(id);
      return res.status(200).json({
        success: true,
        message: 'Mock test deleted successfully'
      });
    } catch (err) {
      console.error('Error deleting test:', err);
      return res.status(500).json({ success: false, message: err.message });
    }
  }
};
