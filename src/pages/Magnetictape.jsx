


// import React, { useEffect, useState, useCallback, useRef } from "react";
// import { useLanguage } from "../context/LanguageContext";
// import { useROS } from "../context/RosContext";

// // ── Parser for /moons_motor_diagnostics ──────────────────────────────────────
// function parseMotorDiagnostics(raw) {
//   const defaultMotor = { err: "—", vel: "—", tgt: "—", curr: "—", temp: "—" };
//   try {
//     const [leftPart, rightPart] = raw.split("|").map((s) => s.trim());
//     const parse = (part) => {
//       const body = part.replace(/^[LR]:/, "");
//       const result = {};
//       body.split(",").forEach((kv) => {
//         const [k, v] = kv.split("=");
//         const num = Number(v);
//         result[k.trim()] = k.trim() === "temp"
//           ? Math.abs(num)
//           : isNaN(num) ? v.trim() : num;
//       });
//       return result;
//     };
//     return { left: parse(leftPart), right: parse(rightPart) };
//   } catch {
//     return { left: defaultMotor, right: defaultMotor };
//   }
// }

// const DEFAULT_MOTOR = { err: "—", vel: "—", tgt: "—", curr: "—", temp: "—" };
// const MOTOR_DISPLAY_INTERVAL_MS = 10000;

// // ── Module-level store — lives outside React, survives page navigation ────────
// const motorStore = {
//   data:    { left: { ...DEFAULT_MOTOR }, right: { ...DEFAULT_MOTOR } },
//   pending: null,
//   isFirst: true,
//   interval: null,  // shared interval across mounts
// };

// export default function Home() {
//   const { t } = useLanguage();
//   const { connected, subscribe } = useROS();

//   // ── Refs ──────────────────────────────────────────────────────────────────────
//   const subscribedRef    = useRef(false);
//   const unsubscribersRef = useRef([]);
//   const imuTimeoutRef    = useRef(null);

//   // ── State — initialised from store so last data shows instantly on mount ──────
//   const [plcData, setPlcData] = useState({
//     signals: {
//       work_over:    "red",
//       front_estop:  "red",
//       back_estop:   "red",
//       reset:        "red",
//       front_lidar:  "red",
//       back_lidar:   "red",
//       front_bumper: "red",
//       rear_bumper:  "red",
//       imu:          "red",
//     },
//   });

//   const [motorData, setMotorData] = useState(motorStore.data);

//   // ── Sync store → state on every mount so returning to page shows last data ────
//   useEffect(() => {
//     setMotorData({ ...motorStore.data });
//   }, []);

//   // ── LED color logic ───────────────────────────────────────────────────────────
//   const ledColor = useCallback((name, value) => {
//     // Estops and work_over: TRUE = red (pressed/active)
//     // Bumpers (inverted): FALSE = red (pressed), TRUE = green (normal)
//     // Lidar: TRUE = green (active), FALSE = red (inactive)
//     const redWhenTrue = ["work_over", "reset", "front_estop", "back_estop", "front_bumper", "rear_bumper"];
//     return redWhenTrue.includes(name)
//       ? value ? "red" : "green"
//       : value ? "green" : "red";
//   }, []);

//   // ── Motor interval helpers ────────────────────────────────────────────────────
//   const startMotorInterval = useCallback(() => {
//     if (motorStore.interval) return; // already running (survives page switches)
//     motorStore.interval = setInterval(() => {
//       if (motorStore.pending) {
//         motorStore.data    = motorStore.pending;
//         motorStore.pending = null;
//         setMotorData({ ...motorStore.data });
//       }
//     }, MOTOR_DISPLAY_INTERVAL_MS);
//   }, []);

//   // ── ROS Subscriptions ─────────────────────────────────────────────────────────
//   useEffect(() => {
//     if (!connected) {
//       if (subscribedRef.current) {
//         unsubscribersRef.current.forEach((unsub) => unsub());
//         unsubscribersRef.current = [];
//         subscribedRef.current    = false;

