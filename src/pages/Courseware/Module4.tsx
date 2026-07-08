import { useState } from 'react';
import { ListChecks, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Move, Lightbulb, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Module4Props {
  replayKey: number;
}

// 三步记忆卡数据
const threeSteps = [
  {
    id: 1,
    title: '一作',
    subtitle: '找棱作垂线',
    detail: '在二面角的棱上任取一点，在两个半平面内分别作垂直于棱的射线。',
    color: 'from-blue-500 to-cyan-500',
    bgLight: 'bg-blue-50 dark:bg-blue-950/30',
    icon: '✏️',
    keyPoint: '关键：两边都要垂直于棱',
  },
  {
    id: 2,
    title: '二证',
    subtitle: '证明是平面角',
    detail: '证明所作的角满足：①顶点在棱上；②两边分别在两个半平面内；③两边都垂直于棱。',
    color: 'from-emerald-500 to-teal-500',
    bgLight: 'bg-emerald-50 dark:bg-emerald-950/30',
    icon: '📝',
    keyPoint: '关键：满足平面角的三要素',
  },
  {
    id: 3,
    title: '三求',
    subtitle: '计算角度大小',
    detail: '利用三角形的边角关系（勾股定理、三角函数、余弦定理等）计算平面角的大小。',
    color: 'from-orange-500 to-amber-500',
    bgLight: 'bg-orange-50 dark:bg-orange-950/30',
    icon: '🔢',
    keyPoint: '关键：构造可解的三角形',
  },
];

// 流程图节点
const flowNodes = [
  { id: 'find', title: '找垂线', detail: '在一个平面内寻找垂直于另一个平面的直线', expanded: false },
  { id: 'prove', title: '证线面垂直', detail: '证明这条直线垂直于另一个平面内的两条相交直线', expanded: false },
  { id: 'conclude', title: '得面面垂直', detail: '根据判定定理，得出两个平面互相垂直的结论', expanded: false },
];

// 思维导图节点
const mindMapNodes = [
  { id: 'center', label: '面面垂直', x: 50, y: 50, level: 0 },
  { id: 'def', label: '二面角定义', x: 20, y: 25, level: 1 },
  { id: 'plane', label: '平面角', x: 20, y: 50, level: 1 },
  { id: 'right', label: '直二面角', x: 20, y: 75, level: 1 },
  { id: 'theorem', label: '判定定理', x: 80, y: 35, level: 1 },
  { id: 'apply', label: '解题应用', x: 80, y: 65, level: 1 },
  { id: 'def1', label: '从一条直线出发', x: 5, y: 15, level: 2 },
  { id: 'def2', label: '两个半平面', x: 5, y: 35, level: 2 },
  { id: 'plane1', label: '顶点在棱上', x: 5, y: 45, level: 2 },
  { id: 'plane2', label: '两边垂直于棱', x: 5, y: 55, level: 2 },
  { id: 'theorem1', label: '线面垂直→面面垂直', x: 95, y: 25, level: 2 },
  { id: 'apply1', label: '三步法：作-证-求', x: 95, y: 55, level: 2 },
];

export default function Module4({ replayKey }: Module4Props) {
  // 三步卡当前索引
  const [currentStep, setCurrentStep] = useState(0);

  // 流程图展开状态
  const [expandedNodes, setExpandedNodes] = useState<string[]>([]);

  // 思维导图缩放
  const [zoom, setZoom] = useState(1);
  const [mindOffset, setMindOffset] = useState({ x: 0, y: 0 });

  const toggleNode = (id: string) => {
    setExpandedNodes((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const nextStep = () => setCurrentStep((prev) => Math.min(2, prev + 1));
  const prevStep = () => setCurrentStep((prev) => Math.max(0, prev - 1));

  return (
    <div id="module4" className="scroll-mt-20 space-y-10">
      {/* 模块标题 */}
      <div className="text-center mb-8">
        <span className="inline-block px-4 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full mb-3">
          模块 4
        </span>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">方法总结·解题模板</h2>
        <p className="text-muted-foreground">系统化梳理解题方法</p>
      </div>

      {/* 1. 二面角求解三步记忆卡 */}
      <section className="bg-card rounded-2xl border border-border p-6 md:p-8">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
            1
          </div>
          <h3 className="text-lg font-semibold">二面角求解三步法</h3>
        </div>

        <p className="text-muted-foreground text-sm mb-6">
          左右滑动卡片，记忆二面角求解的三个步骤。
        </p>

        {/* 卡片展示区 */}
        <div className="relative max-w-md mx-auto mb-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 50, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -50, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className={`${threeSteps[currentStep].bgLight} rounded-2xl p-8 border border-border/50`}
            >
              <div className="text-center">
                <div className="text-5xl mb-4">{threeSteps[currentStep].icon}</div>
                <h4 className={`text-3xl font-bold bg-gradient-to-r ${threeSteps[currentStep].color} bg-clip-text text-transparent mb-2`}>
                  {threeSteps[currentStep].title}
                </h4>
                <p className="text-foreground font-medium mb-4">{threeSteps[currentStep].subtitle}</p>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {threeSteps[currentStep].detail}
                </p>
                <div className="inline-block px-3 py-1.5 bg-background/80 rounded-lg text-xs font-medium text-foreground">
                  💡 {threeSteps[currentStep].keyPoint}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* 左右切换按钮 */}
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 w-10 h-10 rounded-full bg-card border border-border shadow-md flex items-center justify-center text-foreground disabled:opacity-40 hover:bg-accent transition-all z-10"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextStep}
            disabled={currentStep === 2}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 w-10 h-10 rounded-full bg-card border border-border shadow-md flex items-center justify-center text-foreground disabled:opacity-40 hover:bg-accent transition-all z-10"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* 进度指示器 */}
        <div className="flex justify-center gap-2 mb-4">
          {threeSteps.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentStep(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                i === currentStep ? 'bg-primary w-8' : 'bg-muted hover:bg-muted-foreground/30'
              }`}
            />
          ))}
        </div>

        {/* 三步总览 */}
        <div className="hidden md:flex items-center justify-center gap-4 mt-6">
          {threeSteps.map((step, i) => (
            <div key={step.id} className="flex items-center gap-4">
              <div
                className={`w-16 h-16 rounded-xl ${step.bgLight} flex items-center justify-center text-2xl border border-border/50`}
              >
                {step.icon}
              </div>
              <div>
                <p className="font-bold text-foreground">{step.title}</p>
                <p className="text-xs text-muted-foreground">{step.subtitle}</p>
              </div>
              {i < 2 && <ArrowRight className="w-5 h-5 text-muted-foreground mx-2" />}
            </div>
          ))}
        </div>
      </section>

      {/* 2. 面面垂直证明流程图 */}
      <section className="bg-card rounded-2xl border border-border p-6 md:p-8">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
            2
          </div>
          <h3 className="text-lg font-semibold">面面垂直证明流程</h3>
        </div>

        <p className="text-muted-foreground text-sm mb-6">
          点击每个节点，展开查看详细说明。
        </p>

        <div className="max-w-xl mx-auto space-y-3">
          {flowNodes.map((node, i) => {
            const isExpanded = expandedNodes.includes(node.id);
            return (
              <div key={node.id} className="relative">
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => toggleNode(node.id)}
                  className={`w-full p-4 rounded-xl text-left transition-all border ${
                    isExpanded
                      ? 'bg-primary/10 border-primary/30'
                      : 'bg-muted/30 border-border/50 hover:bg-accent/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${
                      i === 0 ? 'from-blue-500 to-cyan-500' :
                      i === 1 ? 'from-emerald-500 to-teal-500' :
                      'from-orange-500 to-amber-500'
                    } text-white flex items-center justify-center font-bold text-sm shrink-0`}>
                      {i + 1}
                    </div>
                    <span className="font-semibold text-foreground flex-1">{node.title}</span>
                    <ChevronRight
                      className={`w-5 h-5 text-muted-foreground transition-transform ${
                        isExpanded ? 'rotate-90' : ''
                      }`}
                    />
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-3 mt-3 border-t border-border/50 text-sm text-muted-foreground">
                          {node.detail}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>

                {/* 连接线 */}
                {i < flowNodes.length - 1 && (
                  <div className="flex justify-center py-1">
                    <div className="w-0.5 h-4 bg-border" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-6 p-4 bg-warning/10 border border-warning/30 rounded-xl flex items-start gap-3">
          <Lightbulb className="w-5 h-5 text-warning shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-foreground text-sm">解题口诀</p>
            <p className="text-sm text-muted-foreground mt-1">
              要证面面垂直，先找线面垂直。<br />
              线在一面内，垂直另一面。<br />
              判定定理用，结论自然来。
            </p>
          </div>
        </div>
      </section>

      {/* 3. 可缩放思维导图 */}
      <section className="bg-card rounded-2xl border border-border p-6 md:p-8">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
            3
          </div>
          <h3 className="text-lg font-semibold">知识思维导图</h3>
          <div className="ml-auto flex items-center gap-1">
            <button
              onClick={() => setZoom((z) => Math.max(0.6, z - 0.2))}
              className="p-1.5 rounded-lg bg-accent hover:bg-accent/80 text-foreground transition-colors"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs text-muted-foreground w-12 text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom((z) => Math.min(1.5, z + 0.2))}
              className="p-1.5 rounded-lg bg-accent hover:bg-accent/80 text-foreground transition-colors"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="bg-gradient-to-br from-muted/30 to-background rounded-xl overflow-hidden" style={{ height: '360px' }}>
          <div
            className="w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing"
            style={{
              transform: `scale(${zoom}) translate(${mindOffset.x}px, ${mindOffset.y}px)`,
              transition: 'transform 0.1s ease-out',
            }}
          >
            <svg viewBox="0 0 400 300" className="w-full max-w-lg">
              {/* 连接线 */}
              {/* 中心到一级节点 */}
              <line x1="200" y1="150" x2="80" y2="75" stroke="hsl(var(--border))" strokeWidth="1.5" />
              <line x1="200" y1="150" x2="80" y2="150" stroke="hsl(var(--border))" strokeWidth="1.5" />
              <line x1="200" y1="150" x2="80" y2="225" stroke="hsl(var(--border))" strokeWidth="1.5" />
              <line x1="200" y1="150" x2="320" y2="105" stroke="hsl(var(--border))" strokeWidth="1.5" />
              <line x1="200" y1="150" x2="320" y2="195" stroke="hsl(var(--border))" strokeWidth="1.5" />

              {/* 一级到二级 */}
              <line x1="80" y1="75" x2="20" y2="45" stroke="hsl(var(--border))" strokeWidth="1" strokeDasharray="3 2" />
              <line x1="80" y1="75" x2="20" y2="105" stroke="hsl(var(--border))" strokeWidth="1" strokeDasharray="3 2" />
              <line x1="80" y1="150" x2="20" y2="135" stroke="hsl(var(--border))" strokeWidth="1" strokeDasharray="3 2" />
              <line x1="80" y1="150" x2="20" y2="165" stroke="hsl(var(--border))" strokeWidth="1" strokeDasharray="3 2" />
              <line x1="320" y1="105" x2="380" y2="75" stroke="hsl(var(--border))" strokeWidth="1" strokeDasharray="3 2" />
              <line x1="320" y1="195" x2="380" y2="165" stroke="hsl(var(--border))" strokeWidth="1" strokeDasharray="3 2" />

              {/* 中心节点 */}
              <circle cx="200" cy="150" r="40" fill="hsl(var(--primary))" />
              <text x="200" y="148" textAnchor="middle" fill="white" fontSize="14" fontWeight="700">面面垂直</text>
              <text x="200" y="165" textAnchor="middle" fill="white" fontSize="10" opacity="0.8">核心概念</text>

              {/* 一级节点 */}
              <g>
                <rect x="40" y="55" width="80" height="40" rx="8" fill="hsl(var(--card))" stroke="hsl(var(--primary))" strokeWidth="1.5" />
                <text x="80" y="80" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="11" fontWeight="600">二面角定义</text>
              </g>
              <g>
                <rect x="40" y="130" width="80" height="40" rx="8" fill="hsl(var(--card))" stroke="hsl(var(--primary))" strokeWidth="1.5" />
                <text x="80" y="155" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="11" fontWeight="600">平面角</text>
              </g>
              <g>
                <rect x="40" y="205" width="80" height="40" rx="8" fill="hsl(var(--card))" stroke="hsl(var(--warning))" strokeWidth="1.5" />
                <text x="80" y="230" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="11" fontWeight="600">直二面角</text>
              </g>
              <g>
                <rect x="280" y="85" width="80" height="40" rx="8" fill="hsl(var(--card))" stroke="hsl(var(--success))" strokeWidth="1.5" />
                <text x="320" y="110" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="11" fontWeight="600">判定定理</text>
              </g>
              <g>
                <rect x="280" y="175" width="80" height="40" rx="8" fill="hsl(var(--card))" stroke="hsl(var(--success))" strokeWidth="1.5" />
                <text x="320" y="200" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="11" fontWeight="600">解题应用</text>
              </g>

              {/* 二级节点 */}
              <g>
                <circle cx="20" cy="45" r="15" fill="hsl(var(--muted))" />
                <text x="20" y="49" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="8">直线出发</text>
              </g>
              <g>
                <circle cx="20" cy="105" r="15" fill="hsl(var(--muted))" />
                <text x="20" y="109" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="8">两半平面</text>
              </g>
              <g>
                <circle cx="20" cy="135" r="15" fill="hsl(var(--muted))" />
                <text x="20" y="139" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="8">顶点在棱</text>
              </g>
              <g>
                <circle cx="20" cy="165" r="15" fill="hsl(var(--muted))" />
                <text x="20" y="169" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="8">边垂直棱</text>
              </g>
              <g>
                <circle cx="380" cy="75" r="18" fill="hsl(var(--muted))" />
                <text x="380" y="72" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="7">线面垂直</text>
                <text x="380" y="82" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="7">面面垂直</text>
              </g>
              <g>
                <circle cx="380" cy="165" r="18" fill="hsl(var(--muted))" />
                <text x="380" y="162" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="7">作-证-求</text>
                <text x="380" y="172" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="7">三步法</text>
              </g>
            </svg>
          </div>
        </div>

        <p className="text-xs text-muted-foreground text-center mt-3 flex items-center justify-center gap-1">
          <Move className="w-3 h-3" />
          使用上方缩放按钮调整视图大小
        </p>
      </section>
    </div>
  );
}
