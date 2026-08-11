


// import React, {
//   createContext,
//   useContext,
//   useEffect,
//   useRef,
//   useState,
//   useCallback,
// } from "react";

// // ─── Constants ────────────────────────────────────────────────────────────────
// const ROSLIB_POLL_INTERVAL_MS   = 300;
// const ROSLIB_POLL_MAX_ATTEMPTS  = 40;   // 40 × 300 ms = 12 s
// const CONNECT_TIMEOUT_MS        = 8_000;
// const RECONNECT_BASE_MS         = 3_000;
// const RECONNECT_MAX_MS          = 30_000;

// const ROSContext = createContext(null);

// // ─────────────────────────────────────────────────────────────────────────────
// export function ROSProvider({ children }) {

//   // ── Core refs (no re-render) ──────────────────────────────────────────────
//   const rosRef            = useRef(null);
//   const reconnectTimer    = useRef(null);
//   const connTimeoutTimer  = useRef(null);
//   const roslibPollTimer   = useRef(null);
//   const isConnecting      = useRef(false);
//   const isConnected       = useRef(false);
//   const reconnectAttempts = useRef(0);
//   const savedIp           = useRef(null);
//   const subscribersRef    = useRef([]);
//   const publishersRef     = useRef(new Map()); // Cache for topic publishers
//   const isMounted         = useRef(true);
//   const connectROSRef     = useRef(null);

//   // ── Reactive state ────────────────────────────────────────────────────────
//   const [connected, setConnected] = useState(false);

//   // ─── Helpers ───────────────────────────────────────────────────────────────
//   const safeSetConnected = useCallback((val) => {
//     if (isMounted.current) {
//       setConnected(val);
//       isConnected.current = val;
//     }
//   }, []);

//   const getRosConfig = useCallback(() => ({
//     ip:   localStorage.getItem("rosIP")   ?? "",
//     port: localStorage.getItem("rosPort") ?? "9090",
//   }), []);

//   const cleanupSubscribers = useCallback(() => {
//     subscribersRef.current.forEach((topic) => {
//       try { topic.unsubscribe(); } catch (_) {}
//     });
//     subscribersRef.current = [];
//   }, []);

//   const cleanupPublishers = useCallback(() => {
//     publishersRef.current.forEach((topic) => {
//       try { topic.ros = null; } catch (_) {}
//     });
//     publishersRef.current.clear();
//   }, []);

//   const clearTimer = (ref) => {
//     if (ref.current) { clearTimeout(ref.current); ref.current = null; }
//   };

//   const fullTeardown = useCallback((clearSavedIp = true) => {
//     clearTimer(connTimeoutTimer);
//     clearTimer(reconnectTimer);
//     clearTimer(roslibPollTimer);
//     cleanupSubscribers();
//     cleanupPublishers();
//     if (rosRef.current) {
//       try { rosRef.current.close(); } catch (_) {}
//       rosRef.current = null;
//     }
//     isConnecting.current = false;
//     isConnected.current  = false;
//     if (clearSavedIp) savedIp.current = null;
//   }, [cleanupSubscribers, cleanupPublishers]);

//   // ─── Exponential back-off reconnect ────────────────────────────────────────
//   const scheduleReconnect = useCallback(() => {
//     if (reconnectTimer.current) return;
//     const delay = Math.min(
//       RECONNECT_BASE_MS * Math.pow(1.5, reconnectAttempts.current),
//       RECONNECT_MAX_MS,
//     );
//     reconnectAttempts.current += 1;
//     console.log(
//       `[ROS] Reconnect in ${(delay / 1000).toFixed(1)}s ` +
//       `(attempt ${reconnectAttempts.current})`,
//     );
//     reconnectTimer.current = setTimeout(() => {
//       reconnectTimer.current = null;
//       if (!isConnected.current && connectROSRef.current) {
//         connectROSRef.current();
//       }
//     }, delay);
//   }, []);

//   // ─── Core connect logic ────────────────────────────────────────────────────
//   const _connectROS = useCallback(() => {

