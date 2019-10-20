import Form from "./Form";
import ServerError from "./ServerError";

const $error = {};

$error.install = function (Vue, options) {

	Vue.prototype.$handleError = function(vm, error) {

		if (typeof error === 'string') {
			return vm.$root.error = new ServerError(vm, error);
		} else if (typeof error.data === 'string') {
			return vm.$root.error = new ServerError(vm, error.data);
		}else if (error.data.fields) {
			vm.formErrors = Form.applyErrors(vm, error.data.fields, vm.$refs);
		} else if (error.data.message) {
			vm.$root.error = new ServerError(vm, error);
		}
	};
}

export default $error;
