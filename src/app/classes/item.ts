import { Inscription } from './inscription';

export class CompactItem {
    id: number;
    i: any[];
    bactive?: boolean;
    idx?: number;
}

export class Items {
    weap: Item[];
    gear: Item[];
    comp: Item[];
    supp: Item[];
    sigils?: Item[];

    constructor() {
        this.weap = [];
        this.gear = [];
        this.comp = [];
        this.supp = [];
    }
}

export class Item {
    id: number;
    idx?: number;
    name: string;
    power?: number;
    rarity?: string;
    type?: string;
    inscs?: Inscription[];
    class: string;
    base?: string;
    description?: string;
    special?: string;
    specialDesc?: string;
    proc?: any;
    shield?: number;
    armor?: number;
    text?: string;
    itype?: string;
    buff?: string;
    bactive?: boolean;
    buffDetails?: Inscription[];
    cItem?: CompactItem;

    // damage
    kinetic?: number;
    acid?: number;
    fire?: number;
    elec?: number;
    ice?: number;
    blast?: string;
    crit?: number;
    burst?: number;
    dstype0?: string;
    dtype0?: string;
    dmg0?: number;
    blast0?: string;
    dstype1?: string;
    dtype1?: string;
    dmg1?: number;
    blast1?: string;
    procstype?: string;
    proctype?: string;
    procdmg?: number;
    procblast?: string;

    // weapon
    rpm?: number;
    clip?: number;
    reload?: number;
    range?: number;

    // gear
    slot?: number;
    combo?: string;
    recharge?: number;
    duration?: number;
    radius?: number;
    count?: number;
    charges?: number;

    // component:
    scope0?: string;
    type0?: string;
    value0?: number;
    stat0?: string;
    scope1?: string;
    type1?: string;
    value1?: number;
    stat1?: string;
    scope2?: string;
    type2?: string;
    value2?: number;
    stat2?: string;
    scope3?: string;
    type3?: string;
    value3?: number;
    stat3?: string;

    constructor(type: string) {
        const inscRange = (type === 'comp') ? [0, 1] : [0, 1, 2, 3];
        this.id = -1;
        this.name = null;
        this.inscs = inscRange.map(i => new Inscription());
        this.class = 'universal';
        this.type = type;
    }

}
