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
  isDraggingBin: boolean;
  isDroppedBin: boolean;
}>`
  background-color: red;
  /* opacity: ${(props) => {
    if (props.isDroppedBin) return 0;
    if (props.isDraggingBin && props.isDroppedBin) return 0.5;
    return 1;
  }}; */
  background-color: ${(props) =>
    props.isDragging ? "#74b9ff" : props.theme.cardColor};
  box-shadow: ${(props) =>
    props.isDragging ? " 0 2px 5px rgba(0,0,0,0.1)" : "none"};
  border-radius: 5px;
  padding: 5px 10px;
  display: ${(props) => (props.isDroppedBin ? "none" : "flex")};
`;

const DraggableCard = ({
  toDoId,
  toDoText,
  index,
  destination,
}: IDraggableCardProps) => {
  const [isDroppedBin, setIsDroppedBin] = useState(false);

  useEffect(() => {
    // Reset the dropped state when destination changes
    if (destination !== "Bin") {
      setIsDroppedBin(false);
    }
  }, [destination]);

  return (
    <Draggable draggableId={toDoId + ""} index={index}>
      {(provided, snapshot) => (
        <Card
          isDragging={snapshot.isDragging}
          isDraggingBin={destination === "Bin"}
          isDroppedBin={isDroppedBin}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onTransitionEnd={() => {
            // If the card is being dropped in the bin, trigger the disappearing animation
            if (destination === "Bin" && snapshot.isDragging) {
              setIsDroppedBin(true);
            }
          }}
        >
          {toDoText}
        </Card>
      )}
    </Draggable>
  );
};

export default React.memo(DraggableCard);
