/*
这是Nodejs批处理版本
用法：
node batchFileProcessor.js /path/to/your/folder
这个脚本会读取指定文件夹中的所有文件，对每个文件的前100字节进行逆序处理，并直接覆盖原文件。请确保在运行脚本之前备份重要数据，以防止意外的数据丢失。
*/

const fs = require('fs');
const path = require('path');

// 检查命令行参数
if (process.argv.length !== 3) {
    console.log('Usage: node batchFileProcessor.js <folder-path>');
    process.exit(1);
}

const folderPath = process.argv[2];

// 检查文件夹是否存在
if (!fs.existsSync(folderPath)) {
    console.log(`Folder ${folderPath} does not exist.`);
    process.exit(1);
}

// 读取文件夹中的所有文件
fs.readdir(folderPath, (err, files) => {
    if (err) {
        console.error('Error reading directory:', err);
        return;
    }

    files.forEach(file => {
        const filePath = path.join(folderPath, file);

        // 检查是否为文件
        if (fs.statSync(filePath).isFile()) {
            processFile(filePath);
        }
    });
});

function processFile(filePath) {
    fs.readFile(filePath, (err, data) => {
        if (err) {
            console.error(`Error reading file ${filePath}:`, err);
            return;
        }

        if (data.length < 100) {
            console.log(`File ${filePath} is too small to process.`);
            return;
        }

        const first100Bytes = data.slice(0, 100);
        const reversedBytes = first100Bytes.reverse();

        const modifiedData = Buffer.concat([reversedBytes, data.slice(100)]);

        fs.writeFile(filePath, modifiedData, (err) => {
            if (err) {
                console.error(`Error writing to file ${filePath}:`, err);
                return;
            }

            console.log(`Processed and saved file: ${filePath}`);
        });
    });
}