//     // Guard 1: ROSLIB must be loaded
//     if (!window.ROSLIB) {
//       console.warn("[ROS] connectROS: window.ROSLIB not ready — skipping");
//       return;
//     }

//     // Guard 2: only one attempt at a time
//     if (isConnecting.current) {
//       console.log("[ROS] connectROS: already connecting — skipping");
//       return;
//     }

//     // Guard 3: need an IP
//     const { ip, port } = getRosConfig();
//     if (!ip) {
//       console.warn("[ROS] connectROS: no IP in localStorage — waiting for login");
//       return;
//     }

//     // Guard 4: already connected to same IP
//     if (rosRef.current && savedIp.current === ip && isConnected.current) {
//       console.log("[ROS] connectROS: already connected to", ip);
//       return;
//     }

//     console.log(`[ROS] Connecting → ws://${ip}:${port}`);

//     fullTeardown(false);
//     isConnecting.current = true;
//     savedIp.current      = ip;

//     // Create ROSLIB.Ros instance
//     let ros;
//     try {
//       ros = new window.ROSLIB.Ros({ url: `ws://${ip}:${port}` });
//     } catch (err) {
//       console.error("[ROS] Failed to create ROSLIB.Ros:", err);
//       isConnecting.current = false;
//       scheduleReconnect();
//       return;
//     }
//     rosRef.current = ros;

//     // Connection timeout
//     connTimeoutTimer.current = setTimeout(() => {
//       if (isConnecting.current) {
//         console.error(`[ROS] Connection timeout (${CONNECT_TIMEOUT_MS / 1000}s)`);
//         isConnecting.current = false;
//         try { ros.close(); } catch (_) {}
//         rosRef.current = null;
//         safeSetConnected(false);
//         scheduleReconnect();
//       }
//     }, CONNECT_TIMEOUT_MS);

//     // ─── KEY FIX: Only set connected=true AFTER ros reports connection ──────
//     ros.on("connection", () => {
//       if (!isMounted.current) return;
//       console.log(`[ROS] ✓ Connected to ws://${ip}:${port}`);
//       clearTimer(connTimeoutTimer);
//       isConnecting.current      = false;
//       reconnectAttempts.current = 0;
//       // CRITICAL: Set connected ONLY here, when ROS is actually ready
//       safeSetConnected(true);
//     });

//     ros.on("error", (err) => {
//       console.error("[ROS] WebSocket error:", err);
//       clearTimer(connTimeoutTimer);
//       isConnecting.current = false;
//       rosRef.current       = null;
//       cleanupSubscribers();
//       cleanupPublishers();
//       safeSetConnected(false);
//       scheduleReconnect();
//     });

//     ros.on("close", () => {
//       console.log("[ROS] Connection closed");
//       clearTimer(connTimeoutTimer);
//       isConnecting.current = false;
//       rosRef.current       = null;
//       cleanupSubscribers();
//       cleanupPublishers();
//       safeSetConnected(false);
//       scheduleReconnect();
//     });
//   }, [getRosConfig, fullTeardown, cleanupSubscribers, cleanupPublishers, scheduleReconnect, safeSetConnected]);

//   // Keep forward-ref current
//   useEffect(() => { connectROSRef.current = _connectROS; }, [_connectROS]);

//   // ─── Poll until window.ROSLIB is available, then connect ──────────────────
//   const waitForROSLIB = useCallback(() => {
//     let attempts = 0;
//     const poll = () => {
//       if (!isMounted.current) return;
//       if (window.ROSLIB) {
//         console.log("[ROS] window.ROSLIB is ready ✓");
//         roslibPollTimer.current = setTimeout(() => {
//           if (isMounted.current) _connectROS();
//         }, 200);
//         return;
//       }
//       attempts += 1;
//       if (attempts >= ROSLIB_POLL_MAX_ATTEMPTS) {
//         console.error(
//           "[ROS] window.ROSLIB never became available. " +
//           "Check that <script src='/roslib.min.js'> is in index.html.",
//         );
//         return;
//       }
//       roslibPollTimer.current = setTimeout(poll, ROSLIB_POLL_INTERVAL_MS);
//     };
//     poll();
//   }, [_connectROS]);

