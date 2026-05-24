"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
// استيراد LazyMotion و domAnimation و المكون الخفيف m بدلاً من استيراد motion العادي
import { 
  LazyMotion, 
  domAnimation, 
  m, 
  useInView, 
  AnimatePresence, 
  useScroll, 
  useTransform 
} from "framer-motion";
import {
  Phone, PhoneCall, ArrowUpRight, ShieldCheck, BadgeCheck, Zap,
  CheckCircle, Star, UserCheck, Droplets, Flame, Waves, Home,
  AlertTriangle, Settings, Award, Leaf, Users
} from "lucide-react";

const C = "#C87941";
const CL = "#E8965A";

const glass: React.CSSProperties = {
  background: "rgba(255,255,255,0.03)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  border: "1px solid rgba(255,255,255,0.08)",
  boxShadow: "inset 0 1px 1px rgba(255,255,255,0.06)",
};

const glassCopper: React.CSSProperties = {
  background: "rgba(200,121,65,0.12)",
  backdropFilter: "blur(40px)",
  WebkitBackdropFilter: "blur(40px)",
  border: "1px solid rgba(200,121,65,0.25)",
  boxShadow: "0 4px 24px rgba(200,121,65,0.15),inset 0 1px 1px rgba(255,200,140,0.2)",
};

const glassStrong: React.CSSProperties = {
  background: "rgba(255,255,255,0.04)",
  backdropFilter: "blur(60px)",
  WebkitBackdropFilter: "blur(60px)",
  border: "1px solid rgba(255,255,255,0.10)",
  boxShadow: "0 4px 4px rgba(0,0,0,0.3),inset 0 1px 1px rgba(255,255,255,0.12)",
};

const serif = "var(--font-playfair), serif";
const sans = "var(--font-dm-sans), sans-serif";

/* ─── useWindowWidth Hook (Hydration-Safe) ─── */
function useWindowWidth(): number {
  const [w, setW] = useState<number>(1200);
  useEffect(() => {
    setW(window.innerWidth);
    const h = () => setW(window.innerWidth);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return w;
}

/* ─── 1. GRAIN TEXTURE OVERLAY ─── */
function GrainOverlay() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed", inset: 0, zIndex: 9999, pointerEvents: "none",
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
        opacity: 0.032,
      }}
    />
  );
}

/* ─── 2. MAGNETIC BUTTON (Optimized against Layout Thrashing) ─── */
interface MagneticBtnProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  ariaLabel?: string;
}

function MagneticBtn({ children, style, onClick, ariaLabel }: MagneticBtnProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const rectRef = useRef<DOMRect | null>(null);

  const handleMouseEnter = () => {
    if (ref.current) {
      rectRef.current = ref.current.getBoundingClientRect(); // قراءة واحدة فقط عند دخول الماوس لمنع الـ Reflow الإجباري
    }
  };

  const handleMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current || !rectRef.current) return;
    const rect = rectRef.current;
    const x = (e.clientX - rect.left - rect.width / 2) * 0.38;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.38;
    ref.current.style.transform = `translate(${x}px, ${y}px)`;
  };

  const handleLeave = () => {
    rectRef.current = null;
    if (!ref.current) return;
    ref.current.style.transform = "translate(0, 0)";
  };

  return (
    <button
      ref={ref}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onClick={onClick}
      aria-label={ariaLabel}
      style={{
        transition: "transform 0.45s cubic-bezier(0.23,1,0.32,1)",
        cursor: "pointer", border: "none",
        display: "flex", alignItems: "center", gap: 8,
        ...style,
      }}
    >
      {children}
    </button>
  );
}

/* ─── 3. 3D TILT CARD (Optimized against Layout Thrashing) ─── */
interface TiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

function TiltCard({ children, style, ...rest }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const rectRef = useRef<DOMRect | null>(null);

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (ref.current) {
      rectRef.current = ref.current.getBoundingClientRect(); // قراءة واحدة فقط وتخزينها كمرجع لمنع الـ Reflow المتكرر
    }
    if (rest.onMouseEnter) rest.onMouseEnter(e);
  };

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current || !rectRef.current) return;
    const rect = rectRef.current;
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    ref.current.style.transform = `perspective(900px) rotateY(${x * 13}deg) rotateX(${-y * 13}deg) scale3d(1.02,1.02,1.02)`;
    ref.current.style.boxShadow = `
      ${-x * 22}px ${-y * 22}px 44px rgba(200,121,65,0.18),
      inset 0 1px 1px rgba(255,255,255,0.10)
    `;
  };

  const handleLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    rectRef.current = null;
    if (!ref.current) return;
    ref.current.style.transform = "perspective(900px) rotateY(0deg) rotateX(0deg) scale3d(1,1,1)";
    ref.current.style.boxShadow = "";
    if (rest.onMouseLeave) rest.onMouseLeave(e);
  };

  return (
    <div
      ref={ref}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        transition: "transform 0.09s ease, box-shadow 0.09s ease",
        willChange: "transform",
        ...style,
      }}
      {...Object.fromEntries(Object.entries(rest).filter(([k]) => !["onMouseEnter", "onMouseLeave"].includes(k)))}
    >
      {children}
    </div>
  );
}

/* ─── 4. TESTIMONIALS MARQUEE ─── */
interface ReviewItem {
  q: string;
  name: string;
  role: string;
  init: string;
}

const ALL_REVIEWS: ReviewItem[] = [
  { q: "Called at 11pm for a burst pipe. Tech was at my door in 45 minutes, fixed it in an hour. I've never felt so taken care of. Plumber for life.", name: "James R.", role: "Homeowner, Denver CO", init: "JR" },
  { q: "Three other plumbers gave me vague estimates. Plumber quoted me $340 flat, showed up on time, and charged me exactly $340. Refreshing.", name: "Maria T.", role: "Condo Owner, Austin TX", init: "MT" },
  { q: "The warranty sold me. They fixed my water heater and six months later when the pressure dropped, they came back free of charge. Remarkable.", name: "David K.", role: "Property Manager, Phoenix AZ", init: "DK" },
  { q: "Tried two other services before finding Plumber. Night and day difference. Professional, fast, and honest. They have my business for life.", name: "Sandra L.", role: "Homeowner, Boulder CO", init: "SL" },
  { q: "Fixed a leak that two other guys said required tearing out half my kitchen wall. 20 minutes, no mess, no drama. Absolute pros.", name: "Tom W.", role: "Homeowner, Arvada CO", init: "TW" },
];

