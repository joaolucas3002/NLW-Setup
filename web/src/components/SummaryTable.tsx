import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { api } from '../lib/axios';
import generateDatesFromYearBeginning from '../utils/generate-dates-from-year-beginning';
import HabitDay from './HabitDay';

const WeekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

const summaryDates = generateDatesFromYearBeginning();

const minimumSumaryDatesSize = 18 * 7;

const amountOfDaysToFill = minimumSumaryDatesSize - summaryDates.length;

type Summary = {
   id: string;
   date: string;
   amount: number;
   completed: number;
}[];

export default function SummaryTable() {
   const [summary, setSummary] = useState<Summary>([]);

   useEffect(() => {
      api.get('summary').then((response) => {
         setSummary(response.data);         
      });
   }, []);

   return (
      <main className="w-full flex ">
         <div className="grid grid-rows-7 grid-flow-col gap-2">
            {WeekDays.map((WeekDay, index) => (
               <div
                  key={`${WeekDay}-${index}`}
                  className="text-zinc-400 text-xl font-bold h-10 w-10 flex items-center justify-center"
               >
                  {WeekDay}
               </div>
            ))}
         </div>
         <div className="grid grid-rows-7 grid-flow-col gap-2">
            {summary.length > 0 && summaryDates.map((date) => {
               const dayInSummary = summary.find((day) =>
                  dayjs(date).isSame(day.date, 'day'),
               );

               return (
                  <HabitDay
                     key={date.toString()}
                     date={date}
                     amount={dayInSummary?.amount}
                     defaultcompleted={dayInSummary?.completed}
                  />
               );
            })}

            {amountOfDaysToFill > 0 &&
               Array.from({
                  length: amountOfDaysToFill,
               }).map((_, i) => (
                  <div
                     key={`id-${i}`}
                     className="h-10 w-10 bg-zinc-900 border-2 border-zinc-800 rounded-lg  opacity-40 cursor-not-allowed"
                  />
               ))}
         </div>
      </main>
   );
}
