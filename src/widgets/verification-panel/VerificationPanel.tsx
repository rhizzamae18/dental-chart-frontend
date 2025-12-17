import { useAppStore } from '@/shared/store/useAppStore';
import { ImageViewer } from '@/widgets/image-viewer/ImageViewer';
import { PdfViewer } from '@/widgets/pdf-viewer/PdfViewer';
import { FormPanel } from '@/widgets/form-panel/FormPanel';
import { X } from 'lucide-react';

export const VerificationPanel = () => {
  const currentPage = useAppStore((state) => state.currentPage);
  const resetPage = useAppStore((state) => state.resetPage);

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
      resetPage();
    }
  };

  return (
    <div className="h-full flex flex-col lg:flex-row">
      {/* LEFT: Image Panel */}
      <div className="w-full lg:w-1/2 bg-gray-900 p-2 sm:p-4 flex flex-col h-1/3 lg:h-full">
        {/* If we have separated PDF pages, use the PDF viewer */}
        {useAppStore((state) => state.separatedPages.length > 0) ? (
          <PdfViewer />
        ) : (
          <ImageViewer />
        )}
      </div>

      {/* RIGHT: Form Panel */}
      <div className="w-full lg:w-1/2 bg-white flex flex-col h-2/3 lg:h-full">
        {/* Header Section */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 flex-shrink-0 flex items-start justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">
              Verified Data
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              Review and correct information from Page {currentPage}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            {/* Cancel/Exit Button */}
            <button
              onClick={handleCancel}
              className="p-2 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2 text-red-600 hover:text-red-700 border border-red-200 hover:border-red-300"
              title="Cancel and return to main page"
            >
              <X className="h-5 w-5" />
              <span className="hidden sm:inline text-sm font-medium">Cancel</span>
            </button>
          </div>
        </div>

        {/* Form Section */}
        <div className="flex-1 overflow-hidden">
          <FormPanel />
        </div>
      </div>
    </div>
  );
};