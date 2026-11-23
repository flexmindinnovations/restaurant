import { TestBed } from '@angular/core/testing';
import { Foundations } from './foundations';

describe('Foundations check page', () => {
  it('shows every order state with an icon and a text label', async () => {
    const fixture = TestBed.createComponent(Foundations);
    await fixture.whenStable();
    const badges = Array.from((fixture.nativeElement as HTMLElement).querySelectorAll('.badge[data-state]'));
    expect(badges.map((b) => b.getAttribute('data-state'))).toEqual([
      'received', 'accepted', 'preparing', 'ready', 'served', 'cancelled', 'delayed',
    ]);
    for (const b of badges) {
      expect(b.querySelector('dosa-icon svg')).not.toBeNull();
      expect(b.textContent?.trim().length).toBeGreaterThan(0);
    }
  });

  it('uses tabular numeric styles for metric values', async () => {
    const fixture = TestBed.createComponent(Foundations);
    await fixture.whenStable();
    const values = (fixture.nativeElement as HTMLElement).querySelectorAll('.metric__value.dosa-numeric-lg');
    expect(values.length).toBe(4);
  });
});
