import { motion } from 'framer-motion';
import { NavLink } from '@lark-apaas/client-toolkit-lite';
import { BookOpen, Shapes, Box, ListChecks, PenTool, Trophy, ChevronDown, GraduationCap } from 'lucide-react';
import { MOCK_COURSE_CONTENT } from '@/data/coursecontent';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  BookOpen,
  Shapes,
  Box,
  ListChecks,
  PenTool,
  Trophy,
};

export default function CoverSection() {
  return (
    <section
      id="cover"
      className="relative min-h-screen flex flex-col items-center justify-center px-4 py-16 overflow-hidden scroll-mt-20"
    >
      {/* 背景装饰 */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/10" />
      <div className="absolute top-20 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-secondary/20 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* 学科标签 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6"
        >
          <GraduationCap className="w-4 h-4" />
          {MOCK_COURSE_CONTENT.subject} · {MOCK_COURSE_CONTENT.grade}
        </motion.div>

        {/* 主标题 */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-3xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 leading-tight"
        >
          {MOCK_COURSE_CONTENT.title}
        </motion.h1>

        {/* 副标题 */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-lg md:text-xl text-muted-foreground mb-10"
        >
          {MOCK_COURSE_CONTENT.subtitle}
        </motion.p>

        {/* 开始按钮 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-3 justify-center mb-16"
        >
          <NavLink
            to="#module1"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-all hover:scale-105 shadow-lg shadow-primary/20"
          >
            开始学习
            <ChevronDown className="w-4 h-4 -rotate-90" />
          </NavLink>
          <NavLink
            to="#module5"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-card text-foreground rounded-xl font-medium border border-border hover:bg-accent transition-all"
          >
            <PenTool className="w-4 h-4" />
            直接练习
          </NavLink>
        </motion.div>

        {/* 目录卡片 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <p className="text-sm text-muted-foreground mb-4">课程目录</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {MOCK_COURSE_CONTENT.modules.map((module, i) => {
              const Icon = iconMap[module.icon] || BookOpen;
              return (
                <motion.div
                  key={module.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 + i * 0.08 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                >
                  <NavLink
                    to={module.anchor}
                    className="block p-4 bg-card/80 backdrop-blur-sm rounded-xl border border-border/50 hover:border-primary/30 hover:shadow-md transition-all text-left group"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <Icon className="w-4 h-4" />
                      </span>
                      <span className="text-xs text-muted-foreground">模块 {module.order}</span>
                    </div>
                    <h3 className="text-sm font-semibold text-foreground mb-1 line-clamp-1">
                      {module.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {module.subtitle}
                    </p>
                  </NavLink>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* 向下滚动提示 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center text-muted-foreground"
        >
          <span className="text-xs mb-1">向下滚动</span>
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </motion.div>
    </section>
  );
}
