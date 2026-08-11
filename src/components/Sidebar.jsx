
// import React, { useState, useEffect } from "react";
// import { Link, useLocation } from "react-router-dom";
// import { Icon } from "@iconify/react";
// import { useLanguage } from "../context/LanguageContext";

// // ── Icon aliases (drop-in replacements for react-icons) ───────────────────────
// const FiSettings     = ({ size = 16, className = "" }) => <Icon icon="feather:settings"      width={size} height={size} className={className} />;
// const FiPlayCircle   = ({ size = 16, className = "" }) => <Icon icon="feather:play-circle"   width={size} height={size} className={className} />;
// const FiZap          = ({ size = 16, className = "" }) => <Icon icon="feather:zap"           width={size} height={size} className={className} />;
// const FiCpu          = ({ size = 16, className = "" }) => <Icon icon="feather:cpu"           width={size} height={size} className={className} />;
// const FiChevronLeft  = ({ size = 16, className = "" }) => <Icon icon="feather:chevron-left"  width={size} height={size} className={className} />;
// const FiChevronRight = ({ size = 16, className = "" }) => <Icon icon="feather:chevron-right" width={size} height={size} className={className} />;
// const TbFileReport   = ({ size = 16, className = "" }) => <Icon icon="tabler:file-report"    width={size} height={size} className={className} />;

// // ── Nav links ─────────────────────────────────────────────────────────────────
// const NAV_LINKS = [
//   { to: "/missioncontrol", labelKey: "missioncontrol", icon: FiPlayCircle },
//   { to: "/magnetic",       labelKey: "magnetic",       icon: FiZap        },
//   { to: "/reports",        labelKey: "reports",        icon: TbFileReport },
//   { to: "/settings",       labelKey: "settings",       icon: FiSettings   },
// ];

// // ── Sidebar ───────────────────────────────────────────────────────────────────
// // Always collapsed (icon-only) below lg to avoid overlapping the header drawer
// // on 7" screens. On lg+ the user can toggle expand/collapse.
// export default function Sidebar() {
//   const location = useLocation();
//   const { t }    = useLanguage();

//   const [isCollapsed, setIsCollapsed] = useState(false);

//   useEffect(() => {
//     const handleResize = () => {
//       if (window.innerWidth < 1024) setIsCollapsed(true);
//     };
//     handleResize();
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   // Prevent manual expansion below lg
//   const handleToggle = () => {
//     if (window.innerWidth < 1024) return;
//     setIsCollapsed((v) => !v);
//   };

//   const sidebarWidth = isCollapsed ? "w-16" : "w-64";

//   return (
//     <>
//       <aside
//         className={`
//           fixed top-0 left-0 h-full z-[245]
//           transition-all duration-300 ease-in-out shadow-2xl
//           bg-gradient-to-b from-sky-50 via-sky-100 to-sky-200
//           ${sidebarWidth}
//         `}
//       >
//         {/* Toggle button — lg+ only */}
//         <button
//           onClick={handleToggle}
//           className="
//             hidden lg:flex
//             absolute -right-5 top-20 z-[250]
//             w-10 h-10
//             bg-sky-700 text-white rounded-full shadow-xl
//             hover:bg-sky-800 active:bg-sky-900
//             transition-all border-2 border-white/20
//             items-center justify-center
//             touch-manipulation
//           "
//           aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
//         >
//           {isCollapsed ? <FiChevronRight size={20} /> : <FiChevronLeft size={20} />}
//         </button>

//         {/* Header */}
//         <div
//           className={`
//             flex items-center border-b-2 border-sky-700/10 bg-white/30 backdrop-blur-md
//             ${isCollapsed
//               ? "h-16 sm:h-20 justify-center"
//               : "h-16 sm:h-20 md:h-24 px-4 sm:px-6"
//             }
//           `}
//         >
//           <div className="flex items-center gap-3 min-w-0">
//             <div className={`
//               bg-sky-700 rounded-xl shadow-lg shrink-0 flex items-center justify-center
//               ${isCollapsed ? "p-2.5 sm:p-3" : "p-2"}
//             `}>
//               <FiCpu className={`text-white animate-pulse ${isCollapsed ? "text-2xl sm:text-3xl" : "text-xl sm:text-2xl"}`} />
//             </div>
//             {!isCollapsed && (
//               <span className="font-black tracking-tighter text-base sm:text-lg leading-none uppercase text-sky-900 truncate">
//                 MENU BAR
//               </span>
//             )}
//           </div>
//         </div>

