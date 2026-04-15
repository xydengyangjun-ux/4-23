/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Module1Extraction from './components/Module1Extraction';
import Module2RadarDraw from './components/Module2RadarDraw';
import Module3TeamBuilder from './components/Module3TeamBuilder';
import Module4Conclusion from './components/Module4Conclusion';
import Module5QuizGame from './components/Module5QuizGame';
import { Hero, CHALLENGES } from './data/gameData';
import { Settings, RotateCcw } from 'lucide-react';

export default function App() {
  const [currentStage, setCurrentStage] = useState<number>(() => {
    const saved = localStorage.getItem('appCurrentStage');
    return saved ? parseInt(saved, 10) : 1;
  });
  const [team, setTeam] = useState<Hero[]>(() => {
    const saved = localStorage.getItem('appTeam');
    return saved ? JSON.parse(saved) : [];
  });
  const [teamName, setTeamName] = useState<string>(() => {
    const saved = localStorage.getItem('appTeamName');
    return saved || '';
  });
  const [currentChallengeId, setCurrentChallengeId] = useState<string>(() => {
    const saved = localStorage.getItem('appCurrentChallengeId');
    return saved || CHALLENGES[0].id;
  });
  const [completedStories, setCompletedStories] = useState<string[]>(() => {
    const saved = localStorage.getItem('appCompletedStories');
    return saved ? JSON.parse(saved) : [];
  });

  const [isTestPanelUnlocked, setIsTestPanelUnlocked] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showRestartModal, setShowRestartModal] = useState(false);

  useEffect(() => {
    localStorage.setItem('appCurrentStage', currentStage.toString());
  }, [currentStage]);

  useEffect(() => {
    localStorage.setItem('appCurrentChallengeId', currentChallengeId);
  }, [currentChallengeId]);

  useEffect(() => {
    localStorage.setItem('appCompletedStories', JSON.stringify(completedStories));
  }, [completedStories]);

  useEffect(() => {
    localStorage.setItem('appTeam', JSON.stringify(team));
  }, [team]);

  useEffect(() => {
    localStorage.setItem('appTeamName', teamName);
  }, [teamName]);

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

  const handlePasswordSubmit = () => {
    if (passwordInput === '141710') {
      setIsTestPanelUnlocked(true);
      setShowPasswordModal(false);
    } else {
      setPasswordError('密码错误！');
    }
  };

  const handleConfirmRestart = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="w-screen h-screen overflow-hidden flex flex-col font-sans">
      {/* Header */}
      <header className="h-16 glass-panel flex items-center justify-between px-8 z-50">
        <h1 className="font-calligraphy text-2xl text-cyber-gold text-glow-gold tracking-widest">
          数字群英谱：雷达图里的名著智慧
        </h1>
        <div className="flex items-center gap-6">
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
          <button
            onClick={() => setShowRestartModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 hover:bg-red-500/40 hover:text-red-300 rounded-lg transition-colors text-sm font-bold border border-red-500/30"
          >
            <RotateCcw className="w-4 h-4" />
            重新开始
          </button>
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

      {/* Hidden Teacher Panel */}
      <div className="fixed bottom-2 right-2 z-50 flex flex-col items-end">
        {isTestPanelUnlocked && (
          <div className="glass-panel p-2 rounded-xl flex gap-2 border-cyber-purple/50 shadow-[0_0_15px_rgba(176,38,255,0.3)] mb-2 mr-2">
            {[1, 2, 3, 4, 5].map(step => (
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
        )}
        
        <button 
          onClick={() => {
            if (isTestPanelUnlocked) {
              setIsTestPanelUnlocked(false);
            } else {
              setShowPasswordModal(true);
              setPasswordInput('');
              setPasswordError('');
            }
          }}
          className="p-2 text-white/10 hover:text-white/40 transition-colors rounded-full"
          title="Teacher Panel"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4 w-80 border-cyber-purple/50 shadow-[0_0_30px_rgba(176,38,255,0.3)]">
            <h3 className="text-lg font-bold text-cyber-purple">请输入测试面板密码</h3>
            <input 
              type="password" 
              value={passwordInput}
              onChange={(e) => {
                setPasswordInput(e.target.value);
                setPasswordError('');
              }}
              className="bg-black/50 border border-white/20 rounded-lg px-3 py-2 text-white outline-none focus:border-cyber-purple transition-colors"
              placeholder="密码..."
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handlePasswordSubmit();
              }}
            />
            {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
            <div className="flex justify-end gap-2 mt-2">
              <button 
                onClick={() => setShowPasswordModal(false)}
                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm transition-colors"
              >
                取消
              </button>
              <button 
                onClick={handlePasswordSubmit}
                className="px-4 py-2 rounded-lg bg-cyber-purple text-white text-sm hover:bg-cyber-purple/80 transition-colors"
              >
                确认
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Restart Confirmation Modal */}
      {showRestartModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4 w-80 border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.3)]">
            <h3 className="text-lg font-bold text-red-400">确认重新开始？</h3>
            <p className="text-sm text-gray-300">
              这将清除所有已保存的进度、录入的数据和答题记录。此操作不可恢复！
            </p>
            <div className="flex justify-end gap-2 mt-4">
              <button 
                onClick={() => setShowRestartModal(false)}
                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm transition-colors"
              >
                取消
              </button>
              <button 
                onClick={handleConfirmRestart}
                className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm hover:bg-red-600 transition-colors"
              >
                确认重置
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
