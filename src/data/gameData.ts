export type StatKey = 'combat' | 'intelligence' | 'eloquence' | 'agility' | 'luck';

export interface Hero {
  id: string;
  name: string;
  title: string;
  novel: string;
  bio: string;
  stats: Record<StatKey, number>;
  color: string;
  avatar: string;
}

export const STAT_LABELS: Record<StatKey, string> = {
  combat: '武艺',
  intelligence: '智谋',
  eloquence: '辩才',
  agility: '身法',
  luck: '机缘',
};

/* 
  =========================================================================
  🖼️ 【本地图片替换全局指南】
  1. 在项目的根目录下，找到 `public` 文件夹（如果没有请手动新建一个）。
  2. 在 `public` 文件夹内，新建一个名为 `heroes` 的文件夹。
  3. 将你准备好的英雄立绘图片，按照下方每个英雄的 id 命名（如 zhuge.jpg, zhangfei.jpg 等）。
  4. 将图片放入 `public/heroes/` 目录中。
  5. 将下方每个英雄配置中 `avatar: '/heroes/xxx.jpg'` 的注释取消掉。
  6. 将原本的 `avatar: 'https://picsum.photos/...'` 注释掉或删除。
  =========================================================================
*/

export const HEROES: Hero[] = [
  // === 三国演义 ===
  {
    id: 'zhuge', name: '诸葛亮', title: '卧龙先生', novel: '三国演义',
    bio: '字孔明，号卧龙。他【智谋】超群，高达100，能借东风、草船借箭；【辩才】无双，舌战群儒，达到95；虽【武艺】平平仅有30，但【身法】稳健，乘坐四轮车也有60；一生【机缘】深厚，得刘备三顾茅庐，机缘值85。',
    stats: { combat: 30, intelligence: 100, eloquence: 95, agility: 60, luck: 85 },
    color: '#00E5FF', avatar: 'https://picsum.photos/seed/zhuge/200/200',
  },
  {
    id: 'zhangfei', name: '张飞', title: '燕人张翼德', novel: '三国演义',
    bio: '字翼德。长坂坡上一声吼，吓退曹操百万军。【武艺】绝伦，高达98；【身法】矫健，骑马冲锋势不可挡，达到85；【智谋】粗中有细，有60分；【辩才】粗犷，仅有40；【机缘】随大哥刘备，有75分。',
    stats: { combat: 98, intelligence: 60, eloquence: 40, agility: 85, luck: 75 },
    color: '#FFD700', avatar: 'https://picsum.photos/seed/zhangfei/200/200',
  },
  {
    id: 'guanyu', name: '关羽', title: '武圣', novel: '三国演义',
    bio: '字云长，过五关斩六将。【武艺】超凡入圣，高达98；【身法】骑乘赤兔马，达到90；【智谋】熟读春秋，有75分；【辩才】威严庄重，有65分；【机缘】桃园结义，有80分。',
    stats: { combat: 98, intelligence: 75, eloquence: 65, agility: 90, luck: 80 },
    color: '#00FF9D', avatar: 'https://picsum.photos/seed/guanyu/200/200',
  },
  {
    id: 'caocao', name: '曹操', title: '乱世奸雄', novel: '三国演义',
    bio: '字孟德，挟天子以令诸侯。【智谋】深不可测，高达95；【辩才】善于赋诗演讲，达到90；【武艺】精通剑术，有75分；【身法】多次脱险，有80分；【机缘】占据天时，高达90分。',
    stats: { combat: 75, intelligence: 95, eloquence: 90, agility: 80, luck: 90 },
    color: '#FF4500', avatar: 'https://picsum.photos/seed/caocao/200/200',
  },

  // === 水浒传 ===
  {
    id: 'wusong', name: '武松', title: '行者', novel: '水浒传',
    bio: '景阳冈打虎英雄。【武艺】高强，拳脚了得，高达95；【身法】敏捷，能避开猛虎扑击，有85；【智谋】有胆有识，有70；【辩才】直来直去，有50；【机缘】结识宋江等好汉，有75。',
    stats: { combat: 95, intelligence: 70, eloquence: 50, agility: 85, luck: 75 },
    color: '#FF8C00', avatar: 'https://picsum.photos/seed/wusong/200/200',
  },
  {
    id: 'linchong', name: '林冲', title: '豹子头', novel: '水浒传',
    bio: '八十万禁军教头。【武艺】枪法绝伦，高达96；【身法】步战马战皆精，有85；【智谋】隐忍退让，有65；【辩才】不善言辞，有45；【机缘】屡遭陷害，仅有40。',
    stats: { combat: 96, intelligence: 65, eloquence: 45, agility: 85, luck: 40 },
    color: '#4169E1', avatar: 'https://picsum.photos/seed/linchong/200/200',
  },
  {
    id: 'songjiang', name: '宋江', title: '及时雨', novel: '水浒传',
    bio: '梁山泊大寨主。【智谋】善于统御，高达85；【辩才】极具煽动性，达到95；【武艺】平庸，仅有40；【身法】普通，有50；【机缘】威望极高，高达90。',
    stats: { combat: 40, intelligence: 85, eloquence: 95, agility: 50, luck: 90 },
    color: '#8A2BE2', avatar: 'https://picsum.photos/seed/songjiang/200/200',
  },
  {
    id: 'luzhishen', name: '鲁智深', title: '花和尚', novel: '水浒传',
    bio: '倒拔垂杨柳，力大无穷。【武艺】禅杖威猛，高达95；【身法】步战灵活，有75；【智谋】粗中有细，有60；【辩才】性格直爽，有50；【机缘】终成正果，高达85。',
    stats: { combat: 95, intelligence: 60, eloquence: 50, agility: 75, luck: 85 },
    color: '#2E8B57', avatar: 'https://picsum.photos/seed/luzhishen/200/200',
  },

  // === 西游记 ===
  {
    id: 'sunwukong', name: '孙悟空', title: '齐天大圣', novel: '西游记',
    bio: '由开天辟地以来的仙石孕育而生。【武艺】通天，高达100；一个筋斗云十万八千里，【身法】更是达到极限100；【智谋】机灵，有85；【辩才】常与妖精斗嘴，有80；【机缘】天定取经人，高达95。',
    stats: { combat: 100, intelligence: 85, eloquence: 80, agility: 100, luck: 95 },
    color: '#FFD700', avatar: 'https://picsum.photos/seed/sunwukong/200/200',
  },
  {
    id: 'tangseng', name: '唐僧', title: '金蝉子', novel: '西游记',
    bio: '如来佛祖座下二徒弟转世。【智谋】佛法高深，有80；【辩才】善于说教，高达95；【武艺】手无缚鸡之力，仅有10；【身法】凡夫俗子，有20；【机缘】有诸天神佛暗中保护，达到极限100。',
    stats: { combat: 10, intelligence: 80, eloquence: 95, agility: 20, luck: 100 },
    color: '#FFB6C1', avatar: 'https://picsum.photos/seed/tangseng/200/200',
  },
  {
    id: 'zhubajie', name: '猪八戒', title: '天蓬元帅', novel: '西游记',
    bio: '原为天庭水军统帅。【武艺】九齿钉耙威力不俗，有85；【身法】略显笨重，有60；【智谋】常有小聪明，有70；【辩才】油嘴滑舌，有85；【机缘】错投猪胎，有60。',
    stats: { combat: 85, intelligence: 70, eloquence: 85, agility: 60, luck: 60 },
    color: '#A0522D', avatar: 'https://picsum.photos/seed/zhubajie/200/200',
  },
  {
    id: 'shaseng', name: '沙僧', title: '卷帘大将', novel: '西游记',
    bio: '性格憨厚，任劳任怨。【武艺】降妖宝杖稳扎稳打，有75；【身法】水性极佳，有70；【智谋】老实本分，有60；【辩才】沉默寡言，仅有40；【机缘】得遇唐僧，有70。',
    stats: { combat: 75, intelligence: 60, eloquence: 40, agility: 70, luck: 70 },
    color: '#4682B4', avatar: 'https://picsum.photos/seed/shaseng/200/200',
  },

  // === 红楼梦 ===
  {
    id: 'lindaiyu', name: '林黛玉', title: '潇湘妃子', novel: '红楼梦',
    bio: '前世为绛珠仙草。【智谋】极高，心思细腻，才华横溢，高达95；【辩才】犀利，常能噎得人说不出话，有90；【武艺】娇弱，仅有10；【身法】如弱柳扶风，有40；【机缘】与宝玉木石前盟，有80。',
    stats: { combat: 10, intelligence: 95, eloquence: 90, agility: 40, luck: 80 },
    color: '#B026FF', avatar: 'https://picsum.photos/seed/lindaiyu/200/200',
  },
  {
    id: 'jiabaoyu', name: '贾宝玉', title: '怡红公子', novel: '红楼梦',
    bio: '神瑛侍者转世，衔玉而生。【智谋】悟性极高，有85；【辩才】善解人意，有85；【武艺】不喜习武，仅有15；【身法】普通，有50；【机缘】集万千宠爱于一身，高达90。',
    stats: { combat: 15, intelligence: 85, eloquence: 85, agility: 50, luck: 90 },
    color: '#FF69B4', avatar: 'https://picsum.photos/seed/jiabaoyu/200/200',
  },
  {
    id: 'xuebaochai', name: '薛宝钗', title: '蘅芜君', novel: '红楼梦',
    bio: '品格端庄，容貌丰美。【智谋】博学多才，处事圆滑，高达90；【辩才】说话得体，有85；【武艺】大家闺秀，仅有15；【身法】端庄稳重，有45；【机缘】金玉良缘，有85。',
    stats: { combat: 15, intelligence: 90, eloquence: 85, agility: 45, luck: 85 },
    color: '#F0E68C', avatar: 'https://picsum.photos/seed/xuebaochai/200/200',
  },
  {
    id: 'wangxifeng', name: '王熙凤', title: '凤辣子', novel: '红楼梦',
    bio: '精明强干，贾府的实际大管家。【智谋】极具管理才能，高达90；【辩才】八面玲珑，巧言令色，高达95；【武艺】泼辣，有20；【身法】雷厉风行，有60；【机缘】权倾一时，有75。',
    stats: { combat: 20, intelligence: 90, eloquence: 95, agility: 60, luck: 75 },
    color: '#DC143C', avatar: 'https://picsum.photos/seed/wangxifeng/200/200',
  }
];

