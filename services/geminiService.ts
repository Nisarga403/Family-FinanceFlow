import { Transaction, DreamPlan, ChatMessage } from '../types';

const API_BASE_URL = 'http://localhost:3001/api/ai';

const getToken = () => localStorage.getItem('finance_app_token');

// A centralized fetch wrapper to handle authorized API requests to our backend
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
    const token = getToken();
    if (!token) {
        // This case should ideally be handled by the UI (e.g., redirect to login)
        throw new Error("Authentication required. Please sign in.");
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                ...options.headers,
            },
        });

        if (!response.ok) {
            // This logic is for when the server responds, but with an error status (4xx, 5xx).
            // The backend's AI_ERROR_MESSAGE will be caught here.
            const errorData = await response.json().catch(() => ({ message: 'An unknown API error occurred.' }));
            throw new Error(errorData.message);
        }

        // For video proxy, we need the raw response to get the blob
        if (response.headers.get('Content-Type')?.includes('video')) {
            return response.blob();
        }
        
        return response.json();

    } catch (error: any) {
        // This logic is for when the fetch itself fails (e.g., network error, server down).
        if (error instanceof TypeError && error.message.includes('fetch')) {
            throw new Error('Connection Failed: AI Service Is Not Responding.\n\nThis is often due to an issue with the backend server or the Google Gemini API Key.\n\n**Here’s how to fix it:**\n\n1.  **Check the Backend Terminal:** Open the terminal where you ran `npm start`. It will show the *real* error message (like `FATAL ERROR: API_KEY is not defined`).\n\n2.  **Fix Your `backend/.env` File:** Open `backend/.env` and ensure the `API_KEY` is correct. Get a free key from Google AI Studio.\n\n3.  **Restart the Backend:** Stop the server (`Ctrl + C`), then start it again (`npm start`).\n\n4.  **Confirm Success:** Wait until you see `Backend server is running...` in the terminal before trying the AI feature again.');
        }
        // Re-throw other errors (e.g., from the !response.ok block)
        throw error;
    }
};


export const getFinancialTip = async (transactions: Transaction[]): Promise<{ tip: string }> => {
    return apiRequest('/financial-tip', {
        method: 'POST',
        body: JSON.stringify({ transactions }),
    });
};

export const getDreamPlan = async (dreamDescription: string): Promise<{ plan: DreamPlan; imageUrl: string }> => {
    return apiRequest('/dream-plan', {
        method: 'POST',
        body: JSON.stringify({ dreamDescription }),
    });
};

export const generateVideoStory = async (prompt: string): Promise<{ videoUri: string }> => {
    return apiRequest('/video-story', {
        method: 'POST',
        body: JSON.stringify({ prompt }),
    });
};

export const fetchVideoBlobFromProxy = async (videoUri: string): Promise<Blob> => {
    const encodedUri = encodeURIComponent(videoUri);
    // This returns a blob directly
    return apiRequest(`/video-proxy?uri=${encodedUri}`) as Promise<Blob>;
};

export const getChatResponse = async (history: ChatMessage[]): Promise<{ text: string }> => {
     return apiRequest('/chat', {
        method: 'POST',
        body: JSON.stringify({ history }),
    });
};
