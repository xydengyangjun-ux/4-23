import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Hero, Challenge, CHALLENGES } from '../data/gameData';
import { BookOpen, ChevronRight, BrainCircuit } from 'lucide-react';

interface Props {
  team: Hero[];
  teamName: string;
  challenge: Challenge;
  onRestart: () => void;
  onSelectChallenge: (challengeId: string) => void;
  completedStoriesCount: number;
  onStartQuiz: () => void;
}

export default function Module4Conclusion({ team, teamName, challenge, onRestart, onSelectChallenge, completedStoriesCount, onStartQuiz }: Props) {
  const [story, setStory] = useState('');
  const [displayedStory, setDisplayedStory] = useState('');

  const otherChallenges = CHALLENGES.filter(c => c.id !== challenge.id);

  useEffect(() => {
    // Trigger confetti
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults, particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults, particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);

    // Generate story based on team
    const names = team.map(h => h.name).join('、');
    const fullStory = `在【${challenge.name}】的危急关头，来自四大名著的 ${names} 挺身而出！\n\n${
      team.find(h => h.stats.combat >= 90) ? `${team.find(h => h.stats.combat >= 90)?.name} 展现出登峰造极的武艺，以雷霆万钧之势击退了强敌；` : ''
    }${
      team.find(h => h.stats.intelligence >= 90) ? `${team.find(h => h.stats.intelligence >= 90)?.name} 慧眼如炬，瞬间识破了连环诡计，指明了破局方向；` : ''
    }${
      team.find(h => h.stats.eloquence >= 85) ? `${team.find(h => h.stats.eloquence >= 85)?.name} 巧舌如簧，以非凡的辩才澄清了误会，安抚了众人，稳住了阵脚；` : ''
    }\n\n最终，【${teamName || '跨界小队'}】凭借雷达图上完美的属性互补，成功化解了这场危机！\n这就是多维数据的力量，也是名著英雄们永不磨灭的智慧！`;

    setStory(fullStory);

    return () => clearInterval(interval);
  }, [team, teamName, challenge]);

  // Typewriter effect
  useEffect(() => {
    if (!story) return;
    let i = 0;
    const timer = setInterval(() => {
      setDisplayedStory(story.substring(0, i));
      i++;
      if (i > story.length) clearInterval(timer);
    }, 50);
    return () => clearInterval(timer);
  }, [story]);

  return (
    <div className="flex w-full h-full gap-6 relative z-10">
      {/* Left: Story and Team */}
      <motion.div 
        className="flex-1 glass-panel p-10 rounded-3xl flex flex-col items-center border-cyber-gold/50 shadow-[0_0_50px_rgba(255,215,0,0.2)]"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', bounce: 0.5 }}
      >
        <h1 className="font-calligraphy text-5xl text-cyber-gold text-glow-gold mb-2">破局大捷</h1>
        <h2 className="text-2xl text-white font-bold mb-8">【{teamName || '跨界小队'}】</h2>
        
        <div className="flex gap-4 mb-8">
          {team.map((hero, i) => (
            <motion.div 
              key={hero.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.2 }}
              className="flex flex-col items-center"
            >
              <img src={hero.avatar} alt={hero.name} className="w-20 h-20 rounded-full border-2" style={{ borderColor: hero.color }} />
              <span className="mt-2 font-bold" style={{ color: hero.color }}>{hero.name}</span>
            </motion.div>
          ))}
        </div>

        <div className="w-full bg-black/30 p-6 rounded-xl border border-white/10 flex-1">
          <p className="text-xl leading-relaxed text-gray-200 whitespace-pre-wrap font-serif">
            {displayedStory}
            <span className="animate-pulse">_</span>
          </p>
        </div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: displayedStory.length === story.length ? 1 : 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRestart}
          className="mt-6 px-8 py-3 bg-transparent border-2 border-cyber-gold text-cyber-gold font-bold rounded-full hover:bg-cyber-gold hover:text-cyber-navy transition-colors text-xl"
        >
          重新挑战当前故事
        </motion.button>
      </motion.div>

      {/* Right: Other Challenges */}
      <motion.div 
        className="w-80 glass-panel p-6 rounded-3xl border-cyber-blue/30 flex flex-col"
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <h3 className="text-2xl font-bold text-cyber-blue mb-6 flex items-center gap-2 justify-center">
          <BookOpen className="w-6 h-6" /> 更多经典故事
        </h3>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-2">
          {otherChallenges.map((c, idx) => (
            <motion.div 
              key={c.id} 
              className="bg-black/40 p-4 rounded-xl border border-white/10 hover:border-cyber-blue/50 transition-all cursor-pointer group"
              onClick={() => onSelectChallenge(c.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="font-bold text-white mb-2 flex items-center justify-between">
                <span>{c.name}</span>
                <ChevronRight className="w-4 h-4 text-cyber-blue opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-xs text-gray-400 line-clamp-2">
                {c.description}
              </p>
            </motion.div>
          ))}
        </div>

        {completedStoriesCount >= 2 && (
          <motion.button
            className="w-full mt-6 py-4 bg-gradient-to-r from-cyber-purple to-cyber-blue rounded-xl font-bold text-white flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(176,38,255,0.4)] transition-all"
            onClick={onStartQuiz}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <BrainCircuit className="w-5 h-5" />
            进入知识测验
          </motion.button>
        )}
      </motion.div>
    </div>
  );
}
