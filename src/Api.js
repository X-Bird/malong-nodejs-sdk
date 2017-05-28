// import { Base } from './Base';
const Bluebird = require('bluebird');
const request = require('request');
const fs = require('fs');
const crypto = require('crypto');
const qs = require('qs');
const _ = require('lodash');
const md5 = require('md5');
const ksort = require('locutus/php/array/ksort');

const REQUEST_TIMEOUT = 10000;
const writeFile = Bluebird.promisify(fs.writeFile);
const readFile = Bluebird.promisify(fs.readFile);
const unlink = Bluebird.promisify(fs.unlink);

class Api {

    constructor(accessKeyId, secretKey) {


        this.VERSION = '0.1.3';
        this.API = 'https://api.productai.cn';

        this.body = {};
        this.formData = {};

        this.headers = {
            'x-ca-version': 1,
            'x-ca-accesskeyid': accessKeyId,
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
        this.formData = {};

        this.signRequest();

        let requestOptions = {
            url: `${this.API}/${serviceType}/${serviceId}`,
            method: 'POST',
            headers: this.headers,
            form: this.body,
            timeout: REQUEST_TIMEOUT
        };

        return this.sendRequest(requestOptions);

        // return this.searchImage(serviceType, serviceId, url, loc, tags, count, threshold);
    }

    sendRequest(opts) {

        return new Bluebird(function (resolve, reject) {

            request(opts, function (err, resp, body) {
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

        this.headers['x-ca-timestamp'] = Math.floor(new Date() / 1000);
        this.headers['x-ca-signaturenonce'] = this.generateNonce(16);
        // this.headers['x-ca-signature'] = this.signRequest();

        let obj = {};
        _.extend(obj, this.body, this.headers);
        _.unset(obj, 'user-agent');
        _.unset(obj, 'x-ca-signature');

        ksort(obj);

        let queryString = qs.stringify(obj);
        queryString = decodeURIComponent(queryString);

        this.headers['x-ca-signature'] = crypto.createHmac('sha1', this.secretKey)
            .update(queryString)
            .digest()
            .toString('base64');
    }

    /**
     * 
     * @param {string} setId 
     * @param {string} imageUrl 
     * @param {string} meta 
     * @param {array} tags 
     */
    addImageToSet(setId, imageUrl, meta = '', tags = []) {

        let opts = {};

        if (/^(http|https|ftp)/.test(imageUrl)) {
            opts.image_url = imageUrl;
        }
        else {
            throw new Error('This is not a valid image url, query abort');
        }

        if (!_.isEmpty(meta)) {
            opts.meta = meta;
        }

        if (_.isArray(tags) && !_.isEmpty(tags)) {
            opts.tags = tags.join('|');
        }

        this.body = opts;
        this.formData = {};

        this.signRequest();

        let requestOptions = {
            url: `${this.API}/image_sets/_0000014/${setId}`,
            method: 'POST',
            headers: this.headers,
            form: this.body,
            timeout: REQUEST_TIMEOUT
        };

        return this.sendRequest(requestOptions);
    }

    /**
     * 
     * @param {string} setId 
     * @param {array} images 
     * @param {string} tmpPath
     */
    async addImagesToSet(setId, images, tmpPath) {

        let formData = {};
        let randomFileName = md5(new Date() + '.' + Math.random()) + '.csv';

        // debug
        // console.log(`${tmpPath}/${randomFileName}`);

        if (_.isArray(images) && !_.isEmpty(images)) {
            await writeFile(`${tmpPath}/${randomFileName}`, images.join('\n'));
        }
        else {
            throw new TypeError('callling addImagesToSet with image arguments is not an array');
        }

        let f = fs.createReadStream(`${tmpPath}/${randomFileName}`);

        formData = {
            urls_to_add: f
        };

        this.body = {};
        this.formData = formData;

        this.signRequest();

        let requestOptions = {
            url: `${this.API}/image_sets/_0000014/${setId}`,
            method: 'POST',
            headers: this.headers,
            // form: this.body,
            formData: this.formData,
            timeout: REQUEST_TIMEOUT
        };

        return this.sendRequest(requestOptions)
            .then(async function (d) {
                f.close();
                try { await unlink(`${tmpPath}/${randomFileName}`); }
                catch (e) {
                    // do nothing
                }

                return d;
            });

    }

    /**
     * 
     * @param {string} setId 
     * @param {array} images 
     * @param {string} tmpPath
     */
    async removeImagesFromSet(setId, images, tmpPath) {
        let formData = {};
        let randomFileName = md5(new Date() + '.' + Math.random()) + '.csv';

        // debug
        // console.log(`${tmpPath}/${randomFileName}`);

        if (_.isArray(images) && !_.isEmpty(images)) {
            await writeFile(`${tmpPath}/${randomFileName}`, images.join('\n'));
        }
        else {
            throw new TypeError('callling addImagesToSet with image arguments is not an array');
        }

        let f = fs.createReadStream(`${tmpPath}/${randomFileName}`);

        formData = {
            urls_to_delete: f
        };

        this.body = {};
        this.formData = formData;

        this.signRequest();

        let requestOptions = {
            url: `${this.API}/image_sets/_0000014/${setId}`,
            method: 'POST',
            headers: this.headers,
            // form: this.body,
            formData: this.formData,
            timeout: REQUEST_TIMEOUT
        };

        return this.sendRequest(requestOptions)
            .then(async function (d) {
                f.close();
                try { await unlink(`${tmpPath}/${randomFileName}`); }
                catch (e) {
                    // do nothing
                }

                return d;
            });
    }
}


module.exports = Api;