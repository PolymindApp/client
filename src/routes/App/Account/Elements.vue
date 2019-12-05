<template>
	<div>
		<v-card-title>{{ $t('account.activities.publicItems') }}</v-card-title>
		<v-alert v-if="components.data.length === 0" type="info" class="mb-6" transition="scale-transition" border="left" colored-border light elevation="2">
			{{$t('account.activities.publicItemsEmpty')}}
		</v-alert>
		<v-row>
			<v-col cols="12" md="4" :key="index" v-for="(component, index) in components.data">
				<Deck :model="component" />
			</v-col>
		</v-row>
	</div>
</template>

<script>
import Vue from 'vue';
import Deck from "../../../components/Deck";
import ComponentService from "../../../services/ComponentService";

export default Vue.extend({

	props: ['user'],

	components: { Deck },

	mounted() {
		this.load();
	},

	methods: {

	    load() {

            this.$root.isLoading = true;
	        Promise.all([
                ComponentService.getAll.bind(this)(this.$route.params.id),
			])
                .then(([components]) => {
                    this.components = components;
                })
                .catch(error => this.$handleError(this, error))
                .finally(() => this.$root.isLoading = false);
		},

		send(event) {

	        event.preventDefault();
		}
	},

	data() {
		return {
		    components: { data: [] },
		}
	},

	watch: {

        '$route.params.id': function(id) {
            this.load();
        }
	}
});
</script>
