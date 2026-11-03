// The worker's own application: the job, its status, and one reference line (ID + date) for support.
// Clients only ever see applicants by letter until they pick.
import type { ReactNode } from 'react';
import { View } from 'react-native';

import type { MyApplication } from '@/api/types';
import { useT } from '@/i18n';
import { colors, space } from '@/theme';

import { Txt } from './Txt';
import { Panel, Tag } from './ui';

export function ApplicationCard({ a, children }: { a: MyApplication; tone?: 'white' | 'clay' | 'sage'; children?: ReactNode }) {
  const { t, pick, digits } = useT();
  return (
    <Panel>
      <View style={{ gap: space.xs }}>
        <Txt variant="h3">{pick(a.title_ne, a.title_en)}</Txt>
        <Tag tone={a.state === 'picked' ? 'brick' : ['withdrawn', 'not_picked_feedback_sent'].includes(a.state) ? 'clay' : 'honey'} label={t(`work.appState_${a.state}`)} />
      </View>
      <Txt variant="label" color={colors.inkFaint} selectable>
        {`${a.application_ref}  ·  ${t('appCard.sentOn')} ${digits(a.created_at.slice(0, 10))}`}
      </Txt>
      {children}
    </Panel>
  );
}
