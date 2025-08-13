

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Transaction, Budget, Goal, RecurringPayment, Account, Investment, Debt, FamilyMember, Gender, SimpleTab } from './types';
import { DEFAULT_BUDGETS } from './constants';
import Dashboard from './components/Dashboard';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import BudgetTracker from './components/BudgetTracker';
import FinancialTip from './components/FinancialTip';
import Chatbot from './components/Chatbot';
import FamilyPage from './components/FamilyPage';
import AccountsPage from './components/AccountsPage';
import InvestmentsPage from './components/InvestmentsPage';
import DebtsPage from './components/DebtsPage';
import ReportsPage from './components/ReportsPage';
import SettingsPage from './components/SettingsPage';
import HelpPage from './components/HelpPage';
import DreamPlannerPage from './components/DreamPlannerPage';
import VideoStoryPage from './components/VideoStoryPage';
import AuthModal from './components/AuthModal';
import * as authService from './services/authService';
import { DashboardIcon, TransactionIcon, BudgetIcon, LightBulbIcon, LogoIcon, FamilyIcon, AccountsIcon, ReportsIcon, InvestmentsIcon, DebtsIcon, SettingsIcon, DreamPlannerIcon, VideoStoryIcon } from './components/icons/Icons';

type Theme = 'light' | 'dark';
type AuthModalState = {
    isOpen: boolean;
    mode: 'signin' | 'signup';
}

