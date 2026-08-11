



// import React, { useState, useEffect, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import { useROS } from "../context/RosContext"; // adjust path if needed
// import bgImage      from "../assets/R&DAMR.png";
// import TaikishaLogo from "../assets/Taikishaimage1.png";

// // ── SVG Icons ─────────────────────────────────────────────────────────────────
// const Icon = ({ d, size = 16, className = "" }) => (
//   <svg
//     width={size} height={size} viewBox="0 0 24 24"
//     fill="none" stroke="currentColor" strokeWidth="2"
//     strokeLinecap="round" strokeLinejoin="round"
//     className={className}
//   >
//     {d}
//   </svg>
// );

// const CheckIcon   = (p) => <Icon {...p} d={<><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></>} />;
// const BackIcon    = (p) => <Icon {...p} d={<><path d="M20 5H9.5a2 2 0 0 0-1.45.62L2 12l6.05 6.38A2 2 0 0 0 9.5 19H20a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2z"/><line x1="15" y1="9" x2="11" y2="13"/><line x1="11" y1="9" x2="15" y2="13"/></>} />;
// const WifiIcon    = (p) => <Icon {...p} d={<><path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9c3.12-3.80 7.48-5.98 11.58-5.99 4.11.01 8.47 2.20 11.59 6M9 20h6M12 17v3"/></>} />;
// const WifiOffIcon = (p) => <Icon {...p} d={<><line x1="1" y1="1" x2="23" y2="23"/><path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"/><path d="M5 12.55a10.94 10.94 0 0 1 5.64-2.64"/><path d="M19.86 4.34A16 16 0 0 0 4.14 4.34"/><polyline points="12 17 12 20"/></>} />;
// const AlertIcon   = (p) => <Icon {...p} d={<><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></>} />;
// const Spinner     = ({ size = 16 }) => (
//   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="spin">
//     <line x1="12" y1="2"  x2="12" y2="6"/>  <line x1="12" y1="18" x2="12" y2="22"/>
//     <line x1="4.22" y1="4.22"   x2="7.04"  y2="7.04"/>
//     <line x1="16.96" y1="16.96" x2="19.78" y2="19.78"/>
//     <line x1="2"  y1="12" x2="6"  y2="12"/> <line x1="18" y1="12" x2="22" y2="12"/>
//     <line x1="4.22" y1="19.78"  x2="7.04"  y2="16.96"/>
//     <line x1="16.96" y1="7.04"  x2="19.78" y2="4.22"/>
//   </svg>
// );

// // ── Constants ─────────────────────────────────────────────────────────────────
// const DEFAULT_PORT = 9090;
// const ORG_NAME     = "Taikisha India";

// // ── IP validation ─────────────────────────────────────────────────────────────
// const isValidIP = (ip) =>
//   /^(\d{1,3}\.){3}\d{1,3}$/.test(ip) &&
//   ip.split(".").every((seg) => parseInt(seg, 10) <= 255);

// // ── WebSocket probe (standalone, no ROSLIB needed) ────────────────────────────
// const probeWS = (ip, port = DEFAULT_PORT, timeoutMs = 5000) =>
//   new Promise((resolve) => {
//     const t0 = Date.now();
//     const ws = new WebSocket(`ws://${ip}:${port}`);
//     let done = false;
//     const finish = (ok, reason = null) => {
//       if (done) return;
//       done = true;
//       clearTimeout(tid);
//       try { ws.close(); } catch (_) {}
//       resolve(ok
//         ? { ok: true,  latency: Date.now() - t0, reason: null }
//         : { ok: false, latency: null, reason });
//     };
//     const tid = setTimeout(
//       () => finish(false, "Connection timeout — robot unreachable"),
//       timeoutMs,
//     );
//     ws.onopen  = () => finish(true);
//     ws.onerror = () => finish(false, "Unable to connect to robot");
//     ws.onclose = () => finish(false, "Connection closed before open");
//   });

// // ══════════════════════════════════════════════════════════════════════════════
// // ConnectedPopup — shown for ~2 s after a successful probe
// // ══════════════════════════════════════════════════════════════════════════════
// function ConnectedPopup({ ip, latency, onDone }) {
//   useEffect(() => {
//     const t = setTimeout(onDone, 2_200);
//     return () => clearTimeout(t);
//   }, [onDone]);

