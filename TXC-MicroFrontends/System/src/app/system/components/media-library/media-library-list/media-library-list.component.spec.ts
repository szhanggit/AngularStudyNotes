import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaLibraryListComponent } from './media-library-list.component';

describe('MediaLibraryListComponent', () => {
  let component: MediaLibraryListComponent;
  let fixture: ComponentFixture<MediaLibraryListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MediaLibraryListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MediaLibraryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
