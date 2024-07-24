import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
  },
  role: {
    type: String,
  },
  mentorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  urlImgProfile: {
    type: String,
    default: null,
  },
  raportIdsStudent: [
    {
      raportId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Raport',
      },
      raportName: {
        type: String,
      },
    },
  ],
  collaborators: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      username: {
        type: String,
        required: true,
      },
    },
  ],
});

UserSchema.pre('save', async function (next) {
  if (this.isNew) {
    if (this.role !== 'student') {
      this.mentorId = undefined;
      this.raportIdsStudent = undefined;
    }
    const studentCount = await mongoose.models.User.countDocuments({
      mentorId: this.mentorId,
    });
    if (studentCount >= 40) {
      const err = new Error(
        'Batas jumlah item dalam koleksi Student telah tercapai'
      );
      next(err);
    } else {
      next();
    }
  } else {
    if (this.role !== 'student') {
      this.mentorId = undefined;
      this.raportIdsStudent = undefined;
    }
  }
});

const User = mongoose.model('User', UserSchema);

export default User;
