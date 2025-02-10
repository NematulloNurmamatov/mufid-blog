import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "antd";
import "../index.css";

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);
    const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem("theme") === "dark");
    const navigate = useNavigate();

    useEffect(() => {
        // Update theme on page load based on localStorage preference
        document.body.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');

        // Save theme preference to localStorage
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    }, [isDarkMode]);

    const logoutHandle = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        navigate("/login");
    };

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
    };

    return (
        <div className="bg-gray-800 sticky top-0 z-10">
            <nav className="container text-white p-4 flex justify-between items-center relative">
                <h1 className="text-2xl font-bold">Mufid</h1>

                {/* Mobile Menu Toggle */}
                <button className="lg:hidden z-50" onClick={() => setMenuOpen(!menuOpen)}>
                    {menuOpen ? <X size={30} /> : <Menu size={30} />}
                </button>

                {/* Desktop Menu */}
                <ul className="hidden lg:flex gap-6 items-center">
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/my-blogs">My Blogs</Link></li>
                    <li><Link to="/contact">Contact</Link></li>

                    {user ? (
                        <>
                            <li>
                                <Link className="flex items-center gap-2" to="/my-profile">
                                    {user.avatar ? (
                                        <img src={user.avatar} alt="Avatar" className="w-8 h-8 rounded-full" />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-gray-400"></div>
                                    )}
                                    <span>{user.full_name}</span>
                                </Link>
                            </li>
                            <li>
                                <Button type="primary" onClick={logoutHandle}>Chiqish</Button>
                            </li>
                        </>
                    ) : (
                        <li>
                            <Button type="primary" onClick={() => navigate("/login")}>Sign In</Button>
                        </li>
                    )}
                </ul>

                {/* Mobile Menu */}
                {menuOpen && (
                    <div className="fixed top-0 left-0  w-full h-[40vh] bg-gray-900 bg-opacity-70 flex flex-col items-center justify-center gap-6 text-xl z-40">
                        {/* <button className="absolute top-5 right-5" onClick={() => setMenuOpen(false)}>
                            <X size={30} />
                        </button> */}
                        <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
                        <Link to="/my-blogs" onClick={() => setMenuOpen(false)}>My Blogs</Link>
                        <Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>

                        {user ? (
                            <>
                                <Link to="/my-profile" className="flex items-center gap-3" onClick={() => setMenuOpen(false)}>
                                    {user.avatar ? (
                                        <img src={user.avatar} alt="Avatar" className="w-10 h-10 rounded-full" />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-gray-400"></div>
                                    )}
                                    <span>{user.full_name}</span>
                                </Link>
                                <Button type="primary" onClick={() => { logoutHandle(); setMenuOpen(false); }}>Chiqish</Button>
                            </>
                        ) : (
                            <Button type="primary" onClick={() => { navigate("/login"); setMenuOpen(false); }}>Sign In</Button>
                        )}
                    </div>
                )}

                {/* Dark Mode Toggle Button (Positioned at top-right) */}
                <button
                    className="fixed top-4 right-4 p-1  text-white  z-50"
                    onClick={toggleDarkMode}
                >
                    {isDarkMode ? "🌙" : "🌞"}
                </button>
            </nav>
        </div>
    );
}
