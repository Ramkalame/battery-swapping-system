import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GreetPageComponent } from './greet-page.component';

describe('GreetPageComponent', () => {
  let component: GreetPageComponent;
  let fixture: ComponentFixture<GreetPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GreetPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GreetPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
