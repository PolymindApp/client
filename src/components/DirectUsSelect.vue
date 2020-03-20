<template>
	<v-select v-bind="$attrs" @change="update()" :items="items" v-model="mappedValue"></v-select>
</template>

<script>
    import Vue from 'vue';

    export default Vue.extend({

        name: 'DirectUsSelect',

        props: ['value', 'rootKey', 'items'],

        components: {},

        mounted() {
			this.update();
        },

        destroyed() {

        },

        methods: {

            mapValue(val) {
                let items = [];
                if (val) {
					val.forEach(value => {
						items.push(value[this.rootKey]);
					});
				}
                return items;
			},

			update() {

                let items = [];
				this.originalMappedValue.forEach(originalMappedItem => {

                    const found = this.mappedValue.find(original => originalMappedItem.id === original.id);
                    if (!found) {
                        items.push({
                            $delete: true,
                            id: this.value.find(valueItem => valueItem[this.rootKey].id === originalMappedItem.id).id,
                        });
                    } else {
                        const item = this.items.find(item => item.id === originalMappedItem.id);
                        if (item) {
                            items.push({
								id: this.value.find(valueItem => valueItem[this.rootKey].id === originalMappedItem.id).id
							});
                        }
					}
				});
                this.mappedValue.forEach(mappedItem => {

                    const originalMappedItem = this.originalMappedValue.find(originalMappedItem => mappedItem.id === originalMappedItem.id);
                    if (!originalMappedItem) {

                        const item = this.items.find(item => item.id === mappedItem.id);
                        if (item) {
                            let existingItem = {};
                            existingItem[this.rootKey] = {
                                id: item.id,
                            };
                            items.push(existingItem);
                        }
                    }
				});

                this.$emit('mapped', items);
			},
		},

        computed: {

		},

        data() {

            const value = this.value || [];

            return {
                mappedValue: this.mapValue(value),
                originalMappedValue: this.mapValue(value),
                mappedResults: [],
			};
        },

		watch: {

            value(val) {

				this.mappedValue = this.mapValue(val);
				this.originalMappedValue = [...this.mappedValue];
				this.update();
			}
		}
    });
</script>

<style lang="scss" scoped>

</style>
