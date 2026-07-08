import { useState, useEffect } from 'react';
import { Trophy, Star, Heart, RotateCcw, ChevronRight, Check, X, BookOpen, Lightbulb, Rocket } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { getGameScore, setGameScore } from '@/lib/storage';

interface Module6Props {
  replayKey: number;
}

// 判断题
const gameQuestions = [
  { id: 'g1', statement: '二面角的平面角的大小与顶点在棱上的位置有关。', answer: false, explain: '平面角大小与顶点位置无关，只与二面角的张角有关。' },
  { id: 'g2', statement: '两个平面垂直，则一个平面内的任意直线都垂直于另一个平面。', answer: false, explain: '只有垂直于交线的直线才垂直于另一个平面。' },
  { id: 'g3', statement: '若一条直线垂直于一个平面，则过这条直线的所有平面都与该平面垂直。', answer: true, explain: '这是面面垂直判定定理的推论：线面垂直 ⇒ 过该线的所有面都垂直。' },
  { id: 'g4', statement: '直二面角的平面角是 90°。', answer: true, explain: '直二面角的定义就是平面角为直角（90°）的二面角。' },
  { id: 'g5', statement: '二面角的棱与平面角的两边都垂直。', answer: true, explain: '平面角的两边分别在两个半平面内，且都垂直于棱，这是平面角的定义。' },
];

// 分层任务
const homeworkTasks = [
  {
    id: 'basic',
    title: '基础习题',
    icon: BookOpen,
    desc: '完成课本 P45 习题 1-5 题',
    detail: '巩固二面角和面面垂直判定的基础知识，每题写出完整解题步骤。',
    color: 'text-success',
    bg: 'bg-success/10',
    border: 'border-success/30',
  },
  {
    id: 'practice',
    title: '折纸实践',
    icon: Lightbulb,
    desc: '用一张长方形纸折出不同角度的二面角',
    detail: '动手操作：将长方形纸沿一条直线折叠，观察折痕（棱）和两个半平面，用量角器测量平面角大小，体会直二面角的形态。',
    color: 'text-warning',
    bg: 'bg-warning/10',
    border: 'border-warning/30',
  },
  {
    id: 'advanced',
    title: '拓展任务',
    icon: Rocket,
    desc: '探究正方体中所有互相垂直的面对',
    detail: '在正方体 ABCD-A₁B₁C₁D₁ 中，找出所有互相垂直的面对，并证明你的结论。提示：共有多少对？',
    color: 'text-primary',
    bg: 'bg-primary/10',
    border: 'border-primary/30',
  },
];

// 知识卡片内容
const knowledgeCard = [
  { title: '二面角定义', content: '从一条直线出发的两个半平面所组成的图形叫做二面角。' },
  { title: '平面角三要素', content: '①顶点在棱上 ②两边分别在两个半平面内 ③两边都垂直于棱' },
  { title: '二面角范围', content: '[0°, 180°]，90° 时称为直二面角' },
  { title: '面面垂直判定', content: '一个平面过另一个平面的一条垂线 ⇒ 两平面垂直' },
  { title: '简记口诀', content: '线面垂直 ⇒ 面面垂直' },
  { title: '解题三步法', content: '一作（找棱作垂线）→ 二证（证明是平面角）→ 三求（计算角度）' },
];

type GameState = 'idle' | 'playing' | 'won' | 'lost';

