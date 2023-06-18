// eslint-disable-next-line no-extend-native
Object.defineProperty(Object.prototype, 'nestedProp', {
    value: function (prop: ((context: string) => string) | string) {
        let item: any = this;

        if (prop instanceof Function) {
            return prop(item);
        } else if (item[prop] !== undefined) {
            return item[prop];
        } else {
            const props = prop.split('.');
            for (let i = 0; i < props.length; i++) {
                const p = props[i];
                if (item[p]) {
                    item = item[p];
                } else {
                    return undefined;
                }
            }
            return item;
        }
    }
});
