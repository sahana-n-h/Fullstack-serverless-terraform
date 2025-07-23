import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "https://6irfqo1ep3.execute-api.us-west-2.amazonaws.com/tasks"; // change if needed

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editTask, setEditTask] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setTasks(res.data);
    } catch {
      alert("Failed to fetch tasks");
    }
    setLoading(false);
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;
    try {
      await axios.post(API_URL, { title, description });
      setTitle("");
      setDescription("");
      fetchTasks();
    } catch {
      alert("Failed to add task");
    }
  };

  const startEdit = (task) => {
    setEditTask(task);
    setTitle(task.title);
    setDescription(task.description);
  };

  const updateTask = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;
    try {
      await axios.put(`${API_URL}/${editTask.taskId}`, { title, description });
      setEditTask(null);
      setTitle("");
      setDescription("");
      fetchTasks();
    } catch {
      alert("Failed to update task");
    }
  };

  const deleteTask = async (taskId) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await axios.delete(`${API_URL}/${taskId}`);
      fetchTasks();
    } catch {
      alert("Failed to delete task");
    }
  };

  const cancelEdit = () => {
    setEditTask(null);
    setTitle("");
    setDescription("");
  };

  return (
    <div style={{
      maxWidth: 500,
      margin: "40px auto",
      fontFamily: "Inter, Arial, sans-serif",
      background: "#fff",
      borderRadius: 16,
      boxShadow: "0 4px 32px rgba(0,0,0,0.08)",
      padding: 28,
    }}>
      <h2 style={{
        textAlign: "center",
        marginBottom: 24,
        letterSpacing: 0.5,
        color: "#334155"
      }}>
        <span style={{ color: "#3b82f6" }}>Serverless</span> Tasks CRUD
      </h2>
      <form onSubmit={editTask ? updateTask : addTask} style={{ marginBottom: 24 }}>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Title"
          style={{
            width: "100%",
            padding: "10px 12px",
            marginBottom: 10,
            borderRadius: 8,
            border: "1px solid #d1d5db",
            fontSize: 16,
          }}
        />
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Description"
          style={{
            width: "100%",
            padding: "10px 12px",
            minHeight: 58,
            borderRadius: 8,
            border: "1px solid #d1d5db",
            fontSize: 15,
            marginBottom: 8,
            resize: "vertical"
          }}
        />
        <div style={{ marginTop: 10, display: "flex", gap: 12 }}>
          <button
            type="submit"
            style={{
              background: "#2563eb",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "9px 24px",
              fontWeight: 600,
              fontSize: 15,
              cursor: "pointer",
              transition: "background 0.2s"
            }}>
            {editTask ? "Update" : "Add"} Task
          </button>
          {editTask && (
            <button
              type="button"
              onClick={cancelEdit}
              style={{
                background: "#e5e7eb",
                color: "#374151",
                border: "none",
                borderRadius: 8,
                padding: "9px 24px",
                fontWeight: 600,
                fontSize: 15,
                cursor: "pointer"
              }}>
              Cancel
            </button>
          )}
        </div>
      </form>
      {loading ? (
        <div style={{ textAlign: "center", color: "#64748b", fontWeight: 500 }}>Loading...</div>
      ) : (
        <ul style={{ padding: 0 }}>
          {tasks.length === 0 ? (
            <li style={{ textAlign: "center", color: "#64748b", listStyle: "none" }}>No tasks yet.</li>
          ) : (
            tasks
              .filter(task => task.title && task.description)
              .map(task => (
                <li key={task.taskId}
                  style={{
                    listStyle: "none",
                    marginBottom: 18,
                    padding: "16px 20px",
                    background: "#f1f5f9",
                    borderRadius: 10,
                    boxShadow: "0 1px 2px rgba(0,0,0,0.03)"
                  }}>
                  <div style={{
                    fontWeight: 700,
                    fontSize: 17,
                    color: "#1e293b",
                    marginBottom: 2
                  }}>{task.title}</div>
                  <div style={{
                    fontSize: 15.2,
                    color: "#64748b",
                    marginBottom: 8,
                    wordBreak: "break-word"
                  }}>{task.description}</div>
                  <div>
                    <button
                      style={{
                        background: "#2563eb",
                        color: "#fff",
                        border: "none",
                        borderRadius: 7,
                        padding: "6px 18px",
                        fontSize: 14.3,
                        fontWeight: 500,
                        cursor: "pointer",
                        marginRight: 8,
                        transition: "background 0.2s"
                      }}
                      onClick={() => startEdit(task)}>
                      Edit
                    </button>
                    <button
                      style={{
                        background: "#e11d48",
                        color: "#fff",
                        border: "none",
                        borderRadius: 7,
                        padding: "6px 18px",
                        fontSize: 14.3,
                        fontWeight: 500,
                        cursor: "pointer",
                        transition: "background 0.2s"
                      }}
                      onClick={() => deleteTask(task.taskId)}>
                      Delete
                    </button>
                  </div>
                </li>
              ))
          )}
        </ul>
      )}
    </div>
  );
}

export default App;
