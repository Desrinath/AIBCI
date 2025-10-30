import React from 'react';
import { PatientStatus } from '../types';
import ComfortDial from './ComfortDial';

interface PatientStatusProps {
    status: PatientStatus;
    lastMessage: string;
    comfortScore: number;
}

const PatientStatusDisplay: React.FC<PatientStatusProps> = ({ status, lastMessage, comfortScore }) => {
    const statusConfig = {
        [PatientStatus.Calm]: {
            color: 'bg-green-500',
            text: 'text-green-300',
            label: 'Calm',
        },
        [PatientStatus.NeedsAttention]: {
            color: 'bg-yellow-500',
            text: 'text-yellow-300',
            label: 'Needs Attention',
        },
        [PatientStatus.Emergency]: {
            color: 'bg-red-500',
            text: 'text-red-300',
            label: 'Emergency',
        }
    };

    const config = statusConfig[status];

    return (
        <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-xl mb-6 mx-4 md:mx-auto max-w-7xl">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                {/* Overall Comfort Score Dial */}
                <div className="flex-shrink-0">
                    <ComfortDial score={comfortScore} />
                </div>

                {/* Status and Last Signal */}
                <div className="flex-1 w-full text-center sm:text-left">
                     <div className="flex items-center space-x-4 mb-4 justify-center sm:justify-start">
                        <span className="relative flex h-4 w-4">
                            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${config.color} opacity-75`}></span>
                            <span className={`relative inline-flex rounded-full h-4 w-4 ${config.color}`}></span>
                        </span>
                        <div>
                            <p className="text-sm font-medium text-gray-400">Current Patient Status</p>
                            <p className={`text-xl font-bold ${config.text}`}>{config.label}</p>
                        </div>
                    </div>
                    <div className="text-center sm:text-right">
                         <p className="text-sm font-medium text-gray-400">Last Detected Signal</p>
                         <p className="text-md text-gray-300 truncate">{lastMessage}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientStatusDisplay;