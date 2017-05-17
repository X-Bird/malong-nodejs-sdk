import { Base } from './Base';


class Api extends Base {
    constructor() {
        super();
    }

    // searchImage($service_type, $service_id, $image, $loc = [], $tags = [], $count = 20, $threshold = 0.0)
    // addImageToSet($set_id, $image_url, $meta = '', $tags = [])
    // addImagesToSet($set_id, $images)
    // removeImagesFromSet($set_id, $images)

    /**
     * 
     * @param {string} serviceType  @KH 说是这个 service_type ：search
     * @param {string} serviceId 
     * @param {file|string} image 
     * @param {array} loc 
     * @param {array} tags 
     * @param {number} count 
     * @param {float} threshold 
     */
    searchImage(serviceType, serviceId, image, loc = [], tags = [], count = 20, threshold = 0.0) {}

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

