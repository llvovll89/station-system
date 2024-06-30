export const MISSION = `http://13.124.113.180:8080/mission`
export const LOGIN = `http://13.124.113.180:8080/login`
export const JOIN = `http://13.124.113.180:8080/sign-up`
export const STATION = `http://13.124.113.180:8080/station`
export const SCHEDULE = `http://13.124.113.180:8080/schedule`

export interface AxiosError {
    response?: {
        status: number
        data: unknown
    }
}
