// ip http request url
// export const MISSION = `http://13.124.113.180:8080/mission`
// export const LOGIN = `http://13.124.113.180:8080/login`
// export const JOIN = `http://13.124.113.180:8080/sign-up`
// export const STATION = `http://13.124.113.180:8080/station`
// export const SCHEDULE = `http://13.124.113.180:8080/schedule`

// domainame http request url
export const MISSION = `http://station-simulator.dev-kits.store:8080/mission`
export const LOGIN = `http://station-simulator.dev-kits.store:8080/login`
export const JOIN = `http://station-simulator.dev-kits.store:8080/sign-up`
export const STATION = `http://station-simulator.dev-kits.store:8080/station`
export const SCHEDULE = `http://station-simulator.dev-kits.store:8080/schedule`

export interface AxiosError {
    response?: {
        status: number
        data: unknown
    }
}
