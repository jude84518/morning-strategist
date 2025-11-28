import React, { useState, useEffect, useRef, useMemo } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInAnonymously, 
  onAuthStateChanged, 
  signInWithCustomToken,
  GoogleAuthProvider,
  signInWithPopup,
  signOut
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  addDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';
import {
  Zap,
  Target,
  CheckSquare,
  Trophy,
  ArrowRight,
  Play,
  Pause,
  RotateCcw,
  Check,
  Clock,
  Mic,
  Headphones,
  Activity,
  BarChart2,
  Loader2,
  Trash2,
  X,
  History,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Sparkles,
  Edit3,
  SkipForward,
  Briefcase,
  Flame,
  AlertTriangle,
  Droplets,
  Volume2,
  LogOut,
  User,
  Moon,
  BookOpen,
  Smartphone,
  Save,
  PenTool,
  Sun,
  Sunrise,
  Sunset,
  LayoutList,
  CloudLightning,
  Wifi,
  WifiOff,
  Database,
  Book,
  Library,
  Coffee,
  Laptop,
  AlertCircle,
  Dumbbell,
  Brain,
  Calendar as CalendarIcon,
  MoreHorizontal
} from 'lucide-react';

// --- Firebase Configuration ---
const MY_FIREBASE_CONFIG = {
  apiKey: "AIzaSyAn-Xu7KO3g7fKgcXcxWmszsB84acCjCuc",
  authDomain: "morning-strategist-lucas-b87bd.firebaseapp.com",
  projectId: "morning-strategist-lucas-b87bd",
  storageBucket: "morning-strategist-lucas-b87bd.firebasestorage.app",
  messagingSenderId: "984226698122",
  appId: "1:984226698122:web:f40a653092cc491082ee73"
};

const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : MY_FIREBASE_CONFIG;

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Fixed App ID for persistence
const appId = "morning-strategist-lucas-persistent"; 
const LOCAL_STORAGE_KEY = "morning-strategist-lucas-state-v17-mood-fix"; // Bump version for mood fix

// --- DATABASE ---
const QUOTE_DATABASE = [
  { text: "即使如此，地球依然在轉動。", char: "拉法爾", src: "關於地球的運動" },
  { text: "將這一份感動保留下來，這就是我們的使命。", char: "巴德尼", src: "關於地球的運動" },
  { text: "不正確認知世界，是我人生中最大的恥辱。", char: "拉法爾", src: "關於地球的運動" },
  { text: "我想要知道，這份好奇心難道不是比任何東西都還要高尚嗎？", char: "拉法爾", src: "關於地球的運動" },
  { text: "做自己喜歡的事，並不代表隨時都會很開心。", char: "矢口八虎", src: "藍色時期" },
  { text: "如果我現在放棄了，那我這輩子就真的只是個凡人了。", char: "矢口八虎", src: "藍色時期" },
  { text: "只有全心全意投入的人，才有資格說自己「盡力了」。", char: "佐伯老師", src: "藍色時期" },
  { text: "比起用言語說明，直接畫出來還比較快。", char: "矢口八虎", src: "藍色時期" },
  { text: "努力的人不一定會有回報，但成功的人全都努力過。", char: "鴨川源二", src: "第一神拳" },
  { text: "站起來！你還能打！", char: "幕之內一步", src: "第一神拳" },
  { text: "即使爬也要爬過去，這就是執念。", char: "鷹村守", src: "第一神拳" },
  { text: "已經沒事了！要問為什麼？因為我來了！", char: "歐爾麥特", src: "我的英雄學院" },
  { text: "去超越極限吧！Plus Ultra！", char: "歐爾麥特", src: "我的英雄學院" },
  { text: "多管閒事可是英雄的本質。", char: "綠谷出久", src: "我的英雄學院" },
  { text: "如果不甘心就站起來，看著前方。", char: "轟焦凍", src: "我的英雄學院" },
  { text: "才能是可以栽培開花的，靈感是可以研磨雕琢的！", char: "及川徹", src: "排球少年!!" },
  { text: "不准低頭！排球是永遠向上看的運動！", char: "烏養繫心", src: "排球少年!!" },
  { text: "如果認為自己沒有才能，那大概一輩子都不會有。", char: "及川徹", src: "排球少年!!" },
  { text: "正因為沒有翅膀，人類才尋找飛翔的方法。", char: "烏養繫心", src: "排球少年!!" },
  { text: "打破高牆的，永遠是下一球。", char: "日向翔陽", src: "排球少年!!" },
  { text: "所謂的「強大」，就是能夠持續做那些理所當然的事。", char: "北信介", src: "排球少年!!" },
  { text: "不需要回憶，因為我們每一秒都在創造新的歷史。", char: "稻荷崎高校", src: "排球少年!!" },
  { text: "吞噬你的對手，這就是前鋒的職責。", char: "潔世一", src: "藍色監獄" },
  { text: "為了達到頂點，必須捨棄天真。", char: "繪心甚八", src: "藍色監獄" },
  { text: "所謂的才能，就是證明自己有能力改變世界的能力。", char: "繪心甚八", src: "藍色監獄" },
  { text: "什麼都無法捨棄的人，就什麼也無法改變。", char: "阿爾敏", src: "進擊的巨人" },
  { text: "戰鬥吧！不戰鬥就贏不了！", char: "艾連·葉卡", src: "進擊的巨人" },
  { text: "勞動就是狗屎。", char: "七海建人", src: "咒術迴戰" },
  { text: "會贏的，因為我是最強的。", char: "五條悟", src: "咒術迴戰" },
  { text: "積累微小的絕望，這就是長大成人。", char: "七海建人", src: "咒術迴戰" },
  { text: "這可是純愛啊！", char: "乙骨憂太", src: "咒術迴戰" },
  { text: "現在放棄的話，比賽就結束了喔。", char: "安西教練", src: "灌籃高手" },
  { text: "控制籃板球的人，就能控制比賽。", char: "赤木剛憲", src: "灌籃高手" },
  { text: "我是天才！", char: "櫻木花道", src: "灌籃高手" },
  { text: "直到最後一刻都不可以放棄希望。", char: "安西教練", src: "灌籃高手" },
  { text: "教練，我想打籃球...", char: "三井壽", src: "灌籃高手" },
  { text: "人的夢想，是不會結束的！", char: "黑鬍子", src: "航海王" },
  { text: "既然拔劍了，就要戰到最後一刻。", char: "索隆", src: "航海王" },
  { text: "不管是多麼微不足道的事，只要持續下去，總有一天會成為巨大的力量。", char: "煉獄杏壽郎", src: "鬼滅" },
  { text: "燃燒心靈！", char: "煉獄杏壽郎", src: "鬼滅" },
  { text: "人沒有犧牲就什麼都得不到，這就是等價交換。", char: "阿爾馮斯", src: "鋼鍊" },
  { text: "站起來，向前走。你不是還有兩條腿嗎？", char: "愛德華", src: "鋼鍊" },
  { text: "所謂的覺悟，就是在漆黑的荒野中，開闢出一條前進的道路！", char: "喬魯諾", src: "JOJO" },
  { text: "正因為我們不知道未來會發生什麼，這段旅程才有趣啊。", char: "芙莉蓮", src: "葬送的芙莉蓮" },
  { text: "即使是只有百分之一的可能性，那也比零要好。", char: "欣梅爾", src: "葬送的芙莉蓮" },
  { text: "只要稍微改變一下視角，世界就會變得不一樣。", char: "海塔", src: "葬送的芙莉蓮" },
  { text: "享受過程吧，那是比你想要的任何東西都更有價值的東西。", char: "金·富力士", src: "獵人" },
  { text: "所謂的強大，不只是力量，還有心。", char: "埼玉", src: "一拳超人" },
  { text: "即使陰鬱也沒關係，即使陰鬱也能閃耀！", char: "後藤一里", src: "孤獨搖滾!" }
];

const REST_QUOTES = [
  { text: "勞動是為了休息，休息是為了走更長的路。準時下班。", char: "七海建人", src: "咒術迴戰" },
  { text: "明天早上六點還有比賽，現在不睡覺的人是笨蛋。", char: "影山飛雄", src: "排球少年!!" },
  { text: "只有好好休息的人，才能在關鍵時刻拔刀。", char: "我妻善逸", src: "鬼滅" },
  { text: "今天的冒險結束了，快去喝杯酒慶祝吧。", char: "索隆", src: "航海王" },
  { text: "如果不關機，大腦這個中央處理器是會燒壞的。", char: "L", src: "死亡筆記本" },
  { text: "為了明天能飛得更高，現在請把翅膀收起來。", char: "烏養繫心", src: "排球少年!!" },
  { text: "睡眠也是訓練的一環。", char: "流川楓", src: "灌籃高手" },
  { text: "休息吧，戰士。黎明再來。", char: "Saber", src: "Fate" },
  { text: "今天已經做得很好了，稍微放過自己吧。", char: "里維兵長", src: "進擊的巨人" },
  { text: "收工了。明天再戰。", char: "相澤消太", src: "我的英雄學院" }
];

const EXERCISE_ROUTINES = [
  { id: 'stretch', name: "動態伸展", eng: "STRETCH", duration: 180, desc: "喚醒關節 (3 min)" },
  { id: 'shadowbox', name: "空拳", eng: "SHADOW BOX", duration: 120, desc: "意象訓練 (2 min/set)" },
  { id: 'pushup', name: "伏地挺身", eng: "PUSH-UPS", duration: 60, desc: "肌力對抗 (1 min/set)" }
];

const ENGLISH_APPS = [
  { id: 'toko', name: 'Toko 口說', icon: <Mic size={14} />, desc: '模擬對話實戰', color: 'bg-blue-600' },
  { id: 'voicetube', name: 'VoiceTube 聽力', icon: <Headphones size={14} />, desc: '影片語感輸入', color: 'bg-red-600' }
];

// Remove JSX from defaults to prevent JSON stringify issues
const BEDTIME_CHECKLIST_DEFAULTS = [
  { id: 'light', text: '開啟睡眠燈 (Mood Light)', checked: false },
  { id: 'reader', text: '準備閱讀器 (E-Reader)', checked: false },
  { id: 'phone', text: '手機放到樓上/遠離床邊', checked: false },
];

const getBedtimeIcon = (id) => {
    switch(id) {
        case 'light': return <Moon size={20} />;
        case 'reader': return <BookOpen size={20} />;
        case 'phone': return <Smartphone size={20} />;
        default: return <CheckSquare size={20} />;
    }
};

// --- AUDIO ENGINE ---
const SoundEngine = {
  ctx: null,

  init: () => {
    if (!SoundEngine.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        SoundEngine.ctx = new AudioContext();
      }
    }
    if (SoundEngine.ctx && SoundEngine.ctx.state === 'suspended') {
      SoundEngine.ctx.resume();
    }
  },

  playTone: (freq, type, duration) => {
    SoundEngine.init();
    if (!SoundEngine.ctx) return;

    const osc = SoundEngine.ctx.createOscillator();
    const gain = SoundEngine.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, SoundEngine.ctx.currentTime);

    gain.gain.setValueAtTime(0.1, SoundEngine.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, SoundEngine.ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(SoundEngine.ctx.destination);

    osc.start();
    osc.stop(SoundEngine.ctx.currentTime + duration);
  },

  playClick: () => {
    SoundEngine.playTone(800, 'square', 0.1);
  },

  playChime: () => {
    setTimeout(() => SoundEngine.playTone(523.25, 'sine', 1.5), 0);
    setTimeout(() => SoundEngine.playTone(659.25, 'sine', 1.5), 200);
    setTimeout(() => SoundEngine.playTone(783.99, 'sine', 2.0), 400);
  },
  
  playError: () => {
    SoundEngine.playTone(150, 'sawtooth', 0.3);
  }
};

// --- Sub-Components ---
const PowerButton = ({ children, onClick, variant = 'primary', className = '', disabled = false, loading = false }) => {
  const baseStyle = "px-4 py-3 sm:px-6 sm:py-4 font-black italic uppercase tracking-wider transform transition-all duration-100 active:translate-y-1 active:shadow-none flex items-center justify-center gap-2 border-4 border-black skew-x-[-6deg] w-full select-none relative";
  const variants = {
    primary: "bg-orange-500 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-orange-400 hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] disabled:bg-gray-400 disabled:shadow-none disabled:border-gray-500 disabled:cursor-not-allowed",
    secondary: "bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-50",
    success: "bg-black text-orange-500 border-orange-500 shadow-[4px_4px_0px_0px_rgba(249,115,22,1)] hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed",
    info: "bg-blue-500 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-blue-400",
    ghost: "bg-transparent border-dashed border-2 border-gray-300 text-gray-400 hover:border-gray-500 hover:text-gray-600 skew-x-0 shadow-none",
    google: "bg-white text-black border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-50",
    dark: "bg-slate-900 text-indigo-300 border-slate-700 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:border-indigo-500 hover:text-white"
  };
  return (
    <button
      onClick={(e) => {
        if (!disabled && !loading) {
          SoundEngine.playClick();
          onClick(e);
        }
      }}
      disabled={disabled || loading}
      className={`${baseStyle} ${variants[variant]} ${className}`}
    >
      <span className={variant !== 'ghost' ? "skew-x-[6deg] flex items-center gap-2 whitespace-nowrap" : ""}>
        {loading ? <Loader2 className="animate-spin" size={20} /> : children}
      </span>
    </button>
  );
};

