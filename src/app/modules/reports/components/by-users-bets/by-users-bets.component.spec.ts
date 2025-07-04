import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ByUsersBetsComponent } from './by-users-bets.component';

describe('ByUsersBetsComponent', () => {
  let component: ByUsersBetsComponent;
  let fixture: ComponentFixture<ByUsersBetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ByUsersBetsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ByUsersBetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
