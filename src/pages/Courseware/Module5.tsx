import { useState, useMemo } from 'react';
import { PenTool, Check, X, ChevronDown, ChevronUp, Award, Target, TrendingUp, BookX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { MOCK_QUESTIONS } from '@/data/questions';
import { addWrongQuestion, getWrongQuestions, type IWrongQuestion } from '@/lib/storage';

interface Module5Props {
  replayKey: number;
  onOpenWrongBook: () => void;
}

type LevelType = 'basic' | 'intermediate' | 'advanced';

const levelConfig = {
  basic: { label: '基础层', icon: Target, color: 'text-success', bg: 'bg-success/10', border: 'border-success/30' },
  intermediate: { label: '提升层', icon: TrendingUp, color: 'text-warning', bg: 'bg-warning/10', border: 'border-warning/30' },
  advanced: { label: '拓展层', icon: Award, color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/30' },
};

// 额外的基础题
const extraBasicQuestions = [
  {
    id: 'basic-2',
    level: 'basic' as LevelType,
    type: 'single_choice',
    title: '下列图形中，表示直二面角的是？',
    options: ['两个平面成 30° 角', '两个平面成 90° 角', '两个平面成 120° 角', '两个平面成 180° 角'],
    correctAnswer: '两个平面成 90° 角',
    analysis: '直二面角的定义是平面角为 90° 的二面角，即两个平面互相垂直。',
  },
  {
    id: 'basic-3',
    level: 'basic' as LevelType,
    type: 'fill_blank',
    title: '二面角的平面角的取值范围是 [0°, ____°]',
    correctAnswer: '180',
    analysis: '二面角的平面角范围是 [0°, 180°]，当两个半平面重合时为 0°，展开成一个平面时为 180°。',
  },
];

// 提升层题目
const intermediateQuestions = [
  {
    id: 'inter-1',
    level: 'intermediate' as LevelType,
    type: 'single_choice',
    title: '在正方体 ABCD-A₁B₁C₁D₁ 中，二面角 D₁-AB-D 的平面角是？',
    options: ['∠D₁AD', '∠D₁BD', '∠ADD₁', '∠ABD'],
    correctAnswer: '∠D₁AD',
    analysis: 'AB⊥AD，AB⊥AD₁，所以 ∠D₁AD 是二面角 D₁-AB-D 的平面角。',
  },
  {
    id: 'inter-2',
    level: 'intermediate' as LevelType,
    type: 'fill_blank',
    title: '若 PA⊥平面 ABC，AB⊥BC，PA=AB=BC=1，则二面角 P-BC-A 的大小为 ____°',
    correctAnswer: '45',
    analysis: 'BC⊥面PAB（BC⊥PA且BC⊥AB），故∠PBA为二面角P-BC-A的平面角。Rt△PAB中PA=AB=1，∠PBA=45°。',
  },
];

// 拓展层题目
const advancedQuestions = [
  {
    id: 'adv-1',
    level: 'advanced' as LevelType,
    type: 'essay',
    title: '如图，在四棱锥 P-ABCD 中，底面 ABCD 是正方形，PA⊥底面 ABCD，PA=AB。\n求证：平面 PBD⊥平面 PAC。',
    correctAnswer: '线面垂直→面面垂直',
    analysis: '证明：(1) 底面ABCD为正方形，故BD⊥AC。(2) PA⊥底面ABCD，BD⊂底面ABCD，故PA⊥BD。(3) PA∩AC=A，且PA、AC⊂平面PAC，故BD⊥平面PAC。(4) BD⊂平面PBD，因此平面PBD⊥平面PAC。',
    scorePoints: ['证BD⊥AC（2分）', '证PA⊥BD（2分）', '得BD⊥面PAC（3分）', '结论面面垂直（3分）'],
  },
];

export default function Module5({ replayKey, onOpenWrongBook }: Module5Props) {
  const [activeLevel, setActiveLevel] = useState<LevelType>('basic');
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});
  const [showScorePoints, setShowScorePoints] = useState<string | null>(null);
  const [wrongCount, setWrongCount] = useState(0);

  const allQuestions = useMemo(() => {
    const basic = MOCK_QUESTIONS.filter((q) => q.level === 'basic');
    return [...basic, ...extraBasicQuestions, ...intermediateQuestions, ...advancedQuestions];
  }, []);

  const levelQuestions = useMemo(
    () => allQuestions.filter((q) => q.level === activeLevel),
    [allQuestions, activeLevel],
  );

  // 统计
  const stats = useMemo(() => {
    const total = allQuestions.length;
    const done = Object.keys(submitted).length;
    const correct = Object.entries(submitted).filter(([id, s]) => {
      if (!s) return false;
      const q = allQuestions.find((x) => x.id === id);
      if (!q) return false;
      return String(answers[id] || '').trim() === q.correctAnswer;
    }).length;
    const accuracy = done > 0 ? Math.round((correct / done) * 100) : 0;
    return { total, done, correct, accuracy };
  }, [allQuestions, submitted, answers]);

  const handleSelectAnswer = (questionId: string, option: string) => {
    if (submitted[questionId]) return;
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleSubmit = (questionId: string) => {
    const q = allQuestions.find((x) => x.id === questionId);
    if (!q) return;
    const userAns = String(answers[questionId] || '').trim();
    const isCorrect = userAns === q.correctAnswer;

    setSubmitted((prev) => ({ ...prev, [questionId]: true }));

    if (isCorrect) {
      toast.success('回答正确！🎉');
    } else {
      toast.error('回答错误，已加入错题本');
      addWrongQuestion({
        id: `wrong_${questionId}_${Date.now()}`,
        moduleId: 'module5',
        questionId,
        userAnswer: userAns || '空',
        correctAnswer: q.correctAnswer,
        timestamp: Date.now(),
      });
      setWrongCount((c) => c + 1);
    }
  };

  const isCorrect = (questionId: string) => {
    const q = allQuestions.find((x) => x.id === questionId);
    if (!q) return false;
    return String(answers[questionId] || '').trim() === q.correctAnswer;
  };

  return (
    <div id="module5" className="scroll-mt-20 space-y-10">
      {/* 模块标题 */}
      <div className="text-center mb-8">
        <span className="inline-block px-4 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full mb-3">
          模块 5
        </span>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">分层随堂练习</h2>
        <p className="text-muted-foreground">即时检验学习效果</p>
      </div>

      {/* 得分统计卡 */}
      <section className="bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 rounded-2xl border border-primary/20 p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-3xl font-bold text-primary">{stats.done}</p>
            <p className="text-xs text-muted-foreground mt-1">已完成</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-success">{stats.correct}</p>
            <p className="text-xs text-muted-foreground mt-1">答对</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-warning">{stats.accuracy}%</p>
            <p className="text-xs text-muted-foreground mt-1">正确率</p>
          </div>
          <div>
            <button
              onClick={onOpenWrongBook}
              className="flex flex-col items-center"
            >
              <p className="text-3xl font-bold text-destructive flex items-center gap-1">
                <BookX className="w-6 h-6" />
                {wrongCount}
              </p>
              <p className="text-xs text-muted-foreground mt-1">错题本</p>
            </button>
          </div>
        </div>
      </section>

      {/* 层级切换 */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {(['basic', 'intermediate', 'advanced'] as LevelType[]).map((level) => {
          const config = levelConfig[level];
          const Icon = config.icon;
          const count = allQuestions.filter((q) => q.level === level).length;
          return (
            <button
              key={level}
              onClick={() => setActiveLevel(level)}
              className={`flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeLevel === level
                  ? `${config.bg} ${config.color} ${config.border} border`
                  : 'bg-muted/50 text-muted-foreground hover:bg-accent border border-transparent'
              }`}
            >
              <Icon className="w-4 h-4" />
              {config.label}
              <span className="text-xs opacity-70">({count})</span>
            </button>
          );
        })}
      </div>

      {/* 题目列表 */}
      <div className="space-y-4">
        {levelQuestions.map((q, idx) => {
          const isSubmitted = submitted[q.id];
          const correct = isSubmitted && isCorrect(q.id);
          const wrong = isSubmitted && !isCorrect(q.id);

          return (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className={`bg-card rounded-2xl border p-5 md:p-6 transition-all ${
                correct
                  ? 'border-success/40 bg-success/5'
                  : wrong
                  ? 'border-destructive/40 bg-destructive/5'
                  : 'border-border'
              }`}
            >
              <div className="flex items-start gap-3 mb-4">
                <span className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${
                  correct
                    ? 'bg-success/20 text-success'
                    : wrong
                    ? 'bg-destructive/20 text-destructive'
                    : 'bg-primary/10 text-primary'
                }`}>
                  {idx + 1}
                </span>
                <div className="flex-1">
                  <p className="font-medium text-foreground whitespace-pre-line">{q.title}</p>
                </div>
                {correct && <Check className="w-5 h-5 text-success flex-shrink-0" />}
                {wrong && <X className="w-5 h-5 text-destructive flex-shrink-0" />}
              </div>

              {/* 选择题 */}
              {q.type === 'single_choice' && q.options && (
                <div className="space-y-2 ml-10">
                  {q.options.map((opt, oIdx) => {
                    const isSelected = answers[q.id] === opt;
                    const isCorrectOpt = opt === q.correctAnswer;

                    let optClass = 'bg-background hover:bg-accent/50 border-border';
                    if (isSubmitted) {
                      if (isCorrectOpt) {
                        optClass = 'bg-success/10 border-success/40 text-success';
                      } else if (isSelected && !isCorrectOpt) {
                        optClass = 'bg-destructive/10 border-destructive/40 text-destructive';
                      }
                    } else if (isSelected) {
                      optClass = 'bg-primary/10 border-primary/40';
                    }

                    return (
                      <button
                        key={oIdx}
                        onClick={() => handleSelectAnswer(q.id, opt)}
                        disabled={isSubmitted}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-all ${optClass} ${
                          isSubmitted ? 'cursor-default' : 'cursor-pointer'
                        }`}
                      >
                        <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs font-medium shrink-0">
                          {String.fromCharCode(65 + oIdx)}
                        </span>
                        <span className="flex-1 text-sm">{opt}</span>
                        {isSubmitted && isCorrectOpt && <Check className="w-4 h-4 shrink-0" />}
                        {isSubmitted && isSelected && !isCorrectOpt && <X className="w-4 h-4 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* 填空题 */}
              {q.type === 'fill_blank' && (
                <div className="ml-10 space-y-3">
                  <input
                    type="text"
                    value={String(answers[q.id] || '')}
                    onChange={(e) => !isSubmitted && setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))}
                    disabled={isSubmitted}
                    placeholder="请输入答案"
                    className={`w-full max-w-xs px-3 py-2 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm ${
                      correct
                        ? 'border-success/50 focus:ring-success/30'
                        : wrong
                        ? 'border-destructive/50 focus:ring-destructive/30'
                        : 'border-input'
                    }`}
                  />
                </div>
              )}

              {/* 解答题 */}
              {q.type === 'essay' && (
                <div className="ml-10">
                  <p className="text-sm text-muted-foreground mb-2">
                    请在草稿纸上完成解答，点击下方按钮查看标准解析。
                  </p>
                  <button
                    onClick={() => setShowScorePoints(showScorePoints === q.id ? null : q.id)}
                    className="text-sm text-primary hover:underline flex items-center gap-1"
                  >
                    {showScorePoints === q.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    {showScorePoints === q.id ? '收起解析' : '查看标准解析与得分点'}
                  </button>
                </div>
              )}

              {/* 提交按钮 */}
              {q.type !== 'essay' && !isSubmitted && (
                <div className="ml-10 mt-4">
                  <button
                    onClick={() => handleSubmit(q.id)}
                    disabled={!answers[q.id]}
                    className="px-5 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    提交答案
                  </button>
                </div>
              )}

              {/* 解析 */}
              <AnimatePresence>
                {isSubmitted && q.type !== 'essay' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="ml-10 mt-4 pt-4 border-t border-border/50"
                  >
                    <p className="text-sm">
                      <span className="text-primary font-medium">解析：</span>
                      <span className="text-muted-foreground">{q.analysis}</span>
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 解答题得分点 */}
              <AnimatePresence>
                {showScorePoints === q.id && q.scorePoints && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="ml-10 mt-4 pt-4 border-t border-border/50"
                  >
                    <p className="text-sm text-foreground mb-2 font-medium">标准解析：</p>
                    <p className="text-sm text-muted-foreground mb-3 whitespace-pre-line">{q.analysis}</p>
                    <p className="text-sm text-foreground font-medium mb-2">得分点（共10分）：</p>
                    <ul className="space-y-1">
                      {q.scorePoints.map((point, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-primary">•</span>
                          {point}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
