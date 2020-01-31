<template>
	<v-card class="mx-auto" hover>
		<v-responsive :aspect-ratio="16/9">
			<v-icon class="bg-icon">
				{{ model.icon }}
			</v-icon>

			<v-card dark tile :color="colors[model.category]" class="fill-height d-flex flex-column justify-space-between gradient-overlay" :to="'/component/' + model.id">
				<div class="d-flex justify-space-between font-weight-thin pa-4">
					<v-row no-gutters>
						<v-col class="grow">
							<span class="title">{{ model.name }}</span>
							<span v-if="$attrs.dense === undefined">
								<br /><span class="subtitle-1 font-weight-thin">{{ model.description | plainExcerpt(200) }}</span>
							</span>
						</v-col>

						<v-col class="shrink pl-4">
							<UserAvatar :color="model.created_by.id === $root.user.id ? 'primary' : 'white'" class="align-self-start" :user="model.created_by" :size="48" />
						</v-col>
					</v-row>
				</div>

				<v-card-title class="d-flex justify-space-between pt-0" style="opacity: 0.75">
					<span class="body-1" v-if="$attrs.dense === undefined">
						<span v-if="$root.user.id !== model.created_by.id" v-text="$t('deck.createdBy', { name: $options.filters.userScreenName(model.created_by) })"></span>
						<span v-else v-text="$t('deck.createdByYou')"></span>
					</span>
					<span v-if="$attrs.dense === undefined">
						{{ $t('component.categories.' + model.category) }}
					</span>
				</v-card-title>
			</v-card>
		</v-responsive>

		<v-card-actions>

			<div>
				<v-icon left>mdi-calendar</v-icon>
				{{ model.modified_on | timeAgo }}
			</div>

			<v-spacer></v-spacer>

			<v-tooltip bottom>
				<template v-slot:activator="{ on }">
					<v-btn v-on="on" text :to="'/component/' + model.id">
						<v-icon v-if="model.created_by.id !== $root.user.id">mdi-eye</v-icon>
						<v-icon v-else>mdi-pencil</v-icon>
					</v-btn>
				</template>
				<span>
					<span v-if="model.created_by.id !== $root.user.id">{{$t('deck.view')}}</span>
					<span v-else>{{$t('deck.edit')}}</span>
				</span>
			</v-tooltip>

	<!--			<v-tooltip v-if="model.created_by.id === $root.user.id" bottom>-->
	<!--				<template v-slot:activator="{ on }">-->
	<!--					<v-btn v-on="on" text class="ml-1" :to="'/component/' + model.id + '/edit'">-->
	<!--						<v-icon>mdi-pencil</v-icon>-->
	<!--					</v-btn>-->
	<!--				</template>-->
	<!--				<span>{{$t('deck.edit')}}</span>-->
	<!--			</v-tooltip>-->
		</v-card-actions>
	</v-card>
</template>

<script>
import Vue from 'vue';
import UserAvatar from "./UserAvatar";

export default Vue.extend({
	name: 'Deck',
	props: ['model'],
	components: { UserAvatar },

	methods: {

	},

	data() {
		return {
			colors: {
			    general: 'primary',
				language: 'info',
				functions: 'secondary',
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
