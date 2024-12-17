import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthStore } from '@unsoul-mfe/unsoul-data-access-auth';

@Component({
  imports: [CommonModule],
  selector: 'nx-mfe-dashboard-entry',
  templateUrl: 'entry.component.html',
})
export class RemoteEntryComponent {
 public authStore = inject(AuthStore);
}
