import { State, Action, StateContext } from '@ngxs/store';
import weapons from '../assets/weapons.json';
import gear from './../assets/gear.json';
import components from './../assets/components.json';
import support from './../assets/support.json';
import sigils from './../assets/sigils.json';
import { Item, Items } from './classes/item';
import { Javelins, Javelin } from './classes/javelin.js';
import { ItemService } from './services/item.service';
import { DatabaseService } from './services/database.service';
import { JavelinService } from './services/javelin.service';
import { take } from 'rxjs/operators';

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
    selected: {
        javClass: string,
        javSlot: number,
    };
}

export class InitStore {
    static readonly type = '[app] InitStore';
}

export class SelJav {
    static readonly type = '[javelins] SelJav';
    constructor(public javClass: string, public javSlot: number) { }
}

export class SetJavItem {
    static readonly type = '[equipped] SetJavItem';
    constructor(public type: string, public slot: number, public item: Item) { }
}

export class SetJavName {
    static readonly type = '[stats] SetJavName';
    constructor(public name: string) { }
}

export class ToggleBuff {
    static readonly type = '[equipped] ToggleBuff';
    constructor(public type: string, public slot: number) { }
}

export class ResetJav {
    static readonly type = '[javelins] ResetJav';
}

export class DelItem {
    static readonly type = '[inventory] DelItem';
    constructor(public type: string, public idx: number) { }
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
        },
        selected: {
            javClass: null,
            javSlot: null,
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
        this.itemService.getSavedItems().pipe(take(1))
            .subscribe(newValue => ctx.patchState({ savedItems: newValue }));
        this.javelinService.getJavelins().pipe(take(1))
            .subscribe(newValue => ctx.patchState({ javelins: newValue }));
    }

    @Action(SelJav)
    SelJav(ctx: StateContext<JavStateModel>, action: SelJav) {
        ctx.patchState({ selected: { javClass: action.javClass, javSlot: action.javSlot } });
    }

    @Action(SetJavItem)
    SetJavItem(ctx: StateContext<JavStateModel>, action: SetJavItem) {
        const state = JSON.parse(JSON.stringify(ctx.getState()));
        state.javelins[state.selected.javClass][state.selected.javSlot][action.type][action.slot] = action.item;
        ctx.setState(state);
        this.javelinService.save(state.javelins);
    }

    @Action(SetJavName)
    SetJavName(ctx: StateContext<JavStateModel>, action: SetJavName) {
        const state = JSON.parse(JSON.stringify(ctx.getState()));
        state.javelins[state.selected.javClass][state.selected.javSlot].name = action.name;
        ctx.setState(state);
        this.javelinService.save(state.javelins);
    }

    @Action(ToggleBuff)
    ToggleBuff(ctx: StateContext<JavStateModel>, action: ToggleBuff) {
        const state = JSON.parse(JSON.stringify(ctx.getState()));
        const item = state.javelins[state.selected.javClass][state.selected.javSlot][action.type][action.slot];
        item.bactive = !item.bactive;
        ctx.setState(state);
        this.javelinService.save(state.javelins);
    }

    @Action(ResetJav)
    ResetJav(ctx: StateContext<JavStateModel>) {
        const state = JSON.parse(JSON.stringify(ctx.getState()));
        const javClass = state.selected.javClass;
        const javSlot = state.selected.javSlot;
        const name = state.javelins[javClass][javSlot].name;
        if (javClass) {
            state.javelins[javClass][javSlot] = new Javelin(javClass, javSlot, name);
            ctx.setState(state);
            this.javelinService.save(state.javelins);
        }
    }

    @Action(DelItem)
    DelItem(ctx: StateContext<JavStateModel>, action: DelItem) {
        const state = JSON.parse(JSON.stringify(ctx.getState()));
        const items = state.savedItems;
        items[action.type] = items[action.type].filter(item => item.idx !== action.idx);
        ctx.patchState({ savedItems: items });
        this.itemService.delItem(action.idx);
        localStorage.setItem('items', JSON.stringify(items));
    }
}
