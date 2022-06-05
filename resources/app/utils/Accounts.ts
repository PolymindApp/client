import { VueConstructor } from 'vue';
import globalVariables from '@/global';

export default {
    install: function (Vue: VueConstructor) {
        Vue.prototype.$accounts = {
            load(): any[] {
                const accounts: any[] = [];
                const jsonStr = localStorage.getItem('accounts');
                if (jsonStr) {
                    try {
                        const json = JSON.parse(jsonStr);
                        return json;
                    } catch(e) {
                        return accounts;
                    }
                }
                return accounts;
            },
            save(accounts: any[]) {
                try {
                    const jsonStr = JSON.stringify(accounts);
                    localStorage.setItem('accounts', jsonStr);
                } catch(e) {

                }
            },
            set(account: any) {
                const accounts = this.load();
                const found = accounts.find((item: any) => item.email === account.email);
                if (!found) {
                    accounts.push(account);
                    this.save(accounts);
                } else {
                    Object.assign(found, account);
                    this.save(accounts);
                }
                return accounts;
            }
        };
    }
};
