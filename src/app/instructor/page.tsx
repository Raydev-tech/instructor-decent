
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  BookOpen,
  Users,
  Wallet,
  Star,
  ArrowUpRight,
  Plus,
  MoreHorizontal,
  ChevronRight,
  TrendingUp,
  PlayCircle,
  CheckCircle2,
  ChartNoAxesCombined,
  ShieldCheck,
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://backend-dlearning.onrender.com/api";

type InstructorProfile = {
  id?: string;
  fullName: string;
  email: string;
  role: string;
  profilePicture?: string;
  isVerified?: boolean;
};

const stats = [
  {
    title: "Total Courses",
    value: "12",
    change: "+2 this month",
    icon: BookOpen,
    color: "bg-blue-50 text-[#0A66EC]",
  },
  {
    title: "Total Students",
    value: "1,248",
    change: "+12.8% this month",
    icon: Users,
    color: "bg-indigo-50 text-indigo-600",
  },
  {
    title: "Total Earnings",
    value: "₦485,000",
    change: "+8.5% this month",
    icon: Wallet,
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    title: "Average Rating",
    value: "4.8",
    change: "From 320 reviews",
    icon: Star,
    color: "bg-amber-50 text-amber-500",
  },
];

const courses = [
  {
    id: 1,
    title: "Complete Frontend Development",
    category: "WEB DEVELOPMENT",
    image:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=700",
    students: 420,
    lessons: 36,
    progress: 78,
    status: "Published",
    earnings: "₦185,000",
  },
  {
    id: 2,
    title: "Blockchain Development Fundamentals",
    category: "BLOCKCHAIN",
    image:
      "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=700",
    students: 315,
    lessons: 28,
    progress: 65,
    status: "Published",
    earnings: "₦120,000",
  },
  {
    id: 3,
    title: "Solidity Smart Contract Development",
    category: "WEB3",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=700",
    students: 208,
    lessons: 24,
    progress: 45,
    status: "Published",
    earnings: "₦95,000",
  },
];

const enrollments = [
  {
    name: "Daniel Johnson",
    email: "daniel@example.com",
    course: "Frontend Development",
    date: "Today",
    initials: "DJ",
    color: "bg-blue-100 text-blue-600",
  },
  {
    name: "Sarah Williams",
    email: "sarah@example.com",
    course: "Blockchain Fundamentals",
    date: "Yesterday",
    initials: "SW",
    color: "bg-purple-100 text-purple-600",
  },
  {
    name: "Michael Brown",
    email: "michael@example.com",
    course: "Solidity Development",
    date: "2 days ago",
    initials: "MB",
    color: "bg-amber-100 text-amber-600",
  },
  {
    name: "Esther David",
    email: "esther@example.com",
    course: "Frontend Development",
    date: "3 days ago",
    initials: "ED",
    color: "bg-emerald-100 text-emerald-600",
  },
];

const chartData = [
  { month: "Jan", value: 35 },
  { month: "Feb", value: 48 },
  { month: "Mar", value: 40 },
  { month: "Apr", value: 62 },
  { month: "May", value: 55 },
  { month: "Jun", value: 78 },
  { month: "Jul", value: 68 },
  { month: "Aug", value: 90 },
  { month: "Sep", value: 72 },
  { month: "Oct", value: 96 },
  { month: "Nov", value: 82 },
  { month: "Dec", value: 100 },
];

