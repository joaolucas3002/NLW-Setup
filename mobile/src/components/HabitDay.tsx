import clsx from 'clsx';
import dayjs from 'dayjs';
import {
   TouchableOpacity,
   TouchableOpacityProps,
   Dimensions,
} from 'react-native';
import { generateProgressPercentage } from '../utils/generate-progress-percentage';

const WEEK_DAYS = 7;
const SCRENN_HORIZONT_PADDING = (32 * 2) / 5;
const DIMENSIONS_WIDTH_SCREEN = Dimensions.get('screen').width / WEEK_DAYS;

export const DAY_MARGIN_BEYWATCH = 8;

export const DAY_SIZE = DIMENSIONS_WIDTH_SCREEN - (SCRENN_HORIZONT_PADDING + 5);

interface HabitDayProps extends TouchableOpacityProps {
   amount?: number;
   completed?: number;
   date: Date;
}

export function HabitDay({
   completed = 0,
   amount = 0,
   date,
   ...rest
}: HabitDayProps) {
   const amountAccomplishedPercentage =
      amount > 0 ? generateProgressPercentage(amount, completed) : 0;
   const today = dayjs().startOf('day').toDate();
   const isCurrentDay = dayjs(date).isSame(today);

   const StyleRelativeToCompletedHabits = {
      'bg-zinc-900 border-zinc-800': amountAccomplishedPercentage === 0,
      'bg-violet-900 border-violet-700':
         amountAccomplishedPercentage > 0 && amountAccomplishedPercentage < 20,
      'bg-violet-800 border-violet-600':
         amountAccomplishedPercentage >= 20 &&
         amountAccomplishedPercentage < 40,
      'bg-violet-700 border-violet-500':
         amountAccomplishedPercentage >= 40 &&
         amountAccomplishedPercentage < 60,
      'bg-violet-600 border-violet-500':
         amountAccomplishedPercentage >= 60 &&
         amountAccomplishedPercentage < 80,
      'bg-violet-500 border-violet-400': amountAccomplishedPercentage >= 80,
      'border-white border-3': isCurrentDay,
   };

   return (
      <TouchableOpacity
         className={clsx(
            'rounded-lg  border-2  m-1',
            StyleRelativeToCompletedHabits,
         )}
         style={{ width: DAY_SIZE, height: DAY_SIZE }}
         activeOpacity={0.7}
         {...rest}
      />
   );
}
