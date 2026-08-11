
// import React, { useEffect, useState, useRef, useCallback } from "react";
// import { useLanguage } from "../context/LanguageContext";
// import { useROS } from "../context/RosContext";
// import ReactDOM from "react-dom";

// const MACHINE_ID = "TEIMOVER500M20265001";

// function getSignalHex(percent) {
//   const p = parseInt(percent, 10) || 0;
//   if (p >= 70) return "#4ade80";
//   if (p >= 40) return "#facc15";
//   return "#f87171";
// }

// function parseLinkQualityPct(lq) {
//   if (!lq) return null;
//   const [a, b] = lq.split("/").map(Number);
//   return b ? Math.round((a / b) * 100) : null;
// }

// // ── Reusable Modal Shell ───────────────────────────────────────────────────
// function Modal({ title, emoji, onClose, children, maxWidth = "max-w-lg" }) {
//   return ReactDOM.createPortal(
//     <div
//       className="fixed inset-0 flex items-center justify-center bg-slate-950/80 backdrop-blur-xl p-3 sm:p-4"
//       style={{ zIndex: 99999 }}
//       onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
//     >
//       <div className={`bg-white dark:bg-slate-900 text-slate-900 dark:text-white
//                       rounded-2xl sm:rounded-3xl shadow-[0_0_80px_rgba(0,0,0,0.5)]
//                       border-2 sm:border-4 border-sky-500
//                       w-full ${maxWidth} max-h-[92vh] overflow-y-auto flex flex-col`}>
//         {/* Header */}
//         <div className="sticky top-0 bg-white dark:bg-slate-900
//                         border-b-2 border-sky-500
//                         px-5 py-4 flex justify-between items-center shrink-0 z-10">
//           <div className="flex items-center gap-3">
//             <span className="text-4xl">{emoji}</span>
//             <h3 className="font-black uppercase tracking-tighter text-xl sm:text-2xl">{title}</h3>
//           </div>
//           <button
//             onClick={onClose}
//             className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800
//                        hover:bg-red-500 hover:text-white active:bg-red-700
//                        transition-all flex items-center justify-center
//                        text-xl font-black shrink-0 touch-manipulation"
//           >✕</button>
//         </div>
//         {/* Body */}
//         <div className="p-5 sm:p-6">{children}</div>
//       </div>
//     </div>,
//     document.body
//   );
// }

// // ── WiFi Modal ─────────────────────────────────────────────────────────────
// function WiFiModal({ wifiDetails, onClose }) {
//   const p        = parseInt(wifiDetails?.signal_percent, 10) || 0;
//   const sigColor = getSignalHex(p);
//   const lqPct    = parseLinkQualityPct(wifiDetails?.link_quality);
//   const label    = p >= 70 ? "Excellent" : p >= 50 ? "Good" : p >= 30 ? "Fair" : "Weak";

//   return (
//     <Modal title="Network Connection" emoji="📶" onClose={onClose}>
//       {wifiDetails ? (
//         <div className="space-y-4">
//           <div className="bg-gradient-to-r from-sky-500/10 to-sky-600/10
//                           rounded-2xl p-5 border-2 border-sky-500/30">
//             <div className="flex items-center justify-between mb-3">
//               <div>
//                 <div className="text-2xl font-black">{wifiDetails.ssid ?? "—"}</div>
//                 <div className="flex items-center gap-2 mt-1">
//                   <div className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ background: sigColor }} />
//                   <span className="text-sm font-bold uppercase" style={{ color: sigColor }}>{label}</span>
//                 </div>
//               </div>
//               <div className="text-right">
//                 <div className="text-5xl font-black" style={{ color: sigColor }}>{p}%</div>
//                 <div className="text-xs font-bold text-slate-500 mt-1 uppercase">Signal</div>
//               </div>
//             </div>
//             <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700">
//               <div className="h-2 rounded-full transition-all" style={{ width: `${Math.min(p, 100)}%`, background: sigColor }} />
//             </div>
//           </div>

//           <div className="grid grid-cols-2 gap-3">
//             {[
//               { icon: "📡", label: "Interface",    value: wifiDetails.interface ?? "—" },
//               { icon: "🌐", label: "IP Address",   value: wifiDetails.ip ?? "—" },
//               { icon: "📶", label: "Level",        value: `${wifiDetails.signal_level ?? "—"} dBm` },
//               { icon: "🔗", label: "Link Quality", value: wifiDetails.link_quality ?? "—", sub: lqPct !== null ? `${lqPct}% quality` : null },
//             ].map((item) => (
//               <div key={item.label} className="bg-slate-100 dark:bg-slate-800 rounded-2xl p-4">
//                 <div className="text-xs font-black uppercase tracking-wider text-slate-500 mb-1">
//                   {item.icon} {item.label}
//                 </div>
//                 <div className="text-base font-black font-mono break-all">{item.value}</div>
//                 {item.sub && <div className="text-xs text-slate-400 mt-1">{item.sub}</div>}
//               </div>
//             ))}
//           </div>

//           <div className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-sm font-black uppercase tracking-widest"
//                style={{ background: "rgba(74,222,128,0.07)", border: "1px solid rgba(74,222,128,0.2)", color: "#4ade80" }}>
//             <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
//             Connected & Active
//           </div>
//         </div>
//       ) : (
//         <div className="text-center py-10">
//           <div className="text-6xl mb-4">📡</div>
//           <p className="font-bold text-lg">No WiFi Data</p>
//           <p className="text-slate-500 text-sm mt-1">Check robot connection</p>
//         </div>
//       )}
//     </Modal>
//   );
// }

// // ── Theme Modal ────────────────────────────────────────────────────────
// function ThemeModal({ localTheme, onChange, onClose }) {
//   const options = [
//     { value: "light", label: "Light Mode", icon: "🌞" },
//     { value: "dark",  label: "Dark Mode",  icon: "🌙" },
//   ];
//   return (
//     <Modal title="Appearance" emoji="🎨" onClose={onClose}>
//       <div className="grid grid-cols-2 gap-4">
//         {options.map((opt) => (
//           <button
//             key={opt.value}
//             onClick={() => { onChange(opt.value); onClose(); }}
//             className={`
//               rounded-3xl border-3 transition-all
//               flex flex-col items-center justify-center gap-3
//               min-h-[140px] p-5
//               touch-manipulation active:scale-95
//               ${localTheme === opt.value
//                 ? "border-sky-500 bg-sky-500/10 shadow-lg shadow-sky-500/20"
//                 : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 opacity-70 hover:opacity-100"
//               }
//             `}
//           >
//             <span className="text-6xl">{opt.icon}</span>
//             <span className="font-black uppercase text-base leading-tight">{opt.label}</span>
//             {localTheme === opt.value && (
//               <span className="text-xs font-bold text-sky-500 uppercase tracking-wider">Active</span>
//             )}
//           </button>
//         ))}
//       </div>
//     </Modal>
//   );
// }

