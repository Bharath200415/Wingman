import { useState, useEffect} from "react";
import { useChats } from "./hooks/useChats.js";
import UploadPage from "./components/upload/UploadPage.jsx";
import Dashboard from "./components/dashboard/Dashboard.jsx";
import { MoonIcon,SunIcon } from "./components/icons.jsx";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function App() {
  const { chats, addChat, removeChat, renameChat } = useChats();
  const [activeId,      setActiveId]      = useState(() => null);
  const [showUpload,    setShowUpload]    = useState(false);

  // Derive active chat data
  const activeChat = chats.find(c => c.id === activeId);

  // After backend returns result, save to localStorage and activate
  const handleResult = (result) => {
    // Pass raw_messages from result if backend returns them
    const id = addChat(result, guessName(result));
    setActiveId(id);
    setShowUpload(false);
  };

  const handleSelectChat = (id) => {
    setActiveId(id);
    setShowUpload(false);
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


  // Show upload page if: no chats saved, or explicitly triggered
  const shouldShowUpload = showUpload || (chats.length === 0 && !activeId);

  if (shouldShowUpload) {
    return (
      <div>
        <button onClick={()=>setDarkMode(!darkMode)} 
          className='cursor-pointer absolute size-6 border border-neutral-200 dark:border-neutral-800 rounded-md  flex items-center justify-center top-4 right-4'>
              <SunIcon  className='absolute inset-0 shrink-0 size-4 dark:scale-0 scale-100 dark:rotate-45 text-neutral-500 transition-all duration-300 m-auto'/>
              <MoonIcon className='absolute inset-0 shrink-0 size-4 dark:scale-100 scale-0 dark:rotate-0 rotate-45 text-neutral-500 transition-all duration-300 m-auto'/>
        </button>
        <UploadPage
          apiUrl={API_URL}
          onResult={handleResult}
        />
      </div>

    );
  }

  return (
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
      onNewAnalysis={() => setShowUpload(true)}
    />
  );
}

function guessName(result) {
  const parts = result?.participants ?? [];
  if (parts.length === 2) return `${parts[0].split(" ")[0]} & ${parts[1].split(" ")[0]}`;
  if (parts.length > 2)   return `${parts[0].split(" ")[0]} + ${parts.length - 1} others`;
  return `Chat ${new Date().toLocaleDateString()}`;
}
