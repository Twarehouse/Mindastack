

// //Revision of pose , removed safety button 

// import React, { useRef, useState, useEffect, useCallback } from "react";
// import { useLanguage } from "../context/LanguageContext";
// import { useROS } from "../context/RosContext";

// // ── Icons ─────────────────────────────────────────────────────────────────────
// const IconPlay    = ({ size = 40 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21" /></svg>);
// const IconPause   = ({ size = 40 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>);
// const IconResume  = ({ size = 40 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21" /></svg>);
// const IconAbort   = ({ size = 40 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="9" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
// const IconReset   = ({ size = 28 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 .49-3.5" /></svg>);
// const IconChevron = ()              => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>);
// const IconTrigger = ({ size = 40 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>);
// const IconWarning = ({ size = 28 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 9v4M12 17h.01" /><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" /></svg>);
// const IconClose   = ({ size = 24 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>);
// const IconLoop    = ({ size = 28 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 2l4 4-4 4" /><path d="M3 12v-2a4 4 0 0 1 4-4h14" /><path d="M7 22l-4-4 4-4" /><path d="M21 12v2a4 4 0 0 1-4 4H3" /></svg>);
// const IconEyeOn   = ({ size = 24 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>);
// const IconEyeOff  = ({ size = 24 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>);

// // ── Constants ─────────────────────────────────────────────────────────────────
// const MIN_ALIGNMENT = -1;
// const MAX_ALIGNMENT =  1;
// const POSE_THROTTLE_MS = 150;

// const isAligned     = (x, y) => parseFloat(x) >= MIN_ALIGNMENT && parseFloat(x) <= MAX_ALIGNMENT && parseFloat(y) >= MIN_ALIGNMENT && parseFloat(y) <= MAX_ALIGNMENT;
// const isTagDetected = (x, y) => Math.abs(parseFloat(x)) > 0.1 || Math.abs(parseFloat(y)) > 0.1;

// // ── Direction advice ──────────────────────────────────────────────────────────
// // Robot's coordinate convention (confirmed with operator):
// //   +y = tag is AHEAD of robot (front, 180°)  → operator should drive FORWARD
// //   -y = tag is BEHIND robot   (down, 0°)     → operator should drive BACKWARD
// //   +x = tag is to the RIGHT   (270°)         → operator should move RIGHT
// //   -x = tag is to the LEFT    (90°)          → operator should move LEFT
// // Kept deliberately simple — one big arrow + one short command, no mm
// // readouts or jargon, since this is read by an operator standing at a
// // 7-inch kiosk, not a developer debugging alignment.
// function getDirectionAdvice(x, y) {
//   const xNum = parseFloat(x);
//   const yNum = parseFloat(y);

//   if (Math.abs(yNum) > Math.abs(xNum)) {
//     if (yNum > MAX_ALIGNMENT) return { arrow: "⬆️", instruction: "Move Forward" };
//     if (yNum < MIN_ALIGNMENT) return { arrow: "⬇️", instruction: "Move Backward" };
//   } else {
//     if (xNum > MAX_ALIGNMENT) return { arrow: "➡️", instruction: "Move Right" };
//     if (xNum < MIN_ALIGNMENT) return { arrow: "⬅️", instruction: "Move Left" };
//   }
//   return { arrow: "🎯", instruction: "Almost There — Hold Steady" };
// }



// // ── Alignment Note ────────────────────────────────────────────────────────────
// function AlignmentNote({ show, currentX, currentY, onClose }) {
//   if (!show) return null;
//   const advice = getDirectionAdvice(currentX, currentY);
//   return (
//     <div className="w-full bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-400 rounded-2xl px-5 py-4 flex items-center justify-between gap-4">
//       <div className="flex items-center gap-4">
//         <span className="text-5xl">{advice.arrow}</span>
//         <div className="font-black text-amber-700 dark:text-amber-400 text-xl sm:text-2xl uppercase tracking-wide">
//           {advice.instruction}
//         </div>
//       </div>
//       <button
//         onClick={onClose}
//         className="shrink-0 p-2 rounded-full hover:bg-amber-200 dark:hover:bg-amber-800 transition-colors"
//         style={{ minWidth: 44, minHeight: 44 }}
//       >
//         <IconClose size={22} />
//       </button>
//     </div>
//   );
// }


// // // ── Watchdog Modal ────────────────────────────────────────────────────────────
// function WatchdogModal({ show, error, onDismiss, callSvc, t }) {
//   if (!show || !error) return null;
//   const distanceInMeters = ((error.distance_traveled || 0) / 1_000).toFixed(2);
//   return (
//     <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[60] p-3 backdrop-blur-md overflow-y-auto">
//       <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-sm border-2 border-red-500 overflow-hidden my-4">

//         {/* HEADER — ultra-compact for 7-inch */}
//         <div className="bg-red-50 dark:bg-red-950/40 px-4 pt-3 pb-2 text-center">
//           <div className="text-4xl mb-0.5">⚠️</div>
//           <h3 className="text-lg font-black text-red-600 dark:text-red-400 leading-tight">{t("mission_control.watchdog_title")}</h3>
//           <p className="mt-0.5 text-xs font-semibold text-gray-600 dark:text-gray-300 line-clamp-2">{error.message}</p>
//         </div>

//         {/* BODY — scrollable, ultra-compact */}
//         <div className="px-4 py-2.5 space-y-1.5 max-h-48 overflow-y-auto">
//           <div className="bg-red-50 dark:bg-red-950/30 rounded-lg p-2.5 border border-red-200 dark:border-red-800">
//             <div className="flex items-center gap-1.5 mb-1.5">
//               <IconWarning size={16} />
//               <span className="font-black text-red-600 dark:text-red-400 text-xs">{t("mission_control.watchdog_details")}</span>
//             </div>
//             <div className="space-y-1">
//               {[
//                 { label: t("mission_control.watchdog_missed_tag"), val: `${error.missed_tag}`,           color: "text-red-600 dark:text-red-400" },
//                 { label: t("mission_control.watchdog_last_tag"),   val: `${error.last_seen_tag ?? "?"}`, color: "text-yellow-500" },
//                 { label: t("mission_control.watchdog_distance"),   val: `${distanceInMeters} m`,          color: "text-red-600 dark:text-red-400" },
//                 { label: t("mission_control.watchdog_time"),       val: error.timestamp,                  color: "text-gray-500 font-mono text-xs" },
//               ].map(({ label, val, color }) => (
//                 <div key={label} className="flex justify-between items-center gap-2">
//                   <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 truncate">{label}</span>
//                   <span className={`text-sm font-black shrink-0 ${color}`}>{val}</span>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="bg-amber-50 dark:bg-amber-950/30 rounded-lg p-2.5 border border-amber-200 dark:border-amber-800">
//             <p className="text-xs font-semibold text-amber-800 dark:text-amber-300 leading-snug">
//               📋 {t("mission_control.watchdog_info")} {error.missed_tag} {t("mission_control.watchdog_after")} {distanceInMeters} m {t("mission_control.watchdog_from")} {error.last_seen_tag ?? "?"}. {t("mission_control.watchdog_check")}
//             </p>
//           </div>
//         </div>

//         <div className="px-4 pb-3 pt-2 flex gap-2">
//           <button
//             onClick={() => { onDismiss(); callSvc("/mission/reset", "Reset mission after watchdog"); }}
//             className="flex-1 py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-black uppercase text-xs transition-all active:scale-95"
//             style={{ minHeight: 44 }}
//           >
//             {t("mission_control.watchdog_reset")}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }



// // ── Main Component ────────────────────────────────────────────────────────────
// export default function AMRControl() {
//   const { t } = useLanguage();
//   const { connected, subscribe, callService: rosCallService } = useROS();

//   const toastTimeoutRef  = useRef(null);
//   const dropdownRef      = useRef(null);
//   const subscribedRef    = useRef(false);
//   const unsubscribersRef = useRef([]);

//   // ── Pose throttle refs (no re-render on every /pgv_pose message) ────────────
//   const poseThrottleRef = useRef({ pending: null, timer: null });

//   // ── State ──────────────────────────────────────────────────────────────────
//   // Load pose validation preference from localStorage on init
//   const [poseValidationEnabled, setPoseValidationEnabledState] = useState(() => {
//     try {
//       const saved = localStorage.getItem("poseValidationEnabled");
//       return saved !== null ? JSON.parse(saved) : true;
//     } catch {
//       return true;
//     }
//   });

//   // Wrapper to sync state with localStorage
//   const setPoseValidationEnabled = useCallback((value) => {
//     const newValue = typeof value === 'function' ? value(poseValidationEnabled) : value;
//     setPoseValidationEnabledState(newValue);
//     try {
//       localStorage.setItem("poseValidationEnabled", JSON.stringify(newValue));
//     } catch (error) {
//       console.warn("Failed to save pose validation preference:", error);
//     }
//   }, [poseValidationEnabled]);

//   const [state, setState]                     = useState("Disconnected");
//   const [pose, setPose]                       = useState({ x: "0.00", y: "0.00", theta: "0.0" });
//   const [data, setData]                       = useState({
//     step: 0, total_steps: 0, mission_file: "", safety_active: false,
//     tag: 0, target_tag: 0, action: "", speed: 0, available: [], distance_traveled: 0,
//   });
//   const [toast, setToast]                     = useState({ show: false, message: "", type: "info" });
//   const [loading, setLoading]                 = useState(false);
//   const [triggerLoading, setTriggerLoading]   = useState(false);
//   const [selectedMission, setSelectedMission] = useState("");
//   const [dropdownOpen, setDropdownOpen]       = useState(false);
//   const [watchdogError, setWatchdogError]     = useState(null);
//   const [showWatchdogModal, setShowWatchdogModal] = useState(false);
//   const [showAlignNote, setShowAlignNote]     = useState(false);
//   const [missedTagAlert, setMissedTagAlert]   = useState(null);
//   const [loopLoading, setLoopLoading]         = useState(false);
//   const [isLoopOn, setIsLoopOn]               = useState(false);

//   const poseIsZero =
//     parseFloat(pose.x) === 0 &&
//     parseFloat(pose.y) === 0 &&
//     parseFloat(pose.theta) === 0;

