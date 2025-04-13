import WorkSansFonts from "@/types/Font";

import { Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import "../../global.css";
import { useState } from "react";
import pocketbase_instance from "@/lib/pocketbase";

export default function Index() {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      await pocketbase_instance
        .collection("users")
        .authWithPassword(email, password);
    } catch (err) {}
    setIsLoggingIn(false);
  };

  return (
    <SafeAreaView className="flex-1 justify-center gap-4 bg-white">
      <Text
        className="text-5xl text-[#242424] mx-8"
        style={{ fontFamily: WorkSansFonts.WorkSans_900Black }}
      >
        etudier
      </Text>
      <View className="gap-4 p-6 rounded-3xl bg-gray-50 border border-gray-200 shadow mx-8">
        <TextInput
          className="px-6 py-4 bg-gray-100 text-[#242424] rounded-2xl"
          style={{ fontFamily: WorkSansFonts.WorkSans_400Regular }}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          className="px-6 py-4 bg-gray-100 text-[#242424] rounded-2xl"
          style={{ fontFamily: WorkSansFonts.WorkSans_400Regular }}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <Pressable
          disabled={isLoggingIn}
          onPress={handleLogin}
          className="p-4 bg-gray-100 border border-gray-300 shadow disabled:bg-green-500 rounded-3xl text-center"
        >
          <Text
            style={{ fontFamily: WorkSansFonts.WorkSans_400Regular }}
            className="text-center"
          >
            Login
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
