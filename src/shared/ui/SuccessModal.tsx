import { CheckCircle, X } from 'lucide-react';

interface SuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SuccessModal = ({ isOpen, onClose }: SuccessModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 animate-scale-in">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Close"
                >
                    <X className="h-6 w-6" />
                </button>

                {/* Content */}
                <div className="flex flex-col items-center text-center">
                    {/* Success Icon */}
                    <div className="mb-6">
                        <CheckCircle className="h-20 w-20 text-green-500 animate-bounce-in" />
                    </div>

                    {/* Title */}
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">
                        Data Saved Successfully!
                    </h2>

                    {/* Message */}
                    <p className="text-gray-600 mb-8">
                        All your dental chart information has been saved successfully.
                    </p>

                    {/* Action Button */}
                    <button
                        onClick={onClose}
                        className="px-8 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-hover transition-colors w-full"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};
