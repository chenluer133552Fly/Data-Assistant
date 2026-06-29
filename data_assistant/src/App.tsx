import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import ChatPage from './pages/ChatPage';

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<ChatPage />} />
      </Route>
    </Routes>
  );
}