// // ── Language Modal ─────────────────────────────────────────────────────

// function LanguageModal({ localLanguage, onChange, onClose }) {
//   const options = [
//     { value: "en", label: "English",  flag: "🇬🇧" },
//     { value: "mr", label: "Marathi",  flag: "🇮🇳" },
//     { value: "hi", label: "Hindi",    flag: "🇮🇳" },
//     { value: "jp", label: "Japanese", flag: "🇯🇵" },
//   ];
//   return (
//     <Modal title="Language" emoji="🌐" onClose={onClose}>
//       <div className="grid grid-cols-2 gap-4">
//         {options.map((opt) => (
//           <button
//             key={opt.value}
//             onClick={() => { onChange(opt.value); onClose(); }}
//             className={`
//               rounded-3xl border-3 transition-all
//               flex flex-col items-center justify-center gap-3
//               min-h-[130px] p-4
//               touch-manipulation active:scale-95
//               ${localLanguage === opt.value
//                 ? "border-sky-500 bg-sky-500/10 shadow-lg shadow-sky-500/20"
//                 : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 opacity-70 hover:opacity-100"
//               }
//             `}
//           >
//             <span className="text-5xl">{opt.flag}</span>
//             <span className="font-black uppercase text-base">{opt.label}</span>
//             {localLanguage === opt.value && (
//               <span className="text-xs font-bold text-sky-500 uppercase tracking-wider">Selected</span>
//             )}
//           </button>
//         ))}
//       </div>
//     </Modal>
//   );
// }

// // ── Actuator Modal ─────────────────────────────────────────────────────────
// // Three buttons: Up, Down, Stop in compact layout
// //   Click Up    → call /actuator_up (start moving up)
// //   Click Down  → call /actuator_down (start moving down)
// //   Click Stop  → call /actuator_stop (stop motion)
// // ──────────────────────────────────────────────────────────────────────────
// function ActuatorModal({ connected, callService, onClose }) {
//   const [active,    setActive]    = useState("idle"); // "idle" | "up" | "down"
//   const [statusMsg, setStatusMsg] = useState("");
//   const [isError,   setIsError]   = useState(false);

//   // ── Start actuator in given direction ──────────────────
//   const startActuator = useCallback((direction) => {
//     if (!connected || active !== "idle") return;

//     const serviceName = direction === "up" ? "/actuator_up" : "/actuator_down";

//     setActive(direction);
//     setStatusMsg("");
//     setIsError(false);

//     callService(
//       serviceName,
//       "std_srvs/srv/Trigger",
//       {},
//       (result) => {
//         console.log(`[Actuator] ${direction.toUpperCase()} →`, result);
//         if (!result.success) {
//           setStatusMsg(result.message || `${direction.toUpperCase()} rejected`);
//           setIsError(true);
//           setActive("idle");
//         }
//       },
//       (err) => {
//         console.error(`[Actuator] ${direction.toUpperCase()} error:`, err);
//         setStatusMsg(`Error: ${err}`);
//         setIsError(true);
//         setActive("idle");
//       }
//     );
//   }, [connected, active, callService]);

//   // ── Stop actuator ──────────────────
//   const stopActuator = useCallback(() => {
//     if (active === "idle") return;

//     setActive("idle");
//     setStatusMsg("");
//     setIsError(false);

//     callService(
//       "/actuator_stop",
//       "std_srvs/srv/Trigger",
//       {},
//       (result) => { console.log("[Actuator] STOP →", result); },
//       (err) => { console.warn("[Actuator] STOP error:", err); }
//     );
//   }, [active, callService]);

//   return (
//     <Modal title="Actuator Control" emoji="⚙️" onClose={onClose}>
//       <div className="space-y-2 sm:space-y-3">

//         {/* Connection warning */}
//         {!connected && (
//           <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20
//                           border-2 border-red-300 dark:border-red-700
//                           rounded-xl px-3 py-2 text-sm">
//             <span className="text-lg shrink-0">⚠️</span>
//             <p className="font-bold text-red-600 dark:text-red-400 text-xs">
//               Robot offline
//             </p>
//           </div>
//         )}

//         {/* Status / error message */}
//         {statusMsg && (
//           <div className={`flex items-center gap-2 rounded-xl px-3 py-2 border-2 text-xs
//             ${isError
//               ? "bg-orange-50 dark:bg-orange-900/20 border-orange-300 dark:border-orange-700"
//               : "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-300 dark:border-emerald-700"
//             }`}>
//             <span className="text-sm shrink-0">{isError ? "❌" : "✅"}</span>
//             <p className={`font-bold ${isError ? "text-orange-600 dark:text-orange-400" : "text-emerald-600 dark:text-emerald-400"}`}>
//               {statusMsg}
//             </p>
//           </div>
//         )}

//         {/* Status indicator */}
//         <div className={`
//           flex items-center justify-center gap-2 py-2 px-3 rounded-xl
//           font-black uppercase tracking-widest text-xs transition-all duration-150
//           ${active === "up"
//             ? "bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-400 text-emerald-600 dark:text-emerald-400"
//             : active === "down"
//               ? "bg-orange-50 dark:bg-orange-900/20 border-2 border-orange-400 text-orange-500 dark:text-orange-400"
//               : "bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-400"
//           }
//         `}>
//           <span
//             className={`w-2 h-2 rounded-full ${active !== "idle" ? "animate-pulse" : ""}`}
//             style={{ background: active === "up" ? "#4ade80" : active === "down" ? "#fb923c" : "#94a3b8" }}
//           />
//           {active === "up"   ? "Moving Up"   :
//            active === "down" ? "Moving Down" :
//            "Ready"}
//         </div>

//         {/* ▲ UP button */}
//         <button
//           onClick={() => startActuator("up")}
//           disabled={!connected || active !== "idle"}
//           className={`
//             w-full rounded-2xl border-3 transition-all select-none
//             flex flex-col items-center justify-center gap-1
//             py-2 sm:py-3 px-4 touch-manipulation
//             ${!connected || active !== "idle"
//               ? "opacity-40 cursor-not-allowed border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800"
//               : "border-emerald-300 bg-white dark:bg-slate-900 hover:bg-emerald-50 hover:border-emerald-400 active:scale-95"
//             }
//           `}
//           style={{ WebkitUserSelect: "none", userSelect: "none" }}
//         >
//           <span className="text-3xl sm:text-4xl">▲</span>
//           <span className="font-black uppercase text-sm sm:text-base tracking-wide text-emerald-600 dark:text-emerald-400">
//             Up
//           </span>
//         </button>

