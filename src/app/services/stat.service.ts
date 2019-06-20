import { Injectable } from '@angular/core';
import { JavStats } from '../classes/stats';
import { Javelin } from '../classes/javelin';
import { Inscription } from '../classes/inscription';
import { JavStateModel } from '../jav.state';

@Injectable({
  providedIn: 'root'
})
export class StatService {

  constructor() { }

  public calcStats(state: JavStateModel): JavStats {
    const stats = JSON.parse(JSON.stringify(state.stats));
    ['colossus', 'interceptor', 'ranger', 'storm'].forEach(javClass => {
      [0, 1, 2, 3].forEach(javSlot => {
        stats[javClass][javSlot] = this.calcJavStats(state, javClass, javSlot);
      });
    });
    return stats;
  }

  public calcJavStats(state: JavStateModel, javClass: string, javSlot: number): JavStats {
    const jav = state.javelins[javClass][javSlot];
    const s = JSON.parse(JSON.stringify(state.stats[javClass][javSlot]));
    s.jav.Armor[''] = 0;
    s.jav.Shield[''] = 0;
    s.jav.Melee[''] = 0;
    s.jav.Enemy = { Resist: 0 };
    s.jav.Gear = { Score: 0 };
    if ('debuffs' in s.jav) {
      if (s.jav.debuffs.beacon) { s.jav.Enemy.Resist -= 33; }
      if (s.jav.debuffs.acid) { s.jav.Enemy.Resist -= 25; }
    }
    this.parseItemInscriptions(jav, s);
    s.jav.Repair['Drop Rate'] += s.jav.Resupply['Drop Rate'];
    s.jav.Ammo['Drop Rate'] += s.jav.Resupply['Drop Rate'];
    s.jav.All.Damage += s.jav.Damage['(blank)'];
    s.jav.Critical.Damage += s.jav['Weak Point'].Damage;
    s.jav.Armor[''] = Math.round((state.baseValues[javClass].armor + s.jav.Armor['']) * (100 + s.jav.Armor.Max) / 100);
    s.jav.Shield[''] = Math.round((state.baseValues[javClass].shield + s.jav.Shield['']) * (100 + s.jav.Shield.Max) / 100);
    s.jav.Melee.Mod = this.calcMeleeMod(state.baseValues[javClass], s);
    s.jav.Melee[''] = Math.round(state.baseValues[javClass] * (100 + s.jav.Melee.Mod) / 100 * (100 - s.jav.Enemy.Resist) / 100);
    return s;
  }

  private parseItemInscriptions(jav: Javelin, s: JavStats) {
    ['weap', 'gear', 'comp', 'supp', 'sigils'].forEach(type => {
      for (let idx = 0; idx < jav[type].length; idx++) {
        if (jav[type][idx] == null) { continue; }
        const item = jav[type][idx];

        // gearscore
        s.jav.Gear.Score += item.power || 0;
        s.jav.Armor[''] += item.armor || 0;
        s.jav.Shield[''] += item.shield || 0;

        // inscriptions
        item.inscs.forEach((insc: Inscription) => {
          if (insc.scope) {
            this.updateStat(s.jav, insc);
          } else {
            this.updateStat(s[type][idx], insc);
          }
        });

        // buffs
        if (item.buff && item.bactive) {
          item.buffDetails.forEach(b => {
            if (b.scope) {
              this.updateStat(s.jav, b);
            } else {
              this.updateStat(s[type][idx], b);
            }
          });
        }
      }
    });
  }

  // parse inscription and aggregate onto a stat
  private updateStat(stat, insc) {
    if (stat) {
      if (!(insc.type in stat)) { stat[insc.type] = {}; }
      stat[insc.type][insc.stat || ''] = (stat[insc.type][insc.stat || ''] || 0) + insc.value;
    }
  }

  private calcMeleeMod(classValues: any, s: JavStats) {
    const pwrMult = 2 ** ((Math.round(s.jav.Gear.Score / 11) - 1) / 10);
    let dmgMod = s.jav.All.Damage;
    dmgMod += s.jav[classValues.mstype].Damage;
    dmgMod += s.jav[classValues.mtype].Damage;
    dmgMod += s.jav.Melee.Damage;
    dmgMod = pwrMult * (100 + dmgMod) - 100;
    return dmgMod;
  }

}
