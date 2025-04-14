import usePocketBase from "@/stores/usePocketBase";
import { useQuery } from "@tanstack/react-query";
import { ActivityIndicator, ToastAndroid } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Page() {
  const { instance } = usePocketBase();

  const { data } = useQuery({
    queryKey: ["quiz"],
    queryFn: async () => {
      try {
        const { items } = await instance!
          .collection("modules")
          .getList(1, 50, { filter: "visible = 1" });

        return items;
      } catch (err) {
        ToastAndroid.show("Error fetching quiz.", ToastAndroid.SHORT);
        return err;
      }
    },
    staleTime: 300000,
  });

  if (!data) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size={64} color={"#242424"} />
      </SafeAreaView>
    );
  }

  return <SafeAreaView></SafeAreaView>;
}
