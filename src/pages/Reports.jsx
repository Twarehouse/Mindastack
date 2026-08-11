

// import React, { useState, useEffect, useCallback, useRef } from "react";
// import { useLanguage } from "../context/LanguageContext";
// import { useROS } from "../context/RosContext";
// import ExcelJS from "exceljs";
// import { saveAs } from "file-saver";

// // ═════════════════════════════════════════════════════════════════════════════
// // EVENT EMITTER FOR REAL-TIME UPDATES
// // ═════════════════════════════════════════════════════════════════════════════

// class ReportEventEmitter {
//   constructor() {
//     this.listeners = {
//       safetyReportAdded: [],
//       missionReportAdded: [],
//       completedMissionAdded: [],
//     };
//   }

//   on(event, callback) {
//     if (this.listeners[event]) {
//       this.listeners[event].push(callback);
//       return () => {
//         this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
//       };
//     }
//   }

//   emit(event, data) {
//     if (this.listeners[event]) {
//       this.listeners[event].forEach(callback => {
//         try {
//           callback(data);
//         } catch (e) {
//           console.error(`Error in ${event} listener:`, e);
//         }
//       });
//     }
//   }
// }

// const reportEmitter = new ReportEventEmitter();

// // ═════════════════════════════════════════════════════════════════════════════
// // CONSTANTS
// // ═════════════════════════════════════════════════════════════════════════════

// const STORAGE_KEY = "reportStoreV3";
// const WEEKLY_KEY = "weeklyReportStoreV2";
// const MONTHLY_KEY = "monthlyReportStore";
// const ARCHIVE_KEY = "archivedWeeklyReports";
// const MAX_DISPLAY = 4;
// const IMU_TIMEOUT_MS = 1500;
// const MAX_STORAGE_DAYS = 30;

// // ═════════════════════════════════════════════════════════════════════════════
// // STATUS SANITIZER
// // ═════════════════════════════════════════════════════════════════════════════

// function sanitizeStatus(statusText) {
//   if (!statusText) return statusText;
//   const s = statusText.toString();
//   const isFault =
//     s.includes("Fault") ||
//     s.includes("fault") ||
//     s.includes("दोष") ||
//     s.includes("異常") ||
//     s.includes("Active/Triggered") ||
//     s.includes("active_trig");
//   if (isFault) return "Fault Triggered";
//   return statusText;
// }

// function sanitizeSafetyArray(arr) {
//   if (!Array.isArray(arr)) return [];
//   return arr.map(r => ({ ...r, status: sanitizeStatus(r.status) }));
// }

// // ═════════════════════════════════════════════════════════════════════════════
// // STORAGE HELPERS
// // ═════════════════════════════════════════════════════════════════════════════

// function getDateKey(date = new Date()) {
//   return date.toISOString().slice(0, 10);
// }

// function getWeekBounds() {
//   const now = new Date();
//   const dow = now.getDay();
//   const sow = new Date(now);
//   sow.setDate(now.getDate() - dow);
//   sow.setHours(0, 0, 0, 0);
//   const eow = new Date(sow);
//   eow.setDate(sow.getDate() + 6);
//   eow.setHours(23, 59, 59, 999);
//   return { sow, eow };
// }

// function loadStore(key) {
//   try {
//     const raw = localStorage.getItem(key);
//     if (raw) return JSON.parse(raw);
//   } catch (_) {}
//   return null;
// }

// function saveStore(key, data) {
//   try {
//     localStorage.setItem(key, JSON.stringify(data));
//   } catch (e) {
//     console.error(`Failed to persist ${key}:`, e);
//   }
// }

// function loadAllStores() {
//   const weekly = loadStore(WEEKLY_KEY) || { safety: [], mission: [], completed: [] };
//   const monthly = loadStore(MONTHLY_KEY) || { safety: [], mission: [], completed: [] };

//   const sanitize = (store) => ({
//     ...store,
//     safety: sanitizeSafetyArray(store.safety),
//   });

//   return { weekly: sanitize(weekly), monthly: sanitize(monthly) };
// }

// function saveAndTrimStores(weekly, monthly) {
//   const cutoff = new Date();
//   cutoff.setDate(cutoff.getDate() - MAX_STORAGE_DAYS);
//   const cutoffKey = getDateKey(cutoff);

//   const trimData = (data) => ({
//     safety: data.safety.filter(r => (r.dateKey || "") >= cutoffKey),
//     mission: data.mission.filter(r => (r.dateKey || "") >= cutoffKey),
//     completed: data.completed.filter(r => (r.dateKey || "") >= cutoffKey),
//   });

//   const trimmedWeekly = trimData(weekly);
//   const trimmedMonthly = trimData(monthly);
//   saveStore(WEEKLY_KEY, trimmedWeekly);
//   saveStore(MONTHLY_KEY, trimmedMonthly);
//   return { weekly: trimmedWeekly, monthly: trimmedMonthly };
// }

// function getThisWeeksData(weeklyStore) {
//   const { sow, eow } = getWeekBounds();
//   const inRange = (r) => {
//     if (!r.timestampISO) return false;
//     const d = new Date(r.timestampISO);
//     return d >= sow && d <= eow;
//   };
//   return {
//     safety: weeklyStore.safety.filter(inRange),
//     mission: weeklyStore.mission.filter(inRange),
//     completed: weeklyStore.completed.filter(inRange),
//   };
// }

// // ═════════════════════════════════════════════════════════════════════════════
// // ARCHIVE HELPERS
// // ═════════════════════════════════════════════════════════════════════════════

// function loadArchive() {
//   try {
//     const raw = localStorage.getItem(ARCHIVE_KEY);
//     if (raw) return JSON.parse(raw);
//   } catch (_) {}
//   return [];
// }

// function saveArchive(archiveArray) {
//   try {
//     localStorage.setItem(ARCHIVE_KEY, JSON.stringify(archiveArray));
//   } catch (e) {
//     console.error("Failed to persist archive:", e);
//   }
// }

// function addToArchive(weeklyData, weekNumber, year, startDate, endDate) {
//   const archive = loadArchive();
//   const entry = {
//     id: `${year}-week${weekNumber}-${Date.now()}`,
//     weekNumber,
//     year,
//     startDate,
//     endDate,
//     createdAt: new Date().toISOString(),
//     data: {
//       safety: weeklyData.safety,
//       mission: weeklyData.mission,
//       completed: weeklyData.completed,
//     },
//     counts: {
//       safety: weeklyData.safety.length,
//       mission: weeklyData.mission.length,
//       completed: weeklyData.completed.length,
//     },
//   };
//   archive.push(entry);
//   saveArchive(archive);
//   return entry;
// }

// // ═════════════════════════════════════════════════════════════════════════════
// // SESSION STORE
// // ═════════════════════════════════════════════════════════════════════════════

// const defaultStore = {
//   safetyReports: [],
//   missionReports: [],
//   completedMissions: [],
//   allSafety: [],
//   allMission: [],
//   allCompleted: [],
//   tagMissCount: 0,
//   currentMission: null,
//   plcSignals: {
//     work_over: false,
//     front_estop: false,
//     back_estop: false,
//     reset: false,
//     front_lidar: false,
//     back_lidar: false,
//     front_bumper: false,
//     rear_bumper: false,
//     imu: false,
//   },
//   lastState: null,
//   missionAccum: {},
//   recordedStates: new Set(),
//   recordedFaults: new Set(),
//   activeMissions: {},
//   subscribed: false,
//   lastDataUpdate: null,
//   isDataStale: false,
//   isMissionActive: false,
// };

// const createReportStore = () => {
//   try {
//     const stored = localStorage.getItem(STORAGE_KEY);
//     if (stored) {
//       const parsed = JSON.parse(stored);
//       const recordedStates = parsed.recordedStates ? new Set(parsed.recordedStates) : new Set();
//       const recordedFaults = parsed.recordedFaults ? new Set(parsed.recordedFaults) : new Set();
//       const activeMissions = parsed.activeMissions ? { ...parsed.activeMissions } : {};

//       if (parsed.safetyReports) parsed.safetyReports = sanitizeSafetyArray(parsed.safetyReports);
//       if (parsed.allSafety) parsed.allSafety = sanitizeSafetyArray(parsed.allSafety);

//       return { ...defaultStore, ...parsed, recordedStates, recordedFaults, activeMissions };
//     }
//   } catch (e) {
//     console.error("Failed to load from localStorage:", e);
//   }
//   return {
//     ...defaultStore,
//     recordedStates: new Set(),
//     recordedFaults: new Set(),
//     activeMissions: {},
//   };
// };

// const persistSessionStore = (store) => {
//   try {
//     const toSave = {
//       ...store,
//       recordedStates: Array.from(store.recordedStates),
//       recordedFaults: Array.from(store.recordedFaults),
//       activeMissions: store.activeMissions,
//     };
//     localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
//   } catch (e) {
//     console.error("Failed to persist session store:", e);
//   }
// };

// let storeData = loadAllStores();
// let weeklyStore = storeData.weekly;
// let monthlyStore = storeData.monthly;
// let reportStore = createReportStore();

// const cappedAppend = (arr, item, max) => {
//   const n = [...arr, item];
//   return n.length > max ? n.slice(n.length - max) : n;
// };

// function pushToPersistentStores(bucket, event) {
//   const enriched = {
//     ...event,
//     dateKey: getDateKey(event.timestamp || new Date()),
//     storedAt: new Date().toISOString(),
//   };
//   weeklyStore[bucket] = [...weeklyStore[bucket], enriched];
//   monthlyStore[bucket] = [...monthlyStore[bucket], enriched];
//   const result = saveAndTrimStores(weeklyStore, monthlyStore);
//   weeklyStore = result.weekly;
//   monthlyStore = result.monthly;
// }

// // ═════════════════════════════════════════════════════════════════════════════
// // ICONS
// // ═════════════════════════════════════════════════════════════════════════════

// const IconTrash = ({ size = 20 }) => (
//   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
//     <polyline points="3 6 5 6 21 6" />
//     <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
//     <path d="M10 11v6M14 11v6M9 6V4h6v2" />
//   </svg>
// );
// const IconShield = ({ size = 20 }) => (
//   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//     <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
//   </svg>
// );
// const IconMission = ({ size = 20 }) => (
//   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//     <circle cx="12" cy="12" r="3" />
//     <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
//     <path d="M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12" />
//   </svg>
// );
// const IconCheckCircle = ({ size = 20 }) => (
//   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//     <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
//     <polyline points="22 4 12 14.01 9 11.01" />
//   </svg>
// );
// const IconRefresh = ({ size = 20 }) => (
//   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//     <path d="M23 4v6h-6" />
//     <path d="M1 20v-6h6" />
//     <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
//   </svg>
// );
// const IconArchive = ({ size = 20 }) => (
//   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//     <path d="M21 15V4a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v15m20-10H3m2-5h14v2H5z" />
//   </svg>
// );
// const IconX = ({ size = 24 }) => (
//   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
//     <line x1="18" y1="6" x2="6" y2="18" />
//     <line x1="6" y1="6" x2="18" y2="18" />
//   </svg>
// );

// // ═════════════════════════════════════════════════════════════════════════════
// // STATE COLORS
// // ═════════════════════════════════════════════════════════════════════════════

// const STATE_COLORS = {
//   IDLE: { bg: "bg-slate-100 dark:bg-slate-800", text: "text-slate-600 dark:text-slate-300", dot: "bg-slate-400" },
//   WAIT_FOR_START: { bg: "bg-amber-50 dark:bg-amber-950/30", text: "text-amber-700 dark:text-amber-400", dot: "bg-amber-400" },
//   DRIVE_TO_TAG: { bg: "bg-sky-50 dark:bg-sky-950/30", text: "text-sky-700 dark:text-sky-400", dot: "bg-sky-500" },
//   PAUSED: { bg: "bg-orange-50 dark:bg-orange-950/30", text: "text-orange-700 dark:text-orange-400", dot: "bg-orange-400" },
//   COMPLETE: { bg: "bg-green-50 dark:bg-green-950/30", text: "text-green-700 dark:text-green-400", dot: "bg-green-500" },
//   WATCHDOG_FAULT: { bg: "bg-red-50 dark:bg-red-950/30", text: "text-red-700 dark:text-red-400", dot: "bg-red-500" },
//   ABORTED: { bg: "bg-red-50 dark:bg-red-950/30", text: "text-red-700 dark:text-red-400", dot: "bg-red-400" },
//   TAG_MISS: { bg: "bg-fuchsia-50 dark:bg-fuchsia-950/30", text: "text-fuchsia-700 dark:text-fuchsia-400", dot: "bg-fuchsia-500" },
//   UNKNOWN: { bg: "bg-slate-100 dark:bg-slate-800", text: "text-slate-500 dark:text-slate-400", dot: "bg-slate-400" },
// };

// function getStateStyle(state) {
//   return STATE_COLORS[state] ?? STATE_COLORS.UNKNOWN;
// }

// // ═════════════════════════════════════════════════════════════════════════════
// // SUB-COMPONENTS
// // ═════════════════════════════════════════════════════════════════════════════

// function EmptyState({ label, sub }) {
//   return (
//     <div className="text-center py-16 px-4">
//       <div className="text-6xl mb-5">📭</div>
//       <p className="text-slate-500 dark:text-slate-400 font-bold text-base">{label}</p>
//       <p className="text-sm text-slate-400 mt-2">{sub}</p>
//     </div>
//   );
// }

// function StatChip({ label, val, color }) {
//   return (
//     <div className="text-center bg-white dark:bg-slate-900 rounded-xl border dark:border-slate-700 shadow-sm" style={{ padding: "12px 8px" }}>
//       <div className={`text-2xl font-black ${color}`}>{val}</div>
//       <div className="text-xs font-black uppercase tracking-wider text-slate-500 mt-1 leading-tight">{label}</div>
//     </div>
//   );
// }

// function ConfirmationModal({ isOpen, onClose, onConfirm, title, message, confirmText = "Yes, Clear All", cancelText = "Cancel" }) {
//   if (!isOpen) return null;
//   return (
//     <div
//       className="fixed inset-0 flex items-center justify-center z-[1000]"
//       style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
//       onClick={onClose}
//     >
//       <div
//         className="relative w-full max-w-md mx-4 rounded-2xl overflow-hidden"
//         style={{
//           background: "linear-gradient(160deg, #1e293b 0%, #0f172a 100%)",
//           border: "1px solid rgba(239,68,68,0.3)",
//           boxShadow: "0 25px 60px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.05)",
//         }}
//         onClick={(e) => e.stopPropagation()}
//       >
//         <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: "linear-gradient(90deg, transparent, #ef4444, transparent)" }} />
//         <div className="flex items-center justify-between px-6 pt-5 pb-3">
//           <div className="flex items-center gap-3">
//             <div className="p-2.5 rounded-xl" style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.25)" }}>
//               <IconTrash size={22} style={{ color: "#ef4444" }} />
//             </div>
//             <div className="text-white font-black text-lg tracking-wide">{title || "Clear Dashboard View"}</div>
//           </div>
//           <button onClick={onClose} className="p-1.5 rounded-lg transition hover:bg-white/10" aria-label="Close">
//             <IconX size={20} className="text-white/60" />
//           </button>
//         </div>
//         <div className="px-6 py-4">
//           <p className="text-slate-300 text-base leading-relaxed">{message}</p>
//           <div className="mt-4 p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.05)" }}>
//             <div className="grid grid-cols-3 gap-2 text-center">
//               <div>
//                 <div className="text-amber-400 font-black text-lg">{reportStore.allSafety.length}</div>
//                 <div className="text-slate-400 text-[10px] font-black uppercase tracking-wider">Safety</div>
//               </div>
//               <div>
//                 <div className="text-sky-400 font-black text-lg">{reportStore.allMission.length}</div>
//                 <div className="text-slate-400 text-[10px] font-black uppercase tracking-wider">Mission</div>
//               </div>
//               <div>
//                 <div className="text-emerald-400 font-black text-lg">{reportStore.allCompleted.length}</div>
//                 <div className="text-slate-400 text-[10px] font-black uppercase tracking-wider">Completed</div>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="px-6 pb-5 flex gap-3">
//           <button
//             onClick={onClose}
//             className="flex-1 py-2.5 rounded-xl font-black text-sm uppercase tracking-wider text-white/80 transition-all hover:bg-white/10 active:scale-95"
//             style={{ background: "rgba(255,255,255,0.08)" }}
//           >
//             {cancelText}
//           </button>
//           <button
//             onClick={onConfirm}
//             className="flex-1 py-2.5 rounded-xl font-black text-sm uppercase tracking-wider text-white transition-all active:scale-95"
//             style={{ background: "linear-gradient(135deg, #dc2626 0%, #ef4444 100%)" }}
//           >
//             {confirmText}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ═════════════════════════════════════════════════════════════════════════════
// // EXCEL STYLING
// // ═════════════════════════════════════════════════════════════════════════════

// const DARK_BLUE = "1F4E78";
// const LIGHT_BLUE = "D9E1F2";
// const WHITE = "FFFFFF";
// const GRAY_EVEN = "F2F2F2";
// const GREEN_FILL = "C6EFCE";
// const GREEN_FONT = "006100";
// const RED_FILL = "FFC7CE";
// const RED_FONT = "9C0006";

// const THIN_BORDER = {
//   top: { style: "thin", color: { argb: "FF000000" } },
//   left: { style: "thin", color: { argb: "FF000000" } },
//   bottom: { style: "thin", color: { argb: "FF000000" } },
//   right: { style: "thin", color: { argb: "FF000000" } },
// };

// function applyTitleStyle(cell) {
//   cell.font = { bold: true, size: 14, color: { argb: `FF${WHITE}` }, name: "Arial" };
//   cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: `FF${DARK_BLUE}` } };
//   cell.alignment = { horizontal: "center", vertical: "middle" };
//   cell.border = THIN_BORDER;
// }

// function applySubtitleStyle(cell) {
//   cell.font = { italic: true, size: 10, color: { argb: `FF${DARK_BLUE}` }, name: "Arial" };
//   cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: `FF${LIGHT_BLUE}` } };
//   cell.alignment = { horizontal: "center", vertical: "middle" };
//   cell.border = THIN_BORDER;
// }

// function applyHeaderStyle(cell) {
//   cell.font = { bold: true, size: 11, color: { argb: `FF${WHITE}` }, name: "Arial" };
//   cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: `FF${DARK_BLUE}` } };
//   cell.alignment = { horizontal: "center", vertical: "middle" };
//   cell.border = THIN_BORDER;
// }

// function applyDataStyle(cell, rowIdx, align = "left") {
//   const isEven = rowIdx % 2 === 0;
//   cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: isEven ? `FF${GRAY_EVEN}` : `FF${WHITE}` } };
//   cell.alignment = { horizontal: align, vertical: "middle" };
//   cell.border = THIN_BORDER;
//   cell.font = { name: "Arial", size: 10 };
// }

// function applyStatusStyle(cell, color) {
//   if (color === "GREEN") {
//     cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: `FF${GREEN_FILL}` } };
//     cell.font = { bold: true, size: 10, color: { argb: `FF${GREEN_FONT}` }, name: "Arial" };
//   } else {
//     cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: `FF${RED_FILL}` } };
//     cell.font = { bold: true, size: 10, color: { argb: `FF${RED_FONT}` }, name: "Arial" };
//   }
//   cell.alignment = { horizontal: "center", vertical: "middle" };
//   cell.border = THIN_BORDER;
// }

// async function downloadBuffer(wb, filename) {
//   const buffer = await wb.xlsx.writeBuffer();
//   const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
//   saveAs(blob, filename);
// }

// // ═════════════════════════════════════════════════════════════════════════════
// // WEEKLY REPORT GENERATOR
// // ═════════════════════════════════════════════════════════════════════════════


// const generateWeeklyReport = (safetyRows, missionRows, completedRows, startDate, endDate) => {
//   const wb = new ExcelJS.Workbook();
//   wb.creator = "Safety Dashboard";
//   wb.created = new Date();

//   // ── Cover sheet ──
//   const cover = wb.addWorksheet("Weekly Report Cover");
//   cover.columns = [{ width: 45 }, { width: 15 }, { width: 16 }, { width: 20 }, { width: 20 }, { width: 16 }, { width: 12 }];
//   let r = 1;

//   cover.mergeCells(`A${r}:G${r}`);
//   cover.getRow(r).height = 30;
//   const titleCell = cover.getCell(`A${r}`);
//   titleCell.value = "WEEKLY SAFETY & MISSION REPORT";
//   titleCell.font = { bold: true, size: 18, name: "Arial", color: { argb: `FF${WHITE}` } };
//   titleCell.alignment = { horizontal: "center", vertical: "middle" };
//   titleCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: `FF${DARK_BLUE}` } };
//   titleCell.border = THIN_BORDER;
//   r += 2;

//   [
//     [`Report Period: ${startDate} to ${endDate}`, 12, true],
//     [`Generated: ${new Date().toLocaleString()}`, 10, false],
//     [`Data source: Persistent across disconnects (30-day storage)`, 10, false],
//   ].forEach(([val, size, bold]) => {
//     cover.mergeCells(`A${r}:G${r}`);
//     cover.getRow(r).height = 20;
//     const c = cover.getCell(`A${r}`);
//     c.value = val;
//     c.font = { size, name: "Arial", bold, italic: !bold };
//     c.alignment = { horizontal: "center" };
//     r++;
//   });
//   r++;

//   cover.mergeCells(`A${r}:G${r}`);
//   cover.getRow(r).height = 25;
//   const es = cover.getCell(`A${r}`);
//   es.value = "EXECUTIVE SUMMARY";
//   es.font = { bold: true, size: 13, name: "Arial", color: { argb: `FF${WHITE}` } };
//   es.alignment = { horizontal: "center", vertical: "middle" };
//   es.fill = { type: "pattern", pattern: "solid", fgColor: { argb: `FF${DARK_BLUE}` } };
//   es.border = THIN_BORDER;
//   r++;

//   const watchdogCount = missionRows.filter((x) => x.state === "WATCHDOG_FAULT").length;
//   const imuFaultCount = safetyRows.filter((x) => x.signal === "imu" && x.statusColor === "red").length;
//   const bumperFaultCount = safetyRows.filter(
//     (x) => (x.signal === "front_bumper" || x.signal === "rear_bumper") && x.statusColor === "red"
//   ).length;

//   const safetyByDate = {};
//   safetyRows.forEach((r2) => {
//     const dk = r2.dateKey || getDateKey();
//     safetyByDate[dk] = (safetyByDate[dk] || 0) + 1;
//   });
//   const missionByDate = {};
//   missionRows.forEach((r2) => {
//     const dk = r2.dateKey || getDateKey();
//     missionByDate[dk] = (missionByDate[dk] || 0) + 1;
//   });

//   [
//     ["Metric", "Value"],
//     ["Total Safety Events (this week)", safetyRows.length],
//     ["Total Mission Events (this week)", missionRows.length],
//     ["Total Completed Missions (this week)", completedRows.length],
//     ["Watchdog Faults", watchdogCount],
//     ["IMU Faults", imuFaultCount],
//     ["Bumper Faults", bumperFaultCount],
//     ["Days with Safety Activity", Object.keys(safetyByDate).length],
//     ["Days with Mission Activity", Object.keys(missionByDate).length],
//   ].forEach((row, idx) => {
//     cover.getRow(r).height = 20;
//     row.forEach((val, ci) => {
//       const c = cover.getCell(r, ci + 1);
//       c.value = val;
//       c.border = THIN_BORDER;
//       if (idx === 0) {
//         c.font = { bold: true, size: 11, name: "Arial" };
//         c.fill = { type: "pattern", pattern: "solid", fgColor: { argb: `FF${LIGHT_BLUE}` } };
//         c.alignment = { horizontal: ci === 0 ? "left" : "center", vertical: "middle" };
//       } else {
//         c.font = { name: "Arial", size: 10 };
//         c.alignment = { horizontal: ci === 0 ? "left" : "center", vertical: "middle" };
//       }
//     });
//     r++;
//   });

//   // ── Safety Events sheet ──
//   const ilSheet = wb.addWorksheet("Safety Events");
//   ilSheet.columns = [{ width: 5 }, { width: 12 }, { width: 22 }, { width: 20 }, { width: 12 }, { width: 25 }];
//   ilSheet.mergeCells("A1:F1");
//   ilSheet.getRow(1).height = 28;
//   const ilT = ilSheet.getCell("A1");
//   ilT.value = "SAFETY EVENTS — WEEKLY REPORT";
//   applyTitleStyle(ilT);
//   ilSheet.mergeCells("A2:F2");
//   ilSheet.getRow(2).height = 18;
//   const ilS = ilSheet.getCell("A2");
//   ilS.value = `Period: ${startDate} to ${endDate} | Generated: ${new Date().toLocaleString()}`;
//   applySubtitleStyle(ilS);
//   ilSheet.getRow(4).height = 22;
//   ["No.", "Date", "Timestamp", "Device", "Status", "Health"].forEach((h, i) => {
//     const c = ilSheet.getCell(4, i + 1);
//     c.value = h;
//     applyHeaderStyle(c);
//   });
//   safetyRows.forEach((row2, idx) => {
//     const rn = 5 + idx;
//     ilSheet.getRow(rn).height = 20;
//     [[idx + 1, "center"], [row2.dateKey || "—", "center"], [row2.timestampFormatted || "—", "left"], [row2.signalLabel || "—", "left"]].forEach(
//       ([v, a], ci) => {
//         const c = ilSheet.getCell(rn, ci + 1);
//         c.value = v;
//         applyDataStyle(c, idx, a);
//       }
//     );
//     const st = ilSheet.getCell(rn, 5);
//     st.value = row2.statusColor?.toUpperCase() || "—";
//     applyStatusStyle(st, st.value);
//     const hl = ilSheet.getCell(rn, 6);
//     hl.value = sanitizeStatus(row2.status) || "—";
//     applyDataStyle(hl, idx, "left");
//   });

//   // ── Mission Events sheet ──
//   const msSheet = wb.addWorksheet("Mission Events");
//   msSheet.columns = [
//     { width: 5 },
//     { width: 12 },
//     { width: 22 },
//     { width: 15 },
//     { width: 8 },
//     { width: 10 },
//     { width: 10 },
//     { width: 12 },
//     { width: 15 },
//     { width: 22 },
//   ];
//   msSheet.mergeCells("A1:J1");
//   msSheet.getRow(1).height = 28;
//   const msT = msSheet.getCell("A1");
//   msT.value = "MISSION EVENTS (STEP-BY-STEP) — WEEKLY REPORT";
//   applyTitleStyle(msT);
//   msSheet.mergeCells("A2:J2");
//   msSheet.getRow(2).height = 18;
//   const msS = msSheet.getCell("A2");
//   msS.value = `Period: ${startDate} to ${endDate} | Generated: ${new Date().toLocaleString()}`;
//   applySubtitleStyle(msS);
//   msSheet.getRow(4).height = 22;
//   ["No.", "Date", "Timestamp", "State", "Step", "Tag", "Target", "Speed (m/s)", "Missed Tag", "Mission File"].forEach((h, i) => {
//     const c = msSheet.getCell(4, i + 1);
//     c.value = h;
//     applyHeaderStyle(c);
//   });
//   missionRows.forEach((row2, idx) => {
//     const rn = 5 + idx;
//     msSheet.getRow(rn).height = 20;
//     [
//       [idx + 1, "center"],
//       [row2.dateKey || "—", "center"],
//       [row2.timestampFormatted || "—", "left"],
//       [row2.state || "—", "left"],
//       [row2.step || "—", "center"],
//       [row2.currentTag || "—", "center"],
//       [row2.targetTag || "—", "center"],
//       [row2.speed ?? "—", "center"],
//       [row2.missedTag != null ? `#${row2.missedTag}` : "—", "center"],
//       [row2.missionFile || "—", "left"],
//     ].forEach(([v, a], ci) => {
//       const c = msSheet.getCell(rn, ci + 1);
//       c.value = v;
//       applyDataStyle(c, idx, a);
//     });
//   });

//   // ── Completed Missions sheet ──
//   const cmSheet = wb.addWorksheet("Completed Missions");
//   cmSheet.columns = [{ width: 5 }, { width: 12 }, { width: 22 }, { width: 22 }, { width: 10 }, { width: 14 }, { width: 10 }];
//   cmSheet.mergeCells("A1:G1");
//   cmSheet.getRow(1).height = 28;
//   const cmT = cmSheet.getCell("A1");
//   cmT.value = "COMPLETED MISSIONS — WEEKLY REPORT";
//   applyTitleStyle(cmT);
//   cmSheet.mergeCells("A2:G2");
//   cmSheet.getRow(2).height = 18;
//   const cmS = cmSheet.getCell("A2");
//   cmS.value = `Period: ${startDate} to ${endDate} | Generated: ${new Date().toLocaleString()}`;
//   applySubtitleStyle(cmS);
//   cmSheet.getRow(4).height = 22;
//   ["No.", "Date", "Completed At", "Mission File", "Steps", "Duration", "Loop"].forEach((h, i) => {
//     const c = cmSheet.getCell(4, i + 1);
//     c.value = h;
//     applyHeaderStyle(c);
//   });
//   completedRows.forEach((row2, idx) => {
//     const rn = 5 + idx;
//     cmSheet.getRow(rn).height = 20;
//     [
//       [idx + 1, "center"],
//       [row2.dateKey || "—", "center"],
//       [row2.timestampFormatted || "—", "left"],
//       [row2.missionFile || "—", "left"],
//       [row2.totalSteps || 0, "center"],
//       [row2.durationFormatted || "—", "left"],
//       [row2.loop ? "ON" : "OFF", "center"],
//     ].forEach(([v, a], ci) => {
//       const c = cmSheet.getCell(rn, ci + 1);
//       c.value = v;
//       applyDataStyle(c, idx, a);
//     });
//   });

//   return wb;
// };

// // ═════════════════════════════════════════════════════════════════════════════
// // TABLE STYLES
// // ═════════════════════════════════════════════════════════════════════════════

// const tableContainerStyle = {
//   maxHeight: "500px",
//   overflowY: "auto",
//   overflowX: "auto",
//   border: "1px solid #e2e8f0",
//   borderRadius: "0.5rem",
//   backgroundColor: "transparent",
// };
// const darkTableContainerStyle = { ...tableContainerStyle, border: "1px solid #1e293b" };
// const tableHeaderStickyStyle = { position: "sticky", top: 0, zIndex: 10 };

// // ═════════════════════════════════════════════════════════════════════════════
// // MAIN COMPONENT
// // ═════════════════════════════════════════════════════════════════════════════

// export default function Reports() {
//   const { t } = useLanguage();
//   const { connected, subscribe } = useROS();

//   const tRef = useRef(t);
//   useEffect(() => {
//     tRef.current = t;
//   });

//   const imuTimeoutRef = useRef(null);
//   const staleCheckRef = useRef(null);

//   const [activeTab, setActiveTab] = useState("interlock");
//   const [safetyReports, setSafetyReports] = useState(reportStore.safetyReports);
//   const [missionReports, setMissionReports] = useState(reportStore.missionReports);
//   const [completedMissions, setCompletedMissions] = useState(reportStore.completedMissions);
//   const [tagMissCount, setTagMissCount] = useState(reportStore.tagMissCount);
//   const [plcSignals, setPlcSignals] = useState(reportStore.plcSignals);
//   const [isDataStale, setIsDataStale] = useState(reportStore.isDataStale);
//   const [isMissionActive, setIsMissionActive] = useState(reportStore.isMissionActive);
//   const [showConfirmModal, setShowConfirmModal] = useState(false);
//   const [archivedReports, setArchivedReports] = useState(loadArchive());

//   const [weeklyCountSafety, setWeeklyCountSafety] = useState(0);
//   const [weeklyCountMission, setWeeklyCountMission] = useState(0);
//   const [weeklyCountCompleted, setWeeklyCountCompleted] = useState(0);

//   const isDark = () => document.documentElement.classList.contains("dark");

