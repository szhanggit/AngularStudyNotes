import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategorycountComponent } from './categorycount.component';

describe('CategorycountComponent', () => {
  let component: CategorycountComponent;
  let fixture: ComponentFixture<CategorycountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategorycountComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategorycountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
