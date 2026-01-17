interface PartialDeadline {
    courseFaculty: string; 
    courseNumber:  number; 
    start?:          Date;
    end?:            Date;
}

export type Deadline = Required<PartialDeadline>;
export const create = (args: PartialDeadline): Deadline => {
    const now = new Date();
    return {
        start: now,
        end:   new Date(now.getDate() + (7 * 24 * 60 * 60 * 1000)),
        ...args
    };
};
