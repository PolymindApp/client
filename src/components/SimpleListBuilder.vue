<template>
	<div class="simple-list-builder">

		<!-- EMPTY MESSAGE -->
		<v-alert v-if="list.length === 0 && $attrs.disabled !== true" text color="info" icon="mdi-information-outline">
			<slot name="empty">
				<span v-text="$t('component.simpleListBuilder.empty')"></span>
			</slot>
		</v-alert>

		<!-- ITEMS -->
		<draggable v-model="list" v-bind="dragOptions" handle=".handle" @start="dragStart()" @end="dragEnd()">
			<transition-group type="transition" :name="!isDragging ? 'flip-list' : null">
				<v-row :key="index" v-for="(item, index) in list">
					<v-col v-if="$attrs.sortable !== undefined && list.length > 1" class="py-0 d-flex align-center justify-start shrink">
						<v-icon class="handle">mdi-drag</v-icon>
					</v-col>
					<v-col class="py-0 d-flex align-center grow">
						<div class="simple-list-builder-item grow">
							<slot name="item" :item="item" :index="index">
								Use slot name "item"
							</slot>
						</div>
					</v-col>
					<v-col class="py-0 d-flex align-center justify-end shrink">
						<v-tooltip bottom>
							<template v-slot:activator="{ on }">
								<v-btn @click="remove(index)" color="error" icon>
									<v-icon v-on="on">mdi-delete</v-icon>
								</v-btn>
							</template>
							<span v-text="$t('component.simpleListBuilder.remove')"></span>
						</v-tooltip>
					</v-col>
				</v-row>
			</transition-group>
		</draggable>

		<!-- ADD BUTTON -->
		<v-row v-if="!hideAddButton">
			<v-col cols="12">
				<v-btn @click="add()" :disabled="$attrs.disabled">
					<v-icon>mdi-plus</v-icon>
					<span v-text="$t('component.simpleListBuilder.add')"></span>
				</v-btn>
			</v-col>
		</v-row>
	</div>
</template>

<script>
import Vue from 'vue';
import draggable from "vuedraggable";
import Hash from "../utils/Hash";

export default Vue.extend({

	components: { draggable },

    props: {
	    group: {
	        type: String,
		},
        hideAddButton: {
            type: Boolean,
            default: false,
        },
        value: {
            type: Array,
			default: () => ({}),
		},
        emptyItem: {
            type: Object,
            default: () => ({})
        },
    },

	mounted() {
        this.list = this.value;
	},

    methods: {

        add() {
            const deepClone = JSON.parse(JSON.stringify(this.emptyItem));
			this.list.push(deepClone);
			this.$emit('input', this.list);
		},

        remove(index) {
            this.list.splice(index, 1);
            this.$emit('input', this.list);
        },

        dragStart() {
            this.isDragging = true;
        },

        dragEnd() {
            this.isDragging = false;
            this.$emit('input', this.list);
        }
    },

	computed: {

        dragOptions() {
            return {
                animation: 200,
                group: this.group || Hash.guid(),
                dragoverBubble: true,
                disabled: this.$attrs.sortable === undefined || this.$attrs.disabled === true,
                ghostClass: "ghost"
			};
        },
	},

    data() {
        return {
            list: [],
            isDragging: false,
        }
    },

	watch: {
	    value(val) {
	        this.list = val;
		}
	}
});
</script>

<style lang="scss" scoped>
	.handle {
		cursor: move;
		opacity:  0.5;

		&:hover {
			opacity: 1;
		}
	}
</style>
