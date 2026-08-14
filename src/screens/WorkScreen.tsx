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
import { appFondo } from '../data/assets';
import {
  APP_TODAY_KEY,
  dateKeyFor,
  daysInMes,
  formatMonthDia,
  formatMonthAnio,
  monthStartDesfase,
} from '../data/dates';
import {
  calendarDotsForMes,
  WORK_FILTROS,
  statusEtiqueta,
  workEstadisticas,
  type WorkTask,
  type WorkTaskStatus,
} from '../data/work';
import { useTareas } from '../data/TasksContext';

import { useAdaptativo } from '../hooks/useAdaptativo';

type WorkScreenProps = {
  onOpenTarea: (taskId: string) => void;
  onAddTarea: () => void;
};

type WorkMode = 'tasks' | 'calendar';

export function WorkScreen({ onOpenTarea, onAddTarea }: WorkScreenProps) {
  const insets = useSafeAreaInsets();
  const adaptive = useAdaptativo();
  const { tasks: storedTareas } = useTareas();
  const [mode, setModo] = useState<WorkMode>('tasks');
  const [demoVacio, setDemoVacio] = useState(false);
  const [filter, setFiltro] = useState<(typeof WORK_FILTROS)[number]>('All');

  const today = useMemo(() => {
    const now = new Date();
    return {
      year: now.getFullYear(),
      month: now.getMonth(),
      day: now.getDate(),
    };
  }, []);

  const [viewAnio, setViewAnio] = useState(today.year);
  const [viewMes, setViewMes] = useState(today.month);
  const [selectedDia, setSelectedDia] = useState(today.day);

  const tasks = demoVacio ? [] : storedTareas;
  const stats = workEstadisticas(tasks);

  const filtered = useMemo(() => {
    if (filter === 'Today') {
      return tasks.filter(t => t.dateClave === APP_TODAY_KEY);
    }
    if (filter === 'Upcoming') {
      return tasks.filter(
        t => t.dateClave > APP_TODAY_KEY && t.status !== 'done',
      );
    }
    if (filter === 'Overdue') {
      return tasks.filter(t => t.status === 'overdue');
    }
    return tasks;
  }, [filter, tasks]);

  const selectedDateClave = dateKeyFor(viewAnio, viewMes, selectedDia);

  const dayTareas = useMemo(
    () => tasks.filter(t => t.dateClave === selectedDateClave),
    [selectedDateClave, tasks],
  );

  const calendarPuntos = useMemo(
    () => calendarDotsForMes(tasks, viewAnio, viewMes),
    [tasks, viewMes, viewAnio],
  );

  const shiftMes = (delta: number) => {
    const next = new Date(viewAnio, viewMes + delta, 1);
    const nextAnio = next.getFullYear();
    const nextMes = next.getMonth();
    const maxDia = daysInMes(nextAnio, nextMes);
    setViewAnio(nextAnio);
    setViewMes(nextMes);
    setSelectedDia(day => Math.min(day, maxDia));
  };

  const emptyTareas = filtered.length === 0;

  return (
    <ImageBackground
      source={appFondo}
      style={styles.WorkScreenRaizCasco}
      resizeMode="cover"
    >
      <ScrollView
        contentContainerStyle={[
          styles.WorkScreenScrollContent,
          {
            paddingTop: insets.top + adaptive.verticalEscala(8),
            paddingBottom: adaptive.verticalEscala(110),
            paddingHorizontal: adaptive.horizontalRelleno,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.WorkScreenHeaderRowDintel}>
          <Pressable onPress={() => setDemoVacio(v => !v)} hitSlop={8}>
            <Text style={styles.WorkScreenTitleFiligrana}>Work</Text>
          </Pressable>
          <Pressable onPress={onAddTarea} hitSlop={8}>
            <LinearGradient
              colors={[colors.buttonGradientStart, colors.buttonGradientEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.WorkScreenAddOrbe}
            >
              <Text style={styles.WorkScreenAddMarca}>+</Text>
            </LinearGradient>
          </Pressable>
        </View>

        <View style={styles.WorkScreenSegCasco}>
          <Pressable
            onPress={() => setModo('tasks')}
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
            onPress={() => setModo('calendar')}
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
              {WORK_FILTROS.map(item => {
                const active = item === filter;
                return (
                  <Pressable
                    key={item}
                    onPress={() => setFiltro(item)}
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

            {emptyTareas ? (
              <View style={styles.WorkScreenEmptyCard}>
                <Text style={styles.WorkScreenEmptyEmblema}>✅</Text>
                <Text style={styles.WorkScreenEmptyTitle}>No tasks yet</Text>
                <Text style={styles.WorkScreenEmptyHintFiligrana}>
                  Plan your first job to get started.
                </Text>
                <PrimaryButton
                  label="+ Add Task"
                  onPress={onAddTarea}
                  style={styles.WorkScreenEmptyBtn}
                />
              </View>
            ) : (
              filtered.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onPress={() => onOpenTarea(task.id)}
                />
              ))
            )}
          </>
        ) : (
          <CalendarPanel
            year={viewAnio}
            monthIndice={viewMes}
            selectedDia={selectedDia}
            onSelectDia={setSelectedDia}
            onPrevMes={() => shiftMes(-1)}
            onNextMes={() => shiftMes(1)}
            dots={calendarPuntos}
            dayTareas={dayTareas}
            onOpenTarea={onOpenTarea}
            onAddTarea={onAddTarea}
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
      : colors.bodyApagado;

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
            <Text style={styles.WorkScreenTaskType}>{task.workTipo}</Text>
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
  const label = statusEtiqueta(status);
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
        tone === 'info' && { backgroundColor: colors.infoSuave },
        tone === 'danger' && { backgroundColor: colors.dangerSuave },
        tone === 'success' && { backgroundColor: colors.successSuave },
        tone === 'muted' && { backgroundColor: colors.plannedSuave },
      ]}
    >
      <Text
        style={[
          styles.WorkScreenStatusChipLabel,
          tone === 'info' && { color: colors.info },
          tone === 'danger' && { color: colors.danger },
          tone === 'success' && { color: colors.success },
          tone === 'muted' && { color: colors.bodyApagado },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

function CalendarPanel({
  year,
  monthIndice,
  selectedDia,
  onSelectDia,
  onPrevMes,
  onNextMes,
  dots,
  dayTareas,
  onOpenTarea,
  onAddTarea,
}: {
  year: number;
  monthIndice: number;
  selectedDia: number;
  onSelectDia: (day: number) => void;
  onPrevMes: () => void;
  onNextMes: () => void;
  dots: Record<number, 'overdue' | 'gold' | 'info'>;
  dayTareas: WorkTask[];
  onOpenTarea: (id: string) => void;
  onAddTarea: () => void;
}) {
  const startDesfase = monthStartDesfase(year, monthIndice);
  const totalDias = daysInMes(year, monthIndice);
  const monthEtiqueta = formatMonthAnio(year, monthIndice);
  const dayEtiqueta = formatMonthDia(monthIndice, selectedDia);
  const cells: Array<number | null> = [];
  for (let i = 0; i < startDesfase; i += 1) {
    cells.push(null);
  }
  for (let d = 1; d <= totalDias; d += 1) {
    cells.push(d);
  }

  return (
    <View>
      <View style={styles.WorkScreenCalendarCard}>
        <View style={styles.WorkScreenCalendarHeader}>
          <Pressable onPress={onPrevMes} hitSlop={10}>
            <Text style={styles.WorkScreenCalendarArrow}>‹</Text>
          </Pressable>
          <Text style={styles.WorkScreenCalendarMonth}>{monthEtiqueta}</Text>
          <Pressable onPress={onNextMes} hitSlop={10}>
            <Text style={styles.WorkScreenCalendarArrow}>›</Text>
          </Pressable>
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
            const selected = day === selectedDia;
            const dot = dots[day];
            return (
              <Pressable
                key={day}
                onPress={() => onSelectDia(day)}
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
        <Text style={styles.WorkScreenDayTitle}>{dayEtiqueta}</Text>
        <Text style={styles.WorkScreenDayCount}>
          {dayTareas.length} task{dayTareas.length === 1 ? '' : 's'}
        </Text>
      </View>

      {dayTareas.length === 0 ? (
        <View style={styles.WorkScreenEmptyCard}>
          <Text style={styles.WorkScreenEmptyEmblema}>🗓️</Text>
          <Text style={styles.WorkScreenEmptyTitle}>No tasks on this day</Text>
          <Text style={styles.WorkScreenEmptyHintFiligrana}>
            Tap + to schedule work for {dayEtiqueta}.
          </Text>
          <PrimaryButton
            label="+ Add Task"
            onPress={onAddTarea}
            style={styles.WorkScreenEmptyBtn}
          />
        </View>
      ) : (
        dayTareas.map(task => (
          <Pressable
            key={task.id}
            onPress={() => onOpenTarea(task.id)}
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
  WorkScreenRaizCasco: { backgroundColor: colors.background, flex: 1 },
  WorkScreenScrollContent: { flexGrow: 1 },

  WorkScreenHeaderRowDintel: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },

  WorkScreenTitleFiligrana: {
    color: colors.cream,
    fontFamily: fonts.sansBold,
    fontSize: 24,
    fontWeight: '700',
  },

  WorkScreenAddOrbe: {
    alignItems: 'center',
    borderRadius: 12,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },

  WorkScreenAddMarca: {
    color: colors.buttonText,
    fontFamily: fonts.sansBold,
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 24,
  },
  WorkScreenSegCasco: {
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
    color: colors.bodyApagado,
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
    color: colors.bodyApagado,
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
    color: colors.bodyApagado,
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
    color: colors.bodyApagado,
    fontFamily: fonts.sansRegular,
    fontSize: 11,
    marginTop: 2,
  },
  WorkScreenTaskMeta: {
    color: colors.bodyApagado,
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
    backgroundColor: colors.emptyRelleno,
    borderColor: colors.emptyBorde,
    borderRadius: radius.card,
    borderStyle: 'dashed',
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 28,
  },

  WorkScreenEmptyEmblema: { fontSize: 34 },
  WorkScreenEmptyTitle: {
    color: colors.cream,
    fontFamily: fonts.sansBold,
    fontSize: 16,
    fontWeight: '700',
    marginTop: 10,
  },

  WorkScreenEmptyHintFiligrana: {
    color: colors.bodyApagado,
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
    color: colors.bodyApagado,
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
    color: colors.bodyApagado,
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
    color: colors.bodyApagado,
    fontFamily: fonts.sansRegular,
    fontSize: 12,
    marginTop: 2,
  },
});
