import {Api} from './Api';

let a = new Api(accessKeyId, secretKey);

a.searchImage();
// searchImage($service_type, $service_id, $image, $loc = [], $tags = [], $count = 20, $threshold = 0.0)
// addImageToSet($set_id, $image_url, $meta = '', $tags = [])
// addImagesToSet($set_id, $images)
// removeImagesFromSet($set_id, $images)

