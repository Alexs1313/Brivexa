import React, { useMemo, useState } from 'react';
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

import { appBackground } from '../data/assets';
import {
  EXPENSE_CATEGORIES,
  FINANCE_SUMMARY,
  FARM_DEMO_BANNER,
  FARM_SECTIONS,
  SEASON_REPORT,
  equipmentTotals,
  inventoryTotals,
  type EquipmentStatus,
  type FarmEquipment,
  type FarmSection,
  type InventoryItem,
  type StockStatus,
} from '../data/farm';

import { useFarm } from '../data/FarmContext';
import { useAdaptive } from '../hooks/useAdaptive';

type FarmScreenProps = {
  onOpenItem: (itemId: string) => void;
  onAddItem: () => void;
  onOpenEquipment: (equipmentId: string) => void;
  onAddIncome: () => void;
  onOpenReport: () => void;
  toastMessage?: string | null;
};

export function FarmScreen({
  onOpenItem,
  onAddItem,
  onOpenEquipment,
  onAddIncome,
  onOpenReport,
  toastMessage,
}: FarmScreenProps) {
  const insets = useSafeAreaInsets();
  const adaptive = useAdaptive();
  const [section, setSection] = useState<FarmSection>('Inventory');

  return (
    <ImageBackground
      source={appBackground}
      style={styles.FarmScreenFacetChassis}
      resizeMode="cover"
    >
      <ScrollView
        contentContainerStyle={[
          styles.FarmScreenScrollContent,
          {
            paddingTop: insets.top + adaptive.verticalScale(8),
            paddingBottom: adaptive.verticalScale(110),
            paddingHorizontal: adaptive.horizontalPadding,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.FarmScreenTitleFiligree}>Farm</Text>

        <View style={styles.FarmScreenSectionRowLintel}>
          {FARM_SECTIONS.map(item => {
            const active = item === section;
            return (
              <Pressable
                key={item}
                onPress={() => setSection(item)}
                style={[
                  styles.FarmScreenSectionChip,
                  active
                    ? styles.FarmScreenSectionChipActive
                    : styles.FarmScreenSectionChipIdle,
                ]}
              >
                <Text
                  style={[
                    styles.FarmScreenSectionChipLabel,
                    active && styles.FarmScreenSectionChipLabelActive,
                  ]}
                >
                  {item}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {section === 'Inventory' ? (
          <InventorySection onOpenItem={onOpenItem} onAddItem={onAddItem} />
        ) : null}
        {section === 'Equipment' ? (
          <EquipmentSection onOpenEquipment={onOpenEquipment} />
        ) : null}
        {section === 'Finance' ? (
          <FinanceSection onAddIncome={onAddIncome} />
        ) : null}
        {section === 'Reports' ? (
          <ReportsSection onOpenReport={onOpenReport} />
        ) : null}
      </ScrollView>

      {toastMessage ? (
        <View
          style={[
            styles.FarmScreenToastChassis,
            { bottom: insets.bottom + adaptive.verticalScale(92) },
          ]}
        >
          <Text style={styles.FarmScreenToastCheck}>✓</Text>
          <Text style={styles.FarmScreenToastFiligree}>{toastMessage}</Text>
        </View>
      ) : null}
    </ImageBackground>
  );
}

function InventorySection({
  onOpenItem,
  onAddItem,
}: {
  onOpenItem: (itemId: string) => void;
  onAddItem: () => void;
}) {
  const { inventory: items, isInventoryDemo } = useFarm();
  const totals = useMemo(() => inventoryTotals(items), [items]);

  if (items.length === 0) {
    return (
      <View style={styles.FarmScreenEmptyChassis}>
        <Text style={styles.FarmScreenEmptyEmoji}>📦</Text>
        <Text style={styles.FarmScreenEmptyTitle}>No inventory items yet</Text>
        <Text style={styles.FarmScreenEmptyBody}>
          Add seeds, fertilizer, fuel and parts to track stock.
        </Text>
        <PrimaryButton
          label="+ Add Item"
          onPress={onAddItem}
          style={styles.FarmScreenEmptyBtn}
        />
      </View>
    );
  }

  return (
    <View>
      {isInventoryDemo ? (
        <View style={styles.FarmScreenDemoBannerChassis}>
          <Text style={styles.FarmScreenDemoBannerSigil}>ℹ️</Text>
          <Text style={styles.FarmScreenDemoBannerFiligree}>
            {FARM_DEMO_BANNER}
          </Text>
        </View>
      ) : null}

      <View style={styles.FarmScreenStatRow}>
        <View style={styles.FarmScreenStatCard}>
          <Text style={styles.FarmScreenStatLabel}>Total Value</Text>
          <Text style={styles.FarmScreenStatValueGold}>
            {totals.totalValueLabel}
          </Text>
        </View>
        <View style={styles.FarmScreenStatCard}>
          <Text style={styles.FarmScreenStatLabel}>Needs Attention</Text>
          <Text style={styles.FarmScreenStatValueWarn}>
            {totals.needsAttention}
          </Text>
        </View>
      </View>

      <View style={styles.FarmScreenSectionHeaderLintel}>
        <Text style={styles.FarmScreenSectionTitleFiligree}>Items</Text>
        <Pressable onPress={onAddItem} hitSlop={8}>
          <Text style={styles.FarmScreenSectionActionFiligree}>+ Add Item</Text>
        </Pressable>
      </View>

      <View style={styles.FarmScreenListStack}>
        {items.map(item => (
          <InventoryCard
            key={item.id}
            item={item}
            onPress={() => onOpenItem(item.id)}
          />
        ))}
      </View>
    </View>
  );
}

function InventoryCard({
  item,
  onPress,
}: {
  item: InventoryItem;
  onPress: () => void;
}) {
  const barColor =
    item.status === 'Available'
      ? colors.success
      : item.status === 'Low Stock'
      ? colors.priorityHigh
      : colors.danger;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.FarmScreenCard,
        pressed && styles.FarmScreenPressedDim,
      ]}
    >
      <View style={styles.FarmScreenCardTopRow}>
        <View style={styles.FarmScreenFlexEnclave}>
          <Text style={styles.FarmScreenCardTitle}>{item.name}</Text>
          <Text style={styles.FarmScreenCardSubtitle}>{item.category}</Text>
        </View>
        <StockPill status={item.status} />
      </View>
      <View style={styles.FarmScreenQtyRow}>
        <Text>
          <Text style={styles.FarmScreenQtyPrimary}>{item.quantityLabel}</Text>
          <Text
            style={styles.FarmScreenQtySecondary}
          >{` / ${item.minLabel}`}</Text>
        </Text>
        <Text style={styles.FarmScreenPriceLabel}>{item.priceLabel}</Text>
      </View>
      <View style={styles.FarmScreenProgressTrack}>
        <View
          style={[
            styles.FarmScreenProgressFill,
            {
              backgroundColor: barColor,
              width: `${Math.max(
                item.progress * 100,
                item.progress > 0 ? 2 : 0,
              )}%`,
            },
          ]}
        />
      </View>
    </Pressable>
  );
}

function EquipmentSection({
  onOpenEquipment,
}: {
  onOpenEquipment: (equipmentId: string) => void;
}) {
  const { equipment, addEquipment, isEquipmentDemo } = useFarm();
  const totals = equipmentTotals(equipment);

  if (equipment.length === 0) {
    return (
      <View style={styles.FarmScreenEmptyChassis}>
        <Text style={styles.FarmScreenEmptyEmoji}>🚜</Text>
        <Text style={styles.FarmScreenEmptyTitle}>No equipment yet</Text>
        <Text style={styles.FarmScreenEmptyBody}>
          Add tractors, harvesters and sprayers to track hours and service.
        </Text>
        <PrimaryButton
          label="+ Add Equipment"
          onPress={() => {
            const item = addEquipment();
            onOpenEquipment(item.id);
          }}
          style={styles.FarmScreenEmptyBtn}
        />
      </View>
    );
  }

  return (
    <View>
      {isEquipmentDemo ? (
        <View style={styles.FarmScreenDemoBannerChassis}>
          <Text style={styles.FarmScreenDemoBannerSigil}>ℹ️</Text>
          <Text style={styles.FarmScreenDemoBannerFiligree}>
            {FARM_DEMO_BANNER}
          </Text>
        </View>
      ) : null}

      <View style={styles.FarmScreenEquipStatRow}>
        <View style={styles.FarmScreenEquipStatCard}>
          <Text style={styles.FarmScreenEquipStatValueSuccess}>
            {totals.available}
          </Text>
          <Text style={styles.FarmScreenEquipStatLabel}>Available</Text>
        </View>
        <View style={styles.FarmScreenEquipStatCard}>
          <Text style={styles.FarmScreenEquipStatValueInfo}>
            {totals.inUse}
          </Text>
          <Text style={styles.FarmScreenEquipStatLabel}>In Use</Text>
        </View>
        <View style={styles.FarmScreenEquipStatCard}>
          <Text style={styles.FarmScreenEquipStatValueWarn}>
            {totals.service}
          </Text>
          <Text style={styles.FarmScreenEquipStatLabel}>Service</Text>
        </View>
      </View>

      <View style={styles.FarmScreenSectionHeaderLintel}>
        <Text style={styles.FarmScreenSectionTitleFiligree}>Machines</Text>
        <Pressable
          onPress={() => {
            const item = addEquipment();
            onOpenEquipment(item.id);
          }}
          hitSlop={8}
        >
          <Text style={styles.FarmScreenSectionActionFiligree}>+ Add</Text>
        </Pressable>
      </View>

      <View style={styles.FarmScreenListStack}>
        {equipment.map(item => (
          <EquipmentCard
            key={item.id}
            item={item}
            onPress={() => onOpenEquipment(item.id)}
          />
        ))}
      </View>
    </View>
  );
}

function EquipmentCard({
  item,
  onPress,
}: {
  item: FarmEquipment;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.FarmScreenEquipCard,
        pressed && styles.FarmScreenPressedDim,
      ]}
    >
      <View style={styles.FarmScreenEquipIcon}>
        <Text style={styles.FarmScreenEquipIconGlyph}>{item.icon}</Text>
      </View>
      <View style={styles.FarmScreenEquipBody}>
        <View style={styles.FarmScreenCardTopRow}>
          <Text style={styles.FarmScreenCardTitle}>{item.name}</Text>
          <EquipmentPill status={item.status} />
        </View>
        <Text style={styles.FarmScreenCardSubtitle}>
          {item.type} · {item.hoursLabel}
        </Text>
        {item.serviceAlert ? (
          <Text style={styles.FarmScreenServiceAlert}>{item.serviceAlert}</Text>
        ) : null}
        {item.assignedField ? (
          <Text style={styles.FarmScreenAssignedLine}>
            Assigned to {item.assignedField}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

function FinanceSection({ onAddIncome }: { onAddIncome: () => void }) {
  const { transactions, isTransactionsDemo } = useFarm();

  return (
    <View>
      {isTransactionsDemo ? (
        <View style={styles.FarmScreenDemoBannerChassis}>
          <Text style={styles.FarmScreenDemoBannerSigil}>ℹ️</Text>
          <Text style={styles.FarmScreenDemoBannerFiligree}>
            {FARM_DEMO_BANNER}
          </Text>
        </View>
      ) : null}

      <View style={styles.FarmScreenProfitCard}>
        <Text style={styles.FarmScreenStatLabel}>Net Profit · This Season</Text>
        <Text style={styles.FarmScreenProfitValue}>
          {FINANCE_SUMMARY.netProfitLabel}
        </Text>
        <View style={styles.FarmScreenProfitMetaRow}>
          <View>
            <Text style={styles.FarmScreenMetaLabel}>Income</Text>
            <Text style={styles.FarmScreenMetaValue}>
              {FINANCE_SUMMARY.incomeLabel}
            </Text>
          </View>
          <View>
            <Text style={styles.FarmScreenMetaLabel}>Expenses</Text>
            <Text style={styles.FarmScreenMetaValueDanger}>
              {FINANCE_SUMMARY.expensesLabel}
            </Text>
          </View>
          <View>
            <Text style={styles.FarmScreenMetaLabel}>Cost / ha</Text>
            <Text style={styles.FarmScreenMetaValue}>
              {FINANCE_SUMMARY.costPerHaLabel}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.FarmScreenExpenseCard}>
        <Text style={styles.FarmScreenExpenseTitle}>Expenses by Category</Text>
        {EXPENSE_CATEGORIES.map(cat => (
          <View key={cat.id} style={styles.FarmScreenExpenseRow}>
            <View style={styles.FarmScreenExpenseLabelRow}>
              <Text style={styles.FarmScreenExpenseLabel}>{cat.label}</Text>
              <Text style={styles.FarmScreenExpenseAmount}>
                {cat.amountLabel}
              </Text>
            </View>
            <View style={styles.FarmScreenProgressTrackTall}>
              <View
                style={[
                  styles.FarmScreenProgressFill,
                  {
                    backgroundColor: cat.color,
                    width: `${cat.progress * 100}%`,
                  },
                ]}
              />
            </View>
          </View>
        ))}
      </View>

      <View style={styles.FarmScreenSectionHeaderLintel}>
        <Text style={styles.FarmScreenSectionTitleFiligree}>Transactions</Text>
        <Pressable onPress={onAddIncome} hitSlop={8}>
          <Text style={styles.FarmScreenSectionActionFiligree}>+ Add</Text>
        </Pressable>
      </View>

      {transactions.length === 0 ? (
        <View style={styles.FarmScreenEmptyChassis}>
          <Text style={styles.FarmScreenEmptyEmoji}>💵</Text>
          <Text style={styles.FarmScreenEmptyTitle}>No transactions yet</Text>
          <Text style={styles.FarmScreenEmptyBody}>
            Add income to start tracking farm finances.
          </Text>
          <PrimaryButton
            label="+ Add Income"
            onPress={onAddIncome}
            style={styles.FarmScreenEmptyBtn}
          />
        </View>
      ) : (
        <View style={styles.FarmScreenListStack}>
          {transactions.map(tx => (
            <View key={tx.id} style={styles.FarmScreenTxCard}>
              <View
                style={[
                  styles.FarmScreenTxIcon,
                  tx.kind === 'income'
                    ? styles.FarmScreenTxIconIncome
                    : styles.FarmScreenTxIconExpense,
                ]}
              >
                <Text style={styles.FarmScreenTxIconGlyph}>{tx.icon}</Text>
              </View>
              <View style={styles.FarmScreenFlexEnclave}>
                <Text style={styles.FarmScreenTxTitle}>{tx.title}</Text>
                <Text style={styles.FarmScreenCardSubtitle}>{tx.subtitle}</Text>
              </View>
              <Text
                style={[
                  styles.FarmScreenTxAmount,
                  tx.kind === 'income'
                    ? styles.FarmScreenTxAmountIncome
                    : styles.FarmScreenTxAmountExpense,
                ]}
              >
                {tx.amountLabel}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

function ReportsSection({ onOpenReport }: { onOpenReport: () => void }) {
  return (
    <Pressable
      onPress={onOpenReport}
      style={({ pressed }) => [
        styles.FarmScreenReportCard,
        pressed && styles.FarmScreenPressedDim,
      ]}
    >
      <Text style={styles.FarmScreenReportTitle}>{SEASON_REPORT.title}</Text>
      <Text style={styles.FarmScreenCardSubtitle}>
        {SEASON_REPORT.subtitle}
      </Text>
      <View style={styles.FarmScreenReportMetrics}>
        <Text style={styles.FarmScreenMetaLabel}>Net Profit</Text>
        <Text style={styles.FarmScreenProfitValueCompact}>$33,600</Text>
      </View>
      <Text style={styles.FarmScreenReportCta}>View full report →</Text>
    </Pressable>
  );
}

function StockPill({ status }: { status: StockStatus }) {
  const tone =
    status === 'Available'
      ? 'success'
      : status === 'Low Stock'
      ? 'warn'
      : 'danger';
  return (
    <View
      style={[
        styles.FarmScreenPill,
        tone === 'success' && styles.FarmScreenPillSuccess,
        tone === 'warn' && styles.FarmScreenPillWarn,
        tone === 'danger' && styles.FarmScreenPillDanger,
      ]}
    >
      <Text
        style={[
          styles.FarmScreenPillLabel,
          tone === 'success' && { color: colors.success },
          tone === 'warn' && { color: colors.priorityHigh },
          tone === 'danger' && { color: colors.danger },
        ]}
      >
        ● {status}
      </Text>
    </View>
  );
}

function EquipmentPill({ status }: { status: EquipmentStatus }) {
  const tone =
    status === 'Available' ? 'success' : status === 'In Use' ? 'info' : 'warn';
  return (
    <View
      style={[
        styles.FarmScreenPill,
        tone === 'success' && styles.FarmScreenPillSuccess,
        tone === 'info' && styles.FarmScreenPillInfo,
        tone === 'warn' && styles.FarmScreenPillWarn,
      ]}
    >
      <Text
        style={[
          styles.FarmScreenPillLabel,
          tone === 'success' && { color: colors.success },
          tone === 'info' && { color: colors.info },
          tone === 'warn' && { color: colors.priorityHigh },
        ]}
      >
        {status}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  FarmScreenFacetChassis: {
    backgroundColor: colors.background,
    flex: 1,
  },
  FarmScreenScrollContent: {
    flexGrow: 1,
  },

  FarmScreenTitleFiligree: {
    color: colors.cream,
    fontFamily: fonts.sansBold,
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 14,
  },

  FarmScreenSectionRowLintel: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  FarmScreenSectionChip: {
    borderRadius: 20,
    height: 31,
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  FarmScreenSectionChipActive: {
    backgroundColor: colors.goldSoft,
  },
  FarmScreenSectionChipIdle: {
    backgroundColor: colors.plannedSoft,
  },
  FarmScreenSectionChipLabel: {
    color: colors.bodyMuted,
    fontFamily: fonts.sansBold,
    fontSize: 13,
    fontWeight: '700',
  },
  FarmScreenSectionChipLabelActive: {
    color: colors.gold,
  },
  FarmScreenDemoBannerChassis: {
    backgroundColor: colors.infoBanner,
    borderColor: colors.infoBannerBorder,
    borderRadius: radius.card,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },

  FarmScreenDemoBannerSigil: {
    fontSize: 16,
    marginTop: 2,
  },
  FarmScreenDemoBannerFiligree: {
    color: colors.infoBannerText,
    flex: 1,
    fontFamily: fonts.sansRegular,
    fontSize: 13,
    lineHeight: 18,
  },

  FarmScreenStatRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 18,
  },

  FarmScreenStatCard: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: radius.card,
    borderWidth: 1,
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  FarmScreenStatLabel: {
    color: colors.bodyMuted,
    fontFamily: fonts.sansRegular,
    fontSize: 12,
  },

  FarmScreenStatValueGold: {
    color: colors.gold,
    fontFamily: fonts.sansBold,
    fontSize: 22,
    fontWeight: '700',
    marginTop: 4,
  },

  FarmScreenStatValueWarn: {
    color: colors.priorityHigh,
    fontFamily: fonts.sansBold,
    fontSize: 22,
    fontWeight: '700',
    marginTop: 4,
  },
  FarmScreenSectionHeaderLintel: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  FarmScreenSectionTitleFiligree: {
    color: colors.cream,
    fontFamily: fonts.sansBold,
    fontSize: 16,
    fontWeight: '700',
  },

  FarmScreenSectionActionFiligree: {
    color: colors.gold,
    fontFamily: fonts.sansBold,
    fontSize: 13,
    fontWeight: '700',
  },
  FarmScreenListStack: {
    gap: 12,
  },

  FarmScreenCard: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: radius.card,
    borderWidth: 1,
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 14,
  },
  FarmScreenPressedDim: {
    opacity: 0.9,
  },
  FarmScreenCardTopRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  FarmScreenFlexEnclave: {
    flexShrink: 1,
  },
  FarmScreenCardTitle: {
    color: colors.cream,
    fontFamily: fonts.sansBold,
    fontSize: 15,
    fontWeight: '700',
  },
  FarmScreenCardSubtitle: {
    color: colors.bodyMuted,
    fontFamily: fonts.sansRegular,
    fontSize: 12,
    marginTop: 2,
  },
  FarmScreenQtyRow: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },

  FarmScreenQtyPrimary: {
    color: colors.cream,
    fontFamily: fonts.sansBold,
    fontSize: 18,
    fontWeight: '700',
  },
  FarmScreenQtySecondary: {
    color: colors.bodyMuted,
    fontFamily: fonts.sansRegular,
    fontSize: 12,
  },

  FarmScreenPriceLabel: {
    color: colors.body,
    fontFamily: fonts.sansRegular,
    fontSize: 12,
  },

  FarmScreenProgressTrack: {
    backgroundColor: colors.progressTrackDeep,
    borderRadius: 4,
    height: 7,
    marginTop: 10,
    overflow: 'hidden',
  },
  FarmScreenProgressTrackTall: {
    backgroundColor: colors.progressTrackDeep,
    borderRadius: 4,
    height: 8,
    marginTop: 5,
    overflow: 'hidden',
  },
  FarmScreenProgressFill: {
    borderRadius: 4,
    height: '100%',
  },
  FarmScreenPill: {
    alignSelf: 'flex-start',
    borderRadius: 20,
    paddingHorizontal: 9,
    paddingVertical: 3,
  },
  FarmScreenPillSuccess: {
    backgroundColor: colors.successSoft,
  },
  FarmScreenPillWarn: {
    backgroundColor: colors.prioritySoft,
  },
  FarmScreenPillDanger: {
    backgroundColor: colors.dangerSoft,
  },

  FarmScreenPillInfo: {
    backgroundColor: colors.infoSoft,
  },

  FarmScreenPillLabel: {
    fontFamily: fonts.sansBold,
    fontSize: 10,
    fontWeight: '700',
  },
  FarmScreenEmptyChassis: {
    alignItems: 'center',
    backgroundColor: colors.emptyFill,
    borderColor: colors.emptyBorder,
    borderRadius: radius.card,
    borderStyle: 'dashed',
    borderWidth: 1,
    marginTop: 8,
    paddingHorizontal: 24,
    paddingVertical: 40,
  },

  FarmScreenEmptyEmoji: {
    fontSize: 38,
    marginBottom: 12,
  },

  FarmScreenEmptyTitle: {
    color: colors.cream,
    fontFamily: fonts.sansBold,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },

  FarmScreenEmptyBody: {
    color: colors.bodyMuted,
    fontFamily: fonts.sansRegular,
    fontSize: 13,
    marginTop: 8,
    textAlign: 'center',
  },
  FarmScreenEmptyBtn: {
    marginTop: 18,
    minWidth: 130,
  },
  FarmScreenEquipStatRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  FarmScreenEquipStatCard: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: 1,
    flex: 1,
    paddingVertical: 12,
  },

  FarmScreenEquipStatValueSuccess: {
    color: colors.success,
    fontFamily: fonts.sansBold,
    fontSize: 21,
    fontWeight: '700',
  },
  FarmScreenEquipStatValueInfo: {
    color: colors.info,
    fontFamily: fonts.sansBold,
    fontSize: 21,
    fontWeight: '700',
  },

  FarmScreenEquipStatValueWarn: {
    color: colors.priorityHigh,
    fontFamily: fonts.sansBold,
    fontSize: 21,
    fontWeight: '700',
  },

  FarmScreenEquipStatLabel: {
    color: colors.bodyMuted,
    fontFamily: fonts.sansRegular,
    fontSize: 10,
    marginTop: 2,
  },
  FarmScreenEquipCard: {
    alignItems: 'flex-start',
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: radius.card,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 13,
    paddingHorizontal: 15,
    paddingVertical: 15,
  },

  FarmScreenEquipIcon: {
    alignItems: 'center',
    backgroundColor: colors.backButton,
    borderRadius: 12,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  FarmScreenEquipIconGlyph: {
    fontSize: 22,
  },

  FarmScreenEquipBody: {
    flex: 1,
  },

  FarmScreenServiceAlert: {
    color: colors.priorityHigh,
    fontFamily: fonts.sansRegular,
    fontSize: 11,
    marginTop: 4,
  },
  FarmScreenAssignedLine: {
    color: colors.bodyMuted,
    fontFamily: fonts.sansRegular,
    fontSize: 11,
    marginTop: 4,
  },

  FarmScreenProfitCard: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: radius.card,
    borderWidth: 1,
    marginBottom: 12,
    padding: 15,
  },
  FarmScreenProfitValue: {
    color: colors.success,
    fontFamily: fonts.sansBold,
    fontSize: 30,
    fontWeight: '700',
    marginTop: 4,
  },

  FarmScreenProfitValueCompact: {
    color: colors.success,
    fontFamily: fonts.sansBold,
    fontSize: 22,
    fontWeight: '700',
    marginTop: 4,
  },
  FarmScreenProfitMetaRow: {
    flexDirection: 'row',
    gap: 22,
    marginTop: 14,
  },
  FarmScreenMetaLabel: {
    color: colors.bodyMuted,
    fontFamily: fonts.sansRegular,
    fontSize: 11,
  },

  FarmScreenMetaValue: {
    color: colors.cream,
    fontFamily: fonts.sansBold,
    fontSize: 16,
    fontWeight: '700',
    marginTop: 2,
  },
  FarmScreenMetaValueDanger: {
    color: colors.expenseMoney,
    fontFamily: fonts.sansBold,
    fontSize: 16,
    fontWeight: '700',
    marginTop: 2,
  },

  FarmScreenExpenseCard: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: radius.card,
    borderWidth: 1,
    marginBottom: 18,
    padding: 15,
  },
  FarmScreenExpenseTitle: {
    color: colors.cream,
    fontFamily: fonts.sansBold,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 12,
  },

  FarmScreenExpenseRow: {
    marginBottom: 12,
  },

  FarmScreenExpenseLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  FarmScreenExpenseLabel: {
    color: colors.bodySoft,
    fontFamily: fonts.sansRegular,
    fontSize: 12,
  },
  FarmScreenExpenseAmount: {
    color: colors.body,
    fontFamily: fonts.sansRegular,
    fontSize: 12,
  },
  FarmScreenTxCard: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: radius.card,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 11,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },

  FarmScreenTxIcon: {
    alignItems: 'center',
    borderRadius: 11,
    height: 38,
    justifyContent: 'center',
    width: 38,
  },

  FarmScreenTxIconIncome: {
    backgroundColor: colors.successSoft,
  },
  FarmScreenTxIconExpense: {
    backgroundColor: colors.dangerSoft,
  },
  FarmScreenTxIconGlyph: {
    fontSize: 16,
  },

  FarmScreenTxTitle: {
    color: colors.cream,
    fontFamily: fonts.sansBold,
    fontSize: 14,
    fontWeight: '700',
  },
  FarmScreenTxAmount: {
    fontFamily: fonts.sansBold,
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },

  FarmScreenTxAmountIncome: {
    color: colors.success,
  },

  FarmScreenTxAmountExpense: {
    color: colors.expenseMoney,
  },
  FarmScreenReportCard: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: radius.card,
    borderWidth: 1,
    padding: 18,
  },
  FarmScreenReportTitle: {
    color: colors.cream,
    fontFamily: fonts.sansBold,
    fontSize: 18,
    fontWeight: '700',
  },

  FarmScreenReportMetrics: {
    marginTop: 16,
  },

  FarmScreenReportCta: {
    color: colors.gold,
    fontFamily: fonts.sansBold,
    fontSize: 14,
    fontWeight: '700',
    marginTop: 16,
  },
  FarmScreenToastChassis: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: colors.toastBg,
    borderColor: colors.emptyBorder,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 18,
    paddingVertical: 12,
    position: 'absolute',
  },

  FarmScreenToastCheck: {
    color: colors.success,
    fontFamily: fonts.sansRegular,
    fontSize: 14,
  },

  FarmScreenToastFiligree: {
    color: colors.cream,
    fontFamily: fonts.sansRegular,
    fontSize: 14,
  },
});
