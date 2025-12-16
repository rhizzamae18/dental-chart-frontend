import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002';

export interface UploadResponse {
    success: boolean;
    patientId?: string;
    dentalChartId?: string;
    extractedData?: Record<string, unknown>;
    error?: string;
    detail?: string;
}

/**
 * Upload page 1 form data (Patient Information & Medical History)
 * @param file - The image or PDF file to upload
 * @returns Response with patient ID and extracted data
 */
export const uploadPage1 = async (file: File): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await axios.post<UploadResponse>(
            `${API_URL}/api/upload/page-1`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );

        return response.data;
    } catch (error: unknown) {
        console.error('Error uploading page 1:', error);

        if (axios.isAxiosError(error) && error.response?.data) {
            return error.response.data;
        }

        return {
            success: false,
            error: 'Network error',
            detail: error instanceof Error ? error.message : 'Failed to connect to server',
        };
    }
};

/**
 * Upload page 2 form data (Dental History & Clinical Findings)
 * @param file - The image or PDF file to upload
 * @param patientId - The patient ID from page 1
 * @returns Response with dental chart ID and extracted data
 */
export const uploadPage2 = async (
    file: File,
    patientId: string
): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('patientId', patientId);

    try {
        const response = await axios.post<UploadResponse>(
            `${API_URL}/api/upload/page-2`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );

        return response.data;
    } catch (error: unknown) {
        console.error('Error uploading page 2:', error);

        if (axios.isAxiosError(error) && error.response?.data) {
            return error.response.data;
        }

        return {
            success: false,
            error: 'Network error',
            detail: error instanceof Error ? error.message : 'Failed to connect to server',
        };
    }
};

/**
 * Upload page 3 form data (Informed Consent)
 * @param file - The image or PDF file to upload
 * @param patientId - The patient ID from page 1
 * @returns Response with extracted data
 */
export const uploadPage3 = async (
    file: File,
    patientId: string
): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('patientId', patientId);

    try {
        const response = await axios.post<UploadResponse>(
            `${API_URL}/api/upload/page-3`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );

        return response.data;
    } catch (error: unknown) {
        console.error('Error uploading page 3:', error);

        if (axios.isAxiosError(error) && error.response?.data) {
            return error.response.data;
        }

        return {
            success: false,
            error: 'Network error',
            detail: error instanceof Error ? error.message : 'Failed to connect to server',
        };
    }
};

/**
 * Upload page 4 form data (Treatment Records)
 * @param file - The image or PDF file to upload
 * @param patientId - The patient ID from page 1
 * @returns Response with extracted data
 */
export const uploadPage4 = async (
    file: File,
    patientId: string
): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('patientId', patientId);

    try {
        const response = await axios.post<UploadResponse>(
            `${API_URL}/api/upload/page-4`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );

        return response.data;
    } catch (error: unknown) {
        console.error('Error uploading page 4:', error);

        if (axios.isAxiosError(error) && error.response?.data) {
            return error.response.data;
        }

        return {
            success: false,
            error: 'Network error',
            detail: error instanceof Error ? error.message : 'Failed to connect to server',
        };
    }
};
