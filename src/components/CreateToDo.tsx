import { useForm } from "react-hook-form";
import { useSetRecoilState } from "recoil";
import { toDoState } from "./atoms";

interface ITodoForm {
  toDo: string;
}

const CreateToDo = () => {
  const { register, handleSubmit, setValue } = useForm<ITodoForm>();
  const setToDos = useSetRecoilState(toDoState);
  const onSubmit = ({ toDo }: ITodoForm) => {
    setToDos((oldToDos) => [
      { text: toDo, category: "ToDo", id: Date.now() },
      ...oldToDos,
    ]);
    setValue("toDo", "");
    console.log(toDo);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register("toDo", { required: "Write what to do" })}
        placeholder="Write to do"
      />
      <button>Add</button>
    </form>
  );
};

export default CreateToDo;
