import React, { useEffect, useState } from 'react';

import {
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AmountModal } from '../components/AmountModal';

import { colors, fonts, layout, radius } from '../constants/theme';
import { appBackground } from '../data/assets';

import { useTasks } from '../data/TasksContext';

import { useAdaptive } from '../hooks/useAdaptive';
import { pickWorkPhoto } from '../utils/pickWorkPhoto';

type ActiveWorkScreenProps = {
  taskId: string;
  onBack: () => void;
  onComplete: () => void;
};

function formatElapsed(totalSeconds: number) {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return [h, m, s].map(n => String(n).padStart(2, '0')).join(':');
}

export function ActiveWorkScreen({
  taskId,
  onBack,
  onComplete,
}: ActiveWorkScreenProps) {
  const insets = useSafeAreaInsets();
  const adaptive = useAdaptive();
  const { getTask } = useTasks();
  const task = getTask(taskId);
  const [seconds, setSeconds] = useState(1 * 3600 + 25 * 60 + 45);
  const [paused, setPaused] = useState(false);
  const [materialsNote, setMaterialsNote] = useState<string | null>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [materialOpen, setMaterialOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (paused) {
      return;
    }
    const id = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(id);
  }, [paused]);

  if (!task) {
    return (
      <View style={styles.ActiveWorkScreenMissingHull}>
        <Text style={styles.ActiveWorkScreenMissingFlourish}>
          Task not found
        </Text>
        <Pressable onPress={onBack}>
          <Text style={styles.ActiveWorkScreenNavLinkFlourish}>‹ Task</Text>
        </Pressable>
      </View>
    );
  }

  const rows = [
    { label: 'Worker', value: task.worker },
    { label: 'Equipment', value: task.equipment ?? '—' },
    {
      label: 'Materials Used',
      value: materialsNote ?? task.materials ?? '—',
    },
    {
      label: 'Photos',
      value: photos.length > 0 ? `${photos.length} attached` : 'None',
    },
    { label: 'Started', value: '07:32 AM' },
  ];

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 2000);
  };

  const onAddPhoto = async () => {
    try {
      const result = await pickWorkPhoto();
      if (result.didCancel) {
        return;
      }
      if (result.errorCode) {
        showToast(
          result.errorMessage ??
            (result.errorCode === 'permission'
              ? 'Photo permission denied'
              : 'Could not add photo'),
        );
        return;
      }
      const uri = result.assets?.[0]?.uri;
      if (!uri) {
        return;
      }
      setPhotos(prev => [...prev, uri]);
      showToast('Photo attached');
    } catch {
      showToast('Could not open photo library');
    }
  };

  return (
    <ImageBackground
      source={appBackground}
      style={styles.ActiveWorkScreenRootHull}
      resizeMode="cover"
    >
      <ScrollView
        contentContainerStyle={[
          styles.ActiveWorkScreenScrollContent,
          {
            paddingTop: insets.top + adaptive.verticalScale(6),
            paddingBottom: insets.bottom + adaptive.verticalScale(28),
            paddingHorizontal: adaptive.horizontalPadding,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.ActiveWorkScreenHeaderRowCapstone}>
          <Pressable
            onPress={onBack}
            hitSlop={12}
            style={styles.ActiveWorkScreenNavSide}
          >
            <Text style={styles.ActiveWorkScreenNavLinkFlourish}>‹ Task</Text>
          </Pressable>
          <Text style={styles.ActiveWorkScreenTitleFlourish}>Active Work</Text>
          <View style={styles.ActiveWorkScreenNavSide} />
        </View>

        <Text style={styles.ActiveWorkScreenFieldLabelFlourish}>
          {task.field}
        </Text>
        <Text style={styles.ActiveWorkScreenTaskTitle}>{task.title}</Text>

        <View style={styles.ActiveWorkScreenTimerCard}>
          <Text style={styles.ActiveWorkScreenTimerStatus}>IN PROGRESS</Text>
          <Text style={styles.ActiveWorkScreenTimerValue}>
            {formatElapsed(seconds)}
          </Text>
          <Text style={styles.ActiveWorkScreenTimerHint}>
            {paused ? 'paused' : 'running'}
          </Text>
        </View>

        <View style={styles.ActiveWorkScreenDetailsCard}>
          {rows.map((row, index) => (
            <View
              key={row.label}
              style={[
                styles.ActiveWorkScreenKvRow,
                index < rows.length - 1 && styles.ActiveWorkScreenKvRowBorder,
              ]}
            >
              <Text style={styles.ActiveWorkScreenKvLabel}>{row.label}</Text>
              <Text style={styles.ActiveWorkScreenKvValue}>{row.value}</Text>
            </View>
          ))}
        </View>

        <View style={styles.ActiveWorkScreenActionRow}>
          <Pressable
            onPress={() => setMaterialOpen(true)}
            style={({ pressed }) => [
              styles.ActiveWorkScreenGhostBtn,
              pressed && styles.ActiveWorkScreenPressedDim,
            ]}
          >
            <Text style={styles.ActiveWorkScreenGhostBtnLabel}>+ Material</Text>
          </Pressable>
          <Pressable
            onPress={() => void onAddPhoto()}
            style={({ pressed }) => [
              styles.ActiveWorkScreenGhostBtn,
              pressed && styles.ActiveWorkScreenPressedDim,
            ]}
          >
            <Text style={styles.ActiveWorkScreenGhostBtnLabel}>📷 Photo</Text>
          </Pressable>
        </View>

        {photos.length > 0 ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.ActiveWorkScreenPhotoStrip}
          >
            {photos.map((uri, index) => (
              <Image
                key={`${uri}-${index}`}
                source={{ uri }}
                style={styles.ActiveWorkScreenPhotoThumb}
              />
            ))}
          </ScrollView>
        ) : null}

        <View style={styles.ActiveWorkScreenFooterRow}>
          <Pressable
            onPress={() => setPaused(p => !p)}
            style={({ pressed }) => [
              styles.ActiveWorkScreenPauseBtn,
              pressed && styles.ActiveWorkScreenPressedDim,
            ]}
          >
            <Text style={styles.ActiveWorkScreenPauseBtnLabel}>
              {paused ? 'Resume' : 'Pause'}
            </Text>
          </Pressable>
          <Pressable
            onPress={onComplete}
            style={({ pressed }) => [
              styles.ActiveWorkScreenCompleteBtn,
              pressed && styles.ActiveWorkScreenPressedDim,
            ]}
          >
            <Text style={styles.ActiveWorkScreenCompleteBtnLabel}>
              Complete Work
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      {toast ? (
        <View
          style={[
            styles.ActiveWorkScreenToastHull,
            { bottom: insets.bottom + adaptive.verticalScale(24) },
          ]}
        >
          <Text style={styles.ActiveWorkScreenToastFlourish}>{toast}</Text>
        </View>
      ) : null}

      <AmountModal
        visible={materialOpen}
        title="Add Material"
        subtitle={task.title}
        unitLabel="units"
        placeholder="e.g. 5"
        confirmLabel="Add Material"
        onCancel={() => setMaterialOpen(false)}
        onConfirm={amount => {
          setMaterialsNote(`${amount} units used`);
          setMaterialOpen(false);
          showToast('Material added');
        }}
      />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  ActiveWorkScreenRootHull: { backgroundColor: colors.background, flex: 1 },
  ActiveWorkScreenScrollContent: { flexGrow: 1 },

  ActiveWorkScreenMissingHull: {
    alignItems: 'center',
    backgroundColor: colors.background,
    flex: 1,
    justifyContent: 'center',
  },
  ActiveWorkScreenMissingFlourish: {
    color: colors.cream,
    fontFamily: fonts.sansBold,
    fontSize: 16,
    marginBottom: 12,
  },

  ActiveWorkScreenHeaderRowCapstone: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 18,
  },

  ActiveWorkScreenNavSide: { minWidth: 72 },

  ActiveWorkScreenNavLinkFlourish: {
    color: colors.gold,
    fontFamily: fonts.sansBold,
    fontSize: 16,
    fontWeight: '700',
  },

  ActiveWorkScreenTitleFlourish: {
    color: colors.cream,
    flex: 1,
    fontFamily: fonts.sansBold,
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
  },

  ActiveWorkScreenFieldLabelFlourish: {
    color: colors.bodyMuted,
    fontFamily: fonts.sansRegular,
    fontSize: 13,
  },

  ActiveWorkScreenTaskTitle: {
    color: colors.cream,
    fontFamily: fonts.sansBold,
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 18,
    marginTop: 4,
  },

  ActiveWorkScreenTimerCard: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 18,
    paddingVertical: 28,
  },

  ActiveWorkScreenTimerStatus: {
    color: colors.gold,
    fontFamily: fonts.sansBold,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  ActiveWorkScreenTimerValue: {
    color: colors.cream,
    fontFamily: fonts.sansBold,
    fontSize: 42,
    fontWeight: '700',
    marginTop: 8,
  },

  ActiveWorkScreenTimerHint: {
    color: colors.bodyMuted,
    fontFamily: fonts.sansRegular,
    fontSize: 13,
    marginTop: 6,
  },

  ActiveWorkScreenDetailsCard: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: radius.card,
    borderWidth: 1,
    marginBottom: 14,
    overflow: 'hidden',
    paddingHorizontal: 16,
  },
  ActiveWorkScreenKvRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  ActiveWorkScreenKvRowBorder: {
    borderBottomColor: colors.borderSoft,
    borderBottomWidth: 1,
  },
  ActiveWorkScreenKvLabel: {
    color: colors.bodyMuted,
    fontFamily: fonts.sansRegular,
    fontSize: 13,
  },

  ActiveWorkScreenKvValue: {
    color: colors.cream,
    fontFamily: fonts.sansBold,
    fontSize: 13,
    fontWeight: '700',
  },

  ActiveWorkScreenActionRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 18,
  },
  ActiveWorkScreenGhostBtn: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderColor: colors.info,
    borderRadius: radius.button,
    borderWidth: 1,
    flex: 1,
    height: layout.buttonHeightCompact,
    justifyContent: 'center',
  },

  ActiveWorkScreenGhostBtnLabel: {
    color: colors.infoBannerText,
    fontFamily: fonts.sansBold,
    fontSize: 14,
    fontWeight: '700',
  },
  ActiveWorkScreenPhotoStrip: {
    gap: 10,
    marginBottom: 18,
  },
  ActiveWorkScreenPhotoThumb: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    height: 72,
    width: 72,
  },

  ActiveWorkScreenFooterRow: { flexDirection: 'row', gap: 10 },
  ActiveWorkScreenPauseBtn: {
    alignItems: 'center',
    backgroundColor: 'rgba(245, 182, 66, 0.12)',
    borderColor: 'rgba(245, 182, 66, 0.35)',
    borderRadius: radius.button,
    borderWidth: 1,
    height: layout.buttonHeightDefault,
    justifyContent: 'center',
    paddingHorizontal: 22,
  },

  ActiveWorkScreenPauseBtnLabel: {
    color: colors.gold,
    fontFamily: fonts.sansBold,
    fontSize: 15,
    fontWeight: '700',
  },
  ActiveWorkScreenCompleteBtn: {
    alignItems: 'center',
    backgroundColor: colors.successButton,
    borderRadius: radius.button,
    flex: 1,
    height: layout.buttonHeightDefault,
    justifyContent: 'center',
  },

  ActiveWorkScreenCompleteBtnLabel: {
    color: colors.successButtonText,
    fontFamily: fonts.sansBold,
    fontSize: 15,
    fontWeight: '700',
  },

  ActiveWorkScreenPressedDim: { opacity: 0.85 },
  ActiveWorkScreenToastHull: {
    alignSelf: 'center',
    backgroundColor: colors.toastBg,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    position: 'absolute',
  },

  ActiveWorkScreenToastFlourish: {
    color: colors.cream,
    fontFamily: fonts.sansBold,
    fontSize: 13,
    fontWeight: '700',
  },
});