function TestimonialsMarquee() {
  const doubled = [...ALL_REVIEWS, ...ALL_REVIEWS];
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [paused, setPaused] = useState(false);

  return (
    <section id="reviews" ref={ref} aria-labelledby="reviews-title" style={{ background: "#000", padding: "120px 0", borderTop: "1px solid rgba(255,255,255,0.05)", overflow: "hidden" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 28px" }}>
        <m.div initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }}>
          <SectionHead badge="Reviews" title="Real people. Real problems fixed." sub="Don't take our word for it — here's what our neighbors say." />
        </m.div>
      </div>

      <m.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.6, delay: 0.3 }}>
        <div style={{ position: "relative" }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}>
          <div style={{
            position: "absolute", left: 0, top: 0, bottom: 0, width: 120, zIndex: 2,
            background: "linear-gradient(to right, #000, transparent)",
            pointerEvents: "none",
          }} />
          <div style={{
            position: "absolute", right: 0, top: 0, bottom: 0, width: 120, zIndex: 2,
            background: "linear-gradient(to left, #000, transparent)",
            pointerEvents: "none",
          }} />

          <m.div
            animate={{ x: paused ? undefined : ["0%", "-50%"] }}
            transition={paused ? {} : { duration: 36, repeat: Infinity, ease: "linear" }}
            style={{ display: "flex", gap: 18, width: "max-content", padding: "4px 0 18px" }}
          >
            {doubled.map((r, i) => (
              <TiltCard
                key={i}
                style={{
                  ...glass, borderRadius: 24, padding: "28px 28px 24px",
                  width: 340, flexShrink: 0,
                  transition: "background 0.25s ease, transform 0.09s ease, box-shadow 0.09s ease",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
              >
                <div style={{ display: "flex", gap: 3, marginBottom: 14 }} aria-label="5 star rating">
                  {[...Array(5)].map((_, j) => <span key={j} style={{ color: C, fontSize: 13 }}>★</span>)}
                </div>
                <p style={{
                  fontFamily: sans, fontWeight: 300, fontSize: 14,
                  color: "rgba(255,255,255,0.72)", lineHeight: 1.78,
                  fontStyle: "italic", marginBottom: 22,
                }}>"{r.q}"</p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: "50%",
                    background: "rgba(200,121,65,0.18)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: C, fontFamily: sans, fontWeight: 600, fontSize: 12,
                  }} aria-hidden="true">{r.init}</div>
                  <div>
                    <div style={{ fontFamily: sans, fontWeight: 500, fontSize: 14, color: "white" }}>{r.name}</div>
                    <div style={{ fontFamily: sans, fontSize: 12, color: "rgba(255,255,255,0.38)" }}>{r.role}</div>
                  </div>
                </div>
              </TiltCard>
            ))}
          </m.div>

          {paused && (
            <div style={{
              position: "absolute", bottom: 24, left: "50%", transform: "translateX(-50%)",
              fontFamily: sans, fontSize: 11, color: "rgba(255,255,255,0.3)",
              pointerEvents: "none", letterSpacing: "0.1em", textTransform: "uppercase",
            }}>
              Hover to read · Scroll resumes on leave
            </div>
          )}
        </div>
      </m.div>
    </section>
  );
}

/* ─── OPTIMIZED BLURRED BG GLOW ─── */
interface GlowProps {
  w?: number;
  h?: number;
  top?: number | string;
  left?: number | string;
  right?: number | string;
  bottom?: number | string;
  opacity?: number;
}

function Glow({ w = 400, h = 300, top, left, right, bottom, opacity = 0.12 }: GlowProps) {
  return (
    <m.div
      animate={{ scale: [1, 1.06, 1], opacity: [opacity, opacity * 1.4, opacity] }}
      transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      style={{
        position: "absolute", width: w, height: h, borderRadius: "50%",
        background: C, filter: "blur(100px)", pointerEvents: "none",
        top, left, right, bottom,
      }}
    />
  );
}

interface BlurTextProps {
  text: string;
  style?: React.CSSProperties;
}

function BlurText({ text, style }: BlurTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <span ref={ref} style={{ display: "flex", flexWrap: "wrap", gap: "0.28em", ...style }}>
      {text.split(" ").map((w, i) => (
        <m.span key={i}
          initial={{ filter: "blur(12px)", opacity: 0, y: 36 }}
          animate={inView ? { filter: "blur(0px)", opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.38, delay: i * 0.065, ease: [0.25, 0.1, 0.25, 1] }}>
          {w}
        </m.span>
      ))}
    </span>
  );
}

function PipeSVG() {
  return (
    <svg width="28" height="20" viewBox="0 0 28 20" fill="none" aria-hidden="true">
      <rect x="0" y="7" width="18" height="6" rx="3" stroke={C} strokeWidth="1.8" fill="none" />
      <path d="M18 10 Q24 10 24 16" stroke={C} strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <rect x="21" y="14" width="6" height="6" rx="1.5" stroke={C} strokeWidth="1.8" fill="none" />
    </svg>
  );
}

interface BadgeProps {
  label: string;
}

function Badge({ label }: BadgeProps) {
  return (
    <div style={{ ...glass, display: "inline-flex", borderRadius: 9999, padding: "5px 14px", marginBottom: 20 }}>
      <span style={{ fontSize: 10, fontFamily: sans, color: C, textTransform: "uppercase", letterSpacing: "0.16em" }}>{label}</span>
    </div>
  );
}

interface SectionHeadProps {
  badge: string;
  title: string;
  sub?: string;
  center?: boolean;
}

