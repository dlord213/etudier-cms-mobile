import WorkSansFonts from "@/types/Font";
import Feather from "@expo/vector-icons/Feather";
import usePocketBase from "@/stores/usePocketBase";

import { Pressable, Text, TextInput, ToastAndroid, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { router } from "expo-router";

import "../../global.css";

export default function Index() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [name, setName] = useState("");
  const [school, setSchool] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { instance, setIsLoggedIn, setUserRecord } = usePocketBase();

  const handleRegister = async () => {
    if (!email) {
      ToastAndroid.show("Email required.", ToastAndroid.SHORT);
      return;
    }

    if (!password) {
      ToastAndroid.show("Password required.", ToastAndroid.SHORT);
      return;
    }

    setIsRegistering(true);
    try {
      await instance!.collection("users").create({
        name: name,
        school: school,
        account_type: "Student",
        email: email,
        password: password,
        passwordConfirm: password,
      });

      const { record, token } = await instance!
        .collection("users")
        .authWithPassword(email, password);

      const user = await instance!.collection("users").getOne(record.id);

      setIsLoggedIn(true);
      setUserRecord(user);
      router.push("/(student)/dashboard");
    } catch (err) {
      setErrorMsg(`Error: ${err.message || err}`);
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 justify-center gap-4 bg-white">
      <Feather
        name="arrow-left"
        size={24}
        color="#242424"
        className="mx-8 my-2"
        onPress={() => router.back()}
      />
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
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          className="px-6 py-4 bg-gray-100 text-[#242424] rounded-2xl"
          style={{ fontFamily: WorkSansFonts.WorkSans_400Regular }}
          placeholder="School"
          value={school}
          onChangeText={setSchool}
        />
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
          disabled={isRegistering}
          onPress={handleRegister}
          className="p-4 bg-gray-100 border border-gray-300 shadow disabled:bg-green-300 rounded-3xl text-center"
        >
          <Text
            style={{ fontFamily: WorkSansFonts.WorkSans_400Regular }}
            className="text-center"
          >
            {isRegistering ? "Registering" : "Register"}
          </Text>
        </Pressable>
        {errorMsg && (
          <View className="flex-row gap-4 p-4 bg-red-400 rounded-3xl items-center">
            <Feather name="alert-circle" size={24} color="#fefefe" />
            <Text
              style={{ fontFamily: WorkSansFonts.WorkSans_400Regular }}
              className="text-[#fefefe] flex-1"
            >
              {errorMsg}
            </Text>
          </View>
        )}
      </View>
      <View className="border-t border-gray-200 mx-8" />
      <Pressable
        className="p-4 bg-gray-100 border border-gray-300 shadow disabled:bg-green-300 rounded-3xl text-center mx-8"
        onPress={() => router.replace("/(auth)/login")}
      >
        <Text
          style={{ fontFamily: WorkSansFonts.WorkSans_400Regular }}
          className="text-center"
        >
          Login
        </Text>
      </Pressable>
    </SafeAreaView>
  );
}
