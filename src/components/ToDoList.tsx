import { useState } from "react";

const ToDoList = () => {
  const [value, setValue] = useState("");
  const onChange = (event: React.FormEvent<HTMLInputElement>) => {
    const {
      currentTarget: { value },
    } = event;
    setValue(value);
  };
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(value);
  };
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input onChange={onChange} value={value} placeholder="Write to do" />
        <button>Add</button>
      </form>
    </div>
  );
};

export default ToDoList;
