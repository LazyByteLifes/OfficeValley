import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  PhoneCall,
  Zap,
  Smile,
  FileText,
  Ghost,
  ArrowLeft,
  Swords,
  Play,
  Lock,
  Cpu,
  Presentation,
  Network,
  MessageSquareWarning,
  Terminal,
  Loader2,
  Send,
  CheckCircle2,
  XCircle,
  FileBadge,
  Image as ImageIcon,
  MessageCircle,
  Trophy,
  ExternalLink // 新图标：外链
} from "lucide-react";

// --- 常量数据 ---
const OFFICE_BG_URL = "https://youke.xn--y7xa690gmna.cn/s1/2026/02/15/69913188a0f1e.webp";

// --- 技能定义 ---
const BOSS_SKILLS = [
  { id: "b1", name: "下班·封印术", desc: "17:59 发起会议，锁定下班按钮", attackText: "简单开个会，所有人进会议室！", icon: PhoneCall },
  { id: "b2", name: "微操·周报催命", desc: "要求精确到分钟的日报", attackText: "这周产出不够饱和啊，发个周报看看？", icon: FileText },
  { id: "b3", name: "零点·PPT降临", desc: "明早就要方案，施加通宵Debuff", attackText: "明天一早我要看到方案 PPT！", icon: Presentation },
  { id: "b4", name: "降维·文字过敏", desc: "拒绝阅读文字，要求架构图", attackText: "字太多不看，给我画个商业架构图！", icon: Network }
];

// --- 员工技能 (新增 link 字段：跳转到学习页面) ---
const ALL_EMP_SKILLS = [
  {
    id: "e1",
    name: "AI 嘴替·礼貌回绝",
    desc: "LLM 生成高情商废话",
    icon: Smile,
    color: "text-green-400",
    techTitle: "DeepSeek / 通义千问",
    techStep: "复制提示词 -> 粘贴 -> 发送",
    magicSpell: "“请帮我用委婉、高情商的语气拒绝这个会议，理由是手头有紧急客户需求...”",
    actionBtn: "发送回复",
    resultType: "text",
    resultContent: "收到。但我手头有一个紧急客户需求必须在今晚交付，可能无法参加会议。我会看会议纪要，有需要我配合的随时同步。",
    link: "https://chatgpt.com/"
  },
  {
    id: "e2",
    name: "黑话·周报膨胀术",
    desc: "把 1 个 Bug 吹成底层重构",
    icon: Cpu,
    color: "text-blue-400",
    techTitle: "Kimi 智能助手",
    techStep: "投喂日报 -> 要求扩写 -> 增加黑话",
    magicSpell: "“将这段日报扩写成 500 字，包含‘底层逻辑’、‘颗粒度’、‘赋能’等词汇...”",
    actionBtn: "一键扩写",
    resultType: "file",
    resultTitle: "本周工作复盘.docx",
    resultDesc: "字数: 3,420 | 查重率: 0% | 黑话浓度: 高",
    link: "https://kimi.moonshot.cn/"
  },
  {
    id: "e3",
    name: "Gamma·光速PPT",
    desc: "Gamma 一键生成，瞬秒 Deadline",
    icon: Zap,
    color: "text-purple-400",
    techTitle: "Gamma.app",
    techStep: "输入大纲 -> 选择主题 -> AI 生成",
    magicSpell: "正在连接 Gamma... 生成大纲... 自动配图... 排版优化... 10页 PPT 生成完毕！",
    actionBtn: "生成 PPT",
    resultType: "file",
    resultTitle: "Q4_商业计划书_vFinal.ppt",
    resultDesc: "页数: 15P | 主题: 科技蓝 | 生成耗时: 30s",
    link: "https://gamma.app/"
  },
  {
    id: "e4",
    name: "Napkin·画饼具象化",
    desc: "文字转架构图，克制文字过敏",
    icon: Briefcase,
    color: "text-orange-400",
    techTitle: "Napkin.ai",
    techStep: "粘贴文档 -> AI 识别逻辑 -> 生成图表",
    magicSpell: "分析文本逻辑... 匹配图表模型... 生成矢量架构图... 导出 SVG！",
    actionBtn: "导出图表",
    resultType: "image",
    resultTitle: "业务逻辑架构图.svg",
    resultDesc: "矢量高清 | 包含: 流程图/层级图/鱼骨图",
    link: "https://napkin.ai/"
  }
];

