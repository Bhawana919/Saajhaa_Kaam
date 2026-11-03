// Board list item and the full bilingual Kaam Card body (used by job detail and draft preview).
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import type { BoardCard, KaamCardDraft } from '@/api/types';
import { useT } from '@/i18n';
import { hoursUntil, money } from '@/lib/format';
import { colors, radius, space } from '@/theme';

import { Icon } from './Icon';
import { PressScale } from './motion';
import { Txt } from './Txt';
import { Bullet, Section, Tag } from './ui';

/**
 * A Kaam Card on the board. Reading order follows the worker's real questions:
 * what is the job, what does it pay, how long, how many others. Price is the one big number.
 * Time left is calm text, never a countdown.
 */
export function BoardItem({ card, onPress }: { card: BoardCard; onPress: () => void }) {
  const { t, pick, country } = useT();
  const hours = hoursUntil(card.window_closes_at);
  const title = pick(card.title_ne, card.title_en);
  const price = money(card.price.amount_minor, card.price.currency);
  const meta = [country(card.client_country), t('card.days', { count: card.deadline_days }), t('card.revisions', { count: card.revisions_included })].join('  ·  ');
  return (
    <PressScale accessibilityRole="button" accessibilityLabel={`${title}, ${price}`} onPress={onPress} style={item.root}>
      {card.pahilo_kaam ? <Tag tone="honey" label={t('board.pahiloTag')} /> : null}
      <View style={item.head}>
        <Txt variant="h3" style={{ flex: 1 }}>{title}</Txt>
        <Txt variant="money">{price}</Txt>
      </View>
      <Txt variant="small" color={colors.inkSoft}>{meta}</Txt>
      <View style={item.foot}>
        <Txt variant="label" color={colors.inkSoft}>
          {t('board.applicants', { count: card.applicant_count, max: card.max_applicants })}
        </Txt>
        {hours !== null ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Icon name="clock" size={14} color={colors.inkSoft} strokeWidth={2} />
            <Txt variant="label" color={colors.inkSoft}>{t('board.closesInHours', { count: hours })}</Txt>
          </View>
        ) : null}
      </View>
    </PressScale>
  );
}

const item = StyleSheet.create({
  root: { backgroundColor: colors.white, borderRadius: radius.lg, padding: space.lg, gap: space.sm },
  head: { flexDirection: 'row', alignItems: 'flex-start', gap: space.md },
  foot: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: space.sm,
    marginTop: space.xs,
    paddingTop: space.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.line,
  },
});

type CardBody = Pick<
  KaamCardDraft,
  | 'title_ne' | 'title_en' | 'summary_ne' | 'summary_en' | 'deliverables' | 'checklist'
  | 'sample_brief_ne' | 'sample_brief_en' | 'questions' | 'reference_language'
>;

/** The card in the reader's language, with the reference-version tag. */
export function KaamCardBody({ card, aside }: { card: CardBody; aside?: ReactNode }) {
  const { t, pick, digits } = useT();
  const refLang = card.reference_language === 'ne' ? t('lang.ne') : t('lang.en');
  return (
    <View style={{ gap: space.xl }}>
      <View style={{ gap: space.sm }}>
        <Txt variant="h1">{pick(card.title_ne, card.title_en)}</Txt>
        <Txt color={colors.inkSoft}>{pick(card.summary_ne, card.summary_en)}</Txt>
      </View>
      {aside}
      <Section title={t('card.deliverables')}>
        {card.deliverables.map((d) => (
          <Bullet key={d.id}>{pick(d.text_ne, d.text_en)}</Bullet>
        ))}
      </Section>
      <Section title={t('card.doneWhen')} help={t('card.doneWhenHelp')}>
        {card.checklist.map((c) => (
          <Bullet key={c.id} mark="☐">{pick(c.text_ne, c.text_en)}</Bullet>
        ))}
      </Section>
      <Section title={t('card.sampleBrief')}>
        <Txt>{pick(card.sample_brief_ne, card.sample_brief_en)}</Txt>
      </Section>
      <Txt variant="label" color={colors.inkFaint}>{t('card.reference', { lang: refLang })}</Txt>
      <Section title={t('card.questions')}>
        {card.questions.map((q, i) => (
          <Bullet key={i} mark={`${digits(i + 1)}.`}>{pick(q.ne, q.en)}</Bullet>
        ))}
      </Section>
    </View>
  );
}