//         {/* Navigation */}
//         <nav className="p-2 space-y-1 sm:space-y-2 mt-4 sm:mt-6">
//           {NAV_LINKS.map(({ to, labelKey, icon: NavIcon }) => {
//             const isActive = location.pathname === to;
//             const label    = t(labelKey);
//             return (
//               <Link
//                 key={to}
//                 to={to}
//                 title={isCollapsed ? label : undefined}
//                 className={`
//                   flex items-center rounded-[1.5rem] transition-all group
//                   touch-manipulation
//                   ${isCollapsed
//                     ? "justify-center px-0 py-4 sm:py-4 min-h-[56px] sm:min-h-[60px]"
//                     : "gap-4 px-4 py-3.5 sm:py-4"
//                   }
//                   ${isActive
//                     ? "bg-sky-700 text-white shadow-xl scale-[1.02]"
//                     : "text-sky-900/70 hover:bg-sky-700/10 hover:text-sky-900 active:bg-sky-700/20"
//                   }
//                 `}
//               >
//                 <NavIcon
//                   size={isCollapsed ? 26 : 24}
//                   className={
//                     isActive
//                       ? "text-white shrink-0"
//                       : "text-sky-700 shrink-0 group-hover:scale-110 transition-transform"
//                   }
//                 />
//                 {!isCollapsed && (
//                   <span
//                     className={`
//                       font-black text-xs uppercase tracking-widest truncate
//                       ${isActive ? "opacity-100" : "opacity-80"}
//                     `}
//                   >
//                     {label}
//                   </span>
//                 )}
//               </Link>
//             );
//           })}
//         </nav>

//         {/* Footer */}
//         <div className="absolute bottom-4 sm:bottom-6 w-full px-2">
//           <div className="bg-white/40 backdrop-blur-md p-2.5 sm:p-3 rounded-xl border border-sky-700/10 shadow-sm">
//             {!isCollapsed ? (
//               <div className="flex flex-col gap-1 min-w-0">
//                 <span className="text-[10px] font-black text-sky-900 uppercase tracking-tighter leading-tight truncate">
//                   Taikisha QR based navigation
//                 </span>
//                 <span className="text-[9px] text-sky-700 font-mono font-bold tracking-widest uppercase">
//                   V.0.1
//                 </span>
//               </div>
//             ) : (
//               <div className="flex justify-center">
//                 <span className="text-[10px] text-sky-700 font-mono font-bold">©24</span>
//               </div>
//             )}
//           </div>
//         </div>
//       </aside>

//       {/* Content spacer */}
//       <div className={`transition-all duration-300 ${isCollapsed ? "ml-16" : "ml-64"}`} />
//     </>
//   );
// }



import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

// ── Inline SVG Icons (replaces @iconify/react) ────────────────────────────────
const FiSettings = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const FiPlayCircle = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polygon points="10 8 16 12 10 16 10 8" />
  </svg>
);

const FiZap = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const FiCpu = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="6" height="6" />
    <rect x="2" y="2" width="20" height="20" rx="2" ry="2" />
    <line x1="9" y1="2" x2="9" y2="0" /><line x1="15" y1="2" x2="15" y2="0" />
    <line x1="9" y1="24" x2="9" y2="22" /><line x1="15" y1="24" x2="15" y2="22" />
    <line x1="2" y1="9" x2="0" y2="9" /><line x1="2" y1="15" x2="0" y2="15" />
    <line x1="24" y1="9" x2="22" y2="9" /><line x1="24" y1="15" x2="22" y2="15" />
  </svg>
);

const FiChevronLeft = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const FiChevronRight = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const TbFileReport = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <line x1="10" y1="9" x2="8" y2="9" />
  </svg>
);

// ── Nav links ─────────────────────────────────────────────────────────────────
const NAV_LINKS = [
  { to: "/missioncontrol", labelKey: "missioncontrol", icon: FiPlayCircle },
  { to: "/magnetic",       labelKey: "magnetic",       icon: FiZap        },
  { to: "/reports",        labelKey: "reports",        icon: TbFileReport },
  { to: "/settings",       labelKey: "settings",       icon: FiSettings   },
];

