import mongoose from 'mongoose';

const QuestionOptionSchema = new mongoose.Schema({
  id: { type: String, required: true }, // 'A', 'B', 'C', 'D'
  text: { type: String, required: true }
}, { _id: false });

const TestQuestionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  question: { type: String, required: true },
  options: [QuestionOptionSchema],
  correctAnswer: { type: String, required: true }, // 'A', 'B', 'C', 'D'
  explanation: { type: String, default: '' },
  subject: { type: String, default: 'General' },
  difficulty: { type: String, default: 'Medium' }
}, { _id: false });

export const MockTestSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  exam: { type: String, required: true, default: 'SSC' }, // 'SSC', 'Railways', 'MP Police', 'Banking', 'UPSC', 'General'
  subject: { type: String, default: 'General Studies' },
  topic: { type: String, default: 'General' },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
  language: { type: String, enum: ['Hindi', 'English', 'Bilingual'], default: 'Hindi' },
  durationMinutes: { type: Number, required: true, default: 20 },
  totalMarks: { type: Number, required: true, default: 40 },
  marksPerQuestion: { type: Number, default: 2 },
  negativeMarks: { type: Number, default: 0.5 },
  questionsCount: { type: Number, default: 0 },
  questions: [TestQuestionSchema],
  createdBy: { type: String, default: 'AI System' },
  createdById: { type: String, default: null },
  isAiGenerated: { type: Boolean, default: false },
  isPublished: { type: Boolean, default: true },
  attemptsCount: { type: Number, default: 0 }
}, {
  timestamps: true
});

export const MockTestMongo = mongoose.models.MockTest || mongoose.model('MockTest', MockTestSchema);
