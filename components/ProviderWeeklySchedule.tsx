
import React, { useState } from 'react';
import { Booking, BookingStatus } from '../types';

interface ProviderWeeklyScheduleProps {
    bookings: Booking[];
}

const ProviderWeeklySchedule: React.FC<ProviderWeeklyScheduleProps> = ({ bookings }) => {
    const [weekOffset, setWeekOffset] = useState(0);

    const getWeekDays = (offset: number): Date[] => {
        const today = new Date();
        today.setDate(today.getDate() + offset * 7);
        const dayOfWeek = today.getDay(); // 0 (Sun) - 6 (Sat)
        const startDate = new Date(today);
        startDate.setDate(today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)); // Start on Monday
        return Array.from({ length: 7 }, (_, i) => {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            return date;
        });
    };

    const weekDays = getWeekDays(weekOffset);
    const weekStart = weekDays[0];
    const weekEnd = weekDays[6];

    const bookingsByDay: { [key: string]: Booking[] } = {};
    weekDays.forEach(day => {
        const dayString = day.toISOString().split('T')[0];
        bookingsByDay[dayString] = bookings
            .filter(b => b.date === dayString && (b.status === BookingStatus.Confirmed || b.status === BookingStatus.OnTheWay))
            .sort((a,b) => a.time.localeCompare(b.time));
    });

    const isToday = (date: Date) => date.toISOString().split('T')[0] === new Date().toISOString().split('T')[0];

    return (
        <div className="bg-white p-6 rounded-lg shadow-md h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-dark">My Schedule</h3>
                <div className="flex items-center gap-2">
                    <button onClick={() => setWeekOffset(weekOffset - 1)} className="p-1 rounded-full hover:bg-gray-200 transition-colors"><i className="fas fa-chevron-left"></i></button>
                    <span className="text-sm font-medium text-gray-600 w-48 text-center">
                        {weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                    <button onClick={() => setWeekOffset(weekOffset + 1)} className="p-1 rounded-full hover:bg-gray-200 transition-colors"><i className="fas fa-chevron-right"></i></button>
                </div>
            </div>
            <div className="grid grid-cols-7 gap-2 flex-grow">
                {weekDays.map(day => (
                    <div key={day.toISOString()} className={`p-2 rounded-lg ${isToday(day) ? 'bg-blue-50 border-2 border-primary' : 'bg-light'}`}>
                        <div className="text-center">
                            <p className="text-xs font-bold text-gray-500">{day.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()}</p>
                            <p className={`text-lg font-bold ${isToday(day) ? 'text-primary' : 'text-dark'}`}>{day.getDate()}</p>
                        </div>
                        <div className="mt-2 space-y-1 h-24 overflow-y-auto">
                            {bookingsByDay[day.toISOString().split('T')[0]].map(booking => (
                                <div key={booking.id} className="bg-primary text-white p-1 rounded-md text-xs truncate" title={`${booking.serviceName} at ${booking.time}`}>
                                    <i className="fas fa-clock mr-1"></i>
                                    {booking.time}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
             <div className="mt-4 text-right">
                <a href="#" className="text-sm text-primary hover:underline">Manage Full Availability &rarr;</a>
            </div>
        </div>
    );
};

export default ProviderWeeklySchedule;
