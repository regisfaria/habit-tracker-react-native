import { useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { BackButton } from "../components/BackButton";
import { CheckBox } from "../components/CheckBox";
import { Feather } from "@expo/vector-icons";
import colors from "tailwindcss/colors";
import { api } from "../lib/axios";

const availableWeekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export function New() {
  const [title, setTitle] = useState("");
  const [selectedWeekdays, setSelectedWeekdays] = useState<number[]>([]);

  function handleToggleWeekdays(weekdayIndex: number) {
    if (selectedWeekdays.includes(weekdayIndex)) {
      setSelectedWeekdays((prevState) =>
        prevState.filter((weekday) => weekday !== weekdayIndex)
      );
    } else {
      setSelectedWeekdays((prevState) => [...prevState, weekdayIndex]);
    }
  }

  async function handleCreateNewHabit() {
    try {
      if (!title.trim()) {
        Alert.alert("Habit's name", "Provide the habit's name");
        return;
      }
      if (selectedWeekdays.length === 0) {
        Alert.alert("Habit's frequency", "You must select at least one day");
        return;
      }

      await api.post("habits", { title, weekDays: selectedWeekdays });

      setTitle("");
      setSelectedWeekdays([]);

      Alert.alert("Success", "Habit was created! ✨");
    } catch (error) {
      console.log(error);
      Alert.alert("Ops", "It wasn't possible to create the new habit");
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
          Create Habit
        </Text>
        <Text className="mt-6 text-white font-semibold text-base">
          What you're committing to?
        </Text>

        <TextInput
          className="h-12 pl-4 rounded-lg mt-3 bg-zinc-900 text-white border-2 border-zinc-800 focus:border-green-600"
          placeholder="i.e. To exercise, Read, ..."
          placeholderTextColor={colors.zinc[400]}
          onChangeText={setTitle}
          value={title}
        />

        <Text className="mt-4 mb-3 text-white font-semibold text-base">
          With which frequency?
        </Text>

        {availableWeekdays.map((weekday, index) => (
          <CheckBox
            key={weekday}
            title={weekday}
            checked={selectedWeekdays.includes(index)}
            onPress={() => handleToggleWeekdays(index)}
          />
        ))}

        <TouchableOpacity
          className="w-full h-14 flex-row items-center justify-center bg-green-600 rounded-md mt-6"
          activeOpacity={0.7}
          onPress={handleCreateNewHabit}
        >
          <Feather name="check" size={20} color={colors.white} />

          <Text className="ml-2 text-white font-semibold text-base">
            Confirm
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
