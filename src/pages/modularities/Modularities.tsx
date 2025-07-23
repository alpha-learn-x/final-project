import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Home, BookOpen, Target, Award, HelpCircle, ShoppingCart, Brain, CheckCircle, Eye, Clock, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Header from "@/components/Header.tsx";

interface Modality {
    id: number;
    title: string;
    description: string;
    color: string;
    emoji: string;
    embeds: { url: string; title: string }[];
}

interface ActivityResult {
    url: string;
    title: string;
    timestamp: string;
    score?: number;
    completed: boolean;
    timeSpent?: number;
    attempts?: number;
}

const modalities: Modality[] = [
    {
        id: 1,
        title: 'Visual',
        description: 'Explore fun visuals with Sparky! Dive into colorful puzzles and games to learn through seeing!',
        color: 'red',
        emoji: '👀',
        embeds: [
            {
                url: 'https://wordwall.net/embed/14bcd268ac7b44278f1b3d1717294a28?themeId=64&templateId=5&fontStackId=0',
                title: 'Visual Activity 1',
            },
            {
                url: 'https://wordwall.net/embed/089312eeef014ce3885eeac92891f9f7?themeId=1&templateId=5&fontStackId=0',
                title: 'Visual Activity 2',
            },
        ],
    },
    {
        id: 2,
        title: 'Auditory',
        description: 'Listen and learn with Robo! Enjoy musical challenges and sound-based adventures!',
        color: 'yellow',
        emoji: '🎵',
        embeds: [
            {
                url: 'https://wordwall.net/embed/37670cb7e0d142eeaddeff5e16019739?themeId=21&templateId=5&fontStackId=0',
                title: 'Auditory Activity 1',
            },
            {
                url: 'https://wordwall.net/embed/f24a525f58ca4cfe8154d78146448d79?themeId=1&templateId=5&fontStackId=0',
                title: 'Auditory Activity 2',
            },
        ],
    },
    {
        id: 3,
        title: 'Kinesthetic',
        description: 'Move and groove with Captain Traffic! Build and interact with hands-on activities!',
        color: 'green',
        emoji: '🕹️',
        embeds: [
            {
                url: 'https://wordwall.net/embed/e732c2ee3a534e8ea942c4627d7ae7a4?themeId=65&templateId=2&fontStackId=0',
                title: 'Kinesthetic Activity 1',
            },
            {
                url: 'https://wordwall.net/embed/278f7ecf2b5847369c2fa3392cf3cdfb?themeId=45&templateId=3&fontStackId=0',
                title: 'Kinesthetic Activity 2',
            },
        ],
    },
    {
        id: 4,
        title: 'Read & Write',
        description: 'Create and learn with Bot Builder! Write stories and solve word puzzles to shine!',
        color: 'purple',
        emoji: '📝',
        embeds: [
            {
                url: 'https://wordwall.net/embed/e4ac047983384669a670df9f78254008?themeId=54&templateId=36&fontStackId=15',
                title: 'Read & Write Activity 1',
            },
            {
                url: 'https://wordwall.net/embed/2defeaa0f5924187a6b5deaafd360019?themeId=1&templateId=36&fontStackId=0',
                title: 'Read & Write Activity 2',
            },
        ],
    },
];

const getColorClasses = (color: string): string => {
    const colorMap: { [key: string]: string } = {
        red: 'from-red-100 to-red-300 border-red-400',
        yellow: 'from-yellow-100 to-yellow-300 border-yellow-400',
        green: 'from-green-100 to-green-300 border-green-400',
        purple: 'from-purple-100 to-purple-300 border-purple-400',
    };
    return colorMap[color] || 'from-gray-100 to-gray-300 border-gray-400';
};

const getIconColor = (color: string): string => {
    const colorMap: { [key: string]: string } = {
        red: 'text-red-600',
        yellow: 'text-yellow-600',
        green: 'text-green-600',
        purple: 'text-purple-600',
    };
    return colorMap[color] || 'text-gray-600';
};

