import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "tailwindcss/tailwind.css";
import eera from "./assests/eera.png";
import Modal from "react-modal";

const RegisterPage = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            //http://localhost:8000
            //https://api.epublicnotices.in
            await axios.post("http://localhost:8000/admin/register", {
                full_name: username,
                email: email,
                password: password,
            });

            // Show modal on successful registration
            setIsModalOpen(true);
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Registration failed. Please try again."
            );
        }
    };

    const closeModalAndRedirect = () => {
        setIsModalOpen(false);
        navigate("/"); // Redirect to login
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

            {/* Modal */}
            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModalAndRedirect}
                className="fixed inset-0 flex items-center justify-center p-4"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50"
            >
                <div className="bg-white rounded-lg p-6 shadow-lg text-center max-w-md w-full">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                        Registration Successful
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Your registration is complete. Please log in to continue.
                    </p>
                    <button
                        onClick={closeModalAndRedirect}
                        className="w-full py-3 px-4 text-sm tracking-wide rounded-lg text-white bg-blue-600 hover:bg-blue-700"
                    >
                        Login
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default RegisterPage;