//         clearTimeout(imuTimeoutRef.current);
//         imuTimeoutRef.current = null;

//         // Stop interval and reset store on disconnect
//         if (motorStore.interval) {
//           clearInterval(motorStore.interval);
//           motorStore.interval = null;
//         }
//         motorStore.pending = null;
//         motorStore.isFirst = true;
//         motorStore.data    = { left: { ...DEFAULT_MOTOR }, right: { ...DEFAULT_MOTOR } };

//         setPlcData((prev) => ({
//           ...prev,
//           signals: { ...prev.signals, imu: "red" },
//         }));
//         setMotorData({ left: { ...DEFAULT_MOTOR }, right: { ...DEFAULT_MOTOR } });
//       }
//       return;
//     }

//     if (subscribedRef.current) return;
//     subscribedRef.current = true;

//     // PLC safety topics
//     const safetyTopics = [
//       { name: "work_over",    topic: "/plc/work_over"    },
//       { name: "front_estop",  topic: "/plc/front_estop"  },
//       { name: "back_estop",   topic: "/plc/back_estop"   },
//       { name: "reset",        topic: "/plc/reset"        },
//       { name: "front_lidar",  topic: "/plc/front_lidar"  },
//       { name: "back_lidar",   topic: "/plc/back_lidar"   },
//       { name: "front_bumper", topic: "/plc/front_bumper" },
//       { name: "rear_bumper",  topic: "/plc/back_bumper"  },
//     ];

//     safetyTopics.forEach(({ name, topic }) => {
//       unsubscribersRef.current.push(
//         subscribe(topic, "std_msgs/Bool", (msg) =>
//           setPlcData((prev) => ({
//             ...prev,
//             signals: { ...prev.signals, [name]: ledColor(name, msg.data) },
//           }))
//         )
//       );
//     });

//     // IMU: green while publishing, red after 1.5 s silence
//     unsubscribersRef.current.push(
//       subscribe("/imu/data", "sensor_msgs/Imu", () => {
//         setPlcData((prev) => ({
//           ...prev,
//           signals: { ...prev.signals, imu: "green" },
//         }));
//         clearTimeout(imuTimeoutRef.current);
//         imuTimeoutRef.current = setTimeout(() => {
//           setPlcData((prev) => ({
//             ...prev,
//             signals: { ...prev.signals, imu: "red" },
//           }));
//         }, 1500);
//       })
//     );

//     // Motor diagnostics ───────────────────────────────────────────────────────
//     unsubscribersRef.current.push(
//       subscribe("/moons_motor_diagnostics", "std_msgs/String", (msg) => {
//         const parsed = parseMotorDiagnostics(msg.data);

//         if (motorStore.isFirst) {
//           // First message after connect — show instantly and start interval
//           motorStore.isFirst = false;
//           motorStore.data    = parsed;
//           setMotorData({ ...parsed });
//           startMotorInterval();
//           return;
//         }

//         // Buffer latest value; interval flushes it every 10 s
//         motorStore.pending = parsed;
//       })
//     );
//   }, [connected, subscribe, ledColor, startMotorInterval]);

//   // ── UI Components (7-inch optimized with LARGER motor tables) ──────────────

//   const StatusCard = ({ label, status }) => (
//     <div
//       className={`flex flex-col items-center justify-center rounded-2xl border-2 transition-all shadow-lg ${
//         status === "green"
//           ? "bg-emerald-50 border-emerald-300 dark:bg-emerald-950/30 dark:border-emerald-700"
//           : "bg-red-50 border-red-300 dark:bg-red-950/30 dark:border-red-700"
//       }`}
//       style={{ padding: "14px 8px", minHeight: 90 }}
//     >
//       <div
//         className={`rounded-full mb-2 shadow-lg transition-all ${
//           status === "green"
//             ? "bg-emerald-500 shadow-emerald-400/50"
//             : "bg-red-500 shadow-red-400/50"
//         }`}
//         style={{ width: 40, height: 40 }}
//       />
//       <span
//         className="text-center font-black uppercase leading-tight"
//         style={{ fontSize: 10, letterSpacing: "0.03em", opacity: 0.75, maxWidth: 70 }}
//       >
//         {label}
//       </span>
//     </div>
//   );

