import styled from 'styled-components'
import theme from '../styles/theme'
import cesiumLogoIcon from '../assets/image/icon/Cesium_logo_only.png'
import naverMapIcon from '../assets/image/icon/naver map.png'
import { Button } from './button/Button'

const MapButtonWrap = styled.article`
  position: absolute;
  bottom: 70px;
  right: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
  border-radius: 5px;
  overflow: hidden;

  & button {
    box-shadow: 0 2px 3px rgba(0, 0, 0, 0.26);
    width: 42px;
    height: 42px;
    border-radius: 5px;
    background-color: ${theme.color.black};
    color: ${theme.color.white};
    display: flex;
    align-items: center;
    justify-content: center;

    &.active {
      background-color: ${theme.color.primary};
    }
  }
`
export const MapButton = (props: any) => {

    const onClickMap = (type: number) => {
        if (type === 0) {
            props.setIs3DMapType(true)
        } else {
            props.setIs3DMapType(false)
        }
    }

    return (
        <MapButtonWrap>
            <Button
                onClick={() => onClickMap(0)}
                type="button"
                className={props.is3DMapType ? 'active' : ''}
            >
                <img
                    src={cesiumLogoIcon}
                    alt="3dtext"
                    style={{ width: '24px', height: '24px' }}
                />
            </Button>

            <Button
                onClick={() => onClickMap(1)}
                type="button"
                className={
                    !props.is3DMapType ? 'active' : ''
                }
            >
                <img
                    src={naverMapIcon}
                    alt="naver map"
                    style={{ width: '24px', height: '24px' }}
                />
            </Button>
        </MapButtonWrap>
    )
}
