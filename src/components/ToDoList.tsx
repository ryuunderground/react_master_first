import { useState } from "react";
import { useForm } from "react-hook-form";

/* const ToDoList = () => {
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
}; */

interface IForm {
  Email: string;
  firstPhone?: string;
  secondPhone: number;
  lastPhone: number;
  password: string;
  passwordCheck: string;
}

const ToDoList = () => {
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<IForm>({
    defaultValues: {
      Email: "@naver.com",
      firstPhone: "010",
    },
  });
  const onValid = (data: any) => {
    console.log(data);
  };
  console.log(watch());
  console.log(errors);
  return (
    <div>
      <form onSubmit={handleSubmit(onValid)}>
        <input
          {...register("Email", {
            required: "Write Email",
            pattern: {
              value: /^[A-Za-z0-9._%+-]+@naver.com$/,
              message: "Naver email Only",
            },
          })}
          placeholder="Write Email"
        />
        <span>{errors?.Email?.message?.toString()}</span>
        <input {...register("firstPhone")} placeholder="Write" />
        <input
          {...register("secondPhone", {
            required: true,
            minLength: {
              value: 4,
              message: "fullfill the requirement",
            },
            maxLength: {
              value: 4,
              message: "fullfill the requirement",
            },
          })}
          placeholder="Phone"
        />
        <span>{errors?.secondPhone?.message?.toString()}</span>
        <input
          {...(register("lastPhone"),
          { required: true, minLength: 4, maxLength: 4 })}
          placeholder="Number"
        />
        <input
          {...register("password", {
            required: "Password is required",
            minLength: 8,
            maxLength: 16,
          })}
          placeholder="Write password"
        />
        <span>{errors?.password?.message?.toString()}</span>
        <input
          {...register("passwordCheck", {
            required: "Check the Password",
            minLength: 8,
            maxLength: 16,
          })}
          placeholder="Rewrite password"
        />
        <span>{errors?.passwordCheck?.message?.toString()}</span>
        <button>Add</button>
      </form>
    </div>
  );
};

export default ToDoList;
