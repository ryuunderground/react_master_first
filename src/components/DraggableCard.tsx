import React from "react";
import { Draggable } from "react-beautiful-dnd";
import styled from "styled-components";

interface IDraggableCardProps {
  toDoId: number;
  toDoText: string;
  index: number;
}

const Card = styled.div<{ isDragging: boolean }>`
  background-color: ${(props) =>
    props.isDragging ? "#74b9ff" : props.theme.cardColor};
  box-shadow: ${(props) =>
    props.isDragging ? " 0 2px 5px rgba(0,0,0,0.1)" : "none"};
  border-radius: 5px;
  padding: 5px 10px;
`;

const DraggableCard = ({ toDoId, toDoText, index }: IDraggableCardProps) => {
  return (
    <Draggable draggableId={toDoId + ""} index={index}>
      {(club, snapshot) => (
        <Card
          isDragging={snapshot.isDragging}
          ref={club.innerRef}
          {...club.draggableProps}
          {...club.dragHandleProps}
        >
          {toDoText}
        </Card>
      )}
    </Draggable>
  );
};

export default React.memo(DraggableCard);
