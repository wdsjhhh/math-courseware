import { useState, useEffect } from 'react';
import { X, BookX, Trash2, ArrowUpRight, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink } from '@lark-apaas/client-toolkit-lite';
import { getWrongQuestions, removeWrongQuestion, clearWrongQuestions, type IWrongQuestion } from '@/lib/storage';
import { MOCK_QUESTIONS } from '@/data/questions';

interface WrongBookDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function WrongBookDrawer({ open, onClose }: WrongBookDrawerProps) {
  const [wrongs, setWrongs] = useState<IWrongQuestion[]>([]);

  useEffect(() => {
    if (open) {
      setWrongs(getWrongQuestions().sort((a, b) => b.timestamp - a.timestamp));
    }
  }, [open]);

  const handleRemove = (questionId: string) => {
    removeWrongQuestion(questionId);
    setWrongs((prev) => prev.filter((w) => w.questionId !== questionId));
  };

  const handleClear = () => {
    clearWrongQuestions();
    setWrongs([]);
  };

  const getQuestionTitle = (questionId: string) => {
    return MOCK_QUESTIONS.find((q) => q.id === questionId)?.title ?? questionId;
  };

  const getModuleAnchor = (moduleId: string) => {
    return `#${moduleId}`;
  };

  const moduleNames: Record<string, string> = {
    module1: '开篇导学',
    module2: '二面角概念',
    module3: '面面垂直判定',
    module5: '随堂练习',
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-card border-l border-border shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <BookX className="w-5 h-5 text-destructive" />
                <h2 className="text-lg font-semibold">错题本</h2>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                  {wrongs.length} 题
                </span>
              </div>
              <div className="flex items-center gap-1">
                {wrongs.length > 0 && (
                  <button
                    onClick={handleClear}
                    className="p-2 rounded-lg hover:bg-accent text-muted-foreground transition-colors"
                    title="清空错题本"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-accent text-muted-foreground transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {wrongs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                  <RefreshCw className="w-12 h-12 mb-3 opacity-30" />
                  <p className="text-sm">暂无错题</p>
                  <p className="text-xs mt-1">做错的题目会自动收集到这里</p>
                </div>
              ) : (
                wrongs.map((w) => (
                  <motion.div
                    key={w.questionId}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="p-3 rounded-xl bg-background border border-border hover:border-primary/30 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-md shrink-0">
                        {moduleNames[w.moduleId] ?? w.moduleId}
                      </span>
                      <button
                        onClick={() => handleRemove(w.questionId)}
                        className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors shrink-0"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-sm text-foreground line-clamp-2 mb-2">
                      {getQuestionTitle(w.questionId)}
                    </p>
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <span className="text-destructive">你答：{w.userAnswer || '空'}</span>
                        <span className="text-success">正确：{w.correctAnswer}</span>
                      </div>
                      <NavLink
                        to={getModuleAnchor(w.moduleId)}
                        onClick={onClose}
                        className="flex items-center gap-0.5 text-primary hover:underline"
                      >
                        去复习
                        <ArrowUpRight className="w-3 h-3" />
                      </NavLink>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
