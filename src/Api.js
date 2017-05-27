// import { Base } from './Base';
const Bluebird = require('bluebird');
const request = require('request');
const fs = require('fs');
const crypto = require('crypto');
const qs = require('qs');
const _ = require('lodash');
const ksort = require('locutus/php/array/ksort');

class Api {

    constructor(accessKeyId, secretKey) {


        this.VERSION = '0.1.3';
        this.API = 'https://api.productai.cn';

        this.body = {
            // url
            // loc
            // tags
            // count
            // threshold
        };
        this.headers = {
            'x-ca-version': 1,
            'x-ca-accesskeyid': accessKeyId,
            'x-ca-timestamp': Math.floor(new Date() / 1000),
            'x-ca-signaturenonce': this.generateNonce(16),
            'requestmethod': 'POST',
            'user-agent': `ProductAI-SDK-NODEJS/${this.VERSION} (+http://www.productai.cn)`,
        };

        this.accessKeyId = accessKeyId;
        this.secretKey = secretKey;

    }

    /**
     * return random string with fix length
     * 
     * @param {number} len 
     * @param {string} chars 
     */
    generateNonce(len, chars = '') {

        let text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < len; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

    // searchImage($service_type, $service_id, $image, $loc = [], $tags = [], $count = 20, $threshold = 0.0)
    // addImageToSet($set_id, $image_url, $meta = '', $tags = [])
    // addImagesToSet($set_id, $images)
    // removeImagesFromSet($set_id, $images)

    /**
     * 
     * @param {string} url
     * @param {string} serviceType  @KH 说是这个 service_type ：search
     * @param {string} serviceId 
     * @param {array} loc 
     * @param {array} tags 
     * @param {number} count 
     * @param {float} threshold 
     */
    searchImgByUrl(url, serviceType, serviceId, loc = [], tags = [], count = 20, threshold = 0.0) {

        let opts = {};

        if (/^(http|https|ftp)/.test(url)) {
            // this is a url
            opts.url = url;
        }
        else {
            throw new Error('This is not a valid image url, query abort');
        }

        if (_.isArray(loc) && !_.isEmpty(loc)) {
            opts.loc = loc.join('-');
        }

        if (_.isArray(loc) && !_.isEmpty(tags)) {
            opts.tags = tags.join('|');
        }

        if (count) {
            opts.count = Math.floor(count);
        }

        if (threshold && _.isNumber(threshold)) {
            opts.threshold = threshold;
        }

        this.body = opts;

        return this.sendRequest(opts, serviceType, serviceId);

        // return this.searchImage(serviceType, serviceId, url, loc, tags, count, threshold);
    }

    // searchImgByFile(img, serviceType, serviceId, loc = [], tags = [], count = 20, threshold = 0.0) {
    //     return this.searchImage(serviceType, img, url, loc, tags, count, threshold);
    // }

    sendRequest(opts, serviceType, serviceId) {
        return new Bluebird(function (resolve, reject) {
            this.headers['x-ca-signature'] = this.signRequest();
            request({
                url: `${this.API}/${serviceType}/${serviceId}`,
                method: 'POST',
                headers: this.headers,
                form: this.body,
                timeout: 10000
            }, function (err, resp, body) {
                if (err) {
                    return reject(err);
                }

                if (resp.statusCode === 200) {
                    // todo: success
                    return resolve(body);
                }
                else {
                    // todo: api server return something wrong about this query
                    return reject(body);
                }
            });
        }.bind(this));
    }

    signRequest() {
        let obj = {};
        _.extend(obj, this.body, this.headers);
        _.unset(obj, 'user-agent');

        
        ksort(obj);
        // console.log(obj);
        

        // let sortedObj = _.sortBy(obj, [function(o) { return Object.values(o)[0] }]);

        // console.log(sortedObj);

        let queryString = qs.stringify(obj);
        queryString = decodeURIComponent(queryString);

        

        // _.sortBy(quey)

        return crypto.createHmac('sha1', this.secretKey)
            .update(queryString)
            .digest()
            .toString('base64');
    }


    /**
     * 
     * @param {string} set_id 
     * @param {string} image_url 
     * @param {string} meta 
     * @param {array} tags 
     */
    addImageToSet($set_id, $image_url, $meta = '', $tags = []) { }

    /**
     * 
     * @param {string} set_id 
     * @param {array} images 
     */
    addImagesToSet($set_id, $images) { }

    /**
     * 
     * @param {string} set_id 
     * @param {array} images 
     */
    removeImagesFromSet($set_id, $images) { }
}


module.exports = Api;