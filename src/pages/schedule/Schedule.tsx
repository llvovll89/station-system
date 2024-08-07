import { useState } from "react";
import { StationDto } from "../../dto/Station";
import { ScheduleList } from "./list/ScheduleList";
import { NewSchdule } from "./NewSchedule";

interface ScheduleProps {
    toggleSchedule: () => void;
    stations: StationDto[];
    setIsActive: React.Dispatch<React.SetStateAction<string>>;
    isRunningSchedule: boolean;
}

export const Schedule = ({
    toggleSchedule,
    stations,
    setIsActive,
    isRunningSchedule,
}: ScheduleProps) => {
    const [isCreateSchedule, setIsCreateSchedule] = useState(false);
    const [isHttpRequest, setIsHttpRequest] = useState(false);

    const toggleCreateSchedule = () => {
        setIsCreateSchedule((prev) => !prev);
    };

    return (
        <section>
            <ScheduleList
                toggleSchedule={toggleSchedule}
                toggleCreateSchedule={toggleCreateSchedule}
                setIsActive={setIsActive}
                isHttpRequest={isHttpRequest}
                setIsHttpRequest={setIsHttpRequest}
                isRunningSchedule={isRunningSchedule}
            />

            {isCreateSchedule && (
                <NewSchdule
                    toggleCreateSchedule={toggleCreateSchedule}
                    stations={stations}
                    setIsHttpRequest={setIsHttpRequest}
                />
            )}
        </section>
    );
};
