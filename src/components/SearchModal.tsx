import { useState, useEffect, useMemo } from 'react';
import { X, Search, ArrowRight } from 'lucide-react';
import { NavLink } from '@lark-apaas/client-toolkit-lite';
import { motion, AnimatePresence } from 'framer-motion';
import { MOCK_COURSE_CONTENT } from '@/data/coursecontent';

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

interface SearchResult {
  moduleId: string;
  moduleTitle: string;
  anchor: string;
  highlight: string;
}

const knowledgePoints: SearchResult[] = [
  { moduleId: 'm1', moduleTitle: '开篇导学', anchor: '#module1', highlight: '空间垂直关系层级：线线垂直→线面垂直→面面垂直' },
  { moduleId: 'm1', moduleTitle: '开篇导学', anchor: '#module1', highlight: '二面角实景感知：水坝、墙面、书本、长方体' },
  { moduleId: 'm1', moduleTitle: '开篇导学', anchor: '#module1', highlight: '平面角与二面角类比' },
  { moduleId: 'm2', moduleTitle: '二面角概念', anchor: '#module2', highlight: '二面角定义：从一条直线出发的两个半平面所组成的图形' },
  { moduleId: 'm2', moduleTitle: '二面角概念', anchor: '#module2', highlight: '二面角记法：α-l-β、α-AB-β、P-l-Q' },
  { moduleId: 'm2', moduleTitle: '二面角概念', anchor: '#module2', highlight: '二面角平面角作法：一作二证三求' },
  { moduleId: 'm2', moduleTitle: '二面角概念', anchor: '#module2', highlight: '平面角与顶点位置无关' },
  { moduleId: 'm2', moduleTitle: '二面角概念', anchor: '#module2', highlight: '二面角类型：锐角、直角、钝角、平角' },
  { moduleId: 'm2', moduleTitle: '二面角概念', anchor: '#module2', highlight: '易错点：两边必须都垂直于棱才是平面角' },
  { moduleId: 'm3', moduleTitle: '面面垂直判定', anchor: '#module3', highlight: '面面垂直判定定理：一个平面过另一个平面的垂线，则两平面垂直' },
  { moduleId: 'm3', moduleTitle: '面面垂直判定', anchor: '#module3', highlight: '简记口诀：线面垂直⇒面面垂直' },
  { moduleId: 'm3', moduleTitle: '面面垂直判定', anchor: '#module3', highlight: '三种语言：文字语言、符号语言、图形语言' },
  { moduleId: 'm4', moduleTitle: '方法总结', anchor: '#module4', highlight: '二面角求解三步法：一作、二证、三求' },
  { moduleId: 'm4', moduleTitle: '方法总结', anchor: '#module4', highlight: '面面垂直证明流程：找垂线→证线面垂直→得面面垂直' },
  { moduleId: 'm5', moduleTitle: '随堂练习', anchor: '#module5', highlight: '基础层：选择题+填空题' },
  { moduleId: 'm5', moduleTitle: '随堂练习', anchor: '#module5', highlight: '提升层：交互作图题+步骤填空题' },
  { moduleId: 'm5', moduleTitle: '随堂练习', anchor: '#module5', highlight: '拓展层：解答大题+得分点分析' },
  { moduleId: 'm6', moduleTitle: '课堂小结', anchor: '#module6', highlight: '知识点闯关游戏' },
  { moduleId: 'm6', moduleTitle: '课堂小结', anchor: '#module6', highlight: '分层课后任务：基础习题/折纸实践/拓展任务' },
];

export default function SearchModal({ open, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (open) {
      setQuery('');
    }
  }, [open]);

  const results = useMemo(() => {
    if (!query.trim()) return knowledgePoints.slice(0, 8);
    const q = query.toLowerCase();
    return knowledgePoints.filter(
      (r) => r.highlight.toLowerCase().includes(q) || r.moduleTitle.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-start justify-center pt-[15vh] px-4"
          >
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-xl bg-card rounded-2xl shadow-2xl border border-border overflow-hidden"
            >
              {/* 搜索框 */}
              <div className="flex items-center gap-3 p-4 border-b border-border">
                <Search className="w-5 h-5 text-muted-foreground shrink-0" />
                <input
                  autoFocus
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="搜索知识点..."
                  className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none text-base"
                />
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* 结果列表 */}
              <div className="max-h-[50vh] overflow-y-auto">
                {results.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    未找到相关知识点
                  </div>
                ) : (
                  <div className="p-2">
                    {results.map((r, i) => (
                      <NavLink
                        key={i}
                        to={r.anchor}
                        onClick={onClose}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-accent/50 transition-colors group"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="text-xs text-primary mb-0.5">{r.moduleTitle}</div>
                          <div className="text-sm text-foreground truncate">{r.highlight}</div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
