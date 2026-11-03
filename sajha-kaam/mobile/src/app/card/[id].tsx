// Job detail: the bilingual Kaam Card a worker reads before applying.
import { router, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

import { useCard, useMe } from '@/api/hooks';
import { Icon } from '@/components/Icon';
import { KaamCardBody } from '@/components/KaamCard';
import { Screen } from '@/components/Screen';
import { Txt } from '@/components/Txt';
import { Button, Panel, StateView, Tag } from '@/components/ui';
import { useT } from '@/i18n';
import { money } from '@/lib/format';
import { colors, space } from '@/theme';

export default function CardDetailScreen() {
  const { t, country } = useT();
  const { id } = useLocalSearchParams<{ id: string }>();
  const card = useCard(id);
  const me = useMe();

  if (card.isPending) return <Screen back><StateView state="loading" /></Screen>;
  if (card.isError || !card.data) {
    return <Screen back><StateView state="error" message={t('card.notFound')} onRetry={() => card.refetch()} /></Screen>;
  }
  const c = card.data;
  const action = me.data?.role === 'client' ? null : (
    <Button
      label={me.data ? t('card.apply') : t('auth.signIn')}
      onPress={() =>
        me.data
          ? router.push({ pathname: '/apply/[id]', params: { id: c.id } })
          : router.push({ pathname: '/sign-in', params: { role: 'worker' } })
      }
    />
  );
  return (
    <Screen back footer={action}>
      <View style={{ flexDirection: 'row', gap: space.lg, flexWrap: 'wrap' }}>
        {c.pahilo_kaam ? <Tag tone="honey" label={t('board.pahiloTag')} /> : null}
        {c.reviewed_by_sajha ? <Tag tone="sage" label={t('card.reviewed')} /> : null}
        <Tag icon="globe" label={country(c.client_country)} />
      </View>
      <KaamCardBody
        card={c}
        aside={
          <Panel tone="ink" style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap' }}>
            <View style={{ gap: 2 }}>
              <Txt variant="label" color={colors.honeyLight}>{t('card.fixedPrice')}</Txt>
              <Txt variant="h1" color={colors.white}>{money(c.price.amount_minor, c.price.currency)}</Txt>
            </View>
            <Txt variant="small" color="rgba(255,255,255,0.75)">
              {`${t('card.days', { count: c.deadline_days })}  ·  ${t('card.revisions', { count: c.revisions_included })}`}
            </Txt>
          </Panel>
        }
      />
      <View style={{ flexDirection: 'row', gap: space.md, alignItems: 'flex-start' }}>
        <Icon name="shield" size={22} color={colors.green} />
        <View style={{ flex: 1, gap: 2 }}>
          <Txt variant="h3">{t('card.workersPayNothing')}</Txt>
          <Txt variant="small" color={colors.inkSoft}>{t('card.payoutNote')}</Txt>
        </View>
      </View>
    </Screen>
  );
}
