module.exports = {
    // 1: {_sTrcode: "TES0001" // 테스트} 추출
    // 2: {// TES0001 :: 테스트} 추출
    "parserType": "2",

    // 추출 폴더명 (Ex. projectName)
    "dirname": "kyowon-kumon-client-customer",

    // 전문의 접미사 (여러 전문명을 사용할 경우 배열로 입력)
    "prefix": "KM0",

    // 파싱을 제외한 폴더 이름
    "ignoreFolderList": [
        "bizMOB",
        "common"
    ],
};