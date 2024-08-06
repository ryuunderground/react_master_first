import { useState } from "react";

const ToDoList = () => {
  const [toDo, setTodo] = useState("");
  const [toDoErr, setToDoErr] = useState("");

  const onChange = (event: React.FormEvent<HTMLInputElement>) => {
    const {
      currentTarget: { value },
    } = event;
    setToDoErr("");
    setTodo(value);
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (toDo.length < 10) {
      return setToDoErr("LONGER!!!!!!!!!");
    }
    console.log("submit");
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input onChange={onChange} value={toDo} placeholder="Write to do" />
        <button>Add</button>
      </form>
      {toDoErr !== "" ? toDoErr : null}
    </div>
  );
};

export default ToDoList;