export default function Module6({ replayKey }: Module6Props) {
  // 游戏状态
  const [gameState, setGameState] = useState<GameState>('idle');
  const [currentQ, setCurrentQ] = useState(0);
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [showExplain, setShowExplain] = useState(false);
  const [lastAnswer, setLastAnswer] = useState<boolean | null>(null);

  // 任务选择
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [expandedTask, setExpandedTask] = useState<string | null>(null);

  // 总结展开
  const [summaryOpen, setSummaryOpen] = useState(true);

  useEffect(() => {
    setHighScore(getGameScore());
  }, []);

  const startGame = () => {
    setGameState('playing');
    setCurrentQ(0);
    setLives(3);
    setScore(0);
    setShowExplain(false);
    setLastAnswer(null);
  };

  const answerQuestion = (userAnswer: boolean) => {
    const correct = gameQuestions[currentQ].answer === userAnswer;
    setLastAnswer(correct);
    setShowExplain(true);

    if (correct) {
      setScore((s) => s + 20);
      toast.success('回答正确！+20分');
    } else {
      setLives((l) => l - 1);
      toast.error('答错了，失去一条命 💔');
    }
  };

  const nextQuestion = () => {
    setShowExplain(false);
    setLastAnswer(null);

    if (lives <= 0) {
      setGameState('lost');
      return;
    }

    if (currentQ >= gameQuestions.length - 1) {
      setGameState('won');
      const finalScore = score + (lives > 0 ? lives * 10 : 0); // 剩余生命奖励
      setScore(finalScore);
      setGameScore(finalScore);
      setHighScore(Math.max(highScore, finalScore));
      toast.success('🎉 恭喜通关！');
      return;
    }

    setCurrentQ((q) => q + 1);
  };

  const toggleTask = (id: string) => {
    setSelectedTasks((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id],
    );
  };

  return (
    <div id="module6" className="scroll-mt-20 space-y-10">
      {/* 模块标题 */}
      <div className="text-center mb-8">
        <span className="inline-block px-4 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full mb-3">
          模块 6
        </span>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">课堂小结 · 课后任务</h2>
        <p className="text-muted-foreground">游戏化巩固，分层作业</p>
      </div>

      {/* 1. 知识点闯关小游戏 */}
      <section className="bg-card rounded-2xl border border-border p-6 md:p-8">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
            1
          </div>
          <h3 className="text-lg font-semibold">知识点闯关小游戏</h3>
          <span className="ml-auto text-sm text-muted-foreground flex items-center gap-1">
            <Trophy className="w-4 h-4 text-warning" />
            最高分：{highScore}
          </span>
        </div>

        <div className="bg-gradient-to-br from-primary/5 via-secondary/10 to-warning/5 rounded-xl p-6 min-h-[280px] flex items-center justify-center">
          {/* 开始界面 */}
          {gameState === 'idle' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="text-6xl mb-4">🎮</div>
              <h4 className="text-xl font-bold text-foreground mb-2">判断题闯关</h4>
              <p className="text-sm text-muted-foreground mb-2">5道判断题，3条命，答对+20分</p>
              <p className="text-xs text-muted-foreground mb-6">剩余生命可获得额外奖励分</p>
              <button
                onClick={startGame}
                className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-all hover:scale-105 shadow-lg shadow-primary/20"
              >
                开始闯关
              </button>
            </motion.div>
          )}

          {/* 游戏进行中 */}
          {gameState === 'playing' && (
            <motion.div
              key={currentQ}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-full max-w-md"
            >
              {/* 状态栏 */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-1">
                  {[...Array(3)].map((_, i) => (
                    <Heart
                      key={i}
                      className={`w-5 h-5 ${
                        i < lives ? 'text-destructive fill-destructive' : 'text-muted-foreground/30'
                      }`}
                    />
                  ))}
                </div>
                <div className="text-sm font-medium text-foreground">
                  第 {currentQ + 1} / {gameQuestions.length} 题
                </div>
                <div className="flex items-center gap-1 text-sm text-warning font-medium">
                  <Star className="w-4 h-4 fill-warning" />
                  {score}
                </div>
              </div>

              {/* 进度条 */}
              <div className="w-full h-1.5 bg-muted rounded-full mb-6 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentQ + (showExplain ? 1 : 0)) / gameQuestions.length) * 100}%` }}
                  className="h-full bg-gradient-to-r from-primary to-warning rounded-full"
                />
              </div>

              {/* 题目 */}
              <div className="bg-card rounded-xl p-5 mb-5 border border-border/50 shadow-sm">
                <p className="text-foreground font-medium leading-relaxed">
                  {gameQuestions[currentQ].statement}
                </p>
              </div>

              {/* 解析 */}
              <AnimatePresence>
                {showExplain && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className={`p-3 rounded-lg mb-5 text-sm ${
                      lastAnswer ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
                    }`}
                  >
                    <p className="font-medium mb-1">
                      {lastAnswer ? '✅ 回答正确！' : '❌ 回答错误'}
                    </p>
                    <p className="opacity-80">{gameQuestions[currentQ].explain}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 按钮 */}
              {!showExplain ? (
                <div className="flex gap-3">
                  <button
                    onClick={() => answerQuestion(true)}
                    className="flex-1 py-3 bg-success/20 text-success rounded-xl font-medium hover:bg-success/30 transition-colors flex items-center justify-center gap-2"
                  >
                    <Check className="w-5 h-5" />
                    正确
                  </button>
                  <button
                    onClick={() => answerQuestion(false)}
                    className="flex-1 py-3 bg-destructive/20 text-destructive rounded-xl font-medium hover:bg-destructive/30 transition-colors flex items-center justify-center gap-2"
                  >
                    <X className="w-5 h-5" />
                    错误
                  </button>
                </div>
              ) : (
                <button
                  onClick={nextQuestion}
                  className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                >
                  {currentQ >= gameQuestions.length - 1 ? '查看结果' : '下一题'}
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
            </motion.div>
          )}

          {/* 胜利 */}
          {gameState === 'won' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="text-6xl mb-4">🏆</div>
              <h4 className="text-2xl font-bold text-foreground mb-2">恭喜通关！</h4>
              <p className="text-lg text-primary font-bold mb-1">得分：{score}</p>
              <p className="text-sm text-muted-foreground mb-6">
                剩余生命奖励：{lives * 10} 分
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={startGame}
                  className="flex items-center gap-2 px-5 py-2.5 bg-accent text-foreground rounded-xl font-medium hover:bg-accent/80 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  再玩一次
                </button>
              </div>
            </motion.div>
          )}

          {/* 失败 */}
          {gameState === 'lost' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="text-6xl mb-4">💪</div>
              <h4 className="text-2xl font-bold text-foreground mb-2">再接再厉！</h4>
              <p className="text-sm text-muted-foreground mb-1">本次得分：{score}</p>
              <p className="text-sm text-muted-foreground mb-6">回去复习一下，再来挑战吧！</p>
              <button
                onClick={startGame}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors mx-auto"
              >
                <RotateCcw className="w-4 h-4" />
                重新挑战
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* 2. 课堂总结 */}
      <section className="bg-card rounded-2xl border border-border overflow-hidden">
        <button
          onClick={() => setSummaryOpen(!summaryOpen)}
          className="w-full flex items-center justify-between p-6 hover:bg-accent/30 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <h3 className="text-lg font-semibold text-foreground">课堂知识卡片</h3>
              <p className="text-sm text-muted-foreground">核心知识点回顾</p>
            </div>
          </div>
          {summaryOpen ? (
            <ChevronRight className="w-5 h-5 text-muted-foreground rotate-90" />
          ) : (
            <ChevronRight className="w-5 h-5 text-muted-foreground -rotate-90" />
          )}
        </button>

        <AnimatePresence initial={false}>
          {summaryOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {knowledgeCard.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="p-4 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl border border-border/50"
                  >
                    <p className="font-semibold text-primary text-sm mb-1">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.content}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* 3. 分层课后任务 */}
      <section className="bg-card rounded-2xl border border-border p-6 md:p-8">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
            2
          </div>
          <h3 className="text-lg font-semibold">分层课后任务</h3>
          <span className="ml-auto text-sm text-muted-foreground">
            已选 {selectedTasks.length} 项
          </span>
        </div>

        <p className="text-muted-foreground text-sm mb-4">
          根据自己的情况选择合适的任务，至少完成一项。
        </p>

        <div className="space-y-3">
          {homeworkTasks.map((task) => {
            const Icon = task.icon;
            const isSelected = selectedTasks.includes(task.id);
            const isExpanded = expandedTask === task.id;

            return (
              <div
                key={task.id}
                className={`rounded-xl border transition-all ${
                  isSelected ? `${task.border} ${task.bg}` : 'border-border bg-background'
                }`}
              >
                <div
                  onClick={() => toggleTask(task.id)}
                  className="w-full flex items-center gap-4 p-4 text-left cursor-pointer hover:bg-accent/30 transition-colors"
                >
                  <div className={`w-10 h-10 rounded-lg ${task.bg} flex items-center justify-center shrink-0`}>
                    <Icon className={`w-5 h-5 ${task.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground">{task.title}</p>
                    <p className="text-sm text-muted-foreground truncate">{task.desc}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedTask(isExpanded ? null : task.id);
                      }}
                      className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground transition-colors cursor-pointer"
                    >
                      {isExpanded ? (
                        <ChevronRight className="w-4 h-4 rotate-90" />
                      ) : (
                        <ChevronRight className="w-4 h-4 -rotate-90" />
                      )}
                    </div>
                    <div
                      className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                        isSelected
                          ? `${task.border} bg-current`
                          : 'border-muted-foreground/30'
                      }`}
                    >
                      {isSelected && <Check className={`w-3 h-3 ${task.color} bg-transparent`} />}
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 pl-[72px]">
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {task.detail}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. 下一节预习 */}
      <section className="bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 rounded-2xl border border-primary/20 p-6 md:p-8">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
            <Rocket className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-primary font-medium mb-1">下一节预告</p>
            <h3 className="text-xl font-bold text-foreground mb-2">平面与平面垂直的性质</h3>
            <p className="text-sm text-muted-foreground mb-4">
              我们已经学会了如何判定两个平面垂直，那么如果两个平面已经垂直了，它们又有哪些性质呢？
              下节课我们将一起探究面面垂直的性质定理。
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-2.5 py-1 bg-background/80 rounded-md text-xs text-foreground">
                预习提示：阅读课本 P46-48
              </span>
              <span className="px-2.5 py-1 bg-background/80 rounded-md text-xs text-foreground">
                思考：面面垂直 ⇒ 线面垂直？
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 底部装饰 */}
      <div className="text-center py-8">
        <p className="text-muted-foreground text-sm">
          🎓 本节课到此结束，同学们辛苦了！
        </p>
        <p className="text-xs text-muted-foreground/60 mt-2">
          平面与平面垂直（第一课时）· 高中数学立体几何
        </p>
      </div>
    </div>
  );
}
