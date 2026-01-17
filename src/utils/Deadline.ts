interface PartialDeadline {
    courseFaculty: string; 
    courseNumber:  number; 
    name?:         string;
    start?:          Date;
    end?:            Date;
}

const WEEK_IN_MS: number = 7 * 24 * 60 * 60 * 1000;

export type Deadline = Required<PartialDeadline>;
export const create = (args: PartialDeadline): Deadline => {
    const now = new Date();
    return {
        start: now,
        end:   new Date(now.getDate() + WEEK_IN_MS),
        name:  "No name specifed.",
        ...args
    };
};
