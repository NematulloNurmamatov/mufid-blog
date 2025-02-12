import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { message, Spin, Button } from 'antd';
import apiClient from "../API/ApiClient";

export default function Home() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token"); 
        if (!token) {
            navigate("/login");
            return;
        }

        const fetchBlogs = async () => {
            try {
                const response = await apiClient.get("/blog/list/", {
                    headers: {
                        "Authorization": `Bearer ${JSON.parse(token).access}`,
                    },
                });
                if (response?.data) {
                    setBlogs(response.data); 
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

    const handleBlogClick = (blogId) => {
        navigate(`/blog/${blogId}`);
    };

    const handleCreateBlog = () => {
        navigate("/create-blog");
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

                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
