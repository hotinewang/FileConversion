# Hotine的FileConverter说明

这只是一个【自用】的文件转换小工具。用于把一个有效文件，转换成无法正常读取的无效文件。或者把生成的无效文件还原回原来的样子。

全部代码都是由AI（Qwen2.5-Coder-Artifacts）生成的。

## 算法
把一个文件的前100个字符进行逆序操作，破坏文件头信息，使其无法被其他程序正常解析。

## 文件说明

+ FileConverter.html 是离线网页版。只能处理单个文件。自带预览功能（仅针对图片和视频文件）。

+ FileConverter.js 是Nodejs版本。批处理用的。指定一个文件夹，会把文件夹内的全部文件都进行转换。

+ FileConverter-win.exe 是用pkg打包的windows x64版本，下载双击直接使用。

+ FileConverter-linux和FileConverter-macos 使用pkg打包的Linux和Macos版本。没有测试环境，我也不知道能不能用。