import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovernancePageComponent } from './governance-page.component';

describe('GovernancePageComponent', () => {
  let component: GovernancePageComponent;
  let fixture: ComponentFixture<GovernancePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GovernancePageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GovernancePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
