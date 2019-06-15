import { State, Action, StateContext, createSelector, Selector } from '@ngxs/store';
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

export interface ItemSelector {
    javClass: string;
    javSlot: number;
    type: string;
    slot: number;
    item: Item;
}


export class InitStore {
    static readonly type = '[app] InitStore';
}

export class SetJavItem {
    static readonly type = '[equipped] SetJavItem';
    constructor(public itemSelector: ItemSelector, item: Item) { }
}

export class SetJavName {
    static readonly type = '[stats] SetJavName';
    constructor(public javClass: string, javSlot: number, name: string) { }
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


    static items(javClass: string, type: string, slot: number) {
        return createSelector([JavState], (state: JavStateModel) => {
            return state.savedItems[type]
                .filter(s => s.class === javClass || s.class === 'universal')
                .filter(s => type === 'gear' || s.slot === slot)
                .map(s => { s.text = s.name; return s; })
                .sort((a, b) => (a.name > b.name) ? 1 : -1);
        });
    }

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
        console.log(action.itemSelector);
        const i = action.itemSelector;
        const state = JSON.parse(JSON.stringify(ctx.getState()));
        state.javelins[i.javClass][i.javSlot][i.type][i.slot] = i.item;
        ctx.setState(state);
        this.javelinService.save(state.javelins);
    }

    @Action(SetJavName)
    SetJavName(ctx: StateContext<JavStateModel>, javClass: string, javSlot: number, name: string) {
        const state = ctx.getState();
        state.javelins[javClass][javSlot].name = name;
        ctx.setState(state);
        this.javelinService.save(state.javelins);
    }

}
