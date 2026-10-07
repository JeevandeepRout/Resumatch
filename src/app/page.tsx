import { UploadResume } from "@/components/UploadResume"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12 max-w-2xl">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-4">
          Optimize Your Resume with AI
        </h1>
        <p className="text-lg text-muted-foreground">
          Get actionable feedback, identify missing skills, and match your resume to specific job descriptions in seconds.
        </p>
      </div>

      <UploadResume />
    </div>
  )
}
