
import React, { useState, useEffect, useMemo } from 'react';
import { Booking, Quote } from '../types';
import Button from './Button';

interface QuoteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (quoteData: Quote) => void;
    booking: Booking | null;
}

const QuoteModal: React.FC<QuoteModalProps> = ({ isOpen, onClose, onSubmit, booking }) => {
    const [items, setItems] = useState<{ description: string; cost: number }[]>([{ description: '', cost: 0 }]);
    const [providerNotes, setProviderNotes] = useState('');

    useEffect(() => {
        if (isOpen) {
            setItems([{ description: '', cost: 0 }]);
            setProviderNotes('');
        }
    }, [isOpen]);

    const total = useMemo(() => items.reduce((sum, item) => sum + (Number(item.cost) || 0), 0), [items]);

    if (!isOpen || !booking) return null;

    const handleItemChange = (index: number, field: 'description' | 'cost', value: string | number) => {
        const newItems = [...items];
        if (field === 'cost') {
            newItems[index][field] = Number(value) < 0 ? 0 : Number(value);
        } else {
            newItems[index][field] = String(value);
        }
        setItems(newItems);
    };

    const addItem = () => {
        setItems([...items, { description: '', cost: 0 }]);
    };

    const removeItem = (index: number) => {
        if (items.length > 1) {
            const newItems = items.filter((_, i) => i !== index);
            setItems(newItems);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const finalItems = items.filter(item => item.description.trim() !== '' && item.cost > 0);
        if (finalItems.length === 0) {
            alert("Please add at least one valid line item with a description and cost.");
            return;
        }
        const quoteData: Quote = {
            items: finalItems,
            total,
            providerNotes,
        };
        onSubmit(quoteData);
    };

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4"
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <div
                className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-2xl transform transition-all"
                onClick={e => e.stopPropagation()}
            >
                <h2 className="text-2xl font-bold mb-2">Create Quote</h2>
                <p className="text-gray-600 mb-4">For: <span className="font-semibold">{booking.serviceName}</span> for <span className="font-semibold">{booking.customerName}</span></p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Line Items</label>
                        <div className="space-y-3">
                            {items.map((item, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        placeholder="Description (e.g., Materials)"
                                        value={item.description}
                                        onChange={e => handleItemChange(index, 'description', e.target.value)}
                                        className="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                                        required
                                    />
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">$</span>
                                        <input
                                            type="number"
                                            placeholder="Cost"
                                            value={item.cost || ''}
                                            onChange={e => handleItemChange(index, 'cost', e.target.value)}
                                            className="w-32 pl-7 pr-2 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                                            min="0"
                                            step="0.01"
                                            required
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeItem(index)}
                                        disabled={items.length <= 1}
                                        className="text-danger p-2 rounded-full hover:bg-red-100 disabled:text-gray-300 disabled:hover:bg-transparent"
                                        aria-label="Remove item"
                                    >
                                        <i className="fas fa-trash"></i>
                                    </button>
                                </div>
                            ))}
                        </div>
                        <Button type="button" size="sm" variant="secondary" onClick={addItem} className="mt-2">
                            <i className="fas fa-plus mr-2"></i>Add Line Item
                        </Button>
                    </div>

                    <div>
                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Provider Notes (Optional)</label>
                        <textarea
                            id="notes"
                            rows={3}
                            value={providerNotes}
                            onChange={e => setProviderNotes(e.target.value)}
                            placeholder="e.g., This quote is valid for 14 days."
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                        ></textarea>
                    </div>
                    
                    <div className="p-4 bg-light rounded-lg border border-gray-200 flex justify-between items-center">
                        <h4 className="font-semibold text-xl">Total Quote Amount:</h4>
                        <span className="font-bold text-2xl text-primary">${total.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-end gap-4">
                        <Button type="button" variant="secondary" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary">
                            Send Quote
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default QuoteModal;
