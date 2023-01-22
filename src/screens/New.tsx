import { ScrollView, Text, TextInput, View } from "react-native";
import { BackButton } from "../components/BackButton";

export function New() {
  return (
    <View className="flex-1 bg-background px-8 pt-16">
      <ScrollView showsVerticalScrollIndicator={false}>
        <BackButton />

        <Text className="mt-6 text-white font-extrabold text-3xl">
          Create Habit
        </Text>

        <Text className="mt-6 text-white font-semibold text-base">
          What you're committing to?
        </Text>

        <TextInput className="h-12 pl-4 rounded-lg mt-3 bg-zinc-800 text-white focus:border-2 focus:border-violet-600" />
      </ScrollView>
    </View>
  );
}
