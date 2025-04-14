import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Page() {
  const { quiz } = useLocalSearchParams();
  return <SafeAreaView></SafeAreaView>;
}
