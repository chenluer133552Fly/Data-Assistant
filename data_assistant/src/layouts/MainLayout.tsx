import { Outlet } from 'react-router-dom';
import { useAppStore } from '../stores/appStore';
import { useChatStore } from '../stores/chatStore';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import ChatInput from '../components/ChatInput';
import './MainLayout.css';

export default function MainLayout() {
  const sidebarCollapsed = useAppStore((s) => s.sidebarCollapsed);
  const conversations = useChatStore((s) => s.conversations);
  const activeConversationId = useChatStore((s) => s.activeConversationId);
  const newChat = useChatStore((s) => s.newChat);
  const activeConversation = conversations.find((conversation) => conversation.id === activeConversationId);
  const showFloatingInput = Boolean(activeConversation);

  return (
    <div className={`layout ${sidebarCollapsed ? 'layout--collapsed' : ''}`}>
      <Header />
      <Sidebar />
      <main className="layout__main">
        <div className="layout__content">
          <Outlet />
        </div>
        {showFloatingInput && (
          <div className="layout__floating-input">
            <ChatInput onNewChat={newChat} />
          </div>
        )}
      </main>
    </div>
  );
}
