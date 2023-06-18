<template>
    <v-row no-gutters style="gap: 1rem">
        <v-col
            v-for="item in itemComponents"
            :key="item.model.data.id"
            :style="{
                minWidth: $vuetify.breakpoint.mdAndUp ? '12rem' : null,
                maxWidth: $vuetify.breakpoint.mdAndUp ? '16rem' : '30rem',
            }"
        >
            <v-card
                :color="selectedItems.find(selected => item.model.data.id === selected.data.id) ? 'primary' : null"
                @click.stop="onCardClick(item.model)"
            >
                <template v-for="field in item.fields">
                    <v-sheet v-if="field.value instanceof MediaModel">
                        <v-img
                            :src="field.value.data.url"
                            aspect-ratio="1"
                        >
                            <template #default>
                                <div class="w-100 pa-1 d-flex justify-space-between">
                                    <v-btn icon color="error" :disabled="!canDelete" @click.stop="onDeleteClick(item.model)">
                                        <v-icon>mdi-delete</v-icon>
                                    </v-btn>
                                    <v-checkbox
                                        :value="selectedItems.find(selected => item.model.data.id === selected.data.id)"
                                        class="mt-2 pa-0"
                                        hide-details
                                        readonly
                                    />
                                </div>
                            </template>
                            <template #placeholder>
                                <v-skeleton-loader type="image" />
                            </template>
                        </v-img>
                    </v-sheet>
                    <v-card-text v-else :class="[{
                        'text-truncate': field.header.truncate,
                    }, field.header.class]">
                        <div v-if="Array.isArray(field.value)" class="d-flex align-center" style="gap: 0.5rem">
                            <v-chip
                                v-for="item in field.value"
                                v-text="item.nestedProp(item.itemValue || 'data.name')"
                                :key="item.data.id"
                                x-small
                            ></v-chip>
                        </div>
                        <span v-else v-text="field.value"></span>
                    </v-card-text>
                </template>
                <v-card-actions class="justify-space-between">
                    <v-btn block :disabled="!canEdit" :outlined="!$vuetify.theme.dark" @click.stop="onEditClick(item.model)">
                        <v-icon left>mdi-pencil</v-icon>
                        <span v-text="$t('btn.edit')"></span>
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-col>
    </v-row>
</template>

<script lang="ts">
import { Vue, Component, VModel, Prop, Emit } from 'vue-property-decorator';
import MediaModel from '@/models/MediaModel';
import BaseModel from '@/models/BaseModel';

@Component
export default class DataCards extends Vue {

    @VModel({ default: () => ([]) }) selectedItems: Array<any>
    @Prop({ default: () => ([]) }) headers!: Array<any>
    @Prop({ default: () => ([]) }) items!: Array<any>
    @Prop({ type: Boolean, default: false }) canEdit: boolean
    @Prop({ type: Boolean, default: false }) canDelete: boolean

    MediaModel = MediaModel

    get itemComponents(): Array<any> {
        return this.items.map((item: any) => {
            return {
                model: item,
                fields: this.headers.map((header: any) => {
                    const valueKey = header.value;
                    let value = item.nestedProp(valueKey);
                    return {
                        value,
                        valueKey,
                        header,
                    };
                })
            }
        });
    }

    onCardClick(model: BaseModel): void {
        const index = this.selectedItems.findIndex(selected => selected.data.id === model.data.id);
        if (index >= 0) {
            this.selectedItems.splice(index, 1);
        } else {
            this.selectedItems.push(model);
        }
    }

    onEditClick(item: BaseModel): void {
        this.edit(item);
    }

    onDeleteClick(item: BaseModel): void {
        this.delete(item);
    }

    @Emit()
    edit(item: BaseModel): BaseModel {
        return item;
    }

    @Emit()
    delete(item: BaseModel): BaseModel {
        return item;
    }
}
</script>

<style lang="scss" scoped>

</style>
