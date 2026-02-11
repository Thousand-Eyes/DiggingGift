
import React from 'react';
import { PhaseType, TalentInfo, Resonance } from './types';

// Map 12 Atoms to 4 Phases for visual organization
// Perception (感知): Input processing
// Computation (運算): Internal processing
// Interaction (交互): System connecting
// Expression (顯化): Output & Stability

export const TALENT_DATA: Record<string, TalentInfo> = {
  // Phase 1: Perception (感知)
  '規律嗅覺': { 
    phase: 'Perception', id: '規律嗅覺', name: '規律嗅覺 (Pattern Olfaction)',
    desc: '雜訊中識別模式的直覺。', 
    keywords: ['規律', '模式', '直覺', '識別', '趨勢'] 
  },
  '極限直覺': { 
    phase: 'Perception', id: '極限直覺', name: '極限直覺 (Limit Intuition)',
    desc: '感知資源、物理或法律邊界的靈敏度。', 
    keywords: ['邊界', '極限', '風險', '底線', '資源感知'] 
  },
  '底層透視': { 
    phase: 'Perception', id: '底層透視', name: '底層透視 (Structure Vision)',
    desc: '穿透表象看見系統架構的結構感。', 
    keywords: ['架構', '結構', '本質', '系統', '透視'] 
  },

  // Phase 2: Computation (運算)
  '秩序重建': { 
    phase: 'Computation', id: '秩序重建', name: '秩序重建 (Entropy Reduction)',
    desc: '將高熵混亂轉化為低熵有序的降熵能力。', 
    keywords: ['整理', '降熵', '流程', '優化', '秩序'] 
  },
  '本質鑽取': { 
    phase: 'Computation', id: '本質鑽取', name: '本質鑽取 (Essence Drilling)',
    desc: '垂直挖掘因果鏈與遞迴思考的深度。', 
    keywords: ['深度', '因果', '挖掘', '根源', '為什麼'] 
  },
  '決策斷捨離': { 
    phase: 'Computation', id: '決策斷捨離', name: '決策斷捨離 (Decision Razor)',
    desc: '高壓下剪除冗餘、鎖定核心的決策力。', 
    keywords: ['決策', '果斷', '捨棄', '核心', '裁決'] 
  },

  // Phase 3: Interaction (交互)
  '頻率同頻': { 
    phase: 'Interaction', id: '頻率同頻', name: '頻率同頻 (Frequency Sync)',
    desc: '與他人或環境系統同步的能力。', 
    keywords: ['共鳴', '同步', '理解', '同理', '接軌'] 
  },
  '跨界火花': { 
    phase: 'Interaction', id: '跨界火花', name: '跨界火花 (Cross-Boundary Spark)',
    desc: '異質概念碰撞產生新路徑的通量。', 
    keywords: ['跨界', '創新', '連結', '碰撞', '新路徑'] 
  },
  '社交控場': { 
    phase: 'Interaction', id: '社交控場', name: '社交控場 (Social Control)',
    desc: '動態調整互動阻力與導引他人意志。', 
    keywords: ['引導', '影響', '氣場', '說服', '主導'] 
  },

  // Phase 4: Expression (顯化)
  '精準顯影': { 
    phase: 'Expression', id: '精準顯影', name: '精準顯影 (Precision Rendering)',
    desc: '高保真度地將內在信號轉化為外部理解。', 
    keywords: ['表達', '傳遞', '清晰', '轉化', '具象化'] 
  },
  '定力核心': { 
    phase: 'Expression', id: '定力核心', name: '定力核心 (Core Stability)',
    desc: '低回饋、高干擾環境下的系統穩定性。', 
    keywords: ['穩定', '抗壓', '堅持', '耐心', '不動'] 
  },
  '閃電響應': { 
    phase: 'Expression', id: '閃電響應', name: '閃電響應 (Lightning Response)',
    desc: '從刺激到精確反應的物理時差壓縮。', 
    keywords: ['速度', '反應', '執行', '立即', '行動'] 
  }
};

export const RESONANCE_RULES: Record<PhaseType, Resonance> = {
  Perception: {
    phase: 'Perception',
    name: '全知之眼',
    name_en: 'All-Seeing Eye',
    iconName: 'Eye',
    color: 'from-cyan-500 to-blue-600',
    desc: '感知原子高能反應，洞察力達到極限。',
    threshold: 15, // Total Level sum > 15
  },
  Computation: {
    phase: 'Computation',
    name: '量子核心',
    name_en: 'Quantum Core',
    iconName: 'Cpu',
    color: 'from-purple-500 to-fuchsia-600',
    desc: '運算原子高能反應，邏輯降熵能力最大化。',
    threshold: 15,
  },
  Interaction: {
    phase: 'Interaction',
    name: '引力奇點',
    name_en: 'Gravity Singularity',
    iconName: 'Share2',
    color: 'from-orange-400 to-red-500',
    desc: '交互原子高能反應，產生強大的人際引力場。',
    threshold: 15,
  },
  Expression: {
    phase: 'Expression',
    name: '光速顯化',
    name_en: 'Light Speed Manifest',
    iconName: 'Zap',
    color: 'from-yellow-400 to-amber-500',
    desc: '顯化原子高能反應，意念到現實的零延遲。',
    threshold: 15,
  }
};

export const VOCATION_MODELS = [
  { 
    name: "高頻降維者 (High-Freq Reducer)", 
    name_en: "High-Freq Reducer",
    domains: ['Perception', 'Computation'], 
    quote: "看穿複雜結構，將其降維打擊為簡單規則。", 
    quote_en: "Seeing through complex structures and reducing them to simple rules.",
    book: "《原則》",
    book_en: "Principles"
  },
  { 
    name: "系統架構師 (System Architect)", 
    name_en: "System Architect",
    domains: ['Perception', 'Expression'], 
    quote: "不僅看見藍圖，更能精準地將其顯影在現實世界。", 
    quote_en: "Not just seeing the blueprint, but precisely rendering it in reality.",
    book: "《系統思考》",
    book_en: "Thinking in Systems"
  },
  { 
    name: "混沌領航員 (Chaos Navigator)", 
    name_en: "Chaos Navigator",
    domains: ['Interaction', 'Expression'], 
    quote: "在極度混亂與高壓的社交場中，保持核心並引導眾人。", 
    quote_en: "Maintaining core stability and guiding others in extreme chaos.",
    book: "《反脆弱》",
    book_en: "Antifragile"
  },
  { 
    name: "價值煉金術士 (Value Alchemist)", 
    name_en: "Value Alchemist",
    domains: ['Interaction', 'Computation'], 
    quote: "連結異質概念，通過深度鑽取提煉出黃金價值。", 
    quote_en: "Connecting heterogeneous concepts and drilling deep to refine gold.",
    book: "《創新者的窘境》",
    book_en: "The Innovator's Dilemma"
  }
];
