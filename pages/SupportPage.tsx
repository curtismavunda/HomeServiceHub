
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";
import Button from '../components/Button';

const faqData = [
  {
    question: "How do I book a service?",
    answer: "To book a service, simply find a service provider you like, go to their profile, and click the 'Book Now' button. Fill out the required details in the booking form and submit your request. The provider will then confirm your appointment."
  },
  {
    question: "How are service providers verified?",
    answer: "All service providers on our platform go through a verification process. For providers in certified trades, we require them to upload their certifications. We also verify their identity using a South African ID or passport."
  },
  {
    question: "Can I cancel a booking?",
    answer: "Yes, you can cancel a booking from your customer dashboard. Please note that cancellation policies may vary by provider, so it's a good idea to check their profile for any specific terms."
  },
  {
    question: "How do I become a service provider?",
    answer: "Click the 'Register' button on the homepage, select 'Service Provider', and fill out the registration form. You will need to provide your business details, contact information, and any required certifications for verification."
  },
];

const FaqItem: React.FC<{ q: string, a: string }> = ({ q, a }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left flex justify-between items-center p-4 focus:outline-none"
      >
        <span className="text-lg font-medium">{q}</span>
        <i className={`fas fa-chevron-down transform transition-transform ${isOpen ? 'rotate-180' : ''}`}></i>
      </button>
      {isOpen && (
        <div className="p-4 bg-light">
          <p className="text-gray-700">{a}</p>
        </div>
      )}
    </div>
  );
};

interface AIMessage {
  role: 'user' | 'model';
  text: string;
}

const AICompanionChat: React.FC = () => {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chat, setChat] = useState<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize the AI model and chat
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
    const faqContext = faqData.map(item => `Question: ${item.question}\nAnswer: ${item.answer}`).join('\n\n');

    const systemInstruction = `You are "HubHelper", a friendly and helpful AI assistant for the "Home Services Hub" application. Your goal is to assist users with their questions about the app.

    You have access to the following Frequently Asked Questions (FAQ). Use this information to answer questions whenever possible.
    If the user asks something not covered in the FAQ, use your general knowledge to provide a helpful response related to a home services app.
    Keep your answers concise, clear, and friendly. Always format your answers for readability (e.g., use lists or bold text where appropriate).
    
    Here is the FAQ data:
    ${faqContext}
    
    Do not mention that you are a language model. You are HubHelper. Start the conversation by introducing yourself and asking how you can help.`;

    const newChat = ai.chats.create({
      model: 'gemini-2.5-flash-preview-04-17',
      config: {
        systemInstruction: systemInstruction,
      },
    });
    setChat(newChat);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !chat || isLoading) return;

    const userMessage: AIMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const responseStream = await chat.sendMessageStream({ message: input });
      
      let currentModelMessage = '';
      setMessages(prev => [...prev, { role: 'model', text: '' }]);

      for await (const chunk of responseStream) {
        currentModelMessage += chunk.text;
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].text = currentModelMessage;
          return newMessages;
        });
      }
    } catch (error) {
      console.error("Error sending message to AI:", error);
      setMessages(prev => [...prev, { role: 'model', text: 'Sorry, I seem to be having trouble right now. Please try again later.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg mt-8">
      <h2 className="text-2xl font-bold mb-4 flex items-center">
        <i className="fas fa-robot text-primary mr-3"></i> AI Support Assistant
      </h2>
      <div className="h-96 bg-light rounded-lg p-4 flex flex-col space-y-4 overflow-y-auto border">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-2xl ${msg.role === 'user' ? 'bg-primary text-white rounded-br-none' : 'bg-gray-200 text-dark rounded-bl-none'}`}>
              <p className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
            </div>
          </div>
        ))}
         {isLoading && messages[messages.length-1].role === 'user' && (
            <div className="flex justify-start">
                <div className="max-w-lg p-3 rounded-2xl bg-gray-200 text-dark rounded-bl-none">
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
                    </div>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSendMessage} className="mt-4 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything about Home Services Hub..."
          className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
          disabled={isLoading || !chat}
        />
        <Button type="submit" disabled={isLoading || !chat}>
          {isLoading ? 'Thinking...' : 'Send'}
        </Button>
      </form>
    </div>
  );
};


const SupportPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-8">Support Center</h1>

      <AICompanionChat />
      
      <div className="bg-white p-8 rounded-lg shadow-lg mt-8">
        <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions (FAQ)</h2>
        <div className="space-y-2">
          {faqData.map((item, index) => (
            <FaqItem key={index} q={item.question} a={item.answer} />
          ))}
        </div>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-lg mt-8 text-center">
         <h2 className="text-2xl font-bold mb-4">Still need help?</h2>
         <p className="text-gray-600 mb-4">Our support team is here for you. Contact us anytime.</p>
         <a href="mailto:support@homeserviceshub.com" className="bg-primary text-white font-bold py-3 px-6 rounded-md hover:bg-primary-hover transition duration-300">
            <i className="fas fa-envelope mr-2"></i> Contact Support
         </a>
      </div>
    </div>
  );
};

export default SupportPage;
