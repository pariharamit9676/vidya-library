import { UserModel } from '../models/User.js';
import { StudentModel } from '../models/Student.js';

export class AuthController {
  static async login(req, res, next) {
    try {
      const { email, identifier, phone, username, password, role } = req.body;
      const loginId = identifier || email || phone || username;

      if (!loginId || !password) {
        return res.status(400).json({
          success: false,
          message: 'Phone/Roll ID/Email and password are required.'
        });
      }

      // 1. Explicit Student Login
      if (role === 'student') {
        const student = await StudentModel.authenticate(loginId, password);
        if (!student) {
          return res.status(401).json({
            success: false,
            message: 'Invalid Student ID/Phone or password. Please verify your credentials.'
          });
        }
        const token = `vidya_student_jwt_${Buffer.from(student.studentId || student.phone || 'student').toString('base64')}_${Date.now()}`;
        return res.status(200).json({
          success: true,
          message: 'Student login successful.',
          data: {
            token,
            user: { ...student, role: 'student' }
          }
        });
      }

      // 2. Explicit Admin Login
      if (role === 'admin') {
        const user = await UserModel.authenticate(loginId, password);
        if (!user) {
          return res.status(401).json({
            success: false,
            message: 'Invalid Admin credentials. Please verify your phone/email and password.'
          });
        }
        const token = `vidya_jwt_${Buffer.from(user.email || 'admin').toString('base64')}_${Date.now()}`;
        return res.status(200).json({
          success: true,
          message: 'Admin login successful.',
          data: {
            token,
            user: { ...user, role: user.role || 'SUPER_ADMIN' }
          }
        });
      }

      // 3. Auto-detect: Try Admin first, then Student
      const adminUser = await UserModel.authenticate(loginId, password);
      if (adminUser) {
        const token = `vidya_jwt_${Buffer.from(adminUser.email || 'admin').toString('base64')}_${Date.now()}`;
        return res.status(200).json({
          success: true,
          message: 'Login successful.',
          data: {
            token,
            user: { ...adminUser, role: adminUser.role || 'SUPER_ADMIN' }
          }
        });
      }

      const student = await StudentModel.authenticate(loginId, password);
      if (student) {
        const token = `vidya_student_jwt_${Buffer.from(student.studentId || student.phone || 'student').toString('base64')}_${Date.now()}`;
        return res.status(200).json({
          success: true,
          message: 'Student login successful.',
          data: {
            token,
            user: { ...student, role: 'student' }
          }
        });
      }

      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please verify your details.'
      });
    } catch (err) {
      next(err);
    }
  }

  static async getProfile(req, res, next) {
    try {
      const user = await UserModel.getAdmin();
      const { password: _, ...safe } = user;
      return res.status(200).json({
        success: true,
        data: safe
      });
    } catch (err) {
      next(err);
    }
  }
}
