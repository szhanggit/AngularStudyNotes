import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDownloadHistoryComponent } from './view-download-history.component';

describe('ViewDownloadHistoryComponent', () => {
  let component: ViewDownloadHistoryComponent;
  let fixture: ComponentFixture<ViewDownloadHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewDownloadHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewDownloadHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
