import { useState } from 'react';
import { useAppStore } from '@/shared/store/useAppStore';
import { Upload, X, Check } from 'lucide-react';

interface SignatureUploadProps {
    label: string;
    fieldKey: string;
}

export const SignatureUpload = ({ label, fieldKey }: SignatureUploadProps) => {
    const formData = useAppStore((state) => state.formData);
    const updateFormData = useAppStore((state) => state.updateFormData);

    const [preview, setPreview] = useState<string | null>(
        (formData[fieldKey] as string) || null
    );

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.match('image.*')) {
            alert('Please upload an image file (PNG, JPG, etc.)');
            return;
        }

        // Validate file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            alert('File size must be less than 2MB');
            return;
        }

        // Convert to base64 and store
        const reader = new FileReader();
        reader.onload = (event) => {
            const base64String = event.target?.result as string;
            setPreview(base64String);
            updateFormData(fieldKey, base64String);
        };
        reader.readAsDataURL(file);
    };

    const handleRemove = () => {
        setPreview(null);
        updateFormData(fieldKey, '');
    };

    return (
        <div className="mb-4">
            {/* Label */}
            <label className="block text-sm font-medium text-text-secondary mb-2">
                {label}
            </label>

            {preview ? (
                /* Preview with Remove Option */
                <div className="relative border-2 border-green-300 bg-green-50 rounded-lg p-4">
                    <div className="flex items-start gap-4">
                        {/* Signature Preview */}
                        <div className="flex-1">
                            <img
                                src={preview}
                                alt="Signature preview"
                                className="max-h-32 w-auto border border-gray-200 rounded bg-white p-2"
                            />
                        </div>

                        {/* Success Badge */}
                        <div className="flex items-center gap-2 text-green-600">
                            <Check className="w-5 h-5" />
                            <span className="text-sm font-medium">Uploaded</span>
                        </div>
                    </div>

                    {/* Remove Button */}
                    <button
                        type="button"
                        onClick={handleRemove}
                        className="absolute top-2 right-2 p-1.5 bg-red-100 hover:bg-red-200 text-red-600 rounded-full transition-colors"
                        title="Remove signature"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            ) : (
                /* Upload Zone */
                <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-primary transition-colors cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />

                    <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 bg-primary-light rounded-full flex items-center justify-center">
                            <Upload className="w-6 h-6 text-primary" />
                        </div>

                        <div className="text-center">
                            <p className="text-sm font-medium text-gray-700">
                                Click to upload signature
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                PNG, JPG (max. 2MB)
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Helper Text */}
            <p className="text-xs text-gray-500 mt-2">
                Upload a scanned or digital signature image
            </p>
        </div>
    );
};
