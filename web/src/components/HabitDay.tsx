import * as Popover from '@radix-ui/react-popover';
import clsx from 'clsx';
import ProgressBar from './ProgressBar';
import dayjs from 'dayjs';
import { HabitList } from './HabitList';
import { useState } from 'react';

interface HabitDayProps {
   date: Date;
   defaultcompleted?: number;
   amount?: number;
}

export default function HabitDay({
   date,
   defaultcompleted = 0,
   amount = 0,
}: HabitDayProps) {
   const [completed, setCompleted] = useState<number>(defaultcompleted);

   const completedPercentage =
      amount > 0 ? Math.round((completed / amount) * 100) : 0;

   const today = dayjs().startOf('day').toDate();
   const isCurrentDay = dayjs(date).isSame(today);

   const dayAndMonth = dayjs(date).format('DD/MM');
   const dayOfWeek = dayjs(date).format('dddd');

   const StyleRelativeToCompletedHabits = {
      'bg-zinc-900 border-zinc-800': completedPercentage === 0,
      'bg-violet-900 border-violet-700':
         completedPercentage > 0 && completedPercentage <= 20,
      'bg-violet-800 border-violet-600':
         completedPercentage >= 20 && completedPercentage <= 40,
      'bg-violet-700 border-violet-500':
         completedPercentage >= 40 && completedPercentage <= 60,
      'bg-violet-600 border-violet-500':
         completedPercentage >= 60 && completedPercentage <= 80,
      'bg-violet-500 border-violet-400': completedPercentage >= 80,
      'border-white border-4': isCurrentDay,
   };

   function handleCompletedChanged(completed: number) {
      setCompleted(completed);
   }

   return (
      <Popover.Root>
         <Popover.Trigger
            className={clsx(
               'h-10 w-10 border-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-violet-700 focus:ring-offset-2 focus:ring-offset-background',
               StyleRelativeToCompletedHabits,
            )}
         />

         <Popover.Portal>
            <Popover.Content className="min-w-[20rem] w-full bg-zinc-900 p-3 rounded-lg flex flex-col ">
               <h4 className="font-semibold text-zinc-400">{dayOfWeek}</h4>
               <h3 className="mt-1 font-semibold text-3xl leading-tight ">
                  {dayAndMonth}
               </h3>

               <ProgressBar progress={completedPercentage} />

               <HabitList
                  date={date}
                  onConpletedChanged={handleCompletedChanged}
               />

               <Popover.Arrow
                  height={8}
                  width={16}
                  className=" fill-zinc-900"
               />
            </Popover.Content>
         </Popover.Portal>
      </Popover.Root>
   );
}
