import { Outlet } from "react-router-dom";
import { createGlobalStyle } from "styled-components";
import { ReactQueryDevtools } from "react-query/devtools";
import { ThemeProvider } from "styled-components";
import { darkTheme } from "./theme";
import styled from "styled-components";
import {
  motion,
  spring,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
  useScroll,
} from "framer-motion";
import { useEffect, useRef } from "react";

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
  flex-direction: column;
  height: 200vh;
  width: 100vw;
  margin: 0 auto;
  justify-content: space-evenly;
  align-items: center;
`;

const Box = styled(motion.div)`
  width: 200px;
  height: 200px;
  background-color: rgba(255, 255, 255, 1);
  border-radius: 40px;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1), 0 10px 20px rgba(0, 0, 0, 0.06);
  display: grid;
  grid-template-columns: repeat(2, 1fr);
`;

const SVG = styled.svg`
  width: 300px;
  height: 300px;
  g {
    stroke: black;
    stroke-width: 70;
  }
`;
const svgVars = {
  start: {
    pathLength: 0.2,
    fill: "rgba(255,255,255, 0)",
  },
  end: { pathLength: 1, fill: "rgba(255,255,255, 1)" },
};

const App = () => {
  const x = useMotionValue(0);
  const rotateZ = useTransform(x, [-800, 800], [-360, 360]);
  const gradient = useTransform(
    x,
    [-800, 0, 800],
    [
      "linear-gradient(135deg, rgb(0, 71, 238), rgb(79, 88, 255))",
      "linear-gradient(135deg, rgb(238, 0, 153), rgb(221, 0, 238))",
      "linear-gradient(135deg, rgb(129, 255, 2), rgb(229, 255, 0))",
    ]
  );
  const { scrollY, scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 1], [1, 5]);
  /* useMotionValueEvent(x, "change", (I) => {
    console.log(I);
  }); */
  useMotionValueEvent(scrollY, "change", (latest) => {
    console.log("scrollY : ", latest);
  });
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    console.log("scrollYProgress : ", latest);
  });
  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <GlobalStyles />
        <Outlet />
        <Wrapper style={{ background: gradient }}>
          <SVG
            version="1.0"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 2700 2000"
            preserveAspectRatio="xMidYMid meet"
          >
            <motion.g
              variants={svgVars}
              initial={"start"}
              transform="translate(0.000000,2048.000000) scale(0.100000,-0.100000)"
              animate={"end"}
              fill="transparent"
              transition={{
                default: {
                  duration: 5,
                },
                fill: {
                  duration: 2,
                  delay: 5,
                },
              }}
            >
              <path
                d="M12135 17289 c-1653 -119 -6093 -436 -8345 -594 -899 -64 -1670 -122
-1714 -130 -94 -17 -147 -48 -178 -108 l-23 -42 -3 -6164 c-1 -4473 1 -6175 9
-6205 7 -25 27 -57 53 -82 50 -51 77 -57 336 -78 102 -9 453 -41 780 -71 327
-31 834 -78 1125 -105 292 -27 751 -70 1020 -95 270 -25 729 -68 1020 -95 292
-27 751 -70 1020 -95 270 -25 753 -70 1075 -100 322 -30 828 -77 1125 -105
297 -28 709 -66 915 -85 514 -47 1419 -132 2520 -236 425 -40 671 -59 720 -56
93 6 -20 -44 995 447 253 122 521 252 595 288 74 35 198 95 275 132 77 37 347
167 600 290 253 123 510 246 570 275 61 29 337 163 615 297 278 134 545 262
594 283 108 48 150 87 171 157 14 46 15 105 11 453 -3 220 -8 933 -11 1585 -5
1114 -8 1680 -20 3585 -3 429 -8 1311 -11 1960 -4 649 -9 1644 -13 2210 l-6
1030 -28 47 c-17 29 -44 57 -70 72 -24 14 -53 39 -65 56 -12 16 -36 37 -53 46
-43 22 -157 60 -3454 1167 l-480 162 -150 2 c-108 1 -533 -26 -1520 -98z
m1265 -1886 c0 -868 3 -3959 7 -6869 l6 -5290 -354 32 c-195 18 -599 56 -899
84 -300 28 -808 75 -1130 105 -322 30 -805 75 -1075 100 -489 46 -1117 104
-2035 190 -267 24 -728 67 -1025 95 -297 28 -756 71 -1020 95 -264 25 -748 70
-1075 100 -327 31 -833 78 -1125 105 -291 27 -724 67 -962 90 -238 22 -437 40
-443 40 -7 0 -10 1868 -10 5954 l0 5954 58 6 c31 4 1038 76 2237 161 3579 255
5889 419 7340 524 754 54 1400 99 1438 100 l67 1 0 -1577z m1051 1351 c354
-118 946 -317 1314 -441 369 -123 922 -309 1230 -412 l560 -188 6 -59 c4 -32
7 -444 8 -914 1 -470 4 -900 6 -955 2 -55 6 -734 9 -1510 4 -775 8 -1734 11
-2130 10 -1500 15 -2311 21 -3612 l7 -1343 -169 -81 c-216 -104 -375 -181
-754 -364 -330 -160 -522 -252 -725 -350 -71 -34 -337 -163 -590 -285 -253
-123 -523 -253 -600 -290 -237 -114 -439 -212 -713 -344 -145 -70 -265 -126
-267 -124 -7 9 -14 13618 -6 13618 5 0 298 -97 652 -216z"
              ></path>
              <path
                d="M7435 14908 c-434 -43 -858 -184 -1235 -410 -286 -172 -497 -363
-690 -623 -436 -589 -617 -1374 -463 -2004 36 -148 119 -278 205 -322 78 -40
184 -16 247 56 67 77 84 133 92 300 14 269 34 416 103 725 37 164 52 213 100
316 62 131 150 256 282 399 144 156 230 231 402 347 344 232 663 318 1177 318
123 0 254 -6 316 -15 106 -14 353 -74 419 -102 19 -8 67 -26 105 -40 157 -57
378 -189 520 -311 330 -284 517 -756 475 -1202 -26 -285 -124 -535 -298 -760
-142 -184 -254 -281 -557 -485 -269 -182 -365 -255 -473 -359 -233 -225 -351
-453 -449 -871 -26 -114 -52 -271 -72 -450 -27 -231 -59 -492 -71 -575 -18
-121 -62 -634 -63 -740 -1 -119 15 -187 66 -285 95 -179 297 -271 441 -201
132 64 192 194 216 458 6 68 13 134 15 148 3 14 9 68 15 120 5 52 16 136 24
185 21 128 42 279 61 430 36 279 81 519 122 650 28 89 110 253 156 312 98 126
205 209 498 386 286 174 434 282 574 422 342 340 523 695 615 1210 43 237 38
612 -11 915 -47 291 -150 608 -266 818 -129 234 -227 372 -372 520 -269 275
-662 504 -1047 610 -236 65 -276 73 -466 97 -161 20 -235 25 -410 23 -117 0
-253 -5 -303 -10z"
              ></path>
              <path
                d="M7735 6683 c-141 -20 -203 -65 -268 -194 -171 -341 -46 -805 256
-954 203 -100 458 -21 587 182 52 81 90 219 90 321 -1 152 -42 273 -137 404
-116 160 -349 266 -528 241z"
              ></path>
            </motion.g>
          </SVG>
          <button onClick={() => x.set(200)}>click me</button>
          <Box drag="x" dragSnapToOrigin style={{ x, rotateZ, scale }}></Box>
        </Wrapper>
        <ReactQueryDevtools initialIsOpen={true} />
      </ThemeProvider>
    </>
  );
};

export default App;