//   const recordFault = useCallback((w) => {
//     const missedTagNum = w.missed_tag ?? w.missedTag ?? w.expected_tag ?? w.target_tag ?? "?";
//     setWatchdogError({
//       missed_tag:        missedTagNum,
//       last_seen_tag:     w.last_seen_tag ?? w.lastSeenTag ?? w.current_tag ?? w.tag ?? "?",
//       distance_traveled: w.distance_traveled ?? w.distanceTraveled ?? w.distance ?? 0,
//       message:           w.message ?? w.error_message ?? "Watchdog fault detected",
//       timestamp:         new Date().toLocaleTimeString(),
//     });
//     setShowWatchdogModal(true);
//     setMissedTagAlert({
//       tag:       missedTagNum,
//       timestamp: new Date().toLocaleTimeString(),
//       distance:  (w.distance_traveled ?? w.distanceTraveled ?? w.distance ?? 0) / 1000,
//     });
//     setTimeout(() => setMissedTagAlert(null), 8000);
//   }, []);

//   useEffect(() => {
//     if (!showAlignNote) return;
//     const timer = setTimeout(() => setShowAlignNote(false), 10_000);
//     return () => clearTimeout(timer);
//   }, [showAlignNote]);

//   // Clear selectedMission when mission is unloaded from backend
//   useEffect(() => {
//     if (!data.mission_file) {
//       setSelectedMission("");
//     }
//   }, [data.mission_file]);

//   useEffect(() => {
//     const handler = (e) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target))
//         setDropdownOpen(false);
//     };
//     document.addEventListener("mousedown", handler);
//     return () => document.removeEventListener("mousedown", handler);
//   }, []);

//   const showToast = useCallback((message, type = "info") => {
//     if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
//     setToast({ show: true, message, type });
//     toastTimeoutRef.current = setTimeout(
//       () => setToast({ show: false, message: "", type: "info" }),
//       3_000
//     );
//   }, []);

//   useEffect(() => {
//     if (!connected) {
//       if (subscribedRef.current) {
//         unsubscribersRef.current.forEach((u) => u());
//         unsubscribersRef.current = [];
//         subscribedRef.current = false;
//       }
//       return;
//     }
//     if (subscribedRef.current) return;
//     subscribedRef.current = true;

//     unsubscribersRef.current.push(
//       subscribe("/mission/status", "std_msgs/String", (msg) => {
//         try {
//           const s = JSON.parse(msg.data);
//           setState(s.state || "UNKNOWN");
//           setData(s);
//           if (s.mission_file) setSelectedMission((prev) => prev || s.mission_file);
//           if (s.state === "WATCHDOG_FAULT") {
//             recordFault({
//               missed_tag:        s.target_tag,
//               last_seen_tag:     s.tag,
//               distance_traveled: s.distance_traveled ?? 0,
//               message: `Missed tag ${s.target_tag} at step ${s.step}/${s.total_steps}`,
//             });
//           }
//           if (s.loop !== undefined) setIsLoopOn(s.loop);
//         } catch (_) {}
//       })
//     );

//     // ── /pgv_pose: throttled to POSE_THROTTLE_MS ───────────────────────────
//     // This topic can publish at 10-50Hz. Calling setPose() on every message
//     // triggers a full re-render of this (large) component every time, which
//     // previously caused a runaway render loop that starved other tabs of
//     // main-thread time. We now just stash the latest value and flush it on
//     // a fixed interval instead of on every message.
//     unsubscribersRef.current.push(
//       subscribe("/pgv_pose", "geometry_msgs/Pose2D", (msg) => {
//         poseThrottleRef.current.pending = {
//           x:     parseFloat(msg.x).toFixed(2),
//           y:     parseFloat(msg.y).toFixed(2),
//           theta: parseFloat(msg.theta).toFixed(1),
//         };
//         if (!poseThrottleRef.current.timer) {
//           poseThrottleRef.current.timer = setTimeout(() => {
//             if (poseThrottleRef.current.pending) {
//               setPose(poseThrottleRef.current.pending);
//             }
//             poseThrottleRef.current.timer = null;
//           }, POSE_THROTTLE_MS);
//         }
//       })
//     );

//     unsubscribersRef.current.push(
//       subscribe("/watchdog/status", "std_msgs/String", (msg) => {
//         try {
//           const w = JSON.parse(msg.data);
//           const isFault =
//             w.fault === true || w.error === true ||
//             w.status === "fault" || w.status === "error";
//           if (!isFault) return;
//           recordFault(w);
//         } catch (_) {}
//       })
//     );
//   }, [connected, subscribe, recordFault]);

//   // Clean up any pending throttle timer on unmount
//   useEffect(() => {
//     return () => {
//       if (poseThrottleRef.current.timer) {
//         clearTimeout(poseThrottleRef.current.timer);
//         poseThrottleRef.current.timer = null;
//       }
//     };
//   }, []);

//   const callSvc = useCallback(
//     (name, toastKey = "mission_control.command_sent") => {
//       if (!connected) { showToast(t("mission_control.system_offline"), "error"); return; }
//       rosCallService(name, "std_srvs/Trigger", {}, (res) => {
//         res.success
//           ? showToast(res.message || t(toastKey), "success")
//           : showToast(res.message || t("mission_control.command_failed"), "error");
//       });
//     },
//     [connected, rosCallService, t, showToast]
//   );

//   const toggleLoop = useCallback(() => {
//     if (!connected) { showToast(t("mission_control.system_offline"), "error"); return; }
//     setLoopLoading(true);
//     const serviceName = isLoopOn ? "/mission/loop_off" : "/mission/loop_on";
//     const actionName  = isLoopOn ? "Loop OFF" : "Loop ON";
//     rosCallService(serviceName, "std_srvs/Trigger", {}, (res) => {
//       setLoopLoading(false);
//       if (res.success) {
//         setIsLoopOn(!isLoopOn);
//         showToast(`${actionName} ${res.message || t("mission_control.command_sent")}`, "success");
//       } else {
//         showToast(res.message || t("mission_control.command_failed"), "error");
//       }
//     }, (err) => {
//       setLoopLoading(false);
//       showToast(`${actionName} error: ${err?.message || t("mission_control.unknown_error")}`, "error");
//     });
//   }, [connected, rosCallService, t, showToast, isLoopOn]);

//   const loadMission = useCallback(() => {
//     if (!connected)       { showToast(t("mission_control.offline_no_load"), "error"); return; }
//     if (!selectedMission) { showToast(t("mission_control.select_first"),    "error"); return; }
//     setLoading(true);
//     rosCallService(
//       "/mission/load",
//       "pgv_navigation_msgs/srv/LoadMission",
//       { filename: selectedMission },
//       (res) => {
//         setLoading(false);
//         res.success
//           ? showToast(`"${selectedMission}" ${t("mission_control.loaded_success")}`, "success")
//           : showToast(res.message || t("mission_control.load_failed"), "error");
//       },
//       (err) => {
//         showToast(`${t("mission_control.error_prefix")} ${err?.message || t("mission_control.unknown_error")}`, "error");
//         setLoading(false);
//       }
//     );
//   }, [connected, selectedMission, rosCallService, t, showToast]);

//   const triggerMission = useCallback(() => {
//     if (!connected) { showToast(t("mission_control.system_offline"), "error"); return; }
//     if (!selectedMission && !data.mission_file) {
//       showToast(t("mission_control.no_mission_trigger"), "error"); return;
//     }
//     setTriggerLoading(true);
//     rosCallService(
//       "/mission/trigger",
//       "std_srvs/Trigger",
//       {},
//       (res) => {
//         setTriggerLoading(false);
//         res.success
//           ? showToast(res.message || t("mission_control.trigger_success"), "success")
//           : showToast(res.message || t("mission_control.trigger_failed"),  "error");
//       },
//       (err) => {
//         setTriggerLoading(false);
//         showToast(`${t("mission_control.trigger_error")} ${err?.message || t("mission_control.unknown_error")}`, "error");
//       }
//     );
//   }, [connected, selectedMission, data.mission_file, rosCallService, t, showToast]);

//   const handlePauseResume = useCallback(() => {
//     if      (state === "DRIVE_TO_TAG") callSvc("/mission/pause",  "mission_control.mission_paused");
//     else if (state === "PAUSED")       callSvc("/mission/resume", "mission_control.mission_resumed");
//   }, [state, callSvc]);

//   // ── Derived with pose validation toggle ─────────────────────────────────────
//   const pct               = data.total_steps > 0 ? ((data.step / data.total_steps) * 100).toFixed(1) : 0;
//   const availableMissions = data.available || [];

//   // Only check alignment if pose validation is enabled
//   const robotAligned      = poseValidationEnabled ? isAligned(pose.x, pose.y) : true;
//   const tagDetected       = poseValidationEnabled ? isTagDetected(pose.x, pose.y) : true;
//   const needsAlignment    = poseValidationEnabled && tagDetected && !robotAligned;
//   const isStartEnabled    = state === "WAIT_FOR_START" && connected && robotAligned && tagDetected;
//   const isTriggerEnabled  = connected && (selectedMission || data.mission_file);

//   // Direction label — guarded so a missing translation key can't fire a
//   // console.error on every render (this ran at pose-update frequency before
//   // throttling and was the main cause of the render-storm slowdown).
//   const directionLabel = t("mission_control.direction") || "Direction";

//   const toastColors = {
//     success: "border-green-500 bg-green-900 dark:bg-green-900/90",
//     error:   "border-red-500 bg-red-900 dark:bg-red-900/90",
//     info:    "border-sky-500 bg-slate-900 dark:bg-slate-900/90",
//   };

//   const posePillClass = `rounded-xl border px-3 py-2 flex items-center gap-2 flex-wrap transition-colors ${
//     !poseValidationEnabled
//       ? "bg-gray-50 dark:bg-gray-800/50 border-gray-300 dark:border-gray-600"
//       : needsAlignment
//         ? "bg-amber-50 dark:bg-amber-950/30 border-amber-400"
//         : robotAligned && tagDetected
//           ? "bg-green-50 dark:bg-green-950/30 border-green-400"
//           : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
//   }`;

