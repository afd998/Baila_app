const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Apply your existing modifications to the defaultConfig
config.transformer.minifierConfig.compress.drop_console = true;

// Fix for Firebase Authentication module resolution issue
config.resolver.assetExts.push("cjs");

// Disable package exports to prevent Node.js module resolution issues
config.resolver.unstable_enablePackageExports = false;

// Add Node.js module resolution handling
config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Handle problematic Node.js modules
  if (
    moduleName === "stream" ||
    moduleName === "crypto" ||
    moduleName === "buffer" ||
    moduleName === "util" ||
    moduleName === "events" ||
    moduleName === "fs" ||
    moduleName === "path" ||
    moduleName === "os" ||
    moduleName.startsWith("node:")
  ) {
    return {
      type: "empty",
    };
  }

  // Default resolver
  return context.resolveRequest(context, moduleName, platform);
};

// Add extraNodeModules for browser-compatible alternatives
config.resolver.extraNodeModules = {
  stream: require.resolve("readable-stream"),
  crypto: require.resolve("react-native-crypto"),
  buffer: require.resolve("buffer/"),
  util: require.resolve("util/"),
  process: require.resolve("process/browser"),
  zlib: require.resolve("browserify-zlib"),
  path: require.resolve("path-browserify"),
  fs: false,
  net: false,
  tls: false,
  child_process: false,
  https: false,
  http: false,
};

// Add blocklist for problematic modules
config.resolver.blockList = [
  /node_modules\/ws\/lib\/websocket\.js/,
  /node_modules\/ws\/lib\/websocket-server\.js/,
  /node_modules\/ws\/lib\/stream\.js/,
];

// Add alias for ws to use React Native's WebSocket
config.resolver.alias = {
  ...config.resolver.alias,
  "ws/lib/websocket": "react-native",
  "ws/lib/websocket-server": "react-native",
  "ws/lib/stream": "react-native",
};

module.exports = config; 