//   // ─── weekly counts ───
//   const refreshWeeklyCounts = useCallback(() => {
//     const wk = getThisWeeksData(weeklyStore);
//     setWeeklyCountSafety(wk.safety.length);
//     setWeeklyCountMission(wk.mission.length);
//     setWeeklyCountCompleted(wk.completed.length);
//   }, []);

//   useEffect(() => {
//     refreshWeeklyCounts();
//   }, [refreshWeeklyCounts]);

//   // ─── sync from module-level store ───
//   const syncStateFromStore = useCallback(() => {
//     setSafetyReports([...reportStore.safetyReports]);
//     setMissionReports([...reportStore.missionReports]);
//     setCompletedMissions([...reportStore.completedMissions]);
//     setTagMissCount(reportStore.tagMissCount);
//     setPlcSignals({ ...reportStore.plcSignals });
//     setIsDataStale(reportStore.isDataStale);
//     setIsMissionActive(reportStore.isMissionActive);
//     refreshWeeklyCounts();
//   }, [refreshWeeklyCounts]);

//   useEffect(() => {
//     syncStateFromStore();
//   }, [syncStateFromStore]);

//   // ─── REAL-TIME EVENT LISTENERS (replaces polling interval) ───
//   useEffect(() => {
//     const unsubscribeSafety = reportEmitter.on("safetyReportAdded", (newReport) => {
//       setSafetyReports((prev) => {
//         const updated = [...prev, newReport];
//         return updated.length > MAX_DISPLAY ? updated.slice(-MAX_DISPLAY) : updated;
//       });
//       refreshWeeklyCounts();
//     });

//     const unsubscribeMission = reportEmitter.on("missionReportAdded", (newReport) => {
//       setMissionReports((prev) => {
//         const updated = [...prev, newReport];
//         return updated.length > MAX_DISPLAY ? updated.slice(-MAX_DISPLAY) : updated;
//       });
//       refreshWeeklyCounts();
//     });

//     const unsubscribeCompleted = reportEmitter.on("completedMissionAdded", (newReport) => {
//       setCompletedMissions((prev) => {
//         const updated = [...prev, newReport];
//         return updated.length > MAX_DISPLAY ? updated.slice(-MAX_DISPLAY) : updated;
//       });
//       refreshWeeklyCounts();
//     });

//     return () => {
//       unsubscribeSafety?.();
//       unsubscribeMission?.();
//       unsubscribeCompleted?.();
//     };
//   }, [refreshWeeklyCounts]);

//   useEffect(() => {
//     const onVisibility = () => {
//       if (!document.hidden) syncStateFromStore();
//     };
//     document.addEventListener("visibilitychange", onVisibility);
//     return () => document.removeEventListener("visibilitychange", onVisibility);
//   }, [syncStateFromStore]);

//   // ─────────────────────────────────────────────────────────────────────────
//   // HELPERS
//   // ─────────────────────────────────────────────────────────────────────────

//   const RED_WHEN_TRUE = ["work_over", "reset", "front_estop", "back_estop"];
//   const INVERTED_LOGIC = ["front_bumper", "rear_bumper"];

//   const getHealthStatus = (name, value) => {
//     if (INVERTED_LOGIC.includes(name)) return value ? t("report.val_healthy") : "Fault Triggered";
//     const isRed = RED_WHEN_TRUE.includes(name) ? value : !value;
//     return isRed ? "Fault Triggered" : t("report.val_healthy");
//   };

//   const getDisplayValue = (name, value) => {
//     if (INVERTED_LOGIC.includes(name)) return !value;
//     if (["front_lidar", "back_lidar"].includes(name)) return !value;
//     return value;
//   };

//   const markDataFresh = () => {
//     reportStore.lastDataUpdate = Date.now();
//     reportStore.isDataStale = false;
//     setIsDataStale(false);
//     clearTimeout(staleCheckRef.current);
//     staleCheckRef.current = setTimeout(() => {
//       reportStore.isDataStale = true;
//       setIsDataStale(true);
//       persistSessionStore(reportStore);
//     }, 30000);
//   };

//   // ─── auto-archive ───
//   const autoArchiveWeeklyReport = useCallback(() => {
//     const wkData = getThisWeeksData(weeklyStore);
//     if (!wkData.safety.length && !wkData.mission.length && !wkData.completed.length) return;
//     const now = new Date();
//     const wkNum = Math.ceil((now - new Date(now.getFullYear(), 0, 1)) / (7 * 24 * 60 * 60 * 1000));
//     const { sow, eow } = getWeekBounds();
//     addToArchive(wkData, wkNum, now.getFullYear(), sow.toLocaleDateString(), eow.toLocaleDateString());
//     setArchivedReports(loadArchive());
//   }, []);

//   // ─────────────────────────────────────────────────────────────────────────
//   // MESSAGE HANDLERS
//   // ─────────────────────────────────────────────────────────────────────────

//   const recordMissionStep = (activeMission, missionId, isStateChange = false) => {
//     const timestamp = new Date();
//     const stepEvent = {
//       id: `${missionId}-step-${timestamp.getTime()}-${Math.random()}`,
//       missionId,
//       timestamp,
//       timestampFormatted: timestamp.toLocaleString(),
//       timestampISO: timestamp.toISOString(),
//       dateKey: getDateKey(timestamp),
//       state: activeMission.state || "UNKNOWN",
//       step: activeMission.step || 0,
//       totalSteps: activeMission.totalSteps || 0,
//       currentTag: activeMission.currentTag || "—",
//       targetTag: activeMission.targetTag || "—",
//       action: activeMission.action || "—",
//       speed: activeMission.speed || "0.00",
//       distanceTraveled: activeMission.distanceTraveled || "0.00",
//       safetyActive: activeMission.safetyActive || false,
//       loop: activeMission.loop || false,
//       missionFile: activeMission.missionFile || "—",
//       missedTag: activeMission.missedTag || null,
//       lastSeenTag: activeMission.lastSeenTag || null,
//       distanceTraveledAtFault: activeMission.distanceTraveledAtFault || null,
//       eventType: isStateChange ? "STATE_CHANGE" : "STEP_UPDATE",
//     };
//     reportStore.missionReports = cappedAppend(reportStore.missionReports, stepEvent, MAX_DISPLAY);
//     reportStore.allMission = [...reportStore.allMission, stepEvent];
//     setMissionReports([...reportStore.missionReports]);

//     // EMIT EVENT FOR REAL-TIME UPDATE
//     reportEmitter.emit("missionReportAdded", stepEvent);

//     pushToPersistentStores("mission", stepEvent);
//     refreshWeeklyCounts();
//     return stepEvent;
//   };

//   const handlePlcMsg = useRef((name, msg) => {
//     const newValue = msg.data;
//     const prev = reportStore.plcSignals[name];
//     if (prev === newValue) return;

//     reportStore.plcSignals = { ...reportStore.plcSignals, [name]: newValue };
//     setPlcSignals({ ...reportStore.plcSignals });

//     const timestamp = new Date();
//     const healthStatus = getHealthStatus(name, newValue);

//     let statusColor;
//     if (INVERTED_LOGIC.includes(name)) statusColor = newValue ? "green" : "red";
//     else if (RED_WHEN_TRUE.includes(name)) statusColor = newValue ? "red" : "green";
//     else statusColor = newValue ? "green" : "red";

//     const signalLabel = tRef.current(`health.${name}`) || name.replace(/_/g, " ").toUpperCase();

//     const ev = {
//       id: `${timestamp.getTime()}-${Math.random()}`,
//       signal: name,
//       signalLabel,
//       value: newValue,
//       displayValue: getDisplayValue(name, newValue),
//       status: healthStatus,
//       statusColor,
//       timestamp,
//       timestampFormatted: timestamp.toLocaleString(),
//       timestampISO: timestamp.toISOString(),
//       dateKey: getDateKey(timestamp),
//     };

//     reportStore.safetyReports = cappedAppend(reportStore.safetyReports, ev, MAX_DISPLAY);
//     reportStore.allSafety = [...reportStore.allSafety, ev];
//     setSafetyReports([...reportStore.safetyReports]);

//     // EMIT EVENT FOR REAL-TIME UPDATE
//     reportEmitter.emit("safetyReportAdded", ev);

//     pushToPersistentStores("safety", ev);
//     refreshWeeklyCounts();
//     markDataFresh();
//     persistSessionStore(reportStore);
//   });

//   const handleImuMsg = useRef((_msg) => {
//     reportStore.plcSignals = { ...reportStore.plcSignals, imu: true };
//     setPlcSignals({ ...reportStore.plcSignals });
//     markDataFresh();

//     clearTimeout(imuTimeoutRef.current);
//     imuTimeoutRef.current = setTimeout(() => {
//       reportStore.plcSignals = { ...reportStore.plcSignals, imu: false };
//       setPlcSignals({ ...reportStore.plcSignals });

//       const ft = new Date();
//       const faultEv = {
//         id: `${ft.getTime()}-${Math.random()}`,
//         signal: "imu",
//         signalLabel: "IMU Sensor",
//         value: false,
//         displayValue: false,
//         status: "Fault Triggered",
//         statusColor: "red",
//         timestamp: ft,
//         timestampFormatted: ft.toLocaleString(),
//         timestampISO: ft.toISOString(),
//         dateKey: getDateKey(ft),
//       };
//       reportStore.safetyReports = cappedAppend(reportStore.safetyReports, faultEv, MAX_DISPLAY);
//       reportStore.allSafety = [...reportStore.allSafety, faultEv];
//       setSafetyReports([...reportStore.safetyReports]);

//       // EMIT EVENT FOR REAL-TIME UPDATE
//       reportEmitter.emit("safetyReportAdded", faultEv);

//       pushToPersistentStores("safety", faultEv);
//       refreshWeeklyCounts();
//       markDataFresh();
//       persistSessionStore(reportStore);
//     }, IMU_TIMEOUT_MS);
//   });

//   // ─── helper: apply missed-tag fields onto an active mission entry ───
//   const applyMissedTagToMission = (activeMission, w) => {
//     const missedTagNum = w.missed_tag ?? w.missedTag ?? w.expected_tag ?? w.target_tag ?? "?";
//     const lastSeen = w.last_seen_tag ?? w.lastSeenTag ?? w.current_tag ?? w.tag ?? "?";
//     const distM = (((w.distance_traveled ?? w.distanceTraveled ?? w.distance ?? 0)) / 1000).toFixed(2);
//     activeMission.missedTag = missedTagNum;
//     activeMission.lastSeenTag = lastSeen;
//     activeMission.distanceTraveledAtFault = distM;
//     activeMission.state = "WATCHDOG_FAULT";
//     reportStore.tagMissCount = (reportStore.tagMissCount || 0) + 1;
//     setTagMissCount(reportStore.tagMissCount);
//   };

//   const handleWatchdogMsg = useRef((msg) => {
//     if (!reportStore.isMissionActive) return;
//     try {
//       const w = JSON.parse(msg.data);
//       const isFault = w.fault === true || w.error === true || w.status === "fault" || w.status === "error";
//       if (!isFault) return;

//       const timestamp = new Date();
//       const missedTag = w.missed_tag ?? w.missedTag ?? w.expected_tag ?? w.target_tag ?? "?";
//       const faultKey = `${missedTag}-${w.distance_traveled ?? 0}-${timestamp.getTime()}`;
//       if (reportStore.recordedFaults.has(faultKey)) return;
//       reportStore.recordedFaults.add(faultKey);

//       const missionId = reportStore.currentMission?.mission_id || reportStore.currentMission?.mission_file || `mission-${Date.now()}`;
//       if (reportStore.activeMissions[missionId]) {
//         const am = reportStore.activeMissions[missionId];
//         applyMissedTagToMission(am, w);
//         recordMissionStep(am, missionId, true);
//       }
//       markDataFresh();
//       persistSessionStore(reportStore);
//     } catch (_) {}
//   });

//   const handleMissionMsg = useRef((msg) => {
//     try {
//       const s = JSON.parse(msg.data);
//       reportStore.currentMission = s;

//       const isStarting = s.state === "WAIT_FOR_START" || s.state === "DRIVE_TO_TAG" || s.state === "PAUSED";

//       if (isStarting && !reportStore.isMissionActive) {
//         reportStore.isMissionActive = true;
//         setIsMissionActive(true);
//         reportStore.missionReports = [];
//         reportStore.allMission = [];
//         reportStore.recordedFaults.clear();
//         reportStore.recordedStates.clear();
//         reportStore.activeMissions = {};
//         reportStore.tagMissCount = 0;
//         reportStore.lastState = null;
//         reportStore.missionAccum = {};
//         setMissionReports([]);
//         setTagMissCount(0);
//         persistSessionStore(reportStore);
//       }

//       if (s.state === "IDLE") {
//         if (reportStore.isMissionActive) {
//           reportStore.isMissionActive = false;
//           setIsMissionActive(false);
//           reportStore.recordedStates.clear();
//           reportStore.activeMissions = {};
//           persistSessionStore(reportStore);
//         }
//         markDataFresh();
//         persistSessionStore(reportStore);
//         return;
//       }

//       if (!reportStore.isMissionActive) {
//         markDataFresh();
//         persistSessionStore(reportStore);
//         return;
//       }

//       const missionId = s.mission_id || s.mission_file || `mission-${Date.now()}`;
//       const timestamp = new Date();

//       if (reportStore.activeMissions[missionId]) {
//         const ex = reportStore.activeMissions[missionId];
//         const stepChanged = ex.step !== (s.step ?? ex.step);
//         const distChanged = Math.abs(parseFloat(ex.distanceTraveled || 0) - parseFloat((s.distance_traveled ?? 0) / 1000)) > 0.1;
//         const stateChanged = ex.state !== s.state;

//         ex.state = s.state ?? ex.state;
//         ex.step = s.step ?? ex.step;
//         ex.totalSteps = s.total_steps ?? ex.totalSteps;
//         ex.currentTag = s.tag ?? ex.currentTag;
//         ex.targetTag = s.target_tag ?? ex.targetTag;
//         ex.action = s.action ?? ex.action;
//         ex.speed = (s.speed ?? 0).toFixed(2);
//         ex.distanceTraveled = (((s.distance_traveled ?? 0) / 1000)).toFixed(2);
//         ex.safetyActive = s.safety_active === true || s.safety_active === "true";
//         ex.loop = s.loop ?? ex.loop;
//         ex.timestampFormatted = timestamp.toLocaleString();
//         ex.timestampISO = timestamp.toISOString();

//         if (s.state === "WATCHDOG_FAULT" && stateChanged) {
//           const faultKey = `${missionId}-${s.target_tag}-${s.distance_traveled ?? 0}`;
//           if (!reportStore.recordedFaults.has(faultKey)) {
//             reportStore.recordedFaults.add(faultKey);
//             applyMissedTagToMission(ex, {
//               missed_tag: s.target_tag,
//               last_seen_tag: s.tag,
//               distance_traveled: s.distance_traveled ?? 0,
//             });
//           }
//         }

//         if (stepChanged || distChanged || stateChanged) recordMissionStep(ex, missionId, stateChanged);
//       } else {
//         const ev = {
//           id: `${missionId}-${timestamp.getTime()}`,
//           missionId,
//           timestamp,
//           timestampFormatted: timestamp.toLocaleString(),
//           timestampISO: timestamp.toISOString(),
//           dateKey: getDateKey(timestamp),
//           state: s.state ?? "UNKNOWN",
//           missionFile: s.mission_file ?? "—",
//           step: s.step ?? 0,
//           totalSteps: s.total_steps ?? 0,
//           targetTag: s.target_tag ?? "—",
//           currentTag: s.tag ?? "—",
//           action: s.action ?? "—",
//           speed: (s.speed ?? 0).toFixed(2),
//           distanceTraveled: (((s.distance_traveled ?? 0) / 1000)).toFixed(2),
//           safetyActive: s.safety_active === true || s.safety_active === "true",
//           loop: s.loop ?? false,
//           missedTag: null,
//           lastSeenTag: null,
//           persistedOnce: false,
//         };

//         if (s.state === "WATCHDOG_FAULT") {
//           applyMissedTagToMission(ev, {
//             missed_tag: s.target_tag,
//             last_seen_tag: s.tag,
//             distance_traveled: s.distance_traveled ?? 0,
//           });
//         }

//         reportStore.activeMissions[missionId] = ev;
//         reportStore.missionReports = cappedAppend(reportStore.missionReports, ev, MAX_DISPLAY);
//         reportStore.allMission = [...reportStore.allMission, ev];
//         setMissionReports([...reportStore.missionReports]);

//         // EMIT EVENT FOR REAL-TIME UPDATE
//         reportEmitter.emit("missionReportAdded", ev);

//         pushToPersistentStores("mission", ev);
//         refreshWeeklyCounts();
//       }

//       if (s.state === "COMPLETE") {
//         const cm = reportStore.activeMissions[missionId];
//         if (!cm) {
//           console.warn("COMPLETE but no active mission!");
//           return;
//         }

//         const endTime = new Date();
//         const startTime = cm.timestamp || new Date();
//         const duration = Math.round((endTime - startTime) / 1000);

//         const ce = {
//           id: `${missionId}-completed-${endTime.getTime()}`,
//           missionId,
//           timestamp: endTime,
//           startTime,
//           timestampFormatted: endTime.toLocaleString(),
//           timestampISO: endTime.toISOString(),
//           dateKey: getDateKey(endTime),
//           missionFile: cm.missionFile ?? "—",
//           totalSteps: cm.totalSteps ?? 0,
//           currentTag: cm.currentTag ?? "—",
//           targetTag: cm.targetTag ?? "—",
//           distanceTraveled: cm.distanceTraveled ?? "—",
//           loop: cm.loop ?? false,
//           durationSec: duration,
//           durationFormatted:
//             duration >= 60 ? `${Math.floor(duration / 60)}m ${duration % 60}s` : `${duration}s`,
//           finalState: s.state,
//           finalStep: cm.step ?? 0,
//           finalSpeed: cm.speed ?? "0.00",
//           safetyWasActive: cm.safetyActive ?? false,
//         };

//         reportStore.completedMissions = cappedAppend(reportStore.completedMissions, ce, MAX_DISPLAY);
//         reportStore.allCompleted = [...reportStore.allCompleted, ce];
//         setCompletedMissions([...reportStore.completedMissions]);

//         // EMIT EVENT FOR REAL-TIME UPDATE
//         reportEmitter.emit("completedMissionAdded", ce);

//         pushToPersistentStores("completed", ce);
//         refreshWeeklyCounts();

//         delete reportStore.activeMissions[missionId];
//         reportStore.isMissionActive = false;
//         setIsMissionActive(false);
//         reportStore.recordedStates.clear();
//         markDataFresh();
//         persistSessionStore(reportStore);
//       }

//       if (s.state === "ABORTED") {
//         delete reportStore.activeMissions[missionId];
//         reportStore.isMissionActive = false;
//         setIsMissionActive(false);
//         reportStore.recordedStates.clear();
//         markDataFresh();
//         persistSessionStore(reportStore);
//       }

//       markDataFresh();
//       persistSessionStore(reportStore);
//     } catch (e) {
//       console.error("handleMissionMsg error:", e);
//     }
//   });

//   // ─── subscriptions ───
//   useEffect(() => {
//     if (!connected) {
//       if (reportStore.subscribed) {
//         reportStore.unsubscribers?.forEach((u) => u?.());
//         reportStore.unsubscribers = [];
//         reportStore.subscribed = false;
//         clearTimeout(imuTimeoutRef.current);
//         clearTimeout(staleCheckRef.current);
//       }
//       return;
//     }
//     if (reportStore.subscribed) return;
//     reportStore.subscribed = true;
//     reportStore.unsubscribers = [];

//     reportStore.unsubscribers.push(
//       subscribe("/mission/status", "std_msgs/String", (msg) => handleMissionMsg.current(msg)),
//       subscribe("/watchdog/status", "std_msgs/String", (msg) => handleWatchdogMsg.current(msg)),
//       subscribe("/imu/data", "sensor_msgs/Imu", (msg) => handleImuMsg.current(msg))
//     );
//     [
//       { name: "work_over", topic: "/plc/work_over" },
//       { name: "front_estop", topic: "/plc/front_estop" },
//       { name: "back_estop", topic: "/plc/back_estop" },
//       { name: "reset", topic: "/plc/reset" },
//       { name: "front_lidar", topic: "/plc/front_lidar" },
//       { name: "back_lidar", topic: "/plc/back_lidar" },
//       { name: "front_bumper", topic: "/plc/front_bumper" },
//       { name: "rear_bumper", topic: "/plc/back_bumper" },
//     ].forEach(({ name, topic }) => {
//       reportStore.unsubscribers.push(subscribe(topic, "std_msgs/Bool", (msg) => handlePlcMsg.current(name, msg)));
//     });
//     markDataFresh();
//   }, [connected, subscribe]);

//   useEffect(
//     () => () => {
//       clearTimeout(imuTimeoutRef.current);
//       clearTimeout(staleCheckRef.current);
//     },
//     []
//   );

//   // ─────────────────────────────────────────────────────────────────────────
//   // DOWNLOAD HANDLERS
//   // ─────────────────────────────────────────────────────────────────────────

//   const ts = () => new Date().toISOString().slice(0, 19).replace(/:/g, "-");

//   const downloadWeeklyReport = async () => {
//     try {
//       const wkData = getThisWeeksData(weeklyStore);
//       if (!wkData.safety.length && !wkData.mission.length && !wkData.completed.length) {
//         alert("No data for this week yet.");
//         return;
//       }
//       const now = new Date();
//       const wkNum = Math.ceil((now - new Date(now.getFullYear(), 0, 1)) / (7 * 24 * 60 * 60 * 1000));
//       const { sow, eow } = getWeekBounds();
//       const sd = sow.toLocaleDateString();
//       const ed = eow.toLocaleDateString();
//       const wb = generateWeeklyReport(wkData.safety, wkData.mission, wkData.completed, sd, ed);
//       await downloadBuffer(
//         wb,
//         `weekly_report_${now.getFullYear()}_week${wkNum}_${sd.replace(/\//g, "-")}_to_${ed.replace(
//           /\//g,
//           "-"
//         )}.xlsx`
//       );
//       autoArchiveWeeklyReport();
//     } catch (err) {
//       console.error(err);
//       alert("Error: " + err.message);
//     }
//   };

//   const downloadArchivedReport = async (entry) => {
//     try {
//       const { data, startDate, endDate, weekNumber, year } = entry;
//       const wb = generateWeeklyReport(data.safety, data.mission, data.completed, startDate, endDate);
//       await downloadBuffer(
//         wb,
//         `archived_weekly_report_${year}_week${weekNumber}_${startDate.replace(/\//g, "-")}_to_${endDate.replace(
//           /\//g,
//           "-"
//         )}.xlsx`
//       );
//     } catch (err) {
//       console.error(err);
//       alert("Error: " + err.message);
//     }
//   };

//   const downloadInterlockExcel = async () => {
//     try {
//       const allSafety = monthlyStore.safety || [];
//       if (!allSafety.length) {
//         alert("No safety data");
//         return;
//       }
//       const wb = new ExcelJS.Workbook();
//       const ws = wb.addWorksheet("Safety Events");
//       ws.columns = [
//         { width: 6 },
//         { width: 12 },
//         { width: 22 },
//         { width: 20 },
//         { width: 12 },
//         { width: 25 }
//       ];
//       ws.mergeCells("A1:E1");
//       ws.getRow(1).height = 28;
//       const t1 = ws.getCell("A1");
//       t1.value = "SAFETY EVENTS (30-Day History)";
//       applyTitleStyle(t1);
//       ws.mergeCells("A2:E2");
//       ws.getRow(2).height = 18;
//       const s1 = ws.getCell("A2");
//       s1.value = `Generated: ${new Date().toLocaleString()} | Total: ${allSafety.length} events`;
//       applySubtitleStyle(s1);
//       ws.getRow(4).height = 22;
//       ["No.", "Date", "Timestamp", "Device", "Status", "Health"].forEach((h, i) => {
//         const c = ws.getCell(4, i + 1);
//         c.value = h;
//         applyHeaderStyle(c);
//       });
//       allSafety.forEach((row2, idx) => {
//         const rn = 5 + idx;
//         ws.getRow(rn).height = 20;
//         [
//           [idx + 1, "center"],
//           [row2.dateKey || "—", "center"],
//           [row2.timestampFormatted || "—", "left"],
//           [row2.signalLabel || "—", "left"],
//         ].forEach(([v, a], ci) => {
//           const c = ws.getCell(rn, ci + 1);
//           c.value = v;
//           applyDataStyle(c, idx, a);
//         });
//         const st = ws.getCell(rn, 5);
//         st.value = row2.statusColor?.toUpperCase() || "—";
//         applyStatusStyle(st, st.value);
//         const hl = ws.getCell(rn, 6);
//         hl.value = sanitizeStatus(row2.status) || "—";
//         applyDataStyle(hl, idx, "left");
//       });
//       await downloadBuffer(wb, `safety_report_${ts()}.xlsx`);
//     } catch (err) {
//       console.error(err);
//       alert("Error: " + err.message);
//     }
//   };

//   const downloadMissionExcel = async () => {
//     try {
//       const allMission = monthlyStore.mission || [];
//       if (!allMission.length) {
//         alert("No mission data");
//         return;
//       }
//       const wb = new ExcelJS.Workbook();
//       const ws = wb.addWorksheet("Mission Events");
//       ws.columns = [
//         { width: 6 },
//         { width: 12 },
//         { width: 22 },
//         { width: 15 },
//         { width: 8 },
//         { width: 10 },
//         { width: 10 },
//         { width: 12 },
//         { width: 15 },
//         { width: 22 },
//       ];
//       ws.mergeCells("A1:J1");
//       ws.getRow(1).height = 28;
//       const t1 = ws.getCell("A1");
//       t1.value = "MISSION EVENTS (STEP-BY-STEP, 30-Day History)";
//       applyTitleStyle(t1);
//       ws.mergeCells("A2:J2");
//       ws.getRow(2).height = 18;
//       const s1 = ws.getCell("A2");
//       s1.value = `Generated: ${new Date().toLocaleString()} | Total: ${allMission.length} step events`;
//       applySubtitleStyle(s1);
//       ws.getRow(4).height = 22;
//       ["No.", "Date", "Timestamp", "State", "Step", "Tag", "Target", "Speed (m/s)", "Missed Tag", "Mission File"].forEach(
//         (h, i) => {
//           const c = ws.getCell(4, i + 1);
//           c.value = h;
//           applyHeaderStyle(c);
//         }
//       );
//       allMission.forEach((row2, idx) => {
//         const rn = 5 + idx;
//         ws.getRow(rn).height = 20;
//         [
//           [idx + 1, "center"],
//           [row2.dateKey || "—", "center"],
//           [row2.timestampFormatted || "—", "left"],
//           [row2.state || "—", "left"],
//           [row2.step || "—", "center"],
//           [row2.currentTag || "—", "center"],
//           [row2.targetTag || "—", "center"],
//           [row2.speed ?? "—", "center"],
//           [row2.missedTag != null ? `#${row2.missedTag}` : "—", "center"],
//           [row2.missionFile || "—", "left"],
//         ].forEach(([v, a], ci) => {
//           const c = ws.getCell(rn, ci + 1);
//           c.value = v;
//           applyDataStyle(c, idx, a);
//         });
//       });
//       await downloadBuffer(wb, `mission_report_${ts()}.xlsx`);
//     } catch (err) {
//       console.error(err);
//       alert("Error: " + err.message);
//     }
//   };

//   const downloadCompletedExcel = async () => {
//     try {
//       const allCompleted = monthlyStore.completed || [];
//       if (!allCompleted.length) {
//         alert("No completed mission data");
//         return;
//       }
//       const wb = new ExcelJS.Workbook();
//       const ws = wb.addWorksheet("Completed Missions");
//       ws.columns = [
//         { width: 6 },
//         { width: 12 },
//         { width: 22 },
//         { width: 22 },
//         { width: 10 },
//         { width: 14 },
//         { width: 8 },
//       ];
//       ws.mergeCells("A1:G1");
//       ws.getRow(1).height = 28;
//       const t1 = ws.getCell("A1");
//       t1.value = "COMPLETED MISSIONS (30-Day History)";
//       applyTitleStyle(t1);
//       ws.mergeCells("A2:G2");
//       ws.getRow(2).height = 18;
//       const s1 = ws.getCell("A2");
//       s1.value = `Generated: ${new Date().toLocaleString()} | Total: ${allCompleted.length} missions`;
//       applySubtitleStyle(s1);
//       ws.getRow(4).height = 22;
//       ["No.", "Date", "Completed At", "Mission File", "Steps", "Duration", "Loop"].forEach((h, i) => {
//         const c = ws.getCell(4, i + 1);
//         c.value = h;
//         applyHeaderStyle(c);
//       });
//       allCompleted.forEach((row2, idx) => {
//         const rn = 5 + idx;
//         ws.getRow(rn).height = 20;
//         [
//           [idx + 1, "center"],
//           [row2.dateKey || "—", "center"],
//           [row2.timestampFormatted || "—", "left"],
//           [row2.missionFile || "—", "left"],
//           [row2.totalSteps || 0, "center"],
//           [row2.durationFormatted || "—", "left"],
//           [row2.loop ? "ON" : "OFF", "center"],
//         ].forEach(([v, a], ci) => {
//           const c = ws.getCell(rn, ci + 1);
//           c.value = v;
//           applyDataStyle(c, idx, a);
//         });
//       });
//       await downloadBuffer(wb, `completed_missions_${ts()}.xlsx`);
//     } catch (err) {
//       console.error(err);
//       alert("Error: " + err.message);
//     }
//   };

//   // ─── clear all ───
//   // ✅ FIX (this version): "Clear All" must ONLY clear what's *displayed* and
//   // *logged* (the report arrays, dedup Sets, and counts). It must NEVER
//   // reset the app's live knowledge of the robot's current actual state —
//   // plcSignals, currentMission, activeMissions, isMissionActive — because
//   // several ROS topics here (/plc/*, /mission/status) only publish when a
//   // value genuinely changes on the robot. If we reset those trackers to
//   // hardcoded defaults, the app becomes permanently out of sync: it will
//   // silently swallow the next *real* transition (comparing it against the
//   // wrong assumed baseline) or simply never receive another message until
//   // some unrelated toggle happens to occur. That was the root cause of
//   // "after Clear All, no new reports ever show up."
//   const confirmClearAll = () => {
//     // Clear only the displayed/logged history:
//     reportStore.safetyReports = [];
//     reportStore.missionReports = [];
//     reportStore.completedMissions = [];
//     reportStore.allSafety = [];
//     reportStore.allMission = [];
//     reportStore.allCompleted = [];
//     reportStore.tagMissCount = 0;

//     // Safe to clear: these are just "have we already logged this exact
//     // fault" de-dup sets, not current-state trackers. Clearing them can at
//     // worst cause a fault to be logged again if it re-fires identically,
//     // which is harmless (and arguably more correct than staying silent).
//     reportStore.recordedFaults.clear();
//     reportStore.recordedStates.clear();
//     reportStore.lastState = null;
//     reportStore.missionAccum = {};

//     // Reset only the "stale" bookkeeping — this doesn't affect change
//     // detection, just the UI's "no updates for 30s" banner.
//     reportStore.lastDataUpdate = null;
//     reportStore.isDataStale = false;

//     // ── Intentionally NOT reset ──────────────────────────────────────────
//     // reportStore.plcSignals    — must keep reflecting the robot's real
//     //                              last-known signal values, or the next
//     //                              genuine transition gets silently dropped
//     //                              by the `if (prev === newValue) return;`
//     //                              check in handlePlcMsg.
//     // reportStore.currentMission,
//     // reportStore.activeMissions,
//     // reportStore.isMissionActive — must keep reflecting whether a mission
//     //                              is actually in progress on the robot
//     //                              right now, or handleMissionMsg misjudges
//     //                              subsequent /mission/status messages.
//     // ───────────────────────────────────────────────────────────────────

