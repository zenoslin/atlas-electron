# atlas-electron

[![GitHub release](https://img.shields.io/badge/release-v0.2.0-blue.svg)](https://github.com/zenoslin/atlas-electron/releases)

基于 `electron` 和 `node` 的图集打包工具

用于将 `png` 和 `jpg` 打包成图集

内核使用[LayaAir](https://github.com/layabox/layaair)中的图集打包内核`atlas-generator`

> v0.1.0 使用老版本的 atlasGenerator 会有打包图片 1px 像素误差的 bug
>
> v0.2.0 使用新版本的 atlasGenerator，并且不再打包 2 进制 pd 文件，如需打包 pd 文件可以 clone 分支[Ming](https://github.com/zenoslin/atlas-electron/tree/Ming)

由于新版本的 atlasGenerator 无法打包目标文件夹根目录下的图片

工具会把目标文件夹复制到工具目录下新建 temp 文件夹进行打包，打包完毕后进行删除

## How to start

```shell
git clone https://github.com/zenoslin/atlas-electron.git
npm install
npm run start
```

## about animation atlas

路径不可以有中文
打包序列帧动画图集时，要求打包时文件夹内 png 用{0.png，1.png...}命名
并用以下 js 代码分解分 base64 的图片数组，或者搭配图集播放食用

## correlation

- github：[分解图集](https://github.com/zenoslin/javascript-demo/tree/master/JavaScript/%E5%9B%BE%E9%9B%86%E5%88%86%E8%A7%A3)
- github：[图集播放](https://github.com/zenoslin/atlasPlayer)
