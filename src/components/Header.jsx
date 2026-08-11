

// import React, { useEffect, useState, useRef, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import TaikishaLogo from "../assets/Taikishaimage1.png";
// import { useLanguage } from "../context/LanguageContext";
// import { useROS } from "../context/RosContext";

// // ── Custom SVG Icon Components (Offline-Safe, No CDN) ────────────────────────
// const FiLogOut = ({ size = 16, className = "", style }) => (
//   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
//     <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
//     <polyline points="16 17 21 12 16 7" />
//     <line x1="21" y1="12" x2="9" y2="12" />
//   </svg>
// );

// const FiActivity = ({ size = 16, className = "", style }) => (
//   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
//     <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
//   </svg>
// );

// const FiMenu = ({ size = 16, className = "", style }) => (
//   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
//     <line x1="3" y1="6" x2="21" y2="6" />
//     <line x1="3" y1="12" x2="21" y2="12" />
//     <line x1="3" y1="18" x2="21" y2="18" />
//   </svg>
// );

// const FiX = ({ size = 16, className = "", style }) => (
//   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
//     <line x1="18" y1="6" x2="6" y2="18" />
//     <line x1="6" y1="6" x2="18" y2="18" />
//   </svg>
// );

// const FiGlobe = ({ size = 16, className = "", style }) => (
//   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
//     <circle cx="12" cy="12" r="10" />
//     <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
//   </svg>
// );

// const FiCheckCircle = ({ size = 16, className = "", style }) => (
//   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
//     <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
//     <polyline points="22 4 12 14.01 9 11.01" />
//   </svg>
// );

// const FiShield = ({ size = 16, className = "", style }) => (
//   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
//     <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
//   </svg>
// );

// const FiAlertTriangle = ({ size = 16, className = "", style }) => (
//   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
//     <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3.05h16.94a2 2 0 0 0 1.71-3.05L13.71 3.86a2 2 0 0 0-3.42 0z" />
//     <line x1="12" y1="9" x2="12" y2="13" />
//     <line x1="12" y1="17" x2="12.01" y2="17" />
//   </svg>
// );

// const FiBell = ({ size = 16, className = "", style }) => (
//   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
//     <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
//     <path d="M13.73 21a2 2 0 0 1-3.46 0" />
//   </svg>
// );

// const FiAlertCircle = ({ size = 16, className = "", style }) => (
//   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
//     <circle cx="12" cy="12" r="10" />
//     <line x1="12" y1="8" x2="12" y2="12" />
//     <line x1="12" y1="16" x2="12.01" y2="16" />
//   </svg>
// );

// const FiWifiOff = ({ size = 16, className = "", style }) => (
//   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
//     <line x1="1" y1="1" x2="23" y2="23" />
//     <path d="M16.72 11.06A9 9 0 0 1 19 12.55" />
//     <path d="M5 12.55a9 9 0 0 1 5.64-4.5" />
//     <path d="M12 20h.01" />
//     <path d="M2 2.5A21.9 21.9 0 0 1 12 2c5.33 0 10.23 1.609 14.33 4.26" />
//   </svg>
// );

// const FiZap = ({ size = 16, className = "", style }) => (
//   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
//     <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
//   </svg>
// );

// const FiBattery = ({ size = 16, className = "", style }) => (
//   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
//     <rect x="1" y="6" width="18" height="12" rx="2" ry="2" />
//     <line x1="23" y1="10" x2="23" y2="14" />
//   </svg>
// );

// const FiBatteryCharging = ({ size = 16, className = "", style }) => (
//   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
//     <path d="M5 18H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-3" />
//     <line x1="23" y1="12" x2="23" y2="16" />
//     <polyline points="11 9 13 6 15 9" />
//     <line x1="13" y1="6" x2="13" y2="13" />
//   </svg>
// );

// // ── Constants ──────────────────────────────────────────────────────────────────
// const LANGUAGES = [
//   { code: "en", name: "English", flag: "🇬🇧" },
//   { code: "mr", name: "मराठी",   flag: "🇮🇳" },
//   { code: "hi", name: "हिन्दी", flag: "🇮🇳" },
//   { code: "jp", name: "日本語",  flag: "🇯🇵" },
// ];

// // Faults that persist until reset is pressed
// const PERSISTENT_FAULT_TOPICS = [
//   { name: "work_over",    topic: "/plc/work_over"    },
//   { name: "front_estop",  topic: "/plc/front_estop"  },
//   { name: "back_estop",   topic: "/plc/back_estop"   },
//   { name: "front_bumper", topic: "/plc/front_bumper" },
//   { name: "rear_bumper",  topic: "/plc/back_bumper"  },
// ];

// // Immediate clear topics (no persistence)
// const IMMEDIATE_CLEAR_TOPICS = [
//   { name: "reset",        topic: "/plc/reset"       },
//   { name: "front_lidar",  topic: "/plc/front_lidar" },
//   { name: "back_lidar",   topic: "/plc/back_lidar"  },
// ];

// const INTERLOCK_LABELS = {
//   work_over:    "Pendant Work Over",
//   front_estop:  "Front E-Stop",
//   back_estop:   "Rear E-Stop",
//   reset:        "Fault Reset",
//   front_lidar:  "Front LiDAR",
//   back_lidar:   "Rear LiDAR",
//   front_bumper: "Front Bumper",
//   rear_bumper:  "Rear Bumper",
// };

// // ── Helpers ────────────────────────────────────────────────────────────────────
// function isSignalFaulted(name, msgData) {
//   const faultWhenTrue  = ["work_over", "front_estop", "back_estop"];
//   const faultWhenFalse = ["front_bumper", "rear_bumper", "front_lidar", "back_lidar"];
//   if (faultWhenTrue.includes(name))  return msgData === true;
//   if (faultWhenFalse.includes(name)) return msgData === false;
//   return false;
// }

// function getSignalHex(percent) {
//   const p = parseInt(percent, 10) || 0;
//   if (p >= 70) return "#4ade80";
//   if (p >= 40) return "#facc15";
//   return "#f87171";
// }

// function getSignalClass(percent) {
//   const p = parseInt(percent, 10) || 0;
//   if (p >= 70) return "text-green-400";
//   if (p >= 40) return "text-yellow-400";
//   return "text-red-400";
// }

// function formatDate(d) {
//   return d.toLocaleDateString("en-US", {
//     weekday: "short", year: "numeric", month: "short", day: "numeric",
//   });
// }

// function formatTime(d) {
//   return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
// }

// function formatTimestamp(d) {
//   return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
// }

// // ── StatusDot ──────────────────────────────────────────────────────────────────
// function StatusDot({ color, pulse = true }) {
//   return (
//     <span className={`w-2 h-2 rounded-full shrink-0 border border-white/30 ${color} ${pulse ? "animate-pulse" : ""}`} />
//   );
// }

// // ── Low Battery Alert Modal ────────────────────────────────────────────────────
// function LowBatteryAlert({ percentage, onClose }) {
//   return (
//     <div
//       className="fixed inset-0 flex items-center justify-center z-[1001]"
//       style={{ background: "rgba(0,10,20,0.85)", backdropFilter: "blur(8px)" }}
//       onClick={onClose}
//     >
//       <div
//         className="relative w-full max-w-sm mx-4 rounded-3xl overflow-hidden"
//         style={{
//           background: "linear-gradient(160deg, #7f1d1d 0%, #450a0a 100%)",
//           border: "2px solid rgba(239,68,68,0.4)",
//           boxShadow: "0 0 40px rgba(239,68,68,0.6), 0 25px 60px rgba(0,0,0,0.8)",
//         }}
//         onClick={e => e.stopPropagation()}
//       >
//         <div
//           className="absolute top-0 left-0 right-0 h-px"
//           style={{ background: "linear-gradient(90deg, transparent, rgba(239,68,68,0.8), transparent)" }}
//         />

//         <div className="flex justify-center pt-8">
//           <div
//             className="relative w-24 h-24 rounded-full flex items-center justify-center animate-bounce"
//             style={{
//               background: "rgba(239,68,68,0.2)",
//               border: "3px solid rgba(239,68,68,0.6)",
//               boxShadow: "0 0 30px rgba(239,68,68,0.4), inset 0 0 20px rgba(239,68,68,0.2)",
//             }}
//           >
//             <FiAlertTriangle size={56} style={{ color: "#ef4444" }} />
//           </div>
//         </div>

//         <div className="px-6 py-6 text-center">
//           <h2 className="text-3xl font-black text-white mb-2 tracking-wide">
//             Low Battery Alert! ⚠️
//           </h2>
//           <p className="text-sm text-red-100 mb-6 leading-relaxed">
//             Your battery is running critically low. Please charge the robot immediately to avoid unexpected shutdown.
//           </p>

//           <div
//             className="px-4 py-4 rounded-2xl mb-6 border-2"
//             style={{
//               background: "rgba(239,68,68,0.1)",
//               borderColor: "rgba(239,68,68,0.4)",
//             }}
//           >
//             <div className="flex items-center justify-between mb-3">
//               <span className="text-[11px] font-black uppercase tracking-wider text-red-200">
//                 Current SOC
//               </span>
//               <span className="text-3xl font-black text-red-400">{percentage}%</span>
//             </div>
//             <div className="w-full h-3 rounded-full" style={{ background: "rgba(255,255,255,0.1)" }}>
//               <div
//                 className="h-3 rounded-full transition-all"
//                 style={{
//                   width: `${Math.min(percentage, 100)}%`,
//                   background: "linear-gradient(90deg, #ef4444 0%, #fca5a5 100%)",
//                 }}
//               />
//             </div>
//             <p className="text-xs text-red-200 mt-2 font-semibold">
//               🔌 Plug in the charger now
//             </p>
//           </div>

//           <div className="space-y-3">
//             <button
//               onClick={() => {}}
//               className="w-full py-3 rounded-xl font-black text-sm uppercase tracking-wider text-white transition-all active:scale-95"
//               style={{
//                 background: "linear-gradient(135deg, #ef4444 0%, #f87171 100%)",
//                 boxShadow: "0 8px 20px rgba(239,68,68,0.4)",
//               }}
//             >
//               <FiZap size={18} className="inline mr-2" />
//               Charge Now
//             </button>
//             <button
//               onClick={onClose}
//               className="w-full py-3 rounded-xl font-black text-sm uppercase tracking-wider text-red-200 transition-all active:scale-95"
//               style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(239,68,68,0.3)" }}
//             >
//               Dismiss
//             </button>
//           </div>
//         </div>

//         <div
//           className="px-6 py-3 border-t text-center text-[11px] font-semibold text-red-200"
//           style={{ borderColor: "rgba(239,68,68,0.2)", background: "rgba(0,0,0,0.3)" }}
//         >
//           ⏰ Estimated time remaining: Low
//         </div>
//       </div>
//     </div>
//   );
// }

// // ── Battery Modal ──────────────────────────────────────────────────────────────
// function BatteryModal({ batteryData, connected, onClose }) {
//   const hasData = connected && batteryData;
//   const percentage = hasData ? batteryData.percentage : 0;
//   const isCharging = hasData ? batteryData.charging : false;
//   const isDischarging = hasData ? batteryData.discharging : false;
//   const color = hasData ? getSignalHex(percentage) : "#94a3b8";

//   const avgTemp = hasData && batteryData.temperatures?.length > 0
//     ? (batteryData.temperatures.reduce((a, b) => a + b, 0) / batteryData.temperatures.length).toFixed(1)
//     : null;
//   const maxTemp = hasData && batteryData.temperatures?.length > 0
//     ? Math.max(...batteryData.temperatures).toFixed(1)
//     : null;

//   const avgVoltage = hasData && batteryData.cellVoltages?.length > 0
//     ? (batteryData.cellVoltages.reduce((a, b) => a + b, 0) / batteryData.cellVoltages.length).toFixed(3)
//     : null;
//   const minVoltage = hasData && batteryData.cellVoltages?.length > 0
//     ? Math.min(...batteryData.cellVoltages).toFixed(3)
//     : null;
//   const maxVoltage = hasData && batteryData.cellVoltages?.length > 0
//     ? Math.max(...batteryData.cellVoltages).toFixed(3)
//     : null;

//   const currentValue = hasData ? parseFloat(batteryData.current) : 0;
//   // Sign convention from /battery/current: + = charging (current flowing in),
//   // - = discharging (current flowing out). We use the sign only to determine
//   // status/color; the displayed magnitude is always shown as a positive number.
//   const currentStatus = currentValue > 0.1 ? "Charging ⚡" : currentValue < -0.1 ? "Discharging 🔋" : "Idle";
//   const absCurrentDisplay = hasData && batteryData.current != null
//     ? Math.abs(currentValue).toFixed(2)
//     : null;

//   return (
//     <div
//       className="fixed inset-0 flex items-center justify-center z-[1000] p-3"
//       style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
//       onClick={onClose}
//     >
//       <div
//         className="relative w-full max-w-2xl mx-auto rounded-3xl overflow-hidden max-h-[92vh] flex flex-col"
//         style={{
//           background: "linear-gradient(160deg, #ffffff 0%, #f8fafc 100%)",
//           border: "1px solid rgba(148,163,184,0.2)",
//           boxShadow: "0 25px 60px rgba(0,0,0,0.15), 0 0 0 1px rgba(148,163,184,0.1)",
//         }}
//         onClick={e => e.stopPropagation()}
//       >
//         <div
//           className="absolute top-0 left-0 right-0 h-1"
//           style={{ 
//             background: !connected 
//               ? "linear-gradient(90deg, #94a3b8, #64748b)" 
//               : isCharging 
//                 ? "linear-gradient(90deg, #22c55e, #4ade80)" 
//                 : "linear-gradient(90deg, #3b82f6, #60a5fa)"
//           }}
//         />

