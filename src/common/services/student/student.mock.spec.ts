import { Student } from '../../interface';

export class StudentServiceMock {
  public static readonly student: Student = {
    idStudent: '1',
    name: 'Mock Name',
    lastName: 'Mock lastName',
    phone: '123456789',
    caracterValidation: '1',
    dni: '888888888',
    email: 'mock@example.com',
  };

  public static readonly studentMatchCaracterValidation: Student = {
    idStudent: '1',
    name: 'Mock Name',
    lastName: 'Mock lastName',
    phone: '123456789',
    caracterValidation: '7',
    dni: '888888888',
    email: 'mock@example.com',
  };

}
