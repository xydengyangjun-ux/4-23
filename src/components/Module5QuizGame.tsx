import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HEROES, QUIZ_LEVELS, Hero, STAT_LABELS } from '../data/gameData';
import { BrainCircuit, Swords, ShieldAlert, CheckCircle2, XCircle, ChevronRight } from 'lucide-react';
import { getPolygonPath } from '../utils/radarMath';

interface Props {
  onComplete: () => void;
}

type Phase = 'intro' | 'battle_prep' | 'battling' | 'question' | 'result' | 'game_over';

export default function Module5QuizGame({ onComplete }: Props) {
  const [currentLevelIndex, setCurrentLevelIndex] = useState(() => {
    const saved = localStorage.getItem('module5CurrentLevelIndex');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [phase, setPhase] = useState<Phase>(() => {
    const saved = localStorage.getItem('module5Phase');
    return (saved as Phase) || 'intro';
  });
  const [selectedHero, setSelectedHero] = useState<Hero | null>(null);
  const [battleResult, setBattleResult] = useState<'win' | 'lose' | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(() => {
    const saved = localStorage.getItem('module5Score');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [battleStep, setBattleStep] = useState<'approach' | 'clash' | 'knockback' | null>(null);

  useEffect(() => {
    localStorage.setItem('module5CurrentLevelIndex', currentLevelIndex.toString());
  }, [currentLevelIndex]);

  useEffect(() => {
    localStorage.setItem('module5Phase', phase);
  }, [phase]);

  useEffect(() => {
    localStorage.setItem('module5Score', score.toString());
  }, [score]);

  const cx = 250;
  const cy = 250;
  const radius = 200;

  const level = QUIZ_LEVELS[currentLevelIndex];

  // Get 3 random heroes for the current level
  const availableHeroes = useMemo(() => {
    const shuffled = [...HEROES].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  }, [currentLevelIndex]);

  const handleStart = () => {
    setPhase('battle_prep');
  };

  const handleSelectHero = (hero: Hero) => {
    setSelectedHero(hero);
    const heroStat = hero.stats[level.targetStat];
    const isWin = heroStat >= level.targetValue;
    setBattleResult(isWin ? 'win' : 'lose');
    setPhase('battling');
    setBattleStep('approach');
    
    setTimeout(() => setBattleStep('clash'), 500);
    setTimeout(() => setBattleStep('knockback'), 2000);
    setTimeout(() => {
      setPhase('question');
      setBattleStep(null);
    }, 3500);
  };

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    
    if (index === level.correctAnswer) {
      setScore(prev => prev + 1);
    }
    
    setTimeout(() => {
      setPhase('result');
    }, 1500);
  };

  const handleNextLevel = () => {
    if (currentLevelIndex < QUIZ_LEVELS.length - 1) {
      setCurrentLevelIndex(prev => prev + 1);
      setPhase('battle_prep');
      setSelectedHero(null);
      setBattleResult(null);
      setSelectedAnswer(null);
    } else {
      setPhase('game_over');
    }
  };

  const handleComplete = () => {
    // Reset quiz progress when completing and returning to home
    localStorage.removeItem('module5CurrentLevelIndex');
    localStorage.removeItem('module5Phase');
    localStorage.removeItem('module5Score');
    onComplete();
  };

  const renderRadarChart = (hero: Hero) => {
    const values = [
      hero.stats.combat,
      hero.stats.intelligence,
      hero.stats.eloquence,
      hero.stats.agility,
      hero.stats.luck
    ];
    const path = getPolygonPath(values, cx, cy, radius);

    return (
      <svg width="100" height="100" viewBox="0 0 500 500" className="opacity-80">
        {[20, 40, 60, 80, 100].map(val => (
          <polygon
            key={val}
            points={getPolygonPath([val, val, val, val, val], cx, cy, radius)}
            fill="none"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="1"
          />
        ))}
        <polygon
          points={path}
          fill="rgba(0, 255, 157, 0.3)"
          stroke="#00FF9D"
          strokeWidth="3"
        />
      </svg>
    );
  };

  if (phase === 'intro') {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-8">
        <motion.div 
          className="max-w-2xl glass-panel p-10 rounded-3xl border-cyber-purple/50 text-center"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <BrainCircuit className="w-20 h-20 text-cyber-purple mx-auto mb-6" />
          <h2 className="text-4xl font-calligraphy text-cyber-purple text-glow-purple mb-6">知识测验：群英大乱斗</h2>
          <p className="text-lg text-gray-300 mb-8 leading-relaxed">
            恭喜你完成了多个经典故事的挑战！现在，是时候检验你的学习成果了。
            <br/><br/>
            在这个小游戏中，你将面临 10 个关卡的考验。每一关都会出现一个强敌或困境，你需要从随机给出的三位英雄中，挑选出最合适的一位来应对。
            <br/><br/>
            战斗结束后，无论胜负，你都需要回答一道关于雷达图和多维数据分析的问题。准备好了吗？
          </p>
          <button
            onClick={handleStart}
            className="px-8 py-4 bg-cyber-purple text-white rounded-xl font-bold text-xl hover:bg-cyber-purple/80 transition-colors shadow-[0_0_15px_rgba(176,38,255,0.5)]"
          >
            开始测验
          </button>
        </motion.div>
      </div>
    );
  }

  if (phase === 'game_over') {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-8">
        <motion.div 
          className="max-w-2xl glass-panel p-10 rounded-3xl border-cyber-gold/50 text-center"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <h2 className="text-4xl font-calligraphy text-cyber-gold text-glow-gold mb-6">测验完成！</h2>
          <div className="text-6xl font-bold text-cyber-blue mb-8">
            {score} / 10
          </div>
          <p className="text-lg text-gray-300 mb-8 leading-relaxed">
            {score >= 8 ? "太棒了！你已经完全掌握了雷达图和多维数据分析的精髓，能够客观全面地评价复杂事物了！" :
             score >= 5 ? "不错！你对雷达图有了一定的了解，继续努力，学会从更多维度思考问题！" :
             "还需要加油哦！回顾一下雷达图的各个维度，不要被单一的标签所局限。"}
          </p>
          <button
            onClick={handleComplete}
            className="px-8 py-4 bg-cyber-gold text-cyber-navy rounded-xl font-bold text-xl hover:bg-yellow-400 transition-colors shadow-[0_0_15px_rgba(255,215,0,0.5)]"
          >
            返回首页
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 glass-panel p-4 rounded-2xl">
        <div className="text-xl font-bold text-cyber-blue">
          关卡 {currentLevelIndex + 1} / 10
        </div>
        <div className="text-xl font-bold text-cyber-purple">
          得分: {score}
        </div>
      </div>

      <div className="flex-1 flex gap-8 min-h-0">
        {/* Left: Battle Area */}
        <div className="flex-1 glass-panel rounded-3xl p-8 flex flex-col relative overflow-hidden">
          <div className="text-center mb-8 flex flex-col items-center">
            <motion.div 
              animate={{ y: [-5, 5, -5] }} 
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="relative mb-4"
            >
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.3)]">
                <img src={level.enemyAvatar} alt={level.enemyName} className="w-full h-full object-cover bg-white" />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full border border-black">
                敌将
              </div>
            </motion.div>
            <h3 className="text-2xl font-bold text-red-400 mb-2">{level.enemyName}</h3>
            <p className="text-gray-400">{level.enemyDesc}</p>
            <div className="mt-4 inline-block px-4 py-2 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 font-bold">
              需要 【{STAT_LABELS[level.targetStat]}】 &gt;= {level.targetValue}
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center relative">
            <AnimatePresence mode="wait">
              {phase === 'battle_prep' && (
                <motion.div 
                  key="prep"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex gap-4 w-full justify-center"
                >
                  {availableHeroes.map(hero => (
                    <div 
                      key={hero.id}
                      onClick={() => handleSelectHero(hero)}
                      className="w-48 bg-black/40 border border-white/10 rounded-xl p-4 cursor-pointer hover:border-cyber-blue hover:shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all flex flex-col items-center"
                    >
                      <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-cyber-blue/50 mb-3">
                        <img src={hero.avatar} alt={hero.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="font-bold text-lg mb-2">{hero.name}</div>
                      {renderRadarChart(hero)}
                      <div className="mt-2 text-xs text-gray-400">
                        {STAT_LABELS[level.targetStat]}: <span className={hero.stats[level.targetStat] >= level.targetValue ? 'text-cyber-green' : 'text-red-400'}>{hero.stats[level.targetStat]}</span>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}

              {phase === 'battling' && selectedHero && (
                <div className="flex items-center justify-center w-full h-64 relative overflow-hidden">
                  {/* Hero */}
                  <motion.div
                    className="absolute left-1/2 flex flex-col items-center z-20"
                    initial={{ x: -300, opacity: 0 }}
                    animate={{
                      x: battleStep === 'approach' ? -120 : battleStep === 'clash' ? [-120, -100, -140, -120] : battleStep === 'knockback' ? (battleResult === 'win' ? -50 : -400) : -300,
                      y: battleStep === 'knockback' && battleResult === 'lose' ? -100 : 0,
                      rotate: battleStep === 'knockback' && battleResult === 'lose' ? -180 : 0,
                      opacity: battleStep === 'knockback' && battleResult === 'lose' ? 0 : 1,
                      scale: battleStep === 'knockback' && battleResult === 'win' ? 1.2 : 1
                    }}
                    transition={battleStep === 'clash' ? { repeat: Infinity, duration: 0.3 } : { duration: 0.5 }}
                    style={{ marginLeft: '-64px' }}
                  >
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-cyber-blue bg-black shadow-[0_0_20px_rgba(0,240,255,0.5)]">
                      <img src={selectedHero.avatar} alt={selectedHero.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="mt-4 text-xl font-bold text-cyber-blue bg-black/50 px-4 py-1 rounded-full border border-cyber-blue/30">{selectedHero.name}</div>
                  </motion.div>

                  {/* Clash Effect */}
                  <AnimatePresence>
                    {battleStep === 'clash' && (
                      <motion.div 
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: [1, 1.5, 1], opacity: 1, rotate: [0, 180, 360] }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                        className="absolute z-30 text-cyber-gold"
                      >
                        <Swords className="w-20 h-20 drop-shadow-[0_0_15px_rgba(255,215,0,0.8)]" />
                      </motion.div>
                    )}
                    {battleStep === 'knockback' && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1.5, opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute z-30 font-calligraphy text-6xl drop-shadow-[0_0_20px_rgba(255,255,255,0.8)]"
                      >
                        {battleResult === 'win' ? <span className="text-cyber-green">大胜!</span> : <span className="text-red-500">败北!</span>}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Enemy */}
                  <motion.div
                    className="absolute left-1/2 flex flex-col items-center z-10"
                    initial={{ x: 300, opacity: 0 }}
                    animate={{
                      x: battleStep === 'approach' ? 120 : battleStep === 'clash' ? [120, 100, 140, 120] : battleStep === 'knockback' ? (battleResult === 'lose' ? 50 : 400) : 300,
                      y: battleStep === 'knockback' && battleResult === 'win' ? -100 : 0,
                      rotate: battleStep === 'knockback' && battleResult === 'win' ? 180 : 0,
                      opacity: battleStep === 'knockback' && battleResult === 'win' ? 0 : 1,
                      scale: battleStep === 'knockback' && battleResult === 'lose' ? 1.2 : 1
                    }}
                    transition={battleStep === 'clash' ? { repeat: Infinity, duration: 0.3 } : { duration: 0.5 }}
                    style={{ marginLeft: '-64px' }}
                  >
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-red-500 bg-white shadow-[0_0_20px_rgba(239,68,68,0.5)]">
                      <img src={level.enemyAvatar} alt={level.enemyName} className="w-full h-full object-cover" />
                    </div>
                    <div className="mt-4 text-xl font-bold text-red-400 bg-black/50 px-4 py-1 rounded-full border border-red-500/30">{level.enemyName}</div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right: Question Area */}
        <div className="w-96 glass-panel rounded-3xl flex flex-col relative overflow-hidden">
          {(phase === 'question' || phase === 'result') ? (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col h-full overflow-y-auto custom-scrollbar p-6"
            >
              <h3 className="text-xl flex-shrink-0 font-bold text-cyber-purple mb-6 flex items-center gap-2">
                <BrainCircuit className="w-6 h-6" /> 知识问答
              </h3>
              <p className="text-lg flex-shrink-0 mb-8">{level.question}</p>
              
              <div className="space-y-3 flex-shrink-0">
                {level.options.map((opt, idx) => {
                  let btnClass = "w-full text-left p-4 rounded-xl border transition-all ";
                  if (selectedAnswer === null) {
                    btnClass += "bg-black/40 border-white/10 hover:border-cyber-purple hover:bg-cyber-purple/20 cursor-pointer";
                  } else {
                    if (idx === level.correctAnswer) {
                      btnClass += "bg-cyber-green/20 border-cyber-green text-cyber-green";
                    } else if (idx === selectedAnswer) {
                      btnClass += "bg-red-500/20 border-red-500 text-red-400";
                    } else {
                      btnClass += "bg-black/40 border-white/10 opacity-50";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleAnswer(idx)}
                      disabled={selectedAnswer !== null}
                      className={btnClass}
                    >
                      <div className="flex items-center justify-between">
                        <span>{opt}</span>
                        {selectedAnswer !== null && idx === level.correctAnswer && <CheckCircle2 className="w-5 h-5" />}
                        {selectedAnswer !== null && idx === selectedAnswer && idx !== level.correctAnswer && <XCircle className="w-5 h-5" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {phase === 'result' && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 flex-shrink-0"
                >
                  <div className="p-4 bg-cyber-blue/10 border border-cyber-blue/30 rounded-xl mb-4">
                    <div className="font-bold text-cyber-blue mb-1">解析：</div>
                    <div className="text-sm text-gray-300">{level.explanation}</div>
                  </div>
                  <button
                    onClick={handleNextLevel}
                    className="w-full py-3 bg-cyber-blue text-cyber-navy rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-cyan-400 transition-colors"
                  >
                    下一关 <ChevronRight className="w-5 h-5" />
                  </button>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <BrainCircuit className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>完成战斗后解锁问题</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
