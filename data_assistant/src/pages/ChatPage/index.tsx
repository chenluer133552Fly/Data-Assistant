import { useChatStore } from '../../stores/chatStore';
import WelcomePage from './WelcomePage';
import ResultsView from './ResultsView';
import './ChatPage.css';

export default function ChatPage() {
  const activeConversationId = useChatStore((s) => s.activeConversationId);

  return (
    <div className="chat-page">
      {activeConversationId ? <ResultsView /> : <WelcomePage />}
    </div>
  );
}
