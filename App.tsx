
import React, { useState, useEffect, useMemo } from 'react';
import { useQuestStore } from './hooks/useQuestStore';
import { translations } from './translations';
import QuestCard from './components/QuestCard';
import CompletionModal from './components/CompletionModal';
import { AdsterraAd } from './components/AdsterraAds';
import { Quest, Language, QuestCompletion, QuestDifficulty } from './types';

const ADS_CONFIG = {
  BANNER_BIG: "061c830376a75ce65d45a3fd68475ac2",
  BANNER_SMALL: "0f4e36593f192c3b2baa29f633441ec7"
};

const AuthScreen = ({ onLogin }: { onLogin: (u: string) => void }) => {
  const [u, setU] = useState('');
  const [p, setP] = useState('');
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (u.trim()) onLogin(u);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-between p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.2),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(236,72,153,0.15),transparent_50%)]"></div>
      
      <div className="w-full max-w-sm space-y-10 animate-in fade-in zoom-in duration-700 relative z-10 auth-container my-auto">
        <div className="text-center space-y-2">
          <h1 className="text-6xl font-fun font-black text-white italic drop-shadow-[0_10px_30px_rgba(99,102,241,0.5)] text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500">PP Quest</h1>
          <div className="inline-block px-4 py-1 bg-indigo-500/20 rounded-full border border-indigo-500/30">
            <p className="text-indigo-400 font-bold uppercase tracking-[0.4em] text-[9px]">Master Your Day</p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="bg-slate-900/60 backdrop-blur-2xl p-6 rounded-[3rem] border-2 border-white/10 shadow-2xl space-y-6">
          <div className="space-y-4">
            <div className="space-y-1.5 px-1">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Username</label>
              <input 
                value={u} 
                onChange={e=>setU(e.target.value)} 
                placeholder="Enter your name..." 
                autoComplete="username"
                className="w-full p-4 bg-slate-800/50 rounded-2xl border-2 border-slate-700 text-white outline-none focus:border-indigo-500 transition-all text-base shadow-inner" 
              />
            </div>
            <div className="space-y-1.5 px-1">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Password</label>
              <input 
                type="password" 
                value={p}
                onChange={e=>setP(e.target.value)}
                placeholder="••••••••" 
                autoComplete="current-password"
                className="w-full p-4 bg-slate-800/50 rounded-2xl border-2 border-slate-700 text-white outline-none focus:border-indigo-500 transition-all text-base shadow-inner" 
              />
            </div>
          </div>
          
          <button 
            type="submit"
            className="w-full py-5 bg-gradient-to-r from-indigo-600 to-rose-500 text-white rounded-[1.8rem] font-black text-xl hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-indigo-600/40 border-b-4 border-indigo-900 active:border-b-0 uppercase tracking-tight"
          >
            START ADVENTURE
          </button>
        </form>
      </div>

      <div className="w-full mt-4 flex justify-center z-10">
        <AdsterraAd id={ADS_CONFIG.BANNER_SMALL} type="banner_small" />
      </div>
    </div>
  );
};

const LoadingIndicator = ({ t }: { t: any }) => {
  const [index, setIndex] = useState(0);
  const phrases = [t.load_1, t.load_2, t.load_3, t.load_4];

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex(prev => (prev + 1) % phrases.length);
    }, 2000);
    return () => clearInterval(timer);
  }, [phrases.length]);

  return (
    <div className="py-24 text-center space-y-6 animate-in fade-in duration-500">
      <div className="relative w-16 h-16 mx-auto">
         <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full"></div>
         <div className="absolute inset-0 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
      <p className="font-black text-indigo-400/80 uppercase tracking-[0.3em] text-[11px] animate-pulse">
        {phrases[index]}
      </p>
    </div>
  );
};

