import React, { useState } from 'react';
import {
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PrimaryButton } from '../components/buttons/PrimaryButton';

import { colors, fonts, radius } from '../constants/theme';

import { appBackground, fieldAssets } from '../data/assets';
import {
  TIMELINE_STEPS,
  type ActivityStatus,
  type FarmField,
  type FieldHarvest,
} from '../data/fields';
import { useFields } from '../data/FieldsContext';
import { useAdaptive } from '../hooks/useAdaptive';
import { StatusPill } from './FieldsScreen';

type FieldTab = 'Overview' | 'Activities' | 'Expenses' | 'Harvest';

type FieldDetailScreenProps = {
  fieldId: string;
  onBack: () => void;
  onEdit: () => void;
};

export function FieldDetailScreen({
  fieldId,
  onBack,
  onEdit,
}: FieldDetailScreenProps) {
  const insets = useSafeAreaInsets();
  const adaptive = useAdaptive();
  const {
    getField,
    removeField,
    cycleFieldStatus,
    addFieldActivity,
    addFieldExpense,
    recordHarvest,
    clearHarvest,
  } = useFields();
  const field = getField(fieldId);
  const [tab, setTab] = useState<FieldTab>('Overview');
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 2000);
  };

  if (!field) {
    return (
      <View style={styles.FieldDetailScreenMissingHull}>
        <Text style={styles.FieldDetailScreenMissingFlourish}>
          Field not found
        </Text>
        <Pressable onPress={onBack}>
          <Text style={styles.FieldDetailScreenNavLinkFlourish}>‹ Fields</Text>
        </Pressable>
      </View>
    );
  }

  const showCover = tab === 'Overview';

  return (
    <ImageBackground
      source={appBackground}
      style={styles.FieldDetailScreenRootHull}
      resizeMode="cover"
    >
      <ScrollView
        contentContainerStyle={[
          styles.FieldDetailScreenScrollContent,
          {
            paddingTop: insets.top + adaptive.verticalScale(6),
            paddingBottom: insets.bottom + adaptive.verticalScale(28),
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.FieldDetailScreenHeaderRowCapstone}>
          <Pressable
            onPress={onBack}
            hitSlop={12}
            style={styles.FieldDetailScreenNavSide}
          >
            <Text style={styles.FieldDetailScreenNavLinkFlourish}>
              ‹ Fields
            </Text>
          </Pressable>
          <Text style={styles.FieldDetailScreenNavTitleFlourish}>Field</Text>
          <Pressable
            onPress={onEdit}
            hitSlop={12}
            style={styles.FieldDetailScreenNavSideRight}
          >
            <Text style={styles.FieldDetailScreenNavLinkBoldFlourish}>
              Edit
            </Text>
          </Pressable>
        </View>

        <View style={{ paddingHorizontal: adaptive.horizontalPadding }}>
          {showCover ? <FieldCover field={field} /> : null}

          <View style={styles.FieldDetailScreenTitleRow}>
            <Text style={styles.FieldDetailScreenFieldNameFlourish}>
              {field.name}
            </Text>
            <Text style={styles.FieldDetailScreenFieldAreaFlourish}>
              {field.areaLabel}
            </Text>
          </View>
          {showCover ? (
            <Text style={styles.FieldDetailScreenCropLine}>
              {field.crop} — {field.variety}
            </Text>
          ) : null}

          <SegmentedTabs active={tab} onChange={setTab} />

          {tab === 'Overview' ? (
            <OverviewTab
              field={field}
              onChangeStatus={() => {
                const next = cycleFieldStatus(fieldId);
                showToast(`Status → ${next}`);
              }}
              onDelete={() => {
                removeField(fieldId);
                onBack();
              }}
            />
          ) : null}
          {tab === 'Activities' ? (
            <ActivitiesTab
              field={field}
              onAddActivity={() => {
                addFieldActivity(fieldId);
                showToast('Activity added');
              }}
            />
          ) : null}
          {tab === 'Expenses' ? (
            <ExpensesTab
              field={field}
              onAddExpense={() => {
                addFieldExpense(fieldId);
                showToast('Expense added');
              }}
            />
          ) : null}
          {tab === 'Harvest' ? (
            <HarvestTab
              harvest={field.harvest}
              onRecord={() => {
                recordHarvest(fieldId);
                showToast('Harvest recorded');
              }}
              onEdit={() => {
                recordHarvest(fieldId);
                showToast('Harvest updated');
              }}
              onDelete={() => {
                clearHarvest(fieldId);
                showToast('Harvest deleted');
              }}
            />
          ) : null}
        </View>
      </ScrollView>

      {toast ? (
        <View
          style={[
            styles.FieldDetailScreenToastHull,
            { bottom: insets.bottom + adaptive.verticalScale(24) },
          ]}
        >
          <Text style={styles.FieldDetailScreenToastFlourish}>{toast}</Text>
        </View>
      ) : null}
    </ImageBackground>
  );
}

function FieldCover({ field }: { field: FarmField }) {
  const cover =
    field.coverTone === 'ready'
      ? fieldAssets.coverReady
      : fieldAssets.coverGrowing;

  return (
    <ImageBackground
      source={cover}
      style={styles.FieldDetailScreenCover}
      imageStyle={styles.FieldDetailScreenCoverImage}
      resizeMode="cover"
    >
      <View style={styles.FieldDetailScreenCoverChipRow}>
        <StatusPill status={field.status} />
      </View>
    </ImageBackground>
  );
}

function SegmentedTabs({
  active,
  onChange,
}: {
  active: FieldTab;
  onChange: (tab: FieldTab) => void;
}) {
  const tabs: FieldTab[] = ['Overview', 'Activities', 'Expenses', 'Harvest'];
  return (
    <View style={styles.FieldDetailScreenSegHull}>
      {tabs.map(tab => {
        const on = tab === active;
        return (
          <Pressable
            key={tab}
            onPress={() => onChange(tab)}
            style={[
              styles.FieldDetailScreenSegItem,
              on && styles.FieldDetailScreenSegItemOn,
            ]}
          >
            <Text
              style={[
                styles.FieldDetailScreenSegLabel,
                on && styles.FieldDetailScreenSegLabelOn,
              ]}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.85}
            >
              {tab}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function OverviewTab({
  field,
  onChangeStatus,
  onDelete,
}: {
  field: FarmField;
  onChangeStatus: () => void;
  onDelete: () => void;
}) {
  const rows = [
    { label: 'Crop', value: field.crop },
    { label: 'Variety', value: field.variety },
    { label: 'Area', value: field.areaLabel },
    { label: 'Planting Date', value: field.plantingDate },
    {
      label: field.status === 'Harvested' ? 'Harvest Date' : 'Expected Harvest',
      value: field.expectedHarvest,
    },
    { label: 'Soil Type', value: field.soilType },
    {
      label: field.status === 'Harvested' ? 'Final Yield' : 'Est. Yield',
      value: field.estYield,
    },
    { label: 'Season Cost', value: field.seasonCost },
  ];

  return (
    <View>
      <View style={styles.FieldDetailScreenKvCard}>
        {rows.map((row, index) => (
          <View
            key={row.label}
            style={[
              styles.FieldDetailScreenKvRow,
              index < rows.length - 1 && styles.FieldDetailScreenKvRowDivider,
            ]}
          >
            <Text style={styles.FieldDetailScreenKvLabel}>{row.label}</Text>
            <Text style={styles.FieldDetailScreenKvValue}>{row.value}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.FieldDetailScreenSectionTitleFlourish}>
        Status Timeline
      </Text>
      <View style={styles.FieldDetailScreenTimelineRow}>
        {TIMELINE_STEPS.map((step, index) => {
          const done = index <= field.timelineIndex;
          return (
            <View key={step} style={styles.FieldDetailScreenTimelineCol}>
              <View style={styles.FieldDetailScreenTimelineTrack}>
                <View
                  style={[
                    styles.FieldDetailScreenTimelineFill,
                    done
                      ? styles.FieldDetailScreenTimelineFillOn
                      : styles.FieldDetailScreenTimelineFillOff,
                  ]}
                />
              </View>
              <Text
                style={[
                  styles.FieldDetailScreenTimelineLabel,
                  done
                    ? styles.FieldDetailScreenTimelineLabelOn
                    : styles.FieldDetailScreenTimelineLabelOff,
                ]}
              >
                {step}
              </Text>
            </View>
          );
        })}
      </View>

      <Pressable
        onPress={onChangeStatus}
        style={({ pressed }) => [
          styles.FieldDetailScreenGhostBtn,
          pressed && styles.FieldDetailScreenPressedDim,
        ]}
      >
        <Text style={styles.FieldDetailScreenGhostBtnLabel}>
          Change Field Status
        </Text>
      </Pressable>
      <Pressable
        onPress={onDelete}
        style={({ pressed }) => [
          styles.FieldDetailScreenDangerBtn,
          pressed && styles.FieldDetailScreenPressedDim,
        ]}
      >
        <Text style={styles.FieldDetailScreenDangerBtnLabel}>Delete Field</Text>
      </Pressable>
    </View>
  );
}

function ActivitiesTab({
  field,
  onAddActivity,
}: {
  field: FarmField;
  onAddActivity: () => void;
}) {
  return (
    <View>
      {field.activities.map(item => (
        <View key={item.id} style={styles.FieldDetailScreenActivityCard}>
          <View style={styles.FieldDetailScreenActivityAccent} />
          <View style={styles.FieldDetailScreenActivityBody}>
            <View style={styles.FieldDetailScreenActivityHeader}>
              <Text style={styles.FieldDetailScreenActivityTitle}>
                {item.title}
              </Text>
              <Text
                style={[
                  styles.FieldDetailScreenActivityStatus,
                  { color: activityColor(item.status) },
                ]}
              >
                {activityLabel(item.status)}
              </Text>
            </View>
            <Text style={styles.FieldDetailScreenActivityMeta}>
              {item.date} · {item.person} · {item.cost}
            </Text>
          </View>
        </View>
      ))}
      <Pressable
        onPress={onAddActivity}
        style={({ pressed }) => [
          styles.FieldDetailScreenGhostBtn,
          pressed && styles.FieldDetailScreenPressedDim,
        ]}
      >
        <Text style={styles.FieldDetailScreenGhostBtnLabel}>
          + Add Activity
        </Text>
      </Pressable>
    </View>
  );
}

function ExpensesTab({
  field,
  onAddExpense,
}: {
  field: FarmField;
  onAddExpense: () => void;
}) {
  return (
    <View>
      <View style={styles.FieldDetailScreenExpenseSummary}>
        <View>
          <Text style={styles.FieldDetailScreenExpenseSummaryLabel}>
            Total Expenses
          </Text>
          <Text style={styles.FieldDetailScreenExpenseSummaryTotal}>
            {field.expensesTotal}
          </Text>
        </View>
        <View style={styles.FieldDetailScreenExpenseSummaryRight}>
          <Text style={styles.FieldDetailScreenExpenseSummaryLabel}>
            Per Hectare
          </Text>
          <Text style={styles.FieldDetailScreenExpenseSummaryPerHa}>
            {field.expensesPerHa}
          </Text>
        </View>
      </View>
      {field.expenses.map(item => (
        <View key={item.id} style={styles.FieldDetailScreenExpenseCard}>
          <View style={styles.FieldDetailScreenExpenseCopy}>
            <Text style={styles.FieldDetailScreenExpenseTitle}>
              {item.title}
            </Text>
            <Text style={styles.FieldDetailScreenExpenseMeta}>
              {item.category} · {item.date}
            </Text>
          </View>
          <Text style={styles.FieldDetailScreenExpenseAmount}>
            {item.amount}
          </Text>
        </View>
      ))}
      <Pressable
        onPress={onAddExpense}
        style={({ pressed }) => [
          styles.FieldDetailScreenGhostBtn,
          pressed && styles.FieldDetailScreenPressedDim,
        ]}
      >
        <Text style={styles.FieldDetailScreenGhostBtnLabel}>+ Add Expense</Text>
      </Pressable>
    </View>
  );
}

function HarvestTab({
  harvest,
  onRecord,
  onEdit,
  onDelete,
}: {
  harvest: FieldHarvest;
  onRecord: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  if (harvest.kind === 'empty') {
    return (
      <View style={styles.FieldDetailScreenHarvestEmpty}>
        <Text style={styles.FieldDetailScreenHarvestEmptyIcon}>🌾</Text>
        <Text style={styles.FieldDetailScreenHarvestEmptyTitle}>
          No Harvest Record Yet
        </Text>
        <Text style={styles.FieldDetailScreenHarvestEmptyHint}>
          Expected: {harvest.expectedDate} · Est. yield {harvest.estimatedYield}
          {harvest.estimatedTotal ? ` · ${harvest.estimatedTotal}` : ''}
        </Text>
        <PrimaryButton
          label="Add Harvest Record"
          onPress={onRecord}
          style={styles.FieldDetailScreenHarvestEmptyBtn}
        />
      </View>
    );
  }

  const rows = [
    { label: 'Harvest Date', value: harvest.harvestDate },
    { label: 'Total Weight', value: harvest.totalWeight },
    { label: 'Yield per ha', value: harvest.yieldPerHa },
    { label: 'Moisture', value: harvest.moisture },
    { label: 'Sale Price', value: harvest.salePrice },
    {
      label: 'Total Revenue',
      value: harvest.totalRevenue,
      emphasize: true as const,
    },
  ];

  return (
    <View>
      <View style={styles.FieldDetailScreenKvCard}>
        {rows.map((row, index) => (
          <View
            key={row.label}
            style={[
              styles.FieldDetailScreenKvRow,
              index < rows.length - 1 && styles.FieldDetailScreenKvRowDivider,
            ]}
          >
            <Text style={styles.FieldDetailScreenKvLabel}>{row.label}</Text>
            <Text
              style={[
                styles.FieldDetailScreenKvValue,
                row.emphasize && styles.FieldDetailScreenRevenueValue,
              ]}
            >
              {row.value}
            </Text>
          </View>
        ))}
      </View>

      {harvest.notes ? (
        <View style={styles.FieldDetailScreenNotesCard}>
          <Text style={styles.FieldDetailScreenNotesTitle}>Notes</Text>
          <Text style={styles.FieldDetailScreenNotesBody}>{harvest.notes}</Text>
        </View>
      ) : null}

      <View style={styles.FieldDetailScreenHarvestActions}>
        <Pressable
          onPress={onEdit}
          style={({ pressed }) => [
            styles.FieldDetailScreenGhostBtn,
            styles.FieldDetailScreenHarvestActionHalf,
            pressed && styles.FieldDetailScreenPressedDim,
          ]}
        >
          <Text style={styles.FieldDetailScreenGhostBtnLabel}>
            Edit Harvest
          </Text>
        </Pressable>
        <Pressable
          onPress={onDelete}
          style={({ pressed }) => [
            styles.FieldDetailScreenDangerOutlineBtn,
            styles.FieldDetailScreenHarvestActionHalf,
            pressed && styles.FieldDetailScreenPressedDim,
          ]}
        >
          <Text style={styles.FieldDetailScreenDangerBtnLabel}>Delete</Text>
        </Pressable>
      </View>
    </View>
  );
}

function activityLabel(status: ActivityStatus) {
  if (status === 'completed') {
    return 'Completed';
  }
  if (status === 'in_progress') {
    return 'In Progress';
  }
  return 'Planned';
}

function activityColor(status: ActivityStatus) {
  if (status === 'completed') {
    return colors.success;
  }
  if (status === 'in_progress') {
    return colors.info;
  }
  return colors.bodyMuted;
}

const styles = StyleSheet.create({
  FieldDetailScreenRootHull: {
    backgroundColor: colors.background,
    flex: 1,
  },
  FieldDetailScreenPressedDim: {
    opacity: 0.88,
  },

  FieldDetailScreenToastHull: {
    alignSelf: 'center',
    backgroundColor: colors.toastBg,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    position: 'absolute',
  },

  FieldDetailScreenToastFlourish: {
    color: colors.cream,
    fontFamily: fonts.sansBold,
    fontSize: 13,
    fontWeight: '700',
  },
  FieldDetailScreenMissingHull: {
    alignItems: 'center',
    backgroundColor: colors.background,
    flex: 1,
    justifyContent: 'center',
    gap: 12,
  },

  FieldDetailScreenMissingFlourish: {
    color: colors.cream,
    fontFamily: fonts.sansBold,
    fontSize: 18,
  },

  FieldDetailScreenHeaderRowCapstone: {
    alignItems: 'center',
    borderBottomColor: colors.borderSoft,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
    paddingBottom: 10,
    paddingHorizontal: 16,
  },
  FieldDetailScreenNavSide: {
    minWidth: 72,
  },
  FieldDetailScreenNavSideRight: {
    alignItems: 'flex-end',
    minWidth: 72,
  },
  FieldDetailScreenNavLinkFlourish: {
    color: colors.gold,
    fontFamily: fonts.sansRegular,
    fontSize: 15,
  },

  FieldDetailScreenNavLinkBoldFlourish: {
    color: colors.gold,
    fontFamily: fonts.sansBold,
    fontSize: 14,
    fontWeight: '700',
  },

  FieldDetailScreenNavTitleFlourish: {
    color: colors.cream,
    fontFamily: fonts.sansBold,
    fontSize: 16,
    fontWeight: '700',
  },
  FieldDetailScreenScrollContent: {
    flexGrow: 1,
  },
  FieldDetailScreenCover: {
    alignItems: 'flex-start',
    height: 70,
    justifyContent: 'flex-end',
    marginBottom: 12,
    paddingBottom: 10,
    paddingHorizontal: 12,
  },
  FieldDetailScreenCoverImage: {
    borderRadius: 14,
  },

  FieldDetailScreenCoverChipRow: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    flexDirection: 'row',
  },
  FieldDetailScreenTitleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  FieldDetailScreenFieldNameFlourish: {
    color: colors.cream,
    flexShrink: 1,
    fontFamily: fonts.sansBold,
    fontSize: 22,
    fontWeight: '700',
    marginRight: 8,
  },

  FieldDetailScreenFieldAreaFlourish: {
    color: colors.gold,
    fontFamily: fonts.sansBold,
    fontSize: 16,
    fontWeight: '700',
  },
  FieldDetailScreenCropLine: {
    color: colors.bodyMuted,
    fontFamily: fonts.sansRegular,
    fontSize: 14,
    marginBottom: 12,
    marginTop: 4,
  },

  FieldDetailScreenSegHull: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: 14,
    marginTop: 12,
    padding: 4,
  },
  FieldDetailScreenSegItem: {
    alignItems: 'center',
    borderRadius: 9,
    flex: 1,
    height: 36,
    justifyContent: 'center',
    minWidth: 0,
    paddingHorizontal: 2,
  },
  FieldDetailScreenSegItemOn: {
    backgroundColor: colors.gold,
  },
  FieldDetailScreenSegLabel: {
    color: colors.bodyMuted,
    fontFamily: fonts.sansBold,
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },

  FieldDetailScreenSegLabelOn: {
    color: colors.buttonText,
  },

  FieldDetailScreenKvCard: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 18,
    overflow: 'hidden',
  },
  FieldDetailScreenKvRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  FieldDetailScreenKvRowDivider: {
    borderBottomColor: colors.borderSoft,
    borderBottomWidth: 1,
  },

  FieldDetailScreenKvLabel: {
    color: colors.bodyMuted,
    fontFamily: fonts.sansRegular,
    fontSize: 13,
  },

  FieldDetailScreenKvValue: {
    color: colors.cream,
    fontFamily: fonts.sansRegular,
    fontSize: 13,
    marginLeft: 12,
    textAlign: 'right',
  },
  FieldDetailScreenRevenueValue: {
    color: colors.success,
    fontFamily: fonts.sansBold,
    fontWeight: '700',
  },
  FieldDetailScreenSectionTitleFlourish: {
    color: colors.cream,
    fontFamily: fonts.sansBold,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 10,
  },

  FieldDetailScreenTimelineRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 3,
    marginBottom: 18,
  },

  FieldDetailScreenTimelineCol: {
    alignItems: 'center',
    flex: 1,
    minWidth: 0,
  },

  FieldDetailScreenTimelineTrack: {
    backgroundColor: '#160c3c',
    borderRadius: 4,
    height: 6,
    overflow: 'hidden',
    width: '100%',
  },
  FieldDetailScreenTimelineFill: {
    borderRadius: 4,
    height: 6,
  },
  FieldDetailScreenTimelineFillOn: {
    backgroundColor: colors.success,
    width: '100%',
  },
  FieldDetailScreenTimelineFillOff: {
    backgroundColor: colors.border,
    width: 0,
  },

  FieldDetailScreenTimelineLabel: {
    fontFamily: fonts.sansRegular,
    fontSize: 9,
    lineHeight: 11,
    marginTop: 5,
    textAlign: 'center',
    width: '100%',
  },

  FieldDetailScreenTimelineLabelOn: {
    color: colors.bodySoft,
  },
  FieldDetailScreenTimelineLabelOff: {
    color: colors.tabInactive,
  },
  FieldDetailScreenGhostBtn: {
    alignItems: 'center',
    backgroundColor: colors.backButton,
    borderColor: colors.backButtonBorder,
    borderRadius: 14,
    borderWidth: 1,
    height: 50,
    justifyContent: 'center',
    marginBottom: 12,
  },

  FieldDetailScreenGhostBtnLabel: {
    color: colors.gold,
    fontFamily: fonts.sansBold,
    fontSize: 15,
    fontWeight: '700',
  },

  FieldDetailScreenDangerBtn: {
    alignItems: 'center',
    backgroundColor: 'rgba(236, 91, 91, 0.1)',
    borderColor: 'rgba(236, 91, 91, 0.4)',
    borderRadius: 14,
    borderWidth: 1,
    height: 50,
    justifyContent: 'center',
  },
  FieldDetailScreenDangerOutlineBtn: {
    alignItems: 'center',
    backgroundColor: 'rgba(236, 91, 91, 0.1)',
    borderColor: 'rgba(236, 91, 91, 0.4)',
    borderRadius: 14,
    borderWidth: 1,
    height: 50,
    justifyContent: 'center',
  },
  FieldDetailScreenDangerBtnLabel: {
    color: colors.danger,
    fontFamily: fonts.sansBold,
    fontSize: 15,
    fontWeight: '700',
  },

  FieldDetailScreenActivityCard: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: radius.card,
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: 12,
    overflow: 'hidden',
  },

  FieldDetailScreenActivityAccent: {
    backgroundColor: colors.border,
    width: 3,
  },
  FieldDetailScreenActivityBody: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 15,
  },

  FieldDetailScreenActivityHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  FieldDetailScreenActivityTitle: {
    color: colors.cream,
    flexShrink: 1,
    fontFamily: fonts.sansBold,
    fontSize: 14,
    fontWeight: '700',
    marginRight: 8,
  },

  FieldDetailScreenActivityStatus: {
    fontFamily: fonts.sansBold,
    fontSize: 11,
    fontWeight: '700',
  },

  FieldDetailScreenActivityMeta: {
    color: colors.bodyMuted,
    fontFamily: fonts.sansRegular,
    fontSize: 12,
    marginTop: 6,
  },

  FieldDetailScreenExpenseSummary: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: radius.card,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  FieldDetailScreenExpenseSummaryLabel: {
    color: colors.bodyMuted,
    fontFamily: fonts.sansRegular,
    fontSize: 12,
  },

  FieldDetailScreenExpenseSummaryTotal: {
    color: colors.expenseMoney,
    fontFamily: fonts.sansBold,
    fontSize: 24,
    fontWeight: '700',
    marginTop: 2,
  },

  FieldDetailScreenExpenseSummaryRight: {
    alignItems: 'flex-end',
  },
  FieldDetailScreenExpenseSummaryPerHa: {
    color: colors.cream,
    fontFamily: fonts.sansBold,
    fontSize: 24,
    fontWeight: '700',
    marginTop: 2,
  },
  FieldDetailScreenExpenseCard: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: radius.card,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  FieldDetailScreenExpenseCopy: {
    flex: 1,
    marginRight: 12,
  },

  FieldDetailScreenExpenseTitle: {
    color: colors.cream,
    fontFamily: fonts.sansBold,
    fontSize: 14,
    fontWeight: '700',
  },

  FieldDetailScreenExpenseMeta: {
    color: colors.bodyMuted,
    fontFamily: fonts.sansRegular,
    fontSize: 12,
    marginTop: 2,
  },
  FieldDetailScreenExpenseAmount: {
    color: colors.expenseMoney,
    fontFamily: fonts.sansBold,
    fontSize: 16,
    fontWeight: '700',
  },

  FieldDetailScreenHarvestEmpty: {
    alignItems: 'center',
    backgroundColor: colors.emptyFill,
    borderColor: colors.emptyBorder,
    borderRadius: radius.card,
    borderStyle: 'dashed',
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 28,
  },

  FieldDetailScreenHarvestEmptyIcon: {
    fontSize: 36,
  },
  FieldDetailScreenHarvestEmptyTitle: {
    color: colors.cream,
    fontFamily: fonts.sansBold,
    fontSize: 16,
    fontWeight: '700',
    marginTop: 10,
  },
  FieldDetailScreenHarvestEmptyHint: {
    color: colors.bodyMuted,
    fontFamily: fonts.sansRegular,
    fontSize: 13,
    marginBottom: 16,
    marginTop: 6,
    textAlign: 'center',
  },

  FieldDetailScreenHarvestEmptyBtn: {
    minWidth: 180,
  },

  FieldDetailScreenNotesCard: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 14,
    padding: 14,
  },

  FieldDetailScreenNotesTitle: {
    color: colors.cream,
    fontFamily: fonts.sansBold,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 6,
  },
  FieldDetailScreenNotesBody: {
    color: colors.bodyMuted,
    fontFamily: fonts.sansRegular,
    fontSize: 13,
    lineHeight: 18,
  },

  FieldDetailScreenHarvestActions: {
    flexDirection: 'row',
    gap: 10,
  },

  FieldDetailScreenHarvestActionHalf: {
    flex: 1,
    marginBottom: 0,
  },
});
