import { useState, useEffect } from 'react';
import { Box, Play, Pause, ChevronLeft, ChevronRight, RotateCcw, BookOpen, Boxes } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Module3Props {
  replayKey: number;
}

// 三种语言
const threeLanguages = {
  text: {
    title: '文字语言',
    content: '如果一个平面经过另一个平面的一条垂线，那么这两个平面互相垂直。',
  },
  symbol: {
    title: '符号语言',
    content: 'l ⊥ α，l ⊂ β ⇒ α ⊥ β',
  },
  graphic: {
    title: '图形语言',
    content: '（见左侧示意图）',
  },
};

// 定理证明步骤
const proofSteps = [
  {
    title: '第一步：设棱',
    desc: '设 α ∩ β = l，则 l 是两个平面的交线（棱）。',
  },
  {
    title: '第二步：作垂线',
    desc: '在平面 α 内，过垂足（l 与 α 的交点 O）作直线 OA ⊥ l。',
  },
  {
    title: '第三步：证垂直',
    desc: '因为 l ⊥ α，OA ⊂ α，所以 l ⊥ OA。又 l ⊥ β 中的垂线，故 ∠AOB 是直二面角的平面角。',
  },
  {
    title: '第四步：得结论',
    desc: '二面角的平面角为 90°，所以 α ⊥ β。（直二面角 ⇒ 面面垂直）',
  },
];

// 模型库
const modelLibrary = [
  { id: 'cube', name: '正方体', icon: '🧊', desc: '6个面都是正方形，相邻面互相垂直' },
  { id: 'pyramid', name: '四棱锥', icon: '🔺', desc: '底面为四边形，侧面为三角形' },
  { id: 'cuboid', name: '长方体', icon: '📦', desc: '6个面都是矩形，相邻面垂直' },
  { id: 'tri-pyramid', name: '三棱锥', icon: '🔻', desc: '四个面都是三角形' },
  { id: 'prism', name: '直棱柱', icon: '📐', desc: '侧棱垂直于底面的棱柱' },
];

