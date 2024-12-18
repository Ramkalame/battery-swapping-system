import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RickshawDashboardComponent } from './rickshaw-dashboard.component';

describe('RickshawDashboardComponent', () => {
  let component: RickshawDashboardComponent;
  let fixture: ComponentFixture<RickshawDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RickshawDashboardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RickshawDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