function SectionHead({ badge, title, sub, center = true }: SectionHeadProps) {
  return (
    <div style={{ textAlign: center ? "center" : "left", marginBottom: 60 }}>
      <Badge label={badge} />
      <h2 style={{ fontFamily: serif, fontStyle: "italic", fontWeight: 700, fontSize: "clamp(2rem,4vw,3rem)", color: "white", lineHeight: 0.92, marginBottom: 16 }}>
        <BlurText text={title} />
      </h2>
      {sub && <p style={{ color: "rgba(255,255,255,0.48)", fontFamily: sans, fontWeight: 300, fontSize: 15, maxWidth: 480, margin: center ? "0 auto" : 0 }}>{sub}</p>}
    </div>
  );
}

const CALENDLY_URL = "https://calendly.com/plumber/free-visit";

function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

const NAV_LINKS = [
  { label: "Services",     id: "services"    },
  { label: "How It Works", id: "how-it-works" },
  { label: "Reviews",      id: "reviews"      },
  { label: "FAQ",          id: "faq"          },
  { label: "Contact",      id: "contact"      },
];

function Navbar() {
  return (
    <div style={{ position: "fixed", top: 32, left: 0, right: 0, zIndex: 100, padding: "0 20px" }}>
      <m.nav 
        aria-label="Main Navigation"
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
        style={{ ...glass, maxWidth: 880, margin: "0 auto", borderRadius: 9999, padding: "9px 18px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <PipeSVG />
          <span style={{ fontFamily: serif, fontStyle: "italic", fontWeight: 700, fontSize: 17, color: "white", letterSpacing: 1 }}>PLUMBER</span>
        </div>
        <div style={{ display: "flex", gap: 2, alignItems: "center" }}>
          {NAV_LINKS.map(({ label, id }) => (
            <a key={label}
              href={`#${id}`}
              onClick={(e) => {
                e.preventDefault();
                scrollTo(id);
              }}
              style={{ padding: "6px 12px", fontFamily: sans, fontWeight: 500, fontSize: 13, color: "rgba(255,255,255,0.6)", textDecoration: "none", borderRadius: 9999, transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "white")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}>
              {label}
            </a>
          ))}
        </div>
        <MagneticBtn
          onClick={() => window.open(CALENDLY_URL, "_blank")}
          style={{ background: C, color: "#090909", borderRadius: 9999, padding: "8px 18px", fontFamily: sans, fontWeight: 600, fontSize: 13 }}>
          <PhoneCall size={13} aria-hidden="true" /> Get a Free Quote
        </MagneticBtn>
      </m.nav>
    </div>
  );
}

function Hero() {
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 700], [0, 160]);

  const trustItems = [
    { icon: <ShieldCheck size={15} color={C} aria-hidden="true" />, val: "4.9/5 Rating", sub: "Google Reviews" },
    { icon: <BadgeCheck size={15} color={C} aria-hidden="true" />, val: "Licensed & Insured", sub: "Fully Bonded" },
    { icon: <Zap size={15} color={C} aria-hidden="true" />, val: "Same-Day Service", sub: "Guaranteed" },
    { icon: <Star size={15} color={C} aria-hidden="true" />, val: "2,400+ Jobs Done", sub: "Satisfied Clients" },
  ];
  return (
    <section style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", overflow: "hidden" }}>
      <m.div style={{ position: "absolute", inset: "-20% 0", y: bgY, zIndex: 0 }}>
        <Image 
          src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=75" // تقليص الجودة والتحجيم الافتراضي لتحسين سرعة التحميل والـ LCP
          alt="Professional plumbing diagnostic services background" 
          fill
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
          style={{ objectFit: "cover" }}
        />
      </m.div>
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.68)", zIndex: 1 }} />
      <Glow w={820} h={420} bottom={-200} left="calc(50% - 410px)" opacity={0.14} />
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 140, background: "linear-gradient(to bottom,#000,transparent)", zIndex: 2 }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 200, background: "linear-gradient(to top,#000,transparent)", zIndex: 2 }} />
      <div style={{ position: "relative", zIndex: 10, maxWidth: 920, margin: "0 auto", padding: "180px 28px 100px", textAlign: "center", width: "100%" }}>
        <m.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          style={{ ...glass, display: "inline-flex", alignItems: "center", gap: 8, borderRadius: 9999, padding: "5px 14px", marginBottom: 30 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: C, display: "block", animation: "pulse2 2s infinite" }} aria-hidden="true" />
          <span style={{ fontFamily: sans, fontSize: 12, color: "rgba(255,255,255,0.78)" }}>Available 24/7 — Same-Day Service</span>
        </m.div>
        
        {/* إلغاء BlurText هنا لضمان رندرة النص الأساسي فورياً وتصدر مقياس LCP بأعلى درجة */}
        <h1 style={{ fontFamily: serif, fontStyle: "italic", fontWeight: 700, fontSize: "clamp(2.6rem,5.5vw,5rem)", color: "white", lineHeight: 0.9, letterSpacing: "-1.5px", marginBottom: 26, maxWidth: 820, margin: "0 auto 26px" }}>
          The Last Plumber You'll Ever Need to Call
        </h1>

        <m.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.2 }}
          style={{ fontFamily: sans, fontWeight: 300, fontSize: 15, color: "rgba(255,255,255,0.58)", maxWidth: 540, margin: "0 auto 40px", lineHeight: 1.75 }}>
          Expert plumbing. Upfront pricing. Licensed & insured. We fix it right the first time — or we come back for free.
        </m.p>
        <m.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 22, flexWrap: "wrap", marginBottom: 60 }}>
          <MagneticBtn
            onClick={() => window.open(CALENDLY_URL, "_blank")}
            style={{ background: C, color: "#090909", borderRadius: 9999, padding: "14px 30px", fontFamily: sans, fontWeight: 700, fontSize: 15, boxShadow: `0 0 32px rgba(200,121,65,0.45)` }}>
            Book Now — It's Free <ArrowUpRight size={15} aria-hidden="true" />
          </MagneticBtn>
          <a 
            href="tel:5552478910"
            style={{ display: "flex", alignItems: "center", gap: 7, fontFamily: sans, fontSize: 14, color: "rgba(255,255,255,0.58)", textDecoration: "none" }}>
            <Phone size={14} color={C} aria-hidden="true" /> Call Us: (555) 247-8910
          </a>
        </m.div>
        <m.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <div style={{ ...glass, display: "inline-flex", gap: 28, borderRadius: 20, padding: "16px 28px", flexWrap: "wrap", justifyContent: "center" }}>
            {trustItems.map((t, i) => (
              <m.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 + i * 0.08 }}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
                {t.icon}
                <span style={{ fontFamily: sans, fontWeight: 600, fontSize: 12, color: "white" }}>{t.val}</span>
                <span style={{ fontFamily: sans, fontSize: 9, color: "rgba(255,255,255,0.38)", textTransform: "uppercase", letterSpacing: "0.14em" }}>{t.sub}</span>
              </m.div>
            ))}
          </div>
        </m.div>
      </div>
    </section>
  );
}

