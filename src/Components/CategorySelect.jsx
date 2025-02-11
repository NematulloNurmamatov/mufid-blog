// import React, { useState, useEffect } from "react";
// import { Select, message } from "antd";
// import apiClient from "../API/ApiClient";

// export default function CategorySelect({ onChange }) {
//     const [categories, setCategories] = useState([]);
//     const [loading, setLoading] = useState(false);

//     useEffect(() => {
//         const fetchCategories = async () => {
//             setLoading(true);
//             try {
//                 const response = await apiClient.get("/blog/categories/");
//                 setCategories(response.data);
//             } catch (error) {
//                 message.error("Kategoriyalarni yuklashda xatolik yuz berdi!");
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchCategories();
//     }, []);

//     return (
//         <Select
//             placeholder="Kategoriya tanlang"
//             onChange={onChange}
//             className="w-full"
//             loading={loading}
//         >
//             {categories.map((cat) => (
//                 <Select.Option key={cat.id} value={cat.id}>
//                     {cat.name}
//                 </Select.Option>
//             ))}
//         </Select>
//     );
// }
