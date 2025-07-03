
import React from 'react';
import { Quote } from '../types';

interface QuoteDetailsProps {
    quote: Quote;
}

const QuoteDetails: React.FC<QuoteDetailsProps> = ({ quote }) => {
    return (
        <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-400">
            <h4 className="text-lg font-bold text-purple-800 mb-3">Quote Received</h4>
            <div className="space-y-2">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b-2 border-purple-200">
                            <th className="text-left font-semibold text-purple-700 pb-1">Description</th>
                            <th className="text-right font-semibold text-purple-700 pb-1">Cost</th>
                        </tr>
                    </thead>
                    <tbody>
                        {quote.items.map((item, index) => (
                            <tr key={index} className="border-b border-purple-200/50">
                                <td className="py-2 text-gray-700">{item.description}</td>
                                <td className="py-2 text-right text-gray-800 font-medium">${item.cost.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr className="font-bold">
                            <td className="py-2 text-right text-purple-800">Total</td>
                            <td className="py-2 text-right text-xl text-purple-900">${quote.total.toFixed(2)}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
            {quote.providerNotes && (
                <div className="mt-3 pt-3 border-t border-purple-200">
                    <p className="text-sm font-semibold text-purple-700">Provider's Notes:</p>
                    <p className="text-sm text-gray-600 italic">"{quote.providerNotes}"</p>
                </div>
            )}
        </div>
    );
};

export default QuoteDetails;
