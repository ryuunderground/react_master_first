import { useState } from "react";
import styled, { keyframes } from "styled-components";

const Container = styled.div`
  display: flex;
  background-color: ${(props) => props.theme.bgColor};
`;

const Title = styled.h1`
  font-size: 12px;
  color: ${(props) => props.theme.textColor};
`;

const App = () => {
  const [username, setUsername] = useState("");
  const naming = (e: React.FormEvent<HTMLInputElement>) => {
    const {
      currentTarget: { value },
    } = e;
    setUsername(value);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("hello", username);
  };

  return (
    <>
      <Container>
        <Title>Hello</Title>
      </Container>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="username"
          onChange={naming}
          value={username}
        />
        <button>Log in</button>
      </form>
    </>
  );
};

export default App;
