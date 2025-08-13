
import { Budget } from './types';

export const INCOME_CATEGORIES: string[] = [
    'Salary',
    'Freelance',
    'Bonus',
    'Investment',
    'Other',
];

export const EXPENSE_CATEGORIES: string[] = [
    'Groceries',
    'Rent/Mortgage',
    'Utilities',
    'Transportation',
    'Dining Out',
    'Entertainment',
    'Shopping',
    'Health',
    'Education',
    'Agriculture',
    'Other',
];

export const DEFAULT_BUDGETS: Budget[] = [
    { category: 'Groceries', amount: 15000 },
    { category: 'Dining Out', amount: 5000 },
    { category: 'Shopping', amount: 8000 },
    { category: 'Transportation', amount: 3000 },
    { category: 'Entertainment', amount: 4000 },
    { category: 'Health', amount: 2000 },
    { category: 'Agriculture', amount: 1000 },
];