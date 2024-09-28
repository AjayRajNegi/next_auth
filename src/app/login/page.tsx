"use client";
import axios from "axios";
import Link from "next/link";
import { toast } from "react-hot-toast";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function loginPage() {
  const router = useRouter();

  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [disabledButton, setDisabledButton] = useState(false);
  const [loading, setLoading] = useState(false);

  const onLoginUp = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/users/login", user);
      router.push("/profile");

      useEffect(() => {
        if (user.email.length > 0 && user.password.length > 0) {
          setDisabledButton(true);
        } else {
          setDisabledButton(true);
        }
      }, [user]);
    } catch (error: any) {
      toast.error(error.message);
      return console.log("SignUp failed.");
    }
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1>{loading ? "Processing" : "Signup"}</h1>
      <hr />
      <label htmlFor="email">email</label>
      <input
        className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
        id="email"
        type="text"
        value={user.email}
        onChange={(e) => setUser({ ...user, email: e.target.value })}
        placeholder="email"
      />
      <label htmlFor="password">password</label>
      <input
        className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
        id="password"
        type="password"
        value={user.password}
        onChange={(e) => setUser({ ...user, password: e.target.value })}
        placeholder="password"
      />
      <button
        onClick={onLoginUp}
        className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600"
      >
        {disabledButton ? "No login" : "Login"}
      </button>
      <Link href="/signup">Visit signUp page</Link>
    </div>
  );
}
