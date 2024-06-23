import { AreaOptions, Point } from '../constant/type'

const toRadians = (degrees: number) => {
    return degrees * (Math.PI / 180)
}

export const getDronePhotoWidth = (options: AreaOptions) => {
    const { droneAltitude, droneAngle } = options
    const angleRadians = toRadians(droneAngle / 2)
    const halfBase = droneAltitude * Math.tan(angleRadians)
    return Math.floor(halfBase * 2 * 100) / 100
}

export const findMinMaxCoordinates = (coordinates: Point[]): Point[] => {
    let minLatitude = Number.POSITIVE_INFINITY
    let maxLatitude = Number.NEGATIVE_INFINITY
    let minLongitude = Number.POSITIVE_INFINITY
    let maxLongitude = Number.NEGATIVE_INFINITY

    coordinates.forEach((point) => {
        if (point.latitude < minLatitude) {
            minLatitude = point.latitude
        }
        if (point.latitude > maxLatitude) {
            maxLatitude = point.latitude
        }
        if (point.longitude < minLongitude) {
            minLongitude = point.longitude
        }
        if (point.longitude > maxLongitude) {
            maxLongitude = point.longitude
        }
    })

    return [
        { latitude: minLatitude, longitude: minLongitude, height: 100 },
        { latitude: maxLatitude, longitude: maxLongitude, height: 100 },
    ]
}

export const isPointInOverlayUtils = (
    point: Point,
    points: Point[]
): boolean => {
    const x = point.longitude,
        y = point.latitude
    let inside = false

    for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
        const xi = points[i].longitude,
            yi = points[i].latitude
        const xj = points[j].longitude,
            yj = points[j].latitude

        if (
            isPointOnLineSegment(
                point,
                { longitude: xi, latitude: yi, height: 100 },
                { longitude: xj, latitude: yj, height: 100 }
            )
        ) {
            return true
        }

        const intersect =
            yi > y != yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi
        if (intersect) inside = !inside
    }

    return inside
}

export const isPointOnLineSegment = (p: Point, a: Point, b: Point): boolean => {
    const minX = Math.min(a.longitude, b.longitude),
        maxX = Math.max(a.longitude, b.longitude)
    const minY = Math.min(a.latitude, b.latitude),
        maxY = Math.max(a.latitude, b.latitude)

    if (
        p.longitude < minX ||
        p.longitude > maxX ||
        p.latitude < minY ||
        p.latitude > maxY
    ) {
        return false
    }

    const crossProduct =
        (p.latitude - a.latitude) * (b.longitude - a.longitude) -
        (p.longitude - a.longitude) * (b.latitude - a.latitude)
    return Math.abs(crossProduct) <= Number.EPSILON
}

export const haversineDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
) => {
    const R = 6371000
    const dLat = toRadians(lat2 - lat1)
    const dLon = toRadians(lon2 - lon1)
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) *
            Math.cos(toRadians(lat2)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return Math.floor(R * c * 100) / 100
}
