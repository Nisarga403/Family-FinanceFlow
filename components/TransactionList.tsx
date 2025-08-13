import React from 'react';
import { Transaction, TransactionType } from '../types';
import { TrashIcon, ArrowDownIcon, ArrowUpIcon } from './icons/Icons';

interface TransactionListProps {
    transactions: Transaction[];
    onDelete: (id: number) => void;
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions, onDelete }) => {
    if (transactions.length === 0) {
        return (
            <div className="text-center py-16 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <p className="text-slate-500 dark:text-slate-400">No transactions yet. Add one to get started!</p>
            </div>
        );
    }

    return (
        <div className="flow-root">
            <ul role="list" className="-my-4 divide-y divide-slate-200 dark:divide-slate-700">
                {transactions.map((t, index) => (
                    <li 
                        key={t.id} 
                        className="flex items-center py-4 group animate-fade-in-up"
                        style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'backwards' }}
                    >
                        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                             t.type === TransactionType.INCOME ? 'bg-primary-100 text-primary-700 dark:bg-primary-950 dark:text-primary-400' : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                        }`}>
                             {t.type === TransactionType.INCOME ? <ArrowUpIcon /> : <ArrowDownIcon />}
                        </div>
                        <div className="ml-4 flex-1">
                            <p className="text-md font-medium text-slate-900 dark:text-slate-200">{t.description}</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                {t.category}
                                {t.member && t.member !== 'Me' && <span className="ml-2 pl-2 border-l border-slate-300 dark:border-slate-600 font-medium">{t.member}</span>}
                            </p>
                        </div>
                        <div className="flex items-center">
                            <div className="text-right">
                                <p className={`text-md font-semibold ${t.type === TransactionType.INCOME ? 'text-primary-700 dark:text-primary-400' : 'text-slate-700 dark:text-slate-300'}`}>
                                    {t.type === TransactionType.INCOME ? '+' : '-'}₹{t.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">{t.date.toLocaleDateString()}</p>
                            </div>
                            <button
                                onClick={() => onDelete(t.id)}
                                className="ml-4 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 dark:hover:text-slate-200 dark:hover:bg-slate-700 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
                                aria-label={`Delete transaction ${t.description}`}
                            >
                                <TrashIcon />
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TransactionList;