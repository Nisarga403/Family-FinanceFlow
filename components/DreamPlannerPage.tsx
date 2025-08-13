
import React, { useState, useEffect, useCallback } from 'react';
import { getDreamPlan } from '../services/geminiService';
import { DreamPlan } from '../types';
import { SparklesIcon, DreamPlannerIcon } from './icons/Icons';

const loadingTexts = [
    "Consulting the financial cosmos...",
    "Mapping your path to success...",
    "Visualizing your future...",
    "Crafting your dream plan...",
];

const DreamPlannerPage: React.FC = () => {
    const [dream, setDream] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<{ plan: DreamPlan; imageUrl: string } | null>(null);
    const [currentLoadingText, setCurrentLoadingText] = useState(loadingTexts[0]);

    useEffect(() => {
        let interval: ReturnType<typeof setTimeout> | undefined;
        if (isLoading) {
            interval = setInterval(() => {
                setCurrentLoadingText(prevText => {
                    const currentIndex = loadingTexts.indexOf(prevText);
                    const nextIndex = (currentIndex + 1) % loadingTexts.length;
                    return loadingTexts[nextIndex];
                });
            }, 2500);
        }
        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [isLoading]);

    const handleGeneratePlan = useCallback(async () => {
        if (!dream.trim()) return;
        setIsLoading(true);
        setError(null);
        setResult(null);
        try {
            const planResult = await getDreamPlan(dream);
            setResult(planResult);
        } catch (err) {
            console.error("Dream Planner Error:", err);
            setError("I had trouble dreaming up a plan. It might be a good idea to check your API key or try a different dream.");
        } finally {
            setIsLoading(false);
        }
    }, [dream]);
    
    const handleReset = () => {
        setDream('');
        setResult(null);
        setError(null);
    };

    const renderInitial = () => (
        <div className="flex flex-col items-center text-center p-4 animate-fade-in">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary-400 flex items-center justify-center shadow-lg mb-4">
                <DreamPlannerIcon className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-2">Dream Planner</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-lg">
                Turn your biggest dreams into actionable plans with the power of AI. Describe your dream, and we'll help you chart a course to get there.
            </p>
            <div className="w-full max-w-2xl space-y-4">
                <textarea
                    value={dream}
                    onChange={e => setDream(e.target.value)}
                    placeholder="e.g., I want to buy a house in Goa in 5 years, or travel through Europe for a month."
                    className="w-full p-4 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800/50 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-shadow resize-none h-32 dark:text-slate-200"
                />
                <button
                    onClick={handleGeneratePlan}
                    disabled={!dream.trim()}
                    className="inline-flex items-center px-8 py-4 border border-transparent text-base font-semibold rounded-full shadow-md text-white bg-gradient-to-r from-primary to-primary-400 hover:from-primary-600 hover:to-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-slate-400 disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
                >
                    <SparklesIcon />
                    <span className="ml-2">Generate My Dream Plan</span>
                </button>
            </div>
        </div>
    );

    const renderLoading = () => (
        <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in">
            <svg className="animate-spin h-12 w-12 text-primary mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-slate-600 dark:text-slate-400 text-lg transition-opacity duration-500">{currentLoadingText}</p>
        </div>
    );

    const renderResult = () => result && (
        <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200">Your Path to: <span className="text-primary dark:text-primary-400">{result.plan.title}</span></h2>
                <button onClick={handleReset} className="font-semibold text-primary dark:text-primary-400 hover:text-primary-600 transition-colors">Plan another dream &rarr;</button>
            </div>
            
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <img src={result.imageUrl} alt={result.plan.title} className="w-full h-auto object-cover rounded-2xl shadow-xl" />
                    <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
                        <p className="text-slate-700 dark:text-slate-300">{result.plan.summary}</p>
                    </div>
                </div>
                
                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-primary-50 dark:bg-primary-950/40 rounded-xl text-center">
                            <p className="text-sm font-semibold text-primary-700 dark:text-primary-300">Estimated Cost</p>
                            <p className="text-xl font-bold text-primary dark:text-primary-400">{result.plan.estimatedCost}</p>
                        </div>
                         <div className="p-4 bg-primary-50 dark:bg-primary-950/40 rounded-xl text-center">
                            <p className="text-sm font-semibold text-primary-700 dark:text-primary-300">Timeline</p>
                            <p className="text-xl font-bold text-primary dark:text-primary-400">{result.plan.timeline}</p>
                        </div>
                    </div>
                    
                    <div>
                        <h4 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-4">Your Action Steps:</h4>
                        <ol className="relative border-l border-primary-200 dark:border-primary-800 space-y-8 ml-4">
                            {result.plan.steps.map((step, index) => (
                                <li 
                                    key={index} 
                                    className="ml-8 animate-fade-in-up"
                                    style={{ animationDelay: `${index * 150}ms`, animationFillMode: 'backwards' }}
                                >
                                    <span className="absolute flex items-center justify-center w-8 h-8 bg-primary-100 dark:bg-primary-950 rounded-full -left-4 ring-8 ring-white dark:ring-slate-900/70 text-primary dark:text-primary-400 font-bold">
                                        {index + 1}
                                    </span>
                                    <h5 className="font-semibold text-lg text-slate-800 dark:text-slate-200">{step.title}</h5>
                                    <p className="text-slate-600 dark:text-slate-400">{step.description}</p>
                                </li>
                            ))}
                        </ol>
                    </div>
                </div>
            </div>
        </div>
    );
    
    const renderError = () => error && (
        <div className="text-center p-8 animate-fade-in">
            <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-4">Oops! Something went wrong.</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">{error}</p>
            <button onClick={handleReset} className="font-semibold text-primary dark:text-primary-400 hover:text-primary-600 transition-colors">Try again</button>
        </div>
    );

    return (
        <div className="min-h-[500px] flex flex-col justify-center">
            {isLoading ? renderLoading() : result ? renderResult() : error ? renderError() : renderInitial()}
        </div>
    );
};

export default DreamPlannerPage;
