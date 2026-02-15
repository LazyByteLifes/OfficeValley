import React, { useState, useMemo, useEffect, useRef } from "react";
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
  ExternalLink,
  Info,
} from "lucide-react";

// --- 常量数据 ---
const OFFICE_BG_URL =
  "https://youke.xn--y7xa690gmna.cn/s1/2026/02/15/69913188a0f1e.webp";

// --- 1. 老板技能 (已找回 desc 字段) ---
const BOSS_SKILLS = [
  {
    id: "b1",
    name: "下班·封印术",
    desc: "17:59 发起会议，锁定下班按钮",
    attackText: "简单开个会，所有人进会议室！",
    satisfiedText: "既然你还有紧急交付，那这次会你先不用参加了，看纪要吧。",
    icon: PhoneCall,
  },
  {
    id: "b2",
    name: "微操·周报催命",
    desc: "要求精确到分钟的日报，体力减半",
    attackText: "这周产出不够饱和啊，发个周报看看？",
    satisfiedText: "这个总结非常有深度，看到你对底层架构的思考了，不错。",
    icon: FileText,
  },
  {
    id: "b3",
    name: "零点·PPT降临",
    desc: "明早就要方案，施加【通宵】Debuff",
    attackText: "明天一早我要看到方案 PPT！",
    satisfiedText: "效率很高！方案逻辑很清晰，早点休息，明天汇报用这个。",
    icon: Presentation,
  },
  {
    id: "b4",
    name: "降维·文字过敏",
    desc: "拒绝阅读文字，强制要求商业架构图",
    attackText: "字太多不看，给我画个商业架构图！",
    satisfiedText: "这就是我要的视觉化表达！一目了然，以后都按这个标准出图。",
    icon: Network,
  },
];

// --- 2. 员工技能 ---
const ALL_EMP_SKILLS = [
  {
    id: "e1",
    name: "AI 嘴替·礼貌回绝",
    desc: "LLM 生成高情商废话，无伤格挡",
    icon: Smile,
    color: "text-green-400",
    techTitle: "DeepSeek / 通义千问",
    techStep: "复制提示词 -> 粘贴 -> 发送",
    magicSpell:
      "“请帮我用委婉、高情商的语气拒绝这个会议，理由是手头有紧急客户需求...”",
    actionBtn: "发送回复",
    resultType: "text",
    resultContent:
      "收到。但我手头有一个紧急客户需求必须在今晚交付，可能无法参加会议。我会看会议纪要，有需要我配合的随时同步。",
    link: "https://chatgpt.com/",
  },
  {
    id: "e2",
    name: "黑话·周报膨胀术",
    desc: "把 1 个 Bug 吹成底层重构",
    icon: Cpu,
    color: "text-blue-400",
    techTitle: "Kimi 智能助手",
    techStep: "投喂日报 -> 要求扩写 -> 增加黑话",
    magicSpell:
      "“将这段日报扩写成 500 字，包含‘底层逻辑’、‘颗粒度’、‘赋能’等词汇...”",
    actionBtn: "一键扩写",
    resultType: "file",
    resultTitle: "本周工作复盘.docx",
    resultDesc: "字数: 3,420 | 查重率: 0% | 黑话浓度: 高",
    link: "https://kimi.moonshot.cn/",
  },
  {
    id: "e3",
    name: "Gamma·光速PPT",
    desc: "Gamma 一键生成，瞬秒 Deadline",
    icon: Zap,
    color: "text-purple-400",
    techTitle: "Gamma.app",
    techStep: "输入大纲 -> 选择主题 -> AI 生成",
    magicSpell:
      "正在连接 Gamma... 生成大纲... 自动配图... 排版优化... 10页 PPT 生成完毕！",
    actionBtn: "生成 PPT",
    resultType: "file",
    resultTitle: "Q4_商业计划书_vFinal.ppt",
    resultDesc: "页数: 15P | 主题: 科技蓝 | 生成耗时: 30s",
    link: "https://gamma.app/",
  },
  {
    id: "e4",
    name: "Napkin·画饼具象化",
    desc: "文字转架构图，克制【文字过敏】",
    icon: Briefcase,
    color: "text-orange-400",
    techTitle: "Napkin.ai",
    techStep: "粘贴文档 -> AI 识别逻辑 -> 生成图表",
    magicSpell: "分析文本逻辑... 匹配图表模型... 生成矢量架构图... 导出 SVG！",
    actionBtn: "导出图表",
    resultType: "image",
    resultTitle: "业务逻辑架构图.svg",
    resultDesc: "矢量高清 | 包含: 流程图/层级图/鱼骨图",
    link: "https://napkin.ai/",
  },
];

