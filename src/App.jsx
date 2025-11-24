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
  Save,
  Smartphone,
  Moon,
  BookOpen,
  Power,
  BatteryCharging,
  Sunrise,
  Lightbulb
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

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : "morning-strategist-production";

// --- DATABASE (ANIME PURE EDITION) ---
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
  { text: "沒有什麼「必定」會贏的比賽，也沒有「必定」會輸的比賽。", char: "烏養繫心", src: "排球少年!!" },
  { text: "正因為沒有翅膀，人類才尋找飛翔的方法。", char: "烏養繫心", src: "排球少年!!" },
  { text: "如果只著眼於眼前的勝利，就會失去未來的可能性。", char: "黑尾鐵朗", src: "排球少年!!" },
  { text: "既然做了，就要做到極致。", char: "影山飛雄", src: "排球少年!!" },
  { text: "打破高牆的，永遠是下一球。", char: "日向翔陽", src: "排球少年!!" },
  { text: "所謂的「強大」，就是能夠持續做那些理所當然的事。", char: "北信介", src: "排球少年!!" },
  { text: "不需要回憶，因為我們每一秒都在創造新的歷史。", char: "稻荷崎高校", src: "排球少年!!" },
  { text: "吞噬你的對手，這就是前鋒的職責。", char: "潔世一", src: "藍色監獄" },
  { text: "為了達到頂點，必須捨棄天真。", char: "繪心甚八", src: "藍色監獄" },
  { text: "所謂的才能，就是證明自己有能力改變世界的能力。", char: "繪心甚八", src: "藍色監獄" },
  { text: "運氣只會降臨在有勇氣踏入虎穴的人身上。", char: "繪心甚八", src: "藍色監獄" },
  { text: "什麼都無法捨棄的人，就什麼也無法改變。", char: "阿爾敏", src: "進擊的巨人" },
  { text: "戰鬥吧！不戰鬥就贏不了！", char: "艾連·葉卡", src: "進擊的巨人" },
  { text: "做出選擇吧，是不留遺憾地相信自己，還是相信值得信賴的夥伴？", char: "里維兵長", src: "進擊的巨人" },
  { text: "這個世界是殘酷的，但也非常美麗。", char: "米卡莎", src: "進擊的巨人" },
  { text: "勞動就是狗屎。", char: "七海建人", src: "咒術迴戰" },
  { text: "會贏的，因為我是最強的。", char: "五條悟", src: "咒術迴戰" },
  { text: "積累微小的絕望，這就是長大成人。", char: "七海建人", src: "咒術迴戰" },
  { text: "不平等地救助他人，這就是我身為咒術師的理念。", char: "伏黑惠", src: "咒術迴戰" },
  { text: "這可是純愛啊！", char: "乙骨憂太", src: "咒術迴戰" },
  { text: "現在放棄的話，比賽就結束了喔。", char: "安西教練", src: "灌籃高手" },
  { text: "控制籃板球的人，就能控制比賽。", char: "赤木剛憲", src: "灌籃高手" },
  { text: "我是天才！", char: "櫻木花道", src: "灌籃高手" },
  { text: "直到最後一刻都不可以放棄希望。", char: "安西教練", src: "灌籃高手" },
  { text: "教練，我想打籃球...", char: "三井壽", src: "灌籃高手" },
  { text: "弱者是沒有資格談正義的。", char: "多佛朗明哥", src: "航海王" },
  { text: "人的夢想，是不會結束的！", char: "黑鬍子", src: "航海王" },
  { text: "既然拔劍了，就要戰到最後一刻。", char: "索隆", src: "航海王" },
  { text: "聽著，魯夫。勝利與敗北，甚至只要有人願意等待，這一切都是有意義的。", char: "傑克", src: "航海王" },
  { text: "不管是多麼微不足道的事，只要持續下去，總有一天會成為巨大的力量。", char: "煉獄杏壽郎", src: "鬼滅" },
  { text: "燃燒心靈！", char: "煉獄杏壽郎", src: "鬼滅" },
  { text: "縱使我身形俱滅，也定將惡鬼斬殺。", char: "產屋敷耀哉", src: "鬼滅" },
  { text: "人沒有犧牲就什麼都得不到，這就是等價交換。", char: "阿爾馮斯", src: "鋼鍊" },
  { text: "站起來，向前走。你不是還有兩條腿嗎？", char: "愛德華", src: "鋼鍊" },
  { text: "別死啊，死了就什麼都沒了。", char: "羅伊·馬斯坦古", src: "鋼鍊" },
  { text: "所謂的覺悟，就是在漆黑的荒野中，開闢出一條前進的道路！", char: "喬魯諾", src: "JOJO" },
  { text: "人類的讚歌就是勇氣的讚歌！", char: "齊貝林", src: "JOJO" },
  { text: "我拒絕！我岸邊露伴最喜歡做的事，就是對自以為強大的傢伙說「NO」！", char: "岸邊露伴", src: "JOJO" },
  { text: "正因為我們不知道未來會發生什麼，這段旅程才有趣啊。", char: "芙莉蓮", src: "葬送的芙莉蓮" },
  { text: "即使是只有百分之一的可能性，那也比零要好。", char: "欣梅爾", src: "葬送的芙莉蓮" },
  { text: "只要稍微改變一下視角，世界就會變得不一樣。", char: "海塔", src: "葬送的芙莉蓮" },
  { text: "享受過程吧，那是比你想要的任何東西都更有價值的東西。", char: "金·富力士", src: "獵人" },
  { text: "人們之所以懷抱希望，是因為他們看不見死亡。", char: "朽木白哉", src: "死神" },
  { text: "憧憬是距離理解最遙遠的感情。", char: "藍染惣右介", src: "死神" },
  { text: "如果你有時間想著怎麼死得漂亮，還不如漂亮的活到最後一刻。", char: "坂田銀時", src: "銀魂" },
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

