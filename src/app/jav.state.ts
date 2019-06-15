import { State, Action, StateContext } from '@ngxs/store';
import weapons from '../assets/weapons.json';
import gear from './../assets/gear.json';
import components from './../assets/components.json';
import support from './../assets/support.json';
import sigils from './../assets/sigils.json';
import { Item, Items } from './classes/item';
import { Javelins } from './classes/javelin.js';
import { ItemService } from './services/item.service';
import { DatabaseService } from './services/database.service';
import { JavelinService } from './services/javelin.service';

export interface JavStateModel {
    itemDb: Items;
    javelins: Javelins;
    savedItems: Items;
    baseValues: {
        colossus: any,
        interceptor: any,
        ranger: any,
        storm: any
    };
}

export class InitStore {
    static readonly type = '[app] InitStore';
}

export class SetJavItem {
    static readonly type = '[equipped] SetJavItem';
    constructor(
        public javClass: string,
        public javSlot: number,
        public type: string,
        public slot: number,
        public item: Item) { }
}

export class SetJavName {
    static readonly type = '[stats] SetJavName';
    constructor(
        public javClass: string,
        public javSlot: number,
        public name: string) { }
}

export class ToggleBuff {
    static readonly type = '[equipped] ToggleBuff';
    constructor(
        public javClass: string,
        public javSlot: number,
        public type: string,
        public slot: number) {}
}

@State<JavStateModel>({
    name: 'javelins',
    defaults: {
        itemDb: { weap: weapons, gear, comp: components, supp: support, sigils },
        savedItems: new Items(),
        javelins: new Javelins(),
        baseValues: {
            colossus: {
                mdmg: 170,
                mstype: 'Physical',
                mtype: 'Kinetic',
                armor: 600,
                shield: 200
            },
            interceptor: {
                mdmg: 25,
                mstype: 'Physical',
                mtype: 'Kinetic',
                armor: 600,
                shield: 200
            },
            ranger: {
                mdmg: 100,
                mstype: 'Elemental',
                mtype: 'Elec',
                armor: 600,
                shield: 200
            },
            storm: {
                mdmg: 150,
                mstype: 'Elemental',
                mtype: 'Fire',
                armor: 600,
                shield: 200
            }
        }
    }
})

export class JavState {

    constructor(
        private itemService: ItemService,
        private db: DatabaseService,
        private javelinService: JavelinService
    ) { }

    @Action(InitStore)
    InitStore(ctx: StateContext<JavStateModel>) {
        this.itemService.getSavedItems()
            .subscribe(newValue => {
                ctx.patchState({ savedItems: newValue });
            });
        this.javelinService.getJavelins()
            .subscribe(newValue => {
                ctx.patchState({ javelins: newValue });
            });
    }

    @Action(SetJavItem)
    setJavItem(ctx: StateContext<JavStateModel>, action: SetJavItem) {
        const state = JSON.parse(JSON.stringify(ctx.getState()));
        state.javelins[action.javClass][action.javSlot][action.type][action.slot] = action.item;
        ctx.setState(state);
        this.javelinService.save(state.javelins);
    }

    @Action(SetJavName)
    SetJavName(ctx: StateContext<JavStateModel>, action: SetJavName) {
        const state = JSON.parse(JSON.stringify(ctx.getState()));
        state.javelins[action.javClass][action.javSlot].name = action.name;
        ctx.setState(state);
        this.javelinService.save(state.javelins);
    }

    @Action(ToggleBuff)
    ToggleBuff(ctx: StateContext<JavStateModel>, action: ToggleBuff) {
        const state = JSON.parse(JSON.stringify(ctx.getState()));
        const item = state.javelins[action.javClass][action.javSlot][action.type][action.slot];
        item.bactive = !item.bactive;
        ctx.setState(state);
        this.javelinService.save(state.javelins);
    }
}