const SKILL_LINKAGE = {
  b1: ["e1"],
  b2: ["e2"],
  b3: ["e3"],
  b4: ["e4"],
};

export default function App() {
  const [scene, setScene] = useState("start");
  const [selected, setSelected] = useState({ boss: [], emp: [] });

  const availableEmpSkills = useMemo(() => {
    const bossId = selected.boss[0];
    if (!bossId) return [];
    return ALL_EMP_SKILLS.filter((skill) =>
      SKILL_LINKAGE[bossId].includes(skill.id)
    );
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
  const currentBossSkill = BOSS_SKILLS.find((s) => s.id === selected.boss[0]);
  const currentEmpSkill = ALL_EMP_SKILLS.find((s) => s.id === selected.emp[0]);

  return (
    <div className="h-screen w-screen overflow-hidden relative bg-black text-white font-sans selection:bg-yellow-500 selection:text-black">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40 transition-opacity duration-1000"
          style={{ backgroundImage: `url(${OFFICE_BG_URL})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/90" />
        <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(255,255,255,0.03)_50%)] bg-[length:100%_4px] opacity-30 animate-scan" />
      </div>

      <AnimatePresence mode="wait">
        {scene === "start" && (
          <motion.div
            key="start"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-10 h-full flex flex-col items-center justify-center text-center p-6"
          >
            <h1 className="pixel-zh-title text-5xl md:text-8xl mb-4 tracking-widest">
              摸鱼谷物语
            </h1>
            <h2 className="text-2xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 to-yellow-700 drop-shadow-[3px_3px_0_#000] mb-12">
              OFFICE VALLEY
            </h2>
            <motion.button
              onClick={() => setScene("select")}
              whileHover={{ scale: 1.05 }}
              className="px-12 py-6 bg-green-500 text-black font-bold text-2xl border-2 border-black flex items-center gap-4"
            >
              <Play fill="currentColor" /> START GAME
            </motion.button>
          </motion.div>
        )}

        {scene === "select" && (
          <motion.div
            key="select"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-10 h-full flex flex-col p-4 md:p-8"
          >
            <div className="flex justify-between items-center mb-6 bg-black/60 p-4 rounded-xl border border-white/10 backdrop-blur-xl">
              <button
                onClick={() => setScene("start")}
                className="text-slate-400 hover:text-white flex items-center gap-2 font-bold transition-colors"
              >
                <ArrowLeft size={20} /> BACK
              </button>
              <h2 className="text-xl md:text-2xl font-bold text-yellow-400">
                配置对局 (1v1)
              </h2>
              <div className="w-16"></div>
            </div>
            <div className="flex-1 flex flex-col md:flex-row gap-6 items-stretch justify-center max-w-7xl mx-auto w-full overflow-hidden">
              <SelectCard
                role="boss"
                title="BOSS"
                skills={BOSS_SKILLS}
                selectedIds={selected.boss}
                onToggle={toggleSkill}
                theme="red"
              />
              <div className="hidden md:flex items-center justify-center">
                <Swords
                  className={`w-12 h-12 transition-colors ${
                    isReady
                      ? "text-yellow-500 animate-bounce"
                      : "text-slate-700"
                  }`}
                />
              </div>
              <SelectCard
                role="emp"
                title="YOU"
                skills={availableEmpSkills}
                selectedIds={selected.emp}
                onToggle={toggleSkill}
                theme="blue"
                isLocked={selected.boss.length === 0}
              />
            </div>
            <div className="mt-8 flex justify-center pb-4">
              <motion.button
                disabled={!isReady}
                onClick={() => setScene("battle")}
                className="px-16 py-5 bg-yellow-500 text-black font-bold text-xl rounded-xl disabled:opacity-50 flex items-center gap-3 shadow-xl transition-all"
              >
                <Swords size={24} /> ENTER OFFICE
              </motion.button>
            </div>
          </motion.div>
        )}

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
        .pixel-zh-title { font-family: "SimHei", "Microsoft YaHei", sans-serif; font-weight: 900; color: #facc15; text-shadow: 3px 3px 0px #a16207, 6px 6px 0px #000000; letter-spacing: 0.1em; }
        .shake-crazy { animation: shake-crazy 0.5s cubic-bezier(.36,.07,.19,.97) both infinite; }
        @keyframes shake-crazy { 0% { transform: translate(1px, 1px) rotate(0deg); } 10% { transform: translate(-1px, -2px) rotate(-1deg); } 20% { transform: translate(-3px, 0px) rotate(1deg); } 30% { transform: translate(3px, 2px) rotate(0deg); } 40% { transform: translate(1px, -1px) rotate(1deg); } 50% { transform: translate(-1px, 2px) rotate(-1deg); } 60% { transform: translate(-3px, 1px) rotate(0deg); } 70% { transform: translate(3px, 1px) rotate(-1deg); } 80% { transform: translate(-1px, -1px) rotate(1deg); } 90% { transform: translate(1px, 2px) rotate(0deg); } 100% { transform: translate(1px, -2px) rotate(-1deg); } }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .typing-cursor::after { content: '|'; animation: blink 1s step-end infinite; }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
      `}</style>
    </div>
  );
}

// ================= 3. 战斗场景组件 (已修正布局与字段) =================
function BattleScene({ bossSkill, empSkill, onBack }) {
  const [turnState, setTurnState] = useState("intro");
  const [isBossAngry, setIsBossAngry] = useState(false);
  const [typingText, setTypingText] = useState("");
  const [isTypingDone, setIsTypingDone] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [turnState, typingText]);

  useEffect(() => {
    if (turnState === "intro") setTimeout(() => setTurnState("loop"), 1000);
  }, [turnState]);

  useEffect(() => {
    if (["casting", "player_atk", "boss_satisfied"].includes(turnState)) {
      setIsBossAngry(false);
      return;
    }
    const interval = setInterval(() => {
      setIsBossAngry(true);
      setTimeout(() => setIsBossAngry(false), 1500);
    }, 4000);
    return () => clearInterval(interval);
  }, [turnState]);

  useEffect(() => {
    if (turnState === "casting") {
      let i = 0;
      const text = empSkill.magicSpell;
      setTypingText("");
      const typeInterval = setInterval(() => {
        if (i < text.length) {
          setTypingText((prev) => prev + text.charAt(i));
          i++;
        } else {
          clearInterval(typeInterval);
          setIsTypingDone(true);
        }
      }, 30);
      return () => clearInterval(typeInterval);
    }
  }, [turnState, empSkill.magicSpell]);

  const handleStartCast = () => setTurnState("casting");

  const handleFireSkill = () => {
    setTurnState("result_display");
    setTimeout(() => {
      setTurnState("player_atk");
      setTimeout(() => setTurnState("boss_satisfied"), 1500);
    }, 1500);
  };

  const handleLearnMore = () =>
    empSkill.link && window.open(empSkill.link, "_blank");

  return (
    <div className="relative z-20 h-full w-full flex flex-col items-center justify-between p-6">
      {/* 顶部状态栏 */}
      <div className="w-full max-w-4xl flex items-center justify-between bg-black/60 p-5 rounded-2xl border border-white/10 backdrop-blur-xl shadow-2xl">
        <div className="flex items-center gap-5">
          <div className="text-5xl drop-shadow-[0_0_10px_rgba(239,68,68,0.4)]">
            👹
          </div>
          <div>
            <div className="text-red-400 font-bold text-lg">细节狂魔 BOSS</div>
            <div className="w-40 h-2.5 bg-red-900/50 rounded-full mt-2 overflow-hidden border border-red-500/20">
              <motion.div
                animate={{
                  width: turnState === "boss_satisfied" ? "0%" : "100%",
                }}
                className="h-full bg-red-500 shadow-[0_0_10px_#ef4444]"
              />
            </div>
          </div>
        </div>
        <div className="text-yellow-500 font-black text-2xl italic tracking-tighter opacity-50">
          VS
        </div>
        <div className="flex items-center gap-5 text-right">
          <div>
            <div className="text-blue-400 font-bold text-lg">摸鱼特工</div>
            <div className="text-xs text-slate-400 font-mono tracking-widest">
              SAN: 100%
            </div>
          </div>
          <div className="text-5xl drop-shadow-[0_0_10px_rgba(59,130,246,0.4)]">
            🧑‍💻
          </div>
        </div>
      </div>

      {/* --- 垂直会话区域 (左老板，右员工) --- */}
      <div
        ref={scrollRef}
        className="flex-1 w-full max-w-2xl overflow-y-auto px-4 py-10 space-y-12 no-scrollbar scroll-smooth"
      >
        {/* 1. 老板找茬 (居左) */}
        <AnimatePresence>
          {[
            "loop",
            "casting",
            "result_display",
            "player_atk",
            "boss_satisfied",
          ].includes(turnState) && (
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex justify-start"
            >
              <div
                className={`p-6 rounded-3xl rounded-tl-none max-w-sm border-4 transition-all duration-300 bg-white text-black shadow-[0_0_30px_rgba(239,68,68,0.3)] ${
                  isBossAngry
                    ? "shake-crazy border-red-500"
                    : "border-transparent"
                }`}
              >
                <div className="flex items-center gap-2 font-bold mb-2 pb-2 border-b border-slate-100 text-red-500 text-[10px] uppercase tracking-widest">
                  <MessageSquareWarning size={14} /> Boss Incoming
                </div>
                <div className="text-xl font-black leading-snug">
                  “{bossSkill.attackText}”
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 2. 玩家反击 (居右) */}
        <AnimatePresence>
          {["result_display", "player_atk", "boss_satisfied"].includes(
            turnState
          ) && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex justify-end"
            >
              <div className="p-6 rounded-3xl rounded-tr-none max-w-sm border-4 border-blue-400 bg-blue-600 text-white shadow-[0_0_40px_rgba(59,130,246,0.5)]">
                <div className="flex items-center gap-2 text-[10px] font-black mb-3 opacity-70 uppercase tracking-[0.2em]">
                  <MessageCircle size={14} /> 打工人
                </div>
                {empSkill.resultType === "text" ? (
                  <div className="text-lg font-bold italic leading-relaxed">
                    "{empSkill.resultContent}"
                  </div>
                ) : (
                  <div className="flex items-center gap-4 bg-white/10 p-4 rounded-xl border border-white/20">
                    <div className="p-2 bg-white/10 rounded-lg">
                      <empSkill.icon size={28} />
                    </div>
                    <div>
                      <div className="font-black text-sm">
                        {empSkill.resultTitle}
                      </div>
                      {/* 已找回 resultDesc */}
                      {empSkill.resultDesc && (
                        <div className="text-[10px] opacity-60 font-mono mt-0.5">
                          {empSkill.resultDesc}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 3. 老板满意 (居左) */}
        <AnimatePresence>
          {turnState === "boss_satisfied" && (
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex justify-start"
            >
              <div className="p-6 rounded-3xl rounded-tl-none max-w-sm border-4 border-green-500 bg-green-50 text-green-900 shadow-[0_0_40px_rgba(34,197,94,0.3)]">
                <div className="flex items-center gap-2 font-bold mb-2 pb-2 border-b border-green-200 text-green-600 text-[10px] uppercase tracking-widest">
                  <CheckCircle2 size={14} /> Boss Satisfied
                </div>
                <div className="text-lg font-black leading-snug">
                  “{bossSkill.satisfiedText}”
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 4. 系统学习卡片 (居中) */}
        <AnimatePresence>
          {turnState === "boss_satisfied" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col items-center gap-6 py-8"
            >
              <div className="flex items-center gap-2 px-4 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] text-slate-400 font-mono tracking-widest uppercase">
                <Info size={12} /> System: Mission Accomplished
              </div>
              <div className="w-full max-w-sm bg-slate-900/90 border border-white/10 p-8 rounded-3xl backdrop-blur-xl shadow-2xl text-center space-y-5">
                <Trophy
                  size={48}
                  className="mx-auto text-yellow-500 drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]"
                />
                <h4 className="text-2xl font-black italic pixel-zh-title">
                  战斗大胜利!
                </h4>
                <p className="text-sm text-slate-400 px-4">
                  刚才化解危机的核心能力是 <b>{empSkill.techTitle}</b>。
                </p>
                <button
                  onClick={handleLearnMore}
                  className="w-full bg-green-600 hover:bg-green-500 text-white py-4 rounded-2xl font-black text-base flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg"
                >
                  🚀 去学习该 AI 技能 <ExternalLink size={18} />
                </button>
                <button
                  onClick={onBack}
                  className="w-full text-slate-500 hover:text-white text-xs font-bold underline transition-colors"
                >
                  返回首页，挑战下一关
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 底部按钮 */}
      <div className="w-full max-w-4xl h-36 bg-slate-900/90 rounded-3xl border-4 border-slate-700 backdrop-blur-xl flex items-center justify-center p-6 shadow-2xl">
        <motion.button
          onClick={handleStartCast}
          disabled={turnState !== "loop"}
          className={`px-16 py-5 rounded-2xl font-black text-2xl flex items-center gap-5 border-b-8 transition-all active:translate-y-2 active:border-b-0
            ${
              turnState === "loop"
                ? "bg-blue-600 border-blue-800 text-white shadow-[0_10px_20px_rgba(59,130,246,0.3)]"
                : "bg-slate-800 border-slate-950 text-slate-600 grayscale cursor-not-allowed"
            }
          `}
        >
          <empSkill.icon size={28} /> {empSkill.name.split("·")[1]}
        </motion.button>
      </div>

      {/* 演示窗口 */}
      <AnimatePresence>
        {turnState === "casting" && (
          <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-md px-6">
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-xl bg-slate-900 border-2 border-slate-700 rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.8)] overflow-hidden font-mono"
            >
              <div className="bg-slate-800 px-5 py-3 flex items-center justify-between border-b border-slate-700">
                <div className="flex gap-2">
                  <div className="w-3.5 h-3.5 rounded-full bg-red-500 shadow-inner" />
                  <div className="w-3.5 h-3.5 rounded-full bg-yellow-500 shadow-inner" />
                  <div className="w-3.5 h-3.5 rounded-full bg-green-500 shadow-inner" />
                </div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  {empSkill.techTitle} Core Engine
                </div>
              </div>
              <div className="p-8">
                <div className="text-[10px] text-yellow-500 mb-4 font-black uppercase opacity-70 tracking-widest">
                  Executing Prompt...
                </div>
                <div className="text-xl text-green-400 min-h-[100px] font-bold leading-relaxed typing-cursor">
                  {typingText}
                </div>
                {isTypingDone && (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={handleFireSkill}
                    className="mt-8 w-full py-5 bg-green-600 text-white font-black text-lg rounded-2xl flex items-center justify-center gap-3 hover:bg-green-500 active:scale-95 transition-all shadow-lg"
                  >
                    <Send size={22} /> {empSkill.actionBtn}
                  </motion.button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ================= 4. 选择卡片组件 (已修正 BOSS 描述渲染) =================
function SelectCard({
  role,
  title,
  skills,
  selectedIds,
  onToggle,
  theme,
  isLocked,
}) {
  const c =
    theme === "red"
      ? {
          bg: "from-red-950/40",
          border: "border-red-500/30",
          active:
            "border-red-500 bg-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.2)]",
        }
      : {
          bg: "from-blue-950/40",
          border: "border-blue-500/30",
          active:
            "border-blue-500 bg-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.2)]",
        };

  return (
    <div
      className={`flex-1 bg-gradient-to-br ${c.bg} to-slate-950 border-2 ${c.border} rounded-3xl p-6 flex flex-col gap-5 backdrop-blur-sm overflow-hidden`}
    >
      <h3
        className={`text-4xl font-black text-center mb-2 ${
          theme === "red" ? "text-red-400" : "text-blue-400"
        }`}
      >
        {title}
      </h3>
      {isLocked ? (
        <div className="flex-1 flex flex-col items-center justify-center opacity-20 grayscale scale-110">
          <Lock size={64} />
          <p className="mt-6 text-lg font-black tracking-widest text-white uppercase">
            Locked
          </p>
        </div>
      ) : (
        <div className="flex-1 space-y-4 overflow-y-auto pr-2 no-scrollbar">
          {skills.map((s) => (
            <div
              key={s.id}
              onClick={() => onToggle(role, s.id)}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-5
                ${
                  selectedIds.includes(s.id)
                    ? c.active
                    : "border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/20"
                }
              `}
            >
              <div
                className={`p-3 rounded-xl ${
                  selectedIds.includes(s.id) ? "bg-white/10" : "bg-black/20"
                }`}
              >
                <s.icon size={28} />
              </div>
              <div className="flex-1">
                <div className="font-black text-lg">{s.name}</div>
                {/* 渲染 desc 字段 */}
                {s.desc && (
                  <div className="text-xs opacity-50 leading-snug mt-1 font-medium italic">
                    {s.desc}
                  </div>
                )}
              </div>
              {selectedIds.includes(s.id) && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={`w-3 h-3 rounded-full ${
                    theme === "red" ? "bg-red-500" : "bg-blue-500"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