//   const triggerConnect = useCallback(() => {
//     console.log("[ROS] triggerConnect()");

//     const { ip } = getRosConfig();

//     // Already connected to same robot
//     if (
//       rosRef.current &&
//       isConnected.current &&
//       savedIp.current === ip
//     ) {
//       console.log("[ROS] Already connected, skipping reconnect");
//       return;
//     }

//     clearTimer(reconnectTimer);
//     reconnectAttempts.current = 0;

//     if (connectROSRef.current) {
//       connectROSRef.current();
//     }
//   }, [getRosConfig]);

//   // ─── Mount / unmount ───────────────────────────────────────────────────────
//   useEffect(() => {
//     isMounted.current = true;
//     waitForROSLIB();
//     return () => {
//       isMounted.current = false;
//       fullTeardown(true);
//     };
//   }, []); // eslint-disable-line react-hooks/exhaustive-deps

//   // ─── Browser online / offline ─────────────────────────────────────────────
//   useEffect(() => {
//     const onOnline = () => {
//       console.log("[ROS] Browser went online — attempting reconnect");
//       setTimeout(() => {
//         if (!isConnected.current && connectROSRef.current) {
//           isConnecting.current = false;
//           connectROSRef.current();
//         }
//       }, 1_000);
//     };
//     const onOffline = () => console.log("[ROS] Browser went offline");
//     window.addEventListener("online",  onOnline);
//     window.addEventListener("offline", onOffline);
//     return () => {
//       window.removeEventListener("online",  onOnline);
//       window.removeEventListener("offline", onOffline);
//     };
//   }, []);

//   // ─── subscribe ─────────────────────────────────────────────────────────────
//   const subscribe = useCallback((name, messageType, callback) => {
//     // GUARD: Only subscribe if actually connected
//     if (!rosRef.current || !isConnected.current) {
//       console.warn(`[ROS] subscribe("${name}"): not connected`);
//       return () => {};
//     }
//     if (!window.ROSLIB) {
//       console.error("[ROS] subscribe: window.ROSLIB missing");
//       return () => {};
//     }

//     let topic;
//     try {
//       topic = new window.ROSLIB.Topic({ ros: rosRef.current, name, messageType });
//     } catch (err) {
//       console.error(`[ROS] Failed to create Topic "${name}":`, err);
//       return () => {};
//     }

//     const handler = (msg) => { 
//       topic._lastMessageTime = Date.now(); 
//       callback(msg); 
//     };

//     try {
//       topic.subscribe(handler);
//       subscribersRef.current.push(topic);
//       console.log(`[ROS] ✓ Subscribed: ${name}`);
//     } catch (err) {
//       console.error(`[ROS] topic.subscribe() failed for "${name}":`, err);
//       return () => {};
//     }

//     // Warn if silent after 5s
//     const silenceTimer = setTimeout(() => {
//       if (!topic._lastMessageTime)
//         console.warn(`[ROS] ⚠ Topic "${name}" received no messages after 5s.`);
//     }, 5_000);

//     return () => {
//       clearTimeout(silenceTimer);
//       try { topic.unsubscribe(); } catch (_) {}
//       subscribersRef.current = subscribersRef.current.filter((t) => t !== topic);
//       console.log(`[ROS] Unsubscribed: ${name}`);
//     };
//   }, []);

//   // ─── publish (FIXED: Cache topics for reuse) ───────────────────────────────
//   const publish = useCallback((topicName, messageType, message) => {
//     // GUARD: Only publish if actually connected
//     if (!rosRef.current || !isConnected.current) {
//       console.warn(`[ROS] publish("${topicName}"): not connected`);
//       return;
//     }
//     if (!window.ROSLIB) {
//       console.error("[ROS] publish: window.ROSLIB missing");
//       return;
//     }