//         {/* ▼ DOWN button */}
//         <button
//           onClick={() => startActuator("down")}
//           disabled={!connected || active !== "idle"}
//           className={`
//             w-full rounded-2xl border-3 transition-all select-none
//             flex flex-col items-center justify-center gap-1
//             py-2 sm:py-3 px-4 touch-manipulation
//             ${!connected || active !== "idle"
//               ? "opacity-40 cursor-not-allowed border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800"
//               : "border-orange-300 bg-white dark:bg-slate-900 hover:bg-orange-50 hover:border-orange-400 active:scale-95"
//             }
//           `}
//           style={{ WebkitUserSelect: "none", userSelect: "none" }}
//         >
//           <span className="text-3xl sm:text-4xl">▼</span>
//           <span className="font-black uppercase text-sm sm:text-base tracking-wide text-orange-500 dark:text-orange-400">
//             Down
//           </span>
//         </button>

//         {/* ⏹ STOP button */}
//         <button
//           onClick={stopActuator}
//           disabled={!connected || active === "idle"}
//           className={`
//             w-full rounded-2xl border-3 transition-all select-none
//             flex flex-col items-center justify-center gap-1
//             py-2 sm:py-3 px-4 touch-manipulation
//             ${!connected || active === "idle"
//               ? "opacity-40 cursor-not-allowed border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800"
//               : "border-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 hover:border-red-500 active:scale-95"
//             }
//           `}
//           style={{ WebkitUserSelect: "none", userSelect: "none" }}
//         >
//           <span className="text-3xl sm:text-4xl">⏹</span>
//           <span className={`font-black uppercase text-sm sm:text-base tracking-wide ${active === "idle" ? "text-slate-400" : "text-red-600 dark:text-red-400"}`}>
//             Stop
//           </span>
//         </button>
//       </div>
//     </Modal>
//   );
// }
// // ── Saved Toast ────────────────────────────────────────────────────────
// function SavedToast({ msg }) {
//   return ReactDOM.createPortal(
//     <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[99999]
//                     bg-slate-900 text-white
//                     px-6 py-4 rounded-2xl shadow-2xl
//                     flex items-center gap-3
//                     font-black uppercase tracking-widest text-sm
//                     animate-[fadeUp_.3s_ease_both]">
//       <span className="text-green-400 text-xl">✓</span>
//       {msg}
//     </div>,
//     document.body
//   );
// }

// // ══════════════════════════════════════════════════════════════════════════
// // Settings — main component
// // ══════════════════════════════════════════════════════════════════════════
// export default function Settings({ darkMode, setDarkMode, isSidebarOpen }) {
//   const { language, setLanguage, t } = useLanguage();
//   const { connected, subscribe, callService } = useROS();

//   const [localTheme,    setLocalTheme]    = useState("light");
//   const [localLanguage, setLocalLanguage] = useState("en");
//   const [toastMsg,      setToastMsg]      = useState("");
//   const [showToast,     setShowToast]     = useState(false);

//   const [showWiFiModal,      setShowWiFiModal]      = useState(false);
//   const [showThemeModal,     setShowThemeModal]      = useState(false);
//   const [showLanguageModal,  setShowLanguageModal]   = useState(false);
//   const [showActuatorModal,  setShowActuatorModal]   = useState(false);

//   const [wifiDetails, setWifiDetails] = useState(null);
//   const wifiUnsubRef = useRef(null);

//   useEffect(() => { setLocalTheme(darkMode ? "dark" : "light"); }, [darkMode]);
//   useEffect(() => { setLocalLanguage(language); }, [language]);

//   // WiFi subscription
//   useEffect(() => {
//     wifiUnsubRef.current?.();
//     wifiUnsubRef.current = null;
//     if (!connected) { setWifiDetails(null); return; }
//     wifiUnsubRef.current = subscribe("/wifi_status", "std_msgs/msg/String", msg => {
//       try { setWifiDetails(JSON.parse(msg.data)); }
//       catch (err) { console.error("[Settings] WiFi parse error:", err); }
//     });
//     return () => { wifiUnsubRef.current?.(); wifiUnsubRef.current = null; };
//   }, [connected, subscribe]);

//   const applyAndSave = (theme, lang, msg) => {
//     const isDark = theme === "dark";
//     setDarkMode(isDark);
//     setLanguage(lang);
//     localStorage.setItem("darkMode", String(isDark));
//     localStorage.setItem("language", lang);
//     document.documentElement.classList.toggle("dark", isDark);
//     setToastMsg(msg || t("settings_saved") || "Configuration Applied");
//     setShowToast(true);
//   };

//   const handleThemeChange    = (theme) => { setLocalTheme(theme);   applyAndSave(theme, localLanguage, `Theme set to ${theme === "dark" ? "Dark" : "Light"} Mode`); };
//   const handleLanguageChange = (lang)  => { setLocalLanguage(lang); applyAndSave(localTheme, lang, "Language updated"); };
//   const handleReset          = ()      => { setLocalTheme("light"); setLocalLanguage("en"); applyAndSave("light", "en", "Reset to Factory Defaults"); };

//   useEffect(() => {
//     if (showToast) {
//       const timer = setTimeout(() => setShowToast(false), 2200);
//       return () => clearTimeout(timer);
//     }
//   }, [showToast]);

//   const wifiConnected       = connected && !!wifiDetails?.ssid;
//   const wifiSignalPct       = parseInt(wifiDetails?.signal_percent, 10) || 0;
//   const wifiSignalColor     = getSignalHex(wifiSignalPct);
//   const currentThemeLabel   = localTheme === "dark" ? "Dark Mode 🌙" : "Light Mode 🌞";
//   const currentLanguageLabel = { en: "English 🇬🇧", mr: "Marathi 🇮🇳", hi: "Hindi 🇮🇳", jp: "Japanese 🇯🇵" }[localLanguage] ?? localLanguage;

//   const rowBtn = `
//     w-full bg-white dark:bg-slate-900
//     rounded-2xl border-2 border-slate-200 dark:border-slate-800
//     px-5 py-4 sm:py-5
//     flex items-center justify-between gap-4
//     hover:border-sky-400 hover:shadow-md
//     active:scale-[0.985]
//     transition-all touch-manipulation
//     text-left
//   `;

//   return (
//     <div className="min-h-screen p-4 sm:p-6 bg-gray-50 dark:bg-slate-950 text-slate-900 dark:text-white font-sans">

