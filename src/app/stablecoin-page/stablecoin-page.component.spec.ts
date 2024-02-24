import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StablecoinPageComponent } from './stablecoin-page.component';

describe('StablecoinPageComponent', () => {
  let component: StablecoinPageComponent;
  let fixture: ComponentFixture<StablecoinPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StablecoinPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StablecoinPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
