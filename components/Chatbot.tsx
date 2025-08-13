import React, { useState, useRef, useEffect } from 'react';
import { getChatResponse } from '../services/geminiService';
import { Transaction, Budget, ChatMessage, RecurringPayment, Account, Investment, Debt, FamilyMember, SimpleTab } from '../types';
import { ChatbotIcon, CloseIcon, SendIcon } from './icons/Icons';

interface ChatbotProps {
    transactions: Transaction[];
    budgets: Budget[];
    familyMembers: FamilyMember[];
    recurringPayments: RecurringPayment[];
    accounts: Account[];
    investments: Investment[];
    debts: Debt[];
    onNavigate: (tabId: string) => void;
    onSetTheme: (theme: 'light' | 'dark') => void;
    onSignOut: () => void;
    availableTabs: SimpleTab[];
}

const Chatbot: React.FC<ChatbotProps> = ({ 
    transactions, budgets, familyMembers, recurringPayments, 
    accounts, investments, debts,
    onNavigate, onSetTheme, onSignOut, availableTabs
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);
    
    const getInitialMessages = (): ChatMessage[] => {
        const formattedTransactions = JSON.stringify(transactions.map(t => ({...t, date: t.date.toISOString().split('T')[0]})), null, 2);
        const formattedBudgets = JSON.stringify(budgets, null, 2);
        const formattedFamily = JSON.stringify(familyMembers, null, 2);
        const formattedRecurring = JSON.stringify(recurringPayments, null, 2);
        const formattedAccounts = JSON.stringify(accounts, null, 2);
        const formattedInvestments = JSON.stringify(investments, null, 2);
        const formattedDebts = JSON.stringify(debts, null, 2);

        const contextMessage = `Here is my financial data. Use this context to answer my questions.\n\nACCOUNTS:\n${formattedAccounts}\n\nTRANSACTIONS:\n${formattedTransactions}\n\nBUDGETS:\n${formattedBudgets}\n\nINVESTMENTS:\n${formattedInvestments}\n\nDEBTS:\n${formattedDebts}\n\nFAMILY MEMBERS:\n${formattedFamily}\n\nRECURRING PAYMENTS:\n${formattedRecurring}`;

        return [
            // This first message provides all context to the AI model but is hidden from the user UI.
            // The role is 'user' so the AI knows this is the data to analyze.
            { sender: 'user', text: contextMessage }, 
            // This is the first message the user actually sees.
            { sender: 'ai', text: "Hello! I'm your AI Financial Assistant. Ask me anything about the data you see in the app, or give me commands like 'go to settings' or 'dark mode'." }
        ];
    };

    const handleToggleChat = () => {
        setIsOpen(prev => {
            if (!prev && messages.length === 0) {
                setMessages(getInitialMessages());
            }
            return !prev;
        });
    };
    
    // On data change, if chat is open, reset it with new data.
    useEffect(() => {
        if (isOpen) {
             const newInitialMessages = getInitialMessages();
             const lastVisibleMessage = newInitialMessages[newInitialMessages.length - 1];
             setMessages([
                 ...newInitialMessages.slice(0, -1),
                { ...lastVisibleMessage, text: "Your financial data has been updated. " + lastVisibleMessage.text }
             ]);
        }
    }, [transactions, budgets, familyMembers, recurringPayments, accounts, investments, debts]);


    const handleLocalCommand = (command: string): boolean => {
        const lowerCommand = command.toLowerCase().trim();

        if (lowerCommand === 'sign out' || lowerCommand === 'log out') {
            onSignOut();
            return true;
        }
        if (lowerCommand.includes('dark mode') || lowerCommand.includes('dark theme')) {
            onSetTheme('dark');
            setMessages(prev => [...prev, { sender: 'ai', text: "No problem, I've switched to dark mode for you." }]);
            return true;
        }
        if (lowerCommand.includes('light mode') || lowerCommand.includes('light theme')) {
            onSetTheme('light');
            setMessages(prev => [...prev, { sender: 'ai', text: "Of course, switched to light mode." }]);
            return true;
        }

        const navMatch = lowerCommand.match(/^(go to|navigate to|show me|open)\s+(.*)/);
        if (navMatch && navMatch[2]) {
            const targetQuery = navMatch[2].trim();
            const foundTab = availableTabs.find(tab => 
                tab.label.toLowerCase().includes(targetQuery) || 
                tab.id.toLowerCase().includes(targetQuery)
            );

            if (foundTab) {
                onNavigate(foundTab.id);
                setMessages(prev => [...prev, { sender: 'ai', text: `You got it. Navigating to ${foundTab.label}.` }]);
                return true;
            } else {
                 setMessages(prev => [...prev, { sender: 'ai', text: `Sorry, I'm not sure which page you mean by "${targetQuery}".` }]);
                 return true;
            }
        }
        return false;
    };


    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        const userInput = inputValue.trim();
        if (!userInput || isLoading) return;

        const updatedMessages: ChatMessage[] = [...messages, { sender: 'user', text: userInput }];
        setMessages(updatedMessages);
        setInputValue('');
        
        if (handleLocalCommand(userInput)) return;

        setIsLoading(true);

        try {
            const response = await getChatResponse(updatedMessages);
            setMessages(prev => [...prev, { sender: 'ai', text: response.text }]);
        } catch (err: any) {
            console.error("Chatbot error:", err);
            setMessages(prev => [...prev, { sender: 'ai', text: err.message || "Sorry, I'm having a little trouble right now." }]);
        } finally {
            setIsLoading(false);
        }
    };

    // Filter out the initial hidden context message before rendering
    const visibleMessages = messages.slice(1);

    return (
        <>
            <button
                onClick={handleToggleChat}
                className="fixed bottom-6 right-6 bg-gradient-to-r from-primary to-primary-400 text-white rounded-full p-5 shadow-lg hover:scale-110 transition-transform duration-200 z-30"
                aria-label="Open financial assistant chat"
            >
                <ChatbotIcon className="h-12 w-12" />
            </button>

            <div 
                className={`fixed bottom-24 right-6 w-[calc(100%-3rem)] max-w-lg h-[70vh] max-h-[600px] bg-white dark:bg-slate-800 rounded-2xl shadow-2xl flex flex-col transition-all duration-300 ease-in-out origin-bottom-right z-40 ${
                    isOpen ? 'scale-100 opacity-100' : 'scale-90 opacity-0 pointer-events-none'
                }`}
                role="dialog"
                aria-modal="true"
                aria-labelledby="chatbot-title"
            >
                <header className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
                    <h2 id="chatbot-title" className="text-lg font-semibold text-slate-800 dark:text-slate-200">AI Financial Assistant</h2>
                    <button onClick={handleToggleChat} className="p-1 text-slate-500 hover:text-slate-800 rounded-full hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-700" aria-label="Close chat">
                        <CloseIcon />
                    </button>
                </header>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {visibleMessages.map((msg, index) => (
                        <div key={index} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                           {msg.sender === 'ai' && <div className="w-8 h-8 rounded-full bg-primary flex-shrink-0 items-center justify-center text-white font-bold text-xs hidden sm:flex">AI</div>}
                            <div className={`max-w-[80%] p-3 rounded-2xl ${msg.sender === 'user' ? 'bg-primary text-white rounded-br-lg' : 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200 rounded-bl-lg animate-fade-in'}`}>
                                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                         <div className="flex items-end gap-2 justify-start">
                            <div className="w-8 h-8 rounded-full bg-primary flex-shrink-0 items-center justify-center text-white font-bold text-xs hidden sm:flex">AI</div>
                            <div className="max-w-[80%] p-3 rounded-2xl bg-slate-100 dark:bg-slate-700 text-slate-800 rounded-bl-lg">
                                <div className="flex items-center space-x-1">
                                    <span className="h-2 w-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                    <span className="h-2 w-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                    <span className="h-2 w-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce"></span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <footer className="p-4 border-t border-slate-200 dark:border-slate-700">
                    <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Ask a question or give a command..."
                            className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-full focus:ring-2 focus:ring-primary/50 focus:border-primary transition-shadow text-slate-800 dark:text-slate-200"
                            disabled={isLoading}
                        />
                        <button type="submit" disabled={isLoading || !inputValue} className="p-2.5 bg-primary text-white rounded-full disabled:bg-slate-300 dark:disabled:bg-slate-600 disabled:cursor-not-allowed hover:bg-primary-600 transition-colors">
                            <SendIcon />
                        </button>
                    </form>
                </footer>
            </div>
        </>
    );
};

export default Chatbot;