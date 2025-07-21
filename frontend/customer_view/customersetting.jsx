import React, { useState, useEffect } from 'react';
import api from '../src/utils/api/axiosConfig';
import { 
    FiAlertCircle,
    FiAlertTriangle,
    FiArrowUpRight, 
    FiArrowDownRight,
    FiCheckCircle
} from 'react-icons/fi';
import Navbar from './navbar';

const CustomerSetting = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const customerId = JSON.parse(localStorage.getItem('customerDetails')).customerId;

    // Profile State
    const [customer, setCustomer] = useState({
        name: '', email: '', phone: '', address: '', city: '', state: '', zip: '', country: '', dob: '', gender: '', aadhar: '', pan: '', drivingLicense: ''
    });
    const [originalCustomer, setOriginalCustomer] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [profileError, setProfileError] = useState('');
    const [profileSuccess, setProfileSuccess] = useState('');
    const [profileLoading, setProfileLoading] = useState(false);

    // Password State
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [pwError, setPwError] = useState('');
    const [pwSuccess, setPwSuccess] = useState('');
    const [pwLoading, setPwLoading] = useState(false);

    useEffect(() => {
        const fetchCustomer = async () => {
            try {
                setProfileLoading(true);
                setProfileError('');
                const response = await api.get(`/customers/getcustomer/${customerId}`);
                const data = response.data;
                const formattedData = {
                    ...data,
                    dob: data.dob ? new Date(data.dob).toISOString().split('T')[0] : ''
                };
                setCustomer(formattedData);
                setOriginalCustomer(formattedData);
            } catch (error) {
                setProfileError(error.response?.data?.message || 'Failed to load customer data');
            } finally {
                setProfileLoading(false);
            }
        };
        fetchCustomer();
    }, [customerId]);

    // Profile Form Handlers
    const handleUpdateCustomer = async (e) => {
        e.preventDefault();
        setProfileError('');
        setProfileSuccess('');
        setProfileLoading(true);
        try {
            await api.put(`/customers/updatecustomer/${customerId}`, customer);
            setIsEditMode(false);
            setOriginalCustomer(customer);
            setProfileSuccess('Profile updated successfully!');
        } catch (error) {
            setProfileError(error.response?.data?.message || error.message || 'Failed to update profile');
        } finally {
            setProfileLoading(false);
        }
    };
    const handleCancel = () => {
        if (isEditMode && originalCustomer) {
            setCustomer(originalCustomer);
            setIsEditMode(false);
            setProfileError('');
            setProfileSuccess('');
        }
    };
    const renderField = (label, value, onChange, type = 'text', required = true, options = null) => {
        if (!isEditMode) {
            return (
                <div>
                    <label className="grid grid-cols-6 text-sm font-medium text-gray-700">{label}</label>
                    <div className="mt-1 block w-full rounded-lg border border-gray-200 px-3 py-2 bg-gray-100 text-gray-700">{value || <span className="text-gray-400">N/A</span>}</div>
                </div>
            );
        }
        if (options) {
            return (
                <div>
                    <label className="grid grid-cols-6 text-sm font-medium text-gray-700">{label}</label>
                    <select
                        value={value}
                        onChange={onChange}
                        className="mt-1 grid grid-cols-6 rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        required={required}
                    >
                        {options.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>
            );
        }
        if (type === 'textarea') {
            return (
                <div>
                    <label className="grid grid-cols-6 text-sm font-medium text-gray-700">{label}</label>
                    <textarea
                        value={value}
                        onChange={onChange}
                        rows={3}
                        className="mt-1 grid grid-cols-6 rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        required={required}
                    />
                </div>
            );
        }
        return (
            <div>
                <label className="grid grid-cols-6 text-sm font-medium text-gray-700">{label}</label>
                <input
                    type={type}
                    value={value}
                    onChange={onChange}
                    className="mt-1 grid grid-cols-6 rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required={required}
                    disabled={profileLoading}
                />
            </div>
        );
    };

    // Password Change Handler
    const handleChangePassword = async (e) => {
        e.preventDefault();
        setPwError('');
        setPwSuccess('');
        if (!oldPassword || !newPassword || !confirmPassword) {
            setPwError('All fields are required');
            return;
        }
        if (newPassword !== confirmPassword) {
            setPwError('New passwords do not match');
            return;
        }
        setPwLoading(true);
        try {
            await api.post(`/customers/changepassword/${customerId}`, {
                oldPassword,
                newPassword
            });
            setPwSuccess('Password changed successfully!');
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            setPwError(error.response?.data?.message || error.message || 'Failed to change password');
        } finally {
            setPwLoading(false);
        }
    };

    return (
        <div className="relative flex min-h-screen flex-col bg-slate-50 overflow-x-hidden">
            <Navbar />
            <div className="max-w-2xl mx-auto mt-8 bg-white rounded-lg shadow p-6">
                <div className="flex border-b mb-6">
                    <button
                        className={`py-2 px-4 font-medium focus:outline-none ${activeTab === 'profile' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
                        onClick={() => setActiveTab('profile')}
                    >
                        Profile
                    </button>
                    <button
                        className={`ml-6 py-2 px-4 font-medium focus:outline-none ${activeTab === 'password' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
                        onClick={() => setActiveTab('password')}
                    >
                        Change Password
                    </button>
                </div>
                {activeTab === 'profile' && (
                    <form onSubmit={handleUpdateCustomer} className="space-y-6">
                        {profileError && <div className="rounded bg-red-50 p-3 text-red-700 text-sm">{profileError}</div>}
                        {profileSuccess && <div className="rounded bg-green-50 p-3 text-green-700 text-sm">{profileSuccess}</div>}
                        <div className="border-b border-gray-200 pb-6 mb-6">
                            <h2 className="mb-4 text-lg font-medium text-gray-900">Personal Information</h2>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                {renderField('Name', customer.name, (e) => setCustomer({...customer, name: e.target.value}), 'text')}
                                {renderField('Email', customer.email, (e) => setCustomer({...customer, email: e.target.value}), 'email')}
                                {renderField('Phone', customer.phone, (e) => setCustomer({...customer, phone: e.target.value}), 'tel')}
                                {renderField('Date of Birth', customer.dob, (e) => setCustomer({...customer, dob: e.target.value}), 'date')}
                                {renderField('Gender', customer.gender, (e) => setCustomer({...customer, gender: e.target.value}), 'text', true, [
                                    {value: '', label: 'Select Gender'},
                                    {value: 'male', label: 'Male'},
                                    {value: 'female', label: 'Female'},
                                    {value: 'other', label: 'Other'}
                                ])}
                            </div>
                        </div>
                        <div className="border-b border-gray-200 pb-6 mb-6">
                            <h2 className="mb-4 text-lg font-medium text-gray-900">Address Information</h2>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div className="md:col-span-2">
                                    {renderField('Address', customer.address, (e) => setCustomer({...customer, address: e.target.value}), 'textarea')}
                                </div>
                                {renderField('City', customer.city, (e) => setCustomer({...customer, city: e.target.value}))}
                                {renderField('State', customer.state, (e) => setCustomer({...customer, state: e.target.value}))}
                                {renderField('Zip Code', customer.zip, (e) => setCustomer({...customer, zip: e.target.value}))}
                                {renderField('Country', customer.country, (e) => setCustomer({...customer, country: e.target.value}))}
                            </div>
                        </div>
                        <div>
                            <h2 className="mb-4 text-lg font-medium text-gray-900">Identification Details</h2>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                {renderField('Aadhar Number', customer.aadhar, (e) => setCustomer({...customer, aadhar: e.target.value}))}
                                {renderField('PAN Number', customer.pan, (e) => setCustomer({...customer, pan: e.target.value}))}
                                {renderField('Driving License Number', customer.drivingLicense, (e) => setCustomer({...customer, drivingLicense: e.target.value}))}
                            </div>
                        </div>
                        <div className="flex justify-end space-x-4 pt-6">
                            {isEditMode ? (
                                <>
                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                        disabled={profileLoading}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={profileLoading}
                                        className="flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-75"
                                    >
                                        {profileLoading ? (
                                            <>
                                                <FiArrowUpRight className="mr-2 animate-spin" />
                                                Saving...
                                            </>
                                        ) : (
                                            'Save'
                                        )}
                                    </button>
                                </>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => setIsEditMode(true)}
                                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                >
                                    Edit
                                </button>
                            )}
                        </div>
                    </form>
                )}
                {activeTab === 'password' && (
                    <form onSubmit={handleChangePassword} className="space-y-6">
                        {pwError && <div className="rounded bg-red-50 p-3 text-red-700 text-sm">{pwError}</div>}
                        {pwSuccess && <div className="rounded bg-green-50 p-3 text-green-700 text-sm">{pwSuccess}</div>}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Old Password</label>
                            <input
                                type="password"
                                value={oldPassword}
                                onChange={e => setOldPassword(e.target.value)}
                                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                required
                                disabled={pwLoading}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">New Password</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={e => setNewPassword(e.target.value)}
                                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                required
                                disabled={pwLoading}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                required
                                disabled={pwLoading}
                            />
                        </div>
                        <div className="flex justify-end pt-6">
                            <button
                                type="submit"
                                disabled={pwLoading}
                                className="flex items-center rounded-lg bg-blue-600 px-6 py-3 text-lg font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-75"
                            >
                                {pwLoading ? (
                                    <>
                                        <FiArrowUpRight className="mr-2 animate-spin" />
                                        Changing...
                                    </>
                                ) : (
                                    'Change Password'
                                )}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default CustomerSetting;