import React from 'react';
import { FoodIcon, WaterIcon, RestroomIcon } from './icons';
import { PatientNeed } from '../types';

interface GaugeProps {
  need: PatientNeed;
  level: number; // 0-100
  icon: React.ReactNode;
}

const GAUGE_THRESHOLD = 80;

const Gauge: React.FC<GaugeProps> = ({ need, level, icon }) => {
  const isAboveThreshold = level >= GAUGE_THRESHOLD;

  return (
    <div className="flex-1 flex flex-col items-center">
      <div className="flex items-center space-x-2 text-gray-300">
        {icon}
        <span className="font-medium">{need}</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-4 mt-2 border-2 border-gray-600 relative">
        <div
          className={`h-full rounded-full transition-width duration-1000 ease-out ${isAboveThreshold ? 'bg-yellow-500 animate-subtle-pulse' : 'bg-cyan-500'}`}
          style={{ width: `${level}%` }}
        ></div>
        {/* Threshold line */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-red-400/70"
          style={{ left: `${GAUGE_THRESHOLD}%` }}
          title={`Alert Threshold (${GAUGE_THRESHOLD}%)`}
        ></div>
      </div>
    </div>
  );
};


interface NeedsGaugesProps {
  foodLevel: number;
  waterLevel: number;
  restroomLevel: number;
}

const NeedsGauges: React.FC<NeedsGaugesProps> = ({ foodLevel, waterLevel, restroomLevel }) => {
  return (
    <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-xl mb-6 mx-4 md:mx-auto max-w-7xl">
      <h3 className="text-lg font-semibold text-gray-200 mb-4">Patient Needs Levels</h3>
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-8">
        <Gauge need={PatientNeed.Food} level={foodLevel} icon={<FoodIcon className="h-6 w-6" />} />
        <Gauge need={PatientNeed.Water} level={waterLevel} icon={<WaterIcon className="h-6 w-6" />} />
        <Gauge need={PatientNeed.Restroom} level={restroomLevel} icon={<RestroomIcon className="h-6 w-6" />} />
      </div>
    </div>
  );
};

export default NeedsGauges;