//       {/* Page title */}
//       <div className="mb-7 border-b-4 border-sky-500 pb-4">
//         <h2 className="font-black tracking-tighter uppercase text-3xl sm:text-4xl">
//           ⚙️ {t("settings")}
//         </h2>
//         <p className="opacity-50 font-bold mt-1 uppercase tracking-widest text-sky-600 dark:text-sky-400 text-sm">
//           System Configuration & Network
//         </p>
//       </div>

//       <div className="max-w-2xl mx-auto space-y-3 sm:space-y-4">

//         {/* ── ROBOT ID ── */}
//         <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6
//                         shadow border-2 border-slate-200 dark:border-slate-800">
//           <div className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-2">
//             {t("robot_id")}
//           </div>
//           <div className="font-mono font-black tracking-tighter text-2xl sm:text-3xl text-slate-700 dark:text-sky-100">
//             {MACHINE_ID}
//           </div>
//         </div>

//         {/* ── NETWORK CONNECTION ── */}
//         <div>
//           <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 pl-1">Network</p>
//           <button className={rowBtn} onClick={() => setShowWiFiModal(true)}>
//             <div className="flex items-center gap-4">
//               <div className="w-12 h-12 rounded-xl bg-sky-50 dark:bg-sky-900/30 flex items-center justify-center text-2xl shrink-0">📶</div>
//               <div>
//                 <div className="font-black text-base sm:text-lg">Network Connection</div>
//                 {wifiConnected ? (
//                   <div className="flex items-center gap-1.5 mt-0.5">
//                     <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: wifiSignalColor }} />
//                     <span className="text-sm font-bold" style={{ color: wifiSignalColor }}>
//                       {wifiDetails.ssid} · {wifiSignalPct}%
//                     </span>
//                   </div>
//                 ) : (
//                   <div className="text-sm text-slate-400 font-semibold mt-0.5">
//                     {connected ? "No WiFi data" : "Robot offline"}
//                   </div>
//                 )}
//               </div>
//             </div>
//             <span className="text-slate-400 text-xl shrink-0">›</span>
//           </button>
//         </div>

//         {/* ── ACTUATOR CONTROL ── */}
//         <div>
//           <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 pl-1">Hardware</p>
//           <button className={rowBtn} onClick={() => setShowActuatorModal(true)}>
//             <div className="flex items-center gap-4">
//               <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-2xl shrink-0">
//                 ⬆⬇
//               </div>
//               <div>
//                 <div className="font-black text-base sm:text-lg">Actuator Control</div>
//                 <div className="text-sm text-slate-400 font-semibold mt-0.5">
//                   {connected ? "Robot connected · Ready to control" : "Robot offline"}
//                 </div>
//               </div>
//             </div>
//             <span className="text-slate-400 text-xl shrink-0">›</span>
//           </button>
//         </div>

//         {/* ── THEME ── */}
//         <div>
//           <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 pl-1">Appearance</p>
//           <button className={rowBtn} onClick={() => setShowThemeModal(true)}>
//             <div className="flex items-center gap-4">
//               <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-2xl shrink-0">🎨</div>
//               <div>
//                 <div className="font-black text-base sm:text-lg">{t("theme")}</div>
//                 <div className="text-sm text-slate-500 dark:text-slate-400 font-semibold mt-0.5">{currentThemeLabel}</div>
//               </div>
//             </div>
//             <span className="text-slate-400 text-xl shrink-0">›</span>
//           </button>
//         </div>

//         {/* ── LANGUAGE ── */}
//         <div>
//           <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 pl-1">Language selection</p>
//           <button className={rowBtn} onClick={() => setShowLanguageModal(true)}>
//             <div className="flex items-center gap-4">
//               <div className="w-12 h-12 rounded-xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-2xl shrink-0">🌐</div>
//               <div>
//                 <div className="font-black text-base sm:text-lg">{t("language")}</div>
//                 <div className="text-sm text-slate-500 dark:text-slate-400 font-semibold mt-0.5">{currentLanguageLabel}</div>
//               </div>
//             </div>
//             <span className="text-slate-400 text-xl shrink-0">›</span>
//           </button>
//         </div>

//         {/* ── RESET ── */}
//         <div className="pt-3 pb-8">
//           <button
//             onClick={handleReset}
//             className="w-full rounded-2xl bg-slate-100 dark:bg-slate-800
//                        text-slate-500 dark:text-slate-400
//                        font-black uppercase tracking-widest
//                        hover:bg-red-500 hover:text-white
//                        active:bg-red-700 active:text-white active:scale-95
//                        transition-all min-h-[64px] py-4 text-base sm:text-lg
//                        touch-manipulation"
//           >
//             Reset to Factory Defaults
//           </button>
//         </div>
//       </div>

//       {/* ── Modals ── */}
//       {showWiFiModal      && <WiFiModal      wifiDetails={wifiDetails}                         onClose={() => setShowWiFiModal(false)} />}
//       {showActuatorModal  && <ActuatorModal  connected={connected} callService={callService}   onClose={() => setShowActuatorModal(false)} />}
//       {showThemeModal     && <ThemeModal     localTheme={localTheme}       onChange={handleThemeChange}    onClose={() => setShowThemeModal(false)} />}
//       {showLanguageModal  && <LanguageModal  localLanguage={localLanguage} onChange={handleLanguageChange} onClose={() => setShowLanguageModal(false)} />}

//       {/* ── Toast ── */}
//       {showToast && <SavedToast msg={toastMsg} />}

//       <style>{`
//         @keyframes fadeUp {
//           from { opacity: 0; transform: translateX(-50%) translateY(12px); }
//           to   { opacity: 1; transform: translateX(-50%) translateY(0); }
//         }
//       `}</style>
//     </div>
//   );
// }





import React, { useEffect, useState, useRef, useCallback } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useROS } from "../context/RosContext";
import ReactDOM from "react-dom";

const MACHINE_ID = "TEIMOVER500M20265001";
const SAFETY_PIN = "1111";
function getSignalHex(percent) {
  const p = parseInt(percent, 10) || 0;
  if (p >= 70) return "#4ade80";
  if (p >= 40) return "#facc15";
  return "#f87171";
}

function parseLinkQualityPct(lq) {
  if (!lq) return null;
  const [a, b] = lq.split("/").map(Number);
  return b ? Math.round((a / b) * 100) : null;
}