//   // ── Render ─────────────────────────────────────────────────────────────────
//   return (
//     <div className="min-h-screen bg-gray-100 dark:bg-slate-950 text-gray-900 dark:text-white font-sans transition-colors duration-500
//                     p-3 sm:p-4 md:p-6 lg:p-12
//                     flex flex-col gap-4 sm:gap-5 md:gap-6 lg:gap-8">

//       {/* MISSED TAG ALERT BANNER */}
//       {missedTagAlert && (
//         <div className="w-full bg-red-600 dark:bg-red-700 text-white py-4 px-4 rounded-xl flex items-center justify-between gap-3 shadow-lg animate-pulse">
//           <div className="flex items-center gap-3">
//             <span className="text-3xl">⚠️</span>
//             <div>
//               <span className="font-black uppercase tracking-wider text-lg">
//                 MISSED TAG {missedTagAlert.tag}
//               </span>
//               <span className="text-sm ml-3 opacity-80">
//                 after {missedTagAlert.distance.toFixed(2)} m
//               </span>
//             </div>
//           </div>
//           <button
//             onClick={() => setMissedTagAlert(null)}
//             className="text-white/80 hover:text-white bg-white/20 hover:bg-white/30 rounded-full transition-all"
//             style={{ minWidth: 44, minHeight: 44, display: "flex", alignItems: "center", justifyContent: "center" }}
//           >
//             <IconClose size={22} />
//           </button>
//         </div>
//       )}

//       {/* WATCHDOG MODAL */}
//       <WatchdogModal
//         show={showWatchdogModal}
//         error={watchdogError}
//         onDismiss={() => { setShowWatchdogModal(false); setWatchdogError(null); }}
//         callSvc={callSvc}
//         t={t}
//       />

//       {/* ALIGNMENT NOTE */}
//       <AlignmentNote
//         show={showAlignNote}
//         currentX={pose.x}
//         currentY={pose.y}
//         onClose={() => setShowAlignNote(false)}
//       />

//       {/* HEADER */}
//       <div className="flex justify-between items-center border-b-4 border-sky-500 pb-3 flex-wrap gap-3">
//         <h1 className="font-black tracking-tighter uppercase text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
//           ▶️ {t("mission_control.title")}
//         </h1>

//         <div className="flex items-center gap-2 sm:gap-3 flex-wrap">

//           {/* Pose Validation Toggle Button */}
//           <button
//             onClick={() => setPoseValidationEnabled(!poseValidationEnabled)}
//             className={`flex items-center gap-2 px-4 rounded-xl font-black text-sm uppercase tracking-wider transition-all active:scale-95 ${
//               poseValidationEnabled
//                 ? "bg-sky-500 hover:bg-sky-400 text-white"
//                 : "bg-gray-500 hover:bg-gray-400 text-white"
//             }`}
//             style={{ minHeight: 48 }}
//             title={poseValidationEnabled ? "Pose validation ON - Click to disable" : "Pose validation OFF - Click to enable"}
//           >
//             {poseValidationEnabled ? <IconEyeOn size={20} /> : <IconEyeOff size={20} />}
//             <span>{poseValidationEnabled ? "Pose OFF" : "Pose ON"}</span>
//           </button>

//           {/* Pose pill — only show when validation is enabled */}
//           {!poseIsZero && poseValidationEnabled && (
//             <div className={posePillClass}>
//               <span className="text-sm font-bold text-sky-600 dark:text-sky-400">X:</span>
//               <span className={`text-sm font-mono font-bold ${
//                 poseValidationEnabled && Math.abs(parseFloat(pose.x)) <= 1 && tagDetected
//                   ? "text-green-600 dark:text-green-400"
//                   : "text-gray-700 dark:text-gray-200"
//               }`}>{pose.x} mm</span>

//               <div className="w-px h-5 bg-slate-300 dark:bg-slate-600" />

//               <span className="text-sm font-bold text-sky-600 dark:text-sky-400">Y:</span>
//               <span className={`text-sm font-mono font-bold ${
//                 poseValidationEnabled && Math.abs(parseFloat(pose.y)) <= 1 && tagDetected
//                   ? "text-green-600 dark:text-green-400"
//                   : "text-gray-700 dark:text-gray-200"
//               }`}>{pose.y} mm</span>

//               <div className="w-px h-5 bg-slate-300 dark:bg-slate-600" />

//               <span className="text-sm font-bold text-sky-600 dark:text-sky-400">θ:</span>
//               <span className="text-sm font-mono font-bold text-purple-600 dark:text-purple-400">
//                 {pose.theta}°
//               </span>

//               {connected && poseValidationEnabled && (
//                 <>
//                   <div className="w-px h-5 bg-slate-300 dark:bg-slate-600" />
//                   <span className={`w-3 h-3 rounded-full ${
//                     needsAlignment
//                       ? "bg-amber-400 animate-pulse"
//                       : robotAligned && tagDetected
//                         ? "bg-green-500"
//                         : "bg-gray-400"
//                   }`} />
//                   <span className={`text-sm font-bold ${
//                     needsAlignment
//                       ? "text-amber-600 dark:text-amber-400"
//                       : robotAligned && tagDetected
//                         ? "text-green-600 dark:text-green-400"
//                         : "text-gray-500 dark:text-gray-400"
//                   }`}>
//                     {!tagDetected
//                       ? t("mission_control.no_signal")
//                       : !robotAligned
//                         ? t("mission_control.center_tag")
//                         : t("mission_control.ready")}
//                   </span>
//                 </>
//               )}
//             </div>
//           )}

//           {/* Center Tag button — only show when pose validation is enabled */}
//           {poseValidationEnabled && needsAlignment && (
//             <button
//               onClick={() => setShowAlignNote(true)}
//               className="flex items-center gap-2 px-4 bg-amber-500 hover:bg-amber-400 text-white rounded-xl font-black text-sm uppercase tracking-wider transition-all active:scale-95"
//               style={{ minHeight: 48 }}
//             >
//               🎯 {t("mission_control.center_tag_btn")}
//             </button>
//           )}

//           <div className={`text-sm font-bold ${connected ? "text-green-600" : "text-red-600"}`}>
//             {connected ? t("mission_control.status_online") : t("mission_control.status_offline")}
//           </div>
//         </div>
//       </div>

//       {/* LOAD MISSION */}
//       <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl shadow-xl border-2 dark:border-slate-800 p-4 sm:p-6 md:p-8">
//         <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3 sm:gap-4">
//           <div className="flex-1 min-w-0" ref={dropdownRef}>
//             <label className="block text-xs font-black uppercase opacity-40 tracking-widest mb-2">
//               {t("mission_control.mission_file")}
//             </label>
//             <div className="relative">
//               <button
//                 onClick={() => connected && setDropdownOpen((o) => !o)}
//                 disabled={!connected}
//                 className="w-full px-4 bg-slate-100 dark:bg-slate-800 text-gray-900 dark:text-white rounded-xl font-bold text-base flex items-center justify-between border-2 border-slate-200 dark:border-slate-700 hover:border-sky-500 disabled:opacity-40 transition-all"
//                 style={{ minHeight: 56 }}
//               >
//                 <span className="truncate">{selectedMission || t("mission_control.select_mission")}</span>
//                 <IconChevron />
//               </button>
//               {dropdownOpen && (
//                 <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 z-50 max-h-64 overflow-y-auto">
//                   <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 py-3">
//                     <span className="text-xs font-black uppercase opacity-40 tracking-widest">
//                       {availableMissions.length} {t("mission_control.missions_count")}
//                     </span>
//                   </div>
//                   {availableMissions.length === 0 ? (
//                     <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400 text-base">
//                       {t("mission_control.waiting_list")}
//                     </div>
//                   ) : (
//                     availableMissions.map((mission, idx) => (
//                       <button
//                         key={idx}
//                         onClick={() => { setSelectedMission(mission); setDropdownOpen(false); }}
//                         className={`w-full px-4 text-left text-base hover:bg-sky-50 dark:hover:bg-sky-900/30 transition-colors font-medium flex items-center justify-between ${
//                           selectedMission === mission
//                             ? "bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400"
//                             : "text-gray-900 dark:text-white"
//                         }`}
//                         style={{ minHeight: 52 }}
//                       >
//                         <span className="truncate">{mission}</span>
//                         <div className="flex items-center gap-2 shrink-0 ml-2">
//                           {data.mission_file === mission && (
//                             <span className="text-xs bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 px-2 py-1 rounded-full font-bold">
//                               {t("mission_control.loaded_badge")}
//                             </span>
//                           )}
//                           {selectedMission === mission && <span className="text-sky-500 text-sm">✓</span>}
//                         </div>
//                       </button>
//                     ))
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Load / Start button — 56 px tall */}
//           <button
//             onClick={loadMission}
//             disabled={!connected || loading || !selectedMission}
//             className="flex items-center justify-center gap-3 px-6 bg-sky-600 hover:bg-sky-500 dark:bg-sky-700 dark:hover:bg-sky-600 disabled:opacity-30 text-white rounded-xl font-black uppercase text-base shadow-lg transition-all active:scale-95 shrink-0"
//             style={{ minHeight: 56 }}
//           >
//             {loading
//               ? <div className="animate-spin h-6 w-6 border-2 border-white border-t-transparent rounded-full" />
//               : <IconPlay size={22} />}
//             <span>{loading ? t("mission_control.starting") : t("mission_control.start_mission")}</span>
//           </button>
//         </div>
//         <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
//           {availableMissions.length > 0
//             ? `${availableMissions.length} ${t("mission_control.missions_from_robot")}`
//             : t("mission_control.connect_to_see")}
//         </p>
//       </div>

