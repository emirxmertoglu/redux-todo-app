import { useSelector, useDispatch } from "react-redux";
import { toggle, destroy } from "../redux/todos/todosSlice";

let filtered = [];

export default function TodoList() {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.todos.items);
  const activeFilter = useSelector((state) => state.todos.activeFilter);

  filtered = items;
  if (activeFilter !== "all") {
    filtered = items.filter((todo) =>
      activeFilter === "active"
        ? todo.completed === false
        : todo.completed === true
    );
  }

  const handleDestroy = (id) => {
    if (window.confirm("Are you sure?")) {
      dispatch(destroy(id));
    }
  };

  return (
    <ul className="todo-list">
      {filtered.map((item) => (
        <li key={item.id} className={item.completed ? "completed" : ""}>
          <div className="view">
            <input
              className="toggle"
              type="checkbox"
              checked={item.completed}
              onChange={() => dispatch(toggle({ id: item.id }))}
            />
            <label>{item.title}</label>
            <button
              className="destroy"
              onClick={() => handleDestroy(item.id)}
            ></button>
          </div>
        </li>
      ))}
    </ul>
  );
}
