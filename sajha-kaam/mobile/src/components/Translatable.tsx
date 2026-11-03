// Text written in the other language, with "Translate" and, once translated, "Show original" plus an
// AI tag (Airbnb's pattern: the original is always one tap away). Used for applicant text in blind
// review and for chat messages. Translation never feeds any score.
import { useState } from 'react';
import { View } from 'react-native';

import { useTranslate } from '@/api/hooks';
import { useT } from '@/i18n';
import { colors, space } from '@/theme';

import { AiTag } from './ai';
import { Txt } from './Txt';
import { Button } from './ui';

export function Translatable({ text, lang, color }: { text: string; lang: string; color?: string }) {
  const { t, locale } = useT();
  const translate = useTranslate();
  const [shown, setShown] = useState<'original' | 'translated'>('original');
  const canTranslate = lang !== locale;
  const translated = translate.data;
  const showing = shown === 'translated' && translated && translated.source !== 'original';
  return (
    <View style={{ gap: space.xs }}>
      <Txt color={color}>{showing ? translated.text : text}</Txt>
      {canTranslate ? (
        <View style={{ flexDirection: 'row', gap: space.md, alignItems: 'center', flexWrap: 'wrap' }}>
          <Button
            kind="quiet"
            label={shown === 'translated' ? t('common.showOriginal') : t('common.translate')}
            busy={translate.isPending}
            onPress={() => {
              if (shown === 'translated') return setShown('original');
              if (!translated) translate.mutate({ text, target: locale });
              setShown('translated');
            }}
          />
          {showing ? <AiTag kind={translated.source === 'ai' ? 'translated' : 'template'} /> : null}
          {shown === 'translated' && translated?.source === 'original' ? (
            <Txt variant="small" color={colors.inkSoft}>{t('common.noTranslation')}</Txt>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}
