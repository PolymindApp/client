<template>
	<v-input v-bind="$attrs" :class="{ 'editor': true }" :height="height ? height : null">
		<fieldset style="width: 100%; height: 100%">
			<editor v-model="content" ref="editor" @init="editorInit" :lang="lang" :theme="theme"></editor>
		</fieldset>
	</v-input>
</template>

<script>
import Vue from 'vue';

export default Vue.extend({

	props: {
		dark: {
			type: Boolean,
			default: true,
		},
		lineNumber: {
			type: Boolean,
			default: true,
		},
		readonly: {
			type: Boolean,
			default: false,
		},
	    height: {
	        type: Number,
			default: null,
		},
	    value: {
	        type: String,
			default: '',
		},
	    lang: {
	        type: String,
			default: 'javascript',
		},
	},

	components: {
		editor: require('vue2-ace-editor'),
	},

	methods: {

		editorInit: function () {
			require('brace/ext/language_tools');
			require('brace/mode/html');
			require('brace/mode/javascript');
			require('brace/mode/less');
			require('brace/theme/twilight');
			require('brace/theme/chrome');
			require('brace/snippets/javascript');

			const config = this.$root.user.settings.development;

			this.editor = this.$refs.editor.editor;
			this.editor.setWrapBehavioursEnabled(true);

			if (this.readonly) {
            	this.editor.setReadOnly(this.readonly);
			}

			this.content = this.value;

			this.setOptions();
		},

		setOptions() {

            const config = this.$root.user.settings.development;

            this.editor.session.setTabSize(config.tabSize);

            let options = {
                enableBasicAutocompletion: true,
                enableSnippets: true,
                enableLiveAutocompletion: true,
                fontSize: config.fontSize + 'px',
                showLineNumbers: config.showLines,
            };

            switch(config.theme) {
                case 'dark':
                    this.editor.setTheme("ace/theme/twilight");
                    options.theme = 'ace/theme/twilight';
                    this.theme = 'twilight';
                    break;
                case 'light':
                    this.editor.setTheme("ace/theme/chrome");
                    options.theme = 'ace/theme/chrome';
                    this.theme = 'chrome';
                    break;
            }

            this.editor.setOptions(options);
		}
	},

	data() {
		return {
			updateTimeout: null,
			content: '',
			editor: null,
			theme: 'twilight',
		}
	},

	watch: {
	    '$root.user.settings.development'() {
            this.setOptions();
		},
	    content: function(val) {
	        if (val !== this.value) {

				// TODO: To prevent digesting scopes too fast (not the best fix)
				clearTimeout(this.updateTimeout);
				this.updateTimeout = setTimeout(() => {
					this.$emit('input', val);
				}, 250);
			}
		},
		value: function(val) {
	        if (this.value !== this.content) {
	            this.content = this.value;
			}
		},
	}
});
</script>

<style lang="scss" scoped>
	.v-input {

		&::v-deep .v-input__control,
		&::v-deep .v-input__slot {
			height: 100%;
		}

		&::v-deep .ace_editor {
			width: 100%;
			height: 100% !important;
		}

		&[disabled]::v-deep .ace_editor {
			opacity: 0.5 !important;
		}

		fieldset {
			overflow: hidden;
			border: rgba(0,0,0,.24) solid 1px;
			transition: border .333s ease;
			border-radius: 4px;
		}
	}
</style>
