<template>
	<div>
		<v-alert v-model="viewAlert" color="info" text>
			{{$t('preferences.shortcuts.alertInfo')}}
		</v-alert>

		<v-row v-for="(shortcut, i) in user.setting.shortcuts.concat(newItem)" :key="i" class="align-center">
			<v-col cols="12" v-if="!shortcut.new && i ===0">
				<v-subheader>{{$t('preferences.shortcuts.currentHeader')}}</v-subheader>
				<v-divider></v-divider>
			</v-col>
			<v-col cols="12" v-if="shortcut.new">
				<v-subheader>{{$t('preferences.shortcuts.addNewHeader')}}</v-subheader>
				<v-divider></v-divider>
			</v-col>
			<v-col sm="3">
				<v-select hide-details :disabled="!shortcut.new" :prepend-inner-icon="shortcut.icon" v-model="shortcut.action" :item-disabled="computedUsedActions" :items="computedActions" solo :label="$t('preferences.shortcuts.action')" outlined></v-select>
			</v-col>
			<v-col v-if="!deviceIsSmall" sm="1" class="text-center">
				<v-icon>
					mdi-equal
				</v-icon>
			</v-col>
			<v-col v-if="!deviceIsSmall" sm="7">
				<v-row class="align-center" v-for="(key, y) in shortcut.keys" :key="y">
					<v-col sm="6">
						<div class="d-flex align-start">
							<v-select hide-details prepend-inner-icon="mdi-keyboard-variant" v-model="shortcut.keys[y]" :items="keys" :label="$t('preferences.shortcuts.key')" outlined></v-select>
						</div>
					</v-col>
					<v-col sm="1">
						<v-tooltip bottom>
							<template v-slot:activator="{ on }">
								<v-btn :disabled="shortcut.keys.length === 1" v-on="on" color="error" @click="removeKey(shortcut, y)" class="ml-4" icon>
									<v-icon>mdi-close</v-icon>
								</v-btn>
							</template>
							<span>{{$t('preferences.shortcuts.removeKey')}}</span>
						</v-tooltip>
					</v-col>
					<v-col sm="1" v-if="(y + 1) === shortcut.keys.length && shortcut.keys.length < 3">
						<v-tooltip bottom>
							<template v-slot:activator="{ on }">
								<v-btn :disabled="!shortcut.keys[shortcut.keys.length - 1]" v-on="on" @click="addKey(shortcut)" class="ml-4" color="primary" icon>
									<v-icon>mdi-plus</v-icon>
								</v-btn>
							</template>
							<span>{{$t('preferences.shortcuts.addKey')}}</span>
						</v-tooltip>
					</v-col>
				</v-row>
			</v-col>

			<!-- ADD -->
			<v-col v-if="!deviceIsSmall" sm="1">
				<v-tooltip bottom>
					<template v-slot:activator="{ on }">
						<v-btn v-on="on" v-if="!shortcut.new" @click="removeShortcut(i)" color="error" >
							<v-icon>mdi-delete</v-icon>
						</v-btn>
						<v-btn v-on="on" v-if="shortcut.new" :disabled="!shortcut.action
							|| (shortcut.keys.length === 1 && !shortcut.keys[0])
							|| (shortcut.keys.length === 2 && (!shortcut.keys[0] || !shortcut.keys[1]))
							|| (shortcut.keys.length === 3 && (!shortcut.keys[0] || !shortcut.keys[1] || !shortcut.keys[2]))" @click="addShortcut(shortcut)" color="success">
							<v-icon>mdi-plus</v-icon>
						</v-btn>
					</template>
					<span>
						<span v-if="!shortcut.new">{{$t('preferences.shortcuts.deleteShortcut')}}</span>
						<span v-if="shortcut.new">{{$t('preferences.shortcuts.addShortcut')}}</span>
					</span>
				</v-tooltip>
			</v-col>
		</v-row>
	</div>
</template>

<script>
import Vue from 'vue';
import SettingService from "../../../services/Profile";

export default Vue.extend({

	props: ['user'],

	created() {
		const keys = 'abcdefghijklmnopqrstuvwxyz0123456789'.toUpperCase();
		for (let i = 0; i < keys.length; i++) {
			const key = keys[i];
			this.keys.push(key);
		}
	},

	methods: {

		shortcutText(shortcut) {
			console.log(shortcut);
			return shortcut;
		},

		removeShortcut(index) {
			this.user.setting.shortcuts.splice(index, 1);
		},

		removeKey(shortcut, index) {
			shortcut.keys.splice(index, 1);
		},

		addShortcut(shortcut) {

			const copy = {...shortcut};

			delete copy.new;
			this.user.setting.shortcuts.splice(this.user.setting.shortcuts.length - 1, 0, copy);

			shortcut.action = null;
			shortcut.keys = [null];
		},

		addKey(shortcut) {
			shortcut.keys.push(null);
		},
	},

	computed: {

		deviceIsSmall() {
			return this.$vuetify.breakpoint.smAndDown;
		},

		computedUsedActions() {

			let items = [];
			this.user.setting.shortcuts.forEach(shortcut => {
				items.push(shortcut.action);
			});
			return items;
		},

		computedActions() {

			let items = [];
			this.actions.forEach(action => {
				items.push({
					text: this.$t('preferences.shortcuts.actions.' + action),
					value: action,
				});
			});
			return items;
		},
	},

	data: function() {
		return {
			newItem: { action: null, keys: [null], new: true },
			viewAlert: true,
			keys: ['CTRL', 'ALT', 'SHIFT', 'ENTER', 'SPACE', 'BACKSPACE', 'DELETE', 'ESCAPE', 'PAGE_UP', 'PAGE_DOWN', 'HOME', 'END', 'INSERT', 'LEFT', 'RIGHT', 'UP', 'DOWN'],
			actions: ['previous', 'next', 'toggle', 'play', 'pause', 'add', 'delete', 'approve', 'faster', 'slower', 'repeat', 'switch'],
		}
	},
});
</script>
