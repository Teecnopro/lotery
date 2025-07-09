import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-home">
      <div class="content">
        <h1>Bienvenido al Sistema</h1>
        <p>Selecciona una opción del menú para continuar.</p>
      </div>
    </div>
  `,
  styles: [
    `
      .dashboard-home {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        min-height: calc(100vh - 64px);
      }

      .content {
        text-align: center;
        padding: 2rem 3rem;
        border-radius: 12px;
        max-width: 600px;
        width: 100%;
      }

      h1 {
        margin-bottom: 1rem;
        font-size: 2rem;
        font-weight: 600;
        color: #2c3e50;
      }

      p {
        font-size: 1.125rem;
        color: #555;
      }

      @media (max-width: 600px) {
        .content {
          padding: 1.5rem;
        }

        h1 {
          font-size: 1.5rem;
        }

        p {
          font-size: 1rem;
        }
      }
    `,
  ],
})
export class DashboardHomeComponent {}
