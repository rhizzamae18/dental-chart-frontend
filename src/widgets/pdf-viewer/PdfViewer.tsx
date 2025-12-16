
import { useAppStore } from '@/shared/store/useAppStore';
import { ZoomIn, ZoomOut, Maximize } from 'lucide-react';
import { useState, useRef } from 'react';

export const PdfViewer = () => {
    const separatedPages = useAppStore((state) => state.separatedPages);
    const currentPage = useAppStore((state) => state.currentPage);

    const [zoom, setZoom] = useState(1);
    const [isEditing, setIsEditing] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);

    const handleZoomIn = () => {
        setZoom((prevZoom) => Math.min(prevZoom + 0.25, 3));
    }

    const handleZoomOut = () => {
        setZoom((prevZoom) => Math.max(prevZoom - 0.25, 0.5));
    }

    const handleFullScreen = () => {
        if (!containerRef.current) return;
        if (!document.fullscreenElement) {
            containerRef.current.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }

    const handleEditClick = () => {
        setIsEditing(true);
        setInputValue(Math.round(zoom * 100).toString());
    };

    const applyZoomValue = () => {
        const numValue = parseInt(inputValue);
        if (isNaN(numValue)) {
            setIsEditing(false);
            return;
        }
        const newZoom = numValue / 100;
        const clampedZoom = Math.max(0.5, Math.min(3, newZoom));
        setZoom(clampedZoom);
        setIsEditing(false);
    };

    const cancelEdit = () => {
        setIsEditing(false);
        setInputValue('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            applyZoomValue();
        } else if (e.key === 'Escape') {
            cancelEdit();
        }
    }

    // Get the image URL for the current page (1-based index)
    // Fallback to empty string if not found, but we should safeguard
    const currentImage = separatedPages[currentPage - 1];

    if (!currentImage) {
        return (
            <div className="flex items-center justify-center h-full bg-gray-900 text-gray-400">
                <p>No document page found for Page {currentPage}</p>
            </div>
        );
    }

    return (
        <div ref={containerRef} className="flex flex-col h-full bg-black">
            {/* Zoom Controls */}
            <div className="flex items-center justify-center gap-2 mb-4 py-2 flex-shrink-0 bg-gray-900 border-b border-gray-800">
                <button
                    className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                    onClick={handleZoomOut}
                >
                    <ZoomOut className="w-5 h-5 text-white" />
                </button>
                {isEditing ? (
                    <input type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onBlur={applyZoomValue}
                        onKeyDown={handleKeyDown}
                        autoFocus
                        className="w-14 text-center text-gray-200 bg-gray-800 rounded-lg transition-colors focus:outline-none focus:ring-0 py-1.5"
                    />
                )
                    : (
                        <span
                            onClick={handleEditClick}
                            className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-white text-sm cursor-pointer"
                        >
                            {Math.round(zoom * 100)}%
                        </span>
                    )}
                <button
                    className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                    onClick={handleZoomIn}
                >
                    <ZoomIn className="w-5 h-5 text-white" />
                </button>
                <button
                    className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                    onClick={handleFullScreen}
                >
                    <Maximize className="w-5 h-5 text-white" />
                </button>
            </div>

            {/* Image Container */}
            <div className="flex-1 overflow-auto bg-black">
                <img
                    src={currentImage}
                    alt={`Page ${currentPage}`}
                    className="w-full h-auto shadow-2xl transition-transform duration-200"
                    style={{
                        transform: `scale(${zoom})`,
                        transformOrigin: 'top center',
                        // Ensure high quality rendering
                        imageRendering: 'auto'
                    }}
                />
            </div>
        </div>
    );
};
