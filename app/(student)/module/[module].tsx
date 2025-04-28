import usePocketBase from "@/stores/usePocketBase";
import WorkSansFonts from "@/types/Font";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { useQuery } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Linking } from "react-native";
import {
  ActivityIndicator,
  Pressable,
  Text,
  ToastAndroid,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Page() {
  const { module } = useLocalSearchParams();
  const { instance, user_record } = usePocketBase();

  const [percent, setPercent] = useState("0%");
  const [bookmark, setBookmark] = useState("");
  const [isMarking, setIsMarking] = useState(false);

  const { data } = useQuery({
    queryKey: [module],
    queryFn: async () => {
      try {
        const record = await instance!
          .collection("modules")
          .getOne(module.toString(), { expand: "teacher_id" });

        const temp = [];
        for (const file of record.contents) {
          const url = instance!.files.getURL(record, file);
          temp.push({ url: url, title: url.split("/").pop() });
        }

        return { ...record, files: temp };
      } catch (err) {
        ToastAndroid.show("Error accessing module.", ToastAndroid.SHORT);
        router.back();
      }
    },
  });

  const { refetch: refetchUserProgress } = useQuery({
    queryKey: ["module_progress", module],
    queryFn: async () => {
      try {
        const record = await instance!
          .collection("users_modules_progress")
          .getFirstListItem(
            `user_id = '${user_record!.id}' && module_id = '${module}'`
          );

        setPercent(record.percent);
        setBookmark(record.bookmarked);

        return 0;
      } catch (err: any) {
        console.log(err);
        return err;
      }
    },
  });

  const handleMarkAsCompleted = async () => {
    setIsMarking(true);
    try {
      const recordExist = await instance!
        .collection("users_modules_progress")
        .getFirstListItem(
          `user_id = '${
            instance!.authStore.record!.id
          }' && module_id = '${module}'`
        );

      await instance!
        .collection("users_modules_progress")
        .update(recordExist.id, {
          percent: "100%",
        });
      refetchUserProgress();
    } catch (err) {
      await instance!.collection("users_modules_progress").create({
        user_id: instance!.authStore.record!.id,
        module_id: module,
        percent: "100%",
      });
      refetchUserProgress();
    }
    setIsMarking(false);
  };

  const handleUnmarkAsCompleted = async () => {
    setIsMarking(true);
    try {
      const recordExist = await instance!
        .collection("users_modules_progress")
        .getFirstListItem(
          `user_id = '${
            instance!.authStore.record!.id
          }' && module_id = '${module}'`
        );

      await instance!
        .collection("users_modules_progress")
        .update(recordExist.id, {
          percent: null,
        });
      refetchUserProgress();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {}
    setIsMarking(false);
  };

  if (!data) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size={64} color={"#242424"} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white p-4 gap-4">
      <MaterialIcons
        name="arrow-back"
        size={24}
        color={"#242424"}
        onPress={() => router.back()}
      />
      <View className="flex-row gap-2 items-center">
        <MaterialIcons name="account-circle" size={24} color={"#afafaf"} />
        <Text
          style={{ fontFamily: WorkSansFonts.WorkSans_400Regular }}
          className="text-[#afafaf]"
        >
          {data!.expand!.teacher_id.name}
        </Text>
      </View>
      <View className="flex-1">
        <Text
          style={{ fontFamily: WorkSansFonts.WorkSans_700Bold }}
          className="text-[#242424] text-3xl"
        >
          {data.title}
        </Text>
        <Text
          style={{ fontFamily: WorkSansFonts.WorkSans_400Regular }}
          className="text-gray-400"
        >
          {data.description}
        </Text>
      </View>
      {user_record && user_record.account_type == "Student" && (
        <View className="flex-row items-center gap-4 self-end">
          {percent != "100%" ? (
            <Pressable
              className="flex-row gap-2 px-6 py-4 bg-green-500 self-end place-self-end rounded-3xl"
              onPress={handleMarkAsCompleted}
              disabled={isMarking}
            >
              <MaterialIcons name="check-circle" size={16} color={"#fefefe"} />
              <Text
                className="text-sm text-[#fefefe]"
                style={{ fontFamily: WorkSansFonts.WorkSans_400Regular }}
              >
                Mark as complete
              </Text>
            </Pressable>
          ) : (
            <Pressable
              className="flex-row gap-2 px-6 py-4 bg-green-500 self-end place-self-end rounded-3xl"
              onPress={handleUnmarkAsCompleted}
              disabled={isMarking}
            >
              <MaterialIcons name="check" size={16} color={"#fefefe"} />
              <Text
                style={{ fontFamily: WorkSansFonts.WorkSans_400Regular }}
                className="text-sm text-[#fefefe]"
              >
                Completed
              </Text>
            </Pressable>
          )}
        </View>
      )}
      {data.files.length > 0 && (
        <View className="mx-4 my-2 p-6 bg-gray-100 rounded-3xl border border-gray-300 shadow gap-2">
          <Text
            className="text-2xl"
            style={{ fontFamily: WorkSansFonts.WorkSans_700Bold }}
          >
            Resources
          </Text>
          {data.files.map((file) => (
            <Pressable
              key={file.url}
              onPress={async () => await Linking.openURL(file.url)}
              className="flex-row gap-4 items-center text-sm text-gray-700 bg-gray-50 rounded-3xl p-4"
            >
              <MaterialIcons name="download" size={24} />
              <Text
                style={{ fontFamily: WorkSansFonts.WorkSans_400Regular }}
                className="flex-1"
              >
                {file.title}
              </Text>
            </Pressable>
          ))}
        </View>
      )}
      {data.files.length == 0 && (
        <View className="mx-4 my-2 p-6 bg-gray-100 rounded-3xl border border-gray-300 shadow gap-2">
          <Text
            className="text-2xl"
            style={{ fontFamily: WorkSansFonts.WorkSans_700Bold }}
          >
            No resources found.
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}
