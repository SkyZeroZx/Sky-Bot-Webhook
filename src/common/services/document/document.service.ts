import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Document } from '@common/interface';

@Injectable()
export class DocumentService {
  constructor(private readonly httpService: HttpService) {}

  async getDocumentByName(name: string): Promise<Document> {
    const { data } = await this.httpService.axiosRef.get<Document>(`/document/${name}`);
    return data;
  }
}
