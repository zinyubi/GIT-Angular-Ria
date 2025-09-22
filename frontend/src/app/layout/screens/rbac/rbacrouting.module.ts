import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RbacContainerComponent } from './rbaccontainer/rbaccontainer.component';

import { screenAccessGuard } from '../../../guards/screenaccess.guard';

const routes: Routes = [
  {
    path: 'rbac',
    component: RbacContainerComponent,
    canActivate: [screenAccessGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RbacRoutingModule {}
