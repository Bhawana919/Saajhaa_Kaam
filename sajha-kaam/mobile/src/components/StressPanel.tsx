// Kaam Card Stress Test: clarity meter + issues with one-tap rewrites. Advice only, never blocks posting.
import { useState } from 'react';
import { View } from 'react-native';

import { useStressTest } from '@/api/hooks';
import type { KaamCardDraft, StressResult } from '@/api/types';
import { useT } from '@/i18n';
import { colors, space } from '@/theme';

import { AiTag } from './ai';
import { useErrorText } from './forms';
import { Txt } from './Txt';
import { Button, Panel, Section, StateView, Tag } from './ui';

type Issue = StressResult['issues'][number];

/** Apply a rewrite: replace a checklist item, or add one for a deliverable that had none. */
export function applyRewrite(card: KaamCardDraft, issue: Issue): KaamCardDraft {
  const text = { text_en: issue.suggested_rewrite_en, text_ne: issue.suggested_rewrite_ne };
  if (card.checklist.some((c) => c.id === issue.item_id)) {
    return { ...card, checklist: card.checklist.map((c) => (c.id === issue.item_id ? { ...c, ...text, testable: true } : c)) };
  }
  if (card.deliverables.some((d) => d.id === issue.item_id)) {
    const n = card.checklist.reduce((m, c) => Math.max(m, parseInt(c.id.replace(/\D/g, ''), 10) || 0), 0) + 1;
    return { ...card, checklist: [...card.checklist, { id: `c${n}`, deliverable_id: issue.item_id, ...text, testable: true }] };
  }
  return card;
}

export function StressPanel({ card, setCard }: { card: KaamCardDraft; setCard: (c: KaamCardDraft) => void }) {
  const { t, pick } = useT();
  const stress = useStressTest();
  // Ignored suggestions stay ignored for this run (HAX G8: support efficient dismissal).
  const [ignored, setIgnored] = useState<Set<string>>(new Set());
  const keyOf = (i: Issue, n: number) => `${i.item_id}-${n}`;
  const errorText = useErrorText();
  const result = stress.data;
  const isApplied = (i: Issue) =>
    card.checklist.some((c) => c.text_en === i.suggested_rewrite_en && c.text_ne === i.suggested_rewrite_ne);
  const label = (id: string) => {
    const item = card.checklist.find((c) => c.id === id) ?? card.deliverables.find((d) => d.id === id);
    return item ? pick(item.text_ne, item.text_en) : id;
  };

  return (
    <Panel tone="clay">
      <Section title={t('stress.title')} help={t('stress.help')}>
        <Button kind="secondary" label={t('stress.run')} busy={stress.isPending}
                onPress={() => { setIgnored(new Set()); stress.mutate(card); }} />
      </Section>
      {stress.isError ? <StateView state="error" message={errorText(stress.error) ?? undefined} onRetry={() => stress.mutate(card)} /> : null}
      {result ? (
        <View style={{ gap: space.md }}>
          <AiTag kind={result.source === 'ai' ? 'suggestion' : 'rules'} />
          <Txt variant="h3">
            {t('stress.meter', { before: result.testable_before, after: result.testable_after_if_all_applied, total: result.total_items })}
          </Txt>
          {result.issues.length === 0 ? <Txt color={colors.sage}>{t('stress.noIssues')}</Txt> : null}
          {result.issues.map((i, n) => {
            const k = keyOf(i, n);
            const applied = isApplied(i);
            return (
              <Panel key={k} style={{ borderWidth: 1, borderColor: colors.line }}>
                <Tag tone={i.severity === 'high' ? 'brick' : 'clay'} label={t(`stress.severity_${i.severity}`)} />
                <Txt variant="small" color={colors.inkSoft}>{label(i.item_id)}</Txt>
                <Txt variant="h3">{pick(i.problem_ne, i.problem_en)}</Txt>
                <Txt variant="small" color={colors.inkSoft}>{pick(i.why_dispute_risk_ne, i.why_dispute_risk_en)}</Txt>
                {ignored.has(k) ? (
                  <Txt variant="small" color={colors.inkSoft}>{t('stress.ignored')}</Txt>
                ) : i.suggested_rewrite_en ? (
                  <>
                    <View style={{ gap: 2 }}>
                      <Txt variant="label" color={colors.inkSoft}>{t('ai.tag_suggestion')}</Txt>
                      <Txt>{pick(i.suggested_rewrite_ne, i.suggested_rewrite_en)}</Txt>
                    </View>
                    <View style={{ flexDirection: 'row', gap: space.md, alignItems: 'center', flexWrap: 'wrap' }}>
                      <Button kind={applied ? 'quiet' : 'secondary'} disabled={applied}
                              icon={applied ? 'check' : undefined} label={applied ? t('stress.applied') : t('stress.apply')}
                              onPress={() => setCard(applyRewrite(card, i))} />
                      {!applied ? (
                        <Button kind="quiet" label={t('stress.ignore')} onPress={() => setIgnored(new Set(ignored).add(k))} />
                      ) : null}
                    </View>
                  </>
                ) : (
                  <Txt variant="small" color={colors.inkSoft}>{t('stress.writeYourOwn')}</Txt>
                )}
              </Panel>
            );
          })}
        </View>
      ) : null}
    </Panel>
  );
}
