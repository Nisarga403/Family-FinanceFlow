export enum TransactionType {
    INCOME = 'income',
    EXPENSE = 'expense',
}

export interface Transaction {
    id: number;
    description: string;
    amount: number;
    date: Date;
    type: TransactionType;
    category: string;
    member?: string;
}

export interface Budget {
    category: string;
    amount: number;
}

export interface Goal {
    id: number;
    name: string;
    targetAmount: number;
    currentAmount: number;
}

export interface RecurringPayment {
    id: number;
    description: string;
    amount: number;
    dueDay: number; // Day of the month (1-31)
}

export interface Account {
    id: number;
    name: string;
    type: 'Checking' | 'Savings' | 'Credit Card' | 'Cash';
    balance: number;
}

export interface Investment {
    id: number;
    name: string;
    type: 'Stock' | 'Mutual Fund' | 'Crypto' | 'Other';
    quantity: number;
    purchasePrice: number;
    currentValue: number;
}

export interface Debt {
    id: number;
    name: string;
    type: 'Loan' | 'Credit Card' | 'Mortgage';
    totalAmount: number;
    amountPaid: number;
    interestRate: number;
    minPayment: number;
}

export interface ChatMessage {
    sender: 'user' | 'ai';
    text: string;
}

export interface DreamStep {
    title:string;
    description: string;
}

export interface DreamPlan {
    title: string;
    summary: string;
    estimatedCost: string;
    timeline: string;
    steps: DreamStep[];
}

export enum Gender {
    MALE = 'male',
    FEMALE = 'female',
    OTHER = 'other',
}

export interface FamilyMember {
    id: number;
    name: string;
    gender: Gender;
}

export interface FamilyHubMember {
    id: number | string;
    name: string;
    gender: Gender;
    totalSpent: number;
    topCategory?: string;
}

export interface SimpleTab {
    id: string;
    label: string;
}
