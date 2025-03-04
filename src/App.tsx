import { Outlet } from "react-router-dom";
import { createGlobalStyle } from "styled-components";
import { ReactQueryDevtools } from "react-query/devtools";
import { ThemeProvider } from "styled-components";
import { useRecoilState, useRecoilValue } from "recoil";
import { darkTheme } from "./theme";
import { DragDropContext, DragUpdate, DropResult } from "react-beautiful-dnd";
import styled from "styled-components";
import { IToDoState, toDoState } from "./components/atoms";
import DraggableCard from "./components/DraggableCard";
import Board from "./components/Board";
import { Droppable } from "react-beautiful-dnd";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

const GlobalStyles = createGlobalStyle`

@import url('https://fonts.googleapis.com/css2?family=Source+Sans+3:ital,wght@0,200..900;1,200..900&display=swap');

html, body, div, span, applet, object, iframe,
h1, h2, h3, h4, h5, h6, p, blockquote, pre,
a, abbr, acronym, address, big, cite, code,
del, dfn, em, img, ins, kbd, q, s, samp,
small, strike, strong, sub, sup, tt, var,
b, u, i, center,
dl, dt, dd, ol, ul, li,
fieldset, form, label, legend,
table, caption, tbody, tfoot, thead, tr, th, td,
article, aside, canvas, details, embed, 
figure, figcaption, footer, header, hgroup, 
menu, nav, output, ruby, section, summary,
time, mark, audio, video {
	margin: 0;
	padding: 0;
	border: 0;
	font-size: 100%;
	font: inherit;
	vertical-align: baseline;
}
/* HTML5 display-role reset for older browsers */
article, aside, details, figcaption, figure, 
footer, header, hgroup, menu, nav, section {
	display: block;
}
body {
	line-height: 1;
}
ol, ul {
	list-style: none;
}
blockquote, q {
	quotes: none;
}
blockquote:before, blockquote:after,
q:before, q:after {
	content: '';
	content: none;
}
table {
	border-collapse: collapse;
	border-spacing: 0;
}
*{
  box-sizing: border-box;
}
body{
  font-family: "Source Sans 3", sans-serif;
  background-color: ${(props) => props.theme.bgColor};
  color: black;
}

a{
  text-decoration: none;
  color: ${(props) => props.theme.bgColor};
}

`;

const Wrapper = styled.div`
  display: flex;
  max-width: 680px;
  width: 100%;
  height: 100vh;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 30px;
`;

const Boards = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  width: 100%;
`;

interface IBinProps {
  isDraggingOver: boolean;
  isdraggingfromthis: boolean;
}
const Bin = styled.div<IBinProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 600px;
  height: 100px;
  border: 3px solid #000;
  background-color: white;
  font-size: 80px;
  position: relative;
  span {
    display: flex;
    position: absolute;
  }
`;

const Save = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  width: 26px;
  height: 26px;
`;

interface IForm {
  newCat: string;
}

const App = () => {
  const [toDos, setToDos] = useRecoilState(toDoState);
  console.log("this is toDos", toDos);
  const saveKeys = Object.keys(toDos);
  // 저장된 toDo 불러오기
  useEffect(() => {
    const savedKeys = Object.keys(sessionStorage);
    savedKeys.forEach((savedKey) => {
      const savedValue = sessionStorage.getItem(savedKey);
      if (savedValue) {
        const SavedData = JSON.parse(savedValue);
        setToDos((allBoards) => {
          console.log(SavedData);
          console.log(allBoards);
          return {
            ...allBoards,
            [savedKey]: SavedData,
          };
        });
      }
    });
  }, []);

  const [currentDragDestination, setCurrentDragDestination] = useState<
    string | null
  >(null);

  const { register, setValue, handleSubmit } = useForm<IForm>();
  const onValid = ({ newCat }: IForm) => {
    setToDos((allBoards) => {
      console.log(newCat);
      return {
        ...allBoards,
        [newCat]: [],
      };
    });
    setValue("newCat", "");
  };
  const onDragEnd = (info: DropResult) => {
    setCurrentDragDestination(null); // Reset destination when drag ends
    console.log(info);
    const { destination, source } = info;
    if (!destination) return;
    if (destination?.droppableId === "Bin") {
      console.log("this will be gone");
      setToDos((allBoards) => {
        const sourceBoard = [...allBoards[source.droppableId]];
        sourceBoard.splice(source.index, 1);
        console.log(allBoards);
        return {
          ...allBoards,
          [source.droppableId]: sourceBoard,
        };
      });
    } else if (destination?.droppableId === source.droppableId) {
      // 같은 보드 내 이동
      setToDos((allBoards) => {
        const boardCopy = [...allBoards[source.droppableId]];
        const taskObj = boardCopy[source.index];
        // 1. 끌고 온 아이템 삭제하기.
        boardCopy.splice(source.index, 1);
        // 2. 끌고 온 아이템 집어넣기.
        boardCopy.splice(destination?.index, 0, taskObj);
        return {
          ...allBoards,
          [source.droppableId]: boardCopy,
        };
      });
    } else if (destination?.droppableId !== source.droppableId) {
      // 다른 보드로 이동
      setToDos((allBoards) => {
        const sourceBoard = [...allBoards[source.droppableId]];
        const taskObj = sourceBoard[source.index];
        const destinationBoard = [...allBoards[destination?.droppableId]];
        sourceBoard.splice(source.index, 1);
        destinationBoard.splice(destination?.index, 0, taskObj);
        return {
          ...allBoards,
          [source.droppableId]: sourceBoard,
          [destination?.droppableId]: destinationBoard,
        };
      });
    }
  };
  const save = () => {
    console.log("saved");

    saveKeys.forEach((saveKey) => {
      const saveValue = toDos[saveKey];
      sessionStorage.setItem(saveKey, JSON.stringify(saveValue));
    });
  };
  const locator = (update: DragUpdate) => {
    setCurrentDragDestination(update.destination?.droppableId || null);
  };
  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <GlobalStyles />
        <Outlet />
        <DragDropContext onDragEnd={onDragEnd} onDragUpdate={locator}>
          <Wrapper>
            <Save onClick={save}>💾</Save>
            <form onSubmit={handleSubmit(onValid)}>
              <input
                type="text"
                placeholder="new category?"
                {...register("newCat", { required: true })}
              />
            </form>
            <Boards>
              {Object.keys(toDos).map((boardId) => (
                <Board
                  boardId={boardId}
                  key={boardId}
                  toDos={toDos[boardId]}
                  destination={currentDragDestination}
                />
              ))}
            </Boards>
            <Droppable droppableId="Bin">
              {(provided, snapshot) => (
                <Bin
                  isDraggingOver={snapshot.isDraggingOver}
                  isdraggingfromthis={Boolean(snapshot.draggingFromThisWith)}
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <span>🗑️</span>
                  {provided.placeholder}
                </Bin>
              )}
            </Droppable>
          </Wrapper>
        </DragDropContext>
        <ReactQueryDevtools initialIsOpen={true} />
      </ThemeProvider>
    </>
  );
};

export default App;
