
"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import {
  ArrowLeft,
  Loader2,
  Save,
  Upload,
  Image as ImageIcon,
} from "lucide-react";

// ==========================================
// API CONFIGURATION
// ==========================================

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://database-dlearning.onrender.com";

const API_URL = API_BASE.replace(/\/+$/, "").endsWith("/api")
  ? API_BASE.replace(/\/+$/, "")
  : `${API_BASE.replace(/\/+$/, "")}/api`;

// ==========================================
// TYPES
// ==========================================

type EditCourseFormProps = {
  courseId: string;
};

type Course = {
  _id: string;
  title: string;
  description?: string;
  category?: string;
  level?: string;
  duration?: string;
  image?: string;
};

type ApiResponse<T> = {
  success?: boolean;
  message?: string;
  data?: T;
};

// ==========================================
// COMPONENT
// ==========================================

export default function EditCourseForm({
  courseId,
}: EditCourseFormProps) {
  const router = useRouter();

  // ==========================================
  // STATES
  // ==========================================

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("Beginner");
  const [duration, setDuration] = useState("");

  const [image, setImage] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  // ==========================================
  // FETCH COURSE
  // ==========================================

  useEffect(() => {
    if (!courseId) {
      setError("Course ID is missing.");
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    const fetchCourse = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        if (!token) {
          router.replace("/");
          return;
        }

        const response = await fetch(
          `${API_URL}/courses/edit/${encodeURIComponent(courseId)}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            cache: "no-store",
            signal: controller.signal,
          }
        );

        const data: ApiResponse<Course> = await response.json();

        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          router.replace("/");
          return;
        }

        if (!response.ok || data.success === false) {
          throw new Error(
            data.message || "Could not load course."
          );
        }

        const course = data.data;

        if (!course) {
          throw new Error("Course information was not found.");
        }

        setTitle(course.title || "");
        setDescription(course.description || "");
        setCategory(course.category || "");
        setLevel(course.level || "Beginner");
        setDuration(course.duration || "");
        setImage(course.image || "");
        setImagePreview(course.image || "");

      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }

        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    void fetchCourse();

    return () => controller.abort();
  }, [courseId, router]);

  // ==========================================
  // HANDLE IMAGE SELECTION
  // ==========================================

  const handleImageChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image.");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image must not exceed 5MB.");
      e.target.value = "";
      return;
    }

    setError("");
    setSelectedImage(file);

    const preview = URL.createObjectURL(file);
    setImagePreview(preview);
  };

  // ==========================================
  // CLEAN UP IMAGE PREVIEW
  // ==========================================

  useEffect(() => {
    if (!selectedImage || !imagePreview.startsWith("blob:")) {
      return;
    }

    return () => {
      URL.revokeObjectURL(imagePreview);
    };
  }, [selectedImage, imagePreview]);

  // ==========================================
  // UPDATE COURSE
  // ==========================================

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      setError("Please provide a course title and description.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const token = localStorage.getItem("token");

      if (!token) {
        router.replace("/");
        return;
      }

      const formData = new FormData();

      formData.append("title", title.trim());
      formData.append("description", description.trim());
      formData.append("category", category.trim());
      formData.append("level", level);
      formData.append("duration", duration.trim());

      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      const response = await fetch(
        `${API_URL}/courses/${encodeURIComponent(courseId)}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data: ApiResponse<Course> = await response.json();

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.replace("/");
        return;
      }

      if (!response.ok || data.success === false) {
        throw new Error(
          data.message || "Course update failed."
        );
      }

      setSuccess("Course updated successfully!");

      setTimeout(() => {
        router.push("/instructor/courses");
        router.refresh();
      }, 1000);

    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="flex min-h-80 items-center justify-center">
        <div className="text-center">
          <Loader2
            className="mx-auto animate-spin text-[#0A66EC]"
            size={35}
          />

          <p className="mt-3 text-sm text-slate-500">
            Loading course information...
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="mx-auto max-w-3xl p-5 sm:p-8">

      <Link
        href="/instructor/courses"
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[#0A66EC] hover:underline"
      >
        <ArrowLeft size={17} />
        Back to Courses
      </Link>

      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">

        {/* HEADER */}

        <div className="mb-7">
          <h1 className="text-xl font-extrabold text-slate-900">
            Edit Course
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Update your course information and learning materials.
          </p>
        </div>

        {/* ERROR */}

        {error && (
          <div className="mb-5 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* SUCCESS */}

        {success && (
          <div className="mb-5 rounded-xl border border-green-100 bg-green-50 p-4 text-sm text-green-700">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* COURSE IMAGE */}

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Course Thumbnail
            </label>

            <div className="overflow-hidden rounded-xl border border-dashed border-slate-300 bg-slate-50">

              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Course preview"
                  className="h-52 w-full object-cover"
                />
              ) : (
                <div className="flex h-52 flex-col items-center justify-center text-slate-400">
                  <ImageIcon size={40} />

                  <p className="mt-2 text-xs">
                    No course image selected
                  </p>
                </div>
              )}

              <label className="flex cursor-pointer items-center justify-center gap-2 border-t border-slate-200 bg-white p-4 text-sm font-bold text-[#0A66EC] hover:bg-blue-50">
                <Upload size={17} />
                Choose New Image

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>

            </div>

            <p className="mt-2 text-xs text-slate-400">
              Maximum image size: 5MB.
              {selectedImage && ` Selected: ${selectedImage.name}`}
            </p>
          </div>

          {/* TITLE */}

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Course Title
            </label>

            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter course title"
              className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none transition focus:border-[#0A66EC] focus:ring-2 focus:ring-blue-50"
            />
          </div>

          {/* DESCRIPTION */}

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Course Description
            </label>

            <textarea
              required
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what students will learn..."
              className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none transition focus:border-[#0A66EC] focus:ring-2 focus:ring-blue-50"
            />
          </div>

          {/* CATEGORY */}

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Category
            </label>

            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. Web Development"
              className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none transition focus:border-[#0A66EC] focus:ring-2 focus:ring-blue-50"
            />
          </div>

          {/* LEVEL */}

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Course Level
            </label>

            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-[#0A66EC]"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          {/* DURATION */}

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Course Duration
            </label>

            <input
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="e.g. 8 weeks"
              className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-[#0A66EC]"
            />
          </div>

          {/* SUBMIT */}

          <button
            type="submit"
            disabled={saving}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0A66EC] py-4 text-sm font-bold text-white transition hover:bg-[#185EC1] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Saving Changes...
              </>
            ) : (
              <>
                <Save size={18} />
                Save Course Changes
              </>
            )}
          </button>

        </form>
      </div>
    </div>
  );
}
