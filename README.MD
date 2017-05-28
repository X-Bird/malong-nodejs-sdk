## 码隆科技 nodejs sdk

## 安装
* npm install malong-nodejs-sdk --save

## 使用
#### 初始化
```nodejs
const Malong = require('malong-nodejs-sdk');

let productAi = new Malong(accessKeyId, secretKey);
```
#### 使用图像url搜索
```nodejs
let result = productAi.searchImageByUrl(url, serviceType, serviceId, loc, tags, count, threshold);
```
* `url`: 必选 图片url
* `serviceType`: 必选 服饰搜索的是search, 其他类型服务的参数查看 码隆后台测服服务 页面
* `serviceId`: 必选 服务id
* `loc`: 可选，默认为整张图片。用于搜索的图片区域，格式为 [x, y, w, h].
* `tags`: 可选，默认为 []。用于筛选搜索结果的标签。
* `count`: 可选，默认为 20。 设置返回结果的数量，值为 0 到 100，公共服务不支持此参数。
* `threshold`: 可选，默认为 0。设置返回结果的阈值， 值为 0 到 1，不建议设置此参数。

#### 上传一张图片到数据集
```nodejs
let result = productAi.addImageToSet(setId, imageUrl, 'optional meta like some id', [
    'optional tag 1',
    'optional tag 2',
]);
```

#### 上传多张图片到数据集
```nodejs
let result = productAi.addImagesToSet(setId, [
    'image_url,123123123,比啊的说法|啊等发达省份|阿德法',
    'image_url,123123123,比啊的说法|啊等发达省份|阿德法',
    'image_url,123123123,比啊的说法|啊等发达省份|阿德法'
], tmpPath);
```
* `tmpPath`: 必选 存放临时文件的可写文件路径，如`/tmp`

#### 从数据集删除多张图片
```nodejs
let result = productAi.removeImagesFromSet(setId, [
    'image_url,123123123,比啊的说法|啊等发达省份|阿德法',
    'image_url,123123123,比啊的说法|啊等发达省份|阿德法',
    'image_url,123123123,比啊的说法|啊等发达省份|阿德法'
], tmpPath);
```
* `tmpPath`: 必选 存放临时文件的可写文件路径，如`/tmp`


#### 测试
* 在本项目根目录创建配置文件 `config.js`
```nodejs
module.exports = {
    serviceId: 'asdfadsf',
    setId: 'asdfadsf',
    accessKeyId: 'asdfasdfasdfasdfasdf',
    secretKey: 'asdfasdfasdfasdfadsfa'
};
```
* `cd test`
* `node search.js` 测试搜索
* `node add_image_to_set.js` 测试添加一条数据到数据集
* `node add_images_to_set.js` 测试添加多条数据到数据集
* `node delete_images_from_set.js` 从数据集删除多条数据
