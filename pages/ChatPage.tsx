
import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getMessagesForBooking, sendMessage, getBookingById } from '../services/dataService';
import { Message, Booking } from '../types';
import Spinner from '../components/Spinner';
import Button from '../components/Button';

const ChatPage: React.FC = () => {
    const { bookingId } = useParams<{ bookingId: string }>();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [messages, setMessages] = useState<Message[]>([]);
    const [booking, setBooking] = useState<Booking | null>(null);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const otherPartyName = user?.role === 'customer' ? booking?.providerName : booking?.customerName;

    useEffect(() => {
        if (!bookingId || !user) {
            navigate('/');
            return;
        }

        const fetchInitialData = async () => {
            try {
                const [bookingData, initialMessages] = await Promise.all([
                    getBookingById(bookingId),
                    getMessagesForBooking(bookingId)
                ]);

                if (!bookingData || (user.id !== bookingData.customerId && user.id !== bookingData.providerId)) {
                    // User is not part of this booking
                    navigate('/dashboard');
                    return;
                }

                setBooking(bookingData);
                setMessages(initialMessages);
            } catch (error) {
                console.error("Failed to load chat data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, [bookingId, user, navigate]);

    // Poll for new messages
    useEffect(() => {
        const interval = setInterval(async () => {
            if (bookingId) {
                const updatedMessages = await getMessagesForBooking(bookingId);
                if (updatedMessages.length > messages.length) {
                    setMessages(updatedMessages);
                }
            }
        }, 3000); // Poll every 3 seconds

        return () => clearInterval(interval);
    }, [bookingId, messages.length]);


    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !user || !bookingId) return;

        setIsSending(true);
        try {
            const sentMessage = await sendMessage({
                bookingId,
                senderId: user.id,
                senderName: user.name,
                text: newMessage,
            });
            setMessages(prev => [...prev, sentMessage]);
            setNewMessage('');
        } catch (error) {
            console.error("Failed to send message:", error);
            alert("Error sending message. Please try again.");
        } finally {
            setIsSending(false);
        }
    };

    if (loading) {
        return <Spinner />;
    }

    if (!booking) {
        return <div className="text-center text-danger">Booking not found.</div>;
    }

    return (
        <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-lg shadow-xl flex flex-col h-[calc(100vh-200px)]">
                {/* Header */}
                <div className="p-4 border-b flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-dark">Chat with {otherPartyName}</h1>
                        <p className="text-sm text-gray-500">Regarding: {booking.serviceName}</p>
                    </div>
                    <Link to={user?.role === 'customer' ? '/dashboard' : '/provider-dashboard'}>
                        <Button variant="secondary" size="sm">Back to Dashboard</Button>
                    </Link>
                </div>

                {/* Messages Area */}
                <div className="flex-1 p-4 overflow-y-auto bg-light space-y-4">
                    {messages.map(msg => (
                        <div key={msg.id} className={`flex ${msg.senderId === user?.id ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-xs md:max-w-md p-3 rounded-2xl ${msg.senderId === user?.id ? 'bg-primary text-white rounded-br-none' : 'bg-gray-200 text-dark rounded-bl-none'}`}>
                                <p className="text-sm font-bold mb-1">{msg.senderName}</p>
                                <p className="text-sm">{msg.text}</p>
                                <p className="text-xs mt-2 opacity-70 text-right">{new Date(msg.timestamp).toLocaleTimeString()}</p>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Form */}
                <div className="p-4 border-t">
                    <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type your message..."
                            className="flex-1 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary disabled:bg-gray-100"
                            disabled={isSending}
                        />
                        <Button type="submit" disabled={isSending}>
                            {isSending ? 'Sending...' : <><i className="fas fa-paper-plane mr-2"></i> Send</>}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChatPage;
