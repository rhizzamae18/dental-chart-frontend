import { useAppStore } from "@/shared/store/useAppStore";
import { Header } from "@/widgets/header/Header";
import { UploadZone } from "@/features/upload-chart/UploadZone";
import { ProcessingScreen } from "@/widgets/processing-status/ProcessingScreen";
import { VerificationPanel } from "@/widgets/verification-panel/VerificationPanel";
import { Upload, Sparkles, FileCheck, Save } from "lucide-react";

export const MainPage = () => {
    const appState = useAppStore((state) => state.appState);

    return (
        <div className="h-screen flex flex-col overflow-hidden bg-bg-secondary">
            {/* Header */}
            <Header />

            {/* Main content */}
            {(appState === 'empty' || appState === 'loading') && (
                <main className="flex-1 overflow-auto px-4 py-8">
                    <div className="max-w-7xl mx-auto">
                        {appState === 'empty' && (
                            <div className="space-y-12 pb-16">
                                <div className="text-center">
                                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-primary mb-3 sm:mb-5 px-4">
                                        Digitize Records in Seconds
                                    </h2>
                                    <p className="text-base sm:text-lg text-text-secondary max-w-2xl mx-auto mb-6 sm:mb-8 px-4">
                                        Upload handwritten dental forms and let our AI convert them into secure, searchable digital records
                                    </p>
                                </div>
                                <UploadZone />

                                {/* Information Section */}
                                <div className="max-w-5xl mx-auto space-y-12 mt-16">
                                    {/* About Section */}
                                    <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
                                        <h3 className="text-2xl sm:text-3xl font-bold text-primary mb-4 text-center">
                                            Transform Your Dental Practice
                                        </h3>
                                        <p className="text-text-secondary leading-relaxed text-center">
                                            Dental Chart Digitizer is a modern solution designed to help dental clinics seamlessly convert handwritten patient forms into fully digital records. The system allows clinics to upload images or PDF files of traditional dental charts, which are then processed using advanced AI recognition technology. The AI automatically extracts important patient details, annotations, and dental chart markings, and organizes them into a clean, editable digital format.
                                        </p>
                                    </div>

                                    {/* User Flow */}
                                    <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
                                        <h3 className="text-2xl sm:text-3xl font-bold text-primary mb-8 text-center">
                                            How It Works
                                        </h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                            <div className="flex flex-col items-center text-center space-y-3">
                                                <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center">
                                                    <Upload className="w-8 h-8 text-primary" />
                                                </div>
                                                <h4 className="font-bold text-primary text-lg">Upload</h4>
                                                <p className="text-sm text-text-secondary">
                                                    Drag and drop your dental form (image/PDF)
                                                </p>
                                            </div>

                                            <div className="flex flex-col items-center text-center space-y-3">
                                                <div className="w-16 h-16 bg-accent-light rounded-full flex items-center justify-center">
                                                    <Sparkles className="w-8 h-8 text-accent" />
                                                </div>
                                                <h4 className="font-bold text-primary text-lg">Processing</h4>
                                                <p className="text-sm text-text-secondary">
                                                    AI analyzes and extracts data from the document
                                                </p>
                                            </div>

                                            <div className="flex flex-col items-center text-center space-y-3">
                                                <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center">
                                                    <FileCheck className="w-8 h-8 text-primary" />
                                                </div>
                                                <h4 className="font-bold text-primary text-lg">Verification</h4>
                                                <p className="text-sm text-text-secondary">
                                                    Review extracted data in split-screen interface
                                                </p>
                                            </div>

                                            <div className="flex flex-col items-center text-center space-y-3">
                                                <div className="w-16 h-16 bg-accent-light rounded-full flex items-center justify-center">
                                                    <Save className="w-8 h-8 text-accent" />
                                                </div>
                                                <h4 className="font-bold text-primary text-lg">Edit & Save</h4>
                                                <p className="text-sm text-text-secondary">
                                                    Correct data across 4 pages and save
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        )}

                        {appState === 'loading' && <ProcessingScreen />}
                    </div>
                </main>
            )}

            {/* Verification - Full viewport */}
            {appState === 'verification' && (
                <main className="flex-1 overflow-hidden">
                    <VerificationPanel />
                </main>
            )}
        </div>
    );
};