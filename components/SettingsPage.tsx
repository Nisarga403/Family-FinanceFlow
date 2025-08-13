
import React from 'react';
import { SettingsIcon, PencilIcon } from './icons/Icons';

type Theme = 'light' | 'dark';

interface SettingsPageProps {
    theme: Theme;
    onThemeChange: (theme: Theme) => void;
    user: { email: string } | null;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ theme, onThemeChange, user }) => {
    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-primary-50 dark:bg-primary-950/50 text-primary dark:text-primary-400 rounded-lg">
                    <SettingsIcon />
                </div>
                <div>
                    <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200">Settings</h2>
                    <p className="text-slate-600 dark:text-slate-400">Manage your profile and application settings.</p>
                </div>
            </div>
            
            <div className="space-y-8 max-w-2xl">
                <div className="animate-fade-in-up">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4">Profile Information</h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-6">This is where your personal details will be managed. (Functionality coming soon).</p>
                    <div className="space-y-4 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                            <div className="flex justify-between items-center">
                            <div>
                                <label className="text-sm font-medium text-slate-500 dark:text-slate-400">Full Name</label>
                                <p className="text-slate-800 dark:text-slate-200 font-semibold">{user ? user.email.split('@')[0] : 'Guest User'}</p>
                            </div>
                            <button className="text-sm font-semibold text-primary dark:text-primary-400 hover:text-primary-600 disabled:opacity-50 flex items-center gap-1" disabled><PencilIcon className="h-3.5 w-3.5" /> Edit</button>
                        </div>
                        <div className="flex justify-between items-center">
                            <div>
                                <label className="text-sm font-medium text-slate-500 dark:text-slate-400">Email Address</label>
                                <p className="text-slate-800 dark:text-slate-200 font-semibold">{user ? user.email : 'guest@example.com'}</p>
                            </div>
                            <button className="text-sm font-semibold text-primary dark:text-primary-400 hover:text-primary-600 disabled:opacity-50 flex items-center gap-1" disabled><PencilIcon className="h-3.5 w-3.5" /> Edit</button>
                        </div>
                    </div>
                </div>

                <div className="animate-fade-in-up" style={{animationDelay: '100ms'}}>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4">Account</h3>
                     <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                        <h4 className="font-semibold text-slate-700 dark:text-slate-300">Authentication</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{user ? `You are signed in as ${user.email}.` : "You are currently using the app as a guest. Sign up to save your data."}</p>
                    </div>
                </div>

                <div className="animate-fade-in-up" style={{animationDelay: '200ms'}}>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4">Theme</h3>
                    <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                        <h4 className="font-semibold text-slate-700 dark:text-slate-300">Appearance</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 mb-4">Choose how the application looks.</p>
                        <div className="flex items-center gap-2 p-1 bg-slate-200 dark:bg-slate-700/70 rounded-lg">
                            <button
                                onClick={() => onThemeChange('light')}
                                className={`w-1/2 py-2 rounded-md text-sm font-semibold flex items-center justify-center gap-2 transition-colors duration-200 ${
                                    theme === 'light' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-300/50 dark:hover:bg-slate-600/40'
                                }`}
                            >
                                Light
                            </button>
                            <button
                                onClick={() => onThemeChange('dark')}
                                className={`w-1/2 py-2 rounded-md text-sm font-semibold flex items-center justify-center gap-2 transition-colors duration-200 ${
                                    theme === 'dark' ? 'bg-slate-800 text-primary-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-600/40'
                                }`}
                            >
                                Dark
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
