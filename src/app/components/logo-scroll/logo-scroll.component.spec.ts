import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogoScrollComponent } from './logo-scroll.component';

describe('LogoScrollComponent', () => {
  let component: LogoScrollComponent;
  let fixture: ComponentFixture<LogoScrollComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LogoScrollComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LogoScrollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
