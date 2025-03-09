'use client';
import React, { useState, useRef, useContext, useEffect } from 'react';
import { Camera } from 'lucide-react';
import { UserDetailContext } from '../context/UserDetailContext';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import Loading from '../_components/loading';
const Settings = () => {
    const { userDetail } = useContext(UserDetailContext);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [gender, setGender] = useState('male');
    const [imageUrl, setImageUrl] = useState('');
    const [country, setCountry] = useState('');
    const fileInputRef = useRef(null);
    const [profile, setProfile] = useState(null);
    const [countries, setCountries] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 3000);
        return () => clearTimeout(timer);
    }, []);
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const docRef = doc(db, 'profiles', userDetail?.email);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    setPhoneNumber(userData.phoneNumber || '');
                    setDateOfBirth(userData.dateOfBirth || '');
                    setGender(userData.gender || 'male');
                    setImageUrl('http://127.0.0.1:8000' + userData.profile_picture || '');
                    setCountry(userData.country || '');
                }
            } catch (error) {
                console.log('Error fetching user profile:', error.message);
            }
        };
        if (userDetail?.email) {
            fetchUserProfile();
        }
    }, [userDetail]);
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setProfile(file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };
    const EditProfile = async (e) => {
        e.preventDefault();
        if (!profile) {
            console.log("No profile picture selected.");
            return;
        }
        try {
            const formData = new FormData();
            formData.append("email", userDetail?.email);
            formData.append("profile", profile);
            const response = await fetch('http://127.0.0.1:8000/EditProfiles', {
                method: 'POST',
                body: formData,
            });
            if (!response.ok) {
                const errorData = await response.json();
                console.log(errorData.error);
                return;
            }
            const data = await response.json();
            console.log(data);
            const profile_picture_path = data.profile.profile;
            if (!profile_picture_path) {
                console.log("Profile picture path is undefined or empty.");
                return;
            }
            const docRef = doc(db, 'profiles', userDetail?.email);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                await updateDoc(docRef, {
                    profile_picture: '/media/' + profile_picture_path,
                    dateOfBirth,
                    phoneNumber,
                    gender,
                    country,
                });
                console.log('Profile updated successfully');
            } else {
                await setDoc(docRef, {
                    profile_picture: '/media/' + profile_picture_path,
                    dateOfBirth,
                    phoneNumber,
                    gender,
                    country,
                });
                console.log('Profile created successfully');
            }
            setImageUrl('http://127.0.0.1:8000/media/' + profile_picture_path);
            console.log('Profile picture updated with path:', profile_picture_path);
        } catch (error) {
            console.log("Error updating profile:", error.message);
        }
    };
    useEffect(() => {
        const fetchCountries = async () => {
            const response = await fetch("https://restcountries.com/v3.1/all");
            const data = await response.json();
            setCountries(data);
        };
        fetchCountries();
    }, []);
    return (
        <div className="w-[98%] flex items-center justify-center font-josefin">
            {isLoading ? (
                <Loading />
            ) : (
                <div className="bg-white rounded-xl p-8 w-full shadow-lg">
                    <>
                        <div className="grid sm:grid-cols-1 xl:w-[26rem] sm:w-auto xl:grid-cols-2 gap-2">
                            <div className="flex justify-start items-center">
                                <input
                                    type="file"
                                    className="hidden"
                                    ref={fileInputRef}
                                    onChange={handleImageChange}
                                />
                                <div
                                    className="relative border-4 border-gray-200 rounded-full w-[12rem] h-[12rem] flex items-end justify-end overflow-hidden"
                                    style={{
                                        backgroundImage: imageUrl ? `url(${imageUrl})` : `url(me.jpg)`,
                                        backgroundPosition: 'center',
                                        backgroundSize: 'cover',
                                        backgroundRepeat: 'no-repeat'
                                    }}
                                >
                                    <button
                                        type="button"
                                        className="w-12 h-12 bg-black bg-opacity-50 rounded-full flex items-center justify-center mb-3 mr-3"
                                        onClick={() => fileInputRef.current.click()}
                                    >
                                        <Camera color="white" size={24} />
                                    </button>
                                </div>
                            </div>
                            <div className="flex flex-col items-start justify-center">
                                <p className="text-3xl font-bold text-gray-800">{userDetail?.first_name} {userDetail?.last_name}</p>
                            </div>
                        </div>
                        <form onSubmit={EditProfile} className="mt-8 space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="relative">
                                    <label className="text-sm font-medium text-gray-700" htmlFor="dob">Date of Birth</label>
                                    <input
                                        id="dob"
                                        type="date"
                                        value={dateOfBirth}
                                        onChange={(e) => setDateOfBirth(e.target.value)}
                                        className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="relative">
                                    <label className="text-sm font-medium text-gray-700" htmlFor="country">Choose the Country</label>
                                    <select
                                        id="country"
                                        value={country}
                                        onChange={(e) => setCountry(e.target.value)}
                                        className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Choose the country</option>
                                        {countries.map((country) => (
                                            <option key={country.cca3} value={country.cca3}>
                                                {country.name.common}
                                            </option>
                                        ))}

                                    </select>
                                </div>
                                <div className="relative">
                                    <label className="text-sm font-medium text-gray-700" htmlFor="phone">Phone Number</label>
                                    <input
                                        id="phone"
                                        type="text"
                                        placeholder="Enter your phone number"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="relative">
                                    <label className="text-sm font-medium text-gray-700" htmlFor="gender">Choose Gender</label>
                                    <select
                                        id="gender"
                                        value={gender}
                                        onChange={(e) => setGender(e.target.value)}
                                        className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex items-start justify-start mt-8">
                                <button
                                    type="submit"
                                    className="bg-slate-800 hover:bg-slate-900 duration-300 text-white px-6 py-3 rounded-md font-medium text-lg w-full sm:w-auto"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </>
                </div>
            )}
        </div>
    );
};
export default Settings;