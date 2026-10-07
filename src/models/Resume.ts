import mongoose, { Schema, Document } from 'mongoose';

export interface IResume extends Document {
  userId: mongoose.Types.ObjectId;
  fileName: string;
  fileType: string;
  extractedText: string;
  createdAt: Date;
  updatedAt: Date;
}

const ResumeSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    fileName: { type: String, required: true },
    fileType: { type: String, required: true },
    extractedText: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Resume || mongoose.model<IResume>('Resume', ResumeSchema);
