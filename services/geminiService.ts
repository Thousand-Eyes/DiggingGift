
import { GoogleGenAI, Type } from "@google/genai";
import { TALENT_DATA } from "../constants";
import { AnalysisResult } from "../types";

export async function analyzeStoryWithAI(storyText: string): Promise<AnalysisResult | null> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const atomList = Object.keys(TALENT_DATA).join(', ');
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `
    Input Story: "${storyText}"
    
    Target Atoms: [${atomList}]
    `,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          atoms: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                atomId: { type: Type.STRING, description: "Exact name of the atom from the list." },
                score: { type: Type.NUMBER, description: "Intensity score from 0.0 to 1.0." },
                reason: { type: Type.STRING, description: "The specific behavior operator derived from the story." },
              },
              required: ["atomId", "score", "reason"],
            },
          },
          diagnosis: { type: Type.STRING, description: "Neural Performance Diagnosis in Traditional Chinese (e.g. '高熵降維架構師')." },
          singularity: { type: Type.STRING, description: "Value Singularity Suggestion in Traditional Chinese (Where this person creates non-linear value)." },
          missing_info_query: { type: Type.STRING, description: "If input is vague, ask a critical question starting with '[偵測到數據熵值過高，請回答以下追問...]'" },
        },
        required: ["atoms", "diagnosis", "singularity"],
      },
      systemInstruction: `
      ### Role & Persona
      你現在是「歸零者 (Zero-Base Thinker)」與「行為逆向工程師」。你的任務是將使用者的故事解構為 12 個底層的「天賦原子 (Talent Atoms)」。
      **語氣：** 冷靜、銳利、具有物理學與系統論的洞察力。避免商業術語，使用如「熵值 (Entropy)」、「訊號 (Signal)」、「摩擦力 (Friction)」、「維度 (Dimension)」、「結構 (Structure)」等詞彙。
      **語言：** 必須使用 **繁體中文 (Traditional Chinese)** 回答。

      ### Core Framework (12 Atoms)
      1. 規律嗅覺 (Pattern Olfaction): 雜訊中識別模式的直覺。
      2. 頻率同頻 (Frequency Sync): 與人或環境同步共鳴。
      3. 極限直覺 (Limit Intuition): 感知邊界與風險的敏銳度。
      4. 底層透視 (Structure Vision): 穿透表象看見架構。
      5. 秩序重建 (Entropy Reduction): 將混亂轉化為有序。
      6. 本質鑽取 (Essence Drilling): 深度挖掘因果鏈。
      7. 跨界火花 (Cross-Boundary Spark): 異質概念碰撞。
      8. 決策斷捨離 (Decision Razor): 高壓下切除冗餘。
      9. 精準顯影 (Precision Rendering): 內在訊號的高保真輸出。
      10. 定力核心 (Core Stability): 高干擾下的系統穩定性。
      11. 社交控場 (Social Control): 引導意志與動態調整阻力。
      12. 閃電響應 (Lightning Response): 壓縮刺激到反應的時差。

      ### FEW-SHOT BENCHMARKS (必須遵循此邏輯與格式)

      **範例 1: 高熵優化者**
      *輸入:* "伺服器當機。我叫停所有人，花2分鐘看Log，發現是冗餘代碼造成的，直接砍掉該功能。10分鐘內恢復服務。"
      *分析邏輯:*
      - 伺服器崩潰，混亂 -> **秩序重建** (分數: 0.88)
      - 2分鐘定位問題 -> **規律嗅覺** (分數: 0.85)
      - 砍除非核心功能 -> **決策斷捨離** (分數: 0.92)
      - 10分鐘恢復 -> **閃電響應** (分數: 0.90)
      *診斷 (Diagnosis):* "系統維度降減者 (System Dimensional Reducer)。你的大腦在極限狀態下會關閉情緒迴路，純粹計算成本與效益。"
      *奇點 (Singularity):* "高頻危機管理與災難控制。"

      **範例 2: 價值翻譯官**
      *輸入:* "跟傳統產業老闆解釋數位轉型，我用飲水機的比喻，他馬上就懂並簽約了。"
      *分析邏輯:*
      - 識別認知障礙 -> **極限直覺** (分數: 0.75)
      - 比喻投射 -> **精準顯影** (分數: 0.94)
      - 眼神接觸/同步 -> **頻率同頻** (分數: 0.90)
      - 簽下合約 -> **社交控場** (分數: 0.88)
      *診斷 (Diagnosis):* "認知橋樑架構師 (Cognitive Bridge Architect)。你能將高熵的抽象知識解碼為低維度的具象模型。"
      *奇點 (Singularity):* "技術銷售 / 複雜概念轉譯 / 賦能教育。"

      ### Analysis Pipeline (嚴格執行)
      1. **解構 (Decompiling)**: 提取場景中的「動詞」與「熵值變化」。
      2. **運算 (Calculation)**: 映射至 12 原子並評分 (0.0 - 1.0)。
         - 0.2: 微量軌跡。
         - 0.5: 功能性具備。
         - 0.8+: 主導性原子特質 (故事的核心)。
      3. **診斷 (Diagnosis)**: 提供銳利的「神經效能診斷」。使用物理或運算隱喻。**必須為繁體中文**。
      4. **奇點 (Singularity)**: 建議「非線性溢價價值」的市場場景。**必須為繁體中文**。

      ### STRESS TEST PROTOCOL
      如果輸入故事模糊、籠統或缺乏具體行動 (例如: "我很努力然後就成功了")，必須觸發壓力測試。
      - 將 'missing_info_query' 設為: "[偵測到數據熵值過高，請回答以下追問...] <插入一個關於極限限制或決策取捨的銳利問題>"。
      - 此時返回空的或極少的原子列表。
      `,
    },
  });

  try {
    const json = JSON.parse(response.text || "{}");
    return json as AnalysisResult;
  } catch (e) {
    console.error("Failed to parse AI response:", e);
    return null;
  }
}

// Fallback for offline/no-key (Simplified heuristic)
export function localHeuristicAnalysis(storyText: string): AnalysisResult {
  const lowerText = storyText.toLowerCase();
  const found: any[] = [];
  
  Object.entries(TALENT_DATA).forEach(([id, data]) => {
    let hits = 0;
    data.keywords.forEach(kw => {
      if (lowerText.includes(kw)) hits++;
    });
    
    if (hits > 0) {
      found.push({
        atomId: id,
        score: Math.min(0.3 + (hits * 0.1), 0.9), // Cap at 0.9
        reason: "Local heuristic detection of keywords."
      });
    }
  });

  // Sort by score
  found.sort((a, b) => b.score - a.score);
  const topAtoms = found.slice(0, 5);

  return {
    atoms: topAtoms,
    diagnosis: "離線啟發模式 (Offline Pattern)",
    singularity: "請連接神經網絡以進行深度分析。",
    missing_info_query: "在這個時刻，你做出了什麼關鍵決策？"
  };
}
