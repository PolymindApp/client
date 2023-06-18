<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    offset-y
  >
    <template #activator="{ on, attrs }">

      <!-- BUTTON -->
      <v-btn
        color="default"
        v-bind="{...attrs}"
        v-on="on"
        :icon="!showLabel"
        :text="showLabel"
        x-small
      >
        <v-badge
          :value="originalHasValue"
          color="primary"
          dot
        >
            <span v-if="showLabel" v-text="header.text"></span>
            <v-icon x-small :right="showLabel">mdi-filter-variant</v-icon>
        </v-badge>
      </v-btn>
    </template>
    <v-form @submit.stop.prevent="onApplyClick">
      <v-card>

        <!-- TITLE -->
        <v-card-title class="justify-space-between py-2">
          <div class="d-flex align-center">
            <v-icon small left>mdi-filter-variant</v-icon>
            <span class="subtitle-1">Filter by <span class="font-weight-bold" v-text="header.text"></span></span>
          </div>

          <v-btn color="error" class="ml-6" :disabled="!currentFilter.value" outlined small @click="onClearClick">
            <span v-text="$t('btn.clear')"></span>
          </v-btn>
        </v-card-title>

        <v-card-text class="background pa-3">

          <!-- TEXT -->
          <template v-if="!header.filterable.type || header.filterable.type === 'text'">
            <v-text-field
              v-bind="{...header.filterable.attrs}"
              v-model="currentFilter.value"
              :placeholder="$t('placeholder.typeValueHere')"
              :background-color="$vuetify.theme.dark ? null : 'white'"
              hide-details
              single-line
              dense
              outlined
              clearable
              autofocus
              type="text"
            ></v-text-field>
          </template>

          <!-- BOOLEAN -->
          <template v-else-if="header.filterable.type === 'boolean'">
            <v-switch
              v-bind="{...header.filterable.attrs}"
              v-model="currentFilter.value"
              hide-details
              inset
              class="my-0 mx-2 mb-1"
              :label="currentFilter.value ? 'True' : 'False'"
            >
            </v-switch>
          </template>

          <!-- NUMBER -->
          <template v-else-if="header.filterable.type === 'number'">
            <v-text-field
                v-bind="{...header.filterable.attrs}"
                v-model="currentFilter.value"
                :placeholder="$t('placeholder.typeValueHere')"
                :background-color="$vuetify.theme.dark ? null : 'white'"
                hide-details
                single-line
                outlined
                dense
                clearable
                autofocus
                type="number"
            />
          </template>

          <!-- RANGE -->
          <template v-else-if="header.filterable.type === 'range'">
            <v-range-slider
              v-bind="{...header.filterable.attrs}"
              v-model="currentFilter.value"
              :max="header.filterable.min || 100"
              :min="header.filterable.max || 0"
              hide-details
              class="align-center"
              style="min-width: 400px;"
            >
              <template #prepend>
                <v-text-field
                  :value="currentFilter.value[0]"
                  :background-color="$vuetify.theme.dark ? null : 'white'"
                  class="mt-0 pt-0"
                  hide-details
                  single-line
                  outlined
                  dense
                  type="number"
                  style="min-width: 4rem"
                  @change="$set(currentFilter.value, 0, $event)"
                ></v-text-field>
              </template>
              <template #append>
                <v-text-field
                  :value="currentFilter.value[1]"
                  :background-color="$vuetify.theme.dark ? null : 'white'"
                  class="mt-0 pt-0"
                  hide-details
                  single-line
                  outlined
                  dense
                  type="number"
                  style="min-width: 4rem"
                  @change="$set(currentFilter.value, 1, $event)"
                ></v-text-field>
              </template>
            </v-range-slider>
          </template>

          <!-- DATE -->
          <template v-else-if="header.filterable.type === 'date'">
    <!--        <v-text-field-->
    <!--            v-model="_dateRangeText"-->
    <!--            prepend-icon="mdi-calendar"-->
    <!--            readonly-->
    <!--        ></v-text-field>-->
            <v-date-picker
                v-bind="{...header.filterable.attrs}"
                v-model="currentFilter.value"
                range
                full-width
                style="max-width: 20rem"
            ></v-date-picker>
          </template>

          <!-- DISTINCT -->
          <template v-else-if="header.filterable.type === 'distinct'">
            <v-select
              v-bind="{...header.filterable.attrs}"
              v-model="currentFilter.value"
              :items="header.filterable.items"
              :placeholder="$t('placeholder.chooseValue')"
              :background-color="$vuetify.theme.dark ? null : 'white'"
              hide-details
              dense
              multiple
              clearable
              style="width: 20rem"
              outlined
            />
          </template>

          <!-- ENUM -->
          <template v-else-if="header.filterable.type === 'enum'">
            <v-select
              v-bind="{...header.filterable.attrs}"
              v-model="currentFilter.value"
              :items="header.filterable.items"
              :placeholder="$t('placeholder.chooseValue')"
              :background-color="$vuetify.theme.dark ? null : 'white'"
              hide-details
              dense
              multiple
              clearable
              style="width: 20rem"
              outlined
            />
          </template>

          <!-- UNSUPPORTED -->
          <template v-else>
            <v-alert outlined prominent border="left" type="error">
              {{$t('datatable.filter.unsupported', {type: header.filterable.type})}}
            </v-alert>
          </template>
        </v-card-text>

        <!-- ACTIONS -->
        <v-card-actions class="d-flex justify-end" style="gap: 0.5rem">
          <v-btn :disabled="!isDifferent" color="primary" small @click="onApplyClick">
            <span v-text="$t('btn.apply')"></span>
          </v-btn>
          <v-btn text small @click="onCancelClick">
            <span v-text="$t('btn.cancel')"></span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-menu>
