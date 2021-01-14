module.exports = {
    // 1: {_sTrcode: "TES0001" // 테스트} 추출
    // 2: {// TES0001 :: 테스트} 추출
    "parserType": "2",

    // 추출 프로젝트 경로 (Ex. C:/Work/ ... /project)
    "path": "C:/Work/Repositories/kyowon-client-origin/kyowon-kumon-client-customer",

    // 전문의 접미사 (여러 전문명을 사용할 경우 배열로 입력)
    "prefix": ["KM0","SP0"],

    // 파싱을 제외한 폴더 이름
    "ignoreFolderList": [
        "bizMOB",
        "common"
    ],
};