<template>
	<v-input v-bind="$attrs" :class="{ 'focused primary--text': focused, noToolbar: !$vuetify.breakpoint.mdAndUp }">
		<fieldset class="fill-height" style="width: 100%">
			<legend class="v-label">{{label}}</legend>

			<editor-menu-bar :editor="editor" v-slot="{ commands, isActive }">
				<div class="menubar" v-if="$vuetify.breakpoint.mdAndUp">

					<v-toolbar dense>

						<v-btn-toggle class="mr-4">
							<v-btn small :input-value="isActive.bold()" @click="commands.bold">
								<v-icon>mdi-format-bold</v-icon>
							</v-btn>

							<v-btn small :input-value="isActive.italic()" @click="commands.italic">
								<v-icon>mdi-format-italic</v-icon>
							</v-btn>

							<v-btn small :input-value="isActive.strike()" @click="commands.strike">
								<v-icon>mdi-format-strikethrough</v-icon>
							</v-btn>

							<v-btn small :input-value="isActive.underline()" @click="commands.underline">
								<v-icon>mdi-format-underline</v-icon>
							</v-btn>
						</v-btn-toggle>

	<!--					<v-btn small :input-value="isActive.code()" @click="commands.code">-->
	<!--						<v-icon>mdi-format-underline</v-icon>-->
	<!--					</v-btn>-->

	<!--					<v-btn small :input-value="isActive.paragraph()" @click="commands.paragraph">-->
	<!--						paragraph-->
	<!--					</v-btn>-->

	<!--					<v-btn small :input-value="isActive.heading({ level: 1 }) }" @click="commands.heading({ level: 1 })">-->
	<!--						H1-->
	<!--					</v-btn>-->

	<!--					<v-btn small :input-value="isActive.heading({ level: 2 }) }" @click="commands.heading({ level: 2 })">-->
	<!--						H2-->
	<!--					</v-btn>-->

	<!--					<v-btn small :input-value="isActive.heading({ level: 3 }) }" @click="commands.heading({ level: 3 })">-->
	<!--						H3-->
	<!--					</v-btn>-->

						<v-btn-toggle class="mr-4">
							<v-btn small :input-value="isActive.bullet_list()" @click="commands.bullet_list">
								<v-icon>mdi-format-list-bulleted</v-icon>
							</v-btn>

							<v-btn small :input-value="isActive.ordered_list()" @click="commands.ordered_list">
								<v-icon>mdi-format-list-numbered</v-icon>
							</v-btn>
						</v-btn-toggle>

	<!--					<v-btn small :input-value="isActive.blockquote()" @click="commands.blockquote">-->
	<!--						quote-->
	<!--					</v-btn>-->

	<!--					<v-btn small :input-value="isActive.code_block()" @click="commands.code_block">-->
	<!--						code-->
	<!--					</v-btn>-->

	<!--					<v-btn small @click="commands.horizontal_rule">-->
	<!--						hr-->
	<!--					</v-btn>-->

						<v-spacer></v-spacer>

						<v-btn-toggle class="">
							<v-btn small @click="commands.undo">
								<v-icon>mdi-undo</v-icon>
							</v-btn>

							<v-btn small @click="commands.redo">
								<v-icon>mdi-redo</v-icon>
							</v-btn>
						</v-btn-toggle>
					</v-toolbar>
				</div>
			</editor-menu-bar>

			<editor-content class="editor-content" :editor="editor" />
		</fieldset>
	</v-input>
</template>

<script>
import { Editor, EditorContent, EditorMenuBar } from 'tiptap'
import {
	Blockquote,
	CodeBlock,
	HardBreak,
	Heading,
	HorizontalRule,
	OrderedList,
	BulletList,
	ListItem,
	TodoItem,
	TodoList,
	Bold,
	Code,
	Italic,
	Link,
	Strike,
	Underline,
	History,
} from 'tiptap-extensions'

export default {

	props: ['value', 'label'],

	components: {
		EditorContent,
		EditorMenuBar,
	},

	mounted() {
		this.editor = new Editor({
			onFocus: () => {
				    this.focused = true;
			},
			onBlur: () => {
				    this.focused = false;
			},
			onUpdate: update => {

				// TODO: To prevent digesting scopes too fast (not the best fix)
				clearTimeout(this.updateTimeout);
				this.updateTimeout = setTimeout(() => {
					const state = update.getHTML();
					this.$emit('input', state);
				}, 250);
			},
			extensions: [
				// new Blockquote(),
				new BulletList(),
				// new CodeBlock(),
				// new HardBreak(),
				// new Heading({ levels: [1, 2, 3] }),
				// new HorizontalRule(),
				new ListItem(),
				new OrderedList(),
				// new TodoItem(),
				// new TodoList(),
				new Link(),
				new Bold(),
				new Code(),
				new Italic(),
				new Strike(),
				new Underline(),
				new History(),
			],
			content: this.value,
		});
	},

	beforeDestroy() {
		if (this.editor) {
            	this.editor.destroy();
		}
	},

	data() {
		return {
			updateTimeout: null,
			editor: null,
			focused: false,
		}
	},

	watch: {
		value: function(val) {
			if (this.editor && val !== this.editor.getHTML()) {
				this.editor.setContent(val, true)
			}
		},
	},
}
</script>

<style lang="scss" scoped>
	.v-input {

		margin-top: 8px;
		padding-top: 4px;

		fieldset {
			overflow: hidden;
			border-style: solid;
			border-width: 1px;
			transition: border .333s ease;
			border-radius: 4px;
			margin-top: -0.6rem;
			color: rgba(0,0,0,.24);

			legend {
				margin-left: 10px;
				transform: scale(0.75);
				color: rgba(0,0,0,.54);
				z-index: 1;
				position: relative;
			}

			&:hover {
				color: rgba(0,0,0,.87);
			}
		}

		&.focused fieldset {
			border-color: currentColor;
			border-width: 2px;

			legend {
				color: inherit;
			}

			color: inherit;
		}

		&.v-input--is-disabled fieldset {
			opacity: 0.5;
		}

		.editor-content {

			&::v-deep .ProseMirror {
				min-height: 11.15rem;
				padding: 1rem;
				color: black;
			}
			&::v-deep .ProseMirror:focus {
				outline: 0;
			}
		}

		&.noToolbar {

			.editor-content {

				&::v-deep .ProseMirror {
					min-height: calc(11.15rem + 38px);
				}
			}
		}

		.v-sheet {
			border-radius: 4px 4px 0 0;
		}
		.menubar {
			margin-top: -9.5px;
		}
	}
</style>
