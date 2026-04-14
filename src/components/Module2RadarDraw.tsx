import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Hero, HEROES, STAT_LABELS, StatKey } from '../data/gameData';
import { getPointCoordinates, getPolygonPath, MAX_VALUE } from '../utils/radarMath';
import { CheckCircle2, ChevronRight, Wand2 } from 'lucide-react';

interface Props {
  onComplete: () => void;
}

const STAT_KEYS: StatKey[] = ['combat', 'intelligence', 'eloquence', 'agility', 'luck'];

export default function Module2RadarDraw({ onComplete }: Props) {
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [values, setValues] = useState<number[]>([0, 0, 0, 0, 0]);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  const currentHero = HEROES[currentHeroIndex];
  const isAutoMode = completedIds.size < 3; // First 3 heroes are auto-generated
  const isAllCompleted = completedIds.size === HEROES.length;

  const cx = 250;
  const cy = 250;
  const radius = 180;

  // Reset values when hero changes
  useEffect(() => {
    if (completedIds.has(currentHero.id)) {
      setValues(STAT_KEYS.map(key => currentHero.stats[key]));
    } else {
      setValues([0, 0, 0, 0, 0]);
    }
    setShowSuccess(false);
  }, [currentHeroIndex, completedIds]);

  // Check completion for manual mode
  useEffect(() => {
    if (completedIds.has(currentHero.id) || isAutoMode) return;

    const allCorrect = values.every((val, i) => val === currentHero.stats[STAT_KEYS[i]]);
    if (allCorrect && !showSuccess) {
      handleHeroComplete();
    }
  }, [values, currentHero, isAutoMode, showSuccess]);

  const handleHeroComplete = () => {
    setShowSuccess(true);
    setCompletedIds(prev => {
      const next = new Set(prev);
      next.add(currentHero.id);
      return next;
    });

    setTimeout(() => {
      setShowSuccess(false);
      const nextUncompletedIndex = HEROES.findIndex(h => !completedIds.has(h.id) && h.id !== currentHero.id);
      if (nextUncompletedIndex !== -1) {
        setCurrentHeroIndex(nextUncompletedIndex);
      }
    }, 1500);
  };

  const handleAutoGenerate = () => {
    if (completedIds.has(currentHero.id)) return;
    
    // Animate values to target
    setValues(STAT_KEYS.map(key => currentHero.stats[key]));
    
    // Mark as complete after animation
    setTimeout(() => {
      handleHeroComplete();
    }, 800);
  };

  const handlePointerDown = (index: number) => {
    if (completedIds.has(currentHero.id) || isAutoMode) return;
    setDraggingIndex(index);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (draggingIndex === null || !svgRef.current || completedIds.has(currentHero.id) || isAutoMode) return;

    const pt = svgRef.current.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const svgP = pt.matrixTransform(svgRef.current.getScreenCTM()?.inverse());

    const dx = svgP.x - cx;
    const dy = svgP.y - cy;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    let newValue = Math.round((distance / radius) * MAX_VALUE);
    
    const targetValue = currentHero.stats[STAT_KEYS[draggingIndex]];
    if (Math.abs(newValue - targetValue) <= 5) {
      newValue = targetValue;
    }

    newValue = Math.max(0, Math.min(MAX_VALUE, newValue));

    setValues(prev => {
      const next = [...prev];
      next[draggingIndex] = newValue;
      return next;
    });
  };

  const handlePointerUp = () => {
    setDraggingIndex(null);
  };

  const getAreaOpacity = () => {
    const sum = values.reduce((a, b) => a + b, 0);
    return Math.max(0.2, sum / (MAX_VALUE * 5));
  };

  return (
    <div className="flex w-full h-full gap-6">
      {/* Left Sidebar: Hero List */}
      <div className="w-64 glass-panel rounded-2xl flex flex-col overflow-hidden border-cyber-blue/30">
        <div className="p-4 border-b border-white/10 bg-black/20">
          <h3 className="font-bold text-cyber-blue">雷达图绘制进度</h3>
          <div className="text-sm text-gray-400 mt-1">{completedIds.size} / {HEROES.length} 已完成</div>
          <div className="w-full h-2 bg-black/50 rounded-full mt-2 overflow-hidden">
            <motion.div 
              className="h-full bg-cyber-blue"
              initial={{ width: 0 }}
              animate={{ width: `${(completedIds.size / HEROES.length) * 100}%` }}
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
          {HEROES.map((hero, idx) => {
            const isCompleted = completedIds.has(hero.id);
            const isActive = idx === currentHeroIndex;
            return (
              <button
                key={hero.id}
                onClick={() => setCurrentHeroIndex(idx)}
                className={`w-full flex items-center gap-3 p-2 rounded-lg transition-all text-left ${
                  isActive ? 'bg-cyber-blue/20 border border-cyber-blue/50' : 'hover:bg-white/5 border border-transparent'
                }`}
              >
                <div className={`w-10 h-10 rounded-full overflow-hidden border-2 ${isCompleted ? 'border-cyber-green' : isActive ? 'border-cyber-blue' : 'border-gray-600'}`}>
                  <img src={hero.avatar} alt={hero.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <div className={`font-bold text-sm ${isCompleted ? 'text-cyber-green' : isActive ? 'text-white' : 'text-gray-400'}`}>
                    {hero.name}
                  </div>
                  <div className="text-xs text-gray-500">{hero.novel}</div>
                </div>
                {isCompleted && <CheckCircle2 className="w-4 h-4 text-cyber-green" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex gap-6 items-center justify-center relative">
        {/* Reference Table */}
        <motion.div 
          key={currentHero.id + "-stats"}
          className="w-64 glass-panel rounded-2xl p-6 border-cyber-blue/30"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: 'spring', bounce: 0.4 }}
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-cyber-blue">
              <img src={currentHero.avatar} alt={currentHero.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-cyber-blue">{currentHero.name}</h2>
              <div className="text-xs text-gray-400">目标数据</div>
            </div>
          </div>
          
          <div className="space-y-3">
            {STAT_KEYS.map((key, i) => {
              const isMatch = values[i] === currentHero.stats[key];
              return (
                <div key={key} className={`flex items-center justify-between p-2 rounded-lg border transition-colors ${
                  isMatch ? 'bg-cyber-blue/20 border-cyber-blue text-cyber-blue' : 'bg-white/5 border-white/10'
                }`}>
                  <span className="text-base">{STAT_LABELS[key]}</span>
                  <span className="text-xl font-mono">{currentHero.stats[key]}</span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Interactive Radar Chart */}
        <motion.div 
          className="w-[550px] h-[550px] glass-panel rounded-2xl flex flex-col items-center justify-center relative border-cyber-gold/30"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <h2 className="absolute top-4 font-calligraphy text-2xl text-cyber-gold">角色雷达图</h2>
          <p className="absolute top-12 text-gray-400 text-sm">
            {isAutoMode && !completedIds.has(currentHero.id) 
              ? "点击下方按钮，感受雷达图的生成效果" 
              : completedIds.has(currentHero.id) 
                ? "绘制完成" 
                : "拖拽圆点，手动绘制雷达图"}
          </p>

          {showSuccess && (
            <motion.div 
              className="absolute inset-0 bg-cyber-navy/80 z-50 flex flex-col items-center justify-center rounded-2xl backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <CheckCircle2 className="w-24 h-24 text-cyber-gold mb-4" />
              <h2 className="font-calligraphy text-3xl text-cyber-gold text-glow-gold">绘制完成！</h2>
            </motion.div>
          )}

          <svg 
            ref={svgRef}
            width="450" 
            height="450" 
            viewBox="0 0 500 500"
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            className="mt-8 touch-none"
          >
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

            {/* Axes */}
            {STAT_KEYS.map((_, i) => {
              const endPt = getPointCoordinates(MAX_VALUE, i, cx, cy, radius);
              return (
                <line
                  key={i}
                  x1={cx}
                  y1={cy}
                  x2={endPt.x}
                  y2={endPt.y}
                  stroke="rgba(255, 255, 255, 0.2)"
                  strokeWidth="2"
                />
              );
            })}

            {/* Axis Labels */}
            {STAT_KEYS.map((key, i) => {
              const labelPt = getPointCoordinates(MAX_VALUE + 20, i, cx, cy, radius);
              return (
                <text
                  key={`label-${i}`}
                  x={labelPt.x}
                  y={labelPt.y}
                  fill="rgba(255, 255, 255, 0.6)"
                  fontSize="16"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="font-bold"
                >
                  {STAT_LABELS[key]}
                </text>
              );
            })}

            {/* Dynamic Polygon */}
            <motion.polygon
              points={getPolygonPath(values, cx, cy, radius)}
              fill={currentHero.color}
              stroke={currentHero.color}
              strokeWidth="3"
              initial={false}
              animate={{ 
                fillOpacity: getAreaOpacity(),
                points: getPolygonPath(values, cx, cy, radius)
              }}
              transition={{ type: 'spring', bounce: 0.3 }}
              style={{ mixBlendMode: 'screen' }}
            />

            {/* Draggable Points */}
            {values.map((val, i) => {
              const pt = getPointCoordinates(val, i, cx, cy, radius);
              const isMatch = val === currentHero.stats[STAT_KEYS[i]];
              const isInteractive = !completedIds.has(currentHero.id) && !isAutoMode;
              
              return (
                <g key={`pt-${i}`}>
                  <motion.circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isMatch ? 10 : 8}
                    fill={isMatch ? '#00FF9D' : currentHero.color}
                    stroke="#fff"
                    strokeWidth="2"
                    className={isInteractive ? "cursor-grab active:cursor-grabbing" : "cursor-default"}
                    onPointerDown={(e) => {
                      e.stopPropagation();
                      handlePointerDown(i);
                    }}
                    initial={false}
                    animate={{ cx: pt.x, cy: pt.y, r: isMatch ? 10 : 8 }}
                    transition={{ type: 'spring', bounce: 0.5 }}
                  />
                  {/* Value tooltip */}
                  {val > 0 && (
                    <motion.text
                      x={pt.x}
                      y={pt.y - 15}
                      fill={currentHero.color}
                      fontSize="14"
                      fontWeight="bold"
                      textAnchor="middle"
                      animate={{ x: pt.x, y: pt.y - 15 }}
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                    >
                      {val}
                    </motion.text>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Auto Generate Button for first 3 heroes */}
          {isAutoMode && !completedIds.has(currentHero.id) && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={handleAutoGenerate}
              className="absolute bottom-6 px-6 py-3 bg-cyber-purple text-white font-bold rounded-xl shadow-[0_0_15px_rgba(176,38,255,0.5)] hover:bg-purple-500 transition-colors flex items-center gap-2"
            >
              <Wand2 className="w-5 h-5" /> 一键生成雷达图
            </motion.button>
          )}

          {/* Dynamic feedback text */}
          {draggingIndex !== null && (
            <div className="absolute bottom-6 text-cyber-gold animate-pulse">
              哇！离中心越远，这项能力越强！
            </div>
          )}
        </motion.div>

        {/* Next Stage Overlay */}
        <AnimatePresence>
          {isAllCompleted && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-4 right-4 z-20"
            >
              <button
                onClick={onComplete}
                className="px-6 py-3 bg-cyber-green text-cyber-navy font-bold rounded-xl shadow-[0_0_20px_rgba(0,255,157,0.4)] hover:bg-green-400 transition-colors flex items-center gap-2"
              >
                进入下一关：组建破局小队 <ChevronRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