const MangaHeader = ({ title, subtitle, step, onBack }) => (
  <div className="mb-6 relative z-10 flex-shrink-0">
    <div className="flex items-start justify-between mb-2">
      {onBack && (
        <button onClick={onBack} className="p-2 -ml-2 text-gray-400 hover:text-black transition-colors">
          <ChevronLeft size={28} strokeWidth={3} />
        </button>
      )}
      {step && (
        <div className="inline-block bg-black text-orange-500 font-black italic px-3 py-1 border-b-4 border-r-4 border-orange-500 transform -rotate-3 shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] text-sm ml-auto">
          STAGE {step}
        </div>
      )}
    </div>
    <h2 className="text-3xl sm:text-4xl font-black italic uppercase text-black tracking-tighter transform -skew-x-6 leading-none break-words">
      <span className="bg-orange-500 text-white px-2 inline-block mr-1 shadow-[3px_3px_0px_0px_black] transform skew-x-6">/</span>
      {title}
    </h2>
    {subtitle && (
      <p className="text-black font-bold mt-3 pl-4 border-l-8 border-orange-500 uppercase tracking-wide text-sm sm:text-base bg-white/50 backdrop-blur-sm p-1">
        {subtitle}
      </p>
    )}
  </div>
);

const TimerDisplay = ({ timeLeft, totalDuration }) => {
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const progress = totalDuration > 0 ? (timeLeft / totalDuration) * 100 : 0;
  return (
    <div className="relative border-4 border-black bg-black p-6 mb-4 overflow-hidden shadow-[6px_6px_0px_0px_rgba(249,115,22,1)]">
      <div className="absolute top-0 left-0 h-full bg-gray-800 transition-all duration-1000 ease-linear" style={{ width: `${100 - progress}%` }}></div>
      <div className="absolute inset-0 opacity-20 bg-[linear-gradient(45deg,transparent_25%,white_25%,white_50%,transparent_50%,transparent_75%,white_75%,white_100%)] bg-[length:20px_20px] pointer-events-none"></div>
      <div className="relative z-10 flex flex-col items-center justify-center">
        <div className="text-7xl font-black font-mono tracking-wider text-orange-500 drop-shadow-[4px_4px_0px_rgba(255,255,255,0.2)]">
          {mins.toString().padStart(2, '0')}:{secs.toString().padStart(2, '0')}
        </div>
      </div>
    </div>
  )
}

const DeleteConfirmModal = ({ onConfirm, onCancel, isDeleting }) => (
  <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fade-in" onClick={onCancel}>
    <div
      className="bg-white border-4 border-black p-6 w-full max-w-xs shadow-[8px_8px_0px_0px_red] transform rotate-1"
      onClick={e => e.stopPropagation()}
    >
      <div className="flex flex-col items-center text-center">
        <AlertTriangle size={48} className="text-red-600 mb-4" />
        <h3 className="text-2xl font-black uppercase mb-2">刪除紀錄？</h3>
        <p className="text-sm font-bold text-gray-500 mb-6">這場比賽的數據將會永久消失。</p>
        <div className="flex gap-3 w-full">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="flex-1 py-3 font-black uppercase border-4 border-black hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            取消
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 py-3 font-black uppercase bg-red-600 text-white border-4 border-black hover:bg-red-700 transition-colors shadow-[2px_2px_0px_0px_black] flex justify-center"
          >
            {isDeleting ? <Loader2 className="animate-spin" /> : "刪除"}
          </button>
        </div>
      </div>
    </div>
  </div>
);

