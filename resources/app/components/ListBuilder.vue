<template>
  <div class="list-builder">

    <!-- SORTABLE LIST OF ITEMS -->
    <draggable
      v-model="_value"
      :sort="sortable"
      :animation="200"
      handle=".handle"
      @start="onDragStart"
      @end="onDragStop"
    >
      <transition-group
        :name="!drag ? 'flip-list' : null"
        type="transition"
      >
        <v-row
          v-for="(item, itemIdx) in _value"
          :key="isModel ? item.autoIncrementId : itemIdx"
        >
          <v-col v-if="_sortable" class="d-flex align-start pt-6 shrink">
            <v-icon class="handle">mdi-drag-vertical</v-icon>
          </v-col>
          <v-col class="d-flex align-center grow">
            <slot
              name="item"
              :item="item"
              :index="itemIdx"
              :parent="parent"
            >
              <v-text-field
                v-model="item.data.label"
                clearable
                outlined
                dense
                hide-details
              />
            </slot>
          </v-col>

          <!-- ACTIONS -->
          <v-col class="d-flex align-start pt-4 shrink">
            <slot name="actions">
              <v-tooltip bottom>
                <template #activator="{ on, attrs }">
                  <v-btn
                    v-bind="attrs"
                    v-on="on"
                    color="error"
                    fab
                    x-small
                    :disabled="itemIdx < min"
                    @click="() => onRemove(itemIdx)"
                  >
                    <v-icon>mdi-minus</v-icon>
                  </v-btn>
                </template>
                <span v-text="_labels.remove"></span>
              </v-tooltip>
            </slot>
          </v-col>
        </v-row>
      </transition-group>
    </draggable>

    <!-- NO ITEM -->
    <v-alert
      v-if="value.length === 0"
      text
      dense
      type="info"
    >
      <span v-text="_labels.empty"></span>
    </v-alert>

    <!-- ADD -->
    <v-row>
      <v-col v-if="_sortable" class="shrink" style="min-width: 48px">

      </v-col>
      <v-col class="grow">
        <v-btn :disabled="disabled" color="primary" outlined block @click="onAdd">
          <v-icon left>mdi-plus</v-icon>
          <span v-text="_labels.add"></span>
        </v-btn>
      </v-col>
      <v-col v-if="value.length > min" class="shrink" style="min-width: 56px">

      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import draggable from 'vuedraggable';
import Model from '@/zemit/core/model';
import { Vue, Component, Prop } from 'vue-property-decorator';
import { PropType } from 'vue';

@Component({
  components: {
    draggable
  }
})
export default class ListBuilder extends Vue {
  @Prop({
    type: Array as PropType<Array<Model>>,
    default: () => []
  }) private value!: Array<Model>

  @Prop({
    type: Object as PropType<Model>,
    default: () => new Model(),
  }) private parent?: Model

  @Prop({
    type: Boolean,
    default: false,
  }) sortable?: boolean

  @Prop({
    default: null,
  }) defaultModel?: any

  @Prop({
    default: null,
  }) defaultItem?: any

  @Prop({
    default: null,
  }) defaultData?: any

  @Prop({
    type: Object,
    default: () => ({}),
  }) labels?: any

  @Prop({
    type: String,
  }) orderBy?: string

  @Prop({
    type: Number,
    default: 0,
  }) min?: number

  @Prop({
    type: Boolean,
    default: false,
  }) disabled!: boolean

  drag = false

  get _value(): Array<Model> {
    const orderBy = this.orderBy;
    if (orderBy) {
      return this.value.sort((a, b) => a.data[orderBy] > b.data[orderBy] ? 1 : -1);
    }
    return this.value;
  }

  set _value(value: Array<Model>) {
    const orderedValues = value.map((item: any, itemIdx) => {
      item.position = itemIdx;
      item.data.position = itemIdx;
      return item;
    })
    this.$emit('input', orderedValues);
  }

  get _sortable(): boolean {
    return !!(this.sortable && this.value.length > 1);
  }

  get _labels(): any {
    return Object.assign({}, {
      add: this.$t('btn.add'),
      remove: this.$t('btn.remove'),
      empty: this.$t('state.empty'),
    }, this.labels);
  }

  get isModel(): boolean {
    return !!(this.defaultModel);
  }

  onAdd(): void {
    const newValue = this.defaultModel
      ? new this.defaultModel(this.defaultData)
      : JSON.parse(JSON.stringify(this.defaultItem));
    if (this.defaultModel && this.orderBy) {
      newValue.data[this.orderBy] = this.value.length;
    }
    this._value.push(newValue);
  }

  onRemove(index: number): void {
    this._value.splice(index, 1);
  }

  onDragStart(): void {
    this.drag = true;
  }

  onDragStop(): void {
    this.drag = false;
  }
}
</script>

<style lang="scss" scoped>
.handle {
  cursor: move;
}
.flip-list-move {
  transition: transform 0.5s;
}
.no-move {
  transition: transform 0s;
}
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
</style>
