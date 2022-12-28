import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { CommomMock } from '../../mocks/common.mock.spec';
import { StudentServiceMock } from './student.mock.spec';
import { StudentService } from './student.service';

describe('StudentService', () => {
  let studentService: StudentService;
  let httpService: HttpService;
  const mockService = new CommomMock();
  const idStudent = '7896541235652';
  const dni = '8899665522';
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudentService,
        {
          provide: HttpService,
          useValue: mockService,
        },
      ],
    }).compile();

    studentService = module.get<StudentService>(StudentService);
    httpService = module.get<HttpService>(HttpService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(studentService).toBeDefined();
  });

  it('getStudentById should be return Student', async () => {
    const spyAxiosRefGet = jest.spyOn(httpService, 'get').mockImplementationOnce((): any => {
      return {
        data: StudentServiceMock.student,
      };
    });
    const student = await studentService.getStudentById(idStudent);
    expect(spyAxiosRefGet).toBeCalledWith(`/student/searchByIdStudent/?idStudent=${idStudent}`);
    expect(student).toEqual(StudentServiceMock.student);
  });

  it('getStudentByIdAndDni should be return Student', async () => {
    const spyAxiosRefGet = jest.spyOn(httpService, 'get').mockImplementationOnce((): any => {
      return {
        data: StudentServiceMock.student,
      };
    });
    const student = await studentService.getStudentByIdAndDni(idStudent, dni);
    expect(spyAxiosRefGet).toBeCalledWith(
      `/student/searchByIdStudentAndDni?idStudent=${idStudent}&dni=${dni}`,
    );
    expect(student).toEqual(StudentServiceMock.student);
  });
});
