import React from 'react';
import {
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, fonts, layout, radius } from '../constants/theme';
import { appBackground } from '../data/assets';
import { useTasks } from '../data/TasksContext';

import { useAdaptive } from '../hooks/useAdaptive';

import { StatusChip } from './WorkScreen';

type TaskDetailScreenProps = {
  taskId: string;
  onBack: () => void;
  onStartWork: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export function TaskDetailScreen({
  taskId,
  onBack,
  onStartWork,
  onEdit,
  onDelete,
}: TaskDetailScreenProps) {
  const insets = useSafeAreaInsets();
  const adaptive = useAdaptive();
  const { getTask } = useTasks();
  const task = getTask(taskId);

  if (!task) {
    return (
      <View style={styles.TaskDetailScreenMissingChassis}>
        <Text style={styles.TaskDetailScreenMissingFiligree}>
          Task not found
        </Text>
        <Pressable onPress={onBack}>
          <Text style={styles.TaskDetailScreenNavLinkFiligree}>‹ Work</Text>
        </Pressable>
      </View>
    );
  }

  const rows: Array<{ label: string; value: string }> = [
    { label: 'Date & Time', value: `${task.date} · ${task.time}` },
    { label: 'Assigned Worker', value: task.worker },
    { label: 'Equipment', value: task.equipment ?? '—' },
    { label: 'Estimated Duration', value: task.duration },
    { label: 'Required Materials', value: task.materials ?? '—' },
    { label: 'Estimated Cost', value: task.cost ?? '—' },
  ];

  return (
    <ImageBackground
      source={appBackground}
      style={styles.TaskDetailScreenFacetChassis}
      resizeMode="cover"
    >
      <ScrollView
        contentContainerStyle={[
          styles.TaskDetailScreenScrollContent,
          {
            paddingTop: insets.top + adaptive.verticalScale(6),
            paddingBottom: insets.bottom + adaptive.verticalScale(28),
            paddingHorizontal: adaptive.horizontalPadding,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.TaskDetailScreenHeaderRowLintel}>
          <Pressable
            onPress={onBack}
            hitSlop={12}
            style={styles.TaskDetailScreenNavSide}
          >
            <Text style={styles.TaskDetailScreenNavLinkFiligree}>‹ Work</Text>
          </Pressable>
          <Text style={styles.TaskDetailScreenTitleFiligree}>Task</Text>
          <View style={styles.TaskDetailScreenNavSide} />
        </View>

        <View style={styles.TaskDetailScreenBadgeRow}>
          <StatusChip status={task.status} />
          <View style={styles.TaskDetailScreenPriorityPill}>
            <Text style={styles.TaskDetailScreenPriorityLabel}>
              ⚑ {task.priority}
            </Text>
          </View>
        </View>

        <Text style={styles.TaskDetailScreenHeadlineFiligree}>
          {task.title}
        </Text>
        <Text style={styles.TaskDetailScreenSubtitleFiligree}>
          {task.workType} · {task.field}
        </Text>

        <View style={styles.TaskDetailScreenCard}>
          {rows.map((row, index) => (
            <View
              key={row.label}
              style={[
                styles.TaskDetailScreenKvRow,
                index < rows.length - 1 && styles.TaskDetailScreenKvRowBorder,
              ]}
            >
              <Text style={styles.TaskDetailScreenKvLabel}>{row.label}</Text>
              <Text style={styles.TaskDetailScreenKvValue}>{row.value}</Text>
            </View>
          ))}
        </View>

        {task.notes ? (
          <View style={styles.TaskDetailScreenNotesCard}>
            <Text style={styles.TaskDetailScreenNotesLabel}>Notes</Text>
            <Text style={styles.TaskDetailScreenNotesBody}>{task.notes}</Text>
          </View>
        ) : null}

        <Pressable
          onPress={onStartWork}
          style={({ pressed }) => [
            styles.TaskDetailScreenSuccessBtn,
            pressed && styles.TaskDetailScreenPressedDim,
          ]}
        >
          <Text style={styles.TaskDetailScreenSuccessBtnLabel}>Start Work</Text>
        </Pressable>

        <Pressable
          onPress={onEdit}
          style={({ pressed }) => [
            styles.TaskDetailScreenSecondaryBtn,
            pressed && styles.TaskDetailScreenPressedDim,
          ]}
        >
          <Text style={styles.TaskDetailScreenSecondaryBtnLabel}>
            Edit Task
          </Text>
        </Pressable>

        <Pressable
          onPress={onDelete}
          style={({ pressed }) => [
            styles.TaskDetailScreenDangerBtn,
            pressed && styles.TaskDetailScreenPressedDim,
          ]}
        >
          <Text style={styles.TaskDetailScreenDangerBtnLabel}>Delete Task</Text>
        </Pressable>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  TaskDetailScreenFacetChassis: { backgroundColor: colors.background, flex: 1 },
  TaskDetailScreenScrollContent: { flexGrow: 1 },
  TaskDetailScreenMissingChassis: {
    alignItems: 'center',
    backgroundColor: colors.background,
    flex: 1,
    justifyContent: 'center',
  },

  TaskDetailScreenMissingFiligree: {
    color: colors.cream,
    fontFamily: fonts.sansBold,
    fontSize: 16,
    marginBottom: 12,
  },

  TaskDetailScreenHeaderRowLintel: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 16,
  },

  TaskDetailScreenNavSide: { minWidth: 72 },
  TaskDetailScreenNavLinkFiligree: {
    color: colors.gold,
    fontFamily: fonts.sansBold,
    fontSize: 16,
    fontWeight: '700',
  },
  TaskDetailScreenTitleFiligree: {
    color: colors.cream,
    flex: 1,
    fontFamily: fonts.sansBold,
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
  },

  TaskDetailScreenBadgeRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },

  TaskDetailScreenPriorityPill: {
    backgroundColor: colors.plannedSoft,
    borderRadius: 20,
    paddingHorizontal: 9,
    paddingVertical: 3,
  },
  TaskDetailScreenPriorityLabel: {
    color: colors.bodyMuted,
    fontFamily: fonts.sansBold,
    fontSize: 10,
    fontWeight: '700',
  },

  TaskDetailScreenHeadlineFiligree: {
    color: colors.cream,
    fontFamily: fonts.sansBold,
    fontSize: 28,
    fontWeight: '700',
  },

  TaskDetailScreenSubtitleFiligree: {
    color: colors.bodyMuted,
    fontFamily: fonts.sansRegular,
    fontSize: 14,
    marginBottom: 18,
    marginTop: 4,
  },
  TaskDetailScreenCard: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: radius.card,
    borderWidth: 1,
    marginBottom: 12,
    overflow: 'hidden',
    paddingHorizontal: 16,
  },
  TaskDetailScreenKvRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  TaskDetailScreenKvRowBorder: {
    borderBottomColor: colors.borderSoft,
    borderBottomWidth: 1,
  },

  TaskDetailScreenKvLabel: {
    color: colors.bodyMuted,
    flex: 1,
    fontFamily: fonts.sansRegular,
    fontSize: 13,
    marginRight: 12,
  },

  TaskDetailScreenKvValue: {
    color: colors.cream,
    flexShrink: 1,
    fontFamily: fonts.sansBold,
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'right',
  },
  TaskDetailScreenNotesCard: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: radius.card,
    borderWidth: 1,
    marginBottom: 20,
    padding: 16,
  },

  TaskDetailScreenNotesLabel: {
    color: colors.bodyMuted,
    fontFamily: fonts.sansRegular,
    fontSize: 13,
    marginBottom: 8,
  },
  TaskDetailScreenNotesBody: {
    color: colors.cream,
    fontFamily: fonts.sansRegular,
    fontSize: 14,
    lineHeight: 20,
  },

  TaskDetailScreenSuccessBtn: {
    alignItems: 'center',
    backgroundColor: colors.successButton,
    borderRadius: radius.button,
    height: layout.buttonHeightDefault,
    justifyContent: 'center',
    marginBottom: 10,
  },
  TaskDetailScreenSuccessBtnLabel: {
    color: colors.successButtonText,
    fontFamily: fonts.sansBold,
    fontSize: 15,
    fontWeight: '700',
  },
  TaskDetailScreenSecondaryBtn: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: radius.button,
    borderWidth: 1,
    height: layout.buttonHeightDefault,
    justifyContent: 'center',
    marginBottom: 10,
  },

  TaskDetailScreenSecondaryBtnLabel: {
    color: colors.cream,
    fontFamily: fonts.sansBold,
    fontSize: 15,
    fontWeight: '700',
  },
  TaskDetailScreenDangerBtn: {
    alignItems: 'center',
    backgroundColor: 'rgba(236, 91, 91, 0.12)',
    borderColor: 'rgba(236, 91, 91, 0.45)',
    borderRadius: radius.button,
    borderWidth: 1,
    height: layout.buttonHeightDefault,
    justifyContent: 'center',
  },

  TaskDetailScreenDangerBtnLabel: {
    color: colors.danger,
    fontFamily: fonts.sansBold,
    fontSize: 15,
    fontWeight: '700',
  },

  TaskDetailScreenPressedDim: { opacity: 0.85 },
});
