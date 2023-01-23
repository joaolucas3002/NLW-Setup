import * as CheckBox from '@radix-ui/react-checkbox';
import { Check } from 'phosphor-react';
import { FormEvent, useState } from 'react';
import { api } from '../lib/axios';

const availableWeekDays = [
   'Domingo',
   'Segunda-feira',
   'Terça-feira',
   'Quarta-feira',
   'Quinta-feira',
   'Sexta-feira',
   'Sabado',
];

export function NewHabitForm() {
   const [title, setTitle] = useState('');
   const [weekDays, setWeekDays] = useState<number[]>([]);

   async function createNewHabit(event: FormEvent) {
      event.preventDefault();

      if (!title || weekDays.length === 0) {
         return;
      }

      await api.post('habits', {
         title,
         weekDays,
      });

      setTitle('');
      setWeekDays([])

      alert('Habito criado!');
   }

   function handleToogleWeekDay(
      weekDays: number[],
      index: number,
      setWeekDays: Function,
   ) {
      weekDays.includes(index)
         ? setWeekDays(weekDays.filter((weekDay: number) => weekDay !== index))
         : setWeekDays([index, ...weekDays]);
   }

   return (
      <form onSubmit={createNewHabit} className="w-full flex flex-col mt-6">
         <label htmlFor="title" className="font-semibold leading-tight">
            Qual seu comprometimento?
         </label>

         <input
            type="text"
            name=""
            id="title"
            placeholder="ex.: Exerícios, dormir bem, etc..."
            className="p-4 rounded-lg mt-3 bg-zinc-800 text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-700 focus:ring-offset-2 focus:ring-offset-zinc-900"
            autoFocus
            value={title}
            onChange={(event) => setTitle(event.target.value)}
         />

         <label htmlFor="" className="font-semibold leading-tight mt-4">
            Qual a recorrência?
         </label>

         <div className="mt-6 flex flex-col gap-2">
            {availableWeekDays.map((WeekDay, index) => (
               <CheckBox.Root
                  key={WeekDay}
                  className="flex items-center gap-2 group focus:outline-none"
                  checked={weekDays.includes(index)}
                  onCheckedChange={() =>
                     handleToogleWeekDay(weekDays, index, setWeekDays)
                  }
               >
                  <div className="h-8 w-8 bg-zinc-900 border-2 border-zinc-800 flex items-center justify-center rounded-lg  group-data-[state=checked]:bg-green-600 group-data-[state=checked]:border-0 group-data-[state=checked]:hover:bg-green-500 transition-colors group-focus:outline-none group-focus:ring-2 group-focus:ring-violet-700 group-focus:ring-offset-2 group-focus:ring-offset-zinc-900">
                     <CheckBox.Indicator>
                        <Check size={20} className="text-white" />
                     </CheckBox.Indicator>
                  </div>

                  <span className=" text-white leading-tight">{WeekDay}</span>
               </CheckBox.Root>
            ))}
         </div>

         <button className="mt-6 rounded-lg p-4 flex items-center justify-center gap-3 font-semibold bg-green-600  hover:bg-green-500 transition-colors  focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-zinc-900">
            <Check size={20} weight="bold" />
            Confirmar
         </button>
      </form>
   );
}
