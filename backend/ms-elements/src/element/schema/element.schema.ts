import * as mongoose from 'mongoose';

export const elementSchema = new mongoose.Schema(
  {
    description: { type: String, required: true },
    type: { type: String, required: false },
    participants: [{ type: String, required: false }],
    topic: { type: Number, required: false },
    meeting: { type: String, required: false },
    project: { type: String, required: false },
    meetingMinute: { type: String, required: false },
    state: { type: String, required: false },
    number: { type: Number, required: false },
    dateLimit: { type: String, required: false },
    timeLimit: { type: String, required: false },
    position: { type: String, required: false },
    isSort: { type: String, required: false },
    createdBy: { type: String, required: false },
    editedBy: [{ type: String, required: false }],
    sentiment: { type: String, required: false },
    emotion: { type: String, required: false },
    disagreement: {
      firtPosition: {
        responsible: { type: String, required: false },
        description: { type: String, required: false },
      },
      secondPosition: {
        responsible: { type: String, required: false },
        description: { type: String, required: false },
      },
    },
    vote: {
      type: { type: String, required: false },
      options: [
          {
          option: {type: String, required: false},
          votes: {type: Number, required: false},
        },
      ],
      voters: [
        {
          voter: { type: String, required: false },
          option: { type: String, required: false },
        },
      ],
      result: { type: String, required: false },
      open: {type: Boolean, required: false},
    },
  },
  {
    timestamps: true,
  },
);
