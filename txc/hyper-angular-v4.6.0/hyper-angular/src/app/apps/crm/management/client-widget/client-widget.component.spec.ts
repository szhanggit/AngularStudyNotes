import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientWidgetComponent } from './client-widget.component';

describe('ClientWidgetComponent', () => {
  let component: ClientWidgetComponent;
  let fixture: ComponentFixture<ClientWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientWidgetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
