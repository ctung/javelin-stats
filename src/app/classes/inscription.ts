export class Inscription {
    id: number;
    type?: string;
    value: number;
    stat?: string;
    scope: number;
    png?: string;
    active?: boolean;
    deprecated?: boolean;
    text?: string;

    constructor() {
        this.id = null;
        this.value = null;
        this.scope = 1;
        this.png = 'jav.png';
    }
}