const SeasonStatsDashboard = ({ history }) => {
  if (!history || history.length === 0) return null;

  // 1. Partition Data
  const morningRituals = history.filter(r => r.isMorningRoutine);
  const workSessions = history.filter(r => r.isWorkSession);
  const bedtimeRituals = history.filter(r => r.type === 'bedtime');

  // 2. Streak Helper
  const calculateStreak = (sessions, predicate) => {
    const validDates = new Set();
    sessions.forEach(r => {
      if (predicate(r) && r.dateDisplay) validDates.add(r.dateDisplay);
    });
    const sortedDates = Array.from(validDates).sort((a, b) => new Date(b) - new Date(a));
    if (sortedDates.length === 0) return 0;
    const today = new Date().toLocaleDateString('zh-TW');
    const yesterday = new Date(Date.now() - 86400000).toLocaleDateString('zh-TW');
    if (sortedDates[0] !== today && sortedDates[0] !== yesterday) return 0;
    let streak = 1;
    for (let i = 0; i < sortedDates.length - 1; i++) {
      const diffDays = Math.ceil(Math.abs(new Date(sortedDates[i]) - new Date(sortedDates[i + 1])) / (86400000));
      if (diffDays === 1) streak++; else break;
    }
    return streak;
  };

  // 3. Calculate Stats
  const morningStreak = calculateStreak(morningRituals, r => r.waterDrank && r.mood);
  
  const bodyStreak = calculateStreak(morningRituals, r => !!r.exercise);
  const exerciseCounts = morningRituals.reduce((acc, curr) => {
    const name = curr.exercise ? curr.exercise.name : "休息";
    acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {});

  const langStreak = calculateStreak(morningRituals, r => r.english && r.english.length > 0);
  const englishCounts = morningRituals.reduce((acc, curr) => {
    if (!curr.english || curr.english.length === 0) {
      acc["跳過"] = (acc["跳過"] || 0) + 1;
    } else {
      curr.english.forEach(appId => {
        const app = ENGLISH_APPS.find(a => a.id === appId);
        const name = app ? app.name : appId;
        acc[name] = (acc[name] || 0) + 1;
      });
    }
    return acc;
  }, {});

  const knowledgeStreak = calculateStreak(morningRituals, r => r.readingPages > 0);
  const totalPages = morningRituals.reduce((acc, curr) => acc + (curr.readingPages || 0), 0);

  const deepWorkStreak = calculateStreak(workSessions, r => true);
  const totalWorkMins = workSessions.reduce((acc, curr) => acc + (curr.workDuration || 0), 0);

  const sleepStreak = calculateStreak(bedtimeRituals, r => true);

  const StatBar = ({ label, count, total, color }) => (
    <div className="mb-2">
      <div className="flex justify-between text-xs font-bold mb-1">
        <span>{label}</span>
        <span>{count}</span>
      </div>
      <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
        <div className={`h-full ${color}`} style={{ width: `${total > 0 ? (count / total) * 100 : 0}%` }}></div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 pb-8">
      
      {/* 1. Morning Ritual (HIGHLIGHT) */}
      <div className="bg-black border-4 border-orange-500 p-6 shadow-[0px_4px_15px_rgba(249,115,22,0.3)] relative overflow-hidden">
        <div className="flex justify-between items-center border-b-2 border-gray-800 pb-3 mb-4">
          <h4 className="font-black text-xl flex items-center gap-2 text-white italic uppercase">
            <Zap size={24} className="text-orange-500 fill-current" /> 早晨啟動儀式
          </h4>
          <div className="flex items-center gap-1 text-black font-black italic bg-orange-500 px-3 py-1 transform -skew-x-12">
            <Flame size={16} className="fill-current" /> {morningStreak} 天連勝
          </div>
        </div>
        <div className="flex justify-between items-end">
            <div>
                <p className="text-gray-400 text-xs font-bold uppercase mb-1">TOTAL LAUNCHES</p>
                <p className="text-5xl font-black text-white leading-none">{morningRituals.length}</p>
            </div>
            <div className="text-right">
                <p className="text-orange-500 font-bold text-xs">核心目標</p>
                <p className="text-white font-bold text-sm">喝水 + 心情紀錄</p>
            </div>
        </div>
      </div>

      {/* 2. Body Front */}
      <div className="bg-white border-4 border-black p-4 shadow-sm">
        <div className="flex justify-between items-center border-b-2 border-gray-200 pb-2 mb-3">
          <h4 className="font-black text-sm flex items-center gap-2">
            <Dumbbell size={16} /> 肉體戰線
          </h4>
          <div className="flex items-center gap-1 text-emerald-600 font-black italic bg-emerald-50 px-2 py-1 rounded">
            <Flame size={14} className="fill-current" /> {bodyStreak} DAYS
          </div>
        </div>
        {Object.entries(exerciseCounts).map(([name, count]) => (
          <StatBar key={name} label={name} count={count} total={morningRituals.length} color="bg-emerald-500" />
        ))}
      </div>

      {/* 3. Language Front */}
      <div className="bg-white border-4 border-black p-4 shadow-sm">
        <div className="flex justify-between items-center border-b-2 border-gray-200 pb-2 mb-3">
          <h4 className="font-black text-sm flex items-center gap-2">
            <Mic size={16} /> 語言戰線
          </h4>
          <div className="flex items-center gap-1 text-blue-600 font-black italic bg-blue-50 px-2 py-1 rounded">
            <Flame size={14} className="fill-current" /> {langStreak} DAYS
          </div>
        </div>
        {Object.entries(englishCounts).map(([name, count]) => (
          <StatBar key={name} label={name} count={count} total={morningRituals.length} color="bg-blue-500" />
        ))}
      </div>

      {/* 4. Knowledge Front */}
      <div className="bg-white border-4 border-black p-4 shadow-sm relative overflow-hidden">
        <div className="flex justify-between items-center border-b-2 border-gray-200 pb-2 mb-3">
          <h4 className="font-black text-sm flex items-center gap-2">
            <BookOpen size={16} /> 知識戰線
          </h4>
          <div className="flex items-center gap-1 text-orange-500 font-black italic bg-orange-50 px-2 py-1 rounded">
            <Flame size={14} className="fill-current" /> {knowledgeStreak} DAYS
          </div>
        </div>
        <div className="text-center py-2">
            <div className="text-4xl font-black text-black">{totalPages}</div>
            <div className="text-[10px] font-bold text-gray-400 uppercase">累積閱讀頁數</div>
        </div>
      </div>

      {/* 5. Deep Work */}
      <div className="bg-white border-4 border-black p-4 shadow-sm">
        <div className="flex justify-between items-center border-b-2 border-gray-200 pb-2 mb-3">
          <h4 className="font-black text-sm flex items-center gap-2">
            <Brain size={16} /> 深度工作
          </h4>
          <div className="flex items-center gap-1 text-amber-600 font-black italic bg-amber-50 px-2 py-1 rounded">
            <Flame size={14} className="fill-current" /> {deepWorkStreak} DAYS
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-center">
            <div>
                <div className="text-2xl font-black text-black">{workSessions.length}</div>
                <div className="text-[10px] font-bold text-gray-400 uppercase">SESSIONS</div>
            </div>
            <div>
                <div className="text-2xl font-black text-amber-600">{Math.round(totalWorkMins / 60)}</div>
                <div className="text-[10px] font-bold text-gray-400 uppercase">HOURS</div>
            </div>
        </div>
      </div>

      {/* 6. Sleep */}
       <div className="bg-slate-900 border-4 border-slate-700 p-4 shadow-sm relative overflow-hidden text-white">
        <div className="flex justify-between items-center border-b-2 border-slate-700 pb-2 mb-3">
          <h4 className="font-black text-sm flex items-center gap-2 text-indigo-300">
            <Moon size={16} /> 睡眠儀式
          </h4>
          <div className="flex items-center gap-1 text-indigo-300 font-black italic bg-slate-800 px-2 py-1 rounded">
            <Flame size={14} className="fill-current" /> {sleepStreak} DAYS
          </div>
        </div>
        <div className="flex justify-between items-center">
            <div className="text-xs text-slate-400 font-bold uppercase">總場次</div>
            <div className="text-2xl font-black text-white">{bedtimeRituals.length}</div>
        </div>
      </div>
    </div>
  );
};

const ScoreCard = ({ record, onClose }) => {
  if (!record) return null;

  // Helper function to render icons safely
  const renderIcon = (iconData) => {
      if (!iconData) return null;
      // If it's a string (emoji), render it
      if (typeof iconData === 'string') return iconData;
      // If it's an object, it might be a serialized React element which is unsafe
      // We return a fallback or nothing
      return null; 
  };

  // Helper for dynamic mood color in scorecard header
  const getMoodColorClasses = (level) => {
      if (level >= 5) return 'bg-orange-100 border-orange-500 text-orange-600';
      if (level >= 3) return 'bg-purple-100 border-purple-500 text-purple-600';
      return 'bg-slate-100 border-slate-500 text-slate-600';
  };

  if (record.type === 'bedtime') {
      return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={onClose}>
            <div
                className="w-full max-w-sm border-2 border-slate-600 shadow-[0px_0px_20px_rgba(79,70,229,0.3)] bg-slate-900 text-slate-200 relative animate-slide-up transform rotate-1 max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute -top-4 -right-4 bg-slate-800 text-white p-2 rounded-full border border-slate-600 hover:bg-indigo-600 transition-colors z-20">
                  <X size={24} />
                </button>
                <div className="bg-slate-800 text-white p-3 border-b border-slate-700 flex justify-between items-center sticky top-0 z-10">
                  <span className="font-black italic uppercase text-indigo-400">睡前儀式紀錄</span>
                  <span className="text-xs font-mono text-slate-400">{record.dateDisplay}</span>
                </div>
                <div className="p-6 space-y-6">
                    <div className="flex items-center gap-4 border-b border-slate-700 pb-4">
                        <div className="text-3xl">{renderIcon(record.mood?.icon) || "🌙"}</div>
                        <div>
                             <div className="text-xs font-bold text-slate-500 uppercase">心情</div>
                             <div className="text-xl font-black text-white">{record.mood?.label ? record.mood.label.split(' ')[0] : "Recorded"}</div>
                        </div>
                    </div>
                    <div>
                        <div className="text-xs font-bold text-slate-500 uppercase mb-2">檢查項目</div>
                        <div className="space-y-2">
                             {record.checklist?.map(item => (
                                 <div key={item.id} className="flex items-center gap-2 text-sm">
                                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${item.checked ? 'bg-indigo-500 border-transparent' : 'border-slate-600'}`}>
                                           {item.checked && <Check size={10} className="text-white" />}
                                      </div>
                                      <span className={item.checked ? 'text-indigo-200 font-bold' : 'text-slate-500'}>{item.text}</span>
                                 </div>
                             ))}
                        </div>
                    </div>
                    {record.note && (
                        <div className="bg-slate-800 p-3 rounded border border-slate-700">
                             <div className="text-[10px] font-bold text-slate-500 uppercase mb-1">筆記</div>
                             <p className="text-sm font-bold italic text-white">"{record.note}"</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
      )
  }

  if (record.isWorkSession) {
      return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={onClose}>
            <div className="w-full max-w-sm border-4 border-black bg-white relative animate-slide-up transform rotate-1">
                 <button onClick={onClose} className="absolute -top-4 -right-4 bg-black text-white p-2 rounded-full border-2 border-white hover:bg-orange-500 transition-colors z-20">
                    <X size={24} />
                 </button>
                 <div className="bg-black text-white p-3 border-b-4 border-black flex justify-between items-center sticky top-0 z-10">
                    <span className="font-black italic uppercase">深度工作紀錄</span>
                    <span className="text-xs font-mono text-orange-500">{record.dateDisplay}</span>
                 </div>
                 <div className="p-6">
                     <div className="text-center mb-6">
                        <div className="text-xs font-bold text-gray-500 uppercase mb-1">專注任務</div>
                        <div className="text-2xl font-black text-black">{record.workTopic || "Deep Work"}</div>
                     </div>
                     <div className="flex justify-between border-t-2 border-gray-100 pt-4">
                        <div>
                            <div className="text-xs font-bold text-gray-500 uppercase">時長</div>
                            <div className="text-xl font-black text-orange-600">{record.workDuration} 分鐘</div>
                        </div>
                        <div className="text-right">
                             <div className="text-xs font-bold text-gray-500 uppercase">時間</div>
                             <div className="text-sm font-bold">{new Date(record.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                        </div>
                     </div>
                 </div>
            </div>
        </div>
      )
  }

  const isExerciseSkipped = !record.exercise;
  const isEnglishSkipped = !record.english || record.english.length === 0;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div
        className="w-full max-w-sm border-4 border-black shadow-[8px_8px_0px_0px_rgba(249,115,22,1)] bg-white relative animate-slide-up transform rotate-1 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute -top-4 -right-4 bg-black text-white p-2 rounded-full border-2 border-white hover:bg-orange-500 transition-colors z-20">
          <X size={24} />
        </button>

        <div className="bg-black text-white p-3 border-b-4 border-black flex justify-between items-center sticky top-0 z-10">
          <span className="font-black italic uppercase">晨間儀式紀錄</span>
          <span className="text-xs font-mono text-orange-500">{record.dateDisplay}</span>
        </div>

        <div className="p-6 grid grid-cols-2 gap-6">
          <div className="col-span-2 flex items-center gap-4 border-b-2 border-gray-100 pb-4">
            <div className={`p-3 rounded-full border-2 ${getMoodColorClasses(record.mood?.level)}`}>
              {record?.mood?.level >= 3 ? <Zap size={24} className="fill-current" /> : <Activity size={24} />}
            </div>
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase">起床心情</p>
              <p className="text-xl font-black italic">{record?.mood?.label ? record.mood.label.split(' ')[0] : "Unknown"}</p>
            </div>
          </div>

          <div>
            <p className="text-xs text-gray-500 font-bold uppercase mb-2">運動項目</p>
            <p className={`text-lg font-black leading-tight ${isExerciseSkipped ? "text-gray-400 italic" : ""}`}>
              {isExerciseSkipped ? "休息" : (record.exercise?.name || "Exercise")}
            </p>
            {!isExerciseSkipped && record.exerciseSets && (
              <span className="inline-block bg-black text-white text-[10px] font-bold px-1.5 py-0.5 mt-1">
                {record.exerciseSets} 組
              </span>
            )}
          </div>

          <div>
            <p className="text-xs text-gray-500 font-bold uppercase mb-2">英文特訓</p>
            <div className="flex flex-col gap-1">
              {!isEnglishSkipped ? (
                <>
                  {record.english.map(appId => {
                    const app = ENGLISH_APPS.find(a => a.id === appId);
                    return app ? (
                      <div key={appId} className="flex items-center gap-1">
                        <div className={`w-2 h-2 rounded-full ${appId === 'toko' ? 'bg-blue-600' : 'bg-red-600'}`}></div>
                        <span className="text-xs font-bold">{app.name}</span>
                      </div>
                    ) : null;
                  })}
                  {record.englishTopic && (
                      <div className="mt-1 text-[10px] font-bold text-gray-500 border-t border-gray-200 pt-1">
                          主題：{record.englishTopic}
                      </div>
                  )}
                </>
              ) : (
                <span className="text-gray-400 font-bold italic text-xs">休息</span>
              )}
            </div>
          </div>

          <div className="col-span-2 bg-orange-50 p-3 border-2 border-orange-200 mt-2 flex justify-between items-center relative overflow-hidden">
            <div className="relative z-10">
                <span className="font-black text-orange-400 uppercase text-xs block">閱讀產出</span>
                <span className="text-3xl font-black font-mono text-orange-600">
                    {record.readingPages || 0} <span className="text-sm text-black">頁</span>
                </span>
                {record.readingBook && (
                   <div className="text-xs font-bold text-orange-800 mt-1 truncate max-w-[150px]">
                       📖 {record.readingBook}
                   </div>
                )}
            </div>
            <div className="text-right relative z-10">
                 <span className="font-black text-gray-400 uppercase text-xs block">專注時間</span>
                 <span className="text-xl font-black font-mono text-gray-600">
                    {record.readingDuration || record.workDuration || 0} <span className="text-xs">分鐘</span>
                 </span>
            </div>
            <BookOpen className="absolute -right-4 -bottom-4 text-orange-100 w-24 h-24 transform rotate-12" />
          </div>
        </div>
      </div>
    </div>
  )
}

// --- Main App Component ---
export default function MorningStrategistV17() {
  const [user, setUser] = useState(null);
  const [phase, setPhase] = useState('loading'); // sleeping, mood-check, exercise, english, reading, work-mode, finished
  const [isRestoredSession, setIsRestoredSession] = useState(false);
  const [isLocalSaved, setIsLocalSaved] = useState(false);
  
  // History States
  const [morningHistory, setMorningHistory] = useState([]);
  const [bedtimeHistory, setBedtimeHistory] = useState([]);
  const [history, setHistory] = useState([]);
  
  // View State
  const [historyTab, setHistoryTab] = useState('morning'); // morning, work, bedtime
  const [historyViewMode, setHistoryViewMode] = useState('list'); // 'list', 'calendar', 'stats'
  const [showStats, setShowStats] = useState(false); // Legacy toggle, mapped to viewMode now
  
  // Calendar State
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [selectedCalendarDate, setSelectedCalendarDate] = useState(new Date());

  const [errorMsg, setErrorMsg] = useState(null);
  const [hasManualReset, setHasManualReset] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  // Time & Greeting
  const [greeting, setGreeting] = useState("早安");
  const [isNightMode, setIsNightMode] = useState(false);

  // Content State
  const [todayQuote, setTodayQuote] = useState({ text: "", char: "", src: "" });
  const [restQuote, setRestQuote] = useState({ text: "", char: "", src: "" });
  const [moodFeedback, setMoodFeedback] = useState("");
  const [moodSyncRate, setMoodSyncRate] = useState("");

  // Data State
  const [wakeUpTime, setWakeUpTime] = useState('06:00');
  const [actualWakeUpTime, setActualWakeUpTime] = useState(null);
  const [mood, setMood] = useState(null);
  const [isWaterDrank, setIsWaterDrank] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(EXERCISE_ROUTINES[0]);
  const [selectedEnglishApps, setSelectedEnglishApps] = useState([]);
  const [englishTopic, setEnglishTopic] = useState("");
  
  // READING STATE
  const [readingGoal, setReadingGoal] = useState(15);
  const [readingTime, setReadingTime] = useState(25);
  const [readingBook, setReadingBook] = useState("");
  const [readingStep, setReadingStep] = useState('setup');
  const [actualPagesRead, setActualPagesRead] = useState(0);

  // WORK MODE STATE
  const [workTopic, setWorkTopic] = useState("");
  const [workDuration, setWorkDuration] = useState(50);
  const [workStep, setWorkStep] = useState('setup');

  // Bedtime State
  const [bedtimeChecklist, setBedtimeChecklist] = useState(BEDTIME_CHECKLIST_DEFAULTS);
  const [bedtimeNote, setBedtimeNote] = useState("");
  const [bedtimeMood, setBedtimeMood] = useState(null);
  const [isBedtimeSaving, setIsBedtimeSaving] = useState(false);
  const [bedtimeShake, setBedtimeShake] = useState(false); 

  // Timer & Set Logic
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [isActive, setIsActive] = useState(false);
  
  // Exercise Sets
  const [targetSets, setTargetSets] = useState(1);
  const [currentSet, setCurrentSet] = useState(1);
  const [setsCompleted, setSetsCompleted] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // View States
  const [viewingRecord, setViewingRecord] = useState(null);
  const [recordToDelete, setRecordToDelete] = useState(null);

  // FIX: MOVE useMemo to top level to prevent hook order error
  const displayedHistory = useMemo(() => {
      // If viewing a specific date in calendar mode, filter by that date
      if (historyViewMode === 'calendar') {
          const targetDateStr = selectedCalendarDate.toLocaleDateString('zh-TW');
          return history.filter(r => r.dateDisplay === targetDateStr);
      }

      return history.filter(r => {
          if (historyTab === 'bedtime') return r.type === 'bedtime';
          if (historyTab === 'work') return r.isWorkSession;
          return r.type !== 'bedtime' && !r.isWorkSession;
      });
  }, [history, historyTab, historyViewMode, selectedCalendarDate]);

  const timerRef = useRef(null);
  const contentRef = useRef(null);

  // ... existing effects and logic ...
  // (Copying logic from V13 but ensuring renderHistoryListView is clean)

  // --- Helpers for Local Storage ---
  const saveLocalProgress = (state) => {
      try {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
          setIsLocalSaved(true);
          setTimeout(() => setIsLocalSaved(false), 3000);
      } catch (e) {
          console.error("Local save failed", e);
      }
  };

  const clearLocalProgress = () => {
      try {
          localStorage.removeItem(LOCAL_STORAGE_KEY);
      } catch (e) {
          console.error("Local clear failed", e);
      }
  };
  
  const getDailySeededQuote = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
    const year = now.getFullYear();
    const seed = (year * 13) + (dayOfYear * 7);
    const quoteIndex = seed % QUOTE_DATABASE.length;
    return QUOTE_DATABASE[quoteIndex];
  };

  const ensureAuthenticated = async () => {
      let currentUid = auth.currentUser?.uid;
      if (!currentUid) {
          try {
              const cred = await signInAnonymously(auth);
              currentUid = cred.user.uid;
              setUser(cred.user);
          } catch (e) {
              throw new Error("無法建立連線");
          }
      }
      return currentUid;
  };

  // --- Effects ---
  useEffect(() => {
    const activePhases = ['mood-check', 'exercise', 'english', 'reading', 'work-mode'];
    if (activePhases.includes(phase)) {
        const stateToSave = {
            date: new Date().toLocaleDateString('zh-TW'),
            timestamp: Date.now(),
            phase, wakeUpTime, actualWakeUpTime, mood, isWaterDrank, 
            selectedExercise, targetSets, currentSet, setsCompleted, 
            selectedEnglishApps, englishTopic, readingGoal, readingTime, 
            readingBook, readingStep, actualPagesRead, workTopic, workDuration, 
            workStep, timeLeft, totalDuration
        };
        saveLocalProgress(stateToSave);
    }
  }, [phase, wakeUpTime, actualWakeUpTime, mood, isWaterDrank, selectedExercise, targetSets, currentSet, setsCompleted, selectedEnglishApps, englishTopic, readingGoal, readingTime, readingBook, readingStep, actualPagesRead, workTopic, workDuration, workStep, timeLeft, totalDuration]);

  useEffect(() => {
    const updateTimeContext = () => {
        const hour = new Date().getHours();
        if (hour >= 4 && hour < 11) setGreeting("早安");
        else if (hour >= 11 && hour < 18) setGreeting("午安");
        else setGreeting("晚安");
        setIsNightMode(hour >= 18 || hour < 4);
    };
    updateTimeContext();
    const interval = setInterval(updateTimeContext, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let hasActiveLocalSession = false;
    try {
        const savedRaw = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (savedRaw) {
            const saved = JSON.parse(savedRaw);
            const today = new Date().toLocaleDateString('zh-TW');
            if (saved.date === today && ['mood-check', 'exercise', 'english', 'reading', 'work-mode'].includes(saved.phase)) {
                hasActiveLocalSession = true;
            }
        }
    } catch(e) {}

    if (morningHistory.length > 0 && !hasManualReset && (phase === 'sleeping' || phase === 'loading')) {
      const latest = morningHistory[0];
      const today = new Date().toLocaleDateString('zh-TW');
      if (latest.dateDisplay === today && !hasActiveLocalSession && !latest.isWorkSession) {
        setWakeUpTime(latest.wakeUpTarget);
        setActualWakeUpTime(latest.actualWakeUpTime);
        setMood(latest.mood);
        setIsWaterDrank(latest.waterDrank);
        setSelectedExercise(latest.exercise || null);
        setSetsCompleted(latest.exerciseSets);
        setSelectedEnglishApps(latest.english || []);
        setEnglishTopic(latest.englishTopic || "");
        setActualPagesRead(latest.readingPages || 0);
        setReadingBook(latest.readingBook || "");
        setPhase('finished');
        clearLocalProgress(); 
      } 
    }
  }, [morningHistory, hasManualReset, phase]);

  useEffect(() => {
    const initAuth = async () => {
      if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
        await signInWithCustomToken(auth, __initial_auth_token);
      }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (phase === 'loading') {
        setTodayQuote(getDailySeededQuote());
        setRestQuote(REST_QUOTES[Math.floor(Math.random() * REST_QUOTES.length)]);
        let restored = false;
        try {
            const savedRaw = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (savedRaw) {
                const saved = JSON.parse(savedRaw);
                const today = new Date().toLocaleDateString('zh-TW');
                if (saved.date === today) {
                    setWakeUpTime(saved.wakeUpTime); setActualWakeUpTime(saved.actualWakeUpTime); setMood(saved.mood); setIsWaterDrank(saved.isWaterDrank); setSelectedExercise(saved.selectedExercise); setTargetSets(saved.targetSets); setCurrentSet(saved.currentSet); setSetsCompleted(saved.setsCompleted); setSelectedEnglishApps(saved.selectedEnglishApps); setEnglishTopic(saved.englishTopic); setReadingGoal(saved.readingGoal); setReadingTime(saved.readingTime); setReadingBook(saved.readingBook); setReadingStep(saved.readingStep); setActualPagesRead(saved.actualPagesRead); setWorkTopic(saved.workTopic); setWorkDuration(saved.workDuration); setWorkStep(saved.workStep); setTimeLeft(saved.timeLeft); setTotalDuration(saved.totalDuration);
                    setPhase(saved.phase); setIsActive(false); setIsRestoredSession(true);
                    setTimeout(() => setIsRestoredSession(false), 3000);
                    restored = true;
                }
            }
        } catch (e) { console.error(e) }
        if (!restored) setPhase('sleeping');
      }
    });
    return () => unsubscribe();
  }, []);

  // --- Login/Logout ---
  const handleGoogleLogin = async () => {
    setIsAuthLoading(true);
    setErrorMsg(null);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      if (error.code === 'auth/unauthorized-domain' || error.message.includes('unauthorized-domain')) {
          setErrorMsg("⚠️ 預覽環境限制：已切換至「訪客模式」。");
          if (!user) { try { await signInAnonymously(auth); } catch(e) {} }
      } else { setErrorMsg("登入失敗: " + error.message); }
    } finally { setIsAuthLoading(false); }
  };

  const handleLogout = async () => {
    try { await signOut(auth); setHistory([]); setPhase('sleeping'); setHasManualReset(true); } 
    catch (error) { console.error("Logout Failed", error); }
  };

  // --- Firestore Listeners ---
  useEffect(() => {
    if (!user) { setMorningHistory([]); setBedtimeHistory([]); setHistory([]); return; };
    const qMorning = query(collection(db, 'artifacts', appId, 'users', user.uid, 'morning_sessions'), orderBy('createdAt', 'desc'));
    const unsubMorning = onSnapshot(qMorning, (snapshot) => setMorningHistory(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))));
    const qBedtime = query(collection(db, 'artifacts', appId, 'users', user.uid, 'bedtime_sessions'), orderBy('createdAt', 'desc'));
    const unsubBedtime = onSnapshot(qBedtime, (snapshot) => setBedtimeHistory(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))));
    return () => { unsubMorning(); unsubBedtime(); };
  }, [user]);

  useEffect(() => {
      const combined = [...morningHistory, ...bedtimeHistory].sort((a, b) => {
          const tA = a.timestamp || (a.createdAt?.seconds * 1000) || 0;
          const tB = b.timestamp || (b.createdAt?.seconds * 1000) || 0;
          return tB - tA;
      });
      setHistory(combined);
  }, [morningHistory, bedtimeHistory]);

  // --- Timer Logic ---
  useEffect(() => { if (contentRef.current) contentRef.current.scrollTop = 0; }, [phase, readingStep, workStep]);
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && isActive) {
      clearInterval(timerRef.current);
      setIsActive(false);
      SoundEngine.playChime();
      if (phase === 'exercise') {
        if (currentSet < targetSets) { setCurrentSet(prev => prev + 1); setTimeLeft(selectedExercise.duration); }
      } else if (phase === 'reading' && readingStep === 'focus') { setReadingStep('result'); } 
      else if (phase === 'work-mode' && workStep === 'focus') { completeWorkSession(); }
    }
    return () => clearInterval(timerRef.current);
  }, [isActive, timeLeft, phase, readingStep, currentSet, targetSets, selectedExercise, workStep]);

  const goBack = () => {
    setIsActive(false);
    switch (phase) {
      case 'bedtime': setPhase('sleeping'); break;
      case 'mood-check': setPhase('sleeping'); break;
      case 'exercise': setPhase('mood-check'); break;
      case 'english': setPhase('exercise'); break;
      case 'reading':
        if (readingStep === 'focus') setReadingStep('setup');
        else if (readingStep === 'result') setReadingStep('focus');
        else setPhase('english');
        break;
      case 'work-mode':
        if (workStep === 'focus') setWorkStep('setup');
        else setPhase('sleeping');
        break;
      default: break;
    }
  };

  // --- Actions ---
  const handleWakeUp = async () => {
    SoundEngine.init();
    try { await ensureAuthenticated(); } catch(e) {}
    const now = new Date();
    setActualWakeUpTime(`${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`);
    setPhase('mood-check');
  };

  const startBedtimeRoutine = () => {
    setBedtimeChecklist(BEDTIME_CHECKLIST_DEFAULTS);
    setBedtimeNote(""); setBedtimeMood(null); setPhase('bedtime');
    SoundEngine.init();
  };

  const handleBedtimeCheck = (id) => {
    setBedtimeChecklist(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
    SoundEngine.playClick();
  };

  // --- UPDATED: Bedtime Button Logic (No strict allChecked requirement) ---
  const handleBedtimeButtonClick = () => {
      // Only require mood to be selected
      if (!bedtimeMood) {
          SoundEngine.playError();
          setBedtimeShake(true);
          setErrorMsg("請選擇今日心情 (Mood)");
          setTimeout(() => { setBedtimeShake(false); setErrorMsg(null); }, 2000);
          return;
      }
      saveBedtimeRecord();
  }

  const saveBedtimeRecord = async () => {
    if (isBedtimeSaving) return;
    setIsBedtimeSaving(true); SoundEngine.playChime(); setErrorMsg(null);
    try {
      const uid = await ensureAuthenticated();
      const cleanChecklist = bedtimeChecklist.map(item => ({ id: item.id, text: item.text, checked: item.checked }));
      const record = { type: 'bedtime', checklist: cleanChecklist, note: bedtimeNote, mood: bedtimeMood, dateDisplay: new Date().toLocaleDateString('zh-TW'), createdAt: serverTimestamp(), timestamp: Date.now() };
      await addDoc(collection(db, 'artifacts', appId, 'users', uid, 'bedtime_sessions'), record);
      setTimeout(() => { setIsBedtimeSaving(false); setPhase('sleeping'); if (contentRef.current) contentRef.current.scrollTop = 0; }, 1500);
    } catch (e) { console.error("Bedtime save failed:", e); setErrorMsg(`存檔失敗: ${e.message}`); setIsBedtimeSaving(false); }
  };

  const handleDeleteClick = (e, id) => { e.stopPropagation(); setRecordToDelete(id); };

  const confirmDelete = async () => {
    if (!recordToDelete) return;
    setIsDeleting(true);
    try {
      const uid = await ensureAuthenticated();
      const record = history.find(r => r.id === recordToDelete);
      const isBedtime = record && record.type === 'bedtime';
      const collectionName = isBedtime ? 'bedtime_sessions' : 'morning_sessions';
      await deleteDoc(doc(db, 'artifacts', appId, 'users', uid, collectionName, recordToDelete));
      if (!isBedtime && record && record.dateDisplay === new Date().toLocaleDateString('zh-TW') && !record.isWorkSession) {
           setHasManualReset(true); setMood(null); setActualWakeUpTime(null); setActualPagesRead(0); 
           // FIX: Removed setPhase('sleeping') to keep user on history list
      }
    } catch (err) { setErrorMsg("刪除失敗"); } finally { setIsDeleting(false); setRecordToDelete(null); }
  };

  const handleMoodSelection = (m) => {
    setMood(m);
    if (m.level === 1) { setMoodSyncRate("60% (省電模式)"); setMoodFeedback("沒關係，允許自己慢慢開機。低速檔也能前進。"); } 
    else if (m.level === 3) { setMoodSyncRate("90% (標準運轉)"); setMoodFeedback("很好，平穩的狀態是專業的基石。保持節奏。"); } 
    else { setMoodSyncRate("120% (極限超頻!)"); setMoodFeedback("太強了！今天你是球場上的國王！全速前進！"); }
  };

  const confirmMoodAndStart = () => { setCurrentSet(1); setTargetSets(1); initExerciseTimer(EXERCISE_ROUTINES[0]); setPhase('exercise'); };
  const initExerciseTimer = (routine) => { setSelectedExercise(routine); setTimeLeft(routine.duration); setTotalDuration(routine.duration); setIsActive(false); setCurrentSet(1); };
  const handleFinishExercise = () => { setSetsCompleted(currentSet); setPhase('english'); };
  const skipExercise = () => { setSelectedExercise(null); setIsActive(false); setSetsCompleted(0); setPhase('english'); };
  const toggleEnglishApp = (id) => { setSelectedEnglishApps(prev => { if (prev.includes(id)) return prev.filter(appId => appId !== id); return [...prev, id]; }); };
  const skipEnglish = () => { setSelectedEnglishApps([]); setEnglishTopic(""); setPhase('reading'); };
  const finishEnglish = () => { setPhase('reading'); };
  const startReadingTimer = () => { setReadingStep('focus'); setTimeLeft(readingTime * 60); setTotalDuration(readingTime * 60); setIsActive(true); SoundEngine.init(); };
  const startWorkTimer = () => { setWorkStep('focus'); setTimeLeft(workDuration * 60); setTotalDuration(workDuration * 60); setIsActive(true); SoundEngine.init(); };
  const skipReading = () => { setActualPagesRead(0); completeDay(true); };

  const completeDay = async (isSkipped = false) => {
    if (isSaving) return;
    setIsActive(false); setIsSaving(true); if (!isSkipped) SoundEngine.playChime(); setErrorMsg(null); clearLocalProgress();
    try {
        const uid = await ensureAuthenticated();
        const actualDuration = isSkipped ? 0 : (totalDuration > 0 ? Math.max(0, Math.ceil((totalDuration - timeLeft) / 60)) : 0);
        const record = { isMorningRoutine: true, wakeUpTarget: wakeUpTime, actualWakeUpTime: actualWakeUpTime || "N/A", mood: mood, waterDrank: isWaterDrank, exercise: selectedExercise, exerciseSets: setsCompleted, english: selectedEnglishApps, englishTopic: englishTopic, readingPages: parseInt(actualPagesRead) || 0, readingDuration: actualDuration, readingBook: readingBook, dateDisplay: new Date().toLocaleDateString('zh-TW'), createdAt: serverTimestamp(), timestamp: Date.now() };
        await addDoc(collection(db, 'artifacts', appId, 'users', uid, 'morning_sessions'), record);
        setPhase('finished');
    } catch (e) { setErrorMsg("自動存檔失敗: " + e.message); } finally { setIsSaving(false); }
  };

  const completeWorkSession = async () => {
      setIsSaving(true); SoundEngine.playChime(); setErrorMsg(null);
      const actualDuration = totalDuration > 0 ? Math.max(0, Math.ceil((totalDuration - timeLeft) / 60)) : 0;
      try {
         const uid = await ensureAuthenticated();
         const record = { isWorkSession: true, workTopic: workTopic, workDuration: actualDuration, dateDisplay: new Date().toLocaleDateString('zh-TW'), createdAt: serverTimestamp(), timestamp: Date.now() };
         await addDoc(collection(db, 'artifacts', appId, 'users', uid, 'morning_sessions'), record);
         clearLocalProgress(); setPhase('history');
      } catch(e) { setErrorMsg("存檔失敗: " + e.message); } finally { setIsSaving(false); setIsActive(false); }
  };

  // --- Manual Reset Logic ---
  const handleManualReset = () => {
    // Reset specific states
    setHasManualReset(true);
    setReadingStep('setup');
    setIsActive(false);
    setActualPagesRead(0);
    setIsWaterDrank(false);
    setSetsCompleted(0);
    setCurrentSet(1);
    setActualWakeUpTime(null);
    setMood(null);
    setSelectedExercise(EXERCISE_ROUTINES[0]);
    setSelectedEnglishApps([]);
    setEnglishTopic("");
    setWorkTopic("");
    setWorkStep('setup');
    setWorkDuration(50);
    setReadingGoal(15);
    setReadingTime(25);
    setReadingBook("");
    
    // Bedtime reset
    setBedtimeChecklist(BEDTIME_CHECKLIST_DEFAULTS);
    setBedtimeNote("");
    setBedtimeMood(null);

    // Clear Storage
    clearLocalProgress();
    
    // Feedback
    SoundEngine.playError(); // Using the error sound as a "deletion" sound effect
    setErrorMsg("系統已重置 (SYSTEM RESET)");
    setTimeout(() => setErrorMsg(null), 1500);
  };

  const renderIcon = (iconData) => { if (!iconData || typeof iconData !== 'string') return null; return iconData; };

  // --- Render Daily Aggregated Timeline View (NEW) ---
  const renderDayTimeline = (records) => {
      // 1. Separate Records by Type
      const morningRecords = records.filter(r => r.isMorningRoutine).sort((a,b) => a.timestamp - b.timestamp);
      const workRecords = records.filter(r => r.isWorkSession).sort((a,b) => a.timestamp - b.timestamp);
      const bedtimeRecords = records.filter(r => r.type === 'bedtime').sort((a,b) => a.timestamp - b.timestamp);

      if (records.length === 0) {
          return (
              <div className="flex flex-col items-center justify-center py-10 text-gray-400 border-4 border-dashed border-gray-200">
                  <CloudLightning size={48} className="mb-2 opacity-50" />
                  <p className="font-bold text-sm">無戰鬥紀錄 (NO DATA)</p>
              </div>
          );
      }

      // 2. Helper Components for Timeline Items
      const TimelineSection = ({ title, color, icon: Icon, children, isLast }) => (
          <div className="relative pl-8 pb-8">
              {/* Timeline Line */}
              {!isLast && <div className="absolute top-8 left-3.5 bottom-0 w-1 bg-gray-200"></div>}
              {/* Timeline Dot */}
              <div className={`absolute top-0 left-0 w-8 h-8 rounded-full border-4 border-white ${color} flex items-center justify-center shadow-md z-10`}>
                  <Icon size={14} className="text-white fill-current" />
              </div>
              {/* Content */}
              <div className="bg-white border-2 border-gray-100 p-4 shadow-sm relative top-1">
                  <h4 className="font-black text-sm uppercase tracking-wider mb-3 flex items-center gap-2 border-b border-gray-100 pb-2">
                      {title}
                  </h4>
                  {children}
              </div>
          </div>
      );

      return (
          <div className="py-4">
              {/* MORNING SECTION */}
              {morningRecords.map(record => (
                  <TimelineSection key={record.id} title="早晨儀式 (LAUNCH)" color="bg-orange-500" icon={Sun}>
                      <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center gap-3">
                              <div className="text-2xl">{renderIcon(record.mood?.icon) || "☀️"}</div>
                              <div>
                                  <div className="text-[10px] font-bold text-gray-400 uppercase">MOOD</div>
                                  <div className="font-black text-sm">{record.mood?.label}</div>
                              </div>
                          </div>
                          <div className="flex items-center gap-3">
                              <div className="text-xl font-mono font-black text-orange-600">{record.actualWakeUpTime}</div>
                              <div>
                                  <div className="text-[10px] font-bold text-gray-400 uppercase">WAKE UP</div>
                              </div>
                          </div>
                          
                          <div className="col-span-2 space-y-2 border-t border-gray-100 pt-2 mt-1">
                              {/* Exercise */}
                              <div className="flex justify-between items-center text-xs">
                                  <span className="font-bold text-gray-500 flex items-center gap-1"><Dumbbell size={12}/> 運動</span>
                                  <span className="font-black">{record.exercise?.name || "休息"}</span>
                              </div>
                              {/* English */}
                              <div className="flex justify-between items-center text-xs">
                                  <span className="font-bold text-gray-500 flex items-center gap-1"><Mic size={12}/> 英文</span>
                                  <span className="font-black truncate max-w-[150px]">
                                      {record.english && record.english.length > 0 
                                          ? record.english.map(aid => ENGLISH_APPS.find(a=>a.id===aid)?.name).join(', ') 
                                          : "休息"}
                                  </span>
                              </div>
                              {/* Reading */}
                              <div className="flex justify-between items-center text-xs bg-orange-50 p-1 -mx-1">
                                  <span className="font-bold text-orange-600 flex items-center gap-1"><BookOpen size={12}/> 閱讀</span>
                                  <span className="font-black text-orange-800">{record.readingPages} 頁</span>
                              </div>
                          </div>
                      </div>
                  </TimelineSection>
              ))}

              {/* WORK SECTION */}
              {workRecords.length > 0 && (
                  <TimelineSection title="深度工作 (DEEP WORK)" color="bg-amber-500" icon={Briefcase}>
                      <div className="space-y-3">
                          {workRecords.map((work, idx) => (
                              <div key={work.id} className="flex items-start gap-3 relative">
                                  <div className="text-[10px] font-mono font-bold text-gray-400 mt-1 whitespace-nowrap">
                                      {new Date(work.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                  </div>
                                  <div className="flex-1 pb-2 border-b border-gray-100 last:border-0">
                                      <div className="font-black text-sm text-black mb-1">{work.workTopic || "Deep Work Session"}</div>
                                      <div className="inline-block bg-amber-100 text-amber-800 text-[10px] font-black px-1.5 py-0.5 rounded">
                                          {work.workDuration} MIN
                                      </div>
                                  </div>
                              </div>
                          ))}
                          <div className="text-right border-t border-gray-200 pt-2">
                              <span className="text-xs font-bold text-gray-400 uppercase mr-2">今日專注總時數</span>
                              <span className="text-lg font-black text-amber-600 font-mono">
                                  {Math.floor(workRecords.reduce((acc, curr) => acc + (curr.workDuration || 0), 0) / 60)}h {workRecords.reduce((acc, curr) => acc + (curr.workDuration || 0), 0) % 60}m
                              </span>
                          </div>
                      </div>
                  </TimelineSection>
              )}

              {/* BEDTIME SECTION */}
              {bedtimeRecords.map((record, idx) => (
                  <TimelineSection key={record.id} title="系統關機 (SHUTDOWN)" color="bg-indigo-600" icon={Moon} isLast={idx === bedtimeRecords.length - 1}>
                      <div className="bg-slate-50 -m-4 p-4 text-slate-700">
                          <div className="flex justify-between items-start mb-3">
                              <div className="flex items-center gap-2">
                                  <span className="text-2xl">{renderIcon(record.mood?.icon)}</span>
                                  <div>
                                      <div className="text-[10px] font-bold text-slate-400 uppercase">SLEEP MOOD</div>
                                      <div className="font-black text-sm text-slate-800">{record.mood?.label}</div>
                                  </div>
                              </div>
                              <div className="text-xs font-mono font-bold text-slate-400">
                                  {new Date(record.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                              </div>
                          </div>
                          
                          <div className="space-y-1 mb-3">
                              {record.checklist?.map(item => (
                                  <div key={item.id} className="flex items-center gap-2 text-xs">
                                      <div className={`w-3 h-3 rounded-full border flex items-center justify-center ${item.checked ? 'bg-indigo-500 border-indigo-500' : 'border-slate-300'}`}>
                                          {item.checked && <Check size={8} className="text-white" />}
                                      </div>
                                      <span className={item.checked ? 'text-indigo-900 font-bold' : 'text-slate-400'}>{item.text}</span>
                                  </div>
                              ))}
                          </div>

                          {record.note && (
                              <div className="bg-white p-2 border-l-2 border-indigo-300 italic text-xs text-slate-600">
                                  "{record.note}"
                              </div>
                          )}
                      </div>
                  </TimelineSection>
              ))}
          </div>
      );
  };

  // --- Views ---
  const renderHistoryListView = () => {
    
    // Helper to switch view modes
    const switchMode = (mode) => {
        setHistoryViewMode(mode);
        setShowStats(mode === 'stats'); // syncing for compatibility if needed
    };

    return (
        <div className="p-4 sm:p-6 pb-24 flex flex-col min-h-full bg-white">
        <div className="flex items-center justify-between mb-6 flex-shrink-0">
            <div className="flex items-center gap-2">
            <button onClick={() => setPhase('sleeping')} className="p-2 border-2 border-black hover:bg-gray-100">
                <ChevronLeft size={24} />
            </button>
            <MangaHeader title={historyViewMode === 'stats' ? "賽季總表" : historyViewMode === 'calendar' ? "戰略日曆" : "戰績回顧"} />
            </div>
        </div>

        {/* --- View Mode Toggle --- */}
        <div className="flex border-4 border-black mb-6 bg-white">
            <button onClick={() => switchMode('list')} className={`flex-1 py-2 font-black uppercase text-sm flex items-center justify-center gap-2 ${historyViewMode === 'list' ? 'bg-black text-white' : 'text-black hover:bg-gray-100'}`}>
                <LayoutList size={16} /> 列表
            </button>
            <div className="w-1 bg-black"></div>
            <button onClick={() => switchMode('calendar')} className={`flex-1 py-2 font-black uppercase text-sm flex items-center justify-center gap-2 ${historyViewMode === 'calendar' ? 'bg-black text-white' : 'text-black hover:bg-gray-100'}`}>
                <CalendarIcon size={16} /> 日曆
            </button>
            <div className="w-1 bg-black"></div>
            <button onClick={() => switchMode('stats')} className={`flex-1 py-2 font-black uppercase text-sm flex items-center justify-center gap-2 ${historyViewMode === 'stats' ? 'bg-black text-white' : 'text-black hover:bg-gray-100'}`}>
                <BarChart2 size={16} /> 統計
            </button>
        </div>

        {/* User Info (Show only on List or Calendar top) */}
        {historyViewMode !== 'stats' && (
            <div className="mb-4 flex items-center justify-between bg-gray-100 p-3 rounded border border-gray-200">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-black text-white flex items-center justify-center rounded-full font-bold">
                        {user?.isAnonymous ? "?" : (user?.displayName?.[0] || "L")}
                    </div>
                    <div className="text-xs">
                        <div className="font-bold text-gray-500">玩家 (PLAYER)</div>
                        <div className="font-black truncate max-w-[120px]">{user?.isAnonymous ? "訪客" : (user?.displayName || "Lucas")}</div>
                    </div>
                </div>
                <button onClick={handleLogout} className="text-xs font-bold text-red-500 hover:text-red-700 flex items-center gap-1"><LogOut size={10}/> 登出</button>
            </div>
        )}

        {/* --- CONTENT AREA --- */}
        
        {/* 1. LIST VIEW */}
        {historyViewMode === 'list' && (
            <>
                <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                    <button onClick={() => setHistoryTab('morning')} className={`flex-1 py-2 font-black uppercase text-sm border-b-4 transition-all whitespace-nowrap ${historyTab === 'morning' ? 'border-orange-500 text-black' : 'border-transparent text-gray-300 hover:text-gray-500'}`}>早晨儀式</button>
                    <button onClick={() => setHistoryTab('work')} className={`flex-1 py-2 font-black uppercase text-sm border-b-4 transition-all whitespace-nowrap ${historyTab === 'work' ? 'border-amber-500 text-amber-900' : 'border-transparent text-gray-300 hover:text-gray-500'}`}>深度工作</button>
                    <button onClick={() => setHistoryTab('bedtime')} className={`flex-1 py-2 font-black uppercase text-sm border-b-4 transition-all whitespace-nowrap ${historyTab === 'bedtime' ? 'border-indigo-500 text-indigo-900' : 'border-transparent text-gray-300 hover:text-gray-500'}`}>睡前儀式</button>
                </div>
                <div className="flex-1 space-y-4 animate-fade-in">
                    {displayedHistory.length === 0 ? (
                        <div className="text-center text-gray-400 py-10 italic flex flex-col items-center justify-center h-40">
                            <p className="mb-2">尚無紀錄</p>
                            {historyTab === 'work' && <p className="text-xs text-gray-300">點擊首頁「深度工作」開始累積</p>}
                        </div>
                    ) : (
                        displayedHistory.map((record) => renderHistoryCard(record))
                    )}
                </div>
            </>
        )}

        {/* 2. CALENDAR VIEW */}
        {historyViewMode === 'calendar' && (
            <div className="flex flex-col h-full animate-fade-in">
                {/* Calendar Header Navigation */}
                <div className="flex justify-between items-center mb-4 px-2">
                    <button onClick={() => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1))} className="p-2 hover:bg-gray-100 rounded-full"><ChevronLeft size={20} /></button>
                    <span className="font-black text-lg">{calendarDate.getFullYear()} 年 {calendarDate.getMonth() + 1} 月</span>
                    <button onClick={() => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1))} className="p-2 hover:bg-gray-100 rounded-full"><ChevronRight size={20} /></button>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1 mb-2 text-center">
                    {['日','一','二','三','四','五','六'].map(d => <div key={d} className="text-xs font-bold text-gray-400">{d}</div>)}
                </div>
                <div className="grid grid-cols-7 gap-1 mb-6">
                    {/* Empty slots for start of month */}
                    {Array.from({ length: new Date(calendarDate.getFullYear(), calendarDate.getMonth(), 1).getDay() }).map((_, i) => (
                        <div key={`empty-${i}`} className="aspect-square"></div>
                    ))}
                    
                    {/* Days */}
                    {Array.from({ length: new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 0).getDate() }).map((_, i) => {
                        const day = i + 1;
                        const currentDayStr = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), day).toLocaleDateString('zh-TW');
                        const isSelected = selectedCalendarDate.toLocaleDateString('zh-TW') === currentDayStr;
                        const isToday = new Date().toLocaleDateString('zh-TW') === currentDayStr;
                        
                        // Check records for this day
                        const dayRecords = history.filter(r => r.dateDisplay === currentDayStr);
                        const hasMorning = dayRecords.some(r => r.isMorningRoutine);
                        const hasWork = dayRecords.some(r => r.isWorkSession);
                        const hasBedtime = dayRecords.some(r => r.type === 'bedtime');

                        return (
                            <div 
                                key={day} 
                                onClick={() => setSelectedCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth(), day))}
                                className={`aspect-square border-2 flex flex-col items-center justify-start pt-1 cursor-pointer transition-all relative ${isSelected ? 'border-black bg-gray-50' : 'border-transparent hover:border-gray-200'} ${isToday ? 'bg-orange-50' : ''}`}
                            >
                                <span className={`text-xs font-bold ${isToday ? 'text-orange-600' : 'text-gray-700'}`}>{day}</span>
                                <div className="flex gap-0.5 mt-1 flex-wrap justify-center px-1">
                                    {hasMorning && <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>}
                                    {hasWork && <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>}
                                    {hasBedtime && <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Selected Day Timeline View (UPDATED) */}
                <div className="border-t-4 border-black pt-4 flex-1">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-black text-lg italic uppercase">{selectedCalendarDate.toLocaleDateString('zh-TW')}</h3>
                        <span className="text-xs font-bold text-gray-400 uppercase">每日戰報</span>
                    </div>
                    {/* Render the aggregated timeline instead of simple map */}
                    {renderDayTimeline(displayedHistory)}
                </div>
            </div>
        )}

        {/* 3. STATS VIEW */}
        {historyViewMode === 'stats' && (
            <SeasonStatsDashboard history={history} />
        )}
        </div>
    );
  };

  // Helper to render individual history cards (refactored from previous ListView)
  const renderHistoryCard = (record) => {
      if (record.type === 'bedtime') {
        return (
            <div key={record.id} onClick={() => setViewingRecord(record)} className="border-2 border-slate-700 p-4 relative cursor-pointer hover:-translate-y-1 bg-slate-900 text-slate-200 group mb-4">
                <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2">
                        <span className="bg-indigo-600 text-white px-2 py-1 text-xs font-bold font-mono">{record.dateDisplay}</span>
                        <span className="text-xs font-bold text-indigo-300 bg-slate-800 px-2 py-1 rounded flex items-center gap-1">
                            <Clock size={10} /> {new Date(record.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                    </div>
                    <button onClick={(e) => handleDeleteClick(e, record.id)} className="text-slate-500 hover:text-red-500"><Trash2 size={20} /></button>
                </div>
                <div className="flex items-center gap-2 text-sm font-bold text-white">
                    <span>{renderIcon(record.mood?.icon)} {record.mood?.label}</span>
                </div>
            </div>
        )
    }
    if (record.isWorkSession) {
        return (
            <div key={record.id} onClick={() => setViewingRecord(record)} className="border-4 border-black p-5 relative cursor-pointer hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all bg-amber-50 group mb-4">
                <div className="flex justify-between items-start mb-4 border-b-2 border-amber-200 pb-2">
                    <div className="flex items-center gap-2">
                        <span className="bg-black text-white px-2 py-1 text-xs font-bold font-mono">{record.dateDisplay}</span>
                        <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2 py-1 rounded flex items-center gap-1">
                            <Clock size={10} /> {new Date(record.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                    </div>
                    <button onClick={(e) => handleDeleteClick(e, record.id)} className="text-gray-400 hover:text-red-500 transition-colors p-1"><Trash2 size={16} /></button>
                </div>
                <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-end">
                        <span className="font-black text-xl leading-tight text-black break-words flex-1 pr-4">{record.workTopic || "Deep Work"}</span>
                        <div className="text-right shrink-0">
                            <span className="text-3xl font-black font-mono text-orange-600 leading-none block">{record.workDuration}</span>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">MINUTES</span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    // MORNING ROUTINE SUMMARY CARD
    return (
        <div key={record.id} onClick={() => setViewingRecord(record)} className="border-4 border-black p-4 relative cursor-pointer hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all bg-white group mb-3">
            {/* Date Header */}
            <div className="flex justify-between items-center mb-3 border-b-2 border-gray-100 pb-2">
                <div className="flex items-center gap-2">
                    <span className="bg-black text-white px-2 py-1 text-xs font-bold font-mono">{record.dateDisplay}</span>
                    <span className="text-xs font-black text-gray-500 bg-gray-100 px-2 py-1 rounded flex items-center gap-1">
                        <Sun size={10} /> {record.actualWakeUpTime || "N/A"}
                    </span>
                </div>
                <button onClick={(e) => handleDeleteClick(e, record.id)} className="text-gray-300 hover:text-red-500 transition-colors p-1"><Trash2 size={16} /></button>
            </div>
            
            {/* Indicators Grid */}
            <div className="grid grid-cols-4 gap-2">
                {/* Mood - Modified to show completion colors (Purple for standard to distinct from Green Exercise) */}
                <div className={`flex flex-col items-center justify-center p-2 rounded border-2 ${
                    record.mood 
                        ? (record.mood.level >= 5 ? 'border-orange-500 bg-orange-50 text-orange-600' 
                          : record.mood.level >= 3 ? 'border-purple-500 bg-purple-50 text-purple-600' 
                          : 'border-slate-500 bg-slate-100 text-slate-600')
                        : 'border-dashed border-gray-200 opacity-30 text-gray-300'
                }`}>
                    <div className="text-xl mb-1">{record.mood?.level >= 5 ? "🔥" : record.mood?.level >= 3 ? "⚡" : record.mood?.level === 1 ? "💤" : "😶"}</div>
                    <span className="text-[9px] font-black uppercase text-current">MOOD</span>
                </div>

                {/* Exercise */}
                <div className={`flex flex-col items-center justify-center p-2 rounded border-2 ${record.exercise ? 'border-emerald-500 bg-emerald-50 text-emerald-600' : 'border-gray-200 text-gray-300 bg-gray-50 opacity-50'}`}>
                    <Dumbbell size={20} className={record.exercise ? "fill-current" : ""} />
                    <span className="text-[9px] font-black uppercase mt-1">BODY</span>
                </div>

                {/* English */}
                <div className={`flex flex-col items-center justify-center p-2 rounded border-2 ${record.english && record.english.length > 0 ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-gray-200 text-gray-300 bg-gray-50 opacity-50'}`}>
                    <Mic size={20} className={record.english && record.english.length > 0 ? "fill-current" : ""} />
                    <span className="text-[9px] font-black uppercase mt-1">LANG</span>
                </div>

                {/* Reading */}
                <div className={`flex flex-col items-center justify-center p-2 rounded border-2 ${record.readingPages > 0 ? 'border-orange-500 bg-orange-50 text-orange-600' : 'border-gray-200 text-gray-300 bg-gray-50 opacity-50'}`}>
                    <BookOpen size={20} className={record.readingPages > 0 ? "fill-current" : ""} />
                    <span className="text-[9px] font-black uppercase mt-1">READ</span>
                </div>
            </div>
            {/* Optional: Show "Completed" text or arrow to indicate clickable */}
            <div className="text-center mt-2">
                 <span className="text-[10px] font-bold text-gray-300 group-hover:text-orange-500 transition-colors">▼ CHECK DETAILS</span>
            </div>
        </div>
        )
  };

  // Re-include all render views from V13
  const renderBedtimeView = () => {
    const allChecked = bedtimeChecklist.every(i => i.checked);
    const isReadyToSave = allChecked && bedtimeMood;
    if (isBedtimeSaving) return (<div className="h-full flex flex-col items-center justify-center p-6 bg-indigo-950 text-white animate-fade-in"><Moon size={64} className="text-yellow-300 animate-pulse mb-6" /><h2 className="text-3xl font-black italic uppercase tracking-widest mb-2">晚安</h2><p className="font-bold text-indigo-200">系統關機中...</p></div>)
    return (
      <div className="p-4 sm:p-6 pb-24 flex flex-col min-h-full bg-slate-900 text-slate-200">
        <MangaHeader title="睡前儀式" subtitle="關機程序" onBack={goBack} />
        <div className="space-y-3 mb-8 mt-4">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2">檢查項目 (CHECKLIST)</h3>
            {bedtimeChecklist.map((item) => (
              <div key={item.id} onClick={() => handleBedtimeCheck(item.id)} className={`flex items-center gap-4 p-4 border-2 cursor-pointer transition-all duration-200 rounded-lg ${item.checked ? 'bg-indigo-600 border-indigo-400 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>
                <div className={`w-8 h-8 shrink-0 flex items-center justify-center rounded-full border-2 ${item.checked ? 'border-white bg-indigo-500' : 'border-slate-600 bg-transparent'}`}>{item.checked && <Check size={18} className="text-white" strokeWidth={4} />}</div>
                <span className="font-bold text-lg flex-1 select-none">{item.text}</span>
                <span className="text-2xl">{getBedtimeIcon(item.id)}</span>
              </div>
            ))}
        </div>
        <div>
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">今日心情 (MOOD)</h3>
            <div className="grid grid-cols-3 gap-3 mb-6">
                {[{ val: 1, label: "疲勞", icon: "😫" }, { val: 3, label: "平靜", icon: "😌" }, { val: 5, label: "充實", icon: "🤩" }].map(m => (
                    <button key={m.val} onClick={() => setBedtimeMood(m)} className={`p-3 border-2 rounded-xl flex flex-col items-center gap-2 transition-all ${bedtimeMood?.val === m.val ? 'bg-indigo-600 border-white text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>
                        <span className="text-2xl">{m.icon}</span><span className="text-xs font-black">{m.label}</span>
                    </button>
                ))}
            </div>
            <textarea value={bedtimeNote} onChange={(e) => setBedtimeNote(e.target.value)} placeholder="今日隨筆..." className="w-full bg-slate-800 border-2 border-slate-700 text-white p-4 rounded-xl font-bold min-h-[100px]" />
        </div>
        <button onClick={handleBedtimeButtonClick} className={`mt-auto w-full py-5 rounded-xl font-black uppercase text-xl flex items-center justify-center gap-3 transition-all transform active:scale-95 ${bedtimeShake ? 'animate-shake bg-red-700 border-red-500 text-white' : 'bg-indigo-500 text-white hover:bg-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.5)]'}`}>
            {isBedtimeSaving ? <Loader2 className="animate-spin"/> : <Moon className={!bedtimeMood ? "" : "fill-current animate-pulse"} />} 
            {bedtimeMood ? "關燈 (Good Night)" : "點此完成 (需選心情)"}
        </button>
      </div>
    );
  };

  const renderMoodCheckView = () => {
    if (mood) {
      let colorClass = mood.level === 1 ? "text-slate-500" : mood.level === 3 ? "text-purple-500" : "text-orange-500";
      let barColorClass = mood.level === 1 ? "bg-slate-500" : mood.level === 3 ? "bg-purple-500" : "bg-orange-500";
      return (
        <div className="p-4 sm:p-6 pb-24 flex flex-col h-full justify-center items-center animate-fade-in">
          <div className="w-full max-w-xs border-8 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(249,115,22,1)] text-center transform rotate-1">
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">SYSTEM ANALYSIS</p>
            <h3 className={`text-3xl font-black italic ${colorClass} mb-1 animate-pulse`}>{moodSyncRate}</h3>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-6"><div className={`h-full ${barColorClass} w-full animate-slide-stripes`}></div></div>
            <p className="text-black font-bold text-lg leading-tight mb-8">"{moodFeedback}"</p>
            <PowerButton variant="success" onClick={confirmMoodAndStart} className="w-full py-4 text-xl">前往熱身 <ArrowRight size={20} /></PowerButton>
          </div>
        </div>
      );
    }
    return (
      <div className="p-4 sm:p-6 pb-24">
        <MangaHeader title="早晨啟動程序" subtitle="誠實面對身體的回饋。" step="1" onBack={() => goBack()} />
        <div className="mb-8 bg-blue-50 border-4 border-blue-200 p-4 rounded-xl text-center">
          {!isWaterDrank ? (
            <><p className="text-blue-800 font-bold mb-4 text-sm">起床第一件事：啟動大腦</p><PowerButton variant="info" onClick={() => { setIsWaterDrank(true); SoundEngine.playClick(); }}><Droplets className="mr-2" /> 補充水分 (DRINK)</PowerButton></>
          ) : (<div className="animate-fade-in flex flex-col items-center"><p className="text-blue-900 font-black italic text-lg">狀態回復！大腦開機中...</p></div>)}
        </div>
        <div className={`flex flex-col gap-4 transition-opacity duration-300 ${!isWaterDrank ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
          {[{ level: 1, label: "狀態不佳 (省電)", color: "slate" }, { level: 3, label: "普通 (標準)", color: "purple" }, { level: 5, label: "絕好調 (超頻!)", color: "orange" }].map(m => (
              <button key={m.level} onClick={() => handleMoodSelection(m)} className={`p-4 border-4 border-${m.color}-600 bg-${m.color}-500 text-white font-black italic text-lg text-left hover:translate-x-1 transition-transform shadow-md`}>{m.label}</button>
          ))}
        </div>
      </div>
    );
  };

  const renderExerciseView = () => (
    <div className="p-4 sm:p-6 pb-24 flex flex-col min-h-full">
      <MangaHeader title="肉體活性化" subtitle={moodFeedback} step="2" onBack={() => goBack()} />
      <div className="grid grid-cols-1 gap-3 mb-6">
        {EXERCISE_ROUTINES.map(routine => (
          <button key={routine.id} onClick={() => initExerciseTimer(routine)} className={`p-4 border-4 text-left transition-all relative overflow-hidden flex flex-col transform skew-x-[-3deg] ${selectedExercise?.id === routine.id ? 'bg-orange-500 text-white border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-x-1' : 'bg-white text-black border-black hover:bg-gray-100'}`}>
            <div className="flex justify-between items-center w-full skew-x-[3deg]"><span className="font-black italic text-lg uppercase">{routine.name}</span><span className={`text-xl font-black italic ${selectedExercise?.id === routine.id ? 'text-black' : 'text-orange-500'}`}>{Math.floor(routine.duration / 60)}'</span></div>
            <span className="text-xs font-bold mt-1 opacity-90 skew-x-[3deg] uppercase tracking-wider">{routine.eng}</span>
          </button>
        ))}
      </div>
      <div className="flex items-center justify-between bg-gray-100 p-3 border-4 border-black mb-4"><span className="font-black uppercase">SETS (組數):</span><div className="flex items-center gap-4"><button onClick={() => setTargetSets(Math.max(1, targetSets - 1))} className="w-8 h-8 font-black">-</button><span className="text-2xl font-black text-orange-500">{targetSets}</span><button onClick={() => setTargetSets(Math.min(10, targetSets + 1))} className="w-8 h-8 font-black">+</button></div></div>
      <div className="relative"><div className="absolute top-2 left-2 z-20 bg-black text-white px-2 py-1 text-xs font-black uppercase">SET {currentSet} / {targetSets}</div><TimerDisplay timeLeft={timeLeft} totalDuration={totalDuration} /></div>
      <div className="flex gap-4 w-full mb-6"><PowerButton variant={isActive ? "secondary" : "primary"} onClick={() => setIsActive(!isActive)} className="flex-1 py-4 text-xl">{isActive ? <><Pause className="fill-current" /> 暫停</> : <><Play className="fill-current" /> 開始</>}</PowerButton><button onClick={() => initExerciseTimer(selectedExercise || EXERCISE_ROUTINES[0])} className="p-4 border-4 border-black bg-white text-black hover:bg-gray-100 transform skew-x-[-6deg]"><RotateCcw className="skew-x-[6deg]" /></button></div>
      <div className="flex justify-between items-center mt-auto"><PowerButton variant="ghost" className="w-1/3 text-xs" onClick={skipExercise}><SkipForward size={16} className="mr-1" /> 跳過</PowerButton><button onClick={handleFinishExercise} className="mx-auto text-gray-500 font-black italic text-sm hover:text-orange-500 inline-flex items-center gap-1">完成 <ArrowRight size={16} /></button></div>
    </div>
  );

  const renderEnglishView = () => (
    <div className="p-4 sm:p-6 pb-24 flex flex-col min-h-full">
      <MangaHeader title="語言特訓" subtitle="選擇今日訓練項目。" step="3" onBack={() => goBack()} />
      <div className="flex flex-col gap-3 mb-6">
        {ENGLISH_APPS.map(app => {
          const isSelected = selectedEnglishApps.includes(app.id);
          return (
            <div key={app.id} onClick={() => toggleEnglishApp(app.id)} className={`border-4 border-black p-4 cursor-pointer flex items-center gap-4 ${isSelected ? 'bg-black text-white' : 'bg-white text-black'}`}>
              <div className={`p-2 rounded-full text-white ${app.color}`}>{app.icon}</div><div className="flex-1"><h3 className="text-xl font-black italic uppercase">{app.name}</h3><p className={`text-xs font-bold ${isSelected ? 'text-gray-400' : 'text-gray-500'}`}>{app.desc}</p></div>{isSelected && <Check size={24} strokeWidth={4} className="text-orange-500" />}
            </div>
          );
        })}
      </div>
      <div className="mb-8"><label className="block text-xs font-black uppercase text-gray-500 mb-2">自訂練習主題</label><input type="text" value={englishTopic} onChange={(e) => setEnglishTopic(e.target.value)} placeholder="Topic..." className="w-full p-4 border-4 border-black font-bold text-lg" /></div>
      <div className="flex gap-3 mt-auto"><PowerButton variant="ghost" className="w-1/3 text-sm" onClick={skipReading}><SkipForward size={16} className="mr-1" /> 跳過</PowerButton><PowerButton variant="primary" className="flex-1" onClick={finishEnglish}>完成 <ArrowRight size={20} /></PowerButton></div>
    </div>
  );

  const renderReadingView = () => (
    <div className="p-4 sm:p-6 pb-24 flex flex-col min-h-full">
      {readingStep === 'setup' && (
        <>
          <MangaHeader title="閱讀儀式" subtitle="輸入知識，沉澱心靈。" step="4" onBack={() => goBack()} />
          <div className="flex-1 flex flex-col justify-center items-center">
            <div className="w-full mb-6"><label className="block text-xs font-black uppercase text-gray-500 mb-2 flex items-center gap-1"><Target size={14} /> 今日目標 (Pages)</label><div className="flex items-center gap-4"><button onClick={() => setReadingGoal(Math.max(1, readingGoal - 5))} className="w-12 h-12 border-4 border-black bg-white font-black hover:bg-gray-100">-</button><div className="flex-1 border-4 border-black bg-white p-3 text-center"><span className="text-3xl font-black">{readingGoal}</span> <span className="text-xs font-bold text-gray-400">PAGES</span></div><button onClick={() => setReadingGoal(readingGoal + 5)} className="w-12 h-12 border-4 border-black bg-white font-black hover:bg-gray-100">+</button></div></div>
            <div className="w-full mb-6"><label className="block text-xs font-black uppercase text-gray-500 mb-2 flex items-center gap-1"><Clock size={14} /> 番茄鐘設定 (Minutes)</label><div className="grid grid-cols-3 gap-3">{[15, 25, 45].map(t => (<button key={t} onClick={() => setReadingTime(t)} className={`py-3 border-4 border-black font-black italic ${readingTime === t ? 'bg-orange-500 text-white shadow-[4px_4px_0px_0px_black]' : 'bg-white hover:bg-gray-50'}`}>{t}m</button>))}</div></div>
            <div className="w-full mb-8"><label className="block text-xs font-black uppercase text-gray-500 mb-2 flex items-center gap-1"><Book size={14} /> 書名 (Optional)</label><input type="text" value={readingBook} onChange={(e) => setReadingBook(e.target.value)} placeholder="正在閱讀..." className="w-full p-3 border-4 border-black font-bold text-lg focus:outline-none focus:border-orange-500" /></div>
            <PowerButton variant="primary" className="w-full py-6 text-2xl mt-auto" onClick={startReadingTimer}>開始閱讀 (Start)</PowerButton>
            <button onClick={skipReading} className="mt-4 text-gray-400 font-bold text-xs uppercase hover:text-black">Skip Reading</button>
          </div>
        </>
      )}
      {readingStep === 'focus' && (
        <div className="flex-1 bg-amber-50 -m-4 sm:-m-6 p-4 sm:p-6 flex flex-col min-h-full border-l-8 border-orange-200">
          <div className="mb-6 flex items-center justify-center gap-2 px-4 py-2 font-black text-orange-800"><BookOpen size={20} /> DEEP READING MODE</div>
          <div className="flex-1 flex flex-col justify-center"><TimerDisplay timeLeft={timeLeft} totalDuration={totalDuration} /><p className="text-center font-black italic text-2xl text-black mt-8 animate-pulse">ABSORB KNOWLEDGE</p>{readingBook && <p className="text-center font-bold text-orange-600 mt-2">{readingBook}</p>}</div>
          <div className="mt-auto space-y-4"><PowerButton variant="secondary" className="w-full" onClick={() => setIsActive(!isActive)}>{isActive ? "暫停 (Pause)" : "繼續 (Resume)"}</PowerButton><button onClick={() => setReadingStep('result')} className="w-full text-center text-gray-400 font-bold hover:text-orange-500 py-2">完成/提早結束</button></div>
        </div>
      )}
      {readingStep === 'result' && (
          <div className="flex-1 flex flex-col justify-center items-center">
              <MangaHeader title="閱讀成果" subtitle="紀錄你的累積。" step="4" />
              <div className="w-full max-w-xs bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_black] transform -rotate-1 mb-8"><label className="block text-center text-xs font-black uppercase text-gray-500 mb-4">實際閱讀頁數 (ACTUAL PAGES)</label><div className="flex items-center justify-center gap-2"><input type="number" value={actualPagesRead} onChange={(e) => setActualPagesRead(e.target.value)} placeholder="0" className="w-24 text-center text-5xl font-black font-mono border-b-4 border-orange-500 focus:outline-none bg-transparent" autoFocus /><span className="text-xl font-black text-gray-400 self-end mb-2">/ {readingGoal}</span></div></div>
              <PowerButton variant="success" className="w-full py-5 text-xl mt-auto" onClick={() => completeDay(false)} loading={isSaving}>完成儀式 (FINISH)</PowerButton>
          </div>
      )}
    </div>
  );

  const renderWorkModeView = () => (
      <div className="p-4 sm:p-6 pb-24 flex flex-col min-h-full bg-amber-50">
          <MangaHeader title="深度工作" subtitle="專注時段" onBack={goBack} />
          {workStep === 'setup' && (
            <div className="flex-1 flex flex-col items-center justify-center">
                 <div className="w-full mb-6"><label className="block text-xs font-black uppercase text-gray-500 mb-2 flex items-center gap-1"><Edit3 size={14} /> 任務內容 (Task)</label><input type="text" value={workTopic} onChange={(e) => setWorkTopic(e.target.value)} placeholder="Planning Strategy..." className="w-full p-4 border-4 border-black font-bold text-lg bg-white focus:outline-none focus:border-orange-500" /></div>
                 <div className="w-full mb-8"><label className="block text-xs font-black uppercase text-gray-500 mb-2 flex items-center gap-1"><Clock size={14} /> 專注時長 (Minutes)</label><div className="grid grid-cols-3 gap-3">{[25, 50, 90].map(t => (<button key={t} onClick={() => setWorkDuration(t)} className={`py-4 border-4 border-black font-black italic text-xl ${workDuration === t ? 'bg-orange-500 text-white shadow-[4px_4px_0px_0px_black]' : 'bg-white hover:bg-gray-100'}`}>{t}</button>))}</div></div>
                 <PowerButton variant="primary" onClick={startWorkTimer} className="w-full py-6 text-2xl mt-auto">開始專注 (Focus)</PowerButton>
            </div>
          )}
          {workStep === 'focus' && (
              <div className="flex-1 flex flex-col min-h-full"> 
                  <div className="w-full bg-black text-white p-4 mb-8 text-center border-4 border-orange-500 shadow-md transform rotate-1"><h3 className="font-black text-xl italic uppercase tracking-wider">深度工作模式</h3></div>
                  <div className="flex-1 flex flex-col justify-center items-center w-full">
                      <TimerDisplay timeLeft={timeLeft} totalDuration={totalDuration} />
                      <div className="text-center mt-10 mb-10"><p className="font-black text-3xl text-black mb-2">{workTopic || "Deep Work"}</p><div className="inline-block bg-orange-100 px-4 py-1 rounded-full border-2 border-orange-200"><p className="text-xs font-bold text-orange-600 uppercase tracking-widest">保持專注 STAY FOCUSED</p></div></div>
                  </div>
                  <div className="mt-auto w-full space-y-4 pb-4">
                      <PowerButton variant={isActive ? "secondary" : "success"} onClick={() => setIsActive(!isActive)} className="py-6 text-xl">{isActive ? <><Pause className="fill-current"/> 暫停計時</> : <><Play className="fill-current"/> 繼續專注</>}</PowerButton>
                      <button onClick={completeWorkSession} className="w-full py-4 text-gray-400 font-bold hover:text-red-500 uppercase text-xs tracking-wider border-t-2 border-transparent hover:border-gray-200 transition-all">提早結束並記錄 (End Session)</button>
                  </div>
              </div>
          )}
      </div>
  );

  const renderFinishedView = () => {
    const finalDuration = totalDuration > 0 ? Math.max(0, Math.ceil((totalDuration - timeLeft) / 60)) : 0;
    const displayData = { readingPages: actualPagesRead || 0, readingTime: finalDuration };
    
    // Calculate Today's Work Stats
    const todayStr = new Date().toLocaleDateString('zh-TW');
    const todayWork = history.filter(r => r.isWorkSession && r.dateDisplay === todayStr);
    const totalWorkMinutes = todayWork.reduce((acc, curr) => acc + (curr.workDuration || 0), 0);

    return (
      <div className="p-4 sm:p-6 flex flex-col min-h-full bg-white relative overflow-hidden">
        <MangaHeader title="今日戰果" subtitle="任務完成" />
        <div className="border-4 border-black p-0 mb-6 shadow-[8px_8px_0px_0px_rgba(249,115,22,1)] bg-white relative z-10 hover:scale-[1.01] transition-transform">
          <div className="bg-black text-white p-3 border-b-4 border-black flex justify-between items-center"><span className="font-black italic uppercase">LUCAS'S SCOREBOARD</span><span className="text-xs font-mono text-orange-500">{new Date().toLocaleDateString('zh-TW')}</span></div>
          <div className="p-6 grid grid-cols-2 gap-6">
            
            {/* 1. Wake Up & Mood Row (Modified) */}
            <div className="col-span-2 grid grid-cols-2 gap-4 border-b-2 border-gray-100 pb-4">
                {/* Wake Up Time */}
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-gray-100 rounded-full border-2 border-gray-300 text-gray-600">
                        <Sun size={24} className="fill-current" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 font-bold uppercase">起床時間</p>
                        <p className="text-xl font-black italic font-mono">{actualWakeUpTime || "N/A"}</p>
                    </div>
                </div>

                {/* Mood */}
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-orange-100 rounded-full border-2 border-orange-500 text-orange-600">
                        {mood?.level >= 3 ? <Zap size={24} className="fill-current" /> : <Activity size={24} />}
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 font-bold uppercase">心情</p>
                        {/* UPDATED: Only show the first part of the label (remove brackets) */}
                        <p className="text-xl font-black italic">{mood?.label ? mood.label.split(' ')[0] : "Unknown"}</p>
                    </div>
                </div>
            </div>

            {/* 2. Exercise */}
            <div><p className="text-xs text-gray-500 font-bold uppercase mb-2">運動</p><p className="text-lg font-black leading-tight">{selectedExercise ? selectedExercise.name : "休息"}</p></div>
            
            {/* 3. English */}
            <div>
                <p className="text-xs text-gray-500 font-bold uppercase mb-2">英文</p>
                {selectedEnglishApps.length > 0 ? (
                    <div className="flex flex-col gap-1">
                        {selectedEnglishApps.map(appId => {
                            const app = ENGLISH_APPS.find(a => a.id === appId);
                            return app ? (
                                <div key={appId} className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${appId === 'toko' ? 'bg-blue-600' : 'bg-red-600'}`} />
                                    <span className="text-sm font-black leading-tight">{app.name}</span>
                                </div>
                            ) : null;
                        })}
                        {englishTopic && (
                            <p className="text-xs font-bold text-gray-500 mt-1 border-t border-gray-200 pt-1">主題：{englishTopic}</p>
                        )}
                    </div>
                ) : (
                    <p className="text-lg font-black leading-tight text-gray-400 italic">跳過</p>
                )}
            </div>

            {/* 4. Deep Work Stats (NEW) */}
            <div className="col-span-2 bg-amber-50 p-4 border-2 border-amber-200 flex flex-col justify-between relative overflow-hidden">
                <div className="flex justify-between items-center mb-2 relative z-10">
                    <div>
                        <span className="font-black text-amber-600 uppercase text-xs block">深度工作 (今日累積)</span>
                        <span className="text-3xl font-black font-mono text-amber-800">{totalWorkMinutes} <span className="text-sm text-black">min</span></span>
                    </div>
                    <div className="text-right">
                        <span className="font-black text-gray-400 uppercase text-xs block">回合數</span>
                        <span className="text-xl font-black font-mono text-gray-600">{todayWork.length} <span className="text-xs">SESSIONS</span></span>
                    </div>
                </div>
                
                {/* Work Topics List */}
                {todayWork.length > 0 && (
                    <div className="relative z-10 border-t border-amber-200 pt-2 mt-1">
                        <p className="text-[10px] font-bold text-amber-500 uppercase mb-1">今日任務</p>
                        <div className="flex flex-wrap gap-2">
                            {todayWork.map((w, i) => (
                                <span key={i} className="text-xs font-bold bg-white px-2 py-1 rounded border border-amber-100 text-amber-900">{w.workTopic || "Deep Work"}</span>
                            ))}
                        </div>
                    </div>
                )}
                <Briefcase className="absolute -right-4 -bottom-4 text-amber-100 w-24 h-24 transform rotate-12" />
            </div>

            {/* 5. Reading Stats */}
            <div className="col-span-2 bg-orange-50 p-4 border-2 border-orange-200 flex justify-between items-center relative overflow-hidden">
                <div className="relative z-10">
                    <span className="font-black text-orange-400 uppercase text-xs block">閱讀產出 (本次)</span>
                    <span className="text-4xl font-black font-mono text-orange-600">{displayData.readingPages}</span>
                    {readingBook && (
                        <div className="text-sm font-bold text-orange-900 mt-1 flex items-center gap-1">
                            📖 {readingBook}
                        </div>
                    )}
                </div>
                <div className="text-right relative z-10">
                    <span className="font-black text-gray-400 uppercase text-xs block">專注時間</span>
                    <span className="text-xl font-black font-mono text-gray-600">{displayData.readingTime} <span className="text-xs">分鐘</span></span>
                </div>
                <BookOpen className="absolute -right-4 -bottom-4 text-orange-100 w-24 h-24 transform rotate-12" />
            </div>

          </div>
        </div>
        <div className="bg-gray-100 border-4 border-black p-4 w-full relative z-10 transform -rotate-1 mb-6"><p className="text-sm text-gray-500 font-black uppercase mb-1 flex items-center gap-1"><MessageSquare size={14} /> 教練的叮嚀</p><p className="text-base text-black font-bold leading-tight">「{restQuote.text}」</p><p className="text-xs text-gray-400 text-right mt-1 font-black italic">— {restQuote.char}</p></div>
        <div className="flex gap-3 mt-auto"><button onClick={() => setPhase('history')} className="flex-1 py-4 border-4 border-black bg-white hover:bg-gray-100 font-black uppercase flex items-center justify-center gap-2 text-sm"><History size={18} /> 歷史紀錄</button><button onClick={() => { setHasManualReset(true); setPhase('sleeping'); setReadingStep('setup'); setIsActive(false); setActualPagesRead(0); setRestQuote(REST_QUOTES[Math.floor(Math.random() * REST_QUOTES.length)]); setIsWaterDrank(false); setSetsCompleted(0); setCurrentSet(1); setActualWakeUpTime(null); setMood(null); }} className="flex-1 py-4 bg-black text-white font-black uppercase hover:bg-orange-500 transition-colors text-sm flex items-center justify-center gap-2"><RotateCcw size={18} /> 重置 (RESET)</button></div>
      </div>
    );
  };

  return (
    <div className="h-screen w-full bg-gray-900 flex items-center justify-center font-sans text-slate-800 overflow-hidden">
      <div className="w-full max-w-md h-full sm:h-[90vh] sm:rounded-3xl bg-white flex flex-col relative overflow-hidden shadow-2xl sm:border-8 sm:border-gray-800">
        {errorMsg && (<div className="absolute top-0 left-0 w-full bg-red-600 text-white text-center text-xs font-bold py-2 z-[60] animate-fade-in flex items-center justify-center gap-2 shadow-lg cursor-pointer" onClick={() => setErrorMsg(null)}><AlertCircle size={14} /> {errorMsg} <X size={14} /></div>)}
        {isRestoredSession && (<div className="absolute top-16 left-0 w-full bg-green-500 text-white text-center text-xs font-bold py-1 z-50 animate-fade-in flex items-center justify-center gap-2"><CloudLightning size={14} className="fill-current" /> 已自動恢復進度</div>)}
        {phase !== 'loading' && phase !== 'finished' && phase !== 'sleeping' && phase !== 'history' && phase !== 'bedtime' && phase !== 'work-mode' && (
          <div className="h-16 shrink-0 bg-black border-b-4 border-orange-500 flex items-center justify-between px-4 sm:px-6 relative z-50 shadow-[0px_4px_0px_0px_rgba(249,115,22,1)]">
            <div className="flex items-center gap-3">
                {/* MODIFIED: Make Logo Clickable to go HOME */}
                <button onClick={() => setPhase('sleeping')} className="font-black italic text-2xl text-white tracking-tighter uppercase transform -skew-x-12 hover:text-gray-300 transition-colors">
                    M<span className="text-orange-500">.STRAT</span>
                </button>
                <div className={`transition-all duration-300 overflow-hidden ${isLocalSaved ? 'w-16 opacity-100' : 'w-0 opacity-0'}`}>
                    <div className="bg-green-500 text-white text-[10px] font-black uppercase px-2 py-1 whitespace-nowrap flex items-center gap-1 rounded transform skew-x-[-12deg]"><Save size={10} /> 已存檔</div>
                </div>
            </div>
            <div className="flex items-center gap-2 bg-white border-2 border-black px-2 py-1 transform skew-x-[-12deg]"><span className="text-xs font-black text-black skew-x-[12deg]">{wakeUpTime} 開始</span></div>
          </div>
        )}
        <div ref={contentRef} className="flex-1 overflow-y-auto overflow-x-hidden bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
          {phase === 'loading' && (<div className="flex flex-col items-center justify-center h-full bg-black"><Loader2 size={48} className="text-orange-500 animate-spin mb-4" /><p className="text-white font-black italic uppercase tracking-wider">載入中...</p></div>)}
          {phase === 'sleeping' && (
            <div className="min-h-full flex flex-col items-center justify-center p-6 bg-black relative transition-colors duration-1000">
              <div className="absolute inset-0 flex flex-col pointer-events-none opacity-20 select-none overflow-hidden leading-none font-black italic text-8xl text-white text-left whitespace-nowrap"><span>{isNightMode ? "REST UP" : "WAKE UP"}</span><span className="ml-20">FLY HIGH</span><span>DON'T STOP</span></div>
              <div className="absolute top-4 right-4 z-20"><button onClick={() => setPhase('history')} className="flex items-center gap-2 text-white/50 hover:text-orange-500 font-bold text-sm uppercase tracking-wider transition-colors"><History size={16} /> 歷史紀錄</button></div>
              
              {/* --- NEW: MANUAL RESET BUTTON --- */}
              <div className="absolute top-4 left-4 z-20">
                <button onClick={handleManualReset} className="flex items-center gap-2 text-white/30 hover:text-red-500 font-bold text-sm uppercase tracking-wider transition-colors">
                  <RotateCcw size={16} /> 重置 (RESET)
                </button>
              </div>
              
              <div className="relative z-10 flex flex-col items-center space-y-6 w-full py-8">
                <div className="animate-bounce">{isNightMode ? (<Moon size={80} className="text-indigo-400 fill-indigo-400 transform -rotate-12 drop-shadow-[0px_0px_20px_rgba(79,70,229,0.5)]" />) : (<Sun size={80} className="text-orange-500 fill-orange-500 transform rotate-12 drop-shadow-[4px_4px_0px_rgba(255,255,255,1)]" />)}</div>
                <h1 className="text-5xl sm:text-6xl font-black italic text-white uppercase tracking-tighter transform -skew-x-6 leading-none drop-shadow-[4px_4px_0px_rgba(249,115,22,1)] text-center">{greeting},<br /><span className={`${isNightMode ? 'text-indigo-400' : 'text-orange-500'} text-6xl sm:text-7xl`}>{user && !user.isAnonymous ? (user.displayName || "LUCAS").split(' ')[0].toUpperCase() : "LUCAS"}.</span></h1>
                {!user || user.isAnonymous ? (<div className="w-full max-w-xs transform -rotate-1"><PowerButton variant="google" onClick={handleGoogleLogin} loading={isAuthLoading} className="py-2 text-sm border-2">使用 Google 帳號登入 (同步)</PowerButton></div>) : null}
                <div className={`w-full max-w-xs ${isNightMode ? 'bg-slate-900 border-slate-700 shadow-[6px_6px_0px_0px_rgba(79,70,229,1)]' : 'bg-white border-black shadow-[6px_6px_0px_0px_rgba(249,115,22,1)]'} border-4 p-4 transform rotate-1 transition-all duration-500`}><div className={`flex justify-between items-center mb-2 border-b-2 ${isNightMode ? 'border-slate-700' : 'border-gray-200'} pb-1`}><p className={`${isNightMode ? 'text-indigo-400' : 'text-orange-500'} text-[10px] font-black uppercase tracking-widest`}>每日一句</p><Sparkles size={12} className={isNightMode ? 'text-indigo-400' : 'text-orange-500'} /></div><p className={`${isNightMode ? 'text-slate-200' : 'text-black'} font-bold text-sm leading-relaxed mb-2`}>"{todayQuote.text}"</p><div className="text-right"><p className="text-xs font-black italic text-gray-500">— {todayQuote.char}</p></div></div>
                
                {/* --- UPDATED BUTTON LAYOUT START --- */}
                
                {/* Main Action Slot - Conditional Swap */}
                {isNightMode ? (
                    // NIGHT MODE: Bedtime is Primary
                    <div className="w-full max-w-xs transition-opacity duration-500 opacity-100">
                        <div className="bg-slate-900 p-3 border-4 border-indigo-500 transform -skew-x-6 shadow-[6px_6px_0px_0px_rgba(79,70,229,1)] w-full mb-6">
                            <p className="text-indigo-300 font-black uppercase tracking-widest text-center text-xs skew-x-6">SYSTEM STANDBY</p>
                            <p className="text-white font-bold text-center text-sm skew-x-6">準備進入休眠程序</p>
                        </div>
                        <PowerButton 
                            onClick={startBedtimeRoutine} 
                            className="text-xl py-4 bg-indigo-600 text-white border-indigo-400 shadow-[4px_4px_0px_0px_rgba(79,70,229,1)] hover:bg-indigo-500"
                        >
                            <Moon className="fill-current animate-pulse mr-2" /> 啟動睡前儀式
                        </PowerButton>
                    </div>
                ) : (
                    // DAY MODE: Wake Up is Primary
                    <div className="w-full max-w-xs transition-opacity duration-500 opacity-100">
                        <div className="bg-white p-3 border-4 border-orange-500 transform -skew-x-6 shadow-[6px_6px_0px_0px_rgba(249,115,22,1)] w-full mb-6">
                            <label className="block text-xs font-black text-black uppercase tracking-widest mb-1 skew-x-6">設定目標開賽時間</label>
                            <div className="flex items-center justify-center skew-x-6">
                                <Clock className="mr-2 text-orange-500" />
                                <input type="time" value={wakeUpTime} onChange={(e) => setWakeUpTime(e.target.value)} className="text-3xl font-black font-mono text-center bg-transparent focus:outline-none w-full" />
                            </div>
                        </div>
                        <PowerButton onClick={handleWakeUp} className="text-xl py-4"><Zap className="fill-current" /> 醒來，上場！</PowerButton>
                    </div>
                )}

                {/* Secondary Actions (Grid Layout) */}
                <div className="w-full max-w-xs grid grid-cols-2 gap-3 pt-2">
                    <button onClick={() => { setWorkStep('setup'); setWorkTopic(""); setPhase('work-mode'); }} className={`w-full flex flex-col items-center justify-center gap-1 px-2 py-3 border-4 border-black bg-amber-400 text-black hover:bg-amber-300 transform skew-x-[-3deg] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none transition-all`}>
                        <Briefcase size={18} />
                        <span className="font-black italic uppercase skew-x-[3deg] text-sm">深度工作</span>
                    </button>
                    
                    {/* Conditional Second Button */}
                    {isNightMode ? (
                        // NIGHT MODE: Wake Up is Secondary
                        <button onClick={handleWakeUp} className="group w-full flex flex-col items-center justify-center gap-1 px-2 py-3 border-4 bg-white text-black border-black hover:bg-orange-50 hover:border-orange-500 hover:text-orange-600 transform skew-x-[3deg] shadow-[3px_3px_0px_0px_rgba(255,255,255,0.3)] active:translate-y-1 active:shadow-none transition-all">
                            <Zap size={18} className="group-hover:fill-current" />
                            <span className="font-black italic uppercase skew-x-[-3deg] text-sm">早晨儀式</span>
                        </button>
                    ) : (
                        // DAY MODE: Bedtime is Secondary
                        <button onClick={startBedtimeRoutine} className="group w-full flex flex-col items-center justify-center gap-1 px-2 py-3 border-4 bg-gray-100 text-gray-400 border-gray-300 hover:border-black hover:text-black transform skew-x-[3deg] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none transition-all">
                            <Moon size={18} />
                            <span className="font-black italic uppercase skew-x-[-3deg] text-sm">睡前儀式</span>
                        </button>
                    )}
                </div>
                {/* --- UPDATED BUTTON LAYOUT END --- */}

              </div>
            </div>
          )}
          {phase === 'history' && renderHistoryListView()}
          {phase === 'mood-check' && renderMoodCheckView()}
          {phase === 'exercise' && renderExerciseView()}
          {phase === 'english' && renderEnglishView()}
          {phase === 'reading' && renderReadingView()}
          {phase === 'work-mode' && renderWorkModeView()}
          {phase === 'finished' && renderFinishedView()}
          {phase === 'bedtime' && renderBedtimeView()}
        </div>
        <div className="bg-black text-gray-500 text-[9px] font-mono p-1 text-center uppercase tracking-widest flex justify-center items-center gap-2 relative z-50"><Database size={10} /> 系統狀態: 本地備份中</div>
        {['mood-check', 'exercise', 'english', 'reading'].includes(phase) && (<div className="h-4 shrink-0 bg-black border-t-4 border-orange-500 flex z-50">{['mood-check', 'exercise', 'english', 'reading'].map((step, idx) => { const phases = ['mood-check', 'exercise', 'english', 'reading']; const currentIdx = phases.indexOf(phase); const isCompleted = idx <= currentIdx; return (<div key={step} className={`h-full flex-1 border-r-2 border-orange-500 relative transition-all duration-500 ${isCompleted ? 'bg-orange-500' : 'bg-gray-800'}`} />)})}</div>)}
        {viewingRecord && <ScoreCard record={viewingRecord} onClose={() => setViewingRecord(null)} />}
        {recordToDelete && (<DeleteConfirmModal isDeleting={isDeleting} onConfirm={confirmDelete} onCancel={() => setRecordToDelete(null)} />)}
      </div>
    </div>
  );
}
