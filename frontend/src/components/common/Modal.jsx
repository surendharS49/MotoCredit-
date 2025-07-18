import React from 'react';
import { FaTimes } from 'react-icons/fa';

const Modal = ({ isOpen, onClose, title, children, type = 'default' }) => {
    if (!isOpen) return null;

    const getHeaderStyles = () => {
        switch (type) {
            case 'success':
                return 'bg-green-50 text-green-700';
            case 'error':
                return 'bg-red-50 text-red-700';
            case 'warning':
                return 'bg-yellow-50 text-yellow-700';
            default:
                return 'bg-slate-50 text-slate-700';
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div 
                className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
                onClick={onClose}
            />
            
            {/* Modal */}
            <div className="relative z-50 w-full max-w-md transform rounded-lg bg-white shadow-xl transition-all">
                {/* Header */}
                <div className={`flex items-center justify-between rounded-t-lg px-6 py-4 ${getHeaderStyles()}`}>
                    <h3 className="text-lg font-semibold">{title}</h3>
                    <button
                        onClick={onClose}
                        className="rounded-full p-1 hover:bg-white hover:bg-opacity-20 transition-colors"
                    >
                        <FaTimes />
                    </button>
                </div>
                
                {/* Content */}
                <div className="px-6 py-4">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal; 