//     setSafetyReports([]);
//     setMissionReports([]);
//     setCompletedMissions([]);
//     setTagMissCount(0);
//     setIsDataStale(false);
//     // plcSignals / isMissionActive UI state intentionally left as-is —
//     // re-sync from the (untouched) reportStore just to be explicit:
//     setPlcSignals({ ...reportStore.plcSignals });
//     setIsMissionActive(reportStore.isMissionActive);

//     refreshWeeklyCounts(); // weeklyStore is intact, so these counts stay accurate
//     persistSessionStore(reportStore);
//     setShowConfirmModal(false);
//   };

//   // ─────────────────────────────────────────────────────────────────────────
//   // DERIVED STATE
//   // ─────────────────────────────────────────────────────────────────────────

//   const imuFaults = safetyReports.filter((r) => r.signal === "imu" && r.statusColor === "red").length;
//   const bumperFaults = safetyReports.filter((r) => (r.signal === "front_bumper" || r.signal === "rear_bumper") && r.statusColor === "red").length;
//   const missionFaults = missionReports.filter((r) => r.state === "WATCHDOG_FAULT").length;
//   const noData = !reportStore.allSafety.length && !reportStore.allMission.length && !reportStore.allCompleted.length;

//   const TABS = [
//     {
//       key: "interlock",
//       icon: <IconShield size={18} />,
//       label: t("report.tab_interlock"),
//       count: safetyReports.length,
//       accentActive: "text-amber-600 dark:text-amber-400",
//       countBg: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
//     },
//     {
//       key: "mission",
//       icon: <IconMission size={18} />,
//       label: t("report.tab_mission"),
//       count: missionReports.length,
//       accentActive: "text-sky-600 dark:text-sky-400",
//       countBg: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-400",
//     },
//     {
//       key: "completed",
//       icon: <IconCheckCircle size={18} />,
//       label: t("report.tab_completed"),
//       count: completedMissions.length,
//       accentActive: "text-emerald-600 dark:text-emerald-400",
//       countBg: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
//     },
//     {
//       key: "archive",
//       icon: <IconArchive size={18} />,
//       label: "Archives",
//       count: archivedReports.length,
//       accentActive: "text-purple-600 dark:text-purple-400",
//       countBg: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400",
//     },
//   ];

//   const TH = ({ children, className = "" }) => (
//     <th className={`text-left font-black uppercase text-xs text-slate-500 whitespace-nowrap ${className}`} style={{ padding: "12px 10px" }}>
//       {children}
//     </th>
//   );
//   const TD = ({ children, className = "", style: s }) => (
//     <td className={className} style={{ padding: "12px 10px", ...s }}>
//       {children}
//     </td>
//   );

//   // ═════════════════════════════════════════════════════════════════════════
//   // RENDER
//   // ═════════════════════════════════════════════════════════════════════════

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-slate-900 dark:text-white flex flex-col" style={{ padding: "14px 14px 28px", gap: 14 }}>
//       {/* PAGE HEADER */}
//       <div className="border-b-4 border-sky-500" style={{ paddingBottom: 12 }}>
//         <div className="flex items-center justify-between gap-4 mb-3">
//           <h2 className="font-black uppercase tracking-tighter" style={{ fontSize: 24 }}>
//             📊 {t("report.title")}
//           </h2>
//           <div className="flex items-center gap-2">
//             {isMissionActive && (
//               <span className="text-xs font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-3 py-1 rounded-full animate-pulse">
//                 🟢 Mission Active
//               </span>
//             )}
//             {isDataStale && (
//               <span className="text-xs font-bold bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 px-3 py-1 rounded-full">
//                 ⚠ Data stale (no updates for 30s)
//               </span>
//             )}
//           </div>
//         </div>

//         <div className="flex flex-wrap items-center gap-2 mb-3 px-3 py-2 rounded-xl bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800">
//           <span className="text-purple-600 dark:text-purple-400 font-black text-xs uppercase tracking-wider">📅 This Week (persistent):</span>
//           <span className="text-xs font-bold text-amber-600">{weeklyCountSafety} Safety</span>
//           <span className="text-slate-400">·</span>
//           <span className="text-xs font-bold text-sky-600">{weeklyCountMission} Mission Steps</span>
//           <span className="text-slate-400">·</span>
//           <span className="text-xs font-bold text-emerald-600">{weeklyCountCompleted} Completed</span>
//           <span className="text-slate-400 text-xs ml-auto">30-day storage • Survives disconnects &amp; Clear All</span>
//         </div>

//         <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 8 }}>
//           {[
//             { label: "Safety Events", icon: <IconShield size={18} />, bg: "bg-amber-500 hover:bg-amber-400", disabled: !(monthlyStore.safety?.length), fn: downloadInterlockExcel },
//             { label: "Mission Steps", icon: <IconMission size={18} />, bg: "bg-sky-600 hover:bg-sky-500", disabled: !(monthlyStore.mission?.length), fn: downloadMissionExcel },
//             { label: "Completed", icon: <IconCheckCircle size={18} />, bg: "bg-emerald-600 hover:bg-emerald-500", disabled: !(monthlyStore.completed?.length), fn: downloadCompletedExcel },
//             { label: "Weekly Report", icon: <IconRefresh size={18} />, bg: "bg-purple-600 hover:bg-purple-500", disabled: weeklyCountSafety + weeklyCountMission + weeklyCountCompleted === 0, fn: downloadWeeklyReport },
//             { label: "Clear All", icon: <IconTrash size={18} />, bg: "bg-red-600 hover:bg-red-500", disabled: noData, fn: () => setShowConfirmModal(true) },
//           ].map(({ label, icon, bg, disabled, fn }) => (
//             <button
//               key={label}
//               onClick={fn}
//               disabled={disabled}
//               className={`flex items-center justify-center gap-2 rounded-xl font-black uppercase text-white shadow-md transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed ${bg}`}
//               style={{ minHeight: 52, fontSize: 11, letterSpacing: "0.04em", padding: "0 8px" }}
//             >
//               {icon}
//               <span className="truncate">{label}</span>
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* CONNECTION STATUS */}
//       <div
//         className={`flex items-center gap-3 rounded-xl border ${
//           connected ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800" : "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800"
//         }`}
//         style={{ padding: "10px 14px" }}
//       >
//         <div className={`rounded-full shrink-0 ${connected ? "bg-emerald-500 animate-pulse" : "bg-red-500"}`} style={{ width: 14, height: 14 }} />
//         <span className="font-bold text-sm">
//           Robot: {connected ? t("report.robot_online") : t("report.robot_disconnected")}
//         </span>
//         {!connected && <span className="ml-auto text-amber-600 dark:text-amber-400 text-xs font-bold shrink-0">{t("report.waiting_wifi")} — 30-day data preserved</span>}
//       </div>

//       {/* SUMMARY STATS */}
//       <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 8 }}>
//         {[
//           { label: "Safety Events", val: monthlyStore.safety?.length || 0, color: "text-amber-500" },
//           { label: "IMU Faults", val: imuFaults, color: "text-orange-500" },
//           { label: "Bumper Faults", val: bumperFaults, color: "text-red-600" },
//           { label: "Mission Steps", val: monthlyStore.mission?.length || 0, color: "text-sky-500" },
//           { label: "Watchdog", val: missionFaults, color: "text-red-500" },
//           { label: "Missed Tags", val: tagMissCount, color: "text-fuchsia-600" },
//           { label: "Completed", val: monthlyStore.completed?.length || 0, color: "text-emerald-600" },
//           { label: "Archived", val: archivedReports.length, color: "text-purple-600" },
//         ].map((c, i) => (
//           <StatChip key={i} label={c.label} val={c.val} color={c.color} />
//         ))}
//       </div>

//       {/* TABS */}
//       <div className="flex gap-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl" style={{ padding: 5 }}>
//         {TABS.map(({ key, icon, label, count, accentActive, countBg }) => (
//           <button
//             key={key}
//             onClick={() => setActiveTab(key)}
//             className={`flex items-center justify-center gap-1.5 flex-1 rounded-lg font-black uppercase transition-all ${
//               activeTab === key ? `bg-white dark:bg-slate-900 shadow-md ${accentActive}` : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
//             }`}
//             style={{ minHeight: 52, fontSize: 11, letterSpacing: "0.04em", padding: "0 6px" }}
//           >
//             {icon}
//             <span>{label}</span>
//             {count > 0 && (
//               <span className={`text-xs px-1.5 py-0.5 rounded-full font-black ${activeTab === key ? countBg : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"}`}>
//                 {count}
//               </span>
//             )}
//           </button>
//         ))}
//       </div>

//       {/* ── SAFETY EVENTS TAB ── */}
//       {activeTab === "interlock" && (
//         <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border dark:border-slate-800 overflow-hidden">
//           <div style={{ padding: "14px 16px" }} className="border-b dark:border-slate-800">
//             <h3 className="font-black uppercase text-amber-600" style={{ fontSize: 15 }}>
//               ⚠️ Safety Events
//             </h3>
//             <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
//               {monthlyStore.safety?.length || 0} total — showing latest {safetyReports.length}
//             </p>
//           </div>
//           {safetyReports.length === 0 ? (
//             <EmptyState label="No safety events" sub="Signal changes will appear here" />
//           ) : (
//             <div style={isDark() ? darkTableContainerStyle : tableContainerStyle}>
//               <table className="w-full">
//                 <thead className="bg-slate-50 dark:bg-slate-800 border-b dark:border-slate-700" style={tableHeaderStickyStyle}>
//                   <tr>
//                     <TH>No.</TH>
//                     <TH>Date</TH>
//                     <TH>Timestamp</TH>
//                     <TH>Device</TH>
//                     <TH>Status</TH>
//                     <TH>Health</TH>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {safetyReports.map((r, idx) => (
//                     <tr key={r.id} className="border-b dark:border-slate-800 hover:bg-amber-50/40 dark:hover:bg-amber-950/10">
//                       <TD className="text-slate-400 font-bold text-xs">{idx + 1}</TD>
//                       <TD className="text-xs font-mono text-slate-500">{r.dateKey}</TD>
//                       <TD>
//                         <div className="text-xs font-bold">{r.timestampFormatted}</div>
//                       </TD>
//                       <TD className="text-sm font-semibold">{r.signalLabel}</TD>
//                       <TD>
//                         <span
//                           className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-black ${
//                             r.statusColor === "green"
//                               ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
//                               : "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400"
//                           }`}
//                         >
//                           <span className={`rounded-full shrink-0 ${r.statusColor === "green" ? "bg-emerald-500" : "bg-red-500"}`} style={{ width: 7, height: 7 }} />
//                           {r.statusColor.toUpperCase()}
//                         </span>
//                       </TD>
//                       <TD>{sanitizeStatus(r.status)}</TD>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       )}

//       {/* ── MISSION EVENTS TAB ── */}
//       {activeTab === "mission" && (
//         <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border dark:border-slate-800 overflow-hidden">
//           <div style={{ padding: "14px 16px" }} className="border-b dark:border-slate-800">
//             <div className="flex items-center justify-between">
//               <h3 className="font-black uppercase text-sky-600" style={{ fontSize: 15 }}>
//                 🎯 Mission Steps
//               </h3>
//               {isMissionActive && (
//                 <span className="text-xs font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-3 py-1 rounded-full animate-pulse">
//                   🟢 Live
//                 </span>
//               )}
//             </div>
//             <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
//               {monthlyStore.mission?.length || 0} step updates — showing latest {missionReports.length}
//             </p>
//           </div>
//           {missionReports.length === 0 ? (
//             <EmptyState label="No mission steps recorded" sub="Mission step updates will appear here" />
//           ) : (
//             <div style={isDark() ? darkTableContainerStyle : tableContainerStyle}>
//               <table className="w-full text-sm">
//                 <thead className="bg-slate-50 dark:bg-slate-800 border-b dark:border-slate-700" style={tableHeaderStickyStyle}>
//                   <tr>
//                     <TH>No.</TH>
//                     <TH>Date</TH>
//                     <TH>Timestamp</TH>
//                     <TH>State</TH>
//                     <TH>Step</TH>
//                     <TH>Tag</TH>
//                     <TH>Target</TH>
//                     <TH>Speed</TH>
//                     <TH>Missed Tag</TH>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {missionReports.map((r, idx) => (
//                     <tr key={r.id} className="border-b dark:border-slate-800 hover:bg-sky-50/40 dark:hover:bg-sky-900/10">
//                       <TD className="text-slate-400 font-bold text-xs">{idx + 1}</TD>
//                       <TD className="text-xs font-mono text-slate-500">{r.dateKey}</TD>
//                       <TD>
//                         <div className="text-xs font-bold">{r.timestampFormatted}</div>
//                       </TD>
//                       <TD>
//                         <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-black whitespace-nowrap ${getStateStyle(r.state).bg} ${getStateStyle(r.state).text}`}>
//                           <span className={`rounded-full shrink-0 ${getStateStyle(r.state).dot}`} style={{ width: 6, height: 6 }} />
//                           {r.state}
//                         </span>
//                       </TD>
//                       <TD className="font-mono font-bold text-amber-600 dark:text-amber-400 text-xs">
//                         {r.step}/{r.totalSteps}
//                       </TD>
//                       <TD className="font-mono font-black text-sky-600 dark:text-sky-400">#{r.currentTag}</TD>
//                       <TD className="font-mono font-black text-purple-600 dark:text-purple-400">#{r.targetTag}</TD>
//                       <TD className="font-mono text-xs">
//                         {r.speed} m/s
//                       </TD>
//                       <TD className={`font-mono font-black ${r.missedTag ? "text-red-600 dark:text-red-400" : "text-slate-400"}`}>
//                         {r.missedTag ? `#${r.missedTag}` : "—"}
//                       </TD>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       )}

//       {/* ── COMPLETED MISSIONS TAB ── */}
//       {activeTab === "completed" && (
//         <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border dark:border-slate-800 overflow-hidden">
//           <div style={{ padding: "14px 16px" }} className="border-b dark:border-slate-800">
//             <h3 className="font-black uppercase text-emerald-600" style={{ fontSize: 15 }}>
//               ✅ Completed Missions
//             </h3>
//             <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
//               {monthlyStore.completed?.length || 0} total — showing latest {completedMissions.length}
//             </p>
//           </div>
//           {completedMissions.length === 0 ? (
//             <EmptyState label="No completed missions" sub="Finished missions will appear here" />
//           ) : (
//             <div style={isDark() ? darkTableContainerStyle : tableContainerStyle}>
//               <table className="w-full">
//                 <thead className="bg-slate-50 dark:bg-slate-800 border-b dark:border-slate-700" style={tableHeaderStickyStyle}>
//                   <tr>
//                     <TH>No.</TH>
//                     <TH>Date</TH>
//                     <TH>Completed At</TH>
//                     <TH>Mission File</TH>
//                     <TH>Steps</TH>
//                     <TH>Duration</TH>
//                     <TH>Loop</TH>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {completedMissions.map((r, idx) => (
//                     <tr key={r.id} className="border-b dark:border-slate-800 hover:bg-emerald-50/40 dark:hover:bg-emerald-950/10">
//                       <TD className="text-slate-400 font-bold text-xs">{idx + 1}</TD>
//                       <TD className="text-xs font-mono text-slate-500">{r.dateKey}</TD>
//                       <TD>
//                         <div className="text-xs font-bold">{r.timestampFormatted}</div>
//                         <div className="text-xs text-slate-400 font-mono">{r.durationFormatted}</div>
//                       </TD>
//                       <TD className="text-xs font-mono text-sky-600 dark:text-sky-400 max-w-xs truncate">{r.missionFile}</TD>
//                       <TD>
//                         <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-black bg-sky-50 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300">
//                           {r.finalStep}/{r.totalSteps}
//                         </span>
//                       </TD>
//                       <TD>
//                         <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-black bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300">
//                           ⏱ {r.durationFormatted}
//                         </span>
//                       </TD>
//                       <TD className={`text-xs font-black ${r.loop ? "text-amber-600 dark:text-amber-400" : "text-slate-400"}`}>
//                         {r.loop ? "ON" : "OFF"}
//                       </TD>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       )}

//       {/* ── ARCHIVE TAB ── */}
//       {activeTab === "archive" && (
//         <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border dark:border-slate-800 overflow-hidden">
//           <div style={{ padding: "14px 16px" }} className="border-b dark:border-slate-800">
//             <h3 className="font-black uppercase text-purple-600" style={{ fontSize: 15 }}>
//               📦 Archived Weekly Reports
//             </h3>
//             <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
//               {archivedReports.length} archived reports (survives clear operations)
//             </p>
//           </div>
//           {archivedReports.length === 0 ? (
//             <EmptyState label="No archived reports yet" sub="Weekly reports will be archived here after download" />
//           ) : (
//             <div style={isDark() ? darkTableContainerStyle : tableContainerStyle}>
//               <table className="w-full text-sm">
//                 <thead className="bg-slate-50 dark:bg-slate-800 border-b dark:border-slate-700" style={tableHeaderStickyStyle}>
//                   <tr>
//                     <TH>Week</TH>
//                     <TH>Year</TH>
//                     <TH>Period</TH>
//                     <TH>Safety</TH>
//                     <TH>Mission</TH>
//                     <TH>Completed</TH>
//                     <TH>Archived At</TH>
//                     <TH>Action</TH>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {[...archivedReports].reverse().map((archive) => (
//                     <tr key={archive.id} className="border-b dark:border-slate-800 hover:bg-purple-50/40 dark:hover:bg-purple-900/10">
//                       <TD className="font-mono font-black text-purple-600 dark:text-purple-400">{archive.weekNumber}</TD>
//                       <TD className="font-bold">{archive.year}</TD>
//                       <TD className="text-xs">
//                         <div>{archive.startDate}</div>
//                         <div className="text-slate-400">to {archive.endDate}</div>
//                       </TD>
//                       <TD className="text-xs font-bold text-amber-600">{archive.counts.safety}</TD>
//                       <TD className="text-xs font-bold text-sky-600">{archive.counts.mission}</TD>
//                       <TD className="text-xs font-bold text-emerald-600">{archive.counts.completed}</TD>
//                       <TD className="text-xs font-mono text-slate-500">{new Date(archive.createdAt).toLocaleString()}</TD>
//                       <TD>
//                         <button
//                           type="button"
//                           onClick={() => downloadArchivedReport(archive)}
//                           className="px-3 py-1 rounded-lg bg-purple-500 hover:bg-purple-600 text-white font-bold text-xs transition-all active:scale-95"
//                         >
//                           ⬇️ Download
//                         </button>
//                       </TD>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       )}

//       {/* CONFIRM MODAL */}
//       <ConfirmationModal
//         isOpen={showConfirmModal}
//         onClose={() => setShowConfirmModal(false)}
//         onConfirm={confirmClearAll}
//         title="Clear Dashboard View"
//         message="This clears the live dashboard view (current tab counts and tables). Your weekly report, 30-day exports, and archived reports are not affected and will keep all historical data. This action cannot be undone for the on-screen view."
//         confirmText="Yes, Clear View"
//         cancelText="Cancel"
//       />
//     </div>
//   );
// }





// import React, { useState, useEffect, useCallback, useRef } from "react";
// import { useLanguage } from "../context/LanguageContext";
// import { useROS } from "../context/RosContext";
// import ExcelJS from "exceljs";
// import { saveAs } from "file-saver";

// // ═════════════════════════════════════════════════════════════════════════════
// // EVENT EMITTER FOR REAL-TIME UPDATES
// // ═════════════════════════════════════════════════════════════════════════════

// class ReportEventEmitter {
//   constructor() {
//     this.listeners = {
//       safetyReportAdded: [],
//       missionReportAdded: [],
//       completedMissionAdded: [],
//     };
//   }

//   on(event, callback) {
//     if (this.listeners[event]) {
//       this.listeners[event].push(callback);
//       return () => {
//         this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
//       };
//     }
//   }

//   emit(event, data) {
//     if (this.listeners[event]) {
//       this.listeners[event].forEach(callback => {
//         try {
//           callback(data);
//         } catch (e) {
//           console.error(`Error in ${event} listener:`, e);
//         }
//       });
//     }
//   }
// }


// const reportEmitter = new ReportEventEmitter();

// // ═════════════════════════════════════════════════════════════════════════════
// // CONSTANTS
// // ═════════════════════════════════════════════════════════════════════════════

// const STORAGE_KEY = "reportStoreV3";
// const WEEKLY_KEY = "weeklyReportStoreV2";
// const MONTHLY_KEY = "monthlyReportStore";
// const ARCHIVE_KEY = "archivedWeeklyReports";
// const MAX_DISPLAY = 4;
// const IMU_TIMEOUT_MS = 1500;
// const MAX_STORAGE_DAYS = 30;

// // ═════════════════════════════════════════════════════════════════════════════
// // MOTOR ERROR BITMASK LOOKUP
// // ═════════════════════════════════════════════════════════════════════════════
// // Same table used on the dashboard (Home) and Header bell icon — errors come
// // back as a hex bitmask (e.g. "0x00020000"), so more than one fault can be
// // active on a given motor at the same time.
// const MOTOR_ERROR_CODES = {
//   0x1: "Position out of limit error",
//   0x2: "Counter-Clockwise limit reached",
//   0x4: "Clockwise limit reached",
//   0x8: "Over Temperature",
//   0x10: "Internal Voltage",
//   0x20: "Over Voltage",
//   0x80: "Drive over current",
//   0x200: "Encoder Disconnected",
//   0x400: "Modbus/Serial Communication Error",
//   0x1000: "Cooling fan / Ventilation failure",
//   0x2000: "Motor Overload",
//   0x8000: "Unusual Start",
//   0x10000: "Power phase loss",
//   0x20000: "STO Triggered",
//   0x80000: "Motor Over-Speed (Velocity Exceeds Limit)",
//   0x100000: "Drive Under-Voltage",
//   0x200000: "Emergency Stop Triggered",
//   0x400000: "Secondary Encoder Not Connected / Error",
//   0x800000: "Fully Closed-Loop Homing Direction/Option Error",
//   0x1000000: "Absolute Encoder Voltage Low / Battery Error",
//   0x2000000: "Absolute Position Lost",
//   0x4000000: "Absolute Position Overflow",
//   0x8000000: "RS-485 Communication Interrupted",
//   0x10000000: "Absolute Encoder Multi-Turn Track Error",
//   0x20000000: "Abnormal Motor Movement / Stalled",
//   0x40000000: "EtherCAT Communication Fault",
//   0x80000000: "Parameter / Driver Configuration Error",
// };


// // Returns every currently-set fault bit as {code, label}, ignoring 0/no-error.
// function getActiveMotorFaults(errValue) {
//   const num = typeof errValue === "string" ? parseInt(errValue, 16) : Number(errValue);
//   if (isNaN(num) || num === 0) return [];

//   const active = Object.entries(MOTOR_ERROR_CODES)
//     .filter(([codeStr]) => (num & Number(codeStr)) === Number(codeStr))
//     .map(([codeStr, label]) => ({ code: Number(codeStr), label }));

//   const matchedMask = active.reduce((mask, { code }) => mask | code, 0);
//   const remaining = num & ~matchedMask;
//   if (remaining !== 0) {
//     active.push({ code: remaining, label: `Unknown fault (0x${remaining.toString(16)})` });
//   }

//   return active;
// }
// // Pulls just the L_Error / R_Error hex values out of the
// // /moons_motor_diagnostics string, e.g.
// // "L_Error=0x00020000,vel=133,... | R_Error=0x00020000,vel=134,..."
// function parseMotorErrorValues(raw) {
//   try {
//     const [leftPart, rightPart] = raw.split("|").map(s => s.trim());
//     const extractErr = (part) => {
//       const match = part.match(/(?:L_Error|R_Error|err)\s*=\s*([^\s,]+)/);
//       return match ? match[1] : "0x0";
//     };
//     return { left: extractErr(leftPart), right: extractErr(rightPart) };
//   } catch {
//     return { left: "0x0", right: "0x0" };
//   }
// }

// // ═════════════════════════════════════════════════════════════════════════════
// // STATUS SANITIZER
// // ═════════════════════════════════════════════════════════════════════════════

// function sanitizeStatus(statusText) {
//   if (!statusText) return statusText;
//   const s = statusText.toString();
//   const isFault =
//     s.includes("Fault") ||
//     s.includes("fault") ||
//     s.includes("दोष") ||
//     s.includes("異常") ||
//     s.includes("Active/Triggered") ||
//     s.includes("active_trig");
//   if (isFault) return "Fault Triggered";
//   return statusText;
// }

// function sanitizeSafetyArray(arr) {
//   if (!Array.isArray(arr)) return [];
//   return arr.map(r => ({ ...r, status: sanitizeStatus(r.status) }));
// }

// // ═════════════════════════════════════════════════════════════════════════════
// // STORAGE HELPERS
// // ═════════════════════════════════════════════════════════════════════════════

// function getDateKey(date = new Date()) {
//   return date.toISOString().slice(0, 10);
// }

// function getWeekBounds() {
//   const now = new Date();
//   const dow = now.getDay();
//   const sow = new Date(now);
//   sow.setDate(now.getDate() - dow);
//   sow.setHours(0, 0, 0, 0);
//   const eow = new Date(sow);
//   eow.setDate(sow.getDate() + 6);
//   eow.setHours(23, 59, 59, 999);
//   return { sow, eow };
// }

// function loadStore(key) {
//   try {
//     const raw = localStorage.getItem(key);
//     if (raw) return JSON.parse(raw);
//   } catch (_) { }
//   return null;
// }

// function saveStore(key, data) {
//   try {
//     localStorage.setItem(key, JSON.stringify(data));
//   } catch (e) {
//     console.error(`Failed to persist ${key}:`, e);
//   }
// }

// function loadAllStores() {
//   const weekly = loadStore(WEEKLY_KEY) || { safety: [], mission: [], completed: [] };
//   const monthly = loadStore(MONTHLY_KEY) || { safety: [], mission: [], completed: [] };

//   const sanitize = (store) => ({
//     ...store,
//     safety: sanitizeSafetyArray(store.safety),
//   });

//   return { weekly: sanitize(weekly), monthly: sanitize(monthly) };
// }

// function saveAndTrimStores(weekly, monthly) {
//   const cutoff = new Date();
//   cutoff.setDate(cutoff.getDate() - MAX_STORAGE_DAYS);
//   const cutoffKey = getDateKey(cutoff);

//   const trimData = (data) => ({
//     safety: data.safety.filter(r => (r.dateKey || "") >= cutoffKey),
//     mission: data.mission.filter(r => (r.dateKey || "") >= cutoffKey),
//     completed: data.completed.filter(r => (r.dateKey || "") >= cutoffKey),
//   });

//   const trimmedWeekly = trimData(weekly);
//   const trimmedMonthly = trimData(monthly);
//   saveStore(WEEKLY_KEY, trimmedWeekly);
//   saveStore(MONTHLY_KEY, trimmedMonthly);
//   return { weekly: trimmedWeekly, monthly: trimmedMonthly };
// }

// function getThisWeeksData(weeklyStore) {
//   const { sow, eow } = getWeekBounds();
//   const inRange = (r) => {
//     if (!r.timestampISO) return false;
//     const d = new Date(r.timestampISO);
//     return d >= sow && d <= eow;
//   };
//   return {
//     safety: weeklyStore.safety.filter(inRange),
//     mission: weeklyStore.mission.filter(inRange),
//     completed: weeklyStore.completed.filter(inRange),
//   };
// }

// // ═════════════════════════════════════════════════════════════════════════════
// // ARCHIVE HELPERS
// // ═════════════════════════════════════════════════════════════════════════════

// function loadArchive() {
//   try {
//     const raw = localStorage.getItem(ARCHIVE_KEY);
//     if (raw) return JSON.parse(raw);
//   } catch (_) { }
//   return [];
// }

// function saveArchive(archiveArray) {
//   try {
//     localStorage.setItem(ARCHIVE_KEY, JSON.stringify(archiveArray));
//   } catch (e) {
//     console.error("Failed to persist archive:", e);
//   }
// }

// function addToArchive(weeklyData, weekNumber, year, startDate, endDate) {
//   const archive = loadArchive();
//   const entry = {
//     id: `${year}-week${weekNumber}-${Date.now()}`,
//     weekNumber,
//     year,
//     startDate,
//     endDate,
//     createdAt: new Date().toISOString(),
//     data: {
//       safety: weeklyData.safety,
//       mission: weeklyData.mission,
//       completed: weeklyData.completed,
//     },
//     counts: {
//       safety: weeklyData.safety.length,
//       mission: weeklyData.mission.length,
//       completed: weeklyData.completed.length,
//     },
//   };
//   archive.push(entry);
//   saveArchive(archive);
//   return entry;
// }

// // ═════════════════════════════════════════════════════════════════════════════
// // SESSION STORE
// // ═════════════════════════════════════════════════════════════════════════════

// const defaultStore = {
//   safetyReports: [],
//   missionReports: [],
//   completedMissions: [],
//   allSafety: [],
//   allMission: [],
//   allCompleted: [],
//   tagMissCount: 0,
//   currentMission: null,
//   plcSignals: {
//     work_over: false,
//     front_estop: false,
//     back_estop: false,
//     reset: false,
//     front_lidar: false,
//     back_lidar: false,
//     front_bumper: false,
//     rear_bumper: false,
//     imu: false,
//   },
//   lastState: null,
//   missionAccum: {},
//   recordedStates: new Set(),
//   recordedFaults: new Set(),
//   activeMissions: {},
//   subscribed: false,
//   lastDataUpdate: null,
//   isDataStale: false,
//   isMissionActive: false,
// };

// const createReportStore = () => {
//   try {
//     const stored = localStorage.getItem(STORAGE_KEY);
//     if (stored) {
//       const parsed = JSON.parse(stored);
//       const recordedStates = parsed.recordedStates ? new Set(parsed.recordedStates) : new Set();
//       const recordedFaults = parsed.recordedFaults ? new Set(parsed.recordedFaults) : new Set();
//       const activeMissions = parsed.activeMissions ? { ...parsed.activeMissions } : {};

//       if (parsed.safetyReports) parsed.safetyReports = sanitizeSafetyArray(parsed.safetyReports);
//       if (parsed.allSafety) parsed.allSafety = sanitizeSafetyArray(parsed.allSafety);

//       return { ...defaultStore, ...parsed, recordedStates, recordedFaults, activeMissions };
//     }
//   } catch (e) {
//     console.error("Failed to load from localStorage:", e);
//   }
//   return {
//     ...defaultStore,
//     recordedStates: new Set(),
//     recordedFaults: new Set(),
//     activeMissions: {},
//   };
// };

// const persistSessionStore = (store) => {
//   try {
//     const toSave = {
//       ...store,
//       recordedStates: Array.from(store.recordedStates),
//       recordedFaults: Array.from(store.recordedFaults),
//       activeMissions: store.activeMissions,
//     };
//     localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
//   } catch (e) {
//     console.error("Failed to persist session store:", e);
//   }
// };

// let storeData = loadAllStores();
// let weeklyStore = storeData.weekly;
// let monthlyStore = storeData.monthly;
// let reportStore = createReportStore();

// const cappedAppend = (arr, item, max) => {
//   const n = [...arr, item];
//   return n.length > max ? n.slice(n.length - max) : n;
// };

// function pushToPersistentStores(bucket, event) {
//   const enriched = {
//     ...event,
//     dateKey: getDateKey(event.timestamp || new Date()),
//     storedAt: new Date().toISOString(),
//   };
//   weeklyStore[bucket] = [...weeklyStore[bucket], enriched];
//   monthlyStore[bucket] = [...monthlyStore[bucket], enriched];
//   const result = saveAndTrimStores(weeklyStore, monthlyStore);
//   weeklyStore = result.weekly;
//   monthlyStore = result.monthly;
// }

// // ═════════════════════════════════════════════════════════════════════════════
// // ICONS
// // ═════════════════════════════════════════════════════════════════════════════