function EarningsChart() {
  const points = chartData
    .map((item, index) => {
      const x = 35 + index * 48;
      const y = 170 - item.value * 1.35;

      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="mt-5 w-full overflow-hidden">
      <svg
        viewBox="0 0 600 230"
        className="w-full"
        role="img"
        aria-label="Instructor earnings performance chart"
      >
        {[35, 75, 115, 155, 195].map((y) => (
          <line
            key={y}
            x1="25"
            y1={y}
            x2="575"
            y2={y}
            stroke="#E8EEF7"
            strokeDasharray="4 5"
          />
        ))}

        <polyline
          points={points}
          fill="none"
          stroke="#0A66EC"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {chartData.map((item, index) => {
          const x = 35 + index * 48;
          const y = 170 - item.value * 1.35;

          return (
            <g key={item.month}>
              <circle
                cx={x}
                cy={y}
                r="4"
                fill="#0A66EC"
                stroke="white"
                strokeWidth="2"
              />

              <text
                x={x}
                y="220"
                textAnchor="middle"
                fontSize="11"
                fill="#94A3B8"
              >
                {item.month}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default function InstructorPage() {
  const router = useRouter();

  const [instructor, setInstructor] =
    useState<InstructorProfile | null>(null);

  const [profileLoading, setProfileLoading] = useState(true);

  // LOAD LOGGED-IN INSTRUCTOR
  useEffect(() => {
    let isMounted = true;

    const loadInstructorProfile = async () => {
      const token = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user");

      if (!token) {
        router.replace("/");
        return;
      }

      // Load saved user information first
      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);

          if (parsedUser.role !== "instructor") {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            router.replace("/");
            return;
          }

          if (isMounted) {
            setInstructor(parsedUser);
          }
        } catch {
          localStorage.removeItem("user");
        }
      }

      try {
        const response = await fetch(`${API_URL}/auth/profile`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          if (response.status === 401 || response.status === 403) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            router.replace("/");
          }

          return;
        }

        // Supports either { user: ... } or { profile: ... }
        const profile = data.user ?? data.profile ?? data;

        if (profile.role !== "instructor") {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          router.replace("/");
          return;
        }

        if (isMounted) {
          setInstructor(profile);
          localStorage.setItem("user", JSON.stringify(profile));
        }
      } catch (error) {
        console.error("Unable to load instructor profile:", error);
      } finally {
        if (isMounted) {
          setProfileLoading(false);
        }
      }
    };

    loadInstructorProfile();

    return () => {
      isMounted = false;
    };
  }, [router]);

  // LOGOUT
  const handleLogout = async () => {
    const token = localStorage.getItem("token");

    try {
      if (token) {
        await fetch(`${API_URL}/auth/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
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

  // LOADING SCREEN
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
    return null;
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
            Manage your courses, track your students, monitor your earnings,
            and continue sharing your knowledge with the Decent Learning
            community.
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

                <button
                  type="button"
                  aria-label={`More options for ${stat.title}`}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-50"
                >
                  <MoreHorizontal size={20} />
                </button>
              </div>

              <p className="mt-5 text-xs font-medium text-slate-500">
                {stat.title}
              </p>

              <h3 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900">
                {stat.value}
              </h3>

              <p className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                <TrendingUp size={13} />
                {stat.change}
              </p>
            </motion.div>
          );
        })}
      </section>

      {/* CHART AND QUICK ACTIONS */}
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(280px,0.8fr)]">

        {/* EARNINGS CHART */}
        <div className="min-w-0 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Earnings Overview
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Track your course revenue throughout the year
              </p>
            </div>

            <select
              defaultValue="This year"
              className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600 outline-none"
            >
              <option>This year</option>
              <option>This month</option>
              <option>This week</option>
            </select>
          </div>

          <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs text-slate-400">
                Total earnings
              </p>

              <h3 className="mt-1 text-3xl font-extrabold text-slate-900">
                ₦485,000
              </h3>
            </div>

            <span className="flex items-center gap-1 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-600">
              <TrendingUp size={14} />
              8.5%
            </span>
          </div>

          <EarningsChart />
        </div>

        {/* QUICK ACTIONS */}
        <div className="space-y-4">
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
                      Publish a new learning programme
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
                href="/instructor/analytics"
                className="flex items-center justify-between rounded-xl border border-slate-100 p-4 transition hover:bg-slate-50"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
                    <ChartNoAxesCombined size={18} />
                  </div>

                  <div>
                    <p className="text-xs font-bold text-slate-800">
                      View Analytics
                    </p>

                    <p className="mt-1 text-[10px] text-slate-500">
                      Monitor your performance
                    </p>
                  </div>
                </div>

                <ChevronRight size={18} className="text-slate-400" />
              </Link>
            </div>
          </div>

          {/* COURSE SUMMARY */}
          <div className="rounded-2xl bg-[#185EC1] p-5 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-blue-100">
                  Course performance
                </p>

                <h3 className="mt-2 text-2xl font-extrabold">
                  86% <span className="text-sm font-medium">average</span>
                </h3>
              </div>

              <div className="rounded-xl bg-white/15 p-3">
                <CheckCircle2 size={25} />
              </div>
            </div>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/20">
              <div className="h-full w-[86%] rounded-full bg-white" />
            </div>

            <p className="mt-3 text-[11px] leading-5 text-blue-100">
              Your courses are performing well. Keep creating valuable
              content for your students.
            </p>
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
              Manage and monitor your published courses
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
                  {course.category}
                </span>

                <span className="absolute right-3 top-3 rounded-md bg-emerald-50 px-2.5 py-1.5 text-[9px] font-bold text-emerald-600">
                  {course.status}
                </span>
              </div>

              <div className="p-4">
                <h3 className="min-h-[42px] text-sm font-extrabold leading-5 text-slate-900">
                  {course.title}
                </h3>

                <div className="mt-4 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Users size={14} />
                    {course.students} students
                  </span>

                  <span className="flex items-center gap-1.5">
                    <PlayCircle size={14} />
                    {course.lessons} lessons
                  </span>
                </div>

                <div className="mt-4">
                  <div className="mb-2 flex justify-between text-[10px] font-semibold">
                    <span className="text-slate-400">
                      Course completion
                    </span>

                    <span className="text-[#0A66EC]">
                      {course.progress}%
                    </span>
                  </div>

                  <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-[#0A66EC]"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                  <div>
                    <p className="text-[10px] text-slate-400">
                      Total earnings
                    </p>

                    <p className="mt-1 text-sm font-extrabold text-slate-900">
                      {course.earnings}
                    </p>
                  </div>

                  <Link
                    href={`/instructor/courses/${course.id}/edit`}
                    className="rounded-lg bg-blue-50 px-3 py-2 text-[10px] font-bold text-[#0A66EC] transition hover:bg-blue-100"
                  >
                    Manage Course
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* RECENT ENROLLMENTS */}
      <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-extrabold text-slate-900">
              Recent Enrollments
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              Students who recently joined your courses
            </p>
          </div>

          <Link
            href="/instructor/students"
            className="flex items-center gap-1 text-xs font-bold text-[#0A66EC] hover:underline"
          >
            View All Students
            <ChevronRight size={15} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-left">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-bold uppercase tracking-wide text-slate-400">
                <th className="pb-4">Student</th>
                <th className="pb-4">Course</th>
                <th className="pb-4">Enrollment Date</th>
                <th className="pb-4">Status</th>
              </tr>
            </thead>

            <tbody>
              {enrollments.map((student) => (
                <tr
                  key={student.email}
                  className="border-b border-slate-50 last:border-0"
                >
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full text-xs font-extrabold ${student.color}`}
                      >
                        {student.initials}
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
