/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Module1Extraction from './components/Module1Extraction';
import Module2RadarDraw from './components/Module2RadarDraw';
import Module3TeamBuilder from './components/Module3TeamBuilder';
import Module4Conclusion from './components/Module4Conclusion';
import { Hero, CHALLENGES } from './data/gameData';

export default function App() {
  const [currentStage, setCurrentStage] = useState<number>(1);
  const [team, setTeam] = useState<Hero[]>([]);
  const [teamName, setTeamName] = useState<string>('');
  const [currentChallengeId, setCurrentChallengeId] = useState<string>(CHALLENGES[0].id);

  const currentChallenge = CHALLENGES.find(c => c.id === currentChallengeId) || CHALLENGES[0];

  const handleNextStage = (name?: string) => {
    if (name) setTeamName(name);
    setCurrentStage(prev => Math.min(prev + 1, 4));
  };

  const handleSelectChallenge = (challengeId: string) => {
    setCurrentChallengeId(challengeId);
    setTeam([]);
    setTeamName('');
    setCurrentStage(3); // Go directly to team building for the new challenge
  };

  return (
    <div className="w-screen h-screen overflow-hidden flex flex-col font-sans">
      {/* Header */}
      <header className="h-16 glass-panel flex items-center justify-between px-8 z-50">
        <h1 className="font-calligraphy text-2xl text-cyber-gold text-glow-gold tracking-widest">
          数字群英谱：雷达图里的名著智慧
        </h1>
        <div className="flex gap-2">
          {[1, 2, 3, 4].map(step => (
            <div 
              key={step} 
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors duration-300 ${
                currentStage >= step ? 'bg-cyber-green text-cyber-navy shadow-[0_0_10px_#00FF9D]' : 'bg-white/10 text-white/50'
              }`}
            >
              {step}
            </div>
          ))}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait">
          {currentStage === 1 && (
            <motion.div
              key="stage1"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className="absolute inset-0 p-8"
            >
              <Module1Extraction onComplete={handleNextStage} />
            </motion.div>
          )}
          {currentStage === 2 && (
            <motion.div
              key="stage2"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className="absolute inset-0 p-8"
            >
              <Module2RadarDraw onComplete={handleNextStage} />
            </motion.div>
          )}
          {currentStage === 3 && (
            <motion.div
              key="stage3"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className="absolute inset-0 p-8"
            >
              <Module3TeamBuilder 
                team={team} 
                setTeam={setTeam} 
                onComplete={handleNextStage} 
                challenge={currentChallenge}
              />
            </motion.div>
          )}
          {currentStage === 4 && (
            <motion.div
              key="stage4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 p-8"
            >
              <Module4Conclusion 
                team={team} 
                teamName={teamName} 
                challenge={currentChallenge}
                onRestart={() => setCurrentStage(1)} 
                onSelectChallenge={handleSelectChallenge}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Test Panel */}
      <div className="fixed bottom-4 right-4 z-50 glass-panel p-4 rounded-xl flex flex-col gap-2 border-cyber-purple/50 shadow-[0_0_15px_rgba(176,38,255,0.3)]">
        <div className="text-xs text-cyber-purple font-bold mb-1 flex justify-between items-center">
          <span>测试面板 (Test Panel)</span>
        </div>
        <div className="flex gap-2">
          {[1, 2, 3, 4].map(step => (
            <button
              key={step}
              onClick={() => setCurrentStage(step)}
              className={`px-3 py-1 rounded text-sm font-bold transition-colors ${
                currentStage === step 
                  ? 'bg-cyber-purple text-white shadow-[0_0_10px_rgba(176,38,255,0.5)]' 
                  : 'bg-white/10 hover:bg-white/20 text-gray-300'
              }`}
            >
              关卡 {step}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
