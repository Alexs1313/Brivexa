import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { QuickAction, TodayTask, UpcomingWork } from '../../data/today';
import { colors, fonts, radius } from '../../constants/theme';

const TINT: Record<QuickAction['tint'], string> = {
  gold: colors.goldSuave,
  success: colors.successSuave,
  danger: colors.dangerSuave,
  info: colors.infoIconSuave,
};

export function SectionTitle({ title }: { title: string }) {
  return <Text style={styles.TodayBlocksSectionTitleFiligrana}>{title}</Text>;
}

export function StatusChip({ status }: { status: TodayTask['status'] }) {
  if (status === 'in_progress') {
    return (
      <View
        style={[
          styles.TodayBlocksChipPlinto,
          { backgroundColor: colors.infoSuave },
        ]}
      >
        <Text style={[styles.TodayBlocksChipLabel, { color: colors.info }]}>
          In Progress
        </Text>
      </View>
    );
  }
  if (status === 'completed') {
    return (
      <View
        style={[
          styles.TodayBlocksChipPlinto,
          { backgroundColor: colors.successSuave },
        ]}
      >
        <Text style={[styles.TodayBlocksChipLabel, { color: colors.success }]}>
          ✓ Completed
        </Text>
      </View>
    );
  }
  return (
    <View
      style={[
        styles.TodayBlocksChipPlinto,
        { backgroundColor: colors.plannedSuave },
      ]}
    >
      <Text style={[styles.TodayBlocksChipLabel, { color: colors.bodyApagado }]}>
        Planned
      </Text>
    </View>
  );
}

export function TaskCard({ task }: { task: TodayTask }) {
  const completed = task.status === 'completed';

  return (
    <View
      style={[
        styles.TodayBlocksTaskCardCasco,
        completed && styles.TodayBlocksTaskCardCompletedDim,
      ]}
    >
      <View style={styles.TodayBlocksTaskCardAccentRail} />
      <View style={styles.TodayBlocksTaskCardBody}>
        <View style={styles.TodayBlocksTaskCardHeaderRow}>
          <Text style={styles.TodayBlocksTaskCardTitleFiligrana}>
            {task.title}
          </Text>
          <StatusChip status={task.status} />
        </View>
        <Text style={styles.TodayBlocksTaskCardMeta}>
          {task.location} · {task.time}
        </Text>
        {!completed && (task.assignee || task.equipment || task.priority) ? (
          <View style={styles.TodayBlocksTaskCardPillRow}>
            {task.assignee ? (
              <View style={styles.TodayBlocksPillPlinto}>
                <Text style={styles.TodayBlocksPillLabel}>
                  👤 {task.assignee}
                </Text>
              </View>
            ) : null}
            {task.equipment ? (
              <View style={styles.TodayBlocksPillPlinto}>
                <Text style={styles.TodayBlocksPillLabel}>
                  🚜 {task.equipment}
                </Text>
              </View>
            ) : null}
            {task.priority ? (
              <View style={styles.TodayBlocksPillPlinto}>
                <Text style={styles.TodayBlocksPillLabel}>
                  ⚑ {task.priority}
                </Text>
              </View>
            ) : null}
          </View>
        ) : null}
      </View>
    </View>
  );
}

