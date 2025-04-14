import usePocketBase from "@/stores/usePocketBase";
import WorkSansFonts from "@/types/Font";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { Pressable, ScrollView, useWindowDimensions } from "react-native";
import { ActivityIndicator, Text, ToastAndroid, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Page() {
  const { instance } = usePocketBase();
  const { width } = useWindowDimensions();

  const { data } = useQuery({
    queryKey: ["modules"],
    queryFn: async () => {
      try {
        const { items } = await instance!
          .collection("modules")
          .getList(1, 50, { filter: "visible = 1" });

        return items;
      } catch (err) {
        ToastAndroid.show("Error fetching modules.", ToastAndroid.SHORT);
        throw err;
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

  return (
    <SafeAreaView className="flex-1 bg-white p-4 gap-4">
      <View className="flex-row justify-between items-center">
        <View className="flex-row gap-4 items-center">
          <MaterialIcons
            name="arrow-back"
            size={24}
            color={"#242424"}
            onPress={() => router.back()}
          />
          <Text
            className="text-3xl"
            style={{ fontFamily: WorkSansFonts.WorkSans_700Bold }}
          >
            Modules
          </Text>
        </View>
        <MaterialIcons name="search" size={24} color={"#242424"} />
      </View>

      <ScrollView contentContainerClassName="gap-4">
        {data.map((module: any) => (
          <Pressable
            key={module.id}
            className="gap-4 p-4 bg-gray-100 rounded-3xl border border-gray-300 shadow"
            onPress={() =>
              router.push({
                pathname: "/(student)/[module]",
                params: { module: module.id },
              })
            }
          >
            {module.course && (
              <View className="px-6 py-2 bg-gray-200 rounded-3xl">
                <Text
                  className="text-gray-500 text-sm flex-1 text-center"
                  style={{ fontFamily: WorkSansFonts.WorkSans_400Regular }}
                >
                  {module.course}
                </Text>
              </View>
            )}
            <Text
              className="text-xl flex-1"
              style={{ fontFamily: WorkSansFonts.WorkSans_700Bold }}
            >
              {module.title}
            </Text>
            <Text
              className="text-gray-400 flex-1"
              style={{ fontFamily: WorkSansFonts.WorkSans_400Regular }}
            >
              {module.description}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