function Services() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const svcs = [
    { icon: <Droplets size={19} aria-hidden="true" />, title: "Leak Detection & Repair", desc: "Hidden leaks found fast with acoustic detection. No guesswork. No unnecessary holes." },
    { icon: <Flame size={19} aria-hidden="true" />, title: "Water Heater Services", desc: "Installation, repair, and replacement. Hot water when you need it, at prices that won't burn you." },
    { icon: <Waves size={19} aria-hidden="true" />, title: "Drain Cleaning", desc: "Stubborn clogs, foul odors, slow drains. Cleared in a single visit using hydrojetting technology." },
    { icon: <Home size={19} aria-hidden="true" />, title: "Bathroom Remodeling", desc: "Full fixture installs, shower conversions, full bathroom plumbing. Masterful craftsmanship, zero shortcuts." },
    { icon: <AlertTriangle size={19} aria-hidden="true" />, title: "Emergency Plumbing", desc: "Burst pipes at 2am? We answer every call, 365 days a year. Response time: under 60 minutes." },
    { icon: <Settings size={19} aria-hidden="true" />, title: "Pipe Replacement", desc: "Old galvanized or deteriorating pipes? We repipe your entire home cleanly, minimizing wall damage." },
  ];
  return (
    <section id="services" ref={ref} aria-labelledby="services-title" style={{ background: "#000", padding: "120px 28px", position: "relative", overflow: "hidden" }}>
      <Glow w={360} h={360} top="5%" left="5%" opacity={0.07} />
      <Glow w={300} h={300} top="55%" right="3%" opacity={0.06} />
      <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>
        <m.div initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }}>
          <SectionHead badge="Our Services" title="We Handle Every Drop, Every Pipe, Every Problem" sub="From a dripping faucet to full system replacements — one call covers it all." />
        </m.div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 18 }}>
          {svcs.map((s, i) => (
            <m.div key={i}
              initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: i * 0.09 }}>
              <TiltCard style={{ ...glass, borderRadius: 24, padding: "28px 26px", cursor: "default", height: "100%" }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.055)")}
                onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}>
                <div style={{ ...glassCopper, borderRadius: 14, width: 46, height: 46, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20, color: C }}>
                  {s.icon}
                </div>
                <h3 style={{ fontFamily: serif, fontStyle: "italic", fontWeight: 700, fontSize: 20, color: "white", marginBottom: 10 }}>{s.title}</h3>
                <p style={{ fontFamily: sans, fontWeight: 300, fontSize: 14, color: "rgba(255,255,255,0.48)", lineHeight: 1.75, margin: 0 }}>{s.desc}</p>
              </TiltCard>
            </m.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const w = useWindowWidth();
  const steps = [
    { n: "01", icon: <Phone size={19} aria-hidden="true" />, title: "Call or Book Online", desc: "Tell us what's going wrong. We'll give you a flat-rate price before anyone arrives. No hidden fees. Ever." },
    { n: "02", icon: <UserCheck size={19} aria-hidden="true" />, title: "A Licensed Pro Arrives", desc: "Your dedicated plumber shows up on time, in uniform, with everything needed to fix the job in one visit." },
    { n: "03", icon: <CheckCircle size={19} aria-hidden="true" />, title: "Problem Solved. Guaranteed.", desc: "We clean up completely and back every repair with our 12-month craftsmanship warranty. If it fails, we return for free." },
  ];
  return (
    <section id="how-it-works" ref={ref} aria-labelledby="how-it-works-title" style={{ background: "#080808", padding: "120px 28px", borderTop: "1px solid rgba(200,121,65,0.14)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <m.div initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }}>
          <SectionHead badge="How It Works" title="Done Right. Done Fast." sub="Three steps from your first call to a fixed problem." />
        </m.div>
        <div style={{ display: "flex", flexDirection: w < 768 ? "column" : "row", alignItems: w < 768 ? "stretch" : "flex-start", gap: 0 }}>
          {steps.map((s, i) => (
            <React.Fragment key={i}>
              <m.div initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, delay: i * 0.14 }}
                style={{ flex: 1 }}>
                <TiltCard style={{ ...glass, borderRadius: 24, padding: "32px 28px", position: "relative", overflow: "hidden", height: "100%" }}>
                  <span style={{ position: "absolute", top: 14, right: 22, fontFamily: serif, fontStyle: "italic", fontSize: 72, color: "rgba(200,121,65,0.14)", lineHeight: 1, userSelect: "none" }}>{s.n}</span>
                  <div style={{ ...glassCopper, borderRadius: "50%", width: 46, height: 46, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24, color: C }}>
                    {s.icon}
                  </div>
                  <h3 style={{ fontFamily: serif, fontStyle: "italic", fontWeight: 700, fontSize: 22, color: "white", marginBottom: 12 }}>{s.title}</h3>
                  <p style={{ fontFamily: sans, fontWeight: 300, fontSize: 14, color: "rgba(255,255,255,0.48)", lineHeight: 1.75, margin: 0 }}>{s.desc}</p>
                </TiltCard>
              </m.div>
              {i < 2 && (
                w < 768 ? (
                  <m.div key={`conn-mobile-${i}`}
                    initial={{ scaleY: 0 }} animate={inView ? { scaleY: 1 } : {}}
                    transition={{ duration: 0.4, delay: i * 0.14 + 0.35 }}
                    style={{ alignSelf: "center", display: "flex", flexDirection: "column", alignItems: "center", padding: "8px 0", transformOrigin: "top" }}>
                    <div style={{ width: 1, height: 32, background: `linear-gradient(to bottom, rgba(200,121,65,0.6), rgba(200,121,65,0.15))` }} />
                    <m.span animate={{ y: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}
                      style={{ color: C, fontSize: 14, lineHeight: 1 }}>▼</m.span>
                  </m.div>
                ) : (
                  <m.div key={`conn-desktop-${i}`}
                    initial={{ scaleX: 0, opacity: 0 }} animate={inView ? { scaleX: 1, opacity: 1 } : {}}
                    transition={{ duration: 0.5, delay: i * 0.14 + 0.4 }}
                    style={{ display: "flex", alignItems: "center", padding: "0 4px", paddingTop: 46, transformOrigin: "left", flexShrink: 0, width: 44 }}>
                    <div style={{ flex: 1, height: 1, background: `linear-gradient(to right, rgba(200,121,65,0.6), rgba(200,121,65,0.2))`, position: "relative" }}>
                      <m.div animate={{ x: ["0%", "100%"] }} transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
                        style={{ position: "absolute", top: -2, width: 6, height: 5, borderRadius: "50%", background: C, boxShadow: `0 0 8px ${C}` }} />
                    </div>
                    <m.span animate={{ x: [0, 3, 0] }} transition={{ duration: 1.5, repeat: Infinity }}
                      style={{ color: C, fontSize: 12, marginLeft: 2 }}>▶</m.span>
                  </m.div>
                )
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturesChess() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const w = useWindowWidth();
  const cols = w < 768 ? "1fr" : "1fr 1fr";
  return (
    <section ref={ref} style={{ background: "#000", padding: "120px 28px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <m.div initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }}>
          <SectionHead badge="Why Plumber" title="Not your average plumber." sub="We built the plumbing company we always wished existed." />
        </m.div>
        
        {/* Row 1 */}
        <m.div initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay: 0.15 }}
          style={{ display: "grid", gridTemplateColumns: cols, gap: 40, alignItems: "center", marginBottom: 72 }}>
          <div>
            <h3 style={{ fontFamily: serif, fontStyle: "italic", fontWeight: 700, fontSize: "clamp(1.8rem,3vw,2.4rem)", color: "white", lineHeight: 1.1, marginBottom: 18 }}>Upfront pricing. No surprises.</h3>
            <p style={{ fontFamily: sans, fontWeight: 300, fontSize: 15, color: "rgba(255,255,255,0.52)", lineHeight: 1.8, marginBottom: 28 }}>We quote you before we start. The price you see is the price you pay. No shock invoices, no upsells, no fine print. Just honest work at a fair price.</p>
            <MagneticBtn onClick={() => scrollTo("services")} style={{ ...glassStrong, borderRadius: 9999, padding: "10px 22px", fontFamily: sans, color: "white", fontSize: 14 }}>
              See Our Services
            </MagneticBtn>
          </div>
          <TiltCard style={{ ...glass, borderRadius: 28, padding: "44px 36px", textAlign: "center" }}>
            <div style={{ fontFamily: serif, fontStyle: "italic", fontWeight: 700, fontSize: 84, color: C, lineHeight: 1, marginBottom: 8 }}>$0</div>
            <div style={{ fontFamily: sans, fontSize: 14, color: "rgba(255,255,255,0.38)", marginBottom: 28 }}>Hidden fees</div>
            {["Flat-rate quotes", "No overtime charges", "Free estimates"].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, justifyContent: "center" }}>
                <CheckCircle size={15} color={C} aria-hidden="true" />
                <span style={{ fontFamily: sans, fontSize: 14, color: "rgba(255,255,255,0.68)" }}>{item}</span>
              </div>
            ))}
          </TiltCard>
        </m.div>

        {/* Row 2 */}
        <m.div initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay: 0.3 }}
          style={{ display: "grid", gridTemplateColumns: cols, gap: 40, alignItems: "center" }}>
          <TiltCard style={{ ...glass, borderRadius: 28, padding: 36, position: "relative", minHeight: 230, overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 60%,rgba(200,121,65,0.1) 0%,transparent 70%)" }} />
            {[[28, 38], [52, 56], [68, 33], [43, 72], [74, 58], [35, 65]].map(([x, y], i) => (
              <m.div key={i}
                animate={{ scale: [1, 1.3, 1], opacity: [0.65, 1, 0.65] }}
                transition={{ duration: 2.5 + i * 0.5, repeat: Infinity, delay: i * 0.4 }}
                style={{ position: "absolute", left: `${x}%`, top: `${y}%`, width: 9, height: 9, borderRadius: "50%", background: C }} />
            ))}
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ ...glassCopper, display: "inline-flex", borderRadius: 9999, padding: "6px 14px", marginBottom: 14 }}>
                <span style={{ fontFamily: sans, fontSize: 12, color: CL }}>Serving Greater Metro Area — 25 mile radius</span>
              </div>
              <div style={{ fontFamily: sans, fontSize: 13, color: "rgba(255,255,255,0.3)", marginTop: 8 }}>12 crews deployed across the area</div>
            </div>
          </TiltCard>
          <div>
            <h3 style={{ fontFamily: serif, fontStyle: "italic", fontWeight: 700, fontSize: "clamp(1.8rem,3vw,2.4rem)", color: "white", lineHeight: 1.1, marginBottom: 18 }}>We're in your neighborhood. Always.</h3>
            <p style={{ fontFamily: sans, fontWeight: 300, fontSize: 15, color: "rgba(255,255,255,0.52)", lineHeight: 1.8, marginBottom: 28 }}>With 12 crews deployed across the metro area, we guarantee arrival within 60 minutes — any time, day or night. Rain, snow, or 2am — your emergency is ours.</p>
            <MagneticBtn style={{ ...glassStrong, borderRadius: 9999, padding: "10px 22px", fontFamily: sans, color: "white", fontSize: 14 }}>
              Check Your Area
            </MagneticBtn>
          </div>
        </m.div>
      </div>
    </section>
  );
}

