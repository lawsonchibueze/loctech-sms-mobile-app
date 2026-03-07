import { View, Text, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { Linking } from "react-native";

interface InvoiceDetail {
  id: string;
  description: string;
  amount: number;
  paidAmount: number;
  status: string;
  dueDate: string;
}

export default function PayInvoiceScreen() {
  const { invoiceId } = useLocalSearchParams<{ invoiceId: string }>();
  const router = useRouter();

  const { data: invoice, isLoading } = useQuery({
    queryKey: ["invoice", invoiceId],
    queryFn: () => api.get<InvoiceDetail>(`/sms/payments/invoices/${invoiceId}`),
    enabled: !!invoiceId,
  });

  const initPayment = useMutation({
    mutationFn: () =>
      api.post<{ authorizationUrl: string; reference: string }>(
        "/sms/payments/initialize",
        { invoiceId }
      ),
    onSuccess: (data) => {
      Linking.openURL(data.authorizationUrl);
    },
    onError: (error) => {
      Alert.alert("Payment Error", error.message);
    },
  });

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900 px-4 pt-4">
        <Skeleton width="60%" height={24} className="mb-4" />
        <Skeleton width="100%" height={120} />
      </SafeAreaView>
    );
  }

  if (!invoice) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <Text className="text-gray-500">Invoice not found</Text>
        <Button title="Go Back" variant="ghost" onPress={() => router.back()} />
      </SafeAreaView>
    );
  }

  const remaining = invoice.amount - invoice.paidAmount;

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <View className="flex-1 px-4 pt-4">
        <Button title="Back" variant="ghost" size="sm" onPress={() => router.back()} className="self-start mb-4" />

        <Card className="mb-4">
          <Text className="text-sm text-gray-500 mb-1">{invoice.description}</Text>
          <Text className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            ₦{remaining.toLocaleString()}
          </Text>
          <View className="flex-row justify-between">
            <Text className="text-xs text-gray-500">Total: ₦{invoice.amount.toLocaleString()}</Text>
            <Text className="text-xs text-green-600">Paid: ₦{invoice.paidAmount.toLocaleString()}</Text>
          </View>
          <Text className="text-xs text-gray-500 mt-2">
            Due: {new Date(invoice.dueDate).toLocaleDateString()}
          </Text>
        </Card>

        <Button
          title={`Pay ₦${remaining.toLocaleString()}`}
          onPress={() => initPayment.mutate()}
          loading={initPayment.isPending}
          size="lg"
        />
        <Text className="text-xs text-gray-500 text-center mt-3">
          Secure payment via Paystack
        </Text>
      </View>
    </SafeAreaView>
  );
}
