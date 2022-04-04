import Hash from './Hash';

const subscriptions: any = {};

const EventBus = {

    subscribe(eventType: string, callback?: () => void) {
        const id = Hash.guid();

        if(!subscriptions[eventType]) {
            subscriptions[eventType] = {};
        }

        subscriptions[eventType][id] = callback;

        return {
            unsubscribe: () => {

                delete subscriptions[eventType][id];

                if(Object.keys(subscriptions[eventType]).length === 0) {
                    delete subscriptions[eventType]
                }
            }
        }
    },

    publish(eventType: string, arg?: any) {
        if(!subscriptions[eventType]) {
            return;
        }

        Object.keys(subscriptions[eventType]).forEach(key => {
        	subscriptions[eventType][key](arg);
		});
    },
};

export default EventBus;
