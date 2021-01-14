const glob = require("glob");
const path = require("path");
const fs = require("fs");

const config = require("./parser.config");
const prefix = config.prefix;
const dirpath = config.path;
const ignoreFolderList = config.ignoreFolderList;
const contents = path.join(dirpath, "WebContent/contents/");
const parserType = config.parserType;

glob(path.join(contents, "**/*.js"), {
    dot: true,
    ignore: ignoreFolderList.map((ignoreFolder) => {
        return path.join(contents, `${ignoreFolder}/**`);
    })
}, (_, filePathList) => {
    const fileInfoList = [];

    /**
     * 파일 정보 추출
     */
    filePathList.sort().map((filePath) => {
        const fileName = filePath.split("/").pop();
        const file = fs.readFileSync(filePath, "utf8");

        /**
         * 파일의 @title 부분 출력
         */
        const expTitle = new RegExp("@title(.*?)\\r\\n", "gi");
        const matchTitle = file.match(expTitle) || [ "" ];

        /**
         * 파일의 trcode 부분 출력
         */
        let matchTrcodes = []; // 정규표현식으로 검색된 trcode String
        let codeList = []; // { code: "${trcode}", name: "${코드 제목}" } 형태의 목록
        let existCodes = []; // 중복제거를 위한 현재 페이지에 등록된 코드 모음

        const codeParser = (_prefix) => {
            var expTrcode = null;
            var trcodes = null;

            switch (parserType) {
                case "1": {
                    expTrcode = new RegExp(`_sTrcode: "${_prefix}[0-9]*"`, "gi");
                    trcodes = file.match(expTrcode) || [];
                    break;
                }
                case "2": {
                    expTrcode = new RegExp(`// ${_prefix}[0-9]* ::.*`, "gi");
                    trcodes = file.match(expTrcode) || [];
                    break;
                }
            }

            matchTrcodes = [ ...matchTrcodes, ...trcodes ];
        };

        // prefix가 배열일 경우 모든 케이스에 대해서 추출
        if (prefix instanceof Array) {
            prefix.forEach(codeParser);
        }
        else {
            codeParser(prefix);
        }

        // 매칭된 Trcode 목록을 데이터 형식으로 가공
        matchTrcodes.forEach((trcode) => {
            let code = "";
            let name = "";

            switch (parserType) {
                case "1": { // FIXME 코드와 코드 명칭 분리
                    code = trcode.replace(/_sTrcode: "/gi, "").replace(/"/gi, "");
                    name = "";
                    break;
                }
                case "2": {
                    code = trcode.split(" :: ")[0].replace(/\/\/ /gi, "");
                    name = trcode.split(" :: ")[1].replace(/\r/gi, "").replace(/\n/gi, "");
                    break;
                }
            }

            // 등록 코드목록에 해당 코드가 없는 경우 codeList에 추가
            if (existCodes.indexOf(code) === -1) {
                codeList.push({
                    code,
                    name
                });

                existCodes.push(code);
            }
        });

        // 코드값으로 오름차순 정렬
        codeList = codeList.sort((a, b) => {
            var order = 1; // 1: 오름차순, -1: 내림차순
            var x = a.code.toUpperCase();
            var y = b.code.toUpperCase();

            return x > y ? order : x < y ? -order : 0;
        });

        /**
         * 추출 정보를 가공하여 변수에 입력
         */
        fileInfoList.push({
            page: fileName.replace(".js", ""),
            title: matchTitle[0].replace("@title", "").trim(),
            trcodes: codeList
        });
    });

    /**
     * 파일 생성
     */

    // 결과물 폴더가 없을 경우 생성
    !fs.existsSync("output") && fs.mkdirSync("output");

    /** 원본 데이터인 Json 오브젝트 형식의 파일 생성 */
    fs.writeFile("output/trcodes.json", JSON.stringify(fileInfoList, null, "    "), (err) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log("\x1b[32m%s\x1b[0m", "[ output/trcodes.json ] JSON 파일 생성 성공\n");
        }
    });

    /** 모든 전문 엑셀형식 파일 생성 */
    let excelFormat01 = "";
    let codes = [];

    fileInfoList.forEach((fileInfo) => {
        codes = [ ...codes, ...fileInfo.trcodes ];
    });

    // 코드값으로 오름차순 정렬
    codes = codes.sort((a, b) => {
        var order = 1; // 1: 오름차순, -1: 내림차순
        var x = a.code.toUpperCase();
        var y = b.code.toUpperCase();

        return x > y ? order : x < y ? -order : 0;
    });

    // 중복 제거
    codes = codes.filter((a, idx, arr) => {
        return idx === arr.findIndex((b) => a.code === b.code);
    });

    codes.forEach((codeInfo) => {
        excelFormat01 += `${codeInfo.code}\t`;
        excelFormat01 += `${codeInfo.name}\n`;
    });

    // 엑셀 복사 & 붙여넣기용 파일 생성
    fs.writeFile("output/trcodes.excel.txt", excelFormat01, (err) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log("\x1b[32m%s\x1b[0m", "[ output/trcodes.excel.txt ] 엑셀형식 Text 파일 생성 성공\n");
        }
    });

    /** 화면별 사용 전문 엑셀형식 파일 생성 */
    let excelFormat02 = "";

    fileInfoList.forEach((fileInfo) => {
        excelFormat02 += `${fileInfo.title}\t${fileInfo.page}\t`;
        // 코드
        excelFormat02 += "\"";
        excelFormat02 += fileInfo.trcodes.map((item) => item.code).join("\n");
        excelFormat02 += "\"\t";
        // 코드명칭
        excelFormat02 += "\"";
        excelFormat02 += fileInfo.trcodes.map((item) => item.name).join("\n");
        excelFormat02 += "\"\n";
    });

    // 엑셀 복사 & 붙여넣기용 파일 생성
    fs.writeFile("output/page-trcodes.excel.txt", excelFormat02, (err) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log("\x1b[32m%s\x1b[0m", "[ output/page-trcodes.excel.txt ] 엑셀형식 Text 파일 생성 성공\n");
        }
    });
});