import React, { useState, useEffect } from "react";
import { message, Select, Spin } from "antd";
import apiClient from "../API/ApiClient";
import { useNavigate } from "react-router-dom";

export default function CreateBlog({ onBlogCreated }) {
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState(null);
    const [categories, setCategories] = useState([]);
    const [description, setDescription] = useState("");
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await apiClient.get("/blog/category/");
                setCategories(response.data);
            } catch (error) {
                console.error("Kategoriyalarni olishda xatolik:", error);
                message.error("Kategoriyalarni yuklab bo‘lmadi!");
            }
        };

        fetchCategories();
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
        }
    };

    async function handleSumbit2(e) {
        e.preventDefault(); // ✅ Funksiya boshida bo‘lishi kerak

        try {
            if (!title || !description || !image || !category) {
                message.error("Barcha maydonlarni to'ldiring!");
                return;
            }

            const formData = new FormData();
            formData.append("title", title);
            formData.append("category", category);
            formData.append("description", description);
            formData.append("image", image);

            setLoading(true);

            const response = await apiClient.post("/blog/create/", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            console.log("✅ Blog yaratildi:", response.data);

            if (response?.data) {
                message.success("Blog muvaffaqiyatli yaratildi!");
                if (onBlogCreated) {
                    onBlogCreated(response.data);
                }
                navigate("/");
            }
        } catch (error) {
            console.error("❌ Xatolik (POST blog yaratish):", error);
            message.error("Blog yaratishda xato yuz berdi.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="container p-5 bg-white shadow rounded">
            <h1 className="text-2xl font-bold text-center mb-4">Yangi Blog Qo‘shish</h1>

            <form className="space-y-4" onSubmit={handleSumbit2}>
                <input
                    type="text"
                    placeholder="Blog nomi"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                />

                <textarea
                    placeholder="Blog tavsifi"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                />

                <Select
                    placeholder="Kategoriya tanlang"
                    value={category}
                    onChange={(value) => setCategory(value)}
                    className="w-full"
                    required
                >
                    {categories.map((cat) => (
                        <Select.Option key={cat.id} value={cat.id}>
                            {cat.name}
                        </Select.Option>
                    ))}
                </Select>

                <input
                    type="file"
                    onChange={handleImageChange}
                    className="w-full"
                    required
                />

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
