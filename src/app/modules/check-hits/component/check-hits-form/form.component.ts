import { Component, EventEmitter, Output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface CheckData {
  date: string;
  lottery: string;
  number: string;
}

@Component({
    selector: 'app-check-hits-form',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.scss'],
    standalone: true,
    imports: [
      MatCardModule,
      MatFormFieldModule,
      MatInputModule,
      MatSelectModule,
      MatButtonModule,
      FormsModule,
      CommonModule
    ]
})
export class CheckHitsFormComponent {
    @Output() searchResults = new EventEmitter<any>();
    
    checkData: CheckData = {
      date: '',
      lottery: '',
      number: ''
    };
    
    loading = false;

    onSubmit(form: NgForm): void {
        if (form.valid) {
            this.loading = true;
            // Simular búsqueda
            setTimeout(() => {
              // Datos de ejemplo específicos para la búsqueda
              const mockResults = [
                {
                  numero: this.checkData.number,
                  vendedor: 'Juan Pérez',
                  combinado: 'Sí',
                  valor: 5000,
                  premio: 25000
                },
                {
                  numero: this.checkData.number.substring(0, 2) + 'XX',
                  vendedor: 'María García',
                  combinado: 'No',
                  valor: 2000,
                  premio: 0
                },
                {
                  numero: this.checkData.number + '5',
                  vendedor: 'Carlos López',
                  combinado: 'Sí',
                  valor: 3000,
                  premio: 15000
                }
              ];
              
              this.searchResults.emit(mockResults);
              this.loading = false;
            }, 1000);
        }
    }
    
    limpiarFormulario(form: NgForm): void {
        form.resetForm();
        this.checkData = {
          date: '',
          lottery: '',
          number: ''
        };
        // No emitir array vacío, dejar que la tabla muestre sus datos por defecto
    }
}