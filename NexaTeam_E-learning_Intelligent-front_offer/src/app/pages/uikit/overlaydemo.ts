import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { AccordionModule } from 'primeng/accordion'; // Importez AccordionModule
import { Product, ProductService } from '../service/product.service';

@Component({
    selector: 'app-overlay-demo',
    standalone: true,
    imports: [ToastModule, DialogModule, ButtonModule, AccordionModule], // Ajoutez AccordionModule
    template: `
        <div class="card">
            <div class="font-semibold text-xl mb-4">Dialog with Accordion</div>
            <p-dialog
                header="Dialog with Accordion"
                [(visible)]="display"
                [breakpoints]="{ '960px': '75vw' }"
                [style]="{ width: '50vw' }"
                [modal]="true"
            >
                <!-- Accordion inside the dialog -->
                <p-accordion>
                    <p-accordion-panel value="0">
                        <p-accordion-header>Header I</p-accordion-header>
                        <p-accordion-content>
                            <p class="m-0">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                                consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                            </p>
                        </p-accordion-content>
                    </p-accordion-panel>

                    <p-accordion-panel value="1">
                        <p-accordion-header>Header II</p-accordion-header>
                        <p-accordion-content>
                            <p class="m-0">
                                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim
                                ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Consectetur, adipisci velit, sed quia non numquam eius modi.
                            </p>
                        </p-accordion-content>
                    </p-accordion-panel>

                    <p-accordion-panel value="2">
                        <p-accordion-header>Header III</p-accordion-header>
                        <p-accordion-content>
                            <p class="m-0">
                                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim
                                ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Consectetur, adipisci velit, sed quia non numquam eius modi.
                            </p>
                        </p-accordion-content>
                    </p-accordion-panel>
                </p-accordion>
                <ng-template #footer>
                    <p-button label="Close" (click)="close()" />
                </ng-template>
            </p-dialog>
            <p-button label="Show Dialog" [style]="{ width: 'auto' }" (click)="open()" />
        </div>
        <p-toast />
    `,
    providers: [ConfirmationService, MessageService, ProductService]
})
export class OverlayDemo implements OnInit {
    display: boolean = false; // Contrôle l'affichage du dialog

    constructor(
        private productService: ProductService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService
    ) {}

    ngOnInit() {
        // Initialisation si nécessaire
    }

    // Ouvrir le dialog
    open() {
        this.display = true;
    }

    // Fermer le dialog
    close() {
        this.display = false;
        this.messageService.add({
            severity: 'success',
            summary: 'Dialog Closed',
            detail: 'The dialog has been closed.',
            life: 3000,
        });
    }
}