import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CpthemeComponent } from './cptheme.component';

describe('CpthemeComponent', () => {
  let component: CpthemeComponent;
  let fixture: ComponentFixture<CpthemeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CpthemeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CpthemeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
