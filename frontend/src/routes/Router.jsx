import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from '../views/Home/Home'
import ChatView from '../views/ChatView/ChatView'
import Projects from '../views/Projects/Projects'


export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" exact element={<Home />} />
        <Route path="/chat" exact element={<ChatView />} />
        <Route path="/projects" exact element={<Projects />} />
        <Route path="*" exact element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  )
}