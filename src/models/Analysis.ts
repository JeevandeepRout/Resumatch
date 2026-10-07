import mongoose, { Schema, Document } from 'mongoose';

export interface IAnalysis extends Document {
  userId: mongoose.Types.ObjectId;
  resumeId: mongoose.Types.ObjectId;
  overallScore: number;
  skillsScore: number;
  experienceScore: number;
  projectsScore: number;
  keywordsScore: number;
  strengths: string[];
  weaknesses: string[];
  missingSkills: string[];
  suggestions: string[];
  createdAt: Date;
  updatedAt: Date;
}

const AnalysisSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    resumeId: { type: Schema.Types.ObjectId, ref: 'Resume', required: true, index: true, unique: true }, // one analysis per resume
    overallScore: { type: Number, required: true },
    skillsScore: { type: Number, required: true },
    experienceScore: { type: Number, required: true },
    projectsScore: { type: Number, required: true },
    keywordsScore: { type: Number, required: true },
    strengths: [{ type: String }],
    weaknesses: [{ type: String }],
    missingSkills: [{ type: String }],
    suggestions: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.models.Analysis || mongoose.model<IAnalysis>('Analysis', AnalysisSchema);
