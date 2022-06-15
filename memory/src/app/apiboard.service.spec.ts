import { TestBed } from '@angular/core/testing';

import { ApiboardService } from './apiboard.service';

describe('ApiboardService', () => {
  let service: ApiboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
