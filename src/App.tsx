import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  motion, useInView, AnimatePresence,
  useMotionValue, useSpring,
} from 'motion/react';
import {
  MapPin, X, ArrowRight, Coffee, Sparkles, Check, ShoppingBag,
  Clock, Volume2, VolumeX, Instagram, Facebook,
  Menu as MenuIcon, Plus, Minus, Trash2,
} from 'lucide-react';

import { useCart } from './hooks/useCart';
import { useParallax } from './hooks/useParallax';
import { getAudioContext } from './hooks/useSafeAudioContext';


/* ==================================================================== */
/*  IMAGE URLS                                                          */
/* ==================================================================== */
const LOGO_URL         = "https://pub-f1d3ed3a9ea941e4b2f517965ae99725.r2.dev/kemps-logo.png";
const LOCAL_LOGO       = "/images/kemps-logo.png";
const SKY_BG_URL = "https://pub-f1d3ed3a9ea941e4b2f517965ae99725.r2.dev/FzdC14gXmToAITCtvyUakmsjgwI.png";
const DARK_COFFEE_URL  = "https://pub-f1d3ed3a9ea941e4b2f517965ae99725.r2.dev/978edf78-96a6-4053-9950-a313da611d8e-removebg-preview.png";
const ICED_LATTE_URL   = "https://pub-f1d3ed3a9ea941e4b2f517965ae99725.r2.dev/chatgpt-removebg-preview.png";
const CUPPY_URL        = "https://kelechieze.wordpress.com/wp-content/uploads/2026/09/cuppy.png";
const VIDEO_URL        = "https://yefzuflpjsamilvmlynh.supabase.co/storage/v1/object/public/pinterestvideos/lavid.mp4";
const CAN_PROTEIN_WHOLE_URL    = "https://pub-f1d3ed3a9ea941e4b2f517965ae99725.r2.dev/Protein-Whole.png";
const CAN_PROTEIN_2_URL        = "https://pub-f1d3ed3a9ea941e4b2f517965ae99725.r2.dev/Protein-2.png";
const CAN_PROTEIN_3_URL       = "https://pub-f1d3ed3a9ea941e4b2f517965ae99725.r2.dev/51.png";
const CAN_BLUEBERRY_URL        = "https://pub-f1d3ed3a9ea941e4b2f517965ae99725.r2.dev/hh.png";
const CAN_STRAWBERRY_URL       = "https://pub-f1d3ed3a9ea941e4b2f517965ae99725.r2.dev/kk.png";

const LOCAL_SKY_BG     = "/images/sky-bg.png";
const LOCAL_DARK_COFFEE= "/images/latte1.png";
const LOCAL_ICED_LATTE = "/images/latte2.png";
const LOCAL_CUPPY      = "/images/cuppy.png";
const LOCAL_VIDEO      = "/videos/lavid.mp4";
const LOCAL_CAN_PROTEIN_WHOLE  = "/images/can-protein-whole.png";
const LOCAL_CAN_PROTEIN_2      = "/images/can-protein-2.png";
const LOCAL_CAN_PROTEIN_3     = "/images/can-protein-3.png";
const LOCAL_CAN_BLUEBERRY      = "/images/can-blueberry.png";
const LOCAL_CAN_STRAWBERRY     = "/images/can-strawberry.png";

/* ==================================================================== */
/*  IMAGE WITH FALLBACK                                                 */
/* ==================================================================== */
function Img({
  primary, fallback, alt, className, ...rest
}: { primary: string; fallback: string; alt: string; className?: string } &
  React.ImgHTMLAttributes<HTMLImageElement>) {
  const [src, setSrc] = useState(primary);
  return (
    <img
      src={src}
      onError={() => src !== fallback && setSrc(fallback)}
      alt={alt}
      className={className}
      {...rest}
    />
  );
}

/* ==================================================================== */
/*  MAGNETIC BUTTON                                                     */
/* ==================================================================== */
function MagneticButton({
  children, onClick, className = '', strength = 10,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 22, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 260, damping: 22, mass: 0.6 });

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    x.set(((e.clientX - r.left) / r.width - 0.5) * strength);
    y.set(((e.clientY - r.top) / r.height - 0.5) * strength);
  };
  const reset = () => { x.set(0); y.set(0); };

  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ x: sx, y: sy }}
      whileTap={{ scale: 0.96 }}
      className={className}
    >
      {children}
    </motion.button>
  );
}

/* ==================================================================== */
/*  DATA                                                                */
/* ==================================================================== */
interface CanProduct {
  id: string; name: string; description: string;
  bgHex: string; primaryUrl: string; localFallback: string;
  canAlt: string; price: string; priceNum: number;
}

const CAN_PRODUCTS: CanProduct[] = [
  {
    id: 'can-protein-whole',
    name: 'Protein+ Whole Lactose Free',
    description: 'Power your day with Kemps Protein+ 2% Reduced Fat lactose free milk—50% more protein (13g per serving), 50% less sugar.',
    bgHex: '#f6e3d4',
    primaryUrl: CAN_PROTEIN_WHOLE_URL,
    localFallback: LOCAL_CAN_PROTEIN_WHOLE,
    canAlt: 'Kemps Protein+ Whole Lactose Free Milk',
    price: '$15.00',
    priceNum: 15.00,
  },
  {
    id: 'can-protein-2',
    name: 'Protein+ 2% Reduced Fat',
    description: 'Power your day with Kemps Protein+ 2% Reduced Fat lactose free milk—50% more protein (13g per serving), 50% less sugar.',
    bgHex: '#e3efe0',
    primaryUrl: CAN_PROTEIN_2_URL,
    localFallback: LOCAL_CAN_PROTEIN_2,
    canAlt: 'Kemps Protein+ 2% Reduced Fat Lactose Free Milk',
    price: '$15.00',
    priceNum: 15.00,
  },
  {
    id: 'can-blueberry-yogurt',
    name: 'Blueberry Nonfat Yogurt',
    description: 'Power your day with Blueberry Nonfat Yogurt.',
    bgHex: '#fef4cd',
    primaryUrl: CAN_BLUEBERRY_URL,
    localFallback: LOCAL_CAN_BLUEBERRY,
    canAlt: 'Kemps Blueberry Nonfat Yogurt',
    price: '$15.00',
    priceNum: 15.00,
  },
  {
    id: 'can-strawberry-yogurt',
    name: 'Strawberry Nonfat Yogurt',
    description: 'Power your day with Kemps Strawberry Nonfat Yogurt.',
    bgHex: '#fde1e3',
    primaryUrl: CAN_STRAWBERRY_URL,
    localFallback: LOCAL_CAN_STRAWBERRY,
    canAlt: 'Kemps Strawberry Nonfat Yogurt',
    price: '$15.00',
    priceNum: 15.00,
  },
];

interface MenuItem {
  id: string; name: string;
  category: 'Cold Brew' | 'Espresso & Latte' | 'Specialty' | 'Treats';
  description: string; price: string; priceNum: number;
  calories: string; notes: string[]; popular?: boolean; image: string;
}

const MENU_ITEMS: MenuItem[] = [
  { id: 'machi-cold-brew', name: 'Sour Cream', category: 'Cold Brew',
    description: 'Slow-steeped for 24 hours in cold filtered mountain water. Crisp, rich, and naturally chocolatey.',
    price: '$5.25', priceNum: 5.25, calories: '5 kcal',
    notes: ['Dark Cocoa', 'Hazelnut', 'Black Cherry'], popular: true, image: DARK_COFFEE_URL },
  { id: 'iced-cloud-latte', name: 'Iced Cloud Oat Latte', category: 'Espresso & Latte',
    description: 'Double-shot specialty espresso layered over creamy organic oat milk and crystalline ice cubes.',
    price: '$6.50', priceNum: 6.50, calories: '140 kcal',
    notes: ['Madagascar Vanilla', 'Toasted Oat', 'Honey Caramel'], popular: true, image: ICED_LATTE_URL },
  { id: 'salted-caramel-brew', name: 'Salted Caramel Cold Foam', category: 'Cold Brew',
    description: 'Our slow-drip Sour Cream topped with aerated velvety sea salt vanilla cream foam.',
    price: '$6.75', priceNum: 6.75, calories: '180 kcal',
    notes: ['Sea Salt', 'Buttery Toffee', 'Sweet Cream'], popular: true, image: DARK_COFFEE_URL },
  { id: 'spanish-iced-latte', name: 'Kyoto Brown Sugar Shaken', category: 'Specialty',
    description: 'Espresso shaken with cracked ice, cinnamon stick infusion, and raw Okinawa brown sugar syrup.',
    price: '$6.25', priceNum: 6.25, calories: '160 kcal',
    notes: ['Okinawa Molasses', 'Cinnamon Bark', 'Smooth Crema'], image: ICED_LATTE_URL },
  { id: 'matcha-cold-foam', name: 'Ceremonial Uji Matcha Latte', category: 'Specialty',
    description: 'First-harvest Kyoto Uji matcha hand-whisked to order over chilled milk with a hint of blossom honey.',
    price: '$6.80', priceNum: 6.80, calories: '120 kcal',
    notes: ['Sweet Umami', 'Young Bamboo', 'Clover Honey'], image: ICED_LATTE_URL },
];

const STORES = [
  { city: 'Tokyo, Shibuya', address: '1-14-9 Jinnan, Shibuya-ku',
    status: 'Open now • Closes 9:00 PM', distance: '0.4 mi away', isOpen: true },
  { city: 'Kyoto, Sanjo', address: '42 Kawaramachi-dori, Nakagyo-ku',
    status: 'Open now • Closes 8:00 PM', distance: '1.2 mi away', isOpen: true },
  { city: 'San Francisco, Hayes Valley', address: '412 Hayes St, San Francisco, CA',
    status: 'Open now • Closes 7:00 PM', distance: '2.5 mi away', isOpen: true },
  { city: 'New York, SoHo', address: '108 Prince St, New York, NY',
    status: 'Open now • Closes 8:00 PM', distance: '5.1 mi away', isOpen: true },
  { city: 'London, Covent Garden', address: '19 Floral St, London WC2E 9DS',
    status: 'Opens tomorrow at 7:30 AM', distance: 'Overseas', isOpen: false },
];

