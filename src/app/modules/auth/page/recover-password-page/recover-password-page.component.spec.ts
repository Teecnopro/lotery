import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecoverPasswordPageComponent } from './recover-password-page.component';

describe('RecoverPasswordPageComponent', () => {
  let component: RecoverPasswordPageComponent;
  let fixture: ComponentFixture<RecoverPasswordPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecoverPasswordPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RecoverPasswordPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
