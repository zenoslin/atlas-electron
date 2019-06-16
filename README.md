# atlas-electron

[![GitHub release](https://img.shields.io/badge/release-v0.1.0-blue.svg)](https://github.com/zenoslin/atlas-electron/releases)

A atlas tools build by `electron` + `node.js`.

To pack `png` & `jpg` to atlas

## How to start

``` -shell
git clone https://github.com/zenoslin/atlas-electron.git
npm install
npm run start
```

## about animation atlas

路径不可以有中文
打包序列帧动画图集时，要求打包时文件夹内png用{0.png，1.png...}命名  
并用以下js代码分解分base64的图片数组

## correlation
github：[分解图集](https://github.com/zenoslin/javascript-demo/tree/master/JavaScript/%E5%9B%BE%E9%9B%86%E5%88%86%E8%A7%A3)
github：[图集播放](https://github.com/zenoslin/atlasPlayer)
