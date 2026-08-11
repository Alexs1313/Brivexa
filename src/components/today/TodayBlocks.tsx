import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { QuickAction, TodayTask, UpcomingWork } from '../../data/today';
import { colors, fonts, radius } from '../../constants/theme';

const TINT: Record<QuickAction['tint'], string> = {
  gold: colors.goldSoft,
  success: colors.successSoft,
  danger: colors.dangerSoft,
  info: colors.infoIconSoft,
};

export function SectionTitle({ title }: { title: string }) {
  return <Text style={styles.TodayBlocksSectionTitleFlourish}>{title}</Text>;
}

export function StatusChip({ status }: { status: TodayTask['status'] }) {
  if (status === 'in_progress') {
    return (
      <View
        style={[
          styles.TodayBlocksChipPlinth,
          { backgroundColor: colors.infoSoft },
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
          styles.TodayBlocksChipPlinth,
          { backgroundColor: colors.successSoft },
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
        styles.TodayBlocksChipPlinth,
        { backgroundColor: colors.plannedSoft },
      ]}
    >
      <Text style={[styles.TodayBlocksChipLabel, { color: colors.bodyMuted }]}>
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
        styles.TodayBlocksTaskCardHull,
        completed && styles.TodayBlocksTaskCardCompletedDim,
      ]}
    >
      <View style={styles.TodayBlocksTaskCardAccentRail} />
      <View style={styles.TodayBlocksTaskCardBody}>
        <View style={styles.TodayBlocksTaskCardHeaderRow}>
          <Text style={styles.TodayBlocksTaskCardTitleFlourish}>
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
              <View style={styles.TodayBlocksPillPlinth}>
                <Text style={styles.TodayBlocksPillLabel}>
                  👤 {task.assignee}
                </Text>
              </View>
            ) : null}
            {task.equipment ? (
              <View style={styles.TodayBlocksPillPlinth}>
                <Text style={styles.TodayBlocksPillLabel}>
                  🚜 {task.equipment}
                </Text>
              </View>
            ) : null}
            {task.priority ? (
              <View style={styles.TodayBlocksPillPlinth}>
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
    <View style={styles.TodayBlocksUpcomingHull}>
      {items.map((item, index) => (
        <View
          key={item.id}
          style={[
            styles.TodayBlocksUpcomingRow,
            index < items.length - 1 && styles.TodayBlocksUpcomingRowDivider,
          ]}
        >
          <View style={styles.TodayBlocksUpcomingDateCol}>
            <Text style={styles.TodayBlocksUpcomingDayFlourish}>
              {item.day}
            </Text>
            <Text style={styles.TodayBlocksUpcomingMonth}>{item.month}</Text>
          </View>
          <View style={styles.TodayBlocksUpcomingCopy}>
            <Text style={styles.TodayBlocksUpcomingTitleFlourish}>
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
          <Text style={styles.TodayBlocksQuickLabelFlourish}>
            {action.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  TodayBlocksSectionTitleFlourish: {
    color: colors.cream,
    fontFamily: fonts.sansBold,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  TodayBlocksChipPlinth: {
    borderRadius: 20,
    paddingHorizontal: 9,
    paddingVertical: 3,
  },

  TodayBlocksChipLabel: {
    fontFamily: fonts.sansBold,
    fontSize: 10,
    fontWeight: '700',
  },

  TodayBlocksTaskCardHull: {
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
  TodayBlocksTaskCardTitleFlourish: {
    color: colors.cream,
    flexShrink: 1,
    fontFamily: fonts.sansBold,
    fontSize: 15,
    fontWeight: '700',
    marginRight: 8,
  },

  TodayBlocksTaskCardMeta: {
    color: colors.bodyMuted,
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
  TodayBlocksPillPlinth: {
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

  TodayBlocksUpcomingHull: {
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
    borderBottomColor: colors.borderSoft,
    borderBottomWidth: 1,
  },
  TodayBlocksUpcomingDateCol: {
    alignItems: 'center',
    width: 40,
  },

  TodayBlocksUpcomingDayFlourish: {
    color: colors.gold,
    fontFamily: fonts.sansBold,
    fontSize: 16,
    fontWeight: '700',
  },

  TodayBlocksUpcomingMonth: {
    color: colors.bodyMuted,
    fontFamily: fonts.sansRegular,
    fontSize: 10,
    marginTop: 2,
  },
  TodayBlocksUpcomingCopy: {
    flex: 1,
    marginLeft: 12,
  },
  TodayBlocksUpcomingTitleFlourish: {
    color: colors.cream,
    fontFamily: fonts.sansBold,
    fontSize: 14,
    fontWeight: '700',
  },
  TodayBlocksUpcomingSubtitle: {
    color: colors.bodyMuted,
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
  TodayBlocksQuickLabelFlourish: {
    color: colors.cream,
    flexShrink: 1,
    fontFamily: fonts.sansBold,
    fontSize: 14,
    fontWeight: '700',
  },
});
