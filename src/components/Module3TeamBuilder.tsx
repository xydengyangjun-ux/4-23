import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DndContext, useDraggable, useDroppable, DragEndEvent } from '@dnd-kit/core';
import { Hero, HEROES, STAT_LABELS, StatKey, Challenge } from '../data/gameData';
import { getPolygonPath, getPointCoordinates, MAX_VALUE } from '../utils/radarMath';
import { ChevronRight, ShieldAlert, Swords } from 'lucide-react';

interface Props {
  team: Hero[];
  setTeam: React.Dispatch<React.SetStateAction<Hero[]>>;
  onComplete: (teamName: string) => void;
  challenge: Challenge;
}

const STAT_KEYS: StatKey[] = ['combat', 'intelligence', 'eloquence', 'agility', 'luck'];

// Draggable Hero Card
const DraggableHero: React.FC<{ hero: Hero }> = ({ hero }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: hero.id,
    data: hero,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: 50,
    borderColor: hero.color
  } : { borderColor: hero.color };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="w-20 h-28 rounded-lg border-2 overflow-hidden cursor-grab active:cursor-grabbing hover:scale-105 transition-transform bg-cyber-navy flex flex-col items-center justify-between p-1"
    >
      <img src={hero.avatar} alt={hero.name} className="w-12 h-12 rounded-full object-cover mt-1" />
      <span className="text-xs font-bold text-center" style={{ color: hero.color }}>{hero.name}</span>
      <span className="text-[10px] text-gray-400">{hero.novel}</span>
    </div>
  );
};

// Droppable Slot
const DroppableSlot: React.FC<{ id: string, hero: Hero | null, onRemove: () => void }> = ({ id, hero, onRemove }) => {
  const { isOver, setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`w-24 h-32 rounded-xl border-2 flex items-center justify-center relative transition-colors ${
        isOver ? 'border-cyber-green bg-cyber-green/20' : 'border-white/20 bg-white/5'
      }`}
    >
      {hero ? (
        <div className="w-full h-full flex flex-col items-center justify-between p-2 relative group">
          <img src={hero.avatar} alt={hero.name} className="w-14 h-14 rounded-full object-cover mt-1 border-2" style={{ borderColor: hero.color }} />
          <span className="text-xs font-bold" style={{ color: hero.color }}>{hero.name}</span>
          <button 
            onClick={onRemove}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
          >
            ×
          </button>
        </div>
      ) : (
        <span className="text-white/30 text-xs">拖入角色</span>
      )}
    </div>
  );
}

