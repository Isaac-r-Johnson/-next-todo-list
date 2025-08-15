import Head from "next/head";
import styles from "../styles/Home.module.css";
import React, { useState, useEffect } from "react";

export default function Home() {
  type Todo = {
    _id: string;
    text: string;
    completed?: boolean;
  };

  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTodos = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/todos");
        const data = await res.json();
        setTodos(data);
      } catch (err) {
        // handle error
      }
      setLoading(false);
    };
    fetchTodos();
  }, []);

  const addTodo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input.trim() }),
      });
      if (res.ok) {
        const newTodo = await res.json();
        setTodos([newTodo, ...todos]);
        setInput("");
      }
    } catch (err) {
      // handle error
    }
    setLoading(false);
  };

  const removeTodo = async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/todos", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setTodos(todos.filter(todo => todo._id !== id));
      }
    } catch (err) {
      // handle error
    }
    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Todo List</title>
        <meta name="description" content="A simple modern todo list" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h1 className={styles.title}>Todo List</h1>
        <form className={styles.todoForm} onSubmit={addTodo}>
          <input
            className={styles.todoInput}
            type="text"
            placeholder="Add a new task..."
            value={input}
            onChange={e => setInput(e.target.value)}
            autoFocus
            disabled={loading}
          />
          <button className={styles.addButton} type="submit" disabled={loading || !input.trim()}>
            {loading ? "..." : "Add"}
          </button>
        </form>
        <ul className={styles.todoList}>
          {loading && <li className={styles.empty}>Loading...</li>}
          {!loading && todos.length === 0 && (
            <li className={styles.empty}>No tasks yet!</li>
          )}
          {todos.map(todo => (
            <li key={todo._id} className={styles.todoItem}>
              <span>{todo.text}</span>
              <button
                className={styles.removeButton}
                onClick={() => removeTodo(todo._id)}
                aria-label="Remove"
                disabled={loading}
              >
                &times;
              </button>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
