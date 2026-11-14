
// "use client";

// import { FormEvent, useState } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import { toast } from "react-hot-toast";
// import {
//   Eye,
//   EyeOff,
//   Mail,
//   Lock,
//   GraduationCap,
//   ArrowRight,
//   Loader2,
//   ShieldCheck,
// } from "lucide-react";

// const API_URL =
//   process.env.NEXT_PUBLIC_API_URL ||
//   "https://backend-dlearning.onrender.com/api";

// export default function InstructorLoginPage() {
//   const router = useRouter();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     if (!email.trim() || !password) {
//       toast.error("Please enter your email and password");
//       return;
//     }

//     try {
//       setLoading(true);

//       const response = await fetch(`${API_URL}/auth/login`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           email: email.trim().toLowerCase(),
//           password,
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok || !data.success) {
//         toast.error(data.message || "Login failed");
//         return;
//       }

//       // Only instructors can access this login portal
//       if (data.user?.role !== "instructor") {
//         toast.error(
//           "This account does not have instructor access."
//         );
//         return;
//       }

//       // Save authentication details
//       localStorage.setItem("token", data.token);
//       localStorage.setItem("user", JSON.stringify(data.user));

//       toast.success("Welcome back, instructor!");

//       router.replace("/instructor");
//     } catch (error) {
//       console.error("Instructor login error:", error);
//       toast.error(
//         "Unable to connect to the server. Please try again."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <main className="min-h-screen bg-[#F5F8FF] flex items-center justify-center px-4 py-10">
//       <div className="w-full max-w-6xl grid lg:grid-cols-2 bg-white rounded-3xl shadow-xl overflow-hidden">

//         {/* LEFT SIDE */}
//         <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-[#0A66EC] via-[#185EC1] to-[#123F91] p-12 text-white">
//           <div>
//             <Link
//               href="/"
//               className="inline-flex items-center gap-3"
//             >
//               <div className="bg-white rounded-xl p-2">
//                 <GraduationCap
//                   size={32}
//                   className="text-[#0A66EC]"
//                 />
//               </div>

//               <div>
//                 <h1 className="text-2xl font-extrabold tracking-wide">
//                   DECENT LEARNING
//                 </h1>
//                 <p className="text-blue-100 text-xs tracking-widest">
//                   ACCESS · LEARN · OWN
//                 </p>
//               </div>
//             </Link>

//             <div className="mt-24">
//               <span className="inline-flex items-center gap-2 bg-white/15 px-4 py-2 rounded-full text-sm">
//                 <ShieldCheck size={17} />
//                 Instructor Portal
//               </span>

//               <h2 className="text-4xl font-bold leading-tight mt-7">
//                 Teach skills.
//                 <br />
//                 Inspire learners.
//                 <br />
//                 Build the future.
//               </h2>

//               <p className="text-blue-100 leading-7 mt-6 max-w-md">
//                 Welcome to your instructor workspace.
//                 Manage your courses, organize lessons and
//                 help students grow their technology skills.
//               </p>
//             </div>
//           </div>

//           <p className="text-sm text-blue-100">
//             © {new Date().getFullYear()} Decent Learning.
//             All rights reserved.
//           </p>
//         </div>

//         {/* RIGHT SIDE */}
//         <div className="flex items-center justify-center p-6 sm:p-10 lg:p-14">
//           <div className="w-full max-w-md">

//             {/* MOBILE BRAND */}
//             <Link
//               href="/"
//               className="flex items-center gap-3 mb-12 lg:hidden"
//             >
//               <div className="bg-[#EAF2FF] p-2 rounded-xl">
//                 <GraduationCap
//                   size={30}
//                   className="text-[#0A66EC]"
//                 />
//               </div>

//               <div>
//                 <h1 className="text-xl font-extrabold text-[#185EC1]">
//                   DECENT LEARNING
//                 </h1>
//                 <p className="text-gray-500 text-xs tracking-widest">
//                   ACCESS · LEARN · OWN
//                 </p>
//               </div>
//             </Link>

//             <div className="mb-9">
//               <span className="inline-flex items-center gap-2 text-[#0A66EC] bg-[#EAF2FF] px-3 py-2 rounded-full text-xs font-semibold">
//                 <ShieldCheck size={15} />
//                 INSTRUCTOR ACCESS
//               </span>

//               <h2 className="text-3xl font-bold text-gray-900 mt-5">
//                 Welcome back!
//               </h2>

//               <p className="text-gray-500 mt-2 leading-6">
//                 Sign in to access your instructor dashboard
//                 and manage your learning programmes.
//               </p>
//             </div>

//             <form onSubmit={handleSubmit} className="space-y-6">

//               {/* EMAIL */}
//               <div>
//                 <label
//                   htmlFor="email"
//                   className="block text-sm font-semibold text-gray-700 mb-2"
//                 >
//                   Email Address
//                 </label>

//                 <div className="relative">
//                   <Mail
//                     size={19}
//                     className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
//                   />

//                   <input
//                     id="email"
//                     type="email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     placeholder="Enter your instructor email"
//                     autoComplete="username"
//                     required
//                     className="w-full h-14 pl-12 pr-4 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 outline-none transition focus:border-[#0A66EC] focus:ring-4 focus:ring-blue-100"
//                   />
//                 </div>
//               </div>

//               {/* PASSWORD */}
//               <div>
//                 <div className="flex justify-between items-center mb-2">
//                   <label
//                     htmlFor="password"
//                     className="text-sm font-semibold text-gray-700"
//                   >
//                     Password
//                   </label>
//                 </div>

//                 <div className="relative">
//                   <Lock
//                     size={19}
//                     className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
//                   />

//                   <input
//                     id="password"
//                     type={showPassword ? "text" : "password"}
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     placeholder="Enter your password"
//                     autoComplete="current-password"
//                     required
//                     className="w-full h-14 pl-12 pr-12 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 outline-none transition focus:border-[#0A66EC] focus:ring-4 focus:ring-blue-100"
//                   />

//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0A66EC]"
//                     aria-label={
//                       showPassword ? "Hide password" : "Show password"
//                     }
//                   >
//                     {showPassword ? (
//                       <EyeOff size={20} />
//                     ) : (
//                       <Eye size={20} />
//                     )}
//                   </button>
//                 </div>
//               </div>

//               {/* SUBMIT */}
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full h-14 rounded-xl bg-[#0A66EC] hover:bg-[#185EC1] text-white font-semibold flex items-center justify-center gap-3 transition shadow-lg shadow-blue-100 disabled:opacity-60 disabled:cursor-not-allowed"
//               >
//                 {loading ? (
//                   <>
//                     <Loader2 size={20} className="animate-spin" />
//                     Signing in...
//                   </>
//                 ) : (
//                   <>
//                     Sign In to Instructor Portal
//                     <ArrowRight size={19} />
//                   </>
//                 )}
//               </button>
//             </form>

//             <div className="mt-8 p-4 rounded-xl bg-[#F5F8FF] border border-blue-100">
//               <div className="flex items-start gap-3">
//                 <ShieldCheck
//                   size={20}
//                   className="text-[#0A66EC] mt-0.5"
//                 />
//                 <p className="text-xs text-gray-600 leading-5">
//                   This portal is exclusively for authorized
//                   Decent Learning instructors. Contact your
//                   administrator if you need an instructor account.
//                 </p>
//               </div>
//             </div>

//             <p className="text-center text-sm text-gray-500 mt-8">
//               Not an instructor?{" "}
//               <Link
//                 href="/login"
//                 className="font-semibold text-[#0A66EC] hover:underline"
//               >
//                 Student login
//               </Link>
//             </p>

//           </div>
//         </div>
//       </div>
//     </main>
//   );
// }
