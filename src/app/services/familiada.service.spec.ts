import { TestBed } from '@angular/core/testing';

import { FamiliadaService } from './familiada.service';

describe('FamiliadaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FamiliadaService = TestBed.get(FamiliadaService);
    expect(service).toBeTruthy();
  });
});
