import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeySaveComponent } from './key-save.component';

describe('KeySaveComponent', () => {
  let component: KeySaveComponent;
  let fixture: ComponentFixture<KeySaveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KeySaveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KeySaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
