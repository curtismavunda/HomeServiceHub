
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { getProviders, getCategories } from '../services/dataService';
import { ServiceProvider } from '../types';
import Button from '../components/Button';
import Spinner from '../components/Spinner';
import ProviderCard from '../components/ProviderCard';

const SmartMatchPage: React.FC = () => {
    const [jobDescription, setJobDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState<{ providers: ServiceProvider[]; reasoning: string } | null>(null);
    const [error, setError] = useState('');
    const [availableCategories, setAvailableCategories] = useState<string[]>([]);

    useEffect(() => {
        // Fetch categories to provide context to the AI
        getCategories().then(cats => {
            setAvailableCategories(cats.map(c => c.name));
        });
    }, []);

    const handleSmartMatch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!jobDescription.trim()) {
            setError("Please describe the service you need.");
            return;
        }
        setIsLoading(true);
        setError('');
        setResults(null);

        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
        const systemInstruction = `You are an AI assistant for a home services app. Your task is to analyze a user's request and suggest the best service category and search keywords.
The available service categories are: ${availableCategories.join(', ')}.
Analyze the following user request and respond ONLY with a valid JSON object in the format:
{"category": "Suggested Category", "keywords": ["keyword1", "keyword2"], "reasoning": "A brief explanation of your choice."}
- 'category' MUST be one of the available categories.
- 'keywords' should be a list of 2-3 important terms from the user's request.
- 'reasoning' should be a short, user-friendly explanation of why you chose that category.
If the request is unclear or does not fit any category, set "category" to "General", use relevant keywords, and explain why in the reasoning.`;
        
        try {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-preview-04-17',
                contents: jobDescription,
                config: {
                    systemInstruction: systemInstruction,
                    responseMimeType: 'application/json',
                },
            });
            
            let jsonStr = response.text.trim();
            const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
            const match = jsonStr.match(fenceRegex);
            if (match && match[2]) {
              jsonStr = match[2].trim();
            }
            
            const aiSuggestion = JSON.parse(jsonStr);

            const { category, keywords, reasoning } = aiSuggestion;
            
            if (!category || !keywords || !reasoning) {
                throw new Error("AI response was not in the expected format.");
            }

            const searchQuery = keywords.join(' ');
            const matchedProviders = await getProviders(category !== 'General' ? category : undefined, searchQuery);
            
            setResults({ providers: matchedProviders, reasoning });

        } catch (err) {
            console.error("AI matching failed:", err);
            setError("Sorry, I had trouble understanding that. Could you try rephrasing your request or searching manually?");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                <i className="fas fa-robot text-5xl text-primary mb-4"></i>
                <h1 className="text-4xl font-bold mb-2">AI Smart Match</h1>
                <p className="text-lg text-gray-600">Don't know where to start? Describe your problem, and I'll find the right pros for you.</p>
            </div>

            <div className="mt-8 bg-white p-8 rounded-lg shadow-lg">
                <form onSubmit={handleSmartMatch}>
                    <label htmlFor="jobDescription" className="block text-sm font-medium text-gray-700 mb-2">
                        What do you need help with?
                    </label>
                    <textarea
                        id="jobDescription"
                        rows={5}
                        value={jobDescription}
                        onChange={e => setJobDescription(e.target.value)}
                        placeholder="e.g., 'My kitchen sink is leaking water everywhere, and I need someone to fix it immediately.' or 'I want to learn Spanish for my trip next month.'"
                        className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                        aria-label="Job description"
                    />
                    {error && <p className="text-danger text-sm mt-2">{error}</p>}
                    <div className="text-center mt-4">
                        <Button type="submit" size="lg" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                    Analyzing...
                                </>
                            ) : (
                                "Find My Pro"
                            )}
                        </Button>
                    </div>
                </form>
            </div>

            {isLoading && <Spinner />}

            {results && (
                <div className="mt-12">
                    <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg mb-8">
                        <h3 className="font-bold text-blue-800"><i className="fas fa-lightbulb mr-2"></i>AI Recommendation</h3>
                        <p className="text-blue-700">{results.reasoning}</p>
                    </div>

                    <h2 className="text-3xl font-bold mb-6">Suggested Providers ({results.providers.length})</h2>
                    {results.providers.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {results.providers.map(provider => (
                                <ProviderCard key={provider.id} provider={provider} />
                            ))}
                        </div>
                    ) : (
                         <div className="bg-white p-6 rounded-lg shadow-md text-center text-gray-500">
                            <i className="fas fa-search-location fa-3x mb-4"></i>
                            <p>I couldn't find any providers matching that specific request.</p>
                            <p className="text-sm mt-1">You could try rephrasing your request or searching manually.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SmartMatchPage;
