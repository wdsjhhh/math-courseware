const scopedStorage = {
  getItem: (key: string): string | null => localStorage.getItem(key),
  setItem: (key: string, value: string): void => localStorage.setItem(key, value),
  removeItem: (key: string): void => localStorage.removeItem(key),
};

export interface IWrongQuestion {
  id: string;
  moduleId: string;
  questionId: string;
  userAnswer: string;
  correctAnswer: string;
  timestamp: number;
}

const WRONG_KEY = 'mianmianchuizhi_wrongQuestions';

export function getWrongQuestions(): IWrongQuestion[] {
  try {
    const raw = scopedStorage.getItem(WRONG_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addWrongQuestion(q: IWrongQuestion) {
  const list = getWrongQuestions();
  const filtered = list.filter((x) => x.questionId !== q.questionId);
  filtered.push(q);
  scopedStorage.setItem(WRONG_KEY, JSON.stringify(filtered));
}

export function removeWrongQuestion(questionId: string) {
  const list = getWrongQuestions().filter((x) => x.questionId !== questionId);
  scopedStorage.setItem(WRONG_KEY, JSON.stringify(list));
}

export function clearWrongQuestions() {
  scopedStorage.removeItem(WRONG_KEY);
}

export interface IModuleProgress {
  [moduleId: string]: {
    completed: boolean;
    score?: number;
    completedAt?: number;
  };
}

const PROGRESS_KEY = 'mianmianchuizhi_progress';

export function getProgress(): IModuleProgress {
  try {
    const raw = scopedStorage.getItem(PROGRESS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function setModuleProgress(moduleId: string, data: { completed: boolean; score?: number }) {
  const progress = getProgress();
  progress[moduleId] = { ...progress[moduleId], ...data, completedAt: Date.now() };
  scopedStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
}

export interface INote {
  id: string;
  moduleId: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

const NOTES_KEY = 'mianmianchuizhi_notes';

export function getNotes(): INote[] {
  try {
    const raw = scopedStorage.getItem(NOTES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveNote(moduleId: string, content: string) {
  const notes = getNotes();
  const existing = notes.find((n) => n.moduleId === moduleId);
  if (existing) {
    existing.content = content;
    existing.updatedAt = Date.now();
  } else {
    notes.push({
      id: `note_${moduleId}_${Date.now()}`,
      moduleId,
      content,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  }
  scopedStorage.setItem(NOTES_KEY, JSON.stringify(notes));
}

export function getNoteByModule(moduleId: string): string {
  const note = getNotes().find((n) => n.moduleId === moduleId);
  return note?.content ?? '';
}

const THEME_KEY = 'mianmianchuizhi_theme';

export function getTheme(): 'light' | 'dark' {
  const t = scopedStorage.getItem(THEME_KEY);
  return t === 'dark' ? 'dark' : 'light';
}

export function setTheme(theme: 'light' | 'dark') {
  scopedStorage.setItem(THEME_KEY, theme);
}

const GAME_KEY = 'mianmianchuizhi_gameScore';

export function getGameScore(): number {
  const raw = scopedStorage.getItem(GAME_KEY);
  return raw ? Number(raw) || 0 : 0;
}

export function setGameScore(score: number) {
  const current = getGameScore();
  if (score > current) {
    scopedStorage.setItem(GAME_KEY, String(score));
  }
}