export default function Module3TeamBuilder({ team, setTeam, onComplete, challenge }: Props) {
  const [phase, setPhase] = useState<'story' | 'build' | 'name' | 'analysis'>('story');
  const [teamName, setTeamName] = useState('');
  
  const cx = 250;
  const cy = 250;
  const radius = 180;

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && over.id.toString().startsWith('slot-')) {
      const hero = active.data.current as Hero;
      if (!team.find(h => h.id === hero.id) && team.length < 4) {
        setTeam(prev => [...prev, hero]);
      }
    }
  };

  const removeHero = (heroId: string) => {
    setTeam(prev => prev.filter(h => h.id !== heroId));
  };

  // Calculate if team covers the boss target
  const isCovered = useMemo(() => {
    if (team.length === 0) return false;
    return STAT_KEYS.every(key => {
      const maxTeamStat = Math.max(...team.map(h => h.stats[key]));
      return maxTeamStat >= challenge.requiredStats[key];
    });
  }, [team, challenge]);

  // Generate analysis text based on selected team
  const generateAnalysis = () => {
    return team.map(hero => {
      // Find the stat where this hero contributes the most to the team's max
      let bestStat: StatKey = 'combat';
      let maxContribution = -1;

      STAT_KEYS.forEach(key => {
        const teamMax = Math.max(...team.map(h => h.stats[key]));
        if (hero.stats[key] === teamMax && hero.stats[key] > maxContribution) {
          maxContribution = hero.stats[key];
          bestStat = key;
        }
      });

      return {
        hero,
        stat: bestStat,
        value: maxContribution,
        desc: `凭借高达 ${maxContribution} 的【${STAT_LABELS[bestStat]}】，弥补了团队在${STAT_LABELS[bestStat]}方面的需求，是不可或缺的核心力量。`
      };
    });
  };

  const handleSaveTeam = async () => {
    if (!teamName.trim()) return;
    onComplete(teamName);
  };

  if (phase === 'story') {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-8">
        <motion.div 
          className="max-w-3xl glass-panel p-10 rounded-3xl border-cyber-gold/50 relative overflow-hidden"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyber-gold to-transparent opacity-50" />
          
          <h1 className="font-calligraphy text-5xl text-cyber-gold text-center mb-8 text-glow-gold">
            经典重现：{challenge.name}
          </h1>
          
          <div className="space-y-6 text-xl leading-relaxed text-gray-200 text-justify font-serif">
            {challenge.story.split('\n\n').map((paragraph, i) => (
              <motion.p 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.3 }}
              >
                {paragraph}
              </motion.p>
            ))}
          </div>

          <motion.div 
            className="mt-12 flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <button
              onClick={() => setPhase('build')}
              className="px-8 py-4 bg-cyber-gold text-cyber-navy font-bold text-xl rounded-xl shadow-[0_0_30px_rgba(255,215,0,0.4)] hover:bg-yellow-400 transition-all hover:scale-105 flex items-center gap-3"
            >
              <Swords className="w-6 h-6" /> 选择出战阵容
            </button>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  if (phase === 'analysis') {
    const analysis = generateAnalysis();
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-8">
        <motion.div 
          className="max-w-4xl w-full glass-panel p-8 rounded-3xl border-cyber-green/50"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <h2 className="font-calligraphy text-4xl text-cyber-green text-center mb-8 text-glow-green">
            团队能力分析报告
          </h2>
          
          <div className="grid grid-cols-2 gap-6 mb-8">
            {analysis.map((item, i) => (
              <motion.div 
                key={item.hero.id}
                className="bg-black/30 p-4 rounded-xl border border-white/10 flex gap-4 items-start"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.2 }}
              >
                <img src={item.hero.avatar} alt={item.hero.name} className="w-16 h-16 rounded-full border-2" style={{ borderColor: item.hero.color }} />
                <div>
                  <h3 className="text-lg font-bold" style={{ color: item.hero.color }}>{item.hero.name}</h3>
                  <p className="text-sm text-gray-300 mt-1">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="bg-cyber-green/10 p-4 rounded-xl border border-cyber-green/30 mb-8 text-center">
            <p className="text-cyber-green font-bold text-lg">
              完美的团队组合！你们的综合能力雷达图已完全具备了识破伪装并击败白骨精的条件。
            </p>
          </div>

          <div className="flex justify-center">
            <button
              onClick={() => setPhase('name')}
              className="px-8 py-4 bg-cyber-green text-cyber-navy font-bold text-xl rounded-xl shadow-[0_0_30px_rgba(0,255,157,0.4)] hover:bg-green-400 transition-all hover:scale-105 flex items-center gap-3"
            >
              为小队命名 <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (phase === 'name') {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-8">
        <motion.div 
          className="max-w-2xl w-full glass-panel p-12 rounded-3xl border-cyber-blue/50 flex flex-col items-center"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <h2 className="font-calligraphy text-4xl text-cyber-blue text-center mb-8 text-glow-blue">
            赐名破局小队
          </h2>
          
          <div className="flex gap-4 mb-10">
            {team.map((hero, i) => (
              <motion.div 
                key={hero.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center"
              >
                <img src={hero.avatar} alt={hero.name} className="w-16 h-16 rounded-full border-2" style={{ borderColor: hero.color }} />
              </motion.div>
            ))}
          </div>

          <input
            type="text"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            placeholder="输入小队名称 (最多20字)"
            maxLength={20}
            className="w-full max-w-md bg-black/50 border-2 border-cyber-blue/50 rounded-xl px-6 py-4 text-xl text-white text-center focus:outline-none focus:border-cyber-blue transition-colors mb-10"
          />

          <button
            onClick={handleSaveTeam}
            disabled={!teamName.trim()}
            className="px-10 py-4 bg-cyber-blue text-white font-bold text-xl rounded-xl shadow-[0_0_30px_rgba(0,240,255,0.4)] hover:bg-blue-500 transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed flex items-center gap-3"
          >
            出征！进入大结局 <ChevronRight className="w-6 h-6" />
          </button>
        </motion.div>
      </div>
    );
  }

  // Build Phase
  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="flex w-full h-full gap-6">
        {/* Left: Radar Chart Area */}
        <div className="flex-1 glass-panel rounded-2xl flex flex-col items-center justify-center relative border-red-500/30">
          <div className="absolute top-4 text-center">
            <h2 className="font-calligraphy text-3xl text-red-500 text-glow-gold mb-1 flex items-center justify-center gap-2">
              <ShieldAlert className="w-8 h-8" /> {challenge.name}
            </h2>
            <p className="text-gray-300 max-w-md text-sm">{challenge.description}</p>
          </div>

          <svg width="450" height="450" viewBox="0 0 500 500" className="mt-16">
            {/* Background Grid */}
            {[20, 40, 60, 80, 100].map(val => (
              <polygon
                key={val}
                points={getPolygonPath([val, val, val, val, val], cx, cy, radius)}
                fill="none"
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth="1"
              />
            ))}

            {/* Axes & Labels */}
            {STAT_KEYS.map((key, i) => {
              const endPt = getPointCoordinates(MAX_VALUE, i, cx, cy, radius);
              const labelPt = getPointCoordinates(MAX_VALUE + 20, i, cx, cy, radius);
              return (
                <g key={i}>
                  <line x1={cx} y1={cy} x2={endPt.x} y2={endPt.y} stroke="rgba(255, 255, 255, 0.2)" strokeWidth="2" />
                  <text x={labelPt.x} y={labelPt.y} fill="rgba(255, 255, 255, 0.8)" fontSize="16" textAnchor="middle" alignmentBaseline="middle">
                    {STAT_LABELS[key]}
                  </text>
                </g>
              );
            })}

            {/* Boss Target Polygon (Red Shadow) */}
            <polygon
              points={getPolygonPath(STAT_KEYS.map(k => challenge.requiredStats[k]), cx, cy, radius)}
              fill="rgba(255, 0, 0, 0.2)"
              stroke="rgba(255, 0, 0, 0.8)"
              strokeWidth="2"
              strokeDasharray="5,5"
            />

            {/* Team Polygons */}
            <AnimatePresence>
              {team.map((hero) => (
                <motion.polygon
                  key={hero.id}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 0.6, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  points={getPolygonPath(STAT_KEYS.map(k => hero.stats[k]), cx, cy, radius)}
                  fill={hero.color}
                  stroke={hero.color}
                  strokeWidth="2"
                  style={{ mixBlendMode: 'screen' }}
                />
              ))}
            </AnimatePresence>
          </svg>

          {/* Status Overlay */}
          <div className="absolute bottom-6 flex flex-col items-center">
            {team.length < 4 ? (
              <div className="text-cyber-gold animate-pulse">
                请拖入4名角色组成小队 ({team.length}/4)
              </div>
            ) : isCovered ? (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                onClick={() => setPhase('analysis')}
                className="px-8 py-3 bg-cyber-green text-cyber-navy font-bold rounded-xl shadow-[0_0_20px_rgba(0,255,157,0.5)] hover:bg-green-400 transition-colors flex items-center gap-2"
              >
                查看团队分析报告 <ChevronRight className="w-5 h-5" />
              </motion.button>
            ) : (
              <div className="text-red-400 font-bold bg-red-900/50 px-4 py-2 rounded-lg border border-red-500">
                警告：团队综合能力未能覆盖魔王弱点，请更换角色！
              </div>
            )}
          </div>
        </div>

        {/* Right: Hero Roster & Slots */}
        <div className="w-80 flex flex-col gap-4">
          {/* Slots */}
          <div className="glass-panel rounded-2xl p-4 border-cyber-blue/30">
            <h3 className="text-center text-cyber-blue font-bold mb-4">破局小队</h3>
            <div className="grid grid-cols-2 gap-4 place-items-center">
              {[0, 1, 2, 3].map(i => (
                <DroppableSlot 
                  key={`slot-${i}`} 
                  id={`slot-${i}`} 
                  hero={team[i] || null} 
                  onRemove={() => removeHero(team[i].id)}
                />
              ))}
            </div>
          </div>

          {/* Roster */}
          <div className="flex-1 glass-panel rounded-2xl p-4 border-white/10 flex flex-col overflow-hidden">
            <h3 className="text-center text-gray-300 font-bold mb-4">候选角色</h3>
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
              <div className="grid grid-cols-3 gap-2 place-items-center">
                {HEROES.filter(h => !team.find(th => th.id === h.id)).map(hero => (
                  <DraggableHero key={hero.id} hero={hero} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DndContext>
  );
}