// const IconTrash = ({ size = 20 }) => (
//   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
//     <polyline points="3 6 5 6 21 6" />
//     <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
//     <path d="M10 11v6M14 11v6M9 6V4h6v2" />
//   </svg>
// );
// const IconShield = ({ size = 20 }) => (
//   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//     <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
//   </svg>
// );
// const IconMission = ({ size = 20 }) => (
//   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//     <circle cx="12" cy="12" r="3" />
//     <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
//     <path d="M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12" />
//   </svg>
// );
// const IconCheckCircle = ({ size = 20 }) => (
//   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//     <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
//     <polyline points="22 4 12 14.01 9 11.01" />
//   </svg>
// );
// const IconRefresh = ({ size = 20 }) => (
//   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//     <path d="M23 4v6h-6" />
//     <path d="M1 20v-6h6" />
//     <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
//   </svg>
// );
// const IconArchive = ({ size = 20 }) => (
//   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//     <path d="M21 15V4a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v15m20-10H3m2-5h14v2H5z" />
//   </svg>
// );
// const IconX = ({ size = 24 }) => (
//   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
//     <line x1="18" y1="6" x2="6" y2="18" />
//     <line x1="6" y1="6" x2="18" y2="18" />
//   </svg>
// );

// // ═════════════════════════════════════════════════════════════════════════════
// // STATE COLORS
// // ═════════════════════════════════════════════════════════════════════════════

// const STATE_COLORS = {
//   IDLE: { bg: "bg-slate-100 dark:bg-slate-800", text: "text-slate-600 dark:text-slate-300", dot: "bg-slate-400" },
//   WAIT_FOR_START: { bg: "bg-amber-50 dark:bg-amber-950/30", text: "text-amber-700 dark:text-amber-400", dot: "bg-amber-400" },
//   DRIVE_TO_TAG: { bg: "bg-sky-50 dark:bg-sky-950/30", text: "text-sky-700 dark:text-sky-400", dot: "bg-sky-500" },
//   PAUSED: { bg: "bg-orange-50 dark:bg-orange-950/30", text: "text-orange-700 dark:text-orange-400", dot: "bg-orange-400" },
//   COMPLETE: { bg: "bg-green-50 dark:bg-green-950/30", text: "text-green-700 dark:text-green-400", dot: "bg-green-500" },
//   WATCHDOG_FAULT: { bg: "bg-red-50 dark:bg-red-950/30", text: "text-red-700 dark:text-red-400", dot: "bg-red-500" },
//   ABORTED: { bg: "bg-red-50 dark:bg-red-950/30", text: "text-red-700 dark:text-red-400", dot: "bg-red-400" },
//   TAG_MISS: { bg: "bg-fuchsia-50 dark:bg-fuchsia-950/30", text: "text-fuchsia-700 dark:text-fuchsia-400", dot: "bg-fuchsia-500" },
//   UNKNOWN: { bg: "bg-slate-100 dark:bg-slate-800", text: "text-slate-500 dark:text-slate-400", dot: "bg-slate-400" },
// };

// function getStateStyle(state) {
//   return STATE_COLORS[state] ?? STATE_COLORS.UNKNOWN;
// }

// // ═════════════════════════════════════════════════════════════════════════════
// // SUB-COMPONENTS
// // ═════════════════════════════════════════════════════════════════════════════

// function EmptyState({ label, sub }) {
//   return (
//     <div className="text-center py-16 px-4">
//       <div className="text-6xl mb-5">📭</div>
//       <p className="text-slate-500 dark:text-slate-400 font-bold text-base">{label}</p>
//       <p className="text-sm text-slate-400 mt-2">{sub}</p>
//     </div>
//   );
// }

// function StatChip({ label, val, color }) {
//   return (
//     <div className="text-center bg-white dark:bg-slate-900 rounded-xl border dark:border-slate-700 shadow-sm" style={{ padding: "12px 8px" }}>
//       <div className={`text-2xl font-black ${color}`}>{val}</div>
//       <div className="text-xs font-black uppercase tracking-wider text-slate-500 mt-1 leading-tight">{label}</div>
//     </div>
//   );
// }

// function ConfirmationModal({ isOpen, onClose, onConfirm, title, message, confirmText = "Yes, Clear All", cancelText = "Cancel" }) {
//   if (!isOpen) return null;
//   return (
//     <div
//       className="fixed inset-0 flex items-center justify-center z-[1000]"
//       style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
//       onClick={onClose}
//     >
//       <div
//         className="relative w-full max-w-md mx-4 rounded-2xl overflow-hidden"
//         style={{
//           background: "linear-gradient(160deg, #1e293b 0%, #0f172a 100%)",
//           border: "1px solid rgba(239,68,68,0.3)",
//           boxShadow: "0 25px 60px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.05)",
//         }}
//         onClick={(e) => e.stopPropagation()}
//       >
//         <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: "linear-gradient(90deg, transparent, #ef4444, transparent)" }} />
//         <div className="flex items-center justify-between px-6 pt-5 pb-3">
//           <div className="flex items-center gap-3">
//             <div className="p-2.5 rounded-xl" style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.25)" }}>
//               <IconTrash size={22} style={{ color: "#ef4444" }} />
//             </div>
//             <div className="text-white font-black text-lg tracking-wide">{title || "Clear Dashboard View"}</div>
//           </div>
//           <button onClick={onClose} className="p-1.5 rounded-lg transition hover:bg-white/10" aria-label="Close">
//             <IconX size={20} className="text-white/60" />
//           </button>
//         </div>
//         <div className="px-6 py-4">
//           <p className="text-slate-300 text-base leading-relaxed">{message}</p>
//           <div className="mt-4 p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.05)" }}>
//             <div className="grid grid-cols-3 gap-2 text-center">
//               <div>
//                 <div className="text-amber-400 font-black text-lg">{reportStore.allSafety.length}</div>
//                 <div className="text-slate-400 text-[10px] font-black uppercase tracking-wider">Safety</div>
//               </div>
//               <div>
//                 <div className="text-sky-400 font-black text-lg">{reportStore.allMission.length}</div>
//                 <div className="text-slate-400 text-[10px] font-black uppercase tracking-wider">Mission</div>
//               </div>
//               <div>
//                 <div className="text-emerald-400 font-black text-lg">{reportStore.allCompleted.length}</div>
//                 <div className="text-slate-400 text-[10px] font-black uppercase tracking-wider">Completed</div>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="px-6 pb-5 flex gap-3">
//           <button
//             onClick={onClose}
//             className="flex-1 py-2.5 rounded-xl font-black text-sm uppercase tracking-wider text-white/80 transition-all hover:bg-white/10 active:scale-95"
//             style={{ background: "rgba(255,255,255,0.08)" }}
//           >
//             {cancelText}
//           </button>
//           <button
//             onClick={onConfirm}
//             className="flex-1 py-2.5 rounded-xl font-black text-sm uppercase tracking-wider text-white transition-all active:scale-95"
//             style={{ background: "linear-gradient(135deg, #dc2626 0%, #ef4444 100%)" }}
//           >
//             {confirmText}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ═════════════════════════════════════════════════════════════════════════════
// // EXCEL STYLING
// // ═════════════════════════════════════════════════════════════════════════════

// const DARK_BLUE = "1F4E78";
// const LIGHT_BLUE = "D9E1F2";
// const WHITE = "FFFFFF";
// const GRAY_EVEN = "F2F2F2";
// const GREEN_FILL = "C6EFCE";
// const GREEN_FONT = "006100";
// const RED_FILL = "FFC7CE";
// const RED_FONT = "9C0006";

// const THIN_BORDER = {
//   top: { style: "thin", color: { argb: "FF000000" } },
//   left: { style: "thin", color: { argb: "FF000000" } },
//   bottom: { style: "thin", color: { argb: "FF000000" } },
//   right: { style: "thin", color: { argb: "FF000000" } },
// };

// function applyTitleStyle(cell) {
//   cell.font = { bold: true, size: 14, color: { argb: `FF${WHITE}` }, name: "Arial" };
//   cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: `FF${DARK_BLUE}` } };
//   cell.alignment = { horizontal: "center", vertical: "middle" };
//   cell.border = THIN_BORDER;
// }

// function applySubtitleStyle(cell) {
//   cell.font = { italic: true, size: 10, color: { argb: `FF${DARK_BLUE}` }, name: "Arial" };
//   cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: `FF${LIGHT_BLUE}` } };
//   cell.alignment = { horizontal: "center", vertical: "middle" };
//   cell.border = THIN_BORDER;
// }

// function applyHeaderStyle(cell) {
//   cell.font = { bold: true, size: 11, color: { argb: `FF${WHITE}` }, name: "Arial" };
//   cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: `FF${DARK_BLUE}` } };
//   cell.alignment = { horizontal: "center", vertical: "middle" };
//   cell.border = THIN_BORDER;
// }

// function applyDataStyle(cell, rowIdx, align = "left") {
//   const isEven = rowIdx % 2 === 0;
//   cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: isEven ? `FF${GRAY_EVEN}` : `FF${WHITE}` } };
//   cell.alignment = { horizontal: align, vertical: "middle" };
//   cell.border = THIN_BORDER;
//   cell.font = { name: "Arial", size: 10 };
// }

// function applyStatusStyle(cell, color) {
//   if (color === "GREEN") {
//     cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: `FF${GREEN_FILL}` } };
//     cell.font = { bold: true, size: 10, color: { argb: `FF${GREEN_FONT}` }, name: "Arial" };
//   } else {
//     cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: `FF${RED_FILL}` } };
//     cell.font = { bold: true, size: 10, color: { argb: `FF${RED_FONT}` }, name: "Arial" };
//   }
//   cell.alignment = { horizontal: "center", vertical: "middle" };
//   cell.border = THIN_BORDER;
// }

// async function downloadBuffer(wb, filename) {
//   const buffer = await wb.xlsx.writeBuffer();
//   const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
//   saveAs(blob, filename);
// }

// // ═════════════════════════════════════════════════════════════════════════════
// // WEEKLY REPORT GENERATOR
// // ═════════════════════════════════════════════════════════════════════════════


// const generateWeeklyReport = (safetyRows, missionRows, completedRows, startDate, endDate) => {
//   const wb = new ExcelJS.Workbook();
//   wb.creator = "Safety Dashboard";
//   wb.created = new Date();

//   // ── Cover sheet ──
//   const cover = wb.addWorksheet("Weekly Report Cover");
//   cover.columns = [{ width: 45 }, { width: 15 }, { width: 16 }, { width: 20 }, { width: 20 }, { width: 16 }, { width: 12 }];
//   let r = 1;

//   cover.mergeCells(`A${r}:G${r}`);
//   cover.getRow(r).height = 30;
//   const titleCell = cover.getCell(`A${r}`);
//   titleCell.value = "WEEKLY SAFETY & MISSION REPORT";
//   titleCell.font = { bold: true, size: 18, name: "Arial", color: { argb: `FF${WHITE}` } };
//   titleCell.alignment = { horizontal: "center", vertical: "middle" };
//   titleCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: `FF${DARK_BLUE}` } };
//   titleCell.border = THIN_BORDER;
//   r += 2;

//   [
//     [`Report Period: ${startDate} to ${endDate}`, 12, true],
//     [`Generated: ${new Date().toLocaleString()}`, 10, false],
//     [`Data source: Persistent across disconnects (30-day storage)`, 10, false],
//   ].forEach(([val, size, bold]) => {
//     cover.mergeCells(`A${r}:G${r}`);
//     cover.getRow(r).height = 20;
//     const c = cover.getCell(`A${r}`);
//     c.value = val;
//     c.font = { size, name: "Arial", bold, italic: !bold };
//     c.alignment = { horizontal: "center" };
//     r++;
//   });
//   r++;

//   cover.mergeCells(`A${r}:G${r}`);
//   cover.getRow(r).height = 25;
//   const es = cover.getCell(`A${r}`);
//   es.value = "EXECUTIVE SUMMARY";
//   es.font = { bold: true, size: 13, name: "Arial", color: { argb: `FF${WHITE}` } };
//   es.alignment = { horizontal: "center", vertical: "middle" };
//   es.fill = { type: "pattern", pattern: "solid", fgColor: { argb: `FF${DARK_BLUE}` } };
//   es.border = THIN_BORDER;
//   r++;

//   const watchdogCount = missionRows.filter((x) => x.state === "WATCHDOG_FAULT").length;
//   const imuFaultCount = safetyRows.filter((x) => x.signal === "imu" && x.statusColor === "red").length;
//   const bumperFaultCount = safetyRows.filter(
//     (x) => (x.signal === "front_bumper" || x.signal === "rear_bumper") && x.statusColor === "red"
//   ).length;
//   const motorFaultCount = safetyRows.filter(
//     (x) => (x.signal || "").startsWith("motor_") && x.statusColor === "red"
//   ).length;

//   const safetyByDate = {};
//   safetyRows.forEach((r2) => {
//     const dk = r2.dateKey || getDateKey();
//     safetyByDate[dk] = (safetyByDate[dk] || 0) + 1;
//   });
//   const missionByDate = {};
//   missionRows.forEach((r2) => {
//     const dk = r2.dateKey || getDateKey();
//     missionByDate[dk] = (missionByDate[dk] || 0) + 1;
//   });

//   [
//     ["Metric", "Value"],
//     ["Total Safety Events (this week)", safetyRows.length],
//     ["Total Mission Events (this week)", missionRows.length],
//     ["Total Completed Missions (this week)", completedRows.length],
//     ["Watchdog Faults", watchdogCount],
//     ["IMU Faults", imuFaultCount],
//     ["Bumper Faults", bumperFaultCount],
//     ["Motor Faults", motorFaultCount],
//     ["Days with Safety Activity", Object.keys(safetyByDate).length],
//     ["Days with Mission Activity", Object.keys(missionByDate).length],
//   ].forEach((row, idx) => {
//     cover.getRow(r).height = 20;
//     row.forEach((val, ci) => {
//       const c = cover.getCell(r, ci + 1);
//       c.value = val;
//       c.border = THIN_BORDER;
//       if (idx === 0) {
//         c.font = { bold: true, size: 11, name: "Arial" };
//         c.fill = { type: "pattern", pattern: "solid", fgColor: { argb: `FF${LIGHT_BLUE}` } };
//         c.alignment = { horizontal: ci === 0 ? "left" : "center", vertical: "middle" };
//       } else {
//         c.font = { name: "Arial", size: 10 };
//         c.alignment = { horizontal: ci === 0 ? "left" : "center", vertical: "middle" };
//       }
//     });
//     r++;
//   });

//   // ── Safety Events sheet ──
//   const ilSheet = wb.addWorksheet("Safety Events");
//   ilSheet.columns = [{ width: 5 }, { width: 12 }, { width: 22 }, { width: 20 }, { width: 12 }, { width: 25 }];
//   ilSheet.mergeCells("A1:F1");
//   ilSheet.getRow(1).height = 28;
//   const ilT = ilSheet.getCell("A1");
//   ilT.value = "SAFETY EVENTS — WEEKLY REPORT";
//   applyTitleStyle(ilT);
//   ilSheet.mergeCells("A2:F2");
//   ilSheet.getRow(2).height = 18;
//   const ilS = ilSheet.getCell("A2");
//   ilS.value = `Period: ${startDate} to ${endDate} | Generated: ${new Date().toLocaleString()}`;
//   applySubtitleStyle(ilS);
//   ilSheet.getRow(4).height = 22;
//   ["No.", "Date", "Timestamp", "Device", "Status", "Health"].forEach((h, i) => {
//     const c = ilSheet.getCell(4, i + 1);
//     c.value = h;
//     applyHeaderStyle(c);
//   });
//   safetyRows.forEach((row2, idx) => {
//     const rn = 5 + idx;
//     ilSheet.getRow(rn).height = 20;
//     [[idx + 1, "center"], [row2.dateKey || "—", "center"], [row2.timestampFormatted || "—", "left"], [row2.signalLabel || "—", "left"]].forEach(
//       ([v, a], ci) => {
//         const c = ilSheet.getCell(rn, ci + 1);
//         c.value = v;
//         applyDataStyle(c, idx, a);
//       }
//     );
//     const st = ilSheet.getCell(rn, 5);
//     st.value = row2.statusColor?.toUpperCase() || "—";
//     applyStatusStyle(st, st.value);
//     const hl = ilSheet.getCell(rn, 6);
//     hl.value = sanitizeStatus(row2.status) || "—";
//     applyDataStyle(hl, idx, "left");
//   });

//   // ── Mission Events sheet ──
//   const msSheet = wb.addWorksheet("Mission Events");
//   msSheet.columns = [
//     { width: 5 },
//     { width: 12 },
//     { width: 22 },
//     { width: 21 },
//     { width: 8 },
//     { width: 10 },
//     { width: 10 },
//     { width: 12 },
//     { width: 15 },
//     { width: 22 },
//   ];
//   msSheet.mergeCells("A1:J1");
//   msSheet.getRow(1).height = 28;
//   const msT = msSheet.getCell("A1");
//   msT.value = "MISSION EVENTS (STEP-BY-STEP) — WEEKLY REPORT";
//   applyTitleStyle(msT);
//   msSheet.mergeCells("A2:J2");
//   msSheet.getRow(2).height = 18;
//   const msS = msSheet.getCell("A2");
//   msS.value = `Period: ${startDate} to ${endDate} | Generated: ${new Date().toLocaleString()}`;
//   applySubtitleStyle(msS);
//   msSheet.getRow(4).height = 22;
//   ["No.", "Date", "Timestamp", "State", "Step", "Tag", "Target", "Speed (m/s)", "Missed Tag", "Mission File"].forEach((h, i) => {
//     const c = msSheet.getCell(4, i + 1);
//     c.value = h;
//     applyHeaderStyle(c);
//   });
//   missionRows.forEach((row2, idx) => {
//     const rn = 5 + idx;
//     msSheet.getRow(rn).height = 20;
//     [
//       [idx + 1, "center"],
//       [row2.dateKey || "—", "center"],
//       [row2.timestampFormatted || "—", "left"],
//       [row2.state || "—", "left"],
//       [row2.step || "—", "center"],
//       [row2.currentTag || "—", "center"],
//       [row2.targetTag || "—", "center"],
//       [row2.speed ?? "—", "center"],
//       [row2.missedTag != null ? `${row2.missedTag}` : "—", "center"],
//       [row2.missionFile || "—", "left"],
//     ].forEach(([v, a], ci) => {
//       const c = msSheet.getCell(rn, ci + 1);
//       c.value = v;
//       applyDataStyle(c, idx, a);
//     });
//   });

//   // ── Completed Missions sheet ──
//   const cmSheet = wb.addWorksheet("Completed Missions");
//   cmSheet.columns = [{ width: 5 }, { width: 12 }, { width: 22 }, { width: 22 }, { width: 10 }, { width: 14 }, { width: 10 }];
//   cmSheet.mergeCells("A1:G1");
//   cmSheet.getRow(1).height = 28;
//   const cmT = cmSheet.getCell("A1");
//   cmT.value = "COMPLETED MISSIONS — WEEKLY REPORT";
//   applyTitleStyle(cmT);
//   cmSheet.mergeCells("A2:G2");
//   cmSheet.getRow(2).height = 18;
//   const cmS = cmSheet.getCell("A2");
//   cmS.value = `Period: ${startDate} to ${endDate} | Generated: ${new Date().toLocaleString()}`;
//   applySubtitleStyle(cmS);
//   cmSheet.getRow(4).height = 22;
//   ["No.", "Date", "Completed At", "Mission File", "Steps", "Duration", "Loop"].forEach((h, i) => {
//     const c = cmSheet.getCell(4, i + 1);
//     c.value = h;
//     applyHeaderStyle(c);
//   });
//   completedRows.forEach((row2, idx) => {
//     const rn = 5 + idx;
//     cmSheet.getRow(rn).height = 20;
//     [
//       [idx + 1, "center"],
//       [row2.dateKey || "—", "center"],
//       [row2.timestampFormatted || "—", "left"],
//       [row2.missionFile || "—", "left"],
//       [row2.totalSteps || 0, "center"],
//       [row2.durationFormatted || "—", "left"],
//       [row2.loop ? "ON" : "OFF", "center"],
//     ].forEach(([v, a], ci) => {
//       const c = cmSheet.getCell(rn, ci + 1);
//       c.value = v;
//       applyDataStyle(c, idx, a);
//     });
//   });

//   return wb;
// };

// // ═════════════════════════════════════════════════════════════════════════════
// // TABLE STYLES
// // ═════════════════════════════════════════════════════════════════════════════

// const tableContainerStyle = {
//   maxHeight: "500px",
//   overflowY: "auto",
//   overflowX: "auto",
//   border: "1px solid #e2e8f0",
//   borderRadius: "0.5rem",
//   backgroundColor: "transparent",
// };
// const darkTableContainerStyle = { ...tableContainerStyle, border: "1px solid #1e293b" };
// const tableHeaderStickyStyle = { position: "sticky", top: 0, zIndex: 10 };

// // ═════════════════════════════════════════════════════════════════════════════
// // MAIN COMPONENT
// // ═════════════════════════════════════════════════════════════════════════════

// export default function Reports() {
//   const { t } = useLanguage();
//   const { connected, subscribe } = useROS();

//   const tRef = useRef(t);
//   useEffect(() => {
//     tRef.current = t;
//   });

//   const imuTimeoutRef = useRef(null);
//   const staleCheckRef = useRef(null);
//   // Tracks per-motor-fault-bit active/inactive state so we only log a
//   // Safety Event when a bit actually transitions, not on every message.
//   const motorFaultStateRef = useRef({});

//   const [activeTab, setActiveTab] = useState("interlock");
//   const [safetyReports, setSafetyReports] = useState(reportStore.safetyReports);
//   const [missionReports, setMissionReports] = useState(reportStore.missionReports);
//   const [completedMissions, setCompletedMissions] = useState(reportStore.completedMissions);
//   const [tagMissCount, setTagMissCount] = useState(reportStore.tagMissCount);
//   const [plcSignals, setPlcSignals] = useState(reportStore.plcSignals);
//   const [isDataStale, setIsDataStale] = useState(reportStore.isDataStale);
//   const [isMissionActive, setIsMissionActive] = useState(reportStore.isMissionActive);
//   const [showConfirmModal, setShowConfirmModal] = useState(false);
//   const [archivedReports, setArchivedReports] = useState(loadArchive());

//   const [weeklyCountSafety, setWeeklyCountSafety] = useState(0);
//   const [weeklyCountMission, setWeeklyCountMission] = useState(0);
//   const [weeklyCountCompleted, setWeeklyCountCompleted] = useState(0);

//   const isDark = () => document.documentElement.classList.contains("dark");

//   // ─── weekly counts ───
//   const refreshWeeklyCounts = useCallback(() => {
//     const wk = getThisWeeksData(weeklyStore);
//     setWeeklyCountSafety(wk.safety.length);
//     setWeeklyCountMission(wk.mission.length);
//     setWeeklyCountCompleted(wk.completed.length);
//   }, []);

//   useEffect(() => {
//     refreshWeeklyCounts();
//   }, [refreshWeeklyCounts]);

//   // ─── sync from module-level store ───
//   const syncStateFromStore = useCallback(() => {
//     setSafetyReports([...reportStore.safetyReports]);
//     setMissionReports([...reportStore.missionReports]);
//     setCompletedMissions([...reportStore.completedMissions]);
//     setTagMissCount(reportStore.tagMissCount);
//     setPlcSignals({ ...reportStore.plcSignals });
//     setIsDataStale(reportStore.isDataStale);
//     setIsMissionActive(reportStore.isMissionActive);
//     refreshWeeklyCounts();
//   }, [refreshWeeklyCounts]);

//   useEffect(() => {
//     syncStateFromStore();
//   }, [syncStateFromStore]);

//   // ─── REAL-TIME EVENT LISTENERS (replaces polling interval) ───
//   useEffect(() => {
//     const unsubscribeSafety = reportEmitter.on("safetyReportAdded", (newReport) => {
//       setSafetyReports((prev) => {
//         const updated = [...prev, newReport];
//         return updated.length > MAX_DISPLAY ? updated.slice(-MAX_DISPLAY) : updated;
//       });
//       refreshWeeklyCounts();
//     });

//     const unsubscribeMission = reportEmitter.on("missionReportAdded", (newReport) => {
//       setMissionReports((prev) => {
//         const updated = [...prev, newReport];
//         return updated.length > MAX_DISPLAY ? updated.slice(-MAX_DISPLAY) : updated;
//       });
//       refreshWeeklyCounts();
//     });

//     const unsubscribeCompleted = reportEmitter.on("completedMissionAdded", (newReport) => {
//       setCompletedMissions((prev) => {
//         const updated = [...prev, newReport];
//         return updated.length > MAX_DISPLAY ? updated.slice(-MAX_DISPLAY) : updated;
//       });
//       refreshWeeklyCounts();
//     });

//     return () => {
//       unsubscribeSafety?.();
//       unsubscribeMission?.();
//       unsubscribeCompleted?.();
//     };
//   }, [refreshWeeklyCounts]);

//   useEffect(() => {
//     const onVisibility = () => {
//       if (!document.hidden) syncStateFromStore();
//     };
//     document.addEventListener("visibilitychange", onVisibility);
//     return () => document.removeEventListener("visibilitychange", onVisibility);
//   }, [syncStateFromStore]);

//   // ─────────────────────────────────────────────────────────────────────────
//   // HELPERS
//   // ─────────────────────────────────────────────────────────────────────────

//   const RED_WHEN_TRUE = ["work_over", "reset", "front_estop", "back_estop"];
//   const INVERTED_LOGIC = ["front_bumper", "rear_bumper"];

//   const getHealthStatus = (name, value) => {
//     if (INVERTED_LOGIC.includes(name)) return value ? t("report.val_healthy") : "Fault Triggered";
//     const isRed = RED_WHEN_TRUE.includes(name) ? value : !value;
//     return isRed ? "Fault Triggered" : t("report.val_healthy");
//   };

//   const getDisplayValue = (name, value) => {
//     if (INVERTED_LOGIC.includes(name)) return !value;
//     if (["front_lidar", "back_lidar"].includes(name)) return !value;
//     return value;
//   };

//   const markDataFresh = () => {
//     reportStore.lastDataUpdate = Date.now();
//     reportStore.isDataStale = false;
//     setIsDataStale(false);
//     clearTimeout(staleCheckRef.current);
//     staleCheckRef.current = setTimeout(() => {
//       reportStore.isDataStale = true;
//       setIsDataStale(true);
//       persistSessionStore(reportStore);
//     }, 30000);
//   };

//   // ─── auto-archive ───
//   const autoArchiveWeeklyReport = useCallback(() => {
//     const wkData = getThisWeeksData(weeklyStore);
//     if (!wkData.safety.length && !wkData.mission.length && !wkData.completed.length) return;
//     const now = new Date();
//     const wkNum = Math.ceil((now - new Date(now.getFullYear(), 0, 1)) / (7 * 24 * 60 * 60 * 1000));
//     const { sow, eow } = getWeekBounds();
//     addToArchive(wkData, wkNum, now.getFullYear(), sow.toLocaleDateString(), eow.toLocaleDateString());
//     setArchivedReports(loadArchive());
//   }, []);

//   // ─────────────────────────────────────────────────────────────────────────
//   // MESSAGE HANDLERS
//   // ─────────────────────────────────────────────────────────────────────────

//   const recordMissionStep = (activeMission, missionId, isStateChange = false) => {
//     const timestamp = new Date();
//     const stepEvent = {
//       id: `${missionId}-step-${timestamp.getTime()}-${Math.random()}`,
//       missionId,
//       timestamp,
//       timestampFormatted: timestamp.toLocaleString(),
//       timestampISO: timestamp.toISOString(),
//       dateKey: getDateKey(timestamp),
//       state: activeMission.state || "UNKNOWN",
//       step: activeMission.step || 0,
//       totalSteps: activeMission.totalSteps || 0,
//       currentTag: activeMission.currentTag || "—",
//       targetTag: activeMission.targetTag || "—",
//       action: activeMission.action || "—",
//       speed: activeMission.speed || "0.00",
//       distanceTraveled: activeMission.distanceTraveled || "0.00",
//       safetyActive: activeMission.safetyActive || false,
//       loop: activeMission.loop || false,
//       missionFile: activeMission.missionFile || "—",
//       missedTag: activeMission.missedTag || null,
//       lastSeenTag: activeMission.lastSeenTag || null,
//       distanceTraveledAtFault: activeMission.distanceTraveledAtFault || null,
//       eventType: isStateChange ? "STATE_CHANGE" : "STEP_UPDATE",
//     };
//     reportStore.missionReports = cappedAppend(reportStore.missionReports, stepEvent, MAX_DISPLAY);
//     reportStore.allMission = [...reportStore.allMission, stepEvent];
//     setMissionReports([...reportStore.missionReports]);

//     // EMIT EVENT FOR REAL-TIME UPDATE
//     reportEmitter.emit("missionReportAdded", stepEvent);

//     pushToPersistentStores("mission", stepEvent);
//     refreshWeeklyCounts();
//     return stepEvent;
//   };

//   const handlePlcMsg = useRef((name, msg) => {
//     const newValue = msg.data;
//     const prev = reportStore.plcSignals[name];
//     if (prev === newValue) return;

//     reportStore.plcSignals = { ...reportStore.plcSignals, [name]: newValue };
//     setPlcSignals({ ...reportStore.plcSignals });

//     const timestamp = new Date();
//     const healthStatus = getHealthStatus(name, newValue);

//     let statusColor;
//     if (INVERTED_LOGIC.includes(name)) statusColor = newValue ? "green" : "red";
//     else if (RED_WHEN_TRUE.includes(name)) statusColor = newValue ? "red" : "green";
//     else statusColor = newValue ? "green" : "red";

//     const signalLabel = tRef.current(`health.${name}`) || name.replace(/_/g, " ").toUpperCase();

//     const ev = {
//       id: `${timestamp.getTime()}-${Math.random()}`,
//       signal: name,
//       signalLabel,
//       value: newValue,
//       displayValue: getDisplayValue(name, newValue),
//       status: healthStatus,
//       statusColor,
//       timestamp,
//       timestampFormatted: timestamp.toLocaleString(),
//       timestampISO: timestamp.toISOString(),
//       dateKey: getDateKey(timestamp),
//     };

//     reportStore.safetyReports = cappedAppend(reportStore.safetyReports, ev, MAX_DISPLAY);
//     reportStore.allSafety = [...reportStore.allSafety, ev];

//     // EMIT EVENT FOR REAL-TIME UPDATE
//     reportEmitter.emit("safetyReportAdded", ev);

//     pushToPersistentStores("safety", ev);
//     refreshWeeklyCounts();
//     markDataFresh();
//     persistSessionStore(reportStore);
//   });

//   // ── Motor diagnostics → Safety Events ──────────────────────────────────
//   // Same topic the dashboard motor cards and Header bell use. Every fault
//   // bit is tracked independently per motor so we log exactly one event when
//   // a bit switches on (red / "Fault Triggered") and one when it switches
//   // back off (green / healthy) — same pattern as the PLC bumper/lidar
//   // signals above, just applied per-bitmask-bit instead of per-topic.
//   const handleMotorMsg = useRef((msg) => {
//     const { left, right } = parseMotorErrorValues(msg.data);
//     const timestamp = new Date();
//     let anyChange = false;

//     [{ side: "Left", err: left }, { side: "Right", err: right }].forEach(({ side, err }) => {
//       const activeFaults = getActiveMotorFaults(err);
//       const activeKeys = new Set(
//         activeFaults.map(({ code }) => `motor_${side.toLowerCase()}_${code}`)
//       );

//       // Build the full candidate list: every known code PLUS any unknown
//       // bit(s) currently active for this motor (so unknown faults get
//       // logged and later cleared, same as known ones).
//       const knownEntries = Object.entries(MOTOR_ERROR_CODES).map(([codeStr, label]) => ({
//         code: Number(codeStr),
//         label,
//       }));
//       const unknownEntries = activeFaults.filter(
//         (f) => !MOTOR_ERROR_CODES[f.code]
//       );
//       const candidates = [...knownEntries, ...unknownEntries];

