import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { RouterModule, Routes  } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { WlyxPageComponent } from './wlyx-page/wlyx-page.component';
import { BridgeComponent } from './bridge/bridge.component';
import { GovernancePageComponent } from './governance-page/governance-page.component';
import { StablecoinPageComponent } from './stablecoin-page/stablecoin-page.component';  

// export const routes: Routes = [];

export const routes: Routes = [
    { path: '', component: AppComponent },
    { path: 'home', component: HomePageComponent },
    { path: 'governance', component: GovernancePageComponent },
    { path: 'bridge', component: BridgeComponent },
    { path: 'stablecoin', component: StablecoinPageComponent },
    { path: 'test', component: WlyxPageComponent }
];
  
// @NgModule({
//   imports: [ RouterModule.forRoot(routes) ],
//   exports: [ RouterModule ]
// })

// export class AppRoutingModule {}