import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

axios.defaults.baseURL = "https://slycyh-7000.preview.csb.app";

export const getTodosAsync = createAsyncThunk(
  "todos/getTodosAsync",
  async () => {
    const res = await axios("/todos");
    return res.data;
  }
);

export const addTodoAsync = createAsyncThunk(
  "todos/addTodoAsync",
  async (data) => {
    const res = await axios.post("/todos", data);
    return res.data;
  }
);

export const toggleTodoAsync = createAsyncThunk(
  "todos/toggleTodoAsync",
  async ({ id, data }) => {
    const res = await axios.patch(`/todos/${id}`, data);
    return res.data;
  }
);

export const removeTodoAsync = createAsyncThunk(
  "todos/removeTodoAsync",
  async (id) => {
    await axios.delete(`/todos/${id}`);
    return id;
  }
);

export const clearCompletedTodosAsync = createAsyncThunk(
  "todos/clearCompletedTodosAsync",
  async (data) => {
    const res = await axios.post("/todos", data);
    return res.data;
  }
);
