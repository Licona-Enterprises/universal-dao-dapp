import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WlyxPageComponent } from './wlyx-page.component';

describe('WlyxPageComponent', () => {
  let component: WlyxPageComponent;
  let fixture: ComponentFixture<WlyxPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WlyxPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WlyxPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