const RewardedAdSim = ({ onComplete, t }: { onComplete: () => void, t: any }) => {
  const [timeLeft, setTimeLeft] = useState(5);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const startTimer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(startTimer);
  }, []);

  useEffect(() => {
    if (!loading && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [loading, timeLeft]);

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950 flex flex-col items-center justify-center p-8 animate-in fade-in">
      <div className="w-full max-w-sm space-y-8 text-center">
        {loading ? (
          <div className="space-y-4">
             <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
             <p className="font-black text-indigo-400 uppercase tracking-widest text-xs">{t.ad_loading}</p>
          </div>
        ) : (
          <>
            <div className="relative aspect-video w-full bg-slate-900 rounded-[2rem] border-2 border-white/10 flex items-center justify-center overflow-hidden shadow-2xl">
               <div className="absolute top-4 right-4 bg-black/60 px-3 py-1 rounded-full text-white text-[10px] font-black">
                 {timeLeft > 0 ? timeLeft : '✓'}
               </div>
               <div className="space-y-2">
                 <div className="text-4xl animate-pulse">📺</div>
                 <p className="text-white font-fun font-black uppercase tracking-tight">Watching Sponsor</p>
                 <p className="text-[10px] text-slate-500 font-bold px-8">Your reward will be ready after the timer ends.</p>
               </div>
            </div>
            <div className="space-y-4">
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{t.ad_watching}</p>
              {timeLeft === 0 && (
                <button 
                  onClick={onComplete}
                  className="w-full py-5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-[1.8rem] font-black text-xl shadow-xl shadow-emerald-500/20 active:scale-95 transition-all"
                >
                  {t.ad_reward_ready}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const { state, loading, refreshQuests, completeQuest, failQuest, toggleSave, updateSetting, login, logout, addExtraRefresh } = useQuestStore();
  const [activeTab, setActiveTab] = useState<'QUESTS' | 'STATS' | 'SAVED'>('QUESTS');
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [showAd, setShowAd] = useState(false);

  const t = useMemo(() => {
    return (translations as any)[state.user.language] || translations.en;
  }, [state.user.language]);

  const handleLanguageChange = (lang: Language) => {
    updateSetting('language', lang);
  };

  useEffect(() => {
    if (state.user.isLoggedIn && state.activeQuests.length === 0 && !loading && state.completedQuests.length === 0) {
      refreshQuests(true);
    }
  }, [state.user.isLoggedIn, loading]);

  if (!state.user.isLoggedIn) return <AuthScreen onLogin={login} />;

  const getTier = (level: number) => {
    if (level < 2) return t.tier_noob;
    if (level < 5) return t.tier_tasker;
    if (level < 10) return t.tier_explorer;
    if (level < 20) return t.tier_master;
    return t.tier_legend;
  };

  const progressPercent = `${Math.min(100, Math.max(0, (state.stats.xp / 500) * 100))}%`;

  return (
    <div className={`min-h-screen max-w-lg mx-auto flex flex-col transition-all duration-700 relative overflow-x-hidden ${state.user.theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      
      {showAd && <RewardedAdSim t={t} onComplete={() => { addExtraRefresh(); setShowAd(false); }} />}

      <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.25),transparent_45%)] pointer-events-none"></div>
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(236,72,153,0.18),transparent_45%)] pointer-events-none"></div>

      <header className={`sticky top-0 z-40 px-5 py-2 backdrop-blur-xl border-b-2 border-white/5 bg-slate-950/85`}>
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-fun font-black tracking-tight text-white uppercase leading-none">{t.app_name}</h1>
              <div className="px-2 py-0.5 bg-indigo-600 rounded-full border border-indigo-400/50">
                <span className="text-[8px] text-white font-black uppercase tracking-tighter">{state.user.username}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <select 
                  value={state.user.language} 
                  onChange={e => handleLanguageChange(e.target.value as Language)} 
                  className="bg-slate-800/80 text-[10px] font-black border border-white/10 rounded-lg px-2 py-1 uppercase outline-none text-white cursor-pointer appearance-none pr-6 transition-colors"
                >
                  <option value="en">EN</option>
                  <option value="sr">SR</option>
                </select>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[8px] opacity-40">▼</div>
              </div>
              <button onClick={logout} className="text-[10px] font-black border border-white/10 bg-slate-900/50 text-rose-400 rounded-lg px-2 py-1 uppercase active:scale-95 transition-all">LOGOUT</button>
            </div>
          </div>
          <div className="flex flex-col items-end min-w-[100px]">
             <span className="text-[8px] font-black text-rose-400 italic uppercase tracking-widest leading-none">{getTier(state.stats.level)}</span>
             <div className="flex items-baseline gap-1">
               <span className="text-[8px] font-black text-slate-500 uppercase">{t.progress_level}</span>
               <span className="text-xl font-black italic text-white leading-none">{state.stats.level}</span>
             </div>
             <div className="relative w-full h-2 bg-slate-900/80 rounded-full mt-1 border border-white/10 overflow-hidden shadow-inner">
               <div className="h-full bg-gradient-to-r from-indigo-500 via-indigo-400 to-rose-500 transition-all duration-1000" style={{width: progressPercent}}></div>
             </div>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 relative z-10 pb-36">
        {activeTab === 'QUESTS' && (
          <div className="animate-in fade-in duration-300">
            <div className="flex justify-between items-center px-1 mb-5">
              <div className="space-y-0.5">
                <h2 className="text-lg font-fun font-black text-white uppercase leading-none">{t.hunt}</h2>
                <p className="text-slate-500 text-[8px] font-bold uppercase tracking-widest">{t.hunt_desc}</p>
              </div>
              
              {state.user.refreshesLeft > 0 ? (
                <button 
                  onClick={()=>refreshQuests()} 
                  disabled={loading} 
                  className={`bg-indigo-600 border-b-2 border-indigo-900 px-4 py-1.5 rounded-xl text-[9px] font-black active:scale-95 active:border-b-0 transition-all text-white uppercase shadow-lg shadow-indigo-600/30`}
                >
                  {loading ? '...' : `${t.refresh} (${state.user.refreshesLeft})`}
                </button>
              ) : (
                <button 
                  onClick={()=>setShowAd(true)} 
                  className="bg-gradient-to-r from-indigo-600 to-rose-500 px-3 py-1.5 rounded-xl text-[9px] font-black active:scale-95 transition-all text-white uppercase shadow-lg shadow-rose-500/30 animate-pulse border-b-2 border-rose-900"
                >
                  {t.refresh_ad}
                </button>
              )}
            </div>

            {loading ? (
              <LoadingIndicator t={t} />
            ) : (
              <div className="flex flex-col gap-4">
                {state.activeQuests.slice(0, 2).map(q => <QuestCard key={q.id} quest={q} lang={state.user.language} onClick={setSelectedQuest} />)}
                
                {/* 🎯 Middle: Small Banner (320x50 - Most visible on mobile) */}
                <AdsterraAd id={ADS_CONFIG.BANNER_SMALL} type="banner_small" />
                
                {state.activeQuests.slice(2).map(q => <QuestCard key={q.id} quest={q} lang={state.user.language} onClick={setSelectedQuest} />)}
                
                {state.completedQuests.length > 0 && (
                  <div className="mt-2 pt-4 border-t border-white/5 space-y-3">
                    <h3 className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{t.today_achievements}</h3>
                    <div className="grid gap-3">
                      {state.completedQuests.map(c => (
                        <QuestCard 
                          key={c.questId} 
                          quest={c.questData} 
                          lang={state.user.language} 
                          onClick={()=>{}} 
                          isCompleted 
                          onSave={()=>toggleSave(c.questId)}
                          isSaved={c.saved}
                        />
                      ))}
                    </div>
                  </div>
                )}
                
                {/* 🎯 Footer: Big Banner (468x60) */}
                <AdsterraAd id={ADS_CONFIG.BANNER_BIG} type="banner" />
              </div>
            )}
          </div>
        )}

        {activeTab === 'STATS' && (
          <div className="animate-in slide-in-from-bottom-5 duration-500 pb-20">
            <h2 className="text-lg font-fun font-black text-white px-1 uppercase leading-none mb-4">{t.stats}</h2>
            <div className="grid grid-cols-2 gap-3 mb-6">
              <StatBox label={t.completed} value={state.stats.completed} color="bg-emerald-500/5" border="border-emerald-500/20" textColor="text-emerald-400" icon="👑" />
              <StatBox label={t.failed} value={state.stats.lost} color="bg-rose-500/5" border="border-rose-500/20" textColor="text-rose-400" icon="💥" />
              <StatBox label={t.streak} value={state.stats.streak} color="bg-indigo-500/5" border="border-indigo-500/20" textColor="text-indigo-400" icon="⚡" />
              <StatBox label={t.total_xp} value={state.stats.totalPoints} color="bg-amber-500/5" border="border-amber-500/20" textColor="text-amber-400" icon="💎" />
            </div>

            {/* 🎯 Middle: Small Banner */}
            <AdsterraAd id={ADS_CONFIG.BANNER_SMALL} type="banner_small" />

            <div className="space-y-3 mb-6">
               <h3 className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">{t.mastery_breakdown}</h3>
               <div className="grid grid-cols-5 gap-1.5">
                 <MiniStat label={t.easy} value={state.stats.easyCount} color="bg-yellow-500" />
                 <MiniStat label={t.medium} value={state.stats.mediumCount} color="bg-blue-500" />
                 <MiniStat label={t.hard} value={state.stats.hardCount} color="bg-rose-500" />
                 <MiniStat label={t.meme} value={state.stats.memeCount} color="bg-purple-500" />
                 <MiniStat label={t.extreme} value={state.stats.impossibleCount} color="bg-slate-700" />
               </div>
            </div>

            <div className="space-y-3 mb-6">
               <h3 className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">{t.badges_title}</h3>
               <div className="grid grid-cols-4 gap-3">
                 {['badge_first_quest', 'badge_quest_10', 'badge_quest_50', 'badge_quest_100', 'badge_streak_3', 'badge_streak_7', 'badge_streak_15', 'badge_extreme', 'badge_meme', 'badge_web_1', 'badge_web_10', 'badge_photo_1', 'badge_photo_20', 'badge_loc_1', 'badge_loc_10', 'badge_text_1', 'badge_text_20', 'badge_quiz_pro', 'badge_fast', 'badge_owl', 'badge_bird', 'badge_lvl_5', 'badge_lvl_10', 'badge_lvl_20'].map(badgeId => {
                   const isOwned = state.stats.badges.includes(badgeId);
                   return (
                     <div key={badgeId} className={`aspect-square rounded-xl flex flex-col items-center justify-center p-1.5 border transition-all ${isOwned ? 'bg-indigo-500/10 border-indigo-500/30' : 'bg-slate-900/50 border-white/5 grayscale opacity-30'}`}>
                        <span className="text-base mb-1">{isOwned ? '🏅' : '🔒'}</span>
                        <span className="text-[6px] font-black text-center leading-tight uppercase text-white truncate w-full">{(t as any)[badgeId] || 'BADGE'}</span>
                     </div>
                   );
                 })}
               </div>
            </div>
            
            {/* 🎯 Footer: Big Banner */}
            <AdsterraAd id={ADS_CONFIG.BANNER_BIG} type="banner" />
          </div>
        )}

        {activeTab === 'SAVED' && (
          <div className="animate-in fade-in duration-300">
            {/* 🎯 Top/Header: Small Banner */}
            <AdsterraAd id={ADS_CONFIG.BANNER_SMALL} type="banner_small" />

            <h2 className="text-lg font-fun font-black text-white px-1 uppercase leading-none mb-4">{t.saved}</h2>
            {state.completedQuests.filter(c => c.saved).length === 0 ? (
              <p className="text-center py-16 text-slate-600 font-bold uppercase text-[9px] tracking-widest">{t.empty_vault}</p>
            ) : (
              <div className="grid gap-3">
                {state.completedQuests.filter(c => c.saved).map(c => (
                  <QuestCard 
                    key={c.questId} 
                    quest={c.questData} 
                    lang={state.user.language} 
                    onClick={()=>{}} 
                    isCompleted 
                    onSave={()=>toggleSave(c.questId)}
                    isSaved={c.saved}
                  />
                ))}
              </div>
            )}
            
            {/* 🎯 Footer: Big Banner */}
            <AdsterraAd id={ADS_CONFIG.BANNER_BIG} type="banner" />
          </div>
        )}
      </main>

      <nav className={`fixed bottom-4 left-4 right-4 max-w-sm mx-auto bg-slate-900/90 backdrop-blur-2xl rounded-[2rem] border-2 border-white/10 px-8 py-3 flex justify-between items-center z-50 shadow-2xl safe-pb`}>
        <NavBtn icon="🎯" label={t.quests} active={activeTab === 'QUESTS'} onClick={() => setActiveTab('QUESTS')} />
        <NavBtn icon="📉" label={t.stats} active={activeTab === 'STATS'} onClick={() => setActiveTab('STATS')} />
        <NavBtn icon="🏛️" label={t.saved} active={activeTab === 'SAVED'} onClick={() => setActiveTab('SAVED')} />
      </nav>

      {selectedQuest && (
        <CompletionModal 
          quest={selectedQuest} 
          lang={state.user.language} 
          onClose={() => setSelectedQuest(null)} 
          onFail={failQuest}
          onSuccess={(proof, feedback, duration) => { completeQuest(selectedQuest.id, proof, feedback, duration); setSelectedQuest(null); }} 
        />
      )}
    </div>
  );
};

const NavBtn = ({ icon, label, active, onClick }: any) => (
  <button onClick={onClick} className={`flex flex-col items-center transition-all duration-300 ${active ? 'scale-110 translate-y-[-2px]' : 'opacity-20 grayscale'}`}>
    <span className="text-lg drop-shadow-xl">{icon}</span>
    <span className="text-[7px] font-black uppercase mt-1 tracking-widest">{active ? label : ''}</span>
  </button>
);

const StatBox = ({ label, value, color, border, textColor, icon }: any) => (
  <div className={`${color} ${border} p-4 rounded-[1.8rem] border text-center group active:scale-95 transition-all relative overflow-hidden shadow-lg`}>
    <div className="absolute top-1 right-1 opacity-10 text-xl grayscale group-hover:grayscale-0 transition-all">{icon}</div>
    <span className={`text-2xl font-fun font-black block mb-0.5 ${textColor}`}>{value}</span>
    <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{label}</span>
  </div>
);

const MiniStat = ({ label, value, color }: any) => (
  <div className="bg-slate-900/60 border border-white/5 p-2 rounded-xl flex flex-col items-center">
    <div className={`w-1 h-1 rounded-full mb-1 ${color}`}></div>
    <span className="text-xs font-black text-white">{value}</span>
    <span className="text-[5px] font-black text-slate-500 uppercase tracking-tighter">{label}</span>
  </div>
);

export default App;
