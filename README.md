# bizMOB 파일별 Trcode Parser

## 설치법

1. Project 소스상과 같은 Depth에 위치

    ```Trcode-parser 폴더위치
    .
    ├── trcode-parser
    │   ├── index.js
    │   ├── parser.bat
    │   ├── parser.config.js
    │   └── ...
    └── projectName
        └── WebContent
            ├── webemulator
            │   └── ...
            └── contents
                └── ...
    ```

2. `trcode-parser`폴더에서 __npm install__ 커맨드를 실행하여 dependencies 모듈 설치

## 제약사항

1. 폴더 내부의 js 파일에 적혀있는 trcode를 추출하는 것으로 trcode 명칭이 ""으로 감싸져 있어야 함

    ```trcode 예시
        ...
        _sTrcode: "TES0001"
        ...
    ```

2. 화면 이름은 js파일 상단의 `@title` 부분을 추출하는 것으로 해당 부분에 작성된 내용이 없다면 빈 값으로 출력

## 사용법

1. `parser.config.js` 내부에 파싱과 관련된 정보 입력

2. `parser.bat` 파일을 실행하여 추출 성공 로그 확인

3. `/output`폴더에 생성된 결과물 확인
    1. __trcodes.excel.txt__: 엑셀 파일에 복사&붙여넣기를 할 수 있도록 엑셀 Format에 맞게 출력한 text 파일
    2. __trcodes.json__: 각 파일별 타이틀과 trcode를 추출한 Json 파일

4. `/output/trcodes.excel.txt`파일의 text를 복사해서 엑셀에 붙여넣은 후 열의 높이와 열을 맞춤