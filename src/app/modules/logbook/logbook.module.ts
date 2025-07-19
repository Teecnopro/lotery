import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { LOG_BOOK_SERVICE } from "../../domain/logBook/ports";
import { LogBookAdapter } from "../../infrastructure/logBook/logBook.adapter";
import { LogBookUseCases } from "../../domain/logBook/use-cases/logBook.usecases";

@NgModule({
  imports: [CommonModule, ReactiveFormsModule],
  providers: [{
    provide: LOG_BOOK_SERVICE,
    useClass: LogBookAdapter, // Assuming LogBookAdapter is the service class
  },
    LogBookUseCases
  ],
})
export class LogBookModule {}