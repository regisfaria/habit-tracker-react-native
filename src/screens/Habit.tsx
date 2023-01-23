import { useRoute } from "@react-navigation/native";
import clsx from "clsx";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { ScrollView, View, Text, Alert } from "react-native";
import { BackButton } from "../components/BackButton";
import { CheckBox } from "../components/CheckBox";
import { HabitsEmpty } from "../components/HabitsEmpty";
import { Loading } from "../components/Loading";
import { ProgressBar } from "../components/ProgressBar";
import { api } from "../lib/axios";
import { generateProgressPercentage } from "../utils/generate-progress-percentage";

interface Params {
  date: string;
}

interface IDayInfo {
  possibleHabits: Array<{
    id: string;
    title: string;
    created_at: string;
  }>;
  completedHabits: string[];
}

export function Habit() {
  const [loading, setLoading] = useState(true);
  const [dayInfo, setDayInfo] = useState<IDayInfo | null>(null);
  const [completedHabits, setCompletedHabits] = useState<string[]>([]);

  const route = useRoute();

  const { date } = route.params as Params;

  const parsedDate = dayjs(date);
  const dayOfWeek = parsedDate.format("dddd");
  const dayAndMonth = parsedDate.format("DD/MM");
  const isDateInPast = dayjs(date).endOf("day").isBefore(new Date());

  const amountAccomplishedPercentage = dayInfo?.possibleHabits.length
    ? generateProgressPercentage(
        dayInfo.possibleHabits.length,
        completedHabits.length
      )
    : 0;

  async function fetchHabits() {
    try {
      setLoading(true);

      const response = await api.get("/day", { params: { date } });

      setDayInfo(response.data);
      setCompletedHabits(response.data.completedHabits);
    } catch (error) {
      console.log(error);
      Alert.alert("Ops", "It was not possible to load habit information");
    } finally {
      setLoading(false);
    }
  }

  async function handleToggle(habitId: string) {
    try {
      await api.patch(`/habits/toggle/${habitId}`);

      if (completedHabits.includes(habitId)) {
        setCompletedHabits((prevState) =>
          prevState.filter((id) => id !== habitId)
        );
      } else {
        setCompletedHabits((prevState) => [...prevState, habitId]);
      }

      setDayInfo({
        possibleHabits: dayInfo!.possibleHabits,
        completedHabits: completedHabits,
      });
    } catch (error) {
      Alert.alert(
        "Ops",
        "It wasn't possible to toggle this habit. Try again later."
      );
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
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <BackButton />

        <Text className="mt-6 text-zinc-400 font-semibold text-base lowercase">
          {dayOfWeek}
        </Text>

        <Text className="text-white font-extrabold text-3xl">
          {dayAndMonth}
        </Text>

        <ProgressBar progress={amountAccomplishedPercentage} />

        <View
          className={clsx("mt-6", {
            ["opacity-50"]: isDateInPast,
          })}
        >
          {dayInfo?.possibleHabits.length ? (
            dayInfo?.possibleHabits.map((habit) => (
              <CheckBox
                key={habit.title}
                title={habit.title}
                checked={completedHabits.includes(habit.id)}
                disabled={isDateInPast}
                onPress={() => handleToggle(habit.id)}
              />
            ))
          ) : (
            <HabitsEmpty />
          )}
        </View>

        {isDateInPast && (
          <Text className="text-white mt-10 text-center">
            You can't toggle old habit's progress
          </Text>
        )}
      </ScrollView>
    </View>
  );
}
