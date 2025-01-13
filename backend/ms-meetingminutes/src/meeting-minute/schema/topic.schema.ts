import * as mongoose from 'mongoose';

export const TopicSchema = new mongoose.Schema({
  proposed: { type: String, required: false },
  description: { type: String, required: false },
  accepted: { type: String, required: false },
  inMeetingMinute: { type: Boolean, required: false },
  elements: [{ type: mongoose.Schema.Types.ObjectId, ref: 'elements' }],
  comissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'comission' }],
});
TopicSchema.index({ id: 1 }, { unique: false });