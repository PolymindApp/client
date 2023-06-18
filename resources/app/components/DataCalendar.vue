<template>
    <div class="d-flex flex-column">
        <v-toolbar style="flex: 0" flat>
            <v-row>
                <v-col cols="12" md="2" class="d-flex align-center" style="gap: 1rem">
                    <v-btn outlined :disabled="!calendarFocus" @click="onCalendarTodayClick">
                        <span v-text="$t('dataManager.calendar.today')"></span>
                    </v-btn>
                </v-col>
                <v-col cols="12" md="8" class="d-flex align-center justify-center" style="gap: 1rem">
                    <v-btn icon @click="onCalendarPreviousClick">
                        <v-icon small>mdi-chevron-left</v-icon>
                    </v-btn>
                    <v-toolbar-title v-if="isMounted">
                        {{ calendar.title }}
                    </v-toolbar-title>
                    <v-btn icon @click="onCalendarNextClick">
                        <v-icon small>mdi-chevron-right</v-icon>
                    </v-btn>
                </v-col>
                <v-col cols="12" md="2" class="d-flex align-center justify-end" style="gap: 1rem">
                    <v-select
                        v-model="_preset.data.meta.calendarType"
                        :items="[
                            { text: $t('dataManager.calendarType.day'), value: 'day', },
                            { text: $t('dataManager.calendarType.week'), value: 'week', },
                            { text: $t('dataManager.calendarType.month'), value: 'month', },
                        ]"
                        :label="$t('label.type')"
                        style="width: 10rem"
                        dense
                        outlined
                        hide-details
                    >
                    </v-select>
                </v-col>
            </v-row>
        </v-toolbar>
        <v-calendar
            v-model="calendarFocus"
            ref="calendar"
            :events="events"
            :type="_preset.data.meta.calendarType"
            color="primary"
            style="flex: 1; border-left: 0"
            @click:event="onEventClick"
            @click:more="onMoreEventClick"
        ></v-calendar>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, PropSync, Ref, Emit } from 'vue-property-decorator';
import DatatablePresetModel from '@/models/DatatablePresetModel';
import BaseModel from '@/models/BaseModel';
import moment from 'moment';

@Component
export default class DataCalendar extends Vue {
    // @ts-ignore
    @Ref() readonly calendar: VCalendar;

    @Prop({ default: () => ([]) }) items!: Array<any>
    @Prop({ default: () => ([]) }) headers!: Array<any>
    @Prop({ type: Boolean, default: false }) canEdit: boolean
    @Prop({ type: Boolean, default: false }) canDelete: boolean
    @Prop({ default: 'data.created_at' }) calendarValue!: string
    @Prop({ default: 'data.name' }) calendarText!: string

    @PropSync('preset', {
        default: () => new DatatablePresetModel({
            meta: {}
        })
    }) _preset!: DatatablePresetModel;

    calendarFocus: string | null = null
    isMounted: boolean = false

    get events(): Array<any> {
        return this.items.map((item: any) => {
            return {
                name: item.nestedProp(this.calendarText),
                start: item.nestedProp(this.calendarValue),
                timed: true,
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

    onCalendarTodayClick(): void {
        this.calendarFocus = null;
    }

    onCalendarPreviousClick(): void {
        if (this.calendar) {
            this.calendar.prev();
        }
    }

    onCalendarNextClick(): void {
        if (this.calendar) {
            this.calendar.next();
        }
    }

    onEventClick(props: any) {
        this.onEditClick(props.event.model);
        props.nativeEvent.stopPropagation();
    }

    onMoreEventClick(props: any) {
        props.nativeEvent.stopPropagation();
        const models: Array<BaseModel> = [];
        this.events.forEach(event => {
            if (moment(event.start).format('YYYY-MM-DD') === props.date) {
                models.push(event.model);
            }
        })
        this.onEditClick(models);
    }

    onEditClick(item: BaseModel | Array<BaseModel>): void {
        this.edit(item);
    }

    onDeleteClick(item: BaseModel | Array<BaseModel>): void {
        this.delete(item);
    }

    mounted() {
        this.isMounted = true;
    }

    @Emit()
    edit(item: BaseModel | Array<BaseModel>): BaseModel | Array<BaseModel> {
        return item;
    }

    @Emit()
    delete(item: BaseModel | Array<BaseModel>): BaseModel | Array<BaseModel> {
        return item;
    }
}
</script>

<style lang="scss" scoped>
.theme--light .v-calendar {
    ::v-deep .v-calendar-weekly__head-weekday,
    ::v-deep .v-calendar-daily_head-weekday {
        background-color: rgba(0, 0, 0, 0.05)
    }
    ::v-deep .v-calendar-daily__day,
    ::v-deep .v-calendar-daily_head-day {
        border-right: 0;
    }
    ::v-deep .v-calendar-daily__day {
        border-bottom: 0;
    }
}
.theme--dark .v-calendar {
    border-top: rgba(255, 255, 255, 0.2) solid 1px !important;

    ::v-deep .v-calendar-weekly__head-weekday,
    ::v-deep .v-calendar-daily_head-weekday {
        background-color: rgba(255, 255, 255, 0.05)
    }
    ::v-deep .v-calendar-weekly__head-weekday {
        border-right: rgba(255, 255, 255, 0.2) solid 1px !important;
    }
    ::v-deep .v-calendar-weekly__day {
        border-right: rgba(255, 255, 255, 0.2) solid 1px !important;
        border-bottom: rgba(255, 255, 255, 0.2) solid 1px !important;
    }

    ::v-deep .v-calendar-daily__day-interval {
        border-top: rgba(255, 255, 255, 0.2) solid 1px !important;
    }
    ::v-deep .v-calendar-daily__day,
    ::v-deep .v-calendar-daily_head-day {
        border-right: 0;
    }
    ::v-deep .v-calendar-daily__day {
        border-bottom: 0;
    }
}
</style>