</template>

<script lang="ts">
import {Component, Emit, VModel, Prop, Vue, Watch} from 'vue-property-decorator';

interface Filter {
  field?: string,
  operator?: string,
  value?: any,
}

@Component({})
export default class DataTableColumnFilter extends Vue {

  @VModel({
    default: () => []
  }) filters!: Array<Filter>;

  @Prop({
    default: () => ({
      filterable: {
        type: 'text'
      }
    })
  }) private header!: any;

  @Prop({ type: Boolean, default: false }) showLabel: boolean;

  currentFilter: Filter = {}
  menu = false;

  @Watch('filters', {
    immediate: true,
    deep: true,
  })
  onFiltersChanged(filters: Array<Filter>) {
    this.applyValue();
  }

  @Watch('menu', {
    immediate: true,
  })
  onMenuChanged(menu: boolean) {
    if (menu) {
      this.applyValue();
    }
  }

  get hasValue(): boolean {
    return (
      (!Array.isArray(this.currentFilter.value) && this.currentFilter.value)
      || (Array.isArray(this.currentFilter.value) && this.currentFilter.value.filter(item => item !== null).length > 0)
    );
  }

  get originalHasValue(): boolean {
    const filter = this.getFilter(false) || {};
    return (
      (!Array.isArray(filter.value) && filter.value)
      || (Array.isArray(filter.value) && filter.value.filter(item => item !== null).length > 0)
    );
  }

  get isDifferent(): boolean {
    const original = JSON.stringify(this.getFilter(false) || {});
    const current = JSON.stringify(this.currentFilter);
    return original !== current;
  }

  applyValue(): void {
    try {
      this.currentFilter = JSON.parse(JSON.stringify(this.getFilter(true) || {}));
    } catch {
      this.currentFilter = {};
    }
  }

  getFilter(create = false): Filter | undefined {
    let filter = this.filters.find((item: any) => item.field === this.header.value);
    if (create && !filter) {
      let operator;
      const value = this.getResetValue();
      switch (this.header.filterable.type) {
        case 'date':
          operator = 'between';
          break;
      }

      operator = this.header.filterable.operator || operator || 'equals';

      filter = {
        operator,
        field: this.header.value,
        value,
      };
      this.filters.push(filter);
    }
    return filter;
  }

  getResetValue(): Array<null> | null {
    if (this.header.filterable.type === 'date') {
      return [];
    } else if (this.header.filterable.type === 'range') {
      return [null, null];
    }
    return null;
  }

  onCancelClick() {
    this.cancel();
  }

  onApplyClick() {
    this.apply();
  }

  onClearClick() {
    this.reset();
  }

  @Emit()
  cancel() {
    this.menu = false;
  }

  @Emit()
  apply() {
    this.menu = false;
    const filter = this.getFilter(false);
    if (filter) {
      filter.value = this.currentFilter.value;
    }
    return filter;
  }

  @Emit()
  reset() {
    this.menu = false;
    const filter = this.getFilter(false);
    if (filter) {
      filter.value = this.getResetValue();
    }
    return filter;
  }


}
</script>
