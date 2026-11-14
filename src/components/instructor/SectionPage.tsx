"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowUpRight,
  BookOpen,
  Users,
  ChartNoAxesCombined,
  Mail,
  Settings,
  UserRound,
  Search,
  Plus,
  MoreHorizontal,
  Download,
  CalendarDays,
  Clock3,
  Star,
} from "lucide-react";

type SectionKey =
  | "courses"
  | "students"
  | "analytics"
  | "messages"
  | "settings"
  | "profile";

const sectionContent = {
  courses: {
    title: "My Courses",
    subtitle: "Create, manage and monitor your learning programmes.",
    icon: BookOpen,
    stats: [
      { label: "Total courses", value: "8", change: "Your published and draft courses" },
      { label: "Published", value: "6", change: "Available to students" },
      { label: "Draft courses", value: "2", change: "Still being prepared" },
      { label: "Total students", value: "248", change: "Across all your courses" },
    ],
  },
  students: {
    title: "My Students",
    subtitle: "View your students and follow their learning progress.",
    icon: Users,
    stats: [
      { label: "Total students", value: "248", change: "Across all your courses" },
      { label: "Active students", value: "186", change: "Currently learning" },
      { label: "New students", value: "32", change: "Joined this month" },
      { label: "Completed", value: "74", change: "Finished a course" },
    ],
  },
  analytics: {
    title: "Analytics",
    subtitle: "Understand your course performance and student engagement.",
    icon: ChartNoAxesCombined,
    stats: [
      { label: "Total students", value: "248", change: "Across all your courses" },
      { label: "Course views", value: "1,820", change: "Total course visits" },
      { label: "Completion rate", value: "76%", change: "Average completion" },
      { label: "Engagement", value: "84%", change: "Student activity" },
    ],
  },
  messages: {
    title: "Messages",
    subtitle: "Communicate with students and respond to their questions.",
    icon: Mail,
    stats: [
      { label: "All messages", value: "42", change: "Messages received" },
      { label: "Unread", value: "8", change: "Awaiting your response" },
      { label: "Students", value: "28", change: "Unique conversations" },
      { label: "Responded", value: "34", change: "Messages handled" },
    ],
  },
  settings: {
    title: "Settings",
    subtitle: "Manage your instructor account and preferences.",
    icon: Settings,
    stats: [],
  },
  profile: {
    title: "My Profile",
    subtitle: "Manage your public instructor information.",
    icon: UserRound,
    stats: [],
  },
};

const sampleCourses = [
  {
    title: "Frontend Development with HTML & CSS",
    category: "Web Development",
    students: 86,
    status: "Published",
    rating: "4.9",
  },
  {
    title: "JavaScript for Beginners",
    category: "Programming",
    students: 64,
    status: "Published",
    rating: "4.8",
  },
  {
    title: "Introduction to Blockchain",
    category: "Blockchain",
    students: 52,
    status: "Published",
    rating: "4.7",
  },
  {
    title: "Smart Contract Development with Solidity",
    category: "Web3",
    students: 46,
    status: "Draft",
    rating: "—",
  },
];

const sampleStudents = [
  { name: "Daniel Johnson", email: "daniel@example.com", course: "JavaScript for Beginners", progress: 85 },
  { name: "Mary Williams", email: "mary@example.com", course: "Frontend Development", progress: 72 },
  { name: "David Okafor", email: "david@example.com", course: "Introduction to Blockchain", progress: 60 },
  { name: "Sarah Ibrahim", email: "sarah@example.com", course: "JavaScript for Beginners", progress: 45 },
];

