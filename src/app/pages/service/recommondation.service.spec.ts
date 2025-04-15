import { TestBed } from '@angular/core/testing';

import { RecommondationService } from './recommondation.service';

describe('RecommondationService', () => {
  let service: RecommondationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecommondationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