const MOOD_FEEDBACK = {
  1: "沒關係，允許自己慢慢開機。低速檔也能前進。",
  3: "很好，平穩的狀態是專業的基石。保持節奏。",
  5: "太強了！今天你是球場上的國王！全速前進！"
};

const NIGHT_CHECKLIST_ITEMS = [
  { id: 'sleep_light', text: '開啟睡眠燈', icon: <Lightbulb size={20} />, sub: '營造睡前氛圍' },
  { id: 'ereader_ready', text: '準備閱讀器', icon: <BookOpen size={20} />, sub: '進入心流狀態' },
  { id: 'phone_upstairs', text: '手機移至樓上充電', icon: <BatteryCharging size={20} />, sub: '徹底斷開連結' }
];

// --- AUDIO ENGINE ---
const SoundEngine = {
  ctx: null,
  init: () => {
    if (!SoundEngine.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) SoundEngine.ctx = new AudioContext();
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
  playClick: () => SoundEngine.playTone(800, 'square', 0.1),
  playChime: () => {
    setTimeout(() => SoundEngine.playTone(523.25, 'sine', 1.5), 0);
    setTimeout(() => SoundEngine.playTone(659.25, 'sine', 1.5), 200);
    setTimeout(() => SoundEngine.playTone(783.99, 'sine', 2.0), 400);
  }
};

// --- Wake Lock Helper ---
const useWakeLock = () => {
  const wakeLock = useRef(null);

  const requestWakeLock = async () => {
    try {
      if ('wakeLock' in navigator) {
        wakeLock.current = await navigator.wakeLock.request('screen');
        console.log('Wake Lock is active');
      }
    } catch (err) {
      console.error(`${err.name}, ${err.message}`);
    }
  };

  const releaseWakeLock = async () => {
    if (wakeLock.current) {
      try {
        await wakeLock.current.release();
        wakeLock.current = null;
        console.log('Wake Lock released');
      } catch (err) {
        console.error(`${err.name}, ${err.message}`);
      }
    }
  };

  return { requestWakeLock, releaseWakeLock };
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
    night: "bg-indigo-900 text-white border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,0.5)] hover:bg-indigo-800"
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

const MangaHeader = ({ title, subtitle, step, onBack, isNight = false }) => (
  <div className="mb-6 relative z-10 flex-shrink-0">
    <div className="flex items-start justify-between mb-2">
      {onBack && (
        <button onClick={onBack} className={`p-2 -ml-2 transition-colors ${isNight ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-black'}`}>
          <ChevronLeft size={28} strokeWidth={3} />
        </button>
      )}
      {step && (
        <div className="inline-block bg-black text-orange-500 font-black italic px-3 py-1 border-b-4 border-r-4 border-orange-500 transform -rotate-3 shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] text-sm ml-auto">
          STAGE {step}
        </div>
      )}
    </div>
    <h2 className={`text-3xl sm:text-4xl font-black italic uppercase tracking-tighter transform -skew-x-6 leading-none break-words ${isNight ? 'text-white' : 'text-black'}`}>
      <span className={`px-2 inline-block mr-1 shadow-[3px_3px_0px_0px_black] transform skew-x-6 ${isNight ? 'bg-indigo-500 text-white' : 'bg-orange-500 text-white'}`}>/</span>
      {title}
    </h2>
    {subtitle && (
      <p className={`font-bold mt-3 pl-4 border-l-8 uppercase tracking-wide text-sm sm:text-base backdrop-blur-sm p-1 ${isNight ? 'text-gray-300 border-indigo-500 bg-black/30' : 'text-black border-orange-500 bg-white/50'}`}>
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

const SeasonStatsDashboard = ({ history, nightHistory, onDelete }) => {
  if ((!history || history.length === 0) && (!nightHistory || nightHistory.length === 0)) return null;

  const calculateStreak = (type) => {
    const validDates = new Set();
    const source = (type === 'sleep') ? nightHistory : history;
    
    if (!source) return 0;

    source.forEach(r => {
      let isValid = false;
      if (type === 'work') isValid = (r.workDuration || 0) >= 5;
      else if (type === 'exercise') isValid = !!r.exercise;
      else if (type === 'english') isValid = r.english && r.english.length > 0;
      else if (type === 'sleep') isValid = r.isEarlySleep === true; 
      
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

  const workStreak = calculateStreak('work');
  const exerciseStreak = calculateStreak('exercise');
  const englishStreak = calculateStreak('english');
  const sleepStreak = calculateStreak('sleep');

  const workStats = {
    totalSessions: history.length,
    totalMinutes: history.reduce((acc, curr) => acc + (curr.workDuration || 0), 0),
    avgMinutes: history.length > 0 ? Math.round(history.reduce((acc, curr) => acc + (curr.workDuration || 0), 0) / history.length) : 0
  };

  const exerciseCounts = history.reduce((acc, curr) => {
    const name = curr.exercise ? curr.exercise.name : "Skipped";
    acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {});

  const englishCounts = history.reduce((acc, curr) => {
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

      {/* Sleep Stats Section */}
      <div className="bg-white border-4 border-black p-4 shadow-sm">
        <div className="flex justify-between items-center border-b-2 border-gray-200 pb-2 mb-3">
          <h4 className="font-black text-sm flex items-center gap-2">
            <Moon size={16} /> 睡眠戰線 (Before 00:00)
          </h4>
          <div className="flex items-center gap-1 text-indigo-600 font-black italic bg-indigo-50 px-2 py-1 rounded">
            <Flame size={14} className="fill-current" /> {sleepStreak} DAYS
          </div>
        </div>
        {nightHistory && nightHistory.length > 0 ? (
            <div className="space-y-2">
                {nightHistory.slice(0, 7).map((record, idx) => (
                    <div key={record.id || idx} className="flex justify-between items-center text-xs font-bold border-b border-dashed border-gray-200 pb-1 last:border-0">
                        <div className="flex items-center gap-2">
                            <span className="text-gray-500">{record.dateDisplay}</span>
                            <span className={record.isEarlySleep ? "text-green-600" : "text-red-500"}>
                                {record.timeString} {record.isEarlySleep ? "(WIN)" : "(LATE)"}
                            </span>
                        </div>
                        <button onClick={(e) => onDelete(e, record.id, 'night')} className="text-gray-300 hover:text-red-500 transition-colors">
                            <Trash2 size={14} />
                        </button>
                    </div>
                ))}
            </div>
        ) : (
            <div className="text-center text-gray-400 text-xs italic py-2">No night ops recorded.</div>
        )}
      </div>
    </div>
  );
};

const ScoreCard = ({ record, onClose }) => {
  if (!record) return null;
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
              {isExerciseSkipped ? "Rest Day" : record.exercise.name}
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
export default function MorningStrategistV6() {
  const [user, setUser] = useState(null);
  const [phase, setPhase] = useState('loading');
  const [history, setHistory] = useState([]);
  const [nightHistory, setNightHistory] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);
  const [hasManualReset, setHasManualReset] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  const [todayQuote, setTodayQuote] = useState({ text: "", char: "", src: "" });
  const [restQuote, setRestQuote] = useState({ text: "", char: "", src: "" });
  const [moodFeedback, setMoodFeedback] = useState("");
  const [moodSyncRate, setMoodSyncRate] = useState("");

  const [wakeUpTime, setWakeUpTime] = useState('06:00');
  const [actualWakeUpTime, setActualWakeUpTime] = useState(null);
  const [mood, setMood] = useState(null);
  const [isWaterDrank, setIsWaterDrank] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(EXERCISE_ROUTINES[0]);
  const [selectedEnglishApps, setSelectedEnglishApps] = useState([]);
  const [englishTopic, setEnglishTopic] = useState("");
  const [workChecklist, setWorkChecklist] = useState(PRE_WORK_CHECKLIST.map(item => ({ ...item, checked: false })));
  const [workTopic, setWorkTopic] = useState("");
  
  const [nightChecklist, setNightChecklist] = useState(NIGHT_CHECKLIST_ITEMS.map(item => ({ ...item, checked: false })));

  const [timeLeft, setTimeLeft] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [workSetupTime, setWorkSetupTime] = useState(45);
  const [workStep, setWorkStep] = useState('checklist');

  const targetTimeRef = useRef(null);

  const [targetSets, setTargetSets] = useState(1);
  const [currentSet, setCurrentSet] = useState(1);
  const [setsCompleted, setSetsCompleted] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [viewingRecord, setViewingRecord] = useState(null);
  const [showStats, setShowStats] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);

  const timerRef = useRef(null);
  const contentRef = useRef(null);
  const { requestWakeLock, releaseWakeLock } = useWakeLock();

  // --- Helpers ---
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

  const getGreeting = () => {
      const hours = new Date().getHours();
      if (hours >= 5 && hours < 12) return { text: "早安", sub: "GOOD MORNING" };
      if (hours >= 12 && hours < 18) return { text: "午安", sub: "GOOD AFTERNOON" };
      return { text: "晚安", sub: "GOOD EVENING" };
  };

  useEffect(() => {
    if (phase === 'loading' || phase === 'finished' || hasManualReset) return;

    // LUCAS FIX: V6 uses morning_recovery_v2 to ensure clean slate
    const nightChecklistState = nightChecklist.map(({ id, checked }) => ({ id, checked }));

    const stateToSave = {
        date: new Date().toLocaleDateString('zh-TW'),
        phase,
        wakeUpTime,
        actualWakeUpTime,
        mood,
        isWaterDrank,
        selectedExercise,
        currentSet,
        setsCompleted,
        selectedEnglishApps,
        englishTopic,
        workChecklist,
        workTopic,
        workSetupTime,
        workStep,
        totalDuration, 
        timeLeft, 
        nightChecklist: nightChecklistState
    };
    localStorage.setItem('morning_recovery_v2', JSON.stringify(stateToSave));
  }, [phase, wakeUpTime, actualWakeUpTime, mood, isWaterDrank, selectedExercise, currentSet, setsCompleted, selectedEnglishApps, englishTopic, workChecklist, workTopic, workSetupTime, workStep, totalDuration, timeLeft, hasManualReset, nightChecklist]);

  useEffect(() => {
    const savedStateJson = localStorage.getItem('morning_recovery_v2');
    if (savedStateJson) {
        try {
            const savedState = JSON.parse(savedStateJson);
            const today = new Date().toLocaleDateString('zh-TW');
            
            if (savedState.date === today && savedState.phase !== 'finished') {
                console.log("Recovering session from local storage...");
                setWakeUpTime(savedState.wakeUpTime);
                setActualWakeUpTime(savedState.actualWakeUpTime);
                setMood(savedState.mood);
                setIsWaterDrank(savedState.isWaterDrank);
                setSelectedExercise(savedState.selectedExercise);
                setCurrentSet(savedState.currentSet);
                setSetsCompleted(savedState.setsCompleted);
                setSelectedEnglishApps(savedState.selectedEnglishApps);
                setEnglishTopic(savedState.englishTopic);
                setWorkChecklist(savedState.workChecklist);
                setWorkTopic(savedState.workTopic);
                setWorkSetupTime(savedState.workSetupTime);
                setWorkStep(savedState.workStep);
                setTotalDuration(savedState.totalDuration);
                setTimeLeft(savedState.timeLeft);
                
                if (savedState.nightChecklist) {
                    const mergedList = NIGHT_CHECKLIST_ITEMS.map(staticItem => {
                        const savedItem = savedState.nightChecklist.find(i => i.id === staticItem.id);
                        return { ...staticItem, checked: savedItem ? savedItem.checked : false };
                    });
                    setNightChecklist(mergedList);
                }
                
                if (savedState.mood) {
                    const m = savedState.mood;
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
                }

                setPhase(savedState.phase);
            } else {
                localStorage.removeItem('morning_recovery_v2');
            }
        } catch (e) {
            console.error("Failed to parse saved state", e);
            localStorage.removeItem('morning_recovery_v2');
        }
    }
  }, []);

  useEffect(() => {
    if (history.length > 0 && !hasManualReset && (phase === 'sleeping' || phase === 'loading')) {
      const latest = history[0];
      const today = new Date().toLocaleDateString('zh-TW');

      if (latest.dateDisplay === today) {
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
        localStorage.removeItem('morning_recovery_v2');
      }
    }
  }, [history, hasManualReset, phase]);

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
        setPhase(prev => prev === 'loading' ? 'sleeping' : prev);
      }
    });
    return () => unsubscribe();
  }, []);

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
             try { await signInAnonymously(auth); } catch(e) { console.error("Guest login failed", e); }
         }
      } else if (error.code === 'auth/popup-closed-by-user') {
         setErrorMsg("登入已取消");
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
      setNightHistory([]);
      setPhase('sleeping'); 
      setHasManualReset(true);
      localStorage.removeItem('morning_recovery_v2');
    } catch (error) {
      console.error("Logout Failed", error);
    }
  };

  useEffect(() => {
    if (!user) { setHistory([]); setNightHistory([]); return; };
    
    const qMorning = query(
      collection(db, 'artifacts', appId, 'users', user.uid, 'morning_sessions'),
      orderBy('createdAt', 'desc')
    );
    const unsubMorning = onSnapshot(qMorning, (snapshot) => {
      setHistory(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => console.error("Morning Snapshot Error:", error));

    const qNight = query(
      collection(db, 'artifacts', appId, 'users', user.uid, 'night_sessions'),
      orderBy('createdAt', 'desc')
    );
    const unsubNight = onSnapshot(qNight, (snapshot) => {
      setNightHistory(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => console.error("Night Snapshot Error:", error));

    return () => {
        unsubMorning();
        unsubNight();
    };
  }, [user]);

  useEffect(() => {
    if (contentRef.current) contentRef.current.scrollTop = 0;
  }, [phase, workStep]);

  useEffect(() => {
    if (isActive) {
      requestWakeLock(); 
      targetTimeRef.current = Date.now() + (timeLeft * 1000);

      timerRef.current = setInterval(() => {
        const now = Date.now();
        const difference = targetTimeRef.current - now;
        const remainingSeconds = Math.ceil(difference / 1000);

        if (remainingSeconds <= 0) {
          clearInterval(timerRef.current);
          setTimeLeft(0);
          setIsActive(false);
          releaseWakeLock();
          SoundEngine.playChime();

          if (phase === 'exercise') {
            if (currentSet < targetSets) {
              setCurrentSet(prev => prev + 1);
              setTimeLeft(selectedExercise.duration);
            }
          } else if (phase === 'work-prep' && workStep === 'focus') {
            setTimeout(() => completeDay(), 500);
          }
        } else {
          setTimeLeft(remainingSeconds);
        }
      }, 1000);
    } else {
      clearInterval(timerRef.current);
      releaseWakeLock();
    }
    return () => {
      clearInterval(timerRef.current);
      releaseWakeLock();
    };
  }, [isActive, phase, workStep, currentSet, targetSets, selectedExercise]);

  const goBack = () => {
    setIsActive(false);
    switch (phase) {
      case 'mood-check': setPhase('sleeping'); break;
      case 'exercise': setPhase('mood-check'); break;
      case 'english': setPhase('exercise'); break;
      case 'work-prep':
        if (workStep === 'focus') setWorkStep('setup');
        else if (workStep === 'setup') setWorkStep('checklist');
        else setPhase('english');
        break;
      case 'night-mode': setPhase('sleeping'); break;
      default: break;
    }
  };

  const handleWakeUp = async () => {
    SoundEngine.init();
    if (!user) {
        try { await signInAnonymously(auth); } catch(e) { console.error("Anon Auth Failed", e); return; }
    }
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    setActualWakeUpTime(`${hours}:${minutes}`);
    setPhase('mood-check');
  };

  const handleNightModeStart = async () => {
    SoundEngine.init();
    if (!user) {
        try { await signInAnonymously(auth); } catch(e) { console.error("Anon Auth Failed", e); return; }
    }
    setPhase('night-mode');
  }

  const handleNightShutdown = async () => {
      if (isSaving) return;
      if (!user) { setErrorMsg("連線中斷，請檢查網路"); return; }
      setIsSaving(true);

      const now = new Date();
      const hours = now.getHours();
      const isEarlySleep = hours < 24 && hours >= 18; 
      
      const sanitizedChecklist = nightChecklist.map(item => ({
          id: item.id,
          text: item.text,
          checked: item.checked
      }));

      const record = {
          type: 'night_shutdown',
          checklist: sanitizedChecklist,
          timestamp: Date.now(),
          timeString: now.toLocaleTimeString('zh-TW'),
          dateDisplay: now.toLocaleDateString('zh-TW'),
          isEarlySleep: hours === 0 ? false : (hours < 24),
          createdAt: serverTimestamp()
      };

      try {
          await addDoc(collection(db, 'artifacts', appId, 'users', user.uid, 'night_sessions'), record);
          SoundEngine.playChime();
          setPhase('system-offline'); 
          setNightChecklist(NIGHT_CHECKLIST_ITEMS.map(item => ({ ...item, checked: false }))); 
      } catch (e) {
          console.error("Night save failed", e);
          setErrorMsg("儲存失敗");
      } finally {
          setIsSaving(false);
      }
  };

  const handleStartNewDay = () => {
      setHasManualReset(true);
      localStorage.removeItem('morning_recovery_v2'); 
      
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
      
      setTodayQuote(getDailySeededQuote());
  };

  const handleDeleteClick = (e, id, type = 'morning') => { 
      e.stopPropagation(); 
      setRecordToDelete({ id, type }); 
  };

  const confirmDelete = async () => {
    if (!recordToDelete || !user) return;
    const { id, type } = recordToDelete;
    
    setIsDeleting(true);
    try {
      const collectionName = type === 'night' ? 'night_sessions' : 'morning_sessions';
      await deleteDoc(doc(db, 'artifacts', appId, 'users', user.uid, collectionName, id));
      
      if (type === 'morning') {
          const record = history.find(r => r.id === id);
          const today = new Date().toLocaleDateString('zh-TW');
          if (record && record.dateDisplay === today) {
               handleStartNewDay(); 
               if (viewingRecord && viewingRecord.id === id) setViewingRecord(null);
          } else {
               if (viewingRecord && viewingRecord.id === id) setViewingRecord(null);
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

  const handleDrinkWater = () => { setIsWaterDrank(true); SoundEngine.playClick(); };

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

  const handleFinishExercise = () => { setSetsCompleted(currentSet); setPhase('english'); };
  const skipExercise = () => { setSelectedExercise(null); setIsActive(false); setSetsCompleted(0); setPhase('english'); };
  const toggleEnglishApp = (id) => { setSelectedEnglishApps(prev => prev.includes(id) ? prev.filter(appId => appId !== id) : [...prev, id]); };
  const skipEnglish = () => { setSelectedEnglishApps([]); setEnglishTopic(""); setPhase('work-prep'); };
  const finishEnglish = () => { setPhase('work-prep'); };

  const startWorkTimer = () => {
    setWorkStep('focus');
    const seconds = workSetupTime * 60;
    setTimeLeft(seconds);
    setTotalDuration(seconds);
    setIsActive(true);
    SoundEngine.init();
  };

  const skipWork = () => { completeDay(true); };

  const completeDay = async (isSkipped = false) => {
    if (isSaving) return;
    if (!user) { setErrorMsg("連線中斷，請檢查網路"); return; }
    setIsActive(false);
    setIsSaving(true);
    setPhase('finished');
    if (!isSkipped) SoundEngine.playChime();

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
      await addDoc(collection(db, 'artifacts', appId, 'users', user.uid, 'morning_sessions'), record);
      localStorage.removeItem('morning_recovery_v2'); 
    } catch (e) {
      console.error("Save failed:", e);
      setErrorMsg("自動存檔失敗");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="h-screen w-full bg-gray-900 flex items-center justify-center font-sans text-slate-800 overflow-hidden">
      <div className="w-full max-w-md h-full sm:h-[90vh] sm:rounded-3xl bg-white flex flex-col relative overflow-hidden shadow-2xl sm:border-8 sm:border-gray-800">

        {errorMsg && (
          <div className="absolute top-0 left-0 w-full bg-red-600 text-white text-center text-xs font-bold py-1 z-50 animate-fade-in">
            {errorMsg}
          </div>
        )}

        {phase !== 'loading' && phase !== 'finished' && phase !== 'sleeping' && phase !== 'history' && phase !== 'night-mode' && phase !== 'system-offline' && (
          <div className="h-16 shrink-0 bg-black border-b-4 border-orange-500 flex items-center justify-between px-4 sm:px-6 relative z-50 shadow-[0px_4px_0px_0px_rgba(249,115,22,1)]">
            <span className="font-black italic text-2xl text-white tracking-tighter uppercase transform -skew-x-12">
              M<span className="text-orange-500">.STRAT</span>
            </span>
            <div className="flex items-center gap-2 bg-white border-2 border-black px-2 py-1 transform skew-x-[-12deg]">
              <span className="text-xs font-black text-black skew-x-[12deg]">{wakeUpTime} START</span>
            </div>
          </div>
        )}

        <div ref={contentRef} className={`flex-1 overflow-y-auto overflow-x-hidden ${phase === 'night-mode' || phase === 'system-offline' ? 'bg-slate-900' : 'bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]'}`}>
          {phase === 'loading' && (
            <div className="flex flex-col items-center justify-center h-full bg-black">
              <Loader2 size={48} className="text-orange-500 animate-spin mb-4" />
              <p className="text-white font-black italic uppercase tracking-wider">ENTERING THE COURT...</p>
            </div>
          )}

          {phase === 'sleeping' && (
            <div className="min-h-full flex flex-col items-center justify-center p-6 bg-black relative">
              <div className="absolute inset-0 flex flex-col pointer-events-none opacity-10 select-none overflow-hidden leading-none font-black italic text-8xl text-white text-left whitespace-nowrap">
                <span>WAKE UP</span><span className="ml-20">FLY HIGH</span><span>DON'T STOP</span>
              </div>
              <div className="absolute top-4 right-4 z-20">
                <button onClick={() => setPhase('history')} className="flex items-center gap-2 text-white/50 hover:text-orange-500 font-bold text-sm uppercase tracking-wider transition-colors">
                  <History size={16} /> Records
                </button>
              </div>
              <div className="relative z-10 flex flex-col items-center space-y-6 w-full py-12">
                <div className="animate-bounce">
                  <Zap size={80} className="text-orange-500 fill-orange-500 transform rotate-12 drop-shadow-[4px_4px_0px_rgba(255,255,255,1)]" />
                </div>
                <h1 className="text-5xl sm:text-6xl font-black italic text-white uppercase tracking-tighter transform -skew-x-6 leading-none drop-shadow-[4px_4px_0px_rgba(249,115,22,1)] text-center">
                  {getGreeting().text},<br />
                  <span className="text-orange-500 text-6xl sm:text-7xl">
                    {user && !user.isAnonymous ? (user.displayName || "LUCAS").split(' ')[0].toUpperCase() : "LUCAS"}.
                  </span>
                </h1>
                
                {!user || user.isAnonymous ? (
                    <div className="w-full max-w-xs transform -rotate-1">
                        <PowerButton variant="google" onClick={handleGoogleLogin} loading={isAuthLoading} className="py-2 text-sm border-2">
                             使用 Google 帳號登入 (Sync)
                        </PowerButton>
                        <p className="text-gray-500 text-[10px] font-bold text-center mt-1 uppercase">登入以跨裝置儲存戰績</p>
                    </div>
                ) : null}

                <div className="w-full max-w-xs bg-white border-4 border-black p-4 shadow-[6px_6px_0px_0px_rgba(249,115,22,1)] transform rotate-1">
                  <div className="flex justify-between items-center mb-2 border-b-2 border-gray-200 pb-1">
                    <p className="text-orange-500 text-[10px] font-black uppercase tracking-widest">DAILY STRATEGY</p>
                    <Sparkles size={12} className="text-orange-500" />
                  </div>
                  <p className="text-black font-bold text-sm leading-relaxed mb-2">"{todayQuote.text}"</p>
                  <div className="text-right">
                    <p className="text-xs font-black italic text-gray-500">— {todayQuote.char}</p>
                    <p className="text-[10px] font-bold text-gray-400">({todayQuote.src})</p>
                  </div>
                </div>
                <div className="bg-white p-4 border-4 border-orange-500 transform -skew-x-6 shadow-[6px_6px_0px_0px_rgba(249,115,22,1)] w-full max-w-xs">
                  <label className="block text-xs font-black text-black uppercase tracking-widest mb-2 skew-x-6">設定目標開賽時間 (TARGET)</label>
                  <div className="flex items-center justify-center skew-x-6">
                    <Clock className="mr-2 text-orange-500" />
                    <input type="time" value={wakeUpTime} onChange={(e) => setWakeUpTime(e.target.value)} className="text-4xl font-black font-mono text-center bg-transparent focus:outline-none w-full" />
                  </div>
                </div>
                <div className="w-full max-w-xs space-y-3">
                  <PowerButton onClick={handleWakeUp} className="text-xl py-5"><Zap className="fill-current" /> 醒來，上場！</PowerButton>
                  
                  <button 
                    onClick={handleNightModeStart}
                    className={`w-full py-3 border-2 font-black italic uppercase transition-all text-sm flex items-center justify-center gap-2 ${new Date().getHours() >= 18 || new Date().getHours() < 5 ? 'bg-indigo-900 text-white border-indigo-500 shadow-[0px_0px_15px_rgba(99,102,241,0.5)] animate-pulse' : 'bg-black/50 text-gray-400 border-gray-700 hover:bg-indigo-900 hover:text-white hover:border-indigo-500'}`}
                  >
                    <Moon size={16} /> 切換至夜間作戰 (NIGHT OPS)
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

          {phase === 'night-mode' && renderNightView()}

          {phase === 'system-offline' && renderSystemOfflineView()}

          {phase === 'finished' && renderFinishedView()}
        </div>

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

        {viewingRecord && <ScoreCard record={viewingRecord} onClose={() => setViewingRecord(null)} />}

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
