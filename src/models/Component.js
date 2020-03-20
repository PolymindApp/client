import Model from "./Model";

export default class Component extends Model {

	constructor(props) {

		super({});

		const html = `<!--

Theme your template using Vuetify 2.x

Check out Vuetify website for full documentation:
https://vuetifyjs.com/en/getting-started/quick-start

-->
<v-card flat color="transparent" class="text-center">

    <!-- A basic example of a title and button that gets its data from the Vue component (JS tab) -->
    <h1 class="title white--text mb-2" v-text="title"></h1>
    <v-btn @click="handleClick">
        <v-icon left>mdi-play</v-icon>
        <span v-text="parameters.btnText"></span>
    </v-btn>
</v-card>`;

		const js = `/**
 * A normal Vue 2.x component structure with some additionnals parameters:
 *
 * @parameters: Object
 * @events: Object
 *
 * Check out VueJS website for full documentation:
 * https://vuejs.org/v2/guide/
 */
({

    mounted() {
        this.init();
    },

    methods: {

        init() {
            console.log('INITIALIZED');
        },

        handleClick(event) {
        	this.hooks.onBeforeClick();
            console.log(event);
            this.hooks.onAfterClick();
        },
    },

    data() {
        return {
        	title: 'Welcome to Polymind!',
        }
    },
});`;

		const scss = `/**
 * Write your standard CSS conditions here. Nothing much to add.
 */
pre {
    color: white;
    padding: 1rem;
    overflow: auto;
    background-color: rgba(0, 0, 0, 0.25);
    text-align: left;
    border-radius: 4px;
}`;

		this.setDefaultValues({
			id: null,
			name: '',
			description: '<p></p>',
			instructions: '<p></p>',
			is_invisible: false,
			is_private: false,
			icon: '',
			html,
			js,
			scss,
			hooks: [{
				"name": "onBeforeClick",
				"js": "console.log('onBeforeClick');"
			}, {
				"name": "onAfterClick",
				"js": "console.log('onAfterClick');"
			}],
			parameters: [{
				"name": "btnText",
				"defaultValue": "return 'Click here';"
			}],
			functions: [],
			tests: [{
				"name": "simulate click",
				"js": "this.handleClick(new Event('click'));"
			}],
		}, props);
	}
}
