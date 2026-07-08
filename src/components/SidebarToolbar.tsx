import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  BookOpen,
  Shapes,
  Box,
  ListChecks,
  PenTool,
  Trophy,
  StickyNote,
  RotateCcw,
  Search,
  Sun,
  Moon,
  X,
  BookX,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { MOCK_COURSE_CONTENT } from '@/data/coursecontent';
import { getTheme, setTheme } from '@/lib/storage';

interface SidebarToolbarProps {
  onOpenNotes: () => void;
  onOpenSearch: () => void;
  onOpenWrongBook: () => void;
  onReplayModule: (moduleId: string) => void;
  currentModule: string;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  cover: Home,
  BookOpen,
  Shapes,
  Box,
  ListChecks,
  PenTool,
  Trophy,
};

const navItems = [
  { anchor: '#cover', label: '封面', icon: 'cover' },
  { anchor: '#module1', label: '开篇导学', icon: 'BookOpen' },
  { anchor: '#module2', label: '二面角概念', icon: 'Shapes' },
  { anchor: '#module3', label: '面面垂直判定', icon: 'Box' },
  { anchor: '#module4', label: '方法总结', icon: 'ListChecks' },
  { anchor: '#module5', label: '随堂练习', icon: 'PenTool' },
  { anchor: '#module6', label: '课堂小结', icon: 'Trophy' },
];

export default function SidebarToolbar({
  onOpenNotes,
  onOpenSearch,
  onOpenWrongBook,
  onReplayModule,
  currentModule,
}: SidebarToolbarProps) {
  const isMobile = useIsMobile();
  const [expanded, setExpanded] = useState(!isMobile);
  const [theme, setThemeState] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const t = getTheme();
    setThemeState(t);
    document.documentElement.classList.toggle('dark', t === 'dark');
  }, []);

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setThemeState(next);
    setTheme(next);
    document.documentElement.classList.toggle('dark', next === 'dark');
  };

  const handleReplay = () => {
    onReplayModule(currentModule);
  };

  if (isMobile) {
    return (
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-lg border-t border-border">
        <div className="flex items-center justify-around h-16 px-2">
          {navItems.slice(0, 5).map((item) => {
            const Icon = iconMap[item.icon];
            const isActive = currentModule === item.anchor.replace('#', '');
            return (
              <NavLink
                key={item.anchor}
                to={item.anchor}
                className={`flex flex-col items-center gap-0.5 px-2 py-1 text-xs transition-colors ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px]">{item.label}</span>
              </NavLink>
            );
          })}
          <button
            onClick={onOpenNotes}
            className="flex flex-col items-center gap-0.5 px-2 py-1 text-xs text-muted-foreground"
          >
            <StickyNote className="w-5 h-5" />
            <span className="text-[10px]">笔记</span>
          </button>
        </div>
      </nav>
    );
  }

  return (
    <aside className="fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden md:block">
      <motion.div
        initial={false}
        animate={{ width: expanded ? 200 : 56 }}
        className="bg-card/90 backdrop-blur-lg rounded-2xl shadow-lg border border-border/50 overflow-hidden"
      >
        <div className="p-2">
          {/* 折叠按钮 */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center justify-center h-8 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg mb-2 transition-colors"
            aria-label={expanded ? '收起工具栏' : '展开工具栏'}
          >
            {expanded ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          {/* 导航项 */}
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = iconMap[item.icon];
              const isActive = currentModule === item.anchor.replace('#', '');
              return (
                <NavLink
                  key={item.anchor}
                  to={item.anchor}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <AnimatePresence initial={false}>
                    {expanded && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.15 }}
                        className="text-sm whitespace-nowrap overflow-hidden"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </NavLink>
              );
            })}
          </div>

          {/* 分隔线 */}
          <div className="my-2 border-t border-border/50" />

          {/* 工具按钮 */}
          <div className="space-y-1">
            <button
              onClick={onOpenNotes}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              <StickyNote className="w-4 h-4 shrink-0" />
              <AnimatePresence initial={false}>
                {expanded && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.15 }}
                    className="text-sm whitespace-nowrap overflow-hidden"
                  >
                    笔记批注
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            <button
              onClick={handleReplay}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              <RotateCcw className="w-4 h-4 shrink-0" />
              <AnimatePresence initial={false}>
                {expanded && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.15 }}
                    className="text-sm whitespace-nowrap overflow-hidden"
                  >
                    动画回放
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            <button
              onClick={onOpenSearch}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              <Search className="w-4 h-4 shrink-0" />
              <AnimatePresence initial={false}>
                {expanded && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.15 }}
                    className="text-sm whitespace-nowrap overflow-hidden"
                  >
                    知识点检索
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            <button
              onClick={onOpenWrongBook}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              <BookX className="w-4 h-4 shrink-0" />
              <AnimatePresence initial={false}>
                {expanded && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.15 }}
                    className="text-sm whitespace-nowrap overflow-hidden"
                  >
                    错题本
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            <button
              onClick={toggleTheme}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              {theme === 'light' ? (
                <Moon className="w-4 h-4 shrink-0" />
              ) : (
                <Sun className="w-4 h-4 shrink-0" />
              )}
              <AnimatePresence initial={false}>
                {expanded && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.15 }}
                    className="text-sm whitespace-nowrap overflow-hidden"
                  >
                    {theme === 'light' ? '深色模式' : '浅色模式'}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </motion.div>
    </aside>
  );
}