const SKILL_LINKAGE = {
  b1: ["e1"],
  b2: ["e2"],
  b3: ["e3"],
  b4: ["e4"],
};

// --- 动画配置 ---
const pageVariants = {
  initial: { opacity: 0, scale: 1, filter: "blur(10px)" },
  animate: { opacity: 1, scale: 1, filter: "blur(0px)", transition: { duration: 0.5 } },
  exit: { opacity: 0, scale: 1.1, filter: "blur(20px)", transition: { duration: 0.5 } },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 24 } },
};

export default function App() {
  const [scene, setScene] = useState("start");
  const [selected, setSelected] = useState({ boss: [], emp: [] });

  const availableEmpSkills = useMemo(() => {
    const bossId = selected.boss[0];
    if (!bossId) return [];
    return ALL_EMP_SKILLS.filter(skill => SKILL_LINKAGE[bossId].includes(skill.id));
  }, [selected.boss]);

  const toggleSkill = (role, id) => {
    setSelected((prev) => {
      const isAlreadySelected = prev[role].includes(id);
      if (role === "boss") {
        return { ...prev, boss: isAlreadySelected ? [] : [id], emp: [] };
      } else {
        return { ...prev, emp: isAlreadySelected ? [] : [id] };
      }
    });
  };

  const isReady = selected.boss.length === 1 && selected.emp.length === 1;
  const currentBossSkill = BOSS_SKILLS.find(s => s.id === selected.boss[0]);
  const currentEmpSkill = ALL_EMP_SKILLS.find(s => s.id === selected.emp[0]);

  return (
    <div className="h-screen w-screen overflow-hidden relative bg-black text-white selection:bg-yellow-500 selection:text-black font-sans">

      {/* 背景层 */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-cover bg-center opacity-40 transition-opacity duration-1000" style={{ backgroundImage: `url(${OFFICE_BG_URL})` }} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/90" />
        <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(255,255,255,0.03)_50%)] bg-[length:100%_4px] opacity-30 animate-scan" />
      </div>

      <AnimatePresence mode="wait">

        {/* --- SCENE 1: 开始画面 --- */}
        {scene === "start" && (
          <motion.div key="start" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="relative z-10 h-full flex flex-col items-center justify-center">
            <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2, type: "spring" }} className="text-center relative group z-10">
              <div className="absolute -inset-10 bg-yellow-500/10 blur-3xl rounded-full opacity-50" />
              <h1 className="pixel-zh-title text-5xl md:text-8xl mb-4 relative z-10 tracking-widest">摸鱼谷物语</h1>
              <h2 className="text-2xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 to-yellow-700 drop-shadow-[3px_3px_0_#000] tracking-[0.2em] opacity-90 relative z-10">OFFICE VALLEY</h2>
            </motion.div>

            <motion.button onClick={() => setScene("select")} whileHover={{ scale: 1.05, backgroundColor: "#4ade80" }} whileTap={{ scale: 0.95, y: 4 }} className="mt-16 group relative px-12 py-6 bg-green-500 text-black font-bold text-xl md:text-2xl uppercase tracking-widest shadow-[6px_6px_0_#000] border-2 border-black">
              <span className="flex items-center gap-4 relative z-10"><Play className="w-8 h-8 animate-pulse" fill="currentColor" /> START GAME</span>
            </motion.button>
          </motion.div>
        )}

        {/* --- SCENE 2: 选人画面 --- */}
        {scene === "select" && (
          <motion.div key="select" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="relative z-10 h-full flex flex-col p-4 md:p-8">
            <div className="flex justify-between items-center mb-6 bg-black/60 p-4 rounded-xl border border-white/10 backdrop-blur-xl">
              <button onClick={() => setScene("start")} className="text-slate-400 hover:text-white flex items-center gap-2 group text-base font-bold"><ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> BACK</button>
              <h2 className="text-xl md:text-2xl font-bold text-yellow-400">配置对局 (1v1)</h2>
              <div className="w-16"></div>
            </div>

            <div className="flex-1 flex flex-col md:flex-row gap-6 items-stretch justify-center max-w-7xl mx-auto w-full overflow-hidden">
              <SelectCard role="boss" title="BOSS" subtitle="选择 1 个压迫招式" icon="👹" theme="red" skills={BOSS_SKILLS} selectedIds={selected.boss} onToggle={toggleSkill} />
              <div className="hidden md:flex items-center justify-center"><Swords className={`w-12 h-12 transition-colors ${isReady ? 'text-yellow-500 animate-bounce' : 'text-slate-700'}`} /></div>
              <SelectCard role="emp" title="YOU" subtitle={selected.boss.length ? "选择 1 个应对策略" : "请先选择老板技能"} icon="🧑‍💻" theme="blue" skills={availableEmpSkills} selectedIds={selected.emp} onToggle={toggleSkill} isLocked={selected.boss.length === 0} />
            </div>

            <motion.div className="mt-6 flex justify-center pb-4">
              <motion.button disabled={!isReady} animate={isReady ? { backgroundColor: "#eab308", color: "#000", scale: 1.05 } : { backgroundColor: "#1e293b", color: "#64748b", scale: 1 }} className="px-12 py-5 font-bold text-lg md:text-xl uppercase tracking-widest rounded-xl transition-all border-2 shadow-xl flex items-center gap-3 disabled:cursor-not-allowed" onClick={() => setScene("battle")}>
                {isReady ? <><Swords className="w-6 h-6" /> ENTER OFFICE</> : "请双方各选 1 个技能"}
              </motion.button>
            </motion.div>
          </motion.div>
        )}

        {/* --- SCENE 3: 对战画面 --- */}
        {scene === "battle" && (
          <BattleScene
            key="battle"
            bossSkill={currentBossSkill}
            empSkill={currentEmpSkill}
            onBack={() => setScene("select")}
          />
        )}
      </AnimatePresence>

      <style>{`
        @keyframes scan { from { background-position: 0 0; } to { background-position: 0 100%; } }
        .animate-scan { animation: scan 15s linear infinite; }
        .pixel-zh-title { font-family: "SimHei", "Microsoft YaHei", sans-serif; font-weight: 900; color: #facc15; text-shadow: 3px 3px 0px #a16207, 6px 6px 0px #000000; -webkit-font-smoothing: none; letter-spacing: 0.1em; }
        .shake-crazy { animation: shake-crazy 0.5s cubic-bezier(.36,.07,.19,.97) both infinite; }
        @keyframes shake-crazy { 0% { transform: translate(1px, 1px) rotate(0deg); } 10% { transform: translate(-1px, -2px) rotate(-1deg); } 20% { transform: translate(-3px, 0px) rotate(1deg); } 30% { transform: translate(3px, 2px) rotate(0deg); } 40% { transform: translate(1px, -1px) rotate(1deg); } 50% { transform: translate(-1px, 2px) rotate(-1deg); } 60% { transform: translate(-3px, 1px) rotate(0deg); } 70% { transform: translate(3px, 1px) rotate(-1deg); } 80% { transform: translate(-1px, -1px) rotate(1deg); } 90% { transform: translate(1px, 2px) rotate(0deg); } 100% { transform: translate(1px, -2px) rotate(-1deg); } }
        .typing-cursor::after { content: '|'; animation: blink 1s step-end infinite; }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
      `}</style>
    </div>
  );
}

