const glob = require("glob");
const path = require("path");
const fs = require("fs");

const config = require("./parser.config");
const dirname = config.dirname;
const prefix = config.prefix;
const ignoreFolderList = config.ignoreFolderList;
const contents = path.join(`../${dirname}`, "WebContent/contents/");
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
        let matchTrcodes = [];

        // prefix가 배열일 경우 모든 케이스에 대해서 추출
        if (prefix instanceof Array) {
            prefix.map((tr) => {
                var expTrcode = null;
                var trcodes = null;

                switch (parserType) {
                    case "1": {
                        expTrcode = new RegExp(`_sTrcode: "${tr}[0-9]*"`, "gi");
                        trcodes = file.match(expTrcode) || [];
                        break;
                    }
                    case "2": {
                        expTrcode = new RegExp(`// ${tr}[0-9]* :: `, "gi");
                        trcodes = file.match(expTrcode) || [];
                        break;
                    }
                }

                matchTrcodes = [ ...matchTrcodes, ...trcodes ];

                return tr;
            });
        }
        else {
            var expTrcode = null;
            var trcodes = null;

            switch (parserType) {
                case "1": {
                    expTrcode = new RegExp(`"${prefix}[0-9]*"`, "gi");
                    trcodes = file.match(expTrcode) || [];
                    break;
                }
                case "2": {
                    expTrcode = new RegExp(`// ${prefix}[0-9]* :: `, "gi");
                    trcodes = file.match(expTrcode) || [];
                    break;
                }
            }

            matchTrcodes = [ ...matchTrcodes, ...trcodes ];
        }

        // 중복 값 제거
        matchTrcodes = [ ...new Set(matchTrcodes) ];
        // 정렬
        matchTrcodes.sort();
        // 타입에 따른 부가내용 제거
        matchTrcodes = matchTrcodes.map((trcode) => {
            switch (parserType) {
                case "1": {
                    return trcode.replace(/_sTrcode: "/gi, "").replace(/"/gi, "");
                }
                case "2": {
                    return trcode.replace(/\/\/ /gi, "").replace(/ :: /gi, "");
                }
            }
        });

        /**
         * 추출 정보를 가공하여 변수에 입력
         */
        fileInfoList.push({
            page: fileName.replace(".js", ""),
            title: matchTitle[0].replace("@title", "").trim(),
            trcodes: matchTrcodes
        });
    });

    /**
     * 파일 생성
     */
    let excelFormat = "";

    fileInfoList.map((fileInfo) => {
        excelFormat += `${fileInfo.title}\t${fileInfo.page}\t`;
        excelFormat += "\"";
        excelFormat += fileInfo.trcodes.join("\n");
        excelFormat += "\"\n";

        return fileInfo;
    });

    // 결과물 폴더가 없을 경우 생성
    !fs.existsSync("output") && fs.mkdirSync("output");

    // 엑셀 복사 & 붙여넣기용 파일 생성
    fs.writeFile("output/trcodes.excel.txt", excelFormat, (err) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log("\x1b[32m%s\x1b[0m", "[ output/trcodes.excel.txt ] 엑셀형식 Text 파일 생성 성공\n");
        }
    });

    // Json 오브젝트 형식의 파일 생성
    fs.writeFile("output/trcodes.json", JSON.stringify(fileInfoList, null, "    "), (err) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log("\x1b[32m%s\x1b[0m", "[ output/trcodes.json ] JSON 파일 생성 성공\n");
        }
    });
});