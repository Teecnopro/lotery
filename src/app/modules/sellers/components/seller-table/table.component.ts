import { ChangeDetectorRef, Component, inject, Input } from "@angular/core";
import { ISeller } from "../../../../domain/sellers/models/seller.model";
import { first, firstValueFrom, Subject } from "rxjs";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatTableModule } from "@angular/material/table";
import { CommonModule } from "@angular/common";
import { SellerUseCase } from "../../../../domain/sellers/use-cases";
import { NOTIFICATION_PORT } from "../../../../shared/ports";
import { MatDialog } from "@angular/material/dialog";
import { ConfirmDialogComponent } from "../../../../shared/components/confirm-dialog.component";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { FormsModule } from "@angular/forms";
import { MatCardModule } from "@angular/material/card";

@Component({
  selector: 'app-seller-table',
  standalone: true,
  imports: [MatTableModule, MatIconModule, MatButtonModule, CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class SellerTableComponent {
  @Input() sellerObservable: Subject<ISeller> | null = null;
  @Input() updateTable: Subject<boolean> | null = null;
  private sellerUseCase = inject(SellerUseCase);
  private notification = inject(NOTIFICATION_PORT);
  private dialog = inject(MatDialog);

  seller: any = {};
  textButton: string = 'Crear Vendedor';
  isEditing: boolean = false;
  loading: boolean = false;
  dataSource: ISeller[] = [];
  codeOrNameFilter: string = '';

  displayedColumns: string[] = [
    'code',
    'name',
    'state',
    'createdBy',
    'createdAt',
    'updatedBy',
    'updatedAt',
    'actions',
  ];

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.getDataSource();
    this.updateTable?.subscribe(() => {
      this.getDataSource();
    });
  }

  ngOnDestroy() {
    this.sellerObservable?.unsubscribe();
    this.updateTable?.unsubscribe();
  }

  async getDataSource() {
    this.loading = true;
    try {
      const dataSource = await this.sellerUseCase.getAllSellers();
      const copyDataSource = JSON.parse(JSON.stringify(dataSource)) as ISeller[];
      localStorage.removeItem('sellerDataSource');
      localStorage.setItem('sellerDataSource', JSON.stringify(copyDataSource.map(seller => {
        delete seller.uid;
        return seller;
      })));
      this.dataSource = dataSource;
    } catch (error: any) {
      this.notification.error('Error al cargar los vendedores: ' + error.message);
      console.error('Error fetching sellers:', error);
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
    // Fetch the data source for the table
  }

  editSeller(seller: ISeller) {
    this.sellerObservable?.next(seller);
  }

  async deleteSeller(seller: ISeller) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Eliminar vendedor',
        message: '¿Está seguro que desea eliminar este vendedor?'
      },
    });
    const confirmed = await firstValueFrom(dialogRef.afterClosed());
    if (confirmed) {
      try {
        await this.sellerUseCase.deleteSeller(seller.uid!);
        this.notification.success('Vendedor eliminado exitosamente');
        this.getDataSource(); // Refresh the table
      } catch (error: any) {
        this.notification.error('Error al eliminar el vendedor: ' + error.message);
        console.error('Error deleting seller:', error);
      }
    }
  }

  async applyFilter(filterValue: string) {
    if(filterValue && filterValue.length >= 3) {
      const lowerCaseFilter = filterValue.toLowerCase();
      const filteredData = await this.sellerUseCase.getSellersByCodeOrName(lowerCaseFilter);
      this.dataSource = filteredData;
      this.cdr.detectChanges();
    } else {
      this.getDataSource();
      this.cdr.detectChanges();
    }
  }

}