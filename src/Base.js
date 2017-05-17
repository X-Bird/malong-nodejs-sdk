import { fs } from 'fs';
import { Bluebird } from 'bluebird';
import { _ } from 'lodash';
import { md5 } from 'md5';

const readFile = Bluebird.promisify(fs.readFile);
const writeFile = Bluebird.promisify(fs.writeFile);

class Base {
    constructor(accessKeyId, secretKey) {

        this.accessKeyId = accessKeyId;
        this.secretKey = secretKey;
        caFile = path.resolve(__dirname, 'ssl/ca.cert.pem')

        this.initialize();

        this.curlOpt = [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_CAINFO => __DIR__.'/ca.pem',
        ];



    }

    initialize() {
        // $this->method = 'POST';

        // $this->headers = [
        //     'x-ca-version' => 1,
        //     'x-ca-accesskeyid' => $this->access_key_id,
        //     'x-ca-timestamp' => time(),
        //     'x-ca-signaturenonce' => $this->generateNonce(16),
        //     'user-agent' => "ProductAI-SDK-PHP/{$this->version()} (+http://www.productai.cn)",
        // ];

        // $this->body = [];

        // $this->batchSetProperties([
        //     'curl_info',
        //     'curl_errno',
        //     'curl_error',
        //     'curl_output',

        //     'tmpfile',
        // ], null);

        this.method = 'POST';
        this.headers = {
            'x-ca-version': 1,
            'x-ca-accesskeyid': this.accessKeyId,
            'x-ca-timestamp': Math.floor(new Date() / 1000),
            'x-ca-signaturenonce': this.generateNonce(16),
            'user-agent': `ProductAI-SDK-NODEJS/${this.version()} (+http://www.productai.cn)`,
        }
    }

    getCaFile(path) {
        let caFile = path.resolve(__dirname, path);
        return fs.readFileSync(caFile);
    }

    batchSetProperties(properties, value) {
        //     protected function batchSetProperties($properties, $value)
        // {
        //     foreach ($properties as $v) {
        //         $this->$v = $value;
        //     }
        // }

    }
    version() { }
    api() { }

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

    signRequests() { }
    curl(serviceType, serviceId) { }

    /**
     * 
     * @param {array} arr 
     */
    async convertArrayToCSV(arr) {

        let path, tmpfile;

        for (let i = 0; i < arr.length; i++) {

            if (_.isArray(arr[i])) {
                if (_.isArray(arr[i][2])) {
                    arr[i][2] = arr[i][2].join('|');
                }
                arr[i] = arr[i].join(',');
            }
        }

        path = '/tmp/' + md5(`${new Date()}${Math.random()}`);
        tmpfile = await writeFile(path, arr.join('\n'));

        return path;
    }
}

export { Base };