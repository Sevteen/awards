import moment from 'moment';

export function addCurrentTimeWithNumericTime(numericTime: number): Date {
  return moment().add(numericTime).toDate();
}

export function compareDates(date1, date2) {
  const momentDate1 = moment(date1);
  const momentDate2 = moment(date2);

  if (momentDate1.isBefore(momentDate2)) {
    return -1;
  } else if (momentDate1.isAfter(momentDate2)) {
    return 1;
  }

  return 0;
}
