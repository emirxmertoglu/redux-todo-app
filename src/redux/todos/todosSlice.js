import { createSlice } from "@reduxjs/toolkit";
import {
  getTodosAsync,
  addTodoAsync,
  toggleTodoAsync,
  removeTodoAsync,
  clearCompletedTodosAsync
} from "./services";

const todosSlice = createSlice({
  name: "todos",
  initialState: {
    items: [],
    activeFilter: localStorage.getItem("activeFilter") || "all",
    isLoading: false,
    error: null,
    addNewTodo: {
      isLoading: false,
      error: null
    }
  },
  reducers: {
    changeActiveFilter: (state, action) => {
      state.activeFilter = action.payload;
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
      state.addNewTodo.isLoading = true;
    });
    builder.addCase(addTodoAsync.fulfilled, (state, action) => {
      state.items.push(action.payload);
      state.addNewTodo.isLoading = false;
    });
    builder.addCase(addTodoAsync.rejected, (state, action) => {
      state.addNewTodo.error = action.error.message;
      state.addNewTodo.isLoading = false;
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

    // clear completed todos
    builder.addCase(clearCompletedTodosAsync.fulfilled, (state, action) => {
      state.items = action.payload;
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

export const { changeActiveFilter } = todosSlice.actions;
export default todosSlice.reducer;
