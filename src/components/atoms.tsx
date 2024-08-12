import { atom } from "recoil";

export interface IToDoState {
  [key: string]: IToDo[];
}

export interface IToDo {
  id: number;
  text: string;
}

export const toDoState = atom<IToDoState>({
  key: "toDo",
  default: {
    "To Do": [],
    Doing: [],
    Done: [],
  },
});
