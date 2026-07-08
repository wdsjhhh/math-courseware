import { useState, useEffect } from 'react';
import { X, Save, StickyNote } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { getNoteByModule, saveNote } from '@/lib/storage';
import { MOCK_COURSE_CONTENT } from '@/data/coursecontent';

interface NoteDrawerProps {
  open: boolean;
  onClose: () => void;
  currentModule: string;
}

export default function NoteDrawer({ open, onClose, currentModule }: NoteDrawerProps) {
  const [content, setContent] = useState('');
  const [selectedModule, setSelectedModule] = useState(currentModule);

  useEffect(() => {
    if (open) {
      setSelectedModule(currentModule);
      setContent(getNoteByModule(currentModule));
    }
  }, [open, currentModule]);

  const handleModuleChange = (moduleId: string) => {
    setSelectedModule(moduleId);
    setContent(getNoteByModule(moduleId));
  };

  const handleSave = () => {
    saveNote(selectedModule, content);
    toast.success('笔记已保存');
  };

  const moduleList = [
    { id: 'cover', title: '封面' },
    ...MOCK_COURSE_CONTENT.modules.map((m) => ({ id: m.id, title: m.title })),
  ];

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* 遮罩 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
          />
          {/* 抽屉 */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-card border-l border-border shadow-2xl flex flex-col"
          >
            {/* 头部 */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <StickyNote className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold">笔记批注</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-accent text-muted-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 模块选择 */}
            <div className="p-3 border-b border-border">
              <p className="text-xs text-muted-foreground mb-2">选择模块</p>
              <div className="flex flex-wrap gap-1.5">
                {moduleList.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => handleModuleChange(m.id)}
                    className={`px-2.5 py-1 text-xs rounded-md transition-colors ${
                      selectedModule === m.id
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-accent/50 text-muted-foreground hover:bg-accent'
                    }`}
                  >
                    {m.title.length > 8 ? m.title.slice(0, 8) + '…' : m.title}
                  </button>
                ))}
              </div>
            </div>

            {/* 编辑区 */}
            <div className="flex-1 p-4 overflow-y-auto">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="在这里记录你的学习笔记、疑问或心得..."
                className="w-full h-full min-h-[300px] p-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none text-sm leading-relaxed"
              />
            </div>

            {/* 底部 */}
            <div className="p-4 border-t border-border">
              <button
                onClick={handleSave}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                <Save className="w-4 h-4" />
                保存笔记
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
