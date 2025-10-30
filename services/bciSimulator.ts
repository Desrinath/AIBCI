
import { PatientNeed, type Alert, type Urgency } from '../types';

const NEED_PROBABILITY = 0.35; // 35% chance of a need being detected in an interval
const NEEDS = [PatientNeed.Food, PatientNeed.Water, PatientNeed.Restroom, PatientNeed.Emergency];
const NEED_WEIGHTS = [0.3, 0.3, 0.3, 0.1]; // Emergency is less frequent

const getUrgencyAndMessage = (need: PatientNeed): { urgency: Urgency; message: string } => {
  switch (need) {
    case PatientNeed.Emergency:
      return { urgency: 'High', message: 'Emergency assistance required immediately!' };
    case PatientNeed.Restroom:
      return { urgency: 'Medium', message: 'Patient requires restroom assistance.' };
    case PatientNeed.Food:
      return { urgency: 'Low', message: 'Patient has indicated a need for food.' };
    case PatientNeed.Water:
      return { urgency: 'Low', message: 'Patient has indicated a need for water.' };
    case PatientNeed.Calm:
    default:
      return { urgency: 'None', message: 'Patient is calm. No immediate needs detected.' };
  }
};

// Weighted random selection utility
const weightedRandom = <T,>(items: T[], weights: number[]): T => {
  let i;
  let sum = 0;
  const r = Math.random();

  for (i in weights) {
    sum += weights[i];
    if (r <= sum) return items[i];
  }
  // This should not be reached if weights sum to 1
  return items[items.length - 1];
};

export const startSimulation = (callback: (alert: Alert) => void) => {
  const intervalId = setInterval(() => {
    let detectedNeed: PatientNeed;

    if (Math.random() < NEED_PROBABILITY) {
      detectedNeed = weightedRandom(NEEDS, NEED_WEIGHTS);
    } else {
      detectedNeed = PatientNeed.Calm;
    }

    const { urgency, message } = getUrgencyAndMessage(detectedNeed);
    
    const newAlert: Alert = {
      id: Date.now(),
      need: detectedNeed,
      message,
      timestamp: new Date(),
      urgency,
    };

    callback(newAlert);

  }, 5000); // Generate a new event every 5 seconds

  // Return a cleanup function
  return () => {
    clearInterval(intervalId);
  };
};