//         <div className="flex items-center justify-between px-6 pt-6 pb-4 shrink-0">
//           <div className="flex items-center gap-4">
//             <div
//               className="p-3 rounded-2xl"
//               style={{ 
//                 background: !connected 
//                   ? "rgba(148,163,184,0.1)" 
//                   : isCharging 
//                     ? "rgba(34,197,94,0.12)" 
//                     : "rgba(59,130,246,0.12)",
//                 border: !connected 
//                   ? "1px solid rgba(148,163,184,0.2)" 
//                   : isCharging 
//                     ? "1px solid rgba(34,197,94,0.2)" 
//                     : "1px solid rgba(59,130,246,0.2)"
//               }}
//             >
//               {!connected ? 
//                 <FiBattery size={32} style={{ color: "#94a3b8" }} /> :
//                 isCharging ? 
//                   <FiBatteryCharging size={32} style={{ color: "#22c55e" }} /> : 
//                   <FiBattery size={32} style={{ color: "#3b82f6" }} />
//               }
//             </div>
//             <div>
//               <div className="text-2xl font-black text-slate-800 tracking-wide">
//                 {!connected ? "Battery Offline" : "Battery Status"}
//               </div>
//               <div
//                 className="text-base font-semibold"
//                 style={{ color: !connected ? "#94a3b8" : isCharging ? "#22c55e" : "#64748b" }}
//               >
//                 {!connected ? "No connection" : isCharging ? "🔋 Charging" : isDischarging ? "⚡ Discharging" : "Idle"}
//               </div>
//             </div>
//           </div>
//           <button
//             onClick={onClose}
//             className="p-2.5 rounded-xl transition hover:bg-slate-100 active:scale-95"
//             style={{ background: "rgba(148,163,184,0.08)" }}
//             aria-label="Close"
//           >
//             <FiX size={24} className="text-slate-600" />
//           </button>
//         </div>

//         <div className="overflow-y-auto flex-1 px-5 pb-5">
//           {hasData ? (
//             <>
//               <div
//                 className="mb-5 rounded-2xl p-5 flex items-center justify-between"
//                 style={{ 
//                   background: "rgba(148,163,184,0.06)", 
//                   border: "1px solid rgba(148,163,184,0.15)" 
//                 }}
//               >
//                 <div>
//                   <div className="text-5xl font-black text-slate-800 leading-tight">
//                     {percentage}%
//                   </div>
//                   <div className="flex items-center gap-2 mt-2">
//                     <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: color }} />
//                     <span className="text-base font-black uppercase tracking-wider" style={{ color }}>
//                       {percentage >= 70 ? "Excellent" : percentage >= 40 ? "Good" : "Low"}
//                     </span>
//                   </div>
//                   <div className="font-mono mt-1 text-base" style={{ color: "#94a3b8" }}>
//                     {currentStatus}
//                   </div>
//                 </div>
//                 <div className="relative" style={{ width: "100px", height: "52px" }}>
//                   <svg width="100" height="52" viewBox="0 0 100 52">
//                     <rect x="3" y="3" width="84" height="46" rx="6" fill="rgba(148,163,184,0.1)" stroke="rgba(148,163,184,0.3)" strokeWidth="3"/>
//                     <rect x="90" y="16" width="8" height="20" rx="3" fill="rgba(148,163,184,0.3)"/>
//                     <rect 
//                       x="6" y="6" 
//                       width={Math.max(4, (percentage / 100) * 78)} 
//                       height="40" 
//                       rx="4" 
//                       fill={color}
//                     />
//                     {isCharging && (
//                       <text x="50" y="34" textAnchor="middle" fontSize="20" fontWeight="bold" fill="white">
//                         ⚡
//                       </text>
//                     )}
//                   </svg>
//                 </div>
//               </div>

//               <div className="grid grid-cols-3 gap-3 mb-5">
//                 <div
//                   className="px-4 py-4 rounded-2xl"
//                   style={{ 
//                     background: "rgba(148,163,184,0.06)", 
//                     border: "1px solid rgba(148,163,184,0.12)" 
//                   }}
//                 >
//                   <div className="text-xs font-black uppercase tracking-wider text-slate-500">📊 Voltage</div>
//                   <div className="text-2xl font-black text-slate-800 font-mono mt-1">
//                     {batteryData.voltage ? `${batteryData.voltage}V` : "—"}
//                   </div>
//                 </div>
//                 <div
//                   className="px-4 py-4 rounded-2xl"
//                   style={{ 
//                     background: "rgba(148,163,184,0.06)", 
//                     border: "1px solid rgba(148,163,184,0.12)" 
//                   }}
//                 >
//                   <div className="text-xs font-black uppercase tracking-wider text-slate-500">⚡ Current</div>
//                   <div className="text-2xl font-black font-mono mt-1" style={{ 
//                     color: currentValue > 0.1 ? "#22c55e" : currentValue < -0.1 ? "#eab308" : "#94a3b8" 
//                   }}>
//                     {absCurrentDisplay !== null ? `${absCurrentDisplay}A` : "—"}
//                   </div>
//                 </div>
//                 <div
//                   className="px-4 py-4 rounded-2xl"
//                   style={{ 
//                     background: "rgba(148,163,184,0.06)", 
//                     border: "1px solid rgba(148,163,184,0.12)" 
//                   }}
//                 >
//                   <div className="text-xs font-black uppercase tracking-wider text-slate-500">🔋 SOC</div>
//                   <div className="text-2xl font-black font-mono mt-1" style={{ color }}>
//                     {percentage}%
//                   </div>
//                 </div>
//               </div>

//               <div className="grid grid-cols-3 gap-3 mb-5">
//                 <div
//                   className="px-4 py-3 rounded-2xl text-center text-sm font-black uppercase"
//                   style={{
//                     background: isCharging ? "rgba(34,197,94,0.08)" : "rgba(148,163,184,0.06)",
//                     border: isCharging ? "1px solid rgba(34,197,94,0.2)" : "1px solid rgba(148,163,184,0.12)",
//                     color: isCharging ? "#22c55e" : "#94a3b8"
//                   }}
//                 >
//                   {isCharging ? "⚡ Charging" : "Not Charging"}
//                 </div>
//                 <div
//                   className="px-4 py-3 rounded-2xl text-center text-sm font-black uppercase"
//                   style={{
//                     background: isDischarging ? "rgba(234,179,8,0.08)" : "rgba(148,163,184,0.06)",
//                     border: isDischarging ? "1px solid rgba(234,179,8,0.2)" : "1px solid rgba(148,163,184,0.12)",
//                     color: isDischarging ? "#eab308" : "#94a3b8"
//                   }}
//                 >
//                   {isDischarging ? "🔋 Active" : "Idle"}
//                 </div>
//                 <div
//                   className="px-4 py-3 rounded-2xl text-center text-sm font-black uppercase"
//                   style={{
//                     background: batteryData.chargeAllowed ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.08)",
//                     border: batteryData.chargeAllowed ? "1px solid rgba(34,197,94,0.2)" : "1px solid rgba(239,68,68,0.2)",
//                     color: batteryData.chargeAllowed ? "#22c55e" : "#ef4444"
//                   }}
//                 >
//                   {batteryData.chargeAllowed ? "✓ Can Charge" : "✗ Blocked"}
//                 </div>
//               </div>

//               {batteryData.cellVoltages?.length > 0 && (
//                 <div className="mb-5">
//                   <div 
//                     className="px-4 py-4 rounded-2xl"
//                     style={{ 
//                       background: "rgba(148,163,184,0.06)", 
//                       border: "1px solid rgba(148,163,184,0.12)" 
//                     }}
//                   >
//                     <div className="text-sm font-black uppercase tracking-wider mb-2 text-slate-600">
//                       📈 Cell Voltages ({batteryData.cellVoltages.length} cells)
//                     </div>
//                     <div className="flex gap-2 flex-wrap">
//                       {batteryData.cellVoltages.map((voltage, i) => (
//                         <div 
//                           key={i}
//                           className="px-3 py-2 rounded-xl text-sm font-mono font-black"
//                           style={{
//                             background: voltage < 3.0 ? "rgba(239,68,68,0.12)" : "rgba(34,197,94,0.08)",
//                             border: voltage < 3.0 ? "1px solid rgba(239,68,68,0.2)" : "1px solid rgba(34,197,94,0.15)",
//                             color: voltage < 3.0 ? "#ef4444" : "#22c55e"
//                           }}
//                         >
//                           {voltage.toFixed(2)}V
//                         </div>
//                       ))}
//                     </div>
//                     {minVoltage && maxVoltage && (
//                       <div className="flex gap-6 mt-3 text-sm font-mono text-slate-600">
//                         <span>Min: <span className="font-black text-slate-800">{minVoltage}V</span></span>
//                         <span>Avg: <span className="font-black text-slate-800">{avgVoltage}V</span></span>
//                         <span>Max: <span className="font-black text-slate-800">{maxVoltage}V</span></span>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               )}

//               {batteryData.temperatures?.length > 0 && (
//                 <div className="mb-5">
//                   <div 
//                     className="px-4 py-4 rounded-2xl"
//                     style={{ 
//                       background: "rgba(148,163,184,0.06)", 
//                       border: "1px solid rgba(148,163,184,0.12)" 
//                     }}
//                   >
//                     <div className="text-sm font-black uppercase tracking-wider mb-2 text-slate-600">
//                       🌡️ Temperatures ({batteryData.temperatures.length} sensors)
//                     </div>
//                     <div className="flex gap-2 flex-wrap">
//                       {batteryData.temperatures.map((temp, i) => (
//                         <div 
//                           key={i}
//                           className="px-3 py-2 rounded-xl text-sm font-mono font-black"
//                           style={{
//                             background: temp > 45 ? "rgba(239,68,68,0.12)" : temp > 40 ? "rgba(234,179,8,0.12)" : "rgba(34,197,94,0.08)",
//                             border: temp > 45 ? "1px solid rgba(239,68,68,0.2)" : temp > 40 ? "1px solid rgba(234,179,8,0.2)" : "1px solid rgba(34,197,94,0.15)",
//                             color: temp > 45 ? "#ef4444" : temp > 40 ? "#eab308" : "#22c55e"
//                           }}
//                         >
//                           {temp.toFixed(1)}°C
//                         </div>
//                       ))}
//                     </div>
//                     {avgTemp && maxTemp && (
//                       <div className="flex gap-6 mt-3 text-sm font-mono text-slate-600">
//                         <span>Avg: <span className="font-black text-slate-800">{avgTemp}°C</span></span>
//                         <span>Max: <span className="font-black text-slate-800">{maxTemp}°C</span></span>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               )}

//               {batteryData.faults && (
//                 <div 
//                   className="px-4 py-4 rounded-2xl"
//                   style={{ 
//                     background: "rgba(148,163,184,0.06)", 
//                     border: "1px solid rgba(148,163,184,0.12)" 
//                   }}
//                 >
//                   <div className="text-sm font-black uppercase tracking-wider mb-2 text-slate-600">
//                     ⚠️ Fault Status
//                   </div>
//                   {batteryData.faults.battery_status && (
//                     <div className="text-sm font-mono" style={{ color: "#64748b" }}>
//                       {Object.entries(batteryData.faults.battery_status)
//                         .filter(([_, v]) => v === true)
//                         .length === 0 ? (
//                         <span className="text-green-600 font-bold text-base">✓ No faults detected</span>
//                       ) : (
//                         Object.entries(batteryData.faults.battery_status)
//                           .filter(([_, v]) => v === true)
//                           .map(([key, _]) => (
//                             <div key={key} className="text-red-500 font-bold text-base">• {key.replace(/_/g, " ")}</div>
//                           ))
//                       )}
//                     </div>
//                   )}
//                 </div>
//               )}
//             </>
//           ) : (
//             <div className="text-center py-16 px-6">
//               <FiAlertTriangle className="mx-auto text-yellow-500 mb-4" size={56} />
//               <p className="text-slate-700 font-bold text-xl">
//                 {!connected ? "Robot Offline" : "No battery data available"}
//               </p>
//               <p className="text-slate-500 text-base mt-2">
//                 {!connected ? "Check robot connection" : "Check ROS connection"}
//               </p>
//             </div>
//           )}
//         </div>

//         <div className="px-5 pb-5 shrink-0 border-t border-slate-200/50 pt-4">
//           <button
//             onClick={onClose}
//             className="w-full py-4 rounded-2xl font-black text-lg uppercase tracking-wider text-white transition-all active:scale-95"
//             style={{ 
//               background: "linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)",
//               boxShadow: "0 8px 20px rgba(59,130,246,0.3)"
//             }}
//           >
//             Close
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ── Faults Modal ──────────────────────────────────────────────────────────────
// function FaultsModal({ faults, onClose, connected }) {
//   const activeFaults = faults.filter(f => f.active);
//   const faultCount = activeFaults.length;

//   return (
//     <div
//       className="fixed inset-0 flex items-center justify-center z-[1000]"
//       style={{ background: "rgba(0,10,20,0.78)", backdropFilter: "blur(6px)" }}
//       onClick={onClose}
//     >
//       <div
//         className="relative w-full max-w-2xl mx-4 rounded-2xl overflow-hidden max-h-[80vh] flex flex-col"
//         style={{
//           background: "linear-gradient(160deg, #0f172a 0%, #0c1a2e 100%)",
//           border: "1px solid rgba(56,189,248,0.15)",
//           boxShadow: "0 25px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)",
//         }}
//         onClick={e => e.stopPropagation()}
//       >
//         <div
//           className="absolute top-0 left-0 right-0 h-px"
//           style={{ background: "linear-gradient(90deg, transparent, rgba(56,189,248,0.6), transparent)" }}
//         />

//         <div className="flex items-center justify-between px-5 pt-5 pb-4 shrink-0">
//           <div className="flex items-center gap-3">
//             <div
//               className="p-2.5 rounded-xl"
//               style={{
//                 background: !connected ? "rgba(107,114,128,0.12)" : faultCount > 0 ? "rgba(239,68,68,0.12)" : "rgba(74,222,128,0.12)",
//                 border:     !connected ? "1px solid rgba(107,114,128,0.2)" : faultCount > 0 ? "1px solid rgba(239,68,68,0.2)" : "1px solid rgba(74,222,128,0.2)",
//               }}
//             >
//               {!connected
//                 ? <FiWifiOff    size={24} style={{ color: "#6b7280" }} />
//                 : faultCount > 0
//                 ? <FiAlertCircle size={24} style={{ color: "#ef4444" }} />
//                 : <FiCheckCircle size={24} style={{ color: "#4ade80" }} />
//               }
//             </div>
//             <div>
//               <div className="text-white font-black text-lg tracking-wide">
//                 {!connected ? "Robot Disconnected" : faultCount > 0 ? "System Faults" : "All Clear"}
//               </div>
//               <div
//                 className="text-xs font-semibold"
//                 style={{
//                   color: !connected ? "rgba(107,114,128,0.7)" : faultCount > 0 ? "rgba(239,68,68,0.7)" : "rgba(74,222,128,0.7)",
//                 }}
//               >
//                 {!connected
//                   ? "Waiting for robot connection..."
//                   : faultCount > 0
//                     ? `${faultCount} fault${faultCount === 1 ? "" : "s"} active (press RESET to clear)`
//                     : "No active faults"}
//               </div>
//             </div>
//           </div>
//           <button
//             onClick={onClose}
//             className="p-2 rounded-xl transition"
//             style={{ background: "rgba(255,255,255,0.06)" }}
//             aria-label="Close"
//           >
//             <FiX size={20} className="text-white/60" />
//           </button>
//         </div>

