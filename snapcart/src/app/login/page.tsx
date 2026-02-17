"use client";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Leaf,
  Loader2,
  Lock,
  LogIn,
  Mail,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import { button } from "motion/react-client";
import Image from "next/image";
import React, { FormEvent, useState } from "react";
import googleImage from "@/assets/googleImage.png";
import axios from "axios";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const session = useSession();

  console.log(session);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn("credentials", {
        email,
        password,
        redirect:false
      });
      router.push("/")
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen px-6 py-10
    bg-white relative"
    >
      <motion.h1
        initial={{
          y: -10,
          opacity: 0,
        }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        transition={{
          duration: 0.6,
        }}
        className="text-4xl font-extrabold text-green-700 mb-2"
      >
        Welcome Back
      </motion.h1>
      <motion.p
        initial={{
          y: -10,
          opacity: 0,
        }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        transition={{
          duration: 0.6,
        }}
        className="text-gray-800 mb-8 flex items-center gap-2"
      >
        Login To SnapCart
        <Leaf className="w-5 h-5 text-green-600" />
      </motion.p>
      <motion.form
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          duration: 0.7,
        }}
        className="flex flex-col gap-5 w-full max-w-sm"
        onSubmit={handleLogin}
      >
        <div className="relative">
          <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
          <input
            type="email"
            placeholder="Enter Your Email"
            className="w-full border border-gray-300 rounded-xl py-3 pl-10 pr-4 text-gray-800 focus:ring-2 focus:ring-green-500 focus:outline-none"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter Your Password"
            className="w-full border border-gray-300 rounded-xl py-3 pl-10 pr-4 text-gray-800 focus:ring-2 focus:ring-green-500 focus:outline-none"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
          {!showPassword ? (
            <Eye
              className="absolute top-3.5 right-3 w-5 h-5 text-gray-500"
              onClick={() => setShowPassword(true)}
            />
          ) : (
            <EyeOff
              className="absolute top-3.5 right-3 w-5 h-5 text-gray-500"
              onClick={() => setShowPassword(false)}
            />
          )}
        </div>
        {(() => {
          const formValidation = email !== "" && password !== "";

          return (
            <button
              disabled={!formValidation || loading}
              className={`w-full font-semibold py-3 rounded-xl transition-all duration-200 shadow-md inline-flex items-center justify-center gap-2 ${
                formValidation
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Login"}
            </button>
          );
        })()}

        <div className="flex items-center gap-2 text-gray-500 text-sm mt-2">
          <span className="flex-1 h-px bg-gray-300"></span>
          OR
          <span className="flex-1 h-px bg-gray-300"></span>
        </div>
        <div
          className="w-full flex items-center justify-center gap-3 border border-gray-300 hover:bg-gray-100 py-3 rounded-xl text-gray-700 font-medium transition-all duration-200 cursor-pointer"
          onClick={() => signIn("google", { callbackUrl: "/" })}
        >
          <Image src={googleImage} width={20} height={20} alt="google" />
          Continue With Google
        </div>
      </motion.form>
      <motion.p
        initial={{
          y: 10,
          opacity: 0,
        }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        transition={{
          duration: 0.6,
        }}
        className="text-gray-600 mt-6 text-sm flex items-center gap-1 cursor-pointer"
        onClick={() => router.push("/register")}
      >
        Want to an account ?<LogIn className="w-4 h-4" />{" "}
        <span className="text-green-700 text-md">Sign up</span>
      </motion.p>
    </div>
  );
};

export default Login;
