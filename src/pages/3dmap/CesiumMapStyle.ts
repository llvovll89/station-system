import styled from "styled-components";

export const CesiumMapWrap = styled.section`
  & .cesiumMapWrap {
    width: 100vw;
    height: 100vh;
    position: absolute;
    top: 0px;
    left: 0px;
    visibility: hidden;
    
    &.visible {
      visibility: visible;
    }
    
    & #cesiumContainer {
      width: 100%;
      height: 100%;
    }
  }
`