//   return (
//     <div
//       className="fixed inset-0 z-50 flex items-center justify-center"
//       style={{ background: "rgba(0,0,0,0.40)", backdropFilter: "blur(6px)" }}
//     >
//       <div
//         className="bg-white rounded-2xl shadow-2xl flex flex-col items-center gap-2 px-8 py-6"
//         style={{ animation: "popIn 0.28s cubic-bezier(0.34,1.56,0.64,1) both" }}
//       >
//         {/* Pulsing ring */}
//         <div className="relative flex items-center justify-center mb-1">
//           <div
//             className="absolute w-14 h-14 rounded-full bg-green-100"
//             style={{ animation: "ring 1.4s ease-out infinite" }}
//           />
//           <div className="w-11 h-11 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center z-10">
//             <WifiIcon size={22} className="text-green-500" />
//           </div>
//         </div>

//         <p className="text-slate-800 font-bold text-sm">Robot Connected!</p>
//         <p className="text-slate-400 font-mono" style={{ fontSize: 11 }}>
//           {ip}:{DEFAULT_PORT}
//         </p>
//         {latency != null && (
//           <p className="text-slate-400" style={{ fontSize: 10 }}>Latency: {latency} ms</p>
//         )}
//         <div className="flex items-center gap-1 text-green-600 font-semibold" style={{ fontSize: 11 }}>
//           <CheckIcon size={11} /> Connection established
//         </div>
//         <p className="text-slate-400" style={{ fontSize: 10 }}>Proceeding to dashboard…</p>
//       </div>

//       <style>{`
//         @keyframes popIn { from{opacity:0;transform:scale(.75)} to{opacity:1;transform:scale(1)} }
//         @keyframes ring  { 0%{transform:scale(1);opacity:.7} 70%,100%{transform:scale(1.5);opacity:0} }
//         @keyframes spin  { to{transform:rotate(360deg)} }
//         .spin { animation:spin .9s linear infinite; display:inline-block }
//       `}</style>
//     </div>
//   );
// }

// // ══════════════════════════════════════════════════════════════════════════════
// // IPEntry — compact numpad + IP display
// // ══════════════════════════════════════════════════════════════════════════════
// function IPEntry({ onConnected }) {
//   const [ip,       setIp]       = useState("");
//   const [phase,    setPhase]    = useState("idle"); // idle | connecting | error
//   const [errorMsg, setErrorMsg] = useState("");

//   // ── IP input helpers ────────────────────────────────────────────────────────
//   const press = useCallback((char) => {
//     if (phase === "connecting") return;
//     setPhase("idle");
//     setErrorMsg("");
//     setIp((prev) => {
//       if (char === "." && (prev === "" || prev.endsWith("."))) return prev;
//       if (prev.length >= 15) return prev;
//       const next     = prev + char;
//       const segments = next.split(".");
//       if (segments.length > 4) return prev;
//       const last = segments[segments.length - 1];
//       if (/^\d+$/.test(last) && last.length > 3) return prev;
//       return next;
//     });
//   }, [phase]);

//   const del = useCallback(() => {
//     if (phase === "connecting") return;
//     setIp((p) => p.slice(0, -1));
//     setPhase("idle");
//     setErrorMsg("");
//   }, [phase]);

//   // ── Keyboard support ────────────────────────────────────────────────────────
//   useEffect(() => {
//     const onKey = (e) => {
//       if (/^[0-9]$/.test(e.key))                          { e.preventDefault(); press(e.key);   return; }
//       if (e.key === "." || e.key === "Decimal")            { e.preventDefault(); press(".");      return; }
//       if (e.key === "Backspace" || e.key === "Delete")     { e.preventDefault(); del();           return; }
//       if (e.key === "Enter")                               { e.preventDefault(); handleConnect(); return; }
//     };
//     window.addEventListener("keydown", onKey);
//     return () => window.removeEventListener("keydown", onKey);
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [phase, ip]);

//   // ── Connect ─────────────────────────────────────────────────────────────────
//   const handleConnect = async () => {
//     if (phase === "connecting") return;

//     if (!isValidIP(ip)) {
//       setPhase("error");
//       setErrorMsg("Invalid IP address format");
//       setTimeout(() => { setPhase("idle"); setErrorMsg(""); }, 1_800);
//       return;
//     }

//     setPhase("connecting");
//     setErrorMsg("");

//     const result = await probeWS(ip, DEFAULT_PORT);

//     if (!result.ok) {
//       setPhase("error");
//       setErrorMsg(result.reason ?? "Connection failed");
//       setTimeout(() => { setPhase("idle"); setErrorMsg(""); }, 3_500);
//       return;
//     }

