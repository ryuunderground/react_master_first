import { useState } from "react";
import styled from "styled-components";

//component-prop
interface ContainerProps {
  bgColor: string;
  borderColor: string;
}
// styled-prop
interface CircleProps {
  bgColor: string;
  borderColor?: string;
}

const Container = styled.div<ContainerProps>`
  width: 100px;
  height: 100px;
  background-color: ${(props) => props.bgColor};
  border-radius: 50%;
  border: 5px solid ${(props) => props.borderColor};
`;

const Circle = ({ bgColor, borderColor }: CircleProps) => {
  const [counter, setCounter] = useState<number | string>(0);
  setCounter(3);
  setCounter("dasf");
  return (
    <>
      <Container
        bgColor={bgColor}
        borderColor={borderColor ?? bgColor}
      ></Container>
    </>
  );
};

export default Circle;
