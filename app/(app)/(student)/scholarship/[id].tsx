import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SkeletonCard } from "@/components/ui/Skeleton";
import {
  useScholarship,
  useApplyForScholarship,
  type ApplyDto,
} from "@/hooks/useScholarship";
import { useAuthStore } from "@/lib/auth-store";

const EDUCATION_LEVELS = [
  "SECONDARY",
  "UNDER_GRADUATE",
  "GRADUATE",
  "NYSC",
  "POST_GRADUATE",
];

const NIGERIAN_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa",
  "Benue", "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti",
  "Enugu", "FCT", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano",
  "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger",
  "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto",
  "Taraba", "Yobe", "Zamfara",
];

export default function ScholarshipDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const { data: scholarship, isLoading } = useScholarship(id!);
  const applyMutation = useApplyForScholarship();

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<ApplyDto>({
    applicantName: user ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() : "",
    applicantEmail: user?.email ?? "",
    applicantPhone: "",
    educationLevel: "",
    location: "",
    courseOfInterest: "",
  });

  const handleApply = async () => {
    if (!form.applicantName || !form.applicantEmail || !form.applicantPhone) {
      Alert.alert("Missing Info", "Please fill in all required fields.");
      return;
    }
    if (!form.educationLevel) {
      Alert.alert("Missing Info", "Please select your education level.");
      return;
    }
    if (!form.location) {
      Alert.alert("Missing Info", "Please enter your location.");
      return;
    }

    try {
      const result = await applyMutation.mutateAsync({
        scholarshipId: id!,
        dto: form,
      });
      Alert.alert(
        "Application Submitted!",
        scholarship?.examId
          ? "Your application has been received. You will be assigned a scholarship exam."
          : "Your application has been received and is under review.",
        [
          {
            text: "View Status",
            onPress: () => router.push("/scholarship/applications"),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert(
        "Application Failed",
        error.message || "Something went wrong. Please try again."
      );
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900 px-4 pt-4">
        <SkeletonCard />
        <SkeletonCard />
      </SafeAreaView>
    );
  }

  if (!scholarship) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900 items-center justify-center">
        <Text className="text-gray-500">Scholarship not found</Text>
      </SafeAreaView>
    );
  }

  const isOpen = scholarship.status === "open";
  const deadlinePassed =
    scholarship.applicationDeadline &&
    new Date(scholarship.applicationDeadline) < new Date();

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView className="flex-1 px-4 pt-4" keyboardShouldPersistTaps="handled">
          {/* Header */}
          <Card className="mb-4">
            <View className="flex-row items-start justify-between mb-2">
              <Text className="text-xl font-bold text-gray-900 dark:text-white flex-1 mr-2">
                {scholarship.name}
              </Text>
              <Badge
                label={scholarship.status}
                variant={isOpen ? "success" : "default"}
              />
            </View>

            {scholarship.description && (
              <Text className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {scholarship.description}
              </Text>
            )}

            <View className="flex-row flex-wrap gap-4 mb-3">
              <InfoItem label="Type" value={scholarship.type.replace("_", " ")} />
              <InfoItem label="Coverage" value={`${scholarship.coveragePercent}%`} />
              <InfoItem label="Max Awards" value={`${scholarship.maxAwards}`} />
              <InfoItem label="Year" value={scholarship.academicYear} />
              {scholarship.applicationDeadline && (
                <InfoItem
                  label="Deadline"
                  value={new Date(scholarship.applicationDeadline).toLocaleDateString()}
                />
              )}
            </View>

            {scholarship.examId && (
              <View className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 mb-2">
                <Text className="text-sm font-medium text-blue-800 dark:text-blue-300">
                  This scholarship requires an entrance exam
                </Text>
                {scholarship.eligibilityRules?.minExamScore && (
                  <Text className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                    Minimum score: {scholarship.eligibilityRules.minExamScore}%
                  </Text>
                )}
              </View>
            )}
          </Card>

          {/* Eligibility */}
          {scholarship.eligibilityRules && (
            <Card className="mb-4">
              <Text className="text-base font-semibold text-gray-900 dark:text-white mb-2">
                Eligibility Requirements
              </Text>
              {scholarship.eligibilityRules.educationLevels?.length ? (
                <Text className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Education: {scholarship.eligibilityRules.educationLevels.join(", ")}
                </Text>
              ) : null}
              {scholarship.eligibilityRules.locations?.length ? (
                <Text className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Locations: {scholarship.eligibilityRules.locations.join(", ")}
                </Text>
              ) : null}
              {scholarship.eligibilityRules.minExamScore ? (
                <Text className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Minimum exam score: {scholarship.eligibilityRules.minExamScore}%
                </Text>
              ) : null}
            </Card>
          )}

          {/* Apply Form */}
          {isOpen && !deadlinePassed && !showForm && (
            <Button
              title="Apply for this Scholarship"
              className="mb-4"
              onPress={() => setShowForm(true)}
            />
          )}

          {showForm && (
            <Card className="mb-8">
              <Text className="text-base font-semibold text-gray-900 dark:text-white mb-3">
                Application Form
              </Text>

              <FormField
                label="Full Name *"
                value={form.applicantName}
                onChangeText={(v) => setForm({ ...form, applicantName: v })}
                placeholder="Your full name"
              />
              <FormField
                label="Email *"
                value={form.applicantEmail}
                onChangeText={(v) => setForm({ ...form, applicantEmail: v })}
                placeholder="your@email.com"
                keyboardType="email-address"
              />
              <FormField
                label="Phone *"
                value={form.applicantPhone}
                onChangeText={(v) => setForm({ ...form, applicantPhone: v })}
                placeholder="08012345678"
                keyboardType="phone-pad"
              />
              <FormField
                label="Education Level *"
                value={form.educationLevel}
                onChangeText={(v) => setForm({ ...form, educationLevel: v })}
                placeholder="e.g. GRADUATE, NYSC, UNDER_GRADUATE"
              />
              <FormField
                label="Location (State) *"
                value={form.location}
                onChangeText={(v) => setForm({ ...form, location: v })}
                placeholder="e.g. Enugu, Lagos, Rivers"
              />
              <FormField
                label="Course of Interest"
                value={form.courseOfInterest}
                onChangeText={(v) => setForm({ ...form, courseOfInterest: v })}
                placeholder="e.g. Web Development"
              />

              <Button
                title={applyMutation.isPending ? "Submitting..." : "Submit Application"}
                className="mt-3"
                onPress={handleApply}
                disabled={applyMutation.isPending}
              />
            </Card>
          )}

          {!isOpen && (
            <Card className="mb-4 bg-red-50 dark:bg-red-900/20">
              <Text className="text-sm text-red-800 dark:text-red-300 text-center">
                {deadlinePassed
                  ? "The application deadline has passed."
                  : "This scholarship is currently not accepting applications."}
              </Text>
            </Card>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <View>
      <Text className="text-xs text-gray-500">{label}</Text>
      <Text className="text-sm font-semibold text-gray-900 dark:text-white capitalize">
        {value}
      </Text>
    </View>
  );
}

function FormField({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  keyboardType?: "default" | "email-address" | "phone-pad";
}) {
  return (
    <View className="mb-3">
      <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </Text>
      <TextInput
        className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 text-sm text-gray-900 dark:text-white"
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        keyboardType={keyboardType ?? "default"}
        autoCapitalize="none"
      />
    </View>
  );
}
