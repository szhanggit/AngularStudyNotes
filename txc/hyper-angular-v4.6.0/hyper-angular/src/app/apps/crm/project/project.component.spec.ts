import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CRMProjectComponent } from './project.component';

describe('CRMProjectComponent', () => {
  let component: CRMProjectComponent;
  let fixture: ComponentFixture<CRMProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CRMProjectComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CRMProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
