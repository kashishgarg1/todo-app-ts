import React, { useEffect, useState, useRef } from "react";
import './TodoApp.css';
import { Button } from '@murv/button';
import Checkbox from '@murv/checkbox';
import { CheckboxWithLabel } from "@murv/checkbox";
import Input from '@murv/input';

interface Task {
    id: number;
    name: string;
    completed: boolean;
}


function TodoApp() {
    const [name, setName] = useState<string>('');
    const [tasks, setTasks] = useState<Task[]>([]);
    const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
    const [editingTaskName, setEditingTaskName] = useState<string>('');
    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        const fetchAllTask = async () => {
            try {
                const response = await fetch('http://localhost:8080/tasks');
                if (!response.ok) throw new Error('Network response was not ok');
                const content: Task[] = await response.json();
                setTasks(content);
            } catch (error) {
                console.error('Failed to fetch tasks:', error);
            }
        };

        fetchAllTask();
    }, []);

    const create = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        try {
            const response = await fetch('http://localhost:8080/tasks', {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name })
            });
            if (!response.ok) throw new Error('Network response was not ok');
            const task: Task = await response.json();
            setTasks(prevTasks => [...prevTasks, task]);
            setName('');
        } catch (error) {
            console.error('Failed to create task:', error);
        }
    };

    const update = async (id: number, checked: boolean) => {
        const updatedTaskName = editingTaskName.trim() || tasks.find(task => task.id === id)?.name || '';

        const updatedTask: Task = {
            name: updatedTaskName,
            completed: checked,
            id
        };

        try {
            const response = await fetch(`http://localhost:8080/tasks/${id}`, {
                method: "PUT",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedTask)
            });
            if (!response.ok) throw new Error('Network response was not ok');
            setTasks(tasks.map(task => (task.id === id ? { ...task, completed: checked, name: updatedTaskName } : task)));
            setEditingTaskId(null);
            setEditingTaskName('');
        } catch (error) {
            console.error('Failed to update task:', error);
        }
    };

    const del = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                const response = await fetch(`http://localhost:8080/tasks/${id}`, { method: 'DELETE' });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                setTasks(tasks.filter(t => t.id !== id));
            } catch (error) {
                console.error('Failed to delete task:', error);
            }
        }
    };

    const startEditing = (task: Task) => {
        setEditingTaskId(task.id);
        setEditingTaskName(task.name);
        setTimeout(() => inputRef.current?.focus(), 0);
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingTaskName.trim()) return;
        await update(editingTaskId!, false);
    };

    return (
        <div className="todo-container">
            <h1>Tasks List</h1>
            <form className="input-container" onSubmit={create}>
                <Input.TextBoxInput
                    onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setName(e.target.value)}
                    placeholder="Add a new task"
                    type="text"
                    value={name}
                />

                <Button
                    buttonStyle="danger"
                    buttonType="ascent"
                    size="small"
                    type="submit"
                >
                    Add
                </Button>
            </form>
            <ul className="todo-list">
                {tasks.map(task => (
                    <li key={task.id} className="todo-item">
                        <div>


                            <CheckboxWithLabel
                                id={`checkbox-with-label-${task.id}`}
                                checked={task.completed}
                                checkboxPosition="right"
                               
                                onChange={e => update(task.id, e.target.checked)}
                            />
                            {editingTaskId === task.id ? (
                                <form onSubmit={handleEditSubmit}>

                                    <Input.TextBoxInput
                                        placeholder="Edit task"
                                        onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setEditingTaskName(e.target.value)}
                                        type="text"
                                        value={editingTaskName}
                                    />


                                    <Button
                                        buttonStyle="danger"
                                        buttonType="floating"
                                        size="small"
                                        type="submit"
                                    >
                                        Save
                                    </Button>

                                    <Button
                                        onClick={() => setEditingTaskId(null)}
                                        buttonStyle="danger"
                                        buttonType="ascent"
                                        size="small"
                                    >
                                        Cancel
                                    </Button>


                                </form>
                            ) : (
                                <span>{task.name}</span>
                            )}
                        </div>
                        <Button
                            onClick={() => startEditing(task)}
                            buttonStyle="danger"
                            buttonType="ascent"
                            size="small"
                        >
                            Edit
                        </Button>

                        <Button
                            onClick={() => del(task.id)}
                            buttonStyle="danger"
                            buttonType="ascent"
                            size="small"
                        >
                            Delete
                        </Button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default TodoApp;
