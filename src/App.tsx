import { Outlet } from "react-router-dom";
import { createGlobalStyle } from "styled-components";
import { ReactQueryDevtools } from "react-query/devtools";
import { ThemeProvider } from "styled-components";
import { darkTheme } from "./theme";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";

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
  background:linear-gradient(135deg,#e09,#d0e);
  color: black;
}

a{
  text-decoration: none;
  color: ${(props) => props.theme.bgColor};
}

`;

const Wrapper = styled(motion.div)`
  display: flex;
  height: 100vh;
  width: 100vw;
  justify-content: space-between;
  align-items: center;
`;

const Box = styled(motion.div)`
  width: 400px;
  height: 400px;
  background-color: rgba(255, 255, 255, 1);
  border-radius: 40px;
  display: flex;
  font-size: 28px;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1), 0 10px 20px rgba(0, 0, 0, 0.06);
  justify-content: center;
  align-items: center;
`;

const Circle = styled(motion.div)`
  background-color: #00a5ff;
  height: 100px;
  width: 100px;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1), 0 10px 20px rgba(0, 0, 0, 0.06);
`;

const App = () => {
  const [isClicked, setIsClicked] = useState(false);
  const toggleClicked = () => {
    setIsClicked((prev) => !prev);
  };

  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <GlobalStyles />
        <Outlet />
        <Wrapper onClick={toggleClicked}>
          <Box>
            {!isClicked ? (
              <Circle layoutId="circle" style={{ borderRadius: "50%" }} />
            ) : null}
          </Box>
          <Box>
            {isClicked ? (
              <Circle
                layoutId="circle"
                style={{ borderRadius: "0", scale: 2 }}
              />
            ) : null}
          </Box>
        </Wrapper>
        <ReactQueryDevtools initialIsOpen={true} />
      </ThemeProvider>
    </>
  );
};

export default App;
