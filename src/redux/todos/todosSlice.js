import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
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

const todosSlice = createSlice({
  name: "todos",
  initialState: {
    items: [],
    activeFilter: "all",
    isLoading: false,
    error: null,
    addNewTodoIsLoading: false,
    addNewTodoError: null
  },
  reducers: {
    changeActiveFilter: (state, action) => {
      state.activeFilter = action.payload;
    },
    clearCompleted: (state) => {
      const filtered = state.items.filter((item) => item.completed === false);
      state.items = filtered;
    }
  },
  extraReducers: (builder) => {
    // get todos
    builder.addCase(getTodosAsync.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getTodosAsync.fulfilled, (state, action) => {
      state.items = action.payload;
      state.isLoading = false;
    });
    builder.addCase(getTodosAsync.rejected, (state, action) => {
      state.error = action.error.message;
      state.isLoading = false;
    });

    // add todo
    builder.addCase(addTodoAsync.pending, (state) => {
      state.addNewTodoIsLoading = true;
    });
    builder.addCase(addTodoAsync.fulfilled, (state, action) => {
      state.items.push(action.payload);
      state.addNewTodoIsLoading = false;
    });
    builder.addCase(addTodoAsync.rejected, (state, action) => {
      state.addNewTodoError = action.error.message;
      state.addNewTodoIsLoading = false;
    });

    // toggle todo
    builder.addCase(toggleTodoAsync.fulfilled, (state, action) => {
      const { id, completed } = action.payload;
      const item = state.items.find((item) => item.id === id);
      item.completed = completed;
    });

    // remove todo item
    builder.addCase(removeTodoAsync.fulfilled, (state, action) => {
      const id = action.payload;
      const filtered = state.items.filter((item) => item.id !== id);
      state.items = filtered;
    });
  }
});

export const selectTodos = (state) => state.todos.items;
export const selectFilteredTodos = (state) => {
  if (state.todos.activeFilter === "all") {
    return state.todos.items;
  }

  return state.todos.items.filter((todo) =>
    state.todos.activeFilter === "active"
      ? todo.completed === false
      : todo.completed === true
  );
};
export const selectActiveFilter = (state) => state.todos.activeFilter;

export const { changeActiveFilter, clearCompleted } = todosSlice.actions;
export default todosSlice.reducer;