// ── Reusable Modal Shell ───────────────────────────────────────────────────
function Modal({ title, emoji, onClose, children, maxWidth = "max-w-lg" }) {
  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center bg-slate-950/80 backdrop-blur-xl p-3 sm:p-4"
      style={{ zIndex: 99999 }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className={`bg-white dark:bg-slate-900 text-slate-900 dark:text-white
                      rounded-2xl sm:rounded-3xl shadow-[0_0_80px_rgba(0,0,0,0.5)]
                      border-2 sm:border-4 border-sky-500
                      w-full ${maxWidth} max-h-[95vh] overflow-y-auto flex flex-col`}>
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-slate-900
                        border-b-2 border-sky-500
                        px-4 py-2.5 flex justify-between items-center shrink-0 z-10">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">{emoji}</span>
            <h3 className="font-black uppercase tracking-tighter text-lg">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800
                       hover:bg-red-500 hover:text-white active:bg-red-700
                       transition-all flex items-center justify-center
                       text-lg font-black shrink-0 touch-manipulation"
          >✕</button>
        </div>
        {/* Body */}
        <div className="p-4 sm:p-5">{children}</div>
      </div>
    </div>,
    document.body
  );
}

// ── WiFi Modal ─────────────────────────────────────────────────────────────
function WiFiModal({ wifiDetails, onClose }) {
  const p        = parseInt(wifiDetails?.signal_percent, 10) || 0;
  const sigColor = getSignalHex(p);
  const lqPct    = parseLinkQualityPct(wifiDetails?.link_quality);
  const label    = p >= 70 ? "Excellent" : p >= 50 ? "Good" : p >= 30 ? "Fair" : "Weak";

  return (
    <Modal title="Network Connection" emoji="📶" onClose={onClose}>
      {wifiDetails ? (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-sky-500/10 to-sky-600/10
                          rounded-2xl p-5 border-2 border-sky-500/30">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-2xl font-black">{wifiDetails.ssid ?? "—"}</div>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ background: sigColor }} />
                  <span className="text-sm font-bold uppercase" style={{ color: sigColor }}>{label}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-5xl font-black" style={{ color: sigColor }}>{p}%</div>
                <div className="text-xs font-bold text-slate-500 mt-1 uppercase">Signal</div>
              </div>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700">
              <div className="h-2 rounded-full transition-all" style={{ width: `${Math.min(p, 100)}%`, background: sigColor }} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: "📡", label: "Interface",    value: wifiDetails.interface ?? "—" },
              { icon: "🌐", label: "IP Address",   value: wifiDetails.ip ?? "—" },
              { icon: "📶", label: "Level",        value: `${wifiDetails.signal_level ?? "—"} dBm` },
              { icon: "🔗", label: "Link Quality", value: wifiDetails.link_quality ?? "—", sub: lqPct !== null ? `${lqPct}% quality` : null },
            ].map((item) => (
              <div key={item.label} className="bg-slate-100 dark:bg-slate-800 rounded-2xl p-4">
                <div className="text-xs font-black uppercase tracking-wider text-slate-500 mb-1">
                  {item.icon} {item.label}
                </div>
                <div className="text-base font-black font-mono break-all">{item.value}</div>
                {item.sub && <div className="text-xs text-slate-400 mt-1">{item.sub}</div>}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-sm font-black uppercase tracking-widest"
               style={{ background: "rgba(74,222,128,0.07)", border: "1px solid rgba(74,222,128,0.2)", color: "#4ade80" }}>
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Connected & Active
          </div>
        </div>
      ) : (
        <div className="text-center py-10">
          <div className="text-6xl mb-4">📡</div>
          <p className="font-bold text-lg">No WiFi Data</p>
          <p className="text-slate-500 text-sm mt-1">Check robot connection</p>
        </div>
      )}
    </Modal>
  );
}

// ── Theme Modal ────────────────────────────────────────────────────────
function ThemeModal({ localTheme, onChange, onClose }) {
  const options = [
    { value: "light", label: "Light Mode", icon: "🌞" },
    { value: "dark",  label: "Dark Mode",  icon: "🌙" },
  ];
  return (
    <Modal title="Appearance" emoji="🎨" onClose={onClose}>
      <div className="grid grid-cols-2 gap-4">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => { onChange(opt.value); onClose(); }}
            className={`
              rounded-3xl border-3 transition-all
              flex flex-col items-center justify-center gap-3
              min-h-[140px] p-5
              touch-manipulation active:scale-95
              ${localTheme === opt.value
                ? "border-sky-500 bg-sky-500/10 shadow-lg shadow-sky-500/20"
                : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 opacity-70 hover:opacity-100"
              }
            `}
          >
            <span className="text-6xl">{opt.icon}</span>
            <span className="font-black uppercase text-base leading-tight">{opt.label}</span>
            {localTheme === opt.value && (
              <span className="text-xs font-bold text-sky-500 uppercase tracking-wider">Active</span>
            )}
          </button>
        ))}
      </div>
    </Modal>
  );
}

// ── Language Modal ─────────────────────────────────────────────────────
function LanguageModal({ localLanguage, onChange, onClose }) {
  const options = [
    { value: "en", label: "English",  flag: "🇬🇧" },
    { value: "mr", label: "Marathi",  flag: "🇮🇳" },
    { value: "hi", label: "Hindi",    flag: "🇮🇳" },
    { value: "jp", label: "Japanese", flag: "🇯🇵" },
  ];
  return (
    <Modal title="Language" emoji="🌐" onClose={onClose}>
      <div className="grid grid-cols-2 gap-4">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => { onChange(opt.value); onClose(); }}
            className={`
              rounded-3xl border-3 transition-all
              flex flex-col items-center justify-center gap-3
              min-h-[130px] p-4
              touch-manipulation active:scale-95
              ${localLanguage === opt.value
                ? "border-sky-500 bg-sky-500/10 shadow-lg shadow-sky-500/20"
                : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 opacity-70 hover:opacity-100"
              }
            `}
          >
            <span className="text-5xl">{opt.flag}</span>
            <span className="font-black uppercase text-base">{opt.label}</span>
            {localLanguage === opt.value && (
              <span className="text-xs font-bold text-sky-500 uppercase tracking-wider">Selected</span>
            )}
          </button>
        ))}
      </div>
    </Modal>
  );
}

// ── Actuator Modal ─────────────────────────────────────────────────────────
// Up / Down are press-and-hold: while held, publish 1 (up) / -1 (down)
// on a repeating interval; on release, publish 0 once. No service calls
// involved — /actuator_cmd is a plain topic. Stop button removed:
// releasing either button IS the stop, per the /actuator_cmd contract.
// ──────────────────────────────────────────────────────────────────────────
const ACTUATOR_PUBLISH_INTERVAL_MS = 150;

