import styled, { keyframes } from "styled-components";
import Circle from "./Circle";

const App = () => {
  return (
    <>
      <Circle bgColor="teal" borderColor="red"></Circle>
      <Circle bgColor="orange" text="Optional"></Circle>
    </>
  );
};

export default App;