// ── Sidebar ───────────────────────────────────────────────────────────────────
// Always collapsed (icon-only) below lg to avoid overlapping the header drawer
// on 7" screens. On lg+ the user can toggle expand/collapse.
export default function Sidebar() {
  const location = useLocation();
  const { t }    = useLanguage();

  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) setIsCollapsed(true);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Prevent manual expansion below lg
  const handleToggle = () => {
    if (window.innerWidth < 1024) return;
    setIsCollapsed((v) => !v);
  };

  const sidebarWidth = isCollapsed ? "w-16" : "w-64";

  return (
    <>
      <aside
        className={`
          fixed top-0 left-0 h-full z-[245]
          transition-all duration-300 ease-in-out shadow-2xl
          bg-gradient-to-b from-sky-50 via-sky-100 to-sky-200
          ${sidebarWidth}
        `}
      >
        {/* Toggle button — lg+ only */}
        <button
          onClick={handleToggle}
          className="
            hidden lg:flex
            absolute -right-5 top-20 z-[250]
            w-10 h-10
            bg-sky-700 text-white rounded-full shadow-xl
            hover:bg-sky-800 active:bg-sky-900
            transition-all border-2 border-white/20
            items-center justify-center
            touch-manipulation
          "
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <FiChevronRight size={20} /> : <FiChevronLeft size={20} />}
        </button>

        {/* Header */}
        <div
          className={`
            flex items-center border-b-2 border-sky-700/10 bg-white/30 backdrop-blur-md
            ${isCollapsed
              ? "h-16 sm:h-20 justify-center"
              : "h-16 sm:h-20 md:h-24 px-4 sm:px-6"
            }
          `}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className={`
              bg-sky-700 rounded-xl shadow-lg shrink-0 flex items-center justify-center
              ${isCollapsed ? "p-2.5 sm:p-3" : "p-2"}
            `}>
              <FiCpu className={`text-white animate-pulse ${isCollapsed ? "text-2xl sm:text-3xl" : "text-xl sm:text-2xl"}`} />
            </div>
            {!isCollapsed && (
              <span className="font-black tracking-tighter text-base sm:text-lg leading-none uppercase text-sky-900 truncate">
                MENU BAR
              </span>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-2 space-y-1 sm:space-y-2 mt-4 sm:mt-6">
          {NAV_LINKS.map(({ to, labelKey, icon: NavIcon }) => {
            const isActive = location.pathname === to;
            const label    = t(labelKey);
            return (
              <Link
                key={to}
                to={to}
                title={isCollapsed ? label : undefined}
                className={`
                  flex items-center rounded-[1.5rem] transition-all group
                  touch-manipulation
                  ${isCollapsed
                    ? "justify-center px-0 py-4 sm:py-4 min-h-[56px] sm:min-h-[60px]"
                    : "gap-4 px-4 py-3.5 sm:py-4"
                  }
                  ${isActive
                    ? "bg-sky-700 text-white shadow-xl scale-[1.02]"
                    : "text-sky-900/70 hover:bg-sky-700/10 hover:text-sky-900 active:bg-sky-700/20"
                  }
                `}
              >
                <NavIcon
                  size={isCollapsed ? 26 : 24}
                  className={
                    isActive
                      ? "text-white shrink-0"
                      : "text-sky-700 shrink-0 group-hover:scale-110 transition-transform"
                  }
                />
                {!isCollapsed && (
                  <span
                    className={`
                      font-black text-xs uppercase tracking-widest truncate
                      ${isActive ? "opacity-100" : "opacity-80"}
                    `}
                  >
                    {label}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-4 sm:bottom-6 w-full px-2">
          <div className="bg-white/40 backdrop-blur-md p-2.5 sm:p-3 rounded-xl border border-sky-700/10 shadow-sm">
            {!isCollapsed ? (
              <div className="flex flex-col gap-1 min-w-0">
                <span className="text-[10px] font-black text-sky-900 uppercase tracking-tighter leading-tight truncate">
                  Taikisha QR based navigation
                </span>
                <span className="text-[9px] text-sky-700 font-mono font-bold tracking-widest uppercase">
                  V.0.1
                </span>
              </div>
            ) : (
              <div className="flex justify-center">
                <span className="text-[10px] text-sky-700 font-mono font-bold">©24</span>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Content spacer */}
      <div className={`transition-all duration-300 ${isCollapsed ? "ml-16" : "ml-64"}`} />
    </>
  );
}