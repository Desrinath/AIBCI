import React from 'react';
import { type Alert, PatientNeed } from '../types';
import AlertCard from './AlertCard';

interface DashboardProps {
    alerts: Alert[];
    onDismissAlert: (id: number, need: PatientNeed) => void;
    onGetSuggestions: (need: PatientNeed, id: number) => void;
    suggestions: Record<number, string[]>;
    loadingSuggestionId: number | null;
}

const Dashboard: React.FC<DashboardProps> = ({ alerts, onDismissAlert, onGetSuggestions, suggestions, loadingSuggestionId }) => {
    const activeAlerts = alerts.filter(a => a.urgency !== 'None');

    return (
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-2xl font-semibold text-gray-200 mb-4">Active Alerts</h2>
                {activeAlerts.length > 0 ? (
                    <div className="space-y-4">
                        {activeAlerts.map((alert) => (
                            <AlertCard 
                                key={alert.id} 
                                alert={alert} 
                                onDismiss={onDismissAlert}
                                onGetSuggestions={onGetSuggestions}
                                suggestions={suggestions[alert.id]}
                                isLoading={loadingSuggestionId === alert.id}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-gray-800 rounded-lg">
                        <svg className="mx-auto h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="mt-2 text-lg font-medium text-gray-300">No Active Alerts</h3>
                        <p className="mt-1 text-sm text-gray-500">Patient is currently calm. All needs are met.</p>
                    </div>
                )}
            </div>
        </main>
    );
};

export default Dashboard;