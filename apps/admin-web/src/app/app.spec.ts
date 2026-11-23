import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';
import { routes } from './app.routes';

describe('App shell', () => {
  beforeEach(async () => {
    document.documentElement.removeAttribute('data-dosa-theme');
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter(routes)],
    }).compileComponents();
  });

  it('applies the default DOSA theme to <html>', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    expect(document.documentElement.getAttribute('data-dosa-theme')).toBe('admin-light');
  });

  it('renders the glass top bar and an accessible theme toggle', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.topbar.dosa-glass.dosa-glass--subtle')).not.toBeNull();
    const toggle = el.querySelector<HTMLButtonElement>('.topbar button');
    expect(toggle?.getAttribute('aria-label')).toBe('Switch to monitoring theme');
  });

  it('switches to the monitoring theme and persists it', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>('.topbar button')?.click();
    await fixture.whenStable();
    expect(document.documentElement.getAttribute('data-dosa-theme')).toBe('admin-monitor');
    expect(localStorage.getItem('dosa.admin.theme')).toBe('admin-monitor');
  });
});
