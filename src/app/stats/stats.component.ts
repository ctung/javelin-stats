import { Component, Input, OnInit, isDevMode } from '@angular/core';
import { CompactJavelin } from '../classes/javelin';
import { JavelinService } from '../services/javelin.service';
import { BehaviorSubject } from 'rxjs';
import { ItemService } from '../services/item.service';
import { Inscription } from '../classes/inscription';
import { Item } from '../classes/item';
import { DatabaseService } from '../services/database.service';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent implements OnInit {
  @Input() jav: BehaviorSubject<CompactJavelin>;
  stats: any;
  armor: number;
  shield: number;
  gearscore: number;
  aGS: number;
  armorStats: any[];
  shieldStats: any[];
  suppStats: any[];
  dmgStats: any[];
  weapStats: any[];
  weapBuffs: any[];
  gearStats: any[];
  resist: number;
  initialized: boolean;
  devMode: boolean;

  constructor(
    private javelinService: JavelinService,
    private itemService: ItemService,
    private db: DatabaseService
  ) {
    this.devMode = isDevMode();
  }

  ngOnInit() {

    this.jav.subscribe(() => {
      this.stats = this.itemService.initStats();
      this.initialized = true;
      this.resist = 0;
      this.gearscore = 0;
      this.armor = 0;
      this.shield = 0;
      this.weapStats = [];

      if (this.jav.value) {
        if ('debuffs' in this.jav.value) {
          if (this.jav.value.debuffs.beacon) { this.resist -= 33; }
          if (this.jav.value.debuffs.acid) { this.resist -= 25; }
        }
        // console.log(this.jav.value);
        this.parseItemInscriptions(this.jav.value);
        this.stats.jav.Repair['Drop Rate'] += this.stats.jav.Resupply['Drop Rate'];
        this.stats.jav.Ammo['Drop Rate'] += this.stats.jav.Resupply['Drop Rate'];
        this.stats.jav.All.Damage += this.stats.jav.Damage['(blank)'];
        this.stats.jav.Critical.Damage += this.stats.jav['Weak Point'].Damage;


        this.weapStats = this.calcWeapStats(this.jav.value);
        this.gearStats = this.calcGearStats(this.jav.value);
        // console.log(this.weapStats);

        this.shield = Math.round((this.db.baseValues[this.jav.value.class].shield + this.shield) * (100 + this.stats.jav.Shield.Max) / 100);
        this.armor = Math.round((this.db.baseValues[this.jav.value.class].armor + this.armor) * (100 + this.stats.jav.Armor.Max) / 100);

      }
      // this.formatValues();
      this.armorStats = [
        ['Armor:', `${this.armor}`],
        ['Armor Max:', this.stats.jav.Armor.Max + '%'],
        ['Repair Drop Rate:', this.stats.jav.Repair['Drop Rate'] + '%'],
        ['Repair Amount:', this.stats.jav.Repair.Amount + '%'],
        ['Effect Duration', this.stats.jav.Effect.Duration + '%']
      ];

      this.shieldStats = [
        ['Shield:', `${this.shield}`],
        ['Shield Max:', this.stats.jav.Shield.Max + '%'],
        ['Shield Delay:', this.stats.jav.Shield.Delay + '%'],
        ['Shield Refresh:', this.stats.jav.Shield.Refresh + '%']
      ];

      this.suppStats = [
        ['Gear Score:', this.gearscore],
        ['Luck:', this.stats.jav.Luck['(blank)'] + '%'],
        ['Harvest Bonus:', this.stats.jav.Harvest.Bonus + '%'],
        ['Pickup Radius:', this.stats.jav.Pickup.Radius + '%'],
        ['Ammo Drop Rate:', this.stats.jav.Ammo['Drop Rate'] + '%'],
        ['Ammo Pickup Amt:', this.stats.jav.Ammo['Pickup Amount'] + '%'],
        ['Overheat Delay:', this.stats.jav.Overheat.Delay + '%'],
        ['Oxygen:', this.stats.jav.Oxygen.Max + '%'],
        ['Thruster Life:', this.stats.jav.Thruster.Life + '%'],
        ['Thruster Speed:', this.stats.jav.Thruster.Speed + '%'],
        ['Thruster Cooldown:', this.stats.jav.Thruster.Cooldown + '%'],
      ];

      this.dmgStats = this.calcMeleeStats(this.jav.value);
      this.dmgStats = this.dmgStats.concat([
        ['Kinetic Dmg:', this.stats.jav.Kinetic.Damage + this.stats.jav.Physical.Damage + this.stats.jav.All.Damage + '%'],
        ['Kinetic Resist:', this.stats.jav.Kinetic.Resist + this.stats.jav.Physical.Resist + this.stats.jav.Damage.Resist + '%'],
        ['Acid Dmg:', this.stats.jav.Acid.Damage + this.stats.jav.Physical.Damage + this.stats.jav.All.Damage + '%'],
        ['Acid Resist:', this.stats.jav.Acid.Resist + this.stats.jav.Physical.Resist + this.stats.jav.Damage.Resist + '%'],
        ['Elec Dmg:', this.stats.jav.Elec.Damage + this.stats.jav.Elemental.Damage + this.stats.jav.All.Damage + '%'],
        ['Elec Resist:', this.stats.jav.Elec.Resist + this.stats.jav.Elemental.Resist + this.stats.jav.Damage.Resist + '%'],
        ['Fire Dmg:', this.stats.jav.Fire.Damage + this.stats.jav.Elemental.Damage + this.stats.jav.All.Damage + '%'],
        ['Fire Resist:', this.stats.jav.Fire.Resist + this.stats.jav.Elemental.Resist + this.stats.jav.Damage.Resist + '%'],
        ['Ice Dmg:', this.stats.jav.Ice.Damage + this.stats.jav.Elemental.Damage + this.stats.jav.All.Damage + '%'],
        ['Ice Resist:', this.stats.jav.Ice.Resist + this.stats.jav.Elemental.Resist + this.stats.jav.Damage.Resist + '%'],
        ['Melee Dmg:', this.stats.jav.Melee.Damage + this.stats.jav.All.Damage + '%'], ['', ''],
        ['Combo Dmg:', this.stats.jav.Combo.Damage + this.stats.jav.All.Damage + '%'], ['Enemy Resist', this.resist + '%'],
        ['Combo Imp Dmg:', this.stats.jav.Combo['Imp Dmg'] + this.stats.jav.All.Damage + '%'],
        ['Force', this.stats.jav.Force['(blank)'] + '%'],
        ['Ultimate Dmg:', this.stats.jav.Ultimate.Damage + this.stats.jav.All.Damage + '%'], ['', ''],
        ['Weak Point Dmg:', this.stats.jav.Critical.Damage + this.stats.jav.All.Damage + '%'], ['', ''],
        ['Blast Dmg:', this.stats.jav.Blast.Damage + this.stats.jav.All.Damage + '%'], ['', '']
      ]);

    });
  }


  private calcMeleeStats(jav: CompactJavelin): any[] {
    const wstats = [];
    if (jav && 'class' in jav) {
      const pwr_mult = 2 ** ((Math.round(this.gearscore / 11) - 1) / 10);
      const baseDmg = this.db.baseValues[jav.class].mdmg;
      let dmgMod = this.stats.jav.All.Damage;
      dmgMod += this.stats.jav[this.db.baseValues[jav.class].mstype].Damage;
      dmgMod += this.stats.jav[this.db.baseValues[jav.class].mtype].Damage;
      dmgMod += this.stats.jav.Melee.Damage;
      dmgMod = pwr_mult * (100 + dmgMod) - 100;
      wstats.push([`Melee:`, `${Math.round(baseDmg * (100 + dmgMod) / 100 * (100 - this.resist) / 100)}`]);
      // wstats.push([`Melee Mod:`, `${Math.round(dmgMod)}%`]);
    }
    return wstats;
  }

  private calcWeapStats(jav: CompactJavelin): any[] {
    const stats = [];
    for (let idx = 0; idx < jav.weap.length; idx++) {
      if (jav.weap[idx] == null) { continue; }
      const item = this.itemService.expand('weap', jav.weap[idx]);
      const wstats = this.calcDmg(item, 'weap', idx);

      const baseClip = item.clip;
      let clipMod = this.stats.jav.Weap['Mag Size']; // jav-wide
      clipMod += this.stats.jav[item.type]['Mag Size']; // weapon type specific
      clipMod += this.stats.weap[idx].Weap['Mag Size']; // item specific
      clipMod += this.stats.weap[idx][item.type]['Mag Size']; // item and weapon type specific
      wstats.push([`Mag Size: `, `${Math.round(baseClip * (100 + clipMod) / 100)}`]);
      wstats.push([`Mag Size Mod: `, `${clipMod}%`]);

      let RPMMod = this.stats.jav.Weap.RPM; // jav-wide
      RPMMod += this.stats.jav[item.type].RPM || 0; // weapon type specific
      RPMMod += this.stats.weap[idx].Weap.RPM || 0; // item specific
      RPMMod += this.stats.weap[idx][item.type].RPM || 0; // item and weapon type specific
      wstats.push(['RPM: ', item.rpm]);
      wstats.push(['RPM Mod: ', `${RPMMod}%`]);
      wstats.push(['Range: ', item.range]);
      wstats.push(['Crit Mult: ', item.crit]);

      stats[idx] = wstats;
    }
    return stats;
  }

  private calcGearStats(jav: CompactJavelin): any[] {
    const stats = [];
    for (let idx = 0; idx < jav.gear.length; idx++) {
      if (jav.gear[idx] == null) { continue; }
      const item = this.itemService.expand('gear', jav.gear[idx]);
      const gstats = this.calcDmg(item, 'gear', idx);

      const baseCharges = item.charges;
      let chargesMod = this.stats.jav.Gear.Charges; // jav-wide
      chargesMod += this.stats.gear[idx].Gear.Charges;
      if (item.slot === 0) { chargesMod += this.stats.jav['Ability 1'].Charges; }
      if (item.slot === 1) { chargesMod += this.stats.jav['Ability 2'].Charges; }
      gstats.push([`Charges: `, `${Math.round(baseCharges * (100 + chargesMod) / 100)}`]);
      gstats.push([`Charges Mod: `, `${chargesMod}%`]);

      const baseRecharge = item.recharge;
      let rechargeMod = this.stats.jav.Gear.Recharge; // jav-wide
      rechargeMod += this.stats.jav.Gear.Speed; // jav-wide
      if (item.slot === 0) {
        rechargeMod += this.stats.jav['Ability 1'].Recharge;
        rechargeMod += this.stats.jav['Ability 1'].Speed;
      }
      if (item.slot === 1) {
        rechargeMod += this.stats.jav['Ability 2'].Recharge;
        rechargeMod += this.stats.jav['Ability 2'].Speed;
      }
      rechargeMod += this.stats.gear[idx].Gear.Recharge;
      gstats.push([`Recharge: `, `${Math.round(baseRecharge / ((100 + rechargeMod) / 100))}`]);
      gstats.push([`Recharge Mod: `, `${rechargeMod}%`]);

      stats[idx] = gstats;
    }
    return stats;
  }

  private calcDmg(item: Item, type: string, idx: number): any[] {
    let wstats = [[item.name, '']];
    wstats = wstats.concat(this.calcDmgSub(item, type, idx, item['dstype0'], item['dtype0'], item['dmg0'], item['blast0']));
    wstats = wstats.concat(this.calcDmgSub(item, type, idx, item['dstype1'], item['dtype1'], item['dmg1'], item['blast1']));
    wstats = wstats.concat(this.calcProcDmgSub(item, type, idx, item['procstype'], item['proctype'], item['procdmg'], item['procblast']));
    return wstats;
  }

  private calcProcDmgSub(item: Item, type: string, idx: number, dstype: string, dtype: string, baseDmg: number, isBlast: string): any[] {
    const wstats = [];
    if (baseDmg && dtype && dtype in this.stats.jav) {
      // gear score scale factor
      const pwr_mult = 2 ** ((Math.round(this.gearscore / 11) - 1) / 10);

      // fire,ice,elec,elemental,blast scale by 2x normal vector
      let dmgMod = 2 * this.stats.jav[dtype].Damage;
      dmgMod += 2 * this.stats.jav[dstype].Damage;
      dmgMod += 2 * this.stats[type][idx][dtype].Damage;
      dmgMod += 2 * this.stats[type][idx][dstype].Damage;
      if (isBlast === 'blast') {
        dmgMod += 2 * this.stats.jav.Blast.Damage;
        dmgMod += 2 * this.stats[type][idx].Blast.Damage;
      }

      // jav damage scales by 1x
      dmgMod += this.stats.jav.All.Damage;
      dmgMod += this.stats[type][idx].All.Damage;
      dmgMod += this.stats[type][idx].Damage['(blank)'];

      dmgMod = pwr_mult * (100 + dmgMod) - 100;
      wstats.push([`Proc Dmg:`, `${Math.round(baseDmg * (100 + dmgMod) / 100 * (100 - this.resist) / 100) + 1}`]);
      wstats.push([`Proc Dmg Mod:`, `${Math.round(dmgMod)}%`]);
    }
    return wstats;
  }

  private calcDmgSub(item: Item, type: string, idx: number, dstype: string, dtype: string, baseDmg: number, isBlast: string): any[] {
    const wstats = [];
    if (baseDmg && dtype && dtype in this.stats.jav) {
      // add jav-wide damage modifier for damage type (eg, Fire, Ice, etc)
      let dmgMod = this.stats.jav[dtype].Damage + this.stats.jav[dstype].Damage + this.stats.jav.All.Damage;
      // add item specific damage modifier for damage type
      dmgMod += this.stats[type][idx][dtype].Damage + this.stats[type][idx][dstype].Damage;
      // add weap and gear specific damage modifiers
      if (type === 'weap') {
        dmgMod += this.stats.jav.Weap.Damage;
        dmgMod += this.stats.jav[item.type].Damage;
        dmgMod += this.stats[type][idx].Weap.Damage;
      }
      if (type === 'gear') {
        dmgMod += this.stats.jav.Gear.Damage;
        dmgMod += this.stats[type][idx].Gear.Damage;
        if (item.slot === 0) { dmgMod += this.stats.jav['Ability 1'].Damage; }
        if (item.slot === 1) { dmgMod += this.stats.jav['Ability 2'].Damage; }
      }

      let burst = '';
      if (item.burst) {
        burst = `x${item.burst}`;
      }

      // add blast damage modifier when appropriate
      if (isBlast) { dmgMod += this.stats.jav.Blast.Damage + this.stats[type][idx].Blast.Damage; }
      wstats.push([`${dtype} Dmg: `, `${Math.round(baseDmg * (100 + dmgMod) / 100 * (100 - this.resist) / 100)}` + burst]);
      wstats.push([`${dtype} Dmg Mod: `, `${dmgMod}%`]);
    }
    return wstats;
  }

  // read the inscriptions on items and aggregate them onto this.stats
  private parseItemInscriptions(jav: CompactJavelin) {
    ['weap', 'gear', 'comp', 'supp', 'sigils'].forEach(type => {
      for (let idx = 0; idx < jav[type].length; idx++) {
        if (jav[type][idx] == null) { continue; }
        const item = this.itemService.expand(type, jav[type][idx]);

        // gearscore
        this.gearscore += item.power || 0;
        this.armor += item.armor || 0;
        this.shield += item.shield || 0;

        // inscriptions
        item.inscs.forEach((insc: Inscription) => {
          if (insc.scope) {
            this.updateStat(this.stats.jav, insc);
          } else {
            this.updateStat(this.stats[type][idx], insc);
          }
        });

        // buffs
        if (item.buff && item.bactive) {
          item.buffDetails.forEach(b => {
            if (b.scope) {
              this.updateStat(this.stats.jav, b);
            } else {
              this.updateStat(this.stats[type][idx], b);
            }
          });
        }
      }
    });
    this.aGS = Math.max(1, Math.round(this.gearscore) / 11);
  }

  // parse inscription and aggregate onto a stat
  private updateStat(stat, insc) {
    if (stat) {
      if (!(insc.type in stat)) { stat[insc.type] = {}; }
      stat[insc.type][insc.stat || ''] = (stat[insc.type][insc.stat || ''] || 0) + insc.value;
    }
  }

  changeName(evt: any) {
    this.javelinService.changeName(this.jav, evt.target.value);
  }

  updateDebuff(type: string) {
    this.javelinService.toggleDebuff(this.jav, type, !this.jav.value.debuffs[type]);
  }

}
