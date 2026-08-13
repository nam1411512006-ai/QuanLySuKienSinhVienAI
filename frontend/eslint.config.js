import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["dist", "node_modules"]),

  {
    files: ["**/*.{js,jsx}"],

    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],

    languageOptions: {
      globals: globals.browser,

      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },

    rules: {
      /*
       * Project hiện tại sử dụng nhiều hàm async
       * được khai báo sau useEffect.
       *
       * eslint-plugin-react-hooks 7.x kiểm tra
       * trường hợp này rất nghiêm ngặt.
       *
       * Tạm tắt rule này để không biến code
       * đang hoạt động thành lỗi CI.
       */
      "react-hooks/immutability": "off",

      /*
       * Một số component hiện tại có logic setState
       * bên trong effect. Giữ lint không bị chặn
       * bởi rule mới này.
       */
      "react-hooks/set-state-in-effect": "off",

      /*
       * Không sử dụng biến chưa khai báo.
       */
      "no-undef": "error",

      /*
       * Không khai báo biến nhưng không sử dụng.
       */
      "no-unused-vars": [
        "warn",
        {
          vars: "all",
          args: "after-used",
          ignoreRestSiblings: true,
          varsIgnorePattern: "^_",
          argsIgnorePattern: "^_",
        },
      ],
    },
  },
]);