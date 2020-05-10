<template>
	<v-menu offset-y>
		<template v-slot:activator="{ on }">
			<v-btn text v-on="on">
				<v-icon left>mdi-calendar-search</v-icon>
				<span v-text="title"></span>
				<v-icon right small>mdi-chevron-down</v-icon>
			</v-btn>
		</template>
		<v-list>
			<v-list-item-group v-model="selected" color="primary">
				<template v-for="(item, index) in items">
					<v-list-item v-if="item.text" :key="index + '_item'" @click="item.callback(item)">
						<v-list-item-title>{{ item.text }}</v-list-item-title>
					</v-list-item>
					<v-divider v-else :key="index + '_sep'" class="my-2"></v-divider>
				</template>
			</v-list-item-group>
		</v-list>
	</v-menu>
</template>

<script>
    import Vue from 'vue';
	import DateField from "../../../components/DateField";
	import moment from 'moment';

    export default Vue.extend({

        name: 'ToolbarContextual',

        props: {
        	value: {
        		type: Array,
				default: () => this.items[0].value,
			}
		},

		components: { DateField },

        computed: {

        	model: {

        		get() {
        			return this.value;
				},

				set(value) {
        			this.$emit('input', value);
				},
			}
		},

        data() {
        	const today = moment().format('YYYY-MM-DD');
        	const items = [
				{ text: this.$t('dashboard.contextual.last7days'), value: [moment().subtract(1, 'week').format('YYYY-MM-DD'), today], callback: item => {this.model = item.value; this.title = item.text } },
				{ text: this.$t('dashboard.contextual.thisMonth'), value: [moment().startOf('month').format('YYYY-MM-DD'), moment().endOf('month').format('YYYY-MM-DD')], callback: item => {this.model = item.value; this.title = item.text } },
				{},
				{ text: this.$t('dashboard.contextual.lastMonth'), value: [moment().startOf('month').subtract(1, 'month').format('YYYY-MM-DD'), moment().endOf('month').subtract(1, 'month').format('YYYY-MM-DD')], callback: item => {this.model = item.value; this.title = item.text } },
				// { text: this.$t('dashboard.contextual.custom'), callback: value => {
				//
				// 	} },
			];
            return {
				today,
				items,
				selected: 0,
				title: items[0].text,
			};
        },

		watch: {

        	model: {
        		deep: true,
				handler(value) {

					const item = this.items.find(item => item.value[0] === value[0] && item.value[1] === value[1]);
					if (item) {
						this.title = item.text;
					}

					this.title =  value.join(' ~ ');
				}
			}
		}
    });
</script>
