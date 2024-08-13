import { IoClose, IoCreateOutline } from "react-icons/io5";
import { ScheduleListWrap } from "./ScheduleListSyle";
import { Button } from "../../../components/button/Button";
import axios from "axios";
import { SCHEDULE } from "../../../constant/http";
import { useEffect, useState } from "react";
import { SchduleDto } from "../../../dto/ScheduleDto";
import { getSchedule } from "../../../util/requestHttp";
import DeleteIcon from "../../../assets/image/icon/ico_trash(w).png";
import DeleteWhiteIcon from "../../../assets/image/icon/ico_trash.png";
import UpdateIcon from "../../../assets/image/icon/ico_edit(w).png";
import UpdateWhiteIcon from "../../../assets/image/icon/ico_edit02.png";
import { Schedule } from "../../../constant/type";

interface ScheduleListProps {
    toggleSchedule: () => void;
    toggleCreateSchedule: () => void;
    setIsActive: React.Dispatch<React.SetStateAction<string>>;
    isHttpRequest: boolean;
    setIsHttpRequest: React.Dispatch<React.SetStateAction<boolean>>;
    isRunningSchedule: boolean;
}

export const ScheduleList = ({
    toggleSchedule,
    toggleCreateSchedule,
    setIsActive,
    isHttpRequest,
    setIsHttpRequest,
    isRunningSchedule,
}: ScheduleListProps) => {
    const [schedules, setSchedules] = useState<SchduleDto[]>([]);
    const [selectSchedule, setSelectSchedule] = useState<SchduleDto | null>(
        null,
    );

    const toggleActiveSchedule = () => {
        toggleSchedule();
        setIsActive("");
    };

    const updateSchedule = async (
        schedule: SchduleDto,
        e: React.MouseEvent,
    ) => {
        e.stopPropagation();

        try {
            const response = await axios.post(`${SCHEDULE}/${schedule.seq}`);
            const data = await response.data;

            console.log(data);
            setIsHttpRequest((prev) => !prev);
        } catch (error) {
            console.log(error);
        }
    };

    const deleteSchdule = async (schedule: SchduleDto) => {
        const requestDelete = confirm("정말 삭제 하시겠습니까?");
        if (requestDelete) {
            {
                try {
                    const response = await axios.delete(
                        `${SCHEDULE}/${schedule.seq}`,
                    );
                    const data = await response.data;

                    console.log(data);
                    setIsHttpRequest((prev) => !prev);
                } catch (error) {
                    console.log(error);
                }
            }
        } else {
            return;
        }
    };

    const selectScheduleItem = (schedule: SchduleDto) => {
        if (selectSchedule) {
            setSelectSchedule(null);
        }

        console.log(schedule);
        setSelectSchedule(schedule);
    };

    useEffect(() => {
        const fetchSchedules = async () => {
            const data: Schedule[] = await getSchedule();
            const sortedData = data.sort(
                (a, b) =>
                    new Date(b.startedAt).getTime() -
                    new Date(a.startedAt).getTime(),
            );

            setSchedules(sortedData);
        };

        fetchSchedules();
    }, [isHttpRequest, isRunningSchedule]);

    return (
        <ScheduleListWrap>
            <header>
                <h1>스케줄</h1>

                <div className="content_btn">
                    <Button type={"button"} onClick={toggleCreateSchedule}>
                        <IoCreateOutline
                            style={{ width: "24PX", height: "24px" }}
                        />
                    </Button>
                    <Button type={"button"} onClick={toggleActiveSchedule}>
                        <IoClose style={{ width: "24PX", height: "24px" }} />
                    </Button>
                </div>
            </header>

            <article className="container">
                <ul className="schedule_list">
                    {schedules.length > 0 &&
                        schedules.map((schedule) => (
                            <li
                                className={`schedule ${selectSchedule?.seq === schedule.seq ? "active" : ""}`}
                                key={schedule.seq}
                                onClick={() => selectScheduleItem(schedule)}
                            >
                                <div className="content_header">
                                    <span className="title">
                                        {schedule.name}
                                    </span>
                                    <div className="btn_box">
                                        <button
                                            onClick={(e) =>
                                                updateSchedule(schedule, e)
                                            }
                                        >
                                            {selectSchedule?.seq ===
                                            schedule.seq ? (
                                                <img
                                                    src={UpdateWhiteIcon}
                                                    alt="update"
                                                    style={{
                                                        width: "16px",
                                                        height: "16px",
                                                    }}
                                                />
                                            ) : (
                                                <img
                                                    src={UpdateIcon}
                                                    alt="update"
                                                    style={{
                                                        width: "16px",
                                                        height: "16px",
                                                    }}
                                                />
                                            )}
                                        </button>
                                        <button
                                            onClick={() =>
                                                deleteSchdule(schedule)
                                            }
                                        >
                                            {selectSchedule?.seq ===
                                            schedule.seq ? (
                                                <img
                                                    src={DeleteWhiteIcon}
                                                    alt="delete"
                                                    style={{
                                                        width: "20px",
                                                        height: "20px",
                                                    }}
                                                />
                                            ) : (
                                                <img
                                                    src={DeleteIcon}
                                                    alt="delete"
                                                    style={{
                                                        width: "20px",
                                                        height: "20px",
                                                    }}
                                                />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div className="scheudule_content">
                                    <span
                                        className={
                                            schedule.status === 0
                                                ? "running"
                                                : ""
                                        }
                                    >
                                        상태:{" "}
                                        {schedule.status === 0
                                            ? "진행중"
                                            : schedule.status === 1
                                              ? "failed"
                                              : "비행완료"}
                                    </span>
                                    <span>
                                        스테이션: {schedule.station.name}
                                    </span>
                                </div>

                                <div className="schedule_date">
                                    <span className="gray">createdAt:</span>
                                    <span>
                                        {schedule.startedAt.split("T")[0] +
                                            " " +
                                            schedule.startedAt
                                                .split("T")[1]
                                                .slice(0, 5)}
                                    </span>
                                </div>
                            </li>
                        ))}
                </ul>
            </article>
        </ScheduleListWrap>
    );
};
