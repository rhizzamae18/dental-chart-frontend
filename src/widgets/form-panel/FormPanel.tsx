import { Save, ChevronLeft } from 'lucide-react'
import { useState, useEffect, useMemo, type FormEvent } from 'react';
import { useAppStore } from '@/shared/store/useAppStore';
import { SuccessModal } from '@/shared/ui/SuccessModal';

// Page 1 Forms
import { PatientInfoForm } from '@/features/edit-field/forms/PatientInfoForm';
import { DentalHistoryForm } from '@/features/edit-field/forms/DentalHistoryForm';
import { MedicalHistoryForm } from '@/features/edit-field/forms/MedicalHistoryForm';

// Page 2 Forms
import { ConsentTreatmentForm } from '@/features/edit-field/forms/ConsentTreatmentForm';
import { ConsentProceduresForm } from '@/features/edit-field/forms/ConsentProceduresForm';
import { SignaturesForm } from '@/features/edit-field/forms/SignaturesForm';

// Page 3 Forms
import { DentalChartForm } from '@/features/edit-field/forms/DentalChartForm';
import { ClinicalFindingsForm } from '@/features/edit-field/forms/ClinicalFindingsForm';

// Page 4 Forms
import { TreatmentRecordsForm } from '@/features/edit-field/forms/TreatmentRecordsForm';

const PAGE_TABS = {
    1: [
        { id: 'patient-info', label: 'Patient Info' },
        { id: 'dental-history', label: 'Dental History' },
        { id: 'medical-history', label: 'Medical History' },
    ],
    2: [
        { id: 'dental-chart', label: 'Dental Record Chart' },
        { id: 'clinical-findings', label: 'Clinical Findings' },
    ],
    3: [
        { id: 'informed-treatment', label: 'Informed Consent' },
        { id: 'consent-procedures', label: 'Procedures' },
        { id: 'signatures', label: 'Signatures' },
    ],
    4: [
        { id: 'treatment-records', label: 'Treatment Records' },
    ],
};

// ... all your imports stay the same ...

export const FormPanel = () => {
    const currentPage = useAppStore((state) => state.currentPage);
    const nextPage = useAppStore((state) => state.nextPage);
    const previousPage = useAppStore((state) => state.previousPage);
    const resetPage = useAppStore((state) => state.resetPage);
    const formData = useAppStore((state) => state.formData);
    const extractedData = useAppStore((state) => state.extractedData);

    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const handleCloseModal = () => {
        setShowSuccessModal(false);
        resetPage(); // Reset app state and go back to main page
    };

    const tabs = useMemo(() => PAGE_TABS[currentPage as keyof typeof PAGE_TABS] || [], [currentPage]);

    // Initialize activeTab with the first tab of the current page
    const defaultTab = useMemo(() => tabs[0]?.id || '', [tabs]);
    const [activeTab, setActiveTab] = useState(defaultTab);

    // Reset activeTab when defaultTab changes (i.e., when page changes)
    useEffect(() => {
        setActiveTab(defaultTab);
    }, [defaultTab]);

    function handleSaveAndNext(event: FormEvent<HTMLFormElement>): void {
        event.preventDefault();

        // If we're on page 4 (the last page), show success modal instead of incrementing
        if (currentPage === 4) {
            setShowSuccessModal(true);
        } else {
            nextPage();
        }
    }

    return (
        <form key={currentPage} onSubmit={handleSaveAndNext} className="flex flex-col h-full">
            {/* Tab Navigation - Scrollable on mobile */}
            <div className="px-4 sm:px-6 pt-3 sm:pt-4 flex-shrink-0">
                <div className="flex gap-1 border-b border-default overflow-x-auto scrollbar-hide">
                    {tabs.map((tab) => (
                        <button
                            type="button"
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap
                border-b-4 -mb-[1px]
                ${activeTab === tab.id
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-text-secondary hover:text-text-primary'
                                }
              `}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Form Content - Scrollable */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-3 sm:py-4">
                {/* Page 1 Forms */}
                {activeTab === 'patient-info' && currentPage === 1 && <PatientInfoForm />}
                {activeTab === 'dental-history' && <DentalHistoryForm />}
                {activeTab === 'medical-history' && <MedicalHistoryForm />}

                {/* Page 2 Forms - Dental Chart */}
                {activeTab === 'dental-chart' && currentPage === 2 && <DentalChartForm />}
                {activeTab === 'clinical-findings' && <ClinicalFindingsForm />}

                {/* Page 3 Forms - Informed Consent */}
                {activeTab === 'informed-treatment' && currentPage === 3 && <ConsentTreatmentForm />}
                {activeTab === 'consent-procedures' && <ConsentProceduresForm />}
                {activeTab === 'signatures' && <SignaturesForm />}

                {/* Page 4 Forms - Treatment Records */}
                {activeTab === 'treatment-records' && currentPage === 4 && <TreatmentRecordsForm />}
            </div>

            {/* Navigation Buttons - Fixed at bottom */}
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-default flex-shrink-0">
                <div className="flex gap-3">
                    {/* Previous Button */}
                    <button
                        type="button"
                        onClick={previousPage}
                        disabled={currentPage === 1}
                        className={`px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-medium rounded-lg transition-colors flex items-center justify-center gap-2 ${currentPage === 1
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        <ChevronLeft className="h-5 w-5" />
                        <span className="hidden sm:inline">Previous</span>
                    </button>

                    {/* Save & Next Button */}
                    <button
                        type="submit"
                        className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-primary text-white text-sm sm:text-base font-medium rounded-lg hover:bg-primary-hover transition-colors flex items-center justify-center gap-2"
                    >
                        {currentPage >= 4 ? (
                            <>
                                <span>Save & Finish</span>
                                <span>✓</span>
                            </>
                        ) : (
                            <>
                                <div className='flex space-x-2 items-center'>
                                    <Save className="h-5 w-5" />
                                    <h1>Save & Next Page →</h1>
                                </div>
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Success Modal */}
            <SuccessModal
                isOpen={showSuccessModal}
                onClose={handleCloseModal}
                formData={formData}
                extractedData={extractedData || {}}
            />
        </form>
    );
};