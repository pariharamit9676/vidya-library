import mongoose from 'mongoose';

export const MockTestAttemptSchema = new mongoose.Schema({
  testId: { type: String, required: true },
  testTitle: { type: String, required: true },
  exam: { type: String, default: 'General' },
  studentId: { type: String, required: true },
  studentName: { type: String, default: 'Student' },
  studentRollNo: { type: String, default: '-' },
  score: { type: Number, required: true, default: 0 },
  totalMarks: { type: Number, required: true, default: 0 },
  percentage: { type: Number, default: 0 },
  totalQuestions: { type: Number, default: 0 },
  correctCount: { type: Number, default: 0 },
  wrongCount: { type: Number, default: 0 },
  unattemptedCount: { type: Number, default: 0 },
  accuracy: { type: Number, default: 0 },
  timeSpentSeconds: { type: Number, default: 0 },
  answers: { type: Map, of: String, default: {} }, // questionId -> selectedOption ('A'|'B'|'C'|'D')
  submittedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

export const MockTestAttemptMongo = mongoose.models.MockTestAttempt || mongoose.model('MockTestAttempt', MockTestAttemptSchema);
