
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  BookOpen,
  Users,
  ArrowUpRight,
  Plus,
  ChevronRight,
  PlayCircle,
  CheckCircle2,
  ShieldCheck,
  FileText,
  Clock3,
  RefreshCw,
  AlertCircle,
  GraduationCap,
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://database-dlearning.onrender.com/api";

type InstructorProfile = {
  id?: string;
  _id?: string;
  fullName: string;
  email: string;
  role: string;
  profilePicture?: string;
  isVerified?: boolean;
};

type Course = {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  category: string;
  level: string;
  image?: string;
  instructor?: string;
  duration?: string;
  lessons?: {
    title: string;
    description?: string;
    videoUrl?: string;
  }[];
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
};

type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data?: T;
  user?: T;
  profile?: T;
  count?: number;
};

function getErrorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : "Something went wrong. Please try again.";
}

function formatDate(date?: string): string {
  if (!date) return "Recently created";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "Recently created";
  }

  return parsed.toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function InstructorPage() {
  const router = useRouter();

  const [instructor, setInstructor] =
    useState<InstructorProfile | null>(null);

  const [courses, setCourses] = useState<Course[]>([]);
  const [profileLoading, setProfileLoading] = useState(true);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/");
      return;
    }

    setError("");
    setProfileLoading(true);
    setCoursesLoading(true);

    try {
      // =====================================
      // LOAD REAL INSTRUCTOR PROFILE
      // =====================================

      const profileResponse = await fetch(
        `${API_URL}/auth/profile`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          cache: "no-store",
        }
      );

      const profileResult: ApiResponse<InstructorProfile> =
        await profileResponse.json();

      if (
        profileResponse.status === 401 ||
        profileResponse.status === 403
      ) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.replace("/");
        return;
      }

      if (!profileResponse.ok || !profileResult.success) {
        throw new Error(
          profileResult.message || "Unable to load your profile."
        );
      }

      const profile =
        profileResult.user ??
        profileResult.profile ??
        profileResult.data;

      if (!profile || profile.role !== "instructor") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.replace("/");
        return;
      }

      setInstructor(profile);
      localStorage.setItem("user", JSON.stringify(profile));
      setProfileLoading(false);

      // =====================================
      // LOAD ONLY THIS INSTRUCTOR'S COURSES
      // =====================================

      const coursesResponse = await fetch(
        `${API_URL}/courses/my-courses`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          cache: "no-store",
        }
      );

      const coursesResult: ApiResponse<Course[]> =
        await coursesResponse.json();

      if (
        coursesResponse.status === 401 ||
        coursesResponse.status === 403
      ) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.replace("/");
        return;
      }

      if (!coursesResponse.ok || !coursesResult.success) {
        throw new Error(
          coursesResult.message || "Unable to load your courses."
        );
      }

      setCourses(
        Array.isArray(coursesResult.data)
          ? coursesResult.data
          : []
      );
    } catch (err) {
      console.error("Instructor dashboard error:", err);
      setError(getErrorMessage(err));
    } finally {
      setProfileLoading(false);
      setCoursesLoading(false);
    }
  };

  useEffect(() => {
    void loadDashboard();
    // loadDashboard is intentionally called once when the page mounts.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // =====================================
  // REAL COURSE STATISTICS
  // =====================================

  const statistics = useMemo(() => {
    const publishedCourses = courses.filter(
      (course) => course.isPublished
    ).length;

    const draftCourses = courses.filter(
      (course) => !course.isPublished
    ).length;

    const totalLessons = courses.reduce(
      (total, course) =>
        total + (Array.isArray(course.lessons) ? course.lessons.length : 0),
      0
    );

    return {
      totalCourses: courses.length,
      publishedCourses,
      draftCourses,
      totalLessons,
      publishedPercentage:
        courses.length > 0
          ? Math.round((publishedCourses / courses.length) * 100)
          : 0,
    };
  }, [courses]);

  // =====================================
  // LOGOUT
  // =====================================

  const handleLogout = async () => {
    const token = localStorage.getItem("token");

    try {
      if (token) {
        // Matches the existing GET /logout route.
        await fetch(`${API_URL}/auth/logout`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      }
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      router.replace("/");
    }
  };

  const instructorName =
    instructor?.fullName?.trim() || "Instructor";

  const firstName = instructorName.split(/\s+/)[0];

  const initials = instructorName
    .split(/\s+/)
    .map((name) => name[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const stats = [
    {
      title: "Total Courses",
      value: statistics.totalCourses,
      description: "Courses you have created",
      icon: BookOpen,
      color: "bg-blue-50 text-[#0A66EC]",
    },
    {
      title: "Published Courses",
      value: statistics.publishedCourses,
      description: "Visible to students",
      icon: CheckCircle2,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      title: "Draft Courses",
      value: statistics.draftCourses,
      description: "Not yet published",
      icon: FileText,
      color: "bg-amber-50 text-amber-600",
    },
    {
      title: "Total Lessons",
      value: statistics.totalLessons,
      description: "Across all your courses",
      icon: PlayCircle,
      color: "bg-indigo-50 text-indigo-600",
    },
  ];

  // =====================================
  // LOADING SCREEN
  // =====================================

  if (profileLoading && !instructor) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-[#0A66EC]" />

          <p className="mt-4 text-sm text-slate-500">
            Loading your instructor dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (!instructor) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-slate-500">
            Unable to load your instructor profile.
          </p>

          <button
            type="button"
            onClick={() => router.replace("/")}
            className="mt-4 rounded-xl bg-[#0A66EC] px-5 py-3 text-sm font-bold text-white"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1500px] space-y-7">

      {/* TOP PROFILE BAR */}
      <section className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-3">
          {instructor.profilePicture ? (
            <img
              src={instructor.profilePicture}
              alt={instructorName}
              className="h-12 w-12 rounded-full border-2 border-blue-100 object-cover"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-sm font-extrabold text-[#0A66EC]">
              {initials}
            </div>
          )}

          <div>
            <p className="text-sm font-extrabold text-slate-900">
              {instructorName}
            </p>

            <p className="text-xs text-slate-500">
              {instructor.email}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden items-center gap-1.5 rounded-full bg-blue-50 px-3 py-2 text-xs font-semibold text-[#0A66EC] sm:flex">
            <ShieldCheck size={15} />
            Instructor
          </span>

          <button
            type="button"
            onClick={() => void loadDashboard()}
            className="rounded-xl border border-slate-200 p-2.5 text-slate-500 transition hover:bg-slate-50"
            aria-label="Refresh dashboard"
            title="Refresh dashboard"
          >
            <RefreshCw size={16} />
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-xl border border-red-100 px-4 py-2.5 text-xs font-bold text-red-600 transition hover:bg-red-50"
          >
            Log Out
          </button>
        </div>
      </section>

      {/* WELCOME SECTION */}
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0A66EC] via-[#227BEA] to-[#5B99F6] p-6 text-white sm:p-8"
      >
        <div className="relative z-10 max-w-[650px]">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-100">
            Instructor Workspace
          </p>

          <div className="mb-4 mt-5 flex items-center gap-3">
            {instructor.profilePicture ? (
              <img
                src={instructor.profilePicture}
                alt={instructorName}
                className="h-14 w-14 rounded-full border-2 border-white/70 object-cover"
              />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-white/70 bg-white/20 text-lg font-extrabold text-white">
                {initials}
              </div>
            )}

            <div>
              <p className="text-sm font-bold text-white">
                {instructorName}
              </p>

              <p className="text-xs text-blue-100">
                {instructor.email}
              </p>

              <span className="mt-1 inline-block rounded-full bg-white/20 px-2 py-1 text-[10px] font-semibold text-white">
                Instructor Account
              </span>
            </div>
          </div>

          <h2 className="mt-3 text-2xl font-extrabold leading-tight sm:text-3xl lg:text-4xl">
            Welcome back, {firstName}!
          </h2>

          <p className="mt-3 max-w-lg text-sm leading-6 text-blue-50">
            Manage your courses, organize your lessons, publish
            learning programmes and share your knowledge with
            the Decent Learning community.
          </p>

          <Link
            href="/instructor/courses/create"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#0A66EC] transition hover:bg-blue-50"
          >
            <Plus size={18} />
            Create New Course
            <ArrowUpRight size={16} />
          </Link>
        </div>

        <div className="absolute -right-12 -top-16 h-64 w-64 rounded-full border-[35px] border-white/10" />

        <div className="absolute -bottom-24 right-20 h-64 w-64 rounded-full bg-white/10" />

        <BookOpen
          size={120}
          strokeWidth={1}
          className="absolute bottom-4 right-8 hidden text-white/30 lg:block"
        />
      </motion.section>

      {/* ERROR MESSAGE */}
      {error && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-100 bg-red-50 p-4">
          <div className="flex items-center gap-2 text-sm text-red-600">
            <AlertCircle size={18} />
            {error}
          </div>

          <button
            type="button"
            onClick={() => void loadDashboard()}
            className="text-xs font-bold text-red-700 underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* STATISTICS */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;

          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.color}`}
                >
                  <Icon size={22} />
                </div>
              </div>

              <p className="mt-5 text-xs font-medium text-slate-500">
                {stat.title}
              </p>

              <h3 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900">
                {coursesLoading ? "..." : stat.value}
              </h3>

              <p className="mt-2 text-[11px] font-medium text-slate-400">
                {stat.description}
              </p>
            </motion.div>
          );
        })}
      </section>

      {/* COURSE OVERVIEW AND QUICK ACTIONS */}
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(280px,0.8fr)]">

        {/* COURSE OVERVIEW */}
        <div className="min-w-0 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Course Overview
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Your actual course publishing progress
              </p>
            </div>

            <span className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-bold text-[#0A66EC]">
              {statistics.publishedPercentage}% published
            </span>
          </div>

          <div className="mt-8">
            <div className="mb-3 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-600">
                Published courses
              </span>

              <span className="font-bold text-slate-900">
                {coursesLoading
                  ? "..."
                  : `${statistics.publishedCourses} / ${statistics.totalCourses}`}
              </span>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-[#0A66EC] transition-all duration-500"
                style={{
                  width: `${statistics.publishedPercentage}%`,
                }}
              />
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-emerald-50 p-4">
                <div className="flex items-center gap-2 text-emerald-600">
                  <CheckCircle2 size={17} />
                  <span className="text-xs font-bold">
                    Published
                  </span>
                </div>

                <p className="mt-3 text-2xl font-extrabold text-slate-900">
                  {coursesLoading ? "..." : statistics.publishedCourses}
                </p>
              </div>

              <div className="rounded-xl bg-amber-50 p-4">
                <div className="flex items-center gap-2 text-amber-600">
                  <FileText size={17} />
                  <span className="text-xs font-bold">
                    Drafts
                  </span>
                </div>

                <p className="mt-3 text-2xl font-extrabold text-slate-900">
                  {coursesLoading ? "..." : statistics.draftCourses}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <h2 className="text-base font-extrabold text-slate-900">
            Quick Actions
          </h2>

          <p className="mt-1 text-xs text-slate-400">
            Manage your teaching activities
          </p>

          <div className="mt-5 space-y-3">
            <Link
              href="/instructor/courses/create"
              className="flex items-center justify-between rounded-xl bg-blue-50 p-4 transition hover:bg-blue-100"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-[#0A66EC] p-2 text-white">
                  <Plus size={18} />
                </div>

                <div>
                  <p className="text-xs font-bold text-slate-800">
                    Create a Course
                  </p>

                  <p className="mt-1 text-[10px] text-slate-500">
                    Create a new learning programme
                  </p>
                </div>
              </div>

              <ChevronRight size={18} className="text-[#0A66EC]" />
            </Link>

            <Link
              href="/instructor/courses"
              className="flex items-center justify-between rounded-xl border border-slate-100 p-4 transition hover:bg-slate-50"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
                  <BookOpen size={18} />
                </div>

                <div>
                  <p className="text-xs font-bold text-slate-800">
                    Manage Courses
                  </p>

                  <p className="mt-1 text-[10px] text-slate-500">
                    View and update your courses
                  </p>
                </div>
              </div>

              <ChevronRight size={18} className="text-slate-400" />
            </Link>

            <Link
              href="/instructor/students"
              className="flex items-center justify-between rounded-xl border border-slate-100 p-4 transition hover:bg-slate-50"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
                  <Users size={18} />
                </div>

                <div>
                  <p className="text-xs font-bold text-slate-800">
                    Student Area
                  </p>

                  <p className="mt-1 text-[10px] text-slate-500">
                    Open your student management page
                  </p>
                </div>
              </div>

              <ChevronRight size={18} className="text-slate-400" />
            </Link>
          </div>
        </div>
      </section>

      {/* MY COURSES */}
      <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-extrabold text-slate-900">
              My Courses
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              Courses created by your instructor account
            </p>
          </div>

          <Link
            href="/instructor/courses"
            className="flex items-center gap-1 text-xs font-bold text-[#0A66EC] hover:underline"
          >
            View All Courses
            <ChevronRight size={15} />
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 2xl:grid-cols-3">
          {courses.map((course, index) => (
            <motion.article
              key={course.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group overflow-hidden rounded-xl border border-slate-100 transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="relative h-44 overflow-hidden bg-slate-100">
                <img
                  src={course.image}
                  alt={course.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />

                  <span className="absolute left-3 top-3 rounded-md bg-white px-2.5 py-1.5 text-[9px] font-extrabold tracking-wide text-[#0A66EC]">
                    {course.category || "GENERAL"}
                  </span>

                  <span
                    className={`absolute right-3 top-3 rounded-md px-2.5 py-1.5 text-[9px] font-bold ${
                      course.isPublished
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-amber-50 text-amber-600"
                    }`}
                  >
                    {course.isPublished ? "Published" : "Draft"}
                  </span>
                </div>

                <div className="p-4">
                  <h3 className="min-h-[42px] text-sm font-extrabold leading-5 text-slate-900">
                    {course.title}
                  </h3>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <PlayCircle size={14} />
                      {course.lessons?.length ?? 0} lessons
                    </span>

                    <span className="flex items-center gap-1.5">
                      <Clock3 size={14} />
                      {course.duration || "Self-paced"}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-[10px] text-slate-400">
                    <span>{course.level || "Beginner"}</span>
                    <span>{formatDate(course.createdAt)}</span>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                    <div>
                      <p className="text-[10px] text-slate-400">
                        Course status
                      </p>

                      <p
                        className={`mt-1 text-xs font-extrabold ${
                          course.isPublished
                            ? "text-emerald-600"
                            : "text-amber-600"
                        }`}
                      >
                        {course.isPublished
                          ? "Live for students"
                          : "Unpublished draft"}
                      </p>
                    </div>

                    <Link
                      href={`/instructor/courses/${course._id}/edit`}
                      className="rounded-lg bg-blue-50 px-3 py-2 text-[10px] font-bold text-[#0A66EC] transition hover:bg-blue-100"
                    >
                      Manage Course
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}

        {!coursesLoading && courses.length > 6 && (
          <div className="mt-6 text-center">
            <Link
              href="/instructor/courses"
              className="inline-flex items-center gap-2 rounded-xl border border-blue-100 px-5 py-3 text-xs font-bold text-[#0A66EC] transition hover:bg-blue-50"
            >
              View all {courses.length} courses
              <ArrowUpRight size={15} />
            </Link>
          </div>
        )}
      </section>

      {/* NOT YET CONNECTED */}
      <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-blue-50 p-3 text-[#0A66EC]">
            <Users size={22} />
          </div>

                      <div>
                        <p className="text-xs font-bold text-slate-800">
                          {student.name}
                        </p>

                        <p className="mt-1 text-[10px] text-slate-400">
                          {student.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 text-xs font-semibold text-slate-600">
                    {student.course}
                  </td>

                  <td className="py-4 text-xs text-slate-500">
                    {student.date}
                  </td>

                  <td className="py-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-bold text-emerald-600">
                      <CheckCircle2 size={12} />
                      Enrolled
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
