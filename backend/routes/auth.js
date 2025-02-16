import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Faculty from '../models/Faculty.js';
import FacultyRequest from '../models/FacultyRequest.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';
import { sendFacultyApprovalEmail } from '../utils/email.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { email, password, full_name, role, department, designation } = req.body;

    const user = await User.create({
      email,
      password_hash: password,
      full_name,
      role,
      is_active: role !== 'faculty'
    });

    if (role === 'faculty') {
      await FacultyRequest.create({
        user_id: user.user_id,
        department,
        designation
      });

      await sendFacultyApprovalEmail(email, 'pending', full_name);
    }

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user || !(await user.validatePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.is_active) {
      return res.status(403).json({ message: 'Account pending approval' });
    }

    const token = jwt.sign(
      { user_id: user.user_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, user: { 
      id: user.user_id,
      email: user.email,
      role: user.role,
      full_name: user.full_name
    }});
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/faculty-requests', 
  authenticateToken, 
  authorizeRole('admin'), 
  async (req, res) => {
    try {
      const requests = await FacultyRequest.findAll({
        where: { status: 'pending' },
        include: [{ model: User, as: 'user' }]
      });
      res.json(requests);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
});

router.post('/approve-faculty/:requestId',
  authenticateToken,
  authorizeRole('admin'),
  async (req, res) => {
    try {
      const request = await FacultyRequest.findByPk(req.params.requestId, {
        include: [{ model: User, as: 'user' }]
      });

      if (!request) {
        return res.status(404).json({ message: 'Request not found' });
      }

      await request.update({
        status: 'approved',
        approved_by: req.user.user_id,
        approved_at: new Date()
      });

      await Faculty.create({
        user_id: request.user_id,
        department: request.department,
        designation: request.designation,
        is_verified: true
      });

      await User.update(
        { is_active: true },
        { where: { user_id: request.user_id }}
      );

      await sendFacultyApprovalEmail(
        request.user.email,
        'approved',
        request.user.full_name
      );

      res.json({ message: 'Faculty approved successfully' });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
});

export default router;