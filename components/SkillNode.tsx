
import React from 'react';
import { motion } from 'framer-motion';
import { Atom, Lock } from 'lucide-react';
import { UserSkill, PhaseType } from '../types';
import { TALENT_DATA } from '../constants';

interface Props {
  name: string; // This corresponds to the Atom ID
  skill?: UserSkill; // Contains level and score
  x: number;
  y: number;
  onClick: () => void;
  isSelected?: boolean;
}

const SkillNode: React.FC<Props> = ({ name, skill, x, y, onClick, isSelected }) => {
  const level = skill?.level || 0;
  const score = skill?.score || 0;
  const isActive = level > 0;
  
  // Atomic visual logic - Improved scaling
  // Use Math.min to cap the size, and sqrt to dampen the growth of high scores (e.g. 700% -> score 7)
  // Base 36px, max ~90px.
  // Example: Score 1.0 (100%) -> 36 + 18 = 54px
  // Example: Score 5.0 (500%) -> 36 + 40 = 76px
  // Example: Score 10.0 (1000%) -> 36 + 56 = 92px
  const nodeSize = isActive 
    ? Math.min(90, 36 + (Math.sqrt(score) * 18)) 
    : 32; 
  
  const phaseColors: Record<PhaseType, string> = {
    Perception: 'border-cyan-500 shadow-cyan-500/50 text-cyan-100 bg-cyan-900/40',
    Computation: 'border-fuchsia-500 shadow-fuchsia-500/50 text-fuchsia-100 bg-fuchsia-900/40',
    Interaction: 'border-orange-500 shadow-orange-500/50 text-orange-100 bg-orange-900/40',
    Expression: 'border-yellow-500 shadow-yellow-500/50 text-yellow-100 bg-yellow-900/40'
  };

  const talentInfo = TALENT_DATA[name];
  const colorClass = isActive && talentInfo
    ? phaseColors[talentInfo.phase] 
    : 'border-gray-800 bg-gray-950 text-gray-700';

  const glowClass = isActive ? 'shadow-[0_0_15px_0px_rgba(255,255,255,0.1)]' : '';

  return (
    <motion.div 
      className="absolute flex flex-col items-center justify-center z-20 cursor-pointer"
      style={{ left: x, top: y, marginLeft: -nodeSize / 2, marginTop: -nodeSize / 2 }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.1 }}
      onClick={onClick}
    >
      {/* Node Core */}
      <div 
        className={`relative rounded-full border flex items-center justify-center transition-all duration-500 backdrop-blur-sm ${colorClass} ${glowClass}`}
        style={{ width: nodeSize, height: nodeSize, borderWidth: isActive ? '2px' : '1px' }}
      >
        {/* Orbit Ring for high level atoms */}
        {score > 0.7 && (
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-1 border border-dashed border-white/20 rounded-full pointer-events-none"
          />
        )}

        {/* Selected Ring */}
        {isSelected && (
          <motion.div 
            layoutId="selection-ring"
            className="absolute -inset-3 border border-white rounded-full opacity-60"
            transition={{ duration: 0.3 }}
          />
        )}

        {/* Content */}
        {isActive ? (
          <div className="flex flex-col items-center justify-center">
             <span className="text-[10px] font-black tracking-tighter leading-none">
                {Math.round(score * 100)}
             </span>
          </div>
        ) : (
          <Lock size={10} className="opacity-30" />
        )}
      </div>

      {/* Label */}
      <div className={`mt-1 text-[9px] font-bold text-center px-2 py-0.5 rounded backdrop-blur-md transition-colors whitespace-nowrap border ${isActive ? 'bg-black/80 border-gray-700 text-gray-200' : 'text-gray-600 border-transparent opacity-60'}`}>
        {name.split(' (')[0]}
      </div>

    </motion.div>
  );
};

export default SkillNode;
