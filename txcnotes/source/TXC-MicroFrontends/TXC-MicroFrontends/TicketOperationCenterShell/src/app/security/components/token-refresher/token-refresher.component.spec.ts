import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TokenRefresherComponent } from './token-refresher.component';

describe('TokenRefresherComponent', () => {
  let component: TokenRefresherComponent;
  let fixture: ComponentFixture<TokenRefresherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TokenRefresherComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TokenRefresherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
