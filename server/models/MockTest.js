import mongoose from 'mongoose';
import { readJsonFile, writeJsonFile } from '../utils/fileStorage.js';
import { isMongoConnected } from '../config/database.js';
import { MockTestMongo } from './schemas/MockTestSchema.js';
import { MockTestAttemptMongo } from './schemas/MockTestAttemptSchema.js';

const MOCK_TESTS_FILE = 'mock_tests.json';
const MOCK_ATTEMPTS_FILE = 'mock_test_attempts.json';

export class MockTestModel {
  /**
   * Get all published mock tests (summaries or full)
   */
  static async getAll(filter = {}) {
    if (isMongoConnected()) {
      try {
        const query = { isPublished: true };
        if (filter.exam && filter.exam !== 'All') {
          query.exam = filter.exam;
        }
        if (filter.subject && filter.subject !== 'All') {
          query.subject = filter.subject;
        }
        const list = await MockTestMongo.find(query).sort({ createdAt: -1 }).lean();
        return list.map(item => ({
          ...item,
          id: String(item._id)
        }));
      } catch (err) {
        console.error('Mongo MockTest.getAll error:', err.message);
      }
    }

    const localList = readJsonFile(MOCK_TESTS_FILE, []);
    return localList.filter(item => {
      if (item.isPublished === false) return false;
      if (filter.exam && filter.exam !== 'All' && item.exam !== filter.exam) return false;
      if (filter.subject && filter.subject !== 'All' && item.subject !== filter.subject) return false;
      return true;
    });
  }

  /**
   * Get single test by ID
   */
  static async getById(id) {
    if (isMongoConnected()) {
      try {
        if (mongoose.Types.ObjectId.isValid(id)) {
          const doc = await MockTestMongo.findById(id).lean();
          if (doc) {
            return { ...doc, id: String(doc._id) };
          }
        }
      } catch (err) {
        console.error('Mongo MockTest.getById error:', err.message);
      }
    }

    const localList = readJsonFile(MOCK_TESTS_FILE, []);
    return localList.find(t => String(t.id) === String(id) || String(t._id) === String(id)) || null;
  }

  /**
   * Fetch recent question strings to prevent duplicates in newly generated tests
   */
  static async getRecentQuestions({ exam, subject, topic, limit = 40 } = {}) {
    const questionSnippets = new Set();

    // 1. Fetch from Mongo if connected
    if (isMongoConnected()) {
      try {
        const query = {};
        if (subject && subject !== 'All') {
          query.subject = subject;
        }
        const recentTests = await MockTestMongo.find(query)
          .sort({ createdAt: -1 })
          .limit(10)
          .select('questions')
          .lean();

        for (const test of recentTests) {
          if (Array.isArray(test.questions)) {
            for (const q of test.questions) {
              if (q?.question && typeof q.question === 'string') {
                questionSnippets.add(q.question.trim());
                if (questionSnippets.size >= limit) break;
              }
            }
          }
          if (questionSnippets.size >= limit) break;
        }
      } catch (err) {
        console.error('Mongo MockTest.getRecentQuestions error:', err.message);
      }
    }

    // 2. Also fetch from local JSON file
    if (questionSnippets.size < limit) {
      const localList = readJsonFile(MOCK_TESTS_FILE, []);
      for (const test of localList) {
        if (subject && subject !== 'All' && test.subject !== subject) continue;
        if (Array.isArray(test.questions)) {
          for (const q of test.questions) {
            if (q?.question && typeof q.question === 'string') {
              questionSnippets.add(q.question.trim());
              if (questionSnippets.size >= limit) break;
            }
          }
        }
        if (questionSnippets.size >= limit) break;
      }
    }

    return Array.from(questionSnippets);
  }