interface CounterProps {
  end: number;
  suffix?: string;
}

function Counter({ end, suffix = "" }: CounterProps) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let s = 0;
    const step = end / 60;
    const t = setInterval(() => {
      s += step;
      if (s >= end) { setVal(end); clearInterval(t); }
      else setVal(Math.floor(s));
    }, 33);
    return () => clearInterval(t);
  }, [inView, end]);
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

function Stats() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const w = useWindowWidth();
  return (
    <section ref={ref} style={{ background: "#050505", padding: "120px 28px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <Image 
          src="https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=1200&q=40" // تقليص الجودة وتغيير القياس لخلفية الإحصائيات غير المؤثرة على الرؤية
          alt="Technical industrial water meters visual representation" 
          fill
          style={{ objectFit: "cover", opacity: 0.09 }}
        />
      </div>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 200, background: "linear-gradient(to bottom,#050505,transparent)", zIndex: 1 }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 200, background: "linear-gradient(to top,#050505,transparent)", zIndex: 1 }} />
      <m.div initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }}
        style={{ maxWidth: 960, margin: "0 auto", position: "relative", zIndex: 2 }}>
        <TiltCard style={{ ...glass, borderRadius: 32, padding: "56px 44px" }}>
          <div style={{ display: "grid", gridTemplateColumns: w < 640 ? "1fr 1fr" : "repeat(4,1fr)", gap: w < 640 ? "32px 0" : 0 }}>
            {[
              { label: "Jobs completed", render: <Counter end={2400} suffix="+" /> },
              { label: "Average rating", render: "4.9★" },
              { label: "Emergency response", render: "< 60 min" },
              { label: "Repair guarantee", render: "12 months" },
            ].map((s, i) => (
              <div key={i} style={{
                textAlign: "center", padding: "0 16px",
                borderRight: w >= 640 && i < 3 ? "1px solid rgba(255,255,255,0.06)" : "none",
                borderBottom: w < 640 && i < 2 ? "1px solid rgba(255,255,255,0.06)" : "none",
                paddingBottom: w < 640 ? 32 : 0,
              }}>
                <div style={{ fontFamily: serif, fontStyle: "italic", fontWeight: 700, fontSize: "clamp(1.8rem,3.5vw,3.2rem)", color: C, lineHeight: 1 }}>{s.render}</div>
                <div style={{ fontFamily: sans, fontSize: 10, color: "rgba(255,255,255,0.38)", textTransform: "uppercase", letterSpacing: "0.15em", marginTop: 8 }}>{s.label}</div>
              </div>
            ))}
          </div>
          <p style={{ fontFamily: sans, fontSize: 10, color: "rgba(255,255,255,0.22)", textAlign: "center", marginTop: 38, textTransform: "uppercase", letterSpacing: "0.15em" }}>
            Join 2,400+ satisfied homeowners across Metro Area
          </p>
        </TiltCard>
      </m.div>
    </section>
  );
}

