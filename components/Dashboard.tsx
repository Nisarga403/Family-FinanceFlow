import React, { useMemo } from 'react';
import { Transaction, TransactionType, Goal, RecurringPayment, FamilyHubMember, Gender, FamilyMember } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { BalanceIcon, IncomeIcon, ExpenseIcon, ArrowDownIcon, ArrowUpIcon, FamilyAvatar } from './icons/Icons';
import GoalsWidget from './GoalsWidget';
import RecurringPaymentsWidget from './RecurringPaymentsWidget';
import FamilyHub from './FamilyHub';

interface DashboardProps {
    theme: 'light' | 'dark';
    balance: number;
    totalIncome: number;
    totalExpenses: number;
    transactions: Transaction[];
    goals: Goal[];
    onAddGoal: (goal: Omit<Goal, 'id' | 'currentAmount'>) => void;
    onUpdateGoal: (id: number, updatedValues: Partial<Omit<Goal, 'id'>>) => void;
    onDeleteGoal: (id: number) => void;
    recurringPayments: RecurringPayment[];
    onAddRecurringPayment: (payment: Omit<RecurringPayment, 'id'>) => void;
    onDeleteRecurringPayment: (id: number) => void;
    familyMembers: FamilyMember[];
}

const SummaryCard: React.FC<{ title: string; amount: number; icon: React.ReactNode; gradient: string }> = ({ title, amount, icon, gradient }) => (
    <div className={`rounded-2xl p-6 text-white shadow-lg flex flex-col justify-between h-40 bg-gradient-to-br ${gradient} transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl`}>
        <div className="flex justify-between items-start">
            <p className="font-semibold">{title}</p>
            <div className="w-8 h-8 flex items-center justify-center bg-white/20 rounded-lg">
                {icon}
            </div>
        </div>
        <p className="text-3xl font-bold tracking-tight">
            {amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
        </p>
    </div>
);


const Dashboard: React.FC<DashboardProps> = ({ theme, balance, totalIncome, totalExpenses, transactions, goals, onAddGoal, onUpdateGoal, onDeleteGoal, recurringPayments, onAddRecurringPayment, onDeleteRecurringPayment, familyMembers }) => {
    
    const expenseData = useMemo(() => {
        const expenseByCategory = transactions
            .filter(t => t.type === TransactionType.EXPENSE)
            .reduce((acc, t) => {
                acc[t.category] = (acc[t.category] || 0) + t.amount;
                return acc;
            }, {} as Record<string, number>);

        return Object.entries(expenseByCategory)
            .map(([name, value]) => ({ name, value }))
            .sort((a,b) => b.value - a.value);
    }, [transactions]);
    
    const familyHubData: FamilyHubMember[] = useMemo(() => {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
        const recentExpenses = transactions.filter(t => 
            t.type === 'expense' && t.date >= thirtyDaysAgo
        );
    
        const getMemberData = (name: string) => {
            const memberExpenses = recentExpenses.filter(t => t.member === name);
            const totalSpent = memberExpenses.reduce((sum, t) => sum + t.amount, 0);
    
            const categorySpending = memberExpenses.reduce((acc, t) => {
                acc[t.category] = (acc[t.category] || 0) + t.amount;
                return acc;
            }, {} as Record<string, number>);
    
            const topCategory = Object.entries(categorySpending).sort((a, b) => b[1] - a[1])[0]?.[0];
    
            return { totalSpent, topCategory };
        };
    
        const meData = getMemberData('Me');
        
        const hubMembers: FamilyHubMember[] = [
            { id: 'me', name: 'Me', gender: Gender.OTHER, ...meData },
            ...familyMembers.map(member => ({
                ...member,
                ...getMemberData(member.name)
            }))
        ].slice(0, 5); // Limit to 5 total members for UI reasons
    
        return hubMembers;
    }, [transactions, familyMembers]);


    const COLORS = ['#9a3412', '#c2410c', '#ea580c', '#f97316', '#78716c', '#a8a29e'];

    const recentTransactions = transactions.slice(0, 5);

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 flex-shrink-0 flex items-center justify-center bg-primary-50 dark:bg-primary-950/50 rounded-lg p-1 animate-gentle-pulse">
                    <FamilyAvatar className="w-full h-full" />
                </div>
                <div>
                    <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200">Dashboard</h2>
                    <p className="text-slate-600 dark:text-slate-400">Welcome back! Here's a summary of your family's finances.</p>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <SummaryCard title="Current Balance" amount={balance} icon={<BalanceIcon />} gradient="from-primary-600 to-primary-800" />
                <SummaryCard title="Total Income" amount={totalIncome} icon={<IncomeIcon />} gradient="from-primary-400 to-primary-600" />
                <SummaryCard title="Total Expenses" amount={totalExpenses} icon={<ExpenseIcon />} gradient="from-slate-500 to-slate-700" />
            </div>

            <FamilyHub members={familyHubData} />

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl shadow-sm p-6 border border-white/20 dark:border-slate-800">
                    <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-4">Expense Breakdown</h3>
                     {expenseData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={expenseData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    innerRadius={80}
                                    outerRadius={120}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {expenseData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="focus:outline-none"/>
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value: number) => value.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                                    contentStyle={{
                                        background: theme === 'dark' ? 'rgba(30, 41, 59, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                                        backdropFilter: 'blur(5px)',
                                        border: theme === 'dark' ? '1px solid #334155' : '1px solid #e2e8f0',
                                        borderRadius: '0.75rem',
                                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
                                    }}
                                    cursor={{ fill: 'rgba(120, 113, 108, 0.1)'}}
                                />
                                <Legend iconSize={10} wrapperStyle={{fontSize: "14px", color: theme === 'dark' ? '#94a3b8' : '#475569' }}/>
                            </PieChart>
                        </ResponsiveContainer>
                     ) : (
                        <div className="flex items-center justify-center h-[300px] bg-slate-50/50 dark:bg-slate-800/30 rounded-lg">
                            <p className="text-slate-500 dark:text-slate-400 text-center px-4">Add some expenses to see a breakdown of your spending habits.</p>
                        </div>
                     )}
                </div>
                <div className="lg:col-span-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl shadow-sm p-6 border border-white/20 dark:border-slate-800">
                    <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-4">Recent Activity</h3>
                    {recentTransactions.length > 0 ? (
                        <ul className="space-y-4">
                            {recentTransactions.map(t => (
                                <li key={t.id} className="flex items-center space-x-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${t.type === 'income' ? 'bg-primary-100 text-primary-700 dark:bg-primary-950 dark:text-primary-400' : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300'}`}>
                                       {t.type === 'income' ? <ArrowUpIcon /> : <ArrowDownIcon />}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-slate-800 dark:text-slate-200">{t.description}</p>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">
                                            {t.category}
                                            {t.member && t.member !== 'Me' && <span className="ml-2 pl-2 border-l border-slate-300 dark:border-slate-600 font-medium">{t.member}</span>}
                                        </p>
                                    </div>
                                    <p className={`font-semibold ${t.type === 'income' ? 'text-primary-700 dark:text-primary-400' : 'text-slate-700 dark:text-slate-300'}`}>
                                        {t.type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                         <div className="flex items-center justify-center h-[278px] bg-slate-50/50 dark:bg-slate-800/30 rounded-lg">
                            <p className="text-slate-500 dark:text-slate-400 text-center px-4">Your latest transactions will appear here.</p>
                        </div>
                    )}
                </div>
            </div>
            
            <GoalsWidget
                goals={goals}
                onAddGoal={onAddGoal}
                onUpdateGoal={onUpdateGoal}
                onDeleteGoal={onDeleteGoal}
            />

            <RecurringPaymentsWidget
                payments={recurringPayments}
                onAddPayment={onAddRecurringPayment}
                onDeletePayment={onDeleteRecurringPayment}
            />

        </div>
    );
};

export default Dashboard;