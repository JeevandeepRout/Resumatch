import mongoose, { Schema, Document } from 'mongoose';

export interface IJobAnalysis extends Document {
  userId: mongoose.Types.ObjectId;
  resumeId: mongoose.Types.ObjectId;
  jobTitle: string;
  jobDescription: string;
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  recommendations: string[];
  createdAt: Date;
  updatedAt: Date;
}

const JobAnalysisSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    resumeId: { type: Schema.Types.ObjectId, ref: 'Resume', required: true, index: true },
    jobTitle: { type: String, required: true },
    jobDescription: { type: String, required: true },
    matchScore: { type: Number, required: true },
    matchedSkills: [{ type: String }],
    missingSkills: [{ type: String }],
    recommendations: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.models.JobAnalysis || mongoose.model<IJobAnalysis>('JobAnalysis', JobAnalysisSchema);