/* ==================================================================== */
/*  STAT COUNTER                                                        */
/* ==================================================================== */
function StatCounter({ from, to, suffix = '', label }: {
  from: number; to: number; suffix?: string; label: string;
}) {
  const [val, setVal] = useState(from);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  useEffect(() => {
    if (!isInView) return;
    let start: number | null = null;
    let raf = 0;
    const dur = 2000;
    const step = (t: number) => {
      if (!start) start = t;
      const p = Math.min((t - start) / dur, 1);
      const ease = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      setVal(Math.round(from + (to - from) * ease));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [isInView, from, to]);

  return (
    <div ref={ref} className="border-t border-neutral-700/60 pt-6">
      <div className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight">
        {val}{suffix}
      </div>
      <p className="mt-3 text-xs sm:text-sm text-neutral-400 font-medium">{label}</p>
    </div>
  );
}

/* ==================================================================== */
/*  WATER DROPLETS — falling from the cup                               */
/* ==================================================================== */
function Droplets({
  count = 6,
  className = '',
  tone = 'light',
}: {
  count?: number;
  className?: string;
  tone?: 'light' | 'dark';
}) {
  // Pre-generate random values so they stay stable across renders
  const drops = React.useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: 15 + Math.random() * 70,         // 15% – 85% of cup width
        delay: Math.random() * 4,               // stagger loop starts
        duration: 2.6 + Math.random() * 1.6,    // 2.6s – 4.2s per fall
        size: 4 + Math.random() * 5,            // 4px – 9px droplet
        drift: -14 + Math.random() * 28,        // horizontal drift px
      })),
    [count]
  );

  const dropColor =
    tone === 'dark'
      ? 'radial-gradient(circle at 35% 30%, rgba(255,255,255,0.95), rgba(200,215,225,0.7) 45%, rgba(140,170,190,0.45) 70%, rgba(90,120,140,0.15) 100%)'
      : 'radial-gradient(circle at 35% 30%, rgba(255,255,255,1), rgba(220,235,245,0.85) 45%, rgba(180,210,230,0.55) 70%, rgba(150,190,215,0.2) 100%)';

  return (
    <div className={`absolute inset-x-0 bottom-0 h-0 pointer-events-none ${className}`}>
      {drops.map((d) => (
        <motion.span
          key={d.id}
          initial={{ y: 0, opacity: 0, scale: 0.6 }}
          animate={{
            y: [0, 18, 90, 190],
            x: [0, d.drift * 0.3, d.drift * 0.7, d.drift],
            opacity: [0, 0.95, 0.9, 0],
            scale: [0.6, 1, 1, 0.85],
          }}
          transition={{
            duration: d.duration,
            delay: d.delay,
            times: [0, 0.15, 0.55, 1],
            repeat: Infinity,
            repeatDelay: Math.random() * 0.8,
            ease: [0.4, 0.0, 0.9, 1], // gravity-ish acceleration
          }}
          style={{
            position: 'absolute',
            left: `${d.left}%`,
            bottom: '-2px',
            width: d.size,
            height: d.size * 1.35,        // teardrop shape
            background: dropColor,
            borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
            boxShadow: '0 0 6px rgba(200, 225, 245, 0.55)',
            filter: 'blur(0.2px)',
            willChange: 'transform, opacity',
          }}
        />
      ))}
    </div>
  );
}

