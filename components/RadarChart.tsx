
import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { Stats } from '../types';

interface Props {
  stats: Stats;
}

const RadarChartComponent: React.FC<Props> = ({ stats }) => {
  const data = [
    { subject: 'STR', A: stats.strength, fullMark: 100 },
    { subject: 'DEX', A: stats.dexterity, fullMark: 100 },
    { subject: 'CON', A: stats.constitution, fullMark: 100 },
    { subject: 'INT', A: stats.intelligence, fullMark: 100 },
    { subject: 'WIS', A: stats.wisdom, fullMark: 100 },
    { subject: 'CHA', A: stats.charisma, fullMark: 100 },
  ];

  return (
    <div className="w-full h-64 flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="#374151" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: 'bold' }} />
          <Radar
            name="Stats"
            dataKey="A"
            stroke="#6366f1"
            fill="#6366f1"
            fillOpacity={0.4}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RadarChartComponent;
