import React, { useState, useCallback } from 'react';
import { Transaction } from '../types';
import { getFinancialTip } from '../services/geminiService';
import { SparklesIcon, LightBulbIcon } from './icons/Icons';

interface FinancialTipProps {
    transactions: Transaction[];
}

const FinancialTip: React.FC<FinancialTipProps> = ({ transactions }) => {
    const [tip, setTip] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const handleGetTip = useCallback(async () => {
        setIsLoading(true);
        setError('');
        setTip('');
        try {
            const response = await getFinancialTip(transactions);
            setTip(response.tip);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch a financial tip. Please try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [transactions]);

    return (
        <div className="flex flex-col items-center text-center p-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary-400 flex items-center justify-center shadow-lg mb-4">
                <LightBulbIcon className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-2">Your AI Financial Coach</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md">
                Get a personalized financial tip based on your recent spending habits. Our AI will analyze your data and provide an actionable suggestion.
            </p>

            <button
                onClick={handleGetTip}
                disabled={isLoading}
                className="inline-flex items-center px-8 py-4 border border-transparent text-base font-semibold rounded-full shadow-md text-white bg-gradient-to-r from-primary to-primary-400 hover:from-primary-600 hover:to-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-slate-400 disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
            >
                {isLoading ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Analyzing your habits...
                    </>
                ) : (
                    <>
                        <SparklesIcon />
                        <span className="ml-2">Generate My Tip</span>
                    </>
                )}
            </button>
            
            <div className="mt-10 w-full max-w-2xl min-h-[120px]">
            {tip && !isLoading && (
                <div className="p-6 bg-primary-50 dark:bg-primary-950/40 border-2 border-primary-100 dark:border-primary-800/50 rounded-2xl text-left animate-fade-in shadow-lg">
                     <p className="text-lg text-slate-800 dark:text-slate-200">{tip}</p>
                </div>
            )}
            
            {error && !isLoading && (
                 <div className="p-6 bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl text-left animate-fade-in shadow-lg">
                    <p className="text-lg text-slate-700 dark:text-slate-300">{error}</p>
                </div>
            )}
            </div>
        </div>
    );
};

export default FinancialTip;