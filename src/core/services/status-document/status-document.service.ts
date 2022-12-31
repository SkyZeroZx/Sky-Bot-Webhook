import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Response, Status } from '@core/interface';
import { CreateStatusDocumentDto } from './dto/create-status-document.dto';
import { formatLocalDate } from '@core/utils';

@Injectable()
export class StatusDocumentService {
  constructor(private readonly httpService: HttpService) {}

  async registerStatusDocument(createStatusDocument: CreateStatusDocumentDto): Promise<Response> {
    const { data } = await this.httpService.axiosRef.post<Response>(
      '/status-document',
      createStatusDocument,
    );
    return data;
  }

  async getStatusDocument(idStatusDocument: string): Promise<string> {
    const { data } = await this.httpService.axiosRef.get<Status[]>(`/status/${idStatusDocument}`);
    const listStatus = data
      .map(
        ({ status, observations, registerDate }) =>
          formatLocalDate(registerDate) +
          '\n\nStatus\n' +
          status +
          '\n\nObservations\n' +
          observations,
      )
      .join('\n');
    return listStatus;
  }
}