/* ─── FAQ ACCORDION ─── */
interface FAQItemType {
  q: string;
  a: string;
}

const FAQ_ITEMS: FAQItemType[] = [
  {
    q: "Will you damage my walls or floors to find a leak?",
    a: "Almost never. We use acoustic leak detection equipment that locates hidden leaks without guesswork. In the rare case we need wall access, we make the smallest possible opening and patch it cleanly before we leave.",
  },
  {
    q: "How exactly does the 12-month warranty work?",
    a: "If any repair we perform fails within 12 months due to our workmanship, we return and fix it at no charge — parts and labor included. The only exclusions are damage caused by third-party work or acts of nature after our visit.",
  },
  {
    q: "How do you price jobs? Can you really quote upfront?",
    a: "Yes. We give you a flat-rate price over the phone or before we start work on-site. The number you see is the number you pay. We don't charge by the hour, so there are no 'surprise overtime' invoices.",
  },
  {
    q: "What if my problem isn't fully fixed on the first visit?",
    a: "It's covered under our warranty — we come back free of charge. We've built our business on repeat customers and referrals, so leaving a job half-done would be business suicide for us.",
  },
  {
    q: "Do you service my area? What if I'm outside the 25-mile radius?",
    a: "We cover the entire Greater Metro Denver area within a 25-mile radius, including Aurora, Lakewood, Arvada, Westminster, and Englewood. Call us and we'll confirm your address — we occasionally extend coverage for larger jobs.",
  },
  {
    q: "What counts as a plumbing emergency?",
    a: "Burst or actively leaking pipes, sewage backups, no hot water, gas-smell adjacent to water heater, or flooding. For emergencies, we guarantee arrival within 60 minutes, 24/7/365. No extra charge for nights or weekends.",
  },
];

