// My work: applications (with checklist feedback), active jobs and completed jobs.
import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { useMyApplications, useMyEngagements, usePassport, useWithdraw } from '@/api/hooks';
import type { MyApplication } from '@/api/types';
import { ApplicationCard } from '@/components/ApplicationCard';
import { KaamPath } from '@/components/brand/Honeycomb';
import { Mauri } from '@/components/brand/Mauri';
import { useErrorText } from '@/components/forms';
import { PressScale } from '@/components/motion';
import { Screen } from '@/components/Screen';
import { Txt } from '@/components/Txt';
import { Bullet, Button, NextAction, Panel, StateView, Tabs, Tag } from '@/components/ui';
import { useT } from '@/i18n';
import { money } from '@/lib/format';
import { colors, radius, space } from '@/theme';

const DONE = ['completed', 'passport_issued'];

function ApplicationRow({ a }: { a: MyApplication }) {
  const { t, pick } = useT();
  const withdraw = useWithdraw();
  const offered = a.state === 'picked' && a.card_state === 'revealed' && a.engagement_id;
  return (
    <ApplicationCard a={a} tone={offered ? 'clay' : 'white'}>
      {offered ? (
        <>
          <Txt>{t('work.offer')}</Txt>
          <Button label={t('work.openJob')} onPress={() => router.push({ pathname: '/workroom/[id]', params: { id: a.engagement_id! } })} />
        </>
      ) : null}
      {a.feedback ? (
        <View style={{ gap: space.xs }}>
          <Txt>{t('work.feedbackMet', { met: a.feedback.met, total: a.feedback.total })}</Txt>
          {a.feedback.missing.length ? <Txt variant="label" color={colors.brick}>{t('work.missing')}</Txt> : null}
          {a.feedback.missing.map((m) => <Bullet key={m.id} mark="✗">{pick(m.text_ne, m.text_en)}</Bullet>)}
        </View>
      ) : null}
      {['submitted', 'scored'].includes(a.state) && ['open', 'closed_for_applications', 'in_review'].includes(a.card_state) ? (
        <Button kind="quiet" label={t('work.withdraw')} busy={withdraw.isPending} onPress={() => withdraw.mutate(a.id)} />
      ) : null}
    </ApplicationCard>
  );
}

export default function MyWork() {
  const { t, pick } = useT();
  const apps = useMyApplications();
  const engs = useMyEngagements();
  const errorText = useErrorText();
  const [tab, setTab] = useState<'applications' | 'active' | 'completed'>('applications');
  const accepted = (engs.data ?? []).filter((e) => e.state === 'accepted');
  const active = accepted.filter((e) => !DONE.includes(e.card_state));
  const completed = accepted.filter((e) => DONE.includes(e.card_state));
  const error = apps.error ?? engs.error;
  const passport = usePassport();
  const p = passport.data;
  const offer = (apps.data ?? []).find((a) => a.state === 'picked' && a.card_state === 'revealed' && a.engagement_id);
  const next = offer
    ? { body: t('work.offer'), cta: t('work.openJob'), go: () => router.push({ pathname: '/workroom/[id]', params: { id: offer.engagement_id! } }) }
    : active[0]
      ? { body: pick(active[0].title_ne, active[0].title_en), cta: t('work.openJob'), go: () => router.push({ pathname: '/workroom/[id]', params: { id: active[0].id } }) }
      : apps.isSuccess && apps.data.length === 0
        ? { body: t('work.nextFind'), cta: t('board.title'), go: () => router.push('/worker/board') }
        : null;

  return (
    <Screen title={t('work.title')}>
      {p ? (
        <View style={styles.hero}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: space.md }}>
            <View style={{ flex: 1, gap: 2 }}>
              <Txt variant="label" color={colors.pineSoft}>{t('level.pathTitle')}</Txt>
              <Txt variant="h1" color={colors.white}>{pick(p.level.ne, p.level.en)}</Txt>
            </View>
            <Mauri pose="fly" size={56} motion="hover" />
          </View>
          <KaamPath onDark filled={p.confirmed_jobs} toNext={p.jobs_to_next} label={t('level.pathA11y', { count: p.confirmed_jobs })} />
          {p.next_level && p.jobs_to_next != null ? (
            <Txt variant="small" color={colors.pineSoft}>
              {t('passport.nextLevel', { count: p.jobs_to_next, level: pick(p.next_level.ne, p.next_level.en) })}
            </Txt>
          ) : null}
        </View>
      ) : null}
      {next ? <NextAction title={t('work.nextTitle')} body={next.body} cta={next.cta} onPress={next.go} /> : null}
      <Tabs
        value={tab}
        onChange={setTab}
        items={[
          { key: 'applications', label: t('work.applications'), count: apps.data?.length },
          { key: 'active', label: t('work.active'), count: active.length },
          { key: 'completed', label: t('work.completed'), count: completed.length },
        ]}
      />
      {apps.isPending || engs.isPending ? <StateView state="loading" /> : null}
      {error ? <StateView state="error" message={errorText(error) ?? undefined} onRetry={() => { void apps.refetch(); void engs.refetch(); }} /> : null}

      {tab === 'applications' ? (
        apps.data?.length ? apps.data.map((a) => <ApplicationRow key={a.id} a={a} />) : apps.isSuccess ? (
          <StateView state="empty" message={t('work.empty')}
                     action={<Button label={t('board.title')} onPress={() => router.push('/worker/board')} />} />
        ) : null
      ) : null}

      {tab !== 'applications'
        ? (tab === 'active' ? active : completed).map((e) => (
            <PressScale key={e.id} accessibilityRole="button" onPress={() => router.push({ pathname: '/workroom/[id]', params: { id: e.id } })}>
              <Panel>
                <View style={{ flexDirection: 'row', gap: space.md, alignItems: 'flex-start' }}>
                  <Txt variant="h3" style={{ flex: 1 }}>{pick(e.title_ne, e.title_en)}</Txt>
                  <Txt variant="money">{money(e.price_minor, e.currency)}</Txt>
                </View>
                <Tag tone={DONE.includes(e.card_state) ? 'sage' : 'brick'} label={t(`cardState.${e.card_state}`)} />
              </Panel>
            </PressScale>
          ))
        : null}
      {tab !== 'applications' && engs.isSuccess && (tab === 'active' ? active : completed).length === 0 ? (
        <StateView state="empty" message={t('work.empty')} />
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { backgroundColor: colors.pine, borderRadius: radius.lg, padding: space.lg, gap: space.md },
});
