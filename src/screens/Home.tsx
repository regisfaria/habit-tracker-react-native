import { Text, View } from "react-native";
import { DAY_SIZE } from "../components/HabitDay";

import { Header } from "../components/Header";

const weekDays = ["S", "M", "T", "W", "T", "F", "S"];

export function Home() {
  return (
    <View className="flex-1 bg-background px-8 pt-16">
      <Header />

      <View className="flex-row mt-6 mb-2">
        {weekDays.map((day, i) => (
          <Text
            className="text-zinc-400 text-xl font-bold text-center mx-1"
            key={`${day}-${i}`}
            style={{ width: DAY_SIZE }}
          >
            {day}
          </Text>
        ))}
      </View>
    </View>
  );
}