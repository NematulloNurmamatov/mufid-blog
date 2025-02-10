import React, { useState } from "react";
import { Input, Button, Form, message } from "antd";
import { useNavigate } from "react-router-dom";
import apiClient from "../API/ApiClient";

export default function Login() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onFinish = async (values) => {
        setLoading(true);

        try {
            const response = await apiClient.post("/account/login/", {
                phone_number: values.phone_number,
                password: values.password,
            }, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const { data } = response.data;
            const { token } = data
            console.log(response);

            if (token.access && data) {
                // 🔹 Token va user ma'lumotlarini saqlaymiz
                localStorage.setItem("token", JSON.stringify(token));
                localStorage.setItem("user", JSON.stringify(data));

                message.success("Tizimga muvaffaqiyatli kirdingiz!");

                window.location.pathname = '/'

            } else {
                message.error("Token yoki foydalanuvchi ma'lumotlari xato.");
            }

        } catch (error) {
            console.error("Login xatolik:", error);

            if (error.response) {
                message.error(error.response.data.detail || "Login muvaffaqiyatsiz!");
            } else {
                message.error("Server bilan bog‘lanishda muammo!");
            }
        }

        setLoading(false);
    };

    const register = () => {
        navigate("/register");
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-700">
            <div className="bg-white dark:!text-white dark:bg-gray-800  p-6 rounded-lg shadow-md w-96">
                <h2 className="text-xl font-bold text-center mb-4">Kirish</h2>
                <Form className="dark:!text-white" layout="vertical" onFinish={onFinish}>
                    <Form.Item
                        label="Phone Number"
                        name="phone_number"
                        className="dark:!text-white"
                        rules={[
                            { required: true, message: "Telefon raqamingizni kiriting!" },
                            { pattern: /^[0-9+]+$/, message: "Faqat raqamlar va '+' belgisi bo'lishi mumkin!" }
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Parol"
                        name="password"
                        rules={[{ required: true, message: "Parol kiriting!" }]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <div className="flex flex-col">
                        <Button type="primary" htmlType="submit" loading={loading} block>
                            Kirish
                        </Button>
                        <Button type="link" onClick={register} className="mt-2">
                            Ro‘yxatdan o‘tish
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    );
}
