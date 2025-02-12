import React, { useState, useEffect } from "react";
import { message, Input, Button, Spin, DatePicker, Select } from "antd";
import apiClient from "../API/ApiClient";
import { useNavigate } from "react-router-dom";
import moment from "moment";

export default function MyProfile() {
    const [loading, setLoading] = useState(true);
    const [profileData, setProfileData] = useState({
        full_name: "",
        email: "",
        phone_number: "",
        avatar: "",
        town_city: "",
        date_birth: "",
        gender: 0, //  0 = Male
    });
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        const fetchProfile = async () => {
            try {
                const response = await apiClient.get("/account/me/", {
                    headers: {
                        "Authorization": `Bearer ${JSON.parse(token).access}`,
                    },
                });

                if (response?.data) {
                    setProfileData(response.data);
                    // Saqlash
                    localStorage.setItem('profileData', JSON.stringify(response.data));
                }
            } catch (error) {
                console.error("Error fetching profile data:", error);
                message.error("Error loading profile data.");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [navigate]);


    const handleSaveProfile = async () => {
        const token = localStorage.getItem("token");
        const csrfToken = localStorage.getItem("csrf_token");

        console.log("Save profile data");


        try {
            const response = await apiClient({
                url: "/account/me/",
                method: "PATCH",
                data: {
                    full_name: profileData.full_name,
                    phone_number: profileData.phone_number,
                    email: profileData.email,
                    town_city: profileData.town_city,
                    date_birth: profileData.date_birth,
                    gender: profileData.gender,

                },
                headers: {
                    "Authorization": `Bearer ${JSON.parse(token).access}`,
                    "X-CSRFToken": csrfToken, // Include CSRF token in the headers
                    "Content-Type": "application/json",
                },
            }
            );


            if (response?.data) {
                message.success("Profile updated successfully!");
                setIsEditing(false); // Exit edit mode
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            message.error("An error occurred while updating profile.");
        }
    };

    // Handle change in input fields
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfileData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Handle date change for birthdate
    const handleDateChange = (date, dateString) => {
        setProfileData((prevData) => ({
            ...prevData,
            date_birth: dateString,
        }));
    };

    // Handle gender selection
    const handleGenderChange = (value) => {
        setProfileData((prevData) => ({
            ...prevData,
            gender: value,
        }));
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spin size="large" />
            </div>
        );
    }


    return (
        <div className="container">
            <h1 className="text-3xl font-bold text-center mt-5">My Profile</h1>

            <div className="mt-6">
                {/* Display user profile */}
                {!isEditing ? (
                    <div className="flex items-center gap-10">
                        <p>{profileData.avatar ? <img className="w-64 mb-4 rounded-2xl" src={profileData.avatar} alt="Avatar" /> : "No avatar set"}</p>
                        <div>
                            <p><strong>Name:</strong> {profileData.full_name}</p>
                            <p><strong>Email:</strong> {profileData.email}</p>
                            <p><strong>Phone:</strong> {profileData.phone_number}</p>
                            <p><strong>City:</strong> {profileData.town_city}</p>
                            <p><strong>Birth Date:</strong> {profileData.date_birth}</p>
                            <p><strong>Gender:</strong> {profileData.gender === 0 ? "Male" : "Female"}</p>

                            <Button onClick={() => setIsEditing(true)} className="mt-4" type="primary">
                                Edit Profile
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div>
                        <div className="mb-4">
                            <Input
                                name="full_name"
                                value={profileData.full_name}
                                onChange={handleChange}
                                placeholder="Your full name"
                            />
                        </div>
                        <div className="mb-4">
                            <Input
                                name="email"
                                value={profileData.email}
                                onChange={handleChange}
                                placeholder="Your email"
                            />
                        </div>
                        <div className="mb-4">
                            <Input
                                name="phone_number"
                                value={profileData.phone_number}
                                onChange={handleChange}
                                placeholder="Your phone number"
                            />
                        </div>
                        <div className="mb-4">
                            <Input
                                name="town_city"
                                value={profileData.town_city}
                                onChange={handleChange}
                                placeholder="Your city"
                            />
                        </div>
                        <div className="mb-4">
                            <DatePicker
                                name="date_birth"
                                value={profileData.date_birth ? moment(profileData.date_birth) : null}
                                onChange={handleDateChange}
                                placeholder="Select your birth date"
                            />
                        </div>
                        <div className="mb-4">
                            <Select
                                name="gender"
                                value={profileData.gender}
                                onChange={handleGenderChange}
                                placeholder="Select gender"
                            >
                                <Select.Option value={0}>Male</Select.Option>
                                <Select.Option value={1}>Female</Select.Option>
                            </Select>
                        </div>

                        <Button
                            onClick={handleSaveProfile}
                            type="primary"
                            className="mr-2"
                            disabled={loading} // Spinner ishlayotgan paytda tugmani o'chirish
                            style={{ backgroundColor: loading ? "gray" : undefined }} // Spinner paytida kulrang rang
                        >
                            {loading ? <Spin size="small" /> : "Save Changes"}
                        </Button>
                        {/* <Button onClick={() => setIsEditing(false)} type="default">
                            Ortga qaytish
                        </Button> */}
                    </div>
                )}
            </div>
        </div>
    );
}
