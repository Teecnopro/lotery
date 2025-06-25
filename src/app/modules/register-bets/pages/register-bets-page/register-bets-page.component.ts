import { Component } from '@angular/core';
import { RegisterBetsFormComponent } from "../../components/register-bets-form/register-bets-form.component";
import { RegisterBetsResumeComponent } from "../../components/register-bets-resume/register-bets-resume.component";
import { RegisterBetsListComponent } from "../../components/register-bets-list/register-bets-list.component";

@Component({
  selector: 'app-register-bets-page',
  standalone: true,
  imports: [RegisterBetsFormComponent, RegisterBetsResumeComponent, RegisterBetsListComponent],
  templateUrl: './register-bets-page.component.html',
  styleUrl: './register-bets-page.component.scss'
})
export class RegisterBetsPageComponent {

}