//         <div className="overflow-y-auto flex-1 px-4 py-3 space-y-3">
//           {!connected ? (
//             <div className="flex flex-col items-center justify-center py-12">
//               <FiWifiOff size={48} className="text-gray-500 mb-3" />
//               <p className="text-white font-bold text-lg">Robot Offline</p>
//             </div>

//           ) : faultCount === 0 ? (
//             <div className="flex flex-col items-center justify-center py-12">
//               <div
//                 className="rounded-full mb-4 shadow-lg flex items-center justify-center"
//                 style={{
//                   width: 80, height: 80,
//                   backgroundColor: "#4ade80",
//                   boxShadow: "0 0 20px 5px rgba(74,222,128,0.5)",
//                 }}
//               >
//                 <FiCheckCircle size={48} style={{ color: "white" }} />
//               </div>
//               <p className="text-white font-bold text-lg">All Clear ✅</p>
//               <p className="text-slate-400 text-sm mt-1">No active faults</p>
//             </div>

//           ) : (
//             <>
//               {activeFaults.map((fault) => (
//                 <div
//                   key={fault.id}
//                   className="p-4 rounded-xl"
//                   style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}
//                 >
//                   <div className="flex items-center gap-3">
//                     <div
//                       className="rounded-full shadow-lg animate-pulse shrink-0"
//                       style={{
//                         width: 24, height: 24,
//                         backgroundColor: "#ef4444",
//                         boxShadow: "0 0 12px 3px rgba(239,68,68,0.8)",
//                       }}
//                     />
//                     <div className="min-w-0 flex-1">
//                       <div className="font-black text-white text-base">
//                         {INTERLOCK_LABELS[fault.id] || fault.id}
//                       </div>
//                       <div className="text-xs font-semibold mt-1" style={{ color: "rgba(239,68,68,0.8)" }}>
//                         ⚠️ FAULT TRIGGERED at {formatTimestamp(fault.timestamp)}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </>
//           )}
//         </div>

//         <div className="px-4 pb-4 shrink-0">
//           <button
//             onClick={onClose}
//             className="w-full py-3 rounded-xl font-black text-sm uppercase tracking-wider text-white transition-all active:scale-95"
//             style={{ background: "linear-gradient(135deg, #0369a1 0%, #0ea5e9 100%)" }}
//           >
//             Close
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ── Main Header Component ──────────────────────────────────────────────────────
// export default function Header() {
//   const navigate = useNavigate();
//   const { t, language, setLanguage } = useLanguage();
//   const { connected, rosConfig, subscribe } = useROS();

//   const [mobileMenuOpen,      setMobileMenuOpen]      = useState(false);
//   const [langDropdownOpen,    setLangDropdownOpen]    = useState(false);
//   const [currentDateTime,     setCurrentDateTime]     = useState(new Date());
//   const [safetyActive,        setSafetyActive]        = useState(false);
//   const [missionStatus,       setMissionStatus]       = useState("offline");
//   const [showFaultsModal,     setShowFaultsModal]     = useState(false);
//   const [showBatteryModal,    setShowBatteryModal]    = useState(false);
//   const [showLowBatteryAlert, setShowLowBatteryAlert] = useState(false);
//   const [lowBatteryShown,     setLowBatteryShown]     = useState(false);
//   const [faults,              setFaults]              = useState([]);
//   const [imuData,             setImuData]             = useState(null);
//   const [imuStatus,           setImuStatus]           = useState("red");
//   const [batteryData,         setBatteryData]         = useState(null);

//   const langDropdownRef   = useRef(null);
//   const missionUnsubRef   = useRef(null);
//   const imuUnsubRef       = useRef(null);
//   const batteryUnsubRef   = useRef([]);
//   const clockRef          = useRef(null);
//   const faultsRef         = useRef({});
//   const faultUnsubRef     = useRef([]);
//   const resetUnsubRef     = useRef(null);
//   const subscribedRef     = useRef(false);

//   // ── Language dropdown outside-click close ─────────────────────
//   useEffect(() => {
//     if (!langDropdownOpen) return;
//     const handler = e => {
//       if (langDropdownRef.current && !langDropdownRef.current.contains(e.target))
//         setLangDropdownOpen(false);
//     };
//     document.addEventListener("mousedown", handler);
//     return () => document.removeEventListener("mousedown", handler);
//   }, [langDropdownOpen]);

//   // ── Clock ──────────────────────────────────────────────────────
//   useEffect(() => {
//     clockRef.current = setInterval(() => setCurrentDateTime(new Date()), 1_000);
//     return () => clearInterval(clockRef.current);
//   }, []);

//   // ── Mission status ─────────────────────────────────────────────
//   useEffect(() => {
//     missionUnsubRef.current?.();
//     missionUnsubRef.current = null;
//     if (!connected) { setSafetyActive(false); setMissionStatus("offline"); return; }

//     missionUnsubRef.current = subscribe("/mission/status", "std_msgs/msg/String", msg => {
//       try {
//         const s = JSON.parse(msg.data);
//         setSafetyActive(s.safety_active === true || s.safety_active === "true");
//         setMissionStatus(s.state === "COMPLETE" || s.state === "IDLE" ? "online" : "active");
//       } catch (_) {}
//     });
//     return () => { missionUnsubRef.current?.(); missionUnsubRef.current = null; };
//   }, [connected, subscribe]);

//   // ── Battery status ───────────────────────────────────────────────
//   useEffect(() => {
//     batteryUnsubRef.current.forEach(unsub => unsub?.());
//     batteryUnsubRef.current = [];
    
//     if (!connected) { 
//       setBatteryData(null);
//       setShowLowBatteryAlert(false);
//       setLowBatteryShown(false);
//       return; 
//     }

//     const batteryState = {
//       percentage: 0,
//       voltage: null,
//       current: null,
//       temperatures: [],
//       cellVoltages: [],
//       charging: false,
//       discharging: false,
//       chargeAllowed: false,
//       dischargeAllowed: false,
//       faults: null,
//     };

//     const socUnsub = subscribe("/battery/soc", "std_msgs/Float32", msg => {
//       if (!connected) return;
//       batteryState.percentage = Math.round(msg.data || 0);
      
//       if (batteryState.percentage < 20 && !lowBatteryShown) {
//         setShowLowBatteryAlert(true);
//         setLowBatteryShown(true);
//       } else if (batteryState.percentage >= 20 && lowBatteryShown) {
//         setLowBatteryShown(false);
//       }
      
//       setBatteryData({ ...batteryState });
//     });
//     if (socUnsub) batteryUnsubRef.current.push(socUnsub);

//     const voltageUnsub = subscribe("/battery/pack_voltage", "std_msgs/Float32", msg => {
//       if (!connected) return;
//       batteryState.voltage = msg.data?.toFixed(2) || null;
//       setBatteryData({ ...batteryState });
//     });
//     if (voltageUnsub) batteryUnsubRef.current.push(voltageUnsub);

//     const currentUnsub = subscribe("/battery/current", "std_msgs/Float32", msg => {
//       if (!connected) return;
//       batteryState.current = msg.data?.toFixed(2) || null;
//       setBatteryData({ ...batteryState });
//     });
//     if (currentUnsub) batteryUnsubRef.current.push(currentUnsub);

//     const chargingUnsub = subscribe("/battery/charging", "std_msgs/Bool", msg => {
//       if (!connected) return;
//       batteryState.charging = msg.data === true;
//       setBatteryData({ ...batteryState });
//     });
//     if (chargingUnsub) batteryUnsubRef.current.push(chargingUnsub);

//     const dischargingUnsub = subscribe("/battery/discharging", "std_msgs/Bool", msg => {
//       if (!connected) return;
//       batteryState.discharging = msg.data === true;
//       setBatteryData({ ...batteryState });
//     });
//     if (dischargingUnsub) batteryUnsubRef.current.push(dischargingUnsub);

//     const cellVoltagesUnsub = subscribe("/battery/cell_voltages", "std_msgs/Float32MultiArray", msg => {
//       if (!connected) return;
//       batteryState.cellVoltages = msg.data || [];
//       setBatteryData({ ...batteryState });
//     });
//     if (cellVoltagesUnsub) batteryUnsubRef.current.push(cellVoltagesUnsub);

//     const tempUnsub = subscribe("/battery/temperatures", "std_msgs/Float32MultiArray", msg => {
//       if (!connected) return;
//       batteryState.temperatures = msg.data || [];
//       setBatteryData({ ...batteryState });
//     });
//     if (tempUnsub) batteryUnsubRef.current.push(tempUnsub);

//     const chargeAllowedUnsub = subscribe("/battery/charge_allowed", "std_msgs/Bool", msg => {
//       if (!connected) return;
//       batteryState.chargeAllowed = msg.data === true;
//       setBatteryData({ ...batteryState });
//     });
//     if (chargeAllowedUnsub) batteryUnsubRef.current.push(chargeAllowedUnsub);

//     const dischargeAllowedUnsub = subscribe("/battery/discharge_allowed", "std_msgs/Bool", msg => {
//       if (!connected) return;
//       batteryState.dischargeAllowed = msg.data === true;
//       setBatteryData({ ...batteryState });
//     });
//     if (dischargeAllowedUnsub) batteryUnsubRef.current.push(dischargeAllowedUnsub);

//     const faultsUnsub = subscribe("/battery/faults_json", "std_msgs/String", msg => {
//       if (!connected) return;
//       try {
//         batteryState.faults = JSON.parse(msg.data);
//         setBatteryData({ ...batteryState });
//       } catch (err) {
//         console.error("[Header] Battery faults parse error:", err);
//       }
//     });
//     if (faultsUnsub) batteryUnsubRef.current.push(faultsUnsub);

//     return () => {
//       batteryUnsubRef.current.forEach(unsub => unsub?.());
//       batteryUnsubRef.current = [];
//     };
//   }, [connected, subscribe, lowBatteryShown]);

//   // ── IMU subscription ───────────────────────────────────────────
//   useEffect(() => {
//     imuUnsubRef.current?.();
//     imuUnsubRef.current = null;

//     if (!connected) { setImuData(null); setImuStatus("red"); return; }

//     imuUnsubRef.current = subscribe("/imu/data", "sensor_msgs/Imu", msg => {
//       setImuData({
//         orientation:        { x: msg.orientation?.x,          y: msg.orientation?.y,          z: msg.orientation?.z,          w: msg.orientation?.w },
//         angularVelocity:    { x: msg.angular_velocity?.x,     y: msg.angular_velocity?.y,     z: msg.angular_velocity?.z     },
//         linearAcceleration: { x: msg.linear_acceleration?.x,  y: msg.linear_acceleration?.y,  z: msg.linear_acceleration?.z  },
//         lastUpdate: Date.now(),
//       });
//       setImuStatus("green");
//     });

//     return () => {
//       imuUnsubRef.current?.();
//     };
//   }, [connected, subscribe]);

//   // ── Faults subscription ──────────────────────────────────────
//   useEffect(() => {
//     if (!connected) {
//       faultUnsubRef.current.forEach(unsub => unsub?.());
//       faultUnsubRef.current = [];
//       resetUnsubRef.current?.();
//       resetUnsubRef.current = null;
//       faultsRef.current = {};
//       setFaults([]);
//       subscribedRef.current = false;
//       return;
//     }

//     if (subscribedRef.current) return;
//     subscribedRef.current = true;

//     PERSISTENT_FAULT_TOPICS.forEach(({ name }) => {
//       faultsRef.current[name] = { id: name, active: false, timestamp: null, isPersistent: true };
//     });
//     IMMEDIATE_CLEAR_TOPICS.forEach(({ name }) => {
//       if (name !== "reset") {
//         faultsRef.current[name] = { id: name, active: false, timestamp: null, isPersistent: false };
//       }
//     });

//     PERSISTENT_FAULT_TOPICS.forEach(({ name, topic }) => {
//       const unsub = subscribe(topic, "std_msgs/Bool", msg => {
//         if (!connected) return;

//         const now = new Date();
//         const isFaulted = isSignalFaulted(name, msg.data);
//         const entry = faultsRef.current[name];

//         if (!entry) return;

//         if (isFaulted && !entry.active) {
//           entry.active = true;
//           entry.timestamp = now;
//         }

//         setFaults(
//           Object.values(faultsRef.current)
//             .filter(f => f.active)
//             .sort((a, b) => b.timestamp - a.timestamp)
//         );
//       });

//       if (unsub) faultUnsubRef.current.push(unsub);
//     });

//     IMMEDIATE_CLEAR_TOPICS.forEach(({ name, topic }) => {
//       if (name === "reset") return;
      
//       const unsub = subscribe(topic, "std_msgs/Bool", msg => {
//         if (!connected) return;

//         const now = new Date();
//         const isFaulted = isSignalFaulted(name, msg.data);
//         const entry = faultsRef.current[name];

//         if (!entry) return;

//         if (isFaulted && !entry.active) {
//           entry.active = true;
//           entry.timestamp = now;
//         }
//         else if (!isFaulted && entry.active) {
//           entry.active = false;
//           entry.timestamp = null;
//         }

//         setFaults(
//           Object.values(faultsRef.current)
//             .filter(f => f.active)
//             .sort((a, b) => b.timestamp - a.timestamp)
//         );
//       });

//       if (unsub) faultUnsubRef.current.push(unsub);
//     });

//     resetUnsubRef.current = subscribe("/plc/reset", "std_msgs/Bool", msg => {
//       if (!connected) return;
      
//       if (msg.data === true) {
//         Object.keys(faultsRef.current).forEach(key => {
//           if (faultsRef.current[key].isPersistent) {
//             faultsRef.current[key].active = false;
//             faultsRef.current[key].timestamp = null;
//           }
//         });
        
//         setFaults(
//           Object.values(faultsRef.current)
//             .filter(f => f.active)
//             .sort((a, b) => b.timestamp - a.timestamp)
//         );
//       }
//     });

//     return () => {
//       faultUnsubRef.current.forEach(unsub => unsub?.());
//       faultUnsubRef.current = [];
//       resetUnsubRef.current?.();
//       resetUnsubRef.current = null;
//       subscribedRef.current = false;
//     };
//   }, [connected, subscribe]);

