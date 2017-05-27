import { Base } from './Base';
import { Bluebird } from 'bluebird';
import { request } from 'request';
import { fs } from 'fs';


class Api extends Base {
    constructor(accessKeyId, secretKey) {
        super(accessKeyId, secretKey);

    }

    // searchImage($service_type, $service_id, $image, $loc = [], $tags = [], $count = 20, $threshold = 0.0)
    // addImageToSet($set_id, $image_url, $meta = '', $tags = [])
    // addImagesToSet($set_id, $images)
    // removeImagesFromSet($set_id, $images)

    searchImgByUrl(url, serviceType, serviceId, loc = [], tags = [], count = 20, threshold = 0.0) {
        return this.searchImage(serviceType, serviceId, url, loc, tags, count, threshold);
    }

    // searchImgByFile(img, serviceType, serviceId, loc = [], tags = [], count = 20, threshold = 0.0) {
    //     return this.searchImage(serviceType, img, url, loc, tags, count, threshold);
    // }

    // sendRequest(opts) {
    //     return new Bluebird(function (resolve, reject) {
    //         request({
    //             url: opts.url
    //         })
    //     });
    // }

    /**
     * 
     * @param {string} serviceType  @KH 说是这个 service_type ：search
     * @param {string} serviceId 
     * @param {file|string} imageOrUrl 
     * @param {array} loc 
     * @param {array} tags 
     * @param {number} count 
     * @param {float} threshold 
     */
    searchImage(serviceType, serviceId, imageOrUrl, loc = [], tags = {}, count = 20, threshold = 0.0) {
        // $prefix = substr($image, 0, 1);

        // switch ($prefix) {
        //     case '#':
        //     case '@':
        //         $image = substr($image, 1);

        //         if ($prefix == '#') {
        //             if (!isset($_FILES[$image])) {
        //                 throw new OutOfBoundsException("name $image not found in forms", 1);
        //             }

        //             $image = $_FILES[$image]['tmp_name'];

        //             if (!is_uploaded_file($image)) {
        //                 throw new UnexpectedValueException("possible file upload attack: $image", 1);
        //             }
        //         }

        //         $this ->body['search'] = new CURLFile($image);

        //         break;

        //     default:
        //         if (substr($image, 0, 4) == 'http' || substr($image, 0, 3) == 'ftp') {
        //             $this ->body['url'] = $image;
        //         } else {
        //             $this ->tmpfile = tmpfile();
        //             fwrite($this ->tmpfile, $image);

        //             $this ->body['search'] = new CURLFile(stream_get_meta_data($this ->tmpfile)['uri']);
        //         }

        //         break;
        // }

        let opts = {};

        if (/^(http|https|ftp)/.test(imageOrUrl)) {
            // this is a url
            opts.url = imageOrUrl;
        }
        else {
            // this is a file path
            // todo: write file to somewhere
            // todo: get the path
            opts.search = fs.createReadStream(path);
        }

        // if ($loc) {
        //     $this ->body['loc'] = is_array($loc) ? implode('-', $loc) : $loc;
        // }

        if (loc) {
            if (_.isArray(loc)) {
                opts.loc = loc.join('-');
            }
            else {
                opts.loc = loc;
            }
        }

        // if ($tags) {
        //     if (is_array($tags)) {
        //         $this ->body['tags'] = is_array(reset($tags)) ? json_encode($tags) : implode('|', $tags);
        //     } else {
        //         $this ->body['tags'] = $tags;
        //     }
        // }

        if (!_.isEmpty(tags)) {
            opts.tags = JSON.stringify(tags);
        }

        // if ($count) {
        //     $this ->body['count'] = intval($count);
        // }

        if (count) {
            opts.count = Math.floor(count);
        }

        // if ($threshold && is_numeric($threshold)) {
        //     $this ->body['threshold'] = $threshold;
        // }

        if (threshold && _.isNumber(threshold)) {
            opts.threshold = threshold;
        }

        return this.sendRequest(opts);
        // return (async function() {})()
        // return $this ->curl($service_type, $service_id);
    }

    /**
     * 
     * @param {string} set_id 
     * @param {string} image_url 
     * @param {string} meta 
     * @param {array} tags 
     */
    addImageToSet($set_id, $image_url, $meta = '', $tags = [])

    /**
     * 
     * @param {string} set_id 
     * @param {array} images 
     */
    addImagesToSet($set_id, $images)

    /**
     * 
     * @param {string} set_id 
     * @param {array} images 
     */
    removeImagesFromSet($set_id, $images)
}

