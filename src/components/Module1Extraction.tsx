import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Hero, HEROES, STAT_LABELS, StatKey } from '../data/gameData';
import { CheckCircle2, ChevronRight } from 'lucide-react';

interface Props {
  onComplete: () => void;
}

export default function Module1Extraction({ onComplete }: Props) {
  const [completedIds, setCompletedIds] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('module1CompletedIds');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [inputs, setInputs] = useState<Record<StatKey, string>>({
    combat: '', intelligence: '', eloquence: '', agility: '', luck: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [isAutoFillUnlocked, setIsAutoFillUnlocked] = useState(false);

  useEffect(() => {
    localStorage.setItem('module1CompletedIds', JSON.stringify(Array.from(completedIds)));
  }, [completedIds]);

  useEffect(() => {
    // 3 minutes (180,000 ms) timer, resets on component mount (not saved to localStorage)
    const timer = setTimeout(() => {
      setIsAutoFillUnlocked(true);
    }, 3 * 60 * 1000);

    return () => clearTimeout(timer);
  }, []);

  const currentHero = HEROES[currentHeroIndex];

  // Reset inputs when hero changes
  useEffect(() => {
    if (completedIds.has(currentHero.id)) {
      // If already completed, fill with correct stats
      setInputs({
        combat: currentHero.stats.combat.toString(),
        intelligence: currentHero.stats.intelligence.toString(),
        eloquence: currentHero.stats.eloquence.toString(),
        agility: currentHero.stats.agility.toString(),
        luck: currentHero.stats.luck.toString(),
      });
    } else {
      setInputs({ combat: '', intelligence: '', eloquence: '', agility: '', luck: '' });
    }
    setShowSuccess(false);
  }, [currentHeroIndex, completedIds]);

  const handleInputChange = (key: StatKey, value: string) => {
    if (completedIds.has(currentHero.id)) return; // Prevent editing if already completed
    
    setInputs(prev => {
      const next = { ...prev, [key]: value };
      checkCompletion(next);
      return next;
    });
  };

  const checkCompletion = (currentInputs: Record<StatKey, string>) => {
    const allCorrect = (Object.keys(STAT_LABELS) as StatKey[]).every(
      key => parseInt(currentInputs[key]) === currentHero.stats[key]
    );
    
    if (allCorrect) {
      setShowSuccess(true);
      setCompletedIds(prev => {
        const next = new Set(prev);
        next.add(currentHero.id);
        return next;
      });

      setTimeout(() => {
        setShowSuccess(false);
        // Auto-advance to next uncompleted hero
        const nextUncompletedIndex = HEROES.findIndex(h => !completedIds.has(h.id) && h.id !== currentHero.id);
        if (nextUncompletedIndex !== -1) {
          setCurrentHeroIndex(nextUncompletedIndex);
        }
      }, 1500);
    }
  };

  const handleAutoFill = () => {
    setInputs({
      combat: currentHero.stats.combat.toString(),
      intelligence: currentHero.stats.intelligence.toString(),
      eloquence: currentHero.stats.eloquence.toString(),
      agility: currentHero.stats.agility.toString(),
      luck: currentHero.stats.luck.toString(),
    });
    checkCompletion({
      combat: currentHero.stats.combat.toString(),
      intelligence: currentHero.stats.intelligence.toString(),
      eloquence: currentHero.stats.eloquence.toString(),
      agility: currentHero.stats.agility.toString(),
      luck: currentHero.stats.luck.toString(),
    });
  };

  // Highlight numbers in bio
  const renderBio = () => {
    const parts = currentHero.bio.split(/(\d+)/);
    return parts.map((part, i) => {
      if (/\d+/.test(part)) {
        return <span key={i} className="text-cyber-gold font-bold text-xl">{part}</span>;
      }
      return <span key={i}>{part}</span>;
    });
  };

  const isAllCompleted = completedIds.size === HEROES.length;

  return (
    <div className="flex w-full h-full gap-6">
      {/* Left Sidebar: Hero List */}
      <div className="w-64 glass-panel rounded-2xl flex flex-col overflow-hidden border-cyber-purple/30">
        <div className="p-4 border-b border-white/10 bg-black/20">
          <h3 className="font-bold text-cyber-purple">名著角色录入进度</h3>
          <div className="text-sm text-gray-400 mt-1">{completedIds.size} / {HEROES.length} 已完成</div>
          {/* Progress bar */}
          <div className="w-full h-2 bg-black/50 rounded-full mt-2 overflow-hidden">
            <motion.div 
              className="h-full bg-cyber-purple"
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
                  isActive ? 'bg-cyber-purple/20 border border-cyber-purple/50' : 'hover:bg-white/5 border border-transparent'
                }`}
              >
                <div className={`w-10 h-10 rounded-full overflow-hidden border-2 ${isCompleted ? 'border-cyber-green' : isActive ? 'border-cyber-purple' : 'border-gray-600'}`}>
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
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentHero.id + "-bio"}
            className="w-1/2 max-w-md glass-panel rounded-2xl p-6 flex flex-col items-center border-cyber-gold/30"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 20, opacity: 0 }}
            transition={{ type: 'spring', bounce: 0.4 }}
          >
            <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-cyber-gold/50 shadow-[0_0_20px_rgba(255,215,0,0.3)] mb-4">
              <img src={currentHero.avatar} alt={currentHero.name} className="w-full h-full object-cover" />
            </div>
            <h2 className="font-calligraphy text-3xl text-cyber-gold mb-1">{currentHero.name}</h2>
            <div className="flex gap-2 mb-4">
              <span className="px-2 py-1 bg-white/10 rounded text-xs text-gray-300">{currentHero.novel}</span>
              <span className="px-2 py-1 bg-white/10 rounded text-xs text-gray-300">{currentHero.title}</span>
            </div>
            <p className="text-base leading-relaxed text-gray-200 text-justify">
              {renderBio()}
            </p>
          </motion.div>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.div 
            key={currentHero.id + "-inputs"}
            className="w-1/2 max-w-md glass-panel rounded-2xl p-8 border-cyber-green/30 relative overflow-hidden"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            transition={{ type: 'spring', bounce: 0.4, delay: 0.1 }}
          >
            {showSuccess && (
              <motion.div 
                className="absolute inset-0 bg-cyber-gold/20 z-10 flex items-center justify-center backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', bounce: 0.6 }}
                  className="flex flex-col items-center"
                >
                  <CheckCircle2 className="w-20 h-20 text-cyber-gold mb-4" />
                  <h2 className="font-calligraphy text-2xl text-cyber-gold text-glow-gold">数据提取成功！</h2>
                </motion.div>
              </motion.div>
            )}

            <h2 className="text-xl font-bold text-cyber-green mb-6 text-center">星探档案馆 - 数据录入</h2>
            
            {isAutoFillUnlocked && !completedIds.has(currentHero.id) && (
              <div className="mb-4 flex justify-center">
                <button
                  onClick={handleAutoFill}
                  className="px-4 py-2 bg-cyber-purple/20 border border-cyber-purple text-cyber-purple rounded-lg hover:bg-cyber-purple/40 transition-colors text-sm font-bold"
                >
                  一键输入 (Auto Fill)
                </button>
              </div>
            )}

            <div className="space-y-4">
              {(Object.keys(STAT_LABELS) as StatKey[]).map((key) => {
                const isCorrect = parseInt(inputs[key]) === currentHero.stats[key];
                const isCompleted = completedIds.has(currentHero.id);
                return (
                  <div key={key} className="flex items-center justify-between bg-white/5 p-3 rounded-lg border border-white/10">
                    <span className="text-lg font-medium w-20">{STAT_LABELS[key]}</span>
                    <div className="relative">
                      <input
                        type="number"
                        value={inputs[key]}
                        onChange={(e) => handleInputChange(key, e.target.value)}
                        disabled={isCompleted}
                        className={`w-28 bg-black/50 border-2 rounded-md px-3 py-1.5 text-lg text-center outline-none transition-colors ${
                          isCorrect ? 'border-cyber-gold text-cyber-gold shadow-[0_0_10px_rgba(255,215,0,0.5)]' : 'border-white/20 focus:border-cyber-green'
                        } ${isCompleted ? 'opacity-80 cursor-not-allowed' : ''}`}
                        placeholder="0-100"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

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
                进入下一关：雷达图绘制 <ChevronRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
