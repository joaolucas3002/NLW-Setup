import { Text, View, ScrollView, Alert } from 'react-native';
import { useEffect, useState , useCallback } from 'react';
import { useNavigation, useFocusEffect  } from '@react-navigation/native';

import { api } from '../lib/axios';
import { generateRangeDatesFromYearStart } from '../utils/generate-range-between-dates';

import { HabitDay, DAY_SIZE } from '../components/HabitDay';
import { Header } from '../components/Header';
import { Loading } from '../components/Loading';
import dayjs from 'dayjs';

const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
const datesFromYearStart = generateRangeDatesFromYearStart();
const minimumSummaryDatesSizes = 7 * 13;
const amountOfDaysToFill = minimumSummaryDatesSizes - datesFromYearStart.length;

interface SummaryProps {
   id: string;
   date: string;
   amount: number;
   completed: number;
}

export function Home() {
   const [loading, setLoading] = useState(true);
   const [summary, setSummary] = useState<SummaryProps[] | null>(null);

   const { navigate } = useNavigation();

   async function fetchData() {
      try {
         setLoading(true);

         const response = await api.get('/summary');

         setSummary(response.data);
      } catch (error) {
         Alert.alert('Ops', 'Não foi possível carregar o sumário de hábitos.');
         console.log(error);
      } finally {
         setLoading(false);
      }
   }

   useFocusEffect(useCallback(() => {
      fetchData();
   }, []))

   useEffect(() => {
      console.log(summary);
   }, [summary]);

   return !loading ? (
      <View className="flex-1 bg-background px-8 pt-16">
         <Header />

         <View className="flex flex-row mt-6 mb-2">
            {weekDays.map((weekDay, i) => (
               <Text
                  key={`${weekDay}-${i}`}
                  className="text-zinc-400 text-xl font-bold text-center mx-1"
                  style={{ width: DAY_SIZE }}
               >
                  {weekDay}
               </Text>
            ))}
         </View>
         <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 80 }}
         >
            {summary && (
               <View className="flex-row flex-wrap">
                  {datesFromYearStart.map((date) => {
                     const dayWithHabits = summary.find((day) =>
                        dayjs(date).isSame(day.date, 'day'),
                     );

                     return (
                        <HabitDay
                           key={date.toISOString()}
                           date={date}
                           amount={dayWithHabits?.amount}
                           completed={dayWithHabits?.completed}
                           onPress={() =>
                              navigate('habit', { date: date.toISOString() })
                           }
                        />
                     );
                  })}

                  {amountOfDaysToFill > 0 &&
                     Array.from({ length: amountOfDaysToFill }).map(
                        (_, index) => (
                           <View
                              key={`id-${index}`}
                              className="rounded-lg bg-zinc-900 border-2 border-zinc-800 m-1 opacity-40"
                              style={{
                                 width: DAY_SIZE,
                                 height: DAY_SIZE,
                              }}
                           />
                        ),
                     )}
               </View>
            )}
         </ScrollView>
      </View>
   ) : (
      <Loading />
   );
}
