import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    isFavourite: {
      type: Boolean,
      default: false,
    },
    contactType: {
      type: String,
      enum: ['personal', 'work', 'other'],
      default: 'personal',
    },
  },
  {
    timestamps: true, // автоматично додає createdAt і updatedAt
  },
);

// створюємо модель
export const Contact = mongoose.model('Contact', contactSchema);