//     try {
//       // Check if we already have this topic cached
//       let topic = publishersRef.current.get(topicName);

//       if (!topic) {
//         // Create and cache the topic if it doesn't exist
//         topic = new window.ROSLIB.Topic({
//           ros: rosRef.current,
//           name: topicName,
//           messageType: messageType,
//         });
//         publishersRef.current.set(topicName, topic);
//         console.log(`[ROS] ✓ Created publisher for "${topicName}"`);
//       }

//       // Publish the message using the cached topic
//       const rosMessage = new window.ROSLIB.Message(message);
//       topic.publish(rosMessage);

//       console.log(`[ROS] ✓ Published to "${topicName}":`, message);
//     } catch (err) {
//       console.error(`[ROS] publish("${topicName}") failed:`, err);
//     }
//   }, []);

//   // ─── callService ───────────────────────────────────────────────────────────
//   const callService = useCallback(
//     (name, serviceType = "std_srvs/srv/Trigger", request = {}, onResult, onError) => {
//       if (!rosRef.current || !isConnected.current) {
//         console.error(`[ROS] callService("${name}"): not connected`);
//         onError?.("Not connected");
//         return;
//       }
//       if (!window.ROSLIB) {
//         console.error("[ROS] callService: window.ROSLIB missing");
//         onError?.("ROSLIB not loaded");
//         return;
//       }
//       try {
//         const svc = new window.ROSLIB.Service({ ros: rosRef.current, name, serviceType });
//         svc.callService(
//           request,
//           (result) => { console.log(`[ROS] Service OK: ${name}`, result); onResult?.(result); },
//           (err)    => { console.error(`[ROS] Service ERR: ${name}`, err);  onError?.(err);    },
//         );
//       } catch (err) {
//         console.error(`[ROS] callService error for "${name}":`, err);
//         onError?.(err);
//       }
//     },
//     [],
//   );

//   // ─── Context value ─────────────────────────────────────────────────────────
//   return (
//     <ROSContext.Provider
//       value={{ connected, rosConfig: getRosConfig(), subscribe, publish, callService, triggerConnect }}
//     >
//       {children}
//     </ROSContext.Provider>
//   );
// }

// // ── Hook ──────────────────────────────────────────────────────────────────────
// export const useROS = () => {
//   const ctx = useContext(ROSContext);
//   if (!ctx) throw new Error("useROS must be used inside <ROSProvider>");
//   return ctx;
// };





import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";

// ─── Constants ────────────────────────────────────────────────────────────────
const ROSLIB_POLL_INTERVAL_MS   = 300;
const ROSLIB_POLL_MAX_ATTEMPTS  = 40;   // 40 × 300 ms = 12 s
const CONNECT_TIMEOUT_MS        = 8_000;
const RECONNECT_BASE_MS         = 3_000;
const RECONNECT_MAX_MS          = 30_000;

const ROSContext = createContext(null);