function ActuatorModal({ connected, publish, onClose }) {
  const [direction, setDirection] = useState(null); // null | "up" | "down"
  const intervalRef = useRef(null);

  const sendCmd = useCallback((value) => {
    publish("/actuator_cmd", "std_msgs/msg/Int32", { data: value });
  }, [publish]);

  const clearRepeat = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startActuator = useCallback((dir) => {
    clearRepeat();
    setDirection(dir);
    const value = dir === "up" ? 1 : -1;
    sendCmd(value);                 // immediate first publish
    intervalRef.current = setInterval(() => sendCmd(value), ACTUATOR_PUBLISH_INTERVAL_MS);
  }, [sendCmd, clearRepeat]);

  // Release safety net: if the mouse/finger leaves the button while still
  // "pressed" (e.g. dragged off), treat it as a release so the actuator
  // never gets stuck moving.
  const releaseIfActive = useCallback((dir) => {
    setDirection((current) => {
      if (current === dir) {
        clearRepeat();
        sendCmd(0);
      }
      return current === dir ? null : current;
    });
  }, [sendCmd, clearRepeat]);

  // Safety: clear the interval if the modal unmounts/closes mid-press.
  useEffect(() => () => clearRepeat(), [clearRepeat]);

  return (
    <Modal title="Actuator Control" emoji="⚙️" onClose={onClose}>
      <div className="space-y-2 sm:space-y-3">

        {!connected && (
          <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20
                          border-2 border-red-300 dark:border-red-700
                          rounded-xl px-3 py-2 text-sm">
            <span className="text-lg shrink-0">⚠️</span>
            <p className="font-bold text-red-600 dark:text-red-400 text-xs">
              Robot offline
            </p>
          </div>
        )}

        {/* Status indicator */}
        <div className={`
          flex items-center justify-center gap-2 py-2 px-3 rounded-xl
          font-black uppercase tracking-widest text-xs transition-all duration-150
          ${direction === "up"
            ? "bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-400 text-emerald-600 dark:text-emerald-400"
            : direction === "down"
              ? "bg-orange-50 dark:bg-orange-900/20 border-2 border-orange-400 text-orange-500 dark:text-orange-400"
              : "bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-400"
          }
        `}>
          <span
            className={`w-2 h-2 rounded-full ${direction !== null ? "animate-pulse" : ""}`}
            style={{ background: direction === "up" ? "#4ade80" : direction === "down" ? "#fb923c" : "#94a3b8" }}
          />
          {direction === "up"   ? "Moving Up"   :
           direction === "down" ? "Moving Down" :
           "Ready"}
        </div>

        {/* ▲ UP button — hold to move, release to stop */}
        <button
          onMouseDown={() => startActuator("up")}
          onMouseUp={() => releaseIfActive("up")}
          onMouseLeave={() => releaseIfActive("up")}
          onTouchStart={(e) => { e.preventDefault(); startActuator("up"); }}
          onTouchEnd={(e) => { e.preventDefault(); releaseIfActive("up"); }}
          onTouchCancel={(e) => { e.preventDefault(); releaseIfActive("up"); }}
          className="w-full rounded-2xl border-3 transition-all select-none
                     flex flex-col items-center justify-center gap-1
                     py-2 sm:py-3 px-4 touch-manipulation
                     border-emerald-300 bg-white dark:bg-slate-900
                     hover:bg-emerald-50 hover:border-emerald-400 active:scale-95"
          style={{ WebkitUserSelect: "none", userSelect: "none" }}
        >
          <span className="text-3xl sm:text-4xl">▲</span>
          <span className="font-black uppercase text-sm sm:text-base tracking-wide text-emerald-600 dark:text-emerald-400">
            Up
          </span>
        </button>

        {/* ▼ DOWN button — hold to move, release to stop */}
        <button
          onMouseDown={() => startActuator("down")}
          onMouseUp={() => releaseIfActive("down")}
          onMouseLeave={() => releaseIfActive("down")}
          onTouchStart={(e) => { e.preventDefault(); startActuator("down"); }}
          onTouchEnd={(e) => { e.preventDefault(); releaseIfActive("down"); }}
          onTouchCancel={(e) => { e.preventDefault(); releaseIfActive("down"); }}
          className="w-full rounded-2xl border-3 transition-all select-none
                     flex flex-col items-center justify-center gap-1
                     py-2 sm:py-3 px-4 touch-manipulation
                     border-orange-300 bg-white dark:bg-slate-900
                     hover:bg-orange-50 hover:border-orange-400 active:scale-95"
          style={{ WebkitUserSelect: "none", userSelect: "none" }}
        >
          <span className="text-3xl sm:text-4xl">▼</span>
          <span className="font-black uppercase text-sm sm:text-base tracking-wide text-orange-500 dark:text-orange-400">
            Down
          </span>
        </button>
      </div>
    </Modal>
  );
}