//   // ── Close mobile drawer on desktop resize ──────────────────────
//   useEffect(() => {
//     const onResize = () => { if (window.innerWidth >= 1024) setMobileMenuOpen(false); };
//     window.addEventListener("resize", onResize);
//     return () => window.removeEventListener("resize", onResize);
//   }, []);

//   // ── Logout ─────────────────────────────────────────────────────
//   const handleLogout = useCallback(() => {
//     localStorage.removeItem("loggedInUser");
//     localStorage.removeItem("isLoggedIn");
//     localStorage.removeItem("currentUser");
//     sessionStorage.removeItem("hasSeenAnimation");
//     navigate("/animation", { replace: true });
//   }, [navigate]);

//   // ── Derived values ─────────────────────────────────────────────
//   const rosEndpoint       = `${rosConfig?.ip ?? "—"}:${rosConfig?.port ?? "—"}`;
//   const activeFaultCount  = faults.length;
//   const totalAlerts       = connected ? activeFaultCount : 0;

//   const connectionStatus = (() => {
//     if (!connected)                  return { text: "OFFLINE", color: "bg-red-500"    };
//     if (safetyActive)                return { text: "SAFETY",  color: "bg-red-500"    };
//     if (missionStatus === "active")  return { text: "ACTIVE",  color: "bg-yellow-400" };
//     return                                  { text: "ONLINE",  color: "bg-green-400"  };
//   })();

//   const HEADER_HEIGHT = 70; // Reduced from 100

//   const hasBatteryData = connected && batteryData !== null;
//   const batteryPercentage = hasBatteryData ? batteryData.percentage : 0;
//   const batteryColor = hasBatteryData ? getSignalHex(batteryPercentage) : "#94a3b8";
//   const isCharging = hasBatteryData ? batteryData.charging : false;
//   const isDischarging = hasBatteryData ? batteryData.discharging : false;
//   const displayPercentage = hasBatteryData ? `${batteryPercentage}%` : "NA";

//   // ── Render ─────────────────────────────────────────────────────
//   return (
//     <>
//       <header
//         className="sticky top-0 w-full text-white shadow-xl z-[200] transition-all duration-300"
//         style={{ background: "linear-gradient(135deg, #e0f2fe 0%, #0369a1 100%)" }}
//       >
//         {/* MAIN ROW - Compact */}
//         <div className="flex items-center justify-between px-3 py-1.5 gap-2">

//           {/* LEFT — logo only (date/time moved below) */}
//           <div className="flex items-center gap-3 shrink-0">
//             <img src={TaikishaLogo} alt="Taikisha" className="h-10 w-auto object-contain" />
//           </div>

//           {/* RIGHT — battery, bell, language, logout, hamburger */}
//           <div className="flex items-center gap-2 shrink-0 ml-auto">

//             {/* Battery Indicator - compact */}
//             <button
//               onClick={() => setShowBatteryModal(true)}
//               className="relative px-3 py-2 rounded-xl shadow-md flex items-center gap-2 min-h-[44px] transition-all bg-white/90 text-sky-800 hover:bg-white active:scale-95"
//               title="Battery status"
//             >
//               {!hasBatteryData ? (
//                 <div className="relative" style={{ width: "24px", height: "24px" }}>
//                   <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
//                     <rect x="2" y="4.5" width="18" height="15" rx="3" stroke="#94a3b8" strokeWidth="2" fill="rgba(255,255,255,0.05)"/>
//                     <rect x="20" y="8.5" width="3" height="7" rx="1.5" fill="#94a3b8"/>
//                     <text x="13" y="16" textAnchor="middle" fontSize="6" fontWeight="bold" fill="#94a3b8">NA</text>
//                   </svg>
//                 </div>
//               ) : isCharging ? (
//                 <div className="relative">
//                   <FiBatteryCharging size={24} style={{ color: "#4ade80" }} />
//                   <div className="absolute -top-1.5 -right-1.5 text-[8px] font-black text-green-400 animate-pulse">⚡</div>
//                 </div>
//               ) : (
//                 <div className="relative" style={{ width: "24px", height: "24px" }}>
//                   <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
//                     <rect x="2" y="4.5" width="18" height="15" rx="3" stroke="currentColor" strokeWidth="2" fill="transparent"/>
//                     <rect x="20" y="8.5" width="3" height="7" rx="1.5" fill="currentColor"/>
//                     <rect x="4.5" y="7" width={Math.max(2, (batteryPercentage / 100) * 13)} height="10" rx="2" fill={batteryColor}/>
//                     <text x="13" y="16" textAnchor="middle" fontSize="7" fontWeight="bold" fill="white" style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}>{batteryPercentage}%</text>
//                   </svg>
//                 </div>
//               )}
//               <span className={`font-bold text-xs hidden sm:inline ${!hasBatteryData ? "text-gray-400" : ""}`}>
//                 {displayPercentage}
//               </span>
//             </button>

//             {/* Bell - compact */}
//             <button
//               onClick={() => setShowFaultsModal(true)}
//               className="relative px-3 py-2 rounded-xl shadow-md flex items-center gap-1.5 min-h-[44px] transition-all bg-white/90 text-sky-800 hover:bg-white active:scale-95"
//               title="View persistent faults"
//             >
//               <FiBell size={22} />
//               {totalAlerts > 0 && (
//                 <div
//                   className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-white font-black border-2 border-white"
//                   style={{ fontSize: 9 }}
//                 >
//                   {totalAlerts}
//                 </div>
//               )}
//             </button>

//             {/* Language picker - compact */}
//             <div className="relative" ref={langDropdownRef}>
//               <button
//                 onClick={() => setLangDropdownOpen(v => !v)}
//                 className="px-3 py-2 bg-white/90 text-sky-800 rounded-xl hover:bg-white active:scale-95 transition-all shadow-md flex items-center gap-1.5 min-h-[44px]"
//               >
//                 <FiGlobe size={20} />
//                 <span className="font-black text-xs uppercase">{language}</span>
//               </button>
//               {langDropdownOpen && (
//                 <div className="absolute right-0 mt-2 w-48 bg-white border border-sky-100 rounded-xl shadow-2xl py-2 z-[300] text-sky-900">
//                   {LANGUAGES.map(lang => (
//                     <button
//                       key={lang.code}
//                       onClick={() => { setLanguage(lang.code); setLangDropdownOpen(false); }}
//                       className={`w-full px-4 py-2.5 text-left flex items-center justify-between hover:bg-sky-50 transition-colors text-sm ${
//                         language === lang.code ? "bg-sky-100 font-black" : ""
//                       }`}
//                     >
//                       <span>{lang.flag} {lang.name}</span>
//                       {language === lang.code && <FiCheckCircle className="text-sky-600" size={14} />}
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>

//             {/* Logout - compact */}
//             <button
//               onClick={handleLogout}
//               className="px-3 py-2 bg-red-500/80 hover:bg-red-600 active:scale-95 text-white rounded-xl transition-all shadow-md flex items-center gap-1.5 min-h-[44px]"
//               title="Logout"
//             >
//               <FiLogOut size={20} />
//               <span className="hidden lg:inline font-black text-xs uppercase">Logout</span>
//             </button>

//             {/* Hamburger */}
//             <button
//               className="lg:hidden p-2 bg-white/20 rounded-xl border border-white/30 min-h-[44px] min-w-[44px] flex items-center justify-center"
//               onClick={() => setMobileMenuOpen(v => !v)}
//               aria-label="Toggle menu"
//             >
//               {mobileMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
//             </button>
//           </div>
//         </div>
// {/* DATE/TIME + STATUS ROW - positioned below logo */}
// <div className="flex flex-wrap items-center justify-between gap-2 px-3 pb-1.5 border-t border-white/10 pt-1">
//   {/* Date/Time */}
//   <div className="flex items-center gap-3">
//     <span className="text-lg font-mono font-bold text-black/80">{formatDate(currentDateTime)}</span>
//     <span className="text-white/30 text-lg">|</span>
//     <span className="text-lg font-black text-black tracking-wider">{formatTime(currentDateTime)}</span>
//   </div>

//   {/* Status indicators - ACTIVE/CLEAR + Connection - keep these smaller */}
//   <div className="flex items-center gap-4">
//     {/* Connection Status */}
//     <div className="flex items-center gap-1.5">
//       <StatusDot color={connectionStatus.color} pulse={connected} />
//       <span className="text-[11px] font-black uppercase tracking-wider text-white/90">{connectionStatus.text}</span>
//     </div>

//     {/* Safety Status - ACTIVE/CLEAR */}
//     <div className="flex items-center gap-1.5">
//       <span
//         className="w-2.5 h-2.5 rounded-full animate-pulse"
//         style={{
//           backgroundColor: !connected ? "#94a3b8" : safetyActive ? "#ef4444" : "#4ade80",
//           boxShadow: !connected ? "none" : safetyActive ? "0 0 6px 2px rgba(239,68,68,0.9)" : "0 0 4px 2px rgba(74,222,128,0.75)",
//         }}
//       />
//       <FiShield size={13} className="text-white/70" />
//       <span className="text-[11px] font-black uppercase" style={{ color: !connected ? "#94a3b8" : safetyActive ? "#fca5a5" : "#86efac" }}>
//         {!connected ? "OFFLINE" : safetyActive ? "ACTIVE" : "CLEAR"}
//       </span>
//     </div>
//   </div>
// </div>

//         {/* MOBILE DRAWER */}
//         {mobileMenuOpen && (
//           <div
//             className="lg:hidden absolute top-full left-0 w-full bg-white text-sky-900 shadow-xl border-t border-sky-100 z-[250] pl-16 overflow-y-auto"
//             style={{ maxHeight: `calc(100dvh - ${HEADER_HEIGHT}px)` }}
//           >
//             <div className="p-4 space-y-3">

//               <div className="bg-sky-50 p-3 rounded-xl border border-sky-100 text-center">
//                 <div className="text-sm font-mono font-bold text-black">{formatDate(currentDateTime)}</div>
//                 <div className="text-2xl font-black text-black mt-0.5">{formatTime(currentDateTime)}</div>
//               </div>

//               <div className="bg-sky-50 p-3 rounded-xl border border-sky-100 flex flex-col items-center min-w-0">
//                 <FiActivity className="text-sky-600 mb-1 shrink-0" size={20} />
//                 <span className="text-base font-black uppercase truncate w-full text-center">{connectionStatus.text}</span>
//                 <span className="text-[10px] uppercase font-bold opacity-50">Status</span>
//               </div>

//               <div className="bg-sky-50 p-3 rounded-xl border border-sky-100 flex items-center justify-between">
//                 <div className="flex items-center gap-3">
//                   {!hasBatteryData ? (
//                     <div className="relative" style={{ width: "24px", height: "24px" }}>
//                       <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
//                         <rect x="2" y="4.5" width="18" height="15" rx="3" stroke="#94a3b8" strokeWidth="2" fill="rgba(255,255,255,0.05)"/>
//                         <rect x="20" y="8.5" width="3" height="7" rx="1.5" fill="#94a3b8"/>
//                         <text x="13" y="16" textAnchor="middle" fontSize="6" fontWeight="bold" fill="#94a3b8">NA</text>
//                       </svg>
//                     </div>
//                   ) : isCharging ? (
//                     <FiBatteryCharging size={24} className="text-green-500" />
//                   ) : (
//                     <div className="relative" style={{ width: "24px", height: "24px" }}>
//                       <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
//                         <rect x="2" y="4.5" width="18" height="15" rx="3" stroke="currentColor" strokeWidth="2" fill="transparent"/>
//                         <rect x="20" y="8.5" width="3" height="7" rx="1.5" fill="currentColor"/>
//                         <rect x="4.5" y="7" width={Math.max(2, (batteryPercentage / 100) * 13)} height="10" rx="2" fill={batteryColor}/>
//                         <text x="13" y="16" textAnchor="middle" fontSize="7" fontWeight="bold" fill="white" style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}>{batteryPercentage}%</text>
//                       </svg>
//                     </div>
//                   )}
//                   <span className="font-bold text-base">Battery</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <span className={`font-bold text-base ${!hasBatteryData ? "text-gray-400" : getSignalClass(batteryPercentage)}`}>
//                     {displayPercentage}
//                   </span>
//                   {isCharging && hasBatteryData && <span className="text-lg animate-pulse">⚡</span>}
//                   {isDischarging && hasBatteryData && <span className="text-lg animate-pulse">🔋</span>}
//                 </div>
//               </div>

//               <div className="bg-sky-50 p-3 rounded-xl border border-sky-100 text-center">
//                 <span className="text-[10px] font-bold text-sky-600 uppercase">ROS Master</span>
//                 <div className="font-black text-sm truncate">{rosEndpoint}</div>
//               </div>

//               <div
//                 className="p-3 rounded-xl border-2 flex items-center gap-3 min-w-0"
//                 style={{
//                   borderColor:     !connected ? "#94a3b8" : safetyActive ? "#ef4444" : "#22c55e",
//                   backgroundColor: !connected ? "#f8fafc"  : safetyActive ? "#fef2f2" : "#f0fdf4",
//                 }}
//               >
//                 <span
//                   className="w-4 h-4 rounded-full shrink-0"
//                   style={{
//                     backgroundColor: !connected ? "#94a3b8" : safetyActive ? "#ef4444" : "#22c55e",
//                     boxShadow: !connected ? "none" : safetyActive ? "0 0 8px 3px rgba(239,68,68,0.7)" : "0 0 6px 2px rgba(34,197,94,0.6)",
//                     animation: connected ? "pulse 2s infinite" : "none",
//                   }}
//                 />
//                 <FiShield size={20} className="shrink-0" style={{ color: !connected ? "#94a3b8" : safetyActive ? "#ef4444" : "#16a34a" }} />
//                 <div className="flex flex-col min-w-0">
//                   <span className="text-[10px] font-black uppercase tracking-wider opacity-50">Safety Status</span>
//                   <span className="text-lg font-black uppercase" style={{ color: !connected ? "#94a3b8" : safetyActive ? "#ef4444" : "#16a34a" }}>
//                     {!connected ? "OFFLINE" : safetyActive ? "ACTIVE" : "CLEAR"}
//                   </span>
//                 </div>
//               </div>

//               <button
//                 onClick={() => { setShowFaultsModal(true); setMobileMenuOpen(false); }}
//                 className="w-full p-3 rounded-xl transition flex items-center justify-center gap-2 bg-sky-500/20 border-2 border-sky-500 text-sky-600 hover:bg-sky-600/20 active:scale-95"
//               >
//                 <FiBell size={20} />
//                 <span className="font-bold text-sm uppercase">
//                   {connected ? `Faults${totalAlerts > 0 ? ` (${totalAlerts})` : ""}` : "Robot Disconnected"}
//                 </span>
//               </button>

