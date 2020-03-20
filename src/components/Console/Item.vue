<template>
	<div :class="{ 'item d-flex align-center': true, 'first-level': deepnest === 0, 'theme--dark': dark, error: value.error, warning: value.warning, info: value.info }">
		<v-btn v-if="deepnest === 0" class="align-self-start pe-none mr-2" icon small>
			<v-icon v-if="value.error" color="error" small>mdi-alert</v-icon>
			<v-icon v-else-if="value.warning" color="warning" small>mdi-alert</v-icon>
			<v-icon v-else-if="value.info" color="info" small>mdi-information-outline</v-icon>
			<v-icon v-else small>mdi-blank</v-icon>
		</v-btn>
		<div v-else style="width: 2rem"></div>
		<div style="flex: 1">
			<div v-if="Array.isArray(value.params)">
				<span :key="index" v-for="(param, index) in value.params">

					<span v-if="subIndex !== null" class="key mr-4">{{subIndex}}:</span>

					<span v-if="index !== 0">, </span>

					<span v-if="typeof param === 'object' || Array.isArray(param)" class="value object">
						<v-btn @click="expand(index)" v-if="(typeof param === 'object' && Object.keys(param).length > 0) || Array.isArray(param)" class="mr-2 expand-btn align-self-start" icon small>
							<v-icon v-if="!expanded[index]" small>mdi-chevron-right</v-icon>
							<v-icon v-else small>mdi-chevron-down</v-icon>
						</v-btn>

						<span v-if="(typeof param === 'object' && Object.keys(param).length > 0) || Array.isArray(param)" @click="expand(index)" class="expandable-link" v-text="excerpt(param)"></span>
						<span v-else v-text="excerpt(param)"></span>
					</span>
					<span v-else-if="param === null" class="value null">null</span>
					<span v-else-if="param === undefined" class="value undefined">undefined</span>
					<span v-else-if="typeof param === 'string'" class="value string">&quot;<span v-html="formatParam(param)"></span>&quot;</span>
					<span v-else-if="typeof param === 'number'" class="value number"><span v-html="param"></span></span>
					<span v-else-if="typeof param === 'boolean'" class="value boolean"><span v-html="param"></span></span>

					<template v-if="typeof param === 'object' || Array.isArray(param)">
						<v-slide-x-transition group>
							<div v-if="expanded[index]" :key="subIndex" v-for="(subItem, subIndex) in param">
								<ConsoleItem :dark="dark" :value="formatItem(subItem)" :deepnest="deepnest + 1" :sub-index="subIndex" />
							</div>
						</v-slide-x-transition>
					</template>
				</span>
			</div>
			<div v-else-if="value.cleared">
				<span class="cleared" v-text="$t('components.console.wasCleared')"></span>
			</div>
		</div>
		<div v-if="deepnest === 0" style="flex: 0" class="ml-2 text-no-wrap date align-self-start no-select">{{ value.timestamp | date('HH:mm:ss') }}</div>
	</div>
</template>

<script>
    import Vue from 'vue';
    import ConsoleItem from './Item';

    export default Vue.extend({

        name: 'ConsoleItem',

        props: {
        	value: {
        		type: [Array, Object],
			},
			dark: {
        		type: Boolean,
				default: false,
			},
			deepnest: {
        		type: Number,
				default: 0,
			},
			subIndex: {
				default: null,
			},
		},

        components: { ConsoleItem },

        mounted() {

        },

        destroyed() {

        },

        methods: {

			formatItem(item) {
				return {
					params: [item],
				};
			},

			excerpt(item) {

				let string = '';
				let addBrackets = true;
				if (Array.isArray(item)) {

					if (this.deepnest > 0 || item.length > 5) {
						return 'Array (' + item.length + ')';
					} else {
						string = item.toString();
					}

				} else {

					if (this.deepnest > 0 || Object.keys(item).length > 5) {
						return '{ ... }';
					} else if(item.toString() !== '[object Object]') {
						string = item.toString();
						addBrackets = false;
					} else {
						string = JSON.stringify(item);
						string = string.substring(1, string.length - 1);
					}
				}

				if (this.deepnest > 0 && string.length > 25) {
					string = string.substring(0, 25) + '...';
				}

				if (addBrackets) {
					if (Array.isArray(item)) {
						string = '[ ' + string + ' ]';
					} else {
						string = '{ ' + string + ' }';
					}
				}

				return string;
			},

			expand(index) {
				this.expanded[index] = !this.expanded[index];
				this.$forceUpdate();
			},

			formatParam(param) {

				if (Array.isArray(param) || typeof param === 'string' || typeof param === 'number' || typeof param === 'boolean') {
					return (param.toString() || "").replace(
							/([^\S]|^)(((https?\:\/\/)|(www\.))(\S+))/gi,
							function(match, space, url){
								let hyperlink = url;
								let suffix = '';
								if (!hyperlink.match('^https?:\/\/')) {
									hyperlink = 'http://' + hyperlink;
								}

								if (hyperlink.lastIndexOf('.') === hyperlink.length - 1) {
									hyperlink = hyperlink.substring(0, hyperlink.length - 1);
									suffix = '.';
								}

								return space + '<a href="' + hyperlink + '" target="_blank">' + hyperlink + '</a>' + suffix;
							}
					);
				}

				return param;
			},
		},

        computed: {

		},

        data() {
            return {
				expanded: [],
			};
        }
    });
</script>

<style lang="scss" scoped>

	.item:not(.theme--dark) {

		&.error {
			color: inherit;
		}

		&.warning {
			color: inherit;
		}

		&.info {
			color: inherit;
		}
	}

	.expandable-link:hover {
		cursor: pointer;
		text-decoration: underline;
	}

	.item {

		&.first-level {
			padding: 0.5rem;
		}

		font-style: italic;
		color: rgba(0, 0, 0, 0.75);

		.key {
			color: rgb(136, 19, 145);
		}

		&.error {
			background-color: hsl(0, 100%, 97%) !important;
		}

		&.warning {
			background-color: hsl(50, 100%, 95%) !important;
		}

		&.info {
			border: 0 !important;
			background-color: rgba(33, 150, 243, 0.05) !important;
		}

		&.first-level:hover {
			background-color: rgba(0, 0, 0, 0.05);
		}

		& + .item {
			border-top: rgba(0, 0, 0, 0.1) solid 1px;
		}

		.value {

			/*white-space: pre-wrap;*/
			word-break: break-word;

			&.number {
				color: rgb(28, 0, 207);
			}

			&.null {
				color: rgb(28, 0, 207);
			}

			&.string {
				color: hsl(1, 80%, 43%);
			}

			&.boolean {
				color: rgb(28, 0, 207);
			}
		}

		.cleared {
			opacity: 0.333;
		}
		.expand-btn,
		.date {
			font-style: normal;
			opacity: 0.333;
		}
	}

	.item.theme--dark {

		color: rgba(255, 255, 255, 0.75);

		.key {
			color: rgb(227, 110, 236);
		}

		&.error {
			background-color: hsl(0, 100%, 8%) !important;
		}

		&.warning {
			background-color: rgb(84, 71, 0) !important;
		}

		&.info {
			background-color: rgba(33, 150, 243, 0.05) !important;
		}

		.value {

			&.number {
				color: rgb(161, 247, 181);
			}

			&.null {
				color: rgb(161, 247, 181);
			}

			&.string {
				color: rgb(242, 139, 84);
			}

			&.boolean {
				color: hsl(252, 100%, 75%)
			}
		}
	}
</style>