//       {/* TELEMETRY */}
//       <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl shadow-xl border-2 dark:border-slate-800 p-4 sm:p-6 md:p-8">
//         <div className="flex flex-row items-start justify-between gap-3 mb-4 flex-wrap">
//           <div className="flex flex-col min-w-0">
//             <span className="text-xs font-black uppercase opacity-40 tracking-widest">{t("mission_control.loaded_mission")}</span>
//             <span className="text-base sm:text-xl font-black text-sky-500 uppercase truncate">
//               {data.mission_file || t("mission_control.none")}
//             </span>
//           </div>
//           <div className="flex flex-col items-end shrink-0">
//             <span className="text-xs font-black uppercase opacity-40 tracking-widest">{t("mission_control.state")}</span>
//             <span className="px-4 py-1.5 bg-sky-500 text-white rounded-lg text-base font-black">{state}</span>
//           </div>
//         </div>

//         {/* Current Tag → Target Tag Progress */}
//         <div className="bg-gradient-to-r from-sky-50 to-blue-50 dark:from-sky-900/20 dark:to-blue-900/20 rounded-xl p-4 sm:p-5 border-2 border-sky-300 dark:border-sky-700 mb-4 sm:mb-5">
//           <span className="text-xs font-black uppercase opacity-40 block mb-3 tracking-widest">📍 Tag Progress</span>
//           <div className="flex items-center justify-between gap-4 sm:gap-6">
//             {/* Current Tag */}
//             <div className="flex flex-col items-center flex-1">
//               <span className="text-xs font-bold uppercase opacity-50 mb-1">Current</span>
//               <span className="text-3xl sm:text-4xl font-black text-sky-600 dark:text-sky-400 font-mono">{data.tag ?? "0"}</span>
//             </div>
//             {/* Arrow */}
//             <div className="flex items-center justify-center shrink-0">
//               <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-sky-500 dark:text-sky-400">
//                 <polyline points="5 12 19 12" />
//                 <polyline points="12 5 19 12 12 19" />
//               </svg>
//             </div>
//             {/* Target Tag */}
//             <div className="flex flex-col items-center flex-1">
//               <span className="text-xs font-bold uppercase opacity-50 mb-1">Target</span>
//               <span className="text-3xl sm:text-4xl font-black text-blue-600 dark:text-blue-400 font-mono">{data.target_tag ?? "--"}</span>
//             </div>
//           </div>
//           {/* Distance to Tag */}
//           {data.dist_tag !== undefined && (
//             <div className="mt-3 pt-3 border-t border-sky-200 dark:border-sky-700">
//               <div className="flex items-center justify-between">
//                 <span className="text-xs font-bold uppercase opacity-50">Distance to Tag</span>
//                 <span className="text-lg font-black text-sky-600 dark:text-sky-400 font-mono">{(data.dist_tag || 0).toFixed(2)} m</span>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* 2×2 grid on 7-inch portrait; 4 cols on sm+ */}
//         <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-5">
//           {[
//             { label: t("mission_control.speed_label"), val: `${(data.speed || 0).toFixed(2)}m/s`,           color: "text-emerald-500" },
//             { label: t("mission_control.progress"),   val: `${data.step ?? 0} / ${data.total_steps ?? 0}`,  color: "text-amber-500"  },
//             { label: t("mission_control.action"),     val: data.action || t("mission_control.idle_action"), color: "text-purple-500" },
//             { label: directionLabel,                  val: data.direction || t("mission_control.idle_action"), color: "text-indigo-500" },
//           ].map((item, idx) => (
//             <div key={idx} className="bg-gray-50 dark:bg-slate-800/50 p-4 sm:p-5 rounded-xl border dark:border-slate-700">
//               <span className="text-xs font-black uppercase opacity-40 block mb-1 leading-tight">{item.label}</span>
//               <span className={`text-2xl sm:text-3xl font-black font-mono truncate block ${item.color}`}>{item.val}</span>
//             </div>
//           ))}
//         </div>

//         <div className="space-y-2">
//           <div className="flex justify-between text-sm font-black uppercase tracking-tighter">
//             <span className="opacity-50">{t("mission_control.mission_progress")}</span>
//             <span className="text-sky-500">{pct}%</span>
//           </div>
//           <div className="h-8 sm:h-10 bg-gray-200 dark:bg-slate-800 rounded-full p-1.5 border-2 dark:border-slate-700 overflow-hidden">
//             <div
//               className="h-full bg-gradient-to-r from-sky-600 to-blue-400 rounded-full transition-all duration-700"
//               style={{ width: `${pct}%` }}
//             />
//           </div>
//         </div>
//       </div>

//       {/* CONTROL BUTTONS — 2×2 on 7-inch portrait */}
//       <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
//         {/* START */}
//         <button
//           onClick={() => callSvc("/mission/start", "mission_control.mission_started")}
//           disabled={!isStartEnabled}
//           className="flex flex-col items-center justify-center bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white rounded-2xl sm:rounded-3xl shadow-xl disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
//           style={{ minHeight: 120, padding: "20px 12px" }}
//         >
//           <IconPlay size={44} />
//           <span className="text-base mt-3 font-black uppercase tracking-widest">{t("mission_control.start")}</span>
//           {state === "WAIT_FOR_START" && connected && poseValidationEnabled && needsAlignment && (
//             <span className="mt-1.5 text-xs font-semibold opacity-80 normal-case tracking-normal px-2 text-center leading-tight">
//               {t("mission_control.center_tag_hint")}
//             </span>
//           )}
//         </button>

//         {/* PAUSE / RESUME */}
//         <button
//           onClick={handlePauseResume}
//           disabled={!["DRIVE_TO_TAG", "PAUSED"].includes(state)}
//           className="flex flex-col items-center justify-center bg-amber-500 hover:bg-amber-400 dark:bg-amber-600 dark:hover:bg-amber-500 text-white rounded-2xl sm:rounded-3xl shadow-xl disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
//           style={{ minHeight: 120, padding: "20px 12px" }}
//         >
//           {state === "PAUSED" ? <IconResume size={44} /> : <IconPause size={44} />}
//           <span className="text-base mt-3 font-black uppercase tracking-widest">
//             {state === "PAUSED" ? t("mission_control.resume") : t("mission_control.pause")}
//           </span>
//         </button>

//         {/* TRIGGER */}
//         <button
//           onClick={triggerMission}
//           disabled={!isTriggerEnabled}
//           className="flex flex-col items-center justify-center bg-indigo-600 hover:bg-indigo-500 dark:bg-indigo-700 dark:hover:bg-indigo-600 text-white rounded-2xl sm:rounded-3xl shadow-xl disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
//           style={{ minHeight: 120, padding: "20px 12px" }}
//         >
//           {triggerLoading
//             ? <div className="animate-spin h-10 w-10 border-2 border-white border-t-transparent rounded-full" />
//             : <IconTrigger size={44} />}
//           <span className="text-base mt-3 font-black uppercase tracking-widest">
//             {triggerLoading ? t("mission_control.triggering") : t("mission_control.mission_trigger")}
//           </span>
//         </button>

//         {/* ABORT */}
//         <button
//           onClick={() => callSvc("/mission/abort", "mission_control.mission_aborted")}
//           disabled={state === "IDLE" || !connected}
//           className="flex flex-col items-center justify-center bg-red-600 hover:bg-red-500 dark:bg-red-700 dark:hover:bg-red-600 text-white rounded-2xl sm:rounded-3xl shadow-xl disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
//           style={{ minHeight: 120, padding: "20px 12px" }}
//         >
//           <IconAbort size={44} />
//           <span className="text-base mt-3 font-black uppercase tracking-widest">{t("mission_control.abort")}</span>
//         </button>
//       </div>

//       {/* LOOP CONTROL */}
//       <button
//         onClick={toggleLoop}
//         disabled={!connected || loopLoading}
//         className={`w-full rounded-2xl text-base font-black uppercase flex items-center justify-center gap-4 shadow-xl disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-[0.98] ${
//           isLoopOn
//             ? "bg-green-600 hover:bg-green-500 dark:bg-green-700 dark:hover:bg-green-600"
//             : "bg-gray-600 hover:bg-gray-500 dark:bg-gray-700 dark:hover:bg-gray-600"
//         }`}
//         style={{ minHeight: 64 }}
//       >
//         {loopLoading
//           ? <div className="animate-spin h-7 w-7 border-2 border-white border-t-transparent rounded-full" />
//           : <IconLoop size={28} />}
//         <span className="text-white">{isLoopOn ? "Loop ON ✓" : "Loop OFF"}</span>
//       </button>

//       {/* SAFETY BYPASS CONTROL
//       <button
//         onClick={() => {
//           if (!connected) { showToast(t("mission_control.system_offline"), "error"); return; }
//           const bypassValue = data.safety_active; // true to disable, false to enable
//           rosCallService("/set_safety_bypass", "std_srvs/SetBool", { data: bypassValue }, (res) => {
//             res.success
//               ? showToast(bypassValue ? t("mission_control.safety_disabled") : t("mission_control.safety_enabled"), "success")
//               : showToast(res.message || t("mission_control.command_failed"), "error");
//           });
//         }}
//         disabled={!connected}
//         className={`w-full rounded-2xl text-base font-black uppercase flex items-center justify-center gap-4 shadow-xl disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-[0.98] ${
//           data.safety_active
//             ? "bg-red-600 hover:bg-red-500 dark:bg-red-700 dark:hover:bg-red-600"
//             : "bg-orange-600 hover:bg-orange-500 dark:bg-orange-700 dark:hover:bg-orange-600"
//         }`}
//         style={{ minHeight: 64 }}
//         title={data.safety_active ? "Safety is ON - Click to disable" : "Safety is OFF - Click to enable"}
//       >
//         <IconWarning size={28} />
//         <span className="text-white">{data.safety_active ? "🔴 Safety IS ON" : "⚠️ Safety IS OFF"}</span>
//       </button> */}

//       {/* RESET + UNLOAD */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
//         <button
//           onClick={() => callSvc("/mission/reset", "mission_control.mission_reset")}
//           disabled={state === "IDLE" || state === "DRIVE_TO_TAG"}
//           className="bg-slate-700 hover:bg-slate-600 dark:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-2xl text-base font-black uppercase flex items-center justify-center gap-4 shadow-xl disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
//           style={{ minHeight: 64 }}
//         >
//           <IconReset size={26} /> {t("mission_control.reset_mission")}
//         </button>
//         <button
//           onClick={() => callSvc("/mission/unload", "mission_control.mission_unloaded")}
//           disabled={state === "DRIVE_TO_TAG" || !connected}
//           className="bg-purple-700 hover:bg-purple-600 dark:bg-purple-800 dark:hover:bg-purple-700 text-white rounded-2xl text-base font-black uppercase flex items-center justify-center gap-4 shadow-xl disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
//           style={{ minHeight: 64 }}
//         >
//           <IconReset size={26} /> {t("mission_control.unload_mission")}
//         </button>
//       </div>