//       candidates.forEach(({ code, label }) => {
//         const key = `motor_${side.toLowerCase()}_${code}`;
//         const isActive = activeKeys.has(key);
//         const wasActive = motorFaultStateRef.current[key] || false;

//         if (isActive === wasActive) return; // no transition, nothing to log
//         motorFaultStateRef.current[key] = isActive;
//         anyChange = true;

//         const signalLabel = `${side} Motor: ${label}`;
//         const statusColor = isActive ? "red" : "green";
//         const status = isActive ? "Fault Triggered" : tRef.current("report.val_healthy");

//         const ev = {
//           id: `${timestamp.getTime()}-${Math.random()}`,
//           signal: key,
//           signalLabel,
//           value: isActive,
//           displayValue: isActive,
//           status,
//           statusColor,
//           timestamp,
//           timestampFormatted: timestamp.toLocaleString(),
//           timestampISO: timestamp.toISOString(),
//           dateKey: getDateKey(timestamp),
//         };

//         reportStore.safetyReports = cappedAppend(reportStore.safetyReports, ev, MAX_DISPLAY);
//         reportStore.allSafety = [...reportStore.allSafety, ev];

//         // EMIT EVENT FOR REAL-TIME UPDATE
//         reportEmitter.emit("safetyReportAdded", ev);

//         pushToPersistentStores("safety", ev);
//       });
//     });

//     if (anyChange) {
//       refreshWeeklyCounts();
//       markDataFresh();
//       persistSessionStore(reportStore);
//     }
//   });

//   const handleImuMsg = useRef((_msg) => {
//     reportStore.plcSignals = { ...reportStore.plcSignals, imu: true };
//     setPlcSignals({ ...reportStore.plcSignals });
//     markDataFresh();

//     clearTimeout(imuTimeoutRef.current);
//     imuTimeoutRef.current = setTimeout(() => {
//       reportStore.plcSignals = { ...reportStore.plcSignals, imu: false };
//       setPlcSignals({ ...reportStore.plcSignals });

//       const ft = new Date();
//       const faultEv = {
//         id: `${ft.getTime()}-${Math.random()}`,
//         signal: "imu",
//         signalLabel: "IMU Sensor",
//         value: false,
//         displayValue: false,
//         status: "Fault Triggered",
//         statusColor: "red",
//         timestamp: ft,
//         timestampFormatted: ft.toLocaleString(),
//         timestampISO: ft.toISOString(),
//         dateKey: getDateKey(ft),
//       };
//       reportStore.safetyReports = cappedAppend(reportStore.safetyReports, faultEv, MAX_DISPLAY);
//       reportStore.allSafety = [...reportStore.allSafety, faultEv];

//       // EMIT EVENT FOR REAL-TIME UPDATE
//       reportEmitter.emit("safetyReportAdded", faultEv);

//       pushToPersistentStores("safety", faultEv);
//       refreshWeeklyCounts();
//       markDataFresh();
//       persistSessionStore(reportStore);
//     }, IMU_TIMEOUT_MS);
//   });

//   // ─── helper: apply missed-tag fields onto an active mission entry ───
//   const applyMissedTagToMission = (activeMission, w) => {
//     const missedTagNum = w.missed_tag ?? w.missedTag ?? w.expected_tag ?? w.target_tag ?? "?";
//     const lastSeen = w.last_seen_tag ?? w.lastSeenTag ?? w.current_tag ?? w.tag ?? "?";
//     const distM = (((w.distance_traveled ?? w.distanceTraveled ?? w.distance ?? 0)) / 1000).toFixed(2);
//     activeMission.missedTag = missedTagNum;
//     activeMission.lastSeenTag = lastSeen;
//     activeMission.distanceTraveledAtFault = distM;
//     activeMission.state = "WATCHDOG_FAULT";
//     reportStore.tagMissCount = (reportStore.tagMissCount || 0) + 1;
//     setTagMissCount(reportStore.tagMissCount);
//   };

//   const handleWatchdogMsg = useRef((msg) => {
//     if (!reportStore.isMissionActive) return;
//     try {
//       const w = JSON.parse(msg.data);
//       const isFault = w.fault === true || w.error === true || w.status === "fault" || w.status === "error";
//       if (!isFault) return;

//       const timestamp = new Date();
//       const missedTag = w.missed_tag ?? w.missedTag ?? w.expected_tag ?? w.target_tag ?? "?";
//       const faultKey = `${missedTag}-${w.distance_traveled ?? 0}-${timestamp.getTime()}`;
//       if (reportStore.recordedFaults.has(faultKey)) return;
//       reportStore.recordedFaults.add(faultKey);

//       const missionId = reportStore.currentMission?.mission_id || reportStore.currentMission?.mission_file || `mission-${Date.now()}`;
//       if (reportStore.activeMissions[missionId]) {
//         const am = reportStore.activeMissions[missionId];
//         applyMissedTagToMission(am, w);
//         recordMissionStep(am, missionId, true);
//       }
//       markDataFresh();
//       persistSessionStore(reportStore);
//     } catch (_) { }
//   });

//   const handleMissionMsg = useRef((msg) => {
//     try {
//       const s = JSON.parse(msg.data);
//       reportStore.currentMission = s;

//       const isStarting = s.state === "WAIT_FOR_START" || s.state === "DRIVE_TO_TAG" || s.state === "PAUSED";

//       if (isStarting && !reportStore.isMissionActive) {
//         reportStore.isMissionActive = true;
//         setIsMissionActive(true);
//         reportStore.missionReports = [];
//         reportStore.allMission = [];
//         reportStore.recordedFaults.clear();
//         reportStore.recordedStates.clear();
//         reportStore.activeMissions = {};
//         reportStore.tagMissCount = 0;
//         reportStore.lastState = null;
//         reportStore.missionAccum = {};
//         setMissionReports([]);
//         setTagMissCount(0);
//         persistSessionStore(reportStore);
//       }

//       if (s.state === "IDLE") {
//         if (reportStore.isMissionActive) {
//           reportStore.isMissionActive = false;
//           setIsMissionActive(false);
//           reportStore.recordedStates.clear();
//           reportStore.activeMissions = {};
//           persistSessionStore(reportStore);
//         }
//         markDataFresh();
//         persistSessionStore(reportStore);
//         return;
//       }

//       if (!reportStore.isMissionActive) {
//         markDataFresh();
//         persistSessionStore(reportStore);
//         return;
//       }

//       const missionId = s.mission_id || s.mission_file || `mission-${Date.now()}`;
//       const timestamp = new Date();

//       // if (reportStore.activeMissions[missionId]) {
//       //   const ex = reportStore.activeMissions[missionId];
//       //   const stepChanged = ex.step !== (s.step ?? ex.step);
//       //   const distChanged = Math.abs(parseFloat(ex.distanceTraveled || 0) - parseFloat((s.distance_traveled ?? 0) / 1000)) > 0.1;
//       //   const stateChanged = ex.state !== s.state;

//       //   ex.state = s.state ?? ex.state;
//       //   ex.step = s.step ?? ex.step;
//       //   ex.totalSteps = s.total_steps ?? ex.totalSteps;
//       //   ex.currentTag = s.tag ?? ex.currentTag;
//       //   ex.targetTag = s.target_tag ?? ex.targetTag;
//       //   ex.action = s.action ?? ex.action;
//       //   ex.speed = (s.speed ?? 0).toFixed(2);
//       //   ex.distanceTraveled = (((s.distance_traveled ?? 0) / 1000)).toFixed(2);
//       //   ex.safetyActive = s.safety_active === true || s.safety_active === "true";
//       //   ex.loop = s.loop ?? ex.loop;
//       //   ex.timestampFormatted = timestamp.toLocaleString();
//       //   ex.timestampISO = timestamp.toISOString();

//       //   if (s.state === "WATCHDOG_FAULT" && stateChanged) {
//       //     const faultKey = `${missionId}-${s.target_tag}-${s.distance_traveled ?? 0}`;
//       //     if (!reportStore.recordedFaults.has(faultKey)) {
//       //       reportStore.recordedFaults.add(faultKey);
//       //       applyMissedTagToMission(ex, {
//       //         missed_tag: s.target_tag,
//       //         last_seen_tag: s.tag,
//       //         distance_traveled: s.distance_traveled ?? 0,
//       //       });
//       //     }
//       //   }

//       //   if (stepChanged || distChanged || stateChanged) recordMissionStep(ex, missionId, stateChanged);
//       // }


// //fixed bug of watchdog fault, now it will appear only once where the tag ,issed and that tag number will come once in watchdog fault, 

//   if (reportStore.activeMissions[missionId]) {
//   const ex = reportStore.activeMissions[missionId];
//   const stepChanged = ex.step !== (s.step ?? ex.step);
//   const distChanged = Math.abs(parseFloat(ex.distanceTraveled || 0) - parseFloat((s.distance_traveled ?? 0) / 1000)) > 0.1;
//   const stateChanged = ex.state !== s.state;

//   ex.state = s.state ?? ex.state;
//   ex.step = s.step ?? ex.step;
//   ex.totalSteps = s.total_steps ?? ex.totalSteps;
//   ex.currentTag = s.tag ?? ex.currentTag;
//   ex.targetTag = s.target_tag ?? ex.targetTag;
//   ex.action = s.action ?? ex.action;
//   ex.speed = (s.speed ?? 0).toFixed(2);
//   ex.distanceTraveled = (((s.distance_traveled ?? 0) / 1000)).toFixed(2);
//   ex.safetyActive = s.safety_active === true || s.safety_active === "true";
//   ex.loop = s.loop ?? ex.loop;
//   ex.timestampFormatted = timestamp.toLocaleString();
//   ex.timestampISO = timestamp.toISOString();

//   if (s.state === "WATCHDOG_FAULT" && stateChanged) {
//     const faultKey = `${missionId}-${s.target_tag}-${s.distance_traveled ?? 0}`;
//     if (!reportStore.recordedFaults.has(faultKey)) {
//       reportStore.recordedFaults.add(faultKey);
//       applyMissedTagToMission(ex, {
//         missed_tag: s.target_tag,
//         last_seen_tag: s.tag,
//         distance_traveled: s.distance_traveled ?? 0,
//       });
//     }
//   } else if (stateChanged && ex.missedTag != null) {
//     // Robot has moved on from the watchdog fault (e.g. resumed driving,
//     // completed, or aborted) — the missed-tag info is now stale and must
//     // not keep showing up on every future step row.
//     ex.missedTag = null;
//     ex.lastSeenTag = null;
//     ex.distanceTraveledAtFault = null;
//   }

//   if (stepChanged || distChanged || stateChanged) recordMissionStep(ex, missionId, stateChanged);
// }
//       else {
//         const ev = {
//           id: `${missionId}-${timestamp.getTime()}`,
//           missionId,
//           timestamp,
//           timestampFormatted: timestamp.toLocaleString(),
//           timestampISO: timestamp.toISOString(),
//           dateKey: getDateKey(timestamp),
//           state: s.state ?? "UNKNOWN",
//           missionFile: s.mission_file ?? "—",
//           step: s.step ?? 0,
//           totalSteps: s.total_steps ?? 0,
//           targetTag: s.target_tag ?? "—",
//           currentTag: s.tag ?? "—",
//           action: s.action ?? "—",
//           speed: (s.speed ?? 0).toFixed(2),
//           distanceTraveled: (((s.distance_traveled ?? 0) / 1000)).toFixed(2),
//           safetyActive: s.safety_active === true || s.safety_active === "true",
//           loop: s.loop ?? false,
//           missedTag: null,
//           lastSeenTag: null,
//           persistedOnce: false,
//         };

//         if (s.state === "WATCHDOG_FAULT") {
//           applyMissedTagToMission(ev, {
//             missed_tag: s.target_tag,
//             last_seen_tag: s.tag,
//             distance_traveled: s.distance_traveled ?? 0,
//           });
//         }

//         reportStore.activeMissions[missionId] = ev;
//         reportStore.missionReports = cappedAppend(reportStore.missionReports, ev, MAX_DISPLAY);
//         reportStore.allMission = [...reportStore.allMission, ev];
//         setMissionReports([...reportStore.missionReports]);

//         // EMIT EVENT FOR REAL-TIME UPDATE
//         reportEmitter.emit("missionReportAdded", ev);

//         pushToPersistentStores("mission", ev);
//         refreshWeeklyCounts();
//       }

//       if (s.state === "COMPLETE") {
//         const cm = reportStore.activeMissions[missionId];
//         if (!cm) {
//           console.warn("COMPLETE but no active mission!");
//           return;
//         }

//         const endTime = new Date();
//         const startTime = cm.timestamp || new Date();
//         const duration = Math.round((endTime - startTime) / 1000);

//         const ce = {
//           id: `${missionId}-completed-${endTime.getTime()}`,
//           missionId,
//           timestamp: endTime,
//           startTime,
//           timestampFormatted: endTime.toLocaleString(),
//           timestampISO: endTime.toISOString(),
//           dateKey: getDateKey(endTime),
//           missionFile: cm.missionFile ?? "—",
//           totalSteps: cm.totalSteps ?? 0,
//           currentTag: cm.currentTag ?? "—",
//           targetTag: cm.targetTag ?? "—",
//           distanceTraveled: cm.distanceTraveled ?? "—",
//           loop: cm.loop ?? false,
//           durationSec: duration,
//           durationFormatted:
//             duration >= 60 ? `${Math.floor(duration / 60)}m ${duration % 60}s` : `${duration}s`,
//           finalState: s.state,
//           finalStep: cm.step ?? 0,
//           finalSpeed: cm.speed ?? "0.00",
//           safetyWasActive: cm.safetyActive ?? false,
//         };

//         reportStore.completedMissions = cappedAppend(reportStore.completedMissions, ce, MAX_DISPLAY);
//         reportStore.allCompleted = [...reportStore.allCompleted, ce];
//         setCompletedMissions([...reportStore.completedMissions]);

//         // EMIT EVENT FOR REAL-TIME UPDATE
//         reportEmitter.emit("completedMissionAdded", ce);

//         pushToPersistentStores("completed", ce);
//         refreshWeeklyCounts();

//         delete reportStore.activeMissions[missionId];
//         reportStore.isMissionActive = false;
//         setIsMissionActive(false);
//         reportStore.recordedStates.clear();
//         markDataFresh();
//         persistSessionStore(reportStore);
//       }

//       if (s.state === "ABORTED") {
//         delete reportStore.activeMissions[missionId];
//         reportStore.isMissionActive = false;
//         setIsMissionActive(false);
//         reportStore.recordedStates.clear();
//         markDataFresh();
//         persistSessionStore(reportStore);
//       }

//       markDataFresh();
//       persistSessionStore(reportStore);
//     } catch (e) {
//       console.error("handleMissionMsg error:", e);
//     }
//   });

//   // ─── subscriptions ───
//   useEffect(() => {
//     if (!connected) {
//       if (reportStore.subscribed) {
//         reportStore.unsubscribers?.forEach((u) => u?.());
//         reportStore.unsubscribers = [];
//         reportStore.subscribed = false;
//         clearTimeout(imuTimeoutRef.current);
//         clearTimeout(staleCheckRef.current);
//       }
//       // Motor fault bit tracking is transient — reset so a fresh reconnect
//       // starts from a clean "all clear" baseline instead of stale state.
//       motorFaultStateRef.current = {};
//       return;
//     }
//     if (reportStore.subscribed) return;
//     reportStore.subscribed = true;
//     reportStore.unsubscribers = [];

//     reportStore.unsubscribers.push(
//       subscribe("/mission/status", "std_msgs/String", (msg) => handleMissionMsg.current(msg)),
//       subscribe("/watchdog/status", "std_msgs/String", (msg) => handleWatchdogMsg.current(msg)),
//       subscribe("/imu/data", "sensor_msgs/Imu", (msg) => handleImuMsg.current(msg)),
//       subscribe("/moons_motor_diagnostics", "std_msgs/String", (msg) => handleMotorMsg.current(msg))
//     );
//     [
//       { name: "work_over", topic: "/plc/work_over" },
//       { name: "front_estop", topic: "/plc/front_estop" },
//       { name: "back_estop", topic: "/plc/back_estop" },
//       { name: "reset", topic: "/plc/reset" },
//       { name: "front_lidar", topic: "/plc/front_lidar" },
//       { name: "back_lidar", topic: "/plc/back_lidar" },
//       { name: "front_bumper", topic: "/plc/front_bumper" },
//       { name: "rear_bumper", topic: "/plc/back_bumper" },
//     ].forEach(({ name, topic }) => {
//       reportStore.unsubscribers.push(subscribe(topic, "std_msgs/Bool", (msg) => handlePlcMsg.current(name, msg)));
//     });
//     markDataFresh();
//   }, [connected, subscribe]);

//   useEffect(
//     () => () => {
//       clearTimeout(imuTimeoutRef.current);
//       clearTimeout(staleCheckRef.current);
//     },
//     []
//   );

//   // ─────────────────────────────────────────────────────────────────────────
//   // DOWNLOAD HANDLERS
//   // ─────────────────────────────────────────────────────────────────────────

//   const ts = () => new Date().toISOString().slice(0, 19).replace(/:/g, "-");

//   const downloadWeeklyReport = async () => {
//     try {
//       const wkData = getThisWeeksData(weeklyStore);
//       if (!wkData.safety.length && !wkData.mission.length && !wkData.completed.length) {
//         alert("No data for this week yet.");
//         return;
//       }
//       const now = new Date();
//       const wkNum = Math.ceil((now - new Date(now.getFullYear(), 0, 1)) / (7 * 24 * 60 * 60 * 1000));
//       const { sow, eow } = getWeekBounds();
//       const sd = sow.toLocaleDateString();
//       const ed = eow.toLocaleDateString();
//       const wb = generateWeeklyReport(wkData.safety, wkData.mission, wkData.completed, sd, ed);
//       await downloadBuffer(
//         wb,
//         `weekly_report_${now.getFullYear()}_week${wkNum}_${sd.replace(/\//g, "-")}_to_${ed.replace(
//           /\//g,
//           "-"
//         )}.xlsx`
//       );
//       autoArchiveWeeklyReport();
//     } catch (err) {
//       console.error(err);
//       alert("Error: " + err.message);
//     }
//   };

//   const downloadArchivedReport = async (entry) => {
//     try {
//       const { data, startDate, endDate, weekNumber, year } = entry;
//       const wb = generateWeeklyReport(data.safety, data.mission, data.completed, startDate, endDate);
//       await downloadBuffer(
//         wb,
//         `archived_weekly_report_${year}_week${weekNumber}_${startDate.replace(/\//g, "-")}_to_${endDate.replace(
//           /\//g,
//           "-"
//         )}.xlsx`
//       );
//     } catch (err) {
//       console.error(err);
//       alert("Error: " + err.message);
//     }
//   };

//   const downloadInterlockExcel = async () => {
//     try {
//       const allSafety = monthlyStore.safety || [];
//       if (!allSafety.length) {
//         alert("No safety data");
//         return;
//       }
//       const wb = new ExcelJS.Workbook();
//       const ws = wb.addWorksheet("Safety Events");
//       ws.columns = [
//         { width: 6 },
//         { width: 12 },
//         { width: 22 },
//         { width: 20 },
//         { width: 12 },
//         { width: 25 }
//       ];
//       ws.mergeCells("A1:E1");
//       ws.getRow(1).height = 28;
//       const t1 = ws.getCell("A1");
//       t1.value = "SAFETY EVENTS (30-Day History)";
//       applyTitleStyle(t1);
//       ws.mergeCells("A2:E2");
//       ws.getRow(2).height = 18;
//       const s1 = ws.getCell("A2");
//       s1.value = `Generated: ${new Date().toLocaleString()} | Total: ${allSafety.length} events`;
//       applySubtitleStyle(s1);
//       ws.getRow(4).height = 22;
//       ["No.", "Date", "Timestamp", "Device", "Status", "Health"].forEach((h, i) => {
//         const c = ws.getCell(4, i + 1);
//         c.value = h;
//         applyHeaderStyle(c);
//       });
//       allSafety.forEach((row2, idx) => {
//         const rn = 5 + idx;
//         ws.getRow(rn).height = 20;
//         [
//           [idx + 1, "center"],
//           [row2.dateKey || "—", "center"],
//           [row2.timestampFormatted || "—", "left"],
//           [row2.signalLabel || "—", "left"],
//         ].forEach(([v, a], ci) => {
//           const c = ws.getCell(rn, ci + 1);
//           c.value = v;
//           applyDataStyle(c, idx, a);
//         });
//         const st = ws.getCell(rn, 5);
//         st.value = row2.statusColor?.toUpperCase() || "—";
//         applyStatusStyle(st, st.value);
//         const hl = ws.getCell(rn, 6);
//         hl.value = sanitizeStatus(row2.status) || "—";
//         applyDataStyle(hl, idx, "left");
//       });
//       await downloadBuffer(wb, `safety_report_${ts()}.xlsx`);
//     } catch (err) {
//       console.error(err);
//       alert("Error: " + err.message);
//     }
//   };

//   const downloadMissionExcel = async () => {
//     try {
//       const allMission = monthlyStore.mission || [];
//       if (!allMission.length) {
//         alert("No mission data");
//         return;
//       }
//       const wb = new ExcelJS.Workbook();
//       const ws = wb.addWorksheet("Mission Events");
//       ws.columns = [
//         { width: 6 },
//         { width: 12 },
//         { width: 22 },
//         { width: 21 },
//         { width: 8 },
//         { width: 10 },
//         { width: 10 },
//         { width: 12 },
//         { width: 15 },
//         { width: 22 },
//       ];
//       ws.mergeCells("A1:J1");
//       ws.getRow(1).height = 28;
//       const t1 = ws.getCell("A1");
//       t1.value = "MISSION EVENTS (STEP-BY-STEP, 30-Day History)";
//       applyTitleStyle(t1);
//       ws.mergeCells("A2:J2");
//       ws.getRow(2).height = 18;
//       const s1 = ws.getCell("A2");
//       s1.value = `Generated: ${new Date().toLocaleString()} | Total: ${allMission.length} step events`;
//       applySubtitleStyle(s1);
//       ws.getRow(4).height = 22;
//       ["No.", "Date", "Timestamp", "State", "Step", "Tag", "Target", "Speed (m/s)", "Missed Tag", "Mission File"].forEach(
//         (h, i) => {
//           const c = ws.getCell(4, i + 1);
//           c.value = h;
//           applyHeaderStyle(c);
//         }
//       );
//       allMission.forEach((row2, idx) => {
//         const rn = 5 + idx;
//         ws.getRow(rn).height = 20;
//         [
//           [idx + 1, "center"],
//           [row2.dateKey || "—", "center"],
//           [row2.timestampFormatted || "—", "left"],
//           [row2.state || "—", "left"],
//           [row2.step || "—", "center"],
//           [row2.currentTag || "—", "center"],
//           [row2.targetTag || "—", "center"],
//           [row2.speed ?? "—", "center"],
//           [row2.missedTag != null ? `${row2.missedTag}` : "—", "center"],
//           [row2.missionFile || "—", "left"],
//         ].forEach(([v, a], ci) => {
//           const c = ws.getCell(rn, ci + 1);
//           c.value = v;
//           applyDataStyle(c, idx, a);
//         });
//       });
//       await downloadBuffer(wb, `mission_report_${ts()}.xlsx`);
//     } catch (err) {
//       console.error(err);
//       alert("Error: " + err.message);
//     }
//   };

//   const downloadCompletedExcel = async () => {
//     try {
//       const allCompleted = monthlyStore.completed || [];
//       if (!allCompleted.length) {
//         alert("No completed mission data");
//         return;
//       }
//       const wb = new ExcelJS.Workbook();
//       const ws = wb.addWorksheet("Completed Missions");
//       ws.columns = [
//         { width: 6 },
//         { width: 12 },
//         { width: 22 },
//         { width: 22 },
//         { width: 10 },
//         { width: 14 },
//         { width: 8 },
//       ];
//       ws.mergeCells("A1:G1");
//       ws.getRow(1).height = 28;
//       const t1 = ws.getCell("A1");
//       t1.value = "COMPLETED MISSIONS (30-Day History)";
//       applyTitleStyle(t1);
//       ws.mergeCells("A2:G2");
//       ws.getRow(2).height = 18;
//       const s1 = ws.getCell("A2");
//       s1.value = `Generated: ${new Date().toLocaleString()} | Total: ${allCompleted.length} missions`;
//       applySubtitleStyle(s1);
//       ws.getRow(4).height = 22;
//       ["No.", "Date", "Completed At", "Mission File", "Steps", "Duration", "Loop"].forEach((h, i) => {
//         const c = ws.getCell(4, i + 1);
//         c.value = h;
//         applyHeaderStyle(c);
//       });
//       allCompleted.forEach((row2, idx) => {
//         const rn = 5 + idx;
//         ws.getRow(rn).height = 20;
//         [
//           [idx + 1, "center"],
//           [row2.dateKey || "—", "center"],
//           [row2.timestampFormatted || "—", "left"],
//           [row2.missionFile || "—", "left"],
//           [row2.totalSteps || 0, "center"],
//           [row2.durationFormatted || "—", "left"],
//           [row2.loop ? "ON" : "OFF", "center"],
//         ].forEach(([v, a], ci) => {
//           const c = ws.getCell(rn, ci + 1);
//           c.value = v;
//           applyDataStyle(c, idx, a);
//         });
//       });
//       await downloadBuffer(wb, `completed_missions_${ts()}.xlsx`);
//     } catch (err) {
//       console.error(err);
//       alert("Error: " + err.message);
//     }
//   };

//   // ─── clear all ───
//   // ✅ FIX (this version): "Clear All" must ONLY clear what's *displayed* and
//   // *logged* (the report arrays, dedup Sets, and counts). It must NEVER
//   // reset the app's live knowledge of the robot's current actual state —
//   // plcSignals, currentMission, activeMissions, isMissionActive — because
//   // several ROS topics here (/plc/*, /mission/status) only publish when a
//   // value genuinely changes on the robot. If we reset those trackers to
//   // hardcoded defaults, the app becomes permanently out of sync: it will
//   // silently swallow the next *real* transition (comparing it against the
//   // wrong assumed baseline) or simply never receive another message until
//   // some unrelated toggle happens to occur. That was the root cause of
//   // "after Clear All, no new reports ever show up."
//   const confirmClearAll = () => {
//     // Clear only the displayed/logged history:
//     reportStore.safetyReports = [];
//     reportStore.missionReports = [];
//     reportStore.completedMissions = [];
//     reportStore.allSafety = [];
//     reportStore.allMission = [];
//     reportStore.allCompleted = [];
//     reportStore.tagMissCount = 0;

//     // Safe to clear: these are just "have we already logged this exact
//     // fault" de-dup sets, not current-state trackers. Clearing them can at
//     // worst cause a fault to be logged again if it re-fires identically,
//     // which is harmless (and arguably more correct than staying silent).
//     reportStore.recordedFaults.clear();
//     reportStore.recordedStates.clear();
//     reportStore.lastState = null;
//     reportStore.missionAccum = {};

//     // Reset only the "stale" bookkeeping — this doesn't affect change
//     // detection, just the UI's "no updates for 30s" banner.
//     reportStore.lastDataUpdate = null;
//     reportStore.isDataStale = false;

//     // ── Intentionally NOT reset ──────────────────────────────────────────
//     // reportStore.plcSignals    — must keep reflecting the robot's real
//     //                              last-known signal values, or the next
//     //                              genuine transition gets silently dropped
//     //                              by the `if (prev === newValue) return;`
//     //                              check in handlePlcMsg.
//     // reportStore.currentMission,
//     // reportStore.activeMissions,
//     // reportStore.isMissionActive — must keep reflecting whether a mission
//     //                              is actually in progress on the robot
//     //                              right now, or handleMissionMsg misjudges
//     //                              subsequent /mission/status messages.
//     // motorFaultStateRef        — same reasoning as plcSignals: it must
//     //                              keep reflecting each motor fault bit's
//     //                              real last-known state, or the next
//     //                              genuine on/off transition gets silently
//     //                              dropped by the `isActive === wasActive`
//     //                              check in handleMotorMsg.
//     // ───────────────────────────────────────────────────────────────────

//     setSafetyReports([]);
//     setMissionReports([]);
//     setCompletedMissions([]);
//     setTagMissCount(0);
//     setIsDataStale(false);
//     // plcSignals / isMissionActive UI state intentionally left as-is —
//     // re-sync from the (untouched) reportStore just to be explicit:
//     setPlcSignals({ ...reportStore.plcSignals });
//     setIsMissionActive(reportStore.isMissionActive);

//     refreshWeeklyCounts(); // weeklyStore is intact, so these counts stay accurate
//     persistSessionStore(reportStore);
//     setShowConfirmModal(false);
//   };

//   // ─────────────────────────────────────────────────────────────────────────
//   // DERIVED STATE
//   // ─────────────────────────────────────────────────────────────────────────

//   const imuFaults = safetyReports.filter((r) => r.signal === "imu" && r.statusColor === "red").length;
//   const bumperFaults = safetyReports.filter((r) => (r.signal === "front_bumper" || r.signal === "rear_bumper") && r.statusColor === "red").length;
//   const motorFaults = safetyReports.filter((r) => (r.signal || "").startsWith("motor_") && r.statusColor === "red").length;
//   const missionFaults = missionReports.filter((r) => r.state === "WATCHDOG_FAULT").length;
//   const noData = !reportStore.allSafety.length && !reportStore.allMission.length && !reportStore.allCompleted.length;

//   const TABS = [
//     {
//       key: "interlock",
//       icon: <IconShield size={18} />,
//       label: t("report.tab_interlock"),
//       count: safetyReports.length,
//       accentActive: "text-amber-600 dark:text-amber-400",
//       countBg: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
//     },
//     {
//       key: "mission",
//       icon: <IconMission size={18} />,
//       label: t("report.tab_mission"),
//       count: missionReports.length,
//       accentActive: "text-sky-600 dark:text-sky-400",
//       countBg: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-400",
//     },
//     {
//       key: "completed",
//       icon: <IconCheckCircle size={18} />,
//       label: t("report.tab_completed"),
//       count: completedMissions.length,
//       accentActive: "text-emerald-600 dark:text-emerald-400",
//       countBg: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
//     },
//     {
//       key: "archive",
//       icon: <IconArchive size={18} />,
//       label: "Archives",
//       count: archivedReports.length,
//       accentActive: "text-purple-600 dark:text-purple-400",
//       countBg: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400",
//     },
//   ];

//   const TH = ({ children, className = "" }) => (
//     <th className={`text-left font-black uppercase text-xs text-slate-500 whitespace-nowrap ${className}`} style={{ padding: "12px 10px" }}>
//       {children}
//     </th>
//   );
//   const TD = ({ children, className = "", style: s }) => (
//     <td className={className} style={{ padding: "12px 10px", ...s }}>
//       {children}
//     </td>
//   );

//   // ═════════════════════════════════════════════════════════════════════════
//   // RENDER
//   // ═════════════════════════════════════════════════════════════════════════

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-slate-900 dark:text-white flex flex-col" style={{ padding: "14px 14px 28px", gap: 14 }}>
//       {/* PAGE HEADER */}
//       <div className="border-b-4 border-sky-500" style={{ paddingBottom: 12 }}>
//         <div className="flex items-center justify-between gap-4 mb-3">
//           <h2 className="font-black uppercase tracking-tighter" style={{ fontSize: 24 }}>
//             📊 {t("report.title")}
//           </h2>
//           <div className="flex items-center gap-2">
//             {isMissionActive && (
//               <span className="text-xs font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-3 py-1 rounded-full animate-pulse">
//                 🟢 Mission Active
//               </span>
//             )}
//             {isDataStale && (
//               <span className="text-xs font-bold bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 px-3 py-1 rounded-full">
//                 ⚠ Data stale (no updates for 30s)
//               </span>
//             )}
//           </div>
//         </div>

