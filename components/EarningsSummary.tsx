
import React from 'react';
import { Earning } from '../types';

interface EarningsSummaryProps {
    earnings: Earning[];
}

const EarningsSummary: React.FC<EarningsSummaryProps> = ({ earnings }) => {
    const commissionRate = 0.85; // For display
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const earningsThisMonth = earnings
        .filter(e => {
            const bookingDate = new Date(e.bookingDate);
            return bookingDate.getMonth() === currentMonth && bookingDate.getFullYear() === currentYear;
        })
        .reduce((sum, e) => sum + e.amountEarned, 0);

    const pendingPayout = earnings
        .filter(e => e.status === 'Pending')
        .reduce((sum, e) => sum + e.amountEarned, 0);

    const totalEarnings = earnings.reduce((sum, e) => sum + e.amountEarned, 0);

    const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;

    return (
        <div className="bg-white p-6 rounded-lg shadow-md h-full flex flex-col">
            <h3 className="text-xl font-bold mb-2 text-dark">Earnings Summary</h3>
            <p className="text-xs text-gray-500 mb-4">We use a transparent {(1 - commissionRate) * 100}% commission. You keep {commissionRate * 100}% of the job price.</p>
            <div className="space-y-4 text-center">
                <div className="bg-light p-3 rounded-lg">
                    <p className="text-sm font-medium text-gray-600">Earnings this Month</p>
                    <p className="text-2xl font-bold text-success">{formatCurrency(earningsThisMonth)}</p>
                </div>
                <div className="bg-light p-3 rounded-lg">
                    <p className="text-sm font-medium text-gray-600">Pending Payout</p>
                    <p className="text-2xl font-bold text-yellow-600">{formatCurrency(pendingPayout)}</p>
                </div>
                <div className="bg-light p-3 rounded-lg">
                    <p className="text-sm font-medium text-gray-600">All-Time Earnings</p>
                    <p className="text-2xl font-bold text-primary">{formatCurrency(totalEarnings)}</p>
                </div>
            </div>
            <div className="mt-auto pt-4 text-right">
                <a href="#" className="text-sm text-primary hover:underline">View Payout History &rarr;</a>
            </div>
        </div>
    );
};

export default EarningsSummary;
