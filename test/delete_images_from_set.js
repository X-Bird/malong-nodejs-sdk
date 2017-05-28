const CFG = require('../config');
const Malong = require('../index');

let malong = new Malong(CFG.accessKeyId, CFG.secretKey);

(async function(){
    try {
        let data = [
            'http://img.alicdn.com/bao/uploaded/i2/TB1U4QaPVXXXXc4XVXXXXXXXXXX_!!0-item_pic.jpg_400x400.jpg,23421234',
            'http://img.alicdn.com/bao/uploaded/i2/TB1EAeeKXXXXXbhXFXXXXXXXXXX_!!0-item_pic.jpg_400x400.jpg,341324312',
            'http://img.alicdn.com/bao/uploaded/i1/782591635/TB204m_mFXXXXcUXXXXXXXXXXXX_!!782591635.jpg_400x400.jpg,341324312',
            'http://img.alicdn.com/bao/uploaded/i1/TB1BVZEQXXXXXc1XXXXXXXXXXXX_!!0-item_pic.jpg_400x400.jpg,399924312'
        ];

        let result = await malong.removeImagesFromSet(CFG.setId, data, '/tmp');
        console.log(result);
    }
    catch(e){
        console.log(e);
    }
})();
