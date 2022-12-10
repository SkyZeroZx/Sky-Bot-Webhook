export interface StatusDocument {
  idStatusDocument: string;
  idStudent: string;
  idDocument: string;
}

export interface Status {
  idStatus: number;
  registerDate: string;
  idStatusDocument: string;
  status: string;
  observations: string;
}