//         <div className="flex flex-wrap items-center gap-2 mb-3 px-3 py-2 rounded-xl bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800">
//           <span className="text-purple-600 dark:text-purple-400 font-black text-xs uppercase tracking-wider">📅 This Week (persistent):</span>
//           <span className="text-xs font-bold text-amber-600">{weeklyCountSafety} Safety</span>
//           <span className="text-slate-400">·</span>
//           <span className="text-xs font-bold text-sky-600">{weeklyCountMission} Mission Steps</span>
//           <span className="text-slate-400">·</span>
//           <span className="text-xs font-bold text-emerald-600">{weeklyCountCompleted} Completed</span>
//           <span className="text-slate-400 text-xs ml-auto">30-day storage • Survives disconnects &amp; Clear All</span>
//         </div>

//         <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 8 }}>
//           {[
//             { label: "Safety Events", icon: <IconShield size={18} />, bg: "bg-amber-500 hover:bg-amber-400", disabled: !(monthlyStore.safety?.length), fn: downloadInterlockExcel },
//             { label: "Mission Steps", icon: <IconMission size={18} />, bg: "bg-sky-600 hover:bg-sky-500", disabled: !(monthlyStore.mission?.length), fn: downloadMissionExcel },
//             { label: "Completed", icon: <IconCheckCircle size={18} />, bg: "bg-emerald-600 hover:bg-emerald-500", disabled: !(monthlyStore.completed?.length), fn: downloadCompletedExcel },
//             { label: "Weekly Report", icon: <IconRefresh size={18} />, bg: "bg-purple-600 hover:bg-purple-500", disabled: weeklyCountSafety + weeklyCountMission + weeklyCountCompleted === 0, fn: downloadWeeklyReport },
//             { label: "Clear All", icon: <IconTrash size={18} />, bg: "bg-red-600 hover:bg-red-500", disabled: noData, fn: () => setShowConfirmModal(true) },
//           ].map(({ label, icon, bg, disabled, fn }) => (
//             <button
//               key={label}
//               onClick={fn}
//               disabled={disabled}
//               className={`flex items-center justify-center gap-2 rounded-xl font-black uppercase text-white shadow-md transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed ${bg}`}
//               style={{ minHeight: 52, fontSize: 11, letterSpacing: "0.04em", padding: "0 8px" }}
//             >
//               {icon}
//               <span className="truncate">{label}</span>
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* CONNECTION STATUS */}
//       <div
//         className={`flex items-center gap-3 rounded-xl border ${connected ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800" : "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800"
//           }`}
//         style={{ padding: "10px 14px" }}
//       >
//         <div className={`rounded-full shrink-0 ${connected ? "bg-emerald-500 animate-pulse" : "bg-red-500"}`} style={{ width: 14, height: 14 }} />
//         <span className="font-bold text-sm">
//           Robot: {connected ? t("report.robot_online") : t("report.robot_disconnected")}
//         </span>
//         {!connected && <span className="ml-auto text-amber-600 dark:text-amber-400 text-xs font-bold shrink-0">{t("report.waiting_wifi")} — 30-day data preserved</span>}
//       </div>

//       {/* SUMMARY STATS */}
//       <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 8 }}>
//         {[
//           { label: "Safety Events", val: monthlyStore.safety?.length || 0, color: "text-amber-500" },
//           { label: "IMU Faults", val: imuFaults, color: "text-orange-500" },
//           { label: "Bumper Faults", val: bumperFaults, color: "text-red-600" },
//           { label: "Motor Faults", val: motorFaults, color: "text-rose-600" },
//           { label: "Mission Steps", val: monthlyStore.mission?.length || 0, color: "text-sky-500" },
//           { label: "Watchdog", val: missionFaults, color: "text-red-500" },
//           { label: "Missed Tags", val: tagMissCount, color: "text-fuchsia-600" },
//           { label: "Completed", val: monthlyStore.completed?.length || 0, color: "text-emerald-600" },
//           { label: "Archived", val: archivedReports.length, color: "text-purple-600" },
//         ].map((c, i) => (
//           <StatChip key={i} label={c.label} val={c.val} color={c.color} />
//         ))}
//       </div>

//       {/* TABS */}
//       <div className="flex gap-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl" style={{ padding: 5 }}>
//         {TABS.map(({ key, icon, label, count, accentActive, countBg }) => (
//           <button
//             key={key}
//             onClick={() => setActiveTab(key)}
//             className={`flex items-center justify-center gap-1.5 flex-1 rounded-lg font-black uppercase transition-all ${activeTab === key ? `bg-white dark:bg-slate-900 shadow-md ${accentActive}` : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
//               }`}
//             style={{ minHeight: 52, fontSize: 11, letterSpacing: "0.04em", padding: "0 6px" }}
//           >
//             {icon}
//             <span>{label}</span>
//             {count > 0 && (
//               <span className={`text-xs px-1.5 py-0.5 rounded-full font-black ${activeTab === key ? countBg : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"}`}>
//                 {count}
//               </span>
//             )}
//           </button>
//         ))}
//       </div>

//       {/* ── SAFETY EVENTS TAB ── */}
//       {activeTab === "interlock" && (
//         <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border dark:border-slate-800 overflow-hidden">
//           <div style={{ padding: "14px 16px" }} className="border-b dark:border-slate-800">
//             <h3 className="font-black uppercase text-amber-600" style={{ fontSize: 15 }}>
//               ⚠️ Safety Events
//             </h3>
//             <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
//               {monthlyStore.safety?.length || 0} total — showing latest {safetyReports.length} (includes PLC interlocks + Motor faults)
//             </p>
//           </div>
//           {safetyReports.length === 0 ? (
//             <EmptyState label="No safety events" sub="Signal changes and motor faults will appear here" />
//           ) : (
//             <div style={isDark() ? darkTableContainerStyle : tableContainerStyle}>
//               <table className="w-full">
//                 <thead className="bg-slate-50 dark:bg-slate-800 border-b dark:border-slate-700" style={tableHeaderStickyStyle}>
//                   <tr>
//                     <TH>No.</TH>
//                     <TH>Date</TH>
//                     <TH>Timestamp</TH>
//                     <TH>Device</TH>
//                     <TH>Status</TH>
//                     <TH>Health</TH>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {safetyReports.map((r, idx) => (
//                     <tr key={r.id} className="border-b dark:border-slate-800 hover:bg-amber-50/40 dark:hover:bg-amber-950/10">
//                       <TD className="text-slate-400 font-bold text-xs">{idx + 1}</TD>
//                       <TD className="text-xs font-mono text-slate-500">{r.dateKey}</TD>
//                       <TD>
//                         <div className="text-xs font-bold">{r.timestampFormatted}</div>
//                       </TD>
//                       <TD className="text-sm font-semibold">{r.signalLabel}</TD>
//                       <TD>
//                         <span
//                           className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-black ${r.statusColor === "green"
//                             ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
//                             : "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400"
//                             }`}
//                         >
//                           <span className={`rounded-full shrink-0 ${r.statusColor === "green" ? "bg-emerald-500" : "bg-red-500"}`} style={{ width: 7, height: 7 }} />
//                           {r.statusColor.toUpperCase()}
//                         </span>
//                       </TD>
//                       <TD>{sanitizeStatus(r.status)}</TD>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       )}

//       {/* ── MISSION EVENTS TAB ── */}
//       {activeTab === "mission" && (
//         <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border dark:border-slate-800 overflow-hidden">
//           <div style={{ padding: "14px 16px" }} className="border-b dark:border-slate-800">
//             <div className="flex items-center justify-between">
//               <h3 className="font-black uppercase text-sky-600" style={{ fontSize: 15 }}>
//                 🎯 Mission Steps
//               </h3>
//               {isMissionActive && (
//                 <span className="text-xs font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-3 py-1 rounded-full animate-pulse">
//                   🟢 Live
//                 </span>
//               )}
//             </div>
//             <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
//               {monthlyStore.mission?.length || 0} step updates — showing latest {missionReports.length}
//             </p>
//           </div>
//           {missionReports.length === 0 ? (
//             <EmptyState label="No mission steps recorded" sub="Mission step updates will appear here" />
//           ) : (
//             <div style={isDark() ? darkTableContainerStyle : tableContainerStyle}>
//               <table className="w-full text-sm">
//                 <thead className="bg-slate-50 dark:bg-slate-800 border-b dark:border-slate-700" style={tableHeaderStickyStyle}>
//                   <tr>
//                     <TH>No.</TH>
//                     <TH>Date</TH>
//                     <TH>Timestamp</TH>
//                     <TH>State</TH>
//                     <TH>Step</TH>
//                     <TH>Tag</TH>
//                     <TH>Target</TH>
//                     <TH>Speed</TH>
//                     <TH>Missed Tag</TH>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {missionReports.map((r, idx) => (
//                     <tr key={r.id} className="border-b dark:border-slate-800 hover:bg-sky-50/40 dark:hover:bg-sky-900/10">
//                       <TD className="text-slate-400 font-bold text-xs">{idx + 1}</TD>
//                       <TD className="text-xs font-mono text-slate-500">{r.dateKey}</TD>
//                       <TD>
//                         <div className="text-xs font-bold">{r.timestampFormatted}</div>
//                       </TD>
//                       <TD>
//                         <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-black whitespace-nowrap ${getStateStyle(r.state).bg} ${getStateStyle(r.state).text}`}>
//                           <span className={`rounded-full shrink-0 ${getStateStyle(r.state).dot}`} style={{ width: 6, height: 6 }} />
//                           {r.state}
//                         </span>
//                       </TD>
//                       <TD className="font-mono font-bold text-amber-600 dark:text-amber-400 text-xs">
//                         {r.step}/{r.totalSteps}
//                       </TD>
//                       <TD className="font-mono font-black text-sky-600 dark:text-sky-400">{r.currentTag}</TD>
//                       <TD className="font-mono font-black text-purple-600 dark:text-purple-400">{r.targetTag}</TD>
//                       <TD className="font-mono text-xs">
//                         {r.speed} m/s
//                       </TD>
//                       <TD className={`font-mono font-black ${r.missedTag ? "text-red-600 dark:text-red-400" : "text-slate-400"}`}>
//                         {r.missedTag ? `${r.missedTag}` : "—"}
//                       </TD>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       )}

//       {/* ── COMPLETED MISSIONS TAB ── */}
//       {activeTab === "completed" && (
//         <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border dark:border-slate-800 overflow-hidden">
//           <div style={{ padding: "14px 16px" }} className="border-b dark:border-slate-800">
//             <h3 className="font-black uppercase text-emerald-600" style={{ fontSize: 15 }}>
//               ✅ Completed Missions
//             </h3>
//             <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
//               {monthlyStore.completed?.length || 0} total — showing latest {completedMissions.length}
//             </p>
//           </div>
//           {completedMissions.length === 0 ? (
//             <EmptyState label="No completed missions" sub="Finished missions will appear here" />
//           ) : (
//             <div style={isDark() ? darkTableContainerStyle : tableContainerStyle}>
//               <table className="w-full">
//                 <thead className="bg-slate-50 dark:bg-slate-800 border-b dark:border-slate-700" style={tableHeaderStickyStyle}>
//                   <tr>
//                     <TH>No.</TH>
//                     <TH>Date</TH>
//                     <TH>Completed At</TH>
//                     <TH>Mission File</TH>
//                     <TH>Steps</TH>
//                     <TH>Duration</TH>
//                     <TH>Loop</TH>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {completedMissions.map((r, idx) => (
//                     <tr key={r.id} className="border-b dark:border-slate-800 hover:bg-emerald-50/40 dark:hover:bg-emerald-950/10">
//                       <TD className="text-slate-400 font-bold text-xs">{idx + 1}</TD>
//                       <TD className="text-xs font-mono text-slate-500">{r.dateKey}</TD>
//                       <TD>
//                         <div className="text-xs font-bold">{r.timestampFormatted}</div>
//                         <div className="text-xs text-slate-400 font-mono">{r.durationFormatted}</div>
//                       </TD>
//                       <TD className="text-xs font-mono text-sky-600 dark:text-sky-400 max-w-xs truncate">{r.missionFile}</TD>
//                       <TD>
//                         <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-black bg-sky-50 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300">
//                           {r.finalStep}/{r.totalSteps}
//                         </span>
//                       </TD>
//                       <TD>
//                         <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-black bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300">
//                           ⏱ {r.durationFormatted}
//                         </span>
//                       </TD>
//                       <TD className={`text-xs font-black ${r.loop ? "text-amber-600 dark:text-amber-400" : "text-slate-400"}`}>
//                         {r.loop ? "ON" : "OFF"}
//                       </TD>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       )}

//       {/* ── ARCHIVE TAB ── */}
//       {activeTab === "archive" && (
//         <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border dark:border-slate-800 overflow-hidden">
//           <div style={{ padding: "14px 16px" }} className="border-b dark:border-slate-800">
//             <h3 className="font-black uppercase text-purple-600" style={{ fontSize: 15 }}>
//               📦 Archived Weekly Reports
//             </h3>
//             <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
//               {archivedReports.length} archived reports (survives clear operations)
//             </p>
//           </div>
//           {archivedReports.length === 0 ? (
//             <EmptyState label="No archived reports yet" sub="Weekly reports will be archived here after download" />
//           ) : (
//             <div style={isDark() ? darkTableContainerStyle : tableContainerStyle}>
//               <table className="w-full text-sm">
//                 <thead className="bg-slate-50 dark:bg-slate-800 border-b dark:border-slate-700" style={tableHeaderStickyStyle}>
//                   <tr>
//                     <TH>Week</TH>
//                     <TH>Year</TH>
//                     <TH>Period</TH>
//                     <TH>Safety</TH>
//                     <TH>Mission</TH>
//                     <TH>Completed</TH>
//                     <TH>Archived At</TH>
//                     <TH>Action</TH>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {[...archivedReports].reverse().map((archive) => (
//                     <tr key={archive.id} className="border-b dark:border-slate-800 hover:bg-purple-50/40 dark:hover:bg-purple-900/10">
//                       <TD className="font-mono font-black text-purple-600 dark:text-purple-400">{archive.weekNumber}</TD>
//                       <TD className="font-bold">{archive.year}</TD>
//                       <TD className="text-xs">
//                         <div>{archive.startDate}</div>
//                         <div className="text-slate-400">to {archive.endDate}</div>
//                       </TD>
//                       <TD className="text-xs font-bold text-amber-600">{archive.counts.safety}</TD>
//                       <TD className="text-xs font-bold text-sky-600">{archive.counts.mission}</TD>
//                       <TD className="text-xs font-bold text-emerald-600">{archive.counts.completed}</TD>
//                       <TD className="text-xs font-mono text-slate-500">{new Date(archive.createdAt).toLocaleString()}</TD>
//                       <TD>
//                         <button
//                           type="button"
//                           onClick={() => downloadArchivedReport(archive)}
//                           className="px-3 py-1 rounded-lg bg-purple-500 hover:bg-purple-600 text-white font-bold text-xs transition-all active:scale-95"
//                         >
//                           ⬇️ Download
//                         </button>
//                       </TD>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       )}

//       {/* CONFIRM MODAL */}
//       <ConfirmationModal
//         isOpen={showConfirmModal}
//         onClose={() => setShowConfirmModal(false)}
//         onConfirm={confirmClearAll}
//         title="Clear Dashboard View"
//         message="This clears the live dashboard view (current tab counts and tables). Your weekly report, 30-day exports, and archived reports are not affected and will keep all historical data. This action cannot be undone for the on-screen view."
//         confirmText="Yes, Clear View"
//         cancelText="Cancel"
//       />
//     </div>
//   );
// }


import React, { useState, useEffect, useCallback, useRef } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useROS } from "../context/RosContext";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

// ═════════════════════════════════════════════════════════════════════════════
// EVENT EMITTER FOR REAL-TIME UPDATES
// ═════════════════════════════════════════════════════════════════════════════

class ReportEventEmitter {
  constructor() {
    this.listeners = {
      safetyReportAdded: [],
      missionReportAdded: [],
      completedMissionAdded: [],
    };
    // Use a single event source pattern that works in both Electron and browser
    if (typeof window !== 'undefined' && !window._reportEmitter) {
      window._reportEmitter = this;
    }
  }

  on(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event].push(callback);
      return () => {
        this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
      };
    }
    return () => {};
  }

  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => {
        try {
          callback(data);
        } catch (e) {
          console.error(`Error in ${event} listener:`, e);
        }
      });
    }
  }
}

// Singleton instance - safe for both Electron and browser
const reportEmitter = (() => {
  if (typeof window !== 'undefined' && window._reportEmitter) {
    return window._reportEmitter;
  }
  const emitter = new ReportEventEmitter();
  if (typeof window !== 'undefined') {
    window._reportEmitter = emitter;
  }
  return emitter;
})();

// ═════════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═════════════════════════════════════════════════════════════════════════════

const STORAGE_KEY = "reportStoreV3";
const WEEKLY_KEY = "weeklyReportStoreV2";
const MONTHLY_KEY = "monthlyReportStore";
const ARCHIVE_KEY = "archivedWeeklyReports";
const MAX_DISPLAY = 50; // Increased for better visibility
const IMU_TIMEOUT_MS = 1500;
const PGV_POSE_TIMEOUT_MS = 1500;
const MAX_STORAGE_DAYS = 30;
const STALE_TIMEOUT_MS = 30000;

// ═════════════════════════════════════════════════════════════════════════════
// MOTOR ERROR BITMASK LOOKUP
// ═════════════════════════════════════════════════════════════════════════════

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

// ═════════════════════════════════════════════════════════════════════════════
// STATUS SANITIZER
// ═════════════════════════════════════════════════════════════════════════════

function sanitizeStatus(statusText) {
  if (!statusText) return statusText;
  const s = statusText.toString();
  const isFault =
    s.includes("Fault") ||
    s.includes("fault") ||
    s.includes("दोष") ||
    s.includes("異常") ||
    s.includes("Active/Triggered") ||
    s.includes("active_trig");
  if (isFault) return "Fault Triggered";
  return statusText;
}

function sanitizeSafetyArray(arr) {
  if (!Array.isArray(arr)) return [];
  return arr.map(r => ({ ...r, status: sanitizeStatus(r.status) }));
}

// ═════════════════════════════════════════════════════════════════════════════
// STORAGE HELPERS
// ═════════════════════════════════════════════════════════════════════════════

function getDateKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

function getWeekBounds() {
  const now = new Date();
  const dow = now.getDay();
  const sow = new Date(now);
  sow.setDate(now.getDate() - dow);
  sow.setHours(0, 0, 0, 0);
  const eow = new Date(sow);
  eow.setDate(sow.getDate() + 6);
  eow.setHours(23, 59, 59, 999);
  return { sow, eow };
}

function loadStore(key) {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch (_) { }
  return null;
}

