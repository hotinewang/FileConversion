/**
 * FileNameConverter可以将指定目录中的全部文件名称中的IMG_、VID_、mmexport字符去掉。\n如果使用脚本所在的路径，可直接输入:./
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

function renameFiles(dirPath, traverseSubfolders) {
    fs.readdir(dirPath, { withFileTypes: true }, (err, files) => {
        if (err) {
            console.error(`读取目录时出错: ${err}`);
            return;
        }

        files.forEach(dirent => {
            const filePath = path.join(dirPath, dirent.name);
            if (dirent.isDirectory() && traverseSubfolders) {
                renameFiles(filePath, traverseSubfolders);
            } else if (dirent.isFile()) {
                const prefixes = ['IMG_', 'VID_', 'mmexport'];
                const prefix = prefixes.find(p => dirent.name.startsWith(p));
                if (prefix) {
                    const newFilePath = path.join(dirPath, dirent.name.slice(prefix.length));
                    fs.rename(filePath, newFilePath, err => {
                        if (err) {
                            console.error(`重命名文件 ${dirent.name} 时出错: ${err}`);
                        } else {
                            console.log(`已重命名文件: ${dirent.name} -> ${dirent.name.slice(prefix.length)}`);
                        }
                    });
                }
            }
        });
    });
}

console.log("FileNameConverter可以将指定目录中的全部文件名称中的IMG_、VID_、mmexport字符去掉。\n如果使用脚本所在的路径，可直接输入:./");
readline.question('请输入目录路径: ', (dirPath) => {
    fs.access(dirPath, fs.constants.F_OK, (err) => {
        if (err) {
            console.error(`路径 ${dirPath} 不存在`);
            readline.close();
            return;
        }

        readline.question('是否遍历子文件夹? (y/n): ', (answer) => {
            const traverseSubfolders = answer.toLowerCase() === 'y';
            renameFiles(dirPath, traverseSubfolders);
            readline.close();
        });
    });
});