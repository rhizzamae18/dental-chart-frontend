import { Upload, X } from 'lucide-react';
import { useState } from 'react';

const PAGE_INFO = [
    { page: 1, title: 'Patient Information & Medical History', description: 'Personal details, medical conditions, medications' },
    { page: 2, title: 'Dental History & Clinical Findings', description: 'Dental complaints, examination results, diagnosis' },
    { page: 3, title: 'Dental Chart & Treatment Records', description: 'Tooth diagram, procedures, treatment notes' },
    { page: 4, title: 'Consent Forms & Signatures', description: 'Treatment consent, procedure consent, signatures' },
];

interface UploadNextPageModalProps {
    isOpen: boolean;
    currentPage: number;
    onUpload: (file: File) => void;
    onCancel: () => void;
}

export const UploadNextPageModal = ({ isOpen, currentPage, onUpload, onCancel }: UploadNextPageModalProps) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    if (!isOpen) return null;

    const pageInfo = PAGE_INFO[currentPage - 1];
    if (!pageInfo) return null;

    const handleFileSelect = (file: File) => {
        if (file && file.type.match('image.*')) {
            setSelectedFile(file);
        } else {
            alert('Please select an image file (PNG, JPG, etc.)');
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    };

    const handleUploadClick = () => {
        if (selectedFile) {
            onUpload(selectedFile);
            setSelectedFile(null);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                                {pageInfo.page}
                            </div>
                            <h2 className="text-2xl font-bold text-primary">Upload Page {pageInfo.page}</h2>
                        </div>
                        <p className="text-sm text-text-secondary ml-13">Page {currentPage} of 4</p>
                    </div>
                    <button
                        onClick={onCancel}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-6 h-6 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Page Info */}
                    <div className="bg-primary-light rounded-lg p-4 border-l-4 border-primary">
                        <h3 className="font-bold text-primary text-lg mb-2">{pageInfo.title}</h3>
                        <p className="text-sm text-text-secondary">{pageInfo.description}</p>
                    </div>

                    {/* Upload Area */}
                    <div
                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                        onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
                        onDrop={handleDrop}
                        className={`relative border-2 border-dashed rounded-xl py-12 transition-all ${isDragging
                                ? 'border-accent bg-accent-light scale-[1.02]'
                                : selectedFile
                                    ? 'border-green-500 bg-green-50'
                                    : 'border-border-default hover:border-primary'
                            }`}
                    >
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />

                        <div className="flex flex-col items-center justify-center gap-4">
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${selectedFile ? 'bg-green-500' : 'bg-accent-light'
                                }`}>
                                <Upload className={`w-8 h-8 ${selectedFile ? 'text-white' : 'text-accent'}`} />
                            </div>

                            {selectedFile ? (
                                <div className="text-center">
                                    <p className="text-lg font-medium text-green-700">✓ File Selected</p>
                                    <p className="text-sm text-text-secondary mt-1">{selectedFile.name}</p>
                                    <p className="text-xs text-text-secondary mt-2">Click to change or drag another file</p>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <p className="text-lg font-medium text-primary">
                                        {isDragging ? 'Drop your image here!' : 'Click to upload or drag and drop'}
                                    </p>
                                    <p className="text-sm text-text-secondary mt-1">PNG, JPG, or SVG (max. 10MB)</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={onCancel}
                            className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleUploadClick}
                            disabled={!selectedFile}
                            className={`flex-1 px-6 py-3 font-medium rounded-lg transition-colors ${selectedFile
                                    ? 'bg-primary text-white hover:bg-primary-hover'
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                }`}
                        >
                            Upload & Continue
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