//     // Persist to localStorage — ROSProvider will pick these up via triggerConnect()
//     localStorage.setItem("rosIP",   ip);
//     localStorage.setItem("rosPort", String(DEFAULT_PORT));

//     onConnected(ip, result.latency);
//   };

//   // ── Border style ────────────────────────────────────────────────────────────
//   const border = phase === "error"
//     ? "border-red-400 ring-1 ring-red-300"
//     : phase === "connecting"
//       ? "border-sky-400 ring-1 ring-sky-200"
//       : ip.length
//         ? "border-sky-300"
//         : "border-slate-200";

//   const keys = ["1","2","3","4","5","6","7","8","9"];

//   return (
//     <div style={{ width: "100%", maxWidth: 252 }}>
//       {/* Header */}
//       <div className="text-center" style={{ marginBottom: 10 }}>
//         <img
//           src={TaikishaLogo} alt="Taikisha"
//           className="mx-auto object-contain"
//           style={{ height: 36, marginBottom: 6 }}
//         />
//         <h2 className="font-bold text-slate-800" style={{ fontSize: 15, marginBottom: 2 }}>
//           Connect to Robot
//         </h2>
//         <p className="text-slate-500" style={{ fontSize: 11 }}>Enter the robot IP address</p>
//       </div>

//       {/* IP display */}
//       <div
//         className={`flex items-center justify-center rounded-xl border-2 bg-slate-50 transition-all duration-150 ${border}`}
//         style={{ minHeight: 38, padding: "4px 10px", marginBottom: 4 }}
//       >
//         <span
//           className={`font-mono tracking-wider select-none ${ip ? "text-slate-800" : "text-slate-300"}`}
//           style={{ fontSize: 15 }}
//         >
//           {ip || "_ . _ . _ . _"}
//         </span>
//       </div>
// {/* 
//       <p className="text-center text-slate-400" style={{ fontSize: 10, marginBottom: 2 }}>
//         Port: {DEFAULT_PORT}
//       </p> */}
//       <p className="text-center text-slate-300" style={{ fontSize: 10, marginBottom: 8 }}>
//         Type from keyboard ·{" "}
//         <kbd className="text-slate-400 bg-slate-100 px-1 rounded" style={{ fontSize: 10 }}>Enter</kbd>
//         {" "}to connect
//       </p>

//       {/* Status area (fixed height prevents layout shift) */}
//       <div style={{ minHeight: 40, marginBottom: 6, textAlign: "center" }}>
//         {phase === "connecting" && (
//           <span className="text-sky-500 font-semibold inline-flex items-center gap-1" style={{ fontSize: 11 }}>
//             <Spinner size={11} /> Testing connection…
//           </span>
//         )}
//         {phase === "error" && errorMsg && (
//           <div className="text-red-500 font-semibold" style={{ fontSize: 11 }}>
//             <div className="inline-flex items-center gap-1" style={{ marginBottom: 2 }}>
//               <WifiOffIcon size={11} /> {errorMsg}
//             </div>
//             <p className="text-red-400 mx-auto" style={{ fontSize: 10, maxWidth: 240 }}>
//               Make sure robot is connected to wifi.
//             </p>
//           </div>
//         )}
//       </div>

//       {/* Numpad */}
//       <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 6 }}>
//         {keys.map((n) => (
//           <button
//             key={n} onClick={() => press(n)}
//             className="rounded-xl border-2 border-slate-200 text-slate-800 font-semibold
//                        hover:bg-sky-50 hover:border-sky-300 active:scale-95 transition-all"
//             style={{ height: 40, fontSize: 15 }}
//           >
//             {n}
//           </button>
//         ))}
//         <button
//           onClick={() => press(".")}
//           className="rounded-xl border-2 border-slate-200 text-slate-800 font-bold
//                      hover:bg-sky-50 hover:border-sky-300 active:scale-95 transition-all"
//           style={{ height: 40, fontSize: 18 }}
//         >
//           .
//         </button>
//         <button
//           onClick={() => press("0")}
//           className="rounded-xl border-2 border-slate-200 text-slate-800 font-semibold
//                      hover:bg-sky-50 hover:border-sky-300 active:scale-95 transition-all"
//           style={{ height: 40, fontSize: 15 }}
//         >
//           0
//         </button>
//         <button
//           onClick={del}
//           className="rounded-xl border-2 border-slate-200 text-slate-500
//                      hover:bg-red-50 hover:border-red-200 active:scale-95 transition-all
//                      flex items-center justify-center"
//           style={{ height: 40 }}
//         >
//           <BackIcon size={16} />
//         </button>
//       </div>

