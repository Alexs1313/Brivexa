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
import { appFondo } from '../data/assets';

import { useTareas } from '../data/TasksContext';

import { useAdaptativo } from '../hooks/useAdaptativo';
import { pickWorkFoto } from '../utils/pickWorkFoto';

type ActiveWorkScreenProps = {
  taskId: string;
  onBack: () => void;
  onCompletar: () => void;
};

function formatElapsed(totalSegundos: number) {
  const h = Math.floor(totalSegundos / 3600);

  const m = Math.floor((totalSegundos % 3600) / 60);
  const s = totalSegundos % 60;
  return [h, m, s].map(n => String(n).padStart(2, '0')).join(':');
}

export function ActiveWorkScreen({
  taskId,
  onBack,
  onCompletar,
}: ActiveWorkScreenProps) {
  const insets = useSafeAreaInsets();
  const adaptive = useAdaptativo();
  const { getTarea } = useTareas();

  const task = getTarea(taskId);
  const [seconds, setSegundos] = useState(1 * 3600 + 25 * 60 + 45);
  const [paused, setPausado] = useState(false);

  const [materialsNota, setMaterialsNota] = useState<string | null>(null);
  const [photos, setFotos] = useState<string[]>([]);

  const [materialAbierto, setMaterialAbierto] = useState(false);
  const [toast, setAviso] = useState<string | null>(null);

  useEffect(() => {
    if (paused) {
      return;
    }
    const id = setInterval(() => {
      setSegundos(prev => prev + 1);
    }, 1000);
    return () => clearInterval(id);
  }, [paused]);

  if (!task) {
    return (
      <View style={styles.ActiveWorkScreenMissingCasco}>
        <Text style={styles.ActiveWorkScreenMissingFiligrana}>
          Task not found
        </Text>
        <Pressable onPress={onBack}>
          <Text style={styles.ActiveWorkScreenNavLinkFiligrana}>‹ Task</Text>
        </Pressable>
      </View>
    );
  }

  const rows = [
    { label: 'Worker', value: task.worker },
    { label: 'Equipment', value: task.equipment ?? '—' },
    {
      label: 'Materials Used',
      value: materialsNota ?? task.materials ?? '—',
    },
    {
      label: 'Photos',
      value: photos.length > 0 ? `${photos.length} attached` : 'None',
    },
    { label: 'Started', value: '07:32 AM' },
  ];

  const showAviso = (message: string) => {
    setAviso(message);
    setTimeout(() => setAviso(null), 2000);
  };

  const onAddFoto = async () => {
    try {
      const result = await pickWorkFoto();
      if (result.didCancel) {
        return;
      }
      if (result.errorCode) {
        showAviso(
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
      setFotos(prev => [...prev, uri]);
      showAviso('Photo attached');
    } catch {
      showAviso('Could not open photo library');
    }
  };

  return (
    <ImageBackground
      source={appFondo}
      style={styles.ActiveWorkScreenRaizCasco}
      resizeMode="cover"
    >
      <ScrollView
        contentContainerStyle={[
          styles.ActiveWorkScreenScrollContent,
          {
            paddingTop: insets.top + adaptive.verticalEscala(6),
            paddingBottom: insets.bottom + adaptive.verticalEscala(28),
            paddingHorizontal: adaptive.horizontalRelleno,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.ActiveWorkScreenHeaderRowDintel}>
          <Pressable
            onPress={onBack}
            hitSlop={12}
            style={styles.ActiveWorkScreenNavSide}
          >
            <Text style={styles.ActiveWorkScreenNavLinkFiligrana}>‹ Task</Text>
          </Pressable>
          <Text style={styles.ActiveWorkScreenTitleFiligrana}>Active Work</Text>
          <View style={styles.ActiveWorkScreenNavSide} />
        </View>

        <Text style={styles.ActiveWorkScreenFieldLabelFiligrana}>
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
            onPress={() => setMaterialAbierto(true)}
            style={({ pressed }) => [
              styles.ActiveWorkScreenGhostBtn,
              pressed && styles.ActiveWorkScreenPressedDim,
            ]}
          >
            <Text style={styles.ActiveWorkScreenGhostBtnLabel}>+ Material</Text>
          </Pressable>
          <Pressable
            onPress={() => void onAddFoto()}
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
            onPress={() => setPausado(p => !p)}
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
            onPress={onCompletar}
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
            styles.ActiveWorkScreenToastCasco,
            { bottom: insets.bottom + adaptive.verticalEscala(24) },
          ]}
        >
          <Text style={styles.ActiveWorkScreenToastFiligrana}>{toast}</Text>
        </View>
      ) : null}

      <AmountModal
        visible={materialAbierto}
        title="Add Material"
        subtitle={task.title}
        unitEtiqueta="units"
        placeholder="e.g. 5"
        confirmEtiqueta="Add Material"
        onCancel={() => setMaterialAbierto(false)}
        onConfirmar={amount => {
          setMaterialsNota(`${amount} units used`);
          setMaterialAbierto(false);
          showAviso('Material added');
        }}
      />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  ActiveWorkScreenRaizCasco: { backgroundColor: colors.background, flex: 1 },
  ActiveWorkScreenScrollContent: { flexGrow: 1 },

  ActiveWorkScreenMissingCasco: {
    alignItems: 'center',
    backgroundColor: colors.background,
    flex: 1,
    justifyContent: 'center',
  },
  ActiveWorkScreenMissingFiligrana: {
    color: colors.cream,
    fontFamily: fonts.sansBold,
    fontSize: 16,
    marginBottom: 12,
  },

  ActiveWorkScreenHeaderRowDintel: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 18,
  },

  ActiveWorkScreenNavSide: { minWidth: 72 },

  ActiveWorkScreenNavLinkFiligrana: {
    color: colors.gold,
    fontFamily: fonts.sansBold,
    fontSize: 16,
    fontWeight: '700',
  },

  ActiveWorkScreenTitleFiligrana: {
    color: colors.cream,
    flex: 1,
    fontFamily: fonts.sansBold,
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
  },

  ActiveWorkScreenFieldLabelFiligrana: {
    color: colors.bodyApagado,
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
    color: colors.bodyApagado,
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
    borderBottomColor: colors.borderSuave,
    borderBottomWidth: 1,
  },
  ActiveWorkScreenKvLabel: {
    color: colors.bodyApagado,
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
    backgroundColor: colors.successBoton,
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
  ActiveWorkScreenToastCasco: {
    alignSelf: 'center',
    backgroundColor: colors.toastBg,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    position: 'absolute',
  },

  ActiveWorkScreenToastFiligrana: {
    color: colors.cream,
    fontFamily: fonts.sansBold,
    fontSize: 13,
    fontWeight: '700',
  },
});
