import { Droppable } from "react-beautiful-dnd";
import styled from "styled-components";
import DraggableCard from "./DraggableCard";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { IToDo, toDoState } from "./atoms";
import { useSetRecoilState } from "recoil";

interface IBoardProps {
  toDos: IToDo[];
  boardId: string;
}

interface IForm {
  toDo: string;
}

const Wrapper = styled.div`
  background-color: ${(props) => props.theme.boardColor};
  padding: 10px 0px;
  border-radius: 5px;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  transition: background-color 0.3s ease-in-out;
`;

const Title = styled.h1`
  font-size: 18px;
  font-weight: 600;
  text-align: center;
`;

interface IAreaProps {
  isDraggingOver: boolean;
  isdraggingfromthis: boolean;
}
const Area = styled.div<IAreaProps>`
  background-color: ${(props) =>
    props.isDraggingOver
      ? "#dfe6e9"
      : props.isdraggingfromthis
      ? "#b2bec3"
      : "transparent"};
  flex-grow: 1;
  padding: 20px;
`;

const Form = styled.form`
  width: 100%;
  display: flex;
  justify-content: center;
  input {
    width: 90%;
    height: 20px;
    font-size: 16px;
    margin: 2px;
    background-color: transparent;
    border: 1px solid #000000;
    border-radius: 5px;
  }
`;
const Header = styled.header`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  margin-bottom: 10px;
`;
const Delete = styled.button`
  width: 20px;
  height: 100%;
  background-color: transparent;
  font-weight: 600;
  font-size: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  &:hover {
    color: white;
  }
`;

const Board = ({ toDos, boardId }: IBoardProps) => {
  const setToDos = useSetRecoilState(toDoState);
  const { register, setValue, handleSubmit } = useForm<IForm>();
  const onValid = ({ toDo }: IForm) => {
    const newToDo = {
      id: Date.now(),
      text: toDo,
    };
    setToDos((allBoards) => {
      return {
        ...allBoards,
        [boardId]: [newToDo, ...allBoards[boardId]],
      };
    });
    setValue("toDo", "");
  };
  const deleteBoard = () => {
    setToDos((allBoards) => {
      const { [boardId]: _, ...rest } = allBoards; // 객체에서 멤버를 삭제
      return rest;
    });
  };

  return (
    <>
      <Wrapper>
        <Header>
          <Title>{boardId}</Title>
          <Delete onClick={deleteBoard}>X</Delete>
        </Header>

        <Form onSubmit={handleSubmit(onValid)}>
          <input
            type="text"
            {...register("toDo", { required: true })}
            placeholder={`Add task on ${boardId}`}
          />
        </Form>
        <Droppable droppableId={boardId}>
          {(magic, snapshot) => (
            <Area
              isDraggingOver={snapshot.isDraggingOver}
              isdraggingfromthis={Boolean(snapshot.draggingFromThisWith)}
              ref={magic.innerRef}
              {...magic.droppableProps}
            >
              {toDos.map((toDo, index) => (
                <DraggableCard
                  key={toDo.id}
                  index={index}
                  toDoId={toDo.id}
                  toDoText={toDo.text}
                />
              ))}
              {magic.placeholder}
            </Area>
          )}
        </Droppable>
      </Wrapper>
    </>
  );
};

export default Board;