// ================= 子组件：BattleScene =================
function BattleScene({ bossSkill, empSkill, onBack }) {
  const [turnState, setTurnState] = useState("intro");
  const [isBossAngry, setIsBossAngry] = useState(false);
  const [typingText, setTypingText] = useState("");
  const [isTypingDone, setIsTypingDone] = useState(false);

  // 1. 流程控制
  useEffect(() => {
    let timers = [];
    if (turnState === "intro") {
      timers.push(setTimeout(() => setTurnState("loop"), 1000));
    }
    return () => timers.forEach(clearTimeout);
  }, [turnState]);

  // 2. Boss 狂暴循环
  useEffect(() => {
    if (["casting", "player_atk", "win"].includes(turnState)) {
      setIsBossAngry(false);
      return;
    }
    const loopCycle = () => {
      setIsBossAngry(true);
      setTimeout(() => {
        if (!["casting", "player_atk", "win"].includes(turnState)) {
          setIsBossAngry(false);
        }
      }, 1500);
    };
    const startDelay = setTimeout(() => loopCycle(), 500);
    const interval = setInterval(loopCycle, 4000);
    return () => {
      clearInterval(interval);
      clearTimeout(startDelay);
    };
  }, [turnState]);

  // 3. 打字机逻辑
  useEffect(() => {
    if (turnState === "casting") {
      let i = 0;
      const text = empSkill.magicSpell;
      setTypingText("");
      setIsTypingDone(false);
      const typeInterval = setInterval(() => {
        if (i < text.length) {
          setTypingText(prev => prev + text.charAt(i));
          i++;
        } else {
          clearInterval(typeInterval);
          setIsTypingDone(true);
        }
      }, 30);
      return () => clearInterval(typeInterval);
    }
  }, [turnState, empSkill.magicSpell]);

  const handleStartCast = () => {
    setTurnState("casting");
  };

  const handleFireSkill = () => {
    setTurnState("result_display");
    setTimeout(() => {
      setTurnState("player_atk");
      setTimeout(() => setTurnState("win"), 2000);
    }, 1500);
  };

  // 【新增】处理跳转链接
  const handleLearnMore = () => {
    if (empSkill.link) {
      window.open(empSkill.link, "_blank");
    } else {
      alert("暂无该技能的详情页，敬请期待！");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className={`relative z-20 h-full w-full flex flex-col items-center justify-between p-6`}
    >
      {/* 顶部：Boss 区域 */}
      <div className="w-full max-w-4xl flex items-start justify-between">
        <motion.div
          initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
          className="flex items-center gap-4 bg-red-950/80 p-4 rounded-xl border-2 border-red-500/50 backdrop-blur-md"
        >
          <div className="text-5xl bg-red-900 rounded-full p-2 border-2 border-red-500">👹</div>
          <div>
            <div className="text-red-200 font-bold text-xl">细节狂魔 BOSS</div>
            <div className="w-48 h-3 bg-red-900 mt-2 rounded-full overflow-hidden border border-red-500/30">
              <motion.div
                initial={{ width: "100%" }}
                animate={turnState === "win" ? { width: "0%" } : { width: "100%" }}
                transition={{ duration: 1 }}
                className="h-full bg-red-500"
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* 中间：战场交互区 */}
      <div className="flex-1 w-full max-w-4xl relative flex flex-col items-center justify-center">

        {/* Boss 的消息气泡 */}
        <AnimatePresence>
          {["loop", "intro", "result_display", "player_atk", "win"].includes(turnState) && (
            <motion.div
              initial={{ scale: 0, y: -50 }}
              animate={{ scale: 1, y: 0 }}
              className={`absolute top-10 right-4 md:right-20 bg-white text-black p-6 rounded-2xl rounded-tr-none shadow-[0_0_30px_rgba(239,68,68,0.5)] max-w-md z-10 ${isBossAngry ? 'shake-crazy border-4 border-red-500' : 'border-4 border-transparent'}`}
            >
              <div className="flex items-center gap-2 text-red-600 font-bold mb-2 border-b border-gray-200 pb-2">
                <MessageSquareWarning size={20} /> 来自老板的钉钉消息
              </div>
              <div className="text-2xl font-black leading-relaxed">
                “{bossSkill.attackText}”
              </div>
              <div className="text-xs text-gray-400 mt-2 text-right">已读 17:59</div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 玩家生成结果展示 */}
        <AnimatePresence>
          {["result_display", "player_atk", "win"].includes(turnState) && (
            <motion.div
              initial={{ scale: 0.5, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              className="absolute bottom-32 left-4 md:left-20 max-w-md z-20"
            >
              <div className={`
                 p-6 rounded-2xl rounded-tl-none shadow-2xl border-4 
                 ${empSkill.resultType === 'text' ? 'bg-green-100 border-green-500' : 'bg-slate-100 border-blue-500'}
                 text-black
               `}>
                <div className="flex items-center gap-2 font-bold mb-3 opacity-60 text-xs uppercase tracking-widest">
                  {empSkill.resultType === 'text' ? <MessageCircle size={14} /> : <FileBadge size={14} />}
                  AI Generated Result
                </div>

                {empSkill.resultType === 'text' && (
                  <div className="text-lg leading-relaxed font-bold text-slate-800">
                    "{empSkill.resultContent}"
                  </div>
                )}

                {empSkill.resultType !== 'text' && (
                  <div className="flex items-center gap-4 bg-white p-4 rounded-xl border-2 border-slate-200">
                    <div className={`p-3 rounded-lg ${empSkill.color.replace('text', 'bg').replace('400', '100')}`}>
                      <empSkill.icon size={32} className={empSkill.color} />
                    </div>
                    <div>
                      <div className="font-black text-lg">{empSkill.resultTitle}</div>
                      <div className="text-xs text-slate-500 mt-1">{empSkill.resultDesc}</div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 工具教学演示窗口 */}
        <AnimatePresence>
          {turnState === "casting" && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 1.2, opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center z-30 pointer-events-auto"
            >
              <div className="w-full max-w-2xl bg-slate-900 border border-slate-600 rounded-xl shadow-2xl overflow-hidden font-mono flex flex-col">
                <div className="bg-slate-800 px-4 py-3 flex items-center gap-2 border-b border-slate-700">
                  <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-red-500" /><div className="w-3 h-3 rounded-full bg-yellow-500" /><div className="w-3 h-3 rounded-full bg-green-500" /></div>
                  <div className="ml-4 text-xs text-slate-400 flex items-center gap-2 uppercase tracking-wider"><Terminal size={12} /> {empSkill.techTitle} — Workflow Demo</div>
                </div>

                <div className="p-6 text-green-400 bg-black/95 min-h-[220px] flex flex-col relative">
                  <div className="text-sm text-slate-500 mb-4 border-b border-slate-800 pb-2 flex justify-between">
                    <span><span className="text-yellow-500">Action:</span> {empSkill.techStep}</span>
                    {isTypingDone && <CheckCircle2 size={16} className="text-green-500" />}
                  </div>
                  <div className="flex-1 text-lg leading-relaxed typing-cursor font-bold text-white/90"><span className="text-purple-400 mr-2">Prompt &gt;</span>{typingText}</div>
                  {!isTypingDone && <div className="mt-4 flex items-center gap-2 text-xs text-slate-500 animate-pulse"><Loader2 size={12} className="animate-spin" /> AI Generating...</div>}
                  {isTypingDone && (
                    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mt-6 flex justify-end">
                      <button onClick={handleFireSkill} className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-lg font-bold transition-transform active:scale-95 shadow-[0_0_15px_rgba(74,222,128,0.4)]">
                        <Send size={16} /> {empSkill.actionBtn} (Crit!)
                      </button>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 玩家的反击光束 */}
        <AnimatePresence>
          {turnState === "player_atk" && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "100%", opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center z-40 pointer-events-none"
            >
              <div className="w-full h-32 bg-blue-500/20 blur-xl absolute" />
              <div className="w-full h-4 bg-white shadow-[0_0_50px_#fff] relative z-10" />
              <div className="absolute text-center">
                <div className="text-6xl font-black text-white pixel-zh-title italic" style={{ textShadow: "0 0 20px blue" }}>PERFECT COUNTER</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- 胜利结算 (修改点：跳转按钮) --- */}
        {turnState === "win" && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-yellow-400 text-black p-8 rounded-3xl border-4 border-black shadow-[20px_20px_0_rgba(0,0,0,0.8)] text-center max-w-md w-full relative"
            >
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 5, ease: "linear" }} className="absolute -top-6 -right-6 text-yellow-300 drop-shadow-md">
                <Trophy size={64} fill="currentColor" stroke="black" strokeWidth={2} />
              </motion.div>

              <div className="text-6xl mb-4 animate-bounce">🎉</div>
              <h2 className="text-4xl font-black mb-4 pixel-zh-title text-black" style={{ textShadow: 'none' }}>摸鱼成功!</h2>

              <div className="bg-white/50 rounded-xl p-4 mb-6">
                <p className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-1">New Skill Acquired</p>
                <p className="text-xl font-black">{empSkill.techTitle}</p>
              </div>

              {/* 核心按钮：去学习技能 */}
              <button
                onClick={handleLearnMore}
                className="w-full bg-black text-white px-8 py-4 rounded-xl font-bold text-xl hover:scale-105 transition-transform shadow-lg border-2 border-white/20 flex items-center justify-center gap-3 mb-4"
              >
                🚀 去学习 {empSkill.techTitle}
              </button>

              {/* 次级按钮：返回 */}
              <button
                onClick={onBack}
                className="text-black/60 font-bold hover:text-black underline text-sm"
              >
                返回首页，再来一局
              </button>
            </motion.div>
          </div>
        )}

      </div>

      {/* 底部：玩家操作区 */}
      <div className="w-full max-w-4xl">
        <div className="flex items-center justify-between mb-4 px-4">
          <div className="text-blue-300 font-bold text-xl">YOU</div>
          <div className="text-sm text-slate-400">San值: 100%</div>
        </div>

        <div className="h-32 bg-slate-900/80 border-t-4 border-slate-700 backdrop-blur-md flex items-center justify-center gap-8 rounded-t-3xl transition-colors duration-300">
          <button
            onClick={handleStartCast}
            disabled={turnState !== "loop"}
            className={`
               relative group flex items-center gap-4 px-8 py-4 rounded-2xl border-4 transition-all duration-200
               ${(turnState === "loop")
                ? "bg-blue-600 border-blue-400 hover:scale-105 hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] cursor-pointer"
                : "bg-slate-800 border-slate-600 opacity-50 cursor-not-allowed grayscale"}
             `}
          >
            <div className={`p-3 rounded-lg bg-black/30 ${(turnState === "loop") ? "animate-pulse" : ""}`}>
              <empSkill.icon size={32} className="text-white" />
            </div>
            <div className="text-left">
              <div className="text-sm text-blue-200 font-bold uppercase">Click to Cast</div>
              <div className="text-2xl font-black text-white">{empSkill.name.split('·')[1]}</div>
            </div>

            {(turnState === "loop") && (
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 text-yellow-400 font-bold animate-bounce whitespace-nowrap bg-black px-2 py-1 rounded border border-yellow-500">
                👇 趁现在，反击!
              </div>
            )}
          </button>
        </div>
      </div>

    </motion.div>
  );
}

// ================= 子组件：SelectCard (保持不变) =================
function SelectCard({ role, title, subtitle, icon, theme, skills, selectedIds, onToggle, isLocked }) {
  const isBoss = role === "boss";
  const themeColors = {
    red: { bg: "from-red-950/40 to-slate-900/90", border: "border-red-500/40", text: "text-red-100", accent: "text-red-500", activeBg: "rgba(239,68,68,0.3)", activeBorder: "#ef4444" },
    blue: { bg: "from-blue-950/40 to-slate-900/90", border: "border-blue-500/40", text: "text-blue-100", accent: "text-blue-500", activeBg: "rgba(59,130,246,0.3)", activeBorder: "#3b82f6" },
  };
  const c = themeColors[theme];

  return (
    <motion.div variants={itemVariants} className={`flex-1 bg-gradient-to-br ${c.bg} border ${c.border} rounded-2xl p-6 backdrop-blur-md flex flex-col relative shadow-2xl overflow-hidden`}>
      <div className="absolute -top-10 -right-10 opacity-5 text-9xl pointer-events-none select-none">{icon}</div>
      <div className="text-center mb-6 z-10">
        <h3 className={`text-3xl md:text-4xl ${c.text} font-bold drop-shadow-md`}>{title}</h3>
        <p className="text-slate-400 text-xs md:text-sm mt-2 tracking-widest uppercase font-bold">{subtitle}</p>
      </div>
      <div className="flex-1 space-y-3 z-10 overflow-y-auto">
        {isLocked ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-600 gap-4 opacity-50">
            <Lock size={48} />
            <p className="text-base font-bold">技能尚未解锁</p>
          </div>
        ) : (
          skills.map((skill) => {
            const isSelected = selectedIds.includes(skill.id);
            const Icon = skill.icon;
            return (
              <motion.div
                key={skill.id}
                onClick={() => onToggle(role, skill.id)}
                whileHover={{ scale: 1.02, x: 4 }}
                transition={{ duration: 0.1 }}
                animate={isSelected
                  ? { backgroundColor: c.activeBg, borderColor: c.activeBorder, borderWidth: "2px" }
                  : { backgroundColor: "rgba(0,0,0,0.3)", borderColor: "rgba(255,255,255,0.05)", borderWidth: "1px" }
                }
                className={`cursor-pointer w-full p-4 rounded-xl border transition-all flex items-center gap-4 group relative`}
              >
                <div className={`p-2 rounded-lg bg-slate-800 transition-colors`}>
                  <Icon className={`w-6 h-6 ${isSelected ? c.accent : "text-slate-500"}`} />
                </div>
                <div>
                  <div className={`text-base md:text-lg font-bold ${isSelected ? c.text : "text-slate-300"}`}>{skill.name}</div>
                  <div className="text-xs md:text-sm text-slate-400 leading-snug mt-1">{skill.desc}</div>
                </div>
                {isSelected && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className={`absolute right-4 w-3 h-3 rounded-full ${isBoss ? 'bg-red-500' : 'bg-blue-500'}`} />
                )}
              </motion.div>
            );
          })
        )}
      </div>
    </motion.div>
  );
}