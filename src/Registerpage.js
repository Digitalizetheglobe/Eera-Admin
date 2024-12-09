import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "tailwindcss/tailwind.css";
import eera from "./assests/eera.png";

const RegisterPage = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post(
                "http://api.epublicnotices.in/admin/register",
                {
                    full_name: username,
                    email: email,
                    password: password,
                }
            );

            // Handle success
            console.log("Registration successful:", response.data);
            toast.success("Registration successful!");
            navigate("/"); // Redirect to homepage
        } catch (error) {
            // Handle error
            console.error("Registration failed:", error.response?.data || error);
            toast.error(
                error.response?.data?.message || "Registration failed. Please try again."
            );
        }
    };

    return (
        <div className="font-[sans-serif]" style={{ backgroundColor: "white" }}>
            <ToastContainer />
            <div className="min-h-screen flex flex-col items-center justify-center py-6 px-4">
                <div className="grid md:grid-cols-2 items-center gap-4 max-w-6xl w-full">
                    <div className="border border-gray-300 rounded-lg p-6 max-w-md shadow-[0_2px_22px_-4px_rgba(93,96,127,0.2)] max-md:mx-auto">
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div className="mb-8">
                                <img
                                    src={eera}
                                    alt="Description"
                                    style={{
                                        width: "200px",
                                        height: "200px",
                                        borderRadius: "50%",
                                        marginLeft: "25%",
                                        marginBottom: "17px",
                                    }}
                                />
                                <h3 className="text-gray-800 text-3xl font-extrabold">Register</h3>
                            </div>

                            <div>
                                <label className="text-gray-800 text-sm mb-2 block">User Name</label>
                                <input
                                    name="username"
                                    type="text"
                                    required
                                    className="w-full text-sm text-gray-800 border border-gray-300 px-4 py-3 rounded-lg outline-blue-600"
                                    placeholder="Enter user name"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="text-gray-800 text-sm mb-2 block">Email</label>
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    className="w-full text-sm text-gray-800 border border-gray-300 px-4 py-3 rounded-lg outline-blue-600"
                                    placeholder="Enter email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="text-gray-800 text-sm mb-2 block">Password</label>
                                <input
                                    name="password"
                                    type="password"
                                    required
                                    className="w-full text-sm text-gray-800 border border-gray-300 px-4 py-3 rounded-lg outline-blue-600"
                                    placeholder="Enter password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        id="remember-me"
                                        name="remember-me"
                                        type="checkbox"
                                        className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                                    />
                                    <label
                                        htmlFor="remember-me"
                                        className="ml-2 text-sm text-gray-800"
                                    >
                                        Remember me
                                    </label>
                                </div>
                                {/* <div className="text-sm">
                                    <a
                                        href="#"
                                        className="text-blue-600 hover:underline font-semibold"
                                    >
                                        Forgot your password?
                                    </a>
                                </div> */}
                            </div>

                            <div className="mt-8">
                                <button
                                    type="submit"
                                    className="w-full py-3 px-4 text-sm tracking-wide rounded-lg text-white bg-blue-600 hover:bg-blue-700"
                                >
                                    Register
                                </button>
                            </div>

                            <p className="text-sm mt-8 text-center text-gray-800">
                                Already have an account?{" "}
                                <Link
                                    to="/"
                                    className="text-blue-600 font-semibold hover:underline ml-1"
                                >
                                    Log in here
                                </Link>
                            </p>
                        </form>
                    </div>
                    <div className="lg:h-[400px] md:h-[300px] max-md:mt-8">
                        <img
                            src="https://readymadeui.com/login-image.webp"
                            className="w-full h-full max-md:w-4/5 mx-auto object-cover"
                            alt="Login Illustration"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
