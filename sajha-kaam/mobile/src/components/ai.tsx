// How AI shows up in the UI (docs/AI_AND_DESIGN_RESEARCH.md §A6):
//  - No sparkles, no glow, no purple. A plain bilingual text tag ("AI draft · एआई मस्यौदा") with an ink outline.
//  - Tapping the tag opens "How this was made": what the AI did, what it saw, that you decide, and that
//    AI never ranks, scores or chooses people here (IBM Carbon's label -> explainability pattern).
//  - AiFrame: a dashed outline while AI output is unapproved; solid once a person has checked it.
import { type ReactNode, useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';

import i18n, { useT } from '@/i18n';
import { colors, radius, space } from '@/theme';

import { Icon } from './Icon';
import { Txt } from './Txt';
import { Button } from './ui';

export type AiKind = 'draft' | 'suggestion' | 'translated' | 'story' | 'explain' | 'template' | 'rules';

const TAG_KEY: Record<AiKind, string> = {
  draft: 'ai.tag_draft',
  suggestion: 'ai.tag_suggestion',
  translated: 'ai.tag_translated',
  story: 'ai.tag_draft',
  explain: 'ai.tag_explain',
  template: 'ai.tag_template',
  rules: 'ai.tag_rules',
};

/** Bilingual label: both scripts always, the reader's language first. */
function bilingual(key: string, locale: 'ne' | 'en') {
  const ne = i18n.getFixedT('ne')(key);
  const en = i18n.getFixedT('en')(key);
  return locale === 'ne' ? `${ne} · ${en}` : `${en} · ${ne}`;
}

export function AiTag({ kind, checked = false }: { kind: AiKind; checked?: boolean }) {
  const { t, locale } = useT();
  const [open, setOpen] = useState(false);
  const label = checked ? bilingual('ai.tag_checked', locale) : bilingual(TAG_KEY[kind], locale);
  const isAi = kind !== 'template' && kind !== 'rules';
  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${label}. ${t('ai.a11yOpen')}`}
        onPress={() => setOpen(true)}
        hitSlop={8}
        style={({ pressed }) => [styles.tag, checked && styles.tagChecked, !isAi && styles.tagPlain, pressed && { opacity: 0.7 }]}
      >
        {checked ? <Icon name="check" size={14} color={colors.green} strokeWidth={2.4} /> : null}
        <Txt variant="label" color={checked ? colors.green : colors.ink}>{label}</Txt>
        <Icon name="help" size={14} color={colors.inkSoft} strokeWidth={2} />
      </Pressable>
      <AiSheet kind={kind} open={open} onClose={() => setOpen(false)} />
    </>
  );
}

function AiSheet({ kind, open, onClose }: { kind: AiKind; open: boolean; onClose: () => void }) {
  const { t } = useT();
  const k = kind === 'story' ? 'story' : kind;
  return (
    <Modal visible={open} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <Pressable style={styles.scrim} onPress={onClose} accessibilityRole="button" accessibilityLabel={t('ai.close')} />
      <View style={styles.sheet} accessibilityViewIsModal>
        <View style={styles.grip} />
        <Txt variant="h2" accessibilityRole="header">{t('ai.sheetTitle')}</Txt>
        <View style={{ gap: 2 }}>
          <Txt variant="label" color={colors.inkSoft}>{t('ai.whatDid')}</Txt>
          <Txt>{t(`ai.did_${k}`)}</Txt>
        </View>
        <View style={{ gap: 2 }}>
          <Txt variant="label" color={colors.inkSoft}>{t('ai.whatSaw')}</Txt>
          <Txt>{t(`ai.saw_${k}`)}</Txt>
        </View>
        <View style={styles.rule} />
        <Txt variant="h3">{t('ai.checkIt')}</Txt>
        <View style={{ flexDirection: 'row', gap: space.sm, alignItems: 'flex-start' }}>
          <Icon name="shield" size={18} color={colors.green} />
          <Txt variant="small" color={colors.inkSoft} style={{ flex: 1 }}>{t('ai.never')}</Txt>
        </View>
        <Button label={t('ai.close')} onPress={onClose} />
      </View>
    </Modal>
  );
}

/** Wraps AI output: dashed while it is still a draft, solid once a person approved it. */
export function AiFrame({ approved, children, style }: { approved: boolean; children: ReactNode; style?: object }) {
  return (
    <View style={[styles.frame, { borderStyle: approved ? 'solid' : 'dashed', borderColor: approved ? colors.green : colors.ink }, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: space.sm + 2,
    paddingVertical: 4,
    borderRadius: radius.sm,
    borderWidth: 1.5,
    borderColor: colors.ink,
    backgroundColor: colors.white,
  },
  tagChecked: { borderColor: colors.green },
  tagPlain: { borderColor: colors.lineStrong },
  scrim: { flex: 1, backgroundColor: 'rgba(22,28,24,0.45)' },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: radius.lg + 6,
    borderTopRightRadius: radius.lg + 6,
    padding: space.xl,
    paddingTop: space.md,
    gap: space.md,
  },
  grip: { alignSelf: 'center', width: 40, height: 4, borderRadius: 2, backgroundColor: colors.lineStrong, marginBottom: space.sm },
  rule: { height: StyleSheet.hairlineWidth, backgroundColor: colors.line },
  frame: { borderWidth: 1.5, borderRadius: radius.lg, padding: space.md, gap: space.lg },
});
