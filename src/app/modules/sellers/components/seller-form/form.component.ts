import { ChangeDetectorRef, Component, Input } from "@angular/core";
import { FormsModule, NgForm } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatOptionModule } from "@angular/material/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { Subject } from "rxjs";
import { ISeller } from "../../../../domain/sellers/models/seller.model";

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
    seller: ISeller = {};
    textButton: string = 'Crear Vendedor';
    isEditing: boolean = false;
    loading: boolean = false;

    constructor(private cdr: ChangeDetectorRef) { }

    ngOnInit() {
        // Initialization logic if needed
    }

    ngOnDestroy() {
        // Cleanup logic if needed
    }

    onSubmit(form: NgForm) {
        this.loading = true;
        if (this.isEditing) {
        }
    }

    limpiarFormulario(form: NgForm) {
        form.resetForm();
        this.textButton = 'Crear Vendedor';
        this.isEditing = false;
        this.seller = {};
        this.cdr.detectChanges();
    }
}