
import { Suspense } from "react";
import { connection } from "next/server";
import EditCourseForm from "./EditCourseForm";

type PageProps = {
  params: Promise<{ id: string }>;
};

async function EditCourseContent({ params }: PageProps) {
  await connection();

  const { id } = await params;

  return <EditCourseForm courseId={id} />;
}

export default function EditCoursePage({ params }: PageProps) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-80 items-center justify-center">
          <p className="text-sm text-slate-500">
            Loading course editor...
          </p>
        </div>
      }
    >
      <EditCourseContent params={params} />
    </Suspense>
  );
}