// ─────────────────────────────────────────────────────────────────────────────
export function ROSProvider({ children }) {

  // ── Core refs (no re-render) ──────────────────────────────────────────────
  const rosRef            = useRef(null);
  const reconnectTimer    = useRef(null);
  const connTimeoutTimer  = useRef(null);
  const roslibPollTimer   = useRef(null);
  const isConnecting      = useRef(false);
  const isConnected       = useRef(false);
  const reconnectAttempts = useRef(0);
  const savedIp           = useRef(null);
  const subscribersRef    = useRef([]);
  const publishersRef     = useRef(new Map()); // Cache for topic publishers
  const isMounted         = useRef(true);
  const connectROSRef     = useRef(null);

  // ── Reactive state ────────────────────────────────────────────────────────
  const [connected, setConnected] = useState(false);

  // ─── Helpers ───────────────────────────────────────────────────────────────
  const safeSetConnected = useCallback((val) => {
    if (isMounted.current) {
      setConnected(val);
      isConnected.current = val;
    }
  }, []);

  const getRosConfig = useCallback(() => ({
    ip:   localStorage.getItem("rosIP")   ?? "",
    port: localStorage.getItem("rosPort") ?? "9090",
  }), []);

  const cleanupSubscribers = useCallback(() => {
    subscribersRef.current.forEach((topic) => {
      try { topic.unsubscribe(); } catch (_) {}
    });
    subscribersRef.current = [];
  }, []);

  const cleanupPublishers = useCallback(() => {
    publishersRef.current.forEach((topic) => {
      try { topic.ros = null; } catch (_) {}
    });
    publishersRef.current.clear();
  }, []);

  const clearTimer = (ref) => {
    if (ref.current) { clearTimeout(ref.current); ref.current = null; }
  };

  const fullTeardown = useCallback((clearSavedIp = true) => {
    clearTimer(connTimeoutTimer);
    clearTimer(reconnectTimer);
    clearTimer(roslibPollTimer);
    cleanupSubscribers();
    cleanupPublishers();
    if (rosRef.current) {
      try { rosRef.current.close(); } catch (_) {}
      rosRef.current = null;
    }
    isConnecting.current = false;
    isConnected.current  = false;
    if (clearSavedIp) savedIp.current = null;
  }, [cleanupSubscribers, cleanupPublishers]);

  // ─── Exponential back-off reconnect ────────────────────────────────────────
  const scheduleReconnect = useCallback(() => {
    if (reconnectTimer.current) return;
    const delay = Math.min(
      RECONNECT_BASE_MS * Math.pow(1.5, reconnectAttempts.current),
      RECONNECT_MAX_MS,
    );
    reconnectAttempts.current += 1;
    console.log(
      `[ROS] Reconnect in ${(delay / 1000).toFixed(1)}s ` +
      `(attempt ${reconnectAttempts.current})`,
    );
    reconnectTimer.current = setTimeout(() => {
      reconnectTimer.current = null;
      if (!isConnected.current && connectROSRef.current) {
        connectROSRef.current();
      }
    }, delay);
  }, []);

  // ─── Core connect logic ────────────────────────────────────────────────────
  const _connectROS = useCallback(() => {

    // Guard 1: ROSLIB must be loaded
    if (!window.ROSLIB) {
      console.warn("[ROS] connectROS: window.ROSLIB not ready — skipping");
      return;
    }

    // Guard 2: only one attempt at a time
    if (isConnecting.current) {
      console.log("[ROS] connectROS: already connecting — skipping");
      return;
    }

    // Guard 3: need an IP
    const { ip, port } = getRosConfig();
    if (!ip) {
      console.warn("[ROS] connectROS: no IP in localStorage — waiting for login");
      return;
    }

    // Guard 4: already connected to same IP
    if (rosRef.current && savedIp.current === ip && isConnected.current) {
      console.log("[ROS] connectROS: already connected to", ip);
      return;
    }

    console.log(`[ROS] Connecting → ws://${ip}:${port}`);

    fullTeardown(false);
    isConnecting.current = true;
    savedIp.current      = ip;

    // Create ROSLIB.Ros instance
    let ros;
    try {
      ros = new window.ROSLIB.Ros({ url: `ws://${ip}:${port}` });
    } catch (err) {
      console.error("[ROS] Failed to create ROSLIB.Ros:", err);
      isConnecting.current = false;
      scheduleReconnect();
      return;
    }
    rosRef.current = ros;

    // Connection timeout
    connTimeoutTimer.current = setTimeout(() => {
      if (isConnecting.current) {
        console.error(`[ROS] Connection timeout (${CONNECT_TIMEOUT_MS / 1000}s)`);
        isConnecting.current = false;
        try { ros.close(); } catch (_) {}
        rosRef.current = null;
        safeSetConnected(false);
        scheduleReconnect();
      }
    }, CONNECT_TIMEOUT_MS);

    // ─── KEY FIX: Only set connected=true AFTER ros reports connection ──────
    ros.on("connection", () => {
      if (!isMounted.current) return;
      console.log(`[ROS] ✓ Connected to ws://${ip}:${port}`);
      clearTimer(connTimeoutTimer);
      isConnecting.current      = false;
      reconnectAttempts.current = 0;
      // CRITICAL: Set connected ONLY here, when ROS is actually ready
      safeSetConnected(true);
    });

    ros.on("error", (err) => {
      console.error("[ROS] WebSocket error:", err);
      clearTimer(connTimeoutTimer);
      isConnecting.current = false;
      // FIXED: Explicitly close before discarding reference
      try { ros.close(); } catch (_) {}
      rosRef.current = null;
      cleanupSubscribers();
      cleanupPublishers();
      safeSetConnected(false);
      scheduleReconnect();
    });

    ros.on("close", () => {
      console.log("[ROS] Connection closed");
      clearTimer(connTimeoutTimer);
      isConnecting.current = false;
      rosRef.current       = null;
      cleanupSubscribers();
      cleanupPublishers();
      safeSetConnected(false);
      scheduleReconnect();
    });
  }, [getRosConfig, fullTeardown, cleanupSubscribers, cleanupPublishers, scheduleReconnect, safeSetConnected]);

  // Keep forward-ref current
  useEffect(() => { connectROSRef.current = _connectROS; }, [_connectROS]);

  // ─── Poll until window.ROSLIB is available, then connect ──────────────────
  const waitForROSLIB = useCallback(() => {
    let attempts = 0;
    const poll = () => {
      if (!isMounted.current) return;
      if (window.ROSLIB) {
        console.log("[ROS] window.ROSLIB is ready ✓");
        roslibPollTimer.current = setTimeout(() => {
          if (isMounted.current) _connectROS();
        }, 200);
        return;
      }
      attempts += 1;
      if (attempts >= ROSLIB_POLL_MAX_ATTEMPTS) {
        console.error(
          "[ROS] window.ROSLIB never became available. " +
          "Check that <script src='/roslib.min.js'> is in index.html.",
        );
        return;
      }
      roslibPollTimer.current = setTimeout(poll, ROSLIB_POLL_INTERVAL_MS);
    };
    poll();
  }, [_connectROS]);

  const triggerConnect = useCallback(() => {
    console.log("[ROS] triggerConnect()");

    const { ip } = getRosConfig();

    // Already connected to same robot
    if (
      rosRef.current &&
      isConnected.current &&
      savedIp.current === ip
    ) {
      console.log("[ROS] Already connected, skipping reconnect");
      return;
    }

    clearTimer(reconnectTimer);
    reconnectAttempts.current = 0;

    if (connectROSRef.current) {
      connectROSRef.current();
    }
  }, [getRosConfig]);

  // ─── FIXED: Explicit disconnect (call on logout) ──────────────────────────
  const disconnect = useCallback(() => {
    console.log("[ROS] Explicit disconnect()");
    reconnectAttempts.current = 0;
    // fullTeardown with clearSavedIp=true removes savedIp so we won't auto-reconnect
    fullTeardown(true);
    safeSetConnected(false);
  }, [fullTeardown, safeSetConnected]);

  // ─── Mount / unmount ───────────────────────────────────────────────────────
  useEffect(() => {
    isMounted.current = true;
    waitForROSLIB();
    return () => {
      isMounted.current = false;
      fullTeardown(true);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Browser online / offline ─────────────────────────────────────────────
  useEffect(() => {
    const onOnline = () => {
      console.log("[ROS] Browser went online — attempting reconnect");
      setTimeout(() => {
        if (!isConnected.current && connectROSRef.current) {
          isConnecting.current = false;
          connectROSRef.current();
        }
      }, 1_000);
    };
    const onOffline = () => console.log("[ROS] Browser went offline");
    window.addEventListener("online",  onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("online",  onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  // ─── subscribe ─────────────────────────────────────────────────────────────
  const subscribe = useCallback((name, messageType, callback) => {
    // GUARD: Only subscribe if actually connected
    if (!rosRef.current || !isConnected.current) {
      console.warn(`[ROS] subscribe("${name}"): not connected`);
      return () => {};
    }
    if (!window.ROSLIB) {
      console.error("[ROS] subscribe: window.ROSLIB missing");
      return () => {};
    }

    let topic;
    try {
      topic = new window.ROSLIB.Topic({ ros: rosRef.current, name, messageType });
    } catch (err) {
      console.error(`[ROS] Failed to create Topic "${name}":`, err);
      return () => {};
    }

    const handler = (msg) => { 
      topic._lastMessageTime = Date.now(); 
      callback(msg); 
    };

    try {
      topic.subscribe(handler);
      subscribersRef.current.push(topic);
      console.log(`[ROS] ✓ Subscribed: ${name}`);
    } catch (err) {
      console.error(`[ROS] topic.subscribe() failed for "${name}":`, err);
      return () => {};
    }

    // Warn if silent after 5s
    const silenceTimer = setTimeout(() => {
      if (!topic._lastMessageTime)
        console.warn(`[ROS] ⚠ Topic "${name}" received no messages after 5s.`);
    }, 5_000);

    return () => {
      clearTimeout(silenceTimer);
      try { topic.unsubscribe(); } catch (_) {}
      subscribersRef.current = subscribersRef.current.filter((t) => t !== topic);
      console.log(`[ROS] Unsubscribed: ${name}`);
    };
  }, []);

  // ─── publish (FIXED: Cache topics for reuse) ───────────────────────────────
  const publish = useCallback((topicName, messageType, message) => {
    // GUARD: Only publish if actually connected
    if (!rosRef.current || !isConnected.current) {
      console.warn(`[ROS] publish("${topicName}"): not connected`);
      return;
    }
    if (!window.ROSLIB) {
      console.error("[ROS] publish: window.ROSLIB missing");
      return;
    }

    try {
      // Check if we already have this topic cached
      let topic = publishersRef.current.get(topicName);

      if (!topic) {
        // Create and cache the topic if it doesn't exist
        topic = new window.ROSLIB.Topic({
          ros: rosRef.current,
          name: topicName,
          messageType: messageType,
        });
        publishersRef.current.set(topicName, topic);
        console.log(`[ROS] ✓ Created publisher for "${topicName}"`);
      }

      // Publish the message using the cached topic
      const rosMessage = new window.ROSLIB.Message(message);
      topic.publish(rosMessage);

      console.log(`[ROS] ✓ Published to "${topicName}":`, message);
    } catch (err) {
      console.error(`[ROS] publish("${topicName}") failed:`, err);
    }
  }, []);

  // ─── callService ───────────────────────────────────────────────────────────
  const callService = useCallback(
    (name, serviceType = "std_srvs/srv/Trigger", request = {}, onResult, onError) => {
      if (!rosRef.current || !isConnected.current) {
        console.error(`[ROS] callService("${name}"): not connected`);
        onError?.("Not connected");
        return;
      }
      if (!window.ROSLIB) {
        console.error("[ROS] callService: window.ROSLIB missing");
        onError?.("ROSLIB not loaded");
        return;
      }
      try {
        const svc = new window.ROSLIB.Service({ ros: rosRef.current, name, serviceType });
        svc.callService(
          request,
          (result) => { console.log(`[ROS] Service OK: ${name}`, result); onResult?.(result); },
          (err)    => { console.error(`[ROS] Service ERR: ${name}`, err);  onError?.(err);    },
        );
      } catch (err) {
        console.error(`[ROS] callService error for "${name}":`, err);
        onError?.(err);
      }
    },
    [],
  );

  // ─── Context value ─────────────────────────────────────────────────────────
  return (
    <ROSContext.Provider
      value={{
        connected,
        rosConfig: getRosConfig(),
        subscribe,
        publish,
        callService,
        triggerConnect,
        disconnect,  // ← NEW: Added disconnect function
      }}
    >
      {children}
    </ROSContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────────
export const useROS = () => {
  const ctx = useContext(ROSContext);
  if (!ctx) throw new Error("useROS must be used inside <ROSProvider>");
  return ctx;
};