//       {/* Connect button */}
//       <button
//         onClick={handleConnect}
//         disabled={phase === "connecting"}
//         className="w-full rounded-xl bg-sky-500 text-white font-semibold
//                    hover:bg-sky-600 active:scale-95 transition-all
//                    disabled:opacity-50 disabled:cursor-not-allowed
//                    flex items-center justify-center gap-2"
//         style={{ height: 40, fontSize: 13, marginTop: 8 }}
//       >
//         {phase === "connecting"
//           ? <><Spinner size={14} />Connecting…</>
//           : <><WifiIcon size={14} /> Connect</>}
//       </button>
//     </div>
//   );
// }

// // ══════════════════════════════════════════════════════════════════════════════
// // LoginForm — root orchestrator
// // ══════════════════════════════════════════════════════════════════════════════
// export default function LoginForm() {
//   const { triggerConnect } = useROS();
//   const navigate = useNavigate();

//   const [robotIp,   setRobotIp]   = useState("");
//   const [latency,   setLatency]   = useState(null);
//   const [showPopup, setShowPopup] = useState(false);

//   // Prevent back navigation to this screen
//   useEffect(() => {
//     window.history.pushState(null, "", window.location.href);
//     const onPop = () => window.history.pushState(null, "", window.location.href);
//     window.addEventListener("popstate", onPop);
//     return () => window.removeEventListener("popstate", onPop);
//   }, []);

//   // Lock body scroll while login is shown
//   useEffect(() => {
//     const prev = {
//       bodyOverflow: document.body.style.overflow,
//       bodyPosition: document.body.style.position,
//       bodyHeight:   document.body.style.height,
//       bodyWidth:    document.body.style.width,
//       htmlOverflow: document.documentElement.style.overflow,
//       htmlHeight:   document.documentElement.style.height,
//     };
//     document.documentElement.style.overflow = "hidden";
//     document.documentElement.style.height   = "100%";
//     document.body.style.overflow  = "hidden";
//     document.body.style.position  = "fixed";
//     document.body.style.height    = "100%";
//     document.body.style.width     = "100%";
//     return () => {
//       document.documentElement.style.overflow = prev.htmlOverflow;
//       document.documentElement.style.height   = prev.htmlHeight;
//       document.body.style.overflow  = prev.bodyOverflow;
//       document.body.style.position  = prev.bodyPosition;
//       document.body.style.height    = prev.bodyHeight;
//       document.body.style.width     = prev.bodyWidth;
//     };
//   }, []);

//   // Called by IPEntry after a successful probe
//   const handleConnected = useCallback((ip, connLatency) => {
//     setRobotIp(ip);
//     setLatency(connLatency);
//     setShowPopup(true);
//   }, []);

//   // Called by ConnectedPopup after its 2.2 s delay
//   const handlePopupDone = useCallback(() => {
//     setShowPopup(false);
//     localStorage.setItem("isLoggedIn",   "true");
//     localStorage.setItem("loggedInUser", ORG_NAME);
//     localStorage.setItem("currentUser",  JSON.stringify({ username: "admin", orgName: ORG_NAME }));

//     // ← KEY: tell ROSProvider the IP is now ready — opens the real WebSocket
//     triggerConnect();

//     navigate("/missioncontrol", { replace: true });
//   }, [triggerConnect, navigate]);

//   return (
//     <>
//       {showPopup && (
//         <ConnectedPopup ip={robotIp} latency={latency} onDone={handlePopupDone} />
//       )}

//       <div
//         style={{
//           position: "fixed", inset: 0, overflow: "hidden",
//           display: "flex", alignItems: "center", justifyContent: "center",
//           padding: 8,
//         }}
//         className="bg-gradient-to-br from-sky-50 to-sky-100"
//       >
//         <div
//           className="bg-white rounded-2xl shadow-2xl w-full flex flex-col md:flex-row relative overflow-hidden"
//           style={{ maxWidth: 860, maxHeight: "100dvh", height: "auto" }}
//         >
//           {/* LEFT — numpad */}
//           <div
//             className="w-full md:w-1/2 flex items-center justify-center"
//             style={{ padding: "12px 16px" }}
//           >
//             <IPEntry onConnected={handleConnected} />
//           </div>

