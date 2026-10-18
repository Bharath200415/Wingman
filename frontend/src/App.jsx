import { useState, useEffect} from "react";
import { useChats } from "./hooks/useChats.js";
import LandingPage from "./components/landing/LandingPage.jsx";
import UploadPage from "./components/upload/UploadPage.jsx";
import Dashboard from "./components/dashboard/Dashboard.jsx";
import { MoonIcon,SunIcon } from "./components/icons.jsx";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";


const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

function AppRoutes() {
  const { chats, addChat, removeChat, renameChat } = useChats();
  const [activeId,      setActiveId]      = useState(() => null);
  const navigate = useNavigate();
  const hasChats = chats.length > 0;

  // Derive active chat data
  const activeChat = chats.find(c => c.id === activeId);

  // After backend returns result, save to localStorage and activate
  const handleResult = (result) => {
    // Pass raw_messages from result if backend returns them
    const id = addChat(result, guessName(result));
    setActiveId(id);
    navigate("/dashboard");
  };

  const handleSelectChat = (id) => {
    setActiveId(id);
  };

  const [darkMode,setDarkMode]=useState(
    localStorage.getItem("theme") !== "light"
  );

  useEffect(()=>{
    if(darkMode){
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme","dark");
    }else{
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme","light");
    }
  },[darkMode]);

  const toggleDarkMode = (e) => {
    if (!document.startViewTransition) {
      setDarkMode(!darkMode);
      return;
    }
    const x = e.clientX || window.innerWidth / 2;
    const y = e.clientY || window.innerHeight / 2;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const transition = document.startViewTransition(() => {
      setDarkMode(!darkMode);
    });

    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 400,
          easing: "ease-out",
          pseudoElement: "::view-transition-new(root)",
        }
      );
    });
  };


  // Returning users skip the landing page; the dashboard needs at least one chat.
  return (
    <Routes>
      <Route path="/" element={hasChats ? <Navigate to="/dashboard" replace /> : <LandingPage />} />
      <Route path="/upload" element={
        <UploadPage
          apiUrl={API_URL}
          onResult={handleResult}
          hasChats={hasChats}
        />
      }/>
      <Route path="/dashboard" element={hasChats ? (
        <Dashboard
          chatData={activeChat?.data ?? null}
          chats={chats}
          activeId={activeId}
          onSelectChat={handleSelectChat}
          onDeleteChat={(id) => {
            removeChat(id);
            if (activeId === id) setActiveId(chats.find(c => c.id !== id)?.id ?? null);
          }}
          onRenameChat={renameChat}
          onNewAnalysis={() => navigate("/upload")}
        />
      ) : <Navigate to="/" replace />}/>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function guessName(result) {
  const parts = result?.participants ?? [];
  if (parts.length === 2) return `${parts[0].split(" ")[0]} & ${parts[1].split(" ")[0]}`;
  if (parts.length > 2)   return `${parts[0].split(" ")[0]} + ${parts.length - 1} others`;
  return `Chat ${new Date().toLocaleDateString()}`;
}
