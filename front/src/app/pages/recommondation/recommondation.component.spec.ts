import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecommondationComponent } from './recommondation.component';

describe('RecommondationComponent', () => {
  let component: RecommondationComponent;
  let fixture: ComponentFixture<RecommondationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecommondationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecommondationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
