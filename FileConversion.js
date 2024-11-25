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

rl.question('输入要批处理的文件所在的【文件夹】路径: ', (folderPath) => {
    rl.close();

    // 检查文件夹是否存在
    if (!fs.existsSync(folderPath)) {
        console.log(`文件夹 ${folderPath} 不存在！退出。`);
        process.exit(1);
    }

    // 读取文件夹中的所有文件
    fs.readdir(folderPath, (err, files) => {
        if (err) {
            console.error('读取路径出错：:', err);
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
});

function processFile(filePath) {
    fs.readFile(filePath, (err, data) => {
        if (err) {
            console.error(`读取文件出错 ${filePath}:`, err);
            return;
        }

        if (data.length < 100) {
            console.log(`【提示】文件 ${filePath} 太小，无法处理，已跳过。`);
            return;
        }

        const first100Bytes = data.slice(0, 100);
        const reversedBytes = first100Bytes.reverse();

        const modifiedData = Buffer.concat([reversedBytes, data.slice(100)]);

        fs.writeFile(filePath, modifiedData, (err) => {
            if (err) {
                console.error(`写入文件出错 ${filePath}:`, err);
                return;
            }

            console.log(`已处理文件： ${filePath}`);
        });
    });
}