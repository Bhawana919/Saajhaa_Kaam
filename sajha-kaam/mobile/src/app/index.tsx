// Entry: language choice on first launch, then role choice. Signed-in users go to their home tab.
// Layout: one full-bleed brick block carries the brand and the promise; below it, two big
// choices. The worker choice comes first and is the dark tile: first-job seekers are why we exist.
import { Redirect, router } from 'expo-router';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useMe } from '@/api/hooks';
import { Mauri } from '@/components/brand/Mauri';
import { Icon } from '@/components/Icon';
import { FadeIn, PressScale } from '@/components/motion';
import { DemoMark, LangSwitch, Screen } from '@/components/Screen';
import { Txt } from '@/components/Txt';
import { StateView } from '@/components/ui';
import i18n, { applyLocale, deviceLocale, useT } from '@/i18n';
import { usePrefs } from '@/state/prefs';
import { useSession } from '@/state/session';
import { colors, contentMaxWidth, radius, space } from '@/theme';

function Choice({ title, sub, dark, onPress, delay = 0 }: { title: string; sub?: string; dark?: boolean; onPress: () => void; delay?: number }) {
  return (
    <FadeIn delay={delay}>
      <PressScale accessibilityRole="button" accessibilityLabel={sub ? `${title}. ${sub}` : title} onPress={onPress}
                  style={[styles.choice, { backgroundColor: dark ? colors.ink : colors.white }]}>
        <View style={{ flex: 1, gap: 2 }}>
          <Txt variant="h2" color={dark ? colors.white : colors.ink}>{title}</Txt>
          {sub ? <Txt variant="small" color={dark ? 'rgba(255,255,255,0.72)' : colors.inkSoft}>{sub}</Txt> : null}
        </View>
        <View style={[styles.arrow, { backgroundColor: dark ? colors.honey : colors.ink }]}>
          <Icon name="chevronRight" size={20} color={dark ? colors.ink : colors.white} strokeWidth={2.4} />
        </View>
      </PressScale>
    </FadeIn>
  );
}

function Hero({ children, controls = true }: { children: ReactNode; controls?: boolean }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.hero, { paddingTop: insets.top + space.sm }]}>
      <View style={styles.heroInner}>
        {controls ? (
          <View style={styles.heroBar}>
            <DemoMark onDark />
            <LangSwitch onDark />
          </View>
        ) : null}
        {children}
      </View>
    </View>
  );
}

function LanguageChoice() {
  const setLocale = usePrefs((s) => s.setLocale);
  const suggested = deviceLocale();
  // Nothing is chosen yet, so both languages are shown, straight from the locale files.
  const [neT, enT] = [i18n.getFixedT('ne'), i18n.getFixedT('en')];
  const choose = (l: 'ne' | 'en') => {
    setLocale(l);
    applyLocale(l);
  };
  const order = suggested === 'ne' ? (['ne', 'en'] as const) : (['en', 'ne'] as const);
  return (
    <Screen header={false} bare>
      <Hero controls={false}>
        <View style={styles.heroRow}>
          <View style={{ flex: 1, gap: space.xs }}>
            <Txt variant="display" color={colors.white}>{neT('common.appName')}</Txt>
            <Txt variant="label" color={colors.brickSoft}>{enT('common.appName')}</Txt>
          </View>
          <Mauri pose="wave" size={112} motion="hover" />
        </View>
        <Txt variant="h3" color={colors.white}>{neT('mauri.hello')}</Txt>
      </Hero>
      <View style={styles.pad}>
        <Txt variant="h2">{`${neT('lang.chooseTitle')} / ${enT('lang.chooseTitle')}`}</Txt>
        {order.map((l, i) => (
          <Choice key={l} delay={60 * i} dark={l === suggested}
                  title={neT(`lang.${l}`)} sub={l === 'ne' ? enT('lang.neName') : neT('lang.enName')}
                  onPress={() => choose(l)} />
        ))}
        <Txt variant="small" color={colors.inkSoft}>{neT('lang.chooseSub')}</Txt>
      </View>
    </Screen>
  );
}

export default function Entry() {
  const { t } = useT();
  const locale = usePrefs((s) => s.locale);
  const signedIn = useSession((s) => !!s.tokens);
  const me = useMe();

  if (!locale) return <LanguageChoice />;
  if (signedIn) {
    if (me.data?.role === 'client') return <Redirect href="/client/post" />;
    if (me.data?.role === 'worker') return <Redirect href="/worker/work" />;
    if (me.data?.role === 'admin') return <Redirect href="/admin" />;
    if (me.isPending) return <Screen><StateView state="loading" /></Screen>;
  }

  const start = (role: 'client' | 'worker') => router.push({ pathname: '/sign-in', params: { role } });
  return (
    <Screen header={false} bare>
      <Hero>
        <View style={styles.heroRow}>
          <Txt variant="display" color={colors.white} style={{ flex: 1 }}>{t('entry.promise')}</Txt>
          <Mauri pose="wave" size={104} motion="hover" />
        </View>
        <Txt color={colors.brickSoft}>{t('common.tagline')}</Txt>
      </Hero>
      <View style={styles.pad}>
        <Txt variant="h2">{t('entry.chooseRole')}</Txt>
        <Choice dark delay={40} title={t('entry.workerTitle')} sub={t('entry.workerSub')} onPress={() => start('worker')} />
        <Choice delay={100} title={t('entry.clientTitle')} sub={t('entry.clientSub')} onPress={() => start('client')} />
        <PressScale accessibilityRole="link" onPress={() => router.push('/board')} style={styles.link}>
          <Txt variant="h3" style={{ textDecorationLine: 'underline' }}>{t('entry.browseGuest')}</Txt>
        </PressScale>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: colors.brick,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    paddingHorizontal: space.lg,
    paddingBottom: space.xl,
  },
  heroInner: { width: '100%', maxWidth: contentMaxWidth, alignSelf: 'center', gap: space.md },
  heroBar: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: space.sm },
  heroRow: { flexDirection: 'row', alignItems: 'flex-end', gap: space.md, paddingTop: space.lg },
  pad: { paddingHorizontal: space.lg, paddingTop: space.xl, gap: space.md, width: '100%', maxWidth: contentMaxWidth, alignSelf: 'center' },
  choice: { borderRadius: radius.lg, paddingVertical: space.lg + 2, paddingHorizontal: space.lg, flexDirection: 'row', alignItems: 'center', gap: space.md },
  arrow: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  link: { minHeight: 48, justifyContent: 'center', alignSelf: 'flex-start' },
});
