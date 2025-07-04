import { ChangeDetectorRef, Component, inject, Input } from "@angular/core";
import { ISeller } from "../../../../domain/sellers/models/seller.model";
import { first, firstValueFrom, Subject, Subscription } from "rxjs";
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
import { MatTooltipModule } from "@angular/material/tooltip";
import { AUTH_SESSION } from "../../../../domain/auth/ports";
import { AuthUser } from "../../../../domain/auth/models/auth-user.entity";
import { MatPaginatorModule } from "@angular/material/paginator";

@Component({
  selector: 'app-seller-table',
  standalone: true,
  imports: [MatTableModule, MatIconModule, MatButtonModule, CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatTooltipModule,
    MatPaginatorModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class SellerTableComponent {
  @Input() sellerObservable: Subject<ISeller> | null = null;
  @Input() updateTable: Subject<boolean> | null = null;
  @Input() showFormObservable: Subject<boolean> | null = null;
  private sellerUseCase = inject(SellerUseCase);
  private notification = inject(NOTIFICATION_PORT);
  private dialog = inject(MatDialog);
  private userSession = inject(AUTH_SESSION);
  private updateSubscription?: Subscription;
  currentUser: AuthUser

  seller: any = {};
  textButton: string = 'Crear Vendedor';
  isEditing: boolean = false;
  loading: boolean = false;
  dataSource: ISeller[] = [];
  codeOrNameFilter: string = '';
  pageSize: number = 1; // Default page size
  totalItems: number = 0; // Total number of items for pagination
  pageIndex: number = 1; // Current page index (backend expects 1-based indexing)

  displayedColumns: string[] = [
    'code',
    'name',
    'createdBy',
    'createdAt',
    'updatedBy',
    'updatedAt',
    'actions',
  ];

  constructor(private cdr: ChangeDetectorRef) {
    this.currentUser = this.userSession.getUser() as AuthUser;
  }

  ngOnInit() {
    this.getDataSource();
    if (this.updateTable) {
      this.updateSubscription = this.updateTable.subscribe(() => {
        this.getDataSource();
      });
    }
  }

  ngOnDestroy() {
    if (this.updateSubscription) {
      this.updateSubscription.unsubscribe();
    }
    // No hacer unsubscribe de los Subjects ya que son manejados por el componente padre
  }

  async getDataSource() {
    this.loading = true;
    try {
      const dataSource = await this.sellerUseCase.getSellerByPagination(this.pageIndex, this.pageSize);
      this.totalItems = await this.sellerUseCase.getTotalItems();
      const copyDataSource = JSON.parse(JSON.stringify(dataSource)) as ISeller[];
      localStorage.removeItem('sellerDataSource');
      localStorage.setItem('sellerDataSource', JSON.stringify(copyDataSource.map(seller => {
        delete seller.uid;
        return seller;
      })));
      this.dataSource = dataSource;
    } catch (error: any) {
      this.notification.error('Error al cargar los vendedores: ' + error.message);
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  editSeller(seller: ISeller) {
    this.showFormObservable?.next(true);
    setTimeout(() => {
      this.sellerObservable?.next(seller);
    }, 100);
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
      }
    }
  }

  async applyFilter(filterValue: string) {
    if (filterValue && filterValue.length >= 1) {
      const lowerCaseFilter = filterValue.toLowerCase();
      const filteredData = await this.sellerUseCase.getSellersByCodeOrName(lowerCaseFilter);
      this.dataSource = filteredData;
      this.cdr.detectChanges();
    } else {
      this.getDataSource();
      this.cdr.detectChanges();
    }
  }

  toggleState(seller: ISeller) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Cambiar estado del vendedor',
        message: seller.state ? '¿Desea desactivar este vendedor?' : '¿Desea activar este vendedor?',
      },
    });
    firstValueFrom(dialogRef.afterClosed()).then(async confirmed => {
      if (confirmed) {
        try {
          await this.sellerUseCase.updateState(seller.uid!, !seller.state);
          this.notification.success(`Vendedor ${!seller.state ? 'activado' : 'desactivado'} exitosamente`);
          this.getDataSource();
        } catch (error: any) {
          this.notification.error('Error al cambiar el estado del vendedor: ' + error.message);
        }
      }
    });
  }

  onPageChange(event: any) {
    this.pageIndex = event.pageIndex === 0 ? 1 : event.pageIndex + 1;  
    this.pageSize = event.pageSize;
    this.getDataSource();
  }

}