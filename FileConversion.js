/*
这是Nodejs批处理版本
用法：
node batchFileProcessor.js
这个脚本会提示用户输入要批处理的文件夹路径，然后对指定文件夹中的所有文件，对每个文件的前100字节进行逆序处理，并直接覆盖原文件。请确保在运行脚本之前备份重要数据，以防止意外的数据丢失。
尽量不要批处理脚本所在文件夹的数据。因为会把脚本文件一并转换。
*/

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function promptForFolderPath() {
    rl.question('请输入要处理的文件夹路径: ', (folderPath) => {
        // 检查文件夹是否存在
        if (!fs.existsSync(folderPath) || !fs.statSync(folderPath).isDirectory()) {
            console.log(`文件夹 ${folderPath} 不存在或不是目录。请重试。`);
            promptForFolderPath();
        } else {
            processFolder(folderPath);
        }
    });
}

promptForFolderPath();

function processFolder(folderPath) {
    // 读取文件夹中的所有文件
    fs.readdir(folderPath, (err, files) => {
        if (err) {
            console.error('读取目录时出错:', err);
            promptForFolderPath();
            return;
        }

        let processedCount = 0;
        const totalFiles = files.length;

        files.forEach(file => {
            const filePath = path.join(folderPath, file);

            // 检查是否为文件
            if (fs.statSync(filePath).isFile()) {
                processFile(filePath, () => {
                    processedCount++;
                    if (processedCount === totalFiles) {
                        promptToExit();
                    }
                });
            } else {
                processedCount++;
                if (processedCount === totalFiles) {
                    promptToExit();
                }
            }
        });

        if (totalFiles === 0) {
            promptToExit();
        }
    });
}

function processFile(filePath, callback) {
    fs.readFile(filePath, (err, data) => {
        if (err) {
            console.error(`读取文件 ${filePath} 时出错:`, err);
            callback();
            return;
        }

        if (data.length < 100) {
            console.log(`【提示】文件 ${filePath} 太小无法处理！`);
            callback();
            return;
        }

        const first100Bytes = data.slice(0, 100);
        const reversedBytes = first100Bytes.reverse();

        const modifiedData = Buffer.concat([reversedBytes, data.slice(100)]);

        fs.writeFile(filePath, modifiedData, (err) => {
            if (err) {
                console.error(`写入文件 ${filePath} 时出错:`, err);
                callback();
                return;
            }

            console.log(`已处理并保存文件: ${filePath}`);
            callback();
        });
    });
}

function promptToExit() {
    const rlExit = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rlExit.question('按任意键退出程序...', () => {
        rlExit.close();
        process.exit(0);
    });
}