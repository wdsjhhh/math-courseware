import { useState, useEffect, useCallback } from 'react';
import CoverSection from './CoverSection';
import Module1 from './Module1';
import Module2 from './Module2';
import Module3 from './Module3';
import Module4 from './Module4';
import Module5 from './Module5';
import Module6 from './Module6';
import SidebarToolbar from '@/components/SidebarToolbar';
import NoteDrawer from '@/components/NoteDrawer';
import SearchModal from '@/components/SearchModal';
import WrongBookDrawer from '@/components/WrongBookDrawer';

const sectionIds = ['cover', 'module1', 'module2', 'module3', 'module4', 'module5', 'module6'];

export default function CoursewarePage() {
  const [currentModule, setCurrentModule] = useState('cover');
  const [notesOpen, setNotesOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [wrongBookOpen, setWrongBookOpen] = useState(false);
  const [replayKey, setReplayKey] = useState(0);

  // 滚动监听 - 当前模块高亮
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
            setCurrentModule(entry.target.id);
          }
        });
      },
      { threshold: [0.3, 0.5, 0.7] },
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // 键盘快捷键
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === '/' && !e.ctrlKey && !e.metaKey) {
        const target = e.target as HTMLElement;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const handleReplayModule = useCallback((moduleId: string) => {
    setReplayKey((k) => k + 1);
    // 滚动到对应模块
    const el = document.getElementById(moduleId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* 侧边工具条 */}
      <SidebarToolbar
        onOpenNotes={() => setNotesOpen(true)}
        onOpenSearch={() => setSearchOpen(true)}
        onOpenWrongBook={() => setWrongBookOpen(true)}
        onReplayModule={handleReplayModule}
        currentModule={currentModule}
      />

      {/* 主内容 */}
      <main className="pb-20 md:pb-8">
        <CoverSection />

        <div className="max-w-4xl mx-auto px-4 md:px-6 py-12 space-y-20 md:space-y-28">
          <Module1 replayKey={replayKey} />
          <Module2 replayKey={replayKey} />
          <Module3 replayKey={replayKey} />
          <Module4 replayKey={replayKey} />
          <Module5 replayKey={replayKey} onOpenWrongBook={() => setWrongBookOpen(true)} />
          <Module6 replayKey={replayKey} />
        </div>
      </main>

      {/* 抽屉/弹窗 */}
      <NoteDrawer
        open={notesOpen}
        onClose={() => setNotesOpen(false)}
        currentModule={currentModule}
      />
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
      <WrongBookDrawer open={wrongBookOpen} onClose={() => setWrongBookOpen(false)} />
    </div>
  );
}
