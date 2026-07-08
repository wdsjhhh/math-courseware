// EXPORTS: ICourseModule, ICourseContent, MOCK_COURSE_CONTENT
export interface ICourseModule {
  id: string
  anchor: string
  title: string
  subtitle: string
  icon: string
  order: number
  keyPoints: string[]
}

export interface ICourseContent {
  id: string
  title: string
  subtitle: string
  subject: string
  grade: string
  coverImageUrl: string
  modules: ICourseModule[]
}

export const MOCK_COURSE_CONTENT: ICourseContent = {
  id: '1',
  title: '平面与平面垂直（第一课时）',
  subtitle: '高中数学立体几何交互课件',
  subject: '数学',
  grade: '高二年级',
  coverImageUrl: '',
  modules: [
    {
      id: 'm1',
      anchor: '#module1',
      title: '开篇导学·温故知新',
      subtitle: '回顾垂直关系，引入二面角概念',
      icon: 'BookOpen',
      order: 1,
      keyPoints: ['空间垂直关系层级', '二面角实景感知', '平面角与二面角类比'],
    },
    {
      id: 'm2',
      anchor: '#module2',
      title: '新知1 - 二面角核心概念',
      subtitle: '理解二面角定义与平面角作法',
      icon: 'Shapes',
      order: 2,
      keyPoints: ['二面角定义', '平面角作法', '二面角类型判断'],
    },
    {
      id: 'm3',
      anchor: '#module3',
      title: '新知2 - 面面垂直判定定理',
      subtitle: '掌握面面垂直的判定方法',
      icon: 'Cube',
      order: 3,
      keyPoints: ['判定定理内容', '三种语言转换', '定理证明过程'],
    },
    {
      id: 'm4',
      anchor: '#module4',
      title: '方法总结·解题模板',
      subtitle: '系统化梳理解题方法',
      icon: 'ListChecks',
      order: 4,
      keyPoints: ['二面角求解三步法', '面面垂直证明流程', '知识体系构建'],
    },
    {
      id: 'm5',
      anchor: '#module5',
      title: '分层随堂练习',
      subtitle: '即时检验学习效果',
      icon: 'PenTool',
      order: 5,
      keyPoints: ['基础巩固', '能力提升', '拓展探究'],
    },
    {
      id: 'm6',
      anchor: '#module6',
      title: '课堂小结 + 课后任务',
      subtitle: '游戏化巩固，分层作业',
      icon: 'Trophy',
      order: 6,
      keyPoints: ['知识点闯关', '分层任务', '预习下一节'],
    },
  ],
}