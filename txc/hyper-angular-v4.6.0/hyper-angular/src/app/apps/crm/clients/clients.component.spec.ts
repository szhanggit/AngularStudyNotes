import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CRMClientsComponent } from './clients.component';

describe('CRMClientsComponent', () => {
  let component: CRMClientsComponent;
  let fixture: ComponentFixture<CRMClientsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CRMClientsComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CRMClientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
