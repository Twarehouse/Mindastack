// import React, { useState, useEffect } from "react";
// import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// import LoginForm from "./pages/LoginForm";
// import Animation from "./pages/Animation";
// import Magnetictape from "./pages/Magnetictape";
// import Settings from "./pages/Settings";
// import Missioncontrol from "./pages/Missioncontrol";
// import Reports from "./pages/Reports";

// import DashboardLayout from "./components/DashboardLayout";
// import ProtectedRoute from "./components/ProtectedRoute";

// import { LanguageProvider } from "./context/LanguageContext";
// import { ROSProvider } from "./context/RosContext";   // ← ADD THIS

// export default function App() {
//   const [darkMode, setDarkMode] = useState(
//     localStorage.getItem("darkMode") === "true"
//   );

//   useEffect(() => {
//     if (darkMode) document.documentElement.classList.add("dark");
//     else document.documentElement.classList.remove("dark");
//   }, [darkMode]);

//   return (
//     <LanguageProvider>
//       <ROSProvider>  
//       <Router>
//         <Routes>
//           {/* Public routes — no ROS needed */}
//           <Route path="/login"     element={<LoginForm />} />
//           <Route path="/animation" element={<Animation />} />
//           <Route path="/"          element={<FirstVisitHandler />} />

//           {/* Protected routes — wrapped in ROSProvider so all three pages
//               share exactly one WebSocket connection */}
//           <Route
//             path="/missioncontrol"
//             element={
//               <ProtectedRoute>
//                                         {/* ← ADD */}
//                   <DashboardLayout darkMode={darkMode} setDarkMode={setDarkMode}>
//                     <Missioncontrol />
//                   </DashboardLayout>
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/magnetic"
//             element={
//               <ProtectedRoute>
//                   <DashboardLayout darkMode={darkMode} setDarkMode={setDarkMode}>
//                     <Magnetictape />
//                   </DashboardLayout>
//               </ProtectedRoute>
//             }
//           />

//            <Route
//             path="/reports"
//             element={
//               <ProtectedRoute>
//                   <DashboardLayout darkMode={darkMode} setDarkMode={setDarkMode}>
//                     <Reports />
//                   </DashboardLayout>
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/settings"
//             element={
//               <ProtectedRoute>
//                 <DashboardLayout darkMode={darkMode} setDarkMode={setDarkMode}>
//                   <Settings darkMode={darkMode} setDarkMode={setDarkMode} />
//                 </DashboardLayout>
//               </ProtectedRoute>
//             }
//           />

//           <Route path="*" element={<Navigate to="/" replace />} />
//         </Routes>
//       </Router>
//       </ROSProvider>  

//     </LanguageProvider>
//   );
// }

// function FirstVisitHandler() {
//   const loggedInUser = localStorage.getItem("loggedInUser");
//   if (loggedInUser) return <Navigate to="/missioncontrol" replace />;
//   const hasSeenAnimation = sessionStorage.getItem("hasSeenAnimation");
//   if (!hasSeenAnimation) {
//     sessionStorage.setItem("hasSeenAnimation", "true");
//     return <Navigate to="/animation" replace />;
//   }
//   return <Navigate to="/login" replace />;
// }







import React, { useState, useEffect } from "react";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import LoginForm from "./pages/LoginForm";
import Animation from "./pages/Animation";
import Magnetictape from "./pages/Magnetictape";
import Settings from "./pages/Settings";
import Missioncontrol from "./pages/Missioncontrol";
import Reports from "./pages/Reports";

import DashboardLayout from "./components/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";

import { LanguageProvider } from "./context/LanguageContext";
import { ROSProvider } from "./context/RosContext";   // ← ADD THIS

export default function App() {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [darkMode]);

  return (
    <LanguageProvider>
      <ROSProvider>  
      <Router>
        <Routes>
          {/* Public routes — no ROS needed */}
          <Route path="/login"     element={<LoginForm />} />
          <Route path="/animation" element={<Animation />} />
          <Route path="/"          element={<FirstVisitHandler />} />

          {/* Protected routes — wrapped in ROSProvider so all three pages
              share exactly one WebSocket connection */}
          <Route
            path="/missioncontrol"
            element={
              <ProtectedRoute>
                                        {/* ← ADD */}
                  <DashboardLayout darkMode={darkMode} setDarkMode={setDarkMode}>
                    <Missioncontrol />
                  </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/magnetic"
            element={
              <ProtectedRoute>
                  <DashboardLayout darkMode={darkMode} setDarkMode={setDarkMode}>
                    <Magnetictape />
                  </DashboardLayout>
              </ProtectedRoute>
            }
          />

           <Route
            path="/reports"
            element={
              <ProtectedRoute>
                  <DashboardLayout darkMode={darkMode} setDarkMode={setDarkMode}>
                    <Reports />
                  </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <DashboardLayout darkMode={darkMode} setDarkMode={setDarkMode}>
                  <Settings darkMode={darkMode} setDarkMode={setDarkMode} />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      </ROSProvider>  

    </LanguageProvider>
  );
}
function FirstVisitHandler() {
  const loggedInUser = sessionStorage.getItem("loggedInUser");  // ← Changed from localStorage
  
  if (loggedInUser) return <Navigate to="/missioncontrol" replace />;
  
  const hasSeenAnimation = sessionStorage.getItem("hasSeenAnimation");
  if (!hasSeenAnimation) {
    sessionStorage.setItem("hasSeenAnimation", "true");
    return <Navigate to="/animation" replace />;
  }
  
  return <Navigate to="/login" replace />;
}




































