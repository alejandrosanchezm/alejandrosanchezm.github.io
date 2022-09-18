import { PersonalData } from './personal-data.model';

describe('PersonalData', () => {
  it('should create an instance', () => {
    expect(new PersonalData('','','','','','','','')).toBeTruthy();
  });
});
