// eslint-disable-next-line no-extend-native
Object.defineProperty(Object.prototype, 'nestedProp', {
    value: function (prop: ((context: string) => string) | string) {

        // eslint-disable-next-line @typescript-eslint/no-this-alias
        let item: any = this;

        if (prop instanceof Function) {
          return prop(item);
        } else {

            if (item[prop] !== undefined) {
                return item[prop];
            }

            const props = prop.split('.');
            props.forEach(p => {
                if (item[p]) {
                    item = item[p];
                }
                else {
                    return undefined;
                }
            });
        }

        return item;
    }
});
