import { formatInTimeZone } from 'date-fns-tz';

export function isDocumentaryProcedureIntent(intentName: string): boolean {
  return intentName.includes('documentary_procedure');
}

export function formatLocalDate(date: Date | string): string {
  return formatInTimeZone(date, process.env.TZ, 'yyyy-MM-dd HH:mm');
}