export default function Module3({ replayKey }: Module3Props) {
  // 长方体拆解模型 - 拖动进度
  const [pullProgress, setPullProgress] = useState(0);
  const [showConclusion, setShowConclusion] = useState(false);

  // 三种语言切换
  const [langMode, setLangMode] = useState<'text' | 'symbol' | 'graphic'>('text');

  // 定理证明
  const [proofStep, setProofStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // 模型库选中
  const [selectedModel, setSelectedModel] = useState('cube');

  const handlePull = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value);
    setPullProgress(v);
    if (v >= 95 && !showConclusion) {
      setShowConclusion(true);
    }
  };

  const resetModel = () => {
    setPullProgress(0);
    setShowConclusion(false);
  };

  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      return;
    }
    setIsPlaying(true);
    if (proofStep === proofSteps.length - 1) {
      setProofStep(0);
    }
  };

  // 自动播放
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setProofStep((prev) => {
        if (prev >= proofSteps.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 2000);
    return () => clearInterval(timer);
  }, [isPlaying]);

  return (
    <div id="module3" className="scroll-mt-20 space-y-10">
      {/* 模块标题 */}
      <div className="text-center mb-8">
        <span className="inline-block px-4 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full mb-3">
          模块 3
        </span>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">新知2 · 面面垂直判定定理</h2>
        <p className="text-muted-foreground">掌握面面垂直的判定方法</p>
      </div>

      {/* 1. 长方体可拆解模型 */}
      <section className="bg-card rounded-2xl border border-border p-6 md:p-8">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
            1
          </div>
          <h3 className="text-lg font-semibold">长方体拆解探究</h3>
        </div>

        <p className="text-muted-foreground text-sm mb-6">
          拖动滑块，将垂直于底面的棱向上拉出，观察竖直平面与底面的关系。
        </p>

        <div className="grid md:grid-cols-2 gap-6 items-center">
          {/* 长方体 SVG 模型 */}
          <div className="bg-gradient-to-br from-muted/30 to-background rounded-xl p-6 flex items-center justify-center min-h-[260px]">
            <svg viewBox="0 0 280 240" className="w-full max-w-[260px]">
              {/* 底面 */}
              <polygon
                points="40,160 200,160 240,200 80,200"
                fill="hsl(var(--muted) / 0.5)"
                stroke="hsl(var(--border))"
                strokeWidth="1.5"
              />

              {/* 固定的后面 */}
              <polygon
                points="40,60 200,60 200,160 40,160"
                fill="hsl(var(--primary) / 0.1)"
                stroke="hsl(var(--primary))"
                strokeWidth="1.5"
              />

              {/* 可拉出的右侧面 - 随进度上升 */}
              <g style={{ transform: `translateY(${-pullProgress * 1.2}px)`, transformOrigin: 'center' }}>
                <polygon
                  points="200,160 240,200 240,100 200,60"
                  fill="hsl(var(--warning) / 0.25)"
                  stroke="hsl(var(--warning))"
                  strokeWidth="2"
                />
              </g>

              {/* 顶面 - 随进度上升 */}
              <g style={{ transform: `translateY(${-pullProgress * 1.2}px)` }}>
                <polygon
                  points="40,60 200,60 240,100 80,100"
                  fill="hsl(var(--accent) / 0.5)"
                  stroke="hsl(var(--border))"
                  strokeWidth="1.5"
                />
              </g>

              {/* 左侧棱（固定） */}
              <line x1="40" y1="60" x2="40" y2="160" stroke="hsl(var(--foreground))" strokeWidth="1.5" />

              {/* 被拉出的棱 - 高亮 */}
              <g style={{ transform: `translateY(${-pullProgress * 1.2}px)` }}>
                <line
                  x1="200"
                  y1="60"
                  x2="200"
                  y2="160"
                  stroke="hsl(var(--destructive))"
                  strokeWidth="3"
                  strokeDasharray="6 3"
                />
                <circle cx="200" cy="60" r="5" fill="hsl(var(--destructive))" />
              </g>

              {/* 标注 */}
              <text x="10" y="115" fill="hsl(var(--primary))" fontSize="12" fontWeight="600">α</text>
              <text
                x={250}
                y={130 - pullProgress * 0.6}
                fill="hsl(var(--warning))"
                fontSize="12"
                fontWeight="600"
              >
                β
              </text>
              <text x="205" y="115" fill="hsl(var(--destructive))" fontSize="11" fontWeight="700">l</text>
            </svg>
          </div>

          {/* 控制区 */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-muted-foreground">拉出进度</span>
                <span className="font-bold text-foreground">{pullProgress}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={pullProgress}
                onChange={handlePull}
                className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer accent-warning"
              />
            </div>

            <button
              onClick={resetModel}
              className="w-full flex items-center justify-center gap-2 py-2 bg-accent text-foreground rounded-lg text-sm hover:bg-accent/80 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              重置模型
            </button>

            <AnimatePresence>
              {showConclusion && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-success/10 border border-success/30 rounded-xl"
                >
                  <p className="font-semibold text-success mb-1">🎉 发现了吗？</p>
                  <p className="text-sm text-foreground">
                    当直线 <strong>l</strong> 垂直于平面 <strong>α</strong>，
                    且直线 <strong>l</strong> 在平面 <strong>β</strong> 内时，
                    平面 <strong>β</strong> 就垂直于平面 <strong>α</strong>！
                  </p>
                  <p className="text-sm text-primary font-medium mt-2">
                    这就是面面垂直的判定定理。
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* 2. 三种语言 + 简记口诀 */}
      <section className="bg-card rounded-2xl border border-border p-6 md:p-8">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
            2
          </div>
          <h3 className="text-lg font-semibold">判定定理的三种语言</h3>
        </div>

        {/* 切换按钮 */}
        <div className="flex gap-2 mb-6">
          {(['text', 'symbol', 'graphic'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setLangMode(mode)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                langMode === mode
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-muted/50 text-muted-foreground hover:bg-accent'
              }`}
            >
              {threeLanguages[mode].title}
            </button>
          ))}
        </div>

        {/* 内容展示 */}
        <AnimatePresence mode="wait">
          <motion.div
            key={langMode}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="p-6 bg-gradient-to-br from-primary/5 to-secondary/10 rounded-xl text-center"
          >
            <p className="text-lg md:text-xl font-medium text-foreground leading-relaxed">
              {threeLanguages[langMode].content}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* 简记口诀 */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="mt-6 p-5 bg-gradient-to-r from-primary/15 via-secondary/10 to-primary/15 rounded-xl text-center border border-primary/20"
        >
          <p className="text-xs text-muted-foreground mb-2">简记口诀</p>
          <p className="text-xl md:text-2xl font-bold text-primary tracking-wide">
            线面垂直 ⇒ 面面垂直
          </p>
        </motion.div>
      </section>

      {/* 3. 定理证明分步动画 */}
      <section className="bg-card rounded-2xl border border-border p-6 md:p-8">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
            3
          </div>
          <h3 className="text-lg font-semibold">定理证明</h3>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* 证明图示 */}
          <div className="bg-muted/30 rounded-xl p-6 flex items-center justify-center min-h-[240px]">
            <svg viewBox="0 0 240 220" className="w-full max-w-[220px]">
              {/* 平面 α */}
              <polygon
                points="20,160 180,160 220,200 60,200"
                fill="hsl(var(--primary) / 0.15)"
                stroke="hsl(var(--primary))"
                strokeWidth="1.5"
              />
              <text x="30" y="185" fill="hsl(var(--primary))" fontSize="14" fontWeight="600">α</text>

              {/* 平面 β */}
              {proofStep >= 0 && (
                <>
                  <polygon
                    points="120,40 120,160 60,200 60,80"
                    fill="hsl(var(--warning) / 0.2)"
                    stroke="hsl(var(--warning))"
                    strokeWidth="1.5"
                  />
                  <text x="65" y="100" fill="hsl(var(--warning))" fontSize="14" fontWeight="600">β</text>
                </>
              )}

              {/* 棱 l */}
              {proofStep >= 0 && (
                <>
                  <line x1="60" y1="200" x2="120" y2="160" stroke="hsl(var(--destructive))" strokeWidth="2.5" strokeDasharray="5 3" />
                  <text x="85" y="190" fill="hsl(var(--destructive))" fontSize="12" fontWeight="700">l</text>
                </>
              )}

              {/* 垂足 O */}
              {proofStep >= 1 && (
                <>
                  <circle cx="90" cy="180" r="4" fill="hsl(var(--destructive))" />
                  <text x="95" y="178" fill="hsl(var(--destructive))" fontSize="11" fontWeight="700">O</text>
                </>
              )}

              {/* OA ⊥ l */}
              {proofStep >= 2 && (
                <>
                  <line x1="90" y1="180" x2="160" y2="175" stroke="hsl(var(--success))" strokeWidth="2" />
                  <text x="155" y="170" fill="hsl(var(--success))" fontSize="12" fontWeight="600">A</text>
                  {/* 直角标记 */}
                  <path d="M 95 178 L 97 174 L 101 176" fill="none" stroke="hsl(var(--success))" strokeWidth="1.5" />
                </>
              )}

              {/* 结论标注 */}
              {proofStep >= 3 && (
                <text x="120" y="30" textAnchor="middle" fill="hsl(var(--primary))" fontSize="14" fontWeight="700">
                  α ⊥ β ✓
                </text>
              )}
            </svg>
          </div>

          {/* 证明步骤 */}
          <div className="space-y-3">
            {proofSteps.map((step, i) => (
              <motion.div
                key={i}
                initial={false}
                animate={{
                  opacity: i <= proofStep ? 1 : 0.4,
                  x: i <= proofStep ? 0 : -10,
                }}
                className={`p-3 rounded-lg text-sm border transition-all ${
                  i === proofStep
                    ? 'bg-primary/10 border-primary/30 text-foreground'
                    : i < proofStep
                    ? 'bg-success/5 border-success/20 text-foreground'
                    : 'bg-muted/30 border-border/50 text-muted-foreground'
                }`}
              >
                <p className="font-semibold text-primary mb-0.5">{step.title}</p>
                <p className="text-sm">{step.desc}</p>
              </motion.div>
            ))}

            {/* 控制按钮 */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  setProofStep(Math.max(0, proofStep - 1));
                  setIsPlaying(false);
                }}
                disabled={proofStep === 0}
                className="flex items-center justify-center gap-1 px-3 py-2 bg-accent text-foreground rounded-lg text-sm disabled:opacity-50 hover:bg-accent/80 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                上一步
              </button>
              <button
                onClick={togglePlay}
                className="flex-1 flex items-center justify-center gap-2 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90 transition-colors"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isPlaying ? '暂停' : proofStep === proofSteps.length - 1 ? '重新播放' : '自动播放'}
              </button>
              <button
                onClick={() => {
                  setProofStep(Math.min(proofSteps.length - 1, proofStep + 1));
                  setIsPlaying(false);
                }}
                disabled={proofStep === proofSteps.length - 1}
                className="flex items-center justify-center gap-1 px-3 py-2 bg-accent text-foreground rounded-lg text-sm disabled:opacity-50 hover:bg-accent/80 transition-colors"
              >
                下一步
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. 模型库工具箱 */}
      <section className="bg-card rounded-2xl border border-border p-6 md:p-8">
        <div className="flex items-center gap-2 mb-6">
          <Boxes className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">模型库工具箱</h3>
        </div>

        <p className="text-muted-foreground text-sm mb-4">
          点击下方模型，观察常见几何体中的垂直关系。
        </p>

        {/* 模型选择 */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {modelLibrary.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedModel(m.id)}
              className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm transition-all ${
                selectedModel === m.id
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-muted/50 text-foreground hover:bg-accent border border-border/50'
              }`}
            >
              <span className="text-lg">{m.icon}</span>
              <span className="font-medium">{m.name}</span>
            </button>
          ))}
        </div>

        {/* 模型展示 */}
        <div className="bg-gradient-to-br from-muted/30 to-background rounded-xl p-6 flex items-center justify-center min-h-[240px]">
          <div className="text-center">
            <div className="text-7xl mb-4">
              {modelLibrary.find((m) => m.id === selectedModel)?.icon}
            </div>
            <h4 className="text-lg font-semibold text-foreground mb-2">
              {modelLibrary.find((m) => m.id === selectedModel)?.name}
            </h4>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto">
              {modelLibrary.find((m) => m.id === selectedModel)?.desc}
            </p>
            <div className="mt-4 flex flex-wrap gap-2 justify-center">
              <span className="px-2.5 py-1 bg-primary/10 text-primary text-xs rounded-md">
                相邻面垂直
              </span>
              <span className="px-2.5 py-1 bg-warning/10 text-warning text-xs rounded-md">
                棱与面垂直
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
