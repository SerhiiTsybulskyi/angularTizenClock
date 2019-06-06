declare var tizen: any;

export class DateUtils {

  public static getDate(isTizen): Date {
    return isTizen ? tizen.time.getCurrentDateTime() : new Date();
  }
}
