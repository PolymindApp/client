<template>
	<v-dialog v-model="_value" v-bind="$attrs" v-on="$listeners" :persistent="persistent || disabled" :dark="dark" :fullscreen="fullscreen">
		<v-card :color="color" :disabled="disabled" :tile="$vuetify.breakpoint.smAndDown" class="d-flex flex-column">
            <v-expand-transition>
                <v-card-title v-if="!hideMobileFocus" :class="{
                    'background': !dense && !dark && !$vuetify.breakpoint.smAndDown,
                    'primary white--text': !dense && !dark && $vuetify.breakpoint.smAndDown,
                    'py-0': $vuetify.breakpoint.smAndDown,
                }">
                    <div :class="{
                        'w-100 d-flex align-center flex-nowrap justify-space-between': true,
                        'py-3': $vuetify.breakpoint.smAndDown,
                    }">
                        <slot name="title">
                            <div class="d-flex align-center overflow-hidden">
                                <v-icon v-if="icon" :left="!$vuetify.rtl" :right="$vuetify.rtl" v-text="icon"></v-icon>
                                <span class="headline text-truncate" v-text="title"></span>
                            </div>
                        </slot>
                        <v-btn @click="_value = false" :disabled="disabled" :dark="!dense && $vuetify.breakpoint.smAndDown" icon>
                            <v-icon>mdi-close</v-icon>
                        </v-btn>
                    </div>
                </v-card-title>
            </v-expand-transition>
			<v-card-text :class="{ 'py-8': !dense }" style="flex: 1">
				<slot name="body">
					<div v-html="body"></div>
				</slot>
			</v-card-text>
            <v-expand-transition>
                <div v-if="!hideMobileFocus">
                    <v-divider></v-divider>
                    <v-card-actions :class="{
                        'py-4 py-md-2': true,
                        'background': !dense && !dark,
                    }">
                        <slot name="actions">
                            <div class="d-flex flex-column flex-md-row w-100 justify-end" style="gap: 0.5rem">
                                <slot name="buttons">
                                    <v-btn :key="btnIdx" v-for="(btn, btnIdx) in buttons" v-bind="btn.attrs" v-on="btn.events" :block="$vuetify.breakpoint.smAndDown" :outlined="btn.type === 'cancel' || (btn.attrs && btn.attrs.outlined)" large @click="btn.type === 'cancel' ? _value = false : null">
                                        <v-icon v-if="btn.icon" v-text="btn.icon" :left="!$vuetify.rtl" :right="$vuetify.rtl"></v-icon>
                                        <span v-if="btn.type === 'cancel'" v-text="$t('btn.cancel')"></span>
                                        <span v-else v-text="btn.text"></span>
                                    </v-btn>
                                </slot>
                            </div>
                        </slot>
                    </v-card-actions>
                </div>
            </v-expand-transition>
		</v-card>
	</v-dialog>
</template>

<script>
export default {
	name: "Modal",

	props: {
		value: {
			type: Boolean,
			default: false,
		},
		persistent: {
			type: Boolean,
			default: false,
		},
		disabled: {
			type: Boolean,
			default: false,
		},
		dense: {
			type: Boolean,
			default: false,
		},
		color: {
			type: String,
			default: null,
		},
		icon: {
			type: String,
			default: null,
		},
		dark: {
			type: Boolean,
			default: null,
		},
		fullscreen: {
			type: Boolean,
			default: false,
		},
		title: {
			type: String,
			default: null,
		},
		body: {
			type: String,
			default: null,
		},
		buttons: {
			type: Array,
			default: () => ([]),
		},
	},

	computed: {
		_value: {
			get() {
				return this.value;
			},
			set(value) {
				this.$emit('input', value);
			},
		},
        hideMobileFocus() {
            return this.$root.inputFocused && this.$vuetify.breakpoint.smAndDown && this.fullscreen;
        },
	},

    created() {
        if (!this.$slots.buttons && this.buttons.length === 0) {
            this.buttons.push({
                text: this.$i18n.t('btn.close'),
                attrs: {
                    outlined: true,
                },
                events: {
                    click: () => {
                        this._value = false;
                    }
                }
            })
        }
    }
}
</script>
