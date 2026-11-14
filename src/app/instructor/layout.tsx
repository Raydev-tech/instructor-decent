
import InstructorShell from "@/src/components/instructor/InstructorShell";

export default function InstructorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <InstructorShell>{children}</InstructorShell>;
}
