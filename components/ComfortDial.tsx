import React from 'react';

interface ComfortDialProps {
  score: number; // 0-100
}

const ComfortDial: React.FC<ComfortDialProps> = ({ score }) => {
  const normalizedScore = Math.max(0, Math.min(100, score));
  
  const config = {
    radius: 52,
    stroke: 10,
    normalizedRadius: 0,
    circumference: 0,
  };
  config.normalizedRadius = config.radius - config.stroke * 2;
  config.circumference = config.normalizedRadius * 2 * Math.PI;

  const strokeDashoffset = config.circumference - (normalizedScore / 100) * config.circumference;

  let color = 'stroke-green-500';
  let textColor = 'text-green-400';
  let label = 'Excellent';

  if (normalizedScore <= 75) {
    color = 'stroke-yellow-500';
    textColor = 'text-yellow-400';
    label = 'Good';
  }
  if (normalizedScore <= 40) {
    color = 'stroke-red-500';
    textColor = 'text-red-400';
    label = 'Poor';
  }
  
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative">
        <svg
          height={config.radius * 2}
          width={config.radius * 2}
        >
          <circle
            className="text-gray-700"
            strokeWidth={config.stroke}
            stroke="currentColor"
            fill="transparent"
            r={config.normalizedRadius}
            cx={config.radius}
            cy={config.radius}
          />
          <circle
            className={`${color} transition-all duration-500 ease-in-out`}
            strokeWidth={config.stroke}
            strokeDasharray={config.circumference + ' ' + config.circumference}
            style={{ strokeDashoffset }}
            stroke="currentColor"
            fill="transparent"
            r={config.normalizedRadius}
            cx={config.radius}
            cy={config.radius}
            strokeLinecap="round"
            transform={`rotate(-90 ${config.radius} ${config.radius})`}
          />
        </svg>
        <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
          <span className={`text-3xl font-bold ${textColor}`}>{Math.round(normalizedScore)}%</span>
          <span className="text-xs text-gray-400">Comfort</span>
        </div>
      </div>
       <p className={`mt-2 text-lg font-semibold ${textColor}`}>{label}</p>
    </div>
  );
};

export default ComfortDial;
