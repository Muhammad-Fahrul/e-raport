import bcrypt from 'bcryptjs';
import User from '../models/userModel.js';
import asyncHandler from 'express-async-handler';
import UserValidator from '../validator/user/index.js';
import Record from '../models/recordModel.js';

const createNewStudent = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  UserValidator.validateUserPayload({ username, password });

  let student = await User.findOne({ username }).lean().exec();

  if (student) {
    return res.status(400).json({ message: 'User already exists' });
  }

  student = new User({
    username,
    password,
    role: 'student',
    mentorId: req.userId,
  });

  const salt = await bcrypt.genSalt(10);

  student.password = await bcrypt.hash(password, salt);

  await student.save();

  if (student) {
    res.status(201).json({ message: `New user ${username} created` });
  } else {
    res.status(400).json({ message: 'Invalid user data received' });
  }
});

const getStudentsByMentorId = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  // Find students directly managed by the authenticated mentor
  const managedStudents = await User.find({ mentorId: userId }).select(
    '-password'
  );

  // Find mentors who have added the authenticated mentor as a collaborator
  const mentors = await User.find({ 'collaborators.userId': userId }).select(
    '_id'
  );

  const mentorIds = mentors.map((mentor) => mentor._id);

  // Find students managed by those mentors
  const collaboratorStudents = await User.find({
    mentorId: { $in: mentorIds },
  }).select('-password');

  // Combine the lists of students
  const allStudents = [...managedStudents, ...collaboratorStudents];

  return res.json({ students: allStudents });
});

const deleteStudentById = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { username } = req.params;

  const student = await User.findOne({ username, mentorId: userId })
    .select('-password')
    .exec();

  if (!student) {
    return res.status(404).json({ message: 'student not found' });
  }

  await Record.deleteMany({ studentId: student._id });

  const result = await student.deleteOne();

  res.json({
    message: `Username ${result.username} with ID ${result._id} deleted`,
  });
});

export { createNewStudent, getStudentsByMentorId, deleteStudentById };
