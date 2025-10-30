
export enum PatientNeed {
  Food = 'Food',
  Water = 'Water',
  Restroom = 'Restroom',
  Emergency = 'Emergency',
  Calm = 'Calm'
}

export type Urgency = 'Low' | 'Medium' | 'High' | 'None';

export interface Alert {
  id: number;
  need: PatientNeed;
  message: string;
  timestamp: Date;
  urgency: Urgency;
}

export enum PatientStatus {
  Calm = 'Calm',
  NeedsAttention = 'Needs Attention',
  Emergency = 'Emergency'
}