const Modularities: React.FC = () => {
    const userName = 'Student';
    const [failedEmbeds, setFailedEmbeds] = useState<string[]>([]);
    const [completedActivities, setCompletedActivities] = useState<string[]>([]);
    const [activityResults, setActivityResults] = useState<ActivityResult[]>([]);
    const [activityStartTimes, setActivityStartTimes] = useState<{ [key: string]: number }>({});
    const [showResults, setShowResults] = useState(false);
    const [activeModality, setActiveModality] = useState<number | null>(null); // For lazy-loading
    const iframeRefs = useRef<{ [key: string]: HTMLIFrameElement | null }>({});
    const sourceToUrlMap = useRef<{ [key: string]: string }>({}); // Map iframe sources to URLs

// Inside the useEffect for message handling
    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.origin !== 'https://wordwall.net') return;

            console.log('🎯 Received postMessage from iframe:', {
                origin: event.origin,
                data: event.data,
                timestamp: new Date().toISOString(),
            });

            try {
                const messageData = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;

                if (messageData && typeof messageData === 'object') {
                    console.log('🎮 Structured game data:', messageData); // Log raw data for debugging

                    // Check for game completion indicators
                    if (messageData.status === 'complete' || messageData.text === 'GAME COMPLETE') {
                        handleGameResult(messageData, event.source);
                    }
                }
            } catch (error) {
                console.error('❌ Error parsing message:', error);
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [activityStartTimes, completedActivities]);

    const handleGameResult = (data: any, source: any) => {
        const iframeUrl = Object.values(iframeRefs.current).find(
            (iframe) => iframe?.contentWindow === source
        )?.src;

        if (!iframeUrl) {
            console.error('❌ No matching iframe found for source:', source);
            return;
        }

        const activity = findActivityByUrl(iframeUrl);
        if (activity) {
            // Parse score from string like "2 / 5"
            let score: number | undefined;
            let total: number | undefined;
            if (typeof data.score === 'string' && data.score.includes('/')) {
                const [correct, totalScore] = data.score.split('/').map(Number);
                score = correct;
                total = totalScore;
            } else if (typeof data.score === 'number') {
                score = data.score;
            }

            // Parse time from string like "27.7s"
            let timeSpent: number | undefined;
            if (typeof data.time === 'string' && data.time.endsWith('s')) {
                timeSpent = parseFloat(data.time.replace('s', '')) * 1000; // Convert to milliseconds
            } else if (activityStartTimes[iframeUrl]) {
                timeSpent = Date.now() - activityStartTimes[iframeUrl]; // Fallback to calculated time
            }

            const result: ActivityResult = {
                url: iframeUrl,
                title: activity.title,
                timestamp: new Date().toISOString(),
                score: score, // Store raw score or calculated percentage if total is available
                completed: true, // Assume completed since "GAME COMPLETE" is shown
                timeSpent: timeSpent,
                attempts: data.attempts || 1,
            };

            setActivityResults((prev) => [...prev, result]);
            setCompletedActivities((prev) => [...prev, iframeUrl]);

            console.log('📊 Complete activity result:', result);
            alert(`🎉 Great job! You completed ${activity.title} with a score of ${score || 'N/A'} out of ${total || 'N/A'}!`);
        }
    };

    const findActivityByUrl = (url: string) => {
        for (const modality of modalities) {
            const activity = modality.embeds.find((embed) => embed.url === url);
            if (activity) return activity;
        }
        return null;
    };

    const handleIframeLoad = (url: string, title: string, iframe: HTMLIFrameElement | null) => {
        console.log(`📱 Iframe loaded successfully: ${title} (${url})`);

        setActivityStartTimes((prev) => ({
            ...prev,
            [url]: Date.now(),
        }));

        if (iframe && iframe.contentWindow) {
            try {
                iframe.contentWindow.postMessage(
                    {
                        type: 'PARENT_READY',
                        parentOrigin: window.location.origin,
                    },
                    'https://wordwall.net'
                );
                console.log('📤 Sent ready message to iframe');
            } catch (error) {
                console.error('⚠️ Could not send message to iframe:', error);
            }
        }
    };

    const handleIframeError = (url: string, title: string) => {
        setFailedEmbeds((prev) => [...prev, url]);
        console.error(`❌ Failed to load iframe: ${title} (${url})`);
    };

    const handleActivityComplete = (url: string, title: string) => {
        const startTime = activityStartTimes[url];
        const timeSpent = startTime ? Date.now() - startTime : 0;

        const result: ActivityResult = {
            url,
            title,
            timestamp: new Date().toISOString(),
            completed: true,
            timeSpent,
            attempts: 1,
        };

        setActivityResults((prev) => [...prev, result]);
        setCompletedActivities((prev) => [...prev, url]);

        console.log('✅ Activity marked as completed manually:', result);
        console.log('📊 All results so far:', [...activityResults, result]);
    };

    const simulateGameResult = (url: string, title: string) => {
        const mockResult = {
            score: Math.floor(Math.random() * 100) + 1,
            points: Math.floor(Math.random() * 1000) + 100,
            completed: true,
            finished: true,
            attempts: Math.floor(Math.random() * 3) + 1,
        };

        console.log('🎮 Simulating game result for:', title, mockResult);
        handleGameResult(mockResult, iframeRefs.current[url]?.contentWindow);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-blue-400 relative overflow-hidden">
            {/* Floating animations */}
            <div className="absolute top-10 left-10 text-4xl animate-bounce">🌟</div>
            <div className="absolute top-20 right-20 text-3xl animate-ping">⭐</div>
            <div className="absolute bottom-20 left-20 text-4xl animate-pulse">🎈</div>

            {/* Navigation Bar */}
            <Header></Header>

            <div className="container mx-auto px-4 py-12">
                {/* Results Panel */}
                {showResults && (
                    <div className="mb-8 bg-white/95 rounded-3xl p-6 border-4 border-green-400 shadow-2xl">
                        <h2 className="text-2xl font-bold text-green-800 mb-4 flex items-center">
                            <Star className="mr-2 h-6 w-6" />
                            Activity Results Dashboard
                        </h2>
                        {activityResults.length === 0 ? (
                            <p className="text-gray-600">No activity results yet. Complete some activities to see your progress!</p>
                        ) : (
                            <div className="space-y-4">
                                {activityResults.map((result, index) => (
                                    <div
                                        key={index}
                                        className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border-2 border-blue-200"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="font-bold text-lg text-purple-800">{result.title}</h3>
                                                <p className="text-sm text-gray-600">
                                                    <Clock className="inline h-4 w-4 mr-1" />
                                                    {new Date(result.timestamp).toLocaleString()}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                {result.score !== undefined && (
                                                    <div className="text-2xl font-bold text-green-600">Score: {result.score}</div>
                                                )}
                                                <div className="text-sm text-gray-600">
                                                    Time: {result.timeSpent ? Math.floor(result.timeSpent / 1000) : 0}s
                                                </div>
                                                {result.attempts && <div className="text-sm text-gray-600">Attempts: {result.attempts}</div>}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Header */}
                <div className="text-center mb-16">
                    <div className="relative">
                        <div className="text-6xl mb-4 animate-bounce">🧠</div>
                        <h1 className="text-6xl font-bold text-white mb-6 animate-pulse">
                            🪄 Learning Modularities with {userName}!
                        </h1>
                        <div className="absolute -top-8 -left-8 text-5xl animate-spin">⭐</div>
                        <div className="absolute -top-8 -right-8 text-5xl animate-spin">⭐</div>
                    </div>
                    <div className="bg-white/90 rounded-3xl p-6 max-w-4xl mx-auto border-4 border-yellow-400 shadow-2xl">
                        <p className="text-2xl text-purple-800 font-bold mb-4">
                            Hi {userName}! 👋 Let's explore fun learning styles together!
                        </p>
                        <p className="text-lg text-blue-700">
                            🌟 Choose a modality below to dive into interactive activities tailored for different ways of learning! 🌟
                        </p>
                    </div>
                </div>

                {/* Modalities Grid */}
                <div className="grid md:grid-cols-2 gap-10 mb-12">
                    {modalities.map((modality) => (
                        <Card
                            key={modality.id}
                            className={`hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:rotate-1 bg-gradient-to-br ${getColorClasses(modality.color)} border-4 relative overflow-hidden group`}
                        >
                            <div className="absolute top-4 right-4 text-4xl animate-bounce group-hover:animate-spin">
                                {modality.emoji}
                            </div>
                            <CardHeader className="text-center pt-12 pb-4">
                                <div className="relative mx-auto mb-4">
                                    <Brain className={`h-20 w-20 ${getIconColor(modality.color)} animate-pulse`} />
                                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full animate-ping"></div>
                                </div>
                                <CardTitle className="text-3xl text-gray-800 mb-4">{modality.title}</CardTitle>
                                <div className="bg-purple-100 px-4 py-2 rounded-full inline-block">
                                    <span className="text-purple-800 font-bold">Learn through {modality.title}!</span>
                                </div>
                            </CardHeader>
                            <CardContent className="px-6 pb-8">
                                <p className="text-gray-700 mb-8 text-lg text-center leading-relaxed">{modality.description}</p>
                                <Button
                                    onClick={() => setActiveModality(activeModality === modality.id ? null : modality.id)}
                                    className="mb-4 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-bold"
                                    aria-label={`Toggle ${modality.title} activities`}
                                >
                                    {activeModality === modality.id ? 'Hide Activities' : 'Show Activities'}
                                </Button>
                                {activeModality === modality.id && (
                                    <div className="grid grid-cols-1 gap-6">
                                        {modality.embeds.map((embed) => (
                                            <div key={embed.url} className="relative w-full">
                                                {failedEmbeds.includes(embed.url) ? (
                                                    <div className="bg-red-100 p-4 rounded-md text-center">
                                                        <p className="text-red-600 font-bold">Activity failed to load.</p>
                                                        <a
                                                            href={embed.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-blue-600 underline hover:text-blue-800"
                                                            aria-label={`Open ${embed.title} in a new tab`}
                                                        >
                                                            Open {embed.title} in a new tab
                                                        </a>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-4">
                                                        <div className="relative w-full h-0 pb-[50%] overflow-hidden rounded-md shadow">
                                                            <iframe
                                                                ref={(el) => {
                                                                    iframeRefs.current[embed.url] = el;
                                                                }}
                                                                src={embed.url}
                                                                title={embed.title}
                                                                className="absolute top-0 left-0 w-full h-full"
                                                                frameBorder="0"
                                                                allow="fullscreen"
                                                                referrerPolicy="no-referrer"
                                                                sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                                                                onLoad={() => handleIframeLoad(embed.url, embed.title, iframeRefs.current[embed.url])}
                                                                onError={() => handleIframeError(embed.url, embed.title)}
                                                                aria-label={`Activity: ${embed.title}`}
                                                            ></iframe>
                                                        </div>
                                                        <div className="flex space-x-2">
                                                            <Button
                                                                className="flex-1 bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white font-bold"
                                                                onClick={() => handleActivityComplete(embed.url, embed.title)}
                                                                disabled={completedActivities.includes(embed.url)}
                                                                aria-label={
                                                                    completedActivities.includes(embed.url)
                                                                        ? `${embed.title} completed`
                                                                        : `Mark ${embed.title} as completed`
                                                                }
                                                            >
                                                                <CheckCircle className="mr-2 h-4 w-4" />
                                                                {completedActivities.includes(embed.url) ? 'Completed!' : 'Mark as Completed'}
                                                            </Button>
                                                            <Button
                                                                className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-bold"
                                                                onClick={() => simulateGameResult(embed.url, embed.title)}
                                                                aria-label={`Simulate result for ${embed.title}`}
                                                            >
                                                                🎮 Simulate Result
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                            <div className="absolute -bottom-12 -left-12 w-24 h-24 bg-white/20 rounded-full group-hover:animate-ping"></div>
                            <div className="absolute -top-12 -right-12 w-20 h-20 bg-white/20 rounded-full group-hover:animate-ping"></div>
                        </Card>
                    ))}
                </div>

                {/* Back to Home */}
                <div className="text-center">
                    <Link to="/">
                        <Button
                            className="bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-700 hover:to-gray-900 text-white px-8 py-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                            aria-label="Back to home"
                        >
                            <Home className="mr-3 h-5 w-5" />
                            🏠 Home
                        </Button>
                    </Link>
                </div>

                {/* Debug Console */}
                <div className="mt-8 bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
                    <h3 className="text-white font-bold mb-2">🔍 Debug Console</h3>
                    <p>Active Activities: {Object.keys(activityStartTimes).length}</p>
                    <p>Completed Activities: {completedActivities.length}</p>
                    <p>Total Results: {activityResults.length}</p>
                    <p>Failed Embeds: {failedEmbeds.length}</p>
                    {failedEmbeds.length > 0 && (
                        <p className="text-red-400">Failed URLs: {failedEmbeds.join(', ')}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Modularities;