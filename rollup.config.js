import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import typescript from "rollup-plugin-typescript";
import pkg from "./package.json";

export default {
  //      // 核心选项
  input: "src/index.js", // 必须
  //   external,
  plugins: [
    resolve(), // 查找和打包node_modules中的第三方模块
    commonjs(), // 将 CommonJS 转换成 ES2015 模块供 Rollup 处理
    typescript(),
  ],

  output: {
    file: pkg.browser, // 必须
    format: "umd", // 必须
    name: "temp",
  },
};
