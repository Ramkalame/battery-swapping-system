import { TestBed } from '@angular/core/testing';

import { OpenBoxSignalService } from './open-box-signal.service';

describe('OpenBoxSignalService', () => {
  let service: OpenBoxSignalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OpenBoxSignalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
