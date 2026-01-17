export interface Course {
    faculty: string,
    num:     number
}

export const createCourse = 
    (faculty: string, num: number): Course => {
    return {
        faculty,
        num
    }
};

