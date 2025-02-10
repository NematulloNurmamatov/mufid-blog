import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import apiClient from "../API/ApiClient";

export default function BlogDetail() {
    const { id } = useParams();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchBlogDetail = async () => {
            try {
                const response = await apiClient.get(`/blog/retrieve/${id}/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response?.data) {
                    setBlog(response.data);
                }
            } catch (error) {
                console.error("Xatolik (GET blog tafsilotlari):", error);
            }
        };

        const fetchComments = async () => {
            try {
                const response = await apiClient.get(`/blog/comment/list?blog_id=${id}`);
                if (response?.data) {
                    setComments(response.data);
                    console.log("Fetched comments:", response.data);
                }
            } catch (error) {
                console.error("Xatolik (GET comments):", error);
            }
        };

        if (token) {
            Promise.all([fetchBlogDetail(), fetchComments()])
                .finally(() => setLoading(false));
        } else {
            console.error("Token topilmadi, iltimos login qiling!");
            setLoading(false);
        }
    }, [id, token]);

    const handleCommentSubmit = async (e) => {
        e.preventDefault();

        if (!newComment.trim()) {
            return;
        }

        try {
            const response = await apiClient.post(
                "/blog/comment/post/",
                {
                    blog: id,
                    content: newComment,
                    description: newComment,

                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response?.data) {
                setComments((prevComments) => [response.data, ...prevComments]);
                setNewComment("");
            }
        } catch (error) {
            console.error("Xatolik (POST comment):", error.response?.data);
        }
    };


    if (loading) {
        return <div>Loading...</div>;
    }

    if (!blog) {
        return <div>Xatolik: Blog topilmadi!</div>;
    }

    return (
        <div className="container pb-10">
            <div className="flex justify-between mx-auto p-5 max-[570px]:flex-col-reverse gap-2">
                <div className="flex items-end gap-4 max-[870px]:flex-col max-[870px]:items-start">
                    {blog.image && (
                        <img className="w-[300px] max-w-[600px] mt-4" src={blog.image} alt={blog.title} />
                    )}
                    <div>

                        <h1 className="text-3xl font-bold mt-2">{blog.title}</h1>
                        <p className="mt-4">
                            <span className="font-bold">Tavsifi: </span>
                            {blog.description}
                        </p>
                        <p className="text-gray-500">
                            <span className="font-bold text-blackv dark:text-white">Yaratilgan sana: </span>
                            {blog.date_created}
                        </p>
                    </div>
                </div>

                <div>
                    <h2 className="text-xl font-bold">Yaratuvchisi</h2>
                    <img className="w-30 rounded-2xl" src={blog.owner.avatar} alt={blog.title} />
                    <p>
                        <span className="font-black mt-2">Name: </span>{blog.owner.full_name}
                    </p>
                    <p>
                        <span className="font-black">ID: </span>{blog.owner.id}
                    </p>
                </div>
            </div>

            {/* Kommentlar bo'limi */}
            <div className="mt-8">
                <h2 className="text-2xl font-bold">Comments</h2>

                <div className="mt-4">
                    {comments.length === 0 ? (
                        <p>No comments yet.</p>
                    ) : (
                        comments.map((comment) => (
                            <div key={comment.id} className="mt-4 border border-gray-400
                            bg-gray-300 p-4 rounded-md dark:bg-gray-700 dark:border-amber-400">
                                <p><span className="font-bold">{comment.user?.full_name || "Anonymous"}</span></p>
                                <p>{comment?.description}</p>
                                <p className="text-gray-900 text-sm dark:text-gray-300">{comment.date_created}</p>
                            </div>
                        ))
                    )}
                </div>

                {/* Yangi komment qo'shish */}
                <div className="mt-6">
                    <h3 className="text-lg font-bold">Add a Comment</h3>
                    <form onSubmit={handleCommentSubmit}>
                        <textarea
                            className="w-full p-2 border rounded-md mt-2 bg-white dark:border-amber-400 dark:bg-gray-600"
                            rows="4"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Write your comment..."
                        />
                        <button
                            type="submit"
                            className="mt-2 px-4 py-2 !bg-blue-500 text-white rounded-md"
                        >
                            Submit Comment
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
