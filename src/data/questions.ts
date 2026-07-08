// EXPORTS: IQuestion, MOCK_QUESTIONS
export interface IQuestion {
  id: string
  moduleId: string
  level: 'basic' | 'intermediate' | 'advanced'
  type: 'single_choice' | 'fill_blank' | 'interactive' | 'proof' | 'essay'
  title: string
  options?: string[]
  correctAnswer: string
  analysis: string
  scorePoints?: string[]
}

export const MOCK_QUESTIONS: IQuestion[] = [
  {
    id: 'q1',
    moduleId: 'module5',
    level: 'basic',
    type: 'single_choice',
    title: '下列二面角的记法正确的是？',
    options: ['α-l-β', 'αβ-l', 'l-αβ', 'α-β'],
    correctAnswer: 'α-l-β',
    analysis: '二面角记法为：两个半平面字母夹棱，即α-l-β或α-AB-β。',
  },
  {
    id: 'q2',
    moduleId: 'module5',
    level: 'basic',
    type: 'fill_blank',
    title: '正方体ABCD-A₁B₁C₁D₁中，二面角A-BC-A₁的度数为____°',
    correctAnswer: '90',
    analysis: 'AB⊥BC，A₁B⊥BC，故∠ABA₁为平面角，正方体中为90°。',
  },
  {
    id: 'q3',
    moduleId: 'module5',
    level: 'intermediate',
    type: 'proof',
    title: '证明：若PA⊥平面ABC，AB⊥BC，则平面PAB⊥平面PBC。',
    correctAnswer: '线面垂直→面面垂直',
    analysis: 'BC⊥面PAB（BC⊥PA且BC⊥AB），BC⊂面PBC，故面PAB⊥面PBC。',
    scorePoints: ['证BC⊥PA（2分）', '证BC⊥AB（2分）', '得BC⊥面PAB（3分）', '结论面面垂直（3分）'],
  },
]