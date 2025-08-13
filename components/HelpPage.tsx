

import React from 'react';
import { QuestionMarkCircleIcon } from './icons/Icons';

const HelpPage: React.FC = () => {

    const faqs = [
        {
            q: "How do I add a new transaction?",
            a: "Navigate to the 'Transactions' tab from the sidebar. You will find a form at the top to add a new expense or income. Fill in the details and click 'Add Transaction'."
        },
        {
            q: "Can I change my budget amounts?",
            a: "Yes. Go to the 'Budgets' tab. You'll see a list of your budget categories. Simply click on the budget amount (e.g., '₹15,000') to open an input field and set a new value. The change is saved automatically when you click away."
        },
        {
            q: "How does the AI Financial Tip work?",
            a: "The AI Financial Tip analyzes your spending data from the last 30 days to provide a personalized suggestion. Go to the 'AI Financial Tip' tab and click 'Generate My Tip' to get started. You need at least a few expenses logged for it to work effectively."
        },
        {
            q: "What is the Dream Planner?",
            a: "The Dream Planner uses AI to help you create an actionable financial plan for a long-term goal. Describe your dream, and the AI will generate a plan with an estimated cost, timeline, and concrete steps to achieve it, along with an inspirational image."
        },
        {
            q: "How do I add or remove a family member?",
            a: "Go to the 'Family' tab. You can add a new member using the form at the top. To remove a member, hover over their name in the list and click the trash can icon that appears. Any transactions assigned to a deleted member will be reassigned to 'Me'."
        },
        {
            q: "How do I switch to dark mode?",
            a: "Navigate to the 'Settings' tab. You will find an 'Appearance' card where you can switch between the light and dark themes for the application."
        }
    ];

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-primary-50 dark:bg-primary-950/50 text-primary dark:text-primary-400 rounded-lg">
                    <QuestionMarkCircleIcon />
                </div>
                <div>
                    <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200">Help & FAQ</h2>
                    <p className="text-slate-600 dark:text-slate-400">Find answers to common questions about Family FinanceFlow.</p>
                </div>
            </div>

            <div className="space-y-3 max-w-4xl">
                {faqs.map((faq, index) => (
                    <details 
                        key={index} 
                        className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 group cursor-pointer transition-all duration-300 hover:border-primary/50 dark:hover:border-primary/70"
                        name="faq"
                    >
                        <summary className="font-semibold text-slate-800 dark:text-slate-200 list-none flex justify-between items-center">
                            {faq.q}
                            <div className="transition-transform duration-300 transform group-open:rotate-180">
                                <svg className="w-5 h-5 text-slate-500 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                        </summary>
                        <p className="text-slate-600 dark:text-slate-400 mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">{faq.a}</p>
                    </details>
                ))}
            </div>
        </div>
    );
};

export default HelpPage;