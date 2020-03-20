<template>
	<div>
		<v-card v-if="isDense" class="pa-2" :color="colors[model.category]" :to="'/' + type + '/' + model.id" dark>
			<div class="gradient-overlay"></div>
			<div :style="{ position: 'relative', zIndex: 1 }">
				<div class="d-flex align-center">
					<v-icon v-text="model.icon || 'mdi-blank'" left></v-icon>
					<div>
						<div class="title">{{ model.name }}</div>
						<div>{{ $t('component.categories.' + model.category) }}</div>
					</div>
				</div>
			</div>
		</v-card>
		<v-card v-else>
			test
		</v-card>
<!--		<v-card v-if="isDense" dark tile :color="colors[model.category]" class="mx-auto gradient-overlay" :to="'/' + type + '/' + model.id">-->
<!--			<v-icon v-text="model.icon || 'mdi-blank'" left></v-icon>-->
<!--			<span class="title">{{ model.name }}</span>-->
<!--		</v-card>-->

<!--		<v-card class="mx-auto" hover v-else>-->
<!--			<v-responsive :aspect-ratio="16/9">-->
<!--				<v-icon class="bg-icon">-->
<!--					{{ model.icon }}-->
<!--				</v-icon>-->

<!--				<v-card dark tile :color="colors[model.category]" class="fill-height d-flex flex-column justify-space-between gradient-overlay" :to="'/' + type + '/' + model.id">-->
<!--					<div class="d-flex justify-space-between font-weight-thin pa-4">-->
<!--						<v-row no-gutters>-->
<!--							<v-col class="grow">-->
<!--								<span class="title">{{ model.name }}</span>-->
<!--								<span>-->
<!--								<br /><span class="subtitle-1 font-weight-thin">{{ model.description | plainExcerpt(200) }}</span>-->
<!--							</span>-->
<!--							</v-col>-->

<!--							<v-col class="shrink pl-4">-->
<!--								<UserAvatar :color="model.created_by.id === $root.user.id ? 'primary' : 'white'" class="align-self-start" :user="model.created_by" :size="48" />-->
<!--							</v-col>-->
<!--						</v-row>-->
<!--					</div>-->

<!--					<v-card-title class="d-flex justify-space-between pt-0" style="opacity: 0.75">-->
<!--					<span class="body-1">-->
<!--						<span v-if="$root.user.id !== model.created_by.id" v-text="$t('deck.createdBy', { name: $options.filters.userScreenName(model.created_by) })"></span>-->
<!--						<span v-else v-text="$t('deck.createdByYou')"></span>-->
<!--					</span>-->
<!--					<span>-->
<!--						{{ $t('component.categories.' + model.category) }}-->
<!--					</span>-->
<!--					</v-card-title>-->
<!--				</v-card>-->
<!--			</v-responsive>-->

<!--			<v-card-actions>-->

<!--				<div>-->
<!--					<v-icon left>mdi-calendar</v-icon>-->
<!--					{{ model.modified_on | timeAgo }}-->
<!--				</div>-->

<!--				<v-spacer></v-spacer>-->

<!--				<v-tooltip bottom>-->
<!--					<template v-slot:activator="{ on }">-->
<!--						<v-btn v-on="on" text :to="'/component/' + model.id">-->
<!--							<v-icon v-if="model.created_by.id !== $root.user.id">mdi-eye</v-icon>-->
<!--							<v-icon v-else>mdi-pencil</v-icon>-->
<!--						</v-btn>-->
<!--					</template>-->
<!--					<span>-->
<!--					<span v-if="model.created_by.id !== $root.user.id">{{$t('deck.view')}}</span>-->
<!--					<span v-else>{{$t('deck.edit')}}</span>-->
<!--				</span>-->
<!--				</v-tooltip>-->

<!--				&lt;!&ndash;			<v-tooltip v-if="model.created_by.id === $root.user.id" bottom>&ndash;&gt;-->
<!--				&lt;!&ndash;				<template v-slot:activator="{ on }">&ndash;&gt;-->
<!--				&lt;!&ndash;					<v-btn v-on="on" text class="ml-1" :to="'/component/' + model.id + '/edit'">&ndash;&gt;-->
<!--				&lt;!&ndash;						<v-icon>mdi-pencil</v-icon>&ndash;&gt;-->
<!--				&lt;!&ndash;					</v-btn>&ndash;&gt;-->
<!--				&lt;!&ndash;				</template>&ndash;&gt;-->
<!--				&lt;!&ndash;				<span>{{$t('deck.edit')}}</span>&ndash;&gt;-->
<!--				&lt;!&ndash;			</v-tooltip>&ndash;&gt;-->
<!--			</v-card-actions>-->
<!--		</v-card>-->
	</div>
</template>

<script>
import Vue from 'vue';
import UserAvatar from "./UserAvatar";

export default Vue.extend({
	name: 'Deck',
	props: ['model', 'type'],
	components: { UserAvatar },

	methods: {

	},

	computed: {

		isDense() {
			return this.$attrs.dense !== false && this.$attrs.dense !== undefined;
		}
	},

	data() {
		return {
			colors: {
			    general: 'primary',
				language: 'info',
				functions: 'grey',
			}
		};
	},
});
</script>

<style lang="scss" scoped>
	.bg-icon {
		position: absolute;
		font-size: 8rem;
		opacity: 0.2;
		right: 1rem;
		top: 1rem;
	}
</style>
