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
  Database
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
const LOCAL_STORAGE_KEY = "morning-strategist-lucas-state-v2"; // Bump version to ensure clean state

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

const PRE_WORK_CHECKLIST = [
  { id: 1, text: '準備好水、咖啡或奶茶', icon: '☕️' },
  { id: 2, text: '打開今日最重要的策略文件', icon: '📂' },
  { id: 3, text: '確認今日唯一的「絕對目標」', icon: '🎯' },
];

const BEDTIME_CHECKLIST_DEFAULTS = [
  { id: 'light', text: '開啟睡眠燈 (Mood Light)', icon: <Moon size={20} />, checked: false },
  { id: 'reader', text: '準備閱讀器 (E-Reader)', icon: <BookOpen size={20} />, checked: false },
  { id: 'phone', text: '手機放到樓上/遠離床邊', icon: <Smartphone size={20} />, checked: false },
];

const MOOD_FEEDBACK = {
  1: "沒關係，允許自己慢慢開機。低速檔也能前進。",
  3: "很好，平穩的狀態是專業的基石。保持節奏。",
  5: "太強了！今天你是球場上的國王！全速前進！"
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

  const morningSessions = history.filter(r => r.type !== 'bedtime');
  const bedtimeSessions = history.filter(r => r.type === 'bedtime');

  const calculateStreak = (sessions, type) => {
    const validDates = new Set();
    sessions.forEach(r => {
      let isValid = false;
      if (type === 'bedtime') isValid = true;
      else if (type === 'work') isValid = (r.workDuration || 0) >= 5;
      else if (type === 'exercise') isValid = !!r.exercise;
      else if (type === 'english') isValid = r.english && r.english.length > 0;
      
      if (isValid && r.dateDisplay) validDates.add(r.dateDisplay);
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

  const workStreak = calculateStreak(morningSessions, 'work');
  const exerciseStreak = calculateStreak(morningSessions, 'exercise');
  const englishStreak = calculateStreak(morningSessions, 'english');
  const sleepStreak = calculateStreak(bedtimeSessions, 'bedtime');

  const workStats = {
    totalSessions: morningSessions.length,
    totalMinutes: morningSessions.reduce((acc, curr) => acc + (curr.workDuration || 0), 0),
    avgMinutes: morningSessions.length > 0 ? Math.round(morningSessions.reduce((acc, curr) => acc + (curr.workDuration || 0), 0) / morningSessions.length) : 0
  };

  const exerciseCounts = morningSessions.reduce((acc, curr) => {
    const name = curr.exercise ? curr.exercise.name : "Skipped";
    acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {});

  const englishCounts = morningSessions.reduce((acc, curr) => {
    if (!curr.english || curr.english.length === 0) {
      acc["Skipped"] = (acc["Skipped"] || 0) + 1;
    } else {
      curr.english.forEach(appId => {
        const app = ENGLISH_APPS.find(a => a.id === appId);
        const name = app ? app.name : appId;
        acc[name] = (acc[name] || 0) + 1;
      });
    }
    return acc;
  }, {});

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
      {/* Morning Stats (Priority) */}
      <div className="bg-white border-4 border-black p-4 shadow-sm relative overflow-hidden">
        <div className="flex justify-between items-center border-b-2 border-gray-200 pb-2 mb-3">
          <h4 className="font-black text-sm flex items-center gap-2">
            <Briefcase size={16} /> 工作戰線
          </h4>
          <div className="flex items-center gap-1 text-orange-500 font-black italic bg-orange-50 px-2 py-1 rounded">
            <Flame size={14} className="fill-current" /> {workStreak} DAYS
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="text-2xl font-black text-black">{workStats.totalSessions}</div>
            <div className="text-[10px] font-bold text-gray-400 uppercase">Sessions</div>
          </div>
          <div>
            <div className="text-2xl font-black text-orange-500">{(workStats.totalMinutes / 60).toFixed(1)}</div>
            <div className="text-[10px] font-bold text-gray-400 uppercase">Total Hours</div>
          </div>
          <div>
            <div className="text-2xl font-black text-black">{workStats.avgMinutes}</div>
            <div className="text-[10px] font-bold text-gray-400 uppercase">Avg Mins</div>
          </div>
        </div>
      </div>

      <div className="bg-white border-4 border-black p-4 shadow-sm">
        <div className="flex justify-between items-center border-b-2 border-gray-200 pb-2 mb-3">
          <h4 className="font-black text-sm flex items-center gap-2">
            <Activity size={16} /> 肉體戰線
          </h4>
          <div className="flex items-center gap-1 text-emerald-600 font-black italic bg-emerald-50 px-2 py-1 rounded">
            <Flame size={14} className="fill-current" /> {exerciseStreak} DAYS
          </div>
        </div>
        {Object.entries(exerciseCounts).map(([name, count]) => (
          <StatBar key={name} label={name} count={count} total={workStats.totalSessions} color="bg-emerald-500" />
        ))}
      </div>

      <div className="bg-white border-4 border-black p-4 shadow-sm">
        <div className="flex justify-between items-center border-b-2 border-gray-200 pb-2 mb-3">
          <h4 className="font-black text-sm flex items-center gap-2">
            <Mic size={16} /> 語言戰線
          </h4>
          <div className="flex items-center gap-1 text-blue-600 font-black italic bg-blue-50 px-2 py-1 rounded">
            <Flame size={14} className="fill-current" /> {englishStreak} DAYS
          </div>
        </div>
        {Object.entries(englishCounts).map(([name, count]) => (
          <StatBar key={name} label={name} count={count} total={workStats.totalSessions} color="bg-blue-500" />
        ))}
      </div>

      {/* Bedtime Stats (Moved to Bottom) */}
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
            <div className="text-xs text-slate-400 font-bold uppercase">TOTAL SESSIONS</div>
            <div className="text-2xl font-black text-white">{bedtimeSessions.length}</div>
        </div>
      </div>
    </div>
  );
};

const ScoreCard = ({ record, onClose }) => {
  if (!record) return null;

  // Handle Bedtime Record Display
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
                  <span className="font-black italic uppercase text-indigo-400">BEDTIME LOG</span>
                  <span className="text-xs font-mono text-slate-400">{record.dateDisplay}</span>
                </div>
                <div className="p-6 space-y-6">
                    <div className="flex items-center gap-4 border-b border-slate-700 pb-4">
                        <div className="text-3xl">{record.mood?.icon || "🌙"}</div>
                        <div>
                             <div className="text-xs font-bold text-slate-500 uppercase">MOOD</div>
                             <div className="text-xl font-black text-white">{record.mood?.label || "Recorded"}</div>
                        </div>
                    </div>
                    <div>
                        <div className="text-xs font-bold text-slate-500 uppercase mb-2">CHECKLIST</div>
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
                             <div className="text-[10px] font-bold text-slate-500 uppercase mb-1">NOTE</div>
                             <p className="text-sm font-bold italic text-white">"{record.note}"</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
      )
  }

  // Handle Morning Record Display (Existing)
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
          <span className="font-black italic uppercase">MATCH RECORD</span>
          <span className="text-xs font-mono text-orange-500">{record.dateDisplay}</span>
        </div>

        <div className="p-6 grid grid-cols-2 gap-6">
          <div className="col-span-2 flex items-center gap-4 border-b-2 border-gray-100 pb-4">
            <div className="p-3 bg-orange-100 rounded-full border-2 border-orange-500 text-orange-600">
              {record?.mood?.level >= 3 ? <Zap size={24} className="fill-current" /> : <Activity size={24} />}
            </div>
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase">MOOD</p>
              <p className="text-xl font-black italic">{record?.mood?.label || "Unknown"}</p>
            </div>
          </div>

          <div>
            <p className="text-xs text-gray-500 font-bold uppercase mb-2">EXERCISE</p>
            <p className={`text-lg font-black leading-tight ${isExerciseSkipped ? "text-gray-400 italic" : ""}`}>
              {isExerciseSkipped ? "Rest Day" : (record.exercise?.name || "Exercise")}
            </p>
            {!isExerciseSkipped && record.exerciseSets && (
              <span className="inline-block bg-black text-white text-[10px] font-bold px-1.5 py-0.5 mt-1">
                {record.exerciseSets} SETS
              </span>
            )}
          </div>

          <div>
            <p className="text-xs text-gray-500 font-bold uppercase mb-2">ENGLISH</p>
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
                    <p className="text-[10px] text-gray-500 font-bold mt-1 border-l-2 border-orange-200 pl-1">
                      "{record.englishTopic}"
                    </p>
                  )}
                </>
              ) : (
                <span className="text-gray-400 font-bold italic text-xs">Skipped</span>
              )}
            </div>
          </div>

          <div className="col-span-2 bg-gray-50 p-3 border-2 border-gray-200 mt-2 flex justify-between items-center">
            <span className="font-black text-gray-400 uppercase">WORK TIME</span>
            <span className="text-3xl font-black font-mono text-orange-500">
              {record?.workDuration || 0} <span className="text-sm text-black">MIN</span>
            </span>
            {record.workTopic && (
              <div className="w-full mt-2 pt-2 border-t border-gray-300 text-xs text-gray-500 font-bold block">
                Task: {record.workTopic}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// --- Main App Component ---
export default function MorningStrategistV5() {
  const [user, setUser] = useState(null);
  const [phase, setPhase] = useState('loading');
  const [isRestoredSession, setIsRestoredSession] = useState(false);
  const [isLocalSaved, setIsLocalSaved] = useState(false); // Indicator for save status
  
  // History States
  const [morningHistory, setMorningHistory] = useState([]);
  const [bedtimeHistory, setBedtimeHistory] = useState([]);
  const [history, setHistory] = useState([]);
  
  // View State for History List
  const [historyTab, setHistoryTab] = useState('morning'); // 'morning' or 'bedtime'
  
  const [errorMsg, setErrorMsg] = useState(null);
  const [hasManualReset, setHasManualReset] = useState(false);

  // Auth Loading
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
  const [workChecklist, setWorkChecklist] = useState(PRE_WORK_CHECKLIST.map(item => ({ ...item, checked: false })));
  const [workTopic, setWorkTopic] = useState("");

  // Bedtime State
  const [bedtimeChecklist, setBedtimeChecklist] = useState(BEDTIME_CHECKLIST_DEFAULTS);
  const [bedtimeNote, setBedtimeNote] = useState("");
  const [bedtimeMood, setBedtimeMood] = useState(null);
  const [isBedtimeSaving, setIsBedtimeSaving] = useState(false);

  // Timer & Set Logic
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [workSetupTime, setWorkSetupTime] = useState(45);
  const [workStep, setWorkStep] = useState('checklist');

  // Sets (Default 1)
  const [targetSets, setTargetSets] = useState(1);
  const [currentSet, setCurrentSet] = useState(1);
  const [setsCompleted, setSetsCompleted] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // View States
  const [viewingRecord, setViewingRecord] = useState(null);
  const [showStats, setShowStats] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);

  const timerRef = useRef(null);
  const contentRef = useRef(null);

  // --- Helpers for Local Storage ---
  const saveLocalProgress = (state) => {
      try {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
          setIsLocalSaved(true);
          // Reset saved indicator after 3s
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
  
  // --- Missing Helper Function Added Back ---
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

  // --- Auto-Save Effect ---
  // Saves progress whenever critical state changes
  useEffect(() => {
    // We only want to save if we are in an "active" morning phase
    const activePhases = ['mood-check', 'exercise', 'english', 'work-prep'];
    // Special case: if phase is work-prep and step is focus, it's very active
    
    if (activePhases.includes(phase)) {
        const stateToSave = {
            date: new Date().toLocaleDateString('zh-TW'),
            timestamp: Date.now(),
            phase,
            wakeUpTime,
            actualWakeUpTime,
            mood,
            isWaterDrank,
            selectedExercise,
            targetSets,
            currentSet,
            setsCompleted,
            selectedEnglishApps,
            englishTopic,
            workChecklist,
            workSetupTime,
            workTopic,
            workStep,
            timeLeft,
            totalDuration,
            // We don't save isActive as true, because we want it to be paused on restore
        };
        saveLocalProgress(stateToSave);
    }
  }, [
      phase, wakeUpTime, actualWakeUpTime, mood, isWaterDrank, 
      selectedExercise, targetSets, currentSet, setsCompleted, 
      selectedEnglishApps, englishTopic, workChecklist, 
      workSetupTime, workTopic, workStep, timeLeft, totalDuration
  ]);


  // --- Time Logic ---
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


  // --- Auto-Load Logic (Firestore + LocalStorage) ---
  useEffect(() => {
    // Check if we have an active local session first
    let hasActiveLocalSession = false;
    try {
        const savedRaw = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (savedRaw) {
            const saved = JSON.parse(savedRaw);
            const today = new Date().toLocaleDateString('zh-TW');
            // If we have saved data for today AND it is in an active phase
            if (saved.date === today && ['mood-check', 'exercise', 'english', 'work-prep', 'work'].includes(saved.phase)) {
                hasActiveLocalSession = true;
            }
        }
    } catch(e) {}

    if (morningHistory.length > 0 && !hasManualReset && (phase === 'sleeping' || phase === 'loading')) {
      const latest = morningHistory[0];
      const today = new Date().toLocaleDateString('zh-TW');

      // 1. Priority: Check if already finished in Firestore
      // CRITICAL FIX: Only if we DON'T have an active local session we are trying to restore
      if (latest.dateDisplay === today && !hasActiveLocalSession) {
        setWakeUpTime(latest.wakeUpTarget);
        setActualWakeUpTime(latest.actualWakeUpTime);
        setMood(latest.mood);
        setIsWaterDrank(latest.waterDrank);
        setSelectedExercise(latest.exercise || null);
        setSetsCompleted(latest.exerciseSets);
        setSelectedEnglishApps(latest.english || []);
        setEnglishTopic(latest.englishTopic || "");
        setWorkTopic(latest.workTopic || "");

        const dur = (latest.workDuration || 0) * 60;
        setTotalDuration(dur);
        setTimeLeft(0);

        setPhase('finished');
        // If finished, we can clear any lingering local progress for today
        clearLocalProgress(); 
      } 
    }
  }, [morningHistory, hasManualReset, phase]);

  // --- Auth & Init & Restore ---
  useEffect(() => {
    const initAuth = async () => {
      if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
        await signInWithCustomToken(auth, __initial_auth_token);
      }
    };
    initAuth();

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      
      // On Auth Load, try to restore session if not finished
      if (phase === 'loading') {
        setTodayQuote(getDailySeededQuote());
        setRestQuote(REST_QUOTES[Math.floor(Math.random() * REST_QUOTES.length)]);
        
        // CHECK LOCAL STORAGE RESTORE
        let restored = false;
        try {
            const savedRaw = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (savedRaw) {
                const saved = JSON.parse(savedRaw);
                const today = new Date().toLocaleDateString('zh-TW');
                
                // Only restore if it's from today
                if (saved.date === today) {
                    console.log("Restoring session from local storage...");
                    setWakeUpTime(saved.wakeUpTime);
                    setActualWakeUpTime(saved.actualWakeUpTime);
                    setMood(saved.mood);
                    setIsWaterDrank(saved.isWaterDrank);
                    setSelectedExercise(saved.selectedExercise);
                    setTargetSets(saved.targetSets);
                    setCurrentSet(saved.currentSet);
                    setSetsCompleted(saved.setsCompleted);
                    setSelectedEnglishApps(saved.selectedEnglishApps);
                    setEnglishTopic(saved.englishTopic);
                    setWorkChecklist(saved.workChecklist);
                    setWorkSetupTime(saved.workSetupTime);
                    setWorkTopic(saved.workTopic);
                    setWorkStep(saved.workStep);
                    setTimeLeft(saved.timeLeft);
                    setTotalDuration(saved.totalDuration);
                    
                    // Important: Restore phase last
                    setPhase(saved.phase);
                    setIsActive(false); // Always start paused
                    setIsRestoredSession(true);
                    
                    // Hide "Restored" badge after 3 seconds
                    setTimeout(() => setIsRestoredSession(false), 3000);
                    restored = true;
                }
            }
        } catch (e) {
            console.error("Restore failed", e);
        }

        if (!restored) {
            setPhase('sleeping');
        }
      }
    });
    return () => unsubscribe();
  }, []); // Run once on mount mostly

  // --- Google Login Handler ---
  const handleGoogleLogin = async () => {
    setIsAuthLoading(true);
    setErrorMsg(null);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login Failed", error);
      if (error.code === 'auth/unauthorized-domain' || error.message.includes('unauthorized-domain')) {
          setErrorMsg("⚠️ 預覽環境限制：Google 登入僅限正式站。已為您自動切換至「訪客模式」繼續使用。");
          if (!user) {
              try {
                 await signInAnonymously(auth);
              } catch(e) { 
                 console.error("Guest login failed", e);
              }
          }
      } else if (error.code === 'auth/popup-closed-by-user') {
          setErrorMsg("登入已取消");
      } else if (error.code === 'auth/popup-blocked') {
          setErrorMsg("登入視窗被瀏覽器攔截，請允許彈跳視窗。");
      } else {
          setErrorMsg("登入失敗: " + error.message);
      }
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setHistory([]);
      setPhase('sleeping');
      setHasManualReset(true);
      // Optional: Don't clear local progress on logout, so they can resume after login?
      // Or clear it? Let's keep it for safety.
    } catch (error) {
      console.error("Logout Failed", error);
    }
  };

  // --- History Listener (Dual Collections) ---
  useEffect(() => {
    if (!user) {
        setMorningHistory([]);
        setBedtimeHistory([]);
        setHistory([]);
        return;
    };
    
    const qMorning = query(
      collection(db, 'artifacts', appId, 'users', user.uid, 'morning_sessions'),
      orderBy('createdAt', 'desc')
    );
    const unsubMorning = onSnapshot(qMorning, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMorningHistory(data);
    }, (error) => console.error("Morning Snapshot Error:", error));

    const qBedtime = query(
        collection(db, 'artifacts', appId, 'users', user.uid, 'bedtime_sessions'),
        orderBy('createdAt', 'desc')
    );
    const unsubBedtime = onSnapshot(qBedtime, (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setBedtimeHistory(data);
    }, (error) => console.error("Bedtime Snapshot Error:", error));

    return () => {
        unsubMorning();
        unsubBedtime();
    };
  }, [user]);

  useEffect(() => {
      const combined = [...morningHistory, ...bedtimeHistory].sort((a, b) => {
          const tA = a.timestamp || (a.createdAt?.seconds * 1000) || 0;
          const tB = b.timestamp || (b.createdAt?.seconds * 1000) || 0;
          return tB - tA;
      });
      setHistory(combined);
  }, [morningHistory, bedtimeHistory]);


  // --- Scroll & Timer Logic ---
  useEffect(() => {
    if (contentRef.current) contentRef.current.scrollTop = 0;
  }, [phase, workStep]);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      clearInterval(timerRef.current);
      setIsActive(false);

      SoundEngine.playChime();

      if (phase === 'exercise') {
        if (currentSet < targetSets) {
          setCurrentSet(prev => prev + 1);
          setTimeLeft(selectedExercise.duration);
        }
      } else if (phase === 'work-prep' && workStep === 'focus') {
        setTimeout(() => completeDay(), 500);
      }
    }
    return () => clearInterval(timerRef.current);
  }, [isActive, timeLeft, phase, workStep, currentSet, targetSets, selectedExercise]);

  // --- Navigation Helper ---
  const goBack = () => {
    setIsActive(false);
    switch (phase) {
      case 'bedtime': setPhase('sleeping'); break;
      case 'mood-check': setPhase('sleeping'); break;
      case 'exercise': setPhase('mood-check'); break;
      case 'english': setPhase('exercise'); break;
      case 'work-prep':
        if (workStep === 'focus') setWorkStep('setup');
        else if (workStep === 'setup') setWorkStep('checklist');
        else setPhase('english');
        break;
      default: break;
    }
  };

  // --- Actions ---
  const handleWakeUp = async () => {
    SoundEngine.init();
    if (!user) {
        try {
            await signInAnonymously(auth);
        } catch(e) {
            console.error("Anon Auth Failed", e);
            setErrorMsg("無法建立匿名連線");
            return;
        }
    }

    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    setActualWakeUpTime(`${hours}:${minutes}`);
    setPhase('mood-check');
  };

  const startBedtimeRoutine = () => {
    setBedtimeChecklist(BEDTIME_CHECKLIST_DEFAULTS);
    setBedtimeNote("");
    setBedtimeMood(null);
    setPhase('bedtime');
    SoundEngine.init();
  };

  const handleBedtimeCheck = (id) => {
    setBedtimeChecklist(prev => prev.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
    SoundEngine.playClick();
  };

  const saveBedtimeRecord = async () => {
    let currentUser = auth.currentUser;
    if (!currentUser) {
        try {
           const cred = await signInAnonymously(auth);
           currentUser = cred.user;
           setUser(currentUser);
        } catch (e) {
           console.error("Auto-login failed", e);
           setErrorMsg("請先登入以儲存紀錄");
           return;
        }
    }
    
    if (!currentUser || !currentUser.uid) {
        setErrorMsg("無法取得使用者ID，存檔失敗");
        return;
    }

    setIsBedtimeSaving(true);
    SoundEngine.playChime();

    const cleanChecklist = bedtimeChecklist.map(item => ({
        id: item.id,
        text: item.text,
        checked: item.checked
    }));

    const record = {
      type: 'bedtime',
      checklist: cleanChecklist,
      note: bedtimeNote,
      mood: bedtimeMood,
      dateDisplay: new Date().toLocaleDateString('zh-TW'),
      createdAt: serverTimestamp(),
      timestamp: Date.now()
    };

    try {
      await addDoc(collection(db, 'artifacts', appId, 'users', currentUser.uid, 'bedtime_sessions'), record);
      setTimeout(() => {
        setIsBedtimeSaving(false);
        setPhase('sleeping');
        if (contentRef.current) contentRef.current.scrollTop = 0;
      }, 1500);
    } catch (e) {
      console.error("Bedtime save failed:", e);
      setErrorMsg(`存檔失敗: ${e.message}`);
      setIsBedtimeSaving(false);
    }
  };

  const handleDeleteClick = (e, id) => {
    e.stopPropagation();
    setRecordToDelete(id);
  };

  const confirmDelete = async () => {
    if (!recordToDelete || !user) return;
    setIsDeleting(true);
    try {
      const record = history.find(r => r.id === recordToDelete);
      const isBedtime = record && record.type === 'bedtime';
      const collectionName = isBedtime ? 'bedtime_sessions' : 'morning_sessions';
      const today = new Date().toLocaleDateString('zh-TW');

      await deleteDoc(doc(db, 'artifacts', appId, 'users', user.uid, collectionName, recordToDelete));

      if (!isBedtime && record && record.dateDisplay === today) {
           setHasManualReset(true);
           setIsWaterDrank(false);
           setMood(null);
           setActualWakeUpTime(null);
           setSelectedExercise(EXERCISE_ROUTINES[0]);
           setSetsCompleted(0);
           setCurrentSet(1);
           setSelectedEnglishApps([]);
           setEnglishTopic("");
           setWorkTopic("");
           setWorkChecklist(PRE_WORK_CHECKLIST.map(item => ({ ...item, checked: false })));
           if (viewingRecord && viewingRecord.id === recordToDelete) {
               setViewingRecord(null);
           }
      } else {
           if (viewingRecord && viewingRecord.id === recordToDelete) {
               setViewingRecord(null);
           }
      }

    } catch (err) {
      console.error("Delete failed", err);
      setErrorMsg("刪除失敗，請重試");
    } finally {
      setIsDeleting(false);
      setRecordToDelete(null);
    }
  };

  const handleDrinkWater = () => {
    setIsWaterDrank(true);
    SoundEngine.playClick();
  };

  const handleMoodSelection = (m) => {
    setMood(m);
    if (m.level === 1) {
      setMoodSyncRate("60% (省電模式)");
      setMoodFeedback("沒關係，允許自己慢慢開機。低速檔也能前進。");
    } else if (m.level === 3) {
      setMoodSyncRate("90% (標準運轉)");
      setMoodFeedback("很好，平穩的狀態是專業的基石。保持節奏。");
    } else {
      setMoodSyncRate("120% (極限超頻!)");
      setMoodFeedback("太強了！今天你是球場上的國王！全速前進！");
    }
  };

  const confirmMoodAndStart = () => {
    setCurrentSet(1);
    setTargetSets(1);
    initExerciseTimer(EXERCISE_ROUTINES[0]);
    setPhase('exercise');
  };

  const initExerciseTimer = (routine) => {
    setSelectedExercise(routine);
    setTimeLeft(routine.duration);
    setTotalDuration(routine.duration);
    setIsActive(false);
    setCurrentSet(1);
  };

  const handleFinishExercise = () => {
    setSetsCompleted(currentSet);
    setPhase('english');
  };

  const skipExercise = () => {
    setSelectedExercise(null);
    setIsActive(false);
    setSetsCompleted(0);
    setPhase('english');
  };

  const toggleEnglishApp = (id) => {
    setSelectedEnglishApps(prev => {
      if (prev.includes(id)) return prev.filter(appId => appId !== id);
      return [...prev, id];
    });
  };

  const skipEnglish = () => {
    setSelectedEnglishApps([]);
    setEnglishTopic("");
    setPhase('work-prep');
  };

  const finishEnglish = () => {
    setPhase('work-prep');
  };

  const startWorkTimer = () => {
    setWorkStep('focus');
    const seconds = workSetupTime * 60;
    setTimeLeft(seconds);
    setTotalDuration(seconds);
    setIsActive(true);
    SoundEngine.init();
  };

  const skipWork = () => {
    completeDay(true);
  };

  const completeDay = async (isSkipped = false) => {
    let currentUser = auth.currentUser;
    if (!currentUser) {
         try {
           const cred = await signInAnonymously(auth);
           currentUser = cred.user;
           setUser(currentUser);
        } catch (e) {
           setErrorMsg("連線中斷，請檢查網路");
           return;
        }
    }

    if (isSaving) return;

    setIsActive(false);
    setIsSaving(true);

    setPhase('finished');
    if (!isSkipped) SoundEngine.playChime();
    
    // Clear local progress on successful completion
    clearLocalProgress();

    const actualDuration = isSkipped ? 0 : (totalDuration > 0 ? Math.max(0, Math.ceil((totalDuration - timeLeft) / 60)) : 0);

    const record = {
      wakeUpTarget: wakeUpTime,
      actualWakeUpTime: actualWakeUpTime || "N/A",
      mood: mood,
      waterDrank: isWaterDrank,
      exercise: selectedExercise,
      exerciseSets: setsCompleted,
      english: selectedEnglishApps,
      englishTopic: englishTopic,
      workDuration: actualDuration,
      workTopic: workTopic,
      dateDisplay: new Date().toLocaleDateString('zh-TW'),
      createdAt: serverTimestamp(),
      timestamp: Date.now()
    };

    try {
      await addDoc(collection(db, 'artifacts', appId, 'users', currentUser.uid, 'morning_sessions'), record);
    } catch (e) {
      console.error("Save failed:", e);
      setErrorMsg("自動存檔失敗");
    } finally {
      setIsSaving(false);
    }
  };

  // --- Render Views ---
  const renderHistoryListView = () => {
    // Filter the history based on the active tab
    const displayedHistory = historyTab === 'morning' 
        ? history.filter(r => r.type !== 'bedtime')
        : history.filter(r => r.type === 'bedtime');

    return (
        <div className="p-4 sm:p-6 pb-24 flex flex-col min-h-full bg-white">
        <div className="flex items-center justify-between mb-6 flex-shrink-0">
            <div className="flex items-center gap-2">
            <button onClick={() => setPhase('sleeping')} className="p-2 border-2 border-black hover:bg-gray-100">
                <ChevronLeft size={24} />
            </button>
            <MangaHeader title={showStats ? "賽季總表" : "戰績回顧"} />
            </div>
            <button
            onClick={() => setShowStats(!showStats)}
            className={`px-3 py-1 text-xs font-black uppercase border-2 border-black ${showStats ? 'bg-black text-white' : 'bg-white text-black'}`}
            >
            {showStats ? "List" : "Stats"}
            </button>
        </div>

        <div className="mb-4 flex items-center justify-between bg-gray-100 p-3 rounded border border-gray-200">
            <div className="flex items-center gap-2">
                {user?.photoURL ? (
                    <img src={user.photoURL} alt="User" className="w-8 h-8 rounded-full border border-black" />
                ) : (
                    <div className="w-8 h-8 bg-black text-white flex items-center justify-center rounded-full font-bold">
                        {user?.isAnonymous ? "?" : (user?.displayName?.[0] || "U")}
                    </div>
                )}
                <div className="text-xs">
                    <div className="font-bold text-gray-500">CURRENT PLAYER</div>
                    <div className="font-black truncate max-w-[120px]">{user?.isAnonymous ? "Guest (Anonymous)" : (user?.displayName || "Unknown User")}</div>
                </div>
            </div>
            <button 
                onClick={handleLogout}
                className="flex items-center gap-1 text-xs font-bold text-red-500 hover:text-red-700 bg-white border border-red-200 px-2 py-1 rounded hover:bg-red-50"
            >
                <LogOut size={12} /> Sign Out
            </button>
        </div>

        {/* League Switcher Tabs */}
        {!showStats && (
            <div className="flex gap-2 mb-4">
                <button 
                    onClick={() => setHistoryTab('morning')}
                    className={`flex-1 py-2 font-black uppercase text-sm border-b-4 transition-all ${historyTab === 'morning' ? 'border-orange-500 text-black' : 'border-transparent text-gray-300 hover:text-gray-500'}`}
                >
                    MORNING LEAGUE
                </button>
                <button 
                    onClick={() => setHistoryTab('bedtime')}
                    className={`flex-1 py-2 font-black uppercase text-sm border-b-4 transition-all ${historyTab === 'bedtime' ? 'border-indigo-500 text-indigo-900' : 'border-transparent text-gray-300 hover:text-gray-500'}`}
                >
                    NIGHT LEAGUE
                </button>
            </div>
        )}

        {showStats ? (
            <SeasonStatsDashboard history={history} />
        ) : (
            <div className="flex-1 space-y-4 animate-fade-in">
            {displayedHistory.length === 0 ? (
                <div className="text-center text-gray-400 py-10 italic">
                    {historyTab === 'morning' ? "尚無早晨比賽紀錄..." : "尚無睡前儀式紀錄..."}
                </div>
            ) : (
                displayedHistory.map((record) => {
                // RENDER BEDTIME CARD
                if (record.type === 'bedtime') {
                    return (
                        <div
                            key={record.id}
                            onClick={() => setViewingRecord(record)}
                            className="border-2 border-slate-700 p-4 relative cursor-pointer hover:-translate-y-1 hover:shadow-[0px_4px_10px_rgba(0,0,0,0.5)] transition-all bg-slate-900 text-slate-200 group"
                        >
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-2">
                                    <span className="bg-indigo-600 text-white px-2 py-1 text-xs font-bold font-mono">
                                        {record.dateDisplay}
                                    </span>
                                    <span className="text-xs font-black text-indigo-300 uppercase flex items-center gap-1">
                                        <Moon size={12}/> BEDTIME
                                    </span>
                                </div>
                                <button
                                    onClick={(e) => handleDeleteClick(e, record.id)}
                                    className="p-3 -mt-3 -mr-3 z-50 relative text-slate-500 hover:text-red-500 transition-colors bg-slate-900 rounded-bl-xl border-l border-b border-transparent hover:border-red-900"
                                    title="刪除紀錄"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                            <div className="flex items-center gap-2 text-sm font-bold text-white">
                                <span>{record.mood?.icon} Mood: {record.mood?.label}</span>
                                {record.note && <span className="text-slate-500 truncate max-w-[150px]">- {record.note}</span>}
                            </div>
                        </div>
                    )
                }

                // RENDER MORNING CARD
                return (
                    <div
                        key={record.id}
                        onClick={() => setViewingRecord(record)}
                        className="border-4 border-black p-4 relative cursor-pointer hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all bg-white group"
                    >
                        <div className="flex justify-between items-start mb-3">
                        <div>
                            <span className="bg-black text-white px-2 py-1 text-xs font-bold font-mono mr-2">
                            {record.dateDisplay || "DATE UNKNOWN"}
                            </span>
                            <span className="font-black italic text-lg">{record.workDuration} MIN WORK</span>
                        </div>
                        <button
                            onClick={(e) => handleDeleteClick(e, record.id)}
                            className="p-3 -mt-3 -mr-3 z-50 relative text-gray-300 hover:text-red-500 transition-colors bg-white rounded-bl-xl border-l-2 border-b-2 border-transparent hover:border-red-100"
                            title="刪除紀錄"
                        >
                            <Trash2 size={20} />
                        </button>
                        </div>

                        {record.actualWakeUpTime && (
                        <div className="mb-2 text-xs font-mono text-gray-500 border-b border-gray-100 pb-2">
                            Target: {record.wakeUpTarget} | <span className="text-orange-600 font-bold">Actual: {record.actualWakeUpTime}</span>
                        </div>
                        )}

                        <div className="flex flex-wrap gap-2">
                        <div className="flex items-center gap-1 px-2 py-1 bg-orange-50 border border-orange-200 rounded text-xs font-bold text-orange-700">
                            <Activity size={12} />
                            {record.exercise ? record.exercise.name : "Rest"}
                            {record.exerciseSets && ` (${record.exerciseSets} Sets)`}
                        </div>

                        <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 border border-blue-200 rounded text-xs font-bold text-blue-700">
                            <Mic size={12} />
                            {record.english && record.english.length > 0
                            ? record.english.map(id => ENGLISH_APPS.find(a => a.id === id)?.name).join(", ")
                            : "Skip"}
                        </div>
                        </div>
                    </div>
                    )
                })
            )}
            </div>
        )}
        </div>
    );
  };

  const renderBedtimeView = () => {
    const allChecked = bedtimeChecklist.every(i => i.checked);
    const isReadyToSave = allChecked && bedtimeMood;

    if (isBedtimeSaving) {
        return (
            <div className="h-full flex flex-col items-center justify-center p-6 bg-indigo-950 text-white animate-fade-in">
                <Moon size={64} className="text-yellow-300 animate-pulse mb-6" />
                <h2 className="text-3xl font-black italic uppercase tracking-widest mb-2">GOOD NIGHT</h2>
                <p className="font-bold text-indigo-200">系統關機中...</p>
            </div>
        )
    }

    return (
      <div className="p-4 sm:p-6 pb-24 flex flex-col min-h-full bg-slate-900 text-slate-200">
        <div className="mb-6 relative z-10 flex-shrink-0">
            <button onClick={goBack} className="p-2 -ml-2 text-slate-500 hover:text-white transition-colors mb-2">
              <ChevronLeft size={28} strokeWidth={3} />
            </button>
            <h2 className="text-3xl sm:text-4xl font-black italic uppercase text-white tracking-tighter transform -skew-x-6 leading-none">
              <span className="text-indigo-500 mr-2">/</span>
              睡前儀式
            </h2>
            <p className="text-slate-400 font-bold mt-2 uppercase tracking-wide text-sm border-l-4 border-indigo-500 pl-3">
              SHUTDOWN SEQUENCE
            </p>
        </div>

        {/* 1. Checklist Section */}
        <div className="space-y-3 mb-8">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                <CheckSquare size={14}/> 關機檢查
            </h3>
            {bedtimeChecklist.map((item) => (
              <div 
                key={item.id} 
                onClick={() => handleBedtimeCheck(item.id)} 
                className={`flex items-center gap-4 p-4 border-2 cursor-pointer transition-all duration-200 rounded-lg
                  ${item.checked 
                    ? 'bg-indigo-600 border-indigo-400 text-white shadow-[0px_0px_15px_rgba(79,70,229,0.5)]' 
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'}`
                }
              >
                <div className={`w-8 h-8 shrink-0 flex items-center justify-center rounded-full border-2 
                    ${item.checked ? 'border-white bg-indigo-500' : 'border-slate-600 bg-transparent'}`}>
                  {item.checked && <Check size={18} className="text-white" strokeWidth={4} />}
                </div>
                <span className="font-bold text-lg flex-1 select-none">{item.text}</span>
                <span className={`text-2xl ${item.checked ? 'text-yellow-300' : 'text-slate-600'}`}>{item.icon}</span>
              </div>
            ))}
        </div>

        {/* 2. Mood & Note Section */}
        <div className={`transition-all duration-500 ${allChecked ? 'opacity-100 translate-y-0' : 'opacity-50 translate-y-4 pointer-events-none grayscale'}`}>
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Activity size={14}/> 今日結算 (Mood & Log)
            </h3>
            
            {/* Simple Mood Selector */}
            <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                    { val: 1, label: "疲勞/低落", icon: "😫", color: "bg-slate-700" },
                    { val: 3, label: "平靜/普通", icon: "😌", color: "bg-emerald-700" },
                    { val: 5, label: "充實/開心", icon: "🤩", color: "bg-orange-600" }
                ].map(m => (
                    <button
                        key={m.val}
                        onClick={() => setBedtimeMood(m)}
                        className={`p-3 border-2 rounded-xl flex flex-col items-center gap-2 transition-all
                            ${bedtimeMood?.val === m.val 
                                ? `${m.color} border-white text-white shadow-lg scale-105` 
                                : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                            }`}
                    >
                        <span className="text-2xl">{m.icon}</span>
                        <span className="text-xs font-black">{m.label}</span>
                    </button>
                ))}
            </div>

            {/* Note Area */}
            <div className="mb-6 relative">
                 <textarea
                    value={bedtimeNote}
                    onChange={(e) => setBedtimeNote(e.target.value)}
                    placeholder="簡單記下今天的一件事..."
                    className="w-full bg-slate-800 border-2 border-slate-700 text-white p-4 rounded-xl font-bold focus:outline-none focus:border-indigo-500 min-h-[100px] placeholder-slate-500"
                 />
                 <PenTool size={16} className="absolute bottom-4 right-4 text-slate-500" />
            </div>
        </div>

        {/* Save Button */}
        <button
            onClick={saveBedtimeRecord}
            disabled={!isReadyToSave}
            className={`mt-auto w-full py-5 rounded-xl font-black uppercase text-xl flex items-center justify-center gap-3 transition-all shadow-lg
                ${isReadyToSave 
                    ? 'bg-indigo-500 text-white hover:bg-indigo-400 shadow-indigo-900/50' 
                    : 'bg-slate-800 text-slate-600 cursor-not-allowed'}`
            }
        >
            <Moon className={isReadyToSave ? "fill-current animate-pulse" : ""} />
            {isReadyToSave ? "關燈 (Good Night)" : "請完成檢查與心情"}
        </button>
      </div>
    );
  };

  const renderMoodCheckView = () => {
    if (mood) {
      let colorClass = "text-black";
      let barColorClass = "bg-black";
      if (mood.level === 1) { colorClass = "text-slate-500"; barColorClass = "bg-slate-500"; }
      else if (mood.level === 3) { colorClass = "text-emerald-500"; barColorClass = "bg-emerald-500"; }
      else { colorClass = "text-orange-500"; barColorClass = "bg-orange-500"; }

      return (
        <div className="p-4 sm:p-6 pb-24 flex flex-col h-full justify-center items-center animate-fade-in">
          <div className="w-full max-w-xs border-8 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(249,115,22,1)] text-center transform rotate-1">
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">SYSTEM ANALYSIS</p>
            <h3 className={`text-3xl font-black italic ${colorClass} mb-1 animate-pulse`}>{moodSyncRate}</h3>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-6">
              <div className={`h-full ${barColorClass} w-full animate-slide-stripes`}></div>
            </div>
            <p className="text-black font-bold text-lg leading-tight mb-8">
              "{moodFeedback}"
            </p>
            <PowerButton variant="success" onClick={confirmMoodAndStart} className="w-full py-4 text-xl">
              前往熱身 <ArrowRight size={20} />
            </PowerButton>
            <button onClick={() => setMood(null)} className="mt-4 text-xs font-bold text-gray-400 underline">重選心情</button>
          </div>
        </div>
      );
    }

    return (
      <div className="p-4 sm:p-6 pb-24">
        <MangaHeader title="早晨啟動程序" subtitle="誠實面對身體的回饋。" step="1" onBack={() => goBack()} />

        <div className="mb-8 bg-blue-50 border-4 border-blue-200 p-4 rounded-xl text-center">
          {!isWaterDrank ? (
            <>
              <p className="text-blue-800 font-bold mb-4 text-sm">起床第一件事：啟動大腦</p>
              <PowerButton variant="info" onClick={handleDrinkWater}>
                <Droplets className="mr-2" /> 補充水分 (DRINK)
              </PowerButton>
            </>
          ) : (
            <div className="animate-fade-in flex flex-col items-center">
              <div className="w-full bg-gray-200 rounded-full h-4 mb-2 border border-black overflow-hidden">
                <div className="bg-green-500 h-full w-full animate-[pulse_1s_ease-in-out]"></div>
              </div>
              <p className="text-blue-900 font-black italic text-lg">狀態回復！大腦開機中...</p>
            </div>
          )}
        </div>

        <div className={`flex flex-col gap-4 transition-opacity duration-300 ${!isWaterDrank ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
          <button
            onClick={() => handleMoodSelection({ level: 1, label: "狀態不佳" })}
            disabled={!isWaterDrank}
            className="p-4 border-4 border-slate-500 bg-slate-600 text-white font-black italic text-lg text-left hover:translate-x-1 transition-transform shadow-md"
          >
            狀態不佳 (省電模式)
          </button>
          <button
            onClick={() => handleMoodSelection({ level: 3, label: "普通/暖身" })}
            disabled={!isWaterDrank}
            className="p-4 border-4 border-emerald-600 bg-emerald-500 text-white font-black italic text-lg text-left hover:translate-x-1 transition-transform shadow-md"
          >
            普通/暖身 (標準運轉)
          </button>
          <button
            onClick={() => handleMoodSelection({ level: 5, label: "絕好調" })}
            disabled={!isWaterDrank}
            className="p-4 border-4 border-orange-600 bg-orange-500 text-white font-black italic text-lg text-left hover:translate-x-1 transition-transform shadow-md"
          >
            絕好調 (極限超頻!)
          </button>
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
            <div className="flex justify-between items-center w-full skew-x-[3deg]">
              <span className="font-black italic text-lg uppercase">{routine.name}</span>
              <span className={`text-xl font-black italic ${selectedExercise?.id === routine.id ? 'text-black' : 'text-orange-500'}`}>{Math.floor(routine.duration / 60)}'</span>
            </div>
            <span className="text-xs font-bold mt-1 opacity-90 skew-x-[3deg] uppercase tracking-wider">{routine.eng}</span>
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between bg-gray-100 p-3 border-4 border-black mb-4">
        <span className="font-black uppercase">SETS (組數):</span>
        <div className="flex items-center gap-4">
          <button onClick={() => setTargetSets(Math.max(1, targetSets - 1))} className="w-8 h-8 flex items-center justify-center bg-white border-2 border-black font-black hover:bg-gray-200">-</button>
          <span className="text-2xl font-black text-orange-500">{targetSets}</span>
          <button onClick={() => setTargetSets(Math.min(10, targetSets + 1))} className="w-8 h-8 flex items-center justify-center bg-white border-2 border-black font-black hover:bg-gray-200">+</button>
        </div>
      </div>

      <div className="relative">
        <div className="absolute top-2 left-2 z-20 bg-black text-white px-2 py-1 text-xs font-black uppercase">
          SET {currentSet} / {targetSets}
        </div>
        <TimerDisplay timeLeft={timeLeft} totalDuration={totalDuration} />
      </div>

      <div className="flex gap-4 w-full mb-6">
        <PowerButton variant={isActive ? "secondary" : "primary"} onClick={() => setIsActive(!isActive)} className="flex-1 py-4 text-xl">
          {isActive ? <><Pause className="fill-current" /> 暫停</> : timeLeft < (selectedExercise?.duration || 0) ? <><Play className="fill-current" /> {currentSet > 1 ? "下一組" : "開始"}</> : <><Play className="fill-current" /> 開始</>}
        </PowerButton>
        <button onClick={() => initExerciseTimer(selectedExercise || EXERCISE_ROUTINES[0])} className="p-4 border-4 border-black bg-white text-black hover:bg-gray-100 transition-colors transform skew-x-[-6deg]"><RotateCcw className="skew-x-[6deg]" /></button>
      </div>

      <div className="flex justify-between items-center mt-auto">
        <PowerButton variant="ghost" className="w-1/3 text-xs" onClick={skipExercise}>
          <SkipForward size={16} className="mr-1" /> 休息/跳過
        </PowerButton>
        <button
          onClick={handleFinishExercise}
          className="mx-auto text-gray-500 uppercase font-black italic text-sm hover:text-orange-500 transition-colors inline-flex items-center gap-1 border-b-2 border-transparent hover:border-orange-500"
        >
          完成，下一步 <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );

  const renderEnglishView = () => (
    <div className="p-4 sm:p-6 pb-24 flex flex-col min-h-full">
      <MangaHeader title="語言特訓" subtitle="選擇今日訓練項目。" step="3" onBack={() => goBack()} />

      <div className="flex flex-col gap-3 mb-6">
        {ENGLISH_APPS.map(app => {
          const isSelected = selectedEnglishApps.includes(app.id);
          return (
            <div
              key={app.id}
              onClick={() => toggleEnglishApp(app.id)}
              className={`border-4 border-black p-4 relative cursor-pointer transition-all active:scale-95 flex items-center gap-4 ${isSelected ? 'bg-black text-white' : 'bg-white text-black hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'}`}
            >
              <div className={`p-2 rounded-full text-white ${app.color}`}>{app.icon}</div>
              <div className="flex-1">
                <h3 className="text-xl font-black italic uppercase">{app.name}</h3>
                <p className={`text-xs font-bold ${isSelected ? 'text-gray-400' : 'text-gray-500'}`}>{app.desc}</p>
              </div>
              {isSelected && <Check size={24} strokeWidth={4} className="text-orange-500" />}
            </div>
          );
        })}
      </div>

      <div className="mb-8">
        <label className="block text-xs font-black uppercase text-gray-500 mb-2 flex items-center gap-1">
          <Edit3 size={12} /> 自訂練習主題 (選填)
        </label>
        <input
          type="text"
          value={englishTopic}
          onChange={(e) => setEnglishTopic(e.target.value)}
          placeholder="例如: Pitching Practice..."
          className="w-full p-4 border-4 border-black font-bold text-lg focus:outline-none focus:border-orange-500 focus:shadow-[4px_4px_0px_0px_rgba(249,115,22,1)] transition-all placeholder-gray-300"
        />
      </div>

      <div className="flex gap-3 mt-auto">
        <PowerButton variant="ghost" className="w-1/3 text-sm" onClick={skipEnglish}>
          <SkipForward size={16} className="mr-1" /> 跳過
        </PowerButton>
        <PowerButton variant="primary" className="flex-1" onClick={finishEnglish}>
          完成 (DONE) <ArrowRight size={20} />
        </PowerButton>
      </div>
    </div>
  );

  const renderWorkPrepView = () => (
    <div className="p-4 sm:p-6 pb-24 flex flex-col min-h-full">
      {workStep === 'checklist' && (
        <>
          <MangaHeader title="賽前準備" subtitle="排除干擾，調整至最佳狀態。" step="4" onBack={() => goBack()} />
          <div className="space-y-3 mb-8 mt-4">
            {workChecklist.map((item) => (
              <div key={item.id} onClick={() => setWorkChecklist(i => i.map(x => x.id === item.id ? { ...x, checked: !x.checked } : x))} className={`flex items-center gap-4 p-4 border-4 border-black cursor-pointer transition-all duration-200 ${item.checked ? 'bg-orange-500 text-white shadow-[4px_4px_0px_0px_black] transform -translate-y-1' : 'bg-white text-black hover:bg-gray-50'}`}>
                <div className={`w-8 h-8 shrink-0 flex items-center justify-center border-4 ${item.checked ? 'border-white bg-black' : 'border-black bg-white'}`}>
                  {item.checked && <Check size={20} className="text-white" strokeWidth={4} />}
                </div>
                <span className="font-bold text-lg flex-1 select-none">{item.text}</span>
                <span className="text-2xl">{item.icon}</span>
              </div>
            ))}
          </div>
          <PowerButton variant="primary" className="w-full py-5 text-xl mt-auto" onClick={() => setWorkStep('setup')} disabled={!workChecklist.every(i => i.checked)}>
            {workChecklist.every(i => i.checked) ? "進入專注設定" : "請先完成檢查..."} <ArrowRight />
          </PowerButton>

          {/* EARLY SKIP BUTTON */}
          <button
            onClick={() => skipWork()}
            className="w-full py-4 mt-2 text-xs font-bold text-gray-400 uppercase hover:text-black hover:underline transition-colors"
          >
            今天純休息 / 跳過工作 (SKIP)
          </button>
        </>
      )}

      {workStep === 'setup' && (
        <>
          <MangaHeader title="關鍵決勝局" subtitle="設定你的專注時間。" step="4" onBack={() => setWorkStep('checklist')} />
          <div className="flex-1 flex flex-col justify-center items-center">
            <div className="bg-black text-white p-8 border-4 border-orange-500 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full mb-4 transform -rotate-1">
              <div className="flex items-center justify-center gap-6 mb-2">
                <span className="text-7xl font-black font-mono text-orange-500">{workSetupTime}</span>
                <span className="text-xl font-black italic text-gray-400 rotate-90">MIN</span>
              </div>
            </div>

            <div className="w-full mb-6">
              <label className="block text-xs font-black uppercase text-gray-500 mb-2 flex items-center gap-1">
                <Edit3 size={12} /> 本次專注任務 (選填)
              </label>
              <input
                type="text"
                value={workTopic}
                onChange={(e) => setWorkTopic(e.target.value)}
                placeholder="例如: Q3 策略規劃..."
                className="w-full p-3 border-4 border-black font-bold text-lg focus:outline-none focus:border-orange-500 focus:shadow-[4px_4px_0px_0px_rgba(249,115,22,1)] transition-all placeholder-gray-300"
              />
            </div>

            <div className="grid grid-cols-3 gap-4 w-full mb-8">
              {[25, 45, 60].map(mins => (
                <button key={mins} onClick={() => setWorkSetupTime(mins)} className={`py-4 border-4 border-black font-black italic text-xl ${workSetupTime === mins ? 'bg-orange-500 text-white shadow-[4px_4px_0px_0px_black] -translate-y-1' : 'bg-white hover:bg-gray-100'}`}>
                  {mins}
                </button>
              ))}
            </div>
            <div className="flex gap-4 w-full justify-center mb-8">
              <button onClick={() => setWorkSetupTime(Math.max(5, workSetupTime - 5))} className="p-3 border-4 border-black bg-white font-bold hover:bg-gray-100 flex-1">-5 min</button>
              <button onClick={() => setWorkSetupTime(workSetupTime + 5)} className="p-3 border-4 border-black bg-white font-bold hover:bg-gray-100 flex-1">+5 min</button>
            </div>

            <PowerButton variant="success" className="w-full py-6 text-2xl mt-auto" onClick={startWorkTimer}>
              哨音響起，比賽開始！
            </PowerButton>
          </div>
        </>
      )}

      {workStep === 'focus' && (
        <div className="flex-1 bg-orange-50 -m-4 sm:-m-6 p-4 sm:p-6 flex flex-col min-h-full">
          <div className="mb-6 flex items-center justify-center gap-2 bg-yellow-400 border-4 border-black px-4 py-2 font-black text-black transform rotate-1 shadow-md">
            <Zap size={20} className="fill-black" /> 專注模式：請勿切換視窗
          </div>
          <div className="flex-1 flex flex-col justify-center">
            <TimerDisplay timeLeft={timeLeft} totalDuration={totalDuration} />
            <p className="text-center font-black italic text-2xl text-black mt-8 animate-pulse">
              FOCUS ON THE STRATEGY
            </p>
            {workTopic && <p className="text-center font-bold text-orange-600 mt-2 border-b-2 border-orange-200 inline-block mx-auto pb-1">{workTopic}</p>}
            
            {/* Sync Status Indicator */}
            <div className={`mt-6 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest transition-colors duration-500 ${isLocalSaved ? 'text-green-600' : 'text-gray-400'}`}>
                {isLocalSaved ? <Wifi size={12} /> : <WifiOff size={12} />}
                {isLocalSaved ? "AUTO-SAVED LOCAL" : "READY TO SYNC"}
            </div>
          </div>
          <div className="mt-auto space-y-4">
            <div className="flex gap-3">
              <PowerButton variant="secondary" className="flex-1" onClick={() => setIsActive(!isActive)}>
                {isActive ? "戰術暫停" : "繼續進攻"}
              </PowerButton>
              <PowerButton variant="ghost" className="w-1/3 text-xs border-black" onClick={skipWork}>
                <SkipForward size={16} className="mr-1" /> 跳過
              </PowerButton>
            </div>
            <button
              onClick={() => completeDay(false)}
              disabled={isSaving}
              className="w-full text-center text-gray-400 font-bold hover:text-red-500 hover:underline py-2 disabled:text-gray-300"
            >
              {isSaving ? "紀錄上傳中..." : `提早結束並記錄 (ACTUAL TIME: ${Math.ceil(Math.max(0, totalDuration - timeLeft) / 60)} MIN)`}
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderFinishedView = () => {
    const finalDuration = totalDuration > 0 ? Math.max(0, Math.ceil((totalDuration - timeLeft) / 60)) : 0;
    const todayRecord = {
      wakeUpTarget: wakeUpTime,
      actualWakeUpTime: actualWakeUpTime || "N/A",
      mood: mood,
      waterDrank: isWaterDrank,
      exercise: selectedExercise,
      exerciseSets: setsCompleted,
      english: selectedEnglishApps,
      englishTopic: englishTopic,
      workDuration: finalDuration,
      workTopic: workTopic,
      dateDisplay: new Date().toLocaleDateString('zh-TW')
    };

    return (
      <div className="p-4 sm:p-6 flex flex-col min-h-full bg-white relative overflow-hidden">
        <MangaHeader title="比賽結果" subtitle="MATCH RESULT" />

        {/* Result Card */}
        <div className="border-4 border-black p-0 mb-6 shadow-[8px_8px_0px_0px_rgba(249,115,22,1)] bg-white relative z-10 hover:scale-[1.01] transition-transform">
          <div className="bg-black text-white p-3 border-b-4 border-black flex justify-between items-center">
            <span className="font-black italic uppercase">LUCAS'S SCOREBOARD</span>
            <span className="text-xs font-mono text-orange-500">{todayRecord.dateDisplay}</span>
          </div>
          <div className="p-6 grid grid-cols-2 gap-6">
            {/* Time Comparison */}
            <div className="col-span-2 bg-gray-100 p-3 border-2 border-gray-200 flex justify-between items-center">
              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase">TARGET</p>
                <p className="text-lg font-black text-gray-400">{todayRecord.wakeUpTarget}</p>
              </div>
              <ArrowRight size={16} className="text-gray-300" />
              <div className="text-right">
                <p className="text-[10px] font-bold text-orange-500 uppercase">ACTUAL</p>
                <p className="text-2xl font-black text-orange-600">{todayRecord.actualWakeUpTime}</p>
              </div>
            </div>

            <div className="col-span-2 flex items-center gap-4 border-b-2 border-gray-100 pb-4">
              <div className="p-3 bg-orange-100 rounded-full border-2 border-orange-500 text-orange-600">
                {todayRecord?.mood?.level >= 3 ? <Zap size={24} className="fill-current" /> : <Activity size={24} />}
              </div>
              <div>
                <p className="text-xs text-gray-500 font-bold uppercase">MOOD CONDITION</p>
                <p className="text-xl font-black italic">{todayRecord?.mood?.label || "Unknown"}</p>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase mb-2">EXERCISE</p>
              <p className={`text-lg font-black leading-tight ${!todayRecord.exercise ? 'text-gray-400 italic' : ''}`}>
                {todayRecord.exercise ? todayRecord.exercise.name : "Rest Day"}
              </p>
              {!todayRecord.exerciseSkipped && todayRecord.exerciseSets > 0 && (
                <span className="inline-block bg-black text-white text-[10px] font-bold px-1.5 py-0.5 mt-1">
                  {todayRecord.exerciseSets} SETS
                </span>
              )}
            </div>
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase mb-2">ENGLISH</p>
              <div className="flex flex-col gap-1">
                {todayRecord.english && todayRecord.english.length > 0 ? (
                  todayRecord.english.map(appId => {
                    const app = ENGLISH_APPS.find(a => a.id === appId);
                    return app ? (
                      <div key={appId} className="flex items-center gap-1">
                        <div className={`w-2 h-2 rounded-full ${appId === 'toko' ? 'bg-blue-600' : 'bg-red-600'}`}></div>
                        <span className="text-xs font-bold">{app.name}</span>
                      </div>
                    ) : null;
                  })
                ) : (
                  <span className="text-gray-400 font-bold italic text-xs">Skipped</span>
                )}
                {todayRecord.englishTopic && <span className="text-[10px] font-bold text-gray-500 truncate max-w-[120px]">"{todayRecord.englishTopic}"</span>}
              </div>
            </div>
            <div className="col-span-2 bg-gray-50 p-3 border-2 border-gray-200 mt-2 flex justify-between items-center">
              <span className="font-black text-gray-400 uppercase">ACTUAL WORK TIME</span>
              <span className="text-3xl font-black font-mono text-orange-500">{todayRecord.workDuration} <span className="text-sm text-black">MIN</span></span>
            </div>
            {todayRecord.workTopic && (
              <div className="col-span-2 text-center border-t border-gray-200 pt-2">
                <span className="text-xs font-bold text-gray-400 uppercase block mb-1">MISSION</span>
                <span className="font-bold text-black">{todayRecord.workTopic}</span>
              </div>
            )}
          </div>
        </div>

        {/* Rest Quote */}
        <div className="bg-gray-100 border-4 border-black p-4 w-full relative z-10 transform -rotate-1 mb-6">
          <p className="text-sm text-gray-500 font-black uppercase mb-1 flex items-center gap-1">
            <MessageSquare size={14} /> 教練的叮嚀
          </p>
          <p className="text-base text-black font-bold leading-tight">
            「{restQuote.text}」
          </p>
          <p className="text-xs text-gray-400 text-right mt-1 font-black italic">— {restQuote.char}</p>
        </div>

        <div className="flex gap-3 mt-auto">
          <button onClick={() => setPhase('history')} className="flex-1 py-4 border-4 border-black bg-white hover:bg-gray-100 font-black uppercase flex items-center justify-center gap-2 text-sm">
            <History size={18} /> 歷史 / 統計
          </button>
          <button
            onClick={() => {
              setHasManualReset(true); 
              setPhase('sleeping');
              setWorkStep('checklist');
              setIsActive(false);
              setSelectedEnglishApps([]);
              setEnglishTopic("");
              setWorkTopic("");
              setWorkChecklist(PRE_WORK_CHECKLIST.map(item => ({ ...item, checked: false })));
              setRestQuote(REST_QUOTES[Math.floor(Math.random() * REST_QUOTES.length)]);
              setIsWaterDrank(false);
              setSetsCompleted(0);
              setCurrentSet(1);
              setActualWakeUpTime(null);
              setMood(null);
            }}
            className="flex-1 py-4 bg-black text-white font-black uppercase hover:bg-orange-500 transition-colors text-sm flex items-center justify-center gap-2"
          >
            <RotateCcw size={18} /> 重置 (RESET)
          </button>
        </div>
      </div>
    );
  };

  // --- Layout Wrapper ---
  return (
    <div className="h-screen w-full bg-gray-900 flex items-center justify-center font-sans text-slate-800 overflow-hidden">
      <div className="w-full max-w-md h-full sm:h-[90vh] sm:rounded-3xl bg-white flex flex-col relative overflow-hidden shadow-2xl sm:border-8 sm:border-gray-800">

        {/* Error Banner */}
        {errorMsg && (
          <div className="absolute top-0 left-0 w-full bg-red-600 text-white text-center text-xs font-bold py-1 z-50 animate-fade-in">
            {errorMsg}
          </div>
        )}
        
        {/* Restore Banner */}
        {isRestoredSession && (
          <div className="absolute top-16 left-0 w-full bg-green-500 text-white text-center text-xs font-bold py-1 z-50 animate-fade-in flex items-center justify-center gap-2">
            <CloudLightning size={14} className="fill-current" /> 已為您恢復上次中斷的進度 (Auto-Resumed)
          </div>
        )}

        {/* Fixed Header */}
        {phase !== 'loading' && phase !== 'finished' && phase !== 'sleeping' && phase !== 'history' && phase !== 'bedtime' && (
          <div className="h-16 shrink-0 bg-black border-b-4 border-orange-500 flex items-center justify-between px-4 sm:px-6 relative z-50 shadow-[0px_4px_0px_0px_rgba(249,115,22,1)]">
            <div className="flex items-center gap-3">
                <span className="font-black italic text-2xl text-white tracking-tighter uppercase transform -skew-x-12">
                M<span className="text-orange-500">.STRAT</span>
                </span>
                {/* SAVED INDICATOR - INSIDE HEADER */}
                <div className={`transition-all duration-300 overflow-hidden ${isLocalSaved ? 'w-16 opacity-100' : 'w-0 opacity-0'}`}>
                    <div className="bg-green-500 text-white text-[10px] font-black uppercase px-2 py-1 whitespace-nowrap flex items-center gap-1 rounded transform skew-x-[-12deg]">
                        <Save size={10} /> SAVED
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-2 bg-white border-2 border-black px-2 py-1 transform skew-x-[-12deg]">
              <span className="text-xs font-black text-black skew-x-[12deg]">{wakeUpTime} START</span>
            </div>
          </div>
        )}

        {/* Scrollable Content */}
        <div ref={contentRef} className="flex-1 overflow-y-auto overflow-x-hidden bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
          {phase === 'loading' && (
            <div className="flex flex-col items-center justify-center h-full bg-black">
              <Loader2 size={48} className="text-orange-500 animate-spin mb-4" />
              <p className="text-white font-black italic uppercase tracking-wider">ENTERING THE COURT...</p>
            </div>
          )}

          {phase === 'sleeping' && (
            <div className="min-h-full flex flex-col items-center justify-center p-6 bg-black relative transition-colors duration-1000">
              <div className="absolute inset-0 flex flex-col pointer-events-none opacity-20 select-none overflow-hidden leading-none font-black italic text-8xl text-white text-left whitespace-nowrap">
                <span>{isNightMode ? "REST UP" : "WAKE UP"}</span><span className="ml-20">FLY HIGH</span><span>DON'T STOP</span>
              </div>
              <div className="absolute top-4 right-4 z-20">
                <button onClick={() => setPhase('history')} className="flex items-center gap-2 text-white/50 hover:text-orange-500 font-bold text-sm uppercase tracking-wider transition-colors">
                  <History size={16} /> Records
                </button>
              </div>
              <div className="relative z-10 flex flex-col items-center space-y-6 w-full py-8">
                <div className="animate-bounce">
                  {isNightMode ? (
                      <Moon size={80} className="text-indigo-400 fill-indigo-400 transform -rotate-12 drop-shadow-[0px_0px_20px_rgba(79,70,229,0.5)]" />
                  ) : (
                      <Sun size={80} className="text-orange-500 fill-orange-500 transform rotate-12 drop-shadow-[4px_4px_0px_rgba(255,255,255,1)]" />
                  )}
                </div>
                <h1 className="text-5xl sm:text-6xl font-black italic text-white uppercase tracking-tighter transform -skew-x-6 leading-none drop-shadow-[4px_4px_0px_rgba(249,115,22,1)] text-center">
                  {greeting},<br />
                  <span className={`${isNightMode ? 'text-indigo-400' : 'text-orange-500'} text-6xl sm:text-7xl`}>
                    {user && !user.isAnonymous ? (user.displayName || "LUCAS").split(' ')[0].toUpperCase() : "LUCAS"}.
                  </span>
                </h1>
                
                {/* Google Login Section */}
                {!user || user.isAnonymous ? (
                    <div className="w-full max-w-xs transform -rotate-1">
                        <PowerButton variant="google" onClick={handleGoogleLogin} loading={isAuthLoading} className="py-2 text-sm border-2">
                             使用 Google 帳號登入 (Sync)
                        </PowerButton>
                        <p className="text-gray-500 text-[10px] font-bold text-center mt-1 uppercase">登入以跨裝置儲存戰績</p>
                    </div>
                ) : null}

                {/* Quote Block */}
                <div className={`w-full max-w-xs ${isNightMode ? 'bg-slate-900 border-slate-700 shadow-[6px_6px_0px_0px_rgba(79,70,229,1)]' : 'bg-white border-black shadow-[6px_6px_0px_0px_rgba(249,115,22,1)]'} border-4 p-4 transform rotate-1 transition-all duration-500`}>
                  <div className={`flex justify-between items-center mb-2 border-b-2 ${isNightMode ? 'border-slate-700' : 'border-gray-200'} pb-1`}>
                    <p className={`${isNightMode ? 'text-indigo-400' : 'text-orange-500'} text-[10px] font-black uppercase tracking-widest`}>DAILY STRATEGY</p>
                    <Sparkles size={12} className={isNightMode ? 'text-indigo-400' : 'text-orange-500'} />
                  </div>
                  <p className={`${isNightMode ? 'text-slate-200' : 'text-black'} font-bold text-sm leading-relaxed mb-2`}>"{todayQuote.text}"</p>
                  <div className="text-right">
                    <p className="text-xs font-black italic text-gray-500">— {todayQuote.char}</p>
                  </div>
                </div>

                {/* --- Morning Action Block --- */}
                <div className={`w-full max-w-xs transition-opacity duration-500 ${isNightMode ? 'opacity-60 grayscale hover:opacity-100 hover:grayscale-0' : 'opacity-100'}`}>
                    <div className="bg-white p-4 border-4 border-orange-500 transform -skew-x-6 shadow-[6px_6px_0px_0px_rgba(249,115,22,1)] w-full mb-4">
                        <label className="block text-xs font-black text-black uppercase tracking-widest mb-2 skew-x-6">設定目標開賽時間 (TARGET)</label>
                        <div className="flex items-center justify-center skew-x-6">
                            <Clock className="mr-2 text-orange-500" />
                            <input type="time" value={wakeUpTime} onChange={(e) => setWakeUpTime(e.target.value)} className="text-4xl font-black font-mono text-center bg-transparent focus:outline-none w-full" />
                        </div>
                    </div>
                    <PowerButton onClick={handleWakeUp} className="text-xl py-5">
                         <Zap className="fill-current" /> 醒來，上場！
                    </PowerButton>
                </div>

                {/* --- Bedtime Action Block --- */}
                <div className={`w-full max-w-xs flex justify-center transition-opacity duration-500 ${!isNightMode ? 'opacity-60 grayscale hover:opacity-100 hover:grayscale-0' : 'opacity-100'}`}>
                    <button 
                        onClick={startBedtimeRoutine}
                        className={`group w-full flex items-center justify-center gap-2 px-6 py-4 border-4 transform skew-x-[-6deg] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none transition-all
                            ${isNightMode ? 'bg-slate-900 text-indigo-300 border-indigo-500 hover:text-white hover:bg-slate-800' : 'bg-gray-100 text-gray-400 border-gray-300 hover:border-black hover:text-black'}
                        `}
                    >
                        <Moon size={20} className={isNightMode ? "group-hover:animate-bounce" : ""} />
                        <span className="font-black italic uppercase skew-x-[6deg] text-lg">
                            睡前儀式 (End Day)
                        </span>
                    </button>
                </div>
              </div>
            </div>
          )}

          {phase === 'history' && renderHistoryListView()}

          {phase === 'mood-check' && renderMoodCheckView()}

          {phase === 'exercise' && renderExerciseView()}

          {phase === 'english' && renderEnglishView()}

          {phase === 'work-prep' && renderWorkPrepView()}

          {phase === 'finished' && renderFinishedView()}
          
          {phase === 'bedtime' && renderBedtimeView()}
        </div>

        {/* SYSTEM STATUS BAR (Bottom) */}
        <div className="bg-black text-gray-500 text-[9px] font-mono p-1 text-center uppercase tracking-widest flex justify-center items-center gap-2 relative z-50">
             <Database size={10} /> SYSTEM: LOCAL BACKUP ACTIVE
        </div>

        {/* Footer Progress */}
        {['mood-check', 'exercise', 'english', 'work-prep'].includes(phase) && (
          <div className="h-4 shrink-0 bg-black border-t-4 border-orange-500 flex z-50">
            {['mood-check', 'exercise', 'english', 'work-prep'].map((step, idx) => {
              const phases = ['mood-check', 'exercise', 'english', 'work-prep'];
              const currentIdx = phases.indexOf(phase);
              const isCompleted = idx <= currentIdx;
              return (
                <div key={step} className={`h-full flex-1 border-r-2 border-orange-500 relative transition-all duration-500 ${isCompleted ? 'bg-orange-500' : 'bg-gray-800'}`} />
              )
            })}
          </div>
        )}

        {/* Detail Modal Overlay */}
        {viewingRecord && <ScoreCard record={viewingRecord} onClose={() => setViewingRecord(null)} />}

        {/* Delete Confirmation Modal */}
        {recordToDelete && (
          <DeleteConfirmModal
            isDeleting={isDeleting}
            onConfirm={confirmDelete}
            onCancel={() => setRecordToDelete(null)}
          />
        )}
      </div>
    </div>
  );
}
