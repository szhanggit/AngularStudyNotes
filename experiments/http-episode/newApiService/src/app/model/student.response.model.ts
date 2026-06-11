import { Student } from './student.model';

export interface GetStudentsResp {
    data: {
        studentDtos: Student[];
        totalCount: number;
    }
    message: string;
    success: boolean;
}
