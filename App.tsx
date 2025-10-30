import React, { useState, useEffect, useCallback, useRef } from 'react';
import { type Alert, PatientNeed, PatientStatus, Urgency } from './types';
import { startSimulation } from './services/bciSimulator';
import { getCareSuggestions } from './services/geminiService';
import Header from './components/Header';
import PatientStatusDisplay from './components/PatientStatus';
import Dashboard from './components/Dashboard';
import NeedsGauges from './components/NeedsGauges';

const GAUGE_THRESHOLD = 80;
const PASSIVE_INCREASE_RATE = 1; // Increase level by this much every tick
const SIMULATION_BOOST = 50; // When simulator sends a need, boost by this much
const TICK_INTERVAL = 2000; // ms for passive increase

const App: React.FC = () => {
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [status, setStatus] = useState<PatientStatus>(PatientStatus.Calm);
    const [lastMessage, setLastMessage] = useState<string>('System initializing...');

    // State for gauges
    const [foodLevel, setFoodLevel] = useState(0);
    const [waterLevel, setWaterLevel] = useState(0);
    const [restroomLevel, setRestroomLevel] = useState(0);
    const [comfortScore, setComfortScore] = useState(100);

    // State for AI Suggestions
    const [suggestions, setSuggestions] = useState<Record<number, string[]>>({});
    const [loadingSuggestionId, setLoadingSuggestionId] = useState<number | null>(null);

    // Use a ref to keep track of active alerts to avoid creating duplicates from the gauge increase
    const activeAlertNeeds = useRef(new Set<PatientNeed>());
    useEffect(() => {
        activeAlertNeeds.current = new Set(alerts.map(a => a.need));
    }, [alerts]);

    // Passive increase of needs over time
    useEffect(() => {
        const timer = setInterval(() => {
            setFoodLevel(l => Math.min(100, l + PASSIVE_INCREASE_RATE));
            setWaterLevel(l => Math.min(100, l + PASSIVE_INCREASE_RATE));
            setRestroomLevel(l => Math.min(100, l + PASSIVE_INCREASE_RATE));
        }, TICK_INTERVAL);

        return () => clearInterval(timer);
    }, []);

    // Calculate overall comfort score
    useEffect(() => {
        const avgDiscomfort = (foodLevel + waterLevel + restroomLevel) / 3;
        const score = 100 - avgDiscomfort;
        setComfortScore(score);
    }, [foodLevel, waterLevel, restroomLevel]);

    // Create alerts when gauges cross threshold
    useEffect(() => {
        const checkAndCreateAlert = (level: number, need: PatientNeed, message: string, urgency: Urgency) => {
            if (level >= GAUGE_THRESHOLD && !activeAlertNeeds.current.has(need)) {
                const newAlert: Alert = {
                    id: Date.now() + Math.random(),
                    need,
                    message,
                    timestamp: new Date(),
                    urgency,
                };
                setAlerts(prev => [newAlert, ...prev]);
            }
        };

        checkAndCreateAlert(foodLevel, PatientNeed.Food, 'Patient may be hungry. Food need level is high.', 'Low');
        checkAndCreateAlert(waterLevel, PatientNeed.Water, 'Patient may be thirsty. Water need level is high.', 'Low');
        checkAndCreateAlert(restroomLevel, PatientNeed.Restroom, 'Patient may need restroom. Restroom need level is high.', 'Medium');
    }, [foodLevel, waterLevel, restroomLevel]);
    
    // Handler for BCI simulator events
    const handleNewAlert = useCallback((newAlertFromSim: Alert) => {
        setLastMessage(newAlertFromSim.message);
        
        if (newAlertFromSim.need === PatientNeed.Emergency) {
            if (!activeAlertNeeds.current.has(PatientNeed.Emergency)) {
                setAlerts(prevAlerts => [newAlertFromSim, ...prevAlerts]);
            }
            return;
        }

        switch (newAlertFromSim.need) {
            case PatientNeed.Food:
                setFoodLevel(l => Math.min(100, l + SIMULATION_BOOST));
                break;
            case PatientNeed.Water:
                setWaterLevel(l => Math.min(100, l + SIMULATION_BOOST));
                break;
            case PatientNeed.Restroom:
                setRestroomLevel(l => Math.min(100, l + SIMULATION_BOOST));
                break;
        }

    }, []);

    useEffect(() => {
        const stop = startSimulation(handleNewAlert);
        return () => stop();
    }, [handleNewAlert]);

    const dismissAlert = (id: number, need: PatientNeed) => {
        setAlerts(prevAlerts => prevAlerts.filter(alert => alert.id !== id));
        setSuggestions(prev => {
            const newSuggestions = {...prev};
            delete newSuggestions[id];
            return newSuggestions;
        });
        
        switch (need) {
            case PatientNeed.Food: setFoodLevel(0); break;
            case PatientNeed.Water: setWaterLevel(0); break;
            case PatientNeed.Restroom: setRestroomLevel(0); break;
        }
    };

    const handleGetSuggestions = async (need: PatientNeed, alertId: number) => {
        setLoadingSuggestionId(alertId);
        try {
            const result = await getCareSuggestions(need);
            setSuggestions(prev => ({
                ...prev,
                [alertId]: result,
            }));
        } catch (error) {
            console.error("Error fetching suggestions:", error);
            setSuggestions(prev => ({
                ...prev,
                [alertId]: ["Sorry, couldn't get suggestions at this time."],
            }));
        } finally {
            setLoadingSuggestionId(null);
        }
    };
    
    useEffect(() => {
        if (alerts.length === 0) {
            setStatus(PatientStatus.Calm);
        } else if (alerts.some(a => a.need === PatientNeed.Emergency)) {
            setStatus(PatientStatus.Emergency);
        } else {
            setStatus(PatientStatus.NeedsAttention);
        }
    }, [alerts]);


    return (
        <div className="min-h-screen bg-gray-900 text-white font-sans">
            <Header />
            <div className="pt-6">
                <PatientStatusDisplay 
                    status={status} 
                    lastMessage={lastMessage} 
                    comfortScore={comfortScore}
                />
                <NeedsGauges 
                    foodLevel={foodLevel} 
                    waterLevel={waterLevel} 
                    restroomLevel={restroomLevel} 
                />
                <Dashboard 
                    alerts={alerts} 
                    onDismissAlert={dismissAlert}
                    onGetSuggestions={handleGetSuggestions}
                    suggestions={suggestions}
                    loadingSuggestionId={loadingSuggestionId}
                />
            </div>
            <footer className="text-center py-4 text-xs text-gray-600">
                <p>This is a simulated interface based on the project "AI-Powered BCI for Caretaker Communication". Not for clinical use.</p>
            </footer>
        </div>
    );
};

export default App;