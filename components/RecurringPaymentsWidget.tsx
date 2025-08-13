import React, { useState, useMemo } from 'react';
import { RecurringPayment } from '../types';
import { TrashIcon, CalendarClockIcon, VolumeUpIcon } from './icons/Icons';

interface RecurringPaymentsWidgetProps {
    payments: RecurringPayment[];
    onAddPayment: (payment: Omit<RecurringPayment, 'id'>) => void;
    onDeletePayment: (id: number) => void;
}

const RecurringPaymentsWidget: React.FC<RecurringPaymentsWidgetProps> = ({ payments, onAddPayment, onDeletePayment }) => {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [dueDay, setDueDay] = useState('');
    const [isSpeaking, setIsSpeaking] = useState(false);

    const sortedPayments = useMemo(() => {
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();

        return payments.map(p => {
            let nextDueDate = new Date(currentYear, currentMonth, p.dueDay);
            if (nextDueDate.getDate() < today.getDate()) {
                 nextDueDate.setMonth(nextDueDate.getMonth() + 1);
            }
            return { ...p, nextDueDate };
        }).sort((a, b) => a.nextDueDate.getTime() - b.nextDueDate.getTime());
    }, [payments]);
    
    const handleReadAloud = () => {
        if (isSpeaking || !('speechSynthesis' in window)) {
            if (!('speechSynthesis' in window)) {
                alert('Sorry, your browser does not support voice notifications.');
            }
            return;
        }

        const today = new Date();
        const billsDueSoon = sortedPayments.filter(p => {
            const daysUntilDue = Math.ceil((p.nextDueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
            return daysUntilDue >= 0 && daysUntilDue <= 7;
        });

        let textToSpeak;
        if (billsDueSoon.length === 0) {
            textToSpeak = "You have no bills due within the next 7 days.";
        } else {
            const billCount = billsDueSoon.length;
            const billPlural = billCount === 1 ? 'bill' : 'bills';
            const billDetails = billsDueSoon.map(p => 
                `${p.description} for ${p.amount} rupees is due on ${p.nextDueDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}`
            ).join('. ');
            textToSpeak = `You have ${billCount} upcoming ${billPlural} this week. ${billDetails}.`;
        }
        
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.lang = 'en-US';
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = (e) => {
            console.error('Speech synthesis error:', e);
            setIsSpeaking(false);
        };

        window.speechSynthesis.speak(utterance);
    };


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (description && amount && dueDay) {
            onAddPayment({
                description,
                amount: parseFloat(amount),
                dueDay: parseInt(dueDay, 10),
            });
            setDescription('');
            setAmount('');
            setDueDay('');
        }
    };

    return (
        <div className="bg-white dark:bg-slate-800/30 rounded-2xl shadow-sm p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 flex items-center justify-center bg-primary-50 dark:bg-primary-950 text-primary dark:text-primary-400 rounded-lg">
                        <CalendarClockIcon />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">Upcoming Bills</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Track your recurring payments and subscriptions.</p>
                    </div>
                </div>
                <button
                    onClick={handleReadAloud}
                    disabled={isSpeaking}
                    className="p-2.5 rounded-full text-primary bg-primary-50 hover:bg-primary-100 dark:bg-primary-950 dark:text-primary-400 dark:hover:bg-primary-900 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed transition-colors"
                    aria-label="Read upcoming bills aloud"
                >
                    <VolumeUpIcon className={isSpeaking ? 'animate-pulse' : ''} />
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Form to add a payment */}
                <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 h-fit">
                    <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-4">Add New Bill</h4>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="billDescription" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
                            <input
                                id="billDescription"
                                type="text"
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                placeholder="e.g., Netflix Subscription"
                                className="w-full px-4 py-2 bg-white dark:bg-slate-900/70 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-shadow"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                             <div>
                                <label htmlFor="billAmount" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Amount (₹)</label>
                                <input
                                    id="billAmount"
                                    type="number"
                                    value={amount}
                                    onChange={e => setAmount(e.target.value)}
                                    placeholder="e.g., 799"
                                    className="w-full px-4 py-2 bg-white dark:bg-slate-900/70 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-shadow"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="dueDay" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Due Day</label>
                                <input
                                    id="dueDay"
                                    type="number"
                                    min="1"
                                    max="31"
                                    value={dueDay}
                                    onChange={e => setDueDay(e.target.value)}
                                    placeholder="e.g., 15"
                                    className="w-full px-4 py-2 bg-white dark:bg-slate-900/70 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-shadow"
                                    required
                                />
                            </div>
                        </div>
                        <button type="submit" className="w-full py-2.5 px-4 bg-gradient-to-r from-primary to-primary-400 text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:from-primary-600 hover:to-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200">
                            Add Bill
                        </button>
                    </form>
                </div>

                {/* List of payments */}
                <div className="space-y-3">
                    {sortedPayments.length > 0 ? (
                        sortedPayments.map((p, index) => {
                            const daysUntilDue = Math.ceil((p.nextDueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                            const isDueSoon = daysUntilDue <= 7 && daysUntilDue >= 0;

                            return (
                                <div 
                                    key={p.id} 
                                    className="flex items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 group animate-fade-in-up hover:shadow-md hover:border-primary/40 dark:hover:border-primary/70 hover:-translate-x-1 transition-all duration-200"
                                    style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'backwards' }}
                                >
                                    <div className={`w-2 h-10 rounded-full mr-3 ${isDueSoon ? 'bg-yellow-400' : 'bg-slate-300 dark:bg-slate-600'}`}></div>
                                    <div className="flex-1">
                                        <p className="font-medium text-slate-800 dark:text-slate-200">{p.description}</p>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">
                                            Due on {p.nextDueDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-slate-700 dark:text-slate-300">₹{p.amount.toLocaleString('en-IN')}</p>
                                        {isDueSoon && <p className="text-xs font-semibold text-yellow-600 dark:text-yellow-400">Due in {daysUntilDue} day{daysUntilDue !== 1 && 's'}</p>}
                                    </div>
                                    <button
                                        onClick={() => onDeletePayment(p.id)}
                                        className="ml-4 p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-200 dark:hover:text-slate-200 dark:hover:bg-slate-700 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
                                        aria-label={`Delete bill ${p.description}`}
                                    >
                                        <TrashIcon />
                                    </button>
                                </div>
                            );
                        })
                    ) : (
                        <div className="flex items-center justify-center h-full bg-slate-50 dark:bg-slate-800/50 rounded-lg p-8">
                             <p className="text-slate-500 dark:text-slate-400 text-center">No upcoming bills. Add one to start tracking!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RecurringPaymentsWidget;