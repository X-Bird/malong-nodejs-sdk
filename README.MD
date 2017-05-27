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
let result = productAi.searchImageByUrl(serviceType, serviceId, url, loc, tags, count, threshold);
```
* `loc`: 可选，默认为整张图片。用于搜索的图片区域，格式为 [x, y, w, h].
* `tags`: 可选，默认为 []。用于筛选搜索结果的标签。
* `count`: 可选，默认为 20。 设置返回结果的数量，值为 0 到 100，公共服务不支持此参数。
* `threshold`: 可选，默认为 0。设置返回结果的阈值， 值为 0 到 1，不建议设置此参数。

#### 使用图像文件进行搜索
```nodejs
let result = productAi->searchImageByFile(serviceType, serviceId, filePath, loc, tags, count, threshold);
```
* `filePath`: 图像文件的绝对路径

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
    {
        url: imageUrl_1,
        meta: 'optional meta 1',
        tags: [
            'optional tag 1',
            'optional tag 2',
        ],
    },
    {
        url: imageUrl_2,
        meta: 'optional meta 2',
        tags: [
            'optional tag 3',
            'optional tag 4',
        ],
    },
]);
```

#### 从数据集删除多张图片
```nodejs
let result = productAi.removeImagesFromSet(setId, [
    imageUrl_1,
    imageUrl_2,
]);
```

