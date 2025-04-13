import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderFrontOfComponent } from './header-front-of.component';

describe('HeaderFrontOfComponent', () => {
  let component: HeaderFrontOfComponent;
  let fixture: ComponentFixture<HeaderFrontOfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderFrontOfComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderFrontOfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
