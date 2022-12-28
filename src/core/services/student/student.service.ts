import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Student } from '@core/interface';

@Injectable()
export class StudentService {
  constructor(private readonly httpService: HttpService) {}

  async getStudentById(idStudent: string): Promise<Student> {
    const { data } = await this.httpService.axiosRef.get<Student>(
      `/student/searchByIdStudent/?idStudent=${idStudent}`,
    );
    return data;
  }

  async getStudentByIdAndDni(idStudent: string, dni: string | number) {
    const { data } = await this.httpService.axiosRef.get<Student>(
      `/student/searchByIdStudentAndDni?idStudent=${idStudent}&dni=${dni}`,
    );
    return data;
  }
}
