
import React, { useState, useEffect } from 'react';
import { Booking } from '../types';
import Button from './Button';

interface ReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (rating: number, comment: string) => void;
    booking: Booking | null;
}

const Star: React.FC<{ selected: boolean; onSelect: () => void; onHover: () => void }> = ({ selected, onSelect, onHover }) => (
    <i 
        className={`fas fa-star text-3xl cursor-pointer transition-colors ${selected ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-200'}`}
        onClick={onSelect}
        onMouseEnter={onHover}
    ></i>
);

const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen, onClose, onSubmit, booking }) => {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');

    useEffect(() => {
        // Reset state when modal opens for a new booking
        if (isOpen) {
            setRating(0);
            setHoverRating(0);
            setComment('');
        }
    }, [isOpen]);

    if (!isOpen || !booking) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) {
            alert("Please select a star rating.");
            return;
        }
        onSubmit(rating, comment);
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4"
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <div 
                className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-lg transform transition-all"
                onClick={e => e.stopPropagation()}
            >
                <h2 className="text-2xl font-bold mb-2">Leave a Review</h2>
                <p className="text-gray-600 mb-4">How was your experience with <span className="font-semibold">{booking.providerName}</span> for the <span className="font-semibold">{booking.serviceName}</span> service?</p>
                
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating</label>
                        <div className="flex justify-center space-x-2" onMouseLeave={() => setHoverRating(0)}>
                            {[1, 2, 3, 4, 5].map(starIndex => (
                                <Star 
                                    key={starIndex}
                                    selected={(hoverRating || rating) >= starIndex}
                                    onSelect={() => setRating(starIndex)}
                                    onHover={() => setHoverRating(starIndex)}
                                />
                            ))}
                        </div>
                    </div>
                    
                    <div className="mb-6">
                        <label htmlFor="comment" className="block text-sm font-medium text-gray-700">Comments</label>
                        <textarea
                            id="comment"
                            rows={4}
                            value={comment}
                            onChange={e => setComment(e.target.value)}
                            placeholder="Tell us more about your experience..."
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                        ></textarea>
                    </div>

                    <div className="flex justify-end gap-4">
                        <Button type="button" variant="secondary" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary">
                            Submit Review
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReviewModal;
