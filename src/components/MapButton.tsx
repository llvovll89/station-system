import styled from 'styled-components'
import theme from '../styles/theme'
import cesiumLogoIcon from '../assets/image/icon/Cesium_logo_only.png'
import naverMapIcon from '../assets/image/icon/naver map.png'
import { Button } from './button/Button'
import { useState } from 'react'

const MapButtonWrap = styled.article`
    position: absolute;
    bottom: 82px;
    right: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    align-items: center;
    border-radius: 5px;
    overflow: hidden;

    & button {
        box-shadow: 0 2px 3px rgba(0, 0, 0, 0.26);
        width: 52px;
        height: 52px;
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

export const MapButton = () => {
    const [isSelectMap, setIsSelectMap] = useState<{
        isSelect3d: boolean
        isSelectNaver: boolean
    }>({
        isSelect3d: false,
        isSelectNaver: false,
    })

    const onClickMap = (type: string) => {
        if (type === '3d') {
            if (isSelectMap.isSelectNaver) {
                setIsSelectMap((prev) => ({
                    ...prev,
                    isSelectNaver: false,
                }))
            }

            setIsSelectMap((prev) => ({
                ...prev,
                isSelect3d: !prev.isSelect3d,
            }))
        } else {
            if (isSelectMap.isSelect3d) {
                setIsSelectMap((prev) => ({
                    ...prev,
                    isSelect3d: false,
                }))
            }

            setIsSelectMap((prev) => ({
                ...prev,
                isSelectNaver: !prev.isSelectNaver,
            }))
        }
    }

    return (
        <MapButtonWrap>
            <Button
                onClick={() => onClickMap('3d')}
                type="button"
                className={isSelectMap.isSelect3d ? '3d_btn active' : '3d_btn'}
            >
                <img
                    src={cesiumLogoIcon}
                    alt="3dtext"
                    style={{ width: '32px', height: '32px' }}
                />
            </Button>
            <Button
                onClick={() => onClickMap('2d')}
                type="button"
                className={
                    isSelectMap.isSelectNaver ? '2d_btn active' : '2d_btn'
                }
            >
                <img
                    src={naverMapIcon}
                    alt="naver map"
                    style={{ width: '32px', height: '32px' }}
                />
            </Button>
        </MapButtonWrap>
    )
}