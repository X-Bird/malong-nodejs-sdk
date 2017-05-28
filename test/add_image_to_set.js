const CFG = require('../config');
const Malong = require('../index');

let malong = new Malong(CFG.accessKeyId, CFG.secretKey);

(async function(){
    try {
        let result = await malong.addImageToSet(CFG.setId, 'http://img.alicdn.com/bao/uploaded/i2/TB1U4QaPVXXXXc4XVXXXXXXXXXX_!!0-item_pic.jpg_400x400.jpg', '123123123');
        console.log(result);
    }
    catch(e){
        console.log(e);
    }
})();
