import React, { useState, useEffect } from 'react'

const API_BASE = 'http://localhost:5000/api'

export default function Home() {
    const [tasks, setTasks] = useState({
        todo: [],
        ongoing: [],
        completed: []
    })
    const [inputValue, setInputValue] = useState('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // Fetch all tasks on component mount
    useEffect(() => {
        fetchTasks()
    }, [])

    const fetchTasks = async () => {
        try {
            setLoading(true)
            setError(null)
            const response = await fetch(`${API_BASE}/tasks`)
            if (!response.ok) throw new Error('Failed to fetch tasks')
            
            const allTasks = await response.json()
            
            // Organize tasks by status
            const organized = {
                todo: allTasks.filter(t => t.status === 'todo'),
                ongoing: allTasks.filter(t => t.status === 'ongoing'),
                completed: allTasks.filter(t => t.status === 'completed')
            }
            setTasks(organized)
        } catch (err) {
            setError(err.message)
            console.error('Error fetching tasks:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleAddTask = async (e) => {
        e.preventDefault()
        
        if (!inputValue.trim()) {
            setError('Please enter a task title')
            return
        }

        try {
            setError(null)
            const response = await fetch(`${API_BASE}/tasks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title: inputValue })
            })

            if (!response.ok) throw new Error('Failed to add task')
            
            const newTask = await response.json()
            setTasks(prev => ({
                ...prev,
                todo: [...prev.todo, newTask]
            }))
            setInputValue('')
        } catch (err) {
            setError(err.message)
            console.error('Error adding task:', err)
        }
    }

    const handleDeleteTask = async (taskId, status) => {
        try {
            setError(null)
            const response = await fetch(`${API_BASE}/tasks/${taskId}`, {
                method: 'DELETE'
            })

            if (!response.ok) throw new Error('Failed to delete task')
            
            setTasks(prev => ({
                ...prev,
                [status]: prev[status].filter(t => t.id !== taskId)
            }))
        } catch (err) {
            setError(err.message)
            console.error('Error deleting task:', err)
        }
    }

    const handleMoveTask = async (taskId, currentStatus, newStatus) => {
        try {
            setError(null)
            const response = await fetch(`${API_BASE}/tasks/${taskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: newStatus })
            })

            if (!response.ok) throw new Error('Failed to update task')
            
            const updatedTask = await response.json()
            
            // Remove from current status
            const currentTasks = tasks[currentStatus].filter(t => t.id !== taskId)
            // Add to new status
            const newTasks = [...tasks[newStatus], updatedTask]
            
            setTasks(prev => ({
                ...prev,
                [currentStatus]: currentTasks,
                [newStatus]: newTasks
            }))
        } catch (err) {
            setError(err.message)
            console.error('Error moving task:', err)
        }
    }

    const renderTaskSection = (status, title) => {
        const sectionTasks = tasks[status]
        
        return (
            <div className="task-section">
                <h2>{title}</h2>
                {sectionTasks.length === 0 ? (
                    <p className="no-tasks">No tasks</p>
                ) : (
                    <div className="task-list">
                        {sectionTasks.map(task => (
                            <div key={task.id} className="task-item">
                                <p className="task-title">{task.title}</p>
                                <div className="task-actions">
                                    {status !== 'todo' && (
                                        <button
                                            className="btn-prev"
                                            onClick={() => {
                                                const prevStatus = status === 'ongoing' ? 'todo' : 'ongoing'
                                                handleMoveTask(task.id, status, prevStatus)
                                            }}
                                            title="Move to previous"
                                        >
                                            ← Back
                                        </button>
                                    )}
                                    {status !== 'completed' && (
                                        <button
                                            className="btn-next"
                                            onClick={() => {
                                                const nextStatus = status === 'todo' ? 'ongoing' : 'completed'
                                                handleMoveTask(task.id, status, nextStatus)
                                            }}
                                            title="Move to next"
                                        >
                                            Next →
                                        </button>
                                    )}
                                    <button
                                        className="btn-delete"
                                        onClick={() => handleDeleteTask(task.id, status)}
                                        title="Delete task"
                                    >
                                        🗑️ Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        )
    }

    if (loading) {
        return <div className="home"><p>Loading tasks...</p></div>
    }

    return (
        <div className='home'>
            {error && <div className="error-message">{error}</div>}
            
            <form className="task-form" onSubmit={handleAddTask}>
                <input
                    type='text'
                    placeholder='Enter your task here'
                    className="task-input"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                />
                <button type="submit" className="add-task-button">ADD TASK</button>
            </form>

            <div className='task-sections'>
                {renderTaskSection('todo', 'Todo Tasks')}
                {renderTaskSection('ongoing', 'Ongoing Tasks')}
                {renderTaskSection('completed', 'Completed Tasks')}
            </div>
        </div>
    )
}