//               <button
//                 onClick={handleLogout}
//                 className="w-full p-3 bg-red-500 text-white rounded-xl hover:bg-red-600 active:scale-95 transition flex items-center justify-center gap-2"
//               >
//                 <FiLogOut size={18} />
//                 <span className="font-bold text-sm uppercase">Logout</span>
//               </button>
//             </div>
//           </div>
//         )}
//       </header>

//       {showFaultsModal && (
//         <FaultsModal
//           faults={faults}
//           onClose={() => setShowFaultsModal(false)}
//           connected={connected}
//         />
//       )}

//       {showBatteryModal && (
//         <BatteryModal
//           batteryData={batteryData}
//           connected={connected}
//           onClose={() => setShowBatteryModal(false)}
//         />
//       )}

//       {showLowBatteryAlert && (
//         <LowBatteryAlert
//           percentage={batteryPercentage}
//           onClose={() => setShowLowBatteryAlert(false)}
//         />
//       )}
//     </>
//   );
// }


import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import TaikishaLogo from "../assets/Taikishaimage1.png";
import { useLanguage } from "../context/LanguageContext";
import { useROS } from "../context/RosContext";


// ── Custom SVG Icon Components (Offline-Safe, No CDN) ────────────────────────
const FiLogOut = ({ size = 16, className = "", style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const FiActivity = ({ size = 16, className = "", style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);

const FiMenu = ({ size = 16, className = "", style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const FiX = ({ size = 16, className = "", style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const FiGlobe = ({ size = 16, className = "", style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const FiCheckCircle = ({ size = 16, className = "", style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const FiShield = ({ size = 16, className = "", style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const FiAlertTriangle = ({ size = 16, className = "", style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3.05h16.94a2 2 0 0 0 1.71-3.05L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const FiBell = ({ size = 16, className = "", style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const FiAlertCircle = ({ size = 16, className = "", style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const FiWifiOff = ({ size = 16, className = "", style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
    <line x1="1" y1="1" x2="23" y2="23" />
    <path d="M16.72 11.06A9 9 0 0 1 19 12.55" />
    <path d="M5 12.55a9 9 0 0 1 5.64-4.5" />
    <path d="M12 20h.01" />
    <path d="M2 2.5A21.9 21.9 0 0 1 12 2c5.33 0 10.23 1.609 14.33 4.26" />
  </svg>
);

const FiZap = ({ size = 16, className = "", style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const FiBattery = ({ size = 16, className = "", style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
    <rect x="1" y="6" width="18" height="12" rx="2" ry="2" />
    <line x1="23" y1="10" x2="23" y2="14" />
  </svg>
);

const FiBatteryCharging = ({ size = 16, className = "", style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
    <path d="M5 18H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-3" />
    <line x1="23" y1="12" x2="23" y2="16" />
    <polyline points="11 9 13 6 15 9" />
    <line x1="13" y1="6" x2="13" y2="13" />
  </svg>
);

// ── Constants ──────────────────────────────────────────────────────────────────
const LANGUAGES = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "mr", name: "मराठी",   flag: "🇮🇳" },
  { code: "hi", name: "हिन्दी", flag: "🇮🇳" },
  { code: "jp", name: "日本語",  flag: "🇯🇵" },
];

// Faults that persist until reset is pressed
const PERSISTENT_FAULT_TOPICS = [
  { name: "work_over",    topic: "/plc/work_over"    },
  { name: "front_estop",  topic: "/plc/front_estop"  },
  { name: "back_estop",   topic: "/plc/back_estop"   },
  { name: "front_bumper", topic: "/plc/front_bumper" },
  { name: "rear_bumper",  topic: "/plc/back_bumper"  },
];

// Immediate clear topics (no persistence)
const IMMEDIATE_CLEAR_TOPICS = [
  { name: "reset",        topic: "/plc/reset"       },
  { name: "front_lidar",  topic: "/plc/front_lidar" },
  { name: "back_lidar",   topic: "/plc/back_lidar"  },
];

const INTERLOCK_LABELS = {
  work_over:    "Pendant Work Over",
  front_estop:  "Front E-Stop",
  back_estop:   "Rear E-Stop",
  reset:        "Fault Reset",
  front_lidar:  "Front LiDAR",
  back_lidar:   "Rear LiDAR",
  front_bumper: "Front Bumper",
  rear_bumper:  "Rear Bumper",
};

// ── Motor error bitmask lookup ────────────────────────────────────────────────
// Same table used on the Home/dashboard page — errors come back as a hex
// bitmask (e.g. "0x00020000"), so more than one fault can be active at once.
const MOTOR_ERROR_CODES = {
  0x1: "Position out of limit error",
  0x2: "Counter-Clockwise limit reached",
  0x4: "Clockwise limit reached",
  0x8: "Over Temperature",
  0x10: "Internal Voltage",
  0x20: "Over Voltage",
  0x80: "Drive over current",
  0x200: "Encoder Disconnected",
  0x400: "Modbus/Serial Communication Error",
  0x1000: "Cooling fan / Ventilation failure",
  0x2000: "Motor Overload",
  0x8000: "Unusual Start",
  0x10000: "Power phase loss",
  0x20000: "STO Triggered",
  0x80000: "Motor Over-Speed (Velocity Exceeds Limit)",
  0x100000: "Drive Under-Voltage",
  0x200000: "Emergency Stop Triggered",
  0x400000: "Secondary Encoder Not Connected / Error",
  0x800000: "Fully Closed-Loop Homing Direction/Option Error",
  0x1000000: "Absolute Encoder Voltage Low / Battery Error",
  0x2000000: "Absolute Position Lost",
  0x4000000: "Absolute Position Overflow",
  0x8000000: "RS-485 Communication Interrupted",
  0x10000000: "Absolute Encoder Multi-Turn Track Error",
  0x20000000: "Abnormal Motor Movement / Stalled",
  0x40000000: "EtherCAT Communication Fault",
  0x80000000: "Parameter / Driver Configuration Error",
};


// Returns every currently-set fault bit as {code, label}, ignoring 0/no-error.
function getActiveMotorFaults(errValue) {
  const num = typeof errValue === "string" ? parseInt(errValue, 16) : Number(errValue);
  if (isNaN(num) || num === 0) return [];

  const active = Object.entries(MOTOR_ERROR_CODES)
    .filter(([codeStr]) => (num & Number(codeStr)) === Number(codeStr))
    .map(([codeStr, label]) => ({ code: Number(codeStr), label }));

  const matchedMask = active.reduce((mask, { code }) => mask | code, 0);
  const remaining = num & ~matchedMask;
  if (remaining !== 0) {
    active.push({ code: remaining, label: `Unknown fault (0x${remaining.toString(16)})` });
  }

  return active;
}
// Pulls just the L_Error / R_Error hex values out of the
// /moons_motor_diagnostics string, e.g.
// "L_Error=0x00020000,vel=133,... | R_Error=0x00020000,vel=134,..."
function parseMotorErrorValues(raw) {
  try {
    const [leftPart, rightPart] = raw.split("|").map(s => s.trim());
    const extractErr = (part) => {
      const match = part.match(/(?:L_Error|R_Error|err)\s*=\s*([^\s,]+)/);
      return match ? match[1] : "0x0";
    };
    return { left: extractErr(leftPart), right: extractErr(rightPart) };
  } catch {
    return { left: "0x0", right: "0x0" };
  }
}

// ── Helpers ────────────────────────────────────────────────────────────────────
function isSignalFaulted(name, msgData) {
  const faultWhenTrue  = ["work_over", "front_estop", "back_estop"];
  const faultWhenFalse = ["front_bumper", "rear_bumper", "front_lidar", "back_lidar"];
  if (faultWhenTrue.includes(name))  return msgData === true;
  if (faultWhenFalse.includes(name)) return msgData === false;
  return false;
}

// ── Battery / signal-strength color thresholds ──────────────────────────────
// 100% → 60%  : GREEN  (healthy)
//  60% → 20%  : YELLOW (getting low)
//  20% → 0%   : RED    (critical — matches the Low Battery Alert trigger)
function getSignalHex(percent) {
  const p = parseInt(percent, 10) || 0;
  if (p >= 60) return "#4ade80";
  if (p >= 20) return "#facc15";
  return "#f87171";
}

function getSignalClass(percent) {
  const p = parseInt(percent, 10) || 0;
  if (p >= 60) return "text-green-400";
  if (p >= 20) return "text-yellow-400";
  return "text-red-400";
}

function formatDate(d) {
  return d.toLocaleDateString("en-US", {
    weekday: "short", year: "numeric", month: "short", day: "numeric",
  });
}

function formatTime(d) {
  return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

function formatTimestamp(d) {
  return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

// ── StatusDot ──────────────────────────────────────────────────────────────────
function StatusDot({ color, pulse = true }) {
  return (
    <span className={`w-2 h-2 rounded-full shrink-0 border border-white/30 ${color} ${pulse ? "animate-pulse" : ""}`} />
  );
}

// ── Low Battery Alert Modal ────────────────────────────────────────────────────
function LowBatteryAlert({ percentage, onClose }) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-[1001]"
      style={{ background: "rgba(0,10,20,0.85)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm mx-4 rounded-3xl overflow-hidden"
        style={{
          background: "linear-gradient(160deg, #7f1d1d 0%, #450a0a 100%)",
          border: "2px solid rgba(239,68,68,0.4)",
          boxShadow: "0 0 40px rgba(239,68,68,0.6), 0 25px 60px rgba(0,0,0,0.8)",
        }}
        onClick={e => e.stopPropagation()}
      >
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, rgba(239,68,68,0.8), transparent)" }}
        />

        <div className="flex justify-center pt-8">
          <div
            className="relative w-24 h-24 rounded-full flex items-center justify-center animate-bounce"
            style={{
              background: "rgba(239,68,68,0.2)",
              border: "3px solid rgba(239,68,68,0.6)",
              boxShadow: "0 0 30px rgba(239,68,68,0.4), inset 0 0 20px rgba(239,68,68,0.2)",
            }}
          >
            <FiAlertTriangle size={56} style={{ color: "#ef4444" }} />
          </div>
        </div>

        <div className="px-6 py-6 text-center">
          <h2 className="text-3xl font-black text-white mb-2 tracking-wide">
            Low Battery Alert! ⚠️
          </h2>
          <p className="text-sm text-red-100 mb-6 leading-relaxed">
            Your battery is running critically low. Please charge the robot immediately to avoid unexpected shutdown.
          </p>

          <div
            className="px-4 py-4 rounded-2xl mb-6 border-2"
            style={{
              background: "rgba(239,68,68,0.1)",
              borderColor: "rgba(239,68,68,0.4)",
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-black uppercase tracking-wider text-red-200">
                Current SOC
              </span>
              <span className="text-3xl font-black text-red-400">{percentage}%</span>
            </div>
            <div className="w-full h-3 rounded-full" style={{ background: "rgba(255,255,255,0.1)" }}>
              <div
                className="h-3 rounded-full transition-all"
                style={{
                  width: `${Math.min(percentage, 100)}%`,
                  background: "linear-gradient(90deg, #ef4444 0%, #fca5a5 100%)",
                }}
              />
            </div>
            <p className="text-xs text-red-200 mt-2 font-semibold">
              🔌 Plug in the charger now
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => {}}
              className="w-full py-3 rounded-xl font-black text-sm uppercase tracking-wider text-white transition-all active:scale-95"
              style={{
                background: "linear-gradient(135deg, #ef4444 0%, #f87171 100%)",
                boxShadow: "0 8px 20px rgba(239,68,68,0.4)",
              }}
            >
              <FiZap size={18} className="inline mr-2" />
              Charge Now
            </button>
            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl font-black text-sm uppercase tracking-wider text-red-200 transition-all active:scale-95"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(239,68,68,0.3)" }}
            >
              Dismiss
            </button>
          </div>
        </div>

        <div
          className="px-6 py-3 border-t text-center text-[11px] font-semibold text-red-200"
          style={{ borderColor: "rgba(239,68,68,0.2)", background: "rgba(0,0,0,0.3)" }}
        >
          ⏰ Estimated time remaining: Low
        </div>
      </div>
    </div>
  );
}

// ── Battery Modal ──────────────────────────────────────────────────────────────
function BatteryModal({ batteryData, connected, onClose }) {
  const hasData = connected && batteryData;
  const percentage = hasData ? batteryData.percentage : 0;
  const isCharging = hasData ? batteryData.charging : false;
  const isDischarging = hasData ? batteryData.discharging : false;
  const color = hasData ? getSignalHex(percentage) : "#94a3b8";

  const avgTemp = hasData && batteryData.temperatures?.length > 0
    ? (batteryData.temperatures.reduce((a, b) => a + b, 0) / batteryData.temperatures.length).toFixed(1)
    : null;
  const maxTemp = hasData && batteryData.temperatures?.length > 0
    ? Math.max(...batteryData.temperatures).toFixed(1)
    : null;

  const avgVoltage = hasData && batteryData.cellVoltages?.length > 0
    ? (batteryData.cellVoltages.reduce((a, b) => a + b, 0) / batteryData.cellVoltages.length).toFixed(3)
    : null;
  const minVoltage = hasData && batteryData.cellVoltages?.length > 0
    ? Math.min(...batteryData.cellVoltages).toFixed(3)
    : null;
  const maxVoltage = hasData && batteryData.cellVoltages?.length > 0
    ? Math.max(...batteryData.cellVoltages).toFixed(3)
    : null;

  const currentValue = hasData ? parseFloat(batteryData.current) : 0;
  // Sign convention from /battery/current: + = charging (current flowing in),
  // - = discharging (current flowing out). We use the sign only to determine
  // status/color; the displayed magnitude is always shown as a positive number.
  const currentStatus = currentValue > 0.1 ? "Charging ⚡" : currentValue < -0.1 ? "Discharging 🔋" : "Idle";
  const absCurrentDisplay = hasData && batteryData.current != null
    ? Math.abs(currentValue).toFixed(2)
    : null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-[1000] p-3"
      style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl mx-auto rounded-3xl overflow-hidden max-h-[92vh] flex flex-col"
        style={{
          background: "linear-gradient(160deg, #ffffff 0%, #f8fafc 100%)",
          border: "1px solid rgba(148,163,184,0.2)",
          boxShadow: "0 25px 60px rgba(0,0,0,0.15), 0 0 0 1px rgba(148,163,184,0.1)",
        }}
        onClick={e => e.stopPropagation()}
      >
        <div
          className="absolute top-0 left-0 right-0 h-1"
          style={{ 
            background: !connected 
              ? "linear-gradient(90deg, #94a3b8, #64748b)" 
              : isCharging 
                ? "linear-gradient(90deg, #22c55e, #4ade80)" 
                : "linear-gradient(90deg, #3b82f6, #60a5fa)"
          }}
        />

        <div className="flex items-center justify-between px-6 pt-6 pb-4 shrink-0">
          <div className="flex items-center gap-4">
            <div
              className="p-3 rounded-2xl"
              style={{ 
                background: !connected 
                  ? "rgba(148,163,184,0.1)" 
                  : isCharging 
                    ? "rgba(34,197,94,0.12)" 
                    : "rgba(59,130,246,0.12)",
                border: !connected 
                  ? "1px solid rgba(148,163,184,0.2)" 
                  : isCharging 
                    ? "1px solid rgba(34,197,94,0.2)" 
                    : "1px solid rgba(59,130,246,0.2)"
              }}
            >
              {!connected ? 
                <FiBattery size={32} style={{ color: "#94a3b8" }} /> :
                isCharging ? 
                  <FiBatteryCharging size={32} style={{ color: "#22c55e" }} /> : 
                  <FiBattery size={32} style={{ color: "#3b82f6" }} />
              }
            </div>
            <div>
              <div className="text-2xl font-black text-slate-800 tracking-wide">
                {!connected ? "Battery Offline" : "Battery Status"}
              </div>
              <div
                className="text-base font-semibold"
                style={{ color: !connected ? "#94a3b8" : isCharging ? "#22c55e" : "#64748b" }}
              >
                {!connected ? "No connection" : isCharging ? "🔋 Charging" : isDischarging ? "⚡ Discharging" : "Idle"}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 rounded-xl transition hover:bg-slate-100 active:scale-95"
            style={{ background: "rgba(148,163,184,0.08)" }}
            aria-label="Close"
          >
            <FiX size={24} className="text-slate-600" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-5 pb-5">
          {hasData ? (
            <>
              <div
                className="mb-5 rounded-2xl p-5 flex items-center justify-between"
                style={{ 
                  background: "rgba(148,163,184,0.06)", 
                  border: "1px solid rgba(148,163,184,0.15)" 
                }}
              >
                <div>
                  <div className="text-5xl font-black text-slate-800 leading-tight">
                    {percentage}%
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: color }} />
                    {/* Label bins now match the 60/20 color thresholds above */}
                    <span className="text-base font-black uppercase tracking-wider" style={{ color }}>
                      {percentage >= 60 ? "Excellent" : percentage >= 20 ? "Good" : "Low"}
                    </span>
                  </div>
                  <div className="font-mono mt-1 text-base" style={{ color: "#94a3b8" }}>
                    {currentStatus}
                  </div>
                </div>
                <div className="relative" style={{ width: "100px", height: "52px" }}>
                  <svg width="100" height="52" viewBox="0 0 100 52">
                    <rect x="3" y="3" width="84" height="46" rx="6" fill="rgba(148,163,184,0.1)" stroke="rgba(148,163,184,0.3)" strokeWidth="3"/>
                    <rect x="90" y="16" width="8" height="20" rx="3" fill="rgba(148,163,184,0.3)"/>
                    <rect 
                      x="6" y="6" 
                      width={Math.max(4, (percentage / 100) * 78)} 
                      height="40" 
                      rx="4" 
                      fill={color}
                    />
                    {isCharging && (
                      <text x="50" y="34" textAnchor="middle" fontSize="20" fontWeight="bold" fill="white">
                        ⚡
                      </text>
                    )}
                  </svg>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-5">
                <div
                  className="px-4 py-4 rounded-2xl"
                  style={{ 
                    background: "rgba(148,163,184,0.06)", 
                    border: "1px solid rgba(148,163,184,0.12)" 
                  }}
                >
                  <div className="text-xs font-black uppercase tracking-wider text-slate-500">📊 Voltage</div>
                  <div className="text-2xl font-black text-slate-800 font-mono mt-1">
                    {batteryData.voltage ? `${batteryData.voltage}V` : "—"}
                  </div>
                </div>
                <div
                  className="px-4 py-4 rounded-2xl"
                  style={{ 
                    background: "rgba(148,163,184,0.06)", 
                    border: "1px solid rgba(148,163,184,0.12)" 
                  }}
                >
                  <div className="text-xs font-black uppercase tracking-wider text-slate-500">⚡ Current</div>
                  <div className="text-2xl font-black font-mono mt-1" style={{ 
                    color: currentValue > 0.1 ? "#22c55e" : currentValue < -0.1 ? "#eab308" : "#94a3b8" 
                  }}>
                    {absCurrentDisplay !== null ? `${absCurrentDisplay}A` : "—"}
                  </div>
                </div>
                <div
                  className="px-4 py-4 rounded-2xl"
                  style={{ 
                    background: "rgba(148,163,184,0.06)", 
                    border: "1px solid rgba(148,163,184,0.12)" 
                  }}
                >
                  <div className="text-xs font-black uppercase tracking-wider text-slate-500">🔋 SOC</div>
                  <div className="text-2xl font-black font-mono mt-1" style={{ color }}>
                    {percentage}%
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-5">
                <div
                  className="px-4 py-3 rounded-2xl text-center text-sm font-black uppercase"
                  style={{
                    background: isCharging ? "rgba(34,197,94,0.08)" : "rgba(148,163,184,0.06)",
                    border: isCharging ? "1px solid rgba(34,197,94,0.2)" : "1px solid rgba(148,163,184,0.12)",
                    color: isCharging ? "#22c55e" : "#94a3b8"
                  }}
                >
                  {isCharging ? "⚡ Charging" : "Not Charging"}
                </div>
                <div
                  className="px-4 py-3 rounded-2xl text-center text-sm font-black uppercase"
                  style={{
                    background: isDischarging ? "rgba(234,179,8,0.08)" : "rgba(148,163,184,0.06)",
                    border: isDischarging ? "1px solid rgba(234,179,8,0.2)" : "1px solid rgba(148,163,184,0.12)",
                    color: isDischarging ? "#eab308" : "#94a3b8"
                  }}
                >
                  {isDischarging ? "🔋 Active" : "Idle"}
                </div>
                <div
                  className="px-4 py-3 rounded-2xl text-center text-sm font-black uppercase"
                  style={{
                    background: batteryData.chargeAllowed ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.08)",
                    border: batteryData.chargeAllowed ? "1px solid rgba(34,197,94,0.2)" : "1px solid rgba(239,68,68,0.2)",
                    color: batteryData.chargeAllowed ? "#22c55e" : "#ef4444"
                  }}
                >
                  {batteryData.chargeAllowed ? "✓ Can Charge" : "✗ Blocked"}
                </div>
              </div>

              {batteryData.cellVoltages?.length > 0 && (
                <div className="mb-5">
                  <div 
                    className="px-4 py-4 rounded-2xl"
                    style={{ 
                      background: "rgba(148,163,184,0.06)", 
                      border: "1px solid rgba(148,163,184,0.12)" 
                    }}
                  >
                    <div className="text-sm font-black uppercase tracking-wider mb-2 text-slate-600">
                      📈 Cell Voltages ({batteryData.cellVoltages.length} cells)
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {batteryData.cellVoltages.map((voltage, i) => (
                        <div 
                          key={i}
                          className="px-3 py-2 rounded-xl text-sm font-mono font-black"
                          style={{
                            background: voltage < 3.0 ? "rgba(239,68,68,0.12)" : "rgba(34,197,94,0.08)",
                            border: voltage < 3.0 ? "1px solid rgba(239,68,68,0.2)" : "1px solid rgba(34,197,94,0.15)",
                            color: voltage < 3.0 ? "#ef4444" : "#22c55e"
                          }}
                        >
                          {voltage.toFixed(2)}V
                        </div>
                      ))}
                    </div>
                    {minVoltage && maxVoltage && (
                      <div className="flex gap-6 mt-3 text-sm font-mono text-slate-600">
                        <span>Min: <span className="font-black text-slate-800">{minVoltage}V</span></span>
                        <span>Avg: <span className="font-black text-slate-800">{avgVoltage}V</span></span>
                        <span>Max: <span className="font-black text-slate-800">{maxVoltage}V</span></span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {batteryData.temperatures?.length > 0 && (
                <div className="mb-5">
                  <div 
                    className="px-4 py-4 rounded-2xl"
                    style={{ 
                      background: "rgba(148,163,184,0.06)", 
                      border: "1px solid rgba(148,163,184,0.12)" 
                    }}
                  >
                    <div className="text-sm font-black uppercase tracking-wider mb-2 text-slate-600">
                      🌡️ Temperatures ({batteryData.temperatures.length} sensors)
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {batteryData.temperatures.map((temp, i) => (
                        <div 
                          key={i}
                          className="px-3 py-2 rounded-xl text-sm font-mono font-black"
                          style={{
                            background: temp > 45 ? "rgba(239,68,68,0.12)" : temp > 40 ? "rgba(234,179,8,0.12)" : "rgba(34,197,94,0.08)",
                            border: temp > 45 ? "1px solid rgba(239,68,68,0.2)" : temp > 40 ? "1px solid rgba(234,179,8,0.2)" : "1px solid rgba(34,197,94,0.15)",
                            color: temp > 45 ? "#ef4444" : temp > 40 ? "#eab308" : "#22c55e"
                          }}
                        >
                          {temp.toFixed(1)}°C
                        </div>
                      ))}
                    </div>
                    {avgTemp && maxTemp && (
                      <div className="flex gap-6 mt-3 text-sm font-mono text-slate-600">
                        <span>Avg: <span className="font-black text-slate-800">{avgTemp}°C</span></span>
                        <span>Max: <span className="font-black text-slate-800">{maxTemp}°C</span></span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {batteryData.faults && (
                <div 
                  className="px-4 py-4 rounded-2xl"
                  style={{ 
                    background: "rgba(148,163,184,0.06)", 
                    border: "1px solid rgba(148,163,184,0.12)" 
                  }}
                >
                  <div className="text-sm font-black uppercase tracking-wider mb-2 text-slate-600">
                    ⚠️ Fault Status
                  </div>
                  {batteryData.faults.battery_status && (
                    <div className="text-sm font-mono" style={{ color: "#64748b" }}>
                      {Object.entries(batteryData.faults.battery_status)
                        .filter(([_, v]) => v === true)
                        .length === 0 ? (
                        <span className="text-green-600 font-bold text-base">✓ No faults detected</span>
                      ) : (
                        Object.entries(batteryData.faults.battery_status)
                          .filter(([_, v]) => v === true)
                          .map(([key, _]) => (
                            <div key={key} className="text-red-500 font-bold text-base">• {key.replace(/_/g, " ")}</div>
                          ))
                      )}
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16 px-6">
              <FiAlertTriangle className="mx-auto text-yellow-500 mb-4" size={56} />
              <p className="text-slate-700 font-bold text-xl">
                {!connected ? "Robot Offline" : "No battery data available"}
              </p>
              <p className="text-slate-500 text-base mt-2">
                {!connected ? "Check robot connection" : "Check ROS connection"}
              </p>
            </div>
          )}
        </div>

        <div className="px-5 pb-5 shrink-0 border-t border-slate-200/50 pt-4">
          <button
            onClick={onClose}
            className="w-full py-4 rounded-2xl font-black text-lg uppercase tracking-wider text-white transition-all active:scale-95"
            style={{ 
              background: "linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)",
              boxShadow: "0 8px 20px rgba(59,130,246,0.3)"
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Faults Modal ──────────────────────────────────────────────────────────────
function FaultsModal({ faults, onClose, connected }) {
  const activeFaults = faults.filter(f => f.active);
  const faultCount = activeFaults.length;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-[1000]"
      style={{ background: "rgba(0,10,20,0.78)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl mx-4 rounded-2xl overflow-hidden max-h-[80vh] flex flex-col"
        style={{
          background: "linear-gradient(160deg, #0f172a 0%, #0c1a2e 100%)",
          border: "1px solid rgba(56,189,248,0.15)",
          boxShadow: "0 25px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)",
        }}
        onClick={e => e.stopPropagation()}
      >
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, rgba(56,189,248,0.6), transparent)" }}
        />

        <div className="flex items-center justify-between px-5 pt-5 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div
              className="p-2.5 rounded-xl"
              style={{
                background: !connected ? "rgba(107,114,128,0.12)" : faultCount > 0 ? "rgba(239,68,68,0.12)" : "rgba(74,222,128,0.12)",
                border:     !connected ? "1px solid rgba(107,114,128,0.2)" : faultCount > 0 ? "1px solid rgba(239,68,68,0.2)" : "1px solid rgba(74,222,128,0.2)",
              }}
            >
              {!connected
                ? <FiWifiOff    size={24} style={{ color: "#6b7280" }} />
                : faultCount > 0
                ? <FiAlertCircle size={24} style={{ color: "#ef4444" }} />
                : <FiCheckCircle size={24} style={{ color: "#4ade80" }} />
              }
            </div>
            <div>
              <div className="text-white font-black text-lg tracking-wide">
                {!connected ? "Robot Disconnected" : faultCount > 0 ? "System Faults" : "All Clear"}
              </div>
              <div
                className="text-xs font-semibold"
                style={{
                  color: !connected ? "rgba(107,114,128,0.7)" : faultCount > 0 ? "rgba(239,68,68,0.7)" : "rgba(74,222,128,0.7)",
                }}
              >
                {!connected
                  ? "Waiting for robot connection..."
                  : faultCount > 0
                    ? `${faultCount} fault${faultCount === 1 ? "" : "s"} active`
                    : "No active faults"}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl transition"
            style={{ background: "rgba(255,255,255,0.06)" }}
            aria-label="Close"
          >
            <FiX size={20} className="text-white/60" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-4 py-3 space-y-3">
          {!connected ? (
            <div className="flex flex-col items-center justify-center py-12">
              <FiWifiOff size={48} className="text-gray-500 mb-3" />
              <p className="text-white font-bold text-lg">Robot Offline</p>
            </div>

          ) : faultCount === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div
                className="rounded-full mb-4 shadow-lg flex items-center justify-center"
                style={{
                  width: 80, height: 80,
                  backgroundColor: "#4ade80",
                  boxShadow: "0 0 20px 5px rgba(74,222,128,0.5)",
                }}
              >
                <FiCheckCircle size={48} style={{ color: "white" }} />
              </div>
              <p className="text-white font-bold text-lg">All Clear ✅</p>
              <p className="text-slate-400 text-sm mt-1">No active faults</p>
            </div>

          ) : (
            <>
              {activeFaults.map((fault) => (
                <div
                  key={fault.id}
                  className="p-4 rounded-xl"
                  style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="rounded-full shadow-lg animate-pulse shrink-0"
                      style={{
                        width: 24, height: 24,
                        backgroundColor: "#ef4444",
                        boxShadow: "0 0 12px 3px rgba(239,68,68,0.8)",
                      }}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="font-black text-white text-base">
                        {fault.label || INTERLOCK_LABELS[fault.id] || fault.id}
                      </div>
                      <div className="text-xs font-semibold mt-1" style={{ color: "rgba(239,68,68,0.8)" }}>
                        ⚠️ FAULT TRIGGERED at {formatTimestamp(fault.timestamp)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        <div className="px-4 pb-4 shrink-0">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl font-black text-sm uppercase tracking-wider text-white transition-all active:scale-95"
            style={{ background: "linear-gradient(135deg, #0369a1 0%, #0ea5e9 100%)" }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Header Component ──────────────────────────────────────────────────────
export default function Header() {
  const navigate = useNavigate();
  const { t, language, setLanguage } = useLanguage();
  const { connected, rosConfig, subscribe } = useROS();

  const [mobileMenuOpen,      setMobileMenuOpen]      = useState(false);
  const [langDropdownOpen,    setLangDropdownOpen]    = useState(false);
  const [currentDateTime,     setCurrentDateTime]     = useState(new Date());
  const [safetyActive,        setSafetyActive]        = useState(false);
  const [missionStatus,       setMissionStatus]       = useState("offline");
  const [showFaultsModal,     setShowFaultsModal]     = useState(false);
  const [showBatteryModal,    setShowBatteryModal]    = useState(false);
  const [showLowBatteryAlert, setShowLowBatteryAlert] = useState(false);
  const [lowBatteryShown,     setLowBatteryShown]     = useState(false);
  const [faults,              setFaults]              = useState([]);
  const [imuData,             setImuData]             = useState(null);
  const [imuStatus,           setImuStatus]           = useState("red");
  const [batteryData,         setBatteryData]         = useState(null);

  const langDropdownRef   = useRef(null);
  const missionUnsubRef   = useRef(null);
  const imuUnsubRef       = useRef(null);
  const batteryUnsubRef   = useRef([]);
  const clockRef          = useRef(null);
  const faultsRef         = useRef({});
  const faultUnsubRef     = useRef([]);
  const resetUnsubRef     = useRef(null);
  const subscribedRef     = useRef(false);
  const motorUnsubRef       = useRef(null);
  const motorSubscribedRef  = useRef(false);

  // ── Language dropdown outside-click close ─────────────────────
  useEffect(() => {
    if (!langDropdownOpen) return;
    const handler = e => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(e.target))
        setLangDropdownOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [langDropdownOpen]);

  // ── Clock ──────────────────────────────────────────────────────
  useEffect(() => {
    clockRef.current = setInterval(() => setCurrentDateTime(new Date()), 1_000);
    return () => clearInterval(clockRef.current);
  }, []);

  // ── Mission status ─────────────────────────────────────────────
  useEffect(() => {
    missionUnsubRef.current?.();
    missionUnsubRef.current = null;
    if (!connected) { setSafetyActive(false); setMissionStatus("offline"); return; }

    missionUnsubRef.current = subscribe("/mission/status", "std_msgs/msg/String", msg => {
      try {
        const s = JSON.parse(msg.data);
        setSafetyActive(s.safety_active === true || s.safety_active === "true");
        setMissionStatus(s.state === "COMPLETE" || s.state === "IDLE" ? "online" : "active");
      } catch (_) {}
    });
    return () => { missionUnsubRef.current?.(); missionUnsubRef.current = null; };
  }, [connected, subscribe]);

  // ── Battery status ───────────────────────────────────────────────
  useEffect(() => {
    batteryUnsubRef.current.forEach(unsub => unsub?.());
    batteryUnsubRef.current = [];
    
    if (!connected) { 
      setBatteryData(null);
      setShowLowBatteryAlert(false);
      setLowBatteryShown(false);
      return; 
    }

    const batteryState = {
      percentage: 0,
      voltage: null,
      current: null,
      temperatures: [],
      cellVoltages: [],
      charging: false,
      discharging: false,
      chargeAllowed: false,
      dischargeAllowed: false,
      faults: null,
    };

    const socUnsub = subscribe("/battery/soc", "std_msgs/Float32", msg => {
      if (!connected) return;
      batteryState.percentage = Math.round(msg.data || 0);
      
      if (batteryState.percentage < 20 && !lowBatteryShown) {
        setShowLowBatteryAlert(true);
        setLowBatteryShown(true);
      } else if (batteryState.percentage >= 20 && lowBatteryShown) {
        setLowBatteryShown(false);
      }
      
      setBatteryData({ ...batteryState });
    });
    if (socUnsub) batteryUnsubRef.current.push(socUnsub);

    const voltageUnsub = subscribe("/battery/pack_voltage", "std_msgs/Float32", msg => {
      if (!connected) return;
      batteryState.voltage = msg.data?.toFixed(2) || null;
      setBatteryData({ ...batteryState });
    });
    if (voltageUnsub) batteryUnsubRef.current.push(voltageUnsub);

    const currentUnsub = subscribe("/battery/current", "std_msgs/Float32", msg => {
      if (!connected) return;
      batteryState.current = msg.data?.toFixed(2) || null;
      setBatteryData({ ...batteryState });
    });
    if (currentUnsub) batteryUnsubRef.current.push(currentUnsub);

    const chargingUnsub = subscribe("/battery/charging", "std_msgs/Bool", msg => {
      if (!connected) return;
      batteryState.charging = msg.data === true;
      setBatteryData({ ...batteryState });
    });
    if (chargingUnsub) batteryUnsubRef.current.push(chargingUnsub);

    const dischargingUnsub = subscribe("/battery/discharging", "std_msgs/Bool", msg => {
      if (!connected) return;
      batteryState.discharging = msg.data === true;
      setBatteryData({ ...batteryState });
    });
    if (dischargingUnsub) batteryUnsubRef.current.push(dischargingUnsub);

    const cellVoltagesUnsub = subscribe("/battery/cell_voltages", "std_msgs/Float32MultiArray", msg => {
      if (!connected) return;
      batteryState.cellVoltages = msg.data || [];
      setBatteryData({ ...batteryState });
    });
    if (cellVoltagesUnsub) batteryUnsubRef.current.push(cellVoltagesUnsub);

    const tempUnsub = subscribe("/battery/temperatures", "std_msgs/Float32MultiArray", msg => {
      if (!connected) return;
      batteryState.temperatures = msg.data || [];
      setBatteryData({ ...batteryState });
    });
    if (tempUnsub) batteryUnsubRef.current.push(tempUnsub);

    const chargeAllowedUnsub = subscribe("/battery/charge_allowed", "std_msgs/Bool", msg => {
      if (!connected) return;
      batteryState.chargeAllowed = msg.data === true;
      setBatteryData({ ...batteryState });
    });
    if (chargeAllowedUnsub) batteryUnsubRef.current.push(chargeAllowedUnsub);

    const dischargeAllowedUnsub = subscribe("/battery/discharge_allowed", "std_msgs/Bool", msg => {
      if (!connected) return;
      batteryState.dischargeAllowed = msg.data === true;
      setBatteryData({ ...batteryState });
    });
    if (dischargeAllowedUnsub) batteryUnsubRef.current.push(dischargeAllowedUnsub);

    const faultsUnsub = subscribe("/battery/faults_json", "std_msgs/String", msg => {
      if (!connected) return;
      try {
        batteryState.faults = JSON.parse(msg.data);
        setBatteryData({ ...batteryState });
      } catch (err) {
        console.error("[Header] Battery faults parse error:", err);
      }
    });
    if (faultsUnsub) batteryUnsubRef.current.push(faultsUnsub);

    return () => {
      batteryUnsubRef.current.forEach(unsub => unsub?.());
      batteryUnsubRef.current = [];
    };
  }, [connected, subscribe, lowBatteryShown]);

  // ── IMU subscription ───────────────────────────────────────────
  useEffect(() => {
    imuUnsubRef.current?.();
    imuUnsubRef.current = null;

    if (!connected) { setImuData(null); setImuStatus("red"); return; }

    imuUnsubRef.current = subscribe("/imu/data", "sensor_msgs/Imu", msg => {
      setImuData({
        orientation:        { x: msg.orientation?.x,          y: msg.orientation?.y,          z: msg.orientation?.z,          w: msg.orientation?.w },
        angularVelocity:    { x: msg.angular_velocity?.x,     y: msg.angular_velocity?.y,     z: msg.angular_velocity?.z     },
        linearAcceleration: { x: msg.linear_acceleration?.x,  y: msg.linear_acceleration?.y,  z: msg.linear_acceleration?.z  },
        lastUpdate: Date.now(),
      });
      setImuStatus("green");
    });

    return () => {
      imuUnsubRef.current?.();
    };
  }, [connected, subscribe]);

  // ── Faults subscription (PLC safety interlocks) ────────────────
  useEffect(() => {
    if (!connected) {
      faultUnsubRef.current.forEach(unsub => unsub?.());
      faultUnsubRef.current = [];
      resetUnsubRef.current?.();
      resetUnsubRef.current = null;
      faultsRef.current = {};
      setFaults([]);
      subscribedRef.current = false;
      return;
    }

    if (subscribedRef.current) return;
    subscribedRef.current = true;

    PERSISTENT_FAULT_TOPICS.forEach(({ name }) => {
      faultsRef.current[name] = { id: name, active: false, timestamp: null, isPersistent: true };
    });
    IMMEDIATE_CLEAR_TOPICS.forEach(({ name }) => {
      if (name !== "reset") {
        faultsRef.current[name] = { id: name, active: false, timestamp: null, isPersistent: false };
      }
    });

    PERSISTENT_FAULT_TOPICS.forEach(({ name, topic }) => {
      const unsub = subscribe(topic, "std_msgs/Bool", msg => {
        if (!connected) return;

        const now = new Date();
        const isFaulted = isSignalFaulted(name, msg.data);
        const entry = faultsRef.current[name];

        if (!entry) return;

        if (isFaulted && !entry.active) {
          entry.active = true;
          entry.timestamp = now;
        }

        setFaults(
          Object.values(faultsRef.current)
            .filter(f => f.active)
            .sort((a, b) => b.timestamp - a.timestamp)
        );
      });

      if (unsub) faultUnsubRef.current.push(unsub);
    });

    IMMEDIATE_CLEAR_TOPICS.forEach(({ name, topic }) => {
      if (name === "reset") return;
      
      const unsub = subscribe(topic, "std_msgs/Bool", msg => {
        if (!connected) return;

        const now = new Date();
        const isFaulted = isSignalFaulted(name, msg.data);
        const entry = faultsRef.current[name];

        if (!entry) return;

        if (isFaulted && !entry.active) {
          entry.active = true;
          entry.timestamp = now;
        }
        else if (!isFaulted && entry.active) {
          entry.active = false;
          entry.timestamp = null;
        }

        setFaults(
          Object.values(faultsRef.current)
            .filter(f => f.active)
            .sort((a, b) => b.timestamp - a.timestamp)
        );
      });

      if (unsub) faultUnsubRef.current.push(unsub);
    });

    resetUnsubRef.current = subscribe("/plc/reset", "std_msgs/Bool", msg => {
      if (!connected) return;
      
      if (msg.data === true) {
        Object.keys(faultsRef.current).forEach(key => {
          if (faultsRef.current[key].isPersistent) {
            faultsRef.current[key].active = false;
            faultsRef.current[key].timestamp = null;
          }
        });
        
        setFaults(
          Object.values(faultsRef.current)
            .filter(f => f.active)
            .sort((a, b) => b.timestamp - a.timestamp)
        );
      }
    });

    return () => {
      faultUnsubRef.current.forEach(unsub => unsub?.());
      faultUnsubRef.current = [];
      resetUnsubRef.current?.();
      resetUnsubRef.current = null;
      subscribedRef.current = false;
    };
  }, [connected, subscribe]);

  // ── Motor fault subscription ────────────────────────────────────
  // Listens to /moons_motor_diagnostics (same topic as the dashboard motor
  // cards) and feeds any active error bit into the shared faultsRef store,
  // so motor faults show up in the bell icon count and the Faults modal
  // alongside the PLC safety interlocks. These auto-clear (no reset needed)
  // as soon as the driver reports the bit is no longer set.
  useEffect(() => {
    if (!connected) {
      motorUnsubRef.current?.();
      motorUnsubRef.current = null;
      motorSubscribedRef.current = false;

      Object.keys(faultsRef.current).forEach(key => {
        if (key.startsWith("motor_")) delete faultsRef.current[key];
      });
      setFaults(
        Object.values(faultsRef.current)
          .filter(f => f.active)
          .sort((a, b) => b.timestamp - a.timestamp)
      );
      return;
    }

    if (motorSubscribedRef.current) return;
    motorSubscribedRef.current = true;

    motorUnsubRef.current = subscribe("/moons_motor_diagnostics", "std_msgs/String", msg => {
      if (!connected) return;

      const { left, right } = parseMotorErrorValues(msg.data);
      const now = new Date();

      [{ side: "Left", err: left }, { side: "Right", err: right }].forEach(({ side, err }) => {
        const activeFaultsForSide = getActiveMotorFaults(err);
        const activeKeys = new Set(
          activeFaultsForSide.map(({ code }) => `motor_${side.toLowerCase()}_${code}`)
        );

        // Add/refresh currently active bits for this motor
        activeFaultsForSide.forEach(({ code, label }) => {
          const key = `motor_${side.toLowerCase()}_${code}`;
          const entry = faultsRef.current[key];
          if (!entry) {
            faultsRef.current[key] = {
              id: key,
              label: `${side} Motor: ${label}`,
              active: true,
              timestamp: now,
              isPersistent: false,
            };
          } else if (!entry.active) {
            entry.active = true;
            entry.timestamp = now;
          }
        });

        // Clear any previously-active bits for this motor that are no
        // longer set — immediate clear, same as bumpers/lidar.
        Object.keys(faultsRef.current).forEach(key => {
          if (key.startsWith(`motor_${side.toLowerCase()}_`) && !activeKeys.has(key)) {
            if (faultsRef.current[key].active) {
              faultsRef.current[key].active = false;
              faultsRef.current[key].timestamp = null;
            }
          }
        });
      });

      setFaults(
        Object.values(faultsRef.current)
          .filter(f => f.active)
          .sort((a, b) => b.timestamp - a.timestamp)
      );
    });

    return () => {
      motorUnsubRef.current?.();
      motorUnsubRef.current = null;
      motorSubscribedRef.current = false;
    };
  }, [connected, subscribe]);

  // ── Close mobile drawer on desktop resize ──────────────────────
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 1024) setMobileMenuOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // ── Logout ─────────────────────────────────────────────────────
  const handleLogout = useCallback(() => {
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("currentUser");
    sessionStorage.removeItem("hasSeenAnimation");
    navigate("/animation", { replace: true });
  }, [navigate]);

  // ── Derived values ─────────────────────────────────────────────
  const rosEndpoint       = `${rosConfig?.ip ?? "—"}:${rosConfig?.port ?? "—"}`;
  const activeFaultCount  = faults.length;
  const totalAlerts       = connected ? activeFaultCount : 0;

  const connectionStatus = (() => {
    if (!connected)                  return { text: "OFFLINE", color: "bg-red-500"    };
    if (safetyActive)                return { text: "SAFETY",  color: "bg-red-500"    };
    if (missionStatus === "active")  return { text: "ACTIVE",  color: "bg-yellow-400" };
    return                                  { text: "ONLINE",  color: "bg-green-400"  };
  })();

  const HEADER_HEIGHT = 70; // Reduced from 100

  const hasBatteryData = connected && batteryData !== null;
  const batteryPercentage = hasBatteryData ? batteryData.percentage : 0;
  const batteryColor = hasBatteryData ? getSignalHex(batteryPercentage) : "#94a3b8";
  const isCharging = hasBatteryData ? batteryData.charging : false;
  const isDischarging = hasBatteryData ? batteryData.discharging : false;
  const displayPercentage = hasBatteryData ? `${batteryPercentage}%` : "NA";

  // ── Render ─────────────────────────────────────────────────────
  return (
    <>
      <header
        className="sticky top-0 w-full text-white shadow-xl z-[200] transition-all duration-300"
        style={{ background: "linear-gradient(135deg, #e0f2fe 0%, #0369a1 100%)" }}
      >
        {/* MAIN ROW - Compact */}
        <div className="flex items-center justify-between px-3 py-1.5 gap-2">

          {/* LEFT — logo only (date/time moved below) */}
          <div className="flex items-center gap-3 shrink-0">
            <img src={TaikishaLogo} alt="Taikisha" className="h-10 w-auto object-contain" />
          </div>

          {/* RIGHT — battery, bell, language, logout, hamburger */}
          <div className="flex items-center gap-2 shrink-0 ml-auto">

            {/* Battery Indicator - compact */}
            <button
              onClick={() => setShowBatteryModal(true)}
              className="relative px-3 py-2 rounded-xl shadow-md flex items-center gap-2 min-h-[44px] transition-all bg-white/90 text-sky-800 hover:bg-white active:scale-95"
              title="Battery status"
            >
              {!hasBatteryData ? (
                <div className="relative" style={{ width: "24px", height: "24px" }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <rect x="2" y="4.5" width="18" height="15" rx="3" stroke="#94a3b8" strokeWidth="2" fill="rgba(255,255,255,0.05)"/>
                    <rect x="20" y="8.5" width="3" height="7" rx="1.5" fill="#94a3b8"/>
                    <text x="13" y="16" textAnchor="middle" fontSize="6" fontWeight="bold" fill="#94a3b8">NA</text>
                  </svg>
                </div>
              ) : isCharging ? (
                <div className="relative">
                  <FiBatteryCharging size={24} style={{ color: "#4ade80" }} />
                  <div className="absolute -top-1.5 -right-1.5 text-[8px] font-black text-green-400 animate-pulse">⚡</div>
                </div>
              ) : (
                <div className="relative" style={{ width: "24px", height: "24px" }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <rect x="2" y="4.5" width="18" height="15" rx="3" stroke="currentColor" strokeWidth="2" fill="transparent"/>
                    <rect x="20" y="8.5" width="3" height="7" rx="1.5" fill="currentColor"/>
                    <rect x="4.5" y="7" width={Math.max(2, (batteryPercentage / 100) * 13)} height="10" rx="2" fill={batteryColor}/>
                    <text x="13" y="16" textAnchor="middle" fontSize="7" fontWeight="bold" fill="white" style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}>{batteryPercentage}%</text>
                  </svg>
                </div>
              )}
              <span className={`font-bold text-xs hidden sm:inline ${!hasBatteryData ? "text-gray-400" : ""}`}>
                {displayPercentage}
              </span>
            </button>

            {/* Bell - compact */}
            <button
              onClick={() => setShowFaultsModal(true)}
              className="relative px-3 py-2 rounded-xl shadow-md flex items-center gap-1.5 min-h-[44px] transition-all bg-white/90 text-sky-800 hover:bg-white active:scale-95"
              title="View active faults (PLC + Motor)"
            >
              <FiBell size={22} />
              {totalAlerts > 0 && (
                <div
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-white font-black border-2 border-white"
                  style={{ fontSize: 9 }}
                >
                  {totalAlerts}
                </div>
              )}
            </button>

            {/* Language picker - compact */}
            <div className="relative" ref={langDropdownRef}>
              <button
                onClick={() => setLangDropdownOpen(v => !v)}
                className="px-3 py-2 bg-white/90 text-sky-800 rounded-xl hover:bg-white active:scale-95 transition-all shadow-md flex items-center gap-1.5 min-h-[44px]"
              >
                <FiGlobe size={20} />
                <span className="font-black text-xs uppercase">{language}</span>
              </button>
              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-sky-100 rounded-xl shadow-2xl py-2 z-[300] text-sky-900">
                  {LANGUAGES.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => { setLanguage(lang.code); setLangDropdownOpen(false); }}
                      className={`w-full px-4 py-2.5 text-left flex items-center justify-between hover:bg-sky-50 transition-colors text-sm ${
                        language === lang.code ? "bg-sky-100 font-black" : ""
                      }`}
                    >
                      <span>{lang.flag} {lang.name}</span>
                      {language === lang.code && <FiCheckCircle className="text-sky-600" size={14} />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Logout - compact */}
            <button
              onClick={handleLogout}
              className="px-3 py-2 bg-red-500/80 hover:bg-red-600 active:scale-95 text-white rounded-xl transition-all shadow-md flex items-center gap-1.5 min-h-[44px]"
              title="Logout"
            >
              <FiLogOut size={20} />
              <span className="hidden lg:inline font-black text-xs uppercase">Logout</span>
            </button>

            {/* Hamburger */}
            <button
              className="lg:hidden p-2 bg-white/20 rounded-xl border border-white/30 min-h-[44px] min-w-[44px] flex items-center justify-center"
              onClick={() => setMobileMenuOpen(v => !v)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>
        </div>
{/* DATE/TIME + STATUS ROW - positioned below logo */}
<div className="flex flex-wrap items-center justify-between gap-2 px-3 pb-1.5 border-t border-white/10 pt-1">
  {/* Date/Time */}
  <div className="flex items-center gap-3">
    <span className="text-lg font-mono font-bold text-black/80">{formatDate(currentDateTime)}</span>
    <span className="text-white/30 text-lg">|</span>
    <span className="text-lg font-black text-black tracking-wider">{formatTime(currentDateTime)}</span>
  </div>

  {/* Status indicators - ACTIVE/CLEAR + Connection - keep these smaller */}
  <div className="flex items-center gap-4">
    {/* Connection Status */}
    <div className="flex items-center gap-1.5">
      <StatusDot color={connectionStatus.color} pulse={connected} />
      <span className="text-[11px] font-black uppercase tracking-wider text-white/90">{connectionStatus.text}</span>
    </div>

    {/* Safety Status - ACTIVE/CLEAR */}
    <div className="flex items-center gap-1.5">
      <span
        className="w-2.5 h-2.5 rounded-full animate-pulse"
        style={{
          backgroundColor: !connected ? "#94a3b8" : safetyActive ? "#ef4444" : "#4ade80",
          boxShadow: !connected ? "none" : safetyActive ? "0 0 6px 2px rgba(239,68,68,0.9)" : "0 0 4px 2px rgba(74,222,128,0.75)",
        }}
      />
      <FiShield size={13} className="text-white/70" />
      <span className="text-[11px] font-black uppercase" style={{ color: !connected ? "#94a3b8" : safetyActive ? "#fca5a5" : "#86efac" }}>
        {!connected ? "OFFLINE" : safetyActive ? "ACTIVE" : "CLEAR"}
      </span>
    </div>
  </div>
</div>

        {/* MOBILE DRAWER */}
        {mobileMenuOpen && (
          <div
            className="lg:hidden absolute top-full left-0 w-full bg-white text-sky-900 shadow-xl border-t border-sky-100 z-[250] pl-16 overflow-y-auto"
            style={{ maxHeight: `calc(100dvh - ${HEADER_HEIGHT}px)` }}
          >
            <div className="p-4 space-y-3">

              <div className="bg-sky-50 p-3 rounded-xl border border-sky-100 text-center">
                <div className="text-sm font-mono font-bold text-black">{formatDate(currentDateTime)}</div>
                <div className="text-2xl font-black text-black mt-0.5">{formatTime(currentDateTime)}</div>
              </div>

              <div className="bg-sky-50 p-3 rounded-xl border border-sky-100 flex flex-col items-center min-w-0">
                <FiActivity className="text-sky-600 mb-1 shrink-0" size={20} />
                <span className="text-base font-black uppercase truncate w-full text-center">{connectionStatus.text}</span>
                <span className="text-[10px] uppercase font-bold opacity-50">Status</span>
              </div>

              <div className="bg-sky-50 p-3 rounded-xl border border-sky-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {!hasBatteryData ? (
                    <div className="relative" style={{ width: "24px", height: "24px" }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <rect x="2" y="4.5" width="18" height="15" rx="3" stroke="#94a3b8" strokeWidth="2" fill="rgba(255,255,255,0.05)"/>
                        <rect x="20" y="8.5" width="3" height="7" rx="1.5" fill="#94a3b8"/>
                        <text x="13" y="16" textAnchor="middle" fontSize="6" fontWeight="bold" fill="#94a3b8">NA</text>
                      </svg>
                    </div>
                  ) : isCharging ? (
                    <FiBatteryCharging size={24} className="text-green-500" />
                  ) : (
                    <div className="relative" style={{ width: "24px", height: "24px" }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <rect x="2" y="4.5" width="18" height="15" rx="3" stroke="currentColor" strokeWidth="2" fill="transparent"/>
                        <rect x="20" y="8.5" width="3" height="7" rx="1.5" fill="currentColor"/>
                        <rect x="4.5" y="7" width={Math.max(2, (batteryPercentage / 100) * 13)} height="10" rx="2" fill={batteryColor}/>
                        <text x="13" y="16" textAnchor="middle" fontSize="7" fontWeight="bold" fill="white" style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}>{batteryPercentage}%</text>
                      </svg>
                    </div>
                  )}
                  <span className="font-bold text-base">Battery</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`font-bold text-base ${!hasBatteryData ? "text-gray-400" : getSignalClass(batteryPercentage)}`}>
                    {displayPercentage}
                  </span>
                  {isCharging && hasBatteryData && <span className="text-lg animate-pulse">⚡</span>}
                  {isDischarging && hasBatteryData && <span className="text-lg animate-pulse">🔋</span>}
                </div>
              </div>

              <div className="bg-sky-50 p-3 rounded-xl border border-sky-100 text-center">
                <span className="text-[10px] font-bold text-sky-600 uppercase">ROS Master</span>
                <div className="font-black text-sm truncate">{rosEndpoint}</div>
              </div>

              <div
                className="p-3 rounded-xl border-2 flex items-center gap-3 min-w-0"
                style={{
                  borderColor:     !connected ? "#94a3b8" : safetyActive ? "#ef4444" : "#22c55e",
                  backgroundColor: !connected ? "#f8fafc"  : safetyActive ? "#fef2f2" : "#f0fdf4",
                }}
              >
                <span
                  className="w-4 h-4 rounded-full shrink-0"
                  style={{
                    backgroundColor: !connected ? "#94a3b8" : safetyActive ? "#ef4444" : "#22c55e",
                    boxShadow: !connected ? "none" : safetyActive ? "0 0 8px 3px rgba(239,68,68,0.7)" : "0 0 6px 2px rgba(34,197,94,0.6)",
                    animation: connected ? "pulse 2s infinite" : "none",
                  }}
                />
                <FiShield size={20} className="shrink-0" style={{ color: !connected ? "#94a3b8" : safetyActive ? "#ef4444" : "#16a34a" }} />
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] font-black uppercase tracking-wider opacity-50">Safety Status</span>
                  <span className="text-lg font-black uppercase" style={{ color: !connected ? "#94a3b8" : safetyActive ? "#ef4444" : "#16a34a" }}>
                    {!connected ? "OFFLINE" : safetyActive ? "ACTIVE" : "CLEAR"}
                  </span>
                </div>
              </div>

              <button
                onClick={() => { setShowFaultsModal(true); setMobileMenuOpen(false); }}
                className="w-full p-3 rounded-xl transition flex items-center justify-center gap-2 bg-sky-500/20 border-2 border-sky-500 text-sky-600 hover:bg-sky-600/20 active:scale-95"
              >
                <FiBell size={20} />
                <span className="font-bold text-sm uppercase">
                  {connected ? `Faults${totalAlerts > 0 ? ` (${totalAlerts})` : ""}` : "Robot Disconnected"}
                </span>
              </button>

              <button
                onClick={handleLogout}
                className="w-full p-3 bg-red-500 text-white rounded-xl hover:bg-red-600 active:scale-95 transition flex items-center justify-center gap-2"
              >
                <FiLogOut size={18} />
                <span className="font-bold text-sm uppercase">Logout</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {showFaultsModal && (
        <FaultsModal
          faults={faults}
          onClose={() => setShowFaultsModal(false)}
          connected={connected}
        />
      )}

      {showBatteryModal && (
        <BatteryModal
          batteryData={batteryData}
          connected={connected}
          onClose={() => setShowBatteryModal(false)}
        />
      )}

      {showLowBatteryAlert && (
        <LowBatteryAlert
          percentage={batteryPercentage}
          onClose={() => setShowLowBatteryAlert(false)}
        />
      )}
    </>
  );
}