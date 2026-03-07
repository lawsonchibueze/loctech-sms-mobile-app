import { View, Text, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { Linking } from "react-native";
import { Button } from "@/components/ui/Button";

interface Certificate {
  id: string;
  courseTitle: string;
  issuedAt: string;
  certificateNumber: string;
  downloadUrl: string;
}

export default function CertificatesScreen() {
  const { data: certificates, isLoading } = useQuery({
    queryKey: ["student", "certificates"],
    queryFn: () => api.get<Certificate[]>("/sms/certificates/my-certificates"),
  });

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <Text className="text-2xl font-bold text-gray-900 dark:text-white px-4 pt-4 mb-4">
        Certificates
      </Text>

      {isLoading ? (
        <View className="px-4">{[1, 2].map((i) => <SkeletonCard key={i} />)}</View>
      ) : !certificates?.length ? (
        <EmptyState title="No certificates" description="Complete a course to earn certificates." />
      ) : (
        <FlatList
          data={certificates}
          keyExtractor={(item) => item.id}
          contentContainerClassName="px-4 pb-8"
          renderItem={({ item }) => (
            <Card className="mb-3">
              <Text className="text-sm font-semibold text-gray-900 dark:text-white">{item.courseTitle}</Text>
              <Text className="text-xs text-gray-500 mt-1">#{item.certificateNumber}</Text>
              <Text className="text-xs text-gray-500">Issued: {new Date(item.issuedAt).toLocaleDateString()}</Text>
              <Button
                title="Download"
                variant="outline"
                size="sm"
                className="mt-2 self-start"
                onPress={() => Linking.openURL(item.downloadUrl)}
              />
            </Card>
          )}
        />
      )}
    </SafeAreaView>
  );
}
