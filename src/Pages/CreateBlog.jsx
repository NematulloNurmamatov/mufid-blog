import React, { useState } from "react";
import { message, Select, Spin } from "antd";
import apiClient from "../API/ApiClient";
import { useNavigate } from "react-router-dom";

export default function CreateBlog() {
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState(null); // Updated to null to ensure category selection
    const [description, setDescription] = useState("");
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title || !description || !image || !category) {
            message.error("Barcha maydonlarni to'ldirishingiz kerak.");
            return;
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("category", category);
        formData.append("description", description);
        formData.append("image", image);

        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const response = await apiClient.post("/blog/create/", formData, {
                headers: {
                    "Authorization": `Bearer ${JSON.parse(token).access}`,
                    "Content-Type": "multipart/form-data", // Ensure the correct content type
                },
            });

            if (response?.data) {
                message.success("Blog muvaffaqiyatli yaratildi!");
                navigate("/"); // Redirect to the home page after successful creation
            }
        } catch (error) {
            console.error("Xatolik (POST blog yaratish):", error);
            message.error("Blog yaratishda xato yuz berdi.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <h1 className="text-3xl font-bold text-center mt-5">Yangi Blog Qo'shish</h1>

            <form onSubmit={handleSubmit} className="mt-6">
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Blog nomi"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                <div className="mb-4">
                    <textarea
                        placeholder="Blog tavsifi"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                <div className="mb-4">
                    <Select
                        placeholder="Kategoriya tanlang"
                        value={category}
                        onChange={(value) => setCategory(value)}
                        className="w-full"
                        required
                    >
                        <Select.Option value={1}>Kategoriya 1</Select.Option>
                        <Select.Option value={2}>Kategoriya 2</Select.Option>
                        <Select.Option value={3}>Kategoriya 3</Select.Option>
                    </Select>
                </div>

                <div className="mb-4">
                    <input
                        type="file"
                        onChange={handleImageChange}
                        className="w-full"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white p-2 rounded"
                    disabled={loading}
                >
                    {loading ? <Spin /> : "Blogni yaratish"}
                </button>
            </form>
        </div>
    );
}
