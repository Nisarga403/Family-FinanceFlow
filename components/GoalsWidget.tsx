import React, { useState } from 'react';
import { Goal } from '../types';
import { TrashIcon, PencilIcon, GoalIcon } from './icons/Icons';

interface GoalsWidgetProps {
    goals: Goal[];
    onAddGoal: (goal: Omit<Goal, 'id' | 'currentAmount'>) => void;
    onUpdateGoal: (id: number, updatedValues: Partial<Omit<Goal, 'id'>>) => void;
    onDeleteGoal: (id: number) => void;
}

const GoalItem: React.FC<{
    goal: Goal;
    onUpdate: GoalsWidgetProps['onUpdateGoal'];
    onDelete: GoalsWidgetProps['onDeleteGoal'];
}> = ({ goal, onUpdate, onDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [currentAmount, setCurrentAmount] = useState(goal.currentAmount);

    const percentage = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
    const progressColor = 'bg-primary';

    const handleUpdate = () => {
        onUpdate(goal.id, { currentAmount: Number(currentAmount) || 0 });
        setIsEditing(false);
    };

    return (
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 transition-all duration-300 hover:shadow-md hover:border-primary/50 dark:hover:border-primary/70 group">
            <div className="flex justify-between items-start">
                <p className="font-semibold text-slate-700 dark:text-slate-300">{goal.name}</p>
                <button
                    onClick={() => onDelete(goal.id)}
                    className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-200 dark:hover:text-slate-200 dark:hover:bg-slate-700 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
                    aria-label={`Delete goal ${goal.name}`}
                >
                    <TrashIcon />
                </button>
            </div>
            <div className="text-sm mt-2 flex items-center">
                {isEditing ? (
                     <input
                        type="number"
                        value={currentAmount}
                        onChange={(e) => setCurrentAmount(Number(e.target.value))}
                        onBlur={handleUpdate}
                        onKeyDown={(e) => e.key === 'Enter' && handleUpdate()}
                        className="w-28 px-1 py-0 text-left bg-white dark:bg-slate-800 border-b-2 border-primary"
                        autoFocus
                    />
                ) : (
                    <span onClick={() => setIsEditing(true)} className="font-bold text-slate-800 dark:text-slate-200 cursor-pointer flex items-center">
                        ₹{goal.currentAmount.toLocaleString('en-IN')}
                        <PencilIcon className="w-3 h-3 ml-1.5 text-slate-400 group-hover:text-primary" />
                    </span>
                )}
                
                <span className="text-slate-500 dark:text-slate-400 mx-1.5"> / </span>
                <span className="text-slate-500 dark:text-slate-400">₹{goal.targetAmount.toLocaleString('en-IN')}</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 relative overflow-hidden mt-2">
                <div
                    className={`h-2.5 rounded-full transition-all duration-700 ease-out ${progressColor}`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                ></div>
            </div>
        </div>
    )
}

const GoalsWidget: React.FC<GoalsWidgetProps> = ({ goals, onAddGoal, onUpdateGoal, onDeleteGoal }) => {
    const [name, setName] = useState('');
    const [targetAmount, setTargetAmount] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name && targetAmount) {
            onAddGoal({ name, targetAmount: parseFloat(targetAmount) });
            setName('');
            setTargetAmount('');
        }
    };

    return (
        <div className="bg-white dark:bg-slate-800/30 rounded-2xl shadow-sm p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 flex items-center justify-center bg-primary-50 dark:bg-primary-950 text-primary dark:text-primary-400 rounded-lg">
                    <GoalIcon />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">Financial Goals</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Set and track your savings goals.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Form to add a goal */}
                <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 h-fit">
                    <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-4">Add a New Goal</h4>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="goalName" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Goal Name</label>
                            <input
                                id="goalName"
                                type="text"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                placeholder="e.g., New Car"
                                className="w-full px-4 py-2 bg-white dark:bg-slate-900/70 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-shadow"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="targetAmount" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Target Amount (₹)</label>
                            <input
                                id="targetAmount"
                                type="number"
                                value={targetAmount}
                                onChange={e => setTargetAmount(e.target.value)}
                                placeholder="e.g., 500000"
                                className="w-full px-4 py-2 bg-white dark:bg-slate-900/70 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-shadow"
                                required
                            />
                        </div>
                        <button type="submit" className="w-full py-2.5 px-4 bg-gradient-to-r from-primary to-primary-400 text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:from-primary-600 hover:to-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200">
                            Add Goal
                        </button>
                    </form>
                </div>

                {/* List of goals */}
                <div className="space-y-4">
                    {goals.length > 0 ? (
                        goals.map((goal, index) => (
                           <div 
                                key={goal.id} 
                                className="animate-fade-in-up" 
                                style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'backwards' }}
                            >
                                <GoalItem goal={goal} onUpdate={onUpdateGoal} onDelete={onDeleteGoal} />
                            </div>
                        ))
                    ) : (
                        <div className="flex items-center justify-center h-full bg-slate-50 dark:bg-slate-800/50 rounded-lg p-8">
                             <p className="text-slate-500 dark:text-slate-400 text-center">You haven't set any goals yet. Add one to start tracking your progress!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GoalsWidget;