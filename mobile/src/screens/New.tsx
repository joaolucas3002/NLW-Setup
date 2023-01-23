import { useState } from 'react';
import {
   View,
   ScrollView,
   Text,
   TextInput,
   TouchableOpacity,
   Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { BackButton } from '../components/BackButton';
import { Checkbox } from '../components/Checkbox';
import colors from 'tailwindcss/colors';
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

export function New() {
   const [weekDays, setWeekDays] = useState<number[]>([]);
   const [title, setTitle] = useState<string>('');

   function handleToogleWeekDay(
      weekDays: number[],
      WeekDayIndex: number,
      setWeekDays: Function,
   ) {
      weekDays.includes(WeekDayIndex)
         ? setWeekDays((prevState: number[]) =>
              prevState.filter((weekday: number) => weekday !== WeekDayIndex),
           )
         : setWeekDays((prevState: number[]) => [...prevState, WeekDayIndex]);
   }

   async function handleCreateNewHabit() {
      try {
         if (!title.trim() || weekDays.length === 0) {
            return Alert.alert(
               'Novo Hábito',
               'Informe o nome do habíto e escolha a periodicidade.',
            );
         }
         await api.post('/habits', { title, weekDays });
         setTitle('');
         setWeekDays([]);
         Alert.alert('Novo Hábito', 'Hábito criado com sucesso!');
      } catch (error) {
         console.log(error);
         Alert.alert('Ops', 'Não foi possível criar o novo hábito.');
      }
   }

   return (
      <View className="flex-1 bg-background px-8 pt-16">
         <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
         >
            <BackButton />

            <Text className="mt-6 text-white font-extrabold text-3xl">
               Criar hábito
            </Text>

            <Text className="mt-6 text-white font-semibold text-base">
               Qual seu comprometimento?{' '}
            </Text>

            <TextInput
               className="h-12 pl-4 rounded-lg mt-3 bg-zinc-900 text-white border-2 border-zinc-800 focus:border-green-600 "
               placeholder="Exercícios, dormir bem, etc..."
               placeholderTextColor={colors.zinc[400]}
               onChangeText={setTitle}
               value={title}
            />

            <Text className="mt-4 mb-3 text-white font-semibold text-base">
               Qual a recorrência?
            </Text>

            {availableWeekDays.map((weekDay, index) => (
               <Checkbox
                  key={weekDay}
                  title={weekDay}
                  checked={weekDays.includes(index)}
                  onPress={() =>
                     handleToogleWeekDay(weekDays, index, setWeekDays)
                  }
               />
            ))}

            <TouchableOpacity
               className="w-full h-14 flex-row items-center justify-center mt-3 rounded-md bg-green-600"
               activeOpacity={0.7}
               onPress={handleCreateNewHabit}
            >
               <Feather name="check" size={20} color={colors.white} />

               <Text className="font-semibold text-base text-white ml-2">
                  Confirmar
               </Text>
            </TouchableOpacity>
         </ScrollView>
      </View>
   );
}
