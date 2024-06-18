import { useState, useEffect } from 'react'

export interface GeolocationType {
    loaded: boolean
    coordinates: {
        lat: number
        lng: number
        alt?: number
        altAcc?: number
        time?: number
    }
    error?: { code: number; message: string }
}

const useGeoLocation = () => {
    const [isLocation, setIsLocation] = useState<GeolocationType>({
        loaded: false,
        coordinates: { lat: 0, lng: 0 },
    })

    const onGeoLoctaionSucces = (isLocation: {
        coords: { latitude: number; longitude: number }
    }) => {
        setIsLocation({
            loaded: true,
            coordinates: {
                lat: isLocation.coords.latitude,
                lng: isLocation.coords.longitude,
            },
        })
    }

    const onGeoLocationError = (error: { code: number; message: string }) => {
        setIsLocation({
            loaded: true,
            coordinates: {
                lat: 35.8392,
                lng: 128.6841,
            },
            error,
        })
    }

    useEffect(() => {
        if (!('geolocation' in navigator)) {
            onGeoLocationError({
                code: 0,
                message: `
                Geolocation API를 지원하지 않는 브라우저거나 
                사용자분의 위치정보를 파악할 수 없습니다.`,
            })
        }

        navigator.geolocation.getCurrentPosition(
            onGeoLoctaionSucces,
            onGeoLocationError
        )
    }, [])

    return isLocation
}

export default useGeoLocation
