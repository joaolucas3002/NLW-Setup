import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Logo from '../assets/logo.svg';
import colors from 'tailwindcss/colors';
import { useNavigation } from '@react-navigation/native';

export function Header() {
   const { navigate } = useNavigation();

   return (
      <View className="w-full flex-row items-center justify-between ">
         <Logo />

         <TouchableOpacity
            activeOpacity={0.7}
            className=" flex-row  px-4 py-3  border border-violet-500 rounded-lg items-center "
            onPress={() => navigate('new')}
         >
            <Feather name="plus" color={colors.violet[500]} size={20} />

            <Text className="text-white font-semibold text-base  ml-3">
               Header
            </Text>
         </TouchableOpacity>
      </View>
   );
}
