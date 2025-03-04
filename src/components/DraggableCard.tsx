import React, { useEffect, useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import styled from "styled-components";

interface IDraggableCardProps {
  toDoId: number;
  toDoText: string;
  index: number;
  destination: string | null;
}

const Card = styled.div<{
  isDragging: boolean;
  isBin: boolean;
}>`
  background-color: ${(props) =>
    props.isDragging ? "#74b9ff" : props.theme.cardColor};
  box-shadow: ${(props) =>
    props.isDragging ? " 0 2px 5px rgba(0,0,0,0.1)" : "none"};
  border-radius: 5px;
  padding: 5px 10px;
  opacity: ${(props) => (props.isDragging ? 0.5 : 1)};
`;

const DraggableCard = ({
  toDoId,
  toDoText,
  index,
  destination,
}: IDraggableCardProps) => {
  return (
    <Draggable draggableId={toDoId + ""} index={index}>
      {(provided, snapshot) => (
        <Card
          isDragging={snapshot.isDragging}
          isBin={destination === "Bin"}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          {toDoText}
        </Card>
      )}
    </Draggable>
  );
};

export default React.memo(DraggableCard);
