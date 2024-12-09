import React, { useState } from "react";
import "tailwindcss/tailwind.css";
import eera from "./assests/eera.png";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();

    const loginData = { email, password };

    try {
      const response = await fetch("http://api.epublicnotices.in/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem("token", result.token);
        toast.success("Login successful!");
        navigate("/dashboard");
      } else {
        toast.error(result.error || "Login failed!");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="font-[sans-serif]" style={{ backgroundColor: "white" }}>
      <div className="min-h-screen flex items-center justify-center py-6 px-4">
        <div className="grid md:grid-cols-2 items-center gap-4 max-w-6xl w-full">
          <div className="border border-gray-300 rounded-lg p-6 max-w-md shadow-lg max-md:mx-auto">
            <form className="space-y-4" onSubmit={handleLogin}>
              <div className="mb-8 text-center">
                <img
                  src={eera}
                  alt="Logo"
                  style={{
                    width: "200px",
                    height: "200px",
                    borderRadius: "50%",
                    marginBottom: "17px",
                  }}
                />
                <h3 className="text-gray-800 text-3xl font-extrabold">
                  Welcome Back, Sign in
                </h3>
              </div>

              <div>
                <label className="text-gray-800 text-sm mb-2 block">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full text-sm text-gray-800 border border-gray-300 px-4 py-3 rounded-lg outline-blue-600"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label className="text-gray-800 text-sm mb-2 block">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full text-sm text-gray-800 border border-gray-300 px-4 py-3 rounded-lg outline-blue-600"
                  placeholder="Enter your password"
                />
              </div>

              <div className="!mt-8">
                <button
                  type="submit"
                  className="w-full shadow-xl py-3 px-4 text-sm tracking-wide rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                >
                  Log in
                </button>
              </div>
            </form>
            <p className="text-sm mt-8 text-center text-gray-800">
              I don't have an account{" "}
              <Link
                to="/registerpage"
                className="text-blue-600 font-semibold hover:underline ml-1 whitespace-nowrap"
              >
                Register here
              </Link>
            </p>
          </div>

          <div className="lg:h-[400px] md:h-[300px] max-md:mt-8">
            <img
              src="https://readymadeui.com/login-image.webp"
              className="w-full h-full max-md:w-4/5 mx-auto block object-cover"
              alt="Login Visual"
            />
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default LoginPage;
