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
  text?: string;
}

const Container = styled.div<ContainerProps>`
  width: 100px;
  height: 100px;
  background-color: ${(props) => props.bgColor};
  border-radius: 50%;
  border: 5px solid ${(props) => props.borderColor};
`;

const Circle = ({
  bgColor,
  borderColor,
  text = "Default Text",
}: CircleProps) => {
  return (
    <>
      <Container bgColor={bgColor} borderColor={borderColor ?? bgColor}>
        {text}
      </Container>
    </>
  );
};

export default Circle;

interface PlayerProps {
  name: string;
  level: number;
}

const sayHello = (playerInfo: PlayerProps) =>
  `Hello ${playerInfo.name}. Your level is ${playerInfo.level}`;

sayHello({ name: "Ryu", level: 25 });
