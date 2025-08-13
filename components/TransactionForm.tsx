import React, { useState } from 'react';
import { Transaction, TransactionType, FamilyMember } from '../types';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../constants';

interface TransactionFormProps {
    onSubmit: (transaction: Omit<Transaction, 'id'>) => void;
    familyMembers: FamilyMember[];
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onSubmit, familyMembers }) => {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
    const [category, setCategory] = useState(EXPENSE_CATEGORIES[0]);
    const [member, setMember] = useState('Me');

    const handleTypeChange = (newType: TransactionType) => {
        setType(newType);
        setCategory(newType === TransactionType.INCOME ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0]);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!description || !amount || !date || !category) {
            alert('Please fill out all fields.');
            return;
        }
        onSubmit({
            description,
            amount: parseFloat(amount),
            date: new Date(date),
            type,
            category,
            member,
        });
        setDescription('');
        setAmount('');
        setDate(new Date().toISOString().split('T')[0]);
        setMember('Me');
        setType(TransactionType.EXPENSE);
        setCategory(EXPENSE_CATEGORIES[0]);
    };

    const categories = type === TransactionType.INCOME ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

    return (
        <form onSubmit={handleSubmit} className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 space-y-6">
            <div className="relative flex bg-slate-200 dark:bg-slate-700 rounded-full p-1">
                <button
                    type="button"
                    onClick={() => handleTypeChange(TransactionType.EXPENSE)}
                    className={`w-1/2 py-2.5 text-sm font-semibold z-10 transition-colors duration-300 ${type === TransactionType.EXPENSE ? 'text-slate-700 dark:text-slate-200' : 'text-slate-500 dark:text-slate-400'}`}
                >
                    Expense
                </button>
                <button
                    type="button"
                    onClick={() => handleTypeChange(TransactionType.INCOME)}
                    className={`w-1/2 py-2.5 text-sm font-semibold z-10 transition-colors duration-300 ${type === TransactionType.INCOME ? 'text-primary-700 dark:text-primary-400' : 'text-slate-500 dark:text-slate-400'}`}
                >
                    Income
                </button>
                 <div className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white dark:bg-slate-800 rounded-full shadow-sm transition-transform duration-300 ease-in-out
                    ${type === TransactionType.INCOME ? 'translate-x-[calc(100%-4px)]' : 'translate-x-1'}`}>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div className="md:col-span-2">
                    <label htmlFor="description" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
                    <input
                        id="description"
                        type="text"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        placeholder="e.g., Coffee, Paycheck"
                        className="w-full px-4 py-2 bg-white dark:bg-slate-900/70 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-shadow"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Amount</label>
                    <input
                        id="amount"
                        type="number"
                        step="0.01"
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full px-4 py-2 bg-white dark:bg-slate-900/70 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-shadow"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="date" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date</label>
                    <input
                        id="date"
                        type="date"
                        value={date}
                        onChange={e => setDate(e.target.value)}
                        className="w-full px-4 py-2 bg-white dark:bg-slate-900/70 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-shadow"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
                    <select
                        id="category"
                        value={category}
                        onChange={e => setCategory(e.target.value)}
                        className="w-full px-4 py-2 bg-white dark:bg-slate-900/70 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-shadow"
                    >
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="member" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Family Member</label>
                    <select
                        id="member"
                        value={member}
                        onChange={e => setMember(e.target.value)}
                        className="w-full px-4 py-2 bg-white dark:bg-slate-900/70 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-shadow"
                    >
                        <option value="Me">Me</option>
                        {familyMembers.map(m => (
                            <option key={m.id} value={m.name}>{m.name}</option>
                        ))}
                    </select>
                </div>
            </div>
            <button type="submit" className="w-full py-3 px-4 bg-gradient-to-r from-primary to-primary-400 text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:from-primary-600 hover:to-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200">
                Add Transaction
            </button>
        </form>
    );
};

export default TransactionForm;