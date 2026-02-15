import React, { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  PhoneCall,
  Zap,
  Smile,
  FileText,
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
  FileBadge,
  MessageCircle,
  Trophy,
  ExternalLink,
  Info,
  Sparkles,
  Layout,
  MousePointer2,
  Check,
} from "lucide-react";

// --- 常量数据 ---
const OFFICE_BG_URL = "https://img.bytelife.ai/officevalley/background.jpg";

// --- 1. 数据定义 ---
const BOSS_SKILLS = [
  { id: "b1", name: "下班·封印术", nickname: "17:59分的发起人", desc: "17:59 发起会议，锁定下班按钮", attackText: "快下班了，`简单`开个会，所有人进会议室！", satisfiedText: "既然你还有紧急交付，那这次会你先不用参加了，看纪要吧。", icon: PhoneCall },
  { id: "b2", name: "微操·周报催命", nickname: "对齐颗粒度的王总", desc: "要求精确到分钟的日报，体力减半", attackText: "这周产出不够饱和啊，发个周报看看？", satisfiedText: "这个总结非常有深度，看到你对底层架构的思考了，不错。", icon: FileText },
  { id: "b3", name: "零点·PPT降临", nickname: "画饼非遗继承人", desc: "明早就要方案，施加【通宵】Debuff", attackText: "明天一早我要看到方案 PPT！", satisfiedText: "效率很高！方案逻辑很清晰，早点休息，明天汇报用这个。", icon: Presentation },
  { id: "b4", name: "降维·文字过敏", nickname: "闭环守门大魔王", desc: "拒绝阅读文字，强制要求商业架构图", attackText: "字太多我不爱看！给我画个商业架构图！", satisfiedText: "这就是我要的视觉化表达！一目了然，以后都按这个标准出图。", icon: Network }
];

const ALL_EMP_SKILLS = [
  { 
    id: "e1", name: "AI 嘴替·礼貌回绝", nickname: "反卷链路突围者", desc: "LLM 生成高情商废话", icon: Smile, 
    brand: "DeepSeek", brandColor: "#007AFF", brandIcon: MessageCircle, 
    techTitle: "DeepSeek 教你怎么委婉拒绝中...", 
    castSteps: ["分析老板语气情绪...", "匹配‘委婉拒绝’大模型...", "正在构建高情商拒接话术...", "生成最终回复内容..."],
    actionBtn: "发送回复", resultType: "text", resultContent: "收到。但我手头有一个紧急需求必须在今晚交付，可能无法参加。我会看纪要，有需要我配合的随时同步。", link: "https://chatgpt.com/" 
  },
  { 
    id: "e2", name: "黑话·周报膨胀术", nickname: "底层逻辑架构师(自封)", desc: "把 1 个 Bug 吹成底层重构", icon: Cpu, 
    brand: "Kimi", brandColor: "#00E266", brandIcon: Sparkles, 
    techTitle: "Kimi.ai 智能扩写", 
    castSteps: ["扫描原始日报文本...", "提取核心交付物...", "注入‘底层逻辑’等大厂黑话...", "生成深度工作复盘..."],
    actionBtn: "生成周报", resultType: "file", resultTitle: "本周工作复盘.docx", resultDesc: "字数: 3,420 | 查重率: 0% | 黑话浓度: 极高", link: "https://kimi.moonshot.cn/" 
  },
  { 
    id: "e3", name: "Gamma·光速PPT", nickname: "AI咒语·摸鱼仙人", desc: "Gamma 一键生成 PPT", icon: Zap, 
    brand: "Gamma", brandColor: "#6C47FF", brandIcon: Layout, 
    techTitle: "Gamma 一键生成PPT", 
    castSteps: ["解析大纲: 数字化转型方案", "生成第 1 页: 封面与概览", "生成第 2 页: 现状深度分析", "生成第 3 页: 核心解决方案", "生成第 4 页: 商业模式闭环", "生成第 5 页: 落地路线图", "生成第 6 页: 预期收益展望", "最后排版校验，准备交付！"],
    actionBtn: "交付 PPT", resultType: "file", resultTitle: "Q4_商业计划书_vFinal.ppt", resultDesc: "页数: 15P | 主题: 科技蓝 | 生成耗时: 30s", link: "https://gamma.app/" 
  },
  { 
    id: "e4", name: "Napkin·画饼具象化", nickname: "带薪如厕国家队", desc: "文字转架构图", icon: Briefcase, 
    brand: "Napkin", brandColor: "#FF6B00", brandIcon: MousePointer2, 
    techTitle: "Napkin 自动绘制架构图", 
    castSteps: ["提取文本逻辑节点...", "建立核心业务链路...", "识别层级映射关系...", "渲染 SVG 矢量图形...", "线条边缘平滑优化...", "导出透明架构图..."],
    actionBtn: "导出架构图", resultType: "image", resultTitle: "业务逻辑架构图.svg", resultDesc: "矢量高清 | 包含: 流程图/层级图/鱼骨图", link: "https://napkin.ai/" 
  }
];

