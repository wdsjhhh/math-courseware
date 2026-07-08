import { useState, useMemo } from 'react';
import { Shapes, Eye, EyeOff, RotateCw, AlertTriangle, ChevronRight, ChevronLeft, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { addWrongQuestion } from '@/lib/storage';

interface Module2Props {
  replayKey: number;
}

// 易错点数据
const errorPoints = [
  {
    id: 'e1',
    myth: '任意两条线的夹角都是二面角的平面角',
    truth: '平面角的两边必须都垂直于棱，且在两个半平面内',
    icon: '❌',
    correctIcon: '✅',
  },
  {
    id: 'e2',
    myth: '平面角的顶点必须取在棱的中点',
    truth: '顶点可以在棱上任意位置，平面角大小与顶点位置无关',
    icon: '❌',
    correctIcon: '✅',
  },
];

// 正方体例题步骤
const cubeSteps = [
  { text: '已知：正方体 ABCD-A₁B₁C₁D₁', highlight: 'cube' },
  { text: '找棱：取 BC 为二面角的棱', highlight: 'edge' },
  { text: '在面 ABCD 内作 AB⊥BC 于 B', highlight: 'line1' },
  { text: '在面 B₁BCC₁ 内作 B₁B⊥BC 于 B', highlight: 'line2' },
  { text: '∠ABB₁ 就是二面角 A-BC-A₁ 的平面角', highlight: 'angle' },
  { text: '正方体中 AB = BB₁，且 AB⊥BB₁，故 ∠ABB₁ = 90°', highlight: 'result' },
];

export default function Module2({ replayKey }: Module2Props) {
  // 二面角模型
  const [angle, setAngle] = useState(60);
  const [viewMode, setViewMode] = useState<'horizontal' | 'vertical'>('horizontal');
  const [showNotation, setShowNotation] = useState(0); // 0=不显示,1=α-l-β,2=α-AB-β,3=P-l-Q

  // 平面角分步引导
  const [planeStep, setPlaneStep] = useState(0); // 0-3
  const [vertexPos, setVertexPos] = useState(50); // 顶点在棱上的位置 0-100

  // 教室互动题
  const [classroomAnswer, setClassroomAnswer] = useState({ edge: '', degree: '' });
  const [classroomSubmitted, setClassroomSubmitted] = useState(false);

  // 正方体例题步骤
  const [cubeStep, setCubeStep] = useState(0);

  // 易错点翻转
  const [flippedErrors, setFlippedErrors] = useState<string[]>([]);

  const angleType = useMemo(() => {
    if (angle === 0) return { label: '零角', color: 'text-muted-foreground', bg: 'bg-muted' };
    if (angle < 90) return { label: '锐角二面角', color: 'text-success', bg: 'bg-success/10' };
    if (angle === 90) return { label: '直二面角', color: 'text-primary', bg: 'bg-primary/10' };
    if (angle < 180) return { label: '钝角二面角', color: 'text-warning', bg: 'bg-warning/10' };
    return { label: '平角', color: 'text-destructive', bg: 'bg-destructive/10' };
  }, [angle]);

  const notationLabels = ['不显示', 'α-l-β', 'α-AB-β', 'P-l-Q'];

  const toggleErrorFlip = (id: string) => {
    setFlippedErrors((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleClassroomSubmit = () => {
    setClassroomSubmitted(true);
    const edgeCorrect = classroomAnswer.edge.includes('墙角') || classroomAnswer.edge.includes('交线') || classroomAnswer.edge.includes('棱');
    const degreeCorrect = classroomAnswer.degree === '90' || classroomAnswer.degree === '90°';
    if (edgeCorrect && degreeCorrect) {
      toast.success('回答正确！教室墙面与地面形成直二面角');
    } else {
      toast.error('再想想看，墙面和地面是什么关系？');
      addWrongQuestion({
        id: `wrong_classroom_${Date.now()}`,
        moduleId: 'module2',
        questionId: 'classroom-interactive',
        userAnswer: `棱:${classroomAnswer.edge}, 角度:${classroomAnswer.degree}`,
        correctAnswer: '棱是墙角线，角度是90°（直二面角）',
        timestamp: Date.now(),
      });
    }
  };

  const planeSteps = [
    { title: '一作', desc: '在棱 l 上任取一点 O，在两个半平面内分别作垂直于棱的射线 OA、OB', icon: '✏️' },
    { title: '二证', desc: '证明 ∠AOB 的两边都垂直于棱 l，且在两个半平面内', icon: '📝' },
    { title: '三求', desc: '计算 ∠AOB 的大小，即为二面角的平面角', icon: '🔢' },
  ];

  return (
    <div id="module2" className="scroll-mt-20 space-y-10">
      {/* 模块标题 */}
      <div className="text-center mb-8">
        <span className="inline-block px-4 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full mb-3">
          模块 2
        </span>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">新知1 · 二面角核心概念</h2>
        <p className="text-muted-foreground">理解二面角定义与平面角作法</p>
      </div>

      {/* 1. 二面角定义交互模型 */}
      <section className="bg-card rounded-2xl border border-border p-6 md:p-8">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
            1
          </div>
          <h3 className="text-lg font-semibold">二面角定义交互模型</h3>
        </div>

        {/* 模型展示区 */}
        <div className="bg-gradient-to-br from-muted/30 to-background rounded-xl p-6 mb-6 relative overflow-hidden min-h-[280px] flex items-center justify-center">
          {/* SVG 二面角模型 */}
          <svg viewBox="0 0 400 280" className="w-full max-w-md">
            {viewMode === 'horizontal' ? (
              // 平卧式
              <g>
                {/* 棱 */}
                <line x1="50" y1="200" x2="350" y2="200" stroke="hsl(var(--foreground))" strokeWidth="2" />
                <text x="355" y="205" fill="hsl(var(--muted-foreground))" fontSize="12">棱 l</text>

                {/* 半平面 α（底部） */}
                <path
                  d={`M 50 200 L 200 200 L 280 160 L 130 160 Z`}
                  fill="hsl(var(--primary) / 0.15)"
                  stroke="hsl(var(--primary))"
                  strokeWidth="1.5"
                />
                <text x="170" y="175" fill="hsl(var(--primary))" fontSize="14" fontWeight="600">α</text>

                {/* 半平面 β（可旋转） */}
                <g style={{ transformOrigin: '200px 200px', transform: `rotate(${-angle}deg)` }}>
                  <path
                    d="M 50 200 L 200 200 L 280 160 L 130 160 Z"
                    fill="hsl(var(--warning) / 0.2)"
                    stroke="hsl(var(--warning))"
                    strokeWidth="1.5"
                  />
                  <text x="170" y="175" fill="hsl(var(--warning))" fontSize="14" fontWeight="600">β</text>
                </g>

                {/* 角度弧线 */}
                <path
                  d={`M 200 200 A 40 40 0 0 1 ${200 + 40 * Math.cos((angle * Math.PI) / 180)} ${200 - 40 * Math.sin((angle * Math.PI) / 180)}`}
                  stroke="hsl(var(--destructive))"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray="4 2"
                />
                <text
                  x={200 + 55 * Math.cos((angle * Math.PI / 2) / 180)}
                  y={200 - 55 * Math.sin((angle * Math.PI / 2) / 180)}
                  fill="hsl(var(--destructive))"
                  fontSize="13"
                  fontWeight="600"
                >
                  {angle}°
                </text>

                {/* 记法标注 */}
                {showNotation >= 1 && (
                  <text x="200" y="40" textAnchor="middle" fill="hsl(var(--primary))" fontSize="16" fontWeight="700">
                    二面角 α-l-β
                  </text>
                )}
                {showNotation >= 2 && (
                  <text x="200" y="60" textAnchor="middle" fill="hsl(var(--warning))" fontSize="14">
                    或 α-AB-β
                  </text>
                )}
                {showNotation >= 3 && (
                  <text x="200" y="80" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="13">
                    或 P-l-Q
                  </text>
                )}
              </g>
            ) : (
              // 直立式
              <g>
                {/* 棱（竖直） */}
                <line x1="200" y1="40" x2="200" y2="250" stroke="hsl(var(--foreground))" strokeWidth="2" />
                <text x="205" y="35" fill="hsl(var(--muted-foreground))" fontSize="12">棱 l</text>

                {/* 半平面 α（左） */}
                <path
                  d={`M 200 50 L 200 240 L 80 220 L 80 70 Z`}
                  fill="hsl(var(--primary) / 0.15)"
                  stroke="hsl(var(--primary))"
                  strokeWidth="1.5"
                />
                <text x="110" y="150" fill="hsl(var(--primary))" fontSize="14" fontWeight="600">α</text>

                {/* 半平面 β（可旋转） */}
                <g style={{ transformOrigin: '200px 145px', transform: `rotate(${angle}deg)` }}>
                  <path
                    d="M 200 50 L 200 240 L 320 220 L 320 70 Z"
                    fill="hsl(var(--warning) / 0.2)"
                    stroke="hsl(var(--warning))"
                    strokeWidth="1.5"
                  />
                  <text x="280" y="150" fill="hsl(var(--warning))" fontSize="14" fontWeight="600">β</text>
                </g>

                {/* 角度弧线 */}
                <circle cx="200" cy="145" r="30" fill="none" stroke="hsl(var(--destructive))" strokeWidth="2"
                  strokeDasharray="4 2"
                  style={{ strokeDashoffset: 188 - (angle / 360) * 188 }}
                />
                <text
                  x={200 + 45 * Math.cos((angle / 2 * Math.PI) / 180)}
                  y={145 + 45 * Math.sin((angle / 2 * Math.PI) / 180)}
                  fill="hsl(var(--destructive))"
                  fontSize="13"
                  fontWeight="600"
                >
                  {angle}°
                </text>

                {showNotation >= 1 && (
                  <text x="200" y="20" textAnchor="middle" fill="hsl(var(--primary))" fontSize="16" fontWeight="700">
                    二面角 α-l-β
                  </text>
                )}
              </g>
            )}
          </svg>
        </div>

        {/* 角度类型标签 */}
        <div className="flex justify-center mb-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${angleType.bg} ${angleType.color}`}>
            {angleType.label}
          </span>
        </div>

        {/* 滑块控制 */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">0°</span>
            <span className="font-bold text-foreground text-lg">{angle}°</span>
            <span className="text-muted-foreground">180°</span>
          </div>
          <input
            type="range"
            min="0"
            max="180"
            value={angle}
            onChange={(e) => setAngle(Number(e.target.value))}
            className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
          />
        </div>

        {/* 控制按钮 */}
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={() => setViewMode(viewMode === 'horizontal' ? 'vertical' : 'horizontal')}
            className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent/80 text-foreground rounded-lg text-sm transition-colors"
          >
            <RotateCw className="w-4 h-4" />
            {viewMode === 'horizontal' ? '切换直立式' : '切换平卧式'}
          </button>
          <button
            onClick={() => setShowNotation((showNotation + 1) % 4)}
            className="flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg text-sm transition-colors"
          >
            <Eye className="w-4 h-4" />
            记法：{notationLabels[showNotation]}
          </button>
        </div>
      </section>

      {/* 2. 二面角平面角核心交互 */}
      <section className="bg-card rounded-2xl border border-border p-6 md:p-8">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
            2
          </div>
          <h3 className="text-lg font-semibold">二面角的平面角</h3>
        </div>

        {/* 分步引导 */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground mb-4">点击"下一步"，学习平面角的作法：</p>
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            {planeSteps.map((step, i) => (
              <div
                key={i}
                className={`flex-shrink-0 px-4 py-3 rounded-xl text-sm transition-all ${
                  planeStep > i
                    ? 'bg-success/10 text-success border border-success/30'
                    : planeStep === i
                    ? 'bg-primary/10 text-primary border border-primary/30'
                    : 'bg-muted/50 text-muted-foreground border border-border'
                }`}
              >
                <div className="font-semibold flex items-center gap-2">
                  <span>{step.icon}</span>
                  {step.title}
                </div>
                {planeStep > i && <Check className="w-3 h-3 inline ml-1" />}
              </div>
            ))}
          </div>
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => setPlaneStep(Math.max(0, planeStep - 1))}
              disabled={planeStep === 0}
              className="flex items-center gap-1 px-3 py-1.5 bg-accent text-foreground rounded-lg text-sm disabled:opacity-50 hover:bg-accent/80 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              上一步
            </button>
            <button
              onClick={() => setPlaneStep(Math.min(3, planeStep + 1))}
              disabled={planeStep === 3}
              className="flex items-center gap-1 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-sm disabled:opacity-50 hover:bg-primary/90 transition-colors"
            >
              下一步
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 平面角 SVG 交互 */}
        <div className="bg-gradient-to-br from-muted/30 to-background rounded-xl p-6 mb-6">
          <svg viewBox="0 0 400 250" className="w-full max-w-lg mx-auto">
            {/* 棱 */}
            <line x1="30" y1="150" x2="370" y2="150" stroke="hsl(var(--foreground))" strokeWidth="2" />
            <text x="375" y="155" fill="hsl(var(--muted-foreground))" fontSize="12">棱 l</text>

            {/* 顶点 O - 可拖动位置 */}
            {(() => {
              const ox = 60 + (vertexPos / 100) * 280;
              const oy = 150;
              return (
                <g>
                  {/* 下半平面 α 内的垂线 OA */}
                  {planeStep >= 1 && (
                    <line
                      x1={ox}
                      y1={oy}
                      x2={ox - 50}
                      y2={oy + 40}
                      stroke="hsl(var(--primary))"
                      strokeWidth="2.5"
                    />
                  )}
                  {planeStep >= 1 && (
                    <text x={ox - 65} y={oy + 50} fill="hsl(var(--primary))" fontSize="13" fontWeight="600">A</text>
                  )}

                  {/* 上半平面 β 内的垂线 OB */}
                  {planeStep >= 1 && (
                    <line
                      x1={ox}
                      y1={oy}
                      x2={ox + 50}
                      y2={oy - 60}
                      stroke="hsl(var(--warning))"
                      strokeWidth="2.5"
                    />
                  )}
                  {planeStep >= 1 && (
                    <text x={ox + 55} y={oy - 55} fill="hsl(var(--warning))" fontSize="13" fontWeight="600">B</text>
                  )}

                  {/* 直角标记 */}
                  {planeStep >= 2 && (
                    <>
                      <path
                        d={`M ${ox - 10} ${oy} L ${ox - 10} ${oy + 10} L ${ox} ${oy + 10}`}
                        fill="none"
                        stroke="hsl(var(--primary))"
                        strokeWidth="1.5"
                      />
                      <path
                        d={`M ${ox} ${oy - 10} L ${ox + 10} ${oy - 10} L ${ox + 10} ${oy}`}
                        fill="none"
                        stroke="hsl(var(--warning))"
                        strokeWidth="1.5"
                      />
                    </>
                  )}

                  {/* 角度弧线 */}
                  {planeStep >= 3 && (
                    <path
                      d={`M ${ox - 30} ${oy + 24} A 40 40 0 0 1 ${ox + 30} ${oy - 36}`}
                      stroke="hsl(var(--destructive))"
                      strokeWidth="2"
                      fill="none"
                      strokeDasharray="3 2"
                    />
                  )}
                  {planeStep >= 3 && (
                    <text x={ox + 40} y={oy - 10} fill="hsl(var(--destructive))" fontSize="13" fontWeight="600">
                      θ
                    </text>
                  )}

                  {/* 顶点 O - 可拖动 */}
                  <circle
                    cx={ox}
                    cy={oy}
                    r="7"
                    fill="hsl(var(--destructive))"
                    className="cursor-ew-resize"
                  />
                  <text x={ox + 10} y={oy + 4} fill="hsl(var(--destructive))" fontSize="13" fontWeight="700">O</text>
                </g>
              );
            })()}
          </svg>

          {/* 顶点位置滑块 */}
          <div className="mt-4 max-w-md mx-auto">
            <p className="text-xs text-muted-foreground mb-2 text-center">
              拖动滑块，观察顶点在棱上移动时，平面角大小不变
            </p>
            <input
              type="range"
              min="10"
              max="90"
              value={vertexPos}
              onChange={(e) => setVertexPos(Number(e.target.value))}
              className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer accent-destructive"
            />
          </div>
        </div>

        {/* 结论卡片 */}
        {planeStep >= 3 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-primary/5 border border-primary/20 rounded-xl"
          >
            <p className="text-sm text-foreground">
              <span className="font-semibold text-primary">重要结论：</span>
              二面角的平面角大小与顶点在棱上的位置无关，只与二面角的张角大小有关。
              这就是我们可以用平面角来度量二面角的原因！
            </p>
          </motion.div>
        )}
      </section>

      {/* 3. 教室实景互动题 */}
      <section className="bg-card rounded-2xl border border-border p-6 md:p-8">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
            3
          </div>
          <h3 className="text-lg font-semibold">实景互动：教室中的二面角</h3>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* 示意图 */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl p-6 flex items-center justify-center min-h-[200px]">
            <svg viewBox="0 0 200 200" className="w-full max-w-[200px]">
              {/* 地面 */}
              <polygon points="20,140 180,140 160,170 40,170" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="1.5" />
              {/* 后墙 */}
              <polygon points="20,40 180,40 180,140 20,140" fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="1.5" />
              {/* 右墙 */}
              <polygon points="180,40 160,50 160,170 180,140" fill="hsl(var(--accent))" stroke="hsl(var(--border))" strokeWidth="1.5" />
              {/* 墙角棱高亮 */}
              <line x1="180" y1="40" x2="180" y2="140" stroke="hsl(var(--primary))" strokeWidth="3" strokeDasharray="4 2" />
              {/* 标注 */}
              <text x="185" y="95" fill="hsl(var(--primary))" fontSize="11" fontWeight="600">棱</text>
              <text x="80" y="100" fill="hsl(var(--muted-foreground))" fontSize="11">墙面</text>
              <text x="90" y="160" fill="hsl(var(--muted-foreground))" fontSize="11">地面</text>
            </svg>
          </div>

          {/* 答题区 */}
          <div className="space-y-4">
            <p className="text-sm text-foreground">
              观察教室示意图，回答：
            </p>
            <div>
              <label className="text-sm text-muted-foreground block mb-1.5">
                墙面与地面形成的二面角，棱在哪里？
              </label>
              <input
                type="text"
                value={classroomAnswer.edge}
                onChange={(e) => setClassroomAnswer({ ...classroomAnswer, edge: e.target.value })}
                disabled={classroomSubmitted}
                placeholder="如：墙角线 / 两面墙交线"
                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground block mb-1.5">
                这个二面角是多少度？
              </label>
              <input
                type="text"
                value={classroomAnswer.degree}
                onChange={(e) => setClassroomAnswer({ ...classroomAnswer, degree: e.target.value })}
                disabled={classroomSubmitted}
                placeholder="填入数字，如 90"
                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
              />
            </div>

            {!classroomSubmitted ? (
              <button
                onClick={handleClassroomSubmit}
                className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors text-sm"
              >
                提交答案
              </button>
            ) : (
              <div className={`p-3 rounded-lg text-sm ${
                (classroomAnswer.edge.includes('墙角') || classroomAnswer.edge.includes('交线') || classroomAnswer.edge.includes('棱')) &&
                (classroomAnswer.degree === '90' || classroomAnswer.degree === '90°')
                  ? 'bg-success/10 text-success'
                  : 'bg-destructive/10 text-destructive'
              }`}>
                <p className="font-medium mb-1">
                  {(classroomAnswer.edge.includes('墙角') || classroomAnswer.edge.includes('交线') || classroomAnswer.edge.includes('棱')) &&
                  (classroomAnswer.degree === '90' || classroomAnswer.degree === '90°')
                    ? '✅ 回答正确！'
                    : '❌ 再想想'}
                </p>
                <p className="text-xs opacity-80">
                  解析：墙面与地面的交线（墙角线）是二面角的棱，墙面垂直于地面，形成 90° 的直二面角。
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 4. 例题分层交互 - 正方体 */}
      <section className="bg-card rounded-2xl border border-border p-6 md:p-8">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
            4
          </div>
          <h3 className="text-lg font-semibold">例题：正方体中的二面角</h3>
        </div>

        <p className="text-sm text-muted-foreground mb-4">
          <strong className="text-foreground">题目：</strong>
          在正方体 ABCD-A₁B₁C₁D₁ 中，求二面角 A-BC-A₁ 的大小。
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {/* 正方体图 */}
          <div className="bg-muted/30 rounded-xl p-4 flex items-center justify-center">
            <svg viewBox="0 0 250 220" className="w-full max-w-[220px]">
              {/* 底面 ABCD */}
              <polygon points="30,150 150,150 180,180 60,180" fill="none" stroke="hsl(var(--muted-foreground))" strokeWidth="1.5" strokeDasharray="4 3" />
              {/* 顶面 A₁B₁C₁D₁ */}
              <polygon points="30,50 150,50 180,80 60,80" fill="hsl(var(--primary) / 0.1)" stroke="hsl(var(--foreground))" strokeWidth="1.5" />
              {/* 四条竖棱 */}
              <line x1="30" y1="50" x2="30" y2="150" stroke="hsl(var(--foreground))" strokeWidth="1.5" />
              <line x1="150" y1="50" x2="150" y2="150" stroke="hsl(var(--foreground))" strokeWidth="1.5" />
              <line x1="180" y1="80" x2="180" y2="180" stroke="hsl(var(--muted-foreground))" strokeWidth="1.5" strokeDasharray="4 3" />
              <line x1="60" y1="80" x2="60" y2="180" stroke="hsl(var(--muted-foreground))" strokeWidth="1.5" strokeDasharray="4 3" />
              {/* 前面 ABB₁A₁ */}
              <polygon points="30,50 150,50 150,150 30,150" fill="hsl(var(--warning) / 0.1)" stroke="hsl(var(--foreground))" strokeWidth="1.5" />

              {/* 高亮棱 BC */}
              {cubeStep >= 1 && (
                <line x1="150" y1="150" x2="180" y2="180" stroke="hsl(var(--destructive))" strokeWidth="3" />
              )}

              {/* AB ⊥ BC */}
              {cubeStep >= 2 && (
                <line x1="30" y1="150" x2="150" y2="150" stroke="hsl(var(--primary))" strokeWidth="2.5" />
              )}

              {/* B₁B ⊥ BC */}
              {cubeStep >= 3 && (
                <line x1="150" y1="50" x2="150" y2="150" stroke="hsl(var(--warning))" strokeWidth="2.5" />
              )}

              {/* 角度标注 */}
              {cubeStep >= 4 && (
                <>
                  <path d="M 150 150 L 140 150 L 140 140 L 150 140" fill="none" stroke="hsl(var(--destructive))" strokeWidth="2" />
                  <text x="125" y="140" fill="hsl(var(--destructive))" fontSize="11" fontWeight="700">90°</text>
                </>
              )}

              {/* 顶点标注 */}
              <text x="22" y="48" fill="hsl(var(--foreground))" fontSize="11" fontWeight="600">A₁</text>
              <text x="152" y="48" fill="hsl(var(--foreground))" fontSize="11" fontWeight="600">B₁</text>
              <text x="182" y="78" fill="hsl(var(--muted-foreground))" fontSize="11">C₁</text>
              <text x="52" y="78" fill="hsl(var(--muted-foreground))" fontSize="11">D₁</text>
              <text x="22" y="165" fill="hsl(var(--foreground))" fontSize="11" fontWeight="600">A</text>
              <text x="152" y="165" fill="hsl(var(--foreground))" fontSize="11" fontWeight="600">B</text>
              <text x="182" y="195" fill="hsl(var(--muted-foreground))" fontSize="11">C</text>
              <text x="52" y="195" fill="hsl(var(--muted-foreground))" fontSize="11">D</text>
            </svg>
          </div>

          {/* 步骤区 */}
          <div className="space-y-3">
            {cubeSteps.slice(0, cubeStep + 1).map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`p-3 rounded-lg text-sm border ${
                  i === cubeStep
                    ? 'bg-primary/10 border-primary/30 text-foreground'
                    : 'bg-muted/30 border-border/50 text-muted-foreground'
                }`}
              >
                <span className="font-semibold text-primary mr-2">步骤{i + 1}：</span>
                {step.text}
              </motion.div>
            ))}

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setCubeStep(Math.max(0, cubeStep - 1))}
                disabled={cubeStep === 0}
                className="flex-1 flex items-center justify-center gap-1 py-2 bg-accent text-foreground rounded-lg text-sm disabled:opacity-50 hover:bg-accent/80 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                上一步
              </button>
              <button
                onClick={() => setCubeStep(Math.min(cubeSteps.length - 1, cubeStep + 1))}
                disabled={cubeStep === cubeSteps.length - 1}
                className="flex-1 flex items-center justify-center gap-1 py-2 bg-primary text-primary-foreground rounded-lg text-sm disabled:opacity-50 hover:bg-primary/90 transition-colors"
              >
                下一步
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. 易错点弹窗 */}
      <section className="bg-card rounded-2xl border border-border p-6 md:p-8">
        <div className="flex items-center gap-2 mb-6">
          <AlertTriangle className="w-5 h-5 text-warning" />
          <h3 className="text-lg font-semibold">易错点辨析</h3>
        </div>

        <p className="text-sm text-muted-foreground mb-4">点击卡片翻转，看看这些常见误区你中招了吗？</p>

        <div className="grid md:grid-cols-2 gap-4">
          {errorPoints.map((err) => {
            const isFlipped = flippedErrors.includes(err.id);
            return (
              <motion.button
                key={err.id}
                onClick={() => toggleErrorFlip(err.id)}
                className="relative h-36 text-left perspective-1000"
                style={{ perspective: '1000px' }}
              >
                <AnimatePresence mode="wait">
                  {!isFlipped ? (
                    <motion.div
                      key="front"
                      initial={{ rotateY: 90, opacity: 0 }}
                      animate={{ rotateY: 0, opacity: 1 }}
                      exit={{ rotateY: -90, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0 p-4 bg-destructive/10 border border-destructive/30 rounded-xl flex flex-col justify-center"
                    >
                      <div className="text-2xl mb-2">{err.icon}</div>
                      <p className="text-sm font-medium text-destructive">{err.myth}</p>
                      <p className="text-xs text-muted-foreground mt-2">点击翻转查看正确说法 →</p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="back"
                      initial={{ rotateY: -90, opacity: 0 }}
                      animate={{ rotateY: 0, opacity: 1 }}
                      exit={{ rotateY: 90, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0 p-4 bg-success/10 border border-success/30 rounded-xl flex flex-col justify-center"
                    >
                      <div className="text-2xl mb-2">{err.correctIcon}</div>
                      <p className="text-sm font-medium text-success">{err.truth}</p>
                      <p className="text-xs text-muted-foreground mt-2">← 再看一遍误区</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
