import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { message, Spin, Button } from 'antd';
import apiClient from "../API/ApiClient";

export default function Home() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Fetch blog list
    useEffect(() => {
        const token = localStorage.getItem("token"); // Check for token
        if (!token) {
            navigate("/login"); // If no token, redirect to login
            return;
        }

        const fetchBlogs = async () => {
            try {
                const response = await apiClient.get("/blog/list/", {
                    headers: {
                        "Authorization": `Bearer ${JSON.parse(token).access}`, // Pass token in headers
                    },
                });
                if (response?.data) {
                    setBlogs(response.data); // Set blog list
                }
            } catch (error) {
                console.error("Error fetching blogs:", error);
                message.error("An error occurred while loading blogs.");
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, [navigate]);

    // Handle blog click for viewing details
    const handleBlogClick = (blogId) => {
        navigate(`/blog/${blogId}`);
    };

    // Handle creating a new blog
    const handleCreateBlog = () => {
        navigate("/create-blog");
    };

    // Handle deleting a blog
    const handleDeleteBlog = async (blogId) => {
        const token = localStorage.getItem("token");
        try {
            const response = await apiClient.delete(`/blog/category/delete/${blogId}`, {
                headers: {
                    "Authorization": `Bearer ${JSON.parse(token).access}`,
                },
            });

            if (response?.data) {
                message.success("Blog successfully deleted!");
                // Update state directly after deletion
                setBlogs(blogs.filter((blog) => blog.id !== blogId)); // Remove deleted blog
            }
        } catch (error) {
            console.error("Error deleting blog:", error);
            message.error("An error occurred while deleting the blog.", 3);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className="container dark:text-white text-black">
            <h1 className="!text-center !text-3xl mt-5 mb-5 font-medium">Blogs</h1>
            
            {/* Button to create a new blog */}
            <Button 
                className="mb-4" 
                type="primary" 
                onClick={handleCreateBlog}
            >
                Yangi blog qo'shish
            </Button>
            
            <div className="grid gap-4 lg:grid-cols-2">
                {blogs.length === 0 && !loading ? (
                    <p className="text-center text-lg">Bloglar topilmadi. Iltimos, keyinroq qaytib keling.</p>
                ) : (
                    blogs.map((blog) => (
                        <div
                            key={blog.id}
                            className="flex shadow-lg gap-4 bg-gray-100 cursor-pointer hover:bg-gray-200 duration-150 border border-zinc-600 p-2 rounded-md dark:bg-gray-600 dark:hover:bg-gray-500"
                            onClick={() => handleBlogClick(blog.id)}
                        >
                            {blog?.image && (
                                <img className="w-[200px] h-[130px]" src={blog.image} alt={blog.title} />
                            )}
                            <div>
                                <p className="font-bold ">{blog?.title}</p>
                                <p className="dark:text-white">{blog?.description}</p>
                                <p className="text-gray-500 dark:text-gray-300">{blog?.date_created}</p>

                                {/* Delete button */}
                                <Button 
                                    type="danger" 
                                    size="small" 
                                    onClick={(e) => {
                                        e.stopPropagation(); // Prevent blog click event from firing
                                        handleDeleteBlog(blog.id);
                                    }}
                                    className="mt-2 !bg-red-500 !text-white"
                                >
                                    O'chirish
                                </Button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
