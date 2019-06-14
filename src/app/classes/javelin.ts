import { Item, CompactItem } from './item';

export class CompactJavelin {
    slot: number;
    class: string;
    name: string;
    weap: CompactItem[];
    gear: CompactItem[];
    comp: CompactItem[];
    supp: CompactItem[];
    sigils: CompactItem[];
    debuffs?: any;

    constructor(c: string, s: number, n: string) {
        this.class = c;
        this.slot = s;
        this.name = n;
        this.weap = [];
        this.gear = [];
        this.comp = [];
        this.supp = [];
        this.sigils = [];
        this.debuffs = { acid: false, beacon: false };
    }
}

export class Javelins {
    colossus: [Javelin, Javelin, Javelin, Javelin];
    interceptor: [Javelin, Javelin, Javelin, Javelin];
    ranger: [Javelin, Javelin, Javelin, Javelin];
    storm: [Javelin, Javelin, Javelin, Javelin];

    constructor() {
        ['colossus', 'interceptor', 'ranger', 'storm'].forEach(c => {
            this[c] = [];
            [1, 2, 3].forEach(i => {
                this[c][i] = new Javelin(c, i, 'loadout ' + i);
            });
        });
    }
}

export class Javelin {
    slot: number;
    class: string;
    name: string;
    weap: Item[];
    gear: Item[];
    comp: Item[];
    supp: Item[];
    sigils: Item[];
    debuffs?: any;

    constructor(c: string, s: number, n: string) {
        this.class = c;
        this.slot = s;
        this.name = n;
        this.weap = [];
        this.gear = [];
        this.comp = [];
        this.supp = [];
        this.sigils = [];
        this.debuffs = { acid: false, beacon: false };
    }
}
