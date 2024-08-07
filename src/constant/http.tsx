export const MISSION = `https://api.dev-kits.store/mission`
export const LOGIN = `https://api.dev-kits.store/login`
export const JOIN = `https://api.dev-kits.store/sign-up`
export const STATION = `https://api.dev-kits.store/station`
export const SCHEDULE = `https://api.dev-kits.store/schedule`
export const RUNNING_STATION = `https://api.dev-kits.store/station/running`
export const BASE_URL = `https://api.dev-kits.store`

export interface AxiosError {
    response?: {
        status: number
        data: unknown
    }
}
