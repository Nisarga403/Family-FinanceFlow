import React from 'react';
import { InvestmentsIcon } from './icons/Icons';

const InvestmentsPage: React.FC = () => {
    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200">Investments</h2>
             <div className="flex flex-col items-center justify-center h-[500px] bg-slate-50 dark:bg-slate-800/50 rounded-2xl text-center p-8">
                <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-950/50 flex items-center justify-center mb-6 animate-gentle-pulse">
                    <InvestmentsIcon className="text-primary dark:text-primary-400"/>
                </div>
                <h3 className="text-2xl font-semibold text-slate-700 dark:text-slate-300">Feature Coming Soon</h3>
                <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-md">
                    Track your stocks, mutual funds, and other investments to see your portfolio grow.
                </p>
            </div>
        </div>
    );
};

export default InvestmentsPage;