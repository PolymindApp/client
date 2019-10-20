import Jimp from 'jimp';

const $crop = {};

$crop.install = function (Vue) {

	Vue.prototype.$crop = function(images, dimensions = [256, 256]) {

		return new Promise((resolve, reject) => {
			let croppedImages = [];
			let count = 0;
			images.forEach(image => {

				let reader = new FileReader();
				reader.readAsDataURL(image);
				reader.onload = function(evt) {
					if (evt.target.readyState == FileReader.DONE) {
						Jimp.read(evt.target.result).then(img => {
							img.cover(dimensions[0], dimensions[1]);
							img.getBase64Async(image.type).then(base64 => {

								fetch(base64)
									.then(res => res.arrayBuffer())
									.then(buf => new File([buf], image.name, {type:image.type}))
									.then(file => {
										croppedImages.push(file);
										count++;
										if (count === images.length) {
											resolve(croppedImages);
										}
									});
							});
						}).catch(reject);
					}
				};
			});
		});
	}
}

export default $crop;