//   // LARGER StatBox with bigger text
//   const StatBox = ({ label, value, unit }) => (
//     <div
//       className="bg-white dark:bg-slate-950/50 rounded-xl border border-slate-200 dark:border-slate-700"
//       style={{ padding: "12px 12px 10px" }}
//     >
//       <div
//         className="font-black text-slate-800 dark:text-white"
//         style={{ fontSize: 28, lineHeight: 1.1 }}
//       >
//         {value ?? "—"}{" "}
//         <span className="font-bold text-slate-400" style={{ fontSize: 14 }}>{unit}</span>
//       </div>
//       <div
//         className="font-bold uppercase text-slate-400 mt-1"
//         style={{ fontSize: 11, letterSpacing: "0.06em" }}
//       >
//         {label}
//       </div>
//     </div>
//   );

//   // LARGER MotorCard with bigger everything
//   const MotorCard = ({ side, data, icon }) => {
//     const errOk = data.err === 0 || data.err === "0";
//     return (
//       <div
//         className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-2xl border-2 border-slate-200 dark:border-slate-700 shadow-lg"
//         style={{ padding: "20px 16px" }}
//       >
//         <div className="flex items-center justify-between mb-4">
//           <span style={{ fontSize: 24 }}>{icon}</span>
//           <span
//             className="font-black uppercase text-sky-600 dark:text-sky-400"
//             style={{ fontSize: 15, letterSpacing: "0.06em" }}
//           >
//             {side}
//           </span>
//           <span
//             className={`rounded-full px-3 py-1 font-black uppercase ${
//               errOk
//                 ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400"
//                 : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400"
//             }`}
//             style={{ fontSize: 12, letterSpacing: "0.05em" }}
//           >
//             {errOk ? "OK" : `ERR ${data.err}`}
//           </span>
//         </div>

//         <div className="grid grid-cols-2" style={{ gap: 10 }}>
//           <StatBox label="Velocity" value={data.vel} unit="" />
//           <StatBox label="Target Vel" value={data.tgt} unit="" />
//           <StatBox label="Current" value={data.curr} unit="mA" />
//           <StatBox label="Temperature" value={data.temp} unit="°C" />
//         </div>
//       </div>
//     );
//   };

//   // ── Render ────────────────────────────────────────────────────────────────────
//   return (
//     <div
//       className="min-h-screen bg-gray-50 dark:bg-slate-950 text-slate-900 dark:text-white"
//       style={{ padding: "10px 10px 16px" }}
//     >
//       {/* Header - 7-inch optimized */}
//       <div
//         className="flex justify-between items-center border-b-4 border-sky-500 flex-wrap gap-2"
//         style={{ paddingBottom: 8, marginBottom: 12 }}
//       >
//         <h2 className="font-black uppercase tracking-tighter" style={{ fontSize: 20 }}>
//           ⚠️ {t("magnetic")}
//         </h2>
//         <div
//           className={`flex items-center gap-2 rounded-xl border-4 transition-all ${
//             connected
//               ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20"
//               : "border-red-500 animate-pulse bg-red-50 dark:bg-red-950/20"
//           }`}
//           style={{ padding: "4px 12px" }}
//         >
//           <div
//             className={`rounded-full ${connected ? "bg-emerald-500 animate-pulse" : "bg-red-500"}`}
//             style={{ width: 10, height: 10 }}
//           />
//           <span className="font-black uppercase" style={{ fontSize: 12 }}>
//             {connected ? t("connected") : t("offline")}
//           </span>
//         </div>
//       </div>

