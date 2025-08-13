

// This service now communicates with the backend API.

import { jwtDecode } from 'jwt-decode';
import { Transaction, Budget, Goal, RecurringPayment, Account, Investment, Debt, FamilyMember } from '../types';

const API_URL = 'http://localhost:3001/api';
const TOKEN_KEY = 'finance_app_token';

interface UserData {
    transactions: Transaction[];
    budgets: Budget[];
    familyMembers: FamilyMember[];
    goals: Goal[];
    recurringPayments: RecurringPayment[];
    accounts: Account[];
    investments: Investment[];
    debts: Debt[];
}

interface AuthResponse {
    token: string;
    message?: string;
}

interface DecodedToken {
    email: string;
    iat: number;
    exp: number;
}

const handleResponse = async (response: Response) => {
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'An error occurred from the server.');
    }
    return data;
};

// A centralized fetch wrapper to handle network errors gracefully.
const makeApiRequest = async (url: string, options?: RequestInit) => {
    try {
        const response = await fetch(url, options);
        return handleResponse(response);
    } catch (error: any) {
        // This catches network errors e.g., "Failed to fetch" when the server is down.
        if (error instanceof TypeError && error.message.includes('fetch')) {
            throw new Error('Connection Failed: Backend Server Is Not Responding.\n\nThis is almost always a configuration issue in the `backend/.env` file.\n\n**Here’s how to fix it:**\n\n1.  **Check the Backend Terminal:** Open the terminal where you ran `npm start`. It will show the *real* error message (like `Access denied` or `API_KEY not set`).\n\n2.  **Fix Your `.env` File:** Open `backend/.env` and correct the value mentioned in the terminal error. The `README.md` has a copy-paste example for you.\n\n3.  **Restart the Backend:** Stop the server (`Ctrl + C`), then start it again (`npm start`).\n\n4.  **Confirm Success:** Wait until you see `Backend server is running...` in the terminal before trying to sign in again.');
        }
        // Re-throw other errors (e.g., from handleResponse for a 401 or 500 status)
        throw error;
    }
};

export const signUp = async (email: string, password: string): Promise<{user: {email: string}, message?: string}> => {
    const data: AuthResponse = await makeApiRequest(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });
    localStorage.setItem(TOKEN_KEY, data.token);
    return { user: { email }, message: data.message };
};

export const signIn = async (email: string, password: string): Promise<{user: {email: string}}> => {
    const data: AuthResponse = await makeApiRequest(`${API_URL}/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });
    localStorage.setItem(TOKEN_KEY, data.token);
    return { user: { email } };
};

export const signOut = () => {
    localStorage.removeItem(TOKEN_KEY);
};

export const getCurrentUser = (): { email: string } | null => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return null;

    try {
        const decoded: DecodedToken = jwtDecode(token);
        // Check if token is expired
        if (decoded.exp * 1000 < Date.now()) {
            signOut();
            return null;
        }
        return { email: decoded.email };
    } catch (error) {
        console.error("Invalid token:", error);
        signOut();
        return null;
    }
};

const getAuthHeader = (): { [key: string]: string } => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) throw new Error("No auth token found. Please sign in.");
    return { 'Authorization': `Bearer ${token}` };
};

export const loadUserData = async (): Promise<UserData | null> => {
    return makeApiRequest(`${API_URL}/data`, {
        headers: {
            ...getAuthHeader(),
            'Content-Type': 'application/json'
        },
    });
};

export const saveUserData = async (data: Partial<UserData>): Promise<void> => {
    try {
        await makeApiRequest(`${API_URL}/data`, {
            method: 'PUT',
            headers: {
                ...getAuthHeader(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
    } catch (error) {
        // Fail silently to provide a smoother UX for autosave.
        // Data remains in the frontend state and will be retried on the next change.
        console.error("Error saving user data (will retry automatically):", error);
    }
};