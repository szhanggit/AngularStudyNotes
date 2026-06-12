import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentFileComponent } from './recent-file.component';

describe('RecentFileComponent', () => {
  let component: RecentFileComponent;
  let fixture: ComponentFixture<RecentFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecentFileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecentFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