export function UpcomingList({ items }: { items: UpcomingWork[] }) {
  return (
    <View style={styles.TodayBlocksUpcomingCasco}>
      {items.map((item, index) => (
        <View
          key={item.id}
          style={[
            styles.TodayBlocksUpcomingRow,
            index < items.length - 1 && styles.TodayBlocksUpcomingRowDivider,
          ]}
        >
          <View style={styles.TodayBlocksUpcomingDateCol}>
            <Text style={styles.TodayBlocksUpcomingDayFiligrana}>
              {item.day}
            </Text>
            <Text style={styles.TodayBlocksUpcomingMonth}>{item.month}</Text>
          </View>
          <View style={styles.TodayBlocksUpcomingCopy}>
            <Text style={styles.TodayBlocksUpcomingTitleFiligrana}>
              {item.title}
            </Text>
            <Text style={styles.TodayBlocksUpcomingSubtitle}>
              {item.subtitle}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}

export function QuickActionsGrid({
  actions,
  onPress,
}: {
  actions: QuickAction[];
  onPress?: (id: string) => void;
}) {
  return (
    <View style={styles.TodayBlocksQuickGrid}>
      {actions.map(action => (
        <Pressable
          key={action.id}
          onPress={() => onPress?.(action.id)}
          style={({ pressed }) => [
            styles.TodayBlocksQuickCard,
            pressed && styles.TodayBlocksQuickCardPressed,
          ]}
        >
          <View
            style={[
              styles.TodayBlocksQuickIconWell,
              { backgroundColor: TINT[action.tint] },
            ]}
          >
            <Text style={styles.TodayBlocksQuickIcon}>{action.icon}</Text>
          </View>
          <Text style={styles.TodayBlocksQuickLabelFiligrana}>
            {action.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  TodayBlocksSectionTitleFiligrana: {
    color: colors.cream,
    fontFamily: fonts.sansBold,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  TodayBlocksChipPlinto: {
    borderRadius: 20,
    paddingHorizontal: 9,
    paddingVertical: 3,
  },
  TodayBlocksChipLabel: {
    fontFamily: fonts.sansBold,
    fontSize: 10,
    fontWeight: '700',
  },


  TodayBlocksTaskCardCasco: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: radius.card,
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: 14,
    overflow: 'hidden',
  },



  TodayBlocksTaskCardCompletedDim: {
    opacity: 0.75,
  },

  TodayBlocksTaskCardAccentRail: {
    backgroundColor: colors.border,
    width: 3,
  },



  TodayBlocksTaskCardBody: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 15,
  },



  TodayBlocksTaskCardHeaderRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },


  TodayBlocksTaskCardTitleFiligrana: {
    color: colors.cream,
    flexShrink: 1,
    fontFamily: fonts.sansBold,
    fontSize: 15,
    fontWeight: '700',
    marginRight: 8,
  },
  TodayBlocksTaskCardMeta: {
    color: colors.bodyApagado,
    fontFamily: fonts.sansRegular,
    fontSize: 13,
    marginTop: 6,
  },
  TodayBlocksTaskCardPillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },


  TodayBlocksPillPlinto: {
    backgroundColor: colors.pill,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },


  TodayBlocksPillLabel: {
    color: colors.body,
    fontFamily: fonts.sansRegular,
    fontSize: 11,
  },

  TodayBlocksUpcomingCasco: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },



  TodayBlocksUpcomingRow: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },



  TodayBlocksUpcomingRowDivider: {
    borderBottomColor: colors.borderSuave,
    borderBottomWidth: 1,
  },


  TodayBlocksUpcomingDateCol: {
    alignItems: 'center',
    width: 40,
  },

  TodayBlocksUpcomingDayFiligrana: {
    color: colors.gold,
    fontFamily: fonts.sansBold,
    fontSize: 16,
    fontWeight: '700',
  },

  TodayBlocksUpcomingMonth: {
    color: colors.bodyApagado,
    fontFamily: fonts.sansRegular,
    fontSize: 10,
    marginTop: 2,
  },

  TodayBlocksUpcomingCopy: {
    flex: 1,
    marginLeft: 12,
  },


  TodayBlocksUpcomingTitleFiligrana: {
    color: colors.cream,
    fontFamily: fonts.sansBold,
    fontSize: 14,
    fontWeight: '700',
  },

  TodayBlocksUpcomingSubtitle: {
    color: colors.bodyApagado,
    fontFamily: fonts.sansRegular,
    fontSize: 12,
    marginTop: 2,
  },
  TodayBlocksQuickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },

  TodayBlocksQuickCard: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: radius.card,
    borderWidth: 1,
    flexDirection: 'row',
    flexGrow: 1,
    flexBasis: '47%',
    gap: 10,
    height: 66,
    maxWidth: '48%',
    paddingHorizontal: 14,
  },


  TodayBlocksQuickCardPressed: {
    opacity: 0.85,
  },


  TodayBlocksQuickIconWell: {
    alignItems: 'center',
    borderRadius: 10,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },

  TodayBlocksQuickIcon: {
    fontSize: 16,
  },



  TodayBlocksQuickLabelFiligrana: {
    color: colors.cream,
    flexShrink: 1,
    fontFamily: fonts.sansBold,
    fontSize: 14,
    fontWeight: '700',
  },
});
