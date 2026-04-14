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
import Module5QuizGame from './components/Module5QuizGame';
import { Hero, CHALLENGES } from './data/gameData';

export default function App() {
  const [currentStage, setCurrentStage] = useState<number>(1);
  const [team, setTeam] = useState<Hero[]>([]);
  const [teamName, setTeamName] = useState<string>('');
  const [currentChallengeId, setCurrentChallengeId] = useState<string>(CHALLENGES[0].id);
  const [completedStories, setCompletedStories] = useState<string[]>([]);

  const currentChallenge = CHALLENGES.find(c => c.id === currentChallengeId) || CHALLENGES[0];

  const handleNextStage = (name?: string) => {
    if (name) setTeamName(name);
    if (currentStage === 3) {
      // Moving from stage 3 to 4 means completing a story
      if (!completedStories.includes(currentChallengeId)) {
        setCompletedStories(prev => [...prev, currentChallengeId]);
      }
    }
    setCurrentStage(prev => Math.min(prev + 1, 5));
  };

  const handleSelectChallenge = (challengeId: string) => {
    setCurrentChallengeId(challengeId);
    setTeam([]);
    setTeamName('');
    setCurrentStage(3); // Go directly to team building for the new challenge
  };

  const handleStartQuiz = () => {
    setCurrentStage(5);
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
                completedStoriesCount={completedStories.length}
                onStartQuiz={handleStartQuiz}
              />
            </motion.div>
          )}
          {currentStage === 5 && (
            <motion.div
              key="stage5"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 p-8"
            >
              <Module5QuizGame onComplete={() => setCurrentStage(1)} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
