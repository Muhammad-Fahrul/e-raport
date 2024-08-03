import bcrypt from 'bcryptjs';
import User from '../models/userModel.js';
import asyncHandler from 'express-async-handler';
import UserValidator from '../validator/user/index.js';
import Record from '../models/recordModel.js';
import fs from 'fs';
import csv from 'csv-parser';

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
    mentorId: req.user.id,
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

const createNewStudents = asyncHandler(async (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const users = [];
  fs.createReadStream(file.path)
    .pipe(csv())
    .on('data', (row) => {
      users.push(row);
    })
    .on('end', async () => {
      try {
        const hashedUsers = await Promise.all(
          users.map(async (user) => {
            const { username, password } = user;

            let existingUser = await User.findOne({ username }).lean().exec();
            if (existingUser) {
              return null; // Skip if user already exists
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            return {
              username,
              password: hashedPassword,
              role: 'student',
              mentorId: req.user.id,
            };
          })
        );

        const validUsers = hashedUsers.filter((user) => user !== null);

        await User.insertMany(validUsers);

        fs.unlinkSync(file.path);
        res.status(201).json({ message: 'Users added successfully' });
      } catch (err) {
        fs.unlinkSync(file.path);
        res.status(500).json({ message: 'Failed to process file' });
      }
    });
});

export {
  createNewStudent,
  getStudentsByMentorId,
  deleteStudentById,
  createNewStudents,
};
