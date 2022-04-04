<template>
	<v-dialog v-model="_value" v-bind="$attrs" v-on="$listeners" :persistent="disabled">
		<v-card :color="color" :disabled="disabled" class="d-flex flex-column">
			<v-card-title class="d-flex align-center flex-nowrap justify-space-between background">
				<slot name="title">
					<div class="d-flex align-center overflow-hidden">
						<v-icon v-if="icon" left v-text="icon"></v-icon>
						<span class="headline text-truncate" v-text="title"></span>
					</div>
				</slot>
				<v-btn @click="_value = false" icon>
					<v-icon>mdi-close</v-icon>
				</v-btn>
			</v-card-title>
			<v-card-text class="py-8" style="flex: 1">
				<slot name="body">
					<div v-html="body"></div>
				</slot>
			</v-card-text>
            <v-divider></v-divider>
            <v-card-actions class="background py-4 py-md-2">
                <slot name="actions">
                    <div class="d-flex flex-column flex-md-row w-100 justify-end" style="gap: 0.5rem">
                        <slot name="buttons">
                            <v-btn :key="btnIdx" v-for="(btn, btnIdx) in buttons" v-bind="btn.attrs" v-on="btn.events" :block="$vuetify.breakpoint.smAndDown" :outlined="btn.type === 'cancel' || (btn.attrs && btn.attrs.outlined)" large @click="btn.type === 'cancel' ? _value = false : null">
                                <v-icon v-if="btn.icon" v-text="btn.icon" left></v-icon>
                                <span v-if="btn.type === 'cancel'" v-text="$t('btn.cancel')"></span>
                                <span v-else v-text="btn.text"></span>
                            </v-btn>
                        </slot>
                    </div>
                </slot>
            </v-card-actions>
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
		disabled: {
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
	},

    created() {
        if (!this.$slots.buttons && this.buttons.length === 0) {
            this.buttons.push({
                text: this.$i18n.t('btn.close'),
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
