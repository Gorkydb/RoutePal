Welcome to React Native DevTools
Debugger integration: iOS Bridgeless (RCTHost)
import AsyncStorage from "@react-native-async-storage/async-storage";

Compiling JS failed: 1:1:'import' statement requires module mode
const AsyncStorage = require("@react-native-async-storage/async-storage");

Property 'require' doesn't exist
ReferenceError: Property 'require' doesn't exist
    at global (:1:22) ReferenceError: Property 'require' doesn't exist
    at global (:1:22)
import AsyncStorage from "@react-native-async-storage/async-storage";

Compiling JS failed: 1:1:'import' statement requires module mode
const AsyncStorage = require("@react-native-async-storage/async-storage").default;

Property 'require' doesn't exist
ReferenceError: Property 'require' doesn't exist
    at global (:1:22) ReferenceError: Property 'require' doesn't exist
    at global (:1:22)
Compiling JS failed: 1:9:';' expected
useEffect(() => {
  AsyncStorage.removeItem("jwt_token").then(() => {
    console.log("🔴 Token başarıyla silindi!");
  });
}, []);

Compiling JS failed: 3:18:Invalid UTF-8 code point 0xd83d
useEffect(() => {
  AsyncStorage.removeItem("jwt_token").then(() => {
    console.log(" Token başarıyla silindi!");
  });
}, []);

Property 'useEffect' doesn't exist
ReferenceError: Property 'useEffect' doesn't exist
    at global (:1:1) ReferenceError: Property 'useEffect' doesn't exist
    at global (:1:1)
