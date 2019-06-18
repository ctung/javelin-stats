import { State, Action, StateContext, Selector } from '@ngxs/store';
import weapons from '../assets/weapons.json';
import gear from './../assets/gear.json';
import components from './../assets/components.json';
import support from './../assets/support.json';
import sigils from './../assets/sigils.json';
import inscs from './../assets/inscriptions.json';
import { Inscription } from './classes/inscription';
import { Items } from './classes/item';
import { Stats } from './classes/stats';
import { Javelins, Javelin } from './classes/javelin.js';
import { ItemService } from './services/item.service';
import { JavelinService } from './services/javelin.service';
import { take } from 'rxjs/operators';
import {
    InitStore,
    SelJav,
    SetJavItem,
    SetJavName,
    ToggleBuff,
    ToggleDebuff,
    ResetJav,
    DelItem,
    AddItem
} from './jav.actions';

export interface JavStateModel {
    itemDb: Items;
    inscs: Inscription[];
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
        javSlot: number
    };
    stats: Stats;
}

@State<JavStateModel>({
    name: 'javelins',
    defaults: {
        itemDb: { weap: weapons, gear, comp: components, supp: support, sigils },
        inscs,
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
            javSlot: null
        },
        stats: new Stats()
    }
})

export class JavState {

    constructor(
        private itemService: ItemService,
        private javelinService: JavelinService
    ) { }

    @Selector()
    static selectedJav(state: JavStateModel) {
        return state.javelins[state.selected.javClass][state.selected.javSlot];
    }

    @Selector()
    static selectedStats(state: JavStateModel) {
        return state.stats[state.selected.javClass][state.selected.javSlot];
    }

    @Selector()
    static selectedItem(state: JavStateModel) {
        return (type: string, slot: number) => {
            return state.javelins[state.selected.javClass][state.selected.javSlot][type][slot];
        };
    }


    @Action(InitStore)
    InitStore(ctx: StateContext<JavStateModel>) {
        this.itemService.getSavedItems().pipe(take(1))
            .subscribe(newValue => ctx.patchState({ savedItems: newValue }));
        this.javelinService.getJavelins().pipe(take(1))
            .subscribe(newValue => ctx.patchState({ javelins: newValue }));
    }

    @Action(SelJav)
    SelJav(ctx: StateContext<JavStateModel>, action: SelJav) {
        ctx.patchState({
            selected: {
                javClass: action.javClass,
                javSlot: action.javSlot
            }
        });
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

    @Action(ToggleDebuff)
    ToggleDebuff(ctx: StateContext<JavStateModel>, action: ToggleBuff) {
        const state = JSON.parse(JSON.stringify(ctx.getState()));
        const jav = state.javelins[state.selected.javClass][state.selected.javSlot];
        jav.debuff[action.type] = jav.debuff[action.type] === 0 ? 1 : 0;
        ctx.setState(state);
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
        const items = JSON.parse(JSON.stringify(ctx.getState().savedItems));
        items[action.type] = items[action.type].filter(item => item.idx !== action.idx);
        ctx.patchState({ savedItems: items });
        this.itemService.delItem(action.idx);
        localStorage.setItem('items', JSON.stringify(items));
    }

    @Action(AddItem)
    AddItem(ctx: StateContext<JavStateModel>, action: AddItem) {
        const items = JSON.parse(JSON.stringify(ctx.getState().savedItems));
        this.itemService.addItem(action.type, action.item).pipe(take(1))
            .subscribe(idx => {
                if (idx) {
                    action.item.idx = idx;
                    items[action.type] = items[action.type].filter(obj => obj.idx !== action.item.idx);
                    items[action.type].push(action.item);
                    ctx.patchState({ savedItems: items });
                    localStorage.setItem('items', JSON.stringify(items));
                }
            });

    }
}
