"use client";
import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, Bike, Loader2, User, UserCog } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const EditRoleMobile = () => {
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState([
    { id: "admin", label: "Admin", icon: UserCog },
    { id: "user", label: "User", icon: User },
    { id: "deliveryBoy", label: "Delivery Boy", icon: Bike },
  ]);
  const [selectedRole, setSelectedrole] = useState("");
  const [mobile, setMobile] = useState("");
  const router = useRouter();
  const { update } = useSession();
  const handleEdit = async () => {
    setLoading(true);
    try {
      const result = await axios.post("/api/user/edit-role-mobile", {
        role: selectedRole,
        mobile,
      });
      await update({ role: selectedRole });
      setLoading(false);
      router.push("/");
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkForAdmin = async () => {
      try {
        const result = await axios.get("/api/check-for-admin");
        if(result.data.adminExist){
          setRole(prev=>prev.filter(r=>r.id!=="admin"))
        }
      } catch (error) {
        console.log(error);
      }
    };
    checkForAdmin();
  }, []);

  return (
    <div className="flex flex-col items-center min-h-screen p-6 w-full">
      <motion.h1
        initial={{
          opacity: 0,
          y: -20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.6,
        }}
        className="text-3xl md:text-4xl font-extrabold text-green-700 text-center mt-8"
      >
        Select Your Role
      </motion.h1>
      <div className="flex flex-col md:flex-row justify-center items-center gap-6 mt-10">
        {role.map((role) => {
          const Icon = role.icon;
          const isSelected = selectedRole == role.id;
          return (
            <motion.div
              key={role.id}
              whileTap={{
                scale: 0.9,
              }}
              onClick={() => setSelectedrole(role.id)}
              className={`flex flex-col items-center justify-center w-48 h-44 rounded-2xl border-4 transition-all 
                  ${
                    isSelected
                      ? "border-green-600 bg-green-100 shadow-lg"
                      : "border-gray-300 bg-white hover:border-green-400"
                  }`}
            >
              <Icon />
              <span>{role.label}</span>
            </motion.div>
          );
        })}
      </div>
      <motion.div
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          duration: 0.6,
          delay: 0.7,
        }}
        className="flex flex-col items-center mt-10"
      >
        <label htmlFor="mobile" className="text-gray700 font-medium mb-2">
          Enter Your Mobile No.
        </label>
        <input
          type="number"
          id="mobile"
          placeholder="eg. 7778889990"
          maxLength={10}
          className="w-64 md:w-80 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none text-gray-800"
          onChange={(e) => setMobile(e.target.value)}
        />
      </motion.div>
      <motion.button
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.6,
          delay: 0.7,
        }}
        disabled={mobile.length != 10 || !selectedRole}
        className={`w-[200px] mt-10 inline-flex items-center justify-center gap-2 font-semibold py-3 px-8 rounded-2xl shadow-md transition-all duration-200 ${
          selectedRole && mobile.length === 10
            ? "bg-green-600 hover:bg-green-700 text-white"
            : "bg-gray-300 text-gray-500 cursor-not allowed"
        }`}
        onClick={() => handleEdit()}
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Go To Home"}
        {loading ? "" : <ArrowRight />}
      </motion.button>
    </div>
  );
};

export default EditRoleMobile;
