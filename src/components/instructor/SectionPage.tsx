
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
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
  Download,
  CalendarDays,
  RefreshCw,
} from "lucide-react";

const API_BASE = (
  process.env.NEXT_PUBLIC_API_URL ||
  "https://database-dlearning.onrender.com"
).replace(/\/+$/, "");

async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  if (!token) {
    throw new Error("Your session has expired. Please log in again.");
  }

  const normalizedEndpoint = endpoint.startsWith("/")
    ? endpoint
    : `/${endpoint}`;

  const response = await fetch(`${API_BASE}${normalizedEndpoint}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
      ...(options.body instanceof FormData
        ? {}
        : { "Content-Type": "application/json" }),
    },
    cache: "no-store",
  });

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      result?.message || `Request failed with status ${response.status}`
    );
  }

  return result as T;
}

type SectionKey =
  | "courses"
  | "students"
  | "analytics"
  | "messages"
  | "settings"
  | "profile";

type Course = {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  category: string;
  level?: string;
  image?: string;
  instructor?: string;
  duration?: string;
  lessons?: unknown[];
  isPublished: boolean;
};

type Student = {
  enrollmentId: string;
  id: string;
  fullName: string;
  email: string;
  profilePicture?: string;
  course: string;
  courseSlug?: string;
  progress: number;
  status: string;
  enrolledAt?: string;
};

type InstructorProfile = {
  id: string;
  fullName: string;
  email: string;
  role: string;
  profilePicture?: string;
  isVerified?: boolean;
  isActive?: boolean;
};

const sectionContent = {
  courses: {
    title: "My Courses",
    subtitle: "Create, manage and monitor your learning programmes.",
    icon: BookOpen,
  },
  students: {
    title: "My Students",
    subtitle: "View students enrolled in your courses.",
    icon: Users,
  },
  analytics: {
    title: "Analytics",
    subtitle: "Understand your course performance and student engagement.",
    icon: ChartNoAxesCombined,
  },
  messages: {
    title: "Messages",
    subtitle: "Communicate with your students.",
    icon: Mail,
  },
  settings: {
    title: "Settings",
    subtitle: "Manage your instructor account and preferences.",
    icon: Settings,
  },
  profile: {
    title: "My Profile",
    subtitle: "Manage your instructor profile.",
    icon: UserRound,
  },
};

export default function SectionPage({
  section,
}: {
  section: SectionKey;
}) {
  const content = sectionContent[section];
  const Icon = content.icon;

  const [search, setSearch] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [profile, setProfile] = useState<InstructorProfile | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      setLoading(true);
      setError("");

      try {
        if (
          section === "courses" ||
          section === "students" ||
          section === "analytics"
        ) {
          const requests: Promise<any>[] = [];

          if (section === "courses" || section === "analytics") {
            requests.push(apiRequest("/api/courses/my-courses"));
          }

          if (section === "students" || section === "analytics") {
            requests.push(apiRequest("/api/auth/students"));
          }

          const results = await Promise.all(requests);
          let resultIndex = 0;

          if (section === "courses" || section === "analytics") {
            const courseResult = results[resultIndex++];
            const courseList = Array.isArray(courseResult?.courses)
              ? courseResult.courses
              : Array.isArray(courseResult?.data)
                ? courseResult.data
                : Array.isArray(courseResult?.data?.courses)
                  ? courseResult.data.courses
                  : [];

            if (!cancelled) {
              setCourses(courseList);
            }
          }

          if (section === "students" || section === "analytics") {
            const studentResult = results[resultIndex++];
            const studentList = Array.isArray(studentResult?.students)
              ? studentResult.students
              : Array.isArray(studentResult?.data?.students)
                ? studentResult.data.students
                : [];

            if (!cancelled) {
              setStudents(
                studentList.map((student: Student) => ({
                  ...student,
                  progress: Math.min(
                    100,
                    Math.max(0, Number(student.progress) || 0)
                  ),
                }))
              );
            }
          }
        }

        if (section === "profile") {
          const result = await apiRequest("/api/auth/profile");

          if (!cancelled) {
            setProfile(result?.user || result?.data?.user || null);
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load dashboard data."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      cancelled = true;
    };
  }, [section, refreshKey]);

  const filteredCourses = useMemo(
    () =>
      courses.filter((course) =>
        `${course.title} ${course.category}`
          .toLowerCase()
          .includes(search.toLowerCase())
      ),
    [courses, search]
  );

  const filteredStudents = useMemo(
    () =>
      students.filter((student) =>
        `${student.fullName} ${student.email} ${student.course}`
          .toLowerCase()
          .includes(search.toLowerCase())
      ),
    [students, search]
  );

  const publishedCourses = courses.filter(
    (course) => course.isPublished
  ).length;

  const draftCourses = courses.length - publishedCourses;

  const completedStudents = students.filter(
    (student) => student.progress >= 100
  ).length;

  const activeStudents = students.filter(
    (student) => student.progress > 0 && student.progress < 100
  ).length;

  const refreshData = () => {
    setRefreshKey((previous) => previous + 1);
  };

  return (
    <main className="min-h-screen bg-[#F5F8FE] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-7">

        {/* PAGE HEADING */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
              <Link
                href="/instructor"
                className="hover:text-[#0A66EC]"
              >
                Dashboard
              </Link>

              <span>/</span>

              <span className="font-medium text-slate-700">
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

          <div className="flex flex-wrap gap-2">
            <button
              onClick={refreshData}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              <RefreshCw
                size={17}
                className={loading ? "animate-spin" : ""}
              />
              Refresh
            </button>

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
              <button
                onClick={() => window.print()}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                <Download size={17} />
                Print report
              </button>
            )}
          </div>
        </div>

        {/* LOADING AND ERROR */}
        {loading && (
          <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-700">
            Loading your real information from Decent Learning...
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* COURSES */}
        {section === "courses" && (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[
                {
                  label: "Total courses",
                  value: courses.length,
                  change: "Your courses",
                },
                {
                  label: "Published",
                  value: publishedCourses,
                  change: "Available to students",
                },
                {
                  label: "Draft courses",
                  value: draftCourses,
                  change: "Still being prepared",
                },
              ].map((stat) => (
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

                  <p className="mt-2 text-xs text-slate-400">
                    {stat.change}
                  </p>
                </div>
              ))}

              <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                <p className="text-sm font-medium text-slate-500">
                  Student enrolments
                </p>

                <h2 className="mt-3 text-3xl font-bold text-slate-900">
                  —
                </h2>

                <p className="mt-2 text-xs text-slate-400">
                  Load the students section for enrolment details
                </p>
              </div>
            </div>

            <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
              <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center">
                <div>
                  <h2 className="font-bold text-slate-900">
                    All courses
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Manage the courses you teach.
                  </p>
                </div>

                <div className="relative w-full sm:max-w-xs">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={17}
                  />

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
                      <th className="px-5 py-4 font-semibold">Category</th>
                      <th className="px-5 py-4 font-semibold">Lessons</th>
                      <th className="px-5 py-4 font-semibold">Status</th>
                      <th className="px-5 py-4 font-semibold">Action</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {filteredCourses.map((course) => (
                      <tr
                        key={course._id}
                        className="hover:bg-slate-50"
                      >
                        <td className="px-5 py-4">
                          <p className="font-semibold text-slate-800">
                            {course.title}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            {course.level || "Course"}
                          </p>
                        </td>

                        <td className="px-5 py-4 text-slate-600">
                          {course.category}
                        </td>

                        <td className="px-5 py-4 text-slate-600">
                          {course.lessons?.length || 0}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              course.isPublished
                                ? "bg-green-50 text-green-700"
                                : "bg-amber-50 text-amber-700"
                            }`}
                          >
                            {course.isPublished
                              ? "Published"
                              : "Draft"}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <Link
                            href={`/instructor/courses/${course._id}`}
                            className="font-semibold text-[#0A66EC] hover:underline"
                          >
                            Manage
                          </Link>
                        </td>
                      </tr>
                    ))}

                    {!loading && !error && filteredCourses.length === 0 && (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-5 py-12 text-center text-slate-500"
                        >
                          No courses found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}

        {/* STUDENTS */}
        {section === "students" && (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {[
                {
                  label: "Total enrolments",
                  value: students.length,
                  description: "Across your courses",
                },
                {
                  label: "Currently learning",
                  value: activeStudents,
                  description: "Students with active progress",
                },
                {
                  label: "Completed",
                  value: completedStudents,
                  description: "Completed course enrolments",
                },
              ].map((stat) => (
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

                  <p className="mt-2 text-xs text-slate-400">
                    {stat.description}
                  </p>
                </div>
              ))}
            </div>

            <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
              <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center">
                <div>
                  <h2 className="font-bold text-slate-900">
                    Student directory
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Students enrolled in your courses.
                  </p>
                </div>

                <div className="relative w-full sm:max-w-xs">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={17}
                  />

                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search students..."
                    className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[#0A66EC]"
                  />
                </div>
              </div>

              <div className="divide-y divide-slate-100">
                {filteredStudents.map((student, index) => (
  <div
    key={
      student.enrollmentId ||
      `${student.id}-${student.courseSlug || student.course}-${index}`
    }
    className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-100 font-bold text-[#0A66EC]">
                        {student.profilePicture ? (
                          <img
                            src={student.profilePicture}
                            alt={student.fullName}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          student.fullName?.charAt(0).toUpperCase() || "S"
                        )}
                      </div>

                      <div>
                        <p className="font-semibold text-slate-800">
                          {student.fullName}
                        </p>

                        <p className="text-xs text-slate-400">
                          {student.email}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {student.course}
                        </p>
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
                          style={{
                            width: `${student.progress}%`,
                          }}
                        />
                      </div>

                      <p className="mt-2 text-xs text-slate-400">
                        {student.status}
                      </p>
                    </div>
                  </div>
                ))}

                {!loading && !error && filteredStudents.length === 0 && (
                  <div className="p-12 text-center">
                    <Users
                      size={35}
                      className="mx-auto text-slate-300"
                    />

                    <h3 className="mt-3 font-semibold text-slate-700">
                      No enrolled students yet
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Students will appear here when they enrol in your courses.
                    </p>
                  </div>
                )}
              </div>
            </section>
          </>
        )}

        {/* ANALYTICS */}
        {section === "analytics" && (
          <div className="grid gap-5 lg:grid-cols-2">
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <CalendarDays
                className="text-[#0A66EC]"
                size={22}
              />

              <h2 className="mt-4 font-bold text-slate-900">
                Course statistics
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Your current course information.
              </p>

              <div className="mt-6 space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">
                    Total courses
                  </span>
                  <strong>{courses.length}</strong>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">
                    Published courses
                  </span>
                  <strong>{publishedCourses}</strong>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">
                    Draft courses
                  </span>
                  <strong>{draftCourses}</strong>
                </div>
              </div>

              <button
                onClick={() => {
                  window.location.href = "/instructor/courses";
                }}
                className="mt-6 text-sm font-semibold text-[#0A66EC]"
              >
                View courses <ArrowUpRight className="inline" size={16} />
              </button>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <Users
                className="text-[#0A66EC]"
                size={22}
              />

              <h2 className="mt-4 font-bold text-slate-900">
                Student statistics
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Your enrolled student information.
              </p>

              <div className="mt-6 space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">
                    Total enrolments
                  </span>
                  <strong>{students.length}</strong>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">
                    Currently learning
                  </span>
                  <strong>{activeStudents}</strong>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">
                    Completed
                  </span>
                  <strong>{completedStudents}</strong>
                </div>
              </div>

              <button
                onClick={() => {
                  window.location.href = "/instructor/students";
                }}
                className="mt-6 text-sm font-semibold text-[#0A66EC]"
              >
                View students <ArrowUpRight className="inline" size={16} />
              </button>
            </div>
          </div>
        )}

        {/* MESSAGES */}
        {section === "messages" && (
          <div className="rounded-2xl border border-slate-100 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-[#0A66EC]">
              <Mail size={26} />
            </div>

            <h2 className="mt-4 text-lg font-bold text-slate-900">
              Your conversations
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Messaging has not been connected to your backend yet.
            </p>
          </div>
        )}

        {/* SETTINGS */}
        {section === "settings" && (
          <div className="space-y-4">
            {[
              ["Account information", "Manage your name, email and account details."],
              ["Password and security", "Update your password and protect your account."],
              ["Notifications", "Choose which account notifications you receive."],
              ["Course preferences", "Manage your teaching and course preferences."],
            ].map(([title, description]) => (
              <div
                key={title}
                className="flex items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
              >
                <div>
                  <h3 className="font-semibold text-slate-800">
                    {title}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    {description}
                  </p>
                </div>

                <ArrowUpRight
                  className="shrink-0 text-slate-400"
                  size={19}
                />
              </div>
            ))}
          </div>
        )}

        {/* PROFILE */}
        {section === "profile" && (
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            {profile ? (
              <>
                <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                  <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-blue-100 text-2xl font-bold text-[#0A66EC]">
                    {profile.profilePicture ? (
                      <img
                        src={profile.profilePicture}
                        alt={profile.fullName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      profile.fullName.charAt(0).toUpperCase()
                    )}
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      {profile.fullName}
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      {profile.email}
                    </p>

                    <span className="mt-2 inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold capitalize text-[#0A66EC]">
                      {profile.role}
                    </span>
                  </div>
                </div>

                <div className="mt-7 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs text-slate-500">Account status</p>
                    <p className="mt-1 font-semibold text-slate-800">
                      {profile.isActive ? "Active" : "Inactive"}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs text-slate-500">Verification</p>
                    <p className="mt-1 font-semibold text-slate-800">
                      {profile.isVerified ? "Verified" : "Not verified"}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              !loading && (
                <p className="text-sm text-slate-500">
                  Instructor profile information is unavailable.
                </p>
              )
            )}
          </div>
        )}
      </div>
    </main>
  );
}
