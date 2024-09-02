import styled from "styled-components";

export const CesiumMapWrap = styled.section`
   & {
      width: 100vw;
      height: 100vh;

      & #cesiumContainer {
          width: 100%;
          height: 100%;
      }
   }
`;
