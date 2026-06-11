import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppCompanyLogoRendererComponent } from './app-company-logo-renderer.component';

describe('AppCompanyLogoRendererComponent', () => {
  let component: AppCompanyLogoRendererComponent;
  let fixture: ComponentFixture<AppCompanyLogoRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppCompanyLogoRendererComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppCompanyLogoRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
