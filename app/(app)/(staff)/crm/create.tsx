import { useState } from "react";
import { View, Text, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useCreateLead } from "@/hooks/useCRM";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function CreateLeadScreen() {
  const router = useRouter();
  const createLead = useCreateLead();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [source, setSource] = useState("");
  const [program, setProgram] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = () => {
    if (!name.trim() || !email.trim() || !source.trim()) {
      Alert.alert("Error", "Name, email, and source are required.");
      return;
    }

    createLead.mutate(
      {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim() || undefined,
        source: source.trim(),
        interestedProgram: program.trim() || undefined,
        notes: notes.trim() || undefined,
      },
      {
        onSuccess: () => {
          Alert.alert("Created", "Lead has been created.", [
            { text: "OK", onPress: () => router.back() },
          ]);
        },
        onError: (error) => Alert.alert("Error", error.message),
      }
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <ScrollView className="flex-1 px-4 pt-4">
        <Button title="Back" variant="ghost" size="sm" onPress={() => router.back()} className="self-start mb-2" />
        <Text className="text-xl font-bold text-gray-900 dark:text-white mb-4">New Lead</Text>

        <Input label="Name *" placeholder="Full name" value={name} onChangeText={setName} />
        <Input label="Email *" placeholder="email@example.com" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        <Input label="Phone" placeholder="+234..." value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
        <Input label="Source *" placeholder="e.g. Website, Referral, Walk-in" value={source} onChangeText={setSource} />
        <Input label="Interested Program" placeholder="e.g. Web Development" value={program} onChangeText={setProgram} />
        <Input label="Notes" placeholder="Additional notes..." value={notes} onChangeText={setNotes} multiline numberOfLines={3} />

        <Button title="Create Lead" onPress={handleSubmit} loading={createLead.isPending} size="lg" className="mb-8" />
      </ScrollView>
    </SafeAreaView>
  );
}
