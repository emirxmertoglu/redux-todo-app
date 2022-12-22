import { createSlice } from "@reduxjs/toolkit";

const todosSlice = createSlice({
  name: "todos",
  initialState: {
    items: [
      { id: "1", title: "Learn Redux", completed: true },
      { id: "2", title: "Read a book", completed: false }
    ]
  },
  reducers: {}
});

export default todosSlice.reducer;
