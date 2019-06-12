import { State } from '@ngxs/store';
import weapons from '../assets/weapons.json';
import gear from './../assets/gear.json';
import components from './../assets/components.json';
import support from './../assets/support.json';
import sigils from './../assets/sigils.json';
import { Item } from './classes/item';


export interface JavStateModel {
    itemDb: { weap: Item[], gear: Item[], comp: Item[], supp: Item[], sigils: Item[]};
}


@State<JavStateModel>({
    name: 'javelins',
    defaults: {
        itemDb: { weap: weapons, gear, comp: components, supp: support, sigils }
    }
})


export class JavState {}