//       {/* TOAST */}
//       {toast.show && (
//         <div className={`fixed bottom-5 left-1/2 -translate-x-1/2 px-5 py-4 rounded-xl text-base font-bold shadow-2xl border-2 z-50 whitespace-nowrap ${toastColors[toast.type] || toastColors.info}`}>
//           <div className="flex items-center gap-3 text-white">
//             {toast.type === "success" && <span>✓</span>}
//             {toast.type === "error"   && <span>✗</span>}
//             {toast.type === "info"    && <span>ℹ</span>}
//             <span>{toast.message}</span>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }




                 
//updated program with mobile message integration

import React, { useRef, useState, useEffect, useCallback } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useROS } from "../context/RosContext";

// ── Icons ─────────────────────────────────────────────────────────────────────
const IconPlay    = ({ size = 40 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21" /></svg>);
const IconPause   = ({ size = 40 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>);
const IconResume  = ({ size = 40 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21" /></svg>);
const IconAbort   = ({ size = 40 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="9" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const IconReset   = ({ size = 28 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 .49-3.5" /></svg>);
const IconChevron = ()              => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>);
const IconTrigger = ({ size = 40 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>);
const IconWarning = ({ size = 28 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 9v4M12 17h.01" /><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" /></svg>);
const IconClose   = ({ size = 24 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>);
const IconLoop    = ({ size = 28 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 2l4 4-4 4" /><path d="M3 12v-2a4 4 0 0 1 4-4h14" /><path d="M7 22l-4-4 4-4" /><path d="M21 12v2a4 4 0 0 1-4 4H3" /></svg>);
const IconEyeOn   = ({ size = 24 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>);
const IconEyeOff  = ({ size = 24 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>);



// ── Mobile notification (ntfy.sh) ───────────────────────────────────────────
// Pushes tag-miss/watchdog fault details straight to a subscribed phone via
// the ntfy Android/iOS app. No account/server needed — anyone subscribed to
// this topic string receives the push, so keep it reasonably non-guessable.


const NTFY_TOPIC = "minda_tagmissdata";

function notifyMobile(title, message) {
  fetch(`https://ntfy.sh/${NTFY_TOPIC}`, {
    method: "POST",
    body: message,
    headers: {
      Title: title,
      Priority: "urgent",
      Tags: "warning",
    },
  }).catch((err) => console.warn("ntfy notify failed:", err));
}

// ── Constants ─────────────────────────────────────────────────────────────────
const MIN_ALIGNMENT = -1;
const MAX_ALIGNMENT =  1;
const POSE_THROTTLE_MS = 150;

const isAligned     = (x, y) => parseFloat(x) >= MIN_ALIGNMENT && parseFloat(x) <= MAX_ALIGNMENT && parseFloat(y) >= MIN_ALIGNMENT && parseFloat(y) <= MAX_ALIGNMENT;
const isTagDetected = (x, y) => Math.abs(parseFloat(x)) > 0.1 || Math.abs(parseFloat(y)) > 0.1;

// ── Direction advice ──────────────────────────────────────────────────────────
// Robot's coordinate convention (confirmed with operator):
//   +y = tag is AHEAD of robot (front, 180°)  → operator should drive FORWARD
//   -y = tag is BEHIND robot   (down, 0°)     → operator should drive BACKWARD
//   +x = tag is to the RIGHT   (270°)         → operator should move RIGHT
//   -x = tag is to the LEFT    (90°)          → operator should move LEFT
// Kept deliberately simple — one big arrow + one short command, no mm
// readouts or jargon, since this is read by an operator standing at a
// 7-inch kiosk, not a developer debugging alignment.
function getDirectionAdvice(x, y) {
  const xNum = parseFloat(x);
  const yNum = parseFloat(y);

  if (Math.abs(yNum) > Math.abs(xNum)) {
    if (yNum > MAX_ALIGNMENT) return { arrow: "⬆️", instruction: "Move Forward" };
    if (yNum < MIN_ALIGNMENT) return { arrow: "⬇️", instruction: "Move Backward" };
  } else {
    if (xNum > MAX_ALIGNMENT) return { arrow: "➡️", instruction: "Move Right" };
    if (xNum < MIN_ALIGNMENT) return { arrow: "⬅️", instruction: "Move Left" };
  }
  return { arrow: "🎯", instruction: "Almost There — Hold Steady" };
}



// ── Alignment Note ────────────────────────────────────────────────────────────
function AlignmentNote({ show, currentX, currentY, onClose }) {
  if (!show) return null;
  const advice = getDirectionAdvice(currentX, currentY);
  return (
    <div className="w-full bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-400 rounded-2xl px-5 py-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <span className="text-5xl">{advice.arrow}</span>
        <div className="font-black text-amber-700 dark:text-amber-400 text-xl sm:text-2xl uppercase tracking-wide">
          {advice.instruction}
        </div>
      </div>
      <button
        onClick={onClose}
        className="shrink-0 p-2 rounded-full hover:bg-amber-200 dark:hover:bg-amber-800 transition-colors"
        style={{ minWidth: 44, minHeight: 44 }}
      >
        <IconClose size={22} />
      </button>
    </div>
  );
}


// // ── Watchdog Modal ────────────────────────────────────────────────────────────
function WatchdogModal({ show, error, onDismiss, callSvc, t }) {
  if (!show || !error) return null;
  const distanceInMeters = ((error.distance_traveled || 0) / 1_000).toFixed(2);
  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[60] p-3 backdrop-blur-md overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-sm border-2 border-red-500 overflow-hidden my-4">

        {/* HEADER — ultra-compact for 7-inch */}
        <div className="bg-red-50 dark:bg-red-950/40 px-4 pt-3 pb-2 text-center">
          <div className="text-4xl mb-0.5">⚠️</div>
          <h3 className="text-lg font-black text-red-600 dark:text-red-400 leading-tight">{t("mission_control.watchdog_title")}</h3>
          <p className="mt-0.5 text-xs font-semibold text-gray-600 dark:text-gray-300 line-clamp-2">{error.message}</p>
        </div>

        {/* BODY — scrollable, ultra-compact */}
        <div className="px-4 py-2.5 space-y-1.5 max-h-48 overflow-y-auto">
          <div className="bg-red-50 dark:bg-red-950/30 rounded-lg p-2.5 border border-red-200 dark:border-red-800">
            <div className="flex items-center gap-1.5 mb-1.5">
              <IconWarning size={16} />
              <span className="font-black text-red-600 dark:text-red-400 text-xs">{t("mission_control.watchdog_details")}</span>
            </div>
            <div className="space-y-1">
              {[
                { label: t("mission_control.watchdog_missed_tag"), val: `${error.missed_tag}`,           color: "text-red-600 dark:text-red-400" },
                { label: t("mission_control.watchdog_last_tag"),   val: `${error.last_seen_tag ?? "?"}`, color: "text-yellow-500" },
                { label: t("mission_control.watchdog_distance"),   val: `${distanceInMeters} m`,          color: "text-red-600 dark:text-red-400" },
                { label: t("mission_control.watchdog_time"),       val: error.timestamp,                  color: "text-gray-500 font-mono text-xs" },
              ].map(({ label, val, color }) => (
                <div key={label} className="flex justify-between items-center gap-2">
                  <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 truncate">{label}</span>
                  <span className={`text-sm font-black shrink-0 ${color}`}>{val}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-amber-50 dark:bg-amber-950/30 rounded-lg p-2.5 border border-amber-200 dark:border-amber-800">
            <p className="text-xs font-semibold text-amber-800 dark:text-amber-300 leading-snug">
              📋 {t("mission_control.watchdog_info")} {error.missed_tag} {t("mission_control.watchdog_after")} {distanceInMeters} m {t("mission_control.watchdog_from")} {error.last_seen_tag ?? "?"}. {t("mission_control.watchdog_check")}
            </p>
          </div>
        </div>

        <div className="px-4 pb-3 pt-2 flex gap-2">
          <button
            onClick={() => { onDismiss(); callSvc("/mission/reset", "Reset mission after watchdog"); }}
            className="flex-1 py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-black uppercase text-xs transition-all active:scale-95"
            style={{ minHeight: 44 }}
          >
            {t("mission_control.watchdog_reset")}
          </button>
        </div>
      </div>
    </div>
  );
}



// ── Main Component ────────────────────────────────────────────────────────────
export default function AMRControl() {
  const { t } = useLanguage();
  const { connected, subscribe, callService: rosCallService } = useROS();

  const toastTimeoutRef  = useRef(null);
  const dropdownRef      = useRef(null);
  const subscribedRef    = useRef(false);
  const unsubscribersRef = useRef([]);

  // ── Pose throttle refs (no re-render on every /pgv_pose message) ────────────
  const poseThrottleRef = useRef({ pending: null, timer: null });

  // ── State ──────────────────────────────────────────────────────────────────
  // Load pose validation preference from localStorage on init
  const [poseValidationEnabled, setPoseValidationEnabledState] = useState(() => {
    try {
      const saved = localStorage.getItem("poseValidationEnabled");
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  // Wrapper to sync state with localStorage
  const setPoseValidationEnabled = useCallback((value) => {
    const newValue = typeof value === 'function' ? value(poseValidationEnabled) : value;
    setPoseValidationEnabledState(newValue);
    try {
      localStorage.setItem("poseValidationEnabled", JSON.stringify(newValue));
    } catch (error) {
      console.warn("Failed to save pose validation preference:", error);
    }
  }, [poseValidationEnabled]);

  const [state, setState]                     = useState("Disconnected");
  const [pose, setPose]                       = useState({ x: "0.00", y: "0.00", theta: "0.0" });
  const [data, setData]                       = useState({
    step: 0, total_steps: 0, mission_file: "", safety_active: false,
    tag: 0, target_tag: 0, action: "", speed: 0, available: [], distance_traveled: 0,
  });
  const [toast, setToast]                     = useState({ show: false, message: "", type: "info" });
  const [loading, setLoading]                 = useState(false);
  const [triggerLoading, setTriggerLoading]   = useState(false);
  const [selectedMission, setSelectedMission] = useState("");
  const [dropdownOpen, setDropdownOpen]       = useState(false);
  const [watchdogError, setWatchdogError]     = useState(null);
  const [showWatchdogModal, setShowWatchdogModal] = useState(false);
  const [showAlignNote, setShowAlignNote]     = useState(false);
  const [missedTagAlert, setMissedTagAlert]   = useState(null);
  const [loopLoading, setLoopLoading]         = useState(false);
  const [isLoopOn, setIsLoopOn]               = useState(false);

  const poseIsZero =
    parseFloat(pose.x) === 0 &&
    parseFloat(pose.y) === 0 &&
    parseFloat(pose.theta) === 0;

  const recordFault = useCallback((w) => {
    const missedTagNum   = w.missed_tag ?? w.missedTag ?? w.expected_tag ?? w.target_tag ?? "?";
    const lastSeenTag    = w.last_seen_tag ?? w.lastSeenTag ?? w.current_tag ?? w.tag ?? "?";
    const distanceMeters = ((w.distance_traveled ?? w.distanceTraveled ?? w.distance ?? 0) / 1000).toFixed(2);
    const faultMessage   = w.message ?? w.error_message ?? "Watchdog fault detected";
    const timestamp      = new Date().toLocaleTimeString();

    setWatchdogError({
      missed_tag:        missedTagNum,
      last_seen_tag:     lastSeenTag,
      distance_traveled: w.distance_traveled ?? w.distanceTraveled ?? w.distance ?? 0,
      message:           faultMessage,
      timestamp,
    });
    setShowWatchdogModal(true);
    setMissedTagAlert({
      tag:       missedTagNum,
      timestamp,
      distance:  distanceMeters,
    });
    setTimeout(() => setMissedTagAlert(null), 8000);

    notifyMobile(
      `⚠️ Missed Tag ${missedTagNum}`,
      [
        `Missed Tag: ${missedTagNum}`,
        `Last Seen Tag: ${lastSeenTag}`,
        `Distance Traveled: ${distanceMeters} m`,
        `Time: ${timestamp}`,
        `Message: ${faultMessage}`,
      ].join("\n")
    );
  }, []);

  useEffect(() => {
    if (!showAlignNote) return;
    const timer = setTimeout(() => setShowAlignNote(false), 10_000);
    return () => clearTimeout(timer);
  }, [showAlignNote]);

  // Clear selectedMission when mission is unloaded from backend
  useEffect(() => {
    if (!data.mission_file) {
      setSelectedMission("");
    }
  }, [data.mission_file]);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const showToast = useCallback((message, type = "info") => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToast({ show: true, message, type });
    toastTimeoutRef.current = setTimeout(
      () => setToast({ show: false, message: "", type: "info" }),
      3_000
    );
  }, []);

  useEffect(() => {
    if (!connected) {
      if (subscribedRef.current) {
        unsubscribersRef.current.forEach((u) => u());
        unsubscribersRef.current = [];
        subscribedRef.current = false;
      }
      return;
    }
    if (subscribedRef.current) return;
    subscribedRef.current = true;

    unsubscribersRef.current.push(
      subscribe("/mission/status", "std_msgs/String", (msg) => {
        try {
          const s = JSON.parse(msg.data);
          setState(s.state || "UNKNOWN");
          setData(s);
          if (s.mission_file) setSelectedMission((prev) => prev || s.mission_file);
          if (s.state === "WATCHDOG_FAULT") {
            recordFault({
              missed_tag:        s.target_tag,
              last_seen_tag:     s.tag,
              distance_traveled: s.distance_traveled ?? 0,
              message: `Missed tag ${s.target_tag} at step ${s.step}/${s.total_steps}`,
            });
          }
          if (s.loop !== undefined) setIsLoopOn(s.loop);
        } catch (_) {}
      })
    );

    // ── /pgv_pose: throttled to POSE_THROTTLE_MS ───────────────────────────
    // This topic can publish at 10-50Hz. Calling setPose() on every message
    // triggers a full re-render of this (large) component every time, which
    // previously caused a runaway render loop that starved other tabs of
    // main-thread time. We now just stash the latest value and flush it on
    // a fixed interval instead of on every message.
    unsubscribersRef.current.push(
      subscribe("/pgv_pose", "geometry_msgs/Pose2D", (msg) => {
        poseThrottleRef.current.pending = {
          x:     parseFloat(msg.x).toFixed(2),
          y:     parseFloat(msg.y).toFixed(2),
          theta: parseFloat(msg.theta).toFixed(1),
        };
        if (!poseThrottleRef.current.timer) {
          poseThrottleRef.current.timer = setTimeout(() => {
            if (poseThrottleRef.current.pending) {
              setPose(poseThrottleRef.current.pending);
            }
            poseThrottleRef.current.timer = null;
          }, POSE_THROTTLE_MS);
        }
      })
    );

    unsubscribersRef.current.push(
      subscribe("/watchdog/status", "std_msgs/String", (msg) => {
        try {
          const w = JSON.parse(msg.data);
          const isFault =
            w.fault === true || w.error === true ||
            w.status === "fault" || w.status === "error";
          if (!isFault) return;
          recordFault(w);
        } catch (_) {}
      })
    );
  }, [connected, subscribe, recordFault]);

  // Clean up any pending throttle timer on unmount
  useEffect(() => {
    return () => {
      if (poseThrottleRef.current.timer) {
        clearTimeout(poseThrottleRef.current.timer);
        poseThrottleRef.current.timer = null;
      }
    };
  }, []);

  const callSvc = useCallback(
    (name, toastKey = "mission_control.command_sent") => {
      if (!connected) { showToast(t("mission_control.system_offline"), "error"); return; }
      rosCallService(name, "std_srvs/Trigger", {}, (res) => {
        res.success
          ? showToast(res.message || t(toastKey), "success")
          : showToast(res.message || t("mission_control.command_failed"), "error");
      });
    },
    [connected, rosCallService, t, showToast]
  );

  const toggleLoop = useCallback(() => {
    if (!connected) { showToast(t("mission_control.system_offline"), "error"); return; }
    setLoopLoading(true);
    const serviceName = isLoopOn ? "/mission/loop_off" : "/mission/loop_on";
    const actionName  = isLoopOn ? "Loop OFF" : "Loop ON";
    rosCallService(serviceName, "std_srvs/Trigger", {}, (res) => {
      setLoopLoading(false);
      if (res.success) {
        setIsLoopOn(!isLoopOn);
        showToast(`${actionName} ${res.message || t("mission_control.command_sent")}`, "success");
      } else {
        showToast(res.message || t("mission_control.command_failed"), "error");
      }
    }, (err) => {
      setLoopLoading(false);
      showToast(`${actionName} error: ${err?.message || t("mission_control.unknown_error")}`, "error");
    });
  }, [connected, rosCallService, t, showToast, isLoopOn]);

  const loadMission = useCallback(() => {
    if (!connected)       { showToast(t("mission_control.offline_no_load"), "error"); return; }
    if (!selectedMission) { showToast(t("mission_control.select_first"),    "error"); return; }
    setLoading(true);
    rosCallService(
      "/mission/load",
      "pgv_navigation_msgs/srv/LoadMission",
      { filename: selectedMission },
      (res) => {
        setLoading(false);
        res.success
          ? showToast(`"${selectedMission}" ${t("mission_control.loaded_success")}`, "success")
          : showToast(res.message || t("mission_control.load_failed"), "error");
      },
      (err) => {
        showToast(`${t("mission_control.error_prefix")} ${err?.message || t("mission_control.unknown_error")}`, "error");
        setLoading(false);
      }
    );
  }, [connected, selectedMission, rosCallService, t, showToast]);

  const triggerMission = useCallback(() => {
    if (!connected) { showToast(t("mission_control.system_offline"), "error"); return; }
    if (!selectedMission && !data.mission_file) {
      showToast(t("mission_control.no_mission_trigger"), "error"); return;
    }
    setTriggerLoading(true);
    rosCallService(
      "/mission/trigger",
      "std_srvs/Trigger",
      {},
      (res) => {
        setTriggerLoading(false);
        res.success
          ? showToast(res.message || t("mission_control.trigger_success"), "success")
          : showToast(res.message || t("mission_control.trigger_failed"),  "error");
      },
      (err) => {
        setTriggerLoading(false);
        showToast(`${t("mission_control.trigger_error")} ${err?.message || t("mission_control.unknown_error")}`, "error");
      }
    );
  }, [connected, selectedMission, data.mission_file, rosCallService, t, showToast]);

  const handlePauseResume = useCallback(() => {
    if      (state === "DRIVE_TO_TAG") callSvc("/mission/pause",  "mission_control.mission_paused");
    else if (state === "PAUSED")       callSvc("/mission/resume", "mission_control.mission_resumed");
  }, [state, callSvc]);

  // ── Derived with pose validation toggle ─────────────────────────────────────
  const pct               = data.total_steps > 0 ? ((data.step / data.total_steps) * 100).toFixed(1) : 0;
  const availableMissions = data.available || [];

  // Only check alignment if pose validation is enabled
  const robotAligned      = poseValidationEnabled ? isAligned(pose.x, pose.y) : true;
  const tagDetected       = poseValidationEnabled ? isTagDetected(pose.x, pose.y) : true;
  const needsAlignment    = poseValidationEnabled && tagDetected && !robotAligned;
  const isStartEnabled    = state === "WAIT_FOR_START" && connected && robotAligned && tagDetected;
  const isTriggerEnabled  = connected && (selectedMission || data.mission_file);

  // Direction label — guarded so a missing translation key can't fire a
  // console.error on every render (this ran at pose-update frequency before
  // throttling and was the main cause of the render-storm slowdown).
  const directionLabel = t("mission_control.direction") || "Direction";

  const toastColors = {
    success: "border-green-500 bg-green-900 dark:bg-green-900/90",
    error:   "border-red-500 bg-red-900 dark:bg-red-900/90",
    info:    "border-sky-500 bg-slate-900 dark:bg-slate-900/90",
  };

  const posePillClass = `rounded-xl border px-3 py-2 flex items-center gap-2 flex-wrap transition-colors ${
    !poseValidationEnabled
      ? "bg-gray-50 dark:bg-gray-800/50 border-gray-300 dark:border-gray-600"
      : needsAlignment
        ? "bg-amber-50 dark:bg-amber-950/30 border-amber-400"
        : robotAligned && tagDetected
          ? "bg-green-50 dark:bg-green-950/30 border-green-400"
          : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
  }`;

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-950 text-gray-900 dark:text-white font-sans transition-colors duration-500
                    p-3 sm:p-4 md:p-6 lg:p-12
                    flex flex-col gap-4 sm:gap-5 md:gap-6 lg:gap-8">

      {/* MISSED TAG ALERT BANNER */}
      {missedTagAlert && (
        <div className="w-full bg-red-600 dark:bg-red-700 text-white py-4 px-4 rounded-xl flex items-center justify-between gap-3 shadow-lg animate-pulse">
          <div className="flex items-center gap-3">
            <span className="text-3xl">⚠️</span>
            <div>
              <span className="font-black uppercase tracking-wider text-lg">
                MISSED TAG {missedTagAlert.tag}
              </span>
              <span className="text-sm ml-3 opacity-80">
                after {missedTagAlert.distance} m
              </span>
            </div>
          </div>
          <button
            onClick={() => setMissedTagAlert(null)}
            className="text-white/80 hover:text-white bg-white/20 hover:bg-white/30 rounded-full transition-all"
            style={{ minWidth: 44, minHeight: 44, display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <IconClose size={22} />
          </button>
        </div>
      )}

      {/* WATCHDOG MODAL */}
      <WatchdogModal
        show={showWatchdogModal}
        error={watchdogError}
        onDismiss={() => { setShowWatchdogModal(false); setWatchdogError(null); }}
        callSvc={callSvc}
        t={t}
      />

      {/* ALIGNMENT NOTE */}
      <AlignmentNote
        show={showAlignNote}
        currentX={pose.x}
        currentY={pose.y}
        onClose={() => setShowAlignNote(false)}
      />

      {/* HEADER */}
      <div className="flex justify-between items-center border-b-4 border-sky-500 pb-3 flex-wrap gap-3">
        <h1 className="font-black tracking-tighter uppercase text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
          ▶️ {t("mission_control.title")}
        </h1>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">

          {/* Pose Validation Toggle Button */}
          <button
            onClick={() => setPoseValidationEnabled(!poseValidationEnabled)}
            className={`flex items-center gap-2 px-4 rounded-xl font-black text-sm uppercase tracking-wider transition-all active:scale-95 ${
              poseValidationEnabled
                ? "bg-sky-500 hover:bg-sky-400 text-white"
                : "bg-gray-500 hover:bg-gray-400 text-white"
            }`}
            style={{ minHeight: 48 }}
            title={poseValidationEnabled ? "Pose validation ON - Click to disable" : "Pose validation OFF - Click to enable"}
          >
            {poseValidationEnabled ? <IconEyeOn size={20} /> : <IconEyeOff size={20} />}
            <span>{poseValidationEnabled ? "Pose OFF" : "Pose ON"}</span>
          </button>

          {/* Pose pill — only show when validation is enabled */}
          {!poseIsZero && poseValidationEnabled && (
            <div className={posePillClass}>
              <span className="text-sm font-bold text-sky-600 dark:text-sky-400">X:</span>
              <span className={`text-sm font-mono font-bold ${
                poseValidationEnabled && Math.abs(parseFloat(pose.x)) <= 1 && tagDetected
                  ? "text-green-600 dark:text-green-400"
                  : "text-gray-700 dark:text-gray-200"
              }`}>{pose.x} mm</span>

              <div className="w-px h-5 bg-slate-300 dark:bg-slate-600" />

              <span className="text-sm font-bold text-sky-600 dark:text-sky-400">Y:</span>
              <span className={`text-sm font-mono font-bold ${
                poseValidationEnabled && Math.abs(parseFloat(pose.y)) <= 1 && tagDetected
                  ? "text-green-600 dark:text-green-400"
                  : "text-gray-700 dark:text-gray-200"
              }`}>{pose.y} mm</span>

              <div className="w-px h-5 bg-slate-300 dark:bg-slate-600" />

              <span className="text-sm font-bold text-sky-600 dark:text-sky-400">θ:</span>
              <span className="text-sm font-mono font-bold text-purple-600 dark:text-purple-400">
                {pose.theta}°
              </span>

              {connected && poseValidationEnabled && (
                <>
                  <div className="w-px h-5 bg-slate-300 dark:bg-slate-600" />
                  <span className={`w-3 h-3 rounded-full ${
                    needsAlignment
                      ? "bg-amber-400 animate-pulse"
                      : robotAligned && tagDetected
                        ? "bg-green-500"
                        : "bg-gray-400"
                  }`} />
                  <span className={`text-sm font-bold ${
                    needsAlignment
                      ? "text-amber-600 dark:text-amber-400"
                      : robotAligned && tagDetected
                        ? "text-green-600 dark:text-green-400"
                        : "text-gray-500 dark:text-gray-400"
                  }`}>
                    {!tagDetected
                      ? t("mission_control.no_signal")
                      : !robotAligned
                        ? t("mission_control.center_tag")
                        : t("mission_control.ready")}
                  </span>
                </>
              )}
            </div>
          )}

          {/* Center Tag button — only show when pose validation is enabled */}
          {poseValidationEnabled && needsAlignment && (
            <button
              onClick={() => setShowAlignNote(true)}
              className="flex items-center gap-2 px-4 bg-amber-500 hover:bg-amber-400 text-white rounded-xl font-black text-sm uppercase tracking-wider transition-all active:scale-95"
              style={{ minHeight: 48 }}
            >
              🎯 {t("mission_control.center_tag_btn")}
            </button>
          )}

          <div className={`text-sm font-bold ${connected ? "text-green-600" : "text-red-600"}`}>
            {connected ? t("mission_control.status_online") : t("mission_control.status_offline")}
          </div>
        </div>
      </div>

      {/* LOAD MISSION */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl shadow-xl border-2 dark:border-slate-800 p-4 sm:p-6 md:p-8">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3 sm:gap-4">
          <div className="flex-1 min-w-0" ref={dropdownRef}>
            <label className="block text-xs font-black uppercase opacity-40 tracking-widest mb-2">
              {t("mission_control.mission_file")}
            </label>
            <div className="relative">
              <button
                onClick={() => connected && setDropdownOpen((o) => !o)}
                disabled={!connected}
                className="w-full px-4 bg-slate-100 dark:bg-slate-800 text-gray-900 dark:text-white rounded-xl font-bold text-base flex items-center justify-between border-2 border-slate-200 dark:border-slate-700 hover:border-sky-500 disabled:opacity-40 transition-all"
                style={{ minHeight: 56 }}
              >
                <span className="truncate">{selectedMission || t("mission_control.select_mission")}</span>
                <IconChevron />
              </button>
              {dropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 z-50 max-h-64 overflow-y-auto">
                  <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 py-3">
                    <span className="text-xs font-black uppercase opacity-40 tracking-widest">
                      {availableMissions.length} {t("mission_control.missions_count")}
                    </span>
                  </div>
                  {availableMissions.length === 0 ? (
                    <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400 text-base">
                      {t("mission_control.waiting_list")}
                    </div>
                  ) : (
                    availableMissions.map((mission, idx) => (
                      <button
                        key={idx}
                        onClick={() => { setSelectedMission(mission); setDropdownOpen(false); }}
                        className={`w-full px-4 text-left text-base hover:bg-sky-50 dark:hover:bg-sky-900/30 transition-colors font-medium flex items-center justify-between ${
                          selectedMission === mission
                            ? "bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400"
                            : "text-gray-900 dark:text-white"
                        }`}
                        style={{ minHeight: 52 }}
                      >
                        <span className="truncate">{mission}</span>
                        <div className="flex items-center gap-2 shrink-0 ml-2">
                          {data.mission_file === mission && (
                            <span className="text-xs bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 px-2 py-1 rounded-full font-bold">
                              {t("mission_control.loaded_badge")}
                            </span>
                          )}
                          {selectedMission === mission && <span className="text-sky-500 text-sm">✓</span>}
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Load / Start button — 56 px tall */}
          <button
            onClick={loadMission}
            disabled={!connected || loading || !selectedMission}
            className="flex items-center justify-center gap-3 px-6 bg-sky-600 hover:bg-sky-500 dark:bg-sky-700 dark:hover:bg-sky-600 disabled:opacity-30 text-white rounded-xl font-black uppercase text-base shadow-lg transition-all active:scale-95 shrink-0"
            style={{ minHeight: 56 }}
          >
            {loading
              ? <div className="animate-spin h-6 w-6 border-2 border-white border-t-transparent rounded-full" />
              : <IconPlay size={22} />}
            <span>{loading ? t("mission_control.starting") : t("mission_control.start_mission")}</span>
          </button>
        </div>
        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
          {availableMissions.length > 0
            ? `${availableMissions.length} ${t("mission_control.missions_from_robot")}`
            : t("mission_control.connect_to_see")}
        </p>
      </div>

      {/* TELEMETRY */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl shadow-xl border-2 dark:border-slate-800 p-4 sm:p-6 md:p-8">
        <div className="flex flex-row items-start justify-between gap-3 mb-4 flex-wrap">
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-black uppercase opacity-40 tracking-widest">{t("mission_control.loaded_mission")}</span>
            <span className="text-base sm:text-xl font-black text-sky-500 uppercase truncate">
              {data.mission_file || t("mission_control.none")}
            </span>
          </div>
          <div className="flex flex-col items-end shrink-0">
            <span className="text-xs font-black uppercase opacity-40 tracking-widest">{t("mission_control.state")}</span>
            <span className="px-4 py-1.5 bg-sky-500 text-white rounded-lg text-base font-black">{state}</span>
          </div>
        </div>

        {/* Current Tag → Target Tag Progress */}
        <div className="bg-gradient-to-r from-sky-50 to-blue-50 dark:from-sky-900/20 dark:to-blue-900/20 rounded-xl p-4 sm:p-5 border-2 border-sky-300 dark:border-sky-700 mb-4 sm:mb-5">
          <span className="text-xs font-black uppercase opacity-40 block mb-3 tracking-widest">📍 Tag Progress</span>
          <div className="flex items-center justify-between gap-4 sm:gap-6">
            {/* Current Tag */}
            <div className="flex flex-col items-center flex-1">
              <span className="text-xs font-bold uppercase opacity-50 mb-1">Current</span>
              <span className="text-3xl sm:text-4xl font-black text-sky-600 dark:text-sky-400 font-mono">{data.tag ?? "0"}</span>
            </div>
            {/* Arrow */}
            <div className="flex items-center justify-center shrink-0">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-sky-500 dark:text-sky-400">
                <polyline points="5 12 19 12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </div>
            {/* Target Tag */}
            <div className="flex flex-col items-center flex-1">
              <span className="text-xs font-bold uppercase opacity-50 mb-1">Target</span>
              <span className="text-3xl sm:text-4xl font-black text-blue-600 dark:text-blue-400 font-mono">{data.target_tag ?? "--"}</span>
            </div>
          </div>
          {/* Distance to Tag */}
          {data.dist_tag !== undefined && (
            <div className="mt-3 pt-3 border-t border-sky-200 dark:border-sky-700">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase opacity-50">Distance to Tag</span>
                <span className="text-lg font-black text-sky-600 dark:text-sky-400 font-mono">{(data.dist_tag || 0).toFixed(2)} m</span>
              </div>
            </div>
          )}
        </div>

        {/* 2×2 grid on 7-inch portrait; 4 cols on sm+ */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-5">
          {[
            { label: t("mission_control.speed_label"), val: `${(data.speed || 0).toFixed(2)}m/s`,           color: "text-emerald-500" },
            { label: t("mission_control.progress"),   val: `${data.step ?? 0} / ${data.total_steps ?? 0}`,  color: "text-amber-500"  },
            { label: t("mission_control.action"),     val: data.action || t("mission_control.idle_action"), color: "text-purple-500" },
            { label: directionLabel,                  val: data.direction || t("mission_control.idle_action"), color: "text-indigo-500" },
          ].map((item, idx) => (
            <div key={idx} className="bg-gray-50 dark:bg-slate-800/50 p-4 sm:p-5 rounded-xl border dark:border-slate-700">
              <span className="text-xs font-black uppercase opacity-40 block mb-1 leading-tight">{item.label}</span>
              <span className={`text-2xl sm:text-3xl font-black font-mono truncate block ${item.color}`}>{item.val}</span>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm font-black uppercase tracking-tighter">
            <span className="opacity-50">{t("mission_control.mission_progress")}</span>
            <span className="text-sky-500">{pct}%</span>
          </div>
          <div className="h-8 sm:h-10 bg-gray-200 dark:bg-slate-800 rounded-full p-1.5 border-2 dark:border-slate-700 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-sky-600 to-blue-400 rounded-full transition-all duration-700"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </div>

      {/* CONTROL BUTTONS — 2×2 on 7-inch portrait */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {/* START */}
        <button
          onClick={() => callSvc("/mission/start", "mission_control.mission_started")}
          disabled={!isStartEnabled}
          className="flex flex-col items-center justify-center bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white rounded-2xl sm:rounded-3xl shadow-xl disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
          style={{ minHeight: 120, padding: "20px 12px" }}
        >
          <IconPlay size={44} />
          <span className="text-base mt-3 font-black uppercase tracking-widest">{t("mission_control.start")}</span>
          {state === "WAIT_FOR_START" && connected && poseValidationEnabled && needsAlignment && (
            <span className="mt-1.5 text-xs font-semibold opacity-80 normal-case tracking-normal px-2 text-center leading-tight">
              {t("mission_control.center_tag_hint")}
            </span>
          )}
        </button>

        {/* PAUSE / RESUME */}
        <button
          onClick={handlePauseResume}
          disabled={!["DRIVE_TO_TAG", "PAUSED"].includes(state)}
          className="flex flex-col items-center justify-center bg-amber-500 hover:bg-amber-400 dark:bg-amber-600 dark:hover:bg-amber-500 text-white rounded-2xl sm:rounded-3xl shadow-xl disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
          style={{ minHeight: 120, padding: "20px 12px" }}
        >
          {state === "PAUSED" ? <IconResume size={44} /> : <IconPause size={44} />}
          <span className="text-base mt-3 font-black uppercase tracking-widest">
            {state === "PAUSED" ? t("mission_control.resume") : t("mission_control.pause")}
          </span>
        </button>

        {/* TRIGGER */}
        <button
          onClick={triggerMission}
          disabled={!isTriggerEnabled}
          className="flex flex-col items-center justify-center bg-indigo-600 hover:bg-indigo-500 dark:bg-indigo-700 dark:hover:bg-indigo-600 text-white rounded-2xl sm:rounded-3xl shadow-xl disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
          style={{ minHeight: 120, padding: "20px 12px" }}
        >
          {triggerLoading
            ? <div className="animate-spin h-10 w-10 border-2 border-white border-t-transparent rounded-full" />
            : <IconTrigger size={44} />}
          <span className="text-base mt-3 font-black uppercase tracking-widest">
            {triggerLoading ? t("mission_control.triggering") : t("mission_control.mission_trigger")}
          </span>
        </button>

        {/* ABORT */}
        <button
          onClick={() => callSvc("/mission/abort", "mission_control.mission_aborted")}
          disabled={state === "IDLE" || !connected}
          className="flex flex-col items-center justify-center bg-red-600 hover:bg-red-500 dark:bg-red-700 dark:hover:bg-red-600 text-white rounded-2xl sm:rounded-3xl shadow-xl disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
          style={{ minHeight: 120, padding: "20px 12px" }}
        >
          <IconAbort size={44} />
          <span className="text-base mt-3 font-black uppercase tracking-widest">{t("mission_control.abort")}</span>
        </button>
      </div>

      {/* LOOP CONTROL */}
      <button
        onClick={toggleLoop}
        disabled={!connected || loopLoading}
        className={`w-full rounded-2xl text-base font-black uppercase flex items-center justify-center gap-4 shadow-xl disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-[0.98] ${
          isLoopOn
            ? "bg-green-600 hover:bg-green-500 dark:bg-green-700 dark:hover:bg-green-600"
            : "bg-gray-600 hover:bg-gray-500 dark:bg-gray-700 dark:hover:bg-gray-600"
        }`}
        style={{ minHeight: 64 }}
      >
        {loopLoading
          ? <div className="animate-spin h-7 w-7 border-2 border-white border-t-transparent rounded-full" />
          : <IconLoop size={28} />}
        <span className="text-white">{isLoopOn ? "Loop ON ✓" : "Loop OFF"}</span>
      </button>

      {/* SAFETY BYPASS CONTROL
      <button
        onClick={() => {
          if (!connected) { showToast(t("mission_control.system_offline"), "error"); return; }
          const bypassValue = data.safety_active; // true to disable, false to enable
          rosCallService("/set_safety_bypass", "std_srvs/SetBool", { data: bypassValue }, (res) => {
            res.success
              ? showToast(bypassValue ? t("mission_control.safety_disabled") : t("mission_control.safety_enabled"), "success")
              : showToast(res.message || t("mission_control.command_failed"), "error");
          });
        }}
        disabled={!connected}
        className={`w-full rounded-2xl text-base font-black uppercase flex items-center justify-center gap-4 shadow-xl disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-[0.98] ${
          data.safety_active
            ? "bg-red-600 hover:bg-red-500 dark:bg-red-700 dark:hover:bg-red-600"
            : "bg-orange-600 hover:bg-orange-500 dark:bg-orange-700 dark:hover:bg-orange-600"
        }`}
        style={{ minHeight: 64 }}
        title={data.safety_active ? "Safety is ON - Click to disable" : "Safety is OFF - Click to enable"}
      >
        <IconWarning size={28} />
        <span className="text-white">{data.safety_active ? "🔴 Safety IS ON" : "⚠️ Safety IS OFF"}</span>
      </button> */}

      {/* RESET + UNLOAD */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <button
          onClick={() => callSvc("/mission/reset", "mission_control.mission_reset")}
          disabled={state === "IDLE" || state === "DRIVE_TO_TAG"}
          className="bg-slate-700 hover:bg-slate-600 dark:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-2xl text-base font-black uppercase flex items-center justify-center gap-4 shadow-xl disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
          style={{ minHeight: 64 }}
        >
          <IconReset size={26} /> {t("mission_control.reset_mission")}
        </button>
        <button
          onClick={() => callSvc("/mission/unload", "mission_control.mission_unloaded")}
          disabled={state === "DRIVE_TO_TAG" || !connected}
          className="bg-purple-700 hover:bg-purple-600 dark:bg-purple-800 dark:hover:bg-purple-700 text-white rounded-2xl text-base font-black uppercase flex items-center justify-center gap-4 shadow-xl disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
          style={{ minHeight: 64 }}
        >
          <IconReset size={26} /> {t("mission_control.unload_mission")}
        </button>
      </div>

      {/* TOAST */}
      {toast.show && (
        <div className={`fixed bottom-5 left-1/2 -translate-x-1/2 px-5 py-4 rounded-xl text-base font-bold shadow-2xl border-2 z-50 whitespace-nowrap ${toastColors[toast.type] || toastColors.info}`}>
          <div className="flex items-center gap-3 text-white">
            {toast.type === "success" && <span>✓</span>}
            {toast.type === "error"   && <span>✗</span>}
            {toast.type === "info"    && <span>ℹ</span>}
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}