const SKILL_LINKAGE = { b1: ["e1"], b2: ["e2"], b3: ["e3"], b4: ["e4"] };

// --- 2. 打字机组件 ---
function Typewriter({ text, speed = 30, delay = 0, onComplete, className = "" }) {
  const [displayedText, setDisplayedText] = useState("");
  const hasCompleted = useRef(false);

  useEffect(() => {
    setDisplayedText(""); 
    const timeout = setTimeout(() => {
      let i = 0;
      const interval = setInterval(() => {
        if (i < text.length) {
          setDisplayedText(text.substring(0, i + 1));
          i++;
        } else {
          clearInterval(interval);
          if (onComplete && !hasCompleted.current) {
            hasCompleted.current = true;
            onComplete();
          }
        }
      }, speed);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timeout);
  }, [text, speed, delay, onComplete]);

  return <span className={className}>{displayedText}</span>;
}

export default function App() {
  const [scene, setScene] = useState("start");
  const [selected, setSelected] = useState({ boss: [], emp: [] });
  const availableEmpSkills = useMemo(() => {
    const bossId = selected.boss[0];
    return bossId ? ALL_EMP_SKILLS.filter(s => SKILL_LINKAGE[bossId].includes(s.id)) : [];
  }, [selected.boss]);

  const toggleSkill = (role, id) => {
    setSelected(prev => {
      const isSet = prev[role].includes(id);
      if (role === "boss") return { boss: isSet ? [] : [id], emp: [] };
      return { ...prev, emp: isSet ? [] : [id] };
    });
  };

  return (
    <div className="h-screen w-screen overflow-hidden relative bg-black text-white font-sans selection:bg-yellow-500 selection:text-black">
      <div className="absolute inset-0 z-0 bg-cover bg-center opacity-40 transition-opacity duration-1000" style={{ backgroundImage: `url(${OFFICE_BG_URL})` }} />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/90" />
      <div className="absolute inset-0 bg-[linear-gradient(transparent:50%,rgba(255,255,255,0.03)_50%)] bg-[length:100%_4px] opacity-30" />

      <AnimatePresence mode="wait">
        {scene === "start" && (
          <motion.div key="start" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative z-10 h-full flex flex-col items-center justify-center text-center p-6">
            <h1 className="pixel-zh-title text-5xl md:text-8xl mb-4 tracking-widest">摸鱼谷物语</h1>
            <h2 className="text-2xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 to-yellow-700 drop-shadow-[3px_3px_0_#000] mb-12">OFFICE VALLEY</h2>
            <motion.button onClick={() => setScene("select")} whileHover={{ scale: 1.05 }} className="px-12 py-6 bg-green-500 text-black font-bold text-2xl border-2 border-black flex items-center gap-4 shadow-[6px_6px_0_#000]">
              <Play fill="currentColor" /> START GAME
            </motion.button>
          </motion.div>
        )}

        {scene === "select" && (
          <motion.div key="select" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative z-10 h-full flex flex-col p-4 md:p-8">
            <div className="flex justify-between items-center mb-6 bg-black/60 p-4 rounded-xl border border-white/10 backdrop-blur-xl">
              <button onClick={() => setScene("start")} className="text-slate-400 hover:text-white flex items-center gap-2 font-bold"><ArrowLeft size={20} /> BACK</button>
              <h2 className="text-xl md:text-2xl font-bold text-yellow-400">配置对局 (1v1)</h2>
              <div className="w-16"></div>
            </div>
            <div className="flex-1 flex flex-col md:flex-row gap-6 items-stretch justify-center max-w-7xl mx-auto w-full overflow-hidden">
              <SelectCard role="boss" title="BOSS" skills={BOSS_SKILLS} selectedIds={selected.boss} onToggle={toggleSkill} theme="red" />
              <div className="hidden md:flex items-center justify-center"><Swords className={`w-12 h-12 transition-colors ${selected.emp.length ? 'text-yellow-500 animate-bounce' : 'text-slate-700'}`} /></div>
              <SelectCard role="emp" title="YOU" skills={availableEmpSkills} selectedIds={selected.emp} onToggle={toggleSkill} theme="blue" isLocked={selected.boss.length === 0} />
            </div>
            <div className="mt-8 flex justify-center pb-4">
              <motion.button disabled={selected.emp.length === 0} onClick={() => setScene("battle")} className="px-16 py-5 bg-yellow-500 text-black font-bold text-xl rounded-xl disabled:opacity-50 flex items-center gap-3 shadow-xl transition-all"><Swords size={24} /> ENTER OFFICE</motion.button>
            </div>
          </motion.div>
        )}

        {scene === "battle" && (
          <BattleScene key="battle" bossSkill={BOSS_SKILLS.find(s => s.id === selected.boss[0])} empSkill={ALL_EMP_SKILLS.find(s => s.id === selected.emp[0])} onBack={() => setScene("select")} />
        )}
      </AnimatePresence>

      <style>{`
        .pixel-zh-title { font-family: "SimHei", "Microsoft YaHei", sans-serif; font-weight: 900; color: #facc15; text-shadow: 3px 3px 0px #a16207, 6px 6px 0px #000000; letter-spacing: 0.1em; }
        .shake-crazy { animation: shake-crazy 0.5s cubic-bezier(.36,.07,.19,.97) both infinite; }
        @keyframes shake-crazy { 0% { transform: translate(1px, 1px) rotate(0deg); } 10% { transform: translate(-1px, -2px) rotate(-1deg); } 20% { transform: translate(-3px, 0px) rotate(1deg); } 30% { transform: translate(3px, 2px) rotate(0deg); } 40% { transform: translate(1px, -1px) rotate(1deg); } 50% { transform: translate(-1px, 2px) rotate(-1deg); } 60% { transform: translate(-3px, 1px) rotate(0deg); } 70% { transform: translate(3px, 1px) rotate(-1deg); } 80% { transform: translate(-1px, -1px) rotate(1deg); } 90% { transform: translate(1px, 2px) rotate(0deg); } 100% { transform: translate(1px, -2px) rotate(-1deg); } }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .ko-glitch { animation: glitch 0.3s linear infinite; }
        @keyframes glitch { 0% { opacity: 1; } 50% { opacity: 0.4; transform: scale(1.1); } 100% { opacity: 1; } }
        .winner-aura { animation: winner-aura-pulse 2s infinite; }
        @keyframes winner-aura-pulse { 0% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.6); } 70% { box-shadow: 0 0 0 30px rgba(34, 197, 94, 0); } 100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); } }
      `}</style>
    </div>
  );
}

// ================= 3. 战斗场景组件 (修复重复打字 Bug) =================
function BattleScene({ bossSkill, empSkill, onBack }) {
  const [turnState, setTurnState] = useState("loop"); 
  const [isBossAngry, setIsBossAngry] = useState(false);
  const [castStepIndex, setCastStepIndex] = useState(0); 
  const [isCastingDone, setIsCastingDone] = useState(false);
  const [isSatisfiedTypingDone, setIsSatisfiedTypingDone] = useState(false); 
  const scrollRef = useRef(null);

  const isBossDefeated = turnState === "boss_satisfied";

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [turnState, castStepIndex, isSatisfiedTypingDone]);

  // Boss 开场 1s 延迟后震动
  useEffect(() => {
    if (["casting", "player_atk", "boss_satisfied"].includes(turnState)) {
      setIsBossAngry(false); return;
    }
    const initialDelay = setTimeout(() => {
      setIsBossAngry(true);
      setTimeout(() => setIsBossAngry(false), 1200);
    }, 1000); 

    const interval = setInterval(() => {
      setIsBossAngry(true);
      setTimeout(() => setIsBossAngry(false), 1200);
    }, 3500); 
    
    return () => { clearInterval(interval); clearTimeout(initialDelay); };
  }, [turnState]);

  useEffect(() => {
    if (turnState === "casting") {
      setCastStepIndex(0);
      setIsCastingDone(false);
      const totalSteps = empSkill.castSteps.length;
      let current = 0;
      const interval = setInterval(() => {
        if (current < totalSteps - 1) {
          current++;
          setCastStepIndex(current);
        } else {
          clearInterval(interval);
          setIsCastingDone(true);
        }
      }, 800); 
      return () => clearInterval(interval);
    }
  }, [turnState, empSkill]);

  const handleStartCast = () => setTurnState("casting");

  // 转场 800ms
  const handleFire = () => {
    setTurnState("result_display");
    setTimeout(() => {
      setTurnState("player_atk");
      setTimeout(() => {
        setTurnState("boss_satisfied"); 
      }, 800); 
    }, 800);
  };

  const handleLearnMore = () => empSkill.link && window.open(empSkill.link, "_blank");

  return (
    <div className="relative z-20 h-full w-full flex flex-col items-center justify-between p-6">
      {/* 顶部状态栏 */}
      <div className="w-full max-w-4xl flex items-center justify-between bg-black/60 p-5 rounded-2xl border border-white/10 backdrop-blur-xl shadow-2xl">
        <div className="flex items-center gap-5">
          <motion.div animate={isBossDefeated ? { y: 5, rotate: 5, opacity: 0.7 } : {}} className="text-5xl">{isBossDefeated ? '🫠' : '🧐'}</motion.div>
          <div>
            <div className={`font-bold text-lg ${isBossDefeated ? 'text-slate-500' : 'text-red-400'}`}>
              {bossSkill.nickname} {isBossDefeated && <span className="ml-2 text-[10px] bg-red-600 text-white px-1.5 py-0.5 rounded ko-glitch uppercase">Defeated</span>}
            </div>
            <div className="w-40 h-2.5 bg-red-900/40 rounded-full mt-2 overflow-hidden border border-red-500/10">
              <motion.div animate={{ width: isBossDefeated ? "0%" : "100%", backgroundColor: isBossDefeated ? "#475569" : "#ef4444" }} className="h-full shadow-[0_0_10px_#ef4444]" />
            </div>
          </div>
        </div>
        <div className="text-yellow-500 font-black text-2xl italic tracking-tighter opacity-50">VS</div>
        <div className="flex items-center gap-5 text-right">
          <div>
            <div className={`font-bold text-lg ${isBossDefeated ? 'text-green-400' : 'text-blue-400'}`}>
              {isBossDefeated && <span className="mr-2 text-[10px] bg-green-600 text-white px-1.5 py-0.5 rounded uppercase animate-bounce inline-block">Perfect Win</span>}
              {empSkill.nickname}
            </div>
            <div className="w-40 h-2.5 bg-green-900/50 rounded-full mt-2 overflow-hidden border border-green-500/20 ml-auto">
              <motion.div initial={{ width: "100%" }} className="h-full bg-green-500 shadow-[0_0_10px_#22c55e]" />
            </div>
          </div>
          <motion.div animate={isBossDefeated ? { scale: [1, 1.15, 1] } : {}} transition={{ repeat: isBossDefeated ? Infinity : 0, duration: 2 }} className={`text-5xl rounded-full flex items-center justify-center ${isBossDefeated ? 'winner-aura bg-green-500/30' : ''}`} style={{ width: '60px', height: '60px' }}>
            {isBossDefeated ? '😎' : '🧑‍💻'}
          </motion.div>
        </div>
      </div>

      {/* 消息会话区域 */}
      <div ref={scrollRef} className="flex-1 w-full max-w-2xl overflow-y-auto px-4 py-10 space-y-12 no-scrollbar scroll-smooth">
        {/* 老板找茬 */}
        {["loop", "casting", "result_display", "player_atk", "boss_satisfied"].includes(turnState) && (
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} className="flex justify-start">
             <div className={`p-6 rounded-3xl rounded-tl-none max-w-sm bg-white text-black shadow-2xl border-4 ${isBossAngry ? "shake-crazy border-red-500" : "border-transparent"}`}>
               <div className="text-[10px] font-black mb-2 text-red-500 border-b pb-2">{bossSkill.nickname}</div>
               <div className="text-xl font-black leading-snug">“<Typewriter text={bossSkill.attackText} speed={40} />”</div>
             </div>
          </motion.div>
        )}

        {/* 员工反击消息 */}
        {["result_display", "player_atk", "boss_satisfied"].includes(turnState) && (
          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} className="flex justify-end">
             <div className="p-6 rounded-3xl rounded-tr-none max-w-sm border-4 border-blue-400 bg-blue-600 text-white shadow-[0_0_40px_rgba(59,130,246,0.5)]">
               <div className="text-[10px] font-black mb-3 opacity-70 uppercase tracking-widest">{empSkill.nickname}</div>
               {empSkill.resultType === 'text' ? (
                 <div className="text-lg font-bold italic leading-relaxed">"<Typewriter text={empSkill.resultContent} speed={30} />"</div>
               ) : (
                 <div className="flex items-center gap-4 bg-white/10 p-4 rounded-xl border border-white/20">
                    <div className="p-2 bg-white/10 rounded-lg"><empSkill.icon size={28}/></div>
                    <div><div className="font-black text-sm">{empSkill.resultTitle}</div><div className="text-[10px] opacity-60 font-mono mt-0.5">{empSkill.resultDesc}</div></div>
                 </div>
               )}
             </div>
          </motion.div>
        )}

        {/* 老板满意答复 (已修复重复打字问题) */}
        {isBossDefeated && (
          <>
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} className="flex justify-start">
              <div className="p-6 rounded-3xl rounded-tl-none max-w-sm bg-green-50 text-green-900 border-4 border-green-500 shadow-2xl">
                <div className="text-[10px] font-black mb-2 text-green-600 border-b border-green-200 pb-2">{bossSkill.nickname} (已安抚)</div>
                <div className="text-lg font-black leading-snug">
                  “{isSatisfiedTypingDone ? (
                    bossSkill.satisfiedText
                  ) : (
                    <Typewriter 
                      text={bossSkill.satisfiedText} 
                      speed={40} 
                      delay={500} 
                      onComplete={() => setIsSatisfiedTypingDone(true)} 
                    />
                  )}”
                </div>
              </div>
            </motion.div>
            
            {/* 系统结算卡片 */}
            <AnimatePresence>
              {isSatisfiedTypingDone && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-6 py-8">
                  <div className="w-full max-w-sm bg-slate-900/90 border border-white/10 p-8 rounded-3xl backdrop-blur-xl shadow-2xl text-center space-y-5">
                    <Trophy size={48} className="mx-auto text-yellow-500 drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]" />
                    <h4 className="text-2xl font-black italic pixel-zh-title">对线大胜利!</h4>
                    <p className="text-sm text-slate-400">刚才化解危机的神器是 <b>{empSkill.brand}</b>。</p>
                    <button onClick={handleLearnMore} className="w-full bg-green-600 text-white py-4 rounded-2xl font-black text-base flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg">🚀 去学习 {empSkill.brand} <ExternalLink size={18} /></button>
                    <button onClick={onBack} className="w-full text-slate-500 hover:text-white text-xs font-bold underline transition-colors">挑战下一关</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>

      {/* 底部按钮 */}
      <div className="w-full max-w-4xl h-32 bg-slate-900/90 rounded-3xl border-4 border-slate-700 backdrop-blur-xl flex items-center justify-center p-6 shadow-2xl">
        <button onClick={handleStartCast} disabled={turnState !== "loop"} className={`px-16 py-4 rounded-2xl font-black text-2xl flex items-center gap-5 border-b-8 transition-all active:translate-y-2 active:border-b-0 ${turnState === "loop" ? "bg-blue-600 border-blue-800 text-white" : "bg-slate-800 border-slate-950 text-slate-600 opacity-40 cursor-not-allowed"}`}>
          <empSkill.icon size={28} /> {empSkill.name.split('·')[1]}
        </button>
      </div>

      {/* 品牌拟态演示窗 (Gamma 6页逻辑) */}
      <AnimatePresence>
        {turnState === "casting" && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md px-6">
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-2xl rounded-3xl shadow-[0_40px_100px_rgba(0,0,0,0.8)] overflow-hidden border-4" style={{ borderColor: empSkill.brandColor }}>
              <div className="px-6 py-4 flex items-center justify-between border-b" style={{ backgroundColor: empSkill.brandColor + '20', borderColor: empSkill.brandColor + '40' }}>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-white/10"><empSkill.brandIcon size={20} style={{ color: empSkill.brandColor }} /></div>
                  <span className="font-black tracking-tighter text-lg">{empSkill.brand} AI Engine</span>
                </div>
                <div className="flex gap-2"><div className="w-3 h-3 rounded-full bg-red-500/50" /><div className="w-3 h-3 rounded-full bg-yellow-500/50" /><div className="w-3 h-3 rounded-full bg-green-500/50" /></div>
              </div>

              <div className="bg-slate-950 p-6 md:p-8 min-h-[420px] flex flex-col relative">
                <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-1">Running Process</div>
                    <div className="text-3xl font-black tracking-wide" style={{ color: empSkill.brandColor, textShadow: `0 0 20px ${empSkill.brandColor}40` }}>{empSkill.techTitle}</div>
                  </div>
                  <div className="text-xl font-mono font-bold text-slate-600 bg-slate-900 px-4 py-2 rounded-lg border border-white/5">{castStepIndex + 1} <span className="text-slate-700 text-sm">/ {empSkill.castSteps.length}</span></div>
                </div>

                <div className="flex-1 flex items-center justify-center overflow-hidden mb-6">
                  {empSkill.brand === 'Gamma' && (
                    <div className="grid grid-cols-3 grid-rows-2 gap-3 w-full">
                      {[0,1,2,3,4,5].map(idx => (
                        <motion.div key={idx} animate={{ 
                          opacity: castStepIndex >= (idx + 1) ? 1 : 0.15,
                          scale: castStepIndex === idx + 1 ? 1.05 : 1,
                          borderColor: castStepIndex === idx + 1 ? empSkill.brandColor : 'rgba(255,255,255,0.1)'
                        }} className="aspect-[4/3] bg-white/5 border rounded-lg overflow-hidden relative p-2">
                          <div className="h-1 w-3/4 bg-white/20 rounded mb-1" />
                          <div className="h-0.5 w-full bg-white/10 rounded" />
                          <div className="mt-2 flex items-center justify-center">
                            {castStepIndex > idx + 1 ? <Check size={12} className="text-green-500" /> : castStepIndex === idx + 1 ? <Loader2 size={12} className="animate-spin text-white/50" /> : null}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {empSkill.brand === 'Napkin' && (
                    <div className="relative h-32 w-full flex items-center justify-center">
                      <svg width="240" height="120" viewBox="0 0 240 120" className="overflow-visible">
                        <motion.circle cx="120" cy="20" r="10" stroke={empSkill.brandColor} strokeWidth="2" fill="none" animate={{ opacity: castStepIndex >= 1 ? 1 : 0 }} />
                        <motion.circle cx="50" cy="60" r="10" stroke={empSkill.brandColor} strokeWidth="2" fill="none" animate={{ opacity: castStepIndex >= 2 ? 1 : 0 }} />
                        <motion.circle cx="190" cy="60" r="10" stroke={empSkill.brandColor} strokeWidth="2" fill="none" animate={{ opacity: castStepIndex >= 2 ? 1 : 0 }} />
                        <motion.circle cx="120" cy="100" r="10" stroke={empSkill.brandColor} strokeWidth="2" fill="none" animate={{ opacity: castStepIndex >= 3 ? 1 : 0 }} />
                        {castStepIndex >= 2 && <motion.path d="M 110 30 L 60 50" stroke={empSkill.brandColor} fill="none" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />}
                        {castStepIndex >= 2 && <motion.path d="M 130 30 L 180 50" stroke={empSkill.brandColor} fill="none" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />}
                        {castStepIndex >= 3 && <motion.path d="M 60 70 L 110 90" stroke={empSkill.brandColor} fill="none" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />}
                      </svg>
                    </div>
                  )}

                  {(empSkill.brand === 'DeepSeek' || empSkill.brand === 'Kimi') && (
                    <div className="space-y-4 w-full">
                      <div className="flex justify-end"><div className="bg-slate-800 px-4 py-2 rounded-2xl rounded-tr-none text-xs text-slate-400 italic">Thinking...</div></div>
                      <div className="bg-white/5 border border-white/10 px-5 py-4 rounded-2xl text-base font-medium leading-relaxed" style={{ color: empSkill.brandColor }}>
                        {empSkill.castSteps[castStepIndex]}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-white/5 flex flex-col items-center gap-4">
                  {!isCastingDone ? (
                    <div className="w-full text-center">
                      <div className="text-lg font-black text-white italic tracking-tight mb-4">{empSkill.castSteps[castStepIndex]}</div>
                      <div className="flex justify-center gap-1.5">{empSkill.castSteps.map((_, i) => (<div key={i} className={`h-1 rounded-full transition-all duration-500 ${castStepIndex >= i ? 'w-8' : 'w-2 bg-white/10'}`} style={{ backgroundColor: castStepIndex >= i ? empSkill.brandColor : undefined }} />))}</div>
                    </div>
                  ) : (
                    <motion.button initial={{ scale: 0.9, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} onClick={handleFire} className="w-full py-5 rounded-2xl font-black text-xl flex items-center justify-center gap-3 shadow-2xl" style={{ backgroundColor: empSkill.brandColor }}>
                      <Send size={24}/> {empSkill.actionBtn}
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ================= 选择卡片组件 =================
function SelectCard({ role, title, skills, selectedIds, onToggle, theme, isLocked }) {
  const c = theme === "red" ? "border-red-500/30 bg-red-500/10" : "border-blue-500/30 bg-blue-500/10";
  const active = theme === "red" ? "border-red-500 bg-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.2)]" : "border-blue-500 bg-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.2)]";

  return (
    <div className={`flex-1 border-2 ${c} rounded-[32px] p-6 flex flex-col gap-5 backdrop-blur-sm overflow-hidden shadow-2xl`}>
      <h3 className={`text-4xl font-black text-center ${theme === 'red' ? 'text-red-400' : 'text-blue-400'}`}>{title}</h3>
      {isLocked ? (
        <div className="flex-1 flex flex-col items-center justify-center opacity-20 grayscale"><Lock size={48} /><p className="mt-4 font-black uppercase">Locked</p></div>
      ) : (
        <div className="flex-1 space-y-4 overflow-y-auto pr-2 no-scrollbar">
          {skills.map(s => (
            <div key={s.id} onClick={() => onToggle(role, s.id)} className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-5 ${selectedIds.includes(s.id) ? active : "border-white/5 bg-white/5 hover:bg-white/10"}`}>
              <div className={`p-3 rounded-xl ${selectedIds.includes(s.id) ? 'bg-white/10' : 'bg-black/20'}`}><s.icon size={28} /></div>
              <div className="flex-1 text-left">
                <div className="font-black text-lg leading-tight">{s.name}</div>
                {s.desc && <div className="text-sm opacity-80 leading-snug mt-1.5 font-medium">{s.desc}</div>}
              </div>
              {selectedIds.includes(s.id) && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className={`w-3 h-3 rounded-full ${theme === 'red' ? 'bg-red-500' : 'bg-blue-500'}`} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}