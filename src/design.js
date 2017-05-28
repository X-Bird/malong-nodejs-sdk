import {Api} from './Api';

let a = new Api(accessKeyId, secretKey);

a.searchImgByUrl(url, serviceType, serviceId, loc = [], tags = [], count = 20, threshold = 0.0);
a.searchImgByPostFile(img, serviceType, serviceId, loc = [], tags = [], count = 20, threshold = 0.0);
a.addImgToSet(setId, img_url, meta = '', tags = []);
a.addImgsToSet(setId, imgs);
a.removeImgsFromSet(setId, imgs);
// searchImage($service_type, $service_id, $image, $loc = [], $tags = [], $count = 20, $threshold = 0.0)
// addImageToSet($set_id, $image_url, $meta = '', $tags = [])
// addImagesToSet($set_id, $images)
// removeImagesFromSet($set_id, $images)