export default function SectionPage({ section }: { section: SectionKey }) {
  const content = sectionContent[section];
  const Icon = content.icon;
  const [search, setSearch] = useState("");

  const filteredCourses = sampleCourses.filter((course) =>
    course.title.toLowerCase().includes(search.toLowerCase())
  );

  const filteredStudents = sampleStudents.filter((student) =>
    `${student.name} ${student.email} ${student.course}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-[#F5F8FE] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-7">
        {/* Page heading */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
              <Link href="/instructor" className="hover:text-[#0A66EC]">
                Dashboard
              </Link>
              <span>/</span>
              <span className="font-medium capitalize text-slate-700">
                {content.title}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-[#0A66EC]">
                <Icon size={22} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                  {content.title}
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  {content.subtitle}
                </p>
              </div>
            </div>
          </div>

          {section === "courses" && (
            <Link
              href="/instructor/courses/create"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0A66EC] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#185EC1]"
            >
              <Plus size={18} />
              Create new course
            </Link>
          )}

          {section === "analytics" && (
            <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              <Download size={17} />
              Export report
            </button>
          )}
        </div>

        {/* Statistics */}
        {content.stats.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {content.stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
              >
                <p className="text-sm font-medium text-slate-500">
                  {stat.label}
                </p>
                <h2 className="mt-3 text-3xl font-bold text-slate-900">
                  {stat.value}
                </h2>
                <p className="mt-2 text-xs text-slate-400">{stat.change}</p>
              </div>
            ))}
          </div>
        )}

        {/* Courses */}
        {section === "courses" && (
          <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
            <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center">
              <div>
                <h2 className="font-bold text-slate-900">All courses</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Manage the courses you teach.
                </p>
              </div>

              <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search courses..."
                  className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[#0A66EC]"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-5 py-4 font-semibold">Course</th>
                    <th className="px-5 py-4 font-semibold">Students</th>
                    <th className="px-5 py-4 font-semibold">Rating</th>
                    <th className="px-5 py-4 font-semibold">Status</th>
                    <th className="px-5 py-4 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredCourses.map((course) => (
                    <tr key={course.title} className="hover:bg-slate-50">
                      <td className="px-5 py-4">
                        <p className="font-semibold text-slate-800">{course.title}</p>
                        <p className="mt-1 text-xs text-slate-400">{course.category}</p>
                      </td>
                      <td className="px-5 py-4 text-slate-600">{course.students}</td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1 text-slate-600">
                          <Star size={14} className="fill-amber-400 text-amber-400" />
                          {course.rating}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          course.status === "Published"
                            ? "bg-green-50 text-green-700"
                            : "bg-amber-50 text-amber-700"
                        }`}>
                          {course.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <button className="rounded-lg p-2 text-slate-500 hover:bg-blue-50 hover:text-[#0A66EC]">
                          <MoreHorizontal size={19} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Students */}
        {section === "students" && (
          <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
            <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center">
              <div>
                <h2 className="font-bold text-slate-900">Student directory</h2>
                <p className="mt-1 text-sm text-slate-500">
                  See who is enrolled in your courses.
                </p>
              </div>
              <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search students..."
                  className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[#0A66EC]"
                />
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {filteredStudents.map((student) => (
                <div key={student.email} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 font-bold text-[#0A66EC]">
                      {student.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">{student.name}</p>
                      <p className="text-xs text-slate-400">{student.email}</p>
                      <p className="mt-1 text-xs text-slate-500">{student.course}</p>
                    </div>
                  </div>
                  <div className="w-full sm:max-w-48">
                    <div className="mb-2 flex justify-between text-xs text-slate-500">
                      <span>Course progress</span>
                      <span>{student.progress}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-[#0A66EC]"
                        style={{ width: `${student.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Analytics */}
        {section === "analytics" && (
          <div className="grid gap-5 lg:grid-cols-2">
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-slate-900">Student growth</h2>
                  <p className="mt-1 text-sm text-slate-500">Illustrative monthly overview</p>
                </div>
                <CalendarDays className="text-[#0A66EC]" size={20} />
              </div>
              <div className="mt-8 flex h-52 items-end justify-between gap-3">
                {[35, 48, 42, 65, 58, 78, 92].map((height, index) => (
                  <div key={index} className="flex flex-1 flex-col items-center gap-2">
                    <div
                      className="w-full max-w-10 rounded-t-lg bg-[#0A66EC]"
                      style={{ height: `${height}%` }}
                    />
                    <span className="text-xs text-slate-400">
                      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <h2 className="font-bold text-slate-900">Top performing courses</h2>
              <p className="mt-1 text-sm text-slate-500">Based on student enrolment</p>
              <div className="mt-6 space-y-5">
                {sampleCourses.slice(0, 3).map((course, index) => (
                  <div key={course.title} className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 font-bold text-[#0A66EC]">
                      {index + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-800">{course.title}</p>
                      <p className="mt-1 text-xs text-slate-400">{course.students} students</p>
                    </div>
                    <ArrowUpRight className="text-[#0A66EC]" size={18} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Messages */}
        {section === "messages" && (
          <div className="rounded-2xl border border-slate-100 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-[#0A66EC]">
              <Mail size={26} />
            </div>
            <h2 className="mt-4 text-lg font-bold text-slate-900">Your conversations</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Student conversations will appear here when messaging is connected to your backend.
            </p>
            <span className="mt-5 inline-flex rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
              Messaging integration pending
            </span>
          </div>
        )}

        {/* Settings */}
        {section === "settings" && (
          <div className="space-y-4">
            {[
              ["Account information", "Manage your name, email and account details."],
              ["Password and security", "Update your password and protect your account."],
              ["Notifications", "Choose which account notifications you receive."],
              ["Course preferences", "Manage your teaching and course preferences."],
            ].map(([title, description]) => (
              <div key={title} className="flex items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                <div>
                  <h3 className="font-semibold text-slate-800">{title}</h3>
                  <p className="mt-1 text-sm text-slate-500">{description}</p>
                </div>
                <ArrowUpRight className="shrink-0 text-slate-400" size={19} />
              </div>
            ))}
          </div>
        )}

        {/* Profile */}
        {section === "profile" && (
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-[#0A66EC]">
                IN
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Instructor profile</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Your instructor profile information will be loaded from your account.
                </p>
              </div>
            </div>
            <div className="mt-7 rounded-xl bg-blue-50 p-4 text-sm text-blue-800">
              Connect this page to your instructor profile API to display and update your real account details.
            </div>
          </div>
        )}
      </div>
    </main>
  );
}