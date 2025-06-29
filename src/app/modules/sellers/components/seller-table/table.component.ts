import { ChangeDetectorRef, Component, Input } from "@angular/core";
import { ISeller } from "../../../../domain/sellers/models/seller.model";
import { Subject } from "rxjs";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatTableModule } from "@angular/material/table";
import { CommonModule } from "@angular/common";

@Component({
  selector: 'app-seller-table',
  standalone: true,
  imports: [MatTableModule, MatIconModule, MatButtonModule, CommonModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class SellerTableComponent {
  @Input() sellerObservable: Subject<ISeller> | null = null;
  @Input() updateTable: Subject<boolean> | null = null;
  seller: any = {};
  textButton: string = 'Crear Vendedor';
  isEditing: boolean = false;
  loading: boolean = false;
  dataSource: ISeller[] = [];

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

  constructor(private cdr: ChangeDetectorRef) {}

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

  private getDataSource() {
    // Fetch the data source for the table
  }

  editSeller(seller: ISeller) {
    this.seller = { ...seller };
    this.textButton = 'Editar Vendedor';
    this.isEditing = true;
    this.cdr.detectChanges();
  }

  deleteSeller(seller: ISeller) {
    // Logic to delete the seller
  }

}