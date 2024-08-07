import { createGlobalStyle } from "styled-components";
import PretendardRegular from "../assets/fonts/Pretendard-Regular.woff2";
import reset from "styled-reset";

export const GlobalStyles = createGlobalStyle`
    ${reset}

    @font-face {
        font-family: 'MangoDdobak-B';
        src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/2405-3@1.1/MangoDdobak-B.woff2') format('woff2');
        font-weight: 700;
        font-style: normal;
    }

    @font-face {
        font-family: "Pretendard";
        src: local('PretendardRegular'), local('PretendardRegular');
        font-style: normal;
        src: url(${PretendardRegular}) format('woff2');
    }

    @font-face {
        font-family: 'GangwonEduPowerExtraBoldA';
        src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2201-2@1.0/GangwonEduPowerExtraBoldA.woff') format('woff');
        font-weight: normal;
        font-style: normal;
    }

    * {
        margin: 0px;
        padding: 0px;
        box-sizing: border-box;
    }

    html, body, div, h1, h2, h3, h4, h5, h6, span, ul, li, button, input {
        font-family: 'MangoDdobak-B', 'Pretendard', sans-serif;
        font-size: 16px;
        line-height: 1.5;
    }

    ol, ul {
        list-style: none;
    }
    
    a{
        text-decoration: none;
        color: inherit;
    
        &:hover {
            text-decoration: none;
            color: none;
        }
        
        &:active {
            text-decoration: none;
            color: black;
        }
            
        &:visited {
            text-decoration: none;
            color: black;
        }
            
        &:link {
            text-decoration: none;
            color: black; 
        }
    }

    section, div, article, ul {
    &::-webkit-scrollbar {
      width: 12px;
    }

    &::-webkit-scrollbar-track {
      background: rgba(16, 33, 22, 0.1);
    }

    &::-webkit-scrollbar-thumb {
      background: #333131;
      border-radius: 4px;
    }

    &::-webkit-scrollbar-thumb:hover {
      background: rgba(41, 45, 45, 0.5);
    }
  }

    input, button, textarea, select {
        outline: none;
        border: none;
        background-color: transparent;
    }
    
    button {
        cursor: pointer;
    }
`;