export interface Challenge {
  id: string;
  name: string;
  story: string;
  description: string;
  requiredStats: Record<StatKey, number>;
}

export interface QuizLevel {
  id: number;
  enemyName: string;
  enemyAvatar: string;
  enemyDesc: string;
  targetStat: StatKey;
  targetValue: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export const QUIZ_LEVELS: QuizLevel[] = [
  {
    id: 1,
    enemyName: '华雄',
    enemyAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=HuaXiong&backgroundColor=ffdfbf',
    enemyDesc: '董卓麾下猛将，正在阵前搦战，急需一员猛将将其斩杀！',
    targetStat: 'combat',
    targetValue: 85,
    question: '在分析人物或事物时，为什么我们要采用“多角度”的数据分析方法，而不是只看单一维度？',
    options: ['因为数据越复杂越好', '能够更全面了解特征和规律，进而精准定位问题', '为了能画出雷达图', '因为单一维度的数据无法被收集'],
    correctAnswer: 1,
    explanation: '多角度的数据分析更有利于人们精准定位问题，全面了解数据特征和规律，继而发现数据背后的价值。'
  },
  {
    id: 2,
    enemyName: '王朗',
    enemyAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=WangLang&backgroundColor=c0aede',
    enemyDesc: '王朗在阵前大放厥词，需要一位口才极佳的人将其驳倒！',
    targetStat: 'eloquence',
    targetValue: 90,
    question: '在雷达图中，某个项目的评分数据越高，它在图形上的表现是怎样的？',
    options: ['距离中心点越近', '距离中心点越远', '颜色会变得更深', '连线会变得更粗'],
    correctAnswer: 1,
    explanation: '在雷达图中，无论考察什么项目，其评分越高，距离中心原点就会越远。'
  },
  {
    id: 3,
    enemyName: '祝家庄迷宫',
    enemyAvatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=Maze&backgroundColor=000000',
    enemyDesc: '祝家庄地形复杂，机关重重，需要极高的智谋才能破解阵法！',
    targetStat: 'intelligence',
    targetValue: 85,
    question: '不同单位的数据（比如时间“秒”和长度“厘米”），可以直接保留原数值在同一个雷达图里比大小吗？',
    options: ['不可以，必须先根据标准换算成统一的“得分”', '可以，只要画在不同的轴上就行', '可以，数值越大的代表能力越强', '这两种数据永远无法放在一起比较'],
    correctAnswer: 0,
    explanation: '不同维度的原始数据往往单位不同，必须先经过“标准化”换算成同一量纲的分数（如全部换换为百分制得分），才能在雷达图上进行相对直观的比较。'
  },
  {
    id: 4,
    enemyName: '时迁的挑战',
    enemyAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ShiQian&backgroundColor=b6e3f4',
    enemyDesc: '鼓上蚤时迁轻功了得，想要抓住他，必须身法比他更灵活！',
    targetStat: 'agility',
    targetValue: 80,
    question: '为什么大部分我们在实际中遇到的人或事物，其雷达图呈现的往往是不规则的多边形，而不是正多边形？',
    options: ['因为电脑生成的随机误差', '因为同一目标对象下的不同项目，必然存在数据等级（分数）的差异', '因为正多边形不美观', '因为雷达图不允许出现正多边形'],
    correctAnswer: 1,
    explanation: '只有当同一目标对象下的不同项目处于同一数据等级时，到中心点的距离才完全相等（呈现正多边形）。实际中的差异造就了不规则的图形。'
  },
  {
    id: 5,
    enemyName: '草船借箭的迷雾',
    enemyAvatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=Fog&backgroundColor=e2e8f0',
    enemyDesc: '江面上大雾弥漫，想要成功借到十万支箭，除了智谋，还需要极大的运气！',
    targetStat: 'luck',
    targetValue: 85,
    question: '当我们在同一张雷达图上绘制多个目标对象（如同时展示孙悟空和猪八戒的图形）时，最常用的区分方法是什么？',
    options: ['用不同的颜色来区分不同目标对象的数据多边形', '只能做成多张图片分开看', '只保留两个人差距最大的那个维度数据', '把他们的分数加起来只画一个图形'],
    correctAnswer: 0,
    explanation: '对于多个目标对象，常采用不同的颜色来区分生成的图形区域，这样可以非常直观地对比它们在各项目上的长短板差异。'
  },
  {
    id: 6,
    enemyName: '吕布',
    enemyAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=LuBu&backgroundColor=ffdfbf',
    enemyDesc: '人中吕布，马中赤兔！面对天下无双的猛将，必须全力以赴！',
    targetStat: 'combat',
    targetValue: 95,
    question: '在用数字化工具生成雷达图或统计图表之前，我们必须做的第一步核心准备工作是什么？',
    options: ['凭感觉在雷达图上拖拽圆点', '确定评价目标，设计数据表格并收集相关得分数据', '为每个数据轴分配好看的颜色', '调整图表的背景透明度'],
    correctAnswer: 1,
    explanation: '数据收集是可视化的基础：需要首先设计数据表格，并针对目标对象的各项指标收集对应的数据。'
  },
  {
    id: 7,
    enemyName: '舌战群儒',
    enemyAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Scholars&backgroundColor=c0aede',
    enemyDesc: '东吴谋臣如云，想要说服他们抗曹，必须拥有压倒性的辩才！',
    targetStat: 'eloquence',
    targetValue: 95,
    question: '在雷达图中，如果组建小队时两个角色的图形恰好呈现“凹凸互补”的状态，这对多维团队评价意味着什么？',
    options: ['团队会经常因为观点不合争吵', '团队的综合能力雷达图会趋于饱满覆盖全维度，没有明显短板', '说明这两个角色的能力完全一样', '图形最终会变成一个直线'],
    correctAnswer: 1,
    explanation: '互补的雷达图意味着一个人分数低的项目，刚好是另一个人分数高的项目，组合在一起就能从多个角度覆盖任务挑战的需求。'
  },
  {
    id: 8,
    enemyName: '空城计',
    enemyAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SimaYi&backgroundColor=b6e3f4',
    enemyDesc: '司马懿大军压境，城内空虚，只能依靠极致的智谋和心理战退敌！',
    targetStat: 'intelligence',
    targetValue: 95,
    question: '基于本课所学经验，雷达图这种可视化图表最核心的应用优势是什么？',
    options: ['取代所有其他的图表类型（如柱状图、饼图）', '能够从多个角度对一个或多个对象进行综合评估与直观分析对比', '专门用来展示数据在一段时间内的发展趋势', '仅仅是为了把枯燥的数字变成漂亮的几何图形'],
    correctAnswer: 1,
    explanation: '这正是雷达图的教学目标所在：学会从多角度综合分析一个目标对象，并用可视化呈现多对象的对比分析结果。'
  },
  {
    id: 9,
    enemyName: '长坂坡救主',
    enemyAvatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=Army&backgroundColor=ffdfbf',
    enemyDesc: '曹军百万大军重重包围，想要七进七出，身法和武力缺一不可！',
    targetStat: 'agility',
    targetValue: 90,
    question: '如果在体质健康测试雷达图中，我们将男生的50米跑成绩和女生的50米跑成绩直接混在一起按秒数画图相比，会有什么问题？',
    options: ['男生的画笔颜色会变错', '秒数越小越好，但如果不按男女性别的《标准》分开换算成得分，就无法实现客观公平的综合评价比对', '无法画出超过50的刻度', '女生必须要跑100米才能画图'],
    correctAnswer: 1,
    explanation: '不同人群的评价标准不同。如果不按照对应的各自标准换算得分为同一量纲，强行放在一起对比会有失偏颇。'
  },
  {
    id: 10,
    enemyName: '天道轮回',
    enemyAvatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=Destiny&backgroundColor=000000',
    enemyDesc: '最终的考验！面对命运的无常，唯有极高的机缘与气运方能化险为夷！',
    targetStat: 'luck',
    targetValue: 90,
    question: '在实际生活中，我们学习并运用多角度数据分析方法（如雷达图）的最终目的是什么？',
    options: ['为了让课本更厚一点', '为了替代所有的文字描述', '为了精准定位问题，全面了解数据特征和规律，进而发现数据背后的价值', '为了能在电脑上画出非常规矩的圆形'],
    correctAnswer: 2,
    explanation: '教科书中多次强调，数据分析的核心目的是发现规律、定位问题，并产生实际价值。'
  }
];

export const CHALLENGES: Challenge[] = [
  {
    id: 'baigujing',
    name: '三打白骨精',
    story: `在《西游记》的经典故事【三打白骨精】中，唐僧师徒遇到了诡计多端、善于变化的白骨精。她先后化作村姑、老妇和老翁，试图欺骗唐僧，离间师徒关系。

面对这样复杂的局面，仅仅依靠单一的能力是无法破局的。我们需要高超的武艺来击退妖魔，需要极高的智谋来识破伪装，更需要卓越的辩才来澄清误会、稳住阵脚。

现在，请你从四大名著的英雄中，挑选出四位角色组成一支全新的“破局小队”。请仔细观察本次挑战的属性要求，结合你之前绘制的角色雷达图，挑选出最完美的组合吧！`,
    description: '白骨精诡计多端，需高武力破其妖法，高智谋识其伪装，高辩才揭其真面目！',
    requiredStats: { combat: 95, intelligence: 90, eloquence: 90, agility: 85, luck: 85 }
  },
  {
    id: 'chibi',
    name: '赤壁之战',
    story: `在《三国演义》的经典战役【赤壁之战】中，曹操大军压境，东吴与刘备结盟抗曹。

面对百万雄师，单凭武力无法取胜。我们需要极高的智谋来制定火攻之计，需要卓越的辩才来促成孙刘联盟，还需要极高的敏捷与运气来借东风！

现在，请你从四大名著的英雄中，挑选出四位角色组成一支全新的“抗曹小队”。请仔细观察本次挑战的属性要求，挑选出最完美的组合吧！`,
    description: '曹军势大，需绝顶智谋定计，高超辩才结盟，极高运气借东风！',
    requiredStats: { combat: 80, intelligence: 95, eloquence: 95, agility: 85, luck: 90 }
  },
  {
    id: 'jingyanggang',
    name: '景阳冈打虎',
    story: `在《水浒传》的经典桥段【景阳冈打虎】中，一只吊睛白额大虫危害乡里，过往客商无不胆寒。

面对凶猛的野兽，我们需要极致的武力来正面抗衡，需要极高的敏捷来躲避猛虎的扑咬，还需要过人的胆识与运气！

现在，请你从四大名著的英雄中，挑选出四位角色组成一支全新的“打虎小队”。请仔细观察本次挑战的属性要求，挑选出最完美的组合吧！`,
    description: '猛虎凶险，需极致武力镇压，极高敏捷闪避，过人运气防身！',
    requiredStats: { combat: 95, intelligence: 70, eloquence: 60, agility: 90, luck: 85 }
  },
  {
    id: 'caochuan',
    name: '草船借箭',
    story: `在《三国演义》的经典桥段【草船借箭】中，周瑜故意刁难诸葛亮，限其十日内造出十万支箭。

面对这看似不可能完成的任务，我们需要极高的智谋来识天象、定奇计，需要极高的运气来确保大雾漫天，还需要极高的身法来在江面上穿梭自如！

现在，请你从四大名著的英雄中，挑选出四位角色组成一支全新的“借箭小队”。请仔细观察本次挑战的属性要求，挑选出最完美的组合吧！`,
    description: '江面凶险，需绝顶智谋识天象，极高运气借大雾，灵动身法穿梭！',
    requiredStats: { combat: 50, intelligence: 98, eloquence: 80, agility: 85, luck: 95 }
  }
];
