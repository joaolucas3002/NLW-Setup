import * as CheckBox from '@radix-ui/react-checkbox';
import dayjs from 'dayjs';
import { Check } from 'phosphor-react';
import { useEffect, useState } from 'react';
import { api } from '../lib/axios';

interface HabitListProps {
   date: Date;
   onConpletedChanged: (completed: number) => void;
}

interface HabitInfoProps {
   possibleHabits: {
      id: string;
      title: string;
      created_at: string;
   }[];
   completedHabits: string[];
}

export function HabitList({ date, onConpletedChanged }: HabitListProps) {
   const [habitInfo, setHabitInfo] = useState<HabitInfoProps>();

   useEffect(() => {
      api.get('day', { params: { date: date.toISOString() } }).then(
         (response) => setHabitInfo(response.data),
      );
   }, []);

   async function handleToogleHabit(habitId: string) {
      await api.patch(`/habits/${habitId}/toggle`);

      const isHabitAlreadyCompleted =
         habitInfo!.completedHabits.includes(habitId);

      let completedHabits: string[] = [];

      if (isHabitAlreadyCompleted) {
         completedHabits = habitInfo!.completedHabits.filter(
            (id) => id !== habitId,
         );
      } else {
         completedHabits = [...habitInfo!.completedHabits, habitId];
      }

      setHabitInfo({
         possibleHabits: habitInfo!.possibleHabits,
         completedHabits,
      });

      onConpletedChanged(completedHabits.length);
   }

   const isDateInPast = dayjs(date).endOf('day').isBefore(new Date());

   return (
      <div className="mt-6 flex flex-col gap-3">
         {habitInfo?.possibleHabits.map((habit) => (
            <CheckBox.Root
               key={habit.id}
               onCheckedChange={() => handleToogleHabit(habit.id)}
               checked={habitInfo.completedHabits.includes(habit.id)}
               disabled={isDateInPast}
               className="flex items-center gap-3 group focus:outline-none disabled:cursor-not-allowed"
            >
               <div className="h-8 w-8 bg-zinc-900 border-2 border-zinc-800 flex items-center justify-center rounded-lg  group-data-[state=checked]:bg-green-600 group-data-[state=checked]:border-0 group-data-[state=checked]:hover:bg-green-500 transition-colors   group-focus:outline-none group-focus:ring-2 group-focus:ring-violet-700 group-focus:ring-offset-2 group-focus:ring-offset-background">
                  <CheckBox.Indicator>
                     <Check size={20} className="text-white" />
                  </CheckBox.Indicator>
               </div>

               <span className="font-semibold text-xl text-white leading-tight group-data-[state=checked]:line-through group-data-[state=checked]:text-zinc-400">
                  {habit.title}
               </span>
            </CheckBox.Root>
         ))}
      </div>
   );
}
