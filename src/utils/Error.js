import Form from "./Form";
import ServerError from "./ServerError";

const $error = {};

$error.install = function (Vue, options) {

	Vue.prototype.$handleError = function(vm, error) {

		if (typeof error === 'string') {
			return vm.$root.error = new ServerError(vm, error);
		} else if (typeof error.data === 'string') {
			return vm.$root.error = new ServerError(vm, error.data);
		} else if (typeof error.code === 'number') {
			return vm.$root.error = new ServerError(vm, error);
		} else if (error.fields) {
			vm.formErrors = Form.applyErrors(vm, error.fields, vm.$refs);
		} else if (error.message) {
			vm.$root.error = new ServerError(vm, error);
		}
	};
}

export default $error;
