import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import type { Lesson } from "@/hooks/useCourses";
import { LessonCard } from "./LessonCard";

interface ModuleAccordionProps {
  title: string;
  lessons: Lesson[];
  isCompleted: boolean;
  onLessonPress: (lessonId: string) => void;
  defaultOpen?: boolean;
}

export function ModuleAccordion({
  title,
  lessons,
  isCompleted,
  onLessonPress,
  defaultOpen = false,
}: ModuleAccordionProps) {
  const [open, setOpen] = useState(defaultOpen);
  const completedCount = lessons.filter((l) => l.isCompleted).length;

  return (
    <View className="mb-2 bg-white dark:bg-gray-800 rounded-xl overflow-hidden">
      <TouchableOpacity
        onPress={() => setOpen(!open)}
        className="flex-row items-center justify-between px-4 py-3"
      >
        <View className="flex-1 mr-3">
          <Text className="text-sm font-semibold text-gray-900 dark:text-white">
            {title}
          </Text>
          <Text className="text-xs text-gray-500 mt-0.5">
            {completedCount}/{lessons.length} lessons
          </Text>
        </View>
        <View className="flex-row items-center gap-2">
          {isCompleted ? (
            <View className="w-5 h-5 rounded-full bg-green-500 items-center justify-center">
              <Text className="text-white text-xs font-bold">✓</Text>
            </View>
          ) : (
            <View className="w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-600 items-center justify-center">
              <Text className="text-gray-500 text-xs">{completedCount}</Text>
            </View>
          )}
          <Text className="text-gray-400 text-sm">{open ? "▲" : "▼"}</Text>
        </View>
      </TouchableOpacity>

      {open ? (
        <View>
          {lessons.map((lesson) => (
            <LessonCard
              key={lesson.id}
              title={lesson.title}
              type={lesson.type}
              duration={lesson.duration}
              isCompleted={lesson.isCompleted}
              onPress={() => onLessonPress(lesson.id)}
            />
          ))}
        </View>
      ) : null}
    </View>
  );
}