  /**
   * Create a new mock test
   */
  static async create(data) {
    const questions = Array.isArray(data.questions) ? data.questions : [];
    const questionsCount = questions.length;
    const marksPerQuestion = Number(data.marksPerQuestion) || 2;
    const totalMarks = Number(data.totalMarks) || (questionsCount * marksPerQuestion);

    const newTest = {
      title: String(data.title || 'Practice Mock Test').trim(),
      description: String(data.description || '').trim(),
      exam: String(data.exam || 'SSC').trim(),
      subject: String(data.subject || 'General Studies').trim(),
      topic: String(data.topic || 'General').trim(),
      difficulty: data.difficulty || 'Medium',
      language: data.language || 'Hindi',
      durationMinutes: Number(data.durationMinutes) || Math.max(10, Math.ceil(questionsCount * 1.2)),
      totalMarks,
      marksPerQuestion,
      negativeMarks: data.negativeMarks !== undefined ? Number(data.negativeMarks) : 0.5,
      questionsCount,
      questions,
      createdBy: String(data.createdBy || 'AI Generator').trim(),
      createdById: data.createdById ? String(data.createdById) : null,
      isAiGenerated: Boolean(data.isAiGenerated),
      isPublished: data.isPublished !== undefined ? Boolean(data.isPublished) : true,
      attemptsCount: 0
    };

    let saved = null;
    if (isMongoConnected()) {
      try {
        const doc = await MockTestMongo.create(newTest);
        saved = { ...doc.toObject(), id: String(doc._id) };
      } catch (err) {
        console.error('Mongo MockTest.create error:', err.message);
      }
    }

    if (!saved) {
      saved = {
        ...newTest,
        id: `test_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    }

    const localList = readJsonFile(MOCK_TESTS_FILE, []);
    localList.unshift(saved);
    writeJsonFile(MOCK_TESTS_FILE, localList);

    return saved;
  }

  /**
   * Increment attempt counter on test
   */
  static async incrementAttempts(testId) {
    if (isMongoConnected()) {
      try {
        if (mongoose.Types.ObjectId.isValid(testId)) {
          await MockTestMongo.findByIdAndUpdate(testId, { $inc: { attemptsCount: 1 } });
        }
      } catch (err) {
        console.error('Mongo MockTest.incrementAttempts error:', err.message);
      }
    }

    const localList = readJsonFile(MOCK_TESTS_FILE, []);
    const idx = localList.findIndex(t => String(t.id) === String(testId) || String(t._id) === String(testId));
    if (idx !== -1) {
      localList[idx].attemptsCount = (localList[idx].attemptsCount || 0) + 1;
      writeJsonFile(MOCK_TESTS_FILE, localList);
    }
  }

  /**
   * Delete a test
   */
  static async delete(id) {
    if (isMongoConnected()) {
      try {
        if (mongoose.Types.ObjectId.isValid(id)) {
          await MockTestMongo.findByIdAndDelete(id);
        }
      } catch (err) {
        console.error('Mongo MockTest.delete error:', err.message);
      }
    }

    const localList = readJsonFile(MOCK_TESTS_FILE, []);
    const filtered = localList.filter(t => String(t.id) !== String(id) && String(t._id) !== String(id));
    writeJsonFile(MOCK_TESTS_FILE, filtered);
    return true;
  }

  // ==========================================
  // ATTEMPT METHODS
  // ==========================================

  /**
   * Save a student's attempt
   */
  static async saveAttempt(attemptData) {
    let saved = null;
    if (isMongoConnected()) {
      try {
        const doc = await MockTestAttemptMongo.create(attemptData);
        saved = { ...doc.toObject(), id: String(doc._id) };
      } catch (err) {
        console.error('Mongo MockTestAttempt.create error:', err.message);
      }
    }

    if (!saved) {
      saved = {
        ...attemptData,
        id: `att_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        createdAt: new Date().toISOString()
      };
    }

    const attempts = readJsonFile(MOCK_ATTEMPTS_FILE, []);
    attempts.unshift(saved);
    writeJsonFile(MOCK_ATTEMPTS_FILE, attempts);

    // Increment test attempts counter
    await this.incrementAttempts(attemptData.testId);

    return saved;
  }

  /**
   * Get student's past attempts
   */
  static async getStudentAttempts(studentId) {
    if (isMongoConnected()) {
      try {
        const list = await MockTestAttemptMongo.find({ studentId: String(studentId) })
          .sort({ createdAt: -1 })
          .lean();
        return list.map(item => ({ ...item, id: String(item._id) }));
      } catch (err) {
        console.error('Mongo MockTestAttempt.getStudentAttempts error:', err.message);
      }
    }

    const attempts = readJsonFile(MOCK_ATTEMPTS_FILE, []);
    return attempts.filter(a => String(a.studentId) === String(studentId));
  }

  /**
   * Get attempt by ID
   */
  static async getAttemptById(attemptId) {
    if (isMongoConnected()) {
      try {
        if (mongoose.Types.ObjectId.isValid(attemptId)) {
          const doc = await MockTestAttemptMongo.findById(attemptId).lean();
          if (doc) {
            return { ...doc, id: String(doc._id) };
          }
        }
      } catch (err) {
        console.error('Mongo MockTestAttempt.getAttemptById error:', err.message);
      }
    }

    const attempts = readJsonFile(MOCK_ATTEMPTS_FILE, []);
    return attempts.find(a => String(a.id) === String(attemptId) || String(a._id) === String(attemptId)) || null;
  }
}