/* ==================================================================== */
/*  HERO CUP                                                            */
/* ==================================================================== */
function HeroCup({
  side, primary, fallback, alt, price, label, onAdd, onOpen, delay,
}: {
  side: 'left' | 'right';
  primary: string; fallback: string; alt: string;
  price: string; label: string;
  onAdd: () => void; onOpen: () => void; delay: number;
}) {
  const baseRotate = side === 'left' ? -14 : 14;
  const originX = side === 'left' ? 1 : 0;

  return (
    <motion.div
      initial={{ y: 120, opacity: 0, rotate: baseRotate * 0.6, scale: 0.85 }}
      animate={{ y: 0, opacity: 1, rotate: baseRotate, scale: 1 }}
      transition={{ type: 'spring', stiffness: 90, damping: 16, delay }}
      whileHover={{ rotate: baseRotate * 0.85, y: -14, scale: 1.04 }}
      style={{ transformOrigin: `${originX * 100}% 100%` }}
      className="relative cursor-pointer group"
      onClick={onOpen}
    >
                            <div className="animate-subtle-float">
                <Img
                  primary={DARK_COFFEE_URL}
                  fallback={LOCAL_DARK_COFFEE}
                  alt="Sour Cream"
                  loading="eager"
                  draggable={false}
                  className="w-[180px] sm:w-[200px] md:w-[300px] lg:w-[340px] xl:w-[345px]
                             max-w-none h-auto object-contain
                             filter drop-shadow-[0_40px_50px_rgba(0,0,0,0.32)]
                             transition-[filter] duration-300
                             group-hover:drop-shadow-[0_55px_70px_rgba(0,0,0,0.42)]"
                  style={{
                    imageRendering: 'crisp-edges',
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                  }}
                />
              </div>

              {/* Falling water droplets from the cup bottom */}
              <Droplets count={6} tone="dark" className="-bottom-1" />

      {/* Floating label */}
      <div className="pointer-events-none absolute -top-4 left-1/2 -translate-x-1/2
                      opacity-0 group-hover:opacity-100 transition-opacity duration-200
                      bg-white/95 backdrop-blur-md text-neutral-900 text-xs font-bold
                      px-3 py-1.5 rounded-full shadow-lg border border-white/60 whitespace-nowrap">
        {label} · {price}
      </div>

      {/* Quick add */}
      <button
        onClick={(e) => { e.stopPropagation(); onAdd(); }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2
                   opacity-0 group-hover:opacity-100 transition-all duration-200
                   bg-black text-white text-xs font-semibold
                   px-4 py-2 rounded-full shadow-xl
                   flex items-center gap-1.5 hover:bg-neutral-800 active:scale-95"
        aria-label={`Add ${label} to bag`}
      >
        <Plus size={13} /> Add to bag
      </button>
    </motion.div>
  );
}

function StatCounterWhite({
  from, to, suffix = '', label, compact = false,
}: {
  from: number; to: number; suffix?: string; label: string; compact?: boolean;
}) {
  const [val, setVal] = useState(from);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  useEffect(() => {
    if (!isInView) return;
    let start: number | null = null;
    let raf = 0;
    const dur = 2000;
    const step = (t: number) => {
      if (!start) start = t;
      const p = Math.min((t - start) / dur, 1);
      const ease = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      setVal(Math.round(from + (to - from) * ease));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [isInView, from, to]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="border-t border-neutral-200 pt-5"
    >
      <div
        className={`font-black text-neutral-950 tracking-tight ${
          compact
            ? 'text-2xl sm:text-3xl md:text-4xl'
            : 'text-4xl sm:text-5xl md:text-6xl'
        }`}
      >
        {val}{suffix}
      </div>
      <p
        className={`mt-2 font-medium text-neutral-500 ${
          compact ? 'text-[10px] sm:text-xs leading-snug' : 'text-xs sm:text-sm'
        }`}
      >
        {label}
      </p>
    </motion.div>
  );
}


/* ==================================================================== */
/*  APP                                                                 */
/* ==================================================================== */
export default function App() {
  const [menuOpen, setMenuOpen]           = useState(false);
  const [storesOpen, setStoresOpen]       = useState(false);
  const [storyOpen, setStoryOpen]         = useState(false);
  const [fairTradeOpen, setFairTradeOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [soundEnabled, setSoundEnabled]   = useState(false);
  const [toast, setToast]                 = useState<string | null>(null);

  const cart = useCart();
  useParallax();

  /* --- audio --- */
  const playIceChime = useCallback(() => {
    if (!soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const freqs = [1840, 2400, 3200, 1600];
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freqs[Math.floor(Math.random() * freqs.length)], ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(); osc.stop(ctx.currentTime + 0.35);
    } catch { /* noop */ }
  }, [soundEnabled]);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2400);
  }, []);

  const addToBag = useCallback((item: { id: string; name: string; price: number }, silent = false) => {
    cart.add(item);
    if (!silent) showToast(`Added ${item.name} to bag`);
    playIceChime();
  }, [cart, playIceChime, showToast]);

  /* --- esc closes mobile nav --- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMobileNavOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const marqueeText = "STEEPED 24 HOURS • SERVED ICE COLD • MADE TO ORDER • BREWED FRESH • ";

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-white font-sans text-neutral-900">

           {/* ============================================================ */}
      {/*  HERO                                                        */}
      {/* ============================================================ */}
      <div className="relative w-full min-h-screen overflow-hidden flex flex-col justify-between bg-[#4a9dd6]">

        {/* ---------- 1. SKY BACKGROUND + SUN GLOW ---------- */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Img
            primary={SKY_BG_URL}
            fallback={LOCAL_SKY_BG}
            alt="Blue sky with clouds"
            draggable={false}
            className="w-full h-full object-cover object-center will-change-transform"
            style={{
              transform: 'translate3d(calc(var(--mx, 0) * -8px), calc(var(--my, 0) * -6px), 0) scale(1.02)',
              imageRendering: 'crisp-edges',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
            }}
          />

          {/* Sun glow — top right */}
          <div
            className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full opacity-60"
            style={{
              background: 'radial-gradient(circle, rgba(255,240,200,0.45) 0%, rgba(255,220,150,0.12) 40%, transparent 70%)',
              filter: 'blur(24px)',
            }}
          />

          {/* Soft cloud wash at bottom — reduced haze */}
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-white/15 via-transparent to-transparent" />

          {/* Cursor glow — softened */}
          <div
            className="absolute inset-0 mix-blend-soft-light opacity-35"
            style={{
              background:
                'radial-gradient(400px circle at calc(50% + var(--mx, 0) * 30%) calc(50% + var(--my, 0) * 30%), rgba(255,255,255,0.45), transparent 55%)',
            }}
          />
        </div>

        {/* ---------- 2. MARQUEE WORDS (HOURS / BREWED) ---------- */}
              <div className="absolute inset-0 pointer-events-none z-10 select-none overflow-hidden">

          {/* ROW 1 — "IT'S" scrolling left */}
          <div className="absolute top-[10%] left-0 w-full overflow-hidden">
            <div
              style={{
                transform: 'translate3d(calc(var(--mx, 0) * -14px), calc(var(--my, 0) * -10px), 0)',
                transition: 'transform 0.2s ease-out',
              }}
            >
              <motion.div
                className="flex whitespace-nowrap will-change-transform"
                animate={{ x: ['0%', '-33.333%'] }}
                transition={{
                  duration: 14,
                  ease: 'linear',
                  repeat: Infinity,
                  repeatType: 'loop',
                }}
              >
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="text-[22vw] sm:text-[20vw] md:text-[18vw]
                               font-black uppercase tracking-tighter leading-none
                               text-white/35 drop-shadow-sm
                               pr-[6vw] whitespace-nowrap"
                  >
                    KEMPS&nbsp;&nbsp;
                  </span>
                ))}
              </motion.div>
            </div>
          </div>

          {/* ROW 2 — "KEMPS" scrolling right */}
          <div className="absolute top-[52%] left-0 w-full overflow-hidden">
            <div
              style={{
                transform: 'translate3d(calc(var(--mx, 0) * -14px), calc(var(--my, 0) * -10px), 0)',
                transition: 'transform 0.2s ease-out',
              }}
            >
              <motion.div
                className="flex whitespace-nowrap will-change-transform"
                animate={{ x: ['-33.333%', '0%'] }}
                transition={{
                  duration: 17,
                  ease: 'linear',
                  repeat: Infinity,
                  repeatType: 'loop',
                }}
              >
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="text-[22vw] sm:text-[20vw] md:text-[18vw]
                               font-black uppercase tracking-tighter leading-none
                               text-white/35 drop-shadow-sm
                               pr-[6vw] whitespace-nowrap"
                  >
                    KEMPS&nbsp;&nbsp;
                  </span>
                ))}
              </motion.div>
            </div>
          </div>

        </div>

        {/* ---------- 3. NAV ---------- */}
                <motion.header
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-40 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 pt-6 pb-8
           flex items-center justify-between"
        >

          {/* ---------- LOGO ---------- */}
          <motion.a
            href="#"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="relative group flex items-center"
            aria-label="Machi — home"
          >
            <Img
              primary={LOGO_URL}
              fallback={LOCAL_LOGO}
              alt="Machi"
              draggable={false}
              loading="eager"
              className="h-9 sm:h-10 md:h-11 w-auto object-contain
                         drop-shadow-[0_2px_8px_rgba(0,0,0,0.25)]
                         transition-transform duration-300
                         group-hover:scale-[1.03]"
              style={{
                imageRendering: 'crisp-edges',
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
              }}
            />

            {/* Soft glow behind the logo on hover */}
            <span className="absolute inset-0 -z-10 rounded-full blur-2xl bg-white/0
                             group-hover:bg-white/25 transition-colors duration-500" />
          </motion.a>

          {/* ---------- CENTER NAV ---------- */}
                 <nav className="hidden md:flex items-center gap-0.5 lg:gap-1
                          bg-white/10 backdrop-blur-md
                          rounded-full px-2 py-1.5
                          border border-white/15
                          shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
            {[
              { label: 'Products',      fn: () => setMenuOpen(true) },
              { label: 'Farmers',       fn: () => setStoryOpen(true) },
              { label: 'About',         fn: () => setStoryOpen(true) },
              { label: 'Where to Buy',  fn: () => setStoresOpen(true) },
              { label: 'Recipes',       fn: () => setMenuOpen(true) },
              { label: 'Merch',         fn: () => setMenuOpen(true) },
              { label: 'Contact',       fn: () => setStoresOpen(true) },
            ].map((item, i) => (
              <motion.button
                key={item.label}
                onClick={item.fn}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: 0.35 + i * 0.06,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.96 }}
                className="relative px-3 lg:px-3.5 py-1.5
                           text-white text-[13px] lg:text-[13.5px] font-medium
                           rounded-full
                           transition-colors duration-200
                           hover:bg-white/15
                           group
                           whitespace-nowrap"
              >
                {item.label}

                {/* Animated underline dot on hover */}
                <span className="absolute left-1/2 -translate-x-1/2 -bottom-0.5
                                 w-1 h-1 rounded-full bg-white
                                 opacity-0 scale-0
                                 group-hover:opacity-100 group-hover:scale-100
                                 transition-all duration-300" />
              </motion.button>
            ))}
          </nav>

          {/* ---------- RIGHT ACTIONS ---------- */}
          <div className="flex items-center gap-2 sm:gap-3">

            {/* Sound toggle */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.6 }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => { setSoundEnabled(s => !s); if (!soundEnabled) playIceChime(); }}
              title={soundEnabled ? 'Mute cafe sounds' : 'Enable cafe sound'}
              aria-label={soundEnabled ? 'Mute cafe sounds' : 'Enable cafe sound'}
              className="hidden sm:flex items-center justify-center w-9 h-9 rounded-full
                         bg-white/15 hover:bg-white/25 text-white
                         backdrop-blur-md border border-white/20
                         transition-colors relative"
            >
              {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
              {soundEnabled && (
                <span className="absolute inset-0 rounded-full border border-white/60 animate-ping" />
              )}
            </motion.button>

            {/* Cart badge */}
            <AnimatePresence>
              {cart.count > 0 && (
                <motion.button
                  key="cart"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.94 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                  onClick={() => setMenuOpen(true)}
                  aria-label={`${cart.count} items in bag`}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full
                             bg-white text-neutral-900
                             text-xs font-semibold shadow-md hover:bg-white/95 transition"
                >
                  <ShoppingBag size={13} />
                  <span>{cart.count}</span>
                </motion.button>
              )}
            </AnimatePresence>

            {/* Find a store — premium pill with shimmer */}
            <MagneticButton
              onClick={() => setStoresOpen(true)}
              className="relative overflow-hidden
                         bg-black text-white
                         px-5 sm:px-6 py-2.5
                         rounded-full
                         text-xs sm:text-[13px] font-semibold tracking-wide
                         shadow-[0_8px_24px_rgba(0,0,0,0.25)]
                         hover:shadow-[0_12px_32px_rgba(0,0,0,0.35)]
                         transition-all duration-300
                         group"
            >
              <span className="relative z-10">Find a store</span>

              {/* Shimmer sweep on hover */}
              <span className="absolute inset-0 -translate-x-full
                               bg-gradient-to-r from-transparent via-white/30 to-transparent
                               group-hover:translate-x-full
                               transition-transform duration-700 ease-out" />
            </MagneticButton>

            {/* Mobile hamburger */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setMobileNavOpen(v => !v)}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileNavOpen}
              className="md:hidden text-white p-2 rounded-full hover:bg-white/15 transition-colors"
            >
              <MenuIcon size={22} />
            </motion.button>
          </div>
        </motion.header>

        {/* Mobile nav */}
        <AnimatePresence>
          {mobileNavOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="md:hidden relative z-50 px-6 py-4 mx-6 mt-2 rounded-2xl bg-white/90 backdrop-blur-md
                         shadow-xl border border-white/40 flex flex-col gap-3"
            >
              {[
                { label: 'Products',   fn: () => setMenuOpen(true) },
                { label: 'Our story',  fn: () => setStoryOpen(true) },
                { label: 'Fair trade', fn: () => setFairTradeOpen(true) },
              ].map(item => (
                <button
                  key={item.label}
                  onClick={() => { item.fn(); setMobileNavOpen(false); }}
                  className="text-left py-2 font-medium text-neutral-800 hover:text-black border-b border-neutral-100 last:border-0"
                >
                  {item.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ---------- 4. CUPS ---------- */}
                        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none pt-20 sm:pt-24 lg:pt-30">
          <div
            className="relative flex items-center justify-center pointer-events-auto select-none"
            style={{
              transform: 'translate3d(calc(var(--mx, 0) * 16px), calc(var(--my, 0) * 12px), 0)',
              transition: 'transform 0.15s ease-out',
            }}
          >

            {/* LEFT CUP — cold brew */}
            <motion.div
              initial={{ x: '-80vw', opacity: 0, rotate: -35, scale: 0.7 }}
              animate={{ x: 0, opacity: 1, rotate: -14, scale: 1 }}
              transition={{
                type: 'spring',
                stiffness: 26,
                damping: 24,
                mass: 1.7,
                delay: 0.35,
              }}
              whileHover={{ rotate: -10, y: -14, scale: 1.05 }}
              className="relative cursor-pointer group z-20"
              style={{
                transformStyle: 'preserve-3d',
                perspective: '1200px',
              }}
              onClick={() => { playIceChime(); setMenuOpen(true); }}
            >
              <div className="animate-subtle-float">
                <Img
                  primary={DARK_COFFEE_URL}
                  fallback={LOCAL_DARK_COFFEE}
                  alt="Sour Cream"
                  loading="eager"
                  draggable={false}
                  className="w-[180px] sm:w-[200px] md:w-[300px] lg:w-[340px] xl:w-[345px]
                             max-w-none h-auto object-contain
                             filter drop-shadow-[0_40px_50px_rgba(0,0,0,0.32)]
                             transition-[filter] duration-300
                             group-hover:drop-shadow-[0_55px_70px_rgba(0,0,0,0.42)]"
                  style={{
                    imageRendering: 'crisp-edges',
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                  }}
                />
              </div>

              {/* Falling water droplets — cold brew tone */}
              <Droplets count={6} tone="dark" />

              <div className="pointer-events-none absolute -top-4 left-1/2 -translate-x-1/2
                              opacity-0 group-hover:opacity-100 transition-opacity duration-200
                              bg-white/95 backdrop-blur-md text-neutral-900 text-xs font-bold
                              px-3 py-1.5 rounded-full shadow-lg border border-white/60 whitespace-nowrap">
                Sour Cream · $5.25
              </div>

              <button
                onClick={(e) => { e.stopPropagation(); addToBag({ id: 'sour-cream', name: 'Sour Cream', price: 5.25 }); }}
                className="absolute bottom-4 left-1/2 -translate-x-1/2
                           opacity-0 group-hover:opacity-100 transition-all duration-200
                           bg-black text-white text-xs font-semibold
                           px-4 py-2 rounded-full shadow-xl
                           flex items-center gap-1.5 hover:bg-neutral-800 active:scale-95"
                aria-label="Add Signature Cold Brew to bag"
              >
                <Plus size={13} /> Add to bag
              </button>
            </motion.div>

            {/* RIGHT CUP — iced latte */}
            <motion.div
              initial={{ x: '80vw', opacity: 0, rotate: 35, scale: 0.7 }}
              animate={{ x: 0, opacity: 1, rotate: 14, scale: 1 }}
              transition={{
                type: 'spring',
                stiffness: 26,
                damping: 24,
                mass: 1.7,
                delay: 0.5,
              }}
              whileHover={{ rotate: 10, y: -14, scale: 1.05 }}
              className="relative cursor-pointer group z-30
                         -ml-10 sm:-ml-14 md:-ml-16 lg:-ml-20 xl:-ml-24"
              style={{
                transformStyle: 'preserve-3d',
                perspective: '1200px',
              }}
              onClick={() => { playIceChime(); setMenuOpen(true); }}
            >
              <div className="animate-subtle-float-delayed">
                <Img
                  primary={ICED_LATTE_URL}
                  fallback={LOCAL_ICED_LATTE}
                  alt="Cottage Cheese"
                  loading="eager"
                  draggable={false}
                  className="w-[180px] sm:w-[240px] md:w-[300px] lg:w-[340px] xl:w-[380px]
                             max-w-none h-auto object-contain
                             filter drop-shadow-[0_45px_55px_rgba(0,0,0,0.34)]
                             transition-[filter] duration-300
                             group-hover:drop-shadow-[0_60px_75px_rgba(0,0,0,0.44)]"
                  style={{
                    imageRendering: 'crisp-edges',
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                  }}
                />
              </div>

              {/* Falling water droplets — iced latte tone */}
              <Droplets count={7} tone="light" />

              <div className="pointer-events-none absolute -top-4 left-1/2 -translate-x-1/2
                              opacity-0 group-hover:opacity-100 transition-opacity duration-200
                              bg-white/95 backdrop-blur-md text-neutral-900 text-xs font-bold
                              px-3 py-1.5 rounded-full shadow-lg border border-white/60 whitespace-nowrap">
                Cottage Cheese · $6.50
              </div>

              <button
                onClick={(e) => { e.stopPropagation(); addToBag({ id: 'Cottage Cheese', name: 'Cottage Cheese', price: 6.50 }); }}
                className="absolute bottom-4 left-1/2 -translate-x-1/2
                           opacity-0 group-hover:opacity-100 transition-all duration-200
                           bg-black text-white text-xs font-semibold
                           px-4 py-2 rounded-full shadow-xl
                           flex items-center gap-1.5 hover:bg-neutral-800 active:scale-95"
                aria-label="Add Cottage Cheese to bag"
              >
                <Plus size={13} /> Add to bag
              </button>
            </motion.div>

          </div>
        </div>

        {/* ---------- 5. BOTTOM TEXT + CTA ---------- */}
        
      </div>

      {/* ============================================================ */}
      {/*  FAN FAVORITES                                               */}
      {/* ============================================================ */}
      <section className="relative z-30 w-full bg-white text-neutral-950 py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-neutral-950 leading-[1.08]">
              The fan favorites,
              <br />
              best served cold
            </h2>

            <button
              onClick={() => setMenuOpen(true)}
              className="self-start md:self-end px-7 py-3 rounded-full border border-neutral-300 text-neutral-900 text-sm font-semibold hover:bg-neutral-950 hover:text-white hover:border-neutral-950 transition-all duration-200 cursor-pointer"
            >
              See all products
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {CAN_PRODUCTS.map((prod) => (
              <div
                key={prod.id}
                style={{ backgroundColor: prod.bgHex }}
                className="rounded-[32px] sm:rounded-[36px] overflow-hidden p-8 sm:p-10 lg:p-12
                           flex flex-col justify-between min-h-[580px] sm:min-h-[620px] lg:min-h-[660px]
                           relative transition-shadow duration-300 hover:shadow-xl group"
              >
                <div className="relative z-10">
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 tracking-tight">
                    {prod.name}
                  </h3>
                  <p className="mt-3 text-neutral-700 text-sm sm:text-base leading-relaxed max-w-sm">
                    {prod.description}
                  </p>

                  <div className="mt-6 flex items-center gap-3">
                    <button
                      onClick={() => addToBag({ id: prod.id, name: prod.name, price: prod.priceNum })}
                      className="inline-flex items-center gap-1.5 bg-black text-white px-6 py-2.5 rounded-full
                                 text-xs sm:text-sm font-medium hover:bg-neutral-800 transition-colors
                                 shadow-sm cursor-pointer active:scale-95"
                    >
                      <Plus size={14} /> Add · {prod.price}
                    </button>

                    <button
                      onClick={() => { playIceChime(); setStoresOpen(true); }}
                      className="text-xs sm:text-sm font-medium text-neutral-800 hover:text-neutral-950
                                 underline underline-offset-4 transition-colors"
                    >
                      Find a store
                    </button>
                  </div>
                </div>

                <div className="relative z-0 mt-8 flex justify-center items-end flex-1 overflow-hidden pt-4">
                  <motion.div
                    initial={{ y: 55, scale: 0.90, opacity: 0.85 }}
                    whileInView={{ y: 0, scale: 1, opacity: 1 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                    whileHover={{ scale: 1.06, y: -8, transition: { duration: 0.3, ease: 'easeOut' } }}
                    className="flex justify-center items-end"
                                      >
                    <Img
                      primary={prod.primaryUrl}
                      fallback={prod.localFallback}
                      alt={prod.canAlt}
                      className="h-[340px] sm:h-[400px] md:h-[430px] lg:h-[460px] w-auto object-contain
                                 filter drop-shadow-[0_24px_32px_rgba(0,0,0,0.18)]
                                 select-none cursor-pointer"
                      loading="lazy"
                      onClick={() => { playIceChime(); setMenuOpen(true); }}
                    />
                  </motion.div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

            {/* ============================================================ */}
      {/*  PREMIUM PRODUCT GRID — 4 ACROSS                             */}
      {/* ============================================================ */}
      <section className="relative z-30 w-full bg-white text-neutral-950 py-20 sm:py-2">
        <div className="w-full max-w-[1500px] mx-auto px-6 sm:px-10 lg:px-14">

          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14 sm:mb-20">
            <div>
              <motion.span
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="text-xs uppercase tracking-[0.2em] text-neutral-500 font-bold block mb-4"
              >
                Shop the range
              </motion.span>

              <motion.h2
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight
                           text-neutral-950 leading-[1.05] max-w-2xl"
              >
                Real dairy.
                <br />
                Made for real life.
              </motion.h2>
            </div>

            <motion.button
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ scale: 1.04, backgroundColor: '#000', color: '#fff' }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setMenuOpen(true)}
              className="self-start md:self-end
                         px-7 py-3 rounded-full
                         border border-neutral-300
                         text-neutral-900 text-sm font-semibold
                         transition-colors duration-200
                         cursor-pointer whitespace-nowrap"
            >
              See all products
            </motion.button>
          </div>

          {/* 4-across Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
            {CAN_PRODUCTS.map((prod, i) => (
              <motion.article
                key={prod.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: 0.8,
                  delay: i * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{ y: -8 }}
                className="group relative rounded-[28px] overflow-hidden
                           flex flex-col
                           transition-shadow duration-500
                           hover:shadow-[0_30px_60px_-20px_rgba(0,0,0,0.22)]"
                style={{ backgroundColor: prod.bgHex }}
              >

                {/* Top badge */}
                <div className="absolute top-5 left-5 z-20 flex items-center gap-1.5
                                bg-white/85 backdrop-blur-md
                                px-3 py-1.5 rounded-full
                                shadow-sm border border-white/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-800">
                    In stock
                  </span>
                </div>

                {/* Quick-add pill — top right, shows on hover */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToBag({ id: prod.id, name: prod.name, price: prod.priceNum });
                  }}
                  aria-label={`Add ${prod.name} to bag`}
                  className="absolute top-5 right-5 z-20
                             w-9 h-9 rounded-full
                             bg-black text-white
                             flex items-center justify-center
                             shadow-lg
                             opacity-0 scale-90 translate-y-1
                             group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0
                             transition-all duration-300
                             hover:bg-neutral-800 active:scale-90"
                >
                  <Plus size={15} />
                </button>

                {/* Product image area */}
                <div className="relative pt-16 px-6 pb-4 flex items-center justify-center">
                  {/* Soft radial glow behind product */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                    style={{
                      background: 'radial-gradient(circle at 50% 55%, rgba(255,255,255,0.9) 0%, transparent 65%)',
                    }}
                  />

                  <motion.div
                    initial={{ y: 20, scale: 0.94 }}
                    whileInView={{ y: 0, scale: 1 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.9, delay: i * 0.08 + 0.2, ease: [0.22, 1, 0.36, 1] }}
                    className="relative z-10"
                  >
                    <Img
                      primary={prod.primaryUrl}
                      fallback={prod.localFallback}
                      alt={prod.canAlt}
                      loading="lazy"
                      draggable={false}
                      className="h-[200px] sm:h-[220px] lg:h-[240px]
                                 w-auto max-w-full object-contain
                                 filter drop-shadow-[0_24px_34px_rgba(0,0,0,0.18)]
                                 transition-transform duration-500
                                 group-hover:scale-[1.06] group-hover:-rotate-1"
                      style={{
                        imageRendering: 'crisp-edges',
                        backfaceVisibility: 'hidden',
                      }}
                    />
                  </motion.div>
                </div>

                {/* Info area */}
                <div className="relative z-10 px-6 pb-6 pt-3 flex flex-col flex-1">

                  <h3 className="text-[15px] sm:text-base font-extrabold text-neutral-950
                                 leading-snug tracking-tight">
                    {prod.name}
                  </h3>

                  <p className="mt-2 text-[12px] sm:text-[13px] text-neutral-700 leading-relaxed
                                line-clamp-2 min-h-[2.5rem]">
                    {prod.description}
                  </p>

                  {/* Price row + add to cart */}
                  <div className="mt-5 pt-4 border-t border-black/8 flex items-center justify-between">
                    <span className="text-lg font-extrabold text-neutral-950">
                      {prod.price}
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToBag({ id: prod.id, name: prod.name, price: prod.priceNum });
                      }}
                      className="flex items-center gap-1.5
                                 bg-black text-white
                                 pl-4 pr-3 py-2 rounded-full
                                 text-[11px] font-bold uppercase tracking-wider
                                 shadow-md
                                 hover:bg-neutral-800
                                 transition-all
                                 group-hover:pl-5 group-hover:pr-4
                                 active:scale-95"
                    >
                      Add
                      <Plus size={13} />
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

        </div>
      </section>
      {/*  PREMIUM SHOWCASE — white, animated                          */}
      {/* ============================================================ */}
      <div className="relative z-30 w-full bg-white text-neutral-950 overflow-hidden">

              {/* A + B COMBINED — Showcase card + Our Story side by side */}
        <section className="relative w-full pt-20 sm:pt-28 pb-16 sm:pb-20">
          <div className="max-w-[1500px] mx-auto px-6 sm:px-10 lg:px-14">

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">

              {/* LEFT — Showcase card with sky + product */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="lg:col-span-6 relative rounded-[32px] sm:rounded-[40px] overflow-hidden
                           shadow-[0_40px_80px_-20px_rgba(0,0,0,0.25)]
                           h-[420px] sm:h-[500px] lg:h-[620px]
                           flex items-center justify-center group"
              >
                <Img
                  primary={SKY_BG_URL}
                  fallback={LOCAL_SKY_BG}
                  alt="Blue sky background"
                  draggable={false}
                  className="absolute inset-0 w-full h-full object-cover object-center
                             pointer-events-none select-none
                             transition-transform duration-[2000ms] ease-out
                             group-hover:scale-[1.03]"
                  style={{
                    imageRendering: 'crisp-edges',
                    backfaceVisibility: 'hidden',
                  }}
                />

                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10 pointer-events-none" />

                <div
                  className="absolute -top-24 -right-24 w-[400px] h-[400px] rounded-full opacity-50 pointer-events-none"
                  style={{
                    background: 'radial-gradient(circle, rgba(255,240,200,0.55) 0%, rgba(255,220,150,0.15) 40%, transparent 70%)',
                    filter: 'blur(30px)',
                  }}
                />

                {/* Giant "kemps" wordmark behind product */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                  <motion.span
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
                    className="text-[26vw] sm:text-[22vw] lg:text-[11rem]
                               font-black tracking-tighter leading-none
                               text-white/40"
                  >
                    kemps
                  </motion.span>
                </div>

                {/* Product image */}
                <motion.div
                  initial={{ y: 60, opacity: 0, scale: 0.9 }}
                  whileInView={{ y: 0, opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ scale: 1.05, y: -12 }}
                  className="relative z-10 flex items-center justify-center cursor-pointer"
                  onClick={() => { playIceChime(); setMenuOpen(true); }}
                >
                  <div className="animate-subtle-float">
                  <Img
  primary={CAN_PROTEIN_3_URL}
  fallback={LOCAL_CAN_PROTEIN_3}
  alt="Kemps Protein+ Chocolate Lactose Free Milk"
  draggable={false}
  className="h-[280px] sm:h-[360px] lg:h-[240px]auto object-contain
             filter drop-shadow-[0_32px_48px_rgba(0,0,0,0.35)]
             select-none"
/>
                  </div>
                </motion.div>

                {/* Floating badge */}
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setMenuOpen(true)}
                  className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 z-20
                             bg-white/95 backdrop-blur-md
                             text-neutral-900 text-xs sm:text-sm font-bold
                             px-5 sm:px-6 py-2.5 sm:py-3 rounded-full
                             shadow-[0_10px_30px_rgba(0,0,0,0.15)]
                             hover:bg-white transition-colors
                             flex items-center gap-2 group/badge"
                >
                  <span>Explore the range</span>
                  <ArrowRight size={14} className="transition-transform group-hover/badge:translate-x-0.5" />
                </motion.button>
              </motion.div>

              {/* RIGHT — Our Story text + stats */}
              <div className="lg:col-span-6 lg:pl-4">
                <motion.span
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.6 }}
                  className="text-xs uppercase tracking-[0.2em] text-neutral-500 font-bold block mb-4"
                >
                  Our Story
                </motion.span>

                <motion.h2
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className="text-4xl sm:text-5xl md:text-6xl lg:text-[4rem] xl:text-[4.5rem]
                             font-extrabold tracking-[-0.03em] text-neutral-950
                             leading-[1.02]"
                >
                  Rooted in
                  <br />
                  family farms.
                </motion.h2>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  className="mt-7 space-y-4 text-neutral-600 text-sm sm:text-base leading-relaxed max-w-lg"
                >
                  <p>
                    For over 100 years, Kemps has been a family-owned dairy rooted in the Midwest.
                    We partner with local farmers who share our commitment to quality and care.
                  </p>
                  <p>
                    From farm to fridge, every drop is crafted with the same simple promise:
                    real dairy, done right.
                  </p>
                </motion.div>

                {/* Stats — now horizontal */}
                <div className="mt-10 grid grid-cols-3 gap-4 sm:gap-6">
                  <StatCounterWhite from={0} to={100} suffix="+" label="Years crafting dairy" compact />
                  <StatCounterWhite from={0} to={100} suffix="%" label="Family-owned since 1914" compact />
                  <StatCounterWhite from={0} to={13} suffix="g"  label="Protein per serving" compact />
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.7, delay: 0.4 }}
                  className="mt-10"
                >
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setStoryOpen(true)}
                    className="bg-neutral-950 text-white
                               px-7 sm:px-8 py-3.5 rounded-full
                               text-xs sm:text-sm font-bold
                               shadow-md transition-colors duration-300
                               cursor-pointer hover:bg-black
                               inline-flex items-center gap-2 group/btn"
                  >
                    <span>Discover our story</span>
                    <ArrowRight size={15} className="transition-transform group-hover/btn:translate-x-0.5" />
                  </motion.button>
                </motion.div>
              </div>

            </div>
          </div>
        </section>

              {/* C. VIDEO — cinematic redesign */}
        <section className="relative w-full py-16 sm:py-14bg-white">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12">

            {/* Section eyebrow + headline above the video */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10 sm:mb-14">
              <div>
                <motion.span
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.6 }}
                  className="text-xs uppercase tracking-[0.2em] text-neutral-500 font-bold block mb-3"
                >
                  Real Ingredients
                </motion.span>

                <motion.h3
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl
                             font-extrabold tracking-[-0.03em] text-neutral-950
                             leading-[1.05] max-w-3xl"
                >
                  From the farm.
                  <br />
                  To your family.
                </motion.h3>
              </div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="text-neutral-600 text-sm sm:text-base leading-relaxed max-w-sm sm:text-right"
              >
                Watch how we craft every drop with the same care families have trusted for generations.
              </motion.p>
            </div>

            {/* The cinematic video card */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="relative rounded-[32px] sm:rounded-[40px] overflow-hidden
                         shadow-[0_50px_100px_-30px_rgba(0,0,0,0.45)]
                         h-[460px] sm:h-[540px] md:h-[620px]
                         group cursor-pointer"
            >
              {/* Video layer */}
                                     <iframe
                src="https://www.youtube.com/embed/pt6jayiU1v0?autoplay=1&mute=1&loop=1&playlist=pt6jayiU1v0&controls=0&modestbranding=1&rel=0&playsinline=1"
                title="Kemps — It's the Cows"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full select-none pointer-events-none"
                style={{
                  border: 0,
                  transform: 'scale(1.35)',
                  transformOrigin: 'center center',
                }}
              />

              {/* Cinematic gradient — bottom darker for text, top subtle for depth */}
             

              {/* Warm sun glow top-right */}
              <div
                className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full
                           opacity-40 pointer-events-none"
                style={{
                  background: 'radial-gradient(circle, rgba(255,220,150,0.5) 0%, rgba(255,200,120,0.15) 40%, transparent 70%)',
                  filter: 'blur(40px)',
                }}
              />

              {/* Top-left badge */}
              <motion.div
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="absolute top-6 left-6 sm:top-8 sm:left-8 z-20
                           flex items-center gap-2
                           bg-white/15 backdrop-blur-md
                           border border-white/25
                           px-3.5 py-2 rounded-full"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.15em] text-white">
                  Behind the Scenes
                </span>
              </motion.div>

              {/* Top-right duration chip */}
              <motion.div
                initial={{ opacity: 0, x: 12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, delay: 0.4 }}
                className="absolute top-6 right-6 sm:top-8 sm:right-8 z-20
                           bg-black/40 backdrop-blur-md
                           border border-white/15
                           px-3 py-2 rounded-full"
              >
                <span className="text-[10px] sm:text-xs font-semibold text-white tabular-nums">
                  02:14
                </span>
              </motion.div>

              {/* Bottom content */}
              <div className="absolute inset-0 flex flex-col justify-end p-8 sm:p-12 md:p-16 z-10">

                <motion.span
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-white/70 font-bold block mb-4"
                >
                  Our Craft
                </motion.span>

                <motion.h4
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.9, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl
                             font-extrabold text-white tracking-tight
                             leading-[1.05] max-w-2xl drop-shadow-md"
                >
                  Watch how we
                  <br />
                  make it fresh.
                </motion.h4>

                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.7, delay: 0.7 }}
                  className="mt-4 text-white/80 text-sm sm:text-base leading-relaxed max-w-md hidden sm:block"
                >
                  Every batch starts with local farms and ends with the same promise we've kept for 100+ years.
                </motion.p>

                {/* Action row */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.7, delay: 0.85 }}
                  className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4"
                >
                  {/* Primary play button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setStoryOpen(true)}
                    className="bg-white text-neutral-900
                               pl-2 pr-6 py-2 rounded-full
                               text-xs sm:text-sm font-bold
                               shadow-xl transition-colors
                               hover:bg-neutral-100
                               cursor-pointer
                               inline-flex items-center gap-3 group/play"
                  >
                    {/* Play icon circle */}
                    <span className="w-9 h-9 rounded-full bg-neutral-950 text-white
                                     flex items-center justify-center
                                     transition-transform group-hover/play:scale-110">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                        <path d="M2 1.5v9l8.5-4.5L2 1.5z" />
                      </svg>
                    </span>
                    <span>Watch the film</span>
                  </motion.button>

                  {/* Secondary ghost button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setStoryOpen(true)}
                    className="bg-white/10 backdrop-blur-md
                               border border-white/25
                               text-white
                               px-6 py-3.5 rounded-full
                               text-xs sm:text-sm font-semibold
                               hover:bg-white/20 transition-colors
                               cursor-pointer
                               hidden sm:inline-flex items-center gap-2 group/learn"
                  >
                    <span>Learn more</span>
                    <ArrowRight size={14} className="transition-transform group-hover/learn:translate-x-0.5" />
                  </motion.button>
                </motion.div>
              </div>

              {/* Bottom-right watch time badge */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, delay: 1 }}
                className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 z-20
                           hidden md:flex items-center gap-2
                           bg-white/10 backdrop-blur-md
                           border border-white/20
                           px-3.5 py-2 rounded-full"
              >
                <Clock size={12} className="text-white/80" />
                <span className="text-[10px] font-semibold text-white/90 uppercase tracking-wider">
                  2 min watch
                </span>
              </motion.div>

            </motion.div>

          </div>
        </section>

                {/* E. INSTAGRAM CAROUSEL — infinite loop */}
        <section className="relative w-full py-20 sm:py-28 bg-white overflow-hidden">
          <div className="max-w-[1500px] mx-auto px-6 sm:px-10 lg:px-14">

            {/* Header row */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12 sm:mb-16">
              <div>
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.6 }}
                  className="flex items-center gap-2 mb-4"
                >
                  <span className="w-8 h-8 rounded-full bg-gradient-to-br
                                   from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]
                                   flex items-center justify-center text-white shadow-md">
                    <Instagram size={16} />
                  </span>
                  <span className="text-xs uppercase tracking-[0.2em] text-neutral-500 font-bold">
                    @kempsdairy
                  </span>
                </motion.div>

                <motion.h3
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl
                             font-extrabold tracking-[-0.03em] text-neutral-950
                             leading-[1.05] max-w-3xl"
                >
                  Fresh from
                  <br />
                  the farm feed.
                </motion.h3>
              </div>

              <motion.a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="self-start sm:self-end
                           inline-flex items-center gap-2
                           px-6 py-3 rounded-full
                           bg-neutral-950 text-white
                           text-xs sm:text-sm font-bold
                           shadow-md hover:bg-black transition-colors
                           cursor-pointer group/ig"
              >
                <Instagram size={15} />
                <span>Follow us</span>
                <ArrowRight size={14} className="transition-transform group-hover/ig:translate-x-0.5" />
              </motion.a>
            </div>

            {/* Infinite loop marquee — no edge fades */}
            <div className="relative w-full">
              <motion.div
                className="flex gap-4 sm:gap-5 w-max"
                animate={{ x: ['0%', '-50%'] }}
                transition={{
                  duration: 40,
                  ease: 'linear',
                  repeat: Infinity,
                  repeatType: 'loop',
                }}
              >
                {[
                  { img: CAN_PROTEIN_WHOLE_URL, fallback: LOCAL_CAN_PROTEIN_WHOLE, caption: 'Protein+ hits different 🥛', bg: '#f6e3d4' },
                  { img: CAN_PROTEIN_2_URL,     fallback: LOCAL_CAN_PROTEIN_2,     caption: 'Fuel for the day ahead.',      bg: '#e3efe0' },
                  { img: CAN_PROTEIN_3_URL,     fallback: LOCAL_CAN_PROTEIN_3,     caption: 'Made with real care.',         bg: '#f0dcc8' },
                  { img: CAN_BLUEBERRY_URL,     fallback: LOCAL_CAN_BLUEBERRY,     caption: 'Blueberry season, all year.',  bg: '#fef4cd' },
                  { img: CAN_STRAWBERRY_URL,    fallback: LOCAL_CAN_STRAWBERRY,    caption: 'Berry good mornings.',         bg: '#fde1e3' },
                  // duplicated for seamless loop
                  { img: CAN_PROTEIN_WHOLE_URL, fallback: LOCAL_CAN_PROTEIN_WHOLE, caption: 'Protein+ hits different 🥛', bg: '#f6e3d4' },
                  { img: CAN_PROTEIN_2_URL,     fallback: LOCAL_CAN_PROTEIN_2,     caption: 'Fuel for the day ahead.',      bg: '#e3efe0' },
                  { img: CAN_PROTEIN_3_URL,     fallback: LOCAL_CAN_PROTEIN_3,     caption: 'Made with real care.',         bg: '#f0dcc8' },
                  { img: CAN_BLUEBERRY_URL,     fallback: LOCAL_CAN_BLUEBERRY,     caption: 'Blueberry season, all year.',  bg: '#fef4cd' },
                  { img: CAN_STRAWBERRY_URL,    fallback: LOCAL_CAN_STRAWBERRY,    caption: 'Berry good mornings.',         bg: '#fde1e3' },
                ].map((post, i) => (
                  <a
                    key={i}
                    href="https://instagram.com"
                    target="_blank"
                    rel="noreferrer"
                    className="group flex-shrink-0 w-[200px] sm:w-[220px] lg:w-[240px]
                               rounded-[24px] overflow-hidden
                               shadow-[0_15px_30px_-15px_rgba(0,0,0,0.15)]
                               hover:shadow-[0_25px_50px_-15px_rgba(0,0,0,0.25)]
                               transition-all duration-500
                               hover:-translate-y-2
                               cursor-pointer
                               relative"
                    style={{ backgroundColor: post.bg }}
                  >
                    {/* Image area */}
                    <div className="relative aspect-square flex items-center justify-center
                                    p-6 overflow-hidden">

                      {/* Instagram corner icon */}
                      <div className="absolute top-3 right-3 z-20
                                      w-7 h-7 rounded-full
                                      bg-white/90 backdrop-blur-md
                                      flex items-center justify-center
                                      text-neutral-800
                                      shadow-sm
                                      opacity-0 scale-90
                                      group-hover:opacity-100 group-hover:scale-100
                                      transition-all duration-300">
                        <Instagram size={12} />
                      </div>

                      {/* Product image */}
                      <div className="relative z-10">
                        <Img
                          primary={post.img}
                          fallback={post.fallback}
                          alt={post.caption}
                          draggable={false}
                          loading="lazy"
                          className="h-[130px] sm:h-[150px] lg:h-[165px]
                                     w-auto max-w-full object-contain
                                     filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.16)]
                                     transition-transform duration-500
                                     group-hover:scale-[1.08] group-hover:-rotate-1"
                          style={{
                            imageRendering: 'crisp-edges',
                            backfaceVisibility: 'hidden',
                          }}
                        />
                      </div>
                    </div>

                    {/* Bottom caption bar */}
                    <div className="px-3.5 py-3 bg-white/70 backdrop-blur-md
                                    border-t border-black/5
                                    flex items-center justify-between gap-2">
                      <p className="text-[11px] sm:text-xs font-semibold text-neutral-800 truncate">
                        {post.caption}
                      </p>
                      <span className="text-[9px] font-bold uppercase tracking-wider
                                       text-neutral-500 flex-shrink-0">
                        View
                      </span>
                    </div>
                  </a>
                ))}
              </motion.div>
            </div>

          </div>
        </section>

              {/* D. FOOTER — premium redesign */}
        <footer className="relative w-full bg-[#0b0b0d] text-white overflow-hidden">

          {/* Top gold accent bar */}
          <div className="h-px w-full bg-gradient-to-r from-transparent via-[#c69233] to-transparent" />

          {/* Soft gold ambient glow top-right */}
          <div
            className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full
                       opacity-30 pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(198,146,51,0.5) 0%, rgba(198,146,51,0.15) 35%, transparent 70%)',
              filter: 'blur(60px)',
            }}
          />

          {/* Soft gold ambient glow bottom-left */}
          <div
            className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full
                       opacity-20 pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(198,146,51,0.4) 0%, transparent 60%)',
              filter: 'blur(60px)',
            }}
          />

          <div className="relative max-w-[1500px] mx-auto px-6 sm:px-10 lg:px-14 pt-20 sm:pt-28 pb-10">

            {/* ---------- TOP: newsletter + links ---------- */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 pb-20">

              {/* LEFT — headline + newsletter */}
              <div className="lg:col-span-5">

                {/* Small gold badge */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.6 }}
                  className="inline-flex items-center gap-2 mb-6
                             px-3.5 py-1.5 rounded-full
                             border border-[#c69233]/40
                             bg-[#c69233]/10"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#c69233] animate-pulse" />
                  <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#e0b866]">
                    Newsletter
                  </span>
                </motion.div>

                <motion.h4
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className="text-3xl sm:text-4xl md:text-5xl font-extrabold
                             tracking-[-0.03em] leading-[1.05] max-w-md"
                >
                  Real dairy,
                  <br />
                  delivered to
                  <br />
                  <span className="text-[#c69233]">your inbox.</span>
                </motion.h4>

                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                  className="mt-6 text-sm sm:text-base text-white/60 leading-relaxed max-w-sm"
                >
                  Be the first to know about new products, recipes, and stories from the farm.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.7, delay: 0.3 }}
                  className="mt-8 max-w-md"
                >
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (newsletterEmail) {
                        setNewsletterSubscribed(true);
                        setTimeout(() => setNewsletterSubscribed(false), 4000);
                        setNewsletterEmail('');
                      }
                    }}
                    className="flex items-center gap-2 p-1.5 rounded-full
                               bg-white/5 border border-white/10
                               focus-within:border-[#c69233]/50
                               transition-colors"
                  >
                    <input
                      type="email"
                      required
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      placeholder="name@email.com"
                      className="flex-1 bg-transparent
                                 px-5 py-2.5 text-xs sm:text-sm text-white
                                 placeholder:text-white/40
                                 focus:outline-none"
                    />
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      className="bg-[#c69233] text-black
                                 px-5 sm:px-6 py-2.5 rounded-full
                                 text-xs sm:text-sm font-bold
                                 shadow-lg hover:bg-[#d9a441]
                                 transition-colors
                                 cursor-pointer whitespace-nowrap"
                    >
                      Sign up
                    </motion.button>
                  </form>

                  <AnimatePresence>
                    {newsletterSubscribed && (
                      <motion.p
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        className="mt-3 text-xs text-[#c69233] flex items-center gap-1.5 font-medium"
                      >
                        <Check size={13} />
                        <span>Welcome to the Kemps club. You're on the list.</span>
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>

              {/* RIGHT — links grid */}
              <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-10 sm:gap-8 lg:pl-8 lg:border-l lg:border-white/10">

                {/* Products */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.7, delay: 0.1 }}
                >
                  <h5 className="text-[11px] font-bold text-[#c69233] mb-5 uppercase tracking-[0.2em]">
                    Products
                  </h5>
                  <ul className="space-y-3 text-xs sm:text-sm text-white/60 font-medium">
                    {[
                      'Protein+ Whole Lactose Free',
                      'Protein+ 2% Reduced Fat',
                      'Blueberry Nonfat Yogurt',
                      'Strawberry Nonfat Yogurt',
                    ].map(label => (
                      <li key={label}>
                        <button
                          onClick={() => setMenuOpen(true)}
                          className="group/link inline-flex items-center gap-1.5
                                     hover:text-white transition-colors
                                     cursor-pointer text-left"
                        >
                          <span className="w-0 h-px bg-[#c69233] transition-all duration-300
                                           group-hover/link:w-3" />
                          <span>{label}</span>
                        </button>
                      </li>
                    ))}
                    <li>
                      <button
                        onClick={() => setStoresOpen(true)}
                        className="group/link inline-flex items-center gap-1.5
                                   hover:text-white transition-colors
                                   cursor-pointer text-left"
                      >
                        <span className="w-0 h-px bg-[#c69233] transition-all duration-300
                                         group-hover/link:w-3" />
                        <span>Where to Buy</span>
                      </button>
                    </li>
                  </ul>
                </motion.div>

                {/* Company */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                >
                  <h5 className="text-[11px] font-bold text-[#c69233] mb-5 uppercase tracking-[0.2em]">
                    Company
                  </h5>
                  <ul className="space-y-3 text-xs sm:text-sm text-white/60 font-medium">
                    {[
                      { label: 'Our story',      fn: () => setStoryOpen(true) },
                      { label: 'Farmers',        fn: () => setStoryOpen(true) },
                      { label: 'Sustainability', fn: () => setFairTradeOpen(true) },
                      { label: 'Recipes',        fn: () => setMenuOpen(true) },
                      { label: 'Contact',        fn: () => setStoresOpen(true) },
                    ].map(item => (
                      <li key={item.label}>
                        <button
                          onClick={item.fn}
                          className="group/link inline-flex items-center gap-1.5
                                     hover:text-white transition-colors
                                     cursor-pointer text-left"
                        >
                          <span className="w-0 h-px bg-[#c69233] transition-all duration-300
                                           group-hover/link:w-3" />
                          <span>{item.label}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </motion.div>

                {/* Follow */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.7, delay: 0.3 }}
                  className="col-span-2 sm:col-span-1"
                >
                  <h5 className="text-[11px] font-bold text-[#c69233] mb-5 uppercase tracking-[0.2em]">
                    Follow
                  </h5>
                  <div className="flex items-center gap-3">
                    {[
                      { href: 'https://instagram.com', icon: <Instagram size={15} />, title: 'Instagram' },
                      { href: 'https://tiktok.com',     icon: <span className="font-bold text-sm leading-none">♪</span>, title: 'TikTok' },
                      { href: 'https://facebook.com',   icon: <Facebook size={15} />, title: 'Facebook' },
                    ].map(social => (
                      <motion.a
                        key={social.title}
                        href={social.href}
                        target="_blank"
                        rel="noreferrer"
                        title={social.title}
                        aria-label={social.title}
                        whileHover={{ scale: 1.12, y: -3 }}
                        whileTap={{ scale: 0.94 }}
                        className="w-10 h-10 rounded-full
                                   bg-white/5 border border-white/10
                                   flex items-center justify-center
                                   text-white/70
                                   hover:bg-[#c69233] hover:text-black hover:border-[#c69233]
                                   transition-colors shadow-sm"
                      >
                        {social.icon}
                      </motion.a>
                    ))}
                  </div>

                  {/* Supporting line under socials */}
                  <p className="mt-6 text-[11px] text-white/40 leading-relaxed max-w-[180px]">
                    Follow along for fresh recipes, new products, and behind-the-scenes farm stories.
                  </p>
                </motion.div>

              </div>
            </div>

            {/* ---------- GIANT WORDMARK ---------- */}
            <div className="relative w-full text-center overflow-hidden pointer-events-none select-none pt-8 sm:pt-12 -mb-6 sm:-mb-12">
              {/* Subtle gold gradient behind the wordmark */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'radial-gradient(ellipse at center, rgba(198,146,51,0.15) 0%, transparent 60%)',
                }}
              />
              <motion.span
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
                className="relative block text-[24vw] sm:text-[26vw]
                           font-black tracking-tighter leading-none
                           bg-gradient-to-b from-white via-white/90 to-white/40
                           bg-clip-text text-transparent"
              >
                kemps
              </motion.span>
            </div>

            {/* ---------- BOTTOM ROW ---------- */}
            <div className="relative pt-8 border-t border-white/10
                            flex flex-col sm:flex-row items-start sm:items-center
                            justify-between gap-4
                            text-xs text-white/40 font-medium">
              <span>© 2026 Kemps Dairy. All rights reserved.</span>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                <button
                  onClick={() => setStoryOpen(true)}
                  className="hover:text-[#c69233] transition-colors cursor-pointer"
                >
                  Privacy
                </button>
                <button
                  onClick={() => setStoryOpen(true)}
                  className="hover:text-[#c69233] transition-colors cursor-pointer"
                >
                  Terms
                </button>
                <button
                  onClick={() => setStoresOpen(true)}
                  className="hover:text-[#c69233] transition-colors cursor-pointer"
                >
                  Accessibility
                </button>
                <span className="hidden sm:inline text-white/30">Family Owned • Real Dairy</span>
              </div>
            </div>

          </div>
        </footer>

      </div>

      {/* ============================================================ */}
      {/*  MODAL 1: MENU DRAWER (now a REAL cart)                      */}
      {/* ============================================================ */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 260, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-white h-full shadow-2xl overflow-y-auto flex flex-col p-6 sm:p-8"
              role="dialog"
              aria-label="Menu and bag"
            >
              <div className="flex items-center justify-between pb-5 border-b border-neutral-100">
                <div>
                  <span className="text-xs uppercase tracking-wider font-bold text-neutral-500">
                    KEMPS
                  </span>
                  <h2 className="text-2xl font-bold text-neutral-900">Craft Cold Drink Menu</h2>
                </div>
                <button
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close menu"
                  className="w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200
                             flex items-center justify-center text-neutral-600 transition"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="mt-6 flex flex-col gap-4">
                {MENU_ITEMS.map((item) => (
                  <div key={item.id}
                       className="p-4 rounded-2xl border border-neutral-100 bg-neutral-50/60
                                  hover:bg-neutral-50 hover:border-neutral-200 transition-all
                                  flex gap-4 items-center">
                    <Img
                      primary={item.image}
                      fallback={LOCAL_DARK_COFFEE}
                      alt={item.name}
                      className="w-16 h-20 object-contain drop-shadow-sm flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-bold text-neutral-900 text-sm sm:text-base truncate">
                          {item.name}
                        </h3>
                        <span className="font-bold text-neutral-900 text-sm">{item.price}</span>
                      </div>
                      <p className="text-xs text-neutral-600 mt-1 line-clamp-2">{item.description}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {item.notes.map((note, idx) => (
                          <span key={idx}
                                className="text-[10px] bg-white px-2 py-0.5 rounded-md
                                           border border-neutral-200 font-medium text-neutral-700">
                            {note}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() => addToBag({ id: item.id, name: item.name, price: item.priceNum })}
                      className="w-8 h-8 rounded-full bg-black text-white hover:bg-neutral-800
                                 flex items-center justify-center flex-shrink-0 transition active:scale-95"
                      aria-label={`Add ${item.name} to bag`}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Cart summary */}
              <div className="pt-6 border-t border-neutral-100 mt-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-neutral-600">Items in bag</span>
                  <span className="font-bold text-neutral-900">{cart.count}</span>
                </div>

                <AnimatePresence>
                  {cart.lines.length > 0 && (
                    <motion.ul
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-2 mb-4 max-h-48 overflow-y-auto pr-1"
                    >
                      {cart.lines.map(line => (
                        <li key={line.id}
                            className="flex items-center justify-between text-sm py-1.5
                                       border-b border-neutral-100 last:border-0">
                          <span className="text-neutral-800 truncate pr-2">
                            {line.name} <span className="text-neutral-400">× {line.qty}</span>
                          </span>
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            <span className="font-medium text-neutral-900">
                              ${(line.price * line.qty).toFixed(2)}
                            </span>
                            <button
                              onClick={() => cart.remove(line.id)}
                              aria-label={`Remove ${line.name}`}
                              className="w-6 h-6 rounded-full hover:bg-red-50 text-neutral-400
                                         hover:text-red-500 flex items-center justify-center transition"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>

                {cart.count > 0 && (
                  <div className="flex items-center justify-between mb-4 text-sm">
                    <span className="text-neutral-600">Subtotal</span>
                    <span className="font-bold text-neutral-900">
                      ${cart.subtotal.toFixed(2)}
                    </span>
                  </div>
                )}

                <button
                  onClick={() => {
                    if (cart.count === 0) {
                      showToast('Add a drink to your order first');
                      return;
                    }
                    showToast('Order placed — freshly preparing your cold brew!');
                    cart.clear();
                    setMenuOpen(false);
                  }}
                  className="w-full bg-black text-white py-3.5 rounded-full font-semibold text-sm
                             hover:bg-neutral-800 transition active:scale-95 shadow-md
                             flex items-center justify-center gap-2"
                >
                  <ShoppingBag size={16} />
                  <span>
                    {cart.count > 0 ? `Checkout · $${cart.subtotal.toFixed(2)}` : 'Start Machi Order'}
                  </span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============================================================ */}
      {/*  MODAL 2: STORES                                             */}
      {/* ============================================================ */}
      <AnimatePresence>
        {storesOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4
                       bg-black/40 backdrop-blur-sm"
            onClick={() => setStoresOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 320, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl relative"
              role="dialog"
              aria-label="Store locator"
            >
              <button
                onClick={() => setStoresOpen(false)}
                aria-label="Close store locator"
                className="absolute top-5 right-5 w-9 h-9 rounded-full bg-neutral-100
                           hover:bg-neutral-200 flex items-center justify-center
                           text-neutral-600 transition"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-2.5">
                <MapPin size={22} className="text-amber-600" />
                <h2 className="text-xl sm:text-2xl font-bold text-neutral-900">
                  Machi Café Locations
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-neutral-600 mt-1">
                Find fresh cold brew and handcrafted drinks near you.
              </p>

              <div className="mt-5 space-y-3 max-h-[360px] overflow-y-auto pr-1">
                {STORES.map((store, i) => (
                  <div key={i}
                       className="p-4 rounded-2xl border border-neutral-200/80
                                  hover:border-black/30 hover:bg-neutral-50/80
                                  transition flex items-center justify-between">
                    <div>
                      <div className="font-bold text-neutral-900 text-sm">{store.city}</div>
                      <div className="text-xs text-neutral-600 mt-0.5">{store.address}</div>
                      <div className="text-[11px] font-medium text-emerald-700 mt-1 flex items-center gap-1">
                        <Clock size={12} />
                        <span>{store.status}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold text-neutral-500 block">
                        {store.distance}
                      </span>
                      <button
                        onClick={() => showToast(`Directions to ${store.city} sent!`)}
                        className="mt-2 text-xs font-semibold text-black underline hover:no-underline"
                      >
                        Directions
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
                <span>Looking for nationwide delivery?</span>
                <button
                  onClick={() => { setStoresOpen(false); setMenuOpen(true); }}
                  className="font-bold text-black hover:underline"
                >
                  Order bottled brew
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============================================================ */}
      {/*  MODAL 3: STORY                                              */}
      {/* ============================================================ */}
      <AnimatePresence>
        {storyOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4
                       bg-black/40 backdrop-blur-sm"
            onClick={() => setStoryOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 320, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl relative"
              role="dialog"
              aria-label="Our story"
            >
              <button
                onClick={() => setStoryOpen(false)}
                aria-label="Close story"
                className="absolute top-5 right-5 w-9 h-9 rounded-full bg-neutral-100
                           hover:bg-neutral-200 flex items-center justify-center
                           text-neutral-600 transition"
              >
                <X size={18} />
              </button>

              <span className="text-xs uppercase tracking-wider font-bold text-amber-700">
                Small-batch craft
              </span>
              <h2 className="text-2xl font-bold text-neutral-900 mt-1">The Machi Philosophy</h2>

              <div className="mt-4 text-sm text-neutral-700 space-y-3 leading-relaxed">
                <p>
                  Machi was founded with a straightforward belief: great iced coffee shouldn't just
                  be hot coffee poured over melting ice. It deserves its own deliberate craft.
                </p>
                <p>
                  Every batch of Machi cold brew undergoes a patient 24-hour slow extraction in
                  refrigerated stainless steel kettles. This protects the delicate floral aromatics
                  while eliminating bitter tannins.
                </p>
                <p>
                  Poured over crystalline dense ice cubes, it delivers a punch of rich dark chocolate,
                  roasted hazelnut, and an ultra-silky mouthfeel.
                </p>
              </div>

              <div className="mt-6 p-4 rounded-2xl bg-amber-50 border border-amber-100 flex items-center gap-3">
                <Coffee className="text-amber-800 flex-shrink-0" size={24} />
                <div className="text-xs text-amber-900 font-medium">
                  100% Arabica shade-grown beans roasted in Kyoto and San Francisco weekly.
                </div>
              </div>

              <button
                onClick={() => setStoryOpen(false)}
                className="mt-6 w-full bg-black text-white py-3 rounded-full
                           text-xs font-semibold hover:bg-neutral-900 transition"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============================================================ */}
      {/*  MODAL 4: FAIR TRADE                                         */}
      {/* ============================================================ */}
      <AnimatePresence>
        {fairTradeOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4
                       bg-black/40 backdrop-blur-sm"
            onClick={() => setFairTradeOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 320, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl relative"
              role="dialog"
              aria-label="Fair trade"
            >
              <button
                onClick={() => setFairTradeOpen(false)}
                aria-label="Close fair trade"
                className="absolute top-5 right-5 w-9 h-9 rounded-full bg-neutral-100
                           hover:bg-neutral-200 flex items-center justify-center
                           text-neutral-600 transition"
              >
                <X size={18} />
              </button>

              <span className="text-xs uppercase tracking-wider font-bold text-emerald-600">
                Ethical Sourcing
              </span>
              <h2 className="text-2xl font-bold text-neutral-900 mt-1">
                100% Certified Fair Trade
              </h2>

              <div className="mt-4 text-sm text-neutral-700 space-y-3 leading-relaxed">
                <p>
                  We believe that every extraordinary sip starts at the origin. Machi partners
                  directly with regenerative smallholder farms in Colombia, Ethiopia, and Guatemala.
                </p>
                <div className="space-y-2 mt-3">
                  {[
                    'Guaranteed 40% premium above standard commodity market rates.',
                    'Zero chemical pesticides, shade canopy preservation for native birds.',
                    'Community water filtration and solar drying infrastructure grants.',
                  ].map(t => (
                    <div key={t} className="flex items-start gap-2.5">
                      <Check size={16} className="text-emerald-600 mt-0.5 flex-shrink-0" />
                      <span className="text-xs">{t}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setFairTradeOpen(false)}
                className="mt-6 w-full bg-black text-white py-3 rounded-full
                           text-xs font-semibold hover:bg-neutral-900 transition"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============================================================ */}
      {/*  TOAST                                                       */}
      {/* ============================================================ */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 320, damping: 24 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60]
                       bg-neutral-900 text-white text-sm font-medium
                       px-5 py-3 rounded-full shadow-2xl
                       flex items-center gap-2"
            role="status"
            aria-live="polite"
          >
            <Check size={14} className="text-emerald-400" />
            <span>{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}