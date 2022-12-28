import { Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { GlobalHttpModule } from '@core/config';
 

@Module({
  imports: [GlobalHttpModule],
  providers: [StudentService],
  exports: [StudentService],
})
export class StudentModule {}
