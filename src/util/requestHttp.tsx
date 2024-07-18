import axios from 'axios'
import { MISSION, SCHEDULE, STATION } from '../constant/http'
import { MissionDto } from '../dto/MissionDto'

export const getSchedule = async () => {
    try {
        const response = await axios.get(SCHEDULE, {
            withCredentials: true,
        })
        console.log('getSchedule', response.data)
        return response.data
    } catch (error) {
        console.log(error)
    }
}

export const getStations = async () => {
    try {
        const response = await axios.get(STATION, { withCredentials: true })

        if (response.status === 200) {
            console.log('getStations', response.data)
            return response.data
        } else {
            console.log('스테이션 호출 실패')
        }
    } catch (error) {
        console.log(error)
    }
}

export const getMissions = async () => {
    try {
        const response = await axios.get(MISSION, { withCredentials: true })
        return response.data
    } catch (err) {
        console.log(err)
    }
}

export const updeateMission = async (infoMission: MissionDto) => {
    try {
        const { seq } = infoMission
        const response = await axios.put(`${MISSION}/${seq}`, infoMission, {
            withCredentials: true,
        })

        return response.data
    } catch (err) {
        console.log(err)
    }
}

export const getWeather = async () => {
    try {
        // const response = await axios.get(
        //     `api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${import.meta.env.VITE_OPEN_WEATHER_MAP_APIKEY}`
        // )
        const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/forecast?lat=35.8774&lon=128.6107&appid=${import.meta.env.VITE_OPEN_WEATHER_MAP_APIKEY}`,
            {
                withCredentials: true,
            }
        )
        const data = await response.data
        console.log(data)
    } catch (error) {
        console.log(error)
    }
}