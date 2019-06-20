import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store } from '@ngxs/store';
import { JavState } from '../../jav.state';

@Component({
  selector: 'app-basic-stat',
  templateUrl: './basic-stat.component.html',
  styleUrls: ['./basic-stat.component.css']
})
export class BasicStatComponent implements OnInit {
  @Input() stats: string;
  @Input() last: boolean;
  stats$: Observable<any[]>;
  constructor(
    private store: Store
  ) {
    this.stats$ = this.store.select(JavState.selectedStats).pipe(
      map(stats => {
        switch (this.stats) {
          case 'armorStats': {
            return [
              ['Armor', stats.jav.Armor['']],
              ['Armor Max:', stats.jav.Armor.Max + '%'],
              ['Effect Duration', stats.jav.Effect.Duration + '%'],
              ['Repair Drop Rate:', stats.jav.Repair['Drop Rate'] + '%'],
              ['Effect Resist', stats.jav.Effect.Resist + '%'],
              ['Repair Amount:', stats.jav.Repair.Amount + '%'],
            ];
          }
          case 'shieldStats': {
            return [
              ['Shield:', stats.jav.Shield['']],
              ['Shield Max:', stats.jav.Shield.Max + '%'],
              ['Shield Delay:', stats.jav.Shield.Delay + '%'],
              ['Shield Refresh:', stats.jav.Shield.Refresh + '%']
            ];
          }
          case 'dmgStats': {
            return [
              ['Melee', stats.jav.Melee['']],
              ['MeleeMod', stats.jav.Melee.Mod], ['', ''],
              ['Kinetic Dmg:', stats.jav.Kinetic.Damage + stats.jav.Physical.Damage + stats.jav.All.Damage + '%'],
              ['Kinetic Resist:', stats.jav.Kinetic.Resist + stats.jav.Physical.Resist + stats.jav.Damage.Resist + '%'],
              ['Acid Dmg:', stats.jav.Acid.Damage + stats.jav.Physical.Damage + stats.jav.All.Damage + '%'],
              ['Acid Resist:', stats.jav.Acid.Resist + stats.jav.Physical.Resist + stats.jav.Damage.Resist + '%'],
              ['Elec Dmg:', stats.jav.Elec.Damage + stats.jav.Elemental.Damage + stats.jav.All.Damage + '%'],
              ['Elec Resist:', stats.jav.Elec.Resist + stats.jav.Elemental.Resist + stats.jav.Damage.Resist + '%'],
              ['Fire Dmg:', stats.jav.Fire.Damage + stats.jav.Elemental.Damage + stats.jav.All.Damage + '%'],
              ['Fire Resist:', stats.jav.Fire.Resist + stats.jav.Elemental.Resist + stats.jav.Damage.Resist + '%'],
              ['Ice Dmg:', stats.jav.Ice.Damage + stats.jav.Elemental.Damage + stats.jav.All.Damage + '%'],
              ['Ice Resist:', stats.jav.Ice.Resist + stats.jav.Elemental.Resist + stats.jav.Damage.Resist + '%'],
              ['Melee Dmg:', stats.jav.Melee.Damage + stats.jav.All.Damage + '%'], ['', ''],
              ['Combo Dmg:', stats.jav.Combo.Damage + stats.jav.All.Damage + '%'], ['Enemy Resist', stats.jav.Enemy.Resist + '%'],
              ['Combo Imp Dmg:', stats.jav.Combo['Imp Dmg'] + stats.jav.All.Damage + '%'],
              ['Force', stats.jav.Force['(blank)'] + '%'],
              ['Ultimate Dmg:', stats.jav.Ultimate.Damage + stats.jav.All.Damage + '%'], ['', ''],
              ['Weak Point Dmg:', stats.jav.Critical.Damage + stats.jav.All.Damage + '%'], ['', ''],
              ['Blast Dmg:', stats.jav.Blast.Damage + stats.jav.All.Damage + '%'], ['', '']
            ];
          }
          case 'suppStats': {
            return [
              ['Gear Score:', stats.jav.Gear.Score],
              ['Luck:', stats.jav.Luck['(blank)'] + '%'],
              ['Harvest Bonus:', stats.jav.Harvest.Bonus + '%'],
              ['Pickup Radius:', stats.jav.Pickup.Radius + '%'],
              ['Ammo Drop Rate:', stats.jav.Ammo['Drop Rate'] + '%'],
              ['Ammo Pickup Amt:', stats.jav.Ammo['Pickup Amount'] + '%'],
              ['Overheat Delay:', stats.jav.Overheat.Delay + '%'],
              ['Oxygen:', stats.jav.Oxygen.Max + '%'],
              ['Thruster Life:', stats.jav.Thruster.Life + '%'],
              ['Thruster Speed:', stats.jav.Thruster.Speed + '%'],
              ['Thruster Cooldown:', stats.jav.Thruster.Cooldown + '%'],
            ];
          }

          // this.foo = this.store.snapshot();
        }
      })
    );
  }

  ngOnInit() {
  }
}
