import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavWithTabsComponent } from './nav-with-tabs.component';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

describe('NavWithTabsComponent', () => {
  let component: NavWithTabsComponent;
  let fixture: ComponentFixture<NavWithTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NavWithTabsComponent],
      imports: [NgbNavModule],
    }).compileComponents();

    fixture = TestBed.createComponent(NavWithTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onNavChange()', () => {
    it('should call emit tabChange', () => {
      // arrange
      const tabChangeSpy = spyOn(component.tabChange, 'emit');

      // act
      component.onNavChange(1);

      // assert
      expect(tabChangeSpy).toHaveBeenCalledWith(1);
    });
  });
});
