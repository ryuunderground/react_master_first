import { atom } from "recoil";

export interface IToDo {
  text: string;
  id: number;
  category: "ToDo" | "Doing" | "Done";
}

export const toDoState = atom<IToDo[]>({
  key: "toDo",
  default: [],
});
