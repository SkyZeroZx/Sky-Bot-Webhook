import { formatInTimeZone } from 'date-fns-tz';

export class Util {
  static isDocumentaryProcedureIntent(intentName: string): boolean {
    return intentName.includes('documentary_procedure');
  }

  static formatLocalDate(date: Date | string): string {
    return formatInTimeZone(date, process.env.TZ, 'yyyy-MM-dd HH:mm');
  }
}
