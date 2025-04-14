import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Page() {
  return (
    <SafeAreaView className="flex-1 bg-white p-6">
      <View className="flex-row gap-4">
        <MaterialIcons name="arrow-back" size={24} color={"#242424"} />
        <Text>Profile</Text>
      </View>
    </SafeAreaView>
  );
}