function saveStore(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Failed to persist ${key}:`, e);
  }
}

function loadAllStores() {
  const weekly = loadStore(WEEKLY_KEY) || { safety: [], mission: [], completed: [] };
  const monthly = loadStore(MONTHLY_KEY) || { safety: [], mission: [], completed: [] };

  const sanitize = (store) => ({
    ...store,
    safety: sanitizeSafetyArray(store.safety),
  });

  return { weekly: sanitize(weekly), monthly: sanitize(monthly) };
}

function saveAndTrimStores(weekly, monthly) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - MAX_STORAGE_DAYS);
  const cutoffKey = getDateKey(cutoff);

  const trimData = (data) => ({
    safety: data.safety.filter(r => (r.dateKey || "") >= cutoffKey),
    mission: data.mission.filter(r => (r.dateKey || "") >= cutoffKey),
    completed: data.completed.filter(r => (r.dateKey || "") >= cutoffKey),
  });

  const trimmedWeekly = trimData(weekly);
  const trimmedMonthly = trimData(monthly);
  saveStore(WEEKLY_KEY, trimmedWeekly);
  saveStore(MONTHLY_KEY, trimmedMonthly);
  return { weekly: trimmedWeekly, monthly: trimmedMonthly };
}

function getThisWeeksData(weeklyStore) {
  const { sow, eow } = getWeekBounds();
  const inRange = (r) => {
    if (!r.timestampISO) return false;
    const d = new Date(r.timestampISO);
    return d >= sow && d <= eow;
  };
  return {
    safety: weeklyStore.safety.filter(inRange),
    mission: weeklyStore.mission.filter(inRange),
    completed: weeklyStore.completed.filter(inRange),
  };
}

// ═════════════════════════════════════════════════════════════════════════════
// ARCHIVE HELPERS
// ═════════════════════════════════════════════════════════════════════════════

function loadArchive() {
  try {
    const raw = localStorage.getItem(ARCHIVE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (_) { }
  return [];
}

function saveArchive(archiveArray) {
  try {
    localStorage.setItem(ARCHIVE_KEY, JSON.stringify(archiveArray));
  } catch (e) {
    console.error("Failed to persist archive:", e);
  }
}

function addToArchive(weeklyData, weekNumber, year, startDate, endDate) {
  const archive = loadArchive();
  const entry = {
    id: `${year}-week${weekNumber}-${Date.now()}`,
    weekNumber,
    year,
    startDate,
    endDate,
    createdAt: new Date().toISOString(),
    data: {
      safety: weeklyData.safety,
      mission: weeklyData.mission,
      completed: weeklyData.completed,
    },
    counts: {
      safety: weeklyData.safety.length,
      mission: weeklyData.mission.length,
      completed: weeklyData.completed.length,
    },
  };
  archive.push(entry);
  const MAX_ARCHIVES = 12;
if (archive.length > MAX_ARCHIVES) {
    archive.splice(0, archive.length - MAX_ARCHIVES);
}
  saveArchive(archive);
  return entry;
}

// ═════════════════════════════════════════════════════════════════════════════
// SESSION STORE
// ═════════════════════════════════════════════════════════════════════════════

const defaultStore = {
  safetyReports: [],
  missionReports: [],
  completedMissions: [],
  allSafety: [],
  allMission: [],
  allCompleted: [],
  tagMissCount: 0,
  currentMission: null,
  plcSignals: {
    work_over: false,
    front_estop: false,
    back_estop: false,
    reset: false,
    front_lidar: false,
    back_lidar: false,
    front_bumper: false,
    rear_bumper: false,
    imu: false,
    pgv_pose: false,
  },
  lastState: null,
  missionAccum: {},
  recordedStates: new Set(),
  recordedFaults: new Set(),
  activeMissions: {},
  subscribed: false,
  lastDataUpdate: null,
  isDataStale: false,
  isMissionActive: false,
};

const createReportStore = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      const recordedStates = parsed.recordedStates ? new Set(parsed.recordedStates) : new Set();
      const recordedFaults = parsed.recordedFaults ? new Set(parsed.recordedFaults) : new Set();
      const activeMissions = parsed.activeMissions ? { ...parsed.activeMissions } : {};

      if (parsed.safetyReports) parsed.safetyReports = sanitizeSafetyArray(parsed.safetyReports);
      if (parsed.allSafety) parsed.allSafety = sanitizeSafetyArray(parsed.allSafety);

      return { ...defaultStore, ...parsed, recordedStates, recordedFaults, activeMissions };
    }
  } catch (e) {
    console.error("Failed to load from localStorage:", e);
  }
  return {
    ...defaultStore,
    recordedStates: new Set(),
    recordedFaults: new Set(),
    activeMissions: {},
  };
};

const persistSessionStore = (store) => {
  try {
    const toSave = {
      ...store,
      recordedStates: Array.from(store.recordedStates),
      recordedFaults: Array.from(store.recordedFaults),
      activeMissions: store.activeMissions,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch (e) {
    console.error("Failed to persist session store:", e);
  }
};

let storeData = loadAllStores();
let weeklyStore = storeData.weekly;
let monthlyStore = storeData.monthly;
let reportStore = createReportStore();

const cappedAppend = (arr, item, max) => {
  const n = [...arr, item];
  return n.length > max ? n.slice(n.length - max) : n;
};

function pushToPersistentStores(bucket, event) {
  const enriched = {
    ...event,
    dateKey: getDateKey(event.timestamp || new Date()),
    storedAt: new Date().toISOString(),
  };
  weeklyStore[bucket] = [...weeklyStore[bucket], enriched];
  monthlyStore[bucket] = [...monthlyStore[bucket], enriched];
  const result = saveAndTrimStores(weeklyStore, monthlyStore);
  weeklyStore = result.weekly;
  monthlyStore = result.monthly;
}

// ═════════════════════════════════════════════════════════════════════════════
// ICONS
// ═════════════════════════════════════════════════════════════════════════════

const IconTrash = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6M9 6V4h6v2" />
  </svg>
);
const IconShield = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);
const IconMission = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="3" />
    <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
    <path d="M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12" />
  </svg>
);
const IconCheckCircle = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);
const IconRefresh = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M23 4v6h-6" />
    <path d="M1 20v-6h6" />
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
  </svg>
);
const IconArchive = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15V4a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v15m20-10H3m2-5h14v2H5z" />
  </svg>
);
const IconX = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// ═════════════════════════════════════════════════════════════════════════════
// STATE COLORS
// ═════════════════════════════════════════════════════════════════════════════

const STATE_COLORS = {
  IDLE: { bg: "bg-slate-100 dark:bg-slate-800", text: "text-slate-600 dark:text-slate-300", dot: "bg-slate-400" },
  WAIT_FOR_START: { bg: "bg-amber-50 dark:bg-amber-950/30", text: "text-amber-700 dark:text-amber-400", dot: "bg-amber-400" },
  DRIVE_TO_TAG: { bg: "bg-sky-50 dark:bg-sky-950/30", text: "text-sky-700 dark:text-sky-400", dot: "bg-sky-500" },
  PAUSED: { bg: "bg-orange-50 dark:bg-orange-950/30", text: "text-orange-700 dark:text-orange-400", dot: "bg-orange-400" },
  COMPLETE: { bg: "bg-green-50 dark:bg-green-950/30", text: "text-green-700 dark:text-green-400", dot: "bg-green-500" },
  WATCHDOG_FAULT: { bg: "bg-red-50 dark:bg-red-950/30", text: "text-red-700 dark:text-red-400", dot: "bg-red-500" },
  ABORTED: { bg: "bg-red-50 dark:bg-red-950/30", text: "text-red-700 dark:text-red-400", dot: "bg-red-400" },
  TAG_MISS: { bg: "bg-fuchsia-50 dark:bg-fuchsia-950/30", text: "text-fuchsia-700 dark:text-fuchsia-400", dot: "bg-fuchsia-500" },
  UNKNOWN: { bg: "bg-slate-100 dark:bg-slate-800", text: "text-slate-500 dark:text-slate-400", dot: "bg-slate-400" },
};

function getStateStyle(state) {
  return STATE_COLORS[state] ?? STATE_COLORS.UNKNOWN;
}

// ═════════════════════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═════════════════════════════════════════════════════════════════════════════

function EmptyState({ label, sub }) {
  return (
    <div className="text-center py-16 px-4">
      <div className="text-6xl mb-5">📭</div>
      <p className="text-slate-500 dark:text-slate-400 font-bold text-base">{label}</p>
      <p className="text-sm text-slate-400 mt-2">{sub}</p>
    </div>
  );
}

function StatChip({ label, val, color }) {
  return (
    <div className="text-center bg-white dark:bg-slate-900 rounded-xl border dark:border-slate-700 shadow-sm" style={{ padding: "12px 8px" }}>
      <div className={`text-2xl font-black ${color}`}>{val}</div>
      <div className="text-xs font-black uppercase tracking-wider text-slate-500 mt-1 leading-tight">{label}</div>
    </div>
  );
}

function ConfirmationModal({ isOpen, onClose, onConfirm, title, message, confirmText = "Yes, Clear All", cancelText = "Cancel" }) {
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-[1000]"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md mx-4 rounded-2xl overflow-hidden"
        style={{
          background: "linear-gradient(160deg, #1e293b 0%, #0f172a 100%)",
          border: "1px solid rgba(239,68,68,0.3)",
          boxShadow: "0 25px 60px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.05)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: "linear-gradient(90deg, transparent, #ef4444, transparent)" }} />
        <div className="flex items-center justify-between px-6 pt-5 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl" style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.25)" }}>
              <IconTrash size={22} style={{ color: "#ef4444" }} />
            </div>
            <div className="text-white font-black text-lg tracking-wide">{title || "Clear Dashboard View"}</div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg transition hover:bg-white/10" aria-label="Close">
            <IconX size={20} className="text-white/60" />
          </button>
        </div>
        <div className="px-6 py-4">
          <p className="text-slate-300 text-base leading-relaxed">{message}</p>
          <div className="mt-4 p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.05)" }}>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <div className="text-amber-400 font-black text-lg">{reportStore.allSafety.length}</div>
                <div className="text-slate-400 text-[10px] font-black uppercase tracking-wider">Safety</div>
              </div>
              <div>
                <div className="text-sky-400 font-black text-lg">{reportStore.allMission.length}</div>
                <div className="text-slate-400 text-[10px] font-black uppercase tracking-wider">Mission</div>
              </div>
              <div>
                <div className="text-emerald-400 font-black text-lg">{reportStore.allCompleted.length}</div>
                <div className="text-slate-400 text-[10px] font-black uppercase tracking-wider">Completed</div>
              </div>
            </div>
          </div>
        </div>
        <div className="px-6 pb-5 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl font-black text-sm uppercase tracking-wider text-white/80 transition-all hover:bg-white/10 active:scale-95"
            style={{ background: "rgba(255,255,255,0.08)" }}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl font-black text-sm uppercase tracking-wider text-white transition-all active:scale-95"
            style={{ background: "linear-gradient(135deg, #dc2626 0%, #ef4444 100%)" }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// EXCEL STYLING
// ═════════════════════════════════════════════════════════════════════════════

const DARK_BLUE = "1F4E78";
const LIGHT_BLUE = "D9E1F2";
const WHITE = "FFFFFF";
const GRAY_EVEN = "F2F2F2";
const GREEN_FILL = "C6EFCE";
const GREEN_FONT = "006100";
const RED_FILL = "FFC7CE";
const RED_FONT = "9C0006";

const THIN_BORDER = {
  top: { style: "thin", color: { argb: "FF000000" } },
  left: { style: "thin", color: { argb: "FF000000" } },
  bottom: { style: "thin", color: { argb: "FF000000" } },
  right: { style: "thin", color: { argb: "FF000000" } },
};

function applyTitleStyle(cell) {
  cell.font = { bold: true, size: 14, color: { argb: `FF${WHITE}` }, name: "Arial" };
  cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: `FF${DARK_BLUE}` } };
  cell.alignment = { horizontal: "center", vertical: "middle" };
  cell.border = THIN_BORDER;
}

function applySubtitleStyle(cell) {
  cell.font = { italic: true, size: 10, color: { argb: `FF${DARK_BLUE}` }, name: "Arial" };
  cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: `FF${LIGHT_BLUE}` } };
  cell.alignment = { horizontal: "center", vertical: "middle" };
  cell.border = THIN_BORDER;
}

function applyHeaderStyle(cell) {
  cell.font = { bold: true, size: 11, color: { argb: `FF${WHITE}` }, name: "Arial" };
  cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: `FF${DARK_BLUE}` } };
  cell.alignment = { horizontal: "center", vertical: "middle" };
  cell.border = THIN_BORDER;
}

function applyDataStyle(cell, rowIdx, align = "left") {
  const isEven = rowIdx % 2 === 0;
  cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: isEven ? `FF${GRAY_EVEN}` : `FF${WHITE}` } };
  cell.alignment = { horizontal: align, vertical: "middle" };
  cell.border = THIN_BORDER;
  cell.font = { name: "Arial", size: 10 };
}

function applyStatusStyle(cell, color) {
  if (color === "GREEN") {
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: `FF${GREEN_FILL}` } };
    cell.font = { bold: true, size: 10, color: { argb: `FF${GREEN_FONT}` }, name: "Arial" };
  } else {
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: `FF${RED_FILL}` } };
    cell.font = { bold: true, size: 10, color: { argb: `FF${RED_FONT}` }, name: "Arial" };
  }
  cell.alignment = { horizontal: "center", vertical: "middle" };
  cell.border = THIN_BORDER;
}

async function downloadBuffer(wb, filename) {
  const buffer = await wb.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  saveAs(blob, filename);
}

// ═════════════════════════════════════════════════════════════════════════════
// WEEKLY REPORT GENERATOR
// ═════════════════════════════════════════════════════════════════════════════

const generateWeeklyReport = (safetyRows, missionRows, completedRows, startDate, endDate) => {
  const wb = new ExcelJS.Workbook();
  wb.creator = "Safety Dashboard";
  wb.created = new Date();

  // ── Cover sheet ──
  const cover = wb.addWorksheet("Weekly Report Cover");
  cover.columns = [{ width: 45 }, { width: 15 }, { width: 16 }, { width: 20 }, { width: 20 }, { width: 16 }, { width: 12 }];
  let r = 1;

  cover.mergeCells(`A${r}:G${r}`);
  cover.getRow(r).height = 30;
  const titleCell = cover.getCell(`A${r}`);
  titleCell.value = "WEEKLY SAFETY & MISSION REPORT";
  titleCell.font = { bold: true, size: 18, name: "Arial", color: { argb: `FF${WHITE}` } };
  titleCell.alignment = { horizontal: "center", vertical: "middle" };
  titleCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: `FF${DARK_BLUE}` } };
  titleCell.border = THIN_BORDER;
  r += 2;

  [
    [`Report Period: ${startDate} to ${endDate}`, 12, true],
    [`Generated: ${new Date().toLocaleString()}`, 10, false],
    [`Data source: Persistent across disconnects (30-day storage)`, 10, false],
  ].forEach(([val, size, bold]) => {
    cover.mergeCells(`A${r}:G${r}`);
    cover.getRow(r).height = 20;
    const c = cover.getCell(`A${r}`);
    c.value = val;
    c.font = { size, name: "Arial", bold, italic: !bold };
    c.alignment = { horizontal: "center" };
    r++;
  });
  r++;

  cover.mergeCells(`A${r}:G${r}`);
  cover.getRow(r).height = 25;
  const es = cover.getCell(`A${r}`);
  es.value = "EXECUTIVE SUMMARY";
  es.font = { bold: true, size: 13, name: "Arial", color: { argb: `FF${WHITE}` } };
  es.alignment = { horizontal: "center", vertical: "middle" };
  es.fill = { type: "pattern", pattern: "solid", fgColor: { argb: `FF${DARK_BLUE}` } };
  es.border = THIN_BORDER;
  r++;

  const watchdogCount = missionRows.filter((x) => x.state === "WATCHDOG_FAULT").length;
  const imuFaultCount = safetyRows.filter((x) => x.signal === "imu" && x.statusColor === "red").length;
  const pgvPoseFaultCount = safetyRows.filter((x) => x.signal === "pgv_pose" && x.statusColor === "red").length;
  const bumperFaultCount = safetyRows.filter(
    (x) => (x.signal === "front_bumper" || x.signal === "rear_bumper") && x.statusColor === "red"
  ).length;
  const motorFaultCount = safetyRows.filter(
    (x) => (x.signal || "").startsWith("motor_") && x.statusColor === "red"
  ).length;

  const safetyByDate = {};
  safetyRows.forEach((r2) => {
    const dk = r2.dateKey || getDateKey();
    safetyByDate[dk] = (safetyByDate[dk] || 0) + 1;
  });
  const missionByDate = {};
  missionRows.forEach((r2) => {
    const dk = r2.dateKey || getDateKey();
    missionByDate[dk] = (missionByDate[dk] || 0) + 1;
  });

  [
    ["Metric", "Value"],
    ["Total Safety Events (this week)", safetyRows.length],
    ["Total Mission Events (this week)", missionRows.length],
    ["Total Completed Missions (this week)", completedRows.length],
    ["Watchdog Faults", watchdogCount],
    ["IMU Faults", imuFaultCount],
    ["PGV Pose Faults", pgvPoseFaultCount],
    ["Bumper Faults", bumperFaultCount],
    ["Motor Faults", motorFaultCount],
    ["Days with Safety Activity", Object.keys(safetyByDate).length],
    ["Days with Mission Activity", Object.keys(missionByDate).length],
  ].forEach((row, idx) => {
    cover.getRow(r).height = 20;
    row.forEach((val, ci) => {
      const c = cover.getCell(r, ci + 1);
      c.value = val;
      c.border = THIN_BORDER;
      if (idx === 0) {
        c.font = { bold: true, size: 11, name: "Arial" };
        c.fill = { type: "pattern", pattern: "solid", fgColor: { argb: `FF${LIGHT_BLUE}` } };
        c.alignment = { horizontal: ci === 0 ? "left" : "center", vertical: "middle" };
      } else {
        c.font = { name: "Arial", size: 10 };
        c.alignment = { horizontal: ci === 0 ? "left" : "center", vertical: "middle" };
      }
    });
    r++;
  });

  // ── Safety Events sheet ──
  const ilSheet = wb.addWorksheet("Safety Events");
  ilSheet.columns = [{ width: 5 }, { width: 12 }, { width: 22 }, { width: 20 }, { width: 12 }, { width: 25 }];
  ilSheet.mergeCells("A1:F1");
  ilSheet.getRow(1).height = 28;
  const ilT = ilSheet.getCell("A1");
  ilT.value = "SAFETY EVENTS — WEEKLY REPORT";
  applyTitleStyle(ilT);
  ilSheet.mergeCells("A2:F2");
  ilSheet.getRow(2).height = 18;
  const ilS = ilSheet.getCell("A2");
  ilS.value = `Period: ${startDate} to ${endDate} | Generated: ${new Date().toLocaleString()}`;
  applySubtitleStyle(ilS);
  ilSheet.getRow(4).height = 22;
  ["No.", "Date", "Timestamp", "Device", "Status", "Health"].forEach((h, i) => {
    const c = ilSheet.getCell(4, i + 1);
    c.value = h;
    applyHeaderStyle(c);
  });
  safetyRows.forEach((row2, idx) => {
    const rn = 5 + idx;
    ilSheet.getRow(rn).height = 20;
    [[idx + 1, "center"], [row2.dateKey || "—", "center"], [row2.timestampFormatted || "—", "left"], [row2.signalLabel || "—", "left"]].forEach(
      ([v, a], ci) => {
        const c = ilSheet.getCell(rn, ci + 1);
        c.value = v;
        applyDataStyle(c, idx, a);
      }
    );
    const st = ilSheet.getCell(rn, 5);
    st.value = row2.statusColor?.toUpperCase() || "—";
    applyStatusStyle(st, st.value);
    const hl = ilSheet.getCell(rn, 6);
    hl.value = sanitizeStatus(row2.status) || "—";
    applyDataStyle(hl, idx, "left");
  });

  // ── Mission Events sheet ──
  const msSheet = wb.addWorksheet("Mission Events");
  msSheet.columns = [
    { width: 5 },
    { width: 12 },
    { width: 22 },
    { width: 21 },
    { width: 8 },
    { width: 10 },
    { width: 10 },
    { width: 12 },
    { width: 15 },
    { width: 22 },
  ];
  msSheet.mergeCells("A1:J1");
  msSheet.getRow(1).height = 28;
  const msT = msSheet.getCell("A1");
  msT.value = "MISSION EVENTS (STEP-BY-STEP) — WEEKLY REPORT";
  applyTitleStyle(msT);
  msSheet.mergeCells("A2:J2");
  msSheet.getRow(2).height = 18;
  const msS = msSheet.getCell("A2");
  msS.value = `Period: ${startDate} to ${endDate} | Generated: ${new Date().toLocaleString()}`;
  applySubtitleStyle(msS);
  msSheet.getRow(4).height = 22;
  ["No.", "Date", "Timestamp", "State", "Step", "Tag", "Target", "Speed (m/s)", "Missed Tag", "Mission File"].forEach((h, i) => {
    const c = msSheet.getCell(4, i + 1);
    c.value = h;
    applyHeaderStyle(c);
  });
  missionRows.forEach((row2, idx) => {
    const rn = 5 + idx;
    msSheet.getRow(rn).height = 20;
    [
      [idx + 1, "center"],
      [row2.dateKey || "—", "center"],
      [row2.timestampFormatted || "—", "left"],
      [row2.state || "—", "left"],
      [row2.step || "—", "center"],
      [row2.currentTag || "—", "center"],
      [row2.targetTag || "—", "center"],
      [row2.speed ?? "—", "center"],
      [row2.missedTag != null ? `${row2.missedTag}` : "—", "center"],
      [row2.missionFile || "—", "left"],
    ].forEach(([v, a], ci) => {
      const c = msSheet.getCell(rn, ci + 1);
      c.value = v;
      applyDataStyle(c, idx, a);
    });
  });

  // ── Completed Missions sheet ──
  const cmSheet = wb.addWorksheet("Completed Missions");
  cmSheet.columns = [{ width: 5 }, { width: 12 }, { width: 22 }, { width: 22 }, { width: 10 }, { width: 14 }, { width: 10 }];
  cmSheet.mergeCells("A1:G1");
  cmSheet.getRow(1).height = 28;
  const cmT = cmSheet.getCell("A1");
  cmT.value = "COMPLETED MISSIONS — WEEKLY REPORT";
  applyTitleStyle(cmT);
  cmSheet.mergeCells("A2:G2");
  cmSheet.getRow(2).height = 18;
  const cmS = cmSheet.getCell("A2");
  cmS.value = `Period: ${startDate} to ${endDate} | Generated: ${new Date().toLocaleString()}`;
  applySubtitleStyle(cmS);
  cmSheet.getRow(4).height = 22;
  ["No.", "Date", "Completed At", "Mission File", "Steps", "Duration", "Loop"].forEach((h, i) => {
    const c = cmSheet.getCell(4, i + 1);
    c.value = h;
    applyHeaderStyle(c);
  });
  completedRows.forEach((row2, idx) => {
    const rn = 5 + idx;
    cmSheet.getRow(rn).height = 20;
    [
      [idx + 1, "center"],
      [row2.dateKey || "—", "center"],
      [row2.timestampFormatted || "—", "left"],
      [row2.missionFile || "—", "left"],
      [row2.totalSteps || 0, "center"],
      [row2.durationFormatted || "—", "left"],
      [row2.loop ? "ON" : "OFF", "center"],
    ].forEach(([v, a], ci) => {
      const c = cmSheet.getCell(rn, ci + 1);
      c.value = v;
      applyDataStyle(c, idx, a);
    });
  });

  return wb;
};

// ═════════════════════════════════════════════════════════════════════════════
// TABLE STYLES
// ═════════════════════════════════════════════════════════════════════════════

const tableContainerStyle = {
  maxHeight: "500px",
  overflowY: "auto",
  overflowX: "auto",
  border: "1px solid #e2e8f0",
  borderRadius: "0.5rem",
  backgroundColor: "transparent",
};
const darkTableContainerStyle = { ...tableContainerStyle, border: "1px solid #1e293b" };
const tableHeaderStickyStyle = { position: "sticky", top: 0, zIndex: 10 };

// ═════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═════════════════════════════════════════════════════════════════════════════

export default function Reports() {
  const { t } = useLanguage();
  const { connected, subscribe } = useROS();

  const tRef = useRef(t);
  useEffect(() => {
    tRef.current = t;
  });

  const imuTimeoutRef = useRef(null);
  const pgvPoseTimeoutRef = useRef(null);
  const staleCheckRef = useRef(null);
  const motorFaultStateRef = useRef({});

  const [activeTab, setActiveTab] = useState("interlock");
  const [safetyReports, setSafetyReports] = useState(reportStore.safetyReports);
  const [missionReports, setMissionReports] = useState(reportStore.missionReports);
  const [completedMissions, setCompletedMissions] = useState(reportStore.completedMissions);
  const [tagMissCount, setTagMissCount] = useState(reportStore.tagMissCount);
  const [plcSignals, setPlcSignals] = useState(reportStore.plcSignals);
  const [isDataStale, setIsDataStale] = useState(reportStore.isDataStale);
  const [isMissionActive, setIsMissionActive] = useState(reportStore.isMissionActive);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [archivedReports, setArchivedReports] = useState(loadArchive());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [weeklyCountSafety, setWeeklyCountSafety] = useState(0);
  const [weeklyCountMission, setWeeklyCountMission] = useState(0);
  const [weeklyCountCompleted, setWeeklyCountCompleted] = useState(0);

  const isDark = () => document.documentElement.classList.contains("dark");

  // ─── weekly counts ───
  const refreshWeeklyCounts = useCallback(() => {
    const wk = getThisWeeksData(weeklyStore);
    setWeeklyCountSafety(wk.safety.length);
    setWeeklyCountMission(wk.mission.length);
    setWeeklyCountCompleted(wk.completed.length);
  }, []);

  useEffect(() => {
    refreshWeeklyCounts();
  }, [refreshWeeklyCounts]);

  // ─── sync from module-level store ───
  const syncStateFromStore = useCallback(() => {
    setSafetyReports([...reportStore.safetyReports]);
    setMissionReports([...reportStore.missionReports]);
    setCompletedMissions([...reportStore.completedMissions]);
    setTagMissCount(reportStore.tagMissCount);
    setPlcSignals({ ...reportStore.plcSignals });
    setIsDataStale(reportStore.isDataStale);
    setIsMissionActive(reportStore.isMissionActive);
    refreshWeeklyCounts();
  }, [refreshWeeklyCounts]);

  useEffect(() => {
    syncStateFromStore();
  }, [syncStateFromStore]);

  // ─── MANUAL "REFRESH VIEW" BUTTON ───────────────────────────────────────
  const handleRefreshView = useCallback(() => {
    setIsRefreshing(true);
    try {
      const fresh = loadAllStores();
      weeklyStore = fresh.weekly;
      monthlyStore = fresh.monthly;

      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          const recordedStates = parsed.recordedStates ? new Set(parsed.recordedStates) : reportStore.recordedStates;
          const recordedFaults = parsed.recordedFaults ? new Set(parsed.recordedFaults) : reportStore.recordedFaults;
          const activeMissions = parsed.activeMissions ? { ...parsed.activeMissions } : reportStore.activeMissions;

          if (parsed.safetyReports) parsed.safetyReports = sanitizeSafetyArray(parsed.safetyReports);
          if (parsed.allSafety) parsed.allSafety = sanitizeSafetyArray(parsed.allSafety);

          Object.assign(reportStore, parsed, { recordedStates, recordedFaults, activeMissions });
        }
      } catch (e) {
        console.error("Failed to refresh session store:", e);
      }

      setArchivedReports(loadArchive());
      syncStateFromStore();
    } finally {
      setTimeout(() => setIsRefreshing(false), 400);
    }
  }, [syncStateFromStore]);

  // ─── REAL-TIME EVENT LISTENERS ────────────────────────────────────────
  useEffect(() => {
    const unsubscribeSafety = reportEmitter.on("safetyReportAdded", (newReport) => {
      setSafetyReports(prev => {
        const updated = [...prev, newReport];
        return updated.length > MAX_DISPLAY ? updated.slice(-MAX_DISPLAY) : updated;
      });
      refreshWeeklyCounts();
    });

    const unsubscribeMission = reportEmitter.on("missionReportAdded", (newReport) => {
      setMissionReports(prev => {
        const updated = [...prev, newReport];
        return updated.length > MAX_DISPLAY ? updated.slice(-MAX_DISPLAY) : updated;
      });
      refreshWeeklyCounts();
    });

    const unsubscribeCompleted = reportEmitter.on("completedMissionAdded", (newReport) => {
      setCompletedMissions(prev => {
        const updated = [...prev, newReport];
        return updated.length > MAX_DISPLAY ? updated.slice(-MAX_DISPLAY) : updated;
      });
      refreshWeeklyCounts();
    });

    return () => {
      unsubscribeSafety?.();
      unsubscribeMission?.();
      unsubscribeCompleted?.();
    };
  }, [refreshWeeklyCounts]);

  useEffect(() => {
    const onVisibility = () => {
      if (!document.hidden) syncStateFromStore();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [syncStateFromStore]);

  // ─────────────────────────────────────────────────────────────────────────
  // HELPERS
  // ─────────────────────────────────────────────────────────────────────────

  const RED_WHEN_TRUE = ["work_over", "reset", "front_estop", "back_estop"];
  const INVERTED_LOGIC = ["front_bumper", "rear_bumper"];

  const getHealthStatus = (name, value) => {
    if (INVERTED_LOGIC.includes(name)) return value ? t("report.val_healthy") : "Fault Triggered";
    const isRed = RED_WHEN_TRUE.includes(name) ? value : !value;
    return isRed ? "Fault Triggered" : t("report.val_healthy");
  };

  const getDisplayValue = (name, value) => {
    if (INVERTED_LOGIC.includes(name)) return !value;
    if (["front_lidar", "back_lidar"].includes(name)) return !value;
    return value;
  };

  const markDataFresh = () => {
    reportStore.lastDataUpdate = Date.now();
    reportStore.isDataStale = false;
    setIsDataStale(false);
    clearTimeout(staleCheckRef.current);
    staleCheckRef.current = setTimeout(() => {
      reportStore.isDataStale = true;
      setIsDataStale(true);
      persistSessionStore(reportStore);
    }, STALE_TIMEOUT_MS);
  };

  // ─── auto-archive ───
  const autoArchiveWeeklyReport = useCallback(() => {
    const wkData = getThisWeeksData(weeklyStore);
    if (!wkData.safety.length && !wkData.mission.length && !wkData.completed.length) return;
    const now = new Date();
    const wkNum = Math.ceil((now - new Date(now.getFullYear(), 0, 1)) / (7 * 24 * 60 * 60 * 1000));
    const { sow, eow } = getWeekBounds();
    addToArchive(wkData, wkNum, now.getFullYear(), sow.toLocaleDateString(), eow.toLocaleDateString());
    setArchivedReports(loadArchive());
  }, []);

  // ─────────────────────────────────────────────────────────────────────────
  // MESSAGE HANDLERS
  // ─────────────────────────────────────────────────────────────────────────

  const recordMissionStep = (activeMission, missionId, isStateChange = false) => {
    const timestamp = new Date();
    const stepEvent = {
      id: `${missionId}-step-${timestamp.getTime()}-${Math.random()}`,
      missionId,
      timestamp,
      timestampFormatted: timestamp.toLocaleString(),
      timestampISO: timestamp.toISOString(),
      dateKey: getDateKey(timestamp),
      state: activeMission.state || "UNKNOWN",
      step: activeMission.step || 0,
      totalSteps: activeMission.totalSteps || 0,
      currentTag: activeMission.currentTag || "—",
      targetTag: activeMission.targetTag || "—",
      action: activeMission.action || "—",
      speed: activeMission.speed || "0.00",
      distanceTraveled: activeMission.distanceTraveled || "0.00",
      safetyActive: activeMission.safetyActive || false,
      loop: activeMission.loop || false,
      missionFile: activeMission.missionFile || "—",
      missedTag: activeMission.missedTag || null,
      lastSeenTag: activeMission.lastSeenTag || null,
      distanceTraveledAtFault: activeMission.distanceTraveledAtFault || null,
      eventType: isStateChange ? "STATE_CHANGE" : "STEP_UPDATE",
    };
    reportStore.missionReports = cappedAppend(reportStore.missionReports, stepEvent, MAX_DISPLAY);
    reportStore.allMission = [...reportStore.allMission, stepEvent];
    setMissionReports([...reportStore.missionReports]);

    reportEmitter.emit("missionReportAdded", stepEvent);

    pushToPersistentStores("mission", stepEvent);
    refreshWeeklyCounts();
    return stepEvent;
  };

  const handlePlcMsg = useRef((name, msg) => {
    const newValue = msg.data;
    const prev = reportStore.plcSignals[name];
    if (prev === newValue) return;

    reportStore.plcSignals = { ...reportStore.plcSignals, [name]: newValue };
    setPlcSignals({ ...reportStore.plcSignals });

    const timestamp = new Date();
    const healthStatus = getHealthStatus(name, newValue);

    let statusColor;
    if (INVERTED_LOGIC.includes(name)) statusColor = newValue ? "green" : "red";
    else if (RED_WHEN_TRUE.includes(name)) statusColor = newValue ? "red" : "green";
    else statusColor = newValue ? "green" : "red";

    const signalLabel = tRef.current(`health.${name}`) || name.replace(/_/g, " ").toUpperCase();

    const ev = {
      id: `${timestamp.getTime()}-${Math.random()}`,
      signal: name,
      signalLabel,
      value: newValue,
      displayValue: getDisplayValue(name, newValue),
      status: healthStatus,
      statusColor,
      timestamp,
      timestampFormatted: timestamp.toLocaleString(),
      timestampISO: timestamp.toISOString(),
      dateKey: getDateKey(timestamp),
    };

    reportStore.safetyReports = cappedAppend(reportStore.safetyReports, ev, MAX_DISPLAY);
    reportStore.allSafety = [...reportStore.allSafety, ev];

    reportEmitter.emit("safetyReportAdded", ev);

    pushToPersistentStores("safety", ev);
    refreshWeeklyCounts();
    markDataFresh();
    persistSessionStore(reportStore);
  });

  const handleMotorMsg = useRef((msg) => {
    const { left, right } = parseMotorErrorValues(msg.data);
    const timestamp = new Date();
    let anyChange = false;

    [{ side: "Left", err: left }, { side: "Right", err: right }].forEach(({ side, err }) => {
      const activeFaults = getActiveMotorFaults(err);
      const activeKeys = new Set(
        activeFaults.map(({ code }) => `motor_${side.toLowerCase()}_${code}`)
      );

      const knownEntries = Object.entries(MOTOR_ERROR_CODES).map(([codeStr, label]) => ({
        code: Number(codeStr),
        label,
      }));
      const unknownEntries = activeFaults.filter(
        (f) => !MOTOR_ERROR_CODES[f.code]
      );
      const candidates = [...knownEntries, ...unknownEntries];

      candidates.forEach(({ code, label }) => {
        const key = `motor_${side.toLowerCase()}_${code}`;
        const isActive = activeKeys.has(key);
        const wasActive = motorFaultStateRef.current[key] || false;

        if (isActive === wasActive) return;
        motorFaultStateRef.current[key] = isActive;
        anyChange = true;

        const signalLabel = `${side} Motor: ${label}`;
        const statusColor = isActive ? "red" : "green";
        const status = isActive ? "Fault Triggered" : tRef.current("report.val_healthy");

        const ev = {
          id: `${timestamp.getTime()}-${Math.random()}`,
          signal: key,
          signalLabel,
          value: isActive,
          displayValue: isActive,
          status,
          statusColor,
          timestamp,
          timestampFormatted: timestamp.toLocaleString(),
          timestampISO: timestamp.toISOString(),
          dateKey: getDateKey(timestamp),
        };

        reportStore.safetyReports = cappedAppend(reportStore.safetyReports, ev, MAX_DISPLAY);
        reportStore.allSafety = [...reportStore.allSafety, ev];

        reportEmitter.emit("safetyReportAdded", ev);

        pushToPersistentStores("safety", ev);
      });
    });

    if (anyChange) {
      refreshWeeklyCounts();
      markDataFresh();
      persistSessionStore(reportStore);
    }
  });

  const handleImuMsg = useRef((_msg) => {
    reportStore.plcSignals = { ...reportStore.plcSignals, imu: true };
    setPlcSignals({ ...reportStore.plcSignals });
    markDataFresh();

    clearTimeout(imuTimeoutRef.current);
    imuTimeoutRef.current = setTimeout(() => {
      reportStore.plcSignals = { ...reportStore.plcSignals, imu: false };
      setPlcSignals({ ...reportStore.plcSignals });

      const ft = new Date();
      const faultEv = {
        id: `${ft.getTime()}-${Math.random()}`,
        signal: "imu",
        signalLabel: "IMU Sensor",
        value: false,
        displayValue: false,
        status: "Fault Triggered",
        statusColor: "red",
        timestamp: ft,
        timestampFormatted: ft.toLocaleString(),
        timestampISO: ft.toISOString(),
        dateKey: getDateKey(ft),
      };
      reportStore.safetyReports = cappedAppend(reportStore.safetyReports, faultEv, MAX_DISPLAY);
      reportStore.allSafety = [...reportStore.allSafety, faultEv];

      reportEmitter.emit("safetyReportAdded", faultEv);

      pushToPersistentStores("safety", faultEv);
      refreshWeeklyCounts();
      markDataFresh();
      persistSessionStore(reportStore);
    }, IMU_TIMEOUT_MS);
  });

  const handlePgvPoseMsg = useRef((_msg) => {
    reportStore.plcSignals = { ...reportStore.plcSignals, pgv_pose: true };
    setPlcSignals({ ...reportStore.plcSignals });
    markDataFresh();

    clearTimeout(pgvPoseTimeoutRef.current);
    pgvPoseTimeoutRef.current = setTimeout(() => {
      reportStore.plcSignals = { ...reportStore.plcSignals, pgv_pose: false };
      setPlcSignals({ ...reportStore.plcSignals });

      const ft = new Date();
      const faultEv = {
        id: `${ft.getTime()}-${Math.random()}`,
        signal: "pgv_pose",
        signalLabel: "PGV Pose",
        value: false,
        displayValue: false,
        status: "Fault Triggered",
        statusColor: "red",
        timestamp: ft,
        timestampFormatted: ft.toLocaleString(),
        timestampISO: ft.toISOString(),
        dateKey: getDateKey(ft),
      };
      reportStore.safetyReports = cappedAppend(reportStore.safetyReports, faultEv, MAX_DISPLAY);
      reportStore.allSafety = [...reportStore.allSafety, faultEv];

      reportEmitter.emit("safetyReportAdded", faultEv);

      pushToPersistentStores("safety", faultEv);
      refreshWeeklyCounts();
      markDataFresh();
      persistSessionStore(reportStore);
    }, PGV_POSE_TIMEOUT_MS);
  });

  const applyMissedTagToMission = (activeMission, w) => {
    const missedTagNum = w.missed_tag ?? w.missedTag ?? w.expected_tag ?? w.target_tag ?? "?";
    const lastSeen = w.last_seen_tag ?? w.lastSeenTag ?? w.current_tag ?? w.tag ?? "?";
    const distM = (((w.distance_traveled ?? w.distanceTraveled ?? w.distance ?? 0)) / 1000).toFixed(2);
    activeMission.missedTag = missedTagNum;
    activeMission.lastSeenTag = lastSeen;
    activeMission.distanceTraveledAtFault = distM;
    activeMission.state = "WATCHDOG_FAULT";
    reportStore.tagMissCount = (reportStore.tagMissCount || 0) + 1;
    setTagMissCount(reportStore.tagMissCount);
  };

  const handleWatchdogMsg = useRef((msg) => {
    if (!reportStore.isMissionActive) return;
    try {
      const w = JSON.parse(msg.data);
      const isFault = w.fault === true || w.error === true || w.status === "fault" || w.status === "error";
      if (!isFault) return;

      const timestamp = new Date();
      const missedTag = w.missed_tag ?? w.missedTag ?? w.expected_tag ?? w.target_tag ?? "?";
      const faultKey = `${missedTag}-${w.distance_traveled ?? 0}-${timestamp.getTime()}`;
      if (reportStore.recordedFaults.has(faultKey)) return;
      reportStore.recordedFaults.add(faultKey);

      const missionId = reportStore.currentMission?.mission_id || reportStore.currentMission?.mission_file || `mission-${Date.now()}`;
      if (reportStore.activeMissions[missionId]) {
        const am = reportStore.activeMissions[missionId];
        applyMissedTagToMission(am, w);
        recordMissionStep(am, missionId, true);
      }
      markDataFresh();
      persistSessionStore(reportStore);
    } catch (_) { }
  });

  const handleMissionMsg = useRef((msg) => {
    try {
      const s = JSON.parse(msg.data);
      reportStore.currentMission = s;

      const isStarting = s.state === "WAIT_FOR_START" || s.state === "DRIVE_TO_TAG" || s.state === "PAUSED";

      if (isStarting && !reportStore.isMissionActive) {
        reportStore.isMissionActive = true;
        setIsMissionActive(true);
        reportStore.missionReports = [];
        reportStore.allMission = [];
        reportStore.recordedFaults.clear();
        reportStore.recordedStates.clear();
        reportStore.activeMissions = {};
        reportStore.tagMissCount = 0;
        reportStore.lastState = null;
        reportStore.missionAccum = {};
        setMissionReports([]);
        setTagMissCount(0);
        persistSessionStore(reportStore);
      }

      if (s.state === "IDLE") {
        if (reportStore.isMissionActive) {
          reportStore.isMissionActive = false;
          setIsMissionActive(false);
          reportStore.recordedStates.clear();
          reportStore.activeMissions = {};
          persistSessionStore(reportStore);
        }
        markDataFresh();
        persistSessionStore(reportStore);
        return;
      }

      if (!reportStore.isMissionActive) {
        markDataFresh();
        persistSessionStore(reportStore);
        return;
      }

      const missionId = s.mission_id || s.mission_file || `mission-${Date.now()}`;
      const timestamp = new Date();

      if (reportStore.activeMissions[missionId]) {
        const ex = reportStore.activeMissions[missionId];
        const stepChanged = ex.step !== (s.step ?? ex.step);
        const distChanged = Math.abs(parseFloat(ex.distanceTraveled || 0) - parseFloat((s.distance_traveled ?? 0) / 1000)) > 0.1;
        const stateChanged = ex.state !== s.state;

        ex.state = s.state ?? ex.state;
        ex.step = s.step ?? ex.step;
        ex.totalSteps = s.total_steps ?? ex.totalSteps;
        ex.currentTag = s.tag ?? ex.currentTag;
        ex.targetTag = s.target_tag ?? ex.targetTag;
        ex.action = s.action ?? ex.action;
        ex.speed = (s.speed ?? 0).toFixed(2);
        ex.distanceTraveled = (((s.distance_traveled ?? 0) / 1000)).toFixed(2);
        ex.safetyActive = s.safety_active === true || s.safety_active === "true";
        ex.loop = s.loop ?? ex.loop;
        ex.timestampFormatted = timestamp.toLocaleString();
        ex.timestampISO = timestamp.toISOString();

        if (s.state === "WATCHDOG_FAULT" && stateChanged) {
          const faultKey = `${missionId}-${s.target_tag}-${s.distance_traveled ?? 0}`;
          if (!reportStore.recordedFaults.has(faultKey)) {
            reportStore.recordedFaults.add(faultKey);
            applyMissedTagToMission(ex, {
              missed_tag: s.target_tag,
              last_seen_tag: s.tag,
              distance_traveled: s.distance_traveled ?? 0,
            });
          }
        } else if (stateChanged && ex.missedTag != null) {
          ex.missedTag = null;
          ex.lastSeenTag = null;
          ex.distanceTraveledAtFault = null;
        }

        if (stepChanged || distChanged || stateChanged) recordMissionStep(ex, missionId, stateChanged);
      }
      else {
        const ev = {
          id: `${missionId}-${timestamp.getTime()}`,
          missionId,
          timestamp,
          timestampFormatted: timestamp.toLocaleString(),
          timestampISO: timestamp.toISOString(),
          dateKey: getDateKey(timestamp),
          state: s.state ?? "UNKNOWN",
          missionFile: s.mission_file ?? "—",
          step: s.step ?? 0,
          totalSteps: s.total_steps ?? 0,
          targetTag: s.target_tag ?? "—",
          currentTag: s.tag ?? "—",
          action: s.action ?? "—",
          speed: (s.speed ?? 0).toFixed(2),
          distanceTraveled: (((s.distance_traveled ?? 0) / 1000)).toFixed(2),
          safetyActive: s.safety_active === true || s.safety_active === "true",
          loop: s.loop ?? false,
          missedTag: null,
          lastSeenTag: null,
          persistedOnce: false,
        };

        if (s.state === "WATCHDOG_FAULT") {
          applyMissedTagToMission(ev, {
            missed_tag: s.target_tag,
            last_seen_tag: s.tag,
            distance_traveled: s.distance_traveled ?? 0,
          });
        }

        reportStore.activeMissions[missionId] = ev;
        reportStore.missionReports = cappedAppend(reportStore.missionReports, ev, MAX_DISPLAY);
        reportStore.allMission = [...reportStore.allMission, ev];
        setMissionReports([...reportStore.missionReports]);

        reportEmitter.emit("missionReportAdded", ev);

        pushToPersistentStores("mission", ev);
        refreshWeeklyCounts();
      }

      if (s.state === "COMPLETE") {
        const cm = reportStore.activeMissions[missionId];
        if (!cm) {
          console.warn("COMPLETE but no active mission!");
          return;
        }

        const endTime = new Date();
        const startTime = cm.timestamp || new Date();
        const duration = Math.round((endTime - startTime) / 1000);

        const ce = {
          id: `${missionId}-completed-${endTime.getTime()}`,
          missionId,
          timestamp: endTime,
          startTime,
          timestampFormatted: endTime.toLocaleString(),
          timestampISO: endTime.toISOString(),
          dateKey: getDateKey(endTime),
          missionFile: cm.missionFile ?? "—",
          totalSteps: cm.totalSteps ?? 0,
          currentTag: cm.currentTag ?? "—",
          targetTag: cm.targetTag ?? "—",
          distanceTraveled: cm.distanceTraveled ?? "—",
          loop: cm.loop ?? false,
          durationSec: duration,
          durationFormatted:
            duration >= 60 ? `${Math.floor(duration / 60)}m ${duration % 60}s` : `${duration}s`,
          finalState: s.state,
          finalStep: cm.step ?? 0,
          finalSpeed: cm.speed ?? "0.00",
          safetyWasActive: cm.safetyActive ?? false,
        };

        reportStore.completedMissions = cappedAppend(reportStore.completedMissions, ce, MAX_DISPLAY);
        reportStore.allCompleted = [...reportStore.allCompleted, ce];
        setCompletedMissions([...reportStore.completedMissions]);

        reportEmitter.emit("completedMissionAdded", ce);

        pushToPersistentStores("completed", ce);
        refreshWeeklyCounts();

        delete reportStore.activeMissions[missionId];
        reportStore.isMissionActive = false;
        setIsMissionActive(false);
        reportStore.recordedStates.clear();
        markDataFresh();
        persistSessionStore(reportStore);
      }

      if (s.state === "ABORTED") {
        delete reportStore.activeMissions[missionId];
        reportStore.isMissionActive = false;
        setIsMissionActive(false);
        reportStore.recordedStates.clear();
        markDataFresh();
        persistSessionStore(reportStore);
      }

      markDataFresh();
      persistSessionStore(reportStore);
    } catch (e) {
      console.error("handleMissionMsg error:", e);
    }
  });

  // ─── subscriptions ───
  useEffect(() => {
    if (!connected) {
      if (reportStore.subscribed) {
        reportStore.unsubscribers?.forEach((u) => u?.());
        reportStore.unsubscribers = [];
        reportStore.subscribed = false;
        clearTimeout(imuTimeoutRef.current);
        clearTimeout(pgvPoseTimeoutRef.current);
        clearTimeout(staleCheckRef.current);
      }
      motorFaultStateRef.current = {};
      return;
    }
    if (reportStore.subscribed) return;
    reportStore.subscribed = true;
    reportStore.unsubscribers = [];

    reportStore.unsubscribers.push(
      subscribe("/mission/status", "std_msgs/String", (msg) => handleMissionMsg.current(msg)),
      subscribe("/watchdog/status", "std_msgs/String", (msg) => handleWatchdogMsg.current(msg)),
      subscribe("/imu/data", "sensor_msgs/Imu", (msg) => handleImuMsg.current(msg)),
      subscribe("/pgv_pose", "geometry_msgs/Pose2D", (msg) => handlePgvPoseMsg.current(msg)),
      subscribe("/moons_motor_diagnostics", "std_msgs/String", (msg) => handleMotorMsg.current(msg))
    );
    [
      { name: "work_over", topic: "/plc/work_over" },
      { name: "front_estop", topic: "/plc/front_estop" },
      { name: "back_estop", topic: "/plc/back_estop" },
      { name: "reset", topic: "/plc/reset" },
      { name: "front_lidar", topic: "/plc/front_lidar" },
      { name: "back_lidar", topic: "/plc/back_lidar" },
      { name: "front_bumper", topic: "/plc/front_bumper" },
      { name: "rear_bumper", topic: "/plc/back_bumper" },
    ].forEach(({ name, topic }) => {
      reportStore.unsubscribers.push(subscribe(topic, "std_msgs/Bool", (msg) => handlePlcMsg.current(name, msg)));
    });
    markDataFresh();
  }, [connected, subscribe]);

  useEffect(
    () => () => {
      clearTimeout(imuTimeoutRef.current);
      clearTimeout(pgvPoseTimeoutRef.current);
      clearTimeout(staleCheckRef.current);
    },
    []
  );

  // ─────────────────────────────────────────────────────────────────────────
  // DOWNLOAD HANDLERS
  // ─────────────────────────────────────────────────────────────────────────

  const ts = () => new Date().toISOString().slice(0, 19).replace(/:/g, "-");

  const downloadWeeklyReport = async () => {
    try {
      const wkData = getThisWeeksData(weeklyStore);
      if (!wkData.safety.length && !wkData.mission.length && !wkData.completed.length) {
        alert("No data for this week yet.");
        return;
      }
      const now = new Date();
      const wkNum = Math.ceil((now - new Date(now.getFullYear(), 0, 1)) / (7 * 24 * 60 * 60 * 1000));
      const { sow, eow } = getWeekBounds();
      const sd = sow.toLocaleDateString();
      const ed = eow.toLocaleDateString();
      const wb = generateWeeklyReport(wkData.safety, wkData.mission, wkData.completed, sd, ed);
      await downloadBuffer(
        wb,
        `weekly_report_${now.getFullYear()}_week${wkNum}_${sd.replace(/\//g, "-")}_to_${ed.replace(
          /\//g,
          "-"
        )}.xlsx`
      );
      autoArchiveWeeklyReport();
    } catch (err) {
      console.error(err);
      alert("Error: " + err.message);
    }
  };

  const downloadArchivedReport = async (entry) => {
    try {
      const { data, startDate, endDate, weekNumber, year } = entry;
      const wb = generateWeeklyReport(data.safety, data.mission, data.completed, startDate, endDate);
      await downloadBuffer(
        wb,
        `archived_weekly_report_${year}_week${weekNumber}_${startDate.replace(/\//g, "-")}_to_${endDate.replace(
          /\//g,
          "-"
        )}.xlsx`
      );
    } catch (err) {
      console.error(err);
      alert("Error: " + err.message);
    }
  };

  const downloadInterlockExcel = async () => {
    try {
      const allSafety = monthlyStore.safety || [];
      if (!allSafety.length) {
        alert("No safety data");
        return;
      }
      const wb = new ExcelJS.Workbook();
      const ws = wb.addWorksheet("Safety Events");
      ws.columns = [
        { width: 6 },
        { width: 12 },
        { width: 22 },
        { width: 26 },
        { width: 12 },
        { width: 25 }
      ];
      ws.mergeCells("A1:E1");
      ws.getRow(1).height = 28;
      const t1 = ws.getCell("A1");
      t1.value = "SAFETY EVENTS (30-Day History)";
      applyTitleStyle(t1);
      ws.mergeCells("A2:E2");
      ws.getRow(2).height = 18;
      const s1 = ws.getCell("A2");
      s1.value = `Generated: ${new Date().toLocaleString()} | Total: ${allSafety.length} events`;
      applySubtitleStyle(s1);
      ws.getRow(4).height = 22;
      ["No.", "Date", "Timestamp", "Device", "Status", "Health"].forEach((h, i) => {
        const c = ws.getCell(4, i + 1);
        c.value = h;
        applyHeaderStyle(c);
      });
      allSafety.forEach((row2, idx) => {
        const rn = 5 + idx;
        ws.getRow(rn).height = 20;
        [
          [idx + 1, "center"],
          [row2.dateKey || "—", "center"],
          [row2.timestampFormatted || "—", "left"],
          [row2.signalLabel || "—", "left"],
        ].forEach(([v, a], ci) => {
          const c = ws.getCell(rn, ci + 1);
          c.value = v;
          applyDataStyle(c, idx, a);
        });
        const st = ws.getCell(rn, 5);
        st.value = row2.statusColor?.toUpperCase() || "—";
        applyStatusStyle(st, st.value);
        const hl = ws.getCell(rn, 6);
        hl.value = sanitizeStatus(row2.status) || "—";
        applyDataStyle(hl, idx, "left");
      });
      await downloadBuffer(wb, `safety_report_${ts()}.xlsx`);
    } catch (err) {
      console.error(err);
      alert("Error: " + err.message);
    }
  };

  const downloadMissionExcel = async () => {
    try {
      const allMission = monthlyStore.mission || [];
      if (!allMission.length) {
        alert("No mission data");
        return;
      }
      const wb = new ExcelJS.Workbook();
      const ws = wb.addWorksheet("Mission Events");
      ws.columns = [
        { width: 6 },
        { width: 12 },
        { width: 22 },
        { width: 21 },
        { width: 8 },
        { width: 10 },
        { width: 10 },
        { width: 12 },
        { width: 15 },
        { width: 22 },
      ];
      ws.mergeCells("A1:J1");
      ws.getRow(1).height = 28;
      const t1 = ws.getCell("A1");
      t1.value = "MISSION EVENTS (STEP-BY-STEP, 30-Day History)";
      applyTitleStyle(t1);
      ws.mergeCells("A2:J2");
      ws.getRow(2).height = 18;
      const s1 = ws.getCell("A2");
      s1.value = `Generated: ${new Date().toLocaleString()} | Total: ${allMission.length} step events`;
      applySubtitleStyle(s1);
      ws.getRow(4).height = 22;
      ["No.", "Date", "Timestamp", "State", "Step", "Tag", "Target", "Speed (m/s)", "Missed Tag", "Mission File"].forEach(
        (h, i) => {
          const c = ws.getCell(4, i + 1);
          c.value = h;
          applyHeaderStyle(c);
        }
      );
      allMission.forEach((row2, idx) => {
        const rn = 5 + idx;
        ws.getRow(rn).height = 20;
        [
          [idx + 1, "center"],
          [row2.dateKey || "—", "center"],
          [row2.timestampFormatted || "—", "left"],
          [row2.state || "—", "left"],
          [row2.step || "—", "center"],
          [row2.currentTag || "—", "center"],
          [row2.targetTag || "—", "center"],
          [row2.speed ?? "—", "center"],
          [row2.missedTag != null ? `${row2.missedTag}` : "—", "center"],
          [row2.missionFile || "—", "left"],
        ].forEach(([v, a], ci) => {
          const c = ws.getCell(rn, ci + 1);
          c.value = v;
          applyDataStyle(c, idx, a);
        });
      });
      await downloadBuffer(wb, `mission_report_${ts()}.xlsx`);
    } catch (err) {
      console.error(err);
      alert("Error: " + err.message);
    }
  };

  const downloadCompletedExcel = async () => {
    try {
      const allCompleted = monthlyStore.completed || [];
      if (!allCompleted.length) {
        alert("No completed mission data");
        return;
      }
      const wb = new ExcelJS.Workbook();
      const ws = wb.addWorksheet("Completed Missions");
      ws.columns = [
        { width: 6 },
        { width: 12 },
        { width: 22 },
        { width: 22 },
        { width: 10 },
        { width: 14 },
        { width: 8 },
      ];
      ws.mergeCells("A1:G1");
      ws.getRow(1).height = 28;
      const t1 = ws.getCell("A1");
      t1.value = "COMPLETED MISSIONS (30-Day History)";
      applyTitleStyle(t1);
      ws.mergeCells("A2:G2");
      ws.getRow(2).height = 18;
      const s1 = ws.getCell("A2");
      s1.value = `Generated: ${new Date().toLocaleString()} | Total: ${allCompleted.length} missions`;
      applySubtitleStyle(s1);
      ws.getRow(4).height = 22;
      ["No.", "Date", "Completed At", "Mission File", "Steps", "Duration", "Loop"].forEach((h, i) => {
        const c = ws.getCell(4, i + 1);
        c.value = h;
        applyHeaderStyle(c);
      });
      allCompleted.forEach((row2, idx) => {
        const rn = 5 + idx;
        ws.getRow(rn).height = 20;
        [
          [idx + 1, "center"],
          [row2.dateKey || "—", "center"],
          [row2.timestampFormatted || "—", "left"],
          [row2.missionFile || "—", "left"],
          [row2.totalSteps || 0, "center"],
          [row2.durationFormatted || "—", "left"],
          [row2.loop ? "ON" : "OFF", "center"],
        ].forEach(([v, a], ci) => {
          const c = ws.getCell(rn, ci + 1);
          c.value = v;
          applyDataStyle(c, idx, a);
        });
      });
      await downloadBuffer(wb, `completed_missions_${ts()}.xlsx`);
    } catch (err) {
      console.error(err);
      alert("Error: " + err.message);
    }
  };

  // ─── clear all ───
  const confirmClearAll = () => {
    reportStore.safetyReports = [];
    reportStore.missionReports = [];
    reportStore.completedMissions = [];
    reportStore.allSafety = [];
    reportStore.allMission = [];
    reportStore.allCompleted = [];
    reportStore.tagMissCount = 0;

    reportStore.recordedFaults.clear();
    reportStore.recordedStates.clear();
    reportStore.lastState = null;
    reportStore.missionAccum = {};

    reportStore.lastDataUpdate = null;
    reportStore.isDataStale = false;

    setSafetyReports([]);
    setMissionReports([]);
    setCompletedMissions([]);
    setTagMissCount(0);
    setIsDataStale(false);
    setPlcSignals({ ...reportStore.plcSignals });
    setIsMissionActive(reportStore.isMissionActive);

    refreshWeeklyCounts();
    persistSessionStore(reportStore);
    setShowConfirmModal(false);
  };

  // ─────────────────────────────────────────────────────────────────────────
  // DERIVED STATE
  // ─────────────────────────────────────────────────────────────────────────

  const imuFaults = safetyReports.filter((r) => r.signal === "imu" && r.statusColor === "red").length;
  const pgvPoseFaults = safetyReports.filter((r) => r.signal === "pgv_pose" && r.statusColor === "red").length;
  const bumperFaults = safetyReports.filter((r) => (r.signal === "front_bumper" || r.signal === "rear_bumper") && r.statusColor === "red").length;
  const motorFaults = safetyReports.filter((r) => (r.signal || "").startsWith("motor_") && r.statusColor === "red").length;
  const missionFaults = missionReports.filter((r) => r.state === "WATCHDOG_FAULT").length;
  const noData = !reportStore.allSafety.length && !reportStore.allMission.length && !reportStore.allCompleted.length;

  const TABS = [
    {
      key: "interlock",
      icon: <IconShield size={18} />,
      label: t("report.tab_interlock"),
      count: safetyReports.length,
      accentActive: "text-amber-600 dark:text-amber-400",
      countBg: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
    },
    {
      key: "mission",
      icon: <IconMission size={18} />,
      label: t("report.tab_mission"),
      count: missionReports.length,
      accentActive: "text-sky-600 dark:text-sky-400",
      countBg: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-400",
    },
    {
      key: "completed",
      icon: <IconCheckCircle size={18} />,
      label: t("report.tab_completed"),
      count: completedMissions.length,
      accentActive: "text-emerald-600 dark:text-emerald-400",
      countBg: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
    },
    {
      key: "archive",
      icon: <IconArchive size={18} />,
      label: "Archives",
      count: archivedReports.length,
      accentActive: "text-purple-600 dark:text-purple-400",
      countBg: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400",
    },
  ];

  const TH = ({ children, className = "" }) => (
    <th className={`text-left font-black uppercase text-xs text-slate-500 whitespace-nowrap ${className}`} style={{ padding: "12px 10px" }}>
      {children}
    </th>
  );
  const TD = ({ children, className = "", style: s }) => (
    <td className={className} style={{ padding: "12px 10px", ...s }}>
      {children}
    </td>
  );

  // ═════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═════════════════════════════════════════════════════════════════════════

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-slate-900 dark:text-white flex flex-col" style={{ padding: "14px 14px 28px", gap: 14 }}>
      {/* PAGE HEADER */}
      <div className="border-b-4 border-sky-500" style={{ paddingBottom: 12 }}>
        <div className="flex items-center justify-between gap-4 mb-3">
          <h2 className="font-black uppercase tracking-tighter" style={{ fontSize: 24 }}>
            📊 {t("report.title")}
          </h2>
          <div className="flex items-center gap-2">
            {isMissionActive && (
              <span className="text-xs font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-3 py-1 rounded-full animate-pulse">
                🟢 Mission Active
              </span>
            )}
            {isDataStale && (
              <span className="text-xs font-bold bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 px-3 py-1 rounded-full">
                ⚠ Data stale (no updates for 30s)
              </span>
            )}
            <button
              type="button"
              onClick={handleRefreshView}
              disabled={isRefreshing}
              className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider bg-slate-800 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 text-white px-3 py-1.5 rounded-full transition-all active:scale-95 disabled:opacity-50"
              title="Refresh reports now, without reloading the page"
            >
              <span className={isRefreshing ? "animate-spin" : ""}>
                <IconRefresh size={14} />
              </span>
              {isRefreshing ? "Refreshing…" : "Refresh"}
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-3 px-3 py-2 rounded-xl bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800">
          <span className="text-purple-600 dark:text-purple-400 font-black text-xs uppercase tracking-wider">📅 This Week (persistent):</span>
          <span className="text-xs font-bold text-amber-600">{weeklyCountSafety} Safety</span>
          <span className="text-slate-400">·</span>
          <span className="text-xs font-bold text-sky-600">{weeklyCountMission} Mission Steps</span>
          <span className="text-slate-400">·</span>
          <span className="text-xs font-bold text-emerald-600">{weeklyCountCompleted} Completed</span>
          <span className="text-slate-400 text-xs ml-auto">30-day storage • Survives disconnects &amp; Clear All</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 8 }}>
          {[
            { label: "Safety Events", icon: <IconShield size={18} />, bg: "bg-amber-500 hover:bg-amber-400", disabled: !(monthlyStore.safety?.length), fn: downloadInterlockExcel },
            { label: "Mission Steps", icon: <IconMission size={18} />, bg: "bg-sky-600 hover:bg-sky-500", disabled: !(monthlyStore.mission?.length), fn: downloadMissionExcel },
            { label: "Completed", icon: <IconCheckCircle size={18} />, bg: "bg-emerald-600 hover:bg-emerald-500", disabled: !(monthlyStore.completed?.length), fn: downloadCompletedExcel },
            { label: "Weekly Report", icon: <IconRefresh size={18} />, bg: "bg-purple-600 hover:bg-purple-500", disabled: weeklyCountSafety + weeklyCountMission + weeklyCountCompleted === 0, fn: downloadWeeklyReport },
            { label: "Clear All", icon: <IconTrash size={18} />, bg: "bg-red-600 hover:bg-red-500", disabled: noData, fn: () => setShowConfirmModal(true) },
          ].map(({ label, icon, bg, disabled, fn }) => (
            <button
              key={label}
              onClick={fn}
              disabled={disabled}
              className={`flex items-center justify-center gap-2 rounded-xl font-black uppercase text-white shadow-md transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed ${bg}`}
              style={{ minHeight: 52, fontSize: 11, letterSpacing: "0.04em", padding: "0 8px" }}
            >
              {icon}
              <span className="truncate">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* CONNECTION STATUS */}
      <div
        className={`flex items-center gap-3 rounded-xl border ${connected ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800" : "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800"
          }`}
        style={{ padding: "10px 14px" }}
      >
        <div className={`rounded-full shrink-0 ${connected ? "bg-emerald-500 animate-pulse" : "bg-red-500"}`} style={{ width: 14, height: 14 }} />
        <span className="font-bold text-sm">
          Robot: {connected ? t("report.robot_online") : t("report.robot_disconnected")}
        </span>
        {!connected && <span className="ml-auto text-amber-600 dark:text-amber-400 text-xs font-bold shrink-0">{t("report.waiting_wifi")} — 30-day data preserved</span>}
      </div>

      {/* SUMMARY STATS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 8 }}>
        {[
          { label: "Safety Events", val: monthlyStore.safety?.length || 0, color: "text-amber-500" },
          { label: "IMU Faults", val: imuFaults, color: "text-orange-500" },
          { label: "PGV Pose Faults", val: pgvPoseFaults, color: "text-cyan-600" },
          { label: "Bumper Faults", val: bumperFaults, color: "text-red-600" },
          { label: "Motor Faults", val: motorFaults, color: "text-rose-600" },
          { label: "Mission Steps", val: monthlyStore.mission?.length || 0, color: "text-sky-500" },
          { label: "Watchdog", val: missionFaults, color: "text-red-500" },
          { label: "Missed Tags", val: tagMissCount, color: "text-fuchsia-600" },
          { label: "Completed", val: monthlyStore.completed?.length || 0, color: "text-emerald-600" },
          { label: "Archived", val: archivedReports.length, color: "text-purple-600" },
        ].map((c, i) => (
          <StatChip key={i} label={c.label} val={c.val} color={c.color} />
        ))}
      </div>

      {/* TABS */}
      <div className="flex gap-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl" style={{ padding: 5 }}>
        {TABS.map(({ key, icon, label, count, accentActive, countBg }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center justify-center gap-1.5 flex-1 rounded-lg font-black uppercase transition-all ${activeTab === key ? `bg-white dark:bg-slate-900 shadow-md ${accentActive}` : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            style={{ minHeight: 52, fontSize: 11, letterSpacing: "0.04em", padding: "0 6px" }}
          >
            {icon}
            <span>{label}</span>
            {count > 0 && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-black ${activeTab === key ? countBg : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"}`}>
                {count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── SAFETY EVENTS TAB ── */}
      {activeTab === "interlock" && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border dark:border-slate-800 overflow-hidden">
          <div style={{ padding: "14px 16px" }} className="border-b dark:border-slate-800">
            <h3 className="font-black uppercase text-amber-600" style={{ fontSize: 15 }}>
              ⚠️ Safety Events
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {monthlyStore.safety?.length || 0} total — showing latest {safetyReports.length} (includes PLC interlocks, PGV pose feed + Motor faults)
            </p>
          </div>
          {safetyReports.length === 0 ? (
            <EmptyState label="No safety events" sub="Signal changes and motor faults will appear here" />
          ) : (
            <div style={isDark() ? darkTableContainerStyle : tableContainerStyle}>
              <table className="w-full">
                <thead className="bg-slate-50 dark:bg-slate-800 border-b dark:border-slate-700" style={tableHeaderStickyStyle}>
                  <tr>
                    <TH>No.</TH>
                    <TH>Date</TH>
                    <TH>Timestamp</TH>
                    <TH>Device</TH>
                    <TH>Status</TH>
                    <TH>Health</TH>
                  </tr>
                </thead>
                <tbody>
                  {safetyReports.map((r, idx) => (
                    <tr key={r.id} className="border-b dark:border-slate-800 hover:bg-amber-50/40 dark:hover:bg-amber-950/10">
                      <TD className="text-slate-400 font-bold text-xs">{idx + 1}</TD>
                      <TD className="text-xs font-mono text-slate-500">{r.dateKey}</TD>
                      <TD>
                        <div className="text-xs font-bold">{r.timestampFormatted}</div>
                      </TD>
                      <TD className="text-sm font-semibold">{r.signalLabel}</TD>
                      <TD>
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-black ${r.statusColor === "green"
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                            : "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                            }`}
                        >
                          <span className={`rounded-full shrink-0 ${r.statusColor === "green" ? "bg-emerald-500" : "bg-red-500"}`} style={{ width: 7, height: 7 }} />
                          {r.statusColor.toUpperCase()}
                        </span>
                      </TD>
                      <TD>{sanitizeStatus(r.status)}</TD>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── MISSION EVENTS TAB ── */}
      {activeTab === "mission" && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border dark:border-slate-800 overflow-hidden">
          <div style={{ padding: "14px 16px" }} className="border-b dark:border-slate-800">
            <div className="flex items-center justify-between">
              <h3 className="font-black uppercase text-sky-600" style={{ fontSize: 15 }}>
                🎯 Mission Steps
              </h3>
              {isMissionActive && (
                <span className="text-xs font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-3 py-1 rounded-full animate-pulse">
                  🟢 Live
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {monthlyStore.mission?.length || 0} step updates — showing latest {missionReports.length}
            </p>
          </div>
          {missionReports.length === 0 ? (
            <EmptyState label="No mission steps recorded" sub="Mission step updates will appear here" />
          ) : (
            <div style={isDark() ? darkTableContainerStyle : tableContainerStyle}>
              <table className="w-full text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800 border-b dark:border-slate-700" style={tableHeaderStickyStyle}>
                  <tr>
                    <TH>No.</TH>
                    <TH>Date</TH>
                    <TH>Timestamp</TH>
                    <TH>State</TH>
                    <TH>Step</TH>
                    <TH>Tag</TH>
                    <TH>Target</TH>
                    <TH>Speed</TH>
                    <TH>Missed Tag</TH>
                  </tr>
                </thead>
                <tbody>
                  {missionReports.map((r, idx) => (
                    <tr key={r.id} className="border-b dark:border-slate-800 hover:bg-sky-50/40 dark:hover:bg-sky-900/10">
                      <TD className="text-slate-400 font-bold text-xs">{idx + 1}</TD>
                      <TD className="text-xs font-mono text-slate-500">{r.dateKey}</TD>
                      <TD>
                        <div className="text-xs font-bold">{r.timestampFormatted}</div>
                      </TD>
                      <TD>
                        <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-black whitespace-nowrap ${getStateStyle(r.state).bg} ${getStateStyle(r.state).text}`}>
                          <span className={`rounded-full shrink-0 ${getStateStyle(r.state).dot}`} style={{ width: 6, height: 6 }} />
                          {r.state}
                        </span>
                      </TD>
                      <TD className="font-mono font-bold text-amber-600 dark:text-amber-400 text-xs">
                        {r.step}/{r.totalSteps}
                      </TD>
                      <TD className="font-mono font-black text-sky-600 dark:text-sky-400">{r.currentTag}</TD>
                      <TD className="font-mono font-black text-purple-600 dark:text-purple-400">{r.targetTag}</TD>
                      <TD className="font-mono text-xs">
                        {r.speed} m/s
                      </TD>
                      <TD className={`font-mono font-black ${r.missedTag ? "text-red-600 dark:text-red-400" : "text-slate-400"}`}>
                        {r.missedTag ? `${r.missedTag}` : "—"}
                      </TD>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── COMPLETED MISSIONS TAB ── */}
      {activeTab === "completed" && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border dark:border-slate-800 overflow-hidden">
          <div style={{ padding: "14px 16px" }} className="border-b dark:border-slate-800">
            <h3 className="font-black uppercase text-emerald-600" style={{ fontSize: 15 }}>
              ✅ Completed Missions
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {monthlyStore.completed?.length || 0} total — showing latest {completedMissions.length}
            </p>
          </div>
          {completedMissions.length === 0 ? (
            <EmptyState label="No completed missions" sub="Finished missions will appear here" />
          ) : (
            <div style={isDark() ? darkTableContainerStyle : tableContainerStyle}>
              <table className="w-full">
                <thead className="bg-slate-50 dark:bg-slate-800 border-b dark:border-slate-700" style={tableHeaderStickyStyle}>
                  <tr>
                    <TH>No.</TH>
                    <TH>Date</TH>
                    <TH>Completed At</TH>
                    <TH>Mission File</TH>
                    <TH>Steps</TH>
                    <TH>Duration</TH>
                    <TH>Loop</TH>
                  </tr>
                </thead>
                <tbody>
                  {completedMissions.map((r, idx) => (
                    <tr key={r.id} className="border-b dark:border-slate-800 hover:bg-emerald-50/40 dark:hover:bg-emerald-950/10">
                      <TD className="text-slate-400 font-bold text-xs">{idx + 1}</TD>
                      <TD className="text-xs font-mono text-slate-500">{r.dateKey}</TD>
                      <TD>
                        <div className="text-xs font-bold">{r.timestampFormatted}</div>
                        <div className="text-xs text-slate-400 font-mono">{r.durationFormatted}</div>
                      </TD>
                      <TD className="text-xs font-mono text-sky-600 dark:text-sky-400 max-w-xs truncate">{r.missionFile}</TD>
                      <TD>
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-black bg-sky-50 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300">
                          {r.finalStep}/{r.totalSteps}
                        </span>
                      </TD>
                      <TD>
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-black bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300">
                          ⏱ {r.durationFormatted}
                        </span>
                      </TD>
                      <TD className={`text-xs font-black ${r.loop ? "text-amber-600 dark:text-amber-400" : "text-slate-400"}`}>
                        {r.loop ? "ON" : "OFF"}
                      </TD>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── ARCHIVE TAB ── */}
      {activeTab === "archive" && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border dark:border-slate-800 overflow-hidden">
          <div style={{ padding: "14px 16px" }} className="border-b dark:border-slate-800">
            <h3 className="font-black uppercase text-purple-600" style={{ fontSize: 15 }}>
              📦 Archived Weekly Reports
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {archivedReports.length} archived reports (survives clear operations)
            </p>
          </div>
          {archivedReports.length === 0 ? (
            <EmptyState label="No archived reports yet" sub="Weekly reports will be archived here after download" />
          ) : (
            <div style={isDark() ? darkTableContainerStyle : tableContainerStyle}>
              <table className="w-full text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800 border-b dark:border-slate-700" style={tableHeaderStickyStyle}>
                  <tr>
                    <TH>Week</TH>
                    <TH>Year</TH>
                    <TH>Period</TH>
                    <TH>Safety</TH>
                    <TH>Mission</TH>
                    <TH>Completed</TH>
                    <TH>Archived At</TH>
                    <TH>Action</TH>
                  </tr>
                </thead>
                <tbody>
                  {[...archivedReports].reverse().map((archive) => (
                    <tr key={archive.id} className="border-b dark:border-slate-800 hover:bg-purple-50/40 dark:hover:bg-purple-900/10">
                      <TD className="font-mono font-black text-purple-600 dark:text-purple-400">{archive.weekNumber}</TD>
                      <TD className="font-bold">{archive.year}</TD>
                      <TD className="text-xs">
                        <div>{archive.startDate}</div>
                        <div className="text-slate-400">to {archive.endDate}</div>
                      </TD>
                      <TD className="text-xs font-bold text-amber-600">{archive.counts.safety}</TD>
                      <TD className="text-xs font-bold text-sky-600">{archive.counts.mission}</TD>
                      <TD className="text-xs font-bold text-emerald-600">{archive.counts.completed}</TD>
                      <TD className="text-xs font-mono text-slate-500">{new Date(archive.createdAt).toLocaleString()}</TD>
                      <TD>
                        <button
                          type="button"
                          onClick={() => downloadArchivedReport(archive)}
                          className="px-3 py-1 rounded-lg bg-purple-500 hover:bg-purple-600 text-white font-bold text-xs transition-all active:scale-95"
                        >
                          ⬇️ Download
                        </button>
                      </TD>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* CONFIRM MODAL */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={confirmClearAll}
        title="Clear Dashboard View"
        message="This clears the live dashboard view (current tab counts and tables). Your weekly report, 30-day exports, and archived reports are not affected and will keep all historical data. This action cannot be undone for the on-screen view."
        confirmText="Yes, Clear View"
        cancelText="Cancel"
      />
    </div>
  );
}