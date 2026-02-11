
import React, { useState, useEffect, useMemo, useRef, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Brain, History, User, Scroll, Download, Upload, Trash2, Info, ChevronRight, Edit2, Save, X, RefreshCw, FileJson, ZoomIn, ZoomOut, Compass, Globe, Atom, AlertTriangle, BookOpen, Zap, Target, LayoutGrid } from 'lucide-react';
import { TALENT_DATA, RESONANCE_RULES, VOCATION_MODELS } from './constants';
import { PhaseType, UserSkill, Story, Stats, Resonance, StatKey, AnalysisResult, AtomResult } from './types';
import { analyzeStoryWithAI, localHeuristicAnalysis } from './services/geminiService';
import RadarChartComponent from './components/RadarChart';
import SkillNode from './components/SkillNode';

// --- Localization ---
const translations = {
  zh: {
    title: 'ZERO-BASE THINKER',
    subtitle: 'Talent Atom Engine v2.0',
    points: 'Energy',
    ascendancy: 'Singularity',
    inputTab: '萃取',
    treeTab: '原子矩陣',
    timelineTab: '實驗日誌',
    charTab: '診斷',
    aboutTab: '說明',
    extractTitle: '原子萃取',
    extractDesc: '書寫你的驕傲過往。歸零者將解構你的行為原子。',
    dateLabel: '觀測時間',
    storyLabel: '關鍵情境',
    storyPlaceholder: '描述一次你必須在資源受限下做出決策的時刻...',
    analyzing: '正在進行行為逆向工程...',
    extractBtn: '啟動萃取',
    notificationSuccess: '原子解構完成。',
    notificationError: '連結神經網絡失敗。',
    notificationNoTalent: '訊號過弱，無法顯影原子。',
    notificationUpgrade: '原子能階躍遷！',
    notificationDelete: '樣本已銷毀，能量回溯。',
    notificationExport: '數據備份完成。',
    notificationImport: '數據載入完成。',
    deleteConfirm: '確定銷毀此樣本？相關原子能階將歸零。',
    resetConfirm: '執行全系統重置？',
    importConfirm: '覆寫當前神經網絡？',
    hintDrag: '雙指縮放 • 單指拖曳 • 點擊觀測',
    historyTitle: '實驗日誌',
    historyEmpty: '尚無實驗數據...',
    charTitle: '神經效能診斷',
    charName: '受測者',
    charClass: '未定義',
    exportHelp: '備份當前原子矩陣配置。',
    editMode: '修正模式',
    saveOnly: '保存',
    reAnalyze: '重新運算',
    activeResonance: '高能共鳴反應',
    vocationHint: '價值奇點建議',
    readBook: '推薦協議',
    diagnosisLabel: '診斷報告',
    singularityLabel: '奇點建議',
    stressQuery: '應力測試',
    // About Page Content
    aboutTitle: '歸零者手冊',
    aboutSubtitle: '神經代碼解碼協議',
    introTitle: '這不是天賦測驗，這是你的神經代碼解碼器',
    introText: '還在用傳統的職能測驗來定義自己嗎？那些標籤只是在玩「類比遊戲」。歸零者決定徹底打破這一切。我們不關心你是什麼「型」，我們只關心你的大腦運算邏輯。',
    p1Title: '為什麼傳統測驗會讓你感到迷惘？',
    p1Text: '傳統測驗是「表象歸納法」。如果你心情不好，測驗結果就會失真。歸零者透過你真實的人生故事，分析你處理資訊時的「能效比 (Efficiency)」。',
    p2Title: '第一性原理的神經運算',
    p2Text: '我們的底層技術將你的行為拆解為 12 個天賦原子。這不是心理學，這是神經物理學。真正的天賦是大腦在執行特定任務時，具備「極低的能量損耗」與「極高的產出品質」。',
    compTable: {
        h1: '特性', h2: '傳統天賦測驗', h3: '歸零者天賦萃取',
        r1c1: '邏輯基礎', r1c2: '統計歸納與類比思維', r1c3: '第一性原理與神經運算',
        r2c1: '輸入方式', r2c2: '勾選主觀題 (容易作假)', r2c3: '敘述真實故事 (行為逆向工程)',
        r3c1: '結果呈現', r3c2: '固定的標籤 (如：指揮官)', r3c3: '動態的原子拓撲圖 (神經指紋)',
        r4c1: '應用場景', r4c2: '心理慰藉或職業參考', r4c3: '高熵問題解決能力的精準匹配',
    },
    valueTitle: '你將獲得什麼？',
    valueText: '一份「個人神經資源操作手冊」：發現你的「低熵區」，診斷你的「內耗點」，並找到你在市場中的「非線性溢價價值」。',
    quote: '「努力」是平庸者的類比。真正的強者，是找到了自己神經系統中那條阻力最小、功輸出最高的路徑。',
  },
  en: {
    title: 'ZERO-BASE THINKER',
    subtitle: 'Talent Atom Engine v2.0',
    points: 'Energy',
    ascendancy: 'Singularity',
    inputTab: 'Extract',
    treeTab: 'Matrix',
    timelineTab: 'Logs',
    charTab: 'Diagnosis',
    aboutTab: 'Guide',
    extractTitle: 'Atom Extraction',
    extractDesc: 'Input high-pressure decision moments. We will reverse-engineer your atoms.',
    dateLabel: 'Timestamp',
    storyLabel: 'Critical Scenario',
    storyPlaceholder: 'Describe a moment where you had to decide under constraints...',
    analyzing: 'Reverse Engineering...',
    extractBtn: 'Initiate Extraction',
    notificationSuccess: 'Deconstruction complete.',
    notificationError: 'Neural link failed.',
    notificationNoTalent: 'Signal too weak to render atoms.',
    notificationUpgrade: 'Atomic Level Jump!',
    notificationDelete: 'Sample destroyed. Energy rolled back.',
    notificationExport: 'Data backed up.',
    notificationImport: 'Data loaded.',
    deleteConfirm: 'Destroy this sample? Atomic energy will be lost.',
    resetConfirm: 'Perform full system reset?',
    importConfirm: 'Overwrite current neural network?',
    hintDrag: 'PINCH TO ZOOM • DRAG TO PAN',
    historyTitle: 'Experiment Logs',
    historyEmpty: 'No data...',
    charTitle: 'Neural Diagnosis',
    charName: 'Subject',
    charClass: 'Undefined',
    exportHelp: 'Backup current matrix configuration.',
    editMode: 'Correction Mode',
    saveOnly: 'Save',
    reAnalyze: 'Re-compute',
    activeResonance: 'High-Energy Resonances',
    vocationHint: 'Value Singularity',
    readBook: 'Protocol',
    diagnosisLabel: 'Diagnosis',
    singularityLabel: 'Singularity',
    stressQuery: 'Stress Test',
    // About Page Content
    aboutTitle: 'Zero-Base Manual',
    aboutSubtitle: 'Neural Code Decoding Protocol',
    introTitle: 'Not a Talent Test. A Neural Code Decoder.',
    introText: 'Still defining yourself with traditional tests? Those are just "analogy games." Zero-Base Thinker breaks this pattern. We don\'t care what "type" you are; we care about your brain\'s computational logic.',
    p1Title: 'Why Traditional Tests Fail You',
    p1Text: 'Traditional tests use "Superficial Induction." Results skew with your mood. Zero-Base analyzes the "Efficiency" of your information processing through real-life decision stories.',
    p2Title: 'First Principles Neural Computing',
    p2Text: 'We decompile your behavior into 12 Talent Atoms. This isn\'t psychology; it\'s neural physics. True talent is "Low Energy Loss" and "High Output Quality" during specific tasks.',
    compTable: {
        h1: 'Feature', h2: 'Traditional Tests', h3: 'Zero-Base Extraction',
        r1c1: 'Logic Base', r1c2: 'Statistics & Analogy', r1c3: 'First Principles & Neural Compute',
        r2c1: 'Input', r2c2: 'Subjective Checkboxes (Bias)', r2c3: 'Real Stories (Reverse Engineering)',
        r3c1: 'Output', r3c2: 'Fixed Labels (e.g., Commander)', r3c3: 'Dynamic Atomic Topology',
        r4c1: 'Usage', r4c2: 'Comfort or Reference', r4c3: 'High-Entropy Problem Solving',
    },
    valueTitle: 'What You Get',
    valueText: 'A "Personal Neural Resource Manual": Discover your "Low-Entropy Zones," diagnose "Internal Friction," and find your "Non-Linear Premium Value" in the market.',
    quote: '"Effort" is the analogy of the mediocre. True strength is finding the path of least resistance and highest power output in your neural system.',
  }
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'input' | 'tree' | 'timeline' | 'char' | 'about'>('input');
  const [lang, setLang] = useState<'zh' | 'en'>('zh'); // Default to Traditional Chinese
  
  // Data State
  const [stories, setStories] = useState<Story[]>([]);
  const [skills, setSkills] = useState<Record<string, UserSkill>>({});
  const [stats, setStats] = useState<Stats>({
    strength: 10, dexterity: 10, constitution: 10,
    intelligence: 10, wisdom: 10, charisma: 10
  });

  // Input State
  const [inputStory, setInputStory] = useState("");
  const [inputDate, setInputDate] = useState(new Date().toISOString().split('T')[0]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [missingInfoQuery, setMissingInfoQuery] = useState<string | null>(null);
  
  // Edit Mode State
  const [editingStoryId, setEditingStoryId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");

  // Tree View State
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1.0);
  const treeContainerRef = useRef<HTMLDivElement>(null);
  
  // Touch Zoom State
  const touchStartDist = useRef<number | null>(null);
  const startZoom = useRef<number>(1.0);

  // Notification & Refs
  const [notification, setNotification] = useState<{ msg: string; type: 'success' | 'error' | 'info' } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Helpers
  const t = translations[lang];

  // Persistence
  useEffect(() => {
    const saved = localStorage.getItem('zero_base_thinker_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setStories(parsed.stories || []);
        setSkills(parsed.skills || {});
        setStats(parsed.stats || { strength: 10, dexterity: 10, constitution: 10, intelligence: 10, wisdom: 10, charisma: 10 });
      } catch (e) {
        console.error("Save data corrupted", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('zero_base_thinker_v2', JSON.stringify({ stories, skills, stats }));
  }, [stories, skills, stats]);

  // Center Tree on open and zoom change
  useLayoutEffect(() => {
    if (activeTab === 'tree' && treeContainerRef.current) {
      const el = treeContainerRef.current;
      // Core is at 400, 400 (center of 800x800)
      const scaledSize = 800 * zoom;
      
      // Calculate scroll to center
      if (scaledSize > el.clientWidth) {
          const scrollX = (scaledSize - el.clientWidth) / 2;
          el.scrollLeft = scrollX;
      }
      if (scaledSize > el.clientHeight) {
          const scrollY = (scaledSize - el.clientHeight) / 2;
          el.scrollTop = scrollY;
      }
    }
  }, [activeTab]);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 2.0));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.5));

  // --- Pinch to Zoom Logic ---
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      touchStartDist.current = dist;
      startZoom.current = zoom;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && touchStartDist.current !== null) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const ratio = dist / touchStartDist.current;
      const newZoom = Math.min(Math.max(startZoom.current * ratio, 0.5), 2.5);
      setZoom(newZoom);
    }
  };
  
  const handleTouchEnd = () => {
    touchStartDist.current = null;
  };

  const showNotification = (msg: string, type: 'success' | 'error' | 'info' = 'info') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // --- Logic Helpers ---

  const processAnalysisResult = (
    currentSkills: Record<string, UserSkill>,
    analysisData: AtomResult[],
    mode: 'add' | 'remove'
  ) => {
    const newSkills = { ...currentSkills };
    
    analysisData.forEach((atom) => {
      if (!TALENT_DATA[atom.atomId]) return;
      const info = TALENT_DATA[atom.atomId];

      const existingSkill = newSkills[atom.atomId];
      // IMPORTANT: Create a new object to ensure React state change detection
      let skillToUpdate: UserSkill;

      if (!existingSkill) {
        skillToUpdate = { level: 0, score: 0, stat: 'intelligence', domain: 'Strategic', phase: info.phase } as any; 
      } else {
        skillToUpdate = { ...existingSkill };
      }

      if (mode === 'add') {
        skillToUpdate.score += atom.score;
        skillToUpdate.level = Math.floor(skillToUpdate.score);
      } else {
        // Prevent negative scores
        skillToUpdate.score = Math.max(0, skillToUpdate.score - atom.score);
        skillToUpdate.level = Math.floor(skillToUpdate.score);
      }

      newSkills[atom.atomId] = skillToUpdate;
    });

    return newSkills;
  };

  const handleAnalyze = async () => {
    if (!inputStory.trim()) {
      showNotification(t.notificationNoTalent, "error");
      return;
    }
    setIsAnalyzing(true);
    setMissingInfoQuery(null);

    try {
      let result: AnalysisResult | null = null;
      const hasKey = process.env.API_KEY && process.env.API_KEY.length > 10;
      
      if (hasKey) {
        result = await analyzeStoryWithAI(inputStory);
      } else {
        result = localHeuristicAnalysis(inputStory);
      }

      if (!result || !result.atoms || result.atoms.length === 0) {
        showNotification(t.notificationNoTalent, "info");
        return;
      }

      if (result.missing_info_query) {
         setMissingInfoQuery(result.missing_info_query);
      }

      const newSkills = processAnalysisResult(skills, result.atoms, 'add');

      result.atoms.forEach(atom => {
         const oldLvl = skills[atom.atomId]?.level || 0;
         const newLvl = newSkills[atom.atomId]?.level || 0;
         if (newLvl > oldLvl) {
            showNotification(`${t.notificationUpgrade} ${atom.atomId} LV.${newLvl}`, "success");
         }
      });

      const story: Story = {
        id: Date.now(),
        date: inputDate,
        content: inputStory,
        diagnosis: result.diagnosis,
        singularity: result.singularity,
        analysisData: result.atoms,
      };

      setSkills(newSkills);
      setStories([story, ...stories]);
      if (!result.missing_info_query) {
          setInputStory("");
      }
      showNotification(t.notificationSuccess, "success");
      
      if (!result.missing_info_query) {
          setActiveTab('tree');
      }
      
    } catch (e) {
      console.error(e);
      showNotification(t.notificationError, "error");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const deleteStory = (id: number) => {
    if (!window.confirm(t.deleteConfirm)) return;
    const storyToDelete = stories.find(s => s.id === id);
    if (!storyToDelete) return;

    // Use the fixed processAnalysisResult to correctly deduct scores
    const newSkills = processAnalysisResult(skills, storyToDelete.analysisData || [], 'remove');
    
    setSkills(newSkills);
    setStories(prev => prev.filter(s => s.id !== id));
    showNotification(t.notificationDelete, "info");
  };

  const handleExport = () => {
    const data = { version: "2.0", timestamp: new Date().toISOString(), stories, skills };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `zero-base-backup-${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showNotification(t.notificationExport, "success");
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.stories && json.skills) {
          if (window.confirm(t.importConfirm)) {
            setStories(json.stories);
            setSkills(json.skills);
            showNotification(t.notificationImport, "success");
          }
        } else {
          showNotification("Invalid format", "error");
        }
      } catch (err) {
        showNotification("JSON parse error", "error");
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const resetData = () => {
    if (window.confirm(t.resetConfirm)) {
      setStories([]);
      setSkills({});
      showNotification("System Reset.");
    }
  };

  const toggleLang = () => {
    setLang(prev => prev === 'zh' ? 'en' : 'zh');
  };

  // --- Constellation Layout ---

  const constellationLayout = useMemo(() => {
    // Compact Layout Settings
    const cx = 400; // Center X (half of 800)
    const cy = 400; // Center Y (half of 800)
    const radiusNodes = 145; // Compact radius (Diameter 290px), fits in 320px width
    
    const nodes: { id: string, x: number, y: number, type: 'core' | 'atom', phase?: PhaseType }[] = [];
    const connections: { x1: number, y1: number, x2: number, y2: number, active: boolean, phase?: PhaseType }[] = [];

    nodes.push({ id: 'CORE', x: cx, y: cy, type: 'core' });

    let idx = 0;
    Object.entries(TALENT_DATA).forEach(([id, info]) => {
        // -90 degrees is top (12 o'clock)
        const angle = (idx * 30) - 90; 
        const rad = (angle * Math.PI) / 180;
        
        const sx = cx + Math.cos(rad) * radiusNodes;
        const sy = cy + Math.sin(rad) * radiusNodes;

        nodes.push({ id: id, x: sx, y: sy, type: 'atom', phase: info.phase });
        
        const isActive = (skills[id]?.level || 0) > 0;
        connections.push({ x1: cx, y1: cy, x2: sx, y2: sy, active: isActive, phase: info.phase });
        idx++;
    });

    return { nodes, connections, radius: radiusNodes, cx, cy };
  }, [skills]);

  // --- Computed ---

  const activeResonances = useMemo(() => {
    const resonances: Resonance[] = [];
    const phases: PhaseType[] = ['Perception', 'Computation', 'Interaction', 'Expression'];
    
    phases.forEach(p => {
        const phaseLevel = (Object.values(skills) as UserSkill[])
            .filter(s => s.phase === p)
            .reduce((acc, curr) => acc + curr.level, 0);
        
        const rule = RESONANCE_RULES[p];
        if (phaseLevel >= rule.threshold) {
            resonances.push(rule);
        }
    });
    return resonances;
  }, [skills]);

  const totalScore = (Object.values(skills) as UserSkill[]).reduce((acc: number, curr) => acc + (curr.score * 10), 0);
  const formattedScore = Math.floor(totalScore);

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#030712] text-gray-100 pb-20 md:pb-0 font-sans overflow-hidden">
      <div className="w-full max-w-lg min-h-screen flex flex-col bg-[#030712] shadow-2xl relative">
        
        {/* Header */}
        <header className="px-4 py-3 border-b border-gray-800 flex items-center justify-between sticky top-0 bg-[#030712]/90 backdrop-blur z-50">
          <div className="flex flex-col">
            <h1 className="text-lg font-bold text-white tracking-widest uppercase flex items-center gap-2">
              <Atom size={18} className="text-cyan-400" /> {t.title}
            </h1>
            <div className="flex gap-4 text-[9px] text-gray-500 font-mono mt-0.5">
               <span>{t.points}: <span className="text-cyan-400">{formattedScore}</span></span>
               <span>{t.ascendancy}: <span className="text-fuchsia-400">{activeResonances.length}</span></span>
            </div>
          </div>
          <button onClick={toggleLang} className="w-8 h-8 rounded border border-gray-700 bg-gray-900 flex items-center justify-center hover:border-cyan-500 transition-colors">
             <span className="text-[10px] font-bold text-gray-300">{lang === 'zh' ? 'EN' : '中'}</span>
          </button>
        </header>

        {/* Main View */}
        <main className="flex-1 overflow-hidden relative bg-[#030712]">
          {/* Grid Background */}
          <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" 
               style={{ 
                 backgroundImage: 'linear-gradient(#1f2937 1px, transparent 1px), linear-gradient(90deg, #1f2937 1px, transparent 1px)',
                 backgroundSize: '40px 40px'
               }}>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'input' && (
               <motion.div key="input" className="p-6 h-full overflow-y-auto z-10 relative custom-scrollbar pb-24" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                 <div className="bg-gray-900/50 border border-gray-700 p-6 rounded-none shadow-lg relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-cyan-600"></div>
                    <h2 className="text-lg font-bold text-cyan-400 mb-4 flex items-center gap-2 uppercase tracking-widest"><Scroll size={16}/> {t.extractTitle}</h2>
                    <p className="text-sm text-gray-400 mb-6 font-mono leading-relaxed">{t.extractDesc}</p>
                    
                    {missingInfoQuery && (
                        <div className="mb-4 p-4 bg-yellow-900/20 border border-yellow-600/50 text-yellow-200 text-sm font-bold flex items-start gap-2">
                            <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                            <div>
                                <p className="uppercase text-[10px] text-yellow-500 mb-1">{t.stressQuery}</p>
                                {missingInfoQuery}
                            </div>
                        </div>
                    )}

                    <div className="space-y-4">
                      <div>
                        <label className="text-[10px] text-gray-500 uppercase tracking-widest mb-1 block">{t.dateLabel}</label>
                        <input type="date" value={inputDate} onChange={(e) => setInputDate(e.target.value)} className="w-full bg-black border border-gray-800 rounded-none p-2 text-sm focus:border-cyan-500 outline-none text-gray-300 font-mono" />
                      </div>
                      <div>
                        <label className="text-[10px] text-gray-500 uppercase tracking-widest mb-1 block">{t.storyLabel}</label>
                        <textarea 
                          value={inputStory} 
                          onChange={(e) => setInputStory(e.target.value)}
                          placeholder={t.storyPlaceholder}
                          className="w-full h-48 bg-black border border-gray-800 rounded-none p-3 text-sm focus:border-cyan-500 outline-none resize-none leading-relaxed text-gray-300"
                        />
                      </div>
                      <button 
                        onClick={handleAnalyze} 
                        disabled={isAnalyzing}
                        className={`w-full py-3 border border-cyan-500/50 text-cyan-400 font-bold uppercase tracking-widest hover:bg-cyan-500/10 transition-all ${isAnalyzing ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {isAnalyzing ? t.analyzing : t.extractBtn}
                      </button>
                    </div>
                 </div>
               </motion.div>
            )}

            {activeTab === 'tree' && (
              <motion.div 
                key="tree" 
                ref={treeContainerRef}
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }} 
                className="absolute inset-0 overflow-auto cursor-grab active:cursor-grabbing custom-scrollbar flex items-center justify-center bg-[#030712]"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                {/* Scrollable Container with scaled content */}
                {/* Using a fixed logical size of 800x800 for the compact layout */}
                <div style={{ width: 800 * zoom, height: 800 * zoom, position: 'relative', flexShrink: 0 }}>
                  {/* Lines Layer - Scaled */}
                  <div style={{ width: 800, height: 800, transform: `scale(${zoom})`, transformOrigin: '0 0', position: 'absolute', top: 0, left: 0 }}>
                    <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 800 800">
                      {/* Outer Ring */}
                      <circle cx={constellationLayout.cx} cy={constellationLayout.cy} r={constellationLayout.radius} stroke="#374151" strokeWidth="1" fill="none" strokeDasharray="4 4" opacity="0.5" />
                      
                      {/* Connection Lines */}
                      {constellationLayout.connections.map((conn, i) => (
                        <line 
                          key={i} 
                          x1={conn.x1} y1={conn.y1} x2={conn.x2} y2={conn.y2} 
                          stroke={conn.active ? (conn.phase === 'Perception' ? '#06b6d4' : conn.phase === 'Computation' ? '#d946ef' : conn.phase === 'Interaction' ? '#f97316' : '#eab308') : '#333'} 
                          strokeWidth={conn.active ? 2 : 1}
                          strokeOpacity={conn.active ? 0.6 : 0.2}
                        />
                      ))}
                    </svg>

                    {/* Nodes Layer - Scaled */}
                    {constellationLayout.nodes.map(node => {
                      if (node.type === 'core') {
                        return (
                          <div key={node.id} className="absolute w-20 h-20 rounded-full border border-gray-700 bg-black z-30 flex items-center justify-center shadow-[0_0_50px_rgba(0,0,0,0.8)]"
                              style={{ left: node.x, top: node.y, marginLeft: -40, marginTop: -40 }}>
                            <div className="w-16 h-16 rounded-full border border-cyan-900 bg-gray-900 flex items-center justify-center">
                              <Brain size={24} className="text-gray-500" />
                            </div>
                          </div>
                        );
                      }
                      return (
                        <SkillNode 
                          key={node.id}
                          name={node.id}
                          skill={skills[node.id]}
                          x={node.x}
                          y={node.y}
                          onClick={() => setSelectedNode(node.id === selectedNode ? null : node.id)}
                          isSelected={selectedNode === node.id}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* Zoom Controls */}
                <div className="fixed bottom-24 right-4 flex flex-col gap-2 z-50">
                   <button onClick={handleZoomIn} className="p-2 bg-gray-900 border border-gray-700 text-cyan-400 rounded-full hover:bg-gray-800 shadow-lg"><ZoomIn size={20}/></button>
                   <button onClick={handleZoomOut} className="p-2 bg-gray-900 border border-gray-700 text-cyan-400 rounded-full hover:bg-gray-800 shadow-lg"><ZoomOut size={20}/></button>
                </div>
                
                {/* Info Panel */}
                <AnimatePresence>
                  {selectedNode && (
                    <motion.div 
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 20, opacity: 0 }}
                      className="fixed bottom-24 left-4 right-16 bg-gray-950/90 border border-gray-700 p-4 shadow-2xl backdrop-blur-md z-50 md:max-w-md md:left-1/2 md:-translate-x-1/2 md:right-auto"
                    >
                      <h3 className="text-white font-bold text-lg mb-1 font-mono">
                        {selectedNode}
                      </h3>
                      <p className="text-[10px] text-cyan-500 uppercase tracking-widest mb-2">{TALENT_DATA[selectedNode].phase}</p>
                      <p className="text-sm text-gray-300 mb-3">{TALENT_DATA[selectedNode].desc}</p>
                      <button className="absolute top-2 right-2 text-gray-500 hover:text-white" onClick={() => setSelectedNode(null)}><X size={16}/></button>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="fixed top-20 left-1/2 -translate-x-1/2 text-[9px] text-gray-600 font-mono pointer-events-none z-40 bg-black/50 px-2 border border-gray-800 whitespace-nowrap">
                  {t.hintDrag}
                </div>
              </motion.div>
            )}

            {activeTab === 'timeline' && (
              <motion.div key="timeline" className="p-6 h-full overflow-y-auto z-10 relative custom-scrollbar pb-24" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                 <h2 className="text-lg font-bold text-gray-300 mb-6 flex items-center gap-2 border-b border-gray-800 pb-2 uppercase tracking-widest"><History size={16}/> {t.historyTitle}</h2>
                 {stories.length === 0 ? (
                  <p className="text-center text-gray-700 font-mono py-12">{t.historyEmpty}</p>
                ) : (
                  <div className="space-y-8">
                    {stories.map((story) => (
                      <div key={story.id} className="relative pl-6 border-l border-gray-800">
                         <div className="absolute -left-[3px] top-1.5 w-1.5 h-1.5 bg-gray-600"></div>
                         <div className="mb-2">
                             <span className="text-[10px] text-cyan-600 font-mono">{story.date}</span>
                         </div>
                         <div className="bg-gray-900/40 p-4 border border-gray-800 hover:border-cyan-900 transition-colors">
                            <p className="text-xs text-gray-300 mb-3 leading-relaxed whitespace-pre-wrap font-mono">{story.content}</p>
                            
                            {/* Diagnosis & Singularity */}
                            {story.diagnosis && (
                                <div className="mt-3 pt-3 border-t border-gray-800 space-y-2">
                                    <div className="flex gap-2 items-start">
                                        <span className="text-[9px] text-gray-500 uppercase shrink-0 mt-0.5">{t.diagnosisLabel}:</span>
                                        <span className="text-xs text-fuchsia-300 font-bold">{story.diagnosis}</span>
                                    </div>
                                    <div className="flex gap-2 items-start">
                                        <span className="text-[9px] text-gray-500 uppercase shrink-0 mt-0.5">{t.singularityLabel}:</span>
                                        <span className="text-xs text-cyan-300">{story.singularity}</span>
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-end mt-4">
                                <button onClick={() => deleteStory(story.id)} className="text-red-900 hover:text-red-500 transition-colors"><Trash2 size={14}/></button>
                            </div>
                         </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'char' && (
              <motion.div key="char" className="absolute inset-0 p-6 overflow-y-auto z-10 custom-scrollbar pb-24" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                 <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-2">
                    <h2 className="text-lg font-bold text-gray-300 flex items-center gap-2 uppercase tracking-widest"><User size={16}/> {t.charTitle}</h2>
                    <div className="flex gap-1">
                      <button onClick={handleExport} className="p-2 text-gray-500 hover:text-white"><Download size={16}/></button>
                      <button onClick={handleImportClick} className="p-2 text-gray-500 hover:text-white"><Upload size={16}/></button>
                      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".json" />
                      <button onClick={resetData} className="p-2 text-gray-500 hover:text-red-500"><Trash2 size={16}/></button>
                    </div>
                 </div>

                 <div className="bg-gray-900/30 border border-gray-800 p-6 mb-6">
                    <div className="flex items-center gap-4 mb-4">
                       <div className="w-12 h-12 bg-black border border-cyan-900 flex items-center justify-center">
                          <User size={24} className="text-cyan-700"/>
                       </div>
                       <div>
                          <h3 className="text-lg font-bold text-white uppercase tracking-wider">{t.charName}</h3>
                          <p className="text-[10px] text-gray-600 font-mono">ID: {stories.length > 0 ? stories[0].diagnosis : 'UNKNOWN'}</p>
                       </div>
                    </div>
                    {/* Simplified Stats visualization for atoms */}
                    <div className="grid grid-cols-2 gap-2 mt-4">
                        {(Object.entries(skills) as [string, UserSkill][])
                            .sort((a, b) => b[1].score - a[1].score)
                            .slice(0, 6)
                            .map(([id, skill]) => (
                            <div key={id} className="flex justify-between items-center bg-black/50 px-2 py-1 border-l-2 border-cyan-800">
                                <span className="text-[10px] text-gray-400">{id}</span>
                                <span className="text-xs font-mono text-cyan-400">{(skill.score * 100).toFixed(0)}%</span>
                            </div>
                        ))}
                    </div>
                 </div>

                 {activeResonances.length > 0 && (
                  <div className="space-y-3 mb-6">
                    <h4 className="text-[10px] font-bold text-gray-600 uppercase tracking-widest border-b border-gray-900 pb-1">{t.activeResonance}</h4>
                    {activeResonances.map(res => (
                      <div key={res.phase} className={`p-3 border border-gray-800 bg-gradient-to-r ${res.color} bg-opacity-5 flex items-center gap-3 relative overflow-hidden`}>
                        <div className="absolute inset-0 bg-black opacity-80 z-0"></div>
                        <div className="relative z-10 flex gap-3 items-center">
                            <div className="text-white"><Sparkles size={14} /></div>
                            <div>
                            <p className="text-xs font-bold text-white uppercase">{lang === 'en' && res.name_en ? res.name_en : res.name}</p>
                            <p className="text-[9px] text-gray-400">{res.desc}</p>
                            </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="mt-8 p-3 border border-gray-800 bg-black text-[10px] text-gray-600 font-mono">
                   SYSTEM STATUS: ONLINE<br/>
                   NEURAL CONNECTION: STABLE<br/>
                   MATRIX INTEGRITY: 100%
                </div>

              </motion.div>
            )}

            {activeTab === 'about' && (
              <motion.div key="about" className="p-6 h-full overflow-y-auto z-10 relative custom-scrollbar pb-24" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                 <div className="mb-8 border-b border-gray-800 pb-4">
                     <h2 className="text-xl font-black text-white uppercase tracking-widest flex items-center gap-2 mb-1">
                        <BookOpen size={20} className="text-cyan-400"/>
                        {t.aboutTitle}
                     </h2>
                     <p className="text-xs text-gray-500 font-mono">{t.aboutSubtitle}</p>
                 </div>

                 {/* Intro */}
                 <div className="mb-10 bg-gray-900/20 border-l-2 border-cyan-500 pl-4 py-2">
                     <h3 className="text-lg font-bold text-gray-100 mb-2">{t.introTitle}</h3>
                     <p className="text-sm text-gray-400 leading-relaxed font-mono">{t.introText}</p>
                 </div>

                 {/* Neural Physics */}
                 <div className="mb-12 space-y-8">
                     <div className="flex gap-4 items-start">
                         <div className="p-2 bg-gray-900 border border-gray-800 rounded shrink-0 text-cyan-500 mt-1"><Zap size={20}/></div>
                         <div>
                             <h4 className="text-base font-bold text-gray-200 mb-2 uppercase tracking-wide">{t.p1Title}</h4>
                             <p className="text-sm text-gray-400 leading-relaxed">{t.p1Text}</p>
                         </div>
                     </div>
                     <div className="flex gap-4 items-start">
                         <div className="p-2 bg-gray-900 border border-gray-800 rounded shrink-0 text-fuchsia-500 mt-1"><Atom size={20}/></div>
                         <div>
                             <h4 className="text-base font-bold text-gray-200 mb-2 uppercase tracking-wide">{t.p2Title}</h4>
                             <p className="text-sm text-gray-400 leading-relaxed">{t.p2Text}</p>
                         </div>
                     </div>
                 </div>

                 {/* Comparison Table */}
                 <div className="mb-12 overflow-hidden border border-gray-800 bg-gray-900/30">
                     <div className="grid grid-cols-3 border-b border-gray-800 bg-black/50 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-center py-3">
                         <div>{t.compTable.h1}</div>
                         <div>{t.compTable.h2}</div>
                         <div className="text-cyan-500">{t.compTable.h3}</div>
                     </div>
                     {[1,2,3,4].map(r => (
                         <div key={r} className="grid grid-cols-3 border-b border-gray-800/50 text-xs text-gray-400 py-3 px-2">
                             <div className="text-gray-500 font-mono text-[10px] uppercase flex items-center justify-center">{t.compTable[`r${r}c1` as keyof typeof t.compTable]}</div>
                             <div className="text-center px-2 flex items-center justify-center opacity-70">{t.compTable[`r${r}c2` as keyof typeof t.compTable]}</div>
                             <div className="text-center px-2 flex items-center justify-center font-bold text-cyan-100 bg-cyan-900/10 border-x border-cyan-900/20">{t.compTable[`r${r}c3` as keyof typeof t.compTable]}</div>
                         </div>
                     ))}
                 </div>

                 {/* Value Prop */}
                 <div className="mb-8 p-5 bg-gradient-to-br from-gray-900 to-black border border-gray-800 relative overflow-hidden">
                     <div className="absolute top-0 right-0 p-4 opacity-10"><Target size={100} /></div>
                     <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2 relative z-10"><LayoutGrid size={16} className="text-cyan-400"/> {t.valueTitle}</h3>
                     <p className="text-sm text-gray-400 leading-relaxed relative z-10">{t.valueText}</p>
                 </div>

                 {/* Quote */}
                 <div className="mt-8 text-center px-4">
                     <p className="text-xs text-gray-500 italic font-serif leading-loose">
                         {t.quote}
                     </p>
                 </div>
              </motion.div>
            )}

          </AnimatePresence>
        </main>

        {/* Navigation Bar */}
        <nav className="fixed bottom-0 w-full max-w-lg bg-[#030712] border-t border-gray-800 flex justify-around items-center p-2 pb-4 z-50">
          <NavBtn icon={<Scroll />} label={t.inputTab} active={activeTab === 'input'} onClick={() => setActiveTab('input')} />
          <NavBtn icon={<Atom />} label={t.treeTab} active={activeTab === 'tree'} onClick={() => setActiveTab('tree')} />
          <NavBtn icon={<History />} label={t.timelineTab} active={activeTab === 'timeline'} onClick={() => setActiveTab('timeline')} />
          <NavBtn icon={<Brain />} label={t.charTab} active={activeTab === 'char'} onClick={() => setActiveTab('char')} />
          <NavBtn icon={<Info />} label={t.aboutTab} active={activeTab === 'about'} onClick={() => setActiveTab('about')} />
        </nav>

        {/* Notifications */}
        <AnimatePresence>
          {notification && (
            <motion.div 
              initial={{ y: 50, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }} 
              exit={{ y: 20, opacity: 0 }}
              className={`fixed bottom-20 left-1/2 -translate-x-1/2 px-4 py-2 shadow-xl z-[100] border text-[10px] font-bold font-mono uppercase tracking-wider ${notification.type === 'error' ? 'bg-red-950 border-red-900 text-red-400' : 'bg-gray-900 border-cyan-900 text-cyan-400'}`}
            >
              {notification.msg}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const NavBtn: React.FC<{ icon: React.ReactNode; label: string; active: boolean; onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-1 p-2 w-14 transition-all ${active ? 'text-cyan-400' : 'text-gray-600 hover:text-gray-400'}`}>
    <div className={`p-1.5 transition-all ${active ? 'bg-cyan-950 shadow-[0_0_10px_rgba(6,182,212,0.2)]' : ''}`}>{React.cloneElement(icon as React.ReactElement<any>, { size: 18 })}</div>
    <span className="text-[9px] font-bold uppercase tracking-widest scale-75 whitespace-nowrap">{label}</span>
  </button>
);

export default App;
