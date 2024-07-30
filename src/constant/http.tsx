// ip http request url
// export const MISSION = `http://13.124.113.180:8080/mission`
// export const LOGIN = `http://13.124.113.180:8080/login`
// export const JOIN = `http://13.124.113.180:8080/sign-up`
// export const STATION = `http://13.124.113.180:8080/station`
// export const SCHEDULE = `http://13.124.113.180:8080/schedule`

// domainame http request url
export const MISSION = `https://api.dev-kits.store/mission`
export const LOGIN = `https://api.dev-kits.store/login`
export const JOIN = `https://api.dev-kits.store/sign-up`
export const STATION = `https://api.dev-kits.store/station`
export const SCHEDULE = `https://api.dev-kits.store/schedule`

export interface AxiosError {
    response?: {
        status: number
        data: unknown
    }
}