// ── PIN Entry Modal ──────────────────────────────────────────────────────
// Gate for the Safety Control screen. Numeric keypad only — no physical
// keyboard needed, matches the touch-first kiosk pattern used elsewhere.
function PinModal({ onSuccess, onClose }) {
  const [pin, setPin]     = useState("");
  const [error, setError] = useState(false);

  const handleDigit = (d) => {
    if (pin.length >= 4) return;
    const next = pin + d;
    setError(false);
    setPin(next);
    if (next.length === 4) {
      if (next === SAFETY_PIN) {
        setTimeout(() => onSuccess(), 150);
      } else {
        setError(true);
        setTimeout(() => setPin(""), 400);
      }
    }
  };

  const handleBackspace = () => { setError(false); setPin((p) => p.slice(0, -1)); };

  return (
    <Modal title="Enter Safety PIN" emoji="🔒" onClose={onClose} maxWidth="max-w-xs">
      <div className="flex flex-col items-center gap-4">
        <div className={`flex gap-3 ${error ? "animate-[shake_.3s_ease]" : ""}`}>
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full border-2 transition-all ${
                i < pin.length
                  ? error
                    ? "bg-red-500 border-red-500"
                    : "bg-sky-500 border-sky-500"
                  : "border-slate-300 dark:border-slate-600"
              }`}
            />
          ))}
        </div>

        {error && (
          <p className="text-red-500 font-bold text-xs -mt-2">Incorrect PIN, try again</p>
        )}

        <div className="grid grid-cols-3 gap-2 w-full max-w-[220px]">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((d) => (
            <button
              key={d}
              onClick={() => handleDigit(d)}
              className="aspect-square rounded-lg bg-slate-100 dark:bg-slate-800
                         font-black text-base hover:bg-sky-100 dark:hover:bg-sky-900/30
                         active:scale-95 transition-all touch-manipulation"
            >
              {d}
            </button>
          ))}
          <div />
          <button
            onClick={() => handleDigit("0")}
            className="aspect-square rounded-lg bg-slate-100 dark:bg-slate-800
                       font-black text-base hover:bg-sky-100 dark:hover:bg-sky-900/30
                       active:scale-95 transition-all touch-manipulation"
          >
            0
          </button>
          <button
            onClick={handleBackspace}
            className="aspect-square rounded-lg bg-slate-100 dark:bg-slate-800
                       font-black text-sm hover:bg-red-100 dark:hover:bg-red-900/30
                       active:scale-95 transition-all touch-manipulation
                       flex items-center justify-center"
          >
            ⌫
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ── Safety Bypass Modal ──────────────────────────────────────────────────
// Only reachable after a correct PIN. Mirrors the safety toggle that used
// to live on the Mission Control page — same /set_safety_bypass service.
//
// Source of truth is now ONLY the /set_safety_bypass service response —
// there is NO /mission/status subscription involved anywhere for this
// value anymore. We optimistically flip the button on tap, then either
// confirm it (success) or revert it (failure/error) based purely on what
// this single call returns.
function SafetyModal({ connected, safetyActive, setSafetyActive, callService, onClose, showToast }) {
  return (
    <Modal title="Safety Bypass" emoji="⚠️" onClose={onClose} maxWidth="max-w-sm">
      <div className="space-y-3">
        <div className={`flex items-center gap-2 rounded-xl px-3 py-2 border-2 text-xs
          ${safetyActive
            ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-300 dark:border-emerald-700"
            : "bg-orange-50 dark:bg-orange-900/20 border-orange-300 dark:border-orange-700"}`}>
          <span className="text-sm shrink-0">{safetyActive ? "🟢" : "⚠️"}</span>
          <p className={`font-bold ${safetyActive ? "text-emerald-600 dark:text-emerald-400" : "text-orange-600 dark:text-orange-400"}`}>
            {safetyActive ? "Safety systems are currently ON" : "Safety systems are currently BYPASSED"}
          </p>
        </div>

        {!connected && (
          <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20
                          border-2 border-red-300 dark:border-red-700
                          rounded-xl px-3 py-2 text-sm">
            <span className="text-lg shrink-0">⚠️</span>
            <p className="font-bold text-red-600 dark:text-red-400 text-xs">Robot offline</p>
          </div>
        )}

        <button
          onClick={() => {
            if (!connected) { showToast("Robot offline"); return; }

            const bypassValue    = safetyActive;   // true → disable, false → enable
            const optimisticNext = !safetyActive;  // what the button should show right away

            setSafetyActive(optimisticNext);

            callService("/set_safety_bypass", "std_srvs/SetBool", { data: bypassValue }, (res) => {
              if (res?.success) {
                setSafetyActive(optimisticNext); // confirmed — this call is the only source of truth
                showToast(bypassValue ? "Safety Disabled" : "Safety Enabled");
              } else {
                setSafetyActive(safetyActive); // reverted — robot rejected it
                showToast(res?.message ? `Rejected: ${res.message}` : "Command rejected by robot");
              }
            }, (err) => {
              setSafetyActive(safetyActive); // reverted — call errored out
              showToast(`Error: ${err?.message || err || "unknown error"}`);
            });
          }}
          disabled={!connected}
          className={`w-full rounded-xl text-sm font-black uppercase flex items-center justify-center gap-3 shadow-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-[0.98] text-white ${
            safetyActive
              ? "bg-red-600 hover:bg-red-500"
              : "bg-orange-600 hover:bg-orange-500"
          }`}
          style={{ minHeight: 48 }}
        >
          {safetyActive ? "🔴 Safety IS ON — Tap to Disable" : "⚠️ Safety IS OFF — Tap to Enable"}
        </button>
      </div>
    </Modal>
  );
}

// ── Saved Toast ────────────────────────────────────────────────────────
function SavedToast({ msg }) {
  return ReactDOM.createPortal(
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[99999]
                    bg-slate-900 text-white
                    px-6 py-4 rounded-2xl shadow-2xl
                    flex items-center gap-3
                    font-black uppercase tracking-widest text-sm
                    animate-[fadeUp_.3s_ease_both]">
      <span className="text-green-400 text-xl">✓</span>
      {msg}
    </div>,
    document.body
  );
}

// ══════════════════════════════════════════════════════════════════════════
// Settings — main component
// ══════════════════════════════════════════════════════════════════════════
export default function Settings({ darkMode, setDarkMode, isSidebarOpen }) {
  const { language, setLanguage, t } = useLanguage();
  const { connected, subscribe, callService, publish } = useROS();

  const [localTheme,    setLocalTheme]    = useState("light");
  const [localLanguage, setLocalLanguage] = useState("en");
  const [toastMsg,      setToastMsg]      = useState("");
  const [showToast,     setShowToast]     = useState(false);

  const [showWiFiModal,      setShowWiFiModal]      = useState(false);
  const [showThemeModal,     setShowThemeModal]     = useState(false);
  const [showLanguageModal,  setShowLanguageModal]  = useState(false);
  const [showActuatorModal,  setShowActuatorModal]  = useState(false);
  const [showPinModal,       setShowPinModal]       = useState(false);
  const [showSafetyModal,    setShowSafetyModal]    = useState(false);

  const [wifiDetails, setWifiDetails] = useState(null);
  const wifiUnsubRef = useRef(null);

  // Safety state — plain local state now. NOT synced from /mission/status
  // or any other subscription. The only thing that ever changes this is
  // the optimistic flip + confirm/revert inside SafetyModal, driven purely
  // by the /set_safety_bypass service response.
  const [safetyActive, setSafetyActive] = useState(false);

  useEffect(() => { setLocalTheme(darkMode ? "dark" : "light"); }, [darkMode]);
  useEffect(() => { setLocalLanguage(language); }, [language]);

  // WiFi subscription
  useEffect(() => {
    wifiUnsubRef.current?.();
    wifiUnsubRef.current = null;
    if (!connected) { setWifiDetails(null); return; }
    wifiUnsubRef.current = subscribe("/wifi_status", "std_msgs/msg/String", msg => {
      try { setWifiDetails(JSON.parse(msg.data)); }
      catch (err) { console.error("[Settings] WiFi parse error:", err); }
    });
    return () => { wifiUnsubRef.current?.(); wifiUnsubRef.current = null; };
  }, [connected, subscribe]);

  const applyAndSave = (theme, lang, msg) => {
    const isDark = theme === "dark";
    setDarkMode(isDark);
    setLanguage(lang);
    localStorage.setItem("darkMode", String(isDark));
    localStorage.setItem("language", lang);
    document.documentElement.classList.toggle("dark", isDark);
    setToastMsg(msg || t("settings_saved") || "Configuration Applied");
    setShowToast(true);
  };

  // Lightweight toast trigger for flows (like Safety) that don't touch
  // theme/language and so don't need the full applyAndSave path.
  const triggerToast = (msg) => {
    setToastMsg(msg);
    setShowToast(true);
  };

  const handleThemeChange    = (theme) => { setLocalTheme(theme);   applyAndSave(theme, localLanguage, `Theme set to ${theme === "dark" ? "Dark" : "Light"} Mode`); };
  const handleLanguageChange = (lang)  => { setLocalLanguage(lang); applyAndSave(localTheme, lang, "Language updated"); };
  const handleReset          = ()      => { setLocalTheme("light"); setLocalLanguage("en"); applyAndSave("light", "en", "Reset to Factory Defaults"); };

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 2200);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const wifiConnected       = connected && !!wifiDetails?.ssid;
  const wifiSignalPct       = parseInt(wifiDetails?.signal_percent, 10) || 0;
  const wifiSignalColor     = getSignalHex(wifiSignalPct);
  const currentThemeLabel   = localTheme === "dark" ? "Dark Mode 🌙" : "Light Mode 🌞";
  const currentLanguageLabel = { en: "English 🇬🇧", mr: "Marathi 🇮🇳", hi: "Hindi 🇮🇳", jp: "Japanese 🇯🇵" }[localLanguage] ?? localLanguage;

  // ── Grid card button style — 3-per-row layout ──────────────────────────
  // Vertical stack (icon → title → status) so each card compresses cleanly
  // into a 1/3-width column, unlike the old full-width horizontal rowBtn.
  const gridCardBtn = `
    bg-white dark:bg-slate-900
    rounded-2xl border-2 border-slate-200 dark:border-slate-800
    px-3 py-5 sm:py-6
    flex flex-col items-center justify-center gap-2
    hover:border-sky-400 hover:shadow-md
    active:scale-[0.97]
    transition-all touch-manipulation
    min-h-[130px] sm:min-h-[150px]
    text-center
  `;

  return (
    <div className="min-h-screen p-4 sm:p-6 bg-gray-50 dark:bg-slate-950 text-slate-900 dark:text-white font-sans">

      {/* Page title */}
      <div className="mb-7 border-b-4 border-sky-500 pb-4">
        <h2 className="font-black tracking-tighter uppercase text-3xl sm:text-4xl">
          ⚙️ {t("settings")}
        </h2>
        <p className="opacity-50 font-bold mt-1 uppercase tracking-widest text-sky-600 dark:text-sky-400 text-sm">
          System Configuration & Network
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-4">

        {/* ── ROBOT ID ── */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6
                        shadow border-2 border-slate-200 dark:border-slate-800">
          <div className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-2">
            {t("robot_id")}
          </div>
          <div className="font-mono font-black tracking-tighter text-2xl sm:text-3xl text-slate-700 dark:text-sky-100">
            {MACHINE_ID}
          </div>
        </div>

        {/* ── SECTION GRID — 3 per row (2 rows of 3) ── */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4">

          {/* Network */}
          <button className={gridCardBtn} onClick={() => setShowWiFiModal(true)}>
            <div className="w-12 h-12 rounded-xl bg-sky-50 dark:bg-sky-900/30 flex items-center justify-center text-2xl">📶</div>
            <div className="font-black text-sm sm:text-base">Network</div>
            {wifiConnected ? (
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: wifiSignalColor }} />
                <span className="text-xs font-bold" style={{ color: wifiSignalColor }}>
                  {wifiSignalPct}%
                </span>
              </div>
            ) : (
              <div className="text-xs text-slate-400 font-semibold">
                {connected ? "No data" : "Offline"}
              </div>
            )}
          </button>

          {/* Actuator Control */}
          <button className={gridCardBtn} onClick={() => setShowActuatorModal(true)}>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-2xl">⬆⬇</div>
            <div className="font-black text-sm sm:text-base">Actuator</div>
            <div className="text-xs text-slate-400 font-semibold">
              {connected ? "Ready" : "Offline"}
            </div>
          </button>

          {/* Safety Control — PIN gated */}
          <button className={gridCardBtn} onClick={() => setShowPinModal(true)}>
            <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-2xl">🔒</div>
            <div className="font-black text-sm sm:text-base">Safety</div>
            <div className={`text-xs font-semibold ${safetyActive ? "text-slate-400" : "text-orange-500"}`}>
              {safetyActive ? "ON" : "⚠️ Bypassed"}
            </div>
          </button>

          {/* Theme */}
          <button className={gridCardBtn} onClick={() => setShowThemeModal(true)}>
            <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-2xl">🎨</div>
            <div className="font-black text-sm sm:text-base">{t("theme")}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold">{currentThemeLabel}</div>
          </button>

          {/* Language */}
          <button className={gridCardBtn} onClick={() => setShowLanguageModal(true)}>
            <div className="w-12 h-12 rounded-xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-2xl">🌐</div>
            <div className="font-black text-sm sm:text-base">{t("language")}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold">{currentLanguageLabel}</div>
          </button>

          {/* Reset */}
          <button
            onClick={handleReset}
            className={`${gridCardBtn} bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700
                       hover:bg-red-500 hover:border-red-500 hover:text-white active:bg-red-700 active:scale-95`}
          >
            <div className="w-12 h-12 rounded-xl bg-white/50 dark:bg-black/20 flex items-center justify-center text-2xl">↺</div>
            <div className="font-black text-sm sm:text-base uppercase">Reset</div>
            <div className="text-xs opacity-60 font-semibold">Factory defaults</div>
          </button>

        </div>
      </div>

      {/* ── Modals ── */}
      {showWiFiModal      && <WiFiModal      wifiDetails={wifiDetails}                         onClose={() => setShowWiFiModal(false)} />}
      {showActuatorModal  && <ActuatorModal  connected={connected} publish={publish}            onClose={() => setShowActuatorModal(false)} />}
      {showThemeModal     && <ThemeModal     localTheme={localTheme}       onChange={handleThemeChange}    onClose={() => setShowThemeModal(false)} />}
      {showLanguageModal  && <LanguageModal  localLanguage={localLanguage} onChange={handleLanguageChange} onClose={() => setShowLanguageModal(false)} />}
      {showPinModal       && (
        <PinModal
          onSuccess={() => { setShowPinModal(false); setShowSafetyModal(true); }}
          onClose={() => setShowPinModal(false)}
        />
      )}
      {showSafetyModal    && (
        <SafetyModal
          connected={connected}
          safetyActive={safetyActive}
          setSafetyActive={setSafetyActive}
          callService={callService}
          onClose={() => setShowSafetyModal(false)}
          showToast={triggerToast}
        />
      )}

      {/* ── Toast ── */}
      {showToast && <SavedToast msg={toastMsg} />}

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateX(-50%) translateY(12px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25%      { transform: translateX(-6px); }
          75%      { transform: translateX(6px); }
        }
      `}</style>
    </div>
  );
}
