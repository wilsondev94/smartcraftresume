import ResumeEditor from "@/components/editor/ResumeEditor"
import { Metadata } from "next"

export const metadata:Metadata = {    title: 'Create your resumes',  }

export default function page() {
  return (
   <ResumeEditor/>
  )
}
