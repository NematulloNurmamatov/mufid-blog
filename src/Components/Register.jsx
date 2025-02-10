import React, { useState } from "react";
import { Button, Input, Form, Upload, message } from "antd";
import { useNavigate } from "react-router-dom";
import apiClient from "../API/ApiClient";
import { UploadOutlined } from "@ant-design/icons";

export default function Register() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [file, setFile] = useState(null);
    const navigate = useNavigate();

    const handleRegister = async (values) => {
        setLoading(true);
        setError("");

        const cleanedPhoneNumber = values.phone_number.replace(/[^0-9+]/g, "");

        if (values.password !== values.password2) {
            setError("Parollar mos kelmadi!");
            setLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append("full_name", values.full_name);
        formData.append("phone_number", cleanedPhoneNumber);
        formData.append("password", values.password);
        formData.append("password2", values.password2);

        if (file) {
            formData.append("avatar", file);
        }

        try {
            const response = await apiClient.post("/account/register/", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            message.success("Ro'yxatdan o'tish muvaffaqiyatli!");
            navigate("/login");
        } catch (err) {
            console.error("Xatolik:", err);

            if (err.response?.data?.detail) {
                setError(err.response.data.detail);
            } else {
                setError("Server yoki tarmoq xatosi yuz berdi.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container  !max-w-[500px] mx-auto p-6 bg-gray-400 !mt-10 shadow-lg rounded-lg">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Ro'yxatdan o'tish</h1>

            <Form layout="vertical" onFinish={handleRegister}>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}

                <Form.Item
                    label="Ism"
                    name="full_name"
                    rules={[{ required: true, message: "Ismingizni kiriting!" }]}
                >
                    <Input className="border border-gray-300 rounded-md p-3" />
                </Form.Item>

                <Form.Item
                    label="Telefon raqam"
                    name="phone_number"
                    rules={[
                        { required: true, message: "Telefon raqamingizni kiriting!" },
                        { pattern: /^[0-9+]+$/, message: "Faqat raqamlar va '+' bo‘lishi mumkin!" }
                    ]}
                >
                    <Input className="border border-gray-300 rounded-md p-3" />
                </Form.Item>

                <Form.Item
                    label="Parol"
                    name="password"
                    rules={[
                        { required: true, message: "Parol kiriting!" },
                        { min: 6, message: "Parol kamida 6 ta belgidan iborat bo‘lishi kerak!" }
                    ]}
                >
                    <Input.Password className="border border-gray-300 rounded-md p-3" />
                </Form.Item>

                <Form.Item
                    label="Parolni tasdiqlang"
                    name="password2"
                    dependencies={["password"]}
                    rules={[
                        { required: true, message: "Parolni tasdiqlang!" },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue("password") === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error("Parollar mos kelmadi!"));
                            },
                        }),
                    ]}
                >
                    <Input.Password className="border border-gray-300 rounded-md p-3" />
                </Form.Item>

                {/* ✅ Rasm yuklash */}
                <Form.Item label="Profil rasmi">
                    <Upload
                        beforeUpload={(file) => {
                            setFile(file);
                            return false;  
                        }}
                        maxCount={1}
                        accept="image/*"
                    >
                        <Button icon={<UploadOutlined />}>Fayl tanlang</Button>
                    </Upload>
                    {file && <p className="mt-2 text-green-600">{file.name}</p>}
                </Form.Item>

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        className="w-full py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700"
                    >
                        Ro'yxatdan o'tish
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}
