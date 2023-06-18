<template>
    <calendar-heatmap
        :values="values"
        :range-color="colors"
        :end-date="endDate"
        :locale="locale"
        @day-click="onDayClick"
    />
</template>

<script lang="ts">
import { Vue, Component, VModel } from 'vue-property-decorator'
import { CalendarHeatmap } from 'vue-calendar-heatmap'
import Gradient from 'javascript-color-gradient';
import moment from 'moment';

@Component({
    components: {
        CalendarHeatmap,
    }
})
export default class ContributionGraph extends Vue {

    @VModel({ default: () => ([])}) values!: Array<{ date: string | Date, count: number }>

    endDate = new Date()

    get colors(): Array<string> {
        const firstColor = this.$vuetify.theme.dark ? '#333333' : '#EEEEEE';
        const colors = new Gradient()
            .setColorGradient(firstColor, this.$vuetify.theme.themes.light.primary)
            .setMidpoint(5)
            .getColors();
        colors.unshift(firstColor);
        return colors;
    }

    get locale() {
        return {
            months: moment.monthsShort(),
            days: moment.weekdaysShort(),
            on: this.$i18n.t('contribution.on'),
            less: this.$i18n.t('contribution.less'),
            more: this.$i18n.t('contribution.more')
        }
    }

    onDayClick(props: any) {
        this.$emit('day:click', props);
    }
}
</script>

<style lang="scss" scoped>
.vch__wrapper {
    overflow: hidden !important;
}
.theme--dark .vch__wrapper ::v-deep .vch__day__square {
    fill: rgba(255, 255, 255, 0.1);
}
.theme--light .vch__wrapper ::v-deep .vch__day__square {
    fill: rgba(0, 0, 0, 0.1);
}
</style>
