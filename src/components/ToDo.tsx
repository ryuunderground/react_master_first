import { IToDo } from "./atoms";

const ToDo = ({ text, category }: IToDo) => {
  const onClick = (newCategory: IToDo["category"]) => {
    console.log(newCategory);
  };
  return (
    <li>
      <span>{text}</span>
      {category !== "ToDo" && (
        <button onClick={() => onClick("ToDo")}>To Do</button>
      )}
      {category !== "Doing" && (
        <button onClick={() => onClick("Doing")}>Doing</button>
      )}
      {category !== "Done" && (
        <button onClick={() => onClick("Done")}>Done</button>
      )}
    </li>
  );
};

export default ToDo;
