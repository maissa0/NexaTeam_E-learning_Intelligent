import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterFrontOfComponent } from './footer-front-of.component';

describe('FooterFrontOfComponent', () => {
  let component: FooterFrontOfComponent;
  let fixture: ComponentFixture<FooterFrontOfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterFrontOfComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FooterFrontOfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
