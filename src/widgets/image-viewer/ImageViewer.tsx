import { useAppStore } from '@/shared/store/useAppStore';
import { ZoomIn, ZoomOut, Maximize } from 'lucide-react';
import { useState, useRef } from 'react';

export const ImageViewer = () => {
  const uploadedImage = useAppStore((state) => state.uploadedImage);

  // STATE: Track zoom level (starts at 1 = 100%)
  const [zoom, setZoom] = useState(1);

  // NEW: Track if we're editing the zoom percentage
  const [isEditing, setIsEditing] = useState(false);

  // NEW: Track what user is typing in the input field
  const [inputValue, setInputValue] = useState('');

  // REF: Reference to the container for fullscreen;
  const containerRef = useRef<HTMLDivElement>(null);

  // HANDLER: Zoom In (increase by 25%)
  const handleZoomIn = () => {
    setZoom((prevZoom) => Math.min(prevZoom + 0.25, 3)); // Cap at 300%
  }

  // HANDLER: Zoom Out (decrease by 25%)
  const handleZoomOut = () => {
    setZoom((prevZoom) => Math.max(prevZoom - 0.25, 0.5)); // Minimum at 50%
  }

  // HANDLER: Toggle Fullscreen
  const handleFullScreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }

  // HANDLER: When user clicks the percentage, enter edit mode
  const handleEditClick = () => {
    setIsEditing(true);
    setInputValue(Math.round(zoom * 100).toString()); // Pre-fill with current value
  };

  // HANDLER: Apply the typed zoom value
  const applyZoomValue = () => {
    const numValue = parseInt(inputValue);

    // Validate: is it a valid nuber?
    if (isNaN(numValue)) {
      setIsEditing(false);
      return;
    }

    // Convert percentage to zoom (100 -> 1, 200 -> 2)
    const newZoom = numValue / 100;

    // Apply limits (50% min, 300% max)
    const clampedZoom = Math.max(0.5, Math.min(3, newZoom));

    setZoom(clampedZoom);
    setIsEditing(false); // Exit edit mode
  };

  // HANDLER: Cancel editing (Escape key)
  const cancelEdit = () => {
    setIsEditing(false);
    setInputValue(''); // Clear input
  };

  // HANDLER: Handle keyboard input in the zoom field
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      applyZoomValue(); // Apply on enter
    } else if (e.key === 'Escape') {
      cancelEdit(); // Cancel on Escape
    }

  }
  const currentPage = useAppStore((state) => state.currentPage);
  const separatedPages = useAppStore((state) => state.separatedPages);

  // ... (keeping existing state hooks) ...

  // Determine which image to show
  // If we have separated pages (PDF mode), show the current page
  // Otherwise show the single uploaded image
  let imageUrl: string | null = null;

  if (separatedPages && separatedPages.length > 0) {
    // PDF Mode: get page at index (currentPage - 1)
    imageUrl = separatedPages[currentPage - 1] || null;
  } else if (uploadedImage) {
    // Image Mode: create object URL
    imageUrl = URL.createObjectURL(uploadedImage);
  }

  if (!imageUrl) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-400">No image uploaded</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="flex flex-col h-full">
      {/* Zoom Controls - Fixed at top */}
      <div className="flex items-center justify-center gap-2 mb-4 py-2 flex-shrink-0">
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

      {/* Image Container - Takes remaining space */}
      <div className="flex-1 overflow-auto bg-black rounded-lg">
        <img
          src={imageUrl}
          alt="Uploaded dental chart"
          className="w-full h-auto"
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: 'top center'
          }}
        />
      </div>
    </div>
  );
};