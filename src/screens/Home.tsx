import { useNavigation } from "@react-navigation/native";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Text, View, ScrollView, Alert } from "react-native";

import { DAY_SIZE, HabitDays } from "../components/HabitDay";
import { Header } from "../components/Header";
import { Loading } from "../components/Loading";
import { api } from "../lib/axios";
import { generateRangeDatesFromYearStart } from "../utils/generate-range-between-dates";

const weekDays = ["S", "M", "T", "W", "T", "F", "S"];
const datesFromYearStart = generateRangeDatesFromYearStart();
const minimumSummaryDateSize = 18 * 7; // 18 weeks
const amountOfDaysToFill = minimumSummaryDateSize - datesFromYearStart.length;

interface ISummary {
  id: string;
  date: Date;
  completed: number;
  amount: number;
}

export function Home() {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<ISummary[]>([]);

  const { navigate } = useNavigation();

  async function fetchData() {
    try {
      setLoading(true);
      const response = await api.get("summary");
      setSummary(response.data);
    } catch (error) {
      Alert.alert("Ops", "It was not possible to load your habit summary");
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <Loading />;
  }

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

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View className="flex-row flex-wrap">
          {datesFromYearStart.map((date) => {
            const dayWithHabits = summary.find((day) =>
              dayjs(date).isSame(day.date, "day")
            );

            return (
              <HabitDays
                key={date.toISOString()}
                date={date}
                amount={dayWithHabits?.amount}
                completed={dayWithHabits?.completed}
                onPress={() => navigate("habit", { date: date.toISOString() })}
              />
            );
          })}

          {amountOfDaysToFill > 0 &&
            Array.from({ length: amountOfDaysToFill }).map((_, i) => (
              <View
                key={i}
                className="bg-zinc-900 rounded-lg border-2 m-1 border-zinc-800 opacity-40"
                style={{ width: DAY_SIZE, height: DAY_SIZE }}
              />
            ))}
        </View>
      </ScrollView>
    </View>
  );
}