//       {/* Safety Interlocks - 7-inch optimized */}
//       <div
//         className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border dark:border-slate-800"
//         style={{ padding: "10px 10px", marginBottom: 10 }}
//       >
//         <h3
//           className="font-black uppercase border-l-8 border-sky-500"
//           style={{ fontSize: 13, paddingLeft: 10, marginBottom: 10, letterSpacing: "0.03em" }}
//         >
//           {t("health.safety_interlocks")}
//         </h3>

//         <div
//           className="grid"
//           style={{ gridTemplateColumns: "repeat(3, 1fr)", gap: 6, marginBottom: 6 }}
//         >
//           <StatusCard label={t("health.pendant_workover")} status={plcData.signals.work_over}   />
//           <StatusCard label={t("health.front_estop1")}     status={plcData.signals.front_estop} />
//           <StatusCard label={t("health.rear_estop1")}      status={plcData.signals.back_estop}  />
//         </div>

//         <div
//           className="grid"
//           style={{ gridTemplateColumns: "repeat(4, 1fr)", gap: 6, marginBottom: 6 }}
//         >
//           <StatusCard label={t("health.fault_reset")} status={plcData.signals.reset}       />
//           <StatusCard label={t("health.front_lidar")} status={plcData.signals.front_lidar} />
//           <StatusCard label={t("health.rear_lidar")}  status={plcData.signals.back_lidar}  />
//           <StatusCard label="IMU"                     status={plcData.signals.imu}         />
//         </div>

//         <div
//           className="grid"
//           style={{ gridTemplateColumns: "repeat(2, 1fr)", gap: 6 }}
//         >
//           <StatusCard label={t("health.front_bumper")} status={plcData.signals.front_bumper} />
//           <StatusCard label={t("health.rear_bumper")}  status={plcData.signals.rear_bumper}  />
//         </div>
//       </div>

//       {/* Motor Driver Information - LARGER */}
//       <div
//         className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border dark:border-slate-800"
//         style={{ padding: "12px 10px" }}
//       >
//         <h3
//           className="font-black uppercase border-l-8 border-sky-500"
//           style={{ fontSize: 15, paddingLeft: 10, marginBottom: 12, letterSpacing: "0.03em" }}
//         >
//           ⚡ Motor Driver Information
//         </h3>

//         <div className="grid grid-cols-2" style={{ gap: 8 }}>
//           <MotorCard side="LEFT" data={motorData.left} icon="◀" />
//           <MotorCard side="RIGHT" data={motorData.right} icon="▶" />
//         </div>
//       </div>
//     </div>
//   );
// }



import React, { useEffect, useState, useCallback, useRef } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useROS } from "../context/RosContext";

// ── Motor error bitmask lookup ───────────────────────────────────────────────
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

// Errors come back as a hex bitmask (e.g. "0x00020000"), so more than one
// fault can be active at the same time — decode every set bit, not just one.
function decodeMotorErrors(errValue) {
  const num = typeof errValue === "string" ? parseInt(errValue, 16) : Number(errValue);
  if (isNaN(num) || num === 0) return ["No Error"];

  const active = [];
  Object.keys(MOTOR_ERROR_CODES).forEach((codeStr) => {
    const code = Number(codeStr);
    if ((num & code) === code) active.push(MOTOR_ERROR_CODES[code]);
  });
  return active.length ? active : [`Unknown fault check the motor drive`];
}