function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="faq" ref={ref} aria-labelledby="faq-title" style={{ background: "#040404", padding: "120px 28px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <m.div initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }}>
          <SectionHead badge="FAQ" title="Answers before you ask." sub="The questions every homeowner has before calling a plumber." />
        </m.div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {FAQ_ITEMS.map((item, i) => (
            <m.div key={i}
              initial={{ opacity: 0, y: 18 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: i * 0.07 }}>
              <div style={{
                ...glass,
                borderRadius: 16,
                overflow: "hidden",
                border: open === i ? "1px solid rgba(200,121,65,0.30)" : "1px solid rgba(255,255,255,0.08)",
                transition: "border 0.25s ease",
              }}>
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  aria-expanded={open === i}
                  style={{
                    width: "100%", background: "none", border: "none", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "20px 24px", gap: 16,
                    textAlign: "left",
                  }}>
                  <span style={{ fontFamily: sans, fontWeight: 500, fontSize: 15, color: open === i ? "white" : "rgba(255,255,255,0.78)", transition: "color 0.2s", lineHeight: 1.4 }}>
                    {item.q}
                  </span>
                  <m.span
                    animate={{ rotate: open === i ? 45 : 0 }}
                    transition={{ duration: 0.22 }}
                    style={{ fontFamily: sans, fontSize: 22, color: C, flexShrink: 0, lineHeight: 1, fontWeight: 300 }}>
                    +
                  </m.span>
                </button>
                <AnimatePresence initial={false}>
                  {open === i && (
                    <m.div
                      key="body"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
                      style={{ overflow: "hidden" }}>
                      <div style={{ padding: "0 24px 22px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                        <p style={{ fontFamily: sans, fontWeight: 300, fontSize: 14, color: "rgba(255,255,255,0.55)", lineHeight: 1.8, margin: "16px 0 0" }}>
                          {item.a}
                        </p>
                      </div>
                    </m.div>
                  )}
                </AnimatePresence>
              </div>
            </m.div>
          ))}
        </div>
        <m.div initial={{ opacity: 0, y: 12 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.5 }}
          style={{ marginTop: 44, textAlign: "center" }}>
          <p style={{ fontFamily: sans, fontWeight: 300, fontSize: 14, color: "rgba(255,255,255,0.35)", marginBottom: 18 }}>
            Still have questions? We pick up the phone.
          </p>
          <MagneticBtn
            onClick={() => (window.location.href = "tel:5552478910")}
            style={{ ...glassCopper, borderRadius: 9999, padding: "11px 24px", fontFamily: sans, fontWeight: 600, fontSize: 14, color: CL, display: "inline-flex" }}>
            <Phone size={14} aria-hidden="true" /> Call (555) 247-8910
          </MagneticBtn>
        </m.div>
      </div>
    </section>
  );
}

function TrustStrip() {
  const creds = [
    { icon: <ShieldCheck size={15} aria-hidden="true" />, label: "Licensed & Bonded" },
    { icon: <Award size={15} aria-hidden="true" />, label: "BBB Accredited A+" },
    { icon: <Leaf size={15} aria-hidden="true" />, label: "EPA Certified" },
    { icon: <Star size={15} aria-hidden="true" />, label: "Google Guaranteed" },
    { icon: <Users size={15} aria-hidden="true" />, label: "PHCC Member" },
  ];
  return (
    <div style={{ ...glass, padding: "28px 40px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
        {creds.map((c, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: sans, fontWeight: 500, fontSize: 13, color: "rgba(255,255,255,0.48)" }}>
            <span style={{ color: C }}>{c.icon}</span>{c.label}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── CTA FOOTER with Type-safe Modal ─── */
type ModalType = 'privacy' | 'terms' | 'sitemap' | null;

function CtaFooter() {
  const [modal, setModal] = useState<ModalType>(null);

  useEffect(() => {
    if (!modal) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setModal(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [modal]);

  const FOOTER_CONTENT = {
    privacy: {
      title: "Privacy Policy",
      body: "We collect only the information needed to provide our plumbing services — your name, contact details, and service address. We never sell your data to third parties. All information is encrypted in transit and stored securely. You may request deletion of your data at any time by contacting us.",
      links: null,
      ids: null
    },
    terms: {
      title: "Terms of Service",
      body: "By booking with Plumber, you agree that all quoted prices are flat-rate and binding once confirmed. Our 12-month craftsmanship warranty covers defects in workmanship only. We reserve the right to reschedule emergency visits during extreme weather events. Disputes are governed by the laws of the State of Colorado.",
      links: null,
      ids: null
    },
    sitemap: {
      title: "Sitemap",
      body: null,
      links: ["Services", "How It Works", "Reviews", "Contact"],
      ids:   ["services", "how-it-works", "reviews", "contact"],
    },
  };

  return (
    <section id="contact" style={{ background: "#030303", position: "relative", overflow: "hidden" }}>
      {/* Modal */}
      <AnimatePresence>
        {modal && (
          <m.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setModal(null)}
            style={{
              position: "fixed", inset: 0, zIndex: 9000,
              background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)",
              display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
            }}>
            <m.div
              initial={{ scale: 0.92, y: 24 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, y: 24 }}
              onClick={e => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-title"
              style={{ ...glassStrong, borderRadius: 24, padding: "40px 36px", maxWidth: 520, width: "100%" }}>
              <h3 id="modal-title" style={{ fontFamily: serif, fontStyle: "italic", fontWeight: 700, fontSize: 26, color: "white", marginBottom: 18 }}>
                {FOOTER_CONTENT[modal].title}
              </h3>
              {FOOTER_CONTENT[modal].body && (
                <p style={{ fontFamily: sans, fontWeight: 300, fontSize: 14, color: "rgba(255,255,255,0.58)", lineHeight: 1.8 }}>
                  {FOOTER_CONTENT[modal].body}
                </p>
              )}
              {FOOTER_CONTENT[modal].links && (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {FOOTER_CONTENT[modal].links?.map((link, i) => (
                    <button key={link}
                      onClick={() => { setModal(null); setTimeout(() => scrollTo((FOOTER_CONTENT[modal].ids as string[])[i]), 100); }}
                      style={{ ...glassCopper, borderRadius: 12, padding: "12px 18px", fontFamily: sans, fontWeight: 500, fontSize: 14, color: CL, border: "none", cursor: "pointer", textAlign: "left" }}>
                      → {link}
                    </button>
                  ))}
                </div>
              )}
              <button onClick={() => setModal(null)}
                style={{ marginTop: 24, fontFamily: sans, fontSize: 13, color: "rgba(255,255,255,0.38)", background: "none", border: "none", cursor: "pointer" }}>
                Close (Esc)
              </button>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>

      <Glow w={600} h={300} top={0} left="calc(50% - 300px)" opacity={0.1} />
      <div style={{ height: 1, background: `linear-gradient(to right,transparent,rgba(200,121,65,0.3),transparent)` }} />
      <div style={{ maxWidth: 820, margin: "0 auto", textAlign: "center", padding: "130px 28px 52px", position: "relative", zIndex: 1 }}>
        <h2 style={{ fontFamily: serif, fontStyle: "italic", fontWeight: 700, fontSize: "clamp(3rem,7vw,5.5rem)", color: "white", lineHeight: 0.85, letterSpacing: "-2px", marginBottom: 22 }}>
          Your pipes deserve better.
        </h2>
        <p style={{ fontFamily: sans, fontWeight: 300, fontSize: 15, color: "rgba(255,255,255,0.48)", lineHeight: 1.75, maxWidth: 500, margin: "0 auto 40px" }}>
          Book online in 60 seconds. No credit card. No commitment. Just expert help, exactly when you need it.
        </p>
        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <MagneticBtn
            onClick={() => window.open(CALENDLY_URL, "_blank")}
            style={{ background: C, color: "#090909", borderRadius: 9999, padding: "14px 28px", fontFamily: sans, fontWeight: 600, fontSize: 15 }}>
            Book a Free Visit <ArrowUpRight size={15} aria-hidden="true" />
          </MagneticBtn>
          <MagneticBtn
            onClick={() => (window.location.href = "tel:5552478910")}
            style={{ ...glassStrong, borderRadius: 9999, padding: "14px 28px", fontFamily: sans, color: "white", fontSize: 15 }}>
            <Phone size={15} aria-hidden="true" /> Call (555) 247-8910
          </MagneticBtn>
        </div>
      </div>
      
      {/* 
        تحسين نسبة تباين الألوان هنا لرفع مقياس Accessibility إلى 100/100 
        تم تعديل الشفافية لتصبح واضحة وقابلة للقراءة بوضوح وفقاً لتقرير Lighthouse
      */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "28px 28px 44px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14, maxWidth: 1100, margin: "0 auto" }}>
        <span style={{ fontFamily: sans, fontSize: 11, color: "rgba(255,255,255,0.65)" }}>© 2026 Plumber. Licensed Plumbing Contractor. All rights reserved.</span>
        <span style={{ fontFamily: sans, fontSize: 11, color: "rgba(255,255,255,0.55)" }}>Serving Denver, Aurora, Lakewood & Surrounding Areas</span>
        <div style={{ display: "flex", gap: 16 }}>
          {(["privacy", "terms", "sitemap"] as const).map((key) => (
            <button key={key}
              onClick={() => setModal(key)}
              style={{ fontFamily: sans, fontSize: 11, color: "rgba(255,255,255,0.65)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline", textUnderlineOffset: 3, padding: 0 }}>
              {key === "privacy" ? "Privacy Policy" : key === "terms" ? "Terms" : "Sitemap"}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── STICKY CALL CTA ─── */
function StickyCall() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const h = () => setShow(window.scrollY > 400);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  return (
    <AnimatePresence>
      {show && (
        <m.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 340, damping: 28 }}
          onClick={() => (window.location.href = "tel:5552478910")}
          role="button"
          tabIndex={0}
          aria-label="Call Emergency Plumber Now"
          onKeyDown={(e) => { if (e.key === 'Enter') window.location.href = "tel:5552478910"; }}
          style={{
            position: "fixed", bottom: 28, right: 28, zIndex: 500,
            background: C, borderRadius: 9999,
            padding: "13px 22px", display: "flex", alignItems: "center", gap: 9,
            fontFamily: sans, fontWeight: 600, fontSize: 14, color: "#000",
            boxShadow: `0 8px 32px rgba(200,121,65,0.45)`,
            cursor: "pointer",
          }}>
          <PhoneCall size={15} aria-hidden="true" /> Call Now — Free Quote
        </m.div>
      )}
    </AnimatePresence>
  );
}

/* ─── SCROLL PROGRESS BAR ─── */
function ScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const h = () => {
      const el = document.documentElement;
      setP((window.scrollY / (el.scrollHeight - el.clientHeight)) * 100);
    };
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  return (
    <div 
      aria-hidden="true"
      style={{
        position: "fixed", top: 0, left: 0, zIndex: 9998,
        height: 2, background: C, width: `${p}%`,
        boxShadow: `0 0 10px ${C}, 0 0 20px ${C}`,
        transition: "width 0.1s linear",
        pointerEvents: "none",
      }} 
    />
  );
}

/* ─── COPPER CURSOR ─── */
function CopperCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [hov, setHov] = useState(false);
  useEffect(() => {
    const mEvent = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    const over = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      setHov(!!target?.closest("button,a,[data-hover]"));
    };
    window.addEventListener("mousemove", mEvent);
    window.addEventListener("mouseover", over);
    return () => {
      window.removeEventListener("mousemove", mEvent);
      window.removeEventListener("mouseover", over);
    };
  }, []);
  return (
    <m.div
      aria-hidden="true"
      animate={{ x: pos.x - 6, y: pos.y - 6, scale: hov ? 2.8 : 1 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      style={{
        position: "fixed", zIndex: 99998, pointerEvents: "none",
        width: 12, height: 12, borderRadius: "50%", background: C,
        mixBlendMode: "difference", opacity: 0.85,
        top: 0, left: 0,
      }}
    />
  );
}

/* ─── MAIN LANDING PAGE COMPONENT ─── */
export default function LandingPage() {
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "PlumbingService",
    "name": "Plumber",
    "image": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80",
    "telePhone": "(555) 247-8910",
    "url": "https://plumber.com",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Denver",
      "addressRegion": "CO",
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "39.7392",
      "longitude": "-104.9903"
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      "opens": "00:00",
      "closes": "23:59"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "2400"
    }
  };

  return (
    /* تغليف الصفحة بالكامل بـ LazyMotion لتقليل مساحة الجافا سكريبت وتحميل الحركات بسلاسة */
    <LazyMotion features={domAnimation}>
      <main style={{ background: "#000", minHeight: "100vh" }}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
        />

        <GrainOverlay />
        <ScrollProgress />
        <CopperCursor />
        <Navbar />
        <Hero />
        <Services />
        <HowItWorks />
        <FeaturesChess />
        <Stats />
        <TestimonialsMarquee />
        <FAQ />
        <TrustStrip />
        <CtaFooter />
        <StickyCall />
      </main>
    </LazyMotion>
  );
}