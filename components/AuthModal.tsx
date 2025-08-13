

import React, { useState } from 'react';
import { signUp, signIn } from '../services/authService';
import { LogoIcon, CloseIcon } from './icons/Icons';

interface AuthModalProps {
    mode: 'signin' | 'signup';
    onClose: () => void;
    onAuthSuccess: (user: { email: string }) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ mode, onClose, onAuthSuccess }) => {
    const [currentMode, setCurrentMode] = useState(mode);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            let result;
            if (currentMode === 'signup') {
                result = await signUp(email, password);
                alert(result.message || 'Signup successful!');
            } else {
                result = await signIn(email, password);
            }
            onAuthSuccess(result.user);
            onClose();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };
    
    const title = currentMode === 'signin' ? 'Sign In to Your Account' : 'Create a New Account';
    const buttonText = currentMode === 'signin' ? 'Sign In' : 'Sign Up';
    const switchPrompt = currentMode === 'signin' ? "Don't have an account?" : "Already have an account?";
    const switchLinkText = currentMode === 'signin' ? 'Sign Up' : 'Sign In';
    const switchMode = () => {
        setCurrentMode(currentMode === 'signin' ? 'signup' : 'signin');
        setError(null);
        setPassword('');
    };

    return (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="auth-title">
            <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl relative animate-fade-in-up" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 p-2 text-slate-500 hover:text-slate-800 rounded-full hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-700" aria-label="Close auth modal">
                    <CloseIcon />
                </button>
                <div className="p-8 sm:p-10">
                    <div className="flex justify-center mb-6">
                       <LogoIcon />
                    </div>
                    <h2 id="auth-title" className="text-2xl font-bold text-center text-slate-800 dark:text-slate-200 mb-2">{title}</h2>
                    <p className="text-center text-slate-600 dark:text-slate-400 mb-8">to continue to Family FinanceFlow</p>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email address</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-shadow"
                                placeholder="you@example.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-shadow"
                                placeholder="••••••••"
                            />
                        </div>
                        
                        {error && <p className="text-sm text-red-600 dark:text-red-400 whitespace-pre-line" role="alert">{error}</p>}

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading || !email || !password}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
                            >
                                {isLoading ? 'Processing...' : buttonText}
                            </button>
                        </div>
                    </form>

                    <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
                        {switchPrompt}{' '}
                        <button onClick={switchMode} className="font-semibold text-primary hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-500">
                           {switchLinkText}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;