//           {/* Vertical divider */}
//           <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-slate-300 to-transparent" />

//           {/* RIGHT — robot image */}
//           <div
//             className="hidden md:flex md:w-1/2 items-center justify-center bg-blue-100"
//             style={{ padding: 12 }}
//           >
//             <img
//               src={bgImage} alt="AMR Robot"
//               className="w-full h-full object-contain rounded-xl"
//               style={{ maxHeight: "calc(100dvh - 24px)" }}
//             />
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }


import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useROS } from "../context/RosContext";
import bgImage      from "../assets/Mindaimage.png";
import TaikishaLogo from "../assets/Taikishaimage1.png";

// ── SVG Icons ──────────────────────────────────────────────────────────────
const Icon = ({ d, size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" className={className}
  >
    {d}
  </svg>
);

const CheckIcon   = (p) => <Icon {...p} d={<><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></>} />;
const BackIcon    = (p) => <Icon {...p} d={<><path d="M20 5H9.5a2 2 0 0 0-1.45.62L2 12l6.05 6.38A2 2 0 0 0 9.5 19H20a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2z"/><line x1="15" y1="9" x2="11" y2="13"/><line x1="11" y1="9" x2="15" y2="13"/></>} />;
const WifiIcon    = (p) => <Icon {...p} d={<><path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9c3.12-3.80 7.48-5.98 11.58-5.99 4.11.01 8.47 2.20 11.59 6M9 20h6M12 17v3"/></>} />;
const WifiOffIcon = (p) => <Icon {...p} d={<><line x1="1" y1="1" x2="23" y2="23"/><path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"/><path d="M5 12.55a10.94 10.94 0 0 1 5.64-2.64"/><path d="M19.86 4.34A16 16 0 0 0 4.14 4.34"/><polyline points="12 17 12 20"/></>} />;
const Spinner     = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="spin">
    <line x1="12" y1="2"  x2="12" y2="6"/>  <line x1="12" y1="18" x2="12" y2="22"/>
    <line x1="4.22" y1="4.22"   x2="7.04"  y2="7.04"/>
    <line x1="16.96" y1="16.96" x2="19.78" y2="19.78"/>
    <line x1="2"  y1="12" x2="6"  y2="12"/> <line x1="18" y1="12" x2="22" y2="12"/>
    <line x1="4.22" y1="19.78"  x2="7.04"  y2="16.96"/>
    <line x1="16.96" y1="7.04"  x2="19.78" y2="4.22"/>
  </svg>
);

const DEFAULT_PORT = 9090;
const ORG_NAME     = "Taikisha India";

const isValidIP = (ip) =>
  /^(\d{1,3}\.){3}\d{1,3}$/.test(ip) &&
  ip.split(".").every((seg) => parseInt(seg, 10) <= 255);

const probeWS = (ip, port = DEFAULT_PORT, timeoutMs = 5000) =>
  new Promise((resolve) => {
    const t0 = Date.now();
    const ws = new WebSocket(`ws://${ip}:${port}`);
    let done = false;
    const finish = (ok, reason = null) => {
      if (done) return;
      done = true;
      clearTimeout(tid);
      try { ws.close(); } catch (_) {}
      resolve(ok
        ? { ok: true,  latency: Date.now() - t0, reason: null }
        : { ok: false, latency: null, reason });
    };
    const tid = setTimeout(() => finish(false, "Connection timeout — robot unreachable"), timeoutMs);
    ws.onopen  = () => finish(true);
    ws.onerror = () => finish(false, "Unable to connect to robot");
    ws.onclose = () => finish(false, "Connection closed before open");
  });

// ── ConnectedPopup ─────────────────────────────────────────────────────────
function ConnectedPopup({ ip, latency, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2200);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="popup-overlay">
      <div className="popup-card">
        <div className="popup-icon-wrap">
          <div className="popup-ring" />
          <div className="popup-icon-circle">
            <WifiIcon size={28} className="text-green" />
          </div>
        </div>
        <p className="popup-title">Robot Connected!</p>
        <p className="popup-ip">{ip}:{DEFAULT_PORT}</p>
        <div className="popup-status">
          <CheckIcon size={13} /> Connection established
        </div>
        <p className="popup-sub">Proceeding to dashboard…</p>
      </div>
      <style>{`
        .popup-overlay{position:fixed;inset:0;z-index:50;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.40);backdrop-filter:blur(6px)}
        .popup-card{background:#fff;border-radius:18px;box-shadow:0 20px 60px rgba(0,0,0,.18);display:flex;flex-direction:column;align-items:center;gap:8px;padding:28px 36px;min-width:240px;animation:popIn .28s cubic-bezier(.34,1.56,.64,1) both}
        .popup-icon-wrap{position:relative;display:flex;align-items:center;justify-content:center;margin-bottom:4px}
        .popup-ring{position:absolute;width:68px;height:68px;border-radius:50%;background:#dcfce7;animation:ring 1.4s ease-out infinite}
        .popup-icon-circle{width:52px;height:52px;border-radius:50%;background:#f0fdf4;border:2px solid #bbf7d0;display:flex;align-items:center;justify-content:center;z-index:1}
        .text-green{color:#22c55e}
        .popup-title{color:#1e293b;font-weight:700;font-size:16px;margin:0}
        .popup-ip{color:#94a3b8;font-family:monospace;font-size:12px;margin:0}
        .popup-status{display:flex;align-items:center;gap:5px;color:#16a34a;font-weight:600;font-size:12px}
        .popup-sub{color:#94a3b8;font-size:12px;margin:0}
        @keyframes popIn{from{opacity:0;transform:scale(.75)}to{opacity:1;transform:scale(1)}}
        @keyframes ring{0%{transform:scale(1);opacity:.7}70%,100%{transform:scale(1.5);opacity:0}}
      `}</style>
    </div>
  );
}

// ── IPEntry ────────────────────────────────────────────────────────────────
function IPEntry({ onConnected }) {
  const [ip,       setIp]       = useState("");
  const [phase,    setPhase]    = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const press = useCallback((char) => {
    if (phase === "connecting") return;
    setPhase("idle"); setErrorMsg("");
    setIp((prev) => {
      if (char === "." && (prev === "" || prev.endsWith("."))) return prev;
      if (prev.length >= 15) return prev;
      const next = prev + char;
      const segs = next.split(".");
      if (segs.length > 4) return prev;
      const last = segs[segs.length - 1];
      if (/^\d+$/.test(last) && last.length > 3) return prev;
      return next;
    });
  }, [phase]);

  const del = useCallback(() => {
    if (phase === "connecting") return;
    setIp((p) => p.slice(0, -1));
    setPhase("idle"); setErrorMsg("");
  }, [phase]);

  useEffect(() => {
    const onKey = (e) => {
      if (/^[0-9]$/.test(e.key))                      { e.preventDefault(); press(e.key);      return; }
      if (e.key === "." || e.key === "Decimal")        { e.preventDefault(); press(".");         return; }
      if (e.key === "Backspace" || e.key === "Delete") { e.preventDefault(); del();              return; }
      if (e.key === "Enter")                           { e.preventDefault(); handleConnect();    return; }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, ip]);

  const handleConnect = async () => {
    if (phase === "connecting") return;
    if (!isValidIP(ip)) {
      setPhase("error"); setErrorMsg("Invalid IP address format");
      setTimeout(() => { setPhase("idle"); setErrorMsg(""); }, 1800);
      return;
    }
    setPhase("connecting"); setErrorMsg("");
    const result = await probeWS(ip, DEFAULT_PORT);
    if (!result.ok) {
      setPhase("error"); setErrorMsg(result.reason ?? "Connection failed");
      setTimeout(() => { setPhase("idle"); setErrorMsg(""); }, 3500);
      return;
    }
    localStorage.setItem("rosIP",   ip);
    localStorage.setItem("rosPort", String(DEFAULT_PORT));
    onConnected(ip, result.latency);
  };

  const borderColor =
    phase === "error"      ? "#f87171" :
    phase === "connecting" ? "#38bdf8" :
    ip.length              ? "#7dd3fc" : "#e2e8f0";

  const keys = ["1","2","3","4","5","6","7","8","9"];

  // Key size tuned for 7-inch: large tap targets
  const keyBase = {
    height: 62,
    fontSize: 22,
    fontWeight: 700,
    borderRadius: 12,
    border: "1.5px solid #e2e8f0",
    background: "#fff",
    color: "#1e293b",
    cursor: "pointer",
    transition: "background .12s, border-color .12s, transform .08s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    userSelect: "none",
    WebkitTapHighlightColor: "transparent",
    touchAction: "manipulation",
  };

  const hoverHandlers = (hoverBg = "#f0f9ff", hoverBorder = "#7dd3fc") => ({
    onMouseEnter: (e) => { e.currentTarget.style.background = hoverBg; e.currentTarget.style.borderColor = hoverBorder; },
    onMouseLeave: (e) => { e.currentTarget.style.background = "#fff";  e.currentTarget.style.borderColor = "#e2e8f0"; },
    onMouseDown:  (e) => { e.currentTarget.style.transform = "scale(0.93)"; },
    onMouseUp:    (e) => { e.currentTarget.style.transform = "scale(1)"; },
    onTouchStart: (e) => { e.currentTarget.style.background = hoverBg; e.currentTarget.style.transform = "scale(0.93)"; },
    onTouchEnd:   (e) => { e.currentTarget.style.background = "#fff";  e.currentTarget.style.transform = "scale(1)"; },
  });

  return (
    <div style={{ width: "100%", maxWidth: 340 }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 10 }}>
        <img src={TaikishaLogo} alt="Taikisha"
          style={{ height: 36, display: "block", margin: "0 auto 8px" }}
        />
        <h2 style={{ fontSize: 17, fontWeight: 700, color: "#1e293b", margin: "0 0 2px" }}>
          Connect to Robot
        </h2>
        <p style={{ fontSize: 12, color: "#64748b", margin: 0 }}>
          Enter the robot IP address
        </p>
      </div>

      {/* IP display */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        minHeight: 44, padding: "4px 12px", marginBottom: 4,
        borderRadius: 10, border: `2px solid ${borderColor}`,
        background: "#f8fafc", transition: "border-color .15s",
      }}>
        <span style={{
          fontFamily: "monospace", fontSize: 20, letterSpacing: "0.08em",
          color: ip ? "#1e293b" : "#cbd5e1", userSelect: "none",
        }}>
          {ip || "_ . _ . _ . _"}
        </span>
      </div>

      <p style={{ textAlign: "center", fontSize: 10, color: "#cbd5e1", marginBottom: 6 }}>
        Type from keyboard ·{" "}
        <kbd style={{ fontSize: 10, background: "#f1f5f9", color: "#94a3b8", padding: "1px 4px", borderRadius: 3 }}>
          Enter
        </kbd>{" "}to connect
      </p>

      {/* Status */}
      <div style={{ minHeight: 36, marginBottom: 4, textAlign: "center" }}>
        {phase === "connecting" && (
          <span style={{ color: "#0ea5e9", fontWeight: 600, fontSize: 12, display: "inline-flex", alignItems: "center", gap: 5 }}>
            <Spinner size={13} /> Testing connection…
          </span>
        )}
        {phase === "error" && errorMsg && (
          <div style={{ color: "#ef4444", fontWeight: 600, fontSize: 12 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 5, marginBottom: 2 }}>
              <WifiOffIcon size={13} /> {errorMsg}
            </div>
            <p style={{ color: "#f87171", fontSize: 11, margin: 0 }}>
              Make sure robot is connected to wifi.
            </p>
          </div>
        )}
      </div>

      {/* Numpad */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
        {keys.map((n) => (
          <button key={n} onClick={() => press(n)} {...hoverHandlers()} style={keyBase}>{n}</button>
        ))}

        <button onClick={() => press(".")} {...hoverHandlers()} style={{ ...keyBase, fontSize: 24 }}>.</button>
        <button onClick={() => press("0")} {...hoverHandlers()} style={keyBase}>0</button>
        <button onClick={del} {...hoverHandlers("#fff1f2", "#fca5a5")} style={{ ...keyBase, color: "#64748b" }}>
          <BackIcon size={20} />
        </button>
      </div>

      {/* Connect */}
      <button
        onClick={handleConnect}
        disabled={phase === "connecting"}
        style={{
          width: "100%", height: 58, marginTop: 10,
          borderRadius: 10, border: "none",
          background: phase === "connecting" ? "#7dd3fc" : "#0ea5e9",
          color: "#fff", fontSize: 17, fontWeight: 700,
          cursor: phase === "connecting" ? "not-allowed" : "pointer",
          opacity: phase === "connecting" ? 0.75 : 1,
          display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
          transition: "background .15s, opacity .15s",
          touchAction: "manipulation",
          WebkitTapHighlightColor: "transparent",
          letterSpacing: "0.02em",
        }}
      >
        {phase === "connecting"
          ? <><Spinner size={16} />Connecting…</>
          : <><WifiIcon size={16} />Connect</>}
      </button>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .spin { animation: spin .9s linear infinite; display: inline-block; }
      `}</style>
    </div>
  );
}

// ── LoginForm ──────────────────────────────────────────────────────────────
export default function LoginForm() {
  const { triggerConnect } = useROS();
  const navigate = useNavigate();

  const [robotIp,   setRobotIp]   = useState("");
  const [latency,   setLatency]   = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  // Lock scroll/position
  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
    const onPop = () => window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    const prev = {
      bodyOverflow: document.body.style.overflow,
      bodyPosition: document.body.style.position,
      bodyHeight:   document.body.style.height,
      bodyWidth:    document.body.style.width,
      htmlOverflow: document.documentElement.style.overflow,
      htmlHeight:   document.documentElement.style.height,
    };
    document.documentElement.style.overflow = "hidden";
    document.documentElement.style.height   = "100%";
    document.body.style.overflow  = "hidden";
    document.body.style.position  = "fixed";
    document.body.style.height    = "100%";
    document.body.style.width     = "100%";
    return () => {
      document.documentElement.style.overflow = prev.htmlOverflow;
      document.documentElement.style.height   = prev.htmlHeight;
      document.body.style.overflow  = prev.bodyOverflow;
      document.body.style.position  = prev.bodyPosition;
      document.body.style.height    = prev.bodyHeight;
      document.body.style.width     = prev.bodyWidth;
    };
  }, []);

  const handleConnected = useCallback((ip, connLatency) => {
    setRobotIp(ip); setLatency(connLatency); setShowPopup(true);
  }, []);

  const handlePopupDone = useCallback(() => {
    setShowPopup(false);
    localStorage.setItem("isLoggedIn",   "true");
    localStorage.setItem("loggedInUser", ORG_NAME);
    localStorage.setItem("currentUser",  JSON.stringify({ username: "admin", orgName: ORG_NAME }));
    triggerConnect();
    navigate("/missioncontrol", { replace: true });
  }, [triggerConnect, navigate]);

  return (
    <>
      {showPopup && <ConnectedPopup ip={robotIp} latency={latency} onDone={handlePopupDone} />}

      {/* Full-screen background */}
      <div style={{
        position: "fixed", inset: 0, overflow: "hidden",
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)",
        padding: 8,
        boxSizing: "border-box",
      }}>
        {/*
          Card: side-by-side on ≥600px wide screens.
          Key change: use 100dvh and calc() so it never overflows
          on the 7-inch 1024×600 display.
        */}
        <div style={{
          background: "#fff",
          borderRadius: 18,
          boxShadow: "0 16px 48px rgba(0,0,0,.14)",
          width: "100%",
          maxWidth: 880,
          // Never taller than the viewport minus padding
          maxHeight: "calc(100dvh - 16px)",
          display: "flex",
          flexDirection: "row",
          overflow: "hidden",
        }}>
          {/* LEFT — numpad panel */}
          <div style={{
            flex: "0 0 auto",
            // On 7" (1024px wide), half width = 440px, but cap slightly
            width: "min(100%, 380px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "12px 20px",
            boxSizing: "border-box",
            // Scroll only this panel if somehow still tight
            overflowY: "auto",
          }}>
            <IPEntry onConnected={handleConnected} />
          </div>

          {/* Divider */}
          <div className="divider-line" style={{
            width: 1,
            background: "linear-gradient(to bottom, transparent, #cbd5e1, transparent)",
            flexShrink: 0,
            display: "none",
          }} />

          {/* RIGHT — robot image */}
          <div className="robot-panel" style={{
            flex: 1,
            display: "none",
            alignItems: "center",
            justifyContent: "center",
            background: "#eff6ff",
            padding: 12,
            minWidth: 0,
          }}>
            <img
              src={bgImage} alt="AMR Robot"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                borderRadius: 12,
                maxHeight: "calc(100dvh - 32px)",
              }}
            />
          </div>
        </div>
      </div>

      <style>{`
        /* Show robot panel on screens wide enough (7-inch is ~1024px) */
        @media (min-width: 600px) {
          .robot-panel  { display: flex !important; }
          .divider-line { display: block !important; }
        }
        @keyframes popIn { from{opacity:0;transform:scale(.75)} to{opacity:1;transform:scale(1)} }
        @keyframes ring  { 0%{transform:scale(1);opacity:.7} 70%,100%{transform:scale(1.5);opacity:0} }
      `}</style>
    </>
  );
}