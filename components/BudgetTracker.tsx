import React, { useState } from 'react';
import { Budget, Transaction, TransactionType } from '../types';

interface BudgetTrackerProps {
    budgets: Budget[];
    transactions: Transaction[];
    onUpdateBudget: (category: string, amount: number) => void;
}

const BudgetItem: React.FC<{
    budget: Budget;
    spent: number;
    onUpdateBudget: (category: string, amount: number) => void;
}> = ({ budget, spent, onUpdateBudget }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [newAmount, setNewAmount] = useState(budget.amount);

    const percentage = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;
    const progressColor = percentage > 100 ? 'bg-slate-800 dark:bg-slate-500' : percentage > 80 ? 'bg-primary-800' : 'bg-primary-600';

    const handleUpdate = () => {
        onUpdateBudget(budget.category, parseFloat(String(newAmount)) || 0);
        setIsEditing(false);
    };
    
    return (
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/50 transition-all duration-300 hover:shadow-md hover:border-primary/50 dark:hover:border-primary/70">
            <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-slate-700 dark:text-slate-300">{budget.category}</span>
                <div className="text-sm cursor-pointer" onClick={() => !isEditing && setIsEditing(true)}>
                    <span className="font-bold text-slate-800 dark:text-slate-200">₹{spent.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    <span className="text-slate-500 dark:text-slate-400"> / </span>
                    {isEditing ? (
                        <input
                            type="number"
                            value={newAmount}
                            onChange={(e) => setNewAmount(parseFloat(e.target.value))}
                            onBlur={handleUpdate}
                            onKeyDown={(e) => e.key === 'Enter' && handleUpdate()}
                            className="w-24 px-1 py-0 text-right bg-white dark:bg-slate-800 border-b-2 border-primary"
                            autoFocus
                        />
                    ) : (
                        <span className="text-slate-500 dark:text-slate-400">₹{budget.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    )}
                </div>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 relative overflow-hidden">
                <div
                    className={`h-2.5 rounded-full transition-all duration-700 ease-out ${progressColor}`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                ></div>
            </div>
            {percentage > 100 && (
                <p className="text-xs text-slate-800 dark:text-slate-300 font-semibold text-right mt-1">
                    You've exceeded your budget by ₹{ (spent - budget.amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }!
                </p>
            )}
        </div>
    );
}


const BudgetTracker: React.FC<BudgetTrackerProps> = ({ budgets, transactions, onUpdateBudget }) => {
    
    const spentAmounts = budgets.reduce((acc, budget) => {
        const spent = transactions
            .filter(t => t.type === TransactionType.EXPENSE && t.category === budget.category)
            .reduce((sum, t) => sum + t.amount, 0);
        acc[budget.category] = spent;
        return acc;
    }, {} as Record<string, number>);

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200">Budget Tracker</h2>
             <p className="text-slate-600 dark:text-slate-400">
                Set spending limits for your categories and track your progress. Click on the budget amount to edit it.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {budgets.map((budget, index) => (
                    <div 
                        key={budget.category}
                        className="animate-fade-in-up"
                        style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'backwards' }}
                    >
                        <BudgetItem 
                            budget={budget} 
                            spent={spentAmounts[budget.category] || 0}
                            onUpdateBudget={onUpdateBudget}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BudgetTracker;