// ── Parser for /moons_motor_diagnostics ──────────────────────────────────────
// Real payload looks like:
// "L_Error=0x00020000,vel=133,tgt=-5721,curr=370,temp=-13,volt=243 | R_Error=0x00020000,vel=134,tgt=-29088,curr=370,temp=-15,volt=244"
//
// NOTE ON VOLTAGE: the driver can publish the bus-voltage field under a few
// different key spellings depending on firmware version ("volt", "voltage",
// or plain "V"). We normalize all of them onto a single `volt` field below
// so the UI always has one consistent key to read from, regardless of which
// spelling the robot happens to be sending.
function parseMotorDiagnostics(raw) {
  const defaultMotor = { err: "0x0", vel: "—", tgt: "—", curr: "—", temp: "—", volt: "—" };
  try {
    const [leftPart, rightPart] = raw.split("|").map((s) => s.trim());
    const parse = (part) => {
      const result = {};
      part.split(",").forEach((kv) => {
        let [k, v] = kv.split("=");
        k = k.trim();
        v = (v ?? "").trim();

        if (k === "L_Error" || k === "R_Error" || k === "err") {
          result.err = v;
          return;
        }

        // Normalize any of the known voltage key spellings onto `volt`.
        if (k === "volt" || k === "voltage" || k === "V" || k === "v") {
          const num = Number(v);
          result.volt = isNaN(num) ? "—" : num;
          return;
        }

        const num = Number(v);
        result[k] = k === "temp" ? Math.abs(num) : isNaN(num) ? 0 : num;
      });
      return result;
    };
    return { left: { ...defaultMotor, ...parse(leftPart) }, right: { ...defaultMotor, ...parse(rightPart) } };
  } catch {
    return { left: defaultMotor, right: defaultMotor };
  }
}

// Added `volt` alongside the existing fields so the Voltage stat box always
// has a defined default ("—") until the first real reading arrives.
const DEFAULT_MOTOR = { err: "0x0", vel: "—", tgt: "—", curr: "—", temp: "—", volt: "—" };
const MOTOR_DISPLAY_INTERVAL_MS = 10000;
// Same idea as the IMU watchdog below: if we don't see a fresh /pgv_pose
// message within this window, treat the pose feed as lost and flip red.
const PGV_POSE_TIMEOUT_MS = 1500;

// ── Module-level store — lives outside React, survives page navigation ────────
const motorStore = {
  data: { left: { ...DEFAULT_MOTOR }, right: { ...DEFAULT_MOTOR } },
  pending: null,
  isFirst: true,
  interval: null,
};