const App: React.FC = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [budgets, setBudgets] = useState<Budget[]>(DEFAULT_BUDGETS);
    const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
    const [goals, setGoals] = useState<Goal[]>([]);
    const [recurringPayments, setRecurringPayments] = useState<RecurringPayment[]>([]);
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [investments, setInvestments] = useState<Investment[]>([]);
    const [debts, setDebts] = useState<Debt[]>([]);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isLoaded, setIsLoaded] = useState(false);
    const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('theme') as Theme) || 'light');
    const [currentUser, setCurrentUser] = useState<{email: string} | null>(null);
    const [authModal, setAuthModal] = useState<AuthModalState>({ isOpen: false, mode: 'signin' });

    // ==== THEME MANAGEMENT ====
    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);
    
    const setUserData = (data: any) => {
        if (!data) return;
        
        // Helper to safely parse strings from DB into numbers, preventing NaN errors.
        const parseNumber = (val: any): number => {
            if (val === null || val === undefined) return 0;
            const num = parseFloat(String(val));
            return isNaN(num) ? 0 : num;
        };
    
        const parsedTransactions = (data.transactions || []).map((t: any) => ({
            ...t,
            amount: parseNumber(t.amount),
            date: new Date(t.date),
        }));
    
        const parsedBudgets = (data.budgets || DEFAULT_BUDGETS).map((b: any) => ({
            ...b,
            amount: parseNumber(b.amount),
        }));
        
        const parsedGoals = (data.goals || []).map((g: any) => ({
            ...g,
            targetAmount: parseNumber(g.targetAmount),
            currentAmount: parseNumber(g.currentAmount),
        }));
    
        const parsedRecurringPayments = (data.recurringPayments || []).map((p: any) => ({
            ...p,
            amount: parseNumber(p.amount),
        }));
    
        const parsedAccounts = (data.accounts || []).map((a: any) => ({
            ...a,
            balance: parseNumber(a.balance),
        }));
    
        const parsedInvestments = (data.investments || []).map((i: any) => ({
            ...i,
            quantity: parseNumber(i.quantity),
            purchasePrice: parseNumber(i.purchasePrice),
            currentValue: parseNumber(i.currentValue),
        }));
    
        const parsedDebts = (data.debts || []).map((d: any) => ({
            ...d,
            totalAmount: parseNumber(d.totalAmount),
            amountPaid: parseNumber(d.amountPaid),
            interestRate: parseNumber(d.interestRate),
            minPayment: parseNumber(d.minPayment),
        }));
    
        setTransactions(parsedTransactions);
        setBudgets(parsedBudgets);
        setFamilyMembers(data.familyMembers || []);
        setGoals(parsedGoals);
        setRecurringPayments(parsedRecurringPayments);
        setAccounts(parsedAccounts);
        setInvestments(parsedInvestments);
        setDebts(parsedDebts);
    };
    
    const handleSignOut = () => {
        authService.signOut();
        setCurrentUser(null);
        // Reset state to defaults
        setTransactions([]);
        setBudgets(DEFAULT_BUDGETS);
        setFamilyMembers([]);
        setGoals([]);
        setRecurringPayments([]);
        setAccounts([]);
        setInvestments([]);
        setDebts([]);
        setActiveTab('dashboard');
    };

    // ==== AUTHENTICATION & DATA LOADING ====
    useEffect(() => {
        const checkUserSession = async () => {
            const user = authService.getCurrentUser();
            if (user) {
                setCurrentUser(user);
                try {
                    const userData = await authService.loadUserData();
                    setUserData(userData);
                } catch (error) {
                    console.error("Session invalid, signing out.", error);
                    handleSignOut(); // Handles token removal and state reset
                }
            }
            setIsLoaded(true);
        };
        checkUserSession();
    }, []);
    
    const handleAuthSuccess = async (user: { email: string }) => {
        setCurrentUser(user);
        setAuthModal({ isOpen: false, mode: 'signin' });
        setIsLoaded(false); // Show loading state while fetching data
        try {
            const userData = await authService.loadUserData();
            setUserData(userData);
        } catch (error) {
            console.error("Failed to load user data after auth", error);
            handleSignOut(); // Sign out if data loading fails
        } finally {
            setIsLoaded(true);
        }
    };


    // ==== DATA SAVING ====
    // Note: In a real-world app, this effect should be debounced
    // to avoid sending too many requests to the backend.
    useEffect(() => {
        if (isLoaded && currentUser) {
            authService.saveUserData({
                transactions,
                budgets,
                familyMembers,
                goals,
                recurringPayments,
                accounts,
                investments,
                debts
            });
        }
    }, [transactions, budgets, familyMembers, goals, recurringPayments, accounts, investments, debts, currentUser, isLoaded]);


    const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
        const newTransaction = { ...transaction, id: Date.now() };
        setTransactions(prev => [newTransaction, ...prev].sort((a, b) => b.date.getTime() - a.date.getTime()));
    };

    const deleteTransaction = (id: number) => {
        setTransactions(transactions.filter(t => t.id !== id));
    };

    const updateBudget = (category: string, newAmount: number) => {
        setBudgets(budgets.map(b => b.category === category ? { ...b, amount: newAmount } : b));
    };

    const addFamilyMember = (name: string, gender: Gender) => {
        if (name && !familyMembers.some(m => m.name.toLowerCase() === name.toLowerCase())) {
            const newMember: FamilyMember = { id: Date.now(), name, gender };
            setFamilyMembers(prev => [...prev, newMember].sort((a, b) => a.name.localeCompare(b.name)));
        }
    };
    
    const deleteFamilyMember = (id: number) => {
        const memberToDelete = familyMembers.find(m => m.id === id);
        if (!memberToDelete) return;

        setFamilyMembers(familyMembers.filter(m => m.id !== id));
        setTransactions(prev => prev.map(t => t.member === memberToDelete.name ? {...t, member: 'Me'} : t));
    };

    const addGoal = (goal: Omit<Goal, 'id' | 'currentAmount'>) => {
        const newGoal = { ...goal, id: Date.now(), currentAmount: 0 };
        setGoals(prev => [...prev, newGoal]);
    };

    const updateGoal = (id: number, updatedValues: Partial<Omit<Goal, 'id'>>) => {
        setGoals(goals.map(g => g.id === id ? { ...g, ...updatedValues } : g));
    };

    const deleteGoal = (id: number) => {
        setGoals(goals.filter(g => g.id !== id));
    };

    const addRecurringPayment = (payment: Omit<RecurringPayment, 'id'>) => {
        const newPayment = { ...payment, id: Date.now() };
        setRecurringPayments(prev => [...prev, newPayment]);
    };



    const deleteRecurringPayment = (id: number) => {
        setRecurringPayments(recurringPayments.filter(p => p.id !== id));
    };

    const { totalIncome, totalExpenses, balance } = useMemo(() => {
        const income = transactions.reduce((sum, t) => t.type === 'income' ? sum + t.amount : sum, 0);
        const expenses = transactions.reduce((sum, t) => t.type === 'expense' ? sum + t.amount : sum, 0);
        return { totalIncome: income, totalExpenses: expenses, balance: income - expenses };
    }, [transactions]);

    const tabs: Array<{ id: string; label: string; icon: React.ReactNode; }> = [
        { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
        { id: 'accounts', label: 'Accounts', icon: <AccountsIcon /> },
        { id: 'transactions', label: 'Transactions', icon: <TransactionIcon /> },
        { id: 'reports', label: 'Reports', icon: <ReportsIcon /> },
        { id: 'budgets', label: 'Budgets', icon: <BudgetIcon /> },
        { id: 'investments', label: 'Investments', icon: <InvestmentsIcon /> },
        { id: 'debts', label: 'Debts', icon: <DebtsIcon /> },
        { id: 'family', label: 'Family', icon: <FamilyIcon /> },
        { id: 'tips', label: 'AI Financial Tip', icon: <LightBulbIcon /> },
        { id: 'dreamPlanner', label: 'Dream Planner', icon: <DreamPlannerIcon /> },
        { id: 'videoStory', label: 'Video Story', icon: <VideoStoryIcon /> },
        { id: 'settings', label: 'Settings', icon: <SettingsIcon /> },
    ];
    
    const renderContent = () => {
        if (!currentUser) {
            return (
                 <div className="flex flex-col items-center justify-center h-[600px] text-center">
                    <LogoIcon />
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mt-4">Welcome to Family FinanceFlow</h2>
                    <p className="text-slate-600 dark:text-slate-400 mt-2">Please sign in or sign up to manage your finances.</p>
                    <div className="flex gap-4 mt-6">
                        <button onClick={() => setAuthModal({isOpen: true, mode: 'signin'})} className="px-6 py-2 text-sm font-semibold text-primary border border-primary rounded-lg hover:bg-primary/20 dark:hover:bg-primary/10 transition-colors">Sign In</button>
                        <button onClick={() => setAuthModal({isOpen: true, mode: 'signup'})} className="px-6 py-2 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary-700 transition-colors">Sign Up</button>
                    </div>
                </div>
            )
        }
        return (
            <div key={activeTab} className="animate-fade-in">
                {activeTab === 'transactions' && (
                    <div>
                        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-6">Transactions</h2>
                        <TransactionForm onSubmit={addTransaction} familyMembers={familyMembers} />
                        <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200 mt-10 mb-6">History</h2>
                        <TransactionList transactions={transactions} onDelete={deleteTransaction} />
                    </div>
                )}
                {activeTab === 'budgets' && <BudgetTracker budgets={budgets} transactions={transactions} onUpdateBudget={updateBudget} />}
                {activeTab === 'family' && <FamilyPage members={familyMembers} onAddMember={addFamilyMember} onDeleteMember={deleteFamilyMember} />}
                {activeTab === 'tips' && <FinancialTip transactions={transactions} />}
                {activeTab === 'dreamPlanner' && <DreamPlannerPage />}
                {activeTab === 'videoStory' && <VideoStoryPage />}
                {activeTab === 'accounts' && <AccountsPage />}
                {activeTab === 'investments' && <InvestmentsPage />}
                {activeTab === 'debts' && <DebtsPage />}
                {activeTab === 'reports' && <ReportsPage />}
                {activeTab === 'settings' && <SettingsPage theme={theme} onThemeChange={setTheme} user={currentUser} />}
                {activeTab === 'help' && <HelpPage />}
                {activeTab === 'dashboard' && <Dashboard 
                    theme={theme}
                    balance={balance} 
                    totalIncome={totalIncome} 
                    totalExpenses={totalExpenses}
                    transactions={transactions}
                    goals={goals}
                    onAddGoal={addGoal}
                    onUpdateGoal={updateGoal}
                    onDeleteGoal={deleteGoal}
                    recurringPayments={recurringPayments}
                    onAddRecurringPayment={addRecurringPayment}
                    onDeleteRecurringPayment={deleteRecurringPayment}
                    familyMembers={familyMembers}
                    />}
            </div>
        )
    };

    return (
        <div className="min-h-screen text-slate-800 dark:text-slate-300 font-sans">
            {authModal.isOpen && (
                <AuthModal 
                    mode={authModal.mode} 
                    onClose={() => setAuthModal({ ...authModal, isOpen: false })}
                    onAuthSuccess={handleAuthSuccess}
                />
            )}
            <header className="bg-white/60 dark:bg-slate-950/60 backdrop-blur-lg sticky top-0 z-20 border-b border-white/30 dark:border-slate-800/30 shadow-lg">
                <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                         <div className="flex items-center space-x-2">
                             <LogoIcon/>
                             <h1 className="text-xl font-bold text-slate-900 dark:text-white">Family FinanceFlow</h1>
                         </div>
                         <nav className="flex items-center space-x-4">
                            <button onClick={() => setActiveTab('help')} className="text-sm font-semibold text-slate-600 hover:text-primary dark:text-slate-400 dark:hover:text-primary-400 transition-colors">Help</button>
                            {currentUser ? (
                                <>
                                    <span className="text-sm text-slate-600 dark:text-slate-400 hidden sm:block">Welcome, {currentUser.email}!</span>
                                    <button onClick={handleSignOut} className="px-4 py-2 text-sm font-semibold text-primary border border-primary rounded-lg hover:bg-primary/20 dark:hover:bg-primary/10 transition-colors">Sign Out</button>
                                </>
                            ) : (
                                <>
                                    <button onClick={() => setAuthModal({isOpen: true, mode: 'signin'})} className="text-sm font-semibold text-slate-600 hover:text-primary dark:text-slate-400 dark:hover:text-primary-400 transition-colors">Sign In</button>
                                    <button onClick={() => setAuthModal({isOpen: true, mode: 'signup'})} className="px-4 py-2 text-sm font-semibold text-primary border border-primary rounded-lg hover:bg-primary/20 dark:hover:bg-primary/10 transition-colors">Sign Up</button>
                                </>
                            )}
                        </nav>
                    </div>
                </div>
            </header>
            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <aside className="lg:col-span-3">
                        <nav className="sticky top-24 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 dark:border-slate-800/20 p-4 space-y-1 transition-shadow duration-300 hover:shadow-2xl">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center px-4 py-3 text-sm font-semibold rounded-lg transition-all duration-200 ease-in-out relative group active:scale-[0.98] ${
                                        activeTab === tab.id 
                                        ? 'bg-primary/90 text-white shadow-md' 
                                        : 'text-slate-500 hover:bg-white/50 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-slate-200'
                                    }`}
                                     disabled={!currentUser && !['help', 'dashboard'].includes(tab.id)}
                                >
                                     <span className={`absolute left-0 top-0 bottom-0 w-1.5 rounded-r-full transition-transform duration-300 ease-out ${activeTab === tab.id ? 'bg-white/50 scale-y-100' : 'scale-y-0 group-hover:scale-y-50 bg-primary/50'}`}></span>
                                     <span className="transition-transform duration-200 group-hover:scale-110">{tab.icon}</span>
                                    <span className="ml-3">{tab.label}</span>
                                </button>
                            ))}
                        </nav>
                    </aside>
                    <main className="lg:col-span-9">
                        <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 dark:border-slate-800/20 p-6 sm:p-8 min-h-[600px] transition-shadow duration-300 hover:shadow-2xl">
                            {isLoaded ? renderContent() : (
                                <div className="flex items-center justify-center h-[600px]">
                                    <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                </div>
                            )}
                        </div>
                    </main>
                </div>
            </div>
            {currentUser && <Chatbot 
                transactions={transactions} 
                budgets={budgets} 
                familyMembers={familyMembers} 
                recurringPayments={recurringPayments}
                accounts={accounts}
                investments={investments}
                debts={debts}
                onNavigate={setActiveTab}
                onSetTheme={setTheme}
                onSignOut={handleSignOut}
                availableTabs={tabs.map(({ id, label }) => ({ id, label }))}
            />}
        </div>
    );
};

export default App;
