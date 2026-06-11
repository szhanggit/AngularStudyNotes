import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppMissionResultRendererComponent } from './app-mission-result-renderer.component';

describe('AppMissionResultRendererComponent', () => {
  let component: AppMissionResultRendererComponent;
  let fixture: ComponentFixture<AppMissionResultRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppMissionResultRendererComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppMissionResultRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
