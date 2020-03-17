module.exports = {
    // Default Setting
    "extends": "eslint:recommended",
    "env": {
        "browser": true,
        "jquery": true,
        "node": true,
    },
    "parserOptions": {
        "ecmaVersion": 2018
    },

    // Globals Variable
    "globals": {
        "JSON": "readonly",
        "CONST": "writable",
        "lcsUtil": "readonly",
        "lcsMtUtil": "writable",
        "lcsResource": "readonly",
        "lcsMtResource": "writable",
        "lcsMtChart": "readonly",
        "Highcharts": "readonly",
        "webKeypad": "readonly",
        "LEMP": "readonly",
        "LEMPCore": "readonly",
        "PDFObject": "readonly",
        "m2soft": "readonly",
        "moment": "readonly",
        "Set": "readonly",
    },

    // Eslint Disabled Patterns
    "ignorePatterns": [
        // Folder
        "webemulator/",
        "LEMP/",
        "PDF/",
        "lib/",
        "salesLib/",
        "SCMN/",
        "SCOM/",
        "SCST/",
        "SEVT/",
        "SGNB/",
        "SLOG/",
        "SRST/",
        "SSET/",
        "SSPT/",
        "SSTC/",
        "STEC/",
        "SVST/",
        // "MCOM/",
        // "MDAT/",

        // File
        "jsLoader.js",
        "webKeypad.js",
    ],

    // Coding Conventions
    "rules": {
        // 문단 마지막 세미콜론
        "semi": [ "error", "always" ],

        // 쌍따움표 사용
        "quotes": [ "error", "double" ],

        // Tab은 Sapce 4칸으로 정의
        "indent": [ "error", 4, { "SwitchCase": 1 } ],

        // Function과 소괄호 사이의 공백 X
        "space-before-function-paren": ["error", "never"],

        // {} 앞에는 공백
        "space-before-blocks": [ "error",  "always" ],

        // 조건/반복문/제어문에 중괄호 사용
        "curly": "error",

        // 콜론(:)을 사용하는 경우에는 반드시 뒤에 공백을 삽입한다.
        "key-spacing": ["error", {
            "afterColon": true
        }],

        // 특정 키워드의 경우 뒤에 공백을 삽입한다.
        "keyword-spacing": ["error", {
            "before": true,
            "after": true,
            "overrides": {
                "return": { "after": true },
                "throw": { "after": true },
                "case": { "after": true }
            }
        }],

        // comma는 뒤에 삽입
        "comma-style": ["error", "last"],

        // new 생성자 금지 (Object, Array, Function)
        "no-new-object": "error",
        "no-array-constructor": "error",
        "no-new-func": "error"
    }
};