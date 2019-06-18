import { Item } from './classes/item';

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

export class ToggleDebuff {
    static readonly type = '[stats] ToggleDebuff';
    constructor(public debuff: string) { }
}

export class ResetJav {
    static readonly type = '[javelins] ResetJav';
}

export class DelItem {
    static readonly type = '[inventory] DelItem';
    constructor(public type: string, public idx: number) { }
}

export class AddItem {
    static readonly type = '[javelins] AddItem';
    constructor(public type: string, public item: Item) { }
}
