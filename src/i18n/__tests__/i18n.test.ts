import { describe, it, expect } from 'vitest';
import i18next from 'i18next';
import enCommon from '../../../public/locales/en/common.json';
import enSearchAPL from '../../../public/locales/en/searchAPL.json';
import enLegacyLogin from '../../../public/locales/en/legacy/login-page.json';
import viLegacyLogin from '../../../public/locales/vi/legacy/login-page.json';

describe('Locale JSON sanity', () => {
  it('common.json has required namespaces', () => {
    expect(enCommon.button.search).toBe('Search');
    expect(enCommon.button.reset).toBe('Reset');
    expect(enCommon.state.loading).toBe('Loading...');
    expect(enCommon.state.empty).toBe('No results found');
  });

  it('searchAPL.json has expected keys', () => {
    expect(enSearchAPL.title).toBe('APL Reports');
    expect(enSearchAPL.filter.apl_ID).toBe('APL ID');
    expect(enSearchAPL.column.assessor).toBe('Assessor');
    expect(enSearchAPL.status.pending).toBe('Pending');
  });

  it('common.json interpolation placeholders present', () => {
    expect(enCommon.common.showing).toContain('{{from}}');
    expect(enCommon.common.showing).toContain('{{to}}');
    expect(enCommon.common.showing).toContain('{{total}}');
  });

  it('legacy login-page namespace converted from XML for en and vi', () => {
    expect((enLegacyLogin as Record<string, string>).login).toBe('Login');
    expect((enLegacyLogin as Record<string, string>).username).toBe('Username');
    expect((viLegacyLogin as Record<string, string>).username).toBe('Tên tài khoản');
  });
});

describe('i18next language switching', () => {
  it('changeLanguage flips resolved text from en to vi', async () => {
    const instance = i18next.createInstance();
    await instance.init({
      lng: 'en',
      fallbackLng: 'en',
      defaultNS: 'legacy/login-page',
      ns: ['legacy/login-page'],
      resources: {
        en: { 'legacy/login-page': enLegacyLogin },
        vi: { 'legacy/login-page': viLegacyLogin },
      },
      interpolation: { escapeValue: false },
    });

    expect(instance.t('username')).toBe('Username');
    await instance.changeLanguage('vi');
    expect(instance.t('username')).toBe('Tên tài khoản');

    // vi has only 9 keys; missing ones fall back to en (the master)
    await instance.changeLanguage('vi');
    expect(instance.t('login')).toBe('Login');
  });
});
