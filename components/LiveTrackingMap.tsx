
import React, { useState, useEffect } from 'react';
import { ServiceProvider, User } from '../types';

interface LiveTrackingMapProps {
    provider: ServiceProvider;
    customer: User;
}

const LiveTrackingMap: React.FC<LiveTrackingMapProps> = ({ provider, customer }) => {
    // These are simplified positions for a 200x200 box.
    const customerPos = { x: 85, y: 15 }; // Top right
    const providerStartPos = { x: 5, y: 85 }; // Bottom left
    const [providerCurrentPos, setProviderCurrentPos] = useState(providerStartPos);
    
    // Simulate movement
    useEffect(() => {
        const totalDuration = 20000; // 20 seconds
        const updateInterval = 100; // 100ms
        const steps = totalDuration / updateInterval;
        let currentStep = 0;

        const dx = (customerPos.x - providerStartPos.x) / steps;
        const dy = (customerPos.y - providerStartPos.y) / steps;

        const interval = setInterval(() => {
            if (currentStep < steps) {
                setProviderCurrentPos(prev => ({
                    x: prev.x + dx,
                    y: prev.y + dy,
                }));
                currentStep++;
            } else {
                clearInterval(interval);
                // Snap to final position
                setProviderCurrentPos(customerPos);
            }
        }, updateInterval);

        return () => clearInterval(interval);
    }, [customerPos.x, customerPos.y, providerStartPos.x, providerStartPos.y]);

    return (
        <div className="h-64 bg-teal-50 relative p-4 overflow-hidden">
            {/* Map Background Elements */}
            <div className="absolute top-1/2 left-0 w-full h-1 bg-teal-200/50 -translate-y-1/2"></div>
            <div className="absolute left-1/2 top-0 h-full w-1 bg-teal-200/50 -translate-x-1/2"></div>
            <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 border-2 border-dashed border-teal-200 rounded-full"></div>


            {/* Provider Pin */}
            <div 
                className="absolute transition-all duration-100 ease-linear"
                style={{ top: `${providerCurrentPos.y}%`, left: `${providerCurrentPos.x}%`, transform: 'translate(-50%, -100%)' }}
            >
                <div className="relative flex flex-col items-center">
                    <span className="bg-primary text-white text-xs font-bold px-2 py-1 rounded-md mb-1 whitespace-nowrap">{provider.businessName}</span>
                    <i className="fas fa-truck-moving text-3xl text-primary"></i>
                </div>
            </div>

            {/* Customer Pin */}
            <div 
                className="absolute"
                style={{ top: `${customerPos.y}%`, left: `${customerPos.x}%`, transform: 'translate(-50%, -100%)' }}
            >
                <div className="relative flex flex-col items-center">
                    <span className="bg-success text-white text-xs font-bold px-2 py-1 rounded-md mb-1">You</span>
                    <i className="fas fa-house-chimney text-3xl text-success"></i>
                </div>
            </div>
            
            <div className="absolute bottom-2 left-2 bg-white/80 p-2 rounded-md shadow-md">
                <p className="text-sm font-bold text-dark">Live Tracking</p>
                <p className="text-xs text-gray-600">{provider.name} is on the way!</p>
            </div>
        </div>
    );
};

export default LiveTrackingMap;
