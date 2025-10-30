import React from 'react';
import { type Alert, PatientNeed } from '../types';
import { getIconForNeed, SparklesIcon, LoadingSpinnerIcon } from './icons';

interface AlertCardProps {
    alert: Alert;
    onDismiss: (id: number, need: PatientNeed) => void;
    onGetSuggestions: (need: PatientNeed, id: number) => void;
    suggestions?: string[];
    isLoading: boolean;
}

const AlertCard: React.FC<AlertCardProps> = ({ alert, onDismiss, onGetSuggestions, suggestions, isLoading }) => {
    const cardStyles = {
        High: 'bg-red-900/50 border-red-500',
        Medium: 'bg-yellow-900/50 border-yellow-500',
        Low: 'bg-blue-900/50 border-blue-500',
        None: ''
    };

    const iconStyles = {
        High: 'text-red-400',
        Medium: 'text-yellow-400',
        Low: 'text-blue-400',
        None: ''
    };
    
    if (alert.need === PatientNeed.Calm) {
        return null; // Don't render a card for "Calm" status
    }

    const title = `${alert.need} Request`;
    const icon = getIconForNeed(alert.need, `h-8 w-8 ${iconStyles[alert.urgency]}`);

    const hasSuggestions = suggestions && suggestions.length > 0;

    return (
        <div className={`border-l-4 ${cardStyles[alert.urgency]} bg-gray-800 p-4 rounded-lg shadow-lg flex space-x-4 animate-fade-in`}>
            <div className="flex-shrink-0">
                <div className={`h-12 w-12 rounded-full ${cardStyles[alert.urgency]} bg-gray-700/50 flex items-center justify-center`}>
                    {icon}
                </div>
            </div>
            <div className="flex-1">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className={`text-lg font-bold ${iconStyles[alert.urgency]}`}>{title}</h3>
                        <p className="text-gray-300 mt-1">{alert.message}</p>
                    </div>
                    <span className="text-xs text-gray-400 flex-shrink-0 ml-2">{alert.timestamp.toLocaleTimeString()}</span>
                </div>

                {/* AI Suggestions Section */}
                {hasSuggestions && (
                    <div className="mt-4 pt-3 border-t border-gray-700">
                         <h4 className="text-sm font-semibold text-cyan-400 mb-2">Caregiver Suggestions</h4>
                         <ul className="list-disc list-inside space-y-1 text-gray-300 text-sm">
                            {suggestions.map((suggestion, index) => (
                                <li key={index}>{suggestion}</li>
                            ))}
                         </ul>
                         <p className="text-right text-xs text-gray-500 mt-2">Powered by Gemini</p>
                    </div>
                )}
                
                <div className="mt-4 flex justify-end space-x-2">
                    {!hasSuggestions && !isLoading && (
                         <button
                            onClick={() => onGetSuggestions(alert.need, alert.id)}
                            className="text-sm font-semibold text-cyan-300 bg-cyan-900/50 hover:bg-cyan-800/50 px-3 py-1 rounded-md transition-colors flex items-center space-x-2"
                        >
                            <SparklesIcon className="h-4 w-4" />
                            <span>Get Suggestions</span>
                        </button>
                    )}
                     {isLoading && (
                         <div className="flex items-center space-x-2 text-sm text-gray-400 px-3 py-1">
                            <LoadingSpinnerIcon className="h-4 w-4" />
                            <span>Generating...</span>
                         </div>
                    )}
                    <button
                        onClick={() => onDismiss(alert.id, alert.need)}
                        className="text-sm font-semibold text-gray-300 bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-md transition-colors"
                    >
                        Dismiss
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AlertCard;