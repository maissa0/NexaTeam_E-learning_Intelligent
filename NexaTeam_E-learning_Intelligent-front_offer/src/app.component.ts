import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterModule,FormsModule],
    template: `<router-outlet></router-outlet>`
})
export class AppComponent {}