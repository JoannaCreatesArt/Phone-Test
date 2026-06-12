import { useState } from 'react'
import { useStore, type Priority } from '../store/useStore'

export default function TasksView() {
  const { tasks, addTask, toggleTask, deleteTask } = useStore()
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')

  function handleAdd() {
    const t = title.trim()
    if (!t) return
    addTask(t, priority)
    setTitle('')
  }

  const pending   = tasks.filter((t) => !t.completed)
  const completed = tasks.filter((t) => t.completed)

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Tasks</h1>
        <p className="page-subtitle">{pending.length} remaining</p>
      </div>

      <div className="input-row">
        <input
          className="input"
          placeholder="Add a task..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
        />
        <select
          className="select"
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority)}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button className="btn btn-primary" onClick={handleAdd}>Add</button>
      </div>

      {tasks.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">✅</div>
          <div className="empty-state-text">No tasks yet — add one above!</div>
        </div>
      )}

      {pending.length > 0 && (
        <div className="section">
          <div className="section-title">To Do</div>
          <div className="list">
            {pending.map((task) => (
              <div key={task.id} className="list-item">
                <div className="checkbox" onClick={() => toggleTask(task.id)} />
                <span style={{ flex: 1, fontSize: 14, fontWeight: 500 }}>{task.title}</span>
                <span className={`badge badge-${task.priority}`}>{task.priority}</span>
                <button className="btn-icon" onClick={() => deleteTask(task.id)}>×</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {completed.length > 0 && (
        <div className="section">
          <div className="section-title">Done ({completed.length})</div>
          <div className="list">
            {completed.map((task) => (
              <div key={task.id} className="list-item completed">
                <div className="checkbox checked" onClick={() => toggleTask(task.id)} />
                <span style={{
                  flex: 1,
                  fontSize: 14,
                  color: 'var(--stone-400)',
                  textDecoration: 'line-through'
                }}>
                  {task.title}
                </span>
                <span className={`badge badge-${task.priority}`}>{task.priority}</span>
                <button className="btn-icon" onClick={() => deleteTask(task.id)}>×</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