export default function Home() {
  const { t } = useLanguage();
  const { connected, subscribe } = useROS();

  const subscribedRef = useRef(false);
  const unsubscribersRef = useRef([]);
  const imuTimeoutRef = useRef(null);
  const pgvPoseTimeoutRef = useRef(null);

  const [plcData, setPlcData] = useState({
    signals: {
      work_over: "red",
      front_estop: "red",
      back_estop: "red",
      reset: "red",
      front_lidar: "red",
      back_lidar: "red",
      front_bumper: "red",
      rear_bumper: "red",
      imu: "red",
      pgv_pose: "red",
    },
  });

  const [motorData, setMotorData] = useState(motorStore.data);

  useEffect(() => {
    setMotorData({ ...motorStore.data });
  }, []);

  const ledColor = useCallback((name, value) => {
    const redWhenTrue = ["work_over", "reset", "front_estop", "back_estop"];
    if (redWhenTrue.includes(name)) return value ? "red" : "green";
    return value ? "green" : "red";
  }, []);

  const startMotorInterval = useCallback(() => {
    if (motorStore.interval) return;
    motorStore.interval = setInterval(() => {
      if (motorStore.pending) {
        motorStore.data = motorStore.pending;
        motorStore.pending = null;
        setMotorData({ ...motorStore.data });
      }
    }, MOTOR_DISPLAY_INTERVAL_MS);
  }, []);

  useEffect(() => {
    if (!connected) {
      if (subscribedRef.current) {
        unsubscribersRef.current.forEach((unsub) => unsub());
        unsubscribersRef.current = [];
        subscribedRef.current = false;

        clearTimeout(imuTimeoutRef.current);
        imuTimeoutRef.current = null;

        clearTimeout(pgvPoseTimeoutRef.current);
        pgvPoseTimeoutRef.current = null;

        if (motorStore.interval) {
          clearInterval(motorStore.interval);
          motorStore.interval = null;
        }
        motorStore.pending = null;
        motorStore.isFirst = true;
        motorStore.data = { left: { ...DEFAULT_MOTOR }, right: { ...DEFAULT_MOTOR } };

        setPlcData((prev) => ({
          ...prev,
          signals: { ...prev.signals, imu: "red", pgv_pose: "red" },
        }));
        setMotorData({ left: { ...DEFAULT_MOTOR }, right: { ...DEFAULT_MOTOR } });
      }
      return;
    }

    if (subscribedRef.current) return;
    subscribedRef.current = true;

    const safetyTopics = [
      { name: "work_over", topic: "/plc/work_over" },
      { name: "front_estop", topic: "/plc/front_estop" },
      { name: "back_estop", topic: "/plc/back_estop" },
      { name: "reset", topic: "/plc/reset" },
      { name: "front_lidar", topic: "/plc/front_lidar" },
      { name: "back_lidar", topic: "/plc/back_lidar" },
      { name: "front_bumper", topic: "/plc/front_bumper" },
      { name: "rear_bumper", topic: "/plc/back_bumper" },
    ];

    safetyTopics.forEach(({ name, topic }) => {
      unsubscribersRef.current.push(
        subscribe(topic, "std_msgs/Bool", (msg) =>
          setPlcData((prev) => ({
            ...prev,
            signals: { ...prev.signals, [name]: ledColor(name, msg.data) },
          }))
        )
      );
    });

    unsubscribersRef.current.push(
      subscribe(
        "/imu/data",
        "sensor_msgs/Imu",
        () => {
          setPlcData((prev) => ({
            ...prev,
            signals: { ...prev.signals, imu: "green" },
          }));
          clearTimeout(imuTimeoutRef.current);
          imuTimeoutRef.current = setTimeout(() => {
            setPlcData((prev) => ({
              ...prev,
              signals: { ...prev.signals, imu: "red" },
            }));
          }, 1500);
        },
        {
          qosProfile: {
            history: "keep_last",
            depth: 10,
            reliability: "reliable",
            durability: "volatile",
          },
        }
      )
    );

    // ── /pgv_pose watchdog ──────────────────────────────────────────────────
    // Same pattern as IMU above: green the moment a message arrives, and a
    // rolling timeout flips it back to red if the feed goes quiet. We don't
    // care about the pose values here, just whether the topic is alive.
    unsubscribersRef.current.push(
      subscribe("/pgv_pose", "geometry_msgs/Pose2D", () => {
        setPlcData((prev) => ({
          ...prev,
          signals: { ...prev.signals, pgv_pose: "green" },
        }));
        clearTimeout(pgvPoseTimeoutRef.current);
        pgvPoseTimeoutRef.current = setTimeout(() => {
          setPlcData((prev) => ({
            ...prev,
            signals: { ...prev.signals, pgv_pose: "red" },
          }));
        }, PGV_POSE_TIMEOUT_MS);
      })
    );

    unsubscribersRef.current.push(
      subscribe("/moons_motor_diagnostics", "std_msgs/String", (msg) => {
        const parsed = parseMotorDiagnostics(msg.data);

        if (motorStore.isFirst) {
          motorStore.isFirst = false;
          motorStore.data = parsed;
          setMotorData({ ...parsed });
          startMotorInterval();
          return;
        }

        motorStore.pending = parsed;
      })
    );

    return () => {
      unsubscribersRef.current.forEach((unsub) => unsub());
      unsubscribersRef.current = [];
      subscribedRef.current = false;
      clearTimeout(imuTimeoutRef.current);
      imuTimeoutRef.current = null;
      clearTimeout(pgvPoseTimeoutRef.current);
      pgvPoseTimeoutRef.current = null;
    };
  }, [connected, subscribe, ledColor, startMotorInterval]);

  const StatusCard = ({ label, status }) => (
    <div
      className={`flex flex-col items-center justify-center rounded-2xl border-2 transition-all shadow-lg ${status === "green"
        ? "bg-emerald-50 border-emerald-300 dark:bg-emerald-950/30 dark:border-emerald-700"
        : "bg-red-50 border-red-300 dark:bg-red-950/30 dark:border-red-700"
        }`}
      style={{ padding: "14px 8px", minHeight: 90 }}
    >
      <div
        className={`rounded-full mb-2 shadow-lg transition-all ${status === "green"
          ? "bg-emerald-500 shadow-emerald-400/50"
          : "bg-red-500 shadow-red-400/50"
          }`}
        style={{ width: 40, height: 40 }}
      />
      <span
        className="text-center font-black uppercase leading-tight"
        style={{ fontSize: 10, letterSpacing: "0.03em", opacity: 0.75, maxWidth: 70 }}
      >
        {label}
      </span>
    </div>
  );

  const StatBox = ({ label, value, unit }) => (
    <div
      className="bg-white dark:bg-slate-950/50 rounded-xl border border-slate-200 dark:border-slate-700"
      style={{ padding: "12px 12px 10px" }}
    >
      <div
        className="font-black text-slate-800 dark:text-white"
        style={{ fontSize: 28, lineHeight: 1.1 }}
      >
        {value ?? "—"}{" "}
        <span className="font-bold text-slate-400" style={{ fontSize: 14 }}>{unit}</span>
      </div>
      <div
        className="font-bold uppercase text-slate-400 mt-1"
        style={{ fontSize: 11, letterSpacing: "0.06em" }}
      >
        {label}
      </div>
    </div>
  );

  const MotorCard = ({ side, data, icon }) => {
    const errors = decodeMotorErrors(data.err);
    const hasError = !(errors.length === 1 && errors[0] === "No Error");

    return (
      <div
        className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-2xl border-2 border-slate-200 dark:border-slate-700 shadow-lg"
        style={{ padding: "20px 16px" }}
      >
        <div className="flex items-center justify-between mb-4">
          <span style={{ fontSize: 24 }}>{icon}</span>
          <span
            className="font-black uppercase text-sky-600 dark:text-sky-400"
            style={{ fontSize: 15, letterSpacing: "0.06em" }}
          >
            {side}
          </span>
          <span
            className={`rounded-full px-3 py-1 font-black uppercase ${!hasError
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400"
              : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400"
              }`}
            style={{ fontSize: 12, letterSpacing: "0.05em" }}
          >
            {!hasError ? "OK" : `${errors.length} FAULT${errors.length > 1 ? "S" : ""}`}
          </span>
        </div>

        {/*
          Grid now has 5 stat boxes (Velocity, Target Vel, Current,
          Temperature, Voltage). Kept at 2 columns so it wraps into a
          balanced 2-2-1 layout on the narrow 7" kiosk screens this page
          is designed for, instead of squeezing a 5th column in sideways.
        */}
        <div className="grid grid-cols-2" style={{ gap: 10 }}>
          <StatBox label="Velocity" value={data.vel} unit="rpm" />
          <StatBox label="Target Vel" value={data.tgt} unit="rpm" />
          <StatBox label="Current" value={typeof data.curr === 'number' ? (data.curr / 1000).toFixed(2) : data.curr} unit="A" />
          <StatBox label="Temperature" value={data.temp} unit="°C" />
          {/* NEW: Voltage stat box — reads the normalized `volt` field
              produced by parseMotorDiagnostics() above. */}
          <StatBox label="Voltage" value={data.volt} unit="V" />
        </div>

        {/* ── Active Faults ─────────────────────────────────────────────── */}
        {hasError && (
          <div
            className="rounded-xl border-2 border-red-300 bg-red-50 dark:bg-red-950/30 dark:border-red-700"
            style={{ padding: "10px 12px", marginTop: 10 }}
          >
            <div
              className="font-black uppercase text-red-700 dark:text-red-400"
              style={{ fontSize: 11, letterSpacing: "0.05em", marginBottom: 4 }}
            >
              Active Faults
            </div>
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              {errors.map((e, i) => (
                <li
                  key={i}
                  className="font-bold text-red-700 dark:text-red-400"
                  style={{ fontSize: 12 }}
                >
                  {e}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className="min-h-screen bg-gray-50 dark:bg-slate-950 text-slate-900 dark:text-white"
      style={{ padding: "10px 10px 16px" }}
    >
      <div
        className="flex justify-between items-center border-b-4 border-sky-500 flex-wrap gap-2"
        style={{ paddingBottom: 8, marginBottom: 12 }}
      >
        <h2 className="font-black uppercase tracking-tighter" style={{ fontSize: 20 }}>
          ⚠️ {t("magnetic")}
        </h2>
        <div
          className={`flex items-center gap-2 rounded-xl border-4 transition-all ${connected
            ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20"
            : "border-red-500 animate-pulse bg-red-50 dark:bg-red-950/20"
            }`}
          style={{ padding: "4px 12px" }}
        >
          <div
            className={`rounded-full ${connected ? "bg-emerald-500 animate-pulse" : "bg-red-500"}`}
            style={{ width: 10, height: 10 }}
          />
          <span className="font-black uppercase" style={{ fontSize: 12 }}>
            {connected ? t("connected") : t("offline")}
          </span>
        </div>
      </div>

      <div
        className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border dark:border-slate-800"
        style={{ padding: "10px 10px", marginBottom: 10 }}
      >
        <h3
          className="font-black uppercase border-l-8 border-sky-500"
          style={{ fontSize: 13, paddingLeft: 10, marginBottom: 10, letterSpacing: "0.03em" }}
        >
          {t("health.safety_interlocks")}
        </h3>

        <div className="grid" style={{ gridTemplateColumns: "repeat(3, 1fr)", gap: 6, marginBottom: 6 }}>
          <StatusCard label={t("health.pendant_workover")} status={plcData.signals.work_over} />
          <StatusCard label={t("health.front_estop1")} status={plcData.signals.front_estop} />
          <StatusCard label={t("health.rear_estop1")} status={plcData.signals.back_estop} />
        </div>

        <div className="grid" style={{ gridTemplateColumns: "repeat(4, 1fr)", gap: 6, marginBottom: 6 }}>
          <StatusCard label={t("health.fault_reset")} status={plcData.signals.reset} />
          <StatusCard label={t("health.front_lidar")} status={plcData.signals.front_lidar} />
          <StatusCard label={t("health.rear_lidar")} status={plcData.signals.back_lidar} />
          <StatusCard label="IMU" status={plcData.signals.imu} />
        </div>

        <div className="grid" style={{ gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
          <StatusCard label={t("health.front_bumper")} status={plcData.signals.front_bumper} />
          <StatusCard label={t("health.rear_bumper")} status={plcData.signals.rear_bumper} />
          <StatusCard label="PGV Pose" status={plcData.signals.pgv_pose} />
        </div>
      </div>

      <div
        className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border dark:border-slate-800"
        style={{ padding: "12px 10px" }}
      >
        <h3
          className="font-black uppercase border-l-8 border-sky-500"
          style={{ fontSize: 15, paddingLeft: 10, marginBottom: 12, letterSpacing: "0.03em" }}
        >
          ⚡ Motor Driver Information
        </h3>

        <div className="grid grid-cols-2" style={{ gap: 8 }}>
          <MotorCard side="LEFT Motor Drive" data={motorData.left} icon="◀" />
          <MotorCard side="RIGHT Motor Drive" data={motorData.right} icon="▶" />
        </div>
      </div>
    </div>
  );
}