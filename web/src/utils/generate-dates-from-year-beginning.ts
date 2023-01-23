import dayjs from 'dayjs';

export default function generateDatesFromYearBeginning() {
    const fristDayOfTheYear = dayjs().startOf('year');
    const today = new Date();

    const dates = [];

    let comparDate = fristDayOfTheYear;

    while (comparDate.isBefore(today)) {
        dates.push(comparDate.toDate());
        comparDate = comparDate.add(1, 'day');
    }

    return dates;
}
