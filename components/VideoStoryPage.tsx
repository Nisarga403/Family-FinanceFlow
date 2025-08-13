import React, { useState, useEffect, useCallback } from 'react';
import { generateVideoStory, fetchVideoBlobFromProxy } from '../services/geminiService';
import { SparklesIcon, VideoStoryIcon } from './icons/Icons';

const loadingTexts = [
    "Warming up the director's chair...",
    "Scouting for the perfect location...",
    "Casting the digital actors...",
    "Setting the scene...",
    "Adjusting the lighting...",
    "Rolling camera... Action!",
    "Processing the daily rushes...",
    "Adding special effects in post-production...",
    "Finalizing the master cut...",
];

const VideoStoryPage: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
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
            }, 3000);
        }
        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [isLoading]);
    
    // Cleanup object URL when component unmounts or videoUrl changes
    useEffect(() => {
        return () => {
            if (videoUrl && videoUrl.startsWith('blob:')) {
                URL.revokeObjectURL(videoUrl);
            }
        };
    }, [videoUrl]);

    const handleGenerateVideo = useCallback(async () => {
        if (!prompt.trim()) return;
        setIsLoading(true);
        setError(null);
        setVideoUrl(null);
        try {
            // Step 1: Tell backend to start generating and polling. It returns the final Google URI.
            const { videoUri } = await generateVideoStory(prompt);
            
            // Step 2: Fetch the video data from our own backend proxy, which adds the API key.
            const videoBlob = await fetchVideoBlobFromProxy(videoUri);
            
            // Step 3: Create a temporary local URL for the browser to display.
            const objectURL = URL.createObjectURL(videoBlob);
            setVideoUrl(objectURL);

        } catch (err: any) {
            console.error("Video Story Error:", err);
            setError(`Failed to create your video story. This can happen due to high demand or API issues. Please check your API key and try again. Error: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    }, [prompt]);
    
    const handleReset = () => {
        setPrompt('');
        setVideoUrl(null);
        setError(null);
    };

    const renderInitial = () => (
        <div className="flex flex-col items-center text-center p-4 animate-fade-in">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary-400 flex items-center justify-center shadow-lg mb-4">
                <VideoStoryIcon className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-2">AI Video Story Generator</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-lg">
                Bring your stories to life! Describe a scene or a short story, and our AI director will create a video for you.
            </p>
            <div className="w-full max-w-2xl space-y-4">
                <textarea
                    value={prompt}
                    onChange={e => setPrompt(e.target.value)}
                    placeholder="e.g., A robot planting a glowing flower on a futuristic cityscape at sunrise."
                    className="w-full p-4 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800/50 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-shadow resize-none h-32 dark:text-slate-200"
                />
                <button
                    onClick={handleGenerateVideo}
                    disabled={!prompt.trim()}
                    className="inline-flex items-center px-8 py-4 border border-transparent text-base font-semibold rounded-full shadow-md text-white bg-gradient-to-r from-primary to-primary-400 hover:from-primary-600 hover:to-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-slate-400 disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
                >
                    <SparklesIcon />
                    <span className="ml-2">Generate Video</span>
                </button>
            </div>
        </div>
    );

    const renderLoading = () => (
        <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in">
            <svg className="animate-spin h-12 w-12 text-primary mb-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-slate-600 dark:text-slate-400 text-lg transition-opacity duration-500 mb-2">{currentLoadingText}</p>
            <p className="text-sm text-slate-500 dark:text-slate-500">Video generation can take a few minutes. Please be patient!</p>
        </div>
    );

    const renderResult = () => videoUrl && (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200">Your Video is Ready!</h2>
                <button onClick={handleReset} className="font-semibold text-primary dark:text-primary-400 hover:text-primary-600 transition-colors">Create another video &rarr;</button>
            </div>
            
            <div className="w-full aspect-video bg-slate-900 rounded-2xl shadow-xl overflow-hidden">
                 <video
                    src={videoUrl}
                    controls
                    autoPlay
                    loop
                    className="w-full h-full object-contain"
                    aria-label="Generated video story"
                >
                    Your browser does not support the video tag.
                </video>
            </div>
             <div className="text-center">
                <a 
                    href={videoUrl} 
                    download={`video-story-${Date.now()}.mp4`}
                    className="inline-block py-2 px-6 bg-primary text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200"
                >
                    Download Video
                </a>
            </div>
        </div>
    );
    
    const renderError = () => error && (
        <div className="text-center p-8 animate-fade-in bg-slate-50 dark:bg-slate-800/50 rounded-lg">
            <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-4">Oops! The Shoot Was Cancelled.</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-lg mx-auto">{error}</p>
            <button onClick={handleReset} className="font-semibold text-primary dark:text-primary-400 hover:text-primary-600 transition-colors">Try again</button>
        </div>
    );

    return (
        <div className="min-h-[500px] flex flex-col justify-center">
            {isLoading ? renderLoading() : videoUrl ? renderResult() : error ? renderError() : renderInitial()}
        </div>
    );
};

export default VideoStoryPage;