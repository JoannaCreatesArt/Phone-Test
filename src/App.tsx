import { useState } from 'react'
import Sidebar from './components/Sidebar'
import HomeView from './views/HomeView'
import TasksView from './views/TasksView'
import HabitsView from './views/HabitsView'
import TimerView from './views/TimerView'
import StatsView from './views/StatsView'
import QuestBoardView from './views/QuestBoardView'
import SettingsModal from './components/SettingsModal'
import ShareModal from './components/ShareModal'

export type View = 'home' | 'tasks' | 'habits' | 'timer' | 'stats' | 'quests'

export default function App() {
  const [view, setView] = useState<View>('home')
  const [showSettings, setShowSettings] = useState(false)
  const [showShare, setShowShare] = useState(false)

  function renderView() {
    switch (view) {
      case 'home':    return <HomeView onNavigate={setView} />
      case 'tasks':   return <TasksView />
      case 'habits':  return <HabitsView />
      case 'timer':   return <TimerView />
      case 'stats':   return <StatsView />
      case 'quests':  return <QuestBoardView />
    }
  }

  return (
    <div className="app-shell">
      <Sidebar
        active={view}
        onNavigate={setView}
        onSettings={() => setShowSettings(true)}
        onShare={() => setShowShare(true)}
      />
      <main className="main-content">{renderView()}</main>

      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
      {showShare    && <ShareModal    onClose={() => setShowShare(false)} />}
    </div>
  )
}
