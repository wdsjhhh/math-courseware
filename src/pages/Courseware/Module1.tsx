import { useState, useCallback } from 'react';
import { Check, X, Lightbulb, ChevronDown, ChevronUp, BookOpenCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { addWrongQuestion } from '@/lib/storage';

// 课前小测题目
const quizQuestions = [
  {
    id: 'pre-q1',
    title: '异面直线所成角的范围是？',
    options: ['(0°, 90°]', '[0°, 90°]', '(0°, 180°)', '[0°, 180°]'],
    correct: 0,
    analysis: '异面直线所成角的范围是 (0°, 90°]，当两条直线平行或重合时为0°，但异面直线不平行，所以开区间左端点。',
  },
  {
    id: 'pre-q2',
    title: '线面角的定义是？',
    options: [
      '直线与平面中所有直线所成角中最小的角',
      '直线与它在平面内的射影所成的角',
      '直线与平面中某条直线所成的角',
      '直线与平面垂线所成的角',
    ],
    correct: 1,
    analysis: '线面角（斜线与平面所成的角）定义为：斜线与它在平面内的射影所成的锐角。范围是 [0°, 90°]。',
  },
  {
    id: 'pre-q3',
    title: '平面角的构成要素不包括？',
    options: ['顶点', '两条边', '两条边在同一平面内', '两条边互相垂直'],
    correct: 3,
    analysis: '平面角由顶点和两条射线（边）构成，且两边在同一平面内。两边不一定垂直，垂直是直角的特殊情况。',
  },
];

// 拖拽拼图正确顺序
const correctOrder = ['线线垂直', '线面垂直', '面面垂直'];
const dragCards = [
  { id: 'line-line', label: '线线垂直', desc: '最基础的垂直关系' },
  { id: 'line-plane', label: '线面垂直', desc: '由线线垂直推导而来' },
  { id: 'plane-plane', label: '面面垂直', desc: '本节课要学的内容' },
];

// 实景图数据
const realScenes = [
  {
    id: 'dam',
    title: '水坝',
    desc: '水坝坡面与水平面形成二面角',
    bg: 'from-amber-100 to-orange-200',
    icon: '🏔️',
    edgeLabel: '坝底线（棱）',
    plane1Label: '水平面（α）',
    plane2Label: '坝坡面（β）',
  },
  {
    id: 'wall',
    title: '墙面与地面',
    desc: '教室墙面与地面形成直二面角',
    bg: 'from-blue-100 to-indigo-200',
    icon: '🏠',
    edgeLabel: '墙脚线（棱）',
    plane1Label: '地面（α）',
    plane2Label: '墙面（β）',
  },
  {
    id: 'book',
    title: '翻开的书本',
    desc: '书脊为棱，两页为半平面',
    bg: 'from-green-100 to-emerald-200',
    icon: '📖',
    edgeLabel: '书脊（棱）',
    plane1Label: '左页（α）',
    plane2Label: '右页（β）',
  },
  {
    id: 'cube',
    title: '长方体',
    desc: '相邻两个面形成二面角',
    bg: 'from-purple-100 to-violet-200',
    icon: '📦',
    edgeLabel: '棱AB',
    plane1Label: '前面（α）',
    plane2Label: '右面（β）',
  },
];

// 类比表格数据
const compareData = [
  { dim: '定义', plane: '从一点出发的两条射线组成的图形', dihedral: '从一条直线出发的两个半平面组成的图形' },
  { dim: '图形', plane: '∠AOB（平面图形）', dihedral: 'α-l-β（空间图形）' },
  { dim: '表示法', plane: '∠AOB、∠O', dihedral: 'α-l-β、α-AB-β、P-l-Q' },
  { dim: '范围', plane: '[0°, 180°]', dihedral: '[0°, 180°]' },
  { dim: '度量方式', plane: '直接度量角度大小', dihedral: '用平面角度量（转化思想）' },
];

interface Module1Props {
  replayKey: number;
}

export default function Module1({ replayKey }: Module1Props) {
  // 拖拽状态
  const [slots, setSlots] = useState<(string | null)[]>([null, null, null]);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragSolved, setDragSolved] = useState(false);

  // 实景弹窗
  const [activeScene, setActiveScene] = useState<string | null>(null);

  // 类比表格展开
  const [compareOpen, setCompareOpen] = useState(false);

  // 小测状态
  const [quizAnswers, setQuizAnswers] = useState<(number | null)[]>([null, null, null]);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean[]>([false, false, false]);

  const handleDragStart = (id: string) => {
    setDraggedId(id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (slotIndex: number) => {
    if (!draggedId) return;
    const card = dragCards.find((c) => c.id === draggedId);
    if (!card) return;

    // 如果该槽位已有卡片，先移除
    const newSlots = [...slots];
    const existingIndex = newSlots.indexOf(card.label);
    if (existingIndex !== -1) {
      newSlots[existingIndex] = null;
    }
    newSlots[slotIndex] = card.label;
    setSlots(newSlots);
    setDraggedId(null);

    // 检查是否全部填满且正确
    if (newSlots.every((s, i) => s === correctOrder[i])) {
      setDragSolved(true);
      toast.success('太棒了！垂直关系的研究顺序完全正确 🎉');
    }
  };

  const handleAnswer = (qIndex: number, optionIndex: number) => {
    if (quizSubmitted[qIndex]) return;
    const newAnswers = [...quizAnswers];
    newAnswers[qIndex] = optionIndex;
    setQuizAnswers(newAnswers);

    const newSubmitted = [...quizSubmitted];
    newSubmitted[qIndex] = true;
    setQuizSubmitted(newSubmitted);

    const isCorrect = optionIndex === quizQuestions[qIndex].correct;
    if (isCorrect) {
      toast.success('回答正确！');
    } else {
      toast.error('回答错误，看看解析吧');
      addWrongQuestion({
        id: `wrong_${quizQuestions[qIndex].id}_${Date.now()}`,
        moduleId: 'module1',
        questionId: quizQuestions[qIndex].id,
        userAnswer: quizQuestions[qIndex].options[optionIndex],
        correctAnswer: quizQuestions[qIndex].options[quizQuestions[qIndex].correct],
        timestamp: Date.now(),
      });
    }
  };

  const resetDrag = useCallback(() => {
    setSlots([null, null, null]);
    setDragSolved(false);
  }, []);

  // replay 时重置
  useCallback(() => {
    resetDrag();
    setActiveScene(null);
    setCompareOpen(false);
    setQuizAnswers([null, null, null]);
    setQuizSubmitted([false, false, false]);
  }, [replayKey, resetDrag]);

  const availableCards = dragCards.filter((c) => !slots.includes(c.label));

  return (
    <div id="module1" className="scroll-mt-20 space-y-10">
      {/* 模块标题 */}
      <div className="text-center mb-8">
        <span className="inline-block px-4 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full mb-3">
          模块 1
        </span>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">开篇导学·温故知新</h2>
        <p className="text-muted-foreground">回顾垂直关系，引入二面角概念</p>
      </div>

      {/* 1. 垂直层级拖拽拼图 */}
      <section className="bg-card rounded-2xl border border-border p-6 md:p-8">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
            1
          </div>
          <h3 className="text-lg font-semibold">垂直层级拖拽拼图</h3>
        </div>

        <p className="text-muted-foreground mb-6 text-sm">
          想一想：我们研究空间中垂直关系的顺序是什么？把下方卡片拖到正确的位置。
        </p>

        {/* 轨道槽位 */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-4 mb-8">
          {slots.map((slot, i) => (
            <div key={i} className="flex items-center gap-2 md:gap-3 w-full md:w-auto">
              <div
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(i)}
                className={`flex-1 md:w-40 h-20 md:h-24 rounded-xl border-2 border-dashed flex items-center justify-center transition-all ${
                  slot
                    ? dragSolved
                      ? 'border-success bg-success/10'
                      : 'border-primary bg-primary/5'
                    : 'border-border bg-muted/30 hover:border-primary/50 hover:bg-primary/5'
                }`}
              >
                {slot ? (
                  <div className="text-center">
                    <div className="font-semibold text-foreground">{slot}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">第 {i + 1} 层</div>
                  </div>
                ) : (
                  <span className="text-muted-foreground text-sm">第 {i + 1} 层</span>
                )}
              </div>
              {i < 2 && (
                <span className="text-muted-foreground text-lg hidden md:block">→</span>
              )}
            </div>
          ))}
        </div>

        {/* 可拖拽卡片 */}
        <div className="flex flex-wrap justify-center gap-3">
          {availableCards.map((card) => (
            <motion.div
              key={card.id}
              draggable
              onDragStart={() => handleDragStart(card.id)}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="px-5 py-3 bg-gradient-to-br from-primary/15 to-secondary/15 border border-primary/20 rounded-xl cursor-grab active:cursor-grabbing shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="font-medium text-foreground">{card.label}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{card.desc}</div>
            </motion.div>
          ))}
        </div>

        {dragSolved && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-success/10 border border-success/30 rounded-xl flex items-start gap-3"
          >
            <Check className="w-5 h-5 text-success shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-success">解锁成功！</p>
              <p className="text-sm text-muted-foreground mt-1">
                研究顺序：线线垂直 → 线面垂直 → 面面垂直。这体现了立体几何中"降维"的思想——
                空间问题转化为平面问题来解决。今天我们要学习的面面垂直，是垂直关系的最高层级。
              </p>
            </div>
          </motion.div>
        )}
      </section>

      {/* 2. 实景触发二面角 */}
      <section className="bg-card rounded-2xl border border-border p-6 md:p-8">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
            2
          </div>
          <h3 className="text-lg font-semibold">实景中的二面角</h3>
        </div>

        <p className="text-muted-foreground mb-6 text-sm">
          生活中处处都有二面角的身影。点击下方图片，观察棱和两个半平面在哪里。
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {realScenes.map((scene) => (
            <motion.button
              key={scene.id}
              whileHover={{ scale: 1.03, y: -3 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveScene(scene.id)}
              className={`relative aspect-[4/3] rounded-xl bg-gradient-to-br ${scene.bg} overflow-hidden group shadow-sm hover:shadow-lg transition-all`}
            >
              <div className="absolute inset-0 flex items-center justify-center text-5xl">
                {scene.icon}
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/50 to-transparent">
                <p className="text-white font-medium text-sm">{scene.title}</p>
              </div>
              <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/80 flex items-center justify-center text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                👆
              </div>
            </motion.button>
          ))}
        </div>

        {/* 实景弹窗 */}
        <AnimatePresence>
          {activeScene && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={() => setActiveScene(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: 'spring', damping: 25 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-card rounded-2xl p-6 max-w-md w-full shadow-2xl border border-border"
              >
                {(() => {
                  const scene = realScenes.find((s) => s.id === activeScene);
                  if (!scene) return null;
                  return (
                    <>
                      <div className={`aspect-video rounded-xl bg-gradient-to-br ${scene.bg} flex items-center justify-center text-7xl mb-4 relative overflow-hidden`}>
                        {scene.icon}
                        {/* 标注示意 */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary/90 text-white text-xs rounded-full">
                          {scene.edgeLabel}
                        </div>
                        <div className="absolute top-4 left-4 px-2 py-1 bg-blue-500/90 text-white text-xs rounded">
                          {scene.plane1Label}
                        </div>
                        <div className="absolute top-4 right-4 px-2 py-1 bg-orange-500/90 text-white text-xs rounded">
                          {scene.plane2Label}
                        </div>
                      </div>
                      <h4 className="text-lg font-semibold mb-2">{scene.title}</h4>
                      <p className="text-muted-foreground text-sm mb-4">{scene.desc}</p>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full bg-primary shrink-0" />
                          <span className="text-foreground">棱：{scene.edgeLabel}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full bg-blue-500 shrink-0" />
                          <span className="text-foreground">半平面α：{scene.plane1Label}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full bg-orange-500 shrink-0" />
                          <span className="text-foreground">半平面β：{scene.plane2Label}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => setActiveScene(null)}
                        className="mt-5 w-full py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                      >
                        我知道了
                      </button>
                    </>
                  );
                })()}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* 3. 类比思维弹窗 */}
      <section className="bg-card rounded-2xl border border-border overflow-hidden">
        <button
          onClick={() => setCompareOpen(!compareOpen)}
          className="w-full flex items-center justify-between p-6 md:px-8 md:py-5 hover:bg-accent/30 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Lightbulb className="w-5 h-5 text-warning" />
            <span className="font-semibold text-foreground">类比思维：平面角 vs 二面角</span>
          </div>
          {compareOpen ? (
            <ChevronUp className="w-5 h-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          )}
        </button>

        <AnimatePresence initial={false}>
          {compareOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="px-6 md:px-8 pb-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="text-left p-3 font-medium text-muted-foreground border-b border-border w-24">对比维度</th>
                        <th className="text-left p-3 font-medium text-foreground border-b border-border">平面角</th>
                        <th className="text-left p-3 font-medium text-foreground border-b border-border">二面角</th>
                      </tr>
                    </thead>
                    <tbody>
                      {compareData.map((row, i) => (
                        <tr key={i} className="border-b border-border/50 last:border-0">
                          <td className="p-3 font-medium text-primary">{row.dim}</td>
                          <td className="p-3 text-muted-foreground">{row.plane}</td>
                          <td className="p-3 text-muted-foreground">{row.dihedral}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-muted-foreground mt-4 flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-foreground">数学思想：</strong>
                    二面角的大小通过"平面角"来度量，体现了空间问题平面化的转化思想。
                  </span>
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* 4. 课前小测 */}
      <section className="bg-card rounded-2xl border border-border p-6 md:p-8">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
            3
          </div>
          <h3 className="text-lg font-semibold">课前小测</h3>
          <span className="ml-auto text-sm text-muted-foreground flex items-center gap-1">
            <BookOpenCheck className="w-4 h-4" />
            {quizSubmitted.filter(Boolean).length} / {quizQuestions.length}
          </span>
        </div>

        <div className="space-y-6">
          {quizQuestions.map((q, qIndex) => (
            <div key={q.id} className="p-4 rounded-xl bg-muted/20 border border-border/50">
              <p className="font-medium text-foreground mb-3">
                <span className="text-primary mr-2">{qIndex + 1}.</span>
                {q.title}
              </p>
              <div className="grid gap-2">
                {q.options.map((opt, oIndex) => {
                  const isSelected = quizAnswers[qIndex] === oIndex;
                  const isSubmitted = quizSubmitted[qIndex];
                  const isCorrect = oIndex === q.correct;

                  let bgClass = 'bg-background hover:bg-accent/50 border-border';
                  if (isSubmitted) {
                    if (isCorrect) {
                      bgClass = 'bg-success/10 border-success/40 text-success';
                    } else if (isSelected && !isCorrect) {
                      bgClass = 'bg-destructive/10 border-destructive/40 text-destructive';
                    }
                  } else if (isSelected) {
                    bgClass = 'bg-primary/10 border-primary/40';
                  }

                  return (
                    <button
                      key={oIndex}
                      onClick={() => handleAnswer(qIndex, oIndex)}
                      disabled={isSubmitted}
                      className={`flex items-center gap-3 p-3 rounded-lg border text-left transition-all ${bgClass} ${
                        isSubmitted ? 'cursor-default' : 'cursor-pointer'
                      }`}
                    >
                      <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs font-medium shrink-0">
                        {String.fromCharCode(65 + oIndex)}
                      </span>
                      <span className="flex-1 text-sm">{opt}</span>
                      {isSubmitted && isCorrect && <Check className="w-4 h-4 shrink-0" />}
                      {isSubmitted && isSelected && !isCorrect && <X className="w-4 h-4 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {quizSubmitted[qIndex] && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-3 pt-3 border-t border-border/50"
                >
                  <p className="text-xs text-muted-foreground">
                    <span className="text-primary font-medium">解析：</span>
                    {q.analysis}
                  </p>
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
