
"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  Plus,
  Trash2,
  Upload,
  Video,
  X,
  Save,
  Eye,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  Loader2,
} from "lucide-react";

type Lesson = {
  id: number;
  title: string;
  description: string;
  videoUrl: string;
};

type MessageType = "success" | "error";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://database-dlearning.onrender.com/api";

export default function CreateCoursePage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("Beginner");
  const [duration, setDuration] = useState("");

  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");

  const [lessons, setLessons] = useState<Lesson[]>([
    {
      id: 1,
      title: "",
      description: "",
      videoUrl: "",
    },
  ]);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] =
    useState<MessageType>("success");

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Create thumbnail preview
  useEffect(() => {
    if (!thumbnail) {
      setThumbnailPreview("");
      return;
    }

    const previewUrl = URL.createObjectURL(thumbnail);
    setThumbnailPreview(previewUrl);

    return () => URL.revokeObjectURL(previewUrl);
  }, [thumbnail]);

  // Add lesson
  const addLesson = () => {
    setLessons((current) => [
      ...current,
      {
        id: Date.now() + Math.floor(Math.random() * 1000),
        title: "",
        description: "",
        videoUrl: "",
      },
    ]);
  };

  // Update lesson
  const updateLesson = (
    id: number,
    field: keyof Omit<Lesson, "id">,
    value: string
  ) => {
    setLessons((current) =>
      current.map((lesson) =>
        lesson.id === id
          ? { ...lesson, [field]: value }
          : lesson
      )
    );
  };

  // Remove lesson
  const removeLesson = (id: number) => {
    setLessons((current) =>
      current.filter((lesson) => lesson.id !== id)
    );
  };

  // Generate course slug from title
  const createSlug = (value: string) => {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  // Thumbnail validation
  const handleThumbnail = (file?: File) => {
    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setMessageType("error");
      setMessage("Please select a JPG, PNG or WEBP image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessageType("error");
      setMessage("Thumbnail must be smaller than 5MB.");
      return;
    }

    setThumbnail(file);
    setMessage("");
  };

  // Submit course to Express backend
  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setMessage("");

    if (!title.trim()) {
      setMessageType("error");
      setMessage("Please enter your course title.");
      return;
    }

    if (!description.trim()) {
      setMessageType("error");
      setMessage("Please enter your course description.");
      return;
    }

    if (!category) {
      setMessageType("error");
      setMessage("Please select a course category.");
      return;
    }

    if (!duration.trim()) {
      setMessageType("error");
      setMessage("Please enter the course duration.");
      return;
    }

    if (lessons.length === 0) {
      setMessageType("error");
      setMessage("Please add at least one lesson.");
      return;
    }

    const incompleteLesson = lessons.find(
      (lesson) =>
        !lesson.title.trim() || !lesson.videoUrl.trim()
    );

    if (incompleteLesson) {
      setMessageType("error");
      setMessage(
        "Every lesson must have a title and video URL."
      );
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setMessageType("error");
      setMessage(
        "Your login session was not found. Please log in again."
      );
      return;
    }

    const slug = createSlug(title);

    if (!slug) {
      setMessageType("error");
      setMessage("Please enter a valid course title.");
      return;
    }

    try {
      setIsSubmitting(true);

      const formData = new FormData();

      // Course information
      formData.append("title", title.trim());
      formData.append("slug", slug);
      formData.append("description", description.trim());
      formData.append("category", category);
      formData.append("level", level);
      formData.append("duration", duration.trim());

      // Save as unpublished course initially
      formData.append("isPublished", "true");

      // Course lessons
      const formattedLessons = lessons.map((lesson) => ({
        title: lesson.title.trim(),
        description: lesson.description.trim(),
        videoUrl: lesson.videoUrl.trim(),
      }));

      formData.append(
        "lessons",
        JSON.stringify(formattedLessons)
      );

      // Course thumbnail
      if (thumbnail) {
        formData.append("image", thumbnail);
      }

      const response = await fetch(
        `${API_URL.replace(/\/$/, "")}/courses`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const result = await response.json();

      if (!response.ok || result.success === false) {
        throw new Error(
          result.message || "Unable to create your course."
        );
      }

      setMessageType("success");
      setMessage(
        "Your course has been created successfully!"
      );

      // Notify other components that authentication is available
      // and return to the instructor courses page.
      setTimeout(() => {
        router.push("/instructor/courses");
        router.refresh();
      }, 1200);
    } catch (error) {
      setMessageType("error");

      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong while creating your course."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#0A66EC] focus:ring-2 focus:ring-blue-100";

  const labelClass = "text-sm font-semibold text-slate-700";

  return (
    <main className="min-h-screen bg-[#F5F8FE] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-7">

        {/* Header */}
        <div>
          <Link
            href="/instructor/courses"
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-[#0A66EC]"
          >
            <ArrowLeft size={17} />
            Back to my courses
          </Link>

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
                <span>Instructor</span>
                <span>/</span>
                <span>My Courses</span>
                <span>/</span>
                <span className="font-medium text-[#0A66EC]">
                  Create Course
                </span>
              </div>

              <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                Create a new course
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Share your knowledge by creating a course for your students.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-medium text-[#185EC1]">
              <BookOpen size={18} />
              Course builder
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Basic information */}
          <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#0A66EC]">
                <FileText size={20} />
              </div>

              <div>
                <h2 className="font-bold text-slate-900">
                  Basic information
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Introduce your course to potential students.
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label className={labelClass}>
                  Course title *
                </label>

                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Complete Frontend Development"
                  maxLength={120}
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label className={labelClass}>
                  Course description *
                </label>

                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explain what this course covers, who it is for and what students will be able to do..."
                  rows={6}
                  maxLength={5000}
                  className={`${inputClass} resize-y`}
                  required
                />

                <p className="mt-2 text-right text-xs text-slate-400">
                  {description.length}/5000 characters
                </p>
              </div>
            </div>
          </section>

          {/* Course details */}
          <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#0A66EC]">
                <BookOpen size={20} />
              </div>

              <div>
                <h2 className="font-bold text-slate-900">
                  Course details
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Choose how your course will be organised.
                </p>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className={labelClass}>
                  Category *
                </label>

                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={inputClass}
                  required
                >
                  <option value="">Select category</option>
                  <option value="Development">Development</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Frontend Development">
                    Frontend Development
                  </option>
                  <option value="Backend Development">
                    Backend Development
                  </option>
                  <option value="Blockchain">Blockchain</option>
                  <option value="Solidity">Solidity</option>
                  <option value="Smart Contract Security">
                    Smart Contract Security
                  </option>
                  <option value="Cybersecurity">Cybersecurity</option>
                  <option value="Artificial Intelligence">
                    Artificial Intelligence
                  </option>
                  <option value="Cloud Computing">Cloud Computing</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>
                  Course level *
                </label>

                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className={inputClass}
                  required
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className={labelClass}>
                  Course duration *
                </label>

                <input
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="e.g. 4 weeks, 3 months or Self-paced"
                  className={inputClass}
                  required
                />
              </div>
            </div>
          </section>

          {/* Thumbnail */}
          <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#0A66EC]">
                <ImageIcon size={20} />
              </div>

              <div>
                <h2 className="font-bold text-slate-900">
                  Course thumbnail
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Add an image that represents your course.
                </p>
              </div>
            </div>

            <label className="flex min-h-48 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-5 text-center transition hover:border-[#0A66EC] hover:bg-blue-50/50">
              {thumbnailPreview ? (
                <div className="relative w-full">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={thumbnailPreview}
                    alt="Course thumbnail preview"
                    className="mx-auto max-h-64 w-full rounded-xl object-cover"
                  />

                  <span className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[#0A66EC]">
                    <CheckCircle2 size={16} />
                    Image selected — click to change
                  </span>
                </div>
              ) : (
                <>
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-[#0A66EC]">
                    <Upload size={23} />
                  </div>

                  <p className="font-semibold text-slate-700">
                    Click to upload thumbnail
                  </p>

                  <p className="mt-2 text-xs text-slate-400">
                    PNG, JPG or WEBP · Maximum 5MB
                  </p>
                </>
              )}

              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={(e) =>
                  handleThumbnail(e.target.files?.[0])
                }
              />
            </label>

            {thumbnail && (
              <button
                type="button"
                onClick={() => setThumbnail(null)}
                className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-red-500 hover:text-red-600"
              >
                <X size={15} />
                Remove thumbnail
              </button>
            )}
          </section>

          {/* Lessons */}
          <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#0A66EC]">
                  <Video size={20} />
                </div>

                <div>
                  <h2 className="font-bold text-slate-900">
                    Course curriculum
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Add the lessons students will study.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={addLesson}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#0A66EC] px-4 py-2.5 text-sm font-semibold text-[#0A66EC] transition hover:bg-blue-50"
              >
                <Plus size={17} />
                Add lesson
              </button>
            </div>

            <div className="space-y-4">
              {lessons.map((lesson, index) => (
                <div
                  key={lesson.id}
                  className="rounded-xl border border-slate-200 p-4 sm:p-5"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-sm font-bold text-[#0A66EC]">
                        {index + 1}
                      </span>

                      <h3 className="text-sm font-bold text-slate-800">
                        Lesson {index + 1}
                      </h3>
                    </div>

                    {lessons.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeLesson(lesson.id)}
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                        aria-label={`Remove lesson ${index + 1}`}
                      >
                        <Trash2 size={17} />
                      </button>
                    )}
                  </div>

                  <div className="grid gap-4">
                    <div>
                      <label className={labelClass}>
                        Lesson title *
                      </label>

                      <input
                        value={lesson.title}
                        onChange={(e) =>
                          updateLesson(
                            lesson.id,
                            "title",
                            e.target.value
                          )
                        }
                        placeholder="e.g. Introduction to HTML"
                        className={inputClass}
                        required
                      />
                    </div>

                    <div>
                      <label className={labelClass}>
                        Lesson description
                      </label>

                      <textarea
                        value={lesson.description}
                        onChange={(e) =>
                          updateLesson(
                            lesson.id,
                            "description",
                            e.target.value
                          )
                        }
                        placeholder="What will students learn in this lesson?"
                        rows={3}
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className={labelClass}>
                        Video URL *
                      </label>

                      <input
                        type="url"
                        value={lesson.videoUrl}
                        onChange={(e) =>
                          updateLesson(
                            lesson.id,
                            "videoUrl",
                            e.target.value
                          )
                        }
                        placeholder="https://..."
                        className={inputClass}
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Feedback */}
          {message && (
            <div
              role="alert"
              className={`rounded-xl border p-4 text-sm leading-6 ${
                messageType === "success"
                  ? "border-blue-100 bg-blue-50 text-blue-800"
                  : "border-red-100 bg-red-50 text-red-700"
              }`}
            >
              {message}
            </div>
          )}

          {/* Form actions */}
          <div className="flex flex-col-reverse justify-between gap-3 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:p-6">
            <Link
              href="/instructor/courses"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Cancel
            </Link>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => {
                  setMessageType("success");
                  setMessage(
                    "Course preview will be available when the course preview page is implemented."
                  );
                }}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                <Eye size={17} />
                Preview
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0A66EC] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#185EC1] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={17} className="animate-spin" />
                    Creating course...
                  </>
                ) : (
                  <>
                    <Save size={17} />
                    Create course
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
