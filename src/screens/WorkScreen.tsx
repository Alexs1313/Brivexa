import React, { useMemo, useState } from 'react';
import {
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PrimaryButton } from '../components/buttons/PrimaryButton';

import { colors, fonts, radius } from '../constants/theme';
import { appBackground } from '../data/assets';
import {
  CALENDAR_DOTS,
  WORK_FILTERS,
  statusLabel,
  workStats,
  type WorkTask,
  type WorkTaskStatus,
} from '../data/work';
import { useTasks } from '../data/TasksContext';

import { useAdaptive } from '../hooks/useAdaptive';

type WorkScreenProps = {
  onOpenTask: (taskId: string) => void;
  onAddTask: () => void;
};

type WorkMode = 'tasks' | 'calendar';

export function WorkScreen({ onOpenTask, onAddTask }: WorkScreenProps) {
  const insets = useSafeAreaInsets();
  const adaptive = useAdaptive();
  const { tasks: storedTasks } = useTasks();
  const [mode, setMode] = useState<WorkMode>('tasks');
  const [demoEmpty, setDemoEmpty] = useState(false);
  const [filter, setFilter] = useState<(typeof WORK_FILTERS)[number]>('All');
  const [selectedDay, setSelectedDay] = useState(22);

  const tasks = demoEmpty ? [] : storedTasks;
  const stats = workStats(tasks);

  const filtered = useMemo(() => {
    if (filter === 'Today') {
      return tasks.filter(t => t.dateKey === '2026-07-22');
    }
    if (filter === 'Upcoming') {
      return tasks.filter(t => t.status === 'planned');
    }
    if (filter === 'Overdue') {
      return tasks.filter(t => t.status === 'overdue');
    }
    return tasks;
  }, [filter, tasks]);

  const dayTasks = useMemo(
    () =>
      tasks.filter(
        t => t.dateKey === `2026-07-${String(selectedDay).padStart(2, '0')}`,
      ),
    [selectedDay, tasks],
  );

  const emptyTasks = filtered.length === 0;

  return (
    <ImageBackground
      source={appBackground}
      style={styles.WorkScreenFacetChassis}
      resizeMode="cover"
    >
      <ScrollView
        contentContainerStyle={[
          styles.WorkScreenScrollContent,
          {
            paddingTop: insets.top + adaptive.verticalScale(8),
            paddingBottom: adaptive.verticalScale(110),
            paddingHorizontal: adaptive.horizontalPadding,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.WorkScreenHeaderRowLintel}>
          <Pressable onPress={() => setDemoEmpty(v => !v)} hitSlop={8}>
            <Text style={styles.WorkScreenTitleFiligree}>Work</Text>
          </Pressable>
          <Pressable onPress={onAddTask} hitSlop={8}>
            <LinearGradient
              colors={[colors.buttonGradientStart, colors.buttonGradientEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.WorkScreenAddOrb}
            >
              <Text style={styles.WorkScreenAddGlyph}>+</Text>
            </LinearGradient>
          </Pressable>
        </View>

        <View style={styles.WorkScreenSegChassis}>
          <Pressable
            onPress={() => setMode('tasks')}
            style={[
              styles.WorkScreenSegItem,
              mode === 'tasks' && styles.WorkScreenSegItemOn,
            ]}
          >
            {mode === 'tasks' ? (
              <LinearGradient
                colors={[colors.buttonGradientStart, colors.buttonGradientEnd]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.WorkScreenSegGradient}
              >
                <Text style={styles.WorkScreenSegLabelOn}>Tasks</Text>
              </LinearGradient>
            ) : (
              <Text style={styles.WorkScreenSegLabel}>Tasks</Text>
            )}
          </Pressable>
          <Pressable
            onPress={() => setMode('calendar')}
            style={[
              styles.WorkScreenSegItem,
              mode === 'calendar' && styles.WorkScreenSegItemOn,
            ]}
          >
            {mode === 'calendar' ? (
              <LinearGradient
                colors={[colors.buttonGradientStart, colors.buttonGradientEnd]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.WorkScreenSegGradient}
              >
                <Text style={styles.WorkScreenSegLabelOn}>Calendar</Text>
              </LinearGradient>
            ) : (
              <Text style={styles.WorkScreenSegLabel}>Calendar</Text>
            )}
          </Pressable>
        </View>

        {mode === 'tasks' ? (
          <>
            <View style={styles.WorkScreenStatsRow}>
              <StatCard value={stats.planned} label="Planned" tone="muted" />
              <StatCard value={stats.active} label="Active" tone="info" />
              <StatCard value={stats.done} label="Done" tone="success" />
              <StatCard value={stats.overdue} label="Overdue" tone="danger" />
            </View>

            <View style={styles.WorkScreenFilterRow}>
              {WORK_FILTERS.map(item => {
                const active = item === filter;
                return (
                  <Pressable
                    key={item}
                    onPress={() => setFilter(item)}
                    style={[
                      styles.WorkScreenFilterChip,
                      active
                        ? styles.WorkScreenFilterChipActive
                        : styles.WorkScreenFilterChipIdle,
                    ]}
                  >
                    <Text
                      style={[
                        styles.WorkScreenFilterChipLabel,
                        active && styles.WorkScreenFilterChipLabelActive,
                      ]}
                    >
                      {item}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {emptyTasks ? (
              <View style={styles.WorkScreenEmptyCard}>
                <Text style={styles.WorkScreenEmptySigil}>✅</Text>
                <Text style={styles.WorkScreenEmptyTitle}>No tasks yet</Text>
                <Text style={styles.WorkScreenEmptyHintFiligree}>
                  Plan your first job to get started.
                </Text>
                <PrimaryButton
                  label="+ Add Task"
                  onPress={onAddTask}
                  style={styles.WorkScreenEmptyBtn}
                />
              </View>
            ) : (
              filtered.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onPress={() => onOpenTask(task.id)}
                />
              ))
            )}
          </>
        ) : (
          <CalendarPanel
            selectedDay={selectedDay}
            onSelectDay={setSelectedDay}
            dayTasks={dayTasks}
            onOpenTask={onOpenTask}
            onAddTask={onAddTask}
          />
        )}
      </ScrollView>
    </ImageBackground>
  );
}

function StatCard({
  value,
  label,
  tone,
}: {
  value: number;
  label: string;
  tone: 'muted' | 'info' | 'success' | 'danger';
}) {
  const color =
    tone === 'info'
      ? colors.info
      : tone === 'success'
      ? colors.success
      : tone === 'danger'
      ? colors.danger
      : colors.bodyMuted;

  return (
    <View style={styles.WorkScreenStatCard}>
      <Text style={[styles.WorkScreenStatValue, { color }]}>{value}</Text>
      <Text style={styles.WorkScreenStatLabel}>{label}</Text>
    </View>
  );
}

function TaskCard({ task, onPress }: { task: WorkTask; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.WorkScreenTaskCard,
        pressed && styles.WorkScreenPressedDim,
      ]}
    >
      <View style={styles.WorkScreenTaskAccent} />
      <View style={styles.WorkScreenTaskBody}>
        <View style={styles.WorkScreenTaskHeader}>
          <View style={styles.WorkScreenTaskTitleCol}>
            <Text style={styles.WorkScreenTaskTitle}>{task.title}</Text>
            <Text style={styles.WorkScreenTaskType}>{task.workType}</Text>
          </View>
          <StatusChip status={task.status} />
        </View>
        <Text style={styles.WorkScreenTaskMeta}>
          {task.field} · {task.date} · {task.time}
        </Text>
        <View style={styles.WorkScreenPillRow}>
          <View style={styles.WorkScreenMetaPill}>
            <Text style={styles.WorkScreenMetaPillText}>👤 {task.worker}</Text>
          </View>
          <View style={styles.WorkScreenMetaPill}>
            <Text style={styles.WorkScreenMetaPillText}>⏱ {task.duration}</Text>
          </View>
          <View style={styles.WorkScreenMetaPill}>
            <Text
              style={[
                styles.WorkScreenMetaPillText,
                task.priority === 'High' && { color: colors.priorityHigh },
              ]}
            >
              ⚑ {task.priority}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

export function StatusChip({ status }: { status: WorkTaskStatus }) {
  const label = statusLabel(status);
  const tone =
    status === 'in_progress'
      ? 'info'
      : status === 'overdue'
      ? 'danger'
      : status === 'done'
      ? 'success'
      : 'muted';

  return (
    <View
      style={[
        styles.WorkScreenStatusChip,
        tone === 'info' && { backgroundColor: colors.infoSoft },
        tone === 'danger' && { backgroundColor: colors.dangerSoft },
        tone === 'success' && { backgroundColor: colors.successSoft },
        tone === 'muted' && { backgroundColor: colors.plannedSoft },
      ]}
    >
      <Text
        style={[
          styles.WorkScreenStatusChipLabel,
          tone === 'info' && { color: colors.info },
          tone === 'danger' && { color: colors.danger },
          tone === 'success' && { color: colors.success },
          tone === 'muted' && { color: colors.bodyMuted },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

function CalendarPanel({
  selectedDay,
  onSelectDay,
  dayTasks,
  onOpenTask,
  onAddTask,
}: {
  selectedDay: number;
  onSelectDay: (day: number) => void;
  dayTasks: WorkTask[];
  onOpenTask: (id: string) => void;
  onAddTask: () => void;
}) {
  // July 2026 starts on Wednesday
  const startOffset = 3;
  const daysInMonth = 31;
  const cells: Array<number | null> = [];
  for (let i = 0; i < startOffset; i += 1) {
    cells.push(null);
  }
  for (let d = 1; d <= daysInMonth; d += 1) {
    cells.push(d);
  }

  return (
    <View>
      <View style={styles.WorkScreenCalendarCard}>
        <View style={styles.WorkScreenCalendarHeader}>
          <Text style={styles.WorkScreenCalendarArrow}>‹</Text>
          <Text style={styles.WorkScreenCalendarMonth}>July 2026</Text>
          <Text style={styles.WorkScreenCalendarArrow}>›</Text>
        </View>
        <View style={styles.WorkScreenWeekRow}>
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
            <Text key={`${d}-${i}`} style={styles.WorkScreenWeekday}>
              {d}
            </Text>
          ))}
        </View>
        <View style={styles.WorkScreenDaysGrid}>
          {cells.map((day, index) => {
            if (day == null) {
              return (
                <View key={`e-${index}`} style={styles.WorkScreenDayCell} />
              );
            }
            const selected = day === selectedDay;
            const dot = CALENDAR_DOTS[day];
            return (
              <Pressable
                key={day}
                onPress={() => onSelectDay(day)}
                style={styles.WorkScreenDayCell}
              >
                <View
                  style={[
                    styles.WorkScreenDayBubble,
                    selected && styles.WorkScreenDayBubbleOn,
                  ]}
                >
                  <Text
                    style={[
                      styles.WorkScreenDayNum,
                      selected && styles.WorkScreenDayNumOn,
                      !selected &&
                        dot === 'overdue' && { color: colors.danger },
                    ]}
                  >
                    {day}
                  </Text>
                </View>
                {dot ? (
                  <View
                    style={[
                      styles.WorkScreenDayDot,
                      dot === 'overdue' && { backgroundColor: colors.danger },
                      dot === 'gold' && { backgroundColor: colors.gold },
                      dot === 'info' && { backgroundColor: colors.info },
                    ]}
                  />
                ) : (
                  <View style={styles.WorkScreenDayDotSpacer} />
                )}
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.WorkScreenDayHeader}>
        <Text style={styles.WorkScreenDayTitle}>July {selectedDay}</Text>
        <Text style={styles.WorkScreenDayCount}>
          {dayTasks.length} task{dayTasks.length === 1 ? '' : 's'}
        </Text>
      </View>

      {dayTasks.length === 0 ? (
        <View style={styles.WorkScreenEmptyCard}>
          <Text style={styles.WorkScreenEmptySigil}>🗓️</Text>
          <Text style={styles.WorkScreenEmptyTitle}>No tasks on this day</Text>
          <Text style={styles.WorkScreenEmptyHintFiligree}>
            Tap + to schedule work for July {selectedDay}.
          </Text>
          <PrimaryButton
            label="+ Add Task"
            onPress={onAddTask}
            style={styles.WorkScreenEmptyBtn}
          />
        </View>
      ) : (
        dayTasks.map(task => (
          <Pressable
            key={task.id}
            onPress={() => onOpenTask(task.id)}
            style={styles.WorkScreenAgendaCard}
          >
            <View>
              <Text style={styles.WorkScreenAgendaTime}>{task.time}</Text>
              <Text style={styles.WorkScreenAgendaTitle}>{task.title}</Text>
              <Text style={styles.WorkScreenAgendaField}>{task.field}</Text>
            </View>
            <StatusChip status={task.status} />
          </Pressable>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  WorkScreenFacetChassis: { backgroundColor: colors.background, flex: 1 },
  WorkScreenScrollContent: { flexGrow: 1 },

  WorkScreenHeaderRowLintel: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },

  WorkScreenTitleFiligree: {
    color: colors.cream,
    fontFamily: fonts.sansBold,
    fontSize: 24,
    fontWeight: '700',
  },

  WorkScreenAddOrb: {
    alignItems: 'center',
    borderRadius: 12,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },

  WorkScreenAddGlyph: {
    color: colors.buttonText,
    fontFamily: fonts.sansBold,
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 24,
  },
  WorkScreenSegChassis: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 13,
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: 14,
    padding: 4,
  },
  WorkScreenSegItem: {
    borderRadius: 9,
    flex: 1,
    height: 36,
    overflow: 'hidden',
  },
  WorkScreenSegItemOn: {},
  WorkScreenSegGradient: {
    alignItems: 'center',
    borderRadius: 9,
    flex: 1,
    justifyContent: 'center',
  },

  WorkScreenSegLabel: {
    color: colors.bodyMuted,
    fontFamily: fonts.sansBold,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 36,
    textAlign: 'center',
  },

  WorkScreenSegLabelOn: {
    color: colors.buttonText,
    fontFamily: fonts.sansBold,
    fontSize: 13,
    fontWeight: '700',
  },
  WorkScreenStatsRow: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  WorkScreenStatCard: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: 1,
    flex: 1,
    height: 62,
    justifyContent: 'center',
  },
  WorkScreenStatValue: {
    fontFamily: fonts.sansBold,
    fontSize: 21,
    fontWeight: '700',
  },

  WorkScreenStatLabel: {
    color: colors.bodyMuted,
    fontFamily: fonts.sansRegular,
    fontSize: 10,
    marginTop: 2,
  },

  WorkScreenFilterRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },

  WorkScreenFilterChip: {
    alignSelf: 'flex-start',
    borderRadius: 20,
    height: 20,
    justifyContent: 'center',
    paddingHorizontal: 9,
  },

  WorkScreenFilterChipActive: { backgroundColor: 'rgba(245, 182, 66, 0.16)' },
  WorkScreenFilterChipIdle: { backgroundColor: 'rgba(139, 148, 173, 0.16)' },
  WorkScreenFilterChipLabel: {
    color: colors.bodyMuted,
    fontFamily: fonts.sansBold,
    fontSize: 10,
    fontWeight: '700',
  },
  WorkScreenFilterChipLabelActive: { color: colors.gold },
  WorkScreenTaskCard: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: radius.card,
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: 12,
    overflow: 'hidden',
  },

  WorkScreenPressedDim: { opacity: 0.9 },

  WorkScreenTaskAccent: { backgroundColor: colors.border, width: 3 },
  WorkScreenTaskBody: { flex: 1, paddingHorizontal: 15, paddingVertical: 15 },
  WorkScreenTaskHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  WorkScreenTaskTitleCol: { flex: 1, marginRight: 8 },

  WorkScreenTaskTitle: {
    color: colors.cream,
    fontFamily: fonts.sansBold,
    fontSize: 15,
    fontWeight: '700',
  },
  WorkScreenTaskType: {
    color: colors.bodyMuted,
    fontFamily: fonts.sansRegular,
    fontSize: 11,
    marginTop: 2,
  },
  WorkScreenTaskMeta: {
    color: colors.bodyMuted,
    fontFamily: fonts.sansRegular,
    fontSize: 13,
    marginTop: 8,
  },

  WorkScreenPillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },

  WorkScreenMetaPill: {
    backgroundColor: colors.pill,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  WorkScreenMetaPillText: {
    color: colors.body,
    fontFamily: fonts.sansRegular,
    fontSize: 11,
  },

  WorkScreenStatusChip: {
    alignSelf: 'flex-start',
    borderRadius: 20,
    paddingHorizontal: 9,
    paddingVertical: 3,
  },
  WorkScreenStatusChipLabel: {
    fontFamily: fonts.sansBold,
    fontSize: 10,
    fontWeight: '700',
  },

  WorkScreenEmptyCard: {
    alignItems: 'center',
    backgroundColor: colors.emptyFill,
    borderColor: colors.emptyBorder,
    borderRadius: radius.card,
    borderStyle: 'dashed',
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 28,
  },

  WorkScreenEmptySigil: { fontSize: 34 },
  WorkScreenEmptyTitle: {
    color: colors.cream,
    fontFamily: fonts.sansBold,
    fontSize: 16,
    fontWeight: '700',
    marginTop: 10,
  },

  WorkScreenEmptyHintFiligree: {
    color: colors.bodyMuted,
    fontFamily: fonts.sansRegular,
    fontSize: 13,
    marginBottom: 14,
    marginTop: 6,
    textAlign: 'center',
  },

  WorkScreenEmptyBtn: { minWidth: 140 },
  WorkScreenCalendarCard: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
    padding: 14,
  },

  WorkScreenCalendarHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  WorkScreenCalendarArrow: {
    color: colors.cream,
    fontSize: 18,
    paddingHorizontal: 8,
  },
  WorkScreenCalendarMonth: {
    color: colors.cream,
    fontFamily: fonts.sansBold,
    fontSize: 15,
    fontWeight: '700',
  },
  WorkScreenWeekRow: { flexDirection: 'row', marginBottom: 6 },
  WorkScreenWeekday: {
    color: colors.bodyMuted,
    flex: 1,
    fontFamily: fonts.sansRegular,
    fontSize: 11,
    textAlign: 'center',
  },

  WorkScreenDaysGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  WorkScreenDayCell: {
    alignItems: 'center',
    height: 44,
    width: '14.2857%',
  },

  WorkScreenDayBubble: {
    alignItems: 'center',
    borderRadius: 10,
    height: 30,
    justifyContent: 'center',
    width: 30,
  },
  WorkScreenDayBubbleOn: { backgroundColor: colors.gold },
  WorkScreenDayNum: {
    color: colors.cream,
    fontFamily: fonts.sansBold,
    fontSize: 13,
    fontWeight: '700',
  },

  WorkScreenDayNumOn: { color: colors.buttonText },
  WorkScreenDayDot: {
    borderRadius: 3,
    height: 5,
    marginTop: 2,
    width: 5,
  },

  WorkScreenDayDotSpacer: { height: 7 },
  WorkScreenDayHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  WorkScreenDayTitle: {
    color: colors.cream,
    fontFamily: fonts.sansBold,
    fontSize: 16,
    fontWeight: '700',
  },

  WorkScreenDayCount: {
    color: colors.bodyMuted,
    fontFamily: fonts.sansRegular,
    fontSize: 13,
  },

  WorkScreenAgendaCard: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: radius.card,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    padding: 14,
  },

  WorkScreenAgendaTime: {
    color: colors.gold,
    fontFamily: fonts.sansBold,
    fontSize: 13,
    fontWeight: '700',
  },

  WorkScreenAgendaTitle: {
    color: colors.cream,
    fontFamily: fonts.sansBold,
    fontSize: 15,
    fontWeight: '700',
    marginTop: 2,
  },

  WorkScreenAgendaField: {
    color: colors.bodyMuted,
    fontFamily: fonts.sansRegular,
    fontSize: 12,
    marginTop: 2,
  },
});
