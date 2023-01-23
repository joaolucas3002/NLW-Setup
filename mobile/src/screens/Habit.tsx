import { useEffect, useState } from 'react';
import { useRoute } from '@react-navigation/native';
import { View, Text, ScrollView, Alert } from 'react-native';
import dayjs from 'dayjs';
import clsx from 'clsx';

import { BackButton } from '../components/BackButton';
import ProgressBar from '../components/ProgressBar';
import { Checkbox } from '../components/Checkbox';
import { Loading } from '../components/Loading';
import { api } from '../lib/axios';
import { generateProgressPercentage } from '../utils/generate-progress-percentage';
import HabitsEmpty from '../components/HabitsEmpty';

interface HabitProps {
   date: string;
}

interface DayInfoProps {
   possibleHabits: {
      id: string;
      title: string;
      created_at: string;
   }[];
   completedHabits: string[];
}

export function Habit() {
   const [loading, setLoading] = useState(true);
   const [dayInfo, setDayInfo] = useState<DayInfoProps | null>(null);
   const [completedHabits, setCompletedHabits] = useState<string[]>([]);

   const route = useRoute();
   const { date } = route.params as HabitProps;

   async function ToogleHabit(
      Habits: string[],
      habitId: string,
      setHabits: Function,
   ) {
      try {
         await api.patch(`/habits/${habitId}/toggle`);

         Habits.includes(habitId)
            ? setHabits((prevState: string[]) =>
                 prevState.filter((habit: string) => habit !== habitId),
              )
            : setHabits((prevState: string[]) => [...prevState, habitId]);
      } catch (error) {
         console.log(error);
      }
   }

   const parsedDate = dayjs(date);
   const IsDateInPast = parsedDate.endOf('day').isBefore(new Date());
   const dayOfWeek = parsedDate.format('dddd');
   const dayAndMonth = parsedDate.format('DD/MM');

   const progress = dayInfo?.possibleHabits.length
      ? generateProgressPercentage(
           dayInfo.possibleHabits.length,
           completedHabits.length,
        )
      : 0;

   async function fetchHabits() {
      try {
         setLoading(true);

         const reponse = await api.get('/day', {
            params: {
               date,
            },
         });
         setDayInfo(reponse.data);
         setCompletedHabits(reponse.data.completedHabits);
      } catch (error) {
         console.log(error);
         Alert.alert(
            'Ops',
            'Não foi possível carregar as informações dos hábitos.',
         );
      } finally {
         setLoading(false);
      }
   }

   useEffect(() => {
      fetchHabits();
   }, []);

   if (loading) {
      return <Loading />;
   }

   return (
      <View className="flex-1 bg-background px-8 pt-16">
         <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 80 }}
         >
            <BackButton />

            <Text className="mt-6 text-zinc-400 font-semibold text-base lowercase">
               {dayOfWeek}
            </Text>

            <Text className="text-white font-extrabold text-3xl">
               {dayAndMonth}
            </Text>

            <ProgressBar progress={progress} />

            <View
               className={clsx('mt-6', {
                  ['opacity-50']: IsDateInPast,
               })}
            >
               {dayInfo?.possibleHabits ? (
                  dayInfo?.possibleHabits.map(({ title, id }) => (
                     <Checkbox
                        key={id}
                        title={title}
                        checked={completedHabits.includes(id)}
                        disabled={IsDateInPast}
                        onPress={() => {
                           ToogleHabit(completedHabits, id, setCompletedHabits);
                        }}
                     />
                  ))
               ) : (
                  <HabitsEmpty />
               )}
            </View>

            {IsDateInPast && (
               <Text className="text-white mt-10 text-center">
                  Você não pode editar Hábitos de uma data passada.
               </Text>
            )}
         </ScrollView>
      </View>
   );
}
