import { ChangeDetectorRef, Component, inject, Input } from "@angular/core";
import { FormsModule, NgForm } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatOptionModule } from "@angular/material/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { Subject, Subscription } from "rxjs";
import { ISeller } from "../../../../domain/sellers/models/seller.model";
import { AUTH_SESSION } from "../../../../domain/auth/ports";
import { NOTIFICATION_PORT } from "../../../../shared/ports";
import { SellerUseCase } from '../../../../domain/sellers/use-cases/seller.usecase';
import { LOG_BOOK_SERVICE } from "../../../../domain/logBook/ports";
import { MODULES } from "../../../../shared/const/modules";
import { ACTIONS } from "../../../../shared/const/actions";

@Component({
    selector: 'app-seller-form',
    standalone: true,
    imports: [
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatOptionModule,
        MatButtonModule,
        MatCardModule,
    ],
    templateUrl: './form.component.html',
    styleUrl: './form.component.scss',
})
export class SellerFormComponent {
    @Input() sellerObservable: Subject<ISeller> | null = null;
    @Input() updateTable: Subject<boolean> | null = null;
    private subscription?: Subscription;
    private user = inject(AUTH_SESSION);
    private SellerUseCase = inject(SellerUseCase);
    private logBook = inject(LOG_BOOK_SERVICE);
    private notification = inject(NOTIFICATION_PORT);
    seller: ISeller = {
        state: true, // Default state is active
    };
    textButton: string = 'Crear Vendedor';
    isEditing: boolean = false;
    loading: boolean = false;

    constructor(private cdr: ChangeDetectorRef) { }

    ngOnInit() {
        if (this.sellerObservable) {
            this.subscription = this.sellerObservable.subscribe((data: ISeller) => {
                if (data && data.uid !== undefined) {
                    this.textButton = 'Editar Vendedor';
                    this.isEditing = true;
                }
                this.seller = { ...data };
                this.cdr.detectChanges();
            });
        }
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
        // No hacer unsubscribe de los Subjects ya que son manejados por el componente padre
    }

    async onSubmit(form: NgForm) {
        if (!form.valid) {
            this.notification.error('Formulario inválido. Por favor, complete todos los campos requeridos.');
            return;
        }
        const currentUser = this.user.getUser();
        if (!currentUser) {
            this.notification.error('Usuario no autenticado.');
            return;
        }

        this.loading = true;
        const formData = { ...form.value };
        const sellerData = { ...this.seller, code: formData.code.toLowerCase().trim(), name: formData.name.toLowerCase().trim(), state: formData.state };
        try {
            const existingSeller = await this.SellerUseCase.getSellerByCode(sellerData.code);
            if ((existingSeller && !this.isEditing) || (existingSeller && this.isEditing && existingSeller.uid !== sellerData.uid)) {
                this.notification.error('Ya existe un vendedor con este código.');
                this.loading = false;
                return;
            }
            if (!this.isEditing) {
                sellerData.uid = `seller_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                sellerData.createdBy = currentUser;
                sellerData.createdAt = Date.now();
                await this.SellerUseCase.createSeller(sellerData).then(async () => {
                    await this.logBook.createLogBook({
                        action: ACTIONS.CREATE,
                        user: currentUser,
                        date: Date.now().valueOf(),
                        module: MODULES.VENDOR,
                        description: `Se creó el vendedor con id ${sellerData.uid}`,
                    });
                });
            } else {
                sellerData.updatedBy = currentUser;
                sellerData.updatedAt = Date.now();
                await this.SellerUseCase.updateSeller(sellerData.uid!, sellerData).then(async () => {
                    await this.logBook.createLogBook({
                        action: ACTIONS.UPDATE,
                        user: currentUser,
                        date: Date.now().valueOf(),
                        module: MODULES.VENDOR,
                        description: `Se actualizó el vendedor con id ${sellerData.uid}`,
                    });
                });
            }
            this.updateTable?.next(true);
            this.notification.success(this.isEditing ? 'Vendedor actualizado exitosamente' : 'Vendedor creado exitosamente');
            this.limpiarFormulario(form);
        } catch (error: any) {
            console.error('Error al procesar el formulario:', error);
            this.notification.error(error?.message || 'Error al procesar el formulario');
            return;
        } finally {
            this.loading = false;
        }
    }

    limpiarFormulario(form: NgForm) {
        form.resetForm();
        this.textButton = 'Crear Vendedor';
        this.isEditing = false;
        this.seller = {
            state: true,
            code: '',
            name: '',
        };
        form.controls['state'].setValue(true); // Reset state to true
        this.cdr.detectChanges();
    }
}