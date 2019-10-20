<template>
	<v-sheet>
		HISTORY
	</v-sheet>
</template>

<script>
import Vue from 'vue';
import File from "../../../utils/File";
import UserAvatar from "../../../components/UserAvatar";
import FileService from "../../../services/File";
import ProfileService from "../../../services/Profile";

export default Vue.extend({

	props: ['user'],

	methods: {

	},

	data: function() {
		return {
			histories: [],
		}
	},
});
</script>

<style lang="scss" scoped>

</style>
