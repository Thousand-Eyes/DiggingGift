
import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, PolarRadiusAxis } from 'recharts';
import { UserSkill } from '../types';

interface Props {
  skills: Record<string, UserSkill>;
  lang: 'zh' | 'en';
}

const RadarChartComponent: React.FC<Props> = ({ skills, lang }) => {
  // Helper to get total score for a list of atom IDs
  // We sum the raw scores (e.g. 0.8 + 0.9 = 1.7)
  // And we map this to a chart scale of 0-100.
  // A "master" level in one dimension would be roughly score 2.0 (two strong atoms).
  const getScore = (ids: string[]) => {
    let total = 0;
    ids.forEach(id => {
        total += (skills[id]?.score || 0);
    });
    // Cap at 100 for visual sanity
    return Math.min(Math.round(total * 50), 100); 
  };

  const labels = lang === 'zh' ? {
    logic: '運算',
    insight: '洞察',
    influence: '影響',
    execution: '執行',
    creation: '創造',
    stability: '穩定'
  } : {
    logic: 'Logic',
    insight: 'Insight',
    influence: 'Influence',
    execution: 'Exec',
    creation: 'Create',
    stability: 'Stable'
  };

  // Aggregation Logic: 12 Atoms -> 6 Dimensions
  const data = [
    // Insight (洞察): Seeing hidden patterns
    { subject: labels.insight, A: getScore(['規律嗅覺', '底層透視']), fullMark: 100 },
    // Logic (運算): Processing and ordering
    { subject: labels.logic, A: getScore(['秩序重建', '本質鑽取']), fullMark: 100 },
    // Execution (執行): Decision and speed
    { subject: labels.execution, A: getScore(['決策斷捨離', '閃電響應']), fullMark: 100 },
    // Stability (穩定): Resistance to chaos
    { subject: labels.stability, A: getScore(['定力核心', '極限直覺']), fullMark: 100 },
    // Creation (創造): Output and novelty
    { subject: labels.creation, A: getScore(['跨界火花', '精準顯影']), fullMark: 100 },
    // Influence (影響): Connection and control
    { subject: labels.influence, A: getScore(['頻率同頻', '社交控場']), fullMark: 100 },
  ];

  return (
    <div className="w-full h-64 flex items-center justify-center relative -ml-2">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="65%" data={data}>
          <PolarGrid stroke="#374151" strokeOpacity={0.5} />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: '#9ca3af', fontSize: 11, fontWeight: 'bold' }} 
          />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            name="Skills"
            dataKey="A"
            stroke="#06b6d4"
            strokeWidth={2}
            fill="#06b6d4"
            fillOpacity={0.3}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RadarChartComponent;
