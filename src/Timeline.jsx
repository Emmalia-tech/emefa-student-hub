import { useState, useEffect } from 'react'

function Timeline({ t }) {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('emefaTasks')
    return saved ? JSON.parse(saved) : []
  })
  const [taskName, setTaskName] = useState('')
  const [dueDate, setDueDate] = useState('')

  useEffect(() => {
    localStorage.setItem('emefaTasks', JSON.stringify(tasks))
  }, [tasks])

  const addTask = () => {
    if (taskName.trim() === '' || dueDate === '') return

    const newTask = {
      id: Date.now(),
      name: taskName,
      dueDate: dueDate
    }

    setTasks([...tasks, newTask])
    setTaskName('')
    setDueDate('')
  }

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id))
  }

  const getDaysLeft = (dueDate) => {
    const today = new Date()
    const due = new Date(dueDate)
    today.setHours(0, 0, 0, 0)
    due.setHours(0, 0, 0, 0)
    const diffTime = due - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const sortedTasks = [...tasks].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))

  return (
    <div className="timeline-container">
      <h2 className="dashboard-title">{t.deadlines}</h2>

      <div className="timeline-input-row">
        <input
          type="text"
          placeholder={t.taskPlaceholder}
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          className="timeline-task-input"
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="timeline-date-input"
        />
        <button onClick={addTask} className="timeline-add-button">{t.add}</button>
      </div>

      <div className="timeline-list">
        {sortedTasks.length === 0 && (
          <p className="timeline-empty">{t.noDeadlines}</p>
        )}

        {sortedTasks.map(task => {
          const daysLeft = getDaysLeft(task.dueDate)
          let statusClass = 'upcoming'
          let statusText = `${daysLeft} days left`

          if (daysLeft < 0) {
            statusClass = 'overdue'
            statusText = 'Overdue'
          } else if (daysLeft === 0) {
            statusClass = 'today'
            statusText = 'Due today'
          } else if (daysLeft <= 3) {
            statusClass = 'soon'
          }

          return (
            <div key={task.id} className="timeline-item">
              <div>
                <p className="timeline-task-name">{task.name}</p>
                <p className="timeline-task-date">{new Date(task.dueDate).toDateString()}</p>
              </div>
              <div className="timeline-item-right">
                <span className={`timeline-status ${statusClass}`}>{statusText}</span>
                <button onClick={() => deleteTask(task.id)} className="timeline-delete">✕</button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Timeline