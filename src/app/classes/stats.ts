import inscs from '../../assets/inscriptions.json';

export class JavStats {
    jav: any = {};
    weap: any[] = [{}, {}];
    gear: any[] = [{}, {}];
    comp: any[] = [{}, {}, {}, {}, {}, {}];
    supp: any[] = [{}];

    constructor() {
        inscs.forEach(i => {
            this.initStat(this.jav, i);
            this.weap.forEach(j => this.initStat(j, i));
            this.gear.forEach(j => this.initStat(j, i));
            this.comp.forEach(j => this.initStat(j, i));
            this.initStat(this.supp[0], i);
        });
    }

    private initStat(k, i) {
        if (!(i.type in k)) { k[i.type] = {}; }
        k[i.type][i.stat || ''] = 0;
    }
}

export class Stats {
    colossus: JavStats[] = [];
    interceptor: JavStats[] = [];
    ranger: JavStats[] = [];
    storm: JavStats[] = [];

    constructor() {
        ['colossus', 'interceptor', 'ranger', 'storm'].forEach(c => {
            [0, 1, 2, 3].forEach(s => {
                this[c][s] = new JavStats();
            });
        });
    }
}
