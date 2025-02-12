import React, { useEffect, useState } from "react";
import { message, Spin, Button } from "antd";
import { useNavigate } from "react-router-dom";
import apiClient from "../API/ApiClient"; // Assuming apiClient is properly configured

export default function MyBlogs() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Fetching blogs that belong to the logged-in user
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login"); // If there's no token, navigate to the login page
            return;
        }

        const fetchMyBlogs = async () => {
            try {
                const response = await apiClient.get("/blog/my-blogs/", {
                    headers: {
                        "Authorization": `Bearer ${JSON.parse(token).access}`,
                    },
                });

                if (response?.data) {
                    setBlogs(response.data); 
                }
            } catch (error) {
                console.error("Error fetching user's blogs:", error);
                message.error("Error loading your blogs.");
            } finally {
                setLoading(false);
            }
        };

        fetchMyBlogs();
    }, [navigate]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className="container">
            <h1 className="!text-center !text-3xl mt-5 mb-5 font-medium">My Blogs</h1>

            <div className="grid gap-4 lg:grid-cols-2">
                {blogs.length === 0 ? (
                    <p className="text-center text-lg">You don't have any blogs yet.</p>
                ) : (
                    blogs.map((blog) => (
                        <div
                            key={blog.id}
                            className="flex shadow-lg gap-4  cursor-pointer hover:bg-gray-200 duration-150 border border-zinc-400 p-2 rounded-md dark:hover:bg-gray-800"
                        >
                            {blog?.image && (
                                <img className="w-[200px] h-[130px]" src={blog.image} alt={blog.title} />
                            )}
                            <div>
                                <p className="font-bold">{blog?.title}</p>
                                <p>{blog?.description}</p>
                                <p className="text-gray-500">{blog?.date_created}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
