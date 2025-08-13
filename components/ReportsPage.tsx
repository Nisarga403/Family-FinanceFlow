import React from 'react';
import { ReportsIcon } from './icons/Icons';

const ReportsPage: React.FC = () => {
    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200">Financial Reports</h2>
            <div className="flex flex-col items-center justify-center h-[500px] bg-slate-50 dark:bg-slate-800/50 rounded-2xl text-center p-8">
                <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-950/50 flex items-center justify-center mb-6 animate-gentle-pulse">
                    <ReportsIcon className="text-primary dark:text-primary-400"/>
                </div>
                <h3 className="text-2xl font-semibold text-slate-700 dark:text-slate-300">Feature Coming Soon</h3>
                <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-md">
                    Dive deep into your finances with detailed reports on your spending, income, and net worth over time.
                </p>
            </div>
        </div>
    );
};

export default